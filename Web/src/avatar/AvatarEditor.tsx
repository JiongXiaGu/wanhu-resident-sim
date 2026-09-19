import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {options,parts,labels,defaultFor,equalRecipe,parseRecipe,randomRecipe,optionLabel,type Part,type Recipe,type Target} from './model';
import {applyRecipe,getRaw,removeRecipe,useSaved} from './store';
import {AvatarImage,SavedAvatar} from './AvatarImage';
import {downloadFile,downloadPng,renderAvatar} from './render';
import './editor.css';

type Pending={kind:'switch';key:string}|{kind:'close'}|{kind:'restore'};
export default function AvatarEditor({targets,initialKey,onClose}:{targets:Target[];initialKey:string;onClose:(residentId?:number)=>void}) {
 const [key,setKey]=useState(initialKey),[part,setPart]=useState<Part>('face'),[search,setSearch]=useState('');
 const target=targets.find(item=>item.key===key)??targets[0];
 const saved=useSaved(target.key);
 const [draft,setDraft]=useState<Recipe>(()=>saved.recipe??defaultFor(target));
 const [baseline,setBaseline]=useState<Recipe>(()=>saved.recipe??defaultFor(target));
 const [baselineRaw,setBaselineRaw]=useState<string|null>(saved.raw);
 const [message,setMessage]=useState(saved.error),[pending,setPending]=useState<Pending|null>(null),[busy,setBusy]=useState(false),[light,setLight]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),fileInput=useRef<HTMLInputElement>(null),epoch=useRef(0);
 const dirty=!equalRecipe(draft,baseline),conflict=saved.raw!==baselineRaw;
 useEffect(()=>{
  const node=dialog.current;const opener=document.activeElement as HTMLElement|null;
  node?.showModal();
  return ()=>{epoch.current++;node?.close();if(opener?.isConnected)opener.focus();};
 },[]);
 // 切目标时不复用上一人的草稿。换对象前的未保存处理在 request() 内完成。
 useEffect(()=>{epoch.current++;setDraft(saved.recipe??defaultFor(target));setBaseline(saved.recipe??defaultFor(target));setBaselineRaw(saved.raw);setMessage(saved.error);},[target.key]);
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
 function reload(){epoch.current++;setDraft(saved.recipe??defaultFor(target));setBaseline(saved.recipe??defaultFor(target));setBaselineRaw(saved.raw);setMessage(saved.error||'已重新载入这个对象的头像。');}
 function save():boolean {
  try{applyRecipe(target.key,draft,baselineRaw);setBaseline({...draft});setBaselineRaw(getRaw(target.key));setMessage(`已应用到「${target.name}」。其他对象未改变。`);return true;}
  catch(error){setMessage(error instanceof Error?error.message:'保存失败。草稿仍保留，未假装保存成功。');return false;}
 }
 function finish(action:Pending){
  setPending(null);epoch.current++;
  if(action.kind==='switch'){setKey(action.key);return;}
  if(action.kind==='close'){onClose(target.residentId);return;}
  try{removeRecipe(target.key,baselineRaw);setBaselineRaw(null);const initial=defaultFor(target);setDraft(initial);setBaseline(initial);setMessage(target.kind==='resident'?'已移除此居民的定制记录，游戏恢复原头像。下方是尚未应用的新素材预览。':'此玩家档案已恢复默认头像。');}
  catch(error){setMessage(error instanceof Error?error.message:'恢复失败。');}
 }
 function request(action:Pending){if(action.kind==='restore'||dirty)setPending(action);else finish(action);}
 async function importFile(file:File|undefined){
  if(!file)return;const token=++epoch.current;
  try{if(file.size>8192)throw new Error('配方文件不能超过 8 KB。');const next=parseRecipe(JSON.parse(await file.text()));if(token!==epoch.current)return;setDraft(next);setMessage('配方已载入预览。点击应用才会保存到当前对象。');}
  catch(error){if(token===epoch.current)setMessage(error instanceof Error?error.message:'配方无法读取。');}
  finally{if(fileInput.current)fileInput.current.value='';}
 }
 async function png(){setBusy(true);const token=epoch.current;try{await downloadPng(target.frame,draft);if(token===epoch.current)setMessage('已导出当前预览的 640px 透明 PNG。');}catch(error){if(token===epoch.current)setMessage(error instanceof Error?error.message:'导出失败。');}finally{setBusy(false);}}
 const shown=targets.filter(item=>item.kind==='resident'&&(`${item.name} ${item.detail} ${item.residentId}`).includes(search.trim()));
 return createPortal(<dialog ref={dialog} className="av-dialog" aria-labelledby="av-title" onCancel={event=>{event.preventDefault();if(pending)setPending(null);else request({kind:'close'});}}>
  <div className="av-root" data-avatar-editor data-target={target.key} data-frame={target.frame} data-recipe={JSON.stringify(draft)} data-dirty={dirty} data-conflict={conflict}>
   <header className="av-header"><div><p>WANHU / AVATAR WORKSHOP</p><h1 id="av-title">头像工坊</h1></div><span className="av-header-note">脸型 · 头发 · 衣服 · 表情</span><button type="button" data-close-editor onClick={()=>request({kind:'close'})} aria-label="关闭头像工坊">×</button></header>
   <div className="av-layout">
    <aside className="av-targets"><div className="av-section-heading"><h2>为谁编辑</h2><span>每人独立保存</span></div>
     <p className="av-group-label">玩家示例档案</p><div className="av-player-targets">{targets.filter(item=>item.kind==='player').map(item=><TargetButton key={item.key} target={item} selected={target.key===item.key} onClick={()=>request({kind:'switch',key:item.key})}/>)}</div>
     <div className="av-group-row"><p className="av-group-label">城市居民</p><span>{targets.filter(item=>item.kind==='resident').length} 人</span></div>
     <input className="av-search" data-target-search type="search" aria-label="搜索居民" placeholder="姓名或居民编号" value={search} onChange={event=>setSearch(event.currentTarget.value)}/>
     <div className="av-resident-targets">{shown.map(item=><TargetButton key={item.key} target={item} selected={target.key===item.key} onClick={()=>request({kind:'switch',key:item.key})}/>)}{shown.length===0&&<p className="av-empty">没有匹配的居民。</p>}</div>
    </aside>
    <section className="av-preview"><div className="av-section-heading"><h2>{target.name}</h2><button type="button" data-preview-light aria-pressed={light} onClick={()=>setLight(value=>!value)}>{light?'浅色衬底':'深色衬底'}</button></div><p className="av-target-detail">{target.detail}</p>
     <div className="av-main-art" data-preview-theme={light?'light':'dark'}><AvatarImage frame={target.frame} recipe={draft} size={320}/></div>
     <p className="av-look-label">{optionLabel('face',draft.face)} <span>/</span> {optionLabel('expression',draft.expression)}</p>
     <p className="av-preview-status">{dirty?'正在预览 · 尚未保存':saved.recipe?'已应用的外观':target.kind==='resident'?'新素材预览 · 应用后替换原头像':'玩家默认外观'}</p>
     <div className="av-sizes">{[96,64,48].map(size=><figure key={size}><AvatarImage frame={target.frame} recipe={draft} size={size} native/><figcaption>{size} px</figcaption></figure>)}</div>
     <div className="av-export"><button type="button" data-export="png" disabled={busy} onClick={png}>导出 PNG</button><button type="button" data-export="svg" onClick={()=>downloadFile(new Blob([renderAvatar(target.frame,draft)],{type:'image/svg+xml'}),'wanhu-avatar.svg')}>导出 SVG</button></div>
    </section>
    <section className="av-choices"><div className="av-section-heading"><h2>选择部件</h2><span>日常线绘 / v1</span></div><div className="av-tabs" role="group" aria-label="头像部件">{parts.map(item=><button type="button" key={item} data-part-tab={item} aria-pressed={part===item} onClick={()=>setPart(item)}>{labels[item]}</button>)}</div>
     <div className="av-option-grid" role="group" aria-label={labels[part]}>{options[part].map(item=><button type="button" key={item.id} data-option={item.id} data-option-part={part} className="av-option" aria-pressed={draft[part]===item.id} onClick={()=>choose(part,item.id)}><AvatarImage frame={target.frame} recipe={{...draft,[part]:item.id}} size={112}/><span>{item.label}</span><i aria-hidden="true">{draft[part]===item.id?'✓':''}</i></button>)}</div>
     <p className="av-choice-note">更换{labels[part]}，保留其他选择。男女和年龄由当前对象提供，不改居民身份数据。</p>
     <button className="av-random" type="button" data-random-outfit onClick={()=>{setDraft(old=>randomRecipe(crypto.getRandomValues(new Uint32Array(1))[0],old));setMessage('只随机更换头发和衣服，保留脸型与表情。');}}>随机搭配头发与衣服</button>
     <details className="av-tools"><summary>配方与部件审查</summary><div className="av-tools-actions"><button type="button" data-export="json" onClick={()=>downloadFile(new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),'wanhu-avatar.json')}>导出配方</button><button type="button" onClick={()=>fileInput.current?.click()}>导入配方</button><input ref={fileInput} data-import-recipe type="file" accept=".json,application/json" hidden onChange={event=>{void importFile(event.currentTarget.files?.[0]);}}/></div><p>导入只改当前预览，不携带居民编号，也不自动应用。</p><pre>{JSON.stringify(draft,null,2)}</pre></details>
    </section>
   </div>
   <footer className="av-footer"><div><p role="status" aria-live="polite" data-editor-message>{message||(dirty?'有未保存的修改。':'应用只写入当前对象，不会影响其他居民。')}</p>{conflict&&<div className="av-conflict" role="alert">已检测到外部修改。<button type="button" data-reload-saved onClick={reload}>重新载入已保存头像</button></div>}</div><div className="av-save-actions"><button type="button" data-restore-avatar disabled={!saved.raw} onClick={()=>request({kind:'restore'})}>恢复原头像</button><button type="button" data-cancel-draft disabled={!dirty} onClick={()=>{epoch.current++;setDraft({...baseline});setMessage('已撤销本次未保存修改。');}}>撤销修改</button><button type="button" data-apply-avatar className="av-apply" onClick={save}>应用到{target.kind==='player'?'此玩家档案':'此居民'}</button></div></footer>
   {pending&&<section className="av-pending" role="alertdialog" aria-modal="true" aria-labelledby="av-pending-title"><div><h2 id="av-pending-title">{pending.kind==='restore'?'恢复这个对象的原头像？':'当前修改还没有保存'}</h2><p>{pending.kind==='restore'?'只移除当前对象的定制记录，不影响其他玩家或居民。':'继续编辑、应用后继续，或放弃这次草稿。'}</p><div><button type="button" data-pending-stay onClick={()=>setPending(null)}>继续编辑</button><button type="button" data-pending-discard onClick={()=>finish(pending)}>{pending.kind==='restore'?'恢复原头像':'放弃修改并继续'}</button>{pending.kind!=='restore'&&<button type="button" data-pending-apply onClick={()=>{if(save())finish(pending);}}>应用后继续</button>}</div></div></section>}
  </div>
 </dialog>,document.body);
}
function TargetButton({target,selected,onClick}:{target:Target;selected:boolean;onClick:()=>void}){
 const saved=useSaved(target.key);
 return <button type="button" className="av-target" data-target-key={target.key} data-target-kind={target.kind} data-target-frame={target.frame} data-target-resident={target.residentId} aria-pressed={selected} onClick={onClick}><SavedAvatar target={target}/><span><b>{target.name}</b><small>{target.detail}</small></span><i title={saved.recipe?'已定制':'未定制'}>{saved.recipe?'●':''}</i></button>;
}
