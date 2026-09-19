import { frames, options, packOptions, parseRecipe, type Frame, type PackId, type Recipe } from './model';
import { faceBase as lineFace, expressionArt as lineExpression, neckArt as lineNeck } from './packs/linework/faces';
import { hairArt as lineHair } from './packs/linework/hair';
import { outfitArt as lineOutfit } from './packs/linework/outfits';
import { faceBase as softFace, expressionArt as softExpression, neckArt as softNeck } from './packs/softpaint/faces';
import { hairArt as softHair } from './packs/softpaint/hair';
import { outfitArt as softOutfit } from './packs/softpaint/outfits';
import { softPaintDefs } from './packs/softpaint/drawing';

export type Layer = { id:'BackHair'|'Neck'|'Outfit'|'FaceBase'|'Expression'|'FrontHair'; svg:string };
export type AvatarPack = {
  id:PackId;
  title:string;
  note:string;
  viewBox:'0 0 320 320';
  frames:readonly Frame[];
  options:typeof options;
  defs:()=>string;
  layers:(frame:Frame,recipe:Recipe)=>Layer[];
};

export const lineworkPack:AvatarPack={
 id:'linework-v1',title:'日常线绘',note:'清晰描边 · 色块简洁',viewBox:'0 0 320 320',frames,options,defs:()=>'',layers(frame,recipe){
  const hair=lineHair(frame,recipe.hair);
  return [
   {id:'BackHair',svg:hair.back},{id:'Neck',svg:lineNeck(frame)},{id:'Outfit',svg:lineOutfit(frame,recipe.outfit)},
   {id:'FaceBase',svg:lineFace(frame,recipe.face)},{id:'Expression',svg:lineExpression(frame,recipe.face,recipe.expression)},{id:'FrontHair',svg:hair.front},
  ];
 }
};
export const softPaintPack:AvatarPack={
 id:'soft-paint-v1',title:'柔光插画',note:'弱描边 · 柔和体积光',viewBox:'0 0 320 320',frames,options,defs:softPaintDefs,layers(frame,recipe){
  const hair=softHair(frame,recipe.hair);
  return [
   {id:'BackHair',svg:hair.back},{id:'Neck',svg:softNeck(frame)},{id:'Outfit',svg:softOutfit(frame,recipe.outfit)},
   {id:'FaceBase',svg:softFace(frame,recipe.face)},{id:'Expression',svg:softExpression(frame,recipe.face,recipe.expression)},{id:'FrontHair',svg:hair.front},
  ];
 }
};
export const avatarPacks:Record<PackId,AvatarPack>={'linework-v1':lineworkPack,'soft-paint-v1':softPaintPack};
export const packCatalog=packOptions.map(meta=>({...meta,viewBox:avatarPacks[meta.id].viewBox}));
export const getPack=(id:PackId):AvatarPack=>avatarPacks[id];

export function renderLayers(frame:Frame,recipe:Recipe):Layer[] {
 const safe=parseRecipe(recipe);
 if(!frames.includes(frame))throw new Error('头像素材不支持此年龄与性别。');
 return getPack(safe.pack).layers(frame,safe);
}
export const svgDocument=(inner:string,pack:PackId='linework-v1')=>`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">${getPack(pack).defs()}${inner}</svg>`;
export const renderAvatar=(frame:Frame,recipe:Recipe)=>{const safe=parseRecipe(recipe);return svgDocument(renderLayers(frame,safe).map(layer=>`<g data-layer="${layer.id}">${layer.svg}</g>`).join(''),safe.pack);};
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
