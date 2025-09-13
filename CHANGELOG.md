# Changelog

All notable changes to claudesidian will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-13

### Added
- Initial release of claudesidian - Claude Code + Obsidian starter kit
- PARA method folder structure (00_Inbox through 06_Metadata)
- Bootstrap initialization system via `claude run init-bootstrap`
- Pre-configured Claude Code commands:
  - thinking-partner - Collaborative thinking mode
  - inbox-processor - Organize captures
  - research-assistant - Deep dive into topics
  - daily-review - End of day reflection
  - weekly-synthesis - Find patterns in your week
  - create-command - Build new custom commands
  - de-ai-ify - Remove AI writing patterns
  - add-frontmatter - Add metadata to notes
  - init-bootstrap - Interactive setup wizard
- Claude Code agents:
  - thinking-partner agent for exploration and brainstorming
- Helper scripts:
  - firecrawl-batch.sh - Batch web scraping
  - firecrawl-scrape.sh - Single URL scraping
  - fix-renamed-links.js - Fix broken links after renames
  - update-attachment-links.js - Update attachment references
  - transcript-extract.sh - Extract YouTube transcripts
  - vault-stats.sh - Show vault statistics
- Attachment management commands via pnpm
- Gemini Vision MCP server for image/PDF analysis (optional)
- CLAUDE-BOOTSTRAP.md template for configuration
- Comprehensive README with setup instructions
- Install script for automated setup
- Git integration with proper .gitignore

### Changed
- Replaced static CLAUDE.md with dynamic init-bootstrap command

### Security
- API keys stored in environment variables
- .mcp.json gitignored for security

[Unreleased]: https://github.com/heyitsnoah/claudesidian/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/heyitsnoah/claudesidian/releases/tag/v0.1.0