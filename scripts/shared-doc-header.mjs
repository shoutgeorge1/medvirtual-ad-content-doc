/**
 * Shared MedVirtual Content Doc header — identical across all surfaces.
 * Home = Graphic Brief (designer/VA start). Nav follows production workflow left → right.
 */
import { brandCssVariables, BRAND } from './medvirtual-brand-data.mjs';

export const DOC_BRAND = {
  mark: 'MV',
  title: 'MedVirtual Creative Handoff',
  tagline: 'Meta ads · brief · brand · assets',
  homeHref: '/graphic-request-brief.html',
  logoWhite: BRAND.assets.logoWhiteSvg,
};

/** Primary nav — Graphic Brief is the only production handoff */
export const PRIMARY_NAV = [
  {
    href: '/graphic-request-brief.html',
    label: 'Brief',
    id: 'brief',
    description: 'Start here. 4 static ads with on-image copy, visual direction, and Meta paste fields.',
  },
  {
    href: '/medvirtual-brand-guide.html',
    label: 'Brand Guide',
    id: 'brand-guide',
    description: 'Official logos, colors, type, voice, and claims guardrails.',
  },
  {
    href: '/template-test-board.html',
    label: 'Templates',
    id: 'templates',
    description: 'Optional layout reference only — not a second brief.',
  },
  {
    href: '/image-variation-review.html',
    label: 'Image Review',
    id: 'images',
    description: 'Designer image selection by subject position and copy space.',
  },
  {
    href: '/asset-hub.html',
    label: 'Assets',
    id: 'hub',
    description: 'Download brand logos and raw AI images for editors.',
  },
  {
    href: '/meta-launch-build-pack.html',
    label: 'Meta Launch',
    id: 'launch',
    description: 'Same-day Meta build pack: campaign shell, ads, form draft, QA.',
  },
  {
    href: '/real-people-creative.html',
    label: 'Real People',
    id: 'real-people',
    description: 'Named Talent Pool profiles for Meta static, Reels, and short video.',
  },
  {
    href: '/real-people-assets.html',
    label: 'RP Assets',
    id: 'real-people-assets',
    description: 'Talent Pool originals, crops, design drafts, AI video refs.',
  },
];

/** Image/crop sub-pages — linked from Image Review header */
export const IMAGE_SUBNAV = [
  { href: '/image-variation-review.html', label: 'Selection Board' },
  { href: '/contact-sheet-best-candidates.html', label: 'Approved Only' },
  { href: '/contact-sheet-all-4x5.html', label: '4:5 Feed' },
  { href: '/contact-sheet-all-9x16.html', label: '9:16 Stories' },
];

/** Secondary reference pages — not in main nav */
export const SECONDARY_PAGES = [
  {
    href: '/contact-sheet-best-candidates.html',
    label: 'Approved Crops',
    description: 'Shortlist of best image crops for production.',
  },
  {
    href: '/contact-sheet-all-4x5.html',
    label: '4:5 Feed Crops',
    description: 'All 1080×1350 feed crops in one contact sheet.',
  },
  {
    href: '/contact-sheet-all-9x16.html',
    label: '9:16 Story Crops',
    description: 'All story/reels crops — for later resize phase only.',
  },
  {
    href: '/contact-sheet-ai-images.html',
    label: 'AI Image Catalog',
    description: 'Full catalog of AI-generated source images.',
  },
];

export const HEADER_CSS = `
  ${brandCssVariables()}
  .doc-header {
    background: var(--mv-deep-teal);
    color: #ffffff;
    border-bottom: 3px solid var(--mv-cyan);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 40;
    font-family: var(--mv-font);
  }
  .doc-header__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .doc-header__brand {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    text-decoration: none;
    color: inherit;
  }
  .doc-header__logo {
    display: block;
    height: 36px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .doc-header__mark {
    display: none;
  }
  .doc-header__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: #f8fafc;
  }
  .doc-header__tagline {
    margin: 0.1rem 0 0;
    font-size: 0.78rem;
    font-weight: 400;
    color: #b8d4e0;
  }
  .doc-header__page {
    margin: 0.85rem 0 0;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .doc-header__page-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 650;
    color: #e2e8f0;
  }
  .doc-header__page-sub {
    margin: 0.25rem 0 0;
    font-size: 0.82rem;
    font-weight: 400;
    color: #b8d4e0;
    max-width: 820px;
  }
  .doc-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .doc-nav a {
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #d7e8f0;
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 0.15s, color 0.15s;
  }
  .doc-nav a:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
  .doc-nav a.active {
    color: #ffffff;
    background: var(--mv-primary);
  }
  .doc-subnav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.75rem;
  }
  .doc-subnav a {
    color: var(--mv-bright-accent);
    text-decoration: none;
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
  }
  .doc-subnav a:hover { border-color: var(--mv-cyan); color: #fff; }
  .doc-subnav a.active {
    background: rgba(0, 178, 226, 0.2);
    border-color: var(--mv-cyan);
    color: #fff;
  }
  @media (max-width: 640px) {
    .doc-header { padding: 1rem; }
    .doc-header__logo { height: 30px; max-width: 130px; }
  }
`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * @param {{ activeId?: string, pageTitle?: string, pageSubtitle?: string, subnav?: Array<{href:string,label:string}>, activeSubHref?: string }} opts
 */
export function renderDocHeader(opts = {}) {
  const { activeId, pageTitle, pageSubtitle, subnav, activeSubHref } = opts;
  const nav = PRIMARY_NAV.map((l) => {
    const cls = l.id === activeId ? 'active' : '';
    return `<a href="${esc(l.href)}" class="${cls}">${esc(l.label)}</a>`;
  }).join('');

  let sub = '';
  if (subnav?.length) {
    sub = `<nav class="doc-subnav" aria-label="Section">
      ${subnav
        .map((l) => {
          const cls = l.href === activeSubHref ? 'active' : '';
          return `<a href="${esc(l.href)}" class="${cls}">${esc(l.label)}</a>`;
        })
        .join('')}
    </nav>`;
  }

  const pageBlock =
    pageTitle
      ? `<div class="doc-header__page">
          <h2 class="doc-header__page-title">${esc(pageTitle)}</h2>
          ${pageSubtitle ? `<p class="doc-header__page-sub">${esc(pageSubtitle)}</p>` : ''}
          ${sub}
        </div>`
      : sub
        ? `<div class="doc-header__page">${sub}</div>`
        : '';

  return `<header class="doc-header">
  <div class="doc-header__row">
    <a class="doc-header__brand" href="${esc(DOC_BRAND.homeHref)}">
      <img class="doc-header__logo" src="${esc(DOC_BRAND.logoWhite)}" alt="MedVirtual" width="160" height="48" />
      <div>
        <h1 class="doc-header__title">${esc(DOC_BRAND.title)}</h1>
        <p class="doc-header__tagline">${esc(DOC_BRAND.tagline)}</p>
      </div>
    </a>
    <nav class="doc-nav" aria-label="Primary">${nav}</nav>
  </div>
  ${pageBlock}
</header>`;
}
