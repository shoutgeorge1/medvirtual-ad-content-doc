/**
 * Font audit for the Wave 1 render pipeline.
 *
 * 1. Parses each Be Vietnam TTF `name` table to report the REAL internal
 *    family name (nameID 1/16) and subfamily (nameID 2/17).
 * 2. Runs a resvg render-diff test: renders identical text using the family
 *    name our code references vs a deliberately bogus family. If the two PNGs
 *    are pixel-identical, resvg silently fell back (font NOT used). If they
 *    differ, the intended font is really rendering.
 *
 * No network, no image API. Run: node scripts/audit-fonts.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES, FAM } from './wave1-render-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FONT_DIR = path.join(ROOT, 'public/assets/brand/medvirtual/fonts');

function readNameTable(file) {
  const b = fs.readFileSync(file);
  const numTables = b.readUInt16BE(4);
  let nameOffset = 0;
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    const tag = b.toString('ascii', rec, rec + 4);
    if (tag === 'name') nameOffset = b.readUInt32BE(rec + 8);
  }
  if (!nameOffset) return {};
  const count = b.readUInt16BE(nameOffset + 2);
  const stringOffset = b.readUInt16BE(nameOffset + 4);
  const strBase = nameOffset + stringOffset;
  const names = {};
  for (let i = 0; i < count; i++) {
    const rec = nameOffset + 6 + i * 12;
    const platformID = b.readUInt16BE(rec);
    const nameID = b.readUInt16BE(rec + 6);
    const len = b.readUInt16BE(rec + 8);
    const off = b.readUInt16BE(rec + 10);
    let str;
    if (platformID === 3 || platformID === 0) {
      str = b.toString('utf16le', strBase + off, strBase + off + len)
        .replace(/\u0000/g, '')
        // utf16le of big-endian bytes is wrong; decode manually below
        ;
      // Proper big-endian UTF-16 decode:
      let s = '';
      for (let j = 0; j < len; j += 2) s += String.fromCharCode(b.readUInt16BE(strBase + off + j));
      str = s;
    } else {
      str = b.toString('latin1', strBase + off, strBase + off + len);
    }
    if (names[nameID] === undefined) names[nameID] = str;
  }
  return {
    family: names[1],
    subfamily: names[2],
    typoFamily: names[16],
    typoSubfamily: names[17],
    full: names[4],
  };
}

console.log('=== TTF name-table audit ===');
const ttfInfo = {};
for (const f of fs.readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).sort()) {
  const info = readNameTable(path.join(FONT_DIR, f));
  ttfInfo[f] = info;
  console.log(
    `${f.padEnd(30)} family="${info.family}" sub="${info.subfamily}"` +
      (info.typoFamily ? ` typo16="${info.typoFamily}" typo17="${info.typoSubfamily}"` : '')
  );
}

function hashPng(buf) {
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 12);
}

function renderWith(family, weight) {
  const w = weight ? ` font-weight="${weight}"` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="200">
    <rect width="900" height="200" fill="#052A38"/>
    <text x="20" y="140" font-family="${family}"${w} font-size="120" fill="#ffffff">Hg10$&amp;M</text>
  </svg>`;
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: 900 },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Be Vietnam' },
  }).render().asPng();
}

function inkPixels(buf) {
  // count near-white pixels (rendered glyph ink) via a quick PNG decode
  return buf; // placeholder; replaced by sharp-based counter below
}

console.log('\n=== resvg render-diff fallback test ===');
console.log('(loadSystemFonts:false, defaultFontFamily:"Be Vietnam")');
const bogus = hashPng(renderWith('This Font Does Not Exist 12345'));
console.log(`bogus-family baseline hash: ${bogus}`);
for (const [label, fam] of Object.entries(FAM)) {
  const h = hashPng(renderWith(fam));
  const fellBack = h === bogus ? 'FELL BACK to default' : 'OK (distinct render)';
  console.log(`FAM.${label.padEnd(5)} "${fam}"`.padEnd(46) + ` -> ${h}  ${fellBack}`);
}

// Also test the plausible "real" names discovered above
console.log('\n=== testing discovered internal family names ===');
const candidates = new Set();
for (const info of Object.values(ttfInfo)) {
  if (info.family) candidates.add(info.family);
  if (info.typoFamily) candidates.add(info.typoFamily);
}
for (const fam of candidates) {
  const h = hashPng(renderWith(fam));
  console.log(`"${fam}"`.padEnd(40) + ` -> ${h}  ${h === bogus ? 'FELL BACK' : 'OK'}`);
}

console.log('\n=== WEIGHT TEST: family "Be Vietnam" + numeric font-weight ===');
for (const wt of [100, 300, 400, 500, 600, 700, 800]) {
  const h = hashPng(renderWith('Be Vietnam', wt));
  console.log(`Be Vietnam @ ${String(wt).padEnd(3)} -> ${h}  ${h === bogus ? 'same as default(400)' : 'DISTINCT'}`);
}
const ink = await import('sharp').then(async ({ default: sharp }) => {
  const buf = renderWith('Be Vietnam', 800);
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let white = 0;
  for (let i = 0; i < data.length; i += info.channels) if (data[i] > 200 && data[i + 1] > 200) white++;
  return white;
});
console.log(`\nGlyph ink pixels (Be Vietnam @800): ${ink} ${ink > 0 ? '(text IS rendering)' : '(BLANK - nothing rendered)'}`);
