export type PortraitGender = 'male' | 'female';
export type PortraitWealth = 'poor' | 'plain' | 'comfortable' | 'wealthy';
export type PortraitLifeStage = 'child' | 'youth' | 'adult' | 'middle' | 'elder';
export type PortraitSize = 48 | 64 | 96;

export type FaceProfileId =
  | 'male-child-round'
  | 'male-youth-slim'
  | 'male-adult-average'
  | 'male-middle-broad'
  | 'male-elder-slim'
  | 'male-elder-thin'
  | 'female-child-round-soft'
  | 'female-youth-oval-soft'
  | 'female-youth-narrow-gentle'
  | 'female-adult-oval-stable'
  | 'female-adult-long-soft'
  | 'female-middle-household'
  | 'female-elder-kind'
  | 'female-elder-thin'
  | 'female-worker-broad';

export type HairAssetId =
  | 'male-child-short'
  | 'male-youth-tied'
  | 'male-adult-tied'
  | 'male-middle-tied'
  | 'male-elder-sparse'
  | 'male-elder-gray'
  | 'girl-double-bun'
  | 'girl-ribbon-side'
  | 'young-halfbound-backfall'
  | 'young-halfbound-asym'
  | 'young-low-tie'
  | 'adult-low-bun'
  | 'adult-coiled-bun'
  | 'married-tidy-bun'
  | 'middle-household-bun'
  | 'elder-gray-low-bun'
  | 'elder-tight-gray-bun'
  | 'worker-tight-bun';

export type FemaleHairCultureTag =
  | 'girl-double-bun'
  | 'girl-ribbon-side'
  | 'young-halfbound-backfall'
  | 'young-halfbound-asym'
  | 'young-low-tie'
  | 'adult-low-bun'
  | 'adult-coiled-bun'
  | 'married-tidy-bun'
  | 'middle-household-bun'
  | 'elder-gray-low-bun'
  | 'elder-tight-gray-bun'
  | 'worker-tight-bun';

type FemaleHairDefinition = {
  id: Extract<HairAssetId, FemaleHairCultureTag>;
  cultureTag: FemaleHairCultureTag;
  ageFit: PortraitLifeStage[];
  silhouetteType: string;
  anchorMode: 'crown-bun' | 'crown-occipital-nape' | 'nape-bun' | 'double-crown-bun';
  accessoryFit: AccessoryAssetId[];
};

export type BeardAssetId =
  | 'none'
  | 'stubble'
  | 'short'
  | 'trimmed-mustache'
  | 'elder-long'
  | 'elder-sparse';

export type OutfitAssetId =
  | 'poor-child'
  | 'poor-male'
  | 'poor-female'
  | 'plain-male'
  | 'plain-female'
  | 'comfortable-male'
  | 'comfortable-female'
  | 'wealthy-male'
  | 'wealthy-female'
  | 'worker-female';

export type AgeOverlayId = 'none' | 'middle-soft' | 'elder-lines' | 'elder-deep';

export type AccessoryAssetId =
  | 'none'
  | 'red-cord'
  | 'cloth-knot'
  | 'wood-pin'
  | 'simple-hairpin'
  | 'double-prong-pin'
  | 'jade-pin'
  | 'headcloth';

export type WoodblockPortraitSpec = {
  id: string;
  name: string;
  age: number;
  stageLabel: string;
  gender: PortraitGender;
  lifeStage: PortraitLifeStage;
  wealth: PortraitWealth;
  wealthLabel: string;
  roleTags: string[];
  faceProfileId: FaceProfileId;
  hairId: HairAssetId;
  beardId: BeardAssetId;
  outfitId: OutfitAssetId;
  ageOverlayId: AgeOverlayId;
  accessory: AccessoryAssetId;
  skin: string;
  hair: string;
  cloth: string;
};

type Vec2 = { x: number; y: number };

export type PortraitAnchors = {
  skullTop: Vec2;
  foreheadCenter: Vec2;
  templeLeft: Vec2;
  templeRight: Vec2;
  earLeft: Vec2;
  earRight: Vec2;
  jawLeft: Vec2;
  jawRight: Vec2;
  chin: Vec2;
  neckLeft: Vec2;
  neckRight: Vec2;
  shoulderLeft: Vec2;
  shoulderRight: Vec2;
  shoulderBackLeft: Vec2;
  shoulderBackRight: Vec2;
  sideburnLeft: Vec2;
  sideburnRight: Vec2;
  crownCenter: Vec2;
  crownBack: Vec2;
  bunMid: Vec2;
  bunLow: Vec2;
  occipitalLeft: Vec2;
  occipitalRight: Vec2;
  napeCenter: Vec2;
  chestCenter: Vec2;
};

type FaceProfile = {
  faceWidth: number;
  topY: number;
  chinY: number;
  jawWidth: number;
  eyeY: number;
  eyeSpan: number;
  browY: number;
  noseY: number;
  mouthY: number;
  earY: number;
  neckHalf: number;
  shoulderHalf: number;
};

type PortraitRig = FaceProfile & {
  centerX: number;
  anchors: PortraitAnchors;
};

const FEMALE_HAIR_CATALOG: FemaleHairDefinition[] = [
  { id: 'girl-double-bun', cultureTag: 'girl-double-bun', ageFit: ['child'], silhouetteType: 'girl-double-crown', anchorMode: 'double-crown-bun', accessoryFit: ['none', 'red-cord', 'cloth-knot'] },
  { id: 'girl-ribbon-side', cultureTag: 'girl-ribbon-side', ageFit: ['child'], silhouetteType: 'girl-side-tie', anchorMode: 'crown-occipital-nape', accessoryFit: ['none', 'red-cord', 'cloth-knot'] },
  { id: 'young-halfbound-backfall', cultureTag: 'young-halfbound-backfall', ageFit: ['youth'], silhouetteType: 'young-halfbound-back', anchorMode: 'crown-occipital-nape', accessoryFit: ['none', 'cloth-knot', 'wood-pin'] },
  { id: 'young-halfbound-asym', cultureTag: 'young-halfbound-asym', ageFit: ['youth'], silhouetteType: 'young-halfbound-asym', anchorMode: 'crown-occipital-nape', accessoryFit: ['none', 'cloth-knot', 'wood-pin'] },
  { id: 'young-low-tie', cultureTag: 'young-low-tie', ageFit: ['youth', 'adult'], silhouetteType: 'young-low-tie', anchorMode: 'nape-bun', accessoryFit: ['none', 'cloth-knot', 'wood-pin'] },
  { id: 'adult-low-bun', cultureTag: 'adult-low-bun', ageFit: ['adult', 'middle'], silhouetteType: 'adult-low-bun', anchorMode: 'nape-bun', accessoryFit: ['none', 'wood-pin', 'simple-hairpin', 'jade-pin'] },
  { id: 'adult-coiled-bun', cultureTag: 'adult-coiled-bun', ageFit: ['adult', 'middle'], silhouetteType: 'adult-coiled-bun', anchorMode: 'crown-bun', accessoryFit: ['wood-pin', 'simple-hairpin', 'double-prong-pin', 'jade-pin'] },
  { id: 'married-tidy-bun', cultureTag: 'married-tidy-bun', ageFit: ['adult', 'middle'], silhouetteType: 'married-tidy-bun', anchorMode: 'crown-bun', accessoryFit: ['none', 'wood-pin', 'simple-hairpin', 'double-prong-pin'] },
  { id: 'middle-household-bun', cultureTag: 'middle-household-bun', ageFit: ['middle'], silhouetteType: 'middle-household-bun', anchorMode: 'crown-bun', accessoryFit: ['wood-pin', 'simple-hairpin', 'double-prong-pin', 'jade-pin'] },
  { id: 'elder-gray-low-bun', cultureTag: 'elder-gray-low-bun', ageFit: ['elder'], silhouetteType: 'elder-gray-low-bun', anchorMode: 'nape-bun', accessoryFit: ['none', 'wood-pin', 'jade-pin'] },
  { id: 'elder-tight-gray-bun', cultureTag: 'elder-tight-gray-bun', ageFit: ['elder'], silhouetteType: 'elder-tight-gray-bun', anchorMode: 'crown-bun', accessoryFit: ['none', 'wood-pin', 'jade-pin'] },
  { id: 'worker-tight-bun', cultureTag: 'worker-tight-bun', ageFit: ['adult', 'middle'], silhouetteType: 'worker-tight-bun', anchorMode: 'nape-bun', accessoryFit: ['none', 'headcloth', 'wood-pin'] },
];

