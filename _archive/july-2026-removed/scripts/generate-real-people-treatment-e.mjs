/**
 * Treatment E — Hailey Role-Offer variations for named Real People.
 * Four comps from Hailey’s favorites, adapted to Meet {Name}:
 *   photo-right         → burnout (flagship default) — price overlay
 *   photo-left          → biller split — price box
 *   photo-right-cta     → nurse — price bar + CTA on photo
 *   photo-right-circle  → dental — $10 circle on photo
 *
 * Outputs:
 *   ad-treatment-e-{4x5|1x1|9x16}.png              (flagship = photo-right)
 *   ad-treatment-e-photo-left-{ratio}.png
 *   ad-treatment-e-photo-right-cta-{ratio}.png
 *   ad-treatment-e-photo-right-circle-{ratio}.png
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

/** Hailey layout variants — mirrors Role-Offer comps she loves */
export const HAILEY_VARIANTS = [
  {
    id: 'photo-right',
    label: 'Photo right · price overlay',
    note: 'Like burnout: Meet + role + checks + CTA left, $10 overlay on person.',
    primary: true,
    ref: '/assets/role-offer-refs/ro-admin-burnout.png',
  },
  {
    id: 'photo-left',
    label: 'Photo left · price box',
    note: 'Like Medical Biller: person left, Meet stack + $10 box right.',
    primary: false,
    ref: '/assets/role-offer-refs/ro-biller-split.png',
  },
  {
    id: 'photo-right-cta',
    label: 'Photo right · CTA on photo',
    note: 'Like Medical Nurse: price bar left, CTA button on person.',
    primary: false,
    ref: '/assets/role-offer-refs/ro-nurse-split.png',
  },
  {
    id: 'photo-right-circle',
    label: 'Photo right · $10 circle',
    note: 'Like Dental Admin: CTA left, teal $10 circle on person.',
    primary: false,
    ref: '/assets/role-offer-refs/ro-dental-admin.png',
  },
];

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

export function cleanSkillLabel(raw) {
  return String(raw || '')
    .replace(/^VA\s*[-–]\s*/i, '')
    .replace(/^BPO\s*[-–]\s*/i, '')
    .replace(/^Medical\s*[-–]\s*/i, '')
    .trim();
}

function bulletsFor(te, talent) {
  if (Array.isArray(te.bullets) && te.bullets.length) return te.bullets.slice(0, 4);
  const skills = (talent?.listedSkills || []).map(cleanSkillLabel).filter(Boolean);
  if (skills.length) return skills.slice(0, 4);
  return ['Available full-time', 'Joins your practice team', 'Ready to interview'];
}

function canvasFor(ratio) {
  if (ratio === '1x1') return { w: 1080, h: 1080, safePad: 0 };
  if (ratio === '9x16') return { w: 1080, h: 1920, safePad: 100 };
  return { w: 1080, h: 1350, safePad: 0 };
}

function gridPattern() {
  return `<pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#00B2E2" stroke-width="1" opacity="0.2"/>
  </pattern>`;
}

function bulletSvg(bullets, pad, startY, size, gap) {
  return bullets
    .map((b, i) => {
      const y = startY + i * gap;
      return `<g transform="translate(${pad}, ${y})">
        <circle cx="13" cy="-7" r="13" fill="#00B2E2"/>
        <path d="M6.5 -7 l3.5 3.4 7-7.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <text class="bullet" x="36" y="0" font-size="${size}">${escXml(b)}</text>
      </g>`;
    })
    .join('');
}

function rolePill(role, pad, y, roleSize, maxW) {
  const pillW = Math.min(maxW, Math.max(200, 44 + role.length * roleSize * 0.55));
  return `
    <rect x="${pad}" y="${y - roleSize + 2}" rx="22" ry="22" width="${pillW}" height="${roleSize + 24}" fill="#0D546B"/>
    <text fill="#FFFFFF" font-family="BeVietnam,Segoe UI,Arial,sans-serif" font-weight="700"
      font-size="${roleSize}" x="${pad + 18}" y="${y + 10}">${escXml(role)}</text>`;
}

/**
 * Build SVG overlay for a Hailey variant (feed / square). Stories use stacked layout.
 */
