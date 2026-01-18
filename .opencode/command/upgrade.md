---
description: Intelligently upgrade claudesidian with new features while preserving user customizations
---

# Smart Upgrade Command

Intelligently upgrades your claudesidian installation by fetching the latest
release from GitHub and using AI-powered semantic analysis to merge new features
with your existing customizations. Preserves user intent while adding new
capabilities.

## Task

1. Check GitHub for the latest claudesidian release
2. Download and analyze what has changed since your version
3. Use Claude's semantic understanding to identify user customizations
4. Intelligently merge new features with existing customizations
5. Safely apply updates while preserving user data and preferences
6. Create backups and provide rollback options

## Process

### 1. **Version Check & Setup**

- Get current version from package.json
- Check if already on latest version
- Create timestamped backup in `.backup/upgrade-YYYY-MM-DD-HHMMSS/`
- Clone latest claudesidian to temp directory

### 2. **Create Upgrade Checklist**

- Compare system files between current and latest
- Create checklist of files that need review
- Explicitly EXCLUDE user content (00_Inbox through 06_Metadata, CLAUDE.md)

### 3. **File-by-File Review**

For EACH file:
1. Show diff between local and upstream
2. Determine update strategy
3. Ask user for decision on conflicting files
4. Apply chosen strategy
5. Update checklist status

### 4. **Update Categories**

**AI-Powered Merge**: Commands, Agents, Templates
**Automatic Safe Updates**: New commands, Scripts, Dependencies
**Never Modified**: User content, CLAUDE.md, API configs

### 5. **Verification & Cleanup**

- Verify all files updated correctly
- Clean up temp directory
- Show summary of changes

## Command Usage

```
/upgrade check    # Preview what would be updated
/upgrade          # Interactive upgrade
/upgrade force    # Batch upgrade with auto-approve safe updates
```

## Safety Features

- Complete backup before changes
- File-by-file confirmation
- Rollback support
- User content always protected
