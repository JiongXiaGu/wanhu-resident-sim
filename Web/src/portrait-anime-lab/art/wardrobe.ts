import type { Look } from '../model';
import { bilateral, cloths, e, l, p } from './drawing';
const seam = '#454456';
export function outfitArt(look: Look): string {
  const c = cloths[look.cloth], female = look.frame === 'female.adult';
  const body = female ? 'M105 195Q66 192 43 215L25 256H231L214 216Q191 195 151 195L128 214Z' : 'M103 194Q60 191 35 216L14 256H242L221 216Q196 191 153 194L128 214Z';
  const collar = p('M105 190L130 211L113 229L86 203Z',c.inner,seam,1.1)+
    p('M151 190L103 234L91 256H113L171 204Z',c.inner,seam,1.1)+
    p('M154 197L111 239L102 256H112L164 203Z',c.light)+
    l('M104 198L122 213M153 199L117 235',c.trim,1.3);
  const cloud = (x: number, y: number) => l(`M${x-10} ${y+4}Q${x-16} ${y-3} ${x-8} ${y-5}Q${x-4} ${y-16} ${x+4} ${y-8}Q${x+14} ${y-9} ${x+13} ${y}L${x+3} ${y}Q${x-1} ${y-5} ${x-5} ${y}L${x+10} ${y+6}`,c.trim,1.5);
  const styles: Record<Look['outfit'], string> = {
    linen: p(body,c.base,seam,1.3)+p('M45 215L seventy 201L80 217L62 256H26Z'.replace('seventy','70'),c.shade)+
      p('M161 200Q193 199 212 220L223 256H184L160 225Z',c.light)+collar+
      l('M65 220L57 245M191 222L206 252M138 235L148 256',c.shade,1.5),
    vest: p(body,c.light,seam,1.3)+collar+
      p('M83 196L119 218L110 256H62L67 226L55 210Z',c.shade,seam,1.1)+
      p('M174 197L143 229L146 256H203L189 227L200 211Z',c.base,seam,1.1)+
      l('M82 204L111 222L104 254M175 205L151 231L154 254',c.trim,2)+
      p('M seventy 238L96 239L94 249L70 248Z'.replace('seventy','70'),c.base)+l('M49 229L40 252M207 231L217 251',c.shade,1.4),
    official: p(female ? 'M102 194Q59 189 35 215L17 256H239L221 215Q197 189 154 194Z' : 'M102 194Q52 189 27 216L6 256H250L229 216Q203 189 154 194Z',c.base,seam,1.4)+
      p('M37 213L72 198L83 224L72 256H18Z',c.shade)+p('M163 199Q205 199 222 220L234 256H189Z',c.light)+
      p('M106 189Q109 210 128 214Q147 210 150 189L163 198Q158 228 128 231Q98 228 93 198Z',c.shade,seam,1.1)+
      l('M104 199Q109 220 128 221Q147 220 152 199',c.trim,2.2)+l('M134 232L134 256',c.shade,1.4)+e(140,237,2,2,c.trim)+e(140,250,2,2,c.trim)+
      l('M51 230L42 251M206 230L215 251',c.shade,1.5),
    ceremony: p('M102 194Q61 186 28 211L7 256H249L228 211Q195 186 154 194L128 215Z',c.base,seam,1.5)+
      p('M38 202Q62 188 85 198L111 219L94 233Q62 211 19 235Z',c.shade,seam,1)+
      p('M172 196Q203 193 228 213L244 239Q208 218 177 228L153 244L145 227Z',c.shade,seam,1)+
      collar+l('M37 207Q seventy 196 100 223M177 205Q204 201 223 218'.replace('seventy','70'),c.trim,2.6)+
      cloud(60,240)+cloud(202,243)+l('M141 249L154 255',c.trim,1.7)+
      p('M81 218Q70 237 75 256H85L88 224Z',c.light)+p('M178 220L180 256H193Q194 237 187 223Z',c.light),
  };
  return styles[look.outfit];
}
export function headwearArt(look: Look): { back: string; front: string } {
  const c = cloths[look.cloth];
  const styles: Record<Look['hat'], string> = {
    none: '',
    wrap: p('M sixty 79Q sixty 50 91 37Q126 25 163 37Q193 49 196 79L191 96Q131 78 65 96Z'.replaceAll('sixty','60'),c.shade,seam,1.5)+
      p('M67 62Q127 42 189 67L193 82Q127 61 64 85Z',c.base)+
      p('M66 79Q115 49 187 64L192 73Q121  sixty 65 91Z'.replace('sixty','60'),c.light)+
      p('M66  eighty Q46 72 48 88Q49 98  sixty 97L49 130L62 125L75 91Z'.replace('eighty','80').replace('sixty','60'),c.base,seam,1.1)+l('M70 57Q123 39 178 61',c.light,1.3),
    guan: p('M105 48L109 26Q113 11 128 11Q143 11 147 26L151 48Z','#ae854c','#735541',1.2)+
      p('M117 38L119 26Q128 13 137 26L139 38Z','#6a6871')+
      l('M114 37L116 26Q128 9 140 26L143 37M125 20L123 37M131 20L133 37','#f4dba2',2.4)+
      p('M103 42Q128 35 153 42L153 51Q128 45 103 51Z','#ddb879','#866244',1)+
      l('M106 45L eighty 47M150 45L176 47'.replace('eighty','80'),'#b18a56',2.5)+bilateral(e(79,47,3.3,3.3,'#e9cd95'))+
      e(128,43,4.7,5.4,'#40998e')+e(127,41,1.6,1.8,'#c4f0cd'),
    straw: p('M8 78Q67 49 118 18Q128 12 138 18Q188 49 248 78Q231 97 128 98Q25 97 8 78Z','#b99159','#755539',1.4)+
      p('M17 76L128 20L239 76Q128 94 17 76Z','#edcf90')+
      p('M16 81Q128 99 240 81L237 87Q128 106 19 88Z','#9e764a')+
      l('M128 23L ninety 81M128 23L58 79M128 23L119 85M128 23L166 81M128 23L198 79M128 23L137 85M80 49Q128 58 176 49M49 65Q128 79 207 65'.replace('ninety','90'),'#c6a162',1.3)+
      bilateral(l('M seventy 94L75 135'.replace('seventy','70'),'#b79569',1.1)),
  };
  return { back: '', front: styles[look.hat] };
}
