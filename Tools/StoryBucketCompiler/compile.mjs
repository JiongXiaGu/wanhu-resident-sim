import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const generatedDir = join(root, 'Web', 'public', 'generated');

async function readJson(name) {
  return JSON.parse(await readFile(join(generatedDir, name), 'utf8'));
}

const definitions = await readJson('definitions.json');
const occupationGroups = await readJson('occupation-groups.json');

if (definitions.schema !== 'wanhu.resident-definitions.v3') {
  throw new Error(`StoryBucketCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if (occupationGroups.schema !== 'wanhu.occupation-groups.v1') {
  throw new Error(`Unsupported occupation-group schema: ${occupationGroups.schema}`);
}

const occupationById = new Map(definitions.occupations.map((occupation) => [occupation.id, occupation]));
const occupationsByGroup = new Map();
for (const occupation of definitions.occupations) {
  const list = occupationsByGroup.get(occupation.groupId) ?? [];
  list.push(occupation);
  occupationsByGroup.set(occupation.groupId, list);
}

function eventOverlapsStage(event, stage) {
  const minAge = Number(event.eligibility?.minAge ?? 0);
  const maxAge = Number(event.eligibility?.maxAge ?? 999);
  return minAge <= stage.maxAge && maxAge >= stage.minAge;
}

function eventCanMatchGroup(event, groupId) {
  const rule = event.eligibility ?? {};
  if (rule.occupationGroups?.length && !rule.occupationGroups.includes(groupId)) return false;
  if (!rule.occupations?.length) return true;
  return rule.occupations.some((occupationId) => occupationById.get(occupationId)?.groupId === groupId);
}

const buckets = [];
for (const stage of definitions.generation.lifeStages) {
  for (const group of occupationGroups.items) {
    const groupOccupations = occupationsByGroup.get(group.id) ?? [];
    if (!groupOccupations.length) continue;

    const eventIds = definitions.lifeEvents
      .filter((event) => eventOverlapsStage(event, stage) && eventCanMatchGroup(event, group.id))
      .map((event) => event.id)
      .sort();
    if (!eventIds.length) continue;

    const recordableEventIds = definitions.lifeEvents
      .filter((event) => event.recordToHistory && eventIds.includes(event.id))
      .map((event) => event.id)
      .sort();

    buckets.push({
      key: `${stage.id}|${group.id}`,
      lifeStageId: stage.id,
      occupationGroupId: group.id,
      occupationIds: groupOccupations.map((occupation) => occupation.id).sort(),
      eventIds,
      recordableEventIds,
    });
  }
}

const output = {
  schema: 'wanhu.story-buckets.v1',
  dimensions: ['lifeStageId', 'occupationGroupId'],
  buckets,
};

await writeFile(join(generatedDir, 'story-buckets.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Compiled ${buckets.length} Story Buckets from ${definitions.lifeEvents.length} LifeEvents.`);
