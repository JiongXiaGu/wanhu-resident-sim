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
  | 'female-child-round'
  | 'female-youth-oval'
  | 'female-adult-narrow'
  | 'female-middle-long'
  | 'female-elder-slim'
  | 'female-worker-broad';

export type HairAssetId =
  | 'male-child-short'
  | 'male-youth-tied'
  | 'male-adult-tied'
  | 'male-middle-tied'
  | 'male-elder-sparse'
  | 'male-elder-gray'
  | 'female-child-side'
  | 'female-youth-long'
  | 'female-youth-long-side'
  | 'female-adult-halfbound'
  | 'female-middle-lowbun'
  | 'female-elder-graybun'
  | 'female-worker-tight';

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
  accessory: 'none' | 'ribbon' | 'hairpin' | 'jade-pin' | 'headcloth';
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

const LINE = '#271f1a';
const BACKGROUNDS = ['#c8aa70', '#d0b27a', '#c4a268', '#d4b77f'];

const FACE_PROFILES: Record<FaceProfileId, FaceProfile> = {
  'male-child-round': { faceWidth: 42, topY: 31, chinY: 82, jawWidth: 36, eyeY: 52, eyeSpan: 9.4, browY: 45, noseY: 61, mouthY: 69, earY: 55, neckHalf: 5, shoulderHalf: 29 },
  'male-youth-slim': { faceWidth: 41, topY: 24, chinY: 91, jawWidth: 28, eyeY: 53, eyeSpan: 10, browY: 46, noseY: 65, mouthY: 76, earY: 56, neckHalf: 6.1, shoulderHalf: 43 },
  'male-adult-average': { faceWidth: 46, topY: 25, chinY: 91, jawWidth: 34, eyeY: 54, eyeSpan: 10.5, browY: 46, noseY: 66, mouthY: 76, earY: 57, neckHalf: 6.8, shoulderHalf: 45 },
  'male-middle-broad': { faceWidth: 50, topY: 26, chinY: 92, jawWidth: 39, eyeY: 55, eyeSpan: 11, browY: 47, noseY: 67, mouthY: 77, earY: 58, neckHalf: 7.5, shoulderHalf: 47 },
  'male-elder-slim': { faceWidth: 43, topY: 26, chinY: 95, jawWidth: 29, eyeY: 55, eyeSpan: 9.8, browY: 48, noseY: 68, mouthY: 79, earY: 58, neckHalf: 6.1, shoulderHalf: 42 },
  'male-elder-thin': { faceWidth: 39, topY: 27, chinY: 97, jawWidth: 25, eyeY: 56, eyeSpan: 9.2, browY: 49, noseY: 69, mouthY: 80, earY: 59, neckHalf: 5.6, shoulderHalf: 38 },
  'female-child-round': { faceWidth: 40, topY: 31, chinY: 82, jawWidth: 34, eyeY: 52, eyeSpan: 9.4, browY: 45, noseY: 61, mouthY: 69, earY: 55, neckHalf: 4.4, shoulderHalf: 27 },
  'female-youth-oval': { faceWidth: 37, topY: 25, chinY: 87, jawWidth: 25, eyeY: 52, eyeSpan: 9.4, browY: 45, noseY: 63, mouthY: 73, earY: 55, neckHalf: 4.8, shoulderHalf: 37 },
  'female-adult-narrow': { faceWidth: 36, topY: 24, chinY: 90, jawWidth: 23, eyeY: 53, eyeSpan: 9.4, browY: 46, noseY: 65, mouthY: 75, earY: 56, neckHalf: 5, shoulderHalf: 38 },
  'female-middle-long': { faceWidth: 38, topY: 25, chinY: 93, jawWidth: 25, eyeY: 54, eyeSpan: 9.6, browY: 47, noseY: 67, mouthY: 77, earY: 57, neckHalf: 5.3, shoulderHalf: 40 },
  'female-elder-slim': { faceWidth: 35, topY: 27, chinY: 96, jawWidth: 22, eyeY: 55, eyeSpan: 9, browY: 48, noseY: 68, mouthY: 79, earY: 58, neckHalf: 4.9, shoulderHalf: 37 },
  'female-worker-broad': { faceWidth: 43, topY: 26, chinY: 92, jawWidth: 31, eyeY: 54, eyeSpan: 10, browY: 46, noseY: 66, mouthY: 76, earY: 57, neckHalf: 5.8, shoulderHalf: 42 },
};

