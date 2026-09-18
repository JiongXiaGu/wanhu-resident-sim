import type { VectorLayerAsset } from '../types';

export const NECK_LAYERS: VectorLayerAsset[] = [
  { id:'layer.neck.female-child-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M55 78 C55 82 54 86 52.5 90.5 Q60 94 67.5 90.5 C66 86 65 82 65 78Z', fill:'skin' },
    { kind:'path', d:'M55 80 Q54.5 85 53 89.5 M65 80 Q65.5 85 67 89.5', stroke:'ink', strokeWidth:.48, opacity:.52 },
  ]},

  { id:'layer.neck.female-adult-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54.5 86 C54.5 91 53.5 96 52 100 Q60 104 68 100 C66.5 96 65.5 91 65.5 86Z', fill:'skin' },
    { kind:'path', d:'M55 88 Q54 95 52.6 99 M65 88 Q66 95 67.4 99', stroke:'ink', strokeWidth:.5, opacity:.45 },
  ]},

  { id:'layer.neck.female-elder-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M55.5 91 C55.5 94 55 97 54.5 99.5 Q60 102 65.5 99.5 C65 97 64.5 94 64.5 91Z', fill:'skin' },
    { kind:'path', d:'M56 93 Q55.5 96.5 55 99 M64 93 Q64.5 96.5 65 99', stroke:'ink', strokeWidth:.46, opacity:.46 },
    { kind:'path', d:'M57 94 Q58 97 57.5 99.5 M63 94 Q62 97 62.5 99.5', stroke:'age', strokeWidth:.34, opacity:.14 },
  ]},

  { id:'layer.neck.male-child-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M55 78 C55 82 54 86 52.5 90.5 Q60 94 67.5 90.5 C66 86 65 82 65 78Z', fill:'skin' },
    { kind:'path', d:'M55 80 Q54.5 85 53 89.5 M65 80 Q65.5 85 67 89.5', stroke:'ink', strokeWidth:.48, opacity:.52 },
  ]},

  { id:'layer.neck.male-adult-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M54 87 C54 91 53 96 51.5 100 Q60 104 68.5 100 C67 96 66 91 66 87Z', fill:'skin' },
    { kind:'path', d:'M54.5 89 Q53.5 95 52 99 M65.5 89 Q66.5 95 68 99', stroke:'ink', strokeWidth:.52, opacity:.58 },
  ]},

  { id:'layer.neck.male-elder-frame', slot:'neck', z:17, shapes:[
    { kind:'path', d:'M53.5 88 C53.5 93 52.5 97 51.5 101 Q60 104 68.5 101 C67.5 97 66.5 93 66.5 88Z', fill:'skin' },
    { kind:'path', d:'M54.5 90 Q53.7 96 52.5 100 M65.5 90 Q66.3 96 67.5 100', stroke:'ink', strokeWidth:.48, opacity:.42 },
  ]},
];
