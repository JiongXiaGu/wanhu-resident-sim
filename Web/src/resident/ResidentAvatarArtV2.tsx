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
  silhouetteTypeForId,
  PORTRAIT_MASTER,
  type PortraitFaceFamily,
  type PortraitLayer,
  type PortraitRig,
} from './portrait-rig';
import { faceArtFamily, faceArtProfile, type PortraitFaceArtProfile } from './portrait-art-v2';

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
  masterPreview?: boolean;
};

const SKIN_COLORS: Record<string, string> = {
  'appearance.palette.skin.light-01': '#dfb894',
  'appearance.palette.skin.warm-01': '#c99975',
  'appearance.palette.skin.warm-02': '#b98262',
  'appearance.palette.skin.deep-01': '#936449',
};

const HAIR_COLORS: Record<string, string> = {
  'appearance.palette.hair.black-01': '#24201e',
  'appearance.palette.hair.black-02': '#302927',
  'appearance.palette.hair.dark-brown-01': '#43352f',
  'appearance.palette.hair.brown-black-01': '#342c29',
  'appearance.palette.hair.gray-black-01': '#55514d',
  'appearance.palette.hair.gray-01': '#77726b',
  'appearance.palette.hair.salt-pepper-01': '#817b72',
  'appearance.palette.hair.white-01': '#aaa49a',
  'appearance.palette.hair.silver-01': '#b9b5ad',
};

const CLOTH_COLORS: Record<string, string> = {
  'appearance.palette.clothing.faded-earth-01': '#65594d',
  'appearance.palette.clothing.earth-01': '#735d48',
  'appearance.palette.clothing.gray-01': '#6d736f',
  'appearance.palette.clothing.indigo-01': '#4c5c6b',
  'appearance.palette.clothing.green-01': '#58675b',
  'appearance.palette.clothing.blue-01': '#556a78',
  'appearance.palette.clothing.red-brown-01': '#78554d',
  'appearance.palette.clothing.plum-01': '#665760',
  'appearance.palette.clothing.gold-brown-01': '#7c694e',
  'appearance.palette.clothing.cream-01': '#9b917c',
  'appearance.palette.clothing.hemp-white-01': '#a79e88',
  'appearance.palette.clothing.earth-yellow-01': '#847153',
  'appearance.palette.clothing.gray-brown-01': '#6b6259',
  'appearance.palette.clothing.deep-brown-01': '#56483f',
  'appearance.palette.clothing.blue-gray-01': '#607078',
  'appearance.palette.clothing.ink-green-01': '#465b50',
  'appearance.palette.clothing.lotus-gray-01': '#756b6c',
  'appearance.palette.clothing.dark-red-01': '#714c48',
};

const FALLBACK_MALE_FACES = [
  'appearance.face.male-oval-01',
  'appearance.face.male-round-01',
  'appearance.face.male-long-01',
  'appearance.face.male-square-01',
];
const FALLBACK_FEMALE_FACES = [
  'appearance.face.female-youth-01',
  'appearance.face.female-oval-01',
  'appearance.face.female-adult-01',
  'appearance.face.female-mature-01',
];
const FALLBACK_MALE_HAIR = [
  'appearance.hair.male-short-01',
  'appearance.hair.male-short-02',
  'appearance.hair.male-tied-01',
  'appearance.hair.male-tied-02',
];
const FALLBACK_FEMALE_HAIR = [
  'appearance.hair.female-long-straight-01',
  'appearance.hair.female-long-tied-01',
  'appearance.hair.female-braid-01',
  'appearance.hair.female-low-bun-01',
];
const FALLBACK_BROWS = [
  'appearance.brow.straight-01',
  'appearance.brow.straight-02',
  'appearance.brow.soft-01',
  'appearance.brow.angled-01',
];
const FALLBACK_SKIN = Object.keys(SKIN_COLORS);
const FALLBACK_HAIR_COLORS = [
  'appearance.palette.hair.black-01',
  'appearance.palette.hair.black-02',
  'appearance.palette.hair.dark-brown-01',
  'appearance.palette.hair.brown-black-01',
];
const FALLBACK_CLOTH = [
  'appearance.palette.clothing.earth-01',
  'appearance.palette.clothing.indigo-01',
  'appearance.palette.clothing.gray-01',
];

function pick<T>(items: T[], seed: number, divisor: number) {
  return items[Math.abs(Math.floor(seed / divisor)) % items.length];
}

function fallbackAppearance(seed: number, gender: Gender, lifeStage: LifeStageId, occupationId: string): ResidentAppearanceDNA {
  const older = lifeStage === 'middle-age' || lifeStage === 'elder';
  return {
    faceId: pick(gender === 'female' ? FALLBACK_FEMALE_FACES : FALLBACK_MALE_FACES, seed, 1),
    hairId: pick(gender === 'female' ? FALLBACK_FEMALE_HAIR : FALLBACK_MALE_HAIR, seed, 7),
    browId: pick(FALLBACK_BROWS, seed, 13),
    facialHairId: gender === 'male' && older && seed % 4 === 0
      ? 'appearance.facial-hair.mustache-01'
      : 'appearance.facial-hair.none',
    headwearId: 'appearance.headwear.none',
    outfitId: gender === 'female'
      ? 'appearance.outfit.female-plain-01'
      : occupationId
        ? 'appearance.outfit.common-plain-01'
        : 'appearance.outfit.common-rough-01',
    skinPaletteId: pick(FALLBACK_SKIN, seed, 17),
    hairPaletteId: lifeStage === 'elder'
      ? (seed % 2 ? 'appearance.palette.hair.salt-pepper-01' : 'appearance.palette.hair.silver-01')
      : pick(FALLBACK_HAIR_COLORS, seed, 29),
    clothingPaletteId: pick(FALLBACK_CLOTH, seed, 43),
  };
}

function faceGeometry(rig: PortraitRig, profile: PortraitFaceArtProfile) {
  const cx = rig.centerX;
  const half = rig.faceWidth * profile.faceScale / 2;
  const jawHalf = rig.jawWidth * profile.jawScale / 2;
  const left = cx - half;
  const right = cx + half;
  const topY = rig.topY;
  const chinY = rig.chinY + profile.chinDepth;
  const templeY = topY + (chinY - topY) * .39;
  const cheekY = rig.eyeY + (rig.mouthY - rig.eyeY) * .47;
  const cheekHalf = Math.max(jawHalf + 2.5, half - profile.templeInset + profile.cheekPush);
  const jawY = rig.mouthY + (chinY - rig.mouthY) * .52;
  return { cx, half, jawHalf, left, right, topY, chinY, templeY, cheekY, cheekHalf, jawY };
}

