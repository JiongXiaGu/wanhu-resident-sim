export const parts=['face','hair','outfit','expression'] as const;
export type Part=typeof parts[number];

export type CatalogOption={
  id:string;
  label:string;
  note?:string;
  // 跨 Pack 切换时只用于显式兼容映射。省略时默认使用自身 id。
  compatibilityKey?:string;
};

export type AvatarCatalog={
  readonly face:readonly CatalogOption[];
  readonly hair:readonly CatalogOption[];
  readonly outfit:readonly CatalogOption[];
  readonly expression:readonly CatalogOption[];
};

export type CatalogDefaults=Record<Part,string>;

export function defineCatalog<const T extends AvatarCatalog>(catalog:T):T{return catalog;}

export function hasCatalogOption(catalog:AvatarCatalog,part:Part,id:unknown):id is string{
  return typeof id==='string'&&catalog[part].some(option=>option.id===id);
}

export function catalogOption(catalog:AvatarCatalog,part:Part,id:string):CatalogOption|undefined{
  return catalog[part].find(option=>option.id===id);
}

export function catalogLabel(catalog:AvatarCatalog,part:Part,id:string):string{
  return catalogOption(catalog,part,id)?.label??id;
}
