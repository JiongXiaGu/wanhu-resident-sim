import {chibiCutePack} from './chibi';
import {lineworkPack} from './linework';
import {simpleFlatPack} from './simple-flat';
import type {AvatarPack} from './types';

const packs=[lineworkPack,chibiCutePack,simpleFlatPack] as const;

export type PackId=typeof packs[number]['id'];

export const avatarPacks=Object.fromEntries(packs.map(pack=>[pack.id,pack])) as Record<PackId,AvatarPack>;

export const packOptions=packs.map(pack=>({
  id:pack.id,
  label:pack.title,
  note:pack.note,
})) as ReadonlyArray<{id:PackId;label:string;note:string}>;

export const packCatalog=packs.map(pack=>({
  id:pack.id,
  label:pack.title,
  note:pack.note,
  viewBox:pack.viewBox,
})) as ReadonlyArray<{id:PackId;label:string;note:string;viewBox:'0 0 320 320'}>;

const legacyPackAliases:Readonly<Record<string,PackId>>={
  'soft-paint-v1':'chibi-cute-v1',
};

export function normalizePackId(value:unknown):unknown {
  if(typeof value!=='string')return value;
  return legacyPackAliases[value]??value;
}

export const isPackId=(value:unknown):value is PackId=>typeof value==='string'&&Object.prototype.hasOwnProperty.call(avatarPacks,value);
export const packLabel=(id:PackId):string=>avatarPacks[id].title;
export const getPack=(id:PackId):AvatarPack=>avatarPacks[id];
