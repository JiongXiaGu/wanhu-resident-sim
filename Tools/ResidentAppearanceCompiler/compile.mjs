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

const partById = new Map(appearanceCatalog.parts.map((item) => [item.id, item]));
const paletteById = new Map(appearanceCatalog.palettes.map((item) => [item.id, item]));
const householdById = new Map(snapshot.households.map((item) => [item.id, item]));
const validFaceFamilies = new Set(['oval', 'round', 'long', 'square', 'broad']);
const validHairVisibility = new Set(['full', 'back-only', 'hidden']);
const validWealthTiers = new Set(['poor', 'plain', 'comfortable', 'wealthy']);
const validPresentationStyles = new Set(['practical', 'tidy', 'refined']);
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

function assignHouseholdAppearanceProfile(household) {
  const wealthRoll = hash32(`${snapshot.citySeed}:household:${household.id}:wealth`) % 100;
  const wealthTier = wealthRoll < 20
    ? 'poor'
    : wealthRoll < 65
      ? 'plain'
      : wealthRoll < 92
        ? 'comfortable'
        : 'wealthy';

  const styleRoll = hash32(`${snapshot.citySeed}:household:${household.id}:presentation`) % 100;
  let presentationStyle;
  if (wealthTier === 'poor') presentationStyle = styleRoll < 72 ? 'practical' : 'tidy';
  else if (wealthTier === 'plain') presentationStyle = styleRoll < 42 ? 'practical' : styleRoll < 90 ? 'tidy' : 'refined';
  else if (wealthTier === 'comfortable') presentationStyle = styleRoll < 20 ? 'practical' : styleRoll < 76 ? 'tidy' : 'refined';
  else presentationStyle = styleRoll < 42 ? 'tidy' : 'refined';

  household.wealthTier = wealthTier;
  household.presentationStyle = presentationStyle;
}

for (const household of snapshot.households) assignHouseholdAppearanceProfile(household);

function compatibilityWeight(item, faceFamily) {
  if (item.avoidFaceFamilies?.includes(faceFamily)) return 0;
  return item.preferredFaceFamilies?.includes(faceFamily) ? 1.35 : 1;
}

function silhouetteMultiplier(item, recentSilhouettes) {
  if (!item.silhouetteType || !recentSilhouettes?.length) return 1;
  const lastIndex = recentSilhouettes.lastIndexOf(item.silhouetteType);
  if (lastIndex < 0) return 1.2;
  const distance = recentSilhouettes.length - 1 - lastIndex;
  if (distance <= 1) return 0.12;
  if (distance <= 3) return 0.35;
  if (distance <= 7) return 0.62;
  return 0.82;
}

function weightedPick(seed, salt, items, faceFamily = null, recentSilhouettes = null) {
  if (!items.length) throw new Error(`No appearance candidates for ${salt}.`);
  const weightOf = (item) => {
    const base = Math.max(0, Number(item.weight ?? 1));
    const compatibility = faceFamily ? compatibilityWeight(item, faceFamily) : 1;
    return base * compatibility * silhouetteMultiplier(item, recentSilhouettes);
  };
  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  if (total <= 0) throw new Error(`No compatible appearance candidates for ${salt}.`);
  let cursor = (hash32(`${seed}:appearance:${salt}`) / 4294967296) * total;
  for (const item of items) {
    const weight = weightOf(item);
    if (weight <= 0) continue;
    cursor -= weight;
    if (cursor <= 0) return item;
  }
  return [...items].reverse().find((item) => weightOf(item) > 0);
}

function matches(item, resident, household) {
  if (item.genders?.length && !item.genders.includes(resident.gender)) return false;
  if (item.lifeStages?.length && !item.lifeStages.includes(resident.lifeStage)) return false;
  if (item.wealthTiers?.length && !item.wealthTiers.includes(household.wealthTier)) return false;
  if (item.presentationStyles?.length && !item.presentationStyles.includes(household.presentationStyle)) return false;
  return true;
}

function choosePart(resident, household, slot, faceFamily = null, recentSilhouettes = null) {
  const candidates = appearanceCatalog.parts.filter((item) => item.slot === slot && matches(item, resident, household));
  return weightedPick(
    resident.seed,
    `part:${slot}:${household.wealthTier}:${household.presentationStyle}`,
    candidates,
    faceFamily,
    recentSilhouettes,
  ).id;
}

