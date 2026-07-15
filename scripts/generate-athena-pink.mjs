/**
 * Athena "pink lane" creatives — the PINK lives in the actual ad image
 * (admin in pink scrubs + pink brand accents), NOT the review page.
 * Off-brand on purpose: this is a vendor gut-check for Athena only.
 *
 * Two concepts, each rendered native-ish per aspect ratio, then cropped to
 * exact Meta pixel sizes.
 *
 * Output → public/exports/athena-pink/<STEM>_<ratio>.png
 * Run: node --env-file=.env.local scripts/generate-athena-pink.mjs [stem-or-ratio-substring]
 */
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import sharp from 'sharp';

const OUT_DIR = 'public/exports/athena-pink';
fs.mkdirSync(OUT_DIR, { recursive: true });

const RULES =
  'Photoreal, bold, high-contrast, mobile-first direct-response healthcare ad. All on-image text must be spelled EXACTLY as written, no extra words, no lorem ipsum, no misspellings, no watermark, no fake logos, no readable patient data. Confident and modern.';

// Meta target pixel sizes + the generation canvas that best matches each ratio.
const RATIOS = {
  '1x1': { w: 1080, h: 1080, gen: '1024x1024' },
  '4x5': { w: 1080, h: 1350, gen: '1024x1536' },
  '9x16': { w: 1080, h: 1920, gen: '1024x1536' },
  '1.91x1': { w: 1200, h: 628, gen: '1536x1024' },
};

const LAYOUT = {
  '1x1': 'Square composition. Headline stacked in the upper-left, the admin on the right, price badge lower-left.',
  '4x5': 'Vertical composition. Headline across the top third, the admin filling the lower two-thirds, price badge mid-left.',
  '9x16':
    'Tall full-screen vertical. Keep the headline, the admin\'s face, and the badge inside the central area — leave clear margin in the top 15% and bottom 20% (Stories/Reels UI safe zone).',
  '1.91x1':
    'Wide horizontal banner. The admin on the right third, headline stacked on the left, price badge bottom-left. Keep everything within the middle band.',
};

const CONCEPTS = [
  {
    stem: 'ATH_01_PinkCore',
    name: 'Pink Core Hire',
    base:
      'A warm, credible female virtual medical administrator wearing bright PINK medical scrubs, smiling confidently with a headset, in a clean modern home office. Hot pink and magenta brand accents against a deep charcoal panel. A big heavy bold sans-serif headline reads "HIRE A VIRTUAL MEDICAL ADMIN" in white with the word "VIRTUAL" in hot pink. A pink rounded pill badge reads "$10/hr".',
  },
  {
    stem: 'ATH_02_PinkTrust',
    name: 'Pink Trust',
    base:
      'A friendly, trustworthy female virtual medical administrator wearing soft PINK medical scrubs, smiling at a laptop in a bright airy office with blush-pink and white tones. Clean pink and white design. A bold sans-serif headline reads "HIRE A VIRTUAL MEDICAL ADMIN" in charcoal with a hot-pink underline. A pink circular badge reads "$10/hr".',
  },
];

async function toRatio(buf, W, H) {
  const meta = await sharp(buf).metadata();
  const target = W / H;
  const gen = meta.width / meta.height;
  let cw = meta.width;
  let ch = meta.height;
  if (gen > target) cw = Math.round(meta.height * target);
  else if (gen < target) ch = Math.round(meta.width / target);
  const left = Math.round((meta.width - cw) / 2);
  const top = Math.round((meta.height - ch) / 2);
  return sharp(buf).extract({ left, top, width: cw, height: ch }).resize(W, H).png().toBuffer();
}

async function main() {
  const filter = (process.argv[2] || '').toLowerCase();
  const client = new OpenAI();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  let ok = 0;
  let total = 0;

  for (const concept of CONCEPTS) {
    for (const [ratio, spec] of Object.entries(RATIOS)) {
      const key = `${concept.stem}_${ratio}`.toLowerCase();
      if (filter && !key.includes(filter)) continue;
      total += 1;
      const t0 = Date.now();
      const prompt = `${concept.base} ${LAYOUT[ratio]} ${RULES}`;
      try {
        const res = await client.images.generate({
          model,
          prompt,
          size: spec.gen,
          quality: 'medium',
          n: 1,
        });
        const b64 = res.data?.[0]?.b64_json;
        if (!b64) throw new Error('empty response');
        const final = await toRatio(Buffer.from(b64, 'base64'), spec.w, spec.h);
        fs.writeFileSync(path.join(OUT_DIR, `${concept.stem}_${ratio}.png`), final);
        ok += 1;
        console.log(`OK  ${concept.stem}_${ratio}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      } catch (err) {
        console.log(`ERR ${concept.stem}_${ratio}: ${String(err?.message || err).slice(0, 180)}`);
      }
    }
  }
  console.log(`\nDONE — ${ok}/${total} pink creatives generated.`);
}

main();
