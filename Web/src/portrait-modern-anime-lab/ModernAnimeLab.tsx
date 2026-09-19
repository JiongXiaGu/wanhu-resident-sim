import {useEffect,useMemo,useRef,useState} from 'react';
import {options,defaults,initialLook,keys,labels,label,parseLook,presets,randomLook,STORAGE,type Key,type Look} from './model';
import {src,portrait,download,exportPng} from './render';
import {skinColors,hairColors,clothColors} from './art/drawing';
import './modern.css';

type Part='face'|'hair'|'headwear'|'outfit'|'expression';
type Proof=Part|'pairs';
const parts:Part[]=['face','hair','headwear','outfit','expression'];
function Portrait({look,size,main=false,pixel=false}:{look:Look;size:number;main?:boolean;pixel?:boolean}){
 const image=useMemo(()=>src(look),[look]);
 return <img src={image} width={size} height={size} draggable={false} data-current-portrait={main||undefined} data-native-size={pixel?size:undefined} alt={`${label('frame',look.frame)} · ${label('face',look.face)} · ${label('expression',look.expression)} · ${label('hair',look.hair)} · ${label('headwear',look.headwear)} · ${label('outfit',look.outfit)}`}/>;
}
function Sizes({look}:{look:Look}){return <div className="pm-sizes">{[96,64,48].map(size=><figure key={size}><Portrait look={look} size={size} pixel/><figcaption>{size}<span> px</span></figcaption></figure>)}</div>;}
const proofText:Record<Proof,string>={pairs:'发型与帽饰，可以这样组合。',face:'同样的发型与衣装，不同的人。',hair:'面容不动，只换发型。',headwear:'戴上帽饰，仍然是这个人。',outfit:'同一张脸，换一种衣装。',expression:'还是同一个人，只是心情不同。'};
export default function ModernAnimeLab(){
 const [initial]=useState(initialLook),[look,setLook]=useState<Look>(initial.look);
 const [tab,setTab]=useState<Part>('face'),[proof,setProof]=useState<Proof>('expression');
 const [night,setNight]=useState(false),[locked,setLocked]=useState(true),[message,setMessage]=useState(initial.message),[busy,setBusy]=useState(false);
 const input=useRef<HTMLInputElement>(null),studio=useRef<HTMLElement>(null);
 useEffect(()=>{
  try{localStorage.setItem(STORAGE,JSON.stringify(look));}catch{setMessage('无法本地保存，请导出配方保留组合。');}
  try{const u=new URL(location.href);if(u.searchParams.has('look')){u.searchParams.set('look',JSON.stringify(look));history.replaceState(null,'',u);}}catch{/* 沙箱限制地址更新不影响组合。 */}
 },[look]);
 function choose<K extends Key>(key:K,value:Look[K]){setLook(old=>({...old,[key]:value}));setMessage('');}
 function applyPreset(index:number){setLook({...presets[index].look});setMessage(`已载入「${presets[index].name}」搭配；每个部件仍可独立更换。`);}
 async function png(){setBusy(true);try{await exportPng(look);setMessage('已导出 1024 × 1024 透明 PNG。');}catch(e){setMessage(e instanceof Error?e.message:'导出失败。');}finally{setBusy(false);}}
 async function load(file:File|undefined){if(!file)return;try{if(file.size>8192)throw new Error('配方不能大于 8 KB。');setLook(parseLook(JSON.parse(await file.text())));setMessage('已导入现代国风配方。');}catch(e){setMessage(e instanceof Error?e.message:'配方无效，当前人物未改变。');}finally{if(input.current)input.current.value='';}}
 async function share(){const u=new URL(location.href);u.searchParams.set('view','portrait-modern-anime-lab');u.searchParams.set('look',JSON.stringify(look));try{await navigator.clipboard.writeText(u.toString());setMessage('组合链接已复制。');}catch{download(new Blob([u.toString()],{type:'text/plain;charset=utf-8'}),'wanhu-modern-link.txt');setMessage('剪贴板不可用，已导出组合链接。');}}
 const items=useMemo(()=>proof==='pairs'?options.hair.flatMap(hair=>options.headwear.map(hat=>({name:`${hair.label} · ${hat.label}`,look:{...look,hair:hair.id,headwear:hat.id}}))):options[proof].map(item=>({name:item.label,look:{...look,[proof]:item.id} as Look})),[look,proof]);
 const color=(key:'skin'|'hairColor'|'palette',id:string)=>key==='skin'?skinColors[id as Look['skin']].base:key==='hairColor'?hairColors[id as Look['hairColor']].base:clothColors[id as Look['palette']].base;
 return <main className="pm-root" data-modern data-look={JSON.stringify(look)} data-theme={night?'night':'paper'}>
  <header className="pm-header"><a className="pm-brand" href="/">万户天工<span>居民人物研究</span></a><nav aria-label="画风页面"><a href="/?view=portrait-anime-lab">上一版二次元</a><a href="/?view=portrait-composer-lab">原版 DIY</a><span>现代国风</span></nav></header>
  <section className="pm-intro"><div><p className="pm-eyebrow">WANHU · MODERN ANIME ATELIER</p><h1>古意新绘<span>，</span>各有神采。</h1><p>以现代二游人物语言重新绘制面容、发束与衣装。不是旧头像放大眼睛，也不绑定一张整图。</p></div><div className="pm-edition">人物画风候选<span>原版保留 · 尚未替换正式居民</span></div></section>
  <section className="pm-showcase" aria-label="三组设计搭配" data-showcase>{presets.map((preset,index)=><article className={`pm-design pm-design-${index}`} key={preset.name} data-design={index}><div className="pm-design-top"><span>0{index+1}</span><span>原创人物搭配</span></div><div className="pm-design-art"><Portrait look={preset.look} size={360}/></div><div className="pm-design-caption"><div><h2>{preset.name}</h2><p>{preset.subtitle}</p></div><button type="button" data-preset={index} onClick={()=>{applyPreset(index);studio.current?.scrollIntoView({behavior:'auto',block:'start'});}}>用这组开始 <span aria-hidden="true">↗</span></button></div></article>)}</section>
  <p className="pm-context">三组是同一新画风下的搭配示范，不是三套独立画风。下方仍能换脸、换装和切换表情。</p>
  <section className="pm-studio" ref={studio} aria-label="现代国风人物编辑" data-studio>
   <aside className="pm-controls"><div className="pm-section-title"><span>01 / IDENTITY & WARDROBE</span><h2>自由搭配</h2></div>
    <div className="pm-frame" role="group" aria-label="人物类型">{options.frame.map(item=><button type="button" key={item.id} data-key="frame" data-choice={item.id} aria-pressed={look.frame===item.id} onClick={()=>choose('frame',item.id)}>{item.label}</button>)}</div>
    <div className="pm-tabs" role="group" aria-label="编辑部件">{parts.map(part=><button type="button" key={part} data-tab={part} aria-pressed={tab===part} onClick={()=>setTab(part)}>{labels[part]}</button>)}</div>
    <div className="pm-options" role="group" aria-label={labels[tab]}>{options[tab].map(item=><button type="button" className="pm-option" key={item.id} data-key={tab} data-choice={item.id} aria-pressed={look[tab]===item.id} onClick={()=>choose(tab,item.id)}><Portrait look={{...look,[tab]:item.id}} size={88}/><span>{item.label}</span></button>)}</div>
    <div className="pm-palettes">{(['skin','hairColor','palette'] as const).map(key=><fieldset key={key}><legend>{labels[key]}<span>{label(key,look[key])}</span></legend><div>{options[key].map(item=><button type="button" key={item.id} data-key={key} data-choice={item.id} className="pm-swatch" style={{backgroundColor:color(key,item.id)}} aria-label={`${labels[key]}：${item.label}`} aria-pressed={look[key]===item.id} onClick={()=>choose(key,item.id)}>{look[key]===item.id?'✓':''}</button>)}</div></fieldset>)}</div>
    <div className="pm-random"><label><input type="checkbox" data-locked checked={locked} onChange={event=>setLocked(event.currentTarget.checked)}/>保留面容与表情</label><button type="button" data-random onClick={()=>{setLook(old=>randomLook(old,crypto.getRandomValues(new Uint32Array(1))[0],locked));setMessage(locked?'已随机搭配衣装，面容与表情保留。':'已生成新组合。');}}>随机搭配</button></div>
   </aside>
   <div className="pm-preview"><div className="pm-preview-top"><span>02 / PORTRAIT</span><div role="group" aria-label="预览衬底"><button type="button" data-background="paper" aria-pressed={!night} onClick={()=>setNight(false)}>纸白</button><button type="button" data-background="night" aria-pressed={night} onClick={()=>setNight(true)}>暮色</button></div></div>
    <div className="pm-current"><Portrait look={look} size={430} main/></div>
    <div className="pm-caption"><h2>{label('face',look.face)}<span> / {label('expression',look.expression)}</span></h2><p>{label('hair',look.hair)} · {label('headwear',look.headwear)} · {label('outfit',look.outfit)}</p></div>
    <div className="pm-primary-actions"><button type="button" data-export="png" disabled={busy} onClick={png}>{busy?'正在导出…':'导出透明 PNG'}</button><button type="button" data-export="svg" onClick={()=>download(new Blob([portrait(look)],{type:'image/svg+xml'}),'wanhu-modern-anime.svg')}>SVG</button></div>
   </div>
   <aside className="pm-detail"><div className="pm-section-title"><span>03 / AT ACTUAL SIZE</span><h2>回到游戏尺寸</h2></div><Sizes look={look}/><div className="pm-detail-note"><h3>换的是衣装，不是身份。</h3><p>面容拥有独立轮廓与眼型，表情不改变脸型。帽饰不修改发型 ID，摘下幞头会恢复原发髻。</p><p>细发丝与刺绣主要服务近景；48 px 仍应以脸形、发型剪影和衣装色块为主。</p><p>目前为成年人、六套表情预设。不是自由捏脸或已完成的 Unity 资产库。</p></div><details><summary>当前组合参数</summary><dl>{keys.map(key=><div key={key}><dt>{labels[key]}</dt><dd>{look[key]}</dd></div>)}</dl></details></aside>
  </section>
  <div className="pm-savebar"><p role="status" aria-live="polite" data-feedback>{message||'组合自动保存在此浏览器。与旧版 DIY 和表情实验的存储互不覆盖。'}</p><div><button type="button" data-export="json" onClick={()=>download(new Blob([JSON.stringify(look,null,2)],{type:'application/json'}),'wanhu-modern-anime.json')}>导出配方</button><button type="button" onClick={()=>input.current?.click()}>导入配方</button><input type="file" ref={input} data-import hidden accept=".json,application/json" onChange={event=>{void load(event.currentTarget.files?.[0]);}}/><button type="button" data-share onClick={share}>复制链接</button><button type="button" data-reset onClick={()=>{setLook({...defaults});setMessage('已恢复默认现代国风组合。');}}>重置</button></div></div>
  <section className="pm-proof" data-proof-mode={proof}><header><div><p className="pm-eyebrow">ONE IDENTITY / SHARED PARTS</p><h2>{proofText[proof]}</h2></div><div role="group" aria-label="组合对照">{parts.map(part=><button type="button" key={part} data-proof={part} aria-pressed={proof===part} onClick={()=>setProof(part)}>{part==='face'?'不同面容':part==='expression'?'同脸表情':`共享${labels[part]}`}</button>)}<button type="button" data-proof="pairs" aria-pressed={proof==='pairs'} onClick={()=>setProof('pairs')}>发型 × 帽饰</button></div></header><div className="pm-proof-grid">{items.map((item,index)=><article key={`${proof}-${index}`} data-proof-item data-item-look={JSON.stringify(item.look)}><Portrait look={item.look} size={200}/><h3>{item.name}</h3>{(proof==='face'||proof==='expression')&&<Sizes look={item.look}/>}<button type="button" data-use={proof==='pairs'?`${item.look.hair}-${item.look.headwear}`:item.look[proof]} onClick={()=>proof==='pairs'?setLook({...item.look}):choose(proof,item.look[proof])}>使用{proof==='pairs'?'这组搭配':labels[proof]}</button></article>)}</div></section>
  <footer className="pm-footer"><p>新绘独立资产 · 固定正面画布 · 面容 / 表情 / 发型 / 帽饰 / 服装分层</p><p>画风仍待玩家确认。未移用《原神》《鸣潮》的角色、服装图案或游戏资源。</p></footer>
 </main>;
}
