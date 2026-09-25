import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const outputDir = join(root, 'Web', 'public', 'generated');

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), 'utf8'));
}

const nameCatalog = await readJson('Web/public/generated/name-catalog-v2.json');
const occupations = await readJson('Content/Occupations/occupations.json');
const actionPresentations = await readJson('Web/public/generated/resident-action-presentations.json');
const generation = await readJson('Content/Simulation/resident-generation.json');
const lifeEvents = await readJson('Content/LifeEvents/life-events.json');

if (nameCatalog.schema !== 'wanhu.name-catalog.v2') {
  throw new Error(`ResidentGenerator expected wanhu.name-catalog.v2, got ${nameCatalog.schema}`);
}
if (actionPresentations.schema !== 'wanhu.resident-action-presentations.v1') {
  throw new Error(`ResidentGenerator expected wanhu.resident-action-presentations.v1, got ${actionPresentations.schema}`);
}

const HISTORY_PHASES = [
  { id: 'school-age', minAge: 10, maxAge: 17 },
  { id: 'young-adult', minAge: 18, maxAge: 25 },
  { id: 'adult', minAge: 26, maxAge: 39 },
  { id: 'middle-age', minAge: 40, maxAge: 57 },
  { id: 'elder', minAge: 58, maxAge: 82 },
];

function hash32(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = seed >>> 0 || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng, min, max) {
  if (max <= min) return min;
  return min + Math.floor(rng() * (max - min + 1));
}

function pick(rng, items) {
  return items[Math.floor(rng() * items.length) % items.length];
}

function weightedPick(rng, items) {
  const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.weight ?? 1)), 0);
  if (total <= 0) return items[0];
  let cursor = rng() * total;
  for (const item of items) {
    cursor -= Math.max(0, Number(item.weight ?? 1));
    if (cursor <= 0) return item;
  }
  return items.at(-1);
}

function weightedPickAvoiding(rng, items, avoidIds) {
  const filtered = items.filter((item) => !avoidIds.has(item.id));
  return weightedPick(rng, filtered.length ? filtered : items);
}

function lifeStageForAge(age) {
  return generation.lifeStages.find((stage) => age >= stage.minAge && age <= stage.maxAge)?.id ?? 'adult';
}

function nameGenerationGroupForAge(age) {
  if (age <= 24) return 'young';
  if (age <= 49) return 'middle';
  return 'old';
}

function tokenAllowedForGeneration(item, generationGroup) {
  return !Array.isArray(item.generationGroups) || item.generationGroups.length === 0 || item.generationGroups.includes(generationGroup);
}

function eligibleOccupations(age, gender) {
  const eligible = occupations.items.filter((item) => {
    if (age < item.minAge || age > item.maxAge) return false;
    if (Array.isArray(item.genders) && !item.genders.includes(gender)) return false;
    return true;
  });
  return eligible.length ? eligible : occupations.items.filter((item) => item.id === 'occupation.child');
}

function makeName(rng, gender, age, forcedSurnameId) {
  const generationGroup = nameGenerationGroupForAge(age);
  const surnamePool = nameCatalog.surnames.filter((item) => tokenAllowedForGeneration(item, generationGroup));
  if (!surnamePool.length) throw new Error(`No surname token for generation group ${generationGroup}.`);

  let surname;
  if (forcedSurnameId) {
    surname = nameCatalog.surnames.find((item) => item.id === forcedSurnameId);
    if (!surname) throw new Error(`Unknown forced surname id ${forcedSurnameId}.`);
  } else {
    surname = weightedPick(rng, surnamePool);
  }

  const givenPool = nameCatalog.givenNames.filter((item) =>
    (item.gender === gender || item.gender === 'unisex') && tokenAllowedForGeneration(item, generationGroup));
  if (!givenPool.length) throw new Error(`No ${gender} given-name token for generation group ${generationGroup}.`);
  const givenName = weightedPick(rng, givenPool);

  return {
    surname: surname.text,
    surnameId: surname.id,
    givenNameId: givenName.id,
    displayName: `${surname.text}${givenName.text}`,
  };
}