function facePath(rig: PortraitRig, family: PortraitFaceFamily, profile: PortraitFaceArtProfile) {
  const g = faceGeometry(rig, profile);
  const squareBias = family === 'square' ? 1.9 : family === 'broad' ? 1.1 : 0;
  const roundBias = family === 'round' ? 2 : 0;
  const topRound = family === 'square' ? 3 : 5.5;
  const leftCheek = g.cx - g.cheekHalf;
  const rightCheek = g.cx + g.cheekHalf;
  const leftJaw = g.cx - g.jawHalf - squareBias;
  const rightJaw = g.cx + g.jawHalf + squareBias;
  return [
    `M${g.cx} ${g.topY}`,
    `C${g.left + topRound} ${g.topY - 1.8} ${g.left} ${g.templeY - 8} ${g.left + profile.templeInset} ${g.templeY}`,
    `C${leftCheek} ${g.cheekY - 3} ${leftCheek + roundBias * .2} ${g.cheekY + 5} ${leftJaw} ${g.jawY}`,
    `Q${g.cx - g.jawHalf * .45} ${g.chinY + (family === 'long' ? 1.8 : .7)} ${g.cx} ${g.chinY}`,
    `Q${g.cx + g.jawHalf * .45} ${g.chinY + (family === 'long' ? 1.8 : .7)} ${rightJaw} ${g.jawY}`,
    `C${rightCheek - roundBias * .2} ${g.cheekY + 5} ${rightCheek} ${g.cheekY - 3} ${g.right - profile.templeInset} ${g.templeY}`,
    `C${g.right} ${g.templeY - 8} ${g.right - topRound} ${g.topY - 1.8} ${g.cx} ${g.topY}Z`,
  ].join(' ');
}

function HairCap({ color, rig, gender }: { color: string; rig: PortraitRig; gender: Gender }) {
  const half = rig.faceWidth / 2 + 2.2;
  if (gender === 'female') {
    return <path d={`M${rig.centerX - half} ${rig.hairlineY + 11} Q${rig.centerX - 9} ${rig.topY - 4} ${rig.centerX} ${rig.topY - 3} Q${rig.centerX + 9} ${rig.topY - 4} ${rig.centerX + half} ${rig.hairlineY + 11} Q${rig.centerX + 9} ${rig.hairlineY + 1} ${rig.centerX + 3} ${rig.hairlineY - 6} L${rig.centerX} ${rig.hairlineY + 2} L${rig.centerX - 3} ${rig.hairlineY - 6} Q${rig.centerX - 9} ${rig.hairlineY + 1} ${rig.centerX - half} ${rig.hairlineY + 11}Z`} fill={color}/>;
  }
  return <path d={`M${rig.centerX - half} ${rig.hairlineY + 10} Q${rig.centerX - 9} ${rig.topY - 5} ${rig.centerX} ${rig.topY - 4} Q${rig.centerX + 10} ${rig.topY - 5} ${rig.centerX + half} ${rig.hairlineY + 10} Q${rig.centerX + 10} ${rig.hairlineY + 1} ${rig.centerX + 1} ${rig.hairlineY - 5} Q${rig.centerX - 10} ${rig.hairlineY} ${rig.centerX - half} ${rig.hairlineY + 10}Z`} fill={color}/>;
}

