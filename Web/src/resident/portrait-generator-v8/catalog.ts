import type {
  AccessoryAsset,
  HairStyleBundle,
  HeadProfileDefinition,
  OutfitBundle,
  VectorLayerAsset,
} from './types';

export const FACE_FAMILY_ID = 'face-family.female.soft-oval-a';

export const HEAD_PROFILES: HeadProfileDefinition[] = [
  {
    id: 'head.female.soft-oval.child.v1',
    faceFamilyId: FACE_FAMILY_ID,
    gender: 'female',
    lifeStages: ['child', 'teen'],
    width: 40, topY: 30, chinY: 82, jawWidth: 34,
    anchors: {
      skullTop: { x: 60, y: 27 }, templeLeft: { x: 42, y: 43 }, templeRight: { x: 78, y: 43 },
      earLeft: { x: 38, y: 55 }, earRight: { x: 82, y: 55 }, jawLeft: { x: 46, y: 72 }, jawRight: { x: 74, y: 72 },
      chin: { x: 60, y: 82 }, neckLeft: { x: 55, y: 80 }, neckRight: { x: 65, y: 80 },
      crownBack: { x: 66, y: 30 }, bunLow: { x: 82, y: 69 }, occipitalLeft: { x: 47, y: 57 }, occipitalRight: { x: 73, y: 57 },
      nape: { x: 60, y: 88 }, shoulderBackLeft: { x: 35, y: 105 }, shoulderBackRight: { x: 85, y: 105 },
    },
    masks: {
      skull: 'M39 49 Q39 29 60 27 Q81 29 81 49 Q76 37 60 35 Q44 37 39 49Z',
      faceKeepout: 'M42 44 Q60 32 78 44 L76 76 Q60 88 44 76Z',
      behindHead: 'M34 32 H86 V122 H34Z',
      earFrontLeft: 'M34 48 H44 V67 H34Z',
      earFrontRight: 'M76 48 H86 V67 H76Z',
    },
  },
  {
    id: 'head.female.soft-oval.youth.v1',
    faceFamilyId: FACE_FAMILY_ID,
    gender: 'female',
    lifeStages: ['young-adult'],
    width: 39, topY: 24, chinY: 88, jawWidth: 29,
    anchors: {
      skullTop: { x: 60, y: 21 }, templeLeft: { x: 43, y: 39 }, templeRight: { x: 77, y: 39 },
      earLeft: { x: 39, y: 55 }, earRight: { x: 81, y: 55 }, jawLeft: { x: 47, y: 77 }, jawRight: { x: 73, y: 77 },
      chin: { x: 60, y: 88 }, neckLeft: { x: 55, y: 85 }, neckRight: { x: 65, y: 85 },
      crownBack: { x: 67, y: 25 }, bunLow: { x: 82, y: 69 }, occipitalLeft: { x: 46, y: 58 }, occipitalRight: { x: 74, y: 58 },
      nape: { x: 60, y: 94 }, shoulderBackLeft: { x: 31, y: 106 }, shoulderBackRight: { x: 89, y: 106 },
    },
    masks: {
      skull: 'M40 48 Q40 24 60 21 Q80 24 80 48 Q75 34 60 32 Q45 34 40 48Z',
      faceKeepout: 'M42 40 Q60 29 78 40 L76 80 Q60 92 44 80Z',
      behindHead: 'M29 20 H91 V126 H29Z',
      earFrontLeft: 'M34 47 H45 V69 H34Z',
      earFrontRight: 'M75 47 H86 V69 H75Z',
    },
  },
  {
    id: 'head.female.soft-oval.adult.v1',
    faceFamilyId: FACE_FAMILY_ID,
    gender: 'female',
    lifeStages: ['adult', 'middle-age'],
    width: 40, topY: 24, chinY: 92, jawWidth: 31,
    anchors: {
      skullTop: { x: 60, y: 21 }, templeLeft: { x: 42, y: 40 }, templeRight: { x: 78, y: 40 },
      earLeft: { x: 38, y: 56 }, earRight: { x: 82, y: 56 }, jawLeft: { x: 46, y: 80 }, jawRight: { x: 74, y: 80 },
      chin: { x: 60, y: 92 }, neckLeft: { x: 54, y: 88 }, neckRight: { x: 66, y: 88 },
      crownBack: { x: 67, y: 26 }, bunLow: { x: 85, y: 69 }, occipitalLeft: { x: 45, y: 59 }, occipitalRight: { x: 75, y: 59 },
      nape: { x: 60, y: 98 }, shoulderBackLeft: { x: 29, y: 108 }, shoulderBackRight: { x: 91, y: 108 },
    },
    masks: {
      skull: 'M39 49 Q39 24 60 21 Q81 24 81 49 Q76 34 60 32 Q44 34 39 49Z',
      faceKeepout: 'M41 41 Q60 29 79 41 L77 83 Q60 96 43 83Z',
      behindHead: 'M27 20 H93 V130 H27Z',
      earFrontLeft: 'M33 48 H45 V70 H33Z',
      earFrontRight: 'M75 48 H87 V70 H75Z',
    },
  },
  {
    id: 'head.female.soft-oval.elder.v1',
    faceFamilyId: FACE_FAMILY_ID,
    gender: 'female',
    lifeStages: ['elder'],
    width: 38, topY: 27, chinY: 96, jawWidth: 28,
    anchors: {
      skullTop: { x: 60, y: 24 }, templeLeft: { x: 43, y: 42 }, templeRight: { x: 77, y: 42 },
      earLeft: { x: 39, y: 58 }, earRight: { x: 81, y: 58 }, jawLeft: { x: 48, y: 83 }, jawRight: { x: 72, y: 83 },
      chin: { x: 60, y: 96 }, neckLeft: { x: 55, y: 91 }, neckRight: { x: 65, y: 91 },
      crownBack: { x: 67, y: 29 }, bunLow: { x: 84, y: 72 }, occipitalLeft: { x: 46, y: 61 }, occipitalRight: { x: 74, y: 61 },
      nape: { x: 60, y: 102 }, shoulderBackLeft: { x: 31, y: 110 }, shoulderBackRight: { x: 89, y: 110 },
    },
    masks: {
      skull: 'M41 51 Q41 28 60 24 Q79 28 79 51 Q74 37 60 35 Q46 37 41 51Z',
      faceKeepout: 'M43 43 Q60 32 77 43 L75 86 Q60 100 45 86Z',
      behindHead: 'M29 23 H91 V132 H29Z',
      earFrontLeft: 'M34 50 H46 V72 H34Z',
      earFrontRight: 'M74 50 H86 V72 H74Z',
    },
  },
];

