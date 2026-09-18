import { StudySection, type BakeoffRole } from '../BakeoffShared';
const P={paper:'#ead6a5',ink:'#3b3029',skin:'#d49a72',green:'#60785f',red:'#a45f55',yellow:'#d4a45e',cream:'#f0d9aa',gray:'#777069'};
function Head({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}){
  const hair=elder?P.gray:P.ink;
  return <g>
    <ellipse cx="120" cy="124" rx={male?51:54} ry={male?61:58} fill={P.skin}/>
    <path d="M68 112q8-73 52-73 48 0 54 76-16-15-28-36-25 20-58 17-8 9-20 16Z" fill={hair}/>
    {!male&&<><circle cx="66" cy="79" r={royal?17:12} fill={hair}/><circle cx="176" cy="84" r={royal?15:10} fill={hair}/></>}
    {male&&<path d="M105 44q15-15 32 0l-4 18h-30Z" fill={hair}/>}
    <path d="M87 118q9-8 18 0m30 0q9-8 18 0" fill="none" stroke={P.ink} strokeWidth="3.4" strokeLinecap="round"/>
    <circle cx="97" cy="125" r="4.2" fill={P.ink}/><circle cx="144" cy="125" r="4.2" fill={P.ink}/>
    <path d="M119 128q-2 13 4 18l9-3" fill="none" stroke="#865a47" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M105 158q15 10 30 0" fill="none" stroke="#8f4f49" strokeWidth="3.2" strokeLinecap="round"/>
    {!male&&<><circle cx="88" cy="145" r="10" fill="#d87f6b" opacity=".42"/><circle cx="154" cy="145" r="10" fill="#d87f6b" opacity=".42"/></>}
    {elder&&<path d="M82 137q11 6 22 3m34 0q10 3 21-3m-69 18 14 4m35-4 13-4" fill="none" stroke="#9b6f58" strokeWidth="1.8" opacity=".7"/>}
  </g>
}
function Robe({fill,royal=false}:{fill:string;royal?:boolean}){return <g>
  <path d="M33 300q8-70 53-104l34 23 35-23q44 34 52 104Z" fill={fill}/>
  <path d="m86 196 34 23-20 22-35-28m90-17-35 23 20 22 35-28" fill={P.cream}/>
  <path d="M70 257q50 24 101 0M76 278q43 18 88 0" fill="none" stroke={royal?P.yellow:'#c5a272'} strokeWidth={royal?5:4} strokeLinecap="round"/>
  {royal&&<path d="m92 263 8 8 8-8 8 8 8-8 8 8 8-8 8 8" fill="none" stroke={P.cream} strokeWidth="2.8"/>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={P.paper}/><Head/><Robe fill={P.red}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#dfc993"/><Head male/><Robe fill={P.green}/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e2cc9a"/><Head male elder/><Robe fill="#776e65"/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#edd8a7"/><Head royal/><path d="M59 65 80 37m100 31-18-30M76 43l4-20m86 22 5-20" stroke={P.yellow} strokeWidth="4" strokeLinecap="round"/><circle cx="82" cy="35" r="5" fill="#bd635e"/><circle cx="160" cy="38" r="5" fill="#bd635e"/><Robe fill="#766778" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#e5ce9a"/><Head male/><path d="M74 65h92l-7-30H82Z" fill={P.ink}/><path d="M77 45 48 57m115-12 30 12" stroke={P.ink} strokeWidth="9" strokeLinecap="round"/><Robe fill="#8f514d" royal/><circle cx="120" cy="262" r="20" fill="none" stroke={P.yellow} strokeWidth="4"/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function NeoFolkStudy(){return <StudySection id="neo-folk" letter="B · MODERN NEO-FOLK" title="现代民俗绘本风" subtitle="宽脸、圆润比例、暖色和布料纹样。平民更亲切，贵族通过发饰、套色和衣纹升级，而不是换成另一套审美系统。" tags={['宽脸圆润','暖色','布纹','居民生活气']} renderPortrait={portrait}/>}
