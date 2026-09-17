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
const occupationGroups = await readJson('Content/Occupations/occupation-groups.json');
const occupations = await readJson('Content/Occupations/occupations.json');
const routines = await readJson('Content/Routines/routine-templates.json');
const lifeEvents = await readJson('Content/LifeEvents/life-events.json');
const appearance = await readJson('Content/Appearance/appearance-parts.json');

if (surnames.schema !== 'wanhu.surnames.v2') throw new Error(`Unsupported surname schema: ${surnames.schema}`);
if (givenNames.schema !== 'wanhu.given-names.v2') throw new Error(`Unsupported given-name schema: ${givenNames.schema}`);
if (lifeTags.schema !== 'wanhu.life-tags.v1') throw new Error(`Unsupported life-tag schema: ${lifeTags.schema}`);
if (occupationGroups.schema !== 'wanhu.occupation-groups.v1') throw new Error(`Unsupported occupation-group schema: ${occupationGroups.schema}`);
if (lifeEvents.schema !== 'wanhu.life-events.v2') throw new Error(`Unsupported LifeEvent schema: ${lifeEvents.schema}`);
if (appearance.schema !== 'wanhu.appearance-parts.v1') throw new Error(`Unsupported appearance schema: ${appearance.schema}`);

const stableIdPattern = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/;
const validGenders = new Set(['male', 'female']);
const validLifeStages = new Set(['child', 'teen', 'young-adult', 'adult', 'middle-age', 'elder']);
const appearancePartSlots = new Set(['face', 'hair', 'brow', 'facial-hair', 'headwear', 'outfit']);
const appearancePaletteSlots = new Set(['skin', 'hair', 'clothing']);
const structuralRequestTypes = new Set(['changeOccupation', 'moveHousehold', 'formMarriage', 'addChild']);

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

function assertUniqueStrings(items, label) {
  const seen = new Set();
  for (const value of items ?? []) {
    if (seen.has(value)) throw new Error(`${label} contains duplicate value ${value}.`);
    seen.add(value);
  }
}

function validateFilterList(items, allowed, label) {
  assertUniqueStrings(items, label);
  for (const value of items ?? []) {
    if (!allowed.has(value)) throw new Error(`${label} contains unsupported value ${value}.`);
  }
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
  assertUniqueStrings(item.styles, `${item.id}.styles`);
  assertUniqueStrings(item.generationGroups, `${item.id}.generationGroups`);
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
  assertUniqueStrings(item.styles, `${item.id}.styles`);
  assertUniqueStrings(item.generationGroups, `${item.id}.generationGroups`);
}

requireArray(lifeTags.items, 'LifeTag registry');
for (const item of lifeTags.items) {
  register(item.id, 'life-tag', 'Content/Tags/life-tags.json');
  if (!item.id.startsWith('lifetag.')) throw new Error(`${item.id}: life-tag id must start with lifetag.`);
  if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: life-tag label is required.`);
}

requireArray(occupationGroups.items, 'Occupation groups');
for (const item of occupationGroups.items) {
  register(item.id, 'occupation-group', 'Content/Occupations/occupation-groups.json');
  if (!item.id.startsWith('occupation-group.')) throw new Error(`${item.id}: occupation-group id must start with occupation-group.`);
  if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: occupation-group label is required.`);
}

for (const item of occupations.items ?? []) register(item.id, 'occupation', 'Content/Occupations/occupations.json');
for (const item of routines.items ?? []) register(item.id, 'routine', 'Content/Routines/routine-templates.json');
for (const item of lifeEvents.items ?? []) register(item.id, 'life-event', 'Content/LifeEvents/life-events.json');

