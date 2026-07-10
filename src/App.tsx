import { useEffect } from 'react';

/** Old React Content Doc / Export are parked — work happens on the HTML boards. */
export default function App() {
  useEffect(() => {
    window.location.replace('/facebook-ad-copy.html');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>Redirecting to Ad Copy…</p>
        <p style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          <a href="/facebook-ad-copy.html" style={{ color: '#5eead4' }}>
            Ad Copy
          </a>
          <a href="/template-test-board.html" style={{ color: '#5eead4' }}>
            Template Tests
          </a>
          <a href="/image-variation-review.html" style={{ color: '#5eead4' }}>
            Image Review
          </a>
          <a href="/asset-hub.html" style={{ color: '#5eead4' }}>
            Raw Assets
          </a>
        </p>
      </div>
    </div>
  );
}