function pickOccupation(rng, age, gender) {
  return weightedPick(rng, eligibleOccupations(age, gender));
}

const ACTION_SEQUENCE = [
  'resident-action.go-to-work',
  'resident-action.fetch-water',
  'resident-action.visit-friend',
  'resident-action.take-walk',
  'resident-action.wash-clothes',
  'resident-action.buy-food',
  'resident-action.visit-family',
  'resident-action.go-to-teahouse',
  'resident-action.watch-performance',
  'resident-action.travel',
  'resident-action.rest-at-home',
];
const actionPresentationById = new Map(actionPresentations.items.map((item) => [item.id, item]));
const ACTION_DAY_OFFSETS = [2, 5, 9, 14, 21, 31, 44, 60, 78];

function pickTarget(candidates, resident, salt) {
  if (!candidates.length) return undefined;
  const sorted = [...candidates].sort((left, right) => hash32(`${resident.seed}:${salt}:${left.id}`) - hash32(`${resident.seed}:${salt}:${right.id}`));
  return sorted[0];
}
function familyTargets(resident, residentPool, householdById) {
  const byId = new Map(residentPool.map((candidate) => [candidate.id, candidate]));
  const household = householdById.get(resident.householdId);
  const ids = new Set([resident.spouseId,resident.fatherId,resident.motherId,...(household?.memberIds ?? []),...residentPool.filter((candidate) => candidate.fatherId === resident.id || candidate.motherId === resident.id).map((candidate) => candidate.id)].filter((id) => id && id !== resident.id));
  return [...ids].map((id) => byId.get(id)).filter(Boolean);
}
function targetForAction(actionId, resident, residentPool, householdById, salt) {
  if (actionId === 'resident-action.visit-family') return pickTarget(familyTargets(resident, residentPool, householdById), resident, `family:${salt}`);
  if (actionId === 'resident-action.visit-friend') {
    const outside = residentPool.filter((candidate) => candidate.id !== resident.id && candidate.householdId !== resident.householdId);
    const sameDistrict = outside.filter((candidate) => candidate.districtId === resident.districtId);
    return pickTarget(sameDistrict.length ? sameDistrict : outside, resident, `friend:${salt}`);
  }
  return undefined;
}
function placeForAction(actionId, resident, target) {
  if (actionId === 'resident-action.fetch-water') return `place.well.${resident.districtId}`;
  if (actionId === 'resident-action.wash-clothes') return `place.wash-point.${resident.districtId}`;
  if (actionId === 'resident-action.go-to-work') return resident.workplaceId ? `place.workplace.${resident.workplaceId}` : undefined;
  if (actionId === 'resident-action.buy-food') return `place.market.${resident.districtId}`;
  if (actionId === 'resident-action.take-walk') return `place.riverside.${resident.districtId}`;
  if (actionId === 'resident-action.watch-performance') return `place.performance.${resident.districtId}`;
  if (actionId === 'resident-action.go-to-teahouse') return `place.teahouse.${resident.districtId}`;
  if (actionId === 'resident-action.travel') return `destination.outside-city.${1 + (resident.seed % 3)}`;
  if (actionId === 'resident-action.rest-at-home') return `place.home.${resident.householdId}`;
  if ((actionId === 'resident-action.visit-family' || actionId === 'resident-action.visit-friend') && target) return `place.home.${target.householdId}`;
  return undefined;
}
function makeActionEvent(resident, actionId, day, residentPool, householdById, salt) {
  if (!actionPresentationById.has(actionId)) return undefined;
  if (actionId === 'resident-action.go-to-work' && !resident.workplaceId) return undefined;
  const target = targetForAction(actionId, resident, residentPool, householdById, salt);
  if ((actionId === 'resident-action.visit-family' || actionId === 'resident-action.visit-friend') && !target) return undefined;
  const placeId = placeForAction(actionId, resident, target);
  return {residentId:resident.id,actionId,day,...(target?{targetResidentId:target.id}:{}),...(placeId?{placeId}:{})};
}
function buildCompletedActionTrace(resident, residentPool, householdById) {
  const events = [];
  const start = hash32(`${resident.seed}:action-trace-start`) % ACTION_SEQUENCE.length;
  for (let slot = 0; slot < ACTION_DAY_OFFSETS.length; slot += 1) {
    for (let probe = 0; probe < ACTION_SEQUENCE.length; probe += 1) {
      const actionId = ACTION_SEQUENCE[(start + slot * 3 + probe) % ACTION_SEQUENCE.length];
      if (events.at(-1)?.actionId === actionId) continue;
      const event = makeActionEvent(resident, actionId, generation.currentDay - ACTION_DAY_OFFSETS[slot], residentPool, householdById, `completed:${slot}:${probe}`);
      if (!event) continue;
      events.push(event);
      break;
    }
  }
  return events;
}
function variantIndexForEvent(resident, event, presentation) {
  const total = presentation.variants.reduce((sum, variant) => sum + Math.max(0, Number(variant.weight ?? 1)), 0);
  let cursor = (hash32(`${resident.seed}:action-variant:${event.actionId}:${event.day}`) / 4294967296) * total;
  for (let index = 0; index < presentation.variants.length; index += 1) {
    cursor -= Math.max(0, Number(presentation.variants[index].weight ?? 1));
    if (cursor <= 0) return index;
  }
  return presentation.variants.length - 1;
}
function recordRecentActions(resident, completedEvents) {
  const accepted = [], lastDayByAction = new Map();
  for (const event of [...completedEvents].sort((left, right) => left.day - right.day)) {
    const presentation = actionPresentationById.get(event.actionId);
    if (!presentation || accepted.at(-1)?.actionId === event.actionId) continue;
    const previousDay = lastDayByAction.get(event.actionId);
    if (previousDay !== undefined && event.day - previousDay < presentation.cooldownDays) continue;
    accepted.push({id:`${resident.id}:${event.actionId}:${event.day}`,day:event.day,actionId:event.actionId,variantIndex:variantIndexForEvent(resident,event,presentation),...(event.targetResidentId!==undefined?{targetResidentId:event.targetResidentId}:{}),...(event.placeId!==undefined?{placeId:event.placeId}:{})});
    lastDayByAction.set(event.actionId,event.day);
  }
  return accepted.sort((left,right)=>right.day-left.day).slice(0,generation.recentActionCapacity);
}
function buildCurrentAction(resident, residentPool, householdById) {
  const start = hash32(`${resident.seed}:current-action`) % ACTION_SEQUENCE.length;
  for (let probe = 0; probe < ACTION_SEQUENCE.length; probe += 1) {
    const event = makeActionEvent(resident,ACTION_SEQUENCE[(start+probe)%ACTION_SEQUENCE.length],generation.currentDay,residentPool,householdById,`current:${probe}`);
    if (event) return {actionId:event.actionId,...(event.targetResidentId!==undefined?{targetResidentId:event.targetResidentId}:{}),...(event.placeId!==undefined?{placeId:event.placeId}:{}),phase:'executing'};
  }
  throw new Error(`No CurrentAction candidate for resident ${resident.id}.`);
}

