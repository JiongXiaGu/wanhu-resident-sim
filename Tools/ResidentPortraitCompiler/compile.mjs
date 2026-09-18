import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root=process.cwd();
const generatedDir=join(root,'Web','public','generated');

async function readJson(path) {
  return JSON.parse(await readFile(path,'utf8'));
}

const snapshot=await readJson(join(generatedDir,'resident-snapshot.json'));
const definitions=await readJson(join(generatedDir,'definitions.json'));
const portraitCatalog=await readJson(join(root,'Content','Portrait','portrait-catalog.json'));

if(snapshot.schema!=='wanhu.resident-snapshot.v2') {
  throw new Error(`ResidentPortraitCompiler expected wanhu.resident-snapshot.v2, got ${snapshot.schema}`);
}
if(definitions.schema!=='wanhu.resident-definitions.v3') {
  throw new Error(`ResidentPortraitCompiler expected wanhu.resident-definitions.v3, got ${definitions.schema}`);
}
if(portraitCatalog.schema!=='wanhu.portrait-catalog.v1') {
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

function assignHouseholdProfile(household) {
  const wealthRoll=hash32(`${snapshot.citySeed}:household:${household.id}:wealth`)%100;
  const wealthTier=wealthRoll<20?'poor':wealthRoll<65?'plain':wealthRoll<92?'comfortable':'wealthy';
  const styleRoll=hash32(`${snapshot.citySeed}:household:${household.id}:presentation`)%100;
  let presentationStyle;
  if(wealthTier==='poor') presentationStyle=styleRoll<72?'practical':'tidy';
  else if(wealthTier==='plain') presentationStyle=styleRoll<42?'practical':styleRoll<90?'tidy':'refined';
  else if(wealthTier==='comfortable') presentationStyle=styleRoll<20?'practical':styleRoll<76?'tidy':'refined';
  else presentationStyle=styleRoll<42?'tidy':'refined';
  household.wealthTier=wealthTier;
  household.presentationStyle=presentationStyle;
}

for(const household of snapshot.households) assignHouseholdProfile(household);
const householdById=new Map(snapshot.households.map((item)=>[item.id,item]));

for(const resident of snapshot.residents) {
  const household=householdById.get(resident.householdId);
  if(!household) throw new Error(`${resident.id}: missing household ${resident.householdId}.`);

  const face=weightedPick(
    resident.seed,'face-family',
    portraitCatalog.faceFamilies.filter((item)=>item.genders.includes(resident.gender)),
  );
  const hair=weightedPick(
    resident.seed,`hair:${resident.lifeStage}`,
    portraitCatalog.hairStyles.filter((item)=>item.genders.includes(resident.gender)&&item.lifeStages.includes(resident.lifeStage)),
  );
  const outfit=weightedPick(
    resident.seed,`outfit:${household.wealthTier}`,
    portraitCatalog.outfitStyles.filter((item)=>item.wealthTiers.includes(household.wealthTier)),
  );

  resident.portrait={
    faceFamilyId:face.id,
    hairStyleId:hair.id,
    outfitStyleId:outfit.id,
    skinPaletteId:weightedPick(resident.seed,'skin',portraitCatalog.skinPalettes).id,
    baseHairColorId:weightedPick(resident.seed,'hair-color',portraitCatalog.hairPalettes).id,
  };
  delete resident.portraitSeed;
  delete resident.appearance;
}

snapshot.schema='wanhu.resident-snapshot.v4';
await writeFile(join(generatedDir,'resident-snapshot.json'),`${JSON.stringify(snapshot,null,2)}\n`,'utf8');

const faceCounts=Object.fromEntries(portraitCatalog.faceFamilies.map((item)=>[
  item.id,
  snapshot.residents.filter((resident)=>resident.portrait.faceFamilyId===item.id).length,
]));
console.log(`Compiled simple ResidentPortraitDNA for ${snapshot.residents.length} residents. ${JSON.stringify(faceCounts)}`);
