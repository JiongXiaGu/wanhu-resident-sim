import type {
  HouseholdRecord,
  LifeEventDefinition,
  LifeEventStageDefinition,
  ResidentDefinitions,
  ResidentMajorLifeEvent,
  ResidentRecord,
  ResidentWorldSnapshot,
} from '../domain/resident';
import { ageAtDay, occupationFor } from '../domain/resident';

export type LifeEventAssignment = {
  eventId: string;
  startDay: number;
  stage2Day: number;
  stage3Day: number;
};

export type LifeFeedEntry = {
  id: string;
  day: number;
  kind: 'event' | 'routine' | 'history';
  title: string;
  text?: string;
  stage?: 0 | 1 | 2;
  sourceLabel?: string;
};

export type ResidentLifeView = {
  event: LifeEventDefinition;
  currentStage: 0 | 1 | 2;
  currentStageDefinition: LifeEventStageDefinition;
  eventEntries: LifeFeedEntry[];
  priorEventEntries: LifeFeedEntry[];
  routines: LifeFeedEntry[];
  history: ResidentMajorLifeEvent[];
  activity: string;
  showCurrentEvent: boolean;
};

const COMPLETED_EVENT_VISIBLE_DAYS = 14;

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rangeValue(seed: number, salt: string, min: number, max: number) {
  if (max <= min) return min;
  return min + (hashText(`${seed}:${salt}`) % (max - min + 1));
}

function weightedPick<T extends { weight: number }>(seed: number, salt: string, items: T[]) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  if (total <= 0) return items[0];
  let cursor = (hashText(`${seed}:${salt}`) / 4294967296) * total;
  for (const item of items) {
    cursor -= Math.max(0, item.weight);
    if (cursor <= 0) return item;
  }
  return items.at(-1)!;
}

function storyBucketCandidates(
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  age: number,
) {
  const occupation = occupationFor(definitions, resident.occupationId);
  const lifeStage = definitions.generation.lifeStages.find((stage) => age >= stage.minAge && age <= stage.maxAge);
  if (!occupation || !lifeStage) return definitions.lifeEvents;

  const key = `${lifeStage.id}|${occupation.groupId}`;
  const bucket = definitions.storyBuckets.buckets.find((item) => item.key === key);
  if (!bucket) return [];

  const candidateIds = new Set(bucket.eventIds);
  return definitions.lifeEvents.filter((event) => candidateIds.has(event.id));
}

export function eligibleLifeEvents(
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  definitions: ResidentDefinitions,
  currentDay: number,
) {
  const age = ageAtDay(resident, currentDay, definitions.generation.daysPerYear);
  const occupation = occupationFor(definitions, resident.occupationId);
  const recordedStoryIds = new Set(
    resident.majorLifeHistory
      .map((entry) => entry.sourceEventId)
      .filter((eventId): eventId is string => Boolean(eventId)),
  );
  const lifeTags = new Set(resident.lifeTags ?? []);
  const bucketCandidates = storyBucketCandidates(resident, definitions, age);

  return bucketCandidates.filter((event) => {
    const rule = event.eligibility;
    if (event.recordToHistory && recordedStoryIds.has(event.id)) return false;
    if (rule.occupations?.length && !rule.occupations.includes(resident.occupationId)) return false;
    if (rule.occupationGroups?.length && (!occupation || !rule.occupationGroups.includes(occupation.groupId))) return false;
    if (rule.genders?.length && !rule.genders.includes(resident.gender)) return false;
    if (rule.minAge !== undefined && age < rule.minAge) return false;
    if (rule.maxAge !== undefined && age > rule.maxAge) return false;
    if (rule.minChildren !== undefined && resident.childCount < rule.minChildren) return false;
    if (rule.requireSpouse !== undefined && Boolean(resident.spouseId) !== rule.requireSpouse) return false;
    if (rule.requiredTags?.some((tagId) => !lifeTags.has(tagId))) return false;
    if (rule.forbiddenTags?.some((tagId) => lifeTags.has(tagId))) return false;
    if (!household && (rule.minChildren || rule.requireSpouse)) return false;
    return true;
  });
}

export function chooseLifeEvent(
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  definitions: ResidentDefinitions,
  currentDay: number,
  salt = 'initial',
) {
  const eligible = eligibleLifeEvents(resident, household, definitions, currentDay);
  if (!eligible.length) return definitions.lifeEvents[0];
  return weightedPick(resident.seed, salt, eligible);
}

export function assignmentForEvent(
  resident: ResidentRecord,
  event: LifeEventDefinition,
  startDay: number,
): LifeEventAssignment {
  const stage2Delay = rangeValue(
    resident.seed,
    `${event.id}:stage2`,
    event.stages[1].delayDays.min,
    event.stages[1].delayDays.max,
  );
  const stage3Delay = rangeValue(
    resident.seed,
    `${event.id}:stage3`,
    event.stages[2].delayDays.min,
    event.stages[2].delayDays.max,
  );
  const stage2Day = startDay + stage2Delay;
  return {
    eventId: event.id,
    startDay,
    stage2Day,
    stage3Day: stage2Day + stage3Delay,
  };
}

export function stageForAssignment(gameDay: number, assignment: LifeEventAssignment): 0 | 1 | 2 {
  if (gameDay >= assignment.stage3Day) return 2;
  if (gameDay >= assignment.stage2Day) return 1;
  return 0;
}

