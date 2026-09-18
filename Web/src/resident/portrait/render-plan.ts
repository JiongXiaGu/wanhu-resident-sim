import { portraitFrameFor } from './frame';
import {
  faceFamilyById,
  hairStyleById,
  layerById,
  outfitLayerAssetIdsForFrame,
  outfitStyleById,
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

const skinColors:Record<string,string>={
  'skin.warm-light':'#d3a07d',
  'skin.warm-medium':'#c68b69',
  'skin.warm-deep':'#b5795b',
  'skin.brown-deep':'#9f684f',
};

const hairColors:Record<string,string>={
  'hair.black':'#29231f',
  'hair.dark-brown-black':'#352b25',
  'hair.soft-black':'#40352f',
  'hair-state.salt-pepper':'#625b54',
  'hair-state.gray':'#7f7871',
};

function toRenderLayer(assetId:string):RenderLayer {
  const asset=layerById(assetId);
  return {assetId:asset.id,slot:asset.slot,z:asset.z,shapes:asset.shapes};
}

export function buildRenderPlan(
  dna:ResolvedAppearanceDNA,
  context:SemanticAppearanceContext,
  lod:PortraitLod,
):PortraitRenderPlan {
  const frame=portraitFrameFor(context.gender,context.lifeStage);
  const family=faceFamilyById(dna.identity.faceFamilyId);
  const hair=hairStyleById(dna.presentation.hairStyleId);
  const outfit=outfitStyleById(dna.presentation.outfitStyleId);

  if(!family.genders.includes(context.gender)) throw new Error(family.id+' is incompatible with '+context.gender+'.');
  if(!hair.frameIds.includes(frame.id)) throw new Error(hair.id+' is incompatible with '+frame.id+'.');
  if(!outfit.frameIds.includes(frame.id)) throw new Error(outfit.id+' is incompatible with '+frame.id+'.');

  const faceLayerId=family.faceLayerByAge[frame.ageBand];
  const layerIds=[
    hair.backLayerId,
    frame.neckLayerId,
    ...outfitLayerAssetIdsForFrame(outfit,frame.id),
    faceLayerId,
    hair.frontLayerId,
  ];
  const layers=layerIds.map(toRenderLayer).sort((a,b)=>a.z-b.z);

  const palette:Record<PaletteToken,string>={
    background:frame.backgroundColor,
    skin:skinColors[dna.identity.skinPaletteId]??'#c68b69',
    hair:hairColors[dna.presentation.hairColorStateId]??hairColors[dna.identity.baseHairColorId]??'#29231f',
    'hair-accent':dna.presentation.hairColorStateId==='hair-state.gray'
      ?'#b9b2aa'
      :dna.presentation.hairColorStateId==='hair-state.salt-pepper'
        ?'#8e867d'
        :'#5b4c43',
    collar:frame.collarColor,
    cloth:frame.clothByWealth[context.wealthTier],
    accent:context.wealthTier==='wealthy'?'#d0b779':context.wealthTier==='comfortable'?'#b6a47e':'#9a8c72',
    ink:'#271f1a',
    age:'#60463a',
  };

  return {
    generatorVersion:dna.generatorVersion,
    renderContractVersion:PORTRAIT_RENDER_CONTRACT_VERSION,
    residentStableId:dna.identity.residentStableId,
    lod,
    frameId:frame.id,
    faceFamilyId:family.id,
    viewBox:frame.viewBox,
    dna,
    palette,
    layers,
  };
}
