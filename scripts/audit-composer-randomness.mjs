import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto((process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173') + '/?view=portrait-composer-lab');
  const report = await page.evaluate(async () => {
    const { randomLook, defaultLook, choices, keys } = await import('/src/portrait-composer-lab/model.ts');
    const samples = Array.from({ length: 24 }, (_, index) => randomLook({ ...defaultLook, frame: index % 2 ? 'male.adult' : 'female.adult' }, false, 8191 + index * 7919));
    const rows = Array.from({ length: 512 }, (_, seed) => randomLook(defaultLook, false, seed));
    return {
      repeatable: JSON.stringify(rows) === JSON.stringify(Array.from({ length: 512 }, (_, seed) => randomLook(defaultLook, false, seed))),
      fields: keys.filter(key => key !== 'frame').map(key => ({ key, options: choices[key].map(item => item.id), seen: [...new Set(rows.map(row => row[key]))] })),
      femaleFaces: [...new Set(samples.filter(row => row.frame === 'female.adult').map(row => row.faceFamilyId))],
      maleFaces: [...new Set(samples.filter(row => row.frame === 'male.adult').map(row => row.faceFamilyId))],
      crowdHats: [...new Set(samples.map(row => row.headwearStyleId))],
      samples,
    };
  });
  assert(report.repeatable, 'Seeded generation must remain repeatable');
  for (const field of report.fields) assert.deepEqual([...field.seen].sort(), [...field.options].sort(), `Random generation excluded catalog options: ${field.key}`);
  assert.equal(report.femaleFaces.length, 4, 'Fixed crowd should demonstrate every female FaceFamily');
  assert.equal(report.maleFaces.length, 4, 'Fixed crowd should demonstrate every male FaceFamily');
  assert.equal(report.crowdHats.length, 5, 'Fixed crowd should demonstrate every headwear option');
  let streak = 1, longest = 1;
  for (let index = 1; index < report.samples.length; index++) {
    streak = report.samples[index].headwearStyleId === report.samples[index - 1].headwearStyleId ? streak + 1 : 1;
    longest = Math.max(longest, streak);
  }
  assert(longest <= 3, 'Fixed crowd regressed to long runs of correlated hats');
  await mkdir('review-screenshots/composer', { recursive: true });
  await writeFile('review-screenshots/composer/randomness.json', JSON.stringify({ status: 'automated-pass', seedCount: 512, longestHeadwearRun: longest, ...report }, null, 2));
  console.log('Seed mixing and full-catalog sampling passed; 24-person proof includes all eight faces and five headwear options.');
} finally { await browser.close(); }
