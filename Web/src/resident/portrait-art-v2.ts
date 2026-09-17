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

const MALE_BASE: PortraitFaceArtProfile = {
  artFamily: 'male-balanced',
  faceScale: 1,
  templeInset: 0,
  cheekPush: 0.7,
  jawScale: 1.06,
  chinDepth: 1.2,
  eyeSpacing: 0.222,
  eyeWidth: 0.086,
  eyeCurve: 1,
  eyeTilt: 0,
  browThickness: 2.05,
  browLift: 0,
  noseLength: 1.02,
  noseWidth: 1.05,
  mouthWidth: 0.235,
  mouthCurve: 1,
  earScale: 1.03,
  neckScale: 1.08,
  shoulderScale: 1.07,
  cheekAccent: 0,
};

const FEMALE_BASE: PortraitFaceArtProfile = {
  artFamily: 'female-balanced',
  faceScale: 0.985,
  templeInset: 0.7,
  cheekPush: 0.15,
  jawScale: 0.9,
  chinDepth: 0.15,
  eyeSpacing: 0.232,
  eyeWidth: 0.102,
  eyeCurve: 1.34,
  eyeTilt: -0.25,
  browThickness: 1.48,
  browLift: 0.55,
  noseLength: 0.9,
  noseWidth: 0.78,
  mouthWidth: 0.205,
  mouthCurve: 1.3,
  earScale: 0.88,
  neckScale: 0.84,
  shoulderScale: 0.9,
  cheekAccent: 0.18,
};

