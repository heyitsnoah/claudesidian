---
description: Interactive pragmatic code review focusing on YAGNI and KISS principles
---

# Pragmatic Code Review: YAGNI & KISS Focus

Perform an interactive code review with laser focus on **YAGNI** (You
Aren't Gonna Need It) and **KISS** (Keep It Simple, Stupid) principles.

## Review Modes

**Default mode**: Fast YAGNI/KISS-focused review
- Scans for over-engineering, unused abstractions, unnecessary complexity
- Quick security and performance checks

**Deep mode** (`--deep` flag): Multi-pass comprehensive review
- Pass 1: Security (OWASP Top 10)
- Pass 2: Architecture (SOLID principles)
- Pass 3: Logic (edge cases, error handling)
- Pass 4: Performance (algorithm complexity)
- Pass 5: YAGNI/KISS (over-engineering)
- Pass 6: Maintainability (readability, tests)

**CI mode** (`--ci` flag): Non-interactive for automation

## YAGNI Detection Patterns

1. **Unused abstractions** - Interfaces with single implementations
2. **Premature flexibility** - Config for things that never change
3. **Over-engineering** - Factory classes for simple objects
4. **Speculative code** - "TODO: might need this" comments
5. **GenericButton Anti-Pattern** - Components with 8+ optional parameters
6. **Premature Abstraction** - Abstraction before 3rd duplication

## KISS Violation Patterns

1. **Verbose implementations** - Can be reduced by >50%
2. **Abstraction addiction** - More than 3 levels of wrapping
3. **Clever code** - Needs extensive comments to explain
4. **Catch-Log-Exit** - Catching exceptions just to log and exit

## Issue Severity Prefixes

| Prefix | Meaning | Action |
|--------|---------|--------|
| `issue:` | Bug, correctness problem | Must fix |
| `nit:` | Minor improvement | Optional |
| `thought:` | Design consideration | Discuss |
| `suggestion:` | Specific improvement | Consider |

## Command Parameters

- `--auto` : Skip prompts, use defaults
- `--ci` : CI mode, non-interactive
- `--deep` : 6-pass comprehensive review
- `--branch [name]` : Review specific branch
- `--base [branch]` : Compare against base

## Core Philosophy

1. **YAGNI**: Features cost 4x: build, carry, repair, opportunity
2. **KISS**: Debugging is twice as hard as writing
3. **Rule of Three**: Tolerate duplication twice, refactor on third
4. **Pragmatic**: Ship working software today, perfect it tomorrow

Every line deleted is a victory.
