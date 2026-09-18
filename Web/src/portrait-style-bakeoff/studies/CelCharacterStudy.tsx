import { StudySection, type BakeoffRole } from '../BakeoffShared';
const C={paper:'#ebe3d5',line:'#292725',skin:'#d8a07b',skin2:'#c88966',hair:'#292726',gray:'#73706d',teal:'#617987',green:'#586b58',wine:'#77545f',red:'#784b4d',cream:'#ded2ba',gold:'#c3a463'};
function Face({male=false,elder=false,princess=false}:{male?:boolean;elder?:boolean;princess?:boolean}){
  const fill=elder?'#c99977':male?C.skin2:C.skin;
  return <g>
    <path d={male?"M120 68c-29 0-44 22-43 60 1 43 18 65 43 66 27-1 44-24 45-66 1-37-16-60-45-60Z":"M120 66c-27 0-42 22-41 59 1 42 17 64 41 65 25-1 41-23 42-65 1-37-15-59-42-59Z"} fill={fill} stroke={C.line} strokeWidth="2.2"/>
    <path d="M90 113q10-9 21 0-9 11-21 0Zm39 0q10-9 21 0-9 11-21 0Z" fill="#fffaf1" stroke={C.line} strokeWidth="1.5"/>
    <ellipse cx="101" cy="113" rx={princess?5:4.5} ry={princess?6:5.4} fill={princess?'#5f584a':'#514b43'}/><ellipse cx="140" cy="113" rx={princess?5:4.5} ry={princess?6:5.4} fill={princess?'#5f584a':'#514b43'}/>
    <circle cx="103" cy="111" r="1.3" fill="#fff"/><circle cx="142" cy="111" r="1.3" fill="#fff"/>
    <path d="M118 121q-1 12 4 16l8-3" fill="none" stroke="#815846" strokeWidth="1.7" strokeLinecap="round"/>
    <path d={princess?"M108 155q12 7 24 0":"M108 155q12 4 24 0"} fill={princess?'#a96062':'none'} stroke="#754c48" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M80 132q4 36 31 57-22-7-31-29Z" fill={male?'#b87b5c':'#c98e6c'} opacity=".58"/>
    {elder&&<path d="M85 130q10 5 20 2m31 0q10 3 20-2M91 96q10-5 19-1m21 0q10-4 19 1" fill="none" stroke="#9a7059" strokeWidth="1.1" opacity=".7"/>}
  </g>
}
function Hair({male=false,elder=false,princess=false}:{male?:boolean;elder?:boolean;princess?:boolean}){
  const fill=elder?C.gray:C.hair;
  if(princess)return <g fill={fill} stroke={C.line} strokeWidth="2"><path d="M72 114q1-67 48-67 50 0 50 70l-13-43q-18-18-37-17-25 0-40 24Z"/><ellipse cx="76" cy="55" rx="18" ry="20"/><ellipse cx="166" cy="56" rx="16" ry="19"/></g>;
  if(male)return <g fill={fill} stroke={C.line} strokeWidth="2"><path d="M72 111q3-62 48-62 48 0 50 65l-12-39q-18-17-39-16-23 0-38 23Z"/><path d="M107 49q12-17 27 0l-4 17h-25Z"/></g>;
  return <g fill={fill} stroke={C.line} strokeWidth="2"><path d="M73 112q1-64 47-64 49 0 49 67l-12-41q-18-17-38-16-24 0-39 24Z"/><path d="M72 74q-10 34-3 75l15 28-2-72Z"/><path d="M168 74q10 34 3 75l-15 28 2-72Z"/></g>;
}
function Robe({fill,royal=false}:{fill:string;royal?:boolean}){return <g>
  <path d="M50 300q5-62 45-100l25 20 26-20q39 38 44 100Z" fill={fill} stroke={C.line} strokeWidth="2.1"/>
  <path d="m95 200 25 20-15 21-35-31m76-10-26 20 16 21 34-31" fill={C.cream} stroke={C.line} strokeWidth="1.4"/>
  <path d="m159 220 18 80h-25l-10-71Z" fill="#324" opacity=".16"/>
  {royal&&<><path d="M83 265q37 13 75 0" fill="none" stroke={C.gold} strokeWidth="2.5"/><circle cx="120" cy="271" r="14" fill="none" stroke={C.gold} strokeWidth="2"/></>}
</g>}
function CommonWoman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={C.paper}/><Hair/><Face/><Robe fill={C.teal}/></svg>}
function CommonMan(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e7decf"/><Hair male/><Face male/><Robe fill={C.green}/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e8dfd1"/><Hair male elder/><Face male elder/><Robe fill="#716b64"/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#eee5d8"/><Hair princess/><path d="M63 45 80 26m97 21-16-20" stroke={C.gold} strokeWidth="3" strokeLinecap="round"/><circle cx="82" cy="25" r="4" fill="#b85e61"/><circle cx="158" cy="26" r="4" fill="#b85e61"/><Face princess/><Robe fill={C.wine} royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e6ddce"/><Hair male/><path d="M80 60h80l-6-28H87Z" fill="#252422" stroke={C.line} strokeWidth="2"/><path d="M83 43 58 52m99-9 25 9" stroke="#252422" strokeWidth="7" strokeLinecap="round"/><Face male/><Robe fill={C.red} royal/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <CommonWoman/>;if(role==='common-man')return <CommonMan/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function CelCharacterStudy(){return <StudySection id="cel-character" letter="C · CEL-SHADED CHARACTER" title="角色设定感 Cel-shaded" subtitle="明确眼白、虹膜、高光与单块脸部阴影，重要角色更容易做漂亮。平民仍控制细节，不把所有居民画成卡牌立绘。" tags={['完整眼睛','角色感','单块阴影','重要角色表现强']} renderPortrait={portrait}/>}
