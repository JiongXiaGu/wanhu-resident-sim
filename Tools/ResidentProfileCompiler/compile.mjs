import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const root=process.cwd(),generated=join(root,'Web','public','generated');
const read=async name=>JSON.parse(await readFile(join(generated,name),'utf8'));
const snapshot=await read('resident-snapshot.json');
const definitions=await read('definitions.json');
const catalog=await read('resident-profile-catalog.json');

if(snapshot.schema!=='wanhu.resident-snapshot.v5')throw new Error(`ResidentProfileCompiler expected snapshot v5, got ${snapshot.schema}`);
if(definitions.schema!=='wanhu.resident-definitions.v3')throw new Error(`ResidentProfileCompiler expected definitions v3, got ${definitions.schema}`);
if(catalog.schema!=='wanhu.resident-profile-catalog.v1')throw new Error(`Unsupported profile catalog ${catalog.schema}`);

function hash32(value){const text=String(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function unit(seed,salt){return hash32(`${seed}:resident-profile.v1:${salt}`)/4294967296;}
function weightedPick(seed,salt,items,weightOf){
 if(!items.length)throw new Error('Resident profile candidate list is empty.');
 const weights=items.map(item=>Math.max(0,Number(weightOf(item)??0))),total=weights.reduce((a,b)=>a+b,0);
 if(total<=0)return items[0];
 let cursor=unit(seed,salt)*total;
 for(let i=0;i<items.length;i++){cursor-=weights[i];if(cursor<=0)return items[i];}
 return items.at(-1);
}
const occupationById=new Map(definitions.occupations.map(item=>[item.id,item]));
const householdById=new Map(snapshot.households.map(item=>[item.id,item]));
const counts={temperament:{},focus:{},presentation:{}};

for(const resident of snapshot.residents){
 const occupation=occupationById.get(resident.occupationId);
 const household=householdById.get(resident.householdId);
 if(!occupation)throw new Error(`${resident.id}: missing occupation ${resident.occupationId}`);
 if(!household)throw new Error(`${resident.id}: missing household ${resident.householdId}`);
 const group=occupation.groupId,wealth=household.wealthTier??'plain';
 const temperament=weightedPick(resident.seed,'temperament',catalog.temperaments,item=>item.weight);
 const focus=weightedPick(resident.seed,'focus',catalog.lifeFocuses,item=>Number(item.weight??1)*Number(item.occupationGroupWeights?.[group]??1));
 const presentation=weightedPick(resident.seed,'presentation',catalog.presentationStyles,item=>Number(item.weight??1)*Number(item.occupationGroupWeights?.[group]??1)*Number(item.wealthWeights?.[wealth]??1));
 resident.profile={temperamentId:temperament.id,lifeFocusId:focus.id,presentationStyleId:presentation.id};
 counts.temperament[temperament.id]=(counts.temperament[temperament.id]??0)+1;
 counts.focus[focus.id]=(counts.focus[focus.id]??0)+1;
 counts.presentation[presentation.id]=(counts.presentation[presentation.id]??0)+1;
}
snapshot.schema='wanhu.resident-snapshot.v6';
await writeFile(join(generated,'resident-snapshot.json'),JSON.stringify(snapshot,null,2)+'\n','utf8');
console.log(`Compiled Resident Profile V1 for ${snapshot.residents.length} residents. ${JSON.stringify(counts)}`);
