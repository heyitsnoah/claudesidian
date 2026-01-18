---
description: Automatically bump version, update changelog, commit, tag, and push a release
---

# Release Command

Automates the entire release process: analyzes recent commits to determine
version bump type, updates version in package.json, moves unreleased changelog
entries to the new version, commits everything, creates a git tag, and pushes to
GitHub.

## Task

1. Analyze recent commits since last tag to determine version bump type
2. Update version in package.json
3. Move "Unreleased" entries in CHANGELOG.md to the new version section
4. Commit the changes
5. Create an annotated git tag
6. Push commits and tags to GitHub
7. Create GitHub release with release notes

## Process

### 1. Check Prerequisites

- Ensure on main/master branch
- Check for uncommitted changes
- Verify CHANGELOG.md and package.json exist

### 2. Determine Version Bump

If argument provided (major/minor/patch), use that. Otherwise analyze commits:
- "BREAKING CHANGE" or "!" = major bump
- "feat:" = minor bump  
- "fix:", "docs:", "chore:" = patch bump

### 3. Update Files

- Update version in package.json
- Move "Unreleased" to new version section in CHANGELOG.md
- Add comparison links

### 4. Git Operations

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v{version}"
git tag -a v{version} -m "Release v{version}"
git push && git push --tags
```

### 5. Create GitHub Release

```bash
gh release create v{version} --notes "..."
```

## Version Bump Rules

**MAJOR** (1.0.0 → 2.0.0):
- Breaking changes requiring user code changes
- Removing features or changing syntax incompatibly

**MINOR** (1.0.0 → 1.1.0):
- NEW capabilities (not enhancements)
- New commands, tools, integrations

**PATCH** (1.0.0 → 1.0.1):
- Bug fixes and improvements
- Enhancements to existing features
- Documentation updates

## Example Usage

```bash
# Auto-detect version bump
/release

# Force specific bump
/release patch
/release minor
/release major
```

## Safety Features

- Dry run mode available
- Confirmation before pushing
- Version format validation
- Check for existing tags
