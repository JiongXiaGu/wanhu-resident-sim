# wanhu-resident-sim

《万户天工》居民生成、背景人生模拟、生活事件与叙事内容的设计/验证仓库。

当前阶段不再只验证故事文本，而是逐步验证一个低成本的居民生命模拟模型：居民拥有稳定身份、年龄、职业、家庭/家谱、稀疏后台更新与可回看的 LifeLog；Story 只是居民生命轨迹中的一种重要事件。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                 # 现有故事，暂作为 Legacy 内容源
├─ Content/
│  └─ Stories/               # 新故事的规范目录
├─ Documentation/            # 稳定设计规则与格式规范
├─ Schemas/                  # 编译后数据契约
├─ Tools/
│  └─ StoryCompiler/         # Markdown -> stories.json
├─ Web/                      # 居民模拟 / UI / 故事审查验证
├─ scripts/                  # 截图与视觉审查工具
├─ AGENTS.md
├─ package.json
└─ vercel.json
```

后续会逐步增加：

```text
Content/Names/
Content/Occupations/
Content/Routines/
Content/Simulation/
Tools/ResidentGenerator/
Schemas/resident-snapshot.schema.json
```

`居民故事/` 暂时保留，避免一次性大规模迁移。编译器同时读取 `居民故事/` 与 `Content/Stories/`。后续逐步把已确认的故事迁移到 `Content/Stories/`，不影响网页使用。

## 本地运行

```bash
npm install
npm run dev
```

`npm run dev` 会先编译全部故事，再启动 Web。

构建：

```bash
npm run build
```

当前数据流程：

```text
Markdown 故事
    ↓
StoryCompiler
    ↓
Web/public/generated/stories.json
    ↓
Resident Simulation / Story Review Web
```

后续居民生成流程目标：

```text
Content Definitions + CitySeed
        ↓
ResidentGenerator
        ↓
resident-snapshot.json
        ↓
Web 居民模拟验证
        ↓
未来 Unity Export
```

## Vercel

仓库根目录已经提供 `vercel.json`。Vercel 从仓库根目录构建即可：

```text
Build Command: npm run build
Output Directory: Web/dist
```

## 核心原则

- 居民常规后台模拟以“自己状态 + 全局只读快照”为输入，适合并行执行。
- 家庭与家谱允许保存引用，但不形成高频关系网络传播。
- 低频结婚、出生、死亡等结构变化通过集中命令系统处理。
- `BirthDay`、职业、家庭与重要人生历史长期保存；普通 LifeLog 使用有限容量。
- 当前活动尽量在玩家查看时推导，不对所有后台居民做逐小时完整日程模拟。
- Markdown 是故事创作与审查的源文件。
- Web 和未来 Unity 不各自维护一套故事规则；都消费同一标准化定义。
- Unity Runtime 最终使用编译后的紧凑数据，不在 ECS Runtime 中解析 Markdown / JSON。

详细规则见 `Documentation/`，其中：

- `居民模拟V1架构.md`：低成本并行居民模拟的核心边界
- `网页居民模拟与数据组织.md`：Web、生成快照、目录与数据契约建议
- `居民生活记录与故事连续性.md`：LifeLog 与 Story 连续展示
- `故事格式规范.md` / `故事写作规范.md`：Story 内容规范