function ageAtDay(resident, day) {
  return Math.max(0, Math.floor((day - resident.birthDay) / generation.daysPerYear));
}

function eventFitsResidentHistory(event, resident, phase, currentAge, lifeTags) {
  if (!event.recordToHistory) return false;
  const rule = event.eligibility ?? {};
  const minAge = Math.max(phase.minAge, Number(rule.minAge ?? phase.minAge));
  const maxAge = Math.min(phase.maxAge, Number(rule.maxAge ?? phase.maxAge), currentAge - 1);
  if (minAge > maxAge) return false;
  if (Array.isArray(rule.occupations) && rule.occupations.length && !rule.occupations.includes(resident.occupationId)) return false;
  if (Array.isArray(rule.occupationGroups) && rule.occupationGroups.length && !rule.occupationGroups.includes(resident.occupationGroupId)) return false;
  if (Array.isArray(rule.genders) && rule.genders.length && !rule.genders.includes(resident.gender)) return false;
  if (rule.minChildren !== undefined && resident.childCount < rule.minChildren) return false;
  if (rule.requireSpouse !== undefined && Boolean(resident.spouseId) !== rule.requireSpouse) return false;
  if (rule.requiredTags?.some((tagId) => !lifeTags.has(tagId))) return false;
  if (rule.forbiddenTags?.some((tagId) => lifeTags.has(tagId))) return false;
  return true;
}

