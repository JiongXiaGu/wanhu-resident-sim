import {defineCatalog} from '../catalog';

export const lineworkCatalog=defineCatalog({
  face:[
    {id:'oval',label:'柔和',note:'椭圆轮廓 · 舒展眉眼'},
    {id:'round',label:'圆润',note:'饱满面颊 · 圆眼'},
    {id:'angular',label:'英气',note:'明确下颌 · 细长眼'},
    {id:'long',label:'清秀',note:'修长脸形 · 平缓眉眼'},
  ],
  hair:[
    {id:'crop',label:'利落短发'},
    {id:'bob',label:'齐颈短发'},
    {id:'long',label:'自然长发'},
    {id:'pony',label:'高马尾'},
    {id:'wave',label:'蓬松卷发'},
    {id:'braid',label:'侧编发'},
  ],
  outfit:[
    {id:'tee',label:'简约上衣'},
    {id:'shirt',label:'开领衬衫'},
    {id:'knit',label:'针织开衫'},
    {id:'jacket',label:'短外套'},
  ],
  expression:[
    {id:'calm',label:'平静'},
    {id:'smile',label:'微笑'},
    {id:'joy',label:'开心'},
    {id:'angry',label:'不满'},
    {id:'sad',label:'难过'},
    {id:'surprise',label:'惊讶'},
  ],
} as const);

export type FaceId=typeof lineworkCatalog.face[number]['id'];
export type HairId=typeof lineworkCatalog.hair[number]['id'];
export type OutfitId=typeof lineworkCatalog.outfit[number]['id'];
export type ExpressionId=typeof lineworkCatalog.expression[number]['id'];
