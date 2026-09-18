import type {
  FaceFamilyDefinition,
  HairStyleDefinition,
  OutfitStyleDefinition,
  PortraitStageProfile,
  VectorLayerAsset,
} from './types';

export const FACE_FAMILIES: FaceFamilyDefinition[] = [
  { id:'face.soft-oval', label:'女子柔和鹅蛋脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.soft-oval.child', youth:'layer.face.soft-oval.youth', adult:'layer.face.soft-oval.adult', elder:'layer.face.soft-oval.elder',
  }},
  { id:'face.round-soft', label:'女子圆润脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.round-soft.child', youth:'layer.face.round-soft.youth', adult:'layer.face.round-soft.adult', elder:'layer.face.round-soft.elder',
  }},
  { id:'face.long-narrow', label:'女子长窄脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.long-narrow.child', youth:'layer.face.long-narrow.youth', adult:'layer.face.long-narrow.adult', elder:'layer.face.long-narrow.elder',
  }},
  { id:'face.broad-cheek', label:'女子宽颊脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.broad-cheek.child', youth:'layer.face.broad-cheek.youth', adult:'layer.face.broad-cheek.adult', elder:'layer.face.broad-cheek.elder',
  }},
  { id:'face.square-soft', label:'女子柔方脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.square-soft.child', youth:'layer.face.square-soft.youth', adult:'layer.face.square-soft.adult', elder:'layer.face.square-soft.elder',
  }},
  { id:'face.narrow-chin', label:'女子窄下颌脸', genders:['female'], faceLayerByAge:{
    child:'layer.face.narrow-chin.child', youth:'layer.face.narrow-chin.youth', adult:'layer.face.narrow-chin.adult', elder:'layer.face.narrow-chin.elder',
  }},
  { id:'face.male-oval', label:'男子椭圆脸', genders:['male'], faceLayerByAge:{
    child:'layer.face.male-oval.child', youth:'layer.face.male-oval.youth', adult:'layer.face.male-oval.adult', elder:'layer.face.male-oval.elder',
  }},
  { id:'face.male-round', label:'男子圆脸', genders:['male'], faceLayerByAge:{
    child:'layer.face.male-round.child', youth:'layer.face.male-round.youth', adult:'layer.face.male-round.adult', elder:'layer.face.male-round.elder',
  }},
  { id:'face.male-square', label:'男子方脸', genders:['male'], faceLayerByAge:{
    child:'layer.face.male-square.child', youth:'layer.face.male-square.youth', adult:'layer.face.male-square.adult', elder:'layer.face.male-square.elder',
  }},
  { id:'face.male-long', label:'男子长脸', genders:['male'], faceLayerByAge:{
    child:'layer.face.male-long.child', youth:'layer.face.male-long.youth', adult:'layer.face.male-long.adult', elder:'layer.face.male-long.elder',
  }},
];

export const PORTRAIT_STAGE_PROFILES: PortraitStageProfile[] = [
  { id:'stage.child.v3', lifeStages:['child','teen'], ageGroup:'child', viewBox:{x:5,y:12,width:104,height:104},
    layerAssetIds:['layer.neck.child','layer.body.child'],
    featureLayerByGender:{female:'layer.features.child',male:'layer.features.male.child'},
    backgroundColor:'#d7bf88', collarColor:'#a79b79',
    clothByWealth:{poor:'#7a6857',plain:'#748391',comfortable:'#60756b',wealthy:'#73585d'} },
  { id:'stage.youth.v3', lifeStages:['young-adult'], ageGroup:'youth', viewBox:{x:-2,y:10,width:122,height:124},
    layerAssetIds:['layer.neck.youth','layer.body.youth'],
    featureLayerByGender:{female:'layer.features.youth',male:'layer.features.male.youth'},
    backgroundColor:'#cdb17a', collarColor:'#a49a80',
    clothByWealth:{poor:'#75604f',plain:'#5f7880',comfortable:'#536f65',wealthy:'#70565c'} },
  { id:'stage.adult.v3', lifeStages:['adult'], ageGroup:'adult', viewBox:{x:0,y:15,width:120,height:120},
    layerAssetIds:['layer.neck.adult','layer.body.adult'],
    featureLayerByGender:{female:'layer.features.adult',male:'layer.features.male.adult'},
    backgroundColor:'#ccb074', collarColor:'#a1987f',
    clothByWealth:{poor:'#76624f',plain:'#63717a',comfortable:'#4f6358',wealthy:'#6b5052'} },
  { id:'stage.middle.v3', lifeStages:['middle-age'], ageGroup:'adult', viewBox:{x:4,y:17,width:116,height:116},
    layerAssetIds:['layer.neck.middle','layer.body.middle'],
    featureLayerByGender:{female:'layer.features.middle',male:'layer.features.male.middle'},
    backgroundColor:'#bea26f', collarColor:'#968d77',
    clothByWealth:{poor:'#706153',plain:'#66706f',comfortable:'#59695d',wealthy:'#695455'} },
  { id:'stage.elder.v3', lifeStages:['elder'], ageGroup:'elder', viewBox:{x:7,y:20,width:108,height:112},
    layerAssetIds:['layer.neck.elder','layer.body.elder'],
    featureLayerByGender:{female:'layer.features.elder',male:'layer.features.male.elder'},
    backgroundColor:'#b9aa83', collarColor:'#938b77',
    clothByWealth:{poor:'#756a5f',plain:'#6f7370',comfortable:'#626b61',wealthy:'#66585a'} },
];

