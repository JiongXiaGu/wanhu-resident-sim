# 居民逻辑网页 Demo 接续说明

仓库：`JiongXiaGu/wanhu-resident-sim`；固定简称：居民逻辑网页 demo。

## 接手顺序

读取最新 main 与 SHA、AGENTS、README、本文件、玩法/生活/历史规范、Portrait System、Avatar Workshop、Q版头像主路线生产与审查工作流、开发与部署工作流。头像任务追加当前阶段规范；现为 [Phase 8D2 童老头像资产扩充](Phase%208D2%20童老头像资产扩充.md)。先读当前执行点，再检查源码与同 SHA Actions，不用聊天记忆覆盖仓库。

## 当前执行点

用户已认可 8D1 并批准进入 **Phase 8D2 童老扩库**，本批承接 `70ca1ccd9cc5fa75491267ce29d20043df942994`。儿童和老人分别新增 6 Hair / 6 Outfit，共 24 新 ID、32 个适用 Frame / 资产组合。全库当前 6 Face / 58 Hair / 52 Outfit / 8 Expression，124 个可选选项有中文描述和关键词；成年及所有旧画稿不变，132 份旧固定配方逐字节冻结。

先读 [Phase 8D2 童老头像资产扩充](Phase%208D2%20童老头像资产扩充.md)。age-theme-catalog.ts 保管本批完整 metadata，child/elder-theme-hair 与 child/elder-theme-outfits 分别保管独立年龄画稿。原 catalog/hair/outfits 只增加登记与显式分发；不灰染成年头发，不缩放成年衣装，不加 solver。

工坊布局、搜索纯函数和保存逻辑不改。搜索 8D2 查看童老新增，8D1 查看成年主题；本批卡片标“本批新增”，上批标“8D1”。“仅已重画”仍是原样板清单，检索为空可重置。主题不锁职业。六份 studio 样板独立保存，绑定居民 Frame 锁定，正式 fallback 不动。用户自行拉 main，不交付压缩包。

## 保持的边界

正式 `Web/src/resident/portrait/`、Content/Portrait、五字段 DNA 和原五层 RenderPlan 冻结。工坊只是按对象保存的 Web 覆盖。只有一个运行时 Pack；旧 Pack alias 和十个 compatibility-only ID 继续隔离，不进入 UI/搜索/Random。

每 Frame 一个固定 Head Frame，Face 只改下脸，Hair 不读取 Face。八层工坊 Renderer 与 Outfit 四个作者层不变。禁止逐脸 offset、solver、mask/clipPath 自动适配。新帽身必须连续，肩领叠层不能靠补丁遮罩修正。

居民生活只展示 Activity、LifeEvent 与少量 Routine；人生是一条年龄升序时间轴，一个 Chapter 对应一件事，展开 memoryText。重要故事或结构效果必须有 memoryText，普通 Routine 不进永久历史。保留未婚 → 成婚/家庭改变 → newly-married → 后续共同生活 → 临时 Tag 消失的真实链。

Content → Contract/Catalog Audit → Compiler → generated。生成物不手改，不借头像扩库设计 Unity ECS/Blob/正式 Save。

## 回归和后续

本批 capture-avatar-age-themes 复用 renderBoards 与旧 baseline exporter，保留全部旧回归。8B1 点选只覆盖历史重画清单，8D1 增量验证只覆盖其明确清单，通用 Review 仍覆盖全部实时 Catalog。8D2 检查 32 次实际点选、24 份完整 metadata、四 Frame 保存刷新/JSON 往返/居民绑定、旧 132 份画稿不变，原童老 12 项上限不提高。

本批源码职责、两处短循环修正和图板路径详见 8D2 文档。正式产物 avatar/phase8d2/ 有 11 张静态图板、28 张真实桌面截图、96 张原尺寸小图，必须核 source commit 并实际查看；不能只看 Actions 绿色。正式流程仍为 tmp-* 聚合 → 两项 CI → Artifact 看图 → 重读 main → 非 force 推进 → main 再 CI / Artifact 复核。

8C 大交互仍暂缓，新增 Face/Expression、独立帽子、职业自动配装、Unity 迁移未实施。新画稿仍由用户进入网页验收。
