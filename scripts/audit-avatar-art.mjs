import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import sharp from 'sharp';

// 这些是从实际画风包渲染的诊断图板，不是伪造玩家界面，也不作为整图资产输入。
export async function auditAvatarArt(page,out){
 const data=await page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const require=(value,message)=>{if(!value)throw new Error(message);};
  const parser=new DOMParser(),host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px;top:0';document.body.append(host);
  const partExports=[],boards=[],samples=[],wardrobe=new Map();let combinations=0,mouthChecks=0,eyeChecks=0;
  for(const frame of m.frames){
   const base={...m.defaultRecipe,hair:frame.startsWith('male')?'crop':'bob',outfit:'shirt',expression:'calm'};
   const faceCells=[],expressionCells=[],hairCells=[],outfitCells=[];
   const addPart=(name,layer)=>partExports.push({name:`${frame}/${name}.svg`,svg:r.svgDocument(layer.svg),layer:layer.id,frame});
   const initial=r.renderLayers(frame,base);addPart('neck',initial.find(x=>x.id==='Neck'));
   for(const hair of m.options.hair){const layers=r.renderLayers(frame,{...base,hair:hair.id});addPart(`hair-${hair.id}-back`,layers.find(x=>x.id==='BackHair'));addPart(`hair-${hair.id}-front`,layers.find(x=>x.id==='FrontHair'));}
   for(const outfit of m.options.outfit)addPart(`outfit-${outfit.id}`,r.renderLayers(frame,{...base,outfit:outfit.id}).find(x=>x.id==='Outfit'));
   const faceGeometry=new Set();
   for(const face of m.options.face){
    const reference={...base,face:face.id},baseline=r.renderLayers(frame,reference),faceSvg=baseline.find(x=>x.id==='FaceBase').svg;
    faceGeometry.add(faceSvg);addPart(`face-${face.id}`,baseline.find(x=>x.id==='FaceBase'));
    faceCells.push({label:face.label,svg:r.renderAvatar(frame,reference),sizes:true});
    samples.push({name:`${frame}-${face.id}`,frame,recipe:reference,svg:r.renderAvatar(frame,reference)});
    for(const expression of m.options.expression){
     const look={...reference,expression:expression.id},referenceExpression=r.renderLayers(frame,look).find(x=>x.id==='Expression').svg;
     addPart(`expression-${face.id}-${expression.id}`,{id:'Expression',svg:referenceExpression});
     expressionCells.push({label:`${face.label} / ${expression.label}`,svg:r.renderAvatar(frame,look)});
     host.innerHTML=r.renderAvatar(frame,look);
     const box=host.querySelector('[data-mouth]').getBBox();require(Math.abs(box.x+box.width/2-160)<.02,'Mouth shifted off center');mouthChecks++;
     const white=host.querySelector('[data-eye-white] path'),iris=host.querySelector('[data-eye-iris]');
     if(white&&iris){for(const part of iris.children){const b=part.getBBox();for(let x=b.x+.2;x<b.x+b.width;x+=.65)for(let y=b.y+.2;y<b.y+b.height;y+=.65){const pt=new DOMPoint(x,y);if(part.isPointInFill(pt))require(white.isPointInFill(pt),`Eye fill escaped white: ${frame}/${face.id}/${expression.id}`);}}eyeChecks++;}
     for(const hair of m.options.hair)for(const outfit of m.options.outfit){
      const recipe=m.parseRecipe({...look,hair:hair.id,outfit:outfit.id}),layers=r.renderLayers(frame,recipe),svg=r.renderAvatar(frame,recipe);
      require(layers.find(x=>x.id==='FaceBase').svg===faceSvg,'Expression or wardrobe changed face outline');
      require(layers.find(x=>x.id==='Expression').svg===referenceExpression,'Wardrobe changed facial expression');
      const key=`${frame}/${hair.id}/${outfit.id}`,other=JSON.stringify(layers.filter(x=>!['FaceBase','Expression'].includes(x.id)));
      if(wardrobe.has(key))require(wardrobe.get(key)===other,'Face change altered shared hair, neck or outfit');else wardrobe.set(key,other);
      require(layers.map(x=>x.id).join(',')==='BackHair,Neck,Outfit,FaceBase,Expression,FrontHair','Expression must stay below bangs');
      require(!/<image\b|<script\b|<foreignObject\b|<mask\b|<clipPath\b/.test(svg),'External or complete raster portrait used');
      require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),'Invalid SVG');combinations++;
     }
    }
    for(const hair of m.options.hair)hairCells.push({label:`${face.label} / ${hair.label}`,svg:r.renderAvatar(frame,{...reference,hair:hair.id})});
    for(const outfit of m.options.outfit)outfitCells.push({label:`${face.label} / ${outfit.label}`,svg:r.renderAvatar(frame,{...reference,outfit:outfit.id})});
   }
   require(faceGeometry.size===4,'Face options must not be duplicate full assets');
   boards.push({name:`faces-${frame}`,title:`${frame} · 四张脸，共享头发与衣服`,columns:4,cells:faceCells});
   boards.push({name:`expressions-${frame}`,title:`${frame} · 每行同一张脸的六套表情`,columns:6,cells:expressionCells});
   boards.push({name:`hair-${frame}`,title:`${frame} · 每张脸共享六种头发`,columns:6,cells:hairCells});
   boards.push({name:`outfits-${frame}`,title:`${frame} · 每张脸共享四套衣服`,columns:4,cells:outfitCells});
  }
  host.remove();require(combinations===3456,'Expected 6 × 4 × 6 × 4 × 6 combinations');
  const rows=Array.from({length:512},(_,seed)=>m.randomRecipe(seed));
  for(const part of m.parts)require(new Set(rows.map(row=>row[part])).size===m.options[part].length,`Random omitted ${part}`);
  for(let seed=0;seed<100;seed++){const v=m.randomRecipe(seed,m.defaultRecipe);require(v.face===m.defaultRecipe.face&&v.expression===m.defaultRecipe.expression,'Wardrobe random changed identity');require(v.hair!==m.defaultRecipe.hair&&v.outfit!==m.defaultRecipe.outfit,'Random outfit did not change');}
  for(const value of [null,[],{}, {...m.defaultRecipe,face:'unknown'}, {...m.defaultRecipe,target:'other'}, {...m.defaultRecipe,version:2}]){let rejected=false;try{m.parseRecipe(value);}catch{rejected=true;}require(rejected,'Unsafe recipe accepted');}
  return {combinations,mouthChecks,eyeChecks,partExports,boards,samples};
 });
 await mkdir(join(out,'parts'),{recursive:true});await mkdir(join(out,'samples'),{recursive:true});
 for(const part of data.partExports){await mkdir(join(out,'parts',part.frame),{recursive:true});await writeFile(join(out,'parts',part.name),part.svg);}
 await writeFile(join(out,'parts','manifest.json'),JSON.stringify({pack:'linework-v1',viewBox:'0 0 320 320',order:['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'],parts:data.partExports.map(({svg,...part})=>part),note:'Generated from editable SVG source. Expression entries are face-specific coordinated sets. Not complete-portrait assets.'},null,2));
 for(const sample of data.samples){await writeFile(join(out,'samples',sample.name+'.svg'),sample.svg);await writeFile(join(out,'samples',sample.name+'.json'),JSON.stringify({frame:sample.frame,recipe:sample.recipe},null,2));await sharp(Buffer.from(sample.svg)).resize(320,320).png().toFile(join(out,'samples',sample.name+'.png'));}
 const board=await page.context().newPage();await board.setViewportSize({width:1440,height:1000});
 for(const item of data.boards){
  const cards=item.cells.map(cell=>`<article><div class="art">${cell.svg}</div><h2>${cell.label}</h2>${cell.sizes?'<div class="sizes">'+[96,64,48].map(size=>`<figure><div style="width:${size}px;height:${size}px">${cell.svg}</div><figcaption>${size}px</figcaption></figure>`).join('')+'</div>':''}</article>`).join('');
  await board.setContent(`<html lang="zh"><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#25282e;color:#eee5da;font-family:'Noto Sans CJK SC',sans-serif}h1{font-size:23px;font-weight:500;margin:0 0 8px}p{font-size:12px;color:#bab1a8;margin:0 0 25px}.grid{display:grid;grid-template-columns:repeat(${item.columns},1fr);gap:15px}article{padding:12px;background:#32343c;border:1px solid #49464a;border-radius:9px;text-align:center}.art{width:100%;max-width:${item.columns===4?240:190}px;aspect-ratio:1;margin:auto;background:#9b969c;border-radius:8px}.art svg,.sizes svg{display:block;width:100%;height:100%}h2{font-size:12px;font-weight:400;margin:10px 0 0}.sizes{display:flex;justify-content:center;align-items:flex-end;gap:9px;margin:15px 0 0}.sizes figure{margin:0}.sizes figure>div{background:#9b969c;border-radius:5px}.sizes figcaption{font-size:10px;margin-top:4px}</style><h1>${item.title}</h1><p>头像工坊 / 实际 SVG 图层诊断图板 · 不是固定人物图库，也不是玩家界面截图</p><div class="grid">${cards}</div></html>`);
  await board.evaluate(()=>document.fonts.ready);await board.screenshot({path:join(out,item.name+'.png'),fullPage:true});
 }
 await board.close();
 return {combinations:data.combinations,mouthChecks:data.mouthChecks,eyeChecks:data.eyeChecks,exportedParts:data.partExports.length,artBoards:data.boards.length,faceSamples:data.samples.length};
}
