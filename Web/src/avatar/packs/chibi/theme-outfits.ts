import type {Frame} from '../../model';
import {outfitPart} from './art-spec';
import {OUTLINE,isFemale,l,p} from './drawing';

type Cut='soft-cross'|'round-slit'|'square-over'|'deep-wrap'|'shoulder-vest'|'slant'|'narrow-wrap'|'collarless'|'double-edge'|'short-vest'|'folded'|'side-front'|'cape'|'wrap-coat'|'shawl'|'high-coat';
type Paint={cut:Cut;base:string;edge:string;lining:string};
const paints:Record<string,Paint>={
 'adult-home-soft-cross':{cut:'soft-cross',base:'#a8afa0',edge:'#dad9c1',lining:'#efe7d0'},
 'adult-home-round-open':{cut:'round-slit',base:'#ae9f8b',edge:'#7e715f',lining:'#e5d9bd'},
 'adult-home-short-over':{cut:'square-over',base:'#af8f87',edge:'#795f59',lining:'#e0d0b6'},
 'adult-home-deep-wrap':{cut:'deep-wrap',base:'#84969e',edge:'#526c78',lining:'#d7d6c0'},
 'adult-work-shoulder-vest':{cut:'shoulder-vest',base:'#95876b',edge:'#635d48',lining:'#c4c1a2'},
 'adult-work-slant-coat':{cut:'slant',base:'#9b9b7c',edge:'#646c51',lining:'#d3ccb0'},
 'adult-work-tucked-jacket':{cut:'narrow-wrap',base:'#8b9b89',edge:'#596c5a',lining:'#d8d3b9'},
 'adult-work-collarless':{cut:'collarless',base:'#a39478',edge:'#73664e',lining:'#6f8071'},
 'adult-shop-bordered-gown':{cut:'double-edge',base:'#7c9190',edge:'#415f60',lining:'#d6c49d'},
 'adult-shop-short-vest':{cut:'short-vest',base:'#9b7b68',edge:'#674d40',lining:'#d3c9ad'},
 'adult-shop-pleated-jacket':{cut:'folded',base:'#8e899e',edge:'#c8bbae',lining:'#ece0c8'},
 'adult-shop-side-robe':{cut:'side-front',base:'#8a9281',edge:'#546654',lining:'#d8cfad'},
 'adult-travel-shoulder-cape':{cut:'cape',base:'#8b9084',edge:'#596255',lining:'#c4b99b'},
 'adult-travel-cross-coat':{cut:'wrap-coat',base:'#8e7d69',edge:'#c7b68e',lining:'#e3d4b2'},
 'adult-travel-shawl-jacket':{cut:'shawl',base:'#99908b',edge:'#7a8a8d',lining:'#d2c6a9'},
 'adult-travel-high-coat':{cut:'high-coat',base:'#798e92',edge:'#bdb6a1',lining:'#e7d8bb'},
};
// 主衣片延伸到画布之外。裁切内只呈现头肩胸像，不画腰带或裙腰。
const normal={female:'M139 237Q123 250 106 257Q76 267 57 291L38 326H282L263 291Q244 267 214 257Q197 250 181 237Q160 252 139 237Z',male:'M136 237Q117 250 96 256Q59 266 38 290L18 326H302L282 290Q261 266 224 256Q203 250 184 237Q160 254 136 237Z'};
const broad={female:'M137 237Q119 249 100 253Q67 260 44 285L26 326H294L276 285Q253 260 220 253Q201 249 183 237Q160 252 137 237Z',male:'M134 237Q113 249 90 253Q48 260 28 287L10 326H310L292 287Q272 260 230 253Q207 249 186 237Q160 254 134 237Z'};
const narrow={female:'M141 237Q128 249 113 257Q89 268 73 291L59 326H261L247 291Q231 268 207 257Q192 249 179 237Q160 251 141 237Z',male:'M139 237Q125 249 107 255Q77 267 58 292L44 326H276L262 292Q243 267 213 255Q195 249 181 237Q160 252 139 237Z'};

