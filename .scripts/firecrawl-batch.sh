#!/usr/bin/env bash

# Firecrawl batch scraper script
# Usage: ./firecrawl-batch.sh [-o|--output-dir <dir>] <url1> <url2> ...
# Automatically generates filenames based on page titles and dates
# Requires: FIRECRAWL_API_KEY environment variable

# Default output directory (overridden by .claude/vault-config.json when set)
OUTPUT_DIR=""
URLS=()

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -o|--output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        *)
            URLS+=("$1")
            shift
            ;;
    esac
done

if [ -z "$OUTPUT_DIR" ]; then
    CONFIG_SCRIPT="$(dirname "$0")/vault-config.js"
    OUTPUT_DIR=$(node "$CONFIG_SCRIPT" clippings 2>/dev/null || printf '%s' "00_Inbox/Clippings")
fi

if [ ${#URLS[@]} -eq 0 ]; then
    echo "Usage: $0 [-o|--output-dir <dir>] <url1> <url2> ..."
    echo "Default output directory: $OUTPUT_DIR"
    echo ""
    echo "Options:"
    echo "  -o, --output-dir <dir>  Specify custom output directory"
    exit 1
fi

if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "Error: FIRECRAWL_API_KEY environment variable not set"
    exit 1
fi

# Get today's date
TODAY=$(date +"%Y-%m-%d")
CLIPPINGS_DIR="$OUTPUT_DIR"

# Create clippings directory if it doesn't exist
mkdir -p "$CLIPPINGS_DIR"

# Function to sanitize filename (preserve CJK characters, only remove filesystem-illegal chars)
sanitize_filename() {
    echo "$1" | sed 's/[\/\\:*?"<>|]//g' | sed 's/ \+/ /g' | sed 's/^ *//;s/ *$//'
}

# Function to extract domain name for fallback
get_domain() {
    echo "$1" | sed -E 's|https?://([^/]+).*|\1|' | sed 's/www\.//'
}

# Counter for successful scrapes
SUCCESS_COUNT=0
FAIL_COUNT=0

# Process each URL
for URL in "${URLS[@]}"; do
    echo "Processing: $URL"
    
    # Make the API call and save to temp file
    TEMP_FILE=$(mktemp)
    
    REQUEST_BODY=$(jq -nc --arg url "$URL" '{url: $url, formats: ["markdown"], onlyMainContent: true}')
    if ! curl -fsS -X POST https://api.firecrawl.dev/v1/scrape \
      -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$REQUEST_BODY" > "$TEMP_FILE"; then
        echo "  âœ— Firecrawl request failed"
        rm -f "$TEMP_FILE"
        ((FAIL_COUNT++))
        continue
    fi
    
    # Extract markdown and title
    MARKDOWN=$(jq -r '.data.markdown // empty' "$TEMP_FILE")
    TITLE=$(jq -r '.data.metadata.title // empty' "$TEMP_FILE")
    
    # If no title, try to extract from markdown or use domain
    if [ -z "$TITLE" ] || [ "$TITLE" = "null" ]; then
        # Try to get first heading from markdown
        TITLE=$(echo "$MARKDOWN" | grep -m1 '^# ' | sed 's/^# //')
        
        # If still no title, use domain
        if [ -z "$TITLE" ]; then
            TITLE=$(get_domain "$URL")
        fi
    fi
    
    # Sanitize title for filename
    SAFE_TITLE=$(sanitize_filename "$TITLE")
    
    # Truncate title if too long
    if [ ${#SAFE_TITLE} -gt 60 ]; then
        SAFE_TITLE="${SAFE_TITLE:0:60}"
    fi
    
    # Create filename
    OUTPUT_FILE="$CLIPPINGS_DIR/$TODAY - $SAFE_TITLE.md"
    
    # Check if we got content
    if [ -n "$MARKDOWN" ] && [ "$MARKDOWN" != "null" ]; then
        # Add metadata header
        {
            echo "---"
            echo "source: $URL"
            echo "date: $TODAY"
            echo "title: \"$TITLE\""
            echo "---"
            echo ""
            echo "$MARKDOWN"
        } > "$OUTPUT_FILE"
        
        echo "  ✓ Saved to: $OUTPUT_FILE"
        ((SUCCESS_COUNT++))
    else
        echo "  ✗ Failed to scrape content"
        ((FAIL_COUNT++))
    fi
    
    # Clean up temp file
    rm -f "$TEMP_FILE"
    
    # Small delay to be nice to the API
    sleep 1
done

echo ""
echo "Batch scraping complete!"
echo "  Successful: $SUCCESS_COUNT"
echo "  Failed: $FAIL_COUNT"
