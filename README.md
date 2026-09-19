# wanhu-resident-sim

《万户天工》居民玩法的 Web 演示、内容生产与原型验证仓库。固定简称：**居民逻辑网页demo**。

> 居民系统作为游戏玩法是否成立、是否有代入感、是否值得玩家持续点开和观察。

Web Demo 是玩法原型，不是 Unity Runtime 设计稿。Unity ECS、BlobAsset、正式存档、RuntimeIndex、序列化和资源加载方式不在本仓库继续设计。

## 现在体验：头像 DIY

```text
/?view=portrait-composer-lab
```

居民首页右下角点击 **“头像 DIY · 同脸换装”** 即可进入。正式头像工作台和画风研究页也提供同一入口。

这次是实际 Face / Hair / Headwear / Outfit 分层组合，不是切换完整角色稿：

- **成年女性 8 张脸、成年男性 8 张脸，共 16 张完整面容**；每类六个发型，四种帽饰加无帽，六套衣服。
- 新增宽圆、修长、方颌、心形面容，男女分别作画；原有四种面容和 v1 配方保持兼容。
- 每张脸都共享全部发型、帽子和衣服：换脸不换装，换装不换脸；摘帽恢复同一发型 ID。
- 默认打开“面容”和“全部脸型”。可以在同一发型/衣装下比较八张脸，再直接选中一张。
- 新增脸型×服饰矩阵，以及每张脸的 96/64/48px 原尺寸对照。
- 肤色、发色、衣服配色；锁定面容与肤色后随机搭配。
- 自动保存，支持 JSON 配方导入/导出、组合链接与透明 SVG/PNG 导出。
- 白天/暮色、同脸对照、发型×帽饰矩阵和覆盖全部面容的 24 人搭配样本。

它是独立的**成年人组合实验**，不替换正式居民头像，不更改正式五字段 DNA 和六个 Frame。儿童、老人、Unity 导入和全部组合美术仍需后续验证。规则见 [Portrait Composer Lab](Documentation/Portrait%20Composer%20Lab.md)。

## 新对话先读

```text
README.md
AGENTS.md
Documentation/居民逻辑网页Demo接续说明.md
Documentation/人生经历与生活界面玩法规则V1.md
Documentation/居民面板与生活事件V2.md
Documentation/居民生活记录与故事连续性.md
Documentation/StoryBucket与内容覆盖V1.md
Documentation/Portrait System.md
Documentation/Portrait Art Directions.md
Documentation/Portrait Composer Lab.md
Documentation/开发与部署工作流.md
```

然后检查最新 main、GitHub Actions 和相关源码，不只依赖聊天记忆。

## 当前结构

```text
Content/                 人工维护的故事、名字、职业、标签、头像与模拟内容
Schemas/                 Authoring / Demo Schema
Tools/                   编译、验证与覆盖统计
Web/                     居民玩法 / UI / 美术实验
Documentation/           稳定玩法、内容规则和工作流
scripts/                 Playwright Visual Review 等辅助脚本
居民故事/                 Legacy Story 素材
```

## 当前能验证的玩法

### 居民当前生活

姓名、年龄、职业、家庭、当前 Activity、正在经历/最近发生的 LifeEvent 与少量 Routine。Routine 只负责生活感，不进入永久人生经历。

### LifeEvent 与人生经历

LifeEvent 默认三个 Stage，随时间推进；完成后普通事件逐渐淡出，重要事件形成 Life Chapter。

人生模式只看已经沉淀的过去：一条按年龄升序的时间轴，不按少年/青年/壮年分组。一个 Chapter 只对应一件事。故事展开显示一段第一人称 `memoryText`，不重放起初/后来/最后和三个阶段正文。人生模式隐藏 Activity、当前故事和 Routine，末尾保留“如今”。

### LifeTag / Story Bucket / Prototype Effect

过去的重要故事可留下 LifeTag；后续 Eligibility 读取轻量状态，不扫描历史全文。Story Bucket 已由 Web Selector 使用，先按 LifeStage + OccupationGroup 粗筛，再进行精确资格检查。

原型已支持 LifeTag 增减、`changeOccupation`、`moveHousehold`、`formMarriage` 直接改变 Demo 状态。它们只用于验证玩法，不代表 Unity 结构变更架构。

自动验收保留以下连续链：

```text
未婚居民
→ “这门亲事定下来了”
→ 真实 spouse / Household 变化
→ lifetag.newly-married
→ “两个人一起过日子以后”进入候选池
→ 临时 Tag 消失
```

## 正式头像与美术实验的边界

正式居民和 `/?view=portraits` 使用唯一 `Web/src/resident/portrait/PortraitRenderer`。正式 Snapshot 保留：

