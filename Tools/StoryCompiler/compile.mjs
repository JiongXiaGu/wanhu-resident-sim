import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const root = process.cwd();
const sourceRoots = [
  path.join(root, 'Content', 'Stories'),
  path.join(root, '居民故事'),
];
const outputPath = path.join(root, 'Web', 'public', 'generated', 'stories.json');

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(dir) {
  if (!(await pathExists(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...await collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md') && entry.name !== 'README.md') {
      result.push(fullPath);
    }
  }

  return result;
}

function normalizeNewlines(text) {
  return text.replace(/\r\n?/g, '\n');
}

function readFrontMatter(source) {
  const normalized = normalizeNewlines(source);
  if (!normalized.startsWith('---\n')) {
    return { data: {}, body: normalized };
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) return { data: {}, body: normalized };

  const rawYaml = normalized.slice(4, end);
  const body = normalized.slice(end + 5);

  try {
    return { data: YAML.parse(rawYaml) ?? {}, body };
  } catch (error) {
    throw new Error(`Front Matter YAML 解析失败: ${error.message}`);
  }
}

function cleanText(lines) {
  const filtered = lines
    .filter((line) => !/^---\s*$/.test(line.trim()))
    .filter((line) => !/^<!--.*-->\s*$/.test(line.trim()));

  const paragraphs = [];
  let current = [];

  const flush = () => {
    if (current.length > 0) {
      paragraphs.push(current.join('\n').trim());
      current = [];
    }
  };

  for (const line of filtered) {
    if (!line.trim()) {
      flush();
    } else {
      current.push(line.trim());
    }
  }
  flush();

  return paragraphs.filter(Boolean).join('\n\n');
}

function extractTime(lines) {
  const index = lines.findIndex((line) => /^\*\*节点时间[：:]\s*.+\*\*$/.test(line.trim()));
  if (index < 0) {
    return { raw: '', relativeTo: 'unknown', minDays: null, maxDays: null, lineIndex: -1 };
  }

  const raw = lines[index]
    .trim()
    .replace(/^\*\*节点时间[：:]\s*/, '')
    .replace(/\*\*$/, '')
    .trim();

  return { ...parseTime(raw), lineIndex: index };
}

function parseTime(raw) {
  const relativeTo = raw.includes('第二阶段后') || raw.includes('上一阶段后')
    ? 'previous-node'
    : 'story-start';

  if (/^D0(?:\D|$)/i.test(raw)) {
    return { raw, relativeTo: 'story-start', minDays: 0, maxDays: 0 };
  }

  const range = raw.match(/D\+(\d+)\s*[～~-]\s*(\d+)/i);
  if (range) {
    return {
      raw,
      relativeTo,
      minDays: Number(range[1]),
      maxDays: Number(range[2]),
    };
  }

  const single = raw.match(/D\+(\d+)/i);
  if (single) {
    const days = Number(single[1]);
    return { raw, relativeTo, minDays: days, maxDays: days };
  }

  return { raw, relativeTo: 'unknown', minDays: null, maxDays: null };
}

function extractNode(lines, headingPattern, id) {
  const headingIndex = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (headingIndex < 0) return null;

  const heading = lines[headingIndex].trim();
  const title = heading.replace(/^#{2,3}\s*[^｜|]*[｜|]\s*/, '').trim();
  const bodyLines = lines.slice(headingIndex + 1);
  const time = extractTime(bodyLines);
  const textLines = time.lineIndex >= 0
    ? bodyLines.slice(time.lineIndex + 1)
    : bodyLines;

  return {
    id,
    title,
    text: cleanText(textLines),
    time: {
      raw: time.raw,
      relativeTo: time.relativeTo,
      minDays: time.minDays,
      maxDays: time.maxDays,
    },
  };
}

function splitBranchBlocks(lines) {
  const starts = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+分支[^｜|]*[｜|]/.test(lines[i].trim())) starts.push(i);
  }

  return starts.map((start, index) => {
    const end = starts[index + 1] ?? lines.length;
    return lines.slice(start, end);
  });
}

