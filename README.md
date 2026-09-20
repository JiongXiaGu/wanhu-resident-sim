# 万户天工 · 居民逻辑网页demo

验证居民当前生活、人生经历、故事连续性与可编辑头像。Web 原型不承担 Unity ECS、Blob、正式存档或资源加载设计。

## 现在体验：头像工坊

```text
http://localhost:5173/?view=avatar-editor
```

也可在首页点 **头像工坊**，或在任意居民的身份栏点 **编辑头像**。

这一版是真实部件组合与对象保存：只有 **脸型、头发、衣服、表情** 四类。当前运行时只保留 `chibi-cute-v1` 一套 Q版 SVG 美术包，玩家不再选择旧画风。Q版当前玩家可选素材为 **4 脸、30 个头部造型、24 套衣服、8 个表情**；child / adult / elder 使用各自年龄段素材列表。另有 6 个旧 Hair 与 4 个旧 Outfit 只作为 compatibility-only Recipe ID，不进入 UI 或 Random。`linework-v1`、`simple-flat-v1`、`soft-paint-v1` 旧 pack ID 仍可读取，但会迁移到 Q版当前素材；旧美术实现只保留在 Git 历史。

编辑器左边选择玩家示例档案或当前城市任意居民，右边直接选择四类部件。点击 **应用** 才写入这个对象；未保存修改可撤销，切对象或关闭会提示。给甲改头像不会改变乙。关闭工坊后，实际居民信息面板显示刚应用的头像，游戏日期和故事不会重置。

两份玩家档案用于展示 21 岁女子、32 岁男子的独立保存；它们不是账号或玩家资料系统。居民列表来自当前真实快照。

支持透明 PNG/SVG、JSON 配方导入导出、96/64/48px 预览、深浅衬底。配方只含四个选项与版本，不含居民 ID；导入不会自动应用。

所有保存都在当前浏览器 localStorage，以城市和目标 ID 隔离。清除站点数据会丢失记录，需导出配方备份。正式居民 Snapshot 和五字段 DNA 未改，未定制居民使用原正式头像；恢复原头像只移除指定对象的 Web 覆盖。

详见 [头像工坊](Documentation/Avatar%20Workshop.md) 与 [Q版头像主路线生产与审查工作流](Documentation/Q版头像主路线生产与审查工作流.md)。Phase 6 已把 Q版 Head Frame / Hair Coverage 作为新基础契约：Hair 必须覆盖固定头型，Face 不驱动 Hair；同时旧画风运行时资源已清理，只保留 Recipe 迁移 alias。Q版继续作为 Unity 迁移前的 Web 美术基线，但 CI 绿色仍不能代替实际截图审查。

## Phase 7：美术精修候选

已在 Phase 6 结构上收拢腮红、加强男女与老年造型、重画交领和肩线。没有增加可选素材、玩家分类或逐脸 Hair 适配。新增真实轮廓腮红检查与统一色彩的性别 / 年龄诊断图；阶段盘点和人工审查见 [Phase 7 头像美术精修与验收](Documentation/Phase%207%20头像美术精修与验收.md)。当前是可验收的候选美术，不等于用户最终认可，也未启动 Unity 迁移。

## 清理结果

已移除被否定的旧头像实验页面、固定整图图库、专属样式和专属截图脚本，相关错误实验文档也不再留在当前树；Git 历史保留旧版本。不会再把“先选完整画稿，之后再想办法做成 DIY”当成当前交付。

当前只有：

| 入口 | 职责 |
| --- | --- |
| `/` | 居民玩法页面，包含工坊入口 |
| `/?view=avatar-editor` | 在同一 App 会话里打开统一工坊 |
| `/?view=portraits` | 冻结正式 fallback 的开发检查页 |

正式 Renderer、Content、Schemas、Tools 和居民故事逻辑保留。

## 项目结构

```text
Content/                   Authoring 名字、职业、标签、故事、头像元数据
Schemas/                   Web 原型内容契约
Tools/                     内容编译器、Catalog Audit 与 Coverage
Web/src/avatar/            统一编辑器、对象保存、SVG 素材包
Web/src/resident/portrait/  冻结的正式 fallback Renderer
Web/src/simulation/        居民生活与故事
Documentation/             当前规范
scripts/                   真实交互与视觉审查
居民故事/                   既有故事素材
```

## 保留的玩法

生活模式展示身份、世界关联、当前 Activity、正在/最近 LifeEvent 与少量 Routine。人生模式只显示已沉淀的单一年龄升序时间轴，一件事一个 Chapter；展开第一人称 memoryText，不重放三个 Stage。普通 Routine 不进入永久历史。

LifeTag 和 Prototype Effect 让过去影响后来，保留成婚后真实 spouse/Household 改变并解锁后续生活事件的自动验收。游戏状态与外观编辑互相隔离。

内容链仍为 Contract Compiler → Portrait Catalog Audit → Story / Resident / LifeEvent / StoryBucket / Snapshot / Portrait / Web Compiler。输出 definitions v6、resident-snapshot v5 等 `Web/public/generated/` 文件；这些是 Web 数据，不代表 Unity 存档，不手工修改。

## 本地运行

需要 Node.js 22。在仓库根目录：

```bash
npm install
npm run dev
```

`npm run build` 执行构建；`npm run build-content` 只生成内容。

## 新对话接手

先读最新 main、AGENTS、`Documentation/居民逻辑网页Demo接续说明.md`、玩法/生活/历史规范、`Portrait System.md`、`Avatar Workshop.md`、`Q版头像主路线生产与审查工作流.md` 和 `开发与部署工作流.md`。头像任务先看主路线文档的“当前执行点”；源码与最新 Actions 是当前事实，不沿用旧聊天里的错误方案。

## GitHub Actions

不依赖 Vercel。每批从 tmp-* 修改，先 Build 和 Resident Visual Review，下载并实际查看截图后才推进 main，main 再复查。

当前 Visual Review 保留居民故事与正式 72 组合检查，新增工坊的玩家/居民保存、草稿、恢复、导入、错误处理和年龄/部件检查。补充检查入口不遮挡现有界面、居民编辑按钮尺寸、异步导入与“应用后切对象”的保存归属。

`resident-visual-review` Artifact 的 `avatar/` 包含实际编辑窗口、已应用居民面板、96/64/48px 样本和 `avatar/packs/chibi-cute-v1/hair-coverage-*` 诊断图。Review 从运行时 Registry/Catalog 动态计算组合数，并检查 Head Frame、Hair Coverage、年龄素材过滤、兼容迁移和保存流程。`chibi-cute-v1` 当前六个 Frame 合计 11,136 个可选组合。

3,456 个基础组合只是测试覆盖量；原图保留不缩放。CI PASS 不能代替实际视觉审查。
