import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {OUTLINE,isChild,isElder,isFemale,l,p} from './drawing';

type Cut='cross'|'round'|'open'|'work'|'padded'|'square'|'vest';
type Paint={base:string;edge:string;ink:string;lining:string;cut:Cut};
// 版型是作者画稿分类，不进入 Recipe；同一个 ID 仍是一整件 Outfit。
const paints:Partial<Record<OutfitId,Paint>>={
 'child-short-robe':{base:'#b99873',edge:'#eedcba',ink:'#8b6d51',lining:'#f6e9cf',cut:'cross'},
 'child-apprentice':{base:'#839b99',edge:'#536d70',ink:'#536d70',lining:'#f0e3c8',cut:'round'},
 'child-play-jacket':{base:'#b98172',edge:'#854f47',ink:'#854f47',lining:'#e8d6b5',cut:'open'},
 'child-helper':{base:'#979b7f',edge:'#687358',ink:'#657051',lining:'#e1d5b6',cut:'work'},
 'child-winter':{base:'#79959b',edge:'#e2d6b9',ink:'#536e78',lining:'#eee1c7',cut:'padded'},
 'child-fine-robe':{base:'#a9869c',edge:'#775972',ink:'#78586c',lining:'#f0ddbb',cut:'square'},
 'elder-long-robe':{base:'#99927c',edge:'#e3d4b6',ink:'#716d55',lining:'#eddfc5',cut:'cross'},
 'elder-warm-coat':{base:'#9e8592',edge:'#6d5969',ink:'#6d5969',lining:'#dcd6be',cut:'vest'},
 'elder-simple-robe':{base:'#82968c',edge:'#52695f',ink:'#52695f',lining:'#e0d5b9',cut:'round'},
 'elder-work-jacket':{base:'#929374',edge:'#5d6c51',ink:'#5d6c51',lining:'#ded2b2',cut:'work'},
 'elder-padded-robe':{base:'#7f8a9b',edge:'#d6ccba',ink:'#546378',lining:'#e8dcc5',cut:'padded'},
 'elder-fine-robe':{base:'#9e7768',edge:'#67493f',ink:'#67493f',lining:'#e5d2ad',cut:'open'},
};

// 正常、宽松外搭、夹棉三种肩形各有固定男女/年龄画稿；不随 Face 变化。
const bodies={
 'female.child':[
  'M140 237Q125 250 107 256Q81 264 68 284L54 326H266L252 284Q239 264 213 256Q195 250 180 237Q160 250 140 237Z',
  'M140 237Q124 250 101 256Q78 264 63 283L48 326H272L257 283Q242 264 219 256Q196 250 180 237Q160 250 140 237Z',
  'M138 237Q122 249 102 254Q72 264 62 287L48 326H272L258 287Q248 264 218 254Q198 249 182 237Q160 251 138 237Z',
 ],
 'male.child':[
  'M138 237Q123 249 102 254Q72 261 58 283L42 326H278L262 283Q248 261 218 254Q197 249 182 237Q160 251 138 237Z',
  'M138 237Q121 249 97 254Q69 263 55 282L38 326H282L265 282Q251 263 223 254Q199 249 182 237Q160 251 138 237Z',
  'M137 237Q120 249 98 253Q65 262 55 286L39 326H281L265 286Q255 262 222 253Q200 249 183 237Q160 251 137 237Z',
 ],
 'female.elder':[
  'M140 242Q127 254 109 261Q83 271 68 293L45 326H275L252 293Q237 271 211 261Q193 254 180 242Q160 253 140 242Z',
  'M140 242Q126 255 103 262Q77 272 62 295L40 326H280L258 295Q243 272 217 262Q194 255 180 242Q160 253 140 242Z',
  'M138 242Q121 255 101 261Q71 275 60 296L40 326H280L260 296Q249 275 219 261Q199 255 182 242Q160 254 138 242Z',
 ],
 'male.elder':[
  'M137 242Q119 254 99 259Q70 270 53 291L31 326H289L267 291Q250 270 221 259Q201 254 183 242Q160 255 137 242Z',
  'M137 242Q117 255 94 261Q64 273 48 294L25 326H295L272 294Q256 273 226 261Q203 255 183 242Q160 255 137 242Z',
  'M135 242Q114 254 94 260Q63 273 49 296L28 326H292L271 296Q257 273 226 260Q206 254 185 242Q160 256 135 242Z',
 ],
} as const;
type AgeFrame=keyof typeof bodies;

