# MCP Servers

Model Context Protocol servers extend Claude Code's capabilities.

## Gemini Vision MCP

Adds powerful image and document analysis capabilities using Google's Gemini
model.

### Features

- **Image Analysis**: Describe, analyze, and extract text from images
- **Document Processing**: Analyze PDFs and documents
- **Multi-Image Comparison**: Compare multiple images at once
- **OCR**: Extract text from images
- **Smart Filename Suggestions**: Generate descriptive filenames for images

### Setup

1. **Get a Gemini API Key**
   - Visit: https://aistudio.google.com/apikey
   - Create a free API key

2. **Add to Environment**

   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export GEMINI_API_KEY='your-key-here'

   # Reload shell
   source ~/.zshrc
   ```

3. **Install Dependencies**

   ```bash
   pnpm install
   ```

4. **Test Setup**
   ```bash
   pnpm test-gemini
   ```

### Available Commands

Once configured, these commands become available in Claude Code:

- `mcp__gemini-vision__analyze_image` - Analyze a single image
- `mcp__gemini-vision__analyze_multiple` - Compare multiple images
- `mcp__gemini-vision__extract_text` - OCR text extraction
- `mcp__gemini-vision__compare_images` - Compare two images
- `mcp__gemini-vision__suggest_image_filename` - Generate descriptive filename
- `mcp__gemini-vision__analyze_document` - Analyze PDFs and documents

### Usage Examples

**Analyze Screenshot**

```
Analyze the image at Digital Twin/images/screenshot.png
and tell me what it contains.
```

**Process Multiple Images**

```
Compare all images in Morphic/diagrams/
and identify common themes.
```

**Extract Text**

```
Extract all text from the PDF at
02_LiteratureNotes/paper.pdf
```

**Rename Images**

```
Suggest better names for all images
in Daily/attachments/ based on their content.
```

### Troubleshooting

**"GEMINI_API_KEY not found"**

- Make sure you've added the key to your shell profile
- Restart your terminal and Claude Code

**"File not found"**

- Use absolute paths or paths relative to vault root
- Check file permissions

**Rate Limits**

- Free tier: 15 requests per minute
- Consider upgrading for heavy usage

## Adding More MCPs

1. Place MCP server file in `.claude/mcp-servers/`
2. Add configuration to Claude settings
3. Document setup here
4. Add usage examples

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Gemini API Docs](https://ai.google.dev)
- [Claude Code MCP Guide](https://claude.ai/docs/mcp)
