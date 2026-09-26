# 居民内容实验室接续说明

仓库：JiongXiaGu/wanhu-resident-sim。

当前职责是 Resident Content Lab / 居民内容实验室。

## 接手顺序

开始前读取：

1. 最新 main 与 SHA；
2. AGENTS.md；
3. README.md；
4. 居民内容实验室职责边界；
5. 居民生活记录与故事连续性；
6. 居民面板与生活事件 V3；
7. 人生经历与生活界面玩法规则 V2；
8. 故事写作规范与故事格式规范；
9. 居民内容契约 V1；
10. 居民内容生产与运行时数据管线 V1；
11. 开发与部署工作流。

头像任务再读 Avatar Workshop、Portrait System 与 Q版头像主路线。

居民模拟 / Runtime 文档只作为 Unity 语义背景，不是 Web 工作清单。

## 当前已完成

当前 main 已经完成：

- LifeEvent V3；
- 删除固定 `stages[3]`；
- 删除 Story Thread / Stage 主线；
- RecentAction 与 RecentLifeEvent 合并到一个“最近”区域；
- Snapshot 使用 `recentLifeEvents[] + lifeChapters[]`；
- 人生经历使用年龄升序时间轴；
- Story Chapter 展开 `memoryText`；
- Tag / 结构事实可以影响后续事件 Eligibility；
- 内容 Review 与头像 Review 已拆分；
- `tmp-*` 开发分支默认只跑 Build，PR / main 边界再跑完整居民内容 Review。

当前 LifeEvent 内容量为 26 条。

## 当前发现的语义问题

目前“最近”仍把 LifeEvent 渲染成：

~~~text
时间
标题
35～80 字正文
~~~

这与最终玩家目标不一致。

玩家查看“最近”主要是为了快速了解居民最近做过什么，因此目标应为：

~~~text
时间 + 一句短文本
~~~

长故事只在人生经历中出现。

## 最终三层模型

~~~text
真实 Behaviour
→ CurrentAction
→ 此刻

Behaviour Complete
→ RecentAction
        \
         → 最近：一句短记录
        /
LifeEvent
→ RecentLifeEvent
→ recentText

结构事实 / LifeTag / 年龄 / 职业 / 世界条件
→ 决定人生故事候选资格
→ LifeEvent 真正发生
→ LifeChapter
→ memoryText
→ 人生经历
~~~

### 此刻

只来自真实 CurrentAction。

### 最近

只显示短句：

~~~text
2日前  去朋友家坐了一阵。
4日前  有人来给家里说亲。
7日前  去市上买了些粮。
~~~

不显示：

- title + 长正文；
- memoryText；
- 来源标签；
- Action / LifeEvent 技术分类；
- Story / Stage。

### 人生经历

这里才是长故事：

~~~text
23岁 · 今日成了婚
→ 点击展开
→ memoryText
~~~

Fact Chapter 可以只显示年龄 + 标题。

## Tag 原则

优先级：

~~~text
真实结构状态
>
长期 LifeTag
>
短期机会 Tag
~~~

不要用 Tag 重复 spouse / child / occupation / household 等真实状态。

长期 Tag 用于当前结构已经看不出来的过去，例如：

- served-military；
- opened-shop；
- migrated；
- learned-medicine。

短期 Tag 只提供短时间后续机会，例如：

- courtship-open；
- betrothed；
- newly-married。

禁止使用 stage-1 / stage-2 / stage-3 Tag。

## 人生故事不是打开 UI 时现算

Tag 和结构事实只负责：

> 决定某个故事是否有资格真正发生。

正确流程：

~~~text
Eligibility
→ Event Trigger
→ Story 真正发生
→ 写入 LifeChapter
→ 长期保存
~~~

打开人生经历时只读取已经发生的 Chapter。

不要：

~~~text
打开人生经历
→ 扫描当前 Tag
→ 临时生成过去
~~~

否则未来新增内容会改变旧居民已经发生过的人生。

## 下一代码批次

在同一个 tmp 分支内做两个可控 Stage。

### Stage A · Contract / Data

只处理：

- LifeEvent Schema；
- 当前 26 条 LifeEvent；
- ContentContractCompiler / LifeEventCompiler；
- TS Domain；
- 必要 Coverage / Contract 断言。

目标：

~~~text
text
→ recentText
~~~

规则：

- recentText 一句话；
- 通常约 12～36 个中文字符；
- recordToHistory = true 的事件继续保留 memoryText；
- 不新增 LifeEvent；
- 不保留 text fallback；
- 不改 Trigger / Behaviour / Utility。

Stage A 只要求 Build。

### Stage B · Resident Panel / Review

只处理：

- “最近”从 LifeEvent title + 正文改为单句；
- RecentAction 与 RecentLifeEvent 保持相同信息密度；
- Life History 继续只在 Story Chapter 展开 memoryText；
- 更新 capture-resident-review；
- 增加“最近不得显示长故事”的断言。

Stage B 在 tmp 分支仍只要求 Build。

Stage A + B 完成后创建 PR，由 PR 跑：

~~~text
Build
+ Resident Content Review
~~~

通过并人工审图后再合入 main。

## 当前暂停

在 Recent / LifeChapter 分层修正完成前：

- 暂停 LifeEvent Batch 2；
- 不继续增加 35～80 字中长度 `text`；
- 不扩新的 LifeTag 故事链；
- 不改头像；
- 不扩 StoryCompiler；
- 不实现 Web LifeEvent Trigger；
- 不设计 Web Utility / Behaviour；
- 不提前规定 Unity ECS / Save 物理实现。

## 修正完成后的内容生产

之后内容生产拆成两条独立路线。

### Recent 内容批次

主要补：

- Action Presentation；
- LifeEvent recentText。

目标：

- 高频；
- 短；
- 生活化；
- 玩家几秒钟可以扫完。

### Life History 内容批次

主要补：

- recordable LifeEvent；
- memoryText；
- Fact Chapter；
- 结构事实 / LifeTag 驱动的弱关联故事。

目标：

- 低频；
- 稀疏；
- 不同居民人生明显不同；
- 多年以后仍值得玩家阅读。

不要再用一个中长度 LifeEvent 正文同时承担两个界面的职责。
