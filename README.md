# wanhu-resident-sim

《万户天工》居民系统的设计、内容生产、玩法原型与数据管线验证仓库。

本仓库当前同时承担两件事，但必须保持边界清楚：

1. **Web Demo**：快速验证居民玩法、Resident Panel、LifeEvent、人生经历、内容密度和交互体验。
2. **Resident Content Pipeline**：逐步建立可批量生产、可校验、可编译，并能被未来 Unity Runtime 消费的居民内容源。

Web Demo 是玩法与内容原型，不是 Unity Runtime 的内存结构规范。未来 Unity ECS 不直接照搬 `Web/src` 的 TypeScript 类型，也不在 Runtime 解析 Markdown / JSON。

## 项目别名

对话中提到 **“居民逻辑网页demo”**，默认就是本仓库。

新对话继续项目时优先读取：

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
Documentation/居民内容生产与运行时数据管线V1.md
Documentation/居民内容契约V1.md
```

然后检查 GitHub `main`、Actions 与必要设计文档。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/                          # 人工维护的内容源
│  ├─ Stories/                       # Legacy Story Markdown
│  ├─ LifeEvents/                    # 玩家面板使用的 LifeEvent
│  ├─ Names/                         # Name V1 迁移桥 + Name V2 Authoring
│  ├─ Occupations/                   # 职业 + Occupation Group
│  ├─ Tags/                          # LifeTag Registry
│  ├─ Routines/                      # 普通生活表现模板
│  └─ Simulation/                    # Demo 生成与模拟参数
├─ Documentation/                    # 长期设计与数据契约
├─ Schemas/                          # 当前 Authoring / Demo Schema
├─ Tools/                            # 内容编译与 Demo 数据生成工具
├─ Web/                              # 玩法 / UI / 内容原型
├─ scripts/                          # Visual Review 等辅助脚本
├─ AGENTS.md
├─ package.json
└─ vercel.json
```

## Web Demo 的职责

Web Demo 主要回答：

```text
这个玩法好不好理解？
Resident Panel 信息层级是否合理？
LifeEvent 是否像一个居民正在生活？
人生经历是否值得玩家点开？
故事文本在真实 UI 中是否过长？
内容条件、年龄阶段和家庭状态是否成立？
```

它允许使用更易调试的 JSON、字符串 ID 和验证快照。为了快速试玩法，Web 数据结构可以比正式游戏 Runtime 更直观。

Web Demo **不负责**定义 Unity ECS 最终组件布局、BlobAsset 内存布局、正式存档二进制格式和角色资源加载策略。

## 当前内容编译链

`npm run build-content` 当前依次执行：

```text
ContentContractCompiler
↓
StoryCompiler
↓
ResidentGenerator
↓
LifeEventCompiler
↓
StoryBucketCompiler
↓
ResidentSnapshotCompiler
```

主要 generated 数据：

```text
Web/public/generated/
├─ stable-id-registry.json
├─ name-catalog-v2.json
├─ life-tags.json
├─ occupation-groups.json
├─ content-coverage.json
├─ story-buckets.json
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

其中：

- `stable-id-registry.json`：跨内容域 Stable ID + hash 校验结果。
- `name-catalog-v2.json`：带 Stable ID 的姓名 token。
- `life-tags.json`：过去经历的轻量标签定义。
- `occupation-groups.json`：故事粗筛使用的职业组。
- `content-coverage.json`：按人生阶段、职业、职业组等统计的内容覆盖。
- `story-buckets.json`：`LifeStage + OccupationGroup` 预编译候选故事桶。
- `resident-snapshot.json`：Web Demo 验证居民，当前为 `wanhu.resident-snapshot.v2`，包含 `surnameId / givenNameId / lifeTags`。

这些文件是 **Web Demo / Compiler 输出**，不是未来 Unity 存档格式。

## 正式数据管线目标

长期目标采用四层结构：

```text
Authoring Data
人工维护内容
      ↓