requireArray(appearance.parts, 'Appearance parts');
requireArray(appearance.palettes, 'Appearance palettes');
for (const item of appearance.parts) {
  register(item.id, 'appearance-part', 'Content/Appearance/appearance-parts.json');
  if (!item.id.startsWith('appearance.')) throw new Error(`${item.id}: appearance id must start with appearance.`);
  if (!appearancePartSlots.has(item.slot)) throw new Error(`${item.id}: unsupported appearance slot ${item.slot}.`);
  if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: appearance label is required.`);
  validateWeight(item.weight, item.id);
  validateFilterList(item.genders, validGenders, `${item.id}.genders`);
  validateFilterList(item.lifeStages, validLifeStages, `${item.id}.lifeStages`);
}
for (const item of appearance.palettes) {
  register(item.id, 'appearance-palette', 'Content/Appearance/appearance-parts.json');
  if (!item.id.startsWith('appearance.palette.')) throw new Error(`${item.id}: appearance palette id must start with appearance.palette.`);
  if (!appearancePaletteSlots.has(item.slot)) throw new Error(`${item.id}: unsupported palette slot ${item.slot}.`);
  if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: palette label is required.`);
  validateWeight(item.weight, item.id);
  validateFilterList(item.genders, validGenders, `${item.id}.genders`);
  validateFilterList(item.lifeStages, validLifeStages, `${item.id}.lifeStages`);
}

const occupationGroupIds = new Set(occupationGroups.items.map((item) => item.id));
const occupationIds = new Set((occupations.items ?? []).map((item) => item.id));
const lifeTagIds = new Set(lifeTags.items.map((item) => item.id));
const occupationById = new Map(occupations.items.map((item) => [item.id, item]));

for (const occupation of occupations.items ?? []) {
  if (!occupationGroupIds.has(occupation.groupId)) throw new Error(`${occupation.id}: references unknown occupation group ${occupation.groupId}.`);
}

for (const routine of routines.items ?? []) {
  if (routine.occupation !== null && !occupationIds.has(routine.occupation)) {
    throw new Error(`${routine.id}: references unknown occupation ${routine.occupation}.`);
  }
}

for (const item of [...appearance.parts, ...appearance.palettes]) {
  assertUniqueStrings(item.occupationGroups, `${item.id}.occupationGroups`);
  for (const groupId of item.occupationGroups ?? []) {
    if (!occupationGroupIds.has(groupId)) throw new Error(`${item.id}: references unknown occupation group ${groupId}.`);
  }
}
for (const slot of appearancePartSlots) {
  if (!appearance.parts.some((item) => item.slot === slot)) throw new Error(`Appearance catalog has no part for slot ${slot}.`);
}
for (const slot of appearancePaletteSlots) {
  if (!appearance.palettes.some((item) => item.slot === slot)) throw new Error(`Appearance catalog has no palette for slot ${slot}.`);
}

