import type {Frame} from '../../model';
import type {HairId} from './catalog';
import {OUTLINE,l,mirror,p} from './drawing';

export const INTEGRATED_HEAD_SHELL_HAIRS=['work-headscarf','scholar-cap','merchant-wrap'] as const;
export type IntegratedHairId=typeof INTEGRATED_HEAD_SHELL_HAIRS[number];

export type ChibiHeadShell={
  headShellBase:string;
  headwearBack:string;
  headwearFront:string;
  frontHair:string;
  sideLocks:string;
  backHair:string;
  signature:string;
};

type ShellColors={base:string;dark:string;light:string};
type ShellGuide={
  skullPath:string;
  frontHairPath:string;
  sideLockPath:string;
  backLockPath:string;
  bandLeft:number;
  bandRight:number;
  bandTop:number;
  bandBottom:number;
  capTop:number;
  capHalf:number;
};

// Head Shell 只按 Frame 建立固定作者 geometry；这里故意没有 FaceId，也不做运行时 fit / offset。
const guides:Record<Frame,ShellGuide>={
  'female.child':{
    skullPath:'M84 151Q70 112 92 80Q116 51 160 50Q204 51 228 80Q250 112 236 151L224 174H96Z',
    frontHairPath:'M100 102Q126 96 160 98Q194 96 220 102L217 122Q204 118 193 108Q183 122 168 129Q172 113 161 105Q149 124 130 131Q136 113 121 108Q111 120 101 128Z',
    sideLockPath:'M101 110Q91 130 96 158Q100 166 108 160L110 128Z',
    backLockPath:'M96 139Q88 156 94 177L106 180L109 149Z',
    bandLeft:100,bandRight:220,bandTop:83,bandBottom:104,capTop:35,capHalf:24,
  },
  'male.child':{
    skullPath:'M82 151Q68 111 90 79Q114 50 160 49Q206 50 230 79Q252 111 238 151L226 174H94Z',
    frontHairPath:'M98 101Q125 95 160 97Q195 95 222 101L219 121Q205 117 193 107Q183 121 168 128Q172 112 160 104Q148 123 128 131Q135 112 120 107Q109 120 99 127Z',
    sideLockPath:'M99 109Q90 128 95 156Q100 163 107 158L109 127Z',
    backLockPath:'M94 139Q87 155 93 176L105 179L108 149Z',
    bandLeft:98,bandRight:222,bandTop:82,bandBottom:104,capTop:34,capHalf:25,
  },
  'female.adult':{
    skullPath:'M91 151Q76 108 96 76Q119 47 160 46Q201 47 224 76Q244 108 229 151L219 174H101Z',
    frontHairPath:'M96 98Q124 91 160 93Q196 91 224 98L221 121Q206 117 194 105Q182 122 166 130Q171 110 160 101Q146 124 126 133Q133 110 117 104Q106 121 97 130Z',
    sideLockPath:'M97 108Q87 131 93 164Q98 172 107 165L110 128Z',
    backLockPath:'M101 142Q92 161 98 184L111 187L113 151Z',
    bandLeft:96,bandRight:224,bandTop:74,bandBottom:101,capTop:27,capHalf:28,
  },
  'male.adult':{
    skullPath:'M89 151Q74 107 94 75Q117 46 160 45Q203 46 226 75Q246 107 231 151L221 174H99Z',
    frontHairPath:'M94 97Q123 90 160 92Q197 90 226 97L223 120Q208 116 195 104Q183 121 166 129Q171 109 160 100Q146 123 124 133Q132 109 116 103Q104 120 95 130Z',
    sideLockPath:'M95 107Q85 130 91 164Q97 171 106 164L109 127Z',
    backLockPath:'M99 141Q90 160 96 184L110 187L112 150Z',
    bandLeft:94,bandRight:226,bandTop:73,bandBottom:101,capTop:26,capHalf:29,
  },
  'female.elder':{
    skullPath:'M92 153Q78 111 98 79Q120 50 160 49Q200 50 222 79Q242 111 228 153L218 176H102Z',
    frontHairPath:'M98 101Q125 95 160 96Q195 95 222 101L219 124Q205 120 194 109Q182 124 167 131Q171 113 160 104Q147 126 128 134Q134 113 119 107Q108 123 99 132Z',
    sideLockPath:'M99 111Q90 133 96 166Q101 173 109 166L112 130Z',
    backLockPath:'M102 145Q94 164 100 185L113 188L115 153Z',
    bandLeft:98,bandRight:222,bandTop:76,bandBottom:103,capTop:29,capHalf:27,
  },
  'male.elder':{
    skullPath:'M90 153Q76 110 96 78Q118 49 160 48Q202 49 224 78Q244 110 230 153L220 176H100Z',
    frontHairPath:'M96 100Q124 94 160 95Q196 94 224 100L221 123Q207 119 195 108Q183 123 167 131Q171 112 160 103Q146 125 126 134Q133 112 117 106Q106 122 97 132Z',
    sideLockPath:'M97 110Q88 132 94 166Q99 173 108 166L111 129Z',
    backLockPath:'M100 144Q92 163 98 185L112 188L114 152Z',
    bandLeft:96,bandRight:224,bandTop:75,bandBottom:103,capTop:28,capHalf:28,
  },
};

