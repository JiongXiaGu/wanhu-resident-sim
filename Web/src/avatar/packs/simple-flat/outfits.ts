import type {Frame,Recipe} from '../../model';
import {INK,isChild,isFemale,l,p} from './drawing';

export function outfitArt(frame:Frame,id:Recipe['outfit']):string{
 const child=isChild(frame),female=isFemale(frame);
 const body=child
  ?'M139 236L119 247Q88 252 69 270L48 320H272L251 270Q232 252 181 236Q160 251 139 236Z'
  :female
   ?'M136 243L105 255Q72 260 51 281L34 320H286L269 281Q247 260 184 243Q160 259 136 243Z'
   :'M134 242L94 255Q58 262 36 287L20 320H301L284 286Q258 260 186 242Q160 259 134 242Z';
 const top=child?240:247;
 if(id==='tee'){
  return `<g data-simple-flat-outfit="tee">${p(body,'#e9827f',INK,3)}${p(`M${child?138:135} ${top}Q160 ${top+20} ${child?182:185} ${top}L191 ${top+7}Q160 ${top+34} 129 ${top+7}Z`,'#fffaf6',INK,2.2)}${l(child?'M80 277Q95 259 117 254':'M48 292Q76 266 104 260','#c95f61',2,.55)}</g>`;
 }
 if(id==='shirt'){
  return `<g data-simple-flat-outfit="shirt">${p(body,'#6f9fd2',INK,3)}${p(`M${child?139:136} ${top-2}L160 ${top+20}L146 ${top+34}L${child?119:108} ${top+8}Z`,'#eef5fb',INK,2.1)}${p(`M${child?181:184} ${top-2}L160 ${top+20}L174 ${top+34}L${child?201:212} ${top+8}Z`,'#eef5fb',INK,2.1)}${l('M160 274L160 320','#527da8',2,.68)}${p('M154 275L160 269L166 275L164 320H156Z','#dbe8f2','none',0)}</g>`;
 }
 if(id==='knit'){
  return `<g data-simple-flat-outfit="knit">${p(body,'#d5aa55',INK,3)}${p(`M${child?139:135} ${top-2}Q160 ${top+20} ${child?181:185} ${top-2}L181 320H139Z`,'#fff8e9',INK,2.1)}${p(child?'M117 249L139 238L153 277L143 320H48L69 270Z':'M103 256L136 242L153 280L142 320H34L51 282Z','#bf8d3f','none',0,.42)}${l('M148 285L143 319M172 285L177 319','#9f773b',1.8,.65)}</g>`;
 }
 return `<g data-simple-flat-outfit="jacket">${p(body,'#6d8f7c',INK,3)}${p(`M${child?139:135} ${top-2}Q160 ${top+20} ${child?181:185} ${top-2}L182 320H138Z`,'#fff9f3',INK,2.1)}${p(child?'M118 249L139 238L153 278L135 290L141 320H48L69 270Z':'M103 256L136 242L153 280L133 292L139 320H34L51 282Z','#587363',INK,2.2)}${p(child?'M202 249L181 238L167 278L185 290L179 320H272L251 270Z':'M217 256L184 242L167 280L187 292L181 320H286L269 282Z','#7fa28d',INK,2.2)}${l('M160 279L160 320','#5a6f63',1.9,.65)}</g>`;
}
