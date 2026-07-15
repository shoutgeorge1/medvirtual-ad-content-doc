/**
 * Wave 1 compositor — plate + code-rendered typography → Meta-ready PNG.
 *
 * Reads a selected AI plate per concept, cover-fits it to the exact target
 * dimensions, then composites logo + eyebrow + headline + support + benefits +
 * CTA (Be Vietnam) with a brand scrim for guaranteed readability. Typography is
 * recomposed per ratio (not cropped).
 *
 * Run:
 *   node scripts/composite-wave1.mjs --ratio=4x5
 *   node scripts/composite-wave1.mjs --ratio=4x5 --synthetic   (no API; stand-in plates)
 *
 * Selection (optional): plates/<ratio>/selection.json
 *   { "VMA-33": "candidate-2.png", "VMA-41": "candidate-1.png" }
 *
 * Output: public/exports/wave1-first-launch/creatives/<STEM>_<ratio>.png
 * Editable source: public/exports/wave1-first-launch/composites/<STEM>_<ratio>.svg
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { CONCEPTS, FAMILIES, RATIOS } from './wave1-creative-config.mjs';
import {
  FONT_FILES, FAM, esc, measure, wrap, fitHeadline, textBlock, icon, iconFor, logoMarkup,
} from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function arg(name, def) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
}
const flag = (name) => process.argv.includes(`--${name}`);

const RATIO_KEY = arg('ratio', '4x5');
const SYNTHETIC = flag('synthetic');
const ONLY = (arg('concepts', '') || '').split(',').map((s) => s.trim()).filter(Boolean);

if (!RATIOS[RATIO_KEY]) {
  console.error(`Invalid --ratio. Use one of: ${Object.keys(RATIOS).join(', ')}`);
  process.exit(1);
}

const ratio = RATIOS[RATIO_KEY];
const PLATE_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/plates', RATIO_KEY);
// Synthetic (stand-in) runs never touch the real deliverable folder.
const OUT_DIR = SYNTHETIC
  ? path.join(ROOT, 'public/exports/wave1-first-launch/plates/_validation', RATIO_KEY)
  : path.join(ROOT, 'public/exports/wave1-first-launch/creatives');
const SRC_DIR = SYNTHETIC
  ? path.join(ROOT, 'public/exports/wave1-first-launch/plates/_validation', RATIO_KEY)
  : path.join(ROOT, 'public/exports/wave1-first-launch/composites');

function readSelection() {
  const p = path.join(PLATE_DIR, 'selection.json');
  if (fs.existsSync(p)) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { /* ignore */ }
  }
  return {};
}

