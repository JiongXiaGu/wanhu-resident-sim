# Q版头像主路线生产与审查工作流

> 本文是《万户天工》居民头像后续迭代的主线执行文档。后续涉及头像架构、美术扩充、Q版可爱资产、Actions Review 或旧画风退役时，优先按本文逐阶段推进，不跳阶段，不用聊天里的临时方案覆盖当前 GitHub 事实。

## 0. 当前结论与状态

当前主路线：

- **主美术方向：`chibi-cute-v1` / Q版可爱**
- `linework-v1`、`simple-flat-v1`：暂时保留为对照 / 兼容画风，不再作为优先素材扩充对象。
- 当前玩家编辑仍保持四个主类别：**Face / Hair / Outfit / Expression**。
- 近期不新增玩家可见的第五类“帽子”或“腮红”分类。
- 帽子、头巾、发冠等第一阶段先作为 **Hair / 头部造型** 的组成部分；必要时内部增加 Headwear 图层，但不立即增加 Recipe 字段。
- 腮红、汗滴、疑惑符号、怒气线等归入 **Expression 内部视觉语言**。
- Outfit 开始从现代 demo 语义转向“泛中国古代模拟经营”身份 / 职业服饰。
- 正式 `Web/src/resident/portrait/` fallback、ResidentPortraitDNA、居民玩法与故事系统继续冻结，不因本路线扩张。

### 当前阶段

- [x] Phase 0A：统一 Pack Registry
- [x] Phase 0B：Visual Review 改为 Registry 驱动
- [x] Phase 0C：确定 Q版可爱为下一阶段主路线
- [x] Phase 1：让 Pack 拥有自己的素材 Catalog，解除“所有画风必须共享同一套选项”的限制
- [x] Phase 2：建立 Q版 V2 美术规范与头部 / 衣装内部图层规范
- [x] Phase 3：第一批古代居民核心素材
- [x] Phase 4：年龄 / 性别扩展与职业可读性
  - [x] Phase 4A：Face Frame Pass（脸部框架回正）
  - [x] Phase 4B：child / adult / elder、男女与职业可读性
  - [x] Phase 4C：Frame-specific Asset Catalog（年龄专属 Hair / Outfit）
- [ ] **Phase 5：大规模素材生产与批次 QA**
  - [x] Phase 5A：儿童专属素材批次
  - [ ] Phase 5B：成年居民素材批次
  - [ ] Phase 5C：老年素材批次
  - [ ] Phase 5D：三年龄综合 QA
- [ ] Phase 6：旧画风隐藏 / 兼容 / 退役决策

**下一项唯一主任务：Phase 5。**

---

# 1. Phase 1 结果：Pack-owned Catalog

Phase 1 已完成。原先 `model.ts` 的全局 options 已移除，三个 Pack 现在各自拥有 `catalog.ts` 与 defaults；当前三套恰好仍保留原有 4 Face / 6 Hair / 4 Outfit / 6 Expression，但这只是当前素材数量，不再是跨 Pack 强制契约。

现在 UI、Recipe 校验、随机搭配、Actions 全组合审查都会读取**当前 Pack 自己的 Catalog**。因此后续 Q版可以独立增加 10+ 头部造型、古代帽子、古代服装与新表情，reference Pack 不需要同步补画。

当前结构：

```text
AvatarPack
├─ id / title / note / lifecycle
├─ catalog
│  ├─ face[]
│  ├─ hair[]
│  ├─ outfit[]
│  └─ expression[]
├─ defs()
└─ layers()
```

UI 根据当前 Pack 自己的 Catalog 显示选项。

### 兼容原则

1. 已保存 Recipe 的 pack ID 与素材 ID 不静默改写。
2. `chibi-cute-v1` 可以拥有比旧 Pack 更多的 Hair / Outfit / Expression。
3. 旧 Pack 继续能读取自己的旧 Recipe。
4. 从 Q版专属素材切到旧 Pack 时，不要求旧 Pack 伪造同名素材。
5. 跨 Pack 映射必须是**显式 fallback / compatibility key**，不能随机换人。
6. Phase 1 暂不做 per-pack draft history：如果 Q版专属素材切到旧 Pack 时发生 fallback，再切回 Q版不会自动恢复原专属素材，需要重新选择。只有后续确有需求才增加 per-pack history。
7. Random 只能从当前 Pack 可用 Catalog 中取值。
8. Review 组合数改为按 Pack Catalog 动态计算，不再把每包固定 3456 当成永久常数。

