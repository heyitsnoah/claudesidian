#!/usr/bin/env node

/**
 * Fixes attachment links after files have been renamed
 * Usage: node .scripts/fix-renamed-links.js <old-name> <new-name>
 *
 * This properly handles the case where files are renamed, not just moved
 */

import fs from 'node:fs'
import path from 'node:path'
import { getVaultFolders } from './vault-config.js'

const { attachments, attachmentsOrganized } = getVaultFolders()
const attachmentsPath = attachments.replaceAll('\\', '/')
const organizedPath = attachmentsOrganized.replaceAll('\\', '/')
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const attachmentsPattern = escapeRegex(attachmentsPath)

const args = process.argv.slice(2)

if (args.length !== 2) {
  console.log(
    'Usage: node .scripts/fix-renamed-links.js <old-filename> <new-filename>',
  )
  console.log(
    'Example: node .scripts/fix-renamed-links.js "CleanShot 2025-01-01.png" "Project Screenshot.png"',
  )
  process.exit(1)
}

const [oldName, newName] = args
const newPath = `${organizedPath}/${newName}`

console.log(`Fixing links: ${oldName} → ${newName}`)

// Function to walk directory
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    if (isDirectory) {
      // Skip node_modules, .git
      if (!f.includes('node_modules') && !f.includes('.git')) {
        walkDir(dirPath, callback)
      }
    } else {
      callback(path.join(dir, f))
    }
  })
}

// Process all markdown files
let updatedCount = 0
const updatedFiles = []

walkDir('.', (filepath) => {
  if (filepath.endsWith('.md')) {
    let content = fs.readFileSync(filepath, 'utf8')
    const originalContent = content

    // Escape special regex characters in filename
    const escapedOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Pattern 1: ![[oldname]] without path
    const pattern1 = new RegExp(`!\\[\\[${escapedOld}\\]\\]`, 'g')
    content = content.replace(pattern1, `![[${newPath}]]`)

    // Pattern 2: ![[05_Attachments/oldname]]
    const pattern2 = new RegExp(
      `!\\[\\[${attachmentsPattern}/${escapedOld}\\]\\]`,
      'g',
    )
    content = content.replace(pattern2, `![[${newPath}]]`)

    // Pattern 3: [[oldname]] without ! (for PDFs and other non-embedded)
    const pattern3 = new RegExp(`(?<!!)\\[\\[${escapedOld}\\]\\]`, 'g')
    content = content.replace(pattern3, `[[${newPath}]]`)

    // Pattern 4: [[05_Attachments/oldname]] without !
    const pattern4 = new RegExp(
      `(?<!!)\\[\\[${attachmentsPattern}/${escapedOld}\\]\\]`,
      'g',
    )
    content = content.replace(pattern4, `[[${newPath}]]`)

    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(filepath, content, 'utf8')
      updatedFiles.push(filepath)
      updatedCount++
    }
  }
})

// Report results
if (updatedCount > 0) {
  console.log(`\nUpdated ${updatedCount} files:`)
  updatedFiles.forEach((file) => console.log(`  - ${file}`))
} else {
  console.log('\nNo files needed updating')
}

console.log('\nDone!')
