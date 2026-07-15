/**
 * PROMPT 5 — Concept icon-badge system (standalone, no ad).
 *
 * Run: node scripts/icon-badge-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE, esc } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/icon-badge-study');
fs.mkdirSync(OUT, { recursive: true });

const C = {
  deep: '#073F2A', forest: '#075C37', ink: '#052818',
  ygreen: '#B8D833', yellow: '#F2D72E', cream: '#FFF4D6',
};
const BG = '#D9D9D9';
const R = 88; // badge radius (176px diameter — feed-readable)
const BORDER = 10;
const SHADOW = [12, 14];

// ---- icon glyphs (centered at 0,0, ~±52 unit box) ----
const ICONS = {
  bilingual: {
    id: 'icon-bilingual',
    label: 'Bilingual support',
    draw(ink) {
      const textDark = ink === C.cream ? C.deep : C.cream;
      return `<g>
        <rect x="-54" y="-38" width="72" height="52" rx="12" fill="${ink}"/>
        <path d="M-30 14 v16 l14-16" fill="${ink}"/>
        <rect x="-8" y="-18" width="72" height="52" rx="12" fill="none" stroke="${ink}" stroke-width="6"/>
        <text x="-18" y="-4" font-family="${BE}" font-weight="800" font-size="22" fill="${textDark}" text-anchor="middle">EN</text>
        <text x="28" y="16" font-family="${BE}" font-weight="800" font-size="22" fill="${ink}" text-anchor="middle">ES</text>
        <path d="M6 -6 l12 0 M12 -12 l0 12" fill="none" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/>
        <path d="M-2 4 l10 8" fill="none" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/>
      </g>`;
    },
  },
  calls: {
    id: 'icon-call-volume',
    label: 'High call volume',
    draw(ink) {
      return `<g fill="${ink}" stroke="${ink}" stroke-linecap="round">
        <path d="M-18 -42 c-8 0-14 6-14 14 v52 c0 8 6 14 14 14 h8 l22-22 v-36 z" fill="${ink}" stroke="none"/>
        <path d="M12 -8 c14 0 26 12 26 26" fill="none" stroke-width="7"/>
        <path d="M20 4 c10 0 18 8 18 18" fill="none" stroke-width="6"/>
        <circle cx="38" cy="-32" r="10" fill="${C.yellow}" stroke="none"/>
        <rect x="-8" y="28" width="36" height="14" rx="7" fill="${ink}" stroke="none"/>
      </g>`;
    },
  },
  workflow: {
    id: 'icon-trained-workflow',
    label: 'Trained workflow',
    draw(ink) {
      const sw = 6;
      return `<g fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="-42" cy="8" r="16" fill="${ink}" stroke="none"/>
        <circle cx="0" cy="-28" r="16" fill="${ink}" stroke="none"/>
        <circle cx="42" cy="8" r="16" fill="${ink}" stroke="none"/>
        <line x1="-26" y1="2" x2="-8" y2="-18"/>
        <line x1="8" y1="-18" x2="26" y2="2"/>
        <path d="M48 8 h18 l-10 10" fill="none"/>
        <path d="M-8 36 l12 14 l28-30" fill="none" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    },
  },
  bell: {
    id: 'icon-front-desk-capacity',
    label: 'Front-desk capacity',
    draw(ink) {
      return `<g fill="${ink}" stroke="${ink}" stroke-linecap="round">
        <path d="M-28 -36 h56 l-8 44 c0 16-12 28-28 28 s-28-12-28-28 z" fill="${ink}" stroke="none"/>
        <rect x="-6" y="36" width="12" height="10" rx="3" fill="${ink}" stroke="none"/>
        <ellipse cx="0" cy="46" rx="22" ry="6" fill="${ink}" stroke="none"/>
        <text x="32" y="-8" font-family="${BE}" font-weight="800" font-size="36" fill="${C.yellow}" text-anchor="middle">+</text>
        <path d="M-44 -44 q-6 8 0 16 M44 -44 q6 8 0 16" fill="none" stroke-width="5"/>
      </g>`;
    },
  },
  calendar: {
    id: 'icon-appointment-scheduling',
    label: 'Appointment scheduling',
    draw(ink) {
      return `<g>
        <rect x="-40" y="-36" width="80" height="76" rx="10" fill="${ink}" stroke="none"/>
        <rect x="-40" y="-36" width="80" height="22" rx="10" fill="${C.yellow}" stroke="none"/>
        <rect x="-40" y="-24" width="80" height="10" fill="${C.yellow}" stroke="none"/>
        <line x1="-20" y1="-8" x2="-20" y2="28" stroke="${C.deep}" stroke-width="4"/>
        <line x1="0" y1="-8" x2="0" y2="28" stroke="${C.deep}" stroke-width="4"/>
        <line x1="20" y1="-8" x2="20" y2="28" stroke="${C.deep}" stroke-width="4"/>
        <path d="M-18 18 l10 12 l26-28" fill="none" stroke="${C.yellow}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="34" cy="-46" r="12" fill="none" stroke="${ink}" stroke-width="5"/>
        <line x1="34" y1="-46" x2="34" y2="-54" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
        <line x1="34" y1="-46" x2="40" y2="-42" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
      </g>`;
    },
  },
};

const VARIANTS = [
  {
    id: 'variant-a-circle-cream',
    title: 'A · Cream on deep-green circle',
    wrap(iconSvg, rot = -4) {
      return `<g transform="rotate(${rot})">
        <circle cx="${SHADOW[0]}" cy="${SHADOW[1]}" r="${R}" fill="${C.ink}"/>
        <circle cx="0" cy="0" r="${R}" fill="${C.deep}" stroke="${C.ygreen}" stroke-width="${BORDER}"/>
        <g transform="scale(1.05)">${iconSvg(C.cream)}</g>
      </g>`;
    },
    selected: true,
  },
  {
    id: 'variant-b-yellow-field',
    title: 'B · Dark-green on yellow badge',
    wrap(iconSvg, rot = 3) {
      return `<g transform="rotate(${rot})">
        <circle cx="${SHADOW[0]}" cy="${SHADOW[1]}" r="${R}" fill="${C.forest}"/>
        <circle cx="0" cy="0" r="${R}" fill="${C.yellow}" stroke="${C.deep}" stroke-width="${BORDER}"/>
        <g transform="scale(1.05)">${iconSvg(C.deep)}</g>
      </g>`;
    },
  },
  {
    id: 'variant-c-painted-slab',
    title: 'C · Cream/yellow on painted slab',
    wrap(iconSvg, rot = -5) {
      const w = R * 2 + 8, h = R * 2 - 12;
      const path = `M-${w / 2 - 6} -${h / 2} h${w - 12} l8 12 h-${w - 28} l-8-12z`;
      const shadow = `M-${w / 2 + 10} -${h / 2 + 14} h${w - 12} l8 12 h-${w - 28} l-8-12z`;
      return `<g transform="rotate(${rot})">
        <path d="${shadow}" fill="${C.ink}"/>
        <path d="${path}" fill="${C.forest}" stroke="${C.ygreen}" stroke-width="${BORDER}" stroke-linejoin="round"/>
        <g transform="scale(1.02)">${iconSvg(C.cream)}</g>
      </g>`;
    },
  },
];

function badgeSvg(concept, variant, size = 220) {
  const pad = size / 2;
  const icon = ICONS[concept];
  const body = variant.wrap(icon.draw);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${size} ${size}">
  ${body}
</svg>`;
}

async function renderPng(svg, outW) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: outW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}

async function main() {
  const concepts = Object.keys(ICONS);
  const cell = 200, labelH = 36, rowGap = 48, colGap = 28;
  const pad = 40;
  const sheetW = pad * 2 + VARIANTS.length * cell + (VARIANTS.length - 1) * colGap;
  const sheetH = 100 + pad + concepts.length * (cell + labelH + rowGap) + pad;

  const cellPngs = [];
  for (const ck of concepts) {
    for (const v of VARIANTS) {
      const svg = badgeSvg(ck, v, cell);
      const singlePath = path.join(OUT, `${ICONS[ck].id}_${v.id}.svg`);
      fs.writeFileSync(singlePath, svg);
      const png = await renderPng(svg, cell);
      cellPngs.push({ concept: ICONS[ck].label, variant: v.title, b64: png.toString('base64') });
    }
  }

  let body = '';
  for (let r = 0; r < concepts.length; r++) {
    const y0 = 100 + pad + r * (cell + labelH + rowGap);
    body += `<text x="${pad}" y="${y0 + 22}" font-family="${BE}" font-weight="800" font-size="18" fill="#16241d">${ICONS[concepts[r]].label}</text>`;
    for (let c = 0; c < VARIANTS.length; c++) {
      const x = pad + c * (cell + colGap);
      const idx = r * VARIANTS.length + c;
      body += `<text x="${x}" y="${y0 + labelH - 6}" font-family="${BE}" font-weight="600" font-size="13" fill="#4a5a52">${VARIANTS[c].title}</text>`;
      body += `<image href="data:image/png;base64,${cellPngs[idx].b64}" x="${x}" y="${y0 + labelH}" width="${cell}" height="${cell}"/>`;
    }
  }
  const colHeaders = VARIANTS.map((v, i) =>
    `<text x="${pad + i * (cell + colGap) + cell / 2}" y="88" font-family="${BE}" font-weight="700" font-size="14" fill="#075C37" text-anchor="middle">${v.title.split('·')[1]?.trim() || v.title}</text>`).join('');
  const sheetSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="44" font-family="${BE}" font-weight="800" font-size="30" fill="#16241d">MedVirtual — Concept Icon Badge Study</text>
  <text x="${pad}" y="72" font-family="${BE}" font-weight="500" font-size="16" fill="#4a5a52">5 concepts × 3 variants · promotional badges · no flags · no cyan · no thin line icons</text>
  ${colHeaders}
  ${body}
</svg>`;
  fs.writeFileSync(path.join(OUT, 'icon-badge-reference.png'), await renderPng(sheetSvg, sheetW));

  // ---- SELECTED SET: Variant A (cream on deep-green circle) ----
  const sel = VARIANTS[0];
  const selDir = path.join(OUT, 'selected');
  fs.mkdirSync(selDir, { recursive: true });
  const selectedMeta = [];
  for (const ck of concepts) {
    const icon = ICONS[ck];
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- MedVirtual icon badge — ${icon.label} · ${sel.title} · editable SVG -->
<svg xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="-100 -100 200 200">
  ${sel.wrap(icon.draw, ck === 'calls' ? -3 : -4)}
</svg>`;
    const outFile = `${icon.id}.svg`;
    fs.writeFileSync(path.join(selDir, outFile), svg);
    selectedMeta.push({ concept: icon.label, file: outFile });
  }

  const spec = `# MedVirtual Icon Badge — Style Specification

## Selected style (full set): **Variant A — Cream icon on deep-green circle**

Consistent across all five concepts for feed readability and alignment with the green DR environment system.

| Property | Value |
|---|---|
| Badge diameter | **176px** (radius ${R}px) |
| Border width | **${BORDER}px** yellow-green \`${C.ygreen}\` |
| Field | Deep forest \`${C.deep}\` |
| Icon fill/stroke | Cream \`${C.cream}\` · bold filled shapes (not thin line icons) |
| Shadow offset | **(${SHADOW.join(', ')})px** hard · \`${C.ink}\` |
| Rotation | −3° to −4° per concept (slight, not comic) |
| Safe spacing | Icon glyph scaled 1.05× inside badge · ~12px clear of border |
| Internal icon box | ~104×104px equivalent at center |

### Concepts
${selectedMeta.map((m) => `- **${m.concept}** → \`selected/${m.file}\``).join('\n')}

### Icon rules
- Bilingual: EN/ES speech bubbles + translation marks — **no flags, no stereotypes**
- Call volume: handset + ring arcs + notification dot
- Workflow: 3 nodes + arrow + large checkmark
- Front desk: service bell + plus + ring lines
- Scheduling: calendar + check + clock marks

### Three variants (reference sheet)
${VARIANTS.map((v) => `- ${v.title}`).join('\n')}

### Forbidden
Gradients · glass · blue/cyan · thin line icons · photorealism · 3D · emojis · clip-art

### Files
- \`icon-badge-reference.png\` — 5×3 reference sheet
- \`selected/*.svg\` — five editable components (Variant A)
- \`icon-badge-spec.md\` — this document
`;
  fs.writeFileSync(path.join(OUT, 'icon-badge-spec.md'), spec);

  console.log('Reference sheet -> icon-badge-reference.png');
  console.log('Selected set     -> selected/*.svg (5 icons, Variant A)');
  console.log('Spec             -> icon-badge-spec.md');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