function buildFeedOverlay(L, te, bullets, variantId) {
  const pad = 52;
  const hire = te.hirePrefix || 'Hire a Virtual';
  const cta = te.cta || 'REQUEST AN INTERVIEW';
  const meetSize = L.h > 1200 ? 54 : 48;
  const roleSize = 24;
  const bulletSize = 23;
  const copyMax = variantId === 'photo-left' ? L.w - 520 - pad : 480;

  const styles = `${fontFaceCss()}
    .meet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#0D546B}
    .hire{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:600;fill:#00B2E2}
    .bullet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:500;fill:#0D546B}
    .cta{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#FFFFFF}
    .plabel{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#0D546B;letter-spacing:0.06em}
    .price{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:800;fill:#00B2E2}
    .pricew{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:800;fill:#FFFFFF}`;

  // Shared copy stack — Hailey DNA: Meet + role + checks + her price/CTA placements
  const hireY = 150;
  const meetY = 210;
  const roleY = 270;
  const ruleY = 310;
  const bulletY = 360;
  const gap = bulletSize + 22;
  const afterBullets = bulletY + bullets.length * gap + 24;

  const priceBox = (x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect width="240" height="90" rx="16" fill="#FFFFFF" stroke="#00B2E2" stroke-width="3.5"/>
      <text class="plabel" x="120" y="30" text-anchor="middle" font-size="14">STARTING AT</text>
      <text class="price" x="120" y="68" text-anchor="middle" font-size="32">$10/hour</text>
    </g>`;

  const priceBar = (x, y) => `
    <g transform="translate(${x}, ${y})">
      <text class="plabel" x="0" y="0" font-size="13">STARTING AT</text>
      <rect y="12" width="280" height="64" rx="14" fill="url(#bar)"/>
      <text class="pricew" x="24" y="55" font-size="30">$10/hour</text>
    </g>`;

  // Hailey burnout: frosted plate on torso — roomy, readable
  const priceOverlay = (x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect width="260" height="100" rx="18" fill="rgba(247,251,255,0.96)" stroke="rgba(0,178,226,0.35)" stroke-width="1.5"/>
      <text class="plabel" x="130" y="34" text-anchor="middle" font-size="14">STARTING AT</text>
      <text class="price" x="130" y="76" text-anchor="middle" font-size="34">$10/hour</text>
    </g>`;

  // Hailey dental: thick cyan ring + deep teal disc + big $10
  const priceCircle = (cx, cy) => `
    <g transform="translate(${cx}, ${cy})">
      <circle r="92" fill="#FFFFFF"/>
      <circle r="86" fill="#00B2E2"/>
      <circle r="76" fill="#0D546B"/>
      <text class="pricew" x="0" y="-34" text-anchor="middle" font-size="13" letter-spacing="0.1em">STARTING AT</text>
      <text class="pricew" x="0" y="18" text-anchor="middle" font-size="48" fill="#FFFFFF">$10</text>
      <text class="pricew" x="0" y="48" text-anchor="middle" font-size="14" letter-spacing="0.08em">PER HOUR</text>
    </g>`;

  const ctaBtn = (x, y, w = 300) => `
    <g transform="translate(${x}, ${y})">
      <rect width="${w}" height="50" rx="12" fill="#0D546B"/>
      <text class="cta" x="20" y="33" font-size="16">${escXml(cta)}</text>
    </g>`;

  const copyBlock = (ox) => `
    <g transform="translate(${ox}, 0)">
      <text class="hire" x="${pad}" y="${hireY}" font-size="22">${escXml(hire)}</text>
      <text class="meet" x="${pad}" y="${meetY}" font-size="${meetSize}">${escXml(te.meetLine)}</text>
      ${rolePill(te.role, pad, roleY, roleSize, copyMax - pad)}
      <rect x="${pad}" y="${ruleY}" width="64" height="5" rx="2.5" fill="#00B2E2"/>
      ${bulletSvg(bullets, pad, bulletY, bulletSize, gap)}
    </g>`;

  let body = '';
  if (variantId === 'photo-left') {
    // Hailey biller — person left, copy + price box right
    const ox = 500;
    body = `
      <rect x="500" y="0" width="580" height="${L.h}" fill="url(#bg)"/>
      <rect x="500" y="0" width="580" height="${L.h}" fill="url(#grid)"/>
      ${copyBlock(ox)}
      ${priceBox(ox + pad, afterBullets)}
      ${ctaBtn(ox + pad, afterBullets + 100, 300)}`;
  } else if (variantId === 'photo-right-cta') {
    // Hailey nurse — price bar left, CTA on person
    body = `
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#bg)"/>
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#grid)"/>
      <rect x="420" y="0" width="80" height="${L.h}" fill="url(#wash)"/>
      ${copyBlock(0)}
      ${priceBar(pad, afterBullets)}
      ${ctaBtn(560, L.h - 110, 300)}`;
  } else if (variantId === 'photo-right-circle') {
    // Hailey dental — CTA left + $10 circle on torso
    body = `
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#bg)"/>
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#grid)"/>
      <rect x="420" y="0" width="80" height="${L.h}" fill="url(#wash)"/>
      ${copyBlock(0)}
      ${ctaBtn(pad, afterBullets, 280)}
      ${priceCircle(790, L.h - 210)}`;
  } else {
    // Hailey burnout flagship — CTA left + frosted price on torso
    body = `
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#bg)"/>
      <rect x="0" y="0" width="500" height="${L.h}" fill="url(#grid)"/>
      <rect x="420" y="0" width="80" height="${L.h}" fill="url(#wash)"/>
      ${copyBlock(0)}
      ${ctaBtn(pad, afterBullets, 300)}
      ${priceOverlay(620, L.h - 220)}`;
  }

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${styles}</style>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7FBFF"/><stop offset="100%" stop-color="#E8F3F9"/>
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F7FBFF" stop-opacity="1"/><stop offset="100%" stop-color="#F7FBFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#077999"/><stop offset="100%" stop-color="#00B2E2"/>
    </linearGradient>
    ${gridPattern()}
  </defs>
  ${body}
</svg>`);
}

function buildStoryOverlay(L, te, bullets) {
  const pad = 56;
  const plateTop = Math.round(L.h * 0.54);
  const hireY = plateTop + 70;
  const meetY = plateTop + 130;
  const roleY = plateTop + 190;
  const ruleY = plateTop + 230;
  const bulletY = plateTop + 280;
  const cta = te.cta || 'REQUEST AN INTERVIEW';
  const hire = te.hirePrefix || 'Hire a Virtual';

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${fontFaceCss()}
      .meet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#0D546B}
      .hire{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:600;fill:#00B2E2}
      .bullet{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:500;fill:#0D546B}
      .cta{font-family:'BeVietnam',Segoe UI,Arial,sans-serif;font-weight:700;fill:#FFFFFF}
    </style>
    <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F7FBFF"/><stop offset="100%" stop-color="#E8F3F9"/>
    </linearGradient>
    ${gridPattern()}
  </defs>
  <rect x="0" y="${plateTop}" width="${L.w}" height="${L.h - plateTop}" fill="url(#plate)"/>
  <rect x="0" y="${plateTop}" width="${L.w}" height="${L.h - plateTop}" fill="url(#grid)" opacity="0.9"/>
  <text class="hire" x="${pad}" y="${hireY}" font-size="24">${escXml(hire)}</text>
  <text class="meet" x="${pad}" y="${meetY}" font-size="56">${escXml(te.meetLine)}</text>
  ${rolePill(te.role, pad, roleY, 26, L.w - pad * 2)}
  <rect x="${pad}" y="${ruleY}" width="72" height="5" rx="2.5" fill="#00B2E2"/>
  ${bulletSvg(bullets.slice(0, 3), pad, bulletY, 24, 46)}
  <g transform="translate(${pad}, ${L.h - 140})">
    <rect width="380" height="56" rx="14" fill="#0D546B"/>
    <text class="cta" x="24" y="36" font-size="18">${escXml(cta)}</text>
  </g>
</svg>`);
}

