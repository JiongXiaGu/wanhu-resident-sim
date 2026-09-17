import type { Gender } from '../domain/resident';

export type PortraitFaceArtProfile = {
  artFamily: string;
  faceScale: number;
  templeInset: number;
  cheekPush: number;
  jawScale: number;
  chinDepth: number;
  eyeSpacing: number;
  eyeWidth: number;
  eyeCurve: number;
  eyeTilt: number;
  browThickness: number;
  browLift: number;
  noseLength: number;
  noseWidth: number;
  mouthWidth: number;
  mouthCurve: number;
  earScale: number;
  neckScale: number;
  shoulderScale: number;
  cheekAccent: number;
};

// V2 deliberately keeps the two base languages separated before individual face overrides
// are applied. Hair and facial hair are additional identity layers, not the primary gender cue.
const MALE_BASE: PortraitFaceArtProfile = {
  artFamily: 'male-balanced',
  faceScale: 1.01,
  templeInset: -0.15,
  cheekPush: 0.85,
  jawScale: 1.12,
  chinDepth: 1.25,
  eyeSpacing: 0.216,
  eyeWidth: 0.078,
  eyeCurve: 0.76,
  eyeTilt: 0.12,
  browThickness: 2.25,
  browLift: -0.1,
  noseLength: 1.05,
  noseWidth: 1.14,
  mouthWidth: 0.238,
  mouthCurve: 0.86,
  earScale: 1.06,
  neckScale: 1.14,
  shoulderScale: 1.11,
  cheekAccent: 0,
};

const FEMALE_BASE: PortraitFaceArtProfile = {
  artFamily: 'female-balanced',
  faceScale: 0.96,
  templeInset: 0.9,
  cheekPush: 0.18,
  jawScale: 0.84,
  chinDepth: 0.05,
  eyeSpacing: 0.238,
  eyeWidth: 0.11,
  eyeCurve: 1.48,
  eyeTilt: -0.42,
  browThickness: 1.3,
  browLift: 0.72,
  noseLength: 0.84,
  noseWidth: 0.7,
  mouthWidth: 0.195,
  mouthCurve: 1.46,
  earScale: 0.84,
  neckScale: 0.76,
  shoulderScale: 0.85,
  cheekAccent: 0.2,
};

