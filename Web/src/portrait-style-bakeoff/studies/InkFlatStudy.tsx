import { StudySection, type BakeoffRole } from '../BakeoffShared';
const I={paper:'#f2eee5',ink:'#333735',skin:'#d0a080',skinM:'#c38d6d',wash:'#697e7b',red:'#865956',blue:'#667986',cream:'#dfd5c1',gold:'#b29a68',gray:'#7a7d79'};
function Face({male=false,elder=false}:{male?:boolean;elder?:boolean}){const fill=elder?'#c29677':male?I.skinM:I.skin;return <g>
  <path d={male?'M120 64c-28 0-43 23-42 61 1 41 17 64 42 68 26-4 42-27 43-68 1-38-15-61-43-61Z':'M120 63c-27 0-42 22-41 60 1 41 17 64 41 68 25-4 40-27 41-68 1-38-14-60-41-60Z'} fill={fill} opacity=".9"/>
  <path d={male?'M91 107q10-4 20 0m18 0q10-4 20 0':'M92 107q9-4 18 0m20 0q9-4 18 0'} fill="none" stroke={I.ink} strokeWidth={male?1.35:1.15} strokeLinecap="round"/>
  <path d="M92 117q9-4 18 0m20 0q9-4 18 0" fill="none" stroke={I.ink} strokeWidth="1.05" strokeLinecap="round"/>
  <circle cx="101" cy="117" r="1.7" fill={I.ink}/><circle cx="139" cy="117" r="1.7" fill={I.ink}/>
  <path d="M119 123q-1 10 4 15l8-3" fill="none" stroke="#7f5d4b" strokeWidth="1.05" strokeLinecap="round"/>
  <path d="M108 158q12 4 24 0" fill="none" stroke="#805653" strokeWidth="1.15" strokeLinecap="round"/>
  <path d="M81 132q5 35 29 55-20-7-29-28Z" fill="#ba8265" opacity=".14"/>
  {elder&&<path d="M87 136q10 4 19 2m28 0q10 2 19-2M91 148l-8 3m66-3 8 3" fill="none" stroke="#98715c" strokeWidth=".7" opacity=".6"/>}
</g>}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={I.ink}>
  <path d="M73 124q0-68 47-68 49 0 49 71l-15-42q-16-17-35-17-23 0-38 21Z" opacity=".94"/>
  <path d="M77 87q-11 44-3 88l16 18-2-80Zm86 0q11 44 3 88l-16 18 2-80Z" opacity=".82"/>
  {royal?<><ellipse cx="75" cy="58" rx="17" ry="19"/><ellipse cx="167" cy="60" rx="15" ry="18"/></>:<ellipse cx="70" cy="94" rx="11" ry="14"/>}
  <path d="M85 83q15-19 34-27m43 28q-13-19-33-28" fill="none" stroke="#7c8580" strokeWidth="1" opacity=".5"/>
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?I.gray:I.ink;return <g fill={h}>
  <path d="M75 123q2-64 46-64 46 0 48 67l-14-39q-16-16-35-16-21 0-35 20Z" opacity=".93"/>
  <path d="M105 61q15-18 31 0l-3 17h-31Z" opacity=".93"/>
</g>}
function Wash({side='left'}:{side?:'left'|'right'}){return <path d={side==='left'?'M0 0h88q-32 73-19 143 8 47-69 94Z':'M240 0h-85q31 70 20 139-9 56 65 99Z'} fill="#718783" opacity=".065"/>}
function CommonWomanRobe(){return <g>
  <path d="M49 300q5-59 43-97l28 18 29-18q38 38 43 97Z" fill={I.wash} opacity=".88"/>
  <path d="M92 204q18 16 28 22l-14 20-39-31m82-11q-17 16-29 22l15 20 37-31" fill={I.cream} opacity=".88"/>
  <path d="M78 260q42 10 85 0" fill="none" stroke={I.ink} strokeWidth=".8" opacity=".34"/>
</g>}
function CommonManRobe(){return <g>
  <path d="M47 300q5-59 43-96l30 18 31-18q38 38 43 96Z" fill={I.blue} opacity=".86"/>
  <path d="M91 205q23 17 39 29l-17 19-47-37m84-11q-14 14-27 24l14 16 35-29" fill={I.cream} opacity=".88"/>
</g>}
function ElderRobe(){return <g>
  <path d="M49 300q5-56 41-92l30 17 31-17q36 36 41 92Z" fill="#75716b" opacity=".86"/>
  <path d="M90 209q18 15 30 21l-14 19-38-30m83-10q-18 15-31 21l15 19 37-30" fill={I.cream} opacity=".88"/>
</g>}
function RoyalRobe({fill}:{fill:string}){return <g>
  <path d="M40 300q5-63 48-101l32 21 33-21q43 38 48 101Z" fill={fill} opacity=".88"/>
  <path d="M88 200q20 17 32 23l-15 21-44-32m92-12q-20 17-33 23l16 21 43-32" fill={I.cream} opacity=".88"/>
  <path d="M76 259q44 13 88 0M84 277q36 9 72 0" fill="none" stroke={I.gold} strokeWidth="1.8"/>
  <circle cx="120" cy="266" r="16" fill="none" stroke={I.gold} strokeWidth="1.5"/>
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={I.paper}/><Wash/><WomanHair/><Face/><CommonWomanRobe/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe2"/><Wash side="right"/><ManHair/><Face male/><CommonManRobe/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f0ece3"/><Wash/><ManHair elder/><Face male elder/><ElderRobe/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f3efe6"/><Wash side="right"/><WomanHair royal/><path d="M61 52 80 31m100 23-18-22" stroke={I.gold} strokeWidth="2.1"/><circle cx="80" cy="30" r="3.5" fill="#aa5f5c"/><circle cx="160" cy="31" r="3.5" fill="#aa5f5c"/><Face/><RoyalRobe fill="#796970"/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efebe1"/><Wash/><ManHair/><path d="M81 63h78l-6-28H88Z" fill="#303331" opacity=".95"/><path d="M84 46 61 54m96-8 23 8" stroke="#303331" strokeWidth="5.5" strokeLinecap="round"/><Face male/><RoyalRobe fill={I.red}/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function InkFlatStudy(){return <StudySection id="ink-flat" letter="F · INK-WASH FLAT HYBRID" title="水墨扁平混合 / 简化工笔感" subtitle="用轻透明洗色、极细墨线和分层领口营造安静的国风气质；比上一版减少白色头套感，让墨发与面部边界更自然。" tags={['透明洗色','细墨线','分层领口','安静国风']} renderPortrait={portrait}/>}
