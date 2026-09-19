# wanhu-resident-sim

《万户天工》居民玩法的 Web 演示、内容生产与原型验证仓库。

本仓库当前只回答一件事：

> **居民系统作为游戏玩法是否成立、是否有代入感、是否值得玩家持续点开和观察。**

Web Demo 是玩法原型，不是 Unity Runtime 设计稿。Unity ECS 组件、BlobAsset、正式存档、RuntimeIndex、序列化和资源加载方式都不在本仓库继续设计；正式进入 Unity 时重新根据游戏工程约束设计。

## 项目别名

对话中提到 **“居民逻辑网页demo”**，默认就是本仓库。

新对话继续项目时优先读取：

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
Documentation/居民面板与生活事件V2.md
Documentation/居民生活记录与故事连续性.md
Documentation/StoryBucket与内容覆盖V1.md
Documentation/Portrait System.md
Documentation/Portrait Art Reboot.md
Documentation/开发与部署工作流.md
```

然后检查 GitHub `main`、Actions 与必要代码。

## 当前头像新美术入口

`/?view=portrait-art-reboot`

本轮不沿用旧正式头像或 A–F 模板，重新比较三组人物设计：**绢色人物 / 市井绘本 / 陶彩小像**。每组包含平民女性、平民男性、老人、贵族女性、高阶男性，并提供同类角色对照、48 / 64 / 96 CSS px、深浅底色与临时候选清单。

这是美术方向 Proof，不是已完成的模块化资产。栅格组包含纸底；陶彩组是 2.5D 矢量体积表现，不是已经存在的 3D 模型。正式五 ID、六 Frame 和五层 RenderPlan 均不修改。旧 `portrait-style-study` / `portrait-style-bakeoff` 保留为历史，不作为新方案的视觉模板。

边界与选型后验证路径见 `Documentation/Portrait Art Reboot.md`。新页由 Resident Visual Review 生成 80–90 号截图，必须下载并实际查看，不能用 CI PASS 代替美术判断。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # Legacy Story 素材
├─ Content/                          # 人工维护的原型内容源
│  ├─ Stories/                       # Legacy Story Markdown
│  ├─ LifeEvents/                    # Resident Panel 短生活事件
│  ├─ Names/                         # Name V2
│  ├─ Occupations/                   # 职业 + Occupation Group
│  ├─ Tags/                          # LifeTag Registry
│  ├─ Portrait/                      # 统一居民头像 Authoring 元数据
│  ├─ Routines/                      # 普通生活表现模板
│  └─ Simulation/                    # Demo 生成与模拟参数
├─ Documentation/                    # 玩法与内容规则
├─ Schemas/                          # Authoring / Demo Schema
├─ Tools/                            # Web 内容编译与验证工具
├─ Web/                              # 玩法 / UI / 内容原型
├─ scripts/                          # Visual Review 等辅助脚本
├─ AGENTS.md
└─ package.json
```

## Web Demo 的验收问题

当前所有实现都优先服务下面这些问题：

```text
1. 点一个陌生居民，我有没有兴趣继续看？
2. 他现在的生活是否可信？
3. 几段故事组合起来是否像一个人的人生？
4. 过去发生的事情是否真的会影响后来？
5. 家庭 / 职业等状态变化以后，人物是否真的发生变化？
6. 城市建设与世界变化能否反馈到具体居民？
7. 连续查看十几个居民以后，会不会明显重复？
8. “人生经历”是否值得玩家主动翻阅？
9. 连续看几十个居民时，头像能否稳定、可辨认、不过度重复？
```

只要某项实现不能帮助回答这些问题，就不应在 Web Demo 中继续扩展。

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
ResidentPortraitCompiler
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
├─ portrait-catalog.json
├─ content-coverage.json
├─ story-buckets.json
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

当前关键版本：

```text
definitions.json       wanhu.resident-definitions.v6
resident-snapshot.json wanhu.resident-snapshot.v5
```

这些文件只服务 Web 原型、内容检查和自动测试，不代表未来 Unity 存档或 Runtime 格式。

## 已经可以验证的玩法

### 居民当前生活

玩家可以看到：

```text
姓名 / 年龄 / 职业 / 家庭
此刻 Activity
正在经历 / 最近发生
少量 Routine
```

Routine 只负责生活感，不进入永久人生经历。

### LifeEvent 三阶段故事

LifeEvent 会随时间推进三个阶段，并保留前一阶段作为轻量上下文。完成后，普通事件逐渐淡出；重要事件进入人生经历。

### 人生经历

人生模式与当前生活模式分离。打开后只看已经沉淀的过去：

```text
按年龄从小到大排列的一条时间轴
事实型人生节点
可展开的一段 memoryText 回忆
如今
```

不会混入当前 Activity、当前 LifeEvent 和 Routine，也不再显示“少年 / 青年 / 壮年”等阶段分组。

### LifeTag 连续性

LifeEvent 支持：

```text
requiredTags / forbiddenTags
addTags / removeTags
```

过去故事可以留下一个轻量事实，后续故事读取它形成回响。例如：

```text
曾经服役
↓
多年后旧同伍进城
```

