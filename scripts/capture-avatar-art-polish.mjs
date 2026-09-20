import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import {auditChibiArtPolish} from './avatar-review/art-polish.mjs';

const out='review-screenshots/avatar/packs/chibi-cute-v1';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${process.env.REVIEW_BASE_URL??'http://127.0.0.1:4173'}/?view=avatar-editor`,{waitUntil:'networkidle'});
 await page.locator('[data-avatar-editor]').waitFor();
 const {report,boards}=await auditChibiArtPolish(page);
 assert.equal(report.cases,192,'Must audit six frames × four faces × eight expressions');
 assert.equal(report.negativeControls,3,'Oversize, outside-face and actual-contour negative controls must fail');
 assert.deepEqual(errors,[],'Avatar review page emitted errors');
 for(const board of boards){
  const cards=board.cells.map(cell=>`<article><div class="hero">${cell.svg}</div><h2>${cell.label}</h2>${cell.sizes?'<div class="sizes">'+[96,64,48].map(size=>`<figure><div style="width:${size}px;height:${size}px">${cell.svg}</div><figcaption>${size}px</figcaption></figure>`).join('')+'</div>':''}</article>`).join('');
  await page.setContent(`<html lang="zh"><meta charset="UTF-8"><style>
   *{box-sizing:border-box}body{margin:0;padding:28px;background:#25282e;color:#eee5da;font-family:'Noto Sans CJK SC',sans-serif}
   h1{font-size:23px;font-weight:500;margin:0 0 9px}p{font-size:12px;color:#c5b9aa;margin:0 0 22px}
   main{display:grid;grid-template-columns:repeat(${board.columns},1fr);gap:16px}article{padding:16px;background:#32343c;border:1px solid #49464a;border-radius:9px;text-align:center}
   .hero{width:100%;max-width:${board.columns===2?320:224}px;aspect-ratio:1;margin:auto;background:#fffaf6;border-radius:7px}svg{display:block;width:100%;height:100%}
   h2{font-size:12px;font-weight:400;margin:12px 0 0}.sizes{display:flex;justify-content:center;align-items:flex-end;gap:15px;margin-top:14px}figure{margin:0}figure div{background:#fffaf6;border-radius:4px}figcaption{font-size:10px;margin-top:4px}
  </style><h1>${board.title}</h1><p>诊断图，不是玩家 UI。共同安全区只用于检查，不是裁切框。技术检查通过不代表最终美术通过。</p><main>${cards}</main></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:join(out,board.name+'.png'),fullPage:true});
 }
 const result={commit:process.env.GITHUB_SHA??'local',status:'automated-pass',...report,boards:boards.map(board=>board.name+'.png')};
 await writeFile(join(out,'phase7-art-polish-review.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
