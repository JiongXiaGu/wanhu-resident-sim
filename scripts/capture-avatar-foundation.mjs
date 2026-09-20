import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderBoards} from './avatar-review/audit-packs.mjs';

// Phase 8A 只补自由创作边界与本轮画稿证据；通用组合/兼容检查不在这里再复制一套。
const out='review-screenshots/avatar/phase8a',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const editor=page.locator('[data-avatar-editor]');
const state=()=>editor.evaluate(n=>({key:n.dataset.target,frame:n.dataset.frame,recipe:JSON.parse(n.dataset.recipe),dirty:n.dataset.dirty,context:n.dataset.editorContext}));
const stored=key=>page.evaluate(k=>localStorage.getItem('wanhu.avatar.v1:'+k),key);
async function choose(part,id){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option="${id}"]`).click();}
async function settle(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('img')].map(n=>n.decode()));});}
async function shot(name){await settle();await page.locator('.av-dialog').screenshot({path:`${out}/${name}.png`,animations:'disabled'});}
async function save(){await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function frame(value){const [sex,stage]=value.split('.');await page.locator(`[data-studio-sex="${sex}"]`).click();await page.locator(`[data-studio-age="${stage}"]`).click();assert.equal((await state()).frame,value);}
try{
 await page.goto(`${base}/?view=avatar-editor`,{waitUntil:'networkidle'});await editor.waitFor();
 const start=await state();assert.equal(start.context,'studio');assert.equal(start.frame,'female.adult');
 const identity=await page.locator('.resident-identity').textContent(),day=await page.locator('.sim-game').getAttribute('data-game-day');
 await page.evaluate(()=>{window.__foundationWorld=document.querySelector('.sim-game');});
 assert.deepEqual(await page.locator('[data-part-tab]').evaluateAll(nodes=>nodes.map(n=>n.dataset.partTab)),['face','hair','outfit','expression']);
 await choose('face','long');const adultDraft=(await state()).recipe;
 await page.locator('[data-studio-age="elder"]').click();await page.locator('[role="alertdialog"]').waitFor();
 await page.locator('[data-pending-stay]').click();assert.equal((await state()).frame,'female.adult');assert.deepEqual((await state()).recipe,adultDraft);
 await page.locator('[data-studio-age="elder"]').click();await page.locator('[data-pending-apply]').click();
 assert.equal((await state()).frame,'female.elder');assert.deepEqual(JSON.parse(await stored(start.key)),adultDraft);
 const elderKey=(await state()).key;assert.equal(await stored(elderKey),null);
 await choose('face','broad');await page.locator('[data-studio-sex="male"]').click();await page.locator('[data-pending-discard]').click();
 assert.equal((await state()).frame,'male.elder');assert.equal(await stored(elderKey),null);
 const snapshots={};
 const frames=['female.child','male.child','female.adult','male.adult','female.elder','male.elder'];
 for(const f of frames){
  await frame(f);
  await page.locator('[data-foundation-template]').click();await save();
  const current=await state();snapshots[f]={key:current.key,recipe:current.recipe};
  const counts={};
  for(const part of ['face','hair','outfit','expression']){
   await page.locator(`[data-part-tab="${part}"]`).click();
   const ids=await page.locator('[data-option]').evaluateAll(nodes=>nodes.map(n=>n.dataset.option));
   const expected=await page.evaluate(async({f,part})=>{const m=await import('/src/avatar/model.ts');return m.optionsFor('chibi-cute-v1',part,f).map(o=>o.id);},{f,part});
   assert.deepEqual(ids,expected);counts[part]=ids.length;
  }
  assert.equal(counts.face,6);
  await page.locator('[data-part-tab="face"]').click();
  if(['female.child','female.adult','male.elder'].includes(f))await shot(`studio-${f}`);
 }
 assert.equal(Object.keys(snapshots).length,6);
 assert.equal(await page.evaluate(()=>window.__foundationWorld===document.querySelector('.sim-game')),true);
 assert.equal(await page.locator('.resident-identity').textContent(),identity);assert.equal(await page.locator('.sim-game').getAttribute('data-game-day'),day);
 assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('wanhu.avatar.v1:')&&!k.includes(':studio:')).length),0,'Studio leaked into player/resident storage');
 await page.reload({waitUntil:'networkidle'});await editor.waitFor();
 for(const [f,expected] of Object.entries(snapshots)){await frame(f);assert.deepEqual((await state()).recipe,expected.recipe);assert.deepEqual(JSON.parse(await stored(expected.key)),expected.recipe);}
 // 当前分类随机只改一个选项；样板过滤也约束随机搭配，不悄悄跳回旧素材。
 await frame('female.adult');await page.locator('[data-part-tab="face"]').click();const old=(await state()).recipe;
 await page.locator('[data-random-part]').click();const changed=(await state()).recipe;assert.notEqual(changed.face,old.face);
 for(const part of ['hair','outfit','expression'])assert.equal(changed[part],old[part]);
 await page.locator('[data-cancel-draft]').click();await page.locator('[data-sample-only]').click();
 await page.locator('[data-part-tab="hair"]').click();assert.equal(await page.locator('[data-option]').count(),3);
 await choose('hair','scholar-cap');await shot('studio-headwear');await page.locator('[data-cancel-draft]').click();
 await page.locator('[data-random-outfit]').click();const random=(await state()).recipe;
 assert(['bound','scholar-cap','work-headscarf'].includes(random.hair));assert(['commoner','artisan','adult-female-ruqun'].includes(random.outfit));
 if((await state()).dirty==='true')await page.locator('[data-cancel-draft]').click();
 await choose('outfit','artisan');await shot('studio-outfits');await page.locator('[data-cancel-draft]').click();await page.locator('[data-sample-only]').click();
 // 迟到的导入不能污染切换后的年龄框架。
 await page.evaluate(()=>{window.__foundationFileText=File.prototype.text;File.prototype.text=function(){const file=this;return new Promise(resolve=>{window.__foundationResolve=()=>window.__foundationFileText.call(file).then(resolve);});};});
 await page.locator('.av-tools').evaluate(n=>n.open=true);
 await page.locator('[data-import-recipe]').setInputFiles({name:'late.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...old,face:'broad',expression:'surprise'}))});
 await page.waitForFunction(()=>typeof window.__foundationResolve==='function');await frame('female.child');const childBefore=(await state()).recipe;
 await page.evaluate(async()=>{await window.__foundationResolve();File.prototype.text=window.__foundationFileText;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 assert.deepEqual((await state()).recipe,childBefore,'Late import crossed studio frames');
 // 切到真实对象后没有年龄切换按钮；自由创作不会改写居民的年龄/性别。
 await page.locator('[data-editor-mode="bound"]').click();
 const resident=page.locator('[data-target-kind="resident"]').first();await resident.click();
 const bound=await state();assert.equal(bound.context,'bound');assert.equal(await page.locator('[data-studio-age]').count(),0);
 assert.equal(await stored(bound.key),null);await shot('bound-resident');
 const data=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts'),s=await import('/src/avatar/studio.tsx');
  const boards=[],inventory=[];
  for(const frame of m.frames){
   const base=m.foundationRecipe(frame),faces=m.optionsFor(base.pack,'face',frame);
   const cells=faces.map(face=>({label:`${face.label} / ${face.id}`,svg:r.renderAvatar(frame,{...base,face:face.id,expression:'calm'}),sizes:true}));
   boards.push({name:`faces-${frame}`,title:`Phase 8A · ${frame} · 六脸型候选（固定发型与衣装）`,columns:3,cells});
   inventory.push({frame,faces:faces.map(x=>x.id),sampleHair:m.optionsFor(base.pack,'hair',frame).filter(x=>s.isFoundationSample('hair',x.id)).map(x=>x.id)});
  }
  const hats=[];
  for(const frame of ['female.adult','male.adult'])for(const id of ['bound','scholar-cap','work-headscarf']){
   hats.push({label:`${frame} / ${id}`,svg:r.renderAvatar(frame,{...m.foundationRecipe(frame),hair:id}),sizes:true});
  }
  boards.push({name:'headwear',title:'Phase 8A · 束发 / 完整折巾 / 劳作包巾 · 男女固定脸对照',columns:3,cells:hats});
  const clothes=[];
  for(const frame of m.frames){
   const base=m.foundationRecipe(frame);
   for(const option of m.optionsFor(base.pack,'outfit',frame).filter(x=>s.isFoundationSample('outfit',x.id))){
    clothes.push({label:`${frame} / ${option.label}`,svg:r.renderAvatar(frame,{...base,outfit:option.id}),sizes:true});
   }
  }
  boards.push({name:'outfits',title:'Phase 8A · 胸像服装样板 · 领口、肩线与裁切边界',columns:3,cells:clothes});
  boards.push({name:'six-frame-overview',title:'Phase 8A · 六框架日常样板 · 96 / 64 / 48px',columns:3,cells:m.frames.map(frame=>({label:frame,svg:r.renderAvatar(frame,m.foundationRecipe(frame)),sizes:true}))});
  // 帽身不能再被前发切成孤立横条：固定内部测试点必须在可见前帽层中。
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px';document.body.append(host);let capPoints=0;
  try{for(const frame of ['female.adult','male.adult'])for(const id of ['scholar-cap','work-headscarf']){
   host.innerHTML=r.renderAvatar(frame,{...m.foundationRecipe(frame),hair:id});
   const shapes=[...host.querySelectorAll('[data-layer="HeadwearFront"] path')];
   for(const [x,y] of [[160,65],[160,90],[160,119]]){if(!shapes.some(shape=>shape.getAttribute('fill')!=='none'&&shape.isPointInFill(new DOMPoint(x,y))))throw new Error(`${frame}/${id}: missing visible cap body`);capPoints++;}
  }}finally{host.remove();}
  return {boards,inventory,capPoints};
 });
 await renderBoards(page,out,data.boards,{background:'#eee6da',subtitle:'本轮候选画稿诊断，不是最终定稿。对照固定面部与配件；小图按实际 96 / 64 / 48px 展示。'});
 assert.deepEqual(errors,[]);
 const report={commit:process.env.GITHUB_SHA??'local',status:'automated-pass',studioFrames:6,independentSaves:true,reload:true,dirtyStaySaveDiscard:true,lateImportIsolation:true,residentIdentityUnchanged:true,randomPartIsolation:true,sampleFilter:true,capPoints:data.capPoints,inventory:data.inventory,boards:data.boards.map(x=>x.name+'.png'),manualArtApproval:'pending actual artifact inspection and user acceptance'};
 await writeFile(`${out}/foundation-review.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(error){await page.screenshot({path:`${out}/failure.png`,fullPage:true}).catch(()=>{});await writeFile(`${out}/failure.txt`,String(error)+'\n'+errors.join('\n'));throw error;}finally{await browser.close();}
