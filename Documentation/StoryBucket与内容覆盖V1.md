# Story Bucket 与内容覆盖 V1

## 目标

当 LifeEvent 数量从几十条扩大到几百、几千条以后，居民低频更新不能每次扫描完整故事库。

V1 先建立两级粗筛：

```text
LifeStage
+
OccupationGroup
↓
Story Bucket
↓
Occupation / Gender / Family / LifeTag / World 条件继续过滤
↓
加权抽取
```

Web Demo 当前仍可以直接扫描定义；`story-buckets.json` 先作为未来 Unity Runtime 与 Content Compiler 的编译产物验证。

---

## Occupation Group

Authoring：

```text
Content/Occupations/occupation-groups.json
```

Occupation Definition 必须拥有稳定 `groupId`：

```json
{
  "id": "occupation.carpenter",
  "groupId": "occupation-group.craft",
  "name": "木工"
}
```

当前组包括：

```text
child
education
craft
trade
medical
infrastructure
agriculture
transport
performance
retired
```

Occupation Group 是故事池粗筛维度，不代表居民关系、社会阶层或职业继承系统。

---

## LifeEvent 对组的条件

LifeEvent 仍可以精确写：

```json
{
  "eligibility": {
    "occupations": ["occupation.carpenter"]
  }
}
```

也可以写更粗的：

```json
{
  "eligibility": {
    "occupationGroups": ["occupation-group.craft"]
  }
}
```

如果同时存在 `occupations` 与 `occupationGroups`，两类条件都必须满足。

这样可以把真正通用的“工匠故事”放到组级别，而木匠、陶工独有事件继续使用具体职业 ID。

---

## Story Bucket 输出

`StoryBucketCompiler` 读取 compiled definitions，按当前 Generation 的人生阶段和 Occupation Group 编译：

```text
Web/public/generated/story-buckets.json
```

结构：

```json
{
  "schema": "wanhu.story-buckets.v1",
  "dimensions": ["lifeStageId", "occupationGroupId"],
  "buckets": [
    {
      "key": "adult|occupation-group.craft",
      "lifeStageId": "adult",
      "occupationGroupId": "occupation-group.craft",
      "occupationIds": ["occupation.carpenter", "occupation.potter"],
      "eventIds": ["..."],
      "recordableEventIds": ["..."]
    }
  ]
}
```

Bucket 只负责减少候选集，不替代最终 Eligibility。

例如某事件只允许木工：

```text
adult + craft
↓
Bucket 中可以包含它
↓
实际居民是陶工
↓
Occupation 精确条件再次过滤
↓
事件不入选
```

这样编译器不需要为每个职业复制一整套桶，同时 Runtime 仍然正确。

---

## Runtime 目标

未来 Unity 中：

```text
Resident LifeStage
+
Occupation RuntimeIndex → Group RuntimeIndex
↓
Blob 中定位 Story Bucket
↓
遍历几十个候选，而不是几千个 Definition
↓
检查 LifeTagBits / FamilyBits / WorldSnapshot
↓
Weighted Pick
```

Story Bucket 是只读内容数据，适合放进 `ResidentContentBlob`。

---

## Coverage

`content-coverage.json` 现在同时统计：

```text
LifeStage → LifeEvent / Life Chapter 数量
Occupation → LifeEvent / Life Chapter 数量
OccupationGroup → Occupation / LifeEvent / Life Chapter 数量
LifeTag → 被条件引用 / 被 Effect 产出情况
Name → 各池数量
```

当前 warning 不阻断 Build。

后续批量生产时优先使用 Coverage 选择任务，例如：

```text
医疗 × 青年：内容偏少
退养 × 晚年：已有基础
商贸 × 壮年：普通事件足够，重要章节不足
某些 LifeTag：只有定义，没有任何故事产出
```

这比按总条数盲目扩内容更适合长期维护。

---

## 当前边界

V1 Story Bucket 暂不加入：

- 地区
- 季节
- 天气
- 城市政策
- Family Archetype
- LifeTag 组合

这些条件仍在最终 Eligibility 阶段判断。

只有在真实数据表明某个维度导致 Bucket 过大时，才增加新的预编译维度，避免为了理论性能把内容结构过度复杂化。
