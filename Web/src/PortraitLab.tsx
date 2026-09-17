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
};

type FilterGender = 'all' | Gender;
type FilterStage = 'all' | 'young' | 'adult' | 'older';

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

const SLOT_ORDER = ['face', 'hair', 'brow', 'facial-hair', 'headwear', 'outfit'] as const;
const PALETTE_ORDER = ['skin', 'hair', 'clothing'] as const;

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

function weightedPick<T extends { weight: number }>(items: T[], rng: () => number): T {
  if (!items.length) throw new Error('头像实验室候选池为空');
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  let cursor = rng() * Math.max(1, total);
  for (const item of items) {
    cursor -= Math.max(0, item.weight);
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
) {
  const slotItems = definitions.appearanceCatalog.parts.filter((item) => item.slot === slot);
  const exact = slotItems.filter((item) => matchesAppearanceRule(item, gender, lifeStage, occupationGroupId));
  const relaxed = slotItems.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    if (item.lifeStages?.length && !item.lifeStages.includes(lifeStage)) return false;
    return !item.occupationGroups?.length;
  });
  return weightedPick(exact.length ? exact : relaxed.length ? relaxed : slotItems, rng);
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
  return weightedPick(exact.length ? exact : relaxed.length ? relaxed : slotItems, rng);
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
  const gender: Gender = rng() < 0.5 ? 'male' : 'female';
  const lifeStage = chooseStage(rng);
  const age = STAGE_AGES[lifeStage] + Math.floor(rng() * (lifeStage === 'elder' ? 10 : 5));
  const occupations = definitions.occupations.filter((item) => {
    if (item.genders?.length && !item.genders.includes(gender)) return false;
    return age >= item.minAge && age <= item.maxAge;
  });
  const occupation = weightedPick(occupations.length ? occupations : definitions.occupations, rng);
  const occupationGroupId = occupation.groupId;

  const surname = weightedPick(definitions.nameCatalog.surnames, rng);
  const givenPool = definitions.nameCatalog.givenNames.filter((item) => !item.gender || item.gender === 'unisex' || item.gender === gender);
  const givenName = weightedPick(givenPool, rng);

  const parts = Object.fromEntries(SLOT_ORDER.map((slot) => [slot, choosePart(definitions, slot, gender, lifeStage, occupationGroupId, rng).id]));
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

export function PortraitLab() {
  const [definitions, setDefinitions] = useState<ResidentDefinitions | null>(null);
  const [error, setError] = useState('');
  const [batchSeed, setBatchSeed] = useState(3107);
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');
  const [stageFilter, setStageFilter] = useState<FilterStage>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    if (genderFilter !== 'all' && sample.gender !== genderFilter) return false;
    return matchesStageFilter(sample, stageFilter);
  }), [samples, genderFilter, stageFilter]);

  const selected = visibleSamples.find((sample) => sample.id === selectedId)
    ?? visibleSamples[0]
    ?? samples[0];

  const diversity = useMemo(() => ({
    signatures: new Set(visibleSamples.map((sample) => appearanceSignature(sample.appearance))).size,
    faces: new Set(visibleSamples.map((sample) => sample.appearance.faceId)).size,
    hairs: new Set(visibleSamples.map((sample) => sample.appearance.hairId)).size,
    headwear: new Set(visibleSamples.map((sample) => sample.appearance.headwearId)).size,
    outfits: new Set(visibleSamples.map((sample) => sample.appearance.outfitId)).size,
  }), [visibleSamples]);

  if (error) return <main className="portrait-lab portrait-lab--center"><section><b>头像实验室读取失败</b><p>{error}</p></section></main>;
  if (!definitions) return <main className="portrait-lab portrait-lab--center"><section><b>正在生成头像样本…</b></section></main>;

  const groupLabel = selected
    ? definitions.occupationGroups.find((item) => item.id === selected.occupationGroupId)?.label ?? selected.occupationGroupId
    : '';

  return (
    <main className="portrait-lab">
      <header className="portrait-lab__header">
        <div>
          <span className="portrait-lab__eyebrow">PORTRAIT LAB V1 · WEB PLAYTEST</span>
          <h1>居民头像实验室</h1>
          <p>用 AppearanceDNA 组合分层 SVG，先验证“稳定、可辨认、组合不重复”，不代表最终 Unity 渲染方式。</p>
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
        <div><span>服装</span><b>{diversity.outfits}</b></div>
      </section>

      <section className="portrait-lab__filters" aria-label="头像筛选">
        <div><span>性别</span>{(['all', 'male', 'female'] as FilterGender[]).map((value) => <button key={value} type="button" className={genderFilter === value ? 'is-active' : ''} onClick={() => setGenderFilter(value)}>{value === 'all' ? '全部' : value === 'male' ? '男' : '女'}</button>)}</div>
        <div><span>年龄</span>{(['all', 'young', 'adult', 'older'] as FilterStage[]).map((value) => <button key={value} type="button" className={stageFilter === value ? 'is-active' : ''} onClick={() => setStageFilter(value)}>{value === 'all' ? '全部' : value === 'young' ? '少年 / 青年' : value === 'adult' ? '成年' : '中老年'}</button>)}</div>
        <small>批次 Seed {batchSeed}</small>
      </section>

      <div className="portrait-lab__workspace">
        <section className="portrait-lab__grid" aria-label="随机头像样本">
          {visibleSamples.map((sample) => {
            const signature = appearanceSignature(sample.appearance);
            return (
              <button
                type="button"
                className={`portrait-lab-card ${selected?.id === sample.id ? 'is-selected' : ''}`}
                key={sample.id}
                data-signature={signature}
                onClick={() => setSelectedId(sample.id)}
              >
                <div className="portrait-lab-card__portrait">
                  <ResidentAvatar
                    seed={sample.seed}
                    gender={sample.gender}
                    lifeStage={sample.lifeStage}
                    occupationId={sample.occupationId}
                    appearance={sample.appearance}
                    label={`${sample.displayName}的头像`}
                  />
                </div>
                <b>{sample.displayName}</b>
                <span>{sample.age}岁 · {sample.occupationName}</span>
              </button>
            );
          })}
        </section>

        {selected && (
          <aside className="portrait-lab__inspector" aria-label="头像 DNA">
            <div className="portrait-lab__hero">
              <ResidentAvatar
                seed={selected.seed}
                gender={selected.gender}
                lifeStage={selected.lifeStage}
                occupationId={selected.occupationId}
                appearance={selected.appearance}
                label={`${selected.displayName}的大头像`}
              />
            </div>
            <div className="portrait-lab__identity">
              <h2>{selected.displayName}</h2>
              <p>{selected.age}岁 · {selected.occupationName}</p>
              <span>{STAGE_LABELS[selected.lifeStage]} · {groupLabel}</span>
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
            <p className="portrait-lab__note">这套 DNA 是跨表现层语义。Web 现在用 SVG 解释它；以后 Unity 可以把同一个 ID 映射到 Sprite、Mesh、Material 或其它资源。</p>
          </aside>
        )}
      </div>
    </main>
  );
}
