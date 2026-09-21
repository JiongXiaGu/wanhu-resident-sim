import {defineCatalog} from '../catalog';
import {themeHairOptions,themeOutfitOptions} from './theme-catalog';
import {ageThemeHairOptions,ageThemeOutfitOptions} from './age-theme-catalog';
import {compatibilityHairOptions,compatibilityOutfitOptions} from '../compatibility';

const CHILD=['female.child','male.child'] as const;
const ADULT=['female.adult','male.adult'] as const;
const ELDER=['female.elder','male.elder'] as const;

export const chibiCatalog=defineCatalog({
  face:[
    {id:'oval',label:'柔和',note:'椭圆轮廓 · 舒展眉眼',description:"下脸为柔和椭圆，眉眼舒展，颊部向下巴连续收圆。六个年龄性别框架保留同一脸型语义，不改变固定上头型。",keywords:["脸型", "柔和"]},
    {id:'round',label:'圆润',note:'饱满面颊 · 圆眼',description:"饱满面颊与圆润下颌形成短圆下脸，搭配较圆眼形。不是开心表情，切换表情仍保留圆脸身份。",keywords:["脸型", "圆润"]},
    {id:'angular',label:'英气',note:'明确下颌 · 细长眼',description:"下颌轮廓更明确，眉眼偏细长，转角仍保持圆润。英气来自脸型和眼形，不绑定职业或情绪。",keywords:["脸型", "英气"]},
    {id:'long',label:'清秀',note:'长圆面颊 · 短圆下巴',description:"长圆面颊缓缓收向短圆下巴，区别于尖长锥形脸。儿童与老人使用各自下脸画稿，头发不跟随脸型变形。",keywords:["脸型", "清秀"]},
    {id:'broad',label:'方圆',note:'宽颊柔角 · 舒展五官',description:"宽面颊配柔和下颌角，五官布局舒展。比圆润脸更宽平，比英气脸的下颌转折更软。",keywords:["脸型", "方圆"]},
    {id:'tapered',label:'细颌',note:'收敛下颌 · 杏形眼',description:"颊部向下收敛，细颌配杏形眼，保留圆转下巴。与清秀脸区分在收窄方向，而非拉长整个头部。",keywords:["脸型", "细颌"]},
  ],
  hair:[
    // Phase 5A：child 只展示儿童作者资产。
    {id:'child-topknot',theme:'common',label:'童子束发',note:'儿童专属 · 紧凑束髻',headwear:'none',frames:CHILD,compatibilityKey:'crop',description:"儿童头顶紧凑束髻，额前发量收短。发髻与头部连成一体，不使用成年大髻缩小替代。",keywords:["头部造型", "儿童", "童子束发"]},
    {id:'child-double-bun',theme:'common',label:'童子双髻',note:'女童专属 · 侧髻布结',headwear:'none',frames:['female.child'],compatibilityKey:'bob',description:"女童两侧圆髻配小布结，头顶和额发保持儿童比例。双髻的大轮廓比布结细节更重要。",keywords:["头部造型", "儿童", "童子双髻"]},
    {id:'child-tufted',theme:'common',label:'垂髫短发',note:'儿童专属 · 两侧垂髫',headwear:'none',frames:CHILD,compatibilityKey:'bob',description:"额前短发与两侧垂髫形成轻短发型，后发不过度下垂。以儿童侧面小发束区别于整齐短刘海。",keywords:["头部造型", "儿童", "垂髫短发"]},
    {id:'child-double-knots',theme:'common',label:'总角双束',note:'儿童专属 · 双束发环',headwear:'none',frames:CHILD,compatibilityKey:'pony',description:"头顶两束发环向两边展开，中央仍有完整额发。与实心圆双髻相比，强调发环的转折形状。",keywords:["头部造型", "儿童", "总角双束"]},
    {id:'child-side-braid',theme:'common',label:'垂髫小辫',note:'女童专属 · 侧边小辫',headwear:'none',frames:['female.child'],compatibilityKey:'braid',description:"女童一侧小辫从耳后垂下，另一侧收短，额发保持完整覆盖。偏侧轮廓用于区分双髻，不靠增加头饰。",keywords:["头部造型", "儿童", "垂髫小辫"]},
    {id:'child-half-up',theme:'common',label:'学童半束',note:'男童专属 · 半束短发',headwear:'none',frames:['male.child'],compatibilityKey:'long',description:"男童部分发量在头顶收束，其余短后发自然下落。与成年半束长发区分在短小后发和紧凑束点。",keywords:["头部造型", "儿童", "学童半束"]},
    {id:'child-short-fringe',theme:'common',label:'短刘海',note:'儿童专属 · 平短额发',headwear:'none',frames:CHILD,compatibilityKey:'wave',description:"平短额发覆盖前额，两边收向耳后，几乎没有突出的顶髻。整体短圆，适合作为无头饰儿童常用造型。",keywords:["头部造型", "儿童", "短刘海"]},

    // Phase 5B：adult 只展示成年古代作者资产。
    {id:'bound',theme:'common',label:'日常束发',note:'成年专属 · 简化束髻',headwear:'none',frames:ADULT,compatibilityKey:'crop',description:"成年日常束髻与两侧额发相连，轮廓简洁。作为基础束发起点，不限定居民职业或财富。",keywords:["头部造型", "成年", "日常束发"]},
    {id:'low-bun',theme:'common',label:'低髻',note:'成年女性 · 低位发髻',headwear:'none',frames:['female.adult'],compatibilityKey:'bob',description:"发髻落在耳后下方，额发向一侧归拢。髻体避开耳位，区别于头顶高髻和横向盘髻。",keywords:["头部造型", "成年", "低髻"]},
    {id:'work-headscarf',theme:'labor',label:'劳作头巾',note:'成年专属 · 劳作居民',headwear:'integrated',frames:ADULT,compatibilityKey:'crop',description:"完整布巾包覆头顶并在侧后收束，额前保留少量发际。帽身不被前发切成横条，适合简朴日常搭配。",keywords:["头部造型", "成年", "劳作头巾"]},
    {id:'scholar-cap',theme:'common',label:'折巾',note:'成年专属 · 学徒书生',headwear:'integrated',frames:ADULT,compatibilityKey:'crop',description:"折巾形成完整较高帽身，额前帽缘与发际分离。书生感只是创作主题，不构成职业锁定。",keywords:["头部造型", "成年", "折巾"]},
    {id:'merchant-wrap',theme:'merchant',label:'掌柜包头',note:'成年专属 · 商贩掌柜',headwear:'integrated',frames:ADULT,compatibilityKey:'crop',description:"低圆帽身配侧后布结，前缘宽而连续。与行旅包巾的斜布面、长布尾形成区别。",keywords:["头部造型", "成年", "掌柜包头"]},
    {id:'adult-high-bun',theme:'common',label:'高髻',note:'成年女性 · 利落高髻',headwear:'none',frames:['female.adult'],compatibilityKey:'pony',description:"头顶竖向高髻配一根横斜素簪，额发从中间向两侧收拢。主要依靠高出的髻体辨认。",keywords:["头部造型", "成年", "高髻"]},
    {id:'adult-side-braid',theme:'common',label:'侧编长辫',note:'成年女性 · 侧边编发',headwear:'none',frames:['female.adult'],compatibilityKey:'braid',description:"粗长辫从一侧肩前垂下，另一侧额发保持收束。发辫作为后层绘制，避免覆盖脸部五官。",keywords:["头部造型", "成年", "侧编长辫"]},
    {id:'adult-long-tied',theme:'common',label:'长发低束',note:'成年女性 · 长发收束',headwear:'none',frames:['female.adult'],compatibilityKey:'long',description:"两侧长后发垂至肩旁，低位收束成尾，额发中分。与松束发区分在较整齐的长发边界。",keywords:["头部造型", "成年", "长发低束"]},
    {id:'adult-short-bound',theme:'common',label:'短发束冠',note:'成年男性 · 紧凑束发',headwear:'none',frames:['male.adult'],compatibilityKey:'bob',description:"成年男性短束发配紧凑顶结，额前和两侧发量较短。区别于半束长发的肩旁后发。",keywords:["头部造型", "成年", "短发束冠"]},
    {id:'adult-half-up',theme:'common',label:'半束长发',note:'成年男性 · 半束垂发',headwear:'none',frames:['male.adult'],compatibilityKey:'long',description:"顶部一部分发量束起，长后发在两侧垂向肩头。中分额发和后发长度共同构成半束轮廓。",keywords:["头部造型", "成年", "半束长发"]},
    {id:'adult-side-knot',theme:'common',label:'侧束髻',note:'成年男性 · 侧后束髻',headwear:'none',frames:['male.adult'],compatibilityKey:'pony',description:"发髻位于一侧耳后，采用折叠发面而非耳状同心圆。额发顺势偏向侧后束点。",keywords:["头部造型", "成年", "侧束髻"]},
    {id:'adult-braided-tail',theme:'common',label:'束辫',note:'成年男性 · 短束编辫',headwear:'none',frames:['male.adult'],compatibilityKey:'braid',description:"顶部束发并在耳后垂出短编辫，辫尾以一圈布带收住。比女性长侧辫更短且贴近颈部。",keywords:["头部造型", "成年", "束辫"]},
    {id:'adult-brushed-back',theme:'common',label:'后拢短发',note:'成年男性 · 额前后拢',headwear:'none',frames:['male.adult'],compatibilityKey:'wave',description:"额发向后梳拢，顶部没有突出的髻体，发际呈连续后拢方向。整体清爽但不靠现代短寸发表示。",keywords:["头部造型", "成年", "后拢短发"]},
    {id:'adult-loose-tied',theme:'common',label:'松束发',note:'成年专属 · 日常低束',headwear:'none',frames:ADULT,compatibilityKey:'wave',description:"松束后发在颈侧形成较松的体积，额发不完全贴合。男女采用各自静态画稿，仍只按成年框架绘制。",keywords:["头部造型", "成年", "松束发"]},
    {id:'adult-traveler-wrap',theme:'traveler',label:'行旅包巾',note:'成年专属 · 轻便包巾',headwear:'integrated',frames:ADULT,compatibilityKey:'crop',description:"斜向布面包住头顶，一侧较长布尾垂向颈边。帽身完整，区别于掌柜包头的低圆平顺结构。",keywords:["头部造型", "成年", "行旅包巾"]},

    // Phase 5C：elder 只展示老年作者资产，男女各有独立子集。
    {id:'elder-low-knot',theme:'common',label:'老者低束',note:'老年专属 · 低位收束',headwear:'none',frames:ELDER,compatibilityKey:'bob',description:"老年低位收束，发髻不高于头顶，额前发际较柔和。年龄差异来自独立头发轮廓，不只是灰白配色。",keywords:["头部造型", "老年", "老者低束"]},
    {id:'elder-swept',theme:'common',label:'老者拢发',note:'老年专属 · 贴头拢发',headwear:'none',frames:ELDER,compatibilityKey:'crop',description:"老年贴头拢发，发量顺着头部向后集中。内部发际允许体现年龄，但外轮廓仍覆盖固定头框。",keywords:["头部造型", "老年", "老者拢发"]},
    {id:'elder-soft-bun',theme:'common',label:'松软低髻',note:'老年女性 · 柔和低髻',headwear:'none',frames:['female.elder'],compatibilityKey:'braid',description:"老年女性松软低髻，髻体放在耳后下方，额发转折柔和。与紧盘髻区分在蓬松体积。",keywords:["头部造型", "老年", "松软低髻"]},
    {id:'elder-coiled-bun',theme:'common',label:'盘髻',note:'老年女性 · 紧凑盘髻',headwear:'none',frames:['female.elder'],compatibilityKey:'pony',description:"老年女性将发量盘成紧凑髻体，额发与盘发连续衔接。区别于松软低髻的宽松边缘。",keywords:["头部造型", "老年", "盘髻"]},
    {id:'elder-short-bound',theme:'common',label:'老者短束',note:'老年男性 · 短发收束',headwear:'none',frames:['male.elder'],compatibilityKey:'braid',description:"老年男性短发收束为小髻，侧面和颈后发量克制。沿用独立老年头框，不缩放成年束发。",keywords:["头部造型", "老年", "老者短束"]},
    {id:'elder-side-knot',theme:'common',label:'老者侧髻',note:'老年男性 · 侧后束髻',headwear:'none',frames:['male.elder'],compatibilityKey:'pony',description:"老年侧后髻由折面收束，避开耳朵位置并适度向后下移。没有贴着耳廓的重复圆形轮廓。",keywords:["头部造型", "老年", "老者侧髻"]},
    {id:'elder-loose-back',theme:'common',label:'松拢长发',note:'老年专属 · 后拢长发',headwear:'none',frames:ELDER,compatibilityKey:'long',description:"老年长发松松后拢，颈旁留有下垂发量。与紧束老者低髻区分在侧后发的松散程度。",keywords:["头部造型", "老年", "松拢长发"]},
    {id:'elder-thin-fringe',theme:'common',label:'疏发',note:'老年专属 · 稀疏额发',headwear:'none',scalpExposure:'intentional',frames:ELDER,compatibilityKey:'wave',description:"退后的内部发际呈现疏发与少量额发，外缘仍有头发包络。允许露内部头皮，不允许固定头框从外侧冒出。",keywords:["头部造型", "老年", "疏发"]},

    ...themeHairOptions,
    ...ageThemeHairOptions,
    ...compatibilityHairOptions,
  ],
  outfit:[
    {id:'child-short-robe',theme:'common',label:'童子短衣',note:'儿童专属 · 短身交领',frames:CHILD,compatibilityKey:'tee',description:"儿童短身交领，肩形轻窄，斜襟连续进入主衣片。胸像范围不画成人裙腰或腰带。",keywords:["衣装", "儿童", "童子短衣"]},
    {id:'child-apprentice',theme:'common',label:'学童衣',note:'儿童专属 · 团领短衫',frames:CHILD,compatibilityKey:'shirt',description:"儿童团形领口配简洁短衫，前胸为完整衣片。学童只是创作主题，不限制儿童生活行为。",keywords:["衣装", "儿童", "学童衣"]},
    {id:'child-play-jacket',theme:'common',label:'日常小褂',note:'儿童专属 · 对襟小褂',frames:CHILD,compatibilityKey:'tee',description:"圆顺短肩的对襟外褂包住交领内衫，领端收在中央。内外衣分开阅读，不在锁骨处形成尖折。",keywords:["衣装", "儿童", "日常小褂"]},
    {id:'child-helper',theme:'labor',label:'帮工短衣',note:'儿童专属 · 利落短褐',frames:CHILD,compatibilityKey:'jacket',description:"利落窄缘儿童短褐，肩片与前襟相连，不用围裙吊带补轮廓。与成人工作装保持不同肩身比例。",keywords:["衣装", "儿童", "帮工短衣"]},
    {id:'child-winter',theme:'common',label:'冬日夹袄',note:'儿童专属 · 对襟夹棉',frames:CHILD,compatibilityKey:'knit',description:"儿童对襟夹棉衣，领口较厚、肩形较饱满。门襟连续，靠夹棉体积而不是围脖细条表示冬装。",keywords:["衣装", "儿童", "冬日夹袄"]},
    {id:'child-fine-robe',theme:'common',label:'锦边童衣',note:'儿童专属 · 方领锦边',frames:CHILD,compatibilityKey:'shirt',description:"儿童外搭带方形锦边开口，内衫藏在外衣之下。体面感来自平整宽边，不堆金饰或宫廷纹样。",keywords:["衣装", "儿童", "锦边童衣"]},

    {id:'commoner',theme:'common',label:'平民短衣',note:'成年专属 · 交领短衣',frames:ADULT,compatibilityKey:'tee',description:"成年基础交领短衣，肩线平顺，斜襟贯通画布下边缘。没有强烈职业标识，作为普通日常搭配。",keywords:["衣装", "成年", "平民短衣"]},
    {id:'laborer',theme:'labor',label:'劳作短褐',note:'成年专属 · 束袖工作装',frames:ADULT,compatibilityKey:'jacket',description:"窄交领短褐配收紧的劳作肩形，一处低对比补缀辅助质感。补缀不承担服装主要识别。",keywords:["衣装", "成年", "劳作短褐"]},
    {id:'merchant',theme:'merchant',label:'商贩襟衫',note:'成年专属 · 稳重对襟',frames:ADULT,compatibilityKey:'knit',description:"两片对襟前身由连续深色宽缘收口，胸前保留两处系结。商贩主题不影响自由搭配或居民职业。",keywords:["衣装", "成年", "商贩襟衫"]},
    {id:'scholar',theme:'common',label:'书生长衫',note:'成年专属 · 洁净交领',frames:ADULT,compatibilityKey:'shirt',description:"浅色宽交领覆盖前胸，衣片平整，肩形较舒展。长衫只呈现上身，不在胸口硬塞腰部结构。",keywords:["衣装", "成年", "书生长衫"]},
    {id:'artisan',theme:'labor',label:'工匠短褐',note:'成年专属 · 耐用短衣',frames:ADULT,compatibilityKey:'jacket',description:"工匠短褐以耐用主衣片和贯通斜襟表达，不使用悬空围裙吊带。可与任意适用头部造型组合。",keywords:["衣装", "成年", "工匠短褐"]},
    {id:'adult-female-ruqun',theme:'common',label:'交领短襦',note:'成年女性 · 简化襦裙式上身',frames:['female.adult'],compatibilityKey:'shirt',description:"成年女性交领短襦的上身简化画稿，领边连接主衣片。裙腰位于胸像之外，不在底部添加挡板。",keywords:["衣装", "成年", "交领短襦"]},
    {id:'adult-female-work',theme:'labor',label:'女工短襦',note:'成年女性 · 劳作短襦',frames:['female.adult'],compatibilityKey:'jacket',description:"窄肩小褂包住交领内衫，两侧外衣边缘连续。内领末端压在前领之下，避免胸口突出白色尖角。",keywords:["衣装", "成年", "女工短襦"]},
    {id:'adult-male-short-robe',theme:'common',label:'男式短袍',note:'成年男性 · 利落短袍',frames:['male.adult'],compatibilityKey:'tee',description:"成年男性短袍以窄交领和干净侧襟表现，肩形收束。无徽章和强职业符号，适合日常使用。",keywords:["衣装", "成年", "男式短袍"]},
    {id:'adult-male-long-robe',theme:'common',label:'男式长衫',note:'成年男性 · 素色长衫',frames:['male.adult'],compatibilityKey:'shirt',description:"团领素色长衫，在一侧小幅闭合，前胸保持整面。小系结辅助说明穿着关系，不作为主要差异。",keywords:["衣装", "成年", "男式长衫"]},
    {id:'adult-winter-coat',theme:'common',label:'冬日夹袄',note:'成年专属 · 厚领外搭',frames:ADULT,compatibilityKey:'knit',description:"宽短夹棉领沿两侧门襟连续向下，肩形更饱满。与普通对襟区别在厚边和包裹体积。",keywords:["衣装", "成年", "冬日夹袄"]},
    {id:'adult-service-robe',theme:'common',label:'城务公服',note:'成年专属 · 城市服务角色',frames:ADULT,compatibilityKey:'jacket',description:"圆领与偏侧闭合构成利落上身，不画胸牌或现代肩章。城务只是外观主题，不绑定实际岗位。",keywords:["衣装", "成年", "城务公服"]},
    {id:'adult-shop-assistant',theme:'merchant',label:'店伙短衫',note:'成年专属 · 店铺帮工',frames:ADULT,compatibilityKey:'knit',description:"无袖短褂的两片外衣压住交领内衫，门襟落点清楚。胸前没有独立围裙吊带和横向腰带。",keywords:["衣装", "成年", "店伙短衫"]},

    {id:'elder-long-robe',theme:'common',label:'老者常服',note:'老年专属 · 宽松长衫',frames:ELDER,compatibilityKey:'shirt',description:"老年宽松常服，肩形柔和，领口自然连接长衣前片。使用老年独立上身比例，年龄不只靠颜色。",keywords:["衣装", "老年", "老者常服"]},
    {id:'elder-warm-coat',theme:'common',label:'老者罩衣',note:'老年专属 · 交领内衫与罩衣',frames:ELDER,compatibilityKey:'knit',description:"交领内衫位于两片宽松罩衣下面，外搭开口不过度挤向中线。取消悬空细条和没有落点的中央系结。",keywords:["衣装", "老年", "老者罩衣"]},
    {id:'elder-simple-robe',theme:'common',label:'素色长衫',note:'老年专属 · 团领常服',frames:ELDER,compatibilityKey:'tee',description:"老年团领常服，颈口与胸前主衣片关系简单。宽松轮廓与素面衣片适合普通日常搭配。",keywords:["衣装", "老年", "素色长衫"]},
    {id:'elder-work-jacket',theme:'labor',label:'劳作厚褂',note:'老年专属 · 宽松劳作',frames:ELDER,compatibilityKey:'jacket',description:"老年劳作厚褂以较宽松肩形和朴素边缘表达耐用感。保留独立老年上身，不直接使用成年短褐缩放。",keywords:["衣装", "老年", "劳作厚褂"]},
    {id:'elder-padded-robe',theme:'common',label:'冬日棉袄',note:'老年专属 · 对襟夹棉',frames:ELDER,compatibilityKey:'adult-winter-coat',description:"老年对襟夹棉衣，肩身宽松，门襟有明显厚度。衣领与主衣片连续，不出现孤立围脖细条。",keywords:["衣装", "老年", "冬日棉袄"]},
    {id:'elder-fine-robe',theme:'merchant',label:'掌柜长衫',note:'老年专属 · 宽缘对襟',frames:ELDER,compatibilityKey:'merchant',description:"两片前衣的宽缘持续到底，内衫只露领口，两处系结分开安排。掌柜感来自平整边面，不在中线堆细节。",keywords:["衣装", "老年", "掌柜长衫"]},

    ...themeOutfitOptions,
    ...ageThemeOutfitOptions,
    ...compatibilityOutfitOptions,
  ],
  expression:[
    {id:'calm',label:'平静',description:"眉眼和嘴型保持平静，没有额外情绪符号。保留所选脸型的眼形与身份，只改变表情画稿。",keywords:["表情", "平静"]},
    {id:'smile',label:'微笑',description:"嘴角轻轻上扬，眉眼自然，腮红克制。用于日常微笑，与更明显的开心表情区分。",keywords:["表情", "微笑"]},
    {id:'joy',label:'开心',description:"笑容和眼部变化比微笑更明显，表达轻快愉悦。脸型轮廓不变，情绪细节位于前发之下。",keywords:["表情", "开心"]},
    {id:'angry',label:'不满',description:"眉形与嘴型收紧，呈现不满或生气。情绪不改变脸型，不把英气脸固定为愤怒状态。",keywords:["表情", "不满"]},
    {id:'sad',label:'难过',description:"眉眼与嘴角表达难过，变化集中在五官。腮红和情绪细节仍遵守当前脸部安全区。",keywords:["表情", "难过"]},
    {id:'surprise',label:'惊讶',description:"张开的嘴型与睁大的眼部表现惊讶，眉形随之抬起。保持原脸型下颌与上头框不变。",keywords:["表情", "惊讶"]},
    {id:'shy',label:'害羞',note:'低眉 · 加深腮红',compatibilityKey:'smile',description:"低眉与加深腮红表现害羞，嘴型保持收敛。腮红只由表情层绘制，不越过所选脸型边界。",keywords:["表情", "害羞"]},
    {id:'serious',label:'认真',note:'平眉 · 收紧嘴型',compatibilityKey:'calm',description:"平眉与收紧嘴型表达认真，不添加额外装饰符号。与不满表情区分在克制的眉口关系。",keywords:["表情", "认真"]},
  ],
} as const);

export type FaceId=typeof chibiCatalog.face[number]['id'];
export type HairId=typeof chibiCatalog.hair[number]['id'];
export type OutfitId=typeof chibiCatalog.outfit[number]['id'];
export type ExpressionId=typeof chibiCatalog.expression[number]['id'];
