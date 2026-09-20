# 万户天工 · 居民逻辑网页 demo

验证居民当前生活、人生经历、故事连续性和可编辑头像。不是 Unity ECS/Blob/正式存档设计稿。

## 体验头像工坊

```text
http://localhost:5173/?view=avatar-editor
```

首页头像工坊默认进入**自由创作**：直接选择男/女、儿童/成年/老年，再选脸型、头发、衣服、表情。六份样板分别保存，可载入日常起点、随机本类、筛选本轮样板和导出 PNG/SVG/JSON。

切到**指定对象**，可以编辑原两份玩家示例档案或当前城市任意居民。从居民身份栏“编辑头像”进入会直接绑定该居民，其年龄/性别不由工坊修改。

自由样板、玩家、居民分别存入浏览器 localStorage；保存此样板/应用才写入。切框架或对象前有草稿会询问。导入只改预览，恢复只移除当前目标覆盖。清除站点数据会丢失本地记录，配方可导出备份。

## 当前美术：Phase 8A 候选

唯一运行时 Pack 为 `chibi-cute-v1`，四类玩家选项不变。当前6 Face / 30 Hair / 24 Outfit / 8 Expression；不同年龄/性别显示适用素材。六个 Face ID 在六 Frame 中各有静态下脸画稿，不等于36个可选脸型。

Phase 7 之后用户明确反馈了脸型、帽身、衣装与底部裁切问题，之前画法**不是最终认可的美术**。8A 先重画一批样板和创作入口，其他 Hair/Outfit 会在用户验收方向后分批重做，不靠堆素材数量代替质量。

仍保留 Head Frame / Hair Coverage；Hair 不读取 Face。旧 `linework-v1/simple-flat-v1/soft-paint-v1` 只有 Recipe 迁移 alias，十个旧 Hair/Outfit ID 只用于解析，不进入 UI/Random。

详见 [头像工坊](Documentation/Avatar%20Workshop.md)、[当前主路线](Documentation/Q版头像主路线生产与审查工作流.md) 与 [Phase 8 方案、作者规范与审查](Documentation/Phase%208%20头像美术体系与创作工坊.md)。

## 本地运行

需要 Node.js 22，在仓库根目录：

```bash
npm install
npm run dev
```

`npm run build` 完整构建；`npm run build-content` 生成 Web 内容。generated 文件不手改。

## 项目边界

`Web/src/avatar/` 是统一工坊及Web外观覆盖；`Web/src/resident/portrait/` 和 `Content/Portrait/` 的正式fallback保持冻结。未定制居民继续显示原图，恢复原头像移除该对象覆盖。

生活模式展示当前Activity、LifeEvent和少量Routine；人生模式是一条年龄升序时间轴，一件事一个Chapter，展开memoryText。LifeTag和原型Effect保留过去影响后来的真实链。外观编辑不改居民身份、家庭、职业、故事或游戏日期。

## GitHub Actions 与交付

不依赖Vercel。tmp-* 聚合修改后运行 Build 和 Resident Visual Review，下载Artifact人工看图后再推进main，main再复查。

`resident-visual-review` 包含真实桌面UI、完整Catalog契约、腮红与Hair Coverage、96/64/48px、六框架自由创作保存测试。Phase8A图板在 `avatar/phase8a/`，源码与SHA一起保存。移动端不再截图；CI PASS不是最终美术定稿。

接手先读AGENTS、接续说明和主路线当前执行点；不要用旧聊天或历史多Pack计划覆盖最新仓库。后续先验收8A样板，再逐批扩充，暂不做Unity迁移。
