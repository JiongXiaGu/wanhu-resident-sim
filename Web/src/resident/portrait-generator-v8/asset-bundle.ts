import { ACCESSORIES, HAIR_BUNDLES, OUTFIT_BUNDLES, layerById } from './catalog';

export function hairBundleById(id: string) {
  const bundle = HAIR_BUNDLES.find((item) => item.id === id);
  if (!bundle) throw new Error('Unknown V8 HairStyleBundle: ' + id);
  return bundle;
}

export function outfitBundleById(id: string) {
  const bundle = OUTFIT_BUNDLES.find((item) => item.id === id);
  if (!bundle) throw new Error('Unknown V8 OutfitBundle: ' + id);
  return bundle;
}

export function accessoryById(id: string) {
  const asset = ACCESSORIES.find((item) => item.id === id);
  if (!asset) throw new Error('Unknown V8 AccessoryAsset: ' + id);
  return asset;
}

export function bundleLayerAssets(bundleId: string) {
  const hair = HAIR_BUNDLES.find((item) => item.id === bundleId);
  if (hair) return hair.layerAssetIds.map(layerById);
  const outfit = OUTFIT_BUNDLES.find((item) => item.id === bundleId);
  if (outfit) return outfit.layerAssetIds.map(layerById);
  throw new Error('Unknown V8 bundle: ' + bundleId);
}
