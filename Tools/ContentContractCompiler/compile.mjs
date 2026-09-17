import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const generatedDir = join(root, 'Web', 'public', 'generated');

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), 'utf8'));
}

const surnames = await readJson('Content/Names/surnames-v2.json');
const givenNames = await readJson('Content/Names/given-names-v2.json');
const lifeTags = await readJson('Content/Tags/life-tags.json');
const occupations = await readJson('Content/Occupations/occupations.json');
const routines = await readJson('Content/Routines/routine-templates.json');
const lifeEvents = await readJson('Content/LifeEvents/life-events.json');

if (surnames.schema !== 'wanhu.surnames.v2') throw new Error(`Unsupported surname schema: ${surnames.schema}`);
if (givenNames.schema !== 'wanhu.given-names.v2') throw new Error(`Unsupported given-name schema: ${givenNames.schema}`);
if (lifeTags.schema !== 'wanhu.life-tags.v1') throw new Error(`Unsupported life-tag schema: ${lifeTags.schema}`);

const stableIdPattern = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9-]*)+$/;

function fnv1a32(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const registryById = new Map();
const registryByHash = new Map();

function register(id, kind, source) {
  if (typeof id !== 'string' || !stableIdPattern.test(id)) {
    throw new Error(`Invalid Stable ID "${id}" from ${source}. Expected lowercase dotted ASCII id.`);
  }
  if (registryById.has(id)) {
    const previous = registryById.get(id);
    throw new Error(`Duplicate Stable ID "${id}" in ${previous.source} and ${source}.`);
  }
  const hash = fnv1a32(id);
  const previousHash = registryByHash.get(hash);
  if (previousHash && previousHash.id !== id) {
    throw new Error(`FNV-1a 32 collision: "${previousHash.id}" and "${id}" => ${hash}.`);
  }
  const record = {
    id,
    hash,
    hashHex: `0x${hash.toString(16).padStart(8, '0')}`,
    kind,
    source,
  };
  registryById.set(id, record);
  registryByHash.set(hash, record);
}

function requireArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${label} must contain at least one item.`);
}

function validateWeight(value, label) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label}.weight must be > 0.`);
}

requireArray(surnames.items, 'Surname V2');
const surnameTexts = new Set();
for (const item of surnames.items) {
  register(item.id, 'surname', 'Content/Names/surnames-v2.json');
  if (!item.id.startsWith('name.surname.')) throw new Error(`${item.id}: surname id must start with name.surname.`);
  if (typeof item.text !== 'string' || !item.text.trim()) throw new Error(`${item.id}: surname text is required.`);
  validateWeight(item.weight, item.id);
  if (surnameTexts.has(item.text)) throw new Error(`${item.id}: duplicate surname text "${item.text}".`);
  surnameTexts.add(item.text);
}

requireArray(givenNames.items, 'Given Name V2');
const givenTextByGender = new Set();
for (const item of givenNames.items) {
  register(item.id, 'given-name', 'Content/Names/given-names-v2.json');
  if (!item.id.startsWith('name.given.')) throw new Error(`${item.id}: given-name id must start with name.given.`);
  if (typeof item.text !== 'string' || !item.text.trim()) throw new Error(`${item.id}: given-name text is required.`);
  if (!['male', 'female', 'unisex'].includes(item.gender)) throw new Error(`${item.id}: invalid gender "${item.gender}".`);
  validateWeight(item.weight, item.id);
  const textKey = `${item.gender}:${item.text}`;
  if (givenTextByGender.has(textKey)) throw new Error(`${item.id}: duplicate ${item.gender} given-name text "${item.text}".`);
  givenTextByGender.add(textKey);
}

requireArray(lifeTags.items, 'LifeTag registry');
for (const item of lifeTags.items) {
  register(item.id, 'life-tag', 'Content/Tags/life-tags.json');
  if (!item.id.startsWith('lifetag.')) throw new Error(`${item.id}: life-tag id must start with lifetag.`);
  if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: life-tag label is required.`);
}

for (const item of occupations.items ?? []) register(item.id, 'occupation', 'Content/Occupations/occupations.json');
for (const item of routines.items ?? []) register(item.id, 'routine', 'Content/Routines/routine-templates.json');
for (const item of lifeEvents.items ?? []) register(item.id, 'life-event', 'Content/LifeEvents/life-events.json');

const registry = {
  schema: 'wanhu.stable-id-registry.v1',
  hashAlgorithm: 'fnv1a32-utf16',
  items: [...registryById.values()].sort((left, right) => left.id.localeCompare(right.id)),
};

const nameCatalog = {
  schema: 'wanhu.name-catalog.v2',
  surnames: surnames.items,
  givenNames: givenNames.items,
};

await mkdir(generatedDir, { recursive: true });
await writeFile(join(generatedDir, 'stable-id-registry.json'), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'name-catalog-v2.json'), `${JSON.stringify(nameCatalog, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'life-tags.json'), `${JSON.stringify(lifeTags, null, 2)}\n`, 'utf8');

console.log(`Validated ${registry.items.length} Stable IDs, ${surnames.items.length} surnames, ${givenNames.items.length} given names, and ${lifeTags.items.length} LifeTags.`);
