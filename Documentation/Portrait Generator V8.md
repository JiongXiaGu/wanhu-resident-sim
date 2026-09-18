# Portrait Generator V8 / V8.1 / V8.2

## 定位

V7 仍是当前木刻美术基线。

V8/V8.1 是头像生成算法与资产生产管线实验，不代表未来 Unity ECS / Save / Asset Pipeline 的最终实现。

入口：

~~~text
/?view=portrait-v8
~~~

## V8 已完成的算法分层

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
Generic Renderer
~~~

### IdentityDNA

长期身份：

- faceFamilyId
- featureSetId
- skinPaletteId
- baseHairColorId
- bodyFrameId
- distinguishingTraitIds

### PresentationDNA

随人生变化：

- lifeStage
- wealthTier
- presentationStyle
- hairBundleId
- outfitBundleId
- accessoryAssetId
- ageOverlayId
- hairColorStateId

财富变化不得重新生成 IdentityDNA。

## V8.1 新增：Identity Morphology

仅保持 FaceFamily 不足以让玩家认出“这是同一个人变老”。

V8.1 将一组连续形态参数写入 IdentityDNA：

~~~text
faceWidthScale
featureSpanScale
noseLengthScale
mouthWidthScale
~~~

这些参数由 identity keyed seed 决定，儿童、青年、成年和老人阶段都复用。

HeadProfile 负责年龄阶段总体轮廓。

Identity Morphology 负责“这个人自己的脸部比例”。

因此：

~~~text
Base Identity Morphology
+
LifeStage HeadProfile
+
Age Overlay
=
同一个人的年龄演化
~~~

## V8.1 新增：真正的局部坐标资产

V8 初版的 Hair Bundle 虽然有 placementByHeadProfile，但 SVG 仍大量使用整张 120×150 画布的绝对坐标。

V8.1 的正式 Hair Layer 支持：

~~~text
coordinateSpace = anchor-local
anchor = skullTop / bunLow / crownBack ...
~~~

例如成年低髻：

~~~text
bun geometry
local origin = bunLow (0,0)
↓
HeadProfile adult bunLow = (86,70)
HeadProfile elder bunLow = (84,73)
↓
placementByHeadProfile
↓
RenderPlan
~~~

发髻资产自身不再知道整张头像坐标。

## V8.1 新增：Mask / Occlusion 真正进入 Renderer

VectorLayerAsset 新增 maskMode：

~~~text
none
behind-head
inside-skull
outside-face
ear-front-left
ear-front-right
~~~

当前规则：

### Back Hair

~~~text
maskMode = behind-head
~~~

后发和发髻在脸后方，并限制在 HeadProfile 的 behindHead 区域。

### Front Hair

~~~text
maskMode = inside-skull
~~~

额前头发必须落在 skull mask 内。

### Side Hair

~~~text
maskMode = outside-face
~~~

Renderer 使用 faceKeepout mask 将进入脸中心区域的侧发裁掉。

这不是 metadata。

V8.1 Renderer 实际生成 SVG clipPath / mask 并应用到每个 RenderLayer。

## V8.1 新增：Accessory Slot

簪子不再使用整张头像绝对坐标。

AccessoryAsset 可以针对 Hair Bundle 定义：

~~~text
placementByHairBundle
  hair.female.adult-low-bun.v1
    anchor = bunLow
~~~

木簪、玉簪因此跟随发髻移动。

HeadProfile 改变 bunLow 后，簪子也跟随移动，不再横穿脸。

## 成年低髻作为第一份正式基准

V8.1 不继续盲目扩资产。

优先把：

~~~text
hair.female.adult-low-bun.v1
~~~

作为 Rendering Contract 基准。

它必须同时满足：

- local-space bun geometry
- bunLow anchor
- behind-head mask
- inside-skull front hair
- outside-face side hair
- accessory slot
- adult HeadProfile placement
- elder HeadProfile placement
- 96 / 64 / 48 LOD

发髻主体增加与后脑相连的 bridge geometry，不再只是一颗独立圆球。

## 首批四个正式 Hair Bundle

当前：

- hair.female.girl-double-bun.v1
- hair.female.young-halfbound-backfall.v1
- hair.female.adult-low-bun.v1
- hair.female.elder-gray-low-bun.v1

四者都使用 Generic Renderer。

Renderer 不根据 Hair ID 写造型条件。

## LOD

VectorLayerAsset 可以声明：

~~~text
lods = [96,64,48]
~~~

例如 side hair 和发髻内部细节可只在 64/96 出现。

48px 只保留重要轮廓。

## Population Diversity

城市级最终权重仍为：

~~~text
baseWeight
× compatibility
× localNovelty
× populationDeficit
~~~

这是 soft pressure，不是硬配额。

## Save Contract

当前原则：

~~~text
Seed
→ 用于首次生成

Resolved Stable IDs + Identity Morphology + generatorVersion
→ 用于保存结果
~~~

未来增加新资产或修改权重，不应让旧居民整体换脸。

## Web V8.1 审查页

当前页面必须验证：

1. 财富变化 Identity 与 Hair 不变；
2. 年龄变化 Identity Morphology 不变；
3. 同一个 FaceFamily 跨 child / youth / adult / elder HeadProfile；
4. 成年低髻在 adult / elder 两个 HeadProfile 上使用同一 Bundle；
5. Hair Layer 实际存在 masked layer；
6. Hair / Accessory 实际使用 local placement；
7. 四个 Hair Bundle 共用 Generic Renderer；
8. 96 / 64 / 48 LOD；
9. 64 人 Population Diversity；
10. 所有背景无 Halo。

