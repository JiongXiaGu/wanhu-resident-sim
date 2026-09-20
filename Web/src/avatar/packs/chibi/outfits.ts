import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {OUTLINE,isChild,p,l} from './drawing';

export function outfitArt(frame:Frame,id:OutfitId):string{
 const child=isChild(frame),top=child?244:250;
 const body=child?'M136 241L118 250Q88 254 70 272L48 320H272L250 272Q232 254 184 241Q160 258 136 241Z':'M134 247L108 257Q72 262 51 286L36 320H284L269 286Q246 263 187 247Q160 266 134 247Z';

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

 return outfitPart('base',p(body,'url(#cb-jacket)',OUTLINE,5))+
  outfitPart('collar',p(`M${child?135:132} ${top-2}Q160 ${top+24} ${child?185:188} ${top-2}L184 320H136Z`,'#fff8f1',OUTLINE,3.5))+
  outfitPart('overlay',p(child?'M115 252L136 243L153 279L134 291L141 320H48L69 275Z':'M106 258L133 246L153 281L132 293L138 320H36L51 288Z','#41485c',OUTLINE,3))+
  outfitPart('overlay',p(child?'M205 252L184 243L167 279L186 291L179 320H272L251 275Z':'M214 258L187 246L167 281L188 293L182 320H284L269 288Z','#697087',OUTLINE,3))+
  outfitPart('detail',p('M154 282L160 276L167 282L165 320H155Z','#d8d6d2','none',0,.9));
}
