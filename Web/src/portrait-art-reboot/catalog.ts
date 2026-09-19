/** 美术决策用的固定角色设定，不是正式 DNA / Frame 资产目录。 */
export const roles = [
  { id: 'woman', label: '平民女性', question: '朴素衣着，也值得被记住。' },
  { id: 'man', label: '平民男性', question: '有营生、有性格，不是统一路人脸。' },
  { id: 'elder', label: '老年居民', question: '年龄来自体块与神态，不是只把头发变灰。' },
  { id: 'noble', label: '贵族女性', question: '发式、衣料与仪态共同建立层级。' },
  { id: 'sovereign', label: '高阶男性', question: '冠服与肩部轮廓不同，不只增加金色。' },
] as const;
export type RoleId = typeof roles[number]['id'];
export const directions = [
  {
    id: 'painted', number: '01', name: '绢色人物', english: 'PAINTED CHARACTER',
    summary: '以角色设定先行，保留插画的气质与衣料。',
    medium: '栅格插画 Proof · 192 px 单幅母图 · 含纸底',
    construction: '自然比例 / 三分之二侧面 / 笔触与细线 / 多级柔和明暗',
    strength: '人物气质和服饰完成度较高；普通人与皇室能处于同一插画世界。',
    risk: '细节密度最高。冠顶裁切、饰品简化和 48 px 专用重绘仍需要验证。',
    production: '选中后重新绘制统一 Frame 的分层母稿；当前整图不能直接换发型或衣服。',
    colors: ['#3d3934', '#bd735a', '#b6c2bd', '#e3c5a0'],
  },
  {
    id: 'graphic', number: '02', name: '市井绘本', english: 'GRAPHIC STORYBOOK',
    summary: '把性格放进轮廓，把生活感放进表情。',
    medium: '独立矢量原画 · 320 px 画布 · 透明底',
    construction: '宽窄脸对比 / 偏转五官 / 非对称发束 / 两至三级色面',
    strength: '明暗关系简洁，衣领和身份轮廓明确；适合继续探索普通居民的批量辨识。',
    risk: '更偏平面插画。侧脸、老年男性和儿童尚未覆盖，不能据此宣称群体多样性通过。',
    production: '固定姿态后按六个 Frame 重绘 Face / Hair / Outfit；不添加运行时自动适配。',
    colors: ['#273e42', '#397b7c', '#ba694d', '#efc59e'],
  },
  {
    id: 'clay', number: '03', name: '陶彩小像', english: 'SCULPTED COLOUR',
    summary: '用圆润体块和集中的五官，换取小头像的亲和力。',
    medium: '2.5D 矢量明暗 Proof · 不是已完成的 3D 模型',
    construction: '较大头部 / 短中庭 / 体积光 / 圆角衣料与束发体块',
    strength: '剪影与明暗较集中，普通居民更亲和；与前两组形成明确的比例和材质差异。',
    risk: '玩偶感较强，高阶人物的庄重感弱于 01。是否契合游戏整体调性需要选择。',
    production: '可继续验证分层绘制，或独立制作模型后离线烘焙；当前不存在模型或烘焙管线。',
    colors: ['#223a42', '#779d93', '#b5654f', '#ead2a2'],
  },
] as const;
export type Direction = typeof directions[number];
export type DirectionId = Direction['id'];
export const pixelSizes = [48, 64, 96] as const;
