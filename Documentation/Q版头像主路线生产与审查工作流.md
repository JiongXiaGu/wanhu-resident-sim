# Q版头像主路线生产与审查工作流

## 当前执行点

**Phase 8D1-A / 8D1-B：常服、劳作、商铺、行旅合批扩充，并补齐资产描述与轻量检索。**

用户认为 8B2 基础画法基本可行，已批准扩库。接手 main 为 `7ba57695c392f14d598e818beadecff877dd52f9`。详见 [Phase 8D1 主题头像资产扩充](Phase%208D1%20主题头像资产扩充.md)。新增 16 Hair / 16 Outfit ID，共 44 份适用成年画稿。当前 6 Face / 46 Hair / 40 Outfit / 8 Expression；100 个可选资产都有中文描述与关键词。

8C 大交互调整暂缓，8D2 儿童/老年扩库未开始。不要把本批检索补充变成整个工坊重排，也不要恢复多 Pack 或提前迁 Unity。技术通过不等于新款美术最终认可。

## 结构不变量

运行时只有 `chibi-cute-v1`，玩家只编辑 Face / Hair / Outfit / Expression。帽巾属于 Hair，腮红属于 Expression。六 Frame 为 female/male × child/adult/elder。

每 Frame 一个固定 Head Frame；Face 只改下脸与五官；Hair 不读 Face。禁止逐脸 offset/scale、anchor solver、mask/clipPath 自动适配。Hair Coverage probes 只做审查，不驱动变形。

八层顺序为 BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront。Outfit 内部 base / collar / overlay / detail，base 和 collar 必须存在。

旧 modern Hair/Outfit 十个 ID 是 compatibility-only，旧三个 Pack ID 只作迁移 alias，不进入 UI/检索/Random，不恢复旧资源目录。正式 ResidentPortraitDNA、fallback、居民身份/故事/日期保持冻结。自由样板年龄/性别是编辑上下文，不是居民字段。

Catalog 为文字、可用性和兼容权威。8D1 新项使用 ThemeCatalogOption 完整记录主题、关键词、轮廓、最相似旧项、差异和 96/64/48px 识别重点；逐项文档由 CI 校验，不维护第二运行时索引。描述、关键词、主题和搜索词不写入 Recipe 或保存键。主题不能变成职业锁定。只要 Frame 适用，玩家可以跨主题混搭。

## 阶段关系

| 阶段 | 当前边界 |
| --- | --- |
| Phase 0–6 | 单 Pack、固定头型、独立年龄素材、Coverage 和旧资源退役基础保留 |
| Phase 7 | 技术成果保留；当时美术未获最终认可，不能回退为模板 |
| Phase 8A | 六脸型族、成年样板、六框架自由创作入口已交付 |
| Phase 8B1 | 儿童/老年旧 Hair 与 Outfit 重画已交付 |
| Phase 8B2 | 成年剩余画稿及三款童老衣领已交付，用户认为基本可行 |
| Phase 8D1 当前 | 四生活主题 32 新 ID、100 份描述与检索，正式批次回归 |
| Phase 8C 暂缓 | 年龄/性别靠近预览、样板入口和当前对象清晰度 |
| Phase 8D2 未实施 | 儿童/老年主题扩库，需另定样板范围 |

历史具体问题与旧新对照留在 8B1、8B2 阶段文档和 Git 历史；不把旧多 Pack 或已否定实验指令混入当前任务。每个新 ID 先说明轮廓差异与小尺寸识别依据，不靠改色凑数。

## 每批顺序

1. 读取最新 main、AGENTS、README、接续说明、Avatar Workshop、本文件和阶段规范，确认 SHA。
2. 查源码和同 SHA Actions，列出本批明确 ID、Frame 与问题，不用聊天记忆覆盖远端。
3. 纯画稿可以先用当前真实 `renderAvatar()` / Pack SVG 生成静态图板，实际查看相关 Frame、组合及 320 / 96 / 64 / 48px；高频中间轮次不必等 Actions。
4. 候选稳定后集中代码/画稿/文档至 tmp-* 聚合提交，不一文件一提交、不用空提交刷检查。
5. 正式批次运行 Build 与 Resident Visual Review，下载对应 SHA Artifact，核对 source-commit 与源码，实际打开新图板和真实桌面 UI。
6. 有可见错误继续修并重跑。重新读取 main，无并行冲突才以非 force 推进已审查提交；有新 main 则先整合再审查。
7. main 再跑两类检查，再下载复核。交付写 SHA、两项结果、实际看图范围，区分实现、候选美术和未实施范围。

编辑器、存储、导入、Catalog/Registry/兼容、Head Frame/Coverage、正式 portrait、居民内容管线或 Review 脚本变化必须走完整回归，不能只提交静态图。用户自行拉 main，不交付压缩包；这不取消执行者下载并人工查看 Artifact 的责任。

## 自动审查

继续验证 Catalog 全组合、Hair 跨所有 Face 字节不变、Head Frame signature、Coverage、Headwear 前后层与 Outfit 作者层、腮红安全区和负对照、旧 Recipe 确定性回退、真实居民连续性、正式 fallback。

继续验证六份自由样板独立保存/刷新、草稿切换确认、延迟导入隔离、玩家/居民旧键、取消/恢复/冲突、导入导出和写失败不假成功。不得以搜索或扩库为由跳过任何对象/身份边界。

8D1 增量验证 100 份描述、44 次新素材点选、名称/描述/主题/关键词/Frame/ID 搜索、组合筛选空状态、受限随机、成年独立保存、新 ID JSON 往返与真实居民应用。保留 8B2 基线 88 份固定配方逐字节不变；新增几何不与同 Frame 其他选项完全相同，不能只换色。

旧阶段点选和冻结断言使用明确历史 ID 清单，新 ID 用增量审查覆盖，不用删除有效断言的方式通过 CI。组合数按实际 Catalog 动态计算，不把旧总数写死。通用密度上限为 22，8D1 另检查童老仍不超过 12 项边界，成年扩量有搜索和滚动 UI 实查。

## 人工看什么

实际输出里，先看头型是否露出、帽身是否被前发切断、髻体是否像多一只耳朵、领口是否连续、内外衣是否成片、中线是否拥挤、底部是否出现腰封式横块。再看不同款式是否有新的轮廓信息，不能以标签不同代替画面不同。

静态 Renderer 图板不是完整工坊截图，不能证明导入/保存/居民绑定。正式阶段必须打开本批全部诊断、关键真实桌面工坊、绑定居民和原尺寸 96/64/48px。移动端不再截图或列为美术必查，基础窄屏 smoke 保留。

8D1 图板和截图在 `avatar/phase8d/`，包括四主题、组合总览、六脸型及17 张真实 UI（八张主题工坊、八张全量列表首尾、一张居民绑定）。原生小图另存 native/，全量列表首尾须实际查看。弧线抽样与几何签名只提供有限 QA，不能替代人工审美，也不能把 CI PASS 写成用户认可。
