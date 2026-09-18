import type { Gender, LifeStageId, PresentationStyle, WealthTier } from '../domain/resident';
import { PortraitRenderer } from './portrait/PortraitRenderer';
import { resolveAppearance } from './portrait/resolver';
import { hash32 } from './portrait/seed';

type Props = {
  seed?: number;
  residentStableId?: string | number;
  gender: Gender;
  lifeStage: LifeStageId;
  wealthTier?: WealthTier;
  presentationStyle?: PresentationStyle;
  hairStyleId?: string;
  outfitStyleId?: string;
  label?: string;
};

export function appearanceSignature(value: unknown) {
  return hash32(JSON.stringify(value)).toString(16).padStart(8,'0');
}

export function ResidentAvatar({
  seed=1,
  residentStableId,
  gender,
  lifeStage,
  wealthTier='plain',
  presentationStyle='tidy',
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
    presentationStyle,
  } as const;
  const dna=resolveAppearance(context,{hairStyleId,outfitStyleId});
  return <PortraitRenderer dna={dna} context={context} lod={96} label={label}/>;
}
