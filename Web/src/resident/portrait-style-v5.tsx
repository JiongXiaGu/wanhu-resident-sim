import { useId } from 'react';

export type PortraitStyleId = 'woodblock' | 'mural' | 'baimiao' | 'silk';
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
  beard: 'none' | 'short' | 'mustache' | 'elder';
  accessory: 'none' | 'ribbon' | 'hairpin' | 'jade-pin';
  skin: string;
  hair: string;
  cloth: string;
};

export const PORTRAIT_STYLES: Array<{
  id: PortraitStyleId;
  name: string;
  shortName: string;
  artSystem: string;
  note: string;
}> = [
  {
    id: 'woodblock',
    name: '强化套色木刻',
    shortName: '木刻',
    artSystem: 'carved-block-portrait',
    note: '正面硬轮廓、粗黑刻线、有限套色与强黑白关系。人物首先靠轮廓和刻线成立。',
  },
  {
    id: 'mural',
    name: '壁画化重彩',
    shortName: '壁画',
    artSystem: 'mural-three-quarter',
    note: '三分之四侧脸、长眼线、平涂矿物色、装饰化衣纹。造型体系与木刻完全分离。',
  },
  {
    id: 'baimiao',
    name: '白描人物谱',
    shortName: '白描',
    artSystem: 'line-scroll-profile',
    note: '侧转人物谱构图，以细线、留白和发丝组织为主，几乎不依赖色块塑形。',
  },
  {
    id: 'silk',
    name: '绢本设色小像',
    shortName: '绢本设色',
    artSystem: 'silk-painted-bust',
    note: '较自然的头身比例、轻微侧转、柔和罩染和层叠衣领，追求温润的人像册页感。',
  },
];

export const GOLDEN_PORTRAITS: GoldenPortraitSpec[] = [
  { id: 'golden-male-young-poor', name: '沈砚', age: 22, stageLabel: '青年男子', gender: 'male', wealth: 'poor', wealthLabel: '贫寒', beard: 'none', accessory: 'none', skin: '#c9916f', hair: '#2b2522', cloth: '#74614d' },
  { id: 'golden-male-adult-plain', name: '周朴', age: 36, stageLabel: '成年男子', gender: 'male', wealth: 'plain', wealthLabel: '普通', beard: 'short', accessory: 'none', skin: '#b97d5f', hair: '#292421', cloth: '#5d6870' },
  { id: 'golden-male-middle-comfortable', name: '陆川', age: 51, stageLabel: '中年男子', gender: 'male', wealth: 'comfortable', wealthLabel: '殷实', beard: 'mustache', accessory: 'jade-pin', skin: '#b57a5c', hair: '#45403b', cloth: '#465d53' },
  { id: 'golden-male-elder-wealthy', name: '顾伯衡', age: 69, stageLabel: '老年男子', gender: 'male', wealth: 'wealthy', wealthLabel: '富裕', beard: 'elder', accessory: 'jade-pin', skin: '#c08b6b', hair: '#8a857c', cloth: '#664c4b' },
  { id: 'golden-female-young-poor', name: '阿禾', age: 19, stageLabel: '青年女子', gender: 'female', wealth: 'poor', wealthLabel: '贫寒', beard: 'none', accessory: 'ribbon', skin: '#d2a07f', hair: '#2a2523', cloth: '#78634f' },
  { id: 'golden-female-adult-plain', name: '林月娘', age: 33, stageLabel: '成年女子', gender: 'female', wealth: 'plain', wealthLabel: '普通', beard: 'none', accessory: 'hairpin', skin: '#c98e6c', hair: '#2b2524', cloth: '#66727a' },
  { id: 'golden-female-middle-comfortable', name: '许兰英', age: 49, stageLabel: '中年女子', gender: 'female', wealth: 'comfortable', wealthLabel: '殷实', beard: 'none', accessory: 'hairpin', skin: '#b97e61', hair: '#4a433e', cloth: '#596555' },
  { id: 'golden-female-elder-wealthy', name: '沈老夫人', age: 68, stageLabel: '老年女子', gender: 'female', wealth: 'wealthy', wealthLabel: '富裕', beard: 'none', accessory: 'jade-pin', skin: '#c28d6d', hair: '#989188', cloth: '#6c555f' },
];

