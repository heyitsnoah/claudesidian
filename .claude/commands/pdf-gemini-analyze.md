---
name: pdf-gemini-analyze
description: Process PDF images with Gemini Vision using intelligent batching and parallel processing
argument-hint: "[all|directory|pdf-name] [extract|analyze|summarize] - e.g., 'all analyze' or 'document.pdf extract'"
allowed-tools: [Read, Write, Edit, MultiEdit, Bash, mcp__gemini-vision__analyze_multiple, mcp__gemini-vision__analyze_document, mcp__gemini-vision__extract_text, Glob, TodoWrite]
---

# Intelligent PDF to Gemini Vision Pipeline

Process PDF page images with Gemini Vision API using intelligent batching and parallel processing.

## Input
**Target**: $ARGUMENTS

Parse the arguments:
- First arg: `all` (process all image directories) or specific directory/PDF name
- Second arg (optional): Mode - `extract` (text only), `analyze` (full analysis), or `summarize` (condensed)
- Default: `all analyze`

## Phase 1: Preparation

### Step 1: Run Parallel PDF Processor (if needed)
Check if PDFs have been converted:
```bash
# Check for unconverted PDFs
unconverted=$(find "05 Attachments" -maxdepth 1 -name "*.pdf" -type f | while read pdf; do
    basename_pdf=$(basename "$pdf" .pdf)
    if [ ! -d "05 Attachments/${basename_pdf}-pages" ]; then
        echo "$pdf"
    fi
done | wc -l)

if [ "$unconverted" -gt 0 ]; then
    echo "Found $unconverted unconverted PDFs. Running parallel processor..."
    bash .scripts/pdf-parallel-processor.sh 8 "05 Attachments" gemini
fi
```

### Step 2: Identify Target Directories
Based on the first argument:
- If `all`: Find all `*-pages` directories
- If specific: Find matching directory
- Store list of directories to process

## Phase 2: Intelligent Batching

### Step 3: Optimize Gemini Calls
For each directory of images:
1. Count total images
2. Create batches of 3 images (optimal for Gemini)
3. Prepare parallel API calls

**Batching Strategy**:
```python
# Process images in batches of 3 for optimal API usage
# Execute multiple batches in parallel (up to 5 concurrent)
batch_size = 3
max_concurrent = 5
```

## Phase 3: Parallel Processing

### Step 4: Process Based on Mode

#### Extract Mode (Text Only)
Use `mcp__gemini-vision__extract_text` for each image batch:
- Focus on text extraction
- Combine into single markdown document
- Preserve page order

#### Analyze Mode (Full Analysis) - DEFAULT
Use `mcp__gemini-vision__analyze_multiple` with 3 images per call:
```
Prompt: "For each page image, provide:
1. All text content (verbatim)
2. Visual elements description (diagrams, charts, images)
3. Layout and structure notes
4. Key information highlights
Format as structured markdown."
```

#### Summarize Mode (Condensed)
Use `mcp__gemini-vision__analyze_multiple` with different prompt:
```
Prompt: "For each page, provide a concise summary:
1. Main topic/heading
2. Key points (bullet list)
3. Important data or figures
4. Notable visuals
Keep each page summary under 100 words."
```

## Phase 4: Result Aggregation

### Step 5: Compile Results
For each processed PDF:
1. Combine all page analyses in order
2. Create structured markdown document
3. Add metadata header:
   ```markdown
   ---
   source: Original-PDF-Name.pdf
   processed: YYYY-MM-DD
   pages: XX
   mode: analyze/extract/summarize
   ---
   ```
4. Save to: `03 Resources/PDF Analyses/[PDF-Name] - Analysis.md`

### Step 6: Create Master Index
If processing multiple PDFs, create index:
```markdown
# PDF Analysis Results - [Date]

## Processed Documents

| PDF | Pages | Mode | Analysis Link |
|-----|-------|------|--------------|
| ... | ...   | ...  | [[link]]     |

## Summary Statistics
- Total PDFs: X
- Total Pages: Y
- Processing Time: Z seconds
- API Calls: N
```

## Phase 5: Optimization & Progress

### Use TodoWrite for Progress Tracking
Track each PDF being processed:
- Create todo for each PDF
- Mark as in_progress when processing
- Mark completed when done
- Show overall progress to user

### Parallel Execution Strategy
1. Process up to 5 PDFs simultaneously
2. Within each PDF, batch pages by 3
3. Execute Gemini calls in parallel
4. Aggregate results as they complete

### Error Handling
- Retry failed Gemini calls (up to 3 times)
- Log errors but continue processing
- Report summary of any failures at end

## Output Structure

Final output location:
```
03 Resources/
└── PDF Analyses/
    ├── Document1 - Analysis.md
    ├── Document2 - Analysis.md
    ├── ...
    └── 00_Analysis_Index.md
```

## Best Practices Applied

1. **Batch Processing**: Always process 3 images per Gemini call
2. **Parallel Execution**: Multiple PDFs and batches simultaneously
3. **Progress Visibility**: Use TodoWrite for real-time progress
4. **Error Resilience**: Continue despite individual failures
5. **Structured Output**: Consistent markdown format for all results
6. **Metadata Preservation**: Track source, date, and processing mode

## Completion Message

After processing:
```
✅ PDF Analysis Complete!

Processed: X PDFs (Y total pages)
Time: Z seconds
Location: 03 Resources/PDF Analyses/

Key documents:
- [[Largest Document - Analysis]]
- [[Most Recent - Analysis]]
- [[Index of All Analyses|00_Analysis_Index]]

Next steps:
- Review analyses in Obsidian
- Cross-reference with existing notes
- Extract key insights
```