const structuralRequestCounts = Object.fromEntries([...structuralRequestTypes].map((type) => [type, 0]));
for (const event of lifeEvents.items ?? []) {
  const rule = event.eligibility ?? {};
  const requiredTags = rule.requiredTags ?? [];
  const forbiddenTags = rule.forbiddenTags ?? [];
  const addTags = event.effects?.addTags ?? [];
  const removeTags = event.effects?.removeTags ?? [];
  const structuralRequests = event.effects?.structuralRequests ?? [];

  for (const occupationId of rule.occupations ?? []) {
    if (!occupationIds.has(occupationId)) throw new Error(`${event.id}: references unknown occupation ${occupationId}.`);
  }
  for (const groupId of rule.occupationGroups ?? []) {
    if (!occupationGroupIds.has(groupId)) throw new Error(`${event.id}: references unknown occupation group ${groupId}.`);
  }
  for (const tagId of [...requiredTags, ...forbiddenTags, ...addTags, ...removeTags]) {
    if (!lifeTagIds.has(tagId)) throw new Error(`${event.id}: references unknown LifeTag ${tagId}.`);
  }
  assertUniqueStrings(requiredTags, `${event.id}.eligibility.requiredTags`);
  assertUniqueStrings(forbiddenTags, `${event.id}.eligibility.forbiddenTags`);
  assertUniqueStrings(rule.occupationGroups, `${event.id}.eligibility.occupationGroups`);
  assertUniqueStrings(addTags, `${event.id}.effects.addTags`);
  assertUniqueStrings(removeTags, `${event.id}.effects.removeTags`);

  const requiredSet = new Set(requiredTags);
  for (const tagId of forbiddenTags) if (requiredSet.has(tagId)) throw new Error(`${event.id}: ${tagId} cannot be both required and forbidden.`);
  const addSet = new Set(addTags);
  for (const tagId of removeTags) if (addSet.has(tagId)) throw new Error(`${event.id}: ${tagId} cannot be both added and removed.`);

  if (!Array.isArray(structuralRequests)) throw new Error(`${event.id}.effects.structuralRequests must be an array.`);
  if (structuralRequests.length > 4) throw new Error(`${event.id}: at most 4 structuralRequests are allowed.`);
  const seenStructuralTypes = new Set();
  for (const request of structuralRequests) {
    if (!request || !structuralRequestTypes.has(request.type)) throw new Error(`${event.id}: unsupported structural request ${request?.type}.`);
    if (seenStructuralTypes.has(request.type)) throw new Error(`${event.id}: duplicate structural request type ${request.type}.`);
    seenStructuralTypes.add(request.type);
    structuralRequestCounts[request.type] += 1;
    if (request.type === 'changeOccupation' && !occupationIds.has(request.occupationId)) {
      throw new Error(`${event.id}: structural request references unknown occupation ${request.occupationId}.`);
    }
    if (request.type === 'moveHousehold' && !['same-district', 'different-district', 'any-district'].includes(request.policy)) {
      throw new Error(`${event.id}: invalid moveHousehold policy ${request.policy}.`);
    }
  }
}

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

const appearanceCatalog = {
  schema: 'wanhu.appearance-catalog.v1',
  parts: appearance.parts,
  palettes: appearance.palettes,
};

const LIFE_PHASES = [
  { id: 'child', minAge: 0, maxAge: 12 },
  { id: 'teen', minAge: 13, maxAge: 17 },
  { id: 'young-adult', minAge: 18, maxAge: 29 },
  { id: 'adult', minAge: 30, maxAge: 44 },
  { id: 'middle-age', minAge: 45, maxAge: 59 },
  { id: 'elder', minAge: 60, maxAge: 120 },
];

function eventOverlapsPhase(event, phase) {
  const minAge = Number(event.eligibility?.minAge ?? 0);
  const maxAge = Number(event.eligibility?.maxAge ?? 200);
  return minAge <= phase.maxAge && maxAge >= phase.minAge;
}

function eventMatchesOccupation(event, occupationId) {
  const occupation = occupationById.get(occupationId);
  const occupationList = event.eligibility?.occupations;
  const groupList = event.eligibility?.occupationGroups;
  if (Array.isArray(occupationList) && occupationList.length && !occupationList.includes(occupationId)) return false;
  if (Array.isArray(groupList) && groupList.length && (!occupation || !groupList.includes(occupation.groupId))) return false;
  return true;
}

const phaseCoverage = LIFE_PHASES.map((phase) => ({
  phase: phase.id,
  lifeEvents: lifeEvents.items.filter((event) => eventOverlapsPhase(event, phase)).length,
  lifeChapters: lifeEvents.items.filter((event) => event.recordToHistory && eventOverlapsPhase(event, phase)).length,
}));

const occupationCoverage = occupations.items.map((occupation) => ({
  occupationId: occupation.id,
  occupationGroupId: occupation.groupId,
  lifeEvents: lifeEvents.items.filter((event) => eventMatchesOccupation(event, occupation.id)).length,
  lifeChapters: lifeEvents.items.filter((event) => event.recordToHistory && eventMatchesOccupation(event, occupation.id)).length,
  routines: routines.items.filter((routine) => routine.occupation === occupation.id).length,
}));

