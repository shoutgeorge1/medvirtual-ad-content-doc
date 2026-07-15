/**
 * PROMPT 1 — Headline lettering style study (no ad, no portraits).
 *
 * Six isolated treatments of the sample headline, rendered as heavy retail/direct-response
 * display lettering built from real Be Vietnam ExtraBold (font-weight 800) transformed via
 * horizontal compression, layered hard strokes, hard offset duplicates, skew/rotation, and
 * underline shapes. NO blur, glow, chrome, metallic, or gradient-per-letter.
 *
 * Deliverables:
 *   public/exports/lettering-study/headline-lettering-reference.png  (6-up sheet)
 *   public/exports/lettering-study/headline-lettering-selected.svg   (editable, real text)
 *   public/exports/lettering-study/headline-lettering-spec.md        (style spec)
 *
 * Run: node scripts/headline-lettering-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, esc } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/lettering-study');
fs.mkdirSync(OUT, { recursive: true });

const LINES = ['HIRE A', 'VIRTUAL', 'MEDICAL ASSISTANT'];

const COL = {
  bg: '#D9D9D9',
  face: '#FAF1D2',       // warm cream face
  focal: '#FFD400',      // bright yellow focal word
  forest: '#14532D',     // deep forest-green outer stroke
  extrude: '#0A3A1E',    // dark green extrusion
  ygreen: '#9DCB3B',     // yellow-green secondary outline
  highlight: '#FFF7CE',  // pale-yellow highlight edge
  slab: '#0F4023',       // tilted dark-green slab
  ink: '#20302a',
};

// ---- real text width measurement (trim-based) ----
const ratioCache = new Map();
function textPng(text, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="9000" height="${Math.ceil(size * 1.8)}"><text x="0" y="${Math.round(size * 1.3)}" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="#000">${esc(text)}</text></svg>`;
  return new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}
async function emRatio(text) {
  if (ratioCache.has(text)) return ratioCache.get(text);
  let r;
  try { const info = await sharp(textPng(text, 200)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true }); r = info.info.width / 200; }
  catch { r = text.length * 0.55; }
  ratioCache.set(text, r); return r;
}

// ---- one layered display line (real Be Vietnam text, no raster) ----
function textEl(text, size, fill, opts = '') {
  return `<text x="0" y="0" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" ${opts}>${esc(text)}</text>`.replace('>', ` fill="${fill}">`);
}
function layeredLine(text, cx, baseline, size, cfg, widthLocal) {
  const { scaleX = 0.82, skew = 0, rot = 0, focal = false, To = 7, Ts = 3, extrudeDepth = 8, shadow = null, rough = false, highlight = true, underline = false } = cfg;
  const face = focal ? COL.focal : COL.face;
  const ux = size * 0.011, uy = size * 0.013;
  let inner = '';
  // hard offset shadow (single, hard-edged)
  if (shadow) inner += `<text x="0" y="0" transform="translate(${shadow[0]} ${shadow[1]})" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${COL.extrude}">${esc(text)}</text>`;
  // block extrusion (stacked hard copies)
  for (let i = extrudeDepth; i >= 1; i--) {
    inner += `<text x="0" y="0" transform="translate(${(ux * i).toFixed(1)} ${(uy * i).toFixed(1)})" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${COL.extrude}">${esc(text)}</text>`;
  }
  // secondary yellow-green outline (outermost)
  if (Ts > 0) inner += `<text x="0" y="0" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="none" stroke="${COL.ygreen}" stroke-width="${2 * (To + Ts)}" stroke-linejoin="round">${esc(text)}</text>`;
  // rough hand-painted edge: a couple of tiny jittered forest strokes
  if (rough) {
    for (const [jx, jy] of [[-1.5, 1], [1.5, -1], [1, 1.5]]) inner += `<text x="0" y="0" transform="translate(${jx} ${jy})" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="none" stroke="${COL.forest}" stroke-width="${2 * To}" stroke-linejoin="round">${esc(text)}</text>`;
  }
  // forest outer stroke
  inner += `<text x="0" y="0" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="none" stroke="${COL.forest}" stroke-width="${2 * To}" stroke-linejoin="round">${esc(text)}</text>`;
  // pale highlight sliver (upper-left)
  if (highlight) inner += `<text x="0" y="0" transform="translate(-3 -3)" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${COL.highlight}">${esc(text)}</text>`;
  // face
  inner += `<text x="0" y="0" text-anchor="middle" font-family="${BE}" font-weight="800" font-size="${size}" letter-spacing="-0.5" fill="${face}">${esc(text)}</text>`;
  // underline swash beneath the word
  if (underline) inner += `<rect x="${(-widthLocal / 2).toFixed(1)}" y="${(size * 0.16).toFixed(1)}" width="${widthLocal.toFixed(1)}" height="${(size * 0.11).toFixed(1)}" rx="${(size * 0.05).toFixed(1)}" fill="${COL.focal}"/>`;
  return `<g transform="translate(${cx} ${baseline}) rotate(${rot}) skewX(${skew}) scale(${scaleX} 1)">${inner}</g>`;
}

const TREATMENTS = [
  { title: '1 · Cream + forest outline + hard shadow', scaleX: 0.86, To: 9, Ts: 0, extrudeDepth: 0, shadow: [14, 14], highlight: true },
  { title: '2 · Forward-slant + yellow focal word', scaleX: 0.84, skew: -9, To: 7, Ts: 3, extrudeDepth: 6, focalLine: 2, highlight: true },
  { title: '3 · Extra-condensed + deep block extrusion', scaleX: 0.64, To: 6, Ts: 3, extrudeDepth: 18, highlight: false },
  { title: '4 · Rough hand-painted edge, clean interior', scaleX: 0.84, To: 8, Ts: 0, extrudeDepth: 4, rough: true, highlight: false },
  { title: '5 · Cream over tilted dark-green slab', scaleX: 0.82, To: 6, Ts: 2, extrudeDepth: 5, slab: true, highlight: true },
  { title: '6 · Yellow focal +18% + underline swash', scaleX: 0.78, To: 7, Ts: 4, extrudeDepth: 12, focalLine: 2, focalScale: 1.18, underlineLine: 2, highlight: true },
];

async function renderCell(t, cellX, cellY, cellW, cellH) {
  const pad = 34;
  const ratios = await Promise.all(LINES.map((l) => emRatio(l)));
  const wide = Math.max(...ratios);
  // size by width (widest line, compressed) and by height (3 lines, tight leading)
  const lh = 0.90;
  const sizeW = (cellW - pad * 2) / (wide * t.scaleX);
  const sizeH = (cellH - pad * 2 - 46) / (1 + 2 * lh + 0.25);
  let size = Math.floor(Math.min(sizeW, sizeH));
  const focalScale = t.focalScale || 1;
  // vertical centering
  const totalH = size * (1 + 2 * lh) + (t.focalLine ? size * (focalScale - 1) * (t.focalLine <= 2 ? 1 : 0) : 0);
  const cx = cellX + cellW / 2;
  const blockTop = cellY + 46 + (cellH - 46 - totalH) / 2;
  let baseline = blockTop + size * 0.80;

  let slab = '';
  if (t.slab) {
    const sx = cellX + pad * 0.5, sy = cellY + 52, sw = cellW - pad, sh = cellH - 70;
    slab = `<g transform="rotate(-3 ${cellX + cellW / 2} ${cellY + cellH / 2})"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="18" fill="${COL.slab}"/></g>`;
  }

  let body = '';
  for (let i = 0; i < LINES.length; i++) {
    const isFocal = t.focalLine === i + 1;
    const s = Math.round(size * (isFocal ? focalScale : 1));
    const widthLocal = ratios[i] * s;
    const cfg = { ...t, focal: isFocal, underline: t.underlineLine === i + 1 };
    body += layeredLine(LINES[i], cx, baseline, s, cfg, widthLocal);
    baseline += (i === 0 ? size : size) * lh + (isFocal ? s - size : 0);
  }

  return `<g>
    <rect x="${cellX}" y="${cellY}" width="${cellW}" height="${cellH}" rx="16" fill="${COL.bg}"/>
    <text x="${cellX + 20}" y="${cellY + 30}" font-family="${BE}" font-weight="800" font-size="20" fill="${COL.ink}">${esc(t.title)}</text>
    ${slab}
    ${body}
  </g>`;
}

async function main() {
  const cols = 2, rows = 3, pad = 40, gap = 28;
  const cellW = 900, cellH = 600, headH = 96;
  const sheetW = pad * 2 + cols * cellW + (cols - 1) * gap;
  const sheetH = headH + pad + rows * cellH + (rows - 1) * gap + pad;

  let cells = '';
  for (let i = 0; i < TREATMENTS.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const cx = pad + c * (cellW + gap), cy = headH + r * (cellH + gap);
    cells += await renderCell(TREATMENTS[i], cx, cy, cellW, cellH);
  }
  const sheet = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}" viewBox="0 0 ${sheetW} ${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="52" font-family="${BE}" font-weight="800" font-size="34" fill="#16241d">MedVirtual — Headline Lettering Study</text>
  <text x="${pad}" y="80" font-family="${BE}" font-weight="500" font-size="18" fill="#4a5a52">Be Vietnam ExtraBold transformed into heavy retail / direct-response display lettering · sample: HIRE A / VIRTUAL / MEDICAL ASSISTANT</text>
  ${cells}
</svg>`;
  const png = new Resvg(sheet, { fitTo: { mode: 'width', value: sheetW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
  fs.writeFileSync(path.join(OUT, 'headline-lettering-reference.png'), png);
  console.log(`Reference sheet -> headline-lettering-reference.png (${sheetW}x${sheetH})`);

  // ---- selected treatment (6) as standalone editable SVG, real text ----
  const sel = TREATMENTS[5];
  const cw = 1200, cht = 1000;
  const selBody = await renderCell({ ...sel, title: '' }, 40, 40, cw - 80, cht - 80);
  const selSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual headline lettering — SELECTED treatment 6 (yellow focal +18% + underline).
     Editable: real Be Vietnam ExtraBold text, layered strokes + hard extrusion. No raster. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${cht}" viewBox="0 0 ${cw} ${cht}">
  <rect width="${cw}" height="${cht}" fill="${COL.bg}"/>
  ${selBody}
</svg>`;
  fs.writeFileSync(path.join(OUT, 'headline-lettering-selected.svg'), selSvg);
  console.log('Selected editable SVG -> headline-lettering-selected.svg (treatment 6)');

  // ---- style spec ----
  const spec = `# MedVirtual Headline Lettering — Style Specification

Sample headline: **HIRE A / VIRTUAL / MEDICAL ASSISTANT**
Base font: **Be Vietnam ExtraBold** (\`font-family="Be Vietnam"\`, \`font-weight="800"\`) — no outside font.

## Selected treatment: #6 — Yellow focal (+18%) + underline swash

| Property | Value |
|---|---|
| Font weight | 800 (ExtraBold) |
| Horizontal compression | \`scale(0.78, 1)\` → ~22% condensed |
| Letter spacing | -0.5px (tight) |
| Line height | 0.90 × cap size (tight) |
| Lines | 3 |
| Case | UPPERCASE |
| Face color | Cream \`${COL.face}\` |
| Focal word ("VIRTUAL") | Bright yellow \`${COL.focal}\`, ~118% size |
| Outer stroke | Deep forest green \`${COL.forest}\`, ~7px (rendered stroke-width 14, paint-order behind fill) |
| Secondary outline | Yellow-green \`${COL.ygreen}\`, ~4px beyond the forest stroke |
| Extrusion | Dark green \`${COL.extrude}\`, 12 stacked hard copies at ~(0.011, 0.013)×size per step |
| Highlight edge | Pale yellow \`${COL.highlight}\`, hard sliver offset (-3, -3) |
| Underline swash | Yellow \`${COL.focal}\` rounded bar beneath VIRTUAL |
| Shadow style | Hard-edged only — NO blur/glow/chrome/metallic/gradient |

## All six treatments on the reference sheet
${TREATMENTS.map((t) => `- ${t.title}`).join('\n')}

## Layer order (back → front)
1. Hard offset shadow (treatments that use one)
2. Dark-green block extrusion (stacked hard copies)
3. Yellow-green secondary outline (widest stroke)
4. Forest-green outer stroke
5. Pale-yellow highlight sliver (offset up-left)
6. Cream / yellow face
7. Underline swash

## Files
- \`headline-lettering-reference.png\` — six-option sheet
- \`headline-lettering-selected.svg\` — editable layered SVG (real text)
- \`headline-lettering-spec.md\` — this file
`;
  fs.writeFileSync(path.join(OUT, 'headline-lettering-spec.md'), spec);
  console.log('Spec -> headline-lettering-spec.md');
}
main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
