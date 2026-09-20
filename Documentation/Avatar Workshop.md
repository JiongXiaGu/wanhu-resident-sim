# 头像工坊 / Avatar Workshop

## 用户目标与范围

这是 Neka / Picrew 式的离散部件编辑流程，不是完整人物图片画廊。当前玩家仍只选择 **脸型、头发、衣服、表情** 四类；不增加独立帽饰、调色、五官滑杆或背景装饰选项。Q版 V2 可以在 Hair 内部包含帽子 / 头巾 / 发冠图层，在 Expression 内部包含腮红与情绪符号，是否将 Headwear 升级成独立类别必须经过主路线工作流的单独决策门。

同一个编辑器用于玩家示例档案和当前城市的全部真实居民。首页“头像工坊”打开玩家档案；居民身份栏“编辑头像”直接打开对应居民。`/?view=avatar-editor` 也可直接打开工坊，底层仍是同一个 App，不会重建游戏会话。

`linework-v1`（日常线绘）、`chibi-cute-v1`（Q版可爱）与 `simple-flat-v1`（极简简笔）都是原创、真实分层的 SVG 画风包。自 2026-09-20 起，`chibi-cute-v1` 是后续素材扩充主路线；另外两套暂时作为 reference / compatibility 保留。三套已经完成 Pack-owned Catalog。`chibi-cute-v1` 当前玩家可选总量为 4 Face / 30 Hair / 24 Outfit / 8 Expression；Phase 5A / 5B / 5C 已让 child、adult、elder 分别使用自己的年龄段 Hair / Outfit。另保留 6 个旧 Hair + 4 个旧 Outfit 作为 `selectable:false` compatibility-only ID，不计入玩家可选总量；`linework-v1`、`simple-flat-v1` 保持各自旧 Catalog。UI、Recipe 校验、随机和 Actions 组合遍历都从当前 Pack 自己的 Catalog 读取。具体阶段、素材边界和人工美术审查以 [Q版头像主路线生产与审查工作流](Q版头像主路线生产与审查工作流.md) 为准。

画风是待用户验收的候选，不声称复制用户参考图、某位 Neka 画手或商业游戏。Q版方向只借鉴“大头比例、极简五官、腮红、粗轮廓、贴纸感”等通用视觉特征；现代日常服饰与可组合性优先，不强行添加中国古代饰物。历史错误实验已从当前工作树删除，不再建立保留区；旧内容使用 Git 历史查阅。

## 系统结构

```text
App 当前城市快照、日期
→ AvatarIntegration 生成可编辑对象
→ AvatarEditor 一份当前对象草稿
→ 选择 Face / Hair / Outfit / Expression
→ Apply 写入这个对象的外观覆盖记录
→ ResidentAvatar 展示覆盖图或原正式头像
```

保存不会修改 ResidentRecord、姓名、生日、性别、家庭、职业、生活记录或故事。编辑窗口覆盖在当前 App 上，打开、关闭和保存都不重新请求城市数据，不重置游戏日期。正式 `ResidentPortraitDNA` 与 `Web/src/resident/portrait/` 冻结规则保持不变；未定制居民继续显示原正式头像。

## 四类选项与层级

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

表情在 FrontHair 与 HeadwearFront 下方，不能把眼睛、眉毛或情绪符号画到刘海 / 帽檐上。Headwear 是 Hair 内部绘制层，不是第五个玩家选项。

- Face：轮廓、耳朵、鼻子、肤色与年龄细节。
- Hair：同一个选择包含 BackHair / HeadwearBack / FrontHair / HeadwearFront；无帽造型的两个 Headwear slot 为空。
- Outfit：完整肩部和领口；Q版内部按 base / collar / overlay / detail 作者标记组织，但仍只占一个 Outfit Renderer layer。
- Expression：该脸型对应的一套眉眼口变化，不是全脸整图替换。

画布统一 `0 0 320 320`。眼形使用按脸型编写的作者规格，年龄使用直接绘制的脸部轮廓和肩颈轮廓；不按头发或衣服自动搜索位置，不引入兼容图、锚点求解器或逐人物偏移补丁。固定镜像仅用于正面对称绘画。

换发型、衣服时 FaceBase / Expression 不变；换表情时 FaceBase 与衣装不变；换脸型时头发、衣服、颈部不变，Expression 使用新脸型对应的眉眼口设计。

Q版六个 Frame 都遵守 Face Frame：female/male × child/adult/elder 各自固定额头顶线、太阳穴接缝和耳位。round / oval / angular / long 的差异主要发生在面颊、下颌、下巴和五官。Hair / Headwear 从不接收 Face ID；同一个 Hair 在同一 Frame 的四张脸上必须返回完全相同的 BackHair / HeadwearBack / FrontHair / HeadwearFront。但不同 Frame 不再强制共用同一 Hair / Outfit。child、adult、elder 可以拥有独立素材列表；年龄辨识优先来自专属轮廓和服饰，而不是把成人素材缩放或仅换灰发。

