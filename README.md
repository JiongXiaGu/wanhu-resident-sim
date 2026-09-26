# 万户天工 · 居民内容实验室

仓库名仍为 wanhu-resident-sim，但当前定位已经收缩为居民内容资产生产、预览、审查与导出工具。这里维护头像、Action Presentation、LifeEvent、人生经历、姓名/职业/Profile 等内容；Need、Schedule、Utility、Behaviour、关系、导航、预约、经济、ECS 与 Save 由 Unity 主工程实现。详见 Documentation/居民内容实验室职责边界.md。

## 本地体验

需要 Node.js 22，在仓库根目录：

```bash
git switch main
git pull --ff-only origin main
npm install
npm run dev
```

```text
http://localhost:5173/?view=avatar-editor
```

头像工坊默认进入自由创作，先选男/女、儿童/成年/老年，再选脸型、头发、衣服、表情。六份样板分别保存。指定对象模式可以编辑玩家示例或当前城市居民；从居民身份栏进入直接绑定该居民，年龄/性别不由工坊修改。

## 当前阶段：Resident Content Production

Resident Panel、人生时间轴、头像工坊、内容 Compiler 与 Resident Action Life 的展示语义已经足够支撑内容生产。

LifeEvent V3、Stage 移除和统一“最近”已经完成。当前先做 **Recent / LifeChapter 展示语义收敛**：

- “最近”只显示一句短记录，用于快速了解居民最近在做什么；
- RecentAction 与 RecentLifeEvent 可以混排，但 UI 不显示技术分类；
- LifeEvent 的近期 Presentation 从当前过渡字段 `text` 收敛为短 `recentText`；
- 长文本只保留在 Story Chapter 的 `memoryText`；
- 人生故事由结构事实 / LifeTag / 年龄 / 职业等决定资格，真正发生后写入 LifeChapter；
- 打开人生经历时只读取已经发生的 Chapter，不根据当前 Tag 即时重算过去；
- 这一层代码修正完成前暂停新的 LifeEvent 扩库；
- Action Presentation 继续跟随 Unity 真实 Behaviour 增长；
- 姓名、职业、LifeTag、Resident Profile 与头像素材按明确需求维护。

现有确定性 Action Trace 与 Tools/ResidentActionLife/record-policy.mjs 只为固定预览数据和回归保留，不是正式游戏算法。Unity 不需要复制它们。

头像优先级仍固定为：

~~~text
玩家保存 Avatar Recipe
> Resident Profile 派生的 chibi-cute-v1 默认 Recipe
> 冻结 Portrait fallback
~~~

## 头像基线：Phase 8D2 已完成

Phase 8D2 已完成儿童与老人扩库：儿童 6 Hair / 6 Outfit、老人 6 Hair / 6 Outfit，共 **12 Hair + 12 Outfit ID**、32 个适用 Frame / 资产组合。唯一运行时 Pack 为 `chibi-cute-v1`。

全库当前 **6 Face / 58 Hair / 52 Outfit / 8 Expression**，共 124 个可选资产，均有中文描述和关键词。主题不是职业限制，适用 Frame 内仍可自由混搭；Hair 不读取 Face，Head Frame / Coverage 契约继续保留。旧三个 Pack ID 仅作迁移 alias，十个 compatibility-only Hair/Outfit 只供旧 Recipe，不进入 UI、搜索或 Random。

8D2 现在是已完成的头像生产基线，不是当前主动扩库阶段。8C 大交互仍暂缓；没有明确新需求时，不新增 Face / Expression、独立帽子分类、多 Pack 或 Unity 迁移。详见 [头像工坊](Documentation/Avatar%20Workshop.md)、[头像主路线](Documentation/Q版头像主路线生产与审查工作流.md) 与 [8D2 童老头像资产扩充](Documentation/Phase%208D2%20童老头像资产扩充.md)。

## 保存与项目边界

自由样板、玩家、居民分别存入浏览器 localStorage，保存/应用才写入。切框架或对象前有草稿会询问；导入只改预览；恢复只移除当前目标覆盖。清除站点数据会丢失本地记录，可自行导出配方备份。描述、关键词和搜索词不进入 Recipe 或保存键。

`Web/src/avatar/` 是工坊及 Web 外观覆盖。`Web/src/resident/portrait/`、`Content/Portrait/`、正式五字段 DNA 保持冻结。未保存玩家覆盖的居民优先显示 Profile 派生默认 Q 版头像；生成链不可用时才进入冻结 Portrait fallback。移除玩家覆盖回到 Profile 派生默认。外观编辑不改身份、家庭、职业、故事和游戏日期。

生活模式只展示“此刻 / 最近”：此刻读取真实 CurrentAction；最近混合 RecentAction 与 RecentLifeEvent，但每条只是一句短文本。人生模式是一条年龄升序时间轴，一件事一个 Chapter；长故事只在 Story Chapter 展开 `memoryText`。当前代码已经是 V3，但 `最近` 仍暂时使用较长 `text`；下一代码批次先迁移到 `recentText`，完成前暂停新的 LifeEvent 内容批次。 

`npm run build` 完整构建；`npm run build-content` 生成 Web 内容，generated 文件不手改。

## Review 与交付

不依赖 Vercel。正式 CI 已拆分：

~~~text
Build
Resident Content Review
Avatar Visual Review
~~~

居民内容在 `tmp-*` 开发阶段只跑 Build；阶段完成后创建 PR，由 PR 跑 Build + Resident Content Review，合入 main 后再做同范围最终回归。头像素材 / Catalog / Renderer 修改跑 Build + Avatar Visual Review；App.tsx、main.tsx、styles.css、ResidentAvatar.tsx 等跨域修改同时跑两套。纯文档不触发视觉 Review。

Resident Content Review 的 Artifact 为 `resident-content-review`，重点检查 Resident Panel、LifeEvent、Life History、婚姻 / LifeTag 连续性和 Action Presentation 展示。Avatar Visual Review 的 Artifact 为 `avatar-visual-review`，继续保留 Portrait、Avatar Workshop、8A / 8B / 8D 与旧固定配方门禁。

纯 SVG 画稿仍可先通过真实 Renderer 静态短循环检查 320/96/64/48px；静态图不能证明 UI、保存、导入或居民绑定。

用户从 main 拉取测试，不交付压缩包；执行者仍需下载并实际查看对应同 SHA Artifact。CI PASS 不等于视觉或内容最终认可，接手以远端当前代码和文档为准。
