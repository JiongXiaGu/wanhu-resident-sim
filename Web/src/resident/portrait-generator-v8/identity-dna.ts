import { hash32 } from './seed-bank';
import type { AppearanceIdentityDNA } from './types';

export function identityFingerprint(identity: AppearanceIdentityDNA) {
  return hash32(JSON.stringify(identity)).toString(16).padStart(8,'0');
}

export function sameIdentity(a: AppearanceIdentityDNA, b: AppearanceIdentityDNA) {
  return identityFingerprint(a)===identityFingerprint(b);
}

export function identityStableIds(identity: AppearanceIdentityDNA) {
  return [
    identity.faceFamilyId,
    identity.skinPaletteId,
    identity.baseHairColorId,
  ];
}