export const VECTOR_LAYERS: VectorLayerAsset[] = [
  // FaceFamily: identity is discrete art, not continuous runtime morphing.
  { id:'layer.face.soft-oval.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 41 38 41 53 C41 68 47 78 54 82 Q60 86 66 82 C73 77 79 68 79 53 C79 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.soft-oval.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C47 24 41 34 41 50 C41 66 46 80 54 87 Q60 91 66 87 C74 80 79 66 79 50 C79 34 73 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.soft-oval.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C46 24 40 35 40 51 C40 68 46 82 53 90 Q60 95 67 90 C74 82 80 68 80 51 C80 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.soft-oval.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C46 27 40 37 40 53 C40 69 46 83 52 91 Q60 97 68 91 C74 83 80 69 80 53 C80 37 74 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  { id:'layer.face.round-soft.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 31 C45 30 39 40 39 54 C39 68 46 78 53 82 Q60 86 67 82 C74 78 81 68 81 54 C81 40 75 30 60 31Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.round-soft.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 25 C45 25 39 36 39 51 C39 66 46 79 53 86 Q60 90 67 86 C74 79 81 66 81 51 C81 36 75 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.round-soft.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 25 C44 25 38 36 38 52 C38 68 45 80 52 87 Q60 92 68 87 C75 80 82 68 82 52 C82 36 76 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.round-soft.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 28 C44 28 38 39 38 54 C38 68 45 81 52 88 Q60 94 68 88 C75 81 82 68 82 54 C82 39 76 28 60 28Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  { id:'layer.face.long-narrow.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 29 C49 29 43 38 43 53 C43 68 48 80 54 84 Q60 88 66 84 C72 80 77 68 77 53 C77 38 71 29 60 29Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},
  { id:'layer.face.long-narrow.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 23 C48 23 42 34 42 51 C42 68 47 82 54 89 Q60 94 66 89 C73 82 78 68 78 51 C78 34 72 23 60 23Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},
  { id:'layer.face.long-narrow.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 23 C47 23 41 34 41 52 C41 70 46 85 53 93 Q60 98 67 93 C74 85 79 70 79 52 C79 34 73 23 60 23Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},
  { id:'layer.face.long-narrow.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 26 C47 26 41 37 41 54 C41 71 46 86 53 94 Q60 99 67 94 C74 86 79 71 79 54 C79 37 73 26 60 26Z', fill:'skin', stroke:'ink', strokeWidth:2.1 },
  ]},

  { id:'layer.face.broad-cheek.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 39 39 39 54 C39 65 44 73 51 80 Q60 87 69 80 C76 73 81 65 81 54 C81 39 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.broad-cheek.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C46 24 38 35 38 51 C38 64 44 75 51 84 Q60 91 69 84 C76 75 82 64 82 51 C82 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.broad-cheek.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C45 24 37 36 37 52 C37 65 43 77 51 87 Q60 95 69 87 C77 77 83 65 83 52 C83 36 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.broad-cheek.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C45 27 37 39 37 54 C37 67 43 79 51 88 Q60 96 69 88 C77 79 83 67 83 54 C83 39 75 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  { id:'layer.face.square-soft.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 38 40 53 C40 67 45 76 51 82 Q60 87 69 82 C75 76 80 67 80 53 C80 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.square-soft.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C46 24 40 34 40 50 C40 65 44 78 51 86 Q60 92 69 86 C76 78 80 65 80 50 C80 34 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.square-soft.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C45 24 39 35 39 51 C39 67 43 80 50 89 Q60 95 70 89 C77 80 81 67 81 51 C81 35 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.square-soft.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C45 27 39 37 39 53 C39 69 43 82 50 90 Q60 96 70 90 C77 82 81 69 81 53 C81 37 75 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  { id:'layer.face.narrow-chin.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 39 40 53 C40 66 46 76 53 82 Q60 88 67 82 C74 76 80 66 80 53 C80 39 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.narrow-chin.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C46 24 40 35 40 51 C40 66 46 79 53 87 Q60 93 67 87 C74 79 80 66 80 51 C80 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.narrow-chin.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C45 24 39 36 39 52 C39 67 45 81 53 90 Q60 97 67 90 C75 81 81 67 81 52 C81 36 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.narrow-chin.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C45 27 39 38 39 54 C39 69 45 83 53 92 Q60 98 67 92 C75 83 81 69 81 54 C81 38 75 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
  ]},

  // Minimal male FaceFamily coverage for the live ResidentAvatar migration.
  { id:'layer.face.male-oval.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 38 40 53 C40 67 46 78 53 83 Q60 87 67 83 C74 78 80 67 80 53 C80 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},
  { id:'layer.face.male-oval.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C46 24 39 35 39 51 C39 67 45 81 52 88 Q60 93 68 88 C75 81 81 67 81 51 C81 35 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},
  { id:'layer.face.male-oval.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C45 24 38 35 38 52 C38 68 44 82 51 90 Q60 95 69 90 C76 82 82 68 82 52 C82 35 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
  ]},
  { id:'layer.face.male-oval.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C45 27 38 38 38 54 C38 70 44 83 51 91 Q60 97 69 91 C76 83 82 70 82 54 C82 38 75 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},

  { id:'layer.face.male-round.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 31 C44 30 38 40 38 54 C38 67 45 78 52 82 Q60 87 68 82 C75 78 82 67 82 54 C82 40 76 30 60 31Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},
  { id:'layer.face.male-round.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 25 C44 25 37 36 37 52 C37 66 44 79 52 86 Q60 91 68 86 C76 79 83 66 83 52 C83 36 76 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
  ]},
  { id:'layer.face.male-round.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 25 C43 25 36 37 36 53 C36 68 43 81 51 88 Q60 94 69 88 C77 81 84 68 84 53 C84 37 77 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.35 },
  ]},
  { id:'layer.face.male-round.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 28 C43 28 36 39 36 55 C36 69 43 81 51 88 Q60 95 69 88 C77 81 84 69 84 55 C84 39 77 28 60 28Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
  ]},

  { id:'layer.face.male-square.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C46 30 39 39 39 54 C39 67 43 77 50 83 Q60 88 70 83 C77 77 81 67 81 54 C81 39 74 30 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
  ]},
  { id:'layer.face.male-square.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C45 24 38 35 38 51 C38 66 42 79 49 87 Q60 93 71 87 C78 79 82 66 82 51 C82 35 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.35 },
  ]},
  { id:'layer.face.male-square.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 24 C44 24 37 35 37 52 C37 67 41 81 48 89 Q60 96 72 89 C79 81 83 67 83 52 C83 35 76 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.4 },
  ]},
  { id:'layer.face.male-square.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 27 C44 27 37 38 37 54 C37 69 41 82 48 90 Q60 97 72 90 C79 82 83 69 83 54 C83 38 76 27 60 27Z', fill:'skin', stroke:'ink', strokeWidth:2.35 },
  ]},

  { id:'layer.face.male-long.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 29 C49 29 43 38 43 53 C43 69 48 81 53 85 Q60 89 67 85 C72 81 77 69 77 53 C77 38 71 29 60 29Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},
  { id:'layer.face.male-long.youth', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 23 C48 23 42 34 42 52 C42 69 47 83 53 90 Q60 95 67 90 C73 83 78 69 78 52 C78 34 72 23 60 23Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},
  { id:'layer.face.male-long.adult', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 23 C47 23 41 34 41 52 C41 70 46 86 52 94 Q60 99 68 94 C74 86 79 70 79 52 C79 34 73 23 60 23Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
  ]},
  { id:'layer.face.male-long.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 26 C47 26 41 37 41 54 C41 72 46 87 52 95 Q60 100 68 95 C74 87 79 72 79 54 C79 37 73 26 60 26Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},

  // One direct feature asset per age stage. No runtime facial morph stack.
  { id:'layer.features.child', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M47.5 45 Q50.5 44.2 54 45 M66 45 Q69.5 44.2 72.5 45', stroke:'ink', strokeWidth:1.22 },
    { kind:'path', d:'M44.5 51 Q50 47 55.5 51 M64.5 51 Q70 47 75.5 51', stroke:'ink', strokeWidth:1.4 },
    { kind:'circle', cx:50, cy:51, r:.55, fill:'ink' }, { kind:'circle', cx:70, cy:51, r:.55, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60 60.5 62 Q62 63 64 61.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M56 73 Q60 75 64 73', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M44 62 Q48 64 52 62 M68 62 Q72 64 76 62', stroke:'age', strokeWidth:.4, opacity:.12 },
  ]},
  { id:'layer.features.youth', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 44.5 Q50 42.7 55 44.5 M65 44.5 Q70 42.7 74 44.5', stroke:'ink', strokeWidth:1.7 },
    { kind:'path', d:'M45 51 Q50 48 55 51 M65 51 Q70 48 75 51', stroke:'ink', strokeWidth:1.5 },
    { kind:'circle', cx:50, cy:51, r:.6, fill:'ink' }, { kind:'circle', cx:70, cy:51, r:.6, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 62 60 65 Q62 66 65 64', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54.5 74 Q60 77 65.5 74', stroke:'ink', strokeWidth:1.28 },
  ]},
  { id:'layer.features.adult', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 45 Q50 43 55 45 M65 45 Q70 43 74 45', stroke:'ink', strokeWidth:1.9 },
    { kind:'path', d:'M45 51 Q50 48 55 51 M65 51 Q70 48 75 51', stroke:'ink', strokeWidth:1.5 },
    { kind:'circle', cx:50, cy:51, r:.6, fill:'ink' }, { kind:'circle', cx:70, cy:51, r:.6, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 63 60 66 Q62 67 65 65', stroke:'ink', strokeWidth:1.1 },
    { kind:'path', d:'M54 74 Q60 77 66 74', stroke:'ink', strokeWidth:1.35 },
  ]},
  { id:'layer.features.middle', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 46 Q50 44.5 55 45.4 M65 45.4 Q70 44.5 74 46', stroke:'ink', strokeWidth:1.65 },
    { kind:'path', d:'M45 52 Q50 49.5 55 52 M65 52 Q70 49.5 75 52', stroke:'ink', strokeWidth:1.45 },
    { kind:'circle', cx:50, cy:52, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:52, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 64 60 67 Q62 68 65 66', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M54.5 76 Q60 77 65.5 76', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M44 60 Q49 62 53 61 M67 61 Q72 62 76 60 M72 73 Q70 78 68 80', stroke:'age', strokeWidth:.5, opacity:.24 },
  ]},
  { id:'layer.features.elder', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M47 47 Q50 46 54 46.5 M66 46.5 Q70 46 73 47', stroke:'ink', strokeWidth:1.3 },
    { kind:'path', d:'M45 53 Q50 51 55 52.5 M65 52.5 Q70 51 75 53', stroke:'ink', strokeWidth:1.3 },
    { kind:'circle', cx:50, cy:53, r:.5, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.5, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 65 60 68 Q63 69 66 66', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M55 77 Q60 76.5 65 77', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M44 56 Q49 59 54 57 M66 57 Q71 59 76 56 M50 69 Q47 75 49 81 M70 69 Q73 75 71 81 M51 88 Q60 92 69 88', stroke:'age', strokeWidth:.5, opacity:.34 },
  ]},

  // Male facial art stays direct and age-specific; no beard/headwear system in the unified runtime.
  { id:'layer.features.male.child', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46.5 45 Q50 43.8 54.5 45 M65.5 45 Q70 43.8 73.5 45', stroke:'ink', strokeWidth:1.45 },
    { kind:'path', d:'M44.5 51 Q50 48.5 55.5 51 M64.5 51 Q70 48.5 75.5 51', stroke:'ink', strokeWidth:1.4 },
    { kind:'circle', cx:50, cy:51, r:.55, fill:'ink' }, { kind:'circle', cx:70, cy:51, r:.55, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 64 64.5 62', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M55 73 Q60 74.5 65 73', stroke:'ink', strokeWidth:1.15 },
  ]},
  { id:'layer.features.male.youth', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45.5 45 Q50 42.7 55.5 45 M64.5 45 Q70 42.7 74.5 45', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M45 51 Q50 49 55 51 M65 51 Q70 49 75 51', stroke:'ink', strokeWidth:1.45 },
    { kind:'circle', cx:50, cy:51, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:51, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 63 60 66 Q62.5 67 65.5 64.5', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M54 75 Q60 76 66 75', stroke:'ink', strokeWidth:1.25 },
  ]},
  { id:'layer.features.male.adult', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45 45.5 Q50 43 55.5 45.5 M64.5 45.5 Q70 43 75 45.5', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M45 52 Q50 49.5 55 52 M65 52 Q70 49.5 75 52', stroke:'ink', strokeWidth:1.45 },
    { kind:'circle', cx:50, cy:52, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:52, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 64 60 67 Q63 68 66 65', stroke:'ink', strokeWidth:1.2 },
    { kind:'path', d:'M53.5 76 Q60 76.5 66.5 76', stroke:'ink', strokeWidth:1.3 },
  ]},
  { id:'layer.features.male.middle', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45 46 Q50 44 55.5 46 M64.5 46 Q70 44 75 46', stroke:'ink', strokeWidth:2 },
    { kind:'path', d:'M45 52.5 Q50 50.5 55 52.5 M65 52.5 Q70 50.5 75 52.5', stroke:'ink', strokeWidth:1.4 },
    { kind:'circle', cx:50, cy:52.5, r:.56, fill:'ink' }, { kind:'circle', cx:70, cy:52.5, r:.56, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 65 60 68 Q63 69 66 66', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M53.5 77 Q60 77.2 66.5 77', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M44 61 Q49 63 53 62 M67 62 Q72 63 76 61', stroke:'age', strokeWidth:.5, opacity:.22 },
  ]},
  { id:'layer.features.male.elder', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 47 Q50 45.5 54.5 46.5 M65.5 46.5 Q70 45.5 74 47', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M45 53 Q50 51.5 55 53 M65 53 Q70 51.5 75 53', stroke:'ink', strokeWidth:1.3 },
    { kind:'circle', cx:50, cy:53, r:.5, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.5, fill:'ink' },
    { kind:'path', d:'M59 54 Q58 66 60 69 Q63 70 66.5 66.5', stroke:'ink', strokeWidth:1.12 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M44 57 Q49 60 54 58 M66 58 Q71 60 76 57 M50 70 Q47 76 49 82 M70 70 Q73 76 71 82', stroke:'age', strokeWidth:.5, opacity:.3 },
  ]},

  // Stage body art. Neck is behind garment so the collar owns the neck root.
  { id:'layer.neck.child', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M55 78 C55 82 54 86 52.5 90.5 Q60 94 67.5 90.5 C66 86 65 82 65 78Z', fill:'skin' },
    { kind:'path', d:'M55 80 Q54.5 85 53 89.5 M65 80 Q65.5 85 67 89.5', stroke:'ink', strokeWidth:.48, opacity:.52 },
  ]},
  { id:'layer.body.child', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M34 150 C35 129 39 108 47 93 L53 91 Q60 97 67 91 L73 93 C81 108 85 129 86 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.8 },
    { kind:'path', d:'M52 90 Q60 96 68 90 L66 94 Q60 99 54 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
  ]},
  { id:'layer.neck.youth', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54 82 C54 88 53 94 51.5 98.5 Q60 102 68.5 98.5 C67 94 66 88 66 82Z', fill:'skin' },
    { kind:'path', d:'M54.5 84 Q53.5 91 52 97 M65.5 84 Q66.5 91 68 97', stroke:'ink', strokeWidth:.5, opacity:.56 },
  ]},
  { id:'layer.body.youth', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M23 150 C25 131 29 113 43 96 L50 91 L60 101 L73 90 L79 96 C92 111 98 131 100 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M49 90 L60 100 L57.2 104 L46 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M73 89 L60 100 L63 104 L78 94Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M60 100 L69 106', stroke:'ink', strokeWidth:.38, opacity:.34 },
  ]},
  { id:'layer.neck.adult', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54 87 C54 91 53 96 51.5 100 Q60 104 68.5 100 C67 96 66 91 66 87Z', fill:'skin' },
    { kind:'path', d:'M54.5 89 Q53.5 95 52 99 M65.5 89 Q66.5 95 68 99', stroke:'ink', strokeWidth:.52, opacity:.58 },
  ]},
  { id:'layer.body.adult', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M16 150 C18 132 23 113 43 95 L50 92 L60 101 L71 93 L77 95 C97 113 102 132 104 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M49 91 L60 100.5 L57.2 105 L45.5 95Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M71.5 92 L60 100.5 L63 105 L76.5 96Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M60 100.5 L70.5 107.5', stroke:'ink', strokeWidth:.4, opacity:.36 },
  ]},
  { id:'layer.neck.middle', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54 88 C54 92 53 96 52 99.5 Q60 103 68 99.5 C67 96 66 92 66 88Z', fill:'skin' },
    { kind:'path', d:'M54.5 90 Q53.8 95 52.5 99 M65.5 90 Q66.2 95 67.5 99', stroke:'ink', strokeWidth:.5, opacity:.54 },
    { kind:'path', d:'M56 93 Q57 97 56.5 99.5 M64 93 Q63 97 63.5 99.5', stroke:'age', strokeWidth:.3, opacity:.1 },
  ]},
  { id:'layer.body.middle', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M18 150 C20 132 25 114 42 97 L49 94 L60 102 L73 95 L79 99 C96 115 101 132 103 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.12 },
    { kind:'path', d:'M48.5 93 L60 101.5 L57 106 L44.5 97Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M73.5 94 L60 101.5 L63.2 106 L78 99Z', fill:'collar', stroke:'ink', strokeWidth:.45 },
    { kind:'path', d:'M52 97.5 L60 102.5 L68.5 98.2', stroke:'collar', strokeWidth:.65, opacity:.62 },
  ]},
  { id:'layer.neck.elder', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M55.5 91 C55.5 94 55 97 54.5 99.5 Q60 102 65.5 99.5 C65 97 64.5 94 64.5 91Z', fill:'skin' },
    { kind:'path', d:'M56 93 Q55.5 96.5 55 99 M64 93 Q64.5 96.5 65 99', stroke:'ink', strokeWidth:.46, opacity:.46 },
    { kind:'path', d:'M57 94 Q58 97 57.5 99.5 M63 94 Q62 97 62.5 99.5', stroke:'age', strokeWidth:.34, opacity:.14 },
  ]},
  { id:'layer.body.elder', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M27 150 C29 136 34 117 45 106 L50 102 Q60 106 70 102 L75 105 C87 118 92 136 94 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M49 100 Q60 106 71 100 L69 105 Q60 110 51 105Z', fill:'collar', stroke:'ink', strokeWidth:.42 },
    { kind:'path', d:'M52 103 Q60 107 68 103', stroke:'collar', strokeWidth:.72, opacity:.64 },
  ]},

  // Outfit is a saved style ID. Wealth only affects the initial default pick.
  { id:'layer.outfit.poor', slot:'outfit', z:21, shapes:[
    { kind:'path', d:'M31 119 Q37 116 44 119 M84 124 L91 122', stroke:'accent', strokeWidth:.68, opacity:.42 },
  ]},
  { id:'layer.outfit.plain', slot:'outfit', z:21, shapes:[
    { kind:'path', d:'M36 119 Q60 126 84 119', stroke:'accent', strokeWidth:.82, opacity:.46 },
  ]},
  { id:'layer.outfit.comfortable', slot:'outfit', z:21, shapes:[
    { kind:'path', d:'M35 116 Q60 124 85 116 M39 122 Q60 128 81 122', stroke:'accent', strokeWidth:.9, opacity:.56 },
  ]},
  { id:'layer.outfit.wealthy', slot:'outfit', z:21, shapes:[
    { kind:'path', d:'M33 114 Q60 124 87 114 M37 121 Q60 129 83 121 M42 128 Q60 133 78 128', stroke:'accent', strokeWidth:1, opacity:.62 },
  ]},

  // Hair is final canvas art: no HeadProfile anchors, no mask, no accessory slot.
  { id:'layer.hair.child-double-bun.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M44 35 C43 32 45 29 49 28 C52 27 55 29 55 32 C55 35 52 37 49 38 C46 38 44 37 44 35Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M76 34 C77 31 75 29 72 28 C69 27 66 29 66 32 C66 35 69 37 72 37 C74 37 76 36 76 34Z', fill:'hair', stroke:'ink', strokeWidth:.58 },
    { kind:'path', d:'M49 36 Q51 40 55 42 M71 36 Q69 40 66 42', stroke:'hair', strokeWidth:2.2 },
  ]},
  { id:'layer.hair.child-double-bun.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M40 51 C41 39 47 31 57 28 Q60 27 62 29 C72 31 79 39 80 51 C74 45 68 42 62 41 Q60 39 59 35 Q58 39 56 41 C50 42 45 45 40 51Z', fill:'hair' },
    { kind:'path', d:'M44 47 Q43 50 44 53 M76 47 Q77 50 76 53', stroke:'hair', strokeWidth:.72, opacity:.72 },
  ]},

  { id:'layer.hair.youth-halfbound.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M62 31 C63 27 67 25 71 26 C75 27 78 30 77 33 C75 36 71 37 67 36 C64 35 62 33 62 31Z', fill:'hair', stroke:'ink', strokeWidth:.6 },
    { kind:'path', d:'M50 53 C54 62 55 75 54 87 C53 98 51 108 48 116 C46 122 42 125 39 123 C37 120 39 115 41 110 C44 101 46 91 46 81 C46 69 47 59 50 53Z', fill:'hair', stroke:'ink', strokeWidth:.68 },
    { kind:'path', d:'M70 53 C66 62 65 76 66 89 C67 102 70 113 73 121 C75 126 79 129 82 126 C84 123 82 118 80 113 C77 103 75 92 75 81 C75 69 73 59 70 53Z', fill:'hair', stroke:'ink', strokeWidth:.7 },
  ]},
  { id:'layer.hair.youth-halfbound.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M59 23 C52 23 45 29 41 37 C40 40 40 43 41 46 C46 40 51 37 57 36 C59 32 60 27 59 23Z', fill:'hair' },
    { kind:'path', d:'M61 23 C68 23 75 29 79 37 C80 40 80 43 79 46 C74 40 69 38 63 37 C61 32 60 27 61 23Z', fill:'hair' },
    { kind:'path', d:'M44.5 43 Q44 47 45.5 50 M75.5 43 Q76 47 74.5 50', stroke:'hair', strokeWidth:.78, opacity:.78 },
  ]},

  { id:'layer.hair.adult-low-bun.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M74 43 C80 52 82 65 80 76 C79 82 76 87 72 90 C75 88 79 87 83 87 C89 86 95 88 97 92 C99 96 96 100 91 102 C85 104 78 102 73 98 C68 94 68 89 71 85 C74 75 76 59 74 43Z', fill:'hair', stroke:'ink', strokeWidth:.68 },
    { kind:'path', d:'M77 61 Q76 74 73 84 M82 91 Q89 90 94 94', stroke:'hair-accent', strokeWidth:.34, opacity:.09 },
  ]},
  { id:'layer.hair.adult-low-bun.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M59 23 C52 23 45 29 41 37 C40 40 40 43 41 46 C46 40 51 37 57 36 C59 32 60 27 59 23Z', fill:'hair' },
    { kind:'path', d:'M61 23 C68 23 75 29 79 37 C80 40 80 43 79 46 C74 40 69 37 63 36 C61 32 60 27 61 23Z', fill:'hair' },
    { kind:'path', d:'M60 24 L60 33', stroke:'hair-accent', strokeWidth:.34, opacity:.09 },
  ]},

  { id:'layer.hair.elder-low-bun.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M73 47 C78 56 80 68 78 79 C77 84 74 88 71 90 C75 88 80 87 85 88 C90 88 93 90 93 93 C93 96 89 98 84 98 C79 98 75 96 72 94 C69 92 69 89 71 86 C73 77 75 62 73 47Z', fill:'hair', stroke:'ink', strokeWidth:.58 },
    { kind:'path', d:'M79 91 Q85 90 89 93', stroke:'hair-accent', strokeWidth:.3, opacity:.09 },
  ]},
  { id:'layer.hair.elder-low-bun.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M41 52 C41 40 47 31 56 27 Q59 26 60 29 Q61 26 64 27 C73 30 79 40 79 52 C74 46 69 43 63 42 Q61 37 60 30 Q59 37 57 42 C51 43 46 46 41 52Z', fill:'hair' },
    { kind:'path', d:'M60 27 Q60 31 60 35', stroke:'skin', strokeWidth:1.25, opacity:.92 },
    { kind:'path', d:'M49 38 Q53 34 57 32 M63 32 Q68 34 72 39', stroke:'hair-accent', strokeWidth:.26, opacity:.07 },
  ]},
];

  // Minimal male hair set for live runtime coverage. Final-canvas art only.
  { id:'layer.hair.male-child-tied.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:60, cy:28, rx:5.5, ry:4.2, fill:'hair', stroke:'ink', strokeWidth:.5 },
  ]},
  { id:'layer.hair.male-child-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M40 51 C41 39 47 31 57 28 Q60 26 63 28 C73 31 79 39 80 51 C74 45 68 42 62 41 Q60 38 59 34 Q57 39 55 41 C49 42 44 46 40 51Z', fill:'hair' },
  ]},
  { id:'layer.hair.male-youth-tied.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:60, cy:22, rx:6.5, ry:5.2, fill:'hair', stroke:'ink', strokeWidth:.55 },
    { kind:'path', d:'M76 44 Q80 57 78 72 Q77 80 74 84', stroke:'hair', strokeWidth:4.5, opacity:.95 },
  ]},
  { id:'layer.hair.male-youth-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39 51 Q41 33 53 25 Q60 20 67 24 Q78 31 81 51 Q72 43 64 41 Q60 37 60 31 Q58 37 55 41 Q47 43 39 51Z', fill:'hair' },
  ]},
  { id:'layer.hair.male-adult-tied.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:61, cy:21, rx:7, ry:5.4, fill:'hair', stroke:'ink', strokeWidth:.6 },
    { kind:'path', d:'M77 45 Q81 59 79 74 Q78 82 74 87', stroke:'hair', strokeWidth:4.8, opacity:.95 },
  ]},
  { id:'layer.hair.male-adult-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M38 52 Q40 33 52 25 Q60 20 68 24 Q80 32 82 52 Q73 43 64 41 Q60 37 60 31 Q57 37 54 41 Q46 43 38 52Z', fill:'hair' },
  ]},
  { id:'layer.hair.male-elder-tied.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:62, cy:25, rx:5.5, ry:4.2, fill:'hair', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M76 49 Q79 61 77 75 Q76 82 73 86', stroke:'hair', strokeWidth:3.8, opacity:.88 },
  ]},
  { id:'layer.hair.male-elder-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M41 53 Q43 39 51 31 Q56 27 59 29 Q61 27 65 29 Q75 35 79 53 Q72 47 65 44 Q62 40 60 34 Q58 40 55 44 Q48 46 41 53Z', fill:'hair' },
    { kind:'path', d:'M60 29 L60 35', stroke:'skin', strokeWidth:1, opacity:.88 },
  ]},

