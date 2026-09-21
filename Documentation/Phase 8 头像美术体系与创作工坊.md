# Phase 8：头像美术体系与创作工坊

## 当前执行点

用户认为 Phase 8B2 的基础画法基本可行，批准 **8D1-A / B 四生活主题合批扩充**。本阶段具体资产、文字契约、源码与截图要求见 [Phase 8D1 主题头像资产扩充](Phase%208D1%20主题头像资产扩充.md)。8C 大交互优化暂缓，童老扩库留给之后的 8D2。

8D1 新增 16 Hair / 16 Outfit ID，对应 44 份适用成年男女画稿。当前 6 Face / 46 Hair / 40 Outfit / 8 Expression；100 个可选资产都有描述和关键词。Face、Expression、Head Frame、童老画稿不改。具体阶段历史见 [8B1 童老衣装审查](Phase%208B1%20童老衣装审查.md) 与 [8B2 成年衣装与衣领审查](Phase%208B2%20成年衣装与衣领审查.md)。

本阶段改善的是画法、素材库与创作体验，不是再造系统。Phase 7 的技术通过不等于当时美术定稿；8B2 获准继续也不等于所有 8D1 新款被提前认可。

## 共同作者规则

唯一运行时 Pack 为 `chibi-cute-v1`，四类选项不变。六 Frame 各有固定 Head Frame，Face 只改下脸与五官，Hair 只接收 Frame 和 Hair ID。禁止逐 Face offset/scale、solver、Head Shell 变形或 mask/clipPath 自动适配；Coverage 只用于 QA。

六脸型是柔和、圆润、英气、清秀、方圆、细颌；名称不能替代真实下颌和眼形差异。儿童下脸短而饱满，老年年龄线克制。腮红只由 Expression 的单个 data-blush 组提供，固定安全区与真实脸填充余量都要验证。8D1 不重画 Face/Expression。

头部造型先有完整轮廓，再拆 BackHair、HeadwearBack、FrontHair、HeadwearFront。帽身不能被发顶截断，发髻不能悬空或紧贴耳朵成为“第三只耳朵”。稀疏发际可露内部头皮，外包络不能露 Head Frame。童老独立画稿，不通过成年缩放生成。

320×320 母版是头肩胸像。衣领、肩线和胸前衣襟必须可读；裙腰、腰带、腰围裙不强塞到下边缘。主衣片延伸出画布，斜襟不突然终止成孤立白三角。Outfit 的 base/collar/overlay/detail 各有职责；overlay 画真实外搭，detail 只放少量缝线/系结/补缀，不修补主轮廓。

八层 Renderer 顺序为 BackHair → HeadwearBack → Neck → Outfit → FaceBase → Expression → FrontHair → HeadwearFront，表情位于前发/前帽身之下。帽巾和腮红不增加玩家类别。

## 扩库的区别要求

常服需要没有明确职业指向的日常轮廓；劳作用发量收拢、短外褂与内外层区分；商铺以整洁帽身与成面门襟表现；行旅增加宽檐、垂角、披肩和包裹领面。主题不成为职业穿衣限制，不以贫富、官职或服色锁定玩家。

每个新 ID 的中文描述说明主轮廓、与相似旧款的区别和小尺寸重点，关键词用于检索。只有颜色不同、路径完全相同的素材不作为本批新增。不同几何也可能看起来相近，仍需要实际审美判断。

48px 主要读发量、帽身、领型与大色块，不要求细发丝、补缀和系结全可辨。泛中国古代简化造型不宣称具体朝代服制复原。

## 创作与保存边界

自由创作直接选六 Frame，分别保存 `studio:<frame>`；指定对象 Frame 锁定。两者共用编辑器，旧 player/resident 保存键不变。自由样板不把同一个居民变老变小，不重建 App 或改游戏日期。

日常样板、导入都只改草稿；切对象/Frame 和关闭需确认未保存内容。晚到导入不能污染新目标。保存/刷新/恢复、外部更新冲突、读写失败继续按原契约处理。

Recipe 只有版本、Pack 和四类 ID，不含 Frame、目标、描述、主题、关键词或搜索词。JSON 导入前选择上下文，使用 exact → compatibilityKey → 当前 Frame 默认/首项回退。PNG/SVG 导出当前所见 Frame。旧 Pack 只留 alias，旧 modern ID 不进入 UI/搜索/随机。

正式 portrait、五字段 DNA、居民姓名/生日/家庭/职业/故事/日期保持冻结。工坊只是 Web 外观覆盖，移除覆盖恢复原图。

## 生产与审查

原画稿按 child/elder/adult 文件分工，8A 保留样板和 8B2 旧稿不复制为第二资源包。8D1 在 theme-hair/theme-outfits 增量绘制，theme-catalog 注册元数据。Catalog 为文字和适用性权威，theme/keywords/轮廓/旧款差异/三尺寸识别点直接随资产维护，不另外维护运行时搜索索引；文档逐项清单以 CI 检查同步。无领外褂用完整前片，双缘襟衫用连续宽缘，不能回到吊带和挤窄门襟。

先聚合修改，通过真实 Renderer 静态图短循环检查 320/96/64/48px，再正式运行 Build 与 Resident Visual Review，下载同 SHA Artifact、核对源码、打开全部新增诊断和真实桌面 UI。复核 main 没有并行冲突后非 force 推进，再看 main 的回归证据。不得用旧 run 或静态图冒充最新 UI 通过。

8D1 必须保留旧 88 份固定配方逐字节不变，执行全部新 ID/Frame 点选、描述检索、独立保存、JSON 往返、绑定居民和原全组合/腮红/Coverage/正式 fallback/居民逻辑回归。新增图板复用 renderBoards，不重建 Review 系统。

用户自行拉 main 测试，不交付压缩包；执行者仍需下载和实际看 Artifact。人工范围以桌面为主，移动端不截图，基础窄屏 smoke 保留。当前新稿仍待用户审美验收。
