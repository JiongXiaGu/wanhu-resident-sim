# 居民内容实验室接续说明

仓库：JiongXiaGu/wanhu-resident-sim。

仓库名保留历史命名，但当前职责是 Resident Content Lab / 居民内容实验室。

## 接手顺序

开始前读取：

1. 最新 main 与 SHA；
2. AGENTS.md；
3. README.md；
4. 居民内容实验室职责边界；
5. 本文件；
6. 开发与部署工作流。

内容任务再读居民内容契约 V1、居民内容生产与运行时数据管线 V1、居民生活记录与故事连续性、故事写作规范与故事格式规范。

头像任务再读 Avatar Workshop、Portrait System 与 Q版头像主路线。

居民模拟V1架构.md、居民事实事件与人生记录运行时设计.md 只作为 Unity 语义和历史设计背景使用，不是 Web 工作清单。

## 当前执行点

当前执行点是 Resident Content Production。

不要继续推进：

~~~text
Web Utility
Web Schedule
Web Behaviour Tree
Web 社会关系搜索
Web 旅行 / 经济 / 设施算法
Web 正式 RecentAction RecordSystem
Web 正式 LifeEvent Trigger
Unity ECS / Blob / Save 物理设计
~~~

当前主链：

~~~text
Content / Avatar Authoring
→ Schema / Stable ID / Reference
→ Compiler
→ Coverage / Lint
→ Web Preview
→ 人工审内容 / 审视觉
→ Compiled Content
~~~

Unity 主工程再消费这些内容并负责实际模拟。

## 现有模拟 Fixture

当前代码里仍然存在：

- ResidentGenerator；
- 固定 City Snapshot；
- 确定性 Action Trace；
- Tools/ResidentActionLife/record-policy.mjs；
- LifeEvent 推进与结构效果的 Web 测试链。

这些只用于让居民面板和人生时间轴拥有稳定可重复的数据。

规则：

- 可以修复 Fixture 让预览恢复正确；
- 可以增加断言保证内容引用与 UI 不坏；
- 不继续给 Fixture 增加正式游戏算法；
- 不要求 Unity 与 Web Fixture 保持实现一致；
- 若未来 Fixture 维护成本过高，可进一步简化。

## 内容资产边界

### Action Presentation

只负责展示已经存在的 Behaviour：

~~~text
Stable ID
CurrentAction 短句
少量 Variant
必要的轻量展示参数
~~~

新增 Action Presentation 跟随 Unity 已实现或明确排期的 Behaviour，不先写大量虚构行为。

### LifeEvent / LifeChapter

这是当前最适合持续扩充的内容域。

Web 负责验证：

- 三阶段文本；
- 时间跨度；
- 第一人称叙述；
- memoryText；
- Eligibility / Effect 引用；
- Coverage；
- Resident Panel / 人生时间轴中的实际阅读效果。

触发概率、选择算法、结构变化执行与运行时状态由 Unity 负责。

### 头像

chibi-cute-v1 仍是当前唯一玩家可用 Pack。

头像工坊继续负责 Face / Hair / Outfit / Expression 的素材生产、组合、编辑、Catalog、Frame 适配与视觉 Review。现有 Phase 8D2 基线保留；没有明确需求时不为了数量继续扩库。

## 当前内容盘点

以当前 main 为基线：

~~~text
Action Presentation     11
LifeEvent               14
Occupation              15
Occupation Group        10
Surname                 40
Given Name              60
LifeTag                  12
~~~

头像已有成熟的 8D2 资产基线。

因此目前最明显的内容短板不是头像，而是 LifeEvent / 人生经历数量与题材覆盖。

## 下一阶段顺序

Review 拆分已经完成：

~~~text
居民内容 → Build + Resident Content Review
头像内容 → Build + Avatar Visual Review
跨域修改 → Build + 两套 Review
纯文档 → 不触发视觉 Review
~~~

### 1. LifeEvent 内容生产

Review 变轻后，进入 LifeEvent 小批量生产。

优先补当前明显不足的题材：

- 邻里与普通生活；
- 婚嫁之后的家庭生活；
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

每批保持小规模，先看真实 Resident Panel / Life History 阅读效果，再继续扩。

### 2. Coverage 驱动补缺

不要以“总条数”为唯一目标。

继续利用 LifeStage、Occupation Group、家庭状态、Gender、LifeTag 等已有 Coverage 找空洞，再决定下一批故事。

### 3. 其它内容按缺口扩充

姓名、职业、LifeTag、Profile 和头像都按实际内容需要扩。

Action Presentation 保持薄，并等待 Unity Behaviour 列表。

## Review 原则

文档纯修改不需要为了制造绿色状态人工要求完整视觉回归。

内容数据修改至少需要：

~~~text
Build
+ 内容引用 / Schema / Coverage
+ Resident Panel / LifeEvent / Life History 专项 Review
~~~

头像修改继续按头像工作流审图。

Resident Content Review 的 Artifact 只需要审查居民内容相关截图；Avatar Visual Review 才承担完整头像资产回归。

## 当前不做

- 不继续设计 Web Resident Simulation；
- 不新增第二套 Utility / Behaviour 实现；
- 不为了 Web 演示让所有居民平均拥有娱乐；
- 不把 LifeEvent 当成 Behaviour 替代品；
- 不提前确定 Unity ECS / Blob / Save 物理布局；
- 不为未来可能存在的 Behaviour 预写大量 Action Presentation；
- 不因为内容生产而重做已经稳定的头像系统。

下一阶段正式进入 LifeEvent / 人生经历的小批量内容生产。