function femaleHairDefinition(id: HairAssetId) {
  return FEMALE_HAIR_CATALOG.find((item) => item.id === id);
}

const LINE = '#271f1a';
const BACKGROUNDS = ['#c8aa70', '#d0b27a', '#c4a268', '#d4b77f'];

const FACE_PROFILES: Record<FaceProfileId, FaceProfile> = {
  'male-child-round': { faceWidth: 42, topY: 31, chinY: 82, jawWidth: 36, eyeY: 52, eyeSpan: 9.4, browY: 45, noseY: 61, mouthY: 69, earY: 55, neckHalf: 5, shoulderHalf: 29 },
  'male-youth-slim': { faceWidth: 41, topY: 24, chinY: 91, jawWidth: 28, eyeY: 53, eyeSpan: 10, browY: 46, noseY: 65, mouthY: 76, earY: 56, neckHalf: 6.1, shoulderHalf: 43 },
  'male-adult-average': { faceWidth: 46, topY: 25, chinY: 91, jawWidth: 34, eyeY: 54, eyeSpan: 10.5, browY: 46, noseY: 66, mouthY: 76, earY: 57, neckHalf: 6.8, shoulderHalf: 45 },
  'male-middle-broad': { faceWidth: 50, topY: 26, chinY: 92, jawWidth: 39, eyeY: 55, eyeSpan: 11, browY: 47, noseY: 67, mouthY: 77, earY: 58, neckHalf: 7.5, shoulderHalf: 47 },
  'male-elder-slim': { faceWidth: 43, topY: 26, chinY: 95, jawWidth: 29, eyeY: 55, eyeSpan: 9.8, browY: 48, noseY: 68, mouthY: 79, earY: 58, neckHalf: 6.1, shoulderHalf: 42 },
  'male-elder-thin': { faceWidth: 39, topY: 27, chinY: 97, jawWidth: 25, eyeY: 56, eyeSpan: 9.2, browY: 49, noseY: 69, mouthY: 80, earY: 59, neckHalf: 5.6, shoulderHalf: 38 },
  'female-child-round-soft': { faceWidth: 40, topY: 31, chinY: 82, jawWidth: 35, eyeY: 52, eyeSpan: 9.3, browY: 45, noseY: 61, mouthY: 69, earY: 55, neckHalf: 4.4, shoulderHalf: 27 },
  'female-youth-oval-soft': { faceWidth: 39, topY: 25, chinY: 87, jawWidth: 30, eyeY: 52, eyeSpan: 9.5, browY: 45, noseY: 63, mouthY: 73, earY: 55, neckHalf: 4.8, shoulderHalf: 37 },
  'female-youth-narrow-gentle': { faceWidth: 36, topY: 25, chinY: 88, jawWidth: 26, eyeY: 52, eyeSpan: 9.2, browY: 45, noseY: 63, mouthY: 73, earY: 55, neckHalf: 4.7, shoulderHalf: 36 },
  'female-adult-oval-stable': { faceWidth: 40, topY: 25, chinY: 90, jawWidth: 31, eyeY: 53, eyeSpan: 9.5, browY: 46, noseY: 65, mouthY: 75, earY: 56, neckHalf: 5.1, shoulderHalf: 39 },
  'female-adult-long-soft': { faceWidth: 38, topY: 24, chinY: 92, jawWidth: 28, eyeY: 53, eyeSpan: 9.3, browY: 46, noseY: 66, mouthY: 76, earY: 56, neckHalf: 5.0, shoulderHalf: 38 },
  'female-middle-household': { faceWidth: 42, topY: 26, chinY: 93, jawWidth: 33, eyeY: 54, eyeSpan: 9.7, browY: 47, noseY: 67, mouthY: 77, earY: 57, neckHalf: 5.5, shoulderHalf: 41 },
  'female-elder-kind': { faceWidth: 39, topY: 27, chinY: 95, jawWidth: 29, eyeY: 55, eyeSpan: 9.0, browY: 48, noseY: 68, mouthY: 79, earY: 58, neckHalf: 5.0, shoulderHalf: 38 },
  'female-elder-thin': { faceWidth: 35, topY: 28, chinY: 97, jawWidth: 24, eyeY: 55, eyeSpan: 8.8, browY: 48, noseY: 69, mouthY: 80, earY: 58, neckHalf: 4.8, shoulderHalf: 36 },
  'female-worker-broad': { faceWidth: 44, topY: 26, chinY: 92, jawWidth: 36, eyeY: 54, eyeSpan: 9.8, browY: 46, noseY: 66, mouthY: 76, earY: 57, neckHalf: 5.8, shoulderHalf: 42 },
};

