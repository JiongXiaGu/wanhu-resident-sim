// Phase 8B1 的明确交付清单。后续新增 ID 必须另行审查，不能仅靠 child-/elder- 前缀标成已重画。
export const ageWardrobeBatch={
 frames:['female.child','male.child','female.elder','male.elder'],
 hair:['child-topknot','child-double-bun','child-tufted','child-double-knots','child-side-braid','child-half-up','child-short-fringe',
       'elder-low-knot','elder-swept','elder-soft-bun','elder-coiled-bun','elder-short-bound','elder-side-knot','elder-loose-back','elder-thin-fringe'],
 outfit:['child-short-robe','child-apprentice','child-play-jacket','child-helper','child-winter','child-fine-robe',
         'elder-long-robe','elder-warm-coat','elder-simple-robe','elder-work-jacket','elder-padded-robe','elder-fine-robe'],
} as const;
export const isAgeWardrobeSample=(part:string,id:string):boolean=>
 (part==='hair'||part==='outfit')&&(ageWardrobeBatch[part] as readonly string[]).includes(id);
