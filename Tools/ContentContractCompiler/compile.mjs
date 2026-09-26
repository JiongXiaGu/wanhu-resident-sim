import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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
const actionPresentations = await readJson('Content/ResidentActions/resident-action-presentations.json');
const lifeEvents = await readJson('Content/LifeEvents/life-events.json');
const portrait = await readJson('Content/Portrait/portrait-catalog.json');
const residentProfiles = await readJson('Content/Residents/resident-profile-catalog.json');

if (surnames.schema !== 'wanhu.surnames.v2') throw new Error(`Unsupported surname schema: ${surnames.schema}`);
if (givenNames.schema !== 'wanhu.given-names.v2') throw new Error(`Unsupported given-name schema: ${givenNames.schema}`);
if (lifeTags.schema !== 'wanhu.life-tags.v1') throw new Error(`Unsupported life-tag schema: ${lifeTags.schema}`);
if (occupationGroups.schema !== 'wanhu.occupation-groups.v1') throw new Error(`Unsupported occupation-group schema: ${occupationGroups.schema}`);
if (actionPresentations.schema !== 'wanhu.resident-action-presentations.v1') throw new Error(`Unsupported Action Presentation schema: ${actionPresentations.schema}`);
if (lifeEvents.schema !== 'wanhu.life-events.v3') throw new Error(`Unsupported LifeEvent schema: ${lifeEvents.schema}`);
if (portrait.schema !== 'wanhu.portrait-catalog.v2') throw new Error(`Unsupported portrait schema: ${portrait.schema}`);
if (residentProfiles.schema !== 'wanhu.resident-profile-catalog.v1') throw new Error(`Unsupported resident profile schema: ${residentProfiles.schema}`);

const stableIdPattern = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/;
const validGenders = new Set(['male', 'female']);
const validLifeStages = new Set(['child', 'teen', 'young-adult', 'adult', 'middle-age', 'elder']);
const validWealthTiers = new Set(['poor', 'plain', 'comfortable', 'wealthy']);
const validPortraitFrames = new Set(['female.child','female.adult','female.elder','male.child','male.adult','male.elder']);
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

requireArray(residentProfiles.temperaments, 'Resident temperaments');
requireArray(residentProfiles.lifeFocuses, 'Resident life focuses');
requireArray(residentProfiles.presentationStyles, 'Resident presentation styles');
for (const [kind, items] of [
  ['resident-temperament', residentProfiles.temperaments],
  ['resident-focus', residentProfiles.lifeFocuses],
  ['resident-presentation', residentProfiles.presentationStyles],
]) {
  for (const item of items) {
    register(item.id, kind, 'Content/Residents/resident-profile-catalog.json');
    if (typeof item.label !== 'string' || !item.label.trim()) throw new Error(`${item.id}: profile label is required.`);
    if (typeof item.description !== 'string' || !item.description.trim()) throw new Error(`${item.id}: profile description is required.`);
    validateWeight(item.weight, item.id);
  }
}

for (const item of occupations.items ?? []) register(item.id, 'occupation', 'Content/Occupations/occupations.json');
for (const item of actionPresentations.items ?? []) register(item.id, 'resident-action', 'Content/ResidentActions/resident-action-presentations.json');
for (const item of lifeEvents.items ?? []) register(item.id, 'life-event', 'Content/LifeEvents/life-events.json');

requireArray(portrait.faceFamilies, 'Portrait face families');
requireArray(portrait.hairStyles, 'Portrait hair styles');
requireArray(portrait.outfitStyles, 'Portrait outfit styles');
requireArray(portrait.skinPalettes, 'Portrait skin palettes');
requireArray(portrait.hairPalettes, 'Portrait hair palettes');

