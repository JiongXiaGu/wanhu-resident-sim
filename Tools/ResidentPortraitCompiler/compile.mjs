import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const generatedDir=join(root,'Web','public','generated');

async function readJson(path) {
  return JSON.parse(await readFile(path,'utf8'));
}

const snapshot=await readJson(join(generatedDir,'resident-snapshot.json'));
const portraitCatalog=await readJson(join(root,'Content','Portrait','portrait-catalog.json'));

if(snapshot.schema!=='wanhu.resident-snapshot.v2') {
  throw new Error(`ResidentPortraitCompiler expected wanhu.resident-snapshot.v2, got ${snapshot.schema}`);
}
if(portraitCatalog.schema!=='wanhu.portrait-catalog.v2') {
  throw new Error(`Unsupported portrait catalog schema: ${portraitCatalog.schema}`);
}

function hash32(value) {
  const text=String(value);
  let hash=2166136261;
  for(let i=0;i<text.length;i+=1) {
    hash^=text.charCodeAt(i);
    hash=Math.imul(hash,16777619);
  }
  return hash>>>0;
}

function portraitFrameId(gender,lifeStage) {
  const ageBand=(lifeStage==='child'||lifeStage==='teen')?'child':lifeStage==='elder'?'elder':'adult';
  return `${gender}.${ageBand}`;
}

function weightedPick(seed,salt,items) {
  if(!items.length) throw new Error(`No portrait candidates for ${salt}.`);
  const total=items.reduce((sum,item)=>sum+Math.max(0,Number(item.weight??1)),0);
  let cursor=(hash32(`${seed}:portrait:${salt}`)/4294967296)*total;
  for(const item of items) {
    cursor-=Math.max(0,Number(item.weight??1));
    if(cursor<=0) return item;
  }
  return items.at(-1);
}

function assignHouseholdWealth(household) {
  const wealthRoll=hash32(`${snapshot.citySeed}:household:${household.id}:wealth`)%100;
  household.wealthTier=wealthRoll<20?'poor':wealthRoll<65?'plain':wealthRoll<92?'comfortable':'wealthy';
}

for(const household of snapshot.households) assignHouseholdWealth(household);
const householdById=new Map(snapshot.households.map((item)=>[item.id,item]));

for(const resident of snapshot.residents) {
  const household=householdById.get(resident.householdId);
  if(!household) throw new Error(`${resident.id}: missing household ${resident.householdId}.`);

  const frameId=portraitFrameId(resident.gender,resident.lifeStage);
  const face=weightedPick(
    resident.seed,'face-family',
    portraitCatalog.faceFamilies.filter((item)=>item.genders.includes(resident.gender)),
  );
  const hair=weightedPick(
    resident.seed,`hair:${frameId}`,
    portraitCatalog.hairStyles.filter((item)=>item.genders.includes(resident.gender)&&item.frameIds.includes(frameId)),
  );
  const frameOutfits=portraitCatalog.outfitStyles.filter((item)=>item.frameIds.includes(frameId));
  const initialOutfits=frameOutfits.filter((item)=>item.initialWealthTiers.includes(household.wealthTier));
  const outfit=weightedPick(
    resident.seed,`outfit:${frameId}:${household.wealthTier}`,
    initialOutfits.length?initialOutfits:frameOutfits,
  );

  resident.portrait={
    faceFamilyId:face.id,
    hairStyleId:hair.id,
    outfitStyleId:outfit.id,
    skinPaletteId:weightedPick(resident.seed,'skin',portraitCatalog.skinPalettes).id,
    baseHairColorId:weightedPick(resident.seed,'hair-color',portraitCatalog.hairPalettes).id,
  };
}

snapshot.schema='wanhu.resident-snapshot.v5';
await writeFile(join(generatedDir,'resident-snapshot.json'),`${JSON.stringify(snapshot,null,2)}\n`,'utf8');

const faceCounts=Object.fromEntries(portraitCatalog.faceFamilies.map((item)=>[
  item.id,
  snapshot.residents.filter((resident)=>resident.portrait.faceFamilyId===item.id).length,
]));
console.log(`Compiled simple ResidentPortraitDNA for ${snapshot.residents.length} residents. ${JSON.stringify(faceCounts)}`);
