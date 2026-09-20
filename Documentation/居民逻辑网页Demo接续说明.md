# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页demo。

## 接手顺序

读取最新 main 与 SHA、AGENTS、README、本文件、玩法/生活/历史规范、Portrait System、Avatar Workshop、Q版头像主路线生产与审查工作流、开发与部署工作流。头像任务追加 Phase 8 头像美术体系与创作工坊。先读当前执行点，再检查源码与同 SHA Actions，不用聊天记忆覆盖仓库。

## 当前执行点

Phase 8A：美术体系样板重建 + 自由创作桌面入口。基线为 `d6dc414df4d3e64948d77c2360553d0273ab292c`。用户指出 Phase 7 的脸、帽子、衣装依然不自然，之前从未认可它们为最终画法；不要把技术通过误读为审美定稿。

本轮重画六脸型族（保留原四 ID、新增 broad/tapered）、六个 Hair ID 和五个 Outfit 样板；衣领模板也修正连续性。仅一套 Q版 Pack，仍四分类。其余发型/衣装待 8B 分批重画，不声称已全量完成。先由用户验收8A样板，不自动继续批量生产或 Unity 迁移。

主入口默认自由创作：男/女、儿童/成年/老年六框架可直接选，分别存入 `studio:<frame>`。指定对象模式仍显示原玩家档案与城市居民；Frame 锁定，不能修改居民年龄/性别。两种模式共用编辑器、Recipe 和Renderer。旧 player/resident 保存键不变。导入不自动保存，模板载入不自动应用。

移动端不再截图。核心证据在 `avatar/phase8a/`：六脸型图板、帽发、服饰、三年龄综合图，以及自由创作与绑定居民桌面 UI。必须真实下载并打开，不能只看 automated-pass。

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
