import {
  ACCESSORIES,
  AGE_LAYER_BY_ID,
  FACE_LAYER_BY_HEAD_PROFILE,
  FEATURE_LAYER_BY_SET,
  HAIR_BUNDLES,
  OUTFIT_BUNDLES,
  PORTRAIT_STAGE_PROFILES,
  layerById,
} from './catalog';
import { resolveHeadProfile } from './appearance-resolver';
import {
  PORTRAIT_RENDER_CONTRACT_VERSION,
  type HeadAnchorId,
  type PaletteToken,
  type PlacementTransform,
  type PortraitLod,
  type PortraitRenderPlan,
  type RenderLayer,
  type ResolvedAppearanceDNA,
  type SemanticAppearanceContext,
  type VectorLayerAsset,
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

function completeTransform(input: PlacementTransform = {}): Required<PlacementTransform> {
  return {
    translateX: input.translateX ?? 0,
    translateY: input.translateY ?? 0,
    scaleX: input.scaleX ?? 1,
    scaleY: input.scaleY ?? 1,
    originX: input.originX ?? 0,
    originY: input.originY ?? 0,
  };
}

function combineTransform(a: PlacementTransform = {}, b: PlacementTransform = {}): Required<PlacementTransform> {
  const aa = completeTransform(a);
  const bb = completeTransform(b);
  return {
    translateX: aa.translateX + bb.translateX,
    translateY: aa.translateY + bb.translateY,
    scaleX: aa.scaleX * bb.scaleX,
    scaleY: aa.scaleY * bb.scaleY,
    originX: bb.originX || aa.originX,
    originY: bb.originY || aa.originY,
  };
}

function anchoredTransform(
  head: ReturnType<typeof resolveHeadProfile>,
  anchor: HeadAnchorId,
  transform: PlacementTransform = {},
) {
  const point = head.anchors[anchor];
  return combineTransform(
    { translateX: point.x, translateY: point.y },
    transform,
  );
}

function morphologyTransform(
  assetId: string,
  dna: ResolvedAppearanceDNA,
): PlacementTransform | null {
  const morphology = dna.identity.morphology;
  if (assetId.startsWith('layer.face.')) {
    return {
      scaleX: morphology.faceWidthScale,
      originX: 60,
      originY: 60,
    };
  }
  if (assetId.startsWith('layer.feature.soft-a.eyes') || assetId.startsWith('layer.feature.soft-a.brows') || assetId.startsWith('layer.feature.soft-a.96-detail')) {
    return {
      scaleX: morphology.featureSpanScale,
      originX: 60,
      originY: 51,
    };
  }
  if (assetId.startsWith('layer.feature.soft-a.nose')) {
    return {
      scaleY: morphology.noseLengthScale,
      originX: 60,
      originY: 54,
    };
  }
  if (assetId.startsWith('layer.feature.soft-a.mouth')) {
    return {
      scaleX: morphology.mouthWidthScale,
      originX: 60,
      originY: 74,
    };
  }
  if (assetId.startsWith('layer.body.') || assetId.startsWith('layer.neck.') || assetId.startsWith('layer.outfit.')) {
    return {
      scaleX: dna.identity.bodyFrameId === 'body-frame.female.slight' ? .94 : 1,
      originX: 60,
      originY: 104,
    };
  }
  return null;
}

function renderLayer(
  asset: VectorLayerAsset,
  transform: PlacementTransform,
  lod: PortraitLod,
): RenderLayer | null {
  if (!asset.lods.includes(lod)) return null;
  return {
    assetId: asset.id,
    slot: asset.slot,
    z: asset.z,
    maskMode: asset.maskMode ?? 'none',
    transform: completeTransform(transform),
    shapes: asset.shapes,
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
  const stageProfile = PORTRAIT_STAGE_PROFILES.find((item)=>item.lifeStages.includes(context.lifeStage));
  if (!hair || !outfit || !accessory || !stageProfile) throw new Error('V8.3 RenderPlan references missing asset bundle or stage profile.');

  const hairPlacement = hair.placementByHeadProfile[headProfile.id] ?? {};
  const hairAssetIds = new Set(hair.layerAssetIds);
  const accessoryAssetId = accessory.layerAssetId;
  const resolvedFeatureAssetIds = (FEATURE_LAYER_BY_SET[dna.identity.featureSetId] ?? [])
    .map((assetId)=>stageProfile.featureAssetOverrides?.[assetId] ?? assetId);

  const baseIds = [
    ...hair.layerAssetIds,
    ...stageProfile.layerAssetIds,
    ...outfit.layerAssetIds,
    FACE_LAYER_BY_HEAD_PROFILE[headProfile.id],
    ...resolvedFeatureAssetIds,
    ...(AGE_LAYER_BY_ID[dna.presentation.ageOverlayId] ?? []),
    ...(accessoryAssetId ? [accessoryAssetId] : []),
  ].filter(Boolean);

  const layers: RenderLayer[] = [];
  for (const assetId of baseIds) {
    const asset = layerById(assetId);
    let transform: PlacementTransform = {};

    if (hairAssetIds.has(assetId)) {
      transform = asset.coordinateSpace === 'anchor-local' && asset.anchor
        ? anchoredTransform(headProfile, asset.anchor, hairPlacement)
        : hairPlacement;
    } else if (accessoryAssetId === assetId) {
      const slot = accessory.placementByHairBundle?.[hair.id];
      if (slot) {
        transform = anchoredTransform(
          headProfile,
          slot.anchor,
          combineTransform(hairPlacement, slot.transform),
        );
      }
    } else {
      transform = combineTransform(
        morphologyTransform(assetId, dna) ?? {},
        stageProfile.featureTransforms?.[assetId] ?? {},
      );
    }

    const layer = renderLayer(asset, transform, lod);
    if (layer) layers.push(layer);
  }

  layers.sort((a,b)=>a.z-b.z);

  const palette: Record<Exclude<PaletteToken,'none'>,string> = {
    background: backgroundByStage[context.lifeStage] ?? '#c8aa70',
    skin: skinColors[dna.identity.skinPaletteId] ?? '#c68b69',
    hair: hairColors[dna.presentation.hairColorStateId] ?? hairColors[dna.identity.baseHairColorId] ?? '#29231f',
    'hair-accent': dna.presentation.hairColorStateId === 'hair-state.gray' ? '#c9c2b9' : dna.presentation.hairColorStateId === 'hair-state.salt-pepper' ? '#8e867d' : '#5b4c43',
    'cord-red': '#9b493d',
    'accessory-wood': '#74513a',
    'accessory-jade': '#829b83',
    cloth: clothByWealth[context.wealthTier],
    accent: context.wealthTier === 'wealthy' ? '#d4bd7d' : context.wealthTier === 'comfortable' ? '#b9aa83' : '#9e9176',
    ink: '#271f1a',
    age: '#60463a',
  };

  return {
    generatorVersion: dna.generatorVersion,
    renderContractVersion: PORTRAIT_RENDER_CONTRACT_VERSION,
    residentStableId: dna.identity.residentStableId,
    lod,
    headProfileId: headProfile.id,
    stageProfileId: stageProfile.id,
    viewBox: stageProfile.viewBox,
    dna,
    palette,
    masks: headProfile.masks,
    layers,
  };
}
