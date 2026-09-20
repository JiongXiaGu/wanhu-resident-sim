import type {Frame,Recipe} from '../model';
import type {AvatarCatalog,CatalogDefaults} from './catalog';

export const layerOrder=['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'] as const;
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
