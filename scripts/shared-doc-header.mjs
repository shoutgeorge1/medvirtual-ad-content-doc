/**
 * Shared MedVirtual Content Doc header.
 * Creative handoff + idea generation — Virtual Medical Admin Meta ads.
 */
import { brandCssVariables, BRAND } from './medvirtual-brand-data.mjs';

export const DOC_BRAND = {
  mark: 'MV',
  title: 'MedVirtual Ad Production',
  tagline: 'Approved VMA creative · 15–20 concepts · required Meta sizes',
  homeHref: '/studio.html',
  logoWhite: BRAND.assets.logoWhiteSvg,
};

/** @deprecated */
export const LAUNCH_SUBNAV = [];

/**
 * Primary nav — eight creative-handoff pages.
 * Ops tools (claims, QA, queue, forms, campaign) live as page sections / redirects.
 */
export const PRIMARY_NAV = [
  {
    href: '/studio.html',
    label: 'Dashboard',
    id: 'studio',
    description: 'Approved ads, checklist, formats, quick links.',
  },
  {
    href: '/vma-approved.html',
    label: 'Approved Creative',
    id: 'vma-approved',
    description: 'Four approved masters — image-first analysis.',
  },
  {
    href: '/ideas.html',
    label: 'New Ad Ideas',
    id: 'ideas',
    description: '15–20 concept batch builder.',
  },
  {
    href: '/vma-static.html',
    label: 'Aspect Ratios',
    id: 'vma-static',
    description: '1:1 · 4:5 · 9:16 · 1.91:1.',
  },
  {
    href: '/competitors.html',
    label: 'Competitor Wall',
    id: 'competitors',
    description: 'Image-first references — do not copy.',
  },
  {
    href: '/vma-video.html',
    label: 'Animated Video',
    id: 'vma-video',
    description: 'Motion from approved statics.',
  },
  {
    href: '/vma-chatgpt.html',
    label: 'Prompts & Copy',
    id: 'vma-chatgpt',
    description: 'ChatGPT, video prompts, EN/ES copy.',
  },
  {
    href: '/vma-handoff.html',
    label: 'Production Handoff',
    id: 'vma-handoff',
    description: 'Next wave, pace, and done line.',
  },
];

export const TEMPLATE_LANES = [];
export const REFERENCE_NAV = [];
export const IMAGE_SUBNAV = [];
export const SECONDARY_PAGES = [
  { href: '/raw-assets.html', label: 'Raw Assets', description: 'Downloadable components.' },
  { href: '/asset-hub.html', label: 'Asset Hub', description: 'Brand packages.' },
  { href: '/graphic-request-brief.html', label: 'Brief', description: 'Designer assignments.' },
];

export const HEADER_CSS = `
  ${brandCssVariables()}
  .doc-header {
    background: #0B1F3A;
    color: #ffffff;
    border-bottom: 2px solid #077999;
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
  .doc-header__mark { display: none; }
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
    color: #a3a3a3;
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
    color: #a3a3a3;
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
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #d4d4d4;
    text-decoration: none;
    border: 1px solid transparent;
    list-style: none;
    cursor: pointer;
    background: transparent;
  }
  .doc-header details.doc-nav-dd {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .doc-header details.doc-nav-dd > summary {
    background: transparent !important;
    color: #d4d4d4 !important;
    font-weight: 500 !important;
    border: 1px solid transparent !important;
    padding: 0.45rem 0.75rem !important;
  }
  .doc-nav-dd > summary::-webkit-details-marker { display: none; }
  .doc-nav-dd > summary::after {
    content: '▾';
    margin-left: 0.35em;
    font-size: 0.7em;
    opacity: 0.75;
  }
  .doc-nav a:hover,
  .doc-header details.doc-nav-dd > summary:hover {
    color: #ffffff !important;
    background: rgba(0, 178, 226, 0.18) !important;
  }
  .doc-nav a.active {
    color: #ffffff;
    background: #077999;
    font-weight: 700;
  }
  .doc-header details.doc-nav-dd.active > summary,
  .doc-header details.doc-nav-dd[open] > summary {
    color: #ffffff !important;
    background: #077999 !important;
    font-weight: 700 !important;
  }
  .doc-nav-dd { position: relative; }
  .doc-nav-dd__menu {
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    min-width: 12rem;
    background: #171717;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 10px;
    padding: 0.35rem;
    box-shadow: 0 12px 28px rgba(0,0,0,0.45);
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
    background: rgba(0, 178, 226, 0.22);
    color: #7dd3fc;
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
    color: #7dd3fc;
    text-decoration: none;
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
  }
  .doc-subnav a:hover { border-color: #00B2E2; color: #fff; }
  .doc-subnav a.active {
    background: rgba(0, 178, 226, 0.22);
    border-color: #00B2E2;
    color: #fff;
  }
  @media (max-width: 640px) {
    .doc-header { padding: 1rem; }
    .doc-header__logo { height: 30px; max-width: 130px; }
    .doc-nav-sep { display: none; }
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
        const childActive =
          c.id === activeId || (activeId === item.id && c.href === item.href) ? 'active' : '';
        return `<a href="${esc(c.href)}" class="${childActive}">${esc(c.label)}</a>`;
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

/**
 * @param {{ activeId?: string, pageTitle?: string, pageSubtitle?: string, subnav?: Array<{href:string,label:string}>, activeSubHref?: string }} opts
 */
export function renderDocHeader(opts = {}) {
  const { activeId, pageTitle, pageSubtitle, subnav, activeSubHref } = opts;
  const mapped = activeId;
  const primary = PRIMARY_NAV.map((item) => renderNavItem(item, mapped)).join('');

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