## Visual QA Gate

从 V8.1 开始，头像代码不能只凭 Build 合并。

正确顺序：

~~~text
TypeScript / Vite Build
↓
真实部署
↓
实际页面截图
↓
人工视觉 Review
↓
确认无漂浮发髻 / 穿脸 / 黑披风 / 文化语义错误
↓
才能合 main
~~~

如果 GitHub Actions screenshot runner 无法启动，应使用其它方式获取真实部署截图，而不是跳过 Visual Review。

## 当前限制

V8.1 仍然只迁移女性第一批资产。

接下来再迁移：

- 更多女性正式发型；
- 男性 Hair / Beard Bundle；
- 更多 FaceFamily；
- 家庭相似度；
- 更连续的年龄 morphology；
- Outfit / Accessory 的正式 Asset Bundle；
- 更大规模 Population QA。

## Unity

V8.1 的以下概念可作为未来 Unity 设计输入：

- Stable ID
- Identity / Presentation 分离
- keyed seed
- Identity Morphology
- HeadProfile
- Asset Bundle
- Mask / Occlusion
- LOD
- Population Diversity
- Resolved DNA

但 Unity ECS Component、BlobAsset、Save Binary、RuntimeIndex、SpriteAtlas、Addressables 等仍应进入正式游戏工程后重新设计。


## V8.2：首批 Hair Bundle 正式资产契约

V8.1 首先把成年低髻作为 Rendering Contract 基准。

V8.2 将同样的要求扩展到首批全部 4 个正式 Hair Bundle：

- hair.female.girl-double-bun.v1
- hair.female.young-halfbound-backfall.v1
- hair.female.adult-low-bun.v1
- hair.female.elder-gray-low-bun.v1

### Asset Audit

新增 asset-audit.ts。

每个 Hair Bundle 必须自动满足：

- 所有 Hair Layer 使用 anchor-local；
- 所有 Hair Layer 声明 anchor；
- back-hair 使用 behind-head；
- front-hair 使用 inside-skull；
- side-hair 使用 outside-face；
- 所有 compatibleHeadProfiles 都存在 placement；
- 主要轮廓层必须包含 48px LOD；
- accessorySlots 中声明的配饰必须存在；
- 配饰必须声明该 Hair Bundle 的 placement。

任何一项失败，该 Hair Bundle 不能进入正式资产池。

### 女童双小髻

V8.2 不再使用两个独立圆球。

双髻本体改成不规则髻体，并增加与头顶连接的束发根部。

红绳通过 skullTop accessory slot 定位。

额前发与短鬓发继续使用 skull / face keepout mask。

### 少女半束后披

V8.1 的后发仍容易形成一整块对称黑色披风。

V8.2 将后发拆成：

- 顶部半束小髻；
- 左侧后披发量；
- 右侧后披发量；
- 96px 才显示的轻量发丝节奏。

中间颈后不再被整块黑色填满。

左右轮廓允许轻微不对称。

### 成年低髻

继续作为主基准。

当前要求：

- bunLow 局部原点；
- 后脑收发连续进入髻体；
- 髻体不作为独立圆球；
- 侧发只保留短鬓；
- 盘绕线只在 64/96px 显示；
- 木簪 / 玉簪跟随 bunLow slot；
- adult / elder HeadProfile 使用同一个 Hair Bundle，不复制资产。

### 老年花白低髻

不再使用“灰色头盔 + 灰圆球”的两块结构。

V8.2 使用：

- 后脑收发连续进入低髻；
- 更小的老年髻体；
- hair-accent 专门用于花白刻线；
- 轻量短鬓；
- 64/96px 才显示花白细节。

hair-accent 与财富颜色解耦，避免老年白发纹理被 Outfit Accent 污染。

## V8.2 Contract Matrix

/?view=portrait-v8 新增正式 Hair Bundle Contract 区。

当前实际渲染 7 个兼容组合：

- 女童双小髻：child
- 少女半束后披：young-adult
- 少女半束后披：adult
- 成年低髻：adult
- 成年低髻：elder
- 花白低髻：middle-age
- 花白低髻：elder

同一 Hair Bundle 在不同 HeadProfile 上只允许通过 placement 调整。

不允许复制一份新的绝对坐标发型。

## V8.2 自动验收

页面和截图脚本必须检查：

1. renderContractVersion = 8.2；
2. 4 个 Hair Bundle Audit 全部 PASS；
3. 正式 Hair Contract 样本 = 7；
4. 每个 Contract Sample 真正使用 Mask；
5. 每个 Contract Sample 真正使用 Local Placement；
6. 半束后披跨 youth/adult HeadProfile；
7. 成年低髻跨 adult/elder HeadProfile；
8. 花白低髻跨 adult(middle-age)/elder HeadProfile；
9. 4 个 Bundle 继续提供 96/64/48 LOD；
10. 64 人 Population Diversity 继续存在。

## Visual QA

V8.2 的人工视觉审查优先级：

1. 女童双髻必须像扎起的小髻，不像两个贴上去的球；
2. 半束后披不能形成左右对称的整块黑披风；
3. 成年低髻不能像耳后徽章或独立圆球；
4. 花白低髻不能像灰帽子；
5. Accessory 不得穿脸；
6. 48px 下只保留关键轮廓，不保留碎发噪声。

