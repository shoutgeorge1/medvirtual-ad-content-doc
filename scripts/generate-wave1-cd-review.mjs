/**
 * Diagnostic review board for Wave 1: Treatment A · B · C · D side by side.
 * Shows rendered font family/weight, headline/price/CTA/support sizes, and
 * whether a font fallback occurred (A/B fell back to Regular; C/D use real
 * ExtraBold). Includes a mobile-feed-scale thumbnail row and a contact sheet.
 *
 * Run: node scripts/generate-wave1-cd-review.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const T_DIR = path.join(PUB, 'exports/wave1-first-launch/treatments');
const bold = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-bold-report.json'), 'utf8'));
const cd = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-cd-report.json'), 'utf8'));
const rel = (abs) => path.relative(PUB, abs).replace(/\\/g, '/');

const boldById = Object.fromEntries(bold.concepts.map((c) => [c.id, c]));
const cdById = Object.fromEntries(cd.concepts.map((c) => [c.id, c]));

const ORDER = ['VMA-33', 'VMA-34', 'VMA-37', 'VMA-41', 'VMA-43'];

function diag(t, kind) {
  // kind: 'ab' (fallback Regular) | 'cd' (real ExtraBold)
  if (kind === 'ab') {
    return {
      family: 'Be Vietnam',
      weight: '400 (Regular — FELL BACK)',
      fallback: true,
      head: t.headSize,
      price: t.offerDollarSize,
      cta: t.ctaSize,
      support: t.proofSize,
    };
  }
  return {
    family: t.fontFamily,
    weight: `${t.fontWeightHeadline} (ExtraBold)`,
    fallback: false,
    head: t.headlineSize,
    price: t.priceDollarSize,
    cta: t.ctaSize,
    support: t.benefitSize || t.solutionSize,
  };
}

function cell(file, label, d) {
  const src = `/exports/wave1-first-launch/treatments/${file}`;
  const flag = d.fallback
    ? `<span class="bad">fallback: Arial/Regular</span>`
    : `<span class="good">real ExtraBold</span>`;
  return `<div class="cell">
    <div class="lab">${label}</div>
    <img src="${src}" alt="${label}"/>
    <div class="thumbrow"><img class="thumb" src="${src}" alt="thumb"/><span class="tnote">feed-scale preview</span></div>
    <table class="diag">
      <tr><td>font</td><td>${d.family}</td></tr>
      <tr><td>weight</td><td>${d.weight}</td></tr>
      <tr><td>headline</td><td>${d.head}px</td></tr>
      <tr><td>$10/HR</td><td>${d.price}px</td></tr>
      <tr><td>CTA</td><td>${d.cta}px</td></tr>
      <tr><td>support</td><td>${d.support}px</td></tr>
      <tr><td>render</td><td>${flag}</td></tr>
    </table>
  </div>`;
}

const rows = ORDER.map((id) => {
  const b = boldById[id];
  const c = cdById[id];
  const cdHead = c.treatments.C.copy.headline;
  return `<section class="row">
    <h2>${id} <span>${cdHead}</span></h2>
    <div class="grid">
      ${cell(b.treatments.A.file, 'A — Bold Offer (current)', diag(b.treatments.A, 'ab'))}
      ${cell(b.treatments.B.file, 'B — Talent First (current)', diag(b.treatments.B, 'ab'))}
      ${cell(c.treatments.C.file, 'C — Max Direct Response (new)', diag(c.treatments.C, 'cd'))}
      ${cell(c.treatments.D.file, 'D — DR + Two Benefits (new)', diag(c.treatments.D, 'cd'))}
    </div>
  </section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · A/B/C/D Diagnostic Review (4:5)</title>
<style>
  :root{--teal:#077999;--cyan:#00B2E2;--deep:#0D546B}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#eef4f6;color:#0b1f27}
  header{background:linear-gradient(120deg,var(--deep),var(--teal));color:#fff;padding:26px 40px}
  header h1{margin:0 0 6px;font-size:25px}
  header p{margin:4px 0;opacity:.94;max-width:960px;font-size:14px}
  .callout{background:#062f3c;border:1px solid #0b4f63;border-radius:10px;padding:12px 16px;margin-top:12px;font-size:13px}
  main{padding:22px 30px 80px}
  .row{background:#fff;border-radius:16px;padding:20px 22px;margin:0 0 26px;box-shadow:0 6px 20px rgba(13,84,107,.10)}
  .row h2{margin:0 0 14px;font-size:18px;color:var(--deep)}
  .row h2 span{font-weight:400;color:#5a6b72;font-size:14px;margin-left:8px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .cell{border:1px solid #dce6e9;border-radius:12px;overflow:hidden;background:#f7fafb;display:flex;flex-direction:column}
  .cell .lab{font-size:12px;font-weight:700;padding:8px 10px;background:#eaf5f9;color:var(--deep);border-bottom:1px solid #dce6e9}
  .cell>img{display:block;width:100%;height:auto}
  .thumbrow{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0d2630}
  .thumb{width:96px;height:120px;object-fit:cover;border-radius:4px;border:1px solid #123}
  .tnote{color:#9fd8e8;font-size:11px}
  table.diag{width:100%;border-collapse:collapse;font-size:12px;font-family:ui-monospace,Menlo,Consolas,monospace}
  table.diag td{padding:4px 10px;border-top:1px solid #eef}
  table.diag td:first-child{color:#7a8a90;width:74px}
  .good{color:#0a7d3b;font-weight:700}
  .bad{color:#b23a2f;font-weight:700}
  .contact img{width:100%;border-radius:12px;border:1px solid #dce6e9}
</style></head>
<body>
  <header>
    <h1>Wave 1 · A/B/C/D Diagnostic Review — 4:5 (1080×1350)</h1>
    <p><b>Font audit result:</b> the Be Vietnam TTFs register every weight under one family ("Be Vietnam"), so referencing "Be Vietnam ExtraBold" as a family silently fell back to <b>Regular (400)</b>. Treatments <b>A/B</b> were rendered before the fix (Regular). Treatments <b>C/D</b> use the corrected pipeline: <code>font-family="Be Vietnam"</code> + <code>font-weight="800"</code> = real ExtraBold. Verify in the thumbnails — C/D are visibly heavier.</p>
    <p>No new image-generation calls. Approved portrait plates unchanged. Pick a winning treatment (C or D) per concept before expanding to other ratios/animations.</p>
    <div class="callout">Reading order target: <b>Headline → Talent → $10/HR → CTA → Logo</b>. C = maximum direct response (no bullets). D = adds two large benefit blocks.</div>
  </header>
  <main>
    ${rows}
    <section class="row contact">
      <h2>Contact sheet — A / B / C / D × 5 concepts</h2>
      <img src="/exports/wave1-first-launch/contact-sheet-4x5-cd.png" alt="contact sheet"/>
    </section>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-cd-review.html'), html);

async function contactSheet() {
  const tw = 250;
  const th = 313;
  const gap = 14;
  const padX = 20;
  const headH = 42;
  const rowLabelH = 24;
  const cols = 4;
  const cw = padX * 2 + cols * tw + (cols - 1) * gap;
  const ch = headH + ORDER.length * (rowLabelH + th + gap) + padX;
  const labels = [];
  const titles = ['A — BOLD OFFER', 'B — TALENT FIRST', 'C — MAX DR', 'D — DR + BENEFITS'];
  titles.forEach((t, i) => {
    const x = padX + i * (tw + gap) + tw / 2;
    labels.push(`<text x="${x}" y="28" font-family="Segoe UI,sans-serif" font-size="16" font-weight="700" fill="#0D546B" text-anchor="middle">${t}</text>`);
  });
  const comps = [];
  for (let r = 0; r < ORDER.length; r++) {
    const id = ORDER[r];
    const b = boldById[id];
    const c = cdById[id];
    const files = [
      path.join(T_DIR, b.treatments.A.file),
      path.join(T_DIR, b.treatments.B.file),
      path.join(T_DIR, c.treatments.C.file),
      path.join(T_DIR, c.treatments.D.file),
    ];
    const rowTop = headH + r * (rowLabelH + th + gap);
    labels.push(`<text x="${padX}" y="${rowTop + 17}" font-family="Segoe UI,sans-serif" font-size="14" font-weight="700" fill="#077999">${id} — ${c.treatments.C.copy.headline}</text>`);
    const imgTop = rowTop + rowLabelH;
    for (let col = 0; col < 4; col++) {
      const buf = await sharp(fs.readFileSync(files[col])).resize(tw, th, { fit: 'cover' }).png().toBuffer();
      comps.push({ input: buf, top: imgTop, left: padX + col * (tw + gap) });
    }
  }
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" fill="#ffffff"/>${labels.join('')}</svg>`);
  const out = path.join(PUB, 'exports/wave1-first-launch/contact-sheet-4x5-cd.png');
  await sharp(bg).composite(comps).png().toBuffer().then((b) => fs.writeFileSync(out, b));
  console.log('Contact sheet:', rel(out));
}

await contactSheet();
console.log('Review board: public/wave1-cd-review.html');
