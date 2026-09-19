import { frames, options, parseRecipe, type Frame, type Recipe } from './model';
import { faceBase, expressionArt, neckArt } from './packs/linework/faces';
import { hairArt } from './packs/linework/hair';
import { outfitArt } from './packs/linework/outfits';
export type Layer = { id:'BackHair'|'Neck'|'Outfit'|'FaceBase'|'Expression'|'FrontHair'; svg:string };
export type AvatarPack = { id:string; version:number; title:string; viewBox:string; frames:readonly Frame[]; options:typeof options; layers:(frame:Frame,recipe:Recipe)=>Layer[] };
// 一套编辑器加载画风包。先交付这一包，不再创建新的实验页面或固定人物画廊。
export const lineworkPack: AvatarPack = {
  id:'linework-v1',version:1,title:'日常线绘',viewBox:'0 0 320 320',frames,options,
  layers(frame,recipe) {
    const hair=hairArt(frame,recipe.hair);
    return [
      {id:'BackHair',svg:hair.back},
      {id:'Neck',svg:neckArt(frame)},
      {id:'Outfit',svg:outfitArt(frame,recipe.outfit)},
      {id:'FaceBase',svg:faceBase(frame,recipe.face)},
      {id:'Expression',svg:expressionArt(frame,recipe.face,recipe.expression)},
      {id:'FrontHair',svg:hair.front},
    ];
  },
};
export function renderLayers(frame:Frame,recipe:Recipe):Layer[] {
  if(!frames.includes(frame))throw new Error('头像素材不支持此年龄与性别。');
  return lineworkPack.layers(frame,parseRecipe(recipe));
}
export const svgDocument=(inner:string)=>`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">${inner}</svg>`;
export const renderAvatar=(frame:Frame,recipe:Recipe)=>svgDocument(renderLayers(frame,recipe).map(layer=>`<g data-layer="${layer.id}">${layer.svg}</g>`).join(''));
export const avatarSource=(frame:Frame,recipe:Recipe)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(renderAvatar(frame,recipe));
export function downloadFile(blob:Blob,name:string):void {
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function downloadPng(frame:Frame,recipe:Recipe):Promise<void>{
  const image=new Image();image.src=avatarSource(frame,recipe);await image.decode();
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=640;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('无法创建 PNG 导出画布。');
  ctx.drawImage(image,0,0,640,640);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG 导出失败。');
  downloadFile(blob,'wanhu-avatar.png');
}