export function isIntegratedHeadShellHair(id:HairId):id is IntegratedHairId{
  return (INTEGRATED_HEAD_SHELL_HAIRS as readonly string[]).includes(id);
}

const group=(attrs:string,body:string)=>`<g ${attrs}>${body}</g>`;

function workHeadscarf(g:ShellGuide){
  const {bandLeft:a,bandRight:b,bandTop:y,bandBottom:z}=g;
  const back=p(`M${a-4} ${y+2}Q${a+8} ${y-22} 160 ${y-31}Q${b-8} ${y-22} ${b+4} ${y+2}L${b} ${z+2}Q160 ${z-10} ${a} ${z+2}Z`,'#9b7f5d',OUTLINE,4)
    +p(`M${b-2} ${y+6}Q${b+21} ${y+2} ${b+29} ${y+18}Q${b+31} ${y+33} ${b+15} ${y+43}Q${b+3} ${y+48} ${b-5} ${y+36}L${b+1} ${y+23}Q${b-8} ${y+16} ${b-2} ${y+6}Z`,'#7f684e',OUTLINE,4);
  const front=p(`M${a} ${y+3}Q126 ${y-10} 160 ${y-9}Q194 ${y-10} ${b} ${y+3}L${b-3} ${z}Q194 ${z-9} 160 ${z-8}Q126 ${z-9} ${a+3} ${z}Z`,'#b5966b',OUTLINE,4)
    +l(`M${a+14} ${y+9}Q134 ${y+1} 160 ${y+2}Q188 ${y} ${b-14} ${y+9}`,'#d7bd8b',3,.65);
  return {back:group('data-chibi-headwear-back=""',back),front:group('data-chibi-headwear-band=""',front)};
}

function scholarCap(g:ShellGuide){
  const {bandLeft:a,bandRight:b,bandTop:y,bandBottom:z,capTop,capHalf}=g;
  const cl=160-capHalf,cr=160+capHalf;
  const back=p(`M${a+11} ${y}Q${a+20} ${y-20} ${cl} ${y-28}L${cl} ${capTop+8}Q160 ${capTop-5} ${cr} ${capTop+8}L${cr} ${y-28}Q${b-20} ${y-20} ${b-11} ${y}L${b-15} ${z-3}H${a+15}Z`,'#59636a',OUTLINE,4)
    +p(`M${cl} ${capTop+8}Q160 ${capTop} ${cr} ${capTop+8}L${cr-3} ${y-25}Q160 ${y-31} ${cl+3} ${y-25}Z`,'#454d53',OUTLINE,3);
  const upper=p(`M${a+10} ${y-2}Q132 ${y-12} 160 ${y-11}Q188 ${y-12} ${b-10} ${y-2}L${b-6} ${y+17}Q190 ${y+10} 160 ${y+11}Q130 ${y+10} ${a+6} ${y+17}Z`,'#727c7d',OUTLINE,4);
  const lower=p(`M${a} ${y+15}Q128 ${y+7} 160 ${y+8}Q192 ${y+7} ${b} ${y+15}L${b-2} ${z}Q191 ${z-7} 160 ${z-6}Q129 ${z-7} ${a+2} ${z}Z`,'#4d565a',OUTLINE,4)
    +l(`M${a+31} ${y+1}L${a+31} ${y+17}M${b-31} ${y+1}L${b-31} ${y+17}`,'#9da7a4',2.6,.55);
  return {back:group('data-chibi-headwear-back=""',back),front:group('data-chibi-headwear-band=""',upper+lower)};
}

