export const parts=['face','hair','outfit','expression'] as const;
export type Part=typeof parts[number];

export const catalogFrames=[
  'female.child','female.adult','female.elder',
  'male.child','male.adult','male.elder',
] as const;
export type CatalogFrame=typeof catalogFrames[number];

export type CatalogOption={
  id:string;
  label:string;
  note?:string;
  // 省略表示六个 Frame 都可用；声明后只在对应年龄 / 性别上下文出现。
  frames?:readonly CatalogFrame[];
  // false 表示仅保留旧 Recipe / 跨 Pack 兼容，不再出现在任何玩家可选列表。
  selectable?:boolean;
  // 跨 Pack 或跨 Frame 回退时只用于显式语义兼容。省略时默认使用自身 id。
  compatibilityKey?:string;
  // 仅 Hair 使用：帽饰仍属于 Hair 内部作者层，不增加玩家 Recipe 字段。
  headwear?:'none'|'integrated';
  // 仅 Hair 使用：允许内部发际区域表现稀疏头皮；不允许 Hair 外轮廓露出 Head Frame。
  scalpExposure?:'none'|'intentional';
};

export type AvatarCatalog={
  readonly face:readonly CatalogOption[];
  readonly hair:readonly CatalogOption[];
  readonly outfit:readonly CatalogOption[];
  readonly expression:readonly CatalogOption[];
};

export type CatalogDefaults=Record<Part,string>;

export function defineCatalog<const T extends AvatarCatalog>(catalog:T):T{return catalog;}

export function optionSupportsFrame(option:CatalogOption,frame:CatalogFrame):boolean{
  return option.selectable!==false&&(!option.frames||option.frames.includes(frame));
}

export function catalogSelectableOptions(catalog:AvatarCatalog,part:Part):readonly CatalogOption[]{
  return catalog[part].filter(option=>option.selectable!==false);
}

export function catalogOptionsForFrame(catalog:AvatarCatalog,part:Part,frame:CatalogFrame):readonly CatalogOption[]{
  return catalog[part].filter(option=>optionSupportsFrame(option,frame));
}

export function hasCatalogOption(catalog:AvatarCatalog,part:Part,id:unknown):id is string{
  return typeof id==='string'&&catalog[part].some(option=>option.id===id);
}

export function hasCatalogOptionForFrame(catalog:AvatarCatalog,part:Part,id:unknown,frame:CatalogFrame):id is string{
  return typeof id==='string'&&catalog[part].some(option=>option.id===id&&optionSupportsFrame(option,frame));
}

export function catalogOption(catalog:AvatarCatalog,part:Part,id:string):CatalogOption|undefined{
  return catalog[part].find(option=>option.id===id);
}

export function catalogLabel(catalog:AvatarCatalog,part:Part,id:string):string{
  return catalogOption(catalog,part,id)?.label??id;
}
