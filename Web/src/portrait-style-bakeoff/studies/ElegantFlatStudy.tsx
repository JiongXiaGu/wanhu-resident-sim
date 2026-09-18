import { StudySection, type BakeoffRole } from '../BakeoffShared';

const C={paper:'#f1ebdf',ink:'#3c3834',skin:'#d5a17e',skinM:'#c88c69',hair:'#2d2927',gray:'#78736e',jade:'#667f7b',blue:'#64788a',wine:'#7b5c67',red:'#754f52',cream:'#d8cdb7',gold:'#b89b62'};

function Features({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}) {
  const brow=male?1.65:1.35;
  return <g fill="none" strokeLinecap="round">
    <path d={male?'M91 108q9-5 19-1m20 0q10-4 19 1':'M92 108q9-4 18-1m20 0q9-3 18 1'} stroke={C.ink} strokeWidth={brow}/>
    <path d={elder?'M92 118q9-4 18 0m20 0q9-4 18 0':'M92 117q9-6 18 0m20 0q9-6 18 0'} stroke={C.ink} strokeWidth="1.25"/>
    <path d={elder?'M94 120q7 3 14 0m24 0q7 3 14 0':'M94 120q7 2 14 0m24 0q7 2 14 0'} stroke="#78675f" strokeWidth=".65" opacity=".6"/>
    <circle cx="101" cy="118" r={royal?2.3:2} fill={C.ink} stroke="none"/><circle cx="139" cy="118" r={royal?2.3:2} fill={C.ink} stroke="none"/>
    <path d="M119 124q-2 10 3 15 4 1 8-3" stroke="#805b49" strokeWidth="1.15"/>
    <path d={royal?'M108 158q12 6 24 0':'M108 158q12 4 24 0'} stroke={royal?'#925d5b':'#805653'} strokeWidth="1.35"/>
    {elder&&<path d="M87 137q10 4 19 2m28 0q10 2 19-2M92 149l-9 3m66-3 8 3" stroke="#9a715c" strokeWidth=".75" opacity=".7"/>}
  </g>;
}
function Face({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}) {
  const d=male
    ?'M120 63C91 63 75 86 78 124c3 42 19 65 42 68 25-3 42-26 44-68 3-38-15-61-44-61Z'
    :'M120 62C93 62 78 85 80 123c2 41 17 64 40 68 24-4 39-27 41-68 2-38-14-61-41-61Z';
  return <g>
    <path d={d} fill={elder?'#c69676':male?C.skinM:C.skin} stroke={C.ink} strokeWidth="1.45"/>
    <Features male={male} elder={elder} royal={royal}/>
  </g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={C.hair}>
  <path d="M76 126q-2-70 44-70 47 0 46 73l-10-42q-16-18-36-18-22 0-36 20Z"/>
  <path d="M78 89q-10 45 0 87l16 18-3-77Zm84-1q10 45 0 88l-16 18 3-77Z"/>
  {royal?<><ellipse cx="77" cy="58" rx="17" ry="19"/><ellipse cx="166" cy="60" rx="15" ry="18"/></>:<ellipse cx="72" cy="92" rx="12" ry="15"/>}
  <path d="M85 82q15-21 35-28 17 9 34 29" fill="none" stroke="#5a514b" strokeWidth="1.2" opacity=".52"/>
</g>}
function ManHair({elder=false}:{elder?:boolean}){const fill=elder?C.gray:C.hair;return <g fill={fill}>
  <path d="M76 124q1-65 45-65 46 0 47 67l-12-38q-16-17-36-17-21 0-35 19Z"/>
  <path d="M105 60q15-20 31 0l-3 17h-31Z"/>
  {elder&&<path d="M87 85q15-14 31-20m36 20q-13-14-29-20" fill="none" stroke="#aaa39b" strokeWidth="1.2" opacity=".7"/>}
</g>}
function Neck(){return <path d="M103 184q2 14-7 23 24 15 48 0-10-10-7-23Z" fill="#cf9b79"/>}
function CommonWomanRobe(){return <g>
  <path d="M50 300q5-58 43-96l27 16 28-16q38 37 43 96Z" fill={C.jade} stroke={C.ink} strokeWidth="1.55"/>
  <path d="M92 205q17 15 28 21l-13 19-39-30" fill={C.cream} stroke={C.ink} strokeWidth="1.05"/>
  <path d="M148 205q-17 16-28 21l15 18 36-30" fill="#c9bda8" stroke={C.ink} strokeWidth="1.05"/>
  <path d="M82 258q37 10 77 0" fill="none" stroke="#8ba09a" strokeWidth="1.4" opacity=".65"/>
</g>}
function CommonManRobe(){return <g>
  <path d="M47 300q6-59 44-95l29 17 30-17q38 37 44 95Z" fill={C.blue} stroke={C.ink} strokeWidth="1.6"/>
  <path d="M92 205q23 16 38 28l-17 18-46-36" fill={C.cream} stroke={C.ink} strokeWidth="1.1"/>
  <path d="M149 205q-13 13-26 23l13 15 34-28" fill="#c6baa4" stroke={C.ink} strokeWidth="1.1"/>
</g>}
function ElderRobe(){return <g>
  <path d="M49 300q5-55 40-91l31 17 31-17q35 35 40 91Z" fill="#746f68" stroke={C.ink} strokeWidth="1.5"/>
  <path d="M91 210q18 15 29 21l-14 19-38-31m82-9q-18 15-30 21l15 19 37-31" fill={C.cream} stroke={C.ink} strokeWidth="1"/>
  <path d="M75 271q44 9 89 0" fill="none" stroke="#978f86" strokeWidth="1.2"/>
</g>}
function PrincessRobe(){return <g>
  <path d="M42 300q5-62 47-101l31 20 32-20q42 39 47 101Z" fill={C.wine} stroke={C.ink} strokeWidth="1.6"/>
  <path d="M89 200q18 15 31 22l-15 20-43-31m90-11q-19 15-32 22l16 20 42-31" fill="#ded2bb" stroke={C.ink} strokeWidth="1.05"/>
  <path d="M68 254q52 18 104 0M76 274q44 13 88 0" fill="none" stroke={C.gold} strokeWidth="2.1"/>
  <path d="M105 261q15-16 30 0" fill="none" stroke={C.gold} strokeWidth="1.6"/>
</g>}
function EmperorRobe(){return <g>
  <path d="M39 300q6-61 49-101l32 22 33-22q43 40 49 101Z" fill={C.red} stroke={C.ink} strokeWidth="1.7"/>
  <path d="M88 200q19 15 32 22l-15 20-44-31m92-11q-20 15-33 22l16 20 43-31" fill="#d8ccb5" stroke={C.ink} strokeWidth="1.1"/>
  <circle cx="120" cy="264" r="19" fill="none" stroke={C.gold} strokeWidth="2.2"/>
  <path d="M108 266q12-18 24 0m-27-6q15-7 30 0" fill="none" stroke={C.gold} strokeWidth="1.7"/>
</g>}
function CommonWoman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face/><Neck/><CommonWomanRobe/></svg>}
function CommonMan(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ede6d8"/><ManHair/><Face male/><Neck/><CommonManRobe/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efe8dc"/><ManHair elder/><Face male elder/><Neck/><ElderRobe/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f2ebdf"/><WomanHair royal/><path d="M59 51 79 28m102 24-18-24M74 33l3-15m91 18 5-16" stroke={C.gold} strokeWidth="2.8" strokeLinecap="round"/><circle cx="79" cy="27" r="4" fill="#b96865"/><circle cx="162" cy="28" r="4" fill="#b96865"/><Face royal/><Neck/><PrincessRobe/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ece4d6"/><ManHair/><path d="M81 65h79l-6-29H88Z" fill="#282725"/><path d="M84 47 58 56m100-9 25 9" stroke="#282725" strokeWidth="6.5" strokeLinecap="round"/><Face male royal/><Neck/><EmperorRobe/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <CommonWoman/>;if(role==='common-man')return <CommonMan/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function ElegantFlatStudy(){return <StudySection id="elegant-flat" letter="A · ELEGANT FINE-LINE FLAT" title="雅致细线国风扁平" subtitle="自然比例、克制细线、柔和低饱和。平民、老人和皇室使用不同服装结构，不再靠同一套大 X 领换颜色。" tags={['自然五官','细线','低饱和','服装结构分层']} renderPortrait={portrait}/>}
