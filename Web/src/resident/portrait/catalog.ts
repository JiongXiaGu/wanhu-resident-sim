import portraitCatalogJson from '../../../public/generated/portrait-catalog.json';
import artManifestJson from './assets/art-manifest.json';
import { FACE_LAYERS } from './assets/faces';
import { HAIR_LAYERS } from './assets/hair';
import { NECK_LAYERS } from './assets/necks';
import { OUTFIT_LAYERS } from './assets/outfits';
import type { PortraitCatalogDefinition } from '../../domain/resident';
import type {
  FaceFamilyDefinition,HairStyleDefinition,OutfitStyleDefinition,
  PortraitAgeBand,PortraitFrameId,VectorLayerAsset,
} from './types';

const source=portraitCatalogJson as unknown as PortraitCatalogDefinition;

type FaceArt={id:string;label:string;faceLayerByAge:Record<PortraitAgeBand,string>};
type HairArt={id:string;label:string;backLayerId:string;frontLayerId:string};
type OutfitArt={id:string;label:string;layerAssetIdsByFrame:Partial<Record<PortraitFrameId,string[]>>};
const art=artManifestJson as unknown as {
  schema:'wanhu.portrait-art-manifest.v1';
  faceFamilies:FaceArt[];
  hairStyles:HairArt[];
  outfitStyles:OutfitArt[];
};

function byId<T extends {id:string}>(items:T[],label:string) {
  const map=new Map(items.map((item)=>[item.id,item]));
  if(map.size!==items.length) throw new Error('Duplicate '+label+' art id.');
  return map;
}
const faceArt=byId(art.faceFamilies,'face');
const hairArt=byId(art.hairStyles,'hair');
const outfitArt=byId(art.outfitStyles,'outfit');

export const FACE_FAMILIES:FaceFamilyDefinition[]=source.faceFamilies.map((meta)=>{
  const visual=faceArt.get(meta.id);
  if(!visual) throw new Error('Missing FaceFamily art '+meta.id);
  return {...meta,label:visual.label,faceLayerByAge:visual.faceLayerByAge,baseWeight:meta.weight};
});

export const HAIR_STYLES:HairStyleDefinition[]=source.hairStyles.map((meta)=>{
  const visual=hairArt.get(meta.id);
  if(!visual) throw new Error('Missing HairStyle art '+meta.id);
  return {
    id:meta.id,label:visual.label,genders:meta.genders,frameIds:meta.frameIds,
    backLayerId:visual.backLayerId,frontLayerId:visual.frontLayerId,baseWeight:meta.weight,
  };
});

export const OUTFIT_STYLES:OutfitStyleDefinition[]=source.outfitStyles.map((meta)=>{
  const visual=outfitArt.get(meta.id);
  if(!visual) throw new Error('Missing OutfitStyle art '+meta.id);
  return {
    id:meta.id,label:visual.label,frameIds:meta.frameIds,initialWealthTiers:meta.initialWealthTiers,
    layerAssetIdsByFrame:visual.layerAssetIdsByFrame,baseWeight:meta.weight,
  };
});

export const VECTOR_LAYERS:VectorLayerAsset[]=[
  ...FACE_LAYERS,...NECK_LAYERS,...OUTFIT_LAYERS,...HAIR_LAYERS,
];

const layerMap=byId(VECTOR_LAYERS,'vector layer');
const faceMap=byId(FACE_FAMILIES,'face family');
const hairMap=byId(HAIR_STYLES,'hair style');
const outfitMap=byId(OUTFIT_STYLES,'outfit style');

export function layerById(id:string) {
  const value=layerMap.get(id);
  if(!value) throw new Error('Unknown portrait vector layer: '+id);
  return value;
}
export function faceFamilyById(id:string) {
  const value=faceMap.get(id);
  if(!value) throw new Error('Unknown portrait FaceFamily: '+id);
  return value;
}
export function hairStyleById(id:string) {
  const value=hairMap.get(id);
  if(!value) throw new Error('Unknown portrait HairStyle: '+id);
  return value;
}
export function outfitStyleById(id:string) {
  const value=outfitMap.get(id);
  if(!value) throw new Error('Unknown portrait OutfitStyle: '+id);
  return value;
}
export function outfitLayerAssetIdsForFrame(style:OutfitStyleDefinition,frameId:PortraitFrameId) {
  const ids=style.layerAssetIdsByFrame[frameId];
  if(!ids?.length) throw new Error(style.id+' has no art for '+frameId+'.');
  return ids;
}
