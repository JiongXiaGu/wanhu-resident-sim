import { useState } from 'react';
import {
  GOLDEN_PORTRAITS,
  PORTRAIT_STYLES,
  PortraitStylePortrait,
  type PortraitStyleId,
} from './resident/portrait-style-v3';

export function PortraitStyleLab() {
  const [candidate, setCandidate] = useState<PortraitStyleId | null>(null);

  return (
    <main className="portrait-style-lab" data-portrait-style-lab="v3">
      <header className="portrait-style-lab__header">
        <div>
          <span className="portrait-style-lab__eyebrow">PORTRAIT STYLE LAB V3 · ART DIRECTION SELECTION</span>
          <h1>居民头像美术方向对比</h1>
          <p>
            8 个 Golden Residents 保持同一身份、年龄、财富和轮廓，只更换美术语言。
            先选方向，再扩正式资产；这一页不使用 V2 的程序参数脸。
          </p>
        </div>
        <nav>
          <a href="/?view=portraits">V2 头像实验室</a>
          <a href="/">返回居民 Demo</a>
        </nav>
      </header>

      <section className="portrait-style-lab__rules">
        <span>同一人物横向比较</span>
        <span>背景无光环</span>
        <span>手工 Face Base</span>
        <span>96 / 64 / 48px 实际尺寸</span>
      </section>

      <section className="portrait-style-lab__style-headings" aria-label="美术风格说明">
        <div className="portrait-style-lab__identity-heading">
          <b>Golden Resident</b>
          <small>人物身份固定</small>
        </div>
        {PORTRAIT_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            className={candidate === style.id ? 'is-candidate' : ''}
            data-style-heading={style.id}
            onClick={() => setCandidate((current) => current === style.id ? null : style.id)}
          >
            <b>{style.name}</b>
            <span>{style.note}</span>
            <i>{candidate === style.id ? '已标记为候选' : '点按标记候选'}</i>
          </button>
        ))}
      </section>

      <section className="portrait-style-lab__matrix" aria-label="四种头像美术横向对比">
        {GOLDEN_PORTRAITS.map((resident) => (
          <div className="portrait-style-row" data-resident={resident.id} key={resident.id}>
            <aside className="portrait-style-row__identity">
              <strong>{resident.name}</strong>
              <span>{resident.age}岁 · {resident.stageLabel}</span>
              <small>{resident.wealthLabel}</small>
              <dl>
                <div><dt>Face</dt><dd>{resident.faceAsset}</dd></div>
                <div><dt>Hair</dt><dd>{resident.hairAsset}</dd></div>
              </dl>
            </aside>

            {PORTRAIT_STYLES.map((style) => (
              <article
                className={'portrait-style-card ' + (candidate && candidate !== style.id ? 'is-dimmed' : '')}
                data-style={style.id}
                data-resident={resident.id}
                key={style.id}
              >
                <div className="portrait-style-card__hero">
                  <PortraitStylePortrait
                    spec={resident}
                    artStyle={style.id}
                    label={resident.name + ' · ' + style.shortName}
                  />
                </div>
                <div className="portrait-style-card__sizes" aria-label="游戏内小尺寸预览">
                  {[96, 64, 48].map((size) => (
                    <div key={size}>
                      <PortraitStylePortrait spec={resident} artStyle={style.id} />
                      <span>{size}px</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>

      <footer className="portrait-style-lab__footer">
        <b>选择原则</b>
        <p>
          不看哪张单独最精致，优先看：男女和年龄是否稳定成立、8 个人是否像不同的人、
          48px 是否还能认、财富衣装是否克制可读，以及这种风格是否适合未来批量扩到数百个居民。
        </p>
      </footer>
    </main>
  );
}
