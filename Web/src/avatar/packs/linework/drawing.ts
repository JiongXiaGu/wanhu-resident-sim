import type { Frame } from '../../model';
// 只共享 SVG 基元；画风包自己拥有坐标、笔触、颜色和部件。不是自动对齐器。
export const p = (d: string, fill: string, stroke = 'none', width = 1) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
export const l = (d: string, stroke = '#5c4d58', width = 1.4, opacity = 1) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const e = (x: number,y: number,rx: number,ry: number,fill: string,opacity = 1) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
export const mirror = (svg: string) => svg + `<g transform="translate(320 0) scale(-1 1)">${svg}</g>`;
export const hairColors = (frame: Frame) => frame.endsWith('elder') ? { dark:'#646775',base:'#999ba6',mid:'#bfc0c7',shine:'#e8e4db',ink:'#535460' } : { dark:'#262937',base:'#3b3d50',mid:'#5b5c73',shine:'#9291a4',ink:'#262631' };
export const skin = { base:'#f3d2ba',light:'#f9dfc9',shade:'#dba996',line:'#9b746c',cheek:'#df9c92' };
export const isChild = (f: Frame) => f.endsWith('child');
export const isElder = (f: Frame) => f.endsWith('elder');
export const isFemale = (f: Frame) => f.startsWith('female');
