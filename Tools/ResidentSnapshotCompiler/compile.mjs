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
