import {
  ACCESSORIES,
  AGE_LAYER_BY_ID,
  FACE_LAYER_BY_HEAD_PROFILE,
  FEATURE_LAYER_BY_SET,
  HAIR_BUNDLES,
  OUTFIT_BUNDLES,
  layerById,
} from './catalog';
import { resolveHeadProfile } from './appearance-resolver';
import type {
  PaletteToken,
  PortraitLod,
  PortraitRenderPlan,
  ResolvedAppearanceDNA,
  SemanticAppearanceContext,
} from './types';

const skinColors: Record<string,string> = {
  'skin.warm-light':'#d3a07d',
  'skin.warm-medium':'#c68b69',
  'skin.warm-deep':'#b5795b',
  'skin.brown-deep':'#9f684f',
};

const hairColors: Record<string,string> = {
  'hair.black':'#29231f',
  'hair.dark-brown-black':'#352b25',
  'hair.soft-black':'#40352f',
  'hair-state.salt-pepper':'#625b54',
  'hair-state.gray':'#948d84',
};

const clothByWealth = {
  poor:'#76624f',
  plain:'#63717a',
  comfortable:'#4f6358',
  wealthy:'#6b5052',
};

const backgroundByStage: Record<string,string> = {
  child:'#d0b77f',
  teen:'#cfb47a',
  'young-adult':'#c8aa70',
  adult:'#ccb074',
  'middle-age':'#c6a56b',
  elder:'#cbb27c',
};

function completeTransform(input: {translateX?:number;translateY?:number;scaleX?:number;scaleY?:number} = {}) {
  return {
    translateX: input.translateX ?? 0,
    translateY: input.translateY ?? 0,
    scaleX: input.scaleX ?? 1,
    scaleY: input.scaleY ?? 1,
  };
}

export function buildRenderPlan(
  dna: ResolvedAppearanceDNA,
  context: SemanticAppearanceContext,
  lod: PortraitLod,
): PortraitRenderPlan {
  const headProfile = resolveHeadProfile(dna.identity, context);
  const hair = HAIR_BUNDLES.find((item)=>item.id===dna.presentation.hairBundleId);
  const outfit = OUTFIT_BUNDLES.find((item)=>item.id===dna.presentation.outfitBundleId);
  const accessory = ACCESSORIES.find((item)=>item.id===dna.presentation.accessoryAssetId);
  if (!hair || !outfit || !accessory) throw new Error('V8 RenderPlan references missing asset bundle.');

  const layerIds = [
    ...hair.layerAssetIds,
    ...outfit.layerAssetIds,
    FACE_LAYER_BY_HEAD_PROFILE[headProfile.id],
    ...(FEATURE_LAYER_BY_SET[dna.identity.featureSetId] ?? []),
    ...(AGE_LAYER_BY_ID[dna.presentation.ageOverlayId] ?? []),
    ...(accessory.layerAssetId ? [accessory.layerAssetId] : []),
  ].filter(Boolean);

  const hairPlacement = completeTransform(hair.placementByHeadProfile[headProfile.id]);
  const layers = layerIds
    .map((assetId)=>{
      const layer = layerById(assetId);
      const transform = hair.layerAssetIds.includes(assetId)
        ? hairPlacement
        : completeTransform();
      return {
        assetId,
        slot: layer.slot,
        z: layer.z,
        transform,
        shapes: layer.lods.includes(lod) ? layer.shapes : [],
      };
    })
    .filter((layer)=>layer.shapes.length > 0)
    .sort((a,b)=>a.z-b.z);

  const palette: Record<Exclude<PaletteToken,'none'>,string> = {
    background: backgroundByStage[context.lifeStage] ?? '#c8aa70',
    skin: skinColors[dna.identity.skinPaletteId] ?? '#c68b69',
    hair: hairColors[dna.presentation.hairColorStateId] ?? hairColors[dna.identity.baseHairColorId] ?? '#29231f',
    cloth: clothByWealth[context.wealthTier],
    accent: context.wealthTier === 'wealthy' ? '#d4bd7d' : context.wealthTier === 'comfortable' ? '#b9aa83' : '#9e9176',
    ink: '#271f1a',
    age: '#60463a',
  };

  return {
    generatorVersion: dna.generatorVersion,
    residentStableId: dna.identity.residentStableId,
    lod,
    headProfileId: headProfile.id,
    dna,
    palette,
    masks: headProfile.masks,
    layers,
  };
}
