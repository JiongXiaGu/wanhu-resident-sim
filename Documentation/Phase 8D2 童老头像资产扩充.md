# Phase 8D2：童老头像资产扩充

## 范围与设计意图

用户验收 Phase 8D1 后批准进入下一阶段。本批从 `70ca1ccd9cc5fa75491267ce29d20043df942994` 承接，补充儿童与老年的日常、帮忙劳作、整洁常服和出行轮廓；不重画已认可的成年素材，不进入 8C 界面大改。

儿童新增 6 Hair / 6 Outfit，老人新增 6 Hair / 6 Outfit，合计 **12 Hair + 12 Outfit ID**。每个年龄、每个类别含两个女款、两个男款、两个共享语义款；共享款在对应 Frame 使用独立作者路径。新增共 32 个适用 Frame / 资产组合，不是 32 个新 ID。全库当前为 **6 Face / 58 Hair / 52 Outfit / 8 Expression**，共 124 个玩家可选资产；十个 compatibility-only ID 不计入。

| Frame | Hair | Outfit | 本批新增 Hair / Outfit |
| --- | ---: | ---: | ---: |
| female.child | 10 | 10 | 4 / 4 |
| male.child | 9 | 10 | 4 / 4 |
| female.elder | 10 | 10 | 4 / 4 |
| male.elder | 10 | 10 | 4 / 4 |
| female.adult | 22 | 22 | 0 / 0 |
| male.adult | 19 | 22 | 0 / 0 |

儿童从垂肩双辫、偏侧发环、扁折发结、短束尾、童巾和小笠建立短而清晰的头部轮廓；衣装用小弧领、短肩叠层、偏侧襟、直缘前片、完整罩衣和圆摆短披区分。帮忙主题不指定儿童职业，不复制成人店伙制服。

老人用低位横折髻、绕顶平辫、扁束、颈后短尾、软折巾和矮檐便帽补充发量分布；衣装强调落肩、包覆、完整前片和宽松叠穿。年龄特征不能仅靠灰染成年头发或缩放成年肩身。商铺主题只说明整洁常服，不绑定官职或财富。

主题仍使用 common / labor / merchant / traveler，不强求两个年龄都凑齐同等职业套装。只要 Frame 适用，四类部件自由混搭；不加入自动配装或职业权重。

## 资源与文字所有权

`age-theme-catalog.ts` 是本批 24 个新 ID 的正式名称、description、theme、keywords、frames、silhouette、closestAssetId、distinction、readability 和 compatibilityKey 权威。沿用 `ThemeCatalogOption`，不再引入第二份检索 JSON 或数据库。下面逐项清单是只读文档镜像，Review 对每一行逐字段核对；Artifact 的 asset-descriptions.json 也只是导出。

`child-theme-hair.ts` / `elder-theme-hair.ts` 与 `child-theme-outfits.ts` / `elder-theme-outfits.ts` 分别拥有对应年龄的固定 SVG 画稿。`hair.ts`、`outfits.ts` 先尝试这些显式新增分发，再走原有路径。Catalog 决定可用性，不通过 ID 前缀猜测主题或年龄适用范围。没有改旧 ID 的画稿、适用 Frame、默认配方或兼容键。

共享 ID 不等于全龄共用画稿：本批的童巾、小笠、老年软巾、便帽以及共享衣装都在对应男女 Frame 使用独立帽缘、后结或肩身路径；同年龄的基础额发笔画允许复用。头发完全不读取 Face，禁止 solver、自动 fit、mask / clipPath 和缩放补洞。帽巾归 Hair 的 Headwear 作者层，不新增玩家类别。

Outfit 保持 base / collar / overlay / detail，base 与 collar 必须有真实路径。罩衣前片要从肩头连到画布外，不画成两条吊带；胸像不塞入腰带、裙腰或无意义底部横块。

## 检索与编辑边界

沿用 8D1 的纯函数检索，不重排工坊。选儿童或老人、头发或衣服，保持“全部素材”，搜 `8D2` 查看本批，搜 `8D2 行旅`、`双辫`、`布巾`、`落肩` 等查轮廓。支持名称、描述、关键词、主题、ID 和 exact Frame；NFKC 与空格 AND 规则不变。

本批卡片标“本批新增”；成年 8D1 卡片改标“8D1”，不把上批仍称为本批。历史“仅已重画”仍是原样板清单，不包含新扩库资产；与 8D2 搜索组合为空时可以一键重置。随机本类遵守搜索，随机搭配不受文本搜索影响，均不暴露 compatibility-only ID。