export const HAIR_STYLES: HairStyleDefinition[] = [
  { id:'hair.child.double-bun', label:'女童双小髻', genders:['female'], lifeStages:['child','teen'], backLayerId:'layer.hair.child-double-bun.back', frontLayerId:'layer.hair.child-double-bun.front', baseWeight:1 },
  { id:'hair.youth.halfbound', label:'少女半束后披', genders:['female'], lifeStages:['young-adult'], backLayerId:'layer.hair.youth-halfbound.back', frontLayerId:'layer.hair.youth-halfbound.front', baseWeight:1 },
  { id:'hair.adult.low-bun', label:'成年低髻', genders:['female'], lifeStages:['adult','middle-age'], backLayerId:'layer.hair.adult-low-bun.back', frontLayerId:'layer.hair.adult-low-bun.front', baseWeight:1 },
  { id:'hair.elder.low-bun', label:'老年花白低髻', genders:['female'], lifeStages:['elder'], backLayerId:'layer.hair.elder-low-bun.back', frontLayerId:'layer.hair.elder-low-bun.front', baseWeight:1 },
  { id:'hair.male.child-tied', label:'男童小束发', genders:['male'], lifeStages:['child','teen'], backLayerId:'layer.hair.male-child-tied.back', frontLayerId:'layer.hair.male-child-tied.front', baseWeight:1 },
  { id:'hair.male.youth-tied', label:'青年男子束发', genders:['male'], lifeStages:['young-adult'], backLayerId:'layer.hair.male-youth-tied.back', frontLayerId:'layer.hair.male-youth-tied.front', baseWeight:1 },
  { id:'hair.male.adult-tied', label:'成年男子束发', genders:['male'], lifeStages:['adult','middle-age'], backLayerId:'layer.hair.male-adult-tied.back', frontLayerId:'layer.hair.male-adult-tied.front', baseWeight:1 },
  { id:'hair.male.elder-tied', label:'老年男子收束发', genders:['male'], lifeStages:['elder'], backLayerId:'layer.hair.male-elder-tied.back', frontLayerId:'layer.hair.male-elder-tied.front', baseWeight:1 },
];