export const GOLDEN_PORTRAITS: WoodblockPortraitSpec[] = [
  { id: 'golden-boy-child-poor', name: '阿石', age: 8, stageLabel: '男童', gender: 'male', lifeStage: 'child', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['儿童', '朴素'], faceProfileId: 'male-child-round', hairId: 'male-child-short', beardId: 'none', outfitId: 'poor-child', ageOverlayId: 'none', accessory: 'none', skin: '#cd9470', hair: '#2a2421', cloth: '#725d48' },
  { id: 'golden-male-youth-poor', name: '沈砚', age: 22, stageLabel: '青年男子', gender: 'male', lifeStage: 'youth', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['青年', '清瘦'], faceProfileId: 'male-youth-slim', hairId: 'male-youth-tied', beardId: 'none', outfitId: 'poor-male', ageOverlayId: 'none', accessory: 'none', skin: '#c9916f', hair: '#2b2522', cloth: '#74614d' },
  { id: 'golden-male-adult-plain', name: '周朴', age: 36, stageLabel: '成年男子', gender: 'male', lifeStage: 'adult', wealth: 'plain', wealthLabel: '普通', roleTags: ['成年', '日常'], faceProfileId: 'male-adult-average', hairId: 'male-adult-tied', beardId: 'stubble', outfitId: 'plain-male', ageOverlayId: 'none', accessory: 'none', skin: '#b97d5f', hair: '#292421', cloth: '#5d6870' },
  { id: 'golden-male-middle-comfortable', name: '陆川', age: 51, stageLabel: '中年男子', gender: 'male', lifeStage: 'middle', wealth: 'comfortable', wealthLabel: '殷实', roleTags: ['中年', '体面'], faceProfileId: 'male-middle-broad', hairId: 'male-middle-tied', beardId: 'trimmed-mustache', outfitId: 'comfortable-male', ageOverlayId: 'middle-soft', accessory: 'jade-pin', skin: '#b57a5c', hair: '#45403b', cloth: '#465d53' },
  { id: 'golden-male-elder-wealthy', name: '顾伯衡', age: 69, stageLabel: '老年男子', gender: 'male', lifeStage: 'elder', wealth: 'wealthy', wealthLabel: '富裕', roleTags: ['老人', '富裕'], faceProfileId: 'male-elder-slim', hairId: 'male-elder-gray', beardId: 'elder-long', outfitId: 'wealthy-male', ageOverlayId: 'elder-lines', accessory: 'jade-pin', skin: '#c08b6b', hair: '#8a857c', cloth: '#664c4b' },
  { id: 'golden-girl-child-poor', name: '小禾', age: 9, stageLabel: '女童', gender: 'female', lifeStage: 'child', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['儿童', '双小髻'], faceProfileId: 'female-child-round-soft', hairId: 'girl-double-bun', beardId: 'none', outfitId: 'poor-child', ageOverlayId: 'none', accessory: 'red-cord', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-youth-poor', name: '阿禾', age: 19, stageLabel: '青年女子', gender: 'female', lifeStage: 'youth', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['青年', '半束后披'], faceProfileId: 'female-youth-oval-soft', hairId: 'young-halfbound-backfall', beardId: 'none', outfitId: 'poor-female', ageOverlayId: 'none', accessory: 'cloth-knot', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-adult-plain', name: '林月娘', age: 33, stageLabel: '成年女子', gender: 'female', lifeStage: 'adult', wealth: 'plain', wealthLabel: '普通', roleTags: ['成年', '已婚收束髻'], faceProfileId: 'female-adult-oval-stable', hairId: 'married-tidy-bun', beardId: 'none', outfitId: 'plain-female', ageOverlayId: 'none', accessory: 'wood-pin', skin: '#c98e6c', hair: '#2b2524', cloth: '#66727a' },
  { id: 'golden-female-middle-comfortable', name: '许兰英', age: 49, stageLabel: '中年女子', gender: 'female', lifeStage: 'middle', wealth: 'comfortable', wealthLabel: '殷实', roleTags: ['中年', '当家妇人髻'], faceProfileId: 'female-middle-household', hairId: 'middle-household-bun', beardId: 'none', outfitId: 'comfortable-female', ageOverlayId: 'middle-soft', accessory: 'double-prong-pin', skin: '#b97e61', hair: '#4a433e', cloth: '#596555' },
  { id: 'golden-female-elder-wealthy', name: '沈老夫人', age: 68, stageLabel: '老年女子', gender: 'female', lifeStage: 'elder', wealth: 'wealthy', wealthLabel: '富裕', roleTags: ['老人', '花白低髻'], faceProfileId: 'female-elder-kind', hairId: 'elder-gray-low-bun', beardId: 'none', outfitId: 'wealthy-female', ageOverlayId: 'elder-deep', accessory: 'jade-pin', skin: '#c28d6d', hair: '#989188', cloth: '#6c555f' },
  { id: 'golden-female-worker-plain', name: '赵婶', age: 44, stageLabel: '劳作妇人', gender: 'female', lifeStage: 'middle', wealth: 'plain', wealthLabel: '普通', roleTags: ['劳作', '紧收低髻'], faceProfileId: 'female-worker-broad', hairId: 'worker-tight-bun', beardId: 'none', outfitId: 'worker-female', ageOverlayId: 'middle-soft', accessory: 'headcloth', skin: '#b67a5d', hair: '#3c3531', cloth: '#6b6252' },
  { id: 'golden-male-elder-thin-poor', name: '田伯', age: 73, stageLabel: '瘦弱老翁', gender: 'male', lifeStage: 'elder', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['老人', '瘦弱'], faceProfileId: 'male-elder-thin', hairId: 'male-elder-sparse', beardId: 'elder-sparse', outfitId: 'poor-male', ageOverlayId: 'elder-deep', accessory: 'none', skin: '#aa7258', hair: '#8e877e', cloth: '#615244' },
];

