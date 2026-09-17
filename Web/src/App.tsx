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
import {
  ageAtDay,
  districtName,
  familySummary,
  occupationFor,
  type ResidentDefinitions,
  type ResidentRecord,
  type ResidentWorldSnapshot,
} from './domain/resident';
import { ResidentAvatar } from './resident/ResidentAvatar';
import { StoryReviewView } from './StoryReviewView';
import type { Story, StoryBranch, StoryCollection } from './types';

type AppMode = 'game' | 'review';

const START_OFFSETS = [0, 9, 22, 45, 76, 14, 105, 33];

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

async function loadJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${label}读取失败：HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

function branchHasFutureStep(branch: StoryBranch) {
  const stage2 = branch.stage2.time.maxDays ?? branch.stage2.time.minDays ?? 7;
  const stage3 = branch.stage3.time.maxDays ?? branch.stage3.time.minDays ?? 10;
  return stage2 > 0 && stage3 > 0;
}

function createAssignments(
  stories: Story[],
  residents: ResidentRecord[],
  definitions: ResidentDefinitions,
  currentDay: number,
): Record<number, ResidentAssignment> {
  return Object.fromEntries(residents.map((resident, index) => {
    const fallbackIndex = stories.length ? (index * 7 + 3) % stories.length : 0;
    let storyIndex = pickDemoStoryIndex(stories, resident, definitions, fallbackIndex);
    let story = stories[storyIndex];
    let branchIndex = story?.branches.length ? (index * 3 + 1) % story.branches.length : 0;

    if (index === 0) {
      outer: for (let candidateStoryIndex = 0; candidateStoryIndex < stories.length; candidateStoryIndex += 1) {
        const candidateStory = stories[candidateStoryIndex];
        for (let candidateBranchIndex = 0; candidateBranchIndex < candidateStory.branches.length; candidateBranchIndex += 1) {
          if (branchHasFutureStep(candidateStory.branches[candidateBranchIndex])) {
            storyIndex = candidateStoryIndex;
            story = candidateStory;
            branchIndex = candidateBranchIndex;
            break outer;
          }
        }
      }
    }

    return [resident.id, {
      storyIndex,
      branchIndex,
      startDay: currentDay - START_OFFSETS[index % START_OFFSETS.length],
    }];
  }));
}

function summarize(text: string | undefined, limit = 38) {
  if (!text) return '';
  const compact = compactText(text);
  return compact.length > limit ? `${compact.slice(0, limit)}…` : compact;
}

function markerPosition(resident: ResidentRecord, index: number) {
  const x = 10 + ((resident.seed + index * 31) % 78);
  const y = 20 + ((Math.floor(resident.seed / 97) + index * 17) % 58);
  return { x, y };
}

