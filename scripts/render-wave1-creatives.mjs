/**
 * Wave 1 static creative renderer.
 * Renders production-ready 4:5 (1080x1350) PNGs for the first launch batch
 * directly from approved concept data — real Be Vietnam type, approved palette,
 * no pink, no placeholder microtext.
 *
 * Output: public/exports/wave1-first-launch/creatives/
 * Run:    node scripts/render-wave1-creatives.mjs
 */

import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'public/assets/brand/medvirtual/fonts');
const LOGO_PATH = path.join(ROOT, 'public/assets/brand/medvirtual/logo-white.svg');
const OUT_DIR = path.join(ROOT, 'public/exports/wave1-first-launch/creatives');

const FONT_FILES = [
  'BeVietnam-ExtraBold.ttf',
  'BeVietnam-Bold.ttf',
  'BeVietnam-SemiBold.ttf',
  'BeVietnam-Medium.ttf',
  'BeVietnam-Regular.ttf',
].map((f) => path.join(FONT_DIR, f));

const FAM = {
  head: 'Be Vietnam ExtraBold',
  bold: 'Be Vietnam Bold',
  semi: 'Be Vietnam SemiBold',
  med: 'Be Vietnam Medium',
  reg: 'Be Vietnam',
};

// ── Approved color families (subset used by Wave 1) ──
const FAMILIES = {
  'vivid-green': {
    bg: '#22C55E', bgAlt: '#16A34A', headline: '#0A0A0A', support: '#052E16',
    ctaBg: '#0A0A0A', ctaText: '#FFFFFF', accent: '#0A0A0A', icon: '#0A0A0A', eyebrowBg: '#0A0A0A', eyebrowText: '#FFE600',
  },
  'cobalt-blue': {
    bg: '#1D4ED8', bgAlt: '#1E3A8A', headline: '#FFFFFF', support: '#E8F0FF',
    ctaBg: '#FFFFFF', ctaText: '#1D4ED8', accent: '#00E5FF', icon: '#1D4ED8', eyebrowBg: '#00E5FF', eyebrowText: '#062B63',
  },
  'signal-yellow': {
    bg: '#FFE600', bgAlt: '#E6CF00', headline: '#0A0A0A', support: '#111111',
    ctaBg: '#0A0A0A', ctaText: '#FFE600', accent: '#0A0A0A', icon: '#0A0A0A', eyebrowBg: '#0A0A0A', eyebrowText: '#FFE600',
  },
};

// ── The five approved Wave 1 concepts (source of truth: creative-map.csv) ──
const CONCEPTS = [
  {
    id: 'VMA-33',
    file: 'MV_VMA_33_SpanishNeverLost_4x5.png',
    color: 'vivid-green',
    eyebrow: 'BILINGUAL VIRTUAL MEDICAL ADMIN',
    headline: 'YOUR SPANISH-SPEAKING PATIENTS SHOULD NEVER FEEL LOST',
    support: 'A dedicated bilingual virtual medical admin joins your team.',
    benefits: ['Bilingual Patient Calls', 'Schedule & Confirm Visits', 'Insurance Verification', 'Patient Follow-Up'],
    cta: 'Learn More',
  },
  {
    id: 'VMA-34',
    file: 'MV_VMA_34_BilingualFrontDesk_4x5.png',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'ADD BILINGUAL SUPPORT WITHOUT OVERLOADING YOUR FRONT DESK',
    support: 'A dedicated virtual medical admin joins your team.',
    benefits: ['English & Spanish Call Support', 'Appointment Scheduling', 'Insurance Verification', 'Patient Follow-Up'],
    cta: 'Learn More',
  },
  {
    id: 'VMA-37',
    file: 'MV_VMA_37_TrainedWorkflow_4x5.png',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'TRAINED FOR THE WAY YOUR PRACTICE WORKS',
    support: 'A dedicated virtual medical admin who learns your systems and workflow.',
    benefits: ['Trained on Your Systems', 'Practice-Specific Workflow', 'Dedicated Full-Time Staff', 'Confidential Support'],
    cta: 'Learn More',
  },
  {
    id: 'VMA-41',
    file: 'MV_VMA_41_FrontDeskCapacity_4x5.png',
    color: 'signal-yellow',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'YOUR FRONT DESK CAN\u2019T DO EVERYTHING',
    support: 'Add dedicated administrative capacity without adding another desk.',
    benefits: ['Answer Patient Calls', 'Schedule Appointments', 'Insurance Verification', 'Patient Follow-Up'],
    cta: 'Learn More',
  },
  {
    id: 'VMA-43',
    file: 'MV_VMA_43_ScheduleMoving_4x5.png',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'KEEP THE SCHEDULE MOVING',
    support: 'Dedicated virtual support for confirmations, reminders, and rescheduling.',
    benefits: ['Confirm Appointments', 'Send Reminders', 'Manage Reschedules', 'Keep the Schedule Full'],
    cta: 'Learn More',
  },
];

