---
description: Install claudesidian shell command to launch from anywhere
---

# Install Claudesidian Command

Creates a shell alias/function that allows you to run `claudesidian` from
anywhere to open your vault in OpenCode or Claude Code.

## Task

Install a shell command that:
1. Changes to your claudesidian vault directory
2. Launches your preferred AI coding assistant
3. Works from any directory in your terminal

## Process

### 1. Detect Current Setup

- Check which shell (bash/zsh/fish)
- Find the current working directory (vault path)
- Determine the appropriate config file

### 2. Create the Command

The command will be an alias that:
- Changes to vault directory
- Tries to resume existing session
- Falls back to new session if none exists

### 3. Install to Shell Config

Add the alias to:
- **Bash**: `~/.bashrc` or `~/.bash_profile`
- **Zsh**: `~/.zshrc`
- **Fish**: `~/.config/fish/config.fish`

### 4. Verify Installation

- Show the added line
- Remind user to reload shell
- Provide test command

## Shell Commands Created

**For OpenCode users:**
```bash
alias claudesidian='(cd "/path/to/vault" && (opencode --resume 2>/dev/null || opencode))'
```

**For Claude Code users:**
```bash
alias claudesidian='(cd "/path/to/vault" && (claude --resume 2>/dev/null || claude))'
```

## Example Output

```
🔧 Installing claudesidian command...

📁 Vault path: /home/user/my-vault
🐚 Shell detected: zsh
📝 Config file: ~/.zshrc

💾 Backup created: ~/.zshrc.backup-20250107-143025

✅ Installed! Added to ~/.zshrc:
   alias claudesidian='(cd "/home/user/my-vault" && ...)'

🔄 To activate, run:
   source ~/.zshrc

✨ Test it: Type 'claudesidian' from any directory!
```

## Usage Examples

```bash
# Install for default shell (auto-detected)
/install-claudesidian-command

# Install for specific shell
/install-claudesidian-command zsh
/install-claudesidian-command bash
/install-claudesidian-command fish
```

## Security Considerations

- You'll see exactly what will be added before changes
- Timestamped backup is created automatically
- Vault path is properly escaped
- Asks permission before replacing existing commands
