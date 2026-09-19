import type { Look } from './model';
import { definitions } from './art/drawing';
import { faceBase, neckArt } from './art/faces';
import { expressionArt } from './art/expressions';
import { hairArt } from './art/hair';
import { headwearArt, outfitArt } from './art/wardrobe';
export type Layer = { name: string; svg: string };
export function renderPlan(look: Look): Layer[] {
  const hair = hairArt(look), hat = headwearArt(look);
  return [
    { name: 'BackHeadwear', svg: hat.back }, { name: 'BackHair', svg: hair.back },
    { name: 'HairCrown', svg: hair.crown }, { name: 'Neck', svg: neckArt(look) },
    { name: 'Outfit', svg: outfitArt(look) }, { name: 'FaceBase', svg: faceBase(look) },
    { name: 'Expression', svg: expressionArt(look) }, { name: 'FrontHair', svg: hair.front },
    { name: 'FrontHeadwear', svg: hat.front },
  ];
}
export function renderPortrait(look: Look): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${definitions(look)}${renderPlan(look).map(layer => `<g data-layer="${layer.name}">${layer.svg}</g>`).join('')}</svg>`;
}
export const imageSource = (look: Look): string => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(renderPortrait(look));
export function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function exportPng(look: Look): Promise<void> {
  const image = new Image(); image.src = imageSource(look); await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('无法创建导出画布。');
  ctx.drawImage(image, 0, 0, 512, 512);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG 导出失败。');
  download(blob, 'wanhu-anime.png');
}
