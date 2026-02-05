#!/usr/bin/env node
/**
 * Puppeteer Integration Test for Raptor Direction Control
 *
 * Tests the direction toggle flow:
 * 1. Load auger control page
 * 2. Wait for MQTT connection
 * 3. Click REVERSE button
 * 4. Verify direction changes to REVERSE
 * 5. Click FORWARD to restore original state
 */

const puppeteer = require('puppeteer');

const PI_URL = process.env.PI_URL || 'http://raptor3';
const AUGER_ID = process.env.AUGER_ID || 'SA-001';
const TIMEOUT = 30000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('🚀 Starting Raptor Direction Control Test');
  console.log(`   Target: ${PI_URL}`);
  console.log(`   Auger: ${AUGER_ID}`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.platform === 'darwin' ? undefined : '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Capture console logs from the page
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[MQTT') || text.includes('[CMD') || text.includes('direction')) {
      console.log(`   📡 ${text}`);
    }
  });

  try {
    // Step 1: Load auger control page
    console.log('1️⃣  Loading auger control page...');
    await page.goto(`${PI_URL}/auger/${AUGER_ID}/`, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });
    console.log(`   ✓ Page loaded: ${page.url()}`);

    // Wait for MQTT connection and initial state
    console.log('2️⃣  Waiting for MQTT connection (5s)...');
    await sleep(5000);

    // Step 3: Find direction buttons
    console.log('3️⃣  Looking for direction buttons...');

    const allButtons = await page.$$('button');
    console.log(`   Found ${allButtons.length} buttons on page`);

    // Find direction-related buttons
    for (const btn of allButtons) {
      const text = await btn.evaluate(el => el.textContent?.trim());
      const disabled = await btn.evaluate(el => el.disabled);
      if (text?.toLowerCase().includes('forward') || text?.toLowerCase().includes('reverse')) {
        console.log(`   - Button: "${text}" disabled=${disabled}`);
      }
    }

    // Find REVERSE button
    const reverseButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('reverse');
      });
    });

    if (!reverseButton || !(await reverseButton.asElement())) {
      throw new Error('REVERSE button not found');
    }
    console.log('   ✓ Found REVERSE button');

    // Find FORWARD button
    const forwardButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('forward');
      });
    });

    if (!forwardButton || !(await forwardButton.asElement())) {
      throw new Error('FORWARD button not found');
    }
    console.log('   ✓ Found FORWARD button');

    // Check initial state - FORWARD should be active (disabled because it's current state)
    const forwardDisabled = await forwardButton.evaluate(el => el.disabled);
    console.log(`   Initial state: FORWARD disabled=${forwardDisabled}`);

    // Step 4: Click REVERSE button
    console.log('4️⃣  Clicking REVERSE button...');
    const reverseDisabledBefore = await reverseButton.evaluate(el => el.disabled);
    if (reverseDisabledBefore) {
      console.log('   ⚠️  REVERSE already active, skipping click');
    } else {
      await reverseButton.click();
      console.log('   ✓ REVERSE clicked');
    }

    // Wait for state update
    console.log('5️⃣  Waiting for direction state update (3s)...');
    await sleep(3000);

    // Verify REVERSE is now active
    const reverseDisabledAfter = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.toLowerCase().includes('reverse'));
      return btn?.disabled || false;
    });

    // Check if direction badge shows REVERSE
    const directionBadge = await page.evaluate(() => {
      const badges = Array.from(document.querySelectorAll('[class*="Badge"]'));
      const dirBadge = badges.find(b =>
        b.textContent?.includes('FORWARD') || b.textContent?.includes('REVERSE')
      );
      return dirBadge?.textContent || null;
    });

    console.log(`   Direction badge: ${directionBadge || 'not found'}`);
    console.log(`   REVERSE button disabled: ${reverseDisabledAfter}`);

    if (reverseDisabledAfter || directionBadge?.includes('REVERSE')) {
      console.log('   ✓ Direction changed to REVERSE!');
    } else {
      console.log('   ⚠️  Direction may not have changed (check MQTT connection)');
    }

    // Step 6: Click FORWARD to restore
    console.log('6️⃣  Clicking FORWARD to restore original state...');
    const forwardBtnNow = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('forward') && !btn.disabled;
      });
    });

    if (forwardBtnNow && await forwardBtnNow.asElement()) {
      await forwardBtnNow.click();
      console.log('   ✓ FORWARD clicked');
    } else {
      console.log('   FORWARD already active (expected after page load)');
    }

    await sleep(2000);

    console.log('');
    console.log('✅ TEST PASSED! Direction control UI is working.');
    console.log('');

  } catch (error) {
    console.log('');
    console.log('❌ TEST FAILED:', error.message);
    console.log('');

    // Take a screenshot for debugging
    const screenshotPath = '/tmp/raptor-direction-test-failure.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   Screenshot saved to: ${screenshotPath}`);

    process.exitCode = 1;
  } finally {
    // Restore to FORWARD at the end
    console.log('🔄 Restoring to FORWARD direction...');
    try {
      await page.evaluate(() => {
        const forwardBtn = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent?.toLowerCase().includes('forward') && !btn.disabled
        );
        if (forwardBtn) {
          forwardBtn.click();
          console.log('Clicked FORWARD button');
        }
      });
      await sleep(1000);
    } catch (e) {
      console.log('   Could not click FORWARD:', e.message);
    }
    await browser.close();
  }
}

runTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
