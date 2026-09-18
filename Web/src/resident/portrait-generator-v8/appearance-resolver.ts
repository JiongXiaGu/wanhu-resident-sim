import type { LifeStageId } from '../../domain/resident';
import {
  ACCESSORIES,
  FACE_FAMILY_ID,
  HAIR_BUNDLES,
  HEAD_PROFILES,
  OUTFIT_BUNDLES,
} from './catalog';
import {
  checkAccessoryCompatibility,
  checkHairCompatibility,
  checkOutfitCompatibility,
} from './compatibility';
import { PopulationDiversityController } from './population-diversity';
import { createIdentitySeedBank, createPresentationSeedBank } from './seed-bank';
import {
  PORTRAIT_GENERATOR_VERSION,
  type AppearanceIdentityDNA,
  type AppearancePresentationDNA,
  type HeadProfileDefinition,
  type ResolvedAppearanceDNA,
  type SemanticAppearanceContext,
} from './types';

const skinPaletteIds = [
  'skin.warm-light',
  'skin.warm-medium',
  'skin.warm-deep',
  'skin.brown-deep',
] as const;

const hairPaletteIds = [
  'hair.black',
  'hair.dark-brown-black',
  'hair.soft-black',
] as const;

function weightedPick<T>(
  items: T[],
  unit: number,
  weightOf: (item: T) => number,
): T {
  if (!items.length) throw new Error('V8 weightedPick requires candidates.');
  const total = items.reduce((sum, item) => sum + Math.max(0, weightOf(item)), 0);
  if (total <= 0) throw new Error('V8 weightedPick has zero total weight.');
  let cursor = unit * total;
  for (const item of items) {
    cursor -= Math.max(0, weightOf(item));
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

export function resolveIdentity(context: SemanticAppearanceContext): AppearanceIdentityDNA {
  if (context.gender !== 'female') {
    throw new Error('Portrait Generator V8 migration slice currently contains female formal assets only.');
  }
  const seeds = createIdentitySeedBank(context.residentSeed);
  return {
    identitySchemaVersion: 1,
    residentStableId: context.residentStableId,
    identitySeed: seeds.base,
    faceFamilyId: FACE_FAMILY_ID,
    featureSetId: 'feature-set.female.soft-a',
    skinPaletteId: skinPaletteIds[seeds.pickIndex('skin', skinPaletteIds.length)],
    baseHairColorId: hairPaletteIds[seeds.pickIndex('hair-color', hairPaletteIds.length)],
    bodyFrameId: seeds.unit('body-frame') < .42 ? 'body-frame.female.slight' : 'body-frame.female.regular',
    distinguishingTraitIds: seeds.unit('trait') < .18 ? ['trait.soft-cheek-line'] : [],
  };
}

export function resolveHeadProfile(
  identity: AppearanceIdentityDNA,
  context: SemanticAppearanceContext,
): HeadProfileDefinition {
  const profile = HEAD_PROFILES.find((item) =>
    item.faceFamilyId === identity.faceFamilyId
    && item.gender === context.gender
    && item.lifeStages.includes(context.lifeStage)
  );
  if (!profile) {
    throw new Error('No V8 HeadProfile for '+identity.faceFamilyId+' / '+context.lifeStage);
  }
  return profile;
}

function ageOverlayFor(stage: LifeStageId) {
  if (stage === 'elder') return 'age.elder-lines';
  if (stage === 'middle-age') return 'age.middle-soft';
  return 'age.none';
}

function hairColorStateFor(stage: LifeStageId, identity: AppearanceIdentityDNA) {
  if (stage === 'elder') return 'hair-state.gray';
  if (stage === 'middle-age') return 'hair-state.salt-pepper';
  return identity.baseHairColorId;
}

export function resolvePresentation(
  context: SemanticAppearanceContext,
  identity: AppearanceIdentityDNA,
  diversity?: PopulationDiversityController,
): AppearancePresentationDNA {
  const seeds = createPresentationSeedBank(context.residentSeed);
  const headProfile = resolveHeadProfile(identity, context);

  const hairCandidates = HAIR_BUNDLES
    .map((bundle) => ({ bundle, compatibility: checkHairCompatibility(bundle, identity, headProfile, context) }))
    .filter((entry) => entry.compatibility.allowed);

  const hair = weightedPick(
    hairCandidates,
    seeds.unit('hair', context.lifeStage),
    (entry) => entry.bundle.baseWeight
      * entry.compatibility.weightMultiplier
      * (diversity?.multiplier(entry.bundle) ?? 1),
  ).bundle;

  diversity?.commit(hair.id);

  const outfitCandidates = OUTFIT_BUNDLES
    .map((bundle) => ({ bundle, compatibility: checkOutfitCompatibility(bundle, context) }))
    .filter((entry) => entry.compatibility.allowed);

  const outfit = weightedPick(
    outfitCandidates,
    seeds.unit('outfit', context.wealthTier+':'+context.presentationStyle),
    (entry) => entry.bundle.baseWeight * entry.compatibility.weightMultiplier,
  ).bundle;

  const accessoryCandidates = ACCESSORIES
    .map((accessory) => ({ accessory, compatibility: checkAccessoryCompatibility(accessory, hair.id, context) }))
    .filter((entry) => entry.compatibility.allowed);

  const accessory = weightedPick(
    accessoryCandidates,
    seeds.unit('accessory', hair.id+':'+context.wealthTier),
    (entry) => entry.accessory.baseWeight * entry.compatibility.weightMultiplier,
  ).accessory;

  return {
    presentationSchemaVersion: 1,
    presentationSeed: seeds.base,
    lifeStage: context.lifeStage,
    wealthTier: context.wealthTier,
    presentationStyle: context.presentationStyle,
    hairBundleId: hair.id,
    outfitBundleId: outfit.id,
    accessoryAssetId: accessory.id,
    ageOverlayId: ageOverlayFor(context.lifeStage),
    hairColorStateId: hairColorStateFor(context.lifeStage, identity),
  };
}

export function resolveAppearance(
  context: SemanticAppearanceContext,
  diversity?: PopulationDiversityController,
): ResolvedAppearanceDNA {
  const identity = resolveIdentity(context);
  return {
    generatorVersion: PORTRAIT_GENERATOR_VERSION,
    identity,
    presentation: resolvePresentation(context, identity, diversity),
  };
}

export function assertV8IdentityInvariant(
  base: SemanticAppearanceContext,
  variants: SemanticAppearanceContext[],
) {
  const reference = resolveIdentity(base);
  const fingerprint = JSON.stringify(reference);
  for (const variant of variants) {
    if (JSON.stringify(resolveIdentity(variant)) !== fingerprint) {
      throw new Error('V8 identity changed after presentation context changed: '+variant.residentStableId);
    }
  }
  return true;
}
