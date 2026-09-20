import type {Frame} from '../../model';
import type {FaceId} from './catalog';

export type ChibiHeadFrame={
  id:Frame;
  left:number;
  right:number;
  topY:number;
  templeY:number;
  sideY:number;
  earX:number;
  earY:number;
};

export type HairCoveragePoint={x:number;y:number;name:string};

// Head Frame is the single skull/temple contract for a sex × age Frame.
// Face variants may change only the lower face and features; Hair never reads FaceId.
const frames:Record<Frame,ChibiHeadFrame>={
  'female.child':{id:'female.child',left:84,right:236,topY:64,templeY:114,sideY:160,earX:84,earY:160},
  'male.child':{id:'male.child',left:82,right:238,topY:64,templeY:113,sideY:160,earX:82,earY:160},
  'female.adult':{id:'female.adult',left:91,right:229,topY:58,templeY:108,sideY:164,earX:91,earY:165},
  'male.adult':{id:'male.adult',left:89,right:231,topY:58,templeY:107,sideY:164,earX:89,earY:165},
  // Elder hair is intentionally softer/thinner, but the hidden skull crown must still sit beneath its outer envelope.
  'female.elder':{id:'female.elder',left:92,right:228,topY:70,templeY:108,sideY:166,earX:92,earY:165},
  'male.elder':{id:'male.elder',left:90,right:230,topY:70,templeY:107,sideY:166,earX:90,earY:165},
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
    oval:'Q232 206 205 228L185 241Q160 250 135 241L115 228Q88 206 89 164Z',
    round:'Q235 201 215 219L192 239Q160 254 128 239L105 219Q85 201 89 164Z',
    angular:'L225 200L206 223L185 242Q160 250 135 242L114 223L95 200L89 164Z',
    long:'Q231 204 207 227L187 250Q160 260 133 250L113 227Q89 204 89 164Z',
  },
  'female.elder':{
    oval:'Q226 187 212 201Q216 214 193 227Q179 242 160 242Q141 242 127 227Q104 214 108 201Q94 187 92 166Z',
    round:'Q231 187 220 201Q219 218 199 230Q181 244 160 245Q139 244 121 230Q101 218 100 201Q89 187 92 166Z',
    angular:'Q223 186 210 199L207 213L182 235Q160 246 138 235L113 213L110 199Q97 186 92 166Z',
    long:'Q225 187 209 204L204 220L178 245Q160 256 142 245L116 220L111 204Q95 187 92 166Z',
  },
  'male.elder':{
    oval:'Q231 185 218 201L216 217Q205 232 186 239Q160 250 134 239Q115 232 104 217L102 201Q89 185 90 166Z',
    round:'Q233 188 223 204L219 220Q201 240 182 244Q160 252 138 244Q119 240 101 220L97 204Q87 188 90 166Z',
    angular:'L226 191L216 204L212 222L187 242Q160 253 133 242L108 222L104 204L94 191L90 166Z',
    long:'Q228 187 215 205L209 226L184 249Q160 262 136 249L111 226L105 205Q92 187 90 166Z',
  },
};

export function headFrameFor(frame:Frame):ChibiHeadFrame{return frames[frame];}

export function headFrameSignature(frame:Frame):string{
  const guide=headFrameFor(frame);
  return `${guide.id}:${guide.left}:${guide.right}:${guide.topY}:${guide.templeY}:${guide.sideY}:${guide.earX}:${guide.earY}`;
}

export function headShell(frame:Frame,face:FaceId):string{
  const guide=headFrameFor(frame);
  const upper=`M${guide.left} ${guide.templeY}Q${guide.left+3} ${guide.topY+3} 160 ${guide.topY}Q${guide.right-3} ${guide.topY+3} ${guide.right} ${guide.templeY}L${guide.right} ${guide.sideY}`;
  return upper+lower[frame][face];
}

// These points are QA probes only. They never move/scale Hair at runtime.
export function hairCoveragePoints(frame:Frame):HairCoveragePoint[]{
  const g=headFrameFor(frame);
  return [
    {name:'crown',x:160,y:g.topY+4},
    {name:'crown-left',x:128,y:g.topY+15},
    {name:'crown-right',x:192,y:g.topY+15},
    {name:'temple-left',x:g.left+10,y:g.templeY+7},
    {name:'temple-right',x:g.right-10,y:g.templeY+7},
  ];
}

export function hairCoverageOverlay(frame:Frame):string{
  const g=headFrameFor(frame),points=hairCoveragePoints(frame);
  const upper=`M${g.left} ${g.templeY}Q${g.left+3} ${g.topY+3} 160 ${g.topY}Q${g.right-3} ${g.topY+3} ${g.right} ${g.templeY}`;
  return `<g data-hair-coverage-guide="" fill="none" pointer-events="none"><path d="${upper}" stroke="#d34b4b" stroke-width="2" stroke-dasharray="5 4"/>${points.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="3" fill="#2f78c4" stroke="#fff" stroke-width="1"/>`).join('')}</g>`;
}
