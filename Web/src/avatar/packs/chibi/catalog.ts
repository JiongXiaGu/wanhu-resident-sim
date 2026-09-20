import {defineCatalog} from '../catalog';

export const chibiCatalog=defineCatalog({
  face:[
    {id:'oval',label:'柔和',note:'椭圆轮廓 · 舒展眉眼'},
    {id:'round',label:'圆润',note:'饱满面颊 · 圆眼'},
    {id:'angular',label:'英气',note:'明确下颌 · 细长眼'},
    {id:'long',label:'清秀',note:'修长脸形 · 平缓眉眼'},
  ],
  hair:[
    {id:'crop',label:'利落短发',headwear:'none'},
    {id:'bob',label:'齐颈短发',headwear:'none'},
    {id:'long',label:'自然长发',headwear:'none'},
    {id:'pony',label:'高马尾',headwear:'none'},
    {id:'wave',label:'蓬松卷发',headwear:'none'},
    {id:'braid',label:'侧编发',headwear:'none'},

    {id:'bound',label:'日常束发',note:'简化束髻 · 成年居民',headwear:'none',compatibilityKey:'crop'},
    {id:'low-bun',label:'低髻',note:'低位发髻 · 日常温和',headwear:'none',compatibilityKey:'bob'},
    {id:'work-headscarf',label:'劳作头巾',note:'包头巾 · 劳作居民',headwear:'integrated',compatibilityKey:'crop'},
    {id:'scholar-cap',label:'书生巾帽',note:'简化巾帽 · 学徒书生',headwear:'integrated',compatibilityKey:'crop'},
    {id:'merchant-wrap',label:'掌柜包头',note:'包巾短帽 · 商贩掌柜',headwear:'integrated',compatibilityKey:'crop'},
  ],
  outfit:[
    {id:'tee',label:'简约上衣'},
    {id:'shirt',label:'开领衬衫'},
    {id:'knit',label:'针织开衫'},
    {id:'jacket',label:'短外套'},

    {id:'commoner',label:'平民短衣',note:'交领短衣 · 日常居民',compatibilityKey:'tee'},
    {id:'laborer',label:'劳作短褐',note:'束袖工作装 · 劳作居民',compatibilityKey:'jacket'},
    {id:'merchant',label:'商贩襟衫',note:'稳重对襟 · 商贩掌柜',compatibilityKey:'knit'},
    {id:'scholar',label:'书生长衫',note:'洁净交领 · 学徒书生',compatibilityKey:'shirt'},
    {id:'artisan',label:'工匠围襟',note:'耐用短衣 · 手艺工匠',compatibilityKey:'jacket'},
  ],
  expression:[
    {id:'calm',label:'平静'},
    {id:'smile',label:'微笑'},
    {id:'joy',label:'开心'},
    {id:'angry',label:'不满'},
    {id:'sad',label:'难过'},
    {id:'surprise',label:'惊讶'},
    {id:'shy',label:'害羞',note:'低眉 · 加深腮红',compatibilityKey:'smile'},
    {id:'serious',label:'认真',note:'平眉 · 收紧嘴型',compatibilityKey:'calm'},
  ],
} as const);

export type FaceId=typeof chibiCatalog.face[number]['id'];
export type HairId=typeof chibiCatalog.hair[number]['id'];
export type OutfitId=typeof chibiCatalog.outfit[number]['id'];
export type ExpressionId=typeof chibiCatalog.expression[number]['id'];
