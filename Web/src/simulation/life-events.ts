import type {
  HouseholdRecord,
  LifeEventDefinition,
  LifeEventStageDefinition,
  LifeEventStructuralRequest,
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
  routineId?: string;
  routineRuntimeIndex?: number;
  variantIndex?: number;
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
const appliedPrototypeEffectKeys = new Set<string>();

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

function eventPersistsAsChapter(event: LifeEventDefinition) {
  return Boolean(event.recordToHistory || event.effects?.structuralRequests?.length);
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
    if (eventPersistsAsChapter(event) && recordedStoryIds.has(event.id)) return false;
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
  const occupation = occupationFor(definitions, resident.occupationId);
  return definitions.routines.filter((item) => {
    const rule = item.eligibility;
    if (rule.occupations.length && !rule.occupations.includes(resident.occupationId)) return false;
    if (rule.occupationGroups.length && (!occupation || !rule.occupationGroups.includes(occupation.groupId))) return false;
    if (rule.lifeStages.length && !rule.lifeStages.includes(resident.lifeStage)) return false;
    if (rule.genders.length && !rule.genders.includes(resident.gender)) return false;
    if (rule.weather.length) return false;
    return true;
  });
}

function routineVariantFor(resident: ResidentRecord, routine: ResidentDefinitions['routines'][number], day: number) {
  const total = routine.variants.reduce((sum, variant) => sum + Math.max(0, variant.weight), 0);
  let cursor = (hashText(`${resident.seed}:routine-variant:${routine.id}:${day}`) / 4294967296) * total;
  for (let index = 0; index < routine.variants.length; index += 1) {
    cursor -= Math.max(0, routine.variants[index].weight);
    if (cursor <= 0) return { index, variant: routine.variants[index] };
  }
  const index = routine.variants.length - 1;
  return { index, variant: routine.variants[index] };
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
    .map((entry) => ({
      id: entry.id, day: entry.day, kind: 'routine', title: entry.title, text: entry.text,
      routineId: entry.routineId, routineRuntimeIndex: entry.routineRuntimeIndex, variantIndex: entry.variantIndex,
    }));

  if (gameDay <= baselineDay) return entries.sort((a, b) => b.day - a.day);
  const pool = routinePool(resident, definitions);
  if (!pool.length) return entries.sort((a, b) => b.day - a.day);

  const { min, max } = definitions.generation.routineIntervalDays;
  const lastRoutineDay = new Map<string, number>();
  for (const entry of entries) if (entry.routineId) lastRoutineDay.set(entry.routineId, Math.max(lastRoutineDay.get(entry.routineId) ?? -Infinity, entry.day));
  let day = baselineDay + 2 + (resident.seed % 4);
  let previousRoutineId = [...entries].sort((a, b) => b.day - a.day)[0]?.routineId ?? '';
  while (day <= gameDay) {
    if (!blockedDays.some((blocked) => Math.abs(blocked - day) <= 1)) {
      const startIndex = hashText(`${resident.seed}:routine:${day}`) % pool.length;
      let template = pool[startIndex];
      let found = false;
      for (let offset = 0; offset < pool.length; offset += 1) {
        const candidate = pool[(startIndex + offset) % pool.length];
        const previousDay = lastRoutineDay.get(candidate.id);
        if (candidate.id === previousRoutineId) continue;
        if (previousDay !== undefined && day - previousDay < candidate.cooldownDays) continue;
        template = candidate;
        found = true;
        break;
      }
      if (found || !lastRoutineDay.has(template.id) || day - (lastRoutineDay.get(template.id) ?? day) >= template.cooldownDays) {
        const { index: variantIndex, variant } = routineVariantFor(resident, template, day);
        entries.push({
          id: `${resident.id}:${template.id}:${day}`,
          day,
          kind: 'routine',
          routineId: template.id,
          routineRuntimeIndex: template.runtimeIndex,
          variantIndex,
          title: variant.text,
        });
        previousRoutineId = template.id;
        lastRoutineDay.set(template.id, day);
      }
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
  if (!eventPersistsAsChapter(event) || gameDay < assignment.stage3Day) return undefined;
  return {
    id: `${resident.id}:story:${event.id}:${assignment.stage3Day}`,
    day: assignment.stage3Day,
    type: 'story',
    title: event.title,
    sourceEventId: event.id,
  };
}

function isDirectFamilyRelation(left: ResidentRecord, right: ResidentRecord) {
  return left.fatherId === right.id
    || left.motherId === right.id
    || right.fatherId === left.id
    || right.motherId === left.id;
}

function chooseMarriagePartner(
  resident: ResidentRecord,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  currentDay: number,
) {
  const householdById = new Map(snapshot.households.map((item) => [item.id, item]));
  const residentAge = ageAtDay(resident, currentDay, definitions.generation.daysPerYear);
  const candidates = snapshot.residents.filter((candidate) => {
    if (candidate.id === resident.id) return false;
    if (candidate.gender === resident.gender) return false;
    if (candidate.spouseId) return false;
    if (candidate.householdId === resident.householdId) return false;
    if (isDirectFamilyRelation(resident, candidate)) return false;
    const candidateAge = ageAtDay(candidate, currentDay, definitions.generation.daysPerYear);
    if (candidateAge < 18 || candidateAge > 55) return false;
    if (Math.abs(candidateAge - residentAge) > 16) return false;
    return true;
  });

  candidates.sort((left, right) => {
    const leftHouseholdSize = householdById.get(left.householdId)?.memberIds.length ?? 99;
    const rightHouseholdSize = householdById.get(right.householdId)?.memberIds.length ?? 99;
    const leftSingleHome = leftHouseholdSize === 1 ? 0 : 1;
    const rightSingleHome = rightHouseholdSize === 1 ? 0 : 1;
    if (leftSingleHome !== rightSingleHome) return leftSingleHome - rightSingleHome;

    const leftSameDistrict = left.districtId === resident.districtId ? 0 : 1;
    const rightSameDistrict = right.districtId === resident.districtId ? 0 : 1;
    if (leftSameDistrict !== rightSameDistrict) return leftSameDistrict - rightSameDistrict;

    const leftAgeGap = Math.abs(ageAtDay(left, currentDay, definitions.generation.daysPerYear) - residentAge);
    const rightAgeGap = Math.abs(ageAtDay(right, currentDay, definitions.generation.daysPerYear) - residentAge);
    if (leftAgeGap !== rightAgeGap) return leftAgeGap - rightAgeGap;

    return hashText(`${resident.seed}:marriage:${left.id}`) - hashText(`${resident.seed}:marriage:${right.id}`);
  });

  return candidates[0];
}

function applyMarriageRequest(
  resident: ResidentRecord,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  assignment: LifeEventAssignment,
) {
  if (resident.spouseId) return true;
  const partner = chooseMarriagePartner(resident, snapshot, definitions, assignment.stage3Day);
  if (!partner) return false;

  const targetHousehold = snapshot.households.find((item) => item.id === resident.householdId);
  const sourceHousehold = snapshot.households.find((item) => item.id === partner.householdId);
  if (!targetHousehold) return false;

  if (sourceHousehold && sourceHousehold.id !== targetHousehold.id) {
    sourceHousehold.memberIds = sourceHousehold.memberIds.filter((id) => id !== partner.id);
  }
  if (!targetHousehold.memberIds.includes(partner.id)) targetHousehold.memberIds.push(partner.id);

  partner.householdId = resident.householdId;
  partner.districtId = resident.districtId;
  resident.spouseId = partner.id;
  partner.spouseId = resident.id;

  const partnerHistoryId = `${partner.id}:marriage:${assignment.stage3Day}`;
  if (!partner.majorLifeHistory.some((entry) => entry.id === partnerHistoryId)) {
    partner.majorLifeHistory.push({
      id: partnerHistoryId,
      day: assignment.stage3Day,
      type: 'marriage',
      title: '成了家',
    });
  }
  return true;
}

function applyChangeOccupationRequest(
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  assignment: LifeEventAssignment,
  request: Extract<LifeEventStructuralRequest, { type: 'changeOccupation' }>,
) {
  const occupation = occupationFor(definitions, request.occupationId);
  if (!occupation) return false;
  resident.occupationId = occupation.id;
  resident.employmentStartDay = assignment.stage3Day;
  resident.workplaceId = occupation.workplaceType
    ? 3000 + (hashText(`${resident.seed}:${occupation.workplaceType}:${resident.districtId}`) % 700)
    : 0;
  return true;
}

function applyMoveHouseholdRequest(
  resident: ResidentRecord,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  request: Extract<LifeEventStructuralRequest, { type: 'moveHousehold' }>,
) {
  const household = snapshot.households.find((item) => item.id === resident.householdId);
  if (!household) return false;

  const districts = definitions.generation.districts.filter((district) => {
    if (request.policy === 'same-district') return district.id === household.districtId;
    if (request.policy === 'different-district') return district.id !== household.districtId;
    return true;
  });
  if (!districts.length) return false;
  const district = districts[hashText(`${resident.seed}:move:${request.policy}`) % districts.length];
  household.districtId = district.id;
  household.homeId = 9000 + (hashText(`${resident.seed}:home:${district.id}`) % 900);
  for (const memberId of household.memberIds) {
    const member = snapshot.residents.find((item) => item.id === memberId);
    if (member) member.districtId = district.id;
  }
  return true;
}

function applyStructuralRequest(
  resident: ResidentRecord,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  assignment: LifeEventAssignment,
  request: LifeEventStructuralRequest,
) {
  if (request.type === 'changeOccupation') {
    return applyChangeOccupationRequest(resident, definitions, assignment, request);
  }
  if (request.type === 'moveHousehold') {
    return applyMoveHouseholdRequest(resident, snapshot, definitions, request);
  }
  if (request.type === 'formMarriage') {
    return applyMarriageRequest(resident, snapshot, definitions, assignment);
  }
  // addChild requires creating a real child Resident, so the Web prototype leaves it unapplied until that playtest exists.
  return false;
}

function applyPrototypeCompletedEvent(
  resident: ResidentRecord,
  event: LifeEventDefinition,
  assignment: LifeEventAssignment,
  snapshot: ResidentWorldSnapshot,
  definitions: ResidentDefinitions,
  gameDay: number,
) {
  if (gameDay < assignment.stage3Day) return;
  const key = `${resident.id}:${event.id}:${assignment.startDay}`;
  if (appliedPrototypeEffectKeys.has(key)) return;

  const alreadyRecorded = resident.majorLifeHistory.some((entry) =>
    entry.sourceEventId === event.id && entry.day === assignment.stage3Day);
  if (alreadyRecorded) {
    appliedPrototypeEffectKeys.add(key);
    return;
  }

  let structuralSucceeded = true;
  for (const request of event.effects?.structuralRequests ?? []) {
    if (!applyStructuralRequest(resident, snapshot, definitions, assignment, request)) structuralSucceeded = false;
  }
  if (!structuralSucceeded) return;

  const tags = new Set(resident.lifeTags ?? []);
  for (const tagId of event.effects?.removeTags ?? []) tags.delete(tagId);
  for (const tagId of event.effects?.addTags ?? []) tags.add(tagId);
  resident.lifeTags = [...tags].sort();

  const chapter = completedEventChapter(resident, event, assignment, gameDay);
  if (chapter && !resident.majorLifeHistory.some((entry) => entry.id === chapter.id || entry.sourceEventId === chapter.sourceEventId)) {
    resident.majorLifeHistory.push(chapter);
  }

  appliedPrototypeEffectKeys.add(key);
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
  if (stage === 2) applyPrototypeCompletedEvent(resident, event, assignment, snapshot, definitions, gameDay);

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
