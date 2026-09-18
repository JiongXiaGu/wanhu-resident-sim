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
      skull: 'M38 50 Q38 27 60 25 Q82 27 82 50 Q77 36 60 34 Q43 36 38 50Z',
      faceKeepout: 'M41 43 Q60 31 79 43 L77 77 Q60 88 43 77Z',
      behindHead: 'M25 18 H96 V132 H25Z',
      earFrontLeft: 'M33 47 H46 V70 H33Z',
      earFrontRight: 'M74 47 H87 V70 H74Z',
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
      skull: 'M39 49 Q39 22 60 19 Q81 22 81 49 Q76 33 60 31 Q44 33 39 49Z',
      faceKeepout: 'M41 40 Q60 28 79 40 L77 81 Q60 92 43 81Z',
      behindHead: 'M24 16 H98 V132 H24Z',
      earFrontLeft: 'M33 46 H46 V70 H33Z',
      earFrontRight: 'M74 46 H87 V70 H74Z',
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
      crownBack: { x: 67, y: 26 }, bunLow: { x: 80, y: 72 }, occipitalLeft: { x: 45, y: 59 }, occipitalRight: { x: 75, y: 59 },
      nape: { x: 60, y: 98 }, shoulderBackLeft: { x: 29, y: 108 }, shoulderBackRight: { x: 91, y: 108 },
    },
    masks: {
      skull: 'M38 50 Q38 22 60 19 Q82 22 82 50 Q77 33 60 31 Q43 33 38 50Z',
      faceKeepout: 'M40 40 Q60 28 80 40 L78 84 Q60 96 42 84Z',
      behindHead: 'M24 16 H101 V134 H24Z',
      earFrontLeft: 'M32 47 H46 V72 H32Z',
      earFrontRight: 'M74 47 H88 V72 H74Z',
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
      crownBack: { x: 67, y: 29 }, bunLow: { x: 79, y: 75 }, occipitalLeft: { x: 46, y: 61 }, occipitalRight: { x: 74, y: 61 },
      nape: { x: 60, y: 102 }, shoulderBackLeft: { x: 31, y: 110 }, shoulderBackRight: { x: 89, y: 110 },
    },
    masks: {
      skull: 'M40 52 Q40 26 60 22 Q80 26 80 52 Q75 36 60 34 Q45 36 40 52Z',
      faceKeepout: 'M42 43 Q60 31 78 43 L76 87 Q60 100 44 87Z',
      behindHead: 'M26 20 H99 V136 H26Z',
      earFrontLeft: 'M34 49 H47 V74 H34Z',
      earFrontRight: 'M73 49 H86 V74 H73Z',
    },
  },
];

