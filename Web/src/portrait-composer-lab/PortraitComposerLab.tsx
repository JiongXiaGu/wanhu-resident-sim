import { useEffect, useMemo, useRef, useState } from 'react';
import { choices, defaultLook, keys, label, labels, parseLook, randomLook, readInitial, STORAGE_KEY, wearMode, type ChoiceKey, type Look } from './model';
import { imageSource, renderPortrait, downloadBlob, exportPng } from './render';
import { skins, hairs, cloths } from './art/drawing';
import './composer.css';

type Category = 'faceFamilyId' | 'hairStyleId' | 'headwearStyleId' | 'outfitStyleId';
type Proof = 'hairStyleId' | 'headwearStyleId' | 'outfitStyleId' | 'pairs' | 'crowd';
const categories: Category[] = ['faceFamilyId', 'hairStyleId', 'headwearStyleId', 'outfitStyleId'];
const proofModes: { id: Proof; label: string }[] = [{ id: 'hairStyleId', label: '同脸换发型' }, { id: 'headwearStyleId', label: '同脸换帽子' }, { id: 'outfitStyleId', label: '同脸换服饰' }, { id: 'pairs', label: '发型 × 帽子' }, { id: 'crowd', label: '24 位居民' }];
const paletteKeys = ['skinPaletteId', 'baseHairColorId', 'outfitPaletteId'] as const;
function Portrait({ look, size, pixel = false, main = false }: { look: Look; size: number; pixel?: boolean; main?: boolean }) {
  const src = useMemo(() => imageSource(look), [look]);
  return <img src={src} alt={`${label('frame', look.frame)} · ${label('faceFamilyId', look.faceFamilyId)} · ${label('hairStyleId', look.hairStyleId)} · ${label('headwearStyleId', look.headwearStyleId)} · ${label('outfitStyleId', look.outfitStyleId)}`}
    width={size} height={size} data-pixel-size={pixel ? size : undefined} data-main-portrait={main ? true : undefined} draggable={false} />;
}
export default function PortraitComposerLab() {
  const [initial] = useState(readInitial);
  const [look, setLook] = useState<Look>(initial.look);
  const [message, setMessage] = useState(initial.message);
  const [category, setCategory] = useState<Category>('hairStyleId');
  const [night, setNight] = useState(false);
  const [lockIdentity, setLockIdentity] = useState(true);
  const [proof, setProof] = useState<Proof>('hairStyleId');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(look)); }
    catch { setMessage('当前浏览器不允许本地保存；仍可导出配方或组合链接。'); }
    // 分享链接只用于初始化；当前地址同步为正在查看的真实配方，刷新不会退回旧配方。
    try { const url = new URL(window.location.href); if (url.searchParams.has('look')) { url.searchParams.set('look', JSON.stringify(look)); window.history.replaceState(null, '', url); } } catch { /* 沙箱禁止 history 时仍可操作。 */ }
  }, [look]);
  function choose<K extends ChoiceKey>(key: K, value: Look[K]) { setLook(previous => ({ ...previous, [key]: value })); setMessage(''); }
  function shuffle() { const seed = crypto.getRandomValues(new Uint32Array(1))[0]; setLook(previous => randomLook(previous, lockIdentity, seed)); setMessage(lockIdentity ? '面容和肤色已保留，只更换发型、帽饰与衣装。' : '已生成当前人物类型的新组合。'); }
  async function share() {
    const url = new URL(window.location.href); url.searchParams.set('view', 'portrait-composer-lab'); url.searchParams.set('look', JSON.stringify(look));
    try { await navigator.clipboard.writeText(url.toString()); setMessage('组合链接已复制。链接不包含图片，只保存选项。'); }
    catch { downloadBlob(new Blob([url.toString()], { type: 'text/plain;charset=utf-8' }), 'wanhu-composer-link.txt'); setMessage('剪贴板不可用，已将组合链接导出为文本。'); }
  }
  async function importRecipe(file: File | undefined) {
    if (!file) return;
    try { if (file.size > 8192) throw new Error('配方文件过大，请选择此页面导出的 JSON。'); const next = parseLook(JSON.parse(await file.text())); setLook(next); setMessage('配方已导入。'); }
    catch (error) { setMessage(error instanceof Error ? error.message : '配方无法读取。'); }
    finally { if (input.current) input.current.value = ''; }
  }
  async function png() { setBusy(true); try { await exportPng(look); setMessage('已导出 512 × 512 透明 PNG。'); } catch (error) { setMessage(error instanceof Error ? error.message : '导出失败。'); } finally { setBusy(false); } }
  const proofItems = useMemo(() => {
    if (proof === 'pairs') return choices.hairStyleId.flatMap(hair => choices.headwearStyleId.map(hat => ({ name: `${hair.label} · ${hat.label}`, look: { ...look, hairStyleId: hair.id, headwearStyleId: hat.id } })));
    if (proof === 'crowd') return Array.from({ length: 24 }, (_, index) => ({ name: `居民 ${String(index + 1).padStart(2, '0')}`, look: randomLook({ ...look, frame: index % 2 ? 'male.adult' : 'female.adult' }, false, 8191 + index * 7919) }));
    return choices[proof].map(item => ({ name: item.label, look: { ...look, [proof]: item.id } as Look }));
  }, [look, proof]);
  function swatch(key: typeof paletteKeys[number], id: string): string {
    if (key === 'skinPaletteId') return skins[id as Look['skinPaletteId']].base;
    if (key === 'baseHairColorId') return hairs[id as Look['baseHairColorId']].base;
    return cloths[id as Look['outfitPaletteId']].base;
  }
  return <main className="pc-root" data-composer data-look={JSON.stringify(look)} data-background={night ? 'night' : 'paper'}>
    <header className="pc-header"><a className="pc-brand" href="/">万户天工 <span>居民逻辑网页demo</span></a>
      <nav aria-label="头像页面"><a href="/?view=portraits">正式头像</a><a href="/?view=portrait-art-directions">画风研究</a><span>头像 DIY</span></nav></header>
    <section className="pc-intro"><div><p className="pc-eyebrow">RESIDENT PORTRAIT · COMPOSER LAB</p><h1>同一张脸，换一种生活。</h1><p>发型、帽子、服饰独立选择。先把人物组合起来，再决定怎样量产。</p></div>
      <div className="pc-scope"><b>成年女性 / 成年男性</b><span>独立实验 · 不修改正式居民</span></div></section>
    <div className="pc-workspace">
      <section className="pc-controls" aria-label="头像选项"><div className="pc-panel-heading"><h2>搭配你的居民</h2><span>01 — 选择</span></div>
        <div className="pc-frame" role="group" aria-label="人物类型">{choices.frame.map(item => <button type="button" key={item.id} data-choice-key="frame" data-choice={item.id} aria-pressed={look.frame === item.id} onClick={() => choose('frame', item.id)}>{item.label}</button>)}</div>
        <div className="pc-tabs" role="group" aria-label="换装类别">{categories.map(key => <button type="button" key={key} data-category={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{labels[key].split(' / ')[0]}</button>)}</div>
        <div className="pc-options" role="group" aria-label={labels[category]}>{choices[category].map(item => <button type="button" className="pc-option" key={item.id} data-choice-key={category} data-choice={item.id} aria-pressed={look[category] === item.id} onClick={() => choose(category, item.id)}>
          <Portrait look={{ ...look, [category]: item.id }} size={82} /><span>{item.label}</span><i aria-hidden="true">{look[category] === item.id ? '✓' : ''}</i></button>)}</div>
        <div className="pc-palettes">{paletteKeys.map(key => <fieldset key={key}><legend>{labels[key]}<span>{label(key, look[key])}</span></legend><div>{choices[key].map(item => <button type="button" key={item.id} className="pc-swatch" data-choice-key={key} data-choice={item.id} aria-label={`${labels[key]}：${item.label}`} aria-pressed={look[key] === item.id} onClick={() => choose(key, item.id)} style={{ backgroundColor: swatch(key, item.id) }}><span>{look[key] === item.id ? '✓' : ''}</span></button>)}</div></fieldset>)}</div>
        <div className="pc-random"><label><input type="checkbox" data-lock-identity checked={lockIdentity} onChange={event => setLockIdentity(event.currentTarget.checked)} />锁定面容与肤色</label><button type="button" data-shuffle onClick={shuffle}>随机搭配</button></div>
      </section>
      <section className="pc-preview" aria-label="当前头像"><div className="pc-panel-heading"><h2>当前组合</h2><div className="pc-theme" role="group" aria-label="衬底"><button type="button" data-theme="paper" aria-pressed={!night} onClick={() => setNight(false)}>纸白</button><button type="button" data-theme="night" aria-pressed={night} onClick={() => setNight(true)}>暮色</button></div></div>
        <div className="pc-main-art"><Portrait look={look} size={320} main /></div>
        <div className="pc-identity"><span>{label('frame', look.frame)}</span><h2>{label('faceFamilyId', look.faceFamilyId)} · {label('outfitStyleId', look.outfitStyleId)}</h2><p>{label('hairStyleId', look.hairStyleId)} / {label('headwearStyleId', look.headwearStyleId)}</p></div>
        <p className="pc-wear-note" data-wear-mode={wearMode(look)}>{wearMode(look) === 'tucked' ? '帽内收发：暂收上方发髻，摘帽即恢复；脸和发型 ID 不变。' : '露发状态：保留完整发髻与发束轮廓。'}</p>
        <div className="pc-exports"><button type="button" onClick={png} disabled={busy} data-export="png">{busy ? '正在导出…' : '导出透明 PNG'}</button><button type="button" data-export="svg" onClick={() => downloadBlob(new Blob([renderPortrait(look)], { type: 'image/svg+xml' }), 'wanhu-composer.svg')}>导出 SVG</button></div>
      </section>
      <aside className="pc-checks"><div className="pc-panel-heading"><h2>小尺寸预览</h2><span>02 — 检查</span></div>
        <div className="pc-pixels">{[96, 64, 48].map(size => <figure key={size}><div><Portrait look={look} size={size} pixel /></div><figcaption>{size}<span> px</span></figcaption></figure>)}</div>
        <div className="pc-check-note"><h3>换装，不换身份</h3><p>面容、肤色保留。衣装不绑定职业，平民的脸也能穿华服、戴金冠。</p><p>当前为成年人验证。儿童、老人和正式游戏居民尚未接入。</p></div>
        <details className="pc-recipe"><summary>查看当前配方</summary><dl>{keys.map(key => <div key={key}><dt>{labels[key]}</dt><dd>{look[key]}</dd></div>)}</dl></details>
      </aside>
    </div>
    <div className="pc-savebar"><p role="status" aria-live="polite" data-feedback>{message || '当前组合自动保存在此浏览器；刷新后仍可继续。'}</p><div><button type="button" data-export="json" onClick={() => downloadBlob(new Blob([JSON.stringify(look, null, 2)], { type: 'application/json' }), 'wanhu-composer.json')}>导出配方</button><button type="button" onClick={() => input.current?.click()}>导入配方</button><input ref={input} data-import type="file" accept=".json,application/json" hidden onChange={event => { void importRecipe(event.currentTarget.files?.[0]); }} /><button type="button" data-share onClick={share}>复制组合链接</button><button type="button" data-reset onClick={() => { setLook({ ...defaultLook }); setMessage('已恢复默认组合。'); }}>重置</button></div></div>
    <section className="pc-proof" data-proof-mode={proof}><div className="pc-proof-heading"><div><p className="pc-eyebrow">SAME IDENTITY · DIFFERENT COMBINATIONS</p><h2>{proof === 'crowd' ? '让一座城有不同的面孔。' : '这仍然是同一个人。'}</h2><p>{proof === 'crowd' ? '固定种子生成 24 位成年居民；不是 24 张预画整图。' : '除对照中的选项外，其余参数都与上方当前组合保持一致。'}</p></div><div className="pc-proof-tabs" role="group" aria-label="组合对照">{proofModes.map(item => <button type="button" key={item.id} data-proof={item.id} aria-pressed={proof === item.id} onClick={() => setProof(item.id)}>{item.label}</button>)}</div></div>
      <div className="pc-proof-grid" data-dense={proof === 'pairs' || proof === 'crowd'}>{proofItems.map((item, index) => <figure key={`${proof}-${index}`} data-proof-item data-proof-look={JSON.stringify(item.look)}><Portrait look={item.look} size={144} /><figcaption>{item.name}</figcaption></figure>)}</div>
    </section>
    <footer className="pc-footer"><p>固定画布 · 独立 Face / Hair / Headwear / Outfit · SVG 内含分层标记</p><p>这是可组合实验，不代表 Unity 导入、儿童老人或全部美术质量已通过验收。</p></footer>
  </main>;
}
