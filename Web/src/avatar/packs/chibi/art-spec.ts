// Q版 V2 的内部美术契约。这里定义作者层，不增加玩家可见 Recipe 字段。
export const CHIBI_ART_SPEC_VERSION=2 as const;

export type ChibiHeadwearMode='none'|'integrated';

export type ChibiHairLayers={
  back:string;
  headwearBack:string;
  front:string;
  headwearFront:string;
};

// Outfit 仍是一个玩家选项 / 一个 Renderer Layer；内部用标记区分作者绘制职责，
// 方便 Actions 检查衣领、叠穿和细节没有被塞进 Face / Neck。
export type ChibiOutfitPart='base'|'collar'|'overlay'|'detail';

export const outfitPart=(slot:ChibiOutfitPart,svg:string)=>
  `<g data-chibi-outfit-part="${slot}">${svg}</g>`;

// 固定画布作者规则，不做自动 anchor solver。
export const CHIBI_ART_GUIDE={
  canvas:'0 0 320 320',
  faceCenterX:160,
  mainOutline:5,
  secondaryOutline:3,
  maxPrimaryColorBlocks:4,
  smallSizeProof:[96,64,48] as const,
} as const;

// 仅供作者与 QA 使用的共同安全区；不是运行时裁切框。
// 全部 Face / Expression 的腮红填充和描边还必须离实际脸轮廓至少 2 个画布单位。
export const CHIBI_BLUSH_SAFE_ZONE={
 left:{x:112,y:184,width:32,height:18},
 right:{x:176,y:184,width:32,height:18},
 clearance:2,
} as const;
