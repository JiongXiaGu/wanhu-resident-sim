import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {basename,join} from 'node:path';
import sharp from 'sharp';
import {avatarReviewSpecs,styleRelationships} from './pack-specs.mjs';

const layerOrder=['BackHair','HeadwearBack','Neck','Outfit','FaceBase','Expression','FrontHair','HeadwearFront'];

async function collectTsFiles(dir){
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())result.push(...await collectTsFiles(path));
    else if(entry.isFile()&&entry.name.endsWith('.ts'))result.push(path);
  }
  return result;
}

async function auditSourceIsolation(){
  const dirs=avatarReviewSpecs.map(spec=>({id:spec.id,dir:basename(spec.sourceDir)}));
  for(const spec of avatarReviewSpecs){
    const files=await collectTsFiles(spec.sourceDir);
    assert(files.length>0,`No TypeScript source found for ${spec.id}`);
    for(const path of files){
      const source=await readFile(path,'utf8');
      for(const other of dirs){
        if(other.id===spec.id)continue;
        const escaped=other.dir.replace(/[.*+?^{}()|[\]\\]/g,'\\$&');
        const pattern=new RegExp(`(?:from\\s+|import\\s*\\()(['"])[^'"]*(?:packs/${escaped}|\\.\\./${escaped})(?:/|\\1)`);
        assert(!pattern.test(source),`${spec.id} imports artwork from ${other.id}: ${path}`);
      }
    }
  }
}

async function renderBoards(page,outDir,boards,{background='#fffaf6',subtitle='实际可编辑 SVG 组合诊断'}={}){
  await mkdir(outDir,{recursive:true});
  const board=await page.context().newPage();
  await board.setViewportSize({width:1440,height:1000});
  try{
    for(const item of boards){
      const maxWidth=item.columns===4?240:item.columns===3?280:item.columns===2?360:190;
      const cards=item.cells.map(cell=>`<article><div class="art">${cell.svg}</div><h2>${cell.label}</h2>${cell.sizes?'<div class="sizes">'+[96,64,48].map(size=>`<figure><div style="width:${size}px;height:${size}px">${cell.svg}</div><figcaption>${size}px</figcaption></figure>`).join('')+'</div>':''}</article>`).join('');
      await board.setContent(`<html lang="zh"><meta charset="UTF-8"><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#25282e;color:#eee5da;font-family:'Noto Sans CJK SC',sans-serif}h1{font-size:23px;font-weight:500;margin:0 0 8px}p{font-size:12px;color:#bab1a8;margin:0 0 25px}.grid{display:grid;grid-template-columns:repeat(${item.columns},1fr);gap:15px}article{padding:12px;background:#32343c;border:1px solid #49464a;border-radius:9px;text-align:center}.art{width:100%;max-width:${maxWidth}px;aspect-ratio:1;margin:auto;background:${background};border-radius:8px}.art svg,.sizes svg{display:block;width:100%;height:100%}h2{font-size:12px;font-weight:400;margin:10px 0 0}.sizes{display:flex;justify-content:center;align-items:flex-end;gap:9px;margin:15px 0 0}.sizes figure{margin:0}.sizes figure>div{background:${background};border-radius:5px}.sizes figcaption{font-size:10px;margin-top:4px}</style><h1>${item.title}</h1><p>${subtitle}</p><div class="grid">${cards}</div></html>`);
      await board.evaluate(()=>document.fonts.ready);
      await board.screenshot({path:join(outDir,item.name+'.png'),fullPage:true});
    }
  }finally{
    await board.close();
  }
}

