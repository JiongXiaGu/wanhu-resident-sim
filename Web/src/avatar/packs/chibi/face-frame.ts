import type {Frame} from '../../model';
import type {FaceId} from './catalog';

export type AdultFaceFrame={
  id:'female.adult'|'male.adult';
  left:number;
  right:number;
  topY:number;
  templeY:number;
  sideY:number;
  earX:number;
  earY:number;
};

const frames:Record<'female.adult'|'male.adult',AdultFaceFrame>={
  'female.adult':{id:'female.adult',left:91,right:229,topY:58,templeY:108,sideY:164,earX:91,earY:165},
  'male.adult':{id:'male.adult',left:89,right:231,topY:58,templeY:107,sideY:164,earX:89,earY:165},
};

const lower:Record<'female.adult'|'male.adult',Record<FaceId,string>>={
  'female.adult':{
    oval:'Q227 211 193 229Q160 246 127 229Q93 211 91 164Z',
    round:'Q231 207 206 228Q184 243 160 243Q136 243 114 228Q89 207 91 164Z',
    angular:'Q226 199 198 220L177 235Q160 246 143 236L121 221Q94 201 91 164Z',
    long:'Q225 205 194 229L177 245Q160 259 143 245L126 229Q95 205 91 164Z',
  },
  'male.adult':{
    oval:'Q229 211 194 232Q160 251 126 232Q91 212 89 164Z',
    round:'Q233 207 208 230Q185 247 160 247Q135 247 112 230Q87 207 89 164Z',
    angular:'Q228 201 200 223L178 240Q160 251 141 241L119 224Q92 204 89 164Z',
    long:'Q227 207 196 232L178 248Q160 261 142 248L124 232Q93 208 89 164Z',
  },
};

export function adultFaceFrameFor(frame:Frame):AdultFaceFrame|null{
  return frame==='female.adult'||frame==='male.adult'?frames[frame]:null;
}

export function adultFaceFrameSignature(frame:Frame):string|null{
  const guide=adultFaceFrameFor(frame);
  return guide?`${guide.id}:${guide.left}:${guide.right}:${guide.topY}:${guide.templeY}:${guide.sideY}`:null;
}

export function adultFaceShell(frame:Frame,face:FaceId):string|null{
  const guide=adultFaceFrameFor(frame);
  if(!guide)return null;
  const upper=`M${guide.left} ${guide.templeY}Q${guide.left+3} ${guide.topY+3} 160 ${guide.topY}Q${guide.right-3} ${guide.topY+3} ${guide.right} ${guide.templeY}L${guide.right} ${guide.sideY}`;
  return upper+lower[guide.id][face];
}
