import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {OUTLINE,isFemale,p,l} from './drawing';

// 8A 成年样板保持逐字节相同的 Renderer 输出；不保留已被 8B2 替换的旧分支。
export function sampleOutfit(frame:Frame,id:OutfitId):string|undefined{
 const paints={
  commoner:{base:'#b89773',trim:'#f1dfbe',accent:'#8f7354'},
  artisan:{base:'#87927c',trim:'#e4d7bb',accent:'#596d5c'},
  'adult-female-ruqun':{base:'#b58985',trim:'#f2e4ca',accent:'#775c62'},
 };
 if(!(id in paints))return undefined;
 const c=paints[id as keyof typeof paints];
 const body=isFemale(frame)
  ?'M140 237Q125 249 108 254Q76 264 56 290L39 324H281L264 290Q244 264 212 254Q195 249 180 237Q160 251 140 237Z'
  :'M136 237Q119 248 96 253Q54 262 33 288L18 324H302L287 288Q266 262 224 253Q201 248 184 237Q160 253 136 237Z';
 const base=outfitPart('base',p(body,c.base,OUTLINE,4.5));
 const collar=p('M180 237Q185 244 191 250L168 275L155 263Z',c.trim,OUTLINE,3)
  +p('M140 236Q137 244 132 249Q147 265 165 277L224 326H246L178 273Q154 255 140 236Z',c.trim,OUTLINE,3);
 let overlay='',detail=l('M141 248Q157 267 176 278L232 325',c.accent,1.7,.5);
 if(id==='adult-female-ruqun')detail+=l('M212 302Q204 291 202 299Q207 305 213 303M213 303Q224 293 225 300Q221 306 213 303',c.accent,2.2);
 if(id==='artisan'){
  overlay=p('M99 296L118 292L125 314L103 318Z','#a5ad95',c.accent,2);
  detail+=l('M105 296L106 300M113 294L114 298M120 305L116 306M116 314L115 310M105 313L109 312',c.accent,1.4,.65);
 }
 if(id!=='adult-female-ruqun')detail+=l('M73 293Q86 300 91 319M247 293Q234 300 229 319',c.accent,2.1,.52);
 return base+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail);
}
