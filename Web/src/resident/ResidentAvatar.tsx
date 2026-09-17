import type { Gender, LifeStageId, ResidentAppearanceDNA } from '../domain/resident';

type Props = {
  seed?: number;
  gender: Gender;
  lifeStage: LifeStageId;
  occupationId?: string;
  appearance?: ResidentAppearanceDNA;
  label?: string;
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
  'appearance.palette.clothing.earth-01': '#6f5a47',
  'appearance.palette.clothing.indigo-01': '#4e5c68',
  'appearance.palette.clothing.gray-01': '#69716d',
  'appearance.palette.clothing.green-01': '#59685d',
  'appearance.palette.clothing.red-brown-01': '#76544c',
  'appearance.palette.clothing.blue-01': '#53697b',
};

const FALLBACK_FACES = [
  'appearance.face.oval-01',
  'appearance.face.round-01',
  'appearance.face.long-01',
  'appearance.face.square-01',
  'appearance.face.oval-02',
  'appearance.face.broad-01',
];

const FALLBACK_HAIR = [
  'appearance.hair.short-01',
  'appearance.hair.short-02',
  'appearance.hair.cropped-01',
  'appearance.hair.tied-01',
  'appearance.hair.tied-02',
  'appearance.hair.tied-03',
  'appearance.hair.bun-01',
  'appearance.hair.bun-02',
];

const FALLBACK_BROWS = [
  'appearance.brow.straight-01',
  'appearance.brow.straight-02',
  'appearance.brow.soft-01',
  'appearance.brow.thick-01',
  'appearance.brow.angled-01',
];

const FALLBACK_SKIN = Object.keys(SKIN_COLORS);
const FALLBACK_HAIR_COLORS = Object.keys(HAIR_COLORS);
const FALLBACK_CLOTH = Object.keys(CLOTH_COLORS);

function pick<T>(items: T[], seed: number, divisor: number) {
  return items[Math.abs(Math.floor(seed / divisor)) % items.length];
}

function fallbackAppearance(seed: number, gender: Gender, lifeStage: LifeStageId, occupationId: string): ResidentAppearanceDNA {
  const isOlder = lifeStage === 'middle-age' || lifeStage === 'elder';
  const hairChoices = gender === 'female'
    ? FALLBACK_HAIR.filter((id) => id.includes('bun') || id.includes('tied'))
    : FALLBACK_HAIR.filter((id) => !id.includes('bun'));
  const occupationOutfit = occupationId.includes('physician')
    ? 'appearance.outfit.medical-01'
    : occupationId.includes('farmer')
      ? 'appearance.outfit.farm-01'
      : occupationId.includes('courier')
        ? 'appearance.outfit.transport-01'
        : occupationId.includes('lock-keeper')
          ? 'appearance.outfit.infrastructure-01'
          : occupationId.includes('student')
            ? 'appearance.outfit.student-plain-01'
            : 'appearance.outfit.generic-01';

  return {
    faceId: pick(FALLBACK_FACES, seed, 1),
    hairId: pick(hairChoices, seed, 7),
    browId: pick(FALLBACK_BROWS, seed, 13),
    facialHairId: gender === 'male' && isOlder && seed % 4 === 0 ? 'appearance.facial-hair.mustache-01' : 'appearance.facial-hair.none',
    headwearId: 'appearance.headwear.none',
    outfitId: occupationOutfit,
    skinPaletteId: pick(FALLBACK_SKIN, seed, 17),
    hairPaletteId: lifeStage === 'elder'
      ? (seed % 2 ? 'appearance.palette.hair.gray-01' : 'appearance.palette.hair.white-01')
      : pick(FALLBACK_HAIR_COLORS.slice(0, 3), seed, 29),
    clothingPaletteId: pick(FALLBACK_CLOTH, seed, 43),
  };
}

function facePath(faceId: string) {
  if (faceId.includes('round')) return 'M60 24 C45 24 38 34 38 49 C38 67 47 80 60 82 C73 80 82 67 82 49 C82 34 75 24 60 24Z';
  if (faceId.includes('long')) return 'M60 20 C46 20 40 31 40 48 C40 69 48 83 60 87 C72 83 80 69 80 48 C80 31 74 20 60 20Z';
  if (faceId.includes('square')) return 'M44 25 Q60 19 76 25 L81 49 Q80 70 72 79 Q60 86 48 79 Q40 70 39 49Z';
  if (faceId.includes('broad')) return 'M60 24 C42 24 36 36 38 53 C40 68 48 78 60 81 C72 78 80 68 82 53 C84 36 78 24 60 24Z';
  if (faceId.endsWith('02')) return 'M60 22 C47 22 39 32 39 49 C39 68 47 81 60 84 C73 81 81 68 81 49 C81 32 73 22 60 22Z';
  return 'M60 22 C45 22 38 33 39 50 C40 69 48 80 60 84 C72 80 80 69 81 50 C82 33 75 22 60 22Z';
}

