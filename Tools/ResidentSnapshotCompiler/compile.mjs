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

if (snapshot.schema !== 'wanhu.resident-snapshot.v1') {
  throw new Error(`ResidentSnapshotCompiler expected wanhu.resident-snapshot.v1, got ${snapshot.schema}`);
}
if (definitions.schema !== 'wanhu.resident-definitions.v3') {
  throw new Error(`ResidentSnapshotCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if (nameCatalog.schema !== 'wanhu.name-catalog.v2') {
  throw new Error(`Unsupported name catalog schema: ${nameCatalog.schema}`);
}

const surnameByText = new Map(nameCatalog.surnames.map((item) => [item.text, item]));
const givenNamesByText = new Map();
for (const item of nameCatalog.givenNames) {
  const list = givenNamesByText.get(item.text) ?? [];
  list.push(item);
  givenNamesByText.set(item.text, list);
}
const eventById = new Map(definitions.lifeEvents.map((item) => [item.id, item]));
const knownLifeTags = new Set(definitions.lifeTags.map((item) => item.id));

function resolveGivenName(resident, text) {
  const candidates = givenNamesByText.get(text) ?? [];
  const compatible = candidates.filter((item) => item.gender === resident.gender || item.gender === 'unisex');
  if (compatible.length === 1) return compatible[0];
  if (compatible.length > 1) {
    throw new Error(`${resident.id}: ambiguous Name V2 token for ${resident.displayName}: ${compatible.map((item) => item.id).join(', ')}`);
  }
  throw new Error(`${resident.id}: no Name V2 token for ${resident.displayName} (${resident.gender}).`);
}

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
  const surname = surnameByText.get(resident.surname);
  if (!surname) throw new Error(`${resident.id}: surname "${resident.surname}" is missing from Name V2.`);

  const givenText = resident.displayName.slice(resident.surname.length);
  const givenName = resolveGivenName(resident, givenText);
  resident.surnameId = surname.id;
  resident.givenNameId = givenName.id;

  const tags = new Set();
  const chronologicalHistory = [...resident.majorLifeHistory].sort((left, right) => left.day - right.day);
  for (const chapter of chronologicalHistory) {
    if (!chapter.sourceEventId) continue;
    const event = eventById.get(chapter.sourceEventId);
    if (!event) throw new Error(`${resident.id}: history references unknown LifeEvent ${chapter.sourceEventId}.`);
    applyEffects(tags, event.effects, resident.id, event.id);
  }
  resident.lifeTags = [...tags].sort();
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

snapshot.schema = 'wanhu.resident-snapshot.v2';
await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

const taggedResidents = snapshot.residents.filter((resident) => resident.lifeTags.length > 0).length;
console.log(`Enriched ${snapshot.residents.length} residents with Name V2 IDs; ${taggedResidents} residents carry LifeTags.`);