async function auditModelContract(page){
  return page.evaluate(async()=>{
    const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
    const require=(value,message)=>{if(!value)throw new Error(message);};
    let randomRows=0,randomIdentityChecks=0,invalidRecipeChecks=0,switchChecks=0,compatibilityChecks=0;
    const coverage={};

    for(const meta of r.packCatalog){
      const catalog=m.catalogFor(meta.id),base=m.recipeForPack(meta.id);
      m.parseRecipe(base);
      coverage[meta.id]={};

      for(const part of m.parts){
        let rejected=false;
        try{m.parseRecipe({...base,[part]:'__invalid__'});}catch{rejected=true;}
        require(rejected,`${meta.id} accepted an option outside its own ${part} catalog`);
        invalidRecipeChecks++;
      }

      const rows=Array.from({length:1024},(_,seed)=>m.randomRecipeForPack(seed,meta.id));
      randomRows+=rows.length;
      for(const part of m.parts){
        const allowed=new Set(catalog[part].map(option=>option.id));
        const used=new Set(rows.map(row=>row[part]));
        require([...used].every(id=>allowed.has(id)),`${meta.id} random emitted invalid ${part}`);
        require([...allowed].every(id=>used.has(id)),`${meta.id} random omitted ${part} option`);
        coverage[meta.id][part]=used.size;
      }

      for(let seed=0;seed<100;seed++){
        const value=m.randomRecipeForPack(seed,meta.id,base);
        require(value.face===base.face&&value.expression===base.expression,`${meta.id} wardrobe random changed identity`);
        if(catalog.hair.length>1)require(value.hair!==base.hair,`${meta.id} wardrobe random did not change hair`);
        if(catalog.outfit.length>1)require(value.outfit!==base.outfit,`${meta.id} wardrobe random did not change outfit`);
        randomIdentityChecks++;
      }

      for(const target of r.packCatalog){
        const first=m.withPack(base,target.id),second=m.withPack(base,target.id);
        require(JSON.stringify(first)===JSON.stringify(second),`${meta.id} → ${target.id} mapping is not deterministic`);
        const targetCatalog=m.catalogFor(target.id);
        for(const part of m.parts)require(targetCatalog[part].some(option=>option.id===first[part]),`${meta.id} → ${target.id} mapped outside target ${part} catalog`);
        switchChecks++;
      }
    }

    const chibi=m.recipeForPack('chibi-cute-v1'),chibiCatalog=m.catalogFor('chibi-cute-v1');
    for(const part of m.parts){
      for(const option of chibiCatalog[part].filter(option=>option.compatibilityKey&&option.compatibilityKey!==option.id)){
        const source=m.parseRecipe({...chibi,[part]:option.id});
        for(const target of r.packCatalog.filter(pack=>pack.id!=='chibi-cute-v1')){
          const mapped=m.withPack(source,target.id),targetCatalog=m.catalogFor(target.id);
          const expected=targetCatalog[part].find(item=>item.id===option.compatibilityKey)?.id??m.recipeForPack(target.id)[part];
          require(mapped[part]===expected,`${part}/${option.id} did not follow compatibilityKey when mapping to ${target.id}`);
          compatibilityChecks++;
        }
      }
    }

    const legacy=m.parseRecipe({...chibi,pack:'soft-paint-v1'});
    require(legacy.pack==='chibi-cute-v1','Legacy soft-paint alias no longer maps to chibi-cute-v1');
    for(const part of m.parts)require(legacy[part]===chibi[part],'Legacy alias rewrote semantic choices');

    for(const value of [null,[],{}, {...m.defaultRecipe,target:'other'}, {...m.defaultRecipe,version:2}]){
      let rejected=false;try{m.parseRecipe(value);}catch{rejected=true;}
      require(rejected,'Unsafe recipe accepted');
      invalidRecipeChecks++;
    }

    return {randomRows,randomIdentityChecks,invalidRecipeChecks,switchChecks,compatibilityChecks,coverage,activePackId:m.activePackId};
  });
}

