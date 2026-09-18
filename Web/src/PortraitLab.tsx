import { FACE_FAMILIES, HAIR_STYLES } from './resident/portrait/catalog';
import {
  assertPortraitIdentityInvariant,
  resolveAppearance,
} from './resident/portrait/resolver';
import { buildRenderPlan } from './resident/portrait/render-plan';
import { hash32 } from './resident/portrait/seed';
import { PortraitRenderer } from './resident/portrait/PortraitRenderer';
import type {
  PortraitLod,
  ResolvedAppearanceDNA,
  SemanticAppearanceContext,
} from './resident/portrait/types';

const wealthVariants: SemanticAppearanceContext[] = [
  {residentStableId:'v84-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'poor',presentationStyle:'practical'},
  {residentStableId:'v84-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'plain',presentationStyle:'tidy'},
  {residentStableId:'v84-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'comfortable',presentationStyle:'tidy'},
  {residentStableId:'v84-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'wealthy',presentationStyle:'refined'},
];

const temporalVariants: SemanticAppearanceContext[] = [
  {residentStableId:'v84-time',residentSeed:88111,gender:'female',lifeStage:'child',wealthTier:'plain',presentationStyle:'tidy'},
  {residentStableId:'v84-time',residentSeed:88111,gender:'female',lifeStage:'young-adult',wealthTier:'plain',presentationStyle:'tidy'},
  {residentStableId:'v84-time',residentSeed:88111,gender:'female',lifeStage:'adult',wealthTier:'plain',presentationStyle:'tidy'},
  {residentStableId:'v84-time',residentSeed:88111,gender:'female',lifeStage:'middle-age',wealthTier:'plain',presentationStyle:'tidy'},
  {residentStableId:'v84-time',residentSeed:88111,gender:'female',lifeStage:'elder',wealthTier:'plain',presentationStyle:'tidy'},
];

function fingerprint(value:unknown) {
  return hash32(JSON.stringify(value)).toString(16).padStart(8,'0');
}

function findFaceSample(faceFamilyId:string) {
  for(let seed=93000;seed<94000;seed+=1) {
    const context:SemanticAppearanceContext={
      residentStableId:'face-'+faceFamilyId,residentSeed:seed,gender:'female',
      lifeStage:'adult',wealthTier:'plain',presentationStyle:'tidy',
    };
    const dna=resolveAppearance(context);
    if(dna.identity.faceFamilyId===faceFamilyId) return {context,dna};
  }
  throw new Error('No deterministic V8.4 face sample for '+faceFamilyId);
}

const faceSamples=FACE_FAMILIES.map((family)=>({family,...findFaceSample(family.id)}));

const hairSamples=HAIR_STYLES.map((style)=>{
  const lifeStage=style.lifeStages[0];
  const context:SemanticAppearanceContext={
    residentStableId:'hair-'+style.id,residentSeed:95000+HAIR_STYLES.indexOf(style)*31,
    gender:'female',lifeStage,wealthTier:'plain',presentationStyle:'tidy',
  };
  return {style,context,dna:resolveAppearance(context,{hairStyleId:style.id})};
});

const crowdStages:SemanticAppearanceContext['lifeStage'][]=['child','young-adult','adult','middle-age','elder','adult'];
const crowdWealth:SemanticAppearanceContext['wealthTier'][]=['poor','plain','comfortable','wealthy'];
const crowd=Array.from({length:24},(_,index)=>{
  const context:SemanticAppearanceContext={
    residentStableId:'v84-crowd-'+String(index+1).padStart(2,'0'),
    residentSeed:97000+index*37,
    gender:'female',
    lifeStage:crowdStages[index%crowdStages.length],
    wealthTier:crowdWealth[index%crowdWealth.length],
    presentationStyle:'tidy',
  };
  return {context,dna:resolveAppearance(context)};
});

function PortraitCard({context,dna,lod=96}:{context:SemanticAppearanceContext;dna:ResolvedAppearanceDNA;lod?:PortraitLod}) {
  return (
    <article className="v84-card" data-identity-fingerprint={fingerprint(dna.identity)} data-life-stage={context.lifeStage}>
      <PortraitRenderer dna={dna} context={context} lod={lod}/>
      <b>{context.lifeStage} · {context.wealthTier}</b>
      <code>{dna.identity.faceFamilyId}</code>
      <small>{dna.presentation.hairStyleId} · {dna.presentation.outfitStyleId}</small>
    </article>
  );
}

export function PortraitLab() {
  assertPortraitIdentityInvariant(wealthVariants[0],wealthVariants.slice(1));
  assertPortraitIdentityInvariant(temporalVariants[0],temporalVariants.slice(1));

  const wealthResolved=wealthVariants.map((context)=>({context,dna:resolveAppearance(context)}));
  const temporalResolved=temporalVariants.map((context)=>({context,dna:resolveAppearance(context)}));

  const wealthIdentityCount=new Set(wealthResolved.map((x)=>fingerprint(x.dna.identity))).size;
  const temporalIdentityCount=new Set(temporalResolved.map((x)=>fingerprint(x.dna.identity))).size;
  const temporalFaceCount=new Set(temporalResolved.map((x)=>x.dna.identity.faceFamilyId)).size;

  return (
    <main className="portrait-v8-lab" data-portrait-v8-lab="true" data-render-contract-version="8.4" data-art-review-version="8.4">
      <header className="portrait-v8-header">
        <div>
          <span>UNIFIED RESIDENT PORTRAIT · ART WORKBENCH</span>
          <h1>居民头像工作台：简单组合，美术优先</h1>
          <p>头像是次要系统。V8.4 只保留“认得出同一个人、年龄清楚、可以换发型、可以换衣服”。已取消 Accessory、Hair Mask、Head Anchor、连续 Morphology、Population Diversity 和复杂 Compatibility。</p>
        </div>
        <nav><a href="/?view=portrait-styles">V7 木刻审查</a><a href="/">居民 Demo</a></nav>
      </header>

      <section className="v84-status">
        <div data-v8-check="identity-wealth" data-state={wealthIdentityCount===1?'pass':'fail'}><b>{wealthIdentityCount===1?'PASS':'FAIL'}</b><span>财富不改变 Identity</span></div>
        <div data-v8-check="identity-time" data-state={temporalIdentityCount===1&&temporalFaceCount===1?'pass':'fail'}><b>{temporalIdentityCount===1&&temporalFaceCount===1?'PASS':'FAIL'}</b><span>一生保持 FaceFamily</span></div>
        <div data-v8-check="face-families" data-state={FACE_FAMILIES.length>=6?'pass':'fail'}><b>{FACE_FAMILIES.length}</b><span>离散 FaceFamily</span></div>
        <div data-v8-check="hair-styles" data-state={HAIR_STYLES.length===4?'pass':'fail'}><b>{HAIR_STYLES.length}</b><span>首批 Hair Style</span></div>
        <div data-v8-check="no-accessory" data-state="pass"><b>0</b><span>Accessory 系统</span></div>
        <div data-v8-check="simple-render" data-state="pass"><b>PASS</b><span>无 Hair Mask / Anchor</span></div>
      </section>

      <section className="v84-section" data-v8-section="wealth-invariant">
        <header><div><span>01 · IDENTITY</span><h2>同一个人换衣服，不换脸</h2></div><p>财富只影响初始 Outfit。FaceFamily / 肤色 / 基础发色来自 Identity Seed。</p></header>
        <div className="v84-grid v84-grid-4">
          {wealthResolved.map((item)=><PortraitCard key={item.context.wealthTier} {...item}/>)}
        </div>
      </section>

      <section className="v84-section" data-v8-section="temporal">
        <header><div><span>02 · LIFE STAGE</span><h2>同一个 FaceFamily 从儿童到老年</h2></div><p>不再使用连续 Morph。每个 FaceFamily 直接提供 child / youth / adult / elder 美术版本。</p></header>
        <div className="v84-grid v84-grid-5">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="v84-section" data-v8-section="face-families">
        <header><div><span>03 · FACE FAMILY</span><h2>脸型差异直接由美术资产控制</h2></div><p>当前先提供 6 套离散脸型。以后增加脸型就是增加资产，不增加运行时捏脸算法。</p></header>
        <div className="v84-grid v84-grid-6">
          {faceSamples.map(({family,context,dna})=>(
            <article className="v84-card" data-face-family-card={family.id} key={family.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{family.label}</b><code>{family.id}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="v84-section" data-v8-section="hair-art">
        <header><div><span>04 · HAIR ART</span><h2>发型是最终画布资产，不再自动适配头型</h2></div><p>没有 Head Anchor、placement、Mask、Accessory Slot。96 / 64 / 48 使用同一轮廓直接缩放。</p></header>
        <div className="v84-grid v84-grid-4">
          {hairSamples.map(({style,context,dna})=>(
            <article className="v84-card" data-hair-style-card={style.id} key={style.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{style.label}</b><code>{style.id}</code>
              <div className="v84-lods">
                {[96,64,48].map((lod)=><div key={lod}><PortraitRenderer dna={dna} context={context} lod={lod as PortraitLod}/><span>{lod}px</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="v84-section" data-v8-section="age-direction">
        <header><div><span>05 · ART DIRECTION</span><h2>年龄靠直接美术设计，不靠参数叠加</h2></div><p>Child / Youth / Adult / Middle / Elder 的脸、颈、肩、衣领和取景分别审查。</p></header>
        <div className="v84-grid v84-grid-5">
          {temporalResolved.map(({context,dna})=>{
            const plan=buildRenderPlan(dna,context,96);
            return <article className="v84-card" data-age-direction={context.lifeStage} data-stage-profile={plan.stageProfileId} key={'age-'+context.lifeStage}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{context.lifeStage}</b><small>{plan.stageProfileId}</small>
            </article>;
          })}
        </div>
      </section>

      <section className="v84-section" data-v8-section="crowd">
        <header><div><span>06 · CROWD CHECK</span><h2>24 人简单 Seed 抽样</h2></div><p>不再动态追踪人口配额。重复感优先通过增加高质量 Face / Hair / Outfit 资产解决。</p></header>
        <div className="v84-crowd">
          {crowd.map(({context,dna})=><div data-pop-resident={context.residentStableId} key={context.residentStableId}><PortraitRenderer dna={dna} context={context} lod={48}/></div>)}
        </div>
      </section>

      <section className="v84-section" data-v8-section="save-contract">
        <header><div><span>07 · SAVE DATA</span><h2>保存稳定 ID，不保存复杂参数</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
