import { frames, options, packOptions, parseRecipe, type Frame, type PackId, type Recipe } from './model';
import { faceBase as lineFace, expressionArt as lineExpression, neckArt as lineNeck } from './packs/linework/faces';
import { hairArt as lineHair } from './packs/linework/hair';
import { outfitArt as lineOutfit } from './packs/linework/outfits';
import { faceBase as chibiFace, expressionArt as chibiExpression, neckArt as chibiNeck } from './packs/chibi/faces';
import { hairArt as chibiHair } from './packs/chibi/hair';
import { outfitArt as chibiOutfit } from './packs/chibi/outfits';
import { chibiDefs } from './packs/chibi/drawing';
import { faceBase as simpleFace, expressionArt as simpleExpression, neckArt as simpleNeck } from './packs/simple-flat/faces';
import { hairArt as simpleHair } from './packs/simple-flat/hair';
import { outfitArt as simpleOutfit } from './packs/simple-flat/outfits';

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

export const chibiCutePack:AvatarPack={
 id:'chibi-cute-v1',title:'Q版可爱',note:'大头比例 · 豆豆眼 · 贴纸感',viewBox:'0 0 320 320',frames,options,defs:chibiDefs,layers(frame,recipe){
  const hair=chibiHair(frame,recipe.hair);
  return [
   {id:'BackHair',svg:hair.back},{id:'Neck',svg:chibiNeck(frame)},{id:'Outfit',svg:chibiOutfit(frame,recipe.outfit)},
   {id:'FaceBase',svg:chibiFace(frame,recipe.face)},{id:'Expression',svg:chibiExpression(frame,recipe.face,recipe.expression)},{id:'FrontHair',svg:hair.front},
  ];
 }
};

export const simpleFlatPack:AvatarPack={
 id:'simple-flat-v1',title:'极简简笔',note:'极简线稿 · 平面色块 · 图标式头像',viewBox:'0 0 320 320',frames,options,defs:()=>'',layers(frame,recipe){
  const hair=simpleHair(frame,recipe.hair);
  return [
   {id:'BackHair',svg:hair.back},{id:'Neck',svg:simpleNeck(frame)},{id:'Outfit',svg:simpleOutfit(frame,recipe.outfit)},
   {id:'FaceBase',svg:simpleFace(frame,recipe.face)},{id:'Expression',svg:simpleExpression(frame,recipe.face,recipe.expression)},{id:'FrontHair',svg:hair.front},
  ];
 }
};

export const avatarPacks:Record<PackId,AvatarPack>={'linework-v1':lineworkPack,'chibi-cute-v1':chibiCutePack,'simple-flat-v1':simpleFlatPack};
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