Resident Content Compiler
校验 / 引用解析 / StableId / Bucket / Coverage
      ↓
Compiled Content
├─ Web Demo Bundle
└─ Unity ResidentContentBlob
      ↓
Runtime State / Save Data
```

核心原则：

- 人工维护内容是唯一内容源。
- Web 和 Unity 消费不同的编译目标，但共享 Stable ID、字段语义和内容规则。
- 故事正文、职业名称、姓名文本、头像资源定义只保存一份，不复制进每个居民实例。
- Runtime 实例只保存必要状态、Stable ID / RuntimeIndex、少量 StoryThread 和 LifeChapter。
- 存档不能依赖“数组第几个”的易变索引。

详细设计见：

```text
Documentation/居民内容生产与运行时数据管线V1.md
Documentation/居民内容契约V1.md
Documentation/StoryBucket与内容覆盖V1.md
Documentation/居民模拟V1架构.md
```

## 玩家居民面板

默认验证围绕五个问题：

```text
他是谁？
他属于哪里？
他现在做什么？
他正在经历或最近发生了什么？
他过去有哪些值得记住的人生章节？
```

生活模式负责“现在”；人生模式负责“过去”。进入人生模式后不再混入当前 Activity、当前 LifeEvent 和 Routine，只显示已经沉淀的 Life Chapter，并允许展开故事章节。

LifeEvent 可以设置 `recordToHistory: true`。只有真正值得长期回看的事件完成后才进入人生经历；普通天气、施工、忙季等不会永久污染历史。

LifeEvent 已支持 `requiredTags / forbiddenTags` 与第一批 `addTags / removeTags`。过去人生章节可以留下 LifeTag，几年后另一条故事再读取它，形成低成本连续性。

## 核心性能方向

- 居民常规后台模拟以“自己状态 + 全局只读快照 + 编译后的少量定义”为输入。
- 家庭与家谱允许保存引用，但不形成高频关系传播。
- 结婚、出生、死亡、搬家等结构变化通过集中结构命令处理。
- `BirthDay` 长期保存，年龄按当前时间推导。
- 当前 Activity 尽量按需推导，不对全城居民逐小时执行完整日程。
- 人生故事按阶段低频抽取，不持续运行复杂叙事图。
- Story Bucket 先用 `LifeStage + OccupationGroup` 将大故事库缩小，再做精确 Eligibility。
- Routine 的正式 Runtime 方向是尽量确定性按需生成，而不是为所有居民永久保存文本日志。
- 正式 Appearance 最终保存稳定的 Appearance DNA；`PortraitSeed` 主要用于 Demo 和第一次生成。

## 分阶段实现路线

```text
阶段 1  数据契约
StableId / LifeTag / Name / OccupationGroup / LifeEvent / Portrait Authoring 规则

阶段 2  Content Compiler
统一校验、引用解析、Story Bucket、Coverage、Web Bundle

阶段 3  Web Demo 迁移
继续验证玩法，但只消费编译输出

阶段 4  Unity Runtime Contract
ResidentContentBlob、ECS Hot/Cold 数据、Save StableId

阶段 5  批量生产
按 Coverage Matrix 扩充故事、姓名和头像资源
```

当前已经进入阶段 1 后半与阶段 2 的早期验证：Stable ID、LifeTag、Name V2 身份、Occupation Group、Coverage、Story Bucket 都已有真实 compiled 输出。

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

单独编译内容：

```bash
npm run build-content
```

## GitHub Actions / Visual Review / Vercel

开发流程：

```text
tmp-* 分支
↓
Content Compile + Build
↓
Resident Visual Review
↓
Vercel Preview
↓
确认后一次推进 main
↓
Vercel Production
```

Build 会上传 `resident-generated-data` Artifact，便于不打开 Web UI 也能检查所有 compiled JSON。

`tmp-*` 允许正常触发 Vercel Preview。不要为了部署连续提交空 commit，高频修改尽量集中在同一临时分支完成。

详细流程见 `Documentation/开发与部署工作流.md`。
