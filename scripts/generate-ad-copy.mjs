/**
 * Facebook Ad Copy — Meta-ready packages for the 4 production concepts only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { PRODUCTION_CONCEPTS, FIRST_BATCH_COUNT } from './first-test-batch-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function packageText(c) {
  return [
    `ON-IMAGE HEADLINE: ${c.headline}`,
    `SUPPORT: ${c.support}`,
    '',
    `PRIMARY TEXT:`,
    c.primaryText,
    '',
    `META HEADLINE: ${c.metaHeadline}`,
    `DESCRIPTION: ${c.description}`,
    `CTA: ${c.cta}`,
  ].join('\n');
}

function renderPrimary(text) {
  return text
    .split(/\n\n+/)
    .map((p) => `<p class="primary-p">${esc(p)}</p>`)
    .join('');
}

function renderCard(c, index) {
  const pkg = packageText(c);
  return `<article class="card">
    <div class="card-head">
      <span class="num">${index + 1}</span>
      <h3>${esc(c.name)}</h3>
      <button type="button" class="copy-btn" data-copy="${esc(pkg)}">Copy Meta package</button>
    </div>
    <div class="fields">
      <div class="field">
        <span class="label">On-image headline</span>
        <p class="val headline">${esc(c.headline)}</p>
      </div>
      <div class="field">
        <span class="label">Support</span>
        <p class="val">${esc(c.support)}</p>
      </div>
      <div class="field field-primary">
        <span class="label">Primary text</span>
        <div class="primary">${renderPrimary(c.primaryText)}</div>
      </div>
      <div class="meta-row">
        <div class="field">
          <span class="label">Meta headline</span>
          <p class="val">${esc(c.metaHeadline)}</p>
        </div>
        <div class="field">
          <span class="label">Description</span>
          <p class="val">${esc(c.description)}</p>
        </div>
        <div class="field">
          <span class="label">CTA</span>
          <p class="val cta">${esc(c.cta)}</p>
        </div>
      </div>
    </div>
  </article>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 0.95rem 1.1rem; margin-bottom: 0.85rem;
  }
  .banner h2 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.3rem; }
  .banner p { font-size: 0.88rem; color: #cbd5e1; }
  .banner a { color: #5eead4; font-weight: 700; text-decoration: none; }
  .banner-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.65rem; }
  .banner-meta span {
    font-size: 0.72rem; font-weight: 750; padding: 0.28rem 0.55rem; border-radius: 6px;
    background: rgba(13,148,136,0.25); border: 1px solid rgba(94,234,212,0.35); color: #99f6e4;
  }
  .cards { display: grid; gap: 0.75rem; }
  .card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1rem;
  }
  .card-head {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
    padding-bottom: 0.55rem; border-bottom: 1px solid #e2e8f0;
  }
  .num {
    width: 1.85rem; height: 1.85rem; border-radius: 7px; background: #0d9488; color: #fff;
    font-weight: 800; font-size: 0.88rem; display: grid; place-items: center;
  }
  .card-head h3 { flex: 1 1 auto; font-size: 0.92rem; font-weight: 800; color: #0f172a; }
  .copy-btn {
    font-size: 0.74rem; font-weight: 750; color: #fff; background: #0d9488;
    border: 0; border-radius: 7px; padding: 0.4rem 0.65rem; cursor: pointer;
  }
  .copy-btn:hover { background: #0f766e; }
  .copy-btn.done { background: #134e4a; }
  .fields { display: grid; gap: 0.65rem; }
  .label {
    display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.04em; color: #0d9488; margin-bottom: 0.2rem;
  }
  .val { font-size: 0.92rem; color: #1e293b; font-weight: 650; }
  .val.headline { font-size: 1.12rem; font-weight: 800; color: #0f172a; line-height: 1.25; }
  .val.cta {
    display: inline-block; background: #0d9488; color: #fff; font-size: 0.75rem;
    font-weight: 800; padding: 0.25rem 0.55rem; border-radius: 6px;
  }
  .primary-p { font-size: 0.9rem; color: #1e293b; margin: 0 0 0.4rem; white-space: pre-wrap; }
  .primary-p:last-child { margin-bottom: 0; }
  .meta-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.55rem;
    padding-top: 0.55rem; border-top: 1px solid #e2e8f0;
  }
  @media (max-width: 640px) { .meta-row { grid-template-columns: 1fr; } }
  .note {
    margin-top: 0.85rem; font-size: 0.82rem; color: #64748b; background: #fff;
    border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.7rem 0.85rem;
  }
`;

function main() {
  const cards = PRODUCTION_CONCEPTS.map((c, i) => renderCard(c, i)).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Facebook Ad Copy — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'copy',
    pageTitle: 'Facebook Ad Copy',
    pageSubtitle: `${FIRST_BATCH_COUNT} Meta packages · labeled fields · paste-ready`,
  })}
  <div class="wrap">
    <header class="banner">
      <h2>${FIRST_BATCH_COUNT} Meta copy packages</h2>
      <p>Matches the <a href="/graphic-request-brief.html">Graphic Brief</a>. Paste into Ads Manager.</p>
      <div class="banner-meta">
        <span>Primary text</span>
        <span>Headline</span>
        <span>Description</span>
        <span>CTA: Book a Demo</span>
      </div>
    </header>

    <div class="cards">${cards}</div>

    <p class="note">Brand: MedVirtual only — never MedVirtual.ai. “Starting at $10/hour” is on concept 4 only.</p>
  </div>
  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute('data-copy') || '');
          btn.textContent = 'Copied';
          btn.classList.add('done');
          setTimeout(() => { btn.textContent = 'Copy Meta package'; btn.classList.remove('done'); }, 1200);
        } catch (e) {}
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'facebook-ad-copy.html'), html);

  const md = `# Facebook Ad Copy — MedVirtual

${FIRST_BATCH_COUNT} Meta packages. Source: [Graphic Brief](https://medvirtual-ad-content-doc.vercel.app/graphic-request-brief.html)

${PRODUCTION_CONCEPTS.map((c, i) => `## ${i + 1}. ${c.name}

${packageText(c)}
`).join('\n')}
`;

  fs.writeFileSync(path.join(ROOT, 'facebook-ad-copy.md'), md);
  console.log(`Facebook copy: http://localhost:5173/facebook-ad-copy.html (${FIRST_BATCH_COUNT} packages)`);
}

main();
