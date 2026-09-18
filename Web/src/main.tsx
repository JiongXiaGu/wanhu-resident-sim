import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortraitLab } from './PortraitLab';
import { PortraitStyleStudy } from './portrait-style-study/PortraitStyleStudy';
import './styles.css';
import './game-validation.css';
import './life-log.css';
import './resident-avatar.css';
import './resident-panel-v2.css';
import './resident-life-memory.css';
import './portrait-lab.css';
import './portrait-entry.css';

const params = new URLSearchParams(window.location.search);
const view = params.get('view');
const rootView = view === 'portraits'
  ? <PortraitLab />
  : view === 'portrait-style-study'
    ? <PortraitStyleStudy />
    : (
    <>
      <App />
      <a className="portrait-view-entry" href="/?view=portraits">头像工作台</a>
    </>
  );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {rootView}
  </StrictMode>,
);
