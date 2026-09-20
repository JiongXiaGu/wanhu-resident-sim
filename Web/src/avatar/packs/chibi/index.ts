import type {AvatarPack} from '../types';
import {chibiCatalog,type ExpressionId,type FaceId,type HairId,type OutfitId} from './catalog';
import {chibiDefs} from './drawing';
import {expressionArt,faceBase,neckArt} from './faces';
import {hairArt} from './hair';
import {outfitArt} from './outfits';

export const chibiCutePack={
  id:'chibi-cute-v1',
  title:'Q版可爱',
  note:'大头比例 · 豆豆眼 · 贴纸感',
  lifecycle:'active',
  viewBox:'0 0 320 320',
  catalog:chibiCatalog,
  defaults:{face:'oval',hair:'long',outfit:'knit',expression:'smile'},
  defs:chibiDefs,
  layers(frame,recipe){
    const face=recipe.face as FaceId,hairId=recipe.hair as HairId,outfit=recipe.outfit as OutfitId,expression=recipe.expression as ExpressionId;
    const hair=hairArt(frame,hairId);
    return [
      {id:'BackHair',svg:hair.back},
      {id:'Neck',svg:neckArt(frame)},
      {id:'Outfit',svg:outfitArt(frame,outfit)},
      {id:'FaceBase',svg:faceBase(frame,face)},
      {id:'Expression',svg:expressionArt(frame,face,expression)},
      {id:'FrontHair',svg:hair.front},
    ];
  },
} satisfies AvatarPack;
