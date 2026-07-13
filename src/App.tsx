import { useEffect } from 'react';

/** Old React Content Doc / Export are parked — work happens on the HTML boards. */
export default function App() {
  useEffect(() => {
    window.location.replace('/graphic-request-brief.html');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0D546B',
        color: '#e2e8f0',
        fontFamily: '"Be Vietnam", Inter, Arial, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ marginBottom: '1rem', color: '#b8d4e0' }}>Redirecting to Creative Brief…</p>
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <a href="/graphic-request-brief.html" style={{ color: '#27E6FA' }}>
            Creative Brief
          </a>
          <a href="/medvirtual-brand-guide.html" style={{ color: '#27E6FA' }}>
            Brand Guide
          </a>
          <a href="/real-people-assets.html" style={{ color: '#27E6FA' }}>
            RP Assets
          </a>
        </p>
      </div>
    </div>
  );
}