### Pack 生命周期

预留：

```text
active      主路线，可继续扩素材
reference   仍可在编辑器中对照，但不要求继续扩素材
legacy      只为旧 Recipe 渲染，不再出现在普通画风选择 UI
```

当前已经执行：

```text
chibi-cute-v1   active
simple-flat-v1  reference
linework-v1     reference
```

普通画风选择显示 active/reference；legacy 预留给未来旧 Recipe 兼容。当前不删除旧 Pack。

---

# 2. Q版 V2 的素材边界

Phase 1 完成后，才进入 Phase 2。

## Face

目标：

- 保留少量基础脸型，优先提升差异质量，不追求几十个脸。
- 成年男女必须有成熟度差异。
- child 不是缩小成人。
- elder 不是“成人 + 灰发”。

第一轮仍可维持 4 个 Face，再根据实际审查看是否扩到 6 个。

### Face Frame 原则

Phase 4A 确认：**Face 负责适配统一头部框架，Hair / Headwear 不跟 Face 变化。**

成年 female / male 各自拥有一个稳定上半脸框架：

- 额头最高线固定。
- 左右太阳穴 / 帽沿接触区固定。
- 耳朵挂接高度固定。
- 四张 Face 的差异主要放在面颊、下颌、下巴、眼距、眼型和眉形。
- round / oval / angular / long 不能通过挤压头发或帽子来表达差异。
- 同一 Frame + Hair 下，BackHair / FrontHair / HeadwearBack / HeadwearFront 必须在四张 Face 中保持完全一致。

Phase 4B 已把 Face Frame 扩展到全部六个 Frame：female/male × child/adult/elder。每个 Frame 都有稳定的额头顶线、太阳穴接缝和耳位；Hair / Headwear 仍不读取 Face ID。

Phase 4C 改变的是素材可用范围而不是头部自动适配：共享 AvatarEditor、Recipe 和八层 Renderer，但 Hair / Outfit 不再要求 child / adult / elder 共用同一素材。Catalog option 可声明 `frames`；同一 Frame 内 Hair 仍不能随 Face 变化。Recipe 不增加年龄字段，Frame 继续来自当前玩家 / 居民对象。

## Hair / 头部造型

这是下一轮最重要的扩展类别。

第一阶段仍保持一个玩家可见的 Hair 类。Phase 2 已固定 Renderer 图层顺序：

```text
BackHair
HeadwearBack
Neck
Outfit
FaceBase
Expression
FrontHair
HeadwearFront
```

其中同一个 Hair option 内部拥有：

```text
BackHair
HeadwearBack
FrontHair
HeadwearFront
```

没有帽饰的 Hair 也保留两个空 Headwear slot。带帽 / 头巾 / 发冠的 Hair 必须在 Catalog 标记 `headwear: integrated`，实际帽饰 geometry 只能进入 HeadwearBack / HeadwearFront；不能偷塞进 FaceBase、Expression 或 Outfit。

这样可以画：

- 束发
- 发髻
- 双髻
- 编发
- 包头巾
- 劳作头巾
- 书生帽 / 巾
- 商贩头巾 / 帽
- 简化发冠
- 儿童头部造型

而不立刻制造“任意发型 × 任意帽子”的穿插组合爆炸。

### 什么时候才允许增加独立 Headwear 分类

只有同时满足以下条件才进入单独设计评审：

- 至少已有 8 个以上真正需要复用的帽饰。
- 同一帽饰需要跨 3 个以上 Hair 重复使用。
- 合并 Hair 方案造成明显重复资产维护。
- 已有自动 / 人工帽发穿插矩阵。
- 用户明确需要“同一发型自由换帽子”。

否则继续保持 Hair 内部组合。

## Outfit

下一阶段逐步淘汰现代 demo 语义，不急着直接删除旧 ID。

第一批工作标签建议：

