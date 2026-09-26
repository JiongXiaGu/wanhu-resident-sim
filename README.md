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

当前工作重点不再是继续完善 Web 居民算法，而是：

- 扩充 LifeEvent / 人生经历内容；
- 用 Coverage 找内容缺口；
- 维护姓名、职业、LifeTag、Resident Profile 等内容资产；
- Action Presentation 跟随 Unity 真实 Behaviour 增长；
- 需要时继续制作头像素材；
- 把内容 Review 与头像 Review 拆开，缩短高频内容迭代链路。

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

生活模式展示真实 CurrentAction、LifeEvent 与少量 RecentAction；人生模式仍是一条年龄升序时间轴，一件事一个 Chapter，展开 memoryText。RecentAction 来自真实完成行为并自然淘汰，LifeTag 继续保留过去影响后来的真实链。

`npm run build` 完整构建；`npm run build-content` 生成 Web 内容，generated 文件不手改。

## Review 与交付

不依赖 Vercel。纯 SVG 画稿先通过当前真实 Renderer 静态短循环，实际看 320/96/64/48px；静态图不能证明 UI、保存、导入或居民绑定。

正式批次 tmp-* 聚合 → Build + Resident Visual Review → 下载同 SHA Artifact 并看图 → 重读 main → 非 force 推进 → main 再回归。8D2 的 11 张诊断、28 张真实工坊/全列表首尾/绑定截图和 96 张原尺寸图在 avatar/phase8d2/，源码与 SHA 随 Artifact 保存。原全组合、Coverage、保存导入、居民连续性及正式 fallback 保留，132 份旧固定配方逐字节不变。

用户从 main 拉取测试，不交付压缩包；执行者仍需下载并实际看 Artifact。8D2 Artifact 继续作为头像基线；当前回归还要覆盖 Profile 派生头像、玩家覆盖优先级与 Portrait fallback。8C 大交互和 Unity 迁移未实施。CI PASS 不等于视觉或玩法最终认可，接手以远端当前代码和文档为准。
