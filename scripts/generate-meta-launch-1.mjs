/**
 * Launch 1 — graphics-facing Real People feed ads (Jessica, Chelsea, Angelica, Mark).
 * Meta ops / UTMs stay on the legacy build pack as optional deep link.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader, LAUNCH_SUBNAV } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { LAUNCHES } from './launch-sequences-data.mjs';
import { META_AD_PACKAGES, TREATMENT_E, talentById } from './real-people-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const launch = LAUNCHES.find((l) => l.id === '1');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CARDS = [
  {
    talentId: 'jessica',
    file: 'IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
    preview: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'chelsea',
    file: 'IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png',
    preview: '/assets/real-people/chelsea/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'angelica',
    file: 'IMB_MV_RP_Static_03_AngelicaFrontDesk_1080x1350.png',
    preview: '/assets/real-people/angelica/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'mark',
    file: 'IMB_MV_RP_Static_04_MarkVerification_1080x1350.png',
    preview: '/assets/real-people/mark/ad-treatment-e-4x5.png',
  },
];

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ${BRAND.fonts.family}; color: ${BRAND.colors.ink}; background: #f4f7fa; }
  main { max-width: 960px; margin: 0 auto; padding: 1.25rem 1.1rem 3rem; }
  .lede { color: #475569; max-width: 42rem; margin: 0 0 1rem; }
  .status {
    display: inline-block; background: #dcfce7; color: #166534; font-size: 0.75rem; font-weight: 800;
    padding: 0.25rem 0.6rem; border-radius: 999px; margin-bottom: 0.75rem;
  }
  .grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }
  .card {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 0.75rem; text-decoration: none; color: inherit;
  }
  .card img { width: 100%; height: auto; border-radius: 8px; display: block; }
  .card h3 { margin: 0.55rem 0 0.15rem; font-size: 1rem; }
  .card p { margin: 0; font-size: 0.82rem; color: #64748b; }
  .card .hook { margin-top: 0.4rem; font-size: 0.78rem; color: #334155; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 1.1rem 0; }
  .btn {
    display: inline-flex; padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #fff; color: ${BRAND.colors.main03}; font: inherit; font-size: 0.82rem; font-weight: 700; text-decoration: none;
  }
  .btn.primary { background: ${BRAND.colors.main01}; border-color: ${BRAND.colors.main01}; color: #fff; }
  details { background: #fff; border: 1px solid #d7e2ea; border-radius: 10px; padding: 0.75rem 0.9rem; margin-top: 1rem; }
  summary { cursor: pointer; font-weight: 800; color: ${BRAND.colors.main03}; }
`;

const cards = CARDS.map((c, i) => {
  const t = talentById(c.talentId);
  const te = TREATMENT_E.find((x) => x.talentId === c.talentId);
  const pkg = META_AD_PACKAGES.find((x) => x.talentId === c.talentId);
  return `<a class="card" href="${esc(c.preview)}" target="_blank" rel="noopener">
    <img src="${esc(c.preview)}" alt="${esc(te.meetLine)}" width="432" height="540" loading="lazy" />
    <h3>${i + 1}. ${esc(t.firstName)}</h3>
    <p>${esc(te.role)}</p>
    <p class="hook">On-image: ${esc(te.meetLine)} · ${esc(te.supportLine || 'Available to interview')}</p>
    <p class="hook">Meta headline: ${esc(pkg.headline)}</p>
  </a>`;
}).join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Launch 1 · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'launch-1',
    pageTitle: launch.title,
    pageSubtitle: launch.forGraphics,
    subnav: LAUNCH_SUBNAV,
    activeSubHref: launch.href,
  })}
  <main>
    <span class="status">ACTIVE · Studio Profile</span>
    <p class="lede"><strong>Do this:</strong> finalize these 4 feed ads (1080×1350). Use Real People for source photos + layout rules. Pain copy stays in Meta text — not on the image.</p>
    <div class="actions">
      <a class="btn primary" href="/graphic-request-brief.html">Open Brief / form paste</a>
      <a class="btn" href="/real-people-creative.html#batch">Real People downloads</a>
      <a class="btn" href="/template-test-board.html">Templates (layout examples)</a>
      <a class="btn" href="/exports/meta-upload-ready/">Upload-ready folder</a>
    </div>
    <div class="grid">${cards}</div>
    <details>
      <summary>Media Buyer / Ads Manager notes (optional)</summary>
      <p class="lede" style="margin-top:0.65rem">Campaign shell, UTMs, form QA, and build order live on the detailed pack — not required for graphics.</p>
      <a class="btn" href="/meta-launch-build-pack.html">Open Ads Manager build pack</a>
    </details>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'meta-launch-1.html'), html);
console.log('Wrote public/meta-launch-1.html');