文字、主题、年龄和检索词不进入 Recipe 或保存键。四类选项、六份独立自由样板、玩家和居民旧键不变；导入只改预览，应用才保存。绑定居民锁定 Frame，不改姓名、家庭、职业、故事和日期。正式 portrait fallback 保留，恢复原头像只移除当前目标覆盖。

## 画面短循环发现与修正

首轮真实 Renderer 图板中，横盘低髻两侧圆结接近耳位，容易像额外耳朵。已下移到下颌外侧，改成低扁折面，去掉同心圆式髻体；仍通过四个 Hair 层与固定 Head Frame 工作。弧领小衫原有领下小系结太孤立，已改成从领口接到画布外的连续中缝。两处修正后重新打开 320 / 96 / 64 / 48px 图板并验证覆盖，不修改脸型或成年资源。

## Review 契约与产物

继续运行全部旧 Review。8B1 的“仅已重画”点选明确限定其历史 ID，旧款不消失；8D1 的增量点选、文档镜像及新增几何范围限定其 8D1 清单，不把 8D2 当作漏审成年资产。通用 Review 仍遍历整个实时 Catalog，包括新增童老、Head Frame / Coverage、Hair 跨 Face、腮红、兼容、保存导入、冲突失败、居民逻辑与正式 fallback。没有删除有效旧断言来适应扩库，原童老每类 12 项密度上限不提高。

新增 `capture-avatar-age-themes.mjs` 复用现有 renderBoards 和 baseline exporter。它核对全部 132 份旧固定配方渲染逐字节不变，点选全部 32 个新 Frame / 资产组合，检查 24 份元数据和文档同行同步，验证 144 次 Frame 可用性 / 回退与 192 次跨 Face 图层不变。Hair 额角曲线抽样 1312 个位置并检查周围 2 单位余量；几何签名排除完全相同路径的换色副本。抽样或签名不同不能代替审美判断。

新 ID 还经过四份童老样板保存刷新、四次真实 JSON 导出 / 改稿 / 导入往返，以及四种 Frame 的真实居民绑定、独立键保存和恢复；成年搜索 8D2 必须无结果。保存记录不含任何描述、年龄或主题字段。

正式 Artifact 在 `avatar/phase8d2/`：

- `hair-<frame>.png` / `outfit-<frame>.png` 共八张逐项诊断，`phase8d2-overview.png` 一张组合总览，`child-faces-and-collars.png` / `elder-faces-and-collars.png` 两张六脸型组合，共 11 张静态图板。
- `studio-<frame>-<part>.png` 八张真实筛选工坊，`all-<frame>-<part>[-end].png` 十六张全量列表首尾，`bound-<frame>.png` 四张实际居民绑定，共 28 张真实桌面截图。
- `native/<frame>/<part>/` 保存全部 32 个新增适用组合的 96 / 64 / 48px 原尺寸输出，共 96 张；逐图校验实际宽高，不从大截图裁片伪造。
- `age-themes-review.json` 与 `asset-descriptions.json` 保存机器计数和只读 metadata；`avatar/source-commit.txt` 和源码包用于核对提交。

候选稳定后必须跑 Build 与 Resident Visual Review，下载同 SHA Artifact，实际打开静态图板、真实工坊、绑定居民和原尺寸图；重新读取 main 后非 force 推进，再跑 main 两项并下载复核。最新机器和浏览器结果以对应 Actions 为准。CI PASS 不表示用户已经认可新画稿。

## 本批逐项资产清单

修改文字先改正式 Catalog，再同步下表；closestAssetId 只用于旧款造型对照，不是配方回退规则。

### 儿童

