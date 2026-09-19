import type {Look} from '../model';
export const p=(d:string,fill:string,stroke='none',w=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
export const l=(d:string,stroke:string,w=1,opacity=1)=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const e=(x:number,y:number,rx:number,ry:number,fill:string,opacity=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
export const both=(svg:string)=>svg+`<g transform="translate(512 0) scale(-1 1)">${svg}</g>`;
export const group=(id:string,svg:string)=>`<g data-part="${id}">${svg}</g>`;
export const skinColors={fair:{base:'#ffe8d9',light:'#fff4e8',shadow:'#e6b4a7',line:'#b5807d',blush:'#e9a6a2'},warm:{base:'#e6b997',light:'#f7d5b2',shadow:'#c48775',line:'#965c51',blush:'#c88678'},deep:{base:'#bd8b6f',light:'#d9aa86',shadow:'#925d54',line:'#754642',blush:'#b17770'}};
export const hairColors={ink:{dark:'#18232f',base:'#283e50',mid:'#496679',light:'#7995a5',edge:'#a5c0c8'},brown:{dark:'#342532',base:'#503946',mid:'#805563',light:'#b9848a',edge:'#e9b9a8'},silver:{dark:'#62677c',base:'#939aaf',mid:'#bcc7d5',light:'#eef0ef',edge:'#ffffff'}};
export const clothColors={jade:{deep:'#164653',base:'#367a82',mid:'#70b1af',light:'#c6e7d7',accent:'#d0b573'},midnight:{deep:'#172c43',base:'#324a68',mid:'#687994',light:'#c5d3e0',accent:'#b4c8ce'},vermilion:{deep:'#4e2039',base:'#903952',mid:'#bf6879',light:'#f0b7ac',accent:'#dfba70'}};
export const irisColors={luminous:['#453957','#b48855','#f3d8a0'],refined:['#2b5360','#5dada4','#cce9c7'],resolute:['#3f4567','#8593bf','#d6cdec']};
export function defs(look:Look){
 const s=skinColors[look.skin],h=hairColors[look.hairColor],c=clothColors[look.palette],i=irisColors[look.face];
 return `<defs>
 <linearGradient id="skin" x1=".15" y1="0" x2=".88" y2="1"><stop stop-color="${s.light}"/><stop offset=".53" stop-color="${s.base}"/><stop offset="1" stop-color="${s.shadow}"/></linearGradient>
 <radialGradient id="cheek"><stop stop-color="${s.blush}" stop-opacity=".44"/><stop offset="1" stop-color="${s.blush}" stop-opacity="0"/></radialGradient>
 <linearGradient id="hair" x1=".17" y1="0" x2=".78" y2="1"><stop stop-color="${h.mid}"/><stop offset=".36" stop-color="${h.base}"/><stop offset=".74" stop-color="${h.dark}"/><stop offset="1" stop-color="${h.mid}"/></linearGradient>
 <linearGradient id="ribbonHair" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="${h.base}"/><stop offset=".42" stop-color="${h.light}"/><stop offset=".56" stop-color="${h.mid}"/><stop offset="1" stop-color="${h.dark}"/></linearGradient>
 <linearGradient id="shine" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="${h.edge}" stop-opacity="0"/><stop offset=".4" stop-color="${h.edge}" stop-opacity=".6"/><stop offset="1" stop-color="${h.edge}" stop-opacity="0"/></linearGradient>
 <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.mid}"/><stop offset=".42" stop-color="${c.base}"/><stop offset="1" stop-color="${c.deep}"/></linearGradient>
 <linearGradient id="silk" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff6df"/><stop offset=".4" stop-color="#e4e5d5"/><stop offset=".8" stop-color="${c.light}"/><stop offset="1" stop-color="${c.mid}"/></linearGradient>
 <linearGradient id="gold" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#fae3a7"/><stop offset=".35" stop-color="#b78f4e"/><stop offset=".55" stop-color="#f8d890"/><stop offset="1" stop-color="#8c6840"/></linearGradient>
 <linearGradient id="iris" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${i[0]}"/><stop offset=".48" stop-color="${i[1]}"/><stop offset="1" stop-color="${i[2]}"/></linearGradient>
 <linearGradient id="white" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d6c7d3"/><stop offset=".35" stop-color="#fff8f2"/><stop offset="1" stop-color="#fffdf3"/></linearGradient>
 <linearGradient id="jade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dcebd0"/><stop offset=".4" stop-color="#82beb0"/><stop offset="1" stop-color="#1e656b"/></linearGradient>
 </defs>`;
}
// 云纹与叶纹只属于衣装/配饰，不进入脸或身份数据。
export const cloud=(x:number,y:number,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">${l('M-21 4Q-32-5-22-12Q-13-19-5-9Q-7-25 8-23Q21-24 22-12Q34-15 36-3Q37 7 23 7H-9Q-17 7-14 0Q-12-6-4-2Q2 1 8-2Q13-6 10-12','#d9c48c',1.4,.85)}</g>`;
export const leaf=(x:number,y:number,rotation=0)=>`<g transform="translate(${x} ${y}) rotate(${rotation})">${p('M0 0Q-18-8-16-26Q-1-19 0 0Z','url(#gold)')+l('M0 0L-13-22','#fff0bc',.8)}</g>`;
