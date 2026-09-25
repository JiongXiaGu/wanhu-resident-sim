# AGENTS — 居民逻辑网页demo

## 先理解项目

修改前读取最新 main、README、Documentation/居民逻辑网页Demo接续说明.md、Documentation/居民行为与最近生活记录.md、Documentation/居民事实事件与人生记录运行时设计.md、Documentation/居民生活记录与故事连续性.md、人生经历与生活界面玩法规则V1、居民面板与生活事件V2、Portrait System、Avatar Workshop、`Documentation/Q版头像主路线生产与审查工作流.md`、开发与部署工作流。头像相关任务必须先确认主路线工作流的“当前执行点”。再检查目标源码和最新 Actions。不要用聊天记忆代替当前仓库。

本仓库验证居民玩法、故事、内容管线、UI 和头像编辑，不是 Unity Runtime 设计稿。不要扩张 ECS、Blob、正式 Save、RuntimeIndex、序列化或资源加载架构。

## 当前执行点：Resident Action Life 重构

Routine Library V2 的 R0～R3 已完成过一轮研究验证，但**不再是当前架构方向**。当前 main 仍保留 Routine V2 代码、247 个 Routine / 460 个 Variant、Family Eligibility / Context 等实现，只用于作为待删除的旧主线。不要继续 R4A Environment Eligibility，不要继续扩 Routine、Family / Weather / Calendar Eligibility，也不要为旧数据设计兼容层；需要追溯旧方案时直接查 Git 历史。

当前唯一主线是 **Resident Action Life 重构**：

```text
Need / Schedule / Opportunity
→ Utility
→ Behaviour
→ 找目标 / 地点 / 预定 / 移动 / 执行
→ Behaviour Complete
→ ResidentActionCompletedEvent
→ RecentActionRecordSystem
→ 最近的事情 UI
```

固定原则：

- “最近的事情”只记录居民真实完成的行为，不再由独立内容系统生成生活。
- Action 能不能执行由 Schedule / Utility / Behaviour 决定；Presentation 不拥有 Occupation / LifeStage / Wealth / Family / Weather Eligibility。
- TargetResidentId / PlaceId 等 Context 由 Behaviour 在执行时已经确定，记录系统不得反向扫描家庭或社会关系来“找一个目标”。
- 财富、职业、年龄、性格通常影响时间、成本、收益、机会和 Utility 权重，不作为娱乐、社交、旅行的硬白名单；只有现实硬约束才阻止行为。
- Current Activity 必须来自真实 CurrentAction；不要再根据职业、时间或 LifeEvent 文本在 UI 层猜一个活动。
- RecentAction 使用固定小环，只保存值得展示的完成行为；吃饭、普通走路等是否展示由轻量 RecordPolicy / 是否存在 Presentation 决定。
- LifeEvent / LifeTag / LifeChapter 保留，和 RecentAction 分层；重大结构事实仍进入人生历史，普通行为记录自然淘汰。
- 不保留 Routine V2 数据兼容、旧 Stable ID remap、旧 Recipe 式迁移层；删除时一次清理 Authoring / Schema / Compiler / Generator / Web / Review / 文档，历史从 Git 获取。
- 当前 Web Demo 只需验证 Action → RecentAction → UI 语义，不要在 Web 再造一套复杂居民 AI；正式 Behaviour / Utility 在 Unity 主工程实现。

Resident Profile 当前只有 temperament / lifeFocus / presentationStyle。它们可以在未来作为 Utility 弱倾向输入，但不能直接把性格写成硬职业、硬脸型、硬娱乐限制或强制剧情。

Unity 方向固定：行为树 / Schedule / Utility Job 不拼字符串、不直接维护 UI 日志，只在有意义的行为完成点写紧凑 Action Completed Event。正式 Unity 继续保持 ISystem + SystemAPI、Job/Burst、多线程优先和集中结构变更；Web Demo 不提前设计最终 ECS Save / Blob 物理布局。

## 当前头像方向

只有一套玩家可用的头像工坊与一套运行时美术包：`chibi-cute-v1`。玩家只编辑脸型、头发、衣服、表情四类离散选项。child / adult / elder 可拥有独立 Hair / Outfit。每个 female/male × child/adult/elder Frame 只有一个固定 Head Frame；Face 只改下半脸与五官，Hair / Headwear 不读取 Face ID。Hair 还必须通过固定 Coverage probes 覆盖 Head Frame 外轮廓；不得通过逐 Face offset、scale、mask 或 clipPath 自动适配。