export const VECTOR_LAYERS: VectorLayerAsset[] = [
  // Face geometry remains canvas-space. Identity morphology is applied by RenderPlan.
  { id:'layer.face.child', slot:'face', z:40, lods:[48,64,96], shapes:[
    { kind:'path', d:'M60 30 C47 29 41 38 41 53 C41 68 47 78 54 82 Q60 86 66 82 C73 77 79 68 79 53 C79 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.youth', slot:'face', z:40, lods:[48,64,96], shapes:[
    { kind:'path', d:'M60 24 C47 24 41 34 41 50 C41 66 46 80 54 87 Q60 91 66 87 C74 80 79 66 79 50 C79 34 73 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.adult', slot:'face', z:40, lods:[48,64,96], shapes:[
    { kind:'path', d:'M60 24 C46 24 40 35 40 51 C40 68 46 82 53 90 Q60 95 67 90 C74 82 80 68 80 51 C80 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.elder', slot:'face', z:40, lods:[48,64,96], shapes:[
    { kind:'path', d:'M60 27 C47 27 41 37 41 53 C41 70 46 85 53 94 Q60 99 67 94 C74 85 79 70 79 53 C79 37 73 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},

  // Split facial features so IdentityMorphology can survive age changes.
  { id:'layer.feature.soft-a.eyes', slot:'face-detail', z:50, lods:[48,64,96], shapes:[
    { kind:'path', d:'M45 51 Q50 48 55 51', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M65 51 Q70 48 75 51', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M46 45 Q50 43 55 45', stroke:'ink', strokeWidth:1.9 },
    { kind:'path', d:'M65 45 Q70 43 74 45', stroke:'ink', strokeWidth:1.9 },
  ]},
  { id:'layer.feature.soft-a.nose', slot:'face-detail', z:51, lods:[48,64,96], shapes:[
    { kind:'path', d:'M59 54 Q58 63 60 66 Q62 67 65 65', stroke:'ink', strokeWidth:1.1 },
  ]},
  { id:'layer.feature.soft-a.mouth', slot:'face-detail', z:52, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54 74 Q60 77 66 74', stroke:'ink', strokeWidth:1.35 },
  ]},
  { id:'layer.feature.soft-a.96-detail', slot:'face-detail', z:53, lods:[96], shapes:[
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

  // Local-space hair assets. (0,0) is the declared anchor from HeadProfile.
  { id:'layer.hair.girl-double-bun.back', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-15 8 C-16 4 -14 0 -11 -2 C-8 -4 -5 -2 -5 1 C-5 4 -7 6 -10 8 C-12 9 -14 9 -15 8Z', fill:'hair', stroke:'ink', strokeWidth:.78 },
    { kind:'path', d:'M15 8 C16 4 14 0 11 -2 C8 -4 5 -2 5 1 C5 4 7 6 10 8 C12 9 14 9 15 8Z', fill:'hair', stroke:'ink', strokeWidth:.78 },
    { kind:'path', d:'M-12 8 C-10 11 -7 14 -4 16 C-7 15 -11 14 -14 11Z', fill:'hair' },
    { kind:'path', d:'M12 8 C10 11 7 14 4 16 C7 15 11 14 14 11Z', fill:'hair' },
  ]},
  { id:'layer.hair.girl-double-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-20 21 Q-18 8 -8 3 Q-3 1 0 3 Q3 1 8 3 Q18 8 20 21 Q10 14 2 13 Q0 12 -2 13 Q-10 14 -20 21Z', fill:'hair' },
  ]},
  { id:'layer.hair.girl-double-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-16 18 Q-16.5 22 -15 25', stroke:'hair', strokeWidth:1, opacity:.9 },
    { kind:'path', d:'M16 18 Q16.5 22 15 25', stroke:'hair', strokeWidth:1, opacity:.9 },
  ]},

  { id:'layer.hair.youth-halfbound.back', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M3 5 C5 1 9 0 12 3 C15 6 14 10 11 12 C7 14 3 12 2 9Z', fill:'hair', stroke:'ink', strokeWidth:.8 },
    { kind:'path', d:'M-13 22 C-16 35 -15 49 -13 63 C-12 76 -9 88 -5 96 C-2 101 2 102 5 98 C8 90 9 79 8 66 C7 50 10 36 14 25 C11 21 7 19 2 18 C-4 17 -10 19 -13 22Z', fill:'hair', stroke:'ink', strokeWidth:.9 },
  ]},
  { id:'layer.hair.youth-halfbound.detail', slot:'back-hair', z:11, lods:[96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-9 30 C-10 48 -8 68 -4 86', stroke:'hair-accent', strokeWidth:.5, opacity:.18 },
    { kind:'path', d:'M8 30 C7 48 7 67 4 86', stroke:'hair-accent', strokeWidth:.45, opacity:.14 },
  ]},
  { id:'layer.hair.youth-halfbound.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-20 24 Q-17 6 0 2 Q17 6 20 24 Q11 16 2 15 Q0 14 -2 15 Q-11 15 -20 24Z', fill:'hair' },
  ]},
  { id:'layer.hair.youth-halfbound.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-15.5 22 Q-16 26 -14.5 29', stroke:'hair', strokeWidth:.9, opacity:.9 },
    { kind:'path', d:'M15.5 22 Q16 26.5 14.5 29.5', stroke:'hair', strokeWidth:.9, opacity:.9 },
  ]},

  // Low bun has an explicit bridge back into the head mass, so it cannot read as a detached circle.
  { id:'layer.hair.adult-low-bun.back', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-22 -44 C-15 -39 -11 -31 -9 -21 C-8 -14 -9 -8 -12 -3 C-10 -3 -8 -2 -6 0 C-4 -4 0 -6 5 -6 C10 -6 13 -3 13 1 C13 5 10 8 6 9 C2 10 -2 9 -5 6 C-9 6 -14 4 -18 1 C-14 -10 -15 -29 -22 -44Z', fill:'hair' },
    { kind:'path', d:'M-22 -44 C-15 -39 -11 -31 -9 -21 C-8 -14 -9 -8 -12 -3', stroke:'ink', strokeWidth:.9 },
    { kind:'path', d:'M-5 0 C-3 -4 1 -6 5 -6 C10 -6 13 -3 13 1 C13 5 10 8 6 9', stroke:'ink', strokeWidth:.85 },
  ]},
  { id:'layer.hair.adult-low-bun.coil', slot:'back-hair', z:11, lods:[64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M2 -3 C6 -5 10 -3 10 0 C9 2 7 3 5 3', stroke:'hair-accent', strokeWidth:.5, opacity:.16 },
  ]},
  { id:'layer.hair.adult-low-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-20 24 Q-18 8 0 3 Q18 8 20 24 Q11 16 4 16 Q1 13 0 9 Q-1 13 -4 16 Q-11 15 -20 24Z', fill:'hair' },
    { kind:'path', d:'M0 4 Q-1 10 -4 15', stroke:'hair-accent', strokeWidth:.45, opacity:.15 },
  ]},
  { id:'layer.hair.adult-low-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-15.5 23 Q-16 27 -14.5 30', stroke:'hair', strokeWidth:.9, opacity:.92 },
    { kind:'path', d:'M15.5 23 Q16 27 14.5 30', stroke:'hair', strokeWidth:.9, opacity:.92 },
  ]},

  { id:'layer.hair.elder-gray-bun.back', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-18 -40 C-12 -35 -9 -27 -8 -18 C-8 -12 -10 -7 -12 -3 C-10 -3 -8 -2 -6 0 C-4 -3 0 -5 4 -5 C8 -5 11 -2 11 1 C11 4 8 7 5 8 C1 9 -2 7 -5 4 C-9 5 -13 3 -16 0 C-13 -10 -14 -27 -18 -40Z', fill:'hair' },
    { kind:'path', d:'M-18 -40 C-12 -35 -9 -27 -8 -18 C-8 -12 -10 -7 -12 -3', stroke:'ink', strokeWidth:.78 },
    { kind:'path', d:'M-5 0 C-3 -3 0 -5 4 -5 C8 -5 11 -2 11 1 C11 4 8 7 5 8', stroke:'ink', strokeWidth:.72 },
  ]},
  { id:'layer.hair.elder-gray-bun.coil', slot:'back-hair', z:11, lods:[64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M2 -2 C5 -4 8 -3 8 0 C7 2 6 2 4 3', stroke:'hair-accent', strokeWidth:.42, opacity:.12 },
  ]},
  { id:'layer.hair.elder-gray-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-17 26 Q-14 12 0 7 Q14 12 17 26 Q10 18 4 18 Q1 15 0 11 Q-1 15 -4 18 Q-10 17 -17 26Z', fill:'hair' },
  ]},
  { id:'layer.hair.elder-gray-bun.detail', slot:'front-hair', z:71, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M0 8 Q-1 13 -4 17', stroke:'hair-accent', strokeWidth:.42, opacity:.12 },
    { kind:'path', d:'M4 13 Q8 14 11 16', stroke:'hair-accent', strokeWidth:.38, opacity:.1 },
  ]},
  { id:'layer.hair.elder-gray-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-14 24 Q-14.5 27.5 -13 30', stroke:'hair', strokeWidth:.75, opacity:.82 },
    { kind:'path', d:'M14 24 Q14.5 27.5 13 30', stroke:'hair', strokeWidth:.75, opacity:.82 },
  ]},

  // Accessories use local coordinates; their final anchor comes from AccessoryAsset placement.
  { id:'layer.accessory.red-cord', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'path', d:'M-15 8 Q-11 10 -7 8 M7 8 Q11 10 15 8', stroke:'accent', strokeWidth:1.35 },
    { kind:'line', x1:-11, y1:7, x2:-11, y2:11, stroke:'accent', strokeWidth:1 },
    { kind:'line', x1:11, y1:7, x2:11, y2:11, stroke:'accent', strokeWidth:1 },
  ]},
  { id:'layer.accessory.cloth-knot', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'path', d:'M0 2 C-3 -1 -7 0 -8 3 C-6 6 -3 5 0 3Z M0 2 C3 -1 7 0 8 3 C6 6 3 5 0 3Z', fill:'accent', stroke:'ink', strokeWidth:.55 },
    { kind:'circle', cx:0, cy:2.5, r:1.2, fill:'accent', stroke:'ink', strokeWidth:.45 },
  ]},
  { id:'layer.accessory.wood-pin', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'line', x1:-2, y1:-4, x2:9, y2:1.5, stroke:'accent', strokeWidth:1.2 },
  ]},
  { id:'layer.accessory.jade-pin', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'line', x1:-2, y1:-4, x2:9, y2:1.5, stroke:'accent', strokeWidth:1.15 },
    { kind:'circle', cx:10, cy:1.8, r:1.35, fill:'accent' },
  ]},
];

