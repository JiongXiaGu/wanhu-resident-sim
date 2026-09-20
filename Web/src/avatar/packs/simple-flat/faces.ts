import type {Frame,Recipe} from '../../model';
import {BLUSH,INK,SKIN,SKIN_WARM,SOFT_INK,c,e,isChild,isElder,isFemale,l,mirror,p} from './drawing';

const shapes:Record<'female'|'male'|'child'|'elder',Record<Recipe['face'],string>>={
 female:{
  oval:'M108 104Q111 73 160 70Q209 73 212 104L212 158Q210 194 184 213Q160 230 136 213Q110 194 108 158Z',
  round:'M102 108Q106 76 160 73Q214 76 218 108L218 158Q218 191 194 210Q178 222 160 222Q140 222 125 210Q102 191 102 158Z',
  angular:'M108 103Q112 72 160 70Q208 72 212 103L212 157Q209 187 190 204L173 219Q160 229 146 220L128 205Q111 190 108 158Z',
  long:'M115 99Q118 67 160 65Q202 67 205 99L205 162Q203 194 183 216L171 229Q160 240 149 229L137 216Q117 194 115 162Z'
 },
 male:{
  oval:'M105 102Q109 71 160 69Q211 71 215 102L215 160Q213 193 188 214L173 226Q160 235 147 226L132 215Q107 194 105 160Z',
  round:'M99 107Q104 73 160 71Q216 73 221 107L221 160Q221 192 198 213Q180 228 160 229Q138 228 122 214Q99 194 99 160Z',
  angular:'M105 101Q109 70 160 68Q211 70 215 101L216 159Q213 188 194 207L176 223Q160 236 143 224L125 208Q108 191 105 159Z',
  long:'M113 98Q116 66 160 64Q204 66 208 99L208 163Q206 195 186 218L173 232Q160 243 147 232L134 218Q115 196 113 163Z'
 },
 child:{
  oval:'M102 109Q106 78 160 76Q214 78 218 109L218 155Q217 186 194 204Q178 218 160 219Q141 218 125 205Q102 187 102 155Z',
  round:'M96 112Q101 79 160 77Q219 79 224 112L224 155Q224 185 201 205Q182 221 160 222Q136 221 118 205Q96 186 96 155Z',
  angular:'M103 107Q108 77 160 75Q212 77 217 107L217 154Q214 182 193 199L175 212Q160 222 145 213L126 200Q106 184 103 155Z',
  long:'M110 104Q114 73 160 71Q206 73 210 104L210 158Q208 187 188 207L173 221Q160 231 147 221L132 207Q112 188 110 158Z'
 },
 elder:{
  oval:'M109 104Q113 73 160 70Q207 73 211 104L212 159Q210 192 185 213Q160 232 135 213Q111 194 109 159Z',
  round:'M103 108Q107 75 160 73Q213 75 217 108L218 158Q218 190 195 211Q178 225 160 225Q139 224 124 212Q102 193 103 158Z',
  angular:'M109 103Q113 72 160 70Q207 72 211 103L212 158Q209 187 190 205L173 220Q160 231 146 221L128 206Q111 190 109 158Z',
  long:'M116 100Q119 68 160 66Q201 68 204 100L205 162Q203 192 184 214L172 228Q160 238 148 228L136 214Q117 193 116 162Z'
 }
};

export function faceBase(frame:Frame,face:Recipe['face']):string{
 const group=isChild(frame)?'child':isElder(frame)?'elder':isFemale(frame)?'female':'male';
 const earY=isChild(frame)?153:157;
 let art=mirror(e(108,earY,8,12,SKIN,INK,2.4))+p(shapes[group][face],SKIN,INK,3.1);
 const noseY=isChild(frame)?174:181;
 art+=l(`M159 ${noseY-5}Q157 ${noseY} 161 ${noseY+2}`,SOFT_INK,1.7,.72);
 if(isChild(frame)) art+=mirror(e(124,188,11,5,BLUSH,'none',0,.18));
 if(isElder(frame)){
  art+=mirror(l('M119 166Q127 170 136 166',SOFT_INK,1.25,.55)+l('M119 174Q128 179 136 174',SOFT_INK,1,.45));
  art+=l('M147 213Q160 218 173 213',SOFT_INK,1,.48);
 }
 if(face==='round') art+=mirror(c(119,187,1.1,SKIN_WARM,'none',0,.55)+c(125,191,.9,SKIN_WARM,'none',0,.48));
 return `<g data-simple-flat-face="${face}">${art}</g>`;
}

export function neckArt(frame:Frame):string{
 if(isChild(frame)) return p('M144 205L143 238Q160 248 177 238L176 205Z',SKIN,INK,2.5);
 return p('M141 211L139 247Q160 259 181 247L179 211Z',SKIN,INK,2.5);
}

