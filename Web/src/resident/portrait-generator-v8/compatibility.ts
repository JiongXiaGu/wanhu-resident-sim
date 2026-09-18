import type {
  AccessoryAsset,
  AppearanceIdentityDNA,
  CompatibilityResult,
  HairStyleBundle,
  HeadProfileDefinition,
  OutfitBundle,
  SemanticAppearanceContext,
} from './types';

function result(reasons: string[], weightMultiplier = 1): CompatibilityResult {
  return { allowed: reasons.length === 0, reasons, weightMultiplier: reasons.length === 0 ? weightMultiplier : 0 };
}

export function checkHairCompatibility(
  bundle: HairStyleBundle,
  identity: AppearanceIdentityDNA,
  headProfile: HeadProfileDefinition,
  context: SemanticAppearanceContext,
) {
  const reasons: string[] = [];
  if (!bundle.genders.includes(context.gender)) reasons.push('gender');
  if (!bundle.lifeStages.includes(context.lifeStage)) reasons.push('life-stage');
  if (!bundle.compatibleFaceFamilies.includes(identity.faceFamilyId)) reasons.push('face-family');
  if (!bundle.compatibleHeadProfiles.includes(headProfile.id)) reasons.push('head-profile');
  return result(reasons);
}

export function checkOutfitCompatibility(bundle: OutfitBundle, context: SemanticAppearanceContext) {
  const reasons: string[] = [];
  if (!bundle.wealthTiers.includes(context.wealthTier)) reasons.push('wealth');
  if (!bundle.presentationStyles.includes(context.presentationStyle)) reasons.push('presentation');
  return result(reasons);
}

export function checkAccessoryCompatibility(
  accessory: AccessoryAsset,
  hairBundleId: string,
  context: SemanticAppearanceContext,
) {
  const reasons: string[] = [];
  if (!accessory.genders.includes(context.gender)) reasons.push('gender');
  if (!accessory.lifeStages.includes(context.lifeStage)) reasons.push('life-stage');
  if (!accessory.wealthTiers.includes(context.wealthTier)) reasons.push('wealth');
  if (!accessory.compatibleHairBundles.includes(hairBundleId)) reasons.push('hair-bundle');
  return result(reasons);
}
