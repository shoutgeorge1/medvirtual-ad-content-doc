/**
 * Competitor Wall — intel board for designers.
 * npm run generate:competitors
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  COMPETITOR_ADS,
  COMPETITOR_META,
  WEEKLY_FORK_PROMPTS,
  adLibraryUrl,
} from './competitor-ads-data.mjs';
import { GRAPHICS_REQUEST_EMAIL } from './creative-hopper-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const ASSETS = path.join(PUBLIC, 'assets', 'competitors');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

fs.mkdirSync(ASSETS, { recursive: true });
const readmePath = path.join(ASSETS, 'README.md');
if (!fs.existsSync(readmePath)) {
  fs.writeFileSync(
    readmePath,
    `# Competitor screenshots\n\nDrop files as \`{id}.jpg\` matching IDs in \`scripts/competitor-ads-data.mjs\`\n(e.g. \`hello-rache.jpg\`). Then set \`image: '/assets/competitors/{id}.jpg'\` and run \`npm run generate:competitors\`.\n`,
  );
}

function hasImage(ad) {
  if (ad.image) {
    const disk = path.join(PUBLIC, ad.image.replace(/^\//, ''));
    return fs.existsSync(disk);
  }
  const guess = path.join(ASSETS, `${ad.id}.jpg`);
  if (fs.existsSync(guess)) return `/assets/competitors/${ad.id}.jpg`;
  const guessPng = path.join(ASSETS, `${ad.id}.png`);
  if (fs.existsSync(guessPng)) return `/assets/competitors/${ad.id}.png`;
  return null;
}

function renderCard(ad) {
  const img = hasImage(ad) || ad.image || null;
  const lib = adLibraryUrl(ad.adLibraryQuery);
  const visual = img
    ? `<a class="shot" href="${esc(lib)}" target="_blank" rel="noopener"><img src="${esc(img)}" alt="${esc(ad.name)} ad screenshot" /></a>`
    : `<a class="shot placeholder" href="${esc(lib)}" target="_blank" rel="noopener">
         <span class="ph-name">${esc(ad.name)}</span>
         <span class="ph-hint">Open Ad Library → screenshot → drop into assets/competitors/${esc(ad.id)}.jpg</span>
       </a>`;

  return `<article class="card" id="${esc(ad.id)}" data-category="${esc(ad.category)}">
    ${visual}
    <div class="body">
      <div class="top">
        <h3>${esc(ad.name)}</h3>
        <span class="cat">${esc(ad.category)}</span>
      </div>
      <p class="why">${esc(ad.whyWatch)}</p>
      <dl class="fp">
        <div><dt>Hook</dt><dd>${esc(ad.fingerprint.hookStyle)}</dd></div>
        <div><dt>Look</dt><dd>${esc(ad.fingerprint.visual)}</dd></div>
        <div><dt>Weakness</dt><dd>${esc(ad.fingerprint.weakness)}</dd></div>
      </dl>
      <div class="tri">
        <div><span class="lab steal">Steal</span><p>${esc(ad.steal)}</p></div>
        <div><span class="lab reject">Reject</span><p>${esc(ad.reject)}</p></div>
        <div><span class="lab remix">Remix for MV</span><p>${esc(ad.remix)}</p></div>
      </div>
      <div class="actions">
        <a class="btn primary" href="${esc(lib)}" target="_blank" rel="noopener">Meta Ad Library</a>
        <a class="btn" href="/mockup-sandbox.html?seed=${esc(ad.id)}">Try a mock-up</a>
      </div>
    </div>
  </article>`;
}

function renderForks() {
  return WEEKLY_FORK_PROMPTS.map(
    (f) => `<article class="fork">
      <h3>${esc(f.talent)} · ${esc(f.size)}</h3>
      <ul>
        <li><strong>Lookbook</strong> — ${esc(f.lookbook)}</li>
        <li><strong>Experiment</strong> — ${esc(f.experiment)}</li>
        <li><strong>SaaS</strong> — ${esc(f.saas)}</li>
      </ul>
      <a class="btn" href="/mockup-sandbox.html?fork=${esc(f.id)}">Open three forks in sandbox</a>
    </article>`,
  ).join('');
}

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background:
      radial-gradient(ellipse 70% 40% at 0% 0%, rgba(0,178,226,0.14), transparent 55%),
      #f3f7fa;
    line-height: 1.5;
  }
  main { max-width: 1100px; margin: 0 auto; padding: 1.35rem 1.1rem 4rem; }
  .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.7rem, 3.5vw, 2.3rem); letter-spacing: -0.03em; }
  .hero p { margin: 0 0 1rem; max-width: 46rem; color: #405766; font-size: 1.02rem; }
  .howto {
    background: #fff; border: 1px solid #d5e2ea; border-radius: 12px;
    padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.9rem; color: #405766;
  }
  .howto ol { margin: 0.4rem 0 0; padding-left: 1.2rem; }
  .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .filters button {
    font: inherit; font-size: 0.8rem; font-weight: 700; padding: 0.4rem 0.7rem;
    border-radius: 999px; border: 1px solid #cbd5e1; background: #fff; color: #0D546B; cursor: pointer;
  }
  .filters button.on { background: #077999; color: #fff; border-color: #077999; }
  .wall { display: grid; gap: 1rem; }
  .card {
    display: grid; grid-template-columns: minmax(160px, 220px) 1fr; gap: 0;
    background: #fff; border: 1px solid #d5e2ea; border-radius: 14px; overflow: hidden;
  }
  @media (max-width: 720px) { .card { grid-template-columns: 1fr; } }
  .shot { display: block; background: #0D546B; min-height: 220px; text-decoration: none; color: #fff; }
  .shot img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 220px; }
  .shot.placeholder {
    display: flex; flex-direction: column; justify-content: flex-end; gap: 0.4rem;
    padding: 1rem; background:
      linear-gradient(160deg, #0D546B 0%, #077999 50%, #00B2E2 100%);
  }
  .ph-name { font-size: 1.15rem; font-weight: 800; }
  .ph-hint { font-size: 0.78rem; opacity: 0.85; line-height: 1.35; }
  .body { padding: 1rem 1.05rem 1.1rem; }
  .top { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin-bottom: 0.35rem; }
  .top h3 { margin: 0; font-size: 1.15rem; }
  .cat {
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    background: #ecfeff; color: #0e7490; padding: 0.2rem 0.45rem; border-radius: 999px;
  }
  .why { margin: 0 0 0.65rem; font-size: 0.9rem; color: #516472; }
  .fp { margin: 0 0 0.75rem; display: grid; gap: 0.3rem; }
  .fp div { display: grid; grid-template-columns: 4.5rem 1fr; gap: 0.35rem; font-size: 0.84rem; }
  .fp dt { color: #64748b; font-weight: 700; }
  .fp dd { margin: 0; }
  .tri { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 0.85rem; }
  @media (max-width: 720px) { .tri { grid-template-columns: 1fr; } }
  .tri > div { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.55rem 0.65rem; }
  .tri p { margin: 0.25rem 0 0; font-size: 0.82rem; color: #334155; }
  .lab { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
  .lab.steal { color: #047857; }
  .lab.reject { color: #b91c1c; }
  .lab.remix { color: #077999; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .btn {
    display: inline-flex; align-items: center; padding: 0.45rem 0.75rem; border-radius: 8px;
    border: 1px solid #cbd5e1; background: #fff; color: #0D546B; font: inherit; font-size: 0.82rem;
    font-weight: 700; text-decoration: none;
  }
  .btn.primary { background: #077999; border-color: #077999; color: #fff; }
  section { margin: 1.75rem 0; }
  section > h2 { margin: 0 0 0.35rem; font-size: 1.2rem; }
  section > .lede { margin: 0 0 0.85rem; color: #64748b; font-size: 0.94rem; }
  .forks { display: grid; gap: 0.75rem; grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 700px) { .forks { grid-template-columns: 1fr; } }
  .fork {
    background: #fff; border: 1px solid #d5e2ea; border-radius: 12px; padding: 1rem;
  }
  .fork h3 { margin: 0 0 0.45rem; font-size: 1.05rem; }
  .fork ul { margin: 0 0 0.75rem; padding-left: 1.1rem; font-size: 0.88rem; color: #334155; }
  .cta {
    background: linear-gradient(120deg, #0D546B, #077999); color: #fff;
    border-radius: 14px; padding: 1.1rem 1.15rem;
  }
  .cta h2 { margin: 0 0 0.35rem; }
  .cta p { margin: 0 0 0.75rem; color: rgba(255,255,255,0.88); }
  .cta .btn.primary { background: #fff; color: #0D546B; border-color: #fff; }
  .cta .btn:not(.primary) { background: transparent; color: #fff; border-color: rgba(255,255,255,0.45); }
  .card.is-hidden { display: none; }
`;

const mailto = `mailto:${GRAPHICS_REQUEST_EMAIL}?subject=${encodeURIComponent(
  'Competitor insight + mock idea',
)}&body=${encodeURIComponent('Competitor I studied:\\nSteal / Reject / Remix:\\nMock idea:\\n')}`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Competitor Wall · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'competitors',
    pageTitle: 'Competitor Wall',
    pageSubtitle: 'Steal structures · reject commodity · remix for MedVirtual',
  })}
  <main>
    <header class="hero">
      <h1>${esc(COMPETITOR_META.title)}</h1>
      <p>${esc(COMPETITOR_META.intro)}</p>
    </header>

    <div class="howto">
      <strong>How we keep this fresh</strong>
      <ol>${COMPETITOR_META.howToRefresh.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    </div>

    <div class="filters" role="group" aria-label="Filter by category">
      <button type="button" class="on" data-filter="all">All</button>
      <button type="button" data-filter="virtual-staffing">Virtual staffing</button>
      <button type="button" data-filter="practice-saas">Practice SaaS</button>
      <button type="button" data-filter="job-marketplace">Job marketplaces</button>
      <button type="button" data-filter="other">Other</button>
    </div>

    <div class="wall">
      ${COMPETITOR_ADS.map(renderCard).join('')}
    </div>

    <section>
      <h2>This week’s three forks</h2>
      <p class="lede">Same brief, three directions — Lookbook faithful, bold experiment, SaaS. Open them in the mock-up sandbox and send your favorite.</p>
      <div class="forks">${renderForks()}</div>
    </section>

    <section class="cta">
      <h2>Built a better remix?</h2>
      <p>Drop a note with the competitor + your mock angle. We’ll review with marketing and may promote winners into the Brief.</p>
      <a class="btn primary" href="${esc(mailto)}">Share your remix</a>
      <a class="btn" href="/mockup-sandbox.html">Open mock-up sandbox</a>
      <a class="btn" href="/ideas.html">Ideas Lab</a>
    </section>
  </main>
  <script>
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.card[data-category]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('on'));
        btn.classList.add('on');
        const f = btn.getAttribute('data-filter');
        cards.forEach((c) => {
          const show = f === 'all' || c.getAttribute('data-category') === f;
          c.classList.toggle('is-hidden', !show);
        });
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'competitors.html'), html);
console.log(`Competitor Wall · ${COMPETITOR_ADS.length} cards`);
