import { useState } from 'react';
import {
  GOLDEN_PORTRAITS,
  PORTRAIT_STYLES,
  PortraitStylePortrait,
  type PortraitStyleId,
} from './resident/portrait-style-v5';

export function PortraitStyleLab() {
  const [candidate, setCandidate] = useState<PortraitStyleId | null>(null);

  return (
    <main className="portrait-style-lab" data-portrait-style-lab="v5">
      <header className="portrait-style-lab__header">
        <div>
          <span className="portrait-style-lab__eyebrow">PORTRAIT STYLE LAB V5 · TRUE ART DIRECTION SPLIT</span>
          <h1>居民头像 · 四套独立画师体系</h1>
          <p>
            这一版不再用同一人物模板换滤镜。四个方向分别拥有独立脸型、五官、姿势、线条和服装概括规则。
            同一行只保持“这是同一个居民”的身份信息，不要求共享同一套几何资产。
          </p>
        </div>
        <nav>
          <a href="/?view=portraits">V2 随机头像实验室</a>
          <a href="/">返回居民 Demo</a>
        </nav>
      </header>

      <section className="portrait-style-lab__rules">
        <span>4 套独立 Geometry System</span>
        <span>姿势允许不同</span>
        <span>脸型与五官不共享模板</span>
        <span>背景无光环</span>
        <span>96 / 64 / 48px 实际尺寸</span>
      </section>

      <section className="portrait-style-lab__style-headings" aria-label="四套独立美术体系">
        <div className="portrait-style-lab__identity-heading">
          <b>Golden Resident</b>
          <small>只固定人物身份</small>
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
            <small>{style.artSystem}</small>
            <i>{candidate === style.id ? '已标记为候选' : '点按标记候选'}</i>
          </button>
        ))}
      </section>

      <section className="portrait-style-lab__matrix" aria-label="真正独立的四种头像美术横向对比">
        {GOLDEN_PORTRAITS.map((resident) => (
          <div className="portrait-style-row" data-resident={resident.id} key={resident.id}>
            <aside className="portrait-style-row__identity">
              <strong>{resident.name}</strong>
              <span>{resident.age}岁 · {resident.stageLabel}</span>
              <small>{resident.wealthLabel}</small>
              <p>{resident.gender === 'female' ? '女性' : '男性'} · {resident.wealth}</p>
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
        <b>这次真正要比较什么</b>
        <p>
          不再比较“哪套配色更好”。要看的是：如果四位不同画师分别负责《万户天工》居民头像，
          哪一种造型体系最能同时满足古代气质、人物差异、小尺寸可读性和长期批量生产。
        </p>
      </footer>
    </main>
  );
}
