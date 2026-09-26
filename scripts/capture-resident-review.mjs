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
  await page.waitForTimeout(160);
}

async function selectResidentAt(index, total) {
  for (let attempt = 0; attempt < total + 1; attempt += 1) {
    const label = await page.locator('.dev-panel__row').filter({ hasText: '居民' }).locator('b').innerText();
    if (label.includes(`${index + 1}/${total}`)) return;
    await page.getByRole('button', { name: '下一居民', exact: true }).click();
    await page.waitForTimeout(45);
  }
  throw new Error(`Could not select fixture resident index ${index}.`);
}

function eligible(event, resident, occupationGroupId) {
  const rule = event.eligibility ?? {};
  const age = Math.max(0, Math.floor((snapshot.currentDay - resident.birthDay) / definitions.generation.daysPerYear));
  const tags = new Set(resident.lifeTags ?? []);
  if (rule.occupations?.length && !rule.occupations.includes(resident.occupationId)) return false;
  if (rule.occupationGroups?.length && !rule.occupationGroups.includes(occupationGroupId)) return false;
  if (rule.genders?.length && !rule.genders.includes(resident.gender)) return false;
  if (rule.minAge !== undefined && age < rule.minAge) return false;
  if (rule.maxAge !== undefined && age > rule.maxAge) return false;
  if (rule.minChildren !== undefined && resident.childCount < rule.minChildren) return false;
  if (rule.requireSpouse !== undefined && Boolean(resident.spouseId) !== rule.requireSpouse) return false;
  if (rule.requiredTags?.some((tagId) => !tags.has(tagId))) return false;
  if (rule.forbiddenTags?.some((tagId) => tags.has(tagId))) return false;
  return true;
}

await open();

const definitions = await page.evaluate(async () => (await fetch('/generated/definitions.json')).json());
const snapshot = await page.evaluate(async () => (await fetch('/generated/resident-snapshot.json')).json());
const coverage = await page.evaluate(async () => (await fetch('/generated/content-coverage.json')).json());

if (definitions?.schema !== 'wanhu.resident-definitions.v7') throw new Error('Resident Content Review expected resident definitions v7.');
if (snapshot?.schema !== 'wanhu.resident-snapshot.v6') throw new Error(`Resident Content Review expected snapshot v6, got ${snapshot?.schema}`);
if (!Array.isArray(definitions.lifeEvents) || definitions.lifeEvents.length !== 16) throw new Error('LifeEvent V3 migration should compile 16 discrete events.');
if (definitions.lifeEvents.some((event) => !event.text?.trim() || 'stages' in event || 'delayDays' in event)) throw new Error('LifeEvent V3 must expose text and no Stage fields.');
if ((coverage.lifeEvents?.total ?? 0) !== 16) throw new Error('Coverage must report 16 V3 LifeEvents.');

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
if ((definitions.contentMeta?.actionPresentationCount ?? 0) !== requiredActionIds.length) throw new Error('Action Presentation count mismatch.');
if ((definitions.contentMeta?.actionVariantCount ?? 0) !== 22) throw new Error('Action Presentation variant count mismatch.');
if ('routines' in definitions || 'routines' in coverage) throw new Error('Legacy Routine data must not reappear.');

let legacyRoutineCatalogExists = true;
try { await access('Web/public/generated/routine-catalog-v2.json'); } catch { legacyRoutineCatalogExists = false; }
if (legacyRoutineCatalogExists) throw new Error('Legacy Routine catalog must not be generated.');

const residentIds = new Set(snapshot.residents.map((item) => item.id));
let targetRecordCount = 0;
for (const resident of snapshot.residents) {
  if ('activeStoryId' in resident || 'majorLifeHistory' in resident || 'recentLifeLog' in resident) {
    throw new Error(`${resident.id}: V2 story-thread fields must be absent from the final snapshot.`);
  }
  if (!Array.isArray(resident.recentLifeEvents) || !Array.isArray(resident.lifeChapters)) throw new Error(`${resident.id}: V3 fixture arrays are missing.`);
  if (!resident.currentAction?.actionId || !requiredActionIds.includes(resident.currentAction.actionId)) throw new Error(`${resident.id}: CurrentAction is missing or unknown.`);
  if (!Array.isArray(resident.recentActions) || resident.recentActions.length < 1) throw new Error(`${resident.id}: deterministic Action Trace must produce RecentAction records.`);
  if (resident.lifeChapters.some((entry) => 'actionId' in entry)) throw new Error(`${resident.id}: RecentAction must not enter LifeChapter.`);

  for (const record of resident.recentActions) {
    const presentation = definitions.actionPresentations.find((item) => item.id === record.actionId);
    if (!presentation || !presentation.variants[record.variantIndex]) throw new Error(`${resident.id}: invalid RecentAction presentation reference.`);
    if ('title' in record || 'text' in record || 'contextResidentId' in record || 'routineId' in record) throw new Error(`${resident.id}: RecentAction stores display text or legacy fields.`);
    if (record.targetResidentId !== undefined) {
      targetRecordCount += 1;
      if (!residentIds.has(record.targetResidentId)) throw new Error(`${resident.id}: RecentAction targets missing resident.`);
    }
  }
  for (const record of resident.recentLifeEvents) {
    if (!definitions.lifeEvents.some((event) => event.id === record.eventId)) throw new Error(`${resident.id}: recentLifeEvents references unknown ${record.eventId}.`);
    if ('title' in record || 'text' in record || 'stage' in record) throw new Error(`${resident.id}: Recent LifeEvent must store compact facts only.`);
  }
}
if (targetRecordCount < 3) throw new Error('Deterministic Action Trace did not exercise targetResidentId.');

