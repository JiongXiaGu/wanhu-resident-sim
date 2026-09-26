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
9. 开发与部署工作流。

头像任务再读 Avatar Workshop、Portrait System 与 Q版头像主路线。

居民模拟 / Runtime 文档只作为 Unity 语义背景，不是 Web 工作清单。

## 当前执行点

当前执行点是 **LifeEvent V3 Migration**。

新的目标模型：

~~~text
CurrentAction
→ 此刻

RecentAction + recent LifeEvent
→ 最近

重要 LifeEvent / 结构事实
→ LifeChapter
→ 人生经历
~~~

LifeEvent 本身是一次完整、离散的事件。

不再把所有内容写成：

~~~text
Stage 1
→ Stage 2
→ Stage 3
~~~

连续故事通过：

~~~text
真实结构事实
>
长期 LifeTag
>
短期机会 Tag
~~~

产生后续资格。

## UI 目标

居民当前生活页只保留：

~~~text
此刻
最近
人生经历入口
~~~

取消独立：

~~~text
正在经历
最近发生
~~~

“最近”在展示层混合 RecentAction 与近期 LifeEvent，并按时间排序。数据层不必把两类记录合并成同一种存储。

## Tag 原则

不要用 Tag 重复真实结构状态。

例如：

~~~text
spouse / Household 已经表示已婚
childCount / relation 已经表示有孩子
occupation 已经表示当前职业
~~~

这些不再额外写 married / has-child / carpenter Tag。

LifeTag 用于：

- 当前结构已经看不出来的长期过去，例如 served-military；
- 短期后续机会，例如 newly-married。

禁止使用 stage-1 / stage-2 / stage-3 Tag。

## 当前实现与目标的差距

当前 main 仍是 LifeEvent V2：

- Schema：wanhu.life-events.v2；
- 固定 stages[3]；
- 14 条现有 LifeEvent；
- Web Fixture 维护 Stage 推进；
- Resident Panel 有独立 LifeEvent 区域；
- capture-resident-review 仍验证 Stage 连续性。

从现在开始不新增 V2 LifeEvent。

## 下一代码批次

在同一 tmp 分支内分两个可控子批：

### A. LifeEvent V3 数据契约

只处理：

- life-event.schema；
- Content/LifeEvents 现有 14 条迁移；
- ContentContractCompiler / LifeEventCompiler；
- Snapshot / TS Domain 中 Stage / StoryThread 相关字段；
- 必要 Fixture。

迁移规则：

- 旧三个 Stage 只是同一件事 → 合并成一个离散 LifeEvent；
- 旧节点各自有独立意义 → 拆成多个 LifeEvent，用事实 / Tag 串联；
- 不保留 V2 双轨兼容。

### B. Resident Panel V3

只处理：

- 删除“正在经历 / 最近发生”独立区域；
- RecentAction + recent LifeEvent 合并到一个“最近”展示列表；
- 删除 Stage 推进 DEV / Fixture；
- 更新人生经历读取；
- 更新 capture-resident-review。

A+B 全部完成后再进入 main，不让 main 停在半迁移状态。

## Review

此次 V3 代码迁移属于居民内容域：

~~~text
Build
+ Resident Content Review
~~~

只在修改 Avatar / Portrait 跨域文件时才需要 Avatar Visual Review。

正式内容生产仍保持小批：

~~~text
8～12 条 LifeEvent
→ Build
→ Resident Content Review
→ 实际看 Resident Panel / 最近 / Life History
→ 再决定下一批
~~~

## V3 完成后的内容优先级

优先扩：

- 邻里与普通生活；
- 婚嫁后的家庭生活；
- 债务与生计；
- 学业 / 学徒；
- 女性营生与家庭角色；
- 生育、育儿与儿童成长；
- 疾病 / 求医；
- 娱乐、节庆、庙会；
- 合作与正向发展；
- 少量民俗 / 悬疑；
- 晚年生活；
- 城市设施改善对个人生活的反馈。

Action Presentation 继续等待真实 Unity Behaviour，不为扩库虚构行为。

## 当前不做

- 不新增三阶段 LifeEvent；
- 不新增 Story Thread Runtime；
- 不把 Tag 变成隐藏 Stage 状态机；
- 不继续设计 Web Utility / Behaviour；
- 不提前规定 Unity ECS / Save 物理布局；
- 不在 V3 迁移完成前开始大规模内容生产。
