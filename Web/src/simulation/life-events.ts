import type {
  HouseholdRecord,
  LifeEventDefinition,
  ResidentDefinitions,
  ResidentLifeChapter,
  ResidentRecord,
} from '../domain/resident';
import { ageAtDay, occupationFor } from '../domain/resident';
import { currentActionText, recentActionEntries } from './recent-actions';

export type RecentFeedEntry =
  | { id: string; day: number; kind: 'action'; text: string }
  | { id: string; day: number; kind: 'life-event'; eventId: string; title: string; text: string };

export type ResidentLifeView = {
  recentEntries: RecentFeedEntry[];
  history: ResidentLifeChapter[];
  currentActionText: string;
};

function storyBucketCandidates(
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  age: number,
) {
  const occupation = occupationFor(definitions, resident.occupationId);
  const lifeStage = definitions.generation.lifeStages.find((stage) => age >= stage.minAge && age <= stage.maxAge);
  if (!occupation || !lifeStage) return definitions.lifeEvents;

  const bucket = definitions.storyBuckets.buckets.find((item) => item.key === `${lifeStage.id}|${occupation.groupId}`);
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
  const recordedEventIds = new Set(
    resident.lifeChapters
      .map((entry) => entry.sourceEventId)
      .filter((eventId): eventId is string => Boolean(eventId)),
  );
  const lifeTags = new Set(resident.lifeTags);
  const bucketCandidates = storyBucketCandidates(resident, definitions, age);

  return bucketCandidates.filter((event: LifeEventDefinition) => {
    const rule = event.eligibility;
    if (event.recordToHistory && recordedEventIds.has(event.id)) return false;
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

export function buildResidentLifeView(
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  definitions: ResidentDefinitions,
  gameDay: number,
): ResidentLifeView {
  void household;

  const actions: RecentFeedEntry[] = recentActionEntries(resident, definitions, gameDay).map((entry) => ({
    id: entry.id,
    day: entry.day,
    kind: 'action',
    text: entry.text,
  }));

  const events: RecentFeedEntry[] = resident.recentLifeEvents
    .filter((record) => record.day <= gameDay)
    .map((record) => {
      const definition = definitions.lifeEvents.find((item) => item.id === record.eventId);
      if (!definition) return undefined;
      return {
        id: record.id,
        day: record.day,
        kind: 'life-event' as const,
        eventId: record.eventId,
        title: definition.title,
        text: definition.text,
      };
    })
    .filter((entry): entry is Extract<RecentFeedEntry, { kind: 'life-event' }> => Boolean(entry));

  const recentEntries = [...actions, ...events]
    .sort((left, right) => right.day - left.day || (left.kind === 'life-event' ? -1 : 1))
    .slice(0, 5);

  const history = resident.lifeChapters
    .filter((entry) => entry.day <= gameDay)
    .sort((left, right) => right.day - left.day);

  return {
    recentEntries,
    history,
    currentActionText: currentActionText(resident.currentAction, definitions),
  };
}
