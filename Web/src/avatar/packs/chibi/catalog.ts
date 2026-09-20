import {defineCatalog} from '../catalog';
import {compatibilityHairOptions,compatibilityOutfitOptions} from '../compatibility';

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
    // Phase 5A：child 只展示儿童作者资产。
    {id:'child-topknot',label:'童子束发',note:'儿童专属 · 紧凑束髻',headwear:'none',frames:CHILD,compatibilityKey:'crop'},
    {id:'child-double-bun',label:'童子双髻',note:'女童专属 · 双侧小髻',headwear:'none',frames:['female.child'],compatibilityKey:'bob'},
    {id:'child-tufted',label:'垂髫短发',note:'儿童专属 · 两侧垂髫',headwear:'none',frames:CHILD,compatibilityKey:'bob'},
    {id:'child-double-knots',label:'总角双束',note:'儿童专属 · 左右双束',headwear:'none',frames:CHILD,compatibilityKey:'pony'},
    {id:'child-side-braid',label:'垂髫小辫',note:'女童专属 · 侧边小辫',headwear:'none',frames:['female.child'],compatibilityKey:'braid'},
    {id:'child-half-up',label:'学童半束',note:'男童专属 · 半束短发',headwear:'none',frames:['male.child'],compatibilityKey:'long'},
    {id:'child-short-fringe',label:'短刘海',note:'儿童专属 · 圆润短发',headwear:'none',frames:CHILD,compatibilityKey:'wave'},

    // Phase 5B：adult 只展示成年古代作者资产。
    {id:'bound',label:'日常束发',note:'成年专属 · 简化束髻',headwear:'none',frames:ADULT,compatibilityKey:'crop'},
    {id:'low-bun',label:'低髻',note:'成年女性 · 低位发髻',headwear:'none',frames:['female.adult'],compatibilityKey:'bob'},
    {id:'work-headscarf',label:'劳作头巾',note:'成年专属 · 劳作居民',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},
    {id:'scholar-cap',label:'书生巾帽',note:'成年专属 · 学徒书生',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},
    {id:'merchant-wrap',label:'掌柜包头',note:'成年专属 · 商贩掌柜',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},
    {id:'adult-high-bun',label:'高髻',note:'成年女性 · 利落高髻',headwear:'none',frames:['female.adult'],compatibilityKey:'pony'},
    {id:'adult-side-braid',label:'侧编长辫',note:'成年女性 · 侧边编发',headwear:'none',frames:['female.adult'],compatibilityKey:'braid'},
    {id:'adult-long-tied',label:'长发低束',note:'成年女性 · 长发收束',headwear:'none',frames:['female.adult'],compatibilityKey:'long'},
    {id:'adult-short-bound',label:'短发束冠',note:'成年男性 · 紧凑束发',headwear:'none',frames:['male.adult'],compatibilityKey:'bob'},
    {id:'adult-half-up',label:'半束长发',note:'成年男性 · 半束垂发',headwear:'none',frames:['male.adult'],compatibilityKey:'long'},
    {id:'adult-side-knot',label:'侧束髻',note:'成年男性 · 侧后束髻',headwear:'none',frames:['male.adult'],compatibilityKey:'pony'},
    {id:'adult-braided-tail',label:'束辫',note:'成年男性 · 短束编辫',headwear:'none',frames:['male.adult'],compatibilityKey:'braid'},
    {id:'adult-brushed-back',label:'后拢短发',note:'成年男性 · 额前后拢',headwear:'none',frames:['male.adult'],compatibilityKey:'wave'},
    {id:'adult-loose-tied',label:'松束发',note:'成年专属 · 日常低束',headwear:'none',frames:ADULT,compatibilityKey:'wave'},
    {id:'adult-traveler-wrap',label:'行旅包巾',note:'成年专属 · 轻便包巾',headwear:'integrated',frames:ADULT,compatibilityKey:'crop'},

    // Phase 5C：elder 只展示老年作者资产，男女各有独立子集。
    {id:'elder-low-knot',label:'老者低束',note:'老年专属 · 低位收束',headwear:'none',frames:ELDER,compatibilityKey:'bob'},
    {id:'elder-swept',label:'老者拢发',note:'老年专属 · 贴头拢发',headwear:'none',frames:ELDER,compatibilityKey:'crop'},
    {id:'elder-soft-bun',label:'松软低髻',note:'老年女性 · 柔和低髻',headwear:'none',frames:['female.elder'],compatibilityKey:'braid'},
    {id:'elder-coiled-bun',label:'盘髻',note:'老年女性 · 紧凑盘髻',headwear:'none',frames:['female.elder'],compatibilityKey:'pony'},
    {id:'elder-short-bound',label:'老者短束',note:'老年男性 · 短发收束',headwear:'none',frames:['male.elder'],compatibilityKey:'braid'},
    {id:'elder-side-knot',label:'老者侧髻',note:'老年男性 · 侧后束髻',headwear:'none',frames:['male.elder'],compatibilityKey:'pony'},
    {id:'elder-loose-back',label:'松拢长发',note:'老年专属 · 后拢长发',headwear:'none',frames:ELDER,compatibilityKey:'long'},
    {id:'elder-thin-fringe',label:'疏发',note:'老年专属 · 稀疏额发',headwear:'none',scalpExposure:'intentional',frames:ELDER,compatibilityKey:'wave'},

    ...compatibilityHairOptions,
  ],
  outfit:[
    {id:'child-short-robe',label:'童子短衣',note:'儿童专属 · 短身交领',frames:CHILD,compatibilityKey:'tee'},
    {id:'child-apprentice',label:'学童衣',note:'儿童专属 · 学徒短衫',frames:CHILD,compatibilityKey:'shirt'},
    {id:'child-play-jacket',label:'日常小褂',note:'儿童专属 · 宽松日常',frames:CHILD,compatibilityKey:'tee'},
    {id:'child-helper',label:'帮工短衣',note:'儿童专属 · 利落短褐',frames:CHILD,compatibilityKey:'jacket'},
    {id:'child-winter',label:'冬日夹袄',note:'儿童专属 · 厚领夹衣',frames:CHILD,compatibilityKey:'knit'},
    {id:'child-fine-robe',label:'锦边童衣',note:'儿童专属 · 整洁外出服',frames:CHILD,compatibilityKey:'shirt'},

    {id:'commoner',label:'平民短衣',note:'成年专属 · 交领短衣',frames:ADULT,compatibilityKey:'tee'},
    {id:'laborer',label:'劳作短褐',note:'成年专属 · 束袖工作装',frames:ADULT,compatibilityKey:'jacket'},
    {id:'merchant',label:'商贩襟衫',note:'成年专属 · 稳重对襟',frames:ADULT,compatibilityKey:'knit'},
    {id:'scholar',label:'书生长衫',note:'成年专属 · 洁净交领',frames:ADULT,compatibilityKey:'shirt'},
    {id:'artisan',label:'工匠围襟',note:'成年专属 · 耐用短衣',frames:ADULT,compatibilityKey:'jacket'},
    {id:'adult-female-ruqun',label:'日常襦裙',note:'成年女性 · 简化襦裙式上身',frames:['female.adult'],compatibilityKey:'shirt'},
    {id:'adult-female-work',label:'女工短襦',note:'成年女性 · 劳作短襦',frames:['female.adult'],compatibilityKey:'jacket'},
    {id:'adult-male-short-robe',label:'男式短袍',note:'成年男性 · 利落短袍',frames:['male.adult'],compatibilityKey:'tee'},
    {id:'adult-male-long-robe',label:'男式长衫',note:'成年男性 · 素色长衫',frames:['male.adult'],compatibilityKey:'shirt'},
    {id:'adult-winter-coat',label:'冬日夹袄',note:'成年专属 · 厚领外搭',frames:ADULT,compatibilityKey:'knit'},
    {id:'adult-service-robe',label:'城务公服',note:'成年专属 · 城市服务角色',frames:ADULT,compatibilityKey:'jacket'},
    {id:'adult-shop-assistant',label:'店伙短衫',note:'成年专属 · 店铺帮工',frames:ADULT,compatibilityKey:'knit'},

    {id:'elder-long-robe',label:'老者常服',note:'老年专属 · 宽松长衫',frames:ELDER,compatibilityKey:'shirt'},
    {id:'elder-warm-coat',label:'老者夹衣',note:'老年专属 · 厚领外搭',frames:ELDER,compatibilityKey:'knit'},
    {id:'elder-simple-robe',label:'素色长衫',note:'老年专属 · 朴素常服',frames:ELDER,compatibilityKey:'tee'},
    {id:'elder-work-jacket',label:'劳作厚褂',note:'老年专属 · 宽松劳作',frames:ELDER,compatibilityKey:'jacket'},
    {id:'elder-padded-robe',label:'冬日棉袄',note:'老年专属 · 厚实夹棉',frames:ELDER,compatibilityKey:'adult-winter-coat'},
    {id:'elder-fine-robe',label:'掌柜长衫',note:'老年专属 · 整洁外出服',frames:ELDER,compatibilityKey:'merchant'},

    ...compatibilityOutfitOptions,
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
