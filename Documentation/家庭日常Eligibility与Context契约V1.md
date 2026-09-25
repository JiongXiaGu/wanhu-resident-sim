# 家庭日常 Eligibility 与 Context 契约 V1

这套 Family Eligibility / Context Resolver 设计已经停止继续使用。

新的原则是：家庭、朋友、地点等目标由真实 Behaviour 在执行时确定，并直接写入 `ResidentActionCompletedEvent`；RecentActionRecordSystem 不再扫描 Household 或居民关系来寻找 Context。

当前权威设计见：

```text
Documentation/居民行为与最近生活记录.md
Documentation/居民事实事件与人生记录运行时设计.md
```

现有 Family Routine / Context 代码将在 Resident Action Life 重构中与 Routine V2 一起删除，不保留旧数据兼容。历史实现从 Git 获取。
