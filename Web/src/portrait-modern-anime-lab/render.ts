import {parseLook,type Look} from './model';
import {defs} from './art/drawing';
import {faceBase,expressionArt,neckArt} from './art/faces';
import {hairArt} from './art/hair';
import {outfitArt,headwearArt} from './art/wardrobe';
export function layers(look:Look):{id:string;svg:string}[]{
 const hair=hairArt(look),hat=headwearArt(look);
 return [{id:'BackHeadwear',svg:hat.back},{id:'BackHair',svg:hair.back},{id:'HairCrown',svg:hair.top},{id:'Neck',svg:neckArt(look)},{id:'Outfit',svg:outfitArt(look)},{id:'FaceBase',svg:faceBase(look)},{id:'Expression',svg:expressionArt(look)},{id:'FrontHair',svg:hair.front},{id:'FrontHeadwear',svg:hat.front}];
}
export function portrait(look:Look):string{
 return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${defs(look)}${layers(look).map(layer=>`<g data-layer="${layer.id}">${layer.svg}</g>`).join('')}</svg>`;
}
export const src=(look:Look)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(portrait(look));
export function download(blob:Blob,name:string):void{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
export async function exportPng(look:Look):Promise<void>{
 const img=new Image();img.src=src(parseLook(look));await img.decode();
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('浏览器无法创建导出画布。');ctx.drawImage(img,0,0,1024,1024);
 const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('透明 PNG 导出失败。');download(blob,'wanhu-modern-anime.png');
}
