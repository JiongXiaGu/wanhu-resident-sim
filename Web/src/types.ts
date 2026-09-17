export type StoryTime = {
  raw: string;
  relativeTo: 'story-start' | 'previous-node' | 'unknown';
  minDays: number | null;
  maxDays: number | null;
};

export type StoryNode = {
  id: string;
  title: string;
  text: string;
  time: StoryTime;
};

export type StoryBranch = {
  id: string;
  title: string;
  weight: number;
  stage2: StoryNode;
  stage3: StoryNode;
};

export type Story = {
  schema: 'wanhu.story.v1';
  id: string;
  title: string;
  source: string;
  categories: string[];
  importance: string;
  perspective: string;
  eligibility: {
    required?: string[];
    forbidden?: string[];
    [key: string]: unknown;
  };
  branchMode: string;
  start: StoryNode;
  branches: StoryBranch[];
};

export type StoryCollection = {
  schema: 'wanhu.story.collection.v1';
  generatedAt: string;
  count: number;
  stories: Story[];
  diagnostics: {
    warningCount: number;
    skippedCount: number;
    warnings: Array<{ source: string; warnings: string[] }>;
    skipped: Array<{ source: string; error: string }>;
  };
};