### Story Bucket

Web Selector 已真正使用：

```text
LifeStage + OccupationGroup
↓
粗候选池
↓
Age / Gender / Family / LifeTag 精确过滤
```

Story Bucket 的目的只是让原型能扩到更大的内容量，并继续观察重复率和覆盖缺口。

### Prototype Effect

Web Demo 现在允许完成故事后直接改变 Demo 内的居民状态。

当前用于验证的效果包括：

```text
LifeTag 增减
换职业
家庭搬迁
成婚
```

这只是 **玩法原型 reducer**，不是 Unity 的结构变更架构。

结构型故事在 Web 中完成后可以：

```text
故事完成
↓
居民状态真的变化
↓
人生经历留下章节
↓
新的 Family / Occupation / LifeTag 条件进入候选池
↓
出现后续故事
```

当前已有一条专门用于验收的连续链：

```text
这门亲事定下来了
↓
居民真的获得配偶并同住
↓
lifetag.newly-married
↓
“两个人一起过日子以后”进入候选池
↓
后续完成后临时 Tag 消失
```

这条链由 Resident Visual Review 自动验证。

### 统一头像 / 头像工作台

正式居民界面和头像工作台现在都使用同一套：

```text
ResidentPortraitDNA
↓
Web/src/resident/portrait/
↓
PortraitRenderer
```

最终居民快照保存：

```text
faceFamilyId
hairStyleId
outfitStyleId
skinPaletteId
baseHairColorId
```

当前工程层面的统一迁移与固定 Frame 落点已经完成，Runtime 保持冻结。美术方向另在 Art Reboot 选型：

```text
child / adult / elder
×
female / male
=
6 个 PortraitFrame
```

Face、Hair、Outfit 都必须按同一个 Frame 规格制作。一张脸可以配多套发型和衣服，但运行时不负责自动校准偏移。

当前技术验证资产已经落在 `female.adult`：6 套女性 FaceFamily、3 套束/挽/盘发式、4 套交领/叠领/对襟常服，并由工作台生成 72 个组合做固定 Frame 审查。这不意味着当前美术已被选为最终风格。

唯一正式头像工作台：

```text
/?view=portraits
```

正式规则见 `Documentation/Portrait System.md`。头像逻辑元数据以 `Content/Portrait/portrait-catalog.json` 为权威，Web 美术映射由 `assets/art-manifest.json` 管理，并由 Catalog Audit 自动检查一致性。

## 内容生产原则

为了方便后续批量生产，当前仍保留：

```text
Stable ID
Schema / Reference Validation
Name V2
LifeTag Registry
Occupation Group
Story Bucket
Coverage Report
Portrait Catalog
```

它们的目的不是提前设计正式存档，而是保证：

- AI / 人工可以批量生产内容而不把引用写乱。
- 同一故事不会因为改标题就失去身份。
- 可以统计年龄、职业、性别、家庭等内容缺口。
- Web Demo 可以稳定重现问题和验收结果。

## 当前玩法验证路线

后续优先级改为：

```text
1. 人生经历阅读体验与回忆文本
2. Story Effect 真正改变人物
3. 过去经历 → 后续故事连续性
4. 头像随机组合、年龄感和家庭相似度
5. 城市 / 世界变化 → 具体居民故事
6. 同一居民有限的并行生活线与互斥规则
7. 故事密度、重复率和人生节奏
8. 按 Coverage Matrix 批量扩充内容
9. 玩家实际试玩与反馈迭代
```

不再把 Unity Save、Blob、ECS Runtime Contract 作为 Web Demo 的下一阶段任务。

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

正式头像实验室：

```text
http://localhost:5173/?view=portraits
```

当前新美术方向对比：

```text
http://localhost:5173/?view=portrait-art-reboot
```

每套候选同时展示平民女、平民男、老人、贵族女性、高阶男性，与正式 PortraitRenderer 完全隔离。旧 `/?view=portrait-style-bakeoff` 和 `/?view=portrait-style-study` 仅保留为历史比较。

## GitHub Actions / Visual Review

当前远端验收**不再依赖 Vercel、Preview 或 Production 部署**。

一次逻辑开发批次先聚合修改，再只向远端 `tmp-*` 推送一个 commit。GitHub Actions 自动完成 Build 与 Resident Visual Review。Visual Review 会在 Runner 内启动本地 Vite，通过 Playwright 执行真实页面交互、DOM/状态检查并截图，最终上传 `resident-visual-review` Artifact。

对于 UI / 头像 / 美术改动，CI 显示 PASS 只代表脚本执行成功；合入 `main` 前还必须下载 Artifact，实际查看关键截图。确认视觉结果可接受后，再一次推进 `main`，并再次以 GitHub Actions 结果作为最终验收。

既有玩法链与正式头像 72 组合检查继续运行。新美术页由 `scripts/capture-portrait-art-reboot.mjs` 额外验证，Artifact 同时包含对应提交的 `reviewed-source.zip`。

当前流程不要求部署线上预览，也不等待或检查 Vercel 状态。不要为了“刷新网页”制造空 commit。

详细流程见 `Documentation/开发与部署工作流.md`。
