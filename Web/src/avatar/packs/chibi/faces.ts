import type {Frame} from '../../model';
import type {ExpressionId,FaceId} from './catalog';
import {faceFrameFor,faceFrameSignature,faceShell} from './face-frame';
import {CHEEK,EYE,OUTLINE,SKIN,SKIN_SHADOW,e,isChild,isElder,isFemale,l,mirror,p} from './drawing';

const eyeSpec={oval:{dx:38,ry:10},round:{dx:40,ry:11},angular:{dx:39,ry:8},long:{dx:36,ry:9}};

const stageOf=(frame:Frame)=>frame.endsWith('child')?'child':frame.endsWith('elder')?'elder':'adult';
const sexOf=(frame:Frame)=>frame.startsWith('female')?'female':'male';

export function faceBase(frame:Frame,face:FaceId):string{
 const guide=faceFrameFor(frame),signature=faceFrameSignature(frame),stage=stageOf(frame),sex=sexOf(frame);
 const earX=guide.earX,earY=guide.earY;
 const ear=mirror(e(earX,earY,stage==='child'?11:12,stage==='child'?15:16,SKIN,OUTLINE,4)+p(`M${earX-4} ${earY-3}Q${earX+3} ${earY-8} ${earX+5} ${earY+2}Q${earX+1} ${earY+7} ${earX-4} ${earY+5}Z`,SKIN_SHADOW,'none',0,.72));
 const shellMeta=` data-face-frame="${guide.id}" data-frame-signature="${signature}" data-frame-left="${guide.left}" data-frame-right="${guide.right}" data-frame-top-y="${guide.topY}" data-frame-temple-y="${guide.templeY}" data-frame-side-y="${guide.sideY}" data-age-stage="${stage}" data-sex="${sex}"`;
 let art=ear+`<g data-chibi-face-shell="" data-face-id="${face}"${shellMeta}>${p(faceShell(frame,face),'url(#cb-skin)',OUTLINE,4.5)}</g>`;

 const cheekY=stage==='child'?190:stage==='elder'?194:195;
 const cheekX=stage==='child'?116:118;
 const cheekOpacity=stage==='child'?.84:stage==='elder'?.5:.76;
 const cheekRx=stage==='child'?20:stage==='elder'?17:19;
 art+=mirror(e(cheekX,cheekY,cheekRx,stage==='child'?12:11,CHEEK,'none',0,cheekOpacity));

 if(stage==='elder'){
  const underEye=mirror(
   l('M105 177Q118 183 132 178','#9f746b',1.8,.68)+
   l('M109 185Q119 190 129 186','#9f746b',1.5,.58)+
   l('M119 204Q125 209 132 207','#ad8076',1.3,.46)
  );
  const mouthAge=l('M146 226Q160 232 174 226','#9f746b',1.45,.58)+l('M151 235Q160 238 169 234','#ad8076',1.1,.42);
  art+=`<g data-age-cue="elder">${underEye}${mouthAge}</g>`;
 }else if(stage==='child'){
  art+=`<g data-age-cue="child">${mirror(e(108,199,2.2,1.4,'#fff7ef','none',0,.5))}</g>`;
 }

 if(face==='round'&&stage!=='elder')art+=mirror(e(105,194,1.2,1.2,'#bd8277','none',0,.62)+e(112,199,1,1,'#bd8277','none',0,.52));
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

export function expressionArt(frame:Frame,face:FaceId,expression:ExpressionId):string{
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame),stage=stageOf(frame);
 const cy=child?164:elder?170:169;
 const dx=spec.dx+(!female&&!child?1:0);
 const ry=child?spec.ry+2:elder?Math.max(6,spec.ry-2):female?spec.ry:Math.max(6,spec.ry-1);
 const leftX=160-dx,rightX=160+dx,browStroke=child?3.3:female?3.7:elder?4.1:4.25;
 let eyes='',brows='',marks='';

 if(expression==='joy'){
  eyes=l(`M${leftX-10} ${cy+2}Q${leftX} ${cy-8} ${leftX+10} ${cy+2}`,EYE,child?4.2:4.5)+l(`M${rightX-10} ${cy+2}Q${rightX} ${cy-8} ${rightX+10} ${cy+2}`,EYE,child?4.2:4.5);
 }else if(expression==='surprise'){
  const eyeW=child?8.8:elder?7.3:8;
  eyes=e(leftX,cy,eyeW,child?11:9.5,'#fffdf8',EYE,4)+e(rightX,cy,eyeW,child?11:9.5,'#fffdf8',EYE,4)+e(leftX,cy+1,3.4,4.8,EYE,'none',0)+e(rightX,cy+1,3.4,4.8,EYE,'none',0);
 }else if(expression==='shy'){
  eyes=l(`M${leftX-8} ${cy+2}Q${leftX} ${cy+7} ${leftX+8} ${cy+2}`,EYE,4)+l(`M${rightX-8} ${cy+2}Q${rightX} ${cy+7} ${rightX+8} ${cy+2}`,EYE,4);
  const blushY=child?190:elder?194:197;
  marks=mirror(e(116,blushY,child?22:20,11,'#ef7f88','none',0,elder?.42:.64)+l(`M101 ${blushY-2}L110 ${blushY-8}M109 ${blushY+5}L118 ${blushY-2}`,'#fff0e9',2.1,elder?.35:.62));
 }else{
  let eyeW=face==='angular'?7:8.5;
  if(child)eyeW+=.7;
  if(!female&&!child)eyeW-=.8;
  const eyeRy=expression==='serious'?Math.max(5,ry-2):ry;
  eyes=e(leftX,cy,eyeW,eyeRy,EYE,'none',0)+e(rightX,cy,eyeW,eyeRy,EYE,'none',0);
  if(female&&!elder)eyes+=e(leftX-2,cy-3,2,2,'#fffaf2','none',0,.85)+e(rightX-2,cy-3,2,2,'#fffaf2','none',0,.85);
 }

 if(expression==='angry')brows=l(`M${leftX-12} ${cy-23}L${leftX+9} ${cy-16}`,OUTLINE,browStroke+.35)+l(`M${rightX+12} ${cy-23}L${rightX-9} ${cy-16}`,OUTLINE,browStroke+.35);
 else if(expression==='sad')brows=l(`M${leftX-11} ${cy-18}Q${leftX} ${cy-25} ${leftX+10} ${cy-20}`,OUTLINE,browStroke)+l(`M${rightX-10} ${cy-20}Q${rightX} ${cy-25} ${rightX+11} ${cy-18}`,OUTLINE,browStroke);
 else if(expression==='surprise')brows=l(`M${leftX-11} ${cy-24}Q${leftX} ${cy-31} ${leftX+11} ${cy-24}`,OUTLINE,browStroke)+l(`M${rightX-11} ${cy-24}Q${rightX} ${cy-31} ${rightX+11} ${cy-24}`,OUTLINE,browStroke);
 else if(expression==='serious')brows=l(`M${leftX-12} ${cy-21}L${leftX+12} ${cy-21}`,OUTLINE,browStroke+.4)+l(`M${rightX-12} ${cy-21}L${rightX+12} ${cy-21}`,OUTLINE,browStroke+.4);
 else if(expression==='shy')brows=l(`M${leftX-11} ${cy-21}Q${leftX} ${cy-25} ${leftX+10} ${cy-19}`,OUTLINE,browStroke-.2)+l(`M${rightX-10} ${cy-19}Q${rightX} ${cy-25} ${rightX+11} ${cy-21}`,OUTLINE,browStroke-.2);
 else if(elder)brows=l(`M${leftX-11} ${cy-20}Q${leftX} ${cy-17} ${leftX+11} ${cy-20}`,OUTLINE,browStroke,.86)+l(`M${rightX-11} ${cy-20}Q${rightX} ${cy-17} ${rightX+11} ${cy-20}`,OUTLINE,browStroke,.86);
 else brows=l(`M${leftX-11} ${cy-20}Q${leftX} ${cy-24} ${leftX+11} ${cy-20}`,OUTLINE,browStroke)+l(`M${rightX-11} ${cy-20}Q${rightX} ${cy-24} ${rightX+11} ${cy-20}`,OUTLINE,browStroke);

 const my=child?207:elder?215:214;
 const calmWidth=elder?8:9;
 let mouth='';
 if(expression==='calm')mouth=l(`M${160-calmWidth} ${my}Q160 ${my+(elder?2:4)} ${160+calmWidth} ${my}`,OUTLINE,elder?3.6:4);
 if(expression==='smile')mouth=l(`M150 ${my-2}Q160 ${my+(elder?8:12)} 170 ${my-2}`,OUTLINE,elder?4:4.5);
 if(expression==='joy')mouth=p(`M146 ${my-4}Q160 ${my+4} 174 ${my-4}Q173 ${my+16} 160 ${my+18}Q147 ${my+16} 146 ${my-4}Z`,'#743e47',OUTLINE,3.5)+p(`M151 ${my+11}Q160 ${my+7} 169 ${my+11}Q160 ${my+18} 151 ${my+11}Z`,'#f39aa0','none',0);
 if(expression==='angry')mouth=l(`M151 ${my+4}Q160 ${my-3} 169 ${my+4}`,OUTLINE,4);
 if(expression==='sad')mouth=l(`M151 ${my+6}Q160 ${my-5} 169 ${my+6}`,OUTLINE,4);
 if(expression==='surprise')mouth=e(160,my+4,6,8,'#75424b',OUTLINE,3.5);
 if(expression==='shy')mouth=l(`M154 ${my}Q160 ${my+6} 166 ${my}`,'#9d5860',3.8);
 if(expression==='serious')mouth=l(`M152 ${my+2}L168 ${my+2}`,OUTLINE,elder?3.8:4.1);

 return `<g data-expression-style="chibi" data-expression-stage="${stage}" data-expression-sex="${female?'female':'male'}">${brows}${eyes}<g data-mouth="">${mouth}</g>${marks}</g>`;
}