export function themeOutfit(frame:Frame,id:string):string|null{
 const c=paints[id];if(!c||!frame.endsWith('adult'))return null;
 const sex=isFemale(frame)?'female':'male',wide=['cape','shawl','wrap-coat','high-coat'].includes(c.cut);
 const body=(wide?broad:['slant','narrow-wrap'].includes(c.cut)?narrow:normal)[sex];
 let base=p(body,c.base,OUTLINE,4.5),collar='',overlay='',detail='';
 const path=(d:string,color:string,width=3)=>p(d,color,OUTLINE,width);
 const seam=(d:string,width=2.5)=>l(d,c.edge,width,.65);
 const inner=()=>path('M141 238Q160 252 179 238L191 262L160 283L129 262Z',c.lining,2.5);
 const cross=(color:string,deep=false)=>path('M180 237L187 251L165 275L155 265Z',c.lining,2.7)
  +path(deep?'M140 237L129 252Q144 278 164 296L192 326H219L180 285Q157 263 140 237Z':'M140 237L133 250Q154 272 181 289L235 326H252L184 281Q157 259 140 237Z',color,2.9);
 const tie=(y:number)=>l(`M147 ${y}Q149 ${y-5} 155 ${y-3}L168 ${y}Q174 ${y+1} 173 ${y-3}L169 ${y-4}L151 ${y}`,c.lining,2.8);
 switch(c.cut){
  case 'soft-cross':
   collar=path('M181 237Q184 246 188 252L166 275L155 265Z',c.lining,2.7)
    +path('M140 237Q137 243 136 250Q153 272 181 291L232 326H247L183 282Q155 258 140 237Z',c.edge,2.8);
   detail=seam('M107 279Q113 301 119 326M217 279Q216 301 222 326',1.8);break;
  case 'round-slit':
   collar=inner()+path('M134 239Q128 248 130 258Q136 276 153 278V326H165V277Q183 275 190 258Q193 248 186 239L180 242Q184 253 177 260Q160 272 143 260Q136 253 140 242Z',c.edge,2.7);
   detail=seam('M169 295Q179 289 181 296Q179 301 168 300')+seam('M167 315L179 315');break;
  case 'square-over':
   base=path(body,c.lining,4.5);collar=cross('#ede0c7');
   overlay=path('M119 251L137 271V292H183V271L201 251Q225 260 240 275L244 326H76L80 275Q98 260 119 251Z',c.base,3.6)
    +path('M119 251L132 271V298H188V271L201 251L195 249L181 270V288H139V270L125 248Z',c.edge,2.5);
   detail=seam('M101 280L104 326M219 280L216 326',2);break;
  case 'deep-wrap':
   collar=cross(c.edge,true);detail=seam('M179 305L199 326')+seam('M94 280L83 326M234 278L246 326',2);break;
  case 'shoulder-vest':
   base=path(body,c.lining,4.5);collar=cross('#dfd6b8');
   overlay=path('M129 246Q105 251 88 261L74 284L107 294L113 326H150L148 277Z',c.base,3.5)
    +path('M191 246Q215 251 232 261L246 284L213 294L207 326H170L172 277Z',c.base,3.5)
    +path('M128 247L147 276L152 326H142L138 280L120 250Z',c.edge,2.7)
    +path('M192 247L173 276L168 326H178L182 280L200 250Z',c.edge,2.7);
   detail=seam('M90 276L110 282M230 276L210 282',2)+tie(297);break;
  case 'slant':
   collar=path('M135 238Q160 254 185 238L190 251Q182 267 167 270L197 289L246 302L253 315L190 302Q158 287 134 264L129 250Z',c.edge,3)
    +path('M140 239Q160 251 180 239L182 251Q160 266 138 251Z',c.lining,2.5);
   detail=seam('M239 308L228 326')+path('M83 294L106 298L103 320L79 314Z','#b7b79a',2);break;
  case 'narrow-wrap':
   collar=cross(c.edge,true);
   detail=seam('M199 270Q211 289 207 322',2);break;
  case 'collarless':
   base=path(body,c.lining,4.5);
   collar=path('M136 239Q160 254 184 239L187 253Q160 271 133 253Z','#d4ceb1',2.7);
   overlay=path('M121 250Q111 261 108 281L108 326H140V285L145 265Z',c.base,3.2)
    +path('M199 250Q209 261 212 281L212 326H180V285L175 265Z',c.base,3.2);
   detail=seam('M125 281V326M195 281V326',2);break;
  case 'double-edge':
   base+=inner();
   collar=path('M134 238L128 253L142 283V326H159V279Q154 253 144 239Z',c.edge,3)
    +path('M186 238L192 253L178 283V326H161V279Q166 253 176 239Z',c.edge,3);
   overlay=l('M138 250L151 281V326M182 250L169 281V326',c.lining,3);
   detail=tie(290)+tie(314);break;
  case 'short-vest':
   base=path(body,c.lining,4.5);collar=path('M135 238Q160 255 185 238L191 253Q180 275 160 277Q140 275 129 253Z','#e6d8b9',2.8);
   overlay=path('M126 249L111 253L97 270L104 326H150L148 282Z',c.base,3.4)
    +path('M194 249L209 253L223 270L216 326H170L172 282Z',c.base,3.4)
    +path('M126 249L148 272L157 288V326H146L141 283L118 254Z',c.edge,2.6)
    +path('M194 249L172 272L163 288V326H174L179 283L202 254Z',c.edge,2.6);
   detail=tie(305);break;
  case 'folded':
   base+=inner();collar=path('M180 237L185 250L166 270L156 261Z',c.lining,2.7)
    +path('M140 237L135 250Q151 267 179 286L188 274Q160 257 140 237Z',c.lining,2.7);
   overlay=path('M135 239L116 254L132 281L150 293L158 279L143 258Z',c.edge,3)
    +path('M185 239L204 254L188 281L170 293L162 279L177 258Z',c.edge,3)
    +path('M150 292L158 280L163 301L165 326H152Z',c.base,2.8);
   detail=seam('M136 263L150 280M184 263L170 280',1.8)+tie(313);break;
  case 'side-front':
   collar=path('M134 239Q160 255 186 239L191 253Q187 265 180 270L220 284L232 291L223 303L177 283Q144 279 130 256Z',c.edge,3)
    +path('M140 239Q160 251 180 239L183 253Q160 268 137 253Z',c.lining,2.6);
   detail=seam('M223 303L218 326',2.5)+l('M216 289Q227 282 231 289Q231 295 220 295',c.lining,2.7);break;
  case 'cape':
   base=path(body,c.lining,4.5);collar=cross('#e5d6b8');
   overlay=path('M135 239Q116 249 93 253Q49 260 25 293Q68 308 111 310L143 285L149 259Z',c.base,3.7)
    +path('M185 239Q204 249 227 253Q271 260 295 293Q252 308 209 310L177 285L171 259Z',c.base,3.7)
    +path('M132 242L139 258L133 280L108 300Q60 300 25 293L111 310L143 285L149 259Z',c.edge,2.5)
    +path('M188 242L181 258L187 280L212 300Q260 300 295 293L209 310L177 285L171 259Z',c.edge,2.5);
   detail=l('M144 264Q159 275 175 264',c.lining,3);break;
  case 'wrap-coat':
   collar=path('M181 238L198 257L181 291L157 278Z',c.lining,3)
    +path('M137 237L120 255Q139 284 169 304L204 326H239L183 288Q155 268 137 237Z',c.edge,3.5);
   detail=seam('M112 282L91 326M223 277L242 326',2.3);break;
  case 'shawl':
   collar=path('M180 237L185 250L166 270L156 261Z',c.lining,2.7)
    +path('M140 237L135 250Q151 267 179 286L188 274Q160 257 140 237Z',c.lining,2.7);
   // 披帛是连续宽布面，不是胸前悬空的几条折线。
   overlay=path('M193 244Q225 252 244 280L263 326H224L212 293Q153 290 91 318L79 326H42L60 299Q107 273 172 276L196 268Z',c.edge,3.5)
    +path('M193 244Q215 251 226 267L210 287Q152 286 91 312L71 326H48L66 299Q118 272 174 276L195 268Z',c.lining,2.8);
   detail=l('M84 298Q143 279 207 282',c.base,2.4,.6);break;
  case 'high-coat':
   base+=inner();collar=path('M134 238L131 254L147 281L147 326H163V277Q152 254 146 239Z',c.edge,3)
    +path('M186 238L190 258L177 279L170 326H158L161 276Q170 254 176 239Z',c.edge,3);
   overlay=path('M136 239Q128 240 126 251Q128 268 141 284L151 278Q142 261 143 242Z',c.lining,2.8)
    +path('M184 239Q192 240 194 251Q192 268 179 284L169 278Q178 261 177 242Z',c.lining,2.8);
   detail=tie(296)+tie(317);break;
 }
 return `<g data-theme-wardrobe="8d1" data-wardrobe-cut="${c.cut}">${outfitPart('base',base)+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail)}</g>`;
}
