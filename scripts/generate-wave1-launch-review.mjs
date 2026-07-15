/**
 * Launch review board: Variant V vs Variant W per concept (4:5).
 * Run: node scripts/generate-wave1-launch-review.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const T_DIR = path.join(PUB, 'exports/wave1-first-launch/treatments');
const rep = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-launch-report.json'), 'utf8'));
const rel = (abs) => path.relative(PUB, abs).replace(/\\/g, '/');
const byId = Object.fromEntries(rep.concepts.map((c) => [c.id, c]));
const ORDER = ['VMA-33', 'VMA-34', 'VMA-37', 'VMA-41', 'VMA-43'];

function cell(t, label) {
  const src = `/exports/wave1-first-launch/treatments/${t.file}`;
  return `<div class="cell">
    <div class="lab">${label}</div>
    <img src="${src}" alt="${label}"/>
    <div class="thumbrow"><img class="thumb" src="${src}"/><span class="tnote">feed-scale</span></div>
    <table class="diag">
      <tr><td>callout</td><td>${t.style} · ${t.audience}</td></tr>
      <tr><td>focal</td><td>${t.focal}</td></tr>
      <tr><td>icon</td><td>${t.icon} (${t.iconAccent})</td></tr>
      <tr><td>offer</td><td>${t.offerTheme} · $10 ${t.priceDollarSize}px</td></tr>
      <tr><td>CTA</td><td>${t.cta}</td></tr>
    </table>
  </div>`;
}

const rows = ORDER.map((id) => {
  const c = byId[id];
  return `<section class="row">
    <h2>${id} <span>${c.treatments.V.copy.headline}</span></h2>
    <div class="grid">
      ${cell(c.treatments.V, 'Variant V')}
      ${cell(c.treatments.W, 'Variant W')}
    </div>
  </section>`;
}).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · Launch Review (V vs W · 4:5)</title>
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
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .cell{border:1px solid #dce6e9;border-radius:12px;overflow:hidden;background:#f7fafb;display:flex;flex-direction:column}
  .cell .lab{font-size:13px;font-weight:700;padding:8px 12px;background:var(--cyan);color:#06333f;border-bottom:1px solid #dce6e9}
  .cell>img{display:block;width:100%;height:auto}
  .thumbrow{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0d2630}
  .thumb{width:100px;height:125px;object-fit:cover;border-radius:4px;border:1px solid #123}
  .tnote{color:#9fd8e8;font-size:11px}
  table.diag{width:100%;border-collapse:collapse;font-size:12px;font-family:ui-monospace,Menlo,Consolas,monospace}
  table.diag td{padding:5px 12px;border-top:1px solid #eef}
  table.diag td:first-child{color:#7a8a90;width:70px}
  .contact img{width:100%;border-radius:12px;border:1px solid #dce6e9}
</style></head><body>
  <header>
    <h1>Wave 1 · Launch Review — Variant V vs W (4:5, 1080×1350)</h1>
    <p>Launch-polish pass: portraits <b>sharpened</b> + more contrast/saturation (no more soft look), <b>icons pop</b> with their own colors (Mexican-flag emblem on VMA-33, EN/ES on VMA-34, new checklist on VMA-37, red alert bell on VMA-41, green calendar on VMA-43), and every concept has two variants with different focal word style, top callout, offer theme, and CTA.</p>
    <p>Tell us the winner per concept (V or W) and any icon/color tweaks. No image-generation calls; approved plates unchanged.</p>
  </header>
  <main>
    ${rows}
    <section class="row contact">
      <h2>Contact sheet — V &amp; W × 5 concepts</h2>
      <img src="/exports/wave1-first-launch/contact-sheet-4x5-launch.png" alt="contact sheet"/>
    </section>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-launch-review.html'), html);

async function contactSheet() {
  const tw = 320, th = 400, gap = 16, padX = 20, headH = 46, rowLabelH = 26, cols = 2;
  const cw = padX * 2 + cols * tw + (cols - 1) * gap;
  const ch = headH + ORDER.length * (rowLabelH + th + gap) + padX;
  const labels = ['Variant V', 'Variant W'].map((t, i) =>
    `<text x="${padX + i * (tw + gap) + tw / 2}" y="30" font-family="Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#0D546B" text-anchor="middle">${t}</text>`);
  const comps = [];
  for (let r = 0; r < ORDER.length; r++) {
    const c = byId[ORDER[r]];
    const rowTop = headH + r * (rowLabelH + th + gap);
    labels.push(`<text x="${padX}" y="${rowTop + 18}" font-family="Segoe UI,sans-serif" font-size="14" font-weight="700" fill="#077999">${ORDER[r]} — ${c.treatments.V.copy.headline}</text>`);
    const files = [c.treatments.V.file, c.treatments.W.file];
    for (let col = 0; col < 2; col++) {
      const buf = await sharp(fs.readFileSync(path.join(T_DIR, files[col]))).resize(tw, th, { fit: 'cover' }).png().toBuffer();
      comps.push({ input: buf, top: rowTop + rowLabelH, left: padX + col * (tw + gap) });
    }
  }
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" fill="#ffffff"/>${labels.join('')}</svg>`);
  const out = path.join(PUB, 'exports/wave1-first-launch/contact-sheet-4x5-launch.png');
  await sharp(bg).composite(comps).png().toBuffer().then((b) => fs.writeFileSync(out, b));
  console.log('Contact sheet:', rel(out));
}
await contactSheet();
console.log('Review board: public/wave1-launch-review.html');
