import type {CatalogOption} from './catalog';

export const retiredPackAliases={
  'soft-paint-v1':'chibi-cute-v1',
  'linework-v1':'chibi-cute-v1',
  'simple-flat-v1':'chibi-cute-v1',
} as const;

export const compatibilityHairOptions=[
  {id:'crop',label:'利落短发',note:'旧配方兼容',selectable:false,headwear:'none'},
  {id:'bob',label:'齐颈短发',note:'旧配方兼容',selectable:false,headwear:'none'},
  {id:'long',label:'自然长发',note:'旧配方兼容',selectable:false,headwear:'none'},
  {id:'pony',label:'高马尾',note:'旧配方兼容',selectable:false,headwear:'none'},
  {id:'wave',label:'蓬松卷发',note:'旧配方兼容',selectable:false,headwear:'none'},
  {id:'braid',label:'侧编发',note:'旧配方兼容',selectable:false,headwear:'none'},
] as const satisfies readonly CatalogOption[];

export const compatibilityOutfitOptions=[
  {id:'tee',label:'简约上衣',note:'旧配方兼容',selectable:false},
  {id:'shirt',label:'开领衬衫',note:'旧配方兼容',selectable:false},
  {id:'knit',label:'针织开衫',note:'旧配方兼容',selectable:false},
  {id:'jacket',label:'短外套',note:'旧配方兼容',selectable:false},
] as const satisfies readonly CatalogOption[];
