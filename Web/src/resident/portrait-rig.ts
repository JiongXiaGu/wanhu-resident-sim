import type {
  AppearanceCatalogDefinition,
  AppearancePartDefinition,
  Gender,
  LifeStageId,
  ResidentAppearanceDNA,
} from '../domain/resident';

export type PortraitFaceFamily = 'oval' | 'round' | 'long' | 'square' | 'broad';
export type PortraitHairVisibility = 'full' | 'back-only' | 'hidden';
export type PortraitLayer = 'hair' | 'brow' | 'facial-hair' | 'headwear' | 'outfit';

export type PortraitRig = {
  centerX: number;
  topY: number;
  hairlineY: number;
  browY: number;
  eyeY: number;
  noseY: number;
  mouthY: number;
  chinY: number;
  faceWidth: number;
  jawWidth: number;
  earY: number;
  neckTopY: number;
  shoulderY: number;
};

export type PortraitDiagnostics = {
  errors: string[];
  warnings: string[];
};

type RiggedPart = AppearancePartDefinition & {
  faceFamily?: PortraitFaceFamily;
  preferredFaceFamilies?: PortraitFaceFamily[];
  avoidFaceFamilies?: PortraitFaceFamily[];
  hairVisibility?: PortraitHairVisibility;
  rig?: PortraitRig;
};

const DEFAULT_RIG: PortraitRig = {
  centerX: 60,
  topY: 22,
  hairlineY: 36,
  browY: 46,
  eyeY: 53,
  noseY: 61,
  mouthY: 69,
  chinY: 84,
  faceWidth: 42,
  jawWidth: 27,
  earY: 54,
  neckTopY: 79,
  shoulderY: 87,
};

const FALLBACK_FACE_FAMILIES: Record<string, PortraitFaceFamily> = {
  'appearance.face.oval-01': 'oval',
  'appearance.face.oval-02': 'oval',
  'appearance.face.round-01': 'round',
  'appearance.face.round-02': 'round',
  'appearance.face.long-01': 'long',
  'appearance.face.long-02': 'long',
  'appearance.face.square-01': 'square',
  'appearance.face.broad-01': 'broad',
};

const FALLBACK_RIGS: Record<string, PortraitRig> = {
  'appearance.face.oval-01': DEFAULT_RIG,
  'appearance.face.oval-02': { ...DEFAULT_RIG, topY: 21, hairlineY: 35, browY: 45.5, eyeY: 52.5, noseY: 60.5, mouthY: 68.5, chinY: 85, faceWidth: 40, jawWidth: 25, earY: 53.5, neckTopY: 80, shoulderY: 88 },
  'appearance.face.round-01': { ...DEFAULT_RIG, topY: 24, hairlineY: 37, browY: 47, eyeY: 54, noseY: 61.5, mouthY: 68.5, chinY: 82, faceWidth: 44, jawWidth: 31, neckTopY: 77, shoulderY: 86 },
  'appearance.face.round-02': { ...DEFAULT_RIG, topY: 23, hairlineY: 36, browY: 46.5, eyeY: 53.5, mouthY: 69, chinY: 83, faceWidth: 46, jawWidth: 32, neckTopY: 78 },
  'appearance.face.long-01': { ...DEFAULT_RIG, topY: 20, hairlineY: 34, browY: 45, eyeY: 52, noseY: 61.5, mouthY: 71, chinY: 87, faceWidth: 40, jawWidth: 23, neckTopY: 82, shoulderY: 90 },
  'appearance.face.long-02': { ...DEFAULT_RIG, topY: 19, hairlineY: 33, browY: 44.5, eyeY: 52, noseY: 62, mouthY: 72, chinY: 89, faceWidth: 39, jawWidth: 22, earY: 55, neckTopY: 84, shoulderY: 92 },
  'appearance.face.square-01': { ...DEFAULT_RIG, topY: 23, hairlineY: 35, browY: 45.5, eyeY: 52.5, mouthY: 69.5, faceWidth: 43, jawWidth: 32, neckTopY: 79, shoulderY: 88 },
  'appearance.face.broad-01': { ...DEFAULT_RIG, topY: 24, hairlineY: 36.5, browY: 46.5, eyeY: 53.5, noseY: 61.5, chinY: 82, faceWidth: 48, jawWidth: 35, neckTopY: 77, shoulderY: 86 },
};

