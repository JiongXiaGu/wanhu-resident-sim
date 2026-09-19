# 居民头像 DIY / Portrait Composer Lab

## 当前定位

入口：`/?view=portrait-composer-lab`。居民首页、正式头像工作台和画风研究页都有入口。

这是**真实分层组合的成年居民实验**，不是完整角色稿切换，也不是已经定稿的正式头像系统。当前重点是不同面孔共享同一套头发、帽饰、服装，不是只给一张脸做换装。

不读取或修改居民 Snapshot、正式 Portrait Catalog、五字段 ResidentPortraitDNA、六个正式 PortraitFrame 或正式 RenderPlan。`headwearStyleId` 和 `outfitPaletteId` 仅属于实验配方。

## 可体验内容

- 成年女性 / 成年男性，每类 **8 套完整 FaceFamily，共 16 张脸**。
- 现有 `gentle / bright / steady / keen` ID 保留；新增 `round / long / square / heart`，显示为宽圆、修长、方颌、心形。男女分别作画，不把女性脸换颜色作为男性脸。
- 每类 6 个发型；不戴帽、布巾、幞头、斗笠、金冠，共 5 个帽饰选项；6 套衣服。
- 每一张脸都能使用同 Frame 的全部发型、帽饰与衣服，选脸不触发自动换装，也不存在某张脸的专属服装限制。
- 肤色、发色、衣服配色各 4 组；换发色会同步改变眉色。
- 锁定面容与肤色后随机搭配，或者取消锁定生成新的成年人组合。
- 本浏览器自动保存；JSON 导入/导出；复制组合链接；256 方形透明 SVG、512 方形透明 PNG 导出。
- 当前头像的 96/64/48 CSS px 原尺寸预览，纸白/暮色衬底。

界面默认打开“面容”和“全部脸型”。玩家可以在大对照卡片上直接选择一张脸，不必只从小缩略图猜差异。

## 对照页分别验证什么

| 对照 | 改变的选项 | 不变的选项 |
| --- | --- | --- |
| 全部脸型 | 8 个 FaceFamily | 同一发型、帽子、衣服和配色 |
| 同脸换发型 | 6 个 HairStyle | 面容、帽子、衣服和配色 |
| 同脸换帽子 | 5 个 Headwear | 面容、保存的发型 ID、衣服和配色 |
| 同脸换服饰 | 6 个 Outfit | 面容、发型、帽子和配色 |
| 发型 × 帽子 | 6 × 5 个搭配 | 当前面容、衣服和配色 |
| 脸型 × 服饰 | 8 × 6 个搭配 | 发型、帽子和配色 |
| 24 位居民 | 全部 16 张脸加固定种子配装 | 展示种子固定，可复现 |

“全部脸型”中每张脸同时显示 96/64/48 原尺寸样本。桌面“脸型 × 服饰”按脸型逐行、服饰逐列排列；窄屏改为卡片流，卡片同时标明脸型和衣服。

24 人展示采用分层覆盖，确保每张脸都出现，再用种子搭配衣装；它不是自然人口随机分布。玩家随机搭配仍使用完整目录随机，测试另用 512 个种子检查覆盖，不能用人工覆盖展示墙证明随机算法没有遗漏。

## 美术与组合原则

每张 FaceFamily 拥有完整轮廓、眉眼、鼻口和神态，不允许把一个通用五官层贴到不同轮廓上。新增面容分别改变面颊宽度、下颌转折、脸长感、眼形和口形，不靠肤色差异充数。

头顶/太阳穴/耳根/颈部接口服从同一个成年 Frame。下颌可以不同，头发与衣服不为某张脸运行时平移、缩放或拉伸。不同脸共享配件是双向约束：

```text
换发型、帽子、衣服 → Face 图层不变
换 FaceFamily → Hair、Headwear、Outfit、Neck 图层不变
```

美术问题应通过修正资产解决，不添加每脸偏移表或自动对齐引擎。

## 目录与配方

