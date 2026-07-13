/**
 * MedVirtual Template Test Board — impactful H1 system, face-safe layouts.
 * 3 required templates + 1 optional + phase-2 headshot.
 * No Remotion / Veo / final video.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  PRODUCTION_CONCEPTS,
  FIRST_BATCH_COUNT,
  TEMPLATE_BUCKET_MAP,
} from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(PUBLIC, 'assets');
const LOGO = '/assets/logo/medvirtual-logo.svg';

/**
 * Outcome-first hooks (Meta cleanup). Product label goes in support, not H1.
 * Site-backed claims only: $10/hr · HIPAA-trained · Pre-vetted · Ready in days.
 */
const COPY = {
  front_desk_overload: {
    angle: 'Front Desk Overload',
    hook: 'Missed calls should not pile up.',
    hookAccent: 'pile up',
    support: 'Hire full-time virtual staff through MedVirtual.',
    bullets: ['Calls', 'Scheduling'],
    cta: 'Book a Demo',
  },
  dental: {
    angle: 'Dental Practice Support',
    hook: 'Hire virtual dental admin support.',
    hookAccent: 'dental admin',
    support: 'Scheduling, reminders & insurance coordination.',
    bullets: ['Scheduling', 'Pre-auth'],
    cta: 'Book a Demo',
  },
  insurance_billing: {
    angle: 'Insurance / Billing Support',
    hook: 'Check coverage before appointments.',
    hookAccent: 'coverage',
    support: 'Virtual medical billers · Starting at $10/hour.',
    bullets: ['Verification', 'Billing'],
    cta: 'Book a Demo',
  },
  virtual_med_admin: {
    angle: 'Virtual Medical Admin',
    hook: 'Your virtual medical admin joins the team.',
    hookAccent: 'joins the team',
    support: 'Calls, scheduling, EMR updates & intake.',
    bullets: ['EMR', 'Intake'],
    cta: 'Book a Demo',
  },
  before_after: {
    angle: 'Before/After MedVirtual',
    hook: 'Before overload. After support.',
    hookAccent: 'After support',
    support: 'Hire full-time virtual staff through MedVirtual.',
    bullets: ['Remote', 'Full-time'],
    cta: 'Book a Demo',
  },
  missed_calls: {
    angle: 'Front Desk Overload',
    hook: 'Patient calls should not hit voicemail.',
    hookAccent: 'voicemail',
    support: 'Hire full-time virtual staff through MedVirtual.',
    bullets: ['Calls', 'Scheduling'],
    cta: 'Book a Demo',
  },
  front_desk: {
    angle: 'Front Desk Overload',
    hook: 'Support your overloaded practice team.',
    hookAccent: 'practice team',
    support: 'Hire virtual staff for calls, intake & scheduling.',
    bullets: ['Calls', 'Intake'],
    cta: 'Book a Demo',
  },
  scheduling: {
    angle: 'Dental Practice Support',
    hook: 'Keep dental scheduling moving.',
    hookAccent: 'scheduling',
    support: 'Virtual dental admin · patient reminders.',
    bullets: ['Scheduling', 'Reminders'],
    cta: 'Book a Demo',
  },
  hiring_gap: {
    angle: 'Virtual Medical Admin',
    hook: 'Add a virtual staff member to your team.',
    hookAccent: 'your team',
    support: 'Full-time trained virtual medical staff.',
    bullets: ['HIPAA-trained', 'Ready in days'],
    cta: 'Book a Demo',
  },
  admin_backlog: {
    angle: 'Virtual Medical Admin',
    hook: 'EMR updates & admin — handled remotely.',
    hookAccent: 'handled remotely',
    support: 'Virtual Medical Admin Assistants · $10/hour.',
    bullets: ['EMR', 'Intake'],
    cta: 'Book a Demo',
  },
};

/** Visual styles — $10 stamp only (site-backed). No $7 / $8.5. */
const STYLE_CYCLE = [
  'highlighter',
  'split-red',
  'handwritten',
  'stamp-10',
  'highlighter',
  'split-red',
  'slant-orange',
  'stamp-10',
  'highlighter',
  'handwritten',
  'split-orange',
  'no-cta',
];

/** Shape only — color stays teal/green. */
const CTA_SHAPES = ['pill', 'rounded', 'soft', 'square', 'outline', 'deep'];

function styleFor(item, index) {
  if (item.style) return item.style;
  if (item.phase === 'phase_2') {
    return ['highlighter', 'stamp-10', 'split-red', 'no-cta'][index % 4];
  }
  return STYLE_CYCLE[index % STYLE_CYCLE.length];
}

function ctaLabel(copy, style) {
  if (style === 'no-cta') return '';
  if (copy.ctaOverride) return copy.ctaOverride;
  return copy.cta || 'Book a Demo';
}

function ctaShape(style, index) {
  if (style === 'no-cta') return '';
  return CTA_SHAPES[index % CTA_SHAPES.length];
}

function cropExtract(meta, targetW, targetH, focalX = 0.5, focalY = 0.35) {
  const targetAspect = targetW / targetH;
  const { width: srcW, height: srcH } = meta;
  const srcAspect = srcW / srcH;
  let cropW, cropH, cropX, cropY;
  if (srcAspect > targetAspect) {
    cropH = srcH;
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) * focalX);
    cropY = 0;
  } else {
    cropW = srcW;
    cropH = Math.round(srcW / targetAspect);
    cropX = 0;
    cropY = Math.round((srcH - cropH) * focalY);
  }
  return { left: cropX, top: cropY, width: cropW, height: cropH };
}