export const OUTFIT_STYLES: OutfitStyleDefinition[] = [
  { id:'outfit.poor.v2', label:'贫寒单层衣', wealthTiers:['poor'], layerAssetIds:['layer.outfit.poor'], baseWeight:1 },
  { id:'outfit.plain.v2', label:'普通衣', wealthTiers:['plain'], layerAssetIds:['layer.outfit.plain'], baseWeight:1 },
  { id:'outfit.comfortable.v2', label:'殷实叠领衣', wealthTiers:['comfortable'], layerAssetIds:['layer.outfit.comfortable'], baseWeight:1 },
  { id:'outfit.wealthy.v2', label:'富裕层领衣', wealthTiers:['wealthy'], layerAssetIds:['layer.outfit.wealthy'], baseWeight:1 },
];

export function layerById(id: string) {
  const layer = VECTOR_LAYERS.find((item)=>item.id===id);
  if (!layer) throw new Error('Unknown V8.4 vector layer: '+id);
  return layer;
}

export function faceFamilyById(id: string) {
  const family = FACE_FAMILIES.find((item)=>item.id===id);
  if (!family) throw new Error('Unknown V8.4 FaceFamily: '+id);
  return family;
}

export function hairStyleById(id: string) {
  const style = HAIR_STYLES.find((item)=>item.id===id);
  if (!style) throw new Error('Unknown V8.4 HairStyle: '+id);
  return style;
}

export function outfitStyleById(id: string) {
  const style = OUTFIT_STYLES.find((item)=>item.id===id);
  if (!style) throw new Error('Unknown V8.4 OutfitStyle: '+id);
  return style;
}

export function stageProfileForLifeStage(lifeStage: PortraitStageProfile['lifeStages'][number]) {
  const profile = PORTRAIT_STAGE_PROFILES.find((item)=>item.lifeStages.includes(lifeStage));
  if (!profile) throw new Error('Unknown V8.4 stage profile for '+lifeStage);
  return profile;
}