- 平民日常短衣
- 劳作短褐 / 工作装
- 商贩 / 店铺掌柜
- 书生 / 学徒
- 手艺人 / 工匠
- 差役 / 城市服务角色
- 女性日常襦裙式简化造型
- 冬季夹衣 / 外搭
- 老年长衫式日常装

这里是“泛中国古代”视觉语言，不绑定具体朝代，不堆复杂纹样。

### Outfit 内部作者层规范

Outfit 仍然只有一个玩家可见类别和一个 Renderer `Outfit` layer，不增加 Recipe 字段。Q版内部按以下作者 slot 标记：

```text
base      身体与大面积主轮廓
collar    领口 / 衣襟，必须明确存在
overlay   外搭、左右襟片、围裙式大块叠层
detail    少量缝线、扣结、边缘强调
```

规则：

- `base` 与 `collar` 是每个 Outfit 的必需项。
- Neck 独立位于 Outfit 后方；Outfit 不重画皮肤或替换 Neck。
- 古代感首先通过 collar / overlay silhouette 表达，不靠细碎纹样。
- 不增加自动领口对齐器、逐 Face offset 或 mask / clipPath 遮挡补丁。
- 未来新增服饰时 Actions 必须能检测 Q版 Outfit 的 base / collar 标记。

## Expression

核心 6 个继续保留：

```text
calm
smile
joy
angry
sad
surprise
```

候选新增：

```text
shy
serious
```

腮红、汗滴、问号、怒气线属于 Expression 的内部表现，不成为独立装饰分类。

---

# 3. Q版 V2 美术规范

每批资产必须遵守：

## 造型

- 明显 Q版，但成年角色不能幼儿化。
- 大头比例保持一致，不因帽子 / 发型让头部无限膨胀。
- 肩部和胸部保持简化，不画成半身立绘。
- 48 / 64px 下 silhouette 优先于细节。

## 线条

- 使用当前 Q版粗圆轮廓语言。
- 同一批次线宽不能忽粗忽细。
- 小装饰不能靠大量细线表达。

## 五官

- 豆豆眼 / 极简眼型保持 Q版身份。
- 眉毛承担主要情绪。
- 表情不能改变 Face 身份。
- 成年男性可通过眉形、下颌、肩宽、发型增强成熟度。

## 色彩

- 2～4 个主色块为主。
- 避免高频复杂纹样。
- 职业可用颜色区分，但不要变成“职业制服图标化”。
- 允许低饱和红、蓝、土黄、米白、灰绿、褐色等古代日常色感。

## 内部图层

Phase 2 固定：

- `HeadwearBack` 位于 BackHair 之后、FaceBase 之前，用于帽后片、头巾后结等需要盖住后发但处在脸后方的部分。
- `HeadwearFront` 永远在 FrontHair 之后，用于帽檐、前结、额前巾片等需要覆盖刘海的部分。
- Expression 始终在 FrontHair / HeadwearFront 下方，不允许情绪符号穿过帽檐。
- 参考画风暂时输出空 Headwear layer，保证同一 Renderer contract。
- 当前旧 Q版 6 个 Hair 全部标记 `headwear: none`；Phase 3 新增真正帽饰后才出现 `integrated`。
- integrated Headwear 仍是固定作者 geometry，不读取 Face ID，不做横向缩放 / Y 位移 / anchor solver。
- 帽类可以拥有自己固定的“帽下头发”，但同一个 Hair ID 在四张 Face 间必须保持相同。

## 古代感

优先通过：

- 衣襟
- 领口
- 袖口
- 头巾 / 发髻 / 帽型
- 肩部轮廓
- 简化腰襟暗示

表达。

不要依赖：

- 满身祥云
- 大量龙凤纹
- 所有人戴发冠
- 过度朝代考据细节
- 二游华丽饰品堆叠

---

# 4. 第一批素材目标

完成 Phase 1 和 Phase 2 后，第一批不要一次做几十件。

## Batch A：成年男女核心居民

目标规模：

```text
Face        4
Hair        8～10
Outfit      8
Expression  8
Frame       female.adult / male.adult 优先
```

必须至少覆盖：

### Hair / 头部

- 无帽短发 / 束发
- 女性低髻
- 女性双髻或年轻造型
- 长发 / 编发类
- 劳作头巾
- 商贩 / 店铺头部造型
- 书生巾帽类
- 一种中性日常包头

