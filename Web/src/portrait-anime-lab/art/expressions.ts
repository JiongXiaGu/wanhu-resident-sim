import type { Look } from '../model';
import { bilateral, contour, e, hairs, l, p } from './drawing';
import { eyeDesign } from './faces';

// 嘴型以 x=128 为固定正面中心，左右端点同高；不通过倾斜整张嘴补偿脸型。
export function mouthArt(look: Look): string {
  const w = eyeDesign(look).mouth, x = 128, c = '#975366';
  const lines: Record<Look['expression'], string> = {
    neutral: l(`M${x-w*.6} 158Q${x} 157 ${x+w*.6} 158`, c, 1.55),
    smile: l(`M${x-w} 155Q${x} 165 ${x+w} 155`, c, 1.8),
    happy: p(`M${x-w} 153Q${x} 157 ${x+w} 153Q${x+w-1} 169 ${x} 170Q${x-w+1} 169 ${x-w} 153Z`,'#884459',c,1.1)+
      p(`M${x-w+2} 154Q${x} 158 ${x+w-2} 154L${x+w-3} 159Q${x} 162 ${x-w+3} 159Z`,'#fff5e8')+
      p(`M${x-w+5} 166Q${x} 162 ${x+w-5} 166Q${x} 170 ${x-w+5} 166Z`,'#e996a2'),
    laugh: p(`M${x-w-4} 151Q${x} 155 ${x+w+4} 151Q${x+w+2} 173 ${x} 174Q${x-w-2} 173 ${x-w-4} 151Z`,'#7b3f55',c,1.2)+
      p(`M${x-w-2} 153Q${x} 156 ${x+w+2} 153L${x+w} 159Q${x} 162 ${x-w} 159Z`,'#fff7ed')+
      p(`M${x-w+1} 168Q${x} 162 ${x+w-1} 168Q${x} 175 ${x-w+1} 168Z`,'#ee9daa'),
    angry: l(`M${x-w*.8} 161Q${x} 156 ${x+w*.8} 161`,c,1.8),
    sad: l(`M${x-w*.7} 162Q${x} 152 ${x+w*.7} 162`,c,1.65),
    surprised: e(x,160,w*.45,7.5,'#864557')+e(x,163,w*.25,2.5,'#d98696'),
    shy: l(`M${x-w*.65} 157Q${x} 164 ${x+w*.65} 157`,c,1.6),
  };
  return `<g data-mouth="${look.expression}" data-center-x="128">${lines[look.expression]}</g>`;
}
function eyes(look: Look): string {
  const d = eyeDesign(look), emotion = look.expression;
  const { outer: o, inner: i, center: cx, top: t, bottom: b } = d;
  const female = look.frame === 'female.adult';
  const ink = contour;
  let upper: string, shape: string, cy = d.irisY, ry = d.irisHeight, rx = d.iris;
  let lid = '';
  if (emotion === 'laugh') {
    return bilateral(l(`M${o} 123Q${cx} 108 ${i} 122`,ink,d.weight)+
      l(`M${o+1} 123L${o-3} 119`,ink,d.weight*.75)+l(`M${o+4} 128Q${cx} 132 ${i-4} 128`,'#d89f98',.8));
  }
  if (emotion === 'angry') {
    upper = `M${o} 113L${i} 124`;
    shape = `${upper}Q${cx} 135 ${o+1} 122Z`;
    cy = 123; ry = 3; rx *= .82;
  } else if (emotion === 'sad') {
    upper = `M${o} 121Q${cx} ${t+2} ${i} 117`;
    shape = `${upper}Q${cx} ${b+6} ${o} 121Z`;
    // 与这组二次曲线同源作画，不拿控制点误当眼白边界，也不靠遮罩隐藏越界。
    cy = 61.5 + (t+b)*.25; ry = Math.min(6.5,(b-t)*.25); rx *= .95;
    lid = l(`M${o+2} 130Q${cx} 138 ${i-3} 131`,'#bc8794',.9);
  } else if (emotion === 'surprised') {
    upper = `M${o} 118C${o+2} ${t-6} ${i-3} ${t-6} ${i} 118`;
    shape = `${upper}C${i-2} 139 ${o+2} 139 ${o} 118Z`;
    cy = 120; ry = 7; rx *= .77;
  } else if (emotion === 'shy') {
    upper = `M${o} 119Q${cx} 117 ${i} 119`;
    shape = `${upper}Q${cx} ${b+7} ${o} 119Z`;
    cy = 123; ry = 4.3; rx *= .92;
    lid = l(`M${o+5} 115Q${cx} 112 ${i-3} 114`,'#cfaaa3',.9);
  } else {
    const lift = emotion === 'happy' ? 2 : 0;
    upper = `M${o} ${119-d.tilt}C${o+6} ${t-lift} ${i-7} ${t-lift} ${i} 119`;
    shape = `${upper}Q${cx} ${b+4} ${o} ${119-d.tilt}Z`;
  }
  const whites = `<g data-eye-whites="true">${bilateral(p(shape,'#fffbf6','#bf9d9f',.7))}</g>`;
  // 虹膜、瞳孔及高光都服从本眼型；小眼型不再沿用固定尺寸高光。
  const iris = (x: number) => `<g data-iris="true">${e(x,cy,rx,ry,'url(#iris)')}${e(x,cy-ry*.1,rx*.38,ry*.72,'#383246')}${e(x-rx*.32,cy-ry*.3,rx*.24,ry*.31,'#fffdf8')}${e(x+rx*.35,cy+ry*.43,rx*.13,ry*.15,'#fff6d6')}</g>`;
  const lashes = bilateral(l(upper,ink,d.weight)+lid+(female ? l(`M${o} ${emotion === 'angry' ? 113 : 119-d.tilt}L${o-3} ${emotion === 'angry' ? 109 : 114-d.tilt}`,ink,1.5) : ''));
  return whites + iris(cx) + iris(256-cx) + lashes;
}
export function expressionArt(look: Look): string {
  const d = eyeDesign(look), { outer: o, inner: i, center: cx } = d;
  const browColor = look.hairColor === 'silver' ? '#797991' : hairs[look.hairColor].base;
  const brows: Record<Look['expression'], string> = {
    neutral: `M${o+2} ${d.brow+2}Q${cx} ${d.brow-2} ${i-2} ${d.brow+2}`,
    smile: `M${o+2} ${d.brow+1}Q${cx} ${d.brow-5} ${i-2} ${d.brow+1}`,
    happy: `M${o+2} ${d.brow-1}Q${cx} ${d.brow-8} ${i-2} ${d.brow-2}`,
    laugh: `M${o+2} 101Q${cx} 94 ${i-2} 100`,
    angry: `M${o+2} 98L${i-2} 110`,
    sad: `M${o+2} 106Q${cx} 102 ${i-2} 96`,
    surprised: `M${o+2} 94Q${cx} 85 ${i-2} 93`,
    shy: `M${o+2} 106Q${cx} 103 ${i-2} 99`,
  };
  const blush = look.expression === 'shy' ? .40 : ['happy','laugh'].includes(look.expression) ? .22 : .09;
  let mood = `<g opacity="${blush}">${bilateral(e(94,143,13,5,'#e8899a'))}</g>`;
  if (look.expression === 'shy') mood += bilateral(l('M86 141L84 145M92 141L90 145M98 141L96 145','#d78596',1));
  if (look.expression === 'sad') mood += bilateral(p(`M${o+5} 131Q${o} 137 ${o+4} 141Q${o+9} 141 ${o+5} 131Z`,'#c4e4f0')+e(o+4,136,1,2,'#f3feff'));
  return `<g data-expression="${look.expression}" data-eye-family="${look.frame}:${look.face}">${mood}${bilateral(l(brows[look.expression],browColor,look.frame === 'female.adult' ? 1.7 : 2.4))}${eyes(look)}${mouthArt(look)}</g>`;
}