```text
Web/src/portrait-composer-lab/
  model.ts                 选项白名单、配方验证、种子随机与展示样本
  art/drawing.ts           SVG 基元与配色
  art/faces.ts             既有面容与完整面容选择、固定颈部
  art/expanded-faces.ts    新增男女各四张完整面容
  art/hair.ts              发型固定层与收发状态
  art/headwear.ts          帽饰前后层
  art/outfits.ts           完整肩线和领口
  render.ts                固定图层组合、透明导出
  PortraitComposerLab.tsx  玩家交互与组合对照
  composer.css             pc-* 实验样式
  face-proofs.css          脸型矩阵与原尺寸对照
```

配方仍为 v1：

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

存储键不变：`wanhu.portrait-composer.v1`。新增合法 Face ID 不删除旧 ID，也不改变旧字段和已有面容美术，原有配方仍能导入。链接仅保存白名单选项，不上传图片；编辑分享链接后会同步地址中的配方，刷新不会退回旧状态。

JSON 导入限制 8 KB，验证版本、字段和 ID；失败时保留当前组合。禁止 localStorage 或剪贴板时显示提示或降级为链接文本导出，不阻断 DIY。

## 固定画布与佩戴规则

所有实验资产直接画在 `0 0 256 256`，不使用 Anchor、Offset Solver、Mask、ClipPath 或自动缩放适配。这个画布不同于正式系统的 `120×150` 和固定方形裁切，不能直接填入正式 art-manifest。

```text
BackHeadwear → BackHair → HairVolume → Neck
→ Outfit → Face → FrontHair → FrontHeadwear
```

导出的自包含 SVG 用 `data-layer` 标记图层，颜色已展开，不依赖网页 CSS、字体或外链图片。这便于后续离线处理，但不代表 Unity 导入已经验证。

帽饰只规定两种预绘佩戴状态：

- `open`：不戴帽 / 金冠，保留完整发髻。
- `tucked`：布巾 / 幞头 / 斗笠，收起顶部发髻、保留发际及下部发束。

换帽子只改 `headwearStyleId`；摘帽恢复同一 `hairStyleId` 的完整发髻。封闭帽下不同发型看起来相近是遮挡结果，不能把参数数目当成肉眼唯一头像数量。布巾随衣服配色，金冠与斗笠保留材质色。

## GitHub Actions 验收

原有居民故事连续性、正式头像和三组独立研究稿验收保留。Resident Visual Review 继续调用 `audit-composer-randomness.mjs` 和 `capture-composer.mjs`；后者调用 `capture-composer-faces.mjs` 增加脸型验证。

自动检查包括：

- **2 × 8 × 6 × 5 × 6 = 2,880 个基础几何组合**合法、固定画布、没有适配求解器，并验证上述双向图层不变性。
- 同一配色下 16 个完整 Face 内容独立，每个性别 8 条不同面部轮廓；这是重复检查，不是审美分数。
- 全部 16 张脸逐一输出 6×5 发型帽饰矩阵，**480 个实际渲染样本**。
- 男女“全部脸型”总览，共 **48 个原尺寸样本**；男女脸型×服饰矩阵共 **96 个样本**。
- 逐脸键盘选择，确认配件未被替换；真实戴帽/摘帽、锁定身份随机、透明导出。
- 旧配方及新增 Face ID 的真实导入和刷新恢复、无效导入保护、分享与编辑后刷新。
- 独立的 512 种子目录覆盖测试；每张脸的 100 次锁脸随机检查。
- 390px、320px 布局和原尺寸图不被压缩；无浏览器错误。

原始截图在 `resident-visual-review` Artifact 的 `composer/`，不经过旧缩图脚本。`face-exports/` 提供 16 份当前运行时生成的透明 SVG/PNG 与配方；它们是方便查看的组合样本，不是固定整图资产库。

必须下载并实际查看总览、全部新增脸的发型帽饰矩阵、衣领接口、小尺寸、深浅衬底和移动端截图。**自动绿色、参数数量和 PNG 哈希互不相同，都不能代替美术审查。**

## 尚未覆盖

本轮仍只有成年人。儿童/老人完整面容、三个年龄段身份连续性、全部组合最终美术、万人缓存及 Unity 引擎导入尚未完成；银灰发色不等于老年面容。正式六 Frame 和独立帽饰的落地需在实验体验后另行决定，不因此重构冻结 Runtime。