export const HAIR_BUNDLES: HairStyleBundle[] = [
  {
    id:'hair.female.girl-double-bun.v1', label:'女童双小髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['child','teen'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.child.v1'], silhouetteType:'double-crown-bun',
    baseWeight:1, targetShare:.18,
    layerAssetIds:['layer.hair.girl-double-bun.back','layer.hair.girl-double-bun.front','layer.hair.girl-double-bun.side'],
    placementByHeadProfile:{'head.female.soft-oval.child.v1':{translateY:0}}, accessorySlots:['accessory.red-cord'],
  },
  {
    id:'hair.female.young-halfbound-backfall.v1', label:'少女半束后披', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['young-adult','adult'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.youth.v1','head.female.soft-oval.adult.v1'], silhouetteType:'halfbound-backfall',
    baseWeight:1, targetShare:.28,
    layerAssetIds:['layer.hair.youth-halfbound.back','layer.hair.youth-halfbound.detail','layer.hair.youth-halfbound.front','layer.hair.youth-halfbound.side'],
    placementByHeadProfile:{
      'head.female.soft-oval.youth.v1':{translateY:0},
      'head.female.soft-oval.adult.v1':{translateY:1,scaleX:1.02},
    },
    accessorySlots:['accessory.cloth-knot','accessory.wood-pin'],
  },
  {
    id:'hair.female.adult-low-bun.v1', label:'成年低髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['adult','middle-age','elder'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.adult.v1','head.female.soft-oval.elder.v1'], silhouetteType:'adult-low-bun',
    baseWeight:1, targetShare:.32,
    layerAssetIds:['layer.hair.adult-low-bun.back','layer.hair.adult-low-bun.coil','layer.hair.adult-low-bun.front','layer.hair.adult-low-bun.side'],
    placementByHeadProfile:{
      'head.female.soft-oval.adult.v1':{translateX:-5,translateY:3},
      'head.female.soft-oval.elder.v1':{translateX:-5,translateY:3,scaleX:.90,scaleY:.90},
    },
    accessorySlots:['accessory.wood-pin','accessory.jade-pin'],
  },
  {
    id:'hair.female.elder-gray-low-bun.v1', label:'老年花白低髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['middle-age','elder'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.adult.v1','head.female.soft-oval.elder.v1'], silhouetteType:'elder-gray-low-bun',
    baseWeight:1, targetShare:.22,
    layerAssetIds:['layer.hair.elder-gray-bun.back','layer.hair.elder-gray-bun.coil','layer.hair.elder-gray-bun.front','layer.hair.elder-gray-bun.detail','layer.hair.elder-gray-bun.side'],
    placementByHeadProfile:{
      'head.female.soft-oval.adult.v1':{translateX:-5,translateY:2,scaleX:.92,scaleY:.92},
      'head.female.soft-oval.elder.v1':{translateX:-5,translateY:3,scaleX:.86,scaleY:.86},
    },
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
  {
    id:'accessory.none', label:'无', genders:['female'],
    lifeStages:['child','teen','young-adult','adult','middle-age','elder'],
    wealthTiers:['poor','plain','comfortable','wealthy'],
    compatibleHairBundles:HAIR_BUNDLES.map((item)=>item.id), baseWeight:4,
  },
  {
    id:'accessory.red-cord', label:'红绳', genders:['female'], lifeStages:['child','teen'],
    wealthTiers:['poor','plain','comfortable'], compatibleHairBundles:['hair.female.girl-double-bun.v1'],
    layerAssetId:'layer.accessory.red-cord',
    placementByHairBundle:{'hair.female.girl-double-bun.v1':{anchor:'skullTop',transform:{translateY:0}}},
    baseWeight:3,
  },
  {
    id:'accessory.cloth-knot', label:'布结', genders:['female'], lifeStages:['young-adult','adult'],
    wealthTiers:['poor','plain','comfortable'], compatibleHairBundles:['hair.female.young-halfbound-backfall.v1'],
    layerAssetId:'layer.accessory.cloth-knot',
    placementByHairBundle:{'hair.female.young-halfbound-backfall.v1':{anchor:'crownBack',transform:{translateX:5,translateY:-2}}},
    baseWeight:2,
  },
  {
    id:'accessory.wood-pin', label:'木簪', genders:['female'], lifeStages:['young-adult','adult','middle-age','elder'],
    wealthTiers:['plain','comfortable','wealthy'],
    compatibleHairBundles:['hair.female.young-halfbound-backfall.v1','hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'],
    layerAssetId:'layer.accessory.wood-pin',
    placementByHairBundle:{
      'hair.female.young-halfbound-backfall.v1':{anchor:'crownBack',transform:{translateX:1,translateY:2}},
      'hair.female.adult-low-bun.v1':{anchor:'bunLow',transform:{translateX:6,translateY:-5}},
      'hair.female.elder-gray-low-bun.v1':{anchor:'bunLow',transform:{translateX:6,translateY:-5}},
    },
    baseWeight:2,
  },
  {
    id:'accessory.jade-pin', label:'玉簪', genders:['female'], lifeStages:['adult','middle-age','elder'],
    wealthTiers:['comfortable','wealthy'],
    compatibleHairBundles:['hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'],
    layerAssetId:'layer.accessory.jade-pin',
    placementByHairBundle:{
      'hair.female.adult-low-bun.v1':{anchor:'bunLow',transform:{translateX:6,translateY:-5}},
      'hair.female.elder-gray-low-bun.v1':{anchor:'bunLow',transform:{translateX:6,translateY:-5}},
    },
    baseWeight:1,
  },
];

export const FACE_LAYER_BY_HEAD_PROFILE: Record<string,string> = {
  'head.female.soft-oval.child.v1':'layer.face.child',
  'head.female.soft-oval.youth.v1':'layer.face.youth',
  'head.female.soft-oval.adult.v1':'layer.face.adult',
  'head.female.soft-oval.elder.v1':'layer.face.elder',
};

export const FEATURE_LAYER_BY_SET: Record<string,string[]> = {
  'feature-set.female.soft-a':[
    'layer.feature.soft-a.eyes',
    'layer.feature.soft-a.nose',
    'layer.feature.soft-a.mouth',
    'layer.feature.soft-a.96-detail',
  ],
};

export const AGE_LAYER_BY_ID: Record<string,string[]> = {
  'age.none':[],
  'age.middle-soft':[],
  'age.elder-lines':['layer.age.elder'],
};

export function layerById(id:string) {
  const layer = VECTOR_LAYERS.find((item)=>item.id===id);
  if (!layer) throw new Error('Unknown V8.1 vector layer: '+id);
  return layer;
}
