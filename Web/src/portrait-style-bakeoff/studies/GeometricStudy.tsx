import { StudySection, type BakeoffRole } from '../BakeoffShared';
const G={paper:'#d7d0bd',ink:'#2f302d',skin:'#c8926d',skin2:'#b87d60',jade:'#536b68',blue:'#596a77',red:'#7c5556',gold:'#b69a62',cream:'#d8cdb5',gray:'#77736e'};
function Face({male=false,elder=false}:{male?:boolean;elder?:boolean}){const s=elder?'#b98466':male?G.skin2:G.skin;return <g>
  <polygon points={male?'120,60 158,81 166,132 143,184 119,198 89,181 73,132 82,82':'120,58 154,78 164,130 143,180 120,196 92,179 76,130 85,80'} fill={s}/>
  <polygon points="83,126 103,113 115,123 101,133" fill={G.ink}/><polygon points="128,123 141,113 159,126 143,134" fill={G.ink}/>
  <circle cx="102" cy="124" r="2.5" fill={G.cream}/><circle cx="141" cy="124" r="2.5" fill={G.cream}/>
  <polyline points="120,127 114,147 127,151" fill="none" stroke="#744d3d" strokeWidth="3"/>
  <polyline points="104,165 119,171 135,165" fill="none" stroke="#744744" strokeWidth="3"/>
  {elder&&<><line x1="86" y1="140" x2="104" y2="145" stroke="#8b604c" strokeWidth="2"/><line x1="137" y1="145" x2="157" y2="140" stroke="#8b604c" strokeWidth="2"/></>}
</g>}
function Hair({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}){const h=elder?G.gray:G.ink;return <g fill={h}>
  <polygon points={male?'73,119 79,75 108,44 145,50 168,81 169,120 153,85 121,63 91,85':'70,119 77,72 105,42 145,47 168,77 171,122 153,84 119,62 88,85'} />
  {male?<polygon points="103,51 113,30 137,31 145,51"/>:<><polygon points={royal?'57,75 65,47 89,44 95,70':'60,82 68,58 89,55 94,75'}/><polygon points={royal?'160,72 169,49 190,53 184,79':'158,80 166,60 184,64 180,83'}/></>}
</g>}
function Robe({fill,royal=false}:{fill:string;royal?:boolean}){return <g>
  <polygon points="41,300 56,235 91,197 120,221 150,197 185,235 201,300" fill={fill}/>
  <polygon points="91,197 120,221 101,248 65,218" fill={G.cream}/><polygon points="150,197 120,221 140,248 176,218" fill={G.cream}/>
  <polygon points="76,300 93,249 120,263 147,249 164,300" fill={royal?G.gold:'#445'} opacity={royal?.42:.14}/>
  {royal&&<polygon points="108,267 120,255 132,267 120,281" fill="none" stroke={G.gold} strokeWidth="3"/>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={G.paper}/><Hair/><Face/><Robe fill={G.jade}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d1cab8"/><Hair male/><Face male/><Robe fill={G.blue}/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d4cdbc"/><Hair male elder/><Face male elder/><Robe fill="#706a63"/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#dad2bf"/><Hair royal/><polyline points="60,56 81,31 91,54m78,0 15-22 16,27" fill="none" stroke={G.gold} strokeWidth="4"/><Face/><Robe fill="#765e70" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d3ccb8"/><Hair male/><polygon points="78,61 88,29 155,29 163,61" fill="#292a28"/><polygon points="80,42 50,55 80,50" fill="#292a28"/><polygon points="160,42 191,55 160,50" fill="#292a28"/><Face male/><Robe fill="#735052" royal/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function GeometricStudy(){return <StudySection id="geometric" letter="E · GEOMETRIC DECORATIVE" title="几何装饰人物风" subtitle="用切面、折线和多边形构成人脸与衣服。模块边界最清楚，适合大量组合，但重点验证这种高设计感是否会削弱人物亲和力。" tags={['多边形','强剪影','模块边界清楚','设计感']} renderPortrait={portrait}/>}