function HairBack({ id, color }: { id: string; color: string }) {
  if (id.includes('bun-03')) return <><circle cx="60" cy="17" r="11" fill={color} /><path d="M42 31 Q60 17 78 31 L76 53 Q70 40 60 40 Q50 40 44 53Z" fill={color} /></>;
  if (id.includes('bun-02')) return <><ellipse cx="72" cy="22" rx="10" ry="8" fill={color} /><path d="M42 31 Q60 17 78 31 L76 55 Q69 40 60 40 Q51 40 44 55Z" fill={color} /></>;
  if (id.includes('bun-01')) return <><circle cx="60" cy="18" r="10" fill={color} /><path d="M43 31 Q60 18 77 31 L76 55 Q69 39 60 39 Q51 39 44 55Z" fill={color} /></>;
  if (id.includes('low-bun')) return <><circle cx="60" cy="61" r="9" fill={color} /><path d="M43 30 Q60 19 77 30 L77 54 Q69 40 60 40 Q51 40 43 54Z" fill={color} /></>;
  if (id.includes('tied')) return <><circle cx="60" cy="18" r={id.includes('03') ? 8 : 6} fill={color} /><path d="M44 29 Q60 19 76 29 L76 49 Q68 36 60 36 Q52 36 44 49Z" fill={color} /></>;
  return null;
}

function HairFront({ id, color }: { id: string; color: string }) {
  if (id.includes('cropped')) return <path d="M42 35 Q44 20 60 20 Q76 20 78 35 Q69 29 60 30 Q51 29 42 35Z" fill={color} />;
  if (id.includes('short-02')) return <path d="M41 37 Q42 20 60 20 Q77 20 79 35 Q69 31 61 28 Q52 33 41 37Z" fill={color} />;
  if (id.includes('short')) return <path d="M41 36 Q43 20 60 20 Q77 20 79 36 Q69 30 60 30 Q51 30 41 36Z" fill={color} />;
  if (id.includes('bun') || id.includes('tied')) return <path d="M42 36 Q44 22 60 22 Q76 22 78 36 Q70 31 64 29 L60 37 L56 29 Q50 31 42 36Z" fill={color} />;
  return <path d="M42 36 Q45 21 60 21 Q75 21 78 36 Q69 30 60 30 Q51 30 42 36Z" fill={color} />;
}

function Brows({ id, color }: { id: string; color: string }) {
  const width = id.includes('thick') ? 2.6 : id.includes('soft') ? 1.5 : 2;
  const left = id.includes('angled') ? 'M47 47 L55 45' : id.includes('soft') ? 'M47 47 Q51 44 55 46' : 'M47 46.5 Q51 45.5 55 46.5';
  const right = id.includes('angled') ? 'M65 45 L73 47' : id.includes('soft') ? 'M65 46 Q69 44 73 47' : 'M65 46.5 Q69 45.5 73 46.5';
  return <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity=".86"><path d={left} /><path d={right} /></g>;
}

function FacialHair({ id, color }: { id: string; color: string }) {
  if (id.includes('mustache-02')) return <path d="M51 64 Q56 60 60 63 Q64 60 69 64 Q65 66 60 65 Q55 66 51 64Z" fill={color} opacity=".9" />;
  if (id.includes('mustache')) return <path d="M53 63 Q57 60 60 63 Q63 60 67 63 Q64 65 60 64 Q56 65 53 63Z" fill={color} opacity=".88" />;
  if (id.includes('goatee')) return <path d="M56 65 Q60 68 64 65 L63 75 Q60 79 57 75Z" fill={color} opacity=".9" />;
  if (id.includes('beard-02')) return <path d="M48 64 Q60 72 72 64 L69 81 Q60 91 51 81Z" fill={color} opacity=".9" />;
  if (id.includes('beard')) return <path d="M50 65 Q60 71 70 65 L67 77 Q60 84 53 77Z" fill={color} opacity=".88" />;
  return null;
}

function Headwear({ id, color }: { id: string; color: string }) {
  if (id.endsWith('.none')) return null;
  if (id.includes('sun-hat')) return <g><ellipse cx="60" cy="28" rx="31" ry="7" fill="#8a785e" /><path d="M42 28 Q60 5 78 28Z" fill="#9a886a" /><path d="M45 26 Q60 11 75 26" fill="none" stroke="#c0aa82" strokeWidth="1.5" opacity=".7" /></g>;
  if (id.includes('scholar-cap')) return <g fill={color}><path d="M44 30 Q60 21 76 30 L73 20 Q60 15 47 20Z" /><path d="M47 20 L43 14 L53 19Z" /><path d="M73 20 L77 14 L67 19Z" /></g>;
  if (id.includes('medical-cloth')) return <g><path d="M43 31 Q60 19 77 31 L75 24 Q60 18 45 24Z" fill={color} /><rect x="43" y="29" width="34" height="5" rx="2" fill="#8a7b68" opacity=".9" /></g>;
  if (id.includes('trade-cap-02')) return <g fill={color}><path d="M45 32 Q60 20 75 32 L72 22 H48Z" /><rect x="44" y="30" width="32" height="5" rx="2" /></g>;
  if (id.includes('trade-cap')) return <g fill={color}><path d="M46 32 Q60 20 74 32 L71 23 H49Z" /><rect x="45" y="30" width="30" height="4" rx="2" /></g>;
  if (id.includes('work-cloth-02')) return <g><path d="M43 31 Q60 22 77 31" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" /><path d="M75 30 L85 36 L76 38Z" fill={color} /></g>;
  if (id.includes('work-cloth')) return <g><path d="M44 31 Q60 22 76 31" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" /><circle cx="78" cy="32" r="4" fill={color} /></g>;
  return null;
}

