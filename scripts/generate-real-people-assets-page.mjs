/**
 * Real People Assets — download library for graphics / video / AI reference.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  SYNTHETIC_VIDEO_HANDOFF,
  SYNTHETIC_VIDEO_RECOMMENDED,
  TALENT,
  MONDAY_REAL_PEOPLE_BATCH,
  META_AD_PACKAGES,
  AI_VIDEO_CONCEPTS,
  AI_VIDEO_FORMATS,
  metaAdPackageText,
  talentById,
  SOURCE_CHECKED_AT,
} from './real-people-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CATALOG = path.join(PUBLIC, 'exports', 'real-people', 'real-people-assets-catalog.json');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG)) return { people: [], masterZip: null };
  return JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
}

function statusPills(st = {}) {
  const rows = [
    ['Public still approved', !!st.publicStillApproved],
    ['Static ad approved', !!st.staticAdApproved],
    ['Synthetic animation approval needed', !!st.syntheticAnimationApprovalNeeded],
    ['Real video requested', !!st.realVideoRequested],
    ['Final creative approved', !!st.finalCreativeApproved],
  ];
  return rows
    .map(
      ([label, on]) =>
        `<span class="status ${on ? (label.includes('needed') ? 'status-warn' : 'status-on') : 'status-off'}">${esc(label)}</span>`,
    )
    .join('');
}

function dl(href, label) {
  if (!href) return `<span class="dl disabled">${esc(label)}</span>`;
  return `<a class="dl" href="${esc(href)}" download>${esc(label)}</a>`;
}

const THUMB_LABELS = {
  cleanMaster: 'Master',
  profile11: '1:1',
  feed45: '4:5',
  vertical: '9:16',
  aiReference: 'AI ref',
};

function renderPerson(t, catPerson) {
  const slug = t.assetSlug || t.id;
  const files = catPerson?.files || {};
  const notes = t.assetNotes || {};
  const limits = catPerson?.limitations || [];
  const src = files.original || files.cleanMaster;
  return `<article class="asset-card" id="asset-${esc(slug)}">
    <div class="asset-card__media">
      <button type="button" class="preview-hit media-hit" data-preview="${esc(files.profile11?.path || t.imagePath)}" aria-label="Preview ${esc(t.firstName)} profile">
        <img src="${esc(files.profile11?.path || t.imagePath)}" alt="${esc(t.fullPublicName)} — clean profile crop" width="320" height="320" loading="lazy" decoding="async" />
      </button>
    </div>
    <div class="asset-card__body">
      <h3>${esc(t.firstName)} <span class="muted">${esc(t.fullPublicName)}</span></h3>
      <p class="role">${esc(t.title)}</p>
      <p class="meta"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Talent Pool profile</a> · source checked ${esc(t.sourceCheckedAt || SOURCE_CHECKED_AT)}</p>
      <dl class="facts">
        <div><dt>Original</dt><dd>${src ? `${esc(src.width)}×${esc(src.height)} · ${esc(src.format)} · ${esc(src.sizeLabel)}` : 'See folder'}</dd></div>
        <div><dt>Recommended usage</dt><dd>${esc(notes.recommendedUsage || '—')}</dd></div>
        <div><dt>Crop quality</dt><dd>${esc(notes.cropQuality || '—')}</dd></div>
      </dl>
      ${limits.length ? `<p class="limit">${limits.map(esc).join(' ')}</p>` : ''}
      <div class="status-row">${statusPills(t.approvalStatus)}</div>
      <div class="dl-row">
        ${dl(files.original?.path, 'Original')}
        ${dl(files.cleanMaster?.path, 'Clean master')}
        ${dl(files.profile11?.path, '1:1')}
        ${dl(files.feed45?.path, '4:5')}
        ${dl(files.vertical?.path, '9:16 ref')}
        ${dl(files.aiReference?.path, 'AI reference')}
        ${dl(catPerson?.personZip, 'Download all for this person')}
      </div>
      <div class="thumb-grid">
        ${['cleanMaster', 'profile11', 'feed45', 'vertical', 'aiReference']
          .filter((k) => files[k])
          .map(
            (k) =>
              `<button type="button" class="thumb preview-hit" data-preview="${esc(files[k].path)}" aria-label="Preview ${esc(THUMB_LABELS[k] || k)}">
                <span class="thumb-frame"><img src="${esc(files[k].path)}" alt="" width="120" height="120" loading="lazy" /></span>
                <span class="thumb-label">${esc(THUMB_LABELS[k] || k)}</span>
               </button>`,
          )
          .join('')}
      </div>
      <p class="preview-hint">Click a square to preview full size. Use the buttons above to download files.</p>
    </div>
  </article>`;
}

function renderPrimaryParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p class="copy-primary__p">${esc(p)}</p>`)
    .join('');
}

function renderExamples(cat) {
  return `<div class="example-grid">${MONDAY_REAL_PEOPLE_BATCH.map((row) => {
    const pkg = META_AD_PACKAGES.find((x) => x.talentId === row.talentId);
    const t = talentById(row.talentId);
    const slug = t.assetSlug || t.id;
    const person = (cat.people || []).find((p) => p.slug === slug || p.id === t.id);
    const raw = person?.files?.cleanMaster?.path || person?.files?.original?.path || t.imagePath;
    const ad45 = `/assets/real-people/${slug}/ad-treatment-c-4x5.png`;
    const ad11 = `/assets/real-people/${slug}/ad-treatment-c-1x1.png`;
    const ad916 = `/assets/real-people/${slug}/ad-treatment-c-9x16.png`;
    const copyText = metaAdPackageText(pkg);
    return `<article class="example-card">
      <div class="example-card__arts">
        <button type="button" class="preview-hit art-45" data-preview="${esc(ad45)}" aria-label="Preview ${esc(t.firstName)} 4:5">
          <img src="${esc(ad45)}" alt="${esc(t.firstName)} 4:5 example" width="432" height="540" loading="lazy" />
          <span>4:5</span>
        </button>
        <button type="button" class="preview-hit art-11" data-preview="${esc(ad11)}" aria-label="Preview ${esc(t.firstName)} 1:1">
          <img src="${esc(ad11)}" alt="${esc(t.firstName)} 1:1 example" width="320" height="320" loading="lazy" />
          <span>1:1</span>
        </button>
      </div>
      <div class="example-card__meta">
        <div class="example-card__who">
          <h3>${esc(t.firstName)}</h3>
          <p class="role">${esc(t.title)}</p>
          <p class="angle">${esc(pkg.creativeAngle || row.angle)}</p>
        </div>
        <p class="hook">${esc(pkg.onImageHook)}</p>
        <p class="support-line">${esc(pkg.supportingLine)}</p>
        <div class="copy-panel">
          <div class="copy-block">
            <span class="copy-label">Primary text</span>
            <div class="copy-primary">${renderPrimaryParagraphs(pkg.primaryText)}</div>
          </div>
          <div class="copy-meta-grid">
            <div class="copy-block">
              <span class="copy-label">Headline</span>
              <p class="copy-val">${esc(pkg.headline)}</p>
            </div>
            <div class="copy-block">
              <span class="copy-label">Description</span>
              <p class="copy-val">${esc(pkg.description)}</p>
            </div>
            <div class="copy-block">
              <span class="copy-label">CTA</span>
              <p class="copy-val">${esc(pkg.cta)}</p>
            </div>
            <div class="copy-block">
              <span class="copy-label">Alternate hook</span>
              <p class="copy-val alt-hook">${esc(pkg.alternateHook)}</p>
            </div>
          </div>
        </div>
        <div class="dl-row compact">
          <a class="dl" href="${esc(raw)}" download>Raw photo</a>
          <a class="dl" href="${esc(ad45)}" download>4:5 PNG</a>
          <a class="dl" href="${esc(ad11)}" download>1:1 PNG</a>
          <a class="dl" href="${esc(ad916)}" download>9:16 PNG</a>
          <button type="button" class="copy-btn primary-copy" data-copy="${esc(copyText)}">Copy full Meta package</button>
        </div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function renderVideoConcepts() {
  return `<div class="video-grid">${AI_VIDEO_CONCEPTS.map((v) => {
    const t = talentById(v.talentId);
    return `<article class="video-card">
      <header class="video-card__head">
        <h3>${esc(v.title)}</h3>
        <div class="video-meta">
          <span>${esc(v.duration)}</span>
          <span>${esc(v.format)}</span>
        </div>
        <p class="video-hook">${esc(v.openingHook)}</p>
      </header>
      <ol class="storyboard">
        ${v.scenes
          .map(
            (s) => `<li class="story-beat">
          <div class="story-beat__time">${esc(s.time)}</div>
          <div class="story-beat__body">
            <strong>${esc(s.label)}</strong>
            <p>${esc(s.action)}</p>
            <p class="story-ost"><span>On-screen</span> ${esc(s.onScreen).replace(/\n/g, ' · ')}</p>
          </div>
        </li>`,
          )
          .join('')}
      </ol>
      <div class="video-block">
        <span class="copy-label">Voiceover / caption</span>
        <p>${esc(v.narrator)}</p>
      </div>
      <div class="video-block final-frame">
        <span class="copy-label">Final frame</span>
        <p>${v.finalFrame.map((line) => esc(line)).join('<br />')}</p>
      </div>
      <div class="video-block">
        <span class="copy-label">Production notes · ${esc(t.firstName)}</span>
        <ul>${v.productionNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function renderVideoFormats() {
  return `<div class="format-grid">${AI_VIDEO_FORMATS.map(
    (f) => `<article class="format-card${f.recommended ? ' format-card--rec' : ''}">
      ${f.recommended ? '<p class="format-rec">Recommended first AI-video test</p>' : ''}
      <h3>${esc(f.title)}</h3>
      <p class="format-badge">${esc(f.badge)}</p>
      <ul>${f.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    </article>`,
  ).join('')}</div>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 3rem; }
  .hero { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.1rem 1.2rem; margin-bottom: 0.75rem; }
  .hero h2 { font-size: 1.15rem; margin-bottom: 0.35rem; }
  .hero p { color: #cbd5e1; font-size: 0.88rem; max-width: 68ch; }
  .top-actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.75rem 0; }
  .dl, .copy-btn {
    display: inline-block; font-size: 0.74rem; font-weight: 700; padding: 0.4rem 0.65rem; border-radius: 7px;
    text-decoration: none; border: 1px solid #99f6e4; background: #f0fdfa; color: #0f766e; cursor: pointer;
  }
  .dl:hover, .copy-btn:hover { background: #ccfbf1; }
  .dl.primary, .copy-btn.primary-copy { background: #0d9488; color: #fff; border-color: #0d9488; }
  .dl.primary:hover, .copy-btn.primary-copy:hover { background: #0f766e; }
  .dl.disabled { opacity: 0.45; pointer-events: none; }
  .section { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.95rem 1.05rem; margin-bottom: 0.7rem; }
  .section > h2 { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #0f172a; margin-bottom: 0.35rem; }
  .section > .lede { font-size: 0.88rem; color: #475569; margin-bottom: 0.85rem; max-width: 72ch; }

  .example-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .example-card {
    border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.85rem; background: #f8fafc;
    display: grid; grid-template-columns: minmax(220px, 320px) 1fr; gap: 0.95rem; align-items: start;
  }
  @media (max-width: 860px) {
    .example-card { grid-template-columns: 1fr; }
  }
  .example-card__arts {
    display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 0.45rem; align-items: end;
  }
  .preview-hit {
    padding: 0; border: 0; background: transparent; cursor: zoom-in; display: block; text-align: left;
  }
  .example-card__arts .preview-hit {
    position: relative; border-radius: 8px; overflow: hidden; background: #0f172a; border: 1px solid #e2e8f0;
  }
  .example-card__arts .preview-hit img {
    width: 100%; height: auto; display: block; vertical-align: top;
  }
  .art-45 { aspect-ratio: 4 / 5; }
  .art-11 { aspect-ratio: 1 / 1; }
  .art-45 img, .art-11 img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .example-card__arts .preview-hit span {
    position: absolute; left: 0.35rem; bottom: 0.35rem; font-size: 0.62rem; font-weight: 800;
    color: #fff; background: rgba(15,23,42,0.72); padding: 0.12rem 0.35rem; border-radius: 4px;
  }
  .example-card__who h3 { font-size: 1.15rem; font-weight: 800; color: #0f172a; }
  .example-card__meta .role { font-size: 0.9rem; color: #334155; font-weight: 650; margin: 0.15rem 0 0.25rem; }
  .example-card__meta .angle {
    display: inline-block; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.02em;
    color: #0f766e; background: #ccfbf1; border: 1px solid #99f6e4; border-radius: 999px;
    padding: 0.18rem 0.55rem; margin-bottom: 0.55rem;
  }
  .example-card__meta .hook {
    font-size: 1.02rem; font-weight: 800; color: #0f172a; line-height: 1.3;
    margin: 0.15rem 0 0.35rem; max-width: 36ch;
  }
  .support-line { font-size: 0.8rem; color: #64748b; font-weight: 600; margin-bottom: 0.65rem; }
  .copy-panel {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.7rem 0.8rem; margin-bottom: 0.65rem;
  }
  .copy-label {
    display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.04em; color: #0d9488; margin-bottom: 0.25rem;
  }
  .copy-block + .copy-block { margin-top: 0.55rem; }
  .copy-primary__p { font-size: 0.88rem; color: #1e293b; margin: 0 0 0.45rem; max-width: 62ch; }
  .copy-primary__p:last-child { margin-bottom: 0; }
  .copy-meta-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem 0.75rem; margin-top: 0.7rem;
    padding-top: 0.65rem; border-top: 1px solid #e2e8f0;
  }
  @media (max-width: 640px) { .copy-meta-grid { grid-template-columns: 1fr; } }
  .copy-val { font-size: 0.86rem; color: #0f172a; font-weight: 650; }
  .copy-val.alt-hook { font-weight: 750; color: #134e4a; }
  .dl-row.compact { gap: 0.35rem; }

  .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
  @media (max-width: 800px) { .video-grid { grid-template-columns: 1fr; } }
  .video-card {
    border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem 0.85rem; background: #f8fafc;
  }
  .video-card__head h3 { font-size: 1rem; font-weight: 800; color: #0f172a; }
  .video-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.35rem 0 0.45rem; }
  .video-meta span {
    font-size: 0.68rem; font-weight: 750; color: #334155; background: #e2e8f0;
    border-radius: 999px; padding: 0.15rem 0.5rem;
  }
  .video-hook {
    font-size: 0.92rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin-bottom: 0.65rem;
  }
  .storyboard { list-style: none; display: grid; gap: 0.45rem; margin-bottom: 0.7rem; }
  .story-beat {
    display: grid; grid-template-columns: 4.4rem 1fr; gap: 0.5rem; align-items: start;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.45rem 0.5rem;
  }
  .story-beat__time {
    font-size: 0.68rem; font-weight: 800; color: #0f766e; background: #ccfbf1;
    border-radius: 6px; padding: 0.25rem 0.35rem; text-align: center; line-height: 1.2;
  }
  .story-beat__body strong { display: block; font-size: 0.76rem; color: #0f172a; margin-bottom: 0.12rem; }
  .story-beat__body p { font-size: 0.8rem; color: #334155; }
  .story-ost { margin-top: 0.25rem !important; color: #0f172a !important; font-weight: 650; }
  .story-ost span {
    display: inline-block; font-size: 0.62rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.03em; color: #0d9488; margin-right: 0.25rem;
  }
  .video-block { margin-top: 0.55rem; }
  .video-block p, .video-block li { font-size: 0.82rem; color: #1e293b; }
  .video-block ul { padding-left: 1.05rem; }
  .video-block li { margin: 0.15rem 0; }
  .final-frame {
    background: #0f172a; color: #f8fafc; border-radius: 8px; padding: 0.55rem 0.65rem;
  }
  .final-frame .copy-label { color: #5eead4; }
  .final-frame p { color: #f8fafc; font-weight: 750; font-size: 0.9rem; line-height: 1.35; }

  .format-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 0.85rem; }
  @media (max-width: 800px) { .format-grid { grid-template-columns: 1fr; } }
  .format-card {
    border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 0.8rem; background: #fff;
  }
  .format-card--rec {
    border-color: #14b8a6; box-shadow: 0 0 0 2px rgba(13,148,136,0.12); background: #f0fdfa;
  }
  .format-rec {
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #0f766e; margin-bottom: 0.35rem;
  }
  .format-card h3 { font-size: 0.92rem; font-weight: 800; color: #0f172a; margin-bottom: 0.2rem; }
  .format-badge { font-size: 0.78rem; color: #0d9488; font-weight: 700; margin-bottom: 0.45rem; }
  .format-card ul { padding-left: 1.05rem; }
  .format-card li { font-size: 0.8rem; color: #334155; margin: 0.18rem 0; }

  .asset-card { display: grid; grid-template-columns: 180px 1fr; gap: 0.85rem; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; margin-bottom: 0.75rem; }
  @media (max-width: 720px) { .asset-card { grid-template-columns: 1fr; } }
  .asset-card__media { background: #0f172a; }
  .media-hit { width: 100%; }
  .media-hit img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
  .asset-card__body { padding: 0.75rem 0.85rem 0.9rem; }
  .muted { font-size: 0.75rem; color: #64748b; font-weight: 600; }
  .role { font-size: 0.9rem; font-weight: 700; margin: 0.15rem 0; }
  .meta { font-size: 0.76rem; color: #64748b; margin-bottom: 0.45rem; }
  .meta a { color: #0d9488; font-weight: 700; text-decoration: none; }
  .facts { display: grid; gap: 0.25rem; margin-bottom: 0.5rem; }
  .facts dt { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
  .facts dd { font-size: 0.8rem; color: #334155; }
  .limit { font-size: 0.76rem; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 0.35rem 0.5rem; margin-bottom: 0.4rem; }
  .status-row { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.4rem 0; }
  .status { font-size: 0.65rem; font-weight: 750; padding: 0.18rem 0.4rem; border-radius: 5px; }
  .status-on { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .status-warn { background: #fff7ed; color: #c2410c; border: 1px solid #fdba74; }
  .status-off { background: #f8fafc; color: #94a3b8; border: 1px solid #e2e8f0; }
  .dl-row { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.45rem; }

  .thumb-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.45rem;
    margin-top: 0.65rem;
  }
  @media (max-width: 700px) {
    .thumb-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
  .thumb {
    display: grid; gap: 0.25rem; justify-items: stretch;
    padding: 0; border: 0; background: transparent; cursor: zoom-in; text-align: center;
  }
  .thumb-frame {
    display: block; aspect-ratio: 1 / 1; border-radius: 8px; overflow: hidden;
    border: 1px solid #e2e8f0; background: #0f172a;
  }
  .thumb-frame img {
    width: 100%; height: 100%; object-fit: cover; object-position: center center; display: block;
  }
  .thumb-label { font-size: 0.65rem; font-weight: 750; color: #64748b; }
  .preview-hint { font-size: 0.72rem; color: #64748b; margin-top: 0.4rem; }

  .lightbox {
    position: fixed; inset: 0; background: rgba(15,23,42,0.9); display: none;
    align-items: center; justify-content: center; z-index: 80; padding: 1rem;
  }
  .lightbox.open { display: flex; }
  .lightbox img { max-width: min(100%, 920px); max-height: 92vh; width: auto; height: auto; border-radius: 10px; background: #0f172a; }
  .lightbox-close {
    position: absolute; top: 1rem; right: 1rem; background: #fff; border: 0; border-radius: 8px;
    font-weight: 800; padding: 0.45rem 0.7rem; cursor: pointer;
  }
  .synth { padding-left: 1.1rem; }
  .synth li { font-size: 0.86rem; margin: 0.28rem 0; color: #1e293b; }
  .synth-rec {
    margin-top: 0.7rem; font-size: 0.88rem; font-weight: 750; color: #0f766e;
    background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 0.55rem 0.7rem;
  }
  .toast { position: fixed; bottom: 1rem; right: 1rem; background: #0f172a; color: #fff; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.78rem; opacity: 0; transition: opacity .2s; z-index: 40; }
  .toast.show { opacity: 1; }
`;

const cat = loadCatalog();
const bySlug = Object.fromEntries((cat.people || []).map((p) => [p.slug, p]));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People Assets — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'real-people-assets',
    pageTitle: 'Real People Assets',
    pageSubtitle: 'Real Talent Pool photos, Meta-ready copy, AI video concepts, and downloadable crops.',
  })}
  <div class="wrap">
    <header class="hero">
      <h2>Real People Assets</h2>
      <p>Four pain-first profile ads with Meta copy packages, then short AI-video storyboards for Jin. Click any image to preview; download assets below.</p>
      <div class="top-actions">
        ${cat.masterZip ? `<a class="dl primary" href="${esc(cat.masterZip)}" download>Download all Real People assets</a>` : '<span class="dl disabled">Master ZIP unavailable</span>'}
        <a class="dl" href="/real-people-creative.html">Creative details</a>
      </div>
    </header>

    <section class="section" id="examples">
      <h2>Ad examples</h2>
      <p class="lede">Each card shows the pain the ad addresses, why this person is relevant, Meta-ready copy, and downloadable Treatment C art.</p>
      ${renderExamples(cat)}
    </section>

    <section class="section" id="ai-video">
      <h2>AI Video Concepts for Jin</h2>
      <p class="lede">These concepts turn the static profile ads into short 10–15 second videos. The recommended first version uses motion, captions, licensed B-roll, and a neutral narrator. Synthetic talking-head or lip-sync versions require separate approval.</p>
      ${renderVideoConcepts()}
      ${renderVideoFormats()}
    </section>

    <section class="section" id="library">
      <h2>Downloads by person</h2>
      <p class="lede">Source photos and production crops. Thumbnails are square previews — click to open full size.</p>
      ${TALENT.map((t) => renderPerson(t, bySlug[t.assetSlug || t.id])).join('')}
    </section>

    <section class="section" id="synthetic">
      <h2>Synthetic Video Rules</h2>
      <ul class="synth">${SYNTHETIC_VIDEO_HANDOFF.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <p class="synth-rec">${esc(SYNTHETIC_VIDEO_RECOMMENDED)}</p>
    </section>
  </div>
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">
    <button type="button" class="lightbox-close" id="lightbox-close">Close</button>
    <img id="lightbox-img" alt="" />
  </div>
  <div class="toast" id="toast">Copied</div>
  <script>
    const toast = document.getElementById('toast');
    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          toast.textContent = 'Copied Meta package';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 1100);
        } catch (e) {}
      });
    });
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    function openPreview(src) {
      lbImg.src = src;
      lbImg.alt = 'Full-size preview';
      lb.classList.add('open');
    }
    function closePreview() {
      lb.classList.remove('open');
      lbImg.removeAttribute('src');
    }
    document.querySelectorAll('[data-preview]').forEach((btn) => {
      btn.addEventListener('click', () => openPreview(btn.getAttribute('data-preview')));
    });
    document.getElementById('lightbox-close').addEventListener('click', closePreview);
    lb.addEventListener('click', (e) => { if (e.target === lb) closePreview(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePreview(); });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'real-people-assets.html'), html);
console.log('Wrote public/real-people-assets.html');
