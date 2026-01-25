# Note Processor

Help process notes through the GTD + Zettelkasten workflow.

## Task

Review and process notes across the vault, following the Zettelkasten flow:

1. **Scan Fleeting Notes**
   - List all files in `01_FleetingNotes/`
   - Exclude README.md
   - Identify notes ready for processing

2. **Analyze Each Note**
   - Read the content
   - Determine the type and maturity of the idea
   - Suggest next steps in the workflow

3. **Processing Rules**

   **Fleeting Notes → Next Step:**
   - **→ 02_LiteratureNotes**: If it's a response to external content (book, article, video)
   - **→ 03_PermanentNotes**: If it's a mature, standalone idea ready to be atomic
   - **→ Daily**: If it's a task or daily observation
   - **→ Study Folder**: If it relates to Digital Twin or Morphic topics
   - **→ Delete**: If no longer valuable or redundant

   **Literature Notes → Next Step:**
   - **→ 03_PermanentNotes**: Extract atomic ideas as permanent notes
   - **→ Keep**: As source reference with links to permanent notes

4. **GTD Integration**
   - Action items → Daily notes or GTD system
   - Reference material → 00_GTD/Reference/
   - Someday/Maybe ideas → tag with `#someday`

5. **Suggest Actions**

   ```
   File: [filename]
   Type: [fleeting/literature/permanent/daily]
   Maturity: [raw capture/needs processing/ready for permanent]
   Destination: [suggested location]
   Reason: [why this categorization]
   Links to: [existing notes it should connect to]
   ```

6. **Identify Patterns**
   - Common themes across multiple notes
   - Notes that could be combined or linked
   - Missing connections between ideas
   - Emerging clusters that need index notes

## Output Format

Provide a clear action plan:

1. Notes ready for promotion (with destinations)
2. Notes to link or combine
3. Notes to delete
4. Notes needing more development
5. Suggested new permanent notes to create

## The Zettelkasten Flow

```
Capture → Fleeting Note → Literature Note → Permanent Note
   ↓           ↓               ↓                  ↓
(quick)   (process 1-2d)  (source-based)    (atomic idea)
```

## Remember

- Fleeting notes should be processed within 1-2 days
- One idea per permanent note (atomic)
- Always write in your own words
- Link generously - connections create value
- Let structure emerge organically
- Don't over-organize - some notes are fine as-is
