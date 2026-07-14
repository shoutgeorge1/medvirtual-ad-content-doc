/**
 * Treatment E — Hailey / Role-Offer Meet (active Real People look).
 * Light grid plate · Meet {Name} · role pill · short skill checks · interview CTA ·
 * colored logo · talent photo on the right. Same Visual DNA as Role-Offer templates.
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

/** Clean Talent Pool skill labels for on-image checklist */
export function cleanSkillLabel(raw) {
  return String(raw || '')
    .replace(/^VA\s*[-–]\s*/i, '')
    .replace(/^BPO\s*[-–]\s*/i, '')
    .trim();
}

function bulletsFor(te, talent) {
  if (Array.isArray(te.bullets) && te.bullets.length) return te.bullets.slice(0, 3);
  const skills = (talent?.listedSkills || []).map(cleanSkillLabel).filter(Boolean);
  if (skills.length) return skills.slice(0, 3);
  return ['Available full-time', 'Joins your practice team'];
}

function layoutFor(ratio) {
  if (ratio === '1x1') {
    return {
      w: 1080,
      h: 1080,
      copyW: 520,
      photoLeft: 500,
      pad: 48,
      meetSize: 48,
      roleSize: 22,
      bulletSize: 22,
      ctaSize: 20,
      logoW: 190,
      safePad: 0,
    };
  }
  if (ratio === '9x16') {
    return {
      w: 1080,
      h: 1920,
      copyW: 1080,
      photoLeft: 0,
      pad: 56,
      meetSize: 58,
      roleSize: 26,
      bulletSize: 26,
      ctaSize: 22,
      logoW: 210,
      safePad: 110,
      storyStack: true,
    };
  }
  return {
    w: 1080,
    h: 1350,
    copyW: 520,
    photoLeft: 500,
    pad: 52,
    meetSize: 52,
    roleSize: 24,
    bulletSize: 24,
    ctaSize: 21,
    logoW: 200,
    safePad: 0,
  };
}

async function preparePhoto(srcPath, L) {
  const photoW = L.storyStack ? L.w : L.w - L.photoLeft + 40;
  const photoH = L.storyStack ? Math.round(L.h * 0.52) : L.h;
  return sharp(srcPath)
    .rotate()
    .resize(photoW, photoH, { fit: 'cover', position: 'attention' })
    .png()
    .toBuffer()
    .then(async (buf) => ({ buf, photoW, photoH }));
}

function buildGridPattern() {
  // Subtle cyan graph grid like Hailey comps
  return `
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#00B2E2" stroke-width="1" opacity="0.22"/>
    </pattern>`;
}

