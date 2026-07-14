/**
 * Creative Lab hub — experiments only. Regenerate: npm run generate:ideas
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background: #f3f7fa;
    line-height: 1.5;
  }
  main { max-width: 900px; margin: 0 auto; padding: 1.4rem 1.1rem 4rem; }
  .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.55rem, 3.4vw, 2.1rem); letter-spacing: -0.03em; }
  .hero p { margin: 0 0 1rem; max-width: 40rem; color: #405766; }
  .banner {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #9a3412;
    border-radius: 12px;
    padding: 0.75rem 0.95rem;
    margin-bottom: 1.2rem;
    font-size: 0.92rem;
  }
  .lanes {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 700px) { .lanes { grid-template-columns: 1fr; } }
  .lane {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 12px;
    padding: 0.95rem 1rem;
    text-decoration: none;
    color: inherit;
  }
  .lane:hover { border-color: ${BRAND.colors.main02}; }
  .lane h3 { margin: 0 0 0.3rem; font-size: 1rem; }
  .lane p { margin: 0; font-size: 0.86rem; color: #516472; }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Creative Lab · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'ideas',
    pageTitle: 'Creative Lab',
    pageSubtitle: 'Experimental tools — not the current brief.',
  })}
  <main>
    <header class="hero">
      <h1>Creative Lab</h1>
      <p>Test future directions here. Current production work lives on the Brief and Video pages.</p>
    </header>
    <p class="banner">If you have an open Brief assignment, finish that before spending time in the lab.</p>
    <div class="lanes">
      <a class="lane" href="/competitors.html"><h3>Competitors</h3><p>Steal energy, reject trade dress, remix for MedVirtual.</p></a>
      <a class="lane" href="/creative-concept-lab.html"><h3>Static Concepts</h3><p>Four polished mockups at a time · export PNG · promote to video.</p></a>
      <a class="lane" href="/motion-concept-lab.html"><h3>Motion Concepts</h3><p>Short Remotion previews and static cutdowns.</p></a>
      <a class="lane" href="/video-production.html"><h3>Real People Video</h3><p>Capture briefs and production templates (first-class lane).</p></a>
      <a class="lane" href="/mockup-sandbox.html"><h3>Sandbox</h3><p>Quick editable forks for experiments.</p></a>
      <a class="lane" href="/saas-prop-templates.html"><h3>SaaS Props</h3><p>No-people ops visuals with staffing-true support copy.</p></a>
    </div>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'ideas.html'), html);
console.log('Creative Lab hub written');
