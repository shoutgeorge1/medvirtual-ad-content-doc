/**
 * Real People asset pipeline — originals preserved, crops via Sharp, per-person + master ZIP.
 * No generative fill / face alteration. Neutral letterbox only for vertical reference when needed.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import sharp from 'sharp';
import { TALENT, SOURCE_CHECKED_AT } from './real-people-data.mjs';
import { renderTreatmentCAds } from './generate-real-people-treatment-c.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE = path.join(ROOT, 'public', 'assets', 'real-people');
const ZIP_OUT = path.join(ROOT, 'public', 'exports', 'real-people');

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function analyze(inputPath) {
  const meta = await sharp(inputPath).rotate().metadata();
  const stats = fs.statSync(inputPath);
  return {
    width: meta.width,
    height: meta.height,
    format: meta.format,
    size: stats.size,
    sizeLabel: formatBytes(stats.size),
  };
}

/** Face-forward attention crop without inventing pixels. */
async function writeJpeg(pipeline, dest, quality = 88) {
  await pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(dest);
}

async function processPerson(t) {
  const slug = t.assetSlug || t.id;
  const dir = path.join(BASE, slug);
  ensureDir(dir);

  const originalCandidates = [
    path.join(dir, 'original.png'),
    path.join(dir, 'original.jpg'),
    path.join(BASE, `${slug}.jpg`),
    path.join(BASE, `${slug}.png`),
    // legacy flat name for chelsea
    path.join(BASE, 'chelsea-rose.jpg'),
  ];

  let originalPath = originalCandidates.find((p) => fs.existsSync(p));
  if (!originalPath) {
    return {
      slug,
      id: t.id,
      error: 'SOURCE LIMITATION — MANUAL REVIEW REQUIRED (original missing)',
      files: {},
    };
  }

  // Normalize original into person folder if still at flat path
  const originalPng = path.join(dir, 'original.png');
  const originalJpg = path.join(dir, 'original.jpg');
  if (originalPath !== originalPng && originalPath !== originalJpg) {
    const buf = fs.readFileSync(originalPath);
    // Prefer lossless archive of whatever we have
    if (originalPath.endsWith('.png')) {
      fs.copyFileSync(originalPath, originalPng);
      originalPath = originalPng;
    } else {
      // Re-encode to high-quality jpg as archived original if only jpg exists
      await sharp(buf).rotate().jpeg({ quality: 95, mozjpeg: true }).toFile(originalJpg);
      originalPath = originalJpg;
    }
  }

  const sourceMeta = await analyze(originalPath);
  const limitations = [];
  if (sourceMeta.width < 800 || sourceMeta.height < 800) {
    limitations.push('Source under 800px on a side — crops are limited; do not aggressive-upscale.');
  }
  if (sourceMeta.width < 1080 && sourceMeta.height < 1080) {
    limitations.push('SOURCE LIMITATION — MANUAL REVIEW REQUIRED for crisp 1080 output (source smaller than target).');
  }

  const img = () => sharp(originalPath).rotate();

  // 1) Clean master — same content, high-quality JPG, no branding
  const cleanMaster = path.join(dir, 'clean-master.jpg');
  const maxSide = Math.max(sourceMeta.width, sourceMeta.height);
  const masterPipeline =
    maxSide > 2000
      ? img().resize({
          width: sourceMeta.width >= sourceMeta.height ? 2000 : undefined,
          height: sourceMeta.height > sourceMeta.width ? 2000 : undefined,
          fit: 'inside',
          withoutEnlargement: true,
        })
      : img();
  await writeJpeg(masterPipeline, cleanMaster, 92);

  // 2) 1:1 profile — face-centered attention, shoulders when possible
  const profile11 = path.join(dir, 'profile-1080x1080.jpg');
  await writeJpeg(
    img().resize(1080, 1080, {
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: false,
    }),
    profile11,
    88,
  );

  // 3) 4:5 feed — slight top bias for headroom / headline negative space
  const feed45 = path.join(dir, 'feed-1080x1350.jpg');
  await writeJpeg(
    img().resize(1080, 1350, {
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: false,
    }),
    feed45,
    88,
  );

  // 4) 9:16 reference — contain person, neutral slate letterbox (no generative fill)
  const vert = path.join(dir, 'vertical-reference-1080x1920.jpg');
  await writeJpeg(
    img()
      .resize(1080, 1920, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 1 },
        withoutEnlargement: false,
      }),
    vert,
    88,
  );

  // 5) AI speaking reference — tight face-forward portrait
  const aiRef = path.join(dir, 'ai-speaking-reference.jpg');
  await writeJpeg(
    img().resize(1080, 1350, {
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: false,
    }),
    aiRef,
    90,
  );

  const files = {
    original: path.basename(originalPath),
    cleanMaster: 'clean-master.jpg',
    profile11: 'profile-1080x1080.jpg',
    feed45: 'feed-1080x1350.jpg',
    vertical: 'vertical-reference-1080x1920.jpg',
    aiReference: 'ai-speaking-reference.jpg',
  };

  const fileMeta = {};
  for (const [key, name] of Object.entries(files)) {
    const fp = path.join(dir, name);
    if (fs.existsSync(fp)) {
      fileMeta[key] = {
        path: `/assets/real-people/${slug}/${name}`,
        ...(await analyze(fp)),
      };
    }
  }

  // Per-person zip deferred to final pass (faster batch compression)
  return {
    slug,
    id: t.id,
    firstName: t.firstName,
    fullPublicName: t.fullPublicName,
    title: t.title,
    profileUrl: t.profileUrl,
    sourceCheckedAt: t.sourceCheckedAt || SOURCE_CHECKED_AT,
    sourceMeta,
    files: fileMeta,
    limitations,
    personZip: `/exports/real-people/${slug}-real-people-assets.zip`,
    zipError: null,
    notes: t.assetNotes || {},
    approvalStatus: t.approvalStatus || {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
  };
}

