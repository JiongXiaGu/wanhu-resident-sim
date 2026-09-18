import { StudySection, type BakeoffRole } from '../BakeoffShared';
const I={paper:'#f3efe7',ink:'#343735',skin:'#d0a080',skinM:'#c38d6d',wash:'#6b7f7c',red:'#865956',blue:'#667986',cream:'#dfd5c1',gold:'#b29a68',gray:'#7a7d79'};
type Kind='woman'|'man'|'elder'|'princess'|'emperor';
const faceD:Record<Kind,string>={
  woman:'M116 64c-25 1-39 23-37 60 2 40 17 63 42 67 23-6 37-30 37-68 0-37-16-60-42-59Z',
  man:'M117 64c-29 1-43 24-40 62 3 40 19 63 45 67 26-7 40-31 39-69-1-37-16-61-44-60Z',
  elder:'M116 62c-27 1-41 23-39 62 2 43 18 68 43 75 24-8 38-34 38-75 0-39-15-63-42-62Z',
  princess:'M116 65c-23 1-37 22-35 58 2 38 16 59 39 63 22-6 35-28 35-64 0-36-15-58-39-57Z',
  emperor:'M118 63c-30 1-45 24-42 63 3 41 20 66 47 71 27-8 41-33 40-72-1-38-17-63-45-62Z',
};
function Face({kind}:{kind:Kind}){const male=kind==='man'||kind==='emperor';const elder=kind==='elder';return <g>
  <path d={faceD[kind]} fill={elder?'#c29677':male?I.skinM:I.skin} opacity=".9"/>
  <path d={male?'M88 107q10-4 20 0m22 0q10-4 20 0':'M91 107q9-4 18 0m21 0q9-4 18 0'} fill="none" stroke={I.ink} strokeWidth={male?1.3:1.1} strokeLinecap="round"/>
  <path d="M91 117q9-4 18 0m21 0q9-4 18 0" fill="none" stroke={I.ink} strokeWidth="1" strokeLinecap="round"/>
  <circle cx="100" cy="117" r="1.65" fill={I.ink}/><circle cx="139" cy="117" r="1.55" fill={I.ink}/>
  <path d={male?'M118 123q0 10 5 14l8-3':'M118 122q-1 10 4 14l8-3'} fill="none" stroke="#7f5d4b" strokeWidth="1" strokeLinecap="round"/>
  <path d={kind==='princess'?'M108 157q12 5 24 0':'M108 158q12 4 24 0'} fill="none" stroke="#805653" strokeWidth="1.1" strokeLinecap="round"/>
  <path d="M80 132q5 35 29 55-20-7-29-28Z" fill="#ba8265" opacity=".13"/>
  {elder&&<path d="M86 136q10 4 19 2m29 0q10 2 19-2M91 149l-8 3m66-3 8 3" fill="none" stroke="#98715c" strokeWidth=".65" opacity=".6"/>}
</g>}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={I.ink}>
  <path d="M72 124q0-68 46-68 49 0 50 71l-14-42q-16-17-35-17-23 0-38 21Z" opacity=".92"/>
  <path d="M76 87q-10 44-2 88l16 18-2-80Zm86 0q10 44 2 88l-16 18 2-80Z" opacity=".78"/>
  {royal?<><ellipse cx="74" cy="58" rx="17" ry="19"/><ellipse cx="167" cy="60" rx="15" ry="18"/></>:<ellipse cx="70" cy="94" rx="11" ry="14"/>}
  <path d="M84 83q15-19 34-27m43 28q-13-19-33-28" fill="none" stroke="#7c8580" strokeWidth=".95" opacity=".5"/>
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?I.gray:I.ink;return <g fill={h}>
  <path d="M74 123q2-64 45-64 46 0 48 67l-14-39q-16-16-34-16-21 0-35 20Z" opacity=".92"/>
  <path d="M104 61q15-18 31 0l-3 17h-31Z" opacity=".92"/>
</g>}
function Wash({side='left'}:{side?:'left'|'right'}){return <path d={side==='left'?'M0 0h88q-32 73-19 143 8 47-69 94Z':'M240 0h-85q31 70 20 139-9 56 65 99Z'} fill="#718783" opacity=".06"/>}
function VCollar(){return <g><path d="M88 204 120 224 106 240 72 215Z" fill={I.cream} opacity=".88"/><path d="M152 204 120 224 135 240 168 215Z" fill="#cbbfa9" opacity=".86"/></g>}
function Robe({fill,royal=false,male=false}:{fill:string;royal?:boolean;male?:boolean}){return <g>
  <path d={royal?'M40 300q5-63 48-101l32 21 33-21q43 38 48 101Z':'M49 300q5-59 42-96l29 18 30-18q37 37 42 96Z'} fill={fill} opacity=".86"/>
  {male&&!royal?<><path d="M88 204 128 229 113 245 68 215Z" fill={I.cream} opacity=".88"/><path d="M151 204 124 224 137 238 170 215Z" fill="#c8bba6" opacity=".85"/></>:<VCollar/>}
  <path d="M78 260q42 10 85 0" fill="none" stroke={I.ink} strokeWidth=".75" opacity=".3"/>
  {royal&&<><path d="M77 261q43 12 86 0M84 278q36 8 72 0" fill="none" stroke={I.gold} strokeWidth="1.7"/><circle cx="120" cy="267" r="16" fill="none" stroke={I.gold} strokeWidth="1.45"/></>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={I.paper}/><Wash/><WomanHair/><Face kind="woman"/><Robe fill={I.wash}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe2"/><Wash side="right"/><ManHair/><Face kind="man"/><Robe fill={I.blue} male/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f0ece3"/><Wash/><ManHair elder/><Face kind="elder"/><Robe fill="#75716b" male/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f3efe6"/><Wash side="right"/><WomanHair royal/><path d="M61 52 80 31m100 23-18-22" stroke={I.gold} strokeWidth="2"/><circle cx="80" cy="30" r="3.4" fill="#aa5f5c"/><circle cx="160" cy="31" r="3.4" fill="#aa5f5c"/><Face kind="princess"/><Robe fill="#796970" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe1"/><Wash/><ManHair/><path d="M81 63h78l-6-28H88Z" fill="#303331" opacity=".94"/><path d="M84 46 61 54m96-8 23 8" stroke="#303331" strokeWidth="5.5" strokeLinecap="round"/><Face kind="emperor"/><Robe fill={I.red} royal male/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function InkFlatStudy(){return <StudySection id="ink-flat" letter="F · INK-WASH FLAT HYBRID" title="水墨扁平混合 / 简化工笔感" subtitle="五种身份改为不同脸型，并继续使用低对比墨线和透明洗色；目标不是做水墨纹理，而是让大量居民头像拥有更安静、耐看的气质。" tags={['身份脸型差异','透明洗色','细墨线','安静国风']} renderPortrait={portrait}/>}