const mixedIndex = snapshot.residents.findIndex((resident) => resident.recentActions.length > 0 && resident.recentLifeEvents.length > 0);
if (mixedIndex < 0) throw new Error('V3 fixture must include a resident with both RecentAction and recent LifeEvent.');
await selectResidentAt(mixedIndex, snapshot.residents.length);
const mixedResident = snapshot.residents[mixedIndex];

const livePortrait = page.locator('.resident-avatar [data-generated-resident-avatar]');
if ((await livePortrait.count()) !== 1) throw new Error('Live ResidentAvatar must use the profile-derived chibi recipe by default.');
const generatedRecipe = JSON.parse(await livePortrait.getAttribute('data-avatar-recipe'));
if (generatedRecipe?.schema !== 'wanhu.avatar' || generatedRecipe?.pack !== 'chibi-cute-v1') throw new Error('Generated resident avatar must use the active chibi recipe contract.');
const profileLabels = await page.locator('[data-resident-profile] span').allTextContents();
if (profileLabels.length !== 3 || profileLabels.some((label) => !label.trim())) throw new Error('Resident Profile V1 must expose three readable profile labels.');

const portraitBox = await page.locator('.resident-avatar').boundingBox();
const heroBox = await page.locator('.resident-profile-hero').boundingBox();
const panelBox = await page.locator('.resident-panel').boundingBox();
if (!portraitBox || portraitBox.width < 96 || portraitBox.height < 96) throw new Error('Portrait-first Resident Panel must expose a large portrait.');
if (!heroBox || heroBox.height < 136) throw new Error('Resident identity hero must reserve visual space for the portrait.');
if (!panelBox || panelBox.width < 410 || panelBox.width > 430) throw new Error('Resident Panel V3 should stay in the 420px Context Surface width band.');
if ((await page.locator('.resident-follow-toggle').count()) !== 1) throw new Error('Follow action must live in the identity hero.');
if ((await page.locator('.resident-world-link').count()) !== 3) throw new Error('Resident world summary must expose residence, work and family as three columns.');
if ((await page.locator('.resident-summary').count()) !== 0) throw new Error('Resident Panel should not render a standalone recent-summary row.');

const selectedCurrentPresentation = definitions.actionPresentations.find((item) => item.id === mixedResident.currentAction.actionId);
const currentActionUiText = await page.locator('.resident-activity__current p').innerText();
if (currentActionUiText !== selectedCurrentPresentation.currentText) throw new Error('“此刻” must resolve directly from CurrentAction Presentation.');

if ((await page.locator('.resident-recent-feed').count()) !== 1) throw new Error('Resident Panel V3 must expose exactly one recent region.');
if ((await page.locator('.resident-recent').count()) !== 0 || (await page.locator('.resident-recent-action-section').count()) !== 0) throw new Error('Independent V2 LifeEvent / RecentAction regions must be removed.');
const kinds = await page.locator('.resident-recent-feed__list > li').evaluateAll((items) => items.map((item) => item.getAttribute('data-recent-kind')));
if (!kinds.includes('action') || !kinds.includes('life-event')) throw new Error('Unified recent feed must mix RecentAction and LifeEvent.');

const expectedRecent = [
  ...mixedResident.recentActions.map((record) => ({
    day: record.day,
    kind: 'action',
    text: definitions.actionPresentations.find((item) => item.id === record.actionId)?.variants?.[record.variantIndex]?.text,
  })),
  ...mixedResident.recentLifeEvents.map((record) => {
    const event = definitions.lifeEvents.find((item) => item.id === record.eventId);
    return { day: record.day, kind: 'life-event', title: event?.title, text: event?.text };
  }),
].filter((entry) => entry.day <= snapshot.currentDay)
  .sort((left, right) => right.day - left.day || (left.kind === 'life-event' ? -1 : 1))
  .slice(0, 5);

