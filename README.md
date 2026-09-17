# wanhu-resident-sim

《万户天工》居民生成、背景人生模拟、生活事件与叙事内容的设计/验证仓库。

当前阶段先解决一件事：把居民故事 Markdown 作为可长期维护的内容源，通过统一编译器生成标准数据，并在 Web 故事审查器中模拟游戏里的逐节点显示效果。

## 当前结构

```text
wanhu-resident-sim/
├─ 居民故事/                 # 现有故事，暂作为 Legacy 内容源
├─ Content/Stories/          # 新故事的规范目录
├─ Documentation/            # 稳定设计规则与格式规范
├─ Schemas/                  # 编译后数据契约
├─ Tools/StoryCompiler/      # Markdown -> stories.json
├─ Web/                      # 故事审查器
├─ AGENTS.md
├─ package.json
└─ vercel.json
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

流程：

```text
Markdown 故事
    ↓
StoryCompiler
    ↓
Web/public/generated/stories.json
    ↓
React 故事审查器
```

## Vercel

仓库根目录已经提供 `vercel.json`。Vercel 从仓库根目录构建即可：

```text
Build Command: npm run build
Output Directory: Web/dist
```

## 核心原则

- Markdown 是故事创作与审查的源文件。
- Web 和未来 Unity 不各自解析一套故事规则；都消费同一标准化模型。
- Story ID / Branch ID 用于程序引用，显示标题允许修改。
- Git 负责版本历史，文件名不使用“最终版 / 修正版 / 重新审查版”等长期版本后缀。
- Unity Runtime 最终使用编译后的数据，不在 ECS Runtime 中解析 Markdown。

详细规则见 `Documentation/`。
