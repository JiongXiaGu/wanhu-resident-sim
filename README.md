# wanhu-resident-sim

《万户天工》居民玩法的 Web 演示、内容生产与原型验证仓库。固定简称：**居民逻辑网页demo**。

> 居民系统作为游戏玩法是否成立、是否有代入感、是否值得玩家持续点开和观察。

Web Demo 是玩法原型，不是 Unity Runtime 设计稿。Unity ECS、BlobAsset、正式存档、RuntimeIndex、序列化和资源加载方式不在本仓库继续设计。

## 最新候选：现代国风人物

```text
/?view=portrait-modern-anime-lab
```

首页或旧头像实验点击 **“现代国风 · 新画风与换装”**。这是一套重新绘制的美术：更细的眼型与轮廓、分束长发、衣料明暗、云纹和玉冠配饰，不复用旧 Anime / Composer 的美术。

- 成年男女各 3 张脸，共 6 个面容；6 套协调表情、3 种发型、4 个帽饰选项、3 套共享服装。
- 晴岚 / 霁夜 / 丹华是同一新画风的三组可编辑搭配，不是三套独立画风，也不是固定角色整图。
- 不同脸继续共享配件，同脸换装和切换表情不改变身份；幞头摘下恢复原发型。
- 96/64/48px 预览、独立保存、配方导入/导出和分享、透明 SVG / 1024px PNG 导出。
- 旧版与正式 Runtime 保留。儿童老人、自由五官编辑、游戏情绪驱动和 Unity 导入不在本轮范围内。

目标是现代二游审美与泛中国古代设计语言结合，不复制《原神》《鸣潮》游戏资源，不把原型称为已经达到其成品质量。画风仍待玩家选择。完整规则见 [Portrait Modern Anime Lab](Documentation/Portrait%20Modern%20Anime%20Lab.md)。

## 上一版：二次元表情与换装

```text
/?view=portrait-anime-lab
```

新实验独立重画成年男女各四张脸，提供平静、微笑、开心、大笑、生气、委屈、惊讶、害羞八套表情。每张脸仍能共享四种发型、四个帽饰选项和四套服装。

嘴型以固定正面中线绘制；换表情不改脸型或衣装。支持肤色/发色/衣色、原尺寸对照、配方保存/分享、透明 PNG/SVG 导出。这里的表情定制是选择八套协调预设，不是自由拼接五官。

原版 16 脸 DIY 与正式 Runtime 保留，实验配方和存储互不覆盖。规则见 [Portrait Anime Lab](Documentation/Portrait%20Anime%20Lab.md)。

## 原版：16 脸头像 DIY

```text
/?view=portrait-composer-lab
```

这是实际 Face / Hair / Headwear / Outfit 分层组合，不是切换完整角色稿：

- 成年女性 8 张脸、成年男性 8 张脸，共 16 张完整面容；每类六个发型，四种帽饰加无帽，六套衣服。
- 宽圆、修长、方颌、心形面容男女分别作画，原有四种面容和 v1 配方保持兼容。
- 每张脸共享全部发型、帽子和衣服：换脸不换装，换装不换脸，摘帽恢复同一发型 ID。
- 默认“面容”与“全部脸型”，支持脸型×服饰矩阵、96/64/48px、配色、锁身份随机。
- 自动保存、JSON 配方导入/导出、组合链接、透明 SVG/PNG、深浅背景与 24 人搭配样本。

这是独立的成年人实验，不替换正式居民头像，不更改正式五字段 DNA 和六个 Frame。规则见 [Portrait Composer Lab](Documentation/Portrait%20Composer%20Lab.md)。

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
Documentation/Portrait Anime Lab.md
Documentation/Portrait Modern Anime Lab.md
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

过去的重要故事可以留下 LifeTag；后续 Eligibility 读取轻量状态，不扫描历史全文。Story Bucket 已由 Web Selector 使用，先按 LifeStage + OccupationGroup 粗筛，再进行精确资格检查。

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

| 页面 | 用途 |
| --- | --- |
| `/?view=portrait-modern-anime-lab` | 新绘现代国风候选、三组搭配与可组合人物 |
| `/?view=portrait-anime-lab` | 上一版成年二次元脸型、表情与共享换装实验 |
| `/?view=portrait-composer-lab` | 原版成年头像 DIY、全部脸型与共享衣装验证 |
| `/?view=portraits` | 冻结的正式头像工作台 |
| `/?view=portrait-art-directions` | 绢彩、暖陶、朱墨三组完整角色稿，不是模块化资产 |
| `/?view=portrait-style-bakeoff` | 历史风格比较 |
| `/?view=portrait-style-study` | 更早的历史实验 |

实验不会悄悄接入正式 Runtime。是否增加独立帽饰或表情字段、怎样落到六个正式 Frame，需要在体验后单独决定。

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

现代国风：`http://localhost:5173/?view=portrait-modern-anime-lab`。
上一版二次元：`http://localhost:5173/?view=portrait-anime-lab`。
原版 DIY：`http://localhost:5173/?view=portrait-composer-lab`。

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

Build 先执行 build-content 并上传 generated Artifact，再构建 Web。Resident Visual Review 在 Runner 内启动 Vite，Playwright 执行真实交互与截图。原有居民连续性、正式头像、研究稿、Composer 与 Anime 的验收全部保留；新增 `scripts/capture-modern-anime.mjs`。

`resident-visual-review` Artifact：

- 根目录：原有居民与正式头像预览。
- `art-directions/`：完整角色研究原始 PNG 与 SVG/PNG。
- `composer/`：原版 DIY 原始截图、导出样本和机器检查报告；480 个发型帽饰样本、48 个原尺寸样本、96 个脸型服饰样本。
- `anime/`：上一版二次元原始截图和报告；64 个表情、128 个发型帽饰、32 个衣装样本。
- `modern-anime/`：现代国风搭配、面容与表情、72 个发型帽饰、18 个衣装样本、小尺寸和交互报告。
- 各实验的 `exports/` 或 `face-exports/` 都是当次渲染器输出的组合样本，不是 Runtime 固定整图资产。

原版 2,880、上一版 Anime 4,096、新候选 1,296 个基础配方检查只证明组合与图层不变量，不代表同等数量的肉眼独特头像。所有实验子目录保留原始 PNG，不使用旧缩图脚本。

**CI PASS 不等于美术 PASS**。美术任务必须下载并实际查看截图再合入 main，不制造空 commit 刷新结果。详细规范见 `Documentation/开发与部署工作流.md`。
