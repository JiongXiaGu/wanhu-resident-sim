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
- [ ] **Phase 1：让 Pack 拥有自己的素材 Catalog，解除“所有画风必须共享同一套选项”的限制**
- [ ] Phase 2：建立 Q版 V2 美术规范与头部 / 衣装内部图层规范
- [ ] Phase 3：第一批古代居民核心素材
- [ ] Phase 4：年龄 / 性别扩展与职业可读性
- [ ] Phase 5：大规模素材生产与批次 QA
- [ ] Phase 6：旧画风隐藏 / 兼容 / 退役决策

**下一项唯一主任务：Phase 1。**

---

# 1. 为什么 Phase 1 必须先做

当前 `model.ts` 仍有一套全局：

```text
4 Face
6 Hair
4 Outfit
6 Expression
```

三个 Pack 共用同一个选项 Catalog。

这对“比较三套画风”很好，但不适合下一阶段：

> Q版可爱增加 10+ 头部造型、古代帽子、10+ 古代服装与更多表情，而另外两套逐步冻结。

如果直接往全局 `options` 添加新 ID，会迫使 `linework-v1` 与 `simple-flat-v1` 也为所有新素材补画，形成错误耦合。

因此在大量画新素材前，必须先完成：

## Pack-owned Catalog

目标结构：

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
6. 切换回来 Q版时，尽量恢复该对象最近一次 Q版选择；若本轮暂不做 per-pack draft history，则必须在文档和测试中明确当前 fallback 行为。
7. Random 只能从当前 Pack 可用 Catalog 中取值。
8. Review 组合数改为按 Pack Catalog 动态计算，不再把每包固定 3456 当成永久常数。

### Pack 生命周期

预留：

```text
active      主路线，可继续扩素材
reference   仍可在编辑器中对照，但不要求继续扩素材
legacy      只为旧 Recipe 渲染，不再出现在普通画风选择 UI
```

近期建议：

```text
chibi-cute-v1   active
simple-flat-v1  reference
linework-v1     reference
```

先不要删除旧 Pack。

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

## Hair / 头部造型

这是下一轮最重要的扩展类别。

第一阶段仍保持一个玩家可见的 Hair 类，但允许一个 Hair option 内部包含：

```text
BackHair
FrontHair
HeadwearBack(optional)
HeadwearFront(optional)
```

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

---

# 11. 每轮结束必须更新这里

## 当前执行点

```text
Phase 1 — Pack-owned Catalog
状态：未开始
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
