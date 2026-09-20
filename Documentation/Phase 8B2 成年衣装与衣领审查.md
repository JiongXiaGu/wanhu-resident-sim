# Phase 8B2：成年画稿与衣领 / 门襟审查

## 当前交付范围

接手 main：`59028b3afd4b24c1cc57edbe68ce13b2bd5314f9`。本批在 8B1 上继续，不另开只修三件衣服的小补丁。美术均为候选，等待用户验收；测试通过不表示最终定稿。

本批重画 12 个成年 Hair ID、9 个成年 Outfit ID；按适用 Frame 分别为 15 + 15 份画稿。另修儿童日常小褂、老者罩衣、掌柜长衫，共 3 个 ID、6 份男女画稿。没有增加素材 ID；总数仍为 6 Face / 30 Hair / 24 Outfit / 8 Expression。

## 具体处理

| 项目 | 作者层处理 |
| --- | --- |
| 日常小褂 `child-play-jacket` | 使用更窄的儿童肩形；交领内衫收在开口中央；外褂圆顺转入前襟，不在锁骨处形成尖折。 |
| 老者罩衣 `elder-warm-coat` | 内衫交领止于罩衣下；两片外搭和深色边缘独立成面，取消贯穿袖片的斜条及中央悬空系结。 |
| 掌柜长衫 `elder-fine-robe` | 两侧宽缘沿门襟连续到底；内衫只露领口；保留两个有落点的系结，不挤成细中缝。 |
| 成年女性发型 | 低髻移到耳后下方；高髻加高并露出簪杆；侧辫、长发低束、松束用不同尾部体积和发际。 |
| 成年男性发型 | 短束、半束长发、侧后结、短辫、后拢、松束分别重画，不再只改顶部小髻。 |
| 两款包巾 | 掌柜包头为低圆帽身与后结，行旅包巾为斜向布面与较长尾布；完整帽身在 HeadwearFront，不被前发切成横带。 |
| 成年衣装 | 劳作窄交领、书生宽交领、对襟、女工小褂、团领侧闭合、夹棉对襟、店伙无袖短褂分别成型；删除旧围襟吊带和胸口腰部横块。 |

同样是交领或包巾的旧 ID 仍有相近之处。48px 主要读轮廓、领型和色块，不要求发丝、补缀或系结全部可辨；不把这些小细节作为新增款式的理由。泛古代简化设计不宣称具体朝代服制复原。

## 源码职责与保留范围

- `adult-hair.ts` / `adult-outfits.ts`：成年静态画稿；`hair.ts` / `outfits.ts` 只分发年龄。
- `sample-hair.ts` / `sample-outfits.ts`：保留 8A 成年三个 Hair、三个 Outfit 样板 ID，按 Frame 合计 11 份输出逐字节不变；不是隐藏旧 Pack。
- `age-outfits.ts`：三款童老衣装修正，其余童老画稿不动。
- `rework-batch.ts`：显式 8B1 / 8B2 清单，供累计“已重画”标记与 QA 使用。Catalog 仍是可用性权威，不按前缀自动标记未来 ID。

本批不改 Face / Expression / Head Frame / Hair Coverage 正式契约，不改 Catalog ID、Recipe、存储键、居民身份、正式 portrait 或玩法。Hair 仍不读取 Face，没有 solver、mask、clipPath 自动适配。UI 只更新累计重画清单，不重排页面。

## Review 和证据

美术短循环先从实际 Renderer 生成静态图板，已查看成年男女 Hair / Outfit 与三款修正的双性别图板，并检查原尺寸 96 / 64 / 48px。首轮观察到对襟领口外侧小白条与高髻轮廓偏近旧束发，已收窄内衫开口并提高发髻和簪杆。静态图不用于证明 UI / 保存 / 居民绑定。

正式批次必须执行 Build + Resident Visual Review，下载同 SHA Artifact 并核对 `avatar/source-commit.txt`，实际打开本轮所有图板和桌面截图。不要用本文件说明代替最终 Actions 结果。

`capture-avatar-adult-wardrobe.mjs` 仅补本批专项，沿用 `renderBoards`。`export-age-baseline.mjs` 支持完整 SHA 与输出目录，复用同一临时 Git 历史导出路径；历史画稿不进入运行时。8B1 的成年不变断言收窄到保留的 8A 样板，另由 8B2 对全部 88 份固定配方比较兜底：36 份计划变化、52 份不变，其他作者层不得变化。原通用 Catalog 全组合、五点 Coverage、腮红、保存、导入、居民玩法断言继续保留。

专项包含全部 41 次成年素材真实点选、4 组累计过滤、15 份新衣装作者层检查、15 份新发型的 1230 个额角弧线位置及 2 单位余量抽样，以及一次真实成年居民绑定/应用。弧线抽样不是完整像素证明，不代替人工看图。

本轮文件在 `avatar/phase8b2/`：

| 证据 | 文件 |
| --- | --- |
| 成年素材诊断 | `hair-female.adult.png`、`hair-male.adult.png`、`outfit-female.adult.png`、`outfit-male.adult.png` |
| 衣领专项 | `outfit-collar-checks.png`：三款童老修正的两个性别 + 五款成年；同 Frame 固定脸、头发、表情 |
| 单部件前后对照 | `before-after-hair.png`、`before-after-outfit.png`；左 8B1、右 8B2，其他层固定 |
| 成年组合 | `adult-overview.png` |
| 真实桌面工坊 | `studio-<female.adult或male.adult>-<hair或outfit>.png` 共四张 |
| 三款问题真实工坊 | `studio-child-play-jacket.png`、`studio-elder-warm-coat.png`、`studio-elder-fine-robe.png` |
| 真实绑定居民 | `bound-resident.png` |
| 自动报告 | `adult-wardrobe-review.json`，区分变化/保留清单，不声称美术通过 |

## Phase 8C：登记但未实施

下一阶段专门优化 Avatar Workshop 交互：年龄 / 性别切换靠近预览，清楚显示当前创作对象；评估六个固定样板入口卡片；强化“自由创作样板”和“绑定居民编辑”的区别。已有六框架功能不等于交互直观性已解决。

8C 应单独确认方案，继续保持草稿确认、六份样板独立保存、绑定居民年龄/性别锁定。不要在 8B2 顺手重排 UI。主题扩库、更多脸型、独立帽子分类、Unity Runtime 迁移均未实施。

## 首轮正式审查与收尾

候选提交 `18db1742fa8c49dd7d29f00da6bd352f016b395e` 的 Build `35539170618`、Resident Visual Review `35539170617` 均 PASS。Artifact `10614381237` 已下载，源码 SHA 正确，23 份改动文件逐字节一致；本轮 8 张诊断图与 8 张真实桌面截图均已实际打开。报告为 41 次成年点选、4 组过滤、15 份衣装、1230 个额角弧线位置，36 份计划变化与 52 份保留。

看图后继续收尾：女工短褂右内领的下端越出左前领边缘，形成一个小尖角；将该静态襟端收回左前领之下，没有增加遮罩或自动裁切。同时把工坊中仍写着“成年待重画”的旧说明更新为累计三年龄候选，未改变页面布局或对象逻辑。修正提交需再次通过两项检查、下载复核；以上首轮结果不能代替最终 main 结果。