async function auditPack(page,outRoot,spec){
  const out=join(outRoot,'packs',spec.id);
  await mkdir(join(out,'parts'),{recursive:true});
  await mkdir(join(out,'samples'),{recursive:true});

  const data=await page.evaluate(async spec=>{
    const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts'),types=await import('/src/avatar/packs/types.ts');
    const require=(value,message)=>{if(!value)throw new Error(message);};
    const expectedLayerOrder=types.layerOrder;
    const parser=new DOMParser(),host=document.createElement('div');
    host.style.cssText='position:absolute;left:-5000px;top:0;width:320px;height:320px';
    document.body.append(host);
    const meta=r.packCatalog.find(item=>item.id===spec.id),catalog=m.catalogFor(spec.id);
    require(meta,`Review spec references unregistered pack ${spec.id}`);
    const pick=(part,id)=>catalog[part].some(option=>option.id===id)?id:m.recipeForPack(spec.id)[part];
    const baseRecipe=m.recipeForPack(spec.id);
    const parts=[],samples=[],boards=[],wardrobe=new Map();
    let combinations=0,mouthChecks=0,eyeChecks=0,markerChecks=0,headwearChecks=0,outfitStructureChecks=0;

    for(const frame of m.frames){
      const base={...baseRecipe,hair:pick('hair',frame.startsWith('male')?'crop':'bob'),outfit:pick('outfit','shirt'),expression:pick('expression','calm')};
      const faces=[],expressions=[],hairs=[],outfits=[];
      const addPart=(name,layer)=>{
        require(layer,`Missing layer ${name} in ${spec.id}/${frame}`);
        parts.push({name:`${frame}/${name}.svg`,frame,layer:layer.id,svg:r.svgDocument(layer.svg,spec.id)});
      };
      const initial=r.renderLayers(frame,base);
      addPart('neck',initial.find(x=>x.id==='Neck'));

      for(const hair of catalog.hair){
        const layers=r.renderLayers(frame,{...base,hair:hair.id});
        const back=layers.find(x=>x.id==='BackHair'),headwearBack=layers.find(x=>x.id==='HeadwearBack'),front=layers.find(x=>x.id==='FrontHair'),headwearFront=layers.find(x=>x.id==='HeadwearFront');
        addPart(`hair-${hair.id}-back`,back);
        addPart(`hair-${hair.id}-headwear-back`,headwearBack);
        addPart(`hair-${hair.id}-front`,front);
        addPart(`hair-${hair.id}-headwear-front`,headwearFront);
        if(spec.headwearContract){
          require(headwearBack&&headwearFront,`${spec.id} hair is missing Headwear layer slots`);
          const mode=hair.headwear??'none',hasHeadwear=Boolean(headwearBack.svg||headwearFront.svg);
          if(mode==='integrated')require(hasHeadwear,`${spec.id}/${hair.id} declares integrated headwear but draws no Headwear layer`);
          else require(!hasHeadwear,`${spec.id}/${hair.id} draws Headwear content without integrated catalog metadata`);
          headwearChecks++;
        }
      }
      for(const outfit of catalog.outfit){
        const outfitLayer=r.renderLayers(frame,{...base,outfit:outfit.id}).find(x=>x.id==='Outfit');
        addPart(`outfit-${outfit.id}`,outfitLayer);
        if(spec.outfitContract){
          host.innerHTML=r.svgDocument(outfitLayer.svg,spec.id);
          require(host.querySelectorAll('[data-chibi-outfit-part="base"]').length>=1,`${spec.id}/${outfit.id} missing outfit base marker`);
          require(host.querySelectorAll('[data-chibi-outfit-part="collar"]').length>=1,`${spec.id}/${outfit.id} missing outfit collar marker`);
          require(!host.querySelector('[data-layer="FaceBase"]'),`${spec.id}/${outfit.id} outfit part leaked face geometry`);
          outfitStructureChecks++;
        }
      }

      const faceGeometry=new Set();
      for(const face of catalog.face){
        const reference={...base,face:face.id},baseline=r.renderLayers(frame,reference),faceLayer=baseline.find(x=>x.id==='FaceBase');
        require(faceLayer,`Missing FaceBase in ${spec.id}/${frame}/${face.id}`);
        const faceSvg=faceLayer.svg;
        faceGeometry.add(faceSvg);
        addPart(`face-${face.id}`,faceLayer);
        const referenceSvg=r.renderAvatar(frame,reference);
        faces.push({label:face.label,svg:referenceSvg,sizes:true});
        samples.push({name:`${frame}-${face.id}`,frame,recipe:reference,svg:referenceSvg});

        for(const expression of catalog.expression){
          const look={...reference,expression:expression.id},layers=r.renderLayers(frame,look),expressionLayer=layers.find(x=>x.id==='Expression');
          require(expressionLayer,`Missing Expression in ${spec.id}/${frame}/${face.id}/${expression.id}`);
          const expressionSvg=expressionLayer.svg;
          addPart(`expression-${face.id}-${expression.id}`,expressionLayer);
          expressions.push({label:`${face.label} / ${expression.label}`,svg:r.renderAvatar(frame,look)});
          host.innerHTML=r.renderAvatar(frame,look);

          if(spec.expressionMarker){require(host.querySelector(spec.expressionMarker),`${spec.id} expression marker missing`);markerChecks++;}
          if(spec.faceMarker){require(host.querySelector(spec.faceMarker),`${spec.id} face marker missing`);markerChecks++;}

          const mouth=host.querySelector('[data-mouth]');
          require(mouth,`${spec.id} expression lost mouth metadata`);
          const mouthBox=mouth.getBBox();
          require(Math.abs(mouthBox.x+mouthBox.width/2-160)<spec.mouthTolerance,`${spec.id} mouth shifted off center: ${frame}/${face.id}/${expression.id}`);
          mouthChecks++;

          if(spec.eyeCheck==='optional-iris'){
            const whites=[...host.querySelectorAll('[data-eye-white] path')],irises=[...host.querySelectorAll('[data-eye-iris]')];
            if(whites.length||irises.length){
              require(whites.length===irises.length&&whites.length>0,`${spec.id} eye metadata is not paired`);
              for(let index=0;index<whites.length;index++){
                const white=whites[index],iris=irises[index];
                for(const item of iris.children){
                  const box=item.getBBox();
                  for(let x=box.x+.4;x<box.x+box.width;x+=.8)for(let y=box.y+.4;y<box.y+box.height;y+=.8){
                    const point=new DOMPoint(x,y);
                    if(item.isPointInFill(point))require(white.isPointInFill(point),`${spec.id} iris escaped eye: ${frame}/${face.id}/${expression.id}`);
                  }
                }
                eyeChecks++;
              }
            }
          }else if(spec.eyeCheck==='face-bounds'){
            const eyes=host.querySelector('[data-eye-pair]'),renderedFace=host.querySelector('[data-layer="FaceBase"]');
            require(eyes&&renderedFace,`${spec.id} eye or face metadata missing`);
            const eyeBox=eyes.getBBox(),faceBox=renderedFace.getBBox();
            require(eyeBox.x>=faceBox.x+2&&eyeBox.x+eyeBox.width<=faceBox.x+faceBox.width-2,`${spec.id} eyes escaped face width`);
            require(eyeBox.y>=faceBox.y+10&&eyeBox.y+eyeBox.height<=faceBox.y+faceBox.height-18,`${spec.id} eyes escaped face height`);
            eyeChecks++;
          }

          for(const hair of catalog.hair)for(const outfit of catalog.outfit){
            const recipe=m.parseRecipe({...look,hair:hair.id,outfit:outfit.id}),comboLayers=r.renderLayers(frame,recipe),svg=r.renderAvatar(frame,recipe);
            require(comboLayers.find(x=>x.id==='FaceBase').svg===faceSvg,`${spec.id} wardrobe changed face`);
            require(comboLayers.find(x=>x.id==='Expression').svg===expressionSvg,`${spec.id} wardrobe changed expression`);
            const key=`${frame}/${hair.id}/${outfit.id}`,shared=JSON.stringify(comboLayers.filter(x=>!['FaceBase','Expression'].includes(x.id)));
            if(wardrobe.has(key))require(wardrobe.get(key)===shared,`${spec.id} face changed shared wardrobe`);else wardrobe.set(key,shared);
            require(comboLayers.map(x=>x.id).join(',')===expectedLayerOrder.join(','),`${spec.id} layer order changed`);
            require(!/<image\\b|<script\\b|<foreignObject\\b|<mask\\b|<clipPath\\b/.test(svg),`${spec.id} used forbidden complete-image or auto-fit constructs`);
            for(const token of spec.extraForbiddenSvg)require(!svg.includes(token),`${spec.id} contains forbidden artwork marker: ${token}`);
            require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),`${spec.id} emitted invalid SVG`);
            combinations++;
          }
        }

        for(const hair of catalog.hair)hairs.push({label:`${face.label} / ${hair.label}`,svg:r.renderAvatar(frame,{...reference,hair:hair.id})});
        for(const outfit of catalog.outfit)outfits.push({label:`${face.label} / ${outfit.label}`,svg:r.renderAvatar(frame,{...reference,outfit:outfit.id})});
      }

      require(faceGeometry.size===catalog.face.length,`${spec.id} faces are not independent outlines`);
      const matrixFrame=spec.matrixFrames==='all'||frame.endsWith('adult');
      if(matrixFrame){
        boards.push({name:`faces-${frame}`,title:`${meta.label} · ${frame} · ${catalog.face.length} 张脸`,columns:Math.min(4,catalog.face.length),cells:faces});
        boards.push({name:`expressions-${frame}`,title:`${meta.label} · ${frame} · ${catalog.face.length}脸 × ${catalog.expression.length}表情`,columns:Math.min(6,catalog.expression.length),cells:expressions});
        boards.push({name:`hair-${frame}`,title:`${meta.label} · ${frame} · ${catalog.face.length}脸 × ${catalog.hair.length}${spec.headwearContract?'头部造型 / Headwear':'头发'}`,columns:Math.min(6,catalog.hair.length),cells:hairs});
        boards.push({name:`outfits-${frame}`,title:`${meta.label} · ${frame} · ${catalog.face.length}脸 × ${catalog.outfit.length}衣服`,columns:Math.min(4,catalog.outfit.length),cells:outfits});
      }else if(spec.nonAdultFaceBoards){
        boards.push({name:`age-${frame}`,title:`${meta.label} · ${frame} · 年龄上下文`,columns:Math.min(4,catalog.face.length),cells:faces});
      }
    }

    const expected=m.frames.length*catalog.face.length*catalog.expression.length*catalog.hair.length*catalog.outfit.length;
    require(combinations===expected,`${spec.id} expected ${expected} combinations, got ${combinations}`);

    if(spec.ageProof){
      for(const gender of ['female','male']){
        const cells=['child','adult','elder'].map(stage=>{
          const frame=`${gender}.${stage}`,recipe={...baseRecipe,face:pick('face','oval'),hair:pick('hair',gender==='male'?'crop':'bob'),outfit:pick('outfit','shirt'),expression:pick('expression','calm')};
          return {label:stage,svg:r.renderAvatar(frame,recipe),sizes:true};
        });
        boards.push({name:`age-proof-${gender}`,title:`${meta.label} · ${gender} · child / adult / elder`,columns:3,cells});
      }
    }

    if(spec.nativeSizeProof){
      for(const gender of ['female','male']){
        const frame=`${gender}.adult`,recipe={...baseRecipe,face:pick('face','round'),hair:pick('hair','long'),outfit:pick('outfit','knit'),expression:pick('expression','smile')};
        boards.push({name:`native-size-${frame}`,title:`${meta.label} · ${frame} · 96 / 64 / 48px`,columns:1,cells:[{label:'native-size proof',svg:r.renderAvatar(frame,recipe),sizes:true}]});
      }
    }

    if(spec.featuredHair?.length||spec.featuredOutfits?.length||spec.featuredExpressions?.length){
      for(const gender of ['female','male']){
        const frame=`${gender}.adult`,foundation={...baseRecipe,face:pick('face','round'),hair:pick('hair','bound'),outfit:pick('outfit','commoner'),expression:pick('expression','calm')};
        if(spec.featuredHair?.length){
          const cells=spec.featuredHair.map(id=>{
            const option=catalog.hair.find(item=>item.id===id);require(option,`Featured hair ${id} missing from ${spec.id}`);
            return {label:option.label,svg:r.renderAvatar(frame,{...foundation,hair:id}),sizes:true};
          });
          boards.push({name:`batch-a-hair-${frame}`,title:`${meta.label} · Batch A · ${frame} · 新头部造型`,columns:Math.min(5,cells.length),cells});
        }
        if(spec.featuredOutfits?.length){
          const cells=spec.featuredOutfits.map(id=>{
            const option=catalog.outfit.find(item=>item.id===id);require(option,`Featured outfit ${id} missing from ${spec.id}`);
            return {label:option.label,svg:r.renderAvatar(frame,{...foundation,outfit:id}),sizes:true};
          });
          boards.push({name:`batch-a-outfit-${frame}`,title:`${meta.label} · Batch A · ${frame} · 新古代服饰`,columns:Math.min(5,cells.length),cells});
        }
        if(spec.featuredExpressions?.length){
          const cells=spec.featuredExpressions.map(id=>{
            const option=catalog.expression.find(item=>item.id===id);require(option,`Featured expression ${id} missing from ${spec.id}`);
            return {label:option.label,svg:r.renderAvatar(frame,{...foundation,expression:id}),sizes:true};
          });
          boards.push({name:`batch-a-expression-${frame}`,title:`${meta.label} · Batch A · ${frame} · 新表情`,columns:cells.length,cells});
        }
      }
    }

    host.remove();
    return {combinations,expected,mouthChecks,eyeChecks,markerChecks,headwearChecks,outfitStructureChecks,parts,samples,boards,catalogCounts:Object.fromEntries(m.parts.map(part=>[part,catalog[part].length]))};
  },spec);

  for(const part of data.parts){
    await mkdir(join(out,'parts',part.frame),{recursive:true});
    await writeFile(join(out,'parts',part.name),part.svg);
  }
  await writeFile(join(out,'parts','manifest.json'),JSON.stringify({
    pack:spec.id,
    order:layerOrder,
    count:data.parts.length,
    catalogCounts:data.catalogCounts,
    parts:data.parts.map(({svg,...rest})=>rest),
    note:'Generated from the pack-owned catalog. Face, hair, outfit and expression remain independently selectable.',
  },null,2));

  for(const sample of data.samples){
    await writeFile(join(out,'samples',sample.name+'.svg'),sample.svg);
    await writeFile(join(out,'samples',sample.name+'.json'),JSON.stringify({frame:sample.frame,recipe:sample.recipe},null,2));
    await sharp(Buffer.from(sample.svg)).resize(320,320).png().toFile(join(out,'samples',sample.name+'.png'));
  }

  await renderBoards(page,out,data.boards,{background:spec.boardBackground,subtitle:spec.boardSubtitle});
  const report={
    commit:process.env.GITHUB_SHA??'local',
    status:'automated-pass',
    pack:spec.id,
    combinations:data.combinations,
    expectedCombinations:data.expected,
    catalogCounts:data.catalogCounts,
    mouthChecks:data.mouthChecks,
    eyeChecks:data.eyeChecks,
    markerChecks:data.markerChecks,
    headwearChecks:data.headwearChecks,
    outfitStructureChecks:data.outfitStructureChecks,
    exportedParts:data.parts.length,
    samples:data.samples.length,
    boards:data.boards.length,
    sourceIsolation:true,
    artisticApproval:'Requires screenshot inspection; geometry pass is not art approval',
  };
  await writeFile(join(out,'review.json'),JSON.stringify(report,null,2));
  return report;
}

