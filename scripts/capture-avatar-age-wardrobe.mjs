import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderBoards} from './avatar-review/audit-packs.mjs';

// 8B1 只增加本批画稿证据与真实操作，不复制 Catalog/存储/腮红的通用大矩阵。
const out='review-screenshots/avatar/phase8b',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile(`${out}/baseline.json`,'utf8'));
assert.equal(baseline.sha,'28ad42619edb7a6abb21ca7ef8d2dee30d2afda2');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const editor=page.locator('[data-avatar-editor]');
const state=()=>editor.evaluate(n=>({frame:n.dataset.frame,key:n.dataset.target,recipe:JSON.parse(n.dataset.recipe),dirty:n.dataset.dirty}));
async function choose(part,id){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option="${id}"]`).click();assert.equal((await state()).recipe[part],id);}
async function save(){await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function shot(name){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});await page.locator('.av-dialog').screenshot({path:`${out}/${name}.png`,animations:'disabled'});}
try{
 await page.goto(`${base}/?view=avatar-editor`,{waitUntil:'networkidle'});await editor.waitFor();
 const looks={
  'female.child':{hair:'child-double-bun',outfit:'child-play-jacket'},
  'male.child':{hair:'child-double-knots',outfit:'child-apprentice'},
  'female.elder':{hair:'elder-coiled-bun',outfit:'elder-warm-coat'},
  'male.elder':{hair:'elder-thin-fringe',outfit:'elder-padded-robe'},
 };
 let selections=0,filterChecks=0;
 for(const [frame,look] of Object.entries(looks)){
  await save();const [sex,age]=frame.split('.');
  await page.locator(`[data-studio-sex="${sex}"]`).click();await page.locator(`[data-studio-age="${age}"]`).click();
  assert.equal((await state()).frame,frame);await page.locator('[data-foundation-template]').click();await save();
  await choose('hair',look.hair);await choose('outfit',look.outfit);await choose('face','oval');await choose('expression','smile');await save();
  for(const part of ['hair','outfit']){
   await page.locator(`[data-part-tab="${part}"]`).click();
   const all=await page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option));
   await page.locator('[data-sample-only]').click();
   assert.deepEqual(await page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option)),all,'Every child/elder option belongs to this reworked batch');filterChecks++;
   for(const id of all){await choose(part,id);selections++;}
   await choose(part,look[part]);await shot(`studio-${frame}-${part}`);await save();
   await page.locator('[data-sample-only]').click();
  }
 }
 const data=await page.evaluate(async({baseline,looks})=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const {ageWardrobeBatch}=await import('/src/avatar/packs/chibi/rework-batch.ts');
  const boards=[],inventory=[],changes=[];let unchangedAdultRenders=0,cutChecks=0;
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-9000px';document.body.append(host);
  const recipeFor=frame=>({...m.recipeForPack('chibi-cute-v1',frame),face:'oval',expression:'smile',hair:frame.endsWith('child')?'child-topknot':'elder-swept',outfit:frame.endsWith('child')?'child-short-robe':'elder-long-robe'});
  try{
   // 成年画稿本轮不动：旧新用相同 Recipe，比较实际八层 SVG 而不是源码行数。
   for(const row of baseline.rows.filter(x=>x.frame.endsWith('adult'))){if(r.renderAvatar(row.frame,row.recipe)!==row.svg)throw new Error(`Unexpected adult artwork change ${row.part}/${row.id}`);unchangedAdultRenders++;}
   for(const frame of ageWardrobeBatch.frames){
    const recipe=recipeFor(frame);
    for(const part of ['hair','outfit']){
     const options=m.optionsFor(recipe.pack,part,frame),cells=[];const cuts=new Set();
     for(const option of options){
      if(!ageWardrobeBatch[part].includes(option.id))throw new Error(`Unreviewed age asset ${frame}/${option.id}`);
      const current={...recipe,[part]:option.id},svg=r.renderAvatar(frame,current);
      cells.push({label:`${option.label} / ${option.id}`,svg,sizes:true});
      if(part==='outfit'){
       host.innerHTML=svg;const cut=host.querySelector('[data-age-wardrobe="phase8b"]')?.getAttribute('data-wardrobe-cut');
       if(!cut)throw new Error(`Missing authored cut ${option.id}`);cuts.add(cut);cutChecks++;
       for(const slot of ['base','collar','overlay','detail'])if(!host.querySelector(`[data-chibi-outfit-part="${slot}"]`))throw new Error(`Missing ${slot}/${option.id}`);
      }
     }
     if(part==='outfit'&&cuts.size<5)throw new Error(`Insufficient authored cuts in ${frame}`);
     boards.push({name:`${part}-${frame}`,title:`Phase 8B1 · ${frame} · ${part==='hair'?'发型重画':'衣装重画'} · 固定脸与其余部件`,columns:3,cells});
     inventory.push({frame,part,ids:options.map(o=>o.id),cuts:[...cuts]});
    }
   }
   for(const part of ['hair','outfit']){
    const ids=part==='hair'?['child-double-bun','child-double-knots','child-short-fringe','elder-coiled-bun','elder-short-bound','elder-thin-fringe']
     :['child-apprentice','child-play-jacket','child-helper','elder-warm-coat','elder-padded-robe','elder-fine-robe'];
    const cells=[];
    for(const id of ids){
     const frame=id.startsWith('child-')?'female.child':['elder-short-bound','elder-thin-fringe'].includes(id)?'male.elder':'female.elder';
     const row=baseline.rows.find(x=>x.frame===frame&&x.part===part&&x.id===id);if(!row)throw new Error('Baseline row missing '+id);
     const svg=r.renderAvatar(frame,row.recipe);if(svg===row.svg)throw new Error('Asset was not redrawn '+id);
     cells.push({label:`之前 · ${row.label}`,svg:row.svg,sizes:true},{label:`本轮 · ${row.label}`,svg,sizes:true});
     changes.push({frame,part,id});
    }
    boards.push({name:`before-after-${part}`,title:`Phase 8B1 · ${part==='hair'?'发型':'衣装'}旧新对照 · 左：8A / 右：本轮`,columns:2,cells});
   }
   boards.push({name:'four-frame-overview',title:'Phase 8B1 · 儿童与老年 · 同脸型 / 微笑 · 96 / 64 / 48px',columns:4,cells:Object.entries(looks).map(([frame,look])=>({label:frame,svg:r.renderAvatar(frame,{...recipeFor(frame),...look}),sizes:true}))});
  }finally{host.remove();}
  return {boards,inventory,changes,unchangedAdultRenders,cutChecks};
 },{baseline,looks});
 await renderBoards(page,out,data.boards,{background:'#eee8da',subtitle:'真实可编辑 SVG 画稿诊断，不是整图资产；所有小图按实际 96 / 64 / 48px 显示。'});
 // 专项自动检查不代替人工审查；对照与小尺寸证据都写入同一 Artifact。
 assert.deepEqual(errors,[]);
 const {boards,...report}=data;
 await writeFile(`${out}/age-wardrobe-review.json`,JSON.stringify({status:'automated-pass',baselineSha:baseline.sha,uiSelections:selections,filterChecks,boardCount:boards.length,...report},null,2)+'\n');
 console.log(JSON.stringify({uiSelections:selections,filterChecks,boards:boards.length,unchangedAdultRenders:data.unchangedAdultRenders,cutChecks:data.cutChecks}));
}finally{await browser.close();}
