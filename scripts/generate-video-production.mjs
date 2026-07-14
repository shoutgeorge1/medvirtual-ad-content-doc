/**
 * Real People Video page — Vite MPA shell + remotion preview.
 * Regenerate: npm run generate:video
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { videoClientPayload } from './video-production-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

await import('./generate-video-production-data.mjs');

const payload = videoClientPayload();
const jsonPath = path.join(ROOT, 'public', 'assets', 'concept-lab', 'video-payload.json');
const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const fullPayload = { ...payload, ...existing };

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Video Capture · MedVirtual</title>
  <style>
    ${HEADER_CSS}
    body {
      margin: 0;
      font-family: ${BRAND.fonts.family};
      background:
        radial-gradient(ellipse 70% 40% at 100% 0%, rgba(0,178,226,0.1), transparent 55%),
        #eef3f7;
      color: ${BRAND.colors.ink};
    }
    @media print {
      .doc-header, .vpl-toolbar, .vpl-stages, #templates, .vpl-actions button:not(:first-child) { display: none !important; }
      .vpl-brief-out { max-height: none; border: none; }
    }
  </style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'video',
    pageTitle: 'Video Capture',
    pageSubtitle: 'Capture briefs and shot lists. Remotion previews are references — not the required editing platform.',
  })}
  <div id="video-lab-root"></div>
  <script>
    window.MV_VIDEO_LAB = ${JSON.stringify(fullPayload)};
  </script>
  <script type="module" src="/src/video-lab-entry.jsx"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'video-production.html'), html);
console.log('video-production.html written');
