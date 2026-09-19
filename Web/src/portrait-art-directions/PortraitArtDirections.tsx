import { useEffect, useRef, useState } from 'react';
import { directions, imageUrls, roles, type ArtDirection, type DirectionId } from './catalog';
import type { StudyRole } from './art/svg';
import './directions.css';

const sizes = [96, 64, 48] as const;
type Selection = { direction: ArtDirection; role: StudyRole };

function Sizes({ direction, role }: Selection) {
  return <div className="pad-sizes">{sizes.map(size => <figure key={size}>
    <img src={imageUrls[direction.id][role]} width={size} height={size}
      data-pixel-size={size} alt={`${direction.title}，${roles.find(item => item.id === role)!.label}，${size} 像素`} />
    <figcaption>{size}<span> px</span></figcaption>
  </figure>)}</div>;
}

export default function PortraitArtDirections() {
  const [filter, setFilter] = useState<DirectionId | 'all'>('all');
  const [night, setNight] = useState(false);
  const [pixels, setPixels] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const element = dialog.current;
    if (selection && element && !element.open) element.showModal();
  }, [selection]);
  // Escape、关闭按钮和背景点击统一在当前交互中清理选择。
  // 原生 close 事件会排队派发，不能让上一轮的迟到事件清空下一位角色。
  function close() {
    dialog.current?.close();
    setSelection(null);
    opener.current?.focus();
  }
  function downloadSvg() {
    if (!selection) return;
    const url = URL.createObjectURL(new Blob([selection.direction.art[selection.role]], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `wanhu-${selection.direction.id}-${selection.role}-study.svg`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const shown = directions.filter(item => filter === 'all' || item.id === filter);
  return <main className="pad-root" data-art-directions="true" data-background={night ? 'night' : 'paper'}
    data-mode={pixels ? 'pixels' : 'studies'}>
    <header className="pad-hero">
      <div className="pad-topline"><a href="/">万户天工 <span> / 居民逻辑网页demo</span></a>
        <a href="/?view=portraits">正式头像工作台 ↗</a></div>
      <div className="pad-heading"><div><p className="pad-eyebrow">RESIDENT PORTRAITS · ART DIRECTION STUDIES</p>
        <h1>三种画法，同一座城。</h1><p className="pad-lead">不从旧头像修补。先选人物的气质，再决定怎样量产。</p></div>
        <div className="pad-counts"><span><b>03</b>候选方向</span><span><b>18</b>独立角色稿</span><span><b>48<span>px</span></b>最小检查尺寸</span></div>
      </div>
      <p className="pad-status">美术方向研究 · 尚未选定正式画风 · 未接入正式居民 Runtime</p>
    </header>
    <div className="pad-body">
      <div className="pad-toolbar" aria-label="头像对比控制">
        <div className="pad-filter" role="group" aria-label="候选方向">
          <button type="button" data-filter="all" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>全部方向</button>
          {directions.map(item => <button type="button" key={item.id} data-filter={item.id} aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}>{item.number} {item.title}</button>)}
        </div>
        <div className="pad-options"><div role="group" aria-label="画布底色">
          <button type="button" data-background-button="paper" aria-pressed={!night} onClick={() => setNight(false)}>纸白</button>
          <button type="button" data-background-button="night" aria-pressed={night} onClick={() => setNight(true)}>暮色</button>
        </div><button type="button" className="pad-pixel-toggle" data-pixel-toggle aria-pressed={pixels}
          onClick={() => setPixels(value => !value)}>{pixels ? '返回角色稿' : '检查实际像素'}</button></div>
      </div>
      <p className="pad-reading-note">{pixels ? '下方头像按 96 / 64 / 48 CSS px 原尺寸显示；没有放大补偿。屏幕缩放会影响实际物理像素。' : '点击任一角色查看近景与原尺寸对照。三组比较同类角色，不假定是同一人物的换滤镜版本。'}</p>
      <div className="pad-sections">
        {shown.map(direction => <section key={direction.id} className="pad-direction" data-direction={direction.id}>
          <header className="pad-section-heading"><span className="pad-number">{direction.number}</span>
            <div><p className="pad-eyebrow">{direction.english}</p><h2>{direction.title}</h2><p>{direction.description}</p></div>
            <span className="pad-grammar">{direction.grammar}</span>
          </header>
          <div className={pixels ? 'pad-pixel-grid' : 'pad-gallery'}>
            {roles.map(role => <article key={role.id} className="pad-card" data-study-role={role.id}>
              {pixels ? <Sizes direction={direction} role={role.id} /> :
                <button type="button" className="pad-art-button" data-open-study={role.id}
                  onClick={event => { opener.current = event.currentTarget; setSelection({ direction, role: role.id }); }}
                  aria-label={`查看${direction.title}的${role.label}`}>
                  <img src={imageUrls[direction.id][role.id]} width="256" height="256" alt={`${direction.title} · ${role.label}`} />
                  <span className="pad-zoom" aria-hidden="true">＋</span>
                </button>}
              <div className="pad-caption"><h3>{role.label}</h3><p>{role.note}</p></div>
            </article>)}
          </div>
          <footer className="pad-verdict"><p><strong>值得保留</strong>{direction.strength}</p><p><strong>需要取舍</strong>{direction.risk}</p></footer>
        </section>)}
      </div>
      <aside className="pad-boundary"><span className="pad-eyebrow">NEXT GATE · 先选画风，再验证系统</span>
        <h2>这些是角色稿，不是已经通过量产验收的头像库。</h2>
        <p>18 个样本分别作画，只共享 SVG 基元。下一步对入选方向做同脸换发型、换衣服、三个年龄段与小尺寸验证，再回到六个固定 PortraitFrame。不会添加运行时对齐器。</p>
        <div><a href="/?view=portraits">正式 Runtime 工作台 ↗</a><a href="/?view=portrait-style-bakeoff">旧 Bakeoff（历史）↗</a></div>
      </aside>
    </div>
    <dialog ref={dialog} className="pad-dialog" aria-labelledby="pad-dialog-title"
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={event => { if (!event.currentTarget.open) opener.current?.focus(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {selection && <div className="pad-dialog-content" data-detail-direction={selection.direction.id} data-detail-role={selection.role}><header><div><p className="pad-eyebrow">{selection.direction.english}</p>
        <h2 id="pad-dialog-title">{selection.direction.title} · {roles.find(role => role.id === selection.role)!.label}</h2></div>
        <button type="button" data-close-study onClick={close} aria-label="关闭角色近景" autoFocus>×</button></header>
        <div className="pad-detail-body"><div className="pad-detail-art"><img src={imageUrls[selection.direction.id][selection.role]} width="320" height="320" alt="角色近景" /></div>
          <div className="pad-detail-copy"><p>{selection.direction.description}</p><p className="pad-detail-grammar">{selection.direction.grammar}</p>
            <h3>原尺寸对照</h3><Sizes {...selection} /><p>{selection.direction.production}</p>
            <button type="button" className="pad-download" onClick={downloadSvg}>导出这张研究稿 SVG</button>
          </div></div>
        <p className="pad-detail-warning">自包含透明底 SVG · 非正式 Frame 资产 · 不代表 Unity 导入或万人组合已验证</p>
      </div>}
    </dialog>
  </main>;
}
