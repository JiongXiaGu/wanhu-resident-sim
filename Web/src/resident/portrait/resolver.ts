import type { LifeStageId, ResidentPortraitDNA } from '../../domain/resident';
import { FACE_FAMILIES, HAIR_STYLES, OUTFIT_STYLES } from './catalog';
import { createIdentitySeedBank, createPresentationSeedBank } from './seed';
import {
  PORTRAIT_GENERATOR_VERSION,
  type AppearanceIdentityDNA,
  type AppearancePresentationDNA,
  type PortraitAppearanceOverride,
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

function weightedPick<T>(items: T[], unit: number, weightOf: (item:T)=>number): T {
  if (!items.length) throw new Error('V8.4 weightedPick requires candidates.');
  const total = items.reduce((sum,item)=>sum+Math.max(0,weightOf(item)),0);
  let cursor = unit * total;
  for (const item of items) {
    cursor -= Math.max(0,weightOf(item));
    if (cursor <= 0) return item;
  }
  return items[items.length-1];
}

export function resolveIdentity(context: SemanticAppearanceContext): AppearanceIdentityDNA {
  const seeds = createIdentitySeedBank(context.residentSeed);
  const faceCandidates = FACE_FAMILIES.filter((family)=>family.genders.includes(context.gender));
  if (!faceCandidates.length) throw new Error('No FaceFamily art for gender '+context.gender+'.');
  return {
    identitySchemaVersion: 3,
    residentStableId: context.residentStableId,
    identitySeed: seeds.base,
    faceFamilyId: faceCandidates[seeds.pickIndex('face-family', faceCandidates.length)].id,
    skinPaletteId: skinPaletteIds[seeds.pickIndex('skin', skinPaletteIds.length)],
    baseHairColorId: hairPaletteIds[seeds.pickIndex('hair-color', hairPaletteIds.length)],
  };
}

function hairColorStateFor(stage: LifeStageId, identity: AppearanceIdentityDNA) {
  if (stage === 'elder') return 'hair-state.gray';
  if (stage === 'middle-age') return 'hair-state.salt-pepper';
  return identity.baseHairColorId;
}

export function resolvePresentation(
  context: SemanticAppearanceContext,
  identity: AppearanceIdentityDNA,
  override: PortraitAppearanceOverride = {},
): AppearancePresentationDNA {
  const seeds = createPresentationSeedBank(context.residentSeed);

  const ageCompatibleHair = HAIR_STYLES.filter((style)=>style.genders.includes(context.gender)&&style.lifeStages.includes(context.lifeStage));
  const requestedHair = override.hairStyleId
    ? ageCompatibleHair.find((style)=>style.id===override.hairStyleId)
    : undefined;
  const hair = requestedHair ?? weightedPick(
    ageCompatibleHair,
    seeds.unit('hair', context.lifeStage),
    (style)=>style.baseWeight,
  );

  const requestedOutfit = override.outfitStyleId
    ? OUTFIT_STYLES.find((style)=>style.id===override.outfitStyleId)
    : undefined;
  const defaultOutfits = OUTFIT_STYLES.filter((style)=>style.wealthTiers.includes(context.wealthTier));
  const outfit = requestedOutfit ?? weightedPick(
    defaultOutfits,
    seeds.unit('outfit', context.wealthTier),
    (style)=>style.baseWeight,
  );

  return {
    presentationSchemaVersion: 2,
    presentationSeed: seeds.base,
    lifeStage: context.lifeStage,
    hairStyleId: hair.id,
    outfitStyleId: outfit.id,
    hairColorStateId: hairColorStateFor(context.lifeStage, identity),
  };
}


export function resolveSavedPortrait(
  context: SemanticAppearanceContext,
  portrait: ResidentPortraitDNA,
): ResolvedAppearanceDNA {
  const identitySeeds=createIdentitySeedBank(context.residentSeed);
  const presentationSeeds=createPresentationSeedBank(context.residentSeed);
  return {
    generatorVersion:PORTRAIT_GENERATOR_VERSION,
    identity:{
      identitySchemaVersion:3,
      residentStableId:context.residentStableId,
      identitySeed:identitySeeds.base,
      faceFamilyId:portrait.faceFamilyId,
      skinPaletteId:portrait.skinPaletteId,
      baseHairColorId:portrait.baseHairColorId,
    },
    presentation:{
      presentationSchemaVersion:2,
      presentationSeed:presentationSeeds.base,
      lifeStage:context.lifeStage,
      hairStyleId:portrait.hairStyleId,
      outfitStyleId:portrait.outfitStyleId,
      hairColorStateId:hairColorStateFor(context.lifeStage,{
        identitySchemaVersion:3,
        residentStableId:context.residentStableId,
        identitySeed:identitySeeds.base,
        faceFamilyId:portrait.faceFamilyId,
        skinPaletteId:portrait.skinPaletteId,
        baseHairColorId:portrait.baseHairColorId,
      }),
    },
  };
}

export function resolveAppearance(
  context: SemanticAppearanceContext,
  override: PortraitAppearanceOverride = {},
): ResolvedAppearanceDNA {
  const identity = resolveIdentity(context);
  return {
    generatorVersion: PORTRAIT_GENERATOR_VERSION,
    identity,
    presentation: resolvePresentation(context, identity, override),
  };
}

export function assertPortraitIdentityInvariant(
  base: SemanticAppearanceContext,
  variants: SemanticAppearanceContext[],
) {
  const reference = JSON.stringify(resolveIdentity(base));
  for (const variant of variants) {
    if (JSON.stringify(resolveIdentity(variant)) !== reference) {
      throw new Error('V8.4 identity changed after context changed: '+variant.residentStableId);
    }
  }
  return true;
}
