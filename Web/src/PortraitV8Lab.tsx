import {
  HAIR_BUNDLES,
} from './resident/portrait-generator-v8/catalog';
import {
  assertV8IdentityInvariant,
  resolveAppearance,
  resolveHeadProfile,
} from './resident/portrait-generator-v8/appearance-resolver';
import { buildRenderPlan } from './resident/portrait-generator-v8/render-plan';
import { morphologyFingerprint } from './resident/portrait-generator-v8/identity-morphology';
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

const contractVariants: SemanticAppearanceContext[] = [
  { residentStableId:'v8-contract-anchor', residentSeed:88222, gender:'female', lifeStage:'adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-contract-anchor', residentSeed:88222, gender:'female', lifeStage:'elder', wealthTier:'plain', presentationStyle:'tidy' },
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

function forceLowBun(dna: ResolvedAppearanceDNA): ResolvedAppearanceDNA {
  return {
    ...dna,
    presentation: {
      ...dna.presentation,
      hairBundleId:'hair.female.adult-low-bun.v1',
      accessoryAssetId:'accessory.wood-pin',
    },
  };
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
  throw new Error('Could not find deterministic V8.1 bundle sample for '+bundleId);
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
  debugMasks=false,
}: {
  context: SemanticAppearanceContext;
  dna: ResolvedAppearanceDNA;
  lod?: PortraitLod;
  className?: string;
  debugMasks?: boolean;
}) {
  const identityFingerprint = fingerprint(dna.identity);
  return (
    <article
      className={'v8-card '+className}
      data-identity-fingerprint={identityFingerprint}
      data-morphology-fingerprint={morphologyFingerprint(dna.identity.morphology)}
      data-life-stage={context.lifeStage}
      data-wealth={context.wealthTier}
    >
      <PortraitV8Renderer dna={dna} context={context} lod={lod} debugMasks={debugMasks}/>
      <b>{context.lifeStage} · {context.wealthTier}</b>
      <code>{dna.presentation.hairBundleId}</code>
      <small>Identity {identityFingerprint}</small>
    </article>
  );
}

