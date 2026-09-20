import {ageOutfit} from './age-outfits';
import {adultOutfit} from './adult-outfits';
import type {Frame} from '../../model';
import type {OutfitId} from './catalog';

// 衣装的唯一分发入口，作者层与 Recipe 结构保持不变。
export function outfitArt(frame:Frame,id:OutfitId):string{
 if(id.startsWith('child-')||id.startsWith('elder-'))return ageOutfit(frame,id);
 return adultOutfit(frame,id);
}
