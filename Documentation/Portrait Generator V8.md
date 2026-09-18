# Portrait Generator V8.4 — Simple Portrait

## 定位

《万户天工》的居民头像是**次要表现系统**，不是独立捏脸游戏。

V8.4 的目标不再是“用复杂算法把少量资产自动适配成很多组合”，而是：

1. 玩家能认出“这是这个人”；
2. 儿童、青年、成年、老年读感明确；
3. 居民可以换发型；
4. 居民可以换衣服；
5. 把开发时间优先投入美术效果。

入口：

~~~text
/?view=portrait-v8
~~~

## V8.3 为什么停止继续扩复杂度

V8.1～V8.3 逐步加入过：

- Identity Morphology 连续参数；
- HeadProfile；
- 17 个 Head Anchor；
- anchor-local Hair；
- placementByHeadProfile；
- skull / face keepout / ear 等 Hair Mask；
- Accessory Slot；
- 96 / 64 / 48 分层 LOD；
- Compatibility Result / multiplier；
- Population Diversity Controller；
- Hair Asset Contract Audit。

这些机制技术上可以工作，但对于当前只有少量正式头像资产的项目，调试成本已经超过收益。

典型问题是老年头发：

~~~text
Hair Asset 自己定义发际线
+
HeadProfile skull mask 再定义一次发际线
+
placement / scale 再调整整套 Hair
=
修前发时后髻变化，修后髻时前发又变化
~~~

这会把本来应该是“看截图改美术”的工作变成排查 Anchor / Mask / Placement。

因此 V8.4 主动降低复杂度。

---

## V8.4 最终生成链

~~~text
SemanticAppearanceContext
↓
Identity Resolver
↓
Presentation Resolver
↓
ResolvedAppearanceDNA
↓
FaceFamily + Stage + HairStyle + OutfitStyle
↓
Simple RenderPlan
↓
Generic Renderer
~~~

不再存在 Hair 专用 Mask / Anchor / Compatibility Pipeline。

---

## IdentityDNA

Identity 只保存少量长期稳定 ID：

~~~text
residentStableId
identitySeed
faceFamilyId
skinPaletteId
baseHairColorId
~~~

财富、衣服、发型变化不重新生成 Identity。

### FaceFamily

脸型差异继续保留，但改成**离散美术资产**，不使用实时 Morph。

首批：

- face.soft-oval
- face.round-soft
- face.long-narrow
- face.broad-cheek
- face.square-soft
- face.narrow-chin

每个 FaceFamily 直接提供：

~~~text
child
youth
adult
elder
~~~

同一个居民一生保持同一个 FaceFamily，因此仍然能认出是同一个人。

增加脸型时，优先增加高质量 FaceFamily 资产，不增加新的运行时脸型算法。

---

## PresentationDNA

只保留：

~~~text
lifeStage
hairStyleId
outfitStyleId
hairColorStateId
~~~

### 玩家换发型 / 换衣服

默认外观由 Seed 生成。

游戏中玩家修改后，直接保存新的：

~~~text
hairStyleId
outfitStyleId
~~~

不重新运行复杂兼容算法。

财富只影响**初始衣服默认值**，不限制玩家之后能穿什么。

---

## HairStyle

Hair 已改为最终画布资产。

每个 HairStyle 只有：

~~~text
backLayer
frontLayer
allowed lifeStages
~~~

当前明确删除：

- Head Anchor；
- bunLow / skullTop 等 Hair 定位语义；
- placementByHeadProfile；
- inside-skull；
- outside-face；
- behind-head clip；
- side-hair 独立合同；
- accessory slot；
- 发簪 / 玉簪 / 红绳等 Accessory 系统。

层级只依靠：

~~~text
Back Hair
↓
Body / Outfit
↓
Face
↓
Face Detail
↓
Front Hair
~~~

美术看到头发应该在哪里，就直接在 120×150 画布上画在哪里。

如果同一种概念的发型在不同年龄需要不同位置，允许直接做不同 HairStyle 资产。

**允许适度重复资产，以换取美术可控性。**

---

## LOD

不再为 96 / 64 / 48 维护不同主体拓扑。

三档尺寸使用同一套 SVG 轮廓直接缩放。

原则：

- 48px 仍然能读出脸型和发型即可；
- 不为极小尺寸维护第二套复杂资产；
- 如果未来确有必要，只允许少量 detail 层隐藏，不改变主体结构。

---

## Population Diversity

V8.3 的 PopulationDiversityController 已取消。

不再根据：

~~~text
最近出现的发型
当前人口缺口
targetShare
~~~

动态改变居民结果。

V8.4 使用：

~~~text
residentSeed
→ age-compatible HairStyle
→ weightedPick
~~~

重复感优先通过增加更好的 Face / Hair / Outfit 美术资产解决。

这也避免居民解析顺序改变头像结果。

---

## Accessory

V8.4 暂时完全取消头像配饰系统。

原因：

- 头像不是核心玩法；
- 发簪 / 玉簪 / 红绳带来额外定位、穿插、遮挡问题；
- 当前美术收益不足以覆盖系统成本。

未来如果配饰成为明确需求，再按实际资产量重新设计。

不要提前恢复通用 Accessory Slot。

---

## Compatibility

删除通用 Compatibility Result / reasons / multiplier。

Hair 只检查：

~~~text
lifeStage 是否允许
~~~

Outfit 默认生成只检查：

~~~text
wealthTier
~~~

玩家主动换衣服时可以直接指定 OutfitStyle。

---

## Asset QA

V8.4 不再用“必须有多少 Mask / Anchor / Placement”判断资产是否合格。

自动检查只负责：

- ID 存在；
- RenderPlan 能构建；
- Identity 稳定；
- 6 个 FaceFamily 能渲染；
- 4 个首批 HairStyle 能渲染；
- 24 人 Seed 样本可稳定生成。

真正的美术质量继续由截图人工 Review：

- 脸型是否好看；
- 年龄是否清楚；
- 头发是否自然；
- 衣领 / 肩颈是否成立；
- 48px 是否仍然能认；
- 城市居民整体是否重复。

**美术优先于架构复用率。**

---

## 当前主动删除的代码

V8.4 删除：

- identity-morphology.ts
- head-profile.ts
- compatibility.ts
- population-diversity.ts
- asset-audit.ts
- asset-bundle.ts

Renderer 也不再创建 Hair clipPath / mask。

---

## Unity 输入

未来 Unity 正式实现只建议带走这些概念：

- resident stable ID；
- deterministic seed；
- FaceFamily ID；
- HairStyle ID；
- OutfitStyle ID；
- Skin / Hair palette ID；
- life-stage art variant。

不要直接移植 Web V8.1～V8.3 的 Anchor / Mask / Compatibility 系统。

最终原则：

> **简单、稳定、好看，比高度通用更重要。**
