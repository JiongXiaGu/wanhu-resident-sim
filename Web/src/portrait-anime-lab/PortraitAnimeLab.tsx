import { useEffect, useMemo, useRef, useState } from 'react';
import { initialLook, keys, label, labels, options, parseLook, randomLook, restore, STORAGE_KEY, isTucked, type Key, type Look } from './model';
import { download, exportPng, imageSource, renderPortrait } from './render';
import { cloths, hairs, skins } from './art/drawing';
import './anime.css';

type Category = 'face' | 'hair' | 'hat' | 'outfit';
type Proof = Category | 'expression' | 'pairs';
const categories: Category[] = ['face', 'hair', 'hat', 'outfit'];
const proofs: { id: Proof; label: string }[] = [{ id: 'expression', label: '同脸 · 八种表情' }, { id: 'face', label: '不同面容' }, { id: 'hair', label: '共享发型' }, { id: 'hat', label: '共享帽饰' }, { id: 'outfit', label: '共享衣服' }, { id: 'pairs', label: '发型 × 帽饰' }];
const paletteKeys = ['skin', 'hairColor', 'cloth'] as const;
function Portrait({ look, size, main = false, pixel = false }: { look: Look; size: number; main?: boolean; pixel?: boolean }) {
  const src = useMemo(() => imageSource(look), [look]);
  return <img src={src} width={size} height={size} draggable={false} data-anime-main={main || undefined} data-anime-pixel={pixel ? size : undefined}
    alt={`${label('frame', look.frame)} · ${label('face', look.face)} · ${label('expression', look.expression)}`} />;
}
function Sizes({ look }: { look: Look }) {
  return <div className="pa-sizes">{[96, 64, 48].map(size => <figure key={size}><Portrait look={look} size={size} pixel /><figcaption>{size} px</figcaption></figure>)}</div>;
}
export default function PortraitAnimeLab() {
  const [start] = useState(restore);
  const [look, setLook] = useState<Look>(start.look);
  const [category, setCategory] = useState<Category>('face');
  const [proof, setProof] = useState<Proof>('expression');
  const [night, setNight] = useState(false);
  const [lock, setLock] = useState(true);
  const [message, setMessage] = useState(start.message);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(look)); }
    catch { setMessage('浏览器禁止本地保存，请导出配方保留当前组合。'); }
    try { const url = new URL(location.href); if (url.searchParams.has('anime')) { url.searchParams.set('anime', JSON.stringify(look)); history.replaceState(null, '', url); } } catch { /* 禁止 history 不影响搭配。 */ }
  }, [look]);
  function choose<K extends Key>(key: K, id: Look[K]) { setLook(previous => ({ ...previous, [key]: id })); setMessage(''); }
  async function png() { setBusy(true); try { await exportPng(look); setMessage('已导出 512 × 512 透明 PNG。'); } catch { setMessage('PNG 导出失败，请重试或导出 SVG。'); } finally { setBusy(false); } }
  async function share() {
    const url = new URL(location.href); url.searchParams.set('view', 'portrait-anime-lab'); url.searchParams.set('anime', JSON.stringify(look));
    try { await navigator.clipboard.writeText(url.toString()); setMessage('已复制组合链接，包含当前表情。'); }
    catch { download(new Blob([url.toString()], { type: 'text/plain;charset=utf-8' }), 'wanhu-anime-link.txt'); setMessage('剪贴板不可用，已导出链接文本。'); }
  }
  async function importRecipe(selected: File | undefined) {
    if (!selected) return;
    try { if (selected.size > 8192) throw new Error('配方文件不能超过 8 KB。'); const parsed = parseLook(JSON.parse(await selected.text())); setLook(parsed); setMessage('人物与表情配方已导入。'); }
    catch (error) { setMessage(error instanceof Error ? error.message : '配方读取失败。'); }
    finally { if (file.current) file.current.value = ''; }
  }
  const proofLooks = useMemo(() => proof === 'pairs'
    ? options.hair.flatMap(hair => options.hat.map(hat => ({ label: `${hair.label} / ${hat.label}`, look: { ...look, hair: hair.id, hat: hat.id } })))
    : options[proof].map(item => ({ label: item.label, look: { ...look, [proof]: item.id } as Look })), [look, proof]);
  function color(key: typeof paletteKeys[number], id: string) {
    return key === 'skin' ? skins[id as Look['skin']].base : key === 'hairColor' ? hairs[id as Look['hairColor']].base : cloths[id as Look['cloth']].base;
  }
  return <main className="pa-root" data-anime-lab data-look={JSON.stringify(look)} data-theme={night ? 'night' : 'paper'}>
    <header className="pa-header"><a href="/" className="pa-brand">万户天工<span>居民头像研究</span></a><nav aria-label="头像实验导航"><a href="/?view=portrait-composer-lab">原版 DIY ↗</a><a href="/?view=portraits">正式头像 ↗</a><span>二次元实验</span></nav></header>
    <section className="pa-intro"><div><p className="pa-eyebrow">ANIME PORTRAITS / EXPRESSIONS & WARDROBE</p><h1>让居民，也有喜怒哀乐。</h1><p>一张脸，八种心情。头发、帽饰与衣服仍然自由搭配。</p></div><div className="pa-badge"><strong>08 面容 · 08 表情</strong><span>成年男女 / 独立美术实验</span></div></section>
    <div className="pa-workspace">
      <section className="pa-panel pa-controls" aria-label="人物和衣装"><div className="pa-panel-title"><h2>人物与搭配</h2><span>01 / IDENTITY</span></div>
        <div className="pa-frame" role="group" aria-label="人物类型">{options.frame.map(item => <button type="button" key={item.id} data-anime-key="frame" data-value={item.id} aria-pressed={look.frame === item.id} onClick={() => choose('frame', item.id)}>{item.label}</button>)}</div>
        <div className="pa-tabs" role="group" aria-label="搭配类别">{categories.map(key => <button type="button" key={key} data-anime-category={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{labels[key]}</button>)}</div>
        <div className="pa-choices" role="group" aria-label={labels[category]}>{options[category].map(item => <button type="button" key={item.id} data-anime-key={category} data-value={item.id} aria-pressed={look[category] === item.id} onClick={() => choose(category, item.id)}><Portrait look={{ ...look, [category]: item.id }} size={94} /><span>{item.label}</span><i aria-hidden="true">{look[category] === item.id ? '✓' : ''}</i></button>)}</div>
        <div className="pa-palettes">{paletteKeys.map(key => <fieldset key={key}><legend>{labels[key]}<span>{label(key, look[key])}</span></legend><div>{options[key].map(item => <button type="button" key={item.id} className="pa-swatch" data-anime-key={key} data-value={item.id} aria-label={`${labels[key]}：${item.label}`} aria-pressed={look[key] === item.id} onClick={() => choose(key, item.id)} style={{ backgroundColor: color(key,item.id) }}><span>{look[key] === item.id ? '✓' : ''}</span></button>)}</div></fieldset>)}</div>
        <div className="pa-random"><label><input type="checkbox" data-anime-lock checked={lock} onChange={event => setLock(event.currentTarget.checked)} />保留面容与表情</label><button type="button" data-anime-random onClick={() => { setLook(previous => randomLook(previous,lock,crypto.getRandomValues(new Uint32Array(1))[0])); setMessage(lock ? '面容、肤色和表情已保留，仅随机换装。' : '已生成新的人物组合。'); }}>随机搭配</button></div>
      </section>
      <section className="pa-panel pa-preview" aria-label="当前头像"><div className="pa-panel-title"><h2>当前人物</h2><div className="pa-theme" role="group" aria-label="衬底"><button type="button" data-anime-theme="paper" aria-pressed={!night} onClick={() => setNight(false)}>纸白</button><button type="button" data-anime-theme="night" aria-pressed={night} onClick={() => setNight(true)}>暮色</button></div></div>
        <div className="pa-main-stage"><Portrait look={look} size={340} main /></div>
        <div className="pa-current"><span>{label('frame',look.frame)}</span><h2>{label('face',look.face)} <em>·</em> {label('expression',look.expression)}</h2><p>{label('hair',look.hair)} / {label('hat',look.hat)} / {label('outfit',look.outfit)}</p></div>
        <Sizes look={look} /><p className="pa-size-note">96 / 64 / 48 CSS px · 按原尺寸显示</p>
        <p className="pa-hat-note" data-anime-wear={isTucked(look) ? 'tucked' : 'open'}>{isTucked(look) ? '戴帽时收起上部发髻；摘帽恢复原发型。' : '表情只改变眉眼与嘴型，不替换整个人物。'}</p>
        <div className="pa-export"><button type="button" data-anime-export="png" disabled={busy} onClick={png}>{busy ? '正在导出…' : '导出透明 PNG'}</button><button type="button" data-anime-export="svg" onClick={() => download(new Blob([renderPortrait(look)], { type: 'image/svg+xml' }), 'wanhu-anime.svg')}>SVG</button></div>
      </section>
      <section className="pa-panel pa-emotions" aria-label="表情选择"><div className="pa-panel-title"><h2>此刻的心情</h2><span>02 / EXPRESSION</span></div><p className="pa-help">选择一套协调的眉眼与嘴型。</p>
        <div className="pa-emotion-grid" role="group" aria-label="八种表情">{options.expression.map(item => <button type="button" key={item.id} data-anime-key="expression" data-value={item.id} aria-pressed={look.expression === item.id} onClick={() => choose('expression', item.id)}><Portrait look={{ ...look, expression: item.id }} size={74} /><span>{item.label}</span></button>)}</div>
        <p className="pa-help pa-expression-note">微笑、张口笑、闭眼笑分别绘制。当前提供八套预设，不开放任意五官拼装。</p>
      </section>
    </div>
    <div className="pa-save"><p role="status" aria-live="polite" data-anime-feedback>{message || '组合自动保存在当前浏览器；与原版 DIY 的存储互不覆盖。'}</p><div><button type="button" data-anime-export="json" onClick={() => download(new Blob([JSON.stringify(look,null,2)],{type:'application/json'}),'wanhu-anime.json')}>导出配方</button><button type="button" onClick={() => file.current?.click()}>导入配方</button><input ref={file} data-anime-import type="file" accept=".json,application/json" hidden onChange={event => { void importRecipe(event.currentTarget.files?.[0]); }} /><button type="button" data-anime-share onClick={share}>复制组合链接</button><button type="button" data-anime-reset onClick={() => { setLook({ ...initialLook }); setMessage('已恢复默认人物。'); }}>重置</button></div></div>
    <section className="pa-proof" data-anime-proof-mode={proof}><div className="pa-proof-heading"><div><p className="pa-eyebrow">ONE IDENTITY / MANY POSSIBILITIES</p><h2>{proof === 'expression' ? '还是这个人，只是心情不同。' : proof === 'face' ? '不同的脸，共享同一套搭配。' : '换上不同搭配，面容和心情不变。'}</h2><p>{proof === 'expression' ? '固定面容、肤色、发型与衣装，只改变表情。' : '仅替换下方标示的选项，其余参数保持一致。'}</p></div><div className="pa-proof-tabs" role="group" aria-label="对照内容">{proofs.map(item => <button type="button" key={item.id} data-anime-proof={item.id} aria-pressed={proof === item.id} onClick={() => setProof(item.id)}>{item.label}</button>)}</div></div>
      <div className="pa-proof-grid">{proofLooks.map((item,index) => <article key={`${proof}-${index}`} data-anime-proof-item data-proof-look={JSON.stringify(item.look)}><div className="pa-proof-art"><Portrait look={item.look} size={184} /></div><h3>{item.label}</h3>{proof === 'expression' || proof === 'face' ? <Sizes look={item.look} /> : null}<button type="button" data-anime-use={proof === 'pairs' ? index : item.look[proof]} onClick={() => { setLook(item.look); setMessage(''); }}>使用这套{proof === 'expression' ? '表情' : '搭配'}</button></article>)}</div>
    </section>
    <details className="pa-recipe"><summary>实验配方与边界</summary><p>成年人验证。表情和帽饰字段只存在于本实验，不改变正式居民 DNA；儿童、老人、游戏情绪驱动与 Unity 导入尚未接入。</p><dl>{keys.map(key => <div key={key}><dt>{labels[key]}</dt><dd>{look[key]}</dd></div>)}</dl></details>
    <footer className="pa-footer"><span>原创矢量资产 / 古代中国服饰语汇 / 赛璐璐分层</span><span>美术研究稿，不代表正式画风已选定</span></footer>
  </main>;
}
