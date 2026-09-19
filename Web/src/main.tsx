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

// 研究稿独立加载；正式居民页面不加载新的美术实验资产。
const PortraitArtDirections = lazy(() => import('./portrait-art-directions/PortraitArtDirections'));
const params = new URLSearchParams(window.location.search);
const view = params.get('view');
const rootView = view === 'portrait-art-directions'
  ? <Suspense fallback={<p role="status">正在打开头像方向研究…</p>}><PortraitArtDirections /></Suspense>
  : view === 'portraits'
    ? <><PortraitLab /><a className="portrait-view-entry" href="/?view=portrait-art-directions">新头像方向研究</a></>
    : view === 'portrait-style-study'
      ? <PortraitStyleStudy />
      : view === 'portrait-style-bakeoff'
        ? <PortraitStyleBakeoff />
        : <><App /><a className="portrait-view-entry" href="/?view=portraits">头像工作台</a></>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{rootView}</StrictMode>,
);