const eyeSpec={
 oval:{dx:31,rx:3.2,ry:4.2,brow:18,mouth:11},
 round:{dx:34,rx:3.8,ry:4.6,brow:19,mouth:12},
 angular:{dx:32,rx:4.2,ry:2.7,brow:20,mouth:13},
 long:{dx:29,rx:3.1,ry:3.5,brow:17,mouth:10},
};

export function expressionArt(frame:Frame,face:Recipe['face'],expression:Recipe['expression']):string{
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame);
 const y=child?151:154, leftX=160-spec.dx,rightX=160+spec.dx;
 const browY=y-17, browWidth=spec.brow, browStroke=child?2.1:female?2.35:2.8;
 let eyes='',brows='',marks='';
 if(expression==='joy'){
  eyes=l(`M${leftX-7} ${y+1}Q${leftX} ${y-6} ${leftX+7} ${y+1}`,INK,2.6)+l(`M${rightX-7} ${y+1}Q${rightX} ${y-6} ${rightX+7} ${y+1}`,INK,2.6);
 }else if(expression==='surprise'){
  eyes=e(leftX,y,spec.rx+1,spec.ry+2,'#fffdf9',INK,2)+e(rightX,y,spec.rx+1,spec.ry+2,'#fffdf9',INK,2)+c(leftX,y+1,2.2,INK)+c(rightX,y+1,2.2,INK);
  marks=l(`M${rightX+17} ${y-19}L${rightX+22} ${y-25}M${rightX+20} ${y-12}L${rightX+27} ${y-13}`,SOFT_INK,1.8,.75);
 }else{
  const ry=elder?Math.max(2.3,spec.ry-.7):spec.ry;
  eyes=e(leftX,y,spec.rx,ry,INK)+e(rightX,y,spec.rx,ry,INK);
 }
 if(expression==='angry'){
  brows=l(`M${leftX-browWidth/2} ${browY-2}L${leftX+browWidth/2} ${browY+3}`,INK,browStroke)+l(`M${rightX+browWidth/2} ${browY-2}L${rightX-browWidth/2} ${browY+3}`,INK,browStroke);
  marks=l(`M${rightX+18} ${y-8}L${rightX+23} ${y-14}M${rightX+21} ${y-5}L${rightX+28} ${y-7}`,SOFT_INK,1.7,.7);
 }else if(expression==='sad'){
  brows=l(`M${leftX-browWidth/2} ${browY+2}Q${leftX} ${browY-4} ${leftX+browWidth/2} ${browY-1}`,INK,browStroke)+l(`M${rightX-browWidth/2} ${browY-1}Q${rightX} ${browY-4} ${rightX+browWidth/2} ${browY+2}`,INK,browStroke);
  marks=p(`M${rightX+8} ${y+8}Q${rightX+13} ${y+14} ${rightX+8} ${y+20}Q${rightX+3} ${y+14} ${rightX+8} ${y+8}Z`,'#8db5cf','none',0,.75);
 }else if(expression==='surprise'){
  brows=l(`M${leftX-browWidth/2} ${browY-3}Q${leftX} ${browY-8} ${leftX+browWidth/2} ${browY-3}`,INK,browStroke)+l(`M${rightX-browWidth/2} ${browY-3}Q${rightX} ${browY-8} ${rightX+browWidth/2} ${browY-3}`,INK,browStroke);
 }else{
  const lift=expression==='smile'||expression==='joy'?-2:0;
  brows=l(`M${leftX-browWidth/2} ${browY+lift}Q${leftX} ${browY-2+lift} ${leftX+browWidth/2} ${browY+lift}`,INK,browStroke)+l(`M${rightX-browWidth/2} ${browY+lift}Q${rightX} ${browY-2+lift} ${rightX+browWidth/2} ${browY+lift}`,INK,browStroke);
 }
 const my=child?191:199,mw=spec.mouth;
 let mouth='';
 if(expression==='calm') mouth=l(`M${160-mw} ${my}Q160 ${my+1} ${160+mw} ${my}`,INK,2.2);
 if(expression==='smile') mouth=l(`M${160-mw} ${my-1}Q160 ${my+8} ${160+mw} ${my-1}`,INK,2.4);
 if(expression==='joy') mouth=p(`M${160-mw-1} ${my-3}Q160 ${my+2} ${160+mw+1} ${my-3}Q${160+mw} ${my+10} 160 ${my+12}Q${160-mw} ${my+10} ${160-mw-1} ${my-3}Z`,'#8b5659',INK,1.8);
 if(expression==='angry') mouth=l(`M${160-mw} ${my+4}Q160 ${my-2} ${160+mw} ${my+4}`,INK,2.3);
 if(expression==='sad') mouth=l(`M${160-mw} ${my+5}Q160 ${my-4} ${160+mw} ${my+5}`,INK,2.3);
 if(expression==='surprise') mouth=e(160,my+2,4.8,6.2,'#7d5052',INK,1.6);
 return `<g data-expression-style="simple-flat"><g data-eye-pair="">${eyes}</g>${brows}<g data-mouth="">${mouth}</g>${marks}</g>`;
}