const PROFILE_OVERRIDES: Record<string, Partial<PortraitFaceArtProfile>> = {
  'appearance.face.male-oval-01': {
    artFamily: 'male-oval-steady', cheekPush: 0.3, jawScale: 1.04, eyeSpacing: 0.218, mouthWidth: 0.24,
  },
  'appearance.face.male-oval-02': {
    artFamily: 'male-oval-lean', faceScale: 0.97, templeInset: 0.4, jawScale: 0.98, eyeWidth: 0.082, noseLength: 1.08, neckScale: 1.03,
  },
  'appearance.face.male-round-01': {
    artFamily: 'male-round-open', faceScale: 1.03, cheekPush: 1.8, jawScale: 1.12, chinDepth: -0.6, eyeSpacing: 0.228, eyeCurve: 1.16, mouthCurve: 1.25,
  },
  'appearance.face.male-long-01': {
    artFamily: 'male-long-narrow', faceScale: 0.96, templeInset: 0.8, cheekPush: -0.5, jawScale: 0.96, chinDepth: 2.2, eyeSpacing: 0.21, noseLength: 1.17, mouthWidth: 0.225,
  },
  'appearance.face.male-square-01': {
    artFamily: 'male-square-firm', faceScale: 1.02, cheekPush: 1.1, jawScale: 1.18, chinDepth: 0.55, eyeCurve: 0.76, browThickness: 2.4, noseWidth: 1.15, neckScale: 1.15, shoulderScale: 1.13,
  },
  'appearance.face.male-broad-01': {
    artFamily: 'male-broad-heavy', faceScale: 1.035, cheekPush: 2.2, jawScale: 1.17, chinDepth: -0.25, eyeSpacing: 0.235, eyeWidth: 0.08, browThickness: 2.3, noseWidth: 1.2, neckScale: 1.18, shoulderScale: 1.15,
  },

  'appearance.face.female-oval-01': {
    artFamily: 'female-oval-soft', faceScale: 0.97, templeInset: 0.8, jawScale: 0.86, eyeSpacing: 0.236, eyeWidth: 0.106, mouthWidth: 0.205, cheekAccent: 0.22,
  },
  'appearance.face.female-oval-02': {
    artFamily: 'female-oval-fine', faceScale: 0.94, templeInset: 1.1, cheekPush: -0.15, jawScale: 0.82, chinDepth: 0.9, eyeSpacing: 0.228, eyeWidth: 0.112, noseWidth: 0.72, mouthWidth: 0.19, neckScale: 0.8,
  },
  'appearance.face.female-round-01': {
    artFamily: 'female-round-soft', faceScale: 1, templeInset: 0.25, cheekPush: 1.35, jawScale: 0.93, chinDepth: -1, eyeSpacing: 0.238, eyeWidth: 0.108, eyeCurve: 1.42, mouthCurve: 1.55, cheekAccent: 0.28,
  },
  'appearance.face.female-long-01': {
    artFamily: 'female-long-clear', faceScale: 0.94, templeInset: 1, cheekPush: -0.4, jawScale: 0.84, chinDepth: 2, eyeSpacing: 0.224, eyeWidth: 0.104, noseLength: 1.02, mouthWidth: 0.19, shoulderScale: 0.86,
  },
  'appearance.face.female-mature-01': {
    artFamily: 'female-mature-oval', faceScale: 0.99, templeInset: 0.5, cheekPush: 0.65, jawScale: 0.94, chinDepth: 0.6, eyeWidth: 0.098, eyeCurve: 1.12, mouthCurve: 0.9, neckScale: 0.91, shoulderScale: 0.94, cheekAccent: 0.08,
  },
  'appearance.face.female-youth-01': {
    artFamily: 'female-youth-round', faceScale: 0.985, templeInset: 0.25, cheekPush: 1.25, jawScale: 0.86, chinDepth: -0.8, eyeSpacing: 0.24, eyeWidth: 0.112, eyeCurve: 1.5, browLift: 0.9, noseLength: 0.82, mouthCurve: 1.55, neckScale: 0.79, shoulderScale: 0.84, cheekAccent: 0.32,
  },
  'appearance.face.female-youth-02': {
    artFamily: 'female-youth-slender', faceScale: 0.92, templeInset: 1.2, cheekPush: 0.05, jawScale: 0.8, chinDepth: 0.9, eyeSpacing: 0.23, eyeWidth: 0.114, eyeCurve: 1.48, browLift: 0.8, noseLength: 0.84, noseWidth: 0.7, mouthWidth: 0.19, neckScale: 0.78, shoulderScale: 0.84, cheekAccent: 0.22,
  },
  'appearance.face.female-adult-01': {
    artFamily: 'female-adult-soft-square', faceScale: 0.985, templeInset: 0.45, cheekPush: 0.8, jawScale: 0.94, chinDepth: 0.35, eyeSpacing: 0.232, eyeWidth: 0.104, eyeCurve: 1.26, noseWidth: 0.82, mouthWidth: 0.215, neckScale: 0.87, shoulderScale: 0.91,
  },
  'appearance.face.female-adult-02': {
    artFamily: 'female-adult-long', faceScale: 0.95, templeInset: 0.9, cheekPush: -0.25, jawScale: 0.86, chinDepth: 1.8, eyeSpacing: 0.226, eyeWidth: 0.102, eyeCurve: 1.22, noseLength: 1.02, mouthCurve: 1.05, neckScale: 0.88, shoulderScale: 0.9,
  },
  'appearance.face.female-mature-02': {
    artFamily: 'female-mature-broad', faceScale: 1.015, templeInset: 0.15, cheekPush: 1.65, jawScale: 1.01, chinDepth: -0.2, eyeSpacing: 0.238, eyeWidth: 0.095, eyeCurve: 1.02, browThickness: 1.62, noseWidth: 0.92, mouthWidth: 0.22, neckScale: 0.96, shoulderScale: 0.98, cheekAccent: 0.06,
  },
  'appearance.face.female-elder-01': {
    artFamily: 'female-elder-narrow', faceScale: 0.98, templeInset: 0.65, cheekPush: 0.25, jawScale: 0.87, chinDepth: 1.25, eyeSpacing: 0.228, eyeWidth: 0.09, eyeCurve: 0.94, browThickness: 1.35, browLift: -0.2, noseLength: 1.08, noseWidth: 0.88, mouthWidth: 0.195, mouthCurve: 0.55, neckScale: 0.89, shoulderScale: 0.9, cheekAccent: 0,
  },
};

export function faceArtProfile(faceId: string, gender: Gender): PortraitFaceArtProfile {
  const base = gender === 'female' ? FEMALE_BASE : MALE_BASE;
  return { ...base, ...PROFILE_OVERRIDES[faceId] };
}

export function faceArtFamily(faceId: string, gender: Gender) {
  return faceArtProfile(faceId, gender).artFamily;
}
