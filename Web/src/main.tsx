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
const params = new URLSearchParams(window.location.search);
const view = params.get('view');
const composerEntry = <a className="portrait-view-entry" href="/?view=portrait-composer-lab">头像 DIY · 同脸换装</a>;
const rootView = view === 'portrait-composer-lab'
  ? <Suspense fallback={<p role="status">正在打开头像 DIY…</p>}><PortraitComposerLab /></Suspense>
  : view === 'portrait-art-directions'
    ? <><Suspense fallback={<p role="status">正在打开头像方向研究…</p>}><PortraitArtDirections /></Suspense>{composerEntry}</>
    : view === 'portraits'
      ? <><PortraitLab />{composerEntry}</>
      : view === 'portrait-style-study'
        ? <PortraitStyleStudy />
        : view === 'portrait-style-bakeoff'
          ? <PortraitStyleBakeoff />
          : <><App />{composerEntry}</>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{rootView}</StrictMode>,
);