function buildOverlaySvg(L, te, bullets) {
  const support = te.supportLine || 'Available to interview';
  const cta = te.cta || support || 'REQUEST AN INTERVIEW';
  const hirePrefix = te.hirePrefix || 'Hire a Virtual';
  const pad = L.pad;
  const top = L.safePad + pad;
  const pillW = Math.min(
    (L.storyStack ? L.w : L.copyW) - pad * 2,
    Math.max(200, 40 + te.role.length * L.roleSize * 0.55),
  );

  // Story: text sits in lower plate; feed/square: text left column
  const meetY = L.storyStack ? Math.round(L.h * 0.58) + 40 : top + 120;
  const hireY = meetY - 48;
  const roleY = meetY + L.meetSize + 28;
  const ruleY = roleY + 36;
  const bulletStart = ruleY + 36;
  const bulletGap = L.bulletSize + 22;
  const ctaY = bulletStart + bullets.length * bulletGap + 36;

  const bulletSvg = bullets
    .map((b, i) => {
      const y = bulletStart + i * bulletGap;
      return `
      <g transform="translate(${pad}, ${y})">
        <circle cx="12" cy="-6" r="12" fill="#00B2E2"/>
        <path d="M6 -6 l3.2 3.2 6.5-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <text class="bullet" x="34" y="0" font-size="${L.bulletSize}">${escXml(b)}</text>
      </g>`;
    })
    .join('');

  const plateStory = L.storyStack
    ? `<rect x="0" y="${Math.round(L.h * 0.54)}" width="${L.w}" height="${Math.round(L.h * 0.46)}" fill="url(#plate)"/>
       <rect x="0" y="${Math.round(L.h * 0.54)}" width="${L.w}" height="${Math.round(L.h * 0.46)}" fill="url(#grid)" opacity="0.85"/>`
    : `<rect x="0" y="0" width="${L.photoLeft}" height="${L.h}" fill="url(#bg)"/>
       <rect x="0" y="0" width="${L.photoLeft}" height="${L.h}" fill="url(#grid)"/>
       <rect x="${L.photoLeft - 80}" y="0" width="80" height="${L.h}" fill="url(#wash)"/>`;

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${fontFaceCss()}
      .meet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#0D546B}
      .hire{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:600;fill:#00B2E2}
      .bullet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:500;fill:#0D546B}
      .cta{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#FFFFFF}
      .soft{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:400;fill:#5A6B78}
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7FBFF"/>
      <stop offset="55%" stop-color="#EEF6FB"/>
      <stop offset="100%" stop-color="#E8F3F9"/>
    </linearGradient>
    <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7FBFF"/>
      <stop offset="100%" stop-color="#E8F3F9"/>
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F7FBFF" stop-opacity="1"/>
      <stop offset="100%" stop-color="#F7FBFF" stop-opacity="0"/>
    </linearGradient>
    ${buildGridPattern()}
  </defs>

  ${plateStory}

  <text class="hire" x="${pad}" y="${hireY}" font-size="${Math.round(L.roleSize * 1.05)}">${escXml(hirePrefix)}</text>
  <text class="meet" x="${pad}" y="${meetY}" font-size="${L.meetSize}">${escXml(te.meetLine)}</text>

  <!-- Role pill -->
  <rect x="${pad}" y="${roleY - L.roleSize + 4}" rx="22" ry="22"
    width="${pillW}"
    height="${L.roleSize + 22}" fill="#0D546B"/>
  <text fill="#FFFFFF" font-family="BeVietnam,Segoe UI,Arial,sans-serif" font-weight="700"
    font-size="${L.roleSize}" x="${pad + 18}" y="${roleY + 8}">${escXml(te.role)}</text>

  <rect x="${pad}" y="${ruleY}" width="64" height="5" rx="2.5" fill="#00B2E2"/>

  ${bulletSvg}

  <!-- CTA chip -->
  <rect x="${pad}" y="${ctaY}" rx="14" ry="14"
    width="${Math.min(420, 48 + cta.length * L.ctaSize * 0.62)}" height="${L.ctaSize + 28}" fill="#0D546B"/>
  <text class="cta" x="${pad + 22}" y="${ctaY + L.ctaSize + 10}" font-size="${L.ctaSize}">${escXml(cta)}</text>
</svg>`);
}

export async function renderTreatmentEAds() {
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

    const bullets = bulletsFor(te, t);
    const logoBuf = fs.existsSync(LOGO)
      ? await sharp(LOGO).resize({ width: 200, fit: 'inside' }).png().toBuffer()
      : null;

    for (const ratio of ['4x5', '1x1', '9x16']) {
      const L = layoutFor(ratio);
      const { buf: photoBuf } = await preparePhoto(src, L);
      const overlay = buildOverlaySvg(L, te, bullets);

      const composites = [];

      if (L.storyStack) {
        // Photo top, then text plate SVG (transparent upper half)
        composites.push({
          input: photoBuf,
          top: L.safePad,
          left: 0,
        });
        composites.push({ input: overlay, top: 0, left: 0 });
      } else {
        // Left plate SVG + photo right
        composites.push({ input: overlay, top: 0, left: 0 });
        composites.push({
          input: photoBuf,
          top: 0,
          left: L.photoLeft,
        });
      }

      if (logoBuf) {
        const meta = await sharp(logoBuf).metadata();
        const lw = meta.width || 200;
        const lh = meta.height || 48;
        composites.push({
          input: logoBuf,
          top: L.safePad + 36,
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
          background: { r: 247, g: 251, b: 255 },
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