async function auditStyleComparisons(page,outRoot,registered){
  const result=await page.evaluate(async({registered,relationships})=>{
    const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
    const require=(value,message)=>{if(!value)throw new Error(message);};
    const host=document.createElement('div');host.style.cssText='position:absolute;left:-5000px;top:0;width:320px;height:320px';document.body.append(host);
    const boards=[];let styleChecks=0;
    const active=registered.find(pack=>pack.lifecycle==='active');
    require(active,'No active pack available for style comparison');
    const activeCatalog=m.catalogFor(active.id),base=m.recipeForPack(active.id);
    const preferred=(part,id)=>activeCatalog[part].some(option=>option.id===id)?id:base[part];
    const semantic={...base,face:preferred('face','round'),hair:preferred('hair','long'),outfit:preferred('outfit','knit'),expression:preferred('expression','smile')};

    for(const frame of ['female.adult','male.adult']){
      const rendered=registered.filter(pack=>pack.lifecycle!=='legacy').map(pack=>{
        const recipe=m.withPack(semantic,pack.id);
        return {id:pack.id,label:pack.label,svg:r.renderAvatar(frame,recipe),recipe};
      });
      require(new Set(rendered.map(item=>item.svg)).size===rendered.length,`Visible packs rendered identical SVG for ${frame}`);
      const metrics={};
      for(const item of rendered){
        host.innerHTML=item.svg;
        const face=host.querySelector('[data-layer="FaceBase"]').getBBox(),outfit=host.querySelector('[data-layer="Outfit"]').getBBox();
        metrics[item.id]={faceWidth:face.width,headOutfitRatio:face.height/outfit.height};
      }
      for(const relation of relationships){
        if(!metrics[relation.pack]||(relation.other&&!metrics[relation.other]))continue;
        if(relation.type==='min-head-outfit-ratio')require(metrics[relation.pack].headOutfitRatio>relation.min,`${relation.pack} head/body proportion is too small`);
        else if(relation.type==='relative-head-outfit-ratio-max')require(metrics[relation.pack].headOutfitRatio<metrics[relation.other].headOutfitRatio*relation.factor,`${relation.pack} head/body proportion is too close to ${relation.other}`);
        else if(relation.type==='relative-face-width-max')require(metrics[relation.pack].faceWidth<metrics[relation.other].faceWidth*relation.factor,`${relation.pack} face width is too close to ${relation.other}`);
        styleChecks++;
      }
      boards.push({name:`style-compare-${frame}`,title:`${frame} · 同一语义跨画风对比`,columns:rendered.length,cells:rendered.map(item=>({label:item.label,svg:item.svg,sizes:true}))});
    }
    host.remove();
    return {styleChecks,boards};
  },{registered,relationships:styleRelationships});

  const out=join(outRoot,'style-comparisons');
  await renderBoards(page,out,result.boards,{background:'#fffaf6',subtitle:'从 active Pack 出发，按显式兼容规则映射到各画风'});
  const report={registeredPacks:registered.map(item=>({id:item.id,lifecycle:item.lifecycle,counts:item.counts})),styleChecks:result.styleChecks,boards:result.boards.length};
  await writeFile(join(out,'review.json'),JSON.stringify(report,null,2));
  return report;
}

export async function auditRegisteredAvatarPacks(page,outRoot='review-screenshots/avatar'){
  const registered=await page.evaluate(async()=>{
    const render=await import('/src/avatar/render.ts');
    return render.packCatalog.map(pack=>({id:pack.id,label:pack.label,lifecycle:pack.lifecycle,counts:pack.counts}));
  });
  assert.deepEqual(registered.map(item=>item.id),avatarReviewSpecs.map(spec=>spec.id),'Pack Registry and Review Specs are out of sync');
  assert.equal(new Set(registered.map(item=>item.id)).size,registered.length,'Duplicate pack ID in registry');
  assert(registered.some(item=>item.lifecycle==='active'),'At least one active pack is required');

  await auditSourceIsolation();
  const model=await auditModelContract(page);
  const packs={};
  for(const spec of avatarReviewSpecs)packs[spec.id]=await auditPack(page,outRoot,spec);
  const styles=await auditStyleComparisons(page,outRoot,registered);
  const report={registry:registered,model,packs,styles};
  await writeFile(join(outRoot,'pack-review.json'),JSON.stringify(report,null,2));
  return report;
}
