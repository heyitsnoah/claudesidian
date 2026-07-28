#!/usr/bin/env bash

# Transcript extraction script for YouTube videos
# Usage: .scripts/transcript-extract.sh <youtube-url> [output-path]
# Default output comes from .claude/vault-config.json when available.

set -e

TEMP_DIR="$(mktemp -d)"
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

URL="$1"
CONFIG_SCRIPT="$(dirname "$0")/vault-config.js"
DEFAULT_OUTPUT=$(node "$CONFIG_SCRIPT" clippings 2>/dev/null || printf '%s' "00_Inbox/Clippings")
OUTPUT_PATH="${2:-$DEFAULT_OUTPUT}"

if [ -z "$URL" ]; then
    echo "Usage: $0 <youtube-url> [output-path]"
    echo "Default output path: $DEFAULT_OUTPUT"
    exit 1
fi

echo "🔍 Extracting transcript from: $URL"
echo "📁 Output path: $OUTPUT_PATH"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_PATH"

# Extract video ID and title
VIDEO_ID=$(yt-dlp --get-id "$URL")
TITLE=$(yt-dlp --get-title "$URL")
SAFE_TITLE=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9 -]//g' | sed 's/  */ /g' | cut -c1-80)
DATE=$(date +%Y-%m-%d)

echo "📹 Video: $TITLE"
echo "🆔 Video ID: $VIDEO_ID"

# Try to extract captions first (fastest method)
echo "🎯 Attempting to extract captions..."
if yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs 'en.*' --sub-format json3 -P "$TEMP_DIR" -o '%(id)s.%(ext)s' "$URL"; then
    echo "✅ Captions extracted successfully"
    
    # Convert to markdown
    FILENAME="$OUTPUT_PATH/$DATE - $SAFE_TITLE - Transcript.md"
    
    cat > "$FILENAME" << EOF
# $TITLE - Transcript

**Source:** $URL
**Title:** $TITLE
**Video ID:** $VIDEO_ID
**Extracted:** $DATE
**Method:** YouTube captions via yt-dlp

---

EOF

    # Process JSON3 captions to clean text
    jq -r '.events[] | select(.segs) | .segs | map(.utf8) | join("")' "$TEMP_DIR"/*.json3 | \
    sed -E 's/\s+/ /g; s/♪//g; s/^\s*//; s/\s*$//' | \
    grep -v '^$' >> "$FILENAME"
    
    echo "✅ Transcript saved to: $FILENAME"
    echo "📝 $(wc -l < "$FILENAME") lines extracted"
    
else
    echo "❌ No captions available for this video"
    echo "💡 You could try manual transcription tools if needed"
    exit 1
fi
