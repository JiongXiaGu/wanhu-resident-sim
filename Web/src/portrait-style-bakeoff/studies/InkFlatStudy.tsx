import { StudySection, type BakeoffRole } from '../BakeoffShared';
const I={paper:'#f1ede3',ink:'#343735',skin:'#d1a080',wash:'#667977',red:'#875a57',blue:'#657783',cream:'#ded4bf',gold:'#b39a67',gray:'#777a77'};
function Face({male=false,elder=false}:{male?:boolean;elder?:boolean}){return <g>
  <path d={male?'M120 65c-28 0-43 23-42 62 1 42 17 65 42 66 26-1 43-24 44-66 1-39-16-62-44-62Z':'M120 64c-27 0-42 23-41 61 1 42 17 65 41 66 25-1 41-24 42-66 1-38-15-61-42-61Z'} fill={elder?'#c39777':I.skin} opacity=".92"/>
  <path d="M91 116q10-5 20 0m18 0q10-5 20 0" fill="none" stroke={I.ink} strokeWidth="1.4" strokeLinecap="round"/>
  <circle cx="101" cy="116" r="1.8" fill={I.ink}/><circle cx="139" cy="116" r="1.8" fill={I.ink}/>
  <path d="M119 122q-1 11 4 16l8-3" fill="none" stroke="#7f5d4b" strokeWidth="1.2" strokeLinecap="round"/>
  <path d="M108 158q12 4 24 0" fill="none" stroke="#805653" strokeWidth="1.35" strokeLinecap="round"/>
  {elder&&<path d="M88 135q9 4 18 2m28 0q9 2 18-2" fill="none" stroke="#98715c" strokeWidth=".8" opacity=".65"/>}
</g>}
function Hair({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}){const h=elder?I.gray:I.ink;return <g fill={h}>
  <path d={male?'M74 116q3-67 47-67 46 0 49 69l-15-40q-16-16-35-16-21 0-36 19Z':'M72 118q1-69 48-69 49 0 50 72l-15-43q-17-16-36-16-22 0-37 20Z'} opacity=".96"/>
  {male?<path d="M105 51q15-19 31 0l-3 17h-31Z" opacity=".96"/>:<><ellipse cx="71" cy="78" rx={royal?17:12} ry={royal?19:14}/><ellipse cx="170" cy="82" rx={royal?15:9} ry={royal?18:12}/></>}
  <path d="M80 90q16-18 35-27m45 28q-14-19-33-28" fill="none" stroke="#6d7470" strokeWidth="1.3" opacity=".65"/>
</g>}
function Robe({fill,royal=false}:{fill:string;royal?:boolean}){return <g>
  <path d="M48 300q5-60 44-101l28 22 29-22q38 41 43 101Z" fill={fill} opacity=".92"/>
  <path d="m92 199 28 22-18 23-36-32m83-13-29 22 19 23 35-32" fill={I.cream} opacity=".9"/>
  <path d="M69 251q50 14 101 0" fill="none" stroke={I.ink} strokeWidth="1.1" opacity=".35"/>
  {royal&&<><path d="M79 270q41 12 82 0" fill="none" stroke={I.gold} strokeWidth="2.3"/><circle cx="120" cy="266" r="16" fill="none" stroke={I.gold} strokeWidth="1.8"/></>}
</g>}
function Wash({side='left'}:{side?:'left'|'right'}){return <path d={side==='left'?'M0 0h87q-34 76-21 144 8 47-66 93Z':'M240 0h-82q31 70 19 139-9 55 63 99Z'} fill="#7b8d8a" opacity=".09"/>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={I.paper}/><Wash/><Hair/><Face/><Robe fill={I.wash}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee9df"/><Wash side="right"/><Hair male/><Face male/><Robe fill={I.blue}/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f0ebe2"/><Wash/><Hair male elder/><Face male elder/><Robe fill="#77736d"/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f2ede4"/><Wash side="right"/><Hair royal/><path d="M62 59 80 35m99 26-17-25" stroke={I.gold} strokeWidth="2.4" strokeLinecap="round"/><circle cx="81" cy="34" r="3.7" fill="#a95e5b"/><circle cx="160" cy="35" r="3.7" fill="#a95e5b"/><Face/><Robe fill="#79666f" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee9df"/><Wash/><Hair male/><path d="M82 59h76l-5-27H88Z" fill="#303331"/><path d="M84 43 61 51m96-8 23 8" stroke="#303331" strokeWidth="6" strokeLinecap="round"/><Face male/><Robe fill={I.red} royal/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function InkFlatStudy(){return <StudySection id="ink-flat" letter="F · INK-WASH FLAT HYBRID" title="水墨扁平混合 / 简化工笔感" subtitle="保留 SVG 的平面结构，但用轻透明洗色、极细五官线和墨色大形制造更安静的中国绘画气质，不依赖真实纸纹或复杂滤镜。" tags={['透明洗色','细墨线','安静气质','国风辨识度']} renderPortrait={portrait}/>}
