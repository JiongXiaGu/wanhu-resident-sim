# 居民逻辑网页 Demo 接续说明

## 固定称呼

本项目的对话简称是：

> **居民逻辑网页demo**

当用户在新的对话中说：

```text
居民逻辑网页demo 做到哪了？
居民逻辑网页demo 继续做
看看居民逻辑网页demo 现在的状态
```

默认指向：

```text
GitHub: JiongXiaGu/wanhu-resident-sim
```

它不是单纯的故事仓库，而是《万户天工》的低成本居民生命模拟、LifeEvent、Resident Panel 与 Web 验证项目。

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
- Recent LifeLog
- Major Life History

不做：

- 全城关系网传播
- 复杂情绪传播
- 每个居民逐小时完整日程
- 全城姓名唯一检测
- 高频家庭成员互相查询

---

## 玩家居民面板当前方向

玩家点击居民时优先回答五个问题：

```text
他是谁？
他属于哪里？
他现在做什么？
他最近过得怎么样？
他过去经历过什么？
```

Resident Panel V2 已围绕这些信息组织：

- 头像、姓名、年龄、职业
- 居住坊区与家庭摘要
- 住处 / 工作地 / 家人入口
- 此刻 Activity
- 近况 Summary
- 当前 LifeEvent
- 同一事件的轻量前情
- 低视觉级别 Routine
- 关注居民
- 人生经历

目标不是“点 NPC 看一篇故事”，而是：

> **点这个人，看看他最近过得怎么样。**

---

## LifeEvent V2

玩家默认面板使用：

```text
Content/LifeEvents/
```

而不是把旧长篇 Story 直接塞进 400px 面板。

LifeEvent V2 通常包含：

```text
id
weight
eligibility
source
stages[3]
  delayDays
  title
  text
  summary
  activityOverride?
```

设计重点：

- 标题短。
- 正文比旧 Story 更短，适合真实 UI。
- `summary` 回答“最近过得怎么样”。
- `source` 把居民经历与城市建设、工作、家庭、天气等连接起来。
- `activityOverride` 在事件确实改变当前生活时覆盖职业默认 Activity。

现有 Legacy Story：

```text
Content/Stories/
居民故事/
```

保留为素材库与完整审查器。旧故事如果影响真实游戏体验，可以拆解重写或直接淘汰，不要求兼容。

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

Tools/ResidentGenerator/
Tools/LifeEventCompiler/
Tools/StoryCompiler/

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

向用户汇报时，默认直接给关键单张截图链接，不只给 ZIP。

例如：

```text
玩家居民面板
生活事件推进
人生经历展开
DEV 密度检查
```

完整 ZIP 仅在用户需要时提供。

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

如果 Vercel 看起来没更新，比较：

```text
GitHub main SHA
vs
Vercel Production SHA
```

而不是只看页面或时间。

---

## 下一阶段优先级

继续项目时优先考虑：

1. 扩充 LifeEvent V2 覆盖面，让年龄、职业、家庭状态产生明显差异。
2. 增加少量真正改变 Resident 状态的事件结果，例如服役、换工、家庭变化。
3. 强化城市建设 / 天气 / 营生变化对居民面板的可见反馈。
4. 保持居民独立并行，避免演化成高成本社会关系图。
5. 每轮 UI 改动继续用 400px 左下 Resident Panel 和 Visual Review 截图验证。

不要为了保留旧内容而退回“故事窗口中心”的设计。