const PROFILE_OVERRIDES: Record<string, Partial<PortraitFaceArtProfile>> = {
  'appearance.face.male-oval-01': {
    artFamily: 'male-oval-steady', cheekPush: 0.35, jawScale: 1.1, eyeSpacing: 0.214, mouthWidth: 0.24,
  },
  'appearance.face.male-oval-02': {
    artFamily: 'male-oval-lean', faceScale: 0.975, templeInset: 0.25, cheekPush: 0.15, jawScale: 1.02, eyeWidth: 0.076, noseLength: 1.1, neckScale: 1.08,
  },
  'appearance.face.male-round-01': {
    artFamily: 'male-round-open', faceScale: 1.045, cheekPush: 2.1, jawScale: 1.17, chinDepth: -0.8, eyeSpacing: 0.225, eyeCurve: 0.92, mouthCurve: 1.08,
  },
  'appearance.face.male-long-01': {
    artFamily: 'male-long-narrow', faceScale: 0.965, templeInset: 0.55, cheekPush: -0.45, jawScale: 1.01, chinDepth: 2.45, eyeSpacing: 0.205, eyeWidth: 0.074, noseLength: 1.2, noseWidth: 1.08, mouthWidth: 0.228,
  },
  'appearance.face.male-square-01': {
    artFamily: 'male-square-firm', faceScale: 1.035, templeInset: -0.35, cheekPush: 1.25, jawScale: 1.24, chinDepth: 0.45, eyeCurve: 0.62, browThickness: 2.55, noseWidth: 1.22, neckScale: 1.22, shoulderScale: 1.17,
  },
  'appearance.face.male-broad-01': {
    artFamily: 'male-broad-heavy', faceScale: 1.055, templeInset: -0.35, cheekPush: 2.45, jawScale: 1.23, chinDepth: -0.45, eyeSpacing: 0.232, eyeWidth: 0.072, eyeCurve: 0.66, browThickness: 2.48, noseWidth: 1.27, neckScale: 1.24, shoulderScale: 1.18,
  },

  'appearance.face.female-oval-01': {
    artFamily: 'female-oval-soft', faceScale: 0.95, templeInset: 1.05, cheekPush: 0.12, jawScale: 0.8, eyeSpacing: 0.24, eyeWidth: 0.114, mouthWidth: 0.195, cheekAccent: 0.24,
  },
  'appearance.face.female-oval-02': {
    artFamily: 'female-oval-fine', faceScale: 0.915, templeInset: 1.35, cheekPush: -0.2, jawScale: 0.76, chinDepth: 0.85, eyeSpacing: 0.23, eyeWidth: 0.118, noseWidth: 0.64, mouthWidth: 0.18, neckScale: 0.72, shoulderScale: 0.81,
  },
  'appearance.face.female-round-01': {
    artFamily: 'female-round-soft', faceScale: 0.985, templeInset: 0.45, cheekPush: 1.6, jawScale: 0.86, chinDepth: -1.2, eyeSpacing: 0.242, eyeWidth: 0.114, eyeCurve: 1.56, mouthCurve: 1.62, neckScale: 0.74, shoulderScale: 0.84, cheekAccent: 0.3,
  },
  'appearance.face.female-long-01': {
    artFamily: 'female-long-clear', faceScale: 0.91, templeInset: 1.3, cheekPush: -0.5, jawScale: 0.77, chinDepth: 2.15, eyeSpacing: 0.226, eyeWidth: 0.11, noseLength: 0.96, noseWidth: 0.66, mouthWidth: 0.18, neckScale: 0.73, shoulderScale: 0.8,
  },
  'appearance.face.female-mature-01': {
    artFamily: 'female-mature-oval', faceScale: 0.965, templeInset: 0.8, cheekPush: 0.8, jawScale: 0.88, chinDepth: 0.55, eyeWidth: 0.104, eyeCurve: 1.24, mouthCurve: 1.02, neckScale: 0.82, shoulderScale: 0.88, cheekAccent: 0.08,
  },
  'appearance.face.female-youth-01': {
    artFamily: 'female-youth-round', faceScale: 0.965, templeInset: 0.4, cheekPush: 1.5, jawScale: 0.78, chinDepth: -1.05, eyeSpacing: 0.245, eyeWidth: 0.12, eyeCurve: 1.62, browLift: 1.05, noseLength: 0.76, noseWidth: 0.62, mouthCurve: 1.65, neckScale: 0.68, shoulderScale: 0.78, cheekAccent: 0.34,
  },
  'appearance.face.female-youth-02': {
    artFamily: 'female-youth-slender', faceScale: 0.89, templeInset: 1.45, cheekPush: 0.02, jawScale: 0.73, chinDepth: 0.85, eyeSpacing: 0.232, eyeWidth: 0.12, eyeCurve: 1.58, browLift: 1.0, noseLength: 0.78, noseWidth: 0.61, mouthWidth: 0.178, neckScale: 0.69, shoulderScale: 0.79, cheekAccent: 0.24,
  },
  'appearance.face.female-adult-01': {
    artFamily: 'female-adult-soft-square', faceScale: 0.96, templeInset: 0.7, cheekPush: 0.95, jawScale: 0.88, chinDepth: 0.3, eyeSpacing: 0.236, eyeWidth: 0.11, eyeCurve: 1.38, noseWidth: 0.72, mouthWidth: 0.205, neckScale: 0.78, shoulderScale: 0.86,
  },
  'appearance.face.female-adult-02': {
    artFamily: 'female-adult-long', faceScale: 0.92, templeInset: 1.2, cheekPush: -0.3, jawScale: 0.78, chinDepth: 1.95, eyeSpacing: 0.228, eyeWidth: 0.108, eyeCurve: 1.34, noseLength: 0.97, noseWidth: 0.66, mouthCurve: 1.16, neckScale: 0.79, shoulderScale: 0.84,
  },
  'appearance.face.female-mature-02': {
    artFamily: 'female-mature-broad', faceScale: 0.99, templeInset: 0.45, cheekPush: 1.9, jawScale: 0.93, chinDepth: -0.35, eyeSpacing: 0.242, eyeWidth: 0.102, eyeCurve: 1.2, browThickness: 1.42, noseWidth: 0.8, mouthWidth: 0.21, neckScale: 0.86, shoulderScale: 0.9, cheekAccent: 0.06,
  },
  'appearance.face.female-elder-01': {
    artFamily: 'female-elder-narrow', faceScale: 0.945, templeInset: 1.0, cheekPush: 0.25, jawScale: 0.79, chinDepth: 1.3, eyeSpacing: 0.23, eyeWidth: 0.098, eyeCurve: 1.08, browThickness: 1.18, browLift: -0.1, noseLength: 1.04, noseWidth: 0.76, mouthWidth: 0.185, mouthCurve: 0.66, neckScale: 0.8, shoulderScale: 0.85, cheekAccent: 0,
  },
};

export function faceArtProfile(faceId: string, gender: Gender): PortraitFaceArtProfile {
  const base = gender === 'female' ? FEMALE_BASE : MALE_BASE;
  return { ...base, ...PROFILE_OVERRIDES[faceId] };
}

export function faceArtFamily(faceId: string, gender: Gender) {
  return faceArtProfile(faceId, gender).artFamily;
}
