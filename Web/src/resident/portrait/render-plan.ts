import {
  faceFamilyById,
  hairStyleById,
  layerById,
  outfitStyleById,
  stageProfileForLifeStage,
} from './catalog';
import {
  PORTRAIT_RENDER_CONTRACT_VERSION,
  type PaletteToken,
  type PortraitLod,
  type PortraitRenderPlan,
  type RenderLayer,
  type ResolvedAppearanceDNA,
  type SemanticAppearanceContext,
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
  'hair-state.gray':'#7f7871',
};

function toRenderLayer(assetId: string): RenderLayer {
  const asset = layerById(assetId);
  return { assetId:asset.id, slot:asset.slot, z:asset.z, shapes:asset.shapes };
}

export function buildRenderPlan(
  dna: ResolvedAppearanceDNA,
  context: SemanticAppearanceContext,
  lod: PortraitLod,
): PortraitRenderPlan {
  const stage = stageProfileForLifeStage(context.lifeStage);
  const family = faceFamilyById(dna.identity.faceFamilyId);
  const hair = hairStyleById(dna.presentation.hairStyleId);
  const outfit = outfitStyleById(dna.presentation.outfitStyleId);
  const faceLayerId = family.faceLayerByAge[stage.ageGroup];

  const layerIds = [
    hair.backLayerId,
    ...stage.layerAssetIds,
    ...outfit.layerAssetIds,
    faceLayerId,
    stage.featureLayerByGender[context.gender],
    hair.frontLayerId,
  ];

  const layers = layerIds.map(toRenderLayer).sort((a,b)=>a.z-b.z);

  const palette: Record<Exclude<PaletteToken,'none'>,string> = {
    background: stage.backgroundColor,
    skin: skinColors[dna.identity.skinPaletteId] ?? '#c68b69',
    hair: hairColors[dna.presentation.hairColorStateId] ?? hairColors[dna.identity.baseHairColorId] ?? '#29231f',
    'hair-accent': dna.presentation.hairColorStateId === 'hair-state.gray'
      ? '#b9b2aa'
      : dna.presentation.hairColorStateId === 'hair-state.salt-pepper'
        ? '#8e867d'
        : '#5b4c43',
    collar: stage.collarColor,
    cloth: stage.clothByWealth[context.wealthTier],
    accent: context.wealthTier === 'wealthy' ? '#d4bd7d' : context.wealthTier === 'comfortable' ? '#b9aa83' : '#9e9176',
    ink: '#271f1a',
    age: '#60463a',
  };

  return {
    generatorVersion:dna.generatorVersion,
    renderContractVersion:PORTRAIT_RENDER_CONTRACT_VERSION,
    residentStableId:dna.identity.residentStableId,
    lod,
    stageProfileId:stage.id,
    faceFamilyId:family.id,
    viewBox:stage.viewBox,
    dna,
    palette,
    layers,
  };
}
