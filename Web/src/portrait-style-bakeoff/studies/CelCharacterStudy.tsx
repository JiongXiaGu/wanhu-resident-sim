import { StudySection, type BakeoffRole } from '../BakeoffShared';
const C={paper:'#ece4d7',line:'#282624',skin:'#d9a07c',skinM:'#c98c67',hair:'#292725',gray:'#77736f',teal:'#5f7a86',green:'#566a58',wine:'#785463',red:'#75494e',cream:'#e1d5bf',gold:'#c1a265'};
type Kind='woman'|'man'|'elder'|'princess'|'emperor';
const faceD:Record<Kind,string>={
  woman:'M120 68c-23 0-38 17-39 44-1 23 6 45 19 61 7 9 13 14 20 17 7-3 14-8 21-17 13-16 20-38 19-61-1-27-16-44-40-44Z',
  man:'M120 66c-27 0-43 18-43 46 0 24 7 46 21 63l12 9q10 7 20 0l12-9c14-17 21-39 21-63 0-28-16-46-43-46Z',
  elder:'M120 66c-25 0-40 17-41 45-1 27 6 51 19 70 7 10 14 16 22 19 7-3 14-9 21-19 13-19 20-43 19-70-1-28-16-45-40-45Z',
  princess:'M120 70c-21 0-35 16-36 41-1 21 5 42 17 58 6 8 12 13 19 16 6-3 12-8 18-16 12-16 18-37 17-58-1-25-14-41-35-41Z',
  emperor:'M120 66c-28 0-44 18-44 47 0 25 8 48 22 65l12 9q10 7 20 0l12-9c15-17 22-40 22-65 0-29-16-47-44-47Z',
};
function Face({kind}:{kind:Kind}){
  const male=kind==='man'||kind==='emperor';const elder=kind==='elder';const princess=kind==='princess';
  return <g>
    <path d={faceD[kind]} fill={elder?'#c89a78':male?C.skinM:C.skin} stroke={C.line} strokeWidth="2"/>
    <path d={male?'M88 103q11-7 23 0m19 0q12-7 23 0':'M91 103q10-7 20 0m20 0q10-7 20 0'} fill="none" stroke={C.line} strokeWidth={male?2.15:1.75} strokeLinecap="round"/>
    <path d={elder?'M90 114q10-7 21 0-9 10-21 0Zm39 0q10-7 21 0-9 10-21 0Z':'M89 113q11-10 23 0-10 13-23 0Zm39 0q11-10 23 0-10 13-23 0Z'} fill="#fffaf2" stroke={C.line} strokeWidth="1.4"/>
    <ellipse cx="101" cy="113" rx={princess?5.6:male?4.5:4.8} ry={princess?6.8:male?5.4:5.8} fill={princess?'#665b47':'#4f4a42'}/><ellipse cx="140" cy="113" rx={princess?5.6:male?4.5:4.8} ry={princess?6.8:male?5.4:5.8} fill={princess?'#665b47':'#4f4a42'}/>
    <circle cx="103" cy="110.5" r="1.4" fill="#fff"/><circle cx="142" cy="110.5" r="1.4" fill="#fff"/>
    {princess&&<><path d="M88 112l-6-3m69 3 6-3" stroke={C.line} strokeWidth="1.15"/><path d="M108 156q12 7 24 0" fill="#a65f62" stroke="#744749" strokeWidth=".8"/></>}
    {!princess&&<path d={elder?'M108 160q12 2 24-1':'M108 157q12 4 24 0'} fill="none" stroke="#714a47" strokeWidth="1.55" strokeLinecap="round"/>}
    <path d={male?'M118 120q0 12 5 16l9-3':'M118 120q-1 11 4 15l8-3'} fill="none" stroke="#805947" strokeWidth="1.55" strokeLinecap="round"/>
    <path d="M82 128q4 34 28 55-20-7-28-27Z" fill={male?'#b57a5b':'#c88f6c'} opacity=".54"/>
    {elder&&<path d="M86 132q10 5 20 2m29 0q10 3 20-2M91 94q10-5 20-1m20 0q10-4 19 1" fill="none" stroke="#9b715a" strokeWidth=".95" opacity=".68"/>}
  </g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={C.hair} stroke={C.line} strokeWidth="1.8">
  <path d="M71 130q-3-77 49-77 54 0 50 80l-7 47-17 20H94l-19-20Z"/>
  <path d="M80 98c8-26 22-38 40-38 20 0 34 13 42 39-15-5-29-14-42-27-10 12-24 21-40 26Z"/>
  <path d="M76 99q-9 43-2 78l16 17-2-78m75-17q9 43 2 78l-16 17 2-78" fill="none" stroke="#5b514c" strokeWidth="1.05" opacity=".5"/>
  {royal?<><ellipse cx="76" cy="58" rx="18" ry="20"/><ellipse cx="167" cy="60" rx="16" ry="19"/></>:<path d="M67 98q-8 12-3 27l15-5 2-23Z"/>}
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?C.gray:C.hair;return <g fill={h} stroke={C.line} strokeWidth="1.8">
  <path d="M74 128q0-71 46-71 49 0 50 73l-7 36-18 23H96l-17-23Z"/>
  <path d="M81 98c9-24 22-36 39-36 19 0 32 12 40 36-14-5-27-13-40-25-11 11-24 20-39 25Z"/>
  <path d="M104 60q16-19 32 0l-3 17h-32Z"/>
  {elder&&<path d="M87 88q17-15 32-20m35 20q-13-14-29-20" fill="none" stroke="#aaa39c" strokeWidth="1.05" opacity=".72"/>}
</g>}
function Neck({male=false}:{male?:boolean}){return <path d={male?'M103 179q1 15-8 25 25 15 50 0-10-10-8-25Z':'M104 178q1 15-8 25 24 14 48 0-9-10-7-25Z'} fill={male?'#c6906f':'#cf9876'}/>}
function VCollar(){return <g stroke={C.line} strokeWidth="1.15"><path d="M96 203 120 218 109 231 82 211Z" fill={C.cream}/><path d="M144 203 120 218 132 231 158 211Z" fill="#cbbfa9"/></g>}
function Robe({fill,royal=false,male=false}:{fill:string;royal?:boolean;male?:boolean}){return <g>
  <path d={royal?'M43 300q6-60 46-96l31 17 32-17q40 36 46 96Z':'M51 300q5-56 40-92l29 15 30-15q35 36 40 92Z'} fill={fill} stroke={C.line} strokeWidth="1.9"/>
  {male&&!royal?<><path d="M94 203 128 223 115 237 80 211Z" fill={C.cream} stroke={C.line} strokeWidth="1.2"/><path d="M145 203 124 218 135 230 157 211Z" fill="#c8bca6" stroke={C.line} strokeWidth="1.2"/></>:<VCollar/>}
  <path d="M160 224l17 76h-24l-11-69Z" fill="#253" opacity=".17"/>
  {royal&&<><path d="M72 256q48 17 96 0" fill="none" stroke={C.gold} strokeWidth="2.3"/><circle cx="120" cy="270" r="15" fill="none" stroke={C.gold} strokeWidth="1.9"/></>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face kind="woman"/><Neck/><Robe fill={C.teal}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e8dfd1"/><ManHair/><Face kind="man"/><Neck male/><Robe fill={C.green} male/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e9e0d2"/><ManHair elder/><Face kind="elder"/><Neck male/><Robe fill="#716a64" male/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee5d8"/><WomanHair royal/><path d="M60 49 80 27m100 23-17-22" stroke={C.gold} strokeWidth="2.9"/><circle cx="80" cy="27" r="4" fill="#b76064"/><circle cx="161" cy="28" r="4" fill="#b76064"/><Face kind="princess"/><Neck/><Robe fill={C.wine} royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e7ded0"/><ManHair/><path d="M92 58h56l-5-25H98Z" fill="#242321"/><path d="M96 42 65 50m79-8 31 8" stroke="#242321" strokeWidth="5.5" strokeLinecap="round"/><Face kind="emperor"/><Neck male/><Robe fill={C.red} royal male/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function CelCharacterStudy(){return <StudySection id="cel-character" letter="C · CEL-SHADED CHARACTER" title="角色设定感 Cel-shaded" subtitle="把头发改成真正覆盖额头的角色发际线，脸型不再是椭圆贴片；眼睛继续保留 Cel 风格的眼白、虹膜与高光。" tags={['角色发际线','完整眼睛','下颌结构','单块阴影']} renderPortrait={portrait}/>}
