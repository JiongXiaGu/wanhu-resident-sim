import type { Gender, LifeStageId, WealthTier } from '../../domain/resident';
import type { PortraitAgeBand, PortraitFrameDefinition, PortraitFrameId, PortraitViewBox } from './types';

export const PORTRAIT_AGE_BANDS: readonly PortraitAgeBand[] = ['child','adult','elder'];

export const PORTRAIT_FRAME_IDS: readonly PortraitFrameId[] = [
  'female.child',
  'female.adult',
  'female.elder',
  'male.child',
  'male.adult',
  'male.elder',
];

export const PORTRAIT_VIEW_BOX: PortraitViewBox = {x:0,y:15,width:120,height:120};

const childCloth:Record<WealthTier,string>={poor:'#7a6857',plain:'#748391',comfortable:'#60756b',wealthy:'#73585d'};
const adultCloth:Record<WealthTier,string>={poor:'#75614f',plain:'#607680',comfortable:'#596d61',wealthy:'#70575d'};
const elderCloth:Record<WealthTier,string>={poor:'#756a5f',plain:'#6f7370',comfortable:'#626b61',wealthy:'#66585a'};

export const PORTRAIT_FRAMES: readonly PortraitFrameDefinition[] = [
  {id:'female.child',gender:'female',ageBand:'child',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.female-child-frame',backgroundColor:'#d7bf88',collarColor:'#a79b79',clothByWealth:childCloth},
  {id:'female.adult',gender:'female',ageBand:'adult',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.female-adult-frame',backgroundColor:'#cbb07b',collarColor:'#b1a487',clothByWealth:adultCloth},
  {id:'female.elder',gender:'female',ageBand:'elder',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.female-elder-frame',backgroundColor:'#b9aa83',collarColor:'#938b77',clothByWealth:elderCloth},
  {id:'male.child',gender:'male',ageBand:'child',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.male-child-frame',backgroundColor:'#d7bf88',collarColor:'#a79b79',clothByWealth:childCloth},
  {id:'male.adult',gender:'male',ageBand:'adult',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.male-adult-frame',backgroundColor:'#cbb07b',collarColor:'#aaa082',clothByWealth:adultCloth},
  {id:'male.elder',gender:'male',ageBand:'elder',viewBox:PORTRAIT_VIEW_BOX,neckLayerId:'layer.neck.male-elder-frame',backgroundColor:'#b9aa83',collarColor:'#938b77',clothByWealth:elderCloth},
];

export function portraitAgeBandForLifeStage(lifeStage: LifeStageId): PortraitAgeBand {
  if (lifeStage === 'child' || lifeStage === 'teen') return 'child';
  if (lifeStage === 'elder') return 'elder';
  return 'adult';
}

export function portraitFrameIdFor(gender: Gender, lifeStage: LifeStageId): PortraitFrameId {
  return `${gender}.${portraitAgeBandForLifeStage(lifeStage)}` as PortraitFrameId;
}

export function portraitFrameFor(gender: Gender, lifeStage: LifeStageId): PortraitFrameDefinition {
  const id=portraitFrameIdFor(gender,lifeStage);
  const frame=PORTRAIT_FRAMES.find((item)=>item.id===id);
  if(!frame) throw new Error('Unknown portrait frame '+id);
  return frame;
}
