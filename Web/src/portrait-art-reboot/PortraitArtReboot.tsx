import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { directions, pixelSizes, roles, type DirectionId, type RoleId } from './catalog';
import './reboot.css';

function Portrait({ direction, role, size = 192 }: { direction: DirectionId; role: RoleId; size?: number }) {
  const index = roles.findIndex((item) => item.id === role);
  const label = `${directions.find((item) => item.id === direction)?.name} · ${roles[index].label}`;
  const base = `${import.meta.env.BASE_URL}portrait-art-reboot/`;
  return <span className={`par-portrait par-${direction}`} style={{ width: size, height: size } as CSSProperties}
    role="img" aria-label={label} data-art-portrait data-art-style={direction} data-art-role={role} data-art-size={size}>
    <img className="par-sprite" src={`${base}${direction}.${direction === 'painted' ? 'avif' : 'svg'}`} alt=""
      width={direction === 'painted' ? 960 : 1600} height={direction === 'painted' ? 192 : 320}
      style={{ left: `${-index * 100}%` }} draggable={false} />
  </span>;
}

export function PortraitArtReboot() {
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [mode, setMode] = useState<'gallery' | 'pixels'>('gallery');
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [shortlist, setShortlist] = useState<DirectionId[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.title = '居民头像 · 新美术方向 | 万户天工';
  }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedRole && dialog && !dialog.open) dialog.showModal();
    if (!selectedRole && dialog?.open) dialog.close();
  }, [selectedRole]);

  function closeComparison() {
    dialogRef.current?.close();
    setSelectedRole(null);
    triggerRef.current?.focus();
  }
  function toggleShortlist(id: DirectionId) {
    setShortlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function exportReview() {
    const blob = new Blob([JSON.stringify({
      format: 'wanhu.portrait-art-review.v1',
      route: 'portrait-art-reboot',
      shortlistedDirections: shortlist,
      note: '使用者的临时候选清单，不是美术验收结论，不修改生产 Runtime。',
      checksStillRequired: ['儿童与另一性别老人', '六个固定 Frame', 'Face/Hair/Outfit 换装', '大样本人群重复率'],
    }, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wanhu-portrait-art-review.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="par-root" data-art-reboot="true" data-tone={tone} data-mode={mode}>
    <div className="par-shell">
      <header className="par-masthead">
        <a href="/" className="par-brand">万户天工 <span>RESIDENT ATELIER</span></a>
        <nav aria-label="头像工作区导航">
          <a href="/?view=portraits">正式工作台</a>
          <a href="/?view=portrait-style-bakeoff">历史方案</a>
          <a href="/">居民 Demo ↗</a>
        </nav>
      </header>
      <section className="par-intro" aria-labelledby="par-title">
        <div>
          <p className="par-kicker">ART DIRECTION / 从人物重新开始</p>
          <h1 id="par-title">一座城，不止一种面孔。</h1>
          <p className="par-lead">先找到值得投入的画风，再让它成为可以组合的头像系统。</p>
        </div>
        <div className="par-intro-note"><span>本轮比较</span><strong>3 个方向 · 15 位居民</strong><p>不沿用旧 A–F 模板<br />不替换正式 PortraitFrame</p></div>
      </section>
      <div className="par-toolbar">
        <div className="par-segment" role="group" aria-label="评审内容">
          <button aria-pressed={mode === 'gallery'} onClick={() => setMode('gallery')}>方向对比</button>
          <button aria-pressed={mode === 'pixels'} onClick={() => setMode('pixels')}>48 / 64 / 96 px</button>
        </div>
        <div className="par-toolbar-end">
          <span className="par-hint">{mode === 'gallery' ? '点击人物，对照同一类角色' : '真实 CSS 像素，不放大展示'}</span>
          <button className="par-tone" aria-label="切换深浅底色" aria-pressed={tone === 'dark'} onClick={() => setTone(tone === 'light' ? 'dark' : 'light')}>
            {tone === 'light' ? '深色底' : '浅色底'}
          </button>
        </div>
      </div>
      {mode === 'gallery' ? <div className="par-gallery" data-art-gallery>
        {directions.map((direction) => <section key={direction.id} className="par-study" data-art-direction={direction.id} aria-labelledby={`par-${direction.id}`}>
          <header className="par-study-heading">
            <div className="par-study-title"><span className="par-number">{direction.number}</span><div><p className="par-kicker">{direction.english}</p><h2 id={`par-${direction.id}`}>{direction.name}</h2></div></div>
            <p className="par-study-summary">{direction.summary}<small>{direction.medium}</small></p>
            <button className="par-shortlist" aria-pressed={shortlist.includes(direction.id)} aria-label={`暂选${direction.name}`} onClick={() => toggleShortlist(direction.id)}>
              {shortlist.includes(direction.id) ? '已列入候选 ✓' : '列入候选 ＋'}
            </button>
          </header>
          <div className="par-cards">
            {roles.map((role) => <button className="par-card" key={role.id} data-art-card={role.id} aria-label={`对照${role.label} · ${direction.name}`}
              onClick={(event) => { triggerRef.current = event.currentTarget; setSelectedRole(role.id); }}>
              <div className="par-card-art"><Portrait direction={direction.id} role={role.id} /></div>
              <div className="par-card-caption"><strong>{role.label}</strong><span>{direction.id === 'painted' && role.id === 'elder' ? '老年男性' : role.id === 'elder' ? '老年女性' : role.question}</span></div>
            </button>)}
          </div>
          <footer className="par-study-footer"><p>{direction.construction}</p><div className="par-swatches" aria-label={`${direction.name}配色参考`}>{direction.colors.map((color) => <span key={color} style={{ backgroundColor: color }} title={color} />)}</div></footer>
          <details className="par-notes"><summary>方向优点 / 风险 / 后续量产路径</summary><div className="par-notes-grid"><p><strong>适合什么</strong>{direction.strength}</p><p><strong>还缺什么</strong>{direction.risk}</p><p><strong>如何系统化</strong>{direction.production}</p></div></details>
        </section>)}
      </div> : <section className="par-pixels" data-art-pixels aria-labelledby="par-pixel-title">
        <header><p className="par-kicker">IN-GAME READABILITY</p><h2 id="par-pixel-title">缩小以后，还认得出这个人吗？</h2><p>以下每张头像的显示盒分别为 48、64、96 CSS px。01 保留原画纸底；02 / 03 为透明底，随评审底色真实变化。</p></header>
        {directions.map((direction) => <section className="par-pixel-study" key={direction.id} data-pixel-direction={direction.id}>
          <h3><span>{direction.number}</span>{direction.name}</h3>
          <div className="par-size-groups">{pixelSizes.map((size) => <div className="par-size-group" key={size} data-pixel-size={size}>
            <div className="par-size-label">{size} <span>px</span></div>
            <div className="par-small-row">{roles.map((role) => <Portrait key={role.id} direction={direction.id} role={role.id} size={size} />)}</div>
          </div>)}</div>
        </section>)}
      </section>}
      <section className="par-boundary">
        <div><p className="par-kicker">NEXT GATE / 选画风，不是冻结资产</p><h2>先选方向，后做系统。</h2><p>本轮是完整人物的美术 Proof，不提供随机捏脸。五个样本不能证明成千上万人的多样性；儿童、换装、年龄延续和群体重复率，必须在选型后单独验证。</p></div>
        <div className="par-review-list"><span aria-live="polite">临时候选：{shortlist.length ? directions.filter((item) => shortlist.includes(item.id)).map((item) => item.name).join('、') : '尚未选择'}</span><button onClick={exportReview}>导出候选清单 ↓</button><small>只导出本页选择，不保存或改写居民 DNA。</small></div>
      </section>
      <footer className="par-page-footer"><span>万户百姓，自有面目。</span><span>ART PROOF · NOT PRODUCTION ASSETS</span></footer>
    </div>
    <dialog ref={dialogRef} className="par-dialog" data-role-comparison aria-labelledby="par-dialog-title" onCancel={(event) => { event.preventDefault(); closeComparison(); }}>
      {selectedRole && <><header><div><p className="par-kicker">同类角色 / 三种视觉语言</p><h2 id="par-dialog-title">{roles.find((role) => role.id === selectedRole)?.label}</h2></div><button onClick={closeComparison} autoFocus aria-label="关闭角色对照">关闭 ×</button></header>
        <div className="par-compare-grid">{directions.map((direction) => <section key={direction.id}><h3>{direction.number} / {direction.name}</h3><div className="par-comparison-art"><Portrait direction={direction.id} role={selectedRole} /></div><p>{direction.construction}</p></section>)}</div>
        <p className="par-dialog-note">比较的是同一社会角色，不是同一张脸换滤镜。老人样本包含男性与女性；正式六 Frame 尚未进入本轮。</p></>}
    </dialog>
  </main>;
}
