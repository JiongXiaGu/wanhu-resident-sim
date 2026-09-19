import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
// 子目录不进入旧的有损缩图脚本：原尺寸检查必须保留原始 PNG。
const outDir = 'review-screenshots/art-directions';
await mkdir(join(outDir, 'study-exports'), { recursive: true });
const ids = ['silk', 'clay', 'ink'];
const roles = ['woman', 'man', 'elder', 'child', 'noble', 'ruler'];
const checks = [];
async function inspectIsolation(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await inspectIsolation(path);
    else if (/\.(ts|tsx)$/.test(path)) {
      const text = await readFile(path, 'utf8');
      assert(!/from\s+['"][^'"]*(?:resident\/portrait|portrait-style-bakeoff|portrait-style-study)/.test(text), `Production/legacy art import: ${path}`);
    }
  }
}
await inspectIsolation('Web/src/portrait-art-directions');
checks.push('No production or historical art imports');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
async function ready() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('img')].map(image => image.decode()));
  });
}
async function screenshot(name, locator = page) {
  await ready();
  if (locator === page) await page.screenshot({ path: join(outDir, name + '.png'), fullPage: true, animations: 'disabled', caret: 'hide' });
  else await locator.screenshot({ path: join(outDir, name + '.png'), animations: 'disabled', caret: 'hide' });
}
async function pixelSizes() {
  const actual = await page.locator('[data-pixel-size]').evaluateAll(images => images.map(image => {
    const bounds = image.getBoundingClientRect();
    return { expected: Number(image.dataset.pixelSize), width: bounds.width, height: bounds.height };
  }));
  assert(actual.length > 0, 'No pixel-size samples');
  for (const item of actual) {
    assert.equal(item.width, item.expected);
    assert.equal(item.height, item.expected);
  }
  return actual.length;
}
async function noOverflow() {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal page overflow');
}
try {
  await page.goto(baseUrl + '/?view=portrait-art-directions', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-art-directions="true"]');
  await ready();
  assert.deepEqual(await page.locator('[data-direction]').evaluateAll(items => items.map(item => item.dataset.direction)), ids);
  assert.equal(await page.locator('.portrait-renderer').count(), 0);
  const exports = [];
  for (const id of ids) {
    const section = page.locator(`[data-direction="${id}"]`);
    assert.deepEqual(await section.locator('[data-study-role]').evaluateAll(items => items.map(item => item.dataset.studyRole)), roles);
    const sources = await section.locator('.pad-art-button img').evaluateAll(images => images.map(image => image.src));
    assert.equal(sources.length, 6);
    for (const [index, source] of sources.entries()) {
      const svg = decodeURIComponent(source.slice(source.indexOf(',') + 1));
      assert(svg.startsWith('<svg '));
      assert(!/<image\b|<script\b|<foreignObject\b/i.test(svg), 'Unexpected external/raster content');
      const name = `wanhu-${id}-${roles[index]}-study`;
      await writeFile(join(outDir, 'study-exports', name + '.svg'), svg);
      await sharp(Buffer.from(svg)).resize(256, 256).png().toFile(join(outDir, 'study-exports', name + '.png'));
      exports.push(svg);
    }
    await screenshot(`81-${id}-paper`, section);
  }
  assert.equal(new Set(exports).size, 18, 'Expected 18 unique character drawings');
  checks.push('3 directions × 6 unique role drawings; transparent SVG/PNG exports');
  await noOverflow();
  await screenshot('80-all-directions-paper');

  await page.locator('[data-background-button="night"]').click();
  assert.equal(await page.locator('[data-art-directions]').getAttribute('data-background'), 'night');
  for (const id of ids) await screenshot(`82-${id}-night`, page.locator(`[data-direction="${id}"]`));
  checks.push('Same transparent art on paper and night backgrounds');
  await page.locator('[data-background-button="paper"]').click();

  for (const id of ids) {
    await page.locator(`[data-filter="${id}"]`).click();
    assert.equal(await page.locator('[data-direction]').count(), 1);
    assert.equal(await page.locator('[data-direction]').getAttribute('data-direction'), id);
    for (const role of ['woman', 'noble']) {
      const button = page.locator(`[data-open-study="${role}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      assert(await page.locator('dialog').evaluate(dialog => dialog.open));
      await ready();
      assert.equal(await pixelSizes(), 3);
      await screenshot(`83-${id}-${role}-detail`, page.locator('dialog'));
      if (id === 'silk' && role === 'woman') {
        const downloadEvent = page.waitForEvent('download');
        await page.getByRole('button', { name: '导出这张研究稿 SVG' }).click();
        const download = await downloadEvent;
        assert.equal(download.suggestedFilename(), 'wanhu-silk-woman-study.svg');
        const stream = await download.createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        assert.equal(Buffer.concat(chunks).toString('utf8'), exports[0]);
      }
      await page.keyboard.press('Escape');
      assert(!(await page.locator('dialog').evaluate(dialog => dialog.open)));
      assert(await button.evaluate(element => element === document.activeElement), 'Dialog did not restore focus');
    }
  }
  checks.push('Style filters; keyboard-opened dialogs; Escape and focus restoration; SVG download');
  await page.locator('[data-filter="all"]').click();
  await page.locator('[data-pixel-toggle]').click();
  await ready();
  assert.equal(await pixelSizes(), 54);
  for (const id of ids) await screenshot(`84-${id}-actual-pixels`, page.locator(`[data-direction="${id}"]`));
  await screenshot('84-all-actual-pixels');
  await noOverflow();
  checks.push('All 54 samples exactly 96/64/48 CSS px at DPR 1; original unscaled PNG retained');
  await page.locator('[data-background-button="night"]').click();
  await screenshot('85-all-actual-pixels-night');
  await page.locator('[data-background-button="paper"]').click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-filter="clay"]').click();
  await noOverflow();
  assert.equal(await pixelSizes(), 18);
  await screenshot('86-mobile-actual-pixels');
  await page.locator('[data-pixel-toggle]').click();
  await noOverflow();
  await screenshot('86-mobile-studies');
  await page.locator('[data-open-study="noble"]').click();
  await screenshot('87-mobile-dialog', page.locator('dialog'));
  await page.getByRole('button', { name: '关闭角色近景' }).click();
  checks.push('390px responsive layout, unscaled small portraits and close-button interaction');
  assert.deepEqual(errors, [], 'Browser errors');
  checks.push('No browser JS/console/HTTP errors');
  await writeFile(join(outDir, 'review.json'), JSON.stringify({
    commit: process.env.GITHUB_SHA ?? 'local', viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce',
    checks, status: 'automated-pass', artisticApproval: 'Requires actual image inspection; not certified by CI',
    productionStatus: 'Independent concept studies; modular and Unity proofs not yet performed',
  }, null, 2));
  console.log(checks.join('\n'));
} finally {
  await browser.close();
}
