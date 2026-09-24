# 头像工坊 / Avatar Workshop

## 入口与编辑对象

`/?view=avatar-editor` 和首页头像工坊默认打开自由创作；居民身份栏“编辑头像”直接绑定该居民。两种上下文共用同一个编辑器、Renderer、Recipe 与 Catalog，不建立第二套页面。

自由创作可以直接选择男/女、儿童/成年/老年，六份样板独立保存；指定对象可选玩家示例与真实城市居民，年龄/性别锁定。Frame 是样板编辑上下文，不是第五种素材分类，也不改变居民身份。

玩家始终只有 Face / Hair / Outfit / Expression 四类选择。帽巾在 Hair 内部，腮红在 Expression 内部。

## 当前资产与文字

唯一运行时 Pack 为 `chibi-cute-v1`。Phase 8D2 童老扩库已经完成，当前 **6 Face / 58 Hair / 52 Outfit / 8 Expression**，共 124 个玩家可选资产。六 Face ID 在六 Frame 各有画稿，不是 36 个玩家选项。当前没有主动头像扩库批次；本系统进入基线维护并服务 Resident Profile 派生默认头像。

8D2 新增儿童 6 Hair / 6 Outfit、老人 6 Hair / 6 Outfit，24 个新 ID 对应 32 个适用 Frame / 资产组合。童老按年龄独立绘制，不使用成年缩放；本批不重画旧素材。具体清单和审查见 [Phase 8D2 童老头像资产扩充](Phase%208D2%20童老头像资产扩充.md)。

全部可选资产有中文 description 与 keywords，Catalog 是文字、适用性和兼容权威。8D1 / 8D2 新项继续使用 ThemeCatalogOption：显式 theme、frames、silhouette、closestAssetId、distinction、readability。主题只是美术/检索信息，不限制职业。完整说明显示在所选部件下，卡片悬停也可查看。

## 检索与草稿

部件栏搜索匹配当前分类、当前 Frame 和当前重画筛选内的 ID、名称、短注、完整描述、关键词、主题、轮廓和 Frame（含女性/男性/年龄中文别名）。空格分词为 AND，NFKC 归一化，大小写不敏感。可搜 `8D2` 看童老本批、`8D1` 看成年上批，搜 `8D2 行旅` 看本批行旅，或输入 `斗笠`、`披肩`、完整 ID。

检索只改变候选显示，不改配方或保存、不制造脏草稿。切分类清空搜索；确认切换对象后清空，取消草稿确认则保留原上下文。无结果有清除搜索/筛选按钮，不能自动替换头像。

随机本类遵守搜索和筛选，只改当前类别；没有其他候选则禁用。随机搭配只改 Hair / Outfit，保留 Face / Expression，不受文本搜索影响，但遵守原重画筛选。界面明确区分两者。

8D2 新资产显示“本批新增”，8D1 显示“8D1”；历史 `isReworkedSample` 标记仍为“已重画”。“仅已重画”有意不包含 8D1 / 8D2，组合检索为空可以重置。两种标记都是候选说明，不是最终认可。日常样板和导入只载入草稿，不自动应用。

## 不变的组合结构

六 Frame：female/male × child/adult/elder。`head-frame.ts` 定义各 Frame 唯一上头型、太阳穴、耳位和 signature；Face 只改下脸和五官；Hair 只接收 Frame / Hair ID，不读取 Face。

禁止 face-dependent offset/scale、逐脸补丁、anchor solver、mask/clipPath 自动适配。Coverage probes 只做 QA，不驱动变形。疏发可露内部头皮，外包络不能露出上头型。

```text
BackHair → HeadwearBack → Neck → Outfit
→ FaceBase → Expression → FrontHair → HeadwearFront
```

integrated 帽饰进入前后 Headwear 层，无帽为空。Outfit 内部为 base / collar / overlay / detail，其中 base/collar 必须存在。320×320 母版是头肩胸像，裙腰、腰带与围裙吊带不硬塞进下缘，主衣片要延伸出画布；完整帽身不能被 FrontHair 切成横条。