export function nextStageDay(gameDay: number, assignment: LifeEventAssignment) {
  const stage = stageForAssignment(gameDay, assignment);
  if (stage === 0) return assignment.stage2Day;
  if (stage === 1) return assignment.stage3Day;
  return gameDay;
}

function eventEntries(event: LifeEventDefinition, assignment: LifeEventAssignment, stage: 0 | 1 | 2) {
  const days = [assignment.startDay, assignment.stage2Day, assignment.stage3Day] as const;
  return event.stages.slice(0, stage + 1).map<LifeFeedEntry>((definition, index) => ({
    id: `${event.id}:stage:${index + 1}`,
    day: days[index],
    kind: 'event',
    title: definition.title,
    text: definition.text,
    stage: index as 0 | 1 | 2,
    sourceLabel: event.source?.label,
  }));
}

function routinePool(resident: ResidentRecord, definitions: ResidentDefinitions) {
  const specific = definitions.routines.filter((item) => item.occupation === resident.occupationId && !item.weather && !item.season);
  const generic = definitions.routines.filter((item) => item.occupation === null && !item.weather && !item.season);
  return specific.length ? [...specific, ...generic] : generic;
}

function routineEntries(
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  baselineDay: number,
  gameDay: number,
  blockedDays: number[],
) {
  const entries: LifeFeedEntry[] = resident.recentLifeLog
    .filter((entry) => entry.day <= gameDay)
    .map((entry) => ({ id: entry.id, day: entry.day, kind: 'routine', title: entry.title, text: entry.text }));

  if (gameDay <= baselineDay) return entries.sort((a, b) => b.day - a.day);
  const pool = routinePool(resident, definitions);
  if (!pool.length) return entries.sort((a, b) => b.day - a.day);

  const { min, max } = definitions.generation.routineIntervalDays;
  let day = baselineDay + 2 + (resident.seed % 4);
  let previousText = entries[0]?.title ?? '';
  while (day <= gameDay) {
    if (!blockedDays.some((blocked) => Math.abs(blocked - day) <= 1)) {
      const startIndex = hashText(`${resident.seed}:routine:${day}`) % pool.length;
      let template = pool[startIndex];
      for (let offset = 0; offset < pool.length; offset += 1) {
        const candidate = pool[(startIndex + offset) % pool.length];
        if (candidate.text !== previousText) {
          template = candidate;
          break;
        }
      }
      entries.push({
        id: `${resident.id}:${template.id}:${day}`,
        day,
        kind: 'routine',
        title: template.text,
      });
      previousText = template.text;
    }
    day += rangeValue(resident.seed, `routine-interval:${day}`, min, max);
  }
  return entries.sort((a, b) => b.day - a.day);
}

function completedEventChapter(
  resident: ResidentRecord,
  event: LifeEventDefinition,
  assignment: LifeEventAssignment,
  gameDay: number,
): ResidentMajorLifeEvent | undefined {
  if (!event.recordToHistory || gameDay < assignment.stage3Day) return undefined;
  return {
    id: `${resident.id}:story:${event.id}:${assignment.stage3Day}`,
    day: assignment.stage3Day,
    type: 'story',
    title: event.title,
    sourceEventId: event.id,
  };
}

export function buildResidentLifeView(
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  assignment: LifeEventAssignment,
  gameDay: number,
): ResidentLifeView {
  const event = definitions.lifeEvents.find((item) => item.id === assignment.eventId) ?? definitions.lifeEvents[0];
  const stage = stageForAssignment(gameDay, assignment);
  const eventHistory = eventEntries(event, assignment, stage);
  const blockedDays = eventHistory.map((entry) => entry.day);
  const routines = routineEntries(resident, definitions, snapshot.currentDay, gameDay, blockedDays)
    .filter((entry) => !blockedDays.some((blocked) => Math.abs(blocked - entry.day) <= 1))
    .slice(0, 4);
  const occupation = occupationFor(definitions, resident.occupationId);
  const stageDefinition = event.stages[stage];
  const offDay = ((gameDay + resident.seed) % 7) === 0;
  const defaultActivity = offDay
    ? occupation?.offActivity ?? '正在家里歇着'
    : occupation?.workActivity ?? '正在忙今天的事情';
  const showCurrentEvent = stage < 2 || gameDay - assignment.stage3Day <= COMPLETED_EVENT_VISIBLE_DAYS;
  const runtimeChapter = completedEventChapter(resident, event, assignment, gameDay);
  const history = resident.majorLifeHistory.filter((entry) => entry.day <= gameDay);
  if (runtimeChapter && !history.some((entry) => entry.id === runtimeChapter.id || entry.sourceEventId === runtimeChapter.sourceEventId)) {
    history.push(runtimeChapter);
  }
  history.sort((left, right) => right.day - left.day);

  return {
    event,
    currentStage: stage,
    currentStageDefinition: stageDefinition,
    eventEntries: eventHistory,
    priorEventEntries: eventHistory.slice(0, -1).reverse(),
    routines,
    history,
    activity: (showCurrentEvent ? stageDefinition.activityOverride : undefined) ?? defaultActivity,
    showCurrentEvent,
  };
}
