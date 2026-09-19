import type {Frame,Recipe} from '../../model';
import {p,l,e,mirror,isChild,isElder,isFemale} from './drawing';

const faceShape:Record<'female'|'male'|'child'|'elder',Record<Recipe['face'],string>>={
 female:{
  oval:'M92 104C95 73 120 56 160 57C200 56 226 74 228 105L228 154Q226 184 207 204Q185 226 160 234Q135 225 113 205Q94 186 92 157Z',
  round:'M88 105C91 72 119 58 160 58C202 57 231 73 233 106L235 151Q237 182 216 202Q194 223 161 228Q128 224 106 202Q85 182 87 153Z',
  angular:'M92 102Q96 58 160 58Q224 58 228 103L230 153L224 181Q220 196 205 207L180 226Q169 235 160 235Q148 234 137 227L112 208Q97 197 93 183L90 155Z',
  long:'M97 103Q100 59 160 58Q220 59 224 104L222 158Q220 183 204 204L180 232Q169 243 160 243Q149 242 138 232L115 206Q99 184 98 158Z'
 },
 male:{
  oval:'M90 102Q94 58 160 58Q226 58 231 103L231 158Q229 188 207 210L181 236Q169 246 160 246Q148 245 136 236L111 212Q91 190 90 159Z',
  round:'M87 103Q91 58 160 58Q230 58 234 104L237 158Q239 187 217 210Q194 234 162 238Q132 237 107 214Q84 192 85 160Z',
  angular:'M89 102Q93 58 160 58Q227 57 232 103L234 158L225 191L217 211L190 232L173 243L151 246L129 237L102 214L92 193L88 160Z',
  long:'M96 102Q99 59 160 58Q222 59 226 103L224 159L216 190Q212 206 195 224L177 244Q168 253 159 252Q149 250 140 244L117 224Q102 208 99 190L96 160Z'
 },
 child:{
  oval:'M91 106Q94 66 160 65Q226 65 229 106L230 151Q230 177 210 197Q190 216 160 221Q132 216 111 198Q91 179 91 154Z',
  round:'M88 108Q92 65 160 65Q228 64 232 108L235 151Q237 177 216 197Q193 219 161 221Q129 219 107 198Q85 180 87 153Z',
  angular:'M92 105Q96 65 160 65Q225 65 229 106L229 154L223 178Q219 190 205 201L179 217Q169 224 160 225Q148 224 139 218L114 203Q98 193 94 180L91 156Z',
  long:'M96 105Q99 65 160 65Q222 65 225 106L224 155Q222 177 205 197L179 222Q169 231 160 232Q149 230 141 223L117 201Q101 182 98 157Z'
 },
 elder:{
  oval:'M93 106Q97 65 160 64Q224 65 228 107L228 154L223 183Q229 199 211 216L181 239Q168 249 157 247L140 241L111 218Q96 207 96 191L92 158Z',
  round:'M90 108Q94 64 160 64Q227 64 231 108L234 154Q238 176 229 194Q232 209 214 223Q191 242 161 244Q133 243 110 223Q92 210 93 194Q86 177 89 157Z',
  angular:'M92 106Q97 64 160 64Q223 65 229 107L230 155L224 186L219 208L197 229L176 242L152 246L130 237L106 218L96 198L91 159Z',
  long:'M98 106Q101 65 160 64Q219 65 224 108L222 157L215 188Q222 202 204 220L180 243Q168 252 158 250L141 242L119 222Q104 208 104 190L98 159Z'
 }
};

export function faceBase(frame:Frame,face:Recipe['face']):string{
 const group=isChild(frame)?'child':isElder(frame)?'elder':isFemale(frame)?'female':'male';
 const ears=mirror(p('M94 145Q78 137 80 155Q83 174 96 174L99 157Z','url(#sp-skin)')+p('M85 149Q91 149 88 163L94 157L94 149Z','#c78e82',.58));
 let art=ears+p(faceShape[group][face],'url(#sp-skin)')+
  p('M101 108Q118 76 158 69Q195 68 219 91Q192 76 161 80Q127 80 104 118Z','#fff6ec',.34)+
  mirror(p('M94 151Q97 181 114 200L124 207Q102 195 98 178Z','#bf817d',.2))+
  mirror(e(115,180,18,10,'url(#sp-cheek)',.72));
 if(face==='round')art+=mirror(e(111,181,1,1,'#b98378',.55)+e(118,184,.8,.8,'#b98378',.48)+e(123,179,.8,.8,'#b98378',.45));
 if(isElder(frame))art+=mirror(l('M103 172Q119 181 134 174','#aa8179',.9,.45)+l('M112 187Q125 193 136 188','#aa8179',.75,.36))+l('M139 232Q160 238 180 229','#a47c75',.9,.4);
 const noseY=isChild(frame)?175:181;
 art+=p(`M160 ${noseY-13}Q155 ${noseY-2} 157 ${noseY+4}Q161 ${noseY+8} 166 ${noseY+2}Q163 ${noseY+5} 160 ${noseY+3}Z`,'#c98f83',.42)+
  l(`M158 ${noseY+5}Q161 ${noseY+7} 165 ${noseY+4}`,'#a87370',.8,.42);
 return art;
}

