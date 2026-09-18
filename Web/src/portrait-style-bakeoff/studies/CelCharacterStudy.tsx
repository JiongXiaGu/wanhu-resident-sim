import { StudySection, type BakeoffRole } from '../BakeoffShared';
const C={paper:'#ece4d7',line:'#282624',skin:'#d9a07c',skinM:'#c98c67',hair:'#292725',gray:'#77736f',teal:'#5f7a86',green:'#566a58',wine:'#785463',red:'#75494e',cream:'#e1d5bf',gold:'#c1a265'};
type Kind='woman'|'man'|'elder'|'princess'|'emperor';
const faceD:Record<Kind,string>={
  woman:'M120 65c-25 0-40 21-39 58 1 40 15 63 39 68 24-5 39-28 40-68 1-37-14-58-40-58Z',
  man:'M120 65c-30 0-45 22-44 60 1 40 17 64 44 70 28-6 44-30 45-70 1-38-16-60-45-60Z',
  elder:'M120 63c-27 0-42 21-42 60 0 43 16 69 42 76 26-7 42-33 42-76 0-39-15-60-42-60Z',
  princess:'M120 66c-23 0-38 20-37 56 1 39 14 60 37 65 23-5 36-26 37-65 1-36-14-56-37-56Z',
  emperor:'M120 64c-31 0-47 22-45 61 2 42 18 67 45 73 29-6 45-31 47-73 2-39-16-61-47-61Z',
};
function Face({kind}:{kind:Kind}){
  const male=kind==='man'||kind==='emperor';const elder=kind==='elder';const princess=kind==='princess';
  return <g>
    <path d={faceD[kind]} fill={elder?'#c89a78':male?C.skinM:C.skin} stroke={C.line} strokeWidth="2"/>
    <path d={male?'M88 103q11-7 23 0m19 0q12-7 23 0':'M91 103q10-7 20 0m20 0q10-7 20 0'} fill="none" stroke={C.line} strokeWidth={male?2.2:1.8} strokeLinecap="round"/>
    <path d={elder?'M90 115q10-7 21 0-9 10-21 0Zm39 0q10-7 21 0-9 10-21 0Z':'M89 114q11-10 23 0-10 13-23 0Zm39 0q11-10 23 0-10 13-23 0Z'} fill="#fffaf2" stroke={C.line} strokeWidth="1.4"/>
    <ellipse cx="101" cy="114" rx={princess?5.6:male?4.5:4.8} ry={princess?6.8:male?5.4:5.8} fill={princess?'#665b47':'#4f4a42'}/><ellipse cx="140" cy="114" rx={princess?5.6:male?4.5:4.8} ry={princess?6.8:male?5.4:5.8} fill={princess?'#665b47':'#4f4a42'}/>
    <circle cx="103" cy="111.5" r="1.4" fill="#fff"/><circle cx="142" cy="111.5" r="1.4" fill="#fff"/>
    {princess&&<><path d="M88 113l-6-3m69 3 6-3" stroke={C.line} strokeWidth="1.2"/><path d="M108 158q12 7 24 0" fill="#a65f62" stroke="#744749" strokeWidth=".8"/></>}
    {!princess&&<path d={elder?'M108 162q12 2 24-1':'M108 159q12 4 24 0'} fill="none" stroke="#714a47" strokeWidth="1.6" strokeLinecap="round"/>}
    <path d={male?'M118 121q0 12 5 16l9-3':'M118 121q-1 11 4 15l8-3'} fill="none" stroke="#805947" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M80 132q4 36 31 57-22-7-31-28Z" fill={male?'#b57a5b':'#c88f6c'} opacity=".55"/>
    {elder&&<path d="M85 133q10 5 20 2m31 0q10 3 20-2M90 94q10-5 20-1m21 0q10-4 19 1" fill="none" stroke="#9b715a" strokeWidth="1" opacity=".7"/>}
  </g>;
}
function WomanHair({royal=false}:{royal?:boolean}){return <g fill={C.hair} stroke={C.line} strokeWidth="1.8">
  <path d="M72 126q0-69 48-69 50 0 50 72l-15-43q-16-18-36-18-23 0-38 22Z"/>
  <path d="M76 85q-13 45-4 91l18 18-2-83Zm88 0q13 45 4 91l-18 18 2-83Z"/>
  {royal?<><ellipse cx="75" cy="56" rx="18" ry="20"/><ellipse cx="168" cy="58" rx="16" ry="19"/></>:<path d="M67 98q-8 12-3 27l15-5 2-23Z"/>}
  <path d="M83 85q17-18 36-26m43 27q-14-19-34-27" fill="none" stroke="#5b514c" strokeWidth="1.1" opacity=".55"/>
</g>}
function ManHair({elder=false}:{elder?:boolean}){const h=elder?C.gray:C.hair;return <g fill={h} stroke={C.line} strokeWidth="1.8">
  <path d="M73 123q2-65 47-65 48 0 50 68l-14-40q-16-17-36-17-22 0-37 21Z"/>
  <path d="M105 60q15-19 31 0l-3 17h-31Z"/>
  {elder&&<path d="M86 87q17-16 33-21m35 21q-13-14-29-21" fill="none" stroke="#aaa39c" strokeWidth="1.1" opacity=".75"/>}
</g>}
function Neck({male=false}:{male?:boolean}){return <path d={male?'M101 184q2 15-8 25 27 16 54 0-11-10-8-25Z':'M103 183q2 15-8 25 25 15 50 0-10-10-7-25Z'} fill={male?'#c6906f':'#cf9876'}/>}
function VCollar(){return <g stroke={C.line} strokeWidth="1.2"><path d="M88 204 120 224 106 240 72 215Z" fill={C.cream}/><path d="M152 204 120 224 135 240 168 215Z" fill="#cbbfa9"/></g>}
function Robe({fill,royal=false,male=false}:{fill:string;royal?:boolean;male?:boolean}){return <g>
  <path d={royal?'M40 300q5-63 48-101l32 22 33-22q43 38 48 101Z':'M50 300q4-59 41-96l29 18 30-18q37 37 41 96Z'} fill={fill} stroke={C.line} strokeWidth="2"/>
  {male&&!royal?<><path d="M88 204 129 229 113 246 67 215Z" fill={C.cream} stroke={C.line} strokeWidth="1.25"/><path d="M151 204 124 224 137 239 170 215Z" fill="#c8bca6" stroke={C.line} strokeWidth="1.25"/></>:<VCollar/>}
  <path d="M159 226l17 74h-24l-10-67Z" fill="#273" opacity=".17"/>
  {royal&&<><path d="M73 255q47 18 95 0" fill="none" stroke={C.gold} strokeWidth="2.4"/><circle cx="120" cy="271" r="15" fill="none" stroke={C.gold} strokeWidth="2"/></>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><WomanHair/><Face kind="woman"/><Neck/><Robe fill={C.teal}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e8dfd1"/><ManHair/><Face kind="man"/><Neck male/><Robe fill={C.green} male/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e9e0d2"/><ManHair elder/><Face kind="elder"/><Neck male/><Robe fill="#716a64" male/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee5d8"/><WomanHair royal/><path d="M60 48 80 26m101 24-18-23" stroke={C.gold} strokeWidth="3"/><circle cx="80" cy="26" r="4" fill="#b76064"/><circle cx="161" cy="27" r="4" fill="#b76064"/><Face kind="princess"/><Neck/><Robe fill={C.wine} royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e7ded0"/><ManHair/><path d="M80 64h80l-6-29H87Z" fill="#242321" stroke={C.line} strokeWidth="1.8"/><path d="M83 47 58 56m100-9 25 9" stroke="#242321" strokeWidth="7" strokeLinecap="round"/><Face kind="emperor"/><Neck male/><Robe fill={C.red} royal male/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function CelCharacterStudy(){return <StudySection id="cel-character" letter="C · CEL-SHADED CHARACTER" title="角色设定感 Cel-shaded" subtitle="五种身份的脸型、眼睛尺寸和下颌比例都不同；公主更精致、男性更宽、老人更长，不再共享同一张角色脸。" tags={['身份脸型差异','完整眼睛','发型轮廓','单块阴影']} renderPortrait={portrait}/>}
