import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const out = 'review-screenshots/anime';
await mkdir(join(out, 'exports'), { recursive: true });
async function isolate(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir,item.name);
    if (item.isDirectory()) await isolate(path);
    else if (/\.tsx?$/.test(path)) assert(!/from\s+['"][^'"]*(?:resident\/portrait|portrait-composer|portrait-art-directions|portrait-style)/.test(await readFile(path,'utf8')), `Legacy art/runtime import: ${path}`);
  }
}
await isolate('Web/src/portrait-anime-lab');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1, reducedMotion: 'reduce', permissions: ['clipboard-read','clipboard-write'] });
const page = await context.newPage();
const errors = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const base = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const root = page.locator('[data-anime-lab]');
const state = async () => JSON.parse(await root.getAttribute('data-look'));
const source = async () => page.locator('[data-anime-main]').getAttribute('src');
async function ready() {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
}
async function choose(key,value) {
  if (['face','hair','hat','outfit'].includes(key)) await page.locator(`[data-anime-category="${key}"]`).click();
  await page.locator(`[data-anime-key="${key}"][data-value="${value}"]`).click();
  await page.waitForFunction(({key,value}) => JSON.parse(document.querySelector('[data-anime-lab]').dataset.look)[key] === value,{key,value});
  await ready();
}
async function proof(mode) { await page.locator(`[data-anime-proof="${mode}"]`).click(); await page.locator(`[data-anime-proof-mode="${mode}"]`).waitFor(); await ready(); }
async function screenshot(name,locator=page) {
  await ready();
  const settings = { path: join(out, name+'.png'), animations: 'disabled', caret: 'hide' };
  if (locator === page) await page.screenshot({...settings,fullPage:true}); else await locator.screenshot(settings);
}
async function pixels() {
  const rows=await page.locator('[data-anime-pixel]').evaluateAll(images => images.map(img => ({expected:+img.dataset.animePixel,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height})));
  assert(rows.length>=3); for (const row of rows) { assert.equal(row.width,row.expected); assert.equal(row.height,row.expected); }
}
async function noOverflow(){assert(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');}
async function exported(kind){
  const wait=page.waitForEvent('download'); await page.locator(`[data-anime-export="${kind}"]`).click();
  const download=await wait, stream=await download.createReadStream(), chunks=[];
  for await(const chunk of stream) chunks.push(chunk);
  const data=Buffer.concat(chunks); await writeFile(join(out,download.suggestedFilename()),data); return data;
}
try {
  // 旧 DIY 保存键设置哨兵，确保新实验从未读写旧配方。
  await page.goto(base+'/?view=portrait-anime-lab',{waitUntil:'networkidle'}); await root.waitFor(); await ready();
  await page.evaluate(()=>localStorage.setItem('wanhu.portrait-composer.v1','old-composer-storage-sentinel'));
  const audit=await page.evaluate(async()=>{
    const m=await import('/src/portrait-anime-lab/model.ts');
    const r=await import('/src/portrait-anime-lab/render.ts');
    const expressions=await import('/src/portrait-anime-lab/art/expressions.ts');
    const ensure=(ok,message)=>{if(!ok)throw new Error(message);};
    const parser=new DOMParser(), faces=new Set(), shapes=new Set(), mouths=[];
    let count=0;
    const stableWardrobe=new Map();
    for(const frame of m.options.frame)for(const face of m.options.face){
      const original={...m.initialLook,frame:frame.id,face:face.id};
      const baseFace=r.renderPlan(original).find(item=>item.name==='FaceBase').svg; faces.add(baseFace);
      const emotions=new Set();
      for(const expression of m.options.expression){
        const look={...original,expression:expression.id};
        const emotional=r.renderPlan(look).find(item=>item.name==='Expression').svg; emotions.add(emotional);
        const reference=r.renderPlan(look).filter(item=>item.name!=='Expression').map(item=>item.svg).join('|');
        ensure(reference===r.renderPlan(original).filter(item=>item.name!=='Expression').map(item=>item.svg).join('|'),'Expression moved face/body/wardrobe');
        mouths.push({frame:frame.id,face:face.id,expression:expression.id,svg:expressions.mouthArt(look)});
        for(const hair of m.options.hair)for(const hat of m.options.hat)for(const outfit of m.options.outfit){
          const candidate=m.parseLook({...look,hair:hair.id,hat:hat.id,outfit:outfit.id});
          const layers=r.renderPlan(candidate),svg=r.renderPortrait(candidate);
          ensure(layers.find(item=>item.name==='FaceBase').svg===baseFace,'Wardrobe changed identity');
          ensure(layers.find(item=>item.name==='Expression').svg===emotional,'Wardrobe changed expression');
          const wardrobeKey=[frame.id,hair.id,hat.id,outfit.id].join(':');
          const wardrobe=layers.filter(item=>!['FaceBase','Expression'].includes(item.name)).map(item=>item.svg).join('|');
          if(stableWardrobe.has(wardrobeKey))ensure(stableWardrobe.get(wardrobeKey)===wardrobe,'Face changed shared wardrobe');
          else stableWardrobe.set(wardrobeKey,wardrobe);
          ensure(!m.isTucked(candidate)||layers.find(item=>item.name==='HairCrown').svg==='','Topknot protrudes through covered headwear');
          ensure(!/<image|<script|<foreignObject|<mask|<clipPath|NaN|undefined|Infinity/.test(svg),'Unsafe/invalid vector content');
          const doc=parser.parseFromString(svg,'image/svg+xml');
          ensure(!doc.querySelector('parsererror'),'Invalid SVG XML');
          ensure(doc.documentElement.getAttribute('viewBox')==='0 0 256 256','Changed crop');
          for(const element of doc.querySelectorAll('[transform]'))ensure(element.getAttribute('transform')==='translate(256 0) scale(-1 1)','Only fixed bilateral authoring reflection is allowed');
          count++;
        }
      }
      ensure(emotions.size===8,'Duplicate expression templates for a face');
      for(let seed=0;seed<100;seed++){
        const result=m.randomLook(original,true,seed);
        ensure(['frame','face','skin','expression'].every(key=>result[key]===original[key]),'Locked random changed identity/mood');
        ensure(JSON.stringify(result)===JSON.stringify(m.randomLook(original,true,seed)),'Nondeterministic seed'); m.parseLook(result);
      }
    }
    ensure(faces.size===8&&count===4096&&count===m.combinationCount,'Missing faces/combinations');
    for(const bad of [null,[],{}, {...m.initialLook,schema:'old'}, {...m.initialLook,version:2}, {...m.initialLook,expression:'<script>'}, {...m.initialLook,face:'bad'}, {...m.initialLook,extra:1}]){
      let rejected=false;try{m.parseLook(bad);}catch{rejected=true;}ensure(rejected,'Invalid import allowed');
    }
    const random=Array.from({length:512},(_,seed)=>m.randomLook(m.initialLook,false,seed));
    for(const key of m.keys.filter(key=>key!=='frame'))ensure(new Set(random.map(row=>row[key])).size===m.options[key].length,`Random omitted ${key}`);
    // 使用真实 SVG bbox 检查嘴型居中，避免只检查路径字符串。
    const host=document.createElement('div'); host.style.cssText='position:absolute;left:-9999px;top:0;visibility:hidden'; document.body.append(host);
    for(const mouth of mouths){host.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">${mouth.svg}</svg>`;const box=host.querySelector('[data-mouth]').getBBox();ensure(Math.abs(box.x+box.width/2-128)<.01,'Mouth is off center');shapes.add(mouth.expression);}
    host.remove();
    return {combinations:count,faceCount:faces.size,expressions:shapes.size,mouths,frames:m.options.frame.map(i=>i.id),faceIds:m.options.face.map(i=>i.id),expressionIds:m.options.expression.map(i=>i.id)};
  });
  checks.push('4096 combinations preserve FaceBase and Expression across wardrobe changes; expression does not change identity or wardrobe; 8 distinct faces × 8 expressions');
  const mouthRows=[];
  for(const mouth of audit.mouths){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${mouth.svg}</svg>`;
    const raster=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();
    let difference=0;for(let y=0;y<256;y++)for(let x=0;x<128;x++)for(let channel=0;channel<4;channel++)difference+=Math.abs(raster[(y*256+x)*4+channel]-raster[(y*256+255-x)*4+channel]);
    const meanDifference=difference/(256*128*4);assert(meanDifference<.3,`Asymmetric mouth raster: ${mouth.frame}/${mouth.face}/${mouth.expression}`);
    mouthRows.push({...mouth,svg:undefined,meanDifference});
  }
  await writeFile(join(out,'mouth-audit.json'),JSON.stringify({status:'automated-pass',centerX:128,samples:mouthRows,note:'Symmetry is a geometric guardrail, not an artistic-quality score.'},null,2));
  checks.push('64 mouth templates: real bbox center x=128 and bilateral raster check');
  await pixels(); await noOverflow(); await screenshot('01-anime-workspace',page.locator('.pa-workspace'));
  await screenshot('00-anime-page');
  let rendered=0;
  for(const frame of audit.frames){
    await choose('frame',frame); await choose('hat','none'); await choose('outfit','linen'); await choose('hair','bun'); await choose('expression','neutral');
    await proof('face'); await screenshot(`02-faces-${frame}`,page.locator('.pa-proof'));
    for(const face of audit.faceIds){
      await choose('face',face);await choose('expression','smile');await choose('hat','none');await choose('outfit','linen');await choose('hair','bun');
      await proof('expression');
      const current=await state();
      const items=await page.locator('[data-anime-proof-item]').evaluateAll(items=>items.map(item=>JSON.parse(item.dataset.proofLook)));
      assert.equal(items.length,8); assert.deepEqual(items.map(item=>item.expression),audit.expressionIds);
      for(const item of items)for(const key of Object.keys(current))if(key!=='expression')assert.equal(item[key],current[key]);
      await pixels(); await screenshot(`03-expressions-${frame}-${face}`,page.locator('.pa-proof'));
      // 导出的是当前分层渲染器的真实产物，不是另一套测试插画。
      const images=await page.locator('[data-anime-proof-item] .pa-proof-art img').evaluateAll(images=>images.map(image=>image.src));
      for(let i=0;i<images.length;i++){
        const name=`${frame}-${face}-${audit.expressionIds[i]}`,svg=decodeURIComponent(images[i].slice(images[i].indexOf(',')+1));
        await writeFile(join(out,'exports',name+'.svg'),svg);
        await sharp(Buffer.from(svg)).png().toFile(join(out,'exports',name+'.png'));
        rendered++;
      }
      await proof('pairs');assert.equal(await page.locator('[data-anime-proof-item]').count(),16);await screenshot(`04-pairs-${frame}-${face}`,page.locator('.pa-proof'));
      await proof('outfit');assert.equal(await page.locator('[data-anime-proof-item]').count(),4);await screenshot(`05-outfits-${frame}-${face}`,page.locator('.pa-proof'));
    }
  }
  assert.equal(rendered,64);
  checks.push('64 expression proofs and exports, 128 hair/headwear proofs, 32 outfit proofs, same-wardrobe face overviews, all at DPR 1');
  await choose('frame','female.adult');await choose('face','soft');await choose('hair','half');await choose('hat','guan');await choose('outfit','ceremony');await choose('cloth','rose');await choose('expression','shy');
  await proof('expression');await page.locator('[data-anime-theme="night"]').click();await screenshot('06-night-workspace',page.locator('.pa-workspace'));await screenshot('07-night-expressions',page.locator('.pa-proof'));
  await page.locator('[data-anime-theme="paper"]').click();await screenshot('08-noble-workspace',page.locator('.pa-workspace'));
  // 真实表情点击/键盘切换保持其他所有 ID；摘帽回到相同 SVG。
  const before=await state();
  for(const expression of audit.expressionIds){await choose('expression',expression);const next=await state();for(const key of Object.keys(before))if(key!=='expression')assert.equal(next[key],before[key]);}
  await proof('expression');await page.locator('[data-anime-use="laugh"]').focus();await page.keyboard.press('Enter');await ready();assert.equal((await state()).expression,'laugh');
  await choose('hat','none');const unhat=await source();for(const hat of ['wrap','straw','guan']){await choose('hat',hat);await choose('hat','none');assert.equal(await source(),unhat);}
  const identity=await state();await page.locator('[data-anime-random]').click();await ready();const randomized=await state();for(const key of ['frame','face','expression','skin'])assert.equal(randomized[key],identity[key]);
  const saved=await state(),image=await source();await page.reload({waitUntil:'networkidle'});await ready();assert.deepEqual(await state(),saved);assert.equal(await source(),image);
  const json=await exported('json'),svg=await exported('svg'),png=await exported('png');
  assert.deepEqual(JSON.parse(json.toString()),saved);assert(svg.toString().includes('data-layer="Expression"'));
  const meta=await sharp(png).metadata();assert.equal(meta.width,512);assert.equal(meta.height,512);assert(meta.hasAlpha);assert.equal((await sharp(png).ensureAlpha().raw().toBuffer())[3],0);
  await page.locator('[data-anime-reset]').click();await ready();await page.locator('[data-anime-import]').setInputFiles({name:'anime.json',mimeType:'application/json',buffer:json});
  await page.waitForFunction(wanted=>document.querySelector('[data-anime-lab]').dataset.look===wanted,JSON.stringify(saved));assert.equal(await source(),image);
  await page.locator('[data-anime-import]').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"faceFamilyId":"gentle"}')});
  await page.waitForFunction(()=>document.querySelector('[data-anime-feedback]').textContent.includes('不是二次元实验'));assert.deepEqual(await state(),saved);
  await page.locator('[data-anime-share]').click();await page.waitForFunction(()=>document.querySelector('[data-anime-feedback]').textContent.includes('已复制组合链接'));
  const link=await page.evaluate(()=>navigator.clipboard.readText());assert.deepEqual(JSON.parse(new URL(link).searchParams.get('anime')),saved);
  await page.goto(link,{waitUntil:'networkidle'});await ready();assert.deepEqual(await state(),saved);await choose('expression','happy');const changed=await state();await page.reload({waitUntil:'networkidle'});await ready();assert.deepEqual(await state(),changed);
  assert.equal(await page.evaluate(()=>localStorage.getItem('wanhu.portrait-composer.v1')),'old-composer-storage-sentinel');
  checks.push('Real expression and hat controls, locked random, keyboard proof selection, local save, SVG/PNG/JSON downloads, validated import, shared-link editing; old composer storage untouched');
  await choose('skin','deep');await choose('hairColor','silver');await screenshot('09-deep-skin-silver-hair',page.locator('.pa-workspace'));
  await choose('skin','porcelain');await choose('hairColor','ink');await choose('expression','smile');
  await page.setViewportSize({width:390,height:844});await pixels();await noOverflow();await screenshot('10-mobile');
  await page.setViewportSize({width:320,height:800});await pixels();await noOverflow();
  checks.push('Desktop/390px/320px no overflow; all 96/64/48 CSS pixel samples remain exact');
  assert.deepEqual(errors,[],'Browser errors');
  await writeFile(join(out,'review.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',combinations:audit.combinations,faces:audit.faceCount,expressions:audit.expressions,expressionSamples:64,hairHatSamples:128,outfitSamples:32,checks,artisticApproval:'Requires actual inspection of these screenshots. CI and symmetric mouths do not certify aesthetic quality.',boundary:'Independent adult anime lab; no production DNA, old composer assets, Unity runtime or game mood changes.'},null,2));
  console.log(checks.join('\n'));
}catch(error){await screenshot('failure').catch(()=>{});await writeFile(join(out,'failure.txt'),String(error)+'\n'+errors.join('\n'));throw error;}
finally{await browser.close();}
