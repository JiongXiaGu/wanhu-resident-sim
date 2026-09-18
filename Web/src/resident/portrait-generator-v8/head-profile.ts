import { HEAD_PROFILES } from './catalog';

export function headProfileById(id: string) {
  const profile = HEAD_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error('Unknown V8 HeadProfile: ' + id);
  return profile;
}

export function headProfilesForFaceFamily(faceFamilyId: string) {
  return HEAD_PROFILES.filter((item) => item.faceFamilyId === faceFamilyId);
}
