# Portrait Generator V8

## 定位

V8 是居民头像生成算法的架构实验，不替代当前 Woodblock Portrait V7 美术基线，也不是未来 Unity Runtime / ECS / Save 的最终实现。

V8 只验证一件事：

> 《万户天工》的头像系统能否在“同一个人长期可识别”和“整座城市几千居民整体自然”之间建立稳定的生成规则。

## 核心变化

### IdentityDNA 与 PresentationDNA 拆分

IdentityDNA 保存长期身份：

- faceFamilyId
- featureSetId
- skinPaletteId
- baseHairColorId
- bodyFrameId
- distinguishingTraitIds

PresentationDNA 保存会随人生变化的表现：

- lifeStage
- wealthTier
- presentationStyle
- hairBundleId
- outfitBundleId
- accessoryAssetId
- ageOverlayId
- hairColorStateId

财富变化不得改变 IdentityDNA。

年龄变化允许改变 HeadProfile、HairStyle、AgeOverlay 和 HairColorState，但不能重新生成另一套 IdentityDNA。

## Keyed Seed Bank

V8 不再使用一个顺序随机流。

随机被拆成命名子流：

~~~text
portrait.identity.v1
├─ skin
├─ hair-color
├─ body-frame
└─ trait

portrait.presentation.v8
├─ hair
├─ outfit
└─ accessory
~~~

新增 Outfit Asset 不会影响 face / skin / hair 的既有选择。

## Resolved Appearance DNA

Seed 用于首次生成。

真正进入存档语义的是解析后的 Stable IDs：

~~~text
generatorVersion
identity
presentation
~~~

旧居民不需要因为权重、候选池或新资产加入而重新洗牌。

## HeadProfile

Identity 只保存 FaceFamily。

不同年龄阶段从同一个 FaceFamily 派生不同 HeadProfile：

~~~text
face-family.female.soft-oval-a
├─ head.female.soft-oval.child.v1
├─ head.female.soft-oval.youth.v1
├─ head.female.soft-oval.adult.v1
└─ head.female.soft-oval.elder.v1
~~~

HeadProfile 保存：

- anchors
- skull mask
- face keepout mask
- behind-head region
- ear front regions

因此“同一个人变老”不需要重新 roll 一张脸。

## Asset Bundle

V8 Renderer 不再根据 Hair ID 写条件分支。

正式发型定义为 HairStyleBundle：

~~~text
HairStyleBundle
├─ semantic compatibility
├─ silhouetteType
├─ baseWeight
├─ targetShare
├─ layerAssetIds
├─ placementByHeadProfile
└─ accessorySlots
~~~

首批迁移 4 个中国古代女性发式：

- hair.female.girl-double-bun.v1
- hair.female.young-halfbound-backfall.v1
- hair.female.adult-low-bun.v1
- hair.female.elder-gray-low-bun.v1

几何位于 VectorLayerAsset 中，Renderer 只消费 RenderPlan。

## Compatibility

Compatibility Solver 当前检查：

- gender
- lifeStage
- faceFamily
- headProfile
- wealthTier
- presentationStyle
- hair / accessory compatibility

不兼容资产直接退出候选池。

以后新增资产不应该新增 renderer if/else。

## Population Diversity Controller

普通头像库通常只保证：

~~~text
seed A -> avatar A
seed B -> avatar B
~~~

《万户天工》还必须保证一整座城市不出现明显模板化。

V8 使用软分布压力：

~~~text
FinalWeight
=
baseWeight
× compatibility
× localNovelty
× populationDeficit
~~~

localNovelty 压低最近连续出现的同一 Hair Bundle。

populationDeficit 根据 targetShare 与当前真实出现数量动态调整权重。

它不是硬配额，因此仍然保持随机感。

## LOD

V8 允许 VectorLayerAsset 指定 lods：

~~~text
96
64
48
~~~

例如：

- 96px 可以保留瞳点、发髻内部纹理、完整簪饰；
- 64px 去掉次级细节；
- 48px 只保留关键轮廓和身份信息。

不是把一张 SVG 强制等比缩小到底。

## RenderPlan

生成链：

~~~text
SemanticAppearanceContext
↓
Identity Resolver
↓
Presentation Resolver
↓
Compatibility
↓
Population Diversity
↓
ResolvedAppearanceDNA
↓
HeadProfile + AssetBundle
↓
RenderPlan
↓
Generic SVG Renderer
~~~

RenderPlan 明确包含：

- HeadProfile ID
- Stable DNA
- Palette
- Masks
- 已排好 z-order 的 RenderLayer
- 每层 transform
- LOD 后的 shapes

Renderer 本身不知道“低髻应该长什么样”。

## Web 验证页

入口：

~~~text
/?view=portrait-v8
~~~

当前验证：

1. 同一居民财富变化，Identity 与 Hair 不变化；
2. 同一居民从 child 到 elder，Identity 不变化；
3. 同一 FaceFamily 使用不同 HeadProfile 表现年龄形态；
4. 4 个正式 Hair Bundle 通过同一 Generic Renderer；
5. 96 / 64 / 48 LOD；
6. 64 人 Population Diversity；
7. generatorVersion = 8；
8. 页面仍保持无 Halo。

## 当前限制

V8 第一轮只迁移女性木刻资产。

这不是“系统只支持女性”，而是刻意控制迁移范围，用 4 个最容易暴露问题的发型先验证 Asset Bundle / HeadProfile / LOD / Population Controller。

V7 仍然是当前完整美术审查页。

V8 通过以后再迁移：

- 更多女性发型；
- 男性发型与胡须；
- 儿童更多 FaceFamily；
- Outfit Bundle；
- Accessory Slot placement；
- 更完整 Face Asset Bundle。

## 不作为 Unity Runtime Contract

V8 的 Stable ID、分层原则、Identity / Presentation 语义和生成不变量可以作为未来 Unity 设计输入。

但未来 Unity 的：

- ECS Component
- BlobAsset
- Save Binary
- RuntimeIndex
- SpriteAtlas
- Mesh / Material
- Addressables / Content Pipeline

都应在进入游戏工程时重新设计。
