/**
 * PROMPT 6 — Supporting benefit-block system (standalone, no ad).
 *
 * Run: node scripts/benefit-block-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, esc } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/benefit-block-study');
fs.mkdirSync(OUT, { recursive: true });

const C = {
  deep: '#073F2A', forest: '#075C37', ink: '#052818',
  ygreen: '#B8D833', yellow: '#F2D72E', cream: '#FFF4D6',
};
const BG = '#D9D9D9';
const FONT = 42; // 38–46px target for 4:5 ad
const SAMPLE = 'BILINGUAL SUPPORT';
const SAMPLE_LONG = 'TRAINED FOR MEDICAL WORKFLOWS';
const SAMPLE_LINE1 = 'TRAINED FOR MEDICAL';
const SAMPLE_LINE2 = 'WORKFLOWS';

function T(x, y, text, fill, size = FONT, anchor = 'start') {
  const ax = anchor === 'middle' ? ' text-anchor="middle"' : '';
  return `<text x="${x}" y="${y}" font-family="${BE}" font-weight="800" font-size="${size}" fill="${fill}"${ax} letter-spacing="0.5">${esc(text)}</text>`;
}

// Large bold checkmark (~36px arm)
function check(cx, cy, color, scale = 1) {
  const s = scale;
  return `<path d="M${cx - 18 * s} ${cy + 2 * s} l${12 * s} ${14 * s} l${28 * s} -${30 * s}" fill="none" stroke="${color}" stroke-width="${9 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function blockWidth(text, extra = 100) {
  return Math.min(680, Math.max(380, text.length * FONT * 0.58 + extra));
}

const TREATMENTS = [
  {
    id: 'benefit-01-cream-green-check',
    title: '1 · Cream rect · green check · yellow shadow',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 120);
      const h = lines === 2 ? 108 : 76;
      const ty = lines === 2 ? 44 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      return {
        inner: `<rect x="14" y="16" width="${w}" height="${h}" rx="12" fill="${C.yellow}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="${C.cream}" stroke="${C.forest}" stroke-width="8"/>
          ${check(36, lines === 2 ? 54 : h / 2, C.forest)}
          ${lines === 2 ? `${T(68, ty, SAMPLE_LINE1, C.deep)}${T(68, ty2, SAMPLE_LINE2, C.deep)}` : T(68, ty, text, C.deep)}
        `,
        w: w + 20, h: h + 20,
      };
    },
  },
  {
    id: 'benefit-02-deep-cream-check',
    title: '2 · Deep-green rect · cream text · yellow check',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 120);
      const h = lines === 2 ? 108 : 76;
      const ty = lines === 2 ? 44 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      return {
        inner: `<rect x="12" y="14" width="${w}" height="${h}" rx="12" fill="${C.ink}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="${C.deep}" stroke="${C.cream}" stroke-width="8"/>
          ${check(36, lines === 2 ? 54 : h / 2, C.yellow)}
          ${lines === 2 ? `${T(68, ty, SAMPLE_LINE1, C.cream)}${T(68, ty2, SAMPLE_LINE2, C.cream)}` : T(68, ty, text, C.cream)}
        `,
        w: w + 18, h: h + 18,
      };
    },
  },
  {
    id: 'benefit-03-yellow-strip',
    title: '3 · Yellow painted strip · slight tilt',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 110);
      const h = lines === 2 ? 104 : 72;
      const ty = lines === 2 ? 42 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      const rot = -2;
      return {
        inner: `<g transform="rotate(${rot} ${w / 2} ${h / 2})">
          <rect x="10" y="12" width="${w}" height="${h}" rx="8" fill="${C.forest}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${C.yellow}" stroke="${C.deep}" stroke-width="7"/>
          <circle cx="34" cy="${lines === 2 ? 52 : h / 2}" r="22" fill="${C.deep}"/>
          ${check(34, lines === 2 ? 52 : h / 2, C.cream, 0.75)}
          ${lines === 2 ? `${T(66, ty, SAMPLE_LINE1, C.deep)}${T(66, ty2, SAMPLE_LINE2, C.deep)}` : T(66, ty, text, C.deep)}
        </g>`,
        w: w + 24, h: h + 24,
      };
    },
  },
  {
    id: 'benefit-04-slab-check-left',
    title: '4 · Dark-green slab · yellow check left',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 100);
      const h = lines === 2 ? 100 : 70;
      const ty = lines === 2 ? 42 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      return {
        inner: `<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="${C.deep}"/>
          ${check(32, lines === 2 ? 50 : h / 2, C.yellow)}
          ${lines === 2 ? `${T(62, ty, SAMPLE_LINE1, C.cream)}${T(62, ty2, SAMPLE_LINE2, C.cream)}` : T(62, ty, text, C.cream)}
        `,
        w, h,
      };
    },
  },
  {
    id: 'benefit-05-two-layer-banner',
    title: '5 · Two-layer banner · overlapping check',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 130);
      const h = lines === 2 ? 110 : 78;
      const ty = lines === 2 ? 46 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      return {
        inner: `<rect x="10" y="10" width="${w}" height="${h}" rx="10" fill="${C.yellow}"/>
          <rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="${C.deep}"/>
          <circle cx="18" cy="${h / 2}" r="26" fill="${C.yellow}" stroke="${C.deep}" stroke-width="5"/>
          ${check(18, h / 2, C.deep, 0.8)}
          ${lines === 2 ? `${T(52, ty, SAMPLE_LINE1, C.cream)}${T(52, ty2, SAMPLE_LINE2, C.cream)}` : T(52, ty, text, C.cream)}
        `,
        w: w + 14, h: h + 14,
      };
    },
  },
  {
    id: 'benefit-06-circle-check-underline',
    title: '6 · Circle check + bold text · underline',
    build(text, lines = 1) {
      const w = blockWidth(lines === 2 ? SAMPLE_LONG : text, 80);
      const h = lines === 2 ? 96 : 68;
      const ty = lines === 2 ? 40 : h / 2 + FONT * 0.34;
      const ty2 = ty + 46;
      const ulW = lines === 2 ? w - 90 : (text.length * FONT * 0.55);
      return {
        inner: `<circle cx="30" cy="${lines === 2 ? 48 : h / 2}" r="28" fill="${C.forest}" stroke="${C.ygreen}" stroke-width="6"/>
          ${check(30, lines === 2 ? 48 : h / 2, C.cream)}
          ${lines === 2 ? `${T(68, ty, SAMPLE_LINE1, C.deep)}${T(68, ty2, SAMPLE_LINE2, C.deep)}` : T(68, ty, text, C.deep)}
          <rect x="68" y="${(lines === 2 ? ty2 + 10 : ty + 10).toFixed(0)}" width="${ulW.toFixed(0)}" height="7" rx="3" fill="${C.yellow}"/>
        `,
        w, h,
      };
    },
  },
];

function wrapBlock(treatment, text, lines, sw, sh) {
  const b = treatment.build(text, lines);
  const ox = (sw - b.w) / 2, oy = (sh - b.h) / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">
  <rect width="${sw}" height="${sh}" fill="${BG}"/>
  <g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">${b.inner}</g>
</svg>`;
}

async function renderPng(svg, outW) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: outW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}

async function main() {
  const cellW = 720, cellH = 130, pad = 32, gap = 18;
  const sheetW = pad * 2 + cellW;
  const sheetH = 96 + pad + TREATMENTS.length * (cellH + gap) + pad;

  const cells = [];
  for (const t of TREATMENTS) {
    const svg = wrapBlock(t, SAMPLE, 1, cellW - 16, cellH - 8);
    fs.writeFileSync(path.join(OUT, `${t.id}.svg`), svg);
    cells.push({ label: t.title, b64: (await renderPng(svg, cellW)).toString('base64') });
  }

  let imgs = '';
  for (let i = 0; i < cells.length; i++) {
    const y = 96 + i * (cellH + gap);
    imgs += `<text x="${pad + 14}" y="${y + 24}" font-family="${BE}" font-weight="800" font-size="16" fill="#16241d">${cells[i].label}</text>`;
    imgs += `<image href="data:image/png;base64,${cells[i].b64}" x="${pad}" y="${y + 32}" width="${cellW}" height="${cellH - 32}"/>`;
  }
  const sheetSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="44" font-family="${BE}" font-weight="800" font-size="28" fill="#16241d">MedVirtual — Benefit Block Study</text>
  <text x="${pad}" y="72" font-family="${BE}" font-weight="500" font-size="15" fill="#4a5a52">Sample: ${SAMPLE} · ~${FONT}px · max 2 blocks per ad · no pills/cyan/glass</text>
  ${imgs}
</svg>`;
  fs.writeFileSync(path.join(OUT, 'benefit-block-reference.png'), await renderPng(sheetSvg, sheetW));

  // ---- SELECTED: Option 2 ----
  const sel = TREATMENTS[1];
  const oneLine = wrapBlock(sel, SAMPLE, 1, 640, 100);
  const twoLine = wrapBlock(sel, SAMPLE_LONG, 2, 640, 130);
  const oneSvg = oneLine.replace(SAMPLE, '{{BENEFIT_TEXT}}').replace(
    `<g transform="translate(${((640 - sel.build(SAMPLE, 1).w) / 2).toFixed(1)}`,
    '<g transform="translate({{OFFSET_X}}'
  );
  // Save concrete versions with real editable text
  fs.writeFileSync(path.join(OUT, 'benefit-block-primary-one-line.svg'), oneLine);
  fs.writeFileSync(path.join(OUT, 'benefit-block-primary-two-line.svg'), twoLine);

  // Also save parameterized component (comments for designers)
  const component = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual benefit block — PRIMARY Option 2 · editable real text
     One-line: set single <text> · Two-line: duplicate text row at y+46 -->
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="100" viewBox="0 0 640 100" data-component="benefit-block-primary">
  <defs>
    <style><![CDATA[
      .benefit-text { font-family: Be Vietnam; font-weight: 800; font-size: ${FONT}px; fill: ${C.cream}; letter-spacing: 0.5px; }
    ]]></style>
  </defs>
  <g id="benefit-block" transform="translate(0 12)">
    <rect x="12" y="14" width="600" height="76" rx="12" fill="${C.ink}"/>
    <rect x="0" y="0" width="600" height="76" rx="12" fill="${C.deep}" stroke="${C.cream}" stroke-width="8"/>
    <path d="M24 40 l12 14 l28 -30" fill="none" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(OUT, 'benefit-block-component-base.svg'), component);

  const examples = [
    'BILINGUAL SUPPORT', 'FULL-TIME STAFF', SAMPLE_LONG, 'DEDICATED TO YOUR PRACTICE',
  ];
  const spec = `# MedVirtual Benefit Block — Style Specification

## Selected: **Option 2 — Deep-green rectangle · cream text · yellow check**

Secondary proof points — large but subordinate to headline, price, and CTA.

| Property | Value |
|---|---|
| Font family | Be Vietnam (\`${BE}\`) |
| Font weight | 800 (ExtraBold) |
| Font size | **${FONT}px** (38–46px target on 4:5) |
| Block height (one-line) | **76px** |
| Block height (two-line) | **108px** |
| Horizontal padding | ~68px left (after check) · ~24px right |
| Checkmark size | ~36px arm · **9px** stroke |
| Checkmark color | \`${C.yellow}\` |
| Field | \`${C.deep}\` |
| Text | \`${C.cream}\` |
| Border | \`${C.cream}\` · **8px** |
| Shadow offset | **(12, 14)px** hard · \`${C.ink}\` |
| Corner radius | 12px |
| Max blocks per ad | **2** |

### Sample benefit lines
${examples.map((e) => `- \`${e}\``).join('\n')}

### Files
- \`benefit-block-reference.png\` — six-option sheet
- \`benefit-block-primary-one-line.svg\` — editable one-line (\`${SAMPLE}\`)
- \`benefit-block-primary-two-line.svg\` — editable two-line (\`${SAMPLE_LONG}\`)
- \`benefit-block-component-base.svg\` — shell with check + border (add text rows)

### Forbidden
Tiny pills · 3+ blocks · fine print · thin borders · cyan/blue · glass · tiny icons · long sentences

Stop point: benefit-block system complete.
`;
  fs.writeFileSync(path.join(OUT, 'benefit-block-spec.md'), spec);

  console.log('Reference sheet -> benefit-block-reference.png');
  console.log('One-line primary -> benefit-block-primary-one-line.svg');
  console.log('Two-line primary -> benefit-block-primary-two-line.svg');
  console.log('Spec            -> benefit-block-spec.md');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