const groupCoverage = occupationGroups.items.map((group) => {
  const groupOccupations = occupations.items.filter((occupation) => occupation.groupId === group.id);
  const eventIds = new Set();
  const chapterIds = new Set();
  for (const occupation of groupOccupations) {
    for (const event of lifeEvents.items) {
      if (!eventMatchesOccupation(event, occupation.id)) continue;
      eventIds.add(event.id);
      if (event.recordToHistory) chapterIds.add(event.id);
    }
  }
  return {
    occupationGroupId: group.id,
    occupations: groupOccupations.length,
    lifeEvents: eventIds.size,
    lifeChapters: chapterIds.size,
  };
});

const referencedTags = new Set();
const producedTags = new Set();
for (const event of lifeEvents.items) {
  for (const tagId of [...(event.eligibility?.requiredTags ?? []), ...(event.eligibility?.forbiddenTags ?? [])]) referencedTags.add(tagId);
  for (const tagId of event.effects?.addTags ?? []) producedTags.add(tagId);
}

const countBySlot = (items) => Object.fromEntries([...new Set(items.map((item) => item.slot))].sort().map((slot) => [slot, items.filter((item) => item.slot === slot).length]));
const warnings = [];
for (const phase of phaseCoverage) if (phase.lifeChapters === 0) warnings.push(`No recordable Life Chapter for phase ${phase.phase}.`);
for (const occupation of occupationCoverage) if (occupation.routines === 0) warnings.push(`${occupation.occupationId} has no occupation-specific Routine.`);
for (const group of groupCoverage) if (group.lifeEvents === 0) warnings.push(`${group.occupationGroupId} has no LifeEvent coverage.`);
for (const tag of lifeTags.items) if (!referencedTags.has(tag.id) && !producedTags.has(tag.id)) warnings.push(`${tag.id} is registered but not yet used by LifeEvent eligibility/effects.`);

const coverage = {
  schema: 'wanhu.resident-content-coverage.v1',
  names: {
    surnames: surnames.items.length,
    maleGivenNames: givenNames.items.filter((item) => item.gender === 'male').length,
    femaleGivenNames: givenNames.items.filter((item) => item.gender === 'female').length,
    unisexGivenNames: givenNames.items.filter((item) => item.gender === 'unisex').length,
  },
  appearance: {
    parts: appearance.parts.length,
    partsBySlot: countBySlot(appearance.parts),
    palettes: appearance.palettes.length,
    palettesBySlot: countBySlot(appearance.palettes),
  },
  lifeTags: {
    total: lifeTags.items.length,
    referencedByEligibility: referencedTags.size,
    producedByEffects: producedTags.size,
  },
  occupationGroups: groupCoverage,
  lifeEvents: {
    total: lifeEvents.items.length,
    recordable: lifeEvents.items.filter((item) => item.recordToHistory).length,
    phaseCoverage,
    occupationCoverage,
    structuralRequestsByType: structuralRequestCounts,
  },
  warnings,
};

await mkdir(generatedDir, { recursive: true });
await writeFile(join(generatedDir, 'stable-id-registry.json'), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'name-catalog-v2.json'), `${JSON.stringify(nameCatalog, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'life-tags.json'), `${JSON.stringify(lifeTags, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'occupation-groups.json'), `${JSON.stringify(occupationGroups, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'appearance-catalog.json'), `${JSON.stringify(appearanceCatalog, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'content-coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`, 'utf8');

console.log(`Validated ${registry.items.length} Stable IDs, ${appearance.parts.length + appearance.palettes.length} appearance definitions, ${occupationGroups.items.length} occupation groups, ${lifeTags.items.length} LifeTags and ${lifeEvents.items.length} LifeEvents.`);
console.log(`Coverage report emitted with ${warnings.length} non-fatal warning(s).`);
