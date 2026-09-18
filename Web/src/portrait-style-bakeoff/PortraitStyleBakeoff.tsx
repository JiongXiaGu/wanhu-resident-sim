import { ElegantFlatStudy } from './studies/ElegantFlatStudy';
import { NeoFolkStudy } from './studies/NeoFolkStudy';
import { CelCharacterStudy } from './studies/CelCharacterStudy';
import { PrintmakerStudy } from './studies/PrintmakerStudy';
import { GeometricStudy } from './studies/GeometricStudy';
import { InkFlatStudy } from './studies/InkFlatStudy';
import './bakeoff.css';

export function PortraitStyleBakeoff() {
  return (
    <main className="portrait-bakeoff" data-portrait-bakeoff="true">
      <header className="portrait-bakeoff__hero">
        <div>
          <span>WANHU PORTRAIT · STYLE BAKEOFF</span>
          <h1>古代中国居民头像：画风竞标</h1>
          <p>
            这一页只做美术方向筛选，不复用正式 PortraitRenderer，也不要求六套方案共享脸型或身体比例。
            每套画风必须同时承载平民、老人、贵族女性和最高阶男性，避免“只画一张好看的女头像”造成误判。
          </p>
        </div>
        <nav>
          <a href="/?view=portraits">正式头像工作台</a>
          <a href="/?view=portrait-style-study">上一轮实验</a>
          <a href="/">居民 Demo</a>
        </nav>
      </header>

      <section className="portrait-bakeoff__criteria">
        <div><b>6</b><span>候选画风</span></div>
        <div><b>5</b><span>身份样本 / 每套</span></div>
        <div><b>30</b><span>独立角色 SVG</span></div>
        <div><b>0</b><span>正式 Renderer 依赖</span></div>
      </section>

      <section className="portrait-bakeoff__brief">
        <strong>统一命题，不统一形态</strong>
        <p>所有方案都画古代中国居民，但允许自行决定头身比例、眼睛结构、线条、色块、衣服轮廓和身份表达。评审重点：好看、群体可扩展、身份层级清楚、未来能拆成 Face / Hair / Outfit。</p>
      </section>

      <ElegantFlatStudy />
      <NeoFolkStudy />
      <CelCharacterStudy />
      <PrintmakerStudy />
      <GeometricStudy />
      <InkFlatStudy />

      <footer className="portrait-bakeoff__footer">
        <b>本页不是最终生产资产。</b>
        <span>入围 2–3 套后，再单独做换发型、换衣服、年龄变化与 48/64/96px 的模块化 proof。</span>
      </footer>
    </main>
  );
}
