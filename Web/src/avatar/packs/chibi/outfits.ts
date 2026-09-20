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

 if(id==='tee'||id==='shirt'||id==='knit'||id==='jacket')throw new Error(`Outfit ${id} is compatibility-only and must be fitted to the current Frame before rendering.`);

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

 if(id==='child-play-jacket'){
  return outfitPart('base',p(body,'#a87a5a',OUTLINE,5))+
   outfitPart('collar',p(`M135 ${top-4}Q160 ${top+15} 185 ${top-4}L181 ${top+12}Q160 ${top+34} 139 ${top+12}Z`,'#e8d6bb',OUTLINE,3.4))+
   outfitPart('overlay',p('M99 260L137 244L153 280L140 320H50L70 277Z','#8d6247','none',0,.42))+
   outfitPart('overlay',p('M221 260L183 244L167 280L180 320H270L250 277Z','#be936c','none',0,.28))+
   outfitPart('detail',l('M148 288L142 319M172 288L178 319','#6f4d3c',2.4,.62));
 }

 if(id==='child-helper'){
  return outfitPart('base',p(body,'#77735a',OUTLINE,5))+
   outfitPart('collar',p(`M134 ${top-4}L160 ${top+18}L145 ${top+36}L111 ${top+8}Z`,'#d6c7a7',OUTLINE,3.4))+
   outfitPart('collar',p(`M186 ${top-4}L160 ${top+18}L175 ${top+36}L209 ${top+8}Z`,'#c4b491',OUTLINE,3.4))+
   outfitPart('overlay',p('M78 273L112 257L145 291L133 320H48L68 277Z','#5f5d4b',OUTLINE,2.5))+
   outfitPart('overlay',p('M242 274L208 257L175 291L187 320H272L251 277Z','#898266',OUTLINE,2.5))+
   outfitPart('detail',l('M141 296L134 320M179 296L186 320','#45483d',2.6,.7));
 }

 if(id==='child-winter'){
  return outfitPart('base',p(body,'#6f7d76',OUTLINE,5))+
   outfitPart('collar',p(`M132 ${top-6}Q160 ${top+12} 188 ${top-6}L184 ${top+18}Q160 ${top+40} 136 ${top+18}Z`,'#ded3bd',OUTLINE,3.6))+
   outfitPart('overlay',p('M106 253L136 244L153 281L140 320H48L69 276Z','#54635c',OUTLINE,2.8))+
   outfitPart('overlay',p('M214 253L184 244L167 281L180 320H272L251 276Z','#829189',OUTLINE,2.8))+
   outfitPart('detail',p('M153 286L160 279L167 286L166 320H154Z','#b69a71','none',0,.84)+l('M144 300L176 300','#d8cdb7',2.2,.6));
 }

 if(id==='child-fine-robe'){
  return outfitPart('base',p(body,'#8a718f',OUTLINE,5))+
   outfitPart('collar',p(`M136 ${top-5}L160 ${top+20}L144 ${top+39}L109 ${top+9}Z`,'#f1e6d8',OUTLINE,3.4))+
   outfitPart('collar',p(`M184 ${top-5}L160 ${top+20}L176 ${top+39}L211 ${top+9}Z`,'#e2d3c2',OUTLINE,3.4))+
   outfitPart('overlay',p('M88 268L116 254L145 290L136 320H49L69 276Z','#725a79','none',0,.46))+
   outfitPart('overlay',p('M232 268L204 254L175 290L184 320H271L251 276Z','#a98cae','none',0,.35))+
   outfitPart('detail',l('M101 292Q119 299 126 316M219 292Q201 299 194 316','#d9c29c',2.3,.72)+p('M153 292L160 286L167 292L165 304H155Z','#c49c6a','none',0,.92));
 }

 if(id==='adult-female-ruqun'){
  return outfitPart('base',p(body,'#9b6f7d',OUTLINE,5))+
   outfitPart('collar',p(`M132 ${top-4}L160 ${top+20}L144 ${top+42}L101 ${top+10}Z`,'#f0e5d8',OUTLINE,3.5))+
   outfitPart('collar',p(`M188 ${top-4}L160 ${top+20}L176 ${top+42}L219 ${top+10}Z`,'#e1d2c1',OUTLINE,3.5))+
   outfitPart('overlay',p('M102 258L134 247L153 283L140 320H39L53 289Z','#7d5666','none',0,.42))+
   outfitPart('overlay',p('M218 258L186 247L167 283L180 320H281L267 289Z','#b88a97','none',0,.32))+
   outfitPart('detail',l('M82 300L238 300','#d8b98f',3,.76)+p('M151 294L160 287L169 294L166 307H154Z','#c49a69','none',0,.92));
 }

 if(id==='adult-female-work'){
  return outfitPart('base',p(body,'#746f58',OUTLINE,5))+
   outfitPart('collar',p(`M132 ${top-4}L160 ${top+18}L145 ${top+38}L103 ${top+9}Z`,'#d7c9ad',OUTLINE,3.5))+
   outfitPart('collar',p(`M188 ${top-4}L160 ${top+18}L175 ${top+38}L217 ${top+9}Z`,'#c5b595',OUTLINE,3.5))+
   outfitPart('overlay',p('M92 266L132 248L153 284L140 320H42L53 291Z','#515b54',OUTLINE,2.8))+
   outfitPart('overlay',p('M228 266L188 248L167 284L180 320H278L267 291Z','#817a62',OUTLINE,2.8))+
   outfitPart('detail',p('M146 286L160 279L174 286L170 320H150Z','#5e5544','none',0,.82));
 }

 if(id==='adult-male-short-robe'){
  return outfitPart('base',p(body,'#647b84',OUTLINE,5))+
   outfitPart('collar',p(`M128 ${top-4}L160 ${top+18}L145 ${top+39}L96 ${top+9}Z`,'#e4dfd2',OUTLINE,3.5))+
   outfitPart('collar',p(`M192 ${top-4}L160 ${top+18}L175 ${top+39}L224 ${top+9}Z`,'#d4cdbd',OUTLINE,3.5))+
   outfitPart('overlay',p('M83 271L127 251L151 288L137 320H31L47 289Z','#526872','none',0,.46))+
   outfitPart('overlay',p('M237 271L193 251L169 288L183 320H289L273 289Z','#78909a','none',0,.33))+
   outfitPart('detail',l('M148 294L141 320M172 294L179 320','#435962',2.6,.7));
 }

 if(id==='adult-male-long-robe'){
  return outfitPart('base',p(body,'#6f786f',OUTLINE,5))+
   outfitPart('collar',p(`M128 ${top-5}L160 ${top+20}L143 ${top+42}L96 ${top+10}Z`,'#ede7d8',OUTLINE,3.6))+
   outfitPart('collar',p(`M192 ${top-5}L160 ${top+20}L177 ${top+42}L224 ${top+10}Z`,'#ddd4c3',OUTLINE,3.6))+
   outfitPart('overlay',p('M151 282L160 273L169 282L167 320H153Z','#53645c','none',0,.9))+
   outfitPart('detail',l('M75 301Q104 306 117 320M245 301Q216 306 203 320','#cfd7cc',2.5,.7));
 }

 if(id==='adult-winter-coat'){
  return outfitPart('base',p(body,'#5f7068',OUTLINE,5))+
   outfitPart('collar',p(`M126 ${top-7}Q160 ${top+12} 194 ${top-7}L188 ${top+19}Q160 ${top+44} 132 ${top+19}Z`,'#ddd2bd',OUTLINE,3.8))+
   outfitPart('overlay',p('M98 255L133 245L153 282L139 320H30L47 287Z','#465850',OUTLINE,2.9))+
   outfitPart('overlay',p('M222 255L187 245L167 282L181 320H290L273 287Z','#7f8d83',OUTLINE,2.9))+
   outfitPart('detail',p('M151 289L160 281L169 289L167 320H153Z','#ad936c','none',0,.88)+l('M139 302L181 302','#d5cab5',2.4,.62));
 }

 if(id==='adult-service-robe'){
  return outfitPart('base',p(body,'#536775',OUTLINE,5))+
   outfitPart('collar',p(`M129 ${top-5}L160 ${top+18}L145 ${top+40}L98 ${top+9}Z`,'#dce1dc',OUTLINE,3.5))+
   outfitPart('collar',p(`M191 ${top-5}L160 ${top+18}L175 ${top+40}L222 ${top+9}Z`,'#cbd3ce',OUTLINE,3.5))+
   outfitPart('overlay',p('M105 260L133 248L153 283L142 320H36L50 289Z','#405361',OUTLINE,2.8))+
   outfitPart('overlay',p('M215 260L187 248L167 283L178 320H284L270 289Z','#677d8a',OUTLINE,2.8))+
   outfitPart('detail',l('M87 303L233 303','#b7c1bc',2.6,.72)+p('M152 293L160 286L168 293L166 305H154Z','#a48a63','none',0,.88));
 }

 if(id==='adult-shop-assistant'){
  return outfitPart('base',p(body,'#9a7453',OUTLINE,5))+
   outfitPart('collar',p(`M131 ${top-4}Q160 ${top+19} 189 ${top-4}L184 ${top+14}Q160 ${top+42} 136 ${top+14}Z`,'#efe0c7',OUTLINE,3.5))+
   outfitPart('overlay',p('M104 258L134 247L153 283L141 320H36L51 289Z','#765338',OUTLINE,2.8))+
   outfitPart('overlay',p('M216 258L186 247L167 283L179 320H284L269 289Z','#b78c65',OUTLINE,2.8))+
   outfitPart('detail',p('M150 286L160 278L170 286L167 320H153Z','#d5b582','none',0,.9)+l('M144 299L176 299','#684932',2.4,.66));
 }

 if(id==='elder-simple-robe'){
  return outfitPart('base',p(body,'#7c735f',OUTLINE,5))+
   outfitPart('collar',p(`M132 ${top-4}L160 ${top+18}L145 ${top+38}L101 ${top+9}Z`,'#d8cdb7',OUTLINE,3.5))+
   outfitPart('collar',p(`M188 ${top-4}L160 ${top+18}L175 ${top+38}L219 ${top+9}Z`,'#c8bda4',OUTLINE,3.5))+
   outfitPart('overlay',p('M92 268L132 249L153 284L141 320H43L54 291Z','#655e50',OUTLINE,2.6))+
   outfitPart('overlay',p('M228 268L188 249L167 284L179 320H277L266 291Z','#918671',OUTLINE,2.6))+
   outfitPart('detail',l('M149 294L143 320M171 294L177 320','#4e4a40',2.5,.64));
 }

 if(id==='elder-work-jacket'){
  return outfitPart('base',p(body,'#666b58',OUTLINE,5))+
   outfitPart('collar',p(`M131 ${top-4}L160 ${top+17}L145 ${top+36}L102 ${top+8}Z`,'#d2c6aa',OUTLINE,3.5))+
   outfitPart('collar',p(`M189 ${top-4}L160 ${top+17}L175 ${top+36}L218 ${top+8}Z`,'#bfb18f',OUTLINE,3.5))+
   outfitPart('overlay',p('M83 274L125 254L150 289L136 320H40L52 291Z','#505546',OUTLINE,2.8))+
   outfitPart('overlay',p('M237 274L195 254L170 289L184 320H280L268 291Z','#7b8068',OUTLINE,2.8))+
   outfitPart('detail',p('M147 291L160 284L173 291L169 320H151Z','#4b4d42','none',0,.84));
 }

 if(id==='elder-padded-robe'){
  return outfitPart('base',p(body,'#64736d',OUTLINE,5))+
   outfitPart('collar',p(`M126 ${top-7}Q160 ${top+12} 194 ${top-7}L188 ${top+19}Q160 ${top+43} 132 ${top+19}Z`,'#ded2bb',OUTLINE,3.8))+
   outfitPart('overlay',p('M101 256L135 246L153 282L140 320H39L51 288Z','#4d5e57',OUTLINE,2.9))+
   outfitPart('overlay',p('M219 256L185 246L167 282L180 320H281L269 288Z','#819087',OUTLINE,2.9))+
   outfitPart('detail',p('M151 289L160 281L169 289L167 320H153Z','#aa9069','none',0,.88)+l('M139 302L181 302','#d2c6ae',2.3,.6));
 }

 if(id==='elder-fine-robe'){
  return outfitPart('base',p(body,'#806b61',OUTLINE,5))+
   outfitPart('collar',p(`M130 ${top-5}Q160 ${top+18} 190 ${top-5}L185 ${top+15}Q160 ${top+41} 135 ${top+15}Z`,'#eadbc4',OUTLINE,3.6))+
   outfitPart('overlay',p('M104 259L134 248L153 283L141 320H41L53 289Z','#674f46',OUTLINE,2.8))+
   outfitPart('overlay',p('M216 259L186 248L167 283L179 320H279L267 289Z','#9d8070',OUTLINE,2.8))+
   outfitPart('detail',l('M84 301L236 301','#c6a575',2.6,.74)+p('M151 292L160 285L169 292L166 305H154Z','#b89260','none',0,.9));
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
