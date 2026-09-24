# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页 demo。

## 接手顺序

读取最新 `main` 与 SHA、`AGENTS.md`、`README.md`、本文件，再按任务读取对应领域文档。当前日常事件任务先读 [日常事件库 V2](日常事件库V2.md)、[居民事实事件与人生记录运行时设计](居民事实事件与人生记录运行时设计.md)、[居民生活记录与故事连续性](居民生活记录与故事连续性.md)；居民资料任务再读 [居民个人资料与头像派生 V1](居民个人资料与头像派生V1.md)；头像任务再读 [Avatar Workshop](Avatar%20Workshop.md)、[Q版头像主路线生产与审查工作流](Q版头像主路线生产与审查工作流.md)。历史 Phase 文档只用于追溯已完成阶段，不得把旧“当前执行点”覆盖到现在。

先检查目标源码与当前 SHA 的 Actions。不要用聊天记忆代替仓库。

## 当前执行点

当前主线是 **Routine Library V2：R0 契约已落地，下一步 R1 泛居民城市日常扩充**。

R0 已确定：

- `routine.<domain>.<scope>.<action>` 新命名规则，旧 V1 Stable ID 保留；
- `wanhu.routines.v2`：category / sourceFacts / eligibility / weight / cooldownDays / variants；
- Compiler 生成 `routine-catalog-v2.json` 与 build-local RuntimeIndex；
- RecentLifeLog 记录 RoutineId / RuntimeIndex / VariantIndex，UI 仍通过定义解析文本；
- Variant 发布后只末尾追加，不重排；
- Coverage 统计 Routine 定义、Variant、category 与职业覆盖；
- Web synthetic Routine 继续用于验证 UI，但带天气条件的内容等真实 Fact 链后再触发。

接下来 R1 只扩充泛居民城市日常，优先家庭、市场、邻里、出行、休闲和公共生活，目标约 80～120 个定义。先按 Coverage 找缺口，不先做职业大批量，也不同时实现最终 Unity ECS Fact Stream。

## 当前记录链边界

Web Demo 当前用于验证语义和内容契约，不设计最终 Unity ECS Save / Blob 布局。

未来运行时方向固定：

```text
行为树 / Schedule / Utility Jobs
→ ResidentFactEvent
→ ResidentLifeRecordSystem
→ Routine Resolver / LifeEvent Trigger / LifeChapter Request
```

高频 Job 只在有意义的行为完成点写紧凑事实，不拼字符串、不直接维护 UI 日志、不为每个行为树节点创建记录。Routine 只保留近期小环；结构事实与需要长期保存的 LifeEvent 才进入 Major Life History；LifeTag 负责系统连续性，不扫描历史正文做逻辑判断。

Resident Profile 可作为后续 Utility / Story Eligibility 的弱输入，但不能直接把性格写成硬职业、硬脸型或强制剧情。

## 头像与正式 Portrait 边界

`chibi-cute-v1` 是当前唯一玩家可用运行时 Pack。玩家仍只编辑 Face / Hair / Outfit / Expression；帽巾属于 Hair，腮红属于 Expression。六 Frame 为 female/male × child/adult/elder。

每 Frame 一个固定 Head Frame；Face 只改下脸与五官，Hair 不读取 Face。禁止逐脸 offset / scale、anchor solver、mask / clipPath 自动适配。八层 Renderer 与 Outfit base / collar / overlay / detail 契约继续保留。

`Web/src/resident/portrait/`、`Content/Portrait/` 与五字段 ResidentPortraitDNA 是冻结 fallback 契约，不再是未编辑居民的第一默认路径。移除玩家覆盖应回到 Profile 派生默认；只有生成链不可用时才进入正式 PortraitRenderer fallback。

8D2 已完成，不是当前主动阶段。Phase 8C 大交互继续暂缓；不主动新增 Face / Expression、独立帽子分类、多 Pack 或 Unity 迁移。

## 居民生活与历史不变量

生活模式只展示当前 Activity、LifeEvent 与少量 Routine；人生模式是一条年龄升序时间轴，一个 Chapter 只代表一件事。故事 Chapter 展开第一人称 memoryText，不重放三个 Stage。普通 Routine 不进永久历史。

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

下一阶段应优先围绕 ResidentFactEvent / Routine / LifeEvent / LifeChapter 的 Web 语义验证和内容资源准备推进；不要借整理工作提前实现最终 Unity ECS 数据布局。
