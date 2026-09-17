# 居民逻辑网页 Demo 接续说明

## 固定称呼

本项目的对话简称是：

> **居民逻辑网页demo**

当用户在新的对话中说“居民逻辑网页demo 做到哪了 / 继续做居民逻辑网页demo / 看看居民逻辑网页demo 现在的状态”，默认指向：

```text
GitHub: JiongXiaGu/wanhu-resident-sim
```

它不是单纯的故事仓库，而是《万户天工》的低成本居民生命模拟、LifeEvent、人生章节、Resident Panel 与 Web 验证项目。

---

## 新对话恢复上下文的固定步骤

不要只依赖聊天记忆。先从仓库恢复真实状态：

1. 读取 GitHub `main` 最新 commit。
2. 读取 `README.md`。
3. 读取 `AGENTS.md`。
4. 读取本文件。
5. 按需要读取：
   - `Documentation/居民模拟V1架构.md`
   - `Documentation/居民面板与生活事件V2.md`
   - `Documentation/居民生活记录与故事连续性.md`
   - `Documentation/开发与部署工作流.md`
6. 检查最新 GitHub Actions Build / Resident Visual Review。
7. 如果用户问线上版本，再比较 Vercel Production 的 commit SHA 与 GitHub `main`。

回答“做到哪了”时，以仓库与 CI 的实时状态为准，而不是复述旧对话中的阶段。

---

## 当前设计方向

### 核心目标

不是模拟完整社会关系网，而是让每个居民拥有一条低成本、自洽、可回看的个人生命轨迹。

居民常规模拟保持：

```text
Resident 自身状态
+
全局只读世界快照
+
少量只读定义
+
少量人生章节 / 故事标签
↓
独立 / 稀疏 / 可并行更新
```

家庭和家谱可以保存引用，但不做高频关系传播。

### Resident V1 已确定保留

- 稳定 ResidentId / Seed
- 姓名（允许重复）
- BirthDay → 年龄
- 性别
- PortraitSeed
- 职业
- 工作地点
- Household
- 父母 / 配偶引用
- 子女数量
- 稀疏 NextUpdateDay
- 有限容量 Routine / Recent LifeLog
- Major Life History / Life Chapter

不做：

- 全城关系网传播
- 复杂情绪传播
- 每个居民逐小时完整日程
- 全城姓名唯一检测
- 高频家庭成员互相查询

---

## 玩家居民面板当前方向

玩家点击居民时优先回答：

```text
他是谁？
他属于哪里？
他现在做什么？
他正在经历或最近发生了什么？
他过去有哪些值得记住的人生章节？
```

Resident Panel V2 当前组织：

- 头像、姓名、年龄、职业
- 居住坊区与家庭摘要
- 住处 / 工作地 / 家人入口
- 此刻 Activity
- 当前或刚完成的 LifeEvent
- 同一事件的轻量前情
- 低视觉级别 Routine
- 关注居民
- 人生经历 / Life Chapter

**不再维护独立“近况 Summary”，LifeEvent Stage 本身也不保存 `summary` 字段。**

原因是居民可能同时受到多个故事、家庭、工作、天气与城市变化影响，强行维护一句综合近况会引入额外优先级和过期逻辑。当前事实直接由 Activity、LifeEvent、Routine 和人生经历表达。

---

## 三层生活信息

### Routine

普通生活记录，数量多、保存时间短，只用于让居民在故事之间持续“生活着”。不进入永久人生经历。

### LifeEvent / Story Thread

一件正在发生的连续事情。通常有三个阶段：当前阶段完整展示，旧阶段只作为轻量前情。

事件完成后不会自动成为人生历史。

### Life Chapter

真正值得长期回看的经历。

来源包括：

- 真实事实：开始营生、成婚、添孩子、搬家等。
- 重要故事：只有 `recordToHistory: true` 的 LifeEvent 完成后才进入。

一条三阶段故事只形成 **一个** Life Chapter，而不是三个历史节点。

故事章节保存 `sourceEventId`，需要展开时回查 LifeEvent Definition 获取完整三阶段内容，不把全文复制进每个居民存档。

---

## LifeEvent V2

玩家默认面板使用：

```text
Content/LifeEvents/
```

核心字段：

```text
id
weight
eligibility
source?
recordToHistory?
stages[3]
  delayDays
  title
  text
  activityOverride?
```

设计重点：

- 标题短。
- 正文适合真实 400px 居民 UI。
- `source` 把居民经历与城市建设、工作、家庭、天气等连接起来。
- `activityOverride` 只在事件确实改变当前生活时覆盖职业默认 Activity。
- `recordToHistory` 只给真正值得成为人生章节的事件。
- 不再保存单独 `summary`；Stage 自身负责表达当下情况。

当前重要故事示例：

- 服役
- 孩子入学
- 学徒第一次独立完成正式工作
- 少年第一次独自替家里办事
- 晚年形成新的稳定生活方式

