import type {
  AppearanceCatalogDefinition,
  Gender,
  LifeStageId,
  ResidentAppearanceDNA,
} from '../domain/resident';
import {
  faceFamilyForId,
  hairVisibilityForHeadwear,
  portraitDiagnostics,
  portraitRigForFace,
  type PortraitFaceFamily,
  type PortraitLayer,
  type PortraitRig,
} from './portrait-rig';

type Props = {
  seed?: number;
  gender: Gender;
  lifeStage: LifeStageId;
  occupationId?: string;
  appearance?: ResidentAppearanceDNA;
  catalog?: AppearanceCatalogDefinition;
  label?: string;
  debugRig?: boolean;
  hiddenLayers?: PortraitLayer[];
};

const SKIN_COLORS: Record<string, string> = {
  'appearance.palette.skin.warm-01': '#c79d79',
  'appearance.palette.skin.warm-02': '#d3ac86',
  'appearance.palette.skin.deep-01': '#a97859',
  'appearance.palette.skin.light-01': '#e0bd98',
};

const HAIR_COLORS: Record<string, string> = {
  'appearance.palette.hair.black-01': '#26211f',
  'appearance.palette.hair.black-02': '#302a28',
  'appearance.palette.hair.dark-brown-01': '#44362f',
  'appearance.palette.hair.gray-01': '#77736d',
  'appearance.palette.hair.white-01': '#a8a39b',
};

const CLOTH_COLORS: Record<string, string> = {
  'appearance.palette.clothing.faded-earth-01': '#61564b',
  'appearance.palette.clothing.earth-01': '#6f5a47',
  'appearance.palette.clothing.indigo-01': '#4e5c68',
  'appearance.palette.clothing.gray-01': '#69716d',
  'appearance.palette.clothing.green-01': '#59685d',
  'appearance.palette.clothing.red-brown-01': '#76544c',
  'appearance.palette.clothing.blue-01': '#53697b',
  'appearance.palette.clothing.plum-01': '#665563',
  'appearance.palette.clothing.gold-brown-01': '#806c4f',
  'appearance.palette.clothing.cream-01': '#9a917d',
};

const FALLBACK_MALE_FACES = [
  'appearance.face.oval-01',
  'appearance.face.round-01',
  'appearance.face.long-01',
  'appearance.face.square-01',
];
const FALLBACK_FEMALE_FACES = [
  'appearance.face.oval-01',
  'appearance.face.round-01',
  'appearance.face.long-01',
  'appearance.face.oval-02',
];
const FALLBACK_MALE_HAIR = ['appearance.hair.short-01', 'appearance.hair.short-02', 'appearance.hair.tied-01', 'appearance.hair.tied-02'];
const FALLBACK_FEMALE_HAIR = ['appearance.hair.female-long-straight-01', 'appearance.hair.female-long-tied-01', 'appearance.hair.female-braid-01', 'appearance.hair.female-bun-01'];
const FALLBACK_BROWS = ['appearance.brow.straight-01', 'appearance.brow.straight-02', 'appearance.brow.soft-01', 'appearance.brow.angled-01'];
const FALLBACK_SKIN = Object.keys(SKIN_COLORS);
const FALLBACK_HAIR_COLORS = Object.keys(HAIR_COLORS);
const FALLBACK_CLOTH = ['appearance.palette.clothing.earth-01', 'appearance.palette.clothing.indigo-01', 'appearance.palette.clothing.gray-01'];

function pick<T>(items: T[], seed: number, divisor: number) {
  return items[Math.abs(Math.floor(seed / divisor)) % items.length];
}

