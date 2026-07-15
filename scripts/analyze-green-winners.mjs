/**
 * Reverse-engineer the two running green winners (VMA-01 SpanishGreen, VMA-04 HIPAAGreen).
 * Samples exact colors + headline geometry from the actual final creatives — no guessing.
 * Run: node scripts/analyze-green-winners.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'public/exports/vma-masters');
const TARGETS = [
  { id: 'VMA-01 SpanishGreen', file: 'MV_VMA_01_SpanishGreen_1x1.png' },
  { id: 'VMA-04 HIPAAGreen', file: 'MV_VMA_04_HIPAAGreen_1x1.png' },
];

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
function luminance(r, g, b) { return 0.2126 * r + 0.7152 * g + 0.114 * b; }

async function analyze(t) {
  const buf = fs.readFileSync(path.join(DIR, t.file));
  const meta = await sharp(buf).metadata();
  const W = meta.width, H = meta.height;
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const px = (x, y) => { const i = (y * W + x) * ch; return [data[i], data[i + 1], data[i + 2]]; };

  // ---- color buckets ----
  const buckets = new Map();
  const lime = { r: 0, g: 0, b: 0, n: 0 };
  const cyan = { r: 0, g: 0, b: 0, n: 0 };
  const white = { r: 0, g: 0, b: 0, n: 0 };
  let darkN = 0, totalN = 0, lumSum = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const [r, g, b] = px(x, y);
      totalN++; lumSum += luminance(r, g, b);
      const key = `${r >> 5},${g >> 5},${b >> 5}`;
      const bk = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
      bk.r += r; bk.g += g; bk.b += b; bk.n++; buckets.set(key, bk);
      if (r < 40 && g < 40 && b < 40) darkN++;
      // lime: green dominant, red mid, blue low
      if (g > 150 && g - b > 70 && g - r > 30 && b < 130) { lime.r += r; lime.g += g; lime.b += b; lime.n++; }
      // cyan: blue+green high, red low
      if (b > 170 && g > 150 && r < 140 && b - r > 70) { cyan.r += r; cyan.g += g; cyan.b += b; cyan.n++; }
      // near white
      if (r > 225 && g > 225 && b > 225) { white.r += r; white.g += g; white.b += b; white.n++; }
    }
  }
  const top = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 6)
    .map((bk) => ({ hex: hex(bk.r / bk.n, bk.g / bk.n, bk.b / bk.n), pct: +(100 * bk.n / totalN).toFixed(1) }));
  const avg = (o) => o.n ? hex(o.r / o.n, o.g / o.n, o.b / o.n) : null;

  // ---- headline bbox: bright (white OR lime) pixels in the top-left text zone ----
  // Restrict to left 58% width & top 62% height to exclude the person (right) and lower chips.
  const xMax = Math.floor(W * 0.58), yMax = Math.floor(H * 0.62);
  let minX = W, minY = H, maxX = 0, maxY = 0, hits = 0;
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < xMax; x++) {
      const [r, g, b] = px(x, y);
      const isWhite = r > 210 && g > 210 && b > 210;
      const isLime = g > 150 && g - b > 70 && g - r > 20;
      if (isWhite || isLime) { hits++; if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
    }
  }
  const bbox = {
    xPct: +(100 * minX / W).toFixed(1), yPct: +(100 * minY / H).toFixed(1),
    wPct: +(100 * (maxX - minX) / W).toFixed(1), hPct: +(100 * (maxY - minY) / H).toFixed(1),
    coveragePct: +(100 * hits / (xMax * yMax)).toFixed(1),
  };

  return {
    id: t.id, file: t.file, dimensions: `${W}x${H}`,
    background: { darkPct: +(100 * darkN / totalN).toFixed(1), meanLuminance: +(lumSum / totalN).toFixed(1) },
    topColors: top,
    sampled: { lime: avg(lime), limePixels: lime.n, cyan: avg(cyan), cyanPixels: cyan.n, white: avg(white) },
    headlineBBox: bbox,
  };
}

const out = [];
for (const t of TARGETS) out.push(await analyze(t));
fs.writeFileSync(path.join(DIR, 'green-winner-style-profile.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