### Outfit

- 平民日常
- 劳作
- 商贩
- 掌柜
- 书生 / 学徒
- 工匠
- 女性日常
- 冬装 / 外搭

### Expression

- 现有 6 个
- shy
- serious

Batch A 美术通过之前，不进入 Batch B。

## 2026-09-20：Phase 3 / Batch A 完成候选

本批实际把 Q版 active Pack 扩到：

```text
Face        4
Hair        11
Outfit      9
Expression  8
```

新增头部造型：

```text
bound            日常束发
low-bun          低髻
work-headscarf   劳作头巾
scholar-cap      书生巾帽
merchant-wrap    掌柜包头
```

其中后三个使用 `headwear: integrated`，实际 geometry 进入 HeadwearBack / HeadwearFront；前两个为 `headwear: none`。

新增古代服饰：

```text
commoner   平民短衣
laborer    劳作短褐
merchant   商贩襟衫
scholar    书生长衫
artisan    工匠围襟
```

新增表情：

```text
shy       害羞
serious   认真
```

旧现代 demo ID 暂不删除，继续用于旧 Recipe 兼容；新素材通过 compatibilityKey 映射到 reference Pack 的旧语义。Actions 新增 Batch A 成年男女专项图板，真实居民应用也改为使用新头巾 / 古代服饰 / 新表情。

只有 Build + Resident Visual Review、Artifact 人工美术审查和 main 复核全部通过后，本节才视为正式完成。

---

# 5. 每一批的执行顺序

以后每个素材批次固定执行：

```text
1. 读取本文“当前阶段”
2. 读取最新 main + AGENTS + Avatar Workshop
3. 明确本批新增 ID 和视觉目标
4. 只在 tmp-* 分支制作
5. Build
6. Resident Visual Review
7. 下载 Actions Artifact
8. 自动检查报告
9. 人工逐张看关键图
10. 记录发现的问题
11. 有问题则继续修，不因为 CI 绿色合 main
12. 再跑 Build + Visual Review
13. 重读 main，确认没有并行冲突
14. exact reviewed tree 推进 main
15. main 再跑 Build + Visual Review
16. 再次人工抽查 main 关键截图
17. 更新本文阶段状态 / 决策记录
```

---

# 6. 自动 Review 必须检查什么

通用检查：

- Pack Catalog 与 Review Spec 一一对应。
- 每个选项都能渲染所有声明支持的 Frame。
- SVG 合法。
- 禁止完整人物 `<image>` 冒充部件。
- 禁止 mask / clipPath 被用作自动兼容遮挡方案。
- 图层顺序固定且有明确契约。
- 换 Hair / Outfit 不改变 FaceBase。
- 换 Expression 不改变 FaceBase。
- 不同 Face 共享同一套可复用 Hair / Outfit 语义。
- 嘴中心、眼睛范围合理。
- 96 / 64 / 48px 都实际渲染。
- 当前 Pack Catalog 的组合数按实际选项动态计算。
- 真实玩家与居民 Apply / Cancel / Restore / Reload 继续通过。
- 新素材不能修改居民身份、故事、游戏日期。

Q版专项自动检查：

- 成人头身比例仍在 Q版范围。
- Simple Flat / Linework 不得被 import 成 Q版实际 geometry。
- Headwear 内部图层存在时，必须位于正确前后关系。
- 同一 Frame + Hair 的四个头部层在所有 Face 下必须字节一致；Face 不允许驱动 Hair / Headwear geometry。
- adult Face 必须声明统一 Face Frame signature，并保持相同额头顶线 / 太阳穴框架。
- Catalog 新增素材不能让旧 Recipe 失效。

---

# 7. 人工美术 Review 清单

**CI PASS 之后必须人工看图。**

每次至少看：

## 角色身份

- [ ] 成年男不像儿童。
- [ ] 成年女不过度幼儿化。
- [ ] child 与 adult 有明显区别。
- [ ] elder 不只是灰头发。
- [ ] 男女不是只靠头发区分。

## 头发 / 帽子

- [ ] 帽沿不切眼睛。
- [ ] 帽子不漂浮。
- [ ] 发髻不穿帽。
- [ ] 前发 / 后发层级自然。
- [ ] 不同 Face 下位置都合理。
- [ ] 48px 下仍能看出头部造型差异。

