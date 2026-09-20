# 头像工坊 / Avatar Workshop

## 用户目标与范围

这是 Neka / Picrew 式的离散部件编辑流程，不是完整人物图片画廊。玩家只选择 **脸型、头发、衣服、表情** 四类。没有帽饰、调色、五官滑杆或背景装饰选项。

同一个编辑器用于玩家示例档案和当前城市的全部真实居民。首页“头像工坊”打开玩家档案；居民身份栏“编辑头像”直接打开对应居民。`/?view=avatar-editor` 也可直接打开工坊，底层仍是同一个 App，不会重建游戏会话。

`linework-v1`（日常线绘）、`chibi-cute-v1`（Q版可爱）与 `simple-flat-v1`（极简简笔）都是原创、真实分层的 SVG 画风包。每包共享同一组 4 种面容语义、6 种发型、4 套衣服、6 种表情，并支持 female/male × child/adult/elder 六个作者上下文。画风选择只改变绘制方式，不新增第五类捏脸参数。第三套采用正常简化头像比例、细深灰轮廓、少阴影和平面色块，目标是现代 UI 插画感，而不是把 Q 版眼睛缩小。人物年龄与性别取自目标对象，不由头像编辑改变。两份玩家示例档案分别是 21 岁女子与 32 岁男子，不冒充真实玩家资料。

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
Neck
Outfit
FaceBase
Expression
FrontHair
```

表情在前发下方，不能把眼睛或眉毛画到刘海上。

- Face：轮廓、耳朵、鼻子、肤色与年龄细节。
- Hair：同一个选择包含前后两个绘制层。
- Outfit：完整肩部和领口。
- Expression：该脸型对应的一套眉眼口变化，不是全脸整图替换。

画布统一 `0 0 320 320`。眼形使用按脸型编写的作者规格，年龄使用直接绘制的脸部轮廓和肩颈轮廓；不按头发或衣服自动搜索位置，不引入兼容图、锚点求解器或逐人物偏移补丁。固定镜像仅用于正面对称绘画。

换发型、衣服时 FaceBase / Expression 不变；换表情时 FaceBase 与衣装不变；换脸型时头发、衣服、颈部不变，Expression 使用新脸型对应的眉眼口设计。

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
    types.ts              统一 Layer / AvatarPack 契约
    registry.ts           唯一画风注册表、顺序、名称与旧 ID alias
    linework/
      index.ts            该画风唯一公开入口
      drawing.ts / faces.ts / hair.ts / outfits.ts
    chibi/
      index.ts
      drawing.ts / faces.ts / hair.ts / outfits.ts
    simple-flat/
      index.ts
      drawing.ts / faces.ts / hair.ts / outfits.ts
```

AI 辅助美术生产发生在开发阶段：按照统一画布和包内画法编写/补充源部件，构建时批量组合、验证、导出。游戏生成居民时不调用 AI，也不需要外部图像服务。

### 新画风扩展点

新增画风时不再修改 `render.ts` 或 `AvatarEditor.tsx`。画风目录只公开一个 `index.ts`，在里面组装 BackHair / Neck / Outfit / FaceBase / Expression / FrontHair；然后只在 `packs/registry.ts` 注册一次。画风标题、说明和编辑器排序都由这个注册表派生，避免 `model.ts`、`render.ts` 与 UI 三处重复登记。

`pack id` 属于持久化配方契约，发布后不要改名；目录名只是源码组织。废弃画风的兼容映射集中放在 registry 的 legacy alias，不在 `model.ts` 继续堆特殊分支。

`audit-avatar-art.mjs` 继续验证日常线绘包；`audit-avatar-chibi.mjs` 验证 Q版；`audit-avatar-simple-flat.mjs` 独立验证极简简笔的共享部件、图层、SVG 合法性、眼睛/嘴型、源文件不导入其他包 geometry 与全组合检查，并输出男女成人三画风同配置、Face / Hair / Outfit / Expression 矩阵、年龄证明和 96/64/48px 图板。每个包每个 Frame 有颈部 1、FaceBase 4、前后发 12、衣服 4、脸型对应表情 24；这些是作者源规则的确定性展开，不代表把完整人物图切成了若干文件。

`soft-paint-v1` 因用户否定已从当前工作树删除，旧本地配方读取时只映射同一四项语义到 `chibi-cute-v1`，不会自动重写 localStorage。未来新增画风包继续复用同一编辑和保存边界，不再新增独立实验页；新包必须先证明不同脸共享头发、衣服和表情，不能把完整生成图登记为可换部件。

## GitHub Actions Review

保留居民故事连续性脚本及正式 72 组合 Frame 检查，删除只服务已移除画廊的检查，追加：

- 真实玩家/居民编辑、应用、撤销、切对象、关闭、刷新、恢复默认。
- 甲乙分离，实际居民面板显示，城市日期、身份和故事不因开关编辑器重置。
- 有效/无效导入、配额失败、同对象跨标签冲突、PNG/SVG/JSON 实际下载。
- 每个画风包分别执行六上下文 × 4 脸 × 6 发 × 4 衣 × 6 表情，即每包 3,456 个基础组合的 SVG、层序与身份不变量。\n- 同一成人配置在 `linework-v1`、`chibi-cute-v1` 与 `simple-flat-v1` 间切换时，四个语义 ID 保持不变，同时三套最终 SVG 必须真正不同；极简简笔的头部宽度与头身比还要与 Q 版保持明确差异。
- 眉眼口与前发遮挡顺序、嘴型中线、虹膜范围。
- 六组脸型板、六组表情板、六组发型板、六组服装板；这些是诊断图板，不是固定整图资源或冒充玩家 UI。
- 96/64/48 原尺寸，桌面及 390/320px；深浅衬底；儿童老人实际样本。

`resident-visual-review` Artifact 的 `avatar/` 保留原始 PNG，不经过旧预览缩图。`parts/` 是可组合 SVG 导出，`samples/` 是当次渲染器输出的组合示例，`review.json` 是自动检查记录。下载并实际查看窗口、真实居民面板、所有图板与小尺寸后才能合并 main；main 必须再次跑完和核对。

## 明确未宣称的能力

未实现连续参数捏脸、表情动画、真实账号系统、服务端同步、Unity 引擎导入或商业级年龄连续性。三套画风都提供儿童老人可编辑作者版本；Q版与极简简笔的核心审美验收仍以成年女性/男性为主，后者还必须重点检查 48px 的线条可读性、成年男性成熟度与老人是否不只是灰发。年龄辨识、脸型差异、男女成熟度和 48/64px 表现仍须实际看截图。不能以组合数量、导出数量或 CI 绿色宣布美术已定稿。