export default function App() {
  const [collection, setCollection] = useState<StoryCollection | null>(null);
  const [definitions, setDefinitions] = useState<ResidentDefinitions | null>(null);
  const [residentSnapshot, setResidentSnapshot] = useState<ResidentWorldSnapshot | null>(null);
  const [loadError, setLoadError] = useState('');
  const [mode, setMode] = useState<AppMode>('game');
  const [gameDay, setGameDay] = useState(120);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, ResidentAssignment>>({});
  const [seenStages, setSeenStages] = useState<Record<number, number>>({});
  const [showDev, setShowDev] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [bodyLines, setBodyLines] = useState(0);
  const [titleLines, setTitleLines] = useState(0);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadJson<StoryCollection>('/generated/stories.json', '故事数据'),
      loadJson<ResidentDefinitions>('/generated/definitions.json', '居民定义'),
      loadJson<ResidentWorldSnapshot>('/generated/resident-snapshot.json', '居民快照'),
    ])
      .then(([storyData, definitionData, snapshotData]) => {
        if (cancelled) return;
        setCollection(storyData);
        setDefinitions(definitionData);
        setResidentSnapshot(snapshotData);
        setGameDay(snapshotData.currentDay);
        setSelectedResidentId(snapshotData.residents[0]?.id ?? null);
        setAssignments(createAssignments(storyData.stories, snapshotData.residents, definitionData, snapshotData.currentDay));
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => { cancelled = true; };
  }, []);

  const stories = collection?.stories ?? [];
  const residents = residentSnapshot?.residents ?? [];
  const selectedResident = residents.find((item) => item.id === selectedResidentId) ?? residents[0];
  const selectedHousehold = residentSnapshot?.households.find((item) => item.id === selectedResident?.householdId);
  const assignment = selectedResident ? assignments[selectedResident.id] : undefined;
  const story = assignment && stories.length ? stories[assignment.storyIndex % stories.length] : undefined;
  const branch = story && assignment ? (story.branches[assignment.branchIndex] ?? story.branches[0]) : undefined;
  const schedule = assignment && branch ? scheduleFor(assignment, branch) : undefined;
  const stage = schedule ? stageAtDay(gameDay, schedule) : 0;
  const currentNode = story && branch ? nodeFor(story, branch, stage) : undefined;
  const residentLife = selectedResident && definitions && residentSnapshot && story && branch && assignment && schedule
    ? buildResidentLife(
      selectedResident,
      definitions,
      story,
      branch,
      assignment,
      schedule,
      stage,
      residentSnapshot.currentDay,
      gameDay,
    )
    : undefined;

  useEffect(() => {
    if (!panelOpen || !selectedResident || !schedule) return;
    setSeenStages((current) => ({ ...current, [selectedResident.id]: stage }));
  }, [panelOpen, selectedResident?.id, stage, schedule]);

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
    if (!stories.length) return {} as Record<number, StageIndex>;
    return Object.fromEntries(residents.map((resident) => {
      const currentAssignment = assignments[resident.id];
      if (!currentAssignment) return [resident.id, 0];
      const currentStory = stories[currentAssignment.storyIndex % stories.length];
      const currentBranch = currentStory?.branches[currentAssignment.branchIndex] ?? currentStory?.branches[0];
      if (!currentBranch) return [resident.id, 0];
      return [resident.id, stageAtDay(gameDay, scheduleFor(currentAssignment, currentBranch))];
    })) as Record<number, StageIndex>;
  }, [assignments, gameDay, residents, stories]);

  const markerResidents = useMemo(() => {
    const visible = residents.slice(0, 18);
    if (selectedResident && !visible.some((item) => item.id === selectedResident.id)) visible.push(selectedResident);
    return visible;
  }, [residents, selectedResident]);

  function selectResident(id: number) {
    setSelectedResidentId(id);
    setPanelOpen(true);
  }

  function selectRelativeResident(offset: number) {
    if (!residents.length || !selectedResident) return;
    const currentIndex = residents.findIndex((item) => item.id === selectedResident.id);
    const nextIndex = (currentIndex + offset + residents.length) % residents.length;
    setSelectedResidentId(residents[nextIndex].id);
    setPanelOpen(true);
  }

  function rerollStory() {
    if (!selectedResident || !stories.length || !story) return;
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
    if (!selectedResident || !story || !assignment || story.branches.length <= 1) return;
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
          <h1>居民数据读取失败</h1>
          <p>{loadError}</p>
        </section>
      </main>
    );
  }

  if (!collection || !definitions || !residentSnapshot || !selectedResident || !assignment || !story || !branch || !schedule || !currentNode || !residentLife) {
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
    ? residentLife.entries.slice(0, definitions.generation.recentLifeLogCapacity)
    : recentLifeEntries(residentLife.entries, latestStoryEntry, 5);
  const unreadCount = residents.filter((resident) => (stageByResident[resident.id] ?? 0) > (seenStages[resident.id] ?? -1)).length;
  const bodyDensity = bodyLines <= 4.5 ? 'good' : bodyLines <= 5.8 ? 'warn' : 'bad';
  const titleDensity = titleLines <= 2.05 ? 'good' : 'bad';
  const lifeCount = selectedResident.majorLifeHistory.length + residentLife.entries.filter((entry) => entry.kind === 'story').length;
  const selectedAge = ageAtDay(selectedResident, gameDay, definitions.generation.daysPerYear);
  const selectedFamily = familySummary(selectedResident, selectedHousehold);
  const selectedDistrict = districtName(definitions, selectedResident.districtId);
  const selectedIndex = residents.findIndex((item) => item.id === selectedResident.id);

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
          <span>人口样本 <b>{residents.length}</b></span>
          <span>木材 <b>3,240</b></span>
          <span>石料 <b>2,780</b></span>
        </div>
        <div className="sim-time-strip"><b>第 {gameDay} 日</b><span>14:36</span></div>
      </header>

      <section className="resident-markers" aria-label="模拟居民">
        {markerResidents.map((resident, index) => {
          const residentStage = stageByResident[resident.id] ?? 0;
          const isUnread = residentStage > (seenStages[resident.id] ?? -1);
          const isSelected = resident.id === selectedResident.id && panelOpen;
          const position = markerPosition(resident, index);
          const occupation = occupationFor(definitions, resident.occupationId)?.name ?? '居民';
          return (
            <button
              key={resident.id}
              type="button"
              className={`resident-marker ${isSelected ? 'is-selected' : ''}`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              onClick={() => selectResident(resident.id)}
              aria-label={`查看居民 ${resident.displayName}`}
            >
              <span className="resident-marker__person">人</span>
              {isUnread && !isSelected && <i className="resident-marker__new" />}
              <span className="resident-marker__label"><b>{resident.displayName}</b><small>{occupation}</small></span>
            </button>
          );
        })}
      </section>

      {panelOpen && (
        <aside className="resident-panel" aria-label={`${selectedResident.displayName}的居民信息`}>
          <header className="resident-panel__header">
            <div className="resident-avatar">
              <ResidentAvatar
                seed={selectedResident.portraitSeed}
                gender={selectedResident.gender}
                lifeStage={selectedResident.lifeStage}
                occupationId={selectedResident.occupationId}
              />
            </div>
            <div className="resident-identity">
              <div><b>{selectedResident.displayName}</b><span>{selectedAge}岁 · {residentLife.presentation.occupation}</span></div>
              <small>{selectedDistrict} · {selectedFamily}</small>
            </div>
            <button className="resident-panel__close" type="button" onClick={() => setPanelOpen(false)} aria-label="关闭居民面板">×</button>
          </header>

          <div className="resident-panel__body">
            <section className="resident-activity">
              <span>此刻</span>
              <p>{residentLife.presentation.activity}</p>
            </section>

            <section className="resident-life">
              <div className="resident-life__heading"><b>最近</b></div>

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
                          {isOlderStory && <span>前情</span>}
                          {entry.kind === 'state' && <span>人生变化</span>}
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
              {historyExpanded ? '收起' : `往事 ${lifeCount}`}<span>{historyExpanded ? '⌃' : '›'}</span>
            </button>
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
          <header><b>RESIDENT GENERATOR V1</b><button type="button" onClick={() => setShowDev(false)}>隐藏</button></header>
          <div className="dev-panel__row"><span>城市 Seed</span><b>{residentSnapshot.citySeed}</b></div>
          <div className="dev-panel__row"><span>当前居民</span><b>{selectedIndex + 1} / {residents.length} · {selectedResident.displayName}</b></div>
          <div className="dev-panel__row"><span>Resident</span><b>#{selectedResident.id} · Seed {selectedResident.seed}</b></div>
          <div className="dev-panel__row"><span>职业 / 家庭</span><b>{residentLife.presentation.occupation} · {selectedFamily}</b></div>
          <div className="dev-panel__row"><span>Story</span><b>{story.id}</b></div>
          <div className="dev-panel__row"><span>Branch</span><b>{branch.id} · Stage {stage + 1}</b></div>
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
          <p>{unreadCount} 位居民有未查看的故事进展。姓名、年龄、职业、家庭、近期生活均来自确定性居民快照。</p>
        </aside>
      )}

      {!showDev && <button className="dev-reopen" type="button" onClick={() => setShowDev(true)}>DEV</button>}
    </main>
  );
}
