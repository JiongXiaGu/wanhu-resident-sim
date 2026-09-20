import type {Frame} from '../../model';
import type {FaceId} from './catalog';

export type FaceWidthClass='narrow'|'medium'|'wide';
export type FaceTopCurve='high'|'balanced'|'round';
export type TempleSpread='tight'|'balanced'|'wide';

export type ChibiHeadFitProfile={
  id:string;
  faceWidth:FaceWidthClass;
  topCurve:FaceTopCurve;
  temples:TempleSpread;
  scaleX:number;
  translateY:number;
};

const faceFit:Record<FaceId,Omit<ChibiHeadFitProfile,'id'>>={
  oval:{faceWidth:'medium',topCurve:'balanced',temples:'balanced',scaleX:1,translateY:0},
  round:{faceWidth:'wide',topCurve:'round',temples:'wide',scaleX:1.045,translateY:2},
  angular:{faceWidth:'medium',topCurve:'balanced',temples:'tight',scaleX:.99,translateY:0},
  long:{faceWidth:'narrow',topCurve:'high',temples:'tight',scaleX:.955,translateY:-3},
};

export function headFitFor(frame:Frame,face:FaceId):ChibiHeadFitProfile{
  const base=faceFit[face];
  const male=frame.startsWith('male'),child=frame.endsWith('child');
  const scaleX=base.scaleX+(male?.01:0)+(child?.015:0);
  const translateY=base.translateY+(child?2:0);
  return {...base,id:`${frame}:${face}`,scaleX,translateY};
}

// 只有 Headwear 使用这个轻量作者适配。它不是自动求解器，也不产生逐素材/逐脸 offset 表。
// 所有帽饰共享同一套 Face fit profile，确保后续新增帽子不会复制一套位置补丁。
export function fitHeadwear(svg:string,frame:Frame,face:FaceId):string{
  if(!svg)return '';
  const fit=headFitFor(frame,face);
  const transform=`translate(160 0) translate(0 ${fit.translateY}) scale(${fit.scaleX} 1) translate(-160 0)`;
  return `<g data-chibi-head-fit="${fit.id}" data-face-width="${fit.faceWidth}" data-face-top="${fit.topCurve}" data-temple-spread="${fit.temples}" transform="${transform}">${svg}</g>`;
}
