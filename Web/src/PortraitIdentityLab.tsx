import { useEffect, useMemo, useState } from 'react';
import type {
  AppearancePaletteDefinition,
  AppearancePartDefinition,
  Gender,
  LifeStageId,
  ResidentAppearanceDNA,
  ResidentDefinitions,
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
  occupationGroupId: string;
  appearance: ResidentAppearanceDNA;
  showcase: boolean;
};

type FilterGender = 'all' | Gender;
type FilterStage = 'all' | 'young' | 'adult' | 'older';
type FilterFaceFamily = 'all' | PortraitFaceFamily;
type FilterIdentity = 'all' | 'administration' | 'education' | 'trade' | 'craft' | 'medical';

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

const IDENTITY_GROUPS: Record<Exclude<FilterIdentity, 'all'>, { groupId: string; label: string }> = {
  administration: { groupId: 'occupation-group.administration', label: '官署' },
  education: { groupId: 'occupation-group.education', label: '学业' },
  trade: { groupId: 'occupation-group.trade', label: '商贸' },
  craft: { groupId: 'occupation-group.craft', label: '手艺' },
  medical: { groupId: 'occupation-group.medical', label: '医护' },
};

const SHOWCASE: Array<{ groupId: string; gender: Gender }> = [
  { groupId: 'occupation-group.administration', gender: 'male' },
  { groupId: 'occupation-group.administration', gender: 'male' },
  { groupId: 'occupation-group.education', gender: 'male' },
  { groupId: 'occupation-group.trade', gender: 'female' },
  { groupId: 'occupation-group.trade', gender: 'female' },
  { groupId: 'occupation-group.craft', gender: 'female' },
  { groupId: 'occupation-group.medical', gender: 'female' },
  { groupId: 'occupation-group.agriculture', gender: 'female' },
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
  occupationGroupId: string,
) {
  if (item.genders?.length && !item.genders.includes(gender)) return false;
  if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
  if (item.occupationGroups?.length && !item.occupationGroups.includes(occupationGroupId)) return false;
  return true;
}

function choosePart(
  definitions: ResidentDefinitions,
  slot: (typeof SLOT_ORDER)[number],
  gender: Gender,
  lifeStage: LifeStageId,
  occupationGroupId: string,
  rng: () => number,
  faceFamily?: PortraitFaceFamily,
) {
  const slotItems = definitions.appearanceCatalog.parts.filter((item) => item.slot === slot);
  const exact = slotItems.filter((item) => matchesAppearanceRule(item, gender, lifeStage, occupationGroupId));
  const relaxed = slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    return !item.occupationGroups?.length;
  });
  const candidates = exact.length ? exact : relaxed.length ? relaxed : slotItems;
  return weightedPick(candidates, rng, (item) => item.weight * (faceFamily ? compatibilityMultiplier(item, faceFamily) : 1));
}

function choosePalette(
  definitions: ResidentDefinitions,
  slot: (typeof PALETTE_ORDER)[number],
  gender: Gender,
  lifeStage: LifeStageId,
  occupationGroupId: string,
  rng: () => number,
) {
  const slotItems = definitions.appearanceCatalog.palettes.filter((item) => item.slot === slot);
  const exact = slotItems.filter((item) => matchesAppearanceRule(item, gender, lifeStage, occupationGroupId));
  const relaxed = slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    return !item.occupationGroups?.length;
  });
  return weightedPick(exact.length ? exact : relaxed.length ? relaxed : slotItems, rng, (item) => item.weight);
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

