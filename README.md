# Claudesidian: Claude Code + Obsidian Starter Kit

Turn your Obsidian vault into an AI-powered second brain using Claude Code.

## What is this?

This is a pre-configured Obsidian vault structure designed to work seamlessly
with Claude Code, enabling you to:

- Use AI as a thinking partner, not just a writing assistant
- Organize knowledge using GTD + Zettelkasten methods
- Maintain version control with Git
- Access your vault from anywhere (including mobile)

## Quick Start

### 1. Get the Starter Kit

**Option A: Clone with Git**

```bash
# Clone with your preferred folder name (replace 'my-vault' with any name you like)
git clone https://github.com/heyitsnoah/claudesidian.git my-vault
cd my-vault

# Examples:
# git clone https://github.com/heyitsnoah/claudesidian.git obsidian-notes
# git clone https://github.com/heyitsnoah/claudesidian.git knowledge-base
# git clone https://github.com/heyitsnoah/claudesidian.git second-brain
```

**Option B: Download ZIP (no Git required)**

1. Click "Code" → "Download ZIP" on GitHub
2. Extract to your desired location
3. Open the folder in Claude Code

### 2. Run the Setup Wizard

```bash
# Start Claude Code in the directory
claude

# Run the interactive setup wizard (in Claude Code)
/init-bootstrap
```

This will:

- Install dependencies automatically
- Disconnect from the original claudesidian repository
- **Intelligently analyze** your existing vault structure and patterns
- **Import your existing Obsidian vault** safely to OLD_VAULT/ (if you have one)
- **Research your public work** for personalized context (with your permission)
- Ask you about your workflow preferences
- Create a personalized CLAUDE.md configuration
- Set up your folder structure
- Optionally configure Gemini Vision for image/video analysis
- Optionally configure Firecrawl for web research
- Initialize Git for version control

### 3. Open in Obsidian (Optional but Recommended)

