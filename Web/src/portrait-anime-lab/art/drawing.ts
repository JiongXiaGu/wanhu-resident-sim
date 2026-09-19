import type { Look } from '../model';
export const p = (d: string, fill: string, stroke = 'none', width = 1) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const l = (d: string, stroke: string, width = 1) => p(d, 'none', stroke, width);
export const e = (x: number, y: number, rx: number, ry: number, fill: string) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
// 固定双侧作画，不根据脸/头发求解位置；右侧轮廓用同一中心线反射。
export const bilateral = (svg: string) => svg + `<g transform="translate(256 0) scale(-1 1)">${svg}</g>`;
export const skins = {
  porcelain: { base: '#ffe9db', shade: '#efc0b0', line: '#bd877e', light: '#fff5e9' },
  warm: { base: '#f8d4b7', shade: '#dfac93', line: '#ae7764', light: '#ffe9d1' },
  wheat: { base: '#dcb58e', shade: '#bb8b6d', line: '#97654f', light: '#ebc9a6' },
  deep: { base: '#ba8d70', shade: '#98684f', line: '#794e41', light: '#d0a589' },
};
export const hairs = {
  ink: { base: '#25374e', shade: '#19283c', light: '#435b79', shine: '#8393ad', edge: '#182639' },
  chestnut: { base: '#694342', shade: '#452e36', light: '#996559', shine: '#c9967e', edge: '#3e2c32' },
  silver: { base: '#b4b7cd', shade: '#858ba8', light: '#d9dbea', shine: '#f2f0fa', edge: '#737791' },
};
export const cloths = {
  jade: { base: '#3f9993', shade: '#276875', light: '#89d3c0', inner: '#f7eee0', trim: '#ddba74' },
  indigo: { base: '#536aab', shade: '#364775', light: '#93addb', inner: '#eee8f2', trim: '#d9c593' },
  rose: { base: '#b05e7b', shade: '#803e61', light: '#eaa4aa', inner: '#ffeddf', trim: '#dfb978' },
  gold: { base: '#b69551', shade: '#7e623c', light: '#eed092', inner: '#fff1d5', trim: '#f1d8a1' },
};
export const irises = {
  soft: { top: '#4c4559', base: '#ac7b56', light: '#edc67c' },
  round: { top: '#644650', base: '#be8660', light: '#ffcf86' },
  long: { top: '#3b4568', base: '#718cb6', light: '#b4dce5' },
  angular: { top: '#254e59', base: '#47918a', light: '#a0d5b0' },
};
export type Skin = typeof skins[Look['skin']];
export const contour = '#514259';
export const definitions = (look: Look) => {
  const iris = irises[look.face];
  return `<defs><linearGradient id="iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${iris.top}"/><stop offset="0.62" stop-color="${iris.base}"/><stop offset="1" stop-color="${iris.light}"/></linearGradient></defs>`;
};
