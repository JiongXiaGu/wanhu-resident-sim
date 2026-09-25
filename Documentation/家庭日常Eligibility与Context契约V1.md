# 家庭日常 Eligibility 与 Context 契约 V1

## 目的

本契约解决家庭 Routine 的两个问题：

1. **Eligibility**：什么家庭状态下这条 Routine 才允许进入候选池。
2. **Context**：如果 Fact 涉及具体家人，近期记录应保存哪个居民 ID，而不是把姓名直接写进 ECS / Routine 定义。

本阶段只建立契约和运行时匹配能力，不批量新增夫妻、亲子或照料文案。

## 数据权威

V1 只使用当前 Resident Snapshot 已存在的事实：

```text
Resident
├─ spouseId
├─ fatherId
├─ motherId
├─ childCount
└─ householdId

Household
└─ memberIds
```

因此 V1 能可靠判断：

- 是否存在配偶；
- 是否存在父亲或母亲；
- 已记录的孩子数量；
- Household 人数；
- 配偶是否同住；
- 至少一个孩子是否同住；
- 至少一个父母是否同住。

V1 **不增加** sibling / grandparent / guardian / household-role 等推断字段。以后确有玩法需求时再扩展，不从姓氏、年龄差或文本猜亲属关系。

## Authoring：family eligibility

Routine 的 `eligibility` 新增可选 `family`：

```json
{
  "eligibility": {
    "occupations": [],
    "occupationGroups": [],
    "lifeStages": ["adult"],
    "genders": [],
    "weather": [],
    "family": {
      "spouse": "required",
      "minChildren": 1,
      "coResidentChild": "required",
      "minHouseholdSize": 3
    }
  }
}
```

关系条件统一使用：

```text
any        不限制
required   必须存在 / 必须同住
forbidden  必须不存在 / 必须不同住
```

V1 字段：

```text
spouse
parent
minChildren
maxChildren
minHouseholdSize
maxHouseholdSize
coResidentSpouse
coResidentChild
coResidentParent
```

“存在关系”和“同住关系”必须分开。例如有配偶但夫妻暂不同住时：

```json
{
  "spouse": "required",
  "coResidentSpouse": "forbidden"
}
```

这是合法状态，不能把 `spouseId != 0` 自动等价成同一 Household。

Compiler 会拒绝明显矛盾：

- spouse forbidden + coResidentSpouse required；
- parent forbidden + coResidentParent required；
- maxChildren = 0 + coResidentChild required；
- max 小于 min；
- 非法关系枚举或负数。

## Context Contract

Routine 根节点新增可选：

```json
{
  "context": {
    "residentTarget": "child"
  }
}
```

V1 只支持：

```text
spouse
child
parent
household-member
```

语义是：**触发该 Routine 的 Fact 必须携带一个具体 ContextResidentId，并且在记录创建时验证它与主体居民的关系。**

未来近期记录可以保存：

```text
RoutineIndex
VariantIndex
Day
ContextResidentId
```

Context 保存的是居民 ID，不保存姓名字符串。姓名、头像等显示信息由 UI 在打开记录时通过 ResidentId 解析。

本阶段继续禁止在 Routine 文本里直接写：

```text
{resident}
{spouse}
{childName}
```

Family Context V1 只建立 ID 契约，不同时设计模板语言、本地化 Grammar 或实体删除后的降级文案。

## 关系验证

ContextResidentId 必须满足：

- spouse：`subject.spouseId == target.id`
- child：`target.fatherId == subject.id || target.motherId == subject.id`
- parent：`subject.fatherId == target.id || subject.motherId == target.id`
- household-member：目标与主体同 household，且目标不是主体本人

正式 ResidentLifeRecordSystem 在 Fact → Routine Record 时做这次验证。不能由 UI 打开面板时临时“找一个孩子”来补 Context。

## Generator 生命周期修正

此前 ResidentGenerator 在 `createResident()` 内立即生成 Recent Routine。当时 spouseId / fatherId / motherId / childCount 尚未完整赋值，因此任何 Family Eligibility 都会得到错误结果。

V1 调整为：

```text
创建 Household 成员
→ 完成 spouse / parent / child 关系
→ 形成 Household.memberIds
→ 使用居民原本保留的 RNG 状态生成 Recent Routine
```

居民自己的 RNG 状态被原样保留，所以没有为了 Family Contract 重置随机序列。现有无 Family 条件的 Routine 候选池不变。

Web 运行时也使用当前 snapshot + household 实时判断 Family Eligibility，因此 LifeEvent 导致婚姻或 Household 变化后，之后生成的 Routine 会看到新状态。

## 当前阶段边界

Family Contract V1 已进入真实内容使用阶段。R3D 完成后当前有 **20 个 family-constrained Routine**；`context.residentTarget` 仍保持 **0**，留给 R3E 单独接入。

Coverage 输出：

```text
routines.familyContract.familyConstrainedDefinitions
routines.familyContract.contextResidentTargetDefinitions
routines.familyContract.contextTargets[]
```

当前 Coverage 应固定看到 family-constrained = 20、context target = 0；R3E 才允许 Context 目标条目增长。

## 后续任务审查

### R3C：Family Contract V1（已完成）

已完成 Schema、Compiler、Web/Generator 匹配、ContextResidentId 边界和 Review Probe；该契约批没有增加家庭素材。

### R3D：家庭内容 Batch 1（已完成）

已新增 20 条 Family Routine / 40 个 Variant，覆盖：

- 配偶存在且同住；
- 有孩子且与孩子同住；
- 有父母且与父母同住；
- Household 3～4 人以上的共同生活；
- 配偶 / 父母 / 子女关系存在但不同住。

全部文本自包含，不使用姓名占位符，也不声明 `context.residentTarget`。先通过这一批证明 Eligibility 能真实驱动内容候选池。

### R3E：家庭 Context Batch + 收尾（当前）

增加真正需要 `context.residentTarget` 的条目，验证 Fact 携带具体家人 ID、记录保存 ContextResidentId、关系变化后的降级策略，并做 Family Coverage / 去重审查。

R3E 完成后才结束 R3。

### R4A：Environment Eligibility Contract

当前 Routine 虽已有 `weather[]`，但 Web 合成器会直接排除所有 weather 条件，且没有稳定的 season / daypart 上下文。因此不能直接批量写“雨天、夜间、冬季”素材。

先设计：

- Weather Context；
- season / daypart；
- Fact 发生时的环境快照；
- 环境条件如何写进记录而不是打开 UI 时重新判断。

### R4B：环境内容

环境契约稳定后再扩天气、昼夜、季节、河道/街巷状态日常。

### R5A：Calendar / Festival Contract

`custom` 目前保持 0 是正确的。庙会、节令、祭祀等内容必须有日历 / 节令条件，不能全年随机出现。

### R5B：民俗内容

日历条件完成后再扩节令、庙会、社火、茶楼、戏园等文化生活。

### R6：最终素材库审查

重点不是继续增加数量，而是：

- Fact 是否真的可由玩法触发；
- Routine / Fact / Context 是否重复；
- 职业、年龄、家庭、环境 Coverage；
- Variant 长度与近义重复；
- RuntimeIndex / Stable ID / Save remap；
- UI 小环密度与重复感；
- Web 语义是否足够支持后续 Unity 实现。

R6 完成后应停止无目标扩库，转入 ResidentFactEvent → ResidentLifeRecordSystem 的正式 Unity 映射准备。
