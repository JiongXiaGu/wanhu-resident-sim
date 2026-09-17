# wanhu-resident-sim

《万户天工》居民生成、背景人生模拟、生活事件与叙事内容的设计/验证仓库。

当前阶段验证一个低成本的居民生命模拟模型：居民拥有稳定身份、年龄、职业、家庭/家谱、稀疏后台更新与可回看的 LifeLog；Story 只是居民生命轨迹中的一种重要事件。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                         # 现有故事，暂作为 Legacy 内容源
├─ Content/
│  ├─ Stories/                       # 新故事的规范目录
│  ├─ Names/                         # 姓名池
│  ├─ Occupations/                   # 职业定义
│  ├─ Routines/                      # 普通生活记录模板
│  └─ Simulation/                    # 居民生成与模拟规则
├─ Documentation/                    # 稳定设计规则与格式规范
├─ Schemas/                          # 标准数据契约
├─ Tools/
│  ├─ StoryCompiler/                 # Markdown -> stories.json
│  └─ ResidentGenerator/             # Definitions + Seed -> resident snapshot
├─ Web/                              # 居民模拟 / UI / 故事审查验证
├─ scripts/                          # 截图与视觉审查工具
├─ AGENTS.md
├─ package.json
└─ vercel.json
```

`居民故事/` 暂时保留，避免一次性大规模迁移。编译器同时读取 `居民故事/` 与 `Content/Stories/`。后续逐步把已确认的故事迁移到 `Content/Stories/`，不影响网页使用。

## 当前生成数据

`npm run build-content` 会依次执行 StoryCompiler 与 ResidentGenerator，并生成：

```text
Web/public/generated/
├─ stories.json
├─ definitions.json
└─ resident-snapshot.json
```

其中：

- `stories.json`：标准化故事内容。
- `definitions.json`：姓名、职业、Routine、人生阶段等只读定义。
- `resident-snapshot.json`：当前验证城市的确定性居民与家庭快照。

当前 Resident Generator V1 默认由固定 `CitySeed` 生成 50 个居民，用来验证姓名、年龄、职业、家庭、简单家谱、头像种子、近期 LifeLog 与 Story 展示。

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

完整数据流：

```text
Story Markdown ──→ StoryCompiler ───────┐
                                        │
Content Definitions + CitySeed          │
        ↓                               │
ResidentGenerator                       │
        ↓                               ↓
definitions.json + resident-snapshot.json + stories.json
                        ↓
              Web 居民模拟验证
                        ↓
                未来 Unity Export
```

Web 与 Unity 共享稳定 ID、字段含义与生成规则，但不要求共享同一种运行时内存布局。Unity Runtime 最终可以把字符串 ID、JSON 与数组编译成 Blob、BitMask、Native 数据与 ECS Component。

## Vercel

仓库根目录已经提供 `vercel.json`。Vercel 从仓库根目录构建即可：

```text
Build Command: npm run build
Output Directory: Web/dist
```

开发时不把 Vercel 当作逐文件编译器。一个逻辑功能批次应尽量整理成一个进入 `main` 的 commit，先由 GitHub Actions 完整构建和 Visual Review，再让 Vercel 部署最新 `main`。如果 Vercel 因部署频率限制跳过后续 commit，不需要逐个补部署；限制解除后只需要部署当时最新的 `main`。

详细流程见 `Documentation/开发与部署工作流.md`。

## 核心原则

- 居民常规后台模拟以“自己状态 + 全局只读快照”为输入，适合并行执行。
- 家庭与家谱允许保存引用，但不形成高频关系网络传播。
- 低频结婚、出生、死亡等结构变化通过集中命令系统处理。
- `BirthDay`、职业、家庭与重要人生历史长期保存；普通 LifeLog 使用有限容量。
- 当前活动尽量在玩家查看时推导，不对所有后台居民做逐小时完整日程模拟。
- 姓名允许重复；同一 Seed 的居民必须稳定生成同一身份与头像种子。
- Markdown 是故事创作与审查的源文件。
- Web 和未来 Unity 不各自维护一套故事规则；都消费同一标准化定义。
- Unity Runtime 最终使用编译后的紧凑数据，不在 ECS Runtime 中解析 Markdown / JSON。
- 一个逻辑功能批次尽量只产生一个进入 `main` 的 commit，避免无意义的重复 CI 与 Vercel Production Build。

详细规则见 `Documentation/`，其中：

- `居民模拟V1架构.md`：低成本并行居民模拟的核心边界
- `网页居民模拟与数据组织.md`：Web、生成快照、目录与数据契约
- `居民生活记录与故事连续性.md`：LifeLog 与 Story 连续展示
- `开发与部署工作流.md`：GitHub Actions、批量提交、Visual Review 与 Vercel 部署规则
- `故事格式规范.md` / `故事写作规范.md`：Story 内容规范
