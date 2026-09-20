import {defineCatalog} from '../catalog';

const CHILD=['female.child','male.child'] as const;
const ADULT=['female.adult','male.adult'] as const;
const ELDER=['female.elder','male.elder'] as const;

export const chibiCatalog=defineCatalog({
  face:[
    {id:'oval',label:'柔和',note:'椭圆轮廓 · 舒展眉眼'},
    {id:'round',label:'圆润',note:'饱满面颊 · 圆眼'},
    {id:'angular',label:'英气',note:'明确下颌 · 细长眼'},
    {id:'long',label:'清秀',note:'修长脸形 · 平缓眉眼'},
  ],
  hair:[
    // 旧基础发型继续跨 Frame 可用，保障历史 Recipe；新增古代素材不再强制跨年龄共享。
    {id:'crop',label:'利落短发',headwear:'none'},
    {id:'bob',label:'齐颈短发',headwear:'none'},
    {id:'long',label:'自然长发',headwear:'none'},
    {id:'pony',label:'高马尾',headwear:'none'},
    {id:'wave',label:'蓬松卷发',headwear:'none'},
    {id:'braid',label:'侧编发',headwear:'none'},

    {id:'child-topknot',label:'童子束发',note:'儿童专属 · 紧凑束髻',headwear:'none',frames:CHILD,compatibilityKey:'crop'},
    {id:'child-double-bun',label:'童子双髻',note:'女童专属 · 双侧小髻',headwear:'none',frames:['female.child'],compatibilityKey:'bob'},

    {id:'bound',label:'日常束发',note:'成年专属 · 简化束髻',headwear:'none',frames:ADULT,compatibilityKey:'crop'},
    {id:'low-bun',label:'低髻',note:'成年专属 · 低位发髻',headwear:'none',frames:ADULT,compatibilityKey:'bob'},
    {id:'work-headscarf',label:'劳作头巾',note:'成年专属 · 劳作居民',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},
    {id:'scholar-cap',label:'书生巾帽',note:'成年专属 · 学徒书生',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},
    {id:'merchant-wrap',label:'掌柜包头',note:'成年专属 · 商贩掌柜',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},

    {id:'elder-low-knot',label:'老者低束',note:'老年专属 · 低位收束',headwear:'none',frames:ELDER,compatibilityKey:'bob'},
    {id:'elder-swept',label:'老者拢发',note:'老年专属 · 贴头拢发',headwear:'none',frames:ELDER,compatibilityKey:'crop'},
  ],
  outfit:[
    {id:'tee',label:'简约上衣'},
    {id:'shirt',label:'开领衬衫'},
    {id:'knit',label:'针织开衫'},
    {id:'jacket',label:'短外套'},

    {id:'child-short-robe',label:'童子短衣',note:'儿童专属 · 短身交领',frames:CHILD,compatibilityKey:'tee'},
    {id:'child-apprentice',label:'学童衣',note:'儿童专属 · 学徒短衫',frames:CHILD,compatibilityKey:'shirt'},

    {id:'commoner',label:'平民短衣',note:'成年专属 · 交领短衣',frames:ADULT,compatibilityKey:'tee'},
    {id:'laborer',label:'劳作短褐',note:'成年专属 · 束袖工作装',frames:ADULT,compatibilityKey:'jacket'},
    {id:'merchant',label:'商贩襟衫',note:'成年专属 · 稳重对襟',frames:ADULT,compatibilityKey:'knit'},
    {id:'scholar',label:'书生长衫',note:'成年专属 · 洁净交领',frames:ADULT,compatibilityKey:'shirt'},
    {id:'artisan',label:'工匠围襟',note:'成年专属 · 耐用短衣',frames:ADULT,compatibilityKey:'jacket'},

    {id:'elder-long-robe',label:'老者常服',note:'老年专属 · 宽松长衫',frames:ELDER,compatibilityKey:'shirt'},
    {id:'elder-warm-coat',label:'老者夹衣',note:'老年专属 · 厚领外搭',frames:ELDER,compatibilityKey:'knit'},
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
