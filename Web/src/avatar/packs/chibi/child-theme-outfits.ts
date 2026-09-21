import type {Frame} from '../../model';
import {outfitPart} from './art-spec';
import {OUTLINE,isChild,isFemale,l,p} from './drawing';

type Cut='arc'|'slant-over'|'side-front'|'straight'|'smock'|'round-cape';
type Paint={cut:Cut;base:string;edge:string;lining:string};
const paints:Record<string,Paint>={
 'child-arc-collar':{cut:'arc',base:'#bd9c91',edge:'#e4c9ae',lining:'#f2e1c5'},
 'child-petal-overcoat':{cut:'slant-over',base:'#b29caa',edge:'#7e6e86',lining:'#ded5bc'},
 'child-side-fastened':{cut:'side-front',base:'#90a6a3',edge:'#5f7d7b',lining:'#e3d5b4'},
 'child-straight-jacket':{cut:'straight',base:'#ab9d85',edge:'#73664f',lining:'#e4d7b8'},
 'child-helper-smock':{cut:'smock',base:'#9da28a',edge:'#69765d',lining:'#ded4b6'},
 'child-outing-cape':{cut:'round-cape',base:'#8b9eae',edge:'#647c92',lining:'#e2cca6'},
};
// 儿童男女固定肩身；衣片延伸出画布，不在下缘塞裙腰、腰带或横挡板。
const bodies={
 female:'M141 237Q127 249 111 256Q85 264 72 285L59 326H261L248 285Q235 264 209 256Q193 249 179 237Q160 250 141 237Z',
 male:'M139 237Q124 249 105 254Q77 263 62 283L47 326H273L258 283Q243 263 215 254Q196 249 181 237Q160 251 139 237Z',
};
export function childThemeOutfit(frame:Frame,id:string):string|null{
 const c=paints[id];if(!c||!isChild(frame))return null;
 const female=isFemale(frame),body=bodies[female?'female':'male'];
 const path=(d:string,color:string,w=3)=>p(d,color,OUTLINE,w);
 const round=()=>path('M140 238Q160 251 180 238L185 252Q160 273 135 252Z',c.lining,2.6);
 const cross=()=>path('M180 238L185 250L166 270L156 260Z',c.lining,2.6)
  +path('M140 238L135 250Q151 268 179 285L188 274Q159 257 140 238Z',c.lining,2.6);
 let base=path(body,c.base,4.5),collar='',overlay='',detail='';
 switch(c.cut){
  case 'arc':
   base+=round();
   collar=path('M138 239Q121 250 125 267Q130 281 147 285L156 273Q143 255 146 240Z',c.edge)
    +path('M182 239Q199 250 195 267Q190 281 173 285L164 273Q177 255 174 240Z',c.edge);
   detail=l('M160 278V326',c.edge,2.5);break;
  case 'slant-over':
   base=path(body,c.lining,4.5);collar=cross();
   overlay=path('M124 248Q95 257 80 275L65 326H257L245 284Q220 273 191 281L179 295Q151 279 124 248Z',c.base,3.5)
    +path('M124 248L120 256Q148 289 178 307L198 285L191 279L178 295Q148 276 124 248Z',c.edge,2.6);
   detail=l('M212 299Q220 309 222 326',c.edge,2.2,.55);break;
  case 'side-front':
   collar=path('M135 238Q160 252 185 238L191 252Q184 266 174 271L209 285L233 304L224 315L199 295L166 283Q144 277 130 255Z',c.edge)
    +round();
   detail=l('M224 314L221 326M204 290Q215 282 219 289Q219 294 210 295',c.lining,2.5);break;
  case 'straight':
   base+=path('M141 240Q160 253 179 240L174 326H146Z',c.lining,2.5);
   collar=path('M134 239Q130 250 137 261L148 277V326H157V273Q140 259 144 242Z',c.edge,2.7)
    +path('M186 239Q190 250 183 261L172 277V326H163V273Q180 259 176 242Z',c.edge,2.7);
   detail=l('M152 295L168 295M152 315L168 315',c.lining,2.8);break;
  case 'smock':
   base=path(body,c.lining,4.5);collar=round();
   // 敞口外罩铺满肩部至下缘；不能只画两条悬在内衫上的窄带。
   overlay=path(female?'M125 247Q119 254 111 256Q85 264 72 285L59 326H143V287L148 270Z':'M124 247Q115 252 105 254Q77 263 62 283L47 326H142V287L148 270Z',c.base,3.5)
    +path(female?'M195 247Q201 254 209 256Q235 264 248 285L261 326H177V287L172 270Z':'M196 247Q205 252 215 254Q243 263 258 283L273 326H178V287L172 270Z',c.base,3.5);
   detail=l('M133 270L135 288V326M187 270L185 288V326',c.edge,2.7);break;
  case 'round-cape':
   base=path(body,c.lining,4.5);collar=cross();
   overlay=path(female?'M136 240Q121 250 100 255Q70 266 55 292Q97 316 145 305L158 277L172 303Q216 319 265 292Q250 266 220 255Q199 250 184 240L170 262H150Z':'M134 240Q118 250 95 254Q62 266 47 292Q93 318 143 306L158 277L173 305Q221 320 273 292Q258 266 225 254Q202 250 186 240L170 262H150Z',c.base,3.7)
    +path('M136 240L128 252Q143 268 149 278L158 277L170 275Q181 262 192 252L184 240Q160 257 136 240Z',c.edge,2.8);
   detail=l(female?'M63 290Q103 308 142 300M178 300Q221 311 256 291':'M56 291Q101 311 141 301M179 302Q222 312 264 291',c.lining,2.8,.85);break;
 }
 return `<g data-age-theme="8d2" data-wardrobe-cut="child-${c.cut}">${outfitPart('base',base)+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail)}</g>`;
}
