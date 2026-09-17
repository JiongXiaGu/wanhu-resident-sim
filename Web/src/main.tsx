import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PortraitLab } from './PortraitLab';
import './styles.css';
import './game-validation.css';
import './life-log.css';
import './resident-avatar.css';
import './resident-panel-v2.css';
import './resident-life-memory.css';
import './portrait-lab.css';

const params = new URLSearchParams(window.location.search);
const rootView = params.get('view') === 'portraits' ? <PortraitLab /> : <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {rootView}
  </StrictMode>,
);
