import {catalogFrames,type CatalogFrame,type CatalogOption} from './packs/catalog';

const frameWords:Record<CatalogFrame,string>={
 'female.child':'女性 女童 儿童','male.child':'男性 男童 儿童',
 'female.adult':'女性 成年','male.adult':'男性 成年',
 'female.elder':'女性 老年 老人','male.elder':'男性 老年 老人',
};
// 搜索只处理调用方传入的当前 Frame / 分类候选，不触及配方与存储。
// 空白分词用 AND；主题、关键词、轮廓和 Frame 都来自同一份 Catalog。
export function filterAssetOptions(options:readonly CatalogOption[],query:string):readonly CatalogOption[]{
 const terms=query.normalize('NFKC').trim().toLowerCase().split(/\s+/).filter(Boolean);
 if(!terms.length)return options;
 return options.filter(option=>{
  const text=[option.id,option.label,option.note??'',option.description??'',option.theme??'',
   option.silhouette??'',option.distinction??'',...(option.keywords??[]),
   ...(option.frames??catalogFrames).flatMap(frame=>[frame,frameWords[frame]])
  ].join(' ').normalize('NFKC').toLowerCase();
  return terms.every(term=>catalogFrames.includes(term as CatalogFrame)
   ?(option.frames??catalogFrames).includes(term as CatalogFrame):text.includes(term));
 });
}
