import type {Frame} from '../../model';
import type {ExpressionId,FaceId} from './catalog';
import {headFrameFor,headFrameSignature,headShell} from './head-frame';
import {CHEEK,EYE,OUTLINE,SKIN,SKIN_SHADOW,e,isChild,isElder,isFemale,l,mirror,p} from './drawing';

const eyeSpec={oval:{dx:37,ry:10},round:{dx:40,ry:11},angular:{dx:39,ry:8},long:{dx:36,ry:9}};
const stageOf=(frame:Frame)=>frame.endsWith('child')?'child':frame.endsWith('elder')?'elder':'adult';
const sexOf=(frame:Frame)=>frame.startsWith('female')?'female':'male';

export function faceBase(frame:Frame,face:FaceId):string{
 const guide=headFrameFor(frame),signature=headFrameSignature(frame),stage=stageOf(frame),sex=sexOf(frame);
 const earX=guide.earX,earY=guide.earY;
 const ear=mirror(e(earX,earY,stage==='child'?11:12,stage==='child'?15:16,SKIN,OUTLINE,4)+p(`M${earX-4} ${earY-3}Q${earX+3} ${earY-8} ${earX+5} ${earY+2}Q${earX+1} ${earY+7} ${earX-4} ${earY+5}Z`,SKIN_SHADOW,'none',0,.6));
 const shellMeta=` data-head-frame="${guide.id}" data-frame-signature="${signature}" data-frame-left="${guide.left}" data-frame-right="${guide.right}" data-frame-top-y="${guide.topY}" data-frame-temple-y="${guide.templeY}" data-frame-side-y="${guide.sideY}" data-age-stage="${stage}" data-sex="${sex}"`;
 const surface=p(headShell(frame,face),'url(#cb-skin)',OUTLINE,4.5).replace('<path ','<path data-face-surface="" ');
 let art=ear+`<g data-chibi-head-shell="" data-face-id="${face}"${shellMeta}>${surface}</g>`;
 // 年龄来自固定 Frame。只画身份细节，不在 FaceBase 重复叠加表情腮红。
 if(stage==='elder'){
  const female=isFemale(frame),ink='#ac8573';
  const eyeAge=mirror(l('M109 179Q121 186 133 179',ink,2.4,.82)+l('M109 185L104 188',ink,2,.7));
  const cheekAge=mirror(l(female?'M138 194Q131 202 136 209':'M137 193Q130 203 135 213',ink,female?1.9:2.3,.75));
  const browAge=l('M145 133Q160 130 175 133',ink,1.9,.62);
  const chin=l(female?'M149 231Q160 235 171 231':'M146 236Q160 240 174 236',ink,1.8,.64);
  art+=`<g data-age-cue="elder">${browAge}${eyeAge}${cheekAge}${chin}</g>`;
 }else if(stage==='child'){
  art+=`<g data-age-cue="child">${mirror(e(122,196,1.6,1.1,'#fffaf3','none',0,.6))}</g>`;
 }
 if(face==='round'&&stage!=='elder')art+=mirror(e(121,194,1.25,1.25,'#bd8277','none',0,.5)+e(129,197,1,1,'#bd8277','none',0,.42));
 return art;
}

export function neckArt(frame:Frame):string{
 const female=isFemale(frame),child=isChild(frame),elder=isElder(frame);
 if(child){
  const left=female?145:142,right=female?175:178;
  return `<g data-neck-stage="child" data-neck-sex="${female?'female':'male'}">${p(`M${left} 218L${left-2} 245Q160 255 ${right+2} 245L${right} 218Z`,SKIN,OUTLINE,4)}${p(`M${left+1} 228Q160 240 ${right-1} 228L${right} 243Q160 251 ${left-1} 242Z`,SKIN_SHADOW,'none',0,.4)}</g>`;
 }
 if(elder){
  const left=female?143:139,right=female?177:181;
  return `<g data-neck-stage="elder" data-neck-sex="${female?'female':'male'}">${p(`M${left} 223L${left-2} 251Q160 262 ${right+2} 251L${right} 223Z`,SKIN,OUTLINE,4)}${p(`M${left+1} 233Q160 246 ${right-1} 233L${right+1} 249Q160 258 ${left-1} 248Z`,SKIN_SHADOW,'none',0,.48)}${l('M151 248Q160 252 169 248','#b18179',1.2,.42)}</g>`;
 }
 const left=female?140:136,right=female?180:184;
 return `<g data-neck-stage="adult" data-neck-sex="${female?'female':'male'}">${p(`M${left} 224L${left-3} 254Q160 267 ${right+3} 254L${right} 224Z`,SKIN,OUTLINE,4)}${p(`M${left+1} 233Q160 248 ${right-1} 233L${right+1} 251Q160 262 ${left-1} 250Z`,SKIN_SHADOW,'none',0,.42)}</g>`;
}

