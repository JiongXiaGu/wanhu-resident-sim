// 独立 Web 实验配方，不是正式 ResidentPortraitDNA，也不是 Unity 存档契约。
export const choices = {
  frame: [{ id: 'female.adult', label: '成年女性' }, { id: 'male.adult', label: '成年男性' }],
  faceFamilyId: [{ id: 'gentle', label: '温和' }, { id: 'bright', label: '明朗' }, { id: 'steady', label: '沉静' }, { id: 'keen', label: '清俊' }],
  hairStyleId: [{ id: 'low-bun', label: '低挽发' }, { id: 'high-knot', label: '高束发' }, { id: 'half-tied', label: '半束发' }, { id: 'braided', label: '编束发' }, { id: 'side-part', label: '侧分发' }, { id: 'coiled', label: '盘叠发' }],
  headwearStyleId: [{ id: 'none', label: '不戴帽' }, { id: 'wrap', label: '布巾' }, { id: 'scholar', label: '幞头' }, { id: 'straw', label: '斗笠' }, { id: 'crown', label: '金冠' }],
  outfitStyleId: [{ id: 'plain', label: '交领布衣' }, { id: 'vest', label: '市井外搭' }, { id: 'scholar', label: '宽襟长衫' }, { id: 'official', label: '圆领袍服' }, { id: 'noble', label: '锦绣披帛' }, { id: 'royal', label: '礼仪华服' }],
  skinPaletteId: [{ id: 'ivory', label: '暖白' }, { id: 'peach', label: '杏肤' }, { id: 'wheat', label: '麦色' }, { id: 'umber', label: '深褐' }],
  baseHairColorId: [{ id: 'ink', label: '墨黑' }, { id: 'brown', label: '栗棕' }, { id: 'ash', label: '灰棕' }, { id: 'silver', label: '银灰' }],
  outfitPaletteId: [{ id: 'jade', label: '苔青' }, { id: 'blue', label: '黛蓝' }, { id: 'red', label: '绛红' }, { id: 'gold', label: '赭金' }],
} as const;
export type ChoiceKey = keyof typeof choices;
export type Look = { version: 1 } & { [K in ChoiceKey]: typeof choices[K][number]['id'] };
export const STORAGE_KEY = 'wanhu.portrait-composer.v1';
export const defaultLook: Look = { version: 1, frame: 'female.adult', faceFamilyId: 'gentle', hairStyleId: 'low-bun', headwearStyleId: 'none', outfitStyleId: 'plain', skinPaletteId: 'peach', baseHairColorId: 'ink', outfitPaletteId: 'jade' };
export const keys = Object.keys(choices) as ChoiceKey[];
export const labels: Record<ChoiceKey, string> = { frame: '人物', faceFamilyId: '面容', hairStyleId: '发型', headwearStyleId: '帽子 / 头饰', outfitStyleId: '服饰', skinPaletteId: '肤色', baseHairColorId: '发色', outfitPaletteId: '衣服配色' };
export function label(key: ChoiceKey, id: string): string { return choices[key].find(item => item.id === id)?.label ?? id; }

// 只接受白名单 ID；导入既不能注入 SVG，也不能悄悄把无效 ID 存入 Demo。
export function parseLook(value: unknown): Look {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('配方必须是一个 JSON 对象。');
  const record = value as Record<string, unknown>;
  if (record.version !== 1) throw new Error('配方版本不支持，请使用此实验页导出的 v1 配方。');
  if (Object.keys(record).length !== keys.length + 1 || Object.keys(record).some(key => key !== 'version' && !keys.includes(key as ChoiceKey))) throw new Error('配方字段不完整或含有未知字段。');
  for (const key of keys) if (!choices[key].some(item => item.id === record[key])) throw new Error(`${labels[key]}的选项无效。`);
  return Object.fromEntries(['version', ...keys].map(key => [key, record[key]])) as Look;
}
export function readInitial(): { look: Look; message: string } {
  try {
    const shared = new URLSearchParams(window.location.search).get('look');
    const saved = shared ?? window.localStorage.getItem(STORAGE_KEY);
    return saved ? { look: parseLook(JSON.parse(saved)), message: shared ? '已载入链接中的组合。' : '已恢复上次的组合。' } : { look: { ...defaultLook }, message: '' };
  } catch { return { look: { ...defaultLook }, message: '未能读取保存的配方，已使用默认组合。' }; }
}
export function randomLook(previous: Look, lockIdentity: boolean, seed: number): Look {
  let state = seed >>> 0 || 1;
  const next = () => { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; };
  const result: Record<string, unknown> = { ...previous };
  for (const key of keys) {
    if (key === 'frame' || (lockIdentity && (key === 'faceFamilyId' || key === 'skinPaletteId'))) continue;
    const alternatives = choices[key].filter(item => item.id !== previous[key]);
    result[key] = alternatives[Math.floor(next() * alternatives.length)].id;
  }
  return parseLook(result);
}
export const wearMode = (look: Look): 'open' | 'tucked' => ['wrap', 'scholar', 'straw'].includes(look.headwearStyleId) ? 'tucked' : 'open';
export const geometryCombinationCount = choices.frame.length * choices.faceFamilyId.length * choices.hairStyleId.length * choices.headwearStyleId.length * choices.outfitStyleId.length;
