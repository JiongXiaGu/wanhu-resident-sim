import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const sourcePath = join(root, 'Content', 'LifeEvents', 'life-events.json');
const definitionsPath = join(root, 'Web', 'public', 'generated', 'definitions.json');

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
if (source.schema !== 'wanhu.life-events.v2') {
  throw new Error(`Unsupported LifeEvent schema: ${source.schema}`);
}
if (!Array.isArray(source.items) || source.items.length === 0) {
  throw new Error('LifeEvent V2 requires at least one event.');
}

const ids = new Set();
for (const event of source.items) {
  if (!event.id || ids.has(event.id)) throw new Error(`Duplicate or missing LifeEvent id: ${event.id ?? '(missing)'}`);
  ids.add(event.id);
  if (event.recordToHistory !== undefined && typeof event.recordToHistory !== 'boolean') {
    throw new Error(`${event.id}: recordToHistory must be a boolean.`);
  }
  if (!Array.isArray(event.stages) || event.stages.length !== 3) {
    throw new Error(`${event.id}: LifeEvent V2 must have exactly 3 stages.`);
  }
  event.stages.forEach((stage, index) => {
    if (!stage.title || !stage.text) {
      throw new Error(`${event.id}: stage ${index + 1} is missing title/text.`);
    }
    const min = Number(stage.delayDays?.min ?? -1);
    const max = Number(stage.delayDays?.max ?? -1);
    if (min < 0 || max < min) throw new Error(`${event.id}: invalid delayDays at stage ${index + 1}.`);
  });
}

const definitions = JSON.parse(await readFile(definitionsPath, 'utf8'));
definitions.schema = 'wanhu.resident-definitions.v2';
definitions.lifeEvents = source.items;
await writeFile(definitionsPath, `${JSON.stringify(definitions, null, 2)}\n`, 'utf8');
console.log(`Compiled ${source.items.length} LifeEvent V2 definitions.`);