export const VECTOR_LAYERS: VectorLayerAsset[] = [
  { id: 'layer.face.child', slot: 'face', z: 40, lods: [48,64,96], shapes: [
    { kind:'path', d:'M60 30 C47 29 41 38 41 53 C41 68 47 78 54 82 Q60 86 66 82 C73 77 79 68 79 53 C79 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id: 'layer.face.youth', slot: 'face', z: 40, lods: [48,64,96], shapes: [
    { kind:'path', d:'M60 24 C47 24 41 34 41 50 C41 66 46 80 54 87 Q60 91 66 87 C74 80 79 66 79 50 C79 34 73 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id: 'layer.face.adult', slot: 'face', z: 40, lods: [48,64,96], shapes: [
    { kind:'path', d:'M60 24 C46 24 40 35 40 51 C40 68 46 82 53 90 Q60 95 67 90 C74 82 80 68 80 51 C80 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id: 'layer.face.elder', slot: 'face', z: 40, lods: [48,64,96], shapes: [
    { kind:'path', d:'M60 27 C47 27 41 37 41 53 C41 70 46 85 53 94 Q60 99 67 94 C74 85 79 70 79 53 C79 37 73 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id: 'layer.feature.soft-a', slot: 'face-detail', z: 50, lods: [48,64,96], shapes: [
    { kind:'path', d:'M45 51 Q50 48 55 51', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M65 51 Q70 48 75 51', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M46 45 Q50 43 55 45', stroke:'ink', strokeWidth:1.9 },
    { kind:'path', d:'M65 45 Q70 43 74 45', stroke:'ink', strokeWidth:1.9 },
    { kind:'path', d:'M59 54 Q58 63 60 66 Q62 67 65 65', stroke:'ink', strokeWidth:1.1 },
    { kind:'path', d:'M54 74 Q60 77 66 74', stroke:'ink', strokeWidth:1.35 },
  ]},
  { id: 'layer.feature.soft-a.96-detail', slot: 'face-detail', z: 51, lods: [96], shapes: [
    { kind:'circle', cx:50, cy:51, r:.6, fill:'ink' },
    { kind:'circle', cx:70, cy:51, r:.6, fill:'ink' },
  ]},
  { id:'layer.age.elder', slot:'age-overlay', z:55, lods:[64,96], shapes:[
    { kind:'path', d:'M43 61 Q48 64 52 62', stroke:'age', strokeWidth:.8, opacity:.5 },
    { kind:'path', d:'M68 62 Q72 64 77 61', stroke:'age', strokeWidth:.8, opacity:.5 },
    { kind:'path', d:'M47 76 Q50 82 53 85', stroke:'age', strokeWidth:.75, opacity:.45 },
    { kind:'path', d:'M73 76 Q70 82 67 85', stroke:'age', strokeWidth:.75, opacity:.45 },
  ]},
  { id:'layer.outfit.poor', slot:'outfit', z:20, lods:[48,64,96], shapes:[
    { kind:'path', d:'M18 150 Q21 110 46 94 H74 Q99 110 102 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M48 94 L60 108 L72 94', stroke:'accent', strokeWidth:3.2 },
  ]},
  { id:'layer.outfit.plain', slot:'outfit', z:20, lods:[48,64,96], shapes:[
    { kind:'path', d:'M16 150 Q20 108 45 93 H75 Q100 108 104 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 93 L60 110 L73 93', stroke:'accent', strokeWidth:4.1 },
  ]},
  { id:'layer.outfit.comfortable', slot:'outfit', z:20, lods:[48,64,96], shapes:[
    { kind:'path', d:'M15 150 Q19 107 45 92 H75 Q101 107 105 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M46 92 L60 111 L74 92', stroke:'accent', strokeWidth:5 },
    { kind:'path', d:'M39 107 Q60 120 81 107', stroke:'accent', strokeWidth:1.8, opacity:.8 },
  ]},
  { id:'layer.outfit.wealthy', slot:'outfit', z:20, lods:[48,64,96], shapes:[
    { kind:'path', d:'M14 150 Q18 106 45 91 H75 Q102 106 106 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M45 91 L60 112 L75 91', stroke:'accent', strokeWidth:5.8 },
    { kind:'path', d:'M38 105 Q60 121 82 105', stroke:'accent', strokeWidth:2.3 },
    { kind:'path', d:'M33 118 Q60 131 87 118', stroke:'accent', strokeWidth:1.25, opacity:.75 },
  ]},
  { id:'layer.hair.girl-double-bun.back', slot:'back-hair', z:10, lods:[48,64,96], shapes:[
    { kind:'ellipse', cx:49, cy:31, rx:6.2, ry:5.2, fill:'hair', stroke:'ink', strokeWidth:1 },
    { kind:'ellipse', cx:71, cy:31, rx:6.2, ry:5.2, fill:'hair', stroke:'ink', strokeWidth:1 },
  ]},
  { id:'layer.hair.girl-double-bun.front', slot:'front-hair', z:70, lods:[48,64,96], shapes:[
    { kind:'path', d:'M40 46 Q43 30 60 28 Q77 30 80 46 Q69 38 60 38 Q51 36 40 46Z', fill:'hair' },
  ]},
  { id:'layer.hair.girl-double-bun.side', slot:'side-hair', z:60, lods:[64,96], shapes:[
    { kind:'path', d:'M44 44 Q42 57 47 68', stroke:'hair', strokeWidth:2.8 },
    { kind:'path', d:'M76 44 Q78 57 73 68', stroke:'hair', strokeWidth:2.8 },
  ]},
  { id:'layer.hair.youth-halfbound.back', slot:'back-hair', z:10, lods:[48,64,96], shapes:[
    { kind:'ellipse', cx:67, cy:28, rx:6.5, ry:5.2, fill:'hair' },
    { kind:'path', d:'M45 45 C36 70 35 101 42 121 Q60 128 78 121 C85 101 84 70 75 45 Q60 34 45 45Z', fill:'hair', stroke:'ink', strokeWidth:1.1 },
  ]},
  { id:'layer.hair.youth-halfbound.front', slot:'front-hair', z:70, lods:[48,64,96], shapes:[
    { kind:'path', d:'M40 45 Q43 26 60 23 Q77 26 80 45 Q70 36 60 37 Q50 34 40 45Z', fill:'hair' },
  ]},
  { id:'layer.hair.youth-halfbound.side', slot:'side-hair', z:60, lods:[64,96], shapes:[
    { kind:'path', d:'M44 43 Q41 58 47 73', stroke:'hair', strokeWidth:2.6 },
    { kind:'path', d:'M76 43 Q79 58 73 73', stroke:'hair', strokeWidth:2.6 },
  ]},
  { id:'layer.hair.adult-low-bun.back', slot:'back-hair', z:10, lods:[48,64,96], shapes:[
    { kind:'ellipse', cx:84, cy:70, rx:8.2, ry:6.8, fill:'hair', stroke:'ink', strokeWidth:1.1 },
  ]},
  { id:'layer.hair.adult-low-bun.front', slot:'front-hair', z:70, lods:[48,64,96], shapes:[
    { kind:'path', d:'M40 46 Q42 27 60 24 Q78 27 80 46 Q69 36 60 37 Q51 34 40 46Z', fill:'hair' },
  ]},
  { id:'layer.hair.adult-low-bun.side', slot:'side-hair', z:60, lods:[64,96], shapes:[
    { kind:'path', d:'M44 45 Q42 58 48 68', stroke:'hair', strokeWidth:2.1 },
    { kind:'path', d:'M76 45 Q78 58 72 68', stroke:'hair', strokeWidth:2.1 },
  ]},
  { id:'layer.hair.elder-gray-bun.back', slot:'back-hair', z:10, lods:[48,64,96], shapes:[
    { kind:'ellipse', cx:83, cy:72, rx:7.4, ry:6, fill:'hair', stroke:'ink', strokeWidth:1 },
  ]},
  { id:'layer.hair.elder-gray-bun.front', slot:'front-hair', z:70, lods:[48,64,96], shapes:[
    { kind:'path', d:'M42 48 Q44 31 60 28 Q76 31 78 48 Q69 40 60 40 Q51 38 42 48Z', fill:'hair' },
  ]},
  { id:'layer.hair.elder-gray-bun.detail', slot:'front-hair', z:71, lods:[64,96], shapes:[
    { kind:'path', d:'M47 34 Q60 30 73 35', stroke:'accent', strokeWidth:.85, opacity:.55 },
  ]},
  { id:'layer.accessory.red-cord', slot:'accessory', z:80, lods:[64,96], shapes:[
    { kind:'path', d:'M43 32 Q49 36 55 32 M65 32 Q71 36 77 32', stroke:'accent', strokeWidth:1.5 },
  ]},
  { id:'layer.accessory.cloth-knot', slot:'accessory', z:80, lods:[64,96], shapes:[
    { kind:'path', d:'M64 27 L57 32 L64 34Z M70 27 L77 32 L70 34Z', fill:'accent', stroke:'ink', strokeWidth:.6 },
  ]},
  { id:'layer.accessory.wood-pin', slot:'accessory', z:80, lods:[64,96], shapes:[
    { kind:'line', x1:77, y1:65, x2:91, y2:70, stroke:'accent', strokeWidth:1.4 },
  ]},
  { id:'layer.accessory.jade-pin', slot:'accessory', z:80, lods:[64,96], shapes:[
    { kind:'line', x1:76, y1:67, x2:91, y2:71, stroke:'accent', strokeWidth:1.35 },
    { kind:'circle', cx:92, cy:71.2, r:1.7, fill:'accent' },
  ]},
];

export const HAIR_BUNDLES: HairStyleBundle[] = [
  {
    id:'hair.female.girl-double-bun.v1', label:'女童双小髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['child','teen'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.child.v1'], silhouetteType:'double-crown-bun',
    baseWeight:1, targetShare:.18,
    layerAssetIds:['layer.hair.girl-double-bun.back','layer.hair.girl-double-bun.front','layer.hair.girl-double-bun.side'],
    placementByHeadProfile:{'head.female.soft-oval.child.v1':{}}, accessorySlots:['accessory.red-cord'],
  },
  {
    id:'hair.female.young-halfbound-backfall.v1', label:'少女半束后披', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['young-adult','adult'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.youth.v1','head.female.soft-oval.adult.v1'], silhouetteType:'halfbound-backfall',
    baseWeight:1, targetShare:.28,
    layerAssetIds:['layer.hair.youth-halfbound.back','layer.hair.youth-halfbound.front','layer.hair.youth-halfbound.side'],
    placementByHeadProfile:{'head.female.soft-oval.youth.v1':{},'head.female.soft-oval.adult.v1':{translateY:1}},
    accessorySlots:['accessory.cloth-knot','accessory.wood-pin'],
  },
  {
    id:'hair.female.adult-low-bun.v1', label:'成年低髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['adult','middle-age'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.adult.v1'], silhouetteType:'adult-low-bun',
    baseWeight:1, targetShare:.32,
    layerAssetIds:['layer.hair.adult-low-bun.back','layer.hair.adult-low-bun.front','layer.hair.adult-low-bun.side'],
    placementByHeadProfile:{'head.female.soft-oval.adult.v1':{}}, accessorySlots:['accessory.wood-pin','accessory.jade-pin'],
  },
  {
    id:'hair.female.elder-gray-low-bun.v1', label:'老年花白低髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['middle-age','elder'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.adult.v1','head.female.soft-oval.elder.v1'], silhouetteType:'elder-gray-low-bun',
    baseWeight:1, targetShare:.22,
    layerAssetIds:['layer.hair.elder-gray-bun.back','layer.hair.elder-gray-bun.front','layer.hair.elder-gray-bun.detail'],
    placementByHeadProfile:{'head.female.soft-oval.adult.v1':{translateY:-1},'head.female.soft-oval.elder.v1':{}},
    accessorySlots:['accessory.wood-pin','accessory.jade-pin'],
  },
];

export const OUTFIT_BUNDLES: OutfitBundle[] = [
  { id:'outfit.poor.v1', label:'贫寒单层衣', wealthTiers:['poor'], presentationStyles:['practical','tidy'], layerAssetIds:['layer.outfit.poor'], baseWeight:1 },
  { id:'outfit.plain.v1', label:'普通双层衣', wealthTiers:['plain'], presentationStyles:['practical','tidy','refined'], layerAssetIds:['layer.outfit.plain'], baseWeight:1 },
  { id:'outfit.comfortable.v1', label:'殷实叠领衣', wealthTiers:['comfortable'], presentationStyles:['practical','tidy','refined'], layerAssetIds:['layer.outfit.comfortable'], baseWeight:1 },
  { id:'outfit.wealthy.v1', label:'富裕完整层领', wealthTiers:['wealthy'], presentationStyles:['tidy','refined'], layerAssetIds:['layer.outfit.wealthy'], baseWeight:1 },
];

export const ACCESSORIES: AccessoryAsset[] = [
  { id:'accessory.none', label:'无', genders:['female'], lifeStages:['child','teen','young-adult','adult','middle-age','elder'], wealthTiers:['poor','plain','comfortable','wealthy'], compatibleHairBundles:HAIR_BUNDLES.map((item)=>item.id), baseWeight:4 },
  { id:'accessory.red-cord', label:'红绳', genders:['female'], lifeStages:['child','teen'], wealthTiers:['poor','plain','comfortable'], compatibleHairBundles:['hair.female.girl-double-bun.v1'], layerAssetId:'layer.accessory.red-cord', baseWeight:3 },
  { id:'accessory.cloth-knot', label:'布结', genders:['female'], lifeStages:['young-adult','adult'], wealthTiers:['poor','plain','comfortable'], compatibleHairBundles:['hair.female.young-halfbound-backfall.v1'], layerAssetId:'layer.accessory.cloth-knot', baseWeight:2 },
  { id:'accessory.wood-pin', label:'木簪', genders:['female'], lifeStages:['young-adult','adult','middle-age','elder'], wealthTiers:['plain','comfortable','wealthy'], compatibleHairBundles:['hair.female.young-halfbound-backfall.v1','hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'], layerAssetId:'layer.accessory.wood-pin', baseWeight:2 },
  { id:'accessory.jade-pin', label:'玉簪', genders:['female'], lifeStages:['adult','middle-age','elder'], wealthTiers:['comfortable','wealthy'], compatibleHairBundles:['hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'], layerAssetId:'layer.accessory.jade-pin', baseWeight:1 },
];

export const FACE_LAYER_BY_HEAD_PROFILE: Record<string,string> = {
  'head.female.soft-oval.child.v1':'layer.face.child',
  'head.female.soft-oval.youth.v1':'layer.face.youth',
  'head.female.soft-oval.adult.v1':'layer.face.adult',
  'head.female.soft-oval.elder.v1':'layer.face.elder',
};

export const FEATURE_LAYER_BY_SET: Record<string,string[]> = {
  'feature-set.female.soft-a':['layer.feature.soft-a','layer.feature.soft-a.96-detail'],
};

export const AGE_LAYER_BY_ID: Record<string,string[]> = {
  'age.none':[],
  'age.middle-soft':[],
  'age.elder-lines':['layer.age.elder'],
};

export function layerById(id:string) {
  const layer = VECTOR_LAYERS.find((item)=>item.id===id);
  if (!layer) throw new Error('Unknown V8 vector layer: '+id);
  return layer;
}
