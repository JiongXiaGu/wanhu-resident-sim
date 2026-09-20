import type {Frame} from '../../model';
import type {HairId} from './catalog';
import type {ChibiHairLayers} from './art-spec';
import {OUTLINE,hairColor,hairLight,isFemale,l,p} from './drawing';

// Phase 8A 样板：先画完整头部轮廓，再决定哪一层可见。只有固定 Frame，不接受 Face。
// 成年其余 ID 位于 adult-hair.ts；这里保留 8A 已交付样板，同一 ID 不保留两套画稿。
export function sampleHair(frame:Frame,id:HairId):ChibiHairLayers|undefined{
 const c=hairColor(frame),h=hairLight(frame),female=isFemale(frame);
 const layers=(back:string,front:string,headwearFront='',headwearBack=''):ChibiHairLayers=>({back,front,headwearFront,headwearBack});
 if(id==='bound'){
  const bun=p('M139 60C123 43 139 24 160 26C182 23 198 44 181 62Z',c,OUTLINE,4.5)+l('M140 45Q160 31 180 46',h,2.8,.65);
  const front=p(female
   ?'M85 161C65 125 74 85 101 63C119 46 141 43 160 44C196 39 231 62 242 101Q253 137 232 172L221 166Q220 137 206 124Q179 113 160 92Q145 112 121 121Q101 136 100 169L90 175Z'
   :'M84 161C64 124 76 85 102 63C125 43 149 42 163 43C202 41 234 68 242 102Q251 140 233 170L221 169L216 140Q208 121 193 116Q168 120 153 105Q132 123 114 124Q101 141 101 171L88 175Z',c,OUTLINE,4.5);
  return layers(bun,front+l(female?'M160 53L160 88M148 62Q116 73 101 100M174 63Q204 75 221 103':'M112 92Q132 65 156 61M172 61Q201 70 217 92',h,3,.5));
 }
 if(id==='scholar-cap'){
  // 帽身完整放在前层，帽下只留下两侧鬓发；不让前发把帽身切成横条。
  const hair=p('M89 150Q73 115 94 86Q118 56 160 57Q202 55 226 84Q244 110 232 154L222 174L213 169L211 144Q186 130 160 133Q132 130 109 143L106 174L95 174Z',c,OUTLINE,4.5);
  const hat=p('M81 113L94 72Q98 57 116 52Q160 43 204 52Q222 57 226 72L239 113L233 126Q160 138 87 126Z','#4e5a5b',OUTLINE,4.5)
   +p('M82 113Q160 124 238 113L233 126Q160 138 87 126Z','#374748',OUTLINE,3)
   +l('M104 76Q111 66 127 64M216 76Q209 66 193 64','#899794',3,.7)
   +l('M126 63Q160 57 194 63','#a6b1a9',2.5,.45);
  return layers('',hair,hat);
 }
 if(id==='work-headscarf'){
  const hair=p('M86 154Q71 116 94 83Q119 50 160 51Q202 49 227 84Q246 114 234 154L224 174L213 168L209 142Q186 130 160 132Q135 130 112 143L106 175L94 171Z',c,OUTLINE,4.5);
  const tail=p('M219 107Q242 103 252 117L242 146L255 176Q240 178 226 163L227 135Z','#867155',OUTLINE,3.5);
  const wrap=p('M79 117Q84 82 106 67Q133 47 161 48Q194 45 217 69Q236 89 241 119L229 135Q199 125 176 125Q120 127 90 139Z','#ac9571',OUTLINE,4.5)
   +p('M82 117Q138 104 198 119L229 135Q185 125 142 132L90 139Z','#cab18a',OUTLINE,3)
   +l('M110 77Q133 60 160 62','#e6cfa9',3,.45)
   +l('M110 89Q141 70 185 76','#e6cfa9',2.5,.45);
  return layers('',hair,wrap,tail);
 }
 return undefined;
}
