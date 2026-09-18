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
    { kind:'path', d:'M60 24 C46 24 40 34 40 50 C40 66 46 81 53 89 Q60 94 67 89 C74 81 80 66 80 50 C80 34 74 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M46 44.2 Q50 42.8 54.5 44.2 M65.5 44.2 Q70 42.8 74 44.2', stroke:'ink', strokeWidth:1.35 },
    { kind:'path', d:'M45.8 50.7 Q50 48.8 54.4 50.7 M65.6 50.7 Q70 48.8 74.2 50.7', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M46.8 52.2 Q50 53 53.3 52.1 M66.7 52.1 Q70 53 73.2 52.2', stroke:'ink', strokeWidth:.55, opacity:.65 },
    { kind:'circle', cx:50.1, cy:51.1, r:.72, fill:'ink' }, { kind:'circle', cx:69.9, cy:51.1, r:.72, fill:'ink' },
    { kind:'path', d:'M59.2 54 Q58.6 62.5 60.2 65.5 Q62 66.3 64.1 64.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M54.5 74.2 Q60 76.2 65.5 74.1', stroke:'ink', strokeWidth:1.12 },
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
    { kind:'path', d:'M60 25 C44 25 37.5 36 37.5 51 C37.5 66 44 78 52 85 Q60 90 68 85 C76 78 82.5 66 82.5 51 C82.5 36 76 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M45 45 Q49.5 43.7 54 44.7 M66 44.7 Q70.5 43.7 75 45', stroke:'ink', strokeWidth:1.38 },
    { kind:'path', d:'M44.8 51 Q49.5 49.1 54.2 51 M65.8 51 Q70.5 49.1 75.2 51', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M46 52.5 Q49.5 53.4 53 52.4 M67 52.4 Q70.5 53.4 74 52.5', stroke:'ink', strokeWidth:.56, opacity:.65 },
    { kind:'circle', cx:49.6, cy:51.4, r:.76, fill:'ink' }, { kind:'circle', cx:70.4, cy:51.4, r:.76, fill:'ink' },
    { kind:'path', d:'M59.2 54.5 Q58.8 62 60.1 64.8 Q61.7 65.7 63.8 64.2', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.8 73.4 Q60 75.1 65.2 73.4', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M60 22.5 C48 22.5 42 33 42 51 C42 68 47 83 54 91 Q60 96 66 91 C73 83 78 68 78 51 C78 33 72 22.5 60 22.5Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M46.5 44 Q50.3 42.5 54.5 43.9 M65.5 43.9 Q69.7 42.5 73.5 44', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.8 50.8 Q50 49.1 54.6 50.6 M65.4 50.6 Q70 49.1 74.2 50.8', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.5 51.9 M66.5 51.9 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.5, opacity:.62 },
    { kind:'circle', cx:50, cy:51.1, r:.65, fill:'ink' }, { kind:'circle', cx:70, cy:51.1, r:.65, fill:'ink' },
    { kind:'path', d:'M59.1 53.8 Q58.5 63.1 60 66.3 Q61.8 67.2 64 65.3', stroke:'ink', strokeWidth:1.03 },
    { kind:'path', d:'M54.3 75.5 Q60 77 65.7 75.2', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M60 24 C45 24 37 35 37 50 C37 63 43 75 51 84 Q60 92 69 84 C77 75 83 63 83 50 C83 35 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M44.5 44.8 Q49 43.1 53.7 44.5 M66.3 44.5 Q71 43.1 75.5 44.8', stroke:'ink', strokeWidth:1.42 },
    { kind:'path', d:'M44.3 50.9 Q49 49 54 50.9 M66 50.9 Q71 49 75.7 50.9', stroke:'ink', strokeWidth:1.17 },
    { kind:'path', d:'M45.6 52.4 Q49 53.2 52.6 52.3 M67.4 52.3 Q71 53.2 74.4 52.4', stroke:'ink', strokeWidth:.54, opacity:.64 },
    { kind:'circle', cx:49, cy:51.3, r:.72, fill:'ink' }, { kind:'circle', cx:71, cy:51.3, r:.72, fill:'ink' },
    { kind:'path', d:'M59 54 Q58.4 62.2 60 65.2 Q62 66.1 64.3 64.3', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M53.8 73.8 Q60 75.2 66.2 73.7', stroke:'ink', strokeWidth:1.1 },
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
    { kind:'path', d:'M60 24 C45 24 39 34 39 50 C39 65 43 78 50 86 Q60 92 70 86 C77 78 81 65 81 50 C81 34 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M45 44.3 Q49.8 43.4 54.7 44.3 M65.3 44.3 Q70.2 43.4 75 44.3', stroke:'ink', strokeWidth:1.48 },
    { kind:'path', d:'M44.8 50.8 Q49.8 49.2 54.8 50.8 M65.2 50.8 Q70.2 49.2 75.2 50.8', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M46.2 52.2 Q49.8 52.9 53.4 52.2 M66.6 52.2 Q70.2 52.9 73.8 52.2', stroke:'ink', strokeWidth:.52, opacity:.64 },
    { kind:'circle', cx:49.8, cy:51.2, r:.7, fill:'ink' }, { kind:'circle', cx:70.2, cy:51.2, r:.7, fill:'ink' },
    { kind:'path', d:'M59.1 54 Q58.6 62.7 60.2 65.6 Q62 66.3 64.2 64.6', stroke:'ink', strokeWidth:1.04 },
    { kind:'path', d:'M53.8 74.6 Q60 75.5 66.2 74.5', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M60 24 C45 24 39 35 39 51 C39 65 45 79 53 89 Q60 96 67 89 C75 79 81 65 81 51 C81 35 75 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M45.5 44.5 Q50 42.9 54.4 44.3 M65.6 44.3 Q70 42.9 74.5 44.5', stroke:'ink', strokeWidth:1.3 },
    { kind:'path', d:'M45.2 50.9 Q50 48.9 54.6 50.8 M65.4 50.8 Q70 48.9 74.8 50.9', stroke:'ink', strokeWidth:1.12 },
    { kind:'path', d:'M46.5 52.3 Q50 53.1 53.4 52.2 M66.6 52.2 Q70 53.1 73.5 52.3', stroke:'ink', strokeWidth:.5, opacity:.62 },
    { kind:'circle', cx:50, cy:51.3, r:.68, fill:'ink' }, { kind:'circle', cx:70, cy:51.3, r:.68, fill:'ink' },
    { kind:'path', d:'M59.3 54 Q58.7 62.6 60.2 65.8 Q62 66.6 64.1 64.9', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.4 74.7 Q60 76.7 65.6 74.2', stroke:'ink', strokeWidth:1.1 },
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
    { kind:'path', d:'M44.8 45 Q50 43 55.2 45 M64.8 45 Q70 43 75.2 45', stroke:'ink', strokeWidth:1.65 },
    { kind:'path', d:'M44.8 51.5 Q50 49.7 55.2 51.4 M64.8 51.4 Q70 49.7 75.2 51.5', stroke:'ink', strokeWidth:1.16 },
    { kind:'path', d:'M46 52.8 Q50 53.4 54 52.7 M66 52.7 Q70 53.4 74 52.8', stroke:'ink', strokeWidth:.5, opacity:.62 },
    { kind:'circle', cx:50, cy:51.8, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.8, r:.72, fill:'ink' },
    { kind:'path', d:'M59.1 54.5 Q58.5 63.5 60.2 67 Q62.4 68 65 65.6', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M53.8 76 Q60 76.8 66.2 75.8', stroke:'ink', strokeWidth:1.2 },
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
    { kind:'path', d:'M60 25 C43 25 36 37 36 53 C36 68 43 81 51 88 Q60 94 69 88 C77 81 84 68 84 53 C84 37 77 25 60 25Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
    { kind:'path', d:'M43.8 45.5 Q49 44 54.5 45.3 M65.5 45.3 Q71 44 76.2 45.5', stroke:'ink', strokeWidth:1.7 },
    { kind:'path', d:'M43.8 51.7 Q49 49.8 54.5 51.7 M65.5 51.7 Q71 49.8 76.2 51.7', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.2 53 Q49 53.8 52.9 52.9 M67.1 52.9 Q71 53.8 74.8 53', stroke:'ink', strokeWidth:.52, opacity:.62 },
    { kind:'circle', cx:49, cy:52.1, r:.75, fill:'ink' }, { kind:'circle', cx:71, cy:52.1, r:.75, fill:'ink' },
    { kind:'path', d:'M59 54.8 Q58.5 63.2 60.2 66.5 Q62.4 67.5 65 65.5', stroke:'ink', strokeWidth:1.14 },
    { kind:'path', d:'M53.7 75.5 Q60 76.3 66.3 75.4', stroke:'ink', strokeWidth:1.18 },
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
    { kind:'path', d:'M60 24 C44 24 37 35 37 52 C37 67 41 81 48 89 Q60 96 72 89 C79 81 83 67 83 52 C83 35 76 24 60 24Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
    { kind:'path', d:'M43.8 45 Q49.3 43.7 55 45 M65 45 Q70.7 43.7 76.2 45', stroke:'ink', strokeWidth:1.78 },
    { kind:'path', d:'M44 51.8 Q49.3 50.2 54.8 51.7 M65.2 51.7 Q70.7 50.2 76 51.8', stroke:'ink', strokeWidth:1.16 },
    { kind:'path', d:'M45.5 53 Q49.3 53.6 53.2 52.9 M66.8 52.9 Q70.7 53.6 74.5 53', stroke:'ink', strokeWidth:.5, opacity:.6 },
    { kind:'circle', cx:49.3, cy:52.1, r:.7, fill:'ink' }, { kind:'circle', cx:70.7, cy:52.1, r:.7, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.4 63.7 60.1 67.1 Q62.6 68.1 65.3 65.8', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M53.2 76.2 Q60 76.5 66.8 76.1', stroke:'ink', strokeWidth:1.22 },
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
    { kind:'path', d:'M60 23 C47 23 41 34 41 52 C41 70 46 86 52 94 Q60 99 68 94 C74 86 79 70 79 52 C79 34 73 23 60 23Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
    { kind:'path', d:'M45 44.5 Q49.7 42.8 54.8 44.4 M65.2 44.4 Q70.3 42.8 75 44.5', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M45 51.3 Q49.7 49.7 54.7 51.2 M65.3 51.2 Q70.3 49.7 75 51.3', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.2 52.6 Q49.7 53.2 53.3 52.5 M66.7 52.5 Q70.3 53.2 73.8 52.6', stroke:'ink', strokeWidth:.48, opacity:.6 },
    { kind:'circle', cx:49.7, cy:51.7, r:.66, fill:'ink' }, { kind:'circle', cx:70.3, cy:51.7, r:.66, fill:'ink' },
    { kind:'path', d:'M59 54 Q58.3 64.5 60.2 68.2 Q62.5 69.2 65 66.7', stroke:'ink', strokeWidth:1.14 },
    { kind:'path', d:'M53.5 78 Q60 78.6 66.5 77.8', stroke:'ink', strokeWidth:1.16 },
  ]},
  { id:'layer.face.male-long.elder', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 26 C47 26 41 37 41 54 C41 72 46 87 52 95 Q60 100 68 95 C74 87 79 72 79 54 C79 37 73 26 60 26Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
  ]},

  // One direct feature asset per age stage. No runtime facial morph stack.
  { id:'layer.features.child', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
  ]},
  { id:'layer.features.youth', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 44.5 Q50 43 55 44.5 M65 44.5 Q70 43 74 44.5', stroke:'ink', strokeWidth:1.35 },
    { kind:'path', d:'M45.2 51 Q50 49.1 54.8 51 M65.2 51 Q70 49.1 74.8 51', stroke:'ink', strokeWidth:1.12 },
    { kind:'path', d:'M46.4 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.6 52.3', stroke:'ink', strokeWidth:.5, opacity:.6 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59.1 54 Q58.5 62 60.1 65 Q62 65.9 64.4 64', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.8 74 Q60 75.8 65.2 74', stroke:'ink', strokeWidth:1.08 },
  ]},
  { id:'layer.features.adult', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 44.7 Q50 43.1 55 44.7 M65 44.7 Q70 43.1 74 44.7', stroke:'ink', strokeWidth:1.4 },
    { kind:'path', d:'M45.3 51 Q50 49.1 54.7 51 M65.3 51 Q70 49.1 74.7 51', stroke:'ink', strokeWidth:1.12 },
    { kind:'path', d:'M46.5 52.4 Q50 53 53.5 52.3 M66.5 52.3 Q70 53 73.5 52.4', stroke:'ink', strokeWidth:.5, opacity:.6 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59.1 54 Q58.5 63 60.2 66 Q62 66.8 64.4 64.8', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M54.2 74.5 Q60 76 65.8 74.4', stroke:'ink', strokeWidth:1.1 },
  ]},
  { id:'layer.features.middle', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 45.5 Q50 44 55 45.2 M65 45.2 Q70 44 74 45.5', stroke:'ink', strokeWidth:1.32 },
    { kind:'path', d:'M45.3 51.7 Q50 50 54.7 51.7 M65.3 51.7 Q70 50 74.7 51.7', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 53 Q50 53.6 53.5 52.9 M66.5 52.9 Q70 53.6 73.5 53', stroke:'ink', strokeWidth:.48, opacity:.58 },
    { kind:'circle', cx:50, cy:52.1, r:.66, fill:'ink' }, { kind:'circle', cx:70, cy:52.1, r:.66, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.4 64 60.1 67 Q62 67.8 64.5 65.7', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 76 Q60 76.8 65.5 76', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M44 60 Q49 62 53 61 M67 61 Q72 62 76 60', stroke:'age', strokeWidth:.45, opacity:.18 },
  ]},
  { id:'layer.features.elder', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  // Male facial art stays direct and age-specific; no beard/headwear system in the unified runtime.
  { id:'layer.features.male.child', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46.5 45 Q50 44 54.5 45 M65.5 45 Q70 44 73.5 45', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 51 Q50 49.3 54.8 51 M65.2 51 Q70 49.3 74.8 51', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.5 52.3', stroke:'ink', strokeWidth:.46, opacity:.56 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 63.8 64.5 62', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M55 73 Q60 74.1 65 73', stroke:'ink', strokeWidth:1.08 },
  ]},
  { id:'layer.features.male.youth', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45.5 45 Q50 43.5 55.5 45 M64.5 45 Q70 43.5 74.5 45', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M45 51.2 Q50 49.5 55 51.2 M65 51.2 Q70 49.5 75 51.2', stroke:'ink', strokeWidth:1.1 },
    { kind:'path', d:'M46.3 52.5 Q50 53.1 53.7 52.5 M66.3 52.5 Q70 53.1 73.7 52.5', stroke:'ink', strokeWidth:.48, opacity:.58 },
    { kind:'circle', cx:50, cy:51.6, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.6, r:.7, fill:'ink' },
    { kind:'path', d:'M59 54 Q58.4 63 60.1 66 Q62.4 67 65 64.8', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M54 75 Q60 75.7 66 75', stroke:'ink', strokeWidth:1.12 },
  ]},
  { id:'layer.features.male.adult', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45 45.2 Q50 43.6 55.5 45.2 M64.5 45.2 Q70 43.6 75 45.2', stroke:'ink', strokeWidth:1.65 },
    { kind:'path', d:'M45 51.6 Q50 49.8 55 51.6 M65 51.6 Q70 49.8 75 51.6', stroke:'ink', strokeWidth:1.12 },
    { kind:'path', d:'M46.2 52.9 Q50 53.5 53.8 52.8 M66.2 52.8 Q70 53.5 73.8 52.9', stroke:'ink', strokeWidth:.5, opacity:.58 },
    { kind:'circle', cx:50, cy:52, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:52, r:.7, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.4 64 60.1 67 Q62.5 68 65.2 65.5', stroke:'ink', strokeWidth:1.14 },
    { kind:'path', d:'M53.5 76 Q60 76.5 66.5 76', stroke:'ink', strokeWidth:1.16 },
  ]},
  { id:'layer.features.male.middle', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45 45.8 Q50 44.2 55.5 45.8 M64.5 45.8 Q70 44.2 75 45.8', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M45 52 Q50 50.3 55 52 M65 52 Q70 50.3 75 52', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.2 53.2 Q50 53.8 53.8 53.1 M66.2 53.1 Q70 53.8 73.8 53.2', stroke:'ink', strokeWidth:.48, opacity:.56 },
    { kind:'circle', cx:50, cy:52.4, r:.66, fill:'ink' }, { kind:'circle', cx:70, cy:52.4, r:.66, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.4 64.5 60.2 67.8 Q62.5 68.7 65.2 66.1', stroke:'ink', strokeWidth:1.1 },
    { kind:'path', d:'M53.5 77 Q60 77.2 66.5 77', stroke:'ink', strokeWidth:1.1 },
    { kind:'path', d:'M44 61 Q49 63 53 62 M67 62 Q72 63 76 61', stroke:'age', strokeWidth:.45, opacity:.18 },
  ]},
  { id:'layer.features.male.elder', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M46 46.6 Q50 45.5 54.5 46.2 M65.5 46.2 Q70 45.5 74 46.6', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 52.7 Q50 51.2 54.8 52.7 M65.2 52.7 Q70 51.2 74.8 52.7', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.5 54 Q50 54.5 53.5 53.9 M66.5 53.9 Q70 54.5 73.5 54', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53.1, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53.1, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.7 Q58.2 65.7 60.1 69 Q62.7 70 65.5 66.7', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M45 58.5 Q49 60 53 58.8 M67 58.8 Q71 60 75 58.5 M50 70 Q48 76 49 82 M70 70 Q72 76 71 82', stroke:'age', strokeWidth:.45, opacity:.26 },
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
    { kind:'ellipse', cx:60, cy:27.5, rx:6.2, ry:4.1, fill:'hair', stroke:'ink', strokeWidth:.5 },
    { kind:'path', d:'M43 43 C41 54 42 67 45 77 Q47 84 51 88 L54 83 Q51 73 51 61 Q51 50 48 43Z', fill:'hair', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M77 43 C79 54 78 67 75 77 Q73 84 69 88 L66 83 Q69 73 69 61 Q69 50 72 43Z', fill:'hair', stroke:'ink', strokeWidth:.48 },
  ]},
  { id:'layer.hair.male-elder-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M42 49 C43 38.5 49.5 31 57 29 Q60 28 63 29 C70.5 31 77 38.5 78 49 C73.5 45 69 42.5 64 41 Q61.8 37.5 60 32 Q58.2 37.5 56 41 C51 42.5 46.5 45 42 49Z', fill:'hair' },
    { kind:'path', d:'M60 29.5 Q60 32 60 34.5', stroke:'hair-accent', strokeWidth:.42, opacity:.34 },
    { kind:'path', d:'M46 42 Q44.5 47 45 52 M74 42 Q75.5 47 75 52', stroke:'hair-accent', strokeWidth:.34, opacity:.26 },
  ]},

  // Fixed female.adult frame proof. These assets share one 120×150 canvas and never receive runtime offsets.
  { id:'layer.neck.female-adult-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54.5 86 C54.5 91 53.5 96 52 100 Q60 104 68 100 C66.5 96 65.5 91 65.5 86Z', fill:'skin' },
    { kind:'path', d:'M55 88 Q54 95 52.6 99 M65 88 Q66 95 67.4 99', stroke:'ink', strokeWidth:.5, opacity:.45 },
  ]},
  { id:'layer.features.female-adult-frame', slot:'face-detail', z:50, shapes:[
    { kind:'path', d:'M45.5 45.5 Q50 43.8 54.8 45 M65.2 45 Q70 43.8 74.5 45.5', stroke:'ink', strokeWidth:1.55 },
    { kind:'path', d:'M45 52 Q50 49.5 55 51.8 M65 51.8 Q70 49.5 75 52', stroke:'ink', strokeWidth:1.28 },
    { kind:'circle', cx:50.2, cy:51.7, r:.52, fill:'ink' }, { kind:'circle', cx:69.8, cy:51.7, r:.52, fill:'ink' },
    { kind:'path', d:'M59.2 54 Q58.5 62 60.2 65.5 Q62 66.5 64.2 64.5', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M54.2 75 Q60 77 65.8 74.8', stroke:'ink', strokeWidth:1.18 },
  ]},

  // 泛中国古代成年女性常服：交领、叠领、对襟都直接占有完整肩领轮廓。
  { id:'layer.outfit.female-adult.work-cross-collar', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M17 150 C19 130 26 111 42 98 L51 94 Q60 100 69 94 L78 98 C94 111 101 130 103 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.05 },
    { kind:'path', d:'M50 93 L61 101 L56.5 106 L44 97Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M69.5 93 L58.5 101.5 L63.5 106 L77 97.5Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M61 101 L72 109', stroke:'accent', strokeWidth:.7, opacity:.55 },
    { kind:'path', d:'M28 124 Q37 121 45 123', stroke:'accent', strokeWidth:.55, opacity:.35 },
  ]},
  { id:'layer.outfit.female-adult.plain-cross-collar', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M18 150 C20 129 27 109 43 97 L51 93 Q60 99 69 93 L77 97 C93 109 100 129 102 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.05 },
    { kind:'path', d:'M49.5 92.5 L61 100.5 L57 105.5 L43.5 96Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M70 92.5 L58.7 100.7 L63 105.5 L77.5 96.5Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M60.5 101 L70.5 108 M39 119 Q60 125 82 118.5', stroke:'accent', strokeWidth:.72, opacity:.5 },
  ]},
  { id:'layer.outfit.female-adult.layered-cross-collar', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M16 150 C18 128 25 108 42 96 L50 91.5 Q60 98 70 91.5 L78 96 C95 108 102 128 104 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.1 },
    { kind:'path', d:'M50 91 L61 99 L57.5 103.5 L46 95Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M70 91 L59 99.3 L63 103.8 L76 95Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M47 96 L60 105 L73 96', stroke:'accent', strokeWidth:1.35, opacity:.72 },
    { kind:'path', d:'M36 116 Q60 124 84 116 M40 123 Q60 128 80 122', stroke:'accent', strokeWidth:.72, opacity:.48 },
  ]},
  { id:'layer.outfit.female-adult.front-opening-jacket', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M15 150 C18 128 24 109 41 97 L49 93 Q60 98 71 93 L79 97 C96 109 102 128 105 150Z', fill:'cloth', stroke:'ink', strokeWidth:2.05 },
    { kind:'path', d:'M49 92 Q60 98 71 92 L68.5 98 Q60 102 51.5 98Z', fill:'collar', stroke:'ink', strokeWidth:.5 },
    { kind:'path', d:'M50 98 Q55 104 58 109 L58 150 M70 98 Q65 104 62 109 L62 150', stroke:'accent', strokeWidth:1.05, opacity:.68 },
    { kind:'path', d:'M58 112 L62 112 M58 124 L62 124', stroke:'accent', strokeWidth:.75, opacity:.55 },
  ]},

  // 成年女性发式以束、挽、盘为主，轮廓克制，不使用现代卷发或夸张饰件。
  { id:'layer.hair.female-adult-low-coil.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M74 42 C79 51 80 64 78 75 C77 82 74 88 70 91 C75 88 81 87 86 89 C92 91 94 95 91 99 C87 103 79 102 73 98 C68 94 67 90 70 85 C73 74 75 57 74 42Z', fill:'hair', stroke:'ink', strokeWidth:.65 },
  ]},
  { id:'layer.hair.female-adult-low-coil.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39.5 48 C40.5 33 48 23.5 59.5 22.5 C71.5 23 79.5 33 80.5 48 C75.5 42.5 70 39 64 37.5 Q61.8 33.5 60 27.5 Q58.2 33.5 56 37.5 C50 39 44.5 42.5 39.5 48Z', fill:'hair' },
    { kind:'path', d:'M60 24.5 Q60 28 60 31', stroke:'hair-accent', strokeWidth:.42, opacity:.22 },
    { kind:'path', d:'M43 43 Q42.2 48 43.7 52 M77 43 Q77.8 48 76.3 52', stroke:'hair-accent', strokeWidth:.34, opacity:.16 },
  ]},
  { id:'layer.hair.female-adult-round-coil.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:61, cy:23.5, rx:9.5, ry:6.8, fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M45 43 Q42 58 45 75 Q47 84 51 90 M75 43 Q78 58 75 75 Q73 84 69 90', stroke:'hair', strokeWidth:5.2, opacity:.92 },
  ]},
  { id:'layer.hair.female-adult-round-coil.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39 48 C40 33 47.5 23 59.5 22 C72 22.5 80 33 81 48 C76 42.5 70.5 39 64 37.5 Q61.8 33 60 27 Q58.2 33 56 37.5 C49.5 39 44 42.5 39 48Z', fill:'hair' },
    { kind:'path', d:'M60 23.5 Q60 27.5 60 30', stroke:'hair-accent', strokeWidth:.44, opacity:.22 },
  ]},
  { id:'layer.hair.female-adult-half-bound.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:60, cy:27, rx:6.5, ry:4.5, fill:'hair', stroke:'ink', strokeWidth:.55 },
    { kind:'path', d:'M47 48 C45 60 45 76 43 89 C42 98 39 107 36 114 C40 116 44 113 47 106 C50 97 52 84 52 71 C52 60 50 52 47 48Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M73 48 C75 60 75 76 77 89 C78 98 81 107 84 114 C80 116 76 113 73 106 C70 97 68 84 68 71 C68 60 70 52 73 48Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
  ]},
  { id:'layer.hair.female-adult-half-bound.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39.8 48.5 C40.8 33.5 48 23.5 59.5 22.5 C71.5 23 79.2 33.5 80.2 48.5 C75.2 42.7 69.8 39.3 63.7 37.7 Q61.7 33.5 60 27.8 Q58.3 33.5 56.3 37.7 C50.2 39.3 44.8 42.7 39.8 48.5Z', fill:'hair' },
    { kind:'path', d:'M60 24.5 Q60 28 60 31', stroke:'hair-accent', strokeWidth:.42, opacity:.2 },
    { kind:'path', d:'M43.5 44.5 Q42.8 50 44 55 M76.5 44.5 Q77.2 50 76 55', stroke:'hair-accent', strokeWidth:.34, opacity:.18 },
  ]},


  { id:'layer.neck.male-elder-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M53.5 88 C53.5 93 52.5 97 51.5 101 Q60 104 68.5 101 C67.5 97 66.5 93 66.5 88Z', fill:'skin' },
    { kind:'path', d:'M54.5 90 Q53.7 96 52.5 100 M65.5 90 Q66.3 96 67.5 100', stroke:'ink', strokeWidth:.48, opacity:.42 },
  ]},
  { id:'layer.body.male-elder-frame', slot:'outfit', z:18, shapes:[
    { kind:'path', d:'M22 150 C24 133 30 116 43 104 L50 100 Q60 104 70 100 L77 104 C90 116 96 133 98 150Z', fill:'cloth', stroke:'ink', strokeWidth:1.95 },
    { kind:'path', d:'M48.5 99 Q60 105 71.5 99 L69 105 Q60 109 51 105Z', fill:'collar', stroke:'ink', strokeWidth:.48 },
    { kind:'path', d:'M52 104 Q60 108 68 104', stroke:'accent', strokeWidth:.64, opacity:.42 },
  ]},
];

