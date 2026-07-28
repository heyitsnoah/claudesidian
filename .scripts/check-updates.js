import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageUrl =
  'https://raw.githubusercontent.com/heyitsnoah/claudesidian/main/package.json'

async function main() {
  try {
    const localPackage = JSON.parse(
      await readFile(join(projectRoot, 'package.json'), 'utf8'),
    )
    const response = await fetch(packageUrl, {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return

    const remotePackage = await response.json()
    if (
      !remotePackage.version ||
      remotePackage.version === localPackage.version
    ) {
      return
    }

    console.log(`📦 Update available! Latest: ${remotePackage.version} (you have: ${localPackage.version})

⬇
/upgrade
⬆

## What will this do

✅ Update to the latest version of Claudesidian
✅ Get new features and improvements
✅ Preserve your vault content and settings
`)
  } catch {
    // Update checks are advisory; startup should remain silent offline.
  }
}

await main()
