/**
 * Treatment E — Studio Profile (active Real People concept).
 * Full-bleed natural portrait + light brand bottom plate (white/cyan),
 * Meet {Name} + role, colored logo. No dark mud. No checklist. No CTA strip.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { TREATMENT_E, talentById } from './real-people-data.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'public', BRAND.assets.logoColoredSvg.replace(/^\//, ''));
const FONT_BOLD = path.join(ROOT, 'public', 'assets', 'brand', 'medvirtual', 'fonts', 'BeVietnam-Bold.ttf');
const FONT_MED = path.join(ROOT, 'public', 'assets', 'brand', 'medvirtual', 'fonts', 'BeVietnam-Medium.ttf');
const FONT_REG = path.join(ROOT, 'public', 'assets', 'brand', 'medvirtual', 'fonts', 'BeVietnam-Regular.ttf');

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fontFaceCss() {
  const faces = [];
  const add = (file, weight) => {
    if (!fs.existsSync(file)) return;
    const b64 = fs.readFileSync(file).toString('base64');
    faces.push(
      `@font-face{font-family:'BeVietnam';font-weight:${weight};font-style:normal;src:url('data:font/ttf;base64,${b64}') format('truetype');}`,
    );
  };
  add(FONT_REG, 400);
  add(FONT_MED, 500);
  add(FONT_BOLD, 700);
  return faces.join('');
}

function layoutFor(ratio) {
  if (ratio === '1x1') {
    return {
      w: 1080,
      h: 1080,
      plateTop: 720,
      meetSize: 56,
      roleSize: 26,
      supportSize: 22,
      meetY: 800,
      roleY: 848,
      barY: 872,
      supportY: 918,
      logoW: 200,
      safePad: 0,
    };
  }
  if (ratio === '9x16') {
    return {
      w: 1080,
      h: 1920,
      plateTop: 1280,
      meetSize: 64,
      roleSize: 28,
      supportSize: 24,
      meetY: 1410,
      roleY: 1470,
      barY: 1500,
      supportY: 1555,
      logoW: 220,
      safePad: 100,
    };
  }
  return {
    w: 1080,
    h: 1350,
    plateTop: 880,
    meetSize: 62,
    roleSize: 28,
    supportSize: 23,
    meetY: 980,
    roleY: 1035,
    barY: 1062,
    supportY: 1115,
    logoW: 210,
    safePad: 0,
  };
}

async function preparePhoto(srcPath, L) {
  // Bias slightly upward so faces sit above the light plate
  return sharp(srcPath)
    .rotate()
    .resize(L.w, L.h, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

function buildOverlaySvg(L, te) {
  const support = te.supportLine || 'Available to interview';
  const pad = L.safePad;
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${fontFaceCss()}
      .meet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#0D546B}
      .role{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:500;fill:#077999}
      .sup{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:400;fill:#5A6B78}
    </style>
    <linearGradient id="lift" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.97"/>
    </linearGradient>
    <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F0F5FF"/>
      <stop offset="55%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E8F8FC"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#077999"/>
      <stop offset="100%" stop-color="#00C0D4"/>
    </linearGradient>
  </defs>

  <!-- Soft white lift into brand plate (keeps face readable without teal mud) -->
  <rect x="0" y="${L.plateTop - 180}" width="${L.w}" height="200" fill="url(#lift)"/>
  <rect x="0" y="${L.plateTop}" width="${L.w}" height="${L.h - L.plateTop}" fill="url(#plate)"/>
  <rect x="0" y="${L.plateTop}" width="${L.w}" height="6" fill="url(#edge)"/>

  <!-- Quiet brand curves on plate -->
  <path d="M ${L.w - 20} ${L.plateTop + 40} C ${L.w - 180} ${L.plateTop + 90}, ${L.w - 80} ${L.h - 40}, ${L.w + 40} ${L.h - 10}" fill="none" stroke="#00B2E2" stroke-width="2.5" opacity="0.35"/>
  <path d="M -30 ${L.h - 80} C 140 ${L.plateTop + 60}, 200 ${L.h - 20}, 60 ${L.h + 30}" fill="none" stroke="#077999" stroke-width="2" opacity="0.18"/>

  <text class="meet" x="56" y="${L.meetY + pad}" font-size="${L.meetSize}">${escXml(te.meetLine)}</text>
  <text class="role" x="56" y="${L.roleY + pad}" font-size="${L.roleSize}">${escXml(te.role)}</text>
  <rect x="56" y="${L.barY + pad}" width="72" height="5" rx="2.5" fill="#00C0D4"/>
  <text class="sup" x="56" y="${L.supportY + pad}" font-size="${L.supportSize}">${escXml(support)}</text>
</svg>`);
}

export async function renderTreatmentEAds() {
  const logoBuf = fs.existsSync(LOGO)
    ? await sharp(LOGO).resize({ width: 200, fit: 'inside' }).png().toBuffer()
    : null;

  const outputs = [];
  for (const te of TREATMENT_E) {
    const t = talentById(te.talentId);
    if (!t) continue;
    const slug = t.assetSlug || t.id;
    const personDir = path.join(ROOT, 'public', 'assets', 'real-people', slug);
    const src = [
      path.join(personDir, 'clean-master.jpg'),
      path.join(personDir, 'feed-1080x1350.jpg'),
      path.join(personDir, 'original.png'),
      path.join(personDir, 'original.jpg'),
    ].find((p) => fs.existsSync(p));
    if (!src) {
      console.warn(`Treatment E skip ${slug}: no source`);
      continue;
    }

    for (const ratio of ['4x5', '1x1', '9x16']) {
      const L = layoutFor(ratio);
      const photo = await preparePhoto(src, L);
      const overlay = buildOverlaySvg(L, te);
      const composites = [
        { input: photo, top: 0, left: 0 },
        { input: overlay, top: 0, left: 0 },
      ];

      if (logoBuf) {
        const meta = await sharp(logoBuf).metadata();
        const lw = meta.width || 200;
        const lh = meta.height || 48;
        composites.push({
          input: logoBuf,
          top: L.h - 44 - lh - L.safePad,
          left: L.w - 48 - lw,
        });
      }

      const outName = `ad-treatment-e-${ratio}.png`;
      const outPath = path.join(personDir, outName);
      await sharp({
        create: {
          width: L.w,
          height: L.h,
          channels: 3,
          background: { r: 240, g: 245, b: 255 },
        },
      })
        .composite(composites)
        .png({ compressionLevel: 9 })
        .toFile(outPath);

      fs.copyFileSync(outPath, path.join(personDir, `ad-treatment-d-${ratio}.png`));

      outputs.push({
        talentId: t.id,
        slug,
        ratio,
        path: `/assets/real-people/${slug}/${outName}`,
        file: outPath,
      });
      console.log(`Treatment E ${slug} ${ratio}`);
    }
  }
  return outputs;
}

/** @deprecated */
export async function renderTreatmentDAds() {
  return renderTreatmentEAds();
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  renderTreatmentEAds().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
