/**
 * Raw Assets — simple download page for video editors.
 * Right-click / open any file. Scale variations later once templates are locked.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

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

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.5; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 1.5rem 1.25rem 3rem; }
  .note {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 1rem 1.15rem; margin-bottom: 1.25rem; font-size: 0.9rem; color: #475569;
  }
  .note strong { color: #0f172a; }
  .links { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
  .links a {
    padding: 0.55rem 1rem; border-radius: 8px; background: #0f172a; color: #fff;
    text-decoration: none; font-size: 0.85rem; font-weight: 600;
  }
  .links a.secondary { background: #fff; color: #0f172a; border: 1px solid #cbd5e1; }
  h3 { font-size: 0.95rem; margin: 0 0 0.65rem; padding-bottom: 0.35rem; border-bottom: 2px solid #0d9488; }
  .hint { font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.55rem; }
  a.file {
    display: block; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 0.75rem 0.85rem; text-decoration: none; color: inherit;
  }
  a.file:hover { border-color: #0d9488; }
  a.file .n { font-family: ui-monospace, monospace; font-size: 0.72rem; font-weight: 650; word-break: break-all; }
  a.file .d { font-size: 0.72rem; color: #64748b; margin-top: 0.2rem; }
  .path { font-family: ui-monospace, monospace; font-size: 0.72rem; color: #0f766e; }
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
  <title>Raw Assets — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'hub',
    pageTitle: 'Raw Assets',
    pageSubtitle: 'Open or right-click → Save. For video editors. Crops live on Image Review.',
  })}
  <div class="wrap">
    <div class="note">
      <strong>Right now:</strong> lock Ad Copy + Template Tests. Scale image variations after.
      Video editors: grab masters below, or use <a href="/image-variation-review.html">Image Review</a> for approved crops.
    </div>
    <div class="links">
      <a href="/facebook-ad-copy.html">Ad Copy</a>
      <a href="/template-test-board.html">Template Tests</a>
      <a class="secondary" href="/image-variation-review.html">Image Review (crops)</a>
    </div>

    <h3>Hero raw masters</h3>
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

    <h3 style="margin-top:1.5rem">Logo</h3>
    <div class="grid">
      <a class="file" href="/assets/logo/medvirtual-logo.svg" target="_blank" rel="noopener"><div class="n">medvirtual-logo.svg</div></a>
      <a class="file" href="/assets/logo/medvirtual-logo-horizontal.png" target="_blank" rel="noopener"><div class="n">medvirtual-logo-horizontal.png</div></a>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'asset-hub.html'), html);
  console.log(`Raw Assets: http://localhost:5173/asset-hub.html (${all.length} AI files)`);
}

main();
