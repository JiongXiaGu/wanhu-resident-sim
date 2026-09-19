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

// 只保留居民 Demo、统一头像工坊和冻结契约检查页。错误实验由 Git 历史保留。
const view = new URLSearchParams(window.location.search).get('view');
createRoot(document.getElementById('root')!).render(
  <StrictMode>{view === 'portraits'
    ? <><PortraitLab /><a className="avatar-contract-entry" href="/?view=avatar-editor">打开头像工坊</a></>
    : <App />}</StrictMode>,
);
