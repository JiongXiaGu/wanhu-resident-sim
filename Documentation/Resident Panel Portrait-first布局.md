# Resident Panel Portrait-first 布局

## 目标

居民面板改为左下 Context Surface 的人物信息面板：头像和姓名先回答“这个人是谁”，当前 Activity / LifeEvent 回答“他现在在经历什么”，世界关联和最近记录退到辅助层。参考 `wanhu-ui-prototype` 的 Left Context Surface，但不复制其业务组件。

## 信息层级

1. **人物 Hero**：112px 头像、姓名、年龄职业、地区/家庭、关注与编辑头像。头像是第一视觉焦点；编辑动作不能比人物本身更抢眼。
2. **世界信息**：住所、工作地、家庭三列轻量信息；只在可定位项 hover 时提亮，不给三列各套独立卡片。
3. **此刻**：Section Label + 熟铜状态点 + 当前 Activity。动态状态高于历史摘要。
4. **正在经历 / 最近发生**：取消大圆角卡套卡，使用留白和 2px 熟铜竖线组织事件；标题和第一人称正文保持现有内容契约。
5. **最近**：固定时间列的生活流水，弱分隔、轻 hover，不做后台表格式边框。
6. **Footer**：固定为“人物关系 / 人生经历”。关注已移入 Hero；Footer 只负责深入导航。

## Surface 契约

面板逻辑宽度 420px、圆角 18px、默认最大高度 700px；Header/Footer 固定，中间 Body 独立滚动。背景使用中性 Smoked Graphite：

- Context background：`rgba(45,47,44,.89)`
- Edge：`rgba(238,233,223,.095)`
- Rule：`rgba(238,233,223,.065)`
- Primary text：暖白 `#eee9df`
- Accent：Aged Brass `#a9844b / #c5a469`
- Blur：16px，仅用于让世界低频色彩透入，不通过更高 Blur 补文字可读性。

绿色来自世界场景透色，不再把居民面板本体直接染成深绿。

## 交互边界

住所、工作地仍只触发现有镜头定位提示；家庭摘要不承担展开动作，人物关系统一由 Footer 打开。关注仍是 Web Demo 本地状态。编辑头像仍走原 Avatar Workshop。人生经历的时间轴、memoryText、当前 Activity、LifeEvent 三阶段、家庭结构效果和居民绑定不改。

不新增居民 Summary，不把 RecentAction 写入永久历史，不改变正式 portrait DNA、头像保存键、故事 Content、职业与家庭数据。UI 重构不能以“更好看”为理由改变模拟语义。

## Review

Resident Visual Review 需要额外断言：头像至少 96px、Hero 高度至少 136px、面板维持 420px Context Surface 宽度、关注位于 Hero、世界信息是三列。Artifact 增加 `01b-resident-panel-portrait-first.png`，并继续保留 LifeEvent、人生经历、家庭结构与后续故事的原有截图/断言。
