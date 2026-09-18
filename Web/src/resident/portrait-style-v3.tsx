import { useId } from 'react';

export type PortraitStyleId = 'paper-cut' | 'ink-flat' | 'woodblock' | 'painterly';
export type PortraitGender = 'male' | 'female';
export type PortraitWealth = 'poor' | 'plain' | 'comfortable' | 'wealthy';

export type GoldenPortraitSpec = {
  id: string;
  name: string;
  age: number;
  stageLabel: string;
  gender: PortraitGender;
  wealth: PortraitWealth;
  wealthLabel: string;
  faceAsset: FaceAssetId;
  hairAsset: HairAssetId;
  beard: 'none' | 'short' | 'mustache' | 'elder';
  accessory: 'none' | 'ribbon' | 'hairpin' | 'jade-pin';
  skin: string;
  hair: string;
  cloth: string;
};

type FaceAssetId =
  | 'm-young-long'
  | 'm-adult-square'
  | 'm-middle-broad'
  | 'm-elder-oval'
  | 'f-young-round'
  | 'f-adult-oval'
  | 'f-middle-broad'
  | 'f-elder-long';

type HairAssetId =
  | 'm-high-tied'
  | 'm-short-angular'
  | 'm-low-tied'
  | 'm-thinning'
  | 'f-double-braid'
  | 'f-long-center'
  | 'f-low-bun'
  | 'f-elder-tied';

type FaceAsset = {
  path: string;
  earY: number;
  earRx: number;
  earRy: number;
  neckHalf: number;
  leftEye: string;
  rightEye: string;
  leftBrow: string;
  rightBrow: string;
  nose: string;
  mouth: string;
  cheekLeft?: string;
  cheekRight?: string;
};

export const PORTRAIT_STYLES: Array<{
  id: PortraitStyleId;
  name: string;
  shortName: string;
  note: string;
}> = [
  { id: 'paper-cut', name: '纸片拼贴 V3', shortName: '纸片拼贴', note: '无描边大块面、剪纸式层叠。最容易转成正式 Sprite 资产。' },
  { id: 'ink-flat', name: '墨线淡彩', shortName: '墨线淡彩', note: '书写感线条 + 低饱和淡彩，强调古代人物志气质。' },
  { id: 'woodblock', name: '套色木刻', shortName: '套色木刻', note: '粗黑轮廓、有限套色、刻线纹理，小尺寸辨识最强。' },
  { id: 'painterly', name: '简化写意', shortName: '简化写意', note: '柔和明暗与局部笔触，更接近正式角色插画，但制作成本最高。' },
];