不再制作“完整人物图画廊，然后以后再拆模块”的交付。当前 `chibi-cute-v1` 是主美术路线；Phase 3 / Batch A 已加入首批成年古代头部造型与服饰；Phase 5A / 5B / 5C 已分别完成 child / adult / elder 的独立 Hair / Outfit 批次，Phase 5D 已完成三年龄综合 QA。旧基础 modern ID 仅作为 compatibility-only Recipe 兼容，不再出现在 Q版任一 Frame 的普通 UI。`linework-v1`、`simple-flat-v1` 与 `soft-paint-v1` 的运行时美术资源已经退役；旧 pack ID 只作为导入/本地旧 Recipe 的迁移 alias，确定性映射到 `chibi-cute-v1`。Q版必须在头身比例、五官、轮廓线和发型体积上保持独立视觉语言，并逐步转向泛中国古代模拟经营居民。当前仍只有 Face / Hair / Outfit / Expression 四个玩家可见类别：帽子第一阶段归入 Hair / 头部造型内部，腮红和情绪符号归入 Expression。主路线与阶段顺序以 `Documentation/Q版头像主路线生产与审查工作流.md` 为准；CI PASS 不等于美术定稿。

旧错误实验、整图图库、被否定的 `soft-paint-v1` 与其专属审查已从当前树删除，不建立历史保留文件夹。需要旧版时查 Git 历史。未来画风作为同一编辑器的可组合素材包验证，不再分叉独立编辑网站。

新增画风统一走 `Web/src/avatar/packs/<style>/index.ts` + `packs/registry.ts`。每个 pack 的标题、说明、顺序和运行时实现以 registry 为唯一注册入口；不要为了新增一个 pack 再去 `render.ts`、`AvatarEditor.tsx`、`model.ts` 分别复制一套登记逻辑。已发布的 pack id 属于配方持久化契约，不随目录或美术重命名；废弃 ID 的兼容 alias 集中放在 registry。

`chibi-cute-v1` 拥有自己的 `catalog.ts` 与 defaults；UI、parseRecipe、随机和 Review 都只从当前 Catalog 读取。Catalog option 可用 `frames` 限制年龄/性别。旧 modern Hair/Outfit 集中放在 `packs/compatibility.ts`，只用于旧 Recipe；旧 pack alias 也集中在那里。未来如果重新增加第二套真实画风，再恢复多 Pack UI 与跨 Pack 审查，不提前保留无效资源。

新增画风的视觉审查统一走 `scripts/avatar-review/audit-packs.mjs`，只在 `pack-specs.mjs` 增加该画风真正独有的审查参数。不要再创建 `audit-avatar-<style>.mjs` 复制整套组合遍历。capture-avatar-review 必须读取 Registry 的实际 Pack 列表并自动验证每个 Pack 切换后四个语义 ID 不变；Registry 新增但缺 Review Spec 时 CI 应直接失败。

## 正式 portrait 边界

`Web/src/resident/portrait/`、`Content/Portrait/`、五字段 ResidentPortraitDNA、六个 PortraitFrame 与原有五层 RenderPlan 保持冻结。`ResidentAvatar` 只负责在玩家保存覆盖、Profile 派生 Q 版默认与冻结 Portrait fallback 之间选择来源；前两者都不改写正式 DNA 或 Portrait Catalog。移除玩家覆盖回到 Profile 派生默认，只有生成链不可用时才进入正式 Renderer fallback。不要向正式 DNA 添加表情或画风字段。

编辑不得改变居民姓名、生日、性别、家庭、职业、故事和游戏日期。工坊在 App 当前会话内打开，不能通过另载一份快照掩盖对象绑定问题。

## 玩法与内容不变量

- 生活模式只显示真实 CurrentAction、正在/最近 LifeEvent、少量 RecentAction，不做人工综合近况 Summary。
- 人生模式只有年龄升序时间轴，不按少年/青年分组。一个 Chapter 对应一件事，不把三个 Stage 拆成三段历史。
- 事实节点只显示年龄/标题。故事节点展开第一人称 memoryText，不重放 Stage 1/2/3，不显示起初/后来/最后。人生模式隐藏 CurrentAction、RecentAction 与当前事件，末尾有“如今”。
- 重要故事（recordToHistory 或结构效果）必须有 memoryText。普通 RecentAction 不写入永久历史。
- 过去的 LifeTag 影响后来 Eligibility；无需扫描全文历史。保留未婚 → 成婚 → spouse/Household 改变 → newly-married → 后续两人生活 → 临时 Tag 消失的真实链。
- Content 是权威；Stable ID 不由标题、数组顺序生成。新增内容遵守 Schema、Reference、Coverage。
- generated 文件经 Compiler 生成，不手动修改。涉及内容契约的修改要同步 Authoring、Schema、Compiler、Web 消费者与审查。

## 代码与资源

