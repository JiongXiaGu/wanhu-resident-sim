import { StudySection, type BakeoffRole } from '../BakeoffShared';
const I={paper:'#f3efe7',ink:'#343735',skin:'#d0a080',skinM:'#c38d6d',wash:'#6b7f7c',red:'#865956',blue:'#667986',cream:'#dfd5c1',gold:'#b29a68',gray:'#7a7d79'};
type Kind='woman'|'man'|'elder'|'princess'|'emperor';
const faceD:Record<Kind,string>={
  woman:'M116 68c-22 1-35 19-35 47 0 23 7 45 20 61 7 8 13 13 20 16 7-3 14-8 20-17 12-16 18-38 17-61-1-28-15-47-42-46Z',
  man:'M117 66c-26 1-40 20-40 49 0 24 8 47 22 64l12 8q10 7 20 0l11-9c13-17 19-40 18-64-1-29-16-49-43-48Z',
  elder:'M116 65c-24 1-38 19-38 49 0 27 7 52 20 70 7 10 14 15 21 18 7-3 14-9 20-19 12-19 18-44 17-70-1-30-16-49-40-48Z',
  princess:'M116 70c-20 1-33 18-33 44 0 21 6 42 18 57 6 8 12 12 19 15 6-3 12-7 18-15 11-16 17-36 16-57-1-26-14-44-38-44Z',
  emperor:'M118 66c-27 1-42 20-42 50 0 25 8 48 22 65l12 9q10 7 20 0l12-9c14-17 21-41 20-66-1-30-16-50-44-49Z',
};
function Face({kind}:{kind:Kind}){const male=kind==='man'||kind==='emperor';const elder=kind==='elder';return <g>
  <path d={faceD[kind]} fill={elder?'#c29677':male?I.skinM:I.skin} opacity=".9"/>
  <path d={male?'M88 105q10-4 20 0m22 0q10-4 20 0':'M91 105q9-4 18 0m21 0q9-4 18 0'} fill="none" stroke={I.ink} strokeWidth={male?1.25:1.05} strokeLinecap="round"/>
  <path d="M91 115q9-4 18 0m21 0q9-4 18 0" fill="none" stroke={I.ink} strokeWidth=".95" strokeLinecap="round"/>
  <circle cx="100" cy="115" r="1.6" fill={I.ink}/><circle cx="139" cy="115" r="1.5" fill={I.ink}/>
  <path d={male?'M118 121q0 10 5 14l8-3':'M118 120q-1 10 4 14l8-3'} fill="none" stroke="#7f5d4b" strokeWidth=".95" strokeLinecap="round"/>
  <path d={kind==='princess'?'M108 154q12 5 24 0':'M108 156q12 4 24 0'} fill="none" stroke="#805653" strokeWidth="1.05" strokeLinecap="round"/>
  <path d="M81 129q5 34 28 54-19-7-28-27Z" fill="#ba8265" opacity=".12"/>
  {elder&&<path d="M87 133q10 4 19 2m29 0q10 2 19-2M92 146l-8 3m65-3 8 3" fill="none" stroke="#98715c" strokeWidth=".62" opacity=".58"/>}
</g>}
function WomanHair({royal=false}:{royal?:boolean}){return <g>
  <path d="M72 129q-3-76 46-76 52 0 50 79l-7 47-17 20H94l-19-20Z" fill={I.ink} opacity=".92"/>
  <path d="M80 98c8-25 21-37 38-37 19 0 33 13 41 38-15-5-28-14-41-26-10 12-22 20-38 25Z" fill={I.ink} opacity=".92"/>
  <path d="M76 101q-8 42-2 77l15 16-1-76m74-17q8 42 2 77l-15 16 1-76" fill="none" stroke="#7b8580" strokeWidth=".9" opacity=".45"/>
  {royal?<><ellipse cx="74" cy="59" rx="17" ry="19" fill={I.ink}/><ellipse cx="167" cy="61" rx="15" ry="18" fill={I.ink}/></>:<ellipse cx="70" cy="96" rx="11" ry="14" fill={I.ink}/>}
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?I.gray:I.ink;return <g>
  <path d="M74 128q0-69 45-69 48 0 49 71l-6 36-18 23H95l-17-23Z" fill={h} opacity=".9"/>
  <path d="M81 98c9-23 22-35 38-35 18 0 31 12 39 35-14-5-26-13-39-24-11 11-23 19-38 24Z" fill={h} opacity=".9"/>
  <path d="M104 61q15-18 31 0l-3 17h-31Z" fill={h} opacity=".9"/>
</g>}
function Wash({side='left'}:{side?:'left'|'right'}){return <path d={side==='left'?'M0 0h88q-32 73-19 143 8 47-69 94Z':'M240 0h-85q31 70 20 139-9 56 65 99Z'} fill="#718783" opacity=".06"/>}
function VCollar(){return <g><path d="M96 203 120 218 109 231 82 211Z" fill={I.cream} opacity=".88"/><path d="M144 203 120 218 132 231 158 211Z" fill="#cbbfa9" opacity=".86"/></g>}
function Robe({fill,royal=false,male=false}:{fill:string;royal?:boolean;male?:boolean}){return <g>
  <path d={royal?'M43 300q6-60 46-96l31 17 32-17q40 36 46 96Z':'M51 300q5-56 40-92l29 15 30-15q35 36 40 92Z'} fill={fill} opacity=".86"/>
  {male&&!royal?<><path d="M94 203 128 223 115 237 80 211Z" fill={I.cream} opacity=".88"/><path d="M145 203 124 218 135 230 157 211Z" fill="#c8bba6" opacity=".85"/></>:<VCollar/>}
  <path d="M78 260q42 10 85 0" fill="none" stroke={I.ink} strokeWidth=".72" opacity=".28"/>
  {royal&&<><path d="M78 261q42 12 84 0M85 278q35 8 70 0" fill="none" stroke={I.gold} strokeWidth="1.6"/><circle cx="120" cy="267" r="15" fill="none" stroke={I.gold} strokeWidth="1.4"/></>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={I.paper}/><Wash/><WomanHair/><Face kind="woman"/><Robe fill={I.wash}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe2"/><Wash side="right"/><ManHair/><Face kind="man"/><Robe fill={I.blue} male/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f0ece3"/><Wash/><ManHair elder/><Face kind="elder"/><Robe fill="#75716b" male/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f3efe6"/><Wash side="right"/><WomanHair royal/><path d="M61 52 80 31m100 23-18-22" stroke={I.gold} strokeWidth="1.9"/><circle cx="80" cy="30" r="3.3" fill="#aa5f5c"/><circle cx="160" cy="31" r="3.3" fill="#aa5f5c"/><Face kind="princess"/><Robe fill="#796970" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe1"/><Wash/><ManHair/><path d="M92 58h56l-5-25H98Z" fill="#303331" opacity=".94"/><path d="M96 42 65 50m79-8 31 8" stroke="#303331" strokeWidth="4.8" strokeLinecap="round"/><Face kind="emperor"/><Robe fill={I.red} royal male/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function InkFlatStudy(){return <StudySection id="ink-flat" letter="F · INK-WASH FLAT HYBRID" title="水墨扁平混合 / 简化工笔感" subtitle="发际线、脸部和领口全部重新收口；保留透明洗色与细墨线，但不再出现白色头套感和大面积纸片衣领。" tags={['柔和发际线','透明洗色','细墨线','小型领口']} renderPortrait={portrait}/>}
