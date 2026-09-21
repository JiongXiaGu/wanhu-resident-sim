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

## 当前美术：Phase 8D1-A / 8D1-B

在用户认可 8B2 基础画法基本可行后，合批新增常服、劳作、商铺、行旅四主题：**16 Hair + 16 Outfit ID**，按适用成年男女共 44 份画稿。儿童、老年继续使用独立资源，本批未扩充。唯一运行时 Pack 仍为 `chibi-cute-v1`。

全库为 **6 Face / 46 Hair / 40 Outfit / 8 Expression**。100 个可选资产均有中文描述与关键词；不是 100 份完整人物整图。六个 Face ID 在六 Frame 各有下脸画稿，不能算作 36 个玩家可选脸型。

部件栏搜索支持名称、描述、关键词、显式主题、Frame 与 ID。每个新资产记录核心轮廓、相似旧款差异和 96/64/48px 识别重点，全部保存在正式 Catalog。选择成年及头发/衣服后，搜 `8D1` 查看本批新增，搜 `8D1 行旅` 组合筛选，也可搜 `斗笠`、`披肩` 等形状关键词。搜索只作用当前分类/Frame；“随机本类”遵守搜索，“随机搭配”不受搜索影响。新卡片标“本批新增”，旧稿仍可用“仅已重画”过滤；两种标记都不是最终定稿徽章。

主题不是职业限制，适用 Frame 内可以自由混搭。Hair 不读取 Face，Head Frame / Coverage 保留。旧三个 Pack ID 仅作迁移 alias，十个 compatibility-only Hair/Outfit 只用于旧 Recipe 解析，不进入 UI、搜索或 Random。

详见 [头像工坊](Documentation/Avatar%20Workshop.md)、[当前主路线](Documentation/Q版头像主路线生产与审查工作流.md)、[8D1 主题头像资产扩充](Documentation/Phase%208D1%20主题头像资产扩充.md)。

## 保存与项目边界

自由样板、玩家、居民分别存入浏览器 localStorage，保存/应用才写入。切框架或对象前有草稿会询问；导入只改预览；恢复只移除当前目标覆盖。清除站点数据会丢失本地记录，可自行导出配方备份。描述、关键词和搜索词不进入 Recipe 或保存键。

`Web/src/avatar/` 是工坊及 Web 外观覆盖。`Web/src/resident/portrait/`、`Content/Portrait/`、正式五字段 DNA 保持冻结。未定制居民继续显示原图；外观编辑不改身份、家庭、职业、故事和游戏日期。

生活模式只展示当前 Activity、LifeEvent 与少量 Routine；人生模式是一条年龄升序时间轴，一件事一个 Chapter，展开 memoryText。LifeTag 保留过去影响后来的真实链。

`npm run build` 完整构建；`npm run build-content` 生成 Web 内容，generated 文件不手改。

## Review 与交付

不依赖 Vercel。纯 SVG 画稿可先用当前真实 Renderer 生成静态诊断，实际查看 320 / 96 / 64 / 48px；静态图不能证明 UI、存储、导入或居民绑定通过。

正式批次仍走 tmp-* 聚合修改 → Build + Resident Visual Review → 下载同 SHA Artifact 并人工看图 → 重读 main → 非 force 推进 → main 再回归。8D1 的四主题、六脸型、组合诊断、八张真实工坊和绑定居民截图在 `avatar/phase8d/`，另有八张未筛选列表首尾截图和 132 张原尺寸小图；完整源码及 SHA 随 Artifact 保存。

8D1 新增描述/搜索/新配方回归，原居民连续性、正式 fallback、六框架保存/导入/冲突、全组合、腮红及 Hair Coverage 继续保留。旧 8B2 的 88 份固定配方必须逐字节不变。CI PASS 不等于新美术最终认可。

用户自行从 main 拉取网页测试，不交付压缩包；执行者仍须下载并实际查看正式 Artifact。8C 大交互调整暂缓，8D2 儿童老年扩库、职业自动配装与 Unity 迁移未实施。接手先读 AGENTS、接续说明和主路线当前执行点，不用聊天记忆覆盖远端。
