# Portrait Art Kit V1

## 1. 目标

Portrait Art Kit V1 用于把当前 Web 程序头像推进到“正式方向原型”。它不是最终 Unity 资源格式，也不要求 Web SVG 成为正式游戏渲染方案。

本轮固定的美术方向：

```text
扁平古风 + 轻纸片拼贴感
```

核心阅读顺序：

```text
脸与发型先认人
↓
衣领与肩线看生活条件
↓
少量头饰 / 配饰提气质
↓
年龄细节补充人生阶段
```

明确避免：

- 写实肖像；
- 大头 Q 版；
- 网红化女性脸；
- “职业 = 制服 / 官帽 / 工匠服”的图标化设计；
- 通过高饱和颜色表达富裕；
- 通过污渍表达贫寒。

整体色彩保持低饱和、克制、温润。

---

## 2. 美术母版与 1:1 Safe Area

### 2.1 正式源文件

所有正式头像模块统一使用：

```text
Master Canvas: 1024 × 1280
Aspect Ratio: 4:5
Transparent Background
```

Web 原型使用完全等价的归一化坐标：

```text
120 × 150
```

这只是缩放后的同一套构图规范。

### 2.2 1:1 Safe Area

4:5 母版中固定一个居中的 1:1 安全区：

```text
Source Safe Area
x = 0 .. 1024
y = 128 .. 1152
size = 1024 × 1024
```

Web 对应：

```text
x = 0 .. 120
y = 15 .. 135
size = 120 × 120
```

普通居民 UI 仍以 1:1 圆角方形头像为主，等价于从 4:5 母版中裁取上述安全区。

### 2.3 必须留在 Safe Area 内

- 脸与主要五官；
- 主发型轮廓；
- 发际线；
- 胡须主体；
- 主要衣领；
- 主要肩线。

### 2.4 可以突破 Safe Area

- 发髻顶端；
- 发簪 / 发钗末端；
- 长发末端；
- 辫子末端；
- 少量肩线和上胸延伸。

突破安全区的内容必须是“即使被 1:1 裁掉一部分仍然成立”的次要延伸，不能把识别人所需的关键轮廓放到裁切区外。

---

## 3. 胸像构图

统一采用近正面的半身胸像：

- 头部占 1:1 Safe Area 高度约 60%～65%；
- 肩宽目标约 2 个头宽；
- 允许极轻微的不对称，不做明显侧脸；
- 显示头部、颈部、肩膀和少量上胸；
- 眼鼻口保持在小尺寸头像中可读；
- 发型和衣领负责第一眼轮廓，而不是依赖细小纹样。

48×48 / 64×64 / 96×96 下仍应成立。

---

## 4. 分层顺序

正式语义层级：

```text
Background
↓
Back Hair
↓
Body / Outfit
↓
Neck
↓
Face Base
↓
Brow / Face Detail
↓
Front Hair
↓
Facial Hair
↓
Headwear / Accessory
↓
Age Overlay
```

### Back Hair

Back Hair 是本轮重点。女性长发、辫子、低髻等必须允许延伸至：

- 脸两侧；
- 肩膀外侧；
- 上胸区域。

不允许把“女性长发”只表现成头顶多一个发髻。

### Front Hair

Front Hair 负责：

- 发际线；
- 额前结构；
- 少量脸侧垂发；
- 与头饰的前后遮挡关系。

Front Hair 不承担整张长发轮廓。

### Outfit

Outfit 先用领口、厚度、肩线和完整度表达生活条件，不按职业做制服。

---

## 5. PortraitRig 锚点

每个 Face Base 同时交付一套 PortraitRig：

```text
centerX
 topY
 hairlineY
 browY
 eyeY
 noseY
 mouthY
 chinY
 faceWidth
 jawWidth
 earY
 neckTopY
 shoulderY
```

Rig 只描述构图锚点，不描述最终 Unity Runtime 数据结构。

硬规则：

```text
topY < hairlineY < browY < eyeY
 eyeY < noseY < mouthY < chinY
 neckTopY < shoulderY
 jawWidth <= faceWidth
```

脸、下巴和主要肩线必须位于 1:1 Safe Area 内。

发型、胡须、帽子和服装围绕 Rig 制作，不维护“某个脸 + 某个胡须”的组合 Offset 表。

---

## 6. 资源标签

现有内容契约不新增一套重复的 `genderFit / ageFit / wealthFit` 字段，直接使用已经存在的正式语义：

```text
genderFit        → genders
ageFit           → lifeStages
wealthFit        → wealthTiers
presentationFit  → presentationStyles
weight           → weight
```

本轮新增并要求 Hair / Outfit 必填：

```text
silhouetteType
```

示例：

```json
{
  "id": "appearance.hair.female-braid-01",
  "slot": "hair",
  "genders": ["female"],
  "lifeStages": ["teen", "young-adult", "adult", "middle-age"],
  "wealthTiers": ["plain", "comfortable", "wealthy"],
  "presentationStyles": ["tidy", "refined"],
  "silhouetteType": "female-braid-long",
  "weight": 5
}
```

标签用于“在合理池中抽取”，而不是无约束随机。

---

## 7. 命名规则

Stable ID 继续使用：

```text
appearance.<slot>.<semantic-name>
```

例如：

```text
appearance.face.female-youth-01
appearance.hair.female-long-straight-01
appearance.hair.female-married-bun-01
appearance.outfit.female-comfortable-layered-01
appearance.headwear.refined-hairpin-01
```

规则：

- ID 表达稳定的外观语义，不表达某张 Web SVG 文件；
- 不把职业写进可筛选条件；
- 允许名称描述“营生感 / 家居感”，但不与职业系统绑定；
- 已发布 Stable ID 不因换美术文件而随意改名。