function choosePalette(resident, household, slot) {
  const candidates = appearanceCatalog.palettes.filter((item) => item.slot === slot && matches(item, resident, household));
  return weightedPick(resident.seed, `palette:${slot}:${household.wealthTier}:${household.presentationStyle}`, candidates).id;
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

for (const item of [...appearanceCatalog.parts, ...appearanceCatalog.palettes]) {
  for (const wealthTier of item.wealthTiers ?? []) {
    if (!validWealthTiers.has(wealthTier)) throw new Error(`${item.id}: invalid wealth tier ${wealthTier}.`);
  }
  for (const style of item.presentationStyles ?? []) {
    if (!validPresentationStyles.has(style)) throw new Error(`${item.id}: invalid presentation style ${style}.`);
  }
}

for (const part of appearanceCatalog.parts) {
  for (const family of [...(part.preferredFaceFamilies ?? []), ...(part.avoidFaceFamilies ?? [])]) {
    if (!validFaceFamilies.has(family)) throw new Error(`${part.id}: invalid face family ${family}.`);
  }
  if ((part.slot === 'hair' || part.slot === 'outfit') && (typeof part.silhouetteType !== 'string' || !part.silhouetteType.trim())) {
    throw new Error(`${part.id}: ${part.slot} requires silhouetteType.`);
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
    if (rig.topY < 15 || rig.chinY > 135 || rig.shoulderY > 135) throw new Error(`${part.id}: primary portrait anchors leave the 1:1 safe area.`);
  }
  if (part.slot === 'headwear' && !validHairVisibility.has(part.hairVisibility)) {
    throw new Error(`${part.id}: headwear requires hairVisibility.`);
  }
}

const recentHairSilhouettes = { male: [], female: [] };
const silhouetteWindow = 10;

for (const resident of snapshot.residents) {
  const household = householdById.get(resident.householdId);
  if (!household) throw new Error(`${resident.id}: missing household ${resident.householdId}.`);

  const faceId = choosePart(resident, household, 'face');
  const faceFamily = partById.get(faceId)?.faceFamily;
  if (!validFaceFamilies.has(faceFamily)) throw new Error(`${resident.id}: ${faceId} has no valid faceFamily.`);

  const recentForGender = recentHairSilhouettes[resident.gender] ?? [];
  const hairId = choosePart(resident, household, 'hair', faceFamily, recentForGender);
  const hairSilhouette = partById.get(hairId)?.silhouetteType;
  if (!hairSilhouette) throw new Error(`${resident.id}: ${hairId} has no silhouetteType.`);

  resident.appearance = {
    faceId,
    hairId,
    browId: choosePart(resident, household, 'brow', faceFamily),
    facialHairId: choosePart(resident, household, 'facial-hair', faceFamily),
    headwearId: choosePart(resident, household, 'headwear', faceFamily),
    outfitId: choosePart(resident, household, 'outfit', faceFamily),
    skinPaletteId: choosePalette(resident, household, 'skin'),
    hairPaletteId: choosePalette(resident, household, 'hair'),
    clothingPaletteId: choosePalette(resident, household, 'clothing'),
  };

  recentForGender.push(hairSilhouette);
  if (recentForGender.length > silhouetteWindow) recentForGender.shift();
  recentHairSilhouettes[resident.gender] = recentForGender;

  for (const id of [resident.appearance.faceId, resident.appearance.hairId, resident.appearance.browId, resident.appearance.facialHairId, resident.appearance.headwearId, resident.appearance.outfitId]) {
    if (!partById.has(id)) throw new Error(`${resident.id}: generated unknown appearance part ${id}.`);
  }
  for (const id of [resident.appearance.skinPaletteId, resident.appearance.hairPaletteId, resident.appearance.clothingPaletteId]) {
    if (!paletteById.has(id)) throw new Error(`${resident.id}: generated unknown appearance palette ${id}.`);
  }
  if (resident.gender === 'female' && !resident.appearance.facialHairId.endsWith('.none')) {
    throw new Error(`${resident.id}: female resident generated facial hair.`);
  }

  resident.portraitSeed = portraitSeedFromAppearance(resident.appearance);
}

snapshot.schema = 'wanhu.resident-snapshot.v3';
await writeFile(join(generatedDir, 'resident-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

const wealthSummary = Object.fromEntries([...validWealthTiers].map((tier) => [tier, snapshot.households.filter((item) => item.wealthTier === tier).length]));
console.log(`Compiled wealth-driven AppearanceDNA for ${snapshot.residents.length} residents across ${snapshot.households.length} households with silhouette-aware hair selection and hard pairing rejection. ${JSON.stringify(wealthSummary)}`);