## 保存、预览与取消

配方只有四个外观字段与版本元数据：

```json
{
  "schema": "wanhu.avatar",
  "version": 1,
  "pack": "linework-v1",
  "face": "oval",
  "hair": "long",
  "outfit": "knit",
  "expression": "smile"
}
```

目标对象不是配方内容。导入不接受居民编号或额外字段，不能借导入覆盖别人。JSON 最大 8 KB；版本、字段及选项均严格验证。导入只改变预览，仍需点击“应用”。

每个对象有单独的 localStorage 键：

```text
wanhu.avatar.v1:city:<citySeed>:resident:<id>
wanhu.avatar.v1:city:<citySeed>:player:female
wanhu.avatar.v1:city:<citySeed>:player:male
```

这是 Web 原型本地覆盖记录，不是 Unity 存档设计。清理浏览器站点数据会丢失记录，可导出配方备份。相同 citySeed 代表相同示例城市命名空间，不提供多存档管理。

- 选择选项只改 draft，缩略图只展示该选项对当前草稿的影响。\n- 切换画风会保留 face / hair / outfit / expression 四个 ID；例如自然长发 + 针织开衫 + 微笑会映射到新包中同语义的独立美术，而不是重新随机人物。
- 应用只保存当前对象；不重写所有居民的映射。
- 撤销回到本次载入/保存的状态。
- 切换对象或关闭有未保存草稿时，要求继续编辑、应用后继续或放弃修改。
- 恢复原头像只移除当前对象的覆盖，居民游戏界面回到正式 Renderer。
- 同一对象在另一标签页变更后，旧草稿会提示冲突，不静默覆盖；需重新载入。这个乐观检查不是跨进程数据库事务。
- 存储失败显示错误并保留草稿，不把写入失败显示为成功。
- 异步导入带有请求代数，避免读文件过程中切换目标后污染新对象。

列表里未定制居民用姓名占位说明“未定制”，不会把新素材预览当成已应用头像。

## 画风包与批量生产

```text
Web/src/avatar/
  model.ts                配方、目标、随机与旧 pack 兼容读取
  store.ts                按对象保存、订阅、冲突检查
  render.ts               通用 SVG/PNG 渲染，不再逐画风 import 美术模块
  AvatarImage.tsx         显示当前配方
  AvatarEditor.tsx        唯一四选项编辑窗口
  Integration.tsx         当前 App / 居民对象绑定
  editor.css / entry.css  仅工坊样式
  packs/
    catalog.ts            Pack Catalog 通用类型、四类 Part 与查询辅助
    types.ts              统一 Layer / AvatarPack / lifecycle 契约
    registry.ts           唯一画风注册表、生命周期、默认 active Pack 与兼容映射
    linework/
      catalog.ts          该画风自己的 Face / Hair / Outfit / Expression
      index.ts            该画风唯一公开入口
      drawing.ts / faces.ts / hair.ts / outfits.ts
    chibi/
      art-spec.ts          Q版 V2 Hair / Headwear / Outfit 内部作者契约
      face-frame.ts        成年男女统一上半脸框架；Face 适配固定 Hair
      catalog.ts
      index.ts
      drawing.ts / faces.ts / hair.ts / outfits.ts
    simple-flat/
      catalog.ts
      index.ts
      drawing.ts / faces.ts / hair.ts / outfits.ts
```

AI 辅助美术生产发生在开发阶段：按照统一画布和包内画法编写/补充源部件，构建时批量组合、验证、导出。游戏生成居民时不调用 AI，也不需要外部图像服务。

### 新画风扩展点

新增画风时不再修改 `render.ts` 或 `AvatarEditor.tsx`。画风目录只公开一个 `index.ts`，并按统一 8 层契约组装 BackHair / HeadwearBack / Neck / Outfit / FaceBase / Expression / FrontHair / HeadwearFront；然后只在 `packs/registry.ts` 注册一次。画风标题、说明和编辑器排序都由这个注册表派生，避免 `model.ts`、`render.ts` 与 UI 三处重复登记。

`pack id` 属于持久化配方契约，发布后不要改名；目录名只是源码组织。废弃画风的兼容映射集中放在 registry 的 legacy alias，不在 `model.ts` 继续堆特殊分支。

Catalog option 还可以声明 `frames`。省略表示六个 Frame 通用；显式声明后，AvatarEditor、随机和 Review 只会在对应 Frame 使用该素材。Recipe 本身仍只有四个外观字段，年龄 / 性别继续由目标对象提供；不适用的旧素材只在预览时确定性映射，不会未经“应用”写回 localStorage。

