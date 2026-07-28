#!/usr/bin/env bash

# Vault Statistics Script
# Shows basic stats about your Obsidian vault

CONFIG_SCRIPT="$(dirname "$0")/vault-config.js"
ATTACHMENTS_DIR=$(node "$CONFIG_SCRIPT" attachments 2>/dev/null || printf '%s' "05_Attachments")
ORGANIZED_DIR=$(node "$CONFIG_SCRIPT" attachmentsOrganized 2>/dev/null || printf '%s' "05_Attachments/Organized")

echo "=== Vault Statistics ==="
echo ""

echo "📝 Note Counts:"
echo "  Inbox:     $(find 00_Inbox -name "*.md" 2>/dev/null | wc -l)"
echo "  Projects:  $(find 01_Projects -name "*.md" 2>/dev/null | wc -l)"
echo "  Areas:     $(find 02_Areas -name "*.md" 2>/dev/null | wc -l)"
echo "  Resources: $(find 03_Resources -name "*.md" 2>/dev/null | wc -l)"
echo "  Archive:   $(find 04_Archive -name "*.md" 2>/dev/null | wc -l)"
echo ""

echo "📎 Attachments:"
echo "  Total:     $(find "$ATTACHMENTS_DIR" -type f 2>/dev/null | wc -l)"
echo "  Organized: $(find "$ORGANIZED_DIR" -type f 2>/dev/null | wc -l)"
echo ""

echo "📊 Total Notes: $(find . -name "*.md" | wc -l)"
echo ""

echo "🔄 Recent Activity (last 7 days):"
find . -name "*.md" -mtime -7 -type f 2>/dev/null | head -5 | while read file; do
    echo "  - $(basename "$file")"
done
