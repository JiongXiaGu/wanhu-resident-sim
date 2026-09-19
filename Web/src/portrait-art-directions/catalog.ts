import { silkArt } from './art/silk';
import { clayArt } from './art/clay';
import { inkArt } from './art/ink';
import type { StudyArt, StudyRole } from './art/svg';

export const roles: ReadonlyArray<{ id: StudyRole; label: string; note: string }> = [
  { id: 'woman', label: '平民女性', note: '素衣 · 日常挽发' },
  { id: 'man', label: '平民男性', note: '常服 · 束发' },
  { id: 'elder', label: '老年居民', note: '灰发 · 松弛而有精神' },
  { id: 'child', label: '儿童', note: '短下庭 · 明快表情' },
  { id: 'noble', label: '贵族女性', note: '高髻 · 叠领与披帛' },
  { id: 'ruler', label: '皇帝 / 高阶男性', note: '冠服 · 宽肩与礼服纹样' },
];

export type DirectionId = 'silk' | 'clay' | 'ink';
export interface ArtDirection {
  id: DirectionId;
  number: string;
  title: string;
  english: string;
  description: string;
  grammar: string;
  strength: string;
  risk: string;
  production: string;
  art: StudyArt;
}
export const directions: readonly ArtDirection[] = [
  {
    id: 'silk', number: '01', title: '绢彩小像', english: 'SILK & PIGMENT',
    description: '细线、温润肤色与克制的衣料层次。让普通人亲近，让贵族端庄。',
    grammar: '自然比例 / 眼睑结构 / 弧线发束 / 轻柔色面',
    strength: '普通人与重要角色的气质跨度较宽，适合需要亲近感的人生叙事。',
    risk: '48 px 会损失细线与眼部细节；量产前要重新控制细节密度。',
    production: '候选路径：完整脸部单元 + 分前后发束 + 衣领固定遮挡。必须再做六 Frame 的换装验证。',
    art: silkArt,
  },
  {
    id: 'clay', number: '02', title: '暖陶绘本', english: 'WARM STORYBOOK',
    description: '饱满面颊、较大的头部与轻快表情。先让人愿意点开这位居民。',
    grammar: '宽脸短庭 / 点面五官 / 无外描边 / 圆润衣褶',
    strength: '普通人和儿童更有亲和力，大色面在小头像里更容易保留。',
    risk: '整体偏轻松，皇室威严感较弱；需要防止扩展后人人都在微笑。',
    production: '候选路径：整脸定形、有限表情变体、宽肩领口资产。不要逐个随机拼装眼鼻嘴。',
    art: clayArt,
  },
  {
    id: 'ink', number: '03', title: '朱墨刻绘', english: 'VERMILION & INK',
    description: '折线骨点、偏侧构图与清楚的墨色留白。用轮廓和姿态留下印象。',
    grammar: '不对称构图 / 刻线留白 / 角面塑形 / 朱墨套色',
    strength: '黑白关系和服饰剪影鲜明，最容易与另两组拉开视觉距离。',
    risk: '人物更硬朗，表情细腻度较低；不是偏写实方向，也不是古画复刻。',
    production: '候选路径：固定朝向内的整脸与发际单元。倾斜角度不能由运行时自动纠正。',
    art: inkArt,
  },
];

// 自包含 SVG 作为独立图像文档，避免渐变 ID 冲突；不往 DOM 注入字符串。
export function artUrl(source: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
}
export const imageUrls = Object.fromEntries(directions.map(direction => [direction.id,
  Object.fromEntries(roles.map(role => [role.id, artUrl(direction.art[role.id])])),
])) as Record<DirectionId, Record<StudyRole, string>>;
