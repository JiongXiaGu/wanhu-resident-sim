# 万户天工 · 居民逻辑网页 demo

验证居民当前生活、人生经历、故事连续性和可编辑头像。不是 Unity ECS / Blob / 正式存档设计稿。

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

## 当前美术：Phase 8D2 童老头像扩充

用户认可 8D1 后，本批新增儿童 6 Hair / 6 Outfit、老人 6 Hair / 6 Outfit，共 **12 Hair + 12 Outfit ID**、32 个适用 Frame / 资产组合。童老使用独立 SVG 母版，已认可的成年与旧童老画稿保持不变。唯一运行时 Pack 仍为 `chibi-cute-v1`。

全库当前 **6 Face / 58 Hair / 52 Outfit / 8 Expression**，共 124 个可选资产，均有中文描述和关键词；不是 124 份完整人物整图。新素材保留显式主题、Frame、轮廓、旧款差异和 96/64/48px 识别重点，Catalog 是唯一文字权威。

进入自由创作选择儿童或老人，再选头发/衣服，保持“全部素材”，搜索 `8D2` 查看新增；搜索 `8D1` 查看上批成年主题。支持名称、描述、关键词、主题、Frame 和 ID；搜索只作用当前分类/Frame。“随机本类”遵守搜索，“随机搭配”不受搜索影响。新卡片标“本批新增”，上批标“8D1”；历史“仅已重画”不包含这两批扩库项，空结果可重置。

主题不是职业限制，适用 Frame 内自由混搭。Hair 不读取 Face，Head Frame / Coverage 保留；旧三个 Pack ID 仅作迁移 alias，十个 compatibility-only Hair/Outfit 只供旧 Recipe，不进入 UI、搜索或 Random。

详见 [头像工坊](Documentation/Avatar%20Workshop.md)、[当前主路线](Documentation/Q版头像主路线生产与审查工作流.md)、[8D2 童老头像资产扩充](Documentation/Phase%208D2%20童老头像资产扩充.md)。

## 当前界面：Resident Panel Portrait-first

居民信息面板进入布局重构阶段：左下角采用与 `wanhu-ui-prototype` Context Surface 一致的中性烟墨材质语言，头像扩大为人物 Hero 的第一视觉焦点；住所/工作/家庭改为轻量三列，“此刻”提升优先级，LifeEvent 取消大卡片套卡片，关注移入人物区，Footer 只保留人物关系与人生经历。详细契约见 [Resident Panel Portrait-first 布局](Documentation/Resident%20Panel%20Portrait-first布局.md)。

本轮只改 UI 信息架构与视觉，不改变居民模拟、LifeEvent、人生经历、正式 portrait 或头像工坊数据契约。

## 保存与项目边界

自由样板、玩家、居民分别存入浏览器 localStorage，保存/应用才写入。切框架或对象前有草稿会询问；导入只改预览；恢复只移除当前目标覆盖。清除站点数据会丢失本地记录，可自行导出配方备份。描述、关键词和搜索词不进入 Recipe 或保存键。

`Web/src/avatar/` 是工坊及 Web 外观覆盖。`Web/src/resident/portrait/`、`Content/Portrait/`、正式五字段 DNA 保持冻结。未定制居民继续显示原图；外观编辑不改身份、家庭、职业、故事和游戏日期。

生活模式只展示当前 Activity、LifeEvent 与少量 Routine；人生模式是一条年龄升序时间轴，一件事一个 Chapter，展开 memoryText。LifeTag 保留过去影响后来的真实链。

`npm run build` 完整构建；`npm run build-content` 生成 Web 内容，generated 文件不手改。

## Review 与交付

不依赖 Vercel。纯 SVG 画稿先通过当前真实 Renderer 静态短循环，实际看 320/96/64/48px；静态图不能证明 UI、保存、导入或居民绑定。

正式批次 tmp-* 聚合 → Build + Resident Visual Review → 下载同 SHA Artifact 并看图 → 重读 main → 非 force 推进 → main 再回归。8D2 的 11 张诊断、28 张真实工坊/全列表首尾/绑定截图和 96 张原尺寸图在 avatar/phase8d2/，源码与 SHA 随 Artifact 保存。原全组合、Coverage、保存导入、居民连续性及正式 fallback 保留，132 份旧固定配方逐字节不变。

用户从 main 拉取测试，不交付压缩包；执行者仍需下载并实际看 Artifact。8C 大交互、自动配装和 Unity 迁移未实施。CI PASS 不等于新美术最终认可，接手以远端当前代码和文档为准。
