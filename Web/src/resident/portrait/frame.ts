import type { Gender, LifeStageId, WealthTier } from '../../domain/resident';
import artManifestJson from './assets/art-manifest.json';
import type { PortraitAgeBand, PortraitFrameDefinition, PortraitFrameId, PortraitViewBox } from './types';

export const PORTRAIT_AGE_BANDS: readonly PortraitAgeBand[] = ['child','adult','elder'];

export const PORTRAIT_FRAME_IDS: readonly PortraitFrameId[] = [
  'female.child','female.adult','female.elder',
  'male.child','male.adult','male.elder',
];

export const PORTRAIT_VIEW_BOX:PortraitViewBox={x:0,y:15,width:120,height:120};

const clothByAge:Record<PortraitAgeBand,Record<WealthTier,string>>={
  child:{poor:'#7a6857',plain:'#748391',comfortable:'#60756b',wealthy:'#73585d'},
  adult:{poor:'#75614f',plain:'#607680',comfortable:'#596d61',wealthy:'#70575d'},
  elder:{poor:'#756a5f',plain:'#6f7370',comfortable:'#626b61',wealthy:'#66585a'},
};

type FrameArt={neckLayerId:string;backgroundColor:string;collarColor:string};
const frameArt=artManifestJson.frames as Record<PortraitFrameId,FrameArt>;

export const PORTRAIT_FRAMES:readonly PortraitFrameDefinition[]=PORTRAIT_FRAME_IDS.map((id)=>{
  const [gender,ageBand]=id.split('.') as [Gender,PortraitAgeBand];
  const art=frameArt[id];
  if(!art) throw new Error('Missing frame art '+id);
  return {
    id,gender,ageBand,viewBox:PORTRAIT_VIEW_BOX,
    neckLayerId:art.neckLayerId,
    backgroundColor:art.backgroundColor,
    collarColor:art.collarColor,
    clothByWealth:clothByAge[ageBand],
  };
});

export function portraitAgeBandForLifeStage(lifeStage:LifeStageId):PortraitAgeBand {
  if(lifeStage==='child'||lifeStage==='teen') return 'child';
  if(lifeStage==='elder') return 'elder';
  return 'adult';
}

export function portraitFrameIdFor(gender:Gender,lifeStage:LifeStageId):PortraitFrameId {
  return `${gender}.${portraitAgeBandForLifeStage(lifeStage)}` as PortraitFrameId;
}

const frameById=new Map(PORTRAIT_FRAMES.map((item)=>[item.id,item]));
export function portraitFrameFor(gender:Gender,lifeStage:LifeStageId):PortraitFrameDefinition {
  const id=portraitFrameIdFor(gender,lifeStage);
  const value=frameById.get(id);
  if(!value) throw new Error('Unknown portrait frame '+id);
  return value;
}
