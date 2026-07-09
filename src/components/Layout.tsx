import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">MV</span>
          <div>
            <h1 className="app-header__title">Facebook Ad Content Doc</h1>
            <p className="app-header__tagline">MedVirtual · National Meta static ads</p>
          </div>
        </div>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Content Doc
          </NavLink>
          <NavLink to="/export" className={({ isActive }) => (isActive ? 'active' : '')}>
            Export PNGs
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
