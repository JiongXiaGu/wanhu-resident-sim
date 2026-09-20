import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import sharp from 'sharp';
import {auditRegisteredAvatarPacks} from './avatar-review/audit-packs.mjs';
const out='review-screenshots/avatar';await mkdir(out,{recursive:true});
const retired=['portrait-anime-lab','portrait-art-directions','portrait-composer-lab','portrait-modern-anime-lab','portrait-open-styles','portrait-style-bakeoff','portrait-style-study'];
const entries=await readdir('Web/src');assert(retired.every(name=>!entries.includes(name)),'Retired experiments remain in src');
const main=await readFile('Web/src/main.tsx','utf8');assert(retired.every(name=>!main.includes(name)),'Old gallery entry is still imported');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
const editor=page.locator('[data-avatar-editor]');
const recipe=async()=>JSON.parse(await editor.getAttribute('data-recipe'));
const key=()=>editor.getAttribute('data-target');
const image=()=>page.locator('.av-main-art img').getAttribute('src');
const stored=async target=>page.evaluate(k=>localStorage.getItem('wanhu.avatar.v1:'+k),target);
async function ready(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('img')].map(i=>i.decode()));});}
async function choose(part,value){await page.locator(`[data-part-tab="${part}"]`).click();await page.locator(`[data-option-part="${part}"][data-option="${value}"]`).click();await page.waitForFunction(({part,value})=>JSON.parse(document.querySelector('[data-avatar-editor]').dataset.recipe)[part]===value,{part,value});await ready();}
async function choosePack(value){await page.locator(`[data-pack="${value}"]`).click();await page.waitForFunction(value=>JSON.parse(document.querySelector('[data-avatar-editor]').dataset.recipe).pack===value,value);await ready();}
async function select(target){await page.locator(`[data-target-key="${target}"]`).click();await page.waitForFunction(k=>document.querySelector('[data-avatar-editor]').dataset.target===k,target);await ready();}
async function apply(){const expected=JSON.stringify(await recipe()),target=await key();await page.locator('[data-apply-avatar]').click();await page.waitForFunction(({target,expected})=>localStorage.getItem('wanhu.avatar.v1:'+target)===expected,{target,expected});await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.dirty==='false');}
async function screenshot(name,locator=page.locator('.av-dialog')){await ready();await locator.screenshot({path:join(out,name+'.png'),animations:'disabled',caret:'hide'});}
async function sizes(){const rows=await page.locator('[data-native-avatar]').evaluateAll(images=>images.map(i=>({n:+i.dataset.nativeAvatar,w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height})));assert.equal(rows.length,3);for(const row of rows){assert.equal(row.w,row.n);assert.equal(row.h,row.n);}assert(await page.locator('.av-dialog').evaluate(node=>node.scrollWidth<=node.clientWidth),'Dialog horizontal overflow');}
async function download(kind){if(kind==='json')await page.locator('.av-tools').evaluate(n=>n.open=true);const pending=page.waitForEvent('download');await page.locator(`[data-export="${kind}"]`).click();const d=await pending,stream=await d.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);const bytes=Buffer.concat(chunks);await writeFile(join(out,d.suggestedFilename()),bytes);return bytes;}
try{
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-edit-resident-avatar]').waitFor();
 const snapshot=await page.evaluate(async()=>fetch('/generated/resident-snapshot.json').then(r=>r.json()));
 const originalDay=Number(await page.locator('.sim-game').getAttribute('data-game-day'));
 await page.getByRole('button',{name:'+10 天',exact:true}).click();
 await page.waitForFunction(day=>+document.querySelector('.sim-game').dataset.gameDay===day,originalDay+10);
 const identity=await page.locator('.resident-identity').innerText(),story=await page.locator('.dev-panel').innerText();
 await page.evaluate(()=>{window.__avatarTestGame=document.querySelector('.sim-game');});
 const residentA=await page.locator('[data-edit-resident-avatar]').getAttribute('data-edit-resident-avatar');
 await page.locator('[data-edit-resident-avatar]').click();await editor.waitFor();await ready();
 const allTargets=await page.locator('[data-target-key]').evaluateAll(nodes=>nodes.map(n=>({key:n.dataset.targetKey,kind:n.dataset.targetKind,frame:n.dataset.targetFrame,id:n.dataset.targetResident})));
 assert.equal(allTargets.filter(t=>t.kind==='resident').length,snapshot.residents.length);
 assert.deepEqual(await page.locator('[data-part-tab]').evaluateAll(nodes=>nodes.map(n=>n.dataset.partTab)),['face','hair','outfit','expression']);
 const registeredPacks=await page.evaluate(async()=>{const model=await import('/src/avatar/model.ts');return model.packOptions.map(pack=>({id:pack.id,label:pack.label,lifecycle:pack.lifecycle,counts:pack.counts}));});
 const packIds=registeredPacks.map(pack=>pack.id),activePacks=registeredPacks.filter(pack=>pack.lifecycle==='active'),reviewPack=activePacks[0]?.id;
 assert.equal(activePacks.length,1,'Exactly one selectable active avatar pack is required');assert(reviewPack,'An active avatar pack is required');
 assert.deepEqual(await page.locator('[data-pack]').evaluateAll(nodes=>nodes.map(n=>n.dataset.pack)),packIds);
 assert.deepEqual(await page.locator('[data-pack]').evaluateAll(nodes=>nodes.map(n=>n.dataset.packLifecycle)),registeredPacks.map(pack=>pack.lifecycle));
 const semanticFields=['face','hair','outfit','expression'];
 const a=allTargets.find(t=>t.id===residentA),b=allTargets.find(t=>t.kind==='resident'&&t.key!==a.key),players=allTargets.filter(t=>t.kind==='player');
 async function captureHeadShell(frame,name){const target=allTargets.find(t=>t.frame===frame);assert(target,`Missing real avatar target for ${frame}`);await select(target.key);await choosePack(reviewPack);await choose('face','round');await choose('hair','scholar-cap');await choose('outfit','scholar');await choose('expression','calm');await screenshot(name);if(await editor.getAttribute('data-dirty')==='true'){await page.locator('[data-cancel-draft]').click();await ready();}}
 assert.equal(await key(),a.key);assert.equal(await stored(a.key),null);

 await select(players[0].key);assert.equal((await recipe()).pack,reviewPack,'New player draft must start from the active pack');
 await choose('face','round');await choose('hair','bob');await choose('outfit','knit');await choose('expression','smile');
 await sizes();const beforeStyle=await recipe();let expectedStyle=beforeStyle;
 for(let index=0;index<registeredPacks.length;index++){
  const pack=registeredPacks[index];
  expectedStyle=await page.evaluate(async({recipe,pack})=>{const model=await import('/src/avatar/model.ts');return model.withPack(recipe,pack);},{recipe:expectedStyle,pack:pack.id});
  await choosePack(pack.id);const styled=await recipe();assert.deepEqual(styled,expectedStyle,pack.id+' style switch did not follow explicit compatibility mapping');
  assert.notEqual(await image(),null);await screenshot(`01-style-${String(index+1).padStart(2,'0')}-${pack.id}`);
 }
 await choosePack(reviewPack);await choose('face','round');await choose('hair','scholar-cap');await choose('outfit','scholar');await choose('expression','calm');await screenshot('01z-female-face-frame-scholar');
 for(const part of semanticFields){
  await page.locator(`[data-part-tab="${part}"]`).click();
  const expectedCount=await page.evaluate(async({pack,part})=>{const model=await import('/src/avatar/model.ts');return model.optionsFor(pack,part).length;},{pack:reviewPack,part});
  assert.equal(await page.locator(`[data-option-part="${part}"]`).count(),expectedCount,`UI did not use ${reviewPack} ${part} catalog`);
 }
 await apply();const playerSaved=await stored(players[0].key);assert.equal(JSON.parse(playerSaved).pack,reviewPack);assert.equal(await stored(players[1].key),null);

 await select(players[1].key);assert.equal((await recipe()).pack,reviewPack,'Second player draft must start from the active pack');
 await choose('face','angular');await choose('hair','crop');await choose('outfit','shirt');await choose('expression','calm');
 let maleExpected=await recipe();
 for(let index=0;index<registeredPacks.length;index++){
  const pack=registeredPacks[index];
  maleExpected=await page.evaluate(async({recipe,pack})=>{const model=await import('/src/avatar/model.ts');return model.withPack(recipe,pack);},{recipe:maleExpected,pack:pack.id});
  await choosePack(pack.id);assert.deepEqual(await recipe(),maleExpected,pack.id+' male style switch did not follow explicit compatibility mapping');
  await screenshot(`02-style-${String(index+1).padStart(2,'0')}-${pack.id}`);
 }
 await choosePack(reviewPack);await choose('face','angular');await choose('hair','scholar-cap');await choose('outfit','scholar');await choose('expression','serious');await screenshot('02z-male-face-frame-scholar');await apply();assert.equal(await stored(players[0].key),playerSaved);
 await page.locator('[data-part-tab="expression"]').click();await screenshot('03-expression-options');
 await page.locator('[data-part-tab="hair"]').click();await screenshot('04-hair-options');
 await page.locator('[data-part-tab="outfit"]').click();await screenshot('05-outfit-options');
 checks.push('Only four editable categories; UI option grids come from the current Pack Catalog; pack switches follow deterministic exact/compatibility mapping; two player profiles save independently; actual resident roster is loaded from the current city snapshot');

 await select(a.key);await choosePack(reviewPack);await choose('face','round');await choose('hair','work-headscarf');await choose('outfit','commoner');await choose('expression','shy');
 assert.equal(await stored(a.key),null,'Preview must not persist before apply');
 await apply();const aSaved=await stored(a.key),aImage=await image();await screenshot('06-resident-applied');
 await select(b.key);await choose('face','long');await choose('hair','scholar-cap');await choose('outfit','scholar');await choose('expression','serious');await apply();const bSaved=await stored(b.key);
 assert.equal(await stored(a.key),aSaved);assert.notEqual(aSaved,bSaved);
 await select(a.key);assert.equal(await image(),aImage);
 await choose('hair','wave');assert.equal(await stored(a.key),aSaved);
 await page.locator('[data-target-key="'+b.key+'"]').click();await page.locator('[role="alertdialog"]').waitFor();
 await page.keyboard.press('Shift+Tab');assert(await page.locator('[data-pending-apply]').evaluate(n=>n===document.activeElement),'Unsaved confirmation focus must stay trapped');
 await page.keyboard.press('Escape');await page.locator('[role="alertdialog"]').waitFor({state:'detached'});assert.equal(await key(),a.key);
 await page.locator('[data-cancel-draft]').click();await ready();assert.equal(await image(),aImage);
 await choose('expression','surprise');await page.locator('[data-close-editor]').click();await page.locator('[data-pending-stay]').click();assert.equal(await key(),a.key);
 await page.locator('[data-close-editor]').click();await page.locator('[data-pending-discard]').click();await editor.waitFor({state:'detached'});
 assert.equal(await page.locator('[data-custom-avatar]').getAttribute('src'),aImage,'Applied avatar must appear in the real resident panel');
 assert.equal(await page.locator('.resident-identity').innerText(),identity);
 assert.equal(await page.locator('.dev-panel').innerText(),story);
 assert(await page.evaluate(()=>window.__avatarTestGame===document.querySelector('.sim-game')),'Editing must not remount the simulation');
 assert.equal(+await page.locator('.sim-game').getAttribute('data-game-day'),originalDay+10);
 await screenshot('07-real-resident-panel',page.locator('.resident-panel'));
 checks.push('Resident A and B use real Batch A ancient chibi assets and remain isolated; cancel/discard never persist; saved art appears in the game panel without resetting day, identity or story state');

 await page.locator('[data-edit-resident-avatar]').click();await ready();assert.equal(await image(),aImage);
 const json=await download('json'),svg=await download('svg'),png=await download('png');
 assert.deepEqual(JSON.parse(json.toString()),JSON.parse(aSaved));assert(svg.toString().includes('data-layer="Expression"'));
 const meta=await sharp(png).metadata();assert.equal(meta.width,640);assert.equal(meta.height,640);assert(meta.hasAlpha);const raw=await sharp(png).ensureAlpha().raw().toBuffer();assert.equal(raw[3],0);
 const invalid=Buffer.from(JSON.stringify({...JSON.parse(aSaved),target:b.key}));
 await page.locator('[data-import-recipe]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:invalid});
 await page.waitForFunction(()=>document.querySelector('[data-editor-message]').textContent.includes('字段'));assert.equal(await stored(a.key),aSaved);assert.equal(await image(),aImage);
 const imported={...JSON.parse(aSaved),hair:'braid',outfit:'shirt',expression:'smile'};
 await page.locator('[data-import-recipe]').setInputFiles({name:'good.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});
 await page.waitForFunction(()=>JSON.parse(document.querySelector('[data-avatar-editor]').dataset.recipe).hair==='braid');assert.equal(await stored(a.key),aSaved);
 await page.locator('[data-cancel-draft]').click();
 // 同一浏览器上下文中的另一个真实标签页：更新同对象后不能静默覆盖。
 const second=await context.newPage();await second.goto(base,{waitUntil:'networkidle'});
 const external={...JSON.parse(aSaved),hair:'long',expression:'calm'};
 await second.evaluate(async({target,recipe})=>{const store=await import('/src/avatar/store.ts');store.applyRecipe(target,recipe,store.getRaw(target));},{target:a.key,recipe:external});
 await page.waitForFunction(()=>document.querySelector('[data-avatar-editor]').dataset.conflict==='true');
 await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-editor-message]').textContent.includes('其他窗口更新'));
 assert.deepEqual(JSON.parse(await stored(a.key)),external);assert.equal(await stored(b.key),bSaved);
 await page.locator('[data-reload-saved]').click();await ready();assert.deepEqual(await recipe(),external);
 await second.close();
 // 配额错误不能显示已应用。错误后保留草稿，已有存储不变。
 await choose('hair','bob');await page.evaluate(()=>{window.__avatarSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('测试：存储空间不足','QuotaExceededError');};});
 await page.locator('[data-apply-avatar]').click();await page.waitForFunction(()=>document.querySelector('[data-editor-message]').textContent.includes('存储空间不足'));
 assert.deepEqual(JSON.parse(await stored(a.key)),external);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__avatarSetItem;});await page.locator('[data-cancel-draft]').click();
 checks.push('Real PNG/SVG/JSON export; validated import stays a draft; target injection rejected; same-target cross-tab conflict detected; quota failure never claims success');

 await page.locator('[data-close-editor]').click();await editor.waitFor({state:'detached'});
 await page.reload({waitUntil:'networkidle'});await page.locator('[data-open-avatar-workshop]').click();await editor.waitFor();await select(a.key);assert.deepEqual(await recipe(),external);assert.equal(await stored(b.key),bSaved);
 await page.locator('[data-restore-avatar]').click();await page.locator('[data-pending-discard]').click();assert.equal(await stored(a.key),null);assert.equal(await stored(b.key),bSaved);assert.equal(await stored(players[0].key),playerSaved);
 await page.locator('[data-close-editor]').click();await editor.waitFor({state:'detached'});assert.equal(await page.locator('[data-custom-avatar]').count(),0);assert.equal(await page.locator('.resident-avatar .portrait-renderer').count(),1);
 checks.push('Per-object recipes survive page reload; restoring resident A removes only A and returns the formal renderer');

 await page.locator('[data-open-avatar-workshop]').click();await editor.waitFor();
 const child=allTargets.find(t=>t.frame.endsWith('child')),elder=allTargets.find(t=>t.frame.endsWith('elder'));
 if(child){
  await select(child.key);await choosePack(reviewPack);await choose('face','round');await choose('hair','bound');await choose('outfit','commoner');await choose('expression','calm');await screenshot('08-child-resident');await page.locator('[data-cancel-draft]').click();await ready();
 }
 if(elder){
  await select(elder.key);await choosePack(reviewPack);await choose('face','oval');await choose('hair','merchant-wrap');await choose('outfit','merchant');await choose('expression','smile');await screenshot('09-elder-resident');await page.locator('[data-cancel-draft]').click();await ready();
 }
 await captureHeadShell('female.child','10-child-female-scholar-head-shell');
 await captureHeadShell('male.child','11-child-male-scholar-head-shell');
 await captureHeadShell('female.adult','12-adult-female-scholar-head-shell');
 await captureHeadShell('male.adult','13-adult-male-scholar-head-shell');
 await select(players[0].key);await page.locator('[data-preview-light]').click();await screenshot('14-light-preview');
 await page.setViewportSize({width:390,height:844});await sizes();await screenshot('15-mobile');
 await page.setViewportSize({width:320,height:800});await sizes();
 await page.setViewportSize({width:1600,height:1100});
 const packAudit=await auditRegisteredAvatarPacks(page,out);
 checks.push(`${packIds.length} selectable style packs plus lifecycle metadata are exercised automatically; Q版 Phase 4C additionally verifies Frame-based integrated Head Shells, fixed geometry across faces and child/adult/elder-specific head-top structures`);
 assert.deepEqual(errors,[],'Browser errors');
 await writeFile(join(out,'review.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',avatarPacks:packAudit,residentCount:snapshot.residents.length,checks,artisticApproval:'Requires actual screenshot inspection; registry coverage and CI are not an art quality rating'},null,2));
 console.log(checks.join('\n'));
}catch(error){await page.screenshot({path:join(out,'failure.png'),fullPage:true}).catch(()=>{});await writeFile(join(out,'failure.txt'),String(error)+'\n'+errors.join('\n'));throw error;}finally{await browser.close();}
