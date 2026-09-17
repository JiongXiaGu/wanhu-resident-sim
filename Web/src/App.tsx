import { useEffect, useMemo, useState } from 'react';
import type { Story, StoryBranch, StoryCollection, StoryNode } from './types';

type StoryMode = 'sequential' | 'random';
type ViewMode = 'game' | 'review';
type StageIndex = 0 | 1 | 2;

function pickRandomIndex(length: number, except?: number) {
  if (length <= 1) return 0;

  let next = Math.floor(Math.random() * length);
  if (except !== undefined && next === except) {
    next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length;
  }
  return next;
}

function nodeFor(story: Story, branch: StoryBranch, stage: StageIndex): StoryNode {
  if (stage === 0) return story.start;
  if (stage === 1) return branch.stage2;
  return branch.stage3;
}

function stageLabel(stage: StageIndex) {
  if (stage === 0) return '第一阶段';
  if (stage === 1) return '第二阶段';
  return '第三阶段';
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function App() {
  const [collection, setCollection] = useState<StoryCollection | null>(null);
  const [loadError, setLoadError] = useState('');
  const [storyIndex, setStoryIndex] = useState(0);
  const [branchIndex, setBranchIndex] = useState(0);
  const [stage, setStage] = useState<StageIndex>(0);
  const [storyMode, setStoryMode] = useState<StoryMode>('sequential');
  const [viewMode, setViewMode] = useState<ViewMode>('game');

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
        if (data.stories.length > 0) {
          setBranchIndex(pickRandomIndex(data.stories[0].branches.length));
        }
      })
      .catch((error: Error) => {
        if (!cancelled) setLoadError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stories = collection?.stories ?? [];
  const story = stories[storyIndex];
  const branch = story?.branches[branchIndex] ?? story?.branches[0];
  const node = story && branch ? nodeFor(story, branch, stage) : null;

  const currentWarnings = useMemo(() => {
    if (!collection || !story) return [];
    return collection.diagnostics.warnings.find((item) => item.source === story.source)?.warnings ?? [];
  }, [collection, story]);

  function selectStory(index: number) {
    if (!stories.length) return;
    const normalized = (index + stories.length) % stories.length;
    const nextStory = stories[normalized];
    setStoryIndex(normalized);
    setBranchIndex(pickRandomIndex(nextStory.branches.length));
    setStage(0);
  }

  function nextStory() {
    if (!stories.length) return;

    if (storyMode === 'random') {
      selectStory(pickRandomIndex(stories.length, storyIndex));
      return;
    }

    selectStory(storyIndex + 1);
  }

  function previousStory() {
    selectStory(storyIndex - 1);
  }

  function nextNode() {
    if (stage === 0) {
      setStage(1);
      return;
    }

    if (stage === 1) {
      setStage(2);
      return;
    }

    nextStory();
  }

  function previousNode() {
    if (stage === 2) setStage(1);
    else if (stage === 1) setStage(0);
  }

  function rerollBranch() {
    if (!story || story.branches.length <= 1) return;
    setBranchIndex(pickRandomIndex(story.branches.length, branchIndex));
  }

  function chooseBranch(index: number) {
    setBranchIndex(index);
    if (stage === 0) setStage(1);
  }

  if (loadError) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU STORY REVIEWER</p>
          <h1>故事数据读取失败</h1>
          <p>{loadError}</p>
          <p className="muted">请先执行 npm run build-content，确认 generated/stories.json 已生成。</p>
        </section>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU STORY REVIEWER</p>
          <h1>正在读取居民故事…</h1>
        </section>
      </main>
    );
  }

  if (!story || !branch || !node) {
    return (
      <main className="app-shell center-state">
        <section className="state-card">
          <p className="eyebrow">WANHU STORY REVIEWER</p>
          <h1>没有可显示的故事</h1>
          <p className="muted">请检查 Content/Stories 或居民故事目录。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">万户天工 · RESIDENT SIM</p>
          <h1>居民故事审查器</h1>
        </div>

        <div className="toolbar">
          <div className="segmented" aria-label="故事切换方式">
            <button
              className={storyMode === 'sequential' ? 'active' : ''}
              onClick={() => setStoryMode('sequential')}
            >
              顺序
            </button>
            <button
              className={storyMode === 'random' ? 'active' : ''}
              onClick={() => setStoryMode('random')}
            >
              随机
            </button>
          </div>

          <div className="segmented" aria-label="查看模式">
            <button
              className={viewMode === 'game' ? 'active' : ''}
              onClick={() => setViewMode('game')}
            >
              游戏模式
            </button>
            <button
              className={viewMode === 'review' ? 'active' : ''}
              onClick={() => setViewMode('review')}
            >
              审查模式
            </button>
          </div>
        </div>
      </header>

      <section className="workspace">
        <article className="story-card">
          <div className="story-head">
            <div>
              <p className="story-position">故事 {storyIndex + 1} / {stories.length}</p>
              <h2>{story.title}</h2>
            </div>

            <div className="node-badges">
              <span>{stageLabel(stage)}</span>
              {node.time.raw && <span>{node.time.raw}</span>}
            </div>
          </div>

          {viewMode === 'review' && (
            <section className="review-panel">
              <div className="review-grid">
                <div>
                  <span className="review-label">Story ID</span>
                  <strong>{story.id}</strong>
                </div>
                <div>
                  <span className="review-label">Branch</span>
                  <strong>{stage === 0 ? '尚未进入分支' : branch.id}</strong>
                </div>
                <div>
                  <span className="review-label">来源</span>
                  <strong>{story.source}</strong>
                </div>
                <div>
                  <span className="review-label">分类</span>
                  <strong>{story.categories.length ? story.categories.join(' · ') : '未标注'}</strong>
                </div>
              </div>

              <div className="branch-tabs" aria-label="故事分支">
                {story.branches.map((item, index) => (
                  <button
                    key={item.id}
                    className={index === branchIndex ? 'active' : ''}
                    onClick={() => chooseBranch(index)}
                  >
                    <span>{item.id}</span>
                    {item.title}
                  </button>
                ))}
              </div>

              {currentWarnings.length > 0 && (
                <details className="warning-box">
                  <summary>本故事有 {currentWarnings.length} 条格式提醒</summary>
                  <ul>
                    {currentWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                  </ul>
                </details>
              )}
            </section>
          )}

          <div className="node-content">
            <p className="node-kicker">{stageLabel(stage)}</p>
            <h3>{node.title}</h3>
            <div className="story-text">
              {paragraphs(node.text).map((paragraph, index) => (
                <p key={`${node.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="node-actions">
            <button className="ghost-button" onClick={previousNode} disabled={stage === 0}>
              上一节点
            </button>
            <button className="primary-button" onClick={nextNode}>
              {stage === 2 ? '下一个故事' : '下一节点'}
            </button>
          </div>
        </article>

        <footer className="story-nav">
          <button onClick={previousStory}>← 上一个故事</button>
          <button onClick={rerollBranch} disabled={story.branches.length <= 1}>重抽分支</button>
          <button onClick={nextStory}>下一个故事 →</button>
        </footer>
      </section>

      <footer className="statusbar">
        <span>已读取 {collection.count} 个故事</span>
        <span>{collection.diagnostics.warningCount} 条格式提醒</span>
        {collection.diagnostics.skippedCount > 0 && (
          <span className="status-warning">{collection.diagnostics.skippedCount} 个文件未解析</span>
        )}
      </footer>
    </main>
  );
}
