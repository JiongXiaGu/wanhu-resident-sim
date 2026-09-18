import type { VectorLayerAsset } from '../types';

export const HAIR_LAYERS: VectorLayerAsset[] = [
  { id:'layer.hair.child-double-bun.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M44 35 C43 32 45 29 49 28 C52 27 55 29 55 32 C55 35 52 37 49 38 C46 38 44 37 44 35Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M76 34 C77 31 75 29 72 28 C69 27 66 29 66 32 C66 35 69 37 72 37 C74 37 76 36 76 34Z', fill:'hair', stroke:'ink', strokeWidth:.58 },
    { kind:'path', d:'M49 36 Q51 40 55 42 M71 36 Q69 40 66 42', stroke:'hair', strokeWidth:2.2 },
  ]},

  { id:'layer.hair.child-double-bun.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M40 51 C41 39 47 31 57 28 Q60 27 62 29 C72 31 79 39 80 51 C74 45 68 42 62 41 Q60 39 59 35 Q58 39 56 41 C50 42 45 45 40 51Z', fill:'hair' },
    { kind:'path', d:'M44 47 Q43 50 44 53 M76 47 Q77 50 76 53', stroke:'hair', strokeWidth:.72, opacity:.72 },
  ]},

  { id:'layer.hair.female-adult-low-coil.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M74 42 C79 51 80 64 78 75 C77 82 74 88 70 91 C75 88 81 87 86 89 C92 91 94 95 91 99 C87 103 79 102 73 98 C68 94 67 90 70 85 C73 74 75 57 74 42Z', fill:'hair', stroke:'ink', strokeWidth:.65 },
  ]},

  { id:'layer.hair.female-adult-low-coil.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39.5 48 C40.5 33 48 23.5 59.5 22.5 C71.5 23 79.5 33 80.5 48 C75.5 43 69.5 40.5 64 39.5 Q60 37.5 56 39.5 C50.5 40.5 44.5 43 39.5 48Z', fill:'hair' },
    { kind:'path', d:'M60 24.5 Q60 28 60 31', stroke:'hair-accent', strokeWidth:.42, opacity:.22 },
    { kind:'path', d:'M43 43 Q42.2 48 43.7 52 M77 43 Q77.8 48 76.3 52', stroke:'hair-accent', strokeWidth:.34, opacity:.16 },
  ]},

  { id:'layer.hair.female-adult-round-coil.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:61, cy:23.5, rx:9.5, ry:6.8, fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M45 43 Q42 58 45 75 Q47 84 51 90 M75 43 Q78 58 75 75 Q73 84 69 90', stroke:'hair', strokeWidth:5.2, opacity:.92 },
  ]},

  { id:'layer.hair.female-adult-round-coil.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39 48 C40 33 47.5 23 59.5 22 C72 22.5 80 33 81 48 C76 43 70 40.5 64 39.5 Q60 37.2 56 39.5 C50 40.5 44 43 39 48Z', fill:'hair' },
    { kind:'path', d:'M60 23.5 Q60 27.5 60 30', stroke:'hair-accent', strokeWidth:.44, opacity:.22 },
  ]},

  { id:'layer.hair.female-adult-half-bound.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:60, cy:27, rx:6.5, ry:4.5, fill:'hair', stroke:'ink', strokeWidth:.55 },
    { kind:'path', d:'M47 48 C45 60 45 76 43 89 C42 98 39 107 36 114 C40 116 44 113 47 106 C50 97 52 84 52 71 C52 60 50 52 47 48Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
    { kind:'path', d:'M73 48 C75 60 75 76 77 89 C78 98 81 107 84 114 C80 116 76 113 73 106 C70 97 68 84 68 71 C68 60 70 52 73 48Z', fill:'hair', stroke:'ink', strokeWidth:.62 },
  ]},

  { id:'layer.hair.female-adult-half-bound.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M39.8 48.5 C40.8 33.5 48 23.5 59.5 22.5 C71.5 23 79.2 33.5 80.2 48.5 C75.2 43 69.5 40.5 64 39.5 Q60 37.5 56 39.5 C50.5 40.5 44.8 43 39.8 48.5Z', fill:'hair' },
    { kind:'path', d:'M60 24.5 Q60 28 60 31', stroke:'hair-accent', strokeWidth:.42, opacity:.2 },
    { kind:'path', d:'M43.5 44.5 Q42.8 50 44 55 M76.5 44.5 Q77.2 50 76 55', stroke:'hair-accent', strokeWidth:.34, opacity:.18 },
  ]},

  { id:'layer.hair.elder-low-bun.back', slot:'back-hair', z:10, shapes:[
    { kind:'path', d:'M73 47 C78 56 80 68 78 79 C77 84 74 88 71 90 C75 88 80 87 85 88 C90 88 93 90 93 93 C93 96 89 98 84 98 C79 98 75 96 72 94 C69 92 69 89 71 86 C73 77 75 62 73 47Z', fill:'hair', stroke:'ink', strokeWidth:.58 },
    { kind:'path', d:'M79 91 Q85 90 89 93', stroke:'hair-accent', strokeWidth:.3, opacity:.09 },
  ]},

  { id:'layer.hair.elder-low-bun.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M41 52 C41.5 40 47.5 31.5 56.5 28 Q60 27 63.5 28 C72.5 31.5 78.5 40 79 52 C74 47 69 44 64 42.5 Q60 40.2 56 42.5 C51 44 46 47 41 52Z', fill:'hair' },
    { kind:'path', d:'M60 28.5 Q60 31 60 34', stroke:'hair-accent', strokeWidth:.38, opacity:.32 },
    { kind:'path', d:'M48 39 Q52 35.5 56 34 M64 34 Q68 35.5 72 39', stroke:'hair-accent', strokeWidth:.28, opacity:.13 },
  ]},

  { id:'layer.hair.male-child-tied.back', slot:'back-hair', z:10, shapes:[
    { kind:'ellipse', cx:60, cy:28, rx:5.5, ry:4.2, fill:'hair', stroke:'ink', strokeWidth:.5 },
  ]},

  { id:'layer.hair.male-child-tied.front', slot:'front-hair', z:70, shapes:[
    { kind:'path', d:'M40 51 C41 39 47 31 57 28 Q60 26 63 28 C73 31 79 39 80 51 C74 45 68 42 62 41 Q60 38 59 34 Q57 39 55 41 C49 42 44 46 40 51Z', fill:'hair' },
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
    { kind:'path', d:'M42 49 C43 38.5 49.5 31 57 29 Q60 28 63 29 C70.5 31 77 38.5 78 49 C73.5 45 68.5 42.5 64 41.5 Q60 39.5 56 41.5 C51.5 42.5 46.5 45 42 49Z', fill:'hair' },
    { kind:'path', d:'M60 29.5 Q60 32 60 34.5', stroke:'hair-accent', strokeWidth:.42, opacity:.34 },
    { kind:'path', d:'M46 42 Q44.5 47 45 52 M74 42 Q75.5 47 75 52', stroke:'hair-accent', strokeWidth:.34, opacity:.26 },
  ]},
];
