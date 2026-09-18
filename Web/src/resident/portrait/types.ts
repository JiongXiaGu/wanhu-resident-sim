import type { Gender, LifeStageId, WealthTier } from '../../domain/resident';

export const PORTRAIT_GENERATOR_VERSION = 9 as const;
export const PORTRAIT_RENDER_CONTRACT_VERSION = '9.0' as const;
export type PortraitGeneratorVersion = typeof PORTRAIT_GENERATOR_VERSION;
export type PortraitLod = 48 | 64 | 96;
export type PortraitAgeBand = 'child' | 'adult' | 'elder';
export type PortraitFrameId = `${Gender}.${PortraitAgeBand}`;

export type SemanticAppearanceContext = {
  residentStableId: string;
  residentSeed: number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier: WealthTier;
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
  | 'age';

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
  genders: Gender[];
  faceLayerByAge: Record<PortraitAgeBand, string>;
};

export type HairStyleDefinition = {
  id: string;
  label: string;
  genders: Gender[];
  frameIds: PortraitFrameId[];
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

export type PortraitFrameDefinition = {
  id: PortraitFrameId;
  gender: Gender;
  ageBand: PortraitAgeBand;
  viewBox: PortraitViewBox;
  neckLayerId: string;
  backgroundColor: string;
  collarColor: string;
  clothByWealth: Record<WealthTier, string>;
};

export type OutfitStyleDefinition = {
  id: string;
  label: string;
  frameIds: PortraitFrameId[];
  initialWealthTiers: WealthTier[];
  layerAssetIdsByFrame: Partial<Record<PortraitFrameId, string[]>>;
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
  frameId: PortraitFrameId;
  faceFamilyId: string;
  viewBox: PortraitViewBox;
  dna: ResolvedAppearanceDNA;
  palette: Record<PaletteToken, string>;
  layers: RenderLayer[];
};
