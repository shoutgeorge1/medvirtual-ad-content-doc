/**
 * Competitor Wall — LIVE Meta Ad Library creatives only.
 * Fake “drop a screenshot” frames are never shown.
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
import { loadLiveSnapshots } from './scrape-ad-library-helpers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const ASSETS = path.join(PUBLIC, 'assets', 'competitors');
const LIVE_DIR = path.join(ASSETS, 'live');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

fs.mkdirSync(LIVE_DIR, { recursive: true });

const LIVE = loadLiveSnapshots();

function liveFor(id) {
  return (LIVE.sources?.[id]?.ads || []).filter((a) => {
    if (!a.image) return false;
    const disk = path.join(PUBLIC, a.image.replace(/^\//, ''));
    return fs.existsSync(disk);
  });
}

function formatUpdated(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function renderLiveAd(ad, competitor) {
  const lib = ad.libraryId
    ? `https://www.facebook.com/ads/library/?id=${encodeURIComponent(ad.libraryId)}`
    : adLibraryUrl(competitor.adLibraryQuery);

  const metaBits = [
    ad.libraryId ? `Library ID ${esc(ad.libraryId)}` : null,
    ad.started ? `Started ${esc(ad.started)}` : null,
    ad.advertiser ? esc(ad.advertiser) : null,
  ].filter(Boolean);

  return `<article class="live-ad">
    <a class="creative" href="${esc(lib)}" target="_blank" rel="noopener">
      <img src="${esc(ad.image)}" alt="${esc(competitor.name)} Meta ad creative" />
    </a>
    <div class="live-copy">
      ${metaBits.length ? `<p class="live-meta">${metaBits.join(' · ')}</p>` : ''}
      ${ad.primaryText ? `<div class="field"><span class="fk">Primary text / hook</span><p>${esc(ad.primaryText)}</p></div>` : ''}
      ${ad.headline ? `<div class="field"><span class="fk">Headline</span><p>${esc(ad.headline)}</p></div>` : ''}
      ${ad.description ? `<div class="field"><span class="fk">Description</span><p>${esc(ad.description)}</p></div>` : ''}
      ${ad.cta ? `<div class="field"><span class="fk">CTA</span><p>${esc(ad.cta)}</p></div>` : ''}
      <div class="live-actions">
        <a class="btn primary" href="${esc(lib)}" target="_blank" rel="noopener">Open this ad</a>
        <a class="btn" href="/creative-concept-lab.html?competitor=${esc(competitor.id)}">Build Static Concept</a>
        <a class="btn" href="/mockup-sandbox.html?seed=${esc(competitor.id)}">Mock my own take</a>
        <a class="btn" href="mailto:${esc(GRAPHICS_REQUEST_EMAIL)}?subject=${encodeURIComponent('Pitch: ' + competitor.name + ' remix')}&body=${encodeURIComponent('Hey George!\n\nCompetitor: ' + competitor.name + '\nLibrary ID: ' + (ad.libraryId || '') + '\nHook I noticed: ' + (ad.primaryText || '').slice(0, 180) + '\n\nMy remix idea:\n\nThanks!\n')}">Pitch George</a>
      </div>
    </div>
  </article>`;
}

function renderCard(ad) {
  const liveAds = liveFor(ad.id);
  const lib = adLibraryUrl(ad.adLibraryQuery);
  const hasLive = liveAds.length > 0;

  if (!hasLive) {
    return `<article class="card empty-card" id="${esc(ad.id)}" data-category="${esc(ad.category)}" data-has-live="0">
      <div class="empty-body">
        <div class="top">
          <h3>${esc(ad.name)}</h3>
          <span class="cat warn">No live Meta creative yet</span>
        </div>
        <p class="why">${esc(ad.whyWatch)}</p>
        <p class="empty-note">We only show real Ad Library creatives here — not placeholder frames. As soon as a scrape finds active ads, they’ll land in this slot.</p>
        <div class="actions">
          <a class="btn primary" href="${esc(lib)}" target="_blank" rel="noopener">Check Ad Library now</a>
          <a class="btn" href="mailto:${esc(GRAPHICS_REQUEST_EMAIL)}?subject=${encodeURIComponent('Found ads for: ' + ad.name)}&body=${encodeURIComponent('Hey George!\n\nI found live ads for ' + ad.name + ' — Library links:\n\n')}">Email George a find</a>
        </div>
      </div>
    </article>`;
  }

  const strip = liveAds
    .slice(0, 4)
    .map(
      (a) =>
        `<a class="strip-shot" href="#ad-${esc(ad.id)}-${esc(a.libraryId || a.index)}" title="${esc((a.primaryText || '').slice(0, 80))}"><img src="${esc(a.image)}" alt="" /></a>`,
    )
    .join('');

  return `<article class="card" id="${esc(ad.id)}" data-category="${esc(ad.category)}" data-has-live="1">
    <header class="brand-head">
      <div>
        <div class="top">
          <h3>${esc(ad.name)}</h3>
          <span class="cat">${esc(ad.category)}</span>
          <span class="cat live">${liveAds.length} live ads</span>
        </div>
        <p class="why">${esc(ad.whyWatch)}</p>
      </div>
      <div class="strip">${strip}</div>
    </header>
    <div class="live-block" id="${esc(ad.id)}-live">
      <h4>See the ads</h4>
      <p class="live-lede">Creative still + hook + headline + description — scroll and get inspired. Mock a MedVirtual take when something sparks.</p>
      <div class="live-grid">
        ${liveAds
          .map(
            (a, i) =>
              `<div id="ad-${esc(ad.id)}-${esc(a.libraryId || i)}">${renderLiveAd(a, ad)}</div>`,
          )
          .join('')}
      </div>
      <details class="notes">
        <summary>Steal / reject / remix notes</summary>
        <div class="tri">
          <div><span class="lab steal">Steal</span><p>${esc(ad.steal)}</p></div>
          <div><span class="lab reject">Reject</span><p>${esc(ad.reject)}</p></div>
          <div><span class="lab remix">Remix for MV</span><p>${esc(ad.remix)}</p></div>
        </div>
      </details>
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

const brandsLive = COMPETITOR_ADS.filter((ad) => liveFor(ad.id).length > 0);
const brandsEmpty = COMPETITOR_ADS.filter((ad) => liveFor(ad.id).length === 0);
const orderedAds = [...brandsLive, ...brandsEmpty];

const updatedLabel = formatUpdated(LIVE.updatedAt);
const liveCount = brandsLive.reduce((n, ad) => n + liveFor(ad.id).length, 0);
const brandsWithLive = brandsLive.length;

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
  main { max-width: 1180px; margin: 0 auto; padding: 1.35rem 1.1rem 4rem; }
  .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.7rem, 3.5vw, 2.3rem); letter-spacing: -0.03em; }
  .hero p { margin: 0 0 1rem; max-width: 48rem; color: #405766; font-size: 1.02rem; }
  .fresh {
    display: inline-flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;
    margin: 0 0 1rem; font-size: 0.86rem; color: #0e7490; font-weight: 700;
  }
  .fresh span {
    background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 999px;
    padding: 0.25rem 0.65rem;
  }
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
  .wall { display: grid; gap: 1.5rem; }
  .card {
    background: #fff; border: 1px solid #d5e2ea; border-radius: 16px; overflow: hidden;
  }
  .empty-card { opacity: 0.92; }
  .empty-body { padding: 1.1rem 1.15rem 1.2rem; }
  .empty-note { margin: 0 0 0.85rem; color: #64748b; font-size: 0.9rem; max-width: 40rem; }
  .brand-head {
    display: grid; grid-template-columns: 1fr minmax(200px, 320px); gap: 1rem;
    padding: 1.05rem 1.15rem; border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(180deg, #f8fcff, #fff);
  }
  @media (max-width: 800px) { .brand-head { grid-template-columns: 1fr; } }
  .strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.35rem; }
  .strip-shot {
    display: block; aspect-ratio: 1; border-radius: 10px; overflow: hidden;
    border: 1px solid #dbe7ef; background: #0f172a;
  }
  .strip-shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .top { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin-bottom: 0.35rem; }
  .top h3 { margin: 0; font-size: 1.25rem; }
  .cat {
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
    background: #ecfeff; color: #0e7490; padding: 0.2rem 0.45rem; border-radius: 999px;
  }
  .cat.live { background: #dcfce7; color: #166534; }
  .cat.warn { background: #fff7ed; color: #c2410c; }
  .why { margin: 0; font-size: 0.92rem; color: #516472; max-width: 40rem; }
  .live-block { padding: 1rem 1.15rem 1.25rem; }
  .live-block h4 { margin: 0 0 0.25rem; font-size: 1.05rem; }
  .live-lede { margin: 0 0 1rem; color: #64748b; font-size: 0.9rem; max-width: 52rem; }
  .live-grid { display: grid; gap: 1.1rem; }
  .live-ad {
    display: grid; grid-template-columns: minmax(220px, 360px) 1fr; gap: 1rem;
    border: 1px solid #dbe7ef; border-radius: 14px; padding: 0.85rem; background: #fff;
  }
  @media (max-width: 800px) { .live-ad { grid-template-columns: 1fr; } }
  .creative {
    display: block; border-radius: 12px; overflow: hidden; background: #0f172a;
    min-height: 280px; border: 1px solid #cbd5e1;
  }
  .creative img {
    width: 100%; height: 100%; object-fit: contain; display: block;
    background: #0b1220; min-height: 280px; max-height: 520px;
  }
  .live-meta { margin: 0 0 0.55rem; font-size: 0.72rem; color: #64748b; font-weight: 600; }
  .field { margin-bottom: 0.65rem; }
  .field .fk {
    display: block; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.04em;
    text-transform: uppercase; color: #0e7490; margin-bottom: 0.15rem;
  }
  .field p { margin: 0; font-size: 0.95rem; color: #1e293b; white-space: pre-wrap; }
  .actions, .live-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .btn {
    display: inline-flex; align-items: center; padding: 0.45rem 0.75rem; border-radius: 8px;
    border: 1px solid #cbd5e1; background: #fff; color: #0D546B; font: inherit; font-size: 0.82rem;
    font-weight: 700; text-decoration: none;
  }
  .btn.primary { background: #077999; border-color: #077999; color: #fff; }
  .notes { margin-top: 1rem; border-top: 1px dashed #e2e8f0; padding-top: 0.75rem; }
  .notes summary { cursor: pointer; font-weight: 700; color: #0D546B; font-size: 0.9rem; }
  .tri { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.65rem; }
  @media (max-width: 720px) { .tri { grid-template-columns: 1fr; } }
  .tri > div { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.55rem 0.65rem; }
  .tri p { margin: 0.25rem 0 0; font-size: 0.82rem; color: #334155; }
  .lab { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
  .lab.steal { color: #047857; }
  .lab.reject { color: #b91c1c; }
  .lab.remix { color: #077999; }
  section { margin: 1.75rem 0; }
  section > h2 { margin: 0 0 0.35rem; font-size: 1.2rem; }
  section > .lede { margin: 0 0 0.85rem; color: #64748b; font-size: 0.94rem; }
  .forks { display: grid; gap: 0.75rem; grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 700px) { .forks { grid-template-columns: 1fr; } }
  .fork { background: #fff; border: 1px solid #d5e2ea; border-radius: 12px; padding: 1rem; }
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
  'Competitor remix pitch',
)}&body=${encodeURIComponent(
  'Hey George!\n\nCompetitor I studied:\nMy remix / mock idea:\n(Optional: attached PNG from the sandbox)\n\nThanks!\n',
)}`;

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
    pageSubtitle: 'Real Meta ads · hooks · copy · pitch George',
  })}
  <main>
    <header class="hero">
      <h1>${esc(COMPETITOR_META.title)}</h1>
      <p>${esc(COMPETITOR_META.intro)}</p>
      <div class="fresh">
        ${updatedLabel ? `<span>Updated ${esc(updatedLabel)}</span>` : ''}
        <span>${liveCount} real creatives</span>
        <span>${brandsWithLive} brands with live ads</span>
      </div>
    </header>

    <div class="howto">
      <strong>How this stays fresh</strong>
      <ol>${COMPETITOR_META.howToRefresh.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    </div>

    <div class="filters" role="group" aria-label="Filter">
      <button type="button" class="on" data-filter="live">Has live ads</button>
      <button type="button" data-filter="all">All brands</button>
      <button type="button" data-filter="virtual-staffing">Virtual staffing</button>
      <button type="button" data-filter="practice-saas">Practice SaaS</button>
      <button type="button" data-filter="job-marketplace">Job marketplaces</button>
      <button type="button" data-filter="other">Other</button>
    </div>

    <div class="wall">
      ${orderedAds.map(renderCard).join('')}
    </div>

    <section>
      <h2>This week’s three forks</h2>
      <p class="lede">Same brief, three directions — Lookbook faithful, bold experiment, SaaS. Open them in the mock-up sandbox and send your favorite.</p>
      <div class="forks">${renderForks()}</div>
    </section>

    <section class="cta">
      <h2>Mock it · pitch George</h2>
      <p>Saw a hook you like? Remix it in the sandbox and email George — he’s excited to see what you cook up.</p>
      <a class="btn primary" href="${esc(mailto)}">Email George a remix</a>
      <a class="btn" href="/creative-concept-lab.html">Static Concepts</a>
      <a class="btn" href="/mockup-sandbox.html">Open mock-up sandbox</a>
      <a class="btn" href="/ideas.html">Ideas Lab</a>
    </section>
  </main>
  <script>
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.card[data-category]');
    function applyFilter(f) {
      cards.forEach((c) => {
        let show = true;
        if (f === 'live') show = c.getAttribute('data-has-live') === '1';
        else if (f !== 'all') show = c.getAttribute('data-category') === f;
        c.classList.toggle('is-hidden', !show);
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('on'));
        btn.classList.add('on');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });
    applyFilter(document.querySelector('[data-filter].on')?.getAttribute('data-filter') || 'live');
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'competitors.html'), html);
console.log(
  `Competitor Wall · ${brandsWithLive}/${COMPETITOR_ADS.length} brands live · ${liveCount} creatives · updated ${LIVE.updatedAt || 'n/a'}`,
);
