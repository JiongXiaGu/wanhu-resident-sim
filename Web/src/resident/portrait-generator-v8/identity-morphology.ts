import type { IdentityMorphology } from './types';
import type { SeedBank } from './seed-bank';

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function round4(value: number) {
  return Math.round(value * 10000) / 10000;
}

export function resolveIdentityMorphology(seeds: SeedBank): IdentityMorphology {
  return {
    faceWidthScale: round4(lerp(.96, 1.04, seeds.unit('morph.face-width'))),
    featureSpanScale: round4(lerp(.95, 1.05, seeds.unit('morph.feature-span'))),
    noseLengthScale: round4(lerp(.94, 1.06, seeds.unit('morph.nose-length'))),
    mouthWidthScale: round4(lerp(.94, 1.06, seeds.unit('morph.mouth-width'))),
  };
}

export function morphologyFingerprint(morphology: IdentityMorphology) {
  return [
    morphology.faceWidthScale,
    morphology.featureSpanScale,
    morphology.noseLengthScale,
    morphology.mouthWidthScale,
  ].join('|');
}
