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

function hash32(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function weightedPick(seed, salt, items) {
  if (!items.length) throw new Error(`No appearance candidates for ${salt}.`);
  const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.weight ?? 1)), 0);
  if (total <= 0) return items[0];
  let cursor = (hash32(`${seed}:appearance:${salt}`) / 4294967296) * total;
  for (const item of items) {
    cursor -= Math.max(0, Number(item.weight ?? 1));
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

function choosePart(resident, occupationGroupId, slot) {
  const candidates = appearanceCatalog.parts.filter((item) => item.slot === slot && matches(item, resident, occupationGroupId));
  return weightedPick(resident.seed, `part:${slot}`, candidates).id;
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

for (const resident of snapshot.residents) {
  const occupation = occupationById.get(resident.occupationId);
  if (!occupation) throw new Error(`${resident.id}: unknown occupation ${resident.occupationId}.`);
  const occupationGroupId = occupation.groupId;

  resident.appearance = {
    faceId: choosePart(resident, occupationGroupId, 'face'),
    hairId: choosePart(resident, occupationGroupId, 'hair'),
    browId: choosePart(resident, occupationGroupId, 'brow'),
    facialHairId: choosePart(resident, occupationGroupId, 'facial-hair'),
    headwearId: choosePart(resident, occupationGroupId, 'headwear'),
    outfitId: choosePart(resident, occupationGroupId, 'outfit'),
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

  // Web 现有 SVG 头像仍以 portraitSeed 选取变体；把 Seed 改为 AppearanceDNA 的确定性投影，
  // 让当前原型先由稳定外观身份驱动，同时不把这套 SVG 变体映射误当成正式资源契约。
  resident.portraitSeed = portraitSeedFromAppearance(resident.appearance);
}

snapshot.schema = 'wanhu.resident-snapshot.v3';
await writeFile(join(generatedDir, 'resident-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`Compiled stable AppearanceDNA for ${snapshot.residents.length} residents and projected it into Web portrait seeds.`);