function residentIndex(spec: WoodblockPortraitSpec) {
  const index = GOLDEN_PORTRAITS.findIndex((item) => item.id === spec.id);
  return index >= 0 ? index : Math.abs(spec.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % GOLDEN_PORTRAITS.length;
}

function rigFor(spec: WoodblockPortraitSpec): PortraitRig {
  const profile = FACE_PROFILES[spec.faceProfileId];
  const centerX = 60;
  const half = profile.faceWidth / 2;
  const jawHalf = profile.jawWidth / 2;
  const hairlineY = profile.topY + 13;
  const shoulderY = spec.lifeStage === 'child' ? 99 : 96;
  const anchors: PortraitAnchors = {
    skullTop: { x: centerX, y: profile.topY - 2 },
    foreheadCenter: { x: centerX, y: hairlineY - 3 },
    templeLeft: { x: centerX - half + 2, y: hairlineY },
    templeRight: { x: centerX + half - 2, y: hairlineY },
    earLeft: { x: centerX - half - 1.5, y: profile.earY },
    earRight: { x: centerX + half + 1.5, y: profile.earY },
    jawLeft: { x: centerX - jawHalf, y: profile.chinY - 12 },
    jawRight: { x: centerX + jawHalf, y: profile.chinY - 12 },
    chin: { x: centerX, y: profile.chinY },
    neckLeft: { x: centerX - profile.neckHalf, y: profile.chinY - 3 },
    neckRight: { x: centerX + profile.neckHalf, y: profile.chinY - 3 },
    shoulderLeft: { x: centerX - profile.shoulderHalf, y: shoulderY + 12 },
    shoulderRight: { x: centerX + profile.shoulderHalf, y: shoulderY + 12 },
    shoulderBackLeft: { x: centerX - profile.shoulderHalf + 8, y: shoulderY + 5 },
    shoulderBackRight: { x: centerX + profile.shoulderHalf - 8, y: shoulderY + 5 },
    sideburnLeft: { x: centerX - half + 4, y: profile.earY - 8 },
    sideburnRight: { x: centerX + half - 4, y: profile.earY - 8 },
    crownCenter: { x: centerX, y: profile.topY - 3 },
    crownBack: { x: centerX + 6, y: profile.topY + 1 },
    bunMid: { x: centerX + half - 2, y: profile.earY - 13 },
    bunLow: { x: centerX + half - 1, y: profile.earY + 12 },
    occipitalLeft: { x: centerX - half + 5, y: profile.earY - 2 },
    occipitalRight: { x: centerX + half - 5, y: profile.earY - 2 },
    napeCenter: { x: centerX, y: profile.chinY + 4 },
    chestCenter: { x: centerX, y: 126 },
  };
  return { ...profile, centerX, anchors };
}

function facePath(rig: PortraitRig, spec: WoodblockPortraitSpec) {
  const cx = rig.centerX;
  const half = rig.faceWidth / 2;
  const jawHalf = rig.jawWidth / 2;
  const left = cx - half;
  const right = cx + half;
  const childRound = spec.lifeStage === 'child' ? 3 : 0;
  const workerSquare = spec.faceProfileId === 'female-worker-broad' ? 2 : 0;
  return [
    'M', cx, rig.topY,
    'C', left + 6, rig.topY - 1, left, rig.topY + 12, left + 1, rig.eyeY + 5,
    'C', left + 1, rig.mouthY + 5, cx - jawHalf - workerSquare, rig.chinY - 10, cx, rig.chinY + childRound,
    'C', cx + jawHalf + workerSquare, rig.chinY - 10, right - 1, rig.mouthY + 5, right - 1, rig.eyeY + 5,
    'C', right, rig.topY + 12, right - 6, rig.topY - 1, cx, rig.topY,
    'Z',
  ].join(' ');
}

function wealthAccent(spec: WoodblockPortraitSpec) {
  if (spec.wealth === 'wealthy') return '#d7bf7e';
  if (spec.wealth === 'comfortable') return '#b9aa83';
  if (spec.wealth === 'plain') return '#9f947b';
  return '#867b67';
}

function Outfit({ spec, rig }: { spec: WoodblockPortraitSpec; rig: PortraitRig }) {
  const a = rig.anchors;
  const child = spec.lifeStage === 'child';
  const left = a.shoulderLeft.x;
  const right = a.shoulderRight.x;
  const topY = child ? 96 : 93;
  const body = 'M' + left + ' 150 Q' + (left + 3) + ' ' + (topY + 13) + ' ' + (rig.centerX - 13) + ' ' + topY +
    ' H' + (rig.centerX + 13) + ' Q' + (right - 3) + ' ' + (topY + 13) + ' ' + right + ' 150Z';
  const accent = wealthAccent(spec);
  const collarWidth = spec.wealth === 'wealthy' ? 6.2 : spec.wealth === 'comfortable' ? 5.1 : spec.wealth === 'plain' ? 4.2 : 3.4;
  return <g data-outfit={spec.outfitId}>
    <path d={body} fill={spec.cloth} stroke={LINE} strokeWidth="2.6" strokeLinejoin="round"/>
    <path d={'M' + (rig.centerX - 12) + ' ' + topY + ' L' + rig.centerX + ' ' + (topY + (child ? 11 : 16)) + ' L' + (rig.centerX + 12) + ' ' + topY}
      fill="none" stroke={accent} strokeWidth={collarWidth} strokeLinejoin="round"/>
    {spec.wealth !== 'poor' && <path d={'M' + (rig.centerX - 20) + ' ' + (topY + 15) + ' Q' + rig.centerX + ' ' + (topY + 28) + ' ' + (rig.centerX + 20) + ' ' + (topY + 15)}
      fill="none" stroke={accent} strokeWidth={spec.wealth === 'wealthy' ? 2.6 : 1.6} opacity=".82"/>}
    {spec.wealth === 'wealthy' && <><path d={'M' + (rig.centerX - 28) + ' ' + (topY + 31) + ' Q' + rig.centerX + ' ' + (topY + 40) + ' ' + (rig.centerX + 28) + ' ' + (topY + 31)}
      fill="none" stroke="#ddca93" strokeWidth="1.4" opacity=".7"/><circle cx={rig.centerX} cy={topY + 34} r="1.6" fill="#c6a85f"/></>}
    {spec.outfitId === 'worker-female' && <><path d={'M' + (left + 8) + ' 143 L' + (left + 17) + ' ' + (topY + 20)} stroke="#c8b691" strokeWidth="1.2" opacity=".28"/><path d={'M' + (right - 8) + ' 143 L' + (right - 17) + ' ' + (topY + 20)} stroke="#c8b691" strokeWidth="1.2" opacity=".28"/></>}
  </g>;
}

function HairBack({ spec, rig, size }: { spec: WoodblockPortraitSpec; rig: PortraitRig; size?: PortraitSize }) {
  const a = rig.anchors;
  const compact = size === 48;
  const hair = spec.hair;

  switch (spec.hairId) {
    case 'girl-double-bun':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.15}>
        <ellipse cx={a.crownCenter.x - 10} cy={a.crownCenter.y + 5} rx={compact ? 5.2 : 6.4} ry={compact ? 4.8 : 5.8}/>
        <ellipse cx={a.crownCenter.x + 10} cy={a.crownCenter.y + 5} rx={compact ? 5.2 : 6.4} ry={compact ? 4.8 : 5.8}/>
      </g>;
    case 'girl-ribbon-side':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .8 : 1.05}>
        <ellipse cx={a.bunLow.x - 4} cy={a.bunLow.y - 2} rx={compact ? 4.8 : 6} ry={compact ? 4.2 : 5.2}/>
      </g>;
    case 'young-halfbound-backfall':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.2} strokeLinejoin="round">
        <ellipse cx={a.crownBack.x} cy={a.crownBack.y + 2} rx={compact ? 5.5 : 7} ry={compact ? 4.5 : 5.5}/>
        <path d={'M' + a.occipitalLeft.x + ' ' + (a.occipitalLeft.y - 4) +
          ' C' + (a.shoulderBackLeft.x - 5) + ' 73 ' + (a.shoulderBackLeft.x - 4) + ' 96 ' + a.shoulderBackLeft.x + ' 119' +
          ' Q' + a.chestCenter.x + ' 126 ' + a.shoulderBackRight.x + ' 119' +
          ' C' + (a.shoulderBackRight.x + 4) + ' 96 ' + (a.shoulderBackRight.x + 5) + ' 73 ' + a.occipitalRight.x + ' ' + (a.occipitalRight.y - 4) +
          ' Q' + a.crownBack.x + ' ' + (a.crownBack.y + 7) + ' ' + a.occipitalLeft.x + ' ' + (a.occipitalLeft.y - 4) + 'Z'}/>
        {!compact && <path d={'M' + (a.occipitalLeft.x + 4) + ' 65 Q' + a.chestCenter.x + ' 95 ' + (a.occipitalRight.x - 4) + ' 65'} fill="none" stroke="#655047" strokeWidth=".8" opacity=".22"/>}
      </g>;
    case 'young-halfbound-asym':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.15} strokeLinejoin="round">
        <ellipse cx={a.crownBack.x + 2} cy={a.crownBack.y + 2} rx={compact ? 5 : 6.5} ry={compact ? 4.2 : 5.3}/>
        <path d={'M' + a.occipitalLeft.x + ' ' + (a.occipitalLeft.y - 3) +
          ' C' + (a.shoulderBackLeft.x - 2) + ' 78 ' + a.shoulderBackLeft.x + ' 101 ' + (a.shoulderBackLeft.x + 5) + ' 117' +
          ' Q' + (a.chestCenter.x + 5) + ' 124 ' + (a.shoulderBackRight.x - 3) + ' 116' +
          ' C' + (a.shoulderBackRight.x + 3) + ' 92 ' + (a.occipitalRight.x + 5) + ' 72 ' + a.occipitalRight.x + ' ' + (a.occipitalRight.y - 3) +
          ' Q' + a.crownBack.x + ' ' + (a.crownBack.y + 8) + ' ' + a.occipitalLeft.x + ' ' + (a.occipitalLeft.y - 3) + 'Z'}/>
      </g>;
    case 'young-low-tie':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .8 : 1.05}>
        <ellipse cx={a.napeCenter.x + 8} cy={a.napeCenter.y - 3} rx={compact ? 5 : 6.5} ry={compact ? 4.2 : 5.2}/>
        <path d={'M' + (a.napeCenter.x + 10) + ' ' + a.napeCenter.y + ' Q' + (a.shoulderBackRight.x - 4) + ' 105 ' + (a.shoulderBackRight.x - 2) + ' 120'} fill="none" stroke={hair} strokeWidth={compact ? 5 : 6.5} strokeLinecap="round"/>
      </g>;
    case 'adult-low-bun':
      return <ellipse cx={a.bunLow.x} cy={a.bunLow.y} rx={compact ? 6 : 8.5} ry={compact ? 5 : 7} fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.2}/>;
    case 'adult-coiled-bun':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .85 : 1.1}>
        <ellipse cx={a.bunMid.x} cy={a.bunMid.y} rx={compact ? 7 : 9.5} ry={compact ? 6 : 8}/>
        {!compact && <ellipse cx={a.bunMid.x} cy={a.bunMid.y} rx="5.2" ry="4.3" fill="none" stroke="#665047" strokeWidth=".8" opacity=".45"/>}
      </g>;
    case 'married-tidy-bun':
      return <ellipse cx={a.bunMid.x - 1} cy={a.bunMid.y + 2} rx={compact ? 6.2 : 8} ry={compact ? 5.3 : 6.8} fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.15}/>;
    case 'middle-household-bun':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .9 : 1.2}>
        <ellipse cx={a.bunMid.x - 1} cy={a.bunMid.y} rx={compact ? 7 : 9.2} ry={compact ? 6 : 7.8}/>
        <path d={'M' + (a.bunMid.x - 6) + ' ' + (a.bunMid.y - 1) + ' Q' + a.bunMid.x + ' ' + (a.bunMid.y + 3) + ' ' + (a.bunMid.x + 6) + ' ' + (a.bunMid.y - 1)} fill="none" stroke="#6b5549" strokeWidth=".8" opacity=".42"/>
      </g>;
    case 'elder-gray-low-bun':
      return <g fill={hair} stroke={LINE} strokeWidth={compact ? .85 : 1.05}>
        <ellipse cx={a.bunLow.x - 1} cy={a.bunLow.y - 1} rx={compact ? 5.8 : 7.5} ry={compact ? 4.8 : 6.2}/>
        {!compact && <path d={'M' + (a.bunLow.x - 5) + ' ' + (a.bunLow.y - 2) + ' Q' + a.bunLow.x + ' ' + (a.bunLow.y + 1) + ' ' + (a.bunLow.x + 5) + ' ' + (a.bunLow.y - 2)} fill="none" stroke="#d5d0c7" strokeWidth=".9" opacity=".55"/>}
      </g>;
    case 'elder-tight-gray-bun':
      return <ellipse cx={a.crownBack.x + 3} cy={a.crownBack.y + 5} rx={compact ? 5.5 : 7} ry={compact ? 4.8 : 6} fill={hair} stroke={LINE} strokeWidth={compact ? .85 : 1.05}/>;
    case 'worker-tight-bun':
      return <ellipse cx={a.bunLow.x - 3} cy={a.bunLow.y - 3} rx={compact ? 5.4 : 6.8} ry={compact ? 4.5 : 5.5} fill={hair} stroke={LINE} strokeWidth={compact ? .85 : 1.05}/>;
    default:
      return null;
  }
}

