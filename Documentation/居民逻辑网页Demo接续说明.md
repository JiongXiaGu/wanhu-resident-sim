# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页demo。

## 接手顺序

读取最新 main 与 SHA、AGENTS、README、本文件、玩法/生活/历史规范、Portrait System、Avatar Workshop、Q版头像主路线生产与审查工作流、开发与部署工作流。头像任务追加 Phase 8 头像美术体系与创作工坊。先读当前执行点，再检查源码与同 SHA Actions，不用聊天记忆覆盖仓库。

## 当前执行点

Phase 8B2：接手基线 `59028b3afd4b24c1cc57edbe68ce13b2bd5314f9`。先读 `Phase 8B2 成年衣装与衣领审查.md`，不要重复 8B1 或把候选视为美术定稿。

本批重画剩余成年 12 Hair / 9 Outfit ID，分别 15 份适用画稿；同时修儿童小褂、老者罩衣、掌柜长衫三款六份画稿。无新增 ID。88 份固定配方中计划变化 36 份，其余 52 份不变；保留 8A 成年 11 份样板。

`adult-hair.ts` / `adult-outfits.ts` 负责成年；`sample-hair.ts` / `sample-outfits.ts` 保留 8A 成年样板；child-hair / elder-hair / age-outfits 负责童老；hair/outfits 仅分发。rework-batch 明确列出累计候选，Catalog 仍为权威。同 ID 没有第二套运行时画稿。

主入口默认自由创作：男/女、儿童/成年/老年六框架可直接选，分别存入 `studio:<frame>`。指定对象模式仍显示原玩家档案与城市居民；Frame 锁定，不能修改居民年龄/性别。两种模式共用编辑器、Recipe 和Renderer。旧 player/resident 保存键不变。导入不自动保存，模板载入不自动应用。

移动端不截图。8B2 证据在 `avatar/phase8b2/`，包含四张成年素材图板、衣领专项、单部件旧新对照、成年组合、四张成年工坊、三款修正工坊和绑定居民截图。仍保留 8A 六框架保存/导入和 8B1 童老回归；8B1 成年不变检查仅保留 8A 样板，其余由 8B2 相对接手基线的全量比较接替，不能删除旧断言后不补兜底。

下一阶段 8C 仅登记：年龄/性别靠近预览、六样板入口、当前对象与自由/绑定模式区分。已有功能不等于 UI 已直观，本批未重排页面。主题扩库和 Unity 迁移均未做。

## 继续保持

正式 `Web/src/resident/portrait/`、Content/Portrait、五字段 ResidentPortraitDNA 和原五层正式 RenderPlan 冻结。未定制居民仍用原 Renderer；工坊只是按对象保存的 Web 覆盖。

单一运行时 `chibi-cute-v1`，旧 pack 只保留 alias。十个 compatibility-only Hair/Outfit 仍可解析但不进入 UI/Random。每个 Frame 一个固定 Head Frame，Face 只改下脸，Hair 不读 Face。八层工坊 Renderer 和 Outfit 四个作者层不变。禁止逐脸 offset、solver 和 mask/clipPath 自动适配。

## 居民玩法不变量

生活只展示当前 Activity、正在/最近 LifeEvent 和少量 Routine，不建立人工近况摘要。人生只有一条年龄升序时间轴，一个 Chapter 对应一件事，展开第一人称 memoryText，不重放三个 Stage。

重要故事或结构型 Effect 必须有 memoryText；普通 Routine 不进永久历史。保留未婚 → 成婚/家庭真正改变 → newly-married → 后续共同生活 → 临时 Tag 消失的连续性验收。外观编辑不得重建 App 或改日期、故事、职业、家庭、生日。

Content → Contract/Catalog Audit → Story/Resident/LifeEvent/StoryBucket/Snapshot/Portrait/Web Compiler → generated。生成物不手改。仓库验证 Web 玩法/内容/UI，不设计 Unity ECS/Blob/正式Save。

## 交付流程

最新main → tmp-* → 聚合修改 → Build + Resident Visual Review → 下载看图 → 必要时修正 → 重读main → 推进审查过的提交 → main重跑并再看图。

不依赖Vercel；不force覆盖并行工作；不一文件一提交。最终写main SHA、两个检查、是否下载人工查看；贴关键桌面截图；区分实现、候选、未完成。
