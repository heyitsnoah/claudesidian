#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type BrowserContext, chromium, type Page } from 'playwright'

import { NOTEBOOK_URL } from './lib/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_DIR = path.resolve(__dirname, '../../.kindle/auth')

/**
 * Check if authentication is successful by verifying page state
 */
async function checkAuthenticationSuccess(page: Page): Promise<boolean> {
  try {
    // If library loads, we're authenticated
    const count = await page.locator('#kp-notebook-library').count()
    return count > 0
  } catch (_error) {
    return false
  }
}

/**
 * Poll the page until authentication is successful or timeout
 */
async function waitForAuthenticationSuccess(
  page: Page,
  timeoutMs = 300000,
): Promise<boolean> {
  const startTime = Date.now()
  const pollInterval = 2000 // Check every 2 seconds

  console.log('⏳ Waiting for authentication to complete...')
  console.log(
    '   (Polling page state automatically - this may take a few minutes)\n',
  )

  while (Date.now() - startTime < timeoutMs) {
    const isAuthenticated = await checkAuthenticationSuccess(page)

    if (isAuthenticated) {
      return true
    }

    // Wait before next check
    await page.waitForTimeout(pollInterval)
  }

  throw new Error('Authentication timeout - please try again')
}

/**
 * Interactive authentication - opens browser for user to log in
 */
async function main(): Promise<void> {
  console.log('🔐 Kindle Authentication\n')
  console.log('📁 Session will be saved to:', AUTH_DIR)
  console.log('⏱️  Timeout: 5 minutes\n')

  const ctx: BrowserContext = await chromium.launchPersistentContext(AUTH_DIR, {
    headless: false,
    viewport: { height: 900, width: 1000 },
    // Position on right side of screen (works for most screen sizes)
    args: ['--window-position=50,50'],
  })

  const page = await ctx.newPage()

  try {
    console.log('🌐 Opening Amazon Kindle Notebook...\n')
    await page.goto(NOTEBOOK_URL, { waitUntil: 'load' })

    console.log('📖 INSTRUCTIONS:')
    console.log('   1. Log in to Amazon in the browser window')
    console.log('   2. Wait for your Kindle library/highlights to load')
    console.log('   3. Authentication will be saved automatically!\n')
    console.log("   💡 The script will detect when you're logged in.\n")

    // Wait for successful authentication (auto-detected)
    await waitForAuthenticationSuccess(page)

    console.log('\n✅ Authentication detected! Saving session...\n')

    // Wait for network to settle
    await page.waitForLoadState('networkidle').catch(() => {
      console.log('   (Network still active, continuing anyway)')
    })

    // Get final state
    const finalUrl = page.url()
    console.log(`   📍 Final URL: ${finalUrl}`)

    // Clean up redirect parameters if needed
    if (finalUrl.includes('openid') && !finalUrl.includes('signin')) {
      console.log('   🔄 Cleaning up redirect parameters...')
      await page.goto(NOTEBOOK_URL, { waitUntil: 'networkidle' })
    }

    // Verify cookies
    const cookies = await ctx.cookies()
    const hasXMain = cookies.some((c) => c.name === 'x-main')
    const hasSessionToken = cookies.some((c) => c.name === 'session-token')

    console.log(
      `   🍪 Auth cookies: x-main=${hasXMain}, session-token=${hasSessionToken}`,
    )

    if (!hasSessionToken) {
      console.log(
        '\n⚠️  Warning: Session token not found. Authentication may be incomplete.',
      )
      console.log('   Try running /kindle-sync again if sync fails.')
    }

    await ctx.close()

    console.log('\n✅ Authentication saved successfully!\n')
    console.log('Next steps:')
    console.log('   • Run /kindle-sync to sync your highlights')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('\n❌ Authentication failed:', errorMessage)
    console.log('\nTroubleshooting:')
    console.log('   • Make sure you fully logged in to Amazon')
    console.log('   • Verify your book library is visible in the browser')
    console.log('   • Try running /kindle-sync again\n')
    await ctx.close()
    process.exit(1)
  }
}

main().catch((error: unknown) => {
  console.error('❌ Authentication failed:', error)
  process.exit(1)
})