## 衣服

- [ ] 脖子和领口不断裂。
- [ ] 肩部不穿插。
- [ ] 古代感成立，没有明显现代 T恤 / 西装 / 卫衣感。
- [ ] 不同职业有可读差异，但不是夸张制服。
- [ ] 男女衣装都和当前 Q版比例一致。

## 表情

- [ ] smile 不歪。
- [ ] joy 不像五官错位。
- [ ] angry 主要靠眉眼，不靠巨大符号。
- [ ] sad 不怪。
- [ ] surprise 五官位置正常。
- [ ] 腮红 / 汗滴 / 情绪符号不越界、不抢角色主体。

## 真正的游戏场景

- [ ] 真实 Avatar Workshop 看起来正确。
- [ ] 实际居民面板应用后正确。
- [ ] 暗色 UI / 浅色衬底都可读。
- [ ] 96 / 64 / 48px 都看过。
- [ ] 不因为诊断大图好看就忽略实际 UI。

任何一项明显失败：**不合 main，继续修。**

---

# 8. Actions 必须输出的 Q版证据

随着 Q版进入主路线，Visual Review 至少保留：

- 实际成年女性 Q版编辑器。
- 实际成年男性 Q版编辑器。
- Face Matrix。
- Hair / Headwear Matrix。
- Outfit Matrix。
- Expression Matrix。
- female child / adult / elder。
- male child / adult / elder。
- 96 / 64 / 48px。
- 真实居民应用前后。
- 跨 Pack 对照在旧 Pack 仍可见期间继续保留。

以后素材数量很大时，不要求在聊天中贴全部图；Actions Artifact 保留完整证据，交付回复只贴关键截图。

---

# 9. 旧画风退役规则

不要因为 Q版成为主路线就立即删除旧 Pack。

## reference 阶段

- 仍可选择。
- 继续渲染旧 Recipe。
- 不要求跟随 Q版新增所有素材。
- 不再主动增加新素材。

## legacy 阶段

- 普通玩家 UI 隐藏。
- 已保存旧 Recipe 仍能渲染。
- JSON 导入旧 Recipe 仍按明确兼容规则处理。
- Actions 保留最小兼容检查。

## 删除 Pack

只有同时满足：

- 没有需要保留的本地 Recipe 兼容要求，或已有正式迁移。
- 用户明确确认删除。
- Git 历史足够保留旧美术。
- 删除不会破坏现有居民覆盖记录。

当前不执行删除。

---

# 10. 决策记录

## 2026-09-20：主路线确定

决定：

- Q版可爱成为后续主要扩充方向。
- 其他两套暂时保留，不继续优先扩素材。
- 先做生产框架，再大规模做美术。
- 帽子第一阶段进入 Hair / 头部造型，不新增玩家可见第五分类。
- 腮红进入 Expression。
- 下一步先解决 Pack-owned Catalog。

原因：

当前全局 options 强迫所有 Pack 同步拥有所有素材，如果直接扩 Q版，会让已准备退役的画风产生大量无意义维护。

## 2026-09-20：Phase 1 完成

已完成：

- 每个 Pack 独立 `catalog.ts` 与 defaults。
- `chibi-cute-v1=active`；另外两套为 reference。
- 新对象默认使用 active Q版 Pack。
- Recipe 校验严格按 Recipe 自己的 Pack Catalog。
- UI 选项网格按当前 Pack Catalog 动态生成。
- Random 只从当前 Pack Catalog 取值。
- 跨 Pack 映射固定为 exact ID → compatibilityKey → target defaults，不随机。
- Actions 组合数改为按各 Pack Catalog 动态计算，不再永久写死 3456。
- 旧 `soft-paint-v1` alias 继续映射到 Q版，且不偷偷改写 localStorage。

人工 / 自动回归通过后才进入 Phase 2。

## 2026-09-20：Phase 2 完成

已完成：