const actualRecent = await page.locator('.resident-recent-feed__list > li').evaluateAll((items) => items.map((item) => ({
  kind: item.getAttribute('data-recent-kind'),
  text: item.textContent?.replace(/\s+/g, ' ').trim() ?? '',
})));
if (actualRecent.length !== expectedRecent.length) throw new Error('Unified recent feed length does not match the sorted V3 view.');
for (let index = 0; index < expectedRecent.length; index += 1) {
  const expected = expectedRecent[index];
  if (actualRecent[index].kind !== expected.kind) throw new Error('Unified recent feed is not sorted by day.');
  if (expected.kind === 'action' && !actualRecent[index].text.includes(expected.text)) throw new Error('RecentAction text is not resolved in unified recent feed.');
  if (expected.kind === 'life-event' && (!actualRecent[index].text.includes(expected.title) || !actualRecent[index].text.includes(expected.text))) throw new Error('LifeEvent title/text is not resolved in unified recent feed.');
}

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
const panelText = await page.locator('.resident-panel').innerText();
if (/正在经历|最近发生|Stage\s*\d|resident-action\.|lifeevent\.|\bLifeEvent\b|\bAction\b/.test(panelText)) throw new Error('Player-facing Resident Panel exposes V2 or technical labels.');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });
await page.locator('.resident-panel').screenshot({ path: `${outDir}/01b-resident-panel-v3.png` });
await page.locator('.resident-recent-feed').screenshot({ path: `${outDir}/01c-unified-recent.png` });

await open();
const storyIndex = snapshot.residents.findIndex((resident) => resident.lifeChapters.some((entry) => entry.sourceEventId));
if (storyIndex < 0) throw new Error('Fixture must contain at least one Story Chapter.');
await selectResidentAt(storyIndex, snapshot.residents.length);
const storyResident = snapshot.residents[storyIndex];

await page.getByRole('button', { name: /人生经历/ }).click();
await page.waitForSelector('.resident-history-mode');
if ((await page.locator('.resident-activity').count()) !== 0) throw new Error('Life History must hide “此刻”.');
if ((await page.locator('.resident-recent-feed').count()) !== 0) throw new Error('Life History must hide “最近”.');
if ((await page.locator('.resident-life-stage__label').count()) !== 0) throw new Error('Life History should not use life-stage groups.');
if ((await page.locator('.resident-life-timeline--continuous').count()) !== 1) throw new Error('Life History should render one chronological timeline.');

const ages = await page.locator('.resident-life-chapter').evaluateAll((items) => items.map((item) => Number(item.getAttribute('data-age'))));
for (let index = 1; index < ages.length; index += 1) {
  if (ages[index] < ages[index - 1]) throw new Error(`Life Chapters must be age-ascending: ${ages.join(',')}`);
}
if (storyResident.lifeChapters.some((entry) => 'actionId' in entry)) throw new Error('Ordinary RecentAction must not enter Life History.');

const storyChapter = page.locator('.resident-life-chapter.has-story button').first();
if ((await storyChapter.count()) < 1) throw new Error('Story fixture should expose a Story Chapter.');
const chapterTitle = (await storyChapter.locator('span').innerText()).trim();
const chapterRecord = storyResident.lifeChapters.find((entry) => entry.title === chapterTitle);
const chapterEvent = definitions.lifeEvents.find((event) => event.id === chapterRecord?.sourceEventId);
await storyChapter.click();
await page.waitForSelector('.resident-life-memory');
const memoryText = await page.locator('.resident-life-memory').first().innerText();
if (!chapterEvent?.memoryText || memoryText.trim() !== chapterEvent.memoryText.trim()) throw new Error('Story Chapter must expand its authored memoryText.');
if (/Stage\s*\d|起初\s*[／/]|后来\s*[／/]|最后\s*[／/]/.test(await page.locator('.resident-history-mode').innerText())) throw new Error('Life History must not expose Stage structure.');
await page.screenshot({ path: `${outDir}/03-life-history.png` });

await open();
const newlywedIndex = snapshot.residents.findIndex((resident) =>
  resident.spouseId
  && resident.lifeTags.includes('lifetag.newly-married')
  && resident.recentLifeEvents.some((record) => record.eventId === 'lifeevent.marriage-completion')
);
if (newlywedIndex < 0) throw new Error('V3 fixture must include the spouse + newly-married continuity case.');
await selectResidentAt(newlywedIndex, snapshot.residents.length);
const newlywed = snapshot.residents[newlywedIndex];

const marriageNodes = newlywed.lifeChapters.filter((entry) => entry.type === 'marriage' || entry.sourceEventId === 'lifeevent.marriage-completion');
if (marriageNodes.length !== 1) throw new Error('One important structural marriage must produce exactly one player-visible LifeChapter.');

const occupation = definitions.occupations.find((item) => item.id === newlywed.occupationId);
const followup = definitions.lifeEvents.find((event) => event.id === 'lifeevent.newlywed-settling');
if (!followup || !occupation || !eligible(followup, newlywed, occupation.groupId)) throw new Error('spouse + newly-married must unlock the discrete newlywed follow-up.');

if (!(await page.locator('.resident-identity').innerText()).includes('已婚')) throw new Error('Marriage structure fact should be visible in resident identity.');
await page.getByRole('button', { name: /返回生活/ }).click();
await page.waitForSelector('.resident-recent-feed');
const continuityText = await page.locator('.resident-recent-feed').innerText();
for (const title of ['有人来给家里说亲', '两家把亲事谈妥了', '今日成了婚']) {
  if (!continuityText.includes(title)) throw new Error(`Marriage continuity fixture is missing ${title}.`);
}
await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.locator('.resident-panel').screenshot({ path: `${outDir}/05-life-tag-structure-continuity.png` });

await browser.close();
