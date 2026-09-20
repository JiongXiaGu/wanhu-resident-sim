import {frames,parseRecipe,type Frame,type PackId,type Recipe} from './model';
import {avatarPacks,getPack,packCatalog} from './packs/registry';
import type {AvatarPack,Layer} from './packs/types';

export {avatarPacks,packCatalog};
export type {AvatarPack,Layer};

export function renderLayers(frame:Frame,recipe:Recipe):Layer[] {
 const safe=parseRecipe(recipe);
 if(!frames.includes(frame))throw new Error('头像素材不支持此年龄与性别。');
 return getPack(safe.pack).layers(frame,safe);
}
export const svgDocument=(inner:string,pack:PackId='linework-v1')=>{const definition=getPack(pack);return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="${definition.viewBox}">${definition.defs()}${inner}</svg>`;};
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