function fallbackAppearance(seed: number, gender: Gender, lifeStage: LifeStageId, occupationId: string): ResidentAppearanceDNA {
  const isOlder = lifeStage === 'middle-age' || lifeStage === 'elder';
  const hairChoices = gender === 'female' ? FALLBACK_FEMALE_HAIR : FALLBACK_MALE_HAIR;
  const outfitId = gender === 'female' ? 'appearance.outfit.female-plain-01' : occupationId ? 'appearance.outfit.common-plain-01' : 'appearance.outfit.common-rough-01';
  return {
    faceId: pick(gender === 'female' ? FALLBACK_FEMALE_FACES : FALLBACK_MALE_FACES, seed, 1),
    hairId: pick(hairChoices, seed, 7),
    browId: pick(FALLBACK_BROWS, seed, 13),
    facialHairId: gender === 'male' && isOlder && seed % 4 === 0 ? 'appearance.facial-hair.mustache-01' : 'appearance.facial-hair.none',
    headwearId: 'appearance.headwear.none',
    outfitId,
    skinPaletteId: pick(FALLBACK_SKIN, seed, 17),
    hairPaletteId: lifeStage === 'elder'
      ? (seed % 2 ? 'appearance.palette.hair.gray-01' : 'appearance.palette.hair.white-01')
      : pick(FALLBACK_HAIR_COLORS.slice(0, 3), seed, 29),
    clothingPaletteId: pick(FALLBACK_CLOTH, seed, 43),
  };
}

function facePath(rig: PortraitRig, family: PortraitFaceFamily) {
  const cx = rig.centerX;
  const half = rig.faceWidth / 2;
  const jawHalf = rig.jawWidth / 2;
  const left = cx - half;
  const right = cx + half;
  const jawLeft = cx - jawHalf;
  const jawRight = cx + jawHalf;
  const templeY = rig.topY + (rig.chinY - rig.topY) * 0.42;
  const jawY = rig.mouthY + (rig.chinY - rig.mouthY) * 0.5;

  if (family === 'square') return `M${left + 4} ${rig.topY + 2} Q${cx} ${rig.topY - 4} ${right - 4} ${rig.topY + 2} L${right} ${templeY} L${jawRight + 2} ${jawY} Q${cx} ${rig.chinY + 4} ${jawLeft - 2} ${jawY} L${left} ${templeY}Z`;
  if (family === 'round') return `M${cx} ${rig.topY} C${left + 4} ${rig.topY} ${left} ${templeY - 7} ${left} ${templeY} C${left} ${rig.chinY - 11} ${jawLeft - 3} ${rig.chinY - 2} ${cx} ${rig.chinY} C${jawRight + 3} ${rig.chinY - 2} ${right} ${rig.chinY - 11} ${right} ${templeY} C${right} ${templeY - 7} ${right - 4} ${rig.topY} ${cx} ${rig.topY}Z`;
  if (family === 'broad') return `M${cx} ${rig.topY} C${left + 3} ${rig.topY} ${left} ${templeY - 5} ${left} ${templeY + 2} C${left + 1} ${rig.chinY - 12} ${jawLeft - 2} ${rig.chinY - 3} ${cx} ${rig.chinY} C${jawRight + 2} ${rig.chinY - 3} ${right - 1} ${rig.chinY - 12} ${right} ${templeY + 2} C${right} ${templeY - 5} ${right - 3} ${rig.topY} ${cx} ${rig.topY}Z`;
  return `M${cx} ${rig.topY} C${left + 5} ${rig.topY} ${left} ${templeY - 6} ${left} ${templeY} C${left + 1} ${rig.chinY - 12} ${jawLeft} ${rig.chinY - 4} ${cx} ${rig.chinY} C${jawRight} ${rig.chinY - 4} ${right - 1} ${rig.chinY - 12} ${right} ${templeY} C${right} ${templeY - 6} ${right - 5} ${rig.topY} ${cx} ${rig.topY}Z`;
}

function HairCap({ color, rig }: { color: string; rig: PortraitRig }) {
  const half = rig.faceWidth / 2 + 2;
  return <path d={`M${rig.centerX - half} ${rig.hairlineY + 13} Q${rig.centerX} ${rig.topY - 6} ${rig.centerX + half} ${rig.hairlineY + 13} L${rig.centerX + half - 2} ${rig.hairlineY + 19} Q${rig.centerX} ${rig.hairlineY + 8} ${rig.centerX - half + 2} ${rig.hairlineY + 19}Z`} fill={color} />;
}

