import type { Look } from '../model';
import { p, l, e, cloths } from './drawing';
export function outfitArt(look: Look): string {
  const c = cloths[look.outfitPaletteId], female = look.frame === 'female.adult';
  // 衣服拥有全部肩线与领口；同一画布直接作画，不借身体底图做运行时校正。
  const body = female ? 'M100 179Q63 180 44 203L25 256H230L212 210Q198 186 155 179L128 199Z' : 'M99 179Q60 176 36 204L13 256H244L222 206Q198 178 156 177L128 200Z';
  const seam = female ? 'M56 214L44 249M189 214L207 249M136 230L148 249' : 'M51 213L34 250M193 212L220 250M135 231L151 251';
  const cross = p('M104 176L129 198L115 214L83 186Z',c.trim,c.ink,.8)+p('M153 175L110 222L99 256H120L174 189Z',c.trim,c.ink,.8)+p('M155 181L117 223L107 256H114L163 186Z',c.light);
  const flower = (x: number, y: number) => e(x,y,3,3,'#cdb073')+l(`M${x-10} ${y}Q${x-5} ${y-12} ${x} ${y-4}Q${x+5} ${y-13} ${x+11} ${y}Q${x+4} ${y+11} ${x} ${y+4}Q${x-6} ${y+11} ${x-10} ${y}Z`,'#d2b882',1);
  const art: Record<Look['outfitStyleId'], string> = {
    plain: p(body,c.base,c.ink,1)+p('M44 205L70 188L77 211L62 256H26Z',c.shade)+p('M160 181Q194 187 207 213L216 256H165L147 214Z',c.light)+cross+l(seam,c.shade,1.3)+l('M69 204L78 222',c.light,.8),
    vest: p(body,c.light,c.ink,1)+p('M94 178L118 197L113 217L86 199Z',c.trim,c.ink,.8)+p('M155 177L116 217L116 256H139L171 189Z',c.trim,c.ink,.8)+p('M85 181Q67 183 53 200L63 220L60 256H107L104 213L114 201Z',c.shade,c.ink,.9)+p('M163 181Q183 181 200 198L189 221L199 256H136L139 217Z',c.base,c.ink,.9)+l('M81 188L105 204L98 250M167 189L147 219L145 250',c.light,2)+p('M67 232L90 233L88 246L67 243Z',c.base)+l('M57 216L46 247M205 217L219 249',c.shade,1.2),
    scholar: p(body,c.base,c.ink,1)+p('M95 177L129 199L112 221L73 189Z',c.trim,c.ink,.9)+p('M157 173L106 224L88 256H120L183 190Z',c.trim,c.ink,.9)+p('M160 181L113 226L103 256H115L174 187Z',c.shade)+p('M42 207L62 197Q82 218 66 256H20Z',c.light)+p('M175 199L191 199L227 256H186Z',c.light)+l('M56 209Q64 234 48 253M187 211L214 252M137 229L143 250',c.shade,1.6),
    official: p(female ? 'M97 178Q60 177 38 202L17 256H241L218 202Q195 179 156 177L128 196Z' : 'M97 178Q53 175 30 202L5 256H251L227 201Q199 175 156 177L128 196Z',c.base,c.ink,1.1)+p('M45 196L75 181L82 211L67 256H17Z',c.shade)+p('M164 180Q205 181 220 213L233 256H173L150 209Z',c.light)+p('M103 173Q106 194 127 196Q149 194 153 173L164 181Q163 210 128 211Q95 209 93 182Z',c.shade,c.ink,.8)+l('M101 183Q106 202 128 203Q151 201 156 183',c.trim,2.2)+l('M134 212L134 256',c.shade,1.2)+e(139,219,2,2,'#ceb37a')+e(139,235,2,2,'#ceb37a')+l('M49 218L39 248M206 217L223 251',c.shade,1.3),
    noble: p(body,c.base,c.ink,1)+cross+p('M50 191Q70 178 88 184L118 209L106 223Q88 205 66 204L40 222L29 246Q31 209 50 191Z',c.light,c.ink,.9)+p('M164 181Q198 184 215 207L233 246L197 218Q178 207 161 210L135 247L120 246Z',c.light,c.ink,.9)+l('M51 197Q75 190 105 214M173 191Q194 194 209 213',c.trim,2)+flower(63,218)+flower(192,231)+flower(158,245)+l('M53 237L47 252M203 243L208 253',c.shade,1.3),
    royal: p('M96 176Q55 173 27 198L7 256H249L230 198Q200 173 157 176L127 198Z',c.base,c.ink,1.2)+p('M28 197Q66 177 94 187L109 206L85 221Q53 209 17 223Z',c.shade,c.ink,.8)+p('M160 179Q201 176 229 197L240 224Q198 206 171 218L150 205Z',c.shade,c.ink,.8)+p('M102 173Q109 194 128 197Q146 194 153 173L166 182Q158 213 128 217Q97 210 90 184Z','#c1a264',c.ink,.8)+l('M99 184Q108 204 128 207Q150 201 158 183','#ecd799',2)+l('M33 204Q63 191 86 201M176 195Q204 190 224 207','#cdb273',2.5)+p('M103 225Q127 212 155 226L158 256H100Z',c.shade)+l('M111 236Q124 221 141 233L137 241L145 245L139 252Q125 242 113 250L117 240L111 236Z','#d9bd7a',1.6)+flower(57,235)+flower(205,235),
  };
  return art[look.outfitStyleId];
}
