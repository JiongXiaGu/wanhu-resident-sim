import type {Frame,Recipe} from '../model';
import type {AvatarCatalog,CatalogDefaults} from './catalog';

// 玩家仍只编辑四个 Recipe 字段；Headwear 是 Hair 选项内部的绘制层，不是第五个玩家选项。
export const layerOrder=[
  'BackHair',
  'HeadwearBack',
  'Neck',
  'Outfit',
  'FaceBase',
  'Expression',
  'FrontHair',
  'HeadwearFront',
] as const;

export type LayerId=typeof layerOrder[number];
export type Layer={id:LayerId;svg:string};

export type PackLifecycle='active'|'reference'|'legacy';

export type AvatarPack={
  id:string;
  title:string;
  note:string;
  lifecycle:PackLifecycle;
  viewBox:'0 0 320 320';
  catalog:AvatarCatalog;
  defaults:CatalogDefaults;
  defs:()=>string;
  layers:(frame:Frame,recipe:Recipe)=>Layer[];
};
