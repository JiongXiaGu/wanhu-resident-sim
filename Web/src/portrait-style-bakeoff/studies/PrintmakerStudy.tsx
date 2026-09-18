import { StudySection, type BakeoffRole } from '../BakeoffShared';
const P={paper:'#d7bd83',ink:'#211e1a',skin:'#c58d66',red:'#8a5148',blue:'#4f6570',green:'#566858',cream:'#dfc891',gray:'#706b65'};
function Face({elder=false}:{elder?:boolean}){return <g>
  <path d="M120 67C89 67 73 91 76 132c3 43 19 64 44 64 27 0 43-22 45-64 3-41-14-65-45-65Z" fill={elder?'#bb8868':P.skin} stroke={P.ink} strokeWidth="4"/>
  <path d="M88 116q11-7 22 0m20 0q11-7 22 0" fill="none" stroke={P.ink} strokeWidth="4.2" strokeLinecap="round"/>
  <circle cx="99" cy="122" r="3.5" fill={P.ink}/><circle cx="141" cy="122" r="3.5" fill={P.ink}/>
  <path d="M117 127q-2 12 4 17l9-3" fill="none" stroke={P.ink} strokeWidth="3.4" strokeLinecap="round"/>
  <path d="M104 161q15 3 29-1" fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round"/>
  {elder&&<path d="M84 137l18 4m36 0 18-4M90 151l13 4m35-4 13 4" stroke={P.ink} strokeWidth="2.1" opacity=".6"/>}
</g>}
function Hair({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}){const h=elder?P.gray:P.ink;return <g fill={h}>
  <path d={male?"M72 116q4-70 49-70 47 0 50 73l-16-42q-16-16-35-16-22 0-37 20Z":"M69 118q2-72 51-72 50 0 52 75l-17-44q-18-16-36-16-23 0-38 22Z"}/>
  {male?<path d="M104 49q16-22 34 0l-4 19h-33Z"/>:<><ellipse cx="69" cy="77" rx={royal?18:13} ry={royal?20:15}/><ellipse cx="172" cy="82" rx={royal?16:10} ry={royal?19:13}/></>}
</g>}
function Robe({fill,royal=false}:{fill:string;royal?:boolean}){return <g>
  <path d="M37 300q7-67 53-103l30 23 31-23q45 36 52 103Z" fill={fill} stroke={P.ink} strokeWidth="5"/>
  <path d="m90 197 30 23-19 24-39-33m89-14-31 23 20 24 38-33" fill="none" stroke={P.cream} strokeWidth="6"/>
  <path d="M48 244l30-10m82 10-29-10M54 264l26-8m75 8-26-8M66 282l22-6m64 6-22-6" stroke={P.ink} strokeWidth="2.3" opacity=".72"/>
  {royal&&<circle cx="120" cy="267" r="20" fill="none" stroke={P.cream} strokeWidth="5"/>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={P.paper}/><Hair/><Face/><Robe fill={P.red}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#ceb276"/><Hair male/><Face/><Robe fill={P.green}/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d0b67d"/><Hair male elder/><Face elder/><Robe fill="#6d665e"/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d8bd83"/><Hair royal/><path d="M57 63 78 37m107 27-20-27" stroke={P.ink} strokeWidth="5"/><circle cx="79" cy="35" r="5" fill={P.red}/><circle cx="164" cy="36" r="5" fill={P.red}/><Face/><Robe fill="#6f5a69" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d1b77d"/><Hair male/><path d="M77 62h87l-6-30H84Z" fill={P.ink}/><path d="M80 44 50 56m111-12 30 12" stroke={P.ink} strokeWidth="10" strokeLinecap="round"/><Face/><Robe fill={P.blue} royal/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function PrintmakerStudy(){return <StudySection id="printmaker" letter="D · SIMPLIFIED PRINTMAKER" title="简化版画 / 套色刻线" subtitle="厚重黑形、有限套色和短刻线形成项目辨识度。角色在 48px 时也能靠黑白关系读出来，但不追求真实木刻纹理。" tags={['粗黑关系','有限色版','刻线','小尺寸强']} renderPortrait={portrait}/>}
