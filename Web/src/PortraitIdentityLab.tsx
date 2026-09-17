import { useEffect, useMemo, useState } from 'react';
import type {
  AppearancePaletteDefinition,
  AppearancePartDefinition,
  Gender,
  LifeStageId,
  PresentationStyle,
  ResidentAppearanceDNA,
  ResidentDefinitions,
  WealthTier,
} from './domain/resident';
import { appearanceSignature, ResidentAvatar } from './resident/ResidentAvatar';
import {
  compatibilityMultiplier,
  faceFamilyForId,
  hairVisibilityForHeadwear,
  portraitDiagnostics,
  type PortraitFaceFamily,
  type PortraitLayer,
} from './resident/portrait-rig';

type LabSample = {
  id: string;
  seed: number;
  displayName: string;
  gender: Gender;
  lifeStage: LifeStageId;
  age: number;
  occupationId: string;
  occupationName: string;
  wealthTier: WealthTier;
  presentationStyle: PresentationStyle;
  appearance: ResidentAppearanceDNA;
  showcase: boolean;
};

type FilterGender = 'all' | Gender;
type FilterStage = 'all' | 'young' | 'adult' | 'older';
type FilterFaceFamily = 'all' | PortraitFaceFamily;
type FilterWealth = 'all' | WealthTier;
type FilterPresentation = 'all' | PresentationStyle;
type RiggedPart = AppearancePartDefinition & { faceFamily?: PortraitFaceFamily };

const STAGE_AGES: Record<LifeStageId, number> = {
  child: 9,
  teen: 15,
  'young-adult': 23,
  adult: 37,
  'middle-age': 52,
  elder: 69,
};

const STAGE_LABELS: Record<LifeStageId, string> = {
  child: '孩童',
  teen: '少年',
  'young-adult': '青年',
  adult: '成年',
  'middle-age': '中年',
  elder: '老年',
};

const FACE_LABELS: Record<PortraitFaceFamily, string> = {
  oval: '椭圆',
  round: '圆脸',
  long: '长脸',
  square: '方脸',
  broad: '宽脸',
};

const WEALTH_LABELS: Record<WealthTier, string> = {
  poor: '贫寒',
  plain: '普通',
  comfortable: '殷实',
  wealthy: '富裕',
};

const PRESENTATION_LABELS: Record<PresentationStyle, string> = {
  practical: '实用',
  tidy: '整洁',
  refined: '讲究',
};

const SHOWCASE: Array<{ gender: Gender; wealthTier: WealthTier; presentationStyle: PresentationStyle; lifeStage: LifeStageId }> = [
  { gender: 'female', wealthTier: 'poor', presentationStyle: 'practical', lifeStage: 'adult' },
  { gender: 'female', wealthTier: 'plain', presentationStyle: 'tidy', lifeStage: 'young-adult' },
  { gender: 'female', wealthTier: 'comfortable', presentationStyle: 'tidy', lifeStage: 'adult' },
  { gender: 'female', wealthTier: 'wealthy', presentationStyle: 'refined', lifeStage: 'adult' },
  { gender: 'female', wealthTier: 'wealthy', presentationStyle: 'refined', lifeStage: 'elder' },
  { gender: 'male', wealthTier: 'poor', presentationStyle: 'practical', lifeStage: 'adult' },
  { gender: 'male', wealthTier: 'comfortable', presentationStyle: 'tidy', lifeStage: 'adult' },
  { gender: 'male', wealthTier: 'wealthy', presentationStyle: 'refined', lifeStage: 'adult' },
];

const SLOT_ORDER = ['face', 'hair', 'brow', 'facial-hair', 'headwear', 'outfit'] as const;
const PALETTE_ORDER = ['skin', 'hair', 'clothing'] as const;
const DIAGNOSTIC_LAYERS: Array<{ id: PortraitLayer; label: string }> = [
  { id: 'hair', label: '头发' },
  { id: 'brow', label: '眉毛' },
  { id: 'facial-hair', label: '胡须' },
  { id: 'headwear', label: '头饰' },
  { id: 'outfit', label: '服装' },
];

