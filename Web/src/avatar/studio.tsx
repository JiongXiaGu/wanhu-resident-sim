import {frames,type Frame,type Part,type Target} from './model';

const stageLabels={child:'儿童',adult:'成年',elder:'老年'} as const;
export function studioTargets(citySeed:number):Target[]{
 return frames.map((frame,index)=>({key:`city:${citySeed}:studio:${frame}`,name:`${stageLabels[frame.split('.')[1] as keyof typeof stageLabels]}${frame.startsWith('female')?'女性':'男性'}样板`,detail:'自由创作 / 独立保存，不改变城市居民',frame,seed:100+index,kind:'studio'}));
}
// 仅标记本轮重画的样板，不创建第二个 Pack 或另一套运行时 Renderer。
const foundationIds:Record<Part,readonly string[]>={
 face:['oval','round','angular','long','broad','tapered'],
 hair:['bound','scholar-cap','work-headscarf','child-topknot','elder-soft-bun','elder-swept'],
 outfit:['commoner','artisan','adult-female-ruqun','child-short-robe','elder-long-robe'],
 expression:['calm','smile','joy','angry','sad','surprise','shy','serious'],
};
export const isFoundationSample=(part:Part,id:string):boolean=>foundationIds[part].includes(id);

export function StudioControls({frame,onFrame,onReset}:{frame:Frame;onFrame:(frame:Frame)=>void;onReset:()=>void}){
 const [sex,stage]=frame.split('.');
 return <section className="av-studio-controls" aria-label="自由创作框架">
  <h2>先选人物框架</h2><p>直接制作儿童、成人或老人。</p>
  <h3>性别</h3><div className="av-context-switch" role="group" aria-label="创作性别">{(['female','male'] as const).map(value=><button key={value} type="button" data-studio-sex={value} aria-pressed={sex===value} onClick={()=>onFrame(`${value}.${stage}` as Frame)}>{value==='female'?'女':'男'}</button>)}</div>
  <h3>年龄</h3><div className="av-context-switch" role="group" aria-label="创作年龄">{(['child','adult','elder'] as const).map(value=><button key={value} type="button" data-studio-age={value} aria-pressed={stage===value} onClick={()=>onFrame(`${sex}.${value}` as Frame)}>{stageLabels[value]}</button>)}</div>
  <div className="av-studio-help"><b>六份样板，分别保存</b><p>切换框架会打开对应样板。未保存修改会先询问，不会把老人造型写到儿童身上。</p></div>
  <button type="button" data-foundation-template className="av-template" onClick={onReset}>载入日常样板</button>
  <p className="av-studio-caption">样板是本轮候选画稿，可继续换脸、发型、衣服和表情。不是最终定稿。</p>
 </section>;
}
