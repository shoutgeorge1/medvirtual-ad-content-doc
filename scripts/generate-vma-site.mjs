/**
 * VMA site generator — writes all 17 Virtual Medical Admin production pages
 * plus thin meta-refresh redirects from old dr-* routes.
 *
 * Design: black / navy energetic UI, lime accents, NO PINK.
 * Text / HTML / CSS only — this script never generates image files.
 *
 * Run: node scripts/generate-vma-site.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import {
  VMA_META,
  VMA_NAV,
  COLOR_FAMILIES,
  CONCEPTS,
  COLOR_TEST_SET,
  VIDEO_CONCEPTS,
  VIDEO_SCENES_15S,
  REMOTION_COMPONENTS,
  REMOTION_COMPOSITIONS,
  REMOTION_PLAYBOOK,
  CAPCUT_TEMPLATES,
  CHATGPT_WORKFLOW,
  CHATGPT_PROMPTS,
  VIDEO_PROMPTS,
  FORMS,
  COMPLETION_SCREENS,
  OFFER_CONCEPTS,
  CLAIMS,
  CLAIM_STATUSES,
  CAMPAIGN,
  QA_CHECKLIST,
  PRODUCTION_QUEUE,
  PRODUCTION_STATUSES,
  COPY_EN,
  COPY_ES,
  COMPETITOR_RESEARCH_SEED,
  getColorFamily,
  getClaimsForConcept,
  getClaim,
} from './vma-site-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

let filesWritten = 0;
function write(name, html) {
  fs.writeFileSync(path.join(PUBLIC, name), html);
  filesWritten += 1;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Shared CSS ──────────────────────────────────────────────────────────────

const PAGE_CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: #e5e7eb;
    background:
      radial-gradient(ellipse 80% 50% at 15% -10%, rgba(184,240,0,0.10), transparent 55%),
      radial-gradient(ellipse 70% 50% at 90% 0%, rgba(0,229,255,0.08), transparent 55%),
      #06080d;
    line-height: 1.5;
  }
  a { color: #B8F000; }
  main { max-width: 1120px; margin: 0 auto; padding: 1.5rem 1.15rem 5rem; }
  h1, h2, h3 { color: #f8fafc; }
  .banner {
    margin: 0 0 1.25rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: linear-gradient(120deg, rgba(184,240,0,0.14), rgba(0,229,255,0.10));
    border: 1px solid rgba(184,240,0,0.45);
    font-size: 0.9rem;
  }
  .banner strong { color: #B8F000; }
  .banner .sub { display:block; color:#cbd5e1; margin-top:0.25rem; font-weight:400; }
  .rule-100 {
    margin: 0 0 1.25rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: rgba(225,6,0,0.10);
    border: 1px solid rgba(225,6,0,0.45);
    color: #fecaca;
    font-size: 0.88rem;
  }
  .rule-100 strong { color: #ff6b6b; }
  .hero h1 { margin: 0 0 0.4rem; font-size: clamp(1.6rem, 4vw, 2.3rem); letter-spacing: -0.03em; }
  .hero p { margin: 0; max-width: 52rem; color: #94a3b8; }
  .lede { color: #94a3b8; max-width: 52rem; }
  section { margin-top: 1.75rem; }
  section > h2 { font-size: 1.2rem; margin: 0 0 0.35rem; }
  .grid { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .grid-2 { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); }
  .card {
    background: #0d111a;
    border: 1px solid #1f2937;
    border-radius: 14px;
    padding: 1rem 1.05rem;
  }
  .card h3 { margin: 0 0 0.3rem; font-size: 1.02rem; }
  .card p { margin: 0.25rem 0; font-size: 0.88rem; color: #b4becb; }
  .eyebrow {
    display: inline-block; font-size: 0.66rem; font-weight: 800; letter-spacing: 0.08em;
    text-transform: uppercase; color: #B8F000; margin-bottom: 0.25rem;
  }
  .pill {
    display: inline-block; padding: 0.12rem 0.55rem; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em; border: 1px solid transparent;
  }
  .badge-status { background: rgba(148,163,184,0.15); color:#cbd5e1; border-color: rgba(148,163,184,0.3); }
  .s-confirmed, .s-approved-for-launch { background: rgba(34,197,94,0.16); color:#86efac; border-color: rgba(34,197,94,0.4); }
  .s-approved-for-test { background: rgba(0,229,255,0.14); color:#67e8f9; border-color: rgba(0,229,255,0.4); }
  .s-pending-leadership, .s-pending-compliance, .s-on-hold { background: rgba(255,230,0,0.14); color:#fde047; border-color: rgba(255,230,0,0.4); }
  .s-rejected, .s-do-not-use { background: rgba(225,6,0,0.16); color:#fca5a5; border-color: rgba(225,6,0,0.45); }
  .s-queued, .s-ready-for-design, .s-ready-for-animation { background: rgba(184,240,0,0.14); color:#cbe96a; border-color: rgba(184,240,0,0.4); }
  table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  th, td { text-align: left; padding: 0.5rem 0.6rem; border-bottom: 1px solid #1f2937; vertical-align: top; }
  th { color: #94a3b8; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td.ref { font-weight: 700; color: #f8fafc; white-space: nowrap; }
  ul.clean { margin: 0.4rem 0 0; padding-left: 1.1rem; color: #b4becb; font-size: 0.86rem; }
  ul.clean li { margin: 0.15rem 0; }
  .copy-btn {
    font: inherit; font-size: 0.72rem; font-weight: 700; cursor: pointer;
    background: #B8F000; color: #06080d; border: none; border-radius: 7px;
    padding: 0.28rem 0.6rem; margin-top: 0.4rem;
  }
  .copy-btn:hover { background: #cbff33; }
  .copy-btn.copied { background: #22C55E; color:#04120a; }
  .copytext {
    display: block; background: #05070b; border: 1px solid #1f2937; border-radius: 8px;
    padding: 0.6rem 0.7rem; font-size: 0.82rem; color: #d1d9e2; white-space: pre-wrap; margin-top: 0.4rem;
  }
  .warn {
    margin-top: 0.5rem; padding: 0.5rem 0.65rem; border-radius: 8px; font-size: 0.78rem;
    background: rgba(255,230,0,0.10); border: 1px solid rgba(255,230,0,0.4); color: #fde047;
  }
  .warn.danger { background: rgba(225,6,0,0.12); border-color: rgba(225,6,0,0.45); color:#fca5a5; }
  .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.75rem 0 0.25rem; }
  .filters button {
    font: inherit; font-size: 0.76rem; font-weight: 600; cursor: pointer; color:#cbd5e1;
    background: #0d111a; border: 1px solid #1f2937; border-radius: 999px; padding: 0.3rem 0.75rem;
  }
  .filters button.active { background: #B8F000; color:#06080d; border-color:#B8F000; }
  /* Mock ad comp */
  .adcomp {
    position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 4 / 5;
    display: flex; flex-direction: column; justify-content: space-between; padding: 0.9rem;
    border: 1px solid rgba(255,255,255,0.14);
  }
  .adcomp .ac-head { font-weight: 800; font-size: 1.05rem; line-height: 1.05; letter-spacing:-0.02em; text-transform: uppercase; max-width: 78%; }
  .adcomp .ac-bullets { list-style: none; margin: 0.5rem 0 0; padding: 0; font-size: 0.72rem; font-weight:600; max-width: 78%; }
  .adcomp .ac-bullets li { display:flex; gap:0.35rem; align-items:center; margin:0.18rem 0; }
  .adcomp .ac-bullets li::before { content:'✓'; font-weight:900; }
  .adcomp .ac-person {
    position: absolute; right: -6%; bottom: 0; width: 42%; height: 72%; border-radius: 50% 50% 0 0;
    opacity: 0.9;
  }
  .adcomp .ac-cta { align-self: flex-start; padding: 0.35rem 0.8rem; border-radius: 999px; font-weight:800; font-size:0.75rem; z-index:2; }
  .adcomp .ac-badge {
    position:absolute; top:0.7rem; right:0.7rem; z-index:3; font-size:0.6rem; font-weight:800;
    padding:0.2rem 0.45rem; border-radius:6px; text-transform:uppercase; letter-spacing:0.03em;
  }
  .adcomp .ac-note { font-size:0.6rem; opacity:0.8; z-index:2; }
  .timeline { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px,1fr)); gap: 0.4rem; margin-top: 0.6rem; }
  .timeline .beat { background:#05070b; border:1px solid #1f2937; border-top:3px solid #00E5FF; border-radius:8px; padding:0.45rem 0.5rem; }
  .timeline .beat b { display:block; font-size:0.72rem; color:#67e8f9; }
  .timeline .beat span { font-size:0.68rem; color:#94a3b8; }
  .chip { display:inline-block; font-size:0.66rem; font-weight:700; padding:0.14rem 0.5rem; border-radius:6px; background:#111827; border:1px solid #263041; color:#cbd5e1; margin:0.12rem 0.12rem 0 0; }
  .swatch { display:inline-block; width:0.85rem; height:0.85rem; border-radius:3px; vertical-align:-2px; margin-right:0.3rem; border:1px solid rgba(255,255,255,0.25); }
  .metricgrid { display:grid; gap:0.7rem; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); }
  .metric { background:#0d111a; border:1px solid #1f2937; border-radius:12px; padding:0.75rem 0.85rem; }
  .metric label { display:block; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; }
  .metric input { width:100%; margin-top:0.3rem; background:#05070b; border:1px solid #263041; border-radius:7px; color:#f8fafc; font:inherit; padding:0.3rem 0.4rem; }
  .checkline { display:flex; gap:0.5rem; align-items:flex-start; padding:0.35rem 0; border-bottom:1px solid #131a26; font-size:0.86rem; color:#cbd5e1; }
  .checkline input { margin-top:0.2rem; }
  .foot { margin-top:3rem; padding-top:1rem; border-top:1px solid #1f2937; color:#64748b; font-size:0.76rem; }
`;

// ─── Shared bottom script (copy buttons + filters + local persistence) ────────

const PAGE_SCRIPT = `
<script>
(function(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.copy-btn');
    if(!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    navigator.clipboard.writeText(text).then(function(){
      var old = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = old; btn.classList.remove('copied'); }, 1400);
    });
  });
  // Generic data-filter groups
  document.querySelectorAll('[data-filter-group]').forEach(function(group){
    var key = group.getAttribute('data-filter-group');
    group.querySelectorAll('button[data-filter]').forEach(function(b){
      b.addEventListener('click', function(){
        group.querySelectorAll('button[data-filter]').forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
        var val = b.getAttribute('data-filter');
        document.querySelectorAll('[data-'+key+']').forEach(function(item){
          var show = (val === 'all') || item.getAttribute('data-'+key) === val;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });
  // Persist checkboxes + text inputs with data-persist
  document.querySelectorAll('[data-persist]').forEach(function(el){
    var k = 'vma-'+el.getAttribute('data-persist');
    try {
      var saved = localStorage.getItem(k);
      if(saved !== null){ if(el.type==='checkbox'){ el.checked = saved==='1'; } else { el.value = saved; } }
    } catch(e){}
    el.addEventListener(el.type==='checkbox'?'change':'input', function(){
      try { localStorage.setItem(k, el.type==='checkbox' ? (el.checked?'1':'0') : el.value); } catch(e){}
    });
  });
})();
</script>`;

// ─── Shared component helpers ────────────────────────────────────────────────

function statusClass(status) {
  return 's-' + String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function statusBadge(status) {
  return `<span class="pill ${statusClass(status)}">${esc(status)}</span>`;
}
function copyBlock(text) {
  return `<span class="copytext">${esc(text)}</span><button class="copy-btn" data-copy="${esc(text)}">Copy</button>`;
}
function swatch(hex) {
  return `<span class="swatch" style="background:${esc(hex)}"></span>`;
}

/** Mock CSS ad comp — abstract person + benefits, no image generation. */
function adComp(concept) {
  const fam = getColorFamily(concept.colorFamilyId) || COLOR_FAMILIES[0];
  const bullets = (concept.benefits || []).slice(0, 4).map((b) => `<li>${esc(b)}</li>`).join('');
  const pendingBadge = (concept.claimIds || []).some((id) => {
    const c = getClaim(id);
    return c && c.status !== 'Confirmed';
  });
  const badge = pendingBadge
    ? `<span class="ac-badge" style="background:#E10600;color:#fff">Badge pending claim</span>`
    : '';
  return `<div class="adcomp" style="background:${esc(fam.background)};color:${esc(fam.headlineColor)}">
    ${badge}
    <div>
      <div class="ac-head">${esc(concept.headline)}</div>
      <ul class="ac-bullets" style="color:${esc(fam.bulletColor)}">${bullets}</ul>
    </div>
    <div class="ac-person" style="background:${esc(fam.scrubColor)}"></div>
    <div class="ac-cta" style="background:${esc(fam.ctaBg)};color:${esc(fam.ctaText)}">${esc(concept.cta)}</div>
    <div class="ac-note" style="color:${esc(fam.headlineColor)}">Abstract comp · designer builds final</div>
  </div>`;
}

/** Claim warning block for a concept. */
function claimWarnings(concept) {
  const claims = getClaimsForConcept(concept);
  const risky = claims.filter((c) => c.status !== 'Confirmed');
  if (!risky.length) return '';
  const danger = risky.some((c) => c.status === 'Do Not Use' || c.status === 'Rejected');
  const lines = risky.map((c) => `${c.label} — ${c.status}`).join(' · ');
  return `<div class="warn${danger ? ' danger' : ''}">⚠ Claim check: ${esc(lines)}. Do not publish until approved.</div>`;
}

function beatTimeline(scenes) {
  return `<div class="timeline">${scenes
    .map((s) => {
      if (typeof s === 'string') return `<div class="beat"><b>${esc(s)}</b></div>`;
      return `<div class="beat"><b>${esc(s.label)}</b><span>${esc(s.seconds || '')}</span></div>`;
    })
    .join('')}</div>`;
}

// ─── Page shell ──────────────────────────────────────────────────────────────

function page({ activeId, title, pageTitle, pageSubtitle, showRule = false, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · MedVirtual</title>
  <style>${PAGE_CSS}</style>
</head>
<body>
  ${renderDocHeader({ activeId, pageTitle, pageSubtitle })}
  <main>
    <div class="banner"><strong>${esc(VMA_META.banner)}</strong><span class="sub">${esc(VMA_META.bannerSub)}</span></div>
    ${showRule ? `<div class="rule-100"><strong>${esc(VMA_META.hundredDollarRule)}</strong></div>` : ''}
    ${body}
    <p class="foot">MedVirtual Ad Production · Virtual Medical Admin · Reviewed ${esc(VMA_META.reviewDateDisplay)} · Approved creative colors only (no pink) · Ad-facing brand: MedVirtual.</p>
  </main>
  ${PAGE_SCRIPT}
</body>
</html>`;
}

// ─── 1. Dashboard (studio.html) ──────────────────────────────────────────────

function renderDashboard() {
  const pendingClaims = CLAIMS.filter((c) => c.status !== 'Confirmed' && c.status !== 'Approved for Launch');
  const queuedCount = PRODUCTION_QUEUE.filter((q) => q.status === 'Queued').length;
  const onHoldCount = PRODUCTION_QUEUE.filter((q) => q.status === 'On Hold').length;

  const metrics = ['Spend', 'Leads', 'Cost / Lead', 'Best Color', 'Best Concept', 'Ads at $100 no-lead']
    .map(
      (m, i) => `<div class="metric"><label>${esc(m)}</label><input type="text" data-persist="metric-${i}" placeholder="—" /></div>`,
    )
    .join('');

  const tiles = [
    ['Current Direction', '/direct-response.html', 'Bold Virtual Medical Admin ads + animated video.'],
    ['Static Ad Concepts', '/vma-static.html', '24 concepts + 6 color tests.'],
    ['Animated Video', '/vma-video.html', '15 video concepts, scene timelines.'],
    ['ChatGPT Prompts', '/vma-chatgpt.html', 'Generate full ad plates (no baked text).'],
    ['Production Queue', '/vma-queue.html', '24 static + video build items.'],
    ['Claims Tracker', '/vma-claims.html', 'Price / HIPAA approval status.'],
    ['Campaign Tests', '/vma-campaign.html', 'Ad sets + $100 rule.'],
    ['Competitor Wall', '/competitors.html', 'External benchmarks (research only).'],
  ]
    .map(
      ([t, href, d]) =>
        `<a class="card" href="${href}"><span class="eyebrow">Open</span><h3>${esc(t)}</h3><p>${esc(d)}</p></a>`,
    )
    .join('');

  const claimRows = pendingClaims
    .map((c) => `<tr><td class="ref">${esc(c.label)}</td><td>${statusBadge(c.status)}</td><td>${esc(c.notes)}</td></tr>`)
    .join('');

  const body = `
    <div class="hero">
      <h1>Production Dashboard</h1>
      <p>Control center for the Virtual Medical Admin Meta system — bold human-led static ads and short animated video. Generate the parts here; designers assemble the finals.</p>
    </div>

    <section>
      <h2>Live metrics <span class="pill badge-status">manual</span></h2>
      <p class="lede">Type in the latest numbers from Ads Manager. Saved to this browser only.</p>
      <div class="metricgrid">${metrics}</div>
    </section>

    <section>
      <h2>Queue summary</h2>
      <div class="grid">
        <div class="card"><span class="eyebrow">Queued</span><h3>${queuedCount} items</h3><p>Ready to produce.</p></div>
        <div class="card"><span class="eyebrow">On hold</span><h3>${onHoldCount} items</h3><p>Blocked on claim / offer approval.</p></div>
        <div class="card"><span class="eyebrow">Concepts</span><h3>${CONCEPTS.length} static · ${VIDEO_CONCEPTS.length} video</h3><p>Plus ${COLOR_TEST_SET.length} color tests.</p></div>
      </div>
    </section>

    <section>
      <h2>Claims pending approval</h2>
      <p class="lede">These may not appear on any published ad until approved.</p>
      <table><thead><tr><th>Claim</th><th>Status</th><th>Notes</th></tr></thead><tbody>${claimRows}</tbody></table>
    </section>

    <section>
      <h2>Jump in</h2>
      <div class="grid">${tiles}</div>
    </section>
  `;
  return page({
    activeId: 'studio',
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    pageSubtitle: 'Production control center — metrics, queue, and claims at a glance.',
    showRule: true,
    body,
  });
}

// ─── 2. Current Direction (direct-response.html) ─────────────────────────────

function renderDirection() {
  const rules = VMA_META.rules.map((r) => `<li>${esc(r)}</li>`).join('');
  const colorCards = COLOR_FAMILIES.map(
    (f) => `<div class="card">
      <span class="eyebrow">${swatch(f.accent)} ${esc(f.name)}</span>
      <p><b>Plate</b> ${swatch(f.background)}${esc(f.background)} · <b>Accent</b> ${swatch(f.accent)}${esc(f.accent)}</p>
      <p>${esc(f.contrastStrategy)}</p>
      <p style="color:#fca5a5">${esc(f.forbiddenNote)}</p>
    </div>`,
  ).join('');
  const testComps = COLOR_TEST_SET.map(
    (c) => `<div class="card"><span class="eyebrow">${esc(c.number)} · ${esc(getColorFamily(c.colorFamilyId).name)}</span>${adComp(c)}</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>${esc(VMA_META.coreHeadline)}</h1>
      <p>Human-led, offer-first, mobile-readable static ads plus short animated video. One dominant headline, 3–4 benefit checks, a credible virtual medical admin, and one clear CTA — understood in about one second.</p>
    </div>

    <section>
      <h2>Non-negotiable rules</h2>
      <ul class="clean">${rules}</ul>
    </section>

    <section>
      <h2>First color test</h2>
      <p class="lede">Six identical ads — same headline, benefits, offer, talent, and CTA. Color is the only variable (VMA-C01..C06). These are abstract comps; designers build the finals.</p>
      <div class="grid">${testComps}</div>
    </section>

    <section>
      <h2>Approved color families (no pink)</h2>
      <div class="grid">${colorCards}</div>
    </section>
  `;
  return page({
    activeId: 'vma-direction',
    title: 'Current Direction',
    pageTitle: 'Current Direction',
    pageSubtitle: 'Bold Virtual Medical Admin ads + animated video — the current Meta system.',
    showRule: true,
    body,
  });
}

// ─── 3. Competitor Wall (competitors.html) ───────────────────────────────────

function renderCompetitors() {
  const cards = COMPETITOR_RESEARCH_SEED.map((r) => {
    const fields = [
      ['Website', r.website],
      ['Facebook Page', r.facebookPage],
      ['Meta Ad Library', r.metaAdLibraryUrl],
      ['Creative format', r.creativeFormat],
      ['Language', r.language],
      ['Headline', r.headline],
      ['Offer', r.offer],
      ['Price shown', r.priceShown],
      ['Trust claim', r.trustClaim],
      ['CTA', r.cta],
      ['Talent / wardrobe', `${r.talentShown} / ${r.wardrobe}`],
      ['Colors', `${r.backgroundColor} / ${r.accentColor}`],
      ['Spanish / flag', `${r.spanishTreatment} / ${r.flagTreatment}`],
      ['Form type / friction', `${r.formType} / ${r.formFriction}`],
      ['Required fields', r.requiredFields],
      ['SMS verify / work email', `${r.smsVerification} / ${r.workEmailRequirement}`],
      ['Strengths', r.strengths],
      ['Weaknesses', r.weaknesses],
      ['What to adapt', r.whatAdapt],
      ['What NOT to copy', r.whatNotCopy],
      ['Originality risk', r.originalityRisk],
    ]
      .map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`)
      .join('');
    return `<div class="card">
      <span class="eyebrow">External reference</span>
      <h3>${esc(r.company)} ${statusBadge(r.reviewStatus)}</h3>
      <div class="warn">${esc(r.notes)}</div>
      <ul class="clean">${fields}</ul>
    </div>`;
  }).join('');

  const body = `
    <div class="hero">
      <h1>Competitor Wall</h1>
      <p>External Meta benchmarks — <b>research only</b>. Every card is an outside company we do not represent. Capture structure and friction lessons; never reuse their names, logos, palettes (especially pink), copy, or unverified claims.</p>
    </div>
    <div class="warn danger">These are EXTERNAL references. Do not copy competitor creative, claims, or brand assets. Fill in fields marked "Research needed" from the public Meta Ad Library before relying on them.</div>
    <section><div class="grid-2">${cards}</div></section>
  `;
  return page({
    activeId: 'competitors',
    title: 'Competitor Wall',
    pageTitle: 'Competitor Wall',
    pageSubtitle: 'External Meta benchmarks — research only, never copy.',
    body,
  });
}

// ─── 4. Static Ad Concepts (vma-static.html) ─────────────────────────────────

function renderStatic() {
  const groups = [...new Set(CONCEPTS.map((c) => c.groupLabel))];
  const groupFilters = ['all', ...groups]
    .map((g, i) => `<button data-filter="${g === 'all' ? 'all' : esc(g)}" class="${i === 0 ? 'active' : ''}">${g === 'all' ? 'All' : esc(g)}</button>`)
    .join('');
  const langFilters = ['all', 'en', 'es', 'bilingual']
    .map((l, i) => `<button data-filter="${l}" class="${i === 0 ? 'active' : ''}">${l === 'all' ? 'All languages' : esc(l)}</button>`)
    .join('');

  const cards = CONCEPTS.map((c) => {
    const fam = getColorFamily(c.colorFamilyId);
    return `<div class="card" data-group="${esc(c.groupLabel)}" data-lang="${esc(c.language)}">
      <span class="eyebrow">${esc(c.number)} · ${esc(c.groupLabel)} · ${esc(fam.name)}</span>
      <h3>${esc(c.name)}</h3>
      ${adComp(c)}
      <p><b>Audience:</b> ${esc(c.audience)}</p>
      <p><b>Supporting:</b> ${esc(c.supportingLine)}</p>
      <p><b>Talent:</b> ${esc(c.talentDirection)}</p>
      <p><b>Offer:</b> ${esc(c.offer)}</p>
      <p><b>Formats:</b> ${c.staticFormats.map((f) => `<span class="chip">${esc(f)}</span>`).join('')} · <b>Video:</b> <span class="chip">${esc(c.videoDuration)} ${esc(c.animationTemplate)}</span></p>
      <p><b>Form:</b> ${esc(c.formId)} · <b>Status:</b> ${statusBadge(c.productionStatus)}</p>
      ${claimWarnings(c)}
      ${copyBlock(`${c.headline}\n${c.supportingLine}\n• ${c.benefits.join('\n• ')}\nCTA: ${c.cta}`)}
    </div>`;
  }).join('');

  const body = `
    <div class="hero">
      <h1>Static Ad Concepts</h1>
      <p>${CONCEPTS.length} Virtual Medical Admin static concepts across Core, Pain, Role, Spanish, and Offer groups. Each comp below is abstract — designers build the final ad from the approved headline, benefits, and color family.</p>
    </div>
    <section>
      <div class="filters" data-filter-group="group"><span class="chip">Group</span>${groupFilters}</div>
      <div class="filters" data-filter-group="lang"><span class="chip">Language</span>${langFilters}</div>
      <div class="grid-2" style="margin-top:1rem">${cards}</div>
    </section>
  `;
  return page({
    activeId: 'vma-static',
    title: 'Static Ad Concepts',
    pageTitle: 'Static Ad Concepts',
    pageSubtitle: `${CONCEPTS.length} concepts + ${COLOR_TEST_SET.length} color tests — filter by group and language.`,
    body,
  });
}

// ─── 5. Animated Video Concepts (vma-video.html) ─────────────────────────────

function renderVideo() {
  const tmpl = VIDEO_SCENES_15S;
  const structure = tmpl.structure
    .map((s) => `<div class="beat"><b>${esc(s.label)}</b><span>${esc(s.seconds)}</span><span>${esc(s.purpose)}</span></div>`)
    .join('');

  const cards = VIDEO_CONCEPTS.map((v) => {
    const fam = getColorFamily(v.colorFamilyId);
    return `<div class="card">
      <span class="eyebrow">${esc(v.number)} · ${esc(fam.name)} · ${esc(v.duration)}</span>
      <h3>${esc(v.name)}</h3>
      <p><b>Headline:</b> ${esc(v.headline)}</p>
      <p><b>Remotion:</b> <span class="chip">${esc(v.remotionComposition)}</span> · <b>CapCut:</b> <span class="chip">${esc(v.capcutTemplate)}</span></p>
      <p><b>Aspect ratios:</b> ${v.aspectRatios.map((a) => `<span class="chip">${esc(a)}</span>`).join('')}</p>
      ${v.mirrorsConcept ? `<p><b>Mirrors static:</b> ${esc(v.mirrorsConcept)}</p>` : ''}
      <p><b>Status:</b> ${statusBadge(v.productionStatus)}</p>
      ${beatTimeline(v.scenes)}
    </div>`;
  }).join('');

  const body = `
    <div class="hero">
      <h1>Animated Video Concepts</h1>
      <p>${VIDEO_CONCEPTS.length} short animated Virtual Medical Admin spots mirroring the static roles and color tests. Built in Remotion (code) or CapCut (no-code). Captions burned in; no pink; no unapproved badges.</p>
    </div>

    <section>
      <h2>Standard 15s scene template</h2>
      <p class="lede">${esc(tmpl.fps)}fps · ${esc(tmpl.totalFrames)} frames · ${tmpl.aspectRatios.join(' / ')}. ${esc(tmpl.safeZones)}</p>
      <div class="timeline">${structure}</div>
    </section>

    <section>
      <h2>Video concepts</h2>
      <div class="grid-2">${cards}</div>
    </section>
  `;
  return page({
    activeId: 'vma-video',
    title: 'Animated Video Concepts',
    pageTitle: 'Animated Video Concepts',
    pageSubtitle: 'Short animated spots — scene timelines, Remotion + CapCut.',
    body,
  });
}

// ─── 6. ChatGPT Image Prompts (vma-chatgpt.html) ─────────────────────────────

function renderChatgpt() {
  const risks = VMA_META.chatgptRisks.map((r) => `<li>${esc(r)}</li>`).join('');
  const steps = CHATGPT_WORKFLOW.map(
    (s) => `<div class="card"><span class="eyebrow">Step ${s.step}</span><h3>${esc(s.title)}</h3><p>${esc(s.instruction)}</p></div>`,
  ).join('');
  const prompts = CHATGPT_PROMPTS.map(
    (p) => `<div class="card">
      <span class="eyebrow">${esc(p.id)} · ${esc(p.conceptNumber)} · ${esc(p.colorFamily)}</span>
      <h3>${esc(p.title)}</h3>
      ${copyBlock(p.prompt)}
      <p style="margin-top:0.6rem"><b>Overlay in design tools (never AI text):</b></p>
      <ul class="clean"><li>Headline: ${esc(p.overlayLater.headline)}</li><li>Benefits: ${esc(p.overlayLater.benefits.join(', '))}</li><li>CTA: ${esc(p.overlayLater.cta)}</li><li>${esc(p.overlayLater.logo)}</li></ul>
    </div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>ChatGPT Image Prompts</h1>
      <p>Generate full-image ad plates with ChatGPT, then overlay approved copy yourself. ${CHATGPT_PROMPTS.length} production prompts for static concepts. AI makes the plate — the designer makes the ad.</p>
    </div>

    <div class="warn danger"><b>Known AI risks:</b><ul class="clean" style="color:inherit">${risks}</ul></div>

    <section>
      <h2>Workflow</h2>
      <div class="grid">${steps}</div>
    </section>

    <section>
      <h2>Production prompts</h2>
      <div class="grid-2">${prompts}</div>
    </section>
  `;
  return page({
    activeId: 'vma-chatgpt',
    title: 'ChatGPT Image Prompts',
    pageTitle: 'ChatGPT Image Prompts',
    pageSubtitle: 'Generate ad plates — overlay approved copy in design tools.',
    body,
  });
}

// ─── 7. Remotion Playbook (vma-remotion.html) ────────────────────────────────

function renderRemotion() {
  const pb = REMOTION_PLAYBOOK;
  const steps = pb.steps.map((s) => `<li>${esc(s)}</li>`).join('');
  const rules = pb.rules.map((s) => `<li>${esc(s)}</li>`).join('');
  const comps = REMOTION_COMPONENTS.map(
    (c) => `<div class="card"><span class="eyebrow">${esc(c.name)}</span><p>${esc(c.purpose)}</p><p><b>Props:</b> <code>${esc(c.props)}</code></p></div>`,
  ).join('');
  const rows = REMOTION_COMPOSITIONS.map(
    (c) => `<tr><td class="ref">${esc(c.name)}</td><td>${esc(c.duration)} · ${esc(c.frames)}f</td><td>${esc(c.purpose)}</td><td>${c.uses.map((u) => `<span class="chip">${esc(u)}</span>`).join('')}</td></tr>`,
  ).join('');

  const videoPrompts = VIDEO_PROMPTS.map(
    (p) => `<div class="card"><span class="eyebrow">${esc(p.id)} · ${esc(p.videoNumber)} · ${esc(p.duration)} · ${esc(p.remotionComposition)}</span><h3>${esc(p.title)}</h3>${copyBlock(p.prompt)}</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Remotion Playbook</h1>
      <p>Code-driven animated compositions for Virtual Medical Admin spots. Entry file <code>${esc(pb.entryFile)}</code>. The <code>&lt;ColorPlate /&gt;</code> component enforces the approved palette — no pink can render.</p>
    </div>

    <section>
      <h2>How to render</h2>
      <p class="lede">Studio: <code>${esc(pb.studioCmd)}</code> · Render: <code>${esc(pb.renderPattern)}</code></p>
      <ol class="clean">${steps}</ol>
      <div class="warn"><b>Guardrails:</b><ul class="clean" style="color:inherit">${rules}</ul></div>
    </section>

    <section>
      <h2>Components</h2>
      <div class="grid">${comps}</div>
    </section>

    <section>
      <h2>Compositions (${REMOTION_COMPOSITIONS.length})</h2>
      <table><thead><tr><th>Composition</th><th>Length</th><th>Purpose</th><th>Uses</th></tr></thead><tbody>${rows}</tbody></table>
    </section>

    <section>
      <h2>Video prompts</h2>
      <div class="grid-2">${videoPrompts}</div>
    </section>
  `;
  return page({
    activeId: 'vma-remotion',
    title: 'Remotion Playbook',
    pageTitle: 'Remotion Playbook',
    pageSubtitle: 'Code-driven compositions + video prompts.',
    body,
  });
}

// ─── 8. CapCut Templates (vma-capcut.html) ───────────────────────────────────

function renderCapcut() {
  const cards = CAPCUT_TEMPLATES.map((t) => {
    const layers = t.textLayers.map((l) => `<li>${esc(l)}</li>`).join('');
    const rules = t.rules.map((l) => `<li>${esc(l)}</li>`).join('');
    return `<div class="card">
      <span class="eyebrow">${esc(t.id)} · ${esc(t.duration)}</span>
      <h3>${esc(t.name)}</h3>
      <p><b>Aspect ratios:</b> ${t.aspectRatios.map((a) => `<span class="chip">${esc(a)}</span>`).join('')}</p>
      ${beatTimeline(t.beats)}
      <p style="margin-top:0.6rem"><b>Text layers:</b></p><ul class="clean">${layers}</ul>
      <p><b>Color:</b> ${esc(t.colorNote)}</p>
      <p><b>Captions:</b> ${esc(t.captions)}</p>
      <p><b>Music:</b> ${esc(t.music)} · <b>Fonts:</b> ${esc(t.fonts)}</p>
      <p><b>Export:</b> ${esc(t.exportSpec)}</p>
      <div class="warn"><ul class="clean" style="color:inherit">${rules}</ul></div>
    </div>`;
  }).join('');

  const body = `
    <div class="hero">
      <h1>CapCut Templates</h1>
      <p>No-code video templates for the Virtual Medical Admin system — ${CAPCUT_TEMPLATES.length} reusable structures. Single approved color family per export, burned-in captions, MedVirtual logo, no pink.</p>
    </div>
    <section><div class="grid-2">${cards}</div></section>
  `;
  return page({
    activeId: 'vma-capcut',
    title: 'CapCut Templates',
    pageTitle: 'CapCut Templates',
    pageSubtitle: 'No-code video build specs.',
    body,
  });
}

// ─── 9/10. Copy matrices ─────────────────────────────────────────────────────

function renderCopy(groups, lang) {
  const cards = groups
    .map((g) => {
      const block = (label, arr) =>
        `<p style="margin-top:0.6rem"><b>${label}</b></p>` +
        arr.map((t) => copyBlock(t)).join('');
      return `<div class="card">
        <span class="eyebrow">${esc(g.id)} · ${esc(g.matchingForm)}</span>
        <h3>${esc(g.name)}</h3>
        ${block('Primary text (5)', g.primaryTexts)}
        ${block('Headlines (5)', g.headlines)}
        ${block('Descriptions (5)', g.descriptions)}
      </div>`;
    })
    .join('');

  const isEs = lang === 'es';
  const body = `
    <div class="hero">
      <h1>${isEs ? 'Spanish' : 'English'} Copy Matrix</h1>
      <p>${isEs ? 'Native-review required before launch. ' : ''}Five primary texts, five headlines, and five descriptions per group. Copy buttons paste straight into Ads Manager. MedVirtual only — never MedVirtual.ai.</p>
    </div>
    ${isEs ? '<div class="warn">Spanish copy requires native-speaker review. Do not assume nationality of worker or viewer.</div>' : ''}
    <section><div class="grid-2">${cards}</div></section>
  `;
  return page({
    activeId: isEs ? 'vma-copy-es' : 'vma-copy-en',
    title: isEs ? 'Spanish Copy Matrix' : 'English Copy Matrix',
    pageTitle: isEs ? 'Spanish Copy Matrix' : 'English Copy Matrix',
    pageSubtitle: '5 primary · 5 headlines · 5 descriptions per group.',
    body,
  });
}

// ─── 11. Instant Form Playbook (vma-form.html) ───────────────────────────────

function renderForm() {
  const formCard = (f) => {
    const rows = f.fields
      .map((fl) => `<tr><td class="ref">${esc(fl.name)}</td><td>${fl.required ? 'Required' : 'Optional'}</td><td>${esc(fl.type)}</td></tr>`)
      .join('');
    return `<div class="card"><span class="eyebrow">${esc(f.id)}</span><h3>${esc(f.name)}</h3><p>${esc(f.objective)}</p>
      <table><thead><tr><th>Field</th><th>Req</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  const rules = FORMS.rules.map((r) => `<li>${esc(r)}</li>`).join('');
  const tracking = FORMS.trackingFields
    .map((t) => `<tr><td class="ref">${esc(t.label)}</td><td>${esc(t.value)}</td></tr>`)
    .join('');
  const staffing = FORMS.staffingNeedOptions.map((o) => `<span class="chip">${esc(o)}</span>`).join('');
  const completion = COMPLETION_SCREENS.map(
    (c) => `<div class="card"><span class="eyebrow">${esc(c.label)} ${statusBadge(c.status)}</span><h3>${esc(c.headline)}</h3><p>${esc(c.body)}</p><ul class="clean">${c.nextStepBullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><p><b>CTA:</b> ${esc(c.cta)} → ${esc(c.ctaUrl)}</p><div class="warn">${esc(c.notes)}</div></div>`,
  ).join('');
  const offers = OFFER_CONCEPTS.map(
    (o) => `<tr><td class="ref">${esc(o.name)}</td><td>${esc(o.description)}</td><td>${statusBadge(o.status)}</td></tr>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Instant Form Playbook</h1>
      <p>Low-friction Meta Instant Forms that turn scroll-stops into staffing conversations. Default to Form A. Legal/compliance approval required before publishing.</p>
    </div>
    <div class="warn danger">${esc(FORMS.complianceNote)}</div>

    <section><h2>Forms</h2><div class="grid-2">${formCard(FORMS.formA)}${formCard(FORMS.formB)}</div>
      <p class="lede" style="margin-top:0.6rem"><b>Staffing-need options (Form B):</b> ${staffing}</p></section>

    <section><h2>Form rules</h2><ul class="clean">${rules}</ul></section>

    <section><h2>Hidden tracking fields</h2>
      <table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>${tracking}</tbody></table></section>

    <section><h2>Completion screens</h2><div class="grid-2">${completion}</div></section>

    <section><h2>Offer concepts (pending)</h2>
      <div class="warn">Do not publish any offer until leadership approves it.</div>
      <table><thead><tr><th>Offer</th><th>Description</th><th>Status</th></tr></thead><tbody>${offers}</tbody></table></section>
  `;
  return page({
    activeId: 'vma-form',
    title: 'Instant Form Playbook',
    pageTitle: 'Instant Form Playbook',
    pageSubtitle: 'Low-friction lead forms + completion screens.',
    body,
  });
}

// ─── 12. Campaign Tests (vma-campaign.html) ──────────────────────────────────

function renderCampaign() {
  const adSets = CAMPAIGN.adSets
    .map(
      (a) => `<div class="card"><span class="eyebrow">Ad set</span><h3>${esc(a.name)}</h3><p>${esc(a.structure)}</p>
        <p><b>Creatives:</b> ${a.creatives.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</p>
        <div class="warn">${esc(a.budgetNote)}</div></div>`,
    )
    .join('');
  const controls = CAMPAIGN.controls.map((c) => `<li>${esc(c)}</li>`).join('');

  const body = `
    <div class="hero">
      <h1>Campaign Tests</h1>
      <p>${esc(CAMPAIGN.campaign)} — objective: ${esc(CAMPAIGN.objective)}</p>
    </div>
    <div class="warn danger">${esc(CAMPAIGN.warning)}</div>
    <section><h2>Ad sets</h2><div class="grid-2">${adSets}</div></section>
    <section><h2>Test controls</h2><ul class="clean">${controls}</ul></section>
  `;
  return page({
    activeId: 'vma-campaign',
    title: 'Campaign Tests',
    pageTitle: 'Campaign Tests',
    pageSubtitle: 'Ad sets, color isolation, and the $100 rule.',
    showRule: true,
    body,
  });
}

// ─── 13. Claims Tracker (vma-claims.html) ────────────────────────────────────

function renderClaims() {
  const legend = CLAIM_STATUSES.map((s) => statusBadge(s)).join(' ');
  const rows = CLAIMS.map(
    (c) => `<tr><td class="ref">${esc(c.label)}</td><td>${esc(c.category)}</td><td>${statusBadge(c.status)}</td><td>${esc(c.claimText)}</td><td>${esc(c.notes)}</td></tr>`,
  ).join('');
  const body = `
    <div class="hero">
      <h1>Claims Tracker</h1>
      <p>Every price, HIPAA, savings, availability, and offer claim with its approval status. A claim may not appear on any published ad, video, or form until it is <b>Approved for Launch</b>.</p>
    </div>
    <div class="warn">Statuses: ${legend}</div>
    <section><table><thead><tr><th>Claim</th><th>Category</th><th>Status</th><th>Text</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></section>
  `;
  return page({
    activeId: 'vma-claims',
    title: 'Claims Tracker',
    pageTitle: 'Claims Tracker',
    pageSubtitle: 'Approval status for every claim.',
    body,
  });
}

// ─── 14. Launch QA (vma-qa.html) ─────────────────────────────────────────────

function renderQA() {
  let idx = 0;
  const sections = QA_CHECKLIST.map((grp) => {
    const items = grp.items
      .map((it) => {
        const id = `qa-${idx++}`;
        return `<label class="checkline"><input type="checkbox" data-persist="${id}" /> <span>${esc(it)}</span></label>`;
      })
      .join('');
    return `<div class="card"><span class="eyebrow">${esc(grp.group)}</span>${items}</div>`;
  }).join('');

  const body = `
    <div class="hero">
      <h1>Launch QA</h1>
      <p>Pre-flight checklist for every Virtual Medical Admin ad. Checked items save to this browser. Do not scale spend until lead flow is confirmed end-to-end.</p>
    </div>
    <section><div class="grid-2">${sections}</div></section>
  `;
  return page({
    activeId: 'vma-qa',
    title: 'Launch QA',
    pageTitle: 'Launch QA',
    pageSubtitle: 'Pre-flight checklist — saves to your browser.',
    showRule: true,
    body,
  });
}

// ─── 15. Production Queue (vma-queue.html) ────────────────────────────────────

function renderQueue() {
  const rows = PRODUCTION_QUEUE.map(
    (q) => `<tr>
      <td class="ref">${q.order}</td>
      <td class="ref">${esc(q.ref)}</td>
      <td><span class="chip">${esc(q.type)}</span></td>
      <td>${swatch(getColorFamily(q.colorFamilyId).accent)}${esc(q.label)}</td>
      <td>${statusBadge(q.status)}</td>
      <td>${q.notes ? `<span class="warn" style="display:inline-block">${esc(q.notes)}</span>` : ''}</td>
    </tr>`,
  ).join('');
  const statuses = PRODUCTION_STATUSES.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
  const body = `
    <div class="hero">
      <h1>Production Queue</h1>
      <p>${PRODUCTION_QUEUE.length} build items alternating Static and Video, in launch order. Color tests first, then role / pain / offer / Spanish.</p>
    </div>
    <section><table><thead><tr><th>#</th><th>Ref</th><th>Type</th><th>Item</th><th>Status</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>Status vocabulary</h2><p>${statuses}</p></section>
  `;
  return page({
    activeId: 'vma-queue',
    title: 'Production Queue',
    pageTitle: 'Production Queue',
    pageSubtitle: '24 static + video items in launch order.',
    body,
  });
}

// ─── 16. Approval Board (vma-approval.html) ──────────────────────────────────

function renderApproval() {
  let idx = 0;
  const rows = [...COLOR_TEST_SET, ...CONCEPTS]
    .map((c) => {
      const id = `appr-${idx++}`;
      const fam = getColorFamily(c.colorFamilyId);
      return `<tr>
        <td class="ref">${esc(c.number)}</td>
        <td>${esc(c.name)}</td>
        <td>${swatch(fam.accent)}${esc(fam.name)}</td>
        <td>${statusBadge(c.productionStatus || 'Ready for design')}</td>
        <td><input type="text" data-persist="${id}-rev" placeholder="reviewer" style="width:7rem;background:#05070b;border:1px solid #263041;border-radius:6px;color:#f8fafc;font:inherit;padding:0.2rem 0.35rem" /></td>
        <td><label class="checkline" style="border:none;padding:0"><input type="checkbox" data-persist="${id}-ok" /> <span>Approved</span></label></td>
      </tr>`;
    })
    .join('');
  const body = `
    <div class="hero">
      <h1>Approval Board</h1>
      <p>Sign-off tracking for every color test and static concept. Reviewer names and approval checks save to this browser. Nothing launches with a pending claim.</p>
    </div>
    <section><table><thead><tr><th>Ref</th><th>Concept</th><th>Color</th><th>Status</th><th>Reviewer</th><th>Sign-off</th></tr></thead><tbody>${rows}</tbody></table></section>
  `;
  return page({
    activeId: 'vma-approval',
    title: 'Approval Board',
    pageTitle: 'Approval Board',
    pageSubtitle: 'Reviewer sign-off tracking.',
    body,
  });
}

// ─── 17. Project History (vma-history.html) ──────────────────────────────────

function renderHistory() {
  const removed = [
    ['Teal SaaS / no-people lane', 'Archived as primary Meta direction — glass/3D props, no people. Kept under Producer Lab only.'],
    ['Role-Offer + Real People (Hailey lane)', 'Useful people treatments; not the current cold-lead system.'],
    ['Pink / magenta reference palettes', 'Reference competitor ads used pink — that informed structure only. Pink is permanently forbidden in MedVirtual creative.'],
    ['dr-* board set (July 14 2026)', 'Superseded by the VMA static + animated-video system. Old dr-* routes now redirect to VMA pages.'],
    ['Brand-first restraint direction', 'Replaced by offer-first, high-contrast direct response designed to generate leads.'],
  ]
    .map(([t, d]) => `<div class="card"><span class="eyebrow">Removed / archived</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`)
    .join('');

  const redirects = REDIRECTS.map(
    (r) => `<tr><td class="ref">/${esc(r.from)}</td><td>→</td><td>${esc(r.to)}</td></tr>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Project History</h1>
      <p>One-note archive of removed and superseded directions. The current system is bold Virtual Medical Admin ads plus animated video.</p>
    </div>
    <section><div class="grid">${removed}</div></section>
    <section><h2>Old route redirects</h2>
      <p class="lede">These legacy pages now meta-refresh to their VMA replacements.</p>
      <table><thead><tr><th>Old</th><th></th><th>New</th></tr></thead><tbody>${redirects}</tbody></table></section>
  `;
  return page({
    activeId: 'vma-history',
    title: 'Project History',
    pageTitle: 'Project History',
    pageSubtitle: 'Removed directions + legacy redirects.',
    body,
  });
}

// ─── Redirects ───────────────────────────────────────────────────────────────

const REDIRECTS = [
  { from: 'dr-concepts-en.html', to: '/vma-static.html' },
  { from: 'dr-concepts-es.html', to: '/vma-copy-es.html' },
  { from: 'dr-concepts-roles.html', to: '/vma-static.html' },
  { from: 'dr-image-prompts.html', to: '/vma-chatgpt.html' },
  { from: 'dr-form.html', to: '/vma-form.html' },
  { from: 'dr-offers.html', to: '/vma-form.html' },
  { from: 'dr-claims.html', to: '/vma-claims.html' },
  { from: 'dr-production-queue.html', to: '/vma-queue.html' },
  { from: 'dr-qa-checklist.html', to: '/vma-qa.html' },
  { from: 'dr-campaign-plan.html', to: '/vma-campaign.html' },
  { from: 'dr-copy-matrix.html', to: '/vma-copy-en.html' },
  { from: 'dr-copy-en.html', to: '/vma-copy-en.html' },
  { from: 'dr-copy-es.html', to: '/vma-copy-es.html' },
  { from: 'dr-approval.html', to: '/vma-approval.html' },
  { from: 'dr-superseded.html', to: '/vma-history.html' },
  { from: 'dr-reference-analysis.html', to: '/competitors.html' },
  { from: 'dr-design-system.html', to: '/direct-response.html' },
  { from: 'dr-color-board.html', to: '/direct-response.html' },
];

function renderRedirect(to) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${esc(to)}" />
  <link rel="canonical" href="${esc(to)}" />
  <title>Moved — MedVirtual VMA</title>
  <style>body{font-family:${BRAND.fonts.family};background:#06080d;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}a{color:#B8F000}</style>
</head>
<body>
  <p>This page moved. Redirecting to <a href="${esc(to)}">${esc(to)}</a>…</p>
  <script>location.replace(${JSON.stringify(to)});</script>
</body>
</html>`;
}

// ─── Ideas.html — simple links to VMA sections ───────────────────────────────

function renderIdeas() {
  const links = VMA_NAV_LINKS.map((n) => `<a class="card" href="${n.href}"><span class="eyebrow">Section</span><h3>${esc(n.label)}</h3><p>${esc(n.description)}</p></a>`).join('');
  const body = `
    <div class="hero"><h1>Ideas — VMA Sections</h1><p>Quick links into the current Virtual Medical Admin production system.</p></div>
    <section><div class="grid">${links}</div></section>
  `;
  return page({ activeId: 'studio', title: 'Ideas', pageTitle: 'Ideas', pageSubtitle: 'Jump into any VMA section.', body });
}

const VMA_NAV_LINKS = VMA_NAV.filter((n) => n.id !== 'studio');

// ─── Write everything ────────────────────────────────────────────────────────

write('studio.html', renderDashboard());
write('direct-response.html', renderDirection());
write('competitors.html', renderCompetitors());
write('vma-static.html', renderStatic());
write('vma-video.html', renderVideo());
write('vma-chatgpt.html', renderChatgpt());
write('vma-remotion.html', renderRemotion());
write('vma-capcut.html', renderCapcut());
write('vma-copy-en.html', renderCopy(COPY_EN, 'en'));
write('vma-copy-es.html', renderCopy(COPY_ES, 'es'));
write('vma-form.html', renderForm());
write('vma-campaign.html', renderCampaign());
write('vma-claims.html', renderClaims());
write('vma-qa.html', renderQA());
write('vma-queue.html', renderQueue());
write('vma-approval.html', renderApproval());
write('vma-history.html', renderHistory());

const pageCount = filesWritten;

// Redirects + ideas
REDIRECTS.forEach((r) => write(r.from, renderRedirect(r.to)));
write('ideas.html', renderIdeas());

console.log(`VMA site generated · ${pageCount} primary pages + ${REDIRECTS.length} redirects + ideas.html · ${filesWritten} files total.`);
