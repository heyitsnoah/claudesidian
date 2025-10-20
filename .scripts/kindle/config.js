#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_DIR = path.resolve(__dirname, '../../.kindle')
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json')

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  addTags: ['kindle', 'highlights', 'books'],
  lastSync: null,
  outputFolder: '03_Resources/Kindle Highlights',
  overwrite: false,
  templatePath: '.scripts/kindle/templates/kindle-note.md.hbs',
}

/**
 * Load configuration from file, or create with defaults if it doesn't exist
 */
export async function loadConfig() {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8')
    const config = JSON.parse(content)
    // Merge with defaults to ensure all fields are present
    return { ...DEFAULT_CONFIG, ...config }
  } catch (_error) {
    // Config doesn't exist, create it with defaults
    console.log('📝 Creating default configuration...')
    await saveConfig(DEFAULT_CONFIG)
    return DEFAULT_CONFIG
  }
}

/**
 * Save configuration to file
 */
export async function saveConfig(config) {
  await fs.mkdir(CONFIG_DIR, { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

/**
 * Update specific config fields
 */
export async function updateConfig(updates) {
  const config = await loadConfig()
  const updatedConfig = { ...config, ...updates }
  await saveConfig(updatedConfig)
  return updatedConfig
}

/**
 * Show current configuration
 */
async function showConfig() {
  const currentConfig = await loadConfig()
  console.log('📋 Current Kindle Sync Configuration:\n')
  console.log(JSON.stringify(currentConfig, null, 2))
  console.log(`\n📁 Config file: ${CONFIG_PATH}`)
  console.log('📝 Edit this file directly to change settings\n')
}

/**
 * CLI interface
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command('show', 'Show current configuration')
    .command('reset', 'Reset to default configuration')
    .option('interactive', {
      alias: 'i',
      description: 'Run interactive configuration',
      type: 'boolean',
    })
    .option('set', {
      alias: 's',
      description: 'Set a config value (format: key=value)',
      type: 'string',
    })
    .help()
    .alias('h', 'help')
    .parseAsync()

  if (argv.interactive) {
    await showConfig()
  } else if (argv.set) {
    const [key, value] = argv.set.split('=')
    if (!key || value === undefined) {
      console.error('❌ Invalid format. Use: --set key=value')
      process.exit(1)
    }

    // Parse value (try JSON parse for objects/arrays, otherwise string)
    let parsedValue
    try {
      parsedValue = JSON.parse(value)
    } catch {
      parsedValue = value
    }

    await updateConfig({ [key]: parsedValue })
    console.log(`✅ Updated ${key} = ${JSON.stringify(parsedValue)}`)
    console.log(`\n📁 Config saved to: ${CONFIG_PATH}`)
  } else if (argv._[0] === 'reset') {
    await saveConfig(DEFAULT_CONFIG)
    console.log('✅ Configuration reset to defaults')
    console.log(JSON.stringify(DEFAULT_CONFIG, null, 2))
  } else {
    // Default: show config
    const config = await loadConfig()
    console.log('📋 Current Kindle Sync Configuration:\n')
    console.log(JSON.stringify(config, null, 2))
    console.log(`\n📁 Config file: ${CONFIG_PATH}`)
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
}
