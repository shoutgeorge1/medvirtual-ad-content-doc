/**
 * Raw Assets — brand logos + AI image downloads for editors.
 * Do not expose ZIP archives, .ai, DOCX, XLSX, or font download links.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const AI = path.join(PUBLIC, 'assets', 'ai-images');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp|avif)$/i.test(f))
    .sort();
}

const HERO = [
  { file: 'ai-generated-03.png', note: 'Missed Calls · T1' },
  { file: 'ai-generated-07.png', note: 'Remote MA · first video seed' },
  { file: 'ai-generated-10.png', note: 'Front Desk · T1' },
  { file: 'ai-generated-15.png', note: 'Front Desk alt · T1' },
  { file: 'ai-generated-13.png', note: 'Remote MA alt · T2' },
  { file: 'ai-generated-14.png', note: 'Admin backlog · T2' },
  { file: 'ai-generated-09.png', note: 'Scheduling · T1' },
  { file: 'ai-generated-04.png', note: 'Workflow · T2' },
  { file: 'ai-generated-08.png', note: 'Center / explainer' },
];

const BRAND_DOWNLOADS = [
  { href: BRAND.assets.logoColoredSvg, name: 'logo-colored.svg', note: 'Colored horizontal · preferred web' },
  { href: BRAND.assets.logoWhiteSvg, name: 'logo-white.svg', note: 'White horizontal · dark backgrounds' },
  { href: BRAND.assets.logomarkColoredSvg, name: 'logomark-colored.svg', note: 'Colored mark' },
  { href: BRAND.assets.logomarkWhiteSvg, name: 'logomark-white.svg', note: 'White mark' },
  { href: BRAND.assets.logoColoredPng, name: 'logo-colored.png', note: 'PNG fallback (raster)' },
  { href: BRAND.assets.linkedinBannerRef, name: 'linkedin-banner-reference.png', note: 'LinkedIn banner reference' },
  { href: BRAND.assets.storyGradientRef, name: 'story-gradient-reference.png', note: 'Stories gradient reference' },
  { href: BRAND.assets.brandKitRef, name: 'brand-kit-reference.png', note: 'Brand Kit board reference' },
];

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--mv-font); background: var(--mv-neutral-blue); color: var(--mv-ink); line-height: 1.5; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
  .note {
    background: #fff; border: 1px solid #d7e3f0; border-radius: 10px;
    padding: 1rem 1.15rem; margin-bottom: 1.25rem; font-size: 0.9rem; color: #3d4f5f;
  }
  .note strong { color: var(--mv-ink); }
  .links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
  .links a {
    padding: 0.55rem 1rem; border-radius: 8px; background: var(--mv-deep-teal); color: #fff;
    text-decoration: none; font-size: 0.85rem; font-weight: 600;
  }
  .links a.secondary { background: #fff; color: var(--mv-deep-teal); border: 1px solid #cbd5e1; }
  h3 {
    font-size: 0.95rem; margin: 0 0 0.65rem; padding-bottom: 0.35rem;
    border-bottom: 2px solid var(--mv-cyan); color: var(--mv-deep-teal); font-weight: 700;
  }
  .hint { font-size: 0.8rem; color: #5a6b78; margin-bottom: 0.75rem; }
  .tokens {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.45rem;
    margin-bottom: 1rem;
  }
  .token {
    border-radius: 8px; overflow: hidden; border: 1px solid #d7e3f0; background: #fff; font-size: 0.7rem;
  }
  .token__chip { height: 36px; }
  .token__meta { padding: 0.35rem 0.45rem; }
  .token__meta code { font-size: 0.62rem; color: var(--mv-primary); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.55rem; }
  a.file {
    display: block; background: #fff; border: 1px solid #d7e3f0; border-radius: 8px;
    padding: 0.75rem 0.85rem; text-decoration: none; color: inherit;
  }
  a.file:hover { border-color: var(--mv-cyan); }
  a.file .n { font-family: ui-monospace, monospace; font-size: 0.72rem; font-weight: 650; word-break: break-all; }
  a.file .d { font-size: 0.72rem; color: #5a6b78; margin-top: 0.2rem; }
  .path { font-family: ui-monospace, monospace; font-size: 0.72rem; color: var(--mv-primary); }
  .warn {
    font-size: 0.8rem; color: #92400e; background: #fffbeb; border: 1px solid #fcd34d;
    border-radius: 8px; padding: 0.55rem 0.7rem; margin: 0.75rem 0 1rem;
  }
`;

function main() {
  const all = listFiles(AI);
  const heroSet = new Set(HERO.map((h) => h.file));
  const rest = all.filter((f) => !heroSet.has(f));

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Assets — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'hub',
    pageTitle: 'Asset Hub',
    pageSubtitle: 'Official brand downloads + raw AI masters. No strategy docs or font archives.',
  })}
  <div class="wrap">
    <div class="note">
      <strong>Graphics:</strong> start with the <a href="/graphic-request-brief.html">Brief</a>.
      Brand rules: <a href="/medvirtual-brand-guide.html">Brand Guide</a>.
      Crops: <a href="/image-variation-review.html">Image Review</a>.
    </div>
    <div class="links">
      <a href="/medvirtual-brand-guide.html">Brand Guide</a>
      <a class="secondary" href="/graphic-request-brief.html">Brief</a>
      <a class="secondary" href="/image-variation-review.html">Image Review</a>
    </div>

    <h3>Official MedVirtual brand</h3>
    <p class="hint">Folder: <span class="path">public/assets/brand/medvirtual/</span> — SVG preferred. Fonts load via CSS on pages; font files are not offered as downloads here.</p>
    <div class="warn">Do not publish internal GTM, SDR intake, Word, Excel, Illustrator, or ZIP source archives from this hub.</div>
    <div class="tokens">
      ${[
        ['Main 01', BRAND.colors.main01],
        ['Main 02', BRAND.colors.main02],
        ['Main 03', BRAND.colors.main03],
        ['Accent 01', BRAND.colors.accent01],
        ['Accent 02', BRAND.colors.accent02],
        ['Neutral 01', BRAND.colors.neutral01],
        ['Neutral 02', BRAND.colors.neutral02],
      ]
        .map(
          ([n, hex]) => `<div class="token">
        <div class="token__chip" style="background:${esc(hex)}"></div>
        <div class="token__meta">${esc(n)}<br /><code>${esc(hex)}</code></div>
      </div>`,
        )
        .join('')}
    </div>
    <div class="grid">
      ${BRAND_DOWNLOADS.map(
        (b) =>
          `<a class="file" href="${esc(b.href)}" download target="_blank" rel="noopener">
            <div class="n">${esc(b.name)}</div>
            <div class="d">${esc(b.note)}</div>
          </a>`,
      ).join('')}
    </div>
    <p class="hint" style="margin-top:0.75rem">Typography: Be Vietnam Bold / Medium / Regular + Inter, Arial fallbacks. See Brand Guide — do not ship font ZIP downloads.</p>

    <h3 style="margin-top:1.75rem">Hero raw masters</h3>
    <p class="hint">Folder: <span class="path">public/assets/ai-images/</span> — full-res sources for Remotion / Premiere.</p>
    <div class="grid">
      ${HERO.filter((h) => all.includes(h.file))
        .map(
          (h) =>
            `<a class="file" href="/assets/ai-images/${esc(h.file)}" target="_blank" rel="noopener">
              <div class="n">${esc(h.file)}</div>
              <div class="d">${esc(h.note)}</div>
            </a>`,
        )
        .join('')}
    </div>

    ${
      rest.length
        ? `<h3 style="margin-top:1.5rem">Other sources</h3>
    <div class="grid">
      ${rest
        .map(
          (f) =>
            `<a class="file" href="/assets/ai-images/${esc(f)}" target="_blank" rel="noopener">
              <div class="n">${esc(f)}</div>
            </a>`,
        )
        .join('')}
    </div>`
        : ''
    }
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'asset-hub.html'), html);
  console.log(`Asset Hub: http://localhost:5173/asset-hub.html (${all.length} AI files)`);
}

main();
