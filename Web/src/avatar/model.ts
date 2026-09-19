// 头像工坊只保存四个外观选择；pack 是绘制方式，不新增第五类捏脸参数。
export const options = {
  face: [{ id: 'oval', label: '柔和', note: '椭圆轮廓 · 舒展眉眼' }, { id: 'round', label: '圆润', note: '饱满面颊 · 圆眼' }, { id: 'angular', label: '英气', note: '明确下颌 · 细长眼' }, { id: 'long', label: '清秀', note: '修长脸形 · 平缓眉眼' }],
  hair: [{ id: 'crop', label: '利落短发' }, { id: 'bob', label: '齐颈短发' }, { id: 'long', label: '自然长发' }, { id: 'pony', label: '高马尾' }, { id: 'wave', label: '蓬松卷发' }, { id: 'braid', label: '侧编发' }],
  outfit: [{ id: 'tee', label: '简约上衣' }, { id: 'shirt', label: '开领衬衫' }, { id: 'knit', label: '针织开衫' }, { id: 'jacket', label: '短外套' }],
  expression: [{ id: 'calm', label: '平静' }, { id: 'smile', label: '微笑' }, { id: 'joy', label: '开心' }, { id: 'angry', label: '不满' }, { id: 'sad', label: '难过' }, { id: 'surprise', label: '惊讶' }],
} as const;
export const packOptions = [
  { id:'linework-v1', label:'日常线绘', note:'清晰描边 · 色块简洁' },
  { id:'soft-paint-v1', label:'柔光插画', note:'弱描边 · 柔和体积光' },
] as const;
export type PackId = typeof packOptions[number]['id'];
export type Part = keyof typeof options;
export type Choices = { [K in Part]: typeof options[K][number]['id'] };
export type Recipe = { schema: 'wanhu.avatar'; version: 1; pack: PackId } & Choices;
export type Frame = `${'female' | 'male'}.${'child' | 'adult' | 'elder'}`;
export type Target = { key: string; name: string; detail: string; frame: Frame; seed: number; kind: 'player' | 'resident'; residentId?: number };
export const parts: Part[] = ['face', 'hair', 'outfit', 'expression'];
export const frames: Frame[] = ['female.child','female.adult','female.elder','male.child','male.adult','male.elder'];
export const labels: Record<Part,string> = { face:'脸型', hair:'头发', outfit:'衣服', expression:'表情' };
export const defaultRecipe: Recipe = { schema:'wanhu.avatar',version:1,pack:'linework-v1',face:'oval',hair:'long',outfit:'knit',expression:'smile' };
export const isPackId=(value:unknown):value is PackId=>packOptions.some(pack=>pack.id===value);
export const packLabel=(id:PackId):string=>packOptions.find(pack=>pack.id===id)?.label??id;
export function parseRecipe(value: unknown): Recipe {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('需要完整的头像配方。');
  const v = value as Record<string, unknown>;
  const fields = ['schema','version','pack',...parts];
  if (v.schema !== 'wanhu.avatar' || v.version !== 1 || !isPackId(v.pack)) throw new Error('此配方不属于当前头像工坊或画风版本不受支持。');
  if (Object.keys(v).length !== fields.length || Object.keys(v).some(key => !fields.includes(key))) throw new Error('配方字段不完整或含有未知字段。');
  for (const part of parts) if (!options[part].some(option => option.id === v[part])) throw new Error(`${labels[part]}选项无效。`);
  return { schema:'wanhu.avatar',version:1,pack:v.pack,...Object.fromEntries(parts.map(part => [part,v[part]])) } as Recipe;
}
export const optionLabel = (part: Part, id: string): string => options[part].find(item => item.id === id)?.label ?? id;
export const equalRecipe = (a: Recipe, b: Recipe): boolean => parts.every(part => a[part] === b[part]) && a.pack === b.pack;
export const withPack=(recipe:Recipe,pack:PackId):Recipe=>parseRecipe({...recipe,pack});
export function randomRecipe(seed: number, previous?: Recipe): Recipe {
  let state = seed >>> 0;
  state = Math.imul(state ^ state >>> 16, 0x7feb352d) >>> 0;
  state = Math.imul(state ^ state >>> 15, 0x846ca68b) >>> 0;
  state = (state ^ state >>> 16) >>> 0 || 1;
  const next = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
  const value: Record<string, unknown> = { ...defaultRecipe, pack: previous?.pack ?? defaultRecipe.pack };
  for (const part of parts) {
    if (previous && (part === 'face' || part === 'expression')) { value[part] = previous[part]; continue; }
    const pool = previous ? options[part].filter(item => item.id !== previous[part]) : options[part];
    value[part] = pool[Math.floor(next() * pool.length)].id;
  }
  return parseRecipe(value);
}
export function defaultFor(target: Target): Recipe {
  if (target.kind === 'player') return { ...defaultRecipe, hair: target.frame.startsWith('male') ? 'crop' : 'long', outfit: target.frame.startsWith('male') ? 'shirt' : 'knit' };
  return { ...randomRecipe(target.seed), expression:'calm' };
}
export function frameFor(gender: 'female' | 'male', stage: string): Frame {
  return `${gender}.${stage === 'elder' ? 'elder' : stage === 'child' || stage === 'teen' ? 'child' : 'adult'}`;
}
export const residentKey = (citySeed: number, id: number | string): string => `city:${citySeed}:resident:${id}`;