```text
faceFamilyId
hairStyleId
outfitStyleId
skinPaletteId
baseHairColorId
```

Gender × child/adult/elder 产生六个固定 PortraitFrame。Face、Hair、Outfit 按 Frame 直接制作，运行时不自动校准。正式 `female.adult` 的六张脸×三发型×四服装，共 72 个组合仍在 Visual Review 中验收。

`Content/Portrait/portrait-catalog.json` 是逻辑元数据权威，`assets/art-manifest.json` 仅负责 Web 美术映射，由 PortraitCatalogAudit 检查一致性。正式规则见 `Documentation/Portrait System.md`。

各页面职责：

| 页面 | 用途 |
| --- | --- |
| `/?view=portrait-composer-lab` | 当前可交互的成年头像 DIY、全部脸型与共享衣装验证 |
| `/?view=portraits` | 冻结的正式头像工作台 |
| `/?view=portrait-art-directions` | 绢彩、暖陶、朱墨三组完整角色稿，不是模块化资产 |
| `/?view=portrait-style-bakeoff` | 历史风格比较 |
| `/?view=portrait-style-study` | 更早的历史实验 |

实验不会悄悄接入正式 Runtime。是否增加独立帽饰字段、怎样落到六个正式 Frame，需要在 DIY 体验后单独决定。

## 内容编译链

```text
ContentContractCompiler
→ PortraitCatalogAudit
→ StoryCompiler
→ ResidentGenerator
→ LifeEventCompiler
→ StoryBucketCompiler
→ ResidentSnapshotCompiler
→ ResidentPortraitCompiler
→ WebContentCompiler
```

输出在 `Web/public/generated/`，包括 Stable ID Registry、Name V2、LifeTag、Occupation Group、Portrait Catalog、Content Coverage、Story Buckets、Stories、Definitions 和 Resident Snapshot。

```text
definitions.json        wanhu.resident-definitions.v6
resident-snapshot.json  wanhu.resident-snapshot.v5
```

它们只服务 Web 原型与编译检查，不代表未来 Unity 存档。Authoring 是权威，generated 文件不手工编辑；Stable ID 不由标题或数组位置决定。新增内容先检查 Schema、Reference 与 Coverage，不为数量堆故事。

## 当前玩法验证路线

人生经历/memoryText、Prototype Effect、过去影响后来、可组合头像、城市反馈、有限并行生活线、故事密度与 Coverage、玩家反馈。Unity Save / Blob / ECS Runtime Contract 不再是本仓库下一阶段。

## 本地运行

在仓库根目录：

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:5173/?view=portrait-composer-lab
```

构建：`npm run build`。只编译内容：`npm run build-content`。

## GitHub Actions / Visual Review

不依赖 Vercel、Preview、Production 或公网部署。

```text
最新 main → tmp-* → 集中修改 → 一个聚合 commit
→ GitHub Build + Resident Visual Review
→ 下载 Artifact 并实际看截图
→ 修正聚合提交（如需要）
→ 重读 main SHA → 一个完整批次进入 main
→ main 再次 Build + Visual Review + 截图审查
```

Build 先执行 build-content 并上传 generated Artifact，再构建 Web。Resident Visual Review 在 Runner 内启动 Vite，Playwright 执行真实交互与截图。原有居民连续性、正式头像和研究稿验收保留；`scripts/capture-composer.mjs` 检查 DIY 配方、双向图层独立性、帽饰恢复、下载/导入、保存/分享和小尺寸，并调用 `capture-composer-faces.mjs` 覆盖新增面容。

`resident-visual-review` Artifact：

- 根目录：原有居民与正式头像预览。
- `art-directions/`：完整角色研究的原始 PNG 与 SVG/PNG。
- `composer/`：DIY 原始截图、导出样本和机器检查报告。16 张发型帽饰矩阵覆盖 480 个渲染样本；全部脸型总览覆盖 48 个原尺寸样本；脸型×服饰矩阵覆盖 96 个样本。
- `composer/face-exports/`：当前分层渲染器输出的 16 份组合 SVG/PNG/JSON，便于离线比较，不作为 Runtime 固定整图资产。

2,880 个基础配方检查只证明组合和图层不变量；不是 2,880 张肉眼独特的人像，更不表示全部美术已人工通过。24 人墙是分层覆盖演示，真实随机另用 512 个种子验收。

两个实验子目录保留原始 PNG，不使用旧缩图脚本。**CI PASS 不等于美术 PASS**；美术任务必须下载并实际查看截图再合入 main，不制造空 commit 刷新结果。详细规范见 `Documentation/开发与部署工作流.md`。
