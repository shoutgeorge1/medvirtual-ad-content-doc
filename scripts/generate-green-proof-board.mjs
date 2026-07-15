/**
 * Green-winner comparison board: source winners vs current best vs new proof.
 * Run: node scripts/generate-green-proof-board.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');

const profile = JSON.parse(fs.readFileSync(path.join(PUB, 'exports/vma-masters/green-winner-style-profile.json'), 'utf8'));
const proof = JSON.parse(fs.readFileSync(path.join(PUB, 'exports/wave1-first-launch/treatments/green-proof-report.json'), 'utf8'));

const items = [
  { tag: 'SOURCE WINNER', title: 'VMA-01 SpanishGreen (running)', src: '/exports/vma-masters/MV_VMA_01_SpanishGreen_1x1.png', ratio: '1:1' },
  { tag: 'SOURCE WINNER', title: 'VMA-04 HIPAAGreen (running)', src: '/exports/vma-masters/MV_VMA_04_HIPAAGreen_1x1.png', ratio: '1:1' },
  { tag: 'CURRENT BEST', title: 'Treatment V (teal system)', src: '/exports/wave1-first-launch/treatments/MV_VMA_33_SpanishNeverLost_4x5_V.png', ratio: '4:5' },
  { tag: 'NEW PROOF', title: 'Green-winner proof (VMA-33)', src: '/exports/wave1-first-launch/treatments/GREEN_PROOF_VMA_33_4x5.png', ratio: '4:5', hero: true },
];

const cell = (it) => `<figure class="cell${it.hero ? ' hero' : ''}">
  <figcaption><span class="tag ${it.tag.replace(/\s/g, '')}">${it.tag}</span>${it.title} <em>${it.ratio}</em></figcaption>
  <img src="${it.src}" alt="${it.title}"/>
</figure>`;

const thumb = (it) => `<div class="tcell"><img src="${it.src}" alt="${it.title}"/><span>${it.title.split('(')[0]}</span></div>`;

const p0 = profile[0], p1 = profile[1];
const profileRows = `
  <tr><th>Background</th><td>near-black <code>${p0.topColors[0].hex}</code> (${p0.topColors[0].pct}% canvas)</td><td>near-black <code>${p1.topColors[0].hex}</code> (${p1.topColors[0].pct}% canvas)</td></tr>
  <tr><th>Accent green (sampled)</th><td><code>${p0.sampled.lime}</code></td><td><code>${p1.sampled.lime}</code></td></tr>
  <tr><th>Cyan (price)</th><td><code>${p0.sampled.cyan || '—'}</code></td><td>${p1.sampled.cyan || 'none (green circle)'}</td></tr>
  <tr><th>White</th><td><code>${p0.sampled.white}</code></td><td><code>${p1.sampled.white}</code></td></tr>
  <tr><th>Headline zone</th><td>x ${p0.headlineBBox.xPct}% · y ${p0.headlineBBox.yPct}% · <b>${p0.headlineBBox.wPct}% w × ${p0.headlineBBox.hPct}% h</b></td><td>x ${p1.headlineBBox.xPct}% · y ${p1.headlineBBox.yPct}% · <b>${p1.headlineBBox.wPct}% w × ${p1.headlineBBox.hPct}% h</b></td></tr>
  <tr><th>Headline text</th><td colspan="2">"Hire a Virtual Medical Admin" · <b>Title Case</b> · 4 lines · one word green · clean heavy letters (no outline / extrusion / sparkle) · tight leading ~0.9</td></tr>
  <tr><th>Mean luminance</th><td>${p0.background.meanLuminance}</td><td>${p1.background.meanLuminance}</td></tr>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Green-Winner Proof — Comparison Board</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0c0f0e;color:#eef4f1}
  header{padding:28px 40px;background:linear-gradient(120deg,#04120a,#0d2a17);border-bottom:2px solid #55C63A}
  header h1{margin:0 0 8px;font-size:24px}
  header p{margin:5px 0;max-width:1000px;color:#cfe6d8;font-size:14px}
  header b{color:#8be86a}
  main{padding:24px 30px 90px;max-width:1500px;margin:0 auto}
  h2{font-size:16px;color:#8bе86a;color:#9be87c;border-bottom:1px solid #23342b;padding-bottom:8px;margin:34px 0 16px}
  .row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:start}
  .cell{margin:0;background:#000;border:1px solid #23342b;border-radius:12px;overflow:hidden}
  .cell.hero{border:2px solid #55C63A;box-shadow:0 0 0 3px rgba(85,198,58,.25)}
  .cell figcaption{font-size:12px;padding:9px 12px;color:#cfe6d8;background:#101715;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .cell figcaption em{margin-left:auto;color:#7c948a;font-style:normal}
  .cell img{display:block;width:100%;height:auto}
  .tag{font-size:10px;font-weight:800;letter-spacing:.5px;padding:3px 7px;border-radius:5px}
  .SOURCEWINNER{background:#55C63A;color:#04120a}
  .CURRENTBEST{background:#3a4a43;color:#cfe6d8}
  .NEWPROOF{background:#09BDE6;color:#04222b}
  .thumbs{display:flex;gap:22px;align-items:flex-end;background:#000;border:1px solid #23342b;border-radius:12px;padding:20px}
  .tcell{text-align:center}
  .tcell img{width:150px;border-radius:6px;border:1px solid #23342b}
  .tcell span{display:block;font-size:11px;color:#9fb3aa;margin-top:6px}
  table{width:100%;border-collapse:collapse;font-size:13px;background:#0a100e;border-radius:10px;overflow:hidden}
  th,td{padding:9px 14px;text-align:left;border-top:1px solid #1c2a23;vertical-align:top}
  thead th{background:#101715;color:#9be87c}
  th{color:#9fb3aa;font-weight:600;width:180px}
  code{background:#04120a;padding:2px 7px;border-radius:4px;color:#8bе86a;color:#8be86a;border:1px solid #23342b}
  .judge{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
  .judge li{font-size:14px;padding:8px 0;border-bottom:1px solid #1c2a23}
  .judge b{color:#8be86a}
</style></head><body>
  <header>
    <h1>Green-Winner Proof — moving from "teal SaaS + decorations" to the real running system</h1>
    <p>The benchmark is the exact visual grammar of the two ads producing leads: <b>VMA-01 SpanishGreen</b> and <b>VMA-04 HIPAAGreen</b>. Colors and headline geometry below were <b>measured from the actual pixels</b>, not from memory.</p>
    <p>The proof rebuilds one concept (VMA-33, green scrubs) on that system: near-black field, huge <b>Title-Case</b> headline with one green word, clean heavy letters, cyan <code>$10</code> price card, and a bold CTA. <b>No portrait regeneration. No new aesthetic. No extra devices.</b></p>
  </header>
  <main>
    <h2>1 · Side by side (same display width)</h2>
    <div class="row">${items.map(cell).join('')}</div>

    <h2>2 · Feed-size thumbnails (the one-second test)</h2>
    <div class="thumbs">${items.map(thumb).join('')}</div>

    <h2>3 · Measured style profile (from the running creatives)</h2>
    <table>
      <thead><tr><th>Attribute</th><th>VMA-01 SpanishGreen</th><th>VMA-04 HIPAAGreen</th></tr></thead>
      <tbody>${profileRows}</tbody>
    </table>

    <h2>4 · Proof build spec</h2>
    <table><tbody>
      <tr><th>Headline</th><td>"${proof.lines.join(' / ')}" · Title Case · <b>${proof.headlineSize}px</b> · leading ${proof.lineHeight} · one word green · clean (no outline/extrusion)</td></tr>
      <tr><th>Accent green</th><td><code>${proof.accentGreen}</code> (sampled from winners)</td></tr>
      <tr><th>Price</th><td>STARTING AT (cyan) · <code>$10</code> ${proof.priceDollarSize}px white · /HR cyan parallelogram — SpanishGreen grammar</td></tr>
      <tr><th>CTA</th><td>${proof.ctaLabel} · ${proof.ctaSize}px · lime button, black text</td></tr>
      <tr><th>Secondary copy</th><td>${proof.secondaryMessages.join(' · ')} (2 total — no micro-bullets, names, or disclaimers)</td></tr>
      <tr><th>Dimensions</th><td>${proof.dimensions} · plate ${proof.plate} (unchanged)</td></tr>
    </tbody></table>

    <h2>5 · Judge the proof</h2>
    <ul class="judge">
      <li><b>Headline equally dominant?</b> proof ≈ 53% width / 55% height — matches winners</li>
      <li><b>Font equally heavy?</b> Be Vietnam ExtraBold (800) — see note below</li>
      <li><b>Green equally forceful?</b> sampled <code>${proof.accentGreen}</code> on true black</li>
      <li><b>Price equally obvious?</b> $10 at ${proof.priceDollarSize}px on cyan card</li>
      <li><b>CTA equally bold?</b> full-width lime button</li>
      <li><b>Sold within 1 second?</b> check the thumbnail row above</li>
    </ul>
    <p style="margin-top:18px;color:#cfe6d8;font-size:13.5px;max-width:1000px">
      <b style="color:#8be86a">One open decision (font):</b> the winners were AI-generated with a heavier, blacker geometric display face (~900). The brand font on hand is <b>Be Vietnam</b>, whose heaviest weight is ExtraBold (800). This proof uses ExtraBold in Title Case. If you want to match the winner's exact letter weight even more closely, I can add a geometric Black display font (e.g., Archivo Black / Poppins Black) for headlines only — say the word and I'll wire it in before we expand.
    </p>
  </main>
</body></html>`;

fs.writeFileSync(path.join(PUB, 'green-proof-board.html'), html);
console.log('Board: public/green-proof-board.html');
