# Phase 7：头像美术精修与验收

## 定位与来源

本轮由用户明确改为美术精修，不是旧计划中的 Unity 迁移。接手 main 为 `9388d462993c27c18ca045ca0436d1b7550a98bd`；基线 Build `35520390295`、Resident Visual Review `35520390293` 均成功。已下载其 Artifact，并打开老年 Hair UI、三年龄综合图、女性老年 Hair 图板和成年女性表情矩阵。

结构沿用 Phase 6：单 Q版 Pack、六个固定 Head Frame、Hair Coverage、四类编辑项、兼容 ID 解析与旧 Pack alias。冻结的正式 Portrait Renderer、居民逻辑、存储与导入导出不改。Hair 仍只接收 Frame 与 Hair ID。

## 7A：盘点结果

| 问题 | 基线中的具体位置 | 本轮处理 |
| --- | --- | --- |
| 腮红越界 | FaceBase 常驻色块与 shy 二次叠加。female.adult 的 angular / long 在各表情均存在少量越界；shy 还影响 female.adult oval、male.adult angular / long、female.elder oval / angular / long、male.elder angular / long | 删除 FaceBase 常驻腮红；Expression 只画一对内收色块，shy 只改变尺寸与浓度，不叠第二层 |
| 男女同质化 | 成年与老年近乎相同的碎刘海、豆眼和眉线；宽度微调不足以建立气质 | 女性细弧眉、外眼角短弧、柔和下颌；男性较粗直眉、较平眼形与宽下颌；共享 Hair 按固定 Frame 画稿区分 |
| 衣服像现代衬衫 | 旧交领是两个对称尖领；child-apprentice、adult-male-long-robe、elder-work-jacket 等中央长色块像领带，elder-padded-robe 等叠层松散 | 重画连续交领斜襟；圆领、夹袄、围襟与襦裙有不同大色块；整片平滑肩形承接衣领 |
| 老年像灰发成人 | 六个老年 Hair 选项均近似三段锯齿碎刘海，低束/拨发/松软髻差异主要在小背面轮廓 | 重画中分、侧梳、退后发际、贴耳鬓发、低髻/盘髻与小束发；脸上加入克制的眼下、面颊、下巴年龄线 |

基线腮红定位使用原提交实际椭圆填充与 Head Frame 下半脸路径做 0.5 画布单位采样，共 24 / 192 个 Frame × Face × Expression 组合检出几何越界；该数值不是“24 个肉眼都明显难看”的主观评分。

## 7B：作者层规则

`faces.ts` 的腮红集中在一个 `data-blush` Expression 组。共同安全区为左侧 `(112,184,32,18)`、右侧 `(176,184,32,18)`，实际色块比安全框更小。固定坐标，不读取轮廓来移动或变形；禁止裁切补救。检查还必须验证填充/描边在真实 Face 填充内部，并保留 2 个画布单位余量。负对照需拒绝尺寸超大、整体外移、以及安全框内但真实脸轮廓已经不包含腮红的情况。

`head-frame.ts` 只重画成年男性与老年男女的下半脸；六个上半头型参数、耳位、签名及 Hair Coverage probes 不变。

`hair.ts` 在既有 ID 上重画成年和老年前发，以及老年髻形背面；不新增 Hair，也不恢复旧 Pack。头巾/帽子仍留在原 Hair 内，不新增 slot。疏发通过发际退后表现，不让固定头型从 Hair 外轮廓冒出。

`outfits.ts` 仍输出 `base / collar / overlay / detail`。配色表及固定衣领画稿只属于资产作者实现，不是新 UI 分类。取消对称尖领、长领带色块、脱离身片的肩片。女性肩形更圆，男性更宽平，老年更缓垂；领口向下与斜襟连续相接。

不增加可选数量：Face 4 / Hair 30 / Outfit 24 / Expression 8。10 个 compatibility-only ID 仍留在原解析入口。

## 审查入口

原 Build 与 Resident Visual Review 必须继续成功。原 11,136 组合、Hair 跨 Face 不变、220 Hair Coverage probes、六 Frame Catalog、48px、保存/恢复/跨标签页/导入导出和真实 UI 回归都保留。

轻量附加检查：`scripts/capture-avatar-art-polish.mjs` 调用 `scripts/avatar-review/art-polish.mjs`，只读 SVG，不修改运行时。不向已有大矩阵脚本继续塞入专项规则。

新增 Artifact：

```text
avatar/packs/chibi-cute-v1/phase7-shape-comparison.png
avatar/packs/chibi-cute-v1/phase7-blush-safe-zones.png
avatar/packs/chibi-cute-v1/phase7-art-polish-review.json
```

形体图使用相同 Face / Expression，并统一发色与衣色；必须检查老年与成年不是只靠灰发区分。绿框只存在于腮红诊断图，不在玩家 UI。Artifact 的 source-and-contract.zip 同步保存该提交的治理文档，防止源码截图与工作流说明脱节。

必须下载并打开真实 UI `09b-elder-hair-options`、`09c-elder-outfit-options`、`10a-adult-female-hair-options`、`10c-adult-male-hair-options`、`11-mobile`，以及三年龄综合图和本轮两张新增诊断图。优先检查头顶、鬓角、眼下、衣领连续性、肩线和 96 / 64 / 48px 轮廓。

## 当前执行记录

代码候选已完成本地 TypeScript 检查、220 个 Hair 覆盖点检查（前发/帽前层自身即覆盖全部点）与多张实际 SVG 组合图人工查看。当前处于临时分支 Actions 与 Artifact 人工复核阶段；本地检查不能替代远端 PASS，不代表用户已确认最终画风。

## 未包含

不做 Unity Runtime / 正式存档迁移，不扩素材库，不新增玩家分类，不做逐脸 Hair 适配、solver、mask / clipPath。本轮交付仍是候选美术，最终喜好由用户审查。
