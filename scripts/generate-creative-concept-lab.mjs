/**
 * Creative Concept Lab — four static Meta ad concepts at a time.
 * Regenerate: npm run generate:creative-lab
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { clientPayload } from './concept-lab-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const ASSET_DIR = path.join(PUBLIC, 'assets', 'concept-lab');

const payload = clientPayload();
fs.writeFileSync(path.join(ASSET_DIR, 'payload.json'), JSON.stringify(payload, null, 2));

const css = `
  ${HEADER_CSS}
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 70% 40% at 100% 0%, rgba(0,178,226,0.12), transparent 55%),
      #eef3f7;
    line-height: 1.45;
  }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Static Mock References · MedVirtual</title>
  <link rel="stylesheet" href="/assets/concept-lab/concept-lab.css" />
  <style>${css}</style>
  <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js"></script>
</head>
<body>
  ${renderDocHeader({
    activeId: 'creative-lab',
    pageTitle: 'Static Mock References',
    pageSubtitle: 'Producer art-direction prototypes — not final production artwork. Graphics may rebuild in their own tools.',
  })}
  <main class="ccl-page">
    <header class="ccl-hero">
      <h1>Static Mock References</h1>
      <p>Composition and copy-length prototypes for Hailey approval. Separate raw images and copy for handoff — do not treat PNG exports as mandatory final files.</p>
    </header>

    <div class="ccl-toolbar" role="toolbar" aria-label="Batch tools">
      <button type="button" class="primary" id="ccl-reseed">Reseed Four Concepts</button>
      <button type="button" id="ccl-export-all-png">Download all four PNGs</button>
      <button type="button" id="ccl-export-batch">Export batch JSON</button>
      <button type="button" id="ccl-import-batch">Import batch JSON</button>
      <input type="file" id="ccl-import-file" accept="application/json,.json" hidden />
      <button type="button" id="ccl-reset-batch">Reset entire batch</button>
      <a class="ccl-btn" href="/motion-concept-lab.html">Motion References</a>
      <a class="ccl-btn" href="/competitors.html">Competitor Wall</a>
      <a class="ccl-btn" href="/mockup-sandbox.html">Sandbox</a>
      <a class="ccl-btn" href="/ideas.html">Producer Lab</a>
    </div>

    <div id="ccl-root" class="ccl-batch" aria-live="polite"></div>
  </main>

  <div class="ccl-toast" id="ccl-toast" role="status" aria-live="polite"></div>
  <dialog class="ccl-dialog" id="ccl-confirm" aria-labelledby="ccl-confirm-title">
    <div class="inner">
      <h3 id="ccl-confirm-title">Confirm</h3>
      <p data-msg></p>
      <div class="row">
        <button type="button" data-cancel>Cancel</button>
        <button type="button" class="primary" data-ok>Continue</button>
      </div>
    </div>
  </dialog>

  <script>
    window.MV_CONCEPT_LAB = ${JSON.stringify(payload)};
  </script>
  <script src="/assets/concept-lab/creative-lab.js" defer></script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'creative-concept-lab.html'), html);
console.log('Creative Concept Lab written → public/creative-concept-lab.html');
