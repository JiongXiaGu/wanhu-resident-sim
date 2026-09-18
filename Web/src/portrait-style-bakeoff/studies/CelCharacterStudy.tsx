import { StudySection, type BakeoffRole } from '../BakeoffShared';
const C={paper:'#ece4d7',line:'#282624',skin:'#d9a07c',skinM:'#c98c67',hair:'#292725',gray:'#77736f',teal:'#5f7a86',green:'#566a58',wine:'#785463',red:'#75494e',cream:'#e0d4bd',gold:'#c1a265'};
function Face({male=false,elder=false,princess=false}:{male?:boolean;elder?:boolean;princess?:boolean}){
  const d=male?'M120 67c-29 0-44 22-43 60 1 42 17 65 43 68 27-3 44-26 45-68 1-38-16-60-45-60Z':'M120 65c-27 0-42 22-41 59 1 41 16 64 41 68 25-4 40-27 41-68 1-37-14-59-41-59Z';
  return <g>
    <path d={d} fill={elder?'#c89a78':male?C.skinM:C.skin} stroke={C.line} strokeWidth="2"/>
    <path d={male?'M89 104q11-7 22 0m19 0q11-7 22 0':'M91 103q10-7 20 0m20 0q10-7 20 0'} fill="none" stroke={C.line} strokeWidth={male?2.2:1.8} strokeLinecap="round"/>
    <path d="M89 114q11-10 23 0-10 13-23 0Zm39 0q11-10 23 0-10 13-23 0Z" fill="#fffaf2" stroke={C.line} strokeWidth="1.4"/>
    <ellipse cx="101" cy="114" rx={princess?5.4:4.7} ry={princess?6.6:5.8} fill={princess?'#635a48':'#4f4a42'}/><ellipse cx="140" cy="114" rx={princess?5.4:4.7} ry={princess?6.6:5.8} fill={princess?'#635a48':'#4f4a42'}/>
    <circle cx="103" cy="111.5" r="1.4" fill="#fff"/><circle cx="142" cy="111.5" r="1.4" fill="#fff"/>
    {princess&&<><path d="M88 113l-6-3m69 3 6-3" stroke={C.line} strokeWidth="1.2"/><path d="M108 159q12 7 24 0" fill="#a65f62" stroke="#744749" strokeWidth=".8"/></>}
    {!princess&&<path d="M108 159q12 4 24 0" fill="none" stroke="#714a47" strokeWidth="1.6" strokeLinecap="round"/>}
    <path d="M118 122q-1 11 4 15l8-3" fill="none" stroke="#805947" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M80 132q4 36 31 57-22-7-31-28Z" fill={male?'#b57a5b':'#c88f6c'} opacity=".55"/>
    {elder&&<path d="M85 133q10 5 20 2m31 0q10 3 20-2M90 94q10-5 20-1m21 0q10-4 19 1" fill="none" stroke="#9b715a" strokeWidth="1" opacity=".7"/>}
  </g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={C.hair} stroke={C.line} strokeWidth="1.8">
  <path d="M72 126q0-69 48-69 50 0 50 72l-15-43q-16-18-36-18-23 0-38 22Z"/>
  <path d="M76 85q-13 45-4 91l18 18-2-83Zm88 0q13 45 4 91l-18 18 2-83Z"/>
  {royal?<><ellipse cx="75" cy="56" rx="18" ry="20"/><ellipse cx="168" cy="58" rx="16" ry="19"/></>:<path d="M68 97q-9 12-4 28l15-5 2-24Z"/>}
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?C.gray:C.hair;return <g fill={h} stroke={C.line} strokeWidth="1.8">
  <path d="M73 123q2-65 47-65 48 0 50 68l-14-40q-16-17-36-17-22 0-37 21Z"/>
  <path d="M105 60q15-19 31 0l-3 17h-31Z"/>
  {elder&&<path d="M86 87q17-16 33-21m35 21q-13-14-29-21" fill="none" stroke="#aaa39c" strokeWidth="1.1" opacity=".75"/>}
</g>}
function Neck(){return <path d="M102 183q2 15-8 25 26 16 52 0-10-10-8-25Z" fill="#cf9876"/>}
function CommonWomanRobe(){return <g>
  <path d="M52 300q4-59 41-96l27 18 28-18q36 37 40 96Z" fill={C.teal} stroke={C.line} strokeWidth="1.9"/>
  <path d="M91 205q18 16 29 22l-14 20-38-31" fill={C.cream} stroke={C.line} strokeWidth="1.3"/>
  <path d="M148 205q-17 16-28 22l15 20 37-31" fill="#c9bda7" stroke={C.line} strokeWidth="1.3"/>
  <path d="M159 225l16 75h-23l-10-68Z" fill="#395761" opacity=".28"/>
</g>}
function CommonManRobe(){return <g>
  <path d="M48 300q5-60 42-96l30 18 31-18q37 38 42 96Z" fill={C.green} stroke={C.line} strokeWidth="2"/>
  <path d="M91 205q24 18 39 30l-17 19-47-38" fill={C.cream} stroke={C.line} strokeWidth="1.35"/>
  <path d="M150 205q-14 14-27 24l14 16 35-29" fill="#c7bba6" stroke={C.line} strokeWidth="1.35"/>
  <path d="M163 226l16 74h-24l-10-66Z" fill="#31472f" opacity=".26"/>
</g>}
function ElderRobe(){return <g>
  <path d="M50 300q5-57 40-92l30 17 31-17q35 36 40 92Z" fill="#716a64" stroke={C.line} strokeWidth="1.9"/>
  <path d="M90 209q18 15 30 21l-14 19-38-30m83-10q-18 15-31 21l15 19 37-30" fill={C.cream} stroke={C.line} strokeWidth="1.25"/>
  <path d="M158 230l15 70h-23l-9-63Z" fill="#4f4a46" opacity=".23"/>
</g>}
function PrincessRobe(){return <g>
  <path d="M41 300q5-63 47-101l32 21 33-21q42 38 47 101Z" fill={C.wine} stroke={C.line} strokeWidth="2"/>
  <path d="M88 200q20 17 32 23l-15 21-44-32m92-12q-20 17-33 23l16 21 43-32" fill="#e2d6bd" stroke={C.line} strokeWidth="1.3"/>
  <path d="M72 254q48 19 96 0M81 276q39 13 78 0" fill="none" stroke={C.gold} strokeWidth="2.5"/>
  <path d="M159 224l18 76h-25l-11-68Z" fill="#4b3042" opacity=".24"/>
</g>}
function EmperorRobe(){return <g>
  <path d="M39 300q5-62 48-101l33 22 34-22q43 39 48 101Z" fill={C.red} stroke={C.line} strokeWidth="2.1"/>
  <path d="M87 200q20 17 33 24l-15 21-45-33m94-12q-21 17-34 24l16 21 44-33" fill="#dfd3ba" stroke={C.line} strokeWidth="1.35"/>
  <circle cx="120" cy="264" r="19" fill="none" stroke={C.gold} strokeWidth="2.4"/>
  <path d="M159 223l19 77h-26l-11-68Z" fill="#4d2e32" opacity=".25"/>
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face/><Neck/><CommonWomanRobe/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e8dfd1"/><ManHair/><Face male/><Neck/><CommonManRobe/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e9e0d2"/><ManHair elder/><Face male elder/><Neck/><ElderRobe/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee5d8"/><WomanHair royal/><path d="M60 48 80 26m101 24-18-23" stroke={C.gold} strokeWidth="3"/><circle cx="80" cy="26" r="4" fill="#b76064"/><circle cx="161" cy="27" r="4" fill="#b76064"/><Face princess/><Neck/><PrincessRobe/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e7ded0"/><ManHair/><path d="M80 64h80l-6-29H87Z" fill="#242321" stroke={C.line} strokeWidth="1.8"/><path d="M83 47 58 56m100-9 25 9" stroke="#242321" strokeWidth="7" strokeLinecap="round"/><Face male/><Neck/><EmperorRobe/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function CelCharacterStudy(){return <StudySection id="cel-character" letter="C · CEL-SHADED CHARACTER" title="角色设定感 Cel-shaded" subtitle="眼睛、发型和单块阴影更接近角色设定图；平民服装收敛，公主与皇帝才增加层次和装饰。" tags={['完整眼睛','角色感','发型轮廓','单块阴影']} renderPortrait={portrait}/>}
