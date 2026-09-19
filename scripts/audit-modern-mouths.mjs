import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

// 这是防回退的配色/几何检查，不是小头像可读性或可访问性认证。
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 await page.goto((process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173')+'/?view=portrait-modern-anime-lab');
 const report=await page.evaluate(async()=>{
  const {options,defaults}=await import('/src/portrait-modern-anime-lab/model.ts');
  const {portrait}=await import('/src/portrait-modern-anime-lab/render.ts');
  const {skinColors}=await import('/src/portrait-modern-anime-lab/art/drawing.ts');
  const luminance=hex=>{
   const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
   return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  };
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px';document.body.append(host);
  const rows=[];
  for(const frame of options.frame)for(const face of options.face)for(const expression of options.expression)for(const skin of options.skin){
   host.innerHTML=portrait({...defaults,frame:frame.id,face:face.id,expression:expression.id,skin:skin.id});
   const mouth=host.querySelector('[data-part="mouth"]'),first=mouth.querySelector('path'),box=mouth.getBBox();
   const stroke=first.getAttribute('stroke');
   const a=luminance(skinColors[skin.id].base),b=luminance(stroke),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   rows.push({frame:frame.id,face:face.id,expression:expression.id,skin:skin.id,stroke,center:box.x+box.width/2,ratio});
   if(skin.id==='deep'&&['neutral','smile'].includes(expression.id)){
    const highlight=mouth.querySelectorAll('path')[1];
    if(highlight.getAttribute('stroke')!==skinColors.deep.light)throw new Error('Deep skin lost its warm lower-lip highlight');
   }
  }
  host.remove();return rows;
 });
 assert.equal(report.length,108);
 for(const row of report){assert(Math.abs(row.center-256)<.01,'Skin selection moved mouth');assert(row.ratio>=2.4,`Lip/base palette contrast regressed: ${JSON.stringify(row)}`);}
 await mkdir('review-screenshots/modern-anime',{recursive:true});
 await writeFile('review-screenshots/modern-anime/mouth-palettes.json',JSON.stringify({commit:process.env.GITHUB_SHA??'local',status:'automated-pass',samples:report.length,minimumPaletteRatio:Math.min(...report.map(x=>x.ratio)),note:'A palette regression guard only; inspect actual-size screenshots separately.',rows:report},null,2));
 console.log('108 face/expression/skin mouth samples remain centered and preserve authored palette contrast.');
}finally{await browser.close();}
