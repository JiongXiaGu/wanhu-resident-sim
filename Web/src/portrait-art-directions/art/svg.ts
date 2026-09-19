/** 仅共享 SVG 基元；三个方向不共享脸、五官、发型或服饰几何。 */
export type StudyRole = 'woman' | 'man' | 'elder' | 'child' | 'noble' | 'ruler';
export type StudyArt = Readonly<Record<StudyRole, string>>;
export const p = (d: string, fill: string, stroke = 'none', width = 1, opacity = 1) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const l = (d: string, stroke: string, width = 1, opacity = 1) => p(d, 'none', stroke, width, opacity);
export const e = (x:number,y:number,rx:number,ry:number,fill:string,opacity=1) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
export const svg = (body:string,defs='') =>
 `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs>${defs}</defs>${body}</svg>`;
