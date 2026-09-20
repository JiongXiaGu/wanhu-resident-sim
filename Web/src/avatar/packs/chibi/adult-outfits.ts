import type {Frame} from '../../model';
import type {OutfitId} from './catalog';
import {outfitPart} from './art-spec';
import {sampleOutfit} from './sample-outfits';
import {OUTLINE,isFemale,l,p} from './drawing';

type Cut='work'|'open'|'scholar'|'jacket'|'short'|'round'|'padded'|'service'|'vest';
type Paint={base:string;edge:string;ink:string;lining:string;cut:Cut};
const paints:Partial<Record<OutfitId,Paint>>={
 laborer:{base:'#929779',edge:'#657052',ink:'#657052',lining:'#ddd3b7',cut:'work'},
 merchant:{base:'#a28a70',edge:'#695442',ink:'#695442',lining:'#e8d6b5',cut:'open'},
 scholar:{base:'#91a29e',edge:'#e9dfc9',ink:'#607b73',lining:'#f3ead7',cut:'scholar'},
 'adult-female-work':{base:'#81927b',edge:'#576d59',ink:'#576d59',lining:'#d8d2b7',cut:'jacket'},
 'adult-male-short-robe':{base:'#a39778',edge:'#70694f',ink:'#70694f',lining:'#e7d9bd',cut:'short'},
 'adult-male-long-robe':{base:'#7d9285',edge:'#4e6859',ink:'#4e6859',lining:'#e5dac0',cut:'round'},
 'adult-winter-coat':{base:'#8a96a1',edge:'#dfd4bf',ink:'#5c6c7a',lining:'#f1e4ca',cut:'padded'},
 'adult-service-robe':{base:'#8292a7',edge:'#475d76',ink:'#475d76',lining:'#d9d9c7',cut:'service'},
 'adult-shop-assistant':{base:'#a08773',edge:'#715b4c',ink:'#715b4c',lining:'#ddd2b9',cut:'vest'},
};
// 两个成年 Frame 的正常 / 劳作 / 夹棉肩形。固定作者画稿，不按 Face 求解。
const shoulders={
 female:[
  'M140 237Q126 249 108 255Q77 265 59 289L40 326H280L261 289Q243 265 212 255Q194 249 180 237Q160 251 140 237Z',
  'M140 237Q126 249 110 255Q83 265 67 286L50 326H270L253 286Q237 265 210 255Q194 249 180 237Q160 251 140 237Z',
  'M137 237Q120 250 103 256Q69 267 51 294L34 326H286L269 294Q251 267 217 256Q200 250 183 237Q160 252 137 237Z',
 ],
 male:[
  'M136 237Q119 249 97 255Q57 265 37 290L20 326H300L283 290Q263 265 223 255Q201 249 184 237Q160 253 136 237Z',
  'M138 237Q122 249 102 255Q68 265 49 288L32 326H288L271 288Q252 265 218 255Q198 249 182 237Q160 252 138 237Z',
  'M134 237Q113 249 91 256Q49 269 30 297L15 326H305L290 297Q271 269 229 256Q207 249 186 237Q160 254 134 237Z',
 ],
} as const;