普通排水施工、忙季、连续下雨、新市场等默认只属于当前生活，不永久进入人生历史。

---

## 人生由多次故事抽取组成

居民不是出生时绑定一条固定人生剧情。

设计模型：

```text
年龄阶段
+ Resident 当前状态
+ 职业 / 家庭条件
+ 世界状态
+ 过去的重要经历
↓
候选故事池
↓
低频加权抽取
↓
Story Thread
↓
完成后按重要度决定是否形成 Life Chapter
```

当前 Web 背景人生生成已经按年龄阶段从重要故事中稳定抽取少量章节：

```text
10～17
18～25
26～39
40～57
58+
```

故事密度由 Resident Seed 稳定决定：有些居民没有额外精彩故事，有些有 1～3 个跨阶段故事。系统不要求每个居民、每个年龄阶段都强行发生重大剧情。

目标是让不同故事共同组成一个人的一生，而不是让每个 NPC 都像剧情主角。

---

## 故事之间的连续性

多故事线不等于复杂社会图。

推荐方向：

```text
大多数故事独立结束
+
少量重要故事留下 LifeTag / Story Anchor
↓
未来另一条故事偶尔读取过去经历
```

例如未来可以留下：

```text
served_military
trained_as_carpenter
opened_shop
debt_history
migrated_from_x
```

后续故事只读取少量稳定标签或 Life Chapter，不扫描旧长文本，不做全城关系传播。

---

## 当前事件显示周期

主面板不让已经结束很久的故事长期占据视觉中心。

当前 Web 验证规则：

- Stage 1 / Stage 2：显示为“正在经历”。
- Stage 3：短时间显示为“最近发生”。
- 完成约 14 天后：退出主面板当前事件区域。
- 重要事件仍可从“人生经历”长期回看。
- 普通事件自然退出，不进入永久历史。

---

## 当前 Web 数据流

```text
Content / Definitions
    ↓
ResidentGenerator
    ↓
resident-snapshot.json

LifeEvents
    ↓
LifeEventCompiler
    ↓
definitions.json

Legacy Story Markdown
    ↓
StoryCompiler
    ↓
stories.json

上述 generated 数据
    ↓
Web Resident Simulation
```

关键 generated 文件：

```text
Web/public/generated/
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

---

## 当前关键代码位置

```text
Content/LifeEvents/life-events.json
Content/Occupations/occupations.json
Content/Routines/
Content/Simulation/

Tools/ResidentGenerator/generate.mjs
Tools/LifeEventCompiler/compile.mjs
Tools/StoryCompiler/

Schemas/life-event.schema.json
Schemas/resident-snapshot.schema.json

Web/src/App.tsx
Web/src/domain/resident.ts
Web/src/simulation/life-events.ts
Web/src/resident/ResidentAvatar.tsx
Web/src/resident-panel-v2.css

scripts/capture-resident-review.mjs
.github/workflows/validate.yml
.github/workflows/visual-review.yml
```

---

## UI / 截图工作方式

UI 审查参考 `wanhu-ui-prototype`：

- GitHub Actions 自动启动本地 Vite。
- Playwright 抓取 1920×1080 页面。
- 截取不同 Resident Panel 状态。
- 压缩成 WebP。
- 上传 Visual Review Artifact。

当前截图重点：

```text
玩家居民面板
生活事件推进
人生经历展开（包含可展开故事章节）
DEV 密度检查
```

Visual Review 需要确认：

- 不再出现独立“近况”行。
- LifeEvent 前情仍然连续。
- 人生经历计数只统计 Life Chapter。
- 有 `sourceEventId` 的故事章节可以展开三阶段正文。

---

## Git / Vercel 工作方式

迭代优先使用：

```text
tmp-* branch
↓
GitHub Build + Visual Review
↓
确认
↓
一次推进 main
↓
Vercel Production
```

`tmp-*` 不触发 Vercel 自动部署，避免频繁 AI/UI 修改消耗部署额度。

自动化助手在更新 main 前必须重新读取 main SHA，不基于过期 SHA 强行覆盖 main。

如果 Vercel 看起来没更新，比较 GitHub `main` SHA 与 Vercel Production SHA，而不是只看页面或时间。

---

## 下一阶段优先级

1. 扩充各年龄阶段可抽取的重要 Story / Life Chapter，尤其童年、青年、成家、营生、晚年。
2. 增加真正修改 Resident 状态的故事结果，例如换工、服役状态、家庭变化、迁居。
3. 引入极少量稳定 LifeTag / Story Anchor，让过去的重要经历在几年或十几年后偶尔产生回响。
4. 强化城市建设 / 天气 / 营生变化对当前 LifeEvent 的可见反馈，但普通事件不要污染永久历史。
5. 继续保持居民独立并行，避免演化成高成本社会关系图。
6. 每轮 UI 改动继续用约 400px 左下 Resident Panel 和 Visual Review 截图验证。

继续开发时优先完善“一个居民几十年的人生是否成立”，而不是继续扩大基础框架。
