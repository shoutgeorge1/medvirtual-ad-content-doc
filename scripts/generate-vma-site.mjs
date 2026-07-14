/**
 * MedVirtual Virtual Medical Admin creative-handoff site generator (simplified).
 *
 * Writes 8 primary pages (Dashboard, Approved Creative, New Ad Ideas, Aspect
 * Ratios, Competitor Wall, Animated Video, Prompts & Copy, Production Handoff)
 * plus thin meta-refresh redirects for every retired page.
 *
 * Hard rules:
 *   - Never generates or edits image files. Text / HTML / CSS only.
 *   - Only uses the existing APPROVED_MASTERS masterImage paths.
 *   - Missing formats always render literal "AWAITING DESIGN" placeholders —
 *     never a fake / stretched preview.
 *   - No pink anywhere in site chrome or copy.
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
  VIDEO_SCENES_15S,
  REMOTION_COMPONENTS,
  REMOTION_COMPOSITIONS,
  REMOTION_PLAYBOOK,
  CAPCUT_TEMPLATES,
  CHATGPT_PROMPTS,
  VIDEO_PROMPTS,
  COPY_EN,
  COPY_ES,
  CLAIMS,
  IDEA_CATEGORIES,
  CONCEPT_BATCH_STRUCTURE,
  CHATGPT_WORKFLOW,
} from './vma-site-data.mjs';
import { IDEA_SPARK_CONCEPTS, IDEA_SPARK_NOTE } from './idea-concepts-data.mjs';
import {
  APPROVED_MASTERS,
  COLOR_DIRECTION,
  FORMAT_SPECS,
  VIDEO_OUTPUTS_PER_MASTER,
  VIDEO_STORYBOARD,
  DASHBOARD_CLAIMS,
  HANDOFF_QA,
  CURRENT_META_FORM,
  PINK_REFERENCE_COMPETITOR_IDS,
  HISTORY_NOTES,
  presentFormatsSummary,
  formatMatrixCells,
  GRAPHICS_BUILD_ORDER,
  GRAPHICS_DO,
  GRAPHICS_DONT,
  WHAT_WE_NEED_NOW,
  MASTER_NOTE,
  ASPECT_RATIO_HANDOFF_CHECKLIST,
  FILE_NAMING,
} from './vma-approved-masters.mjs';
import {
  COMPETITOR_ADS,
  COMPETITOR_META,
  WALL_LIVE_SOURCE_IDS,
  WALL_STATIC_CREATIVES,
  BLOCKED_COMPETITOR_IMAGES,
  adLibraryUrl,
} from './competitor-ads-data.mjs';
import { loadLiveSnapshots } from './scrape-ad-library-helpers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function imageExists(webPath) {
  if (!webPath || BLOCKED_COMPETITOR_IMAGES.has(webPath)) return false;
  const disk = path.join(PUBLIC, webPath.replace(/^\//, ''));
  return fs.existsSync(disk);
}

/**
 * Build the Competitor Wall from live snapshots + verified static creatives.
 * Only cards with real image files are included — more is better.
 */
function collectCompetitorWallCards() {
  const live = loadLiveSnapshots();
  const byId = Object.fromEntries(COMPETITOR_ADS.map((a) => [a.id, a]));
  const seenImages = new Set();
  const cards = [];

  function pushCard(card) {
    if (!card?.image || !imageExists(card.image) || seenImages.has(card.image)) return;
    seenImages.add(card.image);
    cards.push(card);
  }

  for (const sourceId of WALL_LIVE_SOURCE_IDS) {
    const seed = byId[sourceId] || { id: sourceId, name: sourceId, adLibraryQuery: sourceId };
    const ads = live.sources?.[sourceId]?.ads || [];
    for (const ad of ads) {
      const name = ad.advertiser || seed.name || sourceId;
      const pink =
        PINK_REFERENCE_COMPETITOR_IDS.has(sourceId) ||
        /hello\s*rache|my medical va/i.test(name);
      pushCard({
        id: `${sourceId}-${ad.libraryId || ad.index || ad.image}`,
        name,
        category: seed.category || 'virtual-staffing',
        whyWatch: ad.headline || ad.primaryText || seed.whyWatch || 'Live Meta Ad Library creative',
        offer: ad.headline || ad.description || seed.fingerprint?.hookStyle || '—',
        visual: seed.fingerprint?.visual || 'Live Meta creative',
        steal: seed.steal || 'Study hierarchy and offer clarity.',
        reject: seed.reject || 'Do not copy layout, color system, badges, or talent.',
        adLibraryQuery: seed.adLibraryQuery || name,
        libraryId: ad.libraryId || '',
        image: ad.image,
        pink,
        source: 'live',
      });
    }
  }

  for (const creative of WALL_STATIC_CREATIVES) {
    const pink = PINK_REFERENCE_COMPETITOR_IDS.has(creative.id) || /hello\s*rache/i.test(creative.name);
    pushCard({
      id: creative.id,
      name: creative.name,
      category: creative.category,
      whyWatch: creative.whyWatch,
      offer: creative.fingerprint?.hookStyle || '—',
      visual: creative.fingerprint?.visual || '—',
      steal: creative.steal,
      reject: creative.reject,
      adLibraryQuery: creative.adLibraryQuery,
      libraryId: '',
      image: creative.image,
      pink,
      source: 'static',
    });
  }

  // Medical / VA staffing first, then adjacent software
  const rank = (c) => {
    if (c.category === 'virtual-staffing') return 0;
    if (/hello\s*rache|medical va|mountain mover|edge|snappy|portiva|cure|psyphy|tactical|assist/i.test(c.name))
      return 0;
    if (c.category === 'practice-saas') return 2;
    return 1;
  };
  cards.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));

  return {
    cards,
    updatedAt: live.updatedAt || null,
  };
}

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

// ─── Design system (calm site chrome — white / navy / teal / light blue) ─────

