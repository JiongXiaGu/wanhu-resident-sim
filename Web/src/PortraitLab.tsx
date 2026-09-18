import { FACE_FAMILIES, HAIR_STYLES, OUTFIT_STYLES } from './resident/portrait/catalog';
import { portraitFrameIdFor } from './resident/portrait/frame';
import {
  assertPortraitIdentityInvariant,
  resolveAppearance,
  resolveSavedPortrait,
} from './resident/portrait/resolver';
import { hash32 } from './resident/portrait/seed';
import { PortraitRenderer } from './resident/portrait/PortraitRenderer';
import { PORTRAIT_RENDER_CONTRACT_VERSION } from './resident/portrait/types';
import type {
  PortraitFrameId,
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

const frameContext: Record<PortraitFrameId, Pick<SemanticAppearanceContext,'gender'|'lifeStage'>> = {
  'female.child':{gender:'female',lifeStage:'child'},
  'female.adult':{gender:'female',lifeStage:'adult'},
  'female.elder':{gender:'female',lifeStage:'elder'},
  'male.child':{gender:'male',lifeStage:'child'},
  'male.adult':{gender:'male',lifeStage:'adult'},
  'male.elder':{gender:'male',lifeStage:'elder'},
};

function fingerprint(value:unknown) {
  return hash32(JSON.stringify(value)).toString(16).padStart(8,'0');
}

function contextForFrame(frameId:PortraitFrameId, seed:number, stableId:string):SemanticAppearanceContext {
  const frame=frameContext[frameId];
  return {
    residentStableId:stableId,
    residentSeed:seed,
    gender:frame.gender,
    lifeStage:frame.lifeStage,
    wealthTier:'plain',
  };
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

function proofDna(faceFamilyId:string,hairStyleId:string,outfitStyleId:string,index:number) {
  const context:SemanticAppearanceContext={
    residentStableId:'female-adult-proof-'+index,
    residentSeed:98000+index*13,
    gender:'female',
    lifeStage:'adult',
    wealthTier:'plain',
  };
  const base=resolveAppearance(context,{hairStyleId,outfitStyleId});
  return {
    context,
    dna:{
      ...base,
      identity:{...base.identity,faceFamilyId},
    },
  };
}

const faceSamples=FACE_FAMILIES.map((family)=>({family,...findFaceSample(family.id)}));

const hairSamples=HAIR_STYLES.map((style,index)=>{
  const frameId=style.frameIds[0];
  const context=contextForFrame(frameId,95000+index*31,'hair-'+style.id);
  return {style,context,dna:resolveAppearance(context,{hairStyleId:style.id})};
});

const femaleAdultFaces=FACE_FAMILIES.filter((family)=>family.genders.includes('female'));
const femaleAdultHair=HAIR_STYLES.filter((style)=>style.frameIds.includes('female.adult'));
const femaleAdultOutfits=OUTFIT_STYLES.filter((style)=>style.frameIds.includes('female.adult'));
const femaleAdultProof=femaleAdultFaces.flatMap((face)=>
  femaleAdultHair.flatMap((hair)=>
    femaleAdultOutfits.map((outfit)=>{
      const index=femaleAdultFaces.indexOf(face)*100+femaleAdultHair.indexOf(hair)*10+femaleAdultOutfits.indexOf(outfit);
      return {face,hair,outfit,...proofDna(face.id,hair.id,outfit.id,index)};
    }),
  ),
);

const outfitSamples=femaleAdultOutfits.map((style,index)=>{
  const context:SemanticAppearanceContext={
    residentStableId:'outfit-proof-'+style.id,
    residentSeed:96500+index*41,
    gender:'female',
    lifeStage:'adult',
    wealthTier:style.initialWealthTiers[0],
  };
  return {style,context,dna:resolveAppearance(context,{outfitStyleId:style.id,hairStyleId:femaleAdultHair[0].id})};
});

const femaleAdultFaceClose=femaleAdultFaces.map((face,index)=>{
  const sample=proofDna(face.id,femaleAdultHair[0].id,femaleAdultOutfits[1].id,700+index);
  return {face,...sample};
});

const maleAdultFaces=FACE_FAMILIES.filter((family)=>family.genders.includes('male'));
const maleElderHair=HAIR_STYLES.find((style)=>style.frameIds.includes('male.elder'))!;
const maleElderOutfit=OUTFIT_STYLES.find((style)=>style.id==='outfit.plain.v2')!;
const maleElderReview=maleAdultFaces.map((face,index)=>{
  const context:SemanticAppearanceContext={
    residentStableId:'male-elder-review-'+index,
    residentSeed:99000+index*29,
    gender:'male',
    lifeStage:'elder',
    wealthTier:'plain',
  };
  const base=resolveAppearance(context,{hairStyleId:maleElderHair.id,outfitStyleId:maleElderOutfit.id});
  return {face,context,dna:{...base,identity:{...base.identity,faceFamilyId:face.id}}};
});

const crowdStages:SemanticAppearanceContext['lifeStage'][]=['child','young-adult','adult','middle-age','elder'];
const crowdWealth:SemanticAppearanceContext['wealthTier'][]=['poor','plain','comfortable','wealthy'];
const crowd=Array.from({length:24},(_,index)=>{
  const residentSeed=97000+index*37;
  const context:SemanticAppearanceContext={
    residentStableId:'portrait-crowd-'+String(index+1).padStart(2,'0'),
    residentSeed,
    gender:(hash32('crowd-gender:'+residentSeed)%2===0)?'female':'male',
    lifeStage:crowdStages[hash32('crowd-stage:'+residentSeed)%crowdStages.length],
    wealthTier:crowdWealth[hash32('crowd-wealth:'+residentSeed)%crowdWealth.length],
  };
  return {context,dna:resolveAppearance(context)};
});

const agingAdultContext:SemanticAppearanceContext={
  residentStableId:'portrait-aging-contract',
  residentSeed:99661,
  gender:'male',
  lifeStage:'adult',
  wealthTier:'plain',
};
const agingAdultDna=resolveAppearance(agingAdultContext);
const agingSavedPortrait={
  faceFamilyId:agingAdultDna.identity.faceFamilyId,
  hairStyleId:agingAdultDna.presentation.hairStyleId,
  outfitStyleId:agingAdultDna.presentation.outfitStyleId,
  skinPaletteId:agingAdultDna.identity.skinPaletteId,
  baseHairColorId:agingAdultDna.identity.baseHairColorId,
};
const agingElderContext={...agingAdultContext,lifeStage:'elder' as const};
const agingElderDna=resolveSavedPortrait(agingElderContext,agingSavedPortrait);
const ageTransitionPass=
  HAIR_STYLES.some((style)=>style.id===agingElderDna.presentation.hairStyleId&&style.frameIds.includes('male.elder'))
  && OUTFIT_STYLES.some((style)=>style.id===agingElderDna.presentation.outfitStyleId&&style.frameIds.includes('male.elder'))
  && agingElderDna.identity.faceFamilyId===agingAdultDna.identity.faceFamilyId;

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
    <main className="portrait-lab" data-portrait-lab="true" data-render-contract-version={PORTRAIT_RENDER_CONTRACT_VERSION} data-frame-contract="three-band">
      <header className="portrait-lab-header">
        <div>
          <span>UNIFIED RESIDENT PORTRAIT · FEMALE.ADULT PROOF</span>
          <h1>居民头像工作台：固定框架，中国古代居民气质</h1>
          <p>第一批正式替换资产落在 female.adult。脸、发式、衣着都直接按同一 Frame 作画：发式以束、挽、盘为主，服装以交领、叠领、对襟等日常轮廓为主，保持克制、低饱和，不做戏服式夸张。</p>
        </div>
        <nav><a href="/?view=portrait-style-bakeoff">新画风竞标</a><a href="/?view=portrait-style-study">上一轮探索</a><a href="/">居民 Demo</a></nav>
      </header>

      <section className="portrait-review-status">
        <div data-portrait-check="identity-wealth" data-state={wealthIdentityCount===1?'pass':'fail'}><b>{wealthIdentityCount===1?'PASS':'FAIL'}</b><span>财富不改变 Identity</span></div>
        <div data-portrait-check="identity-time" data-state={temporalIdentityCount===1&&temporalFaceCount===1?'pass':'fail'}><b>{temporalIdentityCount===1&&temporalFaceCount===1?'PASS':'FAIL'}</b><span>三阶段保持 FaceFamily</span></div>
        <div data-portrait-check="female-adult-hair" data-state={femaleAdultHair.length===3?'pass':'fail'}><b>{femaleAdultHair.length}</b><span>成年女性发式</span></div>
        <div data-portrait-check="female-adult-outfit" data-state={femaleAdultOutfits.length===4?'pass':'fail'}><b>{femaleAdultOutfits.length}</b><span>成年女性衣着</span></div>
        <div data-portrait-check="frame-contract" data-state="pass"><b>6</b><span>PortraitFrame</span></div>
        <div data-portrait-check="proof-combinations" data-state={femaleAdultProof.length===72?'pass':'fail'}><b>{femaleAdultProof.length}</b><span>female.adult 组合</span></div>
        <div data-portrait-check="saved-age-transition" data-state={ageTransitionPass?'pass':'fail'}><b>{ageTransitionPass?'PASS':'FAIL'}</b><span>跨年龄保存头像兼容</span></div>
      </section>

      <section className="portrait-review-section" data-portrait-section="face-close-review">
        <header><div><span>01 · FACE CLOSE REVIEW</span><h2>六张成年女性完整脸</h2></div><p>每个 FaceFamily 现在直接拥有眉、眼、鼻、嘴。眼睛改为自然正视的上/下眼睑与可见瞳仁，不再使用统一眯眼弧线。</p></header>
        <div className="portrait-review-grid portrait-review-grid-6">
          {femaleAdultFaceClose.map(({face,context,dna})=>(
            <article className="portrait-review-card portrait-face-close-card" data-face-close-review={face.id} key={'close-'+face.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{face.label}</b><code>{face.id}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="male-elder-review">
        <header><div><span>02 · MALE ELDER FIX REVIEW</span><h2>老年男子：发式、头型、脖颈、领口</h2></div><p>顶部束发必须与头骨相连；灰发沿头型收束；领口放宽、缩短颈部，不再出现漂浮发髻和“脖子插进衣服”的拼接感。</p></header>
        <div className="portrait-review-grid portrait-review-grid-4">
          {maleElderReview.map(({face,context,dna})=>(
            <article className="portrait-review-card" data-male-elder-review={face.id} key={'elder-'+face.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{face.label}</b>
              <div className="portrait-review-lods">
                {[96,64,48].map((lod)=><div key={lod}><PortraitRenderer dna={dna} context={context} lod={lod as PortraitLod}/><span>{lod}px</span></div>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="female-adult-proof">
        <header><div><span>03 · FEMALE.ADULT FRAME PROOF</span><h2>6 张脸 × 3 套发式 × 4 套衣服</h2></div><p>72 个组合全部使用同一固定坐标和同一裁切，不允许运行时 Offset。这里专门检查头发、脸、脖颈、衣领是否发生漂移。</p></header>
        <div className="portrait-proof-grid">
          {femaleAdultProof.map(({face,hair,outfit,context,dna})=>(
            <article
              className="portrait-proof-card"
              data-female-adult-proof="true"
              data-proof-face={face.id}
              data-proof-hair={hair.id}
              data-proof-outfit={outfit.id}
              key={face.id+'|'+hair.id+'|'+outfit.id}
            >
              <PortraitRenderer dna={dna} context={context} lod={64}/>
              <small>{face.label}<br/>{hair.label}<br/>{outfit.label}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="female-adult-outfits">
        <header><div><span>04 · CLOTHING</span><h2>成年女性常服轮廓</h2></div><p>粗布交领、素色交领、叠领襦衣、对襟罩衫。先用衣领与肩线体现生活条件，不靠艳色、头饰或职业制服。</p></header>
        <div className="portrait-review-grid portrait-review-grid-4">
          {outfitSamples.map(({style,context,dna})=>(
            <article className="portrait-review-card" data-female-adult-outfit={style.id} key={style.id}>
              <PortraitRenderer dna={dna} context={context} lod={96}/>
              <b>{style.label}</b><code>{style.id}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="face-families">
        <header><div><span>05 · FACE FAMILY</span><h2>脸型保持克制，不做模板化夸张</h2></div><p>成年女性 6 套 FaceFamily 已按同一头部区域重画；辨识度主要来自脸部轮廓与整体比例，文化气质更多交给发式与衣着承担。</p></header>
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
        <header><div><span>06 · HAIR ART</span><h2>束、挽、盘，而不是现代发型换皮</h2></div><p>female.adult 已有低挽圆髻、圆髻、半束垂发；其它 Frame 仍有较早期的美术资产，但运行时已经完全使用同一固定 Frame 架构。</p></header>
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

      <section className="portrait-review-section" data-portrait-section="temporal">
        <header><div><span>07 · THREE AGE BANDS</span><h2>同一个 FaceFamily：儿童 / 成年 / 老年</h2></div><p>运行时已全部切到 child / adult / elder 固定 Frame；这里继续检查同一 FaceFamily 跨三个年龄段的身份连续性，儿童与老年仅剩美术质量需要继续提升。</p></header>
        <div className="portrait-review-grid portrait-review-grid-3">
          {temporalResolved.map((item)=><PortraitCard key={item.context.lifeStage} {...item}/>)}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="crowd">
        <header><div><span>08 · CROWD CHECK</span><h2>24 人 Seed 抽样</h2></div><p>成年女性现在会从 3 套发式与 4 套服装中按 Frame 组合；其它 Frame 暂不为了数量增加临时资产。</p></header>
        <div className="portrait-review-crowd">
          {crowd.map(({context,dna})=><div data-pop-resident={context.residentStableId} key={context.residentStableId}><PortraitRenderer dna={dna} context={context} lod={48}/></div>)}
        </div>
      </section>

      <section className="portrait-review-section" data-portrait-section="save-contract">
        <header><div><span>09 · SAVED IDS</span><h2>保存的仍然只是五个稳定 ID</h2></div></header>
        <pre>{JSON.stringify(wealthResolved[1].dna,null,2)}</pre>
      </section>
    </main>
  );
}
