import type {
  AccessoryAsset,
  HairStyleBundle,
  HeadProfileDefinition,
  OutfitBundle,
  PortraitStageProfile,
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
      crownBack: { x: 67, y: 26 }, bunLow: { x: 68, y: 92 }, occipitalLeft: { x: 45, y: 59 }, occipitalRight: { x: 75, y: 59 },
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
      crownBack: { x: 67, y: 29 }, bunLow: { x: 67, y: 95 }, occipitalLeft: { x: 46, y: 61 }, occipitalRight: { x: 74, y: 61 },
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

export const PORTRAIT_STAGE_PROFILES: PortraitStageProfile[] = [
  {
    id:'stage.female.child.v1',
    lifeStages:['child','teen'],
    viewBox:{x:5,y:12,width:104,height:104},
    layerAssetIds:['layer.body.child','layer.neck.child','layer.stage-face.child'],
    backgroundColor:'#d7bf88',
    collarColor:'#a79b79',
    clothByWealth:{poor:'#7a6857',plain:'#748391',comfortable:'#60756b',wealthy:'#73585d'},
    featureTransforms:{
      'layer.face.child':{scaleX:1.04,scaleY:.97,originX:60,originY:56},
      'layer.feature.soft-a.eyes.child':{translateY:-1,scaleX:1.06,scaleY:1.08,originX:60,originY:49},
      'layer.feature.soft-a.brows.child':{translateY:-1,scaleX:1.04,originX:60,originY:45},
      'layer.feature.soft-a.96-detail':{translateY:-1,scaleX:1.06,scaleY:1.08,originX:60,originY:49},
      'layer.feature.soft-a.nose.child':{translateY:-1,scaleY:.92,originX:60,originY:54},
      'layer.feature.soft-a.mouth.child':{translateY:-1,scaleX:.92,originX:60,originY:74},
    },
    featureAssetOverrides:{
      'layer.feature.soft-a.eyes':'layer.feature.soft-a.eyes.child',
      'layer.feature.soft-a.brows':'layer.feature.soft-a.brows.child',
      'layer.feature.soft-a.nose':'layer.feature.soft-a.nose.child',
      'layer.feature.soft-a.mouth':'layer.feature.soft-a.mouth.child',
    },
  },
  {
    id:'stage.female.youth.v1',
    lifeStages:['young-adult'],
    viewBox:{x:-2,y:10,width:122,height:124},
    layerAssetIds:['layer.body.youth','layer.neck.youth'],
    backgroundColor:'#cdb17a',
    collarColor:'#a49a80',
    clothByWealth:{poor:'#75604f',plain:'#5f7880',comfortable:'#536f65',wealthy:'#70565c'},
    featureTransforms:{
      'layer.feature.soft-a.eyes':{translateY:-.5,scaleX:1.03,scaleY:1.02,originX:60,originY:49},
      'layer.feature.soft-a.brows.youth':{translateY:-.5,scaleX:1.02,originX:60,originY:45},
      'layer.feature.soft-a.96-detail':{translateY:-.5,scaleX:1.03,scaleY:1.02,originX:60,originY:49},
      'layer.feature.soft-a.nose':{scaleY:.92,originX:60,originY:54},
      'layer.feature.soft-a.mouth':{scaleX:.94,originX:60,originY:74},
    },
    featureAssetOverrides:{
      'layer.feature.soft-a.brows':'layer.feature.soft-a.brows.youth',
    },
  },
  {
    id:'stage.female.adult.v1',
    lifeStages:['adult'],
    viewBox:{x:0,y:15,width:120,height:120},
    layerAssetIds:['layer.body.adult','layer.neck.adult'],
    backgroundColor:'#ccb074',
    collarColor:'#a1987f',
    clothByWealth:{poor:'#76624f',plain:'#63717a',comfortable:'#4f6358',wealthy:'#6b5052'},
  },
  {
    id:'stage.female.middle.v1',
    lifeStages:['middle-age'],
    viewBox:{x:4,y:17,width:116,height:116},
    layerAssetIds:['layer.body.middle','layer.neck.middle','layer.stage-face.middle'],
    backgroundColor:'#bea26f',
    collarColor:'#968d77',
    clothByWealth:{poor:'#706153',plain:'#66706f',comfortable:'#59695d',wealthy:'#695455'},
    featureTransforms:{
      'layer.face.adult':{scaleX:.99,scaleY:1.015,originX:60,originY:60},
      'layer.feature.soft-a.eyes':{translateY:.8,scaleY:.94,originX:60,originY:49},
      'layer.feature.soft-a.brows.middle':{translateY:.8,scaleY:.96,originX:60,originY:45},
      'layer.feature.soft-a.96-detail':{translateY:.8,scaleY:.94,originX:60,originY:49},
      'layer.feature.soft-a.nose':{scaleY:1.04,originX:60,originY:54},
      'layer.feature.soft-a.mouth.middle':{translateY:.8,scaleX:.96,originX:60,originY:75},
    },
    featureAssetOverrides:{
      'layer.feature.soft-a.brows':'layer.feature.soft-a.brows.middle',
      'layer.feature.soft-a.mouth':'layer.feature.soft-a.mouth.middle',
    },
  },
  {
    id:'stage.female.elder.v1',
    lifeStages:['elder'],
    viewBox:{x:7,y:20,width:108,height:112},
    layerAssetIds:['layer.body.elder','layer.neck.elder','layer.stage-face.elder'],
    backgroundColor:'#b9aa83',
    collarColor:'#938b77',
    clothByWealth:{poor:'#756a5f',plain:'#6f7370',comfortable:'#626b61',wealthy:'#66585a'},
    featureTransforms:{
      'layer.face.elder':{scaleX:1.01,scaleY:1,originX:60,originY:61},
      'layer.feature.soft-a.eyes.elder':{translateY:1.5,scaleX:.96,scaleY:.9,originX:60,originY:51},
      'layer.feature.soft-a.brows.elder':{translateY:1.2,scaleX:.95,originX:60,originY:46},
      'layer.feature.soft-a.96-detail':{translateY:1.5,scaleX:.96,scaleY:.9,originX:60,originY:51},
      'layer.feature.soft-a.nose.elder':{translateY:.2,scaleY:1.04,originX:60,originY:54},
      'layer.feature.soft-a.mouth.elder':{translateY:1.5,scaleX:.94,originX:60,originY:76},
    },
    featureAssetOverrides:{
      'layer.feature.soft-a.eyes':'layer.feature.soft-a.eyes.elder',
      'layer.feature.soft-a.brows':'layer.feature.soft-a.brows.elder',
      'layer.feature.soft-a.nose':'layer.feature.soft-a.nose.elder',
      'layer.feature.soft-a.mouth':'layer.feature.soft-a.mouth.elder',
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
    { kind:'path', d:'M60 27 C46 27 40 37 40 53 C40 69 46 83 52 91 Q60 97 68 91 C74 83 80 69 80 53 C80 37 74 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  // Split facial features so IdentityMorphology survives age changes while stage art can replace shapes.
  { id:'layer.feature.soft-a.eyes', slot:'face-detail', z:50, lods:[48,64,96], shapes:[
    { kind:'path', d:'M45 51 Q50 48 55 51', stroke:'ink', strokeWidth:1.5 },
    { kind:'path', d:'M65 51 Q70 48 75 51', stroke:'ink', strokeWidth:1.5 },
  ]},
  { id:'layer.feature.soft-a.eyes.child', slot:'face-detail', z:50, lods:[48,64,96], shapes:[
    { kind:'path', d:'M44.5 51 Q50 47 55.5 51', stroke:'ink', strokeWidth:1.4 },
    { kind:'path', d:'M64.5 51 Q70 47 75.5 51', stroke:'ink', strokeWidth:1.4 },
  ]},
  { id:'layer.feature.soft-a.eyes.elder', slot:'face-detail', z:50, lods:[48,64,96], shapes:[
    { kind:'path', d:'M45 52 Q50 50 55 51.5', stroke:'ink', strokeWidth:1.3 },
    { kind:'path', d:'M65 51.5 Q70 50 75 52', stroke:'ink', strokeWidth:1.3 },
  ]},
  { id:'layer.feature.soft-a.brows', slot:'face-detail', z:49, lods:[48,64,96], shapes:[
    { kind:'path', d:'M46 45 Q50 43 55 45', stroke:'ink', strokeWidth:1.9 },
    { kind:'path', d:'M65 45 Q70 43 74 45', stroke:'ink', strokeWidth:1.9 },
  ]},
  { id:'layer.feature.soft-a.brows.child', slot:'face-detail', z:49, lods:[48,64,96], shapes:[
    { kind:'path', d:'M47.5 45 Q50.5 44.2 54 45', stroke:'ink', strokeWidth:1.22 },
    { kind:'path', d:'M66 45 Q69.5 44.2 72.5 45', stroke:'ink', strokeWidth:1.22 },
  ]},
  { id:'layer.feature.soft-a.brows.youth', slot:'face-detail', z:49, lods:[48,64,96], shapes:[
    { kind:'path', d:'M46 44.5 Q50 42.7 55 44.5', stroke:'ink', strokeWidth:1.7 },
    { kind:'path', d:'M65 44.5 Q70 42.7 74 44.5', stroke:'ink', strokeWidth:1.7 },
  ]},
  { id:'layer.feature.soft-a.brows.middle', slot:'face-detail', z:49, lods:[48,64,96], shapes:[
    { kind:'path', d:'M46 45.7 Q50 44.4 55 45.2', stroke:'ink', strokeWidth:1.65 },
    { kind:'path', d:'M65 45.2 Q70 44.4 74 45.7', stroke:'ink', strokeWidth:1.65 },
  ]},
  { id:'layer.feature.soft-a.brows.elder', slot:'face-detail', z:49, lods:[48,64,96], shapes:[
    { kind:'path', d:'M47 46 Q50 45 54 45.7', stroke:'ink', strokeWidth:1.3 },
    { kind:'path', d:'M66 45.7 Q70 45 73 46', stroke:'ink', strokeWidth:1.3 },
  ]},
  { id:'layer.feature.soft-a.nose', slot:'face-detail', z:51, lods:[48,64,96], shapes:[
    { kind:'path', d:'M59 54 Q58 63 60 66 Q62 67 65 65', stroke:'ink', strokeWidth:1.1 },
  ]},
  { id:'layer.feature.soft-a.nose.child', slot:'face-detail', z:51, lods:[48,64,96], shapes:[
    { kind:'path', d:'M59.5 55 Q59 60 60.5 62 Q62 63 64 61.5', stroke:'ink', strokeWidth:1 },
  ]},
  { id:'layer.feature.soft-a.nose.elder', slot:'face-detail', z:51, lods:[48,64,96], shapes:[
    { kind:'path', d:'M59 54 Q58 65 60 68 Q63 69 66 66', stroke:'ink', strokeWidth:1.05 },
  ]},
  { id:'layer.feature.soft-a.mouth', slot:'face-detail', z:52, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54 74 Q60 77 66 74', stroke:'ink', strokeWidth:1.35 },
  ]},
  { id:'layer.feature.soft-a.mouth.child', slot:'face-detail', z:52, lods:[48,64,96], shapes:[
    { kind:'path', d:'M56 73 Q60 75 64 73', stroke:'ink', strokeWidth:1.15 },
  ]},
  { id:'layer.feature.soft-a.mouth.middle', slot:'face-detail', z:52, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54.5 75 Q60 76 65.5 75', stroke:'ink', strokeWidth:1.25 },
  ]},
  { id:'layer.feature.soft-a.mouth.elder', slot:'face-detail', z:52, lods:[48,64,96], shapes:[
    { kind:'path', d:'M55 76 Q60 75.7 65 76', stroke:'ink', strokeWidth:1.15 },
  ]},
  { id:'layer.feature.soft-a.96-detail', slot:'face-detail', z:53, lods:[96], shapes:[
    { kind:'circle', cx:50, cy:51, r:.6, fill:'ink' },
    { kind:'circle', cx:70, cy:51, r:.6, fill:'ink' },
  ]},

  // Stage-face overlays add age read without replacing Identity Morphology.
  { id:'layer.stage-face.child', slot:'face-detail', z:54, lods:[64,96], shapes:[
    { kind:'path', d:'M44 62 Q48 64 52 62', stroke:'age', strokeWidth:.42, opacity:.14 },
    { kind:'path', d:'M68 62 Q72 64 76 62', stroke:'age', strokeWidth:.42, opacity:.14 },
  ]},
  { id:'layer.stage-face.middle', slot:'face-detail', z:54, lods:[64,96], shapes:[
    { kind:'path', d:'M77 52 Q79 54 78 57', stroke:'age', strokeWidth:.42, opacity:.2 },
    { kind:'path', d:'M43 53 Q41 55 42 58', stroke:'age', strokeWidth:.42, opacity:.2 },
    { kind:'path', d:'M69 68 Q72 70 73 74', stroke:'age', strokeWidth:.4, opacity:.18 },
  ]},
  { id:'layer.stage-face.elder', slot:'face-detail', z:56, lods:[64,96], shapes:[
    { kind:'path', d:'M44 54 Q49 57 54 55', stroke:'age', strokeWidth:.62, opacity:.42 },
    { kind:'path', d:'M66 55 Q71 57 76 54', stroke:'age', strokeWidth:.62, opacity:.42 },
    { kind:'path', d:'M50 69 Q47 75 49 81', stroke:'age', strokeWidth:.52, opacity:.34 },
    { kind:'path', d:'M70 69 Q73 75 71 81', stroke:'age', strokeWidth:.52, opacity:.34 },
    { kind:'path', d:'M51 88 Q60 92 69 88', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.age.middle', slot:'age-overlay', z:55, lods:[64,96], shapes:[
    { kind:'path', d:'M44 59 Q49 61 53 60', stroke:'age', strokeWidth:.55, opacity:.28 },
    { kind:'path', d:'M67 60 Q72 61 76 59', stroke:'age', strokeWidth:.55, opacity:.28 },
    { kind:'path', d:'M72 73 Q70 78 68 80', stroke:'age', strokeWidth:.45, opacity:.22 },
  ]},
  { id:'layer.age.elder', slot:'age-overlay', z:55, lods:[64,96], shapes:[
    { kind:'path', d:'M43 61 Q48 64 52 62', stroke:'age', strokeWidth:.8, opacity:.5 },
    { kind:'path', d:'M68 62 Q72 64 77 61', stroke:'age', strokeWidth:.8, opacity:.5 },
    { kind:'path', d:'M47 76 Q50 82 53 85', stroke:'age', strokeWidth:.75, opacity:.45 },
    { kind:'path', d:'M73 76 Q70 82 67 85', stroke:'age', strokeWidth:.75, opacity:.45 },
  ]},

  // V8.3 portrait staging. Age changes the body silhouette, collar, posture and crop;
  // wealth layers below only add social-detail overlays.
  { id:'layer.neck.child', slot:'neck', z:17, lods:[48,64,96], shapes:[
    { kind:'path', d:'M55 78 C55 82 54 86 52.5 90.5 Q60 94 67.5 90.5 C66 86 65 82 65 78Z', fill:'skin' },
    { kind:'path', d:'M55 80 Q54.5 85 53 89.5 M65 80 Q65.5 85 67 89.5', stroke:'ink', strokeWidth:.48, opacity:.52 },
  ]},
  { id:'layer.body.child', slot:'outfit', z:18, lods:[48,64,96], shapes:[
    { kind:'path', d:'M34 150 C35 129 39 108 47 93 L53 91 Q60 97 67 91 L73 93 C81 108 85 129 86 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.8 },
    { kind:'path', d:'M52 90 Q60 96 68 90 L66 94 Q60 99 54 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
  ]},
  { id:'layer.neck.youth', slot:'neck', z:17, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54 82 C54 88 53 94 51.5 98.5 Q60 102 68.5 98.5 C67 94 66 88 66 82Z', fill:'skin' },
    { kind:'path', d:'M54.5 84 Q53.5 91 52 97 M65.5 84 Q66.5 91 68 97', stroke:'ink', strokeWidth:.5, opacity:.56 },
  ]},
  { id:'layer.body.youth', slot:'outfit', z:18, lods:[48,64,96], shapes:[
    { kind:'path', d:'M23 150 C25 131 29 113 43 96 L50 91 L60 101 L73 90 L79 96 C92 111 98 131 100 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M49 90 L60 100 L57.2 104 L46 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M73 89 L60 100 L63 104 L78 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M60 100 L69 106', stroke:'ink', strokeWidth:.38, opacity:.34 },
    { kind:'path', d:'M36 108 Q45 102 50 99', stroke:'accent', strokeWidth:.62, opacity:.4 },
  ]},
  { id:'layer.neck.adult', slot:'neck', z:17, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54 87 C54 91 53 96 51.5 100 Q60 104 68.5 100 C67 96 66 91 66 87Z', fill:'skin' },
    { kind:'path', d:'M54.5 89 Q53.5 95 52 99 M65.5 89 Q66.5 95 68 99', stroke:'ink', strokeWidth:.52, opacity:.58 },
  ]},
  { id:'layer.body.adult', slot:'outfit', z:18, lods:[48,64,96], shapes:[
    { kind:'path', d:'M16 150 C18 132 23 113 43 95 L50 92 L60 101 L71 93 L77 95 C97 113 102 132 104 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M49 91 L60 100.5 L57.2 105 L45.5 95Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M71.5 92 L60 100.5 L63 105 L76.5 96Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M60 100.5 L70.5 107.5', stroke:'ink', strokeWidth:.4, opacity:.36 },
  ]},
  { id:'layer.neck.middle', slot:'neck', z:17, lods:[48,64,96], shapes:[
    { kind:'path', d:'M54 88 C54 92 53 96 52 99.5 Q60 103 68 99.5 C67 96 66 92 66 88Z', fill:'skin' },
    { kind:'path', d:'M54.5 90 Q53.8 95 52.5 99 M65.5 90 Q66.2 95 67.5 99', stroke:'ink', strokeWidth:.5, opacity:.54 },
    { kind:'path', d:'M56 93 Q57 97 56.5 99.5 M64 93 Q63 97 63.5 99.5', stroke:'age', strokeWidth:.3, opacity:.1 },
  ]},
  { id:'layer.body.middle', slot:'outfit', z:18, lods:[48,64,96], shapes:[
    { kind:'path', d:'M18 150 C20 132 25 114 42 97 L49 94 L60 102 L73 95 L79 99 C96 115 101 132 103 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.12 },
    { kind:'path', d:'M48.5 93 L60 101.5 L57 106 L44.5 97Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M73.5 94 L60 101.5 L63.2 106 L78 99Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M52 97.5 L60 102.5 L68.5 98.2', stroke:'collar', strokeWidth:.65, opacity:.62 },
    { kind:'path', d:'M60 102 L69.5 108', stroke:'ink', strokeWidth:.38, opacity:.32 },
  ]},
  { id:'layer.neck.elder', slot:'neck', z:17, lods:[48,64,96], shapes:[
    { kind:'path', d:'M55.5 91 C55.5 94 55 97 54.5 99.5 Q60 102 65.5 99.5 C65 97 64.5 94 64.5 91Z', fill:'skin' },
    { kind:'path', d:'M56 93 Q55.5 96.5 55 99 M64 93 Q64.5 96.5 65 99', stroke:'ink', strokeWidth:.46, opacity:.46 },
    { kind:'path', d:'M57 94 Q58 97 57.5 99.5 M63 94 Q62 97 62.5 99.5', stroke:'age', strokeWidth:.34, opacity:.14 },
  ]},
  { id:'layer.body.elder', slot:'outfit', z:18, lods:[48,64,96], shapes:[
    { kind:'path', d:'M27 150 C29 136 34 117 45 106 L50 102 Q60 106 70 102 L75 105 C87 118 92 136 94 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M49 100 Q60 106 71 100 L69 105 Q60 110 51 105Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M52 103 Q60 107 68 103', stroke:'collar', strokeWidth:.72, opacity:.64 },
  ]},

  // Wealth/detail overlays no longer define the whole body silhouette.
  { id:'layer.outfit.poor', slot:'outfit', z:21, lods:[64,96], shapes:[
    { kind:'path', d:'M31 119 Q37 116 44 119', stroke:'accent', strokeWidth:.75, opacity:.48 },
    { kind:'path', d:'M84 124 L91 122', stroke:'accent', strokeWidth:.65, opacity:.4 },
  ]},
  { id:'layer.outfit.plain', slot:'outfit', z:21, lods:[64,96], shapes:[
    { kind:'path', d:'M36 119 Q60 126 84 119', stroke:'accent', strokeWidth:.9, opacity:.52 },
  ]},
  { id:'layer.outfit.comfortable', slot:'outfit', z:21, lods:[64,96], shapes:[
    { kind:'path', d:'M35 116 Q60 124 85 116', stroke:'accent', strokeWidth:1.2, opacity:.68 },
    { kind:'path', d:'M39 122 Q60 128 81 122', stroke:'accent', strokeWidth:.65, opacity:.46 },
  ]},
  { id:'layer.outfit.wealthy', slot:'outfit', z:21, lods:[64,96], shapes:[
    { kind:'path', d:'M33 114 Q60 124 87 114', stroke:'accent', strokeWidth:1.4, opacity:.76 },
    { kind:'path', d:'M37 121 Q60 129 83 121', stroke:'accent', strokeWidth:.8, opacity:.58 },
    { kind:'path', d:'M42 128 Q60 133 78 128', stroke:'accent', strokeWidth:.55, opacity:.45 },
  ]},

  // Local-space hair assets. (0,0) is the declared anchor from HeadProfile.
  { id:'layer.hair.girl-double-bun.back', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-15 7 C-16 5 -14 3 -11 2 C-8 1 -6 2 -5 4 C-5 6 -7 7 -9 8 C-12 9 -14 9 -15 7Z', fill:'hair' },
    { kind:'path', d:'M14 6 C15 4 13 2 11 2 C8 1 6 3 6 5 C6 7 8 8 10 8 C12 8 14 7 14 6Z', fill:'hair' },
    { kind:'path', d:'M-14 6 Q-11 3 -8 3', stroke:'hair-accent', strokeWidth:.4, opacity:.1 },
    { kind:'path', d:'M13 5 Q11 3 8 4', stroke:'hair-accent', strokeWidth:.36, opacity:.08 },
    { kind:'path', d:'M-11 8 C-10 10 -8 12 -5 13 C-8 14 -11 12 -12 10Z', fill:'hair' },
    { kind:'path', d:'M10 8 C9 10 8 11 6 13 C8 13 11 11 11 9Z', fill:'hair' },
  ]},
  { id:'layer.hair.girl-double-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-20 21 Q-18 8 -7 3 Q-2 1 0 4 Q3 1 8 3 Q18 8 20 21 Q11 14 3 13 Q0 12 -3 13 Q-11 14 -20 21Z', fill:'hair' },
  ]},
  { id:'layer.hair.girl-double-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-16 18 Q-16 21 -15 24', stroke:'hair', strokeWidth:.82, opacity:.82 },
    { kind:'path', d:'M16 18 Q16 21 15 24', stroke:'hair', strokeWidth:.78, opacity:.78 },
  ]},

  { id:'layer.hair.youth-halfbound.crown', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'crownBack', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-5 6 C-4 3 -1 1 3 1 C7 1 10 3 10 6 C9 8 6 9 2 9 C-1 8 -4 8 -5 6Z', fill:'hair' },
    { kind:'path', d:'M2 2 Q7 3 9 6', stroke:'hair-accent', strokeWidth:.4, opacity:.12 },
  ]},
  { id:'layer.hair.youth-halfbound.back-left', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'occipitalLeft', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M4 -5 C8 4 9 16 8 28 C7 39 5 48 2 56 C0 62 -4 66 -7 64 C-9 61 -7 56 -5 51 C-2 42 0 32 0 22 C0 10 1 1 4 -5Z', fill:'hair', stroke:'ink', strokeWidth:.7 },
  ]},
  { id:'layer.hair.youth-halfbound.back-right', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'occipitalRight', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-4 -5 C-8 4 -9 17 -8 30 C-7 43 -4 54 -1 62 C1 67 5 70 8 67 C10 64 8 59 6 54 C3 44 1 33 1 22 C1 10 -1 1 -4 -5Z', fill:'hair', stroke:'ink', strokeWidth:.72 },
  ]},
  { id:'layer.hair.youth-halfbound.detail', slot:'back-hair', z:11, lods:[96], coordinateSpace:'anchor-local', anchor:'nape', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-12 -16 Q-11 1 -15 17 M12 -16 Q12 2 16 20', stroke:'hair-accent', strokeWidth:.38, opacity:.1 },
  ]},
  { id:'layer.hair.youth-halfbound.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-1 2 C-8 2 -15 8 -19 16 C-20 19 -20 22 -19 24 C-14 18 -9 15 -3 14 C-1 10 0 6 -1 2Z', fill:'hair' },
    { kind:'path', d:'M1 2 C8 2 15 8 19 16 C20 19 20 22 19 24 C14 18 9 16 3 15 C1 10 0 6 1 2Z', fill:'hair' },
  ]},
  { id:'layer.hair.youth-halfbound.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-15.5 22 Q-15.7 25 -14.5 28', stroke:'hair', strokeWidth:.82, opacity:.82 },
    { kind:'path', d:'M15.5 22 Q15.7 25.5 14.5 28.5', stroke:'hair', strokeWidth:.84, opacity:.82 },
  ]},

  // Low bun has an explicit bridge back into the head mass, so it cannot read as a detached circle.
  { id:'layer.hair.adult-low-bun.rear-flow', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'occipitalRight', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-5 -31 C-13 -28 -17 -18 -17 -5 C-17 8 -13 19 -7 25 C-3 29 1 26 1 20 C0 11 1 3 4 -4 C7 -12 6 -22 2 -27 C0 -30 -2 -31 -5 -31Z', fill:'hair', stroke:'ink', strokeWidth:.74 },
    { kind:'path', d:'M-7 -20 Q-3 -9 -3 6 Q-3 16 -1 21', stroke:'hair-accent', strokeWidth:.4, opacity:.11 },
  ]},
  { id:'layer.hair.adult-low-bun.nape-root', slot:'back-hair', z:11, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'nape', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M6 -17 C10 -19 14 -19 17 -16 C18 -14 17 -12 15 -10 C12 -8 9 -8 7 -10 C6 -12 5 -15 6 -17Z', fill:'hair' },
  ]},
  { id:'layer.hair.adult-low-bun.bun', slot:'back-hair', z:12, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-8 -3 C-3 -7 5 -8 11 -5 C15 -3 17 0 16 3 C15 6 10 8 4 8 C-1 8 -6 6 -8 3 C-9 1 -9 -1 -8 -3Z', fill:'hair' },
    { kind:'path', d:'M4 -6 C10 -6 15 -3 16 1 C16 5 12 7 7 8', stroke:'ink', strokeWidth:.58 },
  ]},
  { id:'layer.hair.adult-low-bun.coil', slot:'back-hair', z:13, lods:[64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M6 -4 Q11 -3 12 0', stroke:'hair-accent', strokeWidth:.32, opacity:.09 },
    { kind:'path', d:'M7 5 Q10 5 12 3', stroke:'hair-accent', strokeWidth:.28, opacity:.07 },
  ]},
  { id:'layer.hair.adult-low-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-1 2 C-8 2 -15 8 -19 16 C-20 19 -20 22 -19 25 C-14 19 -9 16 -3 15 C-1 11 0 6 -1 2Z', fill:'hair' },
    { kind:'path', d:'M1 2 C8 2 15 8 19 16 C20 19 20 22 19 25 C14 19 9 16 3 15 C1 11 0 6 1 2Z', fill:'hair' },
    { kind:'path', d:'M0 3 L0 11', stroke:'hair-accent', strokeWidth:.4, opacity:.11 },
  ]},
  { id:'layer.hair.adult-low-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-15.5 22 Q-15.7 25.5 -14.5 28.5', stroke:'hair', strokeWidth:.78, opacity:.8 },
    { kind:'path', d:'M15.5 22 Q15.7 25.5 14.5 28.5', stroke:'hair', strokeWidth:.78, opacity:.8 },
  ]},

  { id:'layer.hair.elder-gray-bun.rear-flow', slot:'back-hair', z:10, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'occipitalRight', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-4 -27 C-11 -25 -14 -16 -14 -5 C-14 7 -11 17 -6 22 C-2 25 1 23 1 18 C0 10 1 3 3 -3 C6 -10 5 -19 2 -23 C0 -26 -2 -27 -4 -27Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
  ]},
  { id:'layer.hair.elder-gray-bun.nape-root', slot:'back-hair', z:11, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'nape', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M6 -16 C9 -18 13 -18 15 -15 C17 -13 16 -11 14 -9 C11 -8 9 -8 7 -9 C6 -11 5 -14 6 -16Z', fill:'hair' },
  ]},
  { id:'layer.hair.elder-gray-bun.bun', slot:'back-hair', z:12, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M-7 -3 C-3 -6 3 -7 8 -5 C12 -3 14 0 13 3 C12 5 8 7 3 7 C-1 7 -5 5 -7 3 C-8 1 -8 -1 -7 -3Z', fill:'hair' },
    { kind:'path', d:'M4 -5 C8 -5 12 -3 13 0 C14 3 10 6 6 7', stroke:'hair-accent', strokeWidth:.46, opacity:.48 },
  ]},
  { id:'layer.hair.elder-gray-bun.coil', slot:'back-hair', z:13, lods:[64,96], coordinateSpace:'anchor-local', anchor:'bunLow', maskMode:'behind-head', shapes:[
    { kind:'path', d:'M5 -4 Q9 -3 10 0', stroke:'hair-accent', strokeWidth:.26, opacity:.07 },
  ]},
  { id:'layer.hair.elder-gray-bun.front', slot:'front-hair', z:70, lods:[48,64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-3 4 C-9 5 -14 10 -17 17 C-18 20 -18 23 -17 26 C-13 21 -9 18 -4 17 C-2 13 -2 8 -3 4Z', fill:'hair' },
    { kind:'path', d:'M3 5 C8 6 13 11 16 17 C17 20 17 23 16 25 C12 21 8 18 4 17 C2 13 2 9 3 5Z', fill:'hair' },
  ]},
  { id:'layer.hair.elder-gray-bun.detail', slot:'front-hair', z:71, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'inside-skull', shapes:[
    { kind:'path', d:'M-12 12 Q-7 8 -4 8 M4 9 Q8 10 12 13', stroke:'hair-accent', strokeWidth:.28, opacity:.07 },
  ]},
  { id:'layer.hair.elder-gray-bun.side', slot:'side-hair', z:60, lods:[64,96], coordinateSpace:'anchor-local', anchor:'skullTop', maskMode:'outside-face', shapes:[
    { kind:'path', d:'M-14 24 Q-14.3 27 -13 29', stroke:'hair', strokeWidth:.66, opacity:.72 },
    { kind:'path', d:'M14 24 Q14.3 27 13 29', stroke:'hair', strokeWidth:.66, opacity:.72 },
  ]},

  // Accessories use local coordinates; their final anchor comes from AccessoryAsset placement.
  { id:'layer.accessory.red-cord', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'path', d:'M-16 7 Q-13 9 -10 7 M10 7 Q13 9 16 7', stroke:'cord-red', strokeWidth:1.25 },
    { kind:'line', x1:-13, y1:7, x2:-13, y2:10, stroke:'cord-red', strokeWidth:.9 },
    { kind:'line', x1:13, y1:7, x2:13, y2:10, stroke:'cord-red', strokeWidth:.9 },
  ]},
  { id:'layer.accessory.cloth-knot', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', shapes:[
    { kind:'path', d:'M-4 2 Q0 .5 4 2 L3.5 4 Q0 3 -3.5 4Z', fill:'accessory-cloth', stroke:'ink', strokeWidth:.35 },
    { kind:'path', d:'M1 3 Q2 5 3 7', stroke:'accessory-cloth', strokeWidth:.65 },
  ]},
  { id:'layer.accessory.wood-pin', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', maskMode:'outside-face', shapes:[
    { kind:'line', x1:-1, y1:-2.5, x2:8, y2:1.2, stroke:'accessory-wood', strokeWidth:1.05 },
    { kind:'circle', cx:8.6, cy:1.45, r:.72, fill:'accessory-wood' },
  ]},
  { id:'layer.accessory.jade-pin', slot:'accessory', z:80, lods:[64,96], coordinateSpace:'anchor-local', maskMode:'outside-face', shapes:[
    { kind:'line', x1:-1, y1:-2.5, x2:8, y2:1.2, stroke:'accessory-jade', strokeWidth:1.02 },
    { kind:'circle', cx:8.8, cy:1.5, r:1.05, fill:'accessory-jade', stroke:'ink', strokeWidth:.3 },
  ]},
];

