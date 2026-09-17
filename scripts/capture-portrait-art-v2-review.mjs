import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.REVIEW_SCREENSHOT_DIR || 'review-screenshots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

await page.goto(`${baseUrl}/?view=portraits`, { waitUntil: 'networkidle' });
await page.waitForSelector('.portrait-lab-card');
await page.waitForTimeout(160);

const cards = page.locator('.portrait-lab-card');
if ((await cards.count()) !== 64) throw new Error('Portrait Art V2 review expects 64 portrait samples.');

const avatarAudit = await page.locator('.portrait-lab-card .generated-portrait').evaluateAll((items) => items.map((item) => ({
  kit: item.getAttribute('data-art-kit'),
  background: item.getAttribute('data-background-style'),
  halo: item.getAttribute('data-halo'),
  faceArtFamily: item.getAttribute('data-face-art-family'),
  ratio: item.getAttribute('data-master-ratio'),
  safeArea: item.getAttribute('data-safe-area'),
  rigState: item.getAttribute('data-rig-state'),
})));

if (avatarAudit.some((item) => item.kit !== 'v2')) throw new Error('Every portrait must render through Portrait Art Kit V2.');
if (avatarAudit.some((item) => item.background !== 'clean-flat' || item.halo !== 'none')) throw new Error('Portrait Art Kit V2 must use the clean background without a halo.');
if (avatarAudit.some((item) => !item.faceArtFamily)) throw new Error('Every portrait must expose a V2 face art family.');
if (avatarAudit.some((item) => item.ratio !== '4:5' || item.safeArea !== '1:1')) throw new Error('Portrait Art Kit V2 must preserve the 4:5 master and 1:1 safe-area contract.');
if (avatarAudit.some((item) => item.rigState !== 'ok')) throw new Error('Portrait Art Kit V2 review found a rig error.');
if ((await page.locator('[data-portrait-halo]').count()) !== 0) throw new Error('A portrait halo element was reintroduced.');

await page.screenshot({ path: `${outDir}/11-portrait-v2-batch.png` });

const genderControls = page.locator('.portrait-lab__filters > div').filter({ hasText: '性别' });
const wealthControls = page.locator('.portrait-lab__filters > div').filter({ hasText: '财富' });

await genderControls.getByRole('button', { name: '女', exact: true }).click();
await page.waitForTimeout(80);
if ((await page.locator('.portrait-lab-card[data-gender="female"]').count()) < 8) throw new Error('V2 female review needs at least eight samples.');
await page.screenshot({ path: `${outDir}/12-portrait-v2-women.png` });

// Face Base review: strip hair, facial hair and headwear in the inspector, then collect
// several female and male bases into one contact sheet. This is the primary check for
// “female != male without beard”.
for (const layerName of ['后发', '前发', '胡须', '头饰']) {
  const button = page.getByRole('button', { name: layerName, exact: true });
  if ((await button.count()) !== 1) throw new Error(`Could not find portrait diagnostic layer button: ${layerName}`);
  await button.click();
}

const faceCells = [];
async function collectFaceBases(gender, count) {
  const buttonName = gender === 'female' ? '女' : '男';
  await genderControls.getByRole('button', { name: buttonName, exact: true }).click();
  await page.waitForTimeout(70);
  const genderCards = page.locator(`.portrait-lab-card[data-gender="${gender}"]`);
  const available = Math.min(count, await genderCards.count());
  for (let index = 0; index < available; index += 1) {
    const card = genderCards.nth(index);
    await card.click();
    await page.waitForTimeout(20);
    const name = (await card.locator('b').first().innerText()).trim();
    const faceId = (await page.locator('.portrait-lab__dna').locator('div').filter({ hasText: 'Face' }).locator('dd').innerText()).trim();
    const portrait = await page.locator('.portrait-lab__preview--crop .generated-portrait').evaluate((element) => element.outerHTML);
    faceCells.push({ gender, name, faceId, portrait });
  }
}

await collectFaceBases('female', 6);
await collectFaceBases('male', 6);

