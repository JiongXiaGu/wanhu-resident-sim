import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import sharp from 'sharp';

const out='review-screenshots/avatar/chibi-cute';
await mkdir(join(out,'parts'),{recursive:true});
await mkdir(join(out,'samples'),{recursive:true});

export async function auditChibiCute(page){
 const data=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const require=(value,message)=>{if(!value)throw new Error(message);};
  const parser=new DOMParser(),host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px;top:0';document.body.append(host);
  const pack='chibi-cute-v1',parts=[],samples=[],boards=[],wardrobe=new Map();
  let combinations=0,mouthChecks=0,eyeChecks=0,styleChecks=0;
  for(const frame of m.frames){
   const base={...m.defaultRecipe,pack,hair:frame.startsWith('male')?'crop':'bob',outfit:'shirt',expression:'calm'};
   const faces=[],expressions=[],hairs=[],outfits=[];
   const addPart=(name,layer)=>parts.push({name:`${frame}/${name}.svg`,frame,layer:layer.id,svg:r.svgDocument(layer.svg,pack)});
   const initial=r.renderLayers(frame,base);addPart('neck',initial.find(x=>x.id==='Neck'));
   for(const hair of m.options.hair){const layers=r.renderLayers(frame,{...base,hair:hair.id});addPart(`hair-${hair.id}-back`,layers.find(x=>x.id==='BackHair'));addPart(`hair-${hair.id}-front`,layers.find(x=>x.id==='FrontHair'));}
   for(const outfit of m.options.outfit)addPart(`outfit-${outfit.id}`,r.renderLayers(frame,{...base,outfit:outfit.id}).find(x=>x.id==='Outfit'));
   const faceGeometry=new Set();
   for(const face of m.options.face){
    const reference={...base,face:face.id},baseline=r.renderLayers(frame,reference),faceSvg=baseline.find(x=>x.id==='FaceBase').svg;
    faceGeometry.add(faceSvg);addPart(`face-${face.id}`,baseline.find(x=>x.id==='FaceBase'));
    faces.push({label:face.label,svg:r.renderAvatar(frame,reference),sizes:true});
    samples.push({name:`${frame}-${face.id}`,frame,recipe:reference,svg:r.renderAvatar(frame,reference)});
    for(const expression of m.options.expression){
     const look={...reference,expression:expression.id},layers=r.renderLayers(frame,look),expressionSvg=layers.find(x=>x.id==='Expression').svg;
     addPart(`expression-${face.id}-${expression.id}`,{id:'Expression',svg:expressionSvg});
     expressions.push({label:`${face.label} / ${expression.label}`,svg:r.renderAvatar(frame,look)});
     host.innerHTML=r.renderAvatar(frame,look);
     require(host.querySelector('[data-expression-style="chibi"]'),'Chibi expression lost style marker');styleChecks++;
     const mouth=host.querySelector('[data-mouth]');require(mouth,'Chibi expression lost mouth metadata');
     const box=mouth.getBBox();require(Math.abs(box.x+box.width/2-160)<.03,'Chibi mouth shifted off center');mouthChecks++;
     const whites=[...host.querySelectorAll('[data-eye-white] path')],irises=[...host.querySelectorAll('[data-eye-iris]')];
     if(whites.length||irises.length){
      require(whites.length===2&&irises.length===2,'Surprise eye metadata must be bilateral');
      for(let index=0;index<2;index++){const white=whites[index],iris=irises[index];for(const item of iris.children){const b=item.getBBox();for(let x=b.x+.4;x<b.x+b.width;x+=.8)for(let y=b.y+.4;y<b.y+b.height;y+=.8){const pt=new DOMPoint(x,y);if(item.isPointInFill(pt))require(white.isPointInFill(pt),`Chibi iris escaped eye: ${frame}/${face.id}/${expression.id}`);}}eyeChecks++;}
     }
     for(const hair of m.options.hair)for(const outfit of m.options.outfit){
      const recipe=m.parseRecipe({...look,hair:hair.id,outfit:outfit.id}),ls=r.renderLayers(frame,recipe),svg=r.renderAvatar(frame,recipe);
      require(ls.find(x=>x.id==='FaceBase').svg===faceSvg,'Chibi wardrobe changed face');
      require(ls.find(x=>x.id==='Expression').svg===expressionSvg,'Chibi wardrobe changed expression');
      const key=`${frame}/${hair.id}/${outfit.id}`,shared=JSON.stringify(ls.filter(x=>!['FaceBase','Expression'].includes(x.id)));
      if(wardrobe.has(key))require(wardrobe.get(key)===shared,'Chibi face changed shared wardrobe');else wardrobe.set(key,shared);
      require(ls.map(x=>x.id).join(',')==='BackHair,Neck,Outfit,FaceBase,Expression,FrontHair','Chibi layer order changed');
      require(!/<image\b|<script\b|<foreignObject\b|<mask\b|<clipPath\b/.test(svg),'Chibi pack used forbidden complete-image or auto-fit constructs');
      require(!/soft-paint|sp-hair|sp-skin/.test(svg),'Rejected soft-paint artwork leaked into chibi pack');
      require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),'Chibi pack emitted invalid SVG');
      combinations++;
     }
    }
    for(const hair of m.options.hair)hairs.push({label:`${face.label} / ${hair.label}`,svg:r.renderAvatar(frame,{...reference,hair:hair.id})});
    for(const outfit of m.options.outfit)outfits.push({label:`${face.label} / ${outfit.label}`,svg:r.renderAvatar(frame,{...reference,outfit:outfit.id})});
   }
   require(faceGeometry.size===4,'Chibi faces are not four independent outlines');
   if(frame.endsWith('adult')){
    boards.push({name:`faces-${frame}`,title:`Q版可爱 · ${frame} · 四张脸`,columns:4,cells:faces});
    boards.push({name:`expressions-${frame}`,title:`Q版可爱 · ${frame} · 六套表情`,columns:6,cells:expressions});
    boards.push({name:`hair-${frame}`,title:`Q版可爱 · ${frame} · 共享六种头发`,columns:6,cells:hairs});
    boards.push({name:`outfits-${frame}`,title:`Q版可爱 · ${frame} · 共享四套衣服`,columns:4,cells:outfits});
   }else boards.push({name:`age-${frame}`,title:`Q版可爱 · ${frame} · 年龄上下文`,columns:4,cells:faces});
  }
  require(combinations===3456,'Chibi pack must cover 3456 combinations');
  for(const frame of ['female.adult','male.adult']){
   const semantic={...m.defaultRecipe,face:'round',hair:frame.startsWith('male')?'crop':'long',outfit:frame.startsWith('male')?'shirt':'knit',expression:'smile'};
   const line=r.renderAvatar(frame,{...semantic,pack:'linework-v1'}),chibi=r.renderAvatar(frame,{...semantic,pack:'chibi-cute-v1'});
   require(line!==chibi,'Style packs rendered identical SVG');
   host.innerHTML=chibi;const faceBox=host.querySelector('[data-layer="FaceBase"]').getBBox(),outfitBox=host.querySelector('[data-layer="Outfit"]').getBBox();
   require(faceBox.height>outfitBox.height*1.45,'Chibi head/body proportion is not meaningfully different');styleChecks++;
   boards.unshift({name:`style-compare-${frame}`,title:`${frame} · 同一四项配置：线绘 vs Q版`,columns:2,cells:[{label:'日常线绘',svg:line,sizes:true},{label:'Q版可爱',svg:chibi,sizes:true}]});
  }
  host.remove();
  return {combinations,mouthChecks,eyeChecks,styleChecks,parts,samples,boards};
 });
 for(const part of data.parts){await mkdir(join(out,'parts',part.frame),{recursive:true});await writeFile(join(out,'parts',part.name),part.svg);}
 await writeFile(join(out,'parts','manifest.json'),JSON.stringify({pack:'chibi-cute-v1',order:['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'],count:data.parts.length,parts:data.parts.map(({svg,...rest})=>rest)},null,2));
 for(const sample of data.samples){await writeFile(join(out,'samples',sample.name+'.svg'),sample.svg);await writeFile(join(out,'samples',sample.name+'.json'),JSON.stringify({frame:sample.frame,recipe:sample.recipe},null,2));await sharp(Buffer.from(sample.svg)).resize(320,320).png().toFile(join(out,'samples',sample.name+'.png'));}
 const board=await page.context().newPage();await board.setViewportSize({width:1440,height:1000});
 for(const item of data.boards){
  const cards=item.cells.map(cell=>`<article><div class="art">${cell.svg}</div><h2>${cell.label}</h2>${cell.sizes?'<div class="sizes">'+[96,64,48].map(size=>`<figure><div style="width:${size}px;height:${size}px">${cell.svg}</div><figcaption>${size}px</figcaption></figure>`).join('')+'</div>':''}</article>`).join('');
  await board.setContent(`<html lang="zh"><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#25282e;color:#eee5da;font-family:'Noto Sans CJK SC',sans-serif}h1{font-size:23px;font-weight:500;margin:0 0 8px}p{font-size:12px;color:#bab1a8;margin:0 0 25px}.grid{display:grid;grid-template-columns:repeat(${item.columns},1fr);gap:15px}article{padding:12px;background:#32343c;border:1px solid #49464a;border-radius:9px;text-align:center}.art{width:100%;max-width:${item.columns===4?240:190}px;aspect-ratio:1;margin:auto;background:#fffaf6;border-radius:8px}.art svg,.sizes svg{display:block;width:100%;height:100%}h2{font-size:12px;font-weight:400;margin:10px 0 0}.sizes{display:flex;justify-content:center;align-items:flex-end;gap:9px;margin:15px 0 0}.sizes figure{margin:0}.sizes figure>div{background:#fffaf6;border-radius:5px}.sizes figcaption{font-size:10px;margin-top:4px}</style><h1>${item.title}</h1><p>实际可编辑 SVG 组合诊断 · 大头比例 / 极简五官 / 粗轮廓 · 不是固定整图</p><div class="grid">${cards}</div></html>`);
  await board.evaluate(()=>document.fonts.ready);await board.screenshot({path:join(out,item.name+'.png'),fullPage:true});
 }
 await board.close();
 const report={commit:process.env.GITHUB_SHA??'local',status:'automated-pass',pack:'chibi-cute-v1',...Object.fromEntries(Object.entries(data).filter(([key])=>!['parts','samples','boards'].includes(key))),exportedParts:data.parts.length,samples:data.samples.length,boards:data.boards.length,artisticApproval:'Requires screenshot inspection; geometry pass is not art approval'};
 await writeFile(join(out,'review.json'),JSON.stringify(report,null,2));
 return report;
}
