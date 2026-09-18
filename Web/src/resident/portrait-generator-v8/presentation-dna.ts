import { hash32 } from './seed-bank';
import type { AppearancePresentationDNA } from './types';

export function presentationFingerprint(presentation: AppearancePresentationDNA) {
  return hash32(JSON.stringify(presentation)).toString(16).padStart(8, '0');
}

export function presentationStableIds(presentation: AppearancePresentationDNA) {
  return [
    presentation.hairBundleId,
    presentation.outfitBundleId,
    presentation.accessoryAssetId,
    presentation.ageOverlayId,
    presentation.hairColorStateId,
  ];
}
