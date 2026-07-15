/**
 * Build the Wave 1 BOLD review board (current vs Treatment A vs Treatment B)
 * plus a labeled contact sheet. Reads treatments/wave1-bold-report.json.
 *
 * Run: node scripts/generate-wave1-bold-review.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const T_DIR = path.join(PUB, 'exports/wave1-first-launch/treatments');
const CREATIVES = path.join(PUB, 'exports/wave1-first-launch/creatives');
const report = JSON.parse(fs.readFileSync(path.join(T_DIR, 'wave1-bold-report.json'), 'utf8'));

const rel = (abs) => path.relative(PUB, abs).replace(/\\/g, '/');

function currentFor(id) {
  const stem = { 'VMA-33': 'MV_VMA_33_SpanishNeverLost', 'VMA-34': 'MV_VMA_34_BilingualFrontDesk', 'VMA-37': 'MV_VMA_37_TrainedWorkflow', 'VMA-41': 'MV_VMA_41_FrontDeskCapacity', 'VMA-43': 'MV_VMA_43_ScheduleMoving' }[id];
  const p = path.join(CREATIVES, `${stem}_4x5.png`);
  return fs.existsSync(p) ? p : null;
}

function card(src, label) {
  if (!src) return `<div class="cell empty"><div class="lab">${label}</div><div class="ph">not found</div></div>`;
  return `<div class="cell"><div class="lab">${label}</div><img src="/${rel(src)}" alt="${label}"/></div>`;
}

const rows = report.concepts.map((c) => {
  const cur = currentFor(c.id);
  const a = path.join(T_DIR, c.treatments.A.file);
  const b = path.join(T_DIR, c.treatments.B.file);
  const meta = `head ${c.treatments.A.headSize}px · offer ${c.treatments.A.offer} · CTA-A ${c.treatments.A.cta} · CTA-B ${c.treatments.B.cta} · ${c.treatments.A.dimensions} · pink A/B ${c.treatments.A.pinkPixels}/${c.treatments.B.pinkPixels}`;
  return `
    <section class="row">
      <h2>${c.id} <span>${c.fullHeadline}</span></h2>
      <div class="grid">
        ${card(cur, 'Current (v1)')}
        ${card(a, 'Treatment A — Bold Offer')}
        ${card(b, 'Treatment B — Talent First')}
      </div>
      <p class="meta">${meta}</p>
    </section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · Bold Treatment Review (4:5)</title>
<style>
  :root{--teal:#077999;--cyan:#00B2E2;--deep:#0D546B;--ink:#0b1f27}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#eef4f6;color:var(--ink)}
  header{background:linear-gradient(120deg,var(--deep),var(--teal));color:#fff;padding:28px 40px}
  header h1{margin:0 0 6px;font-size:26px}
  header p{margin:0;opacity:.9;max-width:820px}
  main{padding:24px 40px 80px}
  .row{background:#fff;border-radius:16px;padding:22px 24px;margin:0 0 28px;box-shadow:0 6px 22px rgba(13,84,107,.10)}
  .row h2{margin:0 0 14px;font-size:19px;color:var(--deep)}
  .row h2 span{font-weight:400;color:#5a6b72;font-size:15px;margin-left:8px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .cell{border:1px solid #dce6e9;border-radius:12px;overflow:hidden;background:#f7fafb}
  .cell .lab{font-size:13px;font-weight:700;padding:8px 12px;background:#eaf5f9;color:var(--deep);border-bottom:1px solid #dce6e9}
  .cell img{display:block;width:100%;height:auto}
  .cell.empty .ph{padding:60px 12px;text-align:center;color:#9aa;font-size:13px}
  .meta{margin:14px 0 0;font-size:12px;color:#5a6b72;font-family:ui-monospace,Menlo,Consolas,monospace}
  .contact{margin-top:8px}
  .contact img{width:100%;border-radius:12px;border:1px solid #dce6e9}
</style></head>
<body>
  <header>
    <h1>Wave 1 · Bold Treatment Review — 4:5 (1080×1350)</h1>
    <p>Approved talent plates, revised coded composites. Two treatments per concept: <b>A — Bold Offer</b> (max headline + dominant $10/HR badge) and <b>B — Talent First</b> (portrait-forward, still bold $10/HR). No new image-generation calls; portraits unchanged. Approve a direction per concept before expanding to other ratios/animations.</p>
  </header>
  <main>
    ${rows}
    <section class="row contact">
      <h2>Contact sheet — all 10 treatments</h2>
      <img src="/exports/wave1-first-launch/contact-sheet-4x5-treatments.png" alt="contact sheet"/>
    </section>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-bold-review.html'), html);

// ---- contact sheet: 3 cols (current, A, B) x 5 rows, with header labels ----
async function buildContactSheet() {
  const tw = 300;
  const th = 375;
  const gap = 16;
  const padX = 20;
  const headH = 46;
  const rowLabelH = 26;
  const cols = 3;
  const rowsN = report.concepts.length;
  const cw = padX * 2 + cols * tw + (cols - 1) * gap;
  const ch = headH + rowsN * (rowLabelH + th + gap) + padX;

  const composites = [];
  const svgLabels = [];
  const colTitles = ['CURRENT (v1)', 'A — BOLD OFFER', 'B — TALENT FIRST'];
  colTitles.forEach((t, i) => {
    const x = padX + i * (tw + gap) + tw / 2;
    svgLabels.push(`<text x="${x}" y="30" font-family="Segoe UI,sans-serif" font-size="18" font-weight="700" fill="#0D546B" text-anchor="middle">${t}</text>`);
  });

  for (let r = 0; r < rowsN; r++) {
    const c = report.concepts[r];
    const rowTop = headH + r * (rowLabelH + th + gap);
    svgLabels.push(`<text x="${padX}" y="${rowTop + 18}" font-family="Segoe UI,sans-serif" font-size="15" font-weight="700" fill="#077999">${c.id} — ${c.fullHeadline}</text>`);
    const imgTop = rowTop + rowLabelH;
    const cur = currentFor(c.id);
    const srcs = [cur, path.join(T_DIR, c.treatments.A.file), path.join(T_DIR, c.treatments.B.file)];
    for (let col = 0; col < 3; col++) {
      if (!srcs[col]) continue;
      const buf = await sharp(fs.readFileSync(srcs[col])).resize(tw, th, { fit: 'cover' }).png().toBuffer();
      composites.push({ input: buf, top: imgTop, left: padX + col * (tw + gap) });
    }
  }

  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><rect width="${cw}" height="${ch}" fill="#ffffff"/>${svgLabels.join('')}</svg>`
  );
  const out = path.join(PUB, 'exports/wave1-first-launch/contact-sheet-4x5-treatments.png');
  await sharp(bg).composite(composites).png().toBuffer().then((b) => fs.writeFileSync(out, b));
  console.log('Contact sheet:', rel(out));
}

await buildContactSheet();
console.log('Review board: public/wave1-bold-review.html');