for (const item of portrait.faceFamilies) {
  register(item.id, 'portrait-face-family', 'Content/Portrait/portrait-catalog.json');
  validateWeight(item.weight, item.id);
  validateFilterList(item.genders, validGenders, `${item.id}.genders`);
}
for (const item of portrait.hairStyles) {
  register(item.id, 'portrait-hair-style', 'Content/Portrait/portrait-catalog.json');
  validateWeight(item.weight, item.id);
  validateFilterList(item.genders, validGenders, `${item.id}.genders`);
  validateFilterList(item.frameIds, validPortraitFrames, `${item.id}.frameIds`);
  for (const frameId of item.frameIds ?? []) {
    const frameGender=frameId.split('.')[0];
    if (!item.genders.includes(frameGender)) throw new Error(`${item.id}: frame ${frameId} conflicts with genders.`);
  }
}
for (const item of portrait.outfitStyles) {
  register(item.id, 'portrait-outfit-style', 'Content/Portrait/portrait-catalog.json');
  validateWeight(item.weight, item.id);
  validateFilterList(item.frameIds, validPortraitFrames, `${item.id}.frameIds`);
  validateFilterList(item.initialWealthTiers, validWealthTiers, `${item.id}.initialWealthTiers`);
}
for (const item of [...portrait.skinPalettes, ...portrait.hairPalettes]) {
  register(item.id, 'portrait-palette', 'Content/Portrait/portrait-catalog.json');
  validateWeight(item.weight, item.id);
}

const occupationGroupIds = new Set(occupationGroups.items.map((item) => item.id));
const occupationIds = new Set((occupations.items ?? []).map((item) => item.id));
const lifeTagIds = new Set(lifeTags.items.map((item) => item.id));
const occupationById = new Map(occupations.items.map((item) => [item.id, item]));

for (const occupation of occupations.items ?? []) {
  if (!occupationGroupIds.has(occupation.groupId)) throw new Error(`${occupation.id}: references unknown occupation group ${occupation.groupId}.`);
}

for (const item of [...residentProfiles.lifeFocuses, ...residentProfiles.presentationStyles]) {
  for (const [groupId, weight] of Object.entries(item.occupationGroupWeights ?? {})) {
    if (!occupationGroupIds.has(groupId)) throw new Error(`${item.id}: unknown occupation group weight ${groupId}.`);
    if (!Number.isFinite(weight) || weight <= 0) throw new Error(`${item.id}: occupation group weight for ${groupId} must be > 0.`);
  }
}
for (const item of residentProfiles.presentationStyles) {
  for (const [wealthTier, weight] of Object.entries(item.wealthWeights ?? {})) {
    if (!validWealthTiers.has(wealthTier)) throw new Error(`${item.id}: unknown wealth tier ${wealthTier}.`);
    if (!Number.isFinite(weight) || weight <= 0) throw new Error(`${item.id}: wealth weight for ${wealthTier} must be > 0.`);
  }
}

requireArray(actionPresentations.items, 'Resident Action presentations');
const actionVariantLengths = [];
for (const action of actionPresentations.items) {
  if (!action.id.startsWith('resident-action.')) throw new Error(`${action.id}: Action Presentation id must start with resident-action.`);
  if (typeof action.currentText !== 'string' || !action.currentText.trim()) throw new Error(`${action.id}.currentText is required.`);
  if (!Number.isInteger(action.cooldownDays) || action.cooldownDays < 0) throw new Error(`${action.id}.cooldownDays must be an integer >= 0.`);
  if (!Array.isArray(action.variants) || action.variants.length < 2 || action.variants.length > 4) throw new Error(`${action.id}.variants must contain 2-4 items.`);
  const variantTexts = new Set();
  for (const [variantIndex, variant] of action.variants.entries()) {
    if (!variant || typeof variant.text !== 'string' || !variant.text.trim()) throw new Error(`${action.id}.variants[${variantIndex}].text is required.`);
    validateWeight(variant.weight, `${action.id}.variants[${variantIndex}]`);
    if (variantTexts.has(variant.text)) throw new Error(`${action.id}: duplicate variant text ${variant.text}.`);
    variantTexts.add(variant.text);
    actionVariantLengths.push([...variant.text.trim()].length);
  }
}

