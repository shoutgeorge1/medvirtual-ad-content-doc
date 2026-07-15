/**
 * Wave 1 review board + contact sheet.
 *
 * Reads generated AI plate candidates and final composites, then writes:
 * - public/wave1-plate-review.html
 * - public/exports/wave1-first-launch/contact-sheet-4x5.png
 * - public/exports/wave1-first-launch/wave1-generation-report.json
 *
 * Run:
 *   node scripts/generate-wave1-review-board.mjs --ratio=4x5
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CONCEPTS, RATIOS } from './wave1-creative-config.mjs';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'exports/wave1-first-launch');

function arg(name, def) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
}

const RATIO_KEY = arg('ratio', '4x5');
const ratio = RATIOS[RATIO_KEY];
if (!ratio) {
  console.error(`Invalid ratio: ${RATIO_KEY}`);
  process.exit(1);
}

const PLATE_DIR = path.join(OUT, 'plates', RATIO_KEY);
const CREATIVE_DIR = path.join(OUT, 'creatives');
const CONTACT_SHEET = path.join(OUT, `contact-sheet-${RATIO_KEY}.png`);
const REPORT_PATH = path.join(OUT, 'wave1-generation-report.json');
const PINK_PIXEL_REVIEW_THRESHOLD = 500;

function relPublic(abs) {
  return `/${path.relative(PUBLIC, abs).replace(/\\/g, '/')}`;
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function csvStatus() {
  const p = path.join(OUT, 'creative-map.csv');
  if (!fs.existsSync(p)) return {};
  const lines = fs.readFileSync(p, 'utf8').trim().split(/\r?\n/);
  const out = {};
  for (const line of lines.slice(1)) {
    const cells = line.match(/("([^"]|"")*"|[^,]+)/g) || [];
    if (cells.length >= 13) out[cells[0]] = cells[12];
  }
  return out;
}

async function imageMeta(file) {
  if (!fs.existsSync(file)) return null;
  const meta = await sharp(file).metadata();
  const stat = fs.statSync(file);
  return { width: meta.width, height: meta.height, bytes: stat.size };
}

function isPink(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 25) return false;
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h *= 60;
  if (h < 0) h += 360;
  const sat = (max - min) / max;
  return sat > 0.25 && h >= 290 && h <= 345;
}

async function pinkCount(file) {
  if (!fs.existsSync(file)) return null;
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  let pink = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (isPink(data[i], data[i + 1], data[i + 2])) pink++;
  }
  return pink;
}

async function makeContactSheet(items) {
  const finals = [];
  for (const item of items) {
    const file = item.finalPath;
    if (!fs.existsSync(file)) continue;
    const thumb = await sharp(file)
      .resize(324, 405, { fit: 'cover' })
      .extend({ top: 50, bottom: 70, left: 12, right: 12, background: '#0B1220' })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="348" height="525">
              <text x="18" y="32" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#fff">${item.id}</text>
              <text x="18" y="502" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1">${path.basename(file)}</text>
            </svg>`,
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
    finals.push(thumb);
  }
  if (!finals.length) return null;
  const w = 348;
  const h = 525;
  const canvasW = w * finals.length;
  const canvasH = h;
  await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: '#111827' },
  })
    .composite(finals.map((input, i) => ({ input, left: i * w, top: 0 })))
    .png()
    .toFile(CONTACT_SHEET);
  return CONTACT_SHEET;
}

function renderHtml(items, manifest, contactSheetPath) {
  const cards = items
    .map((item) => {
      const candidates = item.candidates
        .map(
          (c) => `<figure class="${c.selected ? 'selected' : ''}">
            <img src="${relPublic(c.path)}" alt="${item.id} ${c.file}" loading="lazy" />
            <figcaption>${c.file}${c.selected ? ' · selected' : ''}</figcaption>
          </figure>`,
        )
        .join('');
      return `<article class="card">
        <h2>${item.id}</h2>
        <p><strong>Selected plate:</strong> ${item.selected || 'pending'}</p>
        <div class="candidate-grid">${candidates || '<p>No generated candidates yet.</p>'}</div>
        ${
          item.finalPath && fs.existsSync(item.finalPath)
            ? `<h3>Final composite</h3><img class="final" src="${relPublic(item.finalPath)}" alt="${item.id} final" />`
            : '<p class="warn">No final composite yet.</p>'
        }
      </article>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Wave 1 Plate Review</title>
  <style>
    ${HEADER_CSS}
    body { background: #f8fafc; color: #0f172a; }
    main { max-width: 1200px; margin: 0 auto; padding: 24px; font-family: var(--mv-font, "Be Vietnam", sans-serif); }
    .hero { margin-bottom: 24px; }
    .hero a { display: inline-block; margin-right: 16px; }
    .card { background: #fff; border: 1px solid #dbe7ef; border-radius: 14px; padding: 18px; margin-bottom: 22px; }
    .candidate-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
    figure { margin: 0; border: 2px solid #e2e8f0; border-radius: 12px; padding: 8px; background: #fff; }
    figure.selected { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.16); }
    figure img { width: 100%; display: block; border-radius: 8px; background: #0f172a; }
    figcaption { font-size: 12px; color: #475569; margin-top: 6px; }
    .final { width: 300px; max-width: 100%; border-radius: 12px; border: 1px solid #cbd5e1; }
    .warn { color: #b45309; font-weight: 700; }
    pre { white-space: pre-wrap; background: #0f172a; color: #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; max-height: 260px; overflow: auto; }
  </style>
</head>
<body>
  ${renderDocHeader({ activeId: 'vma-handoff', pageTitle: 'Wave 1 Plate Review', pageSubtitle: `${RATIO_KEY} candidates + finals` })}
  <main>
    <section class="hero">
      <h1>Wave 1 Plate Review</h1>
      <p>AI plates are text-free candidates. Final ads use code-rendered Be Vietnam typography and MedVirtual branding.</p>
      ${contactSheetPath ? `<a href="${relPublic(contactSheetPath)}">Final contact sheet</a>` : ''}
      <a href="${relPublic(REPORT_PATH)}">Generation report JSON</a>
    </section>
    ${cards}
    <details>
      <summary>OpenAI generation manifest</summary>
      <pre>${JSON.stringify(manifest, null, 2).replace(/</g, '&lt;')}</pre>
    </details>
  </main>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = readJson(path.join(PLATE_DIR, 'manifest.json'), { concepts: [] });
  const selection = readJson(path.join(PLATE_DIR, 'selection.json'), {});
  const status = csvStatus();

  const items = [];
  for (const concept of CONCEPTS) {
    const dir = path.join(PLATE_DIR, concept.id);
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => /^candidate-\d+\.png$/i.test(f)).sort()
      : [];
    const selected = selection[concept.id] || files[0] || null;
    const finalName = `${concept.stem}_${RATIO_KEY}.png`;
    const finalPath = path.join(CREATIVE_DIR, finalName);
    const finalMeta = await imageMeta(finalPath);
    const pinkPixels = finalMeta ? await pinkCount(finalPath) : null;
    items.push({
      id: concept.id,
      selected,
      candidates: files.map((file) => ({ file, path: path.join(dir, file), selected: file === selected })),
      finalName,
      finalPath,
      finalMeta,
      pinkPixels,
      creativeMapStatus: status[concept.id] || null,
      needsManualReview: !selected || !finalMeta || pinkPixels > PINK_PIXEL_REVIEW_THRESHOLD,
    });
  }

  const contactSheetPath = await makeContactSheet(items);
  const report = {
    ratio: RATIO_KEY,
    generatedAt: new Date().toISOString(),
    pinkPixelReviewThreshold: PINK_PIXEL_REVIEW_THRESHOLD,
    apiGenerationsCreated: manifest.concepts?.reduce(
      (sum, c) => sum + (c.candidates || []).filter((x) => !x.error).length,
      0,
    ) || 0,
    contactSheet: contactSheetPath ? path.relative(ROOT, contactSheetPath) : null,
    items: items.map((item) => ({
      id: item.id,
      selectedPlate: item.selected,
      finalAsset: item.finalMeta ? path.relative(ROOT, item.finalPath) : null,
      dimensions: item.finalMeta ? `${item.finalMeta.width}x${item.finalMeta.height}` : null,
      bytes: item.finalMeta?.bytes || null,
      pinkPixels: item.pinkPixels,
      creativeMapStatus: item.creativeMapStatus,
      needsManualReview: item.needsManualReview,
    })),
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(PUBLIC, 'wave1-plate-review.html'), renderHtml(items, manifest, contactSheetPath));
  console.log('Review board generated: public/wave1-plate-review.html');
  if (contactSheetPath) console.log(`Contact sheet: ${path.relative(ROOT, contactSheetPath)}`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
