import type {Frame,Recipe} from '../model';

export const layerOrder=['BackHair','Neck','Outfit','FaceBase','Expression','FrontHair'] as const;
export type LayerId=typeof layerOrder[number];
export type Layer={id:LayerId;svg:string};

export type AvatarPack={
  id:string;
  title:string;
  note:string;
  viewBox:'0 0 320 320';
  defs:()=>string;
  layers:(frame:Frame,recipe:Recipe)=>Layer[];
};
