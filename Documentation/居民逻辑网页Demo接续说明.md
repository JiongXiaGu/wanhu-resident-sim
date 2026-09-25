# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页 demo。

## 接手顺序

读取最新 `main` 与 SHA、`AGENTS.md`、`README.md`、本文件，再读 [居民行为与最近生活记录](居民行为与最近生活记录.md)、[居民事实事件与人生记录运行时设计](居民事实事件与人生记录运行时设计.md)、[居民生活记录与故事连续性](居民生活记录与故事连续性.md)。居民资料任务再读 [居民个人资料与头像派生 V1](居民个人资料与头像派生V1.md)；头像任务再读 [Avatar Workshop](Avatar%20Workshop.md)、[Q版头像主路线生产与审查工作流](Q版头像主路线生产与审查工作流.md)。

先检查目标源码与当前 SHA 的 Actions。不要用聊天记忆代替仓库。

## 当前执行点

当前执行点是 **Resident Action Life RecordPolicy 边界收敛后的行为接入准备**。

当前 main 只保留 Action Presentation、CurrentAction、ResidentActionCompletedEvent 语义和 RecentAction。Web 的确定性 Action Trace 仅用于验证展示链，不承担正式 AI 决策职责；RecentAction 的过滤、cooldown、相邻去重、VariantIndex 与容量统一由 `Tools/ResidentActionLife/record-policy.mjs` 负责。

重构目标：

```text
真实 Need / Schedule / Opportunity
→ Utility
→ Behaviour
→ 完成时已经知道 Target / Place
→ ResidentActionCompletedEvent
→ RecentActionRecordSystem
→ RecentAction 小环
→ 玩家“最近”UI
```

第一轮 Web 不实现完整 Utility / Behaviour AI，只建立 Action Presentation、Completed Event / Trace、RecentAction Record 和 UI 数据链，使用少量确定性的测试 Action Trace 验证语义。真实 3 万居民 AI 最终在 Unity 中由现有 Schedule + Utility + Job 化行为树负责。

## 当前记录链边界

Web Demo 只验证语义、内容和 UI，不模拟最终 3 万居民 AI。

新的运行时方向固定为：

```text
Schedule / Utility / Behaviour Jobs
→ ResidentActionCompletedEvent
→ RecentActionRecordSystem
→ RecentAction UI

LifeEvent Trigger
→ Story Thread
→ 重要结果
→ LifeChapter / LifeTag
```

行为系统拥有“为什么做、去哪里、找谁、是否成功”；记录系统只在成功完成点接收事实。TargetResidentId / PlaceId 由 Behaviour 提供，记录层禁止扫描全体居民、Household 或地点重新推断目标。

RecentAction 只负责近期观察窗口，不进入永久人生历史。CurrentAction 是此刻真实行为。LifeEvent / LifeChapter 继续承担低频叙事和长期人生记录。

## 头像与正式 Portrait 边界

`chibi-cute-v1` 是当前唯一玩家可用运行时 Pack。玩家仍只编辑 Face / Hair / Outfit / Expression；帽巾属于 Hair，腮红属于 Expression。六 Frame 为 female/male × child/adult/elder。

每 Frame 一个固定 Head Frame；Face 只改下脸与五官，Hair 不读取 Face。禁止逐脸 offset / scale、anchor solver、mask / clipPath 自动适配。八层 Renderer 与 Outfit base / collar / overlay / detail 契约继续保留。

`Web/src/resident/portrait/`、`Content/Portrait/` 与五字段 ResidentPortraitDNA 是冻结 fallback 契约，不再是未编辑居民的第一默认路径。移除玩家覆盖应回到 Profile 派生默认；只有生成链不可用时才进入正式 PortraitRenderer fallback。

8D2 已完成，不是当前主动阶段。Phase 8C 大交互继续暂缓；不主动新增 Face / Expression、独立帽子分类、多 Pack 或 Unity 迁移。

## 居民生活与历史不变量

生活模式只展示 CurrentAction、LifeEvent 与少量 RecentAction；人生模式是一条年龄升序时间轴，一个 Chapter 只代表一件事。故事 Chapter 展开第一人称 memoryText，不重放三个 Stage。普通 RecentAction 不进永久历史。

过去影响未来依赖 LifeTag 与结构状态，而不是扫描历史文本。继续保留未婚 → 成婚/家庭改变 → newly-married → 后续共同生活 → 临时 Tag 消失的真实链。

Content 是权威；Stable ID 不由标题或数组顺序生成。generated 文件只由 Compiler 生成，不手改。

## 回归与后续

任何居民资料、Profile 派生头像、头像存储/导入、Catalog / Registry、正式 fallback、LifeEvent 或记录内容管线改动，都必须运行完整 Build，并保留 Resident Visual Review 的相关断言。

头像回归继续覆盖 8D2 已有基线：全组合、Hair 跨 Face 不变、Head Frame / Coverage、六框架保存、旧 Recipe fallback、真实居民绑定与 132 份旧固定配方。新增当前回归重点是：

- 同一居民相同输入稳定生成同一默认 Recipe；
- Face 不受职业、财富、temperament 影响；
- Hair / Outfit 的职业主题只是弱倾向；
- 玩家保存覆盖始终高于 Profile 派生；
- “恢复原头像”回到 Profile 派生默认；
- Profile 或生成链不可用时冻结 Portrait fallback 仍可用。

下一阶段应优先补充 Unity 侧 Behaviour Complete → ResidentActionCompletedEvent 的正式契约映射，并明确 Unity RecordSystem 与 Web `record-policy.mjs` 需要保持一致的语义测试；按真实 Behaviour 到位情况再逐步扩 Action Presentation。不要借整理工作提前实现最终 Unity ECS Save / Blob 物理布局。
