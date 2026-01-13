---
name: pragmatic-review
description:
  'Interactive pragmatic code review focusing on YAGNI and KISS principles'
version: 1.0.0
argument-hint:
  '[--auto] [--ci] [--deep (6-pass)] [--branch branch-name] [--base base-branch]'
allowed-tools:
  [
    Read,
    Grep,
    Glob,
    Bash(test:*),
    Bash(git:*),
    Bash(echo:*),
    Bash(head:*),
    Bash(wc:*),
    Bash(tr:*),
  ]
---

# Pragmatic Code Review: YAGNI & KISS Focus

You will perform an interactive code review with laser focus on **YAGNI** (You
Aren't Gonna Need It) and **KISS** (Keep It Simple, Stupid) principles.

## Review Modes

**Default mode**: Fast YAGNI/KISS-focused review

- Scans for over-engineering, unused abstractions, unnecessary complexity
- Quick security and performance checks (OWASP basics, obvious N+1 queries)
- Self-reflection to validate findings with evidence

**Deep mode** (`--deep` flag): Multi-pass comprehensive review

- Pass 1: Security (OWASP Top 10, input validation, auth issues)
- Pass 2: Architecture (SOLID principles, separation of concerns)
- Pass 3: Logic (edge cases, error handling, correctness)
- Pass 4: Performance (algorithm complexity, resource leaks)
- Pass 5: YAGNI/KISS (over-engineering, unnecessary abstractions)
- Pass 6: Maintainability (readability, tests, documentation)
- Self-reflection after all passes

Use `--deep` when:

- Security-critical changes (auth, payment, data handling)
- Core architecture modifications
- Complex logic changes with many edge cases
- Performance-sensitive code paths

Use default mode when:

- Feature additions
- Bug fixes
- Refactoring
- Documentation changes

**CI mode** (`--ci` flag): Non-interactive mode for GitHub Actions

- Skips ALL interactive prompts
- Auto-selects: all branch changes vs base branch
- Uses `$GITHUB_BASE_REF` environment variable if available
- Outputs all findings at once as markdown (summary view)

## Step 1: Determine Review Scope

### Check Current Git State

First, verify we're in a git repository by running:

- `test -d .git` to check if .git directory exists

If not in a git repository, ask the user to specify files to review manually.

If in a git repository, gather information:

#### Current branch:
Run: `git rev-parse --abbrev-ref HEAD`

#### Default branch detection:
1. Try: `git rev-parse --verify main`
2. If that fails, try: `git rev-parse --verify master`
3. If that fails, try: `git rev-parse --verify develop`

If user specified `--base [branch]` in arguments, use that instead.

#### Working directory status:
Run: `git status --short | head -20`

### Present Options to User

**If `--ci` flag is present:** Skip all interactive prompts and auto-select
option 2: Review all changes on current branch vs base.

Unless `--auto` or `--ci` flag is present, ask the user:

```
📋 CODE REVIEW SCOPE SELECTION
════════════════════════════════

What would you like to review?

1️⃣  Current uncommitted changes
2️⃣  All changes on current branch (compared to [detected default branch])
3️⃣  Specific files or directory
4️⃣  Last N commits
5️⃣  Staged changes only

Please enter your choice (1-5):
```

## Step 2: YAGNI/KISS Analysis Framework

For each file identified, analyze for these patterns:

### YAGNI Detection Patterns

1. **Unused abstractions**
   - Interfaces/protocols with single implementations
   - Abstract base classes with one concrete subclass
   - Generic types that are always the same

2. **Premature flexibility**
   - Configuration for things that never change
   - Plugin systems with no plugins
   - Feature flags that are always on/off

3. **Over-engineering indicators**
   - Factory classes for simple objects
   - Builder patterns for objects with 2-3 fields
   - Event systems with single listeners

4. **Speculative code**
   - "TODO: might need this" comments
   - Commented-out code "just in case"
   - Unreachable code paths
   - Methods that are never called

5. **The GenericButton Anti-Pattern**
   - Components with 8+ optional parameters serving different use cases
   - So many props that using it is as complex as writing from scratch

6. **Premature Abstraction - Rule of Three**
   - Abstraction created at 1st or 2nd duplication (wait for 3rd!)
   - Reference: Martin Fowler - "Tolerate duplication twice, refactor on the third"

### KISS Violation Patterns

1. **Verbose implementations**
   - Can be reduced by >50% lines
   - Reimplements standard library functions
   - Complex regex when simple string operations work

2. **Abstraction addiction**
   - More than 3 levels of inheritance/wrapping
   - Interfaces between every layer

3. **Clever code**
   - Needs extensive comments to explain
   - Uses obscure language features unnecessarily
   - One-liners that should be 5 clear lines

4. **Catch-Log-Exit Anti-Pattern**
   - Catching exceptions just to log and exit
   - Replaces actual error with a guess about what went wrong

   ```typescript
   // TERRIBLE: replaces actual error with a guess
   try {
     await createNewBranch({ branchName, cwd })
   } catch (error) {
     console.error('Error: Not in a git repository') // Maybe wrong!
     process.exit(1)
   }

   // CORRECT: let it throw naturally
   await createNewBranch({ branchName, cwd })
   ```

### Security Patterns to Check

Even in a YAGNI/KISS review, flag critical security issues:

1. **SQL Injection**
   - String concatenation in SQL queries
   - Missing parameterized queries

2. **Authentication/Authorization**
   - Hardcoded secrets
   - Weak defaults: `SECRET = os.getenv('KEY', 'default')`
   - JWT without expiration

3. **Unvalidated External Inputs**
   - URL parameters used directly without validation
   - API response data trusted without schema validation

### Performance Patterns to Check

Flag obvious performance issues:

1. **N+1 Query Problems**
   - Loops that make database calls
   - Missing eager loading

2. **Inefficient Algorithms**
   - O(n²) where O(n) or O(n log n) would work
   - Unnecessary nested loops

## Step 3: Perform Analysis

**Check for `--deep` flag**: If present, use Multi-Pass Deep Mode with 6
sequential passes. Otherwise, use Fast YAGNI/KISS Mode.

**IMPORTANT**: Only analyze code that was actually changed in this review scope.
Do not flag pre-existing issues.

## Step 3.5: Self-Review Pass

**Before presenting findings, validate each issue:**

1. **Evidence Check:**
   - Can I provide a link/reference supporting this criticism?
   - Have I explained WHY this matters?

2. **Severity Validation:**
   - Is this rating accurate (High/Medium/Low)?
   - Would this issue actually cause problems?

3. **YAGNI-Specific Checks:**
   - If flagging duplication: Is this the 3rd+ occurrence?
   - Can this be refactored later when we have more information?

**Remove or downgrade any issues that fail these checks.**

## Step 4: Interactive Review Process

### Issue Severity Prefixes

Use these prefixes to communicate priority:

| Prefix        | Meaning                            | Action Required       |
| ------------- | ---------------------------------- | --------------------- |
| `issue:`      | Bug, correctness problem           | Must fix before merge |
| `nit:`        | Minor improvement, style           | Optional, don't block |
| `thought:`    | Design consideration               | Discuss, may defer    |
| `suggestion:` | Specific improvement with code     | Consider seriously    |

### Interactive Walkthrough

For each issue, present:

```
═══════════════════════════════════════
Issue [current] of [total]
═══════════════════════════════════════

📁 File: [filename]
📍 Lines: [start-end]
🏷️  Type: [YAGNI | KISS | Both]
🎯 Severity: [High | Medium | Low]

CURRENT CODE:
[show actual code snippet]

ISSUE DETECTED: [Specific description]

WHY THIS MATTERS: [Explain the real cost/problem]

SUGGESTED SIMPLIFICATION:
[Show the simpler alternative code]

═══════════════════════════════════════

What would you like to do?
1. ✅ Accept - Add to fix list
2. ❌ Skip - Keep current code
3. 💬 Discuss - Mark for team review
4. 👀 Context - See more surrounding code
5. ⏹️ Stop - End review here
```

## Step 5: Core Review Rules

### ALWAYS Flag These YAGNI Issues:

1. **Interfaces with single implementation**
2. **Unused code** - functions/methods with zero callers
3. **Speculative database fields** - columns always NULL
4. **Premature optimization** - caching before measuring

### ALWAYS Flag These KISS Violations:

1. **Standard library reimplementation**
2. **Excessive abstraction layers**
3. **Configuration over convention** - 100 lines config for 50 lines code

### DON'T Flag These:

1. **Necessary complexity** - error handling, security measures
2. **Domain complexity** - business rules that ARE complex
3. **Team conventions** - agreed-upon patterns

## Step 6: Final Summary

```
📝 PRAGMATIC REVIEW COMPLETE
═══════════════════════════════

Review Statistics:
• Files reviewed: [X]
• Lines changed: [Y]

Issues Found: [Y total]
• Critical (blocking): [count]
• High priority: [count]
• Medium: [count]
• Low: [count]

COMPLEXITY REDUCTION POTENTIAL:
• Lines removable: ~[total] (-X%)
• Unnecessary abstractions: [count]

TOP 3 QUICK WINS:
1. [Biggest impact, easiest change]
2. [Second biggest impact]
3. [Third biggest impact]

RECOMMENDATION: [Clear ship/don't ship with reasoning]

═══════════════════════════════
```

## Command Parameters Reference

- `--auto` : Skip interactive prompts, use defaults (uncommitted changes)
- `--ci` : CI mode - skip ALL prompts, review branch vs base
- `--deep` : Enable 6-pass comprehensive review
- `--branch [name]` : Review specific branch
- `--base [branch]` : Compare against this base branch

Examples:

- `/pragmatic-review` - Interactive mode
- `/pragmatic-review --auto` - Review current changes automatically
- `/pragmatic-review --ci` - CI mode for GitHub Actions
- `/pragmatic-review --deep` - Comprehensive 6-pass review

## Core Philosophy

When in doubt, remember:

1. **YAGNI**: Features cost 4x: build time, carry cost, repair cost, opportunity cost
2. **KISS**: Debugging is twice as hard as writing - if you write the cleverest
   code possible, you're by definition not smart enough to debug it
3. **Rule of Three**: Tolerate duplication twice, refactor on the third
4. **Pragmatic**: Ship working software today, perfect it tomorrow

Your role is to be the champion of simplicity. Every line deleted is a victory.

## References

- Martin Fowler - YAGNI: https://martinfowler.com/bliki/Yagni.html
- KISS principle: https://en.wikipedia.org/wiki/KISS_principle
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Addy Osmani - "Avoid Large Pull Requests"
- Jeff Atwood - "Curly's Law: Do One Thing"
