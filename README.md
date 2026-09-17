# wanhu-resident-sim

《万户天工》居民玩法的 Web 演示、内容生产与原型验证仓库。

本仓库当前只回答一件事：

> **居民系统作为游戏玩法是否成立、是否有代入感、是否值得玩家持续点开和观察。**

Web Demo 是玩法原型，不是 Unity Runtime 设计稿。Unity ECS 组件、BlobAsset、正式存档、RuntimeIndex、序列化和资源加载方式都不在本仓库继续设计；正式进入 Unity 时重新根据游戏工程约束设计。

## 项目别名

对话中提到 **“居民逻辑网页demo”**，默认就是本仓库。

新对话继续项目时优先读取：

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
Documentation/人生经历与生活界面玩法规则V1.md
Documentation/居民面板与生活事件V2.md
Documentation/居民生活记录与故事连续性.md
Documentation/开发与部署工作流.md
```

然后检查 GitHub `main`、Actions 与必要代码。

## Web Demo 的验收问题

当前实现优先回答：

```text
1. 点一个陌生居民，我有没有兴趣继续看？
2. 他现在的生活是否可信？
3. 从小时候一路往下读，是否像一个人的一生？
4. 展开后的往事是否像角色自己的回忆？
5. 过去发生的事情是否真的会影响后来？
6. 家庭 / 职业等状态变化后，人物是否真的发生变化？
7. 城市建设与世界变化能否反馈到具体居民？
8. 连续查看十几个居民后，会不会明显重复？
```

只要某项实现不能帮助回答这些问题，就不应在 Web Demo 中继续扩展。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/                          # 人工维护的原型内容源
│  ├─ Stories/                       # Legacy Story Markdown
│  ├─ LifeEvents/                    # LifeEvent + memoryText
│  ├─ Names/                         # Name V2
│  ├─ Occupations/                   # 职业 + Occupation Group
│  ├─ Tags/                          # LifeTag Registry
│  ├─ Appearance/                    # Prototype Appearance Authoring
│  ├─ Routines/                      # 普通生活表现模板
│  └─ Simulation/                    # Demo 生成与模拟参数
├─ Documentation/                    # 玩法与内容规则
├─ Schemas/                          # Authoring / Demo Schema
├─ Tools/                            # Web 内容编译与验证工具
├─ Web/                              # 玩法 / UI / 内容原型
├─ scripts/                          # Visual Review 等辅助脚本
├─ AGENTS.md
├─ package.json
└─ vercel.json
```

## 当前内容编译链

`npm run build-content`：

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
↓
ResidentAppearanceCompiler
↓
WebContentCompiler
```

主要 generated 数据：

```text
Web/public/generated/
├─ stable-id-registry.json
├─ name-catalog-v2.json
├─ life-tags.json
├─ occupation-groups.json
├─ appearance-catalog.json
├─ content-coverage.json
├─ story-buckets.json
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

当前关键版本：

```text
definitions.json       wanhu.resident-definitions.v4
resident-snapshot.json wanhu.resident-snapshot.v3
```

这些文件只服务 Web 原型、内容检查和自动测试，不代表未来 Unity 存档或 Runtime 格式。

## 已经可以验证的玩法

### 当前生活

玩家可以看到：

```text
姓名 / 年龄 / 职业 / 家庭
此刻 Activity
正在经历 / 最近发生
少量 Routine
```

Routine 只负责生活感，不进入永久人生经历。

### LifeEvent 三阶段过程

LifeEvent 在生活模式里随时间推进三个 Stage，并保留上一阶段作为轻量前情。

```text
Stage 1
↓
Stage 2
↓
Stage 3
```

完成后普通事件逐渐淡出；重要事件可以沉淀为一个 Life Chapter。

### 人生经历

人生模式与当前生活模式完全分开。

人生页现在是 **一条按年龄从小到大排列的连续时间轴**：

```text
13岁 · 第一次独自替家里办事        展开
18岁 · 开始做木工
23岁 · 成了家
27岁 · 轮到我去服役                展开
31岁 · 家里添了孩子
37岁 · 如今
```

规则：

- 不显示“少年 / 青年 / 壮年”等年龄阶段分组；
- 一个节点只代表一件人生事件；
- Fact Chapter 只显示 `年龄 + 标题`；
- Story Chapter 默认收起；
- Story Chapter 展开后显示一段完整第一人称 `memoryText`；
- 不在人生页重放三个 Stage，也不显示“起初 / 后来 / 最后”；
- 不混入当前 Activity、当前 LifeEvent 和 Routine。

### Stage Text / Memory Text

```text
stages
→ 服务“现在正在发生什么”

memoryText
→ 服务“这个人后来怎样记得这件事”
```

重要人生故事必须单独写 `memoryText`，不能机械拼接三个 Stage。

### LifeTag 连续性

LifeEvent 支持：

```text
requiredTags / forbiddenTags
addTags / removeTags
```

过去故事可以留下轻量事实，后续故事读取它产生回响。例如：

```text
曾经服役
↓
多年后旧同伍进城
```

### Prototype Effect

Web Demo 允许完成故事后直接改变 Demo 内的居民状态。

当前用于验证：

```text
LifeTag 增减
换职业
家庭搬迁
成婚
```

例如：

```text
这门亲事定下来了
↓
居民真的获得配偶并同住
↓
lifetag.newly-married
↓
“两个人一起过日子以后”进入候选池
↓
后续完成后临时 Tag 消失
```

这只是玩法原型，不代表 Unity 结构变更架构。

### Story Bucket / Coverage

Web Selector 使用：

```text
LifeStage + OccupationGroup
↓
粗候选池
↓
Age / Gender / Family / LifeTag 精确过滤
```

年龄阶段在这里是 **内部候选池条件**，不是人生页 UI 分组。

Coverage 用来观察内容缺口与重复风险，不为了条数机械扩写。

### AppearanceDNA

AppearanceDNA 只负责验证：

> 同一个居民在原型里应保持稳定、可辨认的外观身份。

它不是未来 Unity 角色数据格式。

## 当前玩法验证路线

```text
1. 人生经历阅读体验 / memoryText
2. Story Effect 真正改变人物
3. 过去经历 → 后续故事连续性
4. 城市 / 世界变化 → 具体居民故事
5. 同一居民有限并行生活线与互斥规则
6. 故事密度、重复率和人生节奏
7. Coverage 驱动的内容扩充
8. 玩家实际试玩与反馈迭代
```

Unity Save、Blob、ECS Runtime Contract 不再是本仓库的下一阶段任务。

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

只编译内容：

```bash
npm run build-content
```

## GitHub Actions / Visual Review / Vercel

目标流程：

```text
最新 main
↓
建立 tmp-*
↓
集中完成一个逻辑批次
↓
一个聚合 commit / 一次 push
↓
Content Compile + Build
↓
Resident Visual Review
↓
Vercel Preview
↓
验收
↓
重新读取 main SHA
↓
一次推进 main
↓
Vercel Production
```

`tmp-*` 允许正常触发 Vercel Preview，因此 **不要再把同一批次拆成一连串远端小 commit**。每次 push 都可能请求新的 GitHub Actions 和 Vercel Deployment。

如果 Preview 需要修正，先把这一轮修正全部准备好，再一次性推一个修正 commit。

不要为了刷新部署连续推空 commit。

详细规则见 `Documentation/开发与部署工作流.md`。
