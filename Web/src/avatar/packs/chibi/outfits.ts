import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {OUTLINE,isChild,isElder,isFemale,p,l} from './drawing';

export function outfitArt(frame:Frame,id:OutfitId):string{
 const child=isChild(frame),elder=isElder(frame),female=isFemale(frame),top=child?244:elder?249:250;
 const body=child
  ? (female
    ? 'M138 241L120 250Q91 254 73 272L52 320H268L247 272Q229 254 182 241Q160 256 138 241Z'
    : 'M136 241L116 250Q84 254 65 272L42 320H278L255 272Q236 254 184 241Q160 257 136 241Z')
  : elder
   ? (female
     ? 'M137 246L112 256Q80 262 61 284L45 320H275L259 284Q238 262 183 246Q160 261 137 246Z'
     : 'M134 246L104 256Q68 262 47 286L31 320H289L273 286Q250 262 186 246Q160 263 134 246Z')
   : (female
     ? 'M136 247L110 257Q76 262 55 285L39 320H281L265 285Q243 263 184 247Q160 263 136 247Z'
     : 'M132 246L98 255Q58 261 34 287L18 320H302L286 287Q260 261 188 246Q160 266 132 246Z');

 if(id==='tee'){
  return outfitPart('base',p(body,'url(#cb-tee)',OUTLINE,5))+
   outfitPart('collar',p(`M${child?135:133} ${top}Q160 ${top+27} ${child?185:187} ${top}L195 ${top+7}Q160 ${top+42} 125 ${top+7}Z`,'#fff8f2',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M72 276Q91 257 116 252L100 320H49Z':'M50 291Q79 264 109 259L96 320H36Z','#8f82aa','none',0,.22))+
   outfitPart('detail',l(child?'M97 281Q109 298 110 317':'M88 288Q104 302 105 318','#fff3fb',2.4,.55));
 }

 if(id==='shirt'){
  return outfitPart('base',p(body,'url(#cb-shirt)',OUTLINE,5))+
   outfitPart('collar',p(`M${child?137:134} ${top-2}L160 ${top+24}L145 ${top+39}L${child?115:107} ${top+9}Z`,'#fffaf4',OUTLINE,3.5))+
   outfitPart('collar',p(`M${child?183:186} ${top-2}L160 ${top+24}L176 ${top+39}L${child?205:213} ${top+9}Z`,'#fffaf4',OUTLINE,3.5))+
   outfitPart('detail',l('M160 276L160 320','#607d8c',2.6,.6))+
   outfitPart('overlay',p('M153 277L160 270L167 277L165 320H155Z','#d4e4ea','none',0,.85));
 }

 if(id==='knit'){
  return outfitPart('base',p(body,'url(#cb-knit)',OUTLINE,5))+
   outfitPart('collar',p(`M${child?135:132} ${top-2}Q160 ${top+25} ${child?185:188} ${top-2}L185 320H135Z`,'#fff7ed',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M114 252L136 244L153 280L143 320H49L70 275Z':'M106 258L133 247L153 282L142 320H36L51 288Z','#c99c78','none',0,.28))+
   outfitPart('overlay',p(child?'M206 252L184 244L167 280L177 320H271L250 275Z':'M214 258L187 247L167 282L178 320H284L269 288Z','#fff8ee','none',0,.16))+
   outfitPart('detail',l('M148 286L142 319M172 286L178 319','#9d765f',2.5,.55));
 }

 if(id==='jacket'){
  return outfitPart('base',p(body,'url(#cb-jacket)',OUTLINE,5))+
   outfitPart('collar',p(`M${child?135:132} ${top-2}Q160 ${top+24} ${child?185:188} ${top-2}L184 320H136Z`,'#fff8f1',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M115 252L136 243L153 279L134 291L141 320H48L69 275Z':'M106 258L133 246L153 281L132 293L138 320H36L51 288Z','#41485c',OUTLINE,3))+
   outfitPart('overlay',p(child?'M205 252L184 243L167 279L186 291L179 320H272L251 275Z':'M214 258L187 246L167 281L188 293L182 320H284L269 288Z','#697087',OUTLINE,3))+
   outfitPart('detail',p('M154 282L160 276L167 282L165 320H155Z','#d8d6d2','none',0,.9));
 }

 if(id==='child-short-robe'){
  return outfitPart('base',p(body,'#b98b63',OUTLINE,5))+
   outfitPart('collar',p(`M134 ${top-3}L160 ${top+18}L145 ${top+36}L111 ${top+8}Z`,'#ead9bd',OUTLINE,3.4))+
   outfitPart('collar',p(`M186 ${top-3}L160 ${top+18}L175 ${top+36}L209 ${top+8}Z`,'#d7bd98',OUTLINE,3.4))+
   outfitPart('overlay',p('M82 271L116 253L145 289L137 320H49L70 276Z','#9c704c','none',0,.38))+
   outfitPart('detail',l('M113 286L105 319M205 286L216 318','#75543f',2.3,.58));
 }

 if(id==='child-apprentice'){
  return outfitPart('base',p(body,'#7f9295',OUTLINE,5))+
   outfitPart('collar',p(`M136 ${top-4}L160 ${top+20}L144 ${top+38}L110 ${top+9}Z`,'#f2eadb',OUTLINE,3.4))+
   outfitPart('collar',p(`M184 ${top-4}L160 ${top+20}L176 ${top+38}L210 ${top+9}Z`,'#e4d8c5',OUTLINE,3.4))+
   outfitPart('overlay',p('M151 282L160 273L169 282L167 320H153Z','#61777a','none',0,.88))+
   outfitPart('detail',l('M94 290Q111 299 120 318M226 290Q209 299 201 318','#d7ddd4',2.3,.65));
 }

 if(id==='elder-long-robe'){
  return outfitPart('base',p(body,'#817764',OUTLINE,5))+
   outfitPart('collar',p(`M132 ${top-4}L160 ${top+18}L145 ${top+38}L101 ${top+9}Z`,'#d8cbb1',OUTLINE,3.5))+
   outfitPart('collar',p(`M188 ${top-4}L160 ${top+18}L175 ${top+38}L219 ${top+9}Z`,'#c8b99b',OUTLINE,3.5))+
   outfitPart('overlay',p('M91 268L132 248L153 284L142 320H42L53 291Z','#635b4e',OUTLINE,2.7))+
   outfitPart('overlay',p('M229 268L188 248L167 284L178 320H278L267 291Z','#958a73',OUTLINE,2.7))+
   outfitPart('detail',l('M149 293L143 320M171 293L178 320','#4d493f',2.6,.65));
 }

 if(id==='elder-warm-coat'){
  return outfitPart('base',p(body,'#69756e',OUTLINE,5))+
   outfitPart('collar',p(`M130 ${top-5}Q160 ${top+17} 190 ${top-5}L184 ${top+17}Q160 ${top+40} 136 ${top+17}Z`,'#ded5c1',OUTLINE,3.6))+
   outfitPart('overlay',p('M104 257L134 247L153 282L140 320H34L49 287Z','#4f5c57',OUTLINE,2.8))+
   outfitPart('overlay',p('M216 257L186 247L167 282L180 320H286L271 287Z','#7d8980',OUTLINE,2.8))+
   outfitPart('detail',p('M153 288L160 281L167 288L166 320H154Z','#b29b74','none',0,.82));
 }

 if(id==='commoner'){
  return outfitPart('base',p(body,'#b68a62',OUTLINE,5))+
   outfitPart('collar',p(`M${child?133:130} ${top-3}L160 ${top+20}L145 ${top+40}L${child?111:102} ${top+10}Z`,'#ead9bf',OUTLINE,3.5))+
   outfitPart('collar',p(`M${child?187:190} ${top-3}L160 ${top+20}L176 ${top+40}L${child?209:218} ${top+10}Z`,'#d7bd98',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M83 270L113 257L145 292L136 320H49L69 276Z':'M58 282L107 258L146 293L136 320H36L51 289Z','#9d714e','none',0,.42))+
   outfitPart('detail',l(child?'M111 286L102 319M205 285L218 318':'M104 291L96 319M219 291L230 319','#75543f',2.4,.62));
 }

 if(id==='laborer'){
  return outfitPart('base',p(body,'#7f785e',OUTLINE,5))+
   outfitPart('collar',p(`M${child?134:132} ${top-4}L160 ${top+18}L145 ${top+37}L${child?112:104} ${top+8}Z`,'#d4c7a9',OUTLINE,3.5))+
   outfitPart('collar',p(`M${child?186:188} ${top-4}L160 ${top+18}L175 ${top+37}L${child?208:215} ${top+8}Z`,'#c0b08e',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M76 274L111 257L145 292L133 320H48L68 276Z':'M50 286L104 259L146 292L132 320H36L50 290Z','#65614f',OUTLINE,2.5))+
   outfitPart('overlay',p(child?'M244 276L209 258L176 292L187 320H272L251 276Z':'M270 289L216 259L174 292L188 320H284L270 290Z','#8f8669',OUTLINE,2.5))+
   outfitPart('detail',l('M143 294L135 320M177 294L186 320','#4f4b3d',2.6,.7));
 }

 if(id==='merchant'){
  return outfitPart('base',p(body,'#9f6f52',OUTLINE,5))+
   outfitPart('collar',p(`M${child?134:131} ${top-3}Q160 ${top+20} ${child?186:189} ${top-3}L184 ${top+13}Q160 ${top+41} 136 ${top+13}Z`,'#f0dcc1',OUTLINE,3.5))+
   outfitPart('overlay',p(child?'M113 253L136 244L153 281L143 320H49L69 276Z':'M103 260L132 248L153 283L142 320H36L51 289Z','#80543f',OUTLINE,2.8))+
   outfitPart('overlay',p(child?'M207 253L184 244L167 281L177 320H271L251 276Z':'M217 260L188 248L167 283L178 320H284L269 289Z','#b98866',OUTLINE,2.8))+
   outfitPart('detail',p('M153 286L160 279L167 286L165 320H155Z','#d9ba8d','none',0,.92)+l('M147 299L173 299','#714a39',2.4,.65));
 }

 if(id==='scholar'){
  return outfitPart('base',p(body,'#7d8e91',OUTLINE,5))+
   outfitPart('collar',p(`M${child?137:134} ${top-5}L160 ${top+22}L143 ${top+42}L${child?108:99} ${top+10}Z`,'#f4eee0',OUTLINE,3.5))+
   outfitPart('collar',p(`M${child?183:186} ${top-5}L160 ${top+22}L177 ${top+42}L${child?212:221} ${top+10}Z`,'#e6dcc9',OUTLINE,3.5))+
   outfitPart('overlay',p('M151 283L160 274L169 283L167 320H153Z','#596e72','none',0,.9))+
   outfitPart('detail',l(child?'M94 289Q111 298 119 317M226 289Q209 299 202 317':'M77 296Q99 304 111 320M243 296Q221 304 209 320','#d7ddd4',2.4,.7));
 }

 return outfitPart('base',p(body,'#6f6755',OUTLINE,5))+
  outfitPart('collar',p(`M${child?134:131} ${top-3}L160 ${top+19}L146 ${top+38}L${child?111:103} ${top+9}Z`,'#d6c8aa',OUTLINE,3.5))+
  outfitPart('collar',p(`M${child?186:189} ${top-3}L160 ${top+19}L174 ${top+38}L${child?209:217} ${top+9}Z`,'#c1b28f',OUTLINE,3.5))+
  outfitPart('overlay',p(child?'M106 264L137 246L153 283L142 320H56L71 279Z':'M92 269L132 248L153 284L141 320H42L53 291Z','#4f5a55',OUTLINE,2.8))+
  outfitPart('overlay',p(child?'M214 264L183 246L167 283L178 320H264L249 279Z':'M228 269L188 248L167 284L179 320H278L267 291Z','#7c7862',OUTLINE,2.8))+
  outfitPart('detail',l('M148 292L143 320M172 292L178 320','#45473e',2.8,.72)+p('M151 297L160 291L169 297L167 307H153Z','#b38b58','none',0,.9));
}