function HairBack({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  const half = rig.faceWidth / 2 + 2;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  const cap = <HairCap color={color} rig={rig} />;

  if (id.includes('female-long-straight-01')) return <><path d={`M${left + 2} ${rig.hairlineY + 7} Q${left - 4} 65 ${left + 2} 108 L${left + 14} 111 Q${left + 9} 78 ${left + 12} ${rig.hairlineY + 18}Z`} fill={color}/><path d={`M${right - 2} ${rig.hairlineY + 7} Q${right + 4} 65 ${right - 2} 108 L${right - 14} 111 Q${right - 9} 78 ${right - 12} ${rig.hairlineY + 18}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-long-straight-02')) return <><path d={`M${left + 1} ${rig.hairlineY + 9} C${left - 7} 62 ${left - 2} 88 ${left + 3} 114 L${left + 16} 114 C${left + 10} 86 ${left + 11} 61 ${left + 13} ${rig.hairlineY + 18}Z`} fill={color}/><path d={`M${right - 1} ${rig.hairlineY + 9} C${right + 7} 62 ${right + 2} 88 ${right - 3} 114 L${right - 16} 114 C${right - 10} 86 ${right - 11} 61 ${right - 13} ${rig.hairlineY + 18}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-long-tied')) return <><path d={`M${rig.centerX + 7} ${rig.topY + 4} Q${right + 9} 63 ${right + 2} 106 Q${rig.centerX + 14} 99 ${rig.centerX + 10} 52Z`} fill={color}/><ellipse cx={rig.centerX + 13} cy={rig.topY + 1} rx="7" ry="5" fill={color}/>{cap}</>;
  if (id.includes('female-side-fall')) return <><path d={`M${right - 6} ${rig.hairlineY + 8} Q${right + 7} 67 ${right + 1} 110 L${right - 9} 112 Q${right - 4} 75 ${right - 14} ${rig.hairlineY + 18}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-double-braid')) return <><path d={`M${left + 6} ${rig.earY + 3} Q${left - 4} 74 ${left + 2} 108`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/><path d={`M${right - 6} ${rig.earY + 3} Q${right + 4} 74 ${right - 2} 108`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>{cap}</>;
  if (id.includes('female-braid')) return <><path d={`M${right - 5} ${rig.earY + 3} Q${right + 4} 73 ${right - 1} 109`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/><circle cx={right - 1} cy="109" r="4" fill={color}/>{cap}</>;
  if (id.includes('female-low-bun')) return <><circle cx={right - 1} cy={rig.earY + 10} r="9" fill={color}/>{cap}</>;
  if (id.includes('female-bun')) return <><circle cx={rig.centerX} cy={rig.topY - 4} r="9" fill={color}/>{cap}</>;
  if (id.includes('female-elder-tied')) return <><ellipse cx={rig.centerX + half * .5} cy={rig.topY + 2} rx="8" ry="6" fill={color}/>{cap}</>;
  if (id.includes('tied')) return <><circle cx={rig.centerX} cy={rig.topY - 3} r={id.includes('high') ? 7 : 5.5} fill={color}/>{cap}</>;
  return null;
}

function HairFront({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  const half = rig.faceWidth / 2 + 1.5;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  const top = rig.topY - 2;
  const line = rig.hairlineY;

  if (id.includes('female-long') || id.includes('female-side-fall') || id.includes('female-braid')) {
    return <g fill={color}><path d={`M${left} ${line + 1} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line + 1} Q${rig.centerX + 9} ${line - 4} ${rig.centerX + 4} ${line - 7} L${rig.centerX} ${line + 2} L${rig.centerX - 4} ${line - 7} Q${rig.centerX - 9} ${line - 4} ${left} ${line + 1}Z`} /><path d={`M${left + 2} ${line - 1} Q${left - 1} ${rig.eyeY + 7} ${left + 6} ${rig.mouthY + 4} Q${left + 10} ${rig.eyeY + 3} ${left + 10} ${line + 2}Z`} opacity=".95"/><path d={`M${right - 2} ${line - 1} Q${right + 1} ${rig.eyeY + 7} ${right - 6} ${rig.mouthY + 4} Q${right - 10} ${rig.eyeY + 3} ${right - 10} ${line + 2}Z`} opacity=".95"/></g>;
  }
  if (id.includes('cropped')) return <path d={`M${left + 2} ${line} Q${left + 4} ${top} ${rig.centerX} ${top} Q${right - 4} ${top} ${right - 2} ${line} Q${rig.centerX + 9} ${line - 6} ${rig.centerX} ${line - 5} Q${rig.centerX - 9} ${line - 6} ${left + 2} ${line}Z`} fill={color}/>;
  if (id.includes('short-02')) return <path d={`M${left} ${line + 1} Q${left + 1} ${top} ${rig.centerX} ${top} Q${right - 1} ${top} ${right} ${line} Q${rig.centerX + 8} ${line - 4} ${rig.centerX + 1} ${line - 8} Q${rig.centerX - 7} ${line - 2} ${left} ${line + 1}Z`} fill={color}/>;
  if (id.includes('short')) return <path d={`M${left} ${line} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line} Q${rig.centerX + 9} ${line - 6} ${rig.centerX} ${line - 6} Q${rig.centerX - 9} ${line - 6} ${left} ${line}Z`} fill={color}/>;
  return <path d={`M${left} ${line + 1} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line + 1} Q${rig.centerX + 9} ${line - 4} ${rig.centerX + 4} ${line - 7} L${rig.centerX} ${line + 1} L${rig.centerX - 4} ${line - 7} Q${rig.centerX - 9} ${line - 4} ${left} ${line + 1}Z`} fill={color}/>;
}

function Brows({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  const eyeOffset = rig.faceWidth * .22;
  const halfWidth = Math.max(3.6, rig.faceWidth * .1);
  const width = id.includes('thick') ? 2.6 : id.includes('soft') ? 1.5 : 2;
  const leftX = rig.centerX - eyeOffset;
  const rightX = rig.centerX + eyeOffset;
  const angle = id.includes('angled') ? 1.8 : 0;
  const bow = id.includes('soft') ? 2.2 : 1;
  return <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity=".86"><path d={`M${leftX - halfWidth} ${rig.browY + angle} Q${leftX} ${rig.browY - bow} ${leftX + halfWidth} ${rig.browY}`}/><path d={`M${rightX - halfWidth} ${rig.browY} Q${rightX} ${rig.browY - bow} ${rightX + halfWidth} ${rig.browY + angle}`}/></g>;
}

function FacialHair({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  if (id.endsWith('.none')) return null;
  const cx = rig.centerX;
  const mouth = rig.mouthY;
  const chin = rig.chinY;
  const half = Math.max(5, rig.jawWidth * .36);
  if (id.includes('mustache-02')) return <path d={`M${cx - half} ${mouth - 3} Q${cx - 4} ${mouth - 7} ${cx} ${mouth - 3} Q${cx + 4} ${mouth - 7} ${cx + half} ${mouth - 3} Q${cx + 5} ${mouth} ${cx} ${mouth - 1} Q${cx - 5} ${mouth} ${cx - half} ${mouth - 3}Z`} fill={color} opacity=".9"/>;
  if (id.includes('mustache')) return <path d={`M${cx - half * .82} ${mouth - 3} Q${cx - 3} ${mouth - 6} ${cx} ${mouth - 3} Q${cx + 3} ${mouth - 6} ${cx + half * .82} ${mouth - 3} Q${cx + 4} ${mouth - 1} ${cx} ${mouth - 1.5} Q${cx - 4} ${mouth - 1} ${cx - half * .82} ${mouth - 3}Z`} fill={color} opacity=".88"/>;
  if (id.includes('goatee')) return <path d={`M${cx - 4} ${mouth + 1} Q${cx} ${mouth + 5} ${cx + 4} ${mouth + 1} L${cx + 3} ${chin - 2} Q${cx} ${chin + 3} ${cx - 3} ${chin - 2}Z`} fill={color} opacity=".9"/>;
  if (id.includes('beard-02')) return <path d={`M${cx - half} ${mouth + 1} Q${cx} ${mouth + 9} ${cx + half} ${mouth + 1} L${cx + half * .72} ${chin + 6} Q${cx} ${chin + 12} ${cx - half * .72} ${chin + 6}Z`} fill={color} opacity=".9"/>;
  return <path d={`M${cx - half * .9} ${mouth + 1} Q${cx} ${mouth + 7} ${cx + half * .9} ${mouth + 1} L${cx + half * .62} ${chin - 1} Q${cx} ${chin + 5} ${cx - half * .62} ${chin - 1}Z`} fill={color} opacity=".88"/>;
}

function Headwear({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  if (id.endsWith('.none')) return null;
  const cx = rig.centerX;
  const half = rig.faceWidth / 2;
  const baseY = rig.topY + 7;
  if (id.includes('hairpin')) return <g><path d={`M${cx - 9} ${rig.topY - 1} L${cx + 11} ${rig.topY - 7}`} stroke="#b9a56f" strokeWidth="2" strokeLinecap="round"/><circle cx={cx + 12} cy={rig.topY - 7.5} r="2.5" fill="#c8b37b"/></g>;
  if (id.includes('sun-hat')) return <g><ellipse cx={cx} cy={baseY} rx={half + 10} ry="6.5" fill="#8a785e"/><path d={`M${cx - half * .8} ${baseY} Q${cx} ${rig.topY - 16} ${cx + half * .8} ${baseY}Z`} fill="#9a886a"/><path d={`M${cx - half * .65} ${baseY - 2} Q${cx} ${rig.topY - 10} ${cx + half * .65} ${baseY - 2}`} fill="none" stroke="#c0aa82" strokeWidth="1.5" opacity=".7"/></g>;
  if (id.includes('refined-cap')) return <g fill={color}><path d={`M${cx - half * .65} ${baseY + 1} Q${cx} ${rig.topY - 7} ${cx + half * .65} ${baseY + 1} L${cx + half * .48} ${rig.topY - 2} H${cx - half * .48}Z`}/><rect x={cx - half * .7} y={baseY - 1} width={half * 1.4} height="4" rx="2" opacity=".88"/></g>;
  if (id.includes('simple-cap')) return <g fill={color}><path d={`M${cx - half * .7} ${baseY + 2} Q${cx} ${rig.topY - 4} ${cx + half * .7} ${baseY + 2} L${cx + half * .52} ${rig.topY} H${cx - half * .52}Z`}/><rect x={cx - half * .76} y={baseY} width={half * 1.52} height="4" rx="2"/></g>;
  return <g><path d={`M${cx - half * .78} ${baseY + 1} Q${cx} ${rig.topY + 1} ${cx + half * .78} ${baseY + 1}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/><path d={`M${cx + half * .68} ${baseY} L${cx + half + 8} ${baseY + 7} L${cx + half * .65} ${baseY + 8}Z`} fill={color}/></g>;
}

