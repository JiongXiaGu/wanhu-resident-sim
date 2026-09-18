import { StudySection, type BakeoffRole } from '../BakeoffShared';

const C={paper:'#efe9dc',ink:'#403a35',skin:'#d3a080',skin2:'#c78d6e',hair:'#2f2b29',gray:'#77726e',jade:'#687f7b',blue:'#617487',red:'#865a56',cream:'#d9ccb2',gold:'#b89b61'};

function Eyes({y=116}:{y?:number}) {
  return <g fill="none" stroke={C.ink} strokeWidth="1.45" strokeLinecap="round">
    <path d="M92 116q10-6 20 0"/><path d="M128 116q10-6 20 0"/>
    <circle cx="102" cy={y-1} r="2.2" fill={C.ink} stroke="none"/><circle cx="138" cy={y-1} r="2.2" fill={C.ink} stroke="none"/>
  </g>;
}
function Face({elder=false}:{elder?:boolean}) {
  return <g>
    <path d="M120 63C91 63 77 86 79 126c2 44 18 66 41 67 25-1 41-23 42-67 2-40-13-63-42-63Z" fill={elder?'#c59675':C.skin} stroke={C.ink} strokeWidth="1.5"/>
    <Eyes/>
    <path d="M119 120c-2 10-1 18 3 22 3 1 7 0 9-3" fill="none" stroke="#805b49" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M108 158q12 5 24 0" fill="none" stroke="#895955" strokeWidth="1.4" strokeLinecap="round"/>
    {elder&&<path d="M91 132q9 5 18 2m22 0q9 3 18-2M96 147l-9 3m66-3 8 3" fill="none" stroke="#9a705a" strokeWidth=".8" opacity=".65"/>}
  </g>;
}
function CrossRobe({fill,formal=false}:{fill:string;formal?:boolean}) {
  return <g>
    <path d="M48 300c4-59 28-91 69-105h8c42 13 65 47 69 105Z" fill={fill} stroke={C.ink} strokeWidth="1.65"/>
    <path d="m91 196 29 28-19 24-39-35m87-17-29 28 20 24 38-35" fill={C.cream} stroke={C.ink} strokeWidth="1.25"/>
    {formal&&<path d="M83 258q37 15 75 0M91 276q29 10 58 0" fill="none" stroke={C.gold} strokeWidth="2.2"/>}
  </g>;
}
function CommonWoman(){return <svg viewBox="0 0 240 300">
  <rect width="240" height="300" fill={C.paper}/>
  <path d="M73 93c2-45 18-71 48-71 31 0 49 28 46 75l-5 78-18 24H94l-21-25Z" fill={C.hair}/>
  <Face/><path d="M76 97c13-12 22-28 28-48 13 16 31 25 57 29" fill="none" stroke={C.hair} strokeWidth="15" strokeLinecap="round"/>
  <ellipse cx="69" cy="92" rx="12" ry="16" fill={C.hair}/>
  <CrossRobe fill={C.jade}/>
</svg>}
function CommonMan(){return <svg viewBox="0 0 240 300">
  <rect width="240" height="300" fill="#ebe4d5"/>
  <path d="M75 91c5-44 22-68 50-68 31 0 48 27 45 73l-5 77-18 25H95l-22-25Z" fill={C.hair}/>
  <Face/><path d="M78 92c15-11 27-28 34-47 12 13 29 22 54 26" fill="none" stroke={C.hair} strokeWidth="16" strokeLinecap="round"/>
  <path d="M111 20q15-9 30 0l-3 17h-30Z" fill={C.hair}/>
  <CrossRobe fill={C.blue}/>
</svg>}
function Elder(){return <svg viewBox="0 0 240 300">
  <rect width="240" height="300" fill="#eee7d8"/>
  <path d="M76 94c3-42 20-67 47-67 30 0 48 26 45 71l-5 74-19 27H95l-22-26Z" fill={C.gray}/>
  <Face elder/><path d="M78 94c12-10 21-24 27-42 18 0 38 8 59 24" fill="none" stroke={C.gray} strokeWidth="14" strokeLinecap="round"/>
  <CrossRobe fill="#746f68"/>
</svg>}
function Princess(){return <svg viewBox="0 0 240 300">
  <rect width="240" height="300" fill="#f1eadc"/>
  <path d="M71 96c1-48 19-75 50-75 34 0 52 30 49 80l-5 75-20 22H95l-24-24Z" fill="#2c2927"/>
  <Face/><path d="M74 98c13-14 24-33 30-53 15 18 34 27 62 30" fill="none" stroke="#2c2927" strokeWidth="16" strokeLinecap="round"/>
  <ellipse cx="72" cy="68" rx="18" ry="20" fill="#2c2927"/><ellipse cx="169" cy="70" rx="15" ry="18" fill="#2c2927"/>
  <path d="M63 53l18-19m87 21 14-20M75 38l3-16m94 19 5-17" stroke={C.gold} strokeWidth="3" strokeLinecap="round"/>
  <circle cx="80" cy="34" r="4" fill="#b96e65"/><circle cx="168" cy="37" r="4" fill="#b96e65"/>
  <CrossRobe fill="#7d666f" formal/>
</svg>}
function Emperor(){return <svg viewBox="0 0 240 300">
  <rect width="240" height="300" fill="#ece4d4"/>
  <path d="M75 95c3-43 20-67 49-67 30 0 47 26 45 71l-5 73-18 27H95l-22-27Z" fill={C.hair}/>
  <Face/><path d="M78 95c14-11 25-27 32-45 13 14 31 22 55 25" fill="none" stroke={C.hair} strokeWidth="15" strokeLinecap="round"/>
  <path d="M84 40h75l-5-25H91Z" fill="#292725" stroke={C.ink} strokeWidth="1.5"/>
  <path d="M86 22 63 31m94-9 22 9" stroke="#292725" strokeWidth="6" strokeLinecap="round"/>
  <CrossRobe fill="#755152" formal/>
  <circle cx="120" cy="258" r="18" fill="none" stroke={C.gold} strokeWidth="2.2"/>
  <path d="M111 262q9-15 18 0m-21-5q12-6 24 0" fill="none" stroke={C.gold} strokeWidth="1.7"/>
</svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <CommonWoman/>;if(role==='common-man')return <CommonMan/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function ElegantFlatStudy(){return <StudySection id="elegant-flat" letter="A · ELEGANT FINE-LINE FLAT" title="雅致细线国风扁平" subtitle="自然比例、克制细线、柔和低饱和。用发式与领型表达身份，五官不靠夸张。目标是兼顾居民量产和重要角色的体面感。" tags={['自然五官','细线','低饱和','身份靠发式与衣领']} renderPortrait={portrait}/>}
