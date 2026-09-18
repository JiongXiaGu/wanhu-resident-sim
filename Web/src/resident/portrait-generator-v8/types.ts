import type { Gender, LifeStageId, PresentationStyle, WealthTier } from '../../domain/resident';

export const PORTRAIT_GENERATOR_VERSION = 8 as const;
export const PORTRAIT_RENDER_CONTRACT_VERSION = '8.4' as const;
export type PortraitGeneratorVersion = typeof PORTRAIT_GENERATOR_VERSION;
export type PortraitLod = 48 | 64 | 96;
export type PortraitAgeGroup = 'child' | 'youth' | 'adult' | 'elder';

export type SemanticAppearanceContext = {
  residentStableId: string;
  residentSeed: number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier: WealthTier;
  presentationStyle: PresentationStyle;
};

export type AppearanceIdentityDNA = {
  identitySchemaVersion: 3;
  residentStableId: string;
  identitySeed: number;
  faceFamilyId: string;
  skinPaletteId: string;
  baseHairColorId: string;
};

export type AppearancePresentationDNA = {
  presentationSchemaVersion: 2;
  presentationSeed: number;
  lifeStage: LifeStageId;
  hairStyleId: string;
  outfitStyleId: string;
  hairColorStateId: string;
};

export type ResolvedAppearanceDNA = {
  generatorVersion: PortraitGeneratorVersion;
  identity: AppearanceIdentityDNA;
  presentation: AppearancePresentationDNA;
};

export type PortraitAppearanceOverride = {
  hairStyleId?: string;
  outfitStyleId?: string;
};

export type PaletteToken =
  | 'background'
  | 'skin'
  | 'hair'
  | 'hair-accent'
  | 'collar'
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
  | 'front-hair';

export type VectorLayerAsset = {
  id: string;
  slot: PortraitLayerSlot;
  z: number;
  shapes: VectorShape[];
};

export type FaceFamilyDefinition = {
  id: string;
  label: string;
  faceLayerByAge: Record<PortraitAgeGroup, string>;
};

export type HairStyleDefinition = {
  id: string;
  label: string;
  lifeStages: LifeStageId[];
  backLayerId: string;
  frontLayerId: string;
  baseWeight: number;
};

export type PortraitViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PortraitStageProfile = {
  id: string;
  lifeStages: LifeStageId[];
  ageGroup: PortraitAgeGroup;
  viewBox: PortraitViewBox;
  layerAssetIds: string[];
  featureLayerId: string;
  backgroundColor: string;
  collarColor: string;
  clothByWealth: Record<WealthTier, string>;
};

export type OutfitStyleDefinition = {
  id: string;
  label: string;
  wealthTiers: WealthTier[];
  layerAssetIds: string[];
  baseWeight: number;
};

export type RenderLayer = {
  assetId: string;
  slot: PortraitLayerSlot;
  z: number;
  shapes: VectorShape[];
};

export type PortraitRenderPlan = {
  generatorVersion: PortraitGeneratorVersion;
  renderContractVersion: typeof PORTRAIT_RENDER_CONTRACT_VERSION;
  residentStableId: string;
  lod: PortraitLod;
  stageProfileId: string;
  faceFamilyId: string;
  viewBox: PortraitViewBox;
  dna: ResolvedAppearanceDNA;
  palette: Record<Exclude<PaletteToken, 'none'>, string>;
  layers: RenderLayer[];
};
