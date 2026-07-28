import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getFirstRunContext(projectDir) {
  if (!existsSync(join(projectDir, 'FIRST_RUN'))) {
    return null
  }

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

  return additionalContext
}

function emitSessionStartContext() {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const additionalContext = getFirstRunContext(projectDir)

  if (!additionalContext) {
    return
  }

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    }),
  )
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  emitSessionStartContext()
}
