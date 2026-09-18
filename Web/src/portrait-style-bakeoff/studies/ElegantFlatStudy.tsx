import { StudySection, type BakeoffRole } from '../BakeoffShared';

const C={paper:'#f1ebdf',ink:'#3b3733',skin:'#d6a17e',skinM:'#c98d69',hair:'#2c2927',gray:'#78736e',jade:'#667f7b',blue:'#62788a',wine:'#7b5d69',red:'#744f52',cream:'#ddd1bb',gold:'#b99c61'};

type FaceKind='woman'|'man'|'elder'|'princess'|'emperor';
const facePath:Record<FaceKind,string>={
  woman:'M120 68C98 68 84 84 82 110c-2 22 5 46 19 64 7 9 13 14 19 17 7-3 14-8 21-17 13-18 20-42 18-64-2-26-16-42-39-42Z',
  man:'M120 66C94 66 78 84 78 112c0 24 7 46 21 63l11 9q10 7 20 0l11-9c14-17 21-39 21-63 0-28-16-46-42-46Z',
  elder:'M120 66C96 66 81 83 80 111c-1 27 6 51 19 70 7 10 14 16 21 19 7-3 14-9 21-19 13-19 20-43 19-70-1-28-16-45-40-45Z',
  princess:'M120 70C100 70 87 85 85 109c-2 21 4 43 17 60 6 8 12 13 18 16 6-3 12-8 18-16 13-17 19-39 17-60-2-24-15-39-35-39Z',
  emperor:'M120 66C93 66 77 84 77 112c0 25 7 48 22 65l12 9q9 7 19 0l12-9c15-17 22-40 22-65 0-28-16-46-44-46Z',
};
function Features({kind}:{kind:FaceKind}) {
  const male=kind==='man'||kind==='emperor';
  const elder=kind==='elder';
  const royal=kind==='princess'||kind==='emperor';
  return <g fill="none" strokeLinecap="round">
    <path d={male?'M89 105q10-4 21 0m20 0q11-4 21 0':'M92 105q9-4 18 0m20 0q9-4 18 0'} stroke={C.ink} strokeWidth={male?1.6:1.25}/>
    <path d={elder?'M92 116q9-3 18 0m20 0q9-3 18 0':'M92 115q9-5 18 0m20 0q9-5 18 0'} stroke={C.ink} strokeWidth="1.1"/>
    <path d="M94 118q7 2 14 0m24 0q7 2 14 0" stroke="#7b6b63" strokeWidth=".55" opacity=".52"/>
    <circle cx="101" cy="116" r={royal?2.3:1.9} fill={C.ink} stroke="none"/><circle cx="139" cy="116" r={royal?2.3:1.9} fill={C.ink} stroke="none"/>
    <path d={male?'M119 121q0 10 5 14 4 1 8-3':'M119 121q-1 10 3 14 4 1 8-3'} stroke="#805b49" strokeWidth="1.05"/>
    <path d={royal?'M108 154q12 6 24 0':'M108 155q12 4 24 0'} stroke={royal?'#925b59':'#805653'} strokeWidth="1.25"/>
    {elder&&<path d="M88 132q9 4 18 2m29 0q9 2 18-2M93 145l-8 3m64-3 8 3" stroke="#9b725d" strokeWidth=".7" opacity=".65"/>}
  </g>;
}
function Face({kind}:{kind:FaceKind}) {
  const male=kind==='man'||kind==='emperor';
  return <g><path d={facePath[kind]} fill={kind==='elder'?'#c49575':male?C.skinM:C.skin} stroke={C.ink} strokeWidth="1.35"/><Features kind={kind}/></g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g>
  <path d="M72 129q-4-77 48-77 54 0 49 80l-7 48-18 20H96l-20-20Z" fill={C.hair}/>
  <path d="M81 98c8-25 22-37 39-37 19 0 33 13 41 38-15-5-28-14-41-26-10 12-23 21-39 25Z" fill={C.hair}/>
  <path d="M77 101q-8 42-2 78l15 15-1-75m73-18q8 42 2 78l-15 15 1-75" fill="none" stroke="#5a514b" strokeWidth="1.1" opacity=".42"/>
  {royal?<><ellipse cx="76" cy="59" rx="17" ry="19" fill={C.hair}/><ellipse cx="166" cy="61" rx="15" ry="18" fill={C.hair}/></>:<ellipse cx="70" cy="96" rx="11" ry="14" fill={C.hair}/>}
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?C.gray:C.hair;return <g>
  <path d="M75 127q-1-70 45-70 48 0 48 72l-5 35-18 24H96l-17-24Z" fill={h}/>
  <path d="M82 98c9-23 22-35 39-35 18 0 31 12 39 35-14-5-27-13-39-24-11 11-24 19-39 24Z" fill={h}/>
  <path d="M104 60q16-20 32 0l-3 17h-32Z" fill={h}/>
  {elder&&<path d="M88 88q16-14 31-19m34 19q-13-13-28-19" fill="none" stroke="#aaa39c" strokeWidth="1" opacity=".7"/>}
</g>}
function Neck({male=false}:{male?:boolean}){return <path d={male?'M103 179q1 15-8 25 25 15 50 0-10-10-8-25Z':'M104 178q1 15-8 25 24 14 48 0-9-10-7-25Z'} fill={male?'#c6906f':'#cf9b78'}/>}
function VCollar(){return <g stroke={C.ink} strokeWidth=".95"><path d="M96 203 120 218 109 231 82 211Z" fill={C.cream}/><path d="M144 203 120 218 132 231 158 211Z" fill="#cbbfa9"/></g>}
function RobeBase({fill,wider=false}:{fill:string;wider?:boolean}){return <path d={wider?'M43 300q6-60 46-96l31 17 32-17q40 36 46 96Z':'M51 300q5-56 40-92l29 15 30-15q35 36 40 92Z'} fill={fill} stroke={C.ink} strokeWidth="1.45"/>}
function CommonWomanRobe(){return <g><RobeBase fill={C.jade}/><VCollar/><path d="M82 260q38 9 78 0" fill="none" stroke="#8fa39d" strokeWidth="1.25" opacity=".62"/></g>}
function CommonManRobe(){return <g><RobeBase fill={C.blue}/><path d="M94 203 128 223 115 237 80 211Z" fill={C.cream} stroke={C.ink} strokeWidth=".95"/><path d="M145 203 124 218 135 230 157 211Z" fill="#c8bca6" stroke={C.ink} strokeWidth=".95"/></g>}
function ElderRobe(){return <g><RobeBase fill="#746f68"/><VCollar/><path d="M77 272q43 8 87 0" fill="none" stroke="#979087" strokeWidth="1"/></g>}
function PrincessRobe(){return <g><RobeBase fill={C.wine} wider/><VCollar/><path d="M69 255q51 17 102 0M78 275q42 11 84 0" fill="none" stroke={C.gold} strokeWidth="1.9"/><path d="M108 262q12-13 24 0" fill="none" stroke={C.gold} strokeWidth="1.45"/></g>}
function EmperorRobe(){return <g><RobeBase fill={C.red} wider/><VCollar/><circle cx="120" cy="264" r="18" fill="none" stroke={C.gold} strokeWidth="2"/><path d="M109 266q11-16 22 0m-25-6q14-6 28 0" fill="none" stroke={C.gold} strokeWidth="1.5"/></g>}
function CommonWoman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face kind="woman"/><Neck/><CommonWomanRobe/></svg>}
function CommonMan(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ede6d8"/><ManHair/><Face kind="man"/><Neck male/><CommonManRobe/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#efe8dc"/><ManHair elder/><Face kind="elder"/><Neck male/><ElderRobe/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#f2ebdf"/><WomanHair royal/><path d="M60 52 79 29m101 24-17-23M75 34l3-15m89 18 5-16" stroke={C.gold} strokeWidth="2.7" strokeLinecap="round"/><circle cx="79" cy="28" r="3.8" fill="#b96865"/><circle cx="162" cy="29" r="3.8" fill="#b96865"/><Face kind="princess"/><Neck/><PrincessRobe/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ece4d6"/><ManHair/><path d="M92 58h56l-5-25H98Z" fill="#282725"/><path d="M96 42 65 50m79-8 31 8" stroke="#282725" strokeWidth="5" strokeLinecap="round"/><Face kind="emperor"/><Neck male/><EmperorRobe/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <CommonWoman/>;if(role==='common-man')return <CommonMan/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function ElegantFlatStudy(){return <StudySection id="elegant-flat" letter="A · ELEGANT FINE-LINE FLAT" title="雅致细线国风扁平" subtitle="脸部改为颧部—下颌—下巴结构，发际线真正覆盖额头；领口缩小到胸前局部，整体更接近可量产的游戏头像。" tags={['自然下颌','真实发际线','细线','小型层叠领']} renderPortrait={portrait}/>}
