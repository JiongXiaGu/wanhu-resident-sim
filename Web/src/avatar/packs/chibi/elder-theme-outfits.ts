import type {Frame} from '../../model';
import {outfitPart} from './art-spec';
import {OUTLINE,isElder,isFemale,l,p} from './drawing';

type Cut='shawl'|'round-lapel'|'deep-front'|'side-coat'|'work-over'|'mantle';
type Paint={cut:Cut;base:string;edge:string;lining:string};
const paints:Record<string,Paint>={
 'elder-shawl-wrap':{cut:'shawl',base:'#9a939f',edge:'#b7a18b',lining:'#e0d4b9'},
 'elder-rounded-lapel':{cut:'round-lapel',base:'#969f94',edge:'#c8baa3',lining:'#e8ddc6'},
 'elder-deep-front':{cut:'deep-front',base:'#8c9c9c',edge:'#506e72',lining:'#dbd5be'},
 'elder-short-overcoat':{cut:'side-coat',base:'#9a8f7c',edge:'#6e6250',lining:'#dbcfb5'},
 'elder-work-overrobe':{cut:'work-over',base:'#9c9e86',edge:'#697661',lining:'#d6c9ac'},
 'elder-travel-mantle':{cut:'mantle',base:'#83989e',edge:'#617c83',lining:'#d2c8b0'},
};
const bodies={
 female:'M140 242Q126 255 108 263Q79 276 64 297L42 326H278L256 297Q241 276 212 263Q194 255 180 242Q160 255 140 242Z',
 male:'M137 242Q116 256 96 262Q63 275 48 297L25 326H295L272 297Q257 275 224 262Q204 256 183 242Q160 256 137 242Z',
};
export function elderThemeOutfit(frame:Frame,id:string):string|null{
 const c=paints[id];if(!c||!isElder(frame))return null;
 const female=isFemale(frame),body=bodies[female?'female':'male'];
 const path=(d:string,color:string,w=3)=>p(d,color,OUTLINE,w);
 const round=()=>path('M140 243Q160 256 180 243L185 258Q160 279 135 258Z',c.lining,2.6);
 const cross=()=>path('M180 243L185 255L167 275L156 266Z',c.lining,2.7)
  +path('M140 243L134 255Q151 275 179 292L189 280Q159 263 140 243Z',c.lining,2.7);
 let base=path(body,c.base,4.5),collar='',overlay='',detail='';
 switch(c.cut){
  case 'shawl':
   collar=cross();
   overlay=path('M190 248Q220 257 237 284L260 326H217L207 303Q155 297 96 322L88 326H45L62 303Q112 281 173 286L194 274Z',c.edge,3.5)
    +path('M190 248Q211 255 224 274L207 294Q158 290 102 312L73 326H49L67 302Q119 279 174 286L194 274Z',c.lining,2.8);
   detail=l('M84 307Q141 286 203 292',c.edge,2.4,.7);break;
  case 'round-lapel':
   base+=round();
   collar=path('M137 243Q112 258 121 279Q128 294 145 300L145 326H158V287Q147 263 146 244Z',c.edge,3.2)
    +path('M183 243Q208 258 199 279Q192 294 175 300L175 326H162V287Q173 263 174 244Z',c.edge,3.2);
   detail=l('M126 267Q126 281 143 291M194 267Q194 281 177 291',c.lining,2.6)
    +l('M151 310Q154 305 160 310L169 311',c.edge,2.8);break;
  case 'deep-front':
   collar=path('M181 242L196 260L174 289L157 275Z',c.lining)
    +path('M138 242L124 258Q143 285 173 307L199 326H228L183 293Q156 270 138 242Z',c.edge,3.2);
   detail=l('M134 262Q156 291 205 326',c.lining,2.3,.8);break;
  case 'side-coat':
   base=path(body,c.lining,4.5);collar=round();
   overlay=path('M126 252Q108 260 96 262Q63 275 48 297L25 326H295L272 297Q257 275 224 262L198 251L182 271L198 291Q165 300 126 252Z',c.base,3.5)
    +path('M127 251L121 260Q151 300 187 304L213 286L205 280L186 294Q153 282 127 251Z',c.edge,2.8);
   detail=l('M203 292Q215 287 218 293Q218 300 208 301',c.lining,2.5);break;
  case 'work-over':
   base=path(body,c.lining,4.5);collar=round();
   overlay=path(female?'M125 254Q118 259 108 263Q79 276 64 297L42 326H140V293L147 273Z':'M123 253Q110 258 96 262Q63 275 48 297L25 326H139V293L147 273Z',c.base,3.5)
    +path(female?'M195 254Q202 259 212 263Q241 276 256 297L278 326H180V293L173 273Z':'M197 253Q210 258 224 262Q257 275 272 297L295 326H181V293L173 273Z',c.base,3.5);
   detail=l('M132 274L131 296V326M188 274L189 296V326',c.edge,3,.8);break;
  case 'mantle':
   base=path(body,c.lining,4.5);collar=cross();
   overlay=path(female?'M134 243Q116 258 94 263Q60 276 41 302Q92 320 142 307L168 285L188 307Q230 317 279 302Q260 276 226 263Q204 258 186 243L170 265H151Z':'M132 243Q111 258 88 263Q50 278 25 303Q85 323 141 308L168 285L190 308Q234 321 295 303Q270 278 232 263Q209 258 188 243L170 265H151Z',c.base,3.8)
    +path('M181 242L193 258L178 282L162 276Z',c.edge)
    +path('M138 242L124 258Q141 283 161 296L179 280Q153 270 138 242Z',c.lining,3.2);
   detail=l(female?'M51 300Q89 313 137 303M195 304Q234 311 269 300':'M36 302Q85 316 136 304M195 305Q239 315 284 302',c.edge,2.5,.75);break;
 }
 return `<g data-age-theme="8d2" data-wardrobe-cut="elder-${c.cut}">${outfitPart('base',base)+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail)}</g>`;
}