---

## 8. Portrait Art Kit V1 资产清单

### 8.1 女性 Face Base

V1 至少覆盖：

```text
青年女脸 × 2
成年女脸 × 2
中老年女脸 × 2
```

现有通用女性脸继续保留，因此实际候选数可以高于 6。

差异优先来自：

- 下颌宽窄；
- 面中长短；
- 眉眼比例；
- 颈肩节奏；
- 年龄 Overlay。

不通过夸张眼睛、口红或极细下巴制造性别区分。

### 8.2 女性 Hair

V1：

```text
长直发 × 2
长发后束 × 1
单侧垂发 × 1
单辫 × 1
双辫 × 1
盘发 × 1
低髻 × 1
已婚收束发髻 × 1
年长收束发 × 1
```

至少一半必须具有明显 Back Hair。

### 8.3 女性 Outfit

V1 需要覆盖：

```text
贫寒劳作型布衣
普通朴素常服
普通整洁家居装
殷实叠领装
讲究营生女子常服
富裕家庭多层装
```

“营生女子”只是生活气质资源，不绑定商贩职业。

### 8.4 男性补充

Hair：

```text
短发 / 短束发
束发
高束发
中年收束发
老年发量减少型
```

Facial Hair：

```text
短髭
细长髭
胡茬
短须
中年整须
老年长须
老年稀疏须
```

### 8.5 头饰 / 配饰

第一批：

```text
布巾
发带
素簪
简钗
小头巾
朴素遮阳笠
稍讲究发饰
细布冠帽
```

它们表达生活状态和讲究程度，不承担官职系统。

---

## 9. 财富服装层次

### 贫寒 poor

- 单层领口；
- 肩线简单；
- 布料色素雅；
- 几乎无配件。

### 普通 plain

- 基础单 / 双层领口；
- 轮廓整洁；
- 配色稳定但不讲究。

### 殷实 comfortable

- 领口更厚；
- 叠层更完整；
- 少量滚边 / 配件；
- 配色更协调。

### 富裕 wealthy

- 多层领口；
- 上衣结构完整；
- 发饰 / 簪饰出现率提高；
- 通过协调、材质和结构表达富裕，而不是提高饱和度。

贫寒也不是“脏”，只是更素、更简。

---

## 10. 调色板 V1

### Skin

```text
浅暖
中浅暖
偏深暖
较深褐
```

统一偏暖，不做冷白肤色。

### Hair

```text
乌黑
深棕黑
棕黑
深褐
灰黑
花白
银灰
```

灰发由 LifeStage 进入候选池，不把所有老人强制变成纯白发。

### Clothing

主色集中在：

```text
麻白
土黄
灰褐 / 灰棕
深褐
青灰
靛青
墨绿
藕灰
暗红
```

所有颜色保持低饱和。

---

## 11. Resolver 与同屏轮廓策略

Resolver 输入：

```text
Gender
LifeStage
Household.WealthTier
Household.PresentationStyle
```

流程：

```text
合法候选池
↓
Face Family compatibility
↓
Silhouette recent-history penalty
↓
Weighted pick
```

职业不进入外观候选池。

同一批居民生成时维护最近的 Hair `silhouetteType`：

- 最近 1～2 个同轮廓：强降权；
- 最近 3～4 个：中度降权；
- 最近 5～8 个：轻度降权；
- 最近没有出现：略微加权。

Portrait Lab 会更积极地从最近 4 个未出现的轮廓中优先挑选，以便人工查看差异。

这不是全局唯一约束。城市居民数量扩大后仍允许重复，只避免玩家连续看到一串几乎相同的头型。

---

## 12. Web 验证方式

入口：

```text
/?view=portraits
```

页面一次展示 64 人，并同时检查：

- 1:1 实际头像；
- 4:5 美术母版；
- PortraitRig Safe Area；
- Back Hair / Front Hair 独立开关；
- 年龄 Overlay；
- Hair silhouette；
- 财富 / 讲究程度；
- Rig 硬错误；
- 相邻轮廓重复。

第一屏固定保留女性四档财富与中老年女性样本，避免每次随机都无法直接比较关键情况。

---

## 13. Web → Unity 迁移语义

需要迁移：

```text
AppearanceDNA Stable ID
Gender / LifeStage fit
WealthTier / PresentationStyle fit
silhouetteType
PortraitRig / Safe Area
Back Hair / Front Hair 分层语义
Headwear hairVisibility
Palette ID 与区域 Mask 语义
同屏轮廓去重策略
```

不迁移：

```text
React 组件
SVG Path
Web CSS
Web generated JSON 的具体 Runtime 布局
```

Unity 可重新映射为 SpriteAtlas、2D 分层 Sprite、Mesh、Material 或 3D 模块化居民。

---

## 14. V1 验收标准

1. 4:5 母版与 1:1 Safe Area 明确且可视化；
2. 方形头像中脸、主要发型、主要衣领和胡须不被破坏性裁切；
3. 女性长发 / 辫子 / 盘发能够明显改变外轮廓；
4. 女性不再主要依赖“没有胡须”来区分；
5. 贫寒、普通、殷实、富裕能通过领口和完整度读出层次；
6. 富裕不依赖高饱和色，贫寒不依赖脏污；
7. 64 人默认样本 PortraitRig 硬错误为 0；
8. 同屏 Hair silhouette 的相邻重复明显减少；
9. 女性不会生成胡须，未成年不会生成不合理胡须；
10. 职业仍不参与头像服饰 Resolver；
11. Stable ID 语义可以直接迁移到未来 Unity 表现层。