await page.evaluate((cells) => {
  document.getElementById('portrait-v2-face-review')?.remove();
  const board = document.createElement('section');
  board.id = 'portrait-v2-face-review';
  board.style.position = 'fixed';
  board.style.inset = '18px';
  board.style.zIndex = '99999';
  board.style.padding = '22px';
  board.style.borderRadius = '18px';
  board.style.background = '#17221e';
  board.style.color = '#e7dfc7';
  board.style.fontFamily = 'sans-serif';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(6, 150px)';
  board.style.gap = '18px';
  board.style.alignContent = 'start';
  board.style.width = 'fit-content';
  board.style.height = 'fit-content';

  const heading = document.createElement('div');
  heading.textContent = 'PORTRAIT ART V2 · FACE BASE REVIEW · HAIR / BEARD / HEADWEAR OFF';
  heading.style.gridColumn = '1 / -1';
  heading.style.fontSize = '15px';
  heading.style.letterSpacing = '1.5px';
  heading.style.opacity = '.8';
  board.appendChild(heading);

  for (const cell of cells) {
    const item = document.createElement('div');
    item.style.display = 'grid';
    item.style.gap = '7px';
    item.style.width = '150px';
    const frame = document.createElement('div');
    frame.innerHTML = cell.portrait;
    const portrait = frame.firstElementChild;
    portrait.style.width = '150px';
    portrait.style.height = '150px';
    portrait.style.borderRadius = '12px';
    item.appendChild(portrait);
    const label = document.createElement('span');
    label.textContent = `${cell.gender === 'female' ? '女' : '男'} · ${cell.name}`;
    label.style.fontSize = '13px';
    item.appendChild(label);
    const id = document.createElement('small');
    id.textContent = cell.faceId;
    id.style.fontSize = '10px';
    id.style.opacity = '.58';
    id.style.overflow = 'hidden';
    id.style.textOverflow = 'ellipsis';
    item.appendChild(id);
    board.appendChild(item);
  }
  document.body.appendChild(board);
}, faceCells);
await page.locator('#portrait-v2-face-review').screenshot({ path: `${outDir}/13-portrait-v2-face-base.png` });
await page.locator('#portrait-v2-face-review').evaluate((element) => element.remove());

// Restore all genders. Grid portraits never inherit inspector layer toggles, so this is
// still the final assembled art and can be used for Golden / wealth review.
await genderControls.getByRole('button', { name: '全部', exact: true }).click();
await page.waitForTimeout(60);

async function buildContactSheet(id, title, cardSelector, limit = 12) {
  const contactCells = await page.locator(cardSelector).evaluateAll((items, max) => items.slice(0, max).map((card) => {
    const portrait = card.querySelector('.generated-portrait');
    return {
      portrait: portrait?.outerHTML ?? '',
      name: card.querySelector('b')?.textContent?.trim() ?? '',
      role: card.querySelector('.portrait-lab-card__role')?.textContent?.trim() ?? '',
      wealth: card.getAttribute('data-wealth-tier') ?? '',
    };
  }), limit);

  await page.evaluate(({ boardId, headingText, cells }) => {
    document.getElementById(boardId)?.remove();
    const board = document.createElement('section');
    board.id = boardId;
    board.style.position = 'fixed';
    board.style.inset = '18px';
    board.style.zIndex = '99999';
    board.style.padding = '22px';
    board.style.borderRadius = '18px';
    board.style.background = '#17221e';
    board.style.color = '#e7dfc7';
    board.style.fontFamily = 'sans-serif';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(6, 150px)';
    board.style.gap = '18px';
    board.style.alignContent = 'start';
    board.style.width = 'fit-content';
    board.style.height = 'fit-content';

    const heading = document.createElement('div');
    heading.textContent = headingText;
    heading.style.gridColumn = '1 / -1';
    heading.style.fontSize = '15px';
    heading.style.letterSpacing = '1.5px';
    heading.style.opacity = '.8';
    board.appendChild(heading);

    for (const cell of cells) {
      const item = document.createElement('div');
      item.style.display = 'grid';
      item.style.gap = '7px';
      item.style.width = '150px';
      const frame = document.createElement('div');
      frame.innerHTML = cell.portrait;
      const portrait = frame.firstElementChild;
      if (portrait) {
        portrait.style.width = '150px';
        portrait.style.height = '150px';
        portrait.style.borderRadius = '12px';
        item.appendChild(portrait);
      }
      const label = document.createElement('span');
      label.textContent = cell.name;
      label.style.fontSize = '13px';
      item.appendChild(label);
      const role = document.createElement('small');
      role.textContent = cell.role;
      role.style.fontSize = '10px';
      role.style.opacity = '.62';
      item.appendChild(role);
      board.appendChild(item);
    }
    document.body.appendChild(board);
  }, { boardId: id, headingText: title, cells: contactCells });
}

await buildContactSheet('portrait-v2-golden-review', 'PORTRAIT ART V2 · GOLDEN / SHOWCASE ASSEMBLED PORTRAITS', '.portrait-lab-card[data-showcase="true"]', 12);
await page.locator('#portrait-v2-golden-review').screenshot({ path: `${outDir}/14-portrait-v2-golden.png` });
await page.locator('#portrait-v2-golden-review').evaluate((element) => element.remove());

// Four wealth tiers in one review board. The visual difference should come from collar,
// layering and finish rather than occupation uniforms.
const wealthCells = [];
for (const tier of ['poor', 'plain', 'comfortable', 'wealthy']) {
  const tierCards = page.locator(`.portrait-lab-card[data-wealth-tier="${tier}"]`);
  const take = Math.min(3, await tierCards.count());
  for (let index = 0; index < take; index += 1) {
    const card = tierCards.nth(index);
    wealthCells.push(await card.evaluate((element) => ({
      portrait: element.querySelector('.generated-portrait')?.outerHTML ?? '',
      name: element.querySelector('b')?.textContent?.trim() ?? '',
      tier: element.getAttribute('data-wealth-tier') ?? '',
      outfit: element.getAttribute('data-outfit-id') ?? '',
    })));
  }
}

