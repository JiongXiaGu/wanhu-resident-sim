import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {fitRecipeToFrame,optionsFor,parts,labels,defaultFor,equalRecipe,parseRecipe,randomRecipe,optionLabel,packLabel,foundationRecipe,type Frame,type Part,type Recipe,type Target} from './model';
import {applyRecipe,getRaw,parseEntry,removeRecipe,useSaved} from './store';
import {AvatarImage,SavedAvatar} from './AvatarImage';
import {downloadFile,downloadPng,renderAvatar} from './render';
import {StudioControls,isReworkedSample} from './studio';
import {filterAssetOptions} from './asset-search';
import './editor.css';
import './asset-search.css';

type Pending={kind:'switch';key:string}|{kind:'close'}|{kind:'restore'};
export default function AvatarEditor({targets,initialKey,onClose}:{targets:Target[];initialKey:string;onClose:(residentId?:number)=>void}) {
 const [key,setKey]=useState(initialKey),[part,setPart]=useState<Part>('face'),[search,setSearch]=useState('');
 const target=targets.find(item=>item.key===key)??targets[0];
 const saved=useSaved(target.key);
 const studio=target.kind==='studio';
 const lastBound=useRef(target.kind==='studio'?targets.find(item=>item.kind==='player')!.key:target.key);
 const [samplesOnly,setSamplesOnly]=useState(false);
 const [assetQuery,setAssetQuery]=useState('');
 const [draft,setDraft]=useState<Recipe>(()=>fitRecipeToFrame(saved.recipe??defaultFor(target),target.frame));
 const [baseline,setBaseline]=useState<Recipe>(()=>fitRecipeToFrame(saved.recipe??defaultFor(target),target.frame));
 const [baselineRaw,setBaselineRaw]=useState<string|null>(saved.raw);
 const [message,setMessage]=useState(saved.error),[pending,setPending]=useState<Pending|null>(null),[busy,setBusy]=useState(false),[light,setLight]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),fileInput=useRef<HTMLInputElement>(null),epoch=useRef(0);
 const dirty=!equalRecipe(draft,baseline),conflict=saved.raw!==baselineRaw;
 useEffect(()=>{
  const node=dialog.current;const opener=document.activeElement as HTMLElement|null;
  node?.showModal();
  return ()=>{epoch.current++;node?.close();if(opener?.isConnected)opener.focus();};
 },[]);
 useEffect(()=>{function warn(event:BeforeUnloadEvent){if(dirty){event.preventDefault();event.returnValue='';}}window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 // 二次确认期间让下面的编辑器 inert，并将键盘焦点留在确认区。
 useEffect(()=>{
  if(!pending||!dialog.current)return;
  const node=dialog.current,previous=document.activeElement as HTMLElement|null;
  const blocks=[...node.querySelectorAll<HTMLElement>('.av-header,.av-layout,.av-footer')];
  blocks.forEach(block=>block.setAttribute('inert',''));
  const buttons=[...node.querySelectorAll<HTMLButtonElement>('.av-pending button')];buttons[0]?.focus();
  function trap(event:KeyboardEvent){
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setPending(null);return;}
   if(event.key!=='Tab'||!buttons.length)return;
   const first=buttons[0],last=buttons[buttons.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
  node.addEventListener('keydown',trap,true);
  return()=>{blocks.forEach(block=>block.removeAttribute('inert'));node.removeEventListener('keydown',trap,true);if(previous?.isConnected)previous.focus();};
 },[pending]);
 function choose<K extends Part>(selected:K,value:Recipe[K]){setDraft(old=>({...old,[selected]:value}));setMessage('');}
 function reload(){epoch.current++;const next=fitRecipeToFrame(saved.recipe??defaultFor(target),target.frame);setDraft(next);setBaseline(next);setBaselineRaw(saved.raw);setMessage(saved.error||'已重新载入这个对象的头像。');}
 function save():boolean {
  try{applyRecipe(target.key,draft,baselineRaw);setBaseline({...draft});setBaselineRaw(getRaw(target.key));setMessage(studio?`已保存「${target.name}」。其他样板与城市居民未改变。`:`已应用到「${target.name}」。其他对象未改变。`);return true;}
  catch(error){setMessage(error instanceof Error?error.message:'保存失败。草稿仍保留，未假装保存成功。');return false;}
 }
 function finish(action:Pending){
  setPending(null);epoch.current++;
  if(action.kind==='switch'){
   const next=targets.find(item=>item.key===action.key);
   if(!next){setMessage('这个对象已不在当前城市中。');return;}
   if(next.kind!=='studio')lastBound.current=next.key;
   let raw:string|null=null,warning='';
   try{raw=getRaw(next.key);}catch{warning='无法读取本地保存；当前只可预览或导出。';}
   const entry=parseEntry(raw),nextRecipe=fitRecipeToFrame(entry.recipe??defaultFor(next),next.frame);
   // 同一事件中批量提交目标、草稿与基线。不能等 useEffect 再把上一人的脸换掉。
   setKey(next.key);setAssetQuery('');setDraft(nextRecipe);setBaseline(nextRecipe);setBaselineRaw(raw);setMessage(warning||entry.error);
   return;
  }
  if(action.kind==='close'){onClose(target.residentId);return;}
  try{removeRecipe(target.key,baselineRaw);setBaselineRaw(null);const initial=defaultFor(target);setDraft(initial);setBaseline(initial);setMessage(target.kind==='resident'?'已移除此居民的定制记录，游戏恢复原头像。下方是尚未应用的新素材预览。':studio?'此框架已恢复默认样板。':'此玩家档案已恢复默认头像。');}
  catch(error){setMessage(error instanceof Error?error.message:'恢复失败。');}
 }
 function request(action:Pending){if(action.kind==='restore'||dirty)setPending(action);else finish(action);}
 async function importFile(file:File|undefined){
  if(!file)return;const token=++epoch.current;
  try{if(file.size>8192)throw new Error('配方文件不能超过 8 KB。');const parsed=parseRecipe(JSON.parse(await file.text())),next=fitRecipeToFrame(parsed,target.frame);if(token!==epoch.current)return;setDraft(next);setMessage(equalRecipe(parsed,next)?'配方已载入预览。点击应用才会保存到当前对象。':'配方已载入，并按当前年龄 / 性别映射到可用素材。点击应用才会保存。');}
  catch(error){if(token===epoch.current)setMessage(error instanceof Error?error.message:'配方无法读取。');}
  finally{if(fileInput.current)fileInput.current.value='';}
 }
 async function png(){setBusy(true);const token=epoch.current;try{await downloadPng(target.frame,draft);if(token===epoch.current)setMessage('已导出当前预览的 640px 透明 PNG。');}catch(error){if(token===epoch.current)setMessage(error instanceof Error?error.message:'导出失败。');}finally{setBusy(false);}}
 function switchFrame(frame:Frame){
  const next=targets.find(item=>item.kind==='studio'&&item.frame===frame);
  if(next&&next.key!==target.key)request({kind:'switch',key:next.key});
 }
 const studioTarget=targets.find(item=>item.kind==='studio'&&item.frame===target.frame)!;
 const available=optionsFor(draft.pack,part,target.frame);
 const filteredOptions=samplesOnly?available.filter(item=>isReworkedSample(part,item.id)):available;
 const visibleOptions=filterAssetOptions(filteredOptions,assetQuery);
 const selectedOption=available.find(item=>item.id===draft[part]);
 function randomPart(){
  const candidates=visibleOptions.filter(item=>item.id!==draft[part]);
  if(candidates.length){const index=crypto.getRandomValues(new Uint32Array(1))[0]%candidates.length;choose(part,candidates[index].id);}
 }
 function randomWardrobe(){
  if(!samplesOnly){setDraft(old=>randomRecipe(crypto.getRandomValues(new Uint32Array(1))[0],old,target.frame));}
  else setDraft(old=>{
   const next={...old};
   for(const field of ['hair','outfit'] as const){const pool=optionsFor(old.pack,field,target.frame).filter(item=>isReworkedSample(field,item.id));if(pool.length)next[field]=pool[crypto.getRandomValues(new Uint32Array(1))[0]%pool.length].id;}
   return next;
  });
  setMessage('只随机更换头发和衣服，保留脸型与表情。');
 }
 const shown=targets.filter(item=>item.kind==='resident'&&(`${item.name} ${item.detail} ${item.residentId}`).includes(search.trim()));
 return createPortal(<dialog ref={dialog} className="av-dialog" aria-labelledby="av-title" onCancel={event=>{event.preventDefault();if(pending)setPending(null);else request({kind:'close'});}}>
  <div className="av-root" data-avatar-editor data-target={target.key} data-frame={target.frame} data-recipe={JSON.stringify(draft)} data-dirty={dirty} data-conflict={conflict} data-editor-context={studio?'studio':'bound'}>
   <header className="av-header"><div><p>WANHU / AVATAR WORKSHOP</p><h1 id="av-title">头像工坊</h1></div><span className="av-header-note">脸型 · 头发 · 衣服 · 表情</span><button type="button" data-close-editor onClick={()=>request({kind:'close'})} aria-label="关闭头像工坊">×</button></header>
   <div className="av-layout">
    <aside className="av-targets">
     <div className="av-context-modes" role="group" aria-label="编辑上下文"><button type="button" data-editor-mode="studio" aria-pressed={studio} onClick={()=>{if(!studio)request({kind:'switch',key:studioTarget.key});}}>自由创作</button><button type="button" data-editor-mode="bound" aria-pressed={!studio} onClick={()=>{if(studio)request({kind:'switch',key:lastBound.current});}}>指定对象</button></div>
     {studio&&<StudioControls frame={target.frame} onFrame={switchFrame} onReset={()=>{setDraft(foundationRecipe(target.frame));setMessage('日常样板已载入预览，保存后才会更新此样板。');}}/>}
     <div className="av-bound-targets" hidden={studio}>
      <div className="av-section-heading"><h2>为谁编辑</h2><span>身份保持不变</span></div>
      <p className="av-group-label">玩家示例档案</p><div className="av-player-targets">{targets.filter(item=>item.kind==='player').map(item=><TargetButton key={item.key} target={item} selected={target.key===item.key} onClick={()=>request({kind:'switch',key:item.key})}/>)}</div>
      <div className="av-group-row"><p className="av-group-label">城市居民</p><span>{targets.filter(item=>item.kind==='resident').length} 人</span></div>
      <input className="av-search" data-target-search type="search" aria-label="搜索居民" placeholder="姓名或居民编号" value={search} onChange={event=>setSearch(event.currentTarget.value)}/>
      <div className="av-resident-targets">{shown.map(item=><TargetButton key={item.key} target={item} selected={target.key===item.key} onClick={()=>request({kind:'switch',key:item.key})}/>)}{shown.length===0&&<p className="av-empty">没有匹配的居民。</p>}</div>
      <p className="av-binding-note">此处只编辑外观。需要换年龄、性别，请切到自由创作。</p>
     </div>
    </aside>
    <section className="av-preview"><div className="av-section-heading"><h2>{target.name}</h2><button type="button" data-preview-light aria-pressed={light} onClick={()=>setLight(value=>!value)}>{light?'浅色衬底':'深色衬底'}</button></div><p className="av-target-detail">{target.detail}</p>
     <div className="av-main-art" data-preview-theme={light?'light':'dark'}><AvatarImage frame={target.frame} recipe={draft} size={320}/></div>
     <p className="av-look-label">{optionLabel(draft.pack,'face',draft.face)} <span>/</span> {optionLabel(draft.pack,'expression',draft.expression)}</p>
     <p className="av-preview-status">{dirty?'正在预览 · 尚未保存':saved.recipe?(studio?'此框架已保存的样板':'已应用的外观'):studio?'自由创作样板 · 尚未保存':target.kind==='resident'?'新素材预览 · 应用后替换原头像':'玩家默认外观'}</p>
     <div className="av-sizes">{[96,64,48].map(size=><figure key={size}><AvatarImage frame={target.frame} recipe={draft} size={size} native/><figcaption>{size} px</figcaption></figure>)}</div>
     <div className="av-export"><button type="button" data-export="png" disabled={busy} onClick={png}>导出 PNG</button><button type="button" data-export="svg" onClick={()=>downloadFile(new Blob([renderAvatar(target.frame,draft)],{type:'image/svg+xml'}),'wanhu-avatar.svg')}>导出 SVG</button></div>
    </section>
    <section className="av-choices"><div className="av-section-heading"><h2>选择部件</h2><span>{packLabel(draft.pack)}</span></div>
     <div className="av-tabs" role="group" aria-label="头像部件">{parts.map(item=><button type="button" key={item} data-part-tab={item} aria-pressed={part===item} onClick={()=>{setPart(item);setAssetQuery('');}}>{labels[item]}</button>)}</div>
     <div className="av-options-toolbar"><button type="button" data-sample-only aria-pressed={samplesOnly} onClick={()=>setSamplesOnly(value=>!value)}>{samplesOnly?'仅已重画':'全部素材'}</button><span data-asset-result-count aria-live="polite">{visibleOptions.length} 项</span><button type="button" data-random-part disabled={!visibleOptions.some(item=>item.id!==draft[part])} onClick={randomPart}>随机本类</button></div>
     <div className="av-asset-search"><input className="av-search" data-asset-search type="search" aria-label="搜索当前分类素材" placeholder="名称、描述、关键词或素材 ID" value={assetQuery} onChange={event=>setAssetQuery(event.currentTarget.value)}/>{assetQuery&&<button type="button" data-clear-asset-search aria-label="清除素材搜索" onClick={()=>setAssetQuery('')}>清除</button>}</div>
     <div className="av-asset-description" data-asset-description><strong>{selectedOption?.label}</strong><p>{selectedOption?.description}</p><small>{selectedOption?.id}</small></div>
     {visibleOptions.length===0&&<div className="av-empty" data-asset-empty><p>当前分类和筛选下没有匹配素材，头像选择没有改变。</p><button type="button" data-reset-asset-filters onClick={()=>{setAssetQuery('');setSamplesOnly(false);}}>清除搜索与筛选</button></div>}
     <div className="av-option-grid" role="group" aria-label={labels[part]}>{visibleOptions.map(item=><button type="button" key={item.id} data-option={item.id} data-option-part={part} className="av-option" title={item.description} aria-pressed={draft[part]===item.id} onClick={()=>choose(part,item.id)}><AvatarImage frame={target.frame} recipe={{...draft,[part]:item.id}} size={112}/><span>{item.label}</span><small>{item.note??'表情样板'}</small>{item.tags?.includes('8D1')?<em>本批新增</em>:isReworkedSample(part,item.id)&&<em>已重画</em>}<i aria-hidden="true">{draft[part]===item.id?'✓':''}</i></button>)}</div>
     <p className="av-choice-note">更换{labels[part]}时保留其他选择。搜索仅筛选当前分类，可搜「8D1」「常服」「劳作」「商铺」「行旅」查看新增。随机本类遵守搜索；下方随机搭配不受搜索影响。新增与已重画标记均不表示最终定稿。</p>
     <button className="av-random" type="button" data-random-outfit onClick={randomWardrobe}>随机搭配头发与衣服</button>
     <details className="av-tools"><summary>配方与部件审查</summary><div className="av-tools-actions"><button type="button" data-export="json" onClick={()=>downloadFile(new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),'wanhu-avatar.json')}>导出配方</button><button type="button" onClick={()=>fileInput.current?.click()}>导入配方</button><input ref={fileInput} data-import-recipe type="file" accept=".json,application/json" hidden onChange={event=>{void importFile(event.currentTarget.files?.[0]);}}/></div><p>导入只改当前预览，不携带居民编号，也不自动应用。</p><pre>{JSON.stringify(draft,null,2)}</pre></details>
    </section>
   </div>
   <footer className="av-footer"><div><p role="status" aria-live="polite" data-editor-message>{message||(dirty?'有未保存的修改。':studio?'仅保存当前年龄 / 性别样板，不会改变城市居民。':'应用只写入当前对象，不会影响其他居民。')}</p>{conflict&&<div className="av-conflict" role="alert">已检测到外部修改。<button type="button" data-reload-saved onClick={reload}>重新载入已保存头像</button></div>}</div><div className="av-save-actions"><button type="button" data-restore-avatar disabled={!saved.raw} onClick={()=>request({kind:'restore'})}>{studio?'恢复默认样板':'恢复原头像'}</button><button type="button" data-cancel-draft disabled={!dirty} onClick={()=>{epoch.current++;setDraft({...baseline});setMessage('已撤销本次未保存修改。');}}>撤销修改</button><button type="button" data-apply-avatar className="av-apply" onClick={save}>{studio?'保存此样板':target.kind==='player'?'应用到此玩家档案':'应用到此居民'}</button></div></footer>
   {pending&&<section className="av-pending" role="alertdialog" aria-modal="true" aria-labelledby="av-pending-title"><div><h2 id="av-pending-title">{pending.kind==='restore'?(studio?'恢复此框架的默认样板？':'恢复这个对象的原头像？'):'当前修改还没有保存'}</h2><p>{pending.kind==='restore'?'只移除当前对象的定制记录，不影响其他样板、玩家或居民。':'继续编辑、应用后继续，或放弃这次草稿。'}</p><div><button type="button" data-pending-stay onClick={()=>setPending(null)}>继续编辑</button><button type="button" data-pending-discard onClick={()=>finish(pending)}>{pending.kind==='restore'?(studio?'恢复默认样板':'恢复原头像'):'放弃修改并继续'}</button>{pending.kind!=='restore'&&<button type="button" data-pending-apply onClick={()=>{if(save())finish(pending);}}>{studio?'保存后继续':'应用后继续'}</button>}</div></div></section>}
  </div>
 </dialog>,document.body);
}
function TargetButton({target,selected,onClick}:{target:Target;selected:boolean;onClick:()=>void}){
 const saved=useSaved(target.key);
 return <button type="button" className="av-target" data-target-key={target.key} data-target-kind={target.kind} data-target-frame={target.frame} data-target-resident={target.residentId} aria-pressed={selected} onClick={onClick}><SavedAvatar target={target}/><span><b>{target.name}</b><small>{target.detail}</small></span><i title={saved.recipe?'已定制':'未定制'}>{saved.recipe?'●':''}</i></button>;
}
