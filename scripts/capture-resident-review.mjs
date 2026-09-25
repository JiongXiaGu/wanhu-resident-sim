import { chromium } from 'playwright';
import { access, mkdir } from 'node:fs/promises';

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

const residentDefinitions = await page.evaluate(async () => (await fetch('/generated/definitions.json')).json());
if (residentDefinitions?.schema !== 'wanhu.resident-definitions.v7') throw new Error('Resident Action review expected resident definitions v7.');
const requiredActionIds = [
  'resident-action.fetch-water',
  'resident-action.wash-clothes',
  'resident-action.go-to-work',
  'resident-action.buy-food',
  'resident-action.take-walk',
  'resident-action.visit-friend',
  'resident-action.visit-family',
  'resident-action.watch-performance',
  'resident-action.go-to-teahouse',
  'resident-action.travel',
  'resident-action.rest-at-home',
];
if ((residentDefinitions.contentMeta?.actionPresentationCount ?? 0) !== requiredActionIds.length) throw new Error('Action Presentation count mismatch.');
if ((residentDefinitions.contentMeta?.actionVariantCount ?? 0) !== 22) throw new Error('Action Presentation variant count mismatch.');
if ('routines' in residentDefinitions) throw new Error('Definitions must not expose legacy routines.');
for (const actionId of requiredActionIds) {
  const definition = residentDefinitions.actionPresentations?.find((item) => item.id === actionId);
  if (!definition) throw new Error(`Missing Action Presentation ${actionId}.`);
  if (!definition.currentText?.trim()) throw new Error(`${actionId} is missing currentText.`);
  if (definition.variants.length < 2 || definition.variants.length > 4 || definition.variants.some((item) => !item.text?.trim())) throw new Error(`${actionId} must expose 2-4 readable variants.`);
}
let legacyRoutineCatalogExists = true;
try { await access('Web/public/generated/routine-catalog-v2.json'); } catch { legacyRoutineCatalogExists = false; }
if (legacyRoutineCatalogExists) throw new Error('Legacy Routine catalog must not be generated.');

const actionCoverage = await page.evaluate(async () => (await fetch('/generated/content-coverage.json')).json());
if (actionCoverage.actionPresentations?.total !== requiredActionIds.length || actionCoverage.actionPresentations?.variants !== 22) throw new Error('Action Presentation coverage is missing or inconsistent.');
if ('routines' in actionCoverage) throw new Error('Coverage must not expose legacy Routine metrics.');

const actionSnapshot = await page.evaluate(async () => (await fetch('/generated/resident-snapshot.json')).json());
const residentIds = new Set(actionSnapshot.residents.map((item) => item.id));
let targetRecordCount = 0;
for (const resident of actionSnapshot.residents) {
  if ('recentLifeLog' in resident) throw new Error(`${resident.id}: legacy recentLifeLog must be removed.`);
  if (!resident.currentAction?.actionId || !requiredActionIds.includes(resident.currentAction.actionId)) throw new Error(`${resident.id}: CurrentAction is missing or unknown.`);
  if (!Array.isArray(resident.recentActions) || resident.recentActions.length < 1) throw new Error(`${resident.id}: deterministic Action Trace must produce RecentAction records.`);
  if (resident.majorLifeHistory.some((entry) => 'actionId' in entry)) throw new Error(`${resident.id}: RecentAction must not enter major life history.`);
  for (const record of resident.recentActions) {
    const presentation = residentDefinitions.actionPresentations.find((item) => item.id === record.actionId);
    if (!presentation || !presentation.variants[record.variantIndex]) throw new Error(`${resident.id}: invalid RecentAction presentation reference.`);
    if ('title' in record || 'text' in record || 'contextResidentId' in record || 'routineId' in record) throw new Error(`${resident.id}: RecentAction stores presentation text or legacy Routine fields.`);
    if (record.targetResidentId !== undefined) {
      targetRecordCount += 1;
      if (!residentIds.has(record.targetResidentId)) throw new Error(`${resident.id}: RecentAction targets missing resident ${record.targetResidentId}.`);
    }
  }
}
if (targetRecordCount < 3) throw new Error('Deterministic Action Trace did not exercise targetResidentId.');

const selectedSnapshotResident = actionSnapshot.residents[0];
const selectedCurrentPresentation = residentDefinitions.actionPresentations.find((item) => item.id === selectedSnapshotResident.currentAction.actionId);
const currentActionUiText = await page.locator('.resident-activity__current p').innerText();
if (currentActionUiText !== selectedCurrentPresentation.currentText) throw new Error(`CurrentAction UI mismatch: ${currentActionUiText} !== ${selectedCurrentPresentation.currentText}`);
const recentActionRows = page.locator('.resident-recent-action-list li');
if ((await recentActionRows.count()) < 1) throw new Error('Resident Panel should expose at least one RecentAction.');
const recentActionTexts = await recentActionRows.locator('span').allTextContents();
if (recentActionTexts.some((value) => !value.trim() || /resident-action\./.test(value))) throw new Error('Resident Panel must resolve RecentAction IDs to readable text.');

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });
await page.locator('.resident-panel__header').screenshot({ path: `${outDir}/01a-resident-header-closeup.png` });
await page.locator('.resident-panel').screenshot({ path: `${outDir}/01b-resident-panel-portrait-first.png` });
await page.locator('.resident-recent-action-section').screenshot({ path: `${outDir}/01c-resident-recent-actions.png` });

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
if ((await page.locator('.resident-recent-action-section').count()) !== 0) throw new Error('Life history mode must hide RecentAction entries.');
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
