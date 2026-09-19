import { useEffect, useRef, useState } from 'react';
import { exportPreferences, imageUrl, initialPreferences, STORAGE, styles, subjects, type StyleId, type SubjectId } from './catalog';
import './open-styles.css';

// 本页只比较独立画稿。没有把位图切换伪装成捏脸、换装或正式 Runtime。
function Art({ styleId, subject, pixels, full = false }: { styleId: StyleId; subject: SubjectId; pixels?: number; full?: boolean }) {
  return <img src={imageUrl(styleId, subject)} alt={`${styles.find(item => item.id === styleId)!.code} · ${subjects.find(item => item.id === subject)!.label}`}
    width={pixels ?? 256} height={pixels ?? 342} data-art={`${styleId}-${subject}`} data-pixel-size={pixels}
    className={full ? 'ops-art-full' : 'ops-art-square'} draggable={false} />;
}
function NativeSizes({ styleId, subject }: { styleId: StyleId; subject: SubjectId }) {
  return <div className="ops-native">{[96,64,48].map(size => <figure key={size}><Art styleId={styleId} subject={subject} pixels={size}/><figcaption>{size} px</figcaption></figure>)}</div>;
}
export default function OpenStyleDirections() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [subject, setSubject] = useState<SubjectId>('woman21');
  const [scene, setScene] = useState<'day' | 'dim'>('day');
  const [hideNames, setHideNames] = useState(false);
  const [gray, setGray] = useState(false);
  const [message, setMessage] = useState('');
  const inspector = useRef<HTMLElement>(null);
  const active = styles.find(item => item.id === preferences.selected)!;
  const shortlisted = preferences.shortlist.includes(active.id);
  useEffect(() => { try { localStorage.setItem(STORAGE, JSON.stringify(preferences)); } catch { setMessage('此浏览器不能保存候选，可用“导出选择”保留。'); } }, [preferences]);
  function select(id: StyleId, scroll = false) { setPreferences(old => ({ ...old, selected: id })); setMessage(''); if (scroll) inspector.current?.scrollIntoView({ behavior: 'auto', block: 'start' }); }
  function toggleCandidate() {
    setPreferences(old => ({ ...old, shortlist: old.shortlist.includes(old.selected) ? old.shortlist.filter(id => id !== old.selected) : [...old.shortlist, old.selected] }));
    setMessage(shortlisted ? '已移出候选。' : '已加入候选，只保存在此浏览器。');
  }
  return <main className="ops-root" data-open-styles data-state={JSON.stringify(preferences)} data-diagnostic={gray ? 'gray' : 'color'} data-hide-names={hideNames}>
    <header className="ops-header"><a href="/" className="ops-brand">万户天工</a><nav aria-label="头像实验导航"><a href="/?view=portrait-composer-lab">原版 DIY</a><a href="/?view=portrait-anime-lab">表情实验</a><a href="/?view=portrait-modern-anime-lab">上一版画风</a></nav></header>
    <div className="ops-heading"><div><h1>头像画风候选</h1><p>主题：21岁女子、32岁男子。各画风独立设计人物，不固定同一张脸。</p></div><span className="ops-boundary">画风研究，尚未实现捏脸</span></div>
    <div className="ops-toolbar"><div role="group" aria-label="审稿显示"><button type="button" data-toggle-names aria-pressed={hideNames} onClick={() => setHideNames(v => !v)}>{hideNames ? '显示画风名称' : '隐藏画风名称'}</button><button type="button" data-toggle-gray aria-pressed={gray} onClick={() => setGray(v => !v)}>{gray ? '恢复原色' : '灰阶诊断'}</button></div><span>四种画法均为独立画稿，不使用换色滤镜制造差异。</span></div>
    <section className="ops-overview" aria-label="四种画风总览" data-overview>{styles.map(style => <article key={style.id} data-style-card={style.id} data-active={style.id === active.id}>
      <header><h2>{style.code}<span>{hideNames ? '候选画法' : style.title}</span></h2>{preferences.shortlist.includes(style.id) && <span className="ops-saved-label">已列候选</span>}</header>
      <div className="ops-pair">{subjects.map(person => <figure key={person.id}><Art styleId={style.id} subject={person.id} full/><figcaption>{person.label}</figcaption></figure>)}</div>
      {!hideNames && <p className="ops-grammar">{style.grammar}</p>}
      <button type="button" data-select-style={style.id} aria-pressed={style.id === active.id} onClick={() => select(style.id, true)}>{style.id === active.id ? '正在查看' : '看大图与 UI 预览'}</button>
    </article>)}</section>
    <section className="ops-inspector" ref={inspector} data-inspector={active.id} aria-labelledby="ops-inspector-title">
      <div className="ops-inspector-heading"><h2 id="ops-inspector-title">{active.code} · {hideNames ? '候选画法' : active.title}</h2><div role="group" aria-label="切换画风">{styles.map(style => <button type="button" key={style.id} data-inspect-style={style.id} aria-pressed={style.id === active.id} onClick={() => select(style.id)}>{style.code}</button>)}</div></div>
      <div className="ops-inspector-body"><div className="ops-large-pair" data-large-pair>{subjects.map(person => <article key={person.id} data-subject-proof={person.id}><Art styleId={active.id} subject={person.id} full/><h3>{person.label}</h3><NativeSizes styleId={active.id} subject={person.id}/></article>)}</div>
        <aside className="ops-ui-proof"><header><h3>放进界面看</h3><div role="group" aria-label="世界明暗"><button type="button" data-scene-button="day" aria-pressed={scene === 'day'} onClick={() => setScene('day')}>明场景</button><button type="button" data-scene-button="dim" aria-pressed={scene === 'dim'} onClick={() => setScene('dim')}>暗场景</button></div></header>
          <div className="ops-world" data-scene={scene}><div className="ops-world-image"/><div className="ops-ui-panel" data-ui-panel><header><span>人物</span><span>身份栏预览</span></header><div className="ops-identity"><Art styleId={active.id} subject={subject}/><div><h4>{subjects.find(item => item.id === subject)!.label}</h4><p>玩家头像</p><span>候选 {active.code}</span></div></div><div className="ops-person-switch" role="group" aria-label="预览人物">{subjects.map(person => <button type="button" key={person.id} data-ui-subject={person.id} aria-pressed={subject === person.id} onClick={() => setSubject(person.id)}><Art styleId={active.id} subject={person.id}/><span>{person.label}</span></button>)}</div></div></div>
          <p className="ops-context-note">依据 UI 仓库的烟墨、暖纸、熟铜语义搭建的预览容器，不是正式居民界面。</p>
          <button type="button" className="ops-shortlist" data-shortlist aria-pressed={shortlisted} onClick={toggleCandidate}>{shortlisted ? '移出候选' : '加入候选'}</button>
          {!hideNames && <details className="ops-reference" data-reference><summary>参考资料与后续自定义验证</summary><a href={active.reference.url} target="_blank" rel="noopener noreferrer">{active.reference.title} ↗</a><p>{active.reference.observe}</p><h4>入选后先验证</h4><p>{active.nextProof}</p><h4>需要留意</h4><p>{active.risk}</p></details>}
        </aside>
      </div>
    </section>
    <footer className="ops-footer"><p role="status" aria-live="polite" data-feedback>{message || '画稿为本轮生成的独立位图概念稿。三维感是画面效果，并不代表已制作三维模型。'}</p><div><button type="button" data-export-choices onClick={() => exportPreferences(preferences)}>导出选择</button><button type="button" data-clear-choices onClick={() => { setPreferences({ version: 1, selected: 'cel', shortlist: [] }); setMessage('已清除本页候选，不影响旧版 DIY 数据。'); }}>清除候选</button></div></footer>
  </main>;
}
