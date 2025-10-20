#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOTEBOOK_URL } from './lib/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_DIR = path.resolve(__dirname, '../../.kindle/auth');

/**
 * Check if authentication is successful by verifying page state
 */
async function checkAuthenticationSuccess(page) {
  try {
    const currentUrl = page.url();

    // Check 1: Look for the book library container (most important - indicates successful load)
    const hasLibrary = await page.locator('#kp-notebook-library, .kp-notebook-library').count() > 0;

    // Check 2: Verify auth cookies exist
    const cookies = await page.context().cookies();
    const hasSessionToken = cookies.some((c) => c.name === 'session-token');

    // Success if we have BOTH library and session token
    // URL can still have signin params even after successful login, so we check it last
    if (hasLibrary && hasSessionToken) {
      return { success: true };
    }

    // Determine specific failure reason for helpful feedback
    if (currentUrl.includes('signin') || currentUrl.includes('ap/signin')) {
      if (!hasLibrary && !hasSessionToken) {
        return { success: false, reason: 'Still on signin page' };
      }
    }

    if (!hasLibrary) {
      return { success: false, reason: 'Book library not loaded yet' };
    }

    if (!hasSessionToken) {
      return { success: false, reason: 'No session token found' };
    }

    return { success: false, reason: 'Waiting for authentication' };
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

/**
 * Poll the page until authentication is successful or timeout
 */
async function waitForAuthenticationSuccess(page, timeoutMs = 300000) {
  const startTime = Date.now();
  const pollInterval = 2000; // Check every 2 seconds

  console.log('⏳ Waiting for authentication to complete...');
  console.log('   (Polling page state automatically - this may take a few minutes)\n');

  let lastReason = '';

  while (Date.now() - startTime < timeoutMs) {
    const result = await checkAuthenticationSuccess(page);

    if (result.success) {
      return true;
    }

    // Only log if reason changed (reduce spam)
    if (result.reason !== lastReason) {
      console.log(`   🔍 Status: ${result.reason}...`);
      lastReason = result.reason;
    }

    // Wait before next check
    await page.waitForTimeout(pollInterval);
  }

  throw new Error('Authentication timeout - please try again');
}

/**
 * Interactive authentication - opens browser for user to log in
 */
async function main() {
  console.log('🔐 Kindle Authentication\n');
  console.log('📁 Session will be saved to:', AUTH_DIR);
  console.log('⏱️  Timeout: 5 minutes\n');

  const ctx = await chromium.launchPersistentContext(AUTH_DIR, {
    headless: false,
    viewport: { height: 900, width: 1000 },
    // Position on right side of screen (works for most screen sizes)
    args: ['--window-position=50,50'],
  });

  const page = await ctx.newPage();

  try {
    console.log('🌐 Opening Amazon Kindle Notebook...\n');
    await page.goto(NOTEBOOK_URL, { waitUntil: 'load' });

    console.log('📖 INSTRUCTIONS:');
    console.log('   1. Log in to Amazon in the browser window');
    console.log('   2. Wait for your Kindle library/highlights to load');
    console.log('   3. Authentication will be saved automatically!\n');
    console.log('   💡 The script will detect when you\'re logged in.\n');

    // Wait for successful authentication (auto-detected)
    await waitForAuthenticationSuccess(page);

    console.log('\n✅ Authentication detected! Saving session...\n');

    // Wait for network to settle
    await page.waitForLoadState('networkidle').catch(() => {
      console.log('   (Network still active, continuing anyway)');
    });

    // Get final state
    const finalUrl = page.url();
    console.log(`   📍 Final URL: ${finalUrl}`);

    // Clean up redirect parameters if needed
    if (finalUrl.includes('openid') && !finalUrl.includes('signin')) {
      console.log('   🔄 Cleaning up redirect parameters...');
      await page.goto(NOTEBOOK_URL, { waitUntil: 'networkidle' });
    }

    // Verify cookies
    const cookies = await ctx.cookies();
    const hasXMain = cookies.some((c) => c.name === 'x-main');
    const hasSessionToken = cookies.some((c) => c.name === 'session-token');

    console.log(
      `   🍪 Auth cookies: x-main=${hasXMain}, session-token=${hasSessionToken}`
    );

    if (!hasSessionToken) {
      console.log(
        '\n⚠️  Warning: Session token not found. Authentication may be incomplete.'
      );
      console.log('   Try running /kindle-auth again if sync fails.');
    }

    await ctx.close();

    console.log('\n✅ Authentication saved successfully!\n');
    console.log('Next steps:');
    console.log('   • Run /kindle-sync to sync your highlights');
    console.log('   • Or run /kindle-sync-all for a full re-scrape\n');
  } catch (error) {
    console.error('\n❌ Authentication failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('   • Make sure you fully logged in to Amazon');
    console.log('   • Verify your book library is visible in the browser');
    console.log('   • Try running /kindle-auth again\n');
    await ctx.close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Authentication failed:', error);
  process.exit(1);
});
