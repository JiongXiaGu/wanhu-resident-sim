export type MockResident = {
  id: string;
  name: string;
  age: number;
  occupation: string;
  district: string;
  family: string;
  activity: string;
  historyCount: number;
  marker: { x: number; y: number };
};

export const MOCK_RESIDENTS: MockResident[] = [
  {
    id: 'resident-shen-he',
    name: '沈荷',
    age: 34,
    occupation: '布庄伙计',
    district: '河东坊',
    family: '已婚 · 两个孩子',
    activity: '正在布庄清点新到的布匹',
    historyCount: 4,
    marker: { x: 26, y: 56 },
  },
  {
    id: 'resident-wu-qiao',
    name: '吴桥',
    age: 47,
    occupation: '陶工',
    district: '南窑巷',
    family: '已婚 · 一子',
    activity: '正在窑口查看新烧出的酒坛',
    historyCount: 6,
    marker: { x: 42, y: 42 },
  },
  {
    id: 'resident-luo-zhen',
    name: '罗贞',
    age: 29,
    occupation: '灯彩匠',
    district: '西市',
    family: '独居',
    activity: '正在街口给一盏旧灯换骨架',
    historyCount: 3,
    marker: { x: 58, y: 61 },
  },
  {
    id: 'resident-chen-yan',
    name: '陈砚',
    age: 41,
    occupation: '账房',
    district: '北市坊',
    family: '已婚',
    activity: '正在茶铺外等一位旧友',
    historyCount: 8,
    marker: { x: 68, y: 35 },
  },
  {
    id: 'resident-sun-ning',
    name: '孙宁',
    age: 18,
    occupation: '学徒',
    district: '桥南里',
    family: '与父母同住',
    activity: '刚替家里送完一趟东西',
    historyCount: 2,
    marker: { x: 73, y: 69 },
  },
  {
    id: 'resident-zhao-lan',
    name: '赵岚',
    age: 62,
    occupation: '退下来的木工',
    district: '井台巷',
    family: '与长子同住',
    activity: '坐在门前替邻居修一只旧木箱',
    historyCount: 11,
    marker: { x: 36, y: 73 },
  },
  {
    id: 'resident-fang-yu',
    name: '方榆',
    age: 38,
    occupation: '郎中',
    district: '城东',
    family: '已婚 · 一女',
    activity: '刚从一户人家出诊回来',
    historyCount: 7,
    marker: { x: 52, y: 28 },
  },
  {
    id: 'resident-he-an',
    name: '何安',
    age: 53,
    occupation: '守闸人',
    district: '南河口',
    family: '已婚',
    activity: '正在河边记录今天过闸的船',
    historyCount: 9,
    marker: { x: 18, y: 38 },
  },
];
