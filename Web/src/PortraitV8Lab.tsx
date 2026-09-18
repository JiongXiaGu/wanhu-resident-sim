import {
  HAIR_BUNDLES,
} from './resident/portrait-generator-v8/catalog';
import {
  assertV8IdentityInvariant,
  resolveAppearance,
  resolveHeadProfile,
} from './resident/portrait-generator-v8/appearance-resolver';
import { PopulationDiversityController } from './resident/portrait-generator-v8/population-diversity';
import { hash32 } from './resident/portrait-generator-v8/seed-bank';
import { PortraitV8Renderer } from './resident/portrait-generator-v8/PortraitV8Renderer';
import type {
  PortraitLod,
  ResolvedAppearanceDNA,
  SemanticAppearanceContext,
} from './resident/portrait-generator-v8/types';

const wealthVariants: SemanticAppearanceContext[] = [
  { residentStableId:'v8-wealth-anchor', residentSeed:88001, gender:'female', lifeStage:'adult', wealthTier:'poor', presentationStyle:'practical' },
  { residentStableId:'v8-wealth-anchor', residentSeed:88001, gender:'female', lifeStage:'adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-wealth-anchor', residentSeed:88001, gender:'female', lifeStage:'adult', wealthTier:'comfortable', presentationStyle:'tidy' },
  { residentStableId:'v8-wealth-anchor', residentSeed:88001, gender:'female', lifeStage:'adult', wealthTier:'wealthy', presentationStyle:'refined' },
];

