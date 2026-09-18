import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortraitIdentityLab } from './PortraitIdentityLab';
import { PortraitStyleLab } from './PortraitStyleLab';
import './styles.css';
import './game-validation.css';
import './life-log.css';
import './resident-avatar.css';
import './resident-panel-v2.css';
import './resident-life-memory.css';
import './portrait-lab.css';
import './portrait-identity-lab.css';
import './portrait-style-lab.css';
import './portrait-entry.css';

const params = new URLSearchParams(window.location.search);
const view = params.get('view');

const rootView = view === 'portraits'
  ? <PortraitIdentityLab />
  : view === 'portrait-styles'
    ? <PortraitStyleLab />
    : (
      <>
        <App />
        <a className="portrait-view-entry" href="/?view=portraits">头像查看器</a>
        <a className="portrait-style-entry" href="/?view=portrait-styles">美术风格对比</a>
      </>
    );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {rootView}
  </StrictMode>,
);
