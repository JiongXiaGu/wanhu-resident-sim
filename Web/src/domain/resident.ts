export type Gender = 'male' | 'female';

export type LifeStageId = 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-age' | 'elder';

export type ResidentLifeLogRecord = {
  id: string;
  day: number;
  kind: 'routine' | 'story' | 'state';
  title: string;
  text?: string;
};

export type ResidentMajorLifeEvent = {
  id: string;
  day: number;
  type: 'employment' | 'marriage' | 'family' | 'move' | 'story' | string;
  title: string;
};

export type ResidentRecord = {
  id: number;
  seed: number;
  displayName: string;
  surname: string;
  birthDay: number;
  gender: Gender;
  portraitSeed: number;
  districtId: string;
  occupationId: string;
  workplaceId: number;
  employmentStartDay: number;
  householdId: number;
  fatherId: number;
  motherId: number;
  spouseId: number;
  childCount: number;
  nextUpdateDay: number;
  lifeStage: LifeStageId;
  stateBits: number;
  activeStoryId: string | null;
  recentLifeLog: ResidentLifeLogRecord[];
  majorLifeHistory: ResidentMajorLifeEvent[];
};

export type HouseholdRecord = {
  id: number;
  homeId: number;
  districtId: string;
  memberIds: number[];
};

export type ResidentWorldSnapshot = {
  schema: 'wanhu.resident-snapshot.v1';
  citySeed: number;
  currentDay: number;
  residents: ResidentRecord[];
  households: HouseholdRecord[];
};

export type OccupationDefinition = {
  id: string;
  name: string;
  workplaceType: string | null;
  minAge: number;
  maxAge: number;
  weight: number;
  genders?: Gender[];
  storyHints: string[];
  workActivity: string;
  offActivity: string;
};

export type RoutineDefinition = {
  id: string;
  occupation: string | null;
  text: string;
  weight: number;
  weather?: string[];
  season?: string[];
};

export type ResidentGenerationDefinition = {
  schema: 'wanhu.resident-generation.v1';
  citySeed: number;
  residentCount: number;
  currentDay: number;
  daysPerYear: number;
  recentLifeLogCapacity: number;
  routineWindowDays: number;
  routineIntervalDays: { min: number; max: number };
  lifeStages: Array<{ id: LifeStageId; minAge: number; maxAge: number }>;
  districts: Array<{ id: string; name: string }>;
  householdArchetypes: Array<{ id: string; weight: number }>;
};

export type ResidentDefinitions = {
  schema: 'wanhu.resident-definitions.v1';
  names: {
    surnames: string[];
    maleGivenNames: string[];
    femaleGivenNames: string[];
  };
  occupations: OccupationDefinition[];
  routines: RoutineDefinition[];
  generation: ResidentGenerationDefinition;
};

export function ageAtDay(resident: ResidentRecord, currentDay: number, daysPerYear: number) {
  return Math.max(0, Math.floor((currentDay - resident.birthDay) / daysPerYear));
}

export function occupationFor(definitions: ResidentDefinitions, occupationId: string) {
  return definitions.occupations.find((item) => item.id === occupationId);
}

export function districtName(definitions: ResidentDefinitions, districtId: string) {
  return definitions.generation.districts.find((item) => item.id === districtId)?.name ?? '城中';
}

export function familySummary(resident: ResidentRecord, household: HouseholdRecord | undefined) {
  if (resident.spouseId && resident.childCount > 0) return `已婚 · ${resident.childCount}个孩子`;
  if (resident.spouseId) return '已婚';
  if (resident.childCount > 0) return `有${resident.childCount}个孩子`;
  if ((resident.fatherId || resident.motherId) && (household?.memberIds.length ?? 0) > 1) return '与家人同住';
  if ((household?.memberIds.length ?? 0) <= 1) return '独居';
  return '与家人同住';
}
