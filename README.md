# wanhu-resident-sim

《万户天工》居民生成、背景人生模拟、生活事件与叙事内容的设计/验证仓库。

当前阶段验证一个低成本的居民生命模拟模型：居民拥有稳定身份、年龄、职业、家庭/家谱、稀疏后台更新、短期 Routine、LifeEvent 与可回看的人生章节。玩家居民面板默认使用短小的 `LifeEvent V2`；较长的 Legacy Story 保留为素材与完整内容审查，不再强行直接塞进 400px 游戏面板。

## 项目别名

对话中提到 **“居民逻辑网页demo”**，默认就是本仓库。

如果在新的 ChatGPT 对话里需要继续项目，先让助手读取：

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
```

再检查 GitHub `main`、Actions 与必要的设计文档。这样即使换对话，也不依赖旧聊天记录恢复项目状态。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/
│  ├─ Stories/                       # 规范 Legacy Story Markdown
│  ├─ LifeEvents/                    # 玩家居民面板使用的 LifeEvent V2
│  ├─ Names/                         # 姓名池
│  ├─ Occupations/                   # 职业定义
│  ├─ Routines/                      # 普通生活记录模板
│  └─ Simulation/                    # 居民生成与模拟规则
├─ Documentation/
├─ Schemas/
├─ Tools/
│  ├─ StoryCompiler/
│  ├─ ResidentGenerator/
│  └─ LifeEventCompiler/
├─ Web/
├─ scripts/
├─ AGENTS.md
├─ package.json
└─ vercel.json
```

## generated 数据

`npm run build-content` 依次执行：

```text
StoryCompiler
↓
ResidentGenerator
↓
LifeEventCompiler
```

并生成：

```text
Web/public/generated/
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

- `stories.json`：Legacy Story 标准化内容，供完整审查器。
- `definitions.json`：姓名、职业、Routine、LifeEvent V2、人生阶段等只读定义。
- `resident-snapshot.json`：由固定 CitySeed 生成的居民、家庭与少量人生章节快照。

## 玩家居民面板

默认游戏验证围绕五个问题：

```text
他是谁？
他属于哪里？
他现在做什么？
他正在经历或最近发生了什么？
他过去有哪些值得记住的人生章节？
```

居民面板不再维护独立“近况摘要”。当前活动直接由职业 / 状态推导；当前 LifeEvent 完整展示，旧 Stage 只作为同一事件的前情；Routine 以更低视觉级别显示。

LifeEvent 可以设置 `recordToHistory: true`。只有这种重要故事完成后才会成为一个人生章节；普通天气、施工、忙季等事件不会永久污染人生历史。

历史故事按年龄阶段低频抽取，同一居民的一生由多次不同故事共同组成。人生经历中只显示重要章节，并可通过 `sourceEventId` 展开原始三阶段故事。

详细规则见：

```text
Documentation/居民面板与生活事件V2.md
Documentation/居民生活记录与故事连续性.md
```

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 核心性能原则

- 居民常规后台模拟以“自己状态 + 全局只读快照”为输入，适合并行执行。
- 家庭与家谱允许保存引用，但不形成高频关系网络传播。
- 低频结婚、出生、死亡等结构变化通过集中命令系统处理。
- `BirthDay`、职业、家庭与重要人生章节长期保存；普通 Routine 使用有限容量。
- 当前活动尽量在玩家查看时推导，不对所有后台居民做逐小时完整日程模拟。
- 人生故事按年龄阶段低频抽取，不持续运行复杂叙事图。
- 姓名允许重复；同一 Seed 的居民必须稳定生成同一身份、头像种子和背景人生抽取结果。
- Web 和未来 Unity 共享稳定 ID、字段含义和生成规则，但不要求共享运行时内存布局。
- Unity Runtime 最终使用编译后的紧凑数据，不在 ECS Runtime 中解析 Markdown / JSON。

## 内容策略

旧 Story 如果无法在真实游戏 UI 中形成好的体验，不要求继续兼容。处理顺序是：

1. 先判断题材是否值得保留。
2. 值得保留的重写成 LifeEvent V2。
3. 真正值得长期回看的事件标记 `recordToHistory`。
4. 只适合长篇阅读的继续留作素材。
5. 没有价值的可以淘汰。

玩家体验优先于历史内容兼容。

## GitHub Actions / Visual Review / Vercel

开发流程参考 `wanhu-ui-prototype`：

```text
tmp-* 分支
↓
GitHub Build
↓
Resident Visual Review
↓
直接查看压缩后的单张截图
↓
确认后一次推进 main
↓
Vercel Production
```

Build 和 Visual Review 都支持 `tmp-*`；`vercel.json` 禁止 `tmp-*` 自动部署，因此高频 UI/逻辑迭代不会持续触发 Vercel。

Vercel 从仓库根目录构建：

```text
Build Command: npm run build
Output Directory: Web/dist
```

判断线上是否已经更新时，必须比较 Vercel Production Deployment 的 Git SHA 与 GitHub `main` SHA。

详细流程见 `Documentation/开发与部署工作流.md`。
