---
description: Create a feature branch, commit, push, and open a pull request
---

# Pull Request Command

Creates a new feature branch, commits changes, pushes to GitHub, and opens a
pull request - all in one command.

## Task

Automate the entire pull request workflow: create branch, stage changes, commit
with descriptive message, push to GitHub, and open PR with proper description.

## Process

### 1. Check Prerequisites

- Ensure git repository exists
- Check for uncommitted changes
- Verify GitHub CLI (`gh`) is available
- Get current branch as base

### 2. Create Feature Branch

```bash
# Generate sanitized branch name
branch_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')

# Format: feature/short-description or fix/issue-name
git checkout -b $branch_name
```

### 3. Stage and Review Changes

- Show `git status` to user
- Show `git diff --staged` for review
- Stage all changes if none staged
- Confirm with user

### 4. Commit Changes

Use conventional commits format:
```bash
git commit -m "feat: add new feature

- Detail 1
- Detail 2"
```

### 5. Push to GitHub

```bash
git push -u origin $branch_name
```

### 6. Create Pull Request

```bash
gh pr create \
  --title "Feature: Add awesome capability" \
  --body "## Summary
Brief description

## Changes
- Added X
- Fixed Y

## Testing
- [ ] Tested locally
- [ ] All tests pass" \
  --base main
```

### 7. Provide Next Steps

- Show PR URL
- Remind about review process

## Arguments

- **Optional**: Branch name (auto-generated if not provided)
- **Optional**: PR title (analyzed from changes if not provided)
- **Optional**: Target branch (defaults to main/master)

## Example Usage

```bash
# Auto-generate from changes
/pull-request

# Specify branch name
/pull-request feature/add-auth

# Full specification
/pull-request fix/bug-123 "Fix timeout issue" develop
```

## Branch Naming Conventions

- **Features**: `feature/description`
- **Fixes**: `fix/issue-or-description`
- **Documentation**: `docs/what-updated`
- **Refactoring**: `refactor/what-changed`

## Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code change
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Build/tooling changes

## Safety Features

- Confirm before pushing large changes
- Show diff before committing
- Verify PR description before creating
- Handle merge conflicts gracefully
