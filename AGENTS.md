# AGENTS — 居民内容实验室

## 先理解项目

修改前读取最新 main、README、Documentation/居民内容实验室职责边界.md、Documentation/居民逻辑网页Demo接续说明.md 与 Documentation/开发与部署工作流.md。居民内容任务再读 Documentation/居民生活记录与故事连续性.md、Documentation/居民面板与生活事件V3.md、Documentation/人生经历与生活界面玩法规则V2.md、Documentation/故事写作规范.md、Documentation/故事格式规范.md、Documentation/居民内容契约V1.md 与 Documentation/居民内容生产与运行时数据管线V1.md；头像任务再读 Avatar Workshop、Portrait System 与 Q版头像主路线生产与审查工作流。只有讨论 Unity 主工程语义时才读取居民模拟 / Runtime 设计文档，不把它们当作 Web 实施任务。再检查目标源码和最新 Actions。不要用聊天记忆代替当前仓库。

本仓库生产并验证居民故事、内容管线、UI 预览和头像资产，不是 Unity Runtime 实现仓库。不要扩张 ECS、Blob、正式 Save、RuntimeIndex、序列化或游戏算法。

## 当前执行点：Resident Content Production

本仓库当前定位是 Resident Content Lab / 居民内容实验室，不是第二套居民 Runtime。共同职责边界以 Documentation/居民内容实验室职责边界.md 为准。

当前主线：

~~~text
内容 Authoring / 头像素材
→ Schema / Stable ID / Reference
→ Compiler / Coverage
→ Web 预览与人工审查
→ Compiled Content
→ Unity 消费
~~~

固定分工：

- Web / Tools 负责内容生产、内容校验、Coverage、头像编辑、固定 Fixture 预览与浏览器 UI 审查。
- Unity 主工程负责 Need、Schedule、Utility、Behaviour Tree、目标搜索、预约、导航、经济、关系、LifeEvent Trigger、RecentAction 记录算法、ECS 和 Save。
- Web 可以记录 CurrentAction / RecentAction / LifeEvent / LifeChapter 的语义，但不实现正式游戏决策。
- ResidentGenerator、确定性 Action Trace 与 Tools/ResidentActionLife/record-policy.mjs 只作为现有预览 / 回归 Fixture 保留；除修复预览和契约问题外，不继续扩展算法。
- Action Presentation 只负责显示；新增项跟随真实 Unity Behaviour，不为了扩库先造不存在的行为。
- LifeEvent V3 迁移已经完成。当前第一优先改为 **Recent / LifeChapter 展示语义收敛**：`最近`只显示一句短记录，长文本只进入 LifeChapter / `memoryText`。在这一层修正完成前暂停新的 LifeEvent 扩库；头像只按明确需求扩充。
- 不把 Web Fixture 与 Unity Runtime 强制保持实现一致；Unity 代码才是游戏算法权威。
- 不在本仓库继续设计最终 ECS Component、Blob、Save、NativeStream / Queue 等物理实现。

Resident Profile 的 temperament / lifeFocus / presentationStyle 属于内容与展示输入。它们未来如何影响 Utility 由 Unity 决定；Web 不把这些资料演化成新的决策系统。

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

- 生活模式只保留“此刻 / 最近 / 人生经历入口”。“最近”混合 RecentAction 与 RecentLifeEvent，但每条都只能是一句短记录，不显示标题 + 长正文，也不显示 `memoryText`。
- LifeEvent V3 是一次完整发生的离散事件，不再强制三阶段；连续故事通过真实结构事实、长期 LifeTag 与少量短期机会 Tag 串联。
- LifeEvent 的近期展示目标字段是 `recentText`；当前 `text` 只是待迁移的过渡字段。`recentText` 只服务“最近”，`memoryText` 只服务 Story Chapter。
- 人生模式只有年龄升序时间轴，不按少年/青年分组。Fact Chapter 只显示年龄/标题；Story Chapter 展开第一人称 `memoryText`，末尾保留“如今”。
- `recordToHistory = true` 的 Story Chapter 必须有 `memoryText`。结构型结果也可以只形成 Fact Chapter，不为了文学感强行写长故事。普通 RecentAction 不写入永久历史。
- Tag / 结构事实只决定未来故事资格；故事真正发生后写入 LifeChapter，打开人生页面时不得根据当前 Tag 即时重算过去。
- 过去的 LifeTag 影响后来 Eligibility；无需扫描全文历史。保留未婚 → 成婚 → spouse/Household 改变 → newly-married → 后续两人生活 → 临时 Tag 消失的真实链。
- Content 是权威；Stable ID 不由标题、数组顺序生成。新增内容遵守 Schema、Reference、Coverage。
- generated 文件经 Compiler 生成，不手动修改。涉及内容契约的修改要同步 Authoring、Schema、Compiler、Web 消费者与审查。

## 代码与资源