async function ensureCrop(sourceFile, folder, outRel, w, h, focalX, focalY) {
  const outPath = path.join(PUBLIC, outRel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const inputPath = path.join(ASSETS, folder, sourceFile);
  const meta = await sharp(inputPath).metadata();
  const extract = cropExtract(meta, w, h, focalX, focalY);
  await sharp(inputPath).extract(extract).resize(w, h).png({ quality: 90 }).toFile(outPath);
  return outRel;
}

/** Per-asset 1x1 overrides — LP_001 source has extra headroom above the hair */
const HEADSHOT_1X1_CROP = {
  LP_001: { zoom: 0.78, focalY: 0.82 },
};

/**
 * Headshot trust card: portrait flush to bottom edge, white band above for logo/H1/CTA.
 * LP masters sit low in-frame — crop out top headroom so faces read higher.
 */
async function ensureHeadshot(sourceFile, id, ratio) {
  const folder = ratio === '9x16' ? 'story-9x16' : ratio === '1x1' ? 'square-1x1' : 'feed-4x5';
  const dims = ratio === '9x16' ? [1080, 1920] : ratio === '1x1' ? [1080, 1080] : [1080, 1350];
  const outRel = `/exports/image-tests/${folder}/IMG_${id}_${ratio.toUpperCase()}_WHITE_TEXT_TOP.png`;
  const outPath = path.join(PUBLIC, outRel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const [targetW, targetH] = dims;

  // Full-bleed width, flush to bottom — 1x1 needs a taller white band for logo + H1
  const bandRatio = ratio === '9x16' ? 0.28 : ratio === '1x1' ? 0.24 : 0.26;
  const portraitH = Math.round(targetH * (1 - bandRatio));
  const left = 0;
  const top = targetH - portraitH;

  const inputPath = path.join(ASSETS, 'landing-page-images', sourceFile);
  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width;
  const srcH = meta.height;
  const override = ratio === '1x1' ? HEADSHOT_1X1_CROP[id] : null;
  // Trim LP top headroom; 1x1 uses south gravity so empty source-top is cropped away
  const zoom = override?.zoom ?? (ratio === '1x1' ? 0.90 : 0.86);
  const focalY = override?.focalY ?? (ratio === '1x1' ? 0.55 : 0.55);
  const cropSize = Math.round(Math.min(srcW, srcH) * zoom);
  const cropLeft = Math.round((srcW - cropSize) / 2);
  const cropTop = Math.max(0, Math.min(srcH - cropSize, Math.round((srcH - cropSize) * focalY)));
  const coverPos = ratio === '1x1' ? 'south' : 'north';

  const portraitBuf = await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .resize(targetW, portraitH, { fit: 'cover', position: coverPos })
    .png()
    .toBuffer();

  await sharp({
    create: { width: targetW, height: targetH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: portraitBuf, left, top }])
    .png()
    .toFile(outPath);
  return outRel;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function t(opts) {
  const bucketId = opts.testBucket || TEMPLATE_BUCKET_MAP[opts.id] || 'virtual_med_admin';
  const mediaType =
    opts.mediaType ||
    (opts.ratio === '9x16' && (bucketId === 'before_after' || opts.ronaldJinCandidate === 'yes')
      ? 'video'
      : 'static');
  return {
    layoutRating: 'A',
    faceSafe: 'yes',
    textReadable: 'yes',
    metaSafe: 'yes',
    priceClaim: 'none',
    hipaaClaim: 'none',
    animationReady: 'yes',
    ronaldJinCandidate: 'no',
    phase: 'first_batch',
    manualRatioAdjust: 'no',
    firstFrameHookArea: 'top',
    textRevealOrder: 'H1 → support → bullets → CTA',
    ctaTiming: 'Appear at ~8s; hold through end',
    motionNote: 'Light Ken Burns 4–6%. Keep face clear.',
    editorNote: 'VO / practice-ops POV only. No fake testimonial.',
    testBucket: bucketId,
    mediaType,
    ...opts,
  };
}

async function buildTests() {
  // Ensure ratios for strongest assets
  await ensureCrop('ai-generated-03.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_003_9X16_SUBJECT_LEFT.png', 1080, 1920, 0.28, 0.3);
  await ensureCrop('ai-generated-03.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_003_1X1_FACE_CENTER.png', 1080, 1080, 0.32, 0.32);
  await ensureCrop('ai-generated-10.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_010_9X16_SUBJECT_LEFT.png', 1080, 1920, 0.28, 0.3);
  await ensureCrop('ai-generated-10.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_010_1X1_FACE_CENTER.png', 1080, 1080, 0.32, 0.32);
  await ensureCrop('ai-generated-15.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_015_1X1_FACE_LEFT.png', 1080, 1080, 0.3, 0.3);
  await ensureCrop('ai-generated-07.png', 'ai-images', '/exports/image-tests/feed-4x5/IMG_AI_007_4X5_FACE_RIGHT.png', 1080, 1350, 0.72, 0.3);
  await ensureCrop('ai-generated-07.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_007_9X16_SUBJECT_RIGHT.png', 1080, 1920, 0.72, 0.28);
  await ensureCrop('ai-generated-07.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_007_1X1_FACE_CENTER.png', 1080, 1080, 0.65, 0.32);
  await ensureCrop('ai-generated-13.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_013_1X1_FACE_RIGHT.png', 1080, 1080, 0.68, 0.3);
  await ensureCrop('ai-generated-14.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_014_1X1_FACE_RIGHT.png', 1080, 1080, 0.68, 0.3);
  await ensureCrop('ai-generated-04.png', 'ai-images', '/exports/image-tests/feed-4x5/IMG_AI_004_4X5_FACE_RIGHT.png', 1080, 1350, 0.72, 0.28);
  await ensureCrop('ai-generated-04.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_004_9X16_SUBJECT_RIGHT.png', 1080, 1920, 0.72, 0.28);
  await ensureCrop('ai-generated-04.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_004_1X1_FACE_CENTER.png', 1080, 1080, 0.68, 0.32);
  await ensureCrop('ai-generated-08.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_008_9X16_SUBJECT_CENTER.png', 1080, 1920, 0.55, 0.38);
  await ensureCrop('ai-generated-08.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_008_1X1_SUBJECT_CENTER.png', 1080, 1080, 0.55, 0.4);
  await ensureCrop('ai-generated-09.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_009_1X1_FACE_CENTER.png', 1080, 1080, 0.32, 0.32);

  // Rebuild all headshot trust cards (full face, white band above, CTA clearance)
  const headshots = [
    { id: 'LP_001', file: 'assistant.avif', label: 'Front Desk Backup' },
    { id: 'LP_002', file: 'biller.avif', label: 'Payroll Pressure' },
    { id: 'LP_003', file: 'casecoord.avif', label: 'Follow-Up' },
    { id: 'LP_004', file: 'general.avif', label: 'Staffing Gap' },
    { id: 'LP_005', file: 'nurse.avif', label: 'Follow-Up' },
  ];
  for (const hs of headshots) {
    await ensureHeadshot(hs.file, hs.id, '4x5');
    await ensureHeadshot(hs.file, hs.id, '1x1');
    await ensureHeadshot(hs.file, hs.id, '9x16');
  }

  // Extra Template 1 ratios
  await ensureCrop('ai-generated-10.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_010_1X1_FACE_CENTER.png', 1080, 1080, 0.32, 0.32);
  await ensureCrop('ai-generated-15.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_015_1X1_FACE_LEFT.png', 1080, 1080, 0.22, 0.22);
  await ensureCrop('ai-generated-09.png', 'ai-images', '/exports/image-tests/square-1x1/IMG_AI_009_1X1_FACE_CENTER.png', 1080, 1080, 0.32, 0.32);
  // AI_015 zoomed out + lower for FD2
  await ensureCrop('ai-generated-15.png', 'ai-images', '/exports/image-tests/feed-4x5/IMG_AI_015_4X5_FACE_LEFT.png', 1080, 1350, 0.32, 0.22);
  await ensureCrop('ai-generated-15.png', 'ai-images', '/exports/image-tests/story-9x16/IMG_AI_015_9X16_SUBJECT_LEFT.png', 1080, 1920, 0.32, 0.18);

  const trustCopy = {
    angle: 'Trust / Team (Phase 2)',
    hook: 'Pre-vetted medical virtual assistants.',
    hookAccent: 'Pre-vetted',
    support: 'HIPAA-trained support · Ready in days.',
    bullets: [],
    cta: 'Book a Demo',
  };

  return [
    // ── TEMPLATE 1: PERSON_LEFT_HOOK_RIGHT ──
    t({
      id: 'T1-MC-45',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_003_4X5_FACE_LEFT.png',
      imageId: 'IMG_AI_003_4X5_FACE_LEFT',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.missed_calls,
      modifiers: 'text-panel',
      style: 'highlighter',
      priceClaim: 'none',
      hipaaClaim: 'none',
      ronaldJinCandidate: 'yes',
      notes: 'TOP 5 · RONALD/JIN PROTOTYPE CANDIDATE (4:5). Outcome hook + face clear.',
      firstFrameHookArea: 'top-right',
      editorNote: 'First cold static winner. Remotion STATIC_TO_SHORT seed. Practice-ops VO only.',
    }),
    t({
      id: 'T1-MC-916',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_003_9X16_SUBJECT_LEFT.png',
      imageId: 'IMG_AI_003_9X16_SUBJECT_LEFT',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.missed_calls,
      modifiers: 'text-panel',
      style: 'split-red',
      priceClaim: 'none',
      hipaaClaim: 'none',
      ronaldJinCandidate: 'yes',
      testBucket: 'before_after',
      mediaType: 'video',
      notes: 'TOP 5 · Before/After video prototype. First-frame hook for Reels.',
      firstFrameHookArea: 'top',
      motionNote: 'Hold H1 2s. Reveal support. CTA last 4s. 18–22s. Simple text reveal + light zoom.',
    }),
    t({
      id: 'T1-MC-11',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_003_1X1_FACE_CENTER.png',
      imageId: 'IMG_AI_003_1X1_FACE_CENTER',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.missed_calls,
      layoutRating: 'B',
      modifiers: 'text-panel',
      style: 'highlighter',
      notes: '1x1 works but tighter. Shorten H1 if needed.',
      manualRatioAdjust: 'maybe — shorten H1 on square',
    }),
    t({
      id: 'T1-FD-45',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_010_4X5_FACE_LEFT.png',
      imageId: 'IMG_AI_010_4X5_FACE_LEFT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.front_desk,
      modifiers: 'text-panel',
      style: 'split-red',
      priceClaim: 'none',
      notes: 'TOP 5 · Front desk backup. Clean right text zone.',
    }),
    t({
      id: 'T1-FD-916',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_010_9X16_SUBJECT_LEFT.png',
      imageId: 'IMG_AI_010_9X16_SUBJECT_LEFT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.dental,
      modifiers: 'text-panel',
      style: 'stamp-10',
      priceClaim: 'site_$10',
      testBucket: 'dental_practice',
      notes: 'Dental practice vertical. $10/hr site-backed.',
    }),
    t({
      id: 'T1-FD-11',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_010_1X1_FACE_CENTER.png',
      imageId: 'IMG_AI_010_1X1_FACE_CENTER',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.front_desk,
      layoutRating: 'B',
      modifiers: 'text-panel',
      style: 'handwritten',
      notes: 'Template 1 square test — AI_010.',
    }),
    t({
      id: 'T1-FD2-45',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_015_4X5_FACE_LEFT.png',
      imageId: 'IMG_AI_015_4X5_FACE_LEFT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.front_desk,
      modifiers: 'text-panel drop-more zoom-out',
      style: 'highlighter',
      priceClaim: 'none',
      notes: 'TOP 5 · Front desk alt (AI_015). Dropped + zoomed out.',
    }),
    t({
      id: 'T1-FD2-916',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_015_9X16_SUBJECT_LEFT.png',
      imageId: 'IMG_AI_015_9X16_SUBJECT_LEFT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.front_desk,
      modifiers: 'text-panel drop-more zoom-out',
      style: 'split-red',
      notes: 'Hispanic VA vertical — dropped + zoomed out. Support chip for readability.',
    }),
    t({
      id: 'T1-FD2-11',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_015_1X1_FACE_LEFT.png',
      imageId: 'IMG_AI_015_1X1_FACE_LEFT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'left',
      copy: COPY.front_desk,
      layoutRating: 'B',
      modifiers: 'text-panel drop-more zoom-out copy-far-right shift-left',
      style: 'stamp-10',
      notes: 'Square: image dropped + shifted left; copy far right to clear face.',
    }),
    t({
      id: 'T1-SCH-45',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_009_4X5_FACE_LEFT.png',
      imageId: 'IMG_AI_009_4X5_FACE_LEFT',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.scheduling,
      layoutRating: 'B',
      modifiers: 'text-panel copy-far-right',
      style: 'highlighter',
      priceClaim: 'none',
      notes: 'TOP 5 · Scheduling. Text farther right to clear face.',
      motionNote: 'Simplify/hide floating icons in edit.',
    }),
    t({
      id: 'T1-SCH-916',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_009_9X16_SUBJECT_LEFT.png',
      imageId: 'IMG_AI_009_9X16_SUBJECT_LEFT',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.scheduling,
      layoutRating: 'B',
      modifiers: 'text-panel copy-far-right',
      style: 'handwritten',
      notes: 'Scheduling vertical. Text farther right.',
    }),
    t({
      id: 'T1-SCH-11',
      template: 'PERSON_LEFT_HOOK_RIGHT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_009_1X1_FACE_CENTER.png',
      imageId: 'IMG_AI_009_1X1_FACE_CENTER',
      imageFamily: 'teal_blouse_admin',
      subjectSide: 'left',
      copy: COPY.scheduling,
      layoutRating: 'B',
      modifiers: 'text-panel copy-far-right',
      style: 'stamp-10',
      notes: 'Template 1 square test — AI_009.',
    }),

    // ── TEMPLATE 2: PERSON_RIGHT_HOOK_LEFT ──
    t({
      id: 'T2-RMA-45',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_007_4X5_FACE_RIGHT.png',
      imageId: 'IMG_AI_007_4X5_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      modifiers: 'text-panel-wide',
      style: 'highlighter',
      priceClaim: 'site_$10',
      hipaaClaim: 'site_trained',
      notes: 'TOP 5 · Hiring gap. Pre-vetted + $10/hr (site-backed).',
      firstFrameHookArea: 'top-left',
      editorNote: 'Practice-ops VO only — not fake testimonial.',
    }),
    t({
      id: 'T2-RMA-916',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_007_9X16_SUBJECT_RIGHT.png',
      imageId: 'IMG_AI_007_9X16_SUBJECT_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      modifiers: 'text-panel-wide',
      priceClaim: 'site_$10',
      hipaaClaim: 'site_trained',
      notes: 'Hiring gap vertical. Strong video family (secondary to Missed Calls prototype).',
      firstFrameHookArea: 'top',
      motionNote: 'H1 hold → support → CTA. 18–22s.',
      editorNote: 'Practice-ops VO only.',
    }),
    t({
      id: 'T2-RMA-11',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_007_1X1_FACE_CENTER.png',
      imageId: 'IMG_AI_007_1X1_FACE_CENTER',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      layoutRating: 'B',
      modifiers: 'text-panel-wide',
      notes: '1x1 usable. H1 may need shortening.',
      manualRatioAdjust: 'maybe — shorten H1',
    }),
    t({
      id: 'T2-RMA2-45',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_013_4X5_FACE_RIGHT.png',
      imageId: 'IMG_AI_013_4X5_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      notes: 'Copy bottom-left. CTA top-left under logo.',
    }),
    t({
      id: 'T2-RMA2-916',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_013_9X16_SUBJECT_RIGHT.png',
      imageId: 'IMG_AI_013_9X16_SUBJECT_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      notes: 'Copy bottom-left. CTA top-left. Logo stays top.',
    }),
    t({
      id: 'T2-RMA2-11',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_013_1X1_FACE_RIGHT.png',
      imageId: 'IMG_AI_013_1X1_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.hiring_gap,
      layoutRating: 'B',
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      notes: '1x1 — copy bottom-left, CTA top-left.',
    }),
    t({
      id: 'T2-ADM-45',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_014_4X5_FACE_RIGHT.png',
      imageId: 'IMG_AI_014_4X5_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.admin_backlog,
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      priceClaim: 'none',
      notes: 'TOP 5 · Admin backlog. Copy bottom-left. CTA top-left under logo.',
    }),
    t({
      id: 'T2-ADM-916',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_014_9X16_SUBJECT_RIGHT.png',
      imageId: 'IMG_AI_014_9X16_SUBJECT_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.admin_backlog,
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      notes: 'Copy bottom-left. CTA top-left. Keep monitor UI generic.',
    }),
    t({
      id: 'T2-ADM-11',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_014_1X1_FACE_RIGHT.png',
      imageId: 'IMG_AI_014_1X1_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.admin_backlog,
      layoutRating: 'B',
      modifiers: 'text-panel-wide copy-bl-cta-tl',
      notes: '1x1 — copy bottom-left, CTA top-left.',
    }),
    t({
      id: 'T2-WF-45',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_004_4X5_FACE_RIGHT.png?v=2',
      imageId: 'IMG_AI_004_4X5_FACE_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.insurance_billing,
      layoutRating: 'B',
      modifiers: 'text-panel-wide copy-down',
      testBucket: 'insurance_billing',
      notes: 'AI_004 workflow 4:5 — insurance/billing angle.',
    }),
    t({
      id: 'T2-WF-916',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_004_9X16_SUBJECT_RIGHT.png',
      imageId: 'IMG_AI_004_9X16_SUBJECT_RIGHT',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.insurance_billing,
      layoutRating: 'B',
      modifiers: 'text-panel-wide copy-down',
      testBucket: 'insurance_billing',
      mediaType: 'video',
      notes: 'Stories/Reels — insurance verification. Video candidate.',
    }),
    t({
      id: 'T2-WF-11',
      template: 'PERSON_RIGHT_HOOK_LEFT',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_004_1X1_FACE_CENTER.png',
      imageId: 'IMG_AI_004_1X1_FACE_CENTER',
      imageFamily: 'blue_scrubs_headset',
      subjectSide: 'right',
      copy: COPY.insurance_billing,
      layoutRating: 'B',
      modifiers: 'text-panel-wide copy-down',
      testBucket: 'insurance_billing',
      notes: '1x1 Meta/carousel — insurance/billing.',
    }),

    // ── TEMPLATE 3: CENTER_TOP_BAND ──
    t({
      id: 'T3-CTR-45',
      template: 'CENTER_TOP_BAND',
      ratio: '4x5',
      image: '/exports/image-tests/feed-4x5/IMG_AI_008_4X5_SUBJECT_CENTER.png',
      imageId: 'IMG_AI_008_4X5_SUBJECT_CENTER',
      imageFamily: 'wide_office',
      subjectSide: 'center',
      copy: COPY.admin_backlog,
      layoutRating: 'B',
      modifiers: 'copy-down logo-center',
      notes: 'Logo centered. H1/support dropped below logo clearance.',
      firstFrameHookArea: 'top-center',
    }),
    t({
      id: 'T3-CTR-916',
      template: 'CENTER_TOP_BAND',
      ratio: '9x16',
      image: '/exports/image-tests/story-9x16/IMG_AI_008_9X16_SUBJECT_CENTER.png',
      imageId: 'IMG_AI_008_9X16_SUBJECT_CENTER',
      imageFamily: 'wide_office',
      subjectSide: 'center',
      copy: COPY.admin_backlog,
      layoutRating: 'B',
      modifiers: 'copy-down logo-center',
      notes: 'Logo centered. H1 dropped. Verify headroom.',
      manualRatioAdjust: 'yes — verify headroom on 9:16',
    }),
    t({
      id: 'T3-CTR-11',
      template: 'CENTER_TOP_BAND',
      ratio: '1x1',
      image: '/exports/image-tests/square-1x1/IMG_AI_008_1X1_SUBJECT_CENTER.png',
      imageId: 'IMG_AI_008_1X1_SUBJECT_CENTER',
      imageFamily: 'wide_office',
      subjectSide: 'center',
      copy: COPY.admin_backlog,
      layoutRating: 'B',
      modifiers: 'copy-down logo-center',
      notes: '1x1 Meta/carousel size for center band.',
    }),

    // TEMPLATE 4 LAPTOP_EXPLAINER — parked for now (not on board)

    // ── PHASE 2: HEADSHOT_TRUST — full Meta trio per role: 4:5 · 1:1 · 9:16 ──
    // T5-LP_001-11 removed for now (1x1 only)
    ...headshots.flatMap((hs) => {
      const base = {
        template: 'HEADSHOT_TRUST_CARD',
        imageFamily: 'landing_headshot',
        subjectSide: 'center',
        copy: { ...trustCopy, angle: `Trust / Team — ${hs.label} (Phase 2)` },
        layoutRating: 'B',
        animationReady: 'low',
        phase: 'phase_2',
        editorNote: 'Retargeting / trust later. Not first cold batch.',
      };
      const cards = [
        t({
          ...base,
          id: `T5-${hs.id}-45`,
          ratio: '4x5',
          image: `/exports/image-tests/feed-4x5/IMG_${hs.id}_4X5_WHITE_TEXT_TOP.png`,
          imageId: `IMG_${hs.id}_4X5_WHITE_TEXT_TOP`,
          notes: `4:5 Feed — ${hs.label}. Logo + H1 + CTA. Portrait flush bottom.`,
        }),
      ];
      if (hs.id !== 'LP_001') {
        cards.push(
          t({
            ...base,
            id: `T5-${hs.id}-11`,
            ratio: '1x1',
            image: `/exports/image-tests/square-1x1/IMG_${hs.id}_1X1_WHITE_TEXT_TOP.png`,
            imageId: `IMG_${hs.id}_1X1_WHITE_TEXT_TOP`,
            notes: `1:1 carousel/Marketplace — ${hs.label}.`,
            editorNote: 'Retargeting / trust later.',
          }),
        );
      }
      cards.push(
        t({
          ...base,
          id: `T5-${hs.id}-916`,
          ratio: '9x16',
          image: `/exports/image-tests/story-9x16/IMG_${hs.id}_9X16_WHITE_TEXT_TOP.png`,
          imageId: `IMG_${hs.id}_9X16_WHITE_TEXT_TOP`,
          notes: `9:16 Stories/Reels — ${hs.label}.`,
          editorNote: 'Retargeting / trust later.',
        }),
      );
      return cards;
    }),
  ];
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #0b1220; color: #e2e8f0; }
  .stats { display: flex; flex-wrap: wrap; gap: 1.25rem; padding: 1rem 2rem; background: #111827; border-bottom: 1px solid #1f2937; }
  .stat strong { display: block; font-size: 1.2rem; color: #f1f5f9; }
  .stat { font-size: 0.78rem; color: #94a3b8; }
  .section-head { padding: 1.75rem 2rem 0.4rem; border-top: 1px solid #1f2937; }
  .section-head h2 { font-size: 1.1rem; color: #f8fafc; }
  .section-head p { font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.5rem; padding: 1rem 2rem 3rem; }
  .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; }
  .mock { position: relative; width: 100%; background: #020617; overflow: hidden; }
  .mock.r-4x5 { aspect-ratio: 4/5; }
  .mock.r-9x16 { aspect-ratio: 9/16; max-height: 580px; margin: 0 auto; }
  .mock.r-1x1 { aspect-ratio: 1/1; }
  .mock img.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center center; }
  /* Soft top readability wash — opaque white like T2-ADM-11 */
  .mock .wash { position: absolute; left: 0; right: 0; top: 0; height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.18) 72%, rgba(255,255,255,0) 100%);
    z-index: 2; pointer-events: none; }
  .mock.tpl-right .wash {
    height: 48%;
    background: linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.62) 40%, rgba(255,255,255,0.22) 70%, transparent 100%);
  }
  .mock.tpl-center .wash, .mock.tpl-explainer .wash {
    height: 38%;
    background: linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
  }
  .mock.tpl-trust .wash { display: none; }

  /* PERSON_LEFT: drop image ~1" (4:5) / ~2" (9:16) + white fade at top so H1 clears face */
  .tpl-left img.bg {
    top: auto; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center 28%;
    transform: translateY(7%);
  }
  .tpl-left.r-9x16 img.bg {
    object-position: center 22%;
    transform: translateY(11%);
  }
  .tpl-left.r-1x1 img.bg {
    transform: translateY(5%);
    object-position: center 30%;
  }
  .tpl-left .top-fade {
    position: absolute; left: 0; right: 0; top: 0; height: 18%;
    background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 100%);
    z-index: 2; pointer-events: none;
  }
  .tpl-left.r-9x16 .top-fade { height: 22%; }

  /* Modifiers — opaque white panels sized like T2-ADM-11 */
  .mock.text-panel .wash, .mock.text-panel-wide .wash {
    height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 38%, rgba(255,255,255,0.28) 70%, transparent 100%);
  }
  .mock.tpl-left.text-panel .wash {
    left: 30%; right: 0; width: auto; height: 56%;
    background: linear-gradient(225deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 30%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.12) 82%, transparent 100%);
  }
  /* Extra wash depth when image is dropped (FD2) — support line sits lower */
  .mock.tpl-left.text-panel.drop-more .wash {
    height: 60%;
    background: linear-gradient(225deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.88) 26%, rgba(255,255,255,0.55) 52%, rgba(255,255,255,0.18) 78%, transparent 100%);
  }
  .mock.tpl-right.text-panel-wide .wash {
    right: 26%; left: 0; width: auto; height: 52%;
    background: linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.78) 36%, rgba(255,255,255,0.28) 70%, transparent 100%);
  }
  .mock.drop-more img.bg { transform: translateY(14%) !important; }
  .mock.drop-more.r-9x16 img.bg { transform: translateY(18%) !important; object-position: center 18% !important; }
  .mock.zoom-out img.bg {
    width: 100%; height: 100%;
    transform: translateY(10%) scale(0.9) !important;
    transform-origin: center bottom;
  }
  .mock.drop-more.zoom-out img.bg {
    transform: translateY(16%) scale(0.88) !important;
    transform-origin: center bottom;
  }
  .mock.drop-more.zoom-out.r-9x16 img.bg {
    transform: translateY(20%) scale(0.86) !important;
    transform-origin: center bottom;
    object-position: center 20% !important;
  }
  .mock.copy-far-right .copy { left: 52% !important; right: 3% !important; }
  .mock.shift-left img.bg { object-position: 28% center !important; }
  .mock.r-1x1.drop-more.zoom-out.shift-left img.bg {
    transform: translateY(14%) translateX(-6%) scale(0.9) !important;
    transform-origin: left bottom;
    object-position: 22% 30% !important;
  }
  .mock.copy-down .copy { top: 14% !important; }
  .mock.copy-down.r-9x16 .copy { top: 16% !important; }
  .mock.tpl-center.copy-down .copy, .mock.tpl-explainer.copy-down .copy { top: 13% !important; }
  .mock.tpl-center.copy-down.r-9x16 .copy { top: 15% !important; }
  .mock.logo-center .logo-wrap { left: 50% !important; transform: translateX(-50%); }
  .mock.text-bottom .copy {
    top: auto !important; bottom: 14% !important; left: 5% !important; right: 5% !important;
  }
  .mock.text-bottom .wash {
    top: auto; bottom: 0; height: 42%;
    background: linear-gradient(0deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.12) 78%, transparent 100%);
  }
  .mock.text-bottom .cta { bottom: 4.5% !important; }

  /* Copy bottom-left + CTA top-left (below logo) — T2-RMA2 / T2-ADM */
  .mock.copy-bl-cta-tl .copy {
    top: auto !important; bottom: 6% !important;
    left: 4% !important; right: 38% !important;
  }
  .mock.copy-bl-cta-tl .wash {
    top: auto; bottom: 0; height: 52%; left: 0; right: 26%; width: auto;
    background: linear-gradient(0deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.7) 42%, rgba(255,255,255,0.18) 78%, transparent 100%);
  }
  .mock.copy-bl-cta-tl .cta {
    top: 13% !important; bottom: auto !important;
    left: 4% !important; right: auto !important;
  }
  .mock.copy-bl-cta-tl.r-9x16 .cta { top: 14% !important; }
  .mock.copy-bl-cta-tl.r-1x1 .cta { top: 14% !important; }
  .mock.copy-bl-cta-tl.r-9x16 .copy { bottom: 7% !important; right: 32% !important; }
  .mock.copy-bl-cta-tl.r-1x1 .copy { bottom: 6% !important; right: 36% !important; }

  /* Logo — plain SVG on wash, not a button/plate */
  .mock .logo-wrap {
    position: absolute; top: 2.4%; left: 3.2%; z-index: 5;
    display: inline-flex; align-items: center;
    background: transparent;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
  .mock .logo {
    position: static; display: block;
    height: 32px; width: auto; max-width: min(220px, 44vw);
    object-fit: contain;
  }
  .mock .logo.left, .mock .logo.right { left: auto; right: auto; }
  .tpl-left.r-9x16 .logo-wrap, .tpl-right.r-9x16 .logo-wrap { top: 2.2%; }
  .tpl-left.r-9x16 .logo, .tpl-right.r-9x16 .logo { height: 26px; }
  .r-4x5 .logo { height: 34px; }
  .r-1x1 .logo { height: 30px; }
  .tpl-center .logo-wrap, .tpl-trust .logo-wrap {
    left: 50%; transform: translateX(-50%);
  }
  .tpl-trust .logo-wrap { top: 2.5%; padding: 0; }
  .tpl-trust .logo { height: 30px; max-width: min(220px, 48vw); }
  .mock.logo-center .logo-wrap { left: 50% !important; transform: translateX(-50%); }
  .mock .copy { position: absolute; z-index: 4; display: flex; flex-direction: column; gap: 0.4em; }
  .mock .hook {
    font-weight: 800; color: #0f172a; line-height: 1.08; letter-spacing: -0.03em;
    text-wrap: balance;
  }
  .mock .hook .accent {
    color: #0d9488;
  }
  .mock .support {
    font-weight: 650; color: #0f172a; line-height: 1.3;
    background: rgba(255,255,255,0.88);
    padding: 0.28em 0.55em;
    border-radius: 6px;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    text-shadow: none;
  }
  .mock .bullets { list-style: none; display: flex; flex-wrap: wrap; gap: 0.35em; margin-top: 0.15em; }
  .mock .bullets li {
    font-weight: 700; color: #0f766e; background: rgba(255,255,255,0.92);
    padding: 0.28em 0.65em; border-radius: 999px; border: 1px solid rgba(13,148,136,0.35);
    font-size: inherit;
  }
  /* CTA — brand teal/green only. Shape varies; color stays in palette. */
  .mock .cta {
    display: inline-block; background: #0d9488; color: #fff; font-weight: 800;
    padding: 0.55em 1.15em; border-radius: 999px; letter-spacing: -0.01em;
    box-shadow: 0 3px 10px rgba(13,148,136,0.28);
    border: none; text-transform: none;
  }
  .cta-shape-pill .cta { border-radius: 999px; }
  .cta-shape-rounded .cta { border-radius: 10px; }
  .cta-shape-soft .cta { border-radius: 6px; padding: 0.5em 1.05em; }
  .cta-shape-square .cta { border-radius: 2px; letter-spacing: 0.02em; text-transform: uppercase; font-size: 0.92em; }
  .cta-shape-outline .cta {
    background: rgba(255,255,255,0.92); color: #0f766e;
    border: 2px solid #0d9488; box-shadow: none; border-radius: 999px;
  }
  .cta-shape-deep .cta { background: #0f766e; border-radius: 999px; }
  .style-no-cta .cta { display: none; }
  .phase-tag { position: absolute; top: 10%; right: 3%; z-index: 6; background: #9a3412; color: #ffedd5;
    font-size: 10px; font-weight: 800; padding: 0.25em 0.55em; border-radius: 4px; letter-spacing: 0.04em; }

  /* ── Style variations (boss review) — spacing unchanged ── */
  .style-highlighter .support {
    background: #a3e635; color: #14532d; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.04em;
    box-shadow: 0 0 0 3px rgba(163,230,53,0.65);
    transform: rotate(-1.5deg);
    border-radius: 2px;
  }
  .style-neon-cyan .support {
    background: #67e8f9; color: #164e63; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.02em;
    box-shadow: 0 0 12px rgba(103,232,249,0.55);
    transform: rotate(-1deg);
  }
  .style-handwritten .support {
    font-family: 'Segoe Print', 'Comic Sans MS', cursive;
    font-weight: 800; color: #9a3412; background: #fef3c7;
    text-transform: uppercase; letter-spacing: 0.03em;
    transform: rotate(-2deg); border: 2px dashed #f59e0b;
  }
  .style-checks .bullets li {
    color: #166534; background: #fff; border-color: #86efac;
  }
  .style-checks .bullets li::before {
    content: '✓ '; color: #16a34a; font-weight: 900;
  }

  .mock .support,
  .mock .support-split {
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  .mock .support-split {
    display: inline-flex; flex-wrap: wrap; gap: 0; align-items: stretch;
    transform-origin: left center; font-weight: 900; line-height: 1.2;
    font-size: inherit; border-radius: 4px; overflow: hidden;
  }
  .mock .support-split .a, .mock .support-split .b {
    padding: 0.28em 0.55em;
  }
  .style-split-orange .support-split .a { color: #ea580c; background: #fff; }
  .style-split-orange .support-split .b { color: #fff; background: #ea580c; }
  .style-split-red .support-split .a { color: #dc2626; background: #fff; }
  .style-split-red .support-split .b { color: #fff; background: #dc2626; }
  .style-slant-orange .support-split {
    transform: rotate(-3deg);
  }
  .style-slant-orange .support-split .a { color: #ea580c; background: #fff; }
  .style-slant-orange .support-split .b { color: #fff; background: #c2410c; }

  .mock .rate-stamp {
    position: absolute; z-index: 6;
    width: 7em; height: 7em; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-weight: 900; line-height: 1; text-align: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.28);
    border: 4px solid rgba(255,255,255,0.95);
    gap: 0.18em;
  }
  .mock .rate-stamp .price {
    font-size: 1.85em; letter-spacing: -0.04em; line-height: 1;
    white-space: nowrap;
  }
  .mock .rate-stamp .hr {
    font-size: 0.72em; font-weight: 900; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: 0.95;
  }
  .style-stamp-10 .rate-stamp { background: #0d9488; color: #fff; }
  .tpl-left .rate-stamp { bottom: 11%; left: 3%; }
  .tpl-right .rate-stamp { bottom: 11%; right: 3%; }
  .tpl-center .rate-stamp, .tpl-explainer .rate-stamp { bottom: 11%; right: 4%; }
  .tpl-trust .rate-stamp { bottom: 10%; right: 5%; }
  .r-9x16 .rate-stamp { width: 6.2em; height: 6.2em; }
  .r-1x1 .rate-stamp { width: 6em; height: 6em; bottom: 13%; }

  .style-badge { display: inline-block; font-size: 0.64rem; font-weight: 800; padding: 0.18rem 0.5rem;
    border-radius: 4px; margin: 0.3rem 0.25rem 0 0; background: #312e81; color: #c7d2fe; }
  .bucket-tag {
    display: inline-block; font-size: 0.64rem; font-weight: 800; padding: 0.2rem 0.5rem;
    border-radius: 4px; margin: 0.3rem 0.25rem 0 0; color: #fff;
  }
  .media-tag {
    display: inline-block; font-size: 0.64rem; font-weight: 800; padding: 0.2rem 0.5rem;
    border-radius: 4px; margin: 0.3rem 0.25rem 0 0;
  }
  .media-tag.static { background: #1e3a5f; color: #bfdbfe; }
  .media-tag.video { background: #7c2d12; color: #ffedd5; }
  .batch-intro {
    padding: 1rem 2rem; background: #0f172a; border-bottom: 1px solid #1f2937;
    font-size: 0.82rem; color: #94a3b8;
  }
  .batch-intro h2 { font-size: 0.95rem; color: #5eead4; margin-bottom: 0.4rem; }
  .batch-intro a { color: #99f6e4; font-weight: 650; }
  .batch-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.6rem; }
  .batch-pill {
    font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; color: #fff;
  }

  /* PERSON_LEFT_HOOK_RIGHT — H1 top-right, below white fade */
  .tpl-left .copy { top: 11%; right: 4%; left: 40%; }
  .tpl-left.r-9x16 .copy { top: 14%; }
  .tpl-left .logo.right { display: none; }
  .tpl-left .cta { position: absolute; bottom: 5.5%; right: 4%; }
  .tpl-left.r-4x5 .hook { font-size: clamp(18px, 5vw, 34px); }
  .tpl-left.r-4x5 .support { font-size: clamp(12px, 2.6vw, 16px); }
  .tpl-left.r-4x5 .bullets li { font-size: clamp(11px, 2.2vw, 13px); }
  .tpl-left.r-4x5 .cta { font-size: clamp(12px, 2.4vw, 15px); }
  .tpl-left.r-9x16 .hook { font-size: clamp(16px, 4.2vw, 28px); }
  .tpl-left.r-9x16 .support { font-size: clamp(12px, 2.4vw, 15px); }
  .tpl-left.r-9x16 .bullets li { font-size: clamp(11px, 2.1vw, 13px); }
  .tpl-left.r-9x16 .cta { font-size: clamp(12px, 2.2vw, 14px); }
  .tpl-left.r-1x1 .hook { font-size: clamp(16px, 4.4vw, 28px); }
  .tpl-left.r-1x1 .support { font-size: clamp(11px, 2.4vw, 14px); }
  .tpl-left.r-1x1 .bullets li { font-size: clamp(10px, 2vw, 12px); }
  .tpl-left.r-1x1 .cta { font-size: clamp(11px, 2.2vw, 13px); }
  .tpl-left.r-1x1 .copy { top: 10%; }

  /* PERSON_RIGHT_HOOK_LEFT — H1 top-left (default; copy-down bumps further) */
  .tpl-right .copy { top: 10%; left: 4%; right: 40%; }
  .tpl-right .logo.right { display: none; }
  .tpl-right .cta { position: absolute; bottom: 5.5%; left: 4%; }
  .tpl-right.r-4x5 .hook { font-size: clamp(18px, 5vw, 34px); }
  .tpl-right.r-4x5 .support { font-size: clamp(12px, 2.6vw, 16px); }
  .tpl-right.r-4x5 .bullets li { font-size: clamp(11px, 2.2vw, 13px); }
  .tpl-right.r-4x5 .cta { font-size: clamp(12px, 2.4vw, 15px); }
  .tpl-right.r-9x16 .hook { font-size: clamp(16px, 4.2vw, 28px); }
  .tpl-right.r-9x16 .support { font-size: clamp(12px, 2.4vw, 15px); }
  .tpl-right.r-9x16 .bullets li { font-size: clamp(11px, 2.1vw, 13px); }
  .tpl-right.r-9x16 .cta { font-size: clamp(12px, 2.2vw, 14px); }
  .tpl-right.r-1x1 .hook { font-size: clamp(16px, 4.4vw, 28px); }
  .tpl-right.r-1x1 .support { font-size: clamp(11px, 2.4vw, 14px); }
  .tpl-right.r-1x1 .bullets li { font-size: clamp(10px, 2vw, 12px); }
  .tpl-right.r-1x1 .cta { font-size: clamp(11px, 2.2vw, 13px); }

  /* CENTER_TOP_BAND */
  .tpl-center .copy { top: 11%; left: 5%; right: 5%; text-align: center; align-items: center; }
  .tpl-center .logo-wrap { left: 50%; transform: translateX(-50%); }
  .tpl-center .cta { position: absolute; bottom: 5.5%; left: 50%; transform: translateX(-50%); }
  .tpl-center.r-4x5 .hook { font-size: clamp(18px, 5.2vw, 36px); }
  .tpl-center.r-4x5 .support { font-size: clamp(12px, 2.6vw, 16px); }
  .tpl-center.r-4x5 .bullets li { font-size: clamp(11px, 2.2vw, 13px); }
  .tpl-center.r-9x16 .hook { font-size: clamp(16px, 4.4vw, 30px); }
  .tpl-center.r-9x16 .support { font-size: clamp(12px, 2.4vw, 15px); }

  /* LAPTOP_EXPLAINER */
  .tpl-explainer .copy { top: 12%; left: 5%; right: 5%; }
  .tpl-explainer .logo.right { display: none; }
  .tpl-explainer .cta { position: absolute; bottom: 5%; left: 5%; }
  .tpl-explainer.r-4x5 .hook { font-size: clamp(18px, 5vw, 34px); }
  .tpl-explainer.r-4x5 .support { font-size: clamp(12px, 2.6vw, 16px); }
  .tpl-explainer.r-4x5 .bullets li { font-size: clamp(11px, 2.2vw, 13px); }

  /* HEADSHOT_TRUST — logo at top; H1+support in white band below logo; CTA bottom */
  .tpl-trust .copy { top: 14%; left: 6%; right: 6%; text-align: center; align-items: center; gap: 0.35em; }
  .tpl-trust .logo-wrap { left: 50%; transform: translateX(-50%); top: 2%; z-index: 7; }
  .tpl-trust .cta {
    position: absolute; left: 50%; transform: translateX(-50%);
    top: auto; bottom: 4.5%;
    z-index: 6;
  }
  .tpl-trust.r-9x16 .copy { top: 12%; }
  /* 1x1: keep portrait placement; put H1+support under logo in top white band */
  .tpl-trust.r-1x1 .wash { display: none; }
  .tpl-trust.r-1x1 .logo-wrap { top: 2%; }
  .tpl-trust.r-1x1 .logo { height: 24px; }
  .tpl-trust.r-1x1 .copy {
    top: 9.5%;
    left: 5%; right: 5%;
    text-align: center; align-items: center;
    gap: 0.25em;
  }
  .tpl-trust.r-4x5 .hook { font-size: clamp(15px, 4vw, 26px); }
  .tpl-trust.r-4x5 .cta { font-size: clamp(12px, 2.3vw, 14px); }
  .tpl-trust.r-9x16 .hook { font-size: clamp(14px, 3.6vw, 22px); }
  .tpl-trust.r-9x16 .cta { font-size: clamp(12px, 2.2vw, 14px); bottom: 4%; }
  .tpl-trust.r-1x1 .hook { font-size: clamp(11px, 2.9vw, 16px); line-height: 1.15; }
  .tpl-trust.r-1x1 .support { font-size: clamp(8px, 1.8vw, 11px); }
  .tpl-trust.r-1x1 .cta { font-size: clamp(11px, 2.2vw, 13px); bottom: 4%; }
  .tpl-trust .phase-tag { top: 3.5%; right: 4%; }

  .meta { padding: 0.95rem 1.05rem 1.15rem; font-size: 0.78rem; color: #cbd5e1; }
  .meta .id { font-family: ui-monospace, monospace; font-size: 0.66rem; color: #64748b; word-break: break-all; }
  .badge { display: inline-block; font-size: 0.64rem; font-weight: 800; padding: 0.18rem 0.5rem; border-radius: 4px; margin: 0.3rem 0.25rem 0 0; }
  .rating-a { background: #14532d; color: #bbf7d0; }
  .rating-b { background: #1e3a8a; color: #bfdbfe; }
  .phase-2 { background: #7c2d12; color: #fed7aa; }
  .proto { background: #7c3aed; color: #ede9fe; }
  .ok { color: #86efac; }
  .hook-line { color: #cbd5e1; font-size: 0.72rem; margin-top: 0.2rem; line-height: 1.35; }
  .claims { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.45rem; }
  .claim {
    font-size: 0.62rem; font-weight: 700; padding: 0.12rem 0.4rem; border-radius: 4px;
    background: #1e293b; color: #94a3b8;
  }
  .claim.ok { background: #14532d; color: #bbf7d0; }
  .claim.verify { background: #7c2d12; color: #fed7aa; }
  .claim.bad { background: #7f1d1d; color: #fecaca; }
  .notes { color: #94a3b8; margin-top: 0.45rem; font-size: 0.72rem; line-height: 1.4; }
  .remotion { color: #c4b5fd; margin-top: 0.35rem; font-size: 0.7rem; line-height: 1.35; }
`;

function tplClass(name) {
  if (name === 'PERSON_LEFT_HOOK_RIGHT') return 'tpl-left';
  if (name === 'PERSON_RIGHT_HOOK_LEFT') return 'tpl-right';
  if (name === 'CENTER_TOP_BAND') return 'tpl-center';
  if (name === 'HEADSHOT_TRUST_CARD') return 'tpl-trust';
  return 'tpl-explainer';
}

function ratioClass(r) {
  if (r === '9x16') return 'r-9x16';
  if (r === '1x1') return 'r-1x1';
  return 'r-4x5';
}

function renderHook(copy) {
  const hook = copy.hook || '';
  const accent = copy.hookAccent;
  if (!accent || !hook.includes(accent)) return esc(hook);
  const i = hook.indexOf(accent);
  return `${esc(hook.slice(0, i))}<span class="accent">${esc(accent)}</span>${esc(hook.slice(i + accent.length))}`;
}

function renderSupport(copy, style) {
  const support = (copy.support || '').toUpperCase();
  if (!support) return '';
  // Only split short two-part lines (e.g. TEAM OF FOUR / PRICE OF ONE) — not long support sentences
  const splitStyles = new Set(['split-orange', 'split-red', 'slant-orange']);
  if (splitStyles.has(style) && support.includes(',') && support.length < 48) {
    const [a, ...rest] = support.split(',');
    const b = rest.join(',').trim();
    return `<div class="support-split"><span class="a">${esc(a.trim())}</span><span class="b">${esc(b)}</span></div>`;
  }
  return `<div class="support">${esc(support)}</div>`;
}

function productionCopyFor(concept) {
  return {
    angle: concept.name,
    hook: concept.headline,
    hookAccent: '',
    support: concept.support,
    bullets: [],
    cta: concept.cta,
  };
}

/** One clean layout mock + labeled fields per Brief concept */
function renderProductionCard(concept, baseTest, index) {
  const x = {
    ...baseTest,
    copy: productionCopyFor(concept),
    style: baseTest.style || 'highlighter',
    modifiers: baseTest.modifiers || 'text-panel',
  };
  const style = styleFor(x, index);
  const cta = ctaLabel(x.copy, style);
  const shape = ctaShape(style, index);
  const isLeft = x.template === 'PERSON_LEFT_HOOK_RIGHT';
  const mods = (x.modifiers || '').trim();
  const shapeClass = shape ? `cta-shape-${shape}` : '';

  return `<article class="prod-card">
    <div class="prod-card__preview">
      <div class="mock ${ratioClass(x.ratio)} ${tplClass(x.template)} ${mods} style-${style} ${shapeClass}">
        <img class="bg" src="${esc(x.image)}" alt="" />
        ${isLeft ? '<div class="top-fade"></div>' : ''}
        <div class="wash"></div>
        <div class="logo-wrap"><img class="logo left" src="${LOGO}" alt="MedVirtual" /></div>
        <div class="copy">
          <div class="hook">${renderHook(x.copy)}</div>
          ${renderSupport(x.copy, style)}
        </div>
        ${cta ? `<span class="cta">${esc(cta)}</span>` : ''}
      </div>
    </div>
    <div class="prod-card__meta">
      <span class="prod-num">${index + 1}</span>
      <div class="prod-fields">
        <p class="field-label">On-image headline</p>
        <p class="field-headline">${esc(concept.headline)}</p>
        <p class="field-label">Support</p>
        <p class="field-val">${esc(concept.support)}</p>
        <p class="field-label">Visual</p>
        <p class="field-val muted">${esc(concept.visual)}</p>
        <p class="field-label">Layout</p>
        <p class="field-val">${esc(x.template.replaceAll('_', ' '))} · 1080×1350</p>
        <span class="cta-pill">${esc(concept.cta)}</span>
      </div>
    </div>
  </article>`;
}

async function main() {
  const tests = await buildTests();
  const byId = Object.fromEntries(tests.map((x) => [x.id, x]));

  const productionLayouts = [
    { conceptId: '1', templateId: 'T1-FD-45' },
    { conceptId: '2', templateId: 'T1-FD2-45' },
    { conceptId: '3', templateId: 'T2-RMA-45' },
    { conceptId: '4', templateId: 'T1-MC-45' },
  ];

  const cards = productionLayouts
    .map((row, i) => {
      const concept = PRODUCTION_CONCEPTS.find((c) => c.id === row.conceptId);
      const base = byId[row.templateId];
      if (!concept || !base) {
        console.warn(`Missing layout for concept ${row.conceptId} / ${row.templateId}`);
        return '';
      }
      return renderProductionCard(concept, base, i);
    })
    .join('');

  const pageCss = `
  body { background: #f1f5f9 !important; color: #0f172a !important; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 0.95rem 1.1rem; margin-bottom: 0.85rem;
  }
  .banner h2 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.3rem; color: #f8fafc; }
  .banner p { font-size: 0.88rem; color: #cbd5e1; }
  .banner a { color: #5eead4; font-weight: 700; text-decoration: none; }
  .banner-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.65rem; }
  .banner-meta span {
    font-size: 0.72rem; font-weight: 750; padding: 0.28rem 0.55rem; border-radius: 6px;
    background: rgba(13,148,136,0.25); border: 1px solid rgba(94,234,212,0.35); color: #99f6e4;
  }
  .prod-list { display: grid; gap: 0.85rem; }
  .prod-card {
    display: grid; grid-template-columns: minmax(220px, 280px) 1fr; gap: 0.85rem;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.75rem;
  }
  @media (max-width: 720px) { .prod-card { grid-template-columns: 1fr; } }
  .prod-card__preview { border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; background: #0f172a; }
  .prod-card__preview .mock { width: 100%; }
  .prod-card__meta { display: grid; grid-template-columns: 2.1rem 1fr; gap: 0.55rem; align-content: start; padding: 0.25rem 0.15rem; }
  .prod-num {
    width: 2.1rem; height: 2.1rem; border-radius: 8px; background: #0d9488; color: #fff;
    font-weight: 800; display: grid; place-items: center;
  }
  .field-label {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #0d9488; margin-top: 0.45rem; margin-bottom: 0.1rem;
  }
  .prod-fields .field-label:first-child { margin-top: 0; }
  .field-headline { font-size: 1.1rem; font-weight: 800; color: #0f172a; line-height: 1.25; }
  .field-val { font-size: 0.88rem; color: #334155; font-weight: 600; }
  .field-val.muted { font-weight: 500; color: #64748b; }
  .cta-pill {
    display: inline-block; margin-top: 0.65rem; background: #0d9488; color: #fff;
    font-size: 0.75rem; font-weight: 800; padding: 0.28rem 0.6rem; border-radius: 6px;
  }
  .note {
    margin-top: 0.85rem; font-size: 0.84rem; color: #64748b; background: #fff;
    border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.7rem 0.85rem;
  }
`;

  fs.writeFileSync(
    path.join(PUBLIC, 'template-test-board.html'),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Templates — MedVirtual</title>
  <style>${CSS}${pageCss}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'templates',
    pageTitle: 'Templates',
    pageSubtitle: `Layout reference · ${FIRST_BATCH_COUNT} ads · 1080×1350`,
  })}
  <div class="wrap">
    <header class="banner">
      <h2>Layout reference only</h2>
      <p>Produce from the <a href="/graphic-request-brief.html">Creative Brief</a>. These mocks show text zones + composition — not extra ads to build.</p>
      <div class="banner-meta">
        <span>${FIRST_BATCH_COUNT} concepts</span>
        <span>1080×1350</span>
        <span>Person left · hook right</span>
      </div>
    </header>
    <div class="prod-list">${cards}</div>
    <p class="note">Brief owns headlines and Meta copy. Use this page to see how type sits on the image.</p>
  </div>
</body>
</html>`,
  );

  spawnSync('node', [path.join(__dirname, 'generate-asset-hub.mjs')], { stdio: 'inherit' });

  fs.writeFileSync(
    path.join(PUBLIC, 'exports/image-tests/template-test-catalog.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), tests }, null, 2),
  );

  fs.writeFileSync(
    path.join(ROOT, 'template-system-notes.md'),
    `# Template System Notes

Layout reference for the Creative Brief (${FIRST_BATCH_COUNT} static 1080×1350 ads).

Primary layout: PERSON_LEFT_HOOK_RIGHT — person left, headline top-right, CTA bottom.

See \`template-test-board.html\` and \`graphic-request-brief.html\`.
`,
  );

  fs.writeFileSync(
    path.join(ROOT, 'first-batch-template-map.md'),
    `# First Batch Template Map

| # | Brief concept | Layout seed |
|---|---------------|-------------|
${productionLayouts
  .map((row) => {
    const c = PRODUCTION_CONCEPTS.find((x) => x.id === row.conceptId);
    return `| ${row.conceptId} | ${c?.headline || row.conceptId} | ${row.templateId} |`;
  })
  .join('\n')}

Source of truth: Creative Brief.
`,
  );

  console.log(`Templates: http://localhost:5173/template-test-board.html (${FIRST_BATCH_COUNT} layout refs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
