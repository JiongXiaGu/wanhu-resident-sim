import type { Gender, LifeStageId } from '../../domain/resident';
import type { PortraitAgeBand, PortraitFrameId } from './types';

export const PORTRAIT_AGE_BANDS: readonly PortraitAgeBand[] = ['child','adult','elder'];

export const PORTRAIT_FRAME_IDS: readonly PortraitFrameId[] = [
  'female.child',
  'female.adult',
  'female.elder',
  'male.child',
  'male.adult',
  'male.elder',
];

export function portraitAgeBandForLifeStage(lifeStage: LifeStageId): PortraitAgeBand {
  if (lifeStage === 'child' || lifeStage === 'teen') return 'child';
  if (lifeStage === 'elder') return 'elder';
  return 'adult';
}

export function portraitFrameIdFor(gender: Gender, lifeStage: LifeStageId): PortraitFrameId {
  return `${gender}.${portraitAgeBandForLifeStage(lifeStage)}` as PortraitFrameId;
}
