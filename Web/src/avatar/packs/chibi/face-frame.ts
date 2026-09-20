import type {Frame} from '../../model';
import type {FaceId} from './catalog';

export type ChibiFaceFrame={
  id:Frame;
  left:number;
  right:number;
  topY:number;
  templeY:number;
  sideY:number;
  earX:number;
  earY:number;
};

const frames:Record<Frame,ChibiFaceFrame>={
  'female.child':{id:'female.child',left:84,right:236,topY:64,templeY:114,sideY:160,earX:84,earY:160},
  'male.child':{id:'male.child',left:82,right:238,topY:64,templeY:113,sideY:160,earX:82,earY:160},
  'female.adult':{id:'female.adult',left:91,right:229,topY:58,templeY:108,sideY:164,earX:91,earY:165},
  'male.adult':{id:'male.adult',left:89,right:231,topY:58,templeY:107,sideY:164,earX:89,earY:165},
  'female.elder':{id:'female.elder',left:92,right:228,topY:60,templeY:108,sideY:166,earX:92,earY:165},
  'male.elder':{id:'male.elder',left:90,right:230,topY:60,templeY:107,sideY:166,earX:90,earY:165},
};

const lower:Record<Frame,Record<FaceId,string>>={
  'female.child':{
    oval:'Q235 199 207 222Q184 239 160 240Q136 239 113 223Q85 202 84 160Z',
    round:'Q238 198 212 222Q187 242 160 243Q133 242 108 223Q82 200 84 160Z',
    angular:'Q234 194 205 215L180 232Q160 243 140 233L115 216Q88 197 84 160Z',
    long:'Q233 199 200 224L178 240Q160 252 142 240L120 224Q87 201 84 160Z',
  },
  'male.child':{
    oval:'Q237 199 209 223Q184 240 160 241Q136 240 111 223Q83 202 82 160Z',
    round:'Q240 199 214 224Q188 243 160 244Q132 243 106 224Q80 201 82 160Z',
    angular:'Q236 195 207 217L181 234Q160 244 139 234L113 217Q86 198 82 160Z',
    long:'Q235 200 201 226L179 242Q160 253 141 242L119 226Q85 202 82 160Z',
  },
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
  'female.elder':{
    oval:'Q226 205 195 228Q177 241 160 244Q143 241 125 228Q94 207 92 166Z',
    round:'Q230 202 207 227Q184 243 160 244Q136 243 113 228Q90 205 92 166Z',
    angular:'Q225 198 199 220L178 236Q160 247 142 237L120 221Q95 203 92 166Z',
    long:'Q224 203 195 227L178 243Q160 255 142 243L125 227Q96 204 92 166Z',
  },
  'male.elder':{
    oval:'Q228 205 197 230Q179 244 160 247Q141 244 123 230Q92 208 90 166Z',
    round:'Q232 203 209 229Q185 246 160 247Q135 246 111 229Q88 206 90 166Z',
    angular:'Q227 199 201 223L179 239Q160 250 141 240L118 223Q93 204 90 166Z',
    long:'Q226 204 197 230L179 246Q160 258 141 246L123 230Q94 205 90 166Z',
  },
};

export function faceFrameFor(frame:Frame):ChibiFaceFrame{
  return frames[frame];
}

export function faceFrameSignature(frame:Frame):string{
  const guide=faceFrameFor(frame);
  return `${guide.id}:${guide.left}:${guide.right}:${guide.topY}:${guide.templeY}:${guide.sideY}:${guide.earX}:${guide.earY}`;
}

export function faceShell(frame:Frame,face:FaceId):string{
  const guide=faceFrameFor(frame);
  const upper=`M${guide.left} ${guide.templeY}Q${guide.left+3} ${guide.topY+3} 160 ${guide.topY}Q${guide.right-3} ${guide.topY+3} ${guide.right} ${guide.templeY}L${guide.right} ${guide.sideY}`;
  return upper+lower[frame][face];
}
