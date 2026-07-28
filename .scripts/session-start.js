import { existsSync } from 'node:fs'
import { join } from 'node:path'

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()

if (existsSync(join(projectDir, 'FIRST_RUN'))) {
  const additionalContext = `

# 🚀 Welcome to Claudesidian!

**This appears to be your first time using this vault.**

## Quick Start

Run the setup wizard:

⬇
/init-bootstrap
⬆

## What this will do:

✅ Set up your personalized configuration
✅ Disconnect from the original repository
✅ Help you import any existing Obsidian vault
✅ Configure your preferred workflow
✅ Create your PARA folder structure

The setup wizard will guide you through everything!

`

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    }),
  )
}
