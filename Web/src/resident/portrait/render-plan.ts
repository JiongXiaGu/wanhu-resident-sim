import { portraitFrameIdFor } from './frame';
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
  const frameId = portraitFrameIdFor(context.gender, context.lifeStage);
  const family = faceFamilyById(dna.identity.faceFamilyId);
  const hair = hairStyleById(dna.presentation.hairStyleId);
  const outfit = outfitStyleById(dna.presentation.outfitStyleId);
  const usesFemaleAdultFrame = frameId === 'female.adult' && outfit.fullFrame;
  const faceLayerId = family.faceLayerByAge[usesFemaleAdultFrame ? 'adult' : stage.ageGroup];

  const layerIds = usesFemaleAdultFrame
    ? [
        hair.backLayerId,
        'layer.neck.female-adult-frame',
        ...outfit.layerAssetIds,
        faceLayerId,
        'layer.features.female-adult-frame',
        hair.frontLayerId,
      ]
    : [
        hair.backLayerId,
        ...stage.layerAssetIds,
        ...outfit.layerAssetIds,
        faceLayerId,
        stage.featureLayerByGender[context.gender],
        hair.frontLayerId,
      ];

  const layers = layerIds.map(toRenderLayer).sort((a,b)=>a.z-b.z);
  const adultFrameCloth: Record<string,string> = {
    poor:'#75614f',
    plain:'#607680',
    comfortable:'#596d61',
    wealthy:'#70575d',
  };

  const palette: Record<Exclude<PaletteToken,'none'>,string> = {
    background: usesFemaleAdultFrame ? '#cbb07b' : stage.backgroundColor,
    skin: skinColors[dna.identity.skinPaletteId] ?? '#c68b69',
    hair: hairColors[dna.presentation.hairColorStateId] ?? hairColors[dna.identity.baseHairColorId] ?? '#29231f',
    'hair-accent': dna.presentation.hairColorStateId === 'hair-state.gray'
      ? '#b9b2aa'
      : dna.presentation.hairColorStateId === 'hair-state.salt-pepper'
        ? '#8e867d'
        : '#5b4c43',
    collar: usesFemaleAdultFrame ? '#b1a487' : stage.collarColor,
    cloth: usesFemaleAdultFrame ? adultFrameCloth[context.wealthTier] : stage.clothByWealth[context.wealthTier],
    accent: context.wealthTier === 'wealthy' ? '#d0b779' : context.wealthTier === 'comfortable' ? '#b6a47e' : '#9a8c72',
    ink: '#271f1a',
    age: '#60463a',
  };

  return {
    generatorVersion:dna.generatorVersion,
    renderContractVersion:PORTRAIT_RENDER_CONTRACT_VERSION,
    residentStableId:dna.identity.residentStableId,
    lod,
    frameId,
    stageProfileId:stage.id,
    faceFamilyId:family.id,
    viewBox:usesFemaleAdultFrame ? {x:0,y:15,width:120,height:120} : stage.viewBox,
    dna,
    palette,
    layers,
  };
}
