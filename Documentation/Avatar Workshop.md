# 头像工坊 / Avatar Workshop

## 当前入口和体验

`/?view=avatar-editor` 与首页头像工坊默认打开自由创作；居民身份栏“编辑头像”仍直接绑定该居民。两个上下文共用一个编辑器，不建立第二套捏脸页面。

自由创作可直接选择男/女、儿童/成年/老年；六份样板分别保存。指定对象可选原玩家示例与真实城市居民，年龄/性别保持锁定。自由创作的 Frame 是编辑上下文，不是第五种素材分类，不修改真实居民身份。

始终只有 Face / Hair / Outfit / Expression。帽巾属于 Hair 内部作者层，腮红属于 Expression。

## 当前美术与阶段

唯一运行时 Pack：`chibi-cute-v1`。当前 6 Face / 30 Hair / 24 Outfit / 8 Expression；每个 Frame 只显示适用素材。六脸型族拥有六 Frame 各自的下脸画稿，不是36个玩家选项。

Phase 7 的技术成果保留，但用户未认可其最终画法。当前进入 [Phase 8 头像美术体系与创作工坊](Phase%208%20头像美术体系与创作工坊.md)：8A 样板和桌面自由创作已交付，当前8B1重画儿童/老年全部现有Hair和Outfit；成年剩余素材在8B2处理。

UI 中“已重画”表示8A与8B1累计重画候选，不代表用户已最终验收；“仅已重画”可以过滤尚未重画的成年素材。日常样板只载入草稿。随机本类仅修改当前分类，随机搭配只修改 Hair / Outfit。

## 不变的组合结构

六个固定 Frame：female/male × child/adult/elder。`head-frame.ts` 定义每个 Frame 唯一上头型、太阳穴、耳位与 signature。Face 只改下脸和五官；Hair 只接收 Frame 与 Hair ID，不读取 Face。

禁止 face-dependent offset/scale、逐脸补丁、anchor solver、mask / clipPath 自动适配。Hair Coverage probes 仅用于 QA，不能拿它驱动变形。稀疏发际可以露内部头皮，不允许头型从外轮廓冒出。

层序：

```text
BackHair → HeadwearBack → Neck → Outfit
→ FaceBase → Expression → FrontHair → HeadwearFront
```

integrated 帽饰进入两个 Headwear 作者层；无帽为空。Outfit 内部 base / collar / overlay / detail 不变，其中 base/collar 必须存在。

母版 320×320 是头肩胸像，不将裙腰、腰带或腰围裙强塞到下边缘。完整帽身不能被 FrontHair 切成横条。详见 Phase 8 作者规则。

## Recipe 与兼容

```json
{"schema":"wanhu.avatar","version":1,"pack":"chibi-cute-v1","face":"oval","hair":"bound","outfit":"commoner","expression":"smile"}
```

Recipe 不含年龄、性别、目标ID。导入先验证协议和 Catalog，再按当前 Frame 做 exact → compatibilityKey → 默认/首项的确定性回退；仅改变预览，应用/保存才落盘。

旧 pack `linework-v1/simple-flat-v1/soft-paint-v1` 只作 alias → Q版。旧 Hair `crop/bob/long/pony/wave/braid` 和 Outfit `tee/shirt/knit/jacket` 在 compatibility.ts 保留为解析专用，不进入 UI/Random。注意 Face 的 `long` 是仍可选择的清秀脸，不等于旧 Hair 的同名兼容 ID。

## 保存边界

```text
wanhu.avatar.v1:city:<seed>:studio:<frame>
wanhu.avatar.v1:city:<seed>:player:female
wanhu.avatar.v1:city:<seed>:player:male
wanhu.avatar.v1:city:<seed>:resident:<id>
```

旧键保持，不批量改写、不静默迁移。一个目标一份保存；六自由样板互不覆盖，也不覆盖居民。切对象/框架、关闭时有未保存修改必须确认。导入是草稿，恢复仅删除当前目标覆盖，同对象跨标签页更新须提示冲突，写入失败不能显示成功。

自由样板是 localStorage Web 原型，不是账号/云存档或 Unity Save。JSON 没有 Frame，导入前要选目标框架；PNG/SVG 则导出当前所见框架。

真实居民的姓名、生日、性别、家庭、职业、故事和日期不变。正式五字段 DNA 与 `Web/src/resident/portrait/` 冻结；未定制居民显示原 Renderer，移除覆盖后恢复原图。

## 源码职责

model/store/render：Recipe、目标默认、保存和统一层序。Integration：App 内的目标与入口。AvatarEditor：草稿、目标切换、保存与部件浏览。studio.tsx：六框架上下文与样板标记。packs/chibi：Catalog 与静态画稿；sample-hair.ts 存放8A成年重画ID；child-hair.ts / elder-hair.ts 分别负责儿童/老年，age-outfits.ts负责两年龄的衣装画稿；hair.ts与outfits.ts只保留成年部分并分发。rework-batch.ts列出本批ID供UI与QA使用，同ID没有第二套画稿。

## Review

沿用 Build + Resident Visual Review；新 Face 自动进入全组合、头发跨 Face 不变及腮红检查。8A 追加六框架独立保存、模板预览、草稿切换、延迟导入、样板过滤/随机等真实 UI 测试。图板和实际桌面 UI 都必须下载人工打开。

移动端不再截图或列为美术必看项。诊断图只辅助审查，不能冒充玩家 UI；技术 PASS 不能替代用户美术认可。

8B1 增加四框架全部素材点选、重画过滤、旧新同配方对照；自动验证成年41份Hair/Outfit固定配方渲染不变。旧图通过Git历史临时导出，只在Actions Artifact中保留，不进入Web Pack。

未做：成年剩余 Hair/Outfit 重画、独立帽子分类、连续参数捏脸、自动 Hair fit、服务端同步、Unity Runtime/正式存档迁移。
