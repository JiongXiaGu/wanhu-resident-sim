import { useMemo,useSyncExternalStore } from 'react';
import { parseRecipe,type Recipe } from './model';
export const STORAGE_PREFIX='wanhu.avatar.v1:';
const CHANGE='wanhu-avatar-changed';
export const storageKey=(targetKey:string)=>STORAGE_PREFIX+targetKey;
export function getRaw(targetKey:string):string|null {return localStorage.getItem(storageKey(targetKey));}
export function parseEntry(raw:string|null):{recipe:Recipe|null;error:string} {
  if(raw===null)return {recipe:null,error:''};
  try{return {recipe:parseRecipe(JSON.parse(raw)),error:''};}catch{return {recipe:null,error:'这个对象保存的头像配方无效。原数据未被删除；可重新选择并应用。'};}
}
function subscribe(listener:()=>void):()=>void {
  window.addEventListener(CHANGE,listener);window.addEventListener('storage',listener);
  return ()=>{window.removeEventListener(CHANGE,listener);window.removeEventListener('storage',listener);};
}
export function useSaved(targetKey:string):{raw:string|null;recipe:Recipe|null;error:string} {
  const raw=useSyncExternalStore(subscribe,()=>{try{return getRaw(targetKey);}catch{return null;}},()=>null);
  const parsed=useMemo(()=>parseEntry(raw),[raw]);
  return {raw,...parsed};
}
// 一个目标一个存储键；不会重写整座城市的外观表，避免保存甲覆盖乙的修改。
// 同目标有其他标签页修改时拒绝旧草稿；这是乐观冲突检查，不是分布式事务。
export function applyRecipe(targetKey:string,recipe:Recipe,expectedRaw:string|null):void {
  const safe=parseRecipe(recipe);
  if(getRaw(targetKey)!==expectedRaw)throw new Error('此对象的头像已在其他窗口更新。请先重新载入，再应用你的修改。');
  localStorage.setItem(storageKey(targetKey),JSON.stringify(safe));
  window.dispatchEvent(new Event(CHANGE));
}
export function removeRecipe(targetKey:string,expectedRaw:string|null):void {
  if(getRaw(targetKey)!==expectedRaw)throw new Error('此对象的头像已更新，请重新载入后再恢复默认。');
  localStorage.removeItem(storageKey(targetKey));
  window.dispatchEvent(new Event(CHANGE));
}
