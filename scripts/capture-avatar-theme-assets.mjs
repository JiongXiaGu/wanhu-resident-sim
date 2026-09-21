import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderBoards} from './avatar-review/audit-packs.mjs';

// 8D1 合批证据。复用通用矩阵 / renderBoards，只补文字检索、新资产和旧稿冻结。
const out='review-screenshots/avatar/phase8d1',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile(`${out}/baseline.json`,'utf8'));
assert.equal(baseline.sha,'7ba57695c392f14d598e818beadecff877dd52f9');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const editor=page.locator('[data-avatar-editor]');
const state=()=>editor.evaluate(n=>({key:n.dataset.target,frame:n.dataset.frame,recipe:JSON.parse(n.dataset.recipe),dirty:n.dataset.dirty}));
const ids=()=>page.locator('[data-option]').evaluateAll(ns=>ns.map(n=>n.dataset.option));
async function save(){await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function frame(f){await save();const [sex,age]=f.split('.');await page.locator(`[data-studio-sex="${sex}"]`).click();await page.locator(`[data-studio-age="${age}"]`).click();assert.equal((await state()).frame,f);}
async function choose(part,id){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option="${id}"]`).click();assert.equal((await state()).recipe[part],id);}
async function shot(name){await page.locator('.av-choices').evaluate(n=>n.scrollTop=0);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});await page.locator('.av-dialog').screenshot({path:`${out}/${name}.png`,animations:'disabled'});}
try{
 await page.goto(`${base}/?view=avatar-editor`,{waitUntil:'networkidle'});await editor.waitFor();
 const identity=await page.locator('.resident-identity').textContent(),day=await page.locator('.sim-game').getAttribute('data-game-day');
 const inventory=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts');
  return Object.fromEntries(['female.adult','male.adult'].map(f=>[f,Object.fromEntries(['hair','outfit'].map(part=>[part,m.optionsFor('chibi-cute-v1',part,f).filter(o=>o.tags?.includes('8D1'))]))]));
 });
 let selections=0,searchChecks=0;
 const snapshots={};
 for(const [f,parts] of Object.entries(inventory)){
  await frame(f);
  for(const [part,options] of Object.entries(parts)){
   await page.locator(`[data-part-tab="${part}"]`).click();const before=await state();
   await page.locator('[data-asset-search]').fill('  8d1  ');
   assert.deepEqual(await ids(),options.map(o=>o.id));assert.deepEqual(await state(),before);searchChecks++;
   for(const option of options){
    const previous=(await state()).recipe;
    await page.locator(`[data-option="${option.id}"]`).click();const current=(await state()).recipe;
    assert.equal(current[part],option.id);
    for(const other of ['face','hair','outfit','expression'].filter(x=>x!==part))assert.equal(current[other],previous[other]);
    assert((await page.locator('[data-asset-description]').textContent()).includes(option.description));
    assert.equal(await page.locator(`[data-option="${option.id}"]`).getAttribute('title'),option.description);selections++;
   }
   const sample=options[0];
   for(const query of [sample.id.toUpperCase(),sample.label,sample.description.slice(0,8),`8d1 ${sample.tags[0]}`]){
    await page.locator('[data-asset-search]').fill(query);assert((await ids()).includes(sample.id));searchChecks++;
   }
   const keep=await state();await page.locator('[data-asset-search]').fill('不存在的素材XYZ');
   assert.equal((await ids()).length,0);assert(await page.locator('[data-asset-empty]').isVisible());assert.deepEqual(await state(),keep);assert(await page.locator('[data-random-part]').isDisabled());searchChecks++;
   await page.locator('[data-reset-asset-filters]').click();assert.equal(await page.locator('[data-asset-search]').inputValue(),'');
   // 历史“仅已重画”不能悄悄把新增当成重画；组合筛选为空有明确出口。
   await page.locator('[data-asset-search]').fill('8d1');await page.locator('[data-sample-only]').click();assert.equal((await ids()).length,0);
   await page.locator('[data-reset-asset-filters]').click();
   await page.locator('[data-asset-search]').fill(`8d1 ${sample.tags[0]}`);const pool=await ids(),previous=(await state()).recipe;
   await page.locator('[data-random-part]').click();const randomized=(await state()).recipe;
   assert(pool.includes(randomized[part]));for(const other of ['face','hair','outfit','expression'].filter(x=>x!==part))assert.equal(randomized[other],previous[other]);
   await page.locator('[data-clear-asset-search]').click();await save();searchChecks+=2;
  }
  snapshots[f]=await state();
 }
 // 刷新与 Frame 切换不共享搜索字符串，也不共享样板保存。
 await page.reload({waitUntil:'networkidle'});await editor.waitFor();
 for(const [f,snapshot] of Object.entries(snapshots)){await frame(f);assert.deepEqual((await state()).recipe,snapshot.recipe);}
 await page.locator('[data-asset-search]').fill('8d1');await frame('female.child');assert.equal(await page.locator('[data-asset-search]').inputValue(),'');
 await page.locator('[data-part-tab="hair"]').click();assert((await ids()).every(id=>id.startsWith('child-')));
 await page.locator('[data-asset-search]').fill('8d1');assert.equal((await ids()).length,0);await page.locator('[data-reset-asset-filters]').click();
 // 每主题男女各一张真实工坊，不用整图诊断冒充可编辑 UI。
 const looks={
  common:{label:'常服','female.adult':['adult-loop-bun','adult-home-short-over'],'male.adult':['adult-center-part','adult-home-deep-wrap']},
  labor:{label:'劳作','female.adult':['adult-work-fold-wrap','adult-work-shoulder-vest'],'male.adult':['adult-work-short-tail','adult-work-slant-coat']},
  merchant:{label:'商铺','female.adult':['adult-shop-pin-knot','adult-shop-pleated-jacket'],'male.adult':['adult-shop-square-wrap','adult-shop-side-robe']},
  traveler:{label:'行旅','female.adult':['adult-travel-kerchief','adult-travel-shawl-jacket'],'male.adult':['adult-travel-straw-hat','adult-travel-shoulder-cape']},
 };
 for(const [theme,look] of Object.entries(looks))for(const f of ['female.adult','male.adult']){
  await frame(f);await choose('face','oval');await choose('expression','smile');await choose('hair',look[f][0]);await choose('outfit',look[f][1]);
  await page.locator('[data-asset-search]').fill(`8d1 ${look.label}`);await shot(`studio-${theme}-${f}`);await save();
 }
 // 新 ID 的 JSON 往返不携带描述、检索词、年龄或职业。
 await page.locator('.av-tools').evaluate(n=>n.open=true);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('[data-export="json"]').click()]);
 const exported=JSON.parse(await readFile(await download.path(),'utf8'));assert.deepEqual(Object.keys(exported).sort(),['schema','version','pack','face','hair','outfit','expression'].sort());
 await choose('outfit','commoner');
 await page.locator('[data-import-recipe]').setInputFiles({name:'theme-recipe.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await page.waitForFunction(recipe=>JSON.stringify(JSON.parse(document.querySelector('[data-avatar-editor]').dataset.recipe))===JSON.stringify(recipe),exported);
 // 绑定真实成年居民，用新斗笠和披肩应用；身份/日期不变。
 await save();await page.locator('[data-editor-mode="bound"]').click();await page.locator('[data-target-kind="resident"][data-target-frame$=".adult"]').first().click();
 const boundBefore=await state();assert.equal(await page.locator('[data-studio-age]').count(),0);
 await choose('hair','adult-travel-straw-hat');await choose('outfit','adult-travel-shoulder-cape');await save();
 const bound=await state();assert.equal(bound.frame,boundBefore.frame);assert.equal(bound.key,boundBefore.key);
 assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem('wanhu.avatar.v1:'+k)),bound.key),bound.recipe);
 assert.equal(await page.locator('.resident-identity').textContent(),identity);assert.equal(await page.locator('.sim-game').getAttribute('data-game-day'),day);
 await page.locator('[data-asset-search]').fill('8d1 行旅');await shot('bound-resident');
 const data=await page.evaluate(async({baseline,looks})=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const {themeHairOptions:hair,themeOutfitOptions:outfit,themeGroups:groups}=await import('/src/avatar/packs/chibi/theme-catalog.ts');
  const {filterAssetOptions}=await import('/src/avatar/asset-search.ts');
  const require=(ok,message)=>{if(!ok)throw new Error(message);};
  for(const f of m.frames)for(const part of ['hair','outfit'])require(m.optionsFor('chibi-cute-v1',part,f).length<=(f.endsWith('adult')?22:12),`Frame option density ${f}/${part}`);
  const oldIds=new Set(baseline.rows.map(row=>`${row.frame}/${row.part}/${row.id}`));
  const lists={hair,outfit},boards=[],newRows=[],descriptions=[];let crownEdgeSamples=0,cutChecks=0;
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-9000px';document.body.append(host);
  for(const part of m.parts)for(const option of m.optionsFor('chibi-cute-v1',part)){
   require(option.description?.trim().length>=20,`Missing description ${part}/${option.id}`);
   require(option.tags?.length>=2&&option.tags.every(t=>typeof t==='string'&&t.trim()),`Missing tags ${option.id}`);
   require(filterAssetOptions([option],option.description.slice(0,8)).length===1,`Description is not searchable ${option.id}`);
   descriptions.push({part,id:option.id,label:option.label,description:option.description,tags:option.tags,frames:option.frames??m.frames});
  }
  require(hair.length===16&&outfit.length===16,'8D1 A+B inventory drift');
  for(const row of baseline.rows)require(r.renderAvatar(row.frame,row.recipe)===row.svg,`8B2 artwork changed ${row.frame}/${row.part}/${row.id}`);
  const fixed=f=>({...m.recipeForPack('chibi-cute-v1',f),face:'oval',expression:'smile',hair:'bound',outfit:'commoner'});
  const geometry=(f,part,id)=>r.renderLayers(f,{...fixed(f),[part]:id}).filter(layer=>part==='hair'?['BackHair','HeadwearBack','FrontHair','HeadwearFront'].includes(layer.id):layer.id==='Outfit').map(layer=>{
   const xml=new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${layer.svg}</svg>`,'image/svg+xml');
   return [...xml.querySelectorAll('path,ellipse,circle,rect')].map(n=>[n.tagName,...['d','cx','cy','rx','ry','r','x','y','width','height'].map(a=>n.getAttribute(a))]);
  });
  for(const f of m.frames)for(const part of ['hair','outfit'])for(const option of m.optionsFor('chibi-cute-v1',part,f)){
   if(oldIds.has(`${f}/${part}/${option.id}`))continue;
   require(f.endsWith('adult')&&lists[part].some(o=>o.id===option.id),`Unexpected added asset ${f}/${part}/${option.id}`);
   const recipe={...fixed(f),[part]:option.id},svg=r.renderAvatar(f,recipe),signature=JSON.stringify(geometry(f,part,option.id));
   require(m.parseRecipe(recipe)[part]===option.id,'Recipe round-trip changed new ID');
   host.innerHTML=svg;
   if(part==='outfit'){
    require(host.querySelector('[data-theme-wardrobe="8d1"][data-wardrobe-cut]'),`Missing authored cut ${option.id}`);
    for(const slot of ['base','collar','overlay','detail'])require(host.querySelector(`[data-chibi-outfit-part="${slot}"]`),`Missing ${slot}/${option.id}`);
    cutChecks++;
   }else{
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
   for(const other of m.optionsFor('chibi-cute-v1',part,f).filter(o=>o.id!==option.id))require(signature!==JSON.stringify(geometry(f,part,other.id)),`Color-only duplicate ${f}/${option.id}/${other.id}`);
   newRows.push({frame:f,part,id:option.id,label:option.label,svg});
  }
  host.remove();
  const expected=hair.reduce((n,o)=>n+o.frames.length,0)+outfit.reduce((n,o)=>n+o.frames.length,0);require(newRows.length===expected,'New frame coverage mismatch');
  for(const group of groups){
   const cells=[];
   for(const part of ['hair','outfit'])for(const option of lists[part].filter(o=>o.tags.includes(group.label)))for(const f of option.frames){
    const row=newRows.find(x=>x.frame===f&&x.part===part&&x.id===option.id);require(row,'Missing theme render');
    cells.push({label:`${f} · ${option.label} · ${option.id}`,svg:row.svg,sizes:true});
   }
   boards.push({name:group.id,title:`Phase 8D1 · ${group.label} · 全部适用成年 Frame · 固定其余部件`,columns:3,cells});
  }
  boards.push({name:'overview',title:'Phase 8D1 · 四主题男女组合 · 96 / 64 / 48px',columns:4,cells:Object.entries(looks).flatMap(([,look])=>['female.adult','male.adult'].map(f=>({label:`${look.label} · ${f}`,svg:r.renderAvatar(f,{...fixed(f),hair:look[f][0],outfit:look[f][1]}),sizes:true})))});
  // 新款代表在六脸型下的叠穿 / 帽发关系；其余全组合仍由通用审查负责。
  boards.push({name:'faces-and-collars',title:'Phase 8D1 · 六脸型 × 斗笠与折领 / 披肩',columns:3,cells:['female.adult','male.adult'].flatMap(f=>m.optionsFor('chibi-cute-v1','face',f).map(face=>({label:`${f} · ${face.label}`,svg:r.renderAvatar(f,{...fixed(f),face:face.id,hair:'adult-travel-straw-hat',outfit:f==='female.adult'?'adult-shop-pleated-jacket':'adult-travel-shoulder-cape'}),sizes:true})))});
  return {boards,crownEdgeSamples,cutChecks,newRows:newRows.map(({svg,...row})=>row),metadataCount:descriptions.length,descriptions,oldRenderCount:baseline.rows.length};
 },{baseline,looks});
 await renderBoards(page,out,data.boards,{background:'#eee8da',subtitle:'当前提交真实 Renderer 诊断，不是工坊 UI；所有适用 Frame 与原尺寸 96 / 64 / 48px。'});
 const {boards,descriptions,...result}=data;
 await writeFile(`${out}/asset-descriptions.json`,JSON.stringify(descriptions,null,2)+'\n');
 assert.deepEqual(errors,[]);
 const report={status:'automated-pass',baselineSha:baseline.sha,selections,searchChecks,boundResidentKey:bound.key,boardCount:boards.length,desktopScreenshots:9,...result};
 await writeFile(`${out}/theme-assets-review.json`,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({selections,searchChecks,newFrameRenders:data.newRows.length,metadata:data.metadataCount,oldRenderCount:data.oldRenderCount}));
}finally{await browser.close();}
