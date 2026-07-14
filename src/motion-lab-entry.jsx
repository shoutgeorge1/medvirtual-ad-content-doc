import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { HookHumanComposition } from './remotion/compositions/HookHuman.jsx';
import { ChecklistComposition } from './remotion/compositions/Checklist.jsx';
import { ProblemPersonComposition } from './remotion/compositions/ProblemPerson.jsx';
import { PremiumOpsComposition } from './remotion/compositions/PremiumOps.jsx';
import { MOTION_DEFAULTS, STORAGE_KEYS, STATUSES } from './remotion/data/motionDefaults.js';
import './motion-lab.css';

const COMPOSITIONS = {
  'MV-HOOK-HUMAN-01': HookHumanComposition,
  'MV-CHECKLIST-01': ChecklistComposition,
  'MV-PROBLEM-PERSON-01': ProblemPersonComposition,
  'MV-PREMIUM-OPS-01': PremiumOpsComposition,
};

function loadMotionBatch() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.motionBatch);
    if (!raw) return structuredClone(MOTION_DEFAULTS);
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed?.concepts;
    if (!Array.isArray(list) || list.length !== 4) return structuredClone(MOTION_DEFAULTS);
    return list.map((c, i) => sanitizeMotion(c, MOTION_DEFAULTS[i]));
  } catch {
    return structuredClone(MOTION_DEFAULTS);
  }
}

function sanitizeMotion(c, fallback) {
  const base = { ...(fallback || {}), ...(c || {}) };
  base.bullets = Array.isArray(base.bullets)
    ? base.bullets.slice(0, 3).map((b) => String(b ?? '').replace(/<[^>]*>/g, ''))
    : fallback?.bullets || [];
  ['headline', 'headlineTwo', 'support', 'cta', 'internalNotes'].forEach((k) => {
    if (k in base) base[k] = String(base[k] ?? '').replace(/<[^>]*>/g, '');
  });
  if (!STATUSES.includes(base.status)) base.status = 'Draft';
  base.durationInFrames = Math.min(600, Math.max(240, Number(base.durationInFrames) || 300));
  return base;
}

function applyPromote(batch) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.promote);
    if (!raw) return batch;
    const { concept, motionTemplate } = JSON.parse(raw);
    if (!concept) return batch;
    const template = motionTemplate || concept.motionTemplate;
    const idx = batch.findIndex((m) => m.compositionId === template);
    if (idx < 0) return batch;
    const next = [...batch];
    next[idx] = {
      ...next[idx],
      conceptId: concept.id,
      headline: concept.layout === 'EditorialTalentLayout' ? `Meet ${concept.headline}` : concept.headline,
      support: concept.support,
      bullets: concept.bullets,
      cta: concept.cta,
      imageSrc: concept.imageSrc,
      role: concept.role,
      audience: concept.audience,
      theme: concept.theme,
      lane: concept.lane,
      candidateName: concept.candidateName,
      status: concept.status || next[idx].status,
      internalNotes: `Promoted from ${concept.id}`,
    };
    // For hook composition, try to split pain headline
    if (template === 'MV-HOOK-HUMAN-01' && concept.headline?.includes('.')) {
      const parts = concept.headline.split('.').map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        next[idx].headline = `${parts[0]}.`;
        next[idx].headlineTwo = `${parts[1]}.`;
      }
    }
    localStorage.removeItem(STORAGE_KEYS.promote);
    return next;
  } catch {
    return batch;
  }
}

