/**
 * Comparison board: Treatment F/V vs component proof vs source winner.
 * Run: node scripts/generate-component-proof-board.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { renderProof } from './composite-component-proof.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const PROOF = path.join(PUB, 'exports/component-proof');
const TREAT = path.join(PUB, 'exports/wave1-first-launch/treatments');

const report = await renderProof();

const items = [
  { tag: 'SOURCE', title: 'VMA-01 SpanishGreen (running winner)', src: '/exports/vma-masters/MV_VMA_01_SpanishGreen_1x1.png', ratio: '1:1' },
  { tag: 'CURRENT', title: 'Treatment F (scroll-stopper)', src: '/exports/wave1-first-launch/treatments/MV_VMA_41_FrontDeskCapacity_4x5_F.png', ratio: '4:5' },
  { tag: 'NEW', title: 'Component-based green proof', src: '/exports/component-proof/COMPONENT_PROOF_VMA41_4x5.png', ratio: '4:5', hero: true },
];

const cell = (it) => `<figure class="cell${it.hero ? ' hero' : ''}">
  <figcaption><span class="tag ${it.tag}">${it.tag}</span>${it.title} <em>${it.ratio}</em></figcaption>
  <img src="${it.src}" alt="${it.title}"/>
</figure>`;

const thumb = (it) => `<div class="t"><img src="${it.src}" alt=""/><span>${it.title.split('(')[0].trim()}</span></div>`;

const h = report.headline;
const spec = `
  <tr><th>Headline size</th><td>Base <b>${h.baseSize}px</b> · focal <b>${h.focalSize}px</b> (VIRTUAL +18%)</td></tr>
  <tr><th>Headline canvas occupancy</th><td>~${h.canvasOccupancy.widthPct}% width × ~${h.canvasOccupancy.heightPct}% height</td></tr>
  <tr><th>Price</th><td>$10 <b>${report.price.dollarSize}px</b> · /HR ${report.price.hrSize}px · STARTING AT ${report.price.capSize}px</td></tr>
  <tr><th>CTA</th><td><b>${report.cta.fontSize}px</b> · button ${report.cta.height}px tall · full width minus margins</td></tr>
  <tr><th>Font weight</th><td>Be Vietnam ExtraBold (800) headlines/CTA · Bold (700) STARTING AT</td></tr>
  <tr><th>Stroke widths</th><td>Forest outer ${h.strokeOuter}px · yellow-green ${h.strokeYgreen}px</td></tr>
  <tr><th>Extrusion</th><td>${h.extrusionSteps} steps · offset ${h.extrusionStep[0]}× / ${h.extrusionStep[1]}× cap size</td></tr>
  <tr><th>Colors</th><td>Cream ${h.colors.cream} · Yellow ${h.colors.yellow} · Deep ${h.colors.deep} · Forest ${h.colors.forest2}</td></tr>
  <tr><th>Plate</th><td>${report.plate} (unchanged)</td></tr>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Component Proof — Comparison Board</title>
<style>
  :root{--g:#073F2A;--y:#F2D72E}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,sans-serif;background:#0e1412;color:#e8f2ec}
  header{padding:28px 36px;background:linear-gradient(120deg,#041a12,#0d3d28);border-bottom:3px solid var(--y)}
  header h1{margin:0 0 8px;font-size:24px}
  header p{margin:4px 0;font-size:14px;opacity:.92;max-width:960px}
  main{padding:24px 30px 80px;max-width:1400px;margin:0 auto}
  .row{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .cell{background:#000;border:1px solid #2a4036;border-radius:12px;overflow:hidden}
  .cell.hero{border:2px solid var(--y);box-shadow:0 0 0 3px rgba(242,215,46,.2)}
  .cell img{display:block;width:100%;height:auto}
  figcaption{padding:10px 12px;font-size:13px;background:#0a1510}
  .tag{font-size:10px;font-weight:800;padding:3px 7px;border-radius:4px;margin-right:8px}
  .SOURCE{background:var(--y);color:#041a12}
  .CURRENT{background:#3a4a43;color:#e8f2ec}
  .NEW{background:#0B8F4D;color:#fff}
  figcaption em{float:right;font-style:normal;opacity:.7}
  h2{font-size:16px;color:var(--y);margin:32px 0 12px}
  .thumbs{display:flex;gap:28px;background:#0a1510;border:1px solid #2a4036;border-radius:12px;padding:20px}
  .thumbs img{width:140px;border-radius:6px;border:1px solid #2a4036}
  .thumbs span{display:block;font-size:11px;margin-top:6px;color:#9fb3aa}
  table{width:100%;border-collapse:collapse;font-size:13px;background:#0a1510;border-radius:10px;overflow:hidden}
  th,td{padding:9px 14px;border-top:1px solid #1c2a23;text-align:left}
  th{color:#9fb3aa;width:200px;font-weight:600}
</style></head><body>
<header>
  <h1>Component Assembly Proof — one 4:5 test</h1>
  <p>Assembled from approved Prompts 1–6 only (lettering · green burst bg · focal slab · $10 badge · yellow CTA · call icon · 2 benefit blocks). Portrait: VMA-41 unchanged. Pain headline: TOO MANY CALLS. / NOT ENOUGH STAFF.</p>
</header>
<main>
  <h2>Side by side</h2>
  <div class="row">${items.map(cell).join('')}</div>
  <h2>Feed thumbnails (one-second test)</h2>
  <div class="thumbs">${items.map(thumb).join('')}</div>
  <h2>Proof build spec</h2>
  <table><tbody>${spec}</tbody></table>
</main></body></html>`;

fs.writeFileSync(path.join(PUB, 'component-proof-board.html'), html);
console.log('Board: public/component-proof-board.html');