export function ageOutfit(frame:Frame,id:OutfitId):string{
 if(!isChild(frame)&&!isElder(frame))throw new Error(`Age Outfit cannot render in ${frame}`);
 const c=paints[id];
 if(!c||(isChild(frame)!==id.startsWith('child-')))throw new Error(`Unavailable age Outfit ${frame}/${id}`);
 const child=isChild(frame),female=isFemale(frame),y=child?0:5;
 const profile=c.cut==='padded'?2:c.cut==='open'&&child?0:['open','vest','square'].includes(c.cut)?1:0;
 const body=bodies[frame as AgeFrame][profile];
 let base=p(body,c.base,OUTLINE,4.5),collar='',overlay='',detail='';
 // 普通交领：右片先画、左片覆盖，斜襟贯通底边；不画胸口以下的裙腰和腰带。
 const cross=(edge:string,narrow=false)=>p(`M181 ${237+y}Q185 ${246+y} 191 ${251+y}L168 ${275+y}L156 ${263+y}Z`,edge,OUTLINE,2.8)
  +p(narrow
   ?`M139 ${237+y}L135 ${249+y}Q153 ${268+y} 173 ${280+y}L226 326H240L178 ${275+y}Q155 ${257+y} 139 ${237+y}Z`
   :`M139 ${237+y}L132 ${249+y}Q152 ${270+y} 171 ${282+y}L225 326H246L179 ${275+y}Q154 ${255+y} 139 ${237+y}Z`,edge,OUTLINE,2.8);
 const ties=(cx:number,cy:number,color:string)=>l(`M${cx-2} ${cy}Q${cx-11} ${cy-8} ${cx-12} ${cy-3}Q${cx-11} ${cy+2} ${cx-2} ${cy}M${cx+2} ${cy}Q${cx+11} ${cy-8} ${cx+12} ${cy-3}Q${cx+11} ${cy+2} ${cx+2} ${cy}M${cx-2} ${cy}H${cx+2}`,color,2.4);
 switch(c.cut){
  case 'cross':
   collar=cross(c.edge);
   detail=l(`M144 ${252+y}Q159 ${269+y} 178 ${282+y}L233 326`,c.ink,1.6,.65);
   break;
  case 'round':
   // 团领是一整圈领缘，侧开襟沿衣片延伸，不画现代胸牌或领带。
   collar=p(`M136 ${237+y}Q160 ${251+y} 184 ${237+y}L191 ${254+y}Q187 ${272+y} 161 ${274+y}Q133 ${271+y} 129 ${254+y}Z`,c.edge,OUTLINE,2.8)
    +p(`M140 ${238+y}Q160 ${250+y} 180 ${238+y}L183 ${253+y}Q160 ${271+y} 137 ${253+y}Z`,c.lining,OUTLINE,2.5);
   detail=l(`M184 ${264+y}Q191 ${278+y} 196 299L202 326`,c.ink,2.3,.9)+ties(191,284+y,c.ink);
   break;
  case 'open':
   if(child){
    // 8B2：窄肩小褂 + 内衫，交领收在中央，外缘从肩头圆顺地转入前片。
    base+=p('M137 239Q160 252 183 239L181 326H139Z',c.lining,OUTLINE,2.5);
    collar=p('M180 238L185 250L162 273L152 263Z','#f1e5ca',OUTLINE,2.5)
     +p('M140 238L135 250Q152 268 179 285L186 276Q159 258 140 238Z','#f1e5ca',OUTLINE,2.5);
    overlay=p('M131 247Q141 261 148 281L149 326H138L137 284Q132 264 122 252Z',c.edge,OUTLINE,2.6)
     +p('M189 247Q179 261 172 281L171 326H182L183 284Q188 264 198 252Z',c.edge,OUTLINE,2.6);
    detail=l('M147 298Q150 294 156 297L171 298M147 318Q150 314 156 317L171 318',c.edge,2.5);
   }else{
    // 宽缘对襟：左右衣片在中缝闭合，浅色内衫只留在领口，不形成细长领带。
    base+=p('M142 244Q160 257 178 244L163 279H157Z',c.lining,OUTLINE,2.5);
    collar=p('M137 243Q142 261 148 276L147 326H159V280Q154 258 145 244Z',c.edge,OUTLINE,2.7)
     +p('M183 243Q178 261 172 276L173 326H161V280Q166 258 175 244Z',c.edge,OUTLINE,2.7);
    detail=l('M150 290Q151 285 156 287L168 290Q173 291 173 287Q172 284 169 287L154 290M150 313Q151 308 156 310L168 313Q173 314 173 310Q172 307 169 310L154 313',c.lining,2.8);
   }
   break;
  case 'work':
   collar=cross(c.edge,true);
   overlay=p(child?'M91 294L111 289L119 315L98 320Z':'M84 296L108 289L118 319L93 326Z',c.lining,c.ink,2);
   detail=l(child?'M96 297L100 299M104 294L105 299M113 306L109 308M103 315L105 311':'M90 297L93 303M103 295L103 301M112 309L107 311M98 319L101 314',c.ink,1.6,.8)
    +l(`M182 ${282+y}L231 326`,c.ink,2,.6);
   break;
  case 'padded':
   // 短圆领、对襟棉袄：外缘和中央扣结清晰，取消双层巨大交叉围脖。
   collar=p(`M135 ${237+y}Q160 ${250+y} 185 ${237+y}Q189 ${243+y} 194 ${254+y}Q186 ${270+y} 160 ${275+y}Q134 ${270+y} 126 ${254+y}Q131 ${243+y} 135 ${237+y}Z`,c.edge,OUTLINE,3)
    +p(`M142 ${238+y}Q160 ${250+y} 178 ${238+y}L181 ${253+y}Q160 ${265+y} 139 ${253+y}Z`,c.lining,OUTLINE,2.6);
   overlay=p(`M155 ${276+y}H165V326H155Z`,c.edge,'none',0);
   detail=ties(160,287+y,c.ink)+ties(160,308+y,c.ink)
    +l(child?'M90 284Q94 303 99 324M230 284Q226 303 221 324':'M81 289Q88 308 95 324M239 289Q232 308 225 324',c.ink,2.6,.55);
   break;
  case 'square':
   // 锦边罩衣：连贯方领与内衫三角，不把底部画成裙腰挡板。
   base+=p(`M137 ${239+y}Q160 ${250+y} 183 ${239+y}L186 ${278+y}H134Z`,c.lining,OUTLINE,2.6);
   collar=p(`M137 ${237+y}L128 ${250+y}L128 ${283+y}H192L192 ${250+y}L183 ${237+y}L181 ${269+y}H139Z`,c.edge,OUTLINE,2.8)
    +l(`M134 ${253+y}V${277+y}H186V${253+y}`,c.lining,2.4);
   detail=ties(206,297,c.edge)+l('M110 298Q103 306 110 311Q117 306 110 298M210 300Q203 308 210 313Q217 308 210 300',c.lining,2,.85);
   break;
  case 'vest':
   // 8B2：交领止于罩衣之下，不再贯穿袖片；无中央悬空系结。
   base=p(body,c.lining,OUTLINE,4.5);
   collar=p('M181 242L189 254L167 280L155 267Z','#ebe1c9',OUTLINE,2.7)
    +p('M139 242L132 254Q149 275 181 293L189 282Q157 262 139 242Z','#ebe1c9',OUTLINE,2.7);
   overlay=p('M125 256Q109 262 98 276L92 326H146L143 287Q136 267 125 256Z',c.base,OUTLINE,3)
    +p('M195 256Q211 262 222 276L228 326H174L177 287Q184 267 195 256Z',c.base,OUTLINE,3)
    +p('M125 256Q139 269 151 287L153 326H143L141 289Q134 271 119 260Z',c.edge,OUTLINE,2.4)
    +p('M195 256Q181 269 169 287L167 326H177L179 289Q186 271 201 260Z',c.edge,OUTLINE,2.4);
   detail=l('M108 286L107 316M212 286L213 316',c.edge,2,.45);
   break;
 }
 // 只保留肩内少量折线，缩小时不依赖高频装饰识别。
 if(!['padded','vest'].includes(c.cut))detail+=l(child
  ?'M78 291Q87 302 90 318M242 291Q233 302 230 318'
  :female?'M77 297Q86 307 89 321M243 297Q234 307 231 321':'M63 295Q77 306 81 322M257 295Q243 306 239 322',c.ink,2,.48);
 return `<g data-age-wardrobe="phase8b" data-wardrobe-cut="${c.cut}">${outfitPart('base',base)+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail)}</g>`;
}
