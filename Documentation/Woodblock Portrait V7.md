# Woodblock Portrait V7

## 目标

套色木刻继续作为居民头像唯一美术方向。V7 专门修正女性角色的文化语义：发型、脸型、发际线、鬓边和发饰都要明显属于泛中国古代居民，而不是 generic long-hair female。

这一轮明确移除“正面胸前双粗垂发”作为正式主轮廓。年轻女性仍可有后披发，但主要发量必须位于后脑与肩后，正面只保留少量贴脸鬓发。

## 女性发式语义

正式女性发式使用语义化 Stable ID：

- girl-double-bun：女童双小髻；
- girl-ribbon-side：女童侧束布结；
- young-halfbound-backfall：少女半束后披；
- young-halfbound-asym：少女偏侧半束；
- young-low-tie：少女低束发；
- adult-low-bun：成年女子低髻；
- adult-coiled-bun：成年女子盘发；
- married-tidy-bun：已婚收束髻；
- middle-household-bun：中年当家妇人髻；
- elder-gray-low-bun：老年花白低髻；
- elder-tight-gray-bun：老年紧收花白髻；
- worker-tight-bun：劳作妇人紧收低髻。

旧的抽象资产名不再进入正式页：

- female-child-side
- female-youth-long
- female-youth-long-side
- female-adult-halfbound
- female-middle-lowbun
- female-elder-graybun
- female-worker-tight

## 文化边界

### 女童

识别重点是双小髻、侧束、小布结与红绳。

禁止用成熟簪钗，也不使用胸前长发作为主轮廓。

### 青年未婚女性

主力为半束后披、偏侧半束和低束发。

后披发必须位于后脑、颈后和肩后，不能在正面形成两条粗长黑带。正面只允许少量短鬓发或单侧较长鬓发。

### 成年与已婚女性

主力为低髻、盘发、已婚收束髻。

发际线更整洁，发量主要向后收束。簪钗用于固定结构而不是装饰堆砌。

### 中老年女性

主力为当家妇人髻、花白低髻和紧收花白髻。

老年发量略少，允许发际线轻微后退；花白通过发色和少量浅色刻线表现，不用夸张白色块。

## 女性脸型

V7 将女性 Face Profile 从“偏瘦长 + 尖下巴”调整为更稳定的居民脸型：

- female-child-round-soft
- female-youth-oval-soft
- female-youth-narrow-gentle
- female-adult-oval-stable
- female-adult-long-soft
- female-middle-household
- female-elder-kind
- female-elder-thin
- female-worker-broad

设计原则：

- 青年女性以鹅蛋脸、柔和椭圆脸为主；
- 下巴收束但不尖；
- 成年女性面中更稳；
- 中年妇人下颌和肩颈更有重量；
- 老年女性通过眼下线、法令纹、发量和发色表现年龄，不做男性老人去胡须版。

## 发饰

正式发饰只保留日常生活语义：

- red-cord：女童红绳；
- cloth-knot：布结；
- wood-pin：木簪；
- simple-hairpin：简簪；
- double-prong-pin：简钗；
- jade-pin：低调玉色簪头；
- headcloth：劳作头巾。

发饰不得形成额头横向头带，也不做宫廷化、满头珠翠或异域头冠。

## Hair Rig

V7 在 V6 锚点基础上新增：

- crownCenter
- crownBack
- bunMid
- bunLow
- sideburnLeft / sideburnRight
- occipitalLeft / occipitalRight
- napeCenter
- shoulderBackLeft / shoulderBackRight

正式发型根据语义使用不同 Anchor Mode：

- double-crown-bun
- crown-bun
- crown-occipital-nape
- nape-bun

半束后披的主路径为：

~~~text
crown / occipital
↓
nape
↓
shoulderBack
~~~

而不是：

~~~text
temple
↓
front chest
~~~

## Golden Residents

女性 Golden Residents 当前固定为：

- 小禾：女童双小髻 + 红绳；
- 阿禾：少女半束后披 + 布结；
- 林月娘：成年已婚收束髻 + 木簪；
- 许兰英：中年当家妇人髻 + 简钗；
- 沈老夫人：老年花白低髻 + 玉簪；
- 赵婶：劳作妇人紧收低髻 + 头巾。

这些固定角色用于先把文化语义做对，再扩随机池。

## 自动验收

Visual Review 必须检查：

- 页面只使用 woodblock-v7；
- Golden Residents 仍为 12；
- 女性 Golden >= 6；
- 女性文化发式审查 = 8；
- 8 个文化发式全部标记为 chinese-historic；
- data-hair-cultural-state 全部为 ok；
- 旧 generic long-hair Stable ID 不得出现在正式页面；
- 所有 Hair Rig 状态为 ok；
- 儿童、老人、财富四档与 32 人 Crowd Review 继续保留；
- 所有背景无 Halo。