export function PortraitV8Lab() {
  assertV8IdentityInvariant(wealthVariants[0], wealthVariants.slice(1));
  assertV8IdentityInvariant(temporalVariants[0], temporalVariants.slice(1));
  assertV8IdentityInvariant(contractVariants[0], contractVariants.slice(1));

  const wealthResolved = wealthVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const temporalResolved = temporalVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const contractResolved = contractVariants.map((context)=>({context,dna:forceLowBun(resolveAppearance(context))}));

  const wealthIdentityCount = new Set(wealthResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const wealthHairCount = new Set(wealthResolved.map((item)=>item.dna.presentation.hairBundleId)).size;
  const temporalIdentityCount = new Set(temporalResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const temporalMorphologyCount = new Set(temporalResolved.map((item)=>morphologyFingerprint(item.dna.identity.morphology))).size;
  const temporalHeadProfiles = new Set(temporalResolved.map((item)=>resolveHeadProfile(item.dna.identity,item.context).id)).size;

  const contractPlans = contractResolved.map((item)=>buildRenderPlan(item.dna,item.context,96));
  const contractHeadCount = new Set(contractPlans.map((plan)=>plan.headProfileId)).size;
  const contractMaskCount = contractPlans.reduce((sum,plan)=>sum+plan.layers.filter((layer)=>layer.maskMode!=='none').length,0);
  const contractLocalCount = contractPlans.reduce((sum,plan)=>sum+plan.layers.filter((layer)=>Math.abs(layer.transform.translateX)>0||Math.abs(layer.transform.translateY)>0).length,0);

  return (
    <main className="portrait-v8-lab" data-portrait-v8-lab="true" data-render-contract-version="8.1">
      <header className="portrait-v8-header">
        <div>
          <span>PORTRAIT GENERATOR V8.1 · RENDERING CONTRACT</span>
          <h1>居民头像生成算法 V8.1</h1>
          <p>V8.1 把上一版只“定义出来”的 Mask / Placement 真正接入 Renderer，并加入 Identity Morphology 与 Hair Accessory Slot。V7 继续保留为美术基线。</p>
        </div>
        <nav><a href="/?view=portrait-styles">V7 木刻审查</a><a href="/">居民 Demo</a></nav>
      </header>

      <section className="v8-status-grid">
        <div data-v8-check="identity-wealth" data-state={wealthIdentityCount===1&&wealthHairCount===1?'pass':'fail'}><b>{wealthIdentityCount===1&&wealthHairCount===1?'PASS':'FAIL'}</b><span>财富变化不换 Identity / Hair</span></div>
        <div data-v8-check="identity-time" data-state={temporalIdentityCount===1&&temporalMorphologyCount===1?'pass':'fail'}><b>{temporalIdentityCount===1&&temporalMorphologyCount===1?'PASS':'FAIL'}</b><span>年龄变化保留 Identity Morphology</span></div>
        <div data-v8-check="render-contract" data-state={contractMaskCount>=6&&contractLocalCount>=6?'pass':'fail'}><b>{contractMaskCount}/{contractLocalCount}</b><span>Masked / Local Layers</span></div>
        <div data-v8-check="head-placement" data-state={contractHeadCount===2?'pass':'fail'}><b>{contractHeadCount}</b><span>低髻跨 HeadProfile Placement</span></div>
        <div data-v8-check="asset-bundles" data-state={bundleSamples.length===4?'pass':'fail'}><b>{bundleSamples.length}</b><span>正式 Hair Bundles</span></div>
        <div data-v8-check="population" data-state={populationSnapshot.totalResolved===64?'pass':'fail'}><b>{populationSnapshot.totalResolved}</b><span>Population Resolver</span></div>
      </section>

      <section className="v8-section" data-v8-section="wealth-invariant">
        <header><div><span>01 · IDENTITY / PRESENTATION</span><h2>同一个人发财，不换脸、不换基础发型</h2></div><p>IdentityDNA 与 Morphology 都不读取 WealthTier；Outfit / Accessory 单独解析。</p></header>
        <div className="v8-four-grid">
          {wealthResolved.map((item)=><PortraitCard key={item.context.wealthTier} {...item}/>)}
        </div>
      </section>

      <section className="v8-section" data-v8-section="temporal">
        <header><div><span>02 · TEMPORAL IDENTITY</span><h2>同一个人从儿童到老年</h2></div><p>同一套 face-width / feature-span / nose-length / mouth-width Morphology 跨年龄保留；HeadProfile 与 AgeOverlay 演化。</p></header>
        <div className="v8-four-grid">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="v8-section" data-v8-section="render-contract">
        <header><div><span>03 · MASK / LOCAL PLACEMENT</span><h2>成年低髻：先把一个正式资产做对</h2></div><p>低髻几何以 bunLow 为局部原点；adult / elder HeadProfile 使用不同 placement。红线=skull，蓝线=face keepout，黄点=bunLow。</p></header>
        <div className="v8-contract-grid">
          {contractResolved.map((item)=>(
            <PortraitCard key={item.context.lifeStage} {...item} debugMasks className="v8-contract-card"/>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="bundles">
        <header><div><span>04 · ASSET BUNDLE / LOD</span><h2>首批 4 个 Hair Bundle 使用同一 Generic Renderer</h2></div><p>Back Hair=behind-head；Front Hair=inside-skull；Side Hair=outside-face。48px 自动去掉次级 side/detail layer。</p></header>
        <div className="v8-four-grid">
          {bundleSamples.map(({bundle,context,dna})=>(
            <article className="v8-card" data-bundle-showcase={bundle.id} key={bundle.id}>
              <PortraitV8Renderer dna={dna} context={context} lod={96}/>
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
        <header><div><span>05 · POPULATION DIVERSITY</span><h2>64 人城市级软分布</h2></div><p>FinalWeight = baseWeight × compatibility × localNovelty × populationDeficit。</p></header>
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
        <header><div><span>06 · SAVE CONTRACT</span><h2>Seed 用于生成，Resolved Stable IDs + Morphology 用于保存</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
