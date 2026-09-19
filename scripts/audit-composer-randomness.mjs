import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto((process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173') + '/?view=portrait-composer-lab');
  const report = await page.evaluate(async () => {
    const { randomLook, crowdLooks, defaultLook, choices, keys } = await import('/src/portrait-composer-lab/model.ts');
    const samples = crowdLooks(defaultLook);
    // 不用人为覆盖的展示墙证明随机覆盖率：单独生成 512 个完整随机配方。
    const rows = Array.from({ length: 512 }, (_, seed) => randomLook(defaultLook, false, seed));
    return {
      repeatable: JSON.stringify(rows) === JSON.stringify(Array.from({ length: 512 }, (_, seed) => randomLook(defaultLook, false, seed))),
      crowdRepeatable: JSON.stringify(samples) === JSON.stringify(crowdLooks(defaultLook)),
      fields: keys.filter(key => key !== 'frame').map(key => ({ key, options: choices[key].map(item => item.id), seen: [...new Set(rows.map(row => row[key]))] })),
      expectedFaces: choices.faceFamilyId.map(item => item.id),
      femaleFaces: [...new Set(samples.filter(row => row.frame === 'female.adult').map(row => row.faceFamilyId))],
      maleFaces: [...new Set(samples.filter(row => row.frame === 'male.adult').map(row => row.faceFamilyId))],
      crowdHats: [...new Set(samples.map(row => row.headwearStyleId))], samples,
    };
  });
  assert(report.repeatable && report.crowdRepeatable, 'Seeded generation must remain repeatable');
  for (const field of report.fields) assert.deepEqual([...field.seen].sort(), [...field.options].sort(), `Random generation excluded catalog options: ${field.key}`);
  assert.equal(report.expectedFaces.length, 8);
  assert.deepEqual([...report.femaleFaces].sort(), [...report.expectedFaces].sort(), 'Fixed demonstration must include every female FaceFamily');
  assert.deepEqual([...report.maleFaces].sort(), [...report.expectedFaces].sort(), 'Fixed demonstration must include every male FaceFamily');
  assert.equal(report.crowdHats.length, 5, 'Fixed demonstration must include every headwear option');
  let streak = 1, longest = 1;
  for (let index = 1; index < report.samples.length; index++) {
    streak = report.samples[index].headwearStyleId === report.samples[index - 1].headwearStyleId ? streak + 1 : 1;
    longest = Math.max(longest, streak);
  }
  assert(longest <= 3, 'Fixed crowd regressed to long runs of correlated hats');
  await mkdir('review-screenshots/composer', { recursive: true });
  await writeFile('review-screenshots/composer/randomness.json', JSON.stringify({ status: 'automated-pass', seedCount: 512, longestHeadwearRun: longest, distribution: 'The UI crowd is a stratified coverage demonstration; independent random coverage uses 512 seeds.', ...report }, null, 2));
  console.log('512 random seeds cover the full catalog; the separate 24-resident demonstration covers all 16 face assets and 5 headwear choices.');
} finally { await browser.close(); }