function MotionCard({ item, index, onChange }) {
  const playerRef = useRef(null);
  const Component = COMPOSITIONS[item.compositionId];
  const duration = item.durationInFrames || 300;
  const inputProps = useMemo(
    () => ({
      headline: item.headline,
      headlineTwo: item.headlineTwo,
      support: item.support,
      bullets: item.bullets,
      cards: item.cards || item.bullets,
      cta: item.cta,
      imageSrc: item.imageSrc,
      candidateName: item.candidateName,
      role: item.role,
      animationIntensity: item.animationIntensity || 'standard',
      showSafeZones: Boolean(item.showSafeZones),
    }),
    [item],
  );

  const bind = (key, value) => onChange(index, { [key]: value });

  const exportStill = async (kind) => {
    const player = playerRef.current;
    if (!player) return;
    let target = 0;
    if (kind === 'middle') target = Math.floor(duration / 2);
    if (kind === 'end') target = Math.max(0, duration - 15);
    player.seekTo(target);
    await new Promise((r) => setTimeout(r, 120));
    const el = document.getElementById(`mcl-player-${index}`)?.querySelector('div');
    if (!window.htmlToImage || !el) {
      alert('Still export unavailable — use Remotion render for production frames.');
      return;
    }
    try {
      const dataUrl = await window.htmlToImage.toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        style: { width: '1080px', height: '1920px', transform: 'none' },
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `medvirtual-motion-${item.compositionId.toLowerCase()}-${kind}-1080x1920.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Still export failed');
    }
  };

  if (!Component) return null;

  return (
    <article className="mcl-card">
      <header className="mcl-card__head">
        <div className="mcl-num">Motion {index + 1}</div>
        <h2>{item.name}</h2>
        <p className="mcl-id">{item.compositionId}</p>
        <span className="mcl-status" data-status={item.status}>
          {item.status}
        </span>
      </header>

      <div className="mcl-player-wrap" id={`mcl-player-${index}`}>
        <Player
          ref={playerRef}
          component={Component}
          inputProps={inputProps}
          durationInFrames={duration}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          style={{ width: '100%', aspectRatio: '1080 / 1920', borderRadius: 8 }}
          controls
          loop
          autoPlay={false}
          clickToPlay
          initiallyMuted
          doubleClickToFullscreen={false}
        />
      </div>

      <div className="mcl-controls">
        <label>
          Status
          <select value={item.status} onChange={(e) => bind('status', e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Animation intensity
          <select
            value={item.animationIntensity || 'standard'}
            onChange={(e) => bind('animationIntensity', e.target.value)}
          >
            <option value="subtle">Subtle</option>
            <option value="standard">Standard</option>
            <option value="energetic">Energetic</option>
          </select>
        </label>
        <label>
          Duration (frames @ 30fps)
          <input
            type="range"
            min={240}
            max={600}
            value={duration}
            onChange={(e) => bind('durationInFrames', Number(e.target.value))}
          />
          <span className="mcl-hint">
            {(duration / 30).toFixed(1)}s · max 20s
          </span>
        </label>
        <label className="mcl-check">
          <input
            type="checkbox"
            checked={Boolean(item.showSafeZones)}
            onChange={(e) => bind('showSafeZones', e.target.checked)}
          />
          Show safe-zone guides (preview only)
        </label>
        <label>
          Headline
          <input value={item.headline || ''} onChange={(e) => bind('headline', e.target.value)} />
        </label>
        <label>
          Headline line 2
          <input value={item.headlineTwo || ''} onChange={(e) => bind('headlineTwo', e.target.value)} />
        </label>
        <label>
          Support
          <input value={item.support || ''} onChange={(e) => bind('support', e.target.value)} />
        </label>
        {[0, 1, 2].map((i) => (
          <label key={i}>
            Bullet {i + 1}
            <input
              value={(item.bullets || [])[i] || ''}
              onChange={(e) => {
                const bullets = [...(item.bullets || ['', '', ''])];
                bullets[i] = e.target.value;
                bind('bullets', bullets);
              }}
            />
          </label>
        ))}
        <label>
          CTA
          <input value={item.cta || ''} onChange={(e) => bind('cta', e.target.value)} />
        </label>
        <label>
          Image URL
          <input value={item.imageSrc || ''} onChange={(e) => bind('imageSrc', e.target.value)} />
        </label>
        <label>
          Internal notes
          <textarea
            rows={2}
            value={item.internalNotes || ''}
            onChange={(e) => bind('internalNotes', e.target.value)}
          />
        </label>
      </div>

      <div className="mcl-actions">
        <button type="button" onClick={() => playerRef.current?.play()}>
          Play
        </button>
        <button type="button" onClick={() => playerRef.current?.pause()}>
          Pause
        </button>
        <button
          type="button"
          onClick={() => {
            playerRef.current?.seekTo(0);
          }}
        >
          Restart
        </button>
        <button type="button" onClick={() => exportStill('first')}>
          Export first frame
        </button>
        <button type="button" onClick={() => exportStill('middle')}>
          Export mid frame
        </button>
        <button type="button" onClick={() => exportStill('end')}>
          Export end card
        </button>
        <button
          type="button"
          onClick={async () => {
            // Static cutdowns: capture player at first frame, then note resize targets
            await exportStill('first');
            alert(
              'Exported first-frame still (9:16). For 4:5 and 1:1 adaptations: crop the still in graphics or re-export from Creative Concept Lab after Promote.',
            );
          }}
        >
          Create Static Cutdown
        </button>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(JSON.stringify(item, null, 2));
          }}
        >
          Copy composition JSON
        </button>
        <a className="mcl-link" href="/creative-concept-lab.html">
          Return to Static
        </a>
        <a className="mcl-link" href="/video-production.html">
          Real People Video
        </a>
      </div>

      <details className="mcl-render">
        <summary>Open in Remotion Studio / render commands</summary>
        <pre>{`npm run remotion:studio
npm run remotion:render:${item.compositionId === 'MV-HOOK-HUMAN-01' ? 'hook-human' : item.compositionId === 'MV-CHECKLIST-01' ? 'checklist' : item.compositionId === 'MV-PROBLEM-PERSON-01' ? 'problem-person' : 'premium-ops'}

# Output lands in .local-masters/renders/ (gitignored)`}</pre>
      </details>
    </article>
  );
}

function MotionLabApp() {
  const [batch, setBatch] = useState(() => applyPromote(loadMotionBatch()));

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.motionBatch,
      JSON.stringify({ version: 1, savedAt: new Date().toISOString(), concepts: batch }),
    );
  }, [batch]);

  const onChange = useCallback((index, patch) => {
    setBatch((prev) => {
      const next = [...prev];
      next[index] = sanitizeMotion({ ...next[index], ...patch }, MOTION_DEFAULTS[index]);
      return next;
    });
  }, []);

  return (
    <div className="mcl-app">
      <header className="mcl-hero">
        <h1>Motion Concept Lab</h1>
        <p>Four short-form concepts. Simple motion, strong frames, production-ready structure.</p>
      </header>

      <div className="mcl-toolbar">
        <button
          type="button"
          className="primary"
          onClick={() => {
            if (confirm('Reset all four motion concepts to defaults?')) {
              setBatch(structuredClone(MOTION_DEFAULTS));
            }
          }}
        >
          Reset motion batch
        </button>
        <a className="mcl-btn" href="/creative-concept-lab.html">
          Static Concepts
        </a>
        <a className="mcl-btn" href="/ideas.html">
          Ideas Lab
        </a>
        <a className="mcl-btn" href="/competitors.html">
          Competitors
        </a>
      </div>

      <div className="mcl-grid">
        {batch.map((item, index) => (
          <MotionCard key={item.compositionId} item={item} index={index} onChange={onChange} />
        ))}
      </div>

      <section className="mcl-notes">
        <h2>Preview vs production render</h2>
        <p>
          Browser preview uses <code>@remotion/player</code> (always starts muted). Local MP4 renders use Remotion CLI
          into <code>.local-masters/renders/</code> — not Vercel.
        </p>
      </section>
    </div>
  );
}

const mount = document.getElementById('motion-lab-root');
if (mount) {
  createRoot(mount).render(
    <React.StrictMode>
      <MotionLabApp />
    </React.StrictMode>,
  );
}
