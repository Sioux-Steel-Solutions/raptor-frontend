#!/usr/bin/env node
/**
 * Puppeteer Integration Test for Raptor Sweep Control
 *
 * Tests the full flow:
 * 1. Load auger control page directly
 * 2. Wait for MQTT connection
 * 3. Click START button
 * 4. Wait for STOP button to become active (proves MQTT worked)
 * 5. Click STOP to clean up
 */

const puppeteer = require('puppeteer');

const PI_URL = process.env.PI_URL || 'http://raptor3';
const AUGER_ID = process.env.AUGER_ID || 'SA-001';
const TIMEOUT = 30000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('🚀 Starting Raptor Sweep Control Test');
  console.log(`   Target: ${PI_URL}`);
  console.log(`   Auger: ${AUGER_ID}`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Capture console logs from the page
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[MQTT') || text.includes('error') || text.includes('Error') || text.includes('WebSocket')) {
      console.log(`   📡 ${text}`);
    }
  });

  try {
    // Step 0: Test raw WebSocket connection first
    console.log('0️⃣  Testing raw WebSocket connection from browser...');

    // Load a simple page first
    await page.goto(`${PI_URL}/auger/${AUGER_ID}/`, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Test raw WebSocket connection from the browser context
    const wsResult = await page.evaluate(async () => {
      const CLOUD_URL = 'ws://3.141.116.27:9001';

      return new Promise((resolve) => {
        const results = {
          url: CLOUD_URL,
          opened: false,
          closed: false,
          error: null,
          closeCode: null,
          closeReason: null,
          protocol: null,
          readyState: null
        };

        try {
          // Try with 'mqtt' subprotocol (required by Mosquitto)
          const ws = new WebSocket(CLOUD_URL, 'mqtt');

          ws.onopen = () => {
            results.opened = true;
            results.protocol = ws.protocol;
            results.readyState = ws.readyState;
            // Close after successful open
            ws.close();
          };

          ws.onclose = (event) => {
            results.closed = true;
            results.closeCode = event.code;
            results.closeReason = event.reason;
            results.wasClean = event.wasClean;
            results.readyState = ws.readyState;
            resolve(results);
          };

          ws.onerror = (event) => {
            results.error = 'WebSocket error occurred';
            results.readyState = ws.readyState;
          };

          // Timeout after 5 seconds
          setTimeout(() => {
            if (!results.opened && !results.closed) {
              results.error = 'Timeout waiting for connection';
              ws.close();
              resolve(results);
            }
          }, 5000);

        } catch (err) {
          results.error = err.message;
          resolve(results);
        }
      });
    });

    console.log('   Raw WebSocket test results:');
    console.log(`   - URL: ${wsResult.url}`);
    console.log(`   - Opened: ${wsResult.opened}`);
    console.log(`   - Closed: ${wsResult.closed}`);
    console.log(`   - Close code: ${wsResult.closeCode}`);
    console.log(`   - Close reason: ${wsResult.closeReason || '(none)'}`);
    console.log(`   - Protocol: ${wsResult.protocol || '(none)'}`);
    console.log(`   - Error: ${wsResult.error || '(none)'}`);
    console.log('');


    // Step 1: Load auger control page directly
    console.log('1️⃣  Loading auger control page...');
    console.log(`   ✓ Page loaded: ${page.url()}`);

    // Wait for MQTT connection
    console.log('2️⃣  Waiting for MQTT connection (10s)...');
    await sleep(10000); // Give MQTT time to connect and receive initial state

    // Step 3: Find the START button
    console.log('3️⃣  Looking for START button...');

    // First, list all buttons on the page for debugging
    const allButtons = await page.$$('button');
    console.log(`   Found ${allButtons.length} buttons on page`);

    for (const btn of allButtons) {
      const text = await btn.evaluate(el => el.textContent?.trim());
      const disabled = await btn.evaluate(el => el.disabled);
      const classes = await btn.evaluate(el => el.className);
      console.log(`   - Button: "${text}" disabled=${disabled}`);
    }

    // Look for a button that says "Start" or has start-related text
    const startButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('start') && !btn.disabled;
      });
    });

    if (!startButton || !(await startButton.asElement())) {
      throw new Error('START button not found or disabled - MQTT may not be connected');
    }

    const startText = await startButton.evaluate(el => el.textContent);
    console.log(`   ✓ Found START button: "${startText?.trim()}"`);

    // Click START
    console.log('4️⃣  Clicking START...');
    await startButton.click();
    console.log('   ✓ START clicked');

    // Step 4: Wait for STOP button to become enabled
    console.log('5️⃣  Waiting for STOP button to become active (10s)...');

    let stopEnabled = false;
    const maxWait = 10000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const stopButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => {
          const text = btn.textContent?.toLowerCase() || '';
          return text.includes('stop') && !btn.disabled;
        });
      });

      if (stopButton && await stopButton.asElement()) {
        stopEnabled = true;
        console.log('   ✓ STOP button is now ACTIVE!');

        // Click STOP to clean up
        console.log('6️⃣  Clicking STOP to clean up...');
        await stopButton.click();
        console.log('   ✓ STOP clicked');
        break;
      }

      await sleep(500);
    }

    if (!stopEnabled) {
      // Check current button states
      console.log('   Current button states after waiting:');
      const btns = await page.$$('button');
      for (const btn of btns) {
        const text = await btn.evaluate(el => el.textContent?.trim());
        const disabled = await btn.evaluate(el => el.disabled);
        if (text?.toLowerCase().includes('start') || text?.toLowerCase().includes('stop')) {
          console.log(`   - "${text}": disabled=${disabled}`);
        }
      }
      throw new Error('STOP button never became active - MQTT command may have failed');
    }

    console.log('');
    console.log('✅ TEST PASSED! Sweep control is working end-to-end.');
    console.log('');

  } catch (error) {
    console.log('');
    console.log('❌ TEST FAILED:', error.message);
    console.log('');

    // Take a screenshot for debugging
    const screenshotPath = '/tmp/raptor-test-failure.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   Screenshot saved to: ${screenshotPath}`);

    process.exitCode = 1;
  } finally {
    // ALWAYS send stop command at the end to prevent runaway VFD
    console.log('🛑 Sending safety STOP command...');
    try {
      await page.evaluate(() => {
        // Click any STOP button that's enabled
        const stopBtn = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent?.toLowerCase().includes('stop') && !btn.disabled
        );
        if (stopBtn) {
          stopBtn.click();
          console.log('Clicked STOP button');
        }
      });
      await sleep(1000);
    } catch (e) {
      console.log('   Could not click STOP:', e.message);
    }
    await browser.close();
  }
}

runTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
