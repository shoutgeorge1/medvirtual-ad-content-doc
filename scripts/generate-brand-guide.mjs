/**
 * Official MedVirtual Brand Guide — internal creative production standards.
 * Route: /medvirtual-brand-guide.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND, BRAND_VOICE, ICP, ROLE_USE_CASES } from './medvirtual-brand-data.mjs';
import { CLAIMS_REVIEW, CLAIMS_UPDATED } from './medvirtual-claims-review.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const colorRows = [
  { name: 'Main 01', hex: BRAND.colors.main01, use: 'Primary brand · CTAs · accents', token: '--mv-primary' },
  { name: 'Main 02', hex: BRAND.colors.main02, use: 'Cyan highlight · gradients · links', token: '--mv-cyan' },
  { name: 'Main 03', hex: BRAND.colors.main03, use: 'Deep teal · dark panels · headers', token: '--mv-deep-teal' },
  { name: 'Accent 01', hex: BRAND.colors.accent01, use: 'Secondary accent · charts · UI', token: '--mv-accent' },
  { name: 'Accent 02', hex: BRAND.colors.accent02, use: 'Bright accent · sparingly', token: '--mv-bright-accent' },
  { name: 'Neutral 01', hex: BRAND.colors.neutral01, use: 'Cool light backgrounds', token: '--mv-neutral-blue' },
  { name: 'Neutral 02', hex: BRAND.colors.neutral02, use: 'Warm light backgrounds', token: '--mv-neutral-warm' },
];

const gradientRows = [
  { name: 'Gradient 01', css: BRAND.gradients.primary, token: '--mv-gradient-primary', desc: 'Primary brand gradient' },
  { name: 'Gradient 02', css: BRAND.gradients.light, token: '--mv-gradient-light', desc: 'Light marketing wash' },
  { name: 'Gradient 03', css: BRAND.gradients.bright, token: '--mv-gradient-bright', desc: 'Bright accent wash' },
  { name: 'Gradient 04', css: BRAND.gradients.deep, token: '--mv-gradient-deep', desc: 'Deep teal → cyan' },
];

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--mv-font);
    background: var(--mv-neutral-blue);
    color: var(--mv-ink);
    line-height: 1.5;
  }
  .wrap { max-width: 980px; margin: 0 auto; padding: 1.25rem 1.15rem 3.5rem; }
  .hero {
    background: var(--mv-gradient-deep);
    color: var(--mv-white);
    border-radius: 14px;
    padding: 1.25rem 1.35rem;
    margin-bottom: 1rem;
  }
  .hero h2 { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.35rem; }
  .hero p { font-size: 0.92rem; opacity: 0.92; max-width: 62ch; font-weight: 400; }
  .badge {
    display: inline-block; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em;
    text-transform: uppercase; background: rgba(255,255,255,0.18); padding: 0.2rem 0.55rem;
    border-radius: 6px; margin-bottom: 0.55rem;
  }
  .section {
    background: var(--mv-white);
    border: 1px solid #d7e3f0;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
    margin-bottom: 0.85rem;
  }
  .section > h2 {
    font-size: 1.05rem; font-weight: 700; color: var(--mv-deep-teal);
    margin-bottom: 0.35rem; padding-bottom: 0.4rem;
    border-bottom: 2px solid var(--mv-cyan);
  }
  .section > .lede { font-size: 0.9rem; color: #3d4f5f; margin-bottom: 0.9rem; max-width: 70ch; font-weight: 400; }
  h3 { font-size: 0.88rem; font-weight: 700; color: var(--mv-primary); margin: 0.9rem 0 0.45rem; }
  .logo-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
  }
  @media (max-width: 700px) { .logo-grid { grid-template-columns: 1fr; } }
  .logo-card {
    border: 1px solid #d7e3f0; border-radius: 10px; padding: 0.85rem; background: #fff;
  }
  .logo-card.dark { background: var(--mv-deep-teal); border-color: var(--mv-deep-teal); color: #fff; }
  .logo-card.light-cool { background: var(--mv-neutral-blue); }
  .logo-card.light-warm { background: var(--mv-neutral-warm); }
  .logo-card img {
    display: block; max-width: 100%; height: auto; max-height: 72px; width: auto;
    object-fit: contain; object-position: left center;
  }
  .logo-card.mark img { max-height: 88px; margin: 0 auto; }
  .logo-card .lbl { font-size: 0.72rem; font-weight: 600; margin-top: 0.55rem; opacity: 0.85; }
  .rules { padding-left: 1.15rem; margin: 0.5rem 0; }
  .rules li { font-size: 0.88rem; margin: 0.28rem 0; color: #2a3a45; }
  .swatch-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.65rem;
  }
  .swatch {
    border: 1px solid #d7e3f0; border-radius: 10px; overflow: hidden; background: #fff;
  }
  .swatch__chip { height: 64px; }
  .swatch__meta { padding: 0.55rem 0.65rem; }
  .swatch__name { font-size: 0.8rem; font-weight: 700; }
  .swatch__hex { font-family: ui-monospace, monospace; font-size: 0.72rem; color: var(--mv-primary); }
  .swatch__use { font-size: 0.72rem; color: #5a6b78; margin-top: 0.2rem; }
  .swatch__token { font-size: 0.65rem; color: #8090a0; margin-top: 0.15rem; }
  .grad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
  @media (max-width: 640px) { .grad-grid { grid-template-columns: 1fr; } }
  .grad {
    border-radius: 10px; min-height: 72px; padding: 0.75rem; color: #fff;
    display: flex; flex-direction: column; justify-content: flex-end;
    border: 1px solid #d7e3f0;
  }
  .grad.light-text-dark { color: var(--mv-deep-teal); }
  .grad strong { font-size: 0.85rem; }
  .grad span { font-size: 0.7rem; opacity: 0.9; }
  .type-sample { margin: 0.55rem 0; }
  .type-xl { font-size: 2rem; font-weight: 700; line-height: 1.15; color: var(--mv-deep-teal); }
  .type-lg { font-size: 1.45rem; font-weight: 700; line-height: 1.2; color: var(--mv-primary); }
  .type-sub { font-size: 1.1rem; font-weight: 500; color: #2a3a45; }
  .type-body { font-size: 1rem; font-weight: 400; max-width: 58ch; color: #2a3a45; }
  .cta-demo {
    display: inline-block; margin-top: 0.65rem; background: var(--mv-gradient-primary);
    color: #fff; font-weight: 700; font-size: 0.9rem; padding: 0.65rem 1.15rem; border-radius: 8px;
    text-decoration: none;
  }
  .weight-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0.5rem 0 0.85rem; }
  .weight {
    flex: 1; min-width: 140px; border: 1px solid #d7e3f0; border-radius: 8px; padding: 0.65rem;
  }
  .weight .w { font-size: 1.25rem; }
  .weight .meta { font-size: 0.7rem; color: #5a6b78; margin-top: 0.25rem; }
  .compare { display: grid; gap: 0.55rem; }
  .pair {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem;
  }
  @media (max-width: 700px) { .pair { grid-template-columns: 1fr; } }
  .weak, .better {
    border-radius: 8px; padding: 0.7rem 0.8rem; font-size: 0.86rem;
  }
  .weak { background: #fff5f5; border: 1px solid #fecaca; color: #7f1d1d; }
  .better { background: #f0fdfa; border: 1px solid #99f6e4; color: #134e4a; }
  .weak strong, .better strong { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.3rem; }
  .structure { counter-reset: step; list-style: none; }
  .structure li {
    counter-increment: step; position: relative; padding: 0.55rem 0.65rem 0.55rem 2.5rem;
    border: 1px solid #d7e3f0; border-radius: 8px; margin: 0.35rem 0; font-size: 0.9rem;
  }
  .structure li::before {
    content: counter(step); position: absolute; left: 0.65rem; top: 0.55rem;
    width: 1.4rem; height: 1.4rem; border-radius: 50%; background: var(--mv-primary); color: #fff;
    font-size: 0.75rem; font-weight: 700; display: grid; place-items: center;
  }
  .example-box {
    margin-top: 0.75rem; background: var(--mv-neutral-blue); border-left: 4px solid var(--mv-cyan);
    padding: 0.75rem 0.9rem; border-radius: 0 8px 8px 0; font-size: 0.9rem;
  }
  .warn-wrap { border: 2px solid #f59e0b; background: #fffbeb; border-radius: 12px; padding: 1rem 1.1rem; }
  .warn-wrap > h2 { border-bottom-color: #f59e0b; color: #92400e; }
  .claim {
    border: 1px solid #fcd34d; border-radius: 8px; padding: 0.75rem 0.85rem; background: #fff;
    margin: 0.55rem 0;
  }
  .claim__top { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: baseline; justify-content: space-between; }
  .claim__cat { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #b45309; }
  .claim__status {
    font-size: 0.7rem; font-weight: 700; background: #fef3c7; color: #92400e;
    border: 1px solid #fcd34d; border-radius: 999px; padding: 0.15rem 0.5rem;
  }
  .claim__status.block { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
  .claim__status.safe { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
  .claim h3 { margin: 0.35rem 0 0.25rem; color: var(--mv-ink); font-size: 0.95rem; }
  .claim ul { padding-left: 1.1rem; margin: 0.25rem 0; }
  .claim li { font-size: 0.82rem; margin: 0.12rem 0; }
  .claim .src, .claim .note { font-size: 0.78rem; color: #5a6b78; margin-top: 0.35rem; }
  .claim .ok { font-size: 0.82rem; font-weight: 600; color: #047857; margin-top: 0.35rem; }
  .role-grid { display: grid; gap: 0.65rem; }
  .role {
    border: 1px solid #d7e3f0; border-radius: 10px; padding: 0.75rem 0.85rem; background: #fafcff;
  }
  .role h3 { margin-top: 0; }
  .role .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
  @media (max-width: 640px) { .role .cols { grid-template-columns: 1fr; } }
  .role ul { padding-left: 1.05rem; font-size: 0.8rem; color: #2a3a45; }
  .role .disallow { color: #991b1b; }
  .doc-map {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.55rem;
  }
  .doc-map a {
    display: block; text-decoration: none; color: inherit; border: 1px solid #d7e3f0;
    border-radius: 8px; padding: 0.65rem 0.75rem; background: #fff;
  }
  .doc-map a:hover { border-color: var(--mv-cyan); }
  .doc-map strong { display: block; font-size: 0.85rem; color: var(--mv-deep-teal); }
  .doc-map span { font-size: 0.75rem; color: #5a6b78; }
  .clearspace {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.75rem;
  }
  @media (max-width: 640px) { .clearspace { grid-template-columns: 1fr; } }
  .clearspace-box {
    border: 1px dashed var(--mv-cyan); border-radius: 10px; padding: 1.5rem;
    display: grid; place-items: center; background: #fff;
  }
  .clearspace-box img { max-height: 48px; width: auto; }
  .clearspace-box p { font-size: 0.72rem; color: #5a6b78; margin-top: 0.55rem; text-align: center; }
`;

function statusClass(status) {
  if (status.startsWith('Conflicting') || status.startsWith('Do not publish')) return 'block';
  if (status.startsWith('Default safe')) return 'safe';
  return '';
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Brand Guide — MedVirtual (Internal)</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'brand-guide',
    pageTitle: 'Brand Guide',
    pageSubtitle: 'Internal creative standards — logos, colors, type, voice, claims guardrails. Not a public sales page.',
  })}
  <div class="wrap">
    <header class="hero">
      <span class="badge">Internal · Creative production</span>
      <h2>${esc(BRAND.displayName)} brand &amp; messaging source of truth</h2>
      <p>Use this page for production decisions. Ad-facing name is <strong>${esc(BRAND.adFacingName)}</strong> (not MedVirtual.ai). Website may still use ${esc(BRAND.websiteUrl)}.</p>
    </header>

    <section class="section" id="identity">
      <h2>1 · Official identity</h2>
      <p class="lede">Prefer SVG for web and production. Do not use Illustrator (.ai) sources in the browser. PNG is fallback for raster export only.</p>
      <div class="logo-grid">
        <div class="logo-card light-cool">
          <img src="${esc(BRAND.assets.logoColoredSvg)}" alt="MedVirtual colored logo" />
          <p class="lbl">Colored horizontal · light blue</p>
        </div>
        <div class="logo-card dark">
          <img src="${esc(BRAND.assets.logoWhiteSvg)}" alt="MedVirtual white logo" />
          <p class="lbl">White horizontal · dark teal</p>
        </div>
        <div class="logo-card light-warm mark">
          <img src="${esc(BRAND.assets.logomarkColoredSvg)}" alt="MedVirtual colored mark" />
          <p class="lbl">Colored logomark</p>
        </div>
        <div class="logo-card dark mark">
          <img src="${esc(BRAND.assets.logomarkWhiteSvg)}" alt="MedVirtual white mark" />
          <p class="lbl">White logomark</p>
        </div>
      </div>
      <div class="clearspace">
        <div class="clearspace-box">
          <img src="${esc(BRAND.assets.logoColoredSvg)}" alt="" />
          <p>Clear space — keep breathing room equal to roughly the mark height</p>
        </div>
        <div class="clearspace-box" style="background:var(--mv-deep-teal)">
          <img src="${esc(BRAND.assets.logoWhiteSvg)}" alt="" />
          <p style="color:#cfe8f0">Dark background — white logo only</p>
        </div>
      </div>
      <h3>Logo rules</h3>
      <ul class="rules">
        <li>Do not distort, skew, or stretch</li>
        <li>Do not recolor outside approved colored / white variants</li>
        <li>Do not use tiny corner logos when the brand must be recognized</li>
        <li>Do not use low-resolution screenshot logos</li>
        <li>Prefer SVG for web and production; PNG for raster fallback</li>
      </ul>
    </section>

    <section class="section" id="color">
      <h2>2 · Color system</h2>
      <p class="lede">Official Brand Kit values. Use CSS tokens from <code>medvirtual-brand-data.mjs</code> instead of scattering hex values.</p>
      <div class="swatch-grid">
        ${colorRows
          .map(
            (c) => `<div class="swatch">
          <div class="swatch__chip" style="background:${esc(c.hex)}"></div>
          <div class="swatch__meta">
            <div class="swatch__name">${esc(c.name)}</div>
            <div class="swatch__hex">${esc(c.hex)}</div>
            <div class="swatch__use">${esc(c.use)}</div>
            <div class="swatch__token">${esc(c.token)}</div>
          </div>
        </div>`,
          )
          .join('')}
      </div>
      <h3>Official gradients</h3>
      <div class="grad-grid">
        ${gradientRows
          .map(
            (g, i) => `<div class="grad${i === 1 || i === 2 ? ' light-text-dark' : ''}" style="background:${esc(g.css)}">
          <strong>${esc(g.name)}</strong>
          <span>${esc(g.desc)} · ${esc(g.token)}</span>
        </div>`,
          )
          .join('')}
      </div>
    </section>

    <section class="section" id="type">
      <h2>3 · Typography</h2>
      <p class="lede">Official family: Be Vietnam. Fallbacks: Inter, Arial, sans-serif. Do not make every element bold.</p>
      <div class="weight-row">
        <div class="weight"><div class="w" style="font-weight:700">Be Vietnam Bold</div><div class="meta">Extra-large &amp; large headings</div></div>
        <div class="weight"><div class="w" style="font-weight:500">Be Vietnam Medium</div><div class="meta">Subheadings</div></div>
        <div class="weight"><div class="w" style="font-weight:400">Be Vietnam Regular</div><div class="meta">Body copy</div></div>
      </div>
      <div class="type-sample type-xl">Extra-large heading</div>
      <div class="type-sample type-lg">Large heading</div>
      <div class="type-sample type-sub">Subheading · Medium weight</div>
      <p class="type-sample type-body">Body: MedVirtual helps practices hire dedicated full-time virtual staff who become part of the practice’s team — healthcare-trained talent matched to real workflows.</p>
      <a class="cta-demo" href="#voice">Request an interview</a>
    </section>

    <section class="section" id="voice">
      <h2>4 · Brand voice</h2>
      <p class="lede">${esc(BRAND_VOICE.traits.join(' · '))}</p>
      <p class="lede"><strong>Service model:</strong> ${esc(BRAND_VOICE.serviceModel.correct)}</p>
      <h3>Weak vs better</h3>
      <div class="compare">
        ${BRAND_VOICE.weakVsBetter
          .map(
            (p) => `<div class="pair">
          <div class="weak"><strong>Weak</strong>${esc(p.weak)}</div>
          <div class="better"><strong>Better</strong>${esc(p.better)}</div>
        </div>`,
          )
          .join('')}
      </div>
      <h3>Prefer</h3>
      <ul class="rules">${BRAND_VOICE.preferredPhrases.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <h3>Avoid</h3>
      <ul class="rules">${BRAND_VOICE.avoidPhrases.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <h3>Not MedVirtual</h3>
      <ul class="rules">${BRAND_VOICE.serviceModel.not.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </section>

    <section class="section" id="messaging">
      <h2>5 · Approved messaging structure</h2>
      <ol class="structure">
        ${BRAND_VOICE.messagingStructure.map((s) => `<li>${esc(s)}</li>`).join('')}
      </ol>
      <div class="example-box">${esc(BRAND_VOICE.messagingExample)}</div>
      <h3>Core verticals &amp; buyers</h3>
      <p class="lede">${esc(ICP.coreVerticals.join(' · '))} · ${esc(ICP.specialtyCountLabel)}</p>
      <p class="lede" style="margin-bottom:0">${esc(ICP.decisionMakers.join(' · '))}</p>
    </section>

    <section class="section warn-wrap" id="claims">
      <h2>6 · Claims requiring approval</h2>
      <p class="lede">Updated ${esc(CLAIMS_UPDATED)}. Internal only — do not copy unverified numbers into new ads. Safe HIPAA default shown where available.</p>
      ${CLAIMS_REVIEW.map(
        (c) => `<article class="claim" id="claim-${esc(c.id)}">
        <div class="claim__top">
          <span class="claim__cat">${esc(c.category)}</span>
          <span class="claim__status ${statusClass(c.status)}">${esc(c.status)}</span>
        </div>
        <h3>${esc(c.claim)}</h3>
        <ul>${c.valuesFound.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
        <p class="src">Sources: ${esc(c.sourceFiles.join(' · '))}</p>
        ${c.approvedPublicWording ? `<p class="ok">Approved / safe wording: ${esc(c.approvedPublicWording)}</p>` : '<p class="note">Approved public wording: none yet</p>'}
        <p class="note">${esc(c.notes)}</p>
      </article>`,
      ).join('')}
    </section>

    <section class="section" id="roles">
      <h2>Role &amp; use-case map</h2>
      <p class="lede">Safe ad hooks and disallowed claims by role. Expand from SDR intake / GTM — do not invent outcome metrics.</p>
      <div class="role-grid">
        ${ROLE_USE_CASES.map(
          (r) => `<article class="role">
          <h3>${esc(r.role)}</h3>
          <p class="lede" style="margin-bottom:0.45rem">Practices: ${esc(r.practiceTypes.join(', '))}</p>
          <div class="cols">
            <div><strong style="font-size:0.75rem">Pains</strong><ul>${r.pains.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div><strong style="font-size:0.75rem">Workflows</strong><ul>${r.workflows.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          </div>
          <p style="margin-top:0.45rem"><strong style="font-size:0.75rem">Safe hooks</strong></p>
          <ul>${r.safeHooks.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <p style="margin-top:0.35rem"><strong style="font-size:0.75rem" class="disallow">Disallowed / unverified</strong></p>
          <ul class="disallow">${r.disallowed.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </article>`,
        ).join('')}
      </div>
    </section>

    <section class="section" id="doc-purposes">
      <h2>Document purposes</h2>
      <p class="lede">Keep these roles separate — no single page should carry strategy, brief, downloads, and Meta build together.</p>
      <div class="doc-map">
        <a href="/graphic-request-brief.html"><strong>Brief</strong><span>VA queue + Graphics Request Form paste</span></a>
        <a href="/real-people-creative.html"><strong>Real People</strong><span>Portrait Lead concept + source downloads</span></a>
        <a href="/medvirtual-brand-guide.html"><strong>Brand Guide</strong><span>Visual + verbal standards</span></a>
        <a href="/meta-launch-build-pack.html"><strong>Meta Launch</strong><span>Campaign implementation &amp; QA</span></a>
        <a href="/asset-hub.html"><strong>Assets</strong><span>Brand + raw creative downloads</span></a>
        <a href="/marketing-library.html"><strong>Marketing Library</strong><span>Blog, LinkedIn, newsletter, print, social</span></a>
      </div>
    </section>

    <section class="section" id="refs">
      <h2>Reference boards</h2>
      <p class="lede">Official kit images for designers — not logos to place in ads.</p>
      <div class="logo-grid">
        <div class="logo-card"><img src="${esc(BRAND.assets.brandKitRef)}" alt="Brand kit reference" style="max-height:180px;width:100%;object-fit:contain" /><p class="lbl">Brand Kit reference</p></div>
        <div class="logo-card"><img src="${esc(BRAND.assets.linkedinBannerRef)}" alt="LinkedIn banner" style="max-height:120px;width:100%;object-fit:contain" /><p class="lbl">LinkedIn banner reference</p></div>
        <div class="logo-card" style="grid-column:1/-1"><img src="${esc(BRAND.assets.storyGradientRef)}" alt="Story gradient" style="max-height:160px;width:100%;object-fit:contain" /><p class="lbl">Stories gradient reference</p></div>
      </div>
    </section>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'medvirtual-brand-guide.html'), html);
console.log('Wrote public/medvirtual-brand-guide.html');
