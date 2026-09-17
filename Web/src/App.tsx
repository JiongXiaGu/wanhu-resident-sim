import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  buildResidentLife,
  compactText,
  nodeFor,
  pickDemoStoryIndex,
  recentLifeEntries,
  scheduleFor,
  stageAtDay,
  type ResidentAssignment,
  type StageIndex,
} from './life-log';
import { MOCK_RESIDENTS } from './mock-residents';
import { StoryReviewView } from './StoryReviewView';
import type { Story, StoryCollection } from './types';

type AppMode = 'game' | 'review';

const INITIAL_GAME_DAY = 120;
const START_OFFSETS = [2, 9, 22, 45, 76, 14, 105, 33];

function pickRandomIndex(length: number, except?: number) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (except !== undefined && next === except) next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length;
  return next;
}

function relativeDayLabel(days: number) {
  if (days <= 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 30) return `${days}日前`;
  const months = Math.max(1, Math.round(days / 30));
  if (months < 12) return `${months}个月前`;
  return `${Math.max(1, Math.round(months / 12))}年前`;
}

function createAssignments(stories: Story[]): Record<string, ResidentAssignment> {
  return Object.fromEntries(MOCK_RESIDENTS.map((resident, index) => {
    const fallbackIndex = stories.length ? (index * 7 + 3) % stories.length : 0;
    const storyIndex = pickDemoStoryIndex(stories, resident, fallbackIndex);
    const story = stories[storyIndex];
    const branchIndex = story?.branches.length ? (index * 3 + 1) % story.branches.length : 0;
    return [resident.id, {
      storyIndex,
      branchIndex,
      startDay: INITIAL_GAME_DAY - START_OFFSETS[index % START_OFFSETS.length],
    }];
  }));
}

function summarize(text: string | undefined, limit = 38) {
  if (!text) return '';
  const compact = compactText(text);
  return compact.length > limit ? `${compact.slice(0, limit)}…` : compact;
}

