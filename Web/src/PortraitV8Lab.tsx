import {
  HAIR_BUNDLES,
} from './resident/portrait-generator-v8/catalog';
import {
  assertV8IdentityInvariant,
  resolveAppearance,
  resolveHeadProfile,
} from './resident/portrait-generator-v8/appearance-resolver';
import { assertHairBundleContracts } from './resident/portrait-generator-v8/asset-audit';
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

const ageDirectionVariants: SemanticAppearanceContext[] = [
  { residentStableId:'v8-age-direction', residentSeed:88444, gender:'female', lifeStage:'child', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-age-direction', residentSeed:88444, gender:'female', lifeStage:'young-adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-age-direction', residentSeed:88444, gender:'female', lifeStage:'adult', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-age-direction', residentSeed:88444, gender:'female', lifeStage:'middle-age', wealthTier:'plain', presentationStyle:'tidy' },
  { residentStableId:'v8-age-direction', residentSeed:88444, gender:'female', lifeStage:'elder', wealthTier:'plain', presentationStyle:'tidy' },
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

function forceHairBundle(
  dna: ResolvedAppearanceDNA,
  hairBundleId: string,
  accessoryAssetId: string,
): ResolvedAppearanceDNA {
  return {
    ...dna,
    presentation: {
      ...dna.presentation,
      hairBundleId,
      accessoryAssetId,
    },
  };
}

function findBundleSample(bundleId: string) {
  const bundle = HAIR_BUNDLES.find((item)=>item.id===bundleId)!;
  const lifeStage = bundle.lifeStages[0];
  for (let seed=89000; seed<89300; seed+=1) {
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
  throw new Error('Could not find deterministic V8.2 bundle sample for '+bundleId);
}

const bundleSamples = HAIR_BUNDLES.map((bundle)=>({
  bundle,
  ...findBundleSample(bundle.id),
}));

const bundleAudits = assertHairBundleContracts();

type ContractSample = {
  label: string;
  bundleId: string;
  accessoryId: string;
  context: SemanticAppearanceContext;
};

const contractDefinitions: ContractSample[] = [
  {
    label:'女童双小髻 · child',
    bundleId:'hair.female.girl-double-bun.v1',
    accessoryId:'accessory.red-cord',
    context:{ residentStableId:'contract-girl-child', residentSeed:91001, gender:'female', lifeStage:'child', wealthTier:'plain', presentationStyle:'tidy' },
  },
  {
    label:'少女半束后披 · youth',
    bundleId:'hair.female.young-halfbound-backfall.v1',
    accessoryId:'accessory.cloth-knot',
    context:{ residentStableId:'contract-halfbound-youth', residentSeed:91002, gender:'female', lifeStage:'young-adult', wealthTier:'plain', presentationStyle:'tidy' },
  },
  {
    label:'少女半束后披 · adult',
    bundleId:'hair.female.young-halfbound-backfall.v1',
    accessoryId:'accessory.wood-pin',
    context:{ residentStableId:'contract-halfbound-adult', residentSeed:91003, gender:'female', lifeStage:'adult', wealthTier:'plain', presentationStyle:'tidy' },
  },
  {
    label:'成年低髻 · adult',
    bundleId:'hair.female.adult-low-bun.v1',
    accessoryId:'accessory.wood-pin',
    context:{ residentStableId:'contract-lowbun-adult', residentSeed:91004, gender:'female', lifeStage:'adult', wealthTier:'comfortable', presentationStyle:'tidy' },
  },
  {
    label:'成年低髻 · elder',
    bundleId:'hair.female.adult-low-bun.v1',
    accessoryId:'accessory.wood-pin',
    context:{ residentStableId:'contract-lowbun-elder', residentSeed:91005, gender:'female', lifeStage:'elder', wealthTier:'comfortable', presentationStyle:'tidy' },
  },
  {
    label:'花白低髻 · middle',
    bundleId:'hair.female.elder-gray-low-bun.v1',
    accessoryId:'accessory.jade-pin',
    context:{ residentStableId:'contract-graybun-middle', residentSeed:91006, gender:'female', lifeStage:'middle-age', wealthTier:'comfortable', presentationStyle:'tidy' },
  },
  {
    label:'花白低髻 · elder',
    bundleId:'hair.female.elder-gray-low-bun.v1',
    accessoryId:'accessory.jade-pin',
    context:{ residentStableId:'contract-graybun-elder', residentSeed:91007, gender:'female', lifeStage:'elder', wealthTier:'wealthy', presentationStyle:'refined' },
  },
];

const contractSamples = contractDefinitions.map((definition)=>{
  const base = resolveAppearance(definition.context);
  const dna = forceHairBundle(base, definition.bundleId, definition.accessoryId);
  const plan = buildRenderPlan(dna, definition.context, 96);
  const audit = bundleAudits.find((item)=>item.bundleId===definition.bundleId)!;
  return {...definition,dna,plan,audit};
});

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

  const wealthResolved = wealthVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const temporalResolved = temporalVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const ageDirectionResolved = ageDirectionVariants.map((context)=>{
    const dna = resolveAppearance(context);
    const plan = buildRenderPlan(dna, context, 96);
    return {context,dna,plan};
  });

  const wealthIdentityCount = new Set(wealthResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const wealthHairCount = new Set(wealthResolved.map((item)=>item.dna.presentation.hairBundleId)).size;
  const temporalIdentityCount = new Set(temporalResolved.map((item)=>fingerprint(item.dna.identity))).size;
  const temporalMorphologyCount = new Set(temporalResolved.map((item)=>morphologyFingerprint(item.dna.identity.morphology))).size;
  const temporalHeadProfiles = new Set(temporalResolved.map((item)=>resolveHeadProfile(item.dna.identity,item.context).id)).size;

  const auditedBundleCount = bundleAudits.filter((audit)=>audit.passed).length;
  const totalCompatibleProfiles = bundleAudits.reduce((sum,audit)=>sum+audit.compatibleHeadProfileCount,0);
  const allContractMasked = contractSamples.every((sample)=>sample.plan.layers.filter((layer)=>layer.maskMode!=='none').length>=2);
  const allContractLocal = contractSamples.every((sample)=>sample.plan.layers.filter((layer)=>Math.abs(layer.transform.translateX)>0||Math.abs(layer.transform.translateY)>0).length>=2);

  return (
    <main className="portrait-v8-lab" data-portrait-v8-lab="true" data-render-contract-version="8.2" data-art-review-version="8.3">
      <header className="portrait-v8-header">
        <div>
          <span>PORTRAIT GENERATOR V8.3 · HAIR ART PASS</span>
          <h1>居民头像生成算法 V8.3 美术迭代</h1>
          <p>V8.3 保留 V8.2 技术合同，把 Hair Asset 拆成真正可审美的发量、束发根、髻体与后披结构。TECH PASS 只代表架构正确；ART REVIEW 必须人工看轮廓、文化读感和 48px 识别度。</p>
        </div>
        <nav><a href="/?view=portrait-styles">V7 木刻审查</a><a href="/">居民 Demo</a></nav>
      </header>

      <section className="v8-status-grid">
        <div data-v8-check="identity-wealth" data-state={wealthIdentityCount===1&&wealthHairCount===1?'pass':'fail'}><b>{wealthIdentityCount===1&&wealthHairCount===1?'PASS':'FAIL'}</b><span>财富变化不换 Identity / Hair</span></div>
        <div data-v8-check="identity-time" data-state={temporalIdentityCount===1&&temporalMorphologyCount===1?'pass':'fail'}><b>{temporalIdentityCount===1&&temporalMorphologyCount===1?'PASS':'FAIL'}</b><span>年龄变化保留 Identity Morphology</span></div>
        <div data-v8-check="asset-audit" data-state={auditedBundleCount===HAIR_BUNDLES.length?'pass':'fail'}><b>{auditedBundleCount}/{HAIR_BUNDLES.length}</b><span>Hair Bundle Contract</span></div>
        <div data-v8-check="profile-placement" data-state={totalCompatibleProfiles===7?'pass':'fail'}><b>{totalCompatibleProfiles}</b><span>HeadProfile Placements</span></div>
        <div data-v8-check="mask-placement" data-state={allContractMasked&&allContractLocal?'pass':'fail'}><b>{allContractMasked&&allContractLocal?'PASS':'FAIL'}</b><span>实际 Mask / Local Placement</span></div>
        <div data-v8-check="population" data-state={populationSnapshot.totalResolved===64?'pass':'fail'}><b>{populationSnapshot.totalResolved}</b><span>Population Resolver</span></div>
      </section>

      <section className="v8-section" data-v8-section="wealth-invariant">
        <header><div><span>01 · IDENTITY / PRESENTATION</span><h2>同一个人发财，不换脸、不换基础发型</h2></div><p>IdentityDNA 与 Morphology 不读取 WealthTier；Outfit / Accessory 独立解析。</p></header>
        <div className="v8-four-grid">
          {wealthResolved.map((item)=><PortraitCard key={item.context.wealthTier} {...item}/>)}
        </div>
      </section>

      <section className="v8-section" data-v8-section="temporal">
        <header><div><span>02 · TEMPORAL IDENTITY</span><h2>同一个人从儿童到老年</h2></div><p>Identity Morphology 跨年龄保留；HeadProfile、Hair、AgeOverlay 和发色状态演化。</p></header>
        <div className="v8-four-grid">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="v8-section v8-age-direction" data-v8-section="age-direction">
        <header><div><span>02B · AGE DIRECTION / STAGING</span><h2>年龄不只改脸：衣装、肩线、颈长和取景一起变化</h2></div><p>同一居民、同一财富层级。Child 更窄肩且近景；Youth 颈部更修长、肩线轻微不对称；Adult 稳定正身；Middle-age 层领更厚；Elder 肩线下沉、领口提高并略收取景。</p></header>
        <div className="v8-age-grid">
          {ageDirectionResolved.map(({context,dna,plan})=>(
            <article className="v8-card v8-age-card" data-age-direction={context.lifeStage} data-stage-profile={plan.stageProfileId} key={context.lifeStage}>
              <PortraitV8Renderer dna={dna} context={context} lod={96}/>
              <b>{context.lifeStage}</b>
              <code>{plan.stageProfileId}</code>
              <small>{dna.identity.bodyFrameId} · {dna.presentation.outfitBundleId}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="bundle-contract">
        <header><div><span>03 · FORMAL HAIR BUNDLE CONTRACT</span><h2>4 个正式 Hair Bundle 全部走局部坐标和 Mask</h2></div><p>红线=skull，蓝线=face keepout，黄点=bunLow。相同 Bundle 在兼容 HeadProfile 上必须使用 placement，而不是复制一份绝对坐标资产。</p></header>
        <div className="v8-bundle-contract-grid">
          {contractSamples.map((sample)=>(
            <article
              className="v8-card v8-contract-card"
              data-bundle-contract={sample.bundleId}
              data-audit-state={sample.audit.passed?'pass':'fail'}
              data-head-profile={sample.plan.headProfileId}
              key={sample.label}
            >
              <PortraitV8Renderer dna={sample.dna} context={sample.context} lod={96} debugMasks/>
              <b>{sample.label}</b>
              <code>{sample.bundleId}</code>
              <small>{sample.audit.localLayerCount} local · {sample.audit.maskedLayerCount} masked · {sample.audit.accessorySlotCount} accessory slots</small>
            </article>
          ))}
        </div>
      </section>


      <section className="v8-section v8-art-review" data-v8-section="art-review">
        <header><div><span>04 · MANUAL ART REVIEW</span><h2>先看人物，再看合同</h2></div><p>本区不显示自动 PASS。逐张检查：发量是否自然、发际是否完整、发型是否符合中国古代居民语义、配饰是否像真实插入、96/64/48 是否保持同一轮廓。</p></header>
        <div className="v8-art-rubric">
          <span>Silhouette</span><span>Hairline</span><span>Cultural Read</span><span>Occlusion</span><span>Accessory</span><span>48px Read</span>
        </div>
        <div className="v8-art-grid">
          {contractSamples.map((sample)=>(
            <article
              className="v8-card v8-art-card"
              data-art-review={sample.bundleId}
              data-head-profile={sample.plan.headProfileId}
              key={'art-'+sample.label}
            >
              <PortraitV8Renderer dna={sample.dna} context={sample.context} lod={96}/>
              <div className="v8-art-card__meta">
                <b>{sample.label}</b>
                <code>{sample.plan.headProfileId}</code>
              </div>
              <div className="v8-art-lods">
                {[64,48].map((lod)=><div key={lod}><PortraitV8Renderer dna={sample.dna} context={sample.context} lod={lod as PortraitLod}/><span>{lod}px</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="asset-audit">
        <header><div><span>05 · ASSET AUDIT</span><h2>正式资产契约审计</h2></div><p>禁止 Hair Layer 回退到 canvas absolute coordinates；兼容 HeadProfile 必须有 placement；Accessory Slot 必须有对应 placement。</p></header>
        <div className="v8-audit-grid">
          {bundleAudits.map((audit)=>(
            <div className="v8-audit-card" data-bundle-audit={audit.bundleId} data-state={audit.passed?'pass':'fail'} key={audit.bundleId}>
              <b>{audit.passed?'PASS':'FAIL'}</b>
              <code>{audit.bundleId}</code>
              <span>{audit.localLayerCount} local / {audit.maskedLayerCount} masked / {audit.compatibleHeadProfileCount} heads</span>
              {audit.errors.length>0 && <small>{audit.errors.join(' · ')}</small>}
            </div>
          ))}
        </div>
      </section>

      <section className="v8-section" data-v8-section="bundles">
        <header><div><span>06 · ASSET BUNDLE / LOD</span><h2>96 / 64 / 48px</h2></div><p>次级鬓发、发髻盘绕线和发丝纹理可以在 48px 被移除，保留主要轮廓。</p></header>
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
        <header><div><span>07 · POPULATION DIVERSITY</span><h2>64 人城市级软分布</h2></div><p>FinalWeight = baseWeight × compatibility × localNovelty × populationDeficit。</p></header>
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
        <header><div><span>08 · SAVE CONTRACT</span><h2>Resolved Stable IDs + Morphology</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
