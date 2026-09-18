import { StudySection, type BakeoffRole } from '../BakeoffShared';
const G={paper:'#d9d2c0',ink:'#30312e',skin:'#c8916c',skinM:'#b97d60',jade:'#536d69',blue:'#5c6e7d',red:'#7a5657',gold:'#b79a61',cream:'#d8ceb8',gray:'#7b7772'};
function Face({male=false,elder=false}:{male?:boolean;elder?:boolean}){const s=elder?'#bb8768':male?G.skinM:G.skin;return <g>
  <polygon points={male?'120,59 155,76 166,119 154,161 120,192 86,162 74,119 85,77':'120,57 153,74 164,118 151,160 120,190 90,160 76,118 87,76'} fill={s}/>
  <polygon points="87,99 105,91 113,98 104,104 89,106" fill={G.ink}/><polygon points="127,98 136,91 154,99 151,106 136,104" fill={G.ink}/>
  <polygon points="91,114 104,108 113,114 104,120" fill={G.cream}/><polygon points="128,114 137,108 150,114 138,120" fill={G.cream}/>
  <circle cx="104" cy="114" r="2.3" fill={G.ink}/><circle cx="138" cy="114" r="2.3" fill={G.ink}/>
  <polyline points="120,118 113,139 127,144" fill="none" stroke="#744d3d" strokeWidth="2.5"/>
  <polyline points="104,160 119,167 136,160" fill="none" stroke="#754744" strokeWidth="2.8"/>
  <polygon points="78,121 98,126 91,148" fill="#a96f57" opacity=".23"/><polygon points="162,121 143,126 151,148" fill="#a96f57" opacity=".17"/>
  {elder&&<><line x1="87" y1="132" x2="104" y2="138" stroke="#8c604c" strokeWidth="1.8"/><line x1="137" y1="138" x2="154" y2="132" stroke="#8c604c" strokeWidth="1.8"/></>}
</g>}
function Hair({male=false,elder=false,royal=false}:{male?:boolean;elder?:boolean;royal?:boolean}){const h=elder?G.gray:G.ink;return <g fill={h}>
  <polygon points={male?'72,119 80,74 108,43 147,49 169,79 170,121 153,85 121,63 89,85':'69,120 77,71 105,41 146,46 170,77 172,123 153,84 119,62 87,85'} />
  {male?<polygon points="103,50 113,28 138,30 146,51"/>:<><polygon points={royal?'56,75 65,46 90,44 96,69':'59,82 68,58 89,55 95,75'}/><polygon points={royal?'159,71 169,48 191,52 184,79':'158,80 166,60 184,64 180,83'}/></>}
</g>}
function Robe({fill,royal=false,male=false}:{fill:string;royal?:boolean;male?:boolean}){return <g>
  <polygon points="39,300 55,235 91,197 120,221 150,197 186,235 202,300" fill={fill}/>
  <polygon points={male?'91,197 132,229 113,251 65,216':'91,197 120,221 101,248 65,218'} fill={G.cream}/>
  <polygon points={male?'150,197 128,218 140,241 176,216':'150,197 120,221 140,248 176,218'} fill="#c9bda6"/>
  <polygon points="76,300 93,250 120,263 147,250 164,300" fill={royal?G.gold:'#314'} opacity={royal?.38:.1}/>
  {royal&&<polygon points="108,267 120,255 132,267 120,281" fill="none" stroke={G.gold} strokeWidth="3"/>}
</g>}
function Woman(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill={G.paper}/><Hair/><Face/><Robe fill={G.jade}/></svg>}
function Man(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d3ccba"/><Hair male/><Face male/><Robe fill={G.blue} male/></svg>}
function Elder(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d6cfbe"/><Hair male elder/><Face male elder/><Robe fill="#716a63" male/></svg>}
function Princess(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#dcd4c2"/><Hair royal/><polyline points="60,56 81,31 92,54m76,0 16-22 15,27" fill="none" stroke={G.gold} strokeWidth="4"/><Face/><Robe fill="#745f72" royal/></svg>}
function Emperor(){return <svg viewBox="0 0 240 300"><rect width="240" height="300" fill="#d5cdb9"/><Hair male/><polygon points="78,61 88,29 155,29 163,61" fill="#292a28"/><polygon points="80,42 50,55 80,50" fill="#292a28"/><polygon points="160,42 191,55 160,50" fill="#292a28"/><Face male/><Robe fill="#735052" royal male/></svg>}
function portrait(role:BakeoffRole){if(role==='common-woman')return <Woman/>;if(role==='common-man')return <Man/>;if(role==='elder')return <Elder/>;if(role==='princess')return <Princess/>;return <Emperor/>}
export function GeometricStudy(){return <StudySection id="geometric" letter="E · GEOMETRIC DECORATIVE" title="几何装饰人物风" subtitle="保留切面和模块化优势，但取消上一版黑色眼罩感；眼睛仍是几何形，却保留眼白、瞳孔和眉形。" tags={['多边形','切面阴影','几何眼型','模块边界清楚']} renderPortrait={portrait}/>}