async function preparePhoto(srcPath, w, h, position = 'attention') {
  return sharp(srcPath)
    .rotate()
    .resize(w, h, { fit: 'cover', position })
    .png()
    .toBuffer();
}

export async function renderTreatmentEAds() {
  const logoBuf = fs.existsSync(LOGO)
    ? await sharp(LOGO).resize({ width: 220, fit: 'inside' }).png().toBuffer()
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

    const bullets = bulletsFor(te, t);

    for (const ratio of ['4x5', '1x1', '9x16']) {
      const L = canvasFor(ratio);
      const isStory = ratio === '9x16';

      for (const variant of HAILEY_VARIANTS) {
        // Stories: one stacked layout (flagship DNA) — skip non-primary to avoid clutter
        if (isStory && !variant.primary) continue;

        const composites = [];
        let overlay;

        if (isStory) {
          const photoH = Math.round(L.h * 0.56);
          const photo = await preparePhoto(src, L.w, photoH, 'attention');
          composites.push({ input: photo, top: L.safePad, left: 0 });
          overlay = buildStoryOverlay(L, te, bullets);
          composites.push({ input: overlay, top: 0, left: 0 });
        } else if (variant.id === 'photo-left') {
          const photoW = 520;
          const photo = await preparePhoto(src, photoW, L.h, 'attention');
          overlay = buildFeedOverlay(L, te, bullets, variant.id);
          composites.push({ input: overlay, top: 0, left: 0 });
          composites.push({ input: photo, top: 0, left: 0 });
        } else {
          // Photo under, then plate + price/CTA on top — more torso for Hailey price treatments
          const photoLeft = 480;
          const photoW = L.w - photoLeft + 20;
          const cropPos =
            variant.id === 'photo-right' || variant.id === 'photo-right-circle'
              ? 'centre'
              : 'attention';
          const photo = await preparePhoto(src, photoW, L.h, cropPos);
          overlay = buildFeedOverlay(L, te, bullets, variant.id);
          composites.push({ input: photo, top: 0, left: photoLeft });
          composites.push({ input: overlay, top: 0, left: 0 });
        }

        if (logoBuf) {
          const meta = await sharp(logoBuf).metadata();
          const lw = meta.width || 200;
          const left =
            variant.id === 'photo-left' || variant.id === 'photo-right-circle'
              ? 36
              : Math.max(36, L.w - 36 - lw);
          composites.push({
            input: logoBuf,
            top: (isStory ? L.safePad : 0) + 36,
            left,
          });
        }

        const outName = variant.primary
          ? `ad-treatment-e-${ratio}.png`
          : `ad-treatment-e-${variant.id}-${ratio}.png`;
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

        if (variant.primary) {
          fs.copyFileSync(outPath, path.join(personDir, `ad-treatment-d-${ratio}.png`));
        }

        outputs.push({
          talentId: t.id,
          slug,
          ratio,
          variant: variant.id,
          path: `/assets/real-people/${slug}/${outName}`,
          file: outPath,
        });
        console.log(`Treatment E ${slug} ${variant.id} ${ratio}`);
      }
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