function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick<T>(items: T[], rng: () => number, weightOf: (item: T) => number): T {
  if (!items.length) throw new Error('头像实验室候选池为空');
  const total = items.reduce((sum, item) => sum + Math.max(0, weightOf(item)), 0);
  let cursor = rng() * Math.max(1, total);
  for (const item of items) {
    cursor -= Math.max(0, weightOf(item));
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function matchesAppearanceRule(
  item: AppearancePartDefinition | AppearancePaletteDefinition,
  gender: Gender,
  lifeStage: LifeStageId,
  wealthTier: WealthTier,
  presentationStyle: PresentationStyle,
) {
  if (item.genders?.length && !item.genders.includes(gender)) return false;
  if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
  if (item.wealthTiers?.length && !item.wealthTiers.includes(wealthTier)) return false;
  if (item.presentationStyles?.length && !item.presentationStyles.includes(presentationStyle)) return false;
  return true;
}

function choosePart(
  definitions: ResidentDefinitions,
  slot: (typeof SLOT_ORDER)[number],
  gender: Gender,
  lifeStage: LifeStageId,
  wealthTier: WealthTier,
  presentationStyle: PresentationStyle,
  rng: () => number,
  faceFamily?: PortraitFaceFamily,
) {
  const slotItems = definitions.appearanceCatalog.parts.filter((item) => item.slot === slot);
  const exact = slotItems.filter((item) => matchesAppearanceRule(item, gender, lifeStage, wealthTier, presentationStyle));
  const relaxedStyle = slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    if (item.wealthTiers?.length && !item.wealthTiers.includes(wealthTier)) return false;
    return !item.presentationStyles?.length;
  });
  const candidates = exact.length ? exact : relaxedStyle.length ? relaxedStyle : slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    return !item.wealthTiers?.length && !item.presentationStyles?.length;
  });
  return weightedPick(candidates.length ? candidates : slotItems, rng, (item) => item.weight * (faceFamily ? compatibilityMultiplier(item, faceFamily) : 1));
}

function choosePalette(
  definitions: ResidentDefinitions,
  slot: (typeof PALETTE_ORDER)[number],
  gender: Gender,
  lifeStage: LifeStageId,
  wealthTier: WealthTier,
  presentationStyle: PresentationStyle,
  rng: () => number,
) {
  const slotItems = definitions.appearanceCatalog.palettes.filter((item) => item.slot === slot);
  const exact = slotItems.filter((item) => matchesAppearanceRule(item, gender, lifeStage, wealthTier, presentationStyle));
  const candidates = exact.length ? exact : slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    return !item.wealthTiers?.length && !item.presentationStyles?.length;
  });
  return weightedPick(candidates.length ? candidates : slotItems, rng, (item) => item.weight);
}

function chooseStage(rng: () => number): LifeStageId {
  const roll = rng();
  if (roll < 0.08) return 'child';
  if (roll < 0.17) return 'teen';
  if (roll < 0.38) return 'young-adult';
  if (roll < 0.67) return 'adult';
  if (roll < 0.86) return 'middle-age';
  return 'elder';
}

function chooseWealth(rng: () => number): WealthTier {
  const roll = rng();
  if (roll < 0.2) return 'poor';
  if (roll < 0.65) return 'plain';
  if (roll < 0.92) return 'comfortable';
  return 'wealthy';
}

function choosePresentation(wealthTier: WealthTier, rng: () => number): PresentationStyle {
  const roll = rng();
  if (wealthTier === 'poor') return roll < 0.72 ? 'practical' : 'tidy';
  if (wealthTier === 'plain') return roll < 0.42 ? 'practical' : roll < 0.9 ? 'tidy' : 'refined';
  if (wealthTier === 'comfortable') return roll < 0.2 ? 'practical' : roll < 0.76 ? 'tidy' : 'refined';
  return roll < 0.42 ? 'tidy' : 'refined';
}