function merchantWrap(g:ShellGuide){
  const {bandLeft:a,bandRight:b,bandTop:y,bandBottom:z}=g;
  const back=p(`M${a-2} ${y+1}Q${a+17} ${y-25} 160 ${y-29}Q${b-17} ${y-25} ${b+2} ${y+1}L${b-4} ${z+2}Q196 ${z-10} 160 ${z-9}Q124 ${z-10} ${a+4} ${z+2}Z`,'#a77455',OUTLINE,4)
    +p(`M${b-3} ${y+4}Q${b+19} ${y-1} ${b+28} ${y+14}Q${b+34} ${y+27} ${b+20} ${y+39}Q${b+8} ${y+47} ${b-4} ${y+36}L${b+2} ${y+23}Q${b-8} ${y+17} ${b-3} ${y+4}Z`,'#8c5e44',OUTLINE,4);
  const front=p(`M${a} ${y+3}Q128 ${y-10} 160 ${y-9}Q192 ${y-10} ${b} ${y+3}L${b+3} ${y+23}Q194 ${y+16} 160 ${y+17}Q126 ${y+16} ${a-3} ${y+24}Z`,'#c18c63',OUTLINE,4)
    +l(`M${a+14} ${y+10}Q134 ${y+2} 160 ${y+3}Q188 ${y+1} ${b-14} ${y+10}`,'#e0b28b',3,.65)
    +p(`M${b-7} ${y+15}Q${b+5} ${y+21} ${b+11} ${y+32}L${b+1} ${y+42}L${b-11} ${y+27}Z`,'#99694a',OUTLINE,3);
  return {back:group('data-chibi-headwear-back=""',back),front:group('data-chibi-headwear-band=""',front)};
}

export function getIntegratedHeadShell(frame:Frame,id:IntegratedHairId,colors:ShellColors):ChibiHeadShell{
  const g=guides[frame];
  const signature=[g.bandLeft,g.bandRight,g.bandTop,g.bandBottom,g.capTop,g.capHalf,g.skullPath,g.frontHairPath,g.sideLockPath,g.backLockPath].join('|');
  const headShellBase=group(
    `data-chibi-head-shell="" data-head-shell-frame="${frame}" data-head-shell-hair="${id}" data-head-shell-signature="${signature}"`,
    p(g.skullPath,colors.base,OUTLINE,5)+p(`M${g.bandLeft+8} ${g.bandTop-4}Q160 ${g.bandTop-24} ${g.bandRight-8} ${g.bandTop-4}Q160 ${g.bandTop-14} ${g.bandLeft+8} ${g.bandTop-4}Z`,colors.light,'none',0,.22)
  );
  const frontHair=group('data-chibi-front-hair=""',p(g.frontHairPath,colors.base,OUTLINE,5));
  const sideLocks=group('data-chibi-side-locks=""',mirror(p(g.sideLockPath,colors.base,OUTLINE,4.5)));
  const backHair=group('data-chibi-back-hair=""',mirror(p(g.backLockPath,colors.dark,'none',0,.52)));
  const headwear=id==='work-headscarf'?workHeadscarf(g):id==='scholar-cap'?scholarCap(g):merchantWrap(g);
  return {headShellBase,headwearBack:headwear.back,headwearFront:headwear.front,frontHair,sideLocks,backHair,signature};
}