export function neckArt(frame:Frame):string{
 if(isChild(frame))return p('M140 202L140 233L122 248Q159 279 198 248L180 233L180 202Z','url(#sp-neck)')+p('M142 215Q160 232 179 214L179 234Q160 244 141 229Z','#b97976',.2);
 return p('M134 219L131 252L112 263L154 300L207 262L189 251L186 218Z','url(#sp-neck)')+p('M135 228Q160 251 186 227L188 247Q160 267 132 245Z','#b47773',.25)+mirror(p('M135 252Q144 266 153 272L145 274Q136 266 131 257Z','#fff6ea',.18));
}

const eyeSpec={oval:{w:17,h:9,mouth:14},round:{w:18,h:11,mouth:15},angular:{w:19,h:7,mouth:17},long:{w:16,h:8,mouth:13}};
export function expressionArt(frame:Frame,face:Recipe['face'],expression:Recipe['expression']):string{
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame);
 const ink='#514857',brow=elder?'#7d7880':female?'#645969':'#5d5660',y=151;
 const h=elder?Math.max(5,spec.h-2):child?spec.h+2:female?spec.h:Math.max(6,spec.h-1),w=spec.w;
 const browPath=expression==='angry'?'M105 130Q122 128 141 137':expression==='sad'?'M105 138Q123 132 140 126':expression==='surprise'?'M105 124Q123 116 140 124':'M105 131Q122 126 140 130';
 let left=l(browPath,brow,female?2.1:2.5,.82);
 if(expression==='joy'){
  left+=l('M104 153Q122 135 141 153',ink,2.4,.9)+p('M108 158Q123 165 138 158Q123 168 108 158Z','#c88b86',.16);
 }else{
  const open=expression==='surprise'?h+4:expression==='angry'?Math.max(5,h-1):h;
  const x0=123-w,x1=123+w;
  const white=`M${x0} ${y}Q123 ${y-open*1.35} ${x1} ${y+1}Q123 ${y+open*1.1} ${x0} ${y}Z`;
  const ry=Math.max(2.3,open*.42),rx=Math.min(5.2,w*.3);
  left+=`<g data-eye-white="">${p(white,'#fffaf5')}</g>`+
   `<g data-eye-iris="">${e(124,y+.2,rx,ry,'url(#sp-iris)')+e(124,y+.7,rx*.43,ry*.72,'#413c4d')+e(122.2,y-ry*.42,1.65,1.25,'#fffdf6',.95)+e(127,y+ry*.35,.8,.7,'#f1ccd0',.85)}</g>`+
   l(`M${x0-1} ${y-1}Q122 ${y-open*1.45-1} ${x1} ${y+1}`,ink,female?2.5:2.1,.95)+
   l(`M${x0+5} ${y+3}Q123 ${y+open} ${x1-3} ${y+3}`,'#a47876',.75,.48);
  if(female)left+=l(`M${x0} ${y}L${x0-5} ${y-5}`,ink,1.4,.7);
 }
 let art=mirror(left);
 if(elder)art+=mirror(l('M108 165Q123 171 137 164','#aa8179',.8,.42));
 const my=child?199:elder?209:female?205:213,mw=spec.mouth;
 let mouth='';
 if(expression==='calm')mouth=l(`M${160-mw} ${my}Q160 ${my+1} ${160+mw} ${my}`,'#995f6a',1.45,.84);
 if(expression==='smile')mouth=l(`M${160-mw} ${my-1}Q160 ${my+9} ${160+mw} ${my-1}`,'#965968',1.7,.9)+p(`M153 ${my+8}Q160 ${my+12} 167 ${my+8}Q160 ${my+14} 153 ${my+8}Z`,'#fff1e8',.35);
 if(expression==='joy')mouth=p(`M${160-mw} ${my-3}Q160 ${my+2} ${160+mw} ${my-3}Q${159+mw} ${my+17} 160 ${my+18}Q${161-mw} ${my+17} ${160-mw} ${my-3}Z`,'#844b61')+p(`M${164-mw} ${my+10}Q160 ${my+7} ${156+mw} ${my+10}Q160 ${my+18} ${164-mw} ${my+10}Z`,'#df9ba1',.9);
 if(expression==='angry')mouth=l(`M${161-mw} ${my+2}Q160 ${my-2} ${159+mw} ${my+2}`,'#8f5966',1.65,.9);
 if(expression==='sad')mouth=l(`M${163-mw} ${my+5}Q160 ${my-6} ${157+mw} ${my+5}`,'#995f6a',1.6,.85);
 if(expression==='surprise')mouth=e(160,my+3,6.2,8.8,'#8c5263',.92)+e(160,my+7,3.4,2.5,'#d99ba0',.85);
 return art+`<g data-mouth="">${mouth}</g>`;
}
