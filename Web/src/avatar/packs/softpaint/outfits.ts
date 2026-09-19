import type {Frame,Recipe} from '../../model';
import {p,l,e,isChild,isFemale} from './drawing';

export function outfitArt(frame:Frame,id:Recipe['outfit']):string{
 const child=isChild(frame),female=isFemale(frame);
 const body=child?'M132 235L112 248Q82 252 64 273L45 320H276L255 270Q233 251 188 236Q160 260 132 235Z':female?'M126 248L100 260Q64 269 47 294L32 320H290L272 290Q246 266 193 247Q160 279 126 248Z':'M126 248L90 260Q49 270 28 299L18 320H304L288 293Q260 266 194 247Q159 279 126 248Z';
 const top=child?236:250,low=child?268:283;
 let art='';
 if(id==='tee'){
  art=p(body,'url(#sp-tee)')+p(child?'M70 274Q92 255 116 251L134 270Q104 279 88 320H46Z':'M45 296Q77 267 110 258L137 281Q101 291 88 320H32Z','#4e5268',.26)+
   p(`M${child?132:126} ${top}Q160 ${low+3} ${child?188:194} ${top}L${child?193:202} ${top+8}Q160 ${low+21} ${child?126:118} ${top+8}Z`,'#f0e7ee',.48)+
   p('M199 253Q238 260 267 291L280 317Q248 287 213 284Z','url(#sp-fabric-light)',.35)+
   l(child?'M91 286Q97 302 96 318':'M84 291Q94 306 95 319','#e3d8e6',1.4,.42);
 }else if(id==='shirt'){
  art=p(body,'url(#sp-shirt)')+
   p(`M${child?133:126} ${top-2}L160 ${low-7}L146 ${low+10}L${child?114:103} ${top+9}Z`,'#e6f0ee',.9)+
   p(`M${child?187:194} ${top-2}L162 ${low-7}L177 ${low+10}L${child?205:218} ${top+9}Z`,'#eef5f1',.9)+
   p(`M154 ${low-4}L162 ${low-7}L171 ${low+2}L174 320H153Z`,'#d8e6e8',.86)+
   p('M53 296Q89 268 121 261L97 320H22Z','#4d6177',.22)+p('M205 260Q250 270 284 306L288 320H239Z','url(#sp-fabric-light)',.3)+
   e(165,low+16,1.6,1.6,'#60788c',.75)+e(165,low+30,1.6,1.6,'#60788c',.75);
 }else if(id==='knit'){
  art=p(body,'url(#sp-knit)')+
   p(`M${child?135:128} ${top-2}Q160 ${low} ${child?185:193} ${top-2}L181 320H136Z`,'#f3e7d6',.92)+
   p(`M${child?119:109} ${top+8}L${child?135:127} ${top-5}L155 ${low+25}L143 320H${child?51:27}Z`,'#ae8069',.32)+
   p(`M${child?201:213} ${top+8}L${child?185:193} ${top-5}L165 ${low+25}L174 320H${child?273:299}Z`,'#fff3df',.13)+
   l(`M${child?133:125} ${top+2}L151 ${low+25}L142 320`,'#f3d5b6',1.6,.72)+l(`M${child?187:195} ${top+2}L169 ${low+25}L176 320`,'#7f5f58',1.2,.45)+
   l(child?'M80 279Q92 284 100 302M228 280Q239 290 242 308':'M65 286Q83 293 91 313M239 286Q256 297 262 315','#f1d9c4',1.25,.4);
 }else{
  art=p(body,'url(#sp-jacket)')+
   p(`M${child?134:128} ${top-2}Q160 ${low+2} ${child?186:192} ${top-2}L186 320H135Z`,'#eee7dc',.95)+
   p(`M${child?118:105} ${top+10}L${child?133:126} ${top-8}L157 ${low+20}L134 ${low+35}L137 320H${child?47:20}Z`,'#252a3b',.35)+
   p(`M${child?202:216} ${top+10}L${child?187:194} ${top-8}L163 ${low+20}L185 ${low+35}L181 320H${child?275:303}Z`,'#a6abc0',.18)+
   p(`M${child?121:112} ${top+8}L${child?132:127} ${top-4}L149 ${low+11}L127 ${low+5}L136 ${low+20}L122 ${low+29}Z`,'#9699aa',.82)+
   p(`M${child?199:209} ${top+8}L${child?188:193} ${top-4}L171 ${low+11}L194 ${low+5}L183 ${low+20}L198 ${low+29}Z`,'#9096a9',.78)+
   p('M211 255Q254 267 286 301L302 320H260Q245 285 211 255Z','url(#sp-fabric-light)',.28)+
   e(child?127:124,low+20,2,2,'#cdb497',.8)+e(child?196:199,low+20,2,2,'#cdb497',.8);
 }
 // 柔光包的衣料靠体积与局部亮面区分，不复制线绘包的外轮廓。
 art+=p('M84 298Q118 274 145 282Q113 290 97 320H67Z','#ffffff',.08)+l('M149 307Q160 311 171 307','#fff8ef',1,.26);
 return art;
}
