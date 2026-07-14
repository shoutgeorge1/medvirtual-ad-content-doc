/**
 * Producer Lab hub — George / Hailey tools (demoted for graphics team).
 * Regenerate: npm run generate:ideas
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

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
  .lane .tag {
    display: inline-block;
    margin-top: 0.45rem;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${BRAND.colors.main03};
  }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Producer Lab · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'ideas',
    pageTitle: 'Producer Lab',
    pageSubtitle: 'George / Hailey tools — raw materials and art-direction references, not designer editors',
  })}
  <main>
    <header class="hero">
      <h1>Producer Lab</h1>
      <p>Generate raw images, approve taste, and build rough mock references. The graphics team rebuilds finals in their own tools from the Brief.</p>
    </header>
    <p class="banner">Designers: if you have an open Brief assignment, finish that first. You do not need this lab to produce assigned work.</p>
    <div class="lanes">
      <a class="lane" href="/direct-response.html"><h3>Direct Response</h3><p>Current Meta strategy — bold medical admin ads, color tests, form, campaign plan.</p><span class="tag">Current</span></a>
      <a class="lane" href="/ai-asset-foundry.html"><h3>AI Asset Foundry</h3><p>Generate four raw images · review · approve · save plates with no ad text.</p><span class="tag">Producer</span></a>
      <a class="lane" href="/competitors.html"><h3>Competitors</h3><p>Steal energy as principles — never copy trade dress.</p><span class="tag">Producer</span></a>
      <a class="lane" href="/creative-concept-lab.html"><h3>Static References</h3><p>Art-direction mockups for composition and copy length — not final production artwork.</p><span class="tag">Reference</span></a>
      <a class="lane" href="/motion-concept-lab.html"><h3>Motion References</h3><p>Remotion previews for motion intent — not CapCut/Premiere.</p><span class="tag">Reference</span></a>
      <a class="lane" href="/mockup-sandbox.html"><h3>Sandbox</h3><p>Quick editable forks for producer experiments.</p><span class="tag">Producer</span></a>
      <a class="lane" href="/saas-prop-templates.html"><h3>SaaS Props</h3><p>Archived as primary Meta — no-people ops refs still available.</p><span class="tag">Archived primary</span></a>
      <a class="lane" href="/role-offer-templates.html"><h3>Role-Offer mockups</h3><p>Meet-layout references designers may rebuild offline.</p><span class="tag">Reference</span></a>
      <a class="lane" href="/raw-assets.html"><h3>Raw Assets</h3><p>Graphics-facing library of downloadable components.</p><span class="tag">Shared</span></a>
    </div>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'ideas.html'), html);
console.log('Producer Lab hub written');
