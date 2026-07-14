/**
 * Generate AI Asset Foundry shell page (Vite MPA entry).
 * npm run generate:foundry
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const css = `
${HEADER_CSS}
body {
  margin: 0;
  font-family: "Be Vietnam", Inter, Arial, sans-serif;
  color: #161511;
  background:
    radial-gradient(ellipse 70% 40% at 0% 0%, rgba(7,121,153,0.12), transparent 55%),
    #eef3f7;
}
`;

function fonts() {
  return `
@font-face {
  font-family: 'Be Vietnam';
  src: url('/assets/brand/medvirtual/fonts/BeVietnam-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam';
  src: url('/assets/brand/medvirtual/fonts/BeVietnam-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam';
  src: url('/assets/brand/medvirtual/fonts/BeVietnam-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>AI Asset Foundry · MedVirtual</title>
  <style>
${fonts()}
${HEADER_CSS}
body {
  margin: 0;
  font-family: "Be Vietnam", Inter, Arial, sans-serif;
  color: #161511;
  background:
    radial-gradient(ellipse 70% 40% at 0% 0%, rgba(7,121,153,0.12), transparent 55%),
    #eef3f7;
}
  </style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'foundry',
    pageTitle: 'AI Asset Foundry',
    pageSubtitle: 'Raw visual components only — no headlines, CTAs, or logos inside images. Designers assemble finals offline.',
  })}
  <div id="foundry-root"></div>
  <script type="module" src="/src/foundry/foundry-entry.jsx"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'ai-asset-foundry.html'), html);
console.log('Wrote ai-asset-foundry.html');
