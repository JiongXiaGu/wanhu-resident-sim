import { useEffect, useMemo, useState } from 'react';
import {
  ageAtDay,
  districtName,
  familySummary,
  occupationFor,
  residentProfileLabels,
  type HouseholdRecord,
  type ResidentDefinitions,
  type ResidentRecord,
  type ResidentWorldSnapshot,
} from './domain/resident';
import { ResidentAvatar } from './resident/ResidentAvatar';
import { AvatarIntegration, openAvatarEditor } from './avatar/Integration';
import { buildResidentLifeView, eligibleLifeEvents } from './simulation/life-events';


async function loadJson<T>(url: string, label: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${label}读取失败：HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

function relativeDayLabel(days: number) {
  if (days <= 0) return '今日';
  if (days === 1) return '昨日';
  if (days < 30) return `${days}日前`;
  const months = Math.max(1, Math.round(days / 30));
  if (months < 12) return `${months}个月前`;
  return `${Math.max(1, Math.round(months / 12))}年前`;
}

function markerPosition(resident: ResidentRecord, index: number) {
  const x = 10 + ((resident.seed + index * 31) % 78);
  const y = 20 + ((Math.floor(resident.seed / 97) + index * 17) % 58);
  return { x, y };
}

function relationLabel(owner: ResidentRecord, member: ResidentRecord) {
  if (owner.spouseId === member.id) return '配偶';
  if (owner.fatherId === member.id) return '父亲';
  if (owner.motherId === member.id) return '母亲';
  if (member.fatherId === owner.id || member.motherId === owner.id) return member.gender === 'male' ? '儿子' : '女儿';
  return '家人';
}

export default function App() {
  const [definitions, setDefinitions] = useState<ResidentDefinitions | null>(null);
  const [residentSnapshot, setResidentSnapshot] = useState<ResidentWorldSnapshot | null>(null);
  const [loadError, setLoadError] = useState('');
  const [gameDay, setGameDay] = useState(120);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [showDev, setShowDev] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [followed, setFollowed] = useState<Record<number, boolean>>({});
  const [locationNotice, setLocationNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadJson<ResidentDefinitions>('/generated/definitions.json', '居民定义'),
      loadJson<ResidentWorldSnapshot>('/generated/resident-snapshot.json', '居民快照'),
    ])
      .then(([definitionData, snapshotData]) => {
        if (cancelled) return;
        if (!definitionData.lifeEvents?.length) throw new Error('LifeEvent V3 定义为空');
        setDefinitions(definitionData);
        setResidentSnapshot(snapshotData);
        setGameDay(snapshotData.currentDay);
        setSelectedResidentId(snapshotData.residents[0]?.id ?? null);
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });
    return () => { cancelled = true; };
  }, []);

  const residents = residentSnapshot?.residents ?? [];
  const selectedResident = residents.find((item) => item.id === selectedResidentId) ?? residents[0];
  const selectedHousehold = residentSnapshot?.households.find((item) => item.id === selectedResident?.householdId);
  const lifeView = selectedResident && definitions
    ? buildResidentLifeView(selectedResident, selectedHousehold, definitions, gameDay)
    : undefined;

  useEffect(() => {
    setFamilyOpen(false);
    setHistoryExpanded(false);
    setExpandedChapterId(null);
    setLocationNotice('');
  }, [selectedResidentId]);

  const markerResidents = useMemo(() => {
    const visible = residents.slice(0, 18);
    if (selectedResident && !visible.some((item) => item.id === selectedResident.id)) visible.push(selectedResident);
    return visible;
  }, [residents, selectedResident]);

  const householdMembers = selectedHousehold && selectedResident
    ? selectedHousehold.memberIds
      .filter((id) => id !== selectedResident.id)
      .map((id) => residents.find((item) => item.id === id))
      .filter((item): item is ResidentRecord => Boolean(item))
    : [];

  function selectResident(id: number) {
    setSelectedResidentId(id);
    setPanelOpen(true);
  }

  function selectRelativeResident(offset: number) {
    if (!residents.length || !selectedResident) return;
    const currentIndex = residents.findIndex((item) => item.id === selectedResident.id);
    const nextIndex = (currentIndex + offset + residents.length) % residents.length;
    selectResident(residents[nextIndex].id);
  }

  function focusLocation(label: string) {
    setLocationNotice(`镜头定位 · ${label}`);
  }

  function openHistory() {
    setFamilyOpen(false);
    setExpandedChapterId(null);
    setHistoryExpanded(true);
  }

  function closeHistory() {
    setExpandedChapterId(null);
    setHistoryExpanded(false);
  }

  function toggleFamily() {
    setHistoryExpanded(false);
    setExpandedChapterId(null);
    setFamilyOpen((value) => !value);
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

  if (!definitions || !residentSnapshot || !selectedResident || !lifeView) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU RESIDENT SIM</p>
          <h1>正在生成居民生活…</h1>
        </section>
      </main>
    );
  }

  const occupation = occupationFor(definitions, selectedResident.occupationId);
  const selectedAge = ageAtDay(selectedResident, gameDay, definitions.generation.daysPerYear);
  const selectedFamily = familySummary(selectedResident, selectedHousehold);
  const selectedDistrict = districtName(definitions, selectedResident.districtId);
  const selectedProfileLabels = residentProfileLabels(definitions, selectedResident);
  const selectedIndex = residents.findIndex((item) => item.id === selectedResident.id);
  const lifeCount = lifeView.history.length;
  const chronologicalHistory = [...lifeView.history].sort((left, right) => left.day - right.day);
  const eligibleEventCount = eligibleLifeEvents(selectedResident, selectedHousehold, definitions, gameDay).length;
  const lifeTagLabels = selectedResident.lifeTags
    .map((id) => definitions.lifeTags.find((item) => item.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  return (
    <main className="sim-game" data-dev={showDev ? 'true' : 'false'} data-city-seed={residentSnapshot.citySeed} data-game-day={gameDay}>
      <AvatarIntegration snapshot={residentSnapshot} definitions={definitions} currentDay={gameDay} daysPerYear={definitions.generation.daysPerYear} onSelectResident={selectResident} />
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
          const isSelected = resident.id === selectedResident.id && panelOpen;
          const position = markerPosition(resident, index);
          const residentOccupation = occupationFor(definitions, resident.occupationId)?.name ?? '居民';
          return (
            <button key={resident.id} type="button" className={`resident-marker ${isSelected ? 'is-selected' : ''}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} onClick={() => selectResident(resident.id)} aria-label={`查看居民 ${resident.displayName}`}>
              <span className="resident-marker__person">人</span>
              <span className="resident-marker__label"><b>{resident.displayName}</b><small>{residentOccupation}</small></span>
            </button>
          );
        })}
      </section>

      {panelOpen && (
        <aside className={`resident-panel resident-panel--v2 ${historyExpanded ? 'is-history-mode' : ''}`} aria-label={`${selectedResident.displayName}的居民信息`}>
          <header className="resident-panel__header resident-profile-hero">
            <div className="resident-portrait-stack">
              <div className="resident-avatar">
                <ResidentAvatar
                  seed={selectedResident.seed}
                  citySeed={residentSnapshot.citySeed}
                  residentStableId={selectedResident.id}
                  gender={selectedResident.gender}
                  lifeStage={selectedResident.lifeStage}
                  wealthTier={selectedHousehold?.wealthTier ?? 'plain'}
                  portrait={selectedResident.portrait}
                  profile={selectedResident.profile}
                  occupationGroupId={occupation?.groupId}
                  label={`${selectedResident.displayName}的头像`}
                />
              </div>
              <button className="avatar-hero-edit" type="button" data-edit-resident-avatar={selectedResident.id} onClick={() => openAvatarEditor(selectedResident.id)}>编辑头像</button>
            </div>
            <div className="resident-identity">
              <span className="resident-identity__eyebrow">RESIDENT / 居民档案</span>
              <div className="resident-identity__title">
                <b>{selectedResident.displayName}</b>
                <span>{selectedAge}岁 · {occupation?.name ?? '居民'}</span>
              </div>
              <small>{selectedDistrict} · {selectedFamily}</small>
              <div className="resident-profile-summary" data-resident-profile>
                {selectedProfileLabels.map((label) => <span key={label}>{label}</span>)}
              </div>
              <button
                className={`resident-follow-toggle ${followed[selectedResident.id] ? 'is-followed' : ''}`}
                type="button"
                aria-pressed={Boolean(followed[selectedResident.id])}
                onClick={() => setFollowed((current) => ({ ...current, [selectedResident.id]: !current[selectedResident.id] }))}
              >
                {followed[selectedResident.id] ? '★ 已关注' : '☆ 关注'}
              </button>
            </div>
            <button className="resident-panel__close" type="button" onClick={() => setPanelOpen(false)} aria-label="关闭居民面板">×</button>
          </header>

          <div className="resident-world-links" aria-label="居民世界信息">
            <button className="resident-world-link" type="button" onClick={() => focusLocation(`${selectedDistrict} · 住处 ${selectedHousehold?.homeId ?? ''}`)}>
              <span>⌂ 住所</span>
              <b>{selectedDistrict}</b>
            </button>
            <button className="resident-world-link" type="button" disabled={!selectedResident.workplaceId} onClick={() => focusLocation(`${occupation?.name ?? '工作地'} · ${selectedResident.workplaceId}`)}>
              <span>⚒ 工作地</span>
              <b>{selectedResident.workplaceId ? occupation?.name ?? '营生' : '无固定工作'}</b>
            </button>
            <div className="resident-world-link resident-world-link--static" data-resident-family-summary>
              <span>♡ 家庭</span>
              <b>{selectedFamily}</b>
            </div>
          </div>

          {familyOpen && (
            <section className="resident-family-drawer">
              <div className="resident-family-drawer__heading"><b>同住家人</b><span>点名字可以继续查看</span></div>
              {householdMembers.map((member) => (
                <button key={member.id} type="button" onClick={() => selectResident(member.id)}>
                  <span>{relationLabel(selectedResident, member)}</span>
                  <b>{member.displayName}</b>
                  <small>{ageAtDay(member, gameDay, definitions.generation.daysPerYear)}岁 · {occupationFor(definitions, member.occupationId)?.name ?? '居民'}</small>
                </button>
              ))}
            </section>
          )}

          <div className="resident-panel__body resident-panel__body--v2">
            {historyExpanded ? (
              <section className="resident-history-drawer resident-history-mode" aria-label={`${selectedResident.displayName}的人生经历`}>
                <header className="resident-history-hero">
                  <span>人生经历</span>
                  <h2>{selectedResident.displayName}的一生</h2>
                  <p>{selectedAge}岁 · 已记录 {lifeCount} 段值得回看的往事</p>
                </header>

                {chronologicalHistory.length > 0 ? (
                  <div className="resident-life-timeline resident-life-timeline--continuous">
                    <div className="resident-life-stage__chapters resident-life-timeline__chapters">
                      {chronologicalHistory.map((entry) => {
                        const chapterEvent = entry.sourceEventId
                          ? definitions.lifeEvents.find((event) => event.id === entry.sourceEventId)
                          : undefined;
                        const chapterOpen = expandedChapterId === entry.id;
                        const entryAge = ageAtDay(selectedResident, entry.day, definitions.generation.daysPerYear);
                        const memoryText = chapterEvent
                          ? (chapterEvent as typeof chapterEvent & { memoryText?: string }).memoryText
                          : undefined;
                        return (
                          <article className={`resident-life-chapter ${memoryText ? 'has-story' : 'is-fact'} ${chapterOpen ? 'is-open' : ''}`} key={entry.id} data-age={entryAge}>
                            <i className="resident-life-chapter__dot" aria-hidden="true" />
                            {memoryText ? (
                              <button type="button" className="resident-life-chapter__row" onClick={() => setExpandedChapterId((current) => current === entry.id ? null : entry.id)}>
                                <time>{entryAge}岁</time>
                                <span>{entry.title}</span>
                                <small>{chapterOpen ? '收起' : '展开'}</small>
                              </button>
                            ) : (
                              <div className="resident-life-chapter__row resident-life-chapter__row--fact">
                                <time>{entryAge}岁</time>
                                <span>{entry.title}</span>
                              </div>
                            )}

                            {chapterOpen && memoryText && (
                              <div className="resident-life-memory">
                                <p>{memoryText}</p>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>

                    <div className="resident-life-now">
                      <i aria-hidden="true" />
                      <div><time>{selectedAge}岁</time><b>如今</b><span>故事仍在继续。</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="resident-history-empty">
                    <b>还没有需要长期记住的往事</b>
                    <p>普通日常不会被强行写进人生经历。</p>
                  </div>
                )}
              </section>
            ) : (
              <>
                <section className="resident-activity">
                  <div className="resident-section-label">此刻</div>
                  <div className="resident-activity__current">
                    <i aria-hidden="true" />
                    <p>{lifeView.currentActionText}</p>
                  </div>
                </section>

                <section className="resident-recent-feed">
                  <div className="resident-recent-feed__heading"><b>最近</b></div>
                  <ul className="resident-recent-feed__list">
                    {lifeView.recentEntries.map((entry) => (
                      <li key={entry.id} data-recent-kind={entry.kind}>
                        <time>{relativeDayLabel(Math.max(0, gameDay - entry.day))}</time>
                        <p className="resident-recent-feed__text">{entry.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>

          <footer className="resident-panel__footer resident-panel__footer--v2">
            <button
              type="button"
              className={`resident-relation-button ${familyOpen ? 'is-active' : ''}`}
              disabled={!householdMembers.length}
              onClick={toggleFamily}
            >
              <span>♡ 人物关系</span>
              <small>{householdMembers.length > 0 ? `${householdMembers.length} 位` : '暂无'}</small>
            </button>
            <button type="button" className={historyExpanded ? 'is-active' : ''} onClick={historyExpanded ? closeHistory : openHistory}>
              <span>{historyExpanded ? '返回生活' : `人生经历 ${lifeCount}章`}</span><b>{historyExpanded ? '‹' : '›'}</b>
            </button>
          </footer>
        </aside>
      )}

      {locationNotice && <button type="button" className="resident-location-toast" onClick={() => setLocationNotice('')}>{locationNotice}<span>×</span></button>}

      <nav className="sim-command-dock" aria-label="模拟游戏主工具栏">
        {['道路', '桥梁', '建筑', '城墙', '装饰'].map((label, index) => (
          <button key={label} type="button" className={index === 2 ? 'is-active' : ''}><i />{label}</button>
        ))}
      </nav>

      <div className="sim-world-tools" aria-hidden="true"><span>↶</span><span>↷</span><span>网格</span></div>

      {showDev && (
        <aside className="dev-panel">
          <header><b>RESIDENT PANEL / CONTENT FIXTURE</b><button type="button" onClick={() => setShowDev(false)}>隐藏</button></header>
          <div className="dev-panel__row"><span>居民</span><b>{selectedResident.displayName} · {selectedIndex + 1}/{residents.length}</b></div>
          <div className="dev-panel__row"><span>近期事件</span><b>{selectedResident.recentLifeEvents.length} 条</b></div>
          <div className="dev-panel__row"><span>可用事件</span><b>{eligibleEventCount} 条</b></div>
          <div className="dev-panel__row"><span>人生记录</span><b>{lifeCount} 章</b></div>
          <div className="dev-panel__row"><span>经历标记</span><b>{lifeTagLabels.length ? lifeTagLabels.join(' · ') : '暂无'}</b></div>
          <div className="dev-panel__row"><span>面板模式</span><b>{historyExpanded ? '人生经历' : '当前生活'}</b></div>
          <div className="dev-panel__row"><span>家庭</span><b>Household {selectedResident.householdId} · {householdMembers.length} 位家人</b></div>
          <div className="dev-buttons dev-buttons--two">
            <button type="button" onClick={() => selectRelativeResident(-1)}>上一居民</button>
            <button type="button" onClick={() => selectRelativeResident(1)}>下一居民</button>
          </div>
          <div className="dev-buttons dev-buttons--two">
            <button type="button" onClick={() => setGameDay((day) => day + 1)}>+1 天</button>
            <button type="button" onClick={() => setGameDay((day) => day + 10)}>+10 天</button>
          </div>
          <div className="dev-buttons dev-buttons--two">
            <button type="button" onClick={toggleFamily}>展开家人</button>
          </div>
          <p>固定 Fixture 只用于内容与界面预览；正式事件触发、行为和结构变化由 Unity 主工程负责。</p>
        </aside>
      )}

      {!showDev && <button className="dev-reopen" type="button" onClick={() => setShowDev(true)}>DEV</button>}
    </main>
  );
}
