import {lazy,Suspense,useEffect,useMemo,useState} from 'react';
import {ageAtDay,type ResidentDefinitions,type ResidentWorldSnapshot} from '../domain/resident';
import {frameFor,residentKey,type Target} from './model';
import {generatedResidentRecipe} from './resident-generation';
import {SavedAvatar} from './AvatarImage';
import {studioTargets} from './studio';
import './entry.css';
const AvatarEditor=lazy(()=>import('./AvatarEditor'));
const OPEN='wanhu-open-avatar-editor';
export function openAvatarEditor(residentId?:number):void {window.dispatchEvent(new CustomEvent(OPEN,{detail:residentId}));}
export function AvatarIntegration({snapshot,definitions,currentDay,daysPerYear,onSelectResident}:{snapshot:ResidentWorldSnapshot;definitions:ResidentDefinitions;currentDay:number;daysPerYear:number;onSelectResident:(id:number)=>void}) {
 const [openKey,setOpenKey]=useState<string|null>(null);
 const targets=useMemo<Target[]>(()=>{
  const householdById=new Map(snapshot.households.map(item=>[item.id,item]));
  const occupationById=new Map(definitions.occupations.map(item=>[item.id,item]));
  return [
   {key:`city:${snapshot.citySeed}:player:female`,name:'我的头像 · 女',detail:'玩家示例 / 21 岁',frame:'female.adult',seed:21,kind:'player' as const},
   {key:`city:${snapshot.citySeed}:player:male`,name:'我的头像 · 男',detail:'玩家示例 / 32 岁',frame:'male.adult',seed:32,kind:'player' as const},
   ...studioTargets(snapshot.citySeed),
   ...snapshot.residents.map(resident=>{
    const household=householdById.get(resident.householdId);
    const occupation=occupationById.get(resident.occupationId);
    return {
     key:residentKey(snapshot.citySeed,resident.id),name:resident.displayName,
     detail:`${ageAtDay(resident,currentDay,daysPerYear)} 岁 / 居民 ${resident.id}`,
     frame:frameFor(resident.gender,resident.lifeStage),seed:resident.seed,kind:'resident' as const,residentId:resident.id,
     initialRecipe:generatedResidentRecipe({
      seed:resident.seed,gender:resident.gender,lifeStage:resident.lifeStage,
      occupationGroupId:occupation?.groupId,wealthTier:household?.wealthTier??'plain',profile:resident.profile,
     }),
    };
   }),
  ];
 },[snapshot,definitions,currentDay,daysPerYear]);
 const studioKey=targets.find(target=>target.kind==='studio'&&target.frame==='female.adult')!.key;
 useEffect(()=>{
  function open(event:Event){const id=(event as CustomEvent<number|undefined>).detail;setOpenKey(id!==undefined&&snapshot.residents.some(item=>item.id===id)?residentKey(snapshot.citySeed,id):studioKey);}
  window.addEventListener(OPEN,open);return()=>window.removeEventListener(OPEN,open);
 },[snapshot,targets]);
 useEffect(()=>{if(new URLSearchParams(location.search).get('view')==='avatar-editor')setOpenKey(studioKey);},[]);
 function close(residentId?:number){setOpenKey(null);if(residentId!==undefined)onSelectResident(residentId);const url=new URL(location.href);if(url.searchParams.get('view')==='avatar-editor'){url.searchParams.delete('view');history.replaceState(null,'',url);}}
 return <><button type="button" className="avatar-workshop-entry" data-open-avatar-workshop onClick={()=>setOpenKey(studioKey)}><SavedAvatar target={targets[0]} size={36}/><span>头像工坊<small>自由创作 / 居民</small></span></button>
  {openKey&&<Suspense fallback={<div className="avatar-loading" role="status">正在打开头像工坊…</div>}><AvatarEditor targets={targets} initialKey={openKey} onClose={close}/></Suspense>}</>;
}
