import {useMemo} from 'react';
import type { Gender, LifeStageId, ResidentPortraitDNA, WealthTier } from '../domain/resident';
import { PortraitRenderer } from './portrait/PortraitRenderer';
import { resolveAppearance, resolveSavedPortrait } from './portrait/resolver';
import {frameFor,residentKey} from '../avatar/model';
import {useSaved} from '../avatar/store';
import {avatarSource} from '../avatar/render';

type Props = {
  seed?: number;
  citySeed?: number;
  residentStableId?: string | number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier?: WealthTier;
  portrait?: ResidentPortraitDNA;
  hairStyleId?: string;
  outfitStyleId?: string;
  label?: string;
};

export function ResidentAvatar({
  seed=1, citySeed, residentStableId, gender, lifeStage, wealthTier='plain',
  portrait, hairStyleId, outfitStyleId, label,
}: Props) {
  const key=citySeed!==undefined&&residentStableId!==undefined?residentKey(citySeed,residentStableId):'unbound';
  const saved=useSaved(key);
  const custom=useMemo(()=>saved.recipe&&key!=='unbound'?avatarSource(frameFor(gender,lifeStage),saved.recipe):null,[saved.recipe,key,gender,lifeStage]);
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
  // 仅 Web 覆盖层。未应用的居民仍然使用冻结的正式 Renderer 和原有 DNA。
  if(custom)return <img className="avatar-custom-image" data-custom-avatar data-avatar-target={key} data-avatar-recipe={JSON.stringify(saved.recipe)} src={custom} width={96} height={96} alt={label??'居民自定义头像'}/>;
  return <PortraitRenderer dna={dna} context={context} lod={96} label={label}/>;
}
