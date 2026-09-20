import type {Frame} from '../../model';

// simple-flat-v1 完全自有坐标、颜色与笔触；不导入其他画风的 geometry。
export const INK='#3f4145';
export const SOFT_INK='#66686d';
export const SKIN='#f5ded1';
export const SKIN_WARM='#e9c3b4';
export const BLUSH='#e7a5a0';

export const p=(d:string,fill:string,stroke=INK,width=3,opacity=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const l=(d:string,stroke=INK,width=3,opacity=1)=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const e=(x:number,y:number,rx:number,ry:number,fill:string,stroke='none',width=0,opacity=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`;
export const c=(x:number,y:number,r:number,fill:string,stroke='none',width=0,opacity=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`;
export const mirror=(svg:string)=>svg+`<g transform="translate(320 0) scale(-1 1)">${svg}</g>`;

export const isFemale=(f:Frame)=>f.startsWith('female');
export const isChild=(f:Frame)=>f.endsWith('child');
export const isElder=(f:Frame)=>f.endsWith('elder');

export const hairColor=(frame:Frame)=>isElder(frame)?'#8d9095':isFemale(frame)?'#3f3e40':'#393a3d';
export const hairShade=(frame:Frame)=>isElder(frame)?'#73767b':'#292a2d';
export const hairLine=(frame:Frame)=>isElder(frame)?'#676a70':'#303136';