export const GOLDEN_PORTRAITS: WoodblockPortraitSpec[] = [
  { id: 'golden-boy-child-poor', name: '阿石', age: 8, stageLabel: '男童', gender: 'male', lifeStage: 'child', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['儿童', '朴素'], faceProfileId: 'male-child-round', hairId: 'male-child-short', beardId: 'none', outfitId: 'poor-child', ageOverlayId: 'none', accessory: 'none', skin: '#cd9470', hair: '#2a2421', cloth: '#725d48' },
  { id: 'golden-male-youth-poor', name: '沈砚', age: 22, stageLabel: '青年男子', gender: 'male', lifeStage: 'youth', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['青年', '清瘦'], faceProfileId: 'male-youth-slim', hairId: 'male-youth-tied', beardId: 'none', outfitId: 'poor-male', ageOverlayId: 'none', accessory: 'none', skin: '#c9916f', hair: '#2b2522', cloth: '#74614d' },
  { id: 'golden-male-adult-plain', name: '周朴', age: 36, stageLabel: '成年男子', gender: 'male', lifeStage: 'adult', wealth: 'plain', wealthLabel: '普通', roleTags: ['成年', '日常'], faceProfileId: 'male-adult-average', hairId: 'male-adult-tied', beardId: 'stubble', outfitId: 'plain-male', ageOverlayId: 'none', accessory: 'none', skin: '#b97d5f', hair: '#292421', cloth: '#5d6870' },
  { id: 'golden-male-middle-comfortable', name: '陆川', age: 51, stageLabel: '中年男子', gender: 'male', lifeStage: 'middle', wealth: 'comfortable', wealthLabel: '殷实', roleTags: ['中年', '体面'], faceProfileId: 'male-middle-broad', hairId: 'male-middle-tied', beardId: 'trimmed-mustache', outfitId: 'comfortable-male', ageOverlayId: 'middle-soft', accessory: 'jade-pin', skin: '#b57a5c', hair: '#45403b', cloth: '#465d53' },
  { id: 'golden-male-elder-wealthy', name: '顾伯衡', age: 69, stageLabel: '老年男子', gender: 'male', lifeStage: 'elder', wealth: 'wealthy', wealthLabel: '富裕', roleTags: ['老人', '富裕'], faceProfileId: 'male-elder-slim', hairId: 'male-elder-gray', beardId: 'elder-long', outfitId: 'wealthy-male', ageOverlayId: 'elder-lines', accessory: 'jade-pin', skin: '#c08b6b', hair: '#8a857c', cloth: '#664c4b' },
  { id: 'golden-girl-child-poor', name: '小禾', age: 9, stageLabel: '女童', gender: 'female', lifeStage: 'child', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['儿童', '女孩'], faceProfileId: 'female-child-round', hairId: 'female-child-side', beardId: 'none', outfitId: 'poor-child', ageOverlayId: 'none', accessory: 'ribbon', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-youth-poor', name: '阿禾', age: 19, stageLabel: '青年女子', gender: 'female', lifeStage: 'youth', wealth: 'poor', wealthLabel: '贫寒', roleTags: ['青年', '长发'], faceProfileId: 'female-youth-oval', hairId: 'female-youth-long', beardId: 'none', outfitId: 'poor-female', ageOverlayId: 'none', accessory: 'ribbon', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-adult-plain', name: '林月娘', age: 33, stageLabel: '成年女子', gender: 'female', lifeStage: 'adult', wealth: 'plain', wealthLabel: '普通', roleTags: ['成年', '整洁'], faceProfileId: 'female-adult-narrow', hairId: 'female-adult-halfbound', beardId: 'none', outfitId: 'plain-female', ageOverlayId: 'none', accessory: 'hairpin', skin: '#c98e6c', hair: '#2b2524', cloth: '#66727a' },
  { id: 'golden-female-middle-comfortable', name: '许兰英', age: 49, stageLabel: '中年女子', gender: 'female', lifeStage: 'middle', wealth: 'comfortable', wealthLabel: '殷实', roleTags: ['中年', '当家'], faceProfileId: 'female-middle-long', hairId: 'female-middle-lowbun', beardId: 'none', outfitId: 'comfortable-female', ageOverlayId: 'middle-soft', accessory: 'hairpin', skin: '#b97e61', hair: '#4a433e', cloth: '#596555' },
  { id: 'golden-female-elder-wealthy', name: '沈老夫人', age: 68, stageLabel: '老年女子', gender: 'female', lifeStage: 'elder', wealth: 'wealthy', wealthLabel: '富裕', roleTags: ['老人', '花白发'], faceProfileId: 'female-elder-slim', hairId: 'female-elder-graybun', beardId: 'none', outfitId: 'wealthy-female', ageOverlayId: 'elder-deep', accessory: 'jade-pin', skin: '#c28d6d', hair: '#989188', cloth: '#6c555f' },
  { id: 'golden-female-worker-plain', name: '赵婶', age: 44, stageLabel: '劳作妇人', gender: 'female', lifeStage: 'middle', wealth: 'plain', wealthLabel: '普通', roleTags: ['劳作', '利落'], faceProfileId: 'female-worker-broad', hairId: 'female-worker-tight', beardId: 'none', outfitId: 'worker-female', ageOverlayId: 'middle-soft', accessory: 'headcloth', skin: '#b67a5d', hair: '#3c3531', cloth: '#6b6252' },
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
  const medium = size === 64;
  const strokeWidth = compact ? 5.8 : medium ? 6.4 : 7.4;
  const leftShoulderX = a.shoulderLeft.x + 7;
  const rightShoulderX = a.shoulderRight.x - 7;
  switch (spec.hairId) {
    case 'female-youth-long':
      return <g fill={spec.hair} stroke={LINE} strokeWidth={compact ? .9 : 1.2} strokeLinejoin="round">
        <path d={'M' + a.templeLeft.x + ' ' + (a.templeLeft.y - 2) +
          ' C' + (a.earLeft.x - 5) + ' ' + (a.earLeft.y + 7) + ' ' + (leftShoulderX - 5) + ' 92 ' + leftShoulderX + ' 119' +
          ' L' + (leftShoulderX + (compact ? 5 : 8)) + ' 117' +
          ' C' + (leftShoulderX + 9) + ' 91 ' + (a.earLeft.x + 5) + ' ' + (a.earLeft.y + 8) + ' ' + (a.templeLeft.x + 5) + ' ' + (a.templeLeft.y + 3) + 'Z'}/>
        <path d={'M' + a.templeRight.x + ' ' + (a.templeRight.y - 2) +
          ' C' + (a.earRight.x + 5) + ' ' + (a.earRight.y + 7) + ' ' + (rightShoulderX + 5) + ' 92 ' + rightShoulderX + ' 119' +
          ' L' + (rightShoulderX - (compact ? 5 : 8)) + ' 117' +
          ' C' + (rightShoulderX - 9) + ' 91 ' + (a.earRight.x - 5) + ' ' + (a.earRight.y + 8) + ' ' + (a.templeRight.x - 5) + ' ' + (a.templeRight.y + 3) + 'Z'}/>
        {!compact && <g fill="none" stroke="#665248" strokeWidth=".8" opacity=".24"><path d={'M' + (a.templeLeft.x + 2) + ' ' + (a.templeLeft.y + 5) + ' Q' + (a.earLeft.x + 1) + ' 79 ' + (leftShoulderX + 4) + ' 111'}/><path d={'M' + (a.templeRight.x - 2) + ' ' + (a.templeRight.y + 5) + ' Q' + (a.earRight.x - 1) + ' 79 ' + (rightShoulderX - 4) + ' 111'}/></g>}
      </g>;
    case 'female-youth-long-side':
      return <g fill={spec.hair} stroke={LINE} strokeWidth={compact ? .9 : 1.2} strokeLinejoin="round">
        <path d={'M' + a.templeLeft.x + ' ' + a.templeLeft.y +
          ' C' + (a.earLeft.x - 3) + ' 72 ' + (leftShoulderX - 2) + ' 94 ' + leftShoulderX + ' 116' +
          ' L' + (leftShoulderX + 6) + ' 114 C' + (leftShoulderX + 7) + ' 91 ' + (a.earLeft.x + 4) + ' 72 ' + (a.templeLeft.x + 5) + ' ' + (a.templeLeft.y + 4) + 'Z'}/>
        <path d={'M' + (a.templeRight.x - 2) + ' ' + (a.templeRight.y - 2) +
          ' C' + (a.earRight.x + 7) + ' 70 ' + (rightShoulderX + 4) + ' 98 ' + (rightShoulderX + 1) + ' 124' +
          ' L' + (rightShoulderX - 9) + ' 120 C' + (rightShoulderX - 7) + ' 94 ' + (a.earRight.x - 4) + ' 72 ' + (a.templeRight.x - 6) + ' ' + (a.templeRight.y + 4) + 'Z'}/>
      </g>;
    case 'female-adult-halfbound':
      return <g fill={spec.hair} stroke={LINE} strokeWidth={compact ? .85 : 1.1} strokeLinejoin="round">
        <ellipse cx={a.skullTop.x + 10} cy={a.skullTop.y + 4} rx="7.5" ry="6"/>
        <path d={'M' + a.templeLeft.x + ' ' + a.templeLeft.y +
          ' C' + (a.earLeft.x - 3) + ' 72 ' + (leftShoulderX - 1) + ' 96 ' + (leftShoulderX + 2) + ' 115' +
          ' L' + (leftShoulderX + 8) + ' 112 C' + (leftShoulderX + 8) + ' 91 ' + (a.earLeft.x + 4) + ' 73 ' + (a.templeLeft.x + 5) + ' ' + (a.templeLeft.y + 4) + 'Z'}/>
        <path d={'M' + a.templeRight.x + ' ' + a.templeRight.y +
          ' C' + (a.earRight.x + 3) + ' 72 ' + (rightShoulderX + 1) + ' 96 ' + (rightShoulderX - 2) + ' 115' +
          ' L' + (rightShoulderX - 8) + ' 112 C' + (rightShoulderX - 8) + ' 91 ' + (a.earRight.x - 4) + ' 73 ' + (a.templeRight.x - 5) + ' ' + (a.templeRight.y + 4) + 'Z'}/>
      </g>;
    case 'female-middle-lowbun':
      return <ellipse cx={a.earRight.x - 1} cy={a.earRight.y + 15} rx={compact ? 7 : 9} ry={compact ? 6 : 8} fill={spec.hair} stroke={LINE} strokeWidth="1.6"/>;
    case 'female-elder-graybun':
      return <ellipse cx={a.skullTop.x + 11} cy={a.skullTop.y + 5} rx={compact ? 7 : 9.5} ry={compact ? 5.5 : 7.2} fill={spec.hair} stroke={LINE} strokeWidth="1.6"/>;
    case 'female-worker-tight':
      return <ellipse cx={a.earRight.x - 2} cy={a.earRight.y + 10} rx={compact ? 6 : 7.5} ry={compact ? 5 : 6.5} fill={spec.hair}/>;
    case 'female-child-side':
      return <g fill="none" stroke={spec.hair} strokeWidth={compact ? 4.8 : 5.8} strokeLinecap="round">
        <path d={'M' + a.templeLeft.x + ' ' + a.templeLeft.y + ' Q' + (a.earLeft.x - 2) + ' 70 ' + (a.jawLeft.x - 3) + ' 82'}/>
        <path d={'M' + a.templeRight.x + ' ' + a.templeRight.y + ' Q' + (a.earRight.x + 2) + ' 70 ' + (a.jawRight.x + 3) + ' 82'}/>
      </g>;
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

  const centerPart = spec.hairId === 'female-youth-long' || spec.hairId === 'female-adult-halfbound';
  return <g fill={spec.hair}>
    <path d={'M' + left + ' ' + (a.templeLeft.y + 2) + ' Q' + (left + 4) + ' ' + (a.skullTop.y - 2) + ' ' + rig.centerX + ' ' + a.skullTop.y + ' Q' + (right - 4) + ' ' + (a.skullTop.y - 2) + ' ' + right + ' ' + (a.templeRight.y + 2) +
      (centerPart ? ' Q' + (rig.centerX + 6) + ' ' + (a.templeRight.y - 3) + ' ' + (rig.centerX + 2) + ' ' + (a.templeRight.y - 7) + ' L' + rig.centerX + ' ' + (a.templeRight.y - 1) + ' L' + (rig.centerX - 2) + ' ' + (a.templeLeft.y - 7) + ' Q' + (rig.centerX - 6) + ' ' + (a.templeLeft.y - 3) + ' ' + left + ' ' + (a.templeLeft.y + 2) : ' Q' + rig.centerX + ' ' + (a.templeLeft.y - 7) + ' ' + left + ' ' + (a.templeLeft.y + 2)) + 'Z'}/>
  </g>;
}

function SideHair({ spec, rig, size }: { spec: WoodblockPortraitSpec; rig: PortraitRig; size?: PortraitSize }) {
  const a = rig.anchors;
  const compact = size === 48;
  if (spec.hairId === 'female-youth-long' || spec.hairId === 'female-youth-long-side' || spec.hairId === 'female-adult-halfbound') {
    const width = compact ? 3.2 : 4.1;
    return <g fill="none" stroke={spec.hair} strokeWidth={width} strokeLinecap="round">
      <path d={'M' + (a.templeLeft.x + 2) + ' ' + (a.templeLeft.y + 1) + ' Q' + (a.earLeft.x + 1) + ' ' + (a.earLeft.y + 7) + ' ' + (a.jawLeft.x + 1) + ' ' + (a.jawLeft.y + 4)}/>
      <path d={'M' + (a.templeRight.x - 2) + ' ' + (a.templeRight.y + 1) + ' Q' + (a.earRight.x - 1) + ' ' + (a.earRight.y + 7) + ' ' + (a.jawRight.x - 1) + ' ' + (a.jawRight.y + 4)}/>
    </g>;
  }
  if (spec.hairId === 'female-child-side') {
    return <g fill="none" stroke={spec.hair} strokeWidth={compact ? 3.8 : 4.8} strokeLinecap="round">
      <path d={'M' + (a.templeLeft.x + 2) + ' ' + (a.templeLeft.y + 2) + ' Q' + a.earLeft.x + ' ' + (a.earLeft.y + 5) + ' ' + (a.jawLeft.x + 2) + ' ' + a.jawLeft.y}/>
      <path d={'M' + (a.templeRight.x - 2) + ' ' + (a.templeRight.y + 2) + ' Q' + a.earRight.x + ' ' + (a.earRight.y + 5) + ' ' + (a.jawRight.x - 2) + ' ' + a.jawRight.y}/>
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
  if (spec.accessory === 'none') return null;
  if (spec.accessory === 'ribbon') return <g><path d={'M' + (rig.centerX - 13) + ' ' + (rig.topY + 7) + ' Q' + rig.centerX + ' ' + (rig.topY + 12) + ' ' + (rig.centerX + 13) + ' ' + (rig.topY + 7)} fill="none" stroke="#8c5d56" strokeWidth="2.2"/><path d={'M' + (rig.centerX + 10) + ' ' + (rig.topY + 8) + ' l7 8 l-5 -1Z'} fill="#8c5d56"/></g>;
  if (spec.accessory === 'headcloth') return <path d={'M' + (rig.centerX - rig.faceWidth / 2) + ' ' + (rig.topY + 5) + ' Q' + rig.centerX + ' ' + (rig.topY + 1) + ' ' + (rig.centerX + rig.faceWidth / 2) + ' ' + (rig.topY + 5)} fill="none" stroke="#8b775c" strokeWidth="5.5" strokeLinecap="round"/>;
  const metal = spec.accessory === 'jade-pin' ? '#bca36d' : '#a58d62';
  return <g><path d={'M' + (rig.centerX - 10) + ' ' + (rig.topY - 1) + ' L' + (rig.centerX + 13) + ' ' + (rig.topY - 8)} stroke={metal} strokeWidth="1.8" strokeLinecap="round"/>{spec.accessory === 'jade-pin' && <circle cx={rig.centerX + 14} cy={rig.topY - 8.5} r="2.3" fill="#788f72"/>}</g>;
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

  return <div
    className="portrait-style-portrait portrait-style-portrait--woodblock-v6"
    data-resident-id={spec.id}
    data-life-stage={spec.lifeStage}
    data-gender={spec.gender}
    data-wealth={spec.wealth}
    data-hair-id={spec.hairId}
    data-hair-anchor-mode={spec.hairId.includes('long') || spec.hairId.includes('halfbound') ? 'temple-ear-shoulder' : 'rigged'}
    data-hair-rig-state="ok"
    data-art-system="woodblock-v6"
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

const youthFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-youth-poor')!;
const adultFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-adult-plain')!;
const middleFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-middle-comfortable')!;
const elderFemale = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-female-elder-wealthy')!;

export const HAIR_REVIEW_SAMPLES: WoodblockPortraitSpec[] = [
  cloneSpec(GOLDEN_PORTRAITS.find((item) => item.id === 'golden-girl-child-poor')!, { id: 'hair-review-child-side', name: '女童侧发' }),
  cloneSpec(youthFemale, { id: 'hair-review-youth-long', name: '青年双侧长发', hairId: 'female-youth-long' }),
  cloneSpec(youthFemale, { id: 'hair-review-youth-side', name: '青年偏侧长发', hairId: 'female-youth-long-side', accessory: 'hairpin' }),
  cloneSpec(adultFemale, { id: 'hair-review-halfbound', name: '成年半束发', hairId: 'female-adult-halfbound' }),
  cloneSpec(middleFemale, { id: 'hair-review-lowbun', name: '中年低髻', hairId: 'female-middle-lowbun' }),
  cloneSpec(elderFemale, { id: 'hair-review-graybun', name: '老年花白髻', hairId: 'female-elder-graybun' }),
];

const wealthBase = GOLDEN_PORTRAITS.find((item) => item.id === 'golden-male-adult-plain')!;
export const WEALTH_REVIEW_SAMPLES: WoodblockPortraitSpec[] = [
  cloneSpec(wealthBase, { id: 'wealth-poor', name: '贫寒', wealth: 'poor', wealthLabel: '贫寒', outfitId: 'poor-male', cloth: '#725d48', accessory: 'none' }),
  cloneSpec(wealthBase, { id: 'wealth-plain', name: '普通', wealth: 'plain', wealthLabel: '普通', outfitId: 'plain-male', cloth: '#5d6870', accessory: 'none' }),
  cloneSpec(wealthBase, { id: 'wealth-comfortable', name: '殷实', wealth: 'comfortable', wealthLabel: '殷实', outfitId: 'comfortable-male', cloth: '#4e6156', accessory: 'hairpin' }),
  cloneSpec(wealthBase, { id: 'wealth-wealthy', name: '富裕', wealth: 'wealthy', wealthLabel: '富裕', outfitId: 'wealthy-male', cloth: '#684b49', accessory: 'jade-pin' }),
];

const crowdPalette = ['#74614d', '#58675b', '#607078', '#6b6259', '#714c48', '#465b50'];
export const CROWD_REVIEW_SAMPLES: WoodblockPortraitSpec[] = Array.from({ length: 32 }, (_, index) => {
  const base = GOLDEN_PORTRAITS[index % GOLDEN_PORTRAITS.length];
  const alternateFemaleHair: HairAssetId[] = ['female-youth-long', 'female-youth-long-side', 'female-adult-halfbound', 'female-middle-lowbun', 'female-elder-graybun', 'female-worker-tight'];
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
