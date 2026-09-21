import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import sharp from 'sharp';
import {renderBoards} from './avatar-review/audit-packs.mjs';

// 8D2 只补童老新增、旧稿冻结及真实点选证据；组合/兼容/存储负例仍由原通用审查负责。
const out='review-screenshots/avatar/phase8d2',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile(`${out}/baseline.json`,'utf8'));
assert.equal(baseline.sha,'70ca1ccd9cc5fa75491267ce29d20043df942994');
const document=await readFile('Documentation/Phase 8D2 童老头像资产扩充.md','utf8');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const editor=page.locator('[data-avatar-editor]');
const state=()=>editor.evaluate(n=>({key:n.dataset.target,frame:n.dataset.frame,recipe:JSON.parse(n.dataset.recipe),dirty:n.dataset.dirty}));
const ids=()=>page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option));
async function save(){await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function frame(f){await save();const [sex,age]=f.split('.');await page.locator(`[data-studio-sex="${sex}"]`).click();await page.locator(`[data-studio-age="${age}"]`).click();assert.equal((await state()).frame,f);}
async function choose(part,id){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option="${id}"]`).click();assert.equal((await state()).recipe[part],id);}
let desktopScreenshots=0;
async function shot(name,reset=true){if(reset)await page.locator('.av-choices').evaluate(n=>n.scrollTop=0);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});await page.locator('.av-dialog').screenshot({path:`${out}/${name}.png`,animations:'disabled'});desktopScreenshots++;}
const looks={
 'female.child':{hair:'child-side-loop',outfit:'child-arc-collar',travelHair:'child-outing-hat',travelOutfit:'child-outing-cape'},
 'male.child':{hair:'child-folded-knot',outfit:'child-side-fastened',travelHair:'child-helper-wrap',travelOutfit:'child-helper-smock'},
 'female.elder':{hair:'elder-braided-crown',outfit:'elder-rounded-lapel',travelHair:'elder-soft-work-wrap',travelOutfit:'elder-shawl-wrap'},
 'male.elder':{hair:'elder-flat-topknot',outfit:'elder-deep-front',travelHair:'elder-low-brim-cap',travelOutfit:'elder-travel-mantle'},
};
try{
 await page.goto(`${base}/?view=avatar-editor`,{waitUntil:'networkidle'});await editor.waitFor();
 const identity=await page.locator('.resident-identity').textContent(),day=await page.locator('.sim-game').getAttribute('data-game-day');
 const inventory=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts');
  return Object.fromEntries(m.frames.filter(f=>!f.endsWith('adult')).map(f=>[f,Object.fromEntries(['hair','outfit'].map(part=>[part,m.optionsFor('chibi-cute-v1',part,f).filter(o=>o.keywords?.includes('8D2'))]))]));
 });
 let selections=0,searchChecks=0,roundTrips=0;const savedFrames={};
 for(const [f,parts] of Object.entries(inventory)){
  await frame(f);await choose('face','oval');await choose('expression','smile');
  await choose('hair',looks[f].hair);await choose('outfit',looks[f].outfit);await save();
  for(const [part,options] of Object.entries(parts)){
   await page.locator(`[data-part-tab="${part}"]`).click();const before=await state(),all=await ids();
   await page.locator('[data-asset-search]').fill(' ８Ｄ２ ');assert.deepEqual(await ids(),options.map(o=>o.id));assert.deepEqual(await state(),before);searchChecks++;
   for(const option of options){
    const previous=(await state()).recipe;await page.locator(`[data-option="${option.id}"]`).click();const current=(await state()).recipe;
    assert.equal(current[part],option.id);for(const other of ['face','hair','outfit','expression'].filter(x=>x!==part))assert.equal(current[other],previous[other]);
    assert((await page.locator('[data-asset-description]').textContent()).includes(option.description));assert.equal(await page.locator(`[data-option="${option.id}"] em`).textContent(),'本批新增');selections++;
   }
   for(const query of [options[0].id.toUpperCase(),options[0].label,options[0].description.slice(0,8),`8D2 ${f}`,`8D2 ${options[0].theme}`]){
    await page.locator('[data-asset-search]').fill(query);assert((await ids()).includes(options[0].id));searchChecks++;
   }
   const keep=await state();await page.locator('[data-asset-search]').fill('没有这种童老素材XYZ');assert.deepEqual(await ids(),[]);assert.deepEqual(await state(),keep);assert(await page.locator('[data-random-part]').isDisabled());searchChecks++;
   await page.locator('[data-reset-asset-filters]').click();await page.locator('[data-asset-search]').fill('8D2');
   await page.locator('[data-sample-only]').click();assert.deepEqual(await ids(),[]);await page.locator('[data-reset-asset-filters]').click();
   await page.locator('[data-asset-search]').fill('8D2');const previous=(await state()).recipe;
   await page.locator('[data-random-part]').click();const next=(await state()).recipe;
   assert(options.some(o=>o.id===next[part]));for(const other of ['face','hair','outfit','expression'].filter(x=>x!==part))assert.equal(next[other],previous[other]);searchChecks++;
   await choose(part,looks[f][part]);await page.locator('[data-asset-search]').fill('8D2');await shot(`studio-${f}-${part}`);
   await page.locator('[data-clear-asset-search]').click();assert.deepEqual(await ids(),all);await save();await shot(`all-${f}-${part}`);
   await page.locator('[data-option]').last().scrollIntoViewIfNeeded();
   const bounds=await page.locator('[data-option]').last().boundingBox(),panel=await page.locator('.av-choices').boundingBox();
   assert(bounds&&panel&&bounds.y>=panel.y&&bounds.y+bounds.height<=panel.y+panel.height+1,'Last age option clipped');await shot(`all-${f}-${part}-end`,false);
  }
  // 每个童老 Frame 的新 ID 都经过真实 JSON 导出、改稿与导入恢复。
  await page.locator('.av-tools').evaluate(n=>n.open=true);const before=(await state()).recipe;
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('[data-export="json"]').click()]);
  const exported=JSON.parse(await readFile(await download.path(),'utf8'));assert.deepEqual(exported,before);
  assert.deepEqual(Object.keys(exported).sort(),['schema','version','pack','face','hair','outfit','expression'].sort());
  await choose('hair',f.endsWith('child')?'child-topknot':'elder-swept');
  await page.locator('[data-import-recipe]').setInputFiles({name:'age-theme.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
  await page.waitForFunction(recipe=>JSON.stringify(JSON.parse(document.querySelector('[data-avatar-editor]').dataset.recipe))===JSON.stringify(recipe),exported);
  await save();savedFrames[f]=await state();roundTrips++;await page.locator('.av-tools').evaluate(n=>n.open=false);
 }
 await page.reload({waitUntil:'networkidle'});await editor.waitFor();
 for(const [f,saved] of Object.entries(savedFrames)){await frame(f);assert.deepEqual((await state()).recipe,saved.recipe);}
 for(const f of ['female.adult','male.adult']){await frame(f);for(const part of ['hair','outfit']){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator('[data-asset-search]').fill('8D2');assert.deepEqual(await ids(),[]);await page.locator('[data-reset-asset-filters]').click();}}
 // 绑定四种真实居民：Frame 锁定、新配方只写自己的键；不改变模拟身份或日期。
 await save();await page.locator('[data-editor-mode="bound"]').click();const bindings=[];
 for(const [f,look] of Object.entries(looks)){
  const target=page.locator(`[data-target-kind="resident"][data-target-frame="${f}"]`).first();assert(await target.count(),`No resident fixture for ${f}`);await target.click();
  const before=await state();assert.equal(before.frame,f);assert.equal(await page.locator('[data-studio-age]').count(),0);
  await choose('hair',look.travelHair);await choose('outfit',look.travelOutfit);await save();const bound=await state();
  assert.equal(bound.key,before.key);assert.equal(bound.frame,before.frame);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem('wanhu.avatar.v1:'+k)),bound.key),bound.recipe);
  for(const other of bindings)assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem('wanhu.avatar.v1:'+k)),other.key),other.recipe);
  assert.equal(await page.locator('.resident-identity').textContent(),identity);assert.equal(await page.locator('.sim-game').getAttribute('data-game-day'),day);
  bindings.push(bound);await page.locator('[data-asset-search]').fill('8D2');await shot(`bound-${f}`);
 }
 const last=bindings.at(-1);await page.locator('[data-restore-avatar]').click();await page.locator('[data-pending-discard]').click();
 assert.equal(await page.evaluate(k=>localStorage.getItem('wanhu.avatar.v1:'+k),last.key),null);
 for(const other of bindings.slice(0,-1))assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem('wanhu.avatar.v1:'+k)),other.key),other.recipe);
 const data=await page.evaluate(async({baseline,looks})=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const {ageThemeHairOptions:hair,ageThemeOutfitOptions:outfit}=await import('/src/avatar/packs/chibi/age-theme-catalog.ts');
  const {assetThemes}=await import('/src/avatar/packs/catalog.ts'),{filterAssetOptions}=await import('/src/avatar/asset-search.ts');
  const require=(ok,msg)=>{if(!ok)throw new Error(msg);},lists={hair,outfit},boards=[],rows=[],metadata=[];
  let crownEdgeSamples=0,crossFaceChecks=0,frameChecks=0,cutChecks=0;
  const fixed=f=>({...m.recipeForPack('chibi-cute-v1',f),face:'oval',expression:'smile',hair:f.endsWith('child')?'child-topknot':'elder-swept',outfit:f.endsWith('child')?'child-short-robe':'elder-long-robe'});
  const selectedLayers=(f,part,recipe)=>r.renderLayers(f,recipe).filter(x=>part==='hair'?['BackHair','HeadwearBack','FrontHair','HeadwearFront'].includes(x.id):x.id==='Outfit');
  const geometry=(f,part,id)=>JSON.stringify(selectedLayers(f,part,{...fixed(f),[part]:id}).map(layer=>{
   const doc=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${layer.svg}</svg>`,'image/svg+xml');
   return [...doc.querySelectorAll('path,ellipse,circle,rect')].map(n=>[n.tagName,...['d','cx','cy','rx','ry','r','x','y','width','height','transform'].map(a=>n.getAttribute(a))]);
  }));
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-9000px';document.body.append(host);
  for(const row of baseline.rows)require(r.renderAvatar(row.frame,row.recipe)===row.svg,`Accepted art changed ${row.frame}/${row.id}`);
  for(const part of m.parts){const all=m.catalogFor('chibi-cute-v1')[part];require(new Set(all.map(o=>o.id)).size===all.length,`Duplicate ${part} IDs`);}
  for(const [part,options] of Object.entries(lists)){
   // 6 是本批清单，不把全库最终数量写死为长期契约。
   for(const age of ['child','elder'])require(options.filter(o=>o.frames.every(f=>f.endsWith(age))).length===6,`8D2 ${age}/${part} inventory drift`);
   for(const option of options){
    metadata.push({part,...option});require(assetThemes.includes(option.theme),`Invalid theme ${option.id}`);
    for(const field of ['description','silhouette','closestAssetId','distinction'])require(typeof option[field]==='string'&&option[field].trim(),`Missing ${field}/${option.id}`);
    require(option.description.length>=20&&option.keywords.length>=2&&option.keywords.every(k=>k.trim()),`Missing text ${option.id}`);
    require(option.frames.length&&new Set(option.frames).size===option.frames.length&&option.frames.every(f=>m.frames.includes(f)&&!f.endsWith('adult')),`Invalid Frame ${option.id}`);
    require(baseline.rows.some(row=>row.part===part&&row.id===option.closestAssetId),`Missing old comparison ${option.id}`);
    for(const size of [96,64,48])require(option.readability[size]?.trim(),`Missing ${size}px intent ${option.id}`);
    for(const word of [option.id,option.label,option.description.slice(0,8),option.theme,...option.keywords])require(filterAssetOptions([option],word).length===1,`Unsearchable ${word}/${option.id}`);
    for(const f of m.frames){
     const allowed=option.frames.includes(f),recipe={...m.recipeForPack('chibi-cute-v1',f),[part]:option.id};
     require(m.optionsFor('chibi-cute-v1',part,f).some(o=>o.id===option.id)===allowed,`Availability mismatch ${f}/${option.id}`);
     require(filterAssetOptions([option],f).length===(allowed?1:0),`Frame search mismatch ${f}/${option.id}`);
     const a=m.fitRecipeToFrame(recipe,f),b=m.fitRecipeToFrame(recipe,f);require(JSON.stringify(a)===JSON.stringify(b)&&((a[part]===option.id)===allowed),`Fallback mismatch ${f}/${option.id}`);frameChecks++;
    }
    for(const f of option.frames){
     const recipe={...fixed(f),[part]:option.id},svg=r.renderAvatar(f,recipe),signature=geometry(f,part,option.id),layers=selectedLayers(f,part,recipe);
     const reference=JSON.stringify(layers);
     for(const face of m.optionsFor('chibi-cute-v1','face',f)){require(JSON.stringify(selectedLayers(f,part,{...recipe,face:face.id}))===reference,`Face-dependent ${f}/${option.id}`);crossFaceChecks++;}
     for(const other of m.optionsFor('chibi-cute-v1',part,f).filter(o=>o.id!==option.id))require(signature!==geometry(f,part,other.id),`Color-only copy ${f}/${option.id}/${other.id}`);
     host.innerHTML=svg;
     if(part==='outfit'){
      require(host.querySelector('[data-age-theme="8d2"][data-wardrobe-cut]'),`Missing 8D2 cut ${option.id}`);
      for(const slot of ['base','collar'])require(host.querySelector(`[data-chibi-outfit-part="${slot}"] path`),`Empty ${slot} ${option.id}`);cutChecks++;
     }else{
      const hasHat=layers.some(x=>x.id.startsWith('Headwear')&&x.svg.trim());require(hasHat===(option.headwear==='integrated'),`Headwear ownership ${option.id}`);
      const root=host.querySelector('svg'),meta=host.querySelector('[data-chibi-head-shell]');
      const [left,right,top,temple]=['left','right','top-y','temple-y'].map(k=>+meta.getAttribute('data-frame-'+k));
      const shapes=[...root.querySelectorAll('[data-layer="FrontHair"] path,[data-layer="HeadwearFront"] path')].filter(n=>n.getAttribute('fill')!=='none');
      for(const [a,c,b] of [[[left,temple],[left+3,top+3],[160,top]],[[160,top],[right-3,top+3],[right,temple]]])for(let i=0;i<=40;i++){
       const t=i/40,q=(v,w,z)=>(1-t)*(1-t)*v+2*(1-t)*t*w+t*t*z;
       for(const [dx,dy] of [[0,0],[2,0],[-2,0],[0,2],[0,-2]]){const p=root.createSVGPoint();p.x=q(a[0],c[0],b[0])+dx;p.y=q(a[1],c[1],b[1])+dy;require(shapes.some(n=>n.isPointInFill(p)),`Exposed crown ${f}/${option.id}`);}crownEdgeSamples++;
      }
     }
     rows.push({frame:f,part,id:option.id,label:option.label,svg});
    }
   }
  }
  host.remove();
  const old=new Set(baseline.rows.map(row=>`${row.frame}/${row.part}/${row.id}`)),actual=[];
  for(const f of m.frames)for(const part of ['hair','outfit'])for(const o of m.optionsFor('chibi-cute-v1',part,f))if(!old.has(`${f}/${part}/${o.id}`))actual.push(`${f}/${part}/${o.id}`);
  require(JSON.stringify(actual.sort())===JSON.stringify(rows.map(row=>`${row.frame}/${row.part}/${row.id}`).sort()),'Unreviewed catalog addition');
  for(const f of Object.keys(looks))for(const part of ['hair','outfit']){
   require(m.optionsFor('chibi-cute-v1',part,f).length<=12,`Age UI density ${f}/${part}`);
   boards.push({name:`${part}-${f}`,title:`Phase 8D2 · ${f} · ${part} 新增 · 固定其余部件`,columns:2,cells:rows.filter(row=>row.frame===f&&row.part===part).map(row=>({label:`${row.label} / ${row.id}`,svg:row.svg,sizes:true}))});
  }
  const combos=Object.entries(looks).flatMap(([f,look])=>[[look.hair,look.outfit],[look.travelHair,look.travelOutfit]].map(([hair,outfit])=>({label:`${f} · ${hair} / ${outfit}`,svg:r.renderAvatar(f,{...fixed(f),hair,outfit}),sizes:true})));
  boards.push({name:'phase8d2-overview',title:'Phase 8D2 · 四 Frame 日常与出行组合 · 96 / 64 / 48px',columns:4,cells:combos});
  for(const age of ['child','elder'])boards.push({name:`${age}-faces-and-collars`,title:`Phase 8D2 · ${age} · 新帽巾 × 六脸型 × 衣领`,columns:3,cells:Object.entries(looks).filter(([f])=>f.endsWith(age)).flatMap(([f,look])=>m.optionsFor('chibi-cute-v1','face',f).map(face=>({label:`${f} / ${face.label}`,svg:r.renderAvatar(f,{...fixed(f),face:face.id,hair:look.travelHair,outfit:look.travelOutfit}),sizes:true})))});
  return {rows,boards,metadata,crownEdgeSamples,crossFaceChecks,frameChecks,cutChecks,oldRenderCount:baseline.rows.length,catalogCounts:Object.fromEntries(m.parts.map(p=>[p,m.optionsFor('chibi-cute-v1',p).length]))};
 },{baseline,looks});
 assert.equal(selections,data.rows.length);
 for(const option of data.metadata){
  const line=document.split('\n').find(s=>s.startsWith(`| \`${option.id}\``));assert(line,`Missing asset row ${option.id}`);
  for(const value of [option.label,option.description,option.theme,option.silhouette,option.closestAssetId,option.distinction,...option.frames,...option.keywords,...Object.values(option.readability)])assert(line.includes(value),`Stale documentation ${option.id}: ${value}`);
 }
 await renderBoards(page,out,data.boards,{background:'#eee8da',subtitle:'同一提交真实 Renderer 静态诊断，非完整工坊 UI；童老独立母版，原尺寸 96 / 64 / 48px。'});
 const nativeOutputs=[];
 for(const row of data.rows){const folder=`${out}/native/${row.frame}/${row.part}`;await mkdir(folder,{recursive:true});for(const size of [96,64,48]){
  const path=`${folder}/${row.id}-${size}.png`;await sharp(Buffer.from(row.svg)).resize(size,size).flatten({background:'#eee8da'}).png().toFile(path);const image=await sharp(path).metadata();assert.equal(image.width,size);assert.equal(image.height,size);nativeOutputs.push(path.slice(out.length+1));
 }}
 const {rows,boards,metadata,...counts}=data;assert.deepEqual(errors,[]);
 await writeFile(`${out}/asset-descriptions.json`,JSON.stringify(metadata,null,2)+'\n');
 await writeFile(`${out}/age-themes-review.json`,JSON.stringify({status:'automated-pass',baselineSha:baseline.sha,selections,searchChecks,roundTrips,boundResidents:bindings.map(b=>({frame:b.frame,key:b.key})),desktopScreenshots,boardCount:boards.length,nativeOutputs,...counts},null,2)+'\n');
 console.log(JSON.stringify({selections,searchChecks,roundTrips,desktopScreenshots,nativeSizeExports:nativeOutputs.length,...counts}));
}finally{await browser.close();}
