# Integrations guide

Claudesidian works with skills, MCP servers, and Claude Code plugins. Start
with the smallest integration that solves the task, and add only extensions
you can review and maintain.

## Choose the right extension

| Need | Prefer | Why |
| --- | --- | --- |
| Repeatable vault workflow | A skill in `.agents/skills/` | Versioned instructions, no extra process or credentials |
| Access to an external API or data source | An MCP server | Keeps the integration boundary explicit and tool calls inspectable |
| Reusable Claude Code commands, hooks, or UI behavior | A plugin | Packages related capabilities that can be upgraded together |

Use a skill when the work can be expressed as instructions and existing tools.
Use MCP when a task needs a remote service or a local process with a defined
tool schema. Use a plugin only when the bundle provides several related
capabilities that should be installed and upgraded together.

## Recommended starting points

The built-in skills are the safest default because they ship with this vault:

- `thinking-partner` for exploration and decision-making
- `research-assistant` for source-based research
- `inbox-processor` for organizing captures
- `add-frontmatter` for consistent note metadata
- `pull-request` and `release` for repository workflows

Optional integrations are intentionally separate from the core workflow:

- **Gemini Vision MCP** — analyze images and PDFs in attachments. Follow the
  setup and credential guidance in `.claude/mcp-servers/README.md`.
- **Firecrawl scripts** — archive web pages as searchable Markdown. Follow
  `.scripts/README.md` and keep `FIRECRAWL_API_KEY` in the environment.

## Review checklist

Before installing an external skill, MCP server, or plugin:

1. Confirm the source repository, license, release activity, and issue tracker.
2. Read the manifest and every command or tool it exposes.
3. Check whether it can read, write, execute commands, or send data externally.
4. Keep API keys in environment variables or an OS credential store; never put
   secrets in `CLAUDE.md`, notes, `.mcp.json`, or committed configuration.
5. Pin versions when the integration is used in a shared or automated vault.
6. Test the integration in a disposable copy of the vault before enabling it in
   the primary one.

Remove unused integrations promptly. A smaller tool surface is easier to audit
and makes agent behavior easier to understand.

