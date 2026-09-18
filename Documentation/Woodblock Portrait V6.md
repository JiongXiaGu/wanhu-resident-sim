# Woodblock Portrait V6

## 目标

居民头像美术方向已收敛为套色木刻。V6 不再继续比较壁画、白描、绢本等候选风格，而是验证这一套木刻是否能够进入正式资产生产。

本阶段优先解决：

- 女性角色覆盖不足；
- 儿童缺失；
- 老人年龄感不足；
- 女性长发错位与穿帮；
- 财富服装层次不稳定；
- 小尺寸头像的辨识度。

## Golden Residents

V6 固定 12 个基准角色：

- 阿石，8 岁男童，贫寒；
- 沈砚，22 岁青年男子，贫寒；
- 周朴，36 岁成年男子，普通；
- 陆川，51 岁中年男子，殷实；
- 顾伯衡，69 岁老年男子，富裕；
- 小禾，9 岁女童，贫寒；
- 阿禾，19 岁青年女子，贫寒；
- 林月娘，33 岁成年女子，普通；
- 许兰英，49 岁中年女子，殷实；
- 沈老夫人，68 岁老年女子，富裕；
- 赵婶，44 岁劳作妇人，普通；
- 田伯，73 岁瘦弱老翁，贫寒。

Golden Residents 是固定美术基准，不走随机 Resolver。

## Face Profile

儿童、青年、成年、中年、老人，以及男女，不再通过同一个脸型简单缩放。

当前维护：

- male-child-round
- male-youth-slim
- male-adult-average
- male-middle-broad
- male-elder-slim
- male-elder-thin
- female-child-round
- female-youth-oval
- female-adult-narrow
- female-middle-long
- female-elder-slim
- female-worker-broad

每个 Face Profile 独立定义脸宽、下颌、眼位、鼻口、颈宽与肩宽。

## Hair Rig

长发不再以固定世界坐标绘制。

Portrait Rig 提供：

- skullTop
- foreheadCenter
- templeLeft / templeRight
- earLeft / earRight
- jawLeft / jawRight
- chin
- neckLeft / neckRight
- shoulderLeft / shoulderRight
- chestCenter

长发的核心路径遵循：

~~~text
temple
↓
ear
↓
jaw / shoulder
~~~

### Layer

~~~text
Back Hair
Body / Outfit
Neck
Face Base
Face Detail
Age Overlay
Side Hair
Front Hair
Facial Hair
Accessory
~~~

Back Hair 负责披肩主体和髻后体积。

Side Hair 负责贴脸垂发，不允许独立悬浮。

Front Hair 负责发际线与额前轮廓。

### Small Size Policy

- 96px：保留完整主要发束；
- 64px：减弱次要发尾；
- 48px：发束加粗并简化成轮廓，避免变成两根细黑线。

## Wealth

财富不通过职业制服表达。

- poor：单层、薄、装饰极少；
- plain：基础双层领；
- comfortable：更完整领口与辅助滚边；
- wealthy：更多层领、滚边与少量精致配饰。

颜色仍保持低饱和。

## 审查页

/?view=portrait-styles 已转为 Woodblock Portrait V6 审查页，包含：

1. 12 个 Golden Residents；
2. 6 个女性 Hair Stability 样本；
3. 四档财富对照；
4. 32 人 Crowd Review。

## 自动验收

Visual Review 必须检查：

- Golden Residents = 12；
- 女性基准 >= 6；
- 儿童 >= 2；
- 老人 >= 3；
- Hair Stability = 6；
- 至少 3 个长发样本使用 temple-ear-shoulder anchor mode；
- 所有 Hair Rig 状态为 ok；
- 财富四档全部存在；
- Crowd Review = 32；
- 全页面只存在 woodblock-v6；
- 所有背景无 Halo。
