import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.REVIEW_SCREENSHOT_DIR ?? 'review-screenshots';
const styles = ['painted', 'graphic', 'clay'];
const roles = ['woman', 'man', 'elder', 'noble', 'sovereign'];
const errors = [];
const checks = [];
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1560, height: 1100 }, deviceScaleFactor: 1 });
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => {
  if (response.url().includes('/portrait-art-reboot/') && response.status() >= 400) errors.push(`Asset ${response.status()}: ${response.url()}`);
});
async function ready() {
  await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-art-portrait] img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
}
async function screenshot(name, target = page) {
  await ready();
  await target.screenshot({ path: `${outDir}/${name}.png`, ...(target === page ? { fullPage: true } : {}) });
}
async function noOverflow(label) {
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(dimensions.scroll <= dimensions.width + 1, `${label}: horizontal page overflow ${JSON.stringify(dimensions)}`);
}
try {
  await page.goto(`${baseUrl}/?view=portrait-art-reboot`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-art-reboot="true"]');
  await ready();
  assert.equal(await page.locator('.portrait-renderer').count(), 0, 'Art study must not render the production portrait system.');
  assert.deepEqual(await page.locator('[data-art-direction]').evaluateAll((sections) => sections.map((section) => section.dataset.artDirection)), styles);
  for (const style of styles) {
    const section = page.locator(`[data-art-direction="${style}"]`);
    assert.deepEqual(await section.locator('[data-art-card]').evaluateAll((cards) => cards.map((card) => card.dataset.artCard)), roles);
    assert.equal(await section.locator('[data-art-portrait]').count(), 5);
  }
  const assets = await page.locator('[data-art-gallery] img').evaluateAll((images) => images.map((image) => ({ url: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight })));
  assert.equal(new Set(assets.map((asset) => asset.url)).size, 3, 'Exactly three local sprite assets are expected.');
  assert.ok(assets.every((asset) => asset.width === asset.height * 5 && asset.height >= 192), 'Each sprite must hold five square portraits at at least 192 px.');
  await noOverflow('desktop gallery');
  checks.push('3 independent asset sheets / 5 roles each / all assets decoded / production renderer isolated');
  await screenshot('80-art-reboot-overview');
  for (const [index, style] of styles.entries()) {
    const section = page.locator(`[data-art-direction="${style}"]`);
    await section.locator('summary').click();
    await screenshot(`${81 + index}-art-reboot-${style}`, section);
    await section.locator('summary').click();
  }
  const elderTrigger = page.getByRole('button', { name: '对照老年居民 · 市井绘本', exact: true });
  await elderTrigger.click();
  const dialog = page.locator('[data-role-comparison]');
  assert.equal(await dialog.evaluate((element) => element.open), true);
  assert.equal(await dialog.locator('[data-art-role="elder"]').count(), 3);
  await screenshot('84-art-reboot-elder-comparison', dialog);
  await page.keyboard.press('Escape');
  assert.equal(await dialog.evaluate((element) => element.open), false);
  assert.equal(await elderTrigger.evaluate((button) => button === document.activeElement), true, 'Closing the dialog must restore keyboard focus.');
  await page.getByRole('button', { name: '对照贵族女性 · 绢色人物', exact: true }).click();
  await screenshot('85-art-reboot-noble-comparison', dialog);
  await page.getByRole('button', { name: '关闭角色对照', exact: true }).click();
  checks.push('Same-role comparison / native modal / Escape and button close / focus restoration');

  await page.getByRole('button', { name: '暂选市井绘本', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: '暂选市井绘本', exact: true }).getAttribute('aria-pressed'), 'true');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出候选清单 ↓', exact: true }).click();
  const download = await downloadPromise;
  const exportPath = `${outDir}/portrait-art-review-export.json`;
  await download.saveAs(exportPath);
  const exported = JSON.parse(await readFile(exportPath, 'utf8'));
  assert.deepEqual(exported.shortlistedDirections, ['graphic']);
  assert.equal(exported.format, 'wanhu.portrait-art-review.v1');
  await page.getByRole('button', { name: '暂选市井绘本', exact: true }).click();
  checks.push('Shortlist toggles and JSON export; no production data writes');

  await page.getByRole('button', { name: '切换深浅底色', exact: true }).click();
  assert.equal(await page.locator('[data-art-reboot]').getAttribute('data-tone'), 'dark');
  await screenshot('86-art-reboot-dark');
  await page.getByRole('button', { name: '48 / 64 / 96 px', exact: true }).click();
  assert.equal(await page.locator('[data-art-pixels] [data-art-portrait]').count(), 45);
  const dimensions = await page.locator('[data-art-pixels] [data-art-portrait]').evaluateAll((items) => items.map((item) => {
    const bounds = item.getBoundingClientRect();
    return { style: item.dataset.artStyle, role: item.dataset.artRole, expected: Number(item.dataset.artSize), width: bounds.width, height: bounds.height };
  }));
  for (const entry of dimensions) {
    assert.ok(Math.abs(entry.expected - entry.width) < 0.1 && Math.abs(entry.expected - entry.height) < 0.1, `Wrong native pixel size: ${JSON.stringify(entry)}`);
  }
  assert.equal(new Set(dimensions.map((entry) => `${entry.style}:${entry.role}:${entry.expected}`)).size, 45);
  await screenshot('87-art-reboot-pixels-dark');
  await page.getByRole('button', { name: '切换深浅底色', exact: true }).click();
  await screenshot('88-art-reboot-pixels-light');
  checks.push('45 real-size cells: 3 directions × 5 roles × 48/64/96 CSS px; light and dark backgrounds');

  await page.setViewportSize({ width: 390, height: 844 });
  await noOverflow('mobile pixel page');
  await screenshot('89-art-reboot-mobile-pixels');
  await page.getByRole('button', { name: '方向对比', exact: true }).click();
  await noOverflow('mobile gallery');
  await screenshot('90-art-reboot-mobile-gallery');
  await page.getByRole('button', { name: '对照贵族女性 · 市井绘本', exact: true }).click();
  await noOverflow('mobile modal');
  assert.equal(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true);
  await page.keyboard.press('Escape');
  checks.push('390 px mobile gallery, pixels and modal: no horizontal overflow');
  assert.deepEqual(errors, [], 'Browser or asset errors occurred.');
  await writeFile(`${outDir}/portrait-art-reboot-checks.json`, JSON.stringify({
    commit: process.env.GITHUB_SHA ?? null,
    status: 'automated-checks-passed',
    visualApproval: 'Requires human inspection of these exact screenshots; not implied by this status.',
    screenshotDeviceScaleFactor: 1,
    screenshotDesktopWidth: 1560,
    checks,
    dimensions,
  }, null, 2));
  console.log(`Portrait Art Reboot: ${checks.length} check groups passed. Screenshots still require visual review.`);
} catch (error) {
  await page.screenshot({ path: `${outDir}/99-art-reboot-failure.png`, fullPage: true }).catch(() => {});
  throw error;
} finally {
  await browser.close();
}