export const HAIR_STYLES: HairStyleDefinition[] = [
  { id:'hair.child.double-bun', label:'女童双小髻', genders:['female'], frameIds:['female.child'], backLayerId:'layer.hair.child-double-bun.back', frontLayerId:'layer.hair.child-double-bun.front', baseWeight:1 },
  { id:'hair.female.adult.low-coil', label:'成年女子低挽圆髻', genders:['female'], frameIds:['female.adult'], backLayerId:'layer.hair.female-adult-low-coil.back', frontLayerId:'layer.hair.female-adult-low-coil.front', baseWeight:1.2 },
  { id:'hair.female.adult.round-coil', label:'成年女子圆髻', genders:['female'], frameIds:['female.adult'], backLayerId:'layer.hair.female-adult-round-coil.back', frontLayerId:'layer.hair.female-adult-round-coil.front', baseWeight:1 },
  { id:'hair.female.adult.half-bound', label:'成年女子半束垂发', genders:['female'], frameIds:['female.adult'], backLayerId:'layer.hair.female-adult-half-bound.back', frontLayerId:'layer.hair.female-adult-half-bound.front', baseWeight:1 },
  { id:'hair.elder.low-bun', label:'老年花白低髻', genders:['female'], frameIds:['female.elder'], backLayerId:'layer.hair.elder-low-bun.back', frontLayerId:'layer.hair.elder-low-bun.front', baseWeight:1 },
  { id:'hair.male.child-tied', label:'男童小束发', genders:['male'], frameIds:['male.child'], backLayerId:'layer.hair.male-child-tied.back', frontLayerId:'layer.hair.male-child-tied.front', baseWeight:1 },
  { id:'hair.male.adult-tied', label:'成年男子束发', genders:['male'], frameIds:['male.adult'], backLayerId:'layer.hair.male-adult-tied.back', frontLayerId:'layer.hair.male-adult-tied.front', baseWeight:1 },
  { id:'hair.male.elder-tied', label:'老年男子收束发', genders:['male'], frameIds:['male.elder'], backLayerId:'layer.hair.male-elder-tied.back', frontLayerId:'layer.hair.male-elder-tied.front', baseWeight:1 },
];

