/**
 * CMO Review — executive presentation for Real People creative direction.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  CAMPAIGN_STATUS,
  CMO_EXAMPLES,
  CMO_REVIEW_UPDATED,
  EARLY_TAKEAWAY,
  copyPackage,
} from './cmo-review-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStatusCard(ad) {
  const isPaused = ad.status === 'paused';
  const isLeader = !!ad.leader;
  const metrics =
    ad.ctr || ad.cpc || ad.cpm
      ? `<div class="metrics">
          ${ad.ctr ? `<span><strong>CTR</strong> ${esc(ad.ctr)}</span>` : ''}
          ${ad.cpc ? `<span><strong>CPC</strong> ${esc(ad.cpc)}</span>` : ''}
          ${ad.cpm ? `<span><strong>CPM</strong> ${esc(ad.cpm)}</span>` : ''}
        </div>
        <p class="metrics-note">Early directional data — not enough volume for a final winner</p>`
      : '';

  return `<article class="status-card ${isPaused ? 'is-paused' : ''} ${isLeader ? 'is-leader' : ''}">
    <div class="status-card__head">
      <h3>${esc(ad.adName)}</h3>
      <span class="pill ${isPaused ? 'pill-paused' : isLeader ? 'pill-leader' : 'pill-live'}">${esc(ad.statusLabel)}</span>
    </div>
    <p class="learning">${esc(ad.learning)}</p>
    ${metrics}
  </article>`;
}

function renderExample(ex) {
  const pkg = copyPackage(ex);
  return `<section class="person" id="ex-${esc(ex.id)}">
    <header class="person__head">
      <div>
        <h3>${esc(ex.firstName)}</h3>
        <p class="person__role">${esc(ex.role)}</p>
      </div>
      <span class="angle">${esc(ex.angle)}</span>
    </header>
    <div class="ratio-grid">
      <figure>
        <figcaption>4:5 Feed</figcaption>
        <img src="${esc(ex.images['4x5'])}" alt="${esc(ex.firstName)} Treatment C 4:5 ad" width="1080" height="1350" loading="lazy" decoding="async" />
      </figure>
      <figure>
        <figcaption>1:1 Square</figcaption>
        <img src="${esc(ex.images['1x1'])}" alt="${esc(ex.firstName)} Treatment C 1:1 ad" width="1080" height="1080" loading="lazy" decoding="async" />
      </figure>
      <figure class="ratio-916">
        <figcaption>9:16 Story / Reel</figcaption>
        <img src="${esc(ex.images['9x16'])}" alt="${esc(ex.firstName)} Treatment C 9:16 ad" width="1080" height="1920" loading="lazy" decoding="async" />
      </figure>
    </div>
    <div class="copy-card">
      <div class="copy-row"><span class="k">Primary text</span><p>${esc(ex.primaryText)}</p></div>
      <div class="copy-row"><span class="k">Headline</span><p>${esc(ex.headline)}</p></div>
      <div class="copy-row"><span class="k">Description</span><p>${esc(ex.description)}</p></div>
      <div class="copy-row"><span class="k">CTA</span><p>${esc(ex.cta)}</p></div>
      <button type="button" class="copy-btn" data-copy="${esc(pkg)}">Copy package</button>
    </div>
    <div class="approval" role="group" aria-label="Review status for ${esc(ex.firstName)}">
      <button type="button" class="appr" data-appr="approve">Approve</button>
      <button type="button" class="appr" data-appr="revise">Revise</button>
      <button type="button" class="appr" data-appr="hold">Hold</button>
    </div>
  </section>`;
}

const live = CAMPAIGN_STATUS.filter((a) => a.status === 'live');
const paused = CAMPAIGN_STATUS.filter((a) => a.status === 'paused');

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #f1f5f9;
    color: #0f172a;
    line-height: 1.5;
  }
  .wrap { max-width: 1200px; margin: 0 auto; padding: 1.25rem 1.25rem 3.5rem; }
  .hero {
    background: #0f172a;
    color: #f8fafc;
    border-radius: 14px;
    padding: 1.35rem 1.4rem;
    margin-bottom: 1.1rem;
  }
  .hero h2 { font-size: 1.45rem; font-weight: 750; margin-bottom: 0.4rem; letter-spacing: -0.01em; }
  .hero p { color: #cbd5e1; font-size: 0.98rem; max-width: 52ch; }
  .review-label {
    display: inline-block;
    margin-top: 0.85rem;
    font-size: 0.72rem;
    font-weight: 750;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #99f6e4;
    background: rgba(13,148,136,0.2);
    border: 1px solid rgba(94,234,212,0.35);
    border-radius: 6px;
    padding: 0.3rem 0.55rem;
  }
  .section {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.15rem 1.25rem;
    margin-bottom: 1rem;
  }
  .section > h2 {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.65rem;
  }
  .section > .lede {
    font-size: 0.95rem;
    color: #475569;
    max-width: 62ch;
    margin-bottom: 0.9rem;
  }
  .updated { font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.75rem; }
  .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 800px) { .status-grid { grid-template-columns: 1fr; } }
  .status-group-label {
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #64748b; margin: 0.85rem 0 0.4rem;
  }
  .status-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.85rem 0.95rem;
    background: #fff;
  }
  .status-card.is-leader {
    border-color: #0d9488;
    box-shadow: 0 0 0 1px rgba(13,148,136,0.25);
    background: #f0fdfa;
  }
  .status-card.is-paused {
    opacity: 0.72;
    background: #f8fafc;
  }
  .status-card__head {
    display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;
    justify-content: space-between; margin-bottom: 0.45rem;
  }
  .status-card h3 { font-size: 0.95rem; font-weight: 800; color: #0f172a; }
  .pill {
    font-size: 0.65rem; font-weight: 850; padding: 0.22rem 0.5rem; border-radius: 999px;
    letter-spacing: 0.02em;
  }
  .pill-leader { background: #0d9488; color: #fff; }
  .pill-live { background: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; }
  .pill-paused { background: #e2e8f0; color: #475569; }
  .learning { font-size: 0.86rem; color: #334155; }
  .metrics {
    display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.55rem;
    font-size: 0.84rem; color: #0f172a;
  }
  .metrics strong { color: #64748b; font-size: 0.68rem; text-transform: uppercase; margin-right: 0.25rem; }
  .metrics-note { margin-top: 0.35rem; font-size: 0.72rem; color: #0f766e; font-weight: 650; }
  .takeaway {
    margin-top: 0.9rem;
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 10px;
    padding: 0.85rem 1rem;
    font-size: 0.9rem;
    font-weight: 650;
    line-height: 1.45;
  }
  .principles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; }
  @media (max-width: 800px) { .principles { grid-template-columns: 1fr; } }
  .principle {
    border: 1px solid #e2e8f0;
    border-left: 3px solid #0d9488;
    border-radius: 10px;
    padding: 0.75rem 0.85rem;
    background: #f8fafc;
  }
  .principle strong { display: block; font-size: 0.88rem; margin-bottom: 0.25rem; color: #0f172a; }
  .principle span { font-size: 0.82rem; color: #475569; }
  .person {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1rem 1.05rem 1.1rem;
    margin-bottom: 0.9rem;
    background: #fff;
  }
  .person__head {
    display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: baseline;
    justify-content: space-between; margin-bottom: 0.85rem;
  }
  .person h3 { font-size: 1.2rem; font-weight: 800; color: #0f172a; }
  .person__role { font-size: 0.9rem; color: #475569; font-weight: 600; }
  .angle {
    font-size: 0.72rem; font-weight: 750; color: #0f766e;
    background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 999px;
    padding: 0.28rem 0.6rem;
  }
  .ratio-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr 0.72fr;
    gap: 0.75rem;
    align-items: start;
    margin-bottom: 0.85rem;
  }
  @media (max-width: 900px) {
    .ratio-grid { grid-template-columns: 1fr; max-width: 420px; }
  }
  .ratio-grid figure { margin: 0; }
  .ratio-grid figcaption {
    font-size: 0.68rem; font-weight: 750; text-transform: uppercase; letter-spacing: 0.04em;
    color: #94a3b8; margin-bottom: 0.35rem;
  }
  .ratio-grid img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #0f172a;
  }
  .ratio-916 img { max-height: 420px; width: auto; max-width: 100%; margin: 0 auto; }
  .copy-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.75rem 0.85rem;
  }
  .copy-row { margin-bottom: 0.55rem; }
  .copy-row .k {
    display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.04em; color: #94a3b8; margin-bottom: 0.15rem;
  }
  .copy-row p { font-size: 0.88rem; color: #1e293b; }
  .copy-btn {
    margin-top: 0.25rem;
    font-size: 0.78rem; font-weight: 700; color: #0f766e;
    background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 7px;
    padding: 0.4rem 0.7rem; cursor: pointer;
  }
  .copy-btn:hover { background: #ccfbf1; }
  .copy-btn.copied { background: #0d9488; color: #fff; border-color: #0d9488; }
  .approval { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
  .appr {
    font-size: 0.78rem; font-weight: 750; padding: 0.4rem 0.75rem; border-radius: 8px;
    border: 1px solid #cbd5e1; background: #fff; color: #475569; cursor: pointer;
  }
  .appr[data-appr="approve"].on { background: #0d9488; border-color: #0d9488; color: #fff; }
  .appr[data-appr="revise"].on { background: #f59e0b; border-color: #f59e0b; color: #fff; }
  .appr[data-appr="hold"].on { background: #64748b; border-color: #64748b; color: #fff; }
  .decision-list { padding-left: 1.15rem; margin: 0.35rem 0 0.9rem; }
  .decision-list li { font-size: 0.92rem; color: #1e293b; margin: 0.45rem 0; font-weight: 600; }
  .reco {
    background: #f0fdfa;
    border: 1px solid #99f6e4;
    border-left: 4px solid #0d9488;
    border-radius: 10px;
    padding: 0.9rem 1rem;
    font-size: 0.92rem;
    color: #134e4a;
    font-weight: 650;
  }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: #0f172a; color: #fff;
    padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.78rem;
    opacity: 0; transition: opacity 0.2s; z-index: 50; pointer-events: none;
  }
  .toast.show { opacity: 1; }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People Creative Review — MedVirtual</title>
  <meta name="description" content="CMO review: Real People creative direction for MedVirtual Meta ads." />
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'cmo-review',
    pageTitle: 'Real People Creative Review',
    pageSubtitle:
      'Named MedVirtual talent, clearer operational pain, and a more human alternative to generic staffing ads.',
  })}
  <div class="wrap">
    <header class="hero">
      <h2>Real People Creative Review</h2>
      <p>Named MedVirtual talent, clearer operational pain, and a more human alternative to generic staffing ads.</p>
      <span class="review-label">CMO review · creative direction examples · not final campaign approval</span>
    </header>

    <section class="section" id="snapshot">
      <h2>What is live now</h2>
      <p class="updated">Updated ${esc(CMO_REVIEW_UPDATED)}</p>
      <p class="status-group-label">Live</p>
      <div class="status-grid">${live.map(renderStatusCard).join('')}</div>
      <p class="status-group-label">Paused</p>
      <div class="status-grid">${paused.map(renderStatusCard).join('')}</div>
      <p class="takeaway">${esc(EARLY_TAKEAWAY)}</p>
    </section>

    <section class="section" id="direction">
      <h2>Next Creative Direction: Make the Service Human</h2>
      <p class="lede">Instead of another stock headset image, introduce a real MedVirtual professional the practice can imagine interviewing. Each concept combines a recognizable operational problem, a named person, verified capabilities, and a direct next step.</p>
      <div class="principles">
        <div class="principle"><strong>Specific pain</strong><span>Calls, scheduling, verification, front-desk pressure, or admin backlog.</span></div>
        <div class="principle"><strong>Real person</strong><span>A name, face, role, and credible capabilities—not anonymous stock imagery.</span></div>
        <div class="principle"><strong>Clear next step</strong><span>Invite the practice to learn more or request an interview.</span></div>
      </div>
    </section>

    <section class="section" id="examples">
      <h2>Best examples</h2>
      <p class="lede">Four named-person concepts for the first production batch. Previews use the finished Treatment C layouts in each Meta ratio.</p>
      ${CMO_EXAMPLES.map(renderExample).join('')}
    </section>

    <section class="section" id="decision">
      <h2>Decision Needed</h2>
      <ol class="decision-list">
        <li>Do we approve real MedVirtual talent as the next static-ad direction?</li>
        <li>Should the first production batch remain Chelsea, Mark, Jessica, and Angelica?</li>
        <li>Can approved profiles later move into real iPhone video or separately approved synthetic-motion tests?</li>
      </ol>
      <p class="reco"><strong>Recommendation:</strong> approve the four-person static batch first. Launch the real-person concepts alongside the two remaining controls, then compare pain-first named-person creative against “Too Many Calls.”</p>
    </section>
  </div>
  <div class="toast" id="toast" role="status">Copied</div>
  <script>
    (function () {
      const toast = document.getElementById('toast');
      document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
            btn.classList.add('copied');
            toast.textContent = 'Copied';
            toast.classList.add('show');
            setTimeout(() => {
              btn.classList.remove('copied');
              toast.classList.remove('show');
            }, 1100);
          } catch (e) {
            toast.textContent = 'Copy failed';
            toast.classList.add('show');
          }
        });
      });
      document.querySelectorAll('.approval').forEach((group) => {
        group.querySelectorAll('.appr').forEach((btn) => {
          btn.addEventListener('click', () => {
            group.querySelectorAll('.appr').forEach((b) => b.classList.remove('on'));
            btn.classList.add('on');
          });
        });
      });
    })();
  </script>
</body>
</html>
`;

// Verify images exist before writing
const missing = [];
for (const ex of CMO_EXAMPLES) {
  for (const [ratio, src] of Object.entries(ex.images)) {
    const fp = path.join(PUBLIC, src.replace(/^\//, ''));
    if (!fs.existsSync(fp)) missing.push(`${ex.id} ${ratio}: ${src}`);
  }
}
if (missing.length) {
  console.error('Missing Treatment C previews:');
  missing.forEach((m) => console.error(' ', m));
  process.exit(1);
}

fs.writeFileSync(path.join(PUBLIC, 'real-people-cmo-review.html'), html);
console.log('Wrote public/real-people-cmo-review.html');
console.log(`Examples: ${CMO_EXAMPLES.map((e) => e.firstName).join(', ')}`);
console.log('All 12 Treatment C previews present.');
