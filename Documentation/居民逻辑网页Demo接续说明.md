# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页 demo。

## 接手顺序

读取最新 main 与 SHA、AGENTS、README、本文件、玩法/生活/历史规范、Portrait System、Avatar Workshop、Q版头像主路线生产与审查工作流、开发与部署工作流。头像任务追加当前阶段规范；现为 [Phase 8D1 主题资产与文字检索](Phase%208D1%20主题资产与文字检索.md)。先读当前执行点，再检查源码与同 SHA Actions，不用聊天记忆覆盖仓库。

## 当前执行点

用户认为 8B2 基础画法基本可行，批准 **8D1-A + 8D1-B 合批扩库**，并要求每件美术资产有描述便于检索。接手基线 `7ba57695c392f14d598e818beadecff877dd52f9`。

四主题常服/劳作/商铺/行旅各新增 4 Hair / 4 Outfit ID，总计 32 新 ID、44 份适用成年画稿。当前全库 6 Face / 46 Hair / 40 Outfit / 8 Expression，100 个可选资产均有中文描述及关键词。儿童老年画稿和原有 88 份固定配方渲染不变。

`theme-catalog.ts` 是本批名称、描述、关键词、Frame 和兼容键的唯一入口；原文字在 `catalog.ts`。`theme-hair.ts` / `theme-outfits.ts` 只负责静态成年画稿，原分发文件先处理儿童/老年。`asset-search.ts` 只筛选调用方传入的当前分类候选。不要再复制搜索索引或把描述写进 Recipe。

工坊保留三栏和四类选项，只增轻量搜索/所选说明。搜 `8D1` 或 `8D1 行旅` 查本批；新卡片“本批新增”与旧“已重画”区分。“仅已重画”有意不包含新稿；空结果有重置入口。随机本类遵守搜索，随机搭配不受搜索影响。

自由创作仍是六个独立样板，保存到 `studio:<frame>`，指定对象 Frame 锁定。旧 player/resident 键不改。导入不自动保存，模板载入不自动应用，主题不锁职业。用户自行拉 main 测试，不需要交付压缩包。

## 保持的边界

正式 `Web/src/resident/portrait/`、Content/Portrait、五字段 DNA 和原五层 RenderPlan 冻结。工坊只是按对象保存的 Web 覆盖。只有一个运行时 Pack；旧 Pack alias 和十个 compatibility-only ID 继续隔离，不进入 UI/搜索/Random。

每 Frame 一个固定 Head Frame，Face 只改下脸，Hair 不读取 Face。八层工坊 Renderer 与 Outfit 四个作者层不变。禁止逐脸 offset、solver、mask/clipPath 自动适配。新帽身必须连续，肩领叠层不能靠补丁遮罩修正。

居民生活只展示 Activity、LifeEvent 与少量 Routine；人生是一条年龄升序时间轴，一个 Chapter 对应一件事，展开 memoryText。重要故事或结构效果必须有 memoryText，普通 Routine 不进永久历史。保留未婚 → 成婚/家庭改变 → newly-married → 后续共同生活 → 临时 Tag 消失的真实链。

Content → Contract/Catalog Audit → Compiler → generated。生成物不手改，不借头像扩库设计 Unity ECS/Blob/正式 Save。

## 回归和下一步

本批新增 `capture-avatar-theme-assets.mjs`，沿用 renderBoards；四主题、组合、六脸型诊断和九张真实 UI 在 `avatar/phase8d1/`。描述导出和机器报告也在那里。8B2 历史断言改为其明确清单，新资产独立增量验证；通用全组合/腮红/Coverage/保存/导入/居民回归不删。

正式交付必须：最新 main → tmp-* 聚合修改 → Build + Resident Visual Review → 下载核 SHA 并实际看图 → 必要时修正 → 重读 main → 推进已审查提交 → main 再回归。用户不收压缩包，不代表执行者跳过 Artifact 下载。交付写 main SHA、两项结果、实际看图范围，区分实现/候选/未完成。

8C 大交互优化暂缓；后续可讨论 8D2 儿童/老年扩库。更多 Face/Expression、独立帽子分类、职业自动配装、Unity 迁移未实施，不自动启动。
