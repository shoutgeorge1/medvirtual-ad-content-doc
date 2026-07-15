/**
 * PROMPT 2 — Green background + headline-slab reference study.
 * No ad, no people, logos, prices, buttons, icons, or readable copy.
 *
 * Run: node scripts/green-background-slab-study.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, BE } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/exports/green-environment-study');
fs.mkdirSync(OUT, { recursive: true });

// Exploratory palette refined against measured winners (#030606 bg, #61C837 lime)
const G = {
  g1: '#073F2A', g2: '#075C37', g3: '#087A43', g4: '#0B8F4D',
  g5: '#B8D833', g6: '#F2D72E', cream: '#FFF4D6',
  dark: '#041A12', ink: '#052818', measuredLime: '#55C63A',
};

const W = 1080, H = 1350; // 4:5

// Abstract headline-zone placeholder (no readable copy — geometric blocks only)
function headlineZone() {
  return `<g opacity="0.22">
    <rect x="72" y="118" width="520" height="72" rx="6" fill="${G.cream}"/>
    <rect x="72" y="210" width="460" height="88" rx="6" fill="${G.g6}"/>
    <rect x="72" y="318" width="560" height="72" rx="6" fill="${G.cream}"/>
  </g>`;
}

// Light paper/grain overlay (shared)
function grainFilter(id, opacity = 0.08) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" result="n"/>
    <feColorMatrix type="saturate" values="0" in="n" result="g"/>
    <feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer>
  </filter>`;
}

const BACKGROUNDS = [
  {
    id: 'bg-01-radial-spotlight',
    title: '1 · Deep green radial spotlight',
    build: () => {
      const fid = 'grain1';
      return `<defs>
        ${grainFilter(fid, 0.07)}
        <radialGradient id="spot" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stop-color="${G.g4}"/>
          <stop offset="42%" stop-color="${G.g3}"/>
          <stop offset="78%" stop-color="${G.g2}"/>
          <stop offset="100%" stop-color="${G.g1}"/>
        </radialGradient>
        <radialGradient id="vig" cx="50%" cy="50%" r="68%">
          <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.42"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#spot)"/>
      <rect width="${W}" height="${H}" fill="url(#vig)"/>
      <rect width="${W}" height="${H}" filter="url(#${fid})" fill="#FFFFFF"/>`;
    },
    select: { vignette: 0.42, textureOpacity: 0.07, spotlight: 'cx 38% cy 32% r 72%', center: G.g4, edge: G.g1 },
  },
  {
    id: 'bg-02-painted-poster',
    title: '2 · Painted green poster texture',
    build: () => {
      const fid = 'grain2';
      return `<defs>
        ${grainFilter(fid, 0.11)}
        <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${G.g2}"/>
          <stop offset="48%" stop-color="${G.g3}"/>
          <stop offset="100%" stop-color="${G.g1}"/>
        </linearGradient>
        <linearGradient id="roll" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000" stop-opacity="0.12"/>
          <stop offset="18%" stop-color="#000" stop-opacity="0"/>
          <stop offset="50%" stop-color="#FFF" stop-opacity="0.06"/>
          <stop offset="82%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.10"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="${G.g1}"/>
      <rect width="${W}" height="${H}" fill="url(#vert)"/>
      <g opacity="0.35">
        <path d="M-40 ${H * 0.2} Q${W * 0.3} ${H * 0.15} ${W * 0.6} ${H * 0.22} T${W + 60} ${H * 0.18}" fill="none" stroke="${G.g4}" stroke-width="140" stroke-linecap="round"/>
        <path d="M-20 ${H * 0.55} Q${W * 0.4} ${H * 0.5} ${W * 0.7} ${H * 0.58} T${W + 40} ${H * 0.52}" fill="none" stroke="${G.g2}" stroke-width="100" stroke-linecap="round"/>
      </g>
      <rect width="${W}" height="${H}" fill="url(#roll)"/>
      <rect width="${W}" height="${H}" filter="url(#${fid})" fill="#FFFFFF"/>`;
    },
    select: { textureOpacity: 0.11, verticalCenter: G.g3, rollerOpacity: 0.35 },
  },
  {
    id: 'bg-03-halftone-print',
    title: '3 · Green halftone commercial print',
    build: () => {
      const dots = Array.from({ length: 28 }, (_, row) => {
        const y = row * 48 + 12;
        return Array.from({ length: 22 }, (_, col) => {
          const x = col * 50 + 12 + (row % 2) * 25;
          const r = 2.2 + (row + col) % 3 * 0.4;
          return `<circle cx="${x}" cy="${y}" r="${r}" fill="${G.g5}" opacity="0.14"/>`;
        }).join('');
      }).join('');
      return `<defs>
        <radialGradient id="hvig" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.38"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="${G.g1}"/>
      <g>${dots}</g>
      <rect width="${W}" height="${H}" fill="url(#hvig)"/>`;
    },
    select: { halftoneOpacity: 0.14, dotRadius: '2.2–3.0px', vignette: 0.38 },
  },
  {
    id: 'bg-04-geometric-panels',
    title: '4 · Layered geometric green panels',
    build: () => `<rect width="${W}" height="${H}" fill="${G.g1}"/>
      <polygon points="0,0 ${W},0 ${W},${H * 0.42} 0,${H * 0.58}" fill="${G.g2}"/>
      <polygon points="0,${H * 0.35} ${W},${H * 0.22} ${W},${H * 0.72} 0,${H * 0.85}" fill="${G.g3}"/>
      <polygon points="0,${H * 0.68} ${W * 0.55},${H * 0.62} ${W},${H} 0,${H}" fill="${G.g4}" opacity="0.85"/>
      <line x1="0" y1="${H * 0.58}" x2="${W}" y2="${H * 0.42}" stroke="${G.dark}" stroke-width="6"/>
      <line x1="0" y1="${H * 0.85}" x2="${W}" y2="${H * 0.72}" stroke="${G.dark}" stroke-width="5"/>`,
    select: { panels: [G.g2, G.g3, G.g4], seamStroke: G.dark, seamWidth: '5–6px' },
  },
  {
    id: 'bg-05-green-burst',
    title: '5 · Green burst behind headline',
    build: () => {
      const cx = W * 0.36, cy = H * 0.28;
      return `<defs>
        <radialGradient id="burst" cx="${cx}" cy="${cy}" r="58%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${G.g4}"/>
          <stop offset="28%" stop-color="${G.g3}"/>
          <stop offset="58%" stop-color="${G.g2}"/>
          <stop offset="100%" stop-color="${G.g1}"/>
        </radialGradient>
        <radialGradient id="outer" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.48"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="${G.g1}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${W * 0.62}" ry="${H * 0.38}" fill="url(#burst)"/>
      <g opacity="0.18" transform="rotate(-8 ${cx} ${cy})">
        <polygon points="${cx - 280},${cy} ${cx},${cy - 420} ${cx + 280},${cy}" fill="${G.g5}"/>
      </g>
      <rect width="${W}" height="${H}" fill="url(#outer)"/>`;
    },
    select: { burstCenter: '36% x · 28% y', burstRadius: '58%', outerVignette: 0.48, rayOpacity: 0.18 },
  },
  {
    id: 'bg-06-chalkboard-sign',
    title: '6 · Green chalkboard-sign surface',
    build: () => {
      const fid = 'grain6';
      return `<defs>${grainFilter(fid, 0.09)}</defs>
      <rect width="${W}" height="${H}" fill="${G.g3}"/>
      <rect width="${W}" height="${H}" fill="${G.g2}" opacity="0.35"/>
      <g opacity="0.55" stroke="${G.cream}" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M120 980 h180 M120 1020 h140"/>
        <path d="M860 240 l-60 40 M820 280 l-80 0"/>
      </g>
      <g opacity="0.45" stroke="${G.g6}" stroke-width="4" fill="none">
        <path d="M90 760 Q200 720 310 760"/>
        <path d="M780 1080 h120"/>
      </g>
      <rect x="64" y="96" width="8" height="220" fill="${G.g6}" opacity="0.35" transform="rotate(-2 68 96)"/>
      <rect width="${W}" height="${H}" filter="url(#${fid})" fill="#FFFFFF"/>`;
    },
    select: { field: G.g3, overlay: G.g2, accentMarks: [G.cream, G.g6], textureOpacity: 0.09 },
  },
];

const SLABS = [
  {
    id: 'slab-01-tilted-yellow-offset',
    title: '1 · Tilted dark-green + yellow offset',
    w: 520, h: 118,
    build: (sw, sh) => {
      const tilt = -4, offX = 14, offY = 12;
      return `<g transform="translate(${(sw - 520) / 2} ${(sh - 118) / 2})">
        <rect x="${offX}" y="${offY}" width="520" height="118" rx="14" fill="${G.g6}" transform="rotate(${tilt} 260 59)"/>
        <rect x="0" y="0" width="520" height="118" rx="14" fill="${G.g1}" transform="rotate(${tilt} 260 59)"/>
      </g>`;
    },
    select: { tilt: -4, yellowOffset: [14, 12], fill: G.g1, offsetFill: G.g6, radius: 14 },
  },
  {
    id: 'slab-02-cream-border',
    title: '2 · Forest-green slab + thick cream border',
    w: 500, h: 110,
    build: (sw, sh) => `<g transform="translate(${(sw - 500) / 2} ${(sh - 110) / 2})">
      <rect x="0" y="0" width="500" height="110" rx="12" fill="${G.cream}" stroke="${G.cream}" stroke-width="10"/>
      <rect x="10" y="10" width="480" height="90" rx="8" fill="${G.g2}"/>
    </g>`,
    select: { fill: G.g2, border: G.cream, borderWidth: 10, innerRadius: 8 },
  },
  {
    id: 'slab-03-ygreen-extrusion',
    title: '3 · Yellow-green slab + dark extrusion',
    w: 480, h: 104,
    build: (sw, sh) => {
      let ext = '';
      for (let i = 10; i >= 1; i--) ext += `<rect x="${i * 1.1}" y="${i * 1.3}" width="480" height="104" rx="10" fill="${G.ink}"/>`;
      return `<g transform="translate(${(sw - 480) / 2} ${(sh - 104) / 2})">${ext}
        <rect x="0" y="0" width="480" height="104" rx="10" fill="${G.g5}"/>
      </g>`;
    },
    select: { fill: G.g5, extrusionSteps: 10, extrusionColor: G.ink, step: [1.1, 1.3] },
  },
  {
    id: 'slab-04-irregular-painted',
    title: '4 · Irregular painted rectangle + hard shadow',
    w: 500, h: 112,
    build: (sw, sh) => `<g transform="translate(${(sw - 500) / 2} ${(sh - 112) / 2})">
      <path d="M18 16 h462 l-8 96 h-446 l-8-96z" fill="${G.ink}" transform="translate(16 16)"/>
      <path d="M12 8 h468 l6 14 h-456 l-6-14z M6 22 h474 l-4 82 h-466 l-4-82z" fill="${G.g2}"/>
    </g>`,
    select: { fill: G.g2, shadowOffset: [16, 16], shadowColor: G.ink, irregularEdge: 'hand-cut path' },
  },
];

function bgSvg(bg, showZone = true) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${bg.build()}
  ${showZone ? headlineZone() : ''}
</svg>`;
}

function slabSvg(slab, sw = 640, sh = 280) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">
  <rect width="${sw}" height="${sh}" fill="#D9D9D9"/>
  ${slab.build(sw, sh)}
</svg>`;
}

async function renderSvg(svg, outW) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: outW }, font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: BE } }).render().asPng();
}

async function sheet(cells, cols, cellW, cellH, pad, gap, title, subtitle) {
  const rows = Math.ceil(cells.length / cols);
  const sheetW = pad * 2 + cols * cellW + (cols - 1) * gap;
  const sheetH = 96 + pad + rows * cellH + (rows - 1) * gap + pad;
  let body = '';
  for (let i = 0; i < cells.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = pad + c * (cellW + gap), y = 96 + r * (cellH + gap);
    body += `<image href="data:image/png;base64,${cells[i].b64}" x="${x}" y="${y}" width="${cellW}" height="${cellH}"/>`;
    body += `<text x="${x + 14}" y="${y + 28}" font-family="${BE}" font-weight="800" font-size="18" fill="#16241d">${cells[i].label}</text>`;
  }
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
  <rect width="${sheetW}" height="${sheetH}" fill="#EDEDED"/>
  <text x="${pad}" y="44" font-family="${BE}" font-weight="800" font-size="30" fill="#16241d">${title}</text>
  <text x="${pad}" y="72" font-family="${BE}" font-weight="500" font-size="16" fill="#4a5a52">${subtitle}</text>
  ${body}
</svg>`;
  return renderSvg(svg, sheetW);
}

async function main() {
  const thumbW = 360, thumbH = 450;

  // Individual background PNGs + save full SVGs
  const bgCells = [];
  for (const bg of BACKGROUNDS) {
    const svg = bgSvg(bg, true);
    fs.writeFileSync(path.join(OUT, `${bg.id}.svg`), svg);
    const png = await renderSvg(svg, thumbW);
    bgCells.push({ label: bg.title, b64: png.toString('base64') });
  }
  const bgSheet = await sheet(bgCells, 2, thumbW, thumbH, 36, 24,
    'MedVirtual — Green Background Study (4:5)',
    'Six isolated environments · abstract blocks show headline zone only · no readable copy · palette refined vs measured winners (#030606 field, #55C63A lime)');
  fs.writeFileSync(path.join(OUT, 'green-background-reference.png'), bgSheet);

  const slabCells = [];
  for (const slab of SLABS) {
    const svg = slabSvg(slab);
    fs.writeFileSync(path.join(OUT, `${slab.id}.svg`), svg);
    const png = await renderSvg(svg, 480);
    slabCells.push({ label: slab.title, b64: png.toString('base64') });
  }
  const slabSheet = await sheet(slabCells, 2, 480, 210, 36, 24,
    'MedVirtual — Headline Slab Study',
    'Four editable focal-word slabs · bold · hard-edged · thumbnail-readable');
  fs.writeFileSync(path.join(OUT, 'green-slab-reference.png'), slabSheet);

  // ---- SELECTED PRIMARY ----
  const selBg = BACKGROUNDS[4]; // bg-05 green burst
  const selSlab = SLABS[0];     // slab-01 tilted yellow offset

  const selBgSvg = bgSvg(selBg, false);
  fs.writeFileSync(path.join(OUT, 'green-background-selected.svg'), selBgSvg);
  fs.writeFileSync(path.join(OUT, 'green-background-selected.png'), await renderSvg(selBgSvg, W));

  const selSlabSvg = slabSvg(selSlab, 640, 280);
  fs.writeFileSync(path.join(OUT, 'green-slab-selected.svg'), selSlabSvg);
  fs.writeFileSync(path.join(OUT, 'green-slab-selected.png'), await renderSvg(selSlabSvg, 640));

  const spec = `# MedVirtual Green Background + Slab System — Specification

Measured from running winners (VMA-01 SpanishGreen / VMA-04 HIPAAGreen):
- Dominant field in source ads is near-black (\`#030606\` / \`#0E1011\`, 38–59% of canvas)
- Performance lime sampled \`#55C63A\`–\`#67B146\`
- This study pushes a **forceful green environment** for new composites while keeping contrast for cream (\`${G.cream}\`) and yellow (\`${G.g6}\`) lettering from Prompt 1.

## Palette (refined)

| Token | Hex | Role |
|---|---|---|
| g1 | \`${G.g1}\` | Deep forest edge / slab dark |
| g2 | \`${G.g2}\` | Mid forest |
| g3 | \`${G.g3}\` | Saturated field |
| g4 | \`${G.g4}\` | Bright headline-zone green |
| g5 | \`${G.g5}\` | Yellow-green accent / halftone |
| g6 | \`${G.g6}\` | Yellow offset / accent marks |
| cream | \`${G.cream}\` | Lettering face / borders |

**Forbidden in this system:** cyan, blue SaaS gradients, glassmorphism, frosted cards, blurry glow, pink/magenta/rose.

---

## Six background treatments (4:5 · ${W}×${H})

${BACKGROUNDS.map((b) => `### ${b.title}\n- File: \`${b.id}.svg\`\n- Params: ${JSON.stringify(b.select)}`).join('\n\n')}

### **SELECTED PRIMARY: ${selBg.title}**
- **Why:** Directional brighter burst behind the headline zone without comic-book explosion language; dark outer green preserves DR contrast; works with cream/yellow lettering at thumbnail scale.
- **Editable component:** \`green-background-selected.svg\`
- Burst center: ${selBg.select.burstCenter}
- Burst radius: ${selBg.select.burstRadius}
- Outer vignette opacity: ${selBg.select.outerVignette}
- Subtle ray wedge opacity: ${selBg.select.rayOpacity}
- Base edge color: \`${G.g1}\` · burst core: \`${G.g4}\`

---

## Four headline slabs

${SLABS.map((s) => `### ${s.title}\n- File: \`${s.id}.svg\`\n- Params: ${JSON.stringify(s.select)}`).join('\n\n')}

### **SELECTED PRIMARY: ${selSlab.title}**
- **Why:** Matches retail signage grammar (tilted slab + yellow offset); reads instantly behind a focal word at feed thumbnail size; pairs with Prompt 1 treatment #6 yellow focal + underline.
- **Editable component:** \`green-slab-selected.svg\`
- Slab size: ${selSlab.w}×${selSlab.h}px
- Tilt: ${selSlab.select.tilt}°
- Yellow offset layer: (${selSlab.select.yellowOffset.join(', ')})px
- Slab fill: \`${selSlab.select.fill}\` · offset: \`${selSlab.select.offsetFill}\`
- Corner radius: ${selSlab.select.radius}px

---

## Files

| File | Description |
|---|---|
| \`green-background-reference.png\` | Six-option background sheet |
| \`green-slab-reference.png\` | Four-option slab sheet |
| \`green-background-selected.svg\` | Primary background (editable) |
| \`green-slab-selected.svg\` | Primary focal slab (editable) |
| \`green-environment-spec.md\` | This document |

Stop point: background + slab system complete. No full ad built.
`;
  fs.writeFileSync(path.join(OUT, 'green-environment-spec.md'), spec);

  console.log('Background sheet -> green-background-reference.png');
  console.log('Slab sheet      -> green-slab-reference.png');
  console.log('Selected bg     -> green-background-selected.svg');
  console.log('Selected slab   -> green-slab-selected.svg');
  console.log('Spec            -> green-environment-spec.md');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
