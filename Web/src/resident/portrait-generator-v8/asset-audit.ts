import { ACCESSORIES, HAIR_BUNDLES, VECTOR_LAYERS } from './catalog';
import type { HairStyleBundle, VectorLayerAsset } from './types';

export type HairBundleAudit = {
  bundleId: string;
  passed: boolean;
  errors: string[];
  localLayerCount: number;
  maskedLayerCount: number;
  compatibleHeadProfileCount: number;
  accessorySlotCount: number;
};

function layerMap() {
  return new Map(VECTOR_LAYERS.map((layer)=>[layer.id,layer]));
}

function auditLayer(layer: VectorLayerAsset, errors: string[]) {
  if (layer.coordinateSpace !== 'anchor-local') errors.push(layer.id+':not-anchor-local');
  if (!layer.anchor) errors.push(layer.id+':missing-anchor');

  if (layer.slot === 'back-hair' && layer.maskMode !== 'behind-head') {
    errors.push(layer.id+':back-hair-mask');
  }
  if (layer.slot === 'front-hair' && layer.maskMode !== 'inside-skull') {
    errors.push(layer.id+':front-hair-mask');
  }
  if (layer.slot === 'side-hair' && layer.maskMode !== 'outside-face') {
    errors.push(layer.id+':side-hair-mask');
  }

  const isPrimarySilhouette = layer.slot === 'back-hair' || layer.slot === 'front-hair';
  const isOptionalDetail = layer.id.includes('.detail') || layer.id.includes('.coil');
  if (isPrimarySilhouette && !isOptionalDetail && !layer.lods.includes(48)) {
    errors.push(layer.id+':missing-48-lod');
  }
}

function auditAccessorySlots(bundle: HairStyleBundle, errors: string[]) {
  for (const accessoryId of bundle.accessorySlots) {
    const accessory = ACCESSORIES.find((item)=>item.id===accessoryId);
    if (!accessory) {
      errors.push('missing-accessory:'+accessoryId);
      continue;
    }
    if (!accessory.compatibleHairBundles.includes(bundle.id)) {
      errors.push('accessory-not-compatible:'+accessoryId);
    }
    if (accessory.layerAssetId && !accessory.placementByHairBundle?.[bundle.id]) {
      errors.push('accessory-missing-placement:'+accessoryId);
    }
  }
}

export function auditHairBundle(bundle: HairStyleBundle): HairBundleAudit {
  const layers = layerMap();
  const errors: string[] = [];

  for (const headProfileId of bundle.compatibleHeadProfiles) {
    if (!(headProfileId in bundle.placementByHeadProfile)) {
      errors.push('missing-placement:'+headProfileId);
    }
  }

  let localLayerCount = 0;
  let maskedLayerCount = 0;
  const resolvedLayers: VectorLayerAsset[] = [];

  for (const layerId of bundle.layerAssetIds) {
    const layer = layers.get(layerId);
    if (!layer) {
      errors.push('missing-layer:'+layerId);
      continue;
    }
    resolvedLayers.push(layer);
    if (layer.coordinateSpace === 'anchor-local') localLayerCount += 1;
    if (layer.maskMode && layer.maskMode !== 'none') maskedLayerCount += 1;
    auditLayer(layer, errors);
  }

  if (!resolvedLayers.some((layer)=>layer.slot==='back-hair')) errors.push('missing-back-hair');
  if (!resolvedLayers.some((layer)=>layer.slot==='front-hair')) errors.push('missing-front-hair');

  auditAccessorySlots(bundle, errors);

  return {
    bundleId: bundle.id,
    passed: errors.length===0,
    errors,
    localLayerCount,
    maskedLayerCount,
    compatibleHeadProfileCount: bundle.compatibleHeadProfiles.length,
    accessorySlotCount: bundle.accessorySlots.length,
  };
}

export function auditAllHairBundles() {
  return HAIR_BUNDLES.map(auditHairBundle);
}

export function assertHairBundleContracts() {
  const audits = auditAllHairBundles();
  const failures = audits.filter((audit)=>!audit.passed);
  if (failures.length) {
    throw new Error('V8.2 Hair Bundle contract failed: '+JSON.stringify(failures));
  }
  return audits;
}
