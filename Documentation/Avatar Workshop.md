# 头像工坊 / Avatar Workshop

## 当前范围

头像工坊是 Neka / Picrew 式离散部件编辑器，不是完整人物图片画廊。玩家只编辑四类：

```text
Face
Hair
Outfit
Expression
```

Headwear 仍属于 Hair 内部作者层；腮红与情绪符号属于 Expression。人物年龄与性别来自目标对象，不写入 Recipe。

同一个编辑器用于玩家示例档案和当前城市真实居民。编辑外观不得改变姓名、生日、家庭、职业、故事或游戏日期。未定制居民继续使用冻结的正式 Portrait Renderer。

## 当前唯一美术基线

运行时只保留：

```text
chibi-cute-v1 = active
```

`linework-v1`、`simple-flat-v1`、`soft-paint-v1` 的美术实现已经从当前资源树退役；需要查看旧实现时使用 Git 历史。旧 Recipe 中这些 pack ID 仍可读取，`parseRecipe` 会将其迁移到 `chibi-cute-v1`，但不会自动改写 localStorage。

Q版当前玩家可选总量：

```text
Face        4
Hair        30
Outfit      24
Expression  8
```

child / adult / elder 使用各自年龄段 Hair / Outfit。旧 `crop/bob/long/pony/wave/braid` 与 `tee/shirt/knit/jacket` 集中在 `packs/compatibility.ts`，仅用于旧 Recipe 解析与确定性 Frame fallback，不进入 UI 或 Random。

## Head Frame / Hair Coverage

六个 Frame：

```text
female.child
male.child
female.adult
male.adult
female.elder
male.elder
```

每个 Frame 只有一个固定 Head Frame。它定义：

- 头顶隐藏轮廓；
- 左右太阳穴；
- 耳位；
- 上半脸公共接缝。

Face 的 round / oval / angular / long 只能改变面颊、下颌、下巴、眼形、眉形等身份差异，不得改变 Hair 需要适配的头顶框架。

Hair / Headwear 永远不接收 Face ID，也不做：

```text
face-dependent offset
face-dependent scale
anchor solver
mask / clipPath 自动适配
逐脸作者补丁
```

除“同一 Frame + Hair 在四脸下 geometry 完全一致”外，Phase 6 新增 Hair Coverage Contract：固定 QA probes 位于 crown / crown-left / crown-right / temple-left / temple-right，所有 active Hair 的外轮廓都必须覆盖这些点。它只用于审查，不参与运行时变形。

`scalpExposure:'intentional'` 只表示发际区域可以表现稀疏头皮，例如老年疏发；仍不允许 Hair 外轮廓之外露出 Head Frame。

## Renderer 图层

固定顺序：

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

同一个 Hair 选项可以同时提供 BackHair / HeadwearBack / FrontHair / HeadwearFront。带头巾、巾帽等素材必须声明 `headwear:'integrated'`；无帽素材为 `headwear:'none'`。

Outfit 仍只有一个玩家选项和一个 Renderer layer，但 Q版作者内部使用：

```text
base
collar
overlay
detail
```

其中 base 与 collar 必须存在。

## Recipe 与旧数据兼容

当前 Recipe：

```json
{
  "schema": "wanhu.avatar",
  "version": 1,
  "pack": "chibi-cute-v1",
  "face": "oval",
  "hair": "bound",
  "outfit": "commoner",
  "expression": "smile"
}
```

旧 pack ID：

```text
soft-paint-v1
linework-v1
simple-flat-v1
```

会映射到 `chibi-cute-v1`。旧 modern Hair / Outfit ID 仍可被 parseRecipe 接受；进入具体目标 Frame 后按 compatibilityKey → 当前 Frame 可用默认/首项确定性回退。预览 fallback 不自动写回存储，只有玩家点击“应用”才保存。

新玩家默认配方不再借用旧 modern ID 做过渡，而是直接使用各 Frame 的年龄专属 Hair / Outfit。

## 保存边界

每个对象独立保存：

```text
wanhu.avatar.v1:city:<citySeed>:resident:<id>
wanhu.avatar.v1:city:<citySeed>:player:female
wanhu.avatar.v1:city:<citySeed>:player:male
```

导入只改变预览；严格验证 schema/version/字段/选项。切对象或关闭时如有草稿必须提示。恢复原头像只删除当前对象覆盖。跨标签页同对象更新必须提示冲突。写入失败不能显示成功。

这是 Web localStorage 原型，不代表 Unity 正式存档设计。

## 当前源码结构

```text
Web/src/avatar/
  model.ts
  store.ts
  render.ts
  AvatarImage.tsx
  AvatarEditor.tsx
  Integration.tsx
  editor.css
  entry.css
  packs/
    catalog.ts
    compatibility.ts
    registry.ts
    types.ts
    chibi/
      art-spec.ts
      head-frame.ts
      catalog.ts
      drawing.ts
      faces.ts
      hair.ts
      outfits.ts
      index.ts
```

旧画风资源目录不在当前树建立 archive；Git 已保存历史。

## Actions / Artifact 审查

Resident Visual Review 必须验证：

- 四类真实编辑操作；
- 玩家 / 居民对象独立保存、取消、刷新、恢复、冲突与导入导出；
- 六 Frame Catalog 过滤；
- Random 不使用 compatibility-only ID；
- 旧 pack ID 与旧 modern ID 迁移；
- 同一 Frame + Hair/Headwear 跨四 Face geometry 完全一致；
- 六 Frame Head Frame signature 一致；
- 全部 active Hair 通过 Hair Coverage probes；
- child / adult / elder Hair / Outfit 96 / 64 / 48px；
- Headwear 图层契约；
- Outfit base / collar；
- 移动端和实际居民面板。

Artifact 新增：

```text
avatar/packs/chibi-cute-v1/hair-coverage-female.child.png
avatar/packs/chibi-cute-v1/hair-coverage-male.child.png
avatar/packs/chibi-cute-v1/hair-coverage-female.adult.png
avatar/packs/chibi-cute-v1/hair-coverage-male.adult.png
avatar/packs/chibi-cute-v1/hair-coverage-female.elder.png
avatar/packs/chibi-cute-v1/hair-coverage-male.elder.png
```

这些图上的虚线与蓝点是诊断辅助，不是玩家 UI。

CI PASS 不能代替人工视觉审查。尤其要看头顶是否露出 Head Frame、太阳穴断开、发髻漂浮、48px 轮廓、衣领断裂与移动端遮挡。

## Phase 7：美术精修

当前阶段为美术精修，而非 Unity 迁移。资产数量、四类编辑项、六 Frame、单 Pack 与兼容规则均不变。详见 [Phase 7 头像美术精修与验收](Phase%207%20头像美术精修与验收.md)。

FaceBase 不再常驻腮红；Expression 在固定共同安全区内绘制唯一一对色块，并由真实脸轮廓检查保证余量。Hair 只按 Frame 重画发际/髻形，不读取 Face ID。Outfit 的连续斜襟、圆领、夹袄与围襟均仍属于原四个作者层。

Resident Visual Review 增加独立轻量 `capture-avatar-art-polish.mjs`：192 个腮红组合、3 个越界负对照、统一发色衣色的男女/年龄图及腮红安全区图。后两图必须实际下载打开，不能只读报告中的 automated-pass。

## 未实现

当前不包含连续参数捏脸、独立 Headwear 分类、自动 Hair fit、服务端同步、Unity Runtime 导入或正式存档迁移。Q版是 Web 美术基线，不等于最终 Unity 实现。
