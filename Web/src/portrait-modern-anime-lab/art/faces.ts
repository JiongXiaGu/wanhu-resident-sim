import type {Look,FaceId,Frame} from '../model';
import {p,l,e,both,group,skinColors,hairColors} from './drawing';
const outlines:Record<Frame,Record<FaceId,string>>={
 female:{
  luminous:'M157 158C155 118 199 92 254 94C306 91 354 115 355 155L355 220Q351 265 329 287Q307 306 276 330Q256 345 239 333Q212 313 183 291Q160 271 157 230Z',
  refined:'M160 155C159 119 201 93 256 94C310 93 352 120 352 155L350 218Q346 256 325 283Q305 307 273 333Q256 349 240 335Q210 309 189 285Q166 259 162 221Z',
  resolute:'M157 155C156 118 201 92 256 94C310 92 355 118 355 155L357 218L349 254Q344 273 326 289L291 322Q273 340 256 341Q240 340 222 324L186 290Q169 276 163 256L156 221Z',
 },
 male:{
  luminous:'M155 156C154 116 200 92 256 94C310 92 357 115 357 156L359 216L350 260Q346 282 323 302L281 341Q266 351 256 351Q245 351 231 342L190 303Q168 283 164 261L153 219Z',
  refined:'M159 153C158 116 202 92 256 94C311 93 354 116 353 153L351 219L343 260Q338 282 315 305L280 340Q264 357 256 357Q245 357 231 343L197 308Q176 285 169 260L160 219Z',
  resolute:'M155 155C155 117 199 93 256 94C313 92 357 116 357 155L361 220L351 264L340 292L301 328L278 346Q266 354 256 354L236 349L211 332L174 294L161 264L151 222Z',
 }
};
// 固定作者坐标；不是运行时按头发/脸型搜索锚点。
const eyeShapes:Record<Frame,Record<FaceId,{white:string;iris:string;upper:string;lower:string;cx:number;cy:number}>>={
 female:{
  luminous:{white:'M169 220Q182 202 201 204Q218 205 229 221Q216 238 198 239Q180 238 169 220Z',iris:'M191 210Q202 207 213 213L214 224Q213 235 202 237Q191 235 189 225Z',upper:'M164 214Q181 199 200 201Q218 202 230 221L227 224Q214 207 200 209Q182 208 171 224Z',lower:'M173 226Q189 243 207 238Q222 234 229 223',cx:202,cy:224},
  refined:{white:'M170 221Q184 207 204 209Q219 211 229 222Q216 237 200 237Q183 237 170 221Z',iris:'M193 212Q204 210 213 216L214 225Q212 235 202 236Q192 235 191 226Z',upper:'M166 218Q184 202 203 205Q220 207 230 222L228 225Q213 212 202 213Q184 211 172 224Z',lower:'M175 226Q188 240 204 237Q219 234 229 223',cx:203,cy:224},
  resolute:{white:'M166 212Q186 200 207 211L230 224Q213 239 197 237Q181 234 166 212Z',iris:'M190 211Q201 209 212 215L213 224Q211 234 201 236Q190 233 188 223Z',upper:'M162 205Q181 199 198 203Q216 207 232 225L228 227Q212 213 198 212Q179 205 168 216Z',lower:'M170 220Q186 240 204 237L229 224',cx:201,cy:223}
 },
 male:{
  luminous:{white:'M166 221Q184 207 204 212L229 225Q215 239 198 238Q179 235 166 221Z',iris:'M190 214Q204 208 214 219L214 229Q210 238 201 238Q190 236 188 228Z',upper:'M162 214Q183 203 202 208Q219 213 231 226L228 228Q212 216 200 216Q181 211 168 224Z',lower:'M174 229Q194 242 209 237L229 226',cx:201,cy:226},
  refined:{white:'M169 224Q188 210 207 215L230 227Q216 239 200 239Q184 237 169 224Z',iris:'M193 216Q205 212 215 222L214 231Q210 239 202 239Q192 236 191 228Z',upper:'M165 219Q185 208 203 211Q220 216 232 228L229 230Q211 219 201 219Q183 215 172 227Z',lower:'M176 232Q194 243 211 237L230 227',cx:203,cy:228},
  resolute:{white:'M165 215Q184 207 203 213L231 228Q214 241 197 238Q178 233 165 215Z',iris:'M190 216Q202 214 213 221L213 228Q210 236 201 237Q191 234 189 227Z',upper:'M160 207Q181 202 200 208Q218 214 233 230L229 232Q212 219 197 218Q180 210 168 220Z',lower:'M171 223Q188 242 207 237L231 228',cx:201,cy:226}
 }
};
export function faceBase(look:Look):string{
 const s=skinColors[look.skin];
 const ears=both(p('M162 226Q142 211 146 238Q151 265 169 265Z','url(#skin)',s.line,1.1)+l('M152 230Q164 228 158 247',s.shadow,2));
 const shadow=both(p('M160 228Q166 252 177 264L182 273Q168 265 164 251Z',s.shadow));
 return ears+p(outlines[look.frame][look.face],'url(#skin)',s.line,1.15)+shadow+
 both(e(190,265,34,18,'url(#cheek)',look.frame==='female'?.65:.25))+
 p('M255 255L252 264Q255 268 260 266L257 264Z',s.shadow)+l('M255 259L256 263',s.light,1.7,.8);
}
export function neckArt(look:Look):string{
 const s=skinColors[look.skin];
 return p('M214 305L210 356Q193 373 172 379L201 430L302 428L339 380Q312 369 302 354L299 305Z','url(#skin)',s.line,1.1)+
 p('M214 314Q254 354 299 314L302 348Q259 380 211 344Z',s.shadow)+
 p('M215 353Q255 373 298 352L303 369Q257 384 212 369Z',s.base)+
 l('M228 372L240 391M284 371L271 391',s.shadow,1.4,.7);
}
function eyeArt(look:Look):string{
 const female=look.frame==='female',shape=eyeShapes[look.frame][look.face],s=skinColors[look.skin];
 const ink=look.hairColor==='silver'?'#4f435b':'#302d3e';
 const eyebrow=look.hairColor==='silver'?'#878197':hairColors[look.hairColor].base;
 const mood=look.expression;
 const brow=mood==='focused'?p('M172 188Q191 188 221 200L222 205Q194 196 171 193Z',eyebrow):mood==='sad'?p('M171 199Q196 194 220 181L220 187Q199 199 173 203Z',eyebrow):p(female?'M175 189Q191 183 209 188L220 194L218 195Q197 187 177 192Z':'M173 188Q191 181 210 187L221 194L219 197Q197 188 175 193Z',eyebrow);
 if(mood==='laugh')return both(brow+
 l('M167 223Q187 202 210 213L229 227',s.shadow,6,.45)+
 p('M163 220Q185 204 203 211Q218 216 232 230Q211 218 200 218Q181 212 167 227Z',ink)+
 l('M167 219L161 211M174 215L170 209',ink,1.5)+l('M177 234Q198 245 217 235',s.line,1,.5));
 const under='<g opacity=".35">'+both(p('M168 210Q190 197 210 207L230 218Q215 200 197 199Q180 197 168 205Z',s.blush)+l('M177 198Q201 192 219 207',s.line,1,.55))+'</g>';
 // 虹膜使用吻合眼白的独立轮廓，非一个超出眼睑的大圆；不需要裁切/遮罩。
 const iris=p(shape.iris,'url(#iris)','#5c5365',.55)+e(shape.cx,shape.cy,3.8,9.4,'#363044',.8)+
 p(`M${shape.cx-9} ${shape.cy+2}Q${shape.cx-5} ${shape.cy+13} ${shape.cx+6} ${shape.cy+9}L${shape.cx+9} ${shape.cy+3}Q${shape.cx+2} ${shape.cy+7} ${shape.cx-9} ${shape.cy+2}Z`,'#f8e1aa')+
 e(shape.cx-4,shape.cy-7.5,3.6,3.1,'#fff9f0',.97)+e(shape.cx+7,shape.cy+7,2.1,1.8,'#ffffff',.88)+
 l(`M${shape.cx-8} ${shape.cy+5}L${shape.cx-6} ${shape.cy+8}M${shape.cx+6} ${shape.cy+5}L${shape.cx+4} ${shape.cy+9}`,'#fff0c4',.8,.8);
 const lash= female? l('M167 216L159 207M172 211L166 204',ink,1.7)+p('M169 217L159 218L166 222Z',ink):l('M165 217L159 214',ink,1.3);
 return under+both(brow+group('eye-white',p(shape.white,'url(#white)'))+group('iris',iris)+p(shape.upper,ink)+l(shape.lower,s.line,1.1,.85)+lash+
 l('M179 245L185 247M187 248L192 249',s.line,.7,.55));
}
export function expressionArt(look:Look):string{
 const female=look.frame==='female';
 // 深肤色使用更深的唇线和暖肤高光，避免闭口表情消失或出现白色下唇条。
 const skin=skinColors[look.skin];
 const lip=look.skin==='deep'?'#743c4b':look.skin==='warm'?'#915260':'#a26471';
 const cavity=look.skin==='deep'?'#693448':'#975165';
 const y=female?298:307,w=look.face==='refined'?15:19;
 let mouth='';
 switch(look.expression){
  case 'neutral':mouth=l(`M${256-w} ${y}Q256 ${y-1.5} ${256+w} ${y}`,lip,1.55)+l(`M250 ${y+8}Q256 ${y+10} 262 ${y+8}`,skin.light,1.8);break;
  case 'smile':mouth=l(`M${256-w} ${y-1}Q256 ${y+9} ${256+w} ${y-1}`,lip,1.8)+l(`M248 ${y+10}Q256 ${y+12} 264 ${y+10}`,skin.light,1.9);break;
  case 'happy':case 'laugh':mouth=p(`M${256-w} ${y-2}Q256 ${y+4} ${256+w} ${y-2}Q${256+w-2} ${y+20} 256 ${y+22}Q${256-w+2} ${y+20} ${256-w} ${y-2}Z`,cavity,lip,.8)+p(`M${258-w} ${y}Q256 ${y+4} ${254+w} ${y}L${251+w} ${y+6}Q256 ${y+10} ${261-w} ${y+6}Z`,'#fff7e9')+p(`M${263-w} ${y+16}Q256 ${y+10} ${249+w} ${y+16}Q256 ${y+23} ${263-w} ${y+16}Z`,'#e69a9f');break;
  case 'focused':mouth=l(`M${256-w} ${y+1}Q256 ${y-2} ${256+w} ${y+1}`,lip,1.7);break;
  case 'sad':mouth=l(`M${256-w+2} ${y+4}Q256 ${y-5} ${254+w} ${y+4}`,lip,1.65);break;
 }
 return eyeArt(look)+(look.expression==='happy'||look.expression==='laugh'?both(e(189,269,29,14,'url(#cheek)')):'')+
 group('mouth',mouth);
}
