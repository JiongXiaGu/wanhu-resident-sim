import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const outputDir = join(root, 'Web', 'public', 'generated');

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(root, relativePath), 'utf8'));
}

const surnames = await readJson('Content/Names/surnames.json');
const givenNames = await readJson('Content/Names/given-names.json');
const occupations = await readJson('Content/Occupations/occupations.json');
const routines = await readJson('Content/Routines/routine-templates.json');
const generation = await readJson('Content/Simulation/resident-generation.json');
const lifeEvents = await readJson('Content/LifeEvents/life-events.json');

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

function eligibleOccupations(age, gender) {
  const eligible = occupations.items.filter((item) => {
    if (age < item.minAge || age > item.maxAge) return false;
    if (Array.isArray(item.genders) && !item.genders.includes(gender)) return false;
    return true;
  });
  return eligible.length ? eligible : occupations.items.filter((item) => item.id === 'occupation.child');
}

function makeName(rng, gender, forcedSurname) {
  const surname = forcedSurname ?? pick(rng, surnames.items);
  const givenPool = gender === 'female' ? givenNames.female : givenNames.male;
  return { surname, displayName: `${surname}${pick(rng, givenPool)}` };
}

function pickOccupation(rng, age, gender) {
  return weightedPick(rng, eligibleOccupations(age, gender));
}

function availableRoutinePool(occupationId) {
  const specific = routines.items.filter((item) => item.occupation === occupationId && !item.weather && !item.season);
  const generic = routines.items.filter((item) => item.occupation === null && !item.weather && !item.season);
  return specific.length ? [...specific, ...generic] : generic;
}

function buildRecentLifeLog(resident, rng) {
  const pool = availableRoutinePool(resident.occupationId);
  const result = [];
  if (!pool.length) return result;

  const target = Math.min(generation.recentLifeLogCapacity, randomInt(rng, 4, 7));
  const interval = generation.routineIntervalDays;
  const recentTemplateIds = [];
  let day = generation.currentDay - randomInt(rng, 1, 5);
  const minimumDay = generation.currentDay - generation.routineWindowDays;

  while (result.length < target && day >= minimumDay) {
    const item = weightedPickAvoiding(rng, pool, new Set(recentTemplateIds));
    result.push({
      id: `${resident.id}:${item.id}:${day}`,
      day,
      kind: 'routine',
      title: item.text,
    });
    recentTemplateIds.unshift(item.id);
    recentTemplateIds.splice(2);
    day -= randomInt(rng, interval.min, interval.max);
  }

  return result.sort((left, right) => right.day - left.day);
}

function ageAtDay(resident, day) {
  return Math.max(0, Math.floor((day - resident.birthDay) / generation.daysPerYear));
}

function eventFitsResidentHistory(event, resident, phase, currentAge) {
  if (!event.recordToHistory) return false;
  const rule = event.eligibility ?? {};
  const minAge = Math.max(phase.minAge, Number(rule.minAge ?? phase.minAge));
  const maxAge = Math.min(phase.maxAge, Number(rule.maxAge ?? phase.maxAge), currentAge - 1);
  if (minAge > maxAge) return false;
  if (Array.isArray(rule.occupations) && rule.occupations.length && !rule.occupations.includes(resident.occupationId)) return false;
  if (Array.isArray(rule.genders) && rule.genders.length && !rule.genders.includes(resident.gender)) return false;
  if (rule.minChildren !== undefined && resident.childCount < rule.minChildren) return false;
  if (rule.requireSpouse !== undefined && Boolean(resident.spouseId) !== rule.requireSpouse) return false;
  return true;
}

function buildStoryHistory(resident) {
  const currentAge = ageAtDay(resident, generation.currentDay);
  const livedPhases = HISTORY_PHASES.filter((phase) => phase.minAge <= currentAge - 1);
  if (!livedPhases.length) return [];

  const densityRoll = hash32(`${resident.seed}:life-story-density`) % 100;
  const desiredCount = densityRoll < 15 ? 0 : densityRoll < 55 ? 1 : densityRoll < 88 ? 2 : 3;
  const target = Math.min(desiredCount, livedPhases.length);
  if (!target) return [];

  const candidates = [];
  for (const phase of livedPhases) {
    for (const event of lifeEvents.items) {
      if (!eventFitsResidentHistory(event, resident, phase, currentAge)) continue;
      const minAge = Math.max(phase.minAge, Number(event.eligibility?.minAge ?? phase.minAge));
      const maxAge = Math.min(phase.maxAge, Number(event.eligibility?.maxAge ?? phase.maxAge), currentAge - 1);
      candidates.push({
        event,
        phase,
        minAge,
        maxAge,
        rank: hash32(`${resident.seed}:history-rank:${phase.id}:${event.id}`),
      });
    }
  }

  candidates.sort((left, right) => left.rank - right.rank);
  const usedEvents = new Set();
  const usedPhases = new Set();
  const selected = [];
  for (const candidate of candidates) {
    if (selected.length >= target) break;
    if (usedEvents.has(candidate.event.id) || usedPhases.has(candidate.phase.id)) continue;
    usedEvents.add(candidate.event.id);
    usedPhases.add(candidate.phase.id);
    selected.push(candidate);
  }

  return selected.map(({ event, phase, minAge, maxAge }) => {
    const age = minAge + (hash32(`${resident.seed}:history-age:${phase.id}:${event.id}`) % (maxAge - minAge + 1));
    const dayInYear = hash32(`${resident.seed}:history-day:${event.id}`) % generation.daysPerYear;
    const day = Math.min(
      generation.currentDay - 14,
      resident.birthDay + age * generation.daysPerYear + dayInYear,
    );
    return {
      id: `${resident.id}:story:${event.id}:${day}`,
      day,
      type: 'story',
      title: event.title,
      sourceEventId: event.id,
    };
  });
}

let nextResidentId = 1001;
let nextHouseholdId = 81;
const residents = [];
const households = [];

function createResident({ age, gender, householdId, districtId, forcedSurname = null }) {
  const id = nextResidentId++;
  const seed = hash32(`${generation.citySeed}:resident:${id}`);
  const rng = createRng(seed);
  const { surname, displayName } = makeName(rng, gender, forcedSurname);
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
    birthDay,
    gender,
    portraitSeed: hash32(`${seed}:portrait`),
    districtId,
    occupationId: occupation.id,
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
    recentLifeLog: [],
    majorLifeHistory: [],
  };

  resident.recentLifeLog = buildRecentLifeLog(resident, rng);
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
        forcedSurname: father.surname,
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
      forcedSurname: elder.surname,
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

  households.push({
    id: householdId,
    homeId,
    districtId: district.id,
    memberIds: members.map((member) => member.id),
  });
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
    surnames: surnames.items,
    maleGivenNames: givenNames.male,
    femaleGivenNames: givenNames.female,
  },
  occupations: occupations.items,
  routines: routines.items,
  generation,
};

const snapshot = {
  schema: 'wanhu.resident-snapshot.v1',
  citySeed: generation.citySeed,
  currentDay: generation.currentDay,
  residents: residents.slice(0, generation.residentCount),
  households,
};

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, 'definitions.json'), `${JSON.stringify(definitions, null, 2)}\n`, 'utf8');
await writeFile(join(outputDir, 'resident-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`Generated ${snapshot.residents.length} residents in ${snapshot.households.length} households.`);
