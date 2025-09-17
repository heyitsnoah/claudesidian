---
name: pdf-split
description:
  Convert PDF files into individual page images for better Obsidian integration
argument-hint:
  "[pdf-file|all] [output-dir] - e.g., 'document.pdf' or 'all' for batch
  processing"
allowed-tools: [Bash, Read, Write, Glob, TodoWrite]
---

# PDF Split Command

Convert PDF files into individual page images for better integration with
Obsidian. Creates organized folders with indexed markdown files for easy
navigation.

## Input

**Target**: $ARGUMENTS

Parse the arguments:

- First arg: Path to PDF file OR "all" to process all PDFs in attachments
- Second arg (optional): Output directory (defaults to PDF-name-pages folder)

## Processing Modes

### Single PDF Mode

If a specific PDF file is provided:

1. **Validate Input**
   - Check if PDF exists
   - Determine output directory

2. **Run Conversion**

   ```bash
   bash .scripts/pdf-split.sh "$PDF_FILE" "$OUTPUT_DIR"
   ```

3. **Report Results**
   - Show number of pages created
   - Display path to index file
   - Provide next steps

### Batch Mode (all)

If "all" is specified:

1. **Find All PDFs**

   ```bash
   # Find all PDFs in attachments folder
   find "05_Attachments" -maxdepth 1 -name "*.pdf" -type f
   ```

2. **Check for Existing Conversions**

   ```bash
   # Skip already converted PDFs
   for pdf in *.pdf; do
       basename_pdf=$(basename "$pdf" .pdf)
       if [ ! -d "${basename_pdf}-pages" ]; then
           # Process this PDF
       fi
   done
   ```

3. **Run Parallel Processor**

   ```bash
   # Use parallel processor for efficiency
   bash .scripts/pdf-parallel-processor.sh 8 "05_Attachments"
   ```

4. **Generate Summary**
   - Total PDFs processed
   - Total pages created
   - List of created directories

## Output Structure

Each PDF creates:

```
document.pdf → document-pages/
├── page-001.png
├── page-002.png
├── page-003.png
├── ...
└── 00_Index.md  # Markdown index with all pages embedded
```

## Index File Format

The `00_Index.md` file contains:

- PDF metadata (source, date, page count)
- All pages embedded as images
- Organized by page number

## Use Cases

### Academic Papers

```
/pdf-split "05_Attachments/research-paper.pdf"
```

Creates individual pages for annotation and reference.

### Book Chapters

```
/pdf-split "textbook-chapter3.pdf" "03_Resources/Textbook/Chapter3"
```

Organizes pages in a specific location.

### Batch Processing

```
/pdf-split all
```

Processes all PDFs in attachments folder efficiently.

## Progress Tracking

For batch processing, use TodoWrite to track:

- [ ] Finding PDFs to process
- [ ] Converting each PDF
- [ ] Creating index files
- [ ] Generating summary

## Error Handling

- **PDF not found**: Show available PDFs in directory
- **Conversion fails**: Log error and continue with next PDF
- **Directory exists**: Ask whether to overwrite or skip

## Success Message

### Single PDF

```
✅ PDF Split Complete!

📄 Source: document.pdf
📁 Output: document-pages/
📊 Pages: 25
📝 Index: document-pages/00_Index.md

The PDF has been split into 25 individual images.
You can now:
- View pages in Obsidian
- Annotate individual pages
- Link to specific pages
- Process with Gemini Vision (/pdf-gemini-analyze)
```

### Batch Processing

```
✨ Batch Processing Complete!

📊 Statistics:
- PDFs processed: 12
- Total pages: 287
- Time taken: 45 seconds
- Average: 3.75 seconds per PDF

📁 Created directories:
- document1-pages/ (15 pages)
- document2-pages/ (23 pages)
- ...

Next steps:
- Review pages in Obsidian
- Run /pdf-gemini-analyze for AI analysis
- Organize pages into topics
```

## Tips

1. **Large PDFs**: Consider processing during off-hours
2. **Storage**: Each page is ~200-500KB as PNG
3. **Quality**: Default scale is 2.0 for good readability
4. **Performance**: Batch mode uses parallel processing

## Related Commands

- `/pdf-gemini-analyze` - Analyze PDF images with AI
- `/download-attachment` - Download PDFs from web