| ID | 分类 / 名称 | 描述 | theme | keywords | 适用 Frame | 核心轮廓 | 最相似旧 ID | 真实差异 | 96px / 64px / 48px |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `child-twin-short-braids` | hair / 垂肩双辫 | 两束短辫从耳后向外下方垂落，顶上不扎圆髻。短辫止于肩上，保持儿童发量与圆短头形，不借用成年长辫。 | common | 8D2、儿童、日常、双辫、短辫、低束 | female.child | 耳后对称两束短辫，平顺圆顶 | `child-side-braid` | 单侧长辫改成两侧短辫，发量集中在耳后而非头顶 | 96px：双短辫折面与收束点；64px：两侧下垂的短发量；48px：低位双尾 |
| `child-side-loop` | hair / 侧环小髻 | 头顶一侧向外弯出紧凑环髻，额发顺向偏梳，颈边收短。只保留一个偏侧束点，与对称双髻或耳边小辫区分。 | common | 8D2、儿童、日常、侧环、小髻、偏梳 | female.child | 左上弯环髻，侧梳额发，无颈侧长尾 | `child-double-bun` | 两个侧圆髻改为一个偏顶弯环，不以布结配色区分 | 96px：偏顶弯环和侧梳方向；64px：单侧顶髻；48px：偏侧顶环 |
| `child-folded-knot` | hair / 折髻短束 | 发束在头顶向一侧折成扁短髻，额前分为宽短发面。比竖起的童子束发更低平，不画成年束冠或高帽身。 | common | 8D2、儿童、日常、折髻、短束、横折 | male.child | 顶上一侧扁折髻，宽短额发 | `child-topknot` | 竖圆顶髻改为偏侧横折，额发也改成宽短分片 | 96px：横折发面与短额发；64px：扁折的偏顶体积；48px：低扁偏髻 |
| `child-ribbon-tail` | hair / 束带短尾 | 一束短发从耳后斜向外侧收紧，末端分成两片短角，额发向后拢。出行时发量集中，尾端不过肩，不做成人高马尾。 | traveler | 8D2、儿童、行旅、束带、短尾、出行 | male.child | 单侧耳后短尾，后拢额发，无高髻 | `child-half-up` | 半束后发改成可见的单侧短尾，取消隐在脑后的长束 | 96px：短尾分片及束带落点；64px：单侧耳后外展；48px：单侧短尾 |
| `child-helper-wrap` | hair / 窄结童巾 | 浅折布巾完整包住儿童头顶，侧后只留短布结，额边露少量短发。男童女童使用各自巾缘与鬓角画稿，不缩放成年包头。 | labor | 8D2、儿童、劳作、童巾、包头、帮忙、短结 | female.child、male.child | 低折巾顶，完整额缘，侧后短布结 | `child-short-fringe` | 裸发圆顶改成完整布巾面与短结，帽巾归 Hair 内层 | 96px：巾面折角、短结和鬓发；64px：低折帽面与侧结；48px：短结包头 |
| `child-outing-hat` | hair / 出游小笠 | 圆缓笠顶连接外展帽檐，帽缘连续盖住额发，两侧笠绳留在背层。儿童笠顶较圆、比例较低，不将成年尖笠直接缩小。 | traveler | 8D2、儿童、行旅、小笠、斗笠、出游、宽檐 | female.child、male.child | 圆缓顶、宽而下垂的笠檐 | `child-topknot` | 竖向发髻替换为横向整片帽檐，儿童头框独立覆盖 | 96px：圆顶编纹和笠檐连接；64px：圆顶宽檐；48px：圆笠宽檐 |
| `child-arc-collar` | outfit / 弧领小衫 | 两片圆短领面从颈侧向外翻开，内衫只露在中央，外衣前片连续到底。圆短翻领配窄儿童肩形，不堆叠成人大领片。 | common | 8D2、儿童、日常、弧领、圆领、小衫 | female.child | 两片短圆翻领，窄肩连贯前片 | `child-play-jacket` | 细直外缘改为圆短翻领，领端压住内衫而非漂浮 | 96px：短圆翻领与内衫遮挡；64px：双弧领面；48px：圆短双领 |
| `child-petal-overcoat` | outfit / 短肩叠褂 | 短肩外褂采用偏斜开口，一侧前片横斜包住内衫，肩边留完整弧面。开口关系不对称，不把两片外褂缩成围裙吊带。 | common | 8D2、儿童、日常、短肩、叠褂、斜开口 | female.child | 弧形短肩，偏斜外搭开口 | `child-fine-robe` | 对称方领改为偏斜整片外搭，不加胸口裙腰 | 96px：偏斜开口与短肩层次；64px：斜开口的完整外片；48px：偏斜叠褂 |
| `child-side-fastened` | outfit / 侧襟童衫 | 小团领沿一侧接入完整斜合前襟，肩部收短，中央没有竖向开缝。侧扣仅辅助结构，辨识依靠宽斜襟面。 | common | 8D2、儿童、日常、侧襟、童衫、团领 | male.child | 小团口、偏侧大襟、紧凑肩身 | `child-apprentice` | 细侧缝改为宽斜合襟面，正面主体保持整片 | 96px：团口接斜襟的闭合位置；64px：偏侧斜合衣片；48px：侧斜襟 |
| `child-straight-jacket` | outfit / 直缘小袍 | 窄圆领口接正中直襟，两边门襟间留一小片完整内衫。衣面竖向舒展但肩部短窄，不在胸像底端添加腰带表示袍长。 | common | 8D2、儿童、日常、直襟、小袍、常服 | male.child | 小圆口接平行直缘，短窄肩 | `child-short-robe` | 斜交领改为正中直开口，不靠衣长或颜色定义新款 | 96px：圆口与平行门襟；64px：小圆口直襟；48px：细直襟 |
| `child-helper-smock` | outfit / 帮忙罩衣 | 敞口罩衣从肩头连成完整左右前片，中央露团领内衫，外衣肩部短而收拢。用于轻便日常帮忙，不表示儿童具有固定职业。 | labor | 8D2、儿童、劳作、罩衣、帮忙、无袖、敞口 | female.child、male.child | 短肩敞口罩衣，完整左右前片 | `child-helper` | 单交领短褐改为敞口罩衣，两侧有真实衣片面积 | 96px：短肩外片与团领内衫；64px：敞口两层衣装；48px：短肩敞褂 |
| `child-outing-cape` | outfit / 圆摆小披 | 圆弧短披从颈口盖向两肩，披边止于上胸，下面仍是完整内衣。边缘以弧线形成短披轮廓，不是底部横挡板或围脖细条。 | traveler | 8D2、儿童、行旅、小披、圆摆、出游、披肩 | female.child、male.child | 圆弧肩披，短侧摆，交领内衫 | `child-winter` | 竖向夹袄改为横向圆弧肩披，主衣片继续向下 | 96px：圆弧披边与内衫连接；64px：圆肩短披；48px：圆摆肩披 |

