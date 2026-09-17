import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortraitIdentityLab } from './PortraitIdentityLab';
import './styles.css';
import './game-validation.css';
import './life-log.css';
import './resident-avatar.css';
import './resident-panel-v2.css';
import './resident-life-memory.css';
import './portrait-lab.css';
import './portrait-identity-lab.css';
import './portrait-entry.css';

const params = new URLSearchParams(window.location.search);
const isPortraitView = params.get('view') === 'portraits';
const rootView = isPortraitView
  ? <PortraitIdentityLab />
  : (
    <>
      <App />
      <a className="portrait-view-entry" href="/?view=portraits">头像查看器</a>
    </>
  );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {rootView}
  </StrictMode>,
);
