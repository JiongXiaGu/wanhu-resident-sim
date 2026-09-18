import type { ReactNode } from 'react';

export const BAKEOFF_ROLES = [
  ['common-woman','平民女性'],
  ['common-man','平民男性'],
  ['elder','老年居民'],
  ['princess','公主 / 贵族女性'],
  ['emperor','皇帝 / 高阶男性'],
] as const;

export type BakeoffRole = typeof BAKEOFF_ROLES[number][0];

export function StudySection({
  id,letter,title,subtitle,tags,renderPortrait,
}:{
  id:string;
  letter:string;
  title:string;
  subtitle:string;
  tags:string[];
  renderPortrait:(role:BakeoffRole)=>ReactNode;
}) {
  return (
    <section className={'bakeoff-style bakeoff-style--'+id} data-bakeoff-style={id}>
      <header className="bakeoff-style__header">
        <div>
          <span>{letter}</span>
          <h2>{title}</h2>
        </div>
        <p>{subtitle}</p>
      </header>
      <div className="bakeoff-style__portraits">
        {BAKEOFF_ROLES.map(([role,label])=>(
          <article className="bakeoff-card" data-bakeoff-role={role} key={role}>
            <div className="bakeoff-card__art">{renderPortrait(role)}</div>
            <div className="bakeoff-card__label"><b>{label}</b><code>{role}</code></div>
          </article>
        ))}
      </div>
      <div className="bakeoff-style__tags">
        {tags.map((tag)=><span key={tag}>{tag}</span>)}
      </div>
    </section>
  );
}
