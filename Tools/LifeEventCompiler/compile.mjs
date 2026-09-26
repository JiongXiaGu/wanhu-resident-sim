import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root=process.cwd();
const source=JSON.parse(await readFile(join(root,'Content','LifeEvents','life-events.json'),'utf8'));
if(source.schema!=='wanhu.life-events.v3')throw new Error(`Unsupported LifeEvent schema: ${source.schema}`);
if(!Array.isArray(source.items)||!source.items.length)throw new Error('LifeEvent V3 requires at least one event.');
const ids=new Set();
for(const event of source.items){
 if(!event.id||ids.has(event.id))throw new Error(`Duplicate or missing LifeEvent id: ${event.id??'(missing)'}`); ids.add(event.id);
 if(typeof event.title!=='string'||!event.title.trim())throw new Error(`${event.id}: title is required.`);
 if(typeof event.recentText!=='string'||!event.recentText.trim())throw new Error(`${event.id}: recentText is required.`);
 const recentTextLength=[...event.recentText.trim()].length;
 if(recentTextLength<12||recentTextLength>36)throw new Error(`${event.id}: recentText must be 12-36 characters, got ${recentTextLength}.`);
 if('text' in event)throw new Error(`${event.id}: legacy text field is not allowed.`);
 if('stages' in event||'delayDays' in event)throw new Error(`${event.id}: Stage fields are not part of LifeEvent V3.`);
 if(event.recordToHistory!==undefined&&typeof event.recordToHistory!=='boolean')throw new Error(`${event.id}: recordToHistory must be boolean.`);
 if(event.recordToHistory&&(typeof event.memoryText!=='string'||!event.memoryText.trim()))throw new Error(`${event.id}: recordable Story Chapter requires memoryText.`);
 if(event.memoryText!==undefined&&!event.recordToHistory)throw new Error(`${event.id}: memoryText requires recordToHistory=true.`);
}
const definitionsPath=join(root,'Web','public','generated','definitions.json');
const definitions=JSON.parse(await readFile(definitionsPath,'utf8'));
const nameCatalog=JSON.parse(await readFile(join(root,'Web','public','generated','name-catalog-v2.json'),'utf8'));
const lifeTags=JSON.parse(await readFile(join(root,'Web','public','generated','life-tags.json'),'utf8'));
definitions.schema='wanhu.resident-definitions.v3'; definitions.nameCatalog=nameCatalog; definitions.lifeTags=lifeTags.items; definitions.lifeEvents=source.items;
await writeFile(definitionsPath,JSON.stringify(definitions,null,2)+'\n','utf8');
console.log(`Compiled ${source.items.length} discrete LifeEvent V3 definitions and ${lifeTags.items.length} LifeTags.`);
