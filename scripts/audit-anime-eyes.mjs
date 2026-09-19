import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// 艺术审查发现的回归：虹膜不能露出眼白，不能用遮罩掩盖错误坐标。
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto((process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173') + '/?view=portrait-anime-lab', { waitUntil: 'networkidle' });
  const report = await page.evaluate(async () => {
    const { options, initialLook } = await import('/src/portrait-anime-lab/model.ts');
    const { renderPortrait } = await import('/src/portrait-anime-lab/render.ts');
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
    document.body.append(host);
    const cases = [];
    for (const frame of options.frame) for (const face of options.face) for (const expression of options.expression) {
      host.innerHTML = renderPortrait({ ...initialLook, frame: frame.id, face: face.id, expression: expression.id });
      const whites = [...host.querySelectorAll('[data-eye-whites] path')];
      const irises = [...host.querySelectorAll('[data-iris]')];
      const id = [frame.id, face.id, expression.id].join('/');
      if (expression.id === 'laugh') {
        if (whites.length || irises.length) throw new Error(`Closed-eye laugh left an iris behind: ${id}`);
        cases.push({ id, eyes: 'closed', points: 0 });
        continue;
      }
      if (whites.length !== 2 || irises.length !== 2) throw new Error(`Missing paired eyes: ${id}`);
      let points = 0;
      for (let side = 0; side < 2; side++) {
        const white = whites[side], whiteInverse = white.getCTM().inverse();
        for (const ellipse of irises[side].querySelectorAll('ellipse')) {
          const cx = ellipse.cx.baseVal.value, cy = ellipse.cy.baseVal.value;
          const rx = ellipse.rx.baseVal.value, ry = ellipse.ry.baseVal.value;
          for (let index = 0; index < 72; index++) {
            const angle = index * Math.PI * 2 / 72;
            const point = new DOMPoint(cx + rx * Math.cos(angle), cy + ry * Math.sin(angle));
            const local = point.matrixTransform(ellipse.getCTM()).matrixTransform(whiteInverse);
            if (!white.isPointInFill(local)) throw new Error(`Iris/pupil/highlight extends beyond eye white: ${id}, side ${side}, sample ${index}`);
            points++;
          }
        }
      }
      cases.push({ id, eyes: 'open', points });
    }
    host.remove();
    return cases;
  });
  assert.equal(report.length, 64);
  assert.equal(report.filter(row => row.eyes === 'open').length, 56);
  await mkdir('review-screenshots/anime', { recursive: true });
  await writeFile('review-screenshots/anime/eye-audit.json', JSON.stringify({
    commit: process.env.GITHUB_SHA ?? 'local', status: 'automated-pass', cases: report,
    note: 'Geometry containment is a regression guard, not a substitute for visual inspection. No clipping or runtime fitting was introduced.',
  }, null, 2));
  console.log('All 64 face/expression pairs passed eye geometry review; iris, pupil and highlights stay inside both eye whites.');
} finally { await browser.close(); }