function CompressZip(sourceDir, destZip) {
  const src = sourceDir.replace(/'/g, "''");
  const dest = destZip.replace(/'/g, "''");
  const ps = `
    $ErrorActionPreference = 'Stop'
    if (Test-Path -LiteralPath '${dest}') { Remove-Item -LiteralPath '${dest}' -Force }
    Compress-Archive -Path (Join-Path '${src}' '*') -DestinationPath '${dest}' -CompressionLevel Fastest
  `;
  const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], {
    encoding: 'utf8',
    timeout: 120000,
  });
  if (r.status !== 0) {
    return { ok: false, error: (r.stderr || r.stdout || 'zip failed').slice(0, 300) };
  }
  return { ok: true };
}

export async function generateRealPeopleAssets() {
  ensureDir(BASE);
  ensureDir(ZIP_OUT);

  const catalog = {
    generatedAt: new Date().toISOString().slice(0, 10),
    sourceCheckedAt: SOURCE_CHECKED_AT,
    people: [],
  };

  for (const t of TALENT) {
    console.log(`Assets: ${t.firstName} (${t.assetSlug || t.id})`);
    const row = await processPerson(t);
    catalog.people.push(row);
  }

  console.log('Rendering Treatment C polished ad PNGs…');
  catalog.treatmentCAds = await renderTreatmentCAds();

  console.log('Zipping per-person packs…');
  for (const t of TALENT) {
    const slug = t.assetSlug || t.id;
    const dir = path.join(BASE, slug);
    const personZip = path.join(ZIP_OUT, `${slug}-real-people-assets.zip`);
    const z = CompressZip(dir, personZip);
    const person = catalog.people.find((p) => p.slug === slug);
    if (person) {
      person.personZip = z.ok ? `/exports/real-people/${slug}-real-people-assets.zip` : null;
      person.zipError = z.ok ? null : z.error;
    }
    console.log(`  zip ${slug}: ${z.ok ? 'ok' : z.error}`);
  }

  console.log('Zipping master pack…');
  const masterZip = path.join(ZIP_OUT, 'all-real-people-assets.zip');
  const staging = path.join(ZIP_OUT, '_staging-all');
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
  ensureDir(staging);
  for (const t of TALENT) {
    const slug = t.assetSlug || t.id;
    const src = path.join(BASE, slug);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(staging, slug), { recursive: true });
  }
  const master = CompressZip(staging, masterZip);
  fs.rmSync(staging, { recursive: true, force: true });
  catalog.masterZip = master.ok ? '/exports/real-people/all-real-people-assets.zip' : null;
  catalog.masterZipError = master.ok ? null : master.error;

  const catalogPath = path.join(ZIP_OUT, 'real-people-assets-catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  console.log(`Wrote ${catalogPath}`);
  console.log(`Master ZIP: ${catalog.masterZip || catalog.masterZipError}`);
  return catalog;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  generateRealPeopleAssets().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
