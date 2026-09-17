# AGENTS.md

本仓库用于《万户天工》的居民生成、背景人生模拟、生活事件与叙事内容设计。

## 项目别名与接续

- 本项目在对话中的固定简称是 **“居民逻辑网页demo”**。
- 当用户在新的对话中说“居民逻辑网页demo 做到哪了 / 继续做居民逻辑网页demo”等，默认指向 `JiongXiaGu/wanhu-resident-sim`。
- 不仅依赖聊天记忆；先读取 GitHub `main`、`README.md`、本文件以及 `Documentation/居民逻辑网页Demo接续说明.md`，再根据最新 commit、Actions 与代码回答当前状态。
- 详细接续步骤见 `Documentation/居民逻辑网页Demo接续说明.md`。

## 工作边界

- `Content/LifeEvents/` 是默认玩家居民面板使用的短生活事件定义。
- `Content/Stories/` 与 `居民故事/` 保留较长的 Legacy Story；默认不再直接进入玩家 Resident Panel，只供素材与完整审查器使用。
- `Documentation/` 只记录稳定、长期值得维护的设计事实与规则。
- `Tools/StoryCompiler/` 负责 Legacy Story Markdown 标准化。
- `Tools/ResidentGenerator/` 负责从稳定定义与 Seed 生成居民验证快照。
- `Tools/LifeEventCompiler/` 负责把 LifeEvent V2 合并进 generated definitions。
- `Web/` 只负责展示、模拟验证与审查，不自行发明另一套 Story / Resident 数据规则。
- Unity 后续消费编译结果，不在 Runtime 解析 Markdown / JSON。

## 居民模拟规则

- 居民常规后台模拟只读取自己的状态、全局只读世界快照和少量只读定义。
- 允许保存父母、配偶、家庭等关系引用，但常规模拟不沿这些引用传播状态。
- 结婚、出生、死亡、搬家等低频结构变化由集中结构系统处理，不进入高频居民并行更新。
- `BirthDay`、职业、家庭与重要人生历史长期保存；普通 LifeLog 使用有限容量。
- 当前活动优先在玩家查看时根据职业、时间和状态推导，不为所有后台居民做逐小时完整日程仿真。
- 姓名允许重复；同一 Seed 必须稳定得到相同身份、家庭基础数据与 PortraitSeed。

## 玩家居民面板规则

- 玩家点击居民优先回答：他是谁、属于哪里、现在做什么、最近过得怎样、过去经历过什么。
- 住处、工作地、家庭使用已有 ID / Household 冷数据建立可点击关联，不新增关系传播。
- LifeEvent V2 当前 Stage 完整显示，同一事件旧 Stage 只保留轻量前情。
- Routine 视觉级别低于 LifeEvent，不与重要事件争夺正文空间。
- LifeEvent 可以用 `source` 标记城市、家庭、营生、天气或个人来源，让玩家理解城市变化如何作用到具体居民。
- `activityOverride` 只在事件确实改变当前活动时使用，例如服役期间覆盖原职业活动。
- LifeEvent V2 标题尽量 8～18 个中文字符，正文通常 25～55 字，摘要通常 15～30 字。
- 不为了兼容旧 Story 篇幅而牺牲 Resident Panel 的玩家体验；不合适的 Legacy Story 可以重写、仅作素材或淘汰。

## Legacy Story 规则

- Legacy Story 仍采用三阶段分支结构，主要用于内容素材与完整审查器。
- 分支标题仅供作者侧概括，关键因果必须写入正文。
- 明确时间锚点优先于通用时间范围。
- 文件名使用故事标题本身，不使用“最终版、修正版、重新审查版”等长期版本后缀；历史交给 Git。

## 代码规则

- Parser / Validator / Exporter 分工清晰。
- 修改稳定数据格式时同步更新 Schema 与长期设计文档。
- 稳定 ID 不应由显示标题决定。
- Web 组件只使用 compiled/generated 数据，不直接把人工维护源文件当运行时实例。

## Git 与部署工作流

- 高频迭代优先在 `tmp-*` 临时分支完成；Build 与 Resident Visual Review 都应支持 `tmp-*`。
- `tmp-*` 不触发 Vercel 自动部署；确认后再把一个完整逻辑批次推进到 `main`。
- 一个逻辑功能批次尽量只产生一个进入 `main` 的 commit。
- 同一功能涉及多个文件时，先完成整批修改，再一次性提交；不要按“一个文件一个 commit”的方式连续推进 `main`。
- 自动化助手修改多个文件时，优先使用 Git tree / 单次 commit 的方式写入仓库。
- 准备更新 `main` 前必须重新读取当前 main SHA；如果 main 已前进，先合并 / 重放，不基于过期 SHA 强制覆盖 main。
- GitHub Actions 是主要构建与类型验证入口；Visual Review Artifact 是主要 UI 截图审查入口。
- UI 审查结果默认解压 Artifact 后直接给用户关键单张 WebP 链接，不只发 ZIP；完整包仅在用户需要时提供。
- Vercel 用于阶段性 Production 交互验证，不作为每次微小改动后的逐文件编译器。
- 遇到 Vercel 频率限制时不连续推空 commit；限制解除后只部署当时最新 `main`。
- 判断 Vercel 是否更新必须比较 Production Deployment 的 Git SHA 与 GitHub `main` SHA。
- 详细规则见 `Documentation/开发与部署工作流.md`。

## 文档原则

代码是具体实现的权威来源；测试用于验证实现。正式文档记录设计目标、参数、职责边界、数据契约、关键不变量、游戏规则，以及关键决策与原因。不添加过程性机器元数据。