function parseBranch(block, index) {
  const branchHeading = block[0]?.trim() ?? '';
  const title = branchHeading.replace(/^##\s+分支[^｜|]*[｜|]\s*/, '').trim();
  const explicitId = block
    .map((line) => line.match(/<!--\s*branch-id\s*:\s*([^\s]+)\s*-->/i))
    .find(Boolean)?.[1];
  const id = explicitId || `b${String(index + 1).padStart(2, '0')}`;

  const stage2Start = block.findIndex((line) => /^###\s+第二阶段[｜|]/.test(line.trim()));
  const stage3Start = block.findIndex((line) => /^###\s+第三阶段[｜|]/.test(line.trim()));

  if (stage2Start < 0 || stage3Start < 0 || stage3Start <= stage2Start) {
    throw new Error(`分支“${title || id}”缺少有效的第二/第三阶段`);
  }

  const stage2Lines = block.slice(stage2Start, stage3Start);
  const stage3Lines = block.slice(stage3Start);

  return {
    id,
    title,
    weight: 1,
    stage2: extractNode(stage2Lines, /^###\s+第二阶段[｜|]/, `${id}.stage2`),
    stage3: extractNode(stage3Lines, /^###\s+第三阶段[｜|]/, `${id}.stage3`),
  };
}

function parseCategories(lines, frontMatter) {
  if (Array.isArray(frontMatter.categories)) {
    return frontMatter.categories.map(String);
  }

  const typeLine = lines.find((line) => /^##\s+类型[｜|]/.test(line.trim()));
  if (!typeLine) return [];

  return typeLine
    .replace(/^##\s+类型[｜|]\s*/, '')
    .split(/[\/／|｜]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function fallbackId(relativePath) {
  const hash = crypto.createHash('sha1').update(relativePath).digest('hex').slice(0, 10);
  return `legacy-${hash}`;
}

function parseStory(source, relativePath) {
  const { data, body } = readFrontMatter(source);
  const lines = normalizeNewlines(body).split('\n');

  const h1 = lines.find((line) => /^#\s+/.test(line.trim()));
  if (!h1) throw new Error('缺少一级故事标题');
  const title = h1.trim().replace(/^#\s+/, '').trim();

  const startIndex = lines.findIndex((line) => /^##\s+第一阶段[｜|]/.test(line.trim()));
  if (startIndex < 0) throw new Error('缺少第一阶段');

  const branchBlocks = splitBranchBlocks(lines);
  if (branchBlocks.length === 0) throw new Error('没有找到任何分支');

  const firstBranchIndex = lines.findIndex((line) => /^##\s+分支[^｜|]*[｜|]/.test(line.trim()));
  const startLines = lines.slice(startIndex, firstBranchIndex);
  const start = extractNode(startLines, /^##\s+第一阶段[｜|]/, 'start');

  const story = {
    schema: 'wanhu.story.v1',
    id: typeof data.id === 'string' && data.id.trim() ? data.id.trim() : fallbackId(relativePath),
    title,
    source: relativePath.replaceAll('\\', '/'),
    categories: parseCategories(lines, data),
    importance: data.importance ?? 'normal',
    perspective: data.perspective ?? 'resident',
    eligibility: data.eligibility ?? { required: [], forbidden: [] },
    branchMode: data.branchMode ?? 'random-one',
    start,
    branches: branchBlocks.map(parseBranch),
  };

  return story;
}

function countContentCharacters(text) {
  return text.replace(/\s/g, '').length;
}

function validateStory(story) {
  const warnings = [];

  if (story.branches.length < 3 || story.branches.length > 5) {
    warnings.push(`分支数量为 ${story.branches.length}，建议 3～5 个`);
  }

  const branchIds = new Set();
  for (const branch of story.branches) {
    if (branchIds.has(branch.id)) warnings.push(`重复 Branch ID: ${branch.id}`);
    branchIds.add(branch.id);
  }

  const startLength = countContentCharacters(story.start.text);
  if (startLength < 40 || startLength > 70) {
    warnings.push(`第一阶段约 ${startLength} 字，建议 40～70 字`);
  }

  for (const branch of story.branches) {
    for (const [label, node] of [['第二阶段', branch.stage2], ['第三阶段', branch.stage3]]) {
      const length = countContentCharacters(node.text);
      if (length < 40 || length > 80) {
        warnings.push(`${branch.id} ${label}约 ${length} 字，建议 40～80 字`);
      }
      if (!node.time.raw) warnings.push(`${branch.id} ${label}缺少节点时间`);
    }
  }

  if (/(最终版|修正版|重新审查版|定稿|精简版)/.test(story.source)) {
    warnings.push('文件名含过程性版本后缀，后续迁移时建议去除');
  }

  return warnings;
}

async function main() {
  const files = (await Promise.all(sourceRoots.map(collectMarkdownFiles)))
    .flat()
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));

  const stories = [];
  const skipped = [];
  const warningLog = [];
  const ids = new Set();

  for (const file of files) {
    const relativePath = path.relative(root, file);
    try {
      const source = await fs.readFile(file, 'utf8');
      const story = parseStory(source, relativePath);

      if (ids.has(story.id)) {
        throw new Error(`Story ID 重复: ${story.id}`);
      }
      ids.add(story.id);

      const warnings = validateStory(story);
      if (warnings.length) warningLog.push({ source: relativePath, warnings });
      stories.push(story);
    } catch (error) {
      skipped.push({ source: relativePath, error: error.message });
    }
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify({
    schema: 'wanhu.story.collection.v1',
    generatedAt: new Date().toISOString(),
    count: stories.length,
    stories,
    diagnostics: {
      warningCount: warningLog.reduce((sum, item) => sum + item.warnings.length, 0),
      skippedCount: skipped.length,
      warnings: warningLog,
      skipped,
    },
  }, null, 2));

  console.log(`StoryCompiler: ${stories.length} stories compiled.`);
  if (warningLog.length) {
    console.log(`StoryCompiler: ${warningLog.length} files have warnings.`);
  }
  if (skipped.length) {
    console.warn(`StoryCompiler: ${skipped.length} files skipped.`);
    for (const item of skipped) console.warn(`- ${item.source}: ${item.error}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
