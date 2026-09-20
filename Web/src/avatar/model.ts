import {catalogFrames,catalogLabel,catalogOption,catalogOptionsForFrame,hasCatalogOption,hasCatalogOptionForFrame,parts,type AvatarCatalog,type CatalogFrame,type CatalogOption,type Part} from './packs/catalog';
import {activePackId,getPack,isPackId,mapChoicesToPack,normalizePackId,packCatalog,packLabel,packOptions,type PackId} from './packs/registry';

export {activePackId,packCatalog,packLabel,packOptions,parts};
export type {PackId,Part};

// 头像工坊只保存四个外观选择；年龄 / 性别属于目标对象，不写进 Recipe。
export type Choices=Record<Part,string>;
export type Recipe={schema:'wanhu.avatar';version:1;pack:PackId}&Choices;
export type Frame=CatalogFrame;
export type Target={key:string;name:string;detail:string;frame:Frame;seed:number;kind:'player'|'resident';residentId?:number};

export const frames:Frame[]=[...catalogFrames];
export const labels:Record<Part,string>={face:'脸型',hair:'头发',outfit:'衣服',expression:'表情'};

export const catalogFor=(pack:PackId):AvatarCatalog=>getPack(pack).catalog;
export const optionsFor=(pack:PackId,part:Part,frame?:Frame):readonly CatalogOption[]=>frame?catalogOptionsForFrame(catalogFor(pack),part,frame):catalogFor(pack)[part];
export const optionLabel=(pack:PackId,part:Part,id:string):string=>catalogLabel(catalogFor(pack),part,id);

function frameChoice(pack:PackId,part:Part,id:string,frame:Frame):string{
  const catalog=catalogFor(pack),available=optionsFor(pack,part,frame);
  if(available.length===0)throw new Error(`头像画风「${packLabel(pack)}」在 ${frame} 没有可用的${labels[part]}。`);
  if(hasCatalogOptionForFrame(catalog,part,id,frame))return id;

  const source=catalogOption(catalog,part,id),compatibilityKey=source?.compatibilityKey??id;
  const direct=available.find(option=>option.id===compatibilityKey);
  if(direct)return direct.id;

  const compatible=available.find(option=>(option.compatibilityKey??option.id)===compatibilityKey);
  if(compatible)return compatible.id;

  const fallback=getPack(pack).defaults[part];
  if(available.some(option=>option.id===fallback))return fallback;
  return available[0].id;
}

export function recipeForPack(pack:PackId,frame?:Frame):Recipe{
  const defaults=getPack(pack).defaults;
  const base={schema:'wanhu.avatar' as const,version:1 as const,pack,...defaults};
  return frame?fitRecipeToFrame(base,frame):base;
}

export const defaultRecipe:Recipe=recipeForPack(activePackId);

// 被否定的 soft-paint-v1 不再留美术文件；兼容别名集中由 Pack Registry 管理。
// parseRecipe 只验证“属于哪个 Pack”；Frame 兼容由 fitRecipeToFrame 在目标对象上下文处理。
export function parseRecipe(value:unknown):Recipe{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('需要完整的头像配方。');
  const v=value as Record<string,unknown>;
  const fields=['schema','version','pack',...parts];
  const pack=normalizePackId(v.pack);
  if(v.schema!=='wanhu.avatar'||v.version!==1||!isPackId(pack))throw new Error('此配方不属于当前头像工坊或画风版本不受支持。');
  if(Object.keys(v).length!==fields.length||Object.keys(v).some(key=>!fields.includes(key)))throw new Error('配方字段不完整或含有未知字段。');
  const catalog=catalogFor(pack);
  for(const part of parts)if(!hasCatalogOption(catalog,part,v[part]))throw new Error(`${labels[part]}选项不属于「${packLabel(pack)}」。`);
  return {schema:'wanhu.avatar',version:1,pack,...Object.fromEntries(parts.map(part=>[part,v[part]]))} as Recipe;
}

export function fitRecipeToFrame(recipe:Recipe,frame:Frame):Recipe{
  const safe=parseRecipe(recipe);
  const choices=Object.fromEntries(parts.map(part=>[part,frameChoice(safe.pack,part,safe[part],frame)])) as Choices;
  return {...safe,...choices};
}

export const equalRecipe=(a:Recipe,b:Recipe):boolean=>parts.every(part=>a[part]===b[part])&&a.pack===b.pack;

export function withPack(recipe:Recipe,pack:PackId,frame?:Frame):Recipe{
  const safe=parseRecipe(recipe);
  if(safe.pack===pack)return frame?fitRecipeToFrame(safe,frame):safe;
  const mapped=mapChoicesToPack(safe.pack,pack,safe);
  const result=parseRecipe({...safe,pack,...mapped});
  return frame?fitRecipeToFrame(result,frame):result;
}

function preferred(pack:PackId,part:Part,id:string,frame?:Frame):string{
  if(frame)return hasCatalogOptionForFrame(catalogFor(pack),part,id,frame)?id:frameChoice(pack,part,id,frame);
  return hasCatalogOption(catalogFor(pack),part,id)?id:getPack(pack).defaults[part];
}

export function randomRecipeForPack(seed:number,pack:PackId,previous?:Recipe,frame?:Frame):Recipe{
  const base=recipeForPack(pack,frame);
  const safePrevious=previous
    ? (previous.pack===pack?(frame?fitRecipeToFrame(previous,frame):parseRecipe(previous)):withPack(previous,pack,frame))
    : undefined;
  let state=seed>>>0;
  state=Math.imul(state^state>>>16,0x7feb352d)>>>0;
  state=Math.imul(state^state>>>15,0x846ca68b)>>>0;
  state=(state^state>>>16)>>>0||1;
  const next=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
  const value:Record<string,unknown>={...base};
  for(const part of parts){
    if(safePrevious&&(part==='face'||part==='expression')){value[part]=safePrevious[part];continue;}
    const all=optionsFor(pack,part,frame);
    const filtered=safePrevious?all.filter(item=>item.id!==safePrevious[part]):all;
    const pool=filtered.length?filtered:all;
    value[part]=pool[Math.floor(next()*pool.length)].id;
  }
  const result=parseRecipe(value);
  return frame?fitRecipeToFrame(result,frame):result;
}

export const randomRecipe=(seed:number,previous?:Recipe,frame?:Frame):Recipe=>randomRecipeForPack(seed,previous?.pack??activePackId,previous,frame);

export function defaultFor(target:Target):Recipe{
  const pack=activePackId,base=recipeForPack(pack,target.frame);
  if(target.kind==='player'){
    return fitRecipeToFrame(parseRecipe({
      ...base,
      hair:preferred(pack,'hair',target.frame.startsWith('male')?'crop':'long',target.frame),
      outfit:preferred(pack,'outfit',target.frame.startsWith('male')?'shirt':'knit',target.frame),
    }),target.frame);
  }
  const randomized=randomRecipe(target.seed,undefined,target.frame);
  return fitRecipeToFrame({...randomized,expression:preferred(pack,'expression','calm',target.frame)},target.frame);
}

export function frameFor(gender:'female'|'male',stage:string):Frame{
  return `${gender}.${stage==='elder'?'elder':stage==='child'||stage==='teen'?'child':'adult'}`;
}
export const residentKey=(citySeed:number,id:number|string):string=>`city:${citySeed}:resident:${id}`;