function buildSample(definitions: ResidentDefinitions, batchSeed: number, index: number): LabSample {
  const seed = (batchSeed * 2654435761 + index * 2246822519 + 97) >>> 0;
  const rng = createRng(seed);
  const showcase = SHOWCASE[index];
  const gender: Gender = showcase?.gender ?? (rng() < 0.5 ? 'male' : 'female');
  const lifeStage = showcase?.lifeStage ?? chooseStage(rng);
  const wealthTier = showcase?.wealthTier ?? chooseWealth(rng);
  const presentationStyle = showcase?.presentationStyle ?? choosePresentation(wealthTier, rng);
  const age = STAGE_AGES[lifeStage] + Math.floor(rng() * (lifeStage === 'elder' ? 10 : 5));

  const occupations = definitions.occupations.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    return age >= item.minAge && age <= item.maxAge;
  });
  const occupation = weightedPick(occupations.length ? occupations : definitions.occupations, rng, (item) => item.weight);

  const surname = weightedPick(definitions.nameCatalog.surnames, rng, (item) => item.weight);
  const givenPool = definitions.nameCatalog.givenNames.filter((item) => !item.gender || item.gender === 'unisex' || item.gender === gender);
  const givenName = weightedPick(givenPool, rng, (item) => item.weight);

  const face = choosePart(definitions, 'face', gender, lifeStage, wealthTier, presentationStyle, rng) as RiggedPart;
  const faceFamily = face.faceFamily ?? faceFamilyForId(definitions.appearanceCatalog, face.id);
  const parts: Record<string, string> = { face: face.id };
  for (const slot of SLOT_ORDER.filter((value) => value !== 'face')) {
    parts[slot] = choosePart(definitions, slot, gender, lifeStage, wealthTier, presentationStyle, rng, faceFamily).id;
  }
  const palettes = Object.fromEntries(PALETTE_ORDER.map((slot) => [slot, choosePalette(definitions, slot, gender, lifeStage, wealthTier, presentationStyle, rng).id]));

  const appearance: ResidentAppearanceDNA = {
    faceId: parts.face,
    hairId: parts.hair,
    browId: parts.brow,
    facialHairId: parts['facial-hair'],
    headwearId: parts.headwear,
    outfitId: parts.outfit,
    skinPaletteId: palettes.skin,
    hairPaletteId: palettes.hair,
    clothingPaletteId: palettes.clothing,
  };

  return {
    id: `portrait-${batchSeed}-${index}`,
    seed,
    displayName: `${surname.text}${givenName.text}`,
    gender,
    lifeStage,
    age,
    occupationId: occupation.id,
    occupationName: occupation.name,
    wealthTier,
    presentationStyle,
    appearance,
    showcase: Boolean(showcase),
  };
}

function matchesStageFilter(sample: LabSample, filter: FilterStage) {
  if (filter === 'all') return true;
  if (filter === 'young') return sample.lifeStage === 'child' || sample.lifeStage === 'teen' || sample.lifeStage === 'young-adult';
  if (filter === 'adult') return sample.lifeStage === 'adult';
  return sample.lifeStage === 'middle-age' || sample.lifeStage === 'elder';
}

function shortId(value: string) {
  return value.replace(/^appearance\./, '');
}

