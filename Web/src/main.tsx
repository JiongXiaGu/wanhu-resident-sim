import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortraitLab } from './PortraitLab';
import { PortraitStyleStudy } from './portrait-style-study/PortraitStyleStudy';
import { PortraitStyleBakeoff } from './portrait-style-bakeoff/PortraitStyleBakeoff';
import './styles.css';
import './game-validation.css';
import './life-log.css';
import './resident-avatar.css';
import './resident-panel-v2.css';
import './resident-life-memory.css';
import './portrait-lab.css';
import './portrait-entry.css';

// 新画风独立加载；不替换已冻结的正式头像，也不修改旧实验的资产。
const PortraitArtDirections = lazy(() => import('./portrait-art-directions/PortraitArtDirections'));
const PortraitComposerLab = lazy(() => import('./portrait-composer-lab/PortraitComposerLab'));
const PortraitAnimeLab = lazy(() => import('./portrait-anime-lab/PortraitAnimeLab'));
const ModernAnimeLab = lazy(() => import('./portrait-modern-anime-lab/ModernAnimeLab'));
const params = new URLSearchParams(window.location.search);
const view = params.get('view');
const composerEntry = <a className="portrait-view-entry" href="/?view=portrait-composer-lab">头像 DIY · 同脸换装</a>;
// 必须重置 top/left，避免旧入口规则与 bottom 同时作用而拉满页面。
const animeEntry = <a className="portrait-view-entry" style={{ top: 'auto', left: 'auto', right: '14px', bottom: '14px' }} href="/?view=portrait-anime-lab">二次元头像 · 表情与换装</a>;
const modernEntry = <a className="portrait-view-entry" style={{ top: 'auto', left: 'auto', right: '14px', bottom: '56px' }} href="/?view=portrait-modern-anime-lab">现代国风 · 新画风与换装</a>;
const rootView = view === 'portrait-modern-anime-lab'
  ? <Suspense fallback={<p role="status">正在打开现代国风人物实验…</p>}><ModernAnimeLab /></Suspense>
  : view === 'portrait-anime-lab'
    ? <><Suspense fallback={<p role="status">正在打开二次元头像实验…</p>}><PortraitAnimeLab /></Suspense>{modernEntry}</>
    : view === 'portrait-composer-lab'
      ? <><Suspense fallback={<p role="status">正在打开头像 DIY…</p>}><PortraitComposerLab /></Suspense>{animeEntry}{modernEntry}</>
      : view === 'portrait-art-directions'
        ? <><Suspense fallback={<p role="status">正在打开头像方向研究…</p>}><PortraitArtDirections /></Suspense>{composerEntry}{animeEntry}{modernEntry}</>
        : view === 'portraits'
          ? <><PortraitLab />{composerEntry}{animeEntry}{modernEntry}</>
          : view === 'portrait-style-study'
            ? <PortraitStyleStudy />
            : view === 'portrait-style-bakeoff'
              ? <PortraitStyleBakeoff />
              : <><App />{composerEntry}{animeEntry}{modernEntry}</>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{rootView}</StrictMode>,
);