const indexById = new Map(GOLDEN_PORTRAITS.map((item, index) => [item.id, index]));

function residentIndex(spec: GoldenPortraitSpec) {
  return indexById.get(spec.id) ?? 0;
}

function wealthAccent(spec: GoldenPortraitSpec) {
  if (spec.wealth === 'wealthy') return '#d5bc78';
  if (spec.wealth === 'comfortable') return '#b8aa84';
  if (spec.wealth === 'plain') return '#9d9278';
  return '#887d67';
}

function BeardMark({ spec, color, y = 76, scale = 1 }: { spec: GoldenPortraitSpec; color: string; y?: number; scale?: number }) {
  if (spec.beard === 'none') return null;
  if (spec.beard === 'short') return (
    <g fill={color} opacity=".62">
      {[-8, -4, 0, 4, 8].map((x) => <circle key={x} cx={60 + x * scale} cy={y + 7 + Math.abs(x) * .12} r={.85 * scale}/>)}
    </g>
  );
  if (spec.beard === 'mustache') return (
    <path d={'M50 ' + y + ' Q56 ' + (y - 4) + ' 60 ' + y + ' Q64 ' + (y - 4) + ' 70 ' + y + ' Q65 ' + (y + 3) + ' 60 ' + (y + 1) + ' Q55 ' + (y + 3) + ' 50 ' + y + 'Z'} fill={color}/>
  );
  return (
    <g fill={color}>
      <path d={'M49 ' + y + ' Q55 ' + (y - 5) + ' 60 ' + y + ' Q65 ' + (y - 5) + ' 71 ' + y + ' Q65 ' + (y + 4) + ' 60 ' + (y + 2) + ' Q55 ' + (y + 4) + ' 49 ' + y + 'Z'}/>
      <path d={'M51 ' + (y + 5) + ' Q60 ' + (y + 13) + ' 69 ' + (y + 5) + ' L66 ' + (y + 23) + ' Q60 ' + (y + 31) + ' 54 ' + (y + 23) + 'Z'} opacity=".9"/>
    </g>
  );
}