export function adultOutfit(frame:Frame,id:OutfitId):string{
 if(!frame.endsWith('adult'))throw new Error(`Adult Outfit cannot render in ${frame}`);
 const sample=sampleOutfit(frame,id);if(sample)return sample;
 const c=paints[id];if(!c)throw new Error(`Unavailable adult Outfit ${frame}/${id}`);
 const female=isFemale(frame),profile=c.cut==='padded'?2:['work','jacket','short'].includes(c.cut)?1:0;
 const body=shoulders[female?'female':'male'][profile];
 let base=p(body,c.base,OUTLINE,4.5),collar='',overlay='',detail='';
 // 两个系结都有明确落点；不用挤在中央的碎布条表达门襟。
 const fastening=(y:number,color:string)=>l(`M150 ${y}Q151 ${y-5} 156 ${y-3}L168 ${y}Q173 ${y+1} 173 ${y-3}Q172 ${y-6} 169 ${y-3}L154 ${y}`,color,2.8);
 const cross=(edge:string,wide=false)=>p('M180 237Q185 245 191 251L169 276L156 264Z',edge,OUTLINE,2.8)
  +p(wide?'M140 237L131 250Q150 271 174 286L225 326H249L181 278Q156 257 140 237Z'
   :'M140 237L135 249Q153 268 174 281L230 326H243L180 276Q155 257 140 237Z',edge,OUTLINE,2.8);
 switch(c.cut){
  case 'work':
  case 'short':
   collar=cross(c.edge);
   // 短袍是干净侧襟；劳作短褐保留一处低对比补缀，轮廓不靠补丁识别。
   if(c.cut==='work')overlay=p('M91 299L114 294L122 320L99 325Z',c.lining,c.ink,2);
   detail=l('M182 288L230 326',c.ink,1.8,.55);
   break;
  case 'scholar':
   collar=cross(c.edge,true);
   detail=l('M143 253Q157 270 179 283L235 326',c.ink,1.6,.6);
   break;
  case 'round':
  case 'service':
   collar=p('M135 238Q160 253 185 238L192 254Q186 272 160 275Q135 272 128 254Z',c.edge,OUTLINE,2.8)
    +p('M140 239Q160 251 180 239L183 253Q160 268 137 253Z',c.lining,OUTLINE,2.5);
   detail=l(c.cut==='service'?'M184 264Q197 276 197 294V326':'M184 264Q190 281 189 301L191 326',c.ink,2.5)
    +l(c.cut==='service'?'M193 283Q202 276 207 282Q209 287 198 287':'M187 284Q198 278 200 284Q199 290 188 288',c.ink,2.4);
   // 不画胸牌、肩章或现代制服横块；城务感来自圆领和偏侧闭合。
   break;
  case 'open':
   base+=p('M142 239Q160 252 178 239L163 274H157Z',c.lining,OUTLINE,2.5);
   collar=p('M137 238Q142 256 148 271L147 326H159V275Q154 253 145 239Z',c.edge,OUTLINE,2.7)
    +p('M183 238Q178 256 172 271L173 326H161V275Q166 253 175 239Z',c.edge,OUTLINE,2.7);
   detail=fastening(286,c.lining)+fastening(310,c.lining);
   break;
  case 'jacket':
   // 内衫只在开口中形成一个连续面积；外短褂肩线与主衣片相接。
   base+=p('M137 239Q160 253 183 239L184 326H136Z',c.lining,OUTLINE,2.4);
   collar=p('M180 238L185 251L166 270L157 261Z','#ece1c8',OUTLINE,2.6)
    +p('M140 238L135 250Q154 269 182 287L189 276Q160 259 140 238Z','#ece1c8',OUTLINE,2.6);
   overlay=p('M129 248Q139 261 146 283L146 326H134L134 286Q130 265 120 253Z',c.edge,OUTLINE,2.6)
    +p('M191 248Q181 261 174 283L174 326H186L186 286Q190 265 200 253Z',c.edge,OUTLINE,2.6);
   detail=fastening(303,c.edge);
   break;
  case 'padded':
   // 夹棉领宽而短，左右折边沿门襟连续到底，不再交叉成围脖。
   base+=p('M142 239Q160 252 178 239L163 274H157Z',c.lining,OUTLINE,2.5);
   collar=p('M133 238Q137 255 147 271L147 326H159V273Q152 252 143 239Z',c.edge,OUTLINE,3)
    +p('M187 238Q183 255 173 271L173 326H161V273Q168 252 177 239Z',c.edge,OUTLINE,3);
   detail=fastening(284,c.ink)+fastening(310,c.ink)
    +l(female?'M82 288Q88 307 96 325M238 288Q232 307 224 325':'M65 288Q76 306 84 325M255 288Q244 306 236 325',c.ink,2.7,.5);
   break;
  case 'vest':
   // 店伙的无袖短褂压住内衫襟端；没有悬空围裙吊带和胸前腰带。
   base=p(body,c.lining,OUTLINE,4.5);
   collar=p('M181 237L189 249L165 275L154 263Z','#eee3cc',OUTLINE,2.6)
    +p('M139 237L132 249Q150 271 179 287L185 277Q157 258 139 237Z','#eee3cc',OUTLINE,2.6);
   overlay=p('M124 250Q109 255 94 269L85 326H145L143 282Q136 260 124 250Z',c.base,OUTLINE,3)
    +p('M196 250Q211 255 226 269L235 326H175L177 282Q184 260 196 250Z',c.base,OUTLINE,3)
    +p('M124 250Q139 263 151 282L153 326H143L141 284Q134 265 118 254Z',c.edge,OUTLINE,2.4)
    +p('M196 250Q181 263 169 282L167 326H177L179 284Q186 265 202 254Z',c.edge,OUTLINE,2.4);
   break;
 }
 if(c.cut!=='padded')detail+=l(female?'M78 293Q88 307 92 323M242 293Q232 307 228 323':'M60 293Q76 306 82 323M260 293Q244 306 238 323',c.ink,2,.45);
 return `<g data-adult-wardrobe="phase8b2" data-wardrobe-cut="${c.cut}">${outfitPart('base',base)+outfitPart('collar',collar)+outfitPart('overlay',overlay)+outfitPart('detail',detail)}</g>`;
}
