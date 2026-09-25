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

const residentDefinitions = await page.evaluate(async () => (await fetch('/generated/definitions.json')).json());
if (residentDefinitions?.schema !== 'wanhu.resident-definitions.v7') throw new Error('Routine review expected resident definitions v7.');
if ((residentDefinitions.contentMeta?.routineDefinitionCount ?? 0) < 247) throw new Error('R3D family content Routine definitions are missing from generated definitions.');
if ((residentDefinitions.contentMeta?.routineVariantCount ?? 0) < 460) throw new Error('R3D family content Routine variants are missing from generated definitions.');
for (const requiredRoutineId of [
  'routine.household.common.sweep-courtyard',
  'routine.market.common.buy-vegetables',
  'routine.social.common.return-borrowed-item',
  'routine.community.common.fetch-water',
  'routine.travel.common.walk-through-city-gate',
  'routine.leisure.common.rest-under-eaves',
  'routine.care.common.prepare-herbal-decoction',
  'routine.study.common.practice-common-characters',
  'routine.travel.common.wait-for-ferry',
  'routine.community.common.wash-clothes-at-riverbank',
  'routine.household.common.sort-stored-grain',
  'routine.social.common.sit-with-neighbors-after-dinner',
  'routine.care.common.rest-sore-shoulders',
  'routine.study.common.practice-own-name',
  'routine.leisure.common.walk-after-meal',
  'routine.work.apprentice.practice-basic-skill',
  'routine.work.potter.load-kiln',
  'routine.work.carpenter.test-joint-fit',
  'routine.care.physician.visit-household',
  'routine.care.midwife.check-newborn',
  'routine.work.cloth-worker.measure-cloth',
  'routine.work.account-clerk.verify-receipts',
  'routine.market.vendor.weigh-goods',
  'routine.work.farmer.mend-field-ridge',
  'routine.travel.courier.carry-heavy-load',
  'routine.study.student.recite-lesson',
  'routine.work.lock-keeper.inspect-gate',
  'routine.work.performer.rehearse-stage-movement',
  'routine.social.retired-craftsman.show-technique',
  'routine.leisure.child.play-pebbles',
  'routine.travel.teen.run-family-errand',
  'routine.leisure.elder.rest-in-sun',
  'routine.household.young-adult.plan-spending',
  'routine.community.adult.join-alley-cleanup',
  'routine.social.middle-age.share-experience',
  'routine.household.spouse.share-evening-meal',
  'routine.care.parent.check-child-scrape',
  'routine.care.child.bring-parent-warm-water',
  'routine.household.family.share-household-meal',
]) {
  if (!residentDefinitions.routines.some((item) => item.id === requiredRoutineId)) {
    throw new Error('Missing R1 Routine '+requiredRoutineId+'.');
  }
}
const routineCoverage = await page.evaluate(async () => (await fetch('/generated/content-coverage.json')).json());
if ((routineCoverage.routines?.quality?.maxCharacters ?? 999) > 24) throw new Error('Routine text exceeds the R1 24-character UI budget.');
if ((routineCoverage.routines?.quality?.normalizedDuplicateVariantTexts ?? 1) !== 0) throw new Error('Routine normalized duplicate text audit failed.');
for (const category of routineCoverage.routines?.categories ?? []) {
  if (category.category !== 'custom' && category.definitions < 8) throw new Error(`Routine category ${category.category} fell below the R1 density floor.`);
}
for (const occupationId of ['occupation.student','occupation.apprentice','occupation.cloth-worker','occupation.potter','occupation.carpenter','occupation.account-clerk','occupation.physician','occupation.lock-keeper','occupation.vendor','occupation.farmer','occupation.courier','occupation.performer','occupation.midwife','occupation.retired-craftsman']) {
  const entry = routineCoverage.routines?.occupationCoverage?.find((item) => item.occupationId === occupationId);
  if (!entry || entry.directRoutines < 8) throw new Error(`R2 occupation coverage below 8 for ${occupationId}.`);
}
for (const lifeStageId of ['child','teen','young-adult','adult','middle-age','elder']) {
  const entry = routineCoverage.routines?.lifeStageCoverage?.find((item) => item.lifeStageId === lifeStageId);
  if (!entry || entry.directRoutines < 8) throw new Error(`R3 life-stage coverage below 8 for ${lifeStageId}.`);
}
const familyContract = routineCoverage.routines?.familyContract;
if (!familyContract) throw new Error('Routine Family Contract coverage is missing.');
if (familyContract.familyConstrainedDefinitions !== 20 || familyContract.contextResidentTargetDefinitions !== 0) {
  throw new Error('R3D family content coverage must be 20 eligibility definitions and 0 context definitions.');
}
if (familyContract.spouseRequiredDefinitions !== 5 || familyContract.coResidentSpouseDefinitions !== 5) throw new Error('R3D spouse coverage mismatch.');
if (familyContract.childRequiredDefinitions !== 5 || familyContract.coResidentChildDefinitions !== 5) throw new Error('R3D child coverage mismatch.');
if (familyContract.parentRequiredDefinitions !== 4 || familyContract.coResidentParentDefinitions !== 4) throw new Error('R3D parent coverage mismatch.');
if (familyContract.householdSizeDefinitions !== 6) throw new Error('R3D household-size coverage mismatch.');
const familyProbe = await page.evaluate(async () => {
  const mod = await import('/src/simulation/routine-family.ts');
  const adult = { id: 1, spouseId: 2, childCount: 1, fatherId: 0, motherId: 0, householdId: 10 };
  const spouse = { id: 2, spouseId: 1, childCount: 1, fatherId: 0, motherId: 0, householdId: 10 };
  const child = { id: 3, spouseId: 0, childCount: 0, fatherId: 1, motherId: 2, householdId: 10 };
  const outsider = { id: 4, spouseId: 0, childCount: 0, fatherId: 0, motherId: 0, householdId: 20 };
  const household = { id: 10, memberIds: [1,2,3] };
  const residents = [adult, spouse, child, outsider];
  return {
    spouseRequired: mod.routineFamilyEligibilityMatches({ spouse: 'required' }, adult, household, residents),
    spouseForbidden: mod.routineFamilyEligibilityMatches({ spouse: 'forbidden' }, adult, household, residents),
    coResidentChild: mod.routineFamilyEligibilityMatches({ coResidentChild: 'required' }, adult, household, residents),
    parentRequired: mod.routineFamilyEligibilityMatches({ parent: 'required' }, child, household, residents),
    maxChildrenZero: mod.routineFamilyEligibilityMatches({ maxChildren: 0 }, adult, household, residents),
    spouseContext: mod.routineContextResidentMatches('spouse', adult, spouse, household),
    childContext: mod.routineContextResidentMatches('child', adult, child, household),
    parentContext: mod.routineContextResidentMatches('parent', child, adult, household),
    outsiderHouseholdContext: mod.routineContextResidentMatches('household-member', adult, outsider, household),
  };
});
if (!familyProbe.spouseRequired || familyProbe.spouseForbidden || !familyProbe.coResidentChild || !familyProbe.parentRequired || familyProbe.maxChildrenZero) {
  throw new Error('Routine Family Eligibility probe failed.');
}
if (!familyProbe.spouseContext || !familyProbe.childContext || !familyProbe.parentContext || familyProbe.outsiderHouseholdContext) {
  throw new Error('Routine resident context relation probe failed.');
}
const familyRuntimeProbe = await page.evaluate(async () => {
  const [defs, snapshot] = await Promise.all([
    fetch('/generated/definitions.json').then((response) => response.json()),
    fetch('/generated/resident-snapshot.json').then((response) => response.json()),
  ]);
  const familyIds = new Set([
    'routine.household.spouse.share-evening-meal',
    'routine.care.parent.check-child-scrape',
    'routine.care.child.bring-parent-warm-water',
    'routine.household.family.share-household-meal',
  ]);
  const familyLogs = snapshot.residents.flatMap((resident) =>
    (resident.recentLifeLog ?? []).filter((entry) => familyIds.has(entry.routineId)).map((entry) => ({ residentId: resident.id, routineId: entry.routineId }))
  );
  const hasFamilyDefinition = defs.routines.some((item) => item.eligibility?.family);
  return { hasFamilyDefinition, familyLogs };
});
if (!familyRuntimeProbe.hasFamilyDefinition) throw new Error('R3D family definitions did not reach generated definitions.');
if (familyRuntimeProbe.familyLogs.length < 1) throw new Error('R3D generated snapshot should exercise at least one family-constrained Routine.');
const routineRows = page.locator('.resident-routine-list li');
if ((await routineRows.count()) < 1) throw new Error('Resident Panel should expose at least one recent Routine.');
const routineTexts = await routineRows.locator('span').allTextContents();
if (routineTexts.some((text) => !text.trim() || /(?:routine|fact)\./.test(text))) {
  throw new Error('Resident Panel must resolve Routine IDs to readable text.');
}

await page.getByRole('button', { name: '隐藏', exact: true }).click();
await page.waitForSelector('.dev-reopen');
await page.screenshot({ path: `${outDir}/01-player-resident.png` });
await page.locator('.resident-panel__header').screenshot({ path: `${outDir}/01a-resident-header-closeup.png` });
await page.locator('.resident-panel').screenshot({ path: `${outDir}/01b-resident-panel-portrait-first.png` });
await page.locator('.resident-routine-section').screenshot({ path: `${outDir}/01c-resident-routines.png` });

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
