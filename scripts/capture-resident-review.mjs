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

const livePortrait = page.locator('.resident-avatar [data-generated-resident-avatar]');
if ((await livePortrait.count()) !== 1) throw new Error('Live ResidentAvatar must use the profile-derived chibi recipe by default.');
const generatedRecipe = JSON.parse(await livePortrait.getAttribute('data-avatar-recipe'));
if (generatedRecipe?.schema !== 'wanhu.avatar' || generatedRecipe?.pack !== 'chibi-cute-v1') throw new Error('Generated resident avatar must use the active chibi recipe contract.');
const profileLabels = await page.locator('[data-resident-profile] span').allTextContents();
if (profileLabels.length !== 3 || profileLabels.some((label) => !label.trim())) throw new Error('Resident Profile V1 must expose temperament, life focus and presentation style.');

const portraitBox = await page.locator('.resident-avatar').boundingBox();
const heroBox = await page.locator('.resident-profile-hero').boundingBox();
const panelBox = await page.locator('.resident-panel').boundingBox();
if (!portraitBox || portraitBox.width < 96 || portraitBox.height < 96) throw new Error('Portrait-first Resident Panel must expose a large portrait.');
if (!heroBox || heroBox.height < 136) throw new Error('Resident identity hero must reserve real visual space for the portrait.');
if (!panelBox || panelBox.width < 410 || panelBox.width > 430) throw new Error('Resident Panel V3 should stay in the 420px Context Surface width band.');
if ((await page.locator('.resident-follow-toggle').count()) !== 1) throw new Error('Follow action must live in the identity hero.');
if ((await page.locator('.resident-world-link').count()) !== 3) throw new Error('Resident world summary must expose residence, work and family as three lightweight columns.');

if ((await page.locator('.resident-summary').count()) !== 0) {
  throw new Error('Resident Panel should not render a standalone recent-summary row.');
}

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });
await page.locator('.resident-panel__header').screenshot({ path: `${outDir}/01a-resident-header-closeup.png` });
await page.locator('.resident-panel').screenshot({ path: `${outDir}/01b-resident-panel-portrait-first.png` });

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

await page.getByRole('button', { name: /人物关系/ }).click();
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

// Portrait review moved to scripts/capture-portrait-review.mjs.
await browser.close();