const W = 1080;
const H = 1350;
const M = 84; // outer safe margin

// ── XML + text helpers ──
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Approximate advance width (fraction of em) for a bold sans, uppercase-heavy.
const NARROW = new Set(['I', 'i', 'l', 'j', '.', ',', "'", '\u2019', '!', ':', ';', '|', ' ', 't', 'f', 'r']);
const WIDE = new Set(['M', 'W', 'm', 'w', '@']);
function charEm(ch) {
  if (ch === ' ') return 0.30;
  if (WIDE.has(ch)) return 0.92;
  if (NARROW.has(ch)) return 0.34;
  if (ch >= 'A' && ch <= 'Z') return 0.68;
  if (ch >= '0' && ch <= '9') return 0.62;
  if (ch === '-' || ch === '\u2014') return 0.45;
  return 0.56; // lowercase default
}
function measure(text, fontSize) {
  let em = 0;
  for (const ch of text) em += charEm(ch);
  return em * fontSize;
}
function wrap(text, fontSize, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const trial = cur ? `${cur} ${word}` : word;
    if (measure(trial, fontSize) <= maxWidth || !cur) cur = trial;
    else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function textBlock(lines, x, topY, fontSize, family, fill, { lineHeight = 1.08, anchor = 'start', letterSpacing = 0, weight } = {}) {
  const lh = fontSize * lineHeight;
  return lines
    .map((ln, i) => {
      const y = topY + fontSize * 0.82 + i * lh;
      const ls = letterSpacing ? ` letter-spacing="${letterSpacing}"` : '';
      const fw = weight ? ` font-weight="${weight}"` : '';
      return `<text x="${x}" y="${y.toFixed(1)}" font-family="${family}"${fw} font-size="${fontSize}" fill="${fill}" text-anchor="${anchor}"${ls}>${esc(ln)}</text>`;
    })
    .join('\n');
}

// ── Icons (100x100 coordinate box, drawn with given color) ──
function icon(name, cx, cy, size, color) {
  const s = size / 100;
  const t = `translate(${cx - size / 2},${cy - size / 2}) scale(${s})`;
  const strokeAttrs = `fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  let body = '';
  switch (name) {
    case 'phone':
      body = `<rect x="30" y="12" width="40" height="76" rx="9" ${strokeAttrs}/><line x1="44" y1="22" x2="56" y2="22" ${strokeAttrs}/><circle cx="50" cy="76" r="4" fill="${color}"/>`;
      break;
    case 'calendar':
      body = `<rect x="16" y="22" width="68" height="62" rx="8" ${strokeAttrs}/><line x1="16" y1="40" x2="84" y2="40" ${strokeAttrs}/><line x1="34" y1="14" x2="34" y2="28" ${strokeAttrs}/><line x1="66" y1="14" x2="66" y2="28" ${strokeAttrs}/><path d="M38 60 L47 69 L64 50" ${strokeAttrs}/>`;
      break;
    case 'shield':
      body = `<path d="M50 12 L82 24 V50 C82 70 68 82 50 90 C32 82 18 70 18 50 V24 Z" ${strokeAttrs}/><path d="M38 50 L47 59 L64 40" ${strokeAttrs}/>`;
      break;
    case 'chat':
      body = `<path d="M18 26 h44 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-22 l-14 12 v-12 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 Z" ${strokeAttrs}/><line x1="30" y1="40" x2="58" y2="40" ${strokeAttrs}/><line x1="30" y1="52" x2="48" y2="52" ${strokeAttrs}/>`;
      break;
    case 'user':
      body = `<circle cx="50" cy="36" r="16" ${strokeAttrs}/><path d="M22 84 C22 64 78 64 78 84" ${strokeAttrs}/>`;
      break;
    case 'clock':
      body = `<circle cx="50" cy="50" r="34" ${strokeAttrs}/><path d="M50 30 V50 L66 60" ${strokeAttrs}/>`;
      break;
    case 'bell':
      body = `<path d="M32 68 C32 46 34 30 50 30 C66 30 68 46 68 68 Z" ${strokeAttrs}/><path d="M24 68 h52" ${strokeAttrs}/><path d="M44 76 a6 6 0 0 0 12 0" ${strokeAttrs}/><line x1="50" y1="20" x2="50" y2="30" ${strokeAttrs}/>`;
      break;
    case 'refresh':
      body = `<path d="M76 40 A30 30 0 1 0 80 62" ${strokeAttrs}/><path d="M76 20 V42 H54" ${strokeAttrs}/>`;
      break;
    default:
      body = `<circle cx="50" cy="50" r="30" ${strokeAttrs}/>`;
  }
  return `<g transform="${t}">${body}</g>`;
}

function iconFor(label) {
  const l = label.toLowerCase();
  if (l.includes('bilingual') || l.includes('english') || l.includes('spanish')) return 'chat';
  if (l.includes('call')) return 'phone';
  if (l.includes('remind')) return 'bell';
  if (l.includes('reschedul')) return 'refresh';
  if (l.includes('schedul') || l.includes('appointment') || l.includes('confirm') || l.includes('visit') || l.includes('full')) return 'calendar';
  if (l.includes('insurance') || l.includes('confidential') || l.includes('verification')) return 'shield';
  if (l.includes('follow') || l.includes('dedicated') || l.includes('support') || l.includes('practice') || l.includes('system') || l.includes('workflow')) return 'user';
  return 'user';
}

// ── Logo (recolored) ──
const rawLogo = fs.readFileSync(LOGO_PATH, 'utf8');
function logoMarkup(color, x, y, scale) {
  const inner = rawLogo
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/#fff/gi, color);
  return `<g transform="translate(${x},${y}) scale(${scale})">${inner}</g>`;
}

// ── Compose one 4:5 ad ──
function buildSvg(c) {
  const f = FAMILIES[c.color];
  const contentW = W - M * 2;

  // Headline auto-fit
  let headSize = 96;
  let headLines = [];
  for (const size of [96, 90, 84, 78, 72, 66, 60]) {
    const lines = wrap(c.headline, size, contentW);
    const widest = Math.max(...lines.map((l) => measure(l, size)));
    if (lines.length <= 4 && widest <= contentW) {
      headSize = size;
      headLines = lines;
      break;
    }
    headSize = size;
    headLines = lines;
  }
  const headLH = headSize * 1.05;

  // Vertical layout
  const logoY = 74;
  const eyebrowY = 176;
  const eyebrowH = 46;
  const headTop = eyebrowY + eyebrowH + 40;
  const headBottom = headTop + headLines.length * headLH;

  const supSize = 33;
  const supLines = wrap(c.support, supSize, contentW - 10);
  const supTop = headBottom + 18;
  const supBottom = supTop + supLines.length * supSize * 1.2;

  // Dashboard card
  const cardX = M;
  const cardW = contentW;
  const cardTop = Math.max(supBottom + 34, 720);
  const cardH = 356;
  const cardBottom = cardTop + cardH;

  // CTA
  const ctaText = c.cta;
  const ctaH = 92;
  const ctaPadX = 46;
  const ctaTextSize = 34;
  const ctaW = Math.min(contentW, measure(ctaText, ctaTextSize) + ctaPadX * 2 + 46);
  const ctaY = cardBottom + 40;
  const ctaBottom = ctaY + ctaH;

  // Trust line
  const trustSize = 24;
  const trustText = 'Dedicated staff \u2014 not a call center, not AI, not software.';
  const trustY = ctaY + (ctaH - trustSize) / 2;

  const logoColor = f.headline;

  // Background decorative shapes (subtle, in bgAlt)
  const decor = `
    <circle cx="${W - 40}" cy="120" r="230" fill="${f.bgAlt}" opacity="0.55"/>
    <circle cx="70" cy="${H - 40}" r="180" fill="${f.bgAlt}" opacity="0.45"/>
  `;

  // Eyebrow pill
  const ebTextSize = 22;
  const ebW = measure(c.eyebrow, ebTextSize) + 44;
  const eyebrow = `
    <rect x="${M}" y="${eyebrowY}" width="${ebW.toFixed(0)}" height="${eyebrowH}" rx="${eyebrowH / 2}" fill="${f.eyebrowBg}"/>
    <text x="${M + ebW / 2}" y="${eyebrowY + eyebrowH / 2 + ebTextSize * 0.35}" font-family="${FAM.bold}" font-size="${ebTextSize}" fill="${f.eyebrowText}" text-anchor="middle" letter-spacing="1.5">${esc(c.eyebrow)}</text>
  `;

  // Dashboard modules (2x2), real benefit copy — no lorem
  const gutter = 22;
  const modW = (cardW - 40 * 2 - gutter) / 2;
  const modH = (cardH - 96 - gutter) / 2;
  const gridTop = cardTop + 74;
  const gridLeft = cardX + 40;
  const modules = c.benefits
    .slice(0, 4)
    .map((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const mx = gridLeft + col * (modW + gutter);
      const my = gridTop + row * (modH + gutter);
      const icName = iconFor(b);
      const iconCircleR = 30;
      const icx = mx + 12 + iconCircleR;
      const icy = my + modH / 2;
      const labelX = icx + iconCircleR + 18;
      const labelMax = modW - (labelX - mx) - 66;
      const labelSize = 25;
      const labelLines = wrap(b, labelSize, labelMax).slice(0, 2);
      const labelBlockTop = my + modH / 2 - (labelLines.length * labelSize * 1.12) / 2;
      const label = textBlock(labelLines, labelX, labelBlockTop, labelSize, FAM.semi, '#0F172A', { lineHeight: 1.12 });
      // small green check top-right of module
      const chkX = mx + modW - 26;
      const chkY = my + modH / 2;
      return `
        <circle cx="${icx}" cy="${icy}" r="${iconCircleR}" fill="#0A0A0A"/>
        ${icon(icName, icx, icy, 40, f.color === 'signal-yellow' ? '#FFE600' : f.accent === '#0A0A0A' ? '#FFFFFF' : f.accent)}
        ${label}
        <circle cx="${chkX}" cy="${chkY}" r="13" fill="#DCFCE7"/>
        <path d="M${chkX - 6} ${chkY} L${chkX - 1} ${chkY + 5} L${chkX + 7} ${chkY - 5}" fill="none" stroke="#16A34A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    })
    .join('\n');

  const cardHeaderY = cardTop + 40;
  const card = `
    <rect x="${cardX}" y="${cardTop}" width="${cardW}" height="${cardH}" rx="28" fill="#FFFFFF"/>
    <rect x="${cardX}" y="${cardTop}" width="${cardW}" height="${cardH}" rx="28" fill="none" stroke="#0A0A0A" stroke-width="2" opacity="0.08"/>
    <text x="${cardX + 40}" y="${cardHeaderY}" font-family="${FAM.bold}" font-size="22" fill="#64748B" letter-spacing="2">WHAT YOUR VIRTUAL ADMIN HANDLES</text>
    ${modules}
  `;

  // CTA button with arrow
  const arrowX = M + ctaW - ctaPadX - 8;
  const cta = `
    <rect x="${M}" y="${ctaY}" width="${ctaW.toFixed(0)}" height="${ctaH}" rx="${ctaH / 2}" fill="${f.ctaBg}"/>
    <text x="${M + ctaPadX}" y="${ctaY + ctaH / 2 + ctaTextSize * 0.35}" font-family="${FAM.bold}" font-size="${ctaTextSize}" fill="${f.ctaText}">${esc(ctaText)}</text>
    <path d="M${arrowX - 22} ${ctaY + ctaH / 2} h26 M${arrowX - 4} ${ctaY + ctaH / 2 - 10} l10 10 l-10 10" fill="none" stroke="${f.ctaText}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  `;

  const trust = `<text x="${M + ctaW + 30}" y="${trustY + trustSize}" font-family="${FAM.med}" font-size="${trustSize}" fill="${f.headline}">${esc(trustText)}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${f.bg}"/>
  ${decor}
  ${logoMarkup(logoColor, M, logoY, 0.30)}
  ${eyebrow}
  ${textBlock(headLines, M, headTop, headSize, FAM.head, f.headline, { lineHeight: 1.05 })}
  ${textBlock(supLines, M, supTop, supSize, FAM.med, f.support, { lineHeight: 1.2 })}
  ${card}
  ${cta}
  ${trust}
</svg>`;
}

function renderPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Be Vietnam' },
    background: 'white',
  });
  return resvg.render().asPng();
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const c of CONCEPTS) {
    const svg = buildSvg(c);
    const png = renderPng(svg);
    const out = path.join(OUT_DIR, c.file);
    fs.writeFileSync(out, png);
    console.log(`rendered ${c.id} -> ${c.file} (${png.length} bytes)`);
  }
  console.log('done');
}

main();
