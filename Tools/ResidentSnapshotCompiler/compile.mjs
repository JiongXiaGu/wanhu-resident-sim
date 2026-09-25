import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const snapshotPath = join(root, 'Web', 'public', 'generated', 'resident-snapshot.json');
const definitionsPath = join(root, 'Web', 'public', 'generated', 'definitions.json');
const nameCatalogPath = join(root, 'Web', 'public', 'generated', 'name-catalog-v2.json');

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

const snapshot = await readJson(snapshotPath);
const definitions = await readJson(definitionsPath);
const nameCatalog = await readJson(nameCatalogPath);

if (snapshot.schema !== 'wanhu.resident-snapshot.v2') {
  throw new Error(`ResidentSnapshotCompiler expected wanhu.resident-snapshot.v2, got ${snapshot.schema}`);
}
if (definitions.schema !== 'wanhu.resident-definitions.v3') {
  throw new Error(`ResidentSnapshotCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if (nameCatalog.schema !== 'wanhu.name-catalog.v2') {
  throw new Error(`Unsupported name catalog schema: ${nameCatalog.schema}`);
}

const surnameById = new Map(nameCatalog.surnames.map((item) => [item.id, item]));
const givenNameById = new Map(nameCatalog.givenNames.map((item) => [item.id, item]));
const eventById = new Map(definitions.lifeEvents.map((item) => [item.id, item]));
const routineById = new Map(definitions.routines.map((item) => [item.id, item]));
const knownLifeTags = new Set(definitions.lifeTags.map((item) => item.id));

function applyEffects(tags, effects, residentId, eventId) {
  for (const tagId of effects?.removeTags ?? []) {
    if (!knownLifeTags.has(tagId)) throw new Error(`${residentId}: ${eventId} removes unknown LifeTag ${tagId}`);
    tags.delete(tagId);
  }
  for (const tagId of effects?.addTags ?? []) {
    if (!knownLifeTags.has(tagId)) throw new Error(`${residentId}: ${eventId} adds unknown LifeTag ${tagId}`);
    tags.add(tagId);
  }
}

for (const resident of snapshot.residents) {
  const surname = surnameById.get(resident.surnameId);
  if (!surname) throw new Error(`${resident.id}: unknown surnameId ${resident.surnameId}.`);
  if (surname.text !== resident.surname) {
    throw new Error(`${resident.id}: surname text ${resident.surname} does not match ${resident.surnameId} (${surname.text}).`);
  }

  const givenName = givenNameById.get(resident.givenNameId);
  if (!givenName) throw new Error(`${resident.id}: unknown givenNameId ${resident.givenNameId}.`);
  if (givenName.gender !== resident.gender && givenName.gender !== 'unisex') {
    throw new Error(`${resident.id}: ${resident.givenNameId} is incompatible with ${resident.gender}.`);
  }
  if (resident.displayName !== `${surname.text}${givenName.text}`) {
    throw new Error(`${resident.id}: displayName ${resident.displayName} does not match Stable Name tokens.`);
  }

  const tags = new Set();
  const chronologicalHistory = [...resident.majorLifeHistory].sort((left, right) => left.day - right.day);
  for (const chapter of chronologicalHistory) {
    if (!chapter.sourceEventId) continue;
    const event = eventById.get(chapter.sourceEventId);
    if (!event) throw new Error(`${resident.id}: history references unknown LifeEvent ${chapter.sourceEventId}.`);
    applyEffects(tags, event.effects, resident.id, event.id);
  }
  resident.lifeTags = [...tags].sort();

  // occupationGroupId is useful while generating history, but the final Web snapshot derives it from occupation definitions.
  delete resident.occupationGroupId;
}

const residentById = new Map(snapshot.residents.map((resident) => [resident.id, resident]));
const householdById = new Map(snapshot.households.map((household) => [household.id, household]));

function routineContextResidentMatches(relation, resident, target, household) {
  if (target.id === resident.id) return false;
  if (relation === 'spouse') return resident.spouseId === target.id;
  if (relation === 'child') return target.fatherId === resident.id || target.motherId === resident.id;
  if (relation === 'parent') return resident.fatherId === target.id || resident.motherId === target.id;
  return target.householdId === resident.householdId && Boolean(household?.memberIds.includes(target.id));
}

for (const resident of snapshot.residents) {
  const household = householdById.get(resident.householdId);
  for (const record of resident.recentLifeLog) {
    if (!record.routineId) continue;
    const routine = routineById.get(record.routineId);
    if (!routine) throw new Error(`${resident.id}: recent Routine references unknown definition ${record.routineId}.`);
    const relation = routine.context?.residentTarget;
    if (!relation) {
      if (record.contextResidentId !== undefined) throw new Error(`${resident.id}: ${record.routineId} stores unexpected ContextResidentId.`);
      continue;
    }
    if (!Number.isInteger(record.contextResidentId)) throw new Error(`${resident.id}: ${record.routineId} is missing ContextResidentId.`);
    const target = residentById.get(record.contextResidentId);
    if (!target) throw new Error(`${resident.id}: ${record.routineId} targets missing resident ${record.contextResidentId}.`);
    if (!routineContextResidentMatches(relation, resident, target, household)) {
      throw new Error(`${resident.id}: ${record.routineId} ContextResidentId ${record.contextResidentId} does not match ${relation}.`);
    }
  }
}

for (const resident of snapshot.residents) {
  if (!resident.fatherId) continue;
  const father = residentById.get(resident.fatherId);
  if (!father) throw new Error(`${resident.id}: father ${resident.fatherId} does not exist.`);
  if (resident.surnameId !== father.surnameId) {
    throw new Error(`${resident.id}: child surname ${resident.surnameId} differs from father ${father.surnameId}.`);
  }
}

await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

const taggedResidents = snapshot.residents.filter((resident) => resident.lifeTags.length > 0).length;
console.log(`Validated ${snapshot.residents.length} Name V2 identities; ${taggedResidents} residents carry LifeTags.`);
