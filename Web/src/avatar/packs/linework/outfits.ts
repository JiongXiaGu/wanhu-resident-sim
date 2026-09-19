import type {Frame,Recipe} from '../../model';
import {p,l,e,isChild,isFemale} from './drawing';
export function outfitArt(frame:Frame,id:Recipe['outfit']):string {
 const child=isChild(frame),female=isFemale(frame);
 // 三种肩颈画法直接提供最终坐标，不以脸型或头发计算偏移。
 const body=child?'M133 235L114 249Q85 253 68 272L48 320H274L252 270Q233 251 187 236Q161 259 133 235Z':female?'M126 249L101 261Q65 271 48 295L34 320H288L271 291Q246 267 193 248Q160 278 126 249Z':'M126 249L91 261Q51 271 30 299L20 320H303L286 294Q260 267 194 248Q159 278 126 249Z';
 const top=child?237:251,low=child?267:283;
 const baseColors={tee:{base:'#9a94b3',shadow:'#77788e',edge:'#625e75'},shirt:{base:'#849bb0',shadow:'#5e778f',edge:'#455d74'},knit:{base:'#ceae90',shadow:'#ae896f',edge:'#8b695e'},jacket:{base:'#545b70',shadow:'#383f54',edge:'#303344'}}[id];
 const c=baseColors;
 let result=p(body,c.base,c.edge,1.6);
 if(id==='tee') {
  result+=p(`M${child?133:127} ${top-2}Q160 ${low+1} ${child?188:194} ${top-2}L${child?193:201} ${top+5}Q160 ${low+19} ${child?126:119} ${top+5}Z`,c.shadow,c.edge,1)+
   l(`M${child?130:123} ${top+5}Q160 ${low+12} ${child?190:197} ${top+5}`,'#c1b6c8',1.4)+
   p(child?'M85 260L97 285L93 320H51L68 275Z':'M69 275L89 287L96 320H35L47 299Z',c.shadow)+
   p(child?'M211 252L233 266L245 292L230 279Z':'M222 264L251 278L270 303L243 285Z','#b7aec7')+
   l(child?'M96 282L101 313M222 279L231 313':'M95 293L99 318M239 295L244 318',c.edge,1.1,.65)+
   l(`M147 ${low+24}L173 ${low+24}`,'#d8cacf',2.3,.7);
 } else if(id==='shirt') {
  result+=p(`M${child?134:127} ${top-3}L160 ${low-6}L145 ${low+9}L${child?116:105} ${top+9}Z`,'#d8e2e6',c.edge,1)+
   p(`M${child?186:193} ${top-3}L162 ${low-6}L177 ${low+9}L${child?204:216} ${top+9}Z`,'#dce5e5',c.edge,1)+
   p(`M154 ${low-2}L162 ${low-5}L170 ${low+2}L174 320H154Z`,'#d9e3e5')+
   l(`M163 ${low+9}L165 320`,c.edge,1.1,.6)+e(165,low+16,1.7,1.7,'#687f8e')+e(165,low+30,1.7,1.7,'#687f8e')+
   p(child?'M90 265L104 278L92 320H50L67 280Z':'M58 280L84 274L99 288L84 320H24L36 303Z',c.shadow)+
   p(child?'M212 284L232 286L229 302L213 301Z':'M219 297L244 298L241 314L220 314Z',c.shadow)+
   l(child?'M213 286L230 288':'M221 300L242 301','#c0d1d9',1.1)+
   l(child?'M102 281L102 313M234 276L244 312':'M94 290L90 318M257 290L272 316',c.edge,1,.65);
 } else if(id==='knit') {
  result+=p(`M${child?135:128} ${top-2}Q160 ${low} ${child?185:193} ${top-2}L181 320H136Z`,'#f3e5ce','#b4a28d',1)+
   p(`M${child?120:110} ${top+7}L${child?135:127} ${top-5}L155 ${low+25}L143 320H${child?53:29}Z`,c.base,c.edge,1.1)+
   p(`M${child?201:212} ${top+8}L${child?185:193} ${top-5}L165 ${low+25}L174 320H${child?271:297}Z`,c.base,c.edge,1.1)+
   l(`M${child?132:124} ${top+1}L150 ${low+26}L141 320`,c.shadow,4)+l(`M${child?188:196} ${top+1}L170 ${low+26}L176 320`,c.shadow,4)+
   l(`M${child?134:126} ${top+1}L153 ${low+25}M${child?186:194} ${top+1}L167 ${low+25}`,'#edcfad',1.3)+
   e(171,low+30,2.2,2.2,'#876b5e')+
   l(child?'M83 275L78 302M91 277L87 306M99 282L96 309M237 275L244 302M229 280L235 306':'M72 283L63 313M80 286L74 316M89 291L84 318M246 284L257 315M237 289L245 317',c.shadow,1.2,.65);
 } else {
  result+=p(`M${child?134:129} ${top-2}Q160 ${low+2} ${child?186:192} ${top-2}L186 320H135Z`,'#e6dfd4')+
   p(`M${child?119:106} ${top+10}L${child?133:126} ${top-8}L157 ${low+20}L134 ${low+34}L137 320H${child?48:21}Z`,c.base,c.edge,1.3)+
   p(`M${child?201:215} ${top+10}L${child?187:194} ${top-8}L163 ${low+20}L185 ${low+34}L181 320H${child?274:302}Z`,c.base,c.edge,1.3)+
   p(`M${child?121:113} ${top+8}L${child?132:127} ${top-4}L149 ${low+11}L127 ${low+4}L136 ${low+19}L122 ${low+28}Z`,'#767c8e',c.edge,.9)+
   p(`M${child?199:208} ${top+8}L${child?188:193} ${top-4}L171 ${low+11}L194 ${low+4}L183 ${low+19}L198 ${low+28}Z`,'#737b8e',c.edge,.9)+
   l(`M135 ${low+33}L134 320M184 ${low+33}L183 320`,'#b6b6bd',1.5)+
   l(child?'M81 283L100 287M222 287L241 283':'M68 301L99 307M221 307L254 301','#bbb6b0',2)+
   p(child?'M67 282L77 276L74 320H49Z':'M42 295L65 283L72 320H20Z',c.shadow)+
   e(child?127:124,low+20,2.1,2.1,'#b7a38a')+e(child?196:199,low+20,2.1,2.1,'#b7a38a');
 }
 return result;
}
