// 新画风实验，与旧 Composer / Anime 配方和正式 Runtime 完全隔离。
export const options = {
  frame: [{id:'female',label:'成年女性'},{id:'male',label:'成年男性'}],
  face: [{id:'luminous',label:'清澄'},{id:'refined',label:'疏朗'},{id:'resolute',label:'明锐'}],
  expression: [{id:'neutral',label:'平静'},{id:'smile',label:'浅笑'},{id:'happy',label:'欣喜'},{id:'laugh',label:'笑意'},{id:'focused',label:'认真'},{id:'sad',label:'低落'}],
  hair: [{id:'flowing',label:'流云半束'},{id:'tied',label:'高束长尾'},{id:'braided',label:'侧编挽髻'}],
  headwear: [{id:'none',label:'无头饰'},{id:'jade',label:'玉簪'},{id:'guan',label:'束发冠'},{id:'cap',label:'软脚幞头'}],
  outfit: [{id:'everyday',label:'交领常服'},{id:'scholar',label:'层襟长衫'},{id:'court',label:'云纹礼装'}],
  skin: [{id:'fair',label:'暖玉'},{id:'warm',label:'杏麦'},{id:'deep',label:'棕暖'}],
  hairColor: [{id:'ink',label:'墨青'},{id:'brown',label:'乌茶'},{id:'silver',label:'霜银'}],
  palette: [{id:'jade',label:'青玉'},{id:'midnight',label:'玄青'},{id:'vermilion',label:'丹朱'}],
} as const;
export type Key = keyof typeof options;
export type Look = {schema:'wanhu.modern-anime';version:1} & {[K in Key]:typeof options[K][number]['id']};
export type Frame = Look['frame'];
export type FaceId = Look['face'];
export const keys = Object.keys(options) as Key[];
export const labels:Record<Key,string>={frame:'人物',face:'面容',expression:'表情',hair:'发型',headwear:'帽饰',outfit:'服饰',skin:'肤色',hairColor:'发色',palette:'衣装配色'};
export const STORAGE='wanhu.modern-anime.v1';
export const defaults:Look={schema:'wanhu.modern-anime',version:1,frame:'female',face:'luminous',expression:'smile',hair:'flowing',headwear:'jade',outfit:'everyday',skin:'fair',hairColor:'ink',palette:'jade'};
export const label=(key:Key,id:string)=>options[key].find(item=>item.id===id)?.label??id;
export function parseLook(value:unknown):Look {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('需要完整的头像 JSON 配方。');
  const v=value as Record<string,unknown>;
  if(v.schema!=='wanhu.modern-anime'||v.version!==1)throw new Error('这不是现代国风实验的 v1 配方。旧版本不会被覆盖。');
  if(Object.keys(v).length!==keys.length+2||Object.keys(v).some(k=>k!=='schema'&&k!=='version'&&!keys.includes(k as Key)))throw new Error('配方字段不完整或包含未知字段。');
  for(const key of keys)if(!options[key].some(item=>item.id===v[key]))throw new Error(`${labels[key]}选项无效。`);
  return {schema:'wanhu.modern-anime',version:1,...Object.fromEntries(keys.map(k=>[k,v[k]]))} as Look;
}
export const presets:{name:string;subtitle:string;look:Look}[]=[
  {name:'晴岚',subtitle:'青玉常服 · 明快日常',look:{...defaults}},
  {name:'霁夜',subtitle:'玄青长衫 · 冷调人物',look:{...defaults,frame:'male',face:'resolute',expression:'neutral',hair:'tied',headwear:'guan',outfit:'scholar',palette:'midnight'}},
  {name:'丹华',subtitle:'云纹礼装 · 端庄国风',look:{...defaults,face:'refined',expression:'smile',hair:'braided',headwear:'guan',outfit:'court',palette:'vermilion',hairColor:'brown'}},
];
export const capped=(look:Look)=>look.headwear==='cap';
export function randomLook(old:Look,seed:number,locked=true):Look{
  let x=(seed>>>0)||1; x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;
  const next=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
  const v:Record<string,unknown>={...old};
  for(const key of keys){if(key==='frame'||(locked&&['face','expression','skin'].includes(key)))continue;const pool=options[key];v[key]=pool[Math.floor(next()*pool.length)].id;}
  return parseLook(v);
}
export function initialLook():{look:Look;message:string}{
  try{const shared=new URLSearchParams(location.search).get('look');const text=shared??localStorage.getItem(STORAGE);return {look:text?parseLook(JSON.parse(text)):{...defaults},message:shared?'已载入分享组合。':''};}
  catch{return {look:{...defaults},message:'无法读取旧配方，已恢复默认；原版数据未改动。'};}
}
