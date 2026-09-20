import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {basename,join} from 'node:path';
import sharp from 'sharp';
import {avatarReviewSpecs,styleRelationships} from './pack-specs.mjs';

const layerOrder=['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'];
const semanticFields=['face','hair','outfit','expression'];

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
        const importPattern=new RegExp(`(?:from\\s+|import\\s*\\()(['"])[^'"]*(?:packs/${escaped}|\\.\\./${escaped})(?:/|\\1)`);
        assert(!importPattern.test(source),`${spec.id} imports artwork from ${other.id}: ${path}`);
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
    const m=await import('/src/avatar/model.ts');
    const require=(value,message)=>{if(!value)throw new Error(message);};
    const rows=Array.from({length:512},(_,seed)=>m.randomRecipe(seed));
    for(const part of m.parts)require(new Set(rows.map(row=>row[part])).size===m.options[part].length,`Random omitted ${part}`);
    for(let seed=0;seed<100;seed++){
      const value=m.randomRecipe(seed,m.defaultRecipe);
      require(value.face===m.defaultRecipe.face&&value.expression===m.defaultRecipe.expression,'Wardrobe random changed identity');
      require(value.hair!==m.defaultRecipe.hair&&value.outfit!==m.defaultRecipe.outfit,'Random wardrobe did not change both hair and outfit');
    }
    for(const value of [null,[],{}, {...m.defaultRecipe,face:'unknown'}, {...m.defaultRecipe,target:'other'}, {...m.defaultRecipe,version:2}]){
      let rejected=false;
      try{m.parseRecipe(value);}catch{rejected=true;}
      require(rejected,'Unsafe recipe accepted');
    }
    return {randomRows:rows.length,randomIdentityChecks:100,invalidRecipeChecks:6};
  });
}

