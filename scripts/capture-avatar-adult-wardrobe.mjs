import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderBoards} from './avatar-review/audit-packs.mjs';

// 8B2 的有限批次证据：沿用真实工坊与 renderBoards，不建立第二套 Review 系统。
const out='review-screenshots/avatar/phase8b2',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile(`${out}/baseline.json`,'utf8'));
assert.equal(baseline.sha,'59028b3afd4b24c1cc57edbe68ce13b2bd5314f9');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const editor=page.locator('[data-avatar-editor]');
const state=()=>editor.evaluate(n=>({frame:n.dataset.frame,key:n.dataset.target,recipe:JSON.parse(n.dataset.recipe),dirty:n.dataset.dirty}));
async function choose(part,id){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option="${id}"]`).click();assert.equal((await state()).recipe[part],id);}
async function save(){await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function frame(value){await save();const [sex,age]=value.split('.');await page.locator(`[data-studio-sex="${sex}"]`).click();await page.locator(`[data-studio-age="${age}"]`).click();assert.equal((await state()).frame,value);}
async function shot(name){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});await page.locator('.av-dialog').screenshot({path:`${out}/${name}.png`,animations:'disabled'});}
try{
 await page.goto(`${base}/?view=avatar-editor`,{waitUntil:'networkidle'});await editor.waitFor();
 let uiSelections=0,filterChecks=0;
 const looks={'female.adult':{hair:'adult-high-bun',outfit:'adult-female-work'},'male.adult':{hair:'adult-traveler-wrap',outfit:'adult-male-long-robe'}};
 for(const [f,look] of Object.entries(looks)){
  await frame(f);await choose('face','oval');await choose('expression','smile');await choose('hair',look.hair);await choose('outfit',look.outfit);await save();
  for(const part of ['hair','outfit']){
   await page.locator(`[data-part-tab="${part}"]`).click();
   const ids=await page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option));
   await page.locator('[data-sample-only]').click();
   assert.deepEqual(await page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option)),ids,'All current adult options have now been redrawn; future IDs are not implicitly included');filterChecks++;
   for(const id of ids){await choose(part,id);uiSelections++;}
   await choose(part,look[part]);await shot(`studio-${f}-${part}`);await save();await page.locator('[data-sample-only]').click();
  }
 }
 for(const [f,id] of [['female.child','child-play-jacket'],['female.elder','elder-warm-coat'],['male.elder','elder-fine-robe']]){
  await frame(f);await choose('hair',f.endsWith('child')?'child-topknot':'elder-swept');await choose('face','oval');await choose('expression','smile');await choose('outfit',id);await shot(`studio-${id}`);await save();
 }
 // 对真实成年居民应用本批素材，年龄/性别锁定，原居民身份和日期不能变化。
 const identity=await page.locator('.resident-identity').textContent(),day=await page.locator('.sim-game').getAttribute('data-game-day');
 await page.locator('[data-editor-mode="bound"]').click();
 await page.locator('[data-target-kind="resident"][data-target-frame$=".adult"]').first().click();
 const boundBefore=await state();assert.equal(await page.locator('[data-studio-age]').count(),0);
 await choose('hair','merchant-wrap');await choose('outfit','merchant');await save();const bound=await state();
 assert.equal(bound.frame,boundBefore.frame);assert.equal(bound.key,boundBefore.key);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem('wanhu.avatar.v1:'+key)),bound.key),bound.recipe);
 assert.equal(await page.locator('.resident-identity').textContent(),identity);assert.equal(await page.locator('.sim-game').getAttribute('data-game-day'),day);
 await shot('bound-resident');
 const data=await page.evaluate(async({baseline,looks})=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const {adultWardrobeBatch:batch,collarRepairIds}=await import('/src/avatar/packs/chibi/rework-batch.ts');
  const require=(ok,message)=>{if(!ok)throw new Error(message);};
  const recipeFor=f=>({...m.recipeForPack('chibi-cute-v1',f),face:'oval',expression:'smile',hair:f.endsWith('child')?'child-topknot':f.endsWith('elder')?'elder-swept':'bound',outfit:f.endsWith('child')?'child-short-robe':f.endsWith('elder')?'elder-long-robe':'commoner'});
  const slots=part=>part==='hair'?['BackHair','HeadwearBack','FrontHair','HeadwearFront']:['Outfit'];
  const parse=svg=>new DOMParser().parseFromString(svg,'image/svg+xml');
  const boards=[],inventory=[],changed=[],unchanged=[];let crownEdgeSamples=0,cutChecks=0;
  const expectedRows=m.frames.reduce((n,f)=>n+['hair','outfit'].reduce((sum,part)=>sum+m.optionsFor('chibi-cute-v1',part,f).length,0),0);
  require(baseline.rows.length===expectedRows,'Catalog count changed without a new reviewed baseline');
  for(const row of baseline.rows){
   require(m.optionsFor('chibi-cute-v1',row.part,row.frame).some(o=>o.id===row.id),'Baseline option no longer exists');
   const svg=r.renderAvatar(row.frame,row.recipe),planned=(row.frame.endsWith('adult')&&batch[row.part].includes(row.id))||(row.part==='outfit'&&collarRepairIds.includes(row.id));
   require((svg!==row.svg)===planned,`Unexpected changed/unchanged row ${row.frame}/${row.part}/${row.id}`);
   (planned?changed:unchanged).push({frame:row.frame,part:row.part,id:row.id});
   const before=parse(row.svg),after=parse(svg);
   require(before.querySelector('defs').outerHTML===after.querySelector('defs').outerHTML,'Definition change outside artwork batch');
   for(const layer of after.querySelectorAll('[data-layer]'))if(!slots(row.part).includes(layer.getAttribute('data-layer'))){
    require(before.querySelector(`[data-layer="${layer.getAttribute('data-layer')}"]`).outerHTML===layer.outerHTML,'A part comparison changed another layer');
   }
  }
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-9000px';document.body.append(host);
  try{
   for(const f of batch.frames)for(const part of ['hair','outfit']){
    const cells=[],cuts=new Set();const options=m.optionsFor('chibi-cute-v1',part,f);
    for(const option of options){
     const svg=r.renderAvatar(f,{...recipeFor(f),[part]:option.id});
     cells.push({label:`${option.label} / ${option.id}${batch[part].includes(option.id)?' · 8B2':' · 保留8A'}`,svg,sizes:true});
     if(!batch[part].includes(option.id))continue;
     host.innerHTML=svg;
     if(part==='outfit'){
      const cut=host.querySelector('[data-adult-wardrobe="phase8b2"]')?.getAttribute('data-wardrobe-cut');require(cut,`Missing cut ${option.id}`);cuts.add(cut);cutChecks++;
      for(const slot of ['base','collar','overlay','detail'])require(host.querySelector(`[data-chibi-outfit-part="${slot}"]`),`Missing ${slot}/${option.id}`);
     }else{
      // 原五点 Coverage 之外的弧线余量，只是 QA，不驱动 Hair 变形。
      const root=host.querySelector('svg'),meta=host.querySelector('[data-chibi-head-shell]');
      const left=+meta.getAttribute('data-frame-left'),right=+meta.getAttribute('data-frame-right'),top=+meta.getAttribute('data-frame-top-y'),temple=+meta.getAttribute('data-frame-temple-y');
      const shapes=[...host.querySelectorAll('[data-layer="FrontHair"] path,[data-layer="HeadwearFront"] path')].filter(n=>n.getAttribute('fill')!=='none');
      for(const [a,c,b] of [[[left,temple],[left+3,top+3],[160,top]],[[160,top],[right-3,top+3],[right,temple]]])for(let i=0;i<=40;i++){
       const t=i/40,q=(v,w,z)=>(1-t)*(1-t)*v+2*(1-t)*t*w+t*t*z;
       for(const [dx,dy] of [[0,0],[2,0],[-2,0],[0,2],[0,-2]]){
        const point=root.createSVGPoint();point.x=q(a[0],c[0],b[0])+dx;point.y=q(a[1],c[1],b[1])+dy;
        require(shapes.some(n=>n.isPointInFill(point)),`Exposed crown ${f}/${option.id} at ${point.x},${point.y}`);
       }crownEdgeSamples++;
      }
     }
    }
    if(part==='outfit')require(cuts.size>=6,`Too few distinct authored cuts in ${f}`);
    inventory.push({frame:f,part,ids:options.map(o=>o.id),cuts:[...cuts]});
    boards.push({name:`${part}-${f}`,title:`Phase 8B2 · ${f} · ${part==='hair'?'成年发型':'成年衣装'} · 其余部件固定`,columns:3,cells});
   }
  }finally{host.remove();}
  // 三款童老问题两性都检查；另外五款成年样本共用成年基准脸与发型。
  const collarRows=baseline.rows.filter(row=>row.part==='outfit'&&collarRepairIds.includes(row.id));
  for(const [f,id] of [['female.adult','adult-female-work'],['female.adult','adult-shop-assistant'],['male.adult','merchant'],['male.adult','adult-winter-coat'],['male.adult','scholar']])collarRows.push(baseline.rows.find(row=>row.frame===f&&row.part==='outfit'&&row.id===id));
  require(collarRows.every(Boolean),'Missing collar sample');
  boards.push({name:'outfit-collar-checks',title:'Phase 8B2 · 衣领 / 门襟专项 · 同 Frame 固定脸、头发、表情',columns:3,cells:collarRows.map(row=>({label:`${row.frame} / ${row.label}`,svg:r.renderAvatar(row.frame,row.recipe),sizes:true}))});
  for(const part of ['hair','outfit']){
   const selected=part==='hair'?['low-bun','adult-high-bun','adult-side-braid','adult-short-bound','adult-half-up','adult-traveler-wrap']:['child-play-jacket','elder-warm-coat','elder-fine-robe','merchant','adult-female-work','adult-shop-assistant'];
   const cells=[];
   for(const id of selected){
    const f=id.startsWith('child-')?'female.child':id.startsWith('elder-')?'male.elder':['adult-short-bound','adult-half-up','adult-traveler-wrap','merchant'].includes(id)?'male.adult':'female.adult';
    const row=baseline.rows.find(x=>x.frame===f&&x.part===part&&x.id===id);require(row,'Missing comparison '+id);
    // 每对只换一个部件，其余八层已经通过上方字节比较。
    cells.push({label:`8B1 · ${f} / ${row.label}`,svg:row.svg,sizes:true},{label:`8B2 · ${f} / ${row.label}`,svg:r.renderAvatar(f,row.recipe),sizes:true});
   }
   boards.push({name:`before-after-${part}`,title:`Phase 8B2 · ${part} 单部件对照 · 左：8B1 / 右：8B2`,columns:2,cells});
  }
  boards.push({name:'adult-overview',title:'Phase 8B2 · 成年组合 · 大形与 96 / 64 / 48px',columns:2,cells:Object.entries(looks).map(([f,look])=>({label:f,svg:r.renderAvatar(f,{...recipeFor(f),...look}),sizes:true}))});
  return {boards,inventory,changed,unchanged,crownEdgeSamples,cutChecks};
 },{baseline,looks});
 await renderBoards(page,out,data.boards,{background:'#eee8da',subtitle:'当前提交真实 SVG Renderer 诊断，不是整图资产或工坊 UI；小图实际 96 / 64 / 48px。'});
 assert.deepEqual(errors,[]);
 const {boards,...report}=data;
 await writeFile(`${out}/adult-wardrobe-review.json`,JSON.stringify({status:'automated-pass',baselineSha:baseline.sha,uiSelections,filterChecks,boundResidentKey:bound.key,boundResidentFrame:bound.frame,boardCount:boards.length,...report},null,2)+'\n');
 console.log(JSON.stringify({uiSelections,filterChecks,changed:data.changed.length,unchanged:data.unchanged.length,crownEdgeSamples:data.crownEdgeSamples,cutChecks:data.cutChecks,boards:boards.length}));
}finally{await browser.close();}
