export type Gender = 'male' | 'female';

export type LifeStageId = 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-age' | 'elder';
export type WealthTier = 'poor' | 'plain' | 'comfortable' | 'wealthy';
export type PresentationStyle = 'practical' | 'tidy' | 'refined';

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
  sourceEventId?: string;
};

export type ResidentPortraitDNA = {
  faceFamilyId: string;
  hairStyleId: string;
  outfitStyleId: string;
  skinPaletteId: string;
  baseHairColorId: string;
};

export type ResidentAppearanceDNA = {
  faceId: string;
  hairId: string;
  browId: string;
  facialHairId: string;
  headwearId: string;
  outfitId: string;
  skinPaletteId: string;
  hairPaletteId: string;
  clothingPaletteId: string;
};

export type ResidentRecord = {
  id: number;
  seed: number;
  displayName: string;
  surname: string;
  surnameId: string;
  givenNameId: string;
  birthDay: number;
  gender: Gender;
  portrait: ResidentPortraitDNA;
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
  lifeTags: string[];
  recentLifeLog: ResidentLifeLogRecord[];
  majorLifeHistory: ResidentMajorLifeEvent[];
};

export type HouseholdRecord = {
  id: number;
  homeId: number;
  districtId: string;
  memberIds: number[];
  wealthTier: WealthTier;
  presentationStyle: PresentationStyle;
};

export type ResidentWorldSnapshot = {
  schema: 'wanhu.resident-snapshot.v4';
  citySeed: number;
  currentDay: number;
  residents: ResidentRecord[];
  households: HouseholdRecord[];
};

export type NameTokenDefinition = {
  id: string;
  text: string;
  weight: number;
  gender?: Gender | 'unisex';
  styles?: string[];
  generationGroups?: string[];
};

export type NameCatalogDefinition = {
  schema: 'wanhu.name-catalog.v2';
  surnames: NameTokenDefinition[];
  givenNames: NameTokenDefinition[];
};

export type LifeTagDefinition = {
  id: string;
  label: string;
  category: string;
  description?: string;
};

export type OccupationGroupDefinition = {
  id: string;
  label: string;
};

export type OccupationDefinition = {
  id: string;
  groupId: string;
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

export type AppearancePartSlot = 'face' | 'hair' | 'brow' | 'facial-hair' | 'headwear' | 'outfit';
export type AppearancePaletteSlot = 'skin' | 'hair' | 'clothing';

export type AppearancePartDefinition = {
  id: string;
  slot: AppearancePartSlot;
  label: string;
  weight: number;
  genders?: Gender[];
  lifeStages?: LifeStageId[];
  wealthTiers?: WealthTier[];
  presentationStyles?: PresentationStyle[];
  occupationGroups?: string[];
  assetKey?: string;
};

export type AppearancePaletteDefinition = {
  id: string;
  slot: AppearancePaletteSlot;
  label: string;
  weight: number;
  genders?: Gender[];
  lifeStages?: LifeStageId[];
  wealthTiers?: WealthTier[];
  presentationStyles?: PresentationStyle[];
  occupationGroups?: string[];
};

export type AppearanceCatalogDefinition = {
  schema: 'wanhu.appearance-catalog.v1';
  parts: AppearancePartDefinition[];
  palettes: AppearancePaletteDefinition[];
};

export type LifeEventSourceType = 'city' | 'family' | 'work' | 'weather' | 'personal';

export type LifeEventSource = {
  type: LifeEventSourceType;
  label: string;
};

export type LifeEventEligibility = {
  occupations?: string[];
  occupationGroups?: string[];
  genders?: Gender[];
  minAge?: number;
  maxAge?: number;
  minChildren?: number;
  requireSpouse?: boolean;
  requiredTags?: string[];
  forbiddenTags?: string[];
};

export type LifeEventStructuralRequest =
  | { type: 'changeOccupation'; occupationId: string }
  | { type: 'moveHousehold'; policy: 'same-district' | 'different-district' | 'any-district' }
  | { type: 'formMarriage' }
  | { type: 'addChild' };

export type LifeEventEffects = {
  addTags?: string[];
  removeTags?: string[];
  structuralRequests?: LifeEventStructuralRequest[];
};

export type LifeEventStageDefinition = {
  delayDays: { min: number; max: number };
  title: string;
  text: string;
  activityOverride?: string;
};

export type LifeEventDefinition = {
  id: string;
  title: string;
  weight: number;
  eligibility: LifeEventEligibility;
  effects?: LifeEventEffects;
  source?: LifeEventSource;
  recordToHistory?: boolean;
  stages: [LifeEventStageDefinition, LifeEventStageDefinition, LifeEventStageDefinition];
};

export type StoryBucketDefinition = {
  key: string;
  lifeStageId: LifeStageId;
  occupationGroupId: string;
  occupationIds: string[];
  eventIds: string[];
  recordableEventIds: string[];
};

export type StoryBucketCollection = {
  schema: 'wanhu.story-buckets.v1';
  dimensions: ['lifeStageId', 'occupationGroupId'];
  buckets: StoryBucketDefinition[];
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
  schema: 'wanhu.resident-definitions.v4';
  names: {
    surnames: string[];
    maleGivenNames: string[];
    femaleGivenNames: string[];
  };
  nameCatalog: NameCatalogDefinition;
  lifeTags: LifeTagDefinition[];
  occupationGroups: OccupationGroupDefinition[];
  appearanceCatalog: AppearanceCatalogDefinition;
  storyBuckets: StoryBucketCollection;
  contentMeta: {
    stableIdCount: number;
    storyBucketCount: number;
    appearancePartCount: number;
    appearancePaletteCount: number;
  };
  occupations: OccupationDefinition[];
  routines: RoutineDefinition[];
  lifeEvents: LifeEventDefinition[];
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
