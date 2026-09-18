import type { Gender, LifeStageId, ResidentPortraitDNA, WealthTier } from '../domain/resident';
import { PortraitRenderer } from './portrait/PortraitRenderer';
import { resolveAppearance, resolveSavedPortrait } from './portrait/resolver';

type Props = {
  seed?: number;
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
  seed=1,
  residentStableId,
  gender,
  lifeStage,
  wealthTier='plain',
  portrait,
  hairStyleId,
  outfitStyleId,
  label,
}: Props) {
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
  return <PortraitRenderer dna={dna} context={context} lod={96} label={label}/>;
}
