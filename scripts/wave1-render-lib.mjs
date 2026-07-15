/**
 * Shared render helpers for the Wave 1 pipeline (typography, icons, logo).
 * Be Vietnam fonts loaded from the brand kit; text is wrapped/measured in code.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'public/assets/brand/medvirtual/fonts');
const LOGO_PATH = path.join(ROOT, 'public/assets/brand/medvirtual/logo-white.svg');

export const FONT_FILES = [
  'BeVietnam-ExtraBold.ttf',
  'BeVietnam-Bold.ttf',
  'BeVietnam-SemiBold.ttf',
  'BeVietnam-Medium.ttf',
  'BeVietnam-Regular.ttf',
].map((f) => path.join(FONT_DIR, f));

export const FAM = {
  head: 'Be Vietnam ExtraBold',
  bold: 'Be Vietnam Bold',
  semi: 'Be Vietnam SemiBold',
  med: 'Be Vietnam Medium',
  reg: 'Be Vietnam',
};

/**
 * IMPORTANT (font audit, Jul 2026): the Be Vietnam TTFs all expose the
 * typographic family name "Be Vietnam" (name ID 16), so fontdb/resvg register
 * every weight under the SINGLE family "Be Vietnam", selected by numeric weight.
 * Referencing "Be Vietnam ExtraBold" as a font-family silently falls back to
 * Be Vietnam Regular (400). Correct usage: font-family="Be Vietnam" + font-weight.
 * Verified distinct renders for weights 500/600/700/800 via scripts/audit-fonts.mjs.
 */
export const BE = 'Be Vietnam';
export const WEIGHT = {
  extrabold: 800,
  bold: 700,
  semibold: 600,
  medium: 500,
  regular: 400,
};
/** Emit the correct font attributes for a real Be Vietnam weight. */
export function fontAttr(weight) {
  return `font-family="${BE}" font-weight="${weight}"`;
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const NARROW = new Set(['I', 'i', 'l', 'j', '.', ',', "'", '\u2019', '!', ':', ';', '|', ' ', 't', 'f', 'r']);
const WIDE = new Set(['M', 'W', 'm', 'w', '@']);
export function charEm(ch) {
  if (ch === ' ') return 0.30;
  if (WIDE.has(ch)) return 0.92;
  if (NARROW.has(ch)) return 0.34;
  if (ch >= 'A' && ch <= 'Z') return 0.68;
  if (ch >= '0' && ch <= '9') return 0.62;
  if (ch === '-' || ch === '\u2014') return 0.45;
  return 0.56;
}
export function measure(text, fontSize) {
  let em = 0;
  for (const ch of text) em += charEm(ch);
  return em * fontSize;
}
export function wrap(text, fontSize, maxWidth) {
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

/** Auto-fit a headline: returns { size, lines }. */
export function fitHeadline(text, maxWidth, sizes, maxLines = 4) {
  let picked = { size: sizes[sizes.length - 1], lines: wrap(text, sizes[sizes.length - 1], maxWidth) };
  for (const size of sizes) {
    const lines = wrap(text, size, maxWidth);
    const widest = Math.max(...lines.map((l) => measure(l, size)));
    picked = { size, lines };
    if (lines.length <= maxLines && widest <= maxWidth) break;
  }
  return picked;
}

export function textBlock(lines, x, topY, fontSize, family, fill, { lineHeight = 1.08, anchor = 'start', letterSpacing = 0 } = {}) {
  const lh = fontSize * lineHeight;
  return lines
    .map((ln, i) => {
      const y = topY + fontSize * 0.82 + i * lh;
      const ls = letterSpacing ? ` letter-spacing="${letterSpacing}"` : '';
      return `<text x="${x}" y="${y.toFixed(1)}" font-family="${family}" font-size="${fontSize}" fill="${fill}" text-anchor="${anchor}"${ls}>${esc(ln)}</text>`;
    })
    .join('\n');
}

export function icon(name, cx, cy, size, color) {
  const s = size / 100;
  const t = `translate(${cx - size / 2},${cy - size / 2}) scale(${s})`;
  const sa = `fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  let body = '';
  switch (name) {
    case 'phone':
      body = `<rect x="30" y="12" width="40" height="76" rx="9" ${sa}/><line x1="44" y1="22" x2="56" y2="22" ${sa}/><circle cx="50" cy="76" r="4" fill="${color}"/>`;
      break;
    case 'calendar':
      body = `<rect x="16" y="22" width="68" height="62" rx="8" ${sa}/><line x1="16" y1="40" x2="84" y2="40" ${sa}/><line x1="34" y1="14" x2="34" y2="28" ${sa}/><line x1="66" y1="14" x2="66" y2="28" ${sa}/><path d="M38 60 L47 69 L64 50" ${sa}/>`;
      break;
    case 'shield':
      body = `<path d="M50 12 L82 24 V50 C82 70 68 82 50 90 C32 82 18 70 18 50 V24 Z" ${sa}/><path d="M38 50 L47 59 L64 40" ${sa}/>`;
      break;
    case 'chat':
      body = `<path d="M18 26 h44 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-22 l-14 12 v-12 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 Z" ${sa}/><line x1="30" y1="40" x2="58" y2="40" ${sa}/><line x1="30" y1="52" x2="48" y2="52" ${sa}/>`;
      break;
    case 'user':
      body = `<circle cx="50" cy="36" r="16" ${sa}/><path d="M22 84 C22 64 78 64 78 84" ${sa}/>`;
      break;
    case 'bell':
      body = `<path d="M32 68 C32 46 34 30 50 30 C66 30 68 46 68 68 Z" ${sa}/><path d="M24 68 h52" ${sa}/><path d="M44 76 a6 6 0 0 0 12 0" ${sa}/><line x1="50" y1="20" x2="50" y2="30" ${sa}/>`;
      break;
    case 'refresh':
      body = `<path d="M76 40 A30 30 0 1 0 80 62" ${sa}/><path d="M76 20 V42 H54" ${sa}/>`;
      break;
    default:
      body = `<circle cx="50" cy="50" r="30" ${sa}/>`;
  }
  return `<g transform="${t}">${body}</g>`;
}

export function iconFor(label) {
  const l = label.toLowerCase();
  if (l.includes('bilingual') || l.includes('en +') || l.includes('english') || l.includes('spanish') || l.includes(' es')) return 'chat';
  if (l.includes('call')) return 'phone';
  if (l.includes('remind')) return 'bell';
  if (l.includes('reschedul')) return 'refresh';
  if (l.includes('schedul') || l.includes('appointment') || l.includes('confirm') || l.includes('gap') || l.includes('fill')) return 'calendar';
  if (l.includes('insurance') || l.includes('confidential')) return 'shield';
  return 'user';
}

const rawLogo = fs.readFileSync(LOGO_PATH, 'utf8');
export function logoMarkup(color, x, y, scale) {
  const inner = rawLogo
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/#fff/gi, color);
  return `<g transform="translate(${x},${y}) scale(${scale})">${inner}</g>`;
}