## Recipe 与兼容

```json
{"schema":"wanhu.avatar","version":1,"pack":"chibi-cute-v1","face":"oval","hair":"bound","outfit":"commoner","expression":"smile"}
```

Recipe 不含年龄、性别、目标 ID、文字描述、关键词、主题或搜索词。导入验证协议/Catalog，再按当前 Frame 做 exact → compatibilityKey → 默认/首项确定性回退，只改预览；应用才落盘。

旧 `linework-v1/simple-flat-v1/soft-paint-v1` 只有 alias → Q版。旧 Hair `crop/bob/long/pony/wave/braid`、Outfit `tee/shirt/knit/jacket` 只用于解析，不进 UI/搜索/Random。Face 的 `long` 是仍可选的清秀脸，不等于同名旧 Hair ID。

## 保存边界

```text
wanhu.avatar.v1:city:<seed>:studio:<frame>
wanhu.avatar.v1:city:<seed>:player:female
wanhu.avatar.v1:city:<seed>:player:male
wanhu.avatar.v1:city:<seed>:resident:<id>
```

旧键不变，不批量迁移。一个目标一份记录；自由样板互不覆盖，也不覆盖居民。切对象/Frame、关闭时有未保存修改必须确认。恢复仅删除当前目标覆盖，同目标跨标签页更新提示冲突，配额或读写失败不能显示成功。延迟导入不能污染新目标。

这是浏览器 localStorage Web 原型，不是账号/云存档或 Unity Save。JSON 不携带 Frame，导入前先选目标；PNG/SVG 导出当前所见 Frame。真实居民姓名、生日、性别、家庭、职业、故事、游戏日期不变。正式五字段 DNA 与 `Web/src/resident/portrait/` 作为 fallback 保持冻结。未保存玩家覆盖的居民优先显示 Resident Profile 派生的 `chibi-cute-v1` 默认 Recipe；移除覆盖回到 Profile 派生默认，只有生成链不可用时才进入正式 Renderer fallback。

## 源码分工与 Review

model/store/render 保管配方、默认、保存与统一层序；Integration 保管 App 当前会话目标与入口；AvatarEditor 保管草稿、切换、保存、展示。studio.tsx 保管六框架样板与历史重画标记。asset-search.ts 只处理 Catalog 文本匹配，asset-search.css 只补当前部件栏样式。

packs/chibi/catalog.ts 保管原有描述和选项；theme-catalog.ts 保管 8D1 新选项，汇合为同一个 Catalog。child-hair / elder-hair / age-outfits 保管童老；adult-hair / adult-outfits 保管 8B2 成年；sample-hair / sample-outfits 保管 8A 保留样板；theme-hair / theme-outfits 保管 8D1 成年稿，age-theme-catalog 与 child/elder-theme-hair、child/elder-theme-outfits 保管 8D2 童老稿。每个 ID 只有一份当前画稿，hair/outfits 只分发，不恢复历史第二套 Pack。

正式批次跑 Build + Resident Visual Review，下载同 SHA Artifact 并打开真实桌面 UI / 诊断。原全部组合、Hair 跨 Face、Coverage、腮红、六框架保存、草稿确认、导入隔离、对象绑定和居民逻辑继续验证。8D1 保留其增量审查；8D2 追加童老新素材点选、描述检索、四 Frame JSON 往返与绑定，以及 132 份旧固定配方不变。静态图不能替代完整 UI / 存储通过。

用户从 main 拉取测试，不交付压缩包；执行者内部仍下载 Artifact。8D2 已作为当前头像资产基线收尾；8C 大交互优化暂缓，独立帽子、连续参数、自动 Hair fit、服务端同步和 Unity 迁移未实施。没有明确新需求时，不自行开启新的头像扩库 Phase。
