import { useEffect } from 'react';

/** Old React Content Doc is parked — Studio is home for the HTML handoff. */
export default function App() {
  useEffect(() => {
    window.location.replace('/studio.html');
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
        <p style={{ marginBottom: '1rem', color: '#b8d4e0' }}>Opening Studio…</p>
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <a href="/studio.html" style={{ color: '#27E6FA' }}>
            Studio
          </a>
          <a href="/graphic-request-brief.html" style={{ color: '#27E6FA' }}>
            Brief
          </a>
          <a href="/ideas.html" style={{ color: '#27E6FA' }}>
            Ideas Lab
          </a>
        </p>
      </div>
    </div>
  );
}
