#!/bin/bash

# PDF Parallel Processor for Obsidian Vault
# Processes multiple PDFs concurrently for optimal performance
# Usage: ./pdf-parallel-processor.sh [max_parallel] [pdf_directory]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
MAX_PARALLEL=${1:-8}  # Default 8 parallel jobs (adjustable based on CPU cores)
PDF_DIR=${2:-"05 Attachments"}  # Default attachments directory
OUTPUT_MODE=${3:-"pages"}  # "pages" or "gemini" mode
SCRIPT_DIR="$(dirname "$0")"

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Check if required tools exist
if ! command -v node &> /dev/null; then
    print_color "$RED" "❌ Error: Node.js is required but not installed"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/pdf-to-images.mjs" ]; then
    print_color "$RED" "❌ Error: pdf-to-images.mjs not found in $SCRIPT_DIR"
    exit 1
fi

# Function to process a single PDF
process_pdf() {
    local pdf="$1"
    local pdf_basename=$(basename "$pdf" .pdf)
    local pdf_dir=$(dirname "$pdf")
    local output_dir="${pdf_dir}/${pdf_basename}-pages"

    # Run the conversion
    if node "$SCRIPT_DIR/pdf-to-images.mjs" "$pdf" "$output_dir" --scale 2.0 --format png &>/dev/null; then
        echo "  ✅ $(basename "$pdf")"

        # Generate index if successful
        if [ -d "$output_dir" ]; then
            local image_count=$(ls -1 "$output_dir"/*.png 2>/dev/null | wc -l)
            if [ "$image_count" -gt 0 ] && [ ! -f "$output_dir/00_Index.md" ]; then
                create_index "$pdf" "$output_dir" "$image_count"
            fi
        fi
    else
        echo "  ❌ Failed: $(basename "$pdf")"
        return 1
    fi
}

# Function to create index file
create_index() {
    local pdf_file="$1"
    local output_dir="$2"
    local image_count="$3"
    local pdf_basename=$(basename "$pdf_file" .pdf)
    local index_file="$output_dir/00_Index.md"

    {
        echo "# PDF Pages: $pdf_basename"
        echo ""
        echo "Source PDF: \`$pdf_file\`"
        echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Total Pages: $image_count"
        echo ""
        echo "## Pages"
        echo ""

        for img in "$output_dir"/page-*.png; do
            if [ -f "$img" ]; then
                img_name=$(basename "$img")
                page_num=${img_name#page-}
                page_num=${page_num%.png}
                page_num=$((10#$page_num))  # Remove leading zeros
                echo "### Page $page_num"
                echo "![[$(realpath --relative-to="$(pwd)" "$img")]]"
                echo ""
            fi
        done
    } > "$index_file"
}

# Main processing
print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_color "$GREEN" "🚀 PDF Parallel Processor"
print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count PDFs
PDF_COUNT=$(find "$PDF_DIR" -maxdepth 1 -name "*.pdf" -type f 2>/dev/null | wc -l)

if [ "$PDF_COUNT" -eq 0 ]; then
    print_color "$YELLOW" "⚠️  No PDF files found in $PDF_DIR"
    exit 0
fi

print_color "$BLUE" "📊 Configuration:"
echo "  • Directory: $PDF_DIR"
echo "  • PDFs found: $PDF_COUNT"
echo "  • Parallel workers: $MAX_PARALLEL"
echo "  • Estimated time: $((PDF_COUNT * 3 / MAX_PARALLEL)) seconds"
echo ""

print_color "$BLUE" "🔄 Processing PDFs..."
echo ""

# Track statistics
PROCESSED=0
FAILED=0
START_TIME=$(date +%s)

# Process PDFs in parallel
find "$PDF_DIR" -maxdepth 1 -name "*.pdf" -type f | while read -r pdf; do
    # Wait if we're at max parallel jobs
    while [ $(jobs -r | wc -l) -ge $MAX_PARALLEL ]; do
        sleep 0.1
    done

    # Launch in background
    (
        process_pdf "$pdf"
    ) &

    ((PROCESSED++)) || true

    # Progress indicator
    if [ $((PROCESSED % 5)) -eq 0 ]; then
        echo "  ⏳ Progress: $PROCESSED/$PDF_COUNT"
    fi
done

# Wait for all jobs to complete
wait

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_color "$GREEN" "✨ Processing Complete!"
print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_color "$BLUE" "📈 Statistics:"
echo "  • Processed: $PROCESSED PDFs"
echo "  • Time taken: ${DURATION} seconds"
echo "  • Average: $((DURATION * 1000 / PROCESSED))ms per PDF"
echo ""

# Generate summary for Gemini processing
if [ "$OUTPUT_MODE" = "gemini" ]; then
    IMAGE_DIRS_FILE="image-directories.txt"
    print_color "$BLUE" "📝 Generating image directory list..."
    find "$PDF_DIR" -type d -name "*-pages" > "$IMAGE_DIRS_FILE"
    echo "  • Saved to: $IMAGE_DIRS_FILE"
    echo ""
    print_color "$YELLOW" "💡 Next step: Run /pdf-gemini-analyze to process images"
fi

# Show largest PDFs (might need special handling)
print_color "$BLUE" "📊 Largest processed PDFs:"
find "$PDF_DIR" -type d -name "*-pages" -exec sh -c 'echo "$(ls -1 "$1"/*.png 2>/dev/null | wc -l) pages: $(basename "$1" -pages)"' _ {} \; | sort -rn | head -5

echo ""
print_color "$GREEN" "🎯 All done! Your PDFs have been converted to images."