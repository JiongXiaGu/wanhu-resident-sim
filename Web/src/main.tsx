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

// 美术实验独立加载，正式居民页面不加载新资产或新配方。
const PortraitArtDirections = lazy(() => import('./portrait-art-directions/PortraitArtDirections'));
const PortraitComposerLab = lazy(() => import('./portrait-composer-lab/PortraitComposerLab'));
const PortraitAnimeLab = lazy(() => import('./portrait-anime-lab/PortraitAnimeLab'));
const params = new URLSearchParams(window.location.search);
const view = params.get('view');
const composerEntry = <a className="portrait-view-entry" href="/?view=portrait-composer-lab">头像 DIY · 同脸换装</a>;
// 必须重置旧入口的 top/left；只设置 bottom 会把固定定位链接拉满页面高度。
const animeEntry = <a className="portrait-view-entry" style={{ top: 'auto', left: 'auto', right: '14px', bottom: '14px' }} href="/?view=portrait-anime-lab">二次元头像 · 表情与换装</a>;
const rootView = view === 'portrait-anime-lab'
  ? <Suspense fallback={<p role="status">正在打开二次元头像实验…</p>}><PortraitAnimeLab /></Suspense>
  : view === 'portrait-composer-lab'
    ? <><Suspense fallback={<p role="status">正在打开头像 DIY…</p>}><PortraitComposerLab /></Suspense>{animeEntry}</>
    : view === 'portrait-art-directions'
      ? <><Suspense fallback={<p role="status">正在打开头像方向研究…</p>}><PortraitArtDirections /></Suspense>{composerEntry}{animeEntry}</>
      : view === 'portraits'
        ? <><PortraitLab />{composerEntry}{animeEntry}</>
        : view === 'portrait-style-study'
          ? <PortraitStyleStudy />
          : view === 'portrait-style-bakeoff'
            ? <PortraitStyleBakeoff />
            : <><App />{composerEntry}{animeEntry}</>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{rootView}</StrictMode>,
);