function HairFront({ spec, rig, size }: { spec: WoodblockPortraitSpec; rig: PortraitRig; size?: PortraitSize }) {
  const a = rig.anchors;
  const half = rig.faceWidth / 2 + 1.5;
  const left = rig.centerX - half;
  const right = rig.centerX + half;
  const compact = size === 48;

  if (spec.hairId === 'male-elder-sparse') {
    return <g fill="none" stroke={spec.hair} strokeWidth={compact ? 4 : 5} strokeLinecap="round">
      <path d={'M' + (left + 3) + ' ' + (a.templeLeft.y - 2) + ' Q' + (left + 8) + ' ' + (a.skullTop.y + 2) + ' ' + (rig.centerX - 7) + ' ' + a.skullTop.y}/>
      <path d={'M' + (right - 3) + ' ' + (a.templeRight.y - 2) + ' Q' + (right - 8) + ' ' + (a.skullTop.y + 2) + ' ' + (rig.centerX + 7) + ' ' + a.skullTop.y}/>
    </g>;
  }

  if (spec.hairId === 'male-elder-gray') {
    return <g><ellipse cx={rig.centerX + 10} cy={a.skullTop.y + 5} rx="7" ry="5.5" fill={spec.hair}/><path d={'M' + left + ' ' + (a.templeLeft.y + 1) + ' Q' + (left + 3) + ' ' + (a.skullTop.y - 1) + ' ' + rig.centerX + ' ' + a.skullTop.y + ' Q' + (right - 3) + ' ' + (a.skullTop.y - 1) + ' ' + right + ' ' + (a.templeRight.y + 1)} fill={spec.hair}/></g>;
  }

  if (spec.hairId.startsWith('male-')) {
    const bun = spec.hairId !== 'male-child-short';
    return <g fill={spec.hair}>
      {bun && <ellipse cx={rig.centerX + (spec.hairId === 'male-middle-tied' ? 8 : 0)} cy={a.skullTop.y - 1} rx={compact ? 5.5 : 6.5} ry={compact ? 4.5 : 5.5}/>}
      <path d={'M' + left + ' ' + (a.templeLeft.y + 2) + ' Q' + (left + 3) + ' ' + (a.skullTop.y - 2) + ' ' + rig.centerX + ' ' + a.skullTop.y + ' Q' + (right - 3) + ' ' + (a.skullTop.y - 2) + ' ' + right + ' ' + (a.templeRight.y + 2) + ' Q' + (rig.centerX + 9) + ' ' + (a.templeRight.y - 3) + ' ' + rig.centerX + ' ' + (a.templeRight.y - 6) + ' Q' + (rig.centerX - 9) + ' ' + (a.templeLeft.y - 3) + ' ' + left + ' ' + (a.templeLeft.y + 2) + 'Z'}/>
    </g>;
  }

  const child = spec.lifeStage === 'child';
  const elder = spec.lifeStage === 'elder';
  const tidy = spec.hairId === 'married-tidy-bun' || spec.hairId === 'middle-household-bun' || spec.hairId === 'adult-coiled-bun' || spec.hairId === 'worker-tight-bun';
  const sidePart = spec.hairId === 'young-halfbound-asym' || spec.hairId === 'young-low-tie';
  const hairlineTop = a.skullTop.y + (elder ? 3 : child ? 1 : 0);
  const partX = sidePart ? rig.centerX - 5 : rig.centerX;
  return <g fill={spec.hair}>
    <path d={'M' + left + ' ' + (a.templeLeft.y + 2) +
      ' Q' + (left + 4) + ' ' + hairlineTop + ' ' + partX + ' ' + (hairlineTop - 1) +
      ' Q' + (right - 4) + ' ' + hairlineTop + ' ' + right + ' ' + (a.templeRight.y + 2) +
      (tidy ? ' Q' + rig.centerX + ' ' + (a.templeLeft.y - 7) + ' ' + left + ' ' + (a.templeLeft.y + 2) :
        ' Q' + (partX + 4) + ' ' + (a.templeRight.y - 4) + ' ' + partX + ' ' + (a.templeRight.y - 7) +
        ' Q' + (partX - 4) + ' ' + (a.templeLeft.y - 4) + ' ' + left + ' ' + (a.templeLeft.y + 2)) + 'Z'}/>
    {elder && !compact && <path d={'M' + (left + 6) + ' ' + (hairlineTop + 2) + ' Q' + rig.centerX + ' ' + hairlineTop + ' ' + (right - 6) + ' ' + (hairlineTop + 2)} fill="none" stroke="#d6d1c8" strokeWidth="1" opacity=".45"/>}
  </g>;
}