async function syntheticPlate(concept) {
  // Diagonal two-tone brand gradient stand-in so the pipeline is testable w/o API.
  const f = FAMILIES[concept.color];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ratio.w}" height="${ratio.h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${f.bg}"/><stop offset="1" stop-color="${f.bgAlt}"/>
    </linearGradient></defs>
    <rect width="${ratio.w}" height="${ratio.h}" fill="url(#g)"/>
    <circle cx="${ratio.w * 0.72}" cy="${ratio.h * 0.68}" r="${Math.min(ratio.w, ratio.h) * 0.28}" fill="${f.bgAlt}" opacity="0.6"/>
    <circle cx="${ratio.w * 0.3}" cy="${ratio.h * 0.85}" r="${Math.min(ratio.w, ratio.h) * 0.18}" fill="${f.scrimBottom}" opacity="0.25"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function loadPlate(concept, selection) {
  if (SYNTHETIC) return syntheticPlate(concept);
  const file = selection[concept.id] || 'candidate-1.png';
  const p = path.join(PLATE_DIR, concept.id, file);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing plate: ${path.relative(ROOT, p)} (run generate-wave1-plates.mjs or pass --synthetic)`);
  }
  return fs.readFileSync(p);
}

// ── Overlay (scrim + typography) per ratio ──
function buildOverlay(concept) {
  const f = FAMILIES[concept.color];
  const { w, h } = ratio;
  const portrait = h >= w;
  const wide = w / h >= 1.7;

  // Safe margins; 9:16 keeps text out of top 14% / bottom 20%.
  const M = wide ? 64 : Math.round(w * 0.066);
  const topSafe = RATIO_KEY === '9x16' ? Math.round(h * 0.15) : Math.round(h * 0.055);
  const botSafe = RATIO_KEY === '9x16' ? Math.round(h * 0.2) : Math.round(h * 0.06);

  const logoScale = wide ? 0.24 : w >= 1080 ? 0.30 : 0.28;

  // Content column
  const colX = M;
  const talentLayout = !wide && RATIO_KEY !== '9x16';
  const useLeftScrim = wide || talentLayout;
  const colW = wide
    ? Math.round(w * 0.56)
    : talentLayout
      ? Math.round(w * 0.55)
      : w - M * 2;

  // Headline sizing per ratio
  const headSizes = wide
    ? [64, 58, 52, 46, 42]
    : RATIO_KEY === '1x1'
      ? [72, 66, 60, 54, 48]
      : talentLayout
        ? [78, 72, 66, 60, 54, 48]
        : [96, 90, 84, 78, 72, 66, 60];
  const head = fitHeadline(concept.headline, colW, headSizes, wide ? 4 : talentLayout ? 7 : 4);
  const headLH = head.size * 1.05;

  const logoY = topSafe;
  const ebSize = wide ? 18 : 22;
  const ebH = ebSize + 22;
  const ebY = logoY + Math.round(logoScale * 300) + (wide ? 14 : 22);
  const ebW = measure(concept.eyebrow, ebSize) + 44;

  const headTop = ebY + ebH + (wide ? 22 : 34);
  const headBottom = headTop + head.lines.length * headLH;

  const supSize = wide ? 24 : RATIO_KEY === '1x1' ? 30 : 33;
  const supLines = wrap(concept.support, supSize, colW - 6);
  const supTop = headBottom + 16;

  // Bottom cluster: benefits strip + CTA + trust
  const ctaH = wide ? 74 : 92;
  const ctaTextSize = wide ? 28 : 34;
  const ctaPadX = wide ? 38 : 46;
  const ctaW = Math.min(colW, measure(concept.cta, ctaTextSize) + ctaPadX * 2 + 46);
  const ctaY = h - botSafe - ctaH;

  // Benefit pills (dark translucent, readable over any plate).
  // Wide 1.91:1 link ads stay minimal-text per brand DNA — no chips.
  const showChips = !wide;
  const chipH = 54;
  const chipGap = 16;
  const chipTextSize = 23;
  const chips = showChips
    ? concept.benefits.map((b) => {
        const tw = measure(b, chipTextSize);
        return { label: b, iconName: iconFor(b), w: Math.round(chipH * 0.9 + 14 + tw + 22) };
      })
    : [];
  const rows = [[]];
  let rowW = 0;
  for (const c of chips) {
    if (rowW + c.w + chipGap > colW && rows[rows.length - 1].length) {
      rows.push([]);
      rowW = 0;
    }
    rows[rows.length - 1].push(c);
    rowW += c.w + chipGap;
  }
  const chipsBlockH = showChips ? rows.length * chipH + (rows.length - 1) * chipGap : 0;
  const chipsTop = showChips ? ctaY - 30 - chipsBlockH : ctaY - 30;

  function chipRow(row, y) {
    let x = colX;
    return row
      .map((c) => {
        const cx = x;
        x += c.w + chipGap;
        const icR = chipH * 0.34;
        const icCx = cx + chipH * 0.5;
        const icCy = y + chipH / 2;
        const tx = icCx + icR + 12;
        return `
          <rect x="${cx}" y="${y}" width="${c.w}" height="${chipH}" rx="${chipH / 2}" fill="#0A0A0A" opacity="0.62"/>
          <circle cx="${icCx}" cy="${icCy}" r="${icR}" fill="${f.accent === '#0A0A0A' ? '#FFFFFF' : f.accent}"/>
          ${icon(c.iconName, icCx, icCy, icR * 1.5, f.accent === '#0A0A0A' || f.color === 'signal-yellow' ? '#0A0A0A' : '#04122E')}
          <text x="${tx}" y="${icCy + chipTextSize * 0.34}" font-family="${FAM.semi}" font-size="${chipTextSize}" fill="#FFFFFF">${esc(c.label)}</text>
        `;
      })
      .join('');
  }
  const chipsSvg = showChips ? rows.map((row, i) => chipRow(row, chipsTop + i * (chipH + chipGap))).join('\n') : '';

  // Scrims
  const scrimTopEnd = portrait ? Math.min(0.52, (supTop + supLines.length * supSize * 1.2 + 30) / h) : 0.6;
  const scrimBotStart = Math.max(scrimTopEnd + 0.05, (chipsTop - 40) / h);
  const scrims = useLeftScrim
    ? `<rect width="${w}" height="${h}" fill="url(#leftScrim)"/>`
    : `<rect width="${w}" height="${h}" fill="url(#topScrim)"/>
       <rect width="${w}" height="${h}" fill="url(#botScrim)"/>`;

  const defs = useLeftScrim
    ? `<linearGradient id="leftScrim" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="${f.scrimBottom}" stop-opacity="0.94"/>
         <stop offset="${talentLayout ? '0.48' : '0.5'}" stop-color="${f.scrimBottom}" stop-opacity="${talentLayout ? '0.82' : '0.72'}"/>
         <stop offset="${talentLayout ? '0.66' : '0.72'}" stop-color="${f.scrimBottom}" stop-opacity="0.18"/>
         <stop offset="1" stop-color="${f.scrimBottom}" stop-opacity="0"/>
       </linearGradient>`
    : `<linearGradient id="topScrim" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="${f.scrimTop}" stop-opacity="0.96"/>
         <stop offset="${scrimTopEnd.toFixed(3)}" stop-color="${f.scrimTop}" stop-opacity="0"/>
       </linearGradient>
       <linearGradient id="botScrim" x1="0" y1="0" x2="0" y2="1">
         <stop offset="${scrimBotStart.toFixed(3)}" stop-color="${f.scrimBottom}" stop-opacity="0"/>
         <stop offset="1" stop-color="${f.scrimBottom}" stop-opacity="0.9"/>
       </linearGradient>`;

  const headColor = useLeftScrim ? '#FFFFFF' : f.headline;
  const supColor = useLeftScrim ? '#E8F0FF' : f.support;
  const logoColor = useLeftScrim ? '#FFFFFF' : f.headline;

  const arrowX = colX + ctaW - ctaPadX - 8;
  const trustText = 'Dedicated staff \u2014 not a call center, not AI, not software.';
  const trustSize = wide ? 18 : talentLayout ? 17 : 22;
  const trustX = talentLayout ? colX : colX + ctaW + 26;
  const trustY = talentLayout
    ? h - Math.max(20, Math.round(botSafe * 0.35))
    : ctaY + ctaH + (h - (ctaY + ctaH) - trustSize) / 2 + trustSize;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${defs}</defs>
  ${scrims}
  ${logoMarkup(logoColor, colX, logoY, logoScale)}
  <rect x="${colX}" y="${ebY}" width="${ebW.toFixed(0)}" height="${ebH}" rx="${ebH / 2}" fill="${f.eyebrowBg}"/>
  <text x="${colX + ebW / 2}" y="${ebY + ebH / 2 + ebSize * 0.35}" font-family="${FAM.bold}" font-size="${ebSize}" fill="${f.eyebrowText}" text-anchor="middle" letter-spacing="1.4">${esc(concept.eyebrow)}</text>
  ${textBlock(head.lines, colX, headTop, head.size, FAM.head, headColor, { lineHeight: 1.05 })}
  ${textBlock(supLines, colX, supTop, supSize, FAM.med, supColor, { lineHeight: 1.2 })}
  ${chipsSvg}
  <rect x="${colX}" y="${ctaY}" width="${ctaW.toFixed(0)}" height="${ctaH}" rx="${ctaH / 2}" fill="${f.ctaBg}"/>
  <text x="${colX + ctaPadX}" y="${ctaY + ctaH / 2 + ctaTextSize * 0.35}" font-family="${FAM.bold}" font-size="${ctaTextSize}" fill="${f.ctaText}">${esc(concept.cta)}</text>
  <path d="M${arrowX - 22} ${ctaY + ctaH / 2} h26 M${arrowX - 4} ${ctaY + ctaH / 2 - 10} l10 10 l-10 10" fill="none" stroke="${f.ctaText}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="${trustX}" y="${trustY}" font-family="${FAM.med}" font-size="${trustSize}" fill="#FFFFFF">${esc(trustText)}</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(SRC_DIR, { recursive: true });
  const selection = readSelection();
  const concepts = ONLY.length ? CONCEPTS.filter((c) => ONLY.includes(c.id)) : CONCEPTS;
  const report = [];

  for (const c of concepts) {
    const plateBuf = await loadPlate(c, selection);
    const base = await sharp(plateBuf)
      .resize(ratio.w, ratio.h, { fit: 'cover', position: 'centre' })
      .toBuffer();

    const overlaySvg = buildOverlay(c);
    const overlayPng = new Resvg(overlaySvg, {
      fitTo: { mode: 'width', value: ratio.w },
      font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Be Vietnam' },
    }).render().asPng();

    const outName = `${c.stem}_${RATIO_KEY}.png`;
    const outPath = path.join(OUT_DIR, outName);
    await sharp(base).composite([{ input: overlayPng, top: 0, left: 0 }]).png().toFile(outPath);

    fs.writeFileSync(path.join(SRC_DIR, `${c.stem}_${RATIO_KEY}.svg`), overlaySvg);
    const stat = fs.statSync(outPath);
    report.push({ id: c.id, file: outName, bytes: stat.size, dims: `${ratio.w}x${ratio.h}`, plate: SYNTHETIC ? 'synthetic' : (selection[c.id] || 'candidate-1.png') });
    console.log(`composited ${c.id} -> ${outName} (${ratio.w}x${ratio.h}, ${stat.size} bytes)`);
  }

  fs.writeFileSync(path.join(SRC_DIR, `report-${RATIO_KEY}.json`), JSON.stringify(report, null, 2));
  console.log(`\nDone (${RATIO_KEY}). Editable SVG sources + report in composites/.`);
}

main().catch((e) => {
  console.error('Fatal:', String(e?.message || e));
  process.exit(1);
});
