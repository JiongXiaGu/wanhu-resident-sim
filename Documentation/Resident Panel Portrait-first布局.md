# Resident Panel Portrait-first 布局

## 目标

居民面板保持左下 Context Surface 的人物信息结构：头像和姓名先回答“这个人是谁”，真实 CurrentAction 回答“他此刻在做什么”，近期行为与离散 LifeEvent 统一进入“最近”。

参考 `wanhu-ui-prototype` 的 Left Context Surface，但不复制其业务组件。

## 信息层级

1. **人物 Hero**：112px 头像、姓名、年龄职业、地区/家庭、关注与编辑头像。头像是第一视觉焦点。
2. **世界信息**：住所、工作地、家庭三列轻量信息；只在可定位项 hover 时提亮。
3. **此刻**：Section Label + 熟铜状态点 + CurrentAction。
4. **最近**：RecentAction 与近期离散 LifeEvent 按时间混合；弱分隔、轻 hover，不做后台表格式边框。
5. **Footer**：固定为“人物关系 / 人生经历”。关注留在 Hero；Footer 只负责深入导航。

不再保留独立“正在经历 / 最近发生”区域。

## Surface 契约

面板逻辑宽度 420px、圆角 18px、默认最大高度 700px；Header/Footer 固定，中间 Body 独立滚动。背景使用中性 Smoked Graphite：

- Context background：`rgba(45,47,44,.89)`
- Edge：`rgba(238,233,223,.095)`
- Rule：`rgba(238,233,223,.065)`
- Primary text：暖白 `#eee9df`
- Accent：Aged Brass `#a9844b / #c5a469`
- Blur：16px，仅用于让世界低频色彩透入，不通过更高 Blur 补文字可读性。

绿色来自世界场景透色，不再把居民面板本体直接染成深绿。

## 最近列表

RecentAction 通常只显示一条短文本。

LifeEvent V3 可以显示：

~~~text
时间
标题
短正文
~~~

二者不显示系统来源标签，但可通过排版轻微区分信息密度。

例如：

~~~text
2日前
去朋友家坐了一阵。

4日前
有人来给家里说亲
亲友只是先问了问我的意思，我答应找个时间见一面。
~~~

## 交互边界

住所、工作地仍只触发现有镜头定位提示；家庭摘要不承担展开动作，人物关系统一由 Footer 打开。关注仍是 Web 本地预览状态。编辑头像仍走 Avatar Workshop。

人生经历的时间轴、memoryText、家庭结构效果和居民绑定继续保留，但 LifeEvent 三阶段 / Story Thread 不再是目标契约。

不新增居民 Summary，不把普通 RecentAction 写入永久历史，不改变正式 portrait DNA、头像保存键、职业与家庭数据。UI 重构不能以“更好看”为理由改变内容语义。

## Review

Resident Content Review 继续断言：

- 头像至少 96px；
- Hero 高度至少 136px；
- 面板维持 420px Context Surface 宽度；
- 关注位于 Hero；
- 世界信息是三列；
- “此刻”读取 CurrentAction；
- 只存在一个“最近”区域；
- 最近可以同时渲染 RecentAction 与 LifeEvent；
- 人生经历模式隐藏“此刻 / 最近”。

关键截图继续保留 Resident Panel、最近列表与 Life History。
