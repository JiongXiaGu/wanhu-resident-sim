import type { Frame, Recipe } from '../../model';
import { p,l,e,mirror,skin as s,isChild,isElder,isFemale } from './drawing';
const contours: Record<'female'|'male'|'child'|'elder',Record<Recipe['face'],string>> = {
 female: {
  oval:'M86 106C87 75 116 59 160 60C205 59 233 77 234 108L232 155Q230 184 209 204L180 225Q161 240 143 228L112 206Q89 188 87 159Z',
  round:'M85 105C86 74 117 60 160 60C204 59 233 75 235 105L237 153Q239 182 216 204Q192 230 160 232Q129 231 105 208Q81 185 83 157Z',
  angular:'M86 105Q89 60 160 60Q229 59 234 104L235 153L229 185Q226 196 214 204L186 226Q174 235 160 235L137 229L107 206Q92 197 88 184L84 155Z',
  long:'M91 104Q93 61 160 60Q227 61 230 104L227 157Q225 182 207 204L180 230Q170 241 160 242Q149 241 138 230L112 204Q95 183 92 157Z',
 },
 male: {
  oval:'M85 104Q87 60 160 60Q231 60 235 105L235 157Q233 186 211 209L181 235Q169 246 160 246Q149 245 138 236L109 210Q87 189 85 160Z',
  round:'M84 104Q87 61 160 60Q232 61 236 105L239 159Q240 188 217 211Q194 236 163 240Q133 239 108 216Q82 193 81 161Z',
  angular:'M85 104Q88 60 160 60Q232 59 235 104L238 157L230 189L226 210L202 229L177 244L150 247L125 237L96 213L87 192L82 159Z',
  long:'M91 103Q94 61 160 60Q226 61 231 104L228 159L220 190Q217 205 198 222L177 244Q167 253 159 252L143 246L118 223Q102 207 98 190L91 160Z',
 },
 child: {
  oval:'M86 106Q89 65 160 65Q232 65 234 106L234 154Q233 183 210 200Q185 222 160 224Q135 222 112 203Q87 186 86 158Z',
  round:'M85 107Q89 65 160 65Q231 64 235 107L239 151Q242 177 218 198Q193 224 161 224Q126 222 105 199Q80 180 81 153Z',
  angular:'M87 106Q91 65 160 65Q230 65 234 106L234 155L228 181Q225 193 210 202L182 219Q160 232 141 221L112 204Q93 194 89 181L85 157Z',
  long:'M91 105Q94 65 160 65Q227 65 230 106L228 156Q226 178 207 198L179 223Q169 233 160 233Q148 230 140 223L115 201Q96 182 93 158Z',
 },
 elder: {
  oval:'M87 108Q91 65 160 64Q230 66 233 108L233 155L228 184Q236 203 216 218L183 239Q168 250 156 247L139 241L108 219Q91 210 92 191L87 159Z',
  round:'M86 108Q89 64 160 64Q231 65 234 108L236 155Q242 178 232 195Q237 211 215 226Q191 244 161 245Q132 244 108 225Q87 212 89 194Q81 178 84 158Z',
  angular:'M87 107Q92 65 160 64Q229 66 234 108L235 155L229 187L226 211L201 232L178 244L150 248L126 239L100 219L89 198L86 159Z',
  long:'M92 107Q95 65 161 64Q227 66 230 108L228 158L220 188Q229 204 209 221L181 244Q167 254 157 251L139 243L115 223Q98 209 99 190L93 160Z',
 },
};
export function faceBase(frame:Frame,face:Recipe['face']):string {
 const category=isChild(frame)?'child':isElder(frame)?'elder':isFemale(frame)?'female':'male';
 const ears=mirror(p('M89 145Q75 137 77 153Q79 172 92 174L94 157Z',s.base,s.line,1.1)+l('M82 149Q88 147 85 159',s.shade,2));
 let art=ears+p(contours[category][face],s.base,s.line,1.2)+p('M92 116Q104 83 157 77Q197 76 221 98L204 90Q169 80 136 98L96 126Z',s.light)+
 mirror(p('M88 158Q94 180 109 195L118 205Q99 194 94 183Z',s.shade))+e(112,178,14,6,s.cheek,.18)+e(207,178,13,6,s.cheek,.18);
 if(isElder(frame)) art+=l('M131 108Q158 101 187 108M137 115Q160 110 180 116',s.line,.9,.65)+mirror(l('M93 163L89 167M98 176Q113 184 125 178M132 185Q122 191 125 205',s.line,.9,.72))+l('M144 232Q160 237 174 230',s.line,.8,.55);
 if(face==='round') art+=mirror(e(110,177,1,1,'#bb8e7c',.75)+e(117,181,.9,.9,'#bb8e7c',.7)+e(121,176,.8,.8,'#bb8e7c',.65));
 const noseY=isChild(frame)?175:181;
 art+=p(`M160 ${noseY-10}L157 ${noseY}Q160 ${noseY+5} 165 ${noseY+1}L161 ${noseY-1}Z`,s.shade)+l(`M158 ${noseY+3}L162 ${noseY+4}`,s.line,.7,.6);
 return art;
}
// 每个 face 的眼形和口宽为作者规格。表情改变眉眼口，不根据脸型求解位置。
const eyeSpec={oval:{w:17,h:9,tilt:0,mouth:14},round:{w:17,h:11,tilt:1,mouth:15},angular:{w:19,h:7,tilt:3,mouth:17},long:{w:16,h:8,tilt:0,mouth:13}};
export function expressionArt(frame:Frame,face:Recipe['face'],expression:Recipe['expression']):string {
 const spec=eyeSpec[face],child=isChild(frame),elder=isElder(frame),female=isFemale(frame),ink='#443a48';
 const y=151, w=spec.w, h=elder?Math.max(5,spec.h-3):child?spec.h+2:female?spec.h:Math.max(6,spec.h-2);
 const tilt=spec.tilt; let eyes='';
 const brow=expression==='angry'?'M104 128Q120 128 141 136':expression==='sad'?'M105 138Q123 132 140 126':expression==='surprise'?'M105 124Q123 115 140 124':'M105 131Q122 125 140 130';
 const brows=l(brow,elder?'#868088':ink,female?1.8:2.5);
 if(expression==='joy') {
  eyes=brows+l('M104 153Q122 133 141 153',ink,2.6)+l('M105 154L101 150',ink,1.2);
 } else {
  const open=expression==='surprise'?h+4:expression==='angry'?Math.max(4,h-2):h;
  const left=123-w,right=123+w;
  const white=`M${left} ${y-tilt}Q123 ${y-open*1.6} ${right} ${y+1}Q123 ${y+open*1.6} ${left} ${y-tilt}Z`;
  const irisW=elder?5.5:child?7.5:6.6;
  // 窄眼型留出虹膜/瞳孔余量；不要依靠遮罩隐藏超出眼白的形状。
  const irisH=Math.max(2.2,open*.60);
  eyes=brows+`<g data-eye-white="">${p(white,'#fff9ee')}</g>`+
   `<g data-eye-iris="">${e(124,y,irisW,irisH,'#9d8168')+e(124,y-.3,irisW*.5,irisH*.73,'#4b454c')+e(122,y-irisH*.42,1.8,1.4,'#fffdf2')+e(127,y+irisH*.45,1,.8,'#ebd5a7')}</g>`+
   l(`M${left-2} ${y-tilt-2}Q121 ${y-open*1.7-1} ${right} ${y+1}`,ink,female?2.3:1.9)+
   l(`M${left+4} ${y+4}Q123 ${y+open*1.6} ${right-3} ${y+4}`,s.line,.85,.7);
  if(female) eyes+=l(`M${left} ${y-tilt}L${left-5} ${y-tilt-5}`,ink,1.5);
 }
 let art=mirror(eyes);
 if(elder) art+=mirror(l('M107 164Q123 172 137 163',s.line,1,.65));
 const my=child?200:elder?210:female?206:214;
 const mw=spec.mouth; let mouth='';
 if(expression==='calm') mouth=l(`M${160-mw} ${my}Q160 ${my-1} ${160+mw} ${my}`,'#a46c71',1.55);
 if(expression==='smile') mouth=l(`M${160-mw} ${my-1}Q160 ${my+10} ${160+mw} ${my-1}`,'#9d626e',1.8)+l(`M154 ${my+10}Q160 ${my+12} 166 ${my+10}`,s.light,2);
 if(expression==='joy') mouth=p(`M${160-mw} ${my-3}Q160 ${my+1} ${160+mw} ${my-3}Q${159+mw} ${my+17} 160 ${my+18}Q${161-mw} ${my+17} ${160-mw} ${my-3}Z`,'#884b60','#935365',.9)+p(`M${162-mw} ${my-1}Q160 ${my+3} ${158+mw} ${my-1}L${155+mw} ${my+5}Q160 ${my+8} ${165-mw} ${my+5}Z`,'#fff4df')+p(`M${168-mw} ${my+13}Q160 ${my+7} ${152+mw} ${my+13}Q160 ${my+19} ${168-mw} ${my+13}Z`,'#dc9399');
 if(expression==='angry') mouth=l(`M${161-mw} ${my+2}Q160 ${my-2} ${159+mw} ${my+2}`,'#96616c',1.8);
 if(expression==='sad') mouth=l(`M${163-mw} ${my+5}Q160 ${my-6} ${157+mw} ${my+5}`,'#a46c71',1.7);
 if(expression==='surprise') mouth=e(160,my+3,6.8,9.4,'#915363')+e(160,my+7,3.8,3,'#d69299');
 return art+`<g data-mouth="">${mouth}</g>`;
}
export function neckArt(frame:Frame):string {
 if(isChild(frame)) return p('M140 202L140 233L123 249Q160 283 197 249L180 233L180 202Z',s.base,s.line,1)+p('M141 213Q159 230 179 213L179 235Q161 244 141 229Z',s.shade);
 return p('M133 218L130 252L113 262L155 300L207 261L190 251L187 218Z',s.base,s.line,1)+p('M134 227Q160 249 186 227L188 247Q161 266 132 244Z',s.shade)+l('M142 257L150 266M180 257L171 266',s.line,1,.45);
}
