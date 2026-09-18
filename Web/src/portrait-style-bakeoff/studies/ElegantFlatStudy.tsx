import { StudySection, type BakeoffRole } from '../BakeoffShared';

const C={paper:'#f1ebdf',ink:'#3b3733',skin:'#d6a17e',skinM:'#c98d69',hair:'#2c2927',gray:'#78736e',jade:'#667f7b',blue:'#62788a',wine:'#7b5d69',red:'#744f52',cream:'#ddd1bb',gold:'#b99c61'};

type FaceKind='woman'|'man'|'elder'|'princess'|'emperor';
const facePath:Record<FaceKind,string>={
  woman:'M120 63C95 63 80 84 81 121c1 38 14 62 39 69 24-7 38-31 39-69 1-37-14-58-39-58Z',
  man:'M120 61C90 61 74 84 76 122c2 39 17 64 44 71 28-7 44-32 46-71 2-38-16-61-46-61Z',
  elder:'M120 60C94 60 79 82 80 122c1 43 15 69 40 77 24-8 39-34 40-77 1-40-14-62-40-62Z',
  princess:'M120 64C97 64 83 85 83 121c0 38 14 60 37 66 23-6 37-28 37-66 0-36-14-57-37-57Z',
  emperor:'M120 61C89 61 73 84 75 122c2 40 18 66 45 72 29-6 45-32 47-72 2-38-16-61-47-61Z',
};
function Features({kind}:{kind:FaceKind}) {
  const male=kind==='man'||kind==='emperor';
  const elder=kind==='elder';
  const royal=kind==='princess'||kind==='emperor';
  const ly=kind==='elder'?119:116;
  return <g fill="none" strokeLinecap="round">
    <path d={male?'M89 106q10-5 21-1m20 0q11-4 21 1':'M92 106q9-4 18-1m20 0q9-3 18 1'} stroke={C.ink} strokeWidth={male?1.65:1.3}/>
    <path d={elder?'M92 119q9-3 18 0m20 0q9-3 18 0':'M92 116q9-6 18 0m20 0q9-6 18 0'} stroke={C.ink} strokeWidth="1.15"/>
    <path d="M94 120q7 2 14 0m24 0q7 2 14 0" stroke="#7b6b63" strokeWidth=".58" opacity=".55"/>
    <circle cx="101" cy={ly-1} r={royal?2.35:1.95} fill={C.ink} stroke="none"/><circle cx="139" cy={ly-1} r={royal?2.35:1.95} fill={C.ink} stroke="none"/>
    <path d={male?'M119 123q-1 10 4 15 4 1 9-3':'M119 122q-2 10 3 15 3 1 8-3'} stroke="#805b49" strokeWidth="1.1"/>
    <path d={royal?'M108 157q12 6 24 0':'M108 158q12 4 24 0'} stroke={royal?'#925b59':'#805653'} strokeWidth="1.28"/>
    {elder&&<path d="M87 136q10 4 19 2m28 0q10 2 19-2M92 150l-9 3m66-3 8 3" stroke="#9b725d" strokeWidth=".72" opacity=".68"/>}
  </g>;
}
function Face({kind}:{kind:FaceKind}) {
  const male=kind==='man'||kind==='emperor';
  return <g><path d={facePath[kind]} fill={kind==='elder'?'#c49575':male?C.skinM:C.skin} stroke={C.ink} strokeWidth="1.4"/><Features kind={kind}/></g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={C.hair}>
  <path d="M75 125q0-68 45-68 47 0 47 70l-14-41q-16-17-34-17-22 0-36 21Z"/>
  <path d="M77 88q-10 43-3 87l15 18-1-80Zm85 0q10 43 3 87l-15 18 1-80Z"/>
  {royal?<><ellipse cx="76" cy="58" rx="17" ry="19"/><ellipse cx="166" cy="60" rx="15" ry="18"/></>:<ellipse cx="71" cy="94" rx="11" ry="14"/>}
  <path d="M84 82q15-19 35-27m42 28q-13-18-32-27" fill="none" stroke="#5d534d" strokeWidth="1.1" opacity=".5"/>
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?C.gray:C.hair;return <g fill={h}>
  <path d="M74 123q2-64 46-64 46 0 48 67l-14-39q-16-16-35-16-21 0-35 20Z"/>
  <path d="M104 61q16-20 32 0l-3 17h-32Z"/>
  {elder&&<path d="M85 87q17-15 34-21m35 21q-13-14-29-21" fill="none" stroke="#aaa39c" strokeWidth="1.1" opacity=".72"/>}
</g>}
function Neck({male=false}:{male?:boolean}){return <path d={male?'M101 184q2 15-8 25 27 16 54 0-11-10-8-25Z':'M103 183q2 15-8 25 25 15 50 0-10-10-7-25Z'} fill={male?'#c6906f':'#cf9b78'}/>}
function VCollar({left='#ddd1bb',right='#cbbfaa',stroke=true}:{left?:string;right?:string;stroke?:boolean}){return <g stroke={stroke?C.ink:'none'} strokeWidth="1">
  <path d="M88 204 120 224 106 239 72 215Z" fill={left}/><path d="M152 204 120 224 135 239 168 215Z" fill={right}/>
</g>}
function RobeBase({fill,wider=false}:{fill:string;wider?:boolean}){return <path d={wider?'M39 300q6-61 49-100l32 21 33-21q43 39 49 100Z':'M49 300q5-58 42-96l29 18 30-18q37 37 42 96Z'} fill={fill} stroke={C.ink} strokeWidth="1.5"/>}
function CommonWomanRobe(){return <g><RobeBase fill={C.jade}/><VCollar/><path d="M82 260q38 9 78 0" fill="none" stroke="#8fa39d" strokeWidth="1.3" opacity=".65"/></g>}
function CommonManRobe(){return <g><RobeBase fill={C.blue}/><path d="M88 204 128 229 113 245 68 215Z" fill={C.cream} stroke={C.ink} strokeWidth="1"/><path d="M151 204 124 224 137 238 170 215Z" fill="#c8bca6" stroke={C.ink} strokeWidth="1"/></g>}
function ElderRobe(){return <g><RobeBase fill="#746f68"/><VCollar left="#d7ccb7" right="#c6baa5"/><path d="M76 272q44 8 88 0" fill="none" stroke="#979087" strokeWidth="1.1"/></g>}
function PrincessRobe(){return <g><RobeBase fill={C.wine} wider/><VCollar left="#e1d4bd" right="#d1c3ac"/><path d="M68 254q52 18 104 0M77 275q43 12 86 0" fill="none" stroke={C.gold} strokeWidth="2"/><path d="M106 262q14-15 28 0" fill="none" stroke={C.gold} strokeWidth="1.5"/></g>}
function EmperorRobe(){return <g><RobeBase fill={C.red} wider/><VCollar left="#ded2bb" right="#cdbfa8"/><circle cx="120" cy="264" r="19" fill="none" stroke={C.gold} strokeWidth="2.1"/><path d="M108 266q12-18 24 0m-27-6q15-7 30 0" fill="none" stroke={C.gold} strokeWidth="1.6"/></g>}
function CommonWoman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face kind="woman"/><Neck/><CommonWomanRobe/></svg>}
function CommonMan(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ede6d8"/><ManHair/><Face kind="man"/><Neck male/><CommonManRobe/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efe8dc"/><ManHair elder/><Face kind="elder"/><Neck male/><ElderRobe/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f2ebdf"/><WomanHair royal/><path d="M59 51 79 28m102 24-18-24M74 33l3-15m91 18 5-16" stroke={C.gold} strokeWidth="2.8" strokeLinecap="round"/><circle cx="79" cy="27" r="4" fill="#b96865"/><circle cx="162" cy="28" r="4" fill="#b96865"/><Face kind="princess"/><Neck/><PrincessRobe/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ece4d6"/><ManHair/><path d="M81 65h79l-6-29H88Z" fill="#282725"/><path d="M84 47 58 56m100-9 25 9" stroke="#282725" strokeWidth="6.5" strokeLinecap="round"/><Face kind="emperor"/><Neck male/><EmperorRobe/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <CommonWoman/>;if(role==='common-man')return <CommonMan/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function ElegantFlatStudy(){return <StudySection id="elegant-flat" letter="A · ELEGANT FINE-LINE FLAT" title="雅致细线国风扁平" subtitle="五种身份使用不同脸型与服装结构：女性更柔、男性下颌更宽、老人更长、公主更小巧、皇帝更厚重。" tags={['角色脸型差异','细线','低饱和','层叠衣领']} renderPortrait={portrait}/>}
