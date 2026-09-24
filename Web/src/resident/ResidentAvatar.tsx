import {useMemo} from 'react';
import type { Gender, LifeStageId, ResidentPortraitDNA, ResidentProfile, WealthTier } from '../domain/resident';
import { PortraitRenderer } from './portrait/PortraitRenderer';
import { resolveAppearance, resolveSavedPortrait } from './portrait/resolver';
import {frameFor,residentKey} from '../avatar/model';
import {useSaved} from '../avatar/store';
import {avatarSource} from '../avatar/render';
import {generatedResidentRecipe} from '../avatar/resident-generation';

type Props = {
  seed?: number;
  citySeed?: number;
  residentStableId?: string | number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier?: WealthTier;
  portrait?: ResidentPortraitDNA;
  profile?: ResidentProfile;
  occupationGroupId?: string;
  hairStyleId?: string;
  outfitStyleId?: string;
  label?: string;
};

export function ResidentAvatar({
  seed=1, citySeed, residentStableId, gender, lifeStage, wealthTier='plain',
  portrait, profile, occupationGroupId, hairStyleId, outfitStyleId, label,
}: Props) {
  const key=citySeed!==undefined&&residentStableId!==undefined?residentKey(citySeed,residentStableId):'unbound';
  const saved=useSaved(key);
  const frame=frameFor(gender,lifeStage);
  const custom=useMemo(()=>saved.recipe&&key!=='unbound'?avatarSource(frame,saved.recipe):null,[saved.recipe,key,frame]);
  const generated=useMemo(()=>profile?generatedResidentRecipe({seed,gender,lifeStage,occupationGroupId,wealthTier,profile}):null,[profile,seed,gender,lifeStage,occupationGroupId,wealthTier]);
  const generatedSource=useMemo(()=>generated?avatarSource(frame,generated):null,[generated,frame]);
  const context = {
    residentStableId:String(residentStableId ?? seed),
    residentSeed:seed,
    gender,
    lifeStage,
    wealthTier,
  } as const;
  const dna=portrait
    ? resolveSavedPortrait(context,{
        ...portrait,
        hairStyleId:hairStyleId ?? portrait.hairStyleId,
        outfitStyleId:outfitStyleId ?? portrait.outfitStyleId,
      })
    : resolveAppearance(context,{hairStyleId,outfitStyleId});
  // 来源优先级：玩家保存覆盖 → Profile 派生 Q 版默认 → 冻结 PortraitRenderer fallback。
  if(custom)return <img className="avatar-custom-image" data-custom-avatar data-avatar-target={key} data-avatar-recipe={JSON.stringify(saved.recipe)} src={custom} width={96} height={96} alt={label??'居民自定义头像'}/>;
  if(generated&&generatedSource)return <img className="avatar-custom-image" data-generated-resident-avatar data-avatar-target={key} data-avatar-recipe={JSON.stringify(generated)} src={generatedSource} width={96} height={96} alt={label??'居民生成头像'}/>;
  return <PortraitRenderer dna={dna} context={context} lod={96} label={label}/>;
}
