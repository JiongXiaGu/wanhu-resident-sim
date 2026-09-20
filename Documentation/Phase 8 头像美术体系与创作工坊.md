# Phase 8：头像美术体系与创作工坊

## 当前决定

接手基线：`d6dc414df4d3e64948d77c2360553d0273ab292c`。用户在 Phase 7 后明确反馈：清秀脸型不自然、胸像底部横块不明、书生帽分层错误、工匠衣装拼接生硬；此前技术审查通过不表示这些画法已被用户认可。

本阶段保留单一 `chibi-cute-v1`、六个 Head Frame、Hair Coverage、八层 Renderer、四类离散编辑和 Recipe 兼容。重建的是资产画法、生产节奏与编辑体验，不是再次重做系统。Phase 7 美术不作为锁定模板。

移动端不再截图、也不再列为人工美术验收必看项。保留基础窄屏溢出 smoke check，不用它占用美术交付篇幅。

## 分阶段与放行门槛

| 阶段 | 范围 | 放行要求 |
| --- | --- | --- |
| 8A 当前 | 美术规范、少量重画样板、六框架自由创作入口、针对性图板 | 同 SHA Build / Visual Review；下载人工看图；用户接受样板方向后才扩量 |
| 8B | 逐批重画剩余 Hair / Outfit；先完成儿童与老年，再处理成年其他头饰和衣装 | 每批只解决一组明确问题，旧新对照；没有认可不按数量冲关 |
| 8C | 编辑器深化：根据实际使用反馈调整预览、素材浏览、模板操作 | 先验证保存和上下文边界，不以 UI 重做为由改 Recipe / 居民身份 |
| 8D | 按学童、劳作、行旅、商铺、常服等主题扩充 | 新轮廓确有区别、全部组合契约通过；不靠改色凑数 |

“六脸型族 × 六 Frame”表示 6 个可选择 Face ID、36 份下脸作者画稿，不是 UI 有 36 个脸型选项。未来 8 发型 / 6 衣装等只是阶段参考，不作为本轮数量承诺；共享 ID 与 Frame 绘制份数分别计数。

## 8A 问题定位与样板范围

| 问题 | 实际源头 | 本轮样板 |
| --- | --- | --- |
| 清秀脸奇怪 | `long` 下脸长直段与下巴落点过深；多个脸型的脸颊转折缺少统一尺度 | 重画六 Frame 的静态下脸；保留 oval/round/angular/long，新增 broad 方圆、tapered 细颌；不动头顶、太阳穴和耳位 |
| 衣服底部横块 | `adult-female-ruqun` 在 y≈302 画裙腰，但 320×320 头像裁切实际只到胸口 | 删除裙腰挡板，标为交领短襦；胸像不硬塞整身裙腰 |
| 帽子分成几层横条 | `scholar-cap` 的帽身在 HeadwearBack，中间被 FrontHair 遮挡 | 重画完整前帽身和帽下鬓发；无顶部孤立小帽块 |
| 工匠服拼接怪 | 围襟吊带叠在交领上，斜襟末端露出孤立浅色角 | 改为工匠短褐，取消围裙吊带；斜襟连续延伸出胸像底边 |
| 无法直接做老人儿童 | 工坊只能挑玩家样例或城市里恰好存在的居民 | 同一编辑器新增自由创作上下文，六份样板分别保存 |

本轮 Hair 样板：`bound / scholar-cap / work-headscarf / child-topknot / elder-soft-bun / elder-swept`。这些 ID 的旧画稿从 `hair.ts` 删除，新画稿集中在 `sample-hair.ts`；不是两套画风切换。其余 Hair 仍是待分批重画的基线。

本轮 Outfit 样板：`commoner / artisan / adult-female-ruqun / child-short-robe / elder-long-robe`。交领模板的连贯性修正也作用于同类衣装，但不因此声称所有 Outfit 已经重新审美验收。其余款式会在 8B 单独处理。

8A 可选总量：Face 6 / Hair 30 / Outfit 24 / Expression 8。未增加 Hair / Outfit 数量。脸型扩充后组合数必须从 Catalog 重新计算，不能继续硬写 11,136 或腮红 192。

## 新作者规则

### 脸

