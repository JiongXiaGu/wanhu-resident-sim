import type {CatalogOption} from '../catalog';

// 主题只是作者与检索信息；不限制职业，不写入 Recipe。
export const themeHairOptions=[
 {"id":"adult-loop-bun","label":"弯月盘髻","note":"横向弯月髻 · 偏侧收发","description":"横向盘髻从左上头顶弯起，额发向侧面收拢。区别于耳后低髻，缩小时主要看头顶偏侧的弧形体积。","tags":["常服","8D1","8D1-A","盘发","偏侧","弯月"],"frames":["female.adult"],"compatibilityKey":"bob","headwear":"none"},
 {"id":"adult-ribbon-fall","label":"素带半披","note":"两侧披发 · 低位布带","description":"左右后发垂至肩边，末端外展，低位素带收住一侧。比长发低束更松散，辨识依靠肩旁的两片发量而非布带颜色。","tags":["常服","8D1","8D1-A","半披","长发","布带"],"frames":["female.adult"],"compatibilityKey":"long","headwear":"none"},
 {"id":"adult-flat-knot","label":"扁束发髻","note":"横扁发结 · 中间束带","description":"头顶横向折叠成扁宽发结，以窄带在中间收紧。与高髻的竖向体积区分，男女共用成年头部画稿。","tags":["常服","8D1","8D1-A","扁髻","束发","横向"],"frames":["female.adult","male.adult"],"compatibilityKey":"crop","headwear":"none"},
 {"id":"adult-center-part","label":"中分短束","note":"中分额发 · 颈后短束","description":"中分额发在两侧折向耳后，后发只在颈旁露出短角。没有突出的顶髻，轮廓比半束长发短而收敛。","tags":["常服","8D1","8D1-A","中分","短束","后发"],"frames":["male.adult"],"compatibilityKey":"bob","headwear":"none"},
 {"id":"adult-work-braid-coil","label":"编辫盘髻","note":"绕顶编辫 · 收拢后发","description":"粗编辫绕过头顶形成一圈起伏的外轮廓，后发完全收拢。劳作感来自集中发量，不靠灰色或细碎发丝区分。","tags":["劳作","8D1","8D1-A","编辫","绕顶","盘髻"],"frames":["female.adult"],"compatibilityKey":"braid","headwear":"none"},
 {"id":"adult-work-fold-wrap","label":"折角包头","note":"折角布面 · 短后结","description":"两块折角布面围住头顶，侧后留短结。帽身用完整前层表现，与圆顶包头的区别是明显的折面和收短的布尾。","tags":["劳作","8D1","8D1-A","折角","包头","头巾"],"frames":["female.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-work-front-knot","label":"额结汗巾","note":"窄汗巾 · 额侧布结","description":"窄汗巾环绕额上，左额侧有明确布结和一截短尾，顶部发髻仍露出。不同于全包头巾，主体依然是束发。","tags":["劳作","8D1","8D1-A","汗巾","额结","窄带"],"frames":["female.adult","male.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-work-short-tail","label":"短尾束巾","note":"额前窄巾 · 侧后短尾","description":"额前薄巾约束碎发，短发尾从侧后垂至颈旁并再次束住。短尾比束辫更粗整，不添加垂到胸前的长辫。","tags":["劳作","8D1","8D1-A","短尾","束巾","额带"],"frames":["male.adult"],"compatibilityKey":"pony","headwear":"integrated"},
 {"id":"adult-shop-fan-bun","label":"扇形整髻","note":"扇状顶髻 · 整齐分发","description":"顶髻向左右展开成低扇形，中心额发整齐分开。与圆形高髻区分在顶部展开角度，适合作为整洁日常头部造型。","tags":["商铺","8D1","8D1-B","扇形","顶髻","整洁"],"frames":["female.adult"],"compatibilityKey":"pony","headwear":"none"},
 {"id":"adult-shop-pin-knot","label":"单簪斜髻","note":"斜向发簪 · 侧后髻","description":"发髻集中在耳后外侧，一根素簪斜向穿过，发际向同侧归拢。髻体避开耳朵，不用珠饰数量表示身份。","tags":["商铺","8D1","8D1-B","发簪","斜髻","侧后"],"frames":["female.adult"],"compatibilityKey":"bob","headwear":"none"},
 {"id":"adult-shop-soft-cap","label":"软顶布帽","note":"低圆软顶 · 平整帽缘","description":"软布帽顶有轻微偏侧起伏，下缘平整且连续。没有硬折巾的高直帽身，整体偏低圆，男女均可搭配。","tags":["商铺","8D1","8D1-B","软帽","圆顶","布帽"],"frames":["female.adult","male.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-shop-square-wrap","label":"方顶包巾","note":"方折帽顶 · 宽布缘","description":"包巾在顶部折出方形平面，宽布缘沿额前围合。区别于圆顶掌柜包头，主要靠方顶与两肩式折角辨认。","tags":["商铺","8D1","8D1-B","方顶","包巾","折面"],"frames":["male.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-travel-double-coil","label":"双绕发髻","note":"双绕紧髻 · 短束带","description":"两侧上方各有一个向后绕紧的小髻，中央额发保持中分。与儿童双髻不同，成年发髻贴近头顶、收得更紧。","tags":["行旅","8D1","8D1-B","双绕","紧髻","双结"],"frames":["female.adult"],"compatibilityKey":"pony","headwear":"none"},
 {"id":"adult-travel-kerchief","label":"垂角风巾","note":"斜覆巾面 · 两侧垂角","description":"斜覆布巾包住头顶，两侧垂角落至颈旁但不盖住面部。相较短包巾，辨识依靠两条连在帽身上的长布面。","tags":["行旅","8D1","8D1-B","风巾","垂角","包覆"],"frames":["female.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-travel-straw-hat","label":"宽檐斗笠","note":"低锥笠顶 · 宽展帽檐","description":"低锥形笠顶向两侧展开成宽檐，下缘完整盖过额发。笠绳在后层，面部不被绳线横穿；男女共用，不限制职业。","tags":["行旅","8D1","8D1-B","斗笠","宽檐","草编"],"frames":["female.adult","male.adult"],"compatibilityKey":"crop","headwear":"integrated"},
 {"id":"adult-travel-high-tail","label":"高束垂尾","note":"高位束发 · 弧形垂尾","description":"高位发束向后上方扬起再垂落，呈现清楚的单侧弧形尾部。与松束、半束长发相比，变化集中在头顶外轮廓。","tags":["行旅","8D1","8D1-B","高束","垂尾","后扬"],"frames":["male.adult"],"compatibilityKey":"pony","headwear":"none"},
] as const satisfies readonly CatalogOption[];

export const themeOutfitOptions=[
 {"id":"adult-home-soft-cross","label":"柔缘交领","note":"柔和肩线 · 浅缘斜襟","description":"浅色窄领沿内衫斜向贯通胸口，肩线舒缓。日常感来自小幅叠领和完整衣片，不在胸像下缘添加腰带。","tags":["常服","8D1","8D1-A","柔缘","交领","素衫"],"frames":["female.adult","male.adult"],"compatibilityKey":"tee"},
 {"id":"adult-home-round-open","label":"团口素衫","note":"团形领口 · 短直开口","description":"团形小领在正面接一条窄直开口，与闭合团领、宽缘对襟区分。系结只辅助结构，小尺寸主要看圆口和直襟。","tags":["常服","8D1","8D1-A","团领","直襟","素色"],"frames":["female.adult","male.adult"],"compatibilityKey":"tee"},
 {"id":"adult-home-short-over","label":"薄褂叠衫","note":"方形开口 · 薄褂外搭","description":"薄外褂在胸前形成完整方形开口，里面露出交领衫。方口下方仍是连续衣片，不把裙腰画到胸口。","tags":["常服","8D1","8D1-A","方口","叠穿","薄褂"],"frames":["female.adult"],"compatibilityKey":"knit"},
 {"id":"adult-home-deep-wrap","label":"深襟常衫","note":"深交叠前片 · 竖向大襟","description":"较深的交叠衣襟斜向中下胸，前片形成较整齐的竖向面积。比短交领更深长，不依赖额外腰带表示长衫。","tags":["常服","8D1","8D1-A","深襟","大襟","交领"],"frames":["male.adult"],"compatibilityKey":"shirt"},
 {"id":"adult-work-shoulder-vest","label":"护肩短褂","note":"宽肩外褂 · 两片前身","description":"无袖外褂覆盖肩头，前片向下连续展开，交领内衫在中间露出。护肩来自衣片宽度，不画成围裙吊带或硬甲。","tags":["劳作","8D1","8D1-A","护肩","无袖","外褂"],"frames":["female.adult","male.adult"],"compatibilityKey":"jacket"},
 {"id":"adult-work-slant-coat","label":"斜襟短褐","note":"团口斜闭合 · 收窄肩形","description":"团形内领与偏侧斜襟连接，主衣片收窄，留一处低对比补缀。区别于普通交领在斜闭合走向，不靠补丁数量识别。","tags":["劳作","8D1","8D1-A","斜襟","短褐","补缀"],"frames":["male.adult"],"compatibilityKey":"jacket"},
 {"id":"adult-work-tucked-jacket","label":"窄缘短襦","note":"窄肩深领 · 收紧前片","description":"短襦肩形与胸前衣片收拢，深交领用窄缘贯通，下摆在画布外。保持简洁，没有悬空绑带或胸口腰封。","tags":["劳作","8D1","8D1-A","窄缘","短襦","深交领"],"frames":["female.adult"],"compatibilityKey":"jacket"},
 {"id":"adult-work-collarless","label":"无领外褂","note":"低位开口 · 分离前片","description":"无领外褂从肩侧下落，正中大面积露出团领内衫。外褂边缘不挤向中线，与窄开口店伙短褂区分。","tags":["劳作","8D1","8D1-A","无领","外褂","内衫"],"frames":["female.adult","male.adult"],"compatibilityKey":"jacket"},
 {"id":"adult-shop-bordered-gown","label":"双缘襟衫","note":"双道宽缘 · 对襟前片","description":"对襟两侧有连续宽缘及一道细亮边，两处系结落在明确前片上。整洁感来自成面的门襟，不用徽章或金饰表示官职。","tags":["商铺","8D1","8D1-B","双缘","对襟","宽缘"],"frames":["female.adult","male.adult"],"compatibilityKey":"knit"},
 {"id":"adult-shop-short-vest","label":"短领店褂","note":"短折领口 · 无袖前片","description":"短领外褂沿胸前转折为窄对襟，团领内衫与外褂分层。肩部比护肩短褂轻窄，可搭配任何成年居民。","tags":["商铺","8D1","8D1-B","短领","店褂","无袖"],"frames":["female.adult","male.adult"],"compatibilityKey":"knit"},
 {"id":"adult-shop-pleated-jacket","label":"折领铺衫","note":"短折领片 · 整齐叠穿","description":"左右短折领向外翻出浅色衬面，交领内衫藏在其下。依靠领片折面与平整肩形区分，不扩展独立饰品。","tags":["商铺","8D1","8D1-B","折领","翻折","铺衫"],"frames":["female.adult"],"compatibilityKey":"shirt"},
 {"id":"adult-shop-side-robe","label":"侧襟长衣","note":"圆领偏闭合 · 整面前襟","description":"圆领连接偏向右侧的宽襟，胸前保留一块完整主衣片。与正中对襟区分在闭合位置，没有职业专用胸牌。","tags":["商铺","8D1","8D1-B","侧襟","圆领","长衣"],"frames":["male.adult"],"compatibilityKey":"shirt"},
 {"id":"adult-travel-shoulder-cape","label":"短披肩","note":"两片披肩 · 宽展肩部","description":"两片短披肩从颈部包向肩外，内衫与中间开口清楚分离。披肩边缘止于上胸，主衣片继续向下，系绳连接两侧。","tags":["行旅","8D1","8D1-B","披肩","包裹","外搭"],"frames":["female.adult","male.adult"],"compatibilityKey":"jacket"},
 {"id":"adult-travel-cross-coat","label":"裹襟行衣","note":"宽裹交领 · 厚实肩形","description":"宽交领斜裹上胸并连续接入衣片，肩部厚实。包裹感来自宽大的领面，不另外画一条悬空围脖。","tags":["行旅","8D1","8D1-B","裹襟","宽领","厚衣"],"frames":["female.adult","male.adult"],"compatibilityKey":"knit"},
 {"id":"adult-travel-shawl-jacket","label":"披帛罩衫","note":"斜搭披帛 · 连续肩面","description":"宽披帛由一侧肩头斜搭到另一侧，衬边随布面连续转折。与对称披肩区分在斜向大色面，不画成细吊带。","tags":["行旅","8D1","8D1-B","披帛","斜搭","罩衫"],"frames":["female.adult"],"compatibilityKey":"knit"},
 {"id":"adult-travel-high-coat","label":"厚领行袍","note":"包颈厚缘 · 合拢前襟","description":"厚缘从颈旁向下接入门襟，内衬形成短而有厚度的领面。比常服更包裹，避免尖领、金属扣等现代制服符号。","tags":["行旅","8D1","8D1-B","厚领","包颈","行袍"],"frames":["male.adult"],"compatibilityKey":"knit"},
] as const satisfies readonly CatalogOption[];

export const themeGroups=[{id:"common",label:"常服"},{id:"labor",label:"劳作"},{id:"merchant",label:"商铺"},{id:"traveler",label:"行旅"}] as const;