每个 Pack 现在还声明 `lifecycle`：`active`、`reference` 或 `legacy`。普通画风选择只显示 active/reference；legacy 仍可渲染旧 Recipe。当前 active 是 `chibi-cute-v1`，另外两套为 reference。新对象默认使用 active Pack。

跨 Pack 切换先保留目标 Pack 也拥有的同 ID；若目标缺少该 ID，则使用素材上的显式 `compatibilityKey` 寻找对应项，仍无匹配时回到目标 Pack 的 defaults。这个映射是确定性的，不随机换人。Phase 1 暂不保存 per-pack draft history，因此 Q版专属素材如果切到旧 Pack 后发生 fallback，再切回 Q版不会自动恢复那个专属素材，需要玩家重新选择；后续只有确有需要才增加 per-pack 历史。

素材审查统一由 `scripts/avatar-review/audit-packs.mjs` 执行；`pack-specs.mjs` 只描述每套画风真正不同的检查参数，例如矩阵范围、表情标记、眼睛约束、原尺寸/年龄证明，以及 Q版与极简简笔之间的比例差异。脚本会从运行时 Pack Registry 读取实际注册顺序，并要求 Registry 与 Review Spec 一一对应；因此新增画风只需新增美术包、在 `packs/registry.ts` 注册一次，再补一份小型 Spec，不再复制三四百行 Audit。每个包每个 Frame 仍有颈部 1、FaceBase 4、前后发 12、衣服 4、脸型对应表情 24；这些是作者源规则的确定性展开，不代表把完整人物图切成了若干文件。

`soft-paint-v1` 因用户否定已从当前工作树删除，旧本地配方读取时只映射同一四项语义到 `chibi-cute-v1`，不会自动重写 localStorage。Q版新增古代素材通过 compatibilityKey 显式回退到 reference Pack 的旧语义，不要求 reference Pack 补画。未来新增画风包继续复用同一编辑和保存边界，不再新增独立实验页；新包必须先证明不同脸共享头发、衣服和表情，不能把完整生成图登记为可换部件。

## GitHub Actions Review

保留居民故事连续性脚本及正式 72 组合 Frame 检查，删除只服务已移除画廊的检查，追加：

- 真实玩家/居民编辑、应用、撤销、切对象、关闭、刷新、恢复默认。
- 甲乙分离，实际居民面板显示，城市日期、身份和故事不因开关编辑器重置。
- 有效/无效导入、配额失败、同对象跨标签冲突、PNG/SVG/JSON 实际下载。
- 每个画风包按自己的 Catalog 动态执行六上下文 × Face × Hair × Outfit × Expression 全组合 SVG、层序与身份不变量；当前三套恰好仍各为 3,456 组合，但不再写死。\n- 跨 Pack 切换按 exact ID → compatibilityKey → target defaults 的确定性规则映射；当前共享旧 ID 的配置仍保持不变，同时三套最终 SVG 必须真正不同。
- 眉眼口与前发遮挡顺序、嘴型中线、虹膜范围。
- 六组脸型板、六组表情板、六组发型板、六组服装板；这些是诊断图板，不是固定整图资源或冒充玩家 UI。
- Q版额外检查每个 Frame 的可用 Catalog、跨年龄 deterministic fallback，以及 child/adult/elder 专属 Hair / Outfit 的 96/64/48px 对照。Phase 5A 起 child UI 只出现儿童作者资产；Phase 5B 起 adult UI 只出现成年古代作者资产；Phase 5C 起 elder UI 也只出现 `elder-*` Hair / Outfit。旧 `crop/bob/long/...` 与 `tee/shirt/knit/jacket` 已改为 compatibility-only：仍可解析旧 Recipe，但不参与 UI、Random 或任何 Frame 的可选列表。
- 96/64/48 原尺寸，桌面及 390/320px；深浅衬底；儿童老人实际样本。

`resident-visual-review` Artifact 的 `avatar/` 保留原始 PNG，不经过旧预览缩图。每个画风统一位于 `avatar/packs/<pack-id>/`，其中 `parts/` 是可组合 SVG 导出、`samples/` 是当次渲染器输出的组合示例、`review.json` 是该 Pack 自动检查记录；跨画风对照在 `avatar/style-comparisons/`。下载并实际查看窗口、真实居民面板、关键图板与小尺寸后才能合并 main；main 必须再次跑完和核对。

## 明确未宣称的能力

未实现连续参数捏脸、表情动画、真实账号系统、服务端同步、Unity 引擎导入或商业级年龄连续性。三套画风都提供儿童老人可编辑作者版本；Q版与极简简笔的核心审美验收仍以成年女性/男性为主，后者还必须重点检查 48px 的线条可读性、成年男性成熟度与老人是否不只是灰发。年龄辨识、脸型差异、男女成熟度和 48/64px 表现仍须实际看截图。不能以组合数量、导出数量或 CI 绿色宣布美术已定稿。