每个 Frame 仍只有一个上头型。Face 负责下脸与五官身份；禁止通过脸宽移动、缩放 Hair。六脸型为柔和、圆润、英气、清秀、方圆、细颌：名称不能代替轮廓差异，也不把慈祥、严肃等情绪强绑定为年龄脸型。

下颌使用连续圆转，清秀不是拉长尖下巴。儿童脸保留较短面中与饱满颊部；老年用克制的眼下、口周与肩形表达年龄，不用夸张凹陷做成病态。眉眼样板保留 Q版，不走写实路线。

腮红继续只有 Expression 的一个 `data-blush` 组；固定安全区与真实 Face 填充余量都要检查。新脸型必须进入全表情矩阵，不能仅画 smile 然后宣称可用。

### 头发与帽巾

先画完整戴帽造型，再拆 BackHair / HeadwearBack / FrontHair / HeadwearFront；不能先画满头头发，再随便扣几块帽饰。帽身正面必须连续，前发不能把它截成孤立横条。

本轮使用日常束髻、布带、劳作包巾与折巾的简化设计语言。它们是泛古代中国背景的候选设计，不宣称精确复原某朝某阶层服制。普通居民不靠华丽冠饰与复杂纹样表现身份。

Hair 函数只能读取 Frame 和 Hair ID。sample-hair 只是作者源码拆分，不新增自动求解、逐 Face offset、mask / clipPath 或 Head Shell 变形。

### 衣服与裁切

母版仍为 320×320，看到的是头肩胸像。衣领、肩头与胸前衣襟必须讲得通；看不到的腰带、裙腰、腰围裙不强塞进底部。主衣片必须延伸到裁切边界，不能靠漂浮横板补齐。

`base / collar / overlay / detail` 不变。先建立完整衣片，再画连续交领。前襟不能在胸前突然结束成一块浅色三角。overlay 必须代表具体穿着关系，不是“多画一层会更丰富”。detail 只画少量缝线、系结或补缀，不承担修补大轮廓的职责。

## 自由创作与指定对象

主入口 `/?view=avatar-editor` 默认进入自由创作。从居民身份栏“编辑头像”进入时仍绑定该居民。

自由创作：先选男/女与儿童/成年/老年，随后编辑 Face / Hair / Outfit / Expression。六个 Frame 各有一个独立样板目标；切换打开对应样板，不把上一张脸强行转换成年龄不同的新居民。未保存时继续编辑、保存后切换、放弃后切换都必须可用。

保存键：`wanhu.avatar.v1:city:<seed>:studio:<frame>`。原玩家 `player:female/male` 与居民 `resident:<id>` 键不改、不批量迁移。自由样板保存不会修改城市快照、生日、性别或故事。

指定对象：继续支持原两份玩家档案与真实城市居民；Frame 来自对象，不能用创作年龄按钮改变它。两种模式共用一个编辑器、一个 Renderer、一个 Recipe 协议和同一份 Catalog。

日常样板按钮只载入草稿；保存此样板才写入。随机本类只改当前分类；随机搭配仍只改 Hair/Outfit，保留 Face/Expression。“仅本轮样板”过滤也约束随机搭配。

配方 JSON 继续只保存版本、Pack 与四项选择，不携带年龄/性别。跨框架导入先选择目标框架，再 deterministic fallback；预览不自动保存。PNG/SVG 是当前所见框架的渲染导出。

## Review 工作流

Build 与 Resident Visual Review 仍是两个必需检查。原居民生活/故事、正式 fallback、保存隔离、导入导出、冲突、全部 Catalog 组合和 Hair Coverage 不能删除。

`capture-avatar-foundation.mjs` 只增加两类证据，不复制整套已有组合遍历：

1. 真实 UI：六框架直达、每份独立保存与刷新、草稿三种处理、延迟导入跨框架隔离、真实居民身份不变、当前分类随机和样板过滤。
2. 本轮美术图板：六 Frame 的全部 Face、男女帽巾、衣装胸像裁切、三年龄综合图；帽身增加 12 个可见前层采样点。

图板共用 `avatar-review/audit-packs.mjs` 的 `renderBoards`；新 Face 由 Catalog 自动进入旧矩阵和腮红检查。腮红负对照继续全部拒绝。

