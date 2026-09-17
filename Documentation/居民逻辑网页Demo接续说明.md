# 居民逻辑网页 Demo 接续说明

## 固定称呼

本项目的对话简称是：

> **居民逻辑网页demo**

默认仓库：

```text
GitHub: JiongXiaGu/wanhu-resident-sim
```

它现在有两个明确角色：

1. **Web Demo**：居民玩法、Resident Panel、LifeEvent、人生经历与内容体验原型。
2. **Resident Content Pipeline**：未来正式游戏所需的居民 Authoring / Compiler / Runtime Contract 设计与逐步实现。

Web Demo 是演示和玩法验证层，不是 Unity Runtime 内存布局或正式存档格式。

---

## 新对话恢复上下文

新对话不要只依赖聊天记忆。固定读取：

1. GitHub `main` 最新 commit。
2. `README.md`。
3. `AGENTS.md`。
4. 本文件。
5. `Documentation/居民内容生产与运行时数据管线V1.md`。
6. 按需要读取：
   - `Documentation/居民模拟V1架构.md`
   - `Documentation/居民面板与生活事件V2.md`
   - `Documentation/居民生活记录与故事连续性.md`
   - `Documentation/开发与部署工作流.md`
7. 检查最新 GitHub Actions Build / Resident Visual Review。
8. 如果用户问线上版本，再比较 GitHub 分支 SHA 与对应 Vercel Deployment SHA：`main` 对 Production，`tmp-*` 对 Preview。

回答“做到哪了”时，以仓库、CI 和当前设计文档为准。

---

## 当前玩法原型已经确定的方向

### Resident Panel

生活模式回答：

```text
他是谁？
他属于哪里？
他现在做什么？
他正在经历或最近发生了什么？
```

人生模式回答：

```text
他过去有哪些值得记住的人生章节？
```

进入人生模式后：

- 不显示当前 Activity。
- 不显示当前 / 最近 LifeEvent。
- 不显示 Routine 琐事。
- 只显示已经沉淀的 Life Chapter。
- 故事型 Chapter 可以展开三阶段正文。

### 三层生活信息

```text
Routine
普通生活表现，不进入永久人生经历

LifeEvent / Story Thread
正在发生的一件连续事情

Life Chapter
值得长期保存和回看的重要经历
```

不再维护独立“近况 Summary”。

### 人生由多次故事组成

居民不是出生时绑定一条完整人生剧本。

```text
年龄阶段
+ Resident 状态
+ 职业 / 家庭
+ 世界状态
+ 过去经历
↓
故事池
↓
低频抽取 Story Thread
↓
重要结果形成 Life Chapter / LifeTag
```

大多数故事独立结束，少量重要故事通过 LifeTag / Story Anchor 在以后产生回响。

---

## 当前 Web Demo 数据流

当前实现：

```text
Content / Definitions
    ↓
StoryCompiler / ResidentGenerator / LifeEventCompiler
    ↓
Web/public/generated/
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
    ↓
Web Resident Simulation
```

这些 generated JSON 是 **Demo Bundle**，不是正式游戏 Save / ECS Contract。

---

## 下一阶段：Resident Content Pipeline

现在不优先继续大量补故事，而先搭生产线。

长期目标：

```text
Authoring Data
↓
Resident Content Compiler
├─ Web Demo Bundle
└─ Unity ResidentContentBlob
↓
Resident Runtime State / Save
```

### 当前开始的是阶段 1：数据契约

先逐步明确：

1. Stable ID 规则。
2. LifeTag Registry。
3. Name V2：完整 Given Name token、权重、代际 / 风格、家庭姓氏继承。
4. Occupation V2：职业组、工作地点类别、Story Group。
5. LifeEvent：Tag 条件与 Effects 契约。
6. Portrait Catalog / AppearanceDNA。
7. Save 中哪些字段长期保存、哪些通过 Definition 查询。

详细设计：

```text
Documentation/居民内容生产与运行时数据管线V1.md
```

---

## 正式 Runtime 关键边界

### 不直接复制 Web ResidentRecord

Web DTO 可以有：

```text
displayName
portraitSeed
recentLifeLog
字符串 occupationId
```

Unity Runtime 目标更接近：

```text
ResidentIdentity
ResidentSimulationState
ResidentAppearance
StoryThread Buffer
LifeChapter Buffer
```

### Definition 不复制进 Resident

不为每个居民保存：

```text
完整姓名字符串
职业名称
故事标题 / 正文
Routine 文本
头像图片
```

这些由 `ResidentContentBlob` / TextTable / Asset Table 查询。

### Appearance

`PortraitSeed` 只负责 Demo 和第一次外观生成。

正式居民需要保存稳定 AppearanceDNA，否则以后扩充发型 / 服饰资源池会导致旧居民“变脸”。

### Routine

正式 Runtime 方向优先使用：

```text
ResidentSeed + CurrentDay + Occupation + WorldSnapshot
↓
确定性生成近期 Routine
```

普通 Routine 默认不进入 Save。

---

## 当前 Build / Artifact 工作流

`Build` 现在应分开看两个阶段：

```text
npm run build-content
↓
上传 resident-generated-data Artifact
↓
npm run build -w Web
```

`resident-generated-data` 用于直接检查当前 Demo Compiler 输出。

Visual Review 继续检查 Web Prototype UI；Vercel Preview 继续做网页交互验证。

后续真正实现 Coverage、StableId Registry、Unity Intermediate 后，再扩展 Build，不提前假装这些步骤已经完成。

---

## Git / Vercel

推荐：

```text
tmp-* branch
↓
Build + generated Artifact
↓
必要时 Visual Review / Vercel Preview
↓
确认
↓
重新读取最新 main SHA
↓
一次推进 main
```

数据契约分支可用：

```text
tmp-content-*
```

玩法 / UI 分支可用：

```text
tmp-prototype-*
```

`tmp-*` 允许 Vercel Preview。

遇到 Vercel rate limit 时不连续推空 commit。

---

## 分阶段路线

```text
阶段 1  数据契约
StableId / LifeTag / Name / Occupation / LifeEvent Effect / Portrait

阶段 2  Content Compiler
统一校验、引用解析、StableId、Story Bucket、Coverage、Web Bundle

阶段 3  Web Demo 迁移
只消费 Compiler 输出，继续验证玩法

阶段 4  Unity Runtime Contract
ResidentContentBlob、ECS Hot/Cold、Save StableId、Structural Request

阶段 5  批量生产
按 Coverage Matrix 扩充故事、姓名、头像与职业资源
```

下一轮继续开发时，优先从 **阶段 1 的 Stable ID + LifeTag + Name V2 契约** 开始，而不是直接批量写内容。