function WoodblockPortrait({ spec }: { spec: GoldenPortraitSpec }) {
  const i = residentIndex(spec);
  const female = spec.gender === 'female';
  const widths = female ? [39, 36, 41, 35] : [42, 46, 50, 43];
  const faceW = widths[i % 4];
  const cx = 60;
  const left = cx - faceW / 2;
  const right = cx + faceW / 2;
  const top = 25 + (i % 2);
  const chin = female ? 87 + (i % 3) : 91 + (i % 3);
  const jawInset = female ? 7 + (i % 2) : 4 + (i % 3);
  const line = '#271f1a';
  const bg = i % 2 ? '#d0b37a' : '#c7a96f';
  const cloth = spec.wealth === 'wealthy' ? '#74433d' : spec.cloth;
  const face = 'M' + cx + ' ' + top +
    ' C' + (left + 5) + ' ' + (top - 1) + ' ' + left + ' ' + (top + 10) + ' ' + (left + 1) + ' 51' +
    ' L' + (left + 4) + ' 70 Q' + (left + jawInset) + ' ' + (chin - 6) + ' ' + cx + ' ' + chin +
    ' Q' + (right - jawInset) + ' ' + (chin - 6) + ' ' + (right - 4) + ' 70 L' + (right - 1) + ' 51' +
    ' C' + right + ' ' + (top + 10) + ' ' + (right - 5) + ' ' + (top - 1) + ' ' + cx + ' ' + top + 'Z';
  const eyeY = 53 + (i % 2);
  const eyeSpan = female ? 9 : 10.5;

  return (
    <svg viewBox="0 15 120 120" focusable="false">
      <rect width="120" height="150" fill={bg}/>
      <g stroke={line} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="square">
        <path d="M14 150 Q17 105 45 91 H75 Q103 105 106 150Z" fill={cloth}/>
        <path d="M43 92 L60 111 L77 92" fill="none" stroke={wealthAccent(spec)} strokeWidth={spec.wealth === 'wealthy' ? 6 : 4}/>
        {spec.wealth !== 'poor' && <path d="M32 122 Q60 132 88 122" fill="none" stroke={wealthAccent(spec)} strokeWidth="1.5" opacity=".8"/>}
        {female && <path d="M39 43 Q35 72 40 105 M81 43 Q85 72 80 105" fill="none" stroke={spec.hair} strokeWidth={i % 4 === 0 ? 9 : 6}/>}
        {!female && i === 3 && <path d="M40 42 Q45 28 53 27 M80 42 Q75 28 67 27" fill="none" stroke={spec.hair} strokeWidth="6"/>}
        {!female && i !== 3 && <path d={'M' + left + ' 44 Q' + (left + 3) + ' 26 60 24 Q' + (right - 3) + ' 26 ' + right + ' 44 Q70 34 61 35 Q51 31 ' + left + ' 44Z'} fill={spec.hair}/>}
        {female && <path d={'M' + (left + 1) + ' 45 Q' + (left + 4) + ' 27 60 24 Q' + (right - 4) + ' 27 ' + (right - 1) + ' 45 Q70 34 61 35 Q51 31 ' + (left + 1) + ' 45Z'} fill={spec.hair}/>}
        <ellipse cx={left - 1.5} cy="56" rx="4.4" ry="6" fill={spec.skin}/>
        <ellipse cx={right + 1.5} cy="56" rx="4.4" ry="6" fill={spec.skin}/>
        <path d={face} fill={female ? '#cf936d' : '#c78863'}/>
        <path d={'M' + (cx - eyeSpan - 6) + ' 47 Q' + (cx - eyeSpan) + ' 43 ' + (cx - eyeSpan + 6) + ' 46'} fill="none" strokeWidth="3.1"/>
        <path d={'M' + (cx + eyeSpan - 6) + ' 46 Q' + (cx + eyeSpan) + ' 43 ' + (cx + eyeSpan + 6) + ' 47'} fill="none" strokeWidth="3.1"/>
        <path d={'M' + (cx - eyeSpan - 5) + ' ' + eyeY + ' Q' + (cx - eyeSpan) + ' ' + (eyeY - 3) + ' ' + (cx - eyeSpan + 5) + ' ' + eyeY} fill="none" strokeWidth="2.1"/>
        <path d={'M' + (cx + eyeSpan - 5) + ' ' + eyeY + ' Q' + (cx + eyeSpan) + ' ' + (eyeY - 3) + ' ' + (cx + eyeSpan + 5) + ' ' + eyeY} fill="none" strokeWidth="2.1"/>
        <path d={'M59 54 Q56 ' + (female ? 62 : 64) + ' 60 ' + (female ? 68 : 70) + ' Q63 72 67 68'} fill="none" strokeWidth="1.7"/>
        <path d={'M51 ' + (female ? 75 : 77) + ' Q60 ' + (female ? 80 : 82) + ' 69 ' + (female ? 75 : 77)} fill="none" strokeWidth="2"/>
        {i >= 2 && <g strokeWidth="1.2" opacity=".65"><path d="M42 64 L48 67"/><path d="M72 67 L78 64"/></g>}
      </g>
      <BeardMark spec={spec} color={line} y={female ? 73 : 76}/>
      <g stroke={line} strokeWidth=".8" opacity=".32">
        <path d="M20 131 L32 118"/><path d="M25 139 L39 124"/><path d="M83 124 L96 112"/><path d="M89 137 L103 121"/>
      </g>
    </svg>
  );
}

