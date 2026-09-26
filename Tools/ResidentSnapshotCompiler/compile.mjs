import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const snapshotPath = join(root, 'Web', 'public', 'generated', 'resident-snapshot.json');
const definitionsPath = join(root, 'Web', 'public', 'generated', 'definitions.json');
const nameCatalogPath = join(root, 'Web', 'public', 'generated', 'name-catalog-v2.json');
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

const snapshot = await readJson(snapshotPath);
const definitions = await readJson(definitionsPath);
const nameCatalog = await readJson(nameCatalogPath);
if (snapshot.schema !== 'wanhu.resident-snapshot.v2') throw new Error(`ResidentSnapshotCompiler expected v2 intermediate snapshot, got ${snapshot.schema}`);
if (definitions.schema !== 'wanhu.resident-definitions.v3') throw new Error(`ResidentSnapshotCompiler expected definitions v3, got ${definitions.schema}`);
if (nameCatalog.schema !== 'wanhu.name-catalog.v2') throw new Error(`Unsupported name catalog schema: ${nameCatalog.schema}`);

const surnameById = new Map(nameCatalog.surnames.map((item) => [item.id, item]));
const givenNameById = new Map(nameCatalog.givenNames.map((item) => [item.id, item]));
const eventById = new Map(definitions.lifeEvents.map((item) => [item.id, item]));
const actionPresentationById = new Map(definitions.actionPresentations.map((item) => [item.id, item]));
const knownLifeTags = new Set(definitions.lifeTags.map((item) => item.id));

for (const resident of snapshot.residents) {
  const surname = surnameById.get(resident.surnameId);
  const givenName = givenNameById.get(resident.givenNameId);
  if (!surname || surname.text !== resident.surname) throw new Error(`${resident.id}: invalid surname identity.`);
  if (!givenName || (givenName.gender !== resident.gender && givenName.gender !== 'unisex')) throw new Error(`${resident.id}: invalid given-name identity.`);
  if (resident.displayName !== `${surname.text}${givenName.text}`) throw new Error(`${resident.id}: displayName does not match Stable Name tokens.`);

  if ('activeStoryId' in resident || 'majorLifeHistory' in resident) throw new Error(`${resident.id}: V2 Story Thread fields must be removed.`);
  const tagSet = new Set();
  for (const tagId of resident.lifeTags ?? []) {
    if (!knownLifeTags.has(tagId)) throw new Error(`${resident.id}: unknown LifeTag ${tagId}.`);
    if (tagSet.has(tagId)) throw new Error(`${resident.id}: duplicate LifeTag ${tagId}.`);
    tagSet.add(tagId);
  }
  if (!Array.isArray(resident.recentLifeEvents)) throw new Error(`${resident.id}: recentLifeEvents must be an array.`);
  for (const record of resident.recentLifeEvents) {
    if (!eventById.has(record.eventId)) throw new Error(`${resident.id}: unknown recent LifeEvent ${record.eventId}.`);
    if (!Number.isInteger(record.day) || record.day > snapshot.currentDay) throw new Error(`${resident.id}: invalid recent LifeEvent day.`);
    if ('title' in record || 'text' in record || 'stage' in record) throw new Error(`${resident.id}: recentLifeEvents store compact facts only.`);
  }
  if (!Array.isArray(resident.lifeChapters)) throw new Error(`${resident.id}: lifeChapters must be an array.`);
  const storyIds = new Set();
  for (const chapter of resident.lifeChapters) {
    if (!Number.isInteger(chapter.day)) throw new Error(`${resident.id}: LifeChapter day must be an integer.`);
    if (!chapter.sourceEventId) continue;
    const event = eventById.get(chapter.sourceEventId);
    if (!event || !event.recordToHistory) throw new Error(`${resident.id}: invalid Story Chapter source ${chapter.sourceEventId}.`);
    if (storyIds.has(chapter.sourceEventId)) throw new Error(`${resident.id}: duplicate Story Chapter ${chapter.sourceEventId}.`);
    storyIds.add(chapter.sourceEventId);
  }
  delete resident.occupationGroupId;
}

const residentById = new Map(snapshot.residents.map((resident) => [resident.id, resident]));
function validateActionContext(action, label) {
  if (action.targetResidentId !== undefined && (!Number.isInteger(action.targetResidentId) || !residentById.has(action.targetResidentId))) throw new Error(`${label}: targets missing resident ${action.targetResidentId}.`);
  if (action.placeId !== undefined && (typeof action.placeId !== 'string' || !action.placeId.trim())) throw new Error(`${label}: placeId must be non-empty when present.`);
}
for (const resident of snapshot.residents) {
  if (!actionPresentationById.has(resident.currentAction?.actionId)) throw new Error(`${resident.id}: CurrentAction references unknown Action Presentation.`);
  validateActionContext(resident.currentAction, `${resident.id}: CurrentAction`);
  if (!Array.isArray(resident.recentActions) || resident.recentActions.length > definitions.generation.recentActionCapacity) throw new Error(`${resident.id}: invalid recentActions buffer.`);
  const lastDayByAction = new Map(); let previousActionId;
  for (const record of [...resident.recentActions].sort((left, right) => left.day - right.day)) {
    const presentation = actionPresentationById.get(record.actionId);
    if (!presentation || !Number.isInteger(record.variantIndex) || record.variantIndex < 0 || record.variantIndex >= presentation.variants.length) throw new Error(`${resident.id}: invalid RecentAction presentation reference.`);
    if (record.actionId === previousActionId) throw new Error(`${resident.id}: adjacent RecentAction duplicate ${record.actionId}.`);
    const previousDay = lastDayByAction.get(record.actionId);
    if (previousDay !== undefined && record.day - previousDay < presentation.cooldownDays) throw new Error(`${resident.id}: ${record.actionId} violates cooldownDays.`);
    if ('title' in record || 'text' in record || 'contextResidentId' in record || 'routineId' in record) throw new Error(`${resident.id}: RecentAction must store compact facts only.`);
    validateActionContext(record, `${resident.id}: RecentAction ${record.id}`);
    lastDayByAction.set(record.actionId, record.day); previousActionId = record.actionId;
  }
}
for (const resident of snapshot.residents) {
  if (!resident.fatherId) continue;
  const father = residentById.get(resident.fatherId);
  if (!father || resident.surnameId !== father.surnameId) throw new Error(`${resident.id}: invalid father/surname relation.`);
}

await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
console.log(`Validated ${snapshot.residents.length} V3 fixture residents with RecentAction, recentLifeEvents, LifeTags and LifeChapters.`);
