// Phase 7 的作者层检查。只读真实 SVG，不参与 Runtime 布局，不裁切/修正任何画稿。
export async function auditChibiArtPolish(page){
 return page.evaluate(async()=>{
  const m=await import('/src/avatar/model.ts'),r=await import('/src/avatar/render.ts');
  const {CHIBI_BLUSH_SAFE_ZONE:zone}=await import('/src/avatar/packs/chibi/art-spec.ts');
  const color=await import('/src/avatar/packs/chibi/drawing.ts');
  const require=(ok,message)=>{if(!ok)throw new Error(message);};
  const host=document.createElement('div');
  host.style.cssText='position:absolute;left:-5000px;top:0;width:320px;height:320px';
  document.body.append(host);
  let cases=0,paintedSamples=0,negativeControls=0;
  const check=()=>{
   const root=host.querySelector('svg'),face=host.querySelector('[data-face-surface]');
   const groups=host.querySelectorAll('[data-layer="Expression"] [data-blush]');
   require(face&&groups.length===1,'Blush must have one Expression authoring group and an actual face surface');
   require(!host.querySelector('[data-layer="FaceBase"] [data-blush]')&&!host.querySelector(`[data-layer="FaceBase"] [fill="${color.CHEEK}"]`),'FaceBase duplicated expression blush');
   const shapes=[...groups[0].querySelectorAll('ellipse,path')];
   require(groups[0].querySelectorAll('ellipse').length===2,'Blush must contain exactly two cheek tints');
   for(const shape of shapes){
    const box=shape.getBBox(),halfStroke=Number(shape.getAttribute('stroke-width')??0)/2;
    const toRoot=root.getCTM().inverse().multiply(shape.getCTM());
    const toFace=face.getCTM().inverse().multiply(shape.getCTM());
    const fill=shape.getAttribute('fill')!=='none',stroke=shape.getAttribute('stroke')!=='none'&&halfStroke>0;
    let hits=0;
    for(let x=box.x-halfStroke-.5;x<=box.x+box.width+halfStroke+.5;x+=1){
     for(let y=box.y-halfStroke-.5;y<=box.y+box.height+halfStroke+.5;y+=1){
      const local=new DOMPoint(x,y);
      if(!(fill&&shape.isPointInFill(local))&&!(stroke&&shape.isPointInStroke(local)))continue;
      const point=local.matrixTransform(toRoot),surfacePoint=local.matrixTransform(toFace);
      require([zone.left,zone.right].some(z=>point.x>=z.x&&point.x<=z.x+z.width&&point.y>=z.y&&point.y<=z.y+z.height),'Blush escaped authored safe zone');
      for(const [dx,dy] of [[0,0],[-zone.clearance,0],[zone.clearance,0],[0,-zone.clearance],[0,zone.clearance]]){
       require(face.isPointInFill(new DOMPoint(surfacePoint.x+dx,surfacePoint.y+dy)),'Blush escaped actual face or contour clearance');
      }
      hits++;paintedSamples++;
     }
    }
    require(hits>0,'Blush check sampled no painted geometry');
   }
  };
  const safetyCells=[];
  try{
   for(const frame of m.frames)for(const face of m.optionsFor('chibi-cute-v1','face',frame)){
    const base={...m.recipeForPack('chibi-cute-v1',frame),face:face.id};
    for(const expression of m.optionsFor('chibi-cute-v1','expression',frame)){
     host.innerHTML=r.renderAvatar(frame,{...base,expression:expression.id});
     try{check();}catch(error){throw new Error(`${frame}/${face.id}/${expression.id}: ${error.message}`);}
     cases++;
    }
    const guide=[zone.left,zone.right].map(z=>`<rect x="${z.x}" y="${z.y}" width="${z.width}" height="${z.height}" fill="none" stroke="#357d6a" stroke-width="1.1"/>`).join('');
    safetyCells.push({label:`${frame} / ${face.label} / shy`,svg:r.renderAvatar(frame,{...base,expression:'shy'}).replace('</svg>',guide+'</svg>'),sizes:false});
   }
   // 故意越界的三个负对照必须失败，避免“检查函数存在但没有真的检查”。
   const probe=r.renderAvatar('female.adult',{...m.recipeForPack('chibi-cute-v1','female.adult'),face:'angular',expression:'shy'});
   for(const mutation of ['oversize','outside-face','face-boundary']){
    host.innerHTML=probe;
    const cheek=host.querySelector('[data-blush] ellipse');
    if(mutation==='oversize')cheek.setAttribute('rx','30');
    else if(mutation==='outside-face')cheek.setAttribute('cx','91');
    else host.querySelector('[data-face-surface]').setAttribute('d','M145 180H175V210H145Z');
    let rejected=false;try{check();}catch{rejected=true;}
    require(rejected,`Blush negative control ${mutation} was incorrectly accepted`);negativeControls++;
   }
   const shapeCells=[];
   const looks=[
    ['female.child','child-double-bun','child-short-robe'],['male.child','child-topknot','child-short-robe'],
    ['female.adult','bound','commoner'],['male.adult','bound','commoner'],
    ['female.elder','elder-low-knot','elder-long-robe'],['male.elder','elder-thin-fringe','elder-long-robe'],
   ];
   for(const [frame,hair,outfit] of looks){
    host.innerHTML=r.renderAvatar(frame,{...m.recipeForPack('chibi-cute-v1',frame),face:'round',hair,outfit,expression:'calm'});
    // 诊断图统一发色与衣装配色。不是玩家 skin，也不修改实际资产。
    const hairPalette=new Map([[color.hairColor(frame),'#62584f'],[color.hairDark(frame),'#403a35'],[color.hairLight(frame),'#9b8a79']]);
    for(const item of host.querySelectorAll('[data-layer="BackHair"] *,[data-layer="FrontHair"] *')){
     for(const attr of ['fill','stroke'])if(hairPalette.has(item.getAttribute(attr)))item.setAttribute(attr,hairPalette.get(item.getAttribute(attr)));
    }
    for(const [part,tint] of [['base','#929488'],['collar','#eee0c5'],['overlay','#74796b']]){
     for(const shape of host.querySelectorAll(`[data-chibi-outfit-part="${part}"] [fill]`))if(shape.getAttribute('fill')!=='none')shape.setAttribute('fill',tint);
    }
    shapeCells.push({label:`${frame} · 同脸 / 同表情 / 统一发色衣色`,svg:host.innerHTML,sizes:true});
   }
   return {
    report:{cases,paintedSamples,negativeControls,safeZone:zone,visualApproval:'Manual review of shape comparison and real UI required'},
    boards:[
     {name:'phase7-shape-comparison',title:'Phase 7 · 不靠颜色的男女 / 年龄对照 · 96 / 64 / 48px',columns:2,cells:shapeCells},
     {name:'phase7-blush-safe-zones',title:'Phase 7 · 腮红安全区诊断 · 六 Frame × 全部 Face · shy 最大范围',columns:4,cells:safetyCells},
    ],
   };
  }finally{host.remove();}
 });
}
