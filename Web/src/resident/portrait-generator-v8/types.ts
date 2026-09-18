import type { Gender, LifeStageId, PresentationStyle, WealthTier } from '../../domain/resident';

export const PORTRAIT_GENERATOR_VERSION = 8 as const;
export type PortraitGeneratorVersion = typeof PORTRAIT_GENERATOR_VERSION;
export type PortraitLod = 48 | 64 | 96;

export type SemanticAppearanceContext = {
  residentStableId: string;
  residentSeed: number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier: WealthTier;
  presentationStyle: PresentationStyle;
};

export type AppearanceIdentityDNA = {
  identitySchemaVersion: 1;
  residentStableId: string;
  identitySeed: number;
  faceFamilyId: string;
  featureSetId: string;
  skinPaletteId: string;
  baseHairColorId: string;
  bodyFrameId: string;
  distinguishingTraitIds: string[];
};

export type AppearancePresentationDNA = {
  presentationSchemaVersion: 1;
  presentationSeed: number;
  lifeStage: LifeStageId;
  wealthTier: WealthTier;
  presentationStyle: PresentationStyle;
  hairBundleId: string;
  outfitBundleId: string;
  accessoryAssetId: string;
  ageOverlayId: string;
  hairColorStateId: string;
};

export type ResolvedAppearanceDNA = {
  generatorVersion: PortraitGeneratorVersion;
  identity: AppearanceIdentityDNA;
  presentation: AppearancePresentationDNA;
};

export type Vec2 = { x: number; y: number };

export type HeadProfileDefinition = {
  id: string;
  faceFamilyId: string;
  gender: Gender;
  lifeStages: LifeStageId[];
  width: number;
  topY: number;
  chinY: number;
  jawWidth: number;
  anchors: {
    skullTop: Vec2;
    templeLeft: Vec2;
    templeRight: Vec2;
    earLeft: Vec2;
    earRight: Vec2;
    jawLeft: Vec2;
    jawRight: Vec2;
    chin: Vec2;
    neckLeft: Vec2;
    neckRight: Vec2;
    crownBack: Vec2;
    bunLow: Vec2;
    occipitalLeft: Vec2;
    occipitalRight: Vec2;
    nape: Vec2;
    shoulderBackLeft: Vec2;
    shoulderBackRight: Vec2;
  };
  masks: {
    skull: string;
    faceKeepout: string;
    behindHead: string;
    earFrontLeft: string;
    earFrontRight: string;
  };
};

export type PaletteToken =
  | 'background'
  | 'skin'
  | 'hair'
  | 'cloth'
  | 'accent'
  | 'ink'
  | 'age'
  | 'none';

export type VectorShape =
  | { kind: 'path'; d: string; fill?: PaletteToken; stroke?: PaletteToken; strokeWidth?: number; opacity?: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: PaletteToken; stroke?: PaletteToken; strokeWidth?: number; opacity?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill?: PaletteToken; stroke?: PaletteToken; strokeWidth?: number; opacity?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: PaletteToken; strokeWidth?: number; opacity?: number };

export type PortraitLayerSlot =
  | 'back-hair'
  | 'outfit'
  | 'neck'
  | 'face'
  | 'face-detail'
  | 'side-hair'
  | 'front-hair'
  | 'accessory'
  | 'age-overlay';

export type VectorLayerAsset = {
  id: string;
  slot: PortraitLayerSlot;
  z: number;
  lods: PortraitLod[];
  shapes: VectorShape[];
};

export type PlacementTransform = {
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
};

export type HairStyleBundle = {
  id: string;
  label: string;
  cultureTag: 'chinese-ancient';
  genders: Gender[];
  lifeStages: LifeStageId[];
  compatibleFaceFamilies: string[];
  compatibleHeadProfiles: string[];
  silhouetteType: string;
  baseWeight: number;
  targetShare: number;
  layerAssetIds: string[];
  placementByHeadProfile: Record<string, PlacementTransform>;
  accessorySlots: string[];
};

export type OutfitBundle = {
  id: string;
  label: string;
  wealthTiers: WealthTier[];
  presentationStyles: PresentationStyle[];
  layerAssetIds: string[];
  baseWeight: number;
};

export type AccessoryAsset = {
  id: string;
  label: string;
  genders: Gender[];
  lifeStages: LifeStageId[];
  wealthTiers: WealthTier[];
  compatibleHairBundles: string[];
  layerAssetId?: string;
  baseWeight: number;
};

export type CompatibilityResult = {
  allowed: boolean;
  reasons: string[];
  weightMultiplier: number;
};

export type RenderLayer = {
  assetId: string;
  slot: PortraitLayerSlot;
  z: number;
  transform: Required<PlacementTransform>;
  shapes: VectorShape[];
};

export type PortraitRenderPlan = {
  generatorVersion: PortraitGeneratorVersion;
  residentStableId: string;
  lod: PortraitLod;
  headProfileId: string;
  dna: ResolvedAppearanceDNA;
  palette: Record<Exclude<PaletteToken, 'none'>, string>;
  masks: HeadProfileDefinition['masks'];
  layers: RenderLayer[];
};

export type PopulationDiversitySnapshot = {
  totalResolved: number;
  countsByHairBundle: Record<string, number>;
  recentHairBundles: string[];
};