export const HAIR_BUNDLES: HairStyleBundle[] = [
  {
    id:'hair.female.girl-double-bun.v1', label:'女童双小髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['child','teen'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.child.v1'], silhouetteType:'double-crown-bun',
    baseWeight:1, targetShare:.18,
    layerAssetIds:['layer.hair.girl-double-bun.back','layer.hair.girl-double-bun.front','layer.hair.girl-double-bun.side'],
    placementByHeadProfile:{'head.female.soft-oval.child.v1':{translateY:1}}, accessorySlots:['accessory.red-cord'],
  },
  {
    id:'hair.female.young-halfbound-backfall.v1', label:'少女半束后披', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['young-adult','adult'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.youth.v1','head.female.soft-oval.adult.v1'], silhouetteType:'halfbound-backfall',
    baseWeight:1, targetShare:.28,
    layerAssetIds:['layer.hair.youth-halfbound.crown','layer.hair.youth-halfbound.back-left','layer.hair.youth-halfbound.back-right','layer.hair.youth-halfbound.detail','layer.hair.youth-halfbound.front','layer.hair.youth-halfbound.side'],
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
    layerAssetIds:['layer.hair.adult-low-bun.rear-flow','layer.hair.adult-low-bun.nape-root','layer.hair.adult-low-bun.bun','layer.hair.adult-low-bun.coil','layer.hair.adult-low-bun.front','layer.hair.adult-low-bun.side'],
    placementByHeadProfile:{
      'head.female.soft-oval.adult.v1':{},
      'head.female.soft-oval.elder.v1':{translateY:1,scaleX:.96,scaleY:.96},
    },
    accessorySlots:['accessory.wood-pin','accessory.jade-pin'],
  },
  {
    id:'hair.female.elder-gray-low-bun.v1', label:'老年花白低髻', cultureTag:'chinese-ancient',
    genders:['female'], lifeStages:['middle-age','elder'], compatibleFaceFamilies:[FACE_FAMILY_ID],
    compatibleHeadProfiles:['head.female.soft-oval.adult.v1','head.female.soft-oval.elder.v1'], silhouetteType:'elder-gray-low-bun',
    baseWeight:1, targetShare:.22,
    layerAssetIds:['layer.hair.elder-gray-bun.rear-flow','layer.hair.elder-gray-bun.nape-root','layer.hair.elder-gray-bun.bun','layer.hair.elder-gray-bun.coil','layer.hair.elder-gray-bun.front','layer.hair.elder-gray-bun.detail','layer.hair.elder-gray-bun.side'],
    placementByHeadProfile:{
      'head.female.soft-oval.adult.v1':{},
      'head.female.soft-oval.elder.v1':{translateY:1,scaleX:.94,scaleY:.94},
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
    placementByHairBundle:{'hair.female.young-halfbound-backfall.v1':{anchor:'crownBack',transform:{translateX:2,translateY:3}}},
    baseWeight:2,
  },
  {
    id:'accessory.wood-pin', label:'木簪', genders:['female'], lifeStages:['young-adult','adult','middle-age','elder'],
    wealthTiers:['plain','comfortable','wealthy'],
    compatibleHairBundles:['hair.female.young-halfbound-backfall.v1','hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'],
    layerAssetId:'layer.accessory.wood-pin',
    placementByHairBundle:{
      'hair.female.young-halfbound-backfall.v1':{anchor:'crownBack',transform:{translateX:1,translateY:2}},
      'hair.female.adult-low-bun.v1':{anchor:'bunLow',transform:{translateX:5,translateY:-4}},
      'hair.female.elder-gray-low-bun.v1':{anchor:'bunLow',transform:{translateX:4,translateY:-4}},
    },
    baseWeight:2,
  },
  {
    id:'accessory.jade-pin', label:'玉簪', genders:['female'], lifeStages:['adult','middle-age','elder'],
    wealthTiers:['comfortable','wealthy'],
    compatibleHairBundles:['hair.female.adult-low-bun.v1','hair.female.elder-gray-low-bun.v1'],
    layerAssetId:'layer.accessory.jade-pin',
    placementByHairBundle:{
      'hair.female.adult-low-bun.v1':{anchor:'bunLow',transform:{translateX:5,translateY:-4}},
      'hair.female.elder-gray-low-bun.v1':{anchor:'bunLow',transform:{translateX:4,translateY:-4}},
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
    'layer.feature.soft-a.brows',
    'layer.feature.soft-a.eyes',
    'layer.feature.soft-a.nose',
    'layer.feature.soft-a.mouth',
    'layer.feature.soft-a.96-detail',
  ],
};

export const AGE_LAYER_BY_ID: Record<string,string[]> = {
  'age.none':[],
  'age.middle-soft':['layer.age.middle'],
  'age.elder-lines':['layer.age.elder'],
};

export function layerById(id:string) {
  const layer = VECTOR_LAYERS.find((item)=>item.id===id);
  if (!layer) throw new Error('Unknown V8.1 vector layer: '+id);
  return layer;
}
