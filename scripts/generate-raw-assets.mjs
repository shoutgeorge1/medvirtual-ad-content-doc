/**
 * Graphics-facing Raw Asset Library index.
 * Regenerate: npm run generate:raw-assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

const categories = [
  {
    title: 'Actual Talent',
    href: '/real-people-assets.html',
    note: 'Named people photo packs — public-safe downloads.',
  },
  {
    title: 'People treatments',
    href: '/real-people-creative.html',
    note: 'Finished Treatment E examples to match visually (rebuild in your tools).',
  },
  {
    title: 'Approved image board',
    href: '/image-variation-review.html',
    note: 'Reviewed photography and crops for ads.',
  },
  {
    title: 'AI-approved raw images',
    href: '/assets/ai-approved/manifest.json',
    note: 'Producer-approved AI plates (no ad text). Prefer folder sync from Foundry.',
  },
  {
    title: 'Operations / SaaS prop refs',
    href: '/saas-prop-templates.html',
    note: 'Producer reference lane — props without people. Rebuild finals offline.',
  },
  {
    title: 'Logos & brand files',
    href: '/asset-hub.html',
    note: 'Official SVG logos, fonts, production packages.',
  },
  {
    title: 'Brand colors & claims',
    href: '/medvirtual-brand-guide.html',
    note: 'Colors, Be Vietnam, service model language.',
  },
];

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
  .hero p { margin: 0 0 1rem; max-width: 42rem; color: #405766; }
  .banner {
    background: #ecfeff;
    border: 1px solid #a5f3fc;
    color: #0e7490;
    border-radius: 12px;
    padding: 0.75rem 0.95rem;
    margin-bottom: 1.2rem;
    font-size: 0.92rem;
  }
  .grid { display: grid; gap: 0.7rem; }
  .card {
    background: #fff;
    border: 1px solid #d5e2ea;
    border-radius: 12px;
    padding: 0.95rem 1rem;
    text-decoration: none;
    color: inherit;
  }
  .card:hover { border-color: ${BRAND.colors.main02}; }
  .card h2 { margin: 0 0 0.25rem; font-size: 1.02rem; }
  .card p { margin: 0; font-size: 0.86rem; color: #516472; }
  .fine { margin-top: 1.25rem; font-size: 0.84rem; color: #64748b; }
`;

const cards = categories
  .map(
    (c) =>
      `<a class="card" href="${c.href}"><h2>${c.title}</h2><p>${c.note}</p></a>`,
  )
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Raw Assets · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'raw-assets',
    pageTitle: 'Raw Assets',
    pageSubtitle: 'Photos, logos, props, and plates — download pieces and build finals in your normal design tools.',
  })}
  <main>
    <header class="hero">
      <h1>Raw production materials</h1>
      <p>These are components and references — not finished Meta ads. Use the Brief for which files apply to each assignment.</p>
    </header>
    <p class="banner">AI-generated images must not contain headlines, CTAs, logos, or readable UI. Typography and buttons belong in your design tool (or the separate copy on the Brief).</p>
    <div class="grid">${cards}</div>
    <p class="fine">Folder convention for AI-approved sync: <code>public/assets/ai-approved/</code> · real-va · operations · props · dental · medical · billing · backgrounds · experimental</p>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'raw-assets.html'), html);
console.log('Raw Assets page written');