export const OUTFIT_STYLES: OutfitStyleDefinition[] = [
  { id:'outfit.poor.v2', label:'兼容·贫寒单层衣', frameIds:['female.child','female.elder','male.child','male.adult','male.elder'], initialWealthTiers:['poor'], layerAssetIds:['layer.outfit.poor'], baseWeight:1 },
  { id:'outfit.plain.v2', label:'兼容·普通衣', frameIds:['female.child','female.elder','male.child','male.adult','male.elder'], initialWealthTiers:['plain'], layerAssetIds:['layer.outfit.plain'], baseWeight:1 },
  { id:'outfit.comfortable.v2', label:'兼容·殷实叠领衣', frameIds:['female.child','female.elder','male.child','male.adult','male.elder'], initialWealthTiers:['comfortable'], layerAssetIds:['layer.outfit.comfortable'], baseWeight:1 },
  { id:'outfit.wealthy.v2', label:'兼容·富裕层领衣', frameIds:['female.child','female.elder','male.child','male.adult','male.elder'], initialWealthTiers:['wealthy'], layerAssetIds:['layer.outfit.wealthy'], baseWeight:1 },
  { id:'outfit.female.adult.work-cross-collar', label:'成年女子粗布交领短衣', frameIds:['female.adult'], initialWealthTiers:['poor','plain'], layerAssetIds:['layer.outfit.female-adult.work-cross-collar'], fullFrame:true, baseWeight:1 },
  { id:'outfit.female.adult.plain-cross-collar', label:'成年女子素色交领衫', frameIds:['female.adult'], initialWealthTiers:['plain','comfortable'], layerAssetIds:['layer.outfit.female-adult.plain-cross-collar'], fullFrame:true, baseWeight:1.2 },
  { id:'outfit.female.adult.layered-cross-collar', label:'成年女子叠领襦衣', frameIds:['female.adult'], initialWealthTiers:['comfortable','wealthy'], layerAssetIds:['layer.outfit.female-adult.layered-cross-collar'], fullFrame:true, baseWeight:1 },
  { id:'outfit.female.adult.front-opening-jacket', label:'成年女子对襟罩衫', frameIds:['female.adult'], initialWealthTiers:['comfortable','wealthy'], layerAssetIds:['layer.outfit.female-adult.front-opening-jacket'], fullFrame:true, baseWeight:.9 },
];

export function layerById(id: string) {
  const layer = VECTOR_LAYERS.find((item)=>item.id===id);
  if (!layer) throw new Error('Unknown portrait vector layer: '+id);
  return layer;
}

export function faceFamilyById(id: string) {
  const family = FACE_FAMILIES.find((item)=>item.id===id);
  if (!family) throw new Error('Unknown portrait FaceFamily: '+id);
  return family;
}

export function hairStyleById(id: string) {
  const style = HAIR_STYLES.find((item)=>item.id===id);
  if (!style) throw new Error('Unknown portrait HairStyle: '+id);
  return style;
}

export function outfitStyleById(id: string) {
  const style = OUTFIT_STYLES.find((item)=>item.id===id);
  if (!style) throw new Error('Unknown portrait OutfitStyle: '+id);
  return style;
}

export function stageProfileForLifeStage(lifeStage: PortraitStageProfile['lifeStages'][number]) {
  const profile = PORTRAIT_STAGE_PROFILES.find((item)=>item.lifeStages.includes(lifeStage));
  if (!profile) throw new Error('Unknown portrait stage profile for '+lifeStage);
  return profile;
}