function MuralPortrait({ spec }: { spec: GoldenPortraitSpec }) {
  const i = residentIndex(spec);
  const female = spec.gender === 'female';
  const flip = i % 2 === 0 ? undefined : 'translate(120 0) scale(-1 1)';
  const line = '#5b3227';
  const stoneGreen = i % 3 === 0 ? '#55726a' : '#6f806e';
  const bg = i % 2 === 0 ? '#b88d59' : '#a97c4d';
  const skin = female ? '#d2a07b' : '#c58b66';
  const facePath = female
    ? 'M56 27 Q42 30 39 44 Q37 57 42 70 Q48 82 58 86 Q67 85 72 77 Q78 68 78 54 Q77 39 69 31 Q63 26 56 27Z'
    : 'M55 26 Q40 29 37 45 Q36 60 42 73 Q49 84 59 88 Q69 86 75 76 Q80 65 79 50 Q77 36 68 29 Q62 25 55 26Z';

  return (
    <svg viewBox="0 15 120 120" focusable="false">
      <rect width="120" height="150" fill={bg}/>
      <g opacity=".18" fill="none" stroke="#d9b679" strokeWidth="1">
        <path d="M7 22 Q28 18 46 23"/><path d="M76 21 Q95 17 114 22"/><path d="M10 132 Q31 126 53 130"/><path d="M75 131 Q98 125 114 129"/>
      </g>
      <g transform={flip}>
        <path d="M11 150 Q22 111 43 96 Q56 87 72 91 Q95 101 112 150Z" fill={stoneGreen}/>
        <path d="M31 109 Q54 119 83 102" fill="none" stroke={spec.wealth === 'wealthy' ? '#d2b55f' : '#a98258'} strokeWidth={spec.wealth === 'wealthy' ? 5 : 3}/>
        <path d="M41 93 Q54 104 69 94" fill="none" stroke="#dbc08b" strokeWidth="4.4"/>
        {female ? (
          <g fill={spec.hair} stroke={line} strokeWidth="1.6">
            <ellipse cx="68" cy="34" rx={i % 4 === 0 ? 11 : 8} ry="7"/>
            <path d="M38 48 Q38 26 58 23 Q78 25 81 46 Q72 34 58 35 Q48 32 38 48Z"/>
            <path d="M42 44 Q34 70 42 104 L50 98 Q47 72 51 45Z"/>
            {i % 4 === 0 && <path d="M76 48 Q86 75 78 112" fill="none" stroke={spec.hair} strokeWidth="7"/>}
          </g>
        ) : (
          <g fill={spec.hair} stroke={line} strokeWidth="1.6">
            {i === 3 ? <><path d="M39 46 Q43 29 51 27" fill="none" stroke={spec.hair} strokeWidth="6"/><ellipse cx="72" cy="34" rx="7" ry="6"/></> :
              <><ellipse cx="72" cy="30" rx="7" ry="6"/><path d="M38 47 Q39 28 58 24 Q77 27 81 45 Q71 35 61 36 Q49 31 38 47Z"/></>}
          </g>
        )}
        <path d="M49 82 L49 97 Q57 101 65 97 L67 82Z" fill={skin}/>
        <path d={facePath} fill={skin} stroke={line} strokeWidth="1.5"/>
        <ellipse cx="39" cy="56" rx="3.8" ry="5.5" fill={skin} stroke={line} strokeWidth="1.2"/>
        <path d="M43 49 Q49 45 55 48" fill="none" stroke={line} strokeWidth="1.7"/>
        <path d="M58 47 Q65 43 71 46" fill="none" stroke={line} strokeWidth="1.7"/>
        <path d="M43 54 Q49 49 55 53 Q49 57 43 54Z" fill="none" stroke={line} strokeWidth="1.25"/>
        <path d="M59 52 Q65 47 72 51 Q66 56 59 52Z" fill="none" stroke={line} strokeWidth="1.25"/>
        <circle cx="49" cy="53" r="1" fill={line}/><circle cx="66" cy="51" r="1" fill={line}/>
        <path d="M57 53 Q56 61 60 65 Q64 66 69 63" fill="none" stroke={line} strokeWidth="1.05"/>
        <path d="M51 72 Q59 76 68 70" fill="none" stroke="#7d4137" strokeWidth="1.3"/>
        {i >= 2 && <g fill="none" stroke={line} strokeWidth=".7" opacity=".45"><path d="M45 62 Q48 68 52 71"/><path d="M68 60 Q70 65 72 69"/></g>}
        <BeardMark spec={spec} color={line} y={70} scale={.9}/>
        {spec.accessory !== 'none' && <path d="M47 29 L78 21" stroke="#d0ae5a" strokeWidth="2" strokeLinecap="round"/>}
      </g>
    </svg>
  );
}

