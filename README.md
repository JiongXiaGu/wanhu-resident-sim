# wanhu-resident-sim

《万户天工》居民系统的设计、内容生产、玩法原型与数据管线验证仓库。

本仓库同时承担两件事，但保持边界清楚：

1. **Web Demo**：快速验证 Resident Panel、LifeEvent、人生经历、内容密度和交互体验。
2. **Resident Content Pipeline**：建立可批量生产、可校验、可编译，并能被未来 Unity Runtime 消费的居民内容源。

Web Demo 是玩法与内容原型，不是 Unity ECS 内存结构规范。未来 Unity ECS 不直接照搬 `Web/src` TypeScript 类型，也不在 Runtime 解析 Markdown / JSON。

## 项目别名

对话中提到 **“居民逻辑网页demo”**，默认就是本仓库。

新对话继续项目时优先读取：

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
Documentation/居民内容生产与运行时数据管线V1.md
Documentation/居民内容契约V1.md
Documentation/StoryBucket与内容覆盖V1.md
```

然后检查 GitHub `main`、Actions 与必要代码。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/                          # 人工维护的内容源
│  ├─ Stories/                       # Legacy Story Markdown
│  ├─ LifeEvents/                    # Resident Panel 短生活事件
│  ├─ Names/                         # Name V2 唯一姓名源
│  ├─ Occupations/                   # 职业 + Occupation Group
│  ├─ Tags/                          # LifeTag Registry
│  ├─ Appearance/                    # Appearance Part / Palette Authoring
│  ├─ Routines/                      # 普通生活表现模板
│  └─ Simulation/                    # Demo 生成与模拟参数
├─ Documentation/                    # 长期设计与数据契约
├─ Schemas/                          # Authoring / Demo Schema
├─ Tools/                            # Compiler / Generator
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

Web Demo 可以使用调试友好的 JSON、字符串 Stable ID、固定快照和 DEV 工具；不负责定义 Unity ECS 组件布局、BlobAsset 内存布局、正式存档格式和角色资源加载策略。

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

`definitions.json` 已收拢 Name、LifeTag、Occupation Group、Occupation、Routine、LifeEvent、Appearance Catalog、Story Bucket 和编译统计；Web 后续可以只消费这一份最终 Definition Bundle。

`resident-snapshot.json` 已保存：

```text
surnameId / givenNameId
lifeTags[]
appearance AppearanceDNA
```

这些仍是 **Web Demo / Compiler 输出**，不是未来 Unity Save 格式。

## 已落地的数据契约

### Name V2

ResidentGenerator 直接消费带 Stable ID、权重、性别和代际条件的姓名 token。姓名允许重复；子女通常继承父系姓氏 Stable ID。

### LifeTag

LifeEvent 支持：

```text
requiredTags / forbiddenTags
addTags / removeTags
```

过去章节可以留下轻量事实，未来故事读取它形成低成本回响，不需要扫描人生全文。

### Occupation Group + Story Bucket

每个职业拥有 `groupId`。Compiler 已按：

```text
LifeStage + OccupationGroup
```

预编译 `story-buckets.json`，以后故事规模扩大时不需要每个居民扫描全部 LifeEvent。

### Structural Effect Contract

LifeEvent 已定义结构变更请求：

```text
changeOccupation
moveHousehold
formMarriage
addChild
```

当前只是内容 / Compiler 契约，Web 尚不直接执行。正式 Unity Runtime 必须转成集中结构 Request / Command，再统一做结构变化。

### Appearance / AppearanceDNA

`Content/Appearance/appearance-parts.json` 已成为正式 Appearance Authoring 起点。

当前定义：

```text
Part:
face / hair / brow / facial-hair / headwear / outfit

Palette:
skin / hair / clothing
```

ResidentAppearanceCompiler 会按 Seed + Gender + LifeStage + OccupationGroup 生成稳定 AppearanceDNA，并写入 Web Snapshot。正式游戏居民创建后应把最终 DNA 写入存档，不能只依赖当前资源池重新用 Seed 随机。

## 玩家居民面板

默认验证五个问题：

```text
他是谁？
他属于哪里？
他现在做什么？
他正在经历或最近发生了什么？
他过去有哪些值得记住的人生章节？
```

生活模式负责“现在”；人生模式负责“过去”。进入人生模式后不再混入 Activity、当前 LifeEvent 和 Routine，只显示已经沉淀的 Life Chapter，并允许展开故事章节。

## 正式数据管线目标

```text
Authoring Data
      ↓
Resident Content Compiler
校验 / 引用解析 / Stable ID / Bucket / Coverage
      ↓
Compiled Content
├─ Web Demo Bundle
└─ Unity ResidentContentBlob
      ↓
Runtime State / Save Data
```

核心原则：

- 人工维护内容是唯一内容源。
- Web 与 Unity 共享 Stable ID、字段语义和规则，但物理布局不同。
- 故事正文、姓名文本、职业显示名和资源定义不复制进每个 Resident。
- Runtime 实例只保存必要状态、Stable ID / RuntimeIndex、少量 StoryThread / LifeChapter / AppearanceDNA。
- 存档不依赖易变数组下标。

## 核心性能方向

- 居民低频更新只读自己的状态、全局只读世界快照和少量编译定义。
- 家庭与家谱允许保存引用，但常规模拟不沿关系网高频传播。
- 结婚、出生、搬家、换职业等结构变化通过集中结构命令处理。
- `BirthDay` 长期保存，年龄按当前时间推导。
- Activity 按需推导，不为全城逐小时跑完整日程。
- Story Bucket 先粗筛，再做 LifeTag / Family / World 等精确 Eligibility。
- Routine 正式 Runtime 方向是确定性按需生成，而不是永久保存大量普通日志。
- AppearanceDNA 保存稳定选择结果；Portrait / 3D 可以共享关键识别特征。

## 分阶段路线

```text
阶段 1  数据契约
StableId / LifeTag / Name / OccupationGroup / LifeEvent / Appearance

阶段 2  Content Compiler
Reference Validate / Story Bucket / Coverage / Web Bundle

阶段 3  Web Demo 迁移
Story Selector / Portrait / Effect Request 开始真正消费编译输出

阶段 4  Unity Runtime Contract
ResidentContentBlob / ECS Hot-Cold / Save StableId

阶段 5  批量生产
按 Coverage Matrix 扩充故事、姓名、职业和头像资源
```

当前阶段 1 的核心基础已基本覆盖，并已进入阶段 2 / 3 的交界。下一步优先让 Web Story Selector 真正消费 Story Bucket，再让头像展示真正消费 AppearanceDNA。

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

Build 会上传 `resident-generated-data` Artifact，用于直接检查所有 compiled JSON。`tmp-*` 允许正常触发 Vercel Preview。不要为了触发部署连续推空 commit。

详细流程见 `Documentation/开发与部署工作流.md`。