function HairBack({ id, color, rig, gender }: { id: string; color: string; rig: PortraitRig; gender: Gender }) {
  const half = rig.faceWidth / 2 + 2.2;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  const cap = <HairCap color={color} rig={rig} gender={gender}/>;
  if (id.includes('female-long-straight-01')) return <><path d={`M${left + 1} ${rig.hairlineY + 7} C${left - 5} 70 ${left - 5} 113 ${left + 1} 144 L${left + 15} 144 C${left + 8} 111 ${left + 11} 76 ${left + 12} ${rig.hairlineY + 18}Z`} fill={color}/><path d={`M${right - 1} ${rig.hairlineY + 7} C${right + 5} 70 ${right + 5} 113 ${right - 1} 144 L${right - 15} 144 C${right - 8} 111 ${right - 11} 76 ${right - 12} ${rig.hairlineY + 18}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-long-straight-02')) return <><path d={`M${left + 2} ${rig.hairlineY + 7} C${left - 9} 71 ${left - 2} 111 ${left + 4} 145 L${left + 18} 141 C${left + 9} 103 ${left + 12} 69 ${left + 13} ${rig.hairlineY + 18}Z`} fill={color}/><path d={`M${right - 2} ${rig.hairlineY + 7} C${right + 9} 71 ${right + 2} 111 ${right - 4} 145 L${right - 18} 141 C${right - 9} 103 ${right - 12} 69 ${right - 13} ${rig.hairlineY + 18}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-long-tied')) return <><path d={`M${rig.centerX + 5} ${rig.topY + 3} C${right + 13} 70 ${right + 8} 112 ${right + 1} 143 Q${rig.centerX + 12} 128 ${rig.centerX + 10} 57Z`} fill={color}/><ellipse cx={rig.centerX + 12} cy={rig.topY - 1} rx="7.5" ry="5.2" fill={color}/>{cap}</>;
  if (id.includes('female-side-fall')) return <><path d={`M${right - 7} ${rig.hairlineY + 7} C${right + 11} 75 ${right + 7} 112 ${right + 1} 145 L${right - 12} 145 C${right - 4} 99 ${right - 5} 70 ${right - 14} ${rig.hairlineY + 17}Z`} fill={color}/>{cap}</>;
  if (id.includes('female-double-braid')) return <><path d={`M${left + 6} ${rig.earY + 3} C${left - 8} 86 ${left - 3} 116 ${left + 1} 141`} fill="none" stroke={color} strokeWidth="7.2" strokeLinecap="round"/><path d={`M${right - 6} ${rig.earY + 3} C${right + 8} 86 ${right + 3} 116 ${right - 1} 141`} fill="none" stroke={color} strokeWidth="7.2" strokeLinecap="round"/><circle cx={left + 1} cy="141" r="3.5" fill={color}/><circle cx={right - 1} cy="141" r="3.5" fill={color}/>{cap}</>;
  if (id.includes('female-braid')) return <><path d={`M${right - 5} ${rig.earY + 3} C${right + 9} 88 ${right + 3} 119 ${right - 1} 142`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/><circle cx={right - 1} cy="142" r="3.8" fill={color}/>{cap}</>;
  if (id.includes('female-married-bun')) return <><ellipse cx={rig.centerX + 6} cy={rig.topY - 4} rx="13.2" ry="7.4" fill={color}/><ellipse cx={rig.centerX - 7} cy={rig.topY + 1} rx="8.5" ry="6.3" fill={color}/>{cap}</>;
  if (id.includes('female-low-bun')) return <><ellipse cx={right - 1} cy={rig.earY + 10} rx="9" ry="8" fill={color}/>{cap}</>;
  if (id.includes('female-bun')) return <><ellipse cx={rig.centerX} cy={rig.topY - 5} rx="9.5" ry="8.5" fill={color}/>{cap}</>;
  if (id.includes('female-elder-tied')) return <><ellipse cx={rig.centerX + half * .52} cy={rig.topY + 2} rx="8.2" ry="6" fill={color}/>{cap}</>;
  if (id.includes('male-thinning')) return <ellipse cx={rig.centerX + 7} cy={rig.topY + 5} rx="11" ry="4.6" fill={color} opacity=".8"/>;
  if (id.includes('tied')) return <><ellipse cx={rig.centerX} cy={rig.topY - 3.5} rx={id.includes('high') ? 7.2 : 5.7} ry={id.includes('high') ? 6.1 : 5} fill={color}/>{cap}</>;
  return null;
}

function FemaleTempleLocks({ color, rig, leftLong = false, rightLong = false }: { color: string; rig: PortraitRig; leftLong?: boolean; rightLong?: boolean }) {
  const half = rig.faceWidth / 2 + 1.6;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  return <g fill={color} opacity=".96">
    <path d={`M${left + 2} ${rig.hairlineY - 1} Q${left - 1} ${rig.eyeY + 5} ${left + 6} ${leftLong ? rig.mouthY + 5 : rig.noseY + 3} Q${left + 10} ${rig.eyeY + 2} ${left + 10} ${rig.hairlineY + 2}Z`}/>
    <path d={`M${right - 2} ${rig.hairlineY - 1} Q${right + 1} ${rig.eyeY + 5} ${right - 6} ${rightLong ? rig.mouthY + 5 : rig.noseY + 3} Q${right - 10} ${rig.eyeY + 2} ${right - 10} ${rig.hairlineY + 2}Z`}/>
  </g>;
}

function HairFront({ id, color, rig, gender }: { id: string; color: string; rig: PortraitRig; gender: Gender }) {
  const half = rig.faceWidth / 2 + 1.6;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  const top = rig.topY - 2;
  const line = rig.hairlineY;
  if (id.includes('male-thinning')) return <path d={`M${left + 4} ${line + 2} Q${left + 9} ${top + 4} ${rig.centerX - 6} ${top + 3} M${right - 4} ${line + 1} Q${right - 8} ${top + 5} ${rig.centerX + 8} ${top + 3}`} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round"/>;
  if (id.includes('female-married-bun')) return <g fill={color}><path d={`M${left} ${line + 1} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line + 1} Q${rig.centerX + 8} ${line - 4} ${rig.centerX} ${line - 7} Q${rig.centerX - 8} ${line - 4} ${left} ${line + 1}Z`}/><path d={`M${left + 3} ${line} Q${left} ${rig.eyeY + 4} ${left + 7} ${rig.noseY + 3} Q${left + 11} ${rig.eyeY + 2} ${left + 11} ${line + 2}Z`}/></g>;
  if (id.includes('female-long-straight-01')) return <g><path d={`M${left} ${line + 1} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line + 1} Q${rig.centerX + 9} ${line - 4} ${rig.centerX + 4} ${line - 7} L${rig.centerX} ${line + 2} L${rig.centerX - 4} ${line - 7} Q${rig.centerX - 9} ${line - 4} ${left} ${line + 1}Z`} fill={color}/><FemaleTempleLocks color={color} rig={rig} leftLong rightLong/></g>;
  if (id.includes('female-long-straight-02')) return <g><path d={`M${left} ${line + 2} Q${left + 6} ${top - 1} ${rig.centerX - 5} ${top - 1} Q${rig.centerX + 7} ${top - 3} ${right} ${line + 1} Q${rig.centerX + 2} ${line - 6} ${rig.centerX - 6} ${line - 5} Q${rig.centerX - 13} ${line - 1} ${left} ${line + 2}Z`} fill={color}/><path d={`M${right - 2} ${line - 1} Q${right + 1} ${rig.eyeY + 7} ${right - 7} ${rig.mouthY + 7} Q${right - 11} ${rig.eyeY + 3} ${right - 10} ${line + 1}Z`} fill={color}/></g>;
  if (id.includes('female-long-tied')) return <g><path d={`M${left} ${line + 1} Q${rig.centerX - 13} ${top - 2} ${rig.centerX + 4} ${top - 2} Q${right - 6} ${top} ${right} ${line + 2} Q${rig.centerX + 8} ${line - 1} ${rig.centerX + 3} ${line - 5} Q${rig.centerX - 10} ${line - 4} ${left} ${line + 1}Z`} fill={color}/><path d={`M${left + 4} ${line + 1} Q${left + 2} ${rig.eyeY + 3} ${left + 8} ${rig.noseY + 1}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/></g>;
  if (id.includes('female-side-fall')) return <g><path d={`M${left} ${line + 1} Q${rig.centerX - 14} ${top - 2} ${rig.centerX - 3} ${top - 2} Q${rig.centerX + 9} ${top - 3} ${right} ${line + 2} Q${rig.centerX + 3} ${line - 5} ${rig.centerX - 5} ${line - 4} Q${rig.centerX - 12} ${line - 1} ${left} ${line + 1}Z`} fill={color}/><path d={`M${right - 1} ${line - 1} Q${right + 3} ${rig.eyeY + 8} ${right - 7} ${rig.mouthY + 8} Q${right - 12} ${rig.eyeY + 4} ${right - 10} ${line + 1}Z`} fill={color}/></g>;
  if (id.includes('female-double-braid')) return <g><path d={`M${left} ${line + 1} Q${left + 4} ${top} ${rig.centerX} ${top - 1} Q${right - 4} ${top} ${right} ${line + 1} Q${rig.centerX + 7} ${line - 3} ${rig.centerX} ${line - 6} Q${rig.centerX - 7} ${line - 3} ${left} ${line + 1}Z`} fill={color}/><FemaleTempleLocks color={color} rig={rig}/></g>;
  if (id.includes('female-braid')) return <g><path d={`M${left} ${line + 1} Q${rig.centerX - 12} ${top - 1} ${rig.centerX + 2} ${top - 2} Q${right - 5} ${top} ${right} ${line + 1} Q${rig.centerX + 4} ${line - 6} ${rig.centerX - 4} ${line - 4} Q${rig.centerX - 11} ${line} ${left} ${line + 1}Z`} fill={color}/><path d={`M${right - 2} ${line} Q${right + 1} ${rig.eyeY + 5} ${right - 7} ${rig.noseY + 4} Q${right - 10} ${rig.eyeY + 2} ${right - 9} ${line + 1}Z`} fill={color}/></g>;
  if (id.includes('female-low-bun')) return <path d={`M${left} ${line + 1} Q${rig.centerX - 15} ${top - 1} ${rig.centerX + 2} ${top - 2} Q${right - 7} ${top - 1} ${right} ${line + 1} Q${rig.centerX + 5} ${line - 5} ${rig.centerX - 4} ${line - 5} Q${rig.centerX - 11} ${line} ${left} ${line + 1}Z`} fill={color}/>;
  if (id.includes('female-bun')) return <path d={`M${left} ${line + 1} Q${left + 3} ${top - 1} ${rig.centerX} ${top - 2} Q${right - 3} ${top - 1} ${right} ${line + 1} Q${rig.centerX + 9} ${line - 5} ${rig.centerX} ${line - 7} Q${rig.centerX - 9} ${line - 5} ${left} ${line + 1}Z`} fill={color}/>;
  if (id.includes('female-elder-tied')) return <path d={`M${left} ${line + 1} Q${left + 5} ${top} ${rig.centerX + 1} ${top - 1} Q${right - 4} ${top + 1} ${right} ${line + 2} Q${rig.centerX + 8} ${line - 2} ${rig.centerX - 1} ${line - 5} Q${rig.centerX - 8} ${line - 2} ${left} ${line + 1}Z`} fill={color}/>;
  if (id.includes('cropped')) return <path d={`M${left + 2} ${line} Q${left + 4} ${top + 1} ${rig.centerX} ${top} Q${right - 4} ${top + 1} ${right - 2} ${line} Q${rig.centerX + 10} ${line - 6} ${rig.centerX + 1} ${line - 5} Q${rig.centerX - 9} ${line - 6} ${left + 2} ${line}Z`} fill={color}/>;
  if (id.includes('short-02')) return <path d={`M${left} ${line + 1} Q${left + 1} ${top} ${rig.centerX} ${top} Q${right - 1} ${top} ${right} ${line} Q${rig.centerX + 8} ${line - 4} ${rig.centerX + 1} ${line - 8} Q${rig.centerX - 7} ${line - 2} ${left} ${line + 1}Z`} fill={color}/>;
  if (gender === 'female') return <HairCap color={color} rig={rig} gender={gender}/>;
  return <path d={`M${left} ${line} Q${left + 2} ${top} ${rig.centerX} ${top} Q${right - 2} ${top} ${right} ${line} Q${rig.centerX + 9} ${line - 6} ${rig.centerX} ${line - 6} Q${rig.centerX - 9} ${line - 6} ${left} ${line}Z`} fill={color}/>;
}

function Brows({ id, color, rig, profile, gender }: { id: string; color: string; rig: PortraitRig; profile: PortraitFaceArtProfile; gender: Gender }) {
  const eyeOffset = rig.faceWidth * profile.eyeSpacing;
  const halfWidth = Math.max(3.3, rig.faceWidth * (gender === 'female' ? .108 : .1));
  const styleScale = id.includes('thick') ? 1.22 : id.includes('soft') ? .86 : 1;
  const width = profile.browThickness * styleScale;
  const leftX = rig.centerX - eyeOffset;
  const rightX = rig.centerX + eyeOffset;
  const angle = id.includes('angled') ? 1.7 : 0;
  const bow = id.includes('soft') || gender === 'female' ? 2.05 : .75;
  const y = rig.browY - profile.browLift;
  return <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity=".84"><path d={`M${leftX - halfWidth} ${y + angle} Q${leftX} ${y - bow} ${leftX + halfWidth} ${y}`}/><path d={`M${rightX - halfWidth} ${y} Q${rightX} ${y - bow} ${rightX + halfWidth} ${y + angle}`}/></g>;
}

function FemaleFaceDetails({ rig, profile }: { rig: PortraitRig; profile: PortraitFaceArtProfile }) {
  const eyeOffset = rig.faceWidth * profile.eyeSpacing;
  const eyeHalf = Math.max(3.5, rig.faceWidth * profile.eyeWidth);
  const leftX = rig.centerX - eyeOffset;
  const rightX = rig.centerX + eyeOffset;
  const eyeY = rig.eyeY;
  const upper = 1.5 * profile.eyeCurve;
  const lower = .85 + profile.eyeCurve * .15;
  const noseEnd = Math.min(rig.mouthY - 4.5, rig.eyeY + (rig.noseY - rig.eyeY) * profile.noseLength);
  const mouthHalf = Math.max(4.6, rig.jawWidth * profile.mouthWidth);
  const ink = '#44352f';
  return <g>
    <g fill="none" stroke={ink} strokeLinecap="round">
      <path d={`M${leftX - eyeHalf} ${eyeY + profile.eyeTilt} Q${leftX} ${eyeY - upper} ${leftX + eyeHalf} ${eyeY - profile.eyeTilt * .2}`} strokeWidth="1.38" opacity=".9"/>
      <path d={`M${leftX - eyeHalf + 1} ${eyeY + .9} Q${leftX} ${eyeY + lower} ${leftX + eyeHalf - 1} ${eyeY + .8}`} strokeWidth=".62" opacity=".3"/>
      <path d={`M${rightX - eyeHalf} ${eyeY - profile.eyeTilt * .2} Q${rightX} ${eyeY - upper} ${rightX + eyeHalf} ${eyeY + profile.eyeTilt}`} strokeWidth="1.38" opacity=".9"/>
      <path d={`M${rightX - eyeHalf + 1} ${eyeY + .8} Q${rightX} ${eyeY + lower} ${rightX + eyeHalf - 1} ${eyeY + .9}`} strokeWidth=".62" opacity=".3"/>
    </g>
    <ellipse cx={leftX} cy={eyeY - .08} rx=".78" ry="1.05" fill={ink} opacity=".84"/>
    <ellipse cx={rightX} cy={eyeY - .08} rx=".78" ry="1.05" fill={ink} opacity=".84"/>
    <path d={`M${rig.centerX - .45} ${rig.eyeY + 3} Q${rig.centerX - 1.5} ${(rig.eyeY + noseEnd) / 2} ${rig.centerX - .15} ${noseEnd} Q${rig.centerX + 1.2 * profile.noseWidth} ${noseEnd + .7} ${rig.centerX + 2.4 * profile.noseWidth} ${noseEnd - .15}`} fill="none" stroke="#835f4b" strokeWidth=".9" strokeLinecap="round" opacity=".42"/>
    <path d={`M${rig.centerX - mouthHalf} ${rig.mouthY} Q${rig.centerX} ${rig.mouthY + 2.1 * profile.mouthCurve} ${rig.centerX + mouthHalf} ${rig.mouthY}`} fill="none" stroke="#7b5048" strokeWidth="1.25" strokeLinecap="round" opacity=".78"/>
    <path d={`M${rig.centerX - mouthHalf * .38} ${rig.mouthY + 2.35} Q${rig.centerX} ${rig.mouthY + 3} ${rig.centerX + mouthHalf * .38} ${rig.mouthY + 2.35}`} fill="none" stroke="#8b5d52" strokeWidth=".6" strokeLinecap="round" opacity=".32"/>
    {profile.cheekAccent > 0 && <g fill="none" stroke="#a86f5d" strokeWidth=".68" opacity={profile.cheekAccent}><path d={`M${leftX - 4} ${rig.noseY + 3} Q${leftX} ${rig.noseY + 4.1} ${leftX + 3} ${rig.noseY + 3}`}/><path d={`M${rightX - 3} ${rig.noseY + 3} Q${rightX} ${rig.noseY + 4.1} ${rightX + 4} ${rig.noseY + 3}`}/></g>}
  </g>;
}

function MaleFaceDetails({ rig, profile, family }: { rig: PortraitRig; profile: PortraitFaceArtProfile; family: PortraitFaceFamily }) {
  const eyeOffset = rig.faceWidth * profile.eyeSpacing;
  const eyeHalf = Math.max(3.1, rig.faceWidth * profile.eyeWidth);
  const leftX = rig.centerX - eyeOffset;
  const rightX = rig.centerX + eyeOffset;
  const eyeY = rig.eyeY;
  const upper = 1.05 * profile.eyeCurve;
  const noseEnd = Math.min(rig.mouthY - 3.4, rig.eyeY + (rig.noseY - rig.eyeY) * profile.noseLength);
  const mouthHalf = Math.max(5, rig.jawWidth * profile.mouthWidth);
  const ink = '#3c312d';
  return <g>
    <g fill="none" stroke={ink} strokeLinecap="round" strokeWidth="1.65" opacity=".88">
      <path d={`M${leftX - eyeHalf} ${eyeY + profile.eyeTilt} Q${leftX} ${eyeY - upper} ${leftX + eyeHalf} ${eyeY}`}/>
      <path d={`M${rightX - eyeHalf} ${eyeY} Q${rightX} ${eyeY - upper} ${rightX + eyeHalf} ${eyeY + profile.eyeTilt}`}/>
    </g>
    <circle cx={leftX} cy={eyeY} r=".72" fill={ink} opacity=".8"/>
    <circle cx={rightX} cy={eyeY} r=".72" fill={ink} opacity=".8"/>
    <path d={`M${rig.centerX - .9} ${rig.eyeY + 1.7} Q${rig.centerX - 2.2} ${(rig.eyeY + noseEnd) / 2} ${rig.centerX - .45} ${noseEnd} Q${rig.centerX + 1.8 * profile.noseWidth} ${noseEnd + 1.15} ${rig.centerX + 3.15 * profile.noseWidth} ${noseEnd - .6}`} fill="none" stroke="#7c5948" strokeWidth="1.18" strokeLinecap="round" opacity=".57"/>
    <path d={`M${rig.centerX - mouthHalf} ${rig.mouthY} Q${rig.centerX} ${rig.mouthY + 1.8 * profile.mouthCurve} ${rig.centerX + mouthHalf} ${rig.mouthY}`} fill="none" stroke="#704b43" strokeWidth="1.45" strokeLinecap="round" opacity=".74"/>
    {(family === 'square' || family === 'broad') && <g fill="none" stroke="#795846" strokeWidth=".72" opacity=".16"><path d={`M${rig.centerX - rig.jawWidth * .42} ${rig.noseY + 4} Q${rig.centerX - rig.jawWidth * .39} ${rig.mouthY + 4} ${rig.centerX - rig.jawWidth * .3} ${rig.chinY - 3}`}/><path d={`M${rig.centerX + rig.jawWidth * .42} ${rig.noseY + 4} Q${rig.centerX + rig.jawWidth * .39} ${rig.mouthY + 4} ${rig.centerX + rig.jawWidth * .3} ${rig.chinY - 3}`}/></g>}
  </g>;
}

function FaceDetails({ gender, rig, profile, family }: { gender: Gender; rig: PortraitRig; profile: PortraitFaceArtProfile; family: PortraitFaceFamily }) {
  return gender === 'female'
    ? <FemaleFaceDetails rig={rig} profile={profile}/>
    : <MaleFaceDetails rig={rig} profile={profile} family={family}/>;
}

function FacialHair({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  if (id.endsWith('.none')) return null;
  const cx = rig.centerX;
  const mouth = rig.mouthY;
  const chin = rig.chinY;
  const half = Math.max(5, rig.jawWidth * .36);
  if (id.includes('stubble')) return <g fill={color} opacity=".42">{[-8, -4, 0, 4, 8].map((x) => <circle key={x} cx={cx + x} cy={mouth + 5 + Math.abs(x) * .16} r=".75"/>)}</g>;
  if (id.includes('elder-sparse')) return <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity=".72"><path d={`M${cx - half * .8} ${mouth - 2} Q${cx - 4} ${mouth - 5} ${cx - 1} ${mouth - 2}`}/><path d={`M${cx + 1} ${mouth - 2} Q${cx + 4} ${mouth - 5} ${cx + half * .8} ${mouth - 2}`}/><path d={`M${cx - 3} ${mouth + 3} Q${cx} ${chin + 6} ${cx + 3} ${mouth + 3}`}/></g>;
  if (id.includes('mustache-02')) return <path d={`M${cx - half} ${mouth - 3} Q${cx - 4} ${mouth - 7} ${cx} ${mouth - 3} Q${cx + 4} ${mouth - 7} ${cx + half} ${mouth - 3} Q${cx + 5} ${mouth} ${cx} ${mouth - 1} Q${cx - 5} ${mouth} ${cx - half} ${mouth - 3}Z`} fill={color} opacity=".9"/>;
  if (id.includes('mustache')) return <path d={`M${cx - half * .82} ${mouth - 3} Q${cx - 3} ${mouth - 6} ${cx} ${mouth - 3} Q${cx + 3} ${mouth - 6} ${cx + half * .82} ${mouth - 3} Q${cx + 4} ${mouth - 1} ${cx} ${mouth - 1.5} Q${cx - 4} ${mouth - 1} ${cx - half * .82} ${mouth - 3}Z`} fill={color} opacity=".88"/>;
  if (id.includes('goatee')) return <path d={`M${cx - 4} ${mouth + 1} Q${cx} ${mouth + 5} ${cx + 4} ${mouth + 1} L${cx + 3} ${chin - 2} Q${cx} ${chin + 3} ${cx - 3} ${chin - 2}Z`} fill={color} opacity=".9"/>;
  if (id.includes('beard-02')) return <path d={`M${cx - half} ${mouth + 1} Q${cx} ${mouth + 9} ${cx + half} ${mouth + 1} L${cx + half * .72} ${chin + 6} Q${cx} ${chin + 12} ${cx - half * .72} ${chin + 6}Z`} fill={color} opacity=".9"/>;
  if (id.includes('neat-beard')) return <path d={`M${cx - half * .82} ${mouth} Q${cx} ${mouth + 6} ${cx + half * .82} ${mouth} L${cx + half * .54} ${chin + 1} Q${cx} ${chin + 5} ${cx - half * .54} ${chin + 1}Z`} fill={color} opacity=".84"/>;
  return <path d={`M${cx - half * .9} ${mouth + 1} Q${cx} ${mouth + 7} ${cx + half * .9} ${mouth + 1} L${cx + half * .62} ${chin - 1} Q${cx} ${chin + 5} ${cx - half * .62} ${chin - 1}Z`} fill={color} opacity=".88"/>;
}

function Headwear({ id, color, rig }: { id: string; color: string; rig: PortraitRig }) {
  if (id.endsWith('.none')) return null;
  const cx = rig.centerX;
  const half = rig.faceWidth / 2;
  const baseY = rig.topY + 7;
  if (id.includes('refined-hairpin')) return <g><path d={`M${cx - 13} ${rig.topY - 1} L${cx + 15} ${rig.topY - 9}`} stroke="#c0a66d" strokeWidth="2" strokeLinecap="round"/><path d={`M${cx + 14} ${rig.topY - 10} l4 -2 l-1 5Z`} fill="#bda46f"/></g>;
  if (id.includes('hairpin')) return <g><path d={`M${cx - 9} ${rig.topY - 1} L${cx + 11} ${rig.topY - 7}`} stroke="#aa9568" strokeWidth="2" strokeLinecap="round"/><circle cx={cx + 12} cy={rig.topY - 7.5} r="2.5" fill="#b8a273"/></g>;
  if (id.includes('hair-ribbon')) return <g><path d={`M${cx - 12} ${rig.topY + 5} Q${cx} ${rig.topY + 10} ${cx + 12} ${rig.topY + 5}`} fill="none" stroke={color} strokeWidth="3"/><path d={`M${cx + 9} ${rig.topY + 6} l7 8 l-5 -1Z`} fill={color}/></g>;
  if (id.includes('sun-hat')) return <g><ellipse cx={cx} cy={baseY} rx={half + 10} ry="6.5" fill="#87765d"/><path d={`M${cx - half * .8} ${baseY} Q${cx} ${rig.topY - 16} ${cx + half * .8} ${baseY}Z`} fill="#968468"/><path d={`M${cx - half * .65} ${baseY - 2} Q${cx} ${rig.topY - 10} ${cx + half * .65} ${baseY - 2}`} fill="none" stroke="#b5a17d" strokeWidth="1.5" opacity=".7"/></g>;
  if (id.includes('refined-cap')) return <g fill={color}><path d={`M${cx - half * .65} ${baseY + 1} Q${cx} ${rig.topY - 7} ${cx + half * .65} ${baseY + 1} L${cx + half * .48} ${rig.topY - 2} H${cx - half * .48}Z`}/><rect x={cx - half * .7} y={baseY - 1} width={half * 1.4} height="4" rx="2" opacity=".88"/></g>;
  if (id.includes('simple-cap')) return <g fill={color}><path d={`M${cx - half * .7} ${baseY + 2} Q${cx} ${rig.topY - 4} ${cx + half * .7} ${baseY + 2} L${cx + half * .52} ${rig.topY} H${cx - half * .52}Z`}/><rect x={cx - half * .76} y={baseY} width={half * 1.52} height="4" rx="2"/></g>;
  if (id.includes('small-headscarf')) return <g fill={color}><path d={`M${cx - half * .78} ${baseY + 1} Q${cx} ${rig.topY - 1} ${cx + half * .78} ${baseY + 1}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/><path d={`M${cx - half * .65} ${baseY + 2} l-8 10 l9 -4Z`}/></g>;
  return <g><path d={`M${cx - half * .78} ${baseY + 1} Q${cx} ${rig.topY + 1} ${cx + half * .78} ${baseY + 1}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/><path d={`M${cx + half * .68} ${baseY} L${cx + half + 8} ${baseY + 7} L${cx + half * .65} ${baseY + 8}Z`} fill={color}/></g>;
}

type OutfitTier = 'poor' | 'plain' | 'comfortable' | 'wealthy';

function outfitTier(id: string): OutfitTier {
  if (id.includes('wealthy') || id.includes('refined')) return 'wealthy';
  if (id.includes('comfortable') || id.includes('merchant') || id.includes('layered') || id.includes('elder-layered')) return 'comfortable';
  if (id.includes('rough') || id.includes('poor')) return 'poor';
  return 'plain';
}

function Outfit({ id, color, rig, gender, profile }: { id: string; color: string; rig: PortraitRig; gender: Gender; profile: PortraitFaceArtProfile }) {
  const tier = outfitTier(id);
  const female = gender === 'female' || id.includes('female');
  const home = id.includes('home');
  const merchant = id.includes('merchant');
  const baseHalf = female ? 40 : 42;
  const shoulderHalf = baseHalf * profile.shoulderScale + (tier === 'poor' ? 2.5 : tier === 'wealthy' ? .5 : 1.2);
  const topY = rig.shoulderY - 4;
  const collarOuter = tier === 'wealthy' ? '#d8ccb0' : tier === 'comfortable' ? '#c5baa0' : tier === 'plain' ? '#b7ad98' : '#aa9d84';
  const collarInner = tier === 'wealthy' ? '#91816b' : '#867a69';
  const bodyPath = `M${rig.centerX - shoulderHalf} 150 Q${rig.centerX - shoulderHalf + (female ? 1.5 : 3.5)} ${topY + (female ? 8 : 4)} ${rig.centerX - 12} ${topY} H${rig.centerX + 12} Q${rig.centerX + shoulderHalf - (female ? 1.5 : 3.5)} ${topY + (female ? 8 : 4)} ${rig.centerX + shoulderHalf} 150Z`;
  return <g data-outfit-tier={tier}>
    <path d={bodyPath} fill={color}/>
    {tier === 'poor' && <><path d={`M${rig.centerX - 9} ${topY + 1} L${rig.centerX - 1} ${topY + 13} L${rig.centerX + 9} ${topY + 3}`} fill="none" stroke={collarOuter} strokeWidth="4.3" strokeLinecap="round" opacity=".82"/><path d={`M${rig.centerX - shoulderHalf + 6} 146 L${rig.centerX - shoulderHalf + 12} ${topY + 18}`} stroke="#d5c7aa" strokeWidth="1" opacity=".12"/></>}
    {tier === 'plain' && <path d={`M${rig.centerX - 11} ${topY} L${rig.centerX} ${topY + 14} L${rig.centerX + 11} ${topY}`} fill="none" stroke={collarOuter} strokeWidth="5" strokeLinejoin="round" opacity=".9"/>}
    {tier === 'comfortable' && <><path d={`M${rig.centerX - 12} ${topY} L${rig.centerX} ${topY + 15} L${rig.centerX + 12} ${topY}`} fill="none" stroke={collarOuter} strokeWidth="5.8" strokeLinejoin="round" opacity=".94"/><path d={`M${rig.centerX - 18} ${topY + 10} Q${rig.centerX} ${topY + 23} ${rig.centerX + 18} ${topY + 10}`} fill="none" stroke={collarInner} strokeWidth="2.1" opacity=".72"/><path d={`M${rig.centerX - shoulderHalf + 8} ${topY + 24} Q${rig.centerX - 24} ${topY + 17} ${rig.centerX - 15} ${topY + 18}`} fill="none" stroke="#d5c8aa" strokeWidth="1" opacity=".18"/></>}
    {tier === 'wealthy' && <><path d={`M${rig.centerX - 12} ${topY} L${rig.centerX} ${topY + 15} L${rig.centerX + 12} ${topY}`} fill="none" stroke={collarOuter} strokeWidth="6.6" strokeLinejoin="round" opacity=".96"/><path d={`M${rig.centerX - 18} ${topY + 10} Q${rig.centerX} ${topY + 24} ${rig.centerX + 18} ${topY + 10}`} fill="none" stroke={collarInner} strokeWidth="3" opacity=".74"/><path d={`M${rig.centerX - 24} ${topY + 24} Q${rig.centerX} ${topY + 34} ${rig.centerX + 24} ${topY + 24}`} fill="none" stroke="#ddcfaa" strokeWidth="1.55" opacity=".42"/><path d={`M${rig.centerX - 29} ${topY + 34} H${rig.centerX + 29}`} stroke="#c8b587" strokeWidth="1.2" opacity=".28"/><circle cx={rig.centerX} cy={topY + 28} r="1.35" fill="#b9a26f" opacity=".76"/></>}
    {home && <path d={`M${rig.centerX - 27} ${topY + 29} Q${rig.centerX} ${topY + 36} ${rig.centerX + 27} ${topY + 29}`} fill="none" stroke="#d8cdb4" strokeWidth="1" opacity=".14"/>}
    {merchant && <path d={`M${rig.centerX - 31} ${topY + 18} Q${rig.centerX - 21} ${topY + 13} ${rig.centerX - 13} ${topY + 15}`} fill="none" stroke="#d0c39f" strokeWidth="1.4" opacity=".38"/>}
    <path d={`M${rig.centerX} ${topY + 15} V148`} stroke="#262924" strokeWidth="1.1" opacity=".14"/>
  </g>;
}

function AgeOverlay({ lifeStage, rig, gender }: { lifeStage: LifeStageId; rig: PortraitRig; gender: Gender }) {
  if (lifeStage !== 'middle-age' && lifeStage !== 'elder') return null;
  const elder = lifeStage === 'elder';
  const eyeOffset = rig.faceWidth * (gender === 'female' ? .238 : .216);
  return <g fill="none" stroke="#705745" strokeWidth={elder ? .8 : .68} opacity={elder ? '.34' : '.2'}>
    <path d={`M${rig.centerX - eyeOffset - 4} ${rig.eyeY + 4} Q${rig.centerX - eyeOffset} ${rig.eyeY + 6} ${rig.centerX - eyeOffset + 4} ${rig.eyeY + 5}`}/>
    <path d={`M${rig.centerX + eyeOffset - 4} ${rig.eyeY + 5} Q${rig.centerX + eyeOffset} ${rig.eyeY + 6} ${rig.centerX + eyeOffset + 4} ${rig.eyeY + 4}`}/>
    {elder && <><path d={`M${rig.centerX - rig.jawWidth * .28} ${rig.mouthY + 4} Q${rig.centerX} ${rig.mouthY + 7} ${rig.centerX + rig.jawWidth * .28} ${rig.mouthY + 4}`}/><path d={`M${rig.centerX - rig.faceWidth * .35} ${rig.noseY + 2} Q${rig.centerX - rig.faceWidth * .3} ${rig.mouthY} ${rig.centerX - rig.faceWidth * .24} ${rig.mouthY + 2}`}/><path d={`M${rig.centerX + rig.faceWidth * .35} ${rig.noseY + 2} Q${rig.centerX + rig.faceWidth * .3} ${rig.mouthY} ${rig.centerX + rig.faceWidth * .24} ${rig.mouthY + 2}`}/></>}
  </g>;
}

function RigDebug({ rig }: { rig: PortraitRig }) {
  const half = rig.faceWidth / 2;
  const eyeOffset = rig.faceWidth * .22;
  const anchors = [
    [rig.centerX, rig.topY], [rig.centerX, rig.hairlineY],
    [rig.centerX - eyeOffset, rig.browY], [rig.centerX + eyeOffset, rig.browY],
    [rig.centerX, rig.mouthY], [rig.centerX, rig.chinY],
    [rig.centerX, rig.neckTopY], [rig.centerX, rig.shoulderY],
  ];
  return <g className="portrait-rig-debug" pointerEvents="none">
    <rect x=".7" y=".7" width={PORTRAIT_MASTER.width - 1.4} height={PORTRAIT_MASTER.height - 1.4} fill="none" stroke="#6f8d82" strokeWidth=".6" strokeDasharray="3 2" opacity=".58"/>
    <rect x={PORTRAIT_MASTER.safeX + .7} y={PORTRAIT_MASTER.safeY + .7} width={PORTRAIT_MASTER.safeWidth - 1.4} height={PORTRAIT_MASTER.safeHeight - 1.4} fill="none" stroke="#e1c16f" strokeWidth=".8" strokeDasharray="4 2" opacity=".78"/>
    <rect x={rig.centerX - half} y={rig.topY} width={rig.faceWidth} height={rig.chinY - rig.topY} fill="none" stroke="#68d7d0" strokeWidth=".7" strokeDasharray="2 2" opacity=".72"/>
    <line x1="16" x2="104" y1={rig.hairlineY} y2={rig.hairlineY} stroke="#d4bb75" strokeWidth=".55" strokeDasharray="3 2" opacity=".64"/>
    <line x1="16" x2="104" y1={rig.shoulderY} y2={rig.shoulderY} stroke="#b37ee6" strokeWidth=".55" strokeDasharray="3 2" opacity=".64"/>
    {anchors.map(([x, y], index) => <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r="1.5" fill="#f1df98" stroke="#17211e" strokeWidth=".5"/>)}
  </g>;
}

export function appearanceSignature(appearance: ResidentAppearanceDNA) {
  return [
    appearance.faceId, appearance.hairId, appearance.browId, appearance.facialHairId,
    appearance.headwearId, appearance.outfitId, appearance.skinPaletteId,
    appearance.hairPaletteId, appearance.clothingPaletteId,
  ].join('|');
}

export function ResidentAvatar({
  seed = 1,
  gender,
  lifeStage,
  occupationId = '',
  appearance,
  catalog,
  label,
  debugRig = false,
  hiddenLayers = [],
  masterPreview = false,
}: Props) {
  const dna = appearance ?? fallbackAppearance(seed, gender, lifeStage, occupationId);
  const rig = portraitRigForFace(catalog, dna.faceId);
  const faceFamily = faceFamilyForId(catalog, dna.faceId);
  const profile = faceArtProfile(dna.faceId, gender);
  const artFamily = faceArtFamily(dna.faceId, gender);
  const hairVisibility = hairVisibilityForHeadwear(catalog, dna.headwearId);
  const diagnostics = portraitDiagnostics(dna, catalog, gender, lifeStage);
  const hidden = new Set(hiddenLayers);
  const skin = SKIN_COLORS[dna.skinPaletteId] ?? '#c99975';
  const hair = HAIR_COLORS[dna.hairPaletteId] ?? '#292320';
  const cloth = CLOTH_COLORS[dna.clothingPaletteId] ?? '#66706b';
  const geometry = faceGeometry(rig, profile);
  const neckHalf = Math.max(4.4, rig.jawWidth * .2 * profile.neckScale);
  const hideAllHair = hidden.has('hair');
  const showHairBack = !hideAllHair && !hidden.has('back-hair') && hairVisibility !== 'hidden';
  const showHairFront = !hideAllHair && !hidden.has('front-hair') && hairVisibility === 'full';
  const hairSilhouette = silhouetteTypeForId(catalog, dna.hairId, 'hair-unknown');
  const outfitSilhouette = silhouetteTypeForId(catalog, dna.outfitId, 'outfit-unknown');

  return <div
    className={`generated-portrait generated-portrait--svg ${masterPreview ? 'generated-portrait--master' : 'generated-portrait--crop'} gender-${gender} age-${lifeStage}`}
    data-appearance-signature={appearanceSignature(dna)}
    data-face-family={faceFamily}
    data-face-art-family={artFamily}
    data-hair-visibility={hairVisibility}
    data-hair-silhouette={hairSilhouette}
    data-outfit-silhouette={outfitSilhouette}
    data-master-ratio="4:5"
    data-safe-area="1:1"
    data-art-kit="v2"
    data-background-style="clean-flat"
    data-halo="none"
    data-art-seed={seed}
    data-rig-state={diagnostics.errors.length ? 'error' : 'ok'}
    data-rig-errors={diagnostics.errors.length}
    data-rig-warnings={diagnostics.warnings.length}
    data-debug-rig={debugRig ? 'true' : 'false'}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <svg viewBox={`0 0 ${PORTRAIT_MASTER.width} ${PORTRAIT_MASTER.height}`} focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect data-portrait-background width={PORTRAIT_MASTER.width} height={PORTRAIT_MASTER.height} rx="20" fill="#33413b"/>
      {showHairBack && <HairBack id={dna.hairId} color={hair} rig={rig} gender={gender}/>} 
      {!hidden.has('outfit') && <Outfit id={dna.outfitId} color={cloth} rig={rig} gender={gender} profile={profile}/>} 
      <path d={`M${rig.centerX - neckHalf} ${rig.neckTopY} H${rig.centerX + neckHalf} L${rig.centerX + neckHalf + .8} ${rig.shoulderY + 8} Q${rig.centerX} ${rig.shoulderY + 11} ${rig.centerX - neckHalf - .8} ${rig.shoulderY + 8}Z`} fill={skin}/>
      <ellipse cx={geometry.left - 1} cy={rig.earY} rx={4.1 * profile.earScale} ry={5.9 * profile.earScale} fill={skin}/>
      <ellipse cx={geometry.right + 1} cy={rig.earY} rx={4.1 * profile.earScale} ry={5.9 * profile.earScale} fill={skin}/>
      <path d={facePath(rig, faceFamily, profile)} fill={skin}/>
      <FaceDetails gender={gender} rig={rig} profile={profile} family={faceFamily}/>
      {!hidden.has('brow') && <Brows id={dna.browId} color={hair} rig={rig} profile={profile} gender={gender}/>} 
      {showHairFront && <HairFront id={dna.hairId} color={hair} rig={rig} gender={gender}/>} 
      {!hidden.has('facial-hair') && <FacialHair id={dna.facialHairId} color={hair} rig={rig}/>} 
      {!hidden.has('headwear') && <Headwear id={dna.headwearId} color={cloth} rig={rig}/>} 
      {!hidden.has('age-overlay') && <AgeOverlay lifeStage={lifeStage} rig={rig} gender={gender}/>} 
      {debugRig && <RigDebug rig={rig}/>} 
    </svg>
  </div>;
}