function applyTagEffects(lifeTags, event) {
  for (const tagId of event.effects?.removeTags ?? []) lifeTags.delete(tagId);
  for (const tagId of event.effects?.addTags ?? []) lifeTags.add(tagId);
}

function buildStoryHistory(resident) {
  const currentAge = ageAtDay(resident, generation.currentDay);
  const livedPhases = HISTORY_PHASES.filter((phase) => phase.minAge <= currentAge - 1);
  if (!livedPhases.length) return [];

  const densityRoll = hash32(`${resident.seed}:life-story-density`) % 100;
  const desiredCount = densityRoll < 15 ? 0 : densityRoll < 55 ? 1 : densityRoll < 88 ? 2 : 3;
  const target = Math.min(desiredCount, livedPhases.length);
  if (!target) return [];

  const selectedPhaseIds = new Set(
    [...livedPhases]
      .sort((left, right) => hash32(`${resident.seed}:history-phase:${left.id}`) - hash32(`${resident.seed}:history-phase:${right.id}`))
      .slice(0, target)
      .map((phase) => phase.id),
  );

  const selected = [];
  const usedEvents = new Set();
  const lifeTags = new Set();

  for (const phase of livedPhases) {
    if (!selectedPhaseIds.has(phase.id)) continue;
    const candidates = lifeEvents.items
      .filter((event) => !usedEvents.has(event.id) && eventFitsResidentHistory(event, resident, phase, currentAge, lifeTags))
      .map((event) => ({
        event,
        rank: hash32(`${resident.seed}:history-rank:${phase.id}:${event.id}`),
      }))
      .sort((left, right) => left.rank - right.rank);
    const chosen = candidates[0]?.event;
    if (!chosen) continue;

    const minAge = Math.max(phase.minAge, Number(chosen.eligibility?.minAge ?? phase.minAge));
    const maxAge = Math.min(phase.maxAge, Number(chosen.eligibility?.maxAge ?? phase.maxAge), currentAge - 1);
    const age = minAge + (hash32(`${resident.seed}:history-age:${phase.id}:${chosen.id}`) % (maxAge - minAge + 1));
    const dayInYear = hash32(`${resident.seed}:history-day:${chosen.id}`) % generation.daysPerYear;
    const day = Math.min(generation.currentDay - 14, resident.birthDay + age * generation.daysPerYear + dayInYear);

    selected.push({
      id: `${resident.id}:story:${chosen.id}:${day}`,
      day,
      type: 'story',
      title: chosen.title,
      sourceEventId: chosen.id,
    });
    usedEvents.add(chosen.id);
    applyTagEffects(lifeTags, chosen);
  }

  return selected;
}

let nextResidentId = 1001;
let nextHouseholdId = 81;
const residents = [];
const households = [];

