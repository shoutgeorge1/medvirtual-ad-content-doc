import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

/** Keep in sync with scripts/shared-doc-header.mjs */
const BRAND = {
  mark: 'MV',
  title: 'Facebook Ad Content Doc',
  tagline: 'MedVirtual · Primary text · templates · crops',
  homeHref: '/facebook-ad-copy.html',
};

const PRIMARY_NAV = [
  { href: '/facebook-ad-copy.html', label: 'Ad Copy' },
  { href: '/template-test-board.html', label: 'Template Tests' },
  { href: '/image-variation-review.html', label: 'Image Review' },
  { href: '/asset-hub.html', label: 'Raw Assets' },
  { href: '/meta-launch-build-pack.html', label: 'Meta Launch' },
];

export function Layout() {
  const { pathname } = useLocation();
  const pageTitle =
    pathname.startsWith('/export')
      ? 'Export PNGs'
      : pathname.startsWith('/editor')
        ? 'Concept Editor'
        : 'Content Doc';
  const pageSubtitle =
    pathname.startsWith('/export')
      ? 'Download composed ad PNGs for Meta. For raw video sources, use Raw Assets.'
      : pathname.startsWith('/editor')
        ? 'Edit copy and layout for one concept.'
        : 'Parked React surface — use Ad Copy and Template Tests.';

  return (
    <div className="app-shell">
      <header className="doc-header">
        <div className="doc-header__row">
          <a className="doc-header__brand" href={BRAND.homeHref}>
            <span className="doc-header__mark">{BRAND.mark}</span>
            <div>
              <h1 className="doc-header__title">{BRAND.title}</h1>
              <p className="doc-header__tagline">{BRAND.tagline}</p>
            </div>
          </a>
          <nav className="doc-nav" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="doc-header__page">
          <h2 className="doc-header__page-title">{pageTitle}</h2>
          <p className="doc-header__page-sub">{pageSubtitle}</p>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
