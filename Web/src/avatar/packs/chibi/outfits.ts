import {ageOutfit} from './age-outfits';
import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {OUTLINE,isChild,isElder,isFemale,p,l} from './drawing';

// 固定版型的画稿配色表，不是玩家分类、换装 slot 或自动适配器。
// 身份首先由交领 / 圆领 / 袄领 / 围襟的大形区分，不再画两片现代翻领加中央“领带”。
type Paint={base:string;trim:string;accent:string;cut:'cross'|'round'|'warm'|'apron'|'ruqun';edge?:boolean};
const paint:Partial<Record<OutfitId,Paint>>={
 commoner:{base:'#b89773',trim:'#f1dfbe',accent:'#8f7354',cut:'cross'},
 laborer:{base:'#8b9278',trim:'#ded2af',accent:'#626b56',cut:'cross',edge:true},
 merchant:{base:'#987b64',trim:'#dfc69f',accent:'#654e3d',cut:'round',edge:true},
 scholar:{base:'#8b9f9a',trim:'#f0e6d3',accent:'#566d68',cut:'cross',edge:true},
 artisan:{base:'#87927c',trim:'#e4d7bb',accent:'#596d5c',cut:'cross'},
 'adult-female-ruqun':{base:'#b58985',trim:'#f2e4ca',accent:'#775c62',cut:'ruqun'},
 'adult-female-work':{base:'#92a18b',trim:'#eee1bf',accent:'#627865',cut:'cross',edge:true},
 'adult-male-short-robe':{base:'#9a9979',trim:'#e9dabb',accent:'#666b54',cut:'cross'},
 'adult-male-long-robe':{base:'#778982',trim:'#ebdfc5',accent:'#485f56',cut:'cross',edge:true},
 'adult-winter-coat':{base:'#879394',trim:'#eaddc8',accent:'#57696e',cut:'warm'},
 'adult-service-robe':{base:'#7d8a9a',trim:'#b8c1bc',accent:'#4b596c',cut:'round',edge:true},
 'adult-shop-assistant':{base:'#9e8d7d',trim:'#e9ddc7',accent:'#6d6257',cut:'apron'},
};

export function outfitArt(frame:Frame,id:OutfitId):string{
 if(id.startsWith('child-')||id.startsWith('elder-'))return ageOutfit(frame,id);
 const colors=paint[id];
 if(!colors)throw new Error(`Outfit ${id} is compatibility-only and must be fitted to the current Frame before rendering.`);
 const child=isChild(frame),elder=isElder(frame),female=isFemale(frame);
 // 六 Frame 的静态肩形；头颈接缝被完整衣领承接。老人肩线更缓，女性更圆，男性更平阔。
 const body=child
  ?female?'M140 237Q125 250 107 256Q81 264 68 284L54 324H266L252 284Q239 264 213 256Q195 250 180 237Q160 250 140 237Z'
         :'M138 237Q123 249 102 254Q72 261 58 283L42 324H278L262 283Q248 261 218 254Q197 249 182 237Q160 251 138 237Z'
  :elder
   ?female?'M140 242Q127 254 109 261Q83 271 68 293L45 324H275L252 293Q237 271 211 261Q193 254 180 242Q160 253 140 242Z'
          :'M137 242Q119 254 99 259Q70 270 53 291L31 324H289L267 291Q250 270 221 259Q201 254 183 242Q160 255 137 242Z'
   :female?'M140 237Q125 249 108 254Q76 264 56 290L39 324H281L264 290Q244 264 212 254Q195 249 180 237Q160 251 140 237Z'
          :'M136 237Q119 248 96 253Q54 262 33 288L18 324H302L287 288Q266 262 224 253Q201 248 184 237Q160 253 136 237Z';
 const y=child?-1:elder?3:0;
 const base=outfitPart('base',p(body,colors.base,OUTLINE,4.5));
 let collar='',overlay='',detail='';
 if(colors.cut==='round'){
  collar=p(`M136 ${239+y}Q160 ${253+y} 184 ${239+y}L187 ${251+y}Q160 ${270+y} 133 ${251+y}Z`,colors.trim,OUTLINE,3);
  detail=l(`M169 ${263+y}L169 324`,colors.accent,3)+l('M168 281H183M168 300H183',colors.accent,3.5);
  if(colors.edge)overlay=p('M181 277H220V292H181Z',colors.accent,'none',0,.8)+l('M186 282H214',colors.trim,2,.7);
 }else{
  // 胸像只到胸口，不画腰带/裙腰。前襟连续延伸到画布之外，不留下悬空白色三角。
  collar=p(`M180 ${237+y}Q185 ${244+y} 191 ${250+y}L168 ${275+y}L155 ${263+y}Z`,colors.trim,OUTLINE,3);
  collar+=p(`M140 ${236+y}Q137 ${244+y} 132 ${249+y}Q147 ${265+y} 165 ${277+y}L224 326H246L178 ${273+y}Q154 ${255+y} 140 ${236+y}Z`,colors.trim,OUTLINE,3);
  detail=l(`M141 ${248+y}Q157 ${267+y} 176 ${278+y}L232 325`,colors.accent,1.7,.5);
  if(colors.cut==='warm'){
   // 夹袄是贴颈的宽圆折边，不是长领带。肩线仍使用这个 Frame 的基础画稿。
   collar=p(`M132 ${238+y}Q160 ${250+y} 188 ${238+y}L198 ${254+y}Q181 ${270+y} 160 ${280+y}L124 ${258+y}Z`,colors.trim,OUTLINE,3.2)
     +p(`M132 ${238+y}Q146 ${254+y} 162 ${264+y}L221 308L210 323L134 ${272+y}Q122 ${260+y} 121 ${252+y}Z`,colors.trim,OUTLINE,3.2);
   detail=l(`M131 ${253+y}Q143 ${267+y} 160 ${276+y}L210 314`,colors.accent,2,.52)
     +l('M206 291H221M205 297H218',colors.accent,3);
   if(colors.edge)detail+=l('M85 294L95 322M245 294L235 322',colors.accent,2,.46);
  }
  if(colors.cut==='apron'){
   overlay=p('M122 286Q154 294 196 286L207 324H111Z',colors.accent,OUTLINE,2.7)
     +l('M116 272L127 288M197 274L191 288',colors.accent,7);
   detail=l('M129 297Q158 302 188 297',colors.trim,2,.7)+l('M140 309H175',OUTLINE,1.8,.4);
  }
  if(colors.cut==='ruqun'){
   // 交领短襦：只保留胸前斜襟及一枚小系结。旧底部裙腰挡板已删除。
   detail+=l('M212 302Q204 291 202 299Q207 305 213 303M213 303Q224 293 225 300Q221 306 213 303',colors.accent,2.2);
  }else if(colors.edge&&colors.cut==='cross'){
   detail+=l('M100 292L108 320M233 291L225 320',colors.accent,2.5,.62);
  }
 }
 if(id==='artisan'){overlay=p('M99 296L118 292L125 314L103 318Z','#a5ad95',colors.accent,2);detail+=l('M105 296L106 300M113 294L114 298M120 305L116 306M116 314L115 310M105 313L109 312',colors.accent,1.4,.65);}
 // 少量袖褶留在肩形内部，绝不再额外画两块脱离 body 的肩片。
 if(colors.cut!=='ruqun')detail+=l(child?'M84 291Q91 302 94 315M236 291Q229 302 226 315':'M73 293Q86 300 91 319M247 293Q234 300 229 319',colors.accent,2.1,.52);
 return base+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail);
}