### 老年

| ID | 分类 / 名称 | 描述 | theme | keywords | 适用 Frame | 核心轮廓 | 最相似旧 ID | 真实差异 | 96px / 64px / 48px |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `elder-folded-low-bun` | hair / 横盘低髻 | 发量向后下方盘成横扁折髻，两端在耳后下方露出，额发柔和归拢。低髻呈连续扁面而非耳旁圆球，保留老年独立发际。 | common | 8D2、老年、日常、低髻、横盘、后拢 | female.elder | 后颈横扁髻，两侧下方短折面 | `elder-soft-bun` | 单侧蓬松圆髻改成后颈横盘，不把圆球贴在耳廓旁 | 96px：后颈折髻与柔和发际；64px：双侧低位横盘体积；48px：低横髻 |
| `elder-braided-crown` | hair / 绕辫平髻 | 较细盘辫绕过头顶后向两侧收拢，髻体低平，额发分开露出克制的内发际。盘辫是头部轮廓的一部分，不是独立头饰。 | common | 8D2、老年、日常、盘辫、平髻、绕顶 | female.elder | 低平拱辫，短侧发，顶上没有高圆髻 | `elder-coiled-bun` | 竖向圆盘髻改为贴顶横拱辫，不靠发色增加新款 | 96px：低拱盘辫的分段；64px：低平绕顶发量；48px：横拱平髻 |
| `elder-flat-topknot` | hair / 平束老髻 | 头顶以一束扁平发结收住短发，额前发面向后拢，颈旁不垂长尾。发结是横向折片，区别于老者短束的竖圆结。 | common | 8D2、老年、日常、平束、扁髻、短发 | male.elder | 低扁横结，后拢额发，短颈边 | `elder-short-bound` | 竖向小髻改为横扁折结，后拢发面不缩放成年短束 | 96px：横结折面与后拢发际；64px：低扁顶结；48px：平顶小结 |
| `elder-nape-tail` | hair / 垂肩短束 | 后发在一侧颈旁收成细短发束，末端贴着肩上自然垂下。上额保留老年后拢发际，区别于两侧蓬散的松拢长发。 | traveler | 8D2、老年、行旅、颈侧、短束、垂肩 | male.elder | 单侧颈旁细短尾，无高髻 | `elder-loose-back` | 两侧松散长发收成一侧短束，尾端不伸到胸前 | 96px：颈侧发束和末端折面；64px：单侧贴肩短尾；48px：细短侧尾 |
| `elder-soft-work-wrap` | hair / 软折布巾 | 布巾沿老年头围低低包覆，斜折巾面在侧后收成扁结，短鬓发仍可见。男女分别绘制巾缘和后结，不复制成年大包头。 | labor | 8D2、老年、劳作、布巾、包头、软折、短结 | female.elder、male.elder | 低软折巾面，扁短后结，灰白鬓发 | `elder-swept` | 裸发后拢改成连续软巾帽身，仍保留短鬓发 | 96px：斜折巾面、扁结与鬓发；64px：低软帽身；48px：软折包巾 |
| `elder-low-brim-cap` | hair / 矮檐便帽 | 低圆帽顶与微微外翻的短软檐连接，额缘完整、两侧没有帽翅。配老年短鬓发，整洁便装不使用官帽徽饰或顶珠。 | merchant | 8D2、老年、商铺、便帽、矮檐、圆顶、整洁 | female.elder、male.elder | 低圆帽顶、外翻短檐、灰白鬓发 | `elder-swept` | 贴头发面改成低顶短檐帽，不用官帽翅或顶珠区分 | 96px：圆顶与外翻短檐的连接；64px：低顶两侧短檐；48px：扁圆檐帽 |
| `elder-shawl-wrap` | outfit / 搭肩暖衫 | 宽软披面从一侧肩头斜搭到另一侧，布边沿肩胸缓缓转折，内衫交领只露中央。老年落肩画稿独立绘制，不将成年披帛整体缩放。 | traveler | 8D2、老年、行旅、暖衫、搭肩、软披、出行 | female.elder | 低落肩、斜搭宽软披面 | `elder-warm-coat` | 纵向敞口罩衣改为横斜肩披，外布连续而非细带 | 96px：宽披面折向及内衫开口；64px：横斜暖披；48px：斜搭肩披 |
| `elder-rounded-lapel` | outfit / 圆折长褂 | 宽领由颈侧圆顺外翻，再沿两片前襟延伸出画布；内衫收在领口里。整洁感来自连续圆领面，不用金边徽饰表示身份。 | merchant | 8D2、老年、商铺、圆折、宽领、对襟、长褂 | female.elder | 两侧圆顺翻领接宽门襟，舒缓落肩 | `elder-fine-robe` | 窄直门襟改为从颈旁翻出的圆宽领，保持两片前身 | 96px：圆翻领的折面与落点；64px：圆宽领接对襟；48px：圆宽双领 |
| `elder-deep-front` | outfit / 深缘常袍 | 深交领以较宽的完整领面包住前胸，前片斜向落到另一侧下缘。肩部宽松下垂，不用成年紧肩短袍替代。 | common | 8D2、老年、日常、深缘、宽交领、常袍 | male.elder | 宽松落肩，深交宽领，完整大襟 | `elder-long-robe` | 浅细交领改为深交宽领，宽面连续接入主衣片 | 96px：深交宽缘和大襟走势；64px：深斜宽领；48px：宽深交襟 |
| `elder-short-overcoat` | outfit / 落肩短罩 | 短罩衣从颈侧低低落向肩头，外衣在前胸偏侧合拢，内衫圆领清楚露出。主衣片有完整面积，不画窄吊带或硬直肩甲。 | common | 8D2、老年、日常、落肩、短罩、合口 | male.elder | 宽松落肩，偏侧合拢外片 | `elder-simple-robe` | 单层团领改为低落肩叠穿外罩，闭合移向一侧 | 96px：低落肩外片与团领内衫；64px：宽肩偏侧合口；48px：落肩短罩 |
| `elder-work-overrobe` | outfit / 宽肩劳褂 | 宽松外褂由低肩连向左右两片前身，中间留宽开口，露出朴素内衫。肩身采用老年独立轮廓，劳作感不依赖补丁与深褐配色。 | labor | 8D2、老年、劳作、宽肩、劳褂、敞口、外搭 | female.elder、male.elder | 低宽肩与两片敞口外褂，团领内衫 | `elder-work-jacket` | 带补缀的单交领衣改为宽松敞口外褂，取消补丁主识别 | 96px：完整外片与宽开口；64px：宽肩敞褂；48px：低肩双前片 |
| `elder-travel-mantle` | outfit / 合领行罩 | 厚实肩罩从颈口合拢向两肩圆缓展开，前胸有清楚的交叠尖圆端，内衫继续向下。包裹感来自宽领和肩罩体积，不用现代拉链或金属扣。 | traveler | 8D2、老年、行旅、行罩、合领、肩罩、包裹 | female.elder、male.elder | 包颈宽领，圆缓肩罩，交叠前端 | `elder-padded-robe` | 对襟夹棉改为合领肩罩，宽外披与内衫分层 | 96px：领面交叠与圆缓披边；64px：包颈宽肩罩；48px：合领宽披 |

## 留给后续

8C 大交互优化继续暂缓；本批不新增 Face / Expression，不做更多年龄状态、独立帽子分类、颜色编辑、五官滑杆、自动穿衣、第二 Pack 或 Unity 迁移。用户从 main 拉取网页验收，不交付压缩包；执行者仍必须下载正式 Artifact 检查。
