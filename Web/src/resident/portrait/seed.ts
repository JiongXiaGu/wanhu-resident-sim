export function hash32(value: string | number) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export type SeedBank = ReturnType<typeof createSeedBank>;

export function createSeedBank(rootSeed: number, namespace: string) {
  const base = hash32(rootSeed + ':' + namespace);
  const seedFor = (stream: string, key = '') => hash32(base + ':' + stream + ':' + key);
  const unit = (stream: string, key = '') => seedFor(stream, key) / 4294967296;
  const pickIndex = (stream: string, length: number, key = '') => {
    if (length <= 0) throw new Error('SeedBank.pickIndex requires at least one candidate.');
    return Math.min(length - 1, Math.floor(unit(stream, key) * length));
  };
  return { base, seedFor, unit, pickIndex };
}

export function createIdentitySeedBank(residentSeed: number) {
  return createSeedBank(residentSeed, 'portrait.identity.v1');
}

export function createPresentationSeedBank(residentSeed: number) {
  return createSeedBank(residentSeed, 'portrait.presentation.v8');
}
