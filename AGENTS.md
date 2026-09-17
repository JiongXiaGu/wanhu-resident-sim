# AGENTS.md

本仓库用于《万户天工》的居民生成、背景人生模拟、生活事件、人生章节、内容生产与 Web 原型验证。

## 项目别名与接续

- 本项目在对话中的固定简称是 **“居民逻辑网页demo”**。
- 用户说“居民逻辑网页demo 做到哪了 / 继续做居民逻辑网页demo”等，默认指向 `JiongXiaGu/wanhu-resident-sim`。
- 新对话不要只依赖聊天记忆；先读取 GitHub `main`、`README.md`、本文件、`Documentation/居民逻辑网页Demo接续说明.md`、`Documentation/居民内容生产与运行时数据管线V1.md`、`Documentation/居民内容契约V1.md`，再根据最新 commit、Actions 与代码回答。

## 项目边界

### Web Demo

`Web/` 是玩法、UI、内容密度与交互原型：

- 验证 Resident Panel、LifeEvent、人生经历和故事阅读体验。
- 可以使用调试友好的 JSON、字符串 Stable ID、固定快照和 DEV 工具。
- 不作为 Unity ECS 内存布局、正式 Save 格式或角色渲染架构的权威实现。

### Content / Compiler

`Content/` 是人工维护内容源；`Tools/` 把内容编译成不同消费目标。

长期目标：

```text
Authoring Data
↓
Resident Content Compiler
├─ Web Demo Bundle
└─ Unity ResidentContentBlob
```

Web 与 Unity 可以拥有不同物理布局，但必须共享 Stable ID、字段语义、条件规则和内容语义。

### Unity Runtime

- Unity 最终消费编译后的紧凑数据，不在 ECS Runtime 解析 Markdown / JSON。
- Web TypeScript 类型不是 Unity ECS 组件契约。
- Runtime 数据优先 Hot / Cold 分离、BlobAsset 只读定义、稀疏更新和集中结构变更。

## 当前编译状态

当前主要 Authoring：

```text
Content/Names/              Name V2
Content/Tags/               LifeTag
Content/Occupations/        Occupation + Occupation Group
Content/LifeEvents/         LifeEvent
Content/Routines/           Routine
Content/Appearance/         Appearance Part / Palette
```

当前 `build-content` 顺序：

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

最终 Web Definition Bundle：

```text
wanhu.resident-definitions.v4
```

包含 Name、LifeTag、Occupation Group、Occupation、Routine、LifeEvent、Appearance Catalog、Story Bucket 与调试统计。

最终 Web Snapshot：

```text
wanhu.resident-snapshot.v3
```

包含 Stable Name ID、LifeTag 与稳定 `appearance` / AppearanceDNA。

这些仍是 Web / Compiler 验证格式，不是正式 Unity Save。

## 数据生产原则

- 人工维护内容是权威来源，generated / compiled 文件不手工编辑。
- Stable ID 不由显示标题、数组位置或文件排序决定。
- Save 不长期依赖易变数组下标；正式 Save 使用 StableId / StableIdHash，再加载解析 RuntimeIndex。
- 故事正文、职业显示名、姓名文本、头像资源定义不复制进每个 Resident 实例。
- 批量生产前先建立 Schema、Validator、Reference Check 和 Coverage Report。
- LifeEvent 内容库扩大后优先迁移为“一条事件一个 Authoring 文件”，避免巨型单文件成为长期瓶颈；迁移可以分阶段。

## 姓名规则

- 姓名允许重复，不做全城唯一检测。
- Given Name 使用人工审核过的完整 token，例如“明远”“静和”，不默认把单字任意组合。
- Name V2 使用稳定 ID、权重、性别 / 代际 / 风格标签。
- Household 先生成家庭，再生成成员；子女通常继承父系姓氏，配偶保留原姓。
- `displayName` 是 Web Demo 便利字段；正式 Runtime 更适合保存 `SurnameId + GivenNameId`。

## Appearance / 头像规则

- `Content/Appearance/appearance-parts.json` 是当前 Appearance Authoring 起点。
- Part Slot：`face / hair / brow / facial-hair / headwear / outfit`。
- Palette Slot：`skin / hair / clothing`。
- Appearance 定义可以按 gender、lifeStage、occupationGroup 过滤，并拥有 Stable ID。
- ResidentAppearanceCompiler 当前会给 Web Snapshot 写入稳定 AppearanceDNA：Face/Hair/Brow/FacialHair/Headwear/Outfit 与三类 Palette ID。
- Web 中保留 `PortraitSeed` 作为兼容 / 第一次生成依据，但正式居民创建后必须保存最终 AppearanceDNA；不能每次根据变化后的资源池重新由 Seed 选外观。
- UI Portrait 与世界 3D Character 应共享关键识别特征，例如年龄、性别、发型、胡须、头饰、职业服饰类别；不要求逐像素相同。
- 大量居民头像按需生成并缓存，不为全城长期持有 RenderTexture。

## 居民模拟规则

- 居民常规后台模拟只读取自己的状态、全局只读世界快照和少量编译后的只读定义。
- 允许保存父母、配偶、家庭等引用，但常规模拟不沿关系网高频传播。
- 结婚、出生、死亡、搬家、换职业等低频结构变化由集中结构系统处理，不进入普通并行更新路径。
- `BirthDay` 长期保存，年龄由时间推导。
- Activity 按需推导，不为所有后台居民逐小时运行完整日程。
- 人生不是出生时一次生成完整剧本；不同年龄阶段低频进入故事池，多次抽取 Story Thread。
- 不要求每个居民、每个年龄阶段都发生重大剧情；故事密度允许由 Seed 稳定产生差异。

