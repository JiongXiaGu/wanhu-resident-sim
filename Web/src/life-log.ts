import type { ResidentDefinitions, ResidentRecord } from './domain/resident';
import { occupationFor } from './domain/resident';
import type { Story, StoryBranch, StoryNode, StoryTime } from './types';

export type StageIndex = 0 | 1 | 2;

export type ResidentAssignment = {
  storyIndex: number;
  branchIndex: number;
  startDay: number;
};

export type StageSchedule = {
  stage2Day: number;
  stage3Day: number;
};

export type ResidentLifeEntry = {
  id: string;
  day: number;
  kind: 'story' | 'routine' | 'state';
  title: string;
  text?: string;
  storyId?: string;
  stage?: StageIndex;
};

export type ResidentPresentation = {
  occupation: string;
  activity: string;
};

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function scoreStory(story: Story, hints: string[]) {
  const title = story.title;
  const categories = story.categories.join(' ');
  return hints.reduce((score, hint) => {
    if (title.includes(hint)) return score + 4;
    if (categories.includes(hint)) return score + 1;
    return score;
  }, 0);
}

export function pickDemoStoryIndex(
  stories: Story[],
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  fallbackIndex: number,
) {
  if (!stories.length) return 0;
  const occupation = occupationFor(definitions, resident.occupationId);
  const hints = occupation?.storyHints ?? [];
  let bestIndex = -1;
  let bestScore = 0;

  stories.forEach((story, index) => {
    const score = scoreStory(story, hints);
    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  return bestIndex >= 0 ? bestIndex : fallbackIndex % stories.length;
}

export function midpointDelay(time: StoryTime, fallback: number) {
  const min = time.minDays ?? fallback;
  const max = time.maxDays ?? min;
  return Math.max(0, Math.round((min + max) / 2));
}

export function scheduleFor(assignment: ResidentAssignment, branch: StoryBranch): StageSchedule {
  const stage2Delay = midpointDelay(branch.stage2.time, 7);
  const stage2Day = assignment.startDay + stage2Delay;
  const stage3Delay = midpointDelay(branch.stage3.time, 10);
  const stage3Base = branch.stage3.time.relativeTo === 'story-start' ? assignment.startDay : stage2Day;
  return {
    stage2Day,
    stage3Day: stage3Base + stage3Delay,
  };
}

export function stageAtDay(gameDay: number, schedule: StageSchedule): StageIndex {
  if (gameDay >= schedule.stage3Day) return 2;
  if (gameDay >= schedule.stage2Day) return 1;
  return 0;
}

export function nodeFor(story: Story, branch: StoryBranch, stage: StageIndex): StoryNode {
  if (stage === 0) return story.start;
  if (stage === 1) return branch.stage2;
  return branch.stage3;
}

export function compactText(text: string) {
  return text.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean).join('');
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
  storyDays: number[],
) {
  const entries: ResidentLifeEntry[] = resident.recentLifeLog
    .filter((entry) => entry.day <= gameDay)
    .map((entry) => ({
      id: entry.id,
      day: entry.day,
      kind: entry.kind,
      title: entry.title,
      text: entry.text,
    }));

  if (gameDay <= baselineDay) return entries;
  const pool = routinePool(resident, definitions);
  if (!pool.length) return entries;

  const { min, max } = definitions.generation.routineIntervalDays;
  let day = baselineDay + 2 + (resident.seed % 5);
  while (day <= gameDay) {
    if (!storyDays.some((storyDay) => Math.abs(storyDay - day) <= 1)) {
      const template = pool[hashText(`${resident.seed}:routine:${day}`) % pool.length];
      entries.push({
        id: `${resident.id}:${template.id}:${day}`,
        day,
        kind: 'routine',
        title: template.text,
      });
    }
    day += min + (hashText(`${resident.seed}:interval:${day}`) % Math.max(1, max - min + 1));
  }

  return entries;
}

function storyEntries(
  story: Story,
  branch: StoryBranch,
  assignment: ResidentAssignment,
  schedule: StageSchedule,
  stage: StageIndex,
) {
  const entries: ResidentLifeEntry[] = [
    {
      id: `${story.id}-stage-1`,
      day: assignment.startDay,
      kind: 'story',
      title: story.start.title,
      text: compactText(story.start.text),
      storyId: story.id,
      stage: 0,
    },
  ];

  if (stage >= 1) {
    entries.push({
      id: `${story.id}-${branch.id}-stage-2`,
      day: schedule.stage2Day,
      kind: 'story',
      title: branch.stage2.title,
      text: compactText(branch.stage2.text),
      storyId: story.id,
      stage: 1,
    });
  }

  if (stage >= 2) {
    entries.push({
      id: `${story.id}-${branch.id}-stage-3`,
      day: schedule.stage3Day,
      kind: 'story',
      title: branch.stage3.title,
      text: compactText(branch.stage3.text),
      storyId: story.id,
      stage: 2,
    });
  }

  return entries;
}

function majorHistoryEntries(resident: ResidentRecord, gameDay: number) {
  return resident.majorLifeHistory
    .filter((entry) => entry.day <= gameDay)
    .map<ResidentLifeEntry>((entry) => ({
      id: entry.id,
      day: entry.day,
      kind: 'state',
      title: entry.title,
    }));
}

function presentationFor(resident: ResidentRecord, definitions: ResidentDefinitions, gameDay: number): ResidentPresentation {
  const occupation = occupationFor(definitions, resident.occupationId);
  const isOffDay = ((gameDay + resident.seed) % 7) === 0;
  return {
    occupation: occupation?.name ?? '居民',
    activity: isOffDay
      ? occupation?.offActivity ?? '正在家里歇着'
      : occupation?.workActivity ?? '正在忙今天的事情',
  };
}

export function buildResidentLife(
  resident: ResidentRecord,
  definitions: ResidentDefinitions,
  story: Story,
  branch: StoryBranch,
  assignment: ResidentAssignment,
  schedule: StageSchedule,
  stage: StageIndex,
  baselineDay: number,
  gameDay: number,
) {
  const stories = storyEntries(story, branch, assignment, schedule, stage);
  const storyDays = stories.map((item) => item.day);
  const routines = routineEntries(resident, definitions, baselineDay, gameDay, storyDays);
  const history = majorHistoryEntries(resident, gameDay);
  const all = [...stories, ...routines, ...history]
    .filter((entry) => entry.day <= gameDay)
    .sort((left, right) => right.day - left.day || right.id.localeCompare(left.id));

  const latestStoryEntry = [...stories]
    .filter((entry) => entry.day <= gameDay)
    .sort((left, right) => right.day - left.day)[0] ?? stories[0];

  return {
    entries: all,
    latestStoryEntry,
    presentation: presentationFor(resident, definitions, gameDay),
  };
}

export function recentLifeEntries(entries: ResidentLifeEntry[], latestStoryEntry: ResidentLifeEntry, limit = 5) {
  const recent = entries.slice(0, limit);
  if (!recent.some((entry) => entry.id === latestStoryEntry.id)) {
    recent.push(latestStoryEntry);
    recent.sort((left, right) => right.day - left.day || right.id.localeCompare(left.id));
  }
  return recent.slice(0, limit + 1);
}
