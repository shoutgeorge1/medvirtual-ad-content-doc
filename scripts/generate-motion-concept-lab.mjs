/**
 * Motion Concept Lab shell — Vite MPA entry with shared doc header.
 * Regenerate: npm run generate:motion-lab
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Ensure motion defaults exist
await import('./generate-motion-concept-data.mjs');

const css = `
  ${HEADER_CSS}
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Motion Mock References · MedVirtual</title>
  <style>${css}
    body {
      margin: 0;
      font-family: ${BRAND.fonts.family};
      color: ${BRAND.colors.ink};
      background:
        radial-gradient(ellipse 70% 40% at 0% 0%, rgba(7,121,153,0.14), transparent 55%),
        #eef3f7;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js"></script>
</head>
<body class="mcl-shell-body">
  ${renderDocHeader({
    activeId: 'motion-lab',
    pageTitle: 'Motion Mock References',
    pageSubtitle: 'Producer motion prototypes — reference only. Video team may rebuild in CapCut / Premiere / AE.',
  })}
  <div id="motion-lab-root"></div>
  <script type="module" src="/src/motion-lab-entry.jsx"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'motion-concept-lab.html'), html);
console.log('Motion Concept Lab written → motion-concept-lab.html');