async function auditPack(page,outRoot,spec){
  const out=join(outRoot,'packs',spec.id);
  await mkdir(join(out,'parts'),{recursive:true});
  await mkdir(join(out,'samples'),{recursive:true});

  const data=await page.evaluate(async spec=>{
    const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
    const require=(value,message)=>{if(!value)throw new Error(message);};
    const parser=new DOMParser(),host=document.createElement('div');
    host.style.cssText='position:absolute;left:-5000px;top:0;width:320px;height:320px';
    document.body.append(host);
    const meta=m.packOptions.find(item=>item.id===spec.id);
    require(meta,`Review spec references unregistered pack ${spec.id}`);
    const parts=[],samples=[],boards=[],wardrobe=new Map();
    let combinations=0,mouthChecks=0,eyeChecks=0,markerChecks=0;

    for(const frame of m.frames){
      const base={...m.defaultRecipe,pack:spec.id,hair:frame.startsWith('male')?'crop':'bob',outfit:'shirt',expression:'calm'};
      const faces=[],expressions=[],hairs=[],outfits=[];
      const addPart=(name,layer)=>{
        require(layer,`Missing layer ${name} in ${spec.id}/${frame}`);
        parts.push({name:`${frame}/${name}.svg`,frame,layer:layer.id,svg:r.svgDocument(layer.svg,spec.id)});
      };
      const initial=r.renderLayers(frame,base);
      addPart('neck',initial.find(x=>x.id==='Neck'));
      for(const hair of m.options.hair){
        const layers=r.renderLayers(frame,{...base,hair:hair.id});
        addPart(`hair-${hair.id}-back`,layers.find(x=>x.id==='BackHair'));
        addPart(`hair-${hair.id}-front`,layers.find(x=>x.id==='FrontHair'));
      }
      for(const outfit of m.options.outfit)addPart(`outfit-${outfit.id}`,r.renderLayers(frame,{...base,outfit:outfit.id}).find(x=>x.id==='Outfit'));

      const faceGeometry=new Set();
      for(const face of m.options.face){
        const reference={...base,face:face.id},baseline=r.renderLayers(frame,reference),faceLayer=baseline.find(x=>x.id==='FaceBase');
        require(faceLayer,`Missing FaceBase in ${spec.id}/${frame}/${face.id}`);
        const faceSvg=faceLayer.svg;
        faceGeometry.add(faceSvg);
        addPart(`face-${face.id}`,faceLayer);
        const referenceSvg=r.renderAvatar(frame,reference);
        faces.push({label:face.label,svg:referenceSvg,sizes:true});
        samples.push({name:`${frame}-${face.id}`,frame,recipe:reference,svg:referenceSvg});

        for(const expression of m.options.expression){
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

          for(const hair of m.options.hair)for(const outfit of m.options.outfit){
            const recipe=m.parseRecipe({...look,hair:hair.id,outfit:outfit.id}),comboLayers=r.renderLayers(frame,recipe),svg=r.renderAvatar(frame,recipe);
            require(comboLayers.find(x=>x.id==='FaceBase').svg===faceSvg,`${spec.id} wardrobe changed face`);
            require(comboLayers.find(x=>x.id==='Expression').svg===expressionSvg,`${spec.id} wardrobe changed expression`);
            const key=`${frame}/${hair.id}/${outfit.id}`,shared=JSON.stringify(comboLayers.filter(x=>!['FaceBase','Expression'].includes(x.id)));
            if(wardrobe.has(key))require(wardrobe.get(key)===shared,`${spec.id} face changed shared wardrobe`);else wardrobe.set(key,shared);
            require(comboLayers.map(x=>x.id).join(',')==='BackHair,Neck,Outfit,FaceBase,Expression,FrontHair',`${spec.id} layer order changed`);
            require(!/<image\\b|<script\\b|<foreignObject\\b|<mask\\b|<clipPath\\b/.test(svg),`${spec.id} used forbidden complete-image or auto-fit constructs`);
            for(const token of spec.extraForbiddenSvg)require(!svg.includes(token),`${spec.id} contains forbidden artwork marker: ${token}`);
            require(!parser.parseFromString(svg,'image/svg+xml').querySelector('parsererror'),`${spec.id} emitted invalid SVG`);
            combinations++;
          }
        }

        for(const hair of m.options.hair)hairs.push({label:`${face.label} / ${hair.label}`,svg:r.renderAvatar(frame,{...reference,hair:hair.id})});
        for(const outfit of m.options.outfit)outfits.push({label:`${face.label} / ${outfit.label}`,svg:r.renderAvatar(frame,{...reference,outfit:outfit.id})});
      }

      require(faceGeometry.size===m.options.face.length,`${spec.id} faces are not independent outlines`);
      const matrixFrame=spec.matrixFrames==='all'||frame.endsWith('adult');
      if(matrixFrame){
        boards.push({name:`faces-${frame}`,title:`${meta.label} · ${frame} · 四张脸`,columns:4,cells:faces});
        boards.push({name:`expressions-${frame}`,title:`${meta.label} · ${frame} · 4脸 × 6表情`,columns:6,cells:expressions});
        boards.push({name:`hair-${frame}`,title:`${meta.label} · ${frame} · 4脸 × 6头发`,columns:6,cells:hairs});
        boards.push({name:`outfits-${frame}`,title:`${meta.label} · ${frame} · 4脸 × 4衣服`,columns:4,cells:outfits});
      }else if(spec.nonAdultFaceBoards){
        boards.push({name:`age-${frame}`,title:`${meta.label} · ${frame} · 年龄上下文`,columns:4,cells:faces});
      }
    }

    const expected=m.frames.length*m.options.face.length*m.options.expression.length*m.options.hair.length*m.options.outfit.length;
    require(combinations===expected,`${spec.id} expected ${expected} combinations, got ${combinations}`);

    if(spec.ageProof){
      for(const gender of ['female','male']){
        const cells=['child','adult','elder'].map(stage=>{
          const frame=`${gender}.${stage}`,recipe={...m.defaultRecipe,pack:spec.id,face:'oval',hair:gender==='male'?'crop':'bob',outfit:'shirt',expression:'calm'};
          return {label:stage,svg:r.renderAvatar(frame,recipe),sizes:true};
        });
        boards.push({name:`age-proof-${gender}`,title:`${meta.label} · ${gender} · child / adult / elder`,columns:3,cells});
      }
    }

    if(spec.nativeSizeProof){
      for(const gender of ['female','male']){
        const frame=`${gender}.adult`,recipe={...m.defaultRecipe,pack:spec.id,face:'round',hair:'long',outfit:'knit',expression:'smile'};
        boards.push({name:`native-size-${frame}`,title:`${meta.label} · ${frame} · 96 / 64 / 48px`,columns:1,cells:[{label:'round / long / knit / smile',svg:r.renderAvatar(frame,recipe),sizes:true}]});
      }
    }

    host.remove();
    return {combinations,mouthChecks,eyeChecks,markerChecks,parts,samples,boards};
  },spec);

  for(const part of data.parts){
    await mkdir(join(out,'parts',part.frame),{recursive:true});
    await writeFile(join(out,'parts',part.name),part.svg);
  }
  await writeFile(join(out,'parts','manifest.json'),JSON.stringify({
    pack:spec.id,
    order:layerOrder,
    count:data.parts.length,
    parts:data.parts.map(({svg,...rest})=>rest),
    note:'Generated from editable SVG source. Face, hair, outfit and expression remain independently selectable.',
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
    mouthChecks:data.mouthChecks,
    eyeChecks:data.eyeChecks,
    markerChecks:data.markerChecks,
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
    for(const frame of ['female.adult','male.adult']){
      const semantic={...m.defaultRecipe,face:'round',hair:'long',outfit:'knit',expression:'smile'};
      const rendered=registered.map(pack=>({id:pack.id,label:pack.label,svg:r.renderAvatar(frame,{...semantic,pack:pack.id})}));
      require(new Set(rendered.map(item=>item.svg)).size===rendered.length,`Registered packs rendered identical SVG for ${frame}`);
      const metrics={};
      for(const item of rendered){
        host.innerHTML=item.svg;
        const face=host.querySelector('[data-layer="FaceBase"]').getBBox(),outfit=host.querySelector('[data-layer="Outfit"]').getBBox();
        metrics[item.id]={faceWidth:face.width,headOutfitRatio:face.height/outfit.height};
      }
      for(const relation of relationships){
        if(relation.type==='min-head-outfit-ratio')require(metrics[relation.pack].headOutfitRatio>relation.min,`${relation.pack} head/body proportion is too small`);
        else if(relation.type==='relative-head-outfit-ratio-max')require(metrics[relation.pack].headOutfitRatio<metrics[relation.other].headOutfitRatio*relation.factor,`${relation.pack} head/body proportion is too close to ${relation.other}`);
        else if(relation.type==='relative-face-width-max')require(metrics[relation.pack].faceWidth<metrics[relation.other].faceWidth*relation.factor,`${relation.pack} face width is too close to ${relation.other}`);
        styleChecks++;
      }
      boards.push({name:`style-compare-${frame}`,title:`${frame} · 同一配置跨画风对比`,columns:rendered.length,cells:rendered.map(item=>({label:item.label,svg:item.svg,sizes:true}))});
    }
    host.remove();
    return {styleChecks,boards};
  },{registered,relationships:styleRelationships});

  const out=join(outRoot,'style-comparisons');
  await renderBoards(page,out,result.boards,{background:'#fffaf6',subtitle:'同一 face / hair / outfit / expression 配置 · 只改变 pack'});
  const report={registeredPacks:registered.map(item=>item.id),styleChecks:result.styleChecks,boards:result.boards.length};
  await writeFile(join(out,'review.json'),JSON.stringify(report,null,2));
  return report;
}

export async function auditRegisteredAvatarPacks(page,outRoot='review-screenshots/avatar'){
  const registered=await page.evaluate(async()=>{
    const m=await import('/src/avatar/model.ts');
    return m.packOptions.map(({id,label,note})=>({id,label,note}));
  });
  assert.deepEqual(registered.map(item=>item.id),avatarReviewSpecs.map(spec=>spec.id),'Pack registry and review specs are out of sync');
  assert.equal(new Set(registered.map(item=>item.id)).size,registered.length,'Duplicate pack ID in registry');
  await auditSourceIsolation();
  const model=await auditModelContract(page);
  const packs={};
  for(const spec of avatarReviewSpecs)packs[spec.id]=await auditPack(page,outRoot,spec);
  const styles=await auditStyleComparisons(page,outRoot,registered);
  const report={registryOrder:registered.map(item=>item.id),model,packs,styles};
  await writeFile(join(outRoot,'pack-review.json'),JSON.stringify(report,null,2));
  return report;
}
