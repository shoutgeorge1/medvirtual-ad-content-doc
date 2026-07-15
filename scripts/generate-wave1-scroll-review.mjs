/**
 * Scroll-stopper review board: Treatment C · D · E · F side by side.
 * C/D = clean direct response (baseline). E/F = dimensional scroll-stopper build.
 * Reads wave1-cd-report.json + wave1-scroll-report.json. Builds HTML + contact sheet.
 *
 * Run: node scripts/generate-wave1-scroll-review.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const T_DIR = path.join(PUB, 'exports/wave1-first-launch/treatments');
const cd = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-cd-report.json'), 'utf8'));
const sc = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-scroll-report.json'), 'utf8'));
const rel = (abs) => path.relative(PUB, abs).replace(/\\/g, '/');
const cdById = Object.fromEntries(cd.concepts.map((c) => [c.id, c]));
const scById = Object.fromEntries(sc.concepts.map((c) => [c.id, c]));
const ORDER = ['VMA-33', 'VMA-34', 'VMA-37', 'VMA-41', 'VMA-43'];

function cell(file, label, t, tag) {
  const src = `/exports/wave1-first-launch/treatments/${file}`;
  return `<div class="cell${tag === 'new' ? ' hot' : ''}">
    <div class="lab">${label}</div>
    <img src="${src}" alt="${label}"/>
    <div class="thumbrow"><img class="thumb" src="${src}"/><span class="tnote">feed-scale</span></div>
    <table class="diag">
      <tr><td>headline</td><td>${t.headlineSize}px</td></tr>
      <tr><td>$10/HR</td><td>${t.priceDollarSize}px</td></tr>
      <tr><td>CTA</td><td>${t.ctaSize}px · ${t.cta}</td></tr>
      <tr><td>icon</td><td>${t.icon || '—'}</td></tr>
      <tr><td>effects</td><td>${(t.effects || ['flat']).join(', ')}</td></tr>
    </table>
  </div>`;
}

const rows = ORDER.map((id) => {
  const c = cdById[id];
  const s = scById[id];
  return `<section class="row">
    <h2>${id} <span>${s.treatments.E.copy.headline}</span></h2>
    <div class="grid">
      ${cell(c.treatments.C.file, 'C — Direct Response (base)', c.treatments.C, 'base')}
      ${cell(c.treatments.D.file, 'D — DR + Benefits (base)', c.treatments.D, 'base')}
      ${cell(s.treatments.E.file, 'E — Scroll-Stopper (from C)', s.treatments.E, 'new')}
      ${cell(s.treatments.F.file, 'F — Scroll-Stopper + Benefits (from D)', s.treatments.F, 'new')}
    </div>
  </section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · Scroll-Stopper Review (C/D/E/F · 4:5)</title>
<style>
  :root{--teal:#077999;--cyan:#00B2E2;--deep:#0D546B}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#eef4f6;color:#0b1f27}
  header{background:linear-gradient(120deg,var(--deep),var(--teal));color:#fff;padding:26px 40px}
  header h1{margin:0 0 6px;font-size:25px}
  header p{margin:4px 0;opacity:.95;max-width:980px;font-size:14px}
  main{padding:22px 30px 80px}
  .row{background:#fff;border-radius:16px;padding:20px 22px;margin:0 0 26px;box-shadow:0 6px 20px rgba(13,84,107,.10)}
  .row h2{margin:0 0 14px;font-size:18px;color:var(--deep)}
  .row h2 span{font-weight:400;color:#5a6b72;font-size:14px;margin-left:8px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .cell{border:1px solid #dce6e9;border-radius:12px;overflow:hidden;background:#f7fafb;display:flex;flex-direction:column}
  .cell.hot{border:2px solid var(--cyan);box-shadow:0 0 0 3px rgba(0,178,226,.15)}
  .cell .lab{font-size:12px;font-weight:700;padding:8px 10px;background:#eaf5f9;color:var(--deep);border-bottom:1px solid #dce6e9}
  .cell.hot .lab{background:var(--cyan);color:#06333f}
  .cell>img{display:block;width:100%;height:auto}
  .thumbrow{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0d2630}
  .thumb{width:92px;height:115px;object-fit:cover;border-radius:4px;border:1px solid #123}
  .tnote{color:#9fd8e8;font-size:11px}
  table.diag{width:100%;border-collapse:collapse;font-size:11.5px;font-family:ui-monospace,Menlo,Consolas,monospace}
  table.diag td{padding:4px 10px;border-top:1px solid #eef;vertical-align:top}
  table.diag td:first-child{color:#7a8a90;width:64px}
  .contact img{width:100%;border-radius:12px;border:1px solid #dce6e9}
</style></head>
<body>
  <header>
    <h1>Wave 1 · Scroll-Stopper Review — C / D / E / F (4:5, 1080×1350)</h1>
    <p><b>E &amp; F</b> build on the approved <b>Treatment C</b> hierarchy with dimensional 3D headline lettering, an exploding focal word, a concept stopping-icon badge, a promo $10/HR block (ribbon + double border + tilt + sparkles), a physical layered CTA button, and motion cues (sparkles + chevrons). E evolves C (offer-first). F evolves D (two benefit blocks).</p>
    <p>Real Be Vietnam ExtraBold (weight 800). No image-generation calls. Portrait plates unchanged. Bilingual concepts use a neutral EN/ES speech-bubble emblem (no national flag or stereotype).</p>
  </header>
  <main>
    ${rows}
    <section class="row contact">
      <h2>Contact sheet — C / D / E / F × 5 concepts</h2>
      <img src="/exports/wave1-first-launch/contact-sheet-4x5-scroll.png" alt="contact sheet"/>
    </section>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-scroll-review.html'), html);

async function contactSheet() {
  const tw = 250, th = 313, gap = 14, padX = 20, headH = 42, rowLabelH = 24, cols = 4;
  const cw = padX * 2 + cols * tw + (cols - 1) * gap;
  const ch = headH + ORDER.length * (rowLabelH + th + gap) + padX;
  const labels = [];
  ['C — DIRECT RESPONSE', 'D — DR + BENEFITS', 'E — SCROLL-STOPPER', 'F — SCROLL + BENEFITS'].forEach((t, i) => {
    const x = padX + i * (tw + gap) + tw / 2;
    labels.push(`<text x="${x}" y="28" font-family="Segoe UI,sans-serif" font-size="15" font-weight="700" fill="#0D546B" text-anchor="middle">${t}</text>`);
  });
  const comps = [];
  for (let r = 0; r < ORDER.length; r++) {
    const id = ORDER[r];
    const c = cdById[id];
    const s = scById[id];
    const files = [
      path.join(T_DIR, c.treatments.C.file),
      path.join(T_DIR, c.treatments.D.file),
      path.join(T_DIR, s.treatments.E.file),
      path.join(T_DIR, s.treatments.F.file),
    ];
    const rowTop = headH + r * (rowLabelH + th + gap);
    labels.push(`<text x="${padX}" y="${rowTop + 17}" font-family="Segoe UI,sans-serif" font-size="14" font-weight="700" fill="#077999">${id} — ${s.treatments.E.copy.headline}</text>`);
    const imgTop = rowTop + rowLabelH;
    for (let col = 0; col < 4; col++) {
      const buf = await sharp(fs.readFileSync(files[col])).resize(tw, th, { fit: 'cover' }).png().toBuffer();
      comps.push({ input: buf, top: imgTop, left: padX + col * (tw + gap) });
    }
  }
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" fill="#ffffff"/>${labels.join('')}</svg>`);
  const out = path.join(PUB, 'exports/wave1-first-launch/contact-sheet-4x5-scroll.png');
  await sharp(bg).composite(comps).png().toBuffer().then((b) => fs.writeFileSync(out, b));
  console.log('Contact sheet:', rel(out));
}

await contactSheet();
console.log('Review board: public/wave1-scroll-review.html');
