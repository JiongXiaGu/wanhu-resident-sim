import type { FaceId, Look } from '../model';
import { bilateral, e, l, p, skins } from './drawing';

// 四套女性、四套男性直接画在同一个实验画布中。轮廓不随表情变化。
const female: Record<FaceId, string> = {
  soft: 'M75 94C75 63 98 51 128 52C158 51 181 63 181 94L178 126C175 148 159 160 141 174Q128 184 115 174C97 160 81 148 78 126Z',
  round: 'M75 94C74 64 99 52 128 52C157 52 182 64 181 94L184 122C186 143 175 156 157 166Q141 179 128 179Q115 179 99 166C81 156 70 143 72 122Z',
  long: 'M77 92C78 64 100 52 128 52C156 52 178 64 179 92L175 127C172 149 158 169 140 181Q128 191 116 181C98 169 84 149 81 127Z',
  angular: 'M75 94C76 64 99 52 128 52C157 52 180 64 181 94L180 123Q180 144 168 155L149 174Q141 182 128 183Q115 182 107 174L88 155Q76 144 76 123Z',
};
const male: Record<FaceId, string> = {
  soft: 'M75 94C75 62 100 51 128 52C156 51 181 62 181 94L180 127Q177 148 161 163L144 180Q136 186 128 186Q120 186 112 180L95 163Q79 148 76 127Z',
  round: 'M74 94C74 63 99 52 128 52C157 52 182 63 182 94L184 124Q186 147 169 160L151 174Q139 183 128 183Q117 183 105 174L87 160Q70 147 72 124Z',
  long: 'M77 93C77 63 99 52 128 52C157 52 179 63 179 93L176 127Q174 150 162 167L144 186Q136 193 128 193Q120 193 112 186L94 167Q82 150 80 127Z',
  angular: 'M75 93C76 64 100 52 128 52C156 52 180 64 181 93L183 123L179 147Q177 156 169 163L150 182Q143 190 128 190Q113 190 106 182L87 163Q79 156 77 147L73 123Z',
};
export function faceBase(look: Look): string {
  const s = skins[look.skin];
  const outline = (look.frame === 'female.adult' ? female : male)[look.face];
  const ears = bilateral(p('M78 119Q62 109 67 129Q69 143 80 141Z',s.base,s.line,1.2)+l('M71 120Q78 120 73 132',s.shade,1.5));
  // 只用窄侧影和下颌投影，不把大块硬阴影压在鼻口之间。
  const shade = bilateral(p('M78 98L83 125Q85 143 99 154L111 168Q87 153 80 133Z',s.shade));
  const nose = p('M128 133L125 141Q128 144 131 141Z',s.shade)+e(128,137,1,2,s.light);
  return ears + p(outline,s.base,s.line,1.4) + shade + nose;
}
export function neckArt(look: Look): string {
  const s = skins[look.skin];
  return p('M107 173L106 195L93 205L128 230L163 205L150 195L149 173Z',s.base,s.line,1)+p('M107 174Q128 191 149 174L150 192Q128 208 106 192Z',s.shade);
}

// 这些是每个 FaceFamily 自己的眼型设计，不是按脸轮廓实时求解锚点。
export type EyeDesign = { outer: number; inner: number; center: number; top: number; bottom: number; tilt: number; brow: number; iris: number; mouth: number; weight: number };
const eyeFemale: Record<FaceId, EyeDesign> = {
  soft: { outer: 83, inner: 115, center: 100, top: 105, bottom: 131, tilt: 2, brow: 98, iris: 7.8, mouth: 11, weight: 2.6 },
  round: { outer: 81, inner: 115, center: 99, top: 102, bottom: 134, tilt: 0, brow: 95, iris: 9, mouth: 12, weight: 2.6 },
  long: { outer: 84, inner: 115, center: 101, top: 111, bottom: 131, tilt: 3, brow: 102, iris: 6.6, mouth: 9, weight: 2.3 },
  angular: { outer: 81, inner: 115, center: 99, top: 109, bottom: 130, tilt: 6, brow: 98, iris: 7, mouth: 12, weight: 2.8 },
};
const eyeMale: Record<FaceId, EyeDesign> = {
  soft: { outer: 81, inner: 115, center: 99, top: 110, bottom: 131, tilt: 2, brow: 99, iris: 7, mouth: 12, weight: 2 },
  round: { outer: 80, inner: 115, center: 98, top: 107, bottom: 134, tilt: 0, brow: 97, iris: 8, mouth: 13, weight: 2.1 },
  long: { outer: 85, inner: 115, center: 101, top: 114, bottom: 131, tilt: 3, brow: 103, iris: 6, mouth: 10, weight: 1.9 },
  angular: { outer: 80, inner: 115, center: 98, top: 112, bottom: 132, tilt: 6, brow: 99, iris: 6.8, mouth: 13, weight: 2.3 },
};
export const eyeDesign = (look: Look): EyeDesign => (look.frame === 'female.adult' ? eyeFemale : eyeMale)[look.face];
