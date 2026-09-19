// 独立二次元实验配方，不修改正式 DNA 或旧 Composer v1。
export const options = {
  frame: [{ id: 'female.adult', label: '成年女性' }, { id: 'male.adult', label: '成年男性' }],
  face: [{ id: 'soft', label: '清和' }, { id: 'round', label: '圆润' }, { id: 'long', label: '清雅' }, { id: 'angular', label: '英气' }],
  expression: [{ id: 'neutral', label: '平静' }, { id: 'smile', label: '微笑' }, { id: 'happy', label: '开心' }, { id: 'laugh', label: '大笑' }, { id: 'angry', label: '生气' }, { id: 'sad', label: '委屈' }, { id: 'surprised', label: '惊讶' }, { id: 'shy', label: '害羞' }],
  hair: [{ id: 'bun', label: '挽髻' }, { id: 'tail', label: '高束' }, { id: 'braid', label: '编发' }, { id: 'half', label: '半束' }],
  hat: [{ id: 'none', label: '无帽饰' }, { id: 'wrap', label: '布巾' }, { id: 'guan', label: '束发冠' }, { id: 'straw', label: '斗笠' }],
  outfit: [{ id: 'linen', label: '交领常服' }, { id: 'vest', label: '市井外搭' }, { id: 'official', label: '圆领袍服' }, { id: 'ceremony', label: '锦衣礼服' }],
  skin: [{ id: 'porcelain', label: '瓷白' }, { id: 'warm', label: '暖杏' }, { id: 'wheat', label: '麦色' }, { id: 'deep', label: '深肤' }],
  hairColor: [{ id: 'ink', label: '墨青' }, { id: 'chestnut', label: '栗棕' }, { id: 'silver', label: '银灰' }],
  cloth: [{ id: 'jade', label: '青玉' }, { id: 'indigo', label: '靛蓝' }, { id: 'rose', label: '胭脂' }, { id: 'gold', label: '秋金' }],
} as const;
export type Key = keyof typeof options;
export type Look = { schema: 'wanhu.anime-portrait'; version: 1 } & { [K in Key]: typeof options[K][number]['id'] };
export type FaceId = Look['face'];
export type ExpressionId = Look['expression'];
export const keys = Object.keys(options) as Key[];
export const labels: Record<Key, string> = { frame: '人物', face: '面容', expression: '表情', hair: '发型', hat: '帽饰', outfit: '衣服', skin: '肤色', hairColor: '发色', cloth: '衣色' };
export const label = (key: Key, id: string): string => options[key].find(item => item.id === id)?.label ?? id;
export const initialLook: Look = { schema: 'wanhu.anime-portrait', version: 1, frame: 'female.adult', face: 'soft', expression: 'smile', hair: 'bun', hat: 'none', outfit: 'linen', skin: 'porcelain', hairColor: 'ink', cloth: 'jade' };
export const STORAGE_KEY = 'wanhu.portrait-anime.v1';
export const isTucked = (look: Look): boolean => look.hat === 'wrap' || look.hat === 'straw';
export function parseLook(value: unknown): Look {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('请选择本页导出的 JSON 配方。');
  const raw = value as Record<string, unknown>;
  if (raw.schema !== 'wanhu.anime-portrait' || raw.version !== 1) throw new Error('不是二次元实验 v1 配方；旧 DIY 配方请到原页面打开。');
  if (Object.keys(raw).length !== keys.length + 2 || Object.keys(raw).some(key => key !== 'schema' && key !== 'version' && !keys.includes(key as Key))) throw new Error('配方字段缺失或含未知字段。');
  for (const key of keys) if (!options[key].some(item => item.id === raw[key])) throw new Error(`${labels[key]}选项无效。`);
  return Object.fromEntries(['schema', 'version', ...keys].map(key => [key, raw[key]])) as Look;
}
export function restore(): { look: Look; message: string } {
  try {
    const shared = new URLSearchParams(location.search).get('anime');
    const text = shared ?? localStorage.getItem(STORAGE_KEY);
    if (text && text.length > 8192) throw new Error('配方过大');
    return text ? { look: parseLook(JSON.parse(text)), message: shared ? '已载入链接中的人物与表情。' : '已恢复上次的组合。' } : { look: { ...initialLook }, message: '' };
  } catch { return { look: { ...initialLook }, message: '无法读取保存的配方，已恢复默认人物。' }; }
}
export function randomLook(previous: Look, lockIdentity: boolean, seed: number): Look {
  let s = seed >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x7feb352d) >>> 0;
  s = Math.imul(s ^ (s >>> 15), 0x846ca68b) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0 || 1;
  const next = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
  const result: Record<string, unknown> = { ...previous };
  for (const key of keys) {
    if (key === 'frame' || (lockIdentity && ['face', 'expression', 'skin'].includes(key))) continue;
    const pool = lockIdentity ? options[key].filter(item => item.id !== previous[key]) : options[key];
    result[key] = pool[Math.floor(next() * pool.length)].id;
  }
  return parseLook(result);
}
export const combinationCount = options.frame.length * options.face.length * options.expression.length * options.hair.length * options.hat.length * options.outfit.length;