function createResident({ age, gender, householdId, districtId, forcedSurnameId = null }) {
  const id = nextResidentId++;
  const seed = hash32(`${generation.citySeed}:resident:${id}`);
  const rng = createRng(seed);
  const { surname, surnameId, givenNameId, displayName } = makeName(rng, gender, age, forcedSurnameId);
  const occupation = pickOccupation(rng, age, gender);
  const birthDay = generation.currentDay - age * generation.daysPerYear - randomInt(rng, 0, generation.daysPerYear - 1);
  const workplaceId = occupation.workplaceType
    ? 3000 + (hash32(`${occupation.workplaceType}:${districtId}:${Math.floor(rng() * 7)}`) % 700)
    : 0;
  const earliestEmploymentDay = birthDay + Math.max(13, occupation.minAge) * generation.daysPerYear;
  const employmentStartDay = workplaceId
    ? Math.min(generation.currentDay, randomInt(rng, Math.min(earliestEmploymentDay, generation.currentDay), generation.currentDay))
    : 0;

  const resident = {
    id,
    seed,
    displayName,
    surname,
    surnameId,
    givenNameId,
    birthDay,
    gender,
    districtId,
    occupationId: occupation.id,
    occupationGroupId: occupation.groupId,
    workplaceId,
    employmentStartDay,
    householdId,
    fatherId: 0,
    motherId: 0,
    spouseId: 0,
    childCount: 0,
    nextUpdateDay: generation.currentDay + randomInt(rng, 2, 8),
    lifeStage: lifeStageForAge(age),
    stateBits: 0,
    activeStoryId: null,
    lifeTags: [],
    currentAction: null,
    recentActions: [],
    majorLifeHistory: [],
  };

  residents.push(resident);
  return resident;
}

function createHousehold(archetypeId, remaining, rng) {
  const householdId = nextHouseholdId++;
  const district = pick(rng, generation.districts);
  const homeId = 9000 + householdId;
  const members = [];

  if (archetypeId === 'family' && remaining >= 3) {
    const fatherAge = randomInt(rng, 27, 52);
    const motherAge = Math.max(22, Math.min(54, fatherAge + randomInt(rng, -6, 5)));
    const father = createResident({ age: fatherAge, gender: 'male', householdId, districtId: district.id });
    const mother = createResident({ age: motherAge, gender: 'female', householdId, districtId: district.id });
    father.spouseId = mother.id;
    mother.spouseId = father.id;
    members.push(father, mother);

    const maxChildren = Math.min(2, remaining - 2);
    const childCount = randomInt(rng, 1, Math.max(1, maxChildren));
    const maxChildAge = Math.max(2, Math.min(19, Math.min(fatherAge, motherAge) - 19));
    for (let index = 0; index < childCount; index += 1) {
      const childAge = randomInt(rng, 2, Math.max(2, maxChildAge - index * 2));
      const child = createResident({
        age: childAge,
        gender: rng() < 0.5 ? 'male' : 'female',
        householdId,
        districtId: district.id,
        forcedSurnameId: father.surnameId,
      });
      child.fatherId = father.id;
      child.motherId = mother.id;
      members.push(child);
    }
    father.childCount = childCount;
    mother.childCount = childCount;
  } else if (archetypeId === 'couple' && remaining >= 2) {
    const firstAge = randomInt(rng, 22, 67);
    const secondAge = Math.max(20, Math.min(70, firstAge + randomInt(rng, -7, 7)));
    const first = createResident({ age: firstAge, gender: 'male', householdId, districtId: district.id });
    const second = createResident({ age: secondAge, gender: 'female', householdId, districtId: district.id });
    first.spouseId = second.id;
    second.spouseId = first.id;
    members.push(first, second);
  } else if (archetypeId === 'elder-child' && remaining >= 2) {
    const elderAge = randomInt(rng, 58, 78);
    const elderGender = rng() < 0.5 ? 'male' : 'female';
    const elder = createResident({ age: elderAge, gender: elderGender, householdId, districtId: district.id });
    const childAge = randomInt(rng, 24, Math.min(50, elderAge - 18));
    const child = createResident({
      age: childAge,
      gender: rng() < 0.5 ? 'male' : 'female',
      householdId,
      districtId: district.id,
      forcedSurnameId: elder.surnameId,
    });
    if (elderGender === 'male') child.fatherId = elder.id;
    else child.motherId = elder.id;
    elder.childCount = 1;
    members.push(elder, child);
  } else {
    const single = createResident({
      age: randomInt(rng, 18, 76),
      gender: rng() < 0.5 ? 'male' : 'female',
      householdId,
      districtId: district.id,
    });
    members.push(single);
  }

  const household = {
    id: householdId,
    homeId,
    districtId: district.id,
    memberIds: members.map((member) => member.id),
  };
  households.push(household);
}

