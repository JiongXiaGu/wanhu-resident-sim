import { parseLook, type Look } from './model';
import { faceArt, neckArt } from './art/faces';
import { hairArt } from './art/hair';
import { outfitArt } from './art/outfits';
import { headwearArt } from './art/headwear';
export type Layer = { name: string; svg: string };
export function renderPlan(look: Look): Layer[] {
  const hair = hairArt(look), hat = headwearArt(look);
  return [
    { name: 'BackHeadwear', svg: hat.back },
    { name: 'BackHair', svg: hair.back },
    { name: 'HairVolume', svg: hair.top },
    { name: 'Neck', svg: neckArt(look) },
    { name: 'Outfit', svg: outfitArt(look) },
    { name: 'Face', svg: faceArt(look) },
    { name: 'FrontHair', svg: hair.front },
    { name: 'FrontHeadwear', svg: hat.front },
  ];
}
export function renderPortrait(look: Look): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${renderPlan(look).map(layer => `<g data-layer="${layer.name}">${layer.svg}</g>`).join('')}</svg>`;
}
export const imageSource = (look: Look): string => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(renderPortrait(look));
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function exportPng(look: Look): Promise<void> {
  const image = new Image(); image.src = imageSource(parseLook(look)); await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('浏览器无法创建导出画布。');
  ctx.drawImage(image, 0, 0, 512, 512);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG 导出失败。');
  downloadBlob(blob, 'wanhu-composer.png');
}
