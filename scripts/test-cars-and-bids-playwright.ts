/**
 * ONE-TIME PROBE: Can Playwright + stealth load a Cars & Bids listing without getting blocked?
 *
 * Run once. No retries. No DB writes. No production wiring.
 * After testing: npm uninstall playwright playwright-extra puppeteer-extra-plugin-stealth
 */

import os from 'os';
import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright-extra';
// @ts-ignore — no type defs for this plugin
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const TEST_URL = 'https://carsandbids.com/auctions/9XNqB8Ep/2016-porsche-911-carrera-gts-club-coupe';

const USER_AGENTS: readonly string[] = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
];

function randomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function randomWaitMs(): number {
  // 8–12 seconds
  return 8000 + Math.floor(Math.random() * 4000);
}

async function main() {
  const tmpDir = os.tmpdir();
  const screenshotPath = path.join(tmpDir, 'cab-test.png');
  const htmlPath = path.join(tmpDir, 'cab-test.html');

  console.log('=== Cars & Bids Playwright Stealth Probe ===');
  console.log(`Target URL : ${TEST_URL}`);
  console.log(`Screenshot : ${screenshotPath}`);
  console.log(`HTML dump  : ${htmlPath}`);
  console.log('');

  chromium.use(StealthPlugin());

  const userAgent = randomUserAgent();
  const waitMs = randomWaitMs();
  console.log(`User-Agent : ${userAgent}`);
  console.log(`Wait time  : ${waitMs}ms`);
  console.log('');

  let browser;
  try {
    browser = await chromium.launch({
      headless: false, // HEADED — visible browser window, fewer fingerprint signals
      args: [
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--start-maximized',
      ],
    });

    const context = await browser.newContext({
      userAgent,
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/Denver',
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });

    const page = await context.newPage();

    console.log('Navigating...');
    const response = await page.goto(TEST_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const httpStatus = response?.status() ?? 'unknown';
    console.log(`HTTP status: ${httpStatus}`);

    // Hard 403 check before waiting
    if (httpStatus === 403) {
      console.log('');
      console.log('RESULT: 403_BLOCK — server returned HTTP 403 immediately');
      await page.screenshot({ path: screenshotPath, fullPage: false });
      const html = await page.content();
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log(`\nSaved screenshot: ${screenshotPath}`);
      console.log(`Saved HTML dump : ${htmlPath}`);
      printCleanupNote();
      return;
    }

    // Wait for JS rendering
    console.log(`Waiting ${waitMs}ms for JS rendering...`);
    await page.waitForTimeout(waitMs);

    // Capture state after wait
    const finalUrl = page.url();
    const pageTitle = await page.title();
    const html = await page.content();

    console.log(`Final URL  : ${finalUrl}`);
    console.log(`Page title : ${pageTitle}`);
    console.log(`HTML length: ${html.length} chars`);

    // Save artifacts
    await page.screenshot({ path: screenshotPath, fullPage: false });
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`\nSaved screenshot: ${screenshotPath}`);
    console.log(`Saved HTML dump : ${htmlPath}`);

    // --- Decision tree ---
    const titleLower = pageTitle.toLowerCase();
    const htmlLower = html.toLowerCase();

    if (
      titleLower.includes('just a moment') ||
      titleLower.includes('please wait') ||
      titleLower.includes('checking your browser') ||
      titleLower.includes('one more step') ||
      titleLower.includes('attention required') ||
      htmlLower.includes('cf-browser-verification') ||
      htmlLower.includes('cf_clearance') ||
      htmlLower.includes('ray id') && htmlLower.includes('cloudflare')
    ) {
      console.log('');
      console.log('RESULT: CLOUDFLARE_BLOCK — interstitial challenge detected');
      console.log(`  Title: ${pageTitle}`);
      console.log(`  Final URL: ${finalUrl}`);
      printCleanupNote();
      return;
    }

    if (
      titleLower.includes('403') ||
      titleLower.includes('forbidden') ||
      titleLower.includes('access denied')
    ) {
      console.log('');
      console.log('RESULT: 403_BLOCK — hard block detected in page title');
      console.log(`  Title: ${pageTitle}`);
      printCleanupNote();
      return;
    }

    // Look for listing-specific content
    const has2016 = html.includes('2016');
    const hasCarrera = htmlLower.includes('carrera');
    const hasGTS = html.includes('GTS') || html.includes('gts');
    const hasClubCoupe = htmlLower.includes('club coupe');

    // Price: C&B shows bid amounts — look for dollar signs near numbers
    const priceMatch = html.match(/\$[\d,]+/g);
    const prices = priceMatch ? Array.from(new Set(priceMatch)).slice(0, 5) : [];

    // Mileage: look for "X,XXX miles" or "XX,XXX miles"
    const mileageMatch = html.match(/[\d,]+ miles?/gi);
    const mileages = mileageMatch ? Array.from(new Set(mileageMatch)).slice(0, 3) : [];

    // Color: look for common Porsche colors
    const colorPatterns = ['white', 'black', 'silver', 'grey', 'gray', 'blue', 'red', 'yellow', 'green', 'orange', 'brown', 'beige'];
    const foundColors = colorPatterns.filter(c => htmlLower.includes(c));

    const listingSignalsFound = [has2016, hasCarrera, hasGTS, hasClubCoupe].filter(Boolean).length;

    if (listingSignalsFound >= 2) {
      console.log('');
      console.log('RESULT: SUCCESS — listing content detected in rendered HTML');
      console.log('');
      console.log('Extracted data:');
      console.log(`  Year detected     : ${has2016 ? '2016 ✓' : 'not found'}`);
      console.log(`  Carrera detected  : ${hasCarrera ? 'yes ✓' : 'not found'}`);
      console.log(`  GTS detected      : ${hasGTS ? 'yes ✓' : 'not found'}`);
      console.log(`  Club Coupe        : ${hasClubCoupe ? 'yes ✓' : 'not found'}`);
      console.log(`  Price values      : ${prices.length ? prices.join(', ') : 'not found'}`);
      console.log(`  Mileage           : ${mileages.length ? mileages.join(', ') : 'not found'}`);
      console.log(`  Colors mentioned  : ${foundColors.length ? foundColors.join(', ') : 'not found'}`);
    } else {
      console.log('');
      console.log('RESULT: OTHER_FAILURE — page loaded but listing content not found');
      console.log(`  Title: ${pageTitle}`);
      console.log(`  Listing signals found: ${listingSignalsFound}/4`);
      console.log(`  Year: ${has2016}, Carrera: ${hasCarrera}, GTS: ${hasGTS}, Club Coupe: ${hasClubCoupe}`);
      console.log('  Check the saved HTML dump to diagnose.');
    }

    printCleanupNote();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log('');
    console.log('RESULT: OTHER_FAILURE — exception during test');
    console.log(`  Error: ${msg}`);
    if (err instanceof Error && err.stack) {
      console.log(`  Stack: ${err.stack.split('\n').slice(0, 5).join('\n  ')}`);
    }
    printCleanupNote();
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function printCleanupNote() {
  console.log('');
  console.log('--- Cleanup ---');
  console.log('To remove temporary packages after reviewing results:');
  console.log('  npm uninstall playwright playwright-extra puppeteer-extra-plugin-stealth');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
