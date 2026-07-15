/**
 * Talent plate picker — shows all 4:5 candidates.
 * Run: node scripts/generate-wave1-talent-pick.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const PLATE = path.join(PUB, 'exports/wave1-first-launch/plates/4x5');
const sel = JSON.parse(fs.readFileSync(path.join(PLATE, 'selection.json'), 'utf8'));

const LOCKED = new Set(['VMA-33', 'VMA-41']);
const REGEN = new Set(['VMA-34', 'VMA-37', 'VMA-43']);

const rows = ['VMA-33', 'VMA-34', 'VMA-37', 'VMA-41', 'VMA-43'].map((id) => {
  const cards = [1, 2, 3].map((n) => {
    const file = `candidate-${n}.png`;
    const src = `/exports/wave1-first-launch/plates/4x5/${id}/${file}`;
    const picked = sel[id] === file;
    let tag = picked ? 'SELECTED' : 'pick me';
    if (LOCKED.has(id)) tag = picked ? 'APPROVED · LOCKED' : 'reference only';
    if (REGEN.has(id) && !LOCKED.has(id)) tag = picked ? 'SELECTED (old?)' : 'NEW · pick me';
    return `<div class="card${picked ? ' picked' : ''}${REGEN.has(id) ? ' fresh' : ''}${LOCKED.has(id) ? ' locked' : ''}">
      <div class="tag">${tag}</div>
      <img src="${src}" alt="${id} ${file}"/>
      <div class="lab">${file}</div>
    </div>`;
  }).join('');
  const note = LOCKED.has(id)
    ? 'Approved reference — do not regenerate'
    : REGEN.has(id)
      ? 'Fresh batch · camera-facing · diverse casting · pick 1, 2, or 3'
      : '';
  return `<section><h2>${id} ${sel[id] ? `(selection.json: ${sel[id]})` : ''}</h2><p class="note">${note}</p><div class="grid">${cards}</div></section>`;
}).join('');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave 1 · Talent Plate Picker</title>
<style>
  body{margin:0;font-family:system-ui,sans-serif;background:#0d2630;color:#fff;padding:24px}
  h1{font-size:22px;margin:0 0 8px}
  p{opacity:.85;max-width:820px;font-size:14px;line-height:1.5}
  section{margin:28px 0}
  h2{font-size:16px;color:#5cd4f2;margin:0 0 4px}
  .note{font-size:13px;color:#9fd8e8;margin:0 0 12px;opacity:1}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1100px}
  .card{background:#123;border-radius:12px;overflow:hidden;border:2px solid #234}
  .card.fresh{border-color:#3a8}
  .card.picked{border-color:#00B2E2;box-shadow:0 0 0 3px rgba(0,178,226,.25)}
  .card.locked{opacity:.85}
  .tag{font-size:11px;font-weight:700;padding:6px 10px;background:#234}
  .card.fresh .tag{background:#0a5a6a;color:#bff}
  .card.picked .tag{background:#00B2E2;color:#06333f}
  .card.locked .tag{background:#234;color:#9ab}
  img{display:block;width:100%;height:auto}
  .lab{font-size:12px;padding:8px 10px;opacity:.7}
</style></head><body>
<h1>Wave 1 · Talent Plate Picker (4:5)</h1>
<p><b>VMA-33 &amp; VMA-41</b> stay locked. <b>VMA-34, VMA-37, VMA-43</b> just regenerated — 3 new camera-facing candidates each. Reply with your pick per concept (e.g. "34-1, 37-2, 43-3") and we'll update selection + re-composite Treatment V.</p>
${rows}
</body></html>`;

fs.writeFileSync(path.join(PUB, 'wave1-talent-pick.html'), html);
console.log('Talent picker: public/wave1-talent-pick.html');