function SideHair({ spec, rig, size }: { spec: WoodblockPortraitSpec; rig: PortraitRig; size?: PortraitSize }) {
  const a = rig.anchors;
  const compact = size === 48;

  if (spec.hairId === 'girl-double-bun' || spec.hairId === 'girl-ribbon-side') {
    return <g fill="none" stroke={spec.hair} strokeWidth={compact ? 2.8 : 3.6} strokeLinecap="round">
      <path d={'M' + a.sideburnLeft.x + ' ' + a.sideburnLeft.y + ' Q' + (a.earLeft.x + 1) + ' ' + (a.earLeft.y + 2) + ' ' + (a.jawLeft.x + 4) + ' ' + (a.jawLeft.y - 2)}/>
      <path d={'M' + a.sideburnRight.x + ' ' + a.sideburnRight.y + ' Q' + (a.earRight.x - 1) + ' ' + (a.earRight.y + 2) + ' ' + (a.jawRight.x - 4) + ' ' + (a.jawRight.y - 2)}/>
    </g>;
  }

  if (spec.hairId === 'young-halfbound-backfall' || spec.hairId === 'young-halfbound-asym') {
    const asymmetric = spec.hairId === 'young-halfbound-asym';
    return <g fill="none" stroke={spec.hair} strokeLinecap="round">
      <path d={'M' + a.sideburnLeft.x + ' ' + a.sideburnLeft.y + ' Q' + (a.earLeft.x + 2) + ' ' + (a.earLeft.y + 2) + ' ' + (a.jawLeft.x + 3) + ' ' + (a.jawLeft.y - 1)} strokeWidth={compact ? 2.4 : 3.1}/>
      <path d={'M' + a.sideburnRight.x + ' ' + a.sideburnRight.y + ' Q' + (a.earRight.x - 2) + ' ' + (a.earRight.y + 3) + ' ' + (a.jawRight.x - 3) + ' ' + (a.jawRight.y + (asymmetric ? 4 : -1))} strokeWidth={compact ? (asymmetric ? 3.1 : 2.4) : (asymmetric ? 4.1 : 3.1)}/>
    </g>;
  }

  if (spec.hairId === 'young-low-tie') {
    return <path d={'M' + a.sideburnRight.x + ' ' + a.sideburnRight.y + ' Q' + (a.earRight.x - 1) + ' ' + (a.earRight.y + 3) + ' ' + (a.jawRight.x - 3) + ' ' + a.jawRight.y} fill="none" stroke={spec.hair} strokeWidth={compact ? 2.3 : 3} strokeLinecap="round"/>;
  }

  if (spec.hairId === 'adult-low-bun' || spec.hairId === 'adult-coiled-bun' || spec.hairId === 'married-tidy-bun' || spec.hairId === 'middle-household-bun') {
    return <g fill="none" stroke={spec.hair} strokeWidth={compact ? 1.9 : 2.5} strokeLinecap="round">
      <path d={'M' + a.sideburnLeft.x + ' ' + a.sideburnLeft.y + ' Q' + (a.earLeft.x + 1) + ' ' + (a.earLeft.y + 1) + ' ' + (a.jawLeft.x + 5) + ' ' + (a.jawLeft.y - 4)}/>
      <path d={'M' + a.sideburnRight.x + ' ' + a.sideburnRight.y + ' Q' + (a.earRight.x - 1) + ' ' + (a.earRight.y + 1) + ' ' + (a.jawRight.x - 5) + ' ' + (a.jawRight.y - 4)}/>
    </g>;
  }

  return null;
}

function FaceDetails({ spec, rig }: { spec: WoodblockPortraitSpec; rig: PortraitRig }) {
  const cx = rig.centerX;
  const eyeSpan = rig.eyeSpan;
  const eyeY = rig.eyeY;
  const child = spec.lifeStage === 'child';
  const female = spec.gender === 'female';
  const browWidth = child ? 9 : female ? 10 : 11;
  const eyeWidth = child ? 7 : female ? 8 : 9;
  return <g fill="none" stroke={LINE} strokeLinecap="square">
    <path d={'M' + (cx - eyeSpan - browWidth / 2) + ' ' + rig.browY + ' Q' + (cx - eyeSpan) + ' ' + (rig.browY - (female ? 2.4 : 3.2)) + ' ' + (cx - eyeSpan + browWidth / 2) + ' ' + rig.browY} strokeWidth={child ? 2.1 : female ? 2.6 : 3.1}/>
    <path d={'M' + (cx + eyeSpan - browWidth / 2) + ' ' + rig.browY + ' Q' + (cx + eyeSpan) + ' ' + (rig.browY - (female ? 2.4 : 3.2)) + ' ' + (cx + eyeSpan + browWidth / 2) + ' ' + rig.browY} strokeWidth={child ? 2.1 : female ? 2.6 : 3.1}/>
    <path d={'M' + (cx - eyeSpan - eyeWidth / 2) + ' ' + eyeY + ' Q' + (cx - eyeSpan) + ' ' + (eyeY - (child ? 2 : 3)) + ' ' + (cx - eyeSpan + eyeWidth / 2) + ' ' + eyeY} strokeWidth={child ? 1.7 : 2.1}/>
    <path d={'M' + (cx + eyeSpan - eyeWidth / 2) + ' ' + eyeY + ' Q' + (cx + eyeSpan) + ' ' + (eyeY - (child ? 2 : 3)) + ' ' + (cx + eyeSpan + eyeWidth / 2) + ' ' + eyeY} strokeWidth={child ? 1.7 : 2.1}/>
    {!child && <><circle cx={cx - eyeSpan} cy={eyeY - .2} r=".8" fill={LINE}/><circle cx={cx + eyeSpan} cy={eyeY - .2} r=".8" fill={LINE}/></>}
    <path d={'M' + (cx - .5) + ' ' + (eyeY + 1) + ' Q' + (cx - (female ? 2 : 3)) + ' ' + (rig.noseY - 2) + ' ' + cx + ' ' + rig.noseY + ' Q' + (cx + (female ? 2.8 : 4)) + ' ' + (rig.noseY + 2) + ' ' + (cx + (female ? 5 : 6)) + ' ' + (rig.noseY - 1)} strokeWidth={child ? 1.2 : 1.65}/>
    <path d={'M' + (cx - (child ? 6 : female ? 7 : 8)) + ' ' + rig.mouthY + ' Q' + cx + ' ' + (rig.mouthY + (child ? 2.2 : 4)) + ' ' + (cx + (child ? 6 : female ? 7 : 8)) + ' ' + rig.mouthY} strokeWidth={child ? 1.4 : 1.9}/>
  </g>;
}

function Beard({ spec, rig }: { spec: WoodblockPortraitSpec; rig: PortraitRig }) {
  const cx = rig.centerX;
  const y = rig.mouthY - 2;
  if (spec.beardId === 'none') return null;
  if (spec.beardId === 'stubble') return <g fill={LINE} opacity=".62">{[-7, -3.5, 0, 3.5, 7].map((x) => <circle key={x} cx={cx + x} cy={rig.mouthY + 7 + Math.abs(x) * .15} r=".9"/>)}</g>;
  if (spec.beardId === 'trimmed-mustache') return <path d={'M' + (cx - 9) + ' ' + y + ' Q' + (cx - 4) + ' ' + (y - 4) + ' ' + cx + ' ' + y + ' Q' + (cx + 4) + ' ' + (y - 4) + ' ' + (cx + 9) + ' ' + y + ' Q' + (cx + 5) + ' ' + (y + 3) + ' ' + cx + ' ' + (y + 1) + ' Q' + (cx - 5) + ' ' + (y + 3) + ' ' + (cx - 9) + ' ' + y + 'Z'} fill={spec.hair}/>;
  if (spec.beardId === 'elder-sparse') return <g fill="none" stroke={spec.hair} strokeWidth="1.25" strokeLinecap="round">
    <path d={'M' + (cx - 8) + ' ' + y + ' Q' + (cx - 4) + ' ' + (y - 3) + ' ' + (cx - 1) + ' ' + y}/><path d={'M' + (cx + 1) + ' ' + y + ' Q' + (cx + 4) + ' ' + (y - 3) + ' ' + (cx + 8) + ' ' + y}/>
    <path d={'M' + (cx - 3) + ' ' + (y + 5) + ' Q' + cx + ' ' + (rig.chinY + 9) + ' ' + (cx + 3) + ' ' + (y + 5)}/>
  </g>;
  return <g fill={spec.hair}>
    <path d={'M' + (cx - 9) + ' ' + y + ' Q' + (cx - 4) + ' ' + (y - 4) + ' ' + cx + ' ' + y + ' Q' + (cx + 4) + ' ' + (y - 4) + ' ' + (cx + 9) + ' ' + y + ' Q' + (cx + 5) + ' ' + (y + 3) + ' ' + cx + ' ' + (y + 1) + ' Q' + (cx - 5) + ' ' + (y + 3) + ' ' + (cx - 9) + ' ' + y + 'Z'}/>
    <path d={'M' + (cx - 6) + ' ' + (y + 5) + ' Q' + cx + ' ' + (rig.chinY + 14) + ' ' + (cx + 6) + ' ' + (y + 5) + ' L' + (cx + 5) + ' ' + (rig.chinY + 10) + ' Q' + cx + ' ' + (rig.chinY + 18) + ' ' + (cx - 5) + ' ' + (rig.chinY + 10) + 'Z'} opacity=".9"/>
  </g>;
}

