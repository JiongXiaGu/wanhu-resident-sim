import {
  CROWD_REVIEW_SAMPLES,
  GOLDEN_PORTRAITS,
  HAIR_REVIEW_SAMPLES,
  WEALTH_REVIEW_SAMPLES,
  WoodblockPortrait,
  type PortraitSize,
  type WoodblockPortraitSpec,
} from './resident/portrait-woodblock-v6';

function SizeStrip({ spec }: { spec: WoodblockPortraitSpec }) {
  const sizes: PortraitSize[] = [96, 64, 48];
  return (
    <div className="woodblock-size-strip">
      {sizes.map((size) => (
        <div className="woodblock-size-strip__item" key={size}>
          <div style={{ width: size }}>
            <WoodblockPortrait spec={spec} size={size}/>
          </div>
          <span>{size}px</span>
        </div>
      ))}
    </div>
  );
}

function GoldenCard({ spec }: { spec: WoodblockPortraitSpec }) {
  return (
    <article className="woodblock-golden-card" data-golden-id={spec.id}>
      <div className="woodblock-golden-card__hero">
        <WoodblockPortrait spec={spec} label={spec.name + ' · 套色木刻'}/>
      </div>
      <div className="woodblock-golden-card__meta">
        <div>
          <strong>{spec.name}</strong>
          <span>{spec.age}岁 · {spec.stageLabel}</span>
        </div>
        <small>{spec.wealthLabel}</small>
      </div>
      <div className="woodblock-golden-card__tags">
        {spec.roleTags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <dl className="woodblock-golden-card__assets">
        <div><dt>Face</dt><dd>{spec.faceProfileId}</dd></div>
        <div><dt>Hair</dt><dd>{spec.hairId}</dd></div>
        <div><dt>Outfit</dt><dd>{spec.outfitId}</dd></div>
      </dl>
      <SizeStrip spec={spec}/>
    </article>
  );
}

export function PortraitStyleLab() {
  const females = GOLDEN_PORTRAITS.filter((item) => item.gender === 'female').length;
  const children = GOLDEN_PORTRAITS.filter((item) => item.lifeStage === 'child').length;
  const elders = GOLDEN_PORTRAITS.filter((item) => item.lifeStage === 'elder').length;

  return (
    <main className="portrait-style-lab woodblock-v6-lab" data-portrait-style-lab="woodblock-v6">
      <header className="portrait-style-lab__header">
        <div>
          <span className="portrait-style-lab__eyebrow">WOODBLOCK PORTRAIT V6 · GOLDEN RESIDENTS</span>
          <h1>居民头像 · 套色木刻正式方向原型</h1>
          <p>
            只保留套色木刻。当前重点不再是选画风，而是把预定义居民、女性、儿童、老人、财富层和长发 Rig 做到可进入正式资产生产。
          </p>
        </div>
        <nav>
          <a href="/?view=portraits">随机头像实验室</a>
          <a href="/">返回居民 Demo</a>
        </nav>
      </header>

      <section className="woodblock-summary" aria-label="V6 覆盖概览">
        <div><b>{GOLDEN_PORTRAITS.length}</b><span>Golden Residents</span></div>
        <div><b>{females}</b><span>女性角色</span></div>
        <div><b>{children}</b><span>儿童角色</span></div>
        <div><b>{elders}</b><span>老年角色</span></div>
        <div><b>6</b><span>女性发型基准</span></div>
        <div><b>4</b><span>财富层级</span></div>
      </section>

      <section className="woodblock-section" data-review-section="golden">
        <header className="woodblock-section__header">
          <div>
            <span>01 · GOLDEN RESIDENTS</span>
            <h2>12 个预定义基准人物</h2>
          </div>
          <p>先把固定人物做对，再扩随机资产池。儿童不是缩小成人，女性不靠“无胡须”成立，老人有独立脸型与年龄线。</p>
        </header>
        <div className="woodblock-golden-grid">
          {GOLDEN_PORTRAITS.map((spec) => <GoldenCard key={spec.id} spec={spec}/>)}
        </div>
      </section>

      <section className="woodblock-section" data-review-section="hair">
        <header className="woodblock-section__header">
          <div>
            <span>02 · HAIR STABILITY</span>
            <h2>女性长发与发髻 Rig 审查</h2>
          </div>
          <p>长发不再使用两根自由黑条。Back Hair、Side Hair、Front Hair 统一从 skull / temple / ear / shoulder 锚点生成，并在 48px 自动简化发束。</p>
        </header>
        <div className="woodblock-hair-grid">
          {HAIR_REVIEW_SAMPLES.map((spec) => (
            <article className="woodblock-hair-card" data-hair-review={spec.hairId} key={spec.id}>
              <WoodblockPortrait spec={spec} label={spec.name}/>
              <strong>{spec.name}</strong>
              <code>{spec.hairId}</code>
              <SizeStrip spec={spec}/>
            </article>
          ))}
        </div>
      </section>

      <section className="woodblock-section" data-review-section="wealth">
        <header className="woodblock-section__header">
          <div>
            <span>03 · WEALTH LAYERS</span>
            <h2>同一成年男子 · 四档财富服装</h2>
          </div>
          <p>只改变财富与 Outfit，脸和年龄保持一致。差异来自衣领层数、滚边和完整度，不靠职业制服和高饱和颜色。</p>
        </header>
        <div className="woodblock-wealth-grid">
          {WEALTH_REVIEW_SAMPLES.map((spec) => (
            <article className="woodblock-wealth-card" data-wealth-review={spec.wealth} key={spec.id}>
              <WoodblockPortrait spec={spec} label={'财富审查 · ' + spec.wealthLabel}/>
              <strong>{spec.wealthLabel}</strong>
              <code>{spec.outfitId}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="woodblock-section" data-review-section="crowd">
        <header className="woodblock-section__header">
          <div>
            <span>04 · CROWD REVIEW</span>
            <h2>32 人同屏轮廓稳定性</h2>
          </div>
          <p>用于发现长发穿帮、儿童比例异常、老人不显老、女性轮廓重复等问题。当前是基于 V6 基准资产的确定性压力样本。</p>
        </header>
        <div className="woodblock-crowd-grid">
          {CROWD_REVIEW_SAMPLES.map((spec) => (
            <div className="woodblock-crowd-item" data-crowd-id={spec.id} key={spec.id}>
              <WoodblockPortrait spec={spec} size={64}/>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
