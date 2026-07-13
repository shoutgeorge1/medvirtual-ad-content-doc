/**
 * Render Treatment C ad mockups (4:5 / 1:1 / 9:16) via Sharp + SVG overlays.
 * No face beauty filters. Soft bottom gradient only under copy — face stays readable.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { TREATMENT_C, talentById } from './real-people-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'assets', 'logo', 'medvirtual-logo.svg');

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layoutFor(ratio) {
  if (ratio === '1x1') {
    return {
      w: 1080,
      h: 1080,
      photoTop: 210,
      photoH: 520,
      headY: 48,
      headSize: 52,
      meetY: 760,
      roleY: 808,
      bulletStart: 860,
      ctaY: 990,
      ctaH: 70,
      logoW: 200,
      logoPad: 28,
      safePad: 0,
    };
  }
  if (ratio === '9x16') {
    return {
      w: 1080,
      h: 1920,
      photoTop: 420,
      photoH: 780,
      headY: 220,
      headSize: 58,
      meetY: 1240,
      roleY: 1295,
      bulletStart: 1360,
      ctaY: 1580,
      ctaH: 78,
      logoW: 220,
      logoPad: 36,
      safePad: 160,
    };
  }
  // 4x5 primary
  return {
    w: 1080,
    h: 1350,
    photoTop: 250,
    photoH: 620,
    headY: 56,
    headSize: 56,
    meetY: 910,
    roleY: 962,
    bulletStart: 1015,
    ctaY: 1225,
    ctaH: 78,
    logoW: 220,
    logoPad: 32,
    safePad: 0,
  };
}

async function preparePhoto(srcPath, L) {
  // Cover the photo band without stretching identity
  return sharp(srcPath)
    .rotate()
    .resize(L.w, L.photoH, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

function buildOverlaySvg(tc, L) {
  const lines = tc.headlineLines.map(escXml);
  const bullets = tc.bullets.slice(0, 3);
  const lineGap = L.headSize + 8;
  const headBlock = lines
    .map(
      (line, i) =>
        `<text x="54" y="${L.headY + i * lineGap}" font-family="Segoe UI, Arial, sans-serif" font-size="${L.headSize}" font-weight="850" fill="#ffffff" letter-spacing="0.5">${line}</text>`,
    )
    .join('');

  const bulletXml = bullets
    .map((b, i) => {
      const y = L.bulletStart + i * 42;
      return `
        <circle cx="68" cy="${y - 8}" r="11" fill="#0d9488"/>
        <path d="M62 ${y - 8} l4 4 l8 -9" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="90" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#f8fafc">${escXml(b.text)}</text>
      `;
    })
    .join('');

  // Soft bottom scrim only under lower copy — keep face region clearer
  const scrimTop = L.photoTop + L.photoH * 0.45;
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topPanel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="bottomScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0"/>
      <stop offset="40%" stop-color="#0f172a" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.94"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${L.w}" height="${L.photoTop}" fill="url(#topPanel)"/>
  <rect x="0" y="${scrimTop}" width="${L.w}" height="${L.h - scrimTop}" fill="url(#bottomScrim)"/>
  ${headBlock}
  <text x="54" y="${L.meetY}" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="800" fill="#5eead4">${escXml(tc.meetLine)}</text>
  <text x="54" y="${L.roleY}" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="650" fill="#e2e8f0">${escXml(tc.role)}</text>
  ${bulletXml}
  <rect x="0" y="${L.ctaY}" width="${L.w}" height="${L.ctaH}" fill="#0d9488"/>
  <text x="${L.w / 2}" y="${L.ctaY + L.ctaH / 2 + 10}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="850" fill="#ffffff" letter-spacing="1">${escXml(tc.ctaStrip)}</text>
  <!-- high-contrast logo plate -->
  <rect x="${L.w - L.logoW - L.logoPad - 20}" y="${L.logoPad}" width="${L.logoW + 20}" height="64" rx="10" fill="#ffffff"/>
</svg>`);
}

export async function renderTreatmentCAds() {
  const logoBuf = fs.existsSync(LOGO)
    ? await sharp(LOGO).resize({ width: 180, fit: 'inside' }).png().toBuffer()
    : null;

  const outputs = [];
  for (const tc of TREATMENT_C) {
    const t = talentById(tc.talentId);
    if (!t) continue;
    const slug = t.assetSlug || t.id;
    const personDir = path.join(ROOT, 'public', 'assets', 'real-people', slug);
    const src =
      [
        path.join(personDir, 'clean-master.jpg'),
        path.join(personDir, 'original.png'),
        path.join(personDir, 'original.jpg'),
      ].find((p) => fs.existsSync(p));
    if (!src) {
      console.warn(`Treatment C skip ${slug}: no source`);
      continue;
    }

    for (const ratio of ['4x5', '1x1', '9x16']) {
      const L = layoutFor(ratio);
      const photo = await preparePhoto(src, L);
      const overlay = buildOverlaySvg(tc, L);
      const composites = [
        { input: photo, top: L.photoTop, left: 0 },
        { input: overlay, top: 0, left: 0 },
      ];
      if (logoBuf) {
        composites.push({
          input: logoBuf,
          top: L.logoPad + 10,
          left: L.w - L.logoW - L.logoPad - 10,
        });
      }
      const outName = `ad-treatment-c-${ratio}.png`;
      const outPath = path.join(personDir, outName);
      await sharp({
        create: {
          width: L.w,
          height: L.h,
          channels: 3,
          background: { r: 15, g: 23, b: 42 },
        },
      })
        .composite(composites)
        .png({ compressionLevel: 9 })
        .toFile(outPath);
      outputs.push({
        talentId: t.id,
        slug,
        ratio,
        path: `/assets/real-people/${slug}/${outName}`,
        file: outPath,
      });
      console.log(`Treatment C ${slug} ${ratio}`);
    }
  }
  return outputs;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  renderTreatmentCAds().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