- Renderer 层契约从 6 层扩展为 8 层，加入 `HeadwearBack / HeadwearFront`。
- Headwear 仍属于 Hair option 内部，不增加第五个 Recipe 字段。
- Q版 Hair 使用固定 `back / headwearBack / front / headwearFront` 作者返回结构。
- Q版 Hair Catalog 增加 `headwear: none | integrated` 元数据；旧 6 个 Hair 当前均为 none。
- Q版 Outfit 固定 `base / collar / overlay / detail` 内部作者标记，现有四套衣服已按原绘制顺序包装，视觉不应变化。
- Runtime 会直接检查所有 Pack 是否遵守 8 层顺序。
- Actions 会导出 Headwear slot、检查 integrated / none 是否与实际图层一致，并检查 Q版 Outfit 至少存在 base + collar。
- 不引入自动 anchor solver、逐脸 offset、mask / clipPath 兼容补丁。

Phase 2 只建立生产契约，不新增古代帽子或古代服饰；真正美术从 Phase 3 / Batch A 开始。

## 2026-09-20：Phase 3 / Batch A 第一批素材

决定：

- 保留旧 6 Hair / 4 Outfit / 6 Expression，避免破坏既有 Recipe。
- 在 Q版 Pack 内独立增加 5 个古代头部造型、5 套古代服饰、2 个表情。
- 第一轮帽饰只做劳作头巾、书生巾帽、掌柜包头三种，用来验证 HeadwearBack / Front 契约。
- 不给 reference Pack 补画这些新素材，只通过 compatibilityKey 明确回退。
- 实际居民验收必须至少应用一次 `work-headscarf + commoner + shy`，另一居民使用 `scholar-cap + scholar + serious`。

通过本批后，Phase 4 转向 child / adult / elder 与男女职业可读性，不继续无节制堆成年素材。

## 2026-09-20：Phase 4A Face Frame Pass

上一轮尝试让 integrated Headwear 根据不同 Face 做缩放 / 位移适配，人工视觉审查证明方向错误：帽子和头发随脸变化后复杂度上升，而且同一发型的稳定性被破坏。因此该实现已从当前树撤销，不作为后续基础。

本轮正式规则：

- Hair / Headwear 是稳定资产，不接受 Face ID。
- 删除 head-fit 运行时适配与逐脸帽饰 wrapper。
- `female.adult` 与 `male.adult` 各自建立统一上半脸 Face Frame。
- 四个 Face 共用同一额头顶线、太阳穴 / 帽沿接触区和耳位；差异集中在脸的下半部与五官。
- Actions 明确检查每个 Frame × Hair 的四层头部 geometry 在四张 Face 下完全相同。
- Actions 输出固定书生巾帽 / 劳作头巾 / 掌柜包头 × 4 Face 图板，以及书生巾帽四脸 96 / 64 / 48px 图板。
- 实际编辑器分别截图 female / male 书生巾帽。
- 不新增自动 fit、每帽每脸 offset、mask 或 clipPath 修正。

Phase 4A 通过后，Phase 4B 才处理 child / adult / elder、男女成熟度与职业可读性。

## 2026-09-20：Phase 4B 年龄 / 性别 / 职业可读性

本轮完成：

- Face Frame 从成年男女扩展到六个 Frame，child / elder 也遵守“Face 适配固定 Hair / Headwear”的原则。
- child 使用更短、更圆的下脸与更大的眼睛，肩颈更窄；不是缩小成人。
- adult male 的下颌、眼睛、眉线、颈部和肩宽与 adult female 明确分开，不只靠头发区分。
- elder 增加眼下纹、口周纹、眉线下垂、较弱腮红和更窄 / 更缓的肩颈轮廓，不再只依赖灰发。
- Outfit 的身体主轮廓按 female/male × child/adult/elder 调整肩宽，但同一 Outfit ID 的衣领与职业语义保持一致。
- 新增自动 age/sex proof：同一 `round + bound + commoner + calm` 组合检查六个 Frame，验证 child 比 adult 更小、elder 肩形不同、成年男女肩颈有可读差异。
- 新增职业 proof：平民、劳作、掌柜、书生/学徒、工匠在成年男女各一套 96 / 64 / 48px 图板。
- 新增职业跨年龄 proof：书生/学徒与掌柜分别检查 child / adult / elder，确保职业语义在不同年龄仍可读。
- Hair / Headwear 仍严格要求同一 Frame + Hair 在四张 Face 下 geometry 完全一致。

