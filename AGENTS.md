# AGENTS.md

本仓库用于《万户天工》的居民玩法、生活事件、人生经历、内容生产与 Web 原型验证。

## 项目别名与接续

- 本项目在对话中的固定简称是 **“居民逻辑网页demo”**。
- 用户说“居民逻辑网页demo 做到哪了 / 继续做居民逻辑网页demo”等，默认指向 `JiongXiaGu/wanhu-resident-sim`。
- 新对话不要只依赖聊天记忆；先读取 GitHub `main`、`README.md`、本文件、`Documentation/居民逻辑网页Demo接续说明.md`、`Documentation/居民面板与生活事件V2.md`、`Documentation/居民生活记录与故事连续性.md`，再根据最新 commit、Actions 与代码回答。

## 项目边界

### 这个仓库现在只验证玩法

Web Demo 的目标是回答：

```text
居民值不值得点？
故事是否像真实生活？
过去是否会影响后来？
家庭 / 职业变化以后人物是否真的变化？
城市建设是否能反馈到个人？
人生经历是否值得翻阅？
内容扩大后会不会明显重复？
```

不要在这个仓库继续设计：

```text
Unity Save 格式
BlobAsset / ResidentContentBlob
RuntimeIndex / StableIdHash 存档方案
正式 ECS Hot / Cold 组件
二进制序列化
正式资源加载 / RenderTexture Cache
```

这些进入 Unity 工程时重新设计。Web TypeScript 类型、JSON Snapshot 和 Prototype Effect 都不是正式 Runtime 契约。

### Content / Compiler 的作用

`Content/` 和 `Tools/` 继续保留，因为它们能帮助 Web 原型批量生产和稳定复现玩法：

- Schema / Reference Validation
- Stable ID
- Name V2
- LifeTag Registry
- Occupation Group
- Story Bucket
- Coverage Report
- Appearance Catalog

这些机制服务“内容不写乱、原型可重复、能统计缺口”，不是提前定义 Unity 存档。

## 当前编译状态

当前主要 Authoring：

```text
Content/Names/
Content/Tags/
Content/Occupations/
Content/LifeEvents/
Content/Routines/
Content/Appearance/
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

最终 Web Snapshot：

```text
wanhu.resident-snapshot.v3
```

这些都只是 Web / Compiler 验证格式。

## 居民玩法规则

- `BirthDay` 推导年龄；Web 可以直接保存方便调试的字符串 ID 和显示字段。
- 当前 Activity 主要按职业 / 时间 /当前故事按需推导。
- `Routine` 只负责生活感，不进入永久人生经历。
- `LifeEvent` 是当前正在发生的一件连续事情，默认三阶段。
- `Life Chapter` 是值得长期回看的经历；人生模式只看已经沉淀的过去。
- 不维护独立“近况 Summary”。
- 人生模式打开后，不混入 Activity、当前 LifeEvent 和 Routine。
- 有 `sourceEventId` 的人生章节可以展开原始三阶段故事。

## LifeTag / 连续故事

- 多故事线不等于完整社会图。
- 大多数故事独立结束；少量重要故事留下 `LifeTag`。
- 后续故事读取 LifeTag / Family / Occupation 等紧凑状态，不扫描历史全文。
- `requiredTags / forbiddenTags / addTags / removeTags` 已进入真实 Web Selector。
- Story Bucket 已由 Web Selector 真正消费：先 `LifeStage + OccupationGroup` 粗筛，再做精确 Eligibility。

## Prototype Effect 规则

Web Demo 允许 Story 完成后直接改变 Demo 状态，这是为了验证玩法，不模拟 Unity 架构。

当前可用于原型的结构效果：

```text
changeOccupation
moveHousehold
formMarriage
addChild   # 目前不执行，直到需要真实 Child Resident 的玩法切片
```

Web 原型执行原则：

- LifeTag 在故事完成时真实增减。
- `changeOccupation / moveHousehold / formMarriage` 可以直接修改当前 Web Snapshot。
- 结构型故事在 Web 中实际发生后，应进入人生经历，防止“文字说变了，人物没变”。
- 结构效果一旦应用必须幂等，不能因 React 重渲染重复结算。
- `formMarriage` 必须建立真实 `spouseId`，并让配偶进入同一 Household，Family Drawer 应能点到配偶。
- Prototype Effect 的实现不应被解释为未来 Unity 的结构变更方式。

当前自动验收链：

```text
未婚居民
↓
“这门亲事定下来了”
↓
真实 spouse / Household 变化
↓
lifetag.newly-married
↓
“两个人一起过日子以后”
↓
临时 LifeTag 被移除
```

Resident Visual Review 必须继续验证这条链。

## 姓名规则

- 姓名允许重复，不做全城唯一检测。
- Given Name 使用审核过的完整 token，不默认任意汉字笛卡尔组合。
- Household 先于成员生成；子女通常继承父系姓氏，配偶保留原姓。
- `displayName` 是 Web 便利字段。

## Appearance 规则

- AppearanceDNA 在本仓库只用于“同一个居民的视觉身份稳定、可辨认”。
- `Content/Appearance/appearance-parts.json` 是当前 Authoring 起点。
- Part Slot：`face / hair / brow / facial-hair / headwear / outfit`。
- Palette Slot：`skin / hair / clothing`。
- 不把 AppearanceDNA 当未来 Unity 存档格式。
- 当前 Web 简化头像可以继续迭代，只要能帮助验证居民辨识度。

## 内容生产原则

- Authoring 是权威来源，generated 文件不手工改。
- Stable ID 不由标题和数组位置决定。
- 批量生产前先做 Schema、Reference Check 和 Coverage。
- LifeEvent 库扩大后优先迁移为“一条事件一个 Authoring 文件”。
- Coverage 至少关注年龄、职业 / 职业组、家庭状态、性别题材、人生主题和故事重复率。
- 不为了“数量”一次堆大量故事；先看试玩反馈和 Coverage 缺口。

## 当前玩法验证优先级

```text
1. Story Effect 真正改变人物
2. 过去经历 → 后续故事连续性
3. 城市 / 世界变化 → 居民反馈
4. 有限并行生活线 + 重大故事互斥
5. 故事密度、重复率、人生节奏
6. Coverage 驱动的内容扩充
7. 玩家试玩反馈
```

Unity Runtime / Save 不再是本仓库的下一阶段。

## 代码规则

- Web 组件只消费 compiled / generated 数据。
- Prototype reducer 可以直接改 Demo Snapshot，但必须限制在 Web 原型层。
- Parser / Validator / Compiler / Web Prototype 职责分开。
- 修改稳定 Authoring 字段时同步更新 Schema 和必要文档。
- 玩法改动优先增加可自动验证的交互，而不是只写文档。

## Git 与部署工作流

- 高频迭代优先 `tmp-*`；玩法 / UI 分支优先 `tmp-prototype-*`。
- Build 与 Resident Visual Review 必须通过后再推进 `main`。
- `tmp-*` 允许 Vercel Preview；`main` 对应 Vercel Production。
- 一个逻辑批次尽量只产生一个进入 `main` 的 commit。
- 更新 `main` 前重新读取最新 SHA，不基于过期 SHA 覆盖。
- Build 先执行 `build-content`，上传 `resident-generated-data` Artifact，再构建 Web。
- Visual Review 不只看截图，也应验证状态变化、人生历史、连续故事等玩法逻辑。
- 不为了触发 Vercel 连续推空 commit。

## 文档原则

代码是具体实现的权威来源；测试用于验证实现。正式文档记录稳定的玩法规则、内容契约、职责边界和关键决策，不添加过程性机器元数据。