const cityRng = createRng(generation.citySeed);
while (residents.length < generation.residentCount) {
  const remaining = generation.residentCount - residents.length;
  const validArchetypes = generation.householdArchetypes.filter((item) => {
    if (item.id === 'family') return remaining >= 3;
    if (item.id === 'couple' || item.id === 'elder-child') return remaining >= 2;
    return true;
  });
  createHousehold(weightedPick(cityRng, validArchetypes).id, remaining, cityRng);
}

const householdById = new Map(households.map((household) => [household.id, household]));
for (const resident of residents) {
  const completedTrace = buildCompletedActionTrace(resident, residents, householdById);
  resident.recentActions = recordRecentActions(resident, completedTrace);
  resident.currentAction = buildCurrentAction(resident, residents, householdById);
}
const residentById = new Map(residents.map((resident) => [resident.id, resident]));
for (const resident of residents) {
  const history = [];
  const occupation = occupations.items.find((item) => item.id === resident.occupationId);
  if (resident.workplaceId && resident.employmentStartDay < generation.currentDay) {
    history.push({
      id: `${resident.id}:employment:${resident.employmentStartDay}`,
      day: resident.employmentStartDay,
      type: 'employment',
      title: `开始做${occupation?.name ?? '这份营生'}`,
    });
  }

  if (resident.spouseId) {
    const spouse = residentById.get(resident.spouseId);
    const adultDay = Math.max(resident.birthDay, spouse?.birthDay ?? resident.birthDay) + 18 * generation.daysPerYear;
    const available = Math.max(30, generation.currentDay - adultDay - 30);
    const marriageDay = Math.min(generation.currentDay - 30, adultDay + (hash32(`${resident.id}:${resident.spouseId}:marriage`) % available));
    history.push({
      id: `${resident.id}:marriage:${marriageDay}`,
      day: marriageDay,
      type: 'marriage',
      title: '成了家',
    });
  }

  const children = residents.filter((candidate) => candidate.fatherId === resident.id || candidate.motherId === resident.id);
  if (children.length) {
    const firstChildDay = Math.min(...children.map((child) => child.birthDay));
    history.push({
      id: `${resident.id}:child:${firstChildDay}`,
      day: firstChildDay,
      type: 'family',
      title: '家里添了孩子',
    });
  }

  history.push(...buildStoryHistory(resident));
  resident.majorLifeHistory = history.sort((left, right) => right.day - left.day);
}

const definitions = {
  schema: 'wanhu.resident-definitions.v1',
  names: {
    surnames: nameCatalog.surnames.map((item) => item.text),
    maleGivenNames: nameCatalog.givenNames.filter((item) => item.gender === 'male').map((item) => item.text),
    femaleGivenNames: nameCatalog.givenNames.filter((item) => item.gender === 'female').map((item) => item.text),
  },
  occupations: occupations.items,
  actionPresentations: actionPresentations.items,
  generation,
};

const snapshot = {
  schema: 'wanhu.resident-snapshot.v2',
  citySeed: generation.citySeed,
  currentDay: generation.currentDay,
  residents: residents.slice(0, generation.residentCount),
  households,
};

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, 'definitions.json'), `${JSON.stringify(definitions, null, 2)}\n`, 'utf8');
await writeFile(join(outputDir, 'resident-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`Generated ${snapshot.residents.length} residents in ${snapshot.households.length} households with deterministic CurrentAction / RecentAction traces.`);
