/**
 * Shared MedVirtual Content Doc header — identical across all surfaces.
 * Graphics workflow left → right. Concepts keep stacking right of Real People.
 * Use dropdowns (`children`) when a lane has multiple boards.
 */
import { brandCssVariables, BRAND } from './medvirtual-brand-data.mjs';
import { LAUNCH_SUBNAV } from './launch-sequences-data.mjs';

export const DOC_BRAND = {
  mark: 'MV',
  title: 'MedVirtual Creative Handoff',
  tagline: 'Graphics · templates · Real People · SaaS',
  homeHref: '/graphic-request-brief.html',
  logoWhite: BRAND.assets.logoWhiteSvg,
};

/**
 * Primary nav — left → right. New concept lanes append after Real People.
 * Use `children` for a dropdown when a lane has 2+ boards.
 */
export const PRIMARY_NAV = [
  {
    href: '/graphic-request-brief.html',
    label: 'Brief',
    id: 'brief',
    description: 'Do now queue + Graphics Request Form paste.',
  },
  {
    href: '/template-test-board.html',
    label: 'Templates',
    id: 'templates',
    description: 'Hailey layout refs + Role-Offer boards.',
    children: [
      {
        href: '/template-test-board.html',
        label: 'Layout refs',
        id: 'templates',
      },
      {
        href: '/role-offer-templates.html',
        label: 'Role-Offer',
        id: 'role-offer',
      },
    ],
  },
  {
    href: '/real-people-creative.html',
    label: 'Real People',
    id: 'real-people',
    description: 'Ready ads · next up · Hailey Meet look · Talent Pool downloads.',
  },
  {
    href: '/saas-prop-templates.html',
    label: 'SaaS Prop',
    id: 'saas-prop',
    description: 'Classy medical-software look · no people · fancy words.',
  },
];

/** Far-right reference — producer / brand, not daily VA workflow */
export const REFERENCE_NAV = [
  {
    href: '/medvirtual-brand-guide.html',
    label: 'Brand Guide',
    id: 'brand-guide',
  },
  {
    href: '/asset-hub.html',
    label: 'Assets',
    id: 'hub',
  },
  {
    href: '/image-variation-review.html',
    label: 'Images',
    id: 'images',
  },
];

/** @deprecated use PRIMARY_NAV + REFERENCE_NAV */
export const IMAGE_SUBNAV = [
  { href: '/image-variation-review.html', label: 'Selection Board' },
  { href: '/contact-sheet-best-candidates.html', label: 'Approved Only' },
  { href: '/contact-sheet-all-4x5.html', label: '4:5 Feed' },
  { href: '/contact-sheet-all-9x16.html', label: '9:16 Stories' },
];

export { LAUNCH_SUBNAV };

/** Secondary reference pages — not in main nav */
export const SECONDARY_PAGES = [
  {
    href: '/marketing-library.html',
    label: 'Marketing Library',
    description: 'Blog, LinkedIn, newsletter, print, social, and web channel assets.',
  },
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
  .doc-nav-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.55rem 0.85rem;
  }
  .doc-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
  }
  .doc-nav a,
  .doc-nav-dd > summary {
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #d7e8f0;
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 0.15s, color 0.15s;
    list-style: none;
    cursor: pointer;
  }
  .doc-nav-dd > summary::-webkit-details-marker { display: none; }
  .doc-nav-dd > summary::after {
    content: '▾';
    margin-left: 0.35em;
    font-size: 0.7em;
    opacity: 0.75;
  }
  .doc-nav a:hover,
  .doc-nav-dd > summary:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
  .doc-nav a.active,
  .doc-nav-dd.active > summary,
  .doc-nav-dd[open] > summary {
    color: #ffffff;
    background: var(--mv-primary);
  }
  .doc-nav-dd {
    position: relative;
  }
  .doc-nav-dd__menu {
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    min-width: 11rem;
    background: #0a4558;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 10px;
    padding: 0.35rem;
    box-shadow: 0 12px 28px rgba(0,0,0,0.28);
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .doc-nav-dd__menu a {
    display: block;
    white-space: nowrap;
    border-radius: 7px;
  }
  .doc-nav-dd__menu a.active {
    background: rgba(0, 178, 226, 0.28);
  }
  .doc-nav--ref a,
  .doc-nav--ref .doc-nav-dd > summary {
    font-size: 0.72rem;
    font-weight: 400;
    color: #9fb9c6;
    padding: 0.35rem 0.55rem;
  }
  .doc-nav--ref a.active,
  .doc-nav--ref .doc-nav-dd.active > summary,
  .doc-nav--ref .doc-nav-dd[open] > summary {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }
  .doc-nav-sep {
    width: 1px;
    height: 1.35rem;
    background: rgba(255,255,255,0.22);
    flex-shrink: 0;
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
    .doc-nav-sep { display: none; }
    .doc-nav-dd__menu { min-width: 9.5rem; }
  }
`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function itemActive(item, activeId) {
  if (!activeId) return false;
  if (item.id === activeId) return true;
  return (item.children || []).some((c) => c.id === activeId);
}

function renderNavItem(item, activeId) {
  if (item.children?.length) {
    const openCls = itemActive(item, activeId) ? 'active' : '';
    const links = item.children
      .map((c) => {
        const cls = c.id === activeId || (c.id === item.id && activeId === item.id) ? 'active' : '';
        // Prefer child-specific active; Layout refs shares id with parent
        const childActive =
          c.id === activeId ||
          (activeId === item.id && c.href === item.href)
            ? 'active'
            : '';
        return `<a href="${esc(c.href)}" class="${childActive || cls}">${esc(c.label)}</a>`;
      })
      .join('');
    return `<details class="doc-nav-dd ${openCls}">
      <summary>${esc(item.label)}</summary>
      <div class="doc-nav-dd__menu">${links}</div>
    </details>`;
  }
  const cls = item.id === activeId ? 'active' : '';
  return `<a href="${esc(item.href)}" class="${cls}">${esc(item.label)}</a>`;
}

function linkList(items, activeId) {
  return items.map((item) => renderNavItem(item, activeId)).join('');
}

/**
 * @param {{ activeId?: string, pageTitle?: string, pageSubtitle?: string, subnav?: Array<{href:string,label:string}>, activeSubHref?: string }} opts
 */
export function renderDocHeader(opts = {}) {
  const { activeId, pageTitle, pageSubtitle, subnav, activeSubHref } = opts;
  const primary = linkList(PRIMARY_NAV, activeId);
  const reference = linkList(REFERENCE_NAV, activeId);

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
    <div class="doc-nav-wrap">
      <nav class="doc-nav" aria-label="Primary">${primary}</nav>
      <span class="doc-nav-sep" aria-hidden="true"></span>
      <nav class="doc-nav doc-nav--ref" aria-label="Reference">${reference}</nav>
    </div>
  </div>
  ${pageBlock}
</header>
<script>
(function () {
  document.querySelectorAll('.doc-nav-dd').forEach((dd) => {
    dd.addEventListener('toggle', () => {
      if (!dd.open) return;
      document.querySelectorAll('.doc-nav-dd').forEach((other) => {
        if (other !== dd) other.open = false;
      });
    });
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.doc-nav-dd')) return;
    document.querySelectorAll('.doc-nav-dd[open]').forEach((dd) => { dd.open = false; });
  });
})();
</script>`;
}
