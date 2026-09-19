import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1});
const out='review-screenshots/avatar',base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';await mkdir(out,{recursive:true});
try {
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-edit-resident-avatar]').waitFor();
 const measurements=[];
 for(const size of [{width:1280,height:720},{width:1366,height:768},{width:1600,height:1100},{width:1920,height:1080}]){
  await page.setViewportSize(size);
  const row=await page.evaluate(()=>{
   const launcher=document.querySelector('[data-open-avatar-workshop]').getBoundingClientRect(),button=document.querySelector('[data-edit-resident-avatar]'),b=button.getBoundingClientRect(),style=getComputedStyle(button);
   const collisions=[...document.querySelectorAll('.resident-panel,.sim-top-hud,.sim-command-dock,.sim-world-tools,.dev-panel')].filter(node=>{const r=node.getBoundingClientRect();return r.width&&r.height&&Math.max(r.left,launcher.left)<Math.min(r.right,launcher.right)&&Math.max(r.top,launcher.top)<Math.min(r.bottom,launcher.bottom);}).map(node=>node.className);
   return {width:innerWidth,height:innerHeight,buttonWidth:b.width,buttonHeight:b.height,fontSize:parseFloat(style.fontSize),collisions};
  });
  assert.deepEqual(row.collisions,[],'Launcher overlaps existing gameplay controls');assert(row.buttonWidth<=110&&row.buttonHeight<=26&&row.fontSize<=12,'Inline avatar edit button inherited oversized global styles');measurements.push(row);
  await page.screenshot({path:`${out}/integration-${size.width}x${size.height}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1600,height:1100});await page.locator('[data-edit-resident-avatar]').click();
 const editor=page.locator('[data-avatar-editor]');await editor.waitFor();
 const a=await editor.getAttribute('data-target'),targets=await page.locator('[data-target-kind="resident"]').evaluateAll(nodes=>nodes.map(node=>node.dataset.targetKey)),b=targets.find(k=>k!==a);
 await page.locator('.av-tools summary').click();
 const initial=JSON.parse(await editor.getAttribute('data-recipe'));
 // 文件读取尚未结束时切目标；迟到的导入结果不能写进另一个人的草稿。
 await page.evaluate(()=>{window.__originalFileText=File.prototype.text;File.prototype.text=function(){const file=this;return new Promise(resolve=>{window.__resolveAvatarFile=()=>window.__originalFileText.call(file).then(resolve);});};});
 await page.locator('[data-import-recipe]').setInputFiles({name:'slow.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...initial,hair:'wave',expression:'surprise'}))});
 await page.waitForFunction(()=>typeof window.__resolveAvatarFile==='function');
 await page.locator(`[data-target-key="${b}"]`).click();await page.waitForFunction(k=>document.querySelector('[data-avatar-editor]').dataset.target===k,b);
 const beforeB=await editor.getAttribute('data-recipe');
 await page.evaluate(async()=>{await window.__resolveAvatarFile();File.prototype.text=window.__originalFileText;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 assert.equal(await editor.getAttribute('data-recipe'),beforeB,'Late import changed new target');
 // 确认“应用后继续”真实保存甲、再切乙，而不是保存到新目标。
 await page.locator(`[data-target-key="${a}"]`).click();await page.waitForFunction(k=>document.querySelector('[data-avatar-editor]').dataset.target===k,a);
 const current=JSON.parse(await editor.getAttribute('data-recipe')),hair=current.hair==='crop'?'bob':'crop';
 await page.locator('[data-part-tab="hair"]').click();await page.locator(`[data-option="${hair}"]`).click();
 const expected=await editor.getAttribute('data-recipe');
 await page.locator(`[data-target-key="${b}"]`).click();await page.locator('[data-pending-apply]').click();await page.waitForFunction(k=>document.querySelector('[data-avatar-editor]').dataset.target===k,b);
 assert.equal(await page.evaluate(k=>localStorage.getItem('wanhu.avatar.v1:'+k),a),expected);assert.equal(await page.evaluate(k=>localStorage.getItem('wanhu.avatar.v1:'+k),b),null);
 await writeFile(`${out}/integration-review.json`,JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',measurements,lateImportTargetIsolation:true,applyThenSwitchTargetIsolation:true},null,2));
 console.log('Gameplay launcher placement, compact inline edit button, late import and apply-then-switch isolation passed.');
}catch(error){await page.screenshot({path:`${out}/integration-failure.png`,fullPage:true}).catch(()=>{});throw error;}finally{await browser.close();}
