import { EditorialStudy } from './EditorialStudy';
import { FineLineStudy } from './FineLineStudy';
import { GeometricStudy } from './GeometricStudy';
import { PrintStudy } from './PrintStudy';
import { NeoFolkStudy } from './NeoFolkStudy';
import { CelStudy } from './CelStudy';
import './style-study.css';

export function PortraitStyleStudy() {
  return (
    <main className="style-study" data-style-study="true">
      <header className="style-study__hero">
        <div>
          <span>PORTRAIT STYLE EXPLORATION · SVG STUDIES</span>
          <h1>居民头像画风探索</h1>
          <p>
            这里不是正式换装系统，也不复用 PortraitRenderer。六组研究允许使用不同的脸部比例、眼睛结构、
            发型构成、衣服轮廓、描边方式和构图。目标是先选“画风”，再把选中的方向工程化回固定 Frame。
          </p>
        </div>
        <nav>
          <a href="/?view=portraits">正式头像工作台</a>
          <a href="/">居民 Demo</a>
        </nav>
      </header>

      <section className="style-study__rules">
        <div><b>6</b><span>独立 SVG 画风</span></div>
        <div><b>3</b><span>每组人物形态</span></div>
        <div><b>0</b><span>生产 Renderer 复用</span></div>
        <div><b>FREE</b><span>暂不受固定 Frame 限制</span></div>
      </section>

      <EditorialStudy />
      <FineLineStudy />
      <GeometricStudy />
      <PrintStudy />
      <NeoFolkStudy />
      <CelStudy />

      <footer className="style-study__footer">
        <strong>选择标准</strong>
        <p>先看眼睛、脸部气质、服装轮廓和小尺寸辨识度；不要因为某套更接近当前正式头像就优先选它。</p>
      </footer>
    </main>
  );
}
