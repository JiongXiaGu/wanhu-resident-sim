import type {
  AppearanceCatalogDefinition,
  AppearancePartDefinition,
  Gender,
  LifeStageId,
  ResidentAppearanceDNA,
} from '../domain/resident';

export type PortraitFaceFamily = 'oval' | 'round' | 'long' | 'square' | 'broad';
export type PortraitHairVisibility = 'full' | 'back-only' | 'hidden';
export type PortraitLayer = 'hair' | 'back-hair' | 'front-hair' | 'brow' | 'facial-hair' | 'headwear' | 'outfit' | 'age-overlay';

export const PORTRAIT_MASTER = {
  width: 120,
  height: 150,
  safeX: 0,
  safeY: 15,
  safeWidth: 120,
  safeHeight: 120,
  sourceWidth: 1024,
  sourceHeight: 1280,
  sourceSafeY: 128,
  sourceSafeSize: 1024,
} as const;

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
  silhouetteType?: string;
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
  'appearance.face.male-oval-01': 'oval',
  'appearance.face.male-oval-02': 'oval',
  'appearance.face.male-round-01': 'round',
  'appearance.face.male-long-01': 'long',
  'appearance.face.male-square-01': 'square',
  'appearance.face.male-broad-01': 'broad',
  'appearance.face.female-oval-01': 'oval',
  'appearance.face.female-oval-02': 'oval',
  'appearance.face.female-round-01': 'round',
  'appearance.face.female-long-01': 'long',
  'appearance.face.female-mature-01': 'oval',
  'appearance.face.female-youth-01': 'round',
  'appearance.face.female-youth-02': 'oval',
  'appearance.face.female-adult-01': 'oval',
  'appearance.face.female-adult-02': 'long',
  'appearance.face.female-mature-02': 'broad',
  'appearance.face.female-elder-01': 'oval',
};

function partFor(catalog: AppearanceCatalogDefinition | undefined, id: string) {
  return catalog?.parts.find((item) => item.id === id) as RiggedPart | undefined;
}

export function faceFamilyForId(catalog: AppearanceCatalogDefinition | undefined, faceId: string): PortraitFaceFamily {
  return partFor(catalog, faceId)?.faceFamily ?? FALLBACK_FACE_FAMILIES[faceId] ?? 'oval';
}

export function portraitRigForFace(catalog: AppearanceCatalogDefinition | undefined, faceId: string): PortraitRig {
  return partFor(catalog, faceId)?.rig ?? DEFAULT_RIG;
}

export function compatibilityMultiplier(part: AppearancePartDefinition, faceFamily: PortraitFaceFamily) {
  const rigged = part as RiggedPart;
  if (rigged.avoidFaceFamilies?.includes(faceFamily)) return 0;
  return rigged.preferredFaceFamilies?.includes(faceFamily) ? 1.35 : 1;
}

export function silhouetteTypeForId(
  catalog: AppearanceCatalogDefinition | undefined,
  partId: string,
  fallback = 'default',
) {
  return partFor(catalog, partId)?.silhouetteType ?? fallback;
}

export function hairVisibilityForHeadwear(
  catalog: AppearanceCatalogDefinition | undefined,
  headwearId: string,
): PortraitHairVisibility {
  const configured = partFor(catalog, headwearId)?.hairVisibility;
  if (configured) return configured;
  if (headwearId.endsWith('.none') || headwearId.includes('sun-hat') || headwearId.includes('hairpin') || headwearId.includes('hair-ribbon')) return 'full';
  return 'back-only';
}

function validateRig(rig: PortraitRig) {
  const errors: string[] = [];
  if (!(rig.topY < rig.hairlineY && rig.hairlineY < rig.browY && rig.browY < rig.eyeY)) errors.push('额头 / 眉眼锚点顺序异常');
  if (!(rig.eyeY < rig.noseY && rig.noseY < rig.mouthY && rig.mouthY < rig.chinY)) errors.push('五官纵向锚点顺序异常');
  if (!(rig.chinY <= rig.shoulderY && rig.neckTopY < rig.shoulderY)) errors.push('下巴 / 脖颈 / 肩线顺序异常');
  if (rig.faceWidth <= 0 || rig.jawWidth <= 0 || rig.jawWidth > rig.faceWidth) errors.push('脸宽 / 下颌宽参数异常');

  const faceLeft = rig.centerX - rig.faceWidth / 2;
  const faceRight = rig.centerX + rig.faceWidth / 2;
  if (faceLeft < 16 || faceRight > 104) errors.push('脸部超出 1:1 安全区的主构图范围');
  if (rig.topY < PORTRAIT_MASTER.safeY || rig.chinY > PORTRAIT_MASTER.safeY + PORTRAIT_MASTER.safeHeight) errors.push('脸部超出 1:1 Safe Area');
  if (rig.shoulderY > PORTRAIT_MASTER.safeY + PORTRAIT_MASTER.safeHeight) errors.push('主要肩线超出 1:1 Safe Area');
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

  const hair = partFor(catalog, appearance.hairId);
  const outfit = partFor(catalog, appearance.outfitId);
  if (hair && !hair.silhouetteType) warnings.push(`${hair.label} 未声明 silhouetteType`);
  if (outfit && !outfit.silhouetteType) warnings.push(`${outfit.label} 未声明 silhouetteType`);

  const headwear = partFor(catalog, appearance.headwearId);
  if (headwear && headwear.slot === 'headwear' && !headwear.hairVisibility) warnings.push(`${headwear.label} 未声明头发遮挡规则`);
  if (facialHair?.genders?.length && !facialHair.genders.includes(gender)) errors.push(`${facialHair.label} 不适用于当前性别`);
  if (facialHair?.lifeStages?.length && !facialHair.lifeStages.includes(lifeStage)) errors.push(`${facialHair.label} 不适用于当前年龄阶段`);

  return { errors, warnings };
}
