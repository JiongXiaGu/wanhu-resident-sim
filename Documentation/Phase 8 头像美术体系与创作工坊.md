# Phase 8：头像美术体系与创作工坊

## 当前执行点

**8B1儿童与老年候选已制作，正在修正后复核；下一批为8B2成年剩余素材。**

8A基线为 `d6dc414df4d3e64948d77c2360553d0273ab292c`，8A交付为 `28ad42619edb7a6abb21ca7ef8d2dee30d2afda2`。用户在查看8A截图后明确允许继续。此前Phase7的脸、帽身、衣装与底部裁切没有得到最终美术认可；允许继续不等于认可每件历史画稿。

本阶段重建的是资产画法、生产节奏和编辑体验，不是再做一套系统。移动端不再截图或列为人工必看；基础窄屏溢出smoke可保留。

## 阶段与范围

| 阶段 | 范围 | 放行要求 |
| --- | --- | --- |
| 8A已交付 | 六脸型族、少量帽发/衣装样板、六框架自由创作 | 同SHA两项CI，下载人工看图；用户已允许继续 |
| 8B1当前 | 儿童7+老年8个Hair ID；两年龄各6个Outfit ID | 逐批重画、旧新部件对照，修正后下载复核 |
| 8B2下一批 | 成年其余帽巾、发型与衣装 | 先清楚区分已重画和未重画，不能跳过旧资源问题 |
| 8C | 根据使用反馈深化预览、素材浏览和模板操作 | 不以UI调整为由修改居民身份/Recipe边界 |
| 8D | 学童、劳作、行旅、商铺、常服等主题新增 | 先认可具体轮廓，再扩量；不靠换色凑数量 |

Catalog目前仍为6 Face / 30 Hair / 24 Outfit / 8 Expression。六个Face ID在六Frame有36份下脸画稿，不是36个玩家选项。8B1的15个Hair ID在适用Frame合计23份，12个Outfit ID合计24份；本轮没有新增Hair/Outfit ID。

## 不变的结构

唯一运行时Pack为 `chibi-cute-v1`。玩家仍只编辑Face / Hair / Outfit / Expression；帽巾归Hair，腮红归Expression。

六个Frame为female/male × child/adult/elder。每个Frame一个固定Head Frame；Face只改下脸/五官；Hair只能读取Frame和Hair ID。禁止逐Face offset/scale、anchor solver、mask/clipPath自动裁切、Head Shell变形。原Hair Coverage probes只用于QA，不能驱动运行时变形。

八层顺序：BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront。Outfit内层仍为base/collar/overlay/detail，base/collar必须存在。

旧modern Hair/Outfit十个ID仍供parseRecipe兼容，不出现在UI/Random；旧Pack仅保留迁移alias。正式Portrait fallback、五字段DNA、居民故事/身份/生日/家庭/职业/日期保持冻结。

## 8A已经解决与保留的样板

| 用户指出的问题 | 作者层处理 |
| --- | --- |
| 清秀脸长直边、下巴太深 | 六Frame重画下脸，保留oval/round/angular/long，新增broad/tapered；上头型不动 |
| 交领短襦底部像挡板 | 删除在胸像范围强行画出的裙腰，不将腰部造型塞进胸口 |
| 书生帽像几层横条 | 完整帽身放HeadwearFront，帽下头发不再截断帽身 |
| 工匠服孤立襟角、吊带拼接 | 取消围襟吊带，改短褐；斜襟贯通底边 |
| 无法直接制作老人儿童 | 同一个编辑器增加六框架独立自由样板，不依赖城市中恰好有对应年龄居民 |

8A重画Hair样板为bound/scholar-cap/work-headscarf/child-topknot/elder-soft-bun/elder-swept，Outfit样板为commoner/artisan/adult-female-ruqun/child-short-robe/elder-long-robe。8B1进一步统一其中儿童/老年部分。成年剩余素材仍待8B2，不因为共享模板受影响就算全部审美通过。

## 作者画法

### 脸

六脸型是柔和、圆润、英气、清秀、方圆、细颌；名字不能代替真实轮廓差异，也不把慈祥/严肃等表情绑成脸型。下颌连续圆转，不靠尖长下巴表示清秀；儿童短下脸与饱满面颊，老年克制的眼下/口周年龄线，不画成病态凹陷。

腮红只有Expression一个data-blush组；固定安全区和真实Face填充余量都要检查。新脸必须进入所有表情矩阵。8B1不再改Face或Expression。

### 发型与帽巾

先画完整头部造型再拆前后层，不能在满头头发上随便叠帽块。前帽身必须连续。普通居民以束髻、布带、包巾和折巾的大形表达，不堆华丽纹样。

8B1儿童独立画双髻、发环、垂髫、侧辫、半束与短额发；老年区分低髻/盘髻/侧后髻/后拢长发/退后发际。内部稀疏发际可以露头皮，外包络不能露Head Frame。五个Coverage点之间的额角也需要描边余量；只重画静态资产，不修改头型。

