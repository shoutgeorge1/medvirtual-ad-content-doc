/**
 * Variations review board: Treatment E (scroll-stopper) vs V (unique per concept).
 * Run: node scripts/generate-wave1-variations-review.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const T_DIR = path.join(PUB, 'exports/wave1-first-launch/treatments');
const sc = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-scroll-report.json'), 'utf8'));
const va = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-variations-report.json'), 'utf8'));
const rel = (abs) => path.relative(PUB, abs).replace(/\\/g, '/');
const scById = Object.fromEntries(sc.concepts.map((c) => [c.id, c]));
const vaById = Object.fromEntries(va.concepts.map((c) => [c.id, c]));
const ORDER = ['VMA-33', 'VMA-34', 'VMA-37', 'VMA-41', 'VMA-43'];

const STYLE_DESC = {
  'VMA-33': 'Banner callout + cyan underline focal',
  'VMA-34': 'Outline pill + highlighter marker focal',
  'VMA-37': 'Underlined kicker + outline box focal',
  'VMA-41': 'Angled ribbon + knockout band focal',
  'VMA-43': 'Big directive top + color-swap chevrons focal',
};

function cell(file, label, t, hot) {
  const src = `/exports/wave1-first-launch/treatments/${file}`;
  return `<div class="cell${hot ? ' hot' : ''}">
    <div class="lab">${label}</div>
    <img src="${src}" alt="${label}"/>
    <div class="thumbrow"><img class="thumb" src="${src}"/><span class="tnote">feed-scale</span></div>
    <table class="diag">
      <tr><td>callout</td><td>${t.audience || '—'}</td></tr>
      <tr><td>directive</td><td>${t.directive || '—'}</td></tr>
      <tr><td>focal</td><td>${t.focal || 'tilted slab'}</td></tr>
      <tr><td>headline</td><td>${t.headlineSize}px</td></tr>
      <tr><td>CTA</td><td>${t.cta}</td></tr>
    </table>
  </div>`;
}

const rows = ORDER.map((id) => {
  const e = scById[id].treatments.E;
  const v = vaById[id];
  return `<section class="row">
    <h2>${id} <span>${v.copy.headline}</span></h2>
    <p class="style-note"><b>V style:</b> ${STYLE_DESC[id]}</p>
    <div class="grid">
      ${cell(e.file, 'E — Scroll-Stopper (tilted focal slab)', e, false)}
      ${cell(v.file, 'V — Unique Variation (new focal + callout)', v, true)}
    </div>
  </section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · Variations Review (E vs V · 4:5)</title>
<style>
  :root{--teal:#077999;--cyan:#00B2E2;--deep:#0D546B}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#eef4f6;color:#0b1f27}
  header{background:linear-gradient(120deg,var(--deep),var(--teal));color:#fff;padding:26px 40px}
  header h1{margin:0 0 6px;font-size:25px}
  header p{margin:4px 0;opacity:.95;max-width:980px;font-size:14px}
  main{padding:22px 30px 80px}
  .row{background:#fff;border-radius:16px;padding:20px 22px;margin:0 0 26px;box-shadow:0 6px 20px rgba(13,84,107,.10)}
  .row h2{margin:0 0 6px;font-size:18px;color:var(--deep)}
  .row h2 span{font-weight:400;color:#5a6b72;font-size:14px;margin-left:8px}
  .style-note{margin:0 0 14px;font-size:13px;color:#077999}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .cell{border:1px solid #dce6e9;border-radius:12px;overflow:hidden;background:#f7fafb;display:flex;flex-direction:column}
  .cell.hot{border:2px solid var(--cyan);box-shadow:0 0 0 3px rgba(0,178,226,.15)}
  .cell .lab{font-size:12px;font-weight:700;padding:8px 10px;background:#eaf5f9;color:var(--deep);border-bottom:1px solid #dce6e9}
  .cell.hot .lab{background:var(--cyan);color:#06333f}
  .cell>img{display:block;width:100%;height:auto}
  .thumbrow{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0d2630}
  .thumb{width:96px;height:120px;object-fit:cover;border-radius:4px;border:1px solid #123}
  .tnote{color:#9fd8e8;font-size:11px}
  table.diag{width:100%;border-collapse:collapse;font-size:11.5px;font-family:ui-monospace,Menlo,Consolas,monospace}
  table.diag td{padding:4px 10px;border-top:1px solid #eef;vertical-align:top}
  table.diag td:first-child{color:#7a8a90;width:64px}
  .contact img{width:100%;border-radius:12px;border:1px solid #dce6e9}
  .legend{background:#fff;border-radius:12px;padding:16px 20px;margin:0 0 26px;font-size:13px;line-height:1.6}
  .legend b{color:var(--deep)}
</style></head>
<body>
  <header>
    <h1>Wave 1 · Variations Review — E vs V (4:5, 1080×1350)</h1>
    <p><b>V</b> replaces the tilted focal slab with five different, cleaner focal-word styles and gives each concept a unique owner-targeted top callout. Every ad now opens with who it's for (clinic owners / practice owners / office managers) and states the directive: <b>HIRE A VIRTUAL MEDICAL ADMIN</b> (bilingual variant for Spanish concepts).</p>
    <p>Pick the winner per concept — E or V — and tell us which callout style and focal style worked best. No image-generation calls. Portrait plates unchanged.</p>
  </header>
  <main>
    <div class="legend">
      <b>Five unique formatting scenarios (Treatment V):</b><br>
      VMA-33 · <b>filled banner</b> callout + <b>underline</b> focal &nbsp;|&nbsp;
      VMA-34 · <b>outline pill</b> callout + <b>highlighter</b> focal &nbsp;|&nbsp;
      VMA-37 · <b>underlined kicker</b> callout + <b>outline box</b> focal &nbsp;|&nbsp;
      VMA-41 · <b>angled ribbon</b> callout + <b>knockout band</b> focal &nbsp;|&nbsp;
      VMA-43 · <b>big directive</b> callout + <b>color-swap chevrons</b> focal
    </div>
    ${rows}
    <section class="row contact">
      <h2>Contact sheet — all 5 variations (V)</h2>
      <img src="/exports/wave1-first-launch/contact-sheet-4x5-variations.png" alt="contact sheet"/>
    </section>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-variations-review.html'), html);

async function contactSheet() {
  const tw = 300, th = 375, gap = 16, padX = 20, headH = 46, rowLabelH = 26;
  const cw = padX * 2 + tw, ch = headH + ORDER.length * (rowLabelH + th + gap) + padX;
  const labels = [`<text x="${padX + tw / 2}" y="30" font-family="Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#0D546B" text-anchor="middle">TREATMENT V — UNIQUE VARIATIONS</text>`];
  const comps = [];
  for (let r = 0; r < ORDER.length; r++) {
    const id = ORDER[r];
    const v = vaById[id];
    const rowTop = headH + r * (rowLabelH + th + gap);
    labels.push(`<text x="${padX}" y="${rowTop + 18}" font-family="Segoe UI,sans-serif" font-size="14" font-weight="700" fill="#077999">${id} — ${STYLE_DESC[id]}</text>`);
    const buf = await sharp(fs.readFileSync(path.join(T_DIR, v.file))).resize(tw, th, { fit: 'cover' }).png().toBuffer();
    comps.push({ input: buf, top: rowTop + rowLabelH, left: padX });
  }
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" fill="#ffffff"/>${labels.join('')}</svg>`);
  const out = path.join(PUB, 'exports/wave1-first-launch/contact-sheet-4x5-variations.png');
  await sharp(bg).composite(comps).png().toBuffer().then((b) => fs.writeFileSync(out, b));
  console.log('Contact sheet:', rel(out));
}

await contactSheet();
console.log('Review board: public/wave1-variations-review.html');
