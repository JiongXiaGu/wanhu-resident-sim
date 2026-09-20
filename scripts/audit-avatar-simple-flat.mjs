import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import sharp from 'sharp';

const out='review-screenshots/avatar/simple-flat';
await mkdir(join(out,'parts'),{recursive:true});
await mkdir(join(out,'samples'),{recursive:true});

const sourcePaths=[
 'Web/src/avatar/packs/simple-flat/drawing.ts',
 'Web/src/avatar/packs/simple-flat/faces.ts',
 'Web/src/avatar/packs/simple-flat/hair.ts',
 'Web/src/avatar/packs/simple-flat/outfits.ts',
];
for(const path of sourcePaths){
 const source=await readFile(path,'utf8');
 assert(!/packs\/(?:chibi|linework)|\.\.\/(?:chibi|linework)|\.\/(?:chibi|linework)/.test(source),`simple-flat-v1 imported another pack geometry: ${path}`);
}

export async function auditSimpleFlat(page){
 const data=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const require=(value,message)=>{if(!value)throw new Error(message);};
  const parser=new DOMParser(),host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px;top:0;width:320px;height:320px';document.body.append(host);
  const pack='simple-flat-v1',parts=[],samples=[],boards=[],wardrobe=new Map();
  let combinations=0,mouthChecks=0,eyeChecks=0,styleChecks=0;
  for(const frame of m.frames){
   const base={...m.defaultRecipe,pack,hair:frame.startsWith('male')?'crop':'bob',outfit:'shirt',expression:'calm'};
   const faces=[],expressions=[],hairs=[],outfits=[];
   const addPart=(name,layer)=>parts.push({name:`${frame}/${name}.svg`,frame,layer:layer.id,svg:r.svgDocument(layer.svg,pack)});
   const initial=r.renderLayers(frame,base);addPart('neck',initial.find(x=>x.id==='Neck'));
   for(const hair of m.options.hair){
    const layers=r.renderLayers(frame,{...base,hair:hair.id});
    addPart(`hair-${hair.id}-back`,layers.find(x=>x.id==='BackHair'));
    addPart(`hair-${hair.id}-front`,layers.find(x=>x.id==='FrontHair'));
   }
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
     require(host.querySelector('[data-expression-style="simple-flat"]'),'Simple-flat expression lost style marker');styleChecks++;
     require(host.querySelector('[data-simple-flat-face]'),'Simple-flat face lost pack marker');
     const mouth=host.querySelector('[data-mouth]');require(mouth,'Simple-flat expression lost mouth metadata');
     const mouthBox=mouth.getBBox();require(Math.abs(mouthBox.x+mouthBox.width/2-160)<.6,'Simple-flat mouth shifted off center');mouthChecks++;
     const eyes=host.querySelector('[data-eye-pair]'),faceLayer=host.querySelector('[data-layer="FaceBase"]');
     require(eyes&&faceLayer,'Simple-flat eye or face metadata missing');
     const eyeBox=eyes.getBBox(),faceBox=faceLayer.getBBox();
     require(eyeBox.x>=faceBox.x+2&&eyeBox.x+eyeBox.width<=faceBox.x+faceBox.width-2,'Simple-flat eyes escaped face width');
     require(eyeBox.y>=faceBox.y+10&&eyeBox.y+eyeBox.height<=faceBox.y+faceBox.height-18,'Simple-flat eyes escaped face height');eyeChecks++;
     for(const hair of m.options.hair)for(const outfit of m.options.outfit){
      const recipe=m.parseRecipe({...look,hair:hair.id,outfit:outfit.id}),ls=r.renderLayers(frame,recipe),svg=r.renderAvatar(frame,recipe);
      require(ls.find(x=>x.id==='FaceBase').svg===faceSvg,'Simple-flat wardrobe changed face');
      require(ls.find(x=>x.id==='Expression').svg===expressionSvg,'Simple-flat wardrobe changed expression');
      const key=`${frame}/${hair.id}/${outfit.id}`,shared=JSON.stringify(ls.filter(x=>!['FaceBase','Expression'].includes(x.id)));
      if(wardrobe.has(key))require(wardrobe.get(key)===shared,'Simple-flat face changed shared wardrobe');else wardrobe.set(key,shared);
      require(ls.map(x=>x.id).join(',')==='BackHair,Neck,Outfit,FaceBase,Expression,FrontHair','Simple-flat layer order changed');
      require(!/<image\b|<script\b|<foreignObject\b|<mask\b|<clipPath\b/.test(svg),'Simple-flat pack used forbidden complete-image or auto-fit constructs');
      require(!/data-expression-style="chibi"|cb-|sp-hair|sp-skin/.test(svg),'Another pack artwork leaked into simple-flat');
      require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),'Simple-flat emitted invalid SVG');
      combinations++;
     }
    }
    for(const hair of m.options.hair)hairs.push({label:`${face.label} / ${hair.label}`,svg:r.renderAvatar(frame,{...reference,hair:hair.id})});
    for(const outfit of m.options.outfit)outfits.push({label:`${face.label} / ${outfit.label}`,svg:r.renderAvatar(frame,{...reference,outfit:outfit.id})});
   }
   require(faceGeometry.size===4,'Simple-flat faces are not four independent outlines');
   if(frame.endsWith('adult')){
    boards.push({name:`faces-${frame}`,title:`极简简笔 · ${frame} · 四张脸`,columns:4,cells:faces});
    boards.push({name:`expressions-${frame}`,title:`极简简笔 · ${frame} · 4脸 × 6表情`,columns:6,cells:expressions});
    boards.push({name:`hair-${frame}`,title:`极简简笔 · ${frame} · 4脸 × 6头发`,columns:6,cells:hairs});
    boards.push({name:`outfits-${frame}`,title:`极简简笔 · ${frame} · 4脸 × 4衣服`,columns:4,cells:outfits});
   }
  }
  require(combinations===3456,'Simple-flat pack must cover 3456 combinations');

  for(const gender of ['female','male']){
   const frame=`${gender}.adult`,semantic={...m.defaultRecipe,pack:'simple-flat-v1',face:'round',hair:'long',outfit:'knit',expression:'smile'};
   const line=r.renderAvatar(frame,{...semantic,pack:'linework-v1'});
   const chibi=r.renderAvatar(frame,{...semantic,pack:'chibi-cute-v1'});
   const simple=r.renderAvatar(frame,semantic);
   require(simple!==line&&simple!==chibi&&line!==chibi,'Three style packs rendered identical SVG');
   host.innerHTML=chibi;const chibiFace=host.querySelector('[data-layer="FaceBase"]').getBBox(),chibiOutfit=host.querySelector('[data-layer="Outfit"]').getBBox();
   host.innerHTML=simple;const simpleFace=host.querySelector('[data-layer="FaceBase"]').getBBox(),simpleOutfit=host.querySelector('[data-layer="Outfit"]').getBBox();
   const chibiRatio=chibiFace.height/chibiOutfit.height,simpleRatio=simpleFace.height/simpleOutfit.height;
   require(simpleRatio<chibiRatio*.9,'Simple-flat still reads as chibi head/body proportion');
   require(simpleFace.width<chibiFace.width*.94,'Simple-flat head silhouette is too close to chibi width');
   styleChecks+=2;
   boards.unshift({name:`style-compare-${frame}`,title:`${frame} · 同一配置：日常线绘 / Q版可爱 / 极简简笔`,columns:3,cells:[
    {label:'日常线绘',svg:line,sizes:true},{label:'Q版可爱',svg:chibi,sizes:true},{label:'极简简笔',svg:simple,sizes:true},
   ]});
   boards.push({name:`native-size-${frame}`,title:`极简简笔 · ${frame} · 96 / 64 / 48px`,columns:1,cells:[{label:'round / long / knit / smile',svg:simple,sizes:true}]});
  }

  for(const gender of ['female','male']){
   const cells=['child','adult','elder'].map(stage=>{
    const frame=`${gender}.${stage}`,recipe={...m.defaultRecipe,pack:'simple-flat-v1',face:'oval',hair:gender==='male'?'crop':'bob',outfit:'shirt',expression:'calm'};
    return {label:stage,svg:r.renderAvatar(frame,recipe),sizes:true};
   });
   boards.push({name:`age-proof-${gender}`,title:`极简简笔 · ${gender} · child / adult / elder`,columns:3,cells});
  }

  host.remove();
  return {combinations,mouthChecks,eyeChecks,styleChecks,parts,samples,boards};
 });
 for(const part of data.parts){await mkdir(join(out,'parts',part.frame),{recursive:true});await writeFile(join(out,'parts',part.name),part.svg);}
 await writeFile(join(out,'parts','manifest.json'),JSON.stringify({pack:'simple-flat-v1',order:['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'],count:data.parts.length,parts:data.parts.map(({svg,...rest})=>rest)},null,2));
 for(const sample of data.samples){
  await writeFile(join(out,'samples',sample.name+'.svg'),sample.svg);
  await writeFile(join(out,'samples',sample.name+'.json'),JSON.stringify({frame:sample.frame,recipe:sample.recipe},null,2));
  await sharp(Buffer.from(sample.svg)).resize(320,320).png().toFile(join(out,'samples',sample.name+'.png'));
 }
 const board=await page.context().newPage();await board.setViewportSize({width:1440,height:1000});
 for(const item of data.boards){
  const cards=item.cells.map(cell=>`<article><div class="art">${cell.svg}</div><h2>${cell.label}</h2>${cell.sizes?'<div class="sizes">'+[96,64,48].map(size=>`<figure><div style="width:${size}px;height:${size}px">${cell.svg}</div><figcaption>${size}px</figcaption></figure>`).join('')+'</div>':''}</article>`).join('');
  await board.setContent(`<html lang="zh"><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#25282e;color:#eee5da;font-family:'Noto Sans CJK SC',sans-serif}h1{font-size:23px;font-weight:500;margin:0 0 8px}p{font-size:12px;color:#bab1a8;margin:0 0 25px}.grid{display:grid;grid-template-columns:repeat(${item.columns},1fr);gap:15px}article{padding:12px;background:#32343c;border:1px solid #49464a;border-radius:9px;text-align:center}.art{width:100%;max-width:${item.columns===4?240:item.columns===3?280:190}px;aspect-ratio:1;margin:auto;background:#fffaf6;border-radius:8px}.art svg,.sizes svg{display:block;width:100%;height:100%}h2{font-size:12px;font-weight:400;margin:10px 0 0}.sizes{display:flex;justify-content:center;align-items:flex-end;gap:9px;margin:15px 0 0}.sizes figure{margin:0}.sizes figure>div{background:#fffaf6;border-radius:5px}.sizes figcaption{font-size:10px;margin-top:4px}</style><h1>${item.title}</h1><p>实际可编辑 SVG 组合诊断 · 细深灰线 / 平面色块 / 正常简化比例 · 不是固定整图</p><div class="grid">${cards}</div></html>`);
  await board.evaluate(()=>document.fonts.ready);await board.screenshot({path:join(out,item.name+'.png'),fullPage:true});
 }
 await board.close();
 const report={commit:process.env.GITHUB_SHA??'local',status:'automated-pass',pack:'simple-flat-v1',...Object.fromEntries(Object.entries(data).filter(([key])=>!['parts','samples','boards'].includes(key))),exportedParts:data.parts.length,samples:data.samples.length,boards:data.boards.length,sourceIsolation:true,artisticApproval:'Requires screenshot inspection; geometry pass is not art approval'};
 await writeFile(join(out,'review.json'),JSON.stringify(report,null,2));
 return report;
}
