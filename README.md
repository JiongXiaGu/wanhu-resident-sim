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
Documentation/居民面板与生活事件V2.md
Documentation/居民生活记录与故事连续性.md
Documentation/StoryBucket与内容覆盖V1.md
Documentation/头像系统与美术资源规范V1.md
Documentation/Portrait Art Kit V1.md
```

然后检查 GitHub `main`、Actions 与必要代码。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/                          # 人工维护的原型内容源
│  ├─ Stories/                       # Legacy Story Markdown
│  ├─ LifeEvents/                    # Resident Panel 短生活事件
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

## Web Demo 的验收问题

当前所有实现都优先服务下面这些问题：

```text
1. 点一个陌生居民，我有没有兴趣继续看？
2. 他现在的生活是否可信？
3. 几段故事组合起来是否像一个人的人生？
4. 过去发生的事情是否真的会影响后来？
5. 家庭 / 职业等状态变化以后，人物是否真的发生变化？
6. 城市建设与世界变化能否反馈到具体居民？
7. 连续查看十几个居民以后，会不会明显重复？
8. “人生经历”是否值得玩家主动翻阅？
9. 连续看几十个居民时，头像能否稳定、可辨认、不过度重复？
```

只要某项实现不能帮助回答这些问题，就不应在 Web Demo 中继续扩展。

## 当前内容编译链

`npm run build-content` 当前执行：

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

### 居民当前生活

玩家可以看到：

```text
姓名 / 年龄 / 职业 / 家庭
此刻 Activity
正在经历 / 最近发生
少量 Routine
```

Routine 只负责生活感，不进入永久人生经历。

### LifeEvent 三阶段故事

LifeEvent 会随时间推进三个阶段，并保留前一阶段作为轻量上下文。完成后，普通事件逐渐淡出；重要事件进入人生经历。

### 人生经历

人生模式与当前生活模式分离。打开后只看已经沉淀的过去：

```text
按年龄从小到大排列的一条时间轴
事实型人生节点
可展开的一段 memoryText 回忆
如今
```

不会混入当前 Activity、当前 LifeEvent 和 Routine，也不再显示“少年 / 青年 / 壮年”等阶段分组。

### LifeTag 连续性

LifeEvent 支持：

```text
requiredTags / forbiddenTags
addTags / removeTags
```

过去故事可以留下一个轻量事实，后续故事读取它形成回响。例如：

```text
曾经服役
↓
多年后旧同伍进城
```

### Story Bucket

Web Selector 已真正使用：

```text
LifeStage + OccupationGroup
↓
粗候选池
↓
Age / Gender / Family / LifeTag 精确过滤
```

Story Bucket 的目的只是让原型能扩到更大的内容量，并继续观察重复率和覆盖缺口。

### Prototype Effect

Web Demo 现在允许完成故事后直接改变 Demo 内的居民状态。

当前用于验证的效果包括：

```text
LifeTag 增减
换职业
家庭搬迁
成婚
```

这只是 **玩法原型 reducer**，不是 Unity 的结构变更架构。

结构型故事在 Web 中完成后可以：

```text
故事完成
↓
居民状态真的变化
↓
人生经历留下章节
↓
新的 Family / Occupation / LifeTag 条件进入候选池
↓
出现后续故事
```

当前已有一条专门用于验收的连续链：

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

这条链由 Resident Visual Review 自动验证。

### AppearanceDNA / 头像实验室

当前已经有独立的随机头像验证页：

```text
/?view=portraits
```

它一次生成 64 个随机样本，并用 `AppearanceDNA` 驱动分层 SVG 头像。当前 Portrait Art Kit V1 使用 4:5 美术母版 + 1:1 Safe Area，同时验证女性长发轮廓、财富服装层次和同屏 silhouette 去重。

页面可以查看：

```text
Face / Back Hair / Front Hair / Brow / FacialHair
Headwear / Outfit / Age Overlay
Skin / Hair / Clothing Palette
4:5 Master / 1:1 Crop
```

职业只作为居民信息显示，不参与服饰 Resolver。这套 SVG 只是 Web 表现层；未来 Unity 只需要复用 AppearanceDNA、PortraitRig、Safe Area、silhouetteType 与 Stable ID 语义，再重新映射到 Sprite、Mesh、Material 或其它资源。

详细规则见：

```text
Documentation/头像系统与美术资源规范V1.md
Documentation/Portrait Art Kit V1.md
```

## 内容生产原则

为了方便后续批量生产，当前仍保留：

```text
Stable ID
Schema / Reference Validation
Name V2
LifeTag Registry
Occupation Group
Story Bucket
Coverage Report
Appearance Catalog
```

它们的目的不是提前设计正式存档，而是保证：

- AI / 人工可以批量生产内容而不把引用写乱。
- 同一故事不会因为改标题就失去身份。
- 可以统计年龄、职业、性别、家庭等内容缺口。
- Web Demo 可以稳定重现问题和验收结果。

## 当前玩法验证路线

后续优先级改为：

```text
1. 人生经历阅读体验与回忆文本
2. Story Effect 真正改变人物
3. 过去经历 → 后续故事连续性
4. 头像随机组合、年龄感和家庭相似度
5. 城市 / 世界变化 → 具体居民故事
6. 同一居民有限的并行生活线与互斥规则
7. 故事密度、重复率和人生节奏
8. 按 Coverage Matrix 批量扩充内容
9. 玩家实际试玩与反馈迭代
```

不再把 Unity Save、Blob、ECS Runtime Contract 作为 Web Demo 的下一阶段任务。

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

头像实验室：

```text
http://localhost:5173/?view=portraits
```

美术风格对比实验室：

```text
http://localhost:5173/?view=portrait-styles
```

当前用同一批 Golden Residents 横向比较 8 种路线：纸片拼贴、墨线淡彩、套色木刻、简化写意、克制 Q 版、白描人物、陶俑泥塑、民俗年画套色。

## GitHub Actions / Visual Review / Vercel

一次逻辑开发批次先聚合修改，再只向远端 `tmp-*` 推送一个 commit。Build 与 Resident Visual Review 通过后，再一次推进 `main`。

Build 会上传 `resident-generated-data` Artifact；Resident Visual Review 会同时检查居民玩法链和头像实验室。

不要为了刷新 Vercel 连续制造空提交或逐文件远端提交。Vercel 当前只作为部署结果，不作为 Web 原型逻辑正确性的唯一依据。

详细流程见 `Documentation/开发与部署工作流.md`。
