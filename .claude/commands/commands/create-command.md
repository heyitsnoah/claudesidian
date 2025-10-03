---
allowed-tools: Write, Read, Bash(ls:.claude/commands/*), Bash(mkdir:.claude/commands/*), Edit, Grep, Glob
description: Create new slash command with best practices - use when building custom automation workflows
argument-hint: [command-name] [description] OR paste draft
version: 1.0.0
---

# Create New Slash Command

I'll help you create a new Claude Code slash command following best practices from the official guide.

<!-- IMPORTANT: Commands go in .claude/commands/ NOT .claude/slash-commands/ -->

## Input Analysis

**Your Request:** $ARGUMENTS

## Best Practices Reference

Based on "Mastering Slash Commands in Claude Code" guide:

### Critical Rules
1. **Use `!` notation for bash execution** - Commands execute before prompt
2. **Use `@` notation for file includes** - File contents inserted into prompt
3. **Minimal tool permissions** - Only grant what's absolutely needed
4. **Argument notation** - Use `$ARGUMENTS` or `$1`, `$2` for positional
5. **Clear structure** - Numbered steps, sections, explicit instructions

## Quick Start Options

### Option A: Instant Creation (I know what you want)
If you've provided clear details, I'll:
1. Create the command file immediately
2. Add appropriate frontmatter (tools, description, model)
3. Implement research-driven patterns if needed
4. Test the command structure
5. Provide usage examples

### Option B: Interactive Design (Let's build it together)
I'll guide you through:
1. **Purpose**: What problem does this solve?
2. **Complexity Level**:
   - Basic (simple execution)
   - Interactive (user questions)
   - Research-driven (searches first)
   - Learning (remembers patterns)
3. **Tools needed**: Which tools should be allowed?
4. **Arguments**: What inputs does it accept?
5. **Model selection**: Default, specific, or inherit?

### Option C: Template Enhancement (You have a draft)
Paste your draft and I'll:
- Add missing frontmatter
- Enhance with best practices
- Add error handling
- Implement progressive disclosure
- Add learning/memory capabilities if appropriate

## Best Practices I'll Apply

### Command Naming
```bash
# Good: descriptive-with-hyphens
test-component
analyze-performance
review-code

# Bad: abbreviations
tc, perf, rvw
```

### Frontmatter Structure
```yaml
---
description: "Clear, action-oriented description (REQUIRED for AI invocation)"
argument-hint: "[arg1] [arg2]"  # User-facing hint
allowed-tools: Read, Grep, Glob  # Minimal necessary - principle of least privilege
model: claude-sonnet-4-5-20250929  # Optional - for complex/critical tasks
disable-model-invocation: false  # Set true to hide from AI's auto-invocation
version: 1.0.0  # Track changes
---
```

### Tool Permission Best Practices
- **Analysis agents**: `Read, Grep, Glob` (never Bash)
- **Modifier agents**: `Read, Edit, MultiEdit` (add Write only if creating new files)
- **Executor agents**: `Read, Bash(specific:*)` (wildcard specific commands only)
- **Researcher agents**: `WebSearch, WebFetch, Read` (no Write/Edit)
- **NEVER** use `Bash(*)` or `Read(*)` - always be specific

### Sophistication Levels

**Level 1 - Basic:**
```markdown
Run the tests for $1
```

**Level 2 - Interactive:**
```markdown
Ask: Which test suite?
Based on answer, run appropriate tests
```

**Level 3 - Research-Driven:**
```markdown
## Step 1: Discover
Test files: !`find . -name "*.test.*" -type f | head -10`

## Step 2: Analyze
Package.json scripts: !`cat package.json | grep -A 5 "scripts"`

## Step 3: Execute
Run the appropriate test command based on findings
```

**Level 4 - Learning:**
```markdown
Previous runs: !`cat ~/.claude/command-state.json 2>/dev/null || echo "{}"`

Based on history, suggest most likely option and execute
```

### Dynamic Context Pattern (! and @ notation)

**`!` - Execute commands BEFORE prompt:**
```markdown
Current branch: !`git branch --show-current`
Git status: !`git status --porcelain=v1`
```

**`@` - Include file contents:**
```markdown
Review these files:
@src/main.py
@tests/test_main.py
```

**CRITICAL**: All `!` commands must be whitelisted in `allowed-tools` or they won't execute!

## Common Command Patterns

### File Analysis Commands
- Use `Glob` to find files
- `Grep` for content search
- `Read` selective files
- Aggregate and report

### Automation Commands
- Check prerequisites first
- Run in parallel when possible
- Capture and parse output
- Handle errors gracefully

### Review Commands
- Research before judging
- Provide context with findings
- Suggest fixes, not just problems
- Learn from patterns

## Ready to Create!

Based on "$ARGUMENTS", here's what I'll do:

<!-- If clear request provided -->
$IF_CLEAR_REQUEST{
1. Determine command purpose and complexity
2. Choose appropriate pattern (basic/interactive/research/learning)
3. Select necessary tools
4. Write the command
5. Save to .claude/commands/[name].md
}

<!-- If needs clarification -->
$IF_NEEDS_CLARIFICATION{
Please provide:
- Command name (kebab-case)
- What it should do
- Any special requirements
- Example usage
}

<!-- If draft provided -->
$IF_DRAFT_PROVIDED{
I'll enhance your draft with:
- Proper frontmatter
- Error handling
- Progressive complexity
- Best practices
}

Let's create your command!