const PAGE_CSS = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: #0B1F3A;
    background: #F7FAFC;
    line-height: 1.5;
  }
  a { color: #077999; }
  a:hover { color: #00B2E2; }
  main { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1.15rem 4.5rem; }
  h1, h2, h3 { color: #0B1F3A; letter-spacing: -0.02em; }
  h1 { font-size: clamp(1.55rem, 3.5vw, 2.1rem); margin: 0 0 0.35rem; }
  h2 { font-size: 1.15rem; margin: 0 0 0.5rem; }
  h3 { font-size: 1rem; margin: 0 0 0.35rem; }
  .banner {
    margin: 0 0 1.35rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    font-size: 0.9rem;
    color: #0B1F3A;
  }
  .banner strong { color: #077999; }
  .banner .sub { display: block; color: #4A6275; margin-top: 0.25rem; font-weight: 400; }
  .hero { margin-bottom: 1.5rem; }
  .hero p, .lede { margin: 0; max-width: 46rem; color: #4A6275; }
  section { margin-top: 2rem; }
  section > h2 { padding-bottom: 0.35rem; border-bottom: 1px solid #E2EBF1; }
  .note {
    margin: 0.75rem 0 1rem;
    padding: 0.7rem 0.85rem;
    border-radius: 8px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    font-size: 0.86rem;
  }
  .callout-rule {
    margin: 1rem 0 1.5rem;
    padding: 0.9rem 1.1rem;
    border-radius: 10px;
    background: #FDEDED;
    border: 2px solid #B42318;
    color: #7F1D1D;
    font-weight: 800;
    font-size: 0.92rem;
    letter-spacing: 0.01em;
  }
  .pill {
    display: inline-block;
    padding: 0.14rem 0.55rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    border: 1px solid transparent;
    vertical-align: middle;
  }
  .s-approved, .s-approved-creative-baseline, .s-primary-feed-format {
    background: #E6F7F4; color: #0F766E; border-color: #99D5CD;
  }
  .s-awaiting-design {
    background: #FFF8E8; color: #A16207; border-color: #F0D78C;
  }
  .s-image-needed, .s-pending {
    background: #EEF2F6; color: #475569; border-color: #CBD5E1;
  }
  .s-rejected, .s-do-not-use {
    background: #FEECEC; color: #B91C1C; border-color: #FECACA;
  }
  .masters-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  .master-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .master-card__media {
    background: #E8EEF2;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .master-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .master-card--lg .master-card__media { min-height: 220px; }
  .master-card--md .master-card__media { min-height: 160px; }
  .master-card__body { padding: 0.85rem 0.95rem 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
  .master-card__meta { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #077999; }
  .master-card h3 { margin: 0; font-size: 1.02rem; }
  .master-card p { margin: 0; font-size: 0.82rem; color: #4A6275; }
  .master-card .dl {
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .format-row {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    margin: 0.75rem 0 1.5rem;
  }
  .format-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    overflow: hidden;
    font-size: 0.8rem;
  }
  .format-card__preview {
    background: #EEF2F6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 110px;
    padding: 0.4rem;
  }
  .format-card__preview img {
    max-width: 100%;
    max-height: 160px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }
  .format-card__preview[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .format-card__preview[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .format-card__preview[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-height: 200px; }
  .format-card__preview[data-ratio="1\\.91x1"] { aspect-ratio: 1.91 / 1; }
  .format-placeholder {
    text-align: center;
    padding: 0.6rem;
    color: #64748B;
    font-size: 0.72rem;
    line-height: 1.35;
  }
  .format-placeholder strong { display: block; color: #A16207; margin-bottom: 0.25rem; font-size: 0.76rem; letter-spacing: 0.03em; }
  .format-card__body { padding: 0.55rem 0.65rem 0.7rem; }
  .format-card__body b { display: block; color: #0B1F3A; }
  .format-explain {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-left: 4px solid #077999;
    border-radius: 12px;
    padding: 1.1rem 1.3rem;
    margin: 1rem 0;
  }
  .format-explain h3 { margin-top: 0.3rem; font-size: 1.15rem; }
  .size-strip {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: center;
    gap: 1.1rem 1.4rem;
    padding: 1.25rem 1rem 1.4rem;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    margin: 0.85rem 0 1.25rem;
  }
  .size-strip__item { text-align: center; max-width: 9.5rem; }
  .size-strip__frame {
    margin: 0 auto 0.55rem;
    border: 2px solid #077999;
    border-radius: 8px;
    background: linear-gradient(160deg, #EEF6FA 0%, #D6E4EC 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.65);
  }
  .size-strip__item[data-id="1x1"] .size-strip__frame { width: 84px; height: 84px; }
  .size-strip__item[data-id="4x5"] .size-strip__frame { width: 84px; height: 105px; }
  .size-strip__item[data-id="9x16"] .size-strip__frame { width: 68px; height: 120px; }
  .size-strip__item[data-id="1.91x1"] .size-strip__frame { width: 120px; height: 63px; }
  .size-strip__item strong { display: block; font-size: 0.9rem; color: #0B1F3A; }
  .size-strip__item span { display: block; font-size: 0.72rem; color: #4A6275; margin-top: 0.15rem; }
  .size-strip__item .chip { margin-top: 0.35rem; }
  .example-hero {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: minmax(220px, 340px) 1fr;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.15rem;
    margin: 0.85rem 0 1.5rem;
  }
  .example-hero__media {
    background: #E8EEF2;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
  }
  .example-hero__media img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .example-hero__points { display: grid; gap: 0.55rem; }
  .example-hero__points .soft-card { padding: 0.7rem 0.85rem; }
  .example-hero__points h3 { margin: 0 0 0.2rem; font-size: 0.95rem; }
  .ratio-guide {
    display: grid;
    gap: 1.15rem;
    grid-template-columns: minmax(150px, 210px) 1fr;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    margin: 0.9rem 0;
  }
  .ratio-guide__visual { display: flex; flex-direction: column; align-items: center; gap: 0.55rem; }
  .wire {
    position: relative;
    width: 100%;
    max-width: 180px;
    background: #F0F5F8;
    border: 2px solid #077999;
    border-radius: 10px;
    overflow: hidden;
  }
  .wire[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .wire[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .wire[data-ratio="9x16"] { aspect-ratio: 9 / 16; max-width: 140px; }
  .wire[data-ratio="1.91x1"] { aspect-ratio: 1.91 / 1; max-width: 220px; }
  .wire-zone {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.15rem;
    border-radius: 5px;
    font-size: 0.62rem;
    font-weight: 700;
    line-height: 1.15;
    color: #0B1F3A;
    background: rgba(0, 178, 226, 0.22);
    border: 1px dashed #077999;
  }
  .wire-zone[data-id="talent"] { background: rgba(11, 31, 58, 0.12); border-color: #0B1F3A; }
  .wire-zone[data-id="badge"] { background: rgba(184, 240, 0, 0.28); border-color: #077999; color: #0B1F3A; }
  .wire-zone[data-id="safe-top"],
  .wire-zone[data-id="safe-bottom"] {
    background: repeating-linear-gradient(-45deg, #FEECEC, #FEECEC 4px, #fff 4px, #fff 8px);
    border-color: #B42318;
    color: #7F1D1D;
    font-size: 0.58rem;
  }
  .ratio-guide__copy h3 { margin: 0 0 0.2rem; }
  .ratio-guide__copy .dims { font-size: 0.78rem; color: #4A6275; margin: 0 0 0.55rem; }
  .ratio-guide__thumb {
    width: 100%;
    max-width: 180px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #D6E4EC;
    background: #EEF2F6;
  }
  .ratio-guide__thumb img { width: 100%; height: auto; display: block; }
  .await-board {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .await-board .soft-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: contain;
    background: #EEF2F6;
    border-radius: 8px;
    display: block;
    margin-bottom: 0.55rem;
  }
  .spark-grid {
    display: grid;
    gap: 1.1rem;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    margin-top: 0.85rem;
  }
  .spark-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .spark-card__media {
    background: #0B1F3A;
    aspect-ratio: 1 / 1;
  }
  .spark-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .spark-card__body { padding: 0.9rem 1rem 1.05rem; display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
  .spark-card__body h3 { margin: 0; font-size: 1.02rem; }
  .spark-card__body p { margin: 0; font-size: 0.82rem; color: #4A6275; }
  .spark-card__spark {
    margin-top: auto;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    font-size: 0.8rem;
    font-weight: 650;
  }
  @media (max-width: 720px) {
    .example-hero, .ratio-guide { grid-template-columns: 1fr; }
    .ratio-guide__visual { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  }
  .approved-detail {
    display: grid;
    grid-template-columns: minmax(260px, 380px) 1fr;
    gap: 1.5rem;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 14px;
    padding: 1.25rem;
    margin-top: 1.25rem;
  }
  .approved-detail__media {
    background: #E8EEF2;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
  }
  .approved-detail__media img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .approved-detail__grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .quick-links {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  .quick-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 3.6rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #077999;
    color: #fff !important;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.92rem;
  }
  .quick-links a:hover { background: #0D546B; }
  .queue-grid, .claim-grid, .comp-grid, .copy-grid, .prompt-grid, .cat-grid {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  .soft-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.9rem 1rem;
  }
  .soft-card p { margin: 0.25rem 0; font-size: 0.86rem; color: #4A6275; }
  .checklist { list-style: none; margin: 0.5rem 0 0; padding: 0; }
  .checklist li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    padding: 0.45rem 0;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.9rem;
  }
  .checklist li:last-child { border-bottom: 0; }
  .checklist input { margin-top: 0.2rem; }
  ul.clean { margin: 0.4rem 0 0; padding-left: 1.15rem; color: #4A6275; font-size: 0.88rem; }
  ul.clean li { margin: 0.2rem 0; }
  .chip {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.12rem 0.45rem;
    border-radius: 6px;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    color: #0D546B;
    margin: 0.1rem 0.15rem 0 0;
  }
  .comp-card {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .comp-card.incomplete { opacity: 0.7; border-style: dashed; }
  .comp-card__media {
    background: #EEF2F6;
    aspect-ratio: 4 / 5;
    max-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .comp-card__media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .comp-card__body { padding: 0.85rem 0.95rem 1rem; font-size: 0.84rem; }
  .comp-card__body h3 { margin: 0 0 0.25rem; font-size: 0.95rem; }
  .comp-card__body .why { font-weight: 700; color: #0B1F3A; margin: 0.2rem 0; }
  .comp-card__body .mini { margin: 0.35rem 0 0; color: #4A6275; font-size: 0.8rem; }
  .comp-card__body .mini b { color: #0B1F3A; }
  .pink-ref {
    display: inline-block;
    margin-bottom: 0.35rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D546B;
    background: #EEF6FA;
    border: 1px solid #C5DCE8;
    border-radius: 6px;
    padding: 0.2rem 0.45rem;
  }
  .thumb-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.75rem 0; }
  .thumb-row a, .thumb-row span {
    display: block;
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #D6E4EC;
    background: #EEF2F6;
  }
  .thumb-row img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .job-box {
    background: #fff;
    border: 2px solid #077999;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }
  .job-box h2 { margin-top: 0; }
  .job-steps { counter-reset: step; list-style: none; margin: 0.75rem 0 0; padding: 0; }
  .job-steps li {
    counter-increment: step;
    position: relative;
    padding: 0.55rem 0.55rem 0.55rem 2.4rem;
    border-bottom: 1px solid #E8EEF2;
    font-size: 0.92rem;
  }
  .job-steps li::before {
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 999px;
    background: #077999;
    color: #fff;
    font-weight: 800;
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .two-cols { display: grid; gap: 0.9rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .do-list li::marker { color: #077999; }
  .dont-list li::marker { color: #B42318; }
  .matrix { width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 0.5rem; }
  .matrix th, .matrix td { border: 1px solid #D6E4EC; padding: 0.45rem 0.5rem; text-align: center; background: #fff; }
  .matrix th { background: #F0F5F8; color: #4A6275; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .matrix td.rowhead { text-align: left; font-weight: 700; color: #0B1F3A; }
  .storyboard {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    margin: 0.75rem 0;
  }
  .storyboard .beat {
    background: #fff;
    border: 1px solid #D6E4EC;
    border-top: 3px solid #077999;
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    font-size: 0.8rem;
  }
  .storyboard .beat b { display: block; color: #0B1F3A; font-size: 0.78rem; }
  .storyboard .beat span { color: #4A6275; font-size: 0.72rem; }
  .tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.85rem 0 0.5rem; }
  .tabs label, .tabs button {
    font: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    color: #0B1F3A;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
  }
  .tabs label:hover, .tabs button:hover, .tabs button.active, .tabs input:checked + label {
    background: #077999;
    color: #fff;
    border-color: #077999;
  }
  .tab-panels .tab-panel { display: none; }
  .tab-panels .tab-panel.active { display: block; }
  main details.block, .block details.block {
    margin: 0.65rem 0;
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 10px;
    padding: 0.65rem 0.9rem;
  }
  main details.block > summary {
    cursor: pointer;
    font-weight: 700;
    color: #0B1F3A;
    list-style: none;
  }
  main details.block > summary::-webkit-details-marker { display: none; }
  main details.block[open] > summary { margin-bottom: 0.55rem; }
  .copytext {
    display: block;
    background: #F0F5F8;
    border: 1px solid #D6E4EC;
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.82rem;
    color: #0B1F3A;
    white-space: pre-wrap;
    margin-top: 0.35rem;
  }
  .copy-btn {
    font: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    background: #077999;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.28rem 0.6rem;
    margin-top: 0.4rem;
  }
  .copy-btn:hover { background: #0D546B; }
  .copy-btn.copied { background: #0F766E; }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.5rem 0; }
  .swatch-chip {
    font-size: 0.78rem;
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #D6E4EC;
  }
  .concept-form {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    background: #fff;
    border: 1px solid #D6E4EC;
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
  }
  .concept-form label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #0D546B;
  }
  .concept-form input,
  .concept-form select,
  .concept-form textarea {
    font: inherit;
    font-size: 0.85rem;
    padding: 0.4rem 0.55rem;
    border: 1px solid #D6E4EC;
    border-radius: 7px;
    background: #F7FAFC;
    color: #0B1F3A;
  }
  .concept-form textarea { resize: vertical; min-height: 3rem; }
  .concept-form .full { grid-column: 1 / -1; }
  .concept-form button[type="submit"] {
    grid-column: 1 / -1;
    justify-self: start;
    font: inherit;
    font-weight: 800;
    font-size: 0.88rem;
    padding: 0.6rem 1.3rem;
    border: none;
    border-radius: 999px;
    background: #077999;
    color: #fff;
    cursor: pointer;
  }
  .concept-form button[type="submit"]:hover { background: #0D546B; }
  .foot {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #D6E4EC;
    color: #64748B;
    font-size: 0.76rem;
  }
  @media (max-width: 640px) {
    main { padding: 1.1rem 0.85rem 3.5rem; }
    .masters-grid { grid-template-columns: 1fr 1fr; }
    .master-card--lg .master-card__media { min-height: 140px; }
    .approved-detail { grid-template-columns: 1fr; }
  }
`;

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
  document.querySelectorAll('[data-tabs]').forEach(function(root){
    var buttons = root.querySelectorAll('[data-tab]');
    var panels = root.querySelectorAll('.tab-panel');
    function activate(id){
      buttons.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab') === id); });
      panels.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-panel') === id); });
    }
    buttons.forEach(function(b){
      b.addEventListener('click', function(){ activate(b.getAttribute('data-tab')); });
    });
    var hash = (location.hash || '').replace(/^#/, '');
    if(hash && root.querySelector('[data-panel="'+hash+'"]')) activate(hash);
    else {
      var first = buttons[0];
      if(first) activate(first.getAttribute('data-tab'));
    }
    window.addEventListener('hashchange', function(){
      var h = (location.hash || '').replace(/^#/, '');
      if(h && root.querySelector('[data-panel="'+h+'"]')) activate(h);
    });
  });
  document.querySelectorAll('[data-persist]').forEach(function(el){
    var k = 'vma-'+el.getAttribute('data-persist');
    try {
      var saved = localStorage.getItem(k);
      if(saved !== null){
        if(el.type === 'checkbox') el.checked = saved === '1';
        else el.value = saved;
      }
    } catch(e){}
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function(){
      try {
        localStorage.setItem(k, el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value);
      } catch(e){}
    });
  });
})();
</script>`;

// ─── Shared helpers ──────────────────────────────────────────────────────────

function statusBadge(status) {
  const raw = String(status ?? '');
  const cls =
    's-' +
    raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return `<span class="pill ${cls}">${esc(raw)}</span>`;
}

function copyBlock(text) {
  return `<span class="copytext">${esc(text)}</span><button type="button" class="copy-btn" data-copy="${esc(text)}">Copy</button>`;
}

function masterCard(master, { size = 'lg' } = {}) {
  const formats = presentFormatsSummary(master);
  const serviceChips = master.services.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
  return `<article class="master-card master-card--${esc(size)}">
  <div class="master-card__media">
    <img src="${esc(master.masterImage)}" alt="${esc(master.name)} approved master 1:1" width="1080" height="1080" loading="lazy" />
  </div>
  <div class="master-card__body">
    <div class="master-card__meta">VMA-${esc(master.number)} · ${esc(master.name)}</div>
    <h3>${esc(master.headline)}</h3>
    <p>${esc(master.angle)}</p>
    <p><b>Color family:</b> ${esc(master.colorFamily)}</p>
    <p>${serviceChips}</p>
    <p><b>Offer / badge:</b> ${esc(master.offerOrBadge)}</p>
    <p><b>Formats available:</b> ${esc(formats.availableLabel)}</p>
    <p>${statusBadge(master.status)}</p>
    <a class="dl" href="${esc(master.masterImage)}" download>Download 1:1 master</a>
  </div>
</article>`;
}

function mastersGrid(size = 'lg') {
  return `<div class="masters-grid">${APPROVED_MASTERS.map((m) => masterCard(m, { size })).join('')}</div>`;
}

function formatRow(master) {
  const cards = master.formats
    .map((f) => {
      if (f.path && f.status === 'Approved') {
        return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <img src="${esc(f.path)}" alt="${esc(master.name)} ${esc(f.label)}" loading="lazy" />
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge('Approved')}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.placement)}</div>
  </div>
</div>`;
      }
      return `<div class="format-card">
  <div class="format-card__preview" data-ratio="${esc(f.formatId)}">
    <div class="format-placeholder">
      <strong>AWAITING DESIGN</strong>
      ${esc(f.expectedFilename)}<br />${esc(f.dims)}
    </div>
  </div>
  <div class="format-card__body">
    <b>${esc(f.label)} · ${esc(f.dims)}</b>
    <div>${statusBadge('Awaiting Design')}</div>
    <div style="margin-top:0.25rem;color:#4A6275;font-size:0.72rem">${esc(f.layoutNote)}</div>
  </div>
</div>`;
    })
    .join('');
  return `<div class="format-row">${cards}</div>`;
}

function page({ activeId, title, pageTitle, pageSubtitle, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} · MedVirtual</title>
  <style>${HEADER_CSS}${PAGE_CSS}</style>
</head>
<body>
  ${renderDocHeader({ activeId, pageTitle, pageSubtitle })}
  <main>
    <div class="banner"><strong>${esc(VMA_META.banner)}</strong><span class="sub">${esc(VMA_META.bannerSub)}</span></div>
    ${body}
    <p class="foot">MedVirtual Ad Production · No pink · Reviewed ${esc(VMA_META.reviewDateDisplay)}.</p>
  </main>
  ${PAGE_SCRIPT}
</body>
</html>`;
}

function renderRedirect(to) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${esc(to)}" />
  <link rel="canonical" href="${esc(to)}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Moved to <a href="${esc(to)}">${esc(to)}</a>.</p>
</body>
</html>`;
}

// ─── 1. Dashboard (studio.html) ──────────────────────────────────────────────

function renderStudio() {
  const needChecklist = WHAT_WE_NEED_NOW.map(
    (item, i) => `<li><input type="checkbox" data-persist="need-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const formatCards = FORMAT_SPECS.map(
    (f) => `<div class="soft-card">
  <h3>${esc(f.label)} · ${esc(f.dims)}</h3>
  <p>${esc(f.placement)}</p>
  ${f.priorityLabel ? `<p>${statusBadge(f.priorityLabel)}</p>` : ''}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Dashboard</h1>
      <p>The approved Virtual Medical Admin creative baseline, what the team needs to produce next, and quick links to every board.</p>
    </div>

    <section id="approved-baseline">
      <h2>Approved Creative Baseline</h2>
      <p class="lede">${esc(MASTER_NOTE)}</p>
      ${mastersGrid()}
    </section>

    <section id="what-we-need">
      <h2>What the Team Needs to Produce</h2>
      <ul class="checklist">${needChecklist}</ul>
    </section>

    <section id="required-formats">
      <h2>Required Formats</h2>
      <div class="queue-grid">${formatCards}</div>
      <div class="callout-rule">DO NOT STRETCH OR SIMPLY CROP THE SQUARE DESIGN. Each format must be rebuilt for its canvas.</div>
    </section>

    <section id="quick-links">
      <h2>Quick Links</h2>
      <div class="quick-links">
        <a href="/vma-approved.html">View Approved Ads</a>
        <a href="/ideas.html">Generate New Concepts</a>
        <a href="/vma-static.html">Review Aspect Ratios</a>
        <a href="/competitors.html">Review Competitors</a>
        <a href="/vma-chatgpt.html">Copy ChatGPT Prompts</a>
        <a href="/vma-handoff.html">Open Production Handoff</a>
      </div>
    </section>`;

  return page({
    activeId: 'studio',
    title: 'Dashboard',
    pageTitle: 'Dashboard',
    pageSubtitle: 'Approved ads, checklist, formats, quick links.',
    body,
  });
}

// ─── 2. Approved Creative (vma-approved.html) ────────────────────────────────

function approvedDetailBlock(master) {
  const why = master.whyItWorks.map((x) => `<li>${esc(x)}</li>`).join('');
  const may = master.whatMayChange.map((x) => `<li>${esc(x)}</li>`).join('');
  const stay = master.whatShouldStay.map((x) => `<li>${esc(x)}</li>`).join('');
  const notCopy = master.whatNotCopy.map((x) => `<li>${esc(x)}</li>`).join('');

  return `<article class="approved-detail" id="master-${esc(master.id)}">
  <div class="approved-detail__media">
    <img src="${esc(master.masterImage)}" alt="${esc(master.name)} approved master 1:1" width="1080" height="1080" loading="lazy" />
  </div>
  <div>
    <div class="master-card__meta">VMA-${esc(master.number)} · ${esc(master.name)}</div>
    <h2>${esc(master.headline)}</h2>
    <p class="lede">${esc(master.angle)}</p>
    <p style="margin-top:0.35rem">${statusBadge(master.status)}</p>
    <div class="approved-detail__grid">
      <div>
        <h3>Why it works</h3>
        <ul class="clean">${why}</ul>
      </div>
      <div>
        <h3>What may change</h3>
        <ul class="clean">${may}</ul>
      </div>
      <div>
        <h3>What should stay</h3>
        <ul class="clean">${stay}</ul>
      </div>
      <div>
        <h3>What should not be copied</h3>
        <ul class="clean">${notCopy}</ul>
      </div>
    </div>
    <p style="margin-top:0.75rem"><a class="dl" href="${esc(master.masterImage)}" download>Download 1:1 master</a></p>
  </div>
</article>`;
}

function renderApproved() {
  const grounding = COLOR_DIRECTION.grounding.map((g) => `<span class="swatch-chip">${esc(g)}</span>`).join('');
  const accents = COLOR_DIRECTION.accents.map((a) => `<span class="swatch-chip">${esc(a)}</span>`).join('');
  const forbidden = COLOR_DIRECTION.forbidden.map((f) => `<span class="swatch-chip">${esc(f)}</span>`).join('');
  const historyNotes = HISTORY_NOTES.map(
    (n) => `<div class="soft-card"><div class="master-card__meta">${esc(n.date)}</div><h3>${esc(n.title)}</h3><p>${esc(n.change)}</p></div>`,
  ).join('');

  const detailBlocks = APPROVED_MASTERS.map((m) => approvedDetailBlock(m)).join('');

  const body = `
    <div class="hero">
      <h1>Approved Creative Baseline</h1>
      <p>${esc(MASTER_NOTE)}</p>
    </div>

    <section id="masters">
      ${mastersGrid()}
    </section>

    <section id="analysis">
      <h2>Master-by-Master Analysis</h2>
      ${detailBlocks}
    </section>

    <details class="block">
      <summary>Color direction (optional reference)</summary>
      <p class="lede">${esc(COLOR_DIRECTION.summary)}</p>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">OK grounding</p>
      <div class="swatch-row">${grounding}</div>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">OK accents</p>
      <div class="swatch-row">${accents}</div>
      <p style="margin:0.75rem 0 0.25rem;font-size:0.8rem;font-weight:700;color:#4A6275">Never</p>
      <div class="swatch-row">${forbidden}</div>
      <ul class="clean">${COLOR_DIRECTION.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </details>

    <details class="block">
      <summary>History notes (optional reference)</summary>
      <div class="queue-grid">${historyNotes}</div>
    </details>`;

  return page({
    activeId: 'vma-approved',
    title: 'Approved Creative',
    pageTitle: 'Approved Creative',
    pageSubtitle: 'Four approved masters — image-first analysis.',
    body,
  });
}

// ─── 3. New Ad Ideas (ideas.html) ────────────────────────────────────────────

function ideaCategoryCard(cat) {
  const examples = cat.examples.map((e) => `<span class="chip">${esc(e)}</span>`).join('');
  return `<div class="soft-card">
  <h3>${esc(cat.title)}</h3>
  <div>${examples}</div>
</div>`;
}

const CONCEPT_BUILDER_SCRIPT = `
<script>
(function(){
  var form = document.getElementById('concept-builder-form');
  if(!form) return;
  var outIds = { brief: 'output-brief', prompt: 'output-prompt', designer: 'output-designer', ratios: 'output-ratios' };
  var copyIds = { brief: 'copy-brief', prompt: 'copy-prompt', designer: 'copy-designer', ratios: 'copy-ratios' };
  function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function setOut(key, text){
    var out = document.getElementById(outIds[key]);
    var btn = document.getElementById(copyIds[key]);
    if(out) out.textContent = text;
    if(btn) btn.setAttribute('data-copy', text);
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var number = val('c-number') || 'VMA-NEW';
    var role = val('c-role') || 'Virtual Medical Admin';
    var audience = val('c-audience');
    var headline = val('c-headline') || 'HIRE A VIRTUAL MEDICAL ADMIN';
    var supporting = val('c-supporting');
    var benefits = [val('c-benefit1'), val('c-benefit2'), val('c-benefit3'), val('c-benefit4')].filter(Boolean);
    var offer = val('c-offer');
    var cta = val('c-cta') || 'Learn More';
    var talent = val('c-talent');
    var scrub = val('c-scrub');
    var bg = val('c-bg');
    var accent = val('c-accent');
    var language = val('c-language') || 'English';
    var format = val('c-format') || '1:1, 4:5, 9:16, 1.91:1';
    var animation = val('c-animation') || 'Static first';
    var claim = val('c-claim') || 'No new claims';

    var brief = [
      'Concept: ' + number,
      'Role: ' + role,
      'Audience: ' + (audience || '—'),
      'Headline: ' + headline,
      'Supporting line: ' + (supporting || '—'),
      'Benefits: ' + (benefits.join(' · ') || '—'),
      'Offer: ' + (offer || '—'),
      'CTA: ' + cta,
      'Talent direction: ' + (talent || '—'),
      'Colors: scrub ' + (scrub || '—') + ' · background ' + (bg || '—') + ' · accent ' + (accent || '—'),
      'Language: ' + language,
      'Format(s): ' + format,
      'Animation potential: ' + animation,
      'Claim status: ' + claim,
      'Rules: No pink. MedVirtual only (never MedVirtual.ai). Dedicated full-time staff — not a call center.'
    ].join('\\n');

    var prompt = 'Full-image Meta ad plate for a healthcare staffing ad. Bold, high-contrast, mobile-first direct response. Color story: background ' + (bg || 'approved family') + ', accent ' + (accent || 'approved accent') + '. Subject: a credible, warm virtual medical administrator, ' + (scrub || 'approved color') + ' scrub top, framed to one side, clean studio lighting, high contrast. Leave clean negative space for the headline "' + headline + '" and the benefits ' + (benefits.join(', ') || 'TBD') + ' to be added by a designer. NO pink, magenta, rose, or fuchsia anywhere. No baked-in headline text, no misspelled text, no watermarks, no fake logos or compliance badges, no call-center headset, no physician white coat, no patient data.';

    var designer = [
      'Build in: ' + format,
      'Rebuild the layout per canvas — do not stretch or simply crop the square.',
      'Keep the headline large and mobile-readable.',
      'Keep 3–4 benefits scannable.',
      'Offer / claim: ' + (claim.toLowerCase().indexOf('approved') === 0 ? (offer || 'per brief') : 'Do not publish until this claim is approved'),
      'Animation potential: ' + animation,
      'File naming: MV_VMA_[NUMBER]_[NAME]_[RATIO].png'
    ].join('\\n');

    var ratios = 'Suggested aspect ratios: 1:1 (1080×1080) · 4:5 (1080×1350, primary feed) · 9:16 (1080×1920, Stories/Reels) · 1.91:1 (1200×628, link ads / form covers).';

    setOut('brief', brief);
    setOut('prompt', prompt);
    setOut('designer', designer);
    setOut('ratios', ratios);
  });
})();
</script>`;

function sparkCard(concept) {
  return `<article class="spark-card" id="${esc(concept.id)}">
  <div class="spark-card__media">
    <img src="${esc(concept.image)}" alt="${esc(concept.title)} spark concept" width="1080" height="1080" loading="lazy" />
  </div>
  <div class="spark-card__body">
    <div class="master-card__meta">Spark ${esc(concept.number)} · ${esc(concept.category)}</div>
    <h3>${esc(concept.title)}</h3>
    <p><b>${esc(concept.headline)}</b></p>
    <p>${esc(concept.angle)}</p>
    <p><span class="chip">${esc(concept.colorStory)}</span></p>
    <div class="spark-card__spark">${esc(concept.spark)}</div>
  </div>
</article>`;
}

function renderIdeas() {
  const sparks = IDEA_SPARK_CONCEPTS.map((c) => sparkCard(c)).join('');
  const categories = IDEA_CATEGORIES.map((c) => ideaCategoryCard(c)).join('');
  const batchStructure = CONCEPT_BATCH_STRUCTURE.map(
    (b) => `<div class="soft-card"><h3>${esc(b.count)} — ${esc(b.label)}</h3></div>`,
  ).join('');
  const totalConcepts = CONCEPT_BATCH_STRUCTURE.reduce((sum, b) => sum + b.count, 0);

  const body = `
    <div class="hero">
      <h1>New Ad Ideas</h1>
      <p><b>Standard creative request: 15–20 concepts.</b> Scroll the spark gallery first — steal energy, invent original MedVirtual layouts. AI plates are for thinking and testing, not automatic launch.</p>
    </div>

    <section id="spark-gallery">
      <h2>Visual spark gallery</h2>
      <p class="note">${esc(IDEA_SPARK_NOTE)}</p>
      <p class="note"><a class="dl" href="/ai-asset-foundry.html">Open AI Asset Foundry</a> — generate raw faces, people, icons, and callouts. Click to enlarge. Download saves the file and creates four more like it.</p>
      <div class="spark-grid">${sparks}</div>
    </section>

    <section id="categories">
      <h2>Idea Categories — fill a 15–20 batch</h2>
      <div class="cat-grid">${categories}</div>
    </section>

    <section id="batch">
      <h2>Build a 15–20 Concept Batch</h2>
      <p class="lede">Recommended mix (totals ${esc(totalConcepts)} concepts):</p>
      <div class="queue-grid">${batchStructure}</div>
      <h3 style="margin-top:1.25rem">Copy-paste batch request</h3>
      ${copyBlock(VMA_META.conceptBatchRequest)}
    </section>

    <details class="block" id="concept-builder">
      <summary>Concept Builder — turn a spark into a brief + prompt</summary>
      <form id="concept-builder-form" class="concept-form">
        <label>Concept number<input type="text" id="c-number" placeholder="VMA-25" /></label>
        <label>Role<input type="text" id="c-role" placeholder="Virtual Medical Admin" /></label>
        <label>Audience<input type="text" id="c-audience" placeholder="Dental practices" /></label>
        <label class="full">Headline<input type="text" id="c-headline" placeholder="HIRE A VIRTUAL MEDICAL ADMIN" /></label>
        <label class="full">Supporting line<input type="text" id="c-supporting" placeholder="Dedicated full-time virtual staff who join your team." /></label>
        <label>Benefit 1<input type="text" id="c-benefit1" /></label>
        <label>Benefit 2<input type="text" id="c-benefit2" /></label>
        <label>Benefit 3<input type="text" id="c-benefit3" /></label>
        <label>Benefit 4<input type="text" id="c-benefit4" /></label>
        <label>Offer<input type="text" id="c-offer" placeholder="No published offer" /></label>
        <label>CTA<input type="text" id="c-cta" placeholder="Learn More" /></label>
        <label class="full">Talent direction<textarea id="c-talent" placeholder="Credible, warm virtual medical administrator..."></textarea></label>
        <label>Scrub color<input type="text" id="c-scrub" placeholder="Cobalt blue" /></label>
        <label>Background color<input type="text" id="c-bg" placeholder="Deep navy" /></label>
        <label>Accent color<input type="text" id="c-accent" placeholder="Cyan" /></label>
        <label>Language
          <select id="c-language">
            <option>English</option>
            <option>Spanish</option>
            <option>Bilingual</option>
          </select>
        </label>
        <label>Format
          <select id="c-format">
            <option>1:1, 4:5, 9:16, 1.91:1</option>
            <option>1:1</option>
            <option>4:5</option>
            <option>9:16</option>
            <option>1.91:1</option>
          </select>
        </label>
        <label>Animation potential
          <select id="c-animation">
            <option>Static first</option>
            <option>Strong 6s candidate</option>
            <option>Strong 15s candidate</option>
            <option>Low priority</option>
          </select>
        </label>
        <label>Claim status
          <select id="c-claim">
            <option>No new claims</option>
            <option>Pending leadership</option>
            <option>Pending compliance</option>
            <option>Approved</option>
          </select>
        </label>
        <button type="submit">Generate Concept</button>
      </form>

      <div class="queue-grid" style="margin-top:1rem">
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Complete concept brief</h3>
          <span class="copytext" id="output-brief">Fill out the form above and click Generate Concept.</span>
          <button type="button" class="copy-btn" id="copy-brief" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>ChatGPT image prompt</h3>
          <span class="copytext" id="output-prompt">—</span>
          <button type="button" class="copy-btn" id="copy-prompt" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Designer instructions</h3>
          <span class="copytext" id="output-designer">—</span>
          <button type="button" class="copy-btn" id="copy-designer" data-copy="">Copy</button>
        </div>
        <div class="soft-card" style="grid-column:1/-1">
          <h3>Suggested aspect ratios</h3>
          <span class="copytext" id="output-ratios">—</span>
          <button type="button" class="copy-btn" id="copy-ratios" data-copy="">Copy</button>
        </div>
      </div>
    </details>`;

  return page({
    activeId: 'ideas',
    title: 'New Ad Ideas',
    pageTitle: 'New Ad Ideas',
    pageSubtitle: 'Visual sparks · 15–20 concept workflow.',
    body: body + CONCEPT_BUILDER_SCRIPT,
  });
}

// ─── 4. Aspect Ratios (vma-static.html) ──────────────────────────────────────

function wireframeFor(spec) {
  const zones = (spec.wireZones || [])
    .map(
      (z) =>
        `<div class="wire-zone" data-id="${esc(z.id)}" style="${esc(z.style)}">${esc(z.label)}</div>`,
    )
    .join('');
  return `<div class="wire" data-ratio="${esc(spec.id)}" aria-hidden="true">${zones}</div>`;
}

function sizeStrip() {
  return `<div class="size-strip" aria-label="Required Meta sizes">
    ${FORMAT_SPECS.map(
      (f) => `<div class="size-strip__item" data-id="${esc(f.id)}">
      <div class="size-strip__frame"></div>
      <strong>${esc(f.friendlyName || f.label)}</strong>
      <span>${esc(f.label)} · ${esc(f.dims)}</span>
      ${f.priorityLabel ? `<span class="chip">${esc(f.priorityLabel)}</span>` : ''}
    </div>`,
    ).join('')}
  </div>`;
}

function formatGuideCard(spec, exampleMaster) {
  const uses = (spec.useCases || []).map((u) => `<li>${esc(u)}</li>`).join('');
  const safe = (spec.safeZones || []).map((s) => `<li>${esc(s)}</li>`).join('');
  const example =
    spec.id === '1x1' && exampleMaster
      ? `<div class="ratio-guide__thumb">
          <img src="${esc(exampleMaster.masterImage)}" alt="${esc(exampleMaster.name)} approved square example" loading="lazy" />
        </div>
        <p class="lede" style="font-size:0.78rem;text-align:center;margin:0">Real approved example</p>`
      : `<div class="format-placeholder" style="min-height:4.5rem;border:1px dashed #D6E4EC;border-radius:8px;width:100%;max-width:180px;display:flex;align-items:center;justify-content:center">
          <div><strong>AWAITING DESIGN</strong>No fake preview — rebuild this shape</div>
        </div>`;

  return `<article class="ratio-guide" id="format-${esc(spec.id)}">
  <div class="ratio-guide__visual">
    ${wireframeFor(spec)}
    ${example}
  </div>
  <div class="ratio-guide__copy">
    ${spec.priorityLabel ? `<p>${statusBadge(spec.priorityLabel)}</p>` : ''}
    <h3>${esc(spec.friendlyName || spec.label)}</h3>
    <p class="dims">${esc(spec.label)} · ${esc(spec.dims)} · ${esc(spec.placement)}</p>
    <p><b>${esc(spec.shortTip || '')}</b></p>
    <p class="lede" style="margin-top:0.45rem">${esc(spec.layoutNote)}</p>
    <p style="margin:0.65rem 0 0.2rem;font-size:0.78rem;font-weight:700;color:#4A6275">Where it runs</p>
    <ul class="clean">${uses}</ul>
    ${safe ? `<p style="margin:0.65rem 0 0.2rem;font-size:0.78rem;font-weight:700;color:#4A6275">Keep clear for phone UI</p><ul class="clean">${safe}</ul>` : ''}
  </div>
</article>`;
}

function renderStatic() {
  const exampleMaster =
    APPROVED_MASTERS.find((m) => m.number === '02') || APPROVED_MASTERS[0];

  const guides = FORMAT_SPECS.map((f) => formatGuideCard(f, exampleMaster)).join('');

  const examplePoints = [
    ['Huge role headline', '“Virtual Medical Admin” reads instantly on a phone.'],
    ['Person is the hero', 'Face and scrubs stay clear — do not crop them awkwardly in taller or wider sizes.'],
    ['3–4 easy benefits', 'Keep the service list scannable; restack it for every canvas.'],
    ['Offer stays visible', 'Price / badge has to survive Stories safe zones and the wide landscape crop.'],
  ]
    .map(
      ([title, text]) => `<div class="soft-card"><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`,
    )
    .join('');

  const masterStatusCards = APPROVED_MASTERS.map((m) => {
    const summary = presentFormatsSummary(m);
    return `<div class="soft-card">
  <img src="${esc(m.masterImage)}" alt="${esc(m.name)} 1:1" loading="lazy" />
  <h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>
  <p><b>Ready:</b> ${esc(summary.approved)}</p>
  <p><b>Still needed:</b> ${esc(summary.awaiting)}</p>
  <a class="dl" href="${esc(m.masterImage)}" target="_blank" rel="noopener">Open square master</a>
</div>`;
  }).join('');

  const walkthroughRow = formatRow(exampleMaster);

  const handoffChecklist = ASPECT_RATIO_HANDOFF_CHECKLIST.map(
    (item, i) => `<li><input type="checkbox" data-persist="ratio-qa-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const namingExamples = FILE_NAMING.examples.map((e) => `<li><code>${esc(e)}</code></li>`).join('');

  const body = `
    <div class="hero">
      <h1>Aspect Ratios</h1>
      <p>Same ad idea — four phone-friendly shapes. Start from an approved square, then rebuild the layout for tall feed, Stories/Reels, and wide placements.</p>
    </div>

    <section id="sizes-at-a-glance">
      <h2>The four sizes at a glance</h2>
      ${sizeStrip()}
      <div class="callout-rule">Do not stretch or simply crop the square. Rebuild headline, person, benefits, badge, CTA, and logo for every shape.</div>
    </section>

    <section id="example">
      <h2>Start from a real approved example</h2>
      <p class="lede">This is Cobalt Blue — already approved as a square. Use it as the clarity bar for every other size.</p>
      <div class="example-hero">
        <div class="example-hero__media">
          <img src="${esc(exampleMaster.masterImage)}" alt="${esc(exampleMaster.name)} approved 1:1 example" width="1080" height="1080" loading="lazy" />
        </div>
        <div class="example-hero__points">
          ${examplePoints}
          <p class="note" style="margin:0">When you build 4:5, 9:16, or landscape, keep this level of clarity — do not invent a fake preview by cropping this file.</p>
        </div>
      </div>
    </section>

    <section id="how-each-size-works">
      <h2>How each size should feel</h2>
      <p class="lede">Wireframes show where things usually go. Only the square has a real finished image today — other shapes stay <b>Awaiting Design</b>.</p>
      ${guides}
    </section>

    <section id="walkthrough">
      <h2>Example progress — Cobalt Blue</h2>
      <p class="note">A crop is not a redesign. Reposition the pieces for each canvas.</p>
      ${walkthroughRow}
    </section>

    <section id="all-masters">
      <h2>All four masters — what’s ready</h2>
      <div class="await-board">${masterStatusCards}</div>
      <details class="block" style="margin-top:1rem">
        <summary>Full size checklist for every master</summary>
        ${APPROVED_MASTERS.map(
          (m) => `<div style="margin-top:1rem"><h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>${formatRow(m)}</div>`,
        ).join('')}
      </details>
    </section>

    <details class="block" id="handoff-checklist">
      <summary>Before you deliver — quick checklist</summary>
      <ul class="checklist">${handoffChecklist}</ul>
    </details>

    <details class="block" id="file-naming">
      <summary>File naming (when you export)</summary>
      ${copyBlock(FILE_NAMING.pattern)}
      <ul class="clean" style="margin-top:0.75rem">${namingExamples}</ul>
    </details>`;

  return page({
    activeId: 'vma-static',
    title: 'Aspect Ratios',
    pageTitle: 'Aspect Ratios',
    pageSubtitle: 'Friendly size guide with real examples.',
    body,
  });
}

// ─── 5. Competitor Wall (competitors.html) ───────────────────────────────────

function categoryLabel(category) {
  if (category === 'virtual-staffing') return 'Medical / healthcare VA staffing';
  if (category === 'bilingual-staffing') return 'Bilingual virtual staffing';
  if (category === 'practice-saas') return 'Practice ops software (adjacent pain only)';
  return category || '—';
}

function competitorCard(ad) {
  const pink = ad.pink;
  const sourceHref = ad.libraryId
    ? `https://www.facebook.com/ads/library/?id=${encodeURIComponent(ad.libraryId)}`
    : adLibraryUrl(ad.adLibraryQuery);

  return `<article class="comp-card">
  <div class="comp-card__media"><img src="${esc(ad.image)}" alt="${esc(ad.name)} ad reference" loading="lazy" /></div>
  <div class="comp-card__body">
    ${pink ? `<span class="pink-ref">REFERENCE ONLY — DO NOT USE PINK</span>` : ''}
    <h3>${esc(ad.name)}</h3>
    <p class="why">${esc(ad.whyWatch || '—')}</p>
    <p class="mini"><b>Offer / hook</b> ${esc(ad.offer || '—')}</p>
    <p class="mini"><b>Category</b> ${esc(categoryLabel(ad.category))}</p>
    <p class="mini"><b>Look</b> ${esc(ad.visual || '—')}</p>
    <p class="mini"><a href="${esc(sourceHref)}" target="_blank" rel="noopener">Ad Library source</a></p>
    <p class="mini"><b>What works</b> ${esc(ad.steal || '—')}</p>
    <p class="mini"><b>Not to copy</b> ${esc(ad.reject || '—')}</p>
  </div>
</article>`;
}

function renderCompetitors() {
  const { cards, updatedAt } = collectCompetitorWallCards();
  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'local image set';

  const body = `
    <div class="hero">
      <h1>Competitor Wall</h1>
      <p>${esc(COMPETITOR_META.intro)}</p>
    </div>
    <p class="note"><b>${cards.length} creatives with real screenshots</b> · refreshed ${esc(updatedLabel)}. Only ads with images appear here — grab new Ad Library stills anytime and regenerate. Off-category scrapes (shoes, pet ads, consumer booking) stay blocked.</p>

    <section id="wall">
      <h2>Image-first references</h2>
      <div class="comp-grid">${cards.map((a) => competitorCard(a)).join('')}</div>
    </section>`;

  return page({
    activeId: 'competitors',
    title: 'Competitor Wall',
    pageTitle: 'Competitor Wall',
    pageSubtitle: `${cards.length} medical VA & adjacent creatives with images.`,
    body,
  });
}

// ─── 6. Animated Video (vma-video.html) ──────────────────────────────────────

function renderVideo() {
  const outputsPerMaster = APPROVED_MASTERS.map(
    (m) => `<div class="soft-card">
  <div class="thumb-row"><a href="${esc(m.masterImage)}"><img src="${esc(m.masterImage)}" alt="${esc(m.name)}" loading="lazy" /></a></div>
  <h3>VMA-${esc(m.number)} · ${esc(m.name)}</h3>
  <ul class="clean">${VIDEO_OUTPUTS_PER_MASTER.map((o) => `<li><b>${esc(o.label)}</b> — ${esc(o.purpose)}</li>`).join('')}</ul>
</div>`,
  ).join('');

  const story = VIDEO_STORYBOARD.map(
    (s) => `<div class="beat"><b>${esc(s.scene)}</b><span>${esc(s.timing)}</span><div>${esc(s.note)}</div></div>`,
  ).join('');

  const sceneHint = (VIDEO_SCENES_15S?.structure || [])
    .map((x) => x.label)
    .filter(Boolean)
    .join(' → ');

  const remotionComps = REMOTION_COMPOSITIONS.map(
    (c) => `<div class="soft-card">
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.duration)} · ${esc(c.frames)}f @ ${esc(c.fps)}fps</p>
  <p>${esc(c.purpose)}</p>
  <p>${(c.uses || []).map((u) => `<span class="chip">${esc(u)}</span>`).join('')}</p>
</div>`,
  ).join('');

  const remotionInputs = REMOTION_COMPONENTS.map(
    (c) => `<div class="soft-card"><h3>${esc(c.name)}</h3><p>${esc(c.purpose)}</p><p><span class="chip">${esc(c.props)}</span></p></div>`,
  ).join('');

  const playbook = (REMOTION_PLAYBOOK.steps || []).map((s) => `<li>${esc(s)}</li>`).join('');

  const capcut = CAPCUT_TEMPLATES.map(
    (t) => `<div class="soft-card">
  <h3>${esc(t.name)}</h3>
  <p>${esc(t.duration)} · ${(t.aspectRatios || []).join(', ')}</p>
  <p>${esc(t.exportSpec)}</p>
  <p>${esc(t.colorNote)}</p>
</div>`,
  ).join('');

  const prompts = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Turn Approved Static Ads Into Short Videos</h1>
      <p>Animate the four approved masters — motion inherits the same hierarchy, colors, and claims as the static baseline.</p>
    </div>

    <section id="masters">
      ${mastersGrid('md')}
    </section>

    <section id="outputs">
      <h2>Recommended Outputs Per Master</h2>
      <div class="queue-grid">${outputsPerMaster}</div>
    </section>

    <section id="storyboard">
      <h2>Five-Scene Storyboard</h2>
      <div class="storyboard">${story}</div>
      ${sceneHint ? `<p class="lede">Reference beat string: ${esc(sceneHint)}</p>` : ''}
    </section>

    <section data-tabs id="production">
      <h2>Production Paths</h2>
      <div class="tabs">
        <button type="button" class="active" data-tab="overview">Overview</button>
        <button type="button" data-tab="remotion">Remotion</button>
        <button type="button" data-tab="capcut">CapCut</button>
        <button type="button" data-tab="prompts">Video Prompts</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="overview" id="overview">
          <p class="lede">Animate the approved hierarchy: hook → role clarity → benefits → offer/CTA. Prefer 6s / 10s / 15s cuts from each master after static QA.</p>
          <ul class="clean">${(REMOTION_PLAYBOOK.rules || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
        </div>
        <div class="tab-panel" data-panel="remotion" id="remotion">
          <p class="lede">${esc(REMOTION_PLAYBOOK.studioCmd)} · ${esc(REMOTION_PLAYBOOK.entryFile)}</p>
          <ul class="clean">${playbook}</ul>
          <h3 style="margin-top:1rem">Compositions</h3>
          <div class="queue-grid">${remotionComps}</div>
          <details class="block"><summary>Component inputs</summary>
            <div class="queue-grid">${remotionInputs}</div>
          </details>
        </div>
        <div class="tab-panel" data-panel="capcut" id="capcut">
          <div class="queue-grid">${capcut}</div>
        </div>
        <div class="tab-panel" data-panel="prompts" id="prompts">
          <div class="prompt-grid">${prompts}</div>
        </div>
      </div>
    </section>`;

  return page({
    activeId: 'vma-video',
    title: 'Animated Video',
    pageTitle: 'Animated Video',
    pageSubtitle: 'Motion from approved statics.',
    body,
  });
}

// ─── 7. Prompts & Copy (vma-chatgpt.html) ────────────────────────────────────

function renderCopyPack(packs, langLabel) {
  return packs
    .map((pack) => {
      const sections = [
        ['Primary texts', pack.primaryTexts],
        ['Headlines', pack.headlines],
        ['Descriptions', pack.descriptions],
        ['CTAs', pack.ctas],
      ]
        .filter(([, lines]) => Array.isArray(lines) && lines.length)
        .map(
          ([title, lines]) => `<details class="block"><summary>${esc(title)} (${lines.length})</summary>
  ${lines.map((line) => `<div style="margin:0.45rem 0">${copyBlock(line)}</div>`).join('')}
</details>`,
        )
        .join('');
      return `<div class="soft-card" style="grid-column:1/-1">
  <h3>${esc(pack.name)} · ${esc(langLabel)}</h3>
  <p>Matching form: ${esc(pack.matchingForm || '—')}</p>
  ${sections}
</div>`;
    })
    .join('');
}

function renderChatgpt() {
  const workflow = CHATGPT_WORKFLOW.map(
    (s) => `<div class="soft-card"><div class="master-card__meta">Step ${esc(s.step)}</div><h3>${esc(s.title)}</h3><p>${esc(s.instruction)}</p></div>`,
  ).join('');

  const qaChecks = VMA_META.chatgptQaChecks.map((c) => `<span class="chip">${esc(c)}</span>`).join('');

  const imagePrompts = CHATGPT_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.conceptNumber)} · ${esc(p.colorFamily)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const videoPrompts = VIDEO_PROMPTS.map(
    (p) => `<div class="soft-card">
  <h3>${esc(p.id)} · ${esc(p.title)}</h3>
  <p>${esc(p.duration)}</p>
  ${copyBlock(p.prompt)}
</div>`,
  ).join('');

  const body = `
    <div class="hero">
      <h1>Prompts &amp; Copy</h1>
      <p>The ChatGPT concept workflow, image and video prompt banks, and English / Spanish copy — all in one place.</p>
    </div>

    <section id="workflow">
      <h2>ChatGPT Workflow</h2>
      <div class="queue-grid">${workflow}</div>
    </section>

    <div class="callout-rule">CHATGPT MAY GENERATE COMPLETE ADS. The team may use AI-generated creative for testing.</div>
    <section id="qa-checks">
      <h2>Check Every Word Before Shipping</h2>
      <div>${qaChecks}</div>
    </section>

    <section data-tabs id="banks">
      <div class="tabs">
        <button type="button" class="active" data-tab="images">Image prompts</button>
        <button type="button" data-tab="video">Video prompts</button>
        <button type="button" data-tab="english">English</button>
        <button type="button" data-tab="spanish">Spanish</button>
        <button type="button" data-tab="builder">Copy builder</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel active" data-panel="images" id="images">
          <div class="prompt-grid">${imagePrompts}</div>
        </div>
        <div class="tab-panel" data-panel="video" id="video">
          <div class="prompt-grid">${videoPrompts}</div>
        </div>
        <div class="tab-panel" data-panel="english" id="english">
          <div class="copy-grid">${renderCopyPack(COPY_EN, 'EN')}</div>
        </div>
        <div class="tab-panel" data-panel="spanish" id="spanish">
          <div class="copy-grid">${renderCopyPack(COPY_ES, 'ES')}</div>
        </div>
        <div class="tab-panel" data-panel="builder" id="builder">
          <div class="soft-card">
            <h3>Copy Builder</h3>
            <p>Pick one primary text, one headline, and one description from the English or Spanish tabs. Pair with an approved CTA. Keep only claims already on the approved masters — see <a href="/vma-handoff.html#claims">claims status</a>.</p>
          </div>
        </div>
      </div>
    </section>`;

  return page({
    activeId: 'vma-chatgpt',
    title: 'Prompts & Copy',
    pageTitle: 'Prompts & Copy',
    pageSubtitle: 'ChatGPT, video prompts, EN/ES copy.',
    body,
  });
}

// ─── 8. Production Handoff (vma-handoff.html) ────────────────────────────────

function claimStatusSimple(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('reject') || s.includes('do not')) return 'Rejected';
  if (s.includes('approved') || s.includes('confirmed')) return 'Approved';
  return 'Pending';
}

/** First FORMAT_SPECS size that still has Awaiting Design on any master. */
function nextPriorityWaveSpec() {
  for (const spec of FORMAT_SPECS) {
    const anyAwaiting = APPROVED_MASTERS.some((m) => {
      const cell = m.formats.find((f) => f.formatId === spec.id);
      return cell && cell.status !== 'Approved';
    });
    if (anyAwaiting) return spec;
  }
  return null;
}

function nextSizeAfter(spec) {
  if (!spec) return null;
  const idx = FORMAT_SPECS.findIndex((f) => f.id === spec.id);
  return idx >= 0 && idx < FORMAT_SPECS.length - 1 ? FORMAT_SPECS[idx + 1] : null;
}

function renderHandoff() {
  const byNumber = Object.fromEntries(APPROVED_MASTERS.map((m) => [m.number, m]));
  const ordered = GRAPHICS_BUILD_ORDER.map((n) => byNumber[n]).filter(Boolean);
  const waveSpec = nextPriorityWaveSpec();
  const followingSpec = nextSizeAfter(waveSpec);

  const waveCards = waveSpec
    ? ordered
        .map((m, i) => {
          const cell = m.formats.find((f) => f.formatId === waveSpec.id);
          const status = cell?.status === 'Approved' ? 'Approved' : 'Awaiting Design';
          return `<div class="soft-card">
  <div class="master-card__meta">Build order ${i + 1} · VMA-${esc(m.number)}</div>
  <h3>${esc(m.name)}</h3>
  <p>Target: <b>${esc(waveSpec.label)}</b> · ${esc(waveSpec.dims)}</p>
  <p>Filename: <code>${esc(cell?.expectedFilename || `${m.stem}_${waveSpec.id}.png`)}</code></p>
  <p>${statusBadge(status)}</p>
  <a class="dl" href="${esc(m.masterImage)}" target="_blank" rel="noopener">Open approved master PNG</a>
</div>`;
        })
        .join('')
    : `<div class="soft-card"><p>All four sizes are approved for every master. Pick up Later work (idea batch) or video.</p></div>`;

  const sizeChips = FORMAT_SPECS.map((f) => `<span class="chip">${esc(f.dims)} (${esc(f.label)})</span>`).join('');

  const matrix = formatMatrixCells();
  const matrixHead = FORMAT_SPECS.map(
    (f) => `<th>${esc(f.label)}<br /><span style="font-weight:500;text-transform:none;letter-spacing:0">${esc(f.dims)}</span></th>`,
  ).join('');
  const matrixRows = matrix
    .map((row) => {
      const cells = row.cells.map((c) => `<td>${statusBadge(c.displayStatus)}</td>`).join('');
      return `<tr><td class="rowhead">VMA-${esc(row.master.number)}<br />${esc(row.master.name)}</td>${cells}</tr>`;
    })
    .join('');

  const dashClaims = DASHBOARD_CLAIMS.map((c) => {
    const full = CLAIMS.find((x) => x.id === c.id);
    const simple = claimStatusSimple(c.status);
    return `<div class="soft-card">
  <h3>${esc(c.label)}</h3>
  <p>${statusBadge(simple)}</p>
  ${full ? `<p style="font-size:0.78rem;color:#4A6275">${esc(full.notes || full.status)}</p>` : ''}
</div>`;
  }).join('');

  const qa = HANDOFF_QA.map(
    (item, i) => `<li><input type="checkbox" data-persist="handoff-qa-${i}" /> <span>${esc(item)}</span></li>`,
  ).join('');

  const dos = GRAPHICS_DO.map((d) => `<li>${esc(d)}</li>`).join('');
  const donts = GRAPHICS_DONT.map((d) => `<li>${esc(d)}</li>`).join('');

  const form = CURRENT_META_FORM;
  const formFields = (form.requiredFields || []).map((f) => `<span class="chip">${esc(f)}</span>`).join('');
  const answers = (form.routingAnswers || []).map((a) => `<li>${esc(a)}</li>`).join('');

  const waveLabel = waveSpec
    ? `${waveSpec.label} / ${waveSpec.dims}`
    : 'all sizes complete';
  const nextWaveHint = followingSpec
    ? `After this wave: ${followingSpec.label} (${followingSpec.dims}), then the next size — still one wave at a time.`
    : 'After this wave: idea factory or video — still one finish line at a time.';

  const body = `
    <div class="hero">
      <h1>Production Handoff</h1>
      <p>What to ship next. Finish this wave before starting the next.</p>
      <p class="lede">We want strong finished packs Hailey can move — not twenty half-started tabs.</p>
    </div>

    <section id="priority-now">
      <h2>Priority Now</h2>
      <div class="job-box">
        <p><b>Wave:</b> Resize the 4 approved masters into <b>${esc(waveLabel)}</b>.</p>
        <p>Build order: ${GRAPHICS_BUILD_ORDER.map((n) => `VMA-${esc(n)}`).join(' → ')}</p>
        <p class="note">Layout notes live on <a href="/vma-static.html">Aspect Ratios</a> — rebuild each canvas; do not stretch or center-crop the square.</p>
      </div>
      <div class="queue-grid">${waveCards}</div>
      <p class="note" id="ops">Ops / Meta — if uploading the existing 1:1 pack is faster today: <a href="/exports/meta-upload-ready-vma/README_UPLOAD_NOW.md">Meta upload-ready pack</a>. That is ops work, not the designer wave above.</p>
    </section>

    <section id="done">
      <h2>Done for this wave</h2>
      <div class="soft-card">
        <ul class="clean">
          <li>4 PNGs at correct dimensions (${esc(waveSpec ? waveSpec.dims : 'n/a')}) with expected filenames</li>
          <li>One editable source (or 4 linked sources)</li>
          <li>Essential QA checked</li>
          <li>Ready for Hailey review</li>
        </ul>
        <p class="note">Done is not “every cell in the matrix green.”</p>
      </div>
    </section>

    <section id="pace">
      <h2>Pace</h2>
      <div class="soft-card">
        <p>Prefer <b>one complete wave</b> (e.g. four ${esc(waveSpec ? waveSpec.label : '4:5')}s) over starting 15–20 new concepts.</p>
        <p>Aim for about one wave per person before picking up new work — a soft guide, not a timesheet.</p>
        <p>${esc(nextWaveHint)}</p>
        <p class="note">Idea factory (15–20 concepts) stays in <b>Later</b> below — not the ask on this page.</p>
      </div>
    </section>

    <section id="qa">
      <h2>Essential QA</h2>
      <ul class="checklist">${qa}</ul>
    </section>

    <details class="block" id="matrix">
      <summary>Full size backlog (status matrix)</summary>
      <p class="lede">Green = approved. Yellow = Awaiting Design.</p>
      <table class="matrix">
        <thead><tr><th>Concept</th>${matrixHead}</tr></thead>
        <tbody>${matrixRows}</tbody>
      </table>
    </details>

    <details class="block" id="request">
      <summary>Later: idea batch + multi-size builds</summary>
      <div class="job-box">
        <p><b>Later request:</b> 15–20 new concepts (see <a href="/ideas.html">New Ad Ideas</a>).</p>
        <p><b>After review:</b> build the strongest concepts in all 4 required sizes.</p>
        <p>Required sizes:</p>
        <div style="margin:0.5rem 0">${sizeChips}</div>
        <p class="note">Every concept that moves to design ships in all 4 sizes, plus an editable source file (PSD / AI / Figma) per concept.</p>
      </div>
    </details>

    <details class="block" id="claims">
      <summary>Claims (ops — pending confirmation)</summary>
      <div class="claim-grid">${dashClaims}</div>
      <p class="note">Do not invent claims. Detailed tracking stays in the team spreadsheet.</p>
    </details>

    <details class="block" id="rules">
      <summary>Rules (quick)</summary>
      <div class="two-cols">
        <div class="soft-card"><h3>Do</h3><ul class="clean do-list">${dos}</ul></div>
        <div class="soft-card"><h3>Don't</h3><ul class="clean dont-list">${donts}</ul></div>
      </div>
    </details>

    <details class="block" id="form">
      <summary>Not for graphics — current Meta form (ops only)</summary>
      <div class="soft-card">
        <h3>${esc(form.name)}</h3>
        <p><b>Intro:</b> ${esc(form.introHeadline)} — ${esc(form.introDescription)}</p>
        <p><b>Routing:</b> ${esc(form.routingQuestion)}</p>
        <ul class="clean">${answers}</ul>
        <p style="margin-top:0.5rem">${formFields}</p>
        <p>${esc(form.privacyMessage)}</p>
        <p><b>End:</b> ${esc(form.endHeadline)} — ${esc(form.endDescription)}</p>
        <p><a href="${esc(form.demoLink)}" target="_blank" rel="noopener">${esc(form.demoCta)}</a></p>
      </div>
    </details>

    <section id="approval">
      <p class="note">Approval and delivery status are tracked in the team spreadsheet — not on this page.</p>
    </section>`;

  return page({
    activeId: 'vma-handoff',
    title: 'Production Handoff',
    pageTitle: 'Production Handoff',
    pageSubtitle: 'Next wave, pace, and done line.',
    body,
  });
}

// ─── Redirects ───────────────────────────────────────────────────────────────

const REDIRECTS = [
  { from: 'vma-history.html', to: '/studio.html' },
  { from: 'direct-response.html', to: '/vma-approved.html' },
  // Consolidated VMA ops pages → handoff / video / prompts
  { from: 'vma-remotion.html', to: '/vma-video.html#remotion' },
  { from: 'vma-capcut.html', to: '/vma-video.html#capcut' },
  { from: 'vma-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'vma-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'vma-form.html', to: '/vma-handoff.html#form' },
  { from: 'vma-campaign.html', to: '/vma-handoff.html' },
  { from: 'vma-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'vma-qa.html', to: '/vma-handoff.html#qa' },
  { from: 'vma-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'vma-approval.html', to: '/vma-handoff.html#approval' },
  // Legacy dr-* → consolidated VMA pages
  { from: 'dr-concepts-en.html', to: '/ideas.html' },
  { from: 'dr-concepts-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-concepts-roles.html', to: '/ideas.html' },
  { from: 'dr-image-prompts.html', to: '/vma-chatgpt.html#images' },
  { from: 'dr-form.html', to: '/vma-handoff.html#form' },
  { from: 'dr-offers.html', to: '/vma-handoff.html' },
  { from: 'dr-claims.html', to: '/vma-handoff.html#claims' },
  { from: 'dr-production-queue.html', to: '/vma-handoff.html#matrix' },
  { from: 'dr-qa-checklist.html', to: '/vma-handoff.html#qa' },
  { from: 'dr-campaign-plan.html', to: '/vma-handoff.html' },
  { from: 'dr-copy-matrix.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-en.html', to: '/vma-chatgpt.html#english' },
  { from: 'dr-copy-es.html', to: '/vma-chatgpt.html#spanish' },
  { from: 'dr-approval.html', to: '/vma-handoff.html#approval' },
  { from: 'dr-superseded.html', to: '/studio.html' },
  { from: 'dr-reference-analysis.html', to: '/competitors.html' },
  { from: 'dr-design-system.html', to: '/vma-approved.html' },
  { from: 'dr-color-board.html', to: '/vma-approved.html' },
];

// ─── Write all pages ─────────────────────────────────────────────────────────

const primary = [
  ['studio.html', renderStudio()],
  ['vma-approved.html', renderApproved()],
  ['ideas.html', renderIdeas()],
  ['vma-static.html', renderStatic()],
  ['competitors.html', renderCompetitors()],
  ['vma-video.html', renderVideo()],
  ['vma-chatgpt.html', renderChatgpt()],
  ['vma-handoff.html', renderHandoff()],
];

for (const [name, html] of primary) write(name, html);
for (const r of REDIRECTS) write(r.from, renderRedirect(r.to));

console.log(
  `VMA handoff site generated · ${primary.length} primary pages + ${REDIRECTS.length} redirects · ${filesWritten} files total.`,
);