export const GOLDEN_PORTRAITS: GoldenPortraitSpec[] = [
  { id: 'golden-male-young-poor', name: '沈砚', age: 22, stageLabel: '青年男子', gender: 'male', wealth: 'poor', wealthLabel: '贫寒', faceAsset: 'm-young-long', hairAsset: 'm-high-tied', beard: 'none', accessory: 'none', skin: '#c9916f', hair: '#2b2522', cloth: '#74614d' },
  { id: 'golden-male-adult-plain', name: '周朴', age: 36, stageLabel: '成年男子', gender: 'male', wealth: 'plain', wealthLabel: '普通', faceAsset: 'm-adult-square', hairAsset: 'm-short-angular', beard: 'short', accessory: 'none', skin: '#b97d5f', hair: '#292421', cloth: '#5d6870' },
  { id: 'golden-male-middle-comfortable', name: '陆川', age: 51, stageLabel: '中年男子', gender: 'male', wealth: 'comfortable', wealthLabel: '殷实', faceAsset: 'm-middle-broad', hairAsset: 'm-low-tied', beard: 'mustache', accessory: 'jade-pin', skin: '#b57a5c', hair: '#45403b', cloth: '#465d53' },
  { id: 'golden-male-elder-wealthy', name: '顾伯衡', age: 69, stageLabel: '老年男子', gender: 'male', wealth: 'wealthy', wealthLabel: '富裕', faceAsset: 'm-elder-oval', hairAsset: 'm-thinning', beard: 'elder', accessory: 'jade-pin', skin: '#c08b6b', hair: '#8a857c', cloth: '#664c4b' },
  { id: 'golden-female-young-poor', name: '阿禾', age: 19, stageLabel: '青年女子', gender: 'female', wealth: 'poor', wealthLabel: '贫寒', faceAsset: 'f-young-round', hairAsset: 'f-double-braid', beard: 'none', accessory: 'ribbon', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-adult-plain', name: '林月娘', age: 33, stageLabel: '成年女子', gender: 'female', wealth: 'plain', wealthLabel: '普通', faceAsset: 'f-adult-oval', hairAsset: 'f-long-center', beard: 'none', accessory: 'hairpin', skin: '#c98e6c', hair: '#2b2524', cloth: '#66727a' },
  { id: 'golden-female-middle-comfortable', name: '许兰英', age: 49, stageLabel: '中年女子', gender: 'female', wealth: 'comfortable', wealthLabel: '殷实', faceAsset: 'f-middle-broad', hairAsset: 'f-low-bun', beard: 'none', accessory: 'hairpin', skin: '#b97e61', hair: '#4a433e', cloth: '#596555' },
  { id: 'golden-female-elder-wealthy', name: '沈老夫人', age: 68, stageLabel: '老年女子', gender: 'female', wealth: 'wealthy', wealthLabel: '富裕', faceAsset: 'f-elder-long', hairAsset: 'f-elder-tied', beard: 'none', accessory: 'jade-pin', skin: '#c28d6d', hair: '#989188', cloth: '#6c555f' },
];

const FACE_ASSETS: Record<FaceAssetId, FaceAsset> = {
  'm-young-long': {
    path: 'M60 23 C46 23 39 31 39 47 C39 61 42 75 49 84 C53 89 57 92 60 92 C64 92 69 88 73 83 C79 75 81 61 81 47 C81 31 74 23 60 23Z',
    earY: 54, earRx: 4.4, earRy: 6.1, neckHalf: 6.3,
    leftEye: 'M45 53 Q50 50 55 53', rightEye: 'M65 53 Q70 50 75 53',
    leftBrow: 'M44 46 Q50 43 55 45', rightBrow: 'M65 45 Q70 43 76 46',
    nose: 'M59 54 Q57 62 59 67 Q61 69 65 67', mouth: 'M52 75 Q60 78 68 74',
  },
  'm-adult-square': {
    path: 'M60 24 C45 23 37 31 37 47 L39 68 C40 77 45 84 52 88 L60 90 L68 88 C75 84 80 77 81 68 L83 47 C83 31 75 23 60 24Z',
    earY: 55, earRx: 4.7, earRy: 6.4, neckHalf: 7.1,
    leftEye: 'M43 53 Q49 50 55 52', rightEye: 'M65 52 Q71 50 77 53',
    leftBrow: 'M42 46 L55 44', rightBrow: 'M65 44 L78 46',
    nose: 'M59 53 Q57 61 59 67 Q62 70 67 67', mouth: 'M51 75 Q60 77 69 74',
  },
  'm-middle-broad': {
    path: 'M60 25 C43 24 35 32 35 48 C35 63 38 76 47 84 C51 88 56 90 60 90 C66 90 72 87 77 82 C83 75 85 62 85 48 C85 32 77 24 60 25Z',
    earY: 55, earRx: 5, earRy: 6.5, neckHalf: 7.5,
    leftEye: 'M41 54 Q48 51 55 53', rightEye: 'M65 53 Q72 51 79 54',
    leftBrow: 'M40 46 Q48 43 55 45', rightBrow: 'M65 45 Q73 43 80 46',
    nose: 'M59 54 Q57 62 59 68 Q62 71 68 68', mouth: 'M50 76 Q60 79 70 75',
    cheekLeft: 'M41 64 Q44 69 48 72', cheekRight: 'M79 64 Q76 69 72 72',
  },
  'm-elder-oval': {
    path: 'M60 24 C46 23 39 31 39 47 C39 62 41 75 48 85 C52 91 57 94 60 94 C64 94 69 91 73 85 C79 76 81 62 81 47 C81 31 74 23 60 24Z',
    earY: 56, earRx: 4.6, earRy: 6.5, neckHalf: 6.7,
    leftEye: 'M44 54 Q50 52 55 54', rightEye: 'M65 54 Q70 52 76 54',
    leftBrow: 'M44 47 Q50 45 55 46', rightBrow: 'M65 46 Q71 45 76 47',
    nose: 'M59 55 Q56 63 59 69 Q62 72 67 69', mouth: 'M52 77 Q60 76 68 77',
    cheekLeft: 'M42 65 Q46 72 50 76', cheekRight: 'M78 65 Q74 72 70 76',
  },
  'f-young-round': {
    path: 'M60 25 C45 24 40 33 40 48 C40 62 43 73 50 80 C54 84 57 86 60 86 C64 86 68 84 72 80 C78 73 80 62 80 48 C80 33 75 24 60 25Z',
    earY: 54, earRx: 3.8, earRy: 5.5, neckHalf: 5,
    leftEye: 'M45 52 Q50 49 55 52 Q50 54 45 52', rightEye: 'M65 52 Q70 49 75 52 Q70 54 65 52',
    leftBrow: 'M45 45 Q50 42 55 44', rightBrow: 'M65 44 Q70 42 75 45',
    nose: 'M59 54 Q58 61 60 65 Q62 66 64 65', mouth: 'M53 72 Q60 75 67 72',
  },
  'f-adult-oval': {
    path: 'M60 23 C47 23 41 31 41 47 C41 61 43 73 50 82 C54 87 58 89 60 89 C64 89 68 86 72 82 C77 74 79 61 79 47 C79 31 73 23 60 23Z',
    earY: 54, earRx: 3.7, earRy: 5.6, neckHalf: 5.1,
    leftEye: 'M45 52 Q50 49 55 52 Q50 54 45 52', rightEye: 'M65 52 Q70 49 75 52 Q70 54 65 52',
    leftBrow: 'M45 45 Q50 42 55 44', rightBrow: 'M65 44 Q70 42 75 45',
    nose: 'M59 54 Q58 62 60 66 Q62 67 65 65', mouth: 'M52 74 Q60 77 68 73',
  },
  'f-middle-broad': {
    path: 'M60 25 C45 24 39 32 39 48 C39 62 42 75 50 83 C54 87 57 89 60 89 C64 89 68 87 72 83 C79 75 81 62 81 48 C81 32 75 24 60 25Z',
    earY: 55, earRx: 4, earRy: 5.8, neckHalf: 5.5,
    leftEye: 'M44 53 Q50 50 55 53', rightEye: 'M65 53 Q70 50 76 53',
    leftBrow: 'M44 46 Q50 43 55 45', rightBrow: 'M65 45 Q71 43 76 46',
    nose: 'M59 55 Q58 63 60 68 Q62 69 66 67', mouth: 'M52 76 Q60 78 68 75',
    cheekLeft: 'M43 65 Q46 70 49 73', cheekRight: 'M77 65 Q74 70 71 73',
  },
  'f-elder-long': {
    path: 'M60 23 C48 23 42 31 42 47 C42 63 44 77 50 86 C54 92 58 95 60 95 C63 95 67 92 71 86 C77 77 78 63 78 47 C78 31 72 23 60 23Z',
    earY: 56, earRx: 3.8, earRy: 5.8, neckHalf: 5.3,
    leftEye: 'M46 54 Q50 52 55 54', rightEye: 'M65 54 Q70 52 74 54',
    leftBrow: 'M46 47 Q50 45 55 46', rightBrow: 'M65 46 Q70 45 74 47',
    nose: 'M59 55 Q57 64 60 70 Q62 71 65 69', mouth: 'M53 78 Q60 77 67 78',
    cheekLeft: 'M45 66 Q48 73 51 78', cheekRight: 'M75 66 Q72 73 69 78',
  },
};

function hairBack(asset: HairAssetId, color: string, style: PortraitStyleId) {
  const stroke = style === 'woodblock' ? '#2b231d' : style === 'ink-flat' ? '#43362e' : 'none';
  const sw = style === 'woodblock' ? 2.2 : style === 'ink-flat' ? 1.2 : 0;
  const common = { fill: color, stroke, strokeWidth: sw, strokeLinejoin: 'round' as const };
  if (asset === 'f-long-center') return <g {...common}><path d="M41 37 C34 55 34 91 39 122 L52 125 L54 43Z"/><path d="M79 37 C86 55 86 91 81 122 L68 125 L66 43Z"/></g>;
  if (asset === 'f-double-braid') return <g><path d="M43 38 C39 55 39 74 43 86" {...common}/><path d="M77 38 C81 55 81 74 77 86" {...common}/><path d="M43 72 C34 85 37 105 41 120" fill="none" stroke={color} strokeWidth={style === 'woodblock' ? 9 : 7} strokeLinecap="round"/><path d="M77 72 C86 85 83 105 79 120" fill="none" stroke={color} strokeWidth={style === 'woodblock' ? 9 : 7} strokeLinecap="round"/></g>;
  if (asset === 'f-low-bun') return <g><ellipse cx="79" cy="69" rx="10" ry="9" {...common}/><path d="M42 37 C38 54 39 75 44 84 L51 78 L51 42Z" {...common}/><path d="M78 37 C82 54 81 75 76 84 L69 78 L69 42Z" {...common}/></g>;
  if (asset === 'f-elder-tied') return <g><ellipse cx="78" cy="34" rx="9" ry="7" {...common}/><path d="M43 38 C39 56 40 75 45 84 L52 78 L52 42Z" {...common}/><path d="M77 38 C81 56 80 75 75 84 L68 78 L68 42Z" {...common}/></g>;
  if (asset === 'm-high-tied') return <ellipse cx="60" cy="22" rx="7.5" ry="6" {...common}/>;
  if (asset === 'm-low-tied') return <ellipse cx="76" cy="34" rx="7" ry="6" {...common}/>;
  if (asset === 'm-thinning') return <g><path d="M41 40 Q44 29 52 27" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/><path d="M79 40 Q76 29 68 27" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/></g>;
  return null;
}

function hairFront(asset: HairAssetId, color: string, style: PortraitStyleId) {
  const outline = style === 'woodblock' ? '#2b231d' : style === 'ink-flat' ? '#44362d' : 'none';
  const sw = style === 'woodblock' ? 2.1 : style === 'ink-flat' ? 1.15 : 0;
  const base = { fill: color, stroke: outline, strokeWidth: sw, strokeLinejoin: 'round' as const };
  if (asset === 'm-short-angular') return <path d="M38 42 Q38 25 60 23 Q81 25 82 42 L74 36 L67 39 L60 32 L52 38 L45 35Z" {...base}/>;
  if (asset === 'm-high-tied') return <path d="M39 42 Q40 26 60 24 Q80 26 81 42 Q70 34 61 35 Q51 31 39 42Z" {...base}/>;
  if (asset === 'm-low-tied') return <path d="M37 43 Q39 27 60 25 Q81 27 83 43 Q70 35 61 36 Q50 31 37 43Z" {...base}/>;
  if (asset === 'm-thinning') return <g><path d="M40 41 Q45 29 53 27" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round"/><path d="M80 41 Q75 29 67 27" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round"/></g>;
  if (asset === 'f-long-center') return <g><path d="M40 43 Q41 25 60 23 Q79 25 80 43 Q69 33 62 36 L60 29 L58 36 Q50 32 40 43Z" {...base}/><path d="M42 39 Q38 58 45 73 Q49 65 49 42Z" {...base}/><path d="M78 39 Q82 58 75 73 Q71 65 71 42Z" {...base}/></g>;
  if (asset === 'f-double-braid') return <g><path d="M40 43 Q42 26 60 24 Q78 26 80 43 Q70 35 61 35 Q51 32 40 43Z" {...base}/><path d="M43 39 Q40 55 46 67 Q49 58 49 42Z" {...base}/><path d="M77 39 Q80 55 74 67 Q71 58 71 42Z" {...base}/></g>;
  if (asset === 'f-low-bun') return <g><path d="M40 43 Q42 26 60 24 Q78 26 80 43 Q68 34 60 36 Q51 32 40 43Z" {...base}/><path d="M44 39 Q41 54 47 65 Q50 57 50 42Z" {...base}/></g>;
  return <path d="M42 43 Q43 27 60 24 Q77 27 78 43 Q68 34 60 36 Q51 32 42 43Z" {...base}/>;
}

function outfit(spec: GoldenPortraitSpec, style: PortraitStyleId, cloth: string, accent: string) {
  const outline = style === 'woodblock' ? '#2e251f' : style === 'ink-flat' ? '#4a3c32' : 'none';
  const sw = style === 'woodblock' ? 2.4 : style === 'ink-flat' ? 1.25 : 0;
  const female = spec.gender === 'female';
  const left = female ? 19 : 15;
  const right = female ? 101 : 105;
  const top = female ? 91 : 89;
  const body = 'M' + left + ' 150 Q' + (left + 2) + ' 108 47 ' + top + ' H73 Q' + (right - 2) + ' 108 ' + right + ' 150Z';
  const common = { stroke: outline, strokeWidth: sw, strokeLinejoin: 'round' as const };
  if (spec.wealth === 'poor') return <g><path d={body} fill={cloth} {...common}/><path d="M49 91 L59 105 L70 93" fill="none" stroke={accent} strokeWidth={style === 'woodblock' ? 4 : 3.4} opacity=".75"/><path d="M24 132 L31 111" stroke={accent} strokeWidth="1.2" opacity=".28"/></g>;
  if (spec.wealth === 'plain') return <g><path d={body} fill={cloth} {...common}/><path d="M47 91 L60 108 L73 91" fill="none" stroke={accent} strokeWidth={style === 'woodblock' ? 5 : 4.2}/><path d="M60 108 V148" stroke={accent} strokeWidth="1" opacity=".32"/></g>;
  if (spec.wealth === 'comfortable') return <g><path d={body} fill={cloth} {...common}/><path d="M46 91 L60 109 L74 91" fill="none" stroke={accent} strokeWidth={style === 'woodblock' ? 6 : 5}/><path d="M42 104 Q60 119 78 104" fill="none" stroke={accent} strokeWidth="2.2" opacity=".75"/><path d="M28 119 Q60 130 92 119" fill="none" stroke={accent} strokeWidth="1.2" opacity=".28"/></g>;
  return <g><path d={body} fill={cloth} {...common}/><path d="M46 91 L60 109 L74 91" fill="none" stroke={accent} strokeWidth={style === 'woodblock' ? 7 : 5.7}/><path d="M41 103 Q60 120 79 103" fill="none" stroke={accent} strokeWidth="3"/><path d="M33 116 Q60 128 87 116" fill="none" stroke={accent} strokeWidth="1.7" opacity=".72"/><path d="M27 128 H93" stroke={accent} strokeWidth="1.2" opacity=".45"/><circle cx="60" cy="121" r="1.8" fill={accent}/></g>;
}

function beard(spec: GoldenPortraitSpec, color: string, style: PortraitStyleId) {
  if (spec.beard === 'none') return null;
  const stroke = style === 'woodblock' ? '#2c231e' : color;
  if (spec.beard === 'short') return <g fill={stroke} opacity=".7"><circle cx="53" cy="82" r="1"/><circle cx="57" cy="84" r="1"/><circle cx="61" cy="84.5" r="1"/><circle cx="65" cy="84" r="1"/><circle cx="69" cy="82" r="1"/></g>;
  if (spec.beard === 'mustache') return <path d="M51 71 Q56 67 60 71 Q64 67 69 71 Q64 74 60 72 Q56 74 51 71Z" fill={stroke}/>;
  return <g><path d="M50 73 Q55 69 60 73 Q65 69 70 73 Q65 76 60 74 Q55 76 50 73Z" fill={stroke}/><path d="M52 78 Q60 85 68 78 L66 94 Q60 103 54 94Z" fill={stroke} opacity=".82"/></g>;
}

function accessory(spec: GoldenPortraitSpec, style: PortraitStyleId) {
  if (spec.accessory === 'none') return null;
  const metal = style === 'woodblock' ? '#6e4f35' : '#b8a56f';
  if (spec.accessory === 'ribbon') return <g><path d="M40 43 Q60 49 80 43" fill="none" stroke="#8c5d56" strokeWidth="2.3"/><path d="M77 44 L84 52 L78 51Z" fill="#8c5d56"/></g>;
  if (spec.accessory === 'hairpin') return <g><path d="M48 29 L78 23" stroke={metal} strokeWidth="1.9" strokeLinecap="round"/><circle cx="79" cy="22.7" r="2.2" fill={metal}/></g>;
  return <g><path d="M48 28 L79 22" stroke={metal} strokeWidth="2" strokeLinecap="round"/><path d="M78 20 L83 22 L79 26Z" fill={metal}/></g>;
}

function ageMarks(spec: GoldenPortraitSpec, ink: string, style: PortraitStyleId) {
  if (spec.stageLabel.indexOf('中年') < 0 && spec.stageLabel.indexOf('老年') < 0) return null;
  const elder = spec.stageLabel.indexOf('老年') >= 0;
  const opacity = style === 'woodblock' ? .55 : style === 'painterly' ? .28 : .38;
  return <g fill="none" stroke={ink} strokeWidth={style === 'woodblock' ? 1.2 : .75} opacity={opacity}>
    <path d="M43 59 Q48 61 52 60"/><path d="M68 60 Q72 61 77 59"/>
    {elder && <><path d="M49 80 Q60 83 71 80"/><path d="M45 64 Q47 72 51 77"/><path d="M75 64 Q73 72 69 77"/><path d="M52 40 Q60 42 68 40"/></>}
  </g>;
}

function faceDetails(asset: FaceAsset, style: PortraitStyleId, ink: string) {
  if (style === 'paper-cut') return <g fill="none" stroke={ink} strokeLinecap="round">
    <path d={asset.leftBrow} strokeWidth="2.2" opacity=".62"/><path d={asset.rightBrow} strokeWidth="2.2" opacity=".62"/>
    <path d={asset.leftEye} strokeWidth="1.55"/><path d={asset.rightEye} strokeWidth="1.55"/>
    <path d={asset.nose} strokeWidth="1.15" opacity=".46"/><path d={asset.mouth} strokeWidth="1.55" opacity=".76"/>
    {asset.cheekLeft && <path d={asset.cheekLeft} strokeWidth=".8" opacity=".18"/>}
    {asset.cheekRight && <path d={asset.cheekRight} strokeWidth=".8" opacity=".18"/>}
  </g>;
  if (style === 'ink-flat') return <g fill="none" stroke={ink} strokeLinecap="round">
    <path d={asset.leftBrow} strokeWidth="1.8" opacity=".78"/><path d={asset.rightBrow} strokeWidth="1.8" opacity=".78"/>
    <path d={asset.leftEye} strokeWidth="1.3"/><path d={asset.rightEye} strokeWidth="1.3"/>
    <path d={asset.nose} strokeWidth="1.05" opacity=".68"/><path d={asset.mouth} strokeWidth="1.2" opacity=".78"/>
    <path d="M48 57 Q50 58 52 57" strokeWidth=".55" opacity=".28"/><path d="M68 57 Q70 58 72 57" strokeWidth=".55" opacity=".28"/>
    {asset.cheekLeft && <path d={asset.cheekLeft} strokeWidth=".75" opacity=".25"/>}
    {asset.cheekRight && <path d={asset.cheekRight} strokeWidth=".75" opacity=".25"/>}
  </g>;
  if (style === 'woodblock') return <g fill="none" stroke={ink} strokeLinecap="square">
    <path d={asset.leftBrow} strokeWidth="2.6"/><path d={asset.rightBrow} strokeWidth="2.6"/>
    <path d={asset.leftEye} strokeWidth="2"/><path d={asset.rightEye} strokeWidth="2"/>
    <path d={asset.nose} strokeWidth="1.65"/><path d={asset.mouth} strokeWidth="1.9"/>
    <path d="M44 63 L48 65 M72 65 L76 63" strokeWidth="1.1" opacity=".5"/>
  </g>;
  return <g fill="none" stroke={ink} strokeLinecap="round">
    <path d={asset.leftBrow} strokeWidth="1.45" opacity=".72"/><path d={asset.rightBrow} strokeWidth="1.45" opacity=".72"/>
    <path d={asset.leftEye} strokeWidth="1.05" opacity=".9"/><path d={asset.rightEye} strokeWidth="1.05" opacity=".9"/>
    <path d={asset.nose} strokeWidth=".85" opacity=".52"/><path d={asset.mouth} strokeWidth="1.05" opacity=".66"/>
    <path d="M47 57 Q50 59 53 57" strokeWidth=".5" opacity=".22"/><path d="M67 57 Q70 59 73 57" strokeWidth=".5" opacity=".22"/>
  </g>;
}

function styleColors(spec: GoldenPortraitSpec, style: PortraitStyleId) {
  if (style === 'ink-flat') return { background: '#e5dbc3', skin: spec.skin, hair: '#352e2a', cloth: spec.cloth, ink: '#46372f', accent: '#d2bd91' };
  if (style === 'woodblock') return { background: '#ceb27a', skin: '#d09a72', hair: '#2b2823', cloth: spec.wealth === 'wealthy' ? '#744b45' : spec.cloth, ink: '#2a231e', accent: '#e0c58b' };
  if (style === 'painterly') return { background: '#435253', skin: spec.skin, hair: spec.hair, cloth: spec.cloth, ink: '#3f312c', accent: '#d8c8a7' };
  return { background: '#3a4942', skin: spec.skin, hair: spec.hair, cloth: spec.cloth, ink: '#49352e', accent: '#d0c09b' };
}

export function PortraitStylePortrait({ spec, artStyle, label }: { spec: GoldenPortraitSpec; artStyle: PortraitStyleId; label?: string; }) {
  const uid = useId().replace(/:/g, '');
  const asset = FACE_ASSETS[spec.faceAsset];
  const colors = styleColors(spec, artStyle);
  const faceOutline = artStyle === 'woodblock' ? colors.ink : artStyle === 'ink-flat' ? colors.ink : 'none';
  const faceStrokeWidth = artStyle === 'woodblock' ? 2.4 : artStyle === 'ink-flat' ? 1.05 : 0;
  const neckTop = spec.gender === 'female' ? 81 : 83;
  const neckBottom = 101;

  return <div
    className={'portrait-style-portrait portrait-style-portrait--' + artStyle}
    data-portrait-style={artStyle}
    data-resident-id={spec.id}
    data-face-asset={spec.faceAsset}
    data-hair-asset={spec.hairAsset}
    data-halo="none"
    data-background-style="clean"
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <svg viewBox="0 15 120 120" focusable="false">
      <defs>
        <linearGradient id={uid + '-skin'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.skin}/><stop offset=".58" stopColor={colors.skin}/><stop offset="1" stopColor="#8f5e4c"/>
        </linearGradient>
        <linearGradient id={uid + '-cloth'} x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor={colors.cloth}/><stop offset="1" stopColor="#303936"/>
        </linearGradient>
        <pattern id={uid + '-hatch'} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6 L6 0" stroke={colors.ink} strokeWidth=".65" opacity=".28"/>
        </pattern>
      </defs>

      <rect width="120" height="150" fill={colors.background}/>
      {artStyle === 'ink-flat' && <g opacity=".1" stroke={colors.ink} strokeWidth=".45"><path d="M8 27 H112"/><path d="M13 118 H107"/><path d="M18 129 H102"/></g>}
      {hairBack(spec.hairAsset, colors.hair, artStyle)}
      {outfit(spec, artStyle, artStyle === 'painterly' ? 'url(#' + uid + '-cloth)' : colors.cloth, colors.accent)}
      <path d={'M' + (60 - asset.neckHalf) + ' ' + neckTop + ' H' + (60 + asset.neckHalf) + ' L' + (60 + asset.neckHalf + 1.5) + ' ' + neckBottom + ' Q60 104 ' + (60 - asset.neckHalf - 1.5) + ' ' + neckBottom + 'Z'} fill={artStyle === 'painterly' ? 'url(#' + uid + '-skin)' : colors.skin} stroke={faceOutline} strokeWidth={faceStrokeWidth}/>
      <ellipse cx="39" cy={asset.earY} rx={asset.earRx} ry={asset.earRy} fill={colors.skin} stroke={faceOutline} strokeWidth={faceStrokeWidth}/>
      <ellipse cx="81" cy={asset.earY} rx={asset.earRx} ry={asset.earRy} fill={colors.skin} stroke={faceOutline} strokeWidth={faceStrokeWidth}/>
      <path d={asset.path} fill={artStyle === 'painterly' ? 'url(#' + uid + '-skin)' : colors.skin} stroke={faceOutline} strokeWidth={faceStrokeWidth} strokeLinejoin="round"/>

      {artStyle === 'paper-cut' && <><path d="M43 63 Q60 91 77 63 Q75 81 60 89 Q45 81 43 63Z" fill="#8f5d4c" opacity=".08"/><path d="M45 38 Q51 30 61 29 Q51 34 48 48 Q46 55 43 60" fill="#f0c19d" opacity=".07"/></>}
      {artStyle === 'ink-flat' && <><path d="M43 65 Q48 79 60 85 Q72 79 77 65" fill="#a46858" opacity=".08"/><path d="M46 37 Q60 31 74 37" fill="none" stroke={colors.ink} strokeWidth=".7" opacity=".22"/></>}
      {artStyle === 'woodblock' && <><path d="M43 66 Q48 80 60 87 Q72 80 77 66" fill={'url(#' + uid + '-hatch)'} opacity=".6"/><path d="M43 37 Q60 30 77 37" fill="none" stroke={colors.ink} strokeWidth="1.2" opacity=".42"/></>}
      {artStyle === 'painterly' && <><path d="M42 60 Q47 82 60 89 Q68 85 75 74 Q78 67 78 58 Q73 68 67 72 Q57 78 42 60Z" fill="#713f39" opacity=".12"/><path d="M44 44 Q49 33 61 30 Q54 37 52 50 Q50 60 45 66" fill="#f2c7a4" opacity=".14"/><path d="M45 39 Q54 31 66 32" fill="none" stroke="#f5d4b5" strokeWidth="1.3" opacity=".24"/><path d="M53 79 Q60 82 67 78" fill="none" stroke="#5d3935" strokeWidth="1.4" opacity=".18"/></>}

      {faceDetails(asset, artStyle, colors.ink)}
      {ageMarks(spec, colors.ink, artStyle)}
      {hairFront(spec.hairAsset, colors.hair, artStyle)}
      {artStyle === 'painterly' && <path d="M45 37 Q60 27 75 37" fill="none" stroke="#f0dfc5" strokeWidth="1.4" strokeLinecap="round" opacity=".13"/>}
      {beard(spec, colors.hair, artStyle)}
      {accessory(spec, artStyle)}
      {artStyle === 'woodblock' && <g stroke={colors.ink} strokeWidth=".8" opacity=".34"><path d="M21 128 L31 118"/><path d="M25 134 L37 122"/><path d="M90 121 L99 112"/><path d="M86 130 L101 115"/></g>}
      {artStyle === 'painterly' && <g fill="none" stroke="#efe0bd" strokeLinecap="round" opacity=".16"><path d="M28 118 Q46 107 53 109" strokeWidth="1.7"/><path d="M73 107 Q86 112 94 124" strokeWidth="1.25"/></g>}
    </svg>
  </div>;
}
