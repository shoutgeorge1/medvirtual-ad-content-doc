/**
 * Extract clean, TEXT-FREE pink-scrubs admin photo layers from the existing
 * approved Athena renders (the right side of the 1:1 and wide creatives has the
 * admin + office and no text). These become reusable "person" elements for the
 * layered composer — text/badges are drawn in code, never baked in.
 *
 * Output → public/assets/athena-elements/person-pink-*.png
 * Run: node scripts/athena-crop-person.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUT_DIR = 'public/assets/athena-elements';
fs.mkdirSync(OUT_DIR, { recursive: true });

const SRC_SQUARE = 'public/exports/athena-pink/ATH_01_PinkCore_1x1.png'; // 1080x1080
const SRC_WIDE = 'public/exports/athena-pink/ATH_01_PinkCore_1.91x1.png'; // 1200x628

async function crop(src, region, out) {
  const meta = await sharp(src).metadata();
  const left = Math.round(region.leftPct * meta.width);
  const top = Math.round((region.topPct ?? 0) * meta.height);
  const width = Math.round(region.widthPct * meta.width);
  const height = Math.round((region.heightPct ?? 1) * meta.height);
  await sharp(src)
    .extract({ left, top, width, height })
    .png()
    .toFile(path.join(OUT_DIR, out));
  console.log(`OK  ${out}  ${width}x${height}  from ${path.basename(src)}`);
}

async function main() {
  // Portrait-ish person for 1:1 / 4:5 / 9:16 (right side of the square render,
  // past the diagonal so no baked headline text is included).
  await crop(SRC_SQUARE, { leftPct: 0.54, widthPct: 0.46 }, 'person-pink-portrait.png');
  // Wide person for 1.91:1 (right side of the wide render).
  await crop(SRC_WIDE, { leftPct: 0.48, widthPct: 0.52 }, 'person-pink-wide.png');
  console.log('DONE — person elements cropped.');
}

main();