function BaimiaoPortrait({ spec }: { spec: GoldenPortraitSpec }) {
  const i = residentIndex(spec);
  const female = spec.gender === 'female';
  const transform = i % 2 === 0 ? undefined : 'translate(120 0) scale(-1 1)';
  const ink = '#59483a';
  const paper = i % 2 ? '#efe5d2' : '#e9ddc8';

  return (
    <svg viewBox="0 15 120 120" focusable="false">
      <rect width="120" height="150" fill={paper}/>
      <g transform={transform} fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 150 Q22 118 41 101 Q54 91 69 95 Q90 103 105 150" strokeWidth="1.2"/>
        <path d="M41 100 Q55 112 70 98" strokeWidth="1.05"/>
        {spec.wealth !== 'poor' && <path d="M33 116 Q55 126 79 109" strokeWidth=".65" opacity=".65"/>}
        {spec.wealth === 'wealthy' && <><path d="M29 123 Q55 134 88 116" strokeWidth=".55"/><path d="M43 103 L52 114 L68 100" strokeWidth="1.4"/></>}
        <path d="M50 82 L49 98 Q56 103 63 99 L66 83" strokeWidth="1.05"/>
        {female ? (
          <g strokeWidth="1.05">
            <path d="M39 48 Q38 29 55 24 Q72 26 78 42"/>
            <path d="M40 43 Q32 70 40 109"/>
            <path d="M44 44 Q37 72 44 103"/>
            {i % 4 === 0 && <><path d="M42 71 Q31 89 38 119"/><path d="M45 73 Q36 91 42 117"/></>}
            {i % 4 === 1 && <path d="M74 34 Q84 51 78 77 Q73 97 76 116"/>}
            {i % 4 >= 2 && <ellipse cx="74" cy={i % 4 === 2 ? 68 : 34} rx="9" ry="7"/>}
          </g>
        ) : (
          <g strokeWidth="1.1">
            {i === 3 ? <><path d="M39 45 Q43 30 51 27"/><path d="M74 35 Q80 42 77 52"/></> :
              <><path d="M38 47 Q40 29 57 25 Q74 27 79 43"/><ellipse cx="73" cy="31" rx="6" ry="5"/></>}
          </g>
        )}
        <path d="M54 27 Q42 31 39 46 Q37 61 42 73 Q48 86 58 90 Q67 88 72 79 Q77 69 76 53 Q74 38 66 30 Q60 26 54 27Z" strokeWidth="1.2"/>
        <path d="M40 55 Q36 56 38 62 Q40 66 43 63" strokeWidth=".85"/>
        <path d="M44 50 Q49 47 54 49" strokeWidth=".9"/>
        <path d="M58 48 Q64 45 69 47" strokeWidth=".9"/>
        <path d="M44 55 Q49 52 54 54" strokeWidth=".72"/>
        <path d="M59 53 Q64 50 70 52" strokeWidth=".72"/>
        <path d="M57 54 Q55 62 58 67 Q61 69 66 66" strokeWidth=".72"/>
        <path d="M51 75 Q59 78 67 74" strokeWidth=".78"/>
        {i >= 2 && <><path d="M44 65 Q47 72 51 76" strokeWidth=".5"/><path d="M68 63 Q70 70 70 74" strokeWidth=".5"/></>}
        {spec.beard !== 'none' && <g strokeWidth=".72">
          {spec.beard === 'short' && <path d="M51 80 Q59 85 67 79" strokeDasharray="1 2"/>}
          {spec.beard === 'mustache' && <path d="M50 71 Q55 67 59 71 Q64 67 69 71"/>}
          {spec.beard === 'elder' && <><path d="M49 72 Q55 68 59 72 Q64 68 70 72"/><path d="M52 78 Q58 92 61 101 Q64 91 67 78"/></>}
        </g>}
        {spec.accessory !== 'none' && <path d="M45 29 L77 22" strokeWidth=".85"/>}
        <path d="M20 139 Q40 132 50 134" strokeWidth=".45" opacity=".3"/>
        <path d="M76 128 Q91 130 102 140" strokeWidth=".45" opacity=".3"/>
      </g>
    </svg>
  );
}