Artifact 路径：

```text
avatar/phase8a/studio-female.adult.png
avatar/phase8a/studio-female.child.png
avatar/phase8a/studio-male.elder.png
avatar/phase8a/studio-headwear.png
avatar/phase8a/studio-outfits.png
avatar/phase8a/bound-resident.png
avatar/phase8a/faces-<frame>.png          六张
avatar/phase8a/headwear.png
avatar/phase8a/outfits.png
avatar/phase8a/six-frame-overview.png
avatar/phase8a/foundation-review.json
avatar/source-commit.txt
avatar/source-and-contract.zip
```

每轮必须实际下载并打开以上图板与关键桌面 UI；重点审查清秀脸、帽身连续、围襟/斜襟、裁切下边界、96/64/48px。发现明显错画则继续修，不因为 JSON 写着 automated-pass 就宣布美术通过。图板必须标明诊断，不冒充玩家 UI。

## 当前执行记录

8A 本轮样板、桌面自由创作、文档与审查已实现，候选人工审查完成；等待用户验收，不自动进入 8B 批量重画。

首轮聚合提交 `c1c85b0fa2d56d1359b96ddb936b1f7ac8d04cda` 的 Build `35529629163` 通过。Visual Review `35529629091` 的原头像回归、腮红检查和新增六框架交互均已运行通过，但新增图板打开页面时因使用 browser.newPage 的隐式上下文而失败；该轮整体判为 FAIL，未推进 main。下载 Artifact `10611141506` 后实际打开六张桌面 UI，确认问题来自审查脚本而不是保存或美术运行时。

修正提交 `8ce00c59e6d87ec9de512e3e99c3791ad0380510` 使用显式 browser.newContext，共用图板函数可正常新开页面。Build `35529992821` PASS，Resident Visual Review `35529992849` PASS。已下载 Artifact `10610698187`，source-commit 核对为该 SHA，归档的25个修改/新增文件与作者工作树逐字节一致。

实际报告：16,704 个有效组合；36 个 Head Frame 检查；264 项 Hair 跨 Face geometry；220 个 Hair Coverage probes；70 项 compatibility-only 检查；288 个腮红组合与3个负对照；六框架独立保存、刷新、草稿继续/保存/放弃、延迟导入隔离、随机本类和样板过滤通过；12 个可见帽身点通过。上述是自动覆盖，不是人工逐张看了16,704张头像。

人工已打开上述六张桌面 UI、六张 Face 图板、headwear、outfits、six-frame-overview，以及全部 Face 的腮红安全区诊断。修正脚本后六张真实 UI 与首轮已看版本 SHA256 完全相同；九张新图板在修正后逐张打开。

| 审查对象 | 本轮观察与边界 |
| --- | --- |
| 清秀与新增脸型 | 颊部到下巴改为连续圆转，方圆/细颌形成不同下颌宽度；96px可比较，48px下相邻脸型差异仍较细，不宣称六型均一眼可辨 |
| 帽发 | 折巾帽身完整、劳作头巾与后结相连，未见原来的孤立小帽块/被前发截成横条；帽形简化程度仍待用户审美验收 |
| 胸像衣装 | 本轮样板没有原裙腰横板和工匠围襟吊带，斜襟延伸到裁切之外；五个样板仍共享交领基础，后续要增加版型差异，不能当作全套服饰完成 |
| 年龄与性别 | 老年有低髻/拢发与面部年龄线，儿童用较短下脸和窄肩；本轮儿童日常样板共用束髻，男女区分偏克制，后续儿童专属批次继续丰富 |
| 桌面工坊 | 自由创作直接选六框架，素材三列显示；指定对象模式没有年龄按钮；关键按钮未被预览遮挡 |
| 腮红 | shy最大范围图未见明显外溢；新Face纳入实际轮廓安全检查，不靠裁切 |

最终文档提交与 main 推进仍须各自复跑对应 SHA 的两个 workflow，并下载 main Artifact 复核。最终 main 状态以其 Actions 和 source-commit 为准，不将上面的候选 run 冒充 main 验收。当前全部画稿仍为候选；下一步先由用户审查本轮样板，不自动扩量或进入 Unity 迁移。