function buildSample(definitions: ResidentDefinitions, batchSeed: number, index: number): LabSample {
  const seed = (batchSeed * 2654435761 + index * 2246822519 + 97) >>> 0;
  const rng = createRng(seed);
  const showcase = SHOWCASE[index];
  const gender: Gender = showcase?.gender ?? (rng() < 0.5 ? 'male' : 'female');
  const lifeStage: LifeStageId = showcase ? 'adult' : chooseStage(rng);
  const age = STAGE_AGES[lifeStage] + Math.floor(rng() * (lifeStage === 'elder' ? 10 : 5));
  const occupations = definitions.occupations.filter((item) => {
    if (showcase && item.groupId !== showcase.groupId) return false;
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    return age >= item.minAge && age <= item.maxAge;
  });
  const fallbackOccupations = definitions.occupations.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    return age >= item.minAge && age <= item.maxAge;
  });
  const occupation = weightedPick(occupations.length ? occupations : fallbackOccupations, rng, (item) => item.weight);
  const occupationGroupId = occupation.groupId;

  const surname = weightedPick(definitions.nameCatalog.surnames, rng, (item) => item.weight);
  const givenPool = definitions.nameCatalog.givenNames.filter((item) => !item.gender || item.gender === 'unisex' || item.gender === gender);
  const givenName = weightedPick(givenPool, rng, (item) => item.weight);

  const face = choosePart(definitions, 'face', gender, lifeStage, occupationGroupId, rng) as RiggedPart;
  const faceFamily = face.faceFamily ?? faceFamilyForId(definitions.appearanceCatalog, face.id);
  const parts: Record<string, string> = { face: face.id };
  for (const slot of SLOT_ORDER.filter((value) => value !== 'face')) {
    parts[slot] = choosePart(definitions, slot, gender, lifeStage, occupationGroupId, rng, faceFamily).id;
  }
  const palettes = Object.fromEntries(PALETTE_ORDER.map((slot) => [slot, choosePalette(definitions, slot, gender, lifeStage, occupationGroupId, rng).id]));

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
    occupationGroupId,
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

function groupLabel(definitions: ResidentDefinitions, groupId: string) {
  return definitions.occupationGroups.find((item) => item.id === groupId)?.label ?? groupId;
}

