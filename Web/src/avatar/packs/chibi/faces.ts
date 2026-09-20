import type {Frame} from '../../model';
import type {ExpressionId,FaceId} from './catalog';
import {CHEEK,EYE,OUTLINE,SKIN,SKIN_SHADOW,e,isChild,isElder,isFemale,l,mirror,p} from './drawing';

const shapes:Record<'female'|'male'|'child'|'elder',Record<FaceId,string>>={
 female:{
  oval:'M91 108Q94 61 160 58Q226 61 229 108L229 165Q227 211 193 229Q160 246 127 229Q93 211 91 165Z',
  round:'M84 112Q88 62 160 60Q232 62 236 112L238 163Q238 207 207 228Q185 243 160 243Q132 242 111 228Q81 207 82 164Z',
  angular:'M91 106Q96 60 160 59Q224 60 229 106L229 161Q225 199 198 220L177 235Q160 246 143 236L121 221Q95 201 91 163Z',
  long:'M97 102Q100 57 160 55Q220 57 223 103L223 166Q221 206 194 229L177 245Q160 259 143 245L126 229Q99 206 97 166Z'
 },
 male:{
  oval:'M89 107Q93 60 160 58Q227 60 231 107L231 166Q228 211 194 232Q160 251 126 232Q92 212 89 166Z',
  round:'M82 112Q87 61 160 60Q233 61 238 112L240 163Q241 206 210 230Q186 247 160 247Q132 246 108 230Q78 207 80 164Z',
  angular:'M89 105Q94 59 160 58Q226 59 231 105L232 162Q228 201 200 223L178 240Q160 251 141 241L119 224Q93 204 89 163Z',
  long:'M96 101Q99 57 160 55Q221 57 225 102L225 167Q223 207 196 232L178 248Q160 261 142 248L124 232Q98 208 96 167Z'
 },
 child:{
  oval:'M84 114Q88 67 160 64Q232 67 236 114L238 159Q238 200 207 222Q184 239 160 240Q133 239 112 223Q82 202 82 160Z',
  round:'M78 116Q84 67 160 65Q236 67 242 116L244 159Q245 199 214 223Q188 243 160 243Q130 242 105 223Q75 200 76 160Z',
  angular:'M85 111Q90 66 160 64Q230 66 235 111L236 158Q233 194 205 215L180 232Q160 243 140 233L115 216Q88 197 85 159Z',
  long:'M92 108Q96 63 160 61Q224 63 228 109L229 162Q227 199 200 224L178 240Q160 252 142 240L120 224Q94 201 92 162Z'
 },
 elder:{
  oval:'M92 108Q96 63 160 60Q224 63 228 108L229 166Q227 207 196 228Q160 250 124 228Q94 208 92 166Z',
  round:'M85 113Q89 64 160 62Q231 64 235 113L238 163Q239 203 208 227Q185 244 160 244Q132 243 111 228Q82 205 83 164Z',
  angular:'M92 106Q97 62 160 60Q223 62 228 106L229 162Q225 199 199 220L178 236Q160 247 142 237L120 221Q95 203 92 163Z',
  long:'M98 103Q101 59 160 57Q219 59 222 104L223 166Q221 203 195 227L178 243Q160 255 142 243L125 227Q100 204 98 166Z'
 }
};

export function faceBase(frame:Frame,face:FaceId):string{
 const group=isChild(frame)?'child':isElder(frame)?'elder':isFemale(frame)?'female':'male';
 const earY=isChild(frame)?160:165;
 const ear=mirror(e(91,earY,12,16,SKIN,OUTLINE,4)+p(`M87 ${earY-3}Q94 ${earY-8} 96 ${earY+2}Q92 ${earY+7} 87 ${earY+5}Z`,SKIN_SHADOW,'none',0,.75));
 let art=ear+p(shapes[group][face],'url(#cb-skin)',OUTLINE,4.5);
 const cheekY=isChild(frame)?190:195;
 art+=mirror(e(118,cheekY,19,12,CHEEK,'none',0,.78));
 if(isElder(frame)){
  art+=mirror(l('M105 177Q118 184 132 178','#9f746b',1.5,.6)+l('M109 185Q119 190 129 186','#9f746b',1.2,.45));
  art+=l('M145 229Q160 234 175 228','#9f746b',1.2,.5);
 }
 if(face==='round') art+=mirror(e(105,194,1.2,1.2,'#bd8277','none',0,.65)+e(112,199,1,1,'#bd8277','none',0,.55));
 return art;
}

export function neckArt(frame:Frame):string{
 if(isChild(frame)) return p('M143 219L141 247Q160 258 179 247L177 219Z',SKIN,OUTLINE,4)+p('M144 229Q160 243 176 229L177 245Q160 254 142 243Z',SKIN_SHADOW,'none',0,.45);
 return p('M140 224L137 254Q160 267 183 254L180 224Z',SKIN,OUTLINE,4)+p('M141 233Q160 248 179 233L181 251Q160 262 139 250Z',SKIN_SHADOW,'none',0,.42);
}

