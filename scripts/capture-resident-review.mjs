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
if ((await page.locator('.resident-activity').count()) !== 0) throw new Error('Life history mode must hide current activity.');
if ((await page.locator('.resident-recent').count()) !== 0) throw new Error('Life history mode must hide current LifeEvent.');
if ((await page.locator('.resident-routine-section').count()) !== 0) throw new Error('Life history mode must hide routine entries.');
if ((await page.locator('.resident-life-stage__label').count()) !== 0) throw new Error('Life history should not use life-stage groups.');
if ((await page.locator('.resident-life-timeline--continuous').count()) !== 1) throw new Error('Life history should render one chronological timeline.');

const ages = await page.locator('.resident-life-chapter').evaluateAll((items) => items.map((item) => Number(item.getAttribute('data-age'))));
for (let index = 1; index < ages.length; index += 1) {
  if (ages[index] < ages[index - 1]) throw new Error(`Life chapters must be ordered youngest-to-oldest: ${ages.join(',')}`);
}

const storyChapter = page.locator('.resident-life-chapter.has-story button').first();
if ((await storyChapter.count()) > 0) {
  await storyChapter.click();
  await page.waitForSelector('.resident-life-memory');
  const memoryText = await page.locator('.resident-life-memory').first().innerText();
  if (!memoryText.trim()) throw new Error('Expanded life chapter should show one memory paragraph.');
  if (/起初|后来|最后/.test(await page.locator('.resident-history-mode').innerText())) throw new Error('Life history must not expose stage labels.');
}
await page.screenshot({ path: `${outDir}/03-life-history.png` });

await page.getByRole('button', { name: 'DEV', exact: true }).click();
await page.getByRole('button', { name: '下一居民', exact: true }).click();
await page.waitForTimeout(100);
await page.screenshot({ path: `${outDir}/04-dev-density.png` });

await open();
await chooseLifeEvent('lifeevent.marriage-introduction');
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.waitForTimeout(80);
if (!(await page.locator('.resident-identity').innerText()).includes('已婚')) throw new Error('Marriage story should update family state.');

await page.locator('.resident-world-links').getByRole('button', { name: /家人/ }).click();
await page.waitForSelector('.resident-family-drawer');
if (!(await page.locator('.resident-family-drawer').innerText()).includes('配偶')) throw new Error('Marriage should create a visible spouse relationship.');

await page.getByRole('button', { name: /人生经历/ }).click();
await page.waitForSelector('.resident-history-mode');
const marriageChapter = page.locator('.resident-life-chapter').filter({ hasText: '这门亲事定下来了' }).first();
if ((await marriageChapter.count()) !== 1) throw new Error('Completed structural story should persist as one life-history node.');
await marriageChapter.getByRole('button').click();
await page.waitForSelector('.resident-life-memory');
if (!(await page.locator('.resident-life-memory').last().innerText()).includes('亲友')) throw new Error('Marriage chapter should expand as one memory.');
await page.getByRole('button', { name: /^返回生活/ }).click();
await page.getByRole('button', { name: '换一件事', exact: true }).click();
await page.waitForTimeout(60);
if ((await currentLifeEventId()) !== 'lifeevent.newlywed-settling') throw new Error(`Marriage LifeTag should unlock follow-up. Current=${await currentLifeEventId()}`);
await page.screenshot({ path: `${outDir}/05-life-effect-continuity.png` });

await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '推进故事', exact: true }).click();
await page.getByRole('button', { name: '换一件事', exact: true }).click();
if ((await currentLifeEventId()) === 'lifeevent.newlywed-settling') throw new Error('Temporary newly-married tag should be removed after follow-up.');

// Portrait Lab V4: wealth + presentation drive clothing; gender/age drive physiology and hair.
await page.goto(`${baseUrl}/?view=portraits`, { waitUntil: 'networkidle' });
await page.waitForSelector('.portrait-lab-card');
await page.waitForTimeout(120);
if ((await page.locator('.portrait-lab-card').count()) !== 64) throw new Error('Portrait Lab should render 64 samples.');
const labText = await page.locator('.portrait-lab').innerText();
if (labText.includes('官署')) throw new Error('Portrait Lab V4 must not present occupation identity as an appearance dimension.');

const firstBatchSignatures = await page.locator('.portrait-lab-card').evaluateAll((items) => items.map((item) => item.getAttribute('data-signature') ?? ''));
const uniqueSignatureCount = new Set(firstBatchSignatures).size;
if (uniqueSignatureCount < 48) throw new Error(`Portrait Lab should keep most samples unique. Unique=${uniqueSignatureCount}/64`);
if ((await page.locator('.portrait-lab__dna dd').count()) < 9) throw new Error('Portrait inspector should expose full AppearanceDNA.');
const rigErrorCount = await page.locator('.portrait-lab-card').evaluateAll((items) => items.reduce((sum, item) => sum + Number(item.getAttribute('data-rig-errors') ?? 0), 0));
if (rigErrorCount !== 0) throw new Error(`PortraitRig should produce zero hard errors. Errors=${rigErrorCount}`);
const avatarRigStates = await page.locator('.portrait-lab-card .generated-portrait').evaluateAll((items) => items.map((item) => item.getAttribute('data-rig-state')));
if (avatarRigStates.some((state) => state !== 'ok')) throw new Error('Every default portrait should resolve a valid PortraitRig.');

