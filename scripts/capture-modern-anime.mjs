import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import sharp from 'sharp';
const out='review-screenshots/modern-anime';
await mkdir(join(out,'exports'),{recursive:true});
async function isolated(dir){for(const file of await readdir(dir,{withFileTypes:true})){const name=join(dir,file.name);if(file.isDirectory())await isolated(name);else if(/\.tsx?$/.test(name))assert(!/from\s+['"][^'"]*(?:resident\/portrait|portrait-anime-lab|portrait-composer-lab|portrait-art-directions)/.test(await readFile(name,'utf8')),`Old art import: ${name}`);}}
await isolated('Web/src/portrait-modern-anime-lab');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const base=process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173';
const route=base+'/?view=portrait-modern-anime-lab';
const state=async()=>JSON.parse(await page.locator('[data-modern]').getAttribute('data-look'));
const source=async()=>page.locator('[data-current-portrait]').getAttribute('src');
async function ready(){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});}
async function choose(key,id){if(['face','hair','headwear','outfit','expression'].includes(key))await page.locator(`[data-tab="${key}"]`).click();await page.locator(`[data-key="${key}"][data-choice="${id}"]`).click();await page.waitForFunction(({key,id})=>JSON.parse(document.querySelector('[data-modern]').dataset.look)[key]===id,{key,id});await ready();}
async function proof(key){await page.locator(`[data-proof="${key}"]`).click();await page.locator(`[data-proof-mode="${key}"]`).waitFor();await ready();}
async function capture(name,locator=page){await ready();const settings={path:join(out,name+'.png'),animations:'disabled',caret:'hide'};if(locator===page)await page.screenshot({...settings,fullPage:true});else await locator.screenshot(settings);}
async function pixels(){const sizes=await page.locator('[data-native-size]').evaluateAll(items=>items.map(i=>({size:+i.dataset.nativeSize,w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height})));assert(sizes.length>=3);for(const item of sizes){assert.equal(item.w,item.size);assert.equal(item.h,item.size);}assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');}
async function exported(kind){const pending=page.waitForEvent('download');await page.locator(`[data-export="${kind}"]`).click();const d=await pending,stream=await d.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);const bytes=Buffer.concat(chunks);await writeFile(join(out,d.suggestedFilename()),bytes);return bytes;}
try{
 await page.goto(route,{waitUntil:'networkidle'});await ready();
 await page.evaluate(()=>{localStorage.setItem('wanhu.portrait-composer.v1','composer-sentinel');localStorage.setItem('wanhu.portrait-anime.v1','anime-sentinel');});
 const audit=await page.evaluate(async()=>{
  const m=await import('/src/portrait-modern-anime-lab/model.ts'),r=await import('/src/portrait-modern-anime-lab/render.ts');
  const require=(test,text)=>{if(!test)throw new Error(text);};
  let count=0;const parser=new DOMParser(),faces=new Set(),wardrobe=new Map();
  for(const frame of m.options.frame)for(const face of m.options.face)for(const expression of m.options.expression){
   const start={...m.defaults,frame:frame.id,face:face.id,expression:expression.id};
   const reference=r.layers(start),identity=reference.filter(x=>['FaceBase','Expression'].includes(x.id));
   faces.add(reference.find(x=>x.id==='FaceBase').svg);
   for(const hair of m.options.hair)for(const hat of m.options.headwear)for(const outfit of m.options.outfit){
    const look=m.parseLook({...start,hair:hair.id,headwear:hat.id,outfit:outfit.id}),layers=r.layers(look),svg=r.portrait(look);
    require(JSON.stringify(layers.filter(x=>['FaceBase','Expression'].includes(x.id)))===JSON.stringify(identity),'Wardrobe changed identity or expression');
    const key=[frame.id,hair.id,hat.id,outfit.id].join(':'),parts=JSON.stringify(layers.filter(x=>!['FaceBase','Expression'].includes(x.id)));
    if(wardrobe.has(key))require(wardrobe.get(key)===parts,'Face/expression changed shared wardrobe');else wardrobe.set(key,parts);
    require(!/<image\b|<script\b|<foreignObject\b|<mask\b|<clipPath\b/.test(svg),'Unexpected raster, external content or auto-fitting mask');
    require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),'Invalid SVG');
    require(!m.capped(look)||layers.find(x=>x.id==='HairCrown').svg==='','Hair crown protrudes through cap');
    count++;
   }
  }
  require(count===1296&&faces.size===6,'Catalog size mismatch');
  const rows=Array.from({length:512},(_,seed)=>m.randomLook(m.defaults,seed,false));
  for(const key of m.keys.filter(k=>k!=='frame'))require(new Set(rows.map(x=>x[key])).size===m.options[key].length,`Random catalog omission: ${key}`);
  for(let seed=0;seed<100;seed++){const v=m.randomLook(m.defaults,seed,true);require(['frame','face','expression','skin'].every(k=>v[k]===m.defaults[k]),'Locked identity changed');}
  for(const v of [null,{},[],{...m.defaults,schema:'wanhu.anime-portrait'},{...m.defaults,face:'unknown'},{...m.defaults,extra:true}]){let rejected=false;try{m.parseLook(v);}catch{rejected=true;}require(rejected,'Invalid recipe accepted');}
  // 在实际 SVG 坐标中抽样虹膜/高光，检查它们没有落到眼白以外。
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px;top:0';document.body.append(host);
  let eyeChecks=0;
  for(const frame of m.options.frame)for(const face of m.options.face){host.innerHTML=r.portrait({...m.defaults,frame:frame.id,face:face.id});const white=host.querySelector('[data-part="eye-white"] path');
   for(const part of host.querySelector('[data-part="iris"]').children){if(part.tagName==='path'&&part.getAttribute('fill')==='none')continue;const b=part.getBBox();
    for(let x=b.x+.5;x<b.x+b.width;x+=.8)for(let y=b.y+.5;y<b.y+b.height;y+=.8){const pt=new DOMPoint(x,y);if(part.isPointInFill(pt))require(white.isPointInFill(pt),'Iris/highlight escaped the authored eye white');}
   }eyeChecks++;
  }
  let mouthChecks=0;for(const frame of m.options.frame)for(const face of m.options.face)for(const expression of m.options.expression){host.innerHTML=r.portrait({...m.defaults,frame:frame.id,face:face.id,expression:expression.id});const b=host.querySelector('[data-part="mouth"]').getBBox();require(Math.abs(b.x+b.width/2-256)<.01,'Mouth is off center');mouthChecks++;}host.remove();
  return {combinations:count,faceAssets:faces.size,eyeChecks,mouthChecks,frames:m.options.frame.map(x=>x.id),faces:m.options.face.map(x=>x.id),expressions:m.options.expression.map(x=>x.id)};
 });
 await pixels();await capture('01-design-showcase',page.locator('[data-showcase]'));await capture('02-studio-female',page.locator('[data-studio]'));
 for(const frame of audit.frames){
  await choose('frame',frame);await choose('headwear','none');await choose('outfit','everyday');await choose('expression','smile');
  await proof('face');assert.equal(await page.locator('[data-proof-item]').count(),3);await capture(`03-faces-${frame}`,page.locator('.pm-proof'));
  for(const face of audit.faces){
   await choose('face',face);await proof('expression');assert.equal(await page.locator('[data-proof-item]').count(),6);await pixels();
   await capture(`04-expressions-${frame}-${face}`,page.locator('.pm-proof'));
   const images=await page.locator('[data-proof-item] > img').evaluateAll(items=>items.map(x=>x.src));
   for(const [index,image] of images.entries()){const svg=decodeURIComponent(image.slice(image.indexOf(',')+1)),name=`${frame}-${face}-${audit.expressions[index]}`;await writeFile(join(out,'exports',name+'.svg'),svg);await sharp(Buffer.from(svg)).resize(512,512).png().toFile(join(out,'exports',name+'.png'));}
   await proof('pairs');assert.equal(await page.locator('[data-proof-item]').count(),12);await capture(`05-pairs-${frame}-${face}`,page.locator('.pm-proof'));
   await proof('outfit');await capture(`06-outfits-${frame}-${face}`,page.locator('.pm-proof'));
  }
 }
 // 真正戴帽再摘帽，验证恢复原发型与原图，而非更换整张角色稿。
 await choose('hair','tied');await choose('headwear','none');const bare=await source(),beforeHat=await state();
 for(let i=0;i<5;i++){await choose('headwear','cap');assert.equal((await state()).hair,beforeHat.hair);await choose('headwear','none');assert.equal(await source(),bare);}
 await page.locator('[data-preset="1"]').click();await ready();await capture('07-studio-male',page.locator('[data-studio]'));
 await page.locator('[data-background="night"]').click();await capture('08-night-studio',page.locator('[data-studio]'));
 await choose('skin','deep');await choose('hairColor','silver');await proof('expression');await pixels();await capture('09-deep-skin-silver',page.locator('.pm-proof'));
 await page.locator('[data-background="paper"]').click();await page.locator('[data-preset="2"]').click();await ready();
 await proof('expression');const before=await state();await page.locator('[data-use="happy"]').focus();await page.keyboard.press('Enter');await ready();const selected=await state();assert.equal(selected.expression,'happy');for(const key of Object.keys(before))if(key!=='expression')assert.equal(selected[key],before[key]);
 await page.locator('[data-random]').click();await ready();const saved=await state(),image=await source();assert.equal(saved.face,selected.face);assert.equal(saved.expression,selected.expression);
 await page.reload({waitUntil:'networkidle'});await ready();assert.deepEqual(await state(),saved);assert.equal(await source(),image);
 const json=await exported('json');assert.deepEqual(JSON.parse(json.toString()),saved);const svg=await exported('svg');assert(svg.toString().includes('data-layer="Expression"'));const png=await exported('png');const meta=await sharp(png).metadata();assert.equal(meta.width,1024);assert.equal(meta.height,1024);assert(meta.hasAlpha);const raw=await sharp(png).ensureAlpha().raw().toBuffer();assert.equal(raw[3],0);
 await page.locator('[data-reset]').click();await page.locator('[data-import]').setInputFiles({name:'saved.json',mimeType:'application/json',buffer:json});await page.waitForFunction(v=>document.querySelector('[data-modern]').dataset.look===v,JSON.stringify(saved));assert.equal(await source(),image);
 await page.locator('[data-import]').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"wanhu.anime-portrait","version":1}')});await page.waitForFunction(()=>document.querySelector('[data-feedback]').textContent.includes('这不是'));assert.deepEqual(await state(),saved);
 await page.locator('[data-share]').click();await page.waitForFunction(()=>document.querySelector('[data-feedback]').textContent.includes('链接已复制'));const url=await page.evaluate(()=>navigator.clipboard.readText());assert.deepEqual(JSON.parse(new URL(url).searchParams.get('look')),saved);
 await page.goto(url,{waitUntil:'networkidle'});await choose('expression','neutral');const edited=await state();await page.reload({waitUntil:'networkidle'});await ready();assert.deepEqual(await state(),edited);
 assert.deepEqual(await page.evaluate(()=>[localStorage.getItem('wanhu.portrait-composer.v1'),localStorage.getItem('wanhu.portrait-anime.v1')]),['composer-sentinel','anime-sentinel']);
 await page.setViewportSize({width:390,height:844});await proof('expression');await pixels();await capture('10-mobile-studio',page.locator('[data-studio]'));await capture('11-mobile-designs',page.locator('[data-showcase]'));
 await page.setViewportSize({width:320,height:800});await pixels();
 assert.deepEqual(errors,[],'Browser console/page/HTTP errors');
 await writeFile(join(out,'review.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',...audit,expressionRenders:36,hairHeadwearRenders:72,outfitRenders:18,randomSeeds:512,legacyStorage:'unchanged',exportSize:1024,viewportChecks:[1600,390,320],artisticApproval:'Requires actual screenshot inspection; this is not a game-quality certification',scope:'One new visual system with three curated outfits, not three separate styles. Adult proof, no production runtime changes.'},null,2));
 console.log('Modern anime: 1296 combinations, 36 expressions, 72 hair/hat pairs, real imports/exports, eye containment, mouth centering and mobile proof passed.');
}catch(error){await capture('failure').catch(()=>{});await writeFile(join(out,'failure.txt'),String(error)+'\n'+errors.join('\n'));throw error;}finally{await browser.close();}
