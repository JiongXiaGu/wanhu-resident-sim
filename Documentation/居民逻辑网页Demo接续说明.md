# 居民逻辑网页 Demo 接续说明

固定简称：居民逻辑网页demo。仓库：`JiongXiaGu/wanhu-resident-sim`。

## 接手顺序

先读取最新 main、README、AGENTS，再读本文件、人生经历与生活界面玩法规则V1、居民面板与生活事件V2、居民生活记录与故事连续性、Portrait System、Avatar Workshop、开发与部署工作流。随后检查实际源码、最新 Build 和 Resident Visual Review，不用聊天记忆替代仓库证据。

## 当前定位

验证居民玩法、故事连续性、人生经历、UI 阅读与可编辑头像。Content、Schemas、Compiler、Coverage 服务 Web 原型内容生产，不是 Unity ECS、BlobAsset、正式存档或资源加载设计。正式 Unity 迁移时另行设计。

## 当前头像任务

唯一玩家编辑流程是头像工坊 `/?view=avatar-editor`，也可从居民身份栏进入。只有脸型、头发、衣服、表情四类；不同脸共享配件，并保存到玩家示例档案或当前城市的指定居民。

`Web/src/avatar/` 包含统一编辑器、按对象保存的 Web 覆盖记录和三套真实分层 SVG 素材包：`linework-v1`、`chibi-cute-v1`、`simple-flat-v1`。第三套是现代极简简笔方向，使用正常简化比例、细轮廓和平面色块；三套共享 face / hair / outfit / expression 语义 ID，但不共享整套美术 geometry。编辑只影响外观；必须保留居民姓名、年龄、家庭、职业与故事。工坊是当前 App 内的模态窗口，不通过跳转重建模拟。

旧风格墙、完整位图图库以及多个分叉编辑实验已从工作树删除，Git 历史足以保留。不得重新创建历史实验目录或把固定整图当作可编辑素材。

`Web/src/resident/portrait/` 及 `Content/Portrait/` 的正式五字段 DNA、六个 Frame 保持冻结。未定制居民继续使用原 Renderer；只有已应用对象展示新覆盖图。`/?view=portraits` 保留为该契约的开发验收页，不是面向玩家的第二套编辑系统。

## 居民玩法不变量

生活模式只回答当前事实：身份、世界关联、Activity、正在经历/最近 LifeEvent、少量 Routine。没有综合近况 Summary。

人生模式只看已沉淀的过去：单一年龄升序时间轴，不按少年青年等分组；一个 Chapter 对应一件事。事实节点只显示年龄和标题；故事展开一段第一人称 memoryText，不重放三个 Stage。隐藏 Activity、当前故事和 Routine，末尾保留“如今”。

LifeEvent 三个 stages 服务过程；memoryText 服务往事。重要故事或结构型 effect 必须有 memoryText。普通 Routine 不进入永久人生历史。

LifeTag 影响后续 Eligibility，不扫描历史全文。Prototype Effect 可以在 Web 中直接改变职业、家庭、婚姻等状态，但不代表 Unity Runtime 架构。

必须保留连续性验收：未婚居民 → 这门亲事定下来了 → spouse/Household 真正改变 → newly-married → 两个人一起过日子以后进入候选池 → 临时 Tag 消失。

## 数据链与后续方向

Content Authoring → Contract / Catalog Audit → Story / Resident / LifeEvent / StoryBucket / Snapshot / Portrait / Web Compiler → Web/public/generated。definitions v6、resident-snapshot v5 仍是 Web 原型契约，generated 不手工修改。

后续围绕人物可读性、外观编辑、故事密度、过去影响后来、城市反馈、有限并行生活线与 Coverage 推进。不重启本仓库的 Unity 存档/Blob/ECS 设计。

## 执行与验收

最新 main → tmp-* → 集中修改并一次聚合提交 → Build + Resident Visual Review → 下载 Artifact 并打开关键截图 → 必要时聚合修复 → 重读 main → 合入 main → main 再次检查。

不依赖 Vercel / Preview / Production。CI 成功不证明美术成功。头像任务必须实际操作换部件、保存到甲、检查乙不变，并查看小尺寸、各年龄、不同脸和配件组合。不再用“画风页存在”“SVG 数量很多”冒充 DIY 已完成。