function SilkPortrait({ spec }: { spec: GoldenPortraitSpec }) {
  const uid = useId().replace(/:/g, '');
  const i = residentIndex(spec);
  const female = spec.gender === 'female';
  const flip = i % 2 === 0 ? undefined : 'translate(120 0) scale(-1 1)';
  const line = '#6a4c3e';
  const bg = i % 2 ? '#8a968a' : '#778b87';
  const skin = spec.skin;
  const cloth = spec.wealth === 'wealthy' ? '#63515c' : spec.cloth;

  return (
    <svg viewBox="0 15 120 120" focusable="false">
      <defs>
        <linearGradient id={uid + '-skin'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2b18f"/>
          <stop offset=".52" stopColor={skin}/>
          <stop offset="1" stopColor="#9c654f"/>
        </linearGradient>
        <linearGradient id={uid + '-cloth'} x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor={cloth}/>
          <stop offset="1" stopColor="#35443e"/>
        </linearGradient>
      </defs>
      <rect width="120" height="150" fill={bg}/>
      <g transform={flip}>
        <path d="M16 150 Q20 110 43 94 Q57 84 72 91 Q98 104 106 150Z" fill={'url(#' + uid + '-cloth)'} opacity=".96"/>
        <path d="M43 93 Q56 106 72 92" fill="none" stroke="#d7c6a1" strokeWidth={spec.wealth === 'wealthy' ? 5.4 : 4.2} opacity=".88"/>
        {spec.wealth !== 'poor' && <path d="M38 106 Q56 120 80 101" fill="none" stroke="#9d8d73" strokeWidth={spec.wealth === 'wealthy' ? 2.5 : 1.6} opacity=".65"/>}
        {spec.wealth === 'wealthy' && <path d="M31 119 Q58 132 88 112" fill="none" stroke="#cab98a" strokeWidth="1.1" opacity=".7"/>}

        {female ? (
          <g fill={spec.hair}>
            {i % 4 === 0 && <><path d="M41 43 Q37 72 42 118 L50 116 Q47 79 51 43Z"/><path d="M75 42 Q85 72 79 119 L71 116 Q75 77 68 43Z"/><circle cx="78" cy="38" r="7"/></>}
            {i % 4 === 1 && <><path d="M40 44 Q35 74 41 121 L50 119 Q46 77 51 43Z"/><path d="M74 43 Q83 73 79 121 L70 119 Q74 77 67 43Z"/></>}
            {i % 4 === 2 && <><ellipse cx="77" cy="69" rx="10" ry="9"/><path d="M40 44 Q39 67 46 85 L52 78 L51 43Z"/></>}
            {i % 4 === 3 && <><ellipse cx="76" cy="35" rx="9" ry="7"/><path d="M41 45 Q38 68 44 85 L51 80 L51 43Z"/></>}
          </g>
        ) : (
          <g fill={spec.hair}>
            {i === 3 ? <><path d="M40 43 Q44 31 52 28" fill="none" stroke={spec.hair} strokeWidth="5" strokeLinecap="round"/><ellipse cx="75" cy="36" rx="6" ry="5"/></> :
              <><path d="M39 44 Q40 29 57 25 Q75 27 79 43 Q68 35 59 36 Q49 32 39 44Z"/><ellipse cx="72" cy="31" rx="6" ry="5"/></>}
          </g>
        )}

        <path d="M50 82 L50 96 Q58 102 66 97 L67 82Z" fill={'url(#' + uid + '-skin)'}/>
        <path d="M56 26 Q43 29 40 45 Q38 61 43 74 Q49 86 59 90 Q68 88 73 79 Q78 69 77 53 Q75 38 67 30 Q61 25 56 26Z" fill={'url(#' + uid + '-skin)'} stroke={line} strokeWidth=".75" opacity=".98"/>
        <ellipse cx="40" cy="56" rx="3.6" ry="5.2" fill={skin} opacity=".95"/>
        <path d="M42 47 Q49 44 55 47" fill="none" stroke={line} strokeWidth="1.15" strokeLinecap="round"/>
        <path d="M59 46 Q65 43 71 46" fill="none" stroke={line} strokeWidth="1.15" strokeLinecap="round"/>
        <path d="M43 53 Q49 49 55 52 Q49 55 43 53Z" fill="none" stroke="#4f3d35" strokeWidth=".85"/>
        <path d="M59 51 Q65 47 71 50 Q65 54 59 51Z" fill="none" stroke="#4f3d35" strokeWidth=".85"/>
        <circle cx="49" cy="52" r=".8" fill="#3a302c"/><circle cx="65" cy="50" r=".8" fill="#3a302c"/>
        <path d="M57 53 Q55 61 58 66 Q61 68 66 65" fill="none" stroke={line} strokeWidth=".75" opacity=".7"/>
        <path d="M51 74 Q59 77 68 73" fill="none" stroke="#80524a" strokeWidth="1" opacity=".8"/>
        <path d="M44 42 Q49 32 60 29" fill="none" stroke="#f3cfad" strokeWidth="1.4" opacity=".16"/>
        {i >= 2 && <g fill="none" stroke={line} strokeWidth=".55" opacity=".32"><path d="M44 64 Q47 71 51 75"/><path d="M68 62 Q71 68 71 73"/></g>}
        <BeardMark spec={spec} color={spec.hair} y={70} scale={.85}/>
        {spec.accessory !== 'none' && <g><path d="M45 29 L77 22" stroke="#c4aa70" strokeWidth="1.6" strokeLinecap="round"/>{spec.accessory === 'jade-pin' && <circle cx="77" cy="22" r="2" fill="#849a78"/>}</g>}
      </g>
    </svg>
  );
}

export function PortraitStylePortrait({
  spec,
  artStyle,
  label,
}: {
  spec: GoldenPortraitSpec;
  artStyle: PortraitStyleId;
  label?: string;
}) {
  const meta = PORTRAIT_STYLES.find((item) => item.id === artStyle)!;
  return (
    <div
      className={'portrait-style-portrait portrait-style-portrait--' + artStyle}
      data-portrait-style={artStyle}
      data-art-system={meta.artSystem}
      data-resident-id={spec.id}
      data-identity-source={spec.id}
      data-halo="none"
      data-background-style="clean"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {artStyle === 'woodblock' && <WoodblockPortrait spec={spec}/>}
      {artStyle === 'mural' && <MuralPortrait spec={spec}/>}
      {artStyle === 'baimiao' && <BaimiaoPortrait spec={spec}/>}
      {artStyle === 'silk' && <SilkPortrait spec={spec}/>}
    </div>
  );
}
