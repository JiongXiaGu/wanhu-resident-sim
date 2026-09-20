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

// Phase 8A：六个脸型族的静态下脸画稿；不驱动 Hair，不加入轮廓求解。
const lower:Record<Frame,Record<FaceId,string>>={
  'female.child':{
    oval:'C236 191 222 212 201 226Q180 240 160 240Q140 240 119 226C98 212 84 191 84 160Z',
    round:'C241 194 228 214 208 230Q184 244 160 243Q136 244 112 230C92 214 79 194 84 160Z',
    angular:'C236 187 227 203 211 215Q184 238 160 239Q136 238 109 215C93 203 84 187 84 160Z',
    long:'C235 193 219 215 199 230Q178 244 160 244Q142 244 121 230C101 215 85 193 84 160Z',
    broad:'C240 187 237 208 216 224Q186 244 160 242Q134 244 104 224C83 208 80 187 84 160Z',
    tapered:'C234 188 220 208 201 222Q179 239 160 240Q141 239 119 222C100 208 86 188 84 160Z',
  },
  'male.child':{
    oval:'C238 192 224 213 203 227Q180 241 160 241Q140 241 117 227C96 213 82 192 82 160Z',
    round:'C243 193 229 215 210 230Q185 244 160 244Q135 244 110 230C91 215 77 193 82 160Z',
    angular:'C238 188 228 205 212 218Q184 241 160 240Q136 241 108 218C92 205 82 188 82 160Z',
    long:'C237 194 220 216 200 231Q178 245 160 245Q142 245 120 231C100 216 83 194 82 160Z',
    broad:'C242 188 239 210 217 227Q186 244 160 243Q134 244 103 227C81 210 78 188 82 160Z',
    tapered:'C236 188 221 210 202 224Q179 240 160 241Q141 240 118 224C99 210 84 188 82 160Z',
  },
  'female.adult':{
    oval:'C229 194 217 215 199 226Q179 240 160 240Q141 240 121 226C103 215 91 194 91 164Z',
    round:'C233 194 224 215 205 229Q184 243 160 243Q136 243 115 229C96 215 87 194 91 164Z',
    angular:'C229 190 220 205 206 216Q181 240 160 240Q139 240 114 216C100 205 91 190 91 164Z',
    long:'C228 195 216 216 195 231Q177 247 160 247Q143 247 125 231C104 216 92 195 91 164Z',
    broad:'C234 190 231 212 211 228Q186 244 160 242Q134 244 109 228C89 212 86 190 91 164Z',
    tapered:'C228 190 216 208 199 222Q178 241 160 242Q142 241 121 222C104 208 92 190 91 164Z',
  },
  'male.adult':{
    oval:'C232 192 223 211 206 226Q183 246 160 246Q137 246 114 226C97 211 88 192 89 164Z',
    round:'C237 194 227 215 209 230Q185 246 160 246Q135 246 111 230C93 215 83 194 89 164Z',
    angular:'C231 188 227 206 211 220L191 237Q181 245 160 245Q139 245 129 237L109 220C93 206 89 188 89 164Z',
    long:'C230 195 220 217 202 233Q181 253 160 253Q139 253 118 233C100 217 90 195 89 164Z',
    broad:'C237 188 235 211 216 228Q190 246 160 244Q130 246 104 228C85 211 83 188 89 164Z',
    tapered:'C231 191 216 212 199 227Q178 244 160 245Q142 244 121 227C104 212 89 191 89 164Z',
  },
  'female.elder':{
    oval:'C229 190 220 212 203 225Q184 244 160 244Q136 244 117 225C100 212 91 190 92 166Z',
    round:'C233 191 226 214 207 230Q185 247 160 247Q135 247 113 230C94 214 87 191 92 166Z',
    angular:'C228 188 220 206 210 218Q187 245 160 245Q133 245 110 218C100 206 92 188 92 166Z',
    long:'C227 193 215 216 199 234Q181 251 160 251Q139 251 121 234C105 216 93 193 92 166Z',
    broad:'C234 189 231 215 212 230Q187 248 160 245Q133 248 108 230C89 215 86 189 92 166Z',
    tapered:'C227 189 216 211 200 227Q179 246 160 246Q141 246 120 227C104 211 93 189 92 166Z',
  },
  'male.elder':{
    oval:'C232 190 224 214 206 231Q185 249 160 249Q135 249 114 231C96 214 88 190 90 166Z',
    round:'C236 193 228 218 211 233Q187 251 160 251Q133 251 109 233C92 218 84 193 90 166Z',
    angular:'C231 189 225 208 212 224L190 241Q179 250 160 249Q141 250 130 241L108 224C95 208 89 189 90 166Z',
    long:'C229 194 220 218 201 238Q180 256 160 256Q140 256 119 238C100 218 91 194 90 166Z',
    broad:'C236 190 234 215 215 232Q190 250 160 248Q130 250 105 232C86 215 84 190 90 166Z',
    tapered:'C230 190 217 214 200 231Q181 248 160 249Q139 248 120 231C103 214 90 190 90 166Z',
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
