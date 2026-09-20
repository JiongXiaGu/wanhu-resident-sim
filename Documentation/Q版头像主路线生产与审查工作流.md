# Q版头像主路线生产与审查工作流

## 当前执行点

```text
Phase 8A — 美术体系样板重建 + 六框架自由创作
状态：本轮实现与候选人工审查完成；等待用户验收，未进入 8B 批量生产
基线：d6dc414df4d3e64948d77c2360553d0273ab292c
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
| Phase 8A 当前 | 六脸型族、少量帽发/衣装重画样板、自由创作入口、桌面审查 |
| Phase 8B 待批准 | 按批次重画剩余素材，不为追求总量跳过验收 |
| Phase 8C 待批准 | 根据使用反馈深化编辑器与模板流程 |
| Phase 8D 待批准 | 按生活主题扩充，不靠改色凑数 |

8A 当前可选 6 Face / 30 Hair / 24 Outfit / 8 Expression。六脸型族共 36 份静态下脸画稿；不将绘制份数当作玩家可选 ID 数量。下一轮先检查主线文档中的待验收范围，不自动开始 Unity 迁移。

## 每批工作顺序

1. 读取最新 main、AGENTS、README、接续说明、Avatar Workshop、本文件和对应阶段规范。
2. 查实际源码与最新 Actions；建立具体问题和本批样板 ID 清单。
3. 对纯 Face / Hair / Outfit / Expression 画稿迭代，先在确认 SHA 上集中修改，并直接调用真实 `renderAvatar()` / Pack SVG Renderer 生成静态图板；实际检查受影响的六 Frame、关键组合和 96/64/48px。这个高频短循环可以连续多轮，不必每轮等待 Actions。
4. 方向稳定后从确认 SHA 建立/更新 tmp-* 聚合提交；不一文件一提交、不用空提交刷新检查。
5. 正式批次跑 Build 与 Resident Visual Review。
6. 下载对应 SHA 的 Artifact，核对 source-commit，实际打开真实桌面 UI、新图板和对应诊断。
7. 有明显问题就修正并重跑；CI 绿色不等于美术完成，静态图板正常也不等于完整 UI / 存储 / 导入契约完成。
8. 重新读取 main，无并行冲突才推进已审查的提交；不用 force 覆盖。
9. main 再跑两类检查、再下载复核。交付必须区分“源码静态头像图板”与“真实浏览器 / Actions 截图”，并区分实现、候选、未完成。

若本批修改了 Avatar Workshop 交互、保存/恢复、导入导出、Catalog / Registry / compatibility、Head Frame / Hair Coverage 契约、正式 portrait fallback 或居民内容管线，则跳过“只做静态图板即可”的放宽，直接按正式批次回归。

## 自动审查

原居民连续性、正式 fallback、对象保存/取消/恢复/冲突、PNG/SVG/JSON 导入导出保持。工坊同时检查：

- 单 Pack Registry/Catalog 与素材可用 Frame 一致，Random 不泄漏兼容 ID；
- 全部 active 组合能渲染，新 Face 自动进入全表情检查；
- 同一 Frame + Hair 跨所有 Face 四个头部层字节一致；
- Head Frame signature 一致，Hair Coverage 点完整；
- Headwear none/integrated、前后层与 Outfit base/collar；
- 腮红固定安全区 + 真实脸填充余量、三个负对照；
- 六份自由样板独立保存与刷新、切换草稿确认、延迟导入隔离；
- 指定对象 Frame 锁定，自由创作不能改居民身份或旧存储键。

组合数从 Catalog 动态计算，不写死四脸/192 腮红组合。新专项图板使用共用 renderBoards，不复制矩阵遍历器。

## 人工美术审查

只以实际输出判断：脸颊到下巴是否自然；眼眉嘴是否成立；帽身是否被前发切断；发髻是否漂浮；衣领是否连续；肩线是否完整；底部裁切是否出现含义不明的横块；老人儿童是否只靠颜色区分。

高频纯美术迭代至少打开本轮静态 Renderer 新图板和 96/64/48px，不要求每个中间状态都打开完整 Avatar Workshop。静态图板必须由当前代码真实 Pack / `renderAvatar()` 生成，不能用手工概念图替代，也不能用静态图板证明 LocalStorage、草稿切换、导入隔离或居民绑定通过。

达到正式批次 / 阶段交付时，仍至少打开本轮所有 Actions 新图板、自由创作真实桌面 UI、绑定居民真实 UI、96/64/48px。移动端不再截图，不列为人工必查；基础窄屏 smoke 可保留。

本轮截图列表、作者规则、已重画/未重画 ID 以 Phase 8 文档为准。用户认可的是具体画法，不是测试条数或素材数量。
