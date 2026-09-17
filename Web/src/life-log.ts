import type { MockResident } from './mock-residents';
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
  family: string;
  activity: string;
};

const STORY_HINTS: Record<string, string[]> = {
  '布庄伙计': ['布', '铺', '掌柜', '货', '账'],
  '陶工': ['陶', '窑', '坛', '酒'],
  '灯彩匠': ['灯', '庙会', '手艺'],
  '账房': ['账', '钱', '作保', '老友', '生意'],
  '学徒': ['学徒', '先生', '第一次', '做活'],
  '退下来的木工': ['老', '木', '修', '手艺'],
  '郎中': ['病', '药', '郎中', '看病'],
  '守闸人': ['河', '闸', '船', '桥', '水'],
};

const ROUTINE_HINTS: Record<string, string[]> = {
  '布庄伙计': [
    '清早替铺里开了门',
    '午后盘了一遍架上的布',
    '回家前顺路买了些盐',
    '替熟客留下一匹常买的布',
    '下雨后把门口的货往里挪了挪',
  ],
  '陶工': [
    '天没亮就去看了一遍窑火',
    '把新拉好的坯子搬到阴处晾着',
    '午后挑掉了两只裂口的旧坛',
    '收工前又摸了一遍窑口的温度',
    '去泥场看了看新送来的陶土',
  ],
  '灯彩匠': [
    '替街口一户人家换了灯骨',
    '把剩下的彩纸重新分了颜色',
    '午后坐在门边削了一捆竹篾',
    '有人来问旧灯还能不能修',
    '收工前试亮了一盏刚糊好的灯',
  ],
  '账房': [
    '上午对完了昨日的几笔旧账',
    '替掌柜重新算了一遍货款',
    '午后去茶铺见了一个旧相识',
    '把月底要收的账单独夹了出来',
    '收工前又核了一遍钱柜',
  ],
  '学徒': [
    '一早替家里跑了一趟腿',
    '午后跟着师傅做了一阵杂活',
    '把今天用过的工具擦干净了',
    '回家时和朋友在巷口站了一会儿',
    '今天第一次独自做完一件小活',
  ],
  '退下来的木工': [
    '坐在门前修了一只旧木凳',
    '午后和几个老朋友说了会儿话',
    '替邻居削好了一个新门栓',
    '天气好，在巷口晒了半日太阳',
    '把多年没用的旧工具又磨了一遍',
  ],
  '郎中': [
    '清早出门看了两个病人',
    '午后重新整理了一遍药柜',
    '有人来问旧方子还能不能继续用',
    '回家前去药铺补了几味常用药',
    '今日没有急症，难得按时吃了晚饭',
  ],
  '守闸人': [
    '天亮后先看了一遍河面水位',
    '午后记下了今日过闸的几艘货船',
    '替一艘外地船说明了过闸次序',
    '收工前清掉了闸边缠住的水草',
    '今日船少，比平时早些关了闸',
  ],
};

const GENERIC_ROUTINES = [
  '去早市买了些家里缺的东西',
  '和邻居在巷口说了一会儿话',
  '午后下了阵雨，早些收了工',
  '回家时顺手带了些吃食',
  '晚上在门口坐了一阵才进屋',
];

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

export function pickDemoStoryIndex(stories: Story[], resident: MockResident, fallbackIndex: number) {
  if (!stories.length) return 0;
  const hints = STORY_HINTS[resident.occupation] ?? [];
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

export function nodeDayFor(assignment: ResidentAssignment, schedule: StageSchedule, stage: StageIndex) {
  if (stage === 0) return assignment.startDay;
  if (stage === 1) return schedule.stage2Day;
  return schedule.stage3Day;
}

export function compactText(text: string) {
  return text.split(/\n\s*\n/g).map((item) => item.trim()).filter(Boolean).join('');
}

function routineEntries(resident: MockResident, gameDay: number, storyDays: number[]) {
  const templates = ROUTINE_HINTS[resident.occupation] ?? GENERIC_ROUTINES;
  const phase = hashText(resident.id) % 8;
  const startDay = Math.max(1, gameDay - 120);
  const entries: ResidentLifeEntry[] = [];

  for (let day = phase; day <= gameDay; day += 8) {
    if (day < startDay) continue;
    if (storyDays.some((storyDay) => Math.abs(storyDay - day) <= 1)) continue;
    const template = templates[hashText(`${resident.id}:${day}`) % templates.length];
    entries.push({
      id: `${resident.id}-routine-${day}`,
      day,
      kind: 'routine',
      title: template,
    });
  }

  return entries;
}

function storyEntries(story: Story, branch: StoryBranch, assignment: ResidentAssignment, schedule: StageSchedule, stage: StageIndex) {
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

function applyStoryEffect(resident: MockResident, story: Story, stage: StageIndex): ResidentPresentation {
  const presentation: ResidentPresentation = {
    occupation: resident.occupation,
    family: resident.family,
    activity: resident.activity,
  };

  if (stage < 2) return presentation;
  const title = story.title;

  if (/布庄.*做主|女掌柜|自己的铺子|开自己的铺/.test(title)) {
    presentation.occupation = '掌柜';
    presentation.activity = '正在柜台后核对今日的账和货';
  } else if (/丢了营生|没了营生/.test(title)) {
    presentation.occupation = '暂时没有固定营生';
    presentation.activity = '正在四处打听新的活计';
  } else if (/去别人家做工/.test(title)) {
    presentation.occupation = '受雇做工';
    presentation.activity = '正在替东家做今日的活';
  }

  if (/母亲搬来和我同住/.test(title) && !presentation.family.includes('母亲')) {
    presentation.family = `${presentation.family} · 母亲同住`;
  }

  if (/第一次有了自己的孩子|有了自己的孩子/.test(title) && !presentation.family.includes('新添')) {
    presentation.family = `${presentation.family} · 新添孩子`;
    presentation.activity = '忙完手里的活，准备早些回家';
  }

  return presentation;
}

function stateEntry(resident: MockResident, story: Story, schedule: StageSchedule, stage: StageIndex) {
  const presentation = applyStoryEffect(resident, story, stage);
  if (stage < 2) return { presentation, entry: null as ResidentLifeEntry | null };

  const changes: string[] = [];
  if (presentation.occupation !== resident.occupation) changes.push(`如今的营生变成了“${presentation.occupation}”`);
  if (presentation.family !== resident.family) changes.push('家里的同住关系也有了变化');
  if (!changes.length) return { presentation, entry: null as ResidentLifeEntry | null };

  return {
    presentation,
    entry: {
      id: `${resident.id}-${story.id}-state`,
      day: schedule.stage3Day + 1,
      kind: 'state' as const,
      title: changes.join('，'),
      storyId: story.id,
    },
  };
}

export function buildResidentLife(
  resident: MockResident,
  story: Story,
  branch: StoryBranch,
  assignment: ResidentAssignment,
  schedule: StageSchedule,
  stage: StageIndex,
  gameDay: number,
) {
  const stories = storyEntries(story, branch, assignment, schedule, stage);
  const storyDays = stories.map((item) => item.day);
  const routines = routineEntries(resident, gameDay, storyDays);
  const effect = stateEntry(resident, story, schedule, stage);
  const all = [...stories, ...routines];
  if (effect.entry && effect.entry.day <= gameDay) all.push(effect.entry);
  all.sort((left, right) => right.day - left.day || right.id.localeCompare(left.id));

  const latestStoryEntry = [...stories].sort((left, right) => right.day - left.day)[0];
  return {
    entries: all,
    latestStoryEntry,
    presentation: effect.presentation,
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
