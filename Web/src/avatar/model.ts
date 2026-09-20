import {catalogLabel,hasCatalogOption,parts,type AvatarCatalog,type CatalogOption,type Part} from './packs/catalog';
import {activePackId,getPack,isPackId,mapChoicesToPack,normalizePackId,packCatalog,packLabel,packOptions,type PackId} from './packs/registry';

export {activePackId,packCatalog,packLabel,packOptions,parts};
export type {PackId,Part};

// 头像工坊只保存四个外观选择；每个 Pack 自己拥有可用素材 Catalog。
export type Choices=Record<Part,string>;
export type Recipe={schema:'wanhu.avatar';version:1;pack:PackId}&Choices;
export type Frame=`${'female'|'male'}.${'child'|'adult'|'elder'}`;
export type Target={key:string;name:string;detail:string;frame:Frame;seed:number;kind:'player'|'resident';residentId?:number};

export const frames:Frame[]=['female.child','female.adult','female.elder','male.child','male.adult','male.elder'];
export const labels:Record<Part,string>={face:'脸型',hair:'头发',outfit:'衣服',expression:'表情'};

export const catalogFor=(pack:PackId):AvatarCatalog=>getPack(pack).catalog;
export const optionsFor=(pack:PackId,part:Part):readonly CatalogOption[]=>catalogFor(pack)[part];
export const optionLabel=(pack:PackId,part:Part,id:string):string=>catalogLabel(catalogFor(pack),part,id);

export function recipeForPack(pack:PackId):Recipe{
  const defaults=getPack(pack).defaults;
  return {schema:'wanhu.avatar',version:1,pack,...defaults};
}

export const defaultRecipe:Recipe=recipeForPack(activePackId);

// 被否定的 soft-paint-v1 不再留美术文件；兼容别名集中由 Pack Registry 管理。
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

export const equalRecipe=(a:Recipe,b:Recipe):boolean=>parts.every(part=>a[part]===b[part])&&a.pack===b.pack;

export function withPack(recipe:Recipe,pack:PackId):Recipe{
  const safe=parseRecipe(recipe);
  if(safe.pack===pack)return safe;
  const mapped=mapChoicesToPack(safe.pack,pack,safe);
  return parseRecipe({...safe,pack,...mapped});
}

function preferred(pack:PackId,part:Part,id:string):string{
  return hasCatalogOption(catalogFor(pack),part,id)?id:getPack(pack).defaults[part];
}

export function randomRecipeForPack(seed:number,pack:PackId,previous?:Recipe):Recipe{
  const definition=getPack(pack),catalog=definition.catalog;
  const safePrevious=previous?(previous.pack===pack?parseRecipe(previous):withPack(previous,pack)):undefined;
  let state=seed>>>0;
  state=Math.imul(state^state>>>16,0x7feb352d)>>>0;
  state=Math.imul(state^state>>>15,0x846ca68b)>>>0;
  state=(state^state>>>16)>>>0||1;
  const next=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
  const value:Record<string,unknown>={schema:'wanhu.avatar',version:1,pack,...definition.defaults};
  for(const part of parts){
    if(safePrevious&&(part==='face'||part==='expression')){value[part]=safePrevious[part];continue;}
    const all=catalog[part];
    const filtered=safePrevious?all.filter(item=>item.id!==safePrevious[part]):all;
    const pool=filtered.length?filtered:all;
    value[part]=pool[Math.floor(next()*pool.length)].id;
  }
  return parseRecipe(value);
}

export const randomRecipe=(seed:number,previous?:Recipe):Recipe=>randomRecipeForPack(seed,previous?.pack??activePackId,previous);

export function defaultFor(target:Target):Recipe{
  const pack=activePackId,definition=getPack(pack);
  if(target.kind==='player'){
    return parseRecipe({
      schema:'wanhu.avatar',
      version:1,
      pack,
      ...definition.defaults,
      hair:preferred(pack,'hair',target.frame.startsWith('male')?'crop':'long'),
      outfit:preferred(pack,'outfit',target.frame.startsWith('male')?'shirt':'knit'),
    });
  }
  const randomized=randomRecipe(target.seed);
  return parseRecipe({...randomized,expression:preferred(pack,'expression','calm')});
}

export function frameFor(gender:'female'|'male',stage:string):Frame{
  return `${gender}.${stage==='elder'?'elder':stage==='child'||stage==='teen'?'child':'adult'}`;
}
export const residentKey=(citySeed:number,id:number|string):string=>`city:${citySeed}:resident:${id}`;
