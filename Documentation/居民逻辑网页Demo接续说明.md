# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页demo。

## 接手顺序

读取最新 main 与 SHA、AGENTS、README、本文件、玩法/生活/历史规范、Portrait System、Avatar Workshop、Q版头像主路线生产与审查工作流、开发与部署工作流。头像任务追加 Phase 8 头像美术体系与创作工坊。先读当前执行点，再检查源码与同 SHA Actions，不用聊天记忆覆盖仓库。

## 当前执行点

Phase 8B1：儿童与老年发型/衣装重画。接手基线 `28ad42619edb7a6abb21ca7ef8d2dee30d2afda2`。用户已查看8A样板并要求继续；这不等于全部历史画稿获得认可。

本批不改六脸型/上头型，重画儿童7个+老年8个Hair ID、两年龄各6个Outfit ID。仍为6 Face / 30 Hair / 24 Outfit / 8 Expression；四Frame合计23份适用发型、24份衣装。成年其他素材留给8B2。不要重复8A或一口气跳到全量扩库。

作者实现：child-hair.ts、elder-hair.ts、age-outfits.ts；hair.ts负责分发与成年未重画资源；sample-hair.ts保留8A成年样板。同ID只有一套画稿。rework-batch.ts为本批明确ID清单，不代替Catalog。

主入口默认自由创作：男/女、儿童/成年/老年六框架可直接选，分别存入 `studio:<frame>`。指定对象模式仍显示原玩家档案与城市居民；Frame 锁定，不能修改居民年龄/性别。两种模式共用编辑器、Recipe 和Renderer。旧 player/resident 保存键不变。导入不自动保存，模板载入不自动应用。

移动端不再截图。核心新证据在 `avatar/phase8b/`：四Frame×Hair/Outfit八张图板、八张实际桌面UI、发型/衣装旧新对照与四框架总览；8A六框架保存和绑定居民回归仍保留。必须真实下载并打开，不能只看 automated-pass。

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
