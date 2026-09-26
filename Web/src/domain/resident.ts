export type Gender = 'male' | 'female';

export type LifeStageId = 'child' | 'teen' | 'young-adult' | 'adult' | 'middle-age' | 'elder';
export type WealthTier = 'poor' | 'plain' | 'comfortable' | 'wealthy';

export type ResidentProfile = {
  temperamentId: string;
  lifeFocusId: string;
  presentationStyleId: string;
};

export type ResidentProfileCatalogItem = {
  id: string;
  label: string;
  description: string;
  weight: number;
  occupationGroupWeights?: Record<string, number>;
  wealthWeights?: Partial<Record<WealthTier, number>>;
};

export type ResidentProfileCatalogDefinition = {
  schema: 'wanhu.resident-profile-catalog.v1';
  temperaments: ResidentProfileCatalogItem[];
  lifeFocuses: ResidentProfileCatalogItem[];
  presentationStyles: ResidentProfileCatalogItem[];
};
export type PortraitFrameId =
  | 'female.child'
  | 'female.adult'
  | 'female.elder'
  | 'male.child'
  | 'male.adult'
  | 'male.elder';

export type ResidentCurrentAction = {
  actionId: string;
  targetResidentId?: number;
  placeId?: string;
  phase: 'moving' | 'executing';
};

export type ResidentActionCompletedEvent = {
  residentId: number;
  actionId: string;
  day: number;
  targetResidentId?: number;
  placeId?: string;
};

export type ResidentRecentActionRecord = {
  id: string;
  day: number;
  actionId: string;
  variantIndex: number;
  targetResidentId?: number;
  placeId?: string;
};

export type ResidentRecentLifeEventRecord = {
  id: string;
  day: number;
  eventId: string;
};

export type ResidentLifeChapter = {
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
  profile: ResidentProfile;
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
  lifeTags: string[];
  currentAction: ResidentCurrentAction;
  recentActions: ResidentRecentActionRecord[];
  recentLifeEvents: ResidentRecentLifeEventRecord[];
  lifeChapters: ResidentLifeChapter[];
};

export type HouseholdRecord = {
  id: number;
  homeId: number;
  districtId: string;
  memberIds: number[];
  wealthTier: WealthTier;
};

export type ResidentWorldSnapshot = {
  schema: 'wanhu.resident-snapshot.v6';
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

export type ActionPresentationDefinition = {
  id: string;
  currentText: string;
  cooldownDays: number;
  variants: Array<{ text: string; weight: number }>;
};

export type PortraitCatalogFaceFamily = {
  id: string;
  genders: Gender[];
  weight: number;
};

export type PortraitCatalogHairStyle = {
  id: string;
  genders: Gender[];
  frameIds: PortraitFrameId[];
  weight: number;
};

export type PortraitCatalogOutfitStyle = {
  id: string;
  frameIds: PortraitFrameId[];
  initialWealthTiers: WealthTier[];
  weight: number;
};

export type PortraitCatalogPalette = {
  id: string;
  weight: number;
};

export type PortraitCatalogDefinition = {
  schema: 'wanhu.portrait-catalog.v2';
  faceFamilies: PortraitCatalogFaceFamily[];
  hairStyles: PortraitCatalogHairStyle[];
  outfitStyles: PortraitCatalogOutfitStyle[];
  skinPalettes: PortraitCatalogPalette[];
  hairPalettes: PortraitCatalogPalette[];
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

export type LifeEventDefinition = {
  id: string;
  title: string;
  recentText: string;
  weight: number;
  eligibility: LifeEventEligibility;
  effects?: LifeEventEffects;
  source?: LifeEventSource;
  recordToHistory?: boolean;
  memoryText?: string;
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
  recentActionCapacity: number;
  lifeStages: Array<{ id: LifeStageId; minAge: number; maxAge: number }>;
  districts: Array<{ id: string; name: string }>;
  householdArchetypes: Array<{ id: string; weight: number }>;
};

export type ResidentDefinitions = {
  schema: 'wanhu.resident-definitions.v7';
  names: {
    surnames: string[];
    maleGivenNames: string[];
    femaleGivenNames: string[];
  };
  nameCatalog: NameCatalogDefinition;
  lifeTags: LifeTagDefinition[];
  occupationGroups: OccupationGroupDefinition[];
  portraitCatalog: PortraitCatalogDefinition;
  residentProfileCatalog: ResidentProfileCatalogDefinition;
  storyBuckets: StoryBucketCollection;
  contentMeta: {
    stableIdCount: number;
    storyBucketCount: number;
    portraitFaceFamilyCount: number;
    portraitHairStyleCount: number;
    portraitOutfitStyleCount: number;
    residentTemperamentCount: number;
    residentLifeFocusCount: number;
    residentPresentationStyleCount: number;
    actionPresentationCount: number;
    actionVariantCount: number;
  };
  occupations: OccupationDefinition[];
  actionPresentations: ActionPresentationDefinition[];
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


export function residentProfileLabels(definitions: ResidentDefinitions, resident: ResidentRecord) {
  const catalog = definitions.residentProfileCatalog;
  const find = (items: ResidentProfileCatalogItem[], id: string) => items.find((item) => item.id === id)?.label ?? id;
  return [
    find(catalog.temperaments, resident.profile.temperamentId),
    find(catalog.lifeFocuses, resident.profile.lifeFocusId),
    find(catalog.presentationStyles, resident.profile.presentationStyleId),
  ] as const;
}