function AgeOverlay({ spec, rig }: { spec: WoodblockPortraitSpec; rig: PortraitRig }) {
  if (spec.ageOverlayId === 'none') return null;
  const deep = spec.ageOverlayId === 'elder-deep';
  const elder = spec.ageOverlayId.startsWith('elder');
  const cx = rig.centerX;
  return <g fill="none" stroke={LINE} strokeWidth={deep ? 1 : .8} opacity={deep ? .48 : elder ? .38 : .24}>
    <path d={'M' + (cx - rig.eyeSpan - 6) + ' ' + (rig.eyeY + 6) + ' Q' + (cx - rig.eyeSpan) + ' ' + (rig.eyeY + 8) + ' ' + (cx - rig.eyeSpan + 5) + ' ' + (rig.eyeY + 6)}/>
    <path d={'M' + (cx + rig.eyeSpan - 5) + ' ' + (rig.eyeY + 6) + ' Q' + (cx + rig.eyeSpan) + ' ' + (rig.eyeY + 8) + ' ' + (cx + rig.eyeSpan + 6) + ' ' + (rig.eyeY + 6)}/>
    {elder && <><path d={'M' + (cx - 10) + ' ' + (rig.mouthY + 5) + ' Q' + cx + ' ' + (rig.mouthY + 9) + ' ' + (cx + 10) + ' ' + (rig.mouthY + 5)}/><path d={'M' + (cx - rig.faceWidth * .34) + ' ' + (rig.noseY + 1) + ' Q' + (cx - rig.faceWidth * .27) + ' ' + rig.mouthY + ' ' + (cx - rig.faceWidth * .2) + ' ' + (rig.mouthY + 3)}/><path d={'M' + (cx + rig.faceWidth * .34) + ' ' + (rig.noseY + 1) + ' Q' + (cx + rig.faceWidth * .27) + ' ' + rig.mouthY + ' ' + (cx + rig.faceWidth * .2) + ' ' + (rig.mouthY + 3)}/></>}
    {deep && <path d={'M' + (cx - 9) + ' ' + (rig.browY - 7) + ' Q' + cx + ' ' + (rig.browY - 4) + ' ' + (cx + 9) + ' ' + (rig.browY - 7)}/>}
  </g>;
}

function Accessory({ spec, rig }: { spec: WoodblockPortraitSpec; rig: PortraitRig }) {
  const a = rig.anchors;
  if (spec.accessory === 'none') return null;

  if (spec.accessory === 'red-cord') {
    if (spec.hairId === 'girl-double-bun') {
      return <g fill="none" stroke="#9a4d43" strokeWidth="1.8" strokeLinecap="round">
        <path d={'M' + (a.crownCenter.x - 15) + ' ' + (a.crownCenter.y + 7) + ' Q' + (a.crownCenter.x - 10) + ' ' + (a.crownCenter.y + 11) + ' ' + (a.crownCenter.x - 5) + ' ' + (a.crownCenter.y + 7)}/>
        <path d={'M' + (a.crownCenter.x + 5) + ' ' + (a.crownCenter.y + 7) + ' Q' + (a.crownCenter.x + 10) + ' ' + (a.crownCenter.y + 11) + ' ' + (a.crownCenter.x + 15) + ' ' + (a.crownCenter.y + 7)}/>
      </g>;
    }
    return <path d={'M' + (a.bunLow.x - 6) + ' ' + (a.bunLow.y - 1) + ' Q' + a.bunLow.x + ' ' + (a.bunLow.y + 3) + ' ' + (a.bunLow.x + 6) + ' ' + (a.bunLow.y - 1)} fill="none" stroke="#9a4d43" strokeWidth="1.7"/>;
  }

  if (spec.accessory === 'cloth-knot') {
    return <g fill="#8d6355" stroke={LINE} strokeWidth=".7">
      <path d={'M' + (a.crownBack.x - 2) + ' ' + (a.crownBack.y + 4) + ' l-7 5 l6 2Z'}/>
      <path d={'M' + (a.crownBack.x + 2) + ' ' + (a.crownBack.y + 4) + ' l7 5 l-6 2Z'}/>
    </g>;
  }

  if (spec.accessory === 'headcloth') {
    return <g fill="none" stroke="#8b775c" strokeLinecap="round">
      <path d={'M' + (a.occipitalLeft.x + 2) + ' ' + (a.occipitalLeft.y + 1) + ' Q' + a.napeCenter.x + ' ' + (a.napeCenter.y - 7) + ' ' + (a.occipitalRight.x - 2) + ' ' + (a.occipitalRight.y + 1)} strokeWidth="3.8"/>
      <path d={'M' + (a.bunLow.x - 3) + ' ' + (a.bunLow.y + 1) + ' l7 7'} strokeWidth="2.2"/>
    </g>;
  }

  const pinColor = spec.accessory === 'wood-pin' ? '#7e5a3d' : spec.accessory === 'jade-pin' ? '#bca36d' : '#9f855a';
  const pinY = spec.hairId.includes('low-bun') || spec.hairId === 'worker-tight-bun' ? a.bunLow.y - 2 : a.bunMid.y - 2;

  if (spec.accessory === 'double-prong-pin') {
    return <g stroke={pinColor} strokeLinecap="round">
      <path d={'M' + (a.bunMid.x - 8) + ' ' + (pinY - 3) + ' L' + (a.bunMid.x + 7) + ' ' + (pinY + 2)} strokeWidth="1.5"/>
      <path d={'M' + (a.bunMid.x - 7) + ' ' + (pinY + 1) + ' L' + (a.bunMid.x + 7) + ' ' + (pinY + 5)} strokeWidth="1.2"/>
    </g>;
  }

  return <g>
    <path d={'M' + (rig.centerX + 4) + ' ' + (pinY - 3) + ' L' + (rig.centerX + 26) + ' ' + (pinY + 2)} stroke={pinColor} strokeWidth={spec.accessory === 'wood-pin' ? 1.7 : 1.5} strokeLinecap="round"/>
    {spec.accessory === 'jade-pin' && <circle cx={rig.centerX + 27} cy={pinY + 2.2} r="2.1" fill="#788f72" stroke={LINE} strokeWidth=".6"/>}
    {spec.accessory === 'simple-hairpin' && <circle cx={rig.centerX + 26} cy={pinY + 2} r="1.5" fill={pinColor}/>}
  </g>;
}