保持职责分离，必要处中文注释，不为美术问题新增自动对齐、逐脸偏移或复杂兼容引擎。禁止 Hair / Headwear 接收 Face ID 或做 face-dependent scale / offset；六个 Frame 的上半脸都通过 `head-frame.ts` 统一各自的头顶、太阳穴与耳位，脸型差异放到下脸和五官。不同 Frame 可以拥有不同 Hair / Outfit Catalog；同一 Frame 内的同一 Hair 才要求跨 Face geometry 不变。年龄变化或导入导致素材不适用时，按当前 Pack 内 exact → compatibilityKey → Frame 可用默认/首项确定性回退；预览回退不自动写回存储。四个 UI 选项可以拥有多个实际绘制层；统一 Renderer 顺序为 BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront。Headwear 仍属于 Hair，不增加 Recipe 字段；表情必须位于 FrontHair / HeadwearFront 下方。Q版 Outfit 内部使用 base / collar / overlay / detail 作者标记，base 与 collar 必须存在。脸型对应的眼形保留身份，不把同一组通用五官当作多个完整脸。

草稿与已应用记录分离。切对象/关闭提示未保存修改；导入只改预览；严格验证版本与选项；写入失败不能假装成功。每对象独立 key，同对象外部更新要提示冲突。不要无授权删除浏览器内其他用户数据或改写旧存储键。

素材制作可由 AI 辅助编写源资产，构建自动展开部件、组合、检查与导出。运行时不调用 AI。任何诊断图板必须明确标为诊断，不冒充真实玩家 UI。

## Git 与审查

分两级执行，不再把 GitHub Actions 当作每一轮头像画稿调整的截图服务器。

**头像静态美术短循环**：最新 main / 当前任务 SHA → 集中修改 Face / Hair / Outfit / Expression SVG 源码 → 直接调用真实 Pack / `renderAvatar()` 生成静态图板 → 实际查看六 Frame、相关 Face/Hair/Outfit 组合及 96/64/48px → 继续聚合修正。只要没有修改编辑器交互、存储、导入、Catalog/Registry 契约、正式 portrait fallback 或居民玩法，这个中间循环可以不等待 Actions。

**正式批次 / 结构改动**：候选美术稳定，或任务涉及 Avatar Workshop 交互、LocalStorage、导入导出、Catalog / Registry / compatibility fallback、Hair Coverage / Head Frame 契约、正式 ResidentPortrait、居民生活/故事内容管线时，按原流程使用 tmp-* 聚合提交 → Build + Resident Visual Review → 下载 Artifact 并实际打开真实桌面 UI / 诊断图 → 必要时修正 → 重读 main → 合入 main → main 再审查。阶段收尾也必须走这一层。

源码静态头像图板是当前代码真实 SVG Renderer 的输出，可用于判断脸型、发型/帽子、腮红、衣领、年龄/性别差异和小尺寸可读性；但不能据此声称草稿切换、对象绑定、存储隔离、延迟导入、完整浏览器 UI 或居民连续性已经验证。

不得一文件一 commit、空提交刷新、force 覆盖新 main 或依赖 Vercel。GitHub 工具可用时实际调用，不无依据声称无权限。任务交付要包含实际提交状态、使用的 Review 类型和关键截图，不只列后续计划。

保持 capture-resident-review 和正式 capture-portrait-review 的有效断言。删除实验只删对应失效测试；新增工坊须测：四类真实操作、同一 Frame + Hair/Headwear 在全部 Face 下 geometry 完全一致、六 Frame Head Frame 顶线/接缝一致、全部 active Hair 通过 Hair Coverage probes、Frame Catalog 过滤与 deterministic fallback、Phase 5A child UI 不得暴露旧通用 Hair/Outfit、女童/男童儿童专属 Hair / Outfit 96/64/48px、Phase 5B adult UI 不得暴露旧现代 Hair/Outfit、成年男女 Hair / Outfit / 组合 96/64/48px、Phase 5C elder UI 只含 elder-* 素材且 compatibility-only 旧 ID 六 Frame 均不可见、老年男女 Hair / Outfit / 组合 96/64/48px、Phase 5D 六 Frame 综合图板、旧 Recipe 全 Frame deterministic fallback 与 Hair/Outfit UI 密度上限、成年职业可读性、Headwear none/integrated 与前后层契约、Q版 Outfit base/collar 结构、甲乙独立保存、取消/恢复/刷新、真实居民 UI、存储/导入错误。

CI PASS ≠ 美术 PASS。静态 Renderer 图板也 ≠ 完整 UI / 交互 PASS。头像高频美术阶段必须实际查看生成图板；正式批次还必须下载并看 Actions 的真实桌面 UI / 诊断产物。头发穿插、眼白溢出、嘴歪、衣领断开或 UI 遮挡时继续修复。最终如实区分已实现功能、艺术候选、静态图板已审范围、完整浏览器已审范围和未验证 Unity 迁移。
