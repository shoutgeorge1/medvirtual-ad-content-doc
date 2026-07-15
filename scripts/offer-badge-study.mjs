/**
 * PROMPT 3 — STARTING AT $10/HR offer-badge system (standalone, no ad).
 *
 * Run: node scripts/offer-badge-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, esc } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/offer-badge-study');
fs.mkdirSync(OUT, { recursive: true });

const BG = '#D9D9D9';
const C = {
  deep: '#073F2A', forest: '#075C37', ink: '#052818',
  ygreen: '#B8D833', yellow: '#F2D72E', cream: '#FFF4D6',
};

const CAP = 'STARTING AT';
const DOLLAR = '$10';
const HR = '/HR';
const W800 = '800', W700 = '700';

function T(x, y, text, weight, size, fill, anchor = 'start', extra = '') {
  const ax = anchor === 'middle' ? ' text-anchor="middle"' : anchor === 'end' ? ' text-anchor="end"' : '';
  return `<text x="${x}" y="${y}" font-family="${BE}" font-weight="${weight}" font-size="${size}" fill="${fill}"${ax}${extra}>${esc(text)}</text>`;
}

// ---- six badge builders (return inner SVG + metadata) ----
const BADGES = [
  {
    id: 'badge-01-double-border',
    title: '1 · Double-border offer box',
    build() {
      const rot = -3, pad = 36, cap = 34, dollar = 118, hr = 48;
      const w = 420, h = 200, rx = 22;
      const cx = w / 2, capY = 58, priceY = 158;
      const inner = `
        <g transform="rotate(${rot} ${cx} ${h / 2})">
          <rect x="18" y="18" width="${w}" height="${h}" rx="${rx}" fill="${C.ink}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="${C.yellow}" stroke="${C.yellow}" stroke-width="14"/>
          <rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="${rx - 6}" fill="${C.deep}" stroke="${C.cream}" stroke-width="8"/>
          ${T(cx, capY, CAP, W700, cap, C.yellow, 'middle', ' letter-spacing="3"')}
          ${T(cx - 52, priceY, DOLLAR, W800, dollar, C.cream, 'middle')}
          ${T(cx + 88, priceY - 8, HR, W800, hr, C.yellow, 'middle')}
        </g>`;
      return { inner, w: w + 40, h: h + 40, rot, cap, dollar, hr, pad, borders: { outer: 14, inner: 8 }, shadow: [18, 18] };
    },
  },
  {
    id: 'badge-02-yellow-block',
    title: '2 · Yellow promotional block',
    build() {
      const cap = 30, dollar = 112, hr = 46;
      const w = 400, h = 210, rx = 16;
      let ext = '';
      for (let i = 12; i >= 1; i--) ext += `<rect x="${i * 1.2}" y="${i * 1.4 + 28}" width="${w}" height="${h - 28}" rx="${rx}" fill="${C.forest}"/>`;
      const inner = `${ext}
        <rect x="0" y="28" width="${w}" height="${h - 28}" rx="${rx}" fill="${C.yellow}" stroke="${C.deep}" stroke-width="10"/>
        <rect x="0" y="0" width="${w}" height="52" rx="12" fill="${C.deep}"/>
        ${T(w / 2, 36, CAP, W700, cap, C.cream, 'middle', ' letter-spacing="2"')}
        ${T(w / 2 - 48, 168, DOLLAR, W800, dollar, C.deep, 'middle')}
        ${T(w / 2 + 82, 158, HR, W800, hr, C.forest, 'middle')}`;
      return { inner, w: w + 20, h: h + 24, cap, dollar, hr, extrusion: 12, outline: 10 };
    },
  },
  {
    id: 'badge-03-painted-placard',
    title: '3 · Painted green price placard',
    build() {
      const cap = 32, dollar = 108, hr = 44;
      const path = 'M14 18 h372 l-10 164 h-352 l-10-164z';
      const shadow = 'M30 34 h372 l-10 164 h-352 l-10-164z';
      const inner = `
        <path d="${shadow}" fill="${C.ink}"/>
        <path d="${path}" fill="${C.forest}" stroke="${C.ink}" stroke-width="12" stroke-linejoin="round"/>
        ${T(200, 62, CAP, W700, cap, C.yellow, 'middle', ' letter-spacing="2"')}
        ${T(148, 158, DOLLAR, W800, dollar, C.cream, 'middle')}
        ${T(268, 150, HR, W800, hr, C.cream, 'middle')}`;
      return { inner, w: 420, h: 220, cap, dollar, hr, outline: 12 };
    },
  },
  {
    id: 'badge-04-stacked-dimensional',
    title: '4 · Stacked dimensional badge',
    build() {
      const cap = 32, dollar = 124, hr = 50;
      const topW = 360, topH = 56, botW = 400, botH = 130;
      const offX = 12, offY = 10, tilt = -2;
      const totalW = botW + offX + 24, totalH = topH + botH + offY + 20;
      const inner = `<g transform="rotate(${tilt} ${totalW / 2} ${totalH / 2})">
        <rect x="${offX}" y="${topH + offY}" width="${botW}" height="${botH}" rx="16" fill="${C.yellow}"/>
        <rect x="0" y="${topH}" width="${botW}" height="${botH}" rx="16" fill="${C.deep}" stroke="${C.cream}" stroke-width="10"/>
        <rect x="20" y="0" width="${topW}" height="${topH}" rx="10" fill="${C.forest}" stroke="${C.cream}" stroke-width="6"/>
        ${T(topW / 2 + 20, topH * 0.68, CAP, W700, cap, C.cream, 'middle', ' letter-spacing="3"')}
        ${T(botW / 2 - 54, topH + botH * 0.72, DOLLAR, W800, dollar, C.cream, 'middle')}
        ${T(botW / 2 + 92, topH + botH * 0.66, HR, W800, hr, C.yellow, 'middle')}
      </g>`;
      return { inner, w: totalW, h: totalH, cap, dollar, hr, rot: tilt, yellowOffset: [offX, offY], creamBorder: 10 };
    },
  },
  {
    id: 'badge-05-angled-sale-tag',
    title: '5 · Angled sale-tag badge',
    build() {
      const rot = -6, cap = 30, dollar = 110, hr = 46;
      const w = 380, h = 190, rx = 14;
      const marks = `<g stroke="${C.yellow}" stroke-width="5" stroke-linecap="round" opacity="0.9">
        <line x1="-24" y1="40" x2="-8" y2="40"/><line x1="-20" y1="28" x2="-12" y2="48"/>
        <line x1="${w + 16}" y1="${h - 30}" x2="${w + 32}" y2="${h - 30}"/>
        <line x1="${w + 20}" y1="${h - 42}" x2="${w + 28}" y2="${h - 18}"/>
      </g>`;
      const inner = `<g transform="rotate(${rot} ${w / 2} ${h / 2})">
        <rect x="16" y="16" width="${w}" height="${h}" rx="${rx}" fill="${C.ink}"/>
        ${marks}
        <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="${C.deep}" stroke="${C.ygreen}" stroke-width="12"/>
        ${T(w / 2, 52, CAP, W700, cap, C.yellow, 'middle', ' letter-spacing="2"')}
        ${T(w / 2 - 50, 148, DOLLAR, W800, dollar, C.cream, 'middle')}
        ${T(w / 2 + 84, 140, HR, W800, hr, C.yellow, 'middle')}
      </g>`;
      return { inner, w: w + 48, h: h + 48, cap, dollar, hr, rot, shadow: [16, 16], border: 12 };
    },
  },
  {
    id: 'badge-06-framed-stamp',
    title: '6 · Framed price stamp',
    build() {
      const cap = 28, dollar = 116, hr = 48;
      const fw = 400, fh = 200, frame = 16;
      let depth = '';
      for (let i = 14; i >= 1; i--) depth += `<rect x="${i}" y="${i + 22}" width="${fw}" height="${fh}" fill="${C.ink}"/>`;
      const inner = `${depth}
        <rect x="0" y="22" width="${fw}" height="${fh}" fill="${C.cream}" stroke="${C.deep}" stroke-width="${frame}"/>
        <rect x="-8" y="0" width="${fw * 0.62}" height="44" rx="6" fill="${C.yellow}" stroke="${C.deep}" stroke-width="6"/>
        ${T(fw * 0.23, 30, CAP, W700, cap, C.deep, 'middle', ' letter-spacing="2"')}
        ${T(fw / 2 - 52, 158, DOLLAR, W800, dollar, C.deep, 'middle')}
        ${T(fw / 2 + 88, 150, HR, W800, hr, C.forest, 'middle')}`;
      return { inner, w: fw + 20, h: fh + 44, cap, dollar, hr, frame, depthSteps: 14 };
    },
  },
];

function badgeSvg(badge, sw, sh) {
  const { inner, w, h } = badge.build();
  const ox = (sw - w) / 2, oy = (sh - h) / 2;
  return { svg: `<g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">${inner}</g>`, meta: badge.build() };
}

async function renderPng(svg, outW) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: outW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}

async function main() {
  const cellW = 520, cellH = 320, pad = 36, gap = 24, cols = 2;
  const rows = 3;
  const sheetW = pad * 2 + cols * cellW + gap;
  const sheetH = 96 + pad + rows * cellH + (rows - 1) * gap + pad;

  const cells = [];
  const built = [];
  for (const b of BADGES) {
    const builtBadge = b.build();
    const sw = cellW - 40, sh = cellH - 50;
    const ox = (sw - builtBadge.w) / 2, oy = (sh - builtBadge.h) / 2;
    const single = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">
  <rect width="${sw}" height="${sh}" fill="${BG}"/>
  <g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">${builtBadge.inner}</g>
</svg>`;
    fs.writeFileSync(path.join(OUT, `${b.id}.svg`), single);
    const png = await renderPng(single, cellW);
    cells.push({ label: b.title, b64: png.toString('base64') });
    built.push({ ...b, built: builtBadge });
  }

  let imgs = '';
  for (let i = 0; i < cells.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = pad + c * (cellW + gap), y = 96 + r * (cellH + gap);
    imgs += `<image href="data:image/png;base64,${cells[i].b64}" x="${x}" y="${y}" width="${cellW}" height="${cellH}"/>`;
    imgs += `<text x="${x + 14}" y="${y + 26}" font-family="${BE}" font-weight="800" font-size="17" fill="#16241d">${cells[i].label}</text>`;
  }
  const sheetSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="44" font-family="${BE}" font-weight="800" font-size="30" fill="#16241d">MedVirtual — STARTING AT $10/HR Badge Study</text>
  <text x="${pad}" y="72" font-family="${BE}" font-weight="500" font-size="16" fill="#4a5a52">Six promotional offer devices · exact wording only · no cyan/blue · hard-edged retail depth</text>
  ${imgs}
</svg>`;
  fs.writeFileSync(path.join(OUT, 'offer-badge-reference.png'), await renderPng(sheetSvg, sheetW));

  // ---- SELECTED: badge-04 stacked dimensional ----
  const sel = BADGES[3];
  const selBuilt = sel.build();
  const selW = 480, selH = 260;
  const sox = (selW - selBuilt.w) / 2, soy = (selH - selBuilt.h) / 2;
  const selSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual offer badge — SELECTED: stacked dimensional (STARTING AT + $10/HR). Editable real text. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${selW}" height="${selH}" viewBox="0 0 ${selW} ${selH}">
  <g transform="translate(${sox.toFixed(1)} ${soy.toFixed(1)})">${selBuilt.inner}</g>
</svg>`;
  fs.writeFileSync(path.join(OUT, 'offer-badge-selected.svg'), selSvg);
  fs.writeFileSync(path.join(OUT, 'offer-badge-selected.png'), await renderPng(selSvg, selW));

  const spec = `# MedVirtual Offer Badge — Style Specification

**Exact wording only:** \`STARTING AT\` + \`$10/HR\` — no qualifiers, savings, guarantees, asterisks, or extra pricing language.

## Selected: #4 — Stacked dimensional badge

| Property | Value |
|---|---|
| Font family | Be Vietnam (\`${BE}\`) |
| STARTING AT weight | 700 (Bold) |
| $10 / HR weight | 800 (ExtraBold) |
| STARTING AT size | ${selBuilt.cap}px |
| $10 size | ${selBuilt.dollar}px |
| /HR size | ${selBuilt.hr}px |
| Rotation | ${selBuilt.rot}° (counterclockwise) |
| Yellow offset layer | (${selBuilt.yellowOffset.join(', ')})px behind lower slab |
| Cream highlight border | ${selBuilt.creamBorder}px on lower slab; 6px on top slab |
| Top slab | ${360}×${56}px forest green \`${C.forest}\` |
| Lower slab | ${400}×${130}px deep green \`${C.deep}\` |
| Padding (internal) | ~20px top slab inset; price centered in lower slab |
| Shadow style | Hard offset yellow slab only — no blur |

### Colors
| Role | Hex |
|---|---|
| Deep green (lower slab) | \`${C.deep}\` |
| Forest green (top slab) | \`${C.forest}\` |
| Yellow offset | \`${C.yellow}\` |
| Cream border + $10 | \`${C.cream}\` |
| /HR accent | \`${C.yellow}\` |

### Why selected
- **$10 is unmistakably dominant** on the large lower slab
- **STARTING AT reads clearly** on its own top ribbon — not a disclaimer
- **Stacked structure** scales down to feed thumbnail better than single-box treatments
- Pairs with Prompt 2 slab system (yellow offset + cream border grammar)

## All six options
${BADGES.map((b) => `- ${b.title} → \`${b.id}.svg\``).join('\n')}

## Forbidden
Tiny pills · thin borders · glossy app UI · glassmorphism · blurred shadows · cyan/blue · neon · savings claims

## Files
- \`offer-badge-reference.png\` — six-option sheet
- \`offer-badge-selected.svg\` — editable component (real text)
- \`offer-badge-selected.png\` — render preview
- \`offer-badge-spec.md\` — this document
`;
  fs.writeFileSync(path.join(OUT, 'offer-badge-spec.md'), spec);

  console.log('Reference sheet -> offer-badge-reference.png');
  console.log('Selected SVG    -> offer-badge-selected.svg');
  console.log('Spec            -> offer-badge-spec.md');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