export function WoodblockPortrait({
  spec,
  size,
  label,
}: {
  spec: WoodblockPortraitSpec;
  size?: PortraitSize;
  label?: string;
}) {
  const rig = rigFor(spec);
  const half = rig.faceWidth / 2;
  const bg = BACKGROUNDS[residentIndex(spec) % BACKGROUNDS.length];
  const compact = size === 48;
  const femaleHair = spec.gender === 'female' ? femaleHairDefinition(spec.hairId) : undefined;

  return <div
    className="portrait-style-portrait portrait-style-portrait--woodblock-v6"
    data-resident-id={spec.id}
    data-life-stage={spec.lifeStage}
    data-gender={spec.gender}
    data-wealth={spec.wealth}
    data-hair-id={spec.hairId}
    data-hair-culture={spec.gender === 'female' ? 'chinese-historic' : 'general'}
    data-hair-culture-tag={femaleHair?.cultureTag ?? 'n/a'}
    data-hair-anchor-mode={femaleHair?.anchorMode ?? 'rigged'}
    data-hair-rig-state="ok"
    data-hair-cultural-state={spec.gender === 'female' ? 'ok' : 'n/a'}
    data-art-system="woodblock-v7"
    data-halo="none"
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <svg viewBox="0 15 120 120" focusable="false">
      <rect width="120" height="150" fill={bg}/>
      <HairBack spec={spec} rig={rig} size={size}/>
      <Outfit spec={spec} rig={rig}/>
      <path d={'M' + rig.anchors.neckLeft.x + ' ' + (rig.chinY - 3) + ' H' + rig.anchors.neckRight.x + ' L' + (rig.anchors.neckRight.x + 1.2) + ' 102 Q60 106 ' + (rig.anchors.neckLeft.x - 1.2) + ' 102Z'} fill={spec.skin}/>
      <ellipse cx={rig.centerX - half - 1.4} cy={rig.earY} rx={spec.lifeStage === 'child' ? 3.6 : 4.3} ry={spec.lifeStage === 'child' ? 5.2 : 6} fill={spec.skin} stroke={LINE} strokeWidth={compact ? 1.8 : 2.2}/>
      <ellipse cx={rig.centerX + half + 1.4} cy={rig.earY} rx={spec.lifeStage === 'child' ? 3.6 : 4.3} ry={spec.lifeStage === 'child' ? 5.2 : 6} fill={spec.skin} stroke={LINE} strokeWidth={compact ? 1.8 : 2.2}/>
      <path d={facePath(rig, spec)} fill={spec.skin} stroke={LINE} strokeWidth={compact ? 2.2 : 2.8} strokeLinejoin="round"/>
      <FaceDetails spec={spec} rig={rig}/>
      <AgeOverlay spec={spec} rig={rig}/>
      <SideHair spec={spec} rig={rig} size={size}/>
      <HairFront spec={spec} rig={rig} size={size}/>
      <Beard spec={spec} rig={rig}/>
      <Accessory spec={spec} rig={rig}/>
      <g stroke={LINE} strokeWidth=".8" opacity=".24">
        <path d="M20 133 L31 121"/><path d="M86 127 L99 114"/>
      </g>
    </svg>
  </div>;
}

function cloneSpec(base: WoodblockPortraitSpec, patch: Partial<WoodblockPortraitSpec>): WoodblockPortraitSpec {
  return { ...base, ...patch };
}

const girlFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-girl-child-poor')!;
const youthFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-youth-poor')!;
const adultFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-adult-plain')!;
const middleFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-middle-comfortable')!;
const elderFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-elder-wealthy')!;

export const HAIR_REVIEW_SAMPLES: WoodblockPortraitSpec[] = [
  cloneSpec(girlFemale, { id: 'hair-review-girl-double-bun', name: '女童双小髻', hairId: 'girl-double-bun', accessory: 'red-cord' }),
  cloneSpec(girlFemale, { id: 'hair-review-girl-ribbon-side', name: '女童侧束布结', hairId: 'girl-ribbon-side', accessory: 'cloth-knot' }),
  cloneSpec(youthFemale, { id: 'hair-review-young-halfbound-backfall', name: '少女半束后披', faceProfileId: 'female-youth-oval-soft', hairId: 'young-halfbound-backfall', accessory: 'cloth-knot' }),
  cloneSpec(youthFemale, { id: 'hair-review-young-halfbound-asym', name: '少女偏侧半束', faceProfileId: 'female-youth-narrow-gentle', hairId: 'young-halfbound-asym', accessory: 'wood-pin' }),
  cloneSpec(adultFemale, { id: 'hair-review-adult-low-bun', name: '成年低髻', faceProfileId: 'female-adult-oval-stable', hairId: 'adult-low-bun', accessory: 'wood-pin' }),
  cloneSpec(adultFemale, { id: 'hair-review-adult-coiled-bun', name: '成年盘发', faceProfileId: 'female-adult-long-soft', hairId: 'adult-coiled-bun', accessory: 'simple-hairpin', wealth: 'comfortable', wealthLabel: '殷实' }),
  cloneSpec(middleFemale, { id: 'hair-review-middle-household-bun', name: '中年当家妇人髻', hairId: 'middle-household-bun', accessory: 'double-prong-pin' }),
  cloneSpec(elderFemale, { id: 'hair-review-elder-gray-low-bun', name: '老年花白低髻', hairId: 'elder-gray-low-bun', accessory: 'jade-pin' }),
];



const wealthBase = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-male-adult-plain')!;
export const WEALTH_REVIEW_SAMPLES: WoodblockPortraitSpec[] = [
  cloneSpec(wealthBase, { id: 'wealth-poor', name: '贫寒', wealth: 'poor', wealthLabel: '贫寒', outfitId: 'poor-male', cloth: '#725d48', accessory: 'none' }),
  cloneSpec(wealthBase, { id: 'wealth-plain', name: '普通', wealth: 'plain', wealthLabel: '普通', outfitId: 'plain-male', cloth: '#5d6870', accessory: 'none' }),
  cloneSpec(wealthBase, { id: 'wealth-comfortable', name: '殷实', wealth: 'comfortable', wealthLabel: '殷实', outfitId: 'comfortable-male', cloth: '#4e6156', accessory: 'wood-pin' }),
  cloneSpec(wealthBase, { id: 'wealth-wealthy', name: '富裕', wealth: 'wealthy', wealthLabel: '富裕', outfitId: 'wealthy-male', cloth: '#684b49', accessory: 'jade-pin' }),
];

const crowdPalette = ['#74614d', '#58675b', '#607078', '#6b6259', '#714c48', '#465b50'];
export const CROWD_REVIEW_SAMPLES: WoodblockPortraitSpec[] = Array.from({ length: 32 }, (_, index) => {
  const base = GOLDEN_PORTRAITS[index % GOLDEN_PORTRAITS.length];
  const alternateFemaleHair: HairAssetId[] = ['young-halfbound-backfall', 'young-halfbound-asym', 'young-low-tie', 'adult-low-bun', 'adult-coiled-bun', 'married-tidy-bun', 'middle-household-bun', 'elder-gray-low-bun', 'elder-tight-gray-bun', 'worker-tight-bun'];
  const patch: Partial<WoodblockPortraitSpec> = {
    id: 'crowd-' + String(index + 1).padStart(2, '0'),
    name: '',
    cloth: crowdPalette[index % crowdPalette.length],
  };
  if (base.gender === 'female' && base.lifeStage !== 'child') {
    patch.hairId = alternateFemaleHair[(index + residentIndex(base)) % alternateFemaleHair.length];
  }
  return cloneSpec(base, patch);
});
