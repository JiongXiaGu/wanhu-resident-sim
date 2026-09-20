# Q版头像主路线生产与审查工作流

## 当前执行点

```text
Phase 8B1 — 儿童与老年现有发型 / 衣装重画
状态：8B1 实现与候选美术审查完成，待用户验收；下一批为 8B2 成年剩余素材
基线：28ad42619edb7a6abb21ca7ef8d2dee30d2afda2
```

用户在 Phase 7 后明确指出脸、帽子、衣服仍存在问题；先前 CI PASS 和助手审查不是用户认可最终画法。现在按 [Phase 8 头像美术体系与创作工坊](Phase%208%20头像美术体系与创作工坊.md) 执行。此前长篇阶段记录以 Git 历史和相应阶段文档为准，不再将旧多 Pack 实验指令混入当前工作流。

## 结构不变量

运行时只有 `chibi-cute-v1`，玩家素材仍只有 Face / Hair / Outfit / Expression。帽巾属于 Hair，腮红属于 Expression。六 Frame：female/male × child/adult/elder。

每个 Frame 有唯一固定 Head Frame。Face 只改变下脸与五官。Hair 不读取 Face ID；严禁逐脸 offset / scale、anchor solver、mask / clipPath 自动适配。Hair Coverage probes 只做审查，不驱动运行时变形。

八层顺序：BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront。Outfit 内部仍是 base / collar / overlay / detail，base 和 collar 必须存在。

旧 `crop/bob/long/pony/wave/braid`、`tee/shirt/knit/jacket` 仍为 compatibility-only；parseRecipe 可接受，UI/Random 不可见。旧 linework/simple-flat/soft-paint pack ID 仅作导入 alias，不恢复资源与选择器。

正式 ResidentPortraitDNA、正式 fallback、居民身份/故事、游戏日期保持冻结。自由创作的年龄/性别是样板上下文，不是写入居民的新字段。

## 阶段表

| 阶段 | 已形成的基础 / 当前边界 |
| --- | --- |
| Phase 0–3 | Registry、Pack-owned Catalog、八层 Renderer 与首批古代素材 |
| Phase 4–5 | 固定上头型、年龄专属 Hair/Outfit、六 Frame QA、兼容 ID 隔离 |
| Phase 6 | Hair Coverage 与旧运行时 Pack 退役；结构继续保留 |
| Phase 7 | 腮红安全区、男女/老年/衣领精修；技术通过，但用户未接受为最终画法 |
| Phase 8A 已交付 | 六脸型族、少量帽发/衣装重画样板、自由创作入口、桌面审查 |
| Phase 8B1 当前 | 儿童7+老年8个Hair ID、两年龄各6个Outfit ID；固定配方旧新对照 |
| Phase 8B2 下一批 | 成年其余帽巾、发型与服装，先修旧资源再考虑新增 |
| Phase 8C 待批准 | 根据使用反馈深化编辑器与模板流程 |
| Phase 8D 待批准 | 按生活主题扩充，不靠改色凑数 |

8B1 当前可选 6 Face / 30 Hair / 24 Outfit / 8 Expression。六脸型族共 36 份静态下脸画稿；不将绘制份数当作玩家可选 ID 数量。本批不增加Hair/Outfit ID；工坊“已重画”是累计候选标记，不是最终认可。下一轮先检查Phase8文档中的待验收范围，不自动开始 Unity 迁移。

## 每批工作顺序

1. 读取最新 main、AGENTS、README、接续说明、Avatar Workshop、本文件和对应阶段规范。
2. 查实际源码与最新 Actions；建立具体问题和本批样板 ID 清单。
3. 从确认 SHA 创建 tmp-*，集中修改；不一文件一提交、不先推 main。
4. 聚合提交后跑 Build 与 Resident Visual Review。
5. 下载对应 SHA 的 Artifact，核对 source-commit，实际打开新图板和桌面 UI。
6. 有明显问题就修正并重跑；CI 绿色不等于美术完成。
7. 重新读取 main，无并行冲突才推进已审查的提交；不用 force 覆盖。
8. main 再跑两类检查、再下载复核。交付附真实截图，并区分实现、候选、未完成。

## 自动审查

原居民连续性、正式 fallback、对象保存/取消/恢复/冲突、PNG/SVG/JSON 导入导出保持。工坊同时检查：

- 单 Pack Registry/Catalog 与素材可用 Frame 一致，Random 不泄漏兼容 ID；
- 全部 active 组合能渲染，新 Face 自动进入全表情检查；
- 同一 Frame + Hair 跨所有 Face 四个头部层字节一致；
- Head Frame signature 一致，Hair Coverage 点完整；
- Headwear none/integrated、前后层与 Outfit base/collar；
- 腮红固定安全区 + 真实脸填充余量、三个负对照；
- 六份自由样板独立保存与刷新、切换草稿确认、延迟导入隔离；
- 指定对象 Frame 锁定，自由创作不能改居民身份或旧存储键；
- 8B1的47次素材点选、8组累计重画过滤、24份衣装作者层/版型检查、成年41份固定配方SVG与8A相同；儿童/老年额角弧线抽样与2画布单位余量。

组合数从 Catalog 动态计算，不写死四脸/192 腮红组合。新专项图板使用共用 renderBoards，不复制矩阵遍历器。

## 人工美术审查

只以实际输出判断：脸颊到下巴是否自然；眼眉嘴是否成立；帽身是否被前发切断；发髻是否漂浮；衣领是否连续；肩线是否完整；底部裁切是否出现含义不明的横块；老人儿童是否只靠颜色区分。

每批至少打开本轮所有新图板、自由创作真实桌面 UI、绑定居民真实 UI、96/64/48px。移动端不再截图，不列为人工必查；基础窄屏 smoke 可保留。

本轮截图列表、作者规则、已重画/未重画 ID 以 Phase 8 文档为准。用户认可的是具体画法，不是测试条数或素材数量。

## 8B1 具体审查记录

见 [Phase 8B1 童老衣装审查](Phase%208B1%20童老衣装审查.md)。首轮绿色检查后仍发现额角描边外露与侧髻耳状问题，已修正静态画稿并补充仅用于 QA 的弧线抽样；旧新对照改为只交换被比较的部件。候选复核、合入 main 后的两类 Actions 与 source-commit 必须一致，不用首轮结果冒充最终结果。

修正提交 `1916d91e5cc12dc21e2c86de3f4f05d28b22268c` 的 Build `35534392521`、Resident Visual Review `35534392522` 均 PASS。Artifact `10611768493` 已下载，source-commit正确，22份修改/新增文件与工作树逐字节一致；1886个弧线位置的描边余量检查通过。已重新打开修正后的四张发型图板、两张单部件对照与关键桌面UI，未见首轮额角外露。文档收尾提交与main仍按同SHA检查/下载复核流程交付，不使用本段候选run替代main结果。
