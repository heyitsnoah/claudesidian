#!/bin/bash

# PDF to Images Splitter for Obsidian Vault
# Converts PDF files into individual page images

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Check if PDF file is provided
if [ $# -lt 1 ]; then
    print_color "$YELLOW" "Usage: $0 <pdf-file> [output-dir]"
    echo "Splits a PDF into individual page images"
    echo ""
    echo "Arguments:"
    echo "  pdf-file    Path to the PDF file to split"
    echo "  output-dir  Optional: Directory for output images"
    echo "              Default: Creates folder named after PDF file"
    echo ""
    echo "Example:"
    echo "  $0 document.pdf"
    echo "  $0 '05 Attachments/document.pdf' '05 Attachments/document-pages'"
    exit 1
fi

PDF_FILE="$1"
PDF_BASENAME=$(basename "$PDF_FILE" .pdf)
PDF_DIR=$(dirname "$PDF_FILE")

# Set output directory (default: same dir as PDF with -pages suffix)
if [ $# -ge 2 ]; then
    OUTPUT_DIR="$2"
else
    OUTPUT_DIR="${PDF_DIR}/${PDF_BASENAME}-pages"
fi

# Check if PDF file exists
if [ ! -f "$PDF_FILE" ]; then
    print_color "$RED" "Error: PDF file not found: $PDF_FILE"
    exit 1
fi

print_color "$GREEN" "📄 PDF to Images Converter"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PDF File: $PDF_FILE"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Run the Node.js conversion script
node "$(dirname "$0")/pdf-to-images.mjs" "$PDF_FILE" "$OUTPUT_DIR" --scale 2.0 --format png

# Check if conversion was successful
if [ $? -eq 0 ]; then
    # Count the generated images
    IMAGE_COUNT=$(ls -1 "$OUTPUT_DIR"/*.png 2>/dev/null | wc -l)

    print_color "$GREEN" "\n✨ Conversion Complete!"
    echo "Generated $IMAGE_COUNT page images in: $OUTPUT_DIR"

    # Create an index markdown file for easy reference
    INDEX_FILE="$OUTPUT_DIR/00_Index.md"
    echo "# PDF Pages: $PDF_BASENAME" > "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    echo "Source PDF: \`$PDF_FILE\`" >> "$INDEX_FILE"
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')" >> "$INDEX_FILE"
    echo "Total Pages: $IMAGE_COUNT" >> "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    echo "## Pages" >> "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"

    for img in "$OUTPUT_DIR"/page-*.png; do
        if [ -f "$img" ]; then
            img_name=$(basename "$img")
            page_num=${img_name#page-}
            page_num=${page_num%.png}
            page_num=$((10#$page_num))  # Remove leading zeros
            echo "### Page $page_num" >> "$INDEX_FILE"
            echo "![[$(realpath --relative-to="$(pwd)" "$img")]]" >> "$INDEX_FILE"
            echo "" >> "$INDEX_FILE"
        fi
    done

    print_color "$GREEN" "📝 Created index file: $INDEX_FILE"
else
    print_color "$RED" "❌ Conversion failed!"
    exit 1
fi