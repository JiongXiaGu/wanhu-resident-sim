import type {AvatarPack} from '../types';
import {chibiDefs} from './drawing';
import {expressionArt,faceBase,neckArt} from './faces';
import {hairArt} from './hair';
import {outfitArt} from './outfits';

export const chibiCutePack={
  id:'chibi-cute-v1',
  title:'Q版可爱',
  note:'大头比例 · 豆豆眼 · 贴纸感',
  viewBox:'0 0 320 320',
  defs:chibiDefs,
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
