/**
 * Launch 2 — next graphics wave (Carmen + Jennifer 4:5, Jessica/Chelsea 9:16).
 * Keep this page simple: what to design next.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader, LAUNCH_SUBNAV } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { LAUNCHES } from './launch-sequences-data.mjs';
import { talentById } from './real-people-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const launch = LAUNCHES.find((l) => l.id === '2');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ITEMS = [
  {
    title: 'Meet Carmen · 4:5',
    talentId: 'carmen',
    ratio: '1080×1350',
    onImage: 'Meet Carmen · Medical Biller · Available to interview',
    source: '/assets/real-people/carmen/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
    note: 'New Studio Profile feed ad. Use Carmen Talent Pool title only.',
  },
  {
    title: 'Meet Jennifer · 4:5',
    talentId: 'jennifer',
    ratio: '1080×1350',
    onImage: 'Meet Jennifer · Patient Intake Coordinator · Available to interview',
    source: '/assets/real-people/jennifer/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
    note: 'New Studio Profile feed ad. Use Jennifer Talent Pool title only.',
  },
  {
    title: 'Jessica · 9:16 Stories resize',
    talentId: 'jessica',
    ratio: '1080×1920',
    onImage: 'Same Jessica Studio Profile → tall crop',
    source: '/assets/real-people/jessica/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-9x16.png',
    note: 'Resize only. Keep Meet Jessica + role + logo. Safe margins for Stories UI.',
  },
  {
    title: 'Chelsea · 9:16 Stories resize',
    talentId: 'chelsea',
    ratio: '1080×1920',
    onImage: 'Same Chelsea Studio Profile → tall crop',
    source: '/assets/real-people/chelsea/clean-master.jpg',
    ref: '/assets/real-people/chelsea/ad-treatment-e-9x16.png',
    note: 'Resize only. Same rules as Jessica Stories.',
  },
];

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ${BRAND.fonts.family}; color: ${BRAND.colors.ink}; background: #f4f7fa; }
  main { max-width: 860px; margin: 0 auto; padding: 1.25rem 1.1rem 3rem; }
  .lede { color: #475569; max-width: 42rem; margin: 0 0 1rem; }
  .status {
    display: inline-block; background: #e0f2fe; color: #0c4a6e; font-size: 0.75rem; font-weight: 800;
    padding: 0.25rem 0.6rem; border-radius: 999px; margin-bottom: 0.75rem;
  }
  .card {
    background: #fff; border: 1px solid #d7e2ea; border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 0.75rem;
  }
  .card h3 { margin: 0 0 0.35rem; font-size: 1.02rem; }
  .meta { font-size: 0.82rem; color: #64748b; margin: 0 0 0.45rem; }
  .note { margin: 0 0 0.55rem; font-size: 0.9rem; color: #334155; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .btn {
    display: inline-flex; padding: 0.4rem 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #fff; color: ${BRAND.colors.main03}; font: inherit; font-size: 0.8rem; font-weight: 700; text-decoration: none;
  }
  .btn.primary { background: ${BRAND.colors.main01}; border-color: ${BRAND.colors.main01}; color: #fff; }
  .top-actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0 0 1rem; }
`;

const cards = ITEMS.map((item, i) => {
  const t = talentById(item.talentId);
  return `<article class="card">
    <h3>${i + 1}. ${esc(item.title)}</h3>
    <p class="meta">${esc(t?.title || '')} · ${esc(item.ratio)}</p>
    <p class="note"><strong>On-image:</strong> ${esc(item.onImage)}</p>
    <p class="note">${esc(item.note)}</p>
    <div class="actions">
      <a class="btn primary" href="${esc(item.source)}" download>Source photo</a>
      <a class="btn" href="${esc(item.ref)}" target="_blank" rel="noopener">Layout ref</a>
      <a class="btn" href="${esc(BRAND.assets.logoColoredSvg)}" download>Logo SVG</a>
    </div>
  </article>`;
}).join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Launch 2 · MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'launch-2',
    pageTitle: launch.title,
    pageSubtitle: launch.forGraphics,
    subnav: LAUNCH_SUBNAV,
    activeSubHref: launch.href,
  })}
  <main>
    <span class="status">NEXT · after Launch 1</span>
    <p class="lede"><strong>Do this after Launch 1 ships:</strong> expand the Talent Pool set and Stories sizes. Same Studio Profile system — no Treatment C/D.</p>
    <div class="top-actions">
      <a class="btn primary" href="/graphic-request-brief.html#do-now">Brief Do Now</a>
      <a class="btn" href="/real-people-creative.html#concept">Studio Profile rules</a>
      <a class="btn" href="/meta-launch-1.html">Back to Launch 1</a>
    </div>
    ${cards}
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'meta-launch-2.html'), html);
console.log('Wrote public/meta-launch-2.html');
