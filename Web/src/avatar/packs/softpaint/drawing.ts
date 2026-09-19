import type {Frame} from '../../model';
export const p=(d:string,fill:string,opacity=1)=>`<path d="${d}" fill="${fill}" opacity="${opacity}"/>`;
export const l=(d:string,stroke:string,width=1.2,opacity=1)=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
export const e=(x:number,y:number,rx:number,ry:number,fill:string,opacity=1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
export const mirror=(svg:string)=>svg+`<g transform="translate(320 0) scale(-1 1)">${svg}</g>`;
export const isFemale=(f:Frame)=>f.startsWith('female');
export const isChild=(f:Frame)=>f.endsWith('child');
export const isElder=(f:Frame)=>f.endsWith('elder');
export const hairFill=(f:Frame)=>isElder(f)?'url(#sp-hair-elder)':'url(#sp-hair)';
export const hairShadow=(f:Frame)=>isElder(f)?'#777985':'#30323f';
export const hairLight=(f:Frame)=>isElder(f)?'#e4e0dc':'#88879b';
export function softPaintDefs():string{return `<defs>
<linearGradient id="sp-skin" x1=".2" y1=".05" x2=".82" y2=".95"><stop offset="0" stop-color="#fde7d6"/><stop offset=".52" stop-color="#f2cdb4"/><stop offset="1" stop-color="#d99e8e"/></linearGradient>
<linearGradient id="sp-neck" x1=".1" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#f4ccb5"/><stop offset=".72" stop-color="#d89c8d"/><stop offset="1" stop-color="#c9877f"/></linearGradient>
<radialGradient id="sp-cheek"><stop stop-color="#d9898d" stop-opacity=".5"/><stop offset="1" stop-color="#d9898d" stop-opacity="0"/></radialGradient>
<linearGradient id="sp-hair" x1=".13" y1=".05" x2=".9" y2=".96"><stop offset="0" stop-color="#686679"/><stop offset=".24" stop-color="#464656"/><stop offset=".68" stop-color="#292b38"/><stop offset="1" stop-color="#4c4c61"/></linearGradient>
<linearGradient id="sp-hair-elder" x1=".15" y1="0" x2=".88" y2="1"><stop offset="0" stop-color="#eee9e4"/><stop offset=".35" stop-color="#c8c5ca"/><stop offset=".78" stop-color="#898a96"/><stop offset="1" stop-color="#b9b6bc"/></linearGradient>
<linearGradient id="sp-hair-glow" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".47" stop-color="#f6edf0" stop-opacity=".48"/><stop offset=".72" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="sp-iris" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4e506c"/><stop offset=".48" stop-color="#7b7898"/><stop offset="1" stop-color="#c09aa0"/></linearGradient>
<linearGradient id="sp-tee" x1="0" y1="0" x2=".92" y2="1"><stop offset="0" stop-color="#c7b7cf"/><stop offset=".58" stop-color="#9a92ad"/><stop offset="1" stop-color="#716f84"/></linearGradient>
<linearGradient id="sp-shirt" x1=".1" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#b9d2dc"/><stop offset=".55" stop-color="#809fb2"/><stop offset="1" stop-color="#5f748b"/></linearGradient>
<linearGradient id="sp-knit" x1=".15" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#efd2b3"/><stop offset=".56" stop-color="#c69d7e"/><stop offset="1" stop-color="#927162"/></linearGradient>
<linearGradient id="sp-jacket" x1=".12" y1="0" x2=".85" y2="1"><stop stop-color="#7d8299"/><stop offset=".56" stop-color="#53596f"/><stop offset="1" stop-color="#373b50"/></linearGradient>
<linearGradient id="sp-fabric-light" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#fff" stop-opacity=".58"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>`;}