## Routine / Story / Life Chapter

- `Routine` 是普通生活表现，不进入永久人生经历。
- 正式 Runtime 优先考虑由 `ResidentSeed + Day + Occupation + WorldSnapshot` 确定性按需生成近期 Routine，而不是永久保存普通文本日志。
- `LifeEvent / Story Thread` 是正在发生的一件连续事情。
- `Life Chapter` 是值得长期回看的重要经历；一条多阶段故事只形成一个 Chapter。
- Story Chapter 保存 Event ID / Outcome 等紧凑数据，正文在 UI 展开时从编译 Content Database 查询。

## LifeTag / Story Anchor

- 多故事线不等于完整社会图。
- 大多数故事独立结束；少量重要故事留下轻量 `LifeTag / Story Anchor`。
- Future Story 读取过去经历时优先读取 Tag / Chapter ID，不扫描历史长文本。
- LifeTag Registry 拥有 Stable ID；正式 Runtime 可编译成 bitset / RuntimeIndex。
- 背景人生生成必须按时间顺序维护 LifeTag，不能让后续回响故事先于前因出现。

## Structural Effect 规则

LifeEvent 当前允许声明：

```text
changeOccupation
moveHousehold
formMarriage
addChild
```

但 `effects.structuralRequests` 当前只是内容 / Compiler 契约。

- Web Demo 暂不把这些 Request 直接写进居民 / 家庭结构。
- Unity 中 Story 系统只产生 Request，不直接改多个 Entity。
- 真正结构变化由集中结构系统消费 Request，再用 ECB / 对应结构命令执行。
- 修改结构 Effect 契约时同步更新 Schema、Compiler 验证和长期文档。

## Story Bucket

- 当前 Compiler 已生成 `story-buckets.json`。
- Bucket 粗维度目前是 `LifeStage + OccupationGroup`。
- Runtime / Web Selector 应先通过 Bucket 得到少量候选，再做 occupation、gender、family、LifeTag、world 条件过滤。
- 不要在内容扩大后恢复成“每个居民每次扫描全部 LifeEvent”。

## 玩家居民面板规则

- 玩家点击居民优先回答：他是谁、属于哪里、现在做什么、正在经历什么、过去有哪些值得记住的人生章节。
- 不维护独立“近况 Summary”。
- 生活模式展示 Activity、当前 / 最近 LifeEvent、少量 Routine。
- 人生模式是独立浏览模式；进入后不混入 Activity、当前 LifeEvent 和 Routine，只展示已沉淀的 Life Chapter。
- 有 `sourceEventId` 的故事章节可以回查 Definition 展开原始故事。

## Content Compiler 方向

持续收敛为统一 Resident Content Compiler：

```text
Schema Validate
↓
Reference Validate
↓
Stable ID Compile
↓
Story Bucket Build
↓
Text / Asset Table Build
↓
Coverage Analyze
↓
Web Bundle + Unity Blob
```

Coverage 至少按年龄阶段、职业 / 职业组、家庭状态、性别相关题材、人生主题和 Appearance 槽位统计，避免批量生产只追求数量。

## 分阶段实现规则

当前顺序：

1. 数据契约：StableId、LifeTag、Name、Occupation、LifeEvent、Appearance。
2. Content Compiler：统一校验、引用解析、Coverage、Story Bucket、Web Bundle。
3. Web Demo 迁移：Selector、Portrait、Effect Request 真正消费编译输出。
4. Unity Runtime Contract：ResidentContentBlob、ECS Hot/Cold、Save StableId / AppearanceDNA。
5. 批量生产：按 Coverage Matrix 扩充故事、姓名和头像资源。

阶段 1 的核心基础已经基本覆盖；下一步优先推进阶段 2 / 3，不要现在先堆大量故事或美术资源。

## 代码规则

- Parser / Validator / Compiler / Exporter 分工清晰。
- 修改稳定数据格式时同步更新 Schema 与长期设计文档。
- Web 组件只使用 compiled / generated 数据，不直接把 Authoring 文件当运行时实例。
- Runtime Definition 与 Resident State 分离；Definition 只读，Resident State 只保存必要变化。
- 当前 Web 最终 definitions 为 v4；新增 compiled 子数据优先收拢到 WebContentCompiler，而不是让 App 直接发起更多 Authoring 请求。

## Git 与部署工作流

- 高频迭代优先在 `tmp-*` 分支完成；Build 与 Resident Visual Review 支持 `tmp-*`。
- `tmp-*` 允许 Vercel Preview；`main` 对应 Vercel Production。
- 数据管线 / Schema 分支建议 `tmp-content-*`；Web 玩法 / UI 建议 `tmp-prototype-*` 或语义名。
- 一个逻辑功能批次尽量只产生一个进入 `main` 的 commit。
- 多文件修改优先 Git tree / 单次 commit；更新 `main` 前重新读取最新 SHA，不基于过期 SHA 覆盖。
- Build 先执行 `build-content`，上传 `resident-generated-data` Artifact，再构建 Web Prototype。
- Visual Review 主要检查玩法 / UI；数据改动优先看 Build 与 generated artifact，必要时再看 Preview / Visual Review。
- 不为了触发 Vercel 连续推空 commit。

## 文档原则

代码是具体实现的权威来源；测试用于验证实现。正式文档记录设计目标、参数、职责边界、数据所有权、跨模块契约、关键不变量、游戏规则，以及关键决策与原因。不添加过程性机器元数据。