export function PortraitIdentityLab() {
  const [definitions, setDefinitions] = useState<ResidentDefinitions | null>(null);
  const [error, setError] = useState('');
  const [batchSeed, setBatchSeed] = useState(5301);
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');
  const [stageFilter, setStageFilter] = useState<FilterStage>('all');
  const [faceFilter, setFaceFilter] = useState<FilterFaceFamily>('all');
  const [wealthFilter, setWealthFilter] = useState<FilterWealth>('all');
  const [presentationFilter, setPresentationFilter] = useState<FilterPresentation>('all');
  const [problemOnly, setProblemOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRig, setShowRig] = useState(false);
  const [hiddenLayers, setHiddenLayers] = useState<PortraitLayer[]>([]);

  useEffect(() => {
    fetch('/generated/definitions.json')
      .then((response) => {
        if (!response.ok) throw new Error(`居民定义读取失败：HTTP ${response.status}`);
        return response.json() as Promise<ResidentDefinitions>;
      })
      .then(setDefinitions)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const samples = useMemo(() => definitions ? Array.from({ length: 64 }, (_, index) => buildSample(definitions, batchSeed, index)) : [], [definitions, batchSeed]);

  const visibleSamples = useMemo(() => samples.filter((sample) => {
    if (!definitions) return false;
    if (genderFilter !== 'all' && sample.gender !== genderFilter) return false;
    if (!matchesStageFilter(sample, stageFilter)) return false;
    if (faceFilter !== 'all' && faceFamilyForId(definitions.appearanceCatalog, sample.appearance.faceId) !== faceFilter) return false;
    if (wealthFilter !== 'all' && sample.wealthTier !== wealthFilter) return false;
    if (presentationFilter !== 'all' && sample.presentationStyle !== presentationFilter) return false;
    if (problemOnly) {
      const diagnostic = portraitDiagnostics(sample.appearance, definitions.appearanceCatalog, sample.gender, sample.lifeStage);
      if (diagnostic.errors.length + diagnostic.warnings.length === 0) return false;
    }
    return true;
  }), [samples, definitions, genderFilter, stageFilter, faceFilter, wealthFilter, presentationFilter, problemOnly]);

  const selected = visibleSamples.find((sample) => sample.id === selectedId) ?? visibleSamples[0] ?? samples[0];

  const diversity = useMemo(() => {
    if (!definitions) return { signatures: 0, faces: 0, hairs: 0, headwear: 0, errors: 0, warnings: 0 };
    let errors = 0;
    let warnings = 0;
    for (const sample of visibleSamples) {
      const diagnostic = portraitDiagnostics(sample.appearance, definitions.appearanceCatalog, sample.gender, sample.lifeStage);
      errors += diagnostic.errors.length;
      warnings += diagnostic.warnings.length;
    }
    return {
      signatures: new Set(visibleSamples.map((sample) => appearanceSignature(sample.appearance))).size,
      faces: new Set(visibleSamples.map((sample) => sample.appearance.faceId)).size,
      hairs: new Set(visibleSamples.map((sample) => sample.appearance.hairId)).size,
      headwear: new Set(visibleSamples.map((sample) => sample.appearance.headwearId)).size,
      errors,
      warnings,
    };
  }, [visibleSamples, definitions]);

  if (error) return <main className="portrait-lab portrait-lab--center"><section><b>头像实验室读取失败</b><p>{error}</p></section></main>;
  if (!definitions) return <main className="portrait-lab portrait-lab--center"><section><b>正在生成头像样本…</b></section></main>;

  const selectedFamily = selected ? faceFamilyForId(definitions.appearanceCatalog, selected.appearance.faceId) : 'oval';
  const selectedDiagnostic = selected ? portraitDiagnostics(selected.appearance, definitions.appearanceCatalog, selected.gender, selected.lifeStage) : { errors: [], warnings: [] };
  const selectedHairVisibility = selected ? hairVisibilityForHeadwear(definitions.appearanceCatalog, selected.appearance.headwearId) : 'full';

  function toggleLayer(layer: PortraitLayer) {
    setHiddenLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  }

  return (
    <main className="portrait-lab">
      <header className="portrait-lab__header">
        <div>
          <span className="portrait-lab__eyebrow">PORTRAIT LAB V4 · HOUSEHOLD WEALTH</span>
          <h1>居民头像实验室</h1>
          <p>头像由性别、年龄、家庭财富和生活讲究程度驱动。职业只显示这个人在做什么，不再直接决定衣服或帽子。女性重点验证长发、垂发、辫子和盘发在小头像中的轮廓辨识度。</p>
        </div>
        <div className="portrait-lab__header-actions">
          <button type="button" onClick={() => { setBatchSeed((value) => value + 1); setSelectedId(null); }}>换一批</button>
          <button type="button" onClick={() => { window.location.href = '/'; }}>返回居民 Demo</button>
        </div>
      </header>

      <section className="portrait-lab__metrics" aria-label="头像组合统计">
        <div><span>当前样本</span><b>{visibleSamples.length}</b></div>
        <div><span>唯一组合</span><b>{diversity.signatures}</b></div>
        <div><span>脸型</span><b>{diversity.faces}</b></div>
        <div><span>发型</span><b>{diversity.hairs}</b></div>
        <div><span>头饰</span><b>{diversity.headwear}</b></div>
        <div><span>硬错误</span><b className={diversity.errors ? 'is-error' : ''}>{diversity.errors}</b></div>
        <div><span>兼容提醒</span><b className={diversity.warnings ? 'is-warn' : ''}>{diversity.warnings}</b></div>
      </section>

      <section className="portrait-lab__filters" aria-label="头像筛选">
        <div><span>性别</span>{(['all', 'male', 'female'] as FilterGender[]).map((value) => <button key={value} type="button" className={genderFilter === value ? 'is-active' : ''} onClick={() => { setGenderFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : value === 'male' ? '男' : '女'}</button>)}</div>
        <div><span>财富</span>{(['all', 'poor', 'plain', 'comfortable', 'wealthy'] as FilterWealth[]).map((value) => <button key={value} type="button" className={wealthFilter === value ? 'is-active' : ''} onClick={() => { setWealthFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : WEALTH_LABELS[value]}</button>)}</div>
        <div><span>状态</span>{(['all', 'practical', 'tidy', 'refined'] as FilterPresentation[]).map((value) => <button key={value} type="button" className={presentationFilter === value ? 'is-active' : ''} onClick={() => { setPresentationFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : PRESENTATION_LABELS[value]}</button>)}</div>
        <div><span>年龄</span>{(['all', 'young', 'adult', 'older'] as FilterStage[]).map((value) => <button key={value} type="button" className={stageFilter === value ? 'is-active' : ''} onClick={() => { setStageFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : value === 'young' ? '少年 / 青年' : value === 'adult' ? '成年' : '中老年'}</button>)}</div>
        <div><span>脸型</span>{(['all', 'oval', 'round', 'long', 'square', 'broad'] as FilterFaceFamily[]).map((value) => <button key={value} type="button" className={faceFilter === value ? 'is-active' : ''} onClick={() => { setFaceFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : FACE_LABELS[value]}</button>)}</div>
        <div><span>诊断</span><button type="button" className={problemOnly ? 'is-active' : ''} onClick={() => setProblemOnly((value) => !value)}>只看异常</button></div>
        <small>批次 Seed {batchSeed}</small>
      </section>

      <div className="portrait-lab__workspace">
        <section className="portrait-lab__grid" aria-label="随机头像样本">
          {visibleSamples.map((sample) => {
            const signature = appearanceSignature(sample.appearance);
            const diagnostic = portraitDiagnostics(sample.appearance, definitions.appearanceCatalog, sample.gender, sample.lifeStage);
            return (
              <button type="button" className={`portrait-lab-card ${selected?.id === sample.id ? 'is-selected' : ''}`} key={sample.id}
                data-signature={signature}
                data-gender={sample.gender}
                data-wealth-tier={sample.wealthTier}
                data-presentation-style={sample.presentationStyle}
                data-hair-id={sample.appearance.hairId}
                data-outfit-id={sample.appearance.outfitId}
                data-rig-errors={diagnostic.errors.length}
                data-rig-warnings={diagnostic.warnings.length}
                data-showcase={sample.showcase ? 'true' : 'false'}
                onClick={() => setSelectedId(sample.id)}>
                <div className="portrait-lab-card__portrait">
                  <ResidentAvatar seed={sample.seed} gender={sample.gender} lifeStage={sample.lifeStage} occupationId={sample.occupationId} appearance={sample.appearance} catalog={definitions.appearanceCatalog} label={`${sample.displayName}的头像`}/>
                  {(diagnostic.errors.length > 0 || diagnostic.warnings.length > 0) && <i className={diagnostic.errors.length ? 'is-error' : 'is-warn'}>{diagnostic.errors.length ? '!' : '·'}</i>}
                </div>
                <b>{sample.displayName}</b>
                <span>{sample.age}岁 · {sample.occupationName}</span>
                <small className="portrait-lab-card__role">{sample.gender === 'female' ? '女' : '男'} · {WEALTH_LABELS[sample.wealthTier]} · {PRESENTATION_LABELS[sample.presentationStyle]}{sample.showcase ? ' · 样本' : ''}</small>
              </button>
            );
          })}
          {visibleSamples.length === 0 && <div className="portrait-lab__empty">当前筛选没有样本。换一批或放宽筛选继续检查。</div>}
        </section>

        {selected && (
          <aside className="portrait-lab__inspector" aria-label="头像 DNA 与财富诊断">
            <div className="portrait-lab__hero"><ResidentAvatar seed={selected.seed} gender={selected.gender} lifeStage={selected.lifeStage} occupationId={selected.occupationId} appearance={selected.appearance} catalog={definitions.appearanceCatalog} debugRig={showRig} hiddenLayers={hiddenLayers} label={`${selected.displayName}的大头像`}/></div>
            <div className="portrait-lab__identity">
              <h2>{selected.displayName}</h2>
              <p>{selected.age}岁 · {selected.occupationName}</p>
              <span>{selected.gender === 'female' ? '女' : '男'} · {STAGE_LABELS[selected.lifeStage]} · {WEALTH_LABELS[selected.wealthTier]} · {PRESENTATION_LABELS[selected.presentationStyle]} · {FACE_LABELS[selectedFamily]}</span>
            </div>
            <div className="portrait-lab__diagnostic-controls">
              <div className="portrait-lab__diagnostic-heading"><b>财富 / 性别装配</b><span>Hair {selectedHairVisibility}</span></div>
              <div className="portrait-lab__layer-buttons">
                <button type="button" className={showRig ? 'is-active' : ''} onClick={() => setShowRig((value) => !value)}>{showRig ? '隐藏锚点' : '显示锚点'}</button>
                {DIAGNOSTIC_LAYERS.map((layer) => <button key={layer.id} type="button" className={!hiddenLayers.includes(layer.id) ? 'is-active' : ''} onClick={() => toggleLayer(layer.id)}>{layer.label}</button>)}
              </div>
              <div className={`portrait-lab__diagnostic-status ${selectedDiagnostic.errors.length ? 'is-error' : selectedDiagnostic.warnings.length ? 'is-warn' : 'is-ok'}`}>
                <b>{selectedDiagnostic.errors.length ? `${selectedDiagnostic.errors.length} 个硬错误` : selectedDiagnostic.warnings.length ? `${selectedDiagnostic.warnings.length} 个兼容提醒` : '装配检查通过'}</b>
                {[...selectedDiagnostic.errors, ...selectedDiagnostic.warnings].map((message) => <span key={message}>{message}</span>)}
              </div>
            </div>
            <div className="portrait-lab__dna">
              <b>AppearanceDNA</b>
              <dl>
                <div><dt>Face</dt><dd>{shortId(selected.appearance.faceId)}</dd></div><div><dt>Hair</dt><dd>{shortId(selected.appearance.hairId)}</dd></div><div><dt>Brow</dt><dd>{shortId(selected.appearance.browId)}</dd></div><div><dt>Facial Hair</dt><dd>{shortId(selected.appearance.facialHairId)}</dd></div><div><dt>Headwear</dt><dd>{shortId(selected.appearance.headwearId)}</dd></div><div><dt>Outfit</dt><dd>{shortId(selected.appearance.outfitId)}</dd></div><div><dt>Skin</dt><dd>{shortId(selected.appearance.skinPaletteId)}</dd></div><div><dt>Hair Color</dt><dd>{shortId(selected.appearance.hairPaletteId)}</dd></div><div><dt>Clothing</dt><dd>{shortId(selected.appearance.clothingPaletteId)}</dd></div>
              </dl>
            </div>
            <p className="portrait-lab__note">同住家庭共享财富档与生活讲究程度。职业名称只保留为居民信息，不参与服饰候选池；财富主要影响布料层次、配色与附件，性别和年龄决定发型与生理合理性。</p>
          </aside>
        )}
      </div>
    </main>
  );
}
