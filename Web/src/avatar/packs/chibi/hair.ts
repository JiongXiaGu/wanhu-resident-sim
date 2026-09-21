import {childThemeHair} from './child-theme-hair';
import {elderThemeHair} from './elder-theme-hair';
import {themeHair} from './theme-hair';
import {adultHair} from './adult-hair';
import {childHair} from './child-hair';
import {elderHair} from './elder-hair';
import type {Frame} from '../../model';
import type {HairId} from './catalog';
import type {ChibiHairLayers} from './art-spec';

// 单一分发入口；每个 ID 只有一份当前画稿，旧图仅从 Git 历史生成审查对照。
export function hairArt(frame:Frame,id:HairId):ChibiHairLayers{
 const addition=childThemeHair(frame,id)??elderThemeHair(frame,id);
 if(addition)return addition;
 if(id.startsWith('child-'))return childHair(frame,id);
 if(id.startsWith('elder-'))return elderHair(frame,id);
 return themeHair(frame,id)??adultHair(frame,id);
}
