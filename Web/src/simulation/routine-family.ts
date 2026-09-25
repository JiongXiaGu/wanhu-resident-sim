import type {
  HouseholdRecord,
  ResidentRecord,
  RoutineFamilyEligibility,
  RoutineFamilyRequirement,
  RoutineResidentContextRelation,
} from '../domain/resident';

export type ResidentFamilyState = {
  hasSpouse: boolean;
  hasParent: boolean;
  childCount: number;
  householdSize: number;
  coResidentSpouse: boolean;
  coResidentChild: boolean;
  coResidentParent: boolean;
};

function requirementMatches(requirement: RoutineFamilyRequirement | undefined, value: boolean) {
  if (!requirement || requirement === 'any') return true;
  return requirement === 'required' ? value : !value;
}

export function residentFamilyState(
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  residents: readonly ResidentRecord[],
): ResidentFamilyState {
  const householdMembers = new Set(household?.memberIds ?? []);
  const children = residents.filter((candidate) => candidate.fatherId === resident.id || candidate.motherId === resident.id);
  const parentIds = [resident.fatherId, resident.motherId].filter(Boolean);
  return {
    hasSpouse: Boolean(resident.spouseId),
    hasParent: parentIds.length > 0,
    childCount: resident.childCount,
    householdSize: household?.memberIds.length ?? 0,
    coResidentSpouse: Boolean(resident.spouseId && householdMembers.has(resident.spouseId)),
    coResidentChild: children.some((child) => householdMembers.has(child.id)),
    coResidentParent: parentIds.some((parentId) => householdMembers.has(parentId)),
  };
}

export function routineFamilyEligibilityMatches(
  family: RoutineFamilyEligibility | undefined,
  resident: ResidentRecord,
  household: HouseholdRecord | undefined,
  residents: readonly ResidentRecord[],
) {
  if (!family) return true;
  const state = residentFamilyState(resident, household, residents);
  if (!requirementMatches(family.spouse, state.hasSpouse)) return false;
  if (!requirementMatches(family.parent, state.hasParent)) return false;
  if (family.minChildren !== undefined && state.childCount < family.minChildren) return false;
  if (family.maxChildren !== undefined && family.maxChildren !== null && state.childCount > family.maxChildren) return false;
  if (family.minHouseholdSize !== undefined && state.householdSize < family.minHouseholdSize) return false;
  if (family.maxHouseholdSize !== undefined && family.maxHouseholdSize !== null && state.householdSize > family.maxHouseholdSize) return false;
  if (!requirementMatches(family.coResidentSpouse, state.coResidentSpouse)) return false;
  if (!requirementMatches(family.coResidentChild, state.coResidentChild)) return false;
  if (!requirementMatches(family.coResidentParent, state.coResidentParent)) return false;
  return true;
}

export function routineContextResidentMatches(
  relation: RoutineResidentContextRelation,
  resident: ResidentRecord,
  target: ResidentRecord,
  household: HouseholdRecord | undefined,
) {
  if (target.id === resident.id) return false;
  if (relation === 'spouse') return resident.spouseId === target.id;
  if (relation === 'child') return target.fatherId === resident.id || target.motherId === resident.id;
  if (relation === 'parent') return resident.fatherId === target.id || resident.motherId === target.id;
  return target.householdId === resident.householdId && Boolean(household?.memberIds.includes(target.id));
}