const temporalVariants: SemanticAppearanceContext[] = [
  { residentStableId:'v8-temporal-anchor', residentSeed:88111, gender:'female', lifeStage:'child', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-temporal-anchor', residentSeed:88111, gender:'female', lifeStage:'young-adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-temporal-anchor', residentSeed:88111, gender:'female', lifeStage:'adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-temporal-anchor', residentSeed:88111, gender:'female', lifeStage:'elder', wealthTier:'plain', presentationStyle:'tidy' },
];

function fingerprint(value: unknown) {
  return hash32(JSON.stringify(value)).toString(16).padStart(8,'0');
}

function presentationForWealth(wealth: SemanticAppearanceContext['wealthTier'], index = 0): SemanticAppearanceContext['presentationStyle'] {
  if (wealth === 'poor') return index % 3 === 0 ? 'tidy' : 'practical';
  if (wealth === 'plain') return index % 2 === 0 ? 'tidy' : 'practical';
  if (wealth === 'comfortable') return index % 3 === 0 ? 'refined' : 'tidy';
  return index % 2 === 0 ? 'refined' : 'tidy';
}

function findBundleSample(bundleId: string) {
  const bundle = HAIR_BUNDLES.find((item)=>item.id===bundleId)!;
  const lifeStage = bundle.lifeStages[0];
  for (let seed=89000; seed<89250; seed+=1) {
    const wealthTier: SemanticAppearanceContext['wealthTier'] = lifeStage === 'elder' ? 'wealthy' : 'plain';
    const context: SemanticAppearanceContext = {
      residentStableId:'bundle-'+bundleId,
      residentSeed:seed,
      gender:'female',
      lifeStage,
      wealthTier,
      presentationStyle:presentationForWealth(wealthTier),
    };
    const dna = resolveAppearance(context);
    if (dna.presentation.hairBundleId === bundleId) return {context,dna};
  }
  throw new Error('Could not find deterministic V8 bundle sample for '+bundleId);
}

const bundleSamples = HAIR_BUNDLES.map((bundle)=>({
  bundle,
  ...findBundleSample(bundle.id),
}));

const populationController = new PopulationDiversityController(8);
const populationStages: SemanticAppearanceContext['lifeStage'][] = [
  'child','young-adult','adult','adult','middle-age','elder','adult','young-adult',
];
const populationWealth: SemanticAppearanceContext['wealthTier'][] = ['poor','plain','plain','comfortable','plain','wealthy'];
const population = Array.from({length:64},(_,index)=>{
  const wealthTier = populationWealth[index%populationWealth.length];
  const context: SemanticAppearanceContext = {
    residentStableId:'v8-pop-'+String(index+1).padStart(2,'0'),
    residentSeed:90000+index*17,
    gender:'female',
    lifeStage:populationStages[index%populationStages.length],
    wealthTier,
    presentationStyle:presentationForWealth(wealthTier,index),
  };
  return {context,dna:resolveAppearance(context,populationController)};
});
const populationSnapshot = populationController.snapshot();

function PortraitCard({
  context,
  dna,
  lod=96,
  className='',
}: {
  context: SemanticAppearanceContext;
  dna: ResolvedAppearanceDNA;
  lod?: PortraitLod;
  className?: string;
}) {
  const identityFingerprint = fingerprint(dna.identity);
  return (
    <article
      className={'v8-card '+className}
      data-identity-fingerprint={identityFingerprint}
      data-life-stage={context.lifeStage}
      data-wealth={context.wealthTier}
    >
      <PortraitV8Renderer dna={dna} context={context} lod={lod}/>
      <b>{context.lifeStage} · {context.wealthTier}</b>
      <code>{dna.presentation.hairBundleId}</code>
      <small>Identity {identityFingerprint}</small>
    </article>
  );
}

export function PortraitV8Lab() {
  assertV8IdentityInvariant(wealthVariants[0], wealthVariants.slice(1));
  assertV8IdentityInvariant(temporalVariants[0], temporalVariants.slice(1));

  const wealthResolved = wealthVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const temporalResolved = temporalVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const wealthIdentityCount = new Set(wealthResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const wealthHairCount = new Set(wealthResolved.map((item)=>item.dna.presentation.hairBundleId)).size;
  const temporalIdentityCount = new Set(temporalResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const temporalHeadProfiles = new Set(temporalResolved.map((item)=>resolveHeadProfile(item.dna.identity,item.context).id)).size;

  return (
    <main className="portrait-v8-lab" data-portrait-v8-lab="true">
      <header className="portrait-v8-header">
        <div>
          <span>PORTRAIT GENERATOR V8 · ARCHITECTURE LAB</span>
          <h1>居民头像生成算法 V8</h1>
          <p>V7 保留为美术基线；V8 验证 Identity / Presentation、命名随机子流、Asset Bundle、Compatibility、Population Diversity、LOD 与 RenderPlan。</p>
        </div>
        <nav><a href="/?view=portrait-styles">V7 木刻审查</a><a href="/">居民 Demo</a></nav>
      </header>

      <section className="v8-status-grid">
        <div data-v8-check="identity-wealth" data-state={wealthIdentityCount===1&&wealthHairCount===1?'pass':'fail'}><b>{wealthIdentityCount===1&&wealthHairCount===1?'PASS':'FAIL'}</b><span>财富变化不换 Identity / Hair</span></div>
        <div data-v8-check="identity-time" data-state={temporalIdentityCount===1?'pass':'fail'}><b>{temporalIdentityCount===1?'PASS':'FAIL'}</b><span>年龄变化 Identity 不丢</span></div>
        <div data-v8-check="head-morphology" data-state={temporalHeadProfiles>=4?'pass':'fail'}><b>{temporalHeadProfiles}</b><span>年龄形态 HeadProfile</span></div>
        <div data-v8-check="asset-bundles" data-state={bundleSamples.length===4?'pass':'fail'}><b>{bundleSamples.length}</b><span>正式 Hair Bundles</span></div>
        <div data-v8-check="population" data-state={populationSnapshot.totalResolved===64?'pass':'fail'}><b>{populationSnapshot.totalResolved}</b><span>Population Resolver</span></div>
        <div><b>v8</b><span>generatorVersion</span></div>
      </section>

      <section className="v8-section" data-v8-section="wealth-invariant">
        <header><div><span>01 · IDENTITY / PRESENTATION</span><h2>同一个人发财，不换脸、不换基础发型</h2></div><p>IdentityDNA 不读取 WealthTier；Hair 子流只读取 LifeStage。Outfit 与 Accessory 再按财富和 Presentation 独立解析。</p></header>
        <div className="v8-four-grid">
          {wealthResolved.map((item)=><PortraitCard key={item.context.wealthTier} {...item}/>)}
        </div>
      </section>

      <section className="v8-section" data-v8-section="temporal">
        <header><div><span>02 · TEMPORAL IDENTITY</span><h2>同一个人从儿童到老年</h2></div><p>FaceFamily / FeatureSet / Skin 不变；HeadProfile、Hair、AgeOverlay 随 LifeStage 演化。</p></header>
        <div className="v8-four-grid">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="v8-section" data-v8-section="bundles">
        <header><div><span>03 · ASSET BUNDLE</span><h2>首批 4 个正式 Hair Bundle</h2></div><p>Renderer 只读取 RenderPlan。发型几何位于 Asset Bundle / VectorLayer 中，不再写 hairId 分支。</p></header>
        <div className="v8-four-grid">
          {bundleSamples.map(({bundle,context,dna})=>(
            <article className="v8-card" data-bundle-showcase={bundle.id} key={bundle.id}>
              <PortraitV8Renderer dna={dna} context={context} lod={96} debugMasks/>
              <b>{bundle.label}</b>
              <code>{bundle.id}</code>
              <small>{bundle.silhouetteType} · {bundle.cultureTag}</small>
              <div className="v8-lods">
                {[96,64,48].map((lod)=><div key={lod}><PortraitV8Renderer dna={dna} context={context} lod={lod as PortraitLod}/><span>{lod}px</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="population">
        <header><div><span>04 · POPULATION DIVERSITY</span><h2>64 人城市级软分布</h2></div><p>FinalWeight = baseWeight × compatibility × localNovelty × populationDeficit。不是硬配额。</p></header>
        <div className="v8-distribution">
          {HAIR_BUNDLES.map((bundle)=><div key={bundle.id}><b>{populationSnapshot.countsByHairBundle[bundle.id]??0}</b><span>{bundle.label}</span></div>)}
        </div>
        <div className="v8-crowd">
          {population.map(({context,dna})=>(
            <div className="v8-crowd__item" key={context.residentStableId} data-pop-resident={context.residentStableId}>
              <PortraitV8Renderer dna={dna} context={context} lod={48}/>
            </div>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="save-contract">
        <header><div><span>05 · SAVE CONTRACT</span><h2>Seed 用于生成，Resolved Stable IDs 用于存档</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