// 腮红为唯一一层 Expression 作者资产；坐标固定在六 Frame × 四脸的共同安全区。
// 不读取脸部轮廓、不裁切、不求解位置。更换 Face 后由 QA 对真实填充轮廓作检查。
function cheekTint(frame:Frame,expression:ExpressionId):string{
 const child=isChild(frame),elder=isElder(frame),female=isFemale(frame),shy=expression==='shy';
 const cy=child?192:elder?195:193;
 const rx=(child?12:female?11:9.5)+(shy?1.5:0),ry=shy?5.5:4.5;
 const opacity=elder?(shy?.4:.19):shy?.64:child?.48:female?.36:.22;
 const tint=expression==='serious'||expression==='sad'?opacity*.65:opacity;
 const spots=[128,192].map(x=>e(x,cy,rx,ry,CHEEK,'none',0,tint)).join('');
 const strokes=shy?[128,192].map(x=>l(`M${x-4} ${cy+1}L${x-1} ${cy-2}M${x+2} ${cy+2}L${x+5} ${cy-1}`,'#fff5ea',1.5,.6)).join(''):'';
 return `<g data-blush="cheek-tint-v1">${spots}${strokes}</g>`;
}

export function expressionArt(frame:Frame,face:FaceId,expression:ExpressionId):string{
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame),stage=stageOf(frame);
 const cy=child?164:elder?171:168,dx=spec.dx+(!female&&!child?2:0);
 const leftX=160-dx,rightX=160+dx;
 const ry=child?spec.ry+1:elder?(female?5.5:4.5):female?spec.ry:Math.max(5,spec.ry-4);
 const browStroke=child?(female?3:4):elder?(female?4.2:6):female?3.1:5.5;
 const browColor=elder?(female?'#8e7c72':'#82766c'):OUTLINE;
 let eyes='',brows='';
 if(expression==='joy'){
  eyes=[leftX,rightX].map(x=>l(`M${x-9} ${cy+2}Q${x} ${cy-8} ${x+9} ${cy+2}`,EYE,child?4:4.3)).join('');
 }else if(expression==='surprise'){
  eyes=[leftX,rightX].map(x=>e(x,cy,female?8:7,child?11:elder?7:9,'#fffaf2',EYE,3)+e(x,cy+1,3,4,EYE,'none',0)).join('');
 }else if(expression==='shy'){
  eyes=[leftX,rightX].map(x=>l(`M${x-8} ${cy}Q${x} ${cy+6} ${x+8} ${cy}`,EYE,3.6)).join('');
 }else{
  const eyeW=child?8.7:female?(face==='angular'?7:8):9;
  const eyeRy=expression==='serious'?Math.max(4,ry-1.5):ry;
  eyes=[leftX,rightX].map(x=>e(x,cy,eyeW,eyeRy,EYE,'none',0)).join('');
  if(!child){
   if(female){
    // 外眼角的短弧与细眉相配，不用巨大睫毛或眼白强化性别。
    eyes+=l(`M${leftX-11} ${cy-5}Q${leftX-5} ${cy-9} ${leftX+2} ${cy-7}`,EYE,2.5)+l(`M${rightX-2} ${cy-7}Q${rightX+5} ${cy-9} ${rightX+11} ${cy-5}`,EYE,2.5);
   }else{
    eyes+=[leftX,rightX].map(x=>l(`M${x-10} ${cy-4}L${x+8} ${cy-4}`,EYE,2.8)).join('');
   }
  }
  if(female&&!elder)eyes+=[leftX,rightX].map(x=>e(x-2,cy-3,1.8,1.8,'#fffaf2','none',0,.85)).join('');
 }
 if(expression==='angry')brows=l(`M${leftX-12} ${cy-25}L${leftX+10} ${cy-17}`,browColor,browStroke)+l(`M${rightX+12} ${cy-25}L${rightX-10} ${cy-17}`,browColor,browStroke);
 else if(expression==='sad')brows=l(`M${leftX-11} ${cy-19}Q${leftX} ${cy-28} ${leftX+10} ${cy-24}`,browColor,browStroke)+l(`M${rightX-10} ${cy-24}Q${rightX} ${cy-28} ${rightX+11} ${cy-19}`,browColor,browStroke);
 else if(expression==='surprise')brows=[leftX,rightX].map(x=>l(`M${x-10} ${cy-26}Q${x} ${cy-34} ${x+10} ${cy-26}`,browColor,browStroke)).join('');
 else if(expression==='serious')brows=[leftX,rightX].map(x=>l(`M${x-12} ${cy-22}L${x+12} ${cy-22}`,browColor,browStroke)).join('');
 else if(elder){
  brows=female?l(`M${leftX-12} ${cy-22}Q${leftX+1} ${cy-28} ${leftX+10} ${cy-23}`,browColor,browStroke)+l(`M${rightX-10} ${cy-23}Q${rightX-1} ${cy-28} ${rightX+12} ${cy-22}`,browColor,browStroke)
   :l(`M${leftX-14} ${cy-20}Q${leftX-2} ${cy-28} ${leftX+10} ${cy-25}`,browColor,browStroke)+l(`M${rightX-10} ${cy-25}Q${rightX+2} ${cy-28} ${rightX+14} ${cy-20}`,browColor,browStroke);
 }else if(female){
  brows=l(`M${leftX-12} ${cy-22}Q${leftX-1} ${cy-29} ${leftX+10} ${cy-23}`,browColor,browStroke)+l(`M${rightX-10} ${cy-23}Q${rightX+1} ${cy-29} ${rightX+12} ${cy-22}`,browColor,browStroke);
 }else{
  brows=l(`M${leftX-13} ${cy-22}L${leftX+11} ${cy-24}`,browColor,browStroke)+l(`M${rightX-11} ${cy-24}L${rightX+13} ${cy-22}`,browColor,browStroke);
 }
 const my=child?207:elder?215:213,w=female?8:11;
 let mouth='';
 if(expression==='calm')mouth=l(`M${160-w} ${my}Q160 ${my+(female?4:1)} ${160+w} ${my}`,OUTLINE,3.4);
 if(expression==='smile')mouth=l(`M${160-w-1} ${my-1}Q160 ${my+(elder?7:female?11:8)} ${160+w+1} ${my-1}`,OUTLINE,3.8);
 if(expression==='joy')mouth=p(`M147 ${my-3}Q160 ${my+3} 173 ${my-3}Q172 ${my+15} 160 ${my+16}Q148 ${my+15} 147 ${my-3}Z`,'#743e47',OUTLINE,3)+p(`M152 ${my+10}Q160 ${my+6} 168 ${my+10}Q160 ${my+16} 152 ${my+10}Z`,'#eea19b','none',0);
 if(expression==='angry')mouth=l(`M151 ${my+4}Q160 ${my-3} 169 ${my+4}`,OUTLINE,3.6);
 if(expression==='sad')mouth=l(`M152 ${my+5}Q160 ${my-5} 168 ${my+5}`,OUTLINE,3.6);
 if(expression==='surprise')mouth=e(160,my+3,5.5,7,'#75424b',OUTLINE,3);
 if(expression==='shy')mouth=l(`M154 ${my}Q160 ${my+6} 166 ${my}`,'#9d5860',3.3);
 if(expression==='serious')mouth=l(`M${160-w} ${my+2}L${160+w} ${my+2}`,OUTLINE,3.7);
 const nose=elder?l('M158 190Q155 196 162 196','#ac8573',2.2,.7):'';
 return `<g data-expression-style="chibi" data-expression-stage="${stage}" data-expression-sex="${female?'female':'male'}">${cheekTint(frame,expression)}${brows}<g data-eye-pair="">${eyes}</g>${nose}<g data-mouth="">${mouth}</g></g>`;
}