function partFor(catalog: AppearanceCatalogDefinition | undefined, id: string) {
  return catalog?.parts.find((item) => item.id === id) as RiggedPart | undefined;
}

export function faceFamilyForId(catalog: AppearanceCatalogDefinition | undefined, faceId: string): PortraitFaceFamily {
  return partFor(catalog, faceId)?.faceFamily ?? FALLBACK_FACE_FAMILIES[faceId] ?? 'oval';
}

export function portraitRigForFace(catalog: AppearanceCatalogDefinition | undefined, faceId: string): PortraitRig {
  return partFor(catalog, faceId)?.rig ?? FALLBACK_RIGS[faceId] ?? DEFAULT_RIG;
}

export function compatibilityMultiplier(part: AppearancePartDefinition, faceFamily: PortraitFaceFamily) {
  const rigged = part as RiggedPart;
  let multiplier = 1;
  if (rigged.preferredFaceFamilies?.includes(faceFamily)) multiplier *= 1.35;
  if (rigged.avoidFaceFamilies?.includes(faceFamily)) multiplier *= 0.3;
  return multiplier;
}

export function hairVisibilityForHeadwear(
  catalog: AppearanceCatalogDefinition | undefined,
  headwearId: string,
): PortraitHairVisibility {
  const configured = partFor(catalog, headwearId)?.hairVisibility;
  if (configured) return configured;
  if (headwearId.endsWith('.none') || headwearId.includes('sun-hat')) return 'full';
  return 'back-only';
}

function validateRig(rig: PortraitRig) {
  const errors: string[] = [];
  if (!(rig.topY < rig.hairlineY && rig.hairlineY < rig.browY && rig.browY < rig.eyeY)) errors.push('额头 / 眉眼锚点顺序异常');
  if (!(rig.eyeY < rig.noseY && rig.noseY < rig.mouthY && rig.mouthY < rig.chinY)) errors.push('五官纵向锚点顺序异常');
  if (!(rig.chinY <= rig.shoulderY && rig.neckTopY < rig.shoulderY)) errors.push('下巴 / 脖颈 / 肩线顺序异常');
  if (rig.faceWidth <= 0 || rig.jawWidth <= 0 || rig.jawWidth > rig.faceWidth) errors.push('脸宽 / 下颌宽参数异常');
  if (rig.centerX - rig.faceWidth / 2 < 22 || rig.centerX + rig.faceWidth / 2 > 98) errors.push('脸部超出头像安全区');
  return errors;
}

export function portraitDiagnostics(
  appearance: ResidentAppearanceDNA,
  catalog: AppearanceCatalogDefinition | undefined,
  gender: Gender,
  lifeStage: LifeStageId,
): PortraitDiagnostics {
  const errors = validateRig(portraitRigForFace(catalog, appearance.faceId));
  const warnings: string[] = [];
  const faceFamily = faceFamilyForId(catalog, appearance.faceId);

  const facialHair = partFor(catalog, appearance.facialHairId);
  if (!appearance.facialHairId.endsWith('.none')) {
    if (gender === 'female') errors.push('女性居民出现胡须');
    if (lifeStage === 'child' || lifeStage === 'teen') errors.push('未成年居民出现胡须');
  }

  for (const id of [appearance.hairId, appearance.browId, appearance.facialHairId, appearance.headwearId]) {
    const part = partFor(catalog, id);
    if (part?.avoidFaceFamilies?.includes(faceFamily)) warnings.push(`${part.label} 与${faceFamily}脸型兼容度较低`);
  }

  const headwear = partFor(catalog, appearance.headwearId);
  if (headwear && headwear.slot === 'headwear' && !headwear.hairVisibility) warnings.push(`${headwear.label} 未声明头发遮挡规则`);
  if (facialHair?.genders?.length && !facialHair.genders.includes(gender)) errors.push(`${facialHair.label} 不适用于当前性别`);
  if (facialHair?.lifeStages?.length && !facialHair.lifeStages.includes(lifeStage)) errors.push(`${facialHair.label} 不适用于当前年龄阶段`);

  return { errors, warnings };
}
