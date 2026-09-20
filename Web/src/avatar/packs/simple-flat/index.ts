import type {AvatarPack} from '../types';
import {expressionArt,faceBase,neckArt} from './faces';
import {hairArt} from './hair';
import {outfitArt} from './outfits';

export const simpleFlatPack={
  id:'simple-flat-v1',
  title:'极简简笔',
  note:'极简线稿 · 平面色块 · 图标式头像',
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
