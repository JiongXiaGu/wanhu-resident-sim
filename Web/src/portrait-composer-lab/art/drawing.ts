import type { Look } from '../model';
export const p = (d: string, fill: string, stroke = 'none', width = 1) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
export const l = (d: string, stroke: string, width = 1) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const e = (x: number, y: number, rx: number, ry: number, fill: string) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
export const skins = {
  ivory: { base: '#f1d8b9', light: '#fae6ca', shade: '#d3a78a', line: '#a77b65', blush: '#e2ad96', lip: '#b77770' },
  peach: { base: '#eac3a0', light: '#f4d6b4', shade: '#c58f70', line: '#976b55', blush: '#dea48a', lip: '#a86860' },
  wheat: { base: '#cca076', light: '#ddb78b', shade: '#ab7756', line: '#84573f', blush: '#c99174', lip: '#955e50' },
  umber: { base: '#a97c5b', light: '#bc936e', shade: '#83583f', line: '#704932', blush: '#ac755e', lip: '#754a40' },
};
export const hairs = {
  ink: { base: '#2e393b', light: '#465754', line: '#718177' },
  brown: { base: '#544037', light: '#79594a', line: '#a18368' },
  ash: { base: '#57584e', light: '#787b69', line: '#a1a08c' },
  silver: { base: '#9b9d92', light: '#c5c6b7', line: '#e6e1ce' },
};
export const cloths = {
  jade: { base: '#698f81', shade: '#40685f', light: '#96afa0', trim: '#e7ddbc', ink: '#38564f' },
  blue: { base: '#617d94', shade: '#3b546e', light: '#95aab4', trim: '#e4dec8', ink: '#344b61' },
  red: { base: '#a16b68', shade: '#794d53', light: '#c39385', trim: '#e8d5b6', ink: '#6c4650' },
  gold: { base: '#b39a64', shade: '#877046', light: '#d1bf90', trim: '#f0e0b5', ink: '#6d5a3f' },
};
export type Skin = typeof skins[Look['skinPaletteId']];
export type HairColor = typeof hairs[Look['baseHairColorId']];
export type Cloth = typeof cloths[Look['outfitPaletteId']];
export function iris(x: number, y: number, radius = 3.4) { return e(x, y, radius, radius + .6, '#595044') + e(x, y + .2, radius * .48, radius * .77, '#2e3833') + e(x + .8, y - 1.3, .9, .9, '#fff6e1'); }
