import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.REVIEW_SCREENSHOT_DIR || 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

async function open() {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('.resident-panel');
  await page.waitForSelector('.dev-panel');
  await page.waitForTimeout(180);
}

async function currentLifeEventId() {
  return page.locator('.dev-panel__row').filter({ hasText: 'LifeEvent' }).locator('b').innerText();
}

async function chooseLifeEvent(eventId) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    if ((await currentLifeEventId()) === eventId) return;
    await page.getByRole('button', { name: '换一件事', exact: true }).click();
    await page.waitForTimeout(40);
  }
  throw new Error(`Could not select prototype LifeEvent ${eventId}. Current=${await currentLifeEventId()}`);
}

await open();

if ((await page.locator('.resident-summary').count()) !== 0) {
  throw new Error('Resident Panel should not render a standalone recent-summary row.');
}

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });

await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.waitForTimeout(80);
await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.life-event-card');
if ((await page.locator('.life-event-prior').count()) < 1) {
  throw new Error('LifeEvent V2 should retain the previous stage as lightweight context after advancing.');
}
await page.screenshot({ path: `${outDir}/02-life-event-continuation.png` });

const historyButton = page.getByRole('button', { name: /人生经历/ });
await historyButton.click();
await page.waitForSelector('.resident-history-mode');
if ((await page.locator('.resident-activity').count()) !== 0) {
  throw new Error('Life history mode must hide the current activity section.');
}
if ((await page.locator('.resident-recent').count()) !== 0) {
  throw new Error('Life history mode must hide the current LifeEvent section.');
}
if ((await page.locator('.resident-routine-section').count()) !== 0) {
  throw new Error('Life history mode must hide routine entries.');
}
if ((await page.locator('.resident-life-stage__label').count()) !== 0) {
  throw new Error('Life history should be one continuous timeline without child/teen/adult stage groups.');
}
if ((await page.locator('.resident-life-timeline--continuous').count()) !== 1) {
  throw new Error('Life history should render one continuous chronological timeline.');
}

const ages = await page.locator('.resident-life-chapter').evaluateAll((items) => items.map((item) => Number(item.getAttribute('data-age'))));
for (let index = 1; index < ages.length; index += 1) {
  if (ages[index] < ages[index - 1]) throw new Error(`Life chapters must be ordered youngest-to-oldest by age: ${ages.join(',')}`);
}

const storyChapter = page.locator('.resident-life-chapter.has-story button').first();
if ((await storyChapter.count()) > 0) {
  await storyChapter.click();
  await page.waitForSelector('.resident-life-memory');
  const memoryText = await page.locator('.resident-life-memory').first().innerText();
  if (!memoryText.trim()) throw new Error('Expanded life chapter should show a resident memory paragraph.');
  if (/起初|后来|最后/.test(await page.locator('.resident-history-mode').innerText())) {
    throw new Error('Life history must not expose stage labels such as 起初/后来/最后.');
  }
}
await page.screenshot({ path: `${outDir}/03-life-history.png` });

await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '下一居民', exact: true }).click();
await page.waitForTimeout(100);
await page.screenshot({ path: `${outDir}/04-dev-density.png` });

// Gameplay validation: a completed story should change the actual resident state,
// persist as one life-memory node, and unlock a lightweight follow-up through LifeTag.
await open();
await chooseLifeEvent('lifeevent.marriage-introduction');
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.waitForTimeout(80);

const identityText = await page.locator('.resident-identity').innerText();
if (!identityText.includes('已婚')) {
  throw new Error('Completing the marriage story should update the resident family state to married.');
}

await page.locator('.resident-world-links').getByRole('button', { name: /家人/ }).click();
await page.waitForSelector('.resident-family-drawer');
if (!(await page.locator('.resident-family-drawer').innerText()).includes('配偶')) {
  throw new Error('Marriage effect should create a spouse relationship visible in the family drawer.');
}

await page.getByRole('button', { name: /人生经历/ }).click();
await page.waitForSelector('.resident-history-mode');
const marriageChapter = page.locator('.resident-life-chapter').filter({ hasText: '这门亲事定下来了' }).first();
if ((await marriageChapter.count()) !== 1) {
  throw new Error('A completed structural story should persist as one life-history node.');
}
await marriageChapter.getByRole('button').click();
await page.waitForSelector('.resident-life-memory');
if (!(await page.locator('.resident-life-memory').last().innerText()).includes('亲友')) {
  throw new Error('Marriage chapter should expand as one resident memory, not three stage cards.');
}
await page.getByRole('button', { name: /^返回生活/ }).click();

await page.getByRole('button', { name: '换一件事', exact: true }).click();
await page.waitForTimeout(60);
if ((await currentLifeEventId()) !== 'lifeevent.newlywed-settling') {
  throw new Error(`Marriage LifeTag should unlock the newlywed follow-up. Current=${await currentLifeEventId()}`);
}
await page.screenshot({ path: `${outDir}/05-life-effect-continuity.png` });

await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '换一件事', exact: true }).click();
if ((await currentLifeEventId()) === 'lifeevent.newlywed-settling') {
  throw new Error('The temporary newly-married LifeTag should be removed after the follow-up finishes.');
}

// Portrait Lab validation: deterministic AppearanceDNA should produce a broad set of
// reusable layered portraits, and rerolling the lab batch must actually change the set.
await page.goto(`${baseUrl}/?view=portraits`, { waitUntil: 'networkidle' });
await page.waitForSelector('.portrait-lab-card');
await page.waitForTimeout(120);
const portraitCount = await page.locator('.portrait-lab-card').count();
if (portraitCount !== 64) {
  throw new Error(`Portrait Lab should render 64 samples. Current=${portraitCount}`);
}
const firstBatchSignatures = await page.locator('.portrait-lab-card').evaluateAll((items) => items.map((item) => item.getAttribute('data-signature') ?? ''));
const uniqueSignatureCount = new Set(firstBatchSignatures).size;
if (uniqueSignatureCount < 48) {
  throw new Error(`Portrait Lab should keep most samples visually unique. Unique=${uniqueSignatureCount}/64`);
}
if ((await page.locator('.portrait-lab__dna dd').count()) < 9) {
  throw new Error('Portrait Lab inspector should expose the complete AppearanceDNA.');
}
await page.screenshot({ path: `${outDir}/06-portrait-lab.png` });

const firstSignature = firstBatchSignatures[0];
await page.getByRole('button', { name: '换一批', exact: true }).click();
await page.waitForTimeout(100);
const nextSignature = await page.locator('.portrait-lab-card').first().getAttribute('data-signature');
if (!nextSignature || nextSignature === firstSignature) {
  throw new Error('Portrait Lab reroll should change the generated appearance batch.');
}
await page.screenshot({ path: `${outDir}/07-portrait-lab-reroll.png` });

await browser.close();
