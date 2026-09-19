export const styleIds = ['cel', 'paint', 'sculpt', 'graphic'] as const;
export type StyleId = typeof styleIds[number];
export const subjects = [{ id: 'woman21', label: '21岁女子', age: 21 }, { id: 'man32', label: '32岁男子', age: 32 }] as const;
export type SubjectId = typeof subjects[number]['id'];
export const assetRoot = '/portrait-open-styles/';
export const imageUrl = (style: StyleId, subject: SubjectId): string => `${assetRoot}${style}-${subject}.avif`;
export const styles: { id: StyleId; code: string; title: string; grammar: string; nextProof: string; risk: string; reference: { title: string; url: string; observe: string } }[] = [
  { id: 'cel', code: 'A', title: '现代赛璐璐', grammar: '细轮廓 · 动画眼型 · 硬边明暗',
    nextProof: '后续可试脸底、整套表情和前后发分层；先用不同脸共享同一发型验证发际线。',
    risk: '细眼线与浅色发丝缩到48px后会丢失，不能只凭大图决定。',
    reference: { title: '《绝区零》官方角色资料', url: 'https://zenless.hoyoverse.com/', observe: '观察动画脸部简化、头发大束和服装色块；不复制角色。' } },
  { id: 'paint', code: 'B', title: '厚涂人物画', grammar: '成人比例 · 真实体积 · 可见笔触',
    nextProof: '后续应比较分层绘画与三维打底后绘制两种方法，不能直接把整张图当换装资产。',
    risk: '头发与皮肤的柔边、光照容易绑在一起；模块化改造成本较高。',
    reference: { title: 'Fortiche 官方作品与制作资料', url: 'https://forticheprod.com/', observe: '观察人物平面、笔触和光影组织；不是宣称本稿达到其制作水准。' } },
  { id: 'sculpt', code: 'C', title: '柔光三维感', grammar: '弱描边 · 柔光材质 · 立体五官',
    nextProof: '可优先验证三维捏脸后离线烘焙头像；本轮图片不是三维模型。',
    risk: '表情和发型要在同一照明条件下验证，小图也不能只剩光滑肤色。',
    reference: { title: '《模拟人生4》官方人物自定义', url: 'https://www.ea.com/games/the-sims/the-sims-4', observe: '观察不同成人外观与角色自定义展示，而非套用其角色素材。' } },
  { id: 'graphic', code: 'D', title: '漫画块面', grammar: '重轮廓 · 大阴影 · 强剪影',
    nextProof: '后续可以试手绘分层或矢量重绘；需要先让两张不同脸共享头发与衣领。',
    risk: '轮廓鲜明但气质较强，温和表情和老人不能统一画成硬朗角色。',
    reference: { title: '《Hades》官方美术与媒体资料', url: 'https://www.supergiantgames.com/games/hades/', observe: '观察轮廓、黑色块面与有限强调色，不复制其服饰和人物。' } },
];
export const STORAGE = 'wanhu.portrait-open-styles.v1';
export type Preferences = { version: 1; selected: StyleId; shortlist: StyleId[] };
export function parsePreferences(value: unknown): Preferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('候选记录不是对象。');
  const v = value as Record<string, unknown>;
  if (v.version !== 1 || !styleIds.includes(v.selected as StyleId) || !Array.isArray(v.shortlist)
    || v.shortlist.length > styleIds.length || v.shortlist.some(item => !styleIds.includes(item as StyleId))
    || new Set(v.shortlist).size !== v.shortlist.length || Object.keys(v).some(key => !['version','selected','shortlist'].includes(key))) throw new Error('候选记录无效。');
  return { version: 1, selected: v.selected as StyleId, shortlist: [...v.shortlist] as StyleId[] };
}
export function initialPreferences(): Preferences {
  try { const raw = localStorage.getItem(STORAGE); return raw ? parsePreferences(JSON.parse(raw)) : { version: 1, selected: 'cel', shortlist: [] }; }
  catch { return { version: 1, selected: 'cel', shortlist: [] }; }
}
export function exportPreferences(value: Preferences): void {
  const blob = new Blob([JSON.stringify(parsePreferences(value), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'wanhu-portrait-style-shortlist.json'; document.body.append(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
