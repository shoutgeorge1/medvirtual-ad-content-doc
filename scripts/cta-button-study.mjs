/**
 * PROMPT 4 — REQUEST AN INTERVIEW CTA-button system (standalone, no ad).
 *
 * Run: node scripts/cta-button-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, esc } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/cta-button-study');
fs.mkdirSync(OUT, { recursive: true });

const BG = '#D9D9D9';
const C = {
  deep: '#073F2A', forest: '#075C37', ink: '#052818',
  ygreen: '#B8D833', yellow: '#F2D72E', cream: '#FFF4D6',
};

const PRIMARY_LABEL = 'REQUEST AN INTERVIEW';
const ALT_LABEL = 'MEET YOUR NEXT HIRE';
const W800 = '800';

// Target scale for 1080×1350 ad
const BTN_H = 124;
const FONT = 56;
const PAD_X = 58;
const ARROW = 9;

function T(x, y, text, size, fill, anchor = 'start', extra = '') {
  const ax = anchor === 'middle' ? ' text-anchor="middle"' : '';
  return `<text x="${x}" y="${y}" font-family="${BE}" font-weight="${W800}" font-size="${size}" fill="${fill}"${ax}${extra}>${esc(text)}</text>`;
}

function arrow(x, y, color, sw = ARROW, len = 34) {
  return `<path d="M${x} ${y} h${len} M${x + len - 14} ${y - 16} l16 16 l-16 16" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function chevrons(x, y, color, n = 3) {
  let s = '';
  for (let i = 0; i < n; i++) {
  s += `<path d="M${x + i * 18} ${y - 14} l14 14 l-14 14" fill="none" stroke="${color}" stroke-width="${ARROW - 1}" stroke-linecap="round" stroke-linejoin="round" opacity="${0.45 + i * 0.25}"/>`;
  }
  return s;
}

// Estimate button width from label
function btnWidth(label, fontSize = FONT, pad = PAD_X) {
  const approx = label.length * fontSize * 0.52 + pad * 2 + 80;
  return Math.max(520, Math.min(920, Math.round(approx)));
}

const TREATMENTS = [
  {
    id: 'cta-01-yellow-physical',
    title: '1 · Yellow physical button',
    build(label) {
      const w = btnWidth(label), h = BTN_H, r = h / 2;
      const ty = h / 2 + FONT * 0.34;
      const ax = w - PAD_X;
      let ext = '';
      for (let i = 14; i >= 1; i--) ext += `<rect x="${i}" y="${i + 12}" width="${w}" height="${h}" rx="${r}" fill="${C.ink}"/>`;
      return {
        inner: `${ext}
          <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${C.yellow}" stroke="${C.forest}" stroke-width="10"/>
          <rect x="12" y="10" width="${w - 24}" height="8" rx="4" fill="${C.cream}" opacity="0.85"/>
          ${T(PAD_X, ty, label, FONT, C.deep)}
          ${arrow(ax - 44, h / 2, C.deep)}`,
        w: w + 18, h: h + 28, extrusion: 14, outline: 10, highlight: true,
      };
    },
  },
  {
    id: 'cta-02-cream-promotional',
    title: '2 · Cream promotional button',
    build(label) {
      const w = btnWidth(label), h = BTN_H, r = h / 2;
      const ty = h / 2 + FONT * 0.34;
      const ax = w - PAD_X;
      return {
        inner: `<rect x="14" y="16" width="${w}" height="${h}" rx="${r}" fill="${C.forest}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${C.cream}" stroke="${C.yellow}" stroke-width="12"/>
          ${T(PAD_X, ty, label, FONT, C.deep)}
          ${arrow(ax - 50, h / 2, C.deep, 10, 40)}`,
        w: w + 20, h: h + 22, outline: 12, shadow: [14, 16],
      };
    },
  },
  {
    id: 'cta-03-deep-green-dimensional',
    title: '3 · Deep-green dimensional button',
    build(label) {
      const w = btnWidth(label), h = BTN_H, r = h / 2;
      const ty = h / 2 + FONT * 0.34;
      const ax = w - PAD_X;
      return {
        inner: `<rect x="16" y="18" width="${w}" height="${h}" rx="${r}" fill="${C.ink}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${C.deep}" stroke="${C.yellow}" stroke-width="6"/>
          <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${r - 4}" fill="none" stroke="${C.yellow}" stroke-width="4"/>
          ${T(PAD_X, ty, label, FONT, C.cream)}
          ${arrow(ax - 48, h / 2, C.cream, 11, 42)}`,
        w: w + 22, h: h + 24, doubleBorder: [6, 4], shadow: [16, 18],
      };
    },
  },
  {
    id: 'cta-04-painted-retail',
    title: '4 · Painted retail-sign button',
    build(label) {
      const w = btnWidth(label), h = BTN_H + 8;
      const ty = h / 2 + FONT * 0.34;
      const ax = w - PAD_X;
      const path = `M18 12 h${w - 36} l6 14 h-${w - 48} l-6-14z M12 ${h - 18} h${w - 24} l-6 12 h-${w - 36} l6-12z`;
      const shadow = `M30 28 h${w - 36} l6 14 h-${w - 48} l-6-14z M24 ${h - 2} h${w - 24} l-6 12 h-${w - 36} l6-12z`;
      return {
        inner: `<path d="${shadow}" fill="${C.ink}"/>
          <path d="${path}" fill="${C.yellow}" stroke="${C.deep}" stroke-width="11" stroke-linejoin="round"/>
          <path d="M22 14 h${w - 44}" fill="none" stroke="${C.deep}" stroke-width="4" opacity="0.35"/>
          ${T(PAD_X, ty, label, FONT, C.deep)}
          ${arrow(ax - 44, h / 2, C.deep)}`,
        w: w + 28, h: h + 24, outline: 11, shadow: [18, 18],
      };
    },
  },
  {
    id: 'cta-05-angled-action',
    title: '5 · Angled action button',
    build(label) {
      const rot = -2.5;
      const w = btnWidth(label), h = BTN_H, r = h / 2;
      const ty = h / 2 + FONT * 0.34;
      const ax = w - PAD_X;
      let ext = '';
      for (let i = 12; i >= 1; i--) ext += `<rect x="${i * 1.1}" y="${i * 1.3 + 10}" width="${w}" height="${h}" rx="${r}" fill="${C.forest}"/>`;
      return {
        inner: `<g transform="rotate(${rot} ${w / 2} ${h / 2})">${ext}
          <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${C.ygreen}" stroke="${C.cream}" stroke-width="8"/>
          ${T(PAD_X, ty, label, FONT, C.deep)}
          ${arrow(ax - 44, h / 2, C.deep)}</g>`,
        w: w + 30, h: h + 28, rot, extrusion: 12, innerBorder: 8,
      };
    },
  },
  {
    id: 'cta-06-layered-banner',
    title: '6 · Layered banner CTA',
    build(label) {
      const w = btnWidth(label), h = BTN_H, r = 14;
      const ty = h / 2 + FONT * 0.34;
      const cx = w / 2;
      return {
        inner: `<rect x="16" y="20" width="${w}" height="${h}" rx="${r}" fill="${C.ink}"/>
          <rect x="10" y="10" width="${w}" height="${h}" rx="${r}" fill="${C.yellow}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="${r}" fill="${C.cream}" stroke="${C.deep}" stroke-width="6"/>
          ${T(cx - 40, ty, label, FONT, C.deep, 'middle')}
          <g transform="translate(${w - PAD_X - 20} ${h / 2})">${chevrons(0, 0, C.deep)}</g>`,
        w: w + 22, h: h + 26, layers: ['ink shadow', 'yellow offset', 'cream front'],
      };
    },
  },
];

async function renderPng(svg, outW) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: outW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}

function wrap(label, built, sw, sh) {
  const ox = (sw - built.w) / 2, oy = (sh - built.h) / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">
  <rect width="${sw}" height="${sh}" fill="${BG}"/>
  <g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">${built.inner}</g>
</svg>`;
}

async function main() {
  const cellW = 920, cellH = 200, pad = 32, gap = 20, cols = 1;
  const rows = TREATMENTS.length;
  const sheetW = pad * 2 + cellW;
  const sheetH = 96 + pad + rows * cellH + (rows - 1) * gap + pad;

  const cells = [];
  for (const t of TREATMENTS) {
    const built = t.build(PRIMARY_LABEL);
    const sw = cellW - 20, sh = cellH - 24;
    const svg = wrap(PRIMARY_LABEL, built, sw, sh);
    fs.writeFileSync(path.join(OUT, `${t.id}.svg`), svg);
    const png = await renderPng(svg, cellW);
    cells.push({ label: t.title, b64: png.toString('base64') });
  }

  let imgs = '';
  for (let i = 0; i < cells.length; i++) {
    const y = 96 + i * (cellH + gap);
    imgs += `<image href="data:image/png;base64,${cells[i].b64}" x="${pad}" y="${y}" width="${cellW}" height="${cellH}"/>`;
    imgs += `<text x="${pad + 14}" y="${y + 26}" font-family="${BE}" font-weight="800" font-size="17" fill="#16241d">${cells[i].label}</text>`;
  }
  const sheetSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="44" font-family="${BE}" font-weight="800" font-size="30" fill="#16241d">MedVirtual — CTA Button Study</text>
  <text x="${pad}" y="72" font-family="${BE}" font-weight="500" font-size="16" fill="#4a5a52">REQUEST AN INTERVIEW · ~${BTN_H}px height · ~${FONT}px text · hard physical depth · no cyan/blue/glow</text>
  ${imgs}
</svg>`;
  fs.writeFileSync(path.join(OUT, 'cta-button-reference.png'), await renderPng(sheetSvg, sheetW));

  // ---- SELECTED ----
  const selPrimary = TREATMENTS[0]; // yellow physical
  const selAlt = TREATMENTS[2];       // deep green dimensional

  const priBuilt = selPrimary.build(PRIMARY_LABEL);
  const altBuilt = selAlt.build(ALT_LABEL);
  const compW = 960, compH = 180;

  const priSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual CTA — PRIMARY: Yellow physical button. Editable real text. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${compW}" height="${compH}" viewBox="0 0 ${compW} ${compH}">
  <g transform="translate(${((compW - priBuilt.w) / 2).toFixed(1)} ${((compH - priBuilt.h) / 2).toFixed(1)})">${priBuilt.inner}</g>
</svg>`;
  const altSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual CTA — ALTERNATE: Deep-green dimensional. Editable real text. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${compW}" height="${compH}" viewBox="0 0 ${compW} ${compH}">
  <g transform="translate(${((compW - altBuilt.w) / 2).toFixed(1)} ${((compH - altBuilt.h) / 2).toFixed(1)})">${altBuilt.inner}</g>
</svg>`;

  fs.writeFileSync(path.join(OUT, 'cta-button-primary.svg'), priSvg);
  fs.writeFileSync(path.join(OUT, 'cta-button-alternate.svg'), altSvg);
  fs.writeFileSync(path.join(OUT, 'cta-button-primary.png'), await renderPng(priSvg, compW));
  fs.writeFileSync(path.join(OUT, 'cta-button-alternate.png'), await renderPng(altSvg, compW));

  const spec = `# MedVirtual CTA Button — Style Specification

**Primary CTA:** \`${PRIMARY_LABEL}\`  
**Alternate CTA:** \`${ALT_LABEL}\`

Target scale on 1080×1350 ad: button height **${BTN_H}px** · text **${FONT}px** · horizontal padding **${PAD_X}px**.

---

## PRIMARY — #1 Yellow physical button

| Property | Value |
|---|---|
| Font family | Be Vietnam (\`${BE}\`) |
| Font weight | 800 (ExtraBold) |
| Font size | ${FONT}px |
| Button height | ${BTN_H}px |
| Button width | ~${btnWidth(PRIMARY_LABEL)}px (scales to label) |
| Corner radius | ${BTN_H / 2}px (full pill ends) |
| Face | \`${C.yellow}\` |
| Text | \`${C.deep}\` |
| Outline | \`${C.forest}\` · ${priBuilt.outline}px |
| Extrusion | ${priBuilt.extrusion} hard steps · \`${C.ink}\` |
| Top highlight | Cream \`${C.cream}\` bar along upper edge |
| Arrow stroke | ${ARROW}px · length ~34px |
| Padding | ${PAD_X}px left · arrow zone ~80px right |

---

## ALTERNATE — #3 Deep-green dimensional button

| Property | Value |
|---|---|
| Label | \`${ALT_LABEL}\` |
| Font size | ${FONT}px |
| Button height | ${BTN_H}px |
| Face | \`${C.deep}\` |
| Text | \`${C.cream}\` |
| Double border | Yellow \`${C.yellow}\` · ${altBuilt.doubleBorder[0]}px + ${altBuilt.doubleBorder[1]}px |
| Shadow offset | (${altBuilt.shadow.join(', ')})px hard · \`${C.ink}\` |
| Arrow stroke | 11px · length ~42px |

---

## All six treatments
${TREATMENTS.map((t) => `- ${t.title} → \`${t.id}.svg\``).join('\n')}

## Forbidden
Blurry shadows · tiny arrows · thin outlines · blue/cyan · glow · gradients · glass · tiny pills · "Learn More"

## Files
- \`cta-button-reference.png\` — six-option sheet
- \`cta-button-primary.svg\` — primary CTA (editable)
- \`cta-button-alternate.svg\` — alternate CTA (editable)
- \`cta-button-spec.md\` — this document
`;
  fs.writeFileSync(path.join(OUT, 'cta-button-spec.md'), spec);

  console.log('Reference sheet -> cta-button-reference.png');
  console.log('Primary CTA     -> cta-button-primary.svg');
  console.log('Alternate CTA   -> cta-button-alternate.svg');
  console.log('Spec            -> cta-button-spec.md');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
