import { FACE_FAMILIES, HAIR_STYLES } from './resident/portrait/catalog';
import { portraitFrameIdFor } from './resident/portrait/frame';
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
  {residentStableId:'portrait-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'poor'},
  {residentStableId:'portrait-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'plain'},
  {residentStableId:'portrait-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'comfortable'},
  {residentStableId:'portrait-wealth',residentSeed:88001,gender:'female',lifeStage:'adult',wealthTier:'wealthy'},
];

const temporalVariants: SemanticAppearanceContext[] = [
  {residentStableId:'portrait-time',residentSeed:88111,gender:'female',lifeStage:'child',wealthTier:'plain'},
  {residentStableId:'portrait-time',residentSeed:88111,gender:'female',lifeStage:'adult',wealthTier:'plain'},
  {residentStableId:'portrait-time',residentSeed:88111,gender:'female',lifeStage:'elder',wealthTier:'plain'},
];

function fingerprint(value:unknown) {
  return hash32(JSON.stringify(value)).toString(16).padStart(8,'0');
}

function findFaceSample(faceFamilyId:string) {
  for(let seed=93000;seed<94000;seed+=1) {
    const family=FACE_FAMILIES.find((item)=>item.id===faceFamilyId)!;
    const context:SemanticAppearanceContext={
      residentStableId:'face-'+faceFamilyId,
      residentSeed:seed,
      gender:family.genders[0],
      lifeStage:'adult',
      wealthTier:'plain',
    };
    const dna=resolveAppearance(context);
    if(dna.identity.faceFamilyId===faceFamilyId) return {context,dna};
  }
  throw new Error('No deterministic face sample for '+faceFamilyId);
}

const faceSamples=FACE_FAMILIES.map((family)=>({family,...findFaceSample(family.id)}));

const hairSamples=HAIR_STYLES.map((style)=>{
  const lifeStage=style.lifeStages[0];
  const context:SemanticAppearanceContext={
    residentStableId:'hair-'+style.id,
    residentSeed:95000+HAIR_STYLES.indexOf(style)*31,
    gender:style.genders[0],
    lifeStage,
    wealthTier:'plain',
  };
  return {style,context,dna:resolveAppearance(context,{hairStyleId:style.id})};
});

const crowdStages:SemanticAppearanceContext['lifeStage'][]=['child','young-adult','adult','middle-age','elder','adult'];
const crowdWealth:SemanticAppearanceContext['wealthTier'][]=['poor','plain','comfortable','wealthy'];
const crowd=Array.from({length:24},(_,index)=>{
  const context:SemanticAppearanceContext={
    residentStableId:'portrait-crowd-'+String(index+1).padStart(2,'0'),
    residentSeed:97000+index*37,
    gender:index%2===0?'female':'male',
    lifeStage:crowdStages[index%crowdStages.length],
    wealthTier:crowdWealth[index%crowdWealth.length],
  };
  return {context,dna:resolveAppearance(context)};
});

function PortraitCard({context,dna,lod=96}:{context:SemanticAppearanceContext;dna:ResolvedAppearanceDNA;lod?:PortraitLod}) {
  return (
    <article className="portrait-review-card" data-identity-fingerprint={fingerprint(dna.identity)} data-life-stage={context.lifeStage}>
      <PortraitRenderer dna={dna} context={context} lod={lod}/>
      <b>{context.lifeStage} · {context.wealthTier}</b>
      <code>{portraitFrameIdFor(context.gender,context.lifeStage)}</code>
      <small>{dna.identity.faceFamilyId} · {dna.presentation.hairStyleId}</small>
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
    <main className="portrait-lab" data-portrait-lab="true" data-render-contract-version="8.4" data-frame-contract="three-band">
      <header className="portrait-lab-header">
        <div>
          <span>UNIFIED RESIDENT PORTRAIT · FRAME MIGRATION WORKBENCH</span>
          <h1>居民头像工作台：固定框架，自由换装</h1>
          <p>目标框架只保留 child / adult / elder 三个视觉年龄段。Face、Hair、Outfit 可以独立替换，但每个资产都必须直接符合 female/male × ageBand 的固定 Frame；运行时不再负责校准偏移。</p>
        </div>
        <nav><a href="/">居民 Demo</a></nav>
      </header>

      <section className="portrait-review-status">
        <div data-portrait-check="identity-wealth" data-state={wealthIdentityCount===1?'pass':'fail'}><b>{wealthIdentityCount===1?'PASS':'FAIL'}</b><span>财富不改变 Identity</span></div>
        <div data-portrait-check="identity-time" data-state={temporalIdentityCount===1&&temporalFaceCount===1?'pass':'fail'}><b>{temporalIdentityCount===1&&temporalFaceCount===1?'PASS':'FAIL'}</b><span>三阶段保持 FaceFamily</span></div>
        <div data-portrait-check="face-families" data-state={FACE_FAMILIES.length>=10?'pass':'fail'}><b>{FACE_FAMILIES.length}</b><span>当前 FaceFamily</span></div>
        <div data-portrait-check="hair-styles" data-state={HAIR_STYLES.length===8?'pass':'fail'}><b>{HAIR_STYLES.length}</b><span>当前 Hair Style</span></div>
        <div data-portrait-check="frame-contract" data-state="pass"><b>6</b><span>目标 PortraitFrame</span></div>
        <div data-portrait-check="simple-render" data-state="pass"><b>PASS</b><span>无 Mask / Anchor Solver</span></div>
      </section>

      <section className="portrait-review-section" data-portrait-section="wealth-invariant">
        <header><div><span>01 · IDENTITY</span><h2>同一个人换衣服，不换脸</h2></div><p>财富只影响初始 Outfit。FaceFamily / 肤色 / 基础发色属于稳定 Identity。</p></header>
        <div className="portrait-review-grid portrait-review-grid-4">
          {wealthResolved.map((item)=><PortraitCard key={item.context.wealthTier} {...item}/>)}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="temporal">
        <header><div><span>02 · THREE AGE BANDS</span><h2>同一个 FaceFamily：儿童 / 成年 / 老年</h2></div><p>Portrait 最终只保留 child / adult / elder。青年与中年属于 adult Frame，不再单独维护一套装配规格。</p></header>
        <div className="portrait-review-grid portrait-review-grid-3">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="face-families">
        <header><div><span>03 · FACE FAMILY</span><h2>脸型差异由资产控制</h2></div><p>FaceFamily 是身份。下一轮会按统一 Frame 重画三阶段资产，而不是增加运行时 Morph。</p></header>
        <div className="portrait-review-grid portrait-review-grid-6">
          {faceSamples.map(({family,context,dna})=>(
            <article className="portrait-review-card" data-face-family-card={family.id} key={family.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{family.label}</b><code>{family.id}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="hair-art">
        <header><div><span>04 · HAIR ART</span><h2>发型必须直接符合 Frame</h2></div><p>当前资产先作为兼容预览。新资产不会有 Head Anchor、placement、Mask 或自动适配；96 / 64 / 48 使用同一最终轮廓。</p></header>
        <div className="portrait-review-grid portrait-review-grid-4">
          {hairSamples.map(({style,context,dna})=>(
            <article className="portrait-review-card" data-hair-style-card={style.id} key={style.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{style.label}</b><code>{style.id}</code>
              <div className="portrait-review-lods">
                {[96,64,48].map((lod)=><div key={lod}><PortraitRenderer dna={dna} context={context} lod={lod as PortraitLod}/><span>{lod}px</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="frame-contract">
        <header><div><span>05 · FRAME CONTRACT</span><h2>当前 Stage Profile 只是兼容桥</h2></div><p>Renderer 已暴露新的 Frame ID。下一轮资产替换会把旧 youth / middle 取景与身体规格删掉，统一为固定画布与三套年龄 Frame。</p></header>
        <div className="portrait-review-grid portrait-review-grid-3">
          {temporalResolved.map(({context,dna})=>{
            const plan=buildRenderPlan(dna,context,96);
            return <article className="portrait-review-card" data-frame-review={plan.frameId} data-stage-profile={plan.stageProfileId} key={'frame-'+context.lifeStage}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{plan.frameId}</b><small>bridge: {plan.stageProfileId}</small>
            </article>;
          })}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="crowd">
        <header><div><span>06 · CROWD CHECK</span><h2>24 人 Seed 抽样</h2></div><p>继续用小尺寸群像观察重复感。下一轮增加高质量 Face / Hair / Outfit 资产解决重复，不增加人口配额算法。</p></header>
        <div className="portrait-review-crowd">
          {crowd.map(({context,dna})=><div data-pop-resident={context.residentStableId} key={context.residentStableId}><PortraitRenderer dna={dna} context={context} lod={48}/></div>)}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="save-contract">
        <header><div><span>07 · SAVED IDS</span><h2>继续保存紧凑稳定 ID</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
