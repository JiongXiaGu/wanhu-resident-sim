import {useMemo} from 'react';
import {avatarSource} from './render';
import {defaultFor,type Frame,type Recipe,type Target} from './model';
import {useSaved} from './store';
export function AvatarImage({frame,recipe,size=96,native=false,className=''}:{frame:Frame;recipe:Recipe;size?:number;native?:boolean;className?:string}) {
 const source=useMemo(()=>avatarSource(frame,recipe),[frame,recipe]);
 return <img className={`avatar-art ${className}`} src={source} width={size} height={size} data-native-avatar={native?size:undefined} draggable={false} alt="可组合人物头像"/>;
}
export function SavedAvatar({target,size=48}:{target:Target;size?:number}) {
 const saved=useSaved(target.key);
 // 居民未手动应用时显示由个人资料派生的稳定默认头像；玩家覆盖仍优先。
 if(target.kind==='resident'&&!saved.recipe&&!target.initialRecipe)return <span className="av-unset" aria-label={`${target.name}尚未生成头像`}>{target.name.slice(0,1)}</span>;
 return <AvatarImage frame={target.frame} recipe={saved.recipe??defaultFor(target)} size={size}/>;
}