const femaleShowcase = page.locator('.portrait-lab-card[data-showcase="true"][data-gender="female"]');
if ((await femaleShowcase.count()) < 5) throw new Error('Portrait Lab V4 should guarantee five female showcase samples.');
const femaleSignatures = await femaleShowcase.evaluateAll((items) => items.map((item) => item.getAttribute('data-signature') ?? ''));
if (femaleSignatures.some((signature) => !signature.includes('appearance.facial-hair.none'))) throw new Error('Female showcase portraits must not generate facial hair.');
const femaleHairIds = await femaleShowcase.evaluateAll((items) => items.map((item) => item.getAttribute('data-hair-id') ?? ''));
if (femaleHairIds.filter((id) => /appearance\.hair\.female-(long|side|braid|double-braid|bun|low-bun|elder-tied)/.test(id)).length < 4) {
  throw new Error(`Female showcase should visibly use long/braided/bun silhouettes: ${femaleHairIds.join(', ')}`);
}

const wealthShowcase = await page.locator('.portrait-lab-card[data-showcase="true"]').evaluateAll((items) => items.map((item) => item.getAttribute('data-wealth-tier')));
for (const tier of ['poor', 'plain', 'comfortable', 'wealthy']) {
  if (!wealthShowcase.includes(tier)) throw new Error(`Showcase should cover wealth tier ${tier}.`);
}
const poorOutfits = await page.locator('.portrait-lab-card[data-showcase="true"][data-wealth-tier="poor"]').evaluateAll((items) => items.map((item) => item.getAttribute('data-outfit-id') ?? ''));
if (poorOutfits.some((id) => !/(rough|plain)/.test(id))) throw new Error(`Poor showcase should use simple clothing: ${poorOutfits.join(', ')}`);
const wealthyOutfits = await page.locator('.portrait-lab-card[data-showcase="true"][data-wealth-tier="wealthy"]').evaluateAll((items) => items.map((item) => item.getAttribute('data-outfit-id') ?? ''));
if (wealthyOutfits.some((id) => !/(refined|layered)/.test(id))) throw new Error(`Wealthy showcase should use layered/refined clothing: ${wealthyOutfits.join(', ')}`);

await page.getByRole('button', { name: '显示锚点', exact: true }).click();
await page.waitForSelector('.portrait-rig-debug');
await page.screenshot({ path: `${outDir}/06-portrait-rig-diagnostics.png` });
await page.getByRole('button', { name: '胡须', exact: true }).click();
await page.getByRole('button', { name: '头饰', exact: true }).click();
await page.screenshot({ path: `${outDir}/07-portrait-layer-isolation.png` });

const firstSignature = firstBatchSignatures[0];
await page.getByRole('button', { name: '换一批', exact: true }).click();
await page.waitForTimeout(100);
const nextSignature = await page.locator('.portrait-lab-card').first().getAttribute('data-signature');
if (!nextSignature || nextSignature === firstSignature) throw new Error('Portrait Lab reroll should change the batch.');
await page.screenshot({ path: `${outDir}/08-portrait-lab-reroll.png` });

const wealthControls = page.locator('.portrait-lab__filters > div').filter({ hasText: '财富' });
await wealthControls.getByRole('button', { name: '富裕', exact: true }).click();
await page.waitForTimeout(80);
const wealthyCards = page.locator('.portrait-lab-card');
if ((await wealthyCards.count()) < 3) throw new Error('Wealthy filter should expose multiple samples.');
const wealthyTiers = await wealthyCards.evaluateAll((items) => items.map((item) => item.getAttribute('data-wealth-tier')));
if (wealthyTiers.some((tier) => tier !== 'wealthy')) throw new Error('Wealth filter leaked non-wealthy samples.');
await page.screenshot({ path: `${outDir}/09-portrait-wealthy.png` });

await wealthControls.getByRole('button', { name: '全部', exact: true }).click();
const genderControls = page.locator('.portrait-lab__filters > div').filter({ hasText: '性别' });
await genderControls.getByRole('button', { name: '女', exact: true }).click();
await page.waitForTimeout(80);
const femaleCards = page.locator('.portrait-lab-card');
if ((await femaleCards.count()) < 8) throw new Error('Female filter should expose a meaningful sample set.');
const visibleFemaleHair = await femaleCards.evaluateAll((items) => items.map((item) => item.getAttribute('data-hair-id') ?? ''));
if (visibleFemaleHair.filter((id) => /female-(long|side|braid|double-braid)/.test(id)).length < 6) throw new Error(`Female filter should show many strong hair silhouettes: ${visibleFemaleHair.join(', ')}`);
await page.screenshot({ path: `${outDir}/10-portrait-women-longhair.png` });

await browser.close();