- Download [Obsidian](https://obsidian.md)
- Open vault from the claudesidian folder
- This gives you a visual interface alongside Claude Code

### 4. Your First Session

Tell Claude Code:

```
I'm starting a new project about [topic].
I'm in thinking mode, not writing mode.
Please search my vault for any relevant existing notes,
then help me explore this topic by asking questions.
```

Or use one of the pre-configured commands (in Claude Code):

```
/thinking-partner   # For collaborative exploration
/daily-review       # For end-of-day reflection
/research-assistant # For deep dives into topics
```

## Folder Structure

```
claudesidian/
├── 00_GTD/                    # GTD system
│   ├── _GTD.md                # Main dashboard
│   ├── 00_Actions/            # Inbox, Next, Recurring, Someday
│   ├── 01_Projects/           # Personal and Work projects
│   │   └── _PJM.md            # Project dashboard
│   └── 02_Reference/          # Non-actionable reference
├── 01_FleetingNotes/          # Quick captures (process in 1-2 days)
├── 02_LiteratureNotes/        # Notes from external sources
├── 03_PermanentNotes/         # Atomic, interconnected ideas
├── 04_Templates/              # Reusable note templates
├── Daily/                     # Daily notes and journals
├── Digital Twin/              # Study topic folder
├── Morphic/                   # Study topic folder
└── .scripts/                  # Helper scripts for automation
```

## Key Concepts

### Thinking Mode vs Writing Mode

**Thinking Mode** (Research & Exploration):

- Claude asks questions to understand your goals
- Searches existing notes for relevant content
- Helps make connections between ideas
- Maintains a log of insights and progress

**Writing Mode** (Content Creation):

- Generates drafts based on your research
- Helps structure and edit content
- Creates final deliverables

### GTD + Zettelkasten Methods

**GTD (Getting Things Done)** - Task and project management:

- **Inbox**: Capture everything to `00_GTD/00_Actions/Inbox.md`
- **Next Actions**: Concrete tasks in `00_GTD/00_Actions/Next.md`
- **Projects**: Multi-step outcomes in `00_GTD/01_Projects/`
- **Reference**: Non-actionable info in `00_GTD/02_Reference/`

**Zettelkasten** - Knowledge building:

- **Fleeting Notes**: Quick captures in `01_FleetingNotes/`
- **Literature Notes**: Notes from sources in `02_LiteratureNotes/`
- **Permanent Notes**: Atomic ideas in `03_PermanentNotes/`

**Study Folders** - Dedicated research topics:

- Create folders for major areas of study (e.g., `Digital Twin/`, `Morphic/`)

## Claude Code Commands

Pre-configured AI assistants ready to use:

- `thinking-partner` - Explore ideas through questions
- `inbox-processor` - Process notes through GTD + Zettelkasten workflow
- `research-assistant` - Deep dive into topics
- `daily-review` - End of day reflection
- `weekly-synthesis` - Find patterns in your week
- `create-command` - Build new custom commands
- `de-ai-ify` - Remove AI writing patterns from text
- `upgrade` - Update to the latest claudesidian version
- `init-bootstrap` - Re-run the setup wizard
- `install-claudesidian-command` - Install shell command to launch vault from
  anywhere

Run with: `/[command-name]` in Claude Code

### Staying Updated with `/upgrade`

Claudesidian automatically checks for updates when you start Claude Code and
will remind you to run `/upgrade` when new features are available.

The upgrade command intelligently merges new features while preserving your
customizations:

```bash
# Preview what would be updated (recommended first)
/upgrade check

# Run the interactive upgrade
/upgrade

# Skip confirmations for safe updates (advanced)
/upgrade force
```

**What the upgrade does:**

- Creates a timestamped backup before making any changes
- Shows you diffs for each file before updating
- Preserves your personal notes and customizations
- Only updates system files (commands, agents, scripts)
- Never touches your content folders (00_GTD, 01_FleetingNotes, etc.)
- Provides rollback capability if needed

**Safety features:**

- All your personal content is protected
- Complete backup created in `.backup/upgrade-[timestamp]/`
- File-by-file review and confirmation
- Progress tracked in `.upgrade-checklist.md`
- Can be stopped and resumed at any time

## Vision & Document Analysis (Optional)

With [Google Gemini](https://ai.google.dev/) MCP configured, Claude Code can
process your attachments directly without having to describe them. This means:

- **Direct image analysis**: Claude sees the actual image, not your description
- **PDF text extraction**: Full document text without copy-pasting
- **Bulk processing**: Analyze multiple screenshots or documents at once
- **Smart organization**: Auto-generate filenames based on image content
- **Comparison tasks**: Compare before/after screenshots, designs, etc.

**Why this matters**: Instead of describing "a screenshot showing an error
message", Claude Code directly sees and reads the error. Perfect for debugging
UI issues, analyzing charts, or processing scanned documents.

**Getting a Gemini API key:**

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Create a new API key (it's free!)
5. Set it in your environment: `export GEMINI_API_KEY="your-key-here"`

See `.claude/mcp-servers/README.md` for full setup instructions

## Web Research (Optional)

With [Firecrawl](https://www.firecrawl.dev/) configured, our helper scripts
fetch and save full web content directly to your vault. This means:

- **Full text capture**: Scripts pipe complete article text to files, not
  summaries
- **Context preservation**: Claude doesn't need to hold web content in memory
- **Batch processing**: Save multiple articles at once with `firecrawl-batch.sh`
- **Clean markdown**: Web pages converted to readable, searchable markdown
- **Permanent archive**: Your research stays in your vault forever

**Why this matters**: Instead of Claude reading a webpage and summarizing it
(losing detail), the scripts save the FULL text. Claude can then search and
analyze thousands of saved articles without hitting context limits. Perfect for
research projects, documentation archives, or building a knowledge base.

**Example workflow:**

```bash
# Save a single article
npm run firecrawl:scrape -- "https://example.com/article" "02_LiteratureNotes"

# Batch save multiple URLs
npm run firecrawl:batch -- urls.txt "02_LiteratureNotes"
```

**Getting a Firecrawl API key:**

1. Visit [Firecrawl](https://www.firecrawl.dev) and sign up
2. Get 300 free credits to start (open-source, can self-host)
3. Go to your dashboard to find your API key
4. Copy the key (format: `fc-xxxxx...`)
5. Set it in your environment: `export FIRECRAWL_API_KEY="fc-your-key-here"`

## Helper Scripts

Run these with `pnpm`:

- `attachments:list` - Show unprocessed attachments
- `attachments:organized` - Count organized files
- `attachments:sizes` - Find large files
- `attachments:orphans` - Find unreferenced attachments
- `vault:stats` - Show vault statistics

## Advanced Setup

### Quick Launch from Anywhere

Install a shell command to launch your vault from any directory:

```bash
# In Claude Code, run:
/install-claudesidian-command
```

This creates a `claudesidian` alias that:

- Changes to your vault directory automatically
- Tries to resume your existing session (if one exists)
- Falls back to starting a new session
- Returns to your original directory when done

**Usage:**

```bash
# From anywhere in your terminal:
claudesidian

# It will automatically resume your last session or start a new one
```

The command is added to your shell config (~/.zshrc, ~/.bashrc, etc.) so it
persists across terminal sessions.

### Git Integration

Initialize Git for version control:

```bash
git init
git add .
git commit -m "Initial vault setup"
git remote add origin your-repo-url
git push -u origin main
```

Best practices:

- Commit after each work session
- Use descriptive commit messages
- Pull before starting work

### Mobile Access

1. Set up a small server (mini PC, cloud VPS, or home server)
2. Install Tailscale for secure VPN access
3. Clone your vault to the server
4. Use Termius or similar SSH client on mobile
5. Run Claude Code remotely

### Custom Commands

Create specialized commands by saving instructions in `.claude/commands/`:

**Research Assistant** (`06_Metadata/Agents/research-assistant.md`):

```markdown
You are a research assistant.

- Search the vault for relevant information
- Synthesize findings from multiple sources
- Identify gaps in knowledge
- Suggest areas for further exploration
```

## Tips & Best Practices

### From Experience

1. **Start in thinking mode**: Resist the urge to generate content immediately
2. **Be a token maximalist**: More context = better results
3. **Save everything**: Capture chats, fragments, partial thoughts
4. **Trust but verify**: Always read AI-generated content
5. **Break your flow**: AI helps you resume easily

## Troubleshooting

### Claude Code can't find my notes

- Make sure you're running Claude Code from the vault root directory
- Check file permissions
- Verify markdown files have `.md` extension

### Git conflicts

- Always pull before starting work
- Commit frequently with clear messages
- Use branches for experimental changes

### Attachment management

- Run `npm run attachments:create-organized` to set up folders
- Use helper scripts to find orphaned files
- Keep attachments under 10MB for Git

## Philosophy

This setup is based on key principles:

1. **AI amplifies thinking, not just writing**
2. **Local files = full control**
3. **Structure enables creativity**
4. **Iteration beats perfection**
5. **The goal is insight, not just information**

## Contributing

We welcome contributions from the community! This is a living template that gets
better with everyone's input.

### How to Contribute

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test your changes** to ensure everything works
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description of what you've done

### What We're Looking For

- **New commands**: Useful Claude Code commands for common workflows
- **New agents**: Specialized agents for specific tasks
- **Documentation improvements**: Better explanations, examples, or guides
- **Bug fixes**: Found something broken? Fix it!
- **Workflow templates**: Share your productive workflows
- **Helper scripts**: Automation tools that make vault management easier
- **Integration guides**: Connect Claudesidian with other tools
- **Core updates**: Improvements to the upgrade system, setup wizard, or other
  core features

### Guidelines

- Keep commands focused and single-purpose
- Write clear documentation with examples
- Test thoroughly before submitting
- Follow existing code style and structure
- Update the CHANGELOG.md with your changes
- **AI-generated content is welcome, but you MUST carefully read and review
  everything before submitting** - never submit code you don't understand

### Getting Updates

When new features are contributed and merged, users can easily get them with:

```bash
/upgrade
```

The upgrade command intelligently merges new features while preserving your
personal customizations, making it easy to benefit from community contributions
without losing your work.

### Questions or Ideas?

- Open an issue to discuss major changes before starting work
- Join discussions in existing issues
- Share your use cases - they help us understand needs better

Remember: best practices emerge from use, not theory. Your real-world experience
makes this better for everyone!

## Resources

- [Obsidian Documentation](https://help.obsidian.md)
- [Getting Things Done (GTD)](https://gettingthingsdone.com/)
- [Zettelkasten Method](https://zettelkasten.de/introduction/)
- [Claude Code Documentation](https://claude.ai/docs)

## Inspiration

This starter kit was inspired by the workflows discussed in:

- [How to Use Claude Code as a Second Brain](https://every.to/podcast/how-to-use-claude-code-as-a-thinking-partner) -
  Noah Brier's interview with Dan Shipper
- Built by the team at [Alephic](https://alephic.com) - an AI-first strategy and
  software partner that helps organizations solve complex challenges through
  custom AI systems

## License

MIT - Use this however you want. Make it your own.

---

_Remember: The bicycle feels wobbly at first, then you forget it was ever hard._
