import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const generatedDir = join(root, 'Web', 'public', 'generated');

async function readJson(name) {
  return JSON.parse(await readFile(join(generatedDir, name), 'utf8'));
}

const snapshot = await readJson('resident-snapshot.json');
const definitions = await readJson('definitions.json');
const appearanceCatalog = await readJson('appearance-catalog.json');

if (snapshot.schema !== 'wanhu.resident-snapshot.v2') {
  throw new Error(`ResidentAppearanceCompiler expected wanhu.resident-snapshot.v2, got ${snapshot.schema}`);
}
if (definitions.schema !== 'wanhu.resident-definitions.v3') {
  throw new Error(`ResidentAppearanceCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if (appearanceCatalog.schema !== 'wanhu.appearance-catalog.v1') {
  throw new Error(`Unsupported appearance catalog schema: ${appearanceCatalog.schema}`);
}

const occupationById = new Map(definitions.occupations.map((item) => [item.id, item]));
const partById = new Map(appearanceCatalog.parts.map((item) => [item.id, item]));
const paletteById = new Map(appearanceCatalog.palettes.map((item) => [item.id, item]));
const validFaceFamilies = new Set(['oval', 'round', 'long', 'square', 'broad']);
const validHairVisibility = new Set(['full', 'back-only', 'hidden']);
const rigKeys = ['centerX', 'topY', 'hairlineY', 'browY', 'eyeY', 'noseY', 'mouthY', 'chinY', 'faceWidth', 'jawWidth', 'earY', 'neckTopY', 'shoulderY'];

function hash32(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function compatibilityWeight(item, faceFamily) {
  let multiplier = 1;
  if (item.preferredFaceFamilies?.includes(faceFamily)) multiplier *= 1.35;
  if (item.avoidFaceFamilies?.includes(faceFamily)) multiplier *= 0.3;
  return Math.max(0, Number(item.weight ?? 1)) * multiplier;
}

function weightedPick(seed, salt, items, faceFamily = null) {
  if (!items.length) throw new Error(`No appearance candidates for ${salt}.`);
  const weightOf = (item) => faceFamily ? compatibilityWeight(item, faceFamily) : Math.max(0, Number(item.weight ?? 1));
  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  if (total <= 0) return items[0];
  let cursor = (hash32(`${seed}:appearance:${salt}`) / 4294967296) * total;
  for (const item of items) {
    cursor -= weightOf(item);
    if (cursor <= 0) return item;
  }
  return items.at(-1);
}

function matches(item, resident, occupationGroupId) {
  if (item.genders?.length && !item.genders.includes(resident.gender)) return false;
  if (item.lifeStages?.length && !item.lifeStages.includes(resident.lifeStage)) return false;
  if (item.occupationGroups?.length && !item.occupationGroups.includes(occupationGroupId)) return false;
  return true;
}

function choosePart(resident, occupationGroupId, slot, faceFamily = null) {
  const candidates = appearanceCatalog.parts.filter((item) => item.slot === slot && matches(item, resident, occupationGroupId));
  return weightedPick(resident.seed, `part:${slot}`, candidates, faceFamily).id;
}

function choosePalette(resident, occupationGroupId, slot) {
  const candidates = appearanceCatalog.palettes.filter((item) => item.slot === slot && matches(item, resident, occupationGroupId));
  return weightedPick(resident.seed, `palette:${slot}`, candidates).id;
}

function portraitSeedFromAppearance(appearance) {
  return hash32([
    appearance.faceId,
    appearance.hairId,
    appearance.browId,
    appearance.facialHairId,
    appearance.headwearId,
    appearance.outfitId,
    appearance.skinPaletteId,
    appearance.hairPaletteId,
    appearance.clothingPaletteId,
  ].join('|'));
}

for (const part of appearanceCatalog.parts) {
  for (const family of [...(part.preferredFaceFamilies ?? []), ...(part.avoidFaceFamilies ?? [])]) {
    if (!validFaceFamilies.has(family)) throw new Error(`${part.id}: invalid face family ${family}.`);
  }
  if (part.slot === 'face') {
    if (!validFaceFamilies.has(part.faceFamily)) throw new Error(`${part.id}: face part requires a valid faceFamily.`);
    if (!part.rig) throw new Error(`${part.id}: face part requires PortraitRig data.`);
    for (const key of rigKeys) if (!Number.isFinite(part.rig[key])) throw new Error(`${part.id}: rig.${key} must be numeric.`);
    const rig = part.rig;
    if (!(rig.topY < rig.hairlineY && rig.hairlineY < rig.browY && rig.browY < rig.eyeY && rig.eyeY < rig.noseY && rig.noseY < rig.mouthY && rig.mouthY < rig.chinY)) {
      throw new Error(`${part.id}: PortraitRig vertical anchors are out of order.`);
    }
    if (!(rig.jawWidth > 0 && rig.faceWidth >= rig.jawWidth)) throw new Error(`${part.id}: invalid PortraitRig widths.`);
  }
  if (part.slot === 'headwear' && !validHairVisibility.has(part.hairVisibility)) {
    throw new Error(`${part.id}: headwear requires hairVisibility.`);
  }
}

for (const resident of snapshot.residents) {
  const occupation = occupationById.get(resident.occupationId);
  if (!occupation) throw new Error(`${resident.id}: unknown occupation ${resident.occupationId}.`);
  const occupationGroupId = occupation.groupId;
  const faceId = choosePart(resident, occupationGroupId, 'face');
  const faceFamily = partById.get(faceId)?.faceFamily;
  if (!validFaceFamilies.has(faceFamily)) throw new Error(`${resident.id}: ${faceId} has no valid faceFamily.`);

  resident.appearance = {
    faceId,
    hairId: choosePart(resident, occupationGroupId, 'hair', faceFamily),
    browId: choosePart(resident, occupationGroupId, 'brow', faceFamily),
    facialHairId: choosePart(resident, occupationGroupId, 'facial-hair', faceFamily),
    headwearId: choosePart(resident, occupationGroupId, 'headwear', faceFamily),
    outfitId: choosePart(resident, occupationGroupId, 'outfit', faceFamily),
    skinPaletteId: choosePalette(resident, occupationGroupId, 'skin'),
    hairPaletteId: choosePalette(resident, occupationGroupId, 'hair'),
    clothingPaletteId: choosePalette(resident, occupationGroupId, 'clothing'),
  };

  for (const id of [resident.appearance.faceId, resident.appearance.hairId, resident.appearance.browId, resident.appearance.facialHairId, resident.appearance.headwearId, resident.appearance.outfitId]) {
    if (!partById.has(id)) throw new Error(`${resident.id}: generated unknown appearance part ${id}.`);
  }
  for (const id of [resident.appearance.skinPaletteId, resident.appearance.hairPaletteId, resident.appearance.clothingPaletteId]) {
    if (!paletteById.has(id)) throw new Error(`${resident.id}: generated unknown appearance palette ${id}.`);
  }

  resident.portraitSeed = portraitSeedFromAppearance(resident.appearance);
}

snapshot.schema = 'wanhu.resident-snapshot.v3';
await writeFile(join(generatedDir, 'resident-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`Compiled stable AppearanceDNA with PortraitRig compatibility for ${snapshot.residents.length} residents.`);
