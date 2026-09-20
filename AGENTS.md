# AGENTS — 居民逻辑网页demo

## 先理解项目

修改前读取最新 main、README、Documentation/居民逻辑网页Demo接续说明.md、人生经历与生活界面玩法规则V1、居民面板与生活事件V2、居民生活记录与故事连续性、Portrait System、Avatar Workshop、开发与部署工作流。再检查目标源码和最新 Actions。不要用聊天记忆代替当前仓库。

本仓库验证居民玩法、故事、内容管线、UI 和头像编辑，不是 Unity Runtime 设计稿。不要扩张 ECS、Blob、正式 Save、RuntimeIndex、序列化或资源加载架构。

## 当前头像方向

只有一套玩家可用的头像工坊：脸型、头发、衣服、表情四类离散选项。不同脸必须共享配件；表情不改变身份。玩家示例档案和任意真实居民使用同一编辑流程，按城市/居民稳定 ID 独立保存。

不再制作“完整人物图画廊，然后以后再拆模块”的交付。当前 `linework-v1`、`chibi-cute-v1` 与 `simple-flat-v1` 都在 `Web/src/avatar/packs/` 下提供真实分层 SVG。Q版包必须在头身比例、五官、轮廓线和发型体积上明显区别于线绘；极简简笔包必须使用正常简化比例、细深灰线、平面色块与图标式五官，不能成为“Q版小眼睛版本”。画风切换仍保留四个语义选项，不能跨包复用整张角色图或导入其他包的实际 geometry。画风仍未正式定稿，不把生成数量、SVG 复杂度或 CI PASS 当作审美结论。

旧错误实验、整图图库、被否定的 `soft-paint-v1` 与其专属审查已从当前树删除，不建立历史保留文件夹。需要旧版时查 Git 历史。未来画风作为同一编辑器的可组合素材包验证，不再分叉独立编辑网站。

新增画风统一走 `Web/src/avatar/packs/<style>/index.ts` + `packs/registry.ts`。每个 pack 的标题、说明、顺序和运行时实现以 registry 为唯一注册入口；不要为了新增一个 pack 再去 `render.ts`、`AvatarEditor.tsx`、`model.ts` 分别复制一套登记逻辑。已发布的 pack id 属于配方持久化契约，不随目录或美术重命名；废弃 ID 的兼容 alias 集中放在 registry。

## 正式 portrait 边界

`Web/src/resident/portrait/`、`Content/Portrait/`、五字段 ResidentPortraitDNA、六个 PortraitFrame 与原有五层 RenderPlan 保持冻结。本次可编辑头像只作为 ResidentAvatar 上的 Web 覆盖，未应用居民继续使用原 Renderer；移除覆盖恢复原图。不要向正式 DNA 添加表情或画风字段。

编辑不得改变居民姓名、生日、性别、家庭、职业、故事和游戏日期。工坊在 App 当前会话内打开，不能通过另载一份快照掩盖对象绑定问题。

## 玩法与内容不变量

- 生活模式只显示当前 Activity、正在/最近 LifeEvent、少量 Routine，不做人工综合近况 Summary。
- 人生模式只有年龄升序时间轴，不按少年/青年分组。一个 Chapter 对应一件事，不把三个 Stage 拆成三段历史。
- 事实节点只显示年龄/标题。故事节点展开第一人称 memoryText，不重放 Stage 1/2/3，不显示起初/后来/最后。人生模式隐藏 Activity、Routine 与当前事件，末尾有“如今”。
- 重要故事（recordToHistory 或结构效果）必须有 memoryText。普通 Routine 不写入永久历史。
- 过去的 LifeTag 影响后来 Eligibility；无需扫描全文历史。保留未婚 → 成婚 → spouse/Household 改变 → newly-married → 后续两人生活 → 临时 Tag 消失的真实链。
- Content 是权威；Stable ID 不由标题、数组顺序生成。新增内容遵守 Schema、Reference、Coverage。
- generated 文件经 Compiler 生成，不手动修改。涉及内容契约的修改要同步 Authoring、Schema、Compiler、Web 消费者与审查。

## 代码与资源

保持职责分离，必要处中文注释，不为美术问题新增自动对齐、逐脸偏移或复杂兼容引擎。四个 UI 选项可以拥有多个实际绘制层，表情必须位于 FrontHair 下方。脸型对应的眼形保留身份，不把同一组通用五官当作多个完整脸。

草稿与已应用记录分离。切对象/关闭提示未保存修改；导入只改预览；严格验证版本与选项；写入失败不能假装成功。每对象独立 key，同对象外部更新要提示冲突。不要无授权删除浏览器内其他用户数据或改写旧存储键。

素材制作可由 AI 辅助编写源资产，构建自动展开部件、组合、检查与导出。运行时不调用 AI。任何诊断图板必须明确标为诊断，不冒充真实玩家 UI。

## Git 与审查

最新 main → tmp-* → 集中修改 → 一个聚合 commit → Build + Resident Visual Review → 下载 Artifact 并实际打开截图 → 必要时聚合修正 → 重读 main → 合入 main → main 再审查。

不得一文件一 commit、空提交刷新、force 覆盖新 main 或依赖 Vercel。GitHub 工具可用时实际调用，不无依据声称无权限。任务交付要包含实际提交状态与关键截图，不只列后续计划。

保持 capture-resident-review 和正式 capture-portrait-review 的有效断言。删除实验只删对应失效测试；新增工坊须测：四类真实操作、不同脸共享配件、甲乙独立保存、取消/恢复/刷新、真实居民 UI、存储/导入错误、年龄版本及 96/64/48px。

CI PASS ≠ 美术 PASS。必须下载并看实际渲染，头发穿插、眼白溢出、嘴歪、衣领断开或 UI 遮挡时继续修复。最终如实区分已实现功能、艺术候选和未验证 Unity 迁移。