### 衣装与裁切

母版320×320是头肩胸像。领口、肩头和胸前衣襟必须有完整穿着关系；裙腰、腰带、腰围裙不强塞进底边。主衣片延伸出裁切边缘，斜襟不能突然终止成孤立白三角。

8B1增加交领、团领、对襟、窄缘劳作、夹棉、方领罩衣/无袖罩衣等作者版型；正常/宽松/夹棉肩形用固定Frame画稿。overlay代表具体外搭，detail仅放少量缝线/系结/补缀，不用来修补主轮廓。均为泛中国古代背景简化候选，不宣称某朝服制复原。

## 自由创作与保存

`/?view=avatar-editor`默认自由创作；从居民“编辑头像”进入仍绑定该居民。两种模式共用一个编辑器/Renderer/Recipe/Catalog。

自由创作先选男女和儿童/成年/老年，然后选四类部件。六个Frame各自保存样板；切换不是把同一居民变老变小。有草稿时继续编辑、保存后切换、放弃后切换必须正常。

保存键为 `wanhu.avatar.v1:city:<seed>:studio:<frame>`；原player:female/male与resident:<id>不改，不批量迁移。指定对象Frame锁定，不改居民年龄/性别。自由创作不重建App或改城市状态。

日常样板只载入草稿。8B1未保存女童起点改双髻/对襟小褂，老年女性改低髻/罩衣；已保存配方不改。随机本类只改当前类别；随机搭配只改Hair/Outfit并保留Face/Expression。“仅已重画”约束过滤和随机，标记是8A与8B1累计候选，不是最终认可。

JSON只含版本、Pack和四项选择，不携带年龄/性别/居民ID。导入前先选Frame，按exact → compatibilityKey → 默认/首项确定性回退；导入不自动保存。PNG/SVG导出当前所见Frame。每目标独立保存、刷新恢复、外部更新冲突、写失败提示继续有效。

## 源码分工

`child-hair.ts`、`elder-hair.ts`、`age-outfits.ts`分别负责儿童发型、老年发型和两年龄衣装。旧同ID画稿已经从hair.ts/sample-hair.ts/outfits.ts删除。sample-hair仅保留8A成年样板，hair/outfits负责分发与成年剩余素材。`rework-batch.ts`是本批精确ID清单，Catalog仍是可用性和兼容权威。

不建立archive资源目录、不注册隐藏第二Pack。对照需要的旧资产从Git历史临时取出，只进入Actions Artifact。

## Review与交付

Build与Resident Visual Review必须同时通过。保留原居民/正式fallback、全部16,704组合、288腮红组合/负对照、Hair跨Face和220 Coverage点、六样板保存/导入/冲突与真实UI。

8B1增加47份素材真实点选、8组重画过滤、24份衣装作者层/版型、41份成年固定Recipe渲染不变，以及1886个额角弧线位置的描边余量抽样。抽样不是完整像素证明，不代替人工看图。

旧新对照只替换8A的Hair四层或Outfit层，其余图层固定为当前画稿；不能两边同时换发型和衣服。图板统一用audit-packs中的renderBoards，不复制通用矩阵遍历。

必须下载、核对source-commit并打开：

- `avatar/phase8b/hair-<frame>.png`与`outfit-<frame>.png`，四Frame共8张；
- `studio-<frame>-hair.png`与`studio-<frame>-outfit.png`，共8张真实桌面UI；
- `before-after-hair.png`、`before-after-outfit.png`、`four-frame-overview.png`；
- 原8A六框架/绑定居民UI、脸型与帽发衣装图板、腮红诊断和96/64/48px。

先在tmp-*聚合提交并审查，发现错画继续修；重读main后才推进已审查提交，main再跑两项workflow和下载复核。交付说明main SHA、PASS/FAIL、实际下载看图与否，并区分实现/候选/未完成；移动端不截图，不用测试数宣称最终美术认可。

## 审查记录

8A交付 `28ad42619edb7a6abb21ca7ef8d2dee30d2afda2` 的main Build `35530581596`、Visual Review `35530581576`通过；Artifact `10611455446`已下载复核。其首轮隐式浏览器上下文问题已修复，具体历史见Git中8A记录。

8B1首轮 `5ce012d990efe48a6d31f52943115b8399d0ba69` 的Build `35533484203`、Visual Review `35533484202`通过，Artifact `10611313668`已下载并逐张查看本轮11张图板和8张桌面UI。仍发现额角描边、耳状侧髻以及对照未隔离部件的问题，因此没有直接合main。

具体修正与审美边界见 [Phase 8B1 童老衣装审查](Phase%208B1%20童老衣装审查.md)。最终修正提交和main仍以对应SHA的Actions/source-commit为准，不用上述首轮结果冒充最终状态。下一批为8B2，不自动跳到主题扩库或Unity迁移。
