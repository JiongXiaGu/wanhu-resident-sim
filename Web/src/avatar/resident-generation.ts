import type {Gender,LifeStageId,ResidentProfile,WealthTier} from '../domain/resident';
import {activePackId,fitRecipeToFrame,frameFor,optionsFor,recipeForPack,type Frame,type Part,type Recipe} from './model';
import type {CatalogOption} from './packs/catalog';

type Context={
 seed:number;
 gender:Gender;
 lifeStage:LifeStageId;
 occupationGroupId?:string;
 wealthTier:WealthTier;
 profile:ResidentProfile;
};

type Theme='common'|'labor'|'merchant'|'traveler';

const groupTheme:Record<string,Theme>={
 'occupation-group.child':'common',
 'occupation-group.education':'common',
 'occupation-group.craft':'labor',
 'occupation-group.trade':'merchant',
 'occupation-group.medical':'common',
 'occupation-group.infrastructure':'labor',
 'occupation-group.agriculture':'labor',
 'occupation-group.transport':'traveler',
 'occupation-group.performance':'merchant',
 'occupation-group.retired':'common',
};

function hash32(value:string|number){const text=String(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const unit=(seed:number,salt:string)=>hash32(seed+':generated-avatar.v1:'+salt)/4294967296;
function pick(options:readonly CatalogOption[],seed:number,salt:string):string{
 if(!options.length)throw new Error('Generated resident avatar requires at least one option.');
 return options[Math.min(options.length-1,Math.floor(unit(seed,salt)*options.length))].id;
}
function pool(part:Part,frame:Frame,theme:Theme):readonly CatalogOption[]{
 const all=optionsFor(activePackId,part,frame);
 const exact=all.filter(option=>option.theme===theme);
 if(theme==='common'){
  const common=all.filter(option=>option.theme==='common'||option.theme===undefined);
  if(common.length)return common;
 }
 return exact.length?exact:all;
}
function themeAvailable(frame:Frame,theme:Theme){
 return ['hair','outfit'].every(part=>optionsFor(activePackId,part as Part,frame).some(option=>option.theme===theme||(theme==='common'&&option.theme===undefined)));
}
function preferredTheme(ctx:Context,frame:Frame):Theme{
 let theme=groupTheme[ctx.occupationGroupId??'']??'common';
 const focus=ctx.profile.lifeFocusId;
 const roll=unit(ctx.seed,'theme-focus');
 if(theme==='common'&&focus==='profile.focus.travel'&&themeAvailable(frame,'traveler')&&roll<.42)theme='traveler';
 else if(theme==='common'&&focus==='profile.focus.craft'&&themeAvailable(frame,'labor')&&roll<.38)theme='labor';
 else if(theme==='common'&&focus==='profile.focus.earnings'&&themeAvailable(frame,'merchant')&&roll<.38)theme='merchant';
 else if(theme!=='common'&&themeAvailable(frame,'common')&&roll<.18)theme='common';
 if(!themeAvailable(frame,theme))theme='common';
 return theme;
}

export function generatedResidentRecipe(ctx:Context):Recipe{
 const frame=frameFor(ctx.gender,ctx.lifeStage),theme=preferredTheme(ctx,frame),base=recipeForPack(activePackId,frame);
 const face=pick(optionsFor(activePackId,'face',frame),ctx.seed,'face');
 const hair=pick(pool('hair',frame,theme),ctx.seed,'hair:'+theme+':'+ctx.profile.presentationStyleId);
 const outfit=pick(pool('outfit',frame,theme),ctx.seed,'outfit:'+theme+':'+ctx.profile.presentationStyleId+':'+ctx.wealthTier);
 const expression=['profile.temperament.lively','profile.temperament.sociable'].includes(ctx.profile.temperamentId)?'smile':'calm';
 return fitRecipeToFrame({...base,face,hair,outfit,expression},frame);
}