保持职责分离，必要处中文注释，不为美术问题新增自动对齐、逐脸偏移或复杂兼容引擎。禁止 Hair / Headwear 接收 Face ID 或做 face-dependent scale / offset；六个 Frame 的上半脸都通过 `head-frame.ts` 统一各自的头顶、太阳穴与耳位，脸型差异放到下脸和五官。不同 Frame 可以拥有不同 Hair / Outfit Catalog；同一 Frame 内的同一 Hair 才要求跨 Face geometry 不变。年龄变化或导入导致素材不适用时，按当前 Pack 内 exact → compatibilityKey → Frame 可用默认/首项确定性回退；预览回退不自动写回存储。四个 UI 选项可以拥有多个实际绘制层；统一 Renderer 顺序为 BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront。Headwear 仍属于 Hair，不增加 Recipe 字段；表情必须位于 FrontHair / HeadwearFront 下方。Q版 Outfit 内部使用 base / collar / overlay / detail 作者标记，base 与 collar 必须存在。脸型对应的眼形保留身份，不把同一组通用五官当作多个完整脸。

草稿与已应用记录分离。切对象/关闭提示未保存修改；导入只改预览；严格验证版本与选项；写入失败不能假装成功。每对象独立 key，同对象外部更新要提示冲突。不要无授权删除浏览器内其他用户数据或改写旧存储键。

素材制作可由 AI 辅助编写源资产，构建自动展开部件、组合、检查与导出。运行时不调用 AI。任何诊断图板必须明确标为诊断，不冒充真实玩家 UI。

## Git 与审查

Review 已拆成两个独立工作流：

- **Resident Content Review**：居民内容、故事、RecentAction 展示、人生时间轴与 Profile 内容链；
- **Avatar Visual Review**：Portrait、Avatar Workshop、头像素材、Catalog / Renderer 与 8A / 8B / 8D 美术门禁。

纯文档不触发视觉 Review。跨域文件（例如 App.tsx、main.tsx、styles.css、ResidentAvatar.tsx、package 配置）会同时触发两边。

**居民内容快速通道**：最新 main → `tmp-*` 小批修改 → 只跑 Build；阶段完成后创建 PR → Build + Resident Content Review → 下载同 SHA Artifact 并实际查看对应 UI / Life History → 重读 main → 正常合入 → main 回归。纯文档不为了制造绿色状态额外跑视觉 Review。

**头像正式批次**：继续使用 Build + Avatar Visual Review，并下载同 SHA Artifact 实际审图。只修改 Face / Hair / Outfit / Expression SVG 画稿时，仍可先走真实 Renderer 静态短循环；静态图不能替代正式 UI / 存储 / 绑定回归。

**跨域基础设施修改**：Build + 两套 Review 全部通过后再合入。

不得一文件一 commit、空提交刷新、force 覆盖新 main 或依赖 Vercel。GitHub 工具可用时实际调用，不无依据声称无权限。任务交付要包含实际提交状态、实际运行的 Review 类型和关键截图，不只列后续计划。

源码静态头像图板是当前代码真实 SVG Renderer 的输出，可用于判断脸型、发型/帽子、腮红、衣领、年龄/性别差异和小尺寸可读性；但不能据此声称草稿切换、对象绑定、存储隔离、延迟导入、完整浏览器 UI 或居民连续性已经验证。

保持 capture-resident-review 和正式 capture-portrait-review 的有效断言。删除实验只删对应失效测试；新增工坊须测：四类真实操作、同一 Frame + Hair/Headwear 在全部 Face 下 geometry 完全一致、六 Frame Head Frame 顶线/接缝一致、全部 active Hair 通过 Hair Coverage probes、Frame Catalog 过滤与 deterministic fallback、Phase 5A child UI 不得暴露旧通用 Hair/Outfit、女童/男童儿童专属 Hair / Outfit 96/64/48px、Phase 5B adult UI 不得暴露旧现代 Hair/Outfit、成年男女 Hair / Outfit / 组合 96/64/48px、Phase 5C elder UI 只含 elder-* 素材且 compatibility-only 旧 ID 六 Frame 均不可见、老年男女 Hair / Outfit / 组合 96/64/48px、Phase 5D 六 Frame 综合图板、旧 Recipe 全 Frame deterministic fallback 与 Hair/Outfit UI 密度上限、成年职业可读性、Headwear none/integrated 与前后层契约、Q版 Outfit base/collar 结构、甲乙独立保存、取消/恢复/刷新、真实居民 UI、存储/导入错误。

CI PASS ≠ 美术 PASS。静态 Renderer 图板也 ≠ 完整 UI / 交互 PASS。头像高频美术阶段必须实际查看生成图板；正式批次还必须下载并看 Actions 的真实桌面 UI / 诊断产物。头发穿插、眼白溢出、嘴歪、衣领断开或 UI 遮挡时继续修复。最终如实区分已实现功能、艺术候选、静态图板已审范围、完整浏览器已审范围和未验证 Unity 迁移。
