/**
 * Wave 1 plate generator — OpenAI Images API.
 * Generates N clean visual BACKGROUND plates per concept (no baked-in text).
 *
 * Run (key required):
 *   node --env-file=.env.local scripts/generate-wave1-plates.mjs --ratio=4x5 --candidates=3
 *
 * Args:
 *   --ratio=4x5|1x1|9x16|1.91x1   (default 4x5)
 *   --candidates=N                (default 3)
 *   --concepts=VMA-33,VMA-41      (default all five)
 *   --quality=low|medium|high     (default medium)
 *   --model=gpt-image-1           (default env OPENAI_IMAGE_MODEL || gpt-image-1)
 *
 * Output:
 *   public/exports/wave1-first-launch/plates/<ratio>/<CONCEPT>/candidate-<n>.png
 *   public/exports/wave1-first-launch/plates/<ratio>/manifest.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { CONCEPTS, RATIOS, plentyPrompt } from './wave1-creative-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function arg(name, def) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
}

const RATIO_KEY = arg('ratio', '4x5');
const CANDIDATES = Math.max(1, Number(arg('candidates', '3')));
const QUALITY = arg('quality', 'medium');
const MODEL = arg('model', process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1');
const ONLY = (arg('concepts', '') || '').split(',').map((s) => s.trim()).filter(Boolean);

if (!RATIOS[RATIO_KEY]) {
  console.error(`Invalid --ratio. Use one of: ${Object.keys(RATIOS).join(', ')}`);
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('\nOPENAI_API_KEY is missing.');
  console.error('Create .env.local with:  OPENAI_API_KEY=sk-...');
  console.error('Then run:  node --env-file=.env.local scripts/generate-wave1-plates.mjs\n');
  process.exit(2);
}

const ratio = RATIOS[RATIO_KEY];
const OUT = path.join(ROOT, 'public/exports/wave1-first-launch/plates', RATIO_KEY);
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const concepts = ONLY.length ? CONCEPTS.filter((c) => ONLY.includes(c.id)) : CONCEPTS;

async function genOne(prompt) {
  const res = await client.images.generate({
    model: MODEL,
    prompt,
    size: ratio.apiSize,
    quality: QUALITY,
    output_format: 'png',
    n: 1,
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error('Empty generation response');
  return { buffer: Buffer.from(b64, 'base64'), requestId: res._request_id || null };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = { ratio: RATIO_KEY, apiSize: ratio.apiSize, model: MODEL, quality: QUALITY, generatedAt: new Date().toISOString(), concepts: [] };
  let created = 0;
  let failed = 0;

  for (const c of concepts) {
    const dir = path.join(OUT, c.id);
    fs.mkdirSync(dir, { recursive: true });
    const entry = { id: c.id, color: c.color, candidates: [] };
    for (let i = 1; i <= CANDIDATES; i++) {
      const file = `candidate-${i}.png`;
      const prompt = plentyPrompt(c, RATIO_KEY, i);
      try {
        const { buffer, requestId } = await genOne(prompt);
        fs.writeFileSync(path.join(dir, file), buffer);
        entry.candidates.push({ file, bytes: buffer.length, requestId, prompt });
        created++;
        console.log(`  ${c.id} ${file} (${buffer.length} bytes)`);
      } catch (err) {
        failed++;
        const msg = String(err?.message || err).replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]').slice(0, 300);
        entry.candidates.push({ file, error: msg });
        console.error(`  ${c.id} ${file} FAILED: ${msg}`);
      }
    }
    manifest.concepts.push(entry);
  }

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nPlates for ${RATIO_KEY}: ${created} created, ${failed} failed.`);
  console.log(`Manifest: ${path.relative(ROOT, path.join(OUT, 'manifest.json'))}`);
  console.log('Next: pick a candidate per concept, then run composite-wave1.mjs.');
}

main().catch((e) => {
  console.error('Fatal:', String(e?.message || e).replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]'));
  process.exit(1);
});
