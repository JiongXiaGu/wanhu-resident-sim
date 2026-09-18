import type { VectorLayerAsset } from '../types';

export const FACE_LAYERS: VectorLayerAsset[] = [
  { id:'layer.face.soft-oval.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 41 38 41 53 C41 68 47 78 54 82 Q60 86 66 82 C73 77 79 68 79 53 C79 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.round-soft.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 31 C45 30 39 40 39 54 C39 68 46 78 53 82 Q60 86 67 82 C74 78 81 68 81 54 C81 40 75 30 60 31Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.long-narrow.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 29 C49 29 43 38 43 53 C43 68 48 80 54 84 Q60 88 66 84 C72 80 77 68 77 53 C77 38 71 29 60 29Z', fill:'skin', stroke:'ink', strokeWidth:2.15 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.broad-cheek.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 39 39 39 54 C39 65 44 73 51 80 Q60 87 69 80 C76 73 81 65 81 54 C81 39 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.square-soft.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 38 40 53 C40 67 45 76 51 82 Q60 87 69 82 C75 76 80 67 80 53 C80 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.narrow-chin.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 39 40 53 C40 66 46 76 53 82 Q60 88 67 82 C74 76 80 66 80 53 C80 39 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M47 45 Q50.5 44 54 45 M66 45 Q69.5 44 73 45', stroke:'ink', strokeWidth:1.15 },
    { kind:'path', d:'M45.5 50.8 Q50 49 54.5 50.8 M65.5 50.8 Q70 49 74.5 50.8', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M46.8 52 Q50 52.7 53.2 52 M66.8 52 Q70 52.7 73.2 52', stroke:'ink', strokeWidth:.45, opacity:.55 },
    { kind:'circle', cx:50, cy:51.2, r:.72, fill:'ink' }, { kind:'circle', cx:70, cy:51.2, r:.72, fill:'ink' },
    { kind:'path', d:'M59.5 55 Q59 60.5 60.5 62.5 Q62 63.3 64 61.8', stroke:'ink', strokeWidth:.95 },
    { kind:'path', d:'M56 73 Q60 74.5 64 73', stroke:'ink', strokeWidth:1.05 },
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
    { kind:'path', d:'M47 46.5 Q50 45.6 54 46 M66 46 Q70 45.6 73 46.5', stroke:'ink', strokeWidth:1.18 },
    { kind:'path', d:'M45.5 52.6 Q50 51.1 54.5 52.4 M65.5 52.4 Q70 51.1 74.5 52.6', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.8 53.8 Q50 54.3 53.2 53.7 M66.8 53.7 Q70 54.3 73.2 53.8', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53, r:.58, fill:'ink' }, { kind:'circle', cx:70, cy:53, r:.58, fill:'ink' },
    { kind:'path', d:'M59 54.5 Q58.3 65 60.1 68.2 Q62.5 69.1 65.2 66.5', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M54.5 77.2 Q60 76.8 65.5 77.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M45 58 Q49 59.5 53 58.2 M67 58.2 Q71 59.5 75 58 M50 70 Q48 75 49 80 M70 70 Q72 75 71 80', stroke:'age', strokeWidth:.45, opacity:.28 },
  ]},

  { id:'layer.face.male-oval.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C47 29 40 38 40 53 C40 67 46 78 53 83 Q60 87 67 83 C74 78 80 67 80 53 C80 38 73 29 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
    { kind:'path', d:'M46.5 45 Q50 44 54.5 45 M65.5 45 Q70 44 73.5 45', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 51 Q50 49.3 54.8 51 M65.2 51 Q70 49.3 74.8 51', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.5 52.3', stroke:'ink', strokeWidth:.46, opacity:.56 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 63.8 64.5 62', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M55 73 Q60 74.1 65 73', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M46 46.3 Q50 45.1 54.5 45.9 M65.5 45.9 Q70 45.1 74 46.3', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 52.2 Q50 50.6 54.8 52.2 M65.2 52.2 Q70 50.6 74.8 52.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.5 54.6 Q50 55.1 53.5 54.4 M66.5 54.4 Q70 55.1 73.5 54.6', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53.1, r:.68, fill:'ink' }, { kind:'circle', cx:70, cy:53.1, r:.68, fill:'ink' },
    { kind:'path', d:'M59 54.7 Q58.2 65.7 60.1 69 Q62.7 70 65.5 66.7', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M45 58.5 Q49 60 53 58.8 M67 58.8 Q71 60 75 58.5 M50 70 Q48 76 49 82 M70 70 Q72 76 71 82', stroke:'age', strokeWidth:.45, opacity:.26 },
  ]},

  { id:'layer.face.male-round.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 31 C44 30 38 40 38 54 C38 67 45 78 52 82 Q60 87 68 82 C75 78 82 67 82 54 C82 40 76 30 60 31Z', fill:'skin', stroke:'ink', strokeWidth:2.25 },
    { kind:'path', d:'M46.5 45 Q50 44 54.5 45 M65.5 45 Q70 44 73.5 45', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 51 Q50 49.3 54.8 51 M65.2 51 Q70 49.3 74.8 51', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.5 52.3', stroke:'ink', strokeWidth:.46, opacity:.56 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 63.8 64.5 62', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M55 73 Q60 74.1 65 73', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M46 46.3 Q50 45.1 54.5 45.9 M65.5 45.9 Q70 45.1 74 46.3', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 52.2 Q50 50.6 54.8 52.2 M65.2 52.2 Q70 50.6 74.8 52.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.5 54.6 Q50 55.1 53.5 54.4 M66.5 54.4 Q70 55.1 73.5 54.6', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53.1, r:.68, fill:'ink' }, { kind:'circle', cx:70, cy:53.1, r:.68, fill:'ink' },
    { kind:'path', d:'M59 54.7 Q58.2 65.7 60.1 69 Q62.7 70 65.5 66.7', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M45 58.5 Q49 60 53 58.8 M67 58.8 Q71 60 75 58.5 M50 70 Q48 76 49 82 M70 70 Q72 76 71 82', stroke:'age', strokeWidth:.45, opacity:.26 },
  ]},

  { id:'layer.face.male-square.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 30 C46 30 39 39 39 54 C39 67 43 77 50 83 Q60 88 70 83 C77 77 81 67 81 54 C81 39 74 30 60 30Z', fill:'skin', stroke:'ink', strokeWidth:2.3 },
    { kind:'path', d:'M46.5 45 Q50 44 54.5 45 M65.5 45 Q70 44 73.5 45', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 51 Q50 49.3 54.8 51 M65.2 51 Q70 49.3 74.8 51', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.5 52.3', stroke:'ink', strokeWidth:.46, opacity:.56 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 63.8 64.5 62', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M55 73 Q60 74.1 65 73', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M46 46.3 Q50 45.1 54.5 45.9 M65.5 45.9 Q70 45.1 74 46.3', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 52.2 Q50 50.6 54.8 52.2 M65.2 52.2 Q70 50.6 74.8 52.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.5 54.6 Q50 55.1 53.5 54.4 M66.5 54.4 Q70 55.1 73.5 54.6', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53.1, r:.68, fill:'ink' }, { kind:'circle', cx:70, cy:53.1, r:.68, fill:'ink' },
    { kind:'path', d:'M59 54.7 Q58.2 65.7 60.1 69 Q62.7 70 65.5 66.7', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M45 58.5 Q49 60 53 58.8 M67 58.8 Q71 60 75 58.5 M50 70 Q48 76 49 82 M70 70 Q72 76 71 82', stroke:'age', strokeWidth:.45, opacity:.26 },
  ]},

  { id:'layer.face.male-long.child', slot:'face', z:40, shapes:[
    { kind:'path', d:'M60 29 C49 29 43 38 43 53 C43 69 48 81 53 85 Q60 89 67 85 C72 81 77 69 77 53 C77 38 71 29 60 29Z', fill:'skin', stroke:'ink', strokeWidth:2.2 },
    { kind:'path', d:'M46.5 45 Q50 44 54.5 45 M65.5 45 Q70 44 73.5 45', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 51 Q50 49.3 54.8 51 M65.2 51 Q70 49.3 74.8 51', stroke:'ink', strokeWidth:1.08 },
    { kind:'path', d:'M46.5 52.3 Q50 53 53.5 52.2 M66.5 52.2 Q70 53 73.5 52.3', stroke:'ink', strokeWidth:.46, opacity:.56 },
    { kind:'circle', cx:50, cy:51.4, r:.7, fill:'ink' }, { kind:'circle', cx:70, cy:51.4, r:.7, fill:'ink' },
    { kind:'path', d:'M59 55 Q58.5 61 60.5 63 Q62 63.8 64.5 62', stroke:'ink', strokeWidth:1 },
    { kind:'path', d:'M55 73 Q60 74.1 65 73', stroke:'ink', strokeWidth:1.08 },
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
    { kind:'path', d:'M46 46.3 Q50 45.1 54.5 45.9 M65.5 45.9 Q70 45.1 74 46.3', stroke:'ink', strokeWidth:1.25 },
    { kind:'path', d:'M45.2 52.2 Q50 50.6 54.8 52.2 M65.2 52.2 Q70 50.6 74.8 52.2', stroke:'ink', strokeWidth:1.02 },
    { kind:'path', d:'M46.5 54.6 Q50 55.1 53.5 54.4 M66.5 54.4 Q70 55.1 73.5 54.6', stroke:'ink', strokeWidth:.45, opacity:.52 },
    { kind:'circle', cx:50, cy:53.1, r:.68, fill:'ink' }, { kind:'circle', cx:70, cy:53.1, r:.68, fill:'ink' },
    { kind:'path', d:'M59 54.7 Q58.2 65.7 60.1 69 Q62.7 70 65.5 66.7', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M54 78 Q60 77.5 66 78', stroke:'ink', strokeWidth:1.05 },
    { kind:'path', d:'M45 58.5 Q49 60 53 58.8 M67 58.8 Q71 60 75 58.5 M50 70 Q48 76 49 82 M70 70 Q72 76 71 82', stroke:'age', strokeWidth:.45, opacity:.26 },
  ]},
];
