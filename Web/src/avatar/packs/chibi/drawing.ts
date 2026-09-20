import type {Frame} from '../../model';

export const OUTLINE='#4b332f';
export const SKIN='#fff3e8';
export const SKIN_SHADOW='#f0b8af';
export const CHEEK='#f49ca2';
export const EYE='#5a3a30';

export const p=(d:string,fill:string,stroke=OUTLINE,width=4,opacity=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const l=(d:string,stroke=OUTLINE,width=4,opacity=1)=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const e=(x:number,y:number,rx:number,ry:number,fill:string,stroke=OUTLINE,width=4,opacity=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`;
export const mirror=(svg:string)=>svg+`<g transform="translate(320 0) scale(-1 1)">${svg}</g>`;
export const isFemale=(f:Frame)=>f.startsWith('female');
export const isChild=(f:Frame)=>f.endsWith('child');
export const isElder=(f:Frame)=>f.endsWith('elder');

export const hairColor=(frame:Frame)=>isElder(frame)?'#a9a6ad':'#3b2723';
export const hairLight=(frame:Frame)=>isElder(frame)?'#d9d6db':'#73504a';
export const hairDark=(frame:Frame)=>isElder(frame)?'#77737d':'#2c1c19';

export function chibiDefs():string{
 return `<defs>
  <linearGradient id="cb-skin" x1=".15" y1=".05" x2=".82" y2=".95"><stop stop-color="#fff9f2"/><stop offset=".62" stop-color="#fff1e6"/><stop offset="1" stop-color="#efc9b5"/></linearGradient>
  <linearGradient id="cb-tee" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7c7e7"/><stop offset="1" stop-color="#b09fc6"/></linearGradient>
  <linearGradient id="cb-shirt" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dcebf1"/><stop offset="1" stop-color="#9bb8c7"/></linearGradient>
  <linearGradient id="cb-knit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2d7b6"/><stop offset="1" stop-color="#d0aa82"/></linearGradient>
  <linearGradient id="cb-jacket" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8d94ac"/><stop offset="1" stop-color="#596075"/></linearGradient>
 </defs>`;
}
