#!/bin/bash

# Vault Statistics Script
# Shows basic stats about your Obsidian vault

echo "=== Vault Statistics ==="
echo ""

echo "📝 GTD System:"
echo "  Actions:    $(find 00_GTD/00_Actions -name "*.md" 2>/dev/null | wc -l)"
echo "  Projects:   $(find 00_GTD/01_Projects -name "*.md" 2>/dev/null | wc -l)"
echo "  Reference:  $(find 00_GTD/02_Reference -name "*.md" 2>/dev/null | wc -l)"
echo ""

echo "📝 Zettelkasten:"
echo "  Fleeting:   $(find 01_FleetingNotes -name "*.md" 2>/dev/null | wc -l)"
echo "  Literature: $(find 02_LiteratureNotes -name "*.md" 2>/dev/null | wc -l)"
echo "  Permanent:  $(find 03_PermanentNotes -name "*.md" 2>/dev/null | wc -l)"
echo ""

echo "📝 Other:"
echo "  Daily:      $(find Daily -name "*.md" 2>/dev/null | wc -l)"
echo "  Templates:  $(find 04_Templates -name "*.md" 2>/dev/null | wc -l)"
echo ""

echo "📊 Total Notes: $(find . -name "*.md" -not -path "./.git/*" | wc -l)"
echo ""

echo "🔄 Recent Activity (last 7 days):"
find . -name "*.md" -mtime -7 -type f -not -path "./.git/*" 2>/dev/null | head -5 | while read file; do
    echo "  - $(basename "$file")"
done