await page.evaluate((cells) => {
  const board = document.createElement('section');
  board.id = 'portrait-v2-wealth-review';
  board.style.position = 'fixed';
  board.style.inset = '18px';
  board.style.zIndex = '99999';
  board.style.padding = '22px';
  board.style.borderRadius = '18px';
  board.style.background = '#17221e';
  board.style.color = '#e7dfc7';
  board.style.fontFamily = 'sans-serif';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(6, 150px)';
  board.style.gap = '18px';
  board.style.alignContent = 'start';
  board.style.width = 'fit-content';
  board.style.height = 'fit-content';
  const heading = document.createElement('div');
  heading.textContent = 'PORTRAIT ART V2 · WEALTH READABILITY · POOR / PLAIN / COMFORTABLE / WEALTHY';
  heading.style.gridColumn = '1 / -1';
  heading.style.fontSize = '15px';
  heading.style.letterSpacing = '1.5px';
  heading.style.opacity = '.8';
  board.appendChild(heading);
  for (const cell of cells) {
    const item = document.createElement('div');
    item.style.display = 'grid';
    item.style.gap = '6px';
    item.style.width = '150px';
    const frame = document.createElement('div');
    frame.innerHTML = cell.portrait;
    const portrait = frame.firstElementChild;
    if (portrait) {
      portrait.style.width = '150px';
      portrait.style.height = '150px';
      portrait.style.borderRadius = '12px';
      item.appendChild(portrait);
    }
    const label = document.createElement('span');
    label.textContent = `${cell.tier.toUpperCase()} · ${cell.name}`;
    label.style.fontSize = '12px';
    item.appendChild(label);
    const outfit = document.createElement('small');
    outfit.textContent = cell.outfit.replace('appearance.outfit.', '');
    outfit.style.fontSize = '9px';
    outfit.style.opacity = '.55';
    item.appendChild(outfit);
    board.appendChild(item);
  }
  document.body.appendChild(board);
}, wealthCells);
await page.locator('#portrait-v2-wealth-review').screenshot({ path: `${outDir}/15-portrait-v2-wealth.png` });
await page.locator('#portrait-v2-wealth-review').evaluate((element) => element.remove());

// Actual-use size board. It intentionally keeps the final 1:1 crop and clean background.
const sizePortraits = await page.locator('.portrait-lab-card .generated-portrait').evaluateAll((items) => items.slice(0, 12).map((item) => item.outerHTML));
await page.evaluate((portraits) => {
  const board = document.createElement('section');
  board.id = 'portrait-v2-size-review';
  board.style.position = 'fixed';
  board.style.inset = '18px';
  board.style.zIndex = '99999';
  board.style.padding = '22px';
  board.style.borderRadius = '18px';
  board.style.background = '#17221e';
  board.style.color = '#e7dfc7';
  board.style.fontFamily = 'sans-serif';
  board.style.display = 'grid';
  board.style.gap = '18px';
  board.style.width = 'fit-content';
  board.style.height = 'fit-content';

  const heading = document.createElement('div');
  heading.textContent = 'PORTRAIT ART V2 · 1:1 GAME-SIZE READABILITY';
  heading.style.fontSize = '15px';
  heading.style.letterSpacing = '1.5px';
  heading.style.opacity = '.8';
  board.appendChild(heading);

  for (const size of [48, 64, 96]) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    const label = document.createElement('b');
    label.textContent = `${size}px`;
    label.style.width = '48px';
    label.style.fontSize = '12px';
    row.appendChild(label);
    for (const html of portraits) {
      const frame = document.createElement('div');
      frame.innerHTML = html;
      const portrait = frame.firstElementChild;
      if (!portrait) continue;
      portrait.style.width = `${size}px`;
      portrait.style.height = `${size}px`;
      portrait.style.minWidth = `${size}px`;
      portrait.style.borderRadius = `${Math.max(7, Math.round(size * .11))}px`;
      row.appendChild(portrait);
    }
    board.appendChild(row);
  }
  document.body.appendChild(board);
}, sizePortraits);
await page.locator('#portrait-v2-size-review').screenshot({ path: `${outDir}/16-portrait-v2-size-review.png` });
await page.locator('#portrait-v2-size-review').evaluate((element) => element.remove());

// Wealth filter remains a functional UI contract after the V2 art renderer swap.
await wealthControls.getByRole('button', { name: '富裕', exact: true }).click();
await page.waitForTimeout(60);
const wealthyCards = page.locator('.portrait-lab-card');
if ((await wealthyCards.count()) < 3) throw new Error('V2 wealth review needs multiple wealthy portraits.');
const wealthyTiers = await wealthyCards.evaluateAll((items) => items.map((item) => item.getAttribute('data-wealth-tier')));
if (wealthyTiers.some((tier) => tier !== 'wealthy')) throw new Error('V2 wealth filter leaked non-wealthy portraits.');

await browser.close();