export default function App() {
  const [collection, setCollection] = useState<StoryCollection | null>(null);
  const [loadError, setLoadError] = useState('');
  const [mode, setMode] = useState<AppMode>('game');
  const [gameDay, setGameDay] = useState(INITIAL_GAME_DAY);
  const [selectedResidentId, setSelectedResidentId] = useState(MOCK_RESIDENTS[0].id);
  const [assignments, setAssignments] = useState<Record<string, ResidentAssignment>>({});
  const [seenStages, setSeenStages] = useState<Record<string, number>>({});
  const [showDev, setShowDev] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [bodyLines, setBodyLines] = useState(0);
  const [titleLines, setTitleLines] = useState(0);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/generated/stories.json')
      .then(async (response) => {
        if (!response.ok) throw new Error(`故事数据读取失败：HTTP ${response.status}`);
        return response.json() as Promise<StoryCollection>;
      })
      .then((data) => {
        if (cancelled) return;
        setCollection(data);
        setAssignments(createAssignments(data.stories));
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => { cancelled = true; };
  }, []);

  const stories = collection?.stories ?? [];
  const selectedResident = MOCK_RESIDENTS.find((item) => item.id === selectedResidentId) ?? MOCK_RESIDENTS[0];
  const assignment = assignments[selectedResident.id];
  const story = assignment && stories.length ? stories[assignment.storyIndex % stories.length] : undefined;
  const branch = story && assignment ? (story.branches[assignment.branchIndex] ?? story.branches[0]) : undefined;
  const schedule = assignment && branch ? scheduleFor(assignment, branch) : undefined;
  const stage = schedule ? stageAtDay(gameDay, schedule) : 0;
  const currentNode = story && branch ? nodeFor(story, branch, stage) : undefined;
  const residentLife = selectedResident && story && branch && assignment && schedule
    ? buildResidentLife(selectedResident, story, branch, assignment, schedule, stage, gameDay)
    : undefined;

  useEffect(() => {
    if (!panelOpen || !selectedResident || !schedule) return;
    setSeenStages((current) => ({ ...current, [selectedResident.id]: stage }));
  }, [panelOpen, selectedResident.id, stage, schedule]);

  useEffect(() => {
    setHistoryExpanded(false);
  }, [selectedResidentId]);

  useLayoutEffect(() => {
    function measure(element: HTMLElement | null) {
      if (!element) return 0;
      const style = window.getComputedStyle(element);
      const lineHeight = Number.parseFloat(style.lineHeight);
      if (!Number.isFinite(lineHeight) || lineHeight <= 0) return 0;
      return element.scrollHeight / lineHeight;
    }

    const frame = window.requestAnimationFrame(() => {
      setBodyLines(measure(bodyRef.current));
      setTitleLines(measure(titleRef.current));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [residentLife?.latestStoryEntry.id, selectedResidentId, gameDay]);

  const stageByResident = useMemo(() => {
    if (!stories.length) return {} as Record<string, StageIndex>;
    return Object.fromEntries(MOCK_RESIDENTS.map((resident) => {
      const currentAssignment = assignments[resident.id];
      if (!currentAssignment) return [resident.id, 0];
      const currentStory = stories[currentAssignment.storyIndex % stories.length];
      const currentBranch = currentStory?.branches[currentAssignment.branchIndex] ?? currentStory?.branches[0];
      if (!currentBranch) return [resident.id, 0];
      return [resident.id, stageAtDay(gameDay, scheduleFor(currentAssignment, currentBranch))];
    })) as Record<string, StageIndex>;
  }, [assignments, gameDay, stories]);

  function selectResident(id: string) {
    setSelectedResidentId(id);
    setPanelOpen(true);
  }

  function selectRelativeResident(offset: number) {
    const currentIndex = MOCK_RESIDENTS.findIndex((item) => item.id === selectedResidentId);
    const nextIndex = (currentIndex + offset + MOCK_RESIDENTS.length) % MOCK_RESIDENTS.length;
    setSelectedResidentId(MOCK_RESIDENTS[nextIndex].id);
    setPanelOpen(true);
  }

  function rerollStory() {
    if (!stories.length || !story) return;
    const nextStoryIndex = pickRandomIndex(stories.length, assignment?.storyIndex);
    const nextStory = stories[nextStoryIndex];
    setAssignments((current) => ({
      ...current,
      [selectedResident.id]: {
        storyIndex: nextStoryIndex,
        branchIndex: pickRandomIndex(nextStory.branches.length),
        startDay: gameDay,
      },
    }));
    setSeenStages((current) => ({ ...current, [selectedResident.id]: -1 }));
    setHistoryExpanded(false);
  }

  function rerollBranch() {
    if (!story || !assignment || story.branches.length <= 1) return;
    setAssignments((current) => ({
      ...current,
      [selectedResident.id]: {
        ...assignment,
        branchIndex: pickRandomIndex(story.branches.length, assignment.branchIndex),
        startDay: gameDay,
      },
    }));
    setSeenStages((current) => ({ ...current, [selectedResident.id]: -1 }));
    setHistoryExpanded(false);
  }

  function jumpToNextNode() {
    if (!schedule) return;
    if (stage === 0) setGameDay((day) => Math.max(day, schedule.stage2Day));
    else if (stage === 1) setGameDay((day) => Math.max(day, schedule.stage3Day));
  }

  if (loadError) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU RESIDENT SIM</p>
          <h1>故事数据读取失败</h1>
          <p>{loadError}</p>
        </section>
      </main>
    );
  }

  if (!collection || !assignment || !story || !branch || !schedule || !currentNode || !residentLife) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU RESIDENT SIM</p>
          <h1>正在生成居民生活…</h1>
        </section>
      </main>
    );
  }

  if (mode === 'review') return <StoryReviewView collection={collection} onExit={() => setMode('game')} />;

  const latestStoryEntry = residentLife.latestStoryEntry;
  const visibleEntries = historyExpanded
    ? residentLife.entries.slice(0, 12)
    : recentLifeEntries(residentLife.entries, latestStoryEntry, 5);
  const unreadCount = MOCK_RESIDENTS.filter((resident) => (stageByResident[resident.id] ?? 0) > (seenStages[resident.id] ?? -1)).length;
  const bodyDensity = bodyLines <= 4.5 ? 'good' : bodyLines <= 5.8 ? 'warn' : 'bad';
  const titleDensity = titleLines <= 2.05 ? 'good' : 'bad';
  const lifeCount = selectedResident.historyCount + Math.max(1, residentLife.entries.filter((entry) => entry.kind !== 'routine').length);

  return (
    <main className="sim-game" data-dev={showDev ? 'true' : 'false'}>
      <div className="sim-world" aria-hidden="true">
        <div className="sim-world__mist" />
        <div className="sim-world__river" />
        <div className="sim-world__district sim-world__district--one" />
        <div className="sim-world__district sim-world__district--two" />
        <div className="sim-world__district sim-world__district--three" />
        <div className="sim-world__road sim-world__road--one" />
        <div className="sim-world__road sim-world__road--two" />
      </div>

      <header className="sim-top-hud">
        <div className="sim-city-name"><b>万户城</b><span>秋 · 晴</span></div>
        <div className="sim-resource-strip">
          <span>钱粮 <b>24,680</b></span>
          <span>人口 <b>8,426</b></span>
          <span>木材 <b>3,240</b></span>
          <span>石料 <b>2,780</b></span>
        </div>
        <div className="sim-time-strip"><b>第 {gameDay} 日</b><span>14:36</span></div>
      </header>

      <section className="resident-markers" aria-label="模拟居民">
        {MOCK_RESIDENTS.map((resident) => {
          const residentStage = stageByResident[resident.id] ?? 0;
          const isUnread = residentStage > (seenStages[resident.id] ?? -1);
          const isSelected = resident.id === selectedResident.id && panelOpen;
          return (
            <button
              key={resident.id}
              type="button"
              className={`resident-marker ${isSelected ? 'is-selected' : ''}`}
              style={{ left: `${resident.marker.x}%`, top: `${resident.marker.y}%` }}
              onClick={() => selectResident(resident.id)}
              aria-label={`查看居民 ${resident.name}`}
            >
              <span className="resident-marker__person">人</span>
              {isUnread && !isSelected && <i className="resident-marker__new" />}
              <span className="resident-marker__label"><b>{resident.name}</b><small>{resident.occupation}</small></span>
            </button>
          );
        })}
      </section>

      {panelOpen && (
        <aside className="resident-panel" aria-label={`${selectedResident.name}的居民信息`}>
          <header className="resident-panel__header">
            <div className="resident-avatar" aria-hidden="true">{selectedResident.name.slice(-1)}</div>
            <div className="resident-identity">
              <div><b>{selectedResident.name}</b><span>{selectedResident.age}岁 · {residentLife.presentation.occupation}</span></div>
              <small>{selectedResident.district} · {residentLife.presentation.family}</small>
            </div>
            <button className="resident-panel__close" type="button" onClick={() => setPanelOpen(false)} aria-label="关闭居民面板">×</button>
          </header>

          <div className="resident-panel__body">
            <section className="resident-activity">
              <span>此刻</span>
              <p>{residentLife.presentation.activity}</p>
            </section>

            <section className="resident-life">
              <div className="resident-life__heading">
                <b>最近</b>
                <small>看看他最近过得怎么样</small>
              </div>

              <div className="resident-life__feed">
                {visibleEntries.map((entry) => {
                  const isLatestStory = entry.id === latestStoryEntry.id;
                  const isOlderStory = entry.kind === 'story' && !isLatestStory;
                  const relativeDays = Math.max(0, gameDay - entry.day);
                  return (
                    <article
                      key={entry.id}
                      className={`life-entry life-entry--${entry.kind} ${isLatestStory ? 'is-featured' : ''} ${isOlderStory ? 'is-story-history' : ''}`}
                    >
                      <div className="life-entry__rail" aria-hidden="true"><i /></div>
                      <div className="life-entry__content">
                        <div className="life-entry__meta">
                          <time>{relativeDayLabel(relativeDays)}</time>
                          {isLatestStory && <span>生活近况</span>}
                          {isOlderStory && <span>同一件事</span>}
                          {entry.kind === 'state' && <span>生活变化</span>}
                        </div>

                        {isLatestStory ? (
                          <>
                            <h2 ref={titleRef}>{entry.title}</h2>
                            <p className="life-entry__story-text" ref={bodyRef}>{entry.text}</p>
                          </>
                        ) : entry.kind === 'story' ? (
                          <>
                            <h3>{entry.title}</h3>
                            <p className="life-entry__summary">{summarize(entry.text)}</p>
                          </>
                        ) : (
                          <p className="life-entry__routine-text">{entry.title}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <footer className="resident-panel__footer">
            <button type="button" onClick={() => setHistoryExpanded((value) => !value)}>
              {historyExpanded ? '收起最近记录' : `往事 ${lifeCount}`}<span>{historyExpanded ? '⌃' : '›'}</span>
            </button>
            <small>{historyExpanded ? '显示更多生活记录' : `${visibleEntries.length} 条最近生活记录`}</small>
          </footer>
        </aside>
      )}

      <nav className="sim-command-dock" aria-label="模拟游戏主工具栏">
        {['道路', '桥梁', '建筑', '城墙', '装饰'].map((label, index) => (
          <button key={label} type="button" className={index === 2 ? 'is-active' : ''}><i />{label}</button>
        ))}
      </nav>

      <div className="sim-world-tools" aria-hidden="true"><span>↶</span><span>↷</span><span>网格</span></div>

      {showDev && (
        <aside className="dev-panel">
          <header><b>GAME UI VALIDATION</b><button type="button" onClick={() => setShowDev(false)}>隐藏</button></header>
          <div className="dev-panel__row"><span>当前居民</span><b>{selectedResident.name}</b></div>
          <div className="dev-panel__row"><span>Story</span><b>{story.id}</b></div>
          <div className="dev-panel__row"><span>Branch</span><b>{branch.id} · Stage {stage + 1}</b></div>
          <div className="dev-panel__row"><span>居民状态</span><b>{residentLife.presentation.occupation} · {residentLife.presentation.family}</b></div>
          <div className="dev-density">
            <span className={`density-chip is-${bodyDensity}`}>正文 {bodyLines.toFixed(1)} 行</span>
            <span className={`density-chip is-${titleDensity}`}>标题 {titleLines.toFixed(1)} 行</span>
          </div>
          <div className="dev-buttons dev-buttons--three">
            <button type="button" onClick={() => selectRelativeResident(-1)}>上一居民</button>
            <button type="button" onClick={() => selectRelativeResident(1)}>下一居民</button>
            <button type="button" onClick={rerollStory}>重抽故事</button>
          </div>
          <div className="dev-buttons dev-buttons--three">
            <button type="button" onClick={() => setGameDay((day) => day + 1)}>+1 天</button>
            <button type="button" onClick={() => setGameDay((day) => day + 10)}>+10 天</button>
            <button type="button" onClick={jumpToNextNode} disabled={stage === 2}>推进节点</button>
          </div>
          <div className="dev-buttons dev-buttons--two">
            <button type="button" onClick={rerollBranch}>重抽分支</button>
            <button type="button" onClick={() => setMode('review')}>完整审查器</button>
          </div>
          <p>{unreadCount} 位居民有未查看的故事进展。玩家界面只读取 LifeLog；Story / Branch / Stage 仅在开发面板保留。</p>
        </aside>
      )}

      {!showDev && <button className="dev-reopen" type="button" onClick={() => setShowDev(true)}>DEV</button>}
    </main>
  );
}