function Outfit({ id, color }: { id: string; color: string }) {
  const collar = id.includes('student') || id.includes('medical') ? '#d5cfbe' : '#b7ad97';
  const wider = id.includes('farm') || id.includes('transport') || id.includes('craft');
  return (
    <g>
      <path d={wider ? 'M23 118 Q27 88 48 82 H72 Q93 88 97 118Z' : 'M27 118 Q31 89 49 82 H71 Q89 89 93 118Z'} fill={color} />
      <path d="M49 82 L60 96 L71 82" fill="none" stroke={collar} strokeWidth="5" strokeLinejoin="round" opacity=".88" />
      <path d="M60 96 V116" stroke="#2b2d2a" strokeWidth="1.2" opacity=".18" />
      {id.includes('medical') && <path d="M45 99 H75" stroke="#d7d0bf" strokeWidth="1.6" opacity=".65" />}
    </g>
  );
}

export function appearanceSignature(appearance: ResidentAppearanceDNA) {
  return [
    appearance.faceId,
    appearance.hairId,
    appearance.browId,
    appearance.facialHairId,
    appearance.headwearId,
    appearance.outfitId,
    appearance.skinPaletteId,
    appearance.hairPaletteId,
    appearance.clothingPaletteId,
  ].join('|');
}

export function ResidentAvatar({ seed = 1, gender, lifeStage, occupationId = '', appearance, label }: Props) {
  const dna = appearance ?? fallbackAppearance(seed, gender, lifeStage, occupationId);
  const skin = SKIN_COLORS[dna.skinPaletteId] ?? '#c79d79';
  const hair = HAIR_COLORS[dna.hairPaletteId] ?? '#292320';
  const cloth = CLOTH_COLORS[dna.clothingPaletteId] ?? '#66706b';
  const headwearColor = dna.headwearId.includes('scholar') ? '#4d555a' : dna.headwearId.includes('medical') ? '#777064' : cloth;
  const isMiddle = lifeStage === 'middle-age';
  const isElder = lifeStage === 'elder';
  const isChild = lifeStage === 'child' || lifeStage === 'teen';

  return (
    <div
      className={`generated-portrait generated-portrait--svg gender-${gender} age-${lifeStage}`}
      data-appearance-signature={appearanceSignature(dna)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 120 120" focusable="false" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`portrait-bg-${Math.abs(seed)}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#39463f" />
            <stop offset="1" stopColor="#27342f" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="22" fill={`url(#portrait-bg-${Math.abs(seed)})`} />
        <circle cx="60" cy="43" r="47" fill="#d7cba8" opacity=".06" />
        <HairBack id={dna.hairId} color={hair} />
        <Outfit id={dna.outfitId} color={cloth} />
        <path d="M53 78 H67 L68 91 Q60 96 52 91Z" fill={skin} />
        <ellipse cx="41" cy="53" rx={isChild ? 4 : 4.7} ry="6.5" fill={skin} />
        <ellipse cx="79" cy="53" rx={isChild ? 4 : 4.7} ry="6.5" fill={skin} />
        <path d={facePath(dna.faceId)} fill={skin} />
        <path d="M47 53 Q51 51 55 53" fill="none" stroke="#41332b" strokeWidth="1.7" strokeLinecap="round" opacity=".78" />
        <path d="M65 53 Q69 51 73 53" fill="none" stroke="#41332b" strokeWidth="1.7" strokeLinecap="round" opacity=".78" />
        <Brows id={dna.browId} color={hair} />
        <path d="M60 53 Q57 61 60 62 Q63 62 64 60" fill="none" stroke="#855f4a" strokeWidth="1.1" strokeLinecap="round" opacity=".48" />
        <path d="M54 69 Q60 72 66 69" fill="none" stroke="#7d4f45" strokeWidth="1.5" strokeLinecap="round" opacity=".72" />
        {(isMiddle || isElder) && <g fill="none" stroke="#735a49" strokeWidth=".8" opacity={isElder ? '.42' : '.24'}><path d="M45 57 Q49 59 53 58" /><path d="M67 58 Q71 59 75 57" /></g>}
        {isElder && <g fill="none" stroke="#735a49" strokeWidth=".75" opacity=".35"><path d="M49 72 Q60 76 71 72" /><path d="M44 63 Q46 68 48 70" /><path d="M76 63 Q74 68 72 70" /></g>}
        <HairFront id={dna.hairId} color={hair} />
        <FacialHair id={dna.facialHairId} color={hair} />
        <Headwear id={dna.headwearId} color={headwearColor} />
      </svg>
    </div>
  );
}
