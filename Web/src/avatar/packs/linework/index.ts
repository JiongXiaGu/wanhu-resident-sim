import type {AvatarPack} from '../types';
import {expressionArt,faceBase,neckArt} from './faces';
import {hairArt} from './hair';
import {outfitArt} from './outfits';

export const lineworkPack={
  id:'linework-v1',
  title:'日常线绘',
  note:'清晰描边 · 色块简洁',
  viewBox:'0 0 320 320',
  defs:()=> '',
  layers(frame,recipe){
    const hair=hairArt(frame,recipe.hair);
    return [
      {id:'BackHair',svg:hair.back},
      {id:'Neck',svg:neckArt(frame)},
      {id:'Outfit',svg:outfitArt(frame,recipe.outfit)},
      {id:'FaceBase',svg:faceBase(frame,recipe.face)},
      {id:'Expression',svg:expressionArt(frame,recipe.face,recipe.expression)},
      {id:'FrontHair',svg:hair.front},
    ];
  },
} satisfies AvatarPack;
