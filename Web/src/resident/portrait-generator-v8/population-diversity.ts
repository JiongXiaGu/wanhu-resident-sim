import type { HairStyleBundle, PopulationDiversitySnapshot } from './types';

export class PopulationDiversityController {
  private totalResolved = 0;
  private readonly counts = new Map<string, number>();
  private readonly recent: string[] = [];

  constructor(private readonly recentWindow = 8) {}

  multiplier(bundle: HairStyleBundle) {
    const count = this.counts.get(bundle.id) ?? 0;
    const expected = Math.max(1, (this.totalResolved + 1) * bundle.targetShare);
    const deficitRatio = Math.max(0.45, Math.min(1.7, expected / Math.max(1, count)));
    const recentIndex = this.recent.lastIndexOf(bundle.id);
    const recentMultiplier = recentIndex < 0
      ? 1.12
      : this.recent.length - 1 - recentIndex <= 1
        ? 0.24
        : this.recent.length - 1 - recentIndex <= 3
          ? 0.55
          : 0.82;
    return deficitRatio * recentMultiplier;
  }

  commit(bundleId: string) {
    this.totalResolved += 1;
    this.counts.set(bundleId, (this.counts.get(bundleId) ?? 0) + 1);
    this.recent.push(bundleId);
    if (this.recent.length > this.recentWindow) this.recent.shift();
  }

  snapshot(): PopulationDiversitySnapshot {
    return {
      totalResolved: this.totalResolved,
      countsByHairBundle: Object.fromEntries(this.counts),
      recentHairBundles: [...this.recent],
    };
  }
}
