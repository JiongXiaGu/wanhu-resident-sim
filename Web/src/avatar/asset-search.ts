import type {CatalogOption} from './packs/catalog';

// 搜索只处理调用方传入的当前 Frame / 分类候选，不触及配方与存储。
// 空白分词用 AND；匹配名称、短注、作者描述、关键词或稳定 ID，大小写不敏感。
export function filterAssetOptions(options:readonly CatalogOption[],query:string):readonly CatalogOption[]{
 const terms=query.normalize('NFKC').trim().toLowerCase().split(/\s+/).filter(Boolean);
 if(!terms.length)return options;
 return options.filter(option=>{
  const text=[option.id,option.label,option.note??'',option.description??'',...(option.tags??[])].join(' ').normalize('NFKC').toLowerCase();
  return terms.every(term=>text.includes(term));
 });
}