Phase 4B 不新增第五分类，也不新增 face-dependent Hair。

## 2026-09-20：Phase 4C Frame-specific Asset Catalog

本轮把之前错误的“所有年龄尽量复用同一套 Hair / Outfit”约束移除，改为：

- 共享编辑器、四字段 Recipe、Pack、八层 Renderer 与保存流程。
- `CatalogOption.frames` 控制素材可用的 female/male × child/adult/elder Frame；省略时仍表示六 Frame 通用。
- UI、随机搭配、跨 Pack 预览与 Review 只使用当前 Frame 可用的素材。
- Recipe 仍不保存年龄 / 性别；目标对象提供 Frame。旧 Recipe、导入 Recipe 或居民自然跨年龄后，如果某素材不再适用，按 exact → compatibilityKey → 当前 Frame 默认/首项确定性回退，预览阶段不自动改写存储。
- 同一 Frame + Hair 在四张 Face 下仍必须 geometry 完全一致；不同 Frame 不再要求使用同一个 Hair ID。
- 成年古代 Batch A 的 `bound / low-bun / work-headscarf / scholar-cap / merchant-wrap` 与 `commoner / laborer / merchant / scholar / artisan` 限定为 adult。
- 第一批儿童专属 proof：`child-topknot / child-double-bun`，`child-short-robe / child-apprentice`。
- 第一批老年专属 proof：`elder-low-knot / elder-swept`，`elder-long-robe / elder-warm-coat`。
- 旧基础 6 Hair / 4 Outfit 暂时继续六 Frame 通用，用于旧 Recipe 兼容和过渡，不代表后续新古代素材继续跨年龄共享。
- Actions 的组合数改成逐 Frame 动态计算，并新增 Frame Catalog metadata、fallback、儿童 / 成年 / 老年专属素材图板与真实 UI 选项截图。

Phase 4C 不引入 Head Shell、hat-fit、anchor solver、逐 Face offset、mask / clipPath，也不增加第五个玩家分类。通过后进入 Phase 5，后续批量素材生产应优先按 child / adult / elder 分批，而不是先画一件再强行兼容六个 Frame。

## 2026-09-20：Phase 5A 儿童专属素材批次

本轮完成：

- child Hair 扩展为真正的儿童作者资产：`child-topknot`、`child-double-bun`、`child-tufted`、`child-double-knots`、`child-side-braid`、`child-half-up`、`child-short-fringe`；女童可用 6 个，男童可用 5 个。
- child Outfit 扩展为 6 套：`child-short-robe`、`child-apprentice`、`child-play-jacket`、`child-helper`、`child-winter`、`child-fine-robe`。
- 旧基础 Hair `crop / bob / long / pony / wave / braid` 与旧现代 Outfit `tee / shirt / knit / jacket` 不再出现在 child UI；历史 Recipe 仍可解析，进入 child Frame 时通过 compatibilityKey / Frame fallback 映射到儿童素材。
- 本批不制作儿童 integrated Headwear，避免再次把帽饰适配复杂度引入儿童阶段。
- Actions 新增 Phase 5A contract：child UI / Frame Catalog 不能暴露非 child Hair / Outfit；女童 Hair 至少 6、男童 Hair 至少 5、Outfit 至少 6；分别输出 Hair、Outfit、组合的 96 / 64 / 48px 图板。
- 实际编辑器截图改用 `child-short-fringe + child-winter`，并直接断言 child Hair / Outfit 选项全部为 `child-*`。

Phase 5A 结束后进入 Phase 5B 成年居民素材批次；不回头要求儿童与成年共用同一美术资产。

---

# 11. 每轮结束必须更新这里

## 当前执行点

```text
Phase 5B — 成年居民素材批次
状态：未开始（Phase 5A 儿童专属素材批次完成）
```

## 下一次执行必须先回答

1. 当前 main SHA 是什么？
2. 本文“当前执行点”是什么？
3. 本轮是否只做该阶段范围？
4. Build 是否 PASS？
5. Resident Visual Review 是否 PASS？
6. 是否实际下载并查看关键截图？
7. 是否需要修正后再进入下一阶段？

如果没有更新本节，就不能声称该阶段完成。