function Outfit({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  const female = id.includes('female');
  const refined = id.includes('refined');
  const layered = id.includes('layered');
  const rough = id.includes('rough');
  const shoulderHalf = female ? 36 : rough ? 39 : 35;
  const topY = rig.shoulderY - 4;
  const collar = refined ? '#d9cfb3' : layered ? '#c7bea7' : '#b7ad97';
  return <g>
    <path d={`M${rig.centerX - shoulderHalf} 120 Q${rig.centerX - shoulderHalf + (female ? 1 : 3)} ${topY + (female ? 7 : 3)} ${rig.centerX - 12} ${topY} H${rig.centerX + 12} Q${rig.centerX + shoulderHalf - (female ? 1 : 3)} ${topY + (female ? 7 : 3)} ${rig.centerX + shoulderHalf} 120Z`} fill={color}/>
    {female && <path d={`M${rig.centerX - shoulderHalf + 2} 119 Q${rig.centerX - shoulderHalf - 2} 104 ${rig.centerX - 18} ${topY + 8}`} fill="none" stroke="#efe4ca" strokeWidth={refined ? 2 : 1.2} opacity=".2"/>}
    <path d={`M${rig.centerX - 11} ${topY} L${rig.centerX} ${topY + 14} L${rig.centerX + 11} ${topY}`} fill="none" stroke={collar} strokeWidth={refined ? 6 : 5} strokeLinejoin="round" opacity=".88"/>
    {layered && <path d={`M${rig.centerX - 17} ${topY + 10} Q${rig.centerX} ${topY + 22} ${rig.centerX + 17} ${topY + 10}`} fill="none" stroke={collar} strokeWidth="2" opacity=".55"/>}
    {refined && <path d={`M${rig.centerX - 21} ${topY + 24} H${rig.centerX + 21}`} stroke="#e6d8b5" strokeWidth="1.4" opacity=".35"/>}
    <path d={`M${rig.centerX} ${topY + 14} V118`} stroke="#2b2d2a" strokeWidth="1.2" opacity=".18"/>
  </g>;
}

function RigDebug({ rig }: { rig: PortraitRig }) {
  const half = rig.faceWidth / 2;
  const eyeOffset = rig.faceWidth * .22;
  const anchors = [[rig.centerX, rig.topY],[rig.centerX, rig.hairlineY],[rig.centerX - eyeOffset, rig.browY],[rig.centerX + eyeOffset, rig.browY],[rig.centerX, rig.mouthY],[rig.centerX, rig.chinY],[rig.centerX, rig.neckTopY],[rig.centerX, rig.shoulderY]];
  return <g className="portrait-rig-debug" pointerEvents="none"><rect x={rig.centerX - half} y={rig.topY} width={rig.faceWidth} height={rig.chinY - rig.topY} fill="none" stroke="#68d7d0" strokeWidth=".7" strokeDasharray="2 2" opacity=".72"/><line x1="16" x2="104" y1={rig.hairlineY} y2={rig.hairlineY} stroke="#d4bb75" strokeWidth=".55" strokeDasharray="3 2" opacity=".64"/><line x1="16" x2="104" y1={rig.shoulderY} y2={rig.shoulderY} stroke="#b37ee6" strokeWidth=".55" strokeDasharray="3 2" opacity=".64"/>{anchors.map(([x,y], index)=><circle key={`${x}-${y}-${index}`} cx={x} cy={y} r="1.5" fill="#f1df98" stroke="#17211e" strokeWidth=".5"/>)}</g>;
}

export function appearanceSignature(appearance: ResidentAppearanceDNA) {
  return [appearance.faceId, appearance.hairId, appearance.browId, appearance.facialHairId, appearance.headwearId, appearance.outfitId, appearance.skinPaletteId, appearance.hairPaletteId, appearance.clothingPaletteId].join('|');
}

export function ResidentAvatar({ seed = 1, gender, lifeStage, occupationId = '', appearance, catalog, label, debugRig = false, hiddenLayers = [] }: Props) {
  const dna = appearance ?? fallbackAppearance(seed, gender, lifeStage, occupationId);
  const rig = portraitRigForFace(catalog, dna.faceId);
  const faceFamily = faceFamilyForId(catalog, dna.faceId);
  const hairVisibility = hairVisibilityForHeadwear(catalog, dna.headwearId);
  const diagnostics = portraitDiagnostics(dna, catalog, gender, lifeStage);
  const hidden = new Set(hiddenLayers);
  const skin = SKIN_COLORS[dna.skinPaletteId] ?? '#c79d79';
  const hair = HAIR_COLORS[dna.hairPaletteId] ?? '#292320';
  const cloth = CLOTH_COLORS[dna.clothingPaletteId] ?? '#66706b';
  const isMiddle = lifeStage === 'middle-age';
  const isElder = lifeStage === 'elder';
  const isChild = lifeStage === 'child' || lifeStage === 'teen';
  const half = rig.faceWidth / 2;
  const eyeOffset = rig.faceWidth * .22;
  const eyeHalf = Math.max(3.1, rig.faceWidth * .085);
  const neckHalf = Math.max(5, rig.jawWidth * .23);
  const showHairBack = !hidden.has('hair') && hairVisibility !== 'hidden';
  const showHairFront = !hidden.has('hair') && hairVisibility === 'full';

  return <div className={`generated-portrait generated-portrait--svg gender-${gender} age-${lifeStage}`} data-appearance-signature={appearanceSignature(dna)} data-face-family={faceFamily} data-hair-visibility={hairVisibility} data-rig-state={diagnostics.errors.length ? 'error' : 'ok'} data-rig-errors={diagnostics.errors.length} data-rig-warnings={diagnostics.warnings.length} data-debug-rig={debugRig ? 'true' : 'false'} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    <svg viewBox="0 0 120 120" focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id={`portrait-bg-${Math.abs(seed)}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#39463f"/><stop offset="1" stopColor="#27342f"/></linearGradient></defs>
      <rect width="120" height="120" rx="22" fill={`url(#portrait-bg-${Math.abs(seed)})`}/><circle cx="60" cy="43" r="47" fill="#d7cba8" opacity=".06"/>
      {showHairBack && <HairBack id={dna.hairId} color={hair} rig={rig}/>} {!hidden.has('outfit') && <Outfit id={dna.outfitId} color={cloth} rig={rig}/>}<path d={`M${rig.centerX - neckHalf} ${rig.neckTopY} H${rig.centerX + neckHalf} L${rig.centerX + neckHalf + 1} ${rig.shoulderY + 7} Q${rig.centerX} ${rig.shoulderY + 11} ${rig.centerX - neckHalf - 1} ${rig.shoulderY + 7}Z`} fill={skin}/>
      <ellipse cx={rig.centerX - half - 1} cy={rig.earY} rx={isChild ? 3.7 : 4.4} ry="6.2" fill={skin}/><ellipse cx={rig.centerX + half + 1} cy={rig.earY} rx={isChild ? 3.7 : 4.4} ry="6.2" fill={skin}/><path d={facePath(rig, faceFamily)} fill={skin}/>
      <path d={`M${rig.centerX - eyeOffset - eyeHalf} ${rig.eyeY} Q${rig.centerX - eyeOffset} ${rig.eyeY - 2} ${rig.centerX - eyeOffset + eyeHalf} ${rig.eyeY}`} fill="none" stroke="#41332b" strokeWidth="1.7" strokeLinecap="round" opacity=".78"/><path d={`M${rig.centerX + eyeOffset - eyeHalf} ${rig.eyeY} Q${rig.centerX + eyeOffset} ${rig.eyeY - 2} ${rig.centerX + eyeOffset + eyeHalf} ${rig.eyeY}`} fill="none" stroke="#41332b" strokeWidth="1.7" strokeLinecap="round" opacity=".78"/>
      {!hidden.has('brow') && <Brows id={dna.browId} color={hair} rig={rig}/>}<path d={`M${rig.centerX} ${rig.eyeY} Q${rig.centerX - 3} ${rig.noseY} ${rig.centerX} ${rig.noseY + 1} Q${rig.centerX + 3} ${rig.noseY + 1} ${rig.centerX + 4} ${rig.noseY - 1}`} fill="none" stroke="#855f4a" strokeWidth="1.1" strokeLinecap="round" opacity=".48"/><path d={`M${rig.centerX - rig.jawWidth * .22} ${rig.mouthY} Q${rig.centerX} ${rig.mouthY + 3} ${rig.centerX + rig.jawWidth * .22} ${rig.mouthY}`} fill="none" stroke="#7d4f45" strokeWidth="1.5" strokeLinecap="round" opacity=".72"/>
      {(isMiddle || isElder) && <g fill="none" stroke="#735a49" strokeWidth=".8" opacity={isElder ? '.42' : '.24'}><path d={`M${rig.centerX - eyeOffset - 4} ${rig.eyeY + 4} Q${rig.centerX - eyeOffset} ${rig.eyeY + 6} ${rig.centerX - eyeOffset + 4} ${rig.eyeY + 5}`}/><path d={`M${rig.centerX + eyeOffset - 4} ${rig.eyeY + 5} Q${rig.centerX + eyeOffset} ${rig.eyeY + 6} ${rig.centerX + eyeOffset + 4} ${rig.eyeY + 4}`}/></g>}
      {isElder && <g fill="none" stroke="#735a49" strokeWidth=".75" opacity=".35"><path d={`M${rig.centerX - rig.jawWidth * .28} ${rig.mouthY + 4} Q${rig.centerX} ${rig.mouthY + 8} ${rig.centerX + rig.jawWidth * .28} ${rig.mouthY + 4}`}/><path d={`M${rig.centerX - half * .75} ${rig.noseY + 2} Q${rig.centerX - half * .64} ${rig.mouthY} ${rig.centerX - half * .52} ${rig.mouthY + 2}`}/><path d={`M${rig.centerX + half * .75} ${rig.noseY + 2} Q${rig.centerX + half * .64} ${rig.mouthY} ${rig.centerX + half * .52} ${rig.mouthY + 2}`}/></g>}
      {showHairFront && <HairFront id={dna.hairId} color={hair} rig={rig}/>} {!hidden.has('facial-hair') && <FacialHair id={dna.facialHairId} color={hair} rig={rig}/>} {!hidden.has('headwear') && <Headwear id={dna.headwearId} color={cloth} rig={rig}/>} {debugRig && <RigDebug rig={rig}/>} 
    </svg>
  </div>;
}
