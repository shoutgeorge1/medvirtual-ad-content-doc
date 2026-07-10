/**
 * George-approved crop shortlist only.
 * Everything else is deleted from the review board.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { HEADER_CSS, IMAGE_SUBNAV, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ASSETS = path.join(PUBLIC, 'assets');

const TARGETS = {
  '4x5': { w: 1080, h: 1350, folder: 'feed-4x5' },
  '9x16': { w: 1080, h: 1920, folder: 'story-9x16' },
  '1x1': { w: 1080, h: 1080, folder: 'square-1x1' },
};

/**
 * George-approved crops, tagged by subject side for text placement.
 * textZone: where copy should go without covering the face.
 */
const APPROVED = [
  // Person LEFT — text on top line / right side
  { id: 'AI_003', file: 'ai-generated-03.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Follow-Up', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Scheduling', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_010', file: 'ai-generated-10.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.22, focalY: 0.3, label: 'Front Desk Backup', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_003', file: 'ai-generated-03.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Follow-Up', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.3, label: 'Scheduling', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_009', file: 'ai-generated-09.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Scheduling', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_010', file: 'ai-generated-10.png', folder: 'ai-images', ratio: '4x5', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.32, label: 'Front Desk Backup', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_006', file: 'ai-generated-06.png', folder: 'ai-images', ratio: '1x1', cropType: 'SUBJECT_CENTER', focalX: 0.28, focalY: 0.32, label: 'Scheduling', subjectSide: 'left', textZone: 'Top line + right side' },
  // NEW AI_015 Hispanic VA — sits LEFT in frame → text right (PERSON_LEFT_TEXT_RIGHT)
  { id: 'AI_015', file: 'ai-generated-15.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_LEFT', focalX: 0.28, focalY: 0.28, label: 'Front Desk Backup', subjectSide: 'left', textZone: 'Top line + right side' },
  { id: 'AI_015', file: 'ai-generated-15.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_LEFT', focalX: 0.28, focalY: 0.26, label: 'Front Desk Backup', subjectSide: 'left', textZone: 'Top line + right side' },

  // Person RIGHT / center-right — text on top line / left side
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.72, focalY: 0.28, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side' },
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.72, focalY: 0.28, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side' },
  { id: 'AI_004', file: 'ai-generated-04.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.68, focalY: 0.32, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side' },
  { id: 'AI_007', file: 'ai-generated-07.png', folder: 'ai-images', ratio: '1x1', cropType: 'FACE_CENTER', focalX: 0.35, focalY: 0.32, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side' },
  // NEW AI_013 Young Asian VA (headset) — center-right → text left
  { id: 'AI_013', file: 'ai-generated-13.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.68, focalY: 0.28, label: 'Remote Medical Assistant', subjectSide: 'right', textZone: 'Top line + left side (center-right)' },
  { id: 'AI_013', file: 'ai-generated-13.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.7, focalY: 0.26, label: 'Remote Medical Assistant', subjectSide: 'right', textZone: 'Top line + left side (center-right)' },
  // NEW AI_014 Young Asian VA (laptop) — center-right → text left
  { id: 'AI_014', file: 'ai-generated-14.png', folder: 'ai-images', ratio: '4x5', cropType: 'FACE_RIGHT', focalX: 0.68, focalY: 0.28, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side (center-right)' },
  { id: 'AI_014', file: 'ai-generated-14.png', folder: 'ai-images', ratio: '9x16', cropType: 'SUBJECT_RIGHT', focalX: 0.7, focalY: 0.26, label: 'Workflow', subjectSide: 'right', textZone: 'Top line + left side (center-right)' },

  // Person CENTER — blank space above for text
  { id: 'AI_008', file: 'ai-generated-08.png', folder: 'ai-images', ratio: '4x5', cropType: 'SUBJECT_CENTER', focalX: 0.55, focalY: 0.42, label: 'Payroll Pressure', subjectSide: 'center', textZone: 'Top band — blank space above subject' },
];

/** Landing page headshots — one clean white-canvas layout each (flush bottom, text above) */
const HEADSHOTS = [
  { id: 'LP_001', file: 'assistant.avif', label: 'Front Desk Backup' },
  { id: 'LP_002', file: 'biller.avif', label: 'Payroll Pressure' },
  { id: 'LP_003', file: 'casecoord.avif', label: 'Follow-Up' },
  { id: 'LP_004', file: 'general.avif', label: 'Staffing Gap' },
  { id: 'LP_005', file: 'nurse.avif', label: 'Follow-Up' },
];

const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/image-inventory.json'), 'utf8'));
const videoMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/video-production-metadata.json'), 'utf8'));
const sourceById = Object.fromEntries(inventory.sources.map((s) => [s.id, s]));

function getVideoFields(source) {
  if (!source?.id) return {};
  const defaults = videoMeta.familyDefaults[source.family] || {};
  const v = source.video || {};
  return {
    static_use: v.static_use ?? defaults.static_use ?? 'yes',
    remotion_use: v.remotion_use ?? defaults.remotion_use ?? 'medium',
    veo_video_use: v.veo_video_use ?? defaults.veo_video_use ?? 'low',
    editor_use: v.editor_use ?? defaults.editor_use ?? 'medium',
    best_video_format: v.best_video_format ?? defaults.best_video_format ?? 'voiceover',
    recommended_angle: v.recommended_angle ?? source.placeholderLabel,
    recommended_script_style: v.recommended_script_style ?? defaults.recommended_script_style ?? '',
    video_editor_notes: v.video_editor_notes ?? defaults.video_editor_notes ?? '',
    veo_prompt_notes: v.veo_prompt_notes ?? defaults.veo_prompt_notes ?? '',
    compliance_risks: v.compliance_risks ?? defaults.compliance_risks ?? [],
    do_not_use_for: v.do_not_use_for ?? defaults.do_not_use_for ?? [],
    veo_prompt_potential: ['high', 'medium'].includes(v.veo_video_use ?? defaults.veo_video_use) ? 'yes' : 'no',
  };
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

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cleanExportFolders() {
  for (const { folder } of Object.values(TARGETS)) {
    const dir = path.join(PUBLIC, 'exports/image-tests', folder);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.png')) fs.unlinkSync(path.join(dir, f));
    }
  }
}

async function renderApprovedCrop(item) {
  const inputPath = path.join(ASSETS, item.folder, item.file);
  const meta = await sharp(inputPath).metadata();
  const { w: targetW, h: targetH, folder } = TARGETS[item.ratio];
  const varId = `IMG_${item.id}_${item.ratio.toUpperCase()}_${item.cropType}`;
  const outName = `${varId}.png`;
  const outPath = path.join(PUBLIC, 'exports/image-tests', folder, outName);
  const extract = cropExtract(meta, targetW, targetH, item.focalX, item.focalY);
  await sharp(inputPath).extract(extract).resize(targetW, targetH).png({ quality: 90 }).toFile(outPath);

  const source = sourceById[item.id] || {};
  return {
    variationId: varId,
    sourceId: item.id,
    sourceFile: item.file,
    sourceType: 'AI-generated',
    family: source.family || '',
    boardSection: item.subjectSide === 'right' ? 'person_right' : item.subjectSide === 'center' ? 'person_center' : 'person_left',
    subjectSide: item.subjectSide,
    textZone: item.textZone,
    aspectRatio: item.ratio,
    cropType: item.cropType,
    cropLabel: `${item.ratio}/${item.cropType.toLowerCase().replace(/_/g, '/')}`,
    candidateRating: 'A',
    placeholderLabel: item.label,
    recommendedUse: `Text: ${item.textZone}`,
    owned: false,
    warnings: [],
    previewPath: `/exports/image-tests/${folder}/${outName}`,
    video: getVideoFields(source),
    sourceFolder: item.folder,
  };
}

/**
 * Headshot flush to bottom of white canvas — no white gap under portrait.
 * Source LP shots sit low in-frame; crop out top headroom so the face reads higher.
 */
async function renderHeadshotTextSpace(item, layout) {
  const inputPath = path.join(ASSETS, 'landing-page-images', item.file);
  const { w: targetW, h: targetH, folder } = TARGETS[layout.ratio];
  const varId = `IMG_${item.id}_${layout.ratio.toUpperCase()}_${layout.cropType}`;
  const outName = `${varId}.png`;
  const outPath = path.join(PUBLIC, 'exports/image-tests', folder, outName);

  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width;
  const srcH = meta.height;
  // Zoom in + bias down: LP masters leave empty white above the head
  const zoom = layout.sourceZoom ?? 0.78;
  const cropSize = Math.round(Math.min(srcW, srcH) * zoom);
  const cropLeft = Math.round((srcW - cropSize) / 2);
  const cropTop = Math.round((srcH - cropSize) * (layout.sourceFocalY ?? 0.72));

  const portraitSize = Math.round(Math.min(targetW, targetH) * layout.portraitScale);
  const portraitBuf = await sharp(inputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .resize(portraitSize, portraitSize, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const left = Math.round((targetW - portraitSize) / 2);
  const top = targetH - portraitSize; // flush bottom — no white underneath

  await sharp({
    create: { width: targetW, height: targetH, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([{ input: portraitBuf, left, top }])
    .png({ quality: 90 })
    .toFile(outPath);

  const source = sourceById[item.id] || {};
  return {
    variationId: varId,
    sourceId: item.id,
    sourceFile: item.file,
    sourceType: 'Landing page image',
    family: 'landing_headshot',
    boardSection: 'usable_later',
    subjectSide: 'center',
    textZone: 'White band above head — do not cover face',
    aspectRatio: layout.ratio,
    cropType: layout.cropType,
    cropLabel: `${layout.ratio}/white/text-above`,
    candidateRating: 'B',
    placeholderLabel: item.label,
    recommendedUse: 'Flush bottom on white — put hook in top white band',
    owned: true,
    warnings: ['Usable later — text above head only'],
    previewPath: `/exports/image-tests/${folder}/${outName}`,
    video: getVideoFields(source),
    sourceFolder: 'landing-page-images',
  };
}

const SHARED_CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.5; }
  .stats { display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem 2rem; background: #1e293b; border-bottom: 1px solid #334155; }
  .stat { font-size: 0.8rem; color: #94a3b8; }
  .stat strong { color: #f1f5f9; font-size: 1.1rem; display: block; }
  .section-head { padding: 1.75rem 2rem 0.75rem; border-top: 1px solid #334155; }
  .section-head h2 { font-size: 1.05rem; color: #f8fafc; }
  .section-head p { font-size: 0.8rem; color: #94a3b8; margin-top: 0.2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; padding: 0.5rem 2rem 2rem; }
  .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden; }
  .card-img { background: #0f172a; display: flex; align-items: center; justify-content: center; min-height: 280px; }
  .card-img img { max-width: 100%; max-height: 520px; height: auto; display: block; }
  .card-body { padding: 0.85rem; }
  .card-id { font-size: 0.68rem; font-family: monospace; color: #64748b; word-break: break-all; }
  .card-meta { font-size: 0.78rem; color: #cbd5e1; margin-top: 0.4rem; }
  .card-meta span { display: block; }
  .badge { display: inline-block; font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 3px; margin-top: 0.35rem; margin-right: 0.25rem; }
  .rating-a { background: #166534; color: #bbf7d0; }
  .rating-b { background: #1e40af; color: #bfdbfe; }
  .label-tag { background: #0e7490; color: #cffafe; font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 3px; }
  .owned { background: #065f46; color: #a7f3d0; }
  .warn { color: #fbbf24; font-size: 0.72rem; margin-top: 0.35rem; }
  .side-left { background: #0e7490; color: #cffafe; }
  .side-right { background: #7c2d12; color: #fed7aa; }
  .side-center { background: #365314; color: #d9f99d; }
  .text-zone { color: #a5b4fc; font-size: 0.72rem; margin-top: 0.25rem; }
`;

function sideBadge(side) {
  if (side === 'right') return '<span class="badge side-right">Person RIGHT → text left/top</span>';
  if (side === 'center') return '<span class="badge side-center">Person CENTER → text top</span>';
  return '<span class="badge side-left">Person LEFT → text right/top</span>';
}

function renderCard(v) {
  return `
    <div class="card">
      <div class="card-img"><img src="${esc(v.previewPath)}" alt="${esc(v.variationId)}" loading="lazy" /></div>
      <div class="card-body">
        <div class="card-id">${esc(v.variationId)}</div>
        <div class="card-meta">
          <span><strong>${esc(v.sourceFile)}</strong> · ${esc(v.cropLabel)}</span>
          <span class="label-tag">${esc(v.placeholderLabel)}</span>
          ${v.owned ? '<span class="badge owned">MV Owned</span>' : ''}
          ${sideBadge(v.subjectSide)}
          <div class="text-zone">Text zone: ${esc(v.textZone || '—')}</div>
          <span style="font-size:0.72rem;color:#64748b;margin-top:0.25rem;display:block">${esc(v.recommendedUse)}</span>
        </div>
      </div>
    </div>`;
}

function renderPage(title, subtitle, sections, activeSubHref = '/image-variation-review.html') {
  const body = sections
    .filter((sec) => sec.items.length > 0)
    .map(
      (sec) => `
      <div class="section-head"><h2>${esc(sec.title)}</h2><p>${esc(sec.subtitle)} (${sec.items.length})</p></div>
      <div class="grid">${sec.items.map(renderCard).join('')}</div>`,
    )
    .join('');

  const leftN = sections.find((s) => s.key === 'person_left')?.items.length || 0;
  const rightN = sections.find((s) => s.key === 'person_right')?.items.length || 0;
  const centerN = sections.find((s) => s.key === 'person_center')?.items.length || 0;
  const laterN = sections.find((s) => s.key === 'usable_later')?.items.length || 0;
  const total = sections.reduce((n, s) => n + (s.items?.length || 0), 0);

  const header = renderDocHeader({
    activeId: 'images',
    pageTitle: title,
    pageSubtitle: subtitle,
    subnav: IMAGE_SUBNAV,
    activeSubHref,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} — MedVirtual Content Doc</title>
  <style>${SHARED_CSS}</style>
</head>
<body>
  ${header}
  <div class="stats">
    <div class="stat"><strong>${total || leftN + rightN + centerN + laterN}</strong> crops</div>
    <div class="stat"><strong>${leftN}</strong> person left</div>
    <div class="stat"><strong>${rightN}</strong> person right</div>
    <div class="stat"><strong>${centerN}</strong> person center</div>
    <div class="stat"><strong>${laterN}</strong> headshots</div>
  </div>
  ${body}
</body>
</html>`;
}

async function writeBoardsFromKept(kept) {
  const left = kept.filter((v) => v.boardSection === 'person_left');
  const right = kept.filter((v) => v.boardSection === 'person_right');
  const center = kept.filter((v) => v.boardSection === 'person_center');
  const later = kept.filter((v) => v.boardSection === 'usable_later');
  const approved = [...left, ...right, ...center];

  const sections = [
    {
      key: 'person_left',
      title: 'Person LEFT — text on top + right',
      subtitle: 'Hook on the top line. Copy can also sit on the open right side.',
      items: left,
    },
    {
      key: 'person_right',
      title: 'Person RIGHT — text on top + left',
      subtitle: 'AI_004 and AI_007. Hook on top line; keep copy on the left so it clears the face.',
      items: right,
    },
    {
      key: 'person_center',
      title: 'Person CENTER — text in top blank band',
      subtitle: 'AI_008. Subject mid-frame with open space above — put the hook there.',
      items: center,
    },
    {
      key: 'usable_later',
      title: 'Usable Later — Headshots (flush bottom, text above)',
      subtitle: 'One 4:5 per role. Portrait sits on the bottom edge — no white gap underneath. Put text in the white band above the head.',
      items: later,
    },
  ];

  fs.writeFileSync(
    path.join(PUBLIC, 'image-variation-review.html'),
    renderPage(
      'Image Review — Text Placement Map',
      'Organized by where the person sits so text placement is obvious.',
      sections,
      '/image-variation-review.html',
    ),
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-best-candidates.html'),
    renderPage(
      'Approved AI Crops',
      'By subject side',
      sections.filter((s) => s.key !== 'usable_later'),
      '/contact-sheet-best-candidates.html',
    ),
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-all-4x5.html'),
    renderPage(
      '4:5 Feed Crops',
      'Approved 4:5 crops for Facebook / Instagram Feed',
      [{ key: 'person_left', title: '4:5', subtitle: '', items: kept.filter((v) => v.aspectRatio === '4x5') }],
      '/contact-sheet-all-4x5.html',
    ),
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-all-9x16.html'),
    renderPage(
      '9:16 Stories / Reels Crops',
      'Approved 9:16 crops for Stories and Reels',
      [{ key: 'person_left', title: '9:16', subtitle: '', items: kept.filter((v) => v.aspectRatio === '9x16') }],
      '/contact-sheet-all-9x16.html',
    ),
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-landing-page-images.html'),
    renderPage(
      'Headshots — Text Above',
      'Flush bottom, white band on top — Phase 2 trust',
      [{ key: 'usable_later', title: 'Headshots', subtitle: '', items: later }],
      '/contact-sheet-landing-page-images.html',
    ),
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'contact-sheet-ai-images.html'),
    renderPage(
      'Approved AI Crops',
      'George shortlist',
      [{ key: 'person_left', title: 'AI', subtitle: '', items: approved }],
      '/contact-sheet-best-candidates.html',
    ),
  );

  spawnSync('node', [path.join(__dirname, 'generate-asset-hub.mjs')], { stdio: 'inherit' });
  return { left, right, center, later, approved, sections };
}

async function main() {
  const htmlOnly = process.argv.includes('--html-only');

  if (htmlOnly) {
    const catalogPath = path.join(PUBLIC, 'exports/image-tests/variations-catalog.json');
    if (!fs.existsSync(catalogPath)) {
      console.error('No variations-catalog.json — run full generate:images first.');
      process.exit(1);
    }
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    await writeBoardsFromKept(catalog.kept || []);
    console.log('Image boards refreshed from catalog (HTML only).');
    return;
  }

  console.log('Cleaning old crops...');
  cleanExportFolders();

  const kept = [];

  console.log('Rendering George-approved AI crops...');
  for (const item of APPROVED) {
    kept.push(await renderApprovedCrop(item));
  }

  // One layout per headshot: 4:5 flush-bottom (best for Meta feed + text above)
  console.log('Rendering headshots flush-bottom on white...');
  for (const hs of HEADSHOTS) {
    kept.push(
      await renderHeadshotTextSpace(hs, {
        ratio: '4x5',
        cropType: 'WHITE_TEXT_TOP',
        portraitScale: 0.82,
        sourceZoom: 0.86,
        sourceFocalY: 0.55,
      }),
    );
  }

  const { left, right, center, later } = await writeBoardsFromKept(kept);

  const catalog = {
    generatedAt: new Date().toISOString(),
    mode: 'george-approved-by-subject-side',
    kept,
    rejected: [],
    summary: {
      personLeft: left.length,
      personRight: right.length,
      personCenter: center.length,
      headshots: later.length,
      total: kept.length,
      textRule: 'Most images: put hook on top line. Person-left → text right. Person-right → text left. Center → text in top blank band.',
    },
  };

  fs.writeFileSync(
    path.join(PUBLIC, 'exports/image-tests/variations-catalog.json'),
    JSON.stringify(catalog, null, 2),
  );

  fs.writeFileSync(
    path.join(ROOT, 'image-variation-pass.md'),
    `# Image Variation Pass — Text Placement Map

Generated: ${new Date().toISOString().slice(0, 10)}

## Text rule

Most images: **put the hook on the top line.**

| Subject side | Text goes |
|--------------|-----------|
| Left (most) | Top line + right side |
| Right (AI_004, AI_007) | Top line + left side |
| Center (AI_008) | Top blank band above subject |
| Headshots | White band above head (portrait flush to bottom) |

## Person LEFT (${left.length})

${left.map((v) => `- ${v.variationId} — ${v.cropLabel}`).join('\n')}

## Person RIGHT (${right.length})

${right.map((v) => `- ${v.variationId} — ${v.cropLabel}`).join('\n')}

## Person CENTER (${center.length})

${center.map((v) => `- ${v.variationId} — ${v.cropLabel}`).join('\n')}

## Headshots flush-bottom (${later.length})

${later.map((v) => `- ${v.variationId}`).join('\n')}

Review: http://localhost:5173/image-variation-review.html
`,
  );

  console.log(`\nLeft: ${left.length} | Right: ${right.length} | Center: ${center.length} | Headshots: ${later.length}`);
  console.log('Review: http://localhost:5173/image-variation-review.html');

  spawnSync('node', ['scripts/generate-handoff-docs.mjs'], { cwd: ROOT, stdio: 'inherit' });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