const eyeSpec={oval:{dx:38,ry:10},round:{dx:40,ry:11},angular:{dx:39,ry:8},long:{dx:36,ry:9}};
export function expressionArt(frame:Frame,face:FaceId,expression:ExpressionId):string{
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame);
 const cy=child?164:169,dx=spec.dx,ry=child?spec.ry+1:elder?Math.max(7,spec.ry-2):spec.ry;
 const leftX=160-dx,rightX=160+dx;
 let eyes='',brows='',marks='';
 if(expression==='joy'){
  eyes=l(`M${leftX-10} ${cy+2}Q${leftX} ${cy-8} ${leftX+10} ${cy+2}`,EYE,4.5)+l(`M${rightX-10} ${cy+2}Q${rightX} ${cy-8} ${rightX+10} ${cy+2}`,EYE,4.5);
 }else if(expression==='surprise'){
  eyes=e(leftX,cy,8,10,'#fffdf8',EYE,4)+e(rightX,cy,8,10,'#fffdf8',EYE,4)+e(leftX,cy+1,3.5,5,EYE,'none',0)+e(rightX,cy+1,3.5,5,EYE,'none',0);
 }else if(expression==='shy'){
  eyes=l(`M${leftX-8} ${cy+2}Q${leftX} ${cy+7} ${leftX+8} ${cy+2}`,EYE,4)+l(`M${rightX-8} ${cy+2}Q${rightX} ${cy+7} ${rightX+8} ${cy+2}`,EYE,4);
  const blushY=child?190:197;
  marks=mirror(e(116,blushY,23,12,'#ef7f88','none',0,.66)+l(`M100 ${blushY-2}L110 ${blushY-8}M108 ${blushY+5}L119 ${blushY-2}`,'#fff0e9',2.3,.65));
 }else{
  const eyeW=face==='angular'?7:8.5,eyeRy=expression==='serious'?Math.max(5,ry-2):ry;
  eyes=e(leftX,cy,eyeW,eyeRy,EYE,'none',0)+e(rightX,cy,eyeW,eyeRy,EYE,'none',0);
  if(female&&!elder) eyes+=e(leftX-2,cy-3,2,2,'#fffaf2','none',0,.85)+e(rightX-2,cy-3,2,2,'#fffaf2','none',0,.85);
 }
 if(expression==='angry') brows=l(`M${leftX-12} ${cy-23}L${leftX+9} ${cy-16}`,OUTLINE,4)+l(`M${rightX+12} ${cy-23}L${rightX-9} ${cy-16}`,OUTLINE,4);
 else if(expression==='sad') brows=l(`M${leftX-11} ${cy-18}Q${leftX} ${cy-25} ${leftX+10} ${cy-20}`,OUTLINE,3.8)+l(`M${rightX-10} ${cy-20}Q${rightX} ${cy-25} ${rightX+11} ${cy-18}`,OUTLINE,3.8);
 else if(expression==='surprise') brows=l(`M${leftX-11} ${cy-24}Q${leftX} ${cy-31} ${leftX+11} ${cy-24}`,OUTLINE,3.8)+l(`M${rightX-11} ${cy-24}Q${rightX} ${cy-31} ${rightX+11} ${cy-24}`,OUTLINE,3.8);
 else if(expression==='serious') brows=l(`M${leftX-12} ${cy-21}L${leftX+12} ${cy-21}`,OUTLINE,4.1)+l(`M${rightX-12} ${cy-21}L${rightX+12} ${cy-21}`,OUTLINE,4.1);
 else if(expression==='shy') brows=l(`M${leftX-11} ${cy-21}Q${leftX} ${cy-25} ${leftX+10} ${cy-19}`,OUTLINE,3.5)+l(`M${rightX-10} ${cy-19}Q${rightX} ${cy-25} ${rightX+11} ${cy-21}`,OUTLINE,3.5);
 else brows=l(`M${leftX-11} ${cy-20}Q${leftX} ${cy-24} ${leftX+11} ${cy-20}`,OUTLINE,3.6)+l(`M${rightX-11} ${cy-20}Q${rightX} ${cy-24} ${rightX+11} ${cy-20}`,OUTLINE,3.6);
 const my=child?208:214;
 let mouth='';
 if(expression==='calm') mouth=l(`M151 ${my}Q160 ${my+4} 169 ${my}`,OUTLINE,4);
 if(expression==='smile') mouth=l(`M150 ${my-2}Q160 ${my+12} 170 ${my-2}`,OUTLINE,4.5);
 if(expression==='joy') mouth=p(`M146 ${my-4}Q160 ${my+4} 174 ${my-4}Q173 ${my+16} 160 ${my+18}Q147 ${my+16} 146 ${my-4}Z`,'#743e47',OUTLINE,3.5)+p(`M151 ${my+11}Q160 ${my+7} 169 ${my+11}Q160 ${my+18} 151 ${my+11}Z`,'#f39aa0','none',0);
 if(expression==='angry') mouth=l(`M151 ${my+4}Q160 ${my-3} 169 ${my+4}`,OUTLINE,4);
 if(expression==='sad') mouth=l(`M151 ${my+6}Q160 ${my-5} 169 ${my+6}`,OUTLINE,4);
 if(expression==='surprise') mouth=e(160,my+4,6,8,'#75424b',OUTLINE,3.5);
 if(expression==='shy') mouth=l(`M154 ${my}Q160 ${my+6} 166 ${my}`,'#9d5860',3.8);
 if(expression==='serious') mouth=l(`M152 ${my+2}L168 ${my+2}`,OUTLINE,4.1);
 return `<g data-expression-style="chibi">${brows}${eyes}<g data-mouth="">${mouth}</g>${marks}</g>`;
}