const structuralRequestCounts = Object.fromEntries([...structuralRequestTypes].map((type) => [type, 0]));
requireArray(lifeEvents.items, 'LifeEvent V3');
for (const event of lifeEvents.items) {
  validateWeight(event.weight, event.id);
  if (typeof event.title !== 'string' || !event.title.trim()) throw new Error(`${event.id}: title is required.`);
  if (typeof event.text !== 'string' || !event.text.trim()) throw new Error(`${event.id}: LifeEvent V3 text is required.`);
  if ('stages' in event || 'delayDays' in event) throw new Error(`${event.id}: LifeEvent V3 must not contain Stage fields.`);
  if (event.recordToHistory !== undefined && typeof event.recordToHistory !== 'boolean') throw new Error(`${event.id}: recordToHistory must be boolean.`);
  if (event.recordToHistory && (typeof event.memoryText !== 'string' || !event.memoryText.trim())) throw new Error(`${event.id}: Story Chapter requires memoryText.`);
  if (event.memoryText !== undefined && !event.recordToHistory) throw new Error(`${event.id}: memoryText is only valid when recordToHistory is true.`);
}
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

const portraitCatalog = portrait;

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

const warnings = [];
for (const phase of phaseCoverage) if (phase.lifeChapters === 0) warnings.push(`No recordable Life Chapter for phase ${phase.phase}.`);
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
  residentProfiles: {
    temperaments: residentProfiles.temperaments.length,
    lifeFocuses: residentProfiles.lifeFocuses.length,
    presentationStyles: residentProfiles.presentationStyles.length,
  },
  portrait: {
    faceFamilies: portrait.faceFamilies.length,
    hairStyles: portrait.hairStyles.length,
    outfitStyles: portrait.outfitStyles.length,
    skinPalettes: portrait.skinPalettes.length,
    hairPalettes: portrait.hairPalettes.length,
  },
  actionPresentations: {
    total: actionPresentations.items.length,
    variants: actionPresentations.items.reduce((sum, item) => sum + item.variants.length, 0),
    minVariantCharacters: Math.min(...actionVariantLengths),
    maxVariantCharacters: Math.max(...actionVariantLengths),
    averageVariantCharacters: Number((actionVariantLengths.reduce((sum, value) => sum + value, 0) / actionVariantLengths.length).toFixed(2)),
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
await rm(join(generatedDir, 'routine-catalog-v2.json'), { force: true });
await writeFile(join(generatedDir, 'stable-id-registry.json'), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'name-catalog-v2.json'), `${JSON.stringify(nameCatalog, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'life-tags.json'), `${JSON.stringify(lifeTags, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'occupation-groups.json'), `${JSON.stringify(occupationGroups, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'resident-action-presentations.json'), `${JSON.stringify(actionPresentations, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'portrait-catalog.json'), `${JSON.stringify(portraitCatalog, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'resident-profile-catalog.json'), `${JSON.stringify(residentProfiles, null, 2)}\n`, 'utf8');
await writeFile(join(generatedDir, 'content-coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`, 'utf8');

console.log(`Validated ${registry.items.length} Stable IDs, ${actionPresentations.items.length} Action Presentations / ${actionPresentations.items.reduce((sum, item) => sum + item.variants.length, 0)} variants, ${residentProfiles.temperaments.length + residentProfiles.lifeFocuses.length + residentProfiles.presentationStyles.length} resident profile definitions, ${portrait.faceFamilies.length + portrait.hairStyles.length + portrait.outfitStyles.length + portrait.skinPalettes.length + portrait.hairPalettes.length} portrait definitions, ${occupationGroups.items.length} occupation groups, ${lifeTags.items.length} LifeTags and ${lifeEvents.items.length} LifeEvents.`);
console.log(`Coverage report emitted with ${warnings.length} non-fatal warning(s).`);
