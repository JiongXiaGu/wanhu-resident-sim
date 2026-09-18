# 居民逻辑网页 Demo 接续说明

## 固定称呼

本项目的对话简称是：

> **居民逻辑网页demo**

默认仓库：

```text
GitHub: JiongXiaGu/wanhu-resident-sim
```

当前定位只有一个：

> **用 Web Demo 验证居民玩法、故事连续性、人生经历、UI 阅读体验和内容规模化是否成立。**

`Content/`、Schema、Compiler、Coverage 等工具继续存在，是为了让原型内容可批量生产、可复现、可自动验收；它们不代表未来 Unity Runtime / Save 设计。

Unity ECS、BlobAsset、正式存档、RuntimeIndex、序列化和资源加载方式不在本仓库继续设计，正式进入 Unity 时重新根据游戏工程约束确定。

---

## 新对话恢复上下文

新对话不要只依赖聊天记忆。固定读取：

1. GitHub `main` 最新 commit。
2. `README.md`。
3. `AGENTS.md`。
4. 本文件。
5. `Documentation/人生经历与生活界面玩法规则V1.md`。
6. `Documentation/居民面板与生活事件V2.md`。
7. `Documentation/居民生活记录与故事连续性.md`。
8. `Documentation/开发与部署工作流.md`。
9. 检查最新 GitHub Actions Build / Resident Visual Review。
10. 用户问线上版本时，再比较 GitHub 分支 SHA 与 Vercel 状态：`main` 对 Production，`tmp-*` 对 Preview。

不要再把 `Documentation/居民内容生产与运行时数据管线V1.md` 或 `Documentation/居民模拟V1架构.md` 当成当前 Web Demo 下一阶段路线；其中与 Unity Runtime / Save 有关的内容只是早期设计记录。

---

## 当前 Resident Panel

### 生活模式

回答：

> **这个人现在过得怎么样？**

展示：

```text
Identity
World Links
此刻 Activity
正在经历 / 最近发生
少量 Routine
人生经历入口
```

当前 LifeEvent 仍按三个 Stage 随时间推进。Stage 文本服务“事情正在发生”的体验。

### 人生经历模式

回答：

> **这个人过去经历过什么，他是怎么走到今天的？**

进入后：

- 不显示当前 Activity；
- 不显示当前 / 最近 LifeEvent；
- 不显示 Routine 琐事；
- 只看已经沉淀的 Life Chapter；
- 只有一条纵向时间轴；
- 节点按年龄从小到大排列；
- 不显示童年 / 少年 / 青年 / 壮年等阶段分组；
- 一个节点只代表一件人生事件；
- Fact Chapter 只显示 `年龄 + 标题`；
- Story Chapter 点击后展开一段完整的第一人称 `memoryText`；
- 不在历史页显示 `起初 / 后来 / 最后` 或原始 Stage 结构；
- 时间轴末尾保留“如今”。

---

## LifeEvent 的两种文本职责

### `stages`

只服务生活模式。

玩家在事情发生时逐步看到：

```text
Stage 1
↓
Stage 2
↓
Stage 3
```

### `memoryText`

只服务人生经历。

重要故事完成以后，人生页把它当成一件已经发生过的往事：

```text
25岁 · 孩子到了该认字的年纪

我开始问附近哪家私塾合适……后来有一天回家路上，他忽然把一家铺子的招牌念了出来……
```

`memoryText` 不是把三个 Stage 原文机械拼接，而是重新压缩成角色自己的回忆。

只要事件会形成长期 Life Chapter，就必须有 `memoryText`，包括：

- `recordToHistory: true`；
- 或成婚等会形成长期人生变化的 Prototype Effect。

---

## 三层生活信息

```text
Routine
普通生活感，短期存在，不进入人生经历

LifeEvent / Story Thread
当前正在发生的一件连续事情

Life Chapter
值得长期回看的过去，一个节点就是一件事
```

不维护独立“近况 Summary”。

---

## 当前已经可以玩的连续性

### LifeTag

过去的重要故事可以留下轻量标签，未来故事通过 Eligibility 读取：

```text
服役
↓
lifetag.served-military
↓
多年后旧同伍进城
```

### Prototype Effect

Web Demo 可以直接改变原型状态，用来判断这种玩法是否有价值。

当前已支持验证：

```text
LifeTag 增减
换职业
搬迁
成婚
```

已存在自动验收链：

```text
未婚居民
↓
这门亲事定下来了
↓
真实 spouse / Household 变化
↓
lifetag.newly-married
↓
两个人一起过日子以后
↓
临时 Tag 消失
```

这些实现都只是 Web 原型，不代表未来 Unity 的结构变更方式。

---

## 当前 Web 内容数据流

```text
Content Authoring
↓
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
ResidentPortraitCompiler
↓
WebContentCompiler
↓
Web/public/generated/
↓
Web Prototype
```

主要 generated：

```text
stable-id-registry.json
name-catalog-v2.json
life-tags.json
occupation-groups.json
portrait-catalog.json
content-coverage.json
story-buckets.json
stories.json
definitions.json
resident-snapshot.json
```

这些都只是 Demo 数据。

---

## 当前头像收口任务

头像工程迁移已经完成，当前进入 Unity 迁移前的最后美术框架收口。

唯一正式头像规范：

```text
Documentation/Portrait System.md
```

目标是固定换装框架：

```text
child / adult / elder
×
female / male
=
6 个 PortraitFrame
```

同一 Frame 内允许 Face / Hair / Outfit 独立替换；所有资产必须直接符合 Frame，不允许运行时 Anchor / Mask / Offset 自动适配。

当前 V8.4 的 youth / middle 等 stage profile 仅作为资产替换前兼容桥，不再增加新功能。

## 当前玩法验证路线

接下来按玩法问题推进：

```text
1. 人生经历阅读体验 / memoryText
2. Story Effect 真正改变人物
3. 过去经历 → 后续故事连续性
4. 城市 / 世界变化 → 具体居民反馈
5. 同一居民有限并行生活线与重大故事互斥
6. 故事密度、重复率、人生节奏
7. Coverage 驱动的内容扩充
8. 玩家试玩反馈
```

不要重新把 Unity Runtime / Save 设计拉回本仓库的下一阶段。

---

## Git / Vercel 工作流

`tmp-*` 已允许 Vercel Preview，因此远端 push 本身就是部署触发器。

正确流程：

```text
最新 main
↓
建立 tmp-*
↓
集中完成本轮所有修改
↓
一个聚合 commit / 一次 push
↓
Build + Visual Review + Vercel Preview
↓
需要修正时，再聚合成一个修正 commit
↓
验收通过
↓
重新读取 main SHA
↓
一次推进 main
↓
Vercel Production
```

禁止同一批次按文件连续 push。自动化助手优先使用 `create_blob → create_tree → create_commit → update_ref` 或等价的一次性提交方式。

遇到 Vercel rate limit 时不要通过空 commit 连续重试。

---

## 当前验收问题

继续开发时优先问：

```text
点一个陌生居民，我有没有兴趣继续看？
现在的生活是否可信？
从小到大读人生时间轴是否像一个人的一生？
展开后的回忆是否像角色自己的记忆？
过去是否真的影响后来？
家庭 / 职业变化后人物是否真的变化？
城市建设能否反馈到个人？
连续看十几个居民后会不会明显重复？
```

回答“现在做到哪了”时，以最新 `main`、Actions、代码和以上当前玩法规则为准。
