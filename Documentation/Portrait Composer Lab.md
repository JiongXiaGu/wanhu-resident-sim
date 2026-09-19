# 居民头像 DIY / Portrait Composer Lab

## 当前定位

入口：`/?view=portrait-composer-lab`。居民首页、正式头像工作台和画风研究页都有入口。

这是**真实分层组合的成年居民实验**，不是把不同的完整角色稿当成换装，也不是已经定稿的正式头像系统。美术采用温润、克制的插画方向，但仍需玩家确认。旧的三组完整角色研究保留，不再冒充 DIY 资产。

本实验不读取或修改居民 Snapshot、正式 Portrait Catalog、五字段 ResidentPortraitDNA、六个正式 PortraitFrame 或正式 RenderPlan。`headwearStyleId` 和 `outfitPaletteId` 只存在于实验配方，不是给正式 Runtime 悄悄加字段。

## 可以体验什么

- 成年女性 / 成年男性；每类四套完整 FaceFamily。
- 每类六个发型；发型 ID 独立于帽子。
- 不戴帽、布巾、幞头、斗笠、金冠，共五个选择（四种帽饰）。
- 六套完整服饰：交领布衣、市井外搭、宽襟长衫、圆领袍服、锦绣披帛、礼仪华服。
- 四组肤色、四组发色、四组衣服配色；衣服不与职业或面容绑定。
- 锁定面容/肤色的随机搭配、随机人物、重置。
- 本浏览器自动保存；JSON 导入/导出；复制含配方的组合链接。
- 256 方形透明 SVG、512 方形透明 PNG 导出。
- 当前头像、96/64/48 CSS px 原尺寸预览、纸白/暮色衬底。
- 同脸换发型、同脸换帽子、同脸换衣服、六发型×五帽饰对照、固定种子的 24 人居民样本。

切换成年男女时使用对应 Frame 的脸，不宣称跨性别仍是同一张脸。儿童与老人尚未开放；银灰发色也不等于已经实现老年 FaceFamily。

## 实验配方与数据隔离

代码：`Web/src/portrait-composer-lab/`。

```text
model.ts                 选项白名单、配方验证、种子随机
art/drawing.ts           SVG 基元与配色
art/faces.ts             八张完整面容、固定颈部
art/hair.ts              六种发型的固定层与收发状态
art/headwear.ts          帽饰前后层
art/outfits.ts           六套服饰的完整肩线与领口
render.ts                固定组合顺序、SVG/PNG 导出
PortraitComposerLab.tsx  玩家交互与组合对照
composer.css             只作用于 pc-* 的实验样式
```

配方字段：

```text
version: 1
frame: female.adult | male.adult
faceFamilyId
hairStyleId
headwearStyleId
outfitStyleId
skinPaletteId
baseHairColorId
outfitPaletteId
```

存储键：`wanhu.portrait-composer.v1`。数据只保存在当前浏览器，清除站点数据会丢失；跨设备使用导出配方或组合链接。链接仅携带这些白名单选项，不上传图片。打开分享链接后继续编辑，地址中的配方会随编辑同步，刷新不会退回旧组合。

JSON 导入限制 8 KB，验证版本、字段与全部 ID；无效导入显示错误并保留当前组合。禁用 localStorage 或剪贴板时提供明确提示/链接文本导出，不阻断 DIY。

## 固定画布与组合方式

实验画布和裁切都固定为 `0 0 256 256`。这**不同于**正式系统的 `120×150` 画布和固定方形裁切；目前不能直接把实验资产填进正式 art-manifest。

各部件按同一实验 Frame 直接作画。运行时没有 Anchor、Offset Solver、Mask、ClipPath 或自动缩放适配。脸型与五官作为完整 FaceFamily 一起替换，不能单独拼眼睛鼻子。

实验图层顺序：

```text
BackHeadwear
BackHair
HairVolume
Neck
Outfit
Face
FrontHair
FrontHeadwear
```

导出的 SVG 使用 `data-layer` 标出图层，颜色已展开，不依赖网页 CSS、外链图片或字体。这个拆分便于后续离线导出，但不等于 Unity 已经验证可直接导入。

## 帽子不是另一个发型 ID

帽饰只规定两种固定佩戴规则：

- `open`：不戴帽 / 金冠，保留完整发髻。
- `tucked`：布巾 / 幞头 / 斗笠，收起顶部发髻，保留发际与下部发束；帽体覆盖头顶部。

选择帽子只改变 `headwearStyleId`。摘帽后用相同 `hairStyleId` 恢复完整上部发髻，不改脸、不改服饰，也不在后台切成另一个发型。封闭帽下不同发型可能看起来更接近，这是遮挡造成的，不应算成额外视觉唯一性。

这不是通用帽子兼容引擎。未来新帽子若不适配现有固定坐标，必须补绘/修正资产或明确限制组合，不能新增偏移补丁。

发色会同步改变眉色；换发型、帽子、服装本身不会改变 Face 图层。衣服配色也控制布巾配色，金冠与斗笠保留自身材质色。

## 验收要求

Resident Visual Review 在原有居民玩法、正式头像和完整研究稿验收之后运行 `scripts/capture-composer.mjs`。

自动检查：

- 与正式 Runtime / 历史美术隔离。
- 2 Frame × 4 Face × 6 Hair × 5 Headwear × 6 Outfit = **1,440 个基础几何组合**的合法 SVG、固定画布和 Face 层不变。
- 上述数字是参数组合数，不是 1,440 张肉眼互不相似的人像，更不代表每个组合都已经人工审美通过。
- 戴帽/摘帽实际交互保持脸和发型 ID，并恢复相同 SVG。
- 每张脸对应完整 6×5 发型帽饰矩阵；八张截图共 240 个实际渲染样本。
- 桌面和移动端的 96/64/48 CSS px 不被拉伸。
- 随机不改原对象、锁定身份、种子复现、有效配方与无效配方处理。
- 浏览器自动保存、分享链接/编辑后刷新、PNG/SVG/JSON 实际下载与导入。
- 原有居民故事连续性和正式头像验收继续保留，不因实验替换或放宽。

原始截图、导出文件与机器检查报告放在 Actions `resident-visual-review` Artifact 的 `composer/` 子目录，不经过旧预览缩图脚本。必须下载并实际检查：主页面、同脸三类换装、发型帽饰矩阵、小尺寸、夜间与移动端。自动绿色不代表头像美术通过。

## 后续边界

本次没有完成儿童/老人三阶段血缘一致性、全部玩家组合审美、万人缓存策略或 Unity 引擎内导入。先根据本实验体验决定是否保留独立帽饰，再为正式六 Frame 重新绘制入选资产，单独讨论正式 DNA 是否增加帽饰字段；不要因此重构冻结 Runtime。