export function PortraitIdentityLab() {
  const [definitions, setDefinitions] = useState<ResidentDefinitions | null>(null);
  const [error, setError] = useState('');
  const [batchSeed, setBatchSeed] = useState(4201);
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');
  const [stageFilter, setStageFilter] = useState<FilterStage>('all');
  const [faceFilter, setFaceFilter] = useState<FilterFaceFamily>('all');
  const [identityFilter, setIdentityFilter] = useState<FilterIdentity>('all');
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

  const samples = useMemo(() => definitions
    ? Array.from({ length: 64 }, (_, index) => buildSample(definitions, batchSeed, index))
    : [], [definitions, batchSeed]);

  const visibleSamples = useMemo(() => samples.filter((sample) => {
    if (!definitions) return false;
    if (genderFilter !== 'all' && sample.gender !== genderFilter) return false;
    if (!matchesStageFilter(sample, stageFilter)) return false;
    if (faceFilter !== 'all' && faceFamilyForId(definitions.appearanceCatalog, sample.appearance.faceId) !== faceFilter) return false;
    if (identityFilter !== 'all' && sample.occupationGroupId !== IDENTITY_GROUPS[identityFilter].groupId) return false;
    if (problemOnly) {
      const diagnostic = portraitDiagnostics(sample.appearance, definitions.appearanceCatalog, sample.gender, sample.lifeStage);
      if (diagnostic.errors.length + diagnostic.warnings.length === 0) return false;
    }
    return true;
  }), [samples, definitions, genderFilter, stageFilter, faceFilter, identityFilter, problemOnly]);

  const selected = visibleSamples.find((sample) => sample.id === selectedId)
    ?? visibleSamples[0]
    ?? samples[0];

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
          <span className="portrait-lab__eyebrow">PORTRAIT LAB V3 · IDENTITY DRIVEN</span>
          <h1>居民头像实验室</h1>
          <p>64 个样本中前 8 个固定覆盖官署、书生、女商贩、女工匠、女医护和女农户，其余继续随机。目标是验证“看得出是谁”，而不是只追求组合数量。</p>
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
        <div><span>身份</span>{(['all', 'administration', 'education', 'trade', 'craft', 'medical'] as FilterIdentity[]).map((value) => <button key={value} type="button" className={identityFilter === value ? 'is-active' : ''} onClick={() => { setIdentityFilter(value); setSelectedId(null); }}>{value === 'all' ? '全部' : IDENTITY_GROUPS[value].label}</button>)}</div>
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
              <button
                type="button"
                className={`portrait-lab-card ${selected?.id === sample.id ? 'is-selected' : ''}`}
                key={sample.id}
                data-signature={signature}
                data-gender={sample.gender}
                data-occupation-id={sample.occupationId}
                data-occupation-group={sample.occupationGroupId}
                data-outfit-id={sample.appearance.outfitId}
                data-headwear-id={sample.appearance.headwearId}
                data-rig-errors={diagnostic.errors.length}
                data-rig-warnings={diagnostic.warnings.length}
                data-showcase={sample.showcase ? 'true' : 'false'}
                onClick={() => setSelectedId(sample.id)}
              >
                <div className="portrait-lab-card__portrait">
                  <ResidentAvatar
                    seed={sample.seed}
                    gender={sample.gender}
                    lifeStage={sample.lifeStage}
                    occupationId={sample.occupationId}
                    appearance={sample.appearance}
                    catalog={definitions.appearanceCatalog}
                    label={`${sample.displayName}的头像`}
                  />
                  {(diagnostic.errors.length > 0 || diagnostic.warnings.length > 0) && <i className={diagnostic.errors.length ? 'is-error' : 'is-warn'}>{diagnostic.errors.length ? '!' : '·'}</i>}
                </div>
                <b>{sample.displayName}</b>
                <span>{sample.age}岁 · {sample.occupationName}</span>
                <small className="portrait-lab-card__role">{sample.gender === 'female' ? '女' : '男'} · {groupLabel(definitions, sample.occupationGroupId)}{sample.showcase ? ' · 样本' : ''}</small>
              </button>
            );
          })}
          {visibleSamples.length === 0 && <div className="portrait-lab__empty">当前筛选没有样本。换一批或放宽筛选继续检查。</div>}
        </section>

        {selected && (
          <aside className="portrait-lab__inspector" aria-label="头像 DNA 与身份诊断">
            <div className="portrait-lab__hero">
              <ResidentAvatar
                seed={selected.seed}
                gender={selected.gender}
                lifeStage={selected.lifeStage}
                occupationId={selected.occupationId}
                appearance={selected.appearance}
                catalog={definitions.appearanceCatalog}
                debugRig={showRig}
                hiddenLayers={hiddenLayers}
                label={`${selected.displayName}的大头像`}
              />
            </div>
            <div className="portrait-lab__identity">
              <h2>{selected.displayName}</h2>
              <p>{selected.age}岁 · {selected.occupationName}</p>
              <span>{selected.gender === 'female' ? '女' : '男'} · {STAGE_LABELS[selected.lifeStage]} · {groupLabel(definitions, selected.occupationGroupId)} · {FACE_LABELS[selectedFamily]}</span>
            </div>
            <div className="portrait-lab__diagnostic-controls">
              <div className="portrait-lab__diagnostic-heading"><b>身份化装配</b><span>Hair {selectedHairVisibility}</span></div>
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
                <div><dt>Face</dt><dd>{shortId(selected.appearance.faceId)}</dd></div>
                <div><dt>Hair</dt><dd>{shortId(selected.appearance.hairId)}</dd></div>
                <div><dt>Brow</dt><dd>{shortId(selected.appearance.browId)}</dd></div>
                <div><dt>Facial Hair</dt><dd>{shortId(selected.appearance.facialHairId)}</dd></div>
                <div><dt>Headwear</dt><dd>{shortId(selected.appearance.headwearId)}</dd></div>
                <div><dt>Outfit</dt><dd>{shortId(selected.appearance.outfitId)}</dd></div>
                <div><dt>Skin</dt><dd>{shortId(selected.appearance.skinPaletteId)}</dd></div>
                <div><dt>Hair Color</dt><dd>{shortId(selected.appearance.hairPaletteId)}</dd></div>
                <div><dt>Clothing</dt><dd>{shortId(selected.appearance.clothingPaletteId)}</dd></div>
              </dl>
            </div>
            <p className="portrait-lab__note">身份只约束候选池和权重：女性优先女性脸型、发髻与服装；官署、书生、商贸、手艺、医护有各自的弱识别特征。它不是“一职业一张固定头像”。</p>
          </aside>
        )}
      </div>
    </main>
  );
}
