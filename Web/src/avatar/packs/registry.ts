import {catalogFrames,catalogOption,optionSupportsFrame,parts,type Part} from './catalog';
import {chibiCutePack} from './chibi';
import {lineworkPack} from './linework';
import {simpleFlatPack} from './simple-flat';
import type {AvatarPack,PackLifecycle} from './types';

const packs=[lineworkPack,chibiCutePack,simpleFlatPack] as const;

export type PackId=typeof packs[number]['id'];

function validatePack(pack:AvatarPack):void{
  for(const part of parts){
    const options=pack.catalog[part];
    if(options.length===0)throw new Error(`Avatar pack ${pack.id} has no ${part} options.`);
    const ids=options.map(option=>option.id);
    if(new Set(ids).size!==ids.length)throw new Error(`Avatar pack ${pack.id} has duplicate ${part} IDs.`);
    if(!ids.includes(pack.defaults[part]))throw new Error(`Avatar pack ${pack.id} default ${part} is not in its catalog.`);

    for(const option of options){
      if(!option.frames)continue;
      if(option.frames.length===0)throw new Error(`Avatar pack ${pack.id} ${part}/${option.id} has an empty frame scope.`);
      if(new Set(option.frames).size!==option.frames.length)throw new Error(`Avatar pack ${pack.id} ${part}/${option.id} repeats frame scopes.`);
      if(option.frames.some(frame=>!catalogFrames.includes(frame)))throw new Error(`Avatar pack ${pack.id} ${part}/${option.id} references an unknown frame.`);
    }

    for(const frame of catalogFrames){
      if(!options.some(option=>optionSupportsFrame(option,frame)))throw new Error(`Avatar pack ${pack.id} has no ${part} option for ${frame}.`);
    }
  }
}
for(const pack of packs)validatePack(pack);

export const avatarPacks=Object.fromEntries(packs.map(pack=>[pack.id,pack])) as Record<PackId,AvatarPack>;

export const packCatalog=packs.map(pack=>({
  id:pack.id,
  label:pack.title,
  note:pack.note,
  lifecycle:pack.lifecycle,
  viewBox:pack.viewBox,
  counts:Object.fromEntries(parts.map(part=>[part,pack.catalog[part].length])) as Record<Part,number>,
})) as ReadonlyArray<{id:PackId;label:string;note:string;lifecycle:PackLifecycle;viewBox:'0 0 320 320';counts:Record<Part,number>}>;

export const packOptions=packCatalog.filter(pack=>pack.lifecycle!=='legacy');

const active=packCatalog.find(pack=>pack.lifecycle==='active');
if(!active)throw new Error('Avatar registry requires at least one active pack.');
export const activePackId:PackId=active.id;

const legacyPackAliases:Readonly<Record<string,PackId>>={
  'soft-paint-v1':'chibi-cute-v1',
};

export function normalizePackId(value:unknown):unknown{
  if(typeof value!=='string')return value;
  return legacyPackAliases[value]??value;
}

export const isPackId=(value:unknown):value is PackId=>typeof value==='string'&&Object.prototype.hasOwnProperty.call(avatarPacks,value);
export const packLabel=(id:PackId):string=>avatarPacks[id].title;
export const getPack=(id:PackId):AvatarPack=>avatarPacks[id];

export function mapChoiceToPack(sourceId:PackId,targetId:PackId,part:Part,id:string):string{
  const source=getPack(sourceId),target=getPack(targetId);
  if(target.catalog[part].some(option=>option.id===id))return id;

  const sourceOption=catalogOption(source.catalog,part,id);
  const compatibilityKey=sourceOption?.compatibilityKey??id;

  const direct=target.catalog[part].find(option=>option.id===compatibilityKey);
  if(direct)return direct.id;

  const compatible=target.catalog[part].filter(option=>(option.compatibilityKey??option.id)===compatibilityKey);
  if(compatible.length===1)return compatible[0].id;

  return target.defaults[part];
}

export function mapChoicesToPack(sourceId:PackId,targetId:PackId,choices:Record<Part,string>):Record<Part,string>{
  return Object.fromEntries(parts.map(part=>[part,mapChoiceToPack(sourceId,targetId,part,choices[part])])) as Record<Part,string>;
}
