/**
 * Generate editable SaaS Prop template board (classy medical software look, no people).
 * npm run generate:saas-prop
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  SAAS_PROP_TEMPLATES,
  SAAS_PROP_META,
  SAAS_CTA_BANK,
  SAAS_EYEBROW_BANK,
  SAAS_SUPPORT_BANK,
} from './saas-prop-templates-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'saas-prop-templates.html');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAd(t) {
  const bullets = (t.bullets || [])
    .map(
      (b, i) =>
        `<li><span class="dot"></span><span class="btxt" data-bullet="${i}" contenteditable="true">${esc(b)}</span></li>`,
    )
    .join('');
  const aud = t.audiencePill
    ? `<span class="aud" data-field="audiencePill" contenteditable="true">${esc(t.audiencePill)}</span>`
    : '';

  return `
  <article class="ad" data-id="${esc(t.id)}" data-layout="${esc(t.layout)}">
    <img class="prop" src="${esc(t.art)}" alt="" />
    <div class="veil"></div>
    <div class="copy">
      <div class="top">
        <img class="logo" src="${esc(SAAS_PROP_META.logo)}" alt="MedVirtual" />
        ${aud}
      </div>
      <p class="eyebrow" data-field="eyebrow" contenteditable="true">${esc(t.eyebrow)}</p>
      <h2 class="headline" data-field="headline" contenteditable="true">${esc(t.headline)}</h2>
      <p class="support" data-field="support" contenteditable="true">${esc(t.support)}</p>
      <ul class="bullets">${bullets}</ul>
      <button type="button" class="cta"><span data-field="cta" contenteditable="true">${esc(t.cta)}</span></button>
    </div>
  </article>`;
}

function editorPanel(t) {
  const variantOpts = (t.variants || [])
    .map((v) => `<option value="${esc(v)}">${esc(v)}</option>`)
    .join('');
  return `
  <aside class="editor" data-editor-for="${esc(t.id)}">
    <h3>${esc(t.label)}</h3>
    <p class="note">${esc(t.notes)}</p>
    <p class="guard">${esc(SAAS_PROP_META.guardrail)}</p>
    <label>Fancy headline (pick a variant)
      <select data-bind="headlineVariant">
        <option value="">— keep current —</option>
        ${variantOpts}
      </select>
    </label>
    <label>Or write headline <textarea data-bind="headline" rows="2">${esc(t.headline)}</textarea></label>
    <label>Eyebrow <input data-bind="eyebrow" value="${esc(t.eyebrow)}" list="eyebrow-bank" /></label>
    <label>Support <textarea data-bind="support" rows="3">${esc(t.support)}</textarea></label>
    <label>Bullets (one per line) <textarea data-bind="bullets" rows="4">${esc((t.bullets || []).join('\n'))}</textarea></label>
    <label>CTA <input data-bind="cta" value="${esc(t.cta)}" list="cta-bank" /></label>
    <label>Audience pill <input data-bind="audiencePill" value="${esc(t.audiencePill || '')}" placeholder="e.g. DENTISTS!" /></label>
    <label>Prop art URL <input data-bind="art" value="${esc(t.art)}" /></label>
    <label>Upload prop
      <input type="file" accept="image/*" data-upload />
    </label>
    <button type="button" class="copy-json" data-copy>Copy JSON</button>
  </aside>`;
}

const CSS = `
${HEADER_CSS}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--mv-font); background: #070b14; color: #e2e8f0; }
.intro {
  padding: 1.25rem 2rem 0.85rem;
  border-bottom: 1px solid #1f2937;
  background: linear-gradient(120deg, #0b1624, #0d546b 140%);
}
.intro h1 { margin: 0 0 0.35rem; font-size: 1.4rem; color: #f8fafc; }
.intro p { margin: 0; font-size: 0.9rem; color: #cbd5e1; max-width: 72ch; line-height: 1.45; }
.intro .guard {
  margin-top: 0.65rem; font-size: 0.8rem; color: #67e8f9; font-weight: 600;
}
.banks {
  display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem;
}
.banks span {
  font-size: 0.68rem; font-weight: 700; padding: 0.22rem 0.5rem; border-radius: 999px;
  background: rgba(0,178,226,0.15); border: 1px solid rgba(0,178,226,0.35); color: #a5f3fc;
}
.stack { display: flex; flex-direction: column; gap: 2rem; padding: 1.5rem 2rem 3rem; }
.row {
  display: grid;
  grid-template-columns: minmax(320px, 540px) minmax(280px, 1fr);
  gap: 1.1rem; align-items: start;
}
@media (max-width: 960px) { .row { grid-template-columns: 1fr; } }
.frame {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 14px; padding: 0.7rem;
}
.frame .label {
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 0.45rem;
}
.frame .id { color: #67e8f9; font-family: ui-monospace, monospace; }

.ad {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background: #0b1c2c;
}
.ad .prop {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center right;
}
.ad .veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(7,11,20,0.88) 0%, rgba(7,11,20,0.72) 38%, rgba(7,11,20,0.2) 62%, rgba(7,11,20,0.05) 100%),
    linear-gradient(180deg, rgba(7,11,20,0.25) 0%, transparent 40%, rgba(7,11,20,0.35) 100%);
  pointer-events: none;
}
.ad .copy {
  position: relative; z-index: 2;
  height: 100%;
  padding: 7% 8%;
  display: flex; flex-direction: column;
  max-width: 54%;
  color: #f8fafc;
}
.top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.1rem; }
.logo { height: 1.35rem; width: auto; filter: brightness(1.05); }
.aud {
  display: inline-flex; background: rgba(13,84,107,0.92); color: #fff;
  font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em;
  padding: 0.28rem 0.65rem; border-radius: 999px;
}
.eyebrow {
  margin: 0 0 0.45rem; font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; color: #67e8f9;
}
.headline {
  margin: 0 0 0.65rem; font-size: clamp(1.15rem, 3.4vw, 1.55rem);
  line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: #fff;
}
.support {
  margin: 0 0 0.85rem; font-size: 0.82rem; line-height: 1.4; color: #cbd5e1; font-weight: 500;
}
.bullets { list-style: none; margin: 0 0 auto; padding: 0; display: flex; flex-direction: column; gap: 0.38rem; }
.bullets li { display: flex; gap: 0.45rem; align-items: flex-start; font-size: 0.78rem; color: #e2e8f0; font-weight: 500; }
.bullets .dot {
  flex: 0 0 0.45rem; width: 0.45rem; height: 0.45rem; margin-top: 0.35rem;
  border-radius: 50%; background: #00B2E2; box-shadow: 0 0 10px rgba(0,178,226,0.55);
}
.cta {
  align-self: flex-start; margin-top: 0.9rem;
  border: 0; border-radius: 10px; padding: 0.7rem 1.05rem;
  background: linear-gradient(90deg, #077999, #00B2E2);
  color: #fff; font-weight: 800; font-size: 0.78rem; letter-spacing: 0.04em;
  box-shadow: 0 10px 28px rgba(0,178,226,0.25);
}
[contenteditable="true"] { outline: none; border-radius: 3px; }
[contenteditable="true"]:focus { box-shadow: 0 0 0 2px rgba(103,232,249,0.45); background: rgba(255,255,255,0.06); }

.editor {
  background: #0f172a; border: 1px solid #1e293b; border-radius: 14px;
  padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.55rem;
}
.editor h3 { margin: 0; font-size: 1rem; color: #f8fafc; }
.editor .note { margin: 0; font-size: 0.78rem; color: #94a3b8; }
.editor .guard { margin: 0; font-size: 0.72rem; color: #67e8f9; }
.editor label {
  display: flex; flex-direction: column; gap: 0.25rem;
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; color: #94a3b8;
}
.editor input, .editor textarea, .editor select {
  font: inherit; text-transform: none; letter-spacing: normal; font-size: 0.88rem;
  color: #e2e8f0; background: #020617; border: 1px solid #334155; border-radius: 8px; padding: 0.45rem 0.55rem;
}
.copy-json {
  margin-top: 0.25rem; background: #077999; color: #fff; border: 0; border-radius: 8px;
  padding: 0.55rem 0.75rem; font-weight: 700; cursor: pointer;
}
.toast {
  position: fixed; bottom: 1.25rem; right: 1.25rem; background: #065f46; color: #ecfdf5;
  padding: 0.65rem 0.9rem; border-radius: 8px; font-size: 0.85rem; opacity: 0; transition: opacity 0.2s; z-index: 40;
}
.toast.show { opacity: 1; }
`;

const DATA_JSON = JSON.stringify(SAAS_PROP_TEMPLATES);
const cards = SAAS_PROP_TEMPLATES.map(
  (t) => `
  <section class="row" id="${esc(t.id)}">
    <div class="frame">
      <div class="label">${esc(t.label)} · <span class="id">${esc(t.id)}</span></div>
      ${renderAd(t)}
    </div>
    ${editorPanel(t)}
  </section>`,
).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(SAAS_PROP_META.title)} · MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'templates',
    pageTitle: 'SaaS Prop Templates',
    pageSubtitle: 'Classy medical-software look · no people · fancy words',
    subnav: [
      { href: '/template-test-board.html', label: 'Layout refs' },
      { href: '/role-offer-templates.html', label: 'Role-Offer' },
      { href: '/saas-prop-templates.html', label: 'SaaS Prop' },
    ],
    activeSubHref: '/saas-prop-templates.html',
  })}
  <div class="intro">
    <h1>${esc(SAAS_PROP_META.title)}</h1>
    <p>${esc(SAAS_PROP_META.subtitle)}</p>
    <p class="guard">${esc(SAAS_PROP_META.guardrail)}</p>
    <div class="banks">
      <span>No people</span><span>Glass / 3D props</span><span>Fancy headline banks</span><span>Staffing truth in support</span>
    </div>
  </div>
  <datalist id="cta-bank">${SAAS_CTA_BANK.map((x) => `<option value="${esc(x)}"></option>`).join('')}</datalist>
  <datalist id="eyebrow-bank">${SAAS_EYEBROW_BANK.map((x) => `<option value="${esc(x)}"></option>`).join('')}</datalist>
  <div class="stack">${cards}</div>
  <div class="toast" id="toast">Copied</div>
  <script>
    const state = ${DATA_JSON};
    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 1600);
    }
    function findTpl(id) { return state.find((t) => t.id === id); }
    function syncBullets(ad, t) {
      const ul = ad.querySelector('.bullets');
      if (!ul) return;
      ul.innerHTML = (t.bullets || []).map((b, i) =>
        '<li><span class="dot"></span><span class="btxt" data-bullet="' + i + '" contenteditable="true">' + escapeHtml(b) + '</span></li>'
      ).join('');
    }
    function escapeHtml(s) {
      return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    document.querySelectorAll('[data-editor-for]').forEach((panel) => {
      const id = panel.dataset.editorFor;
      panel.querySelectorAll('[data-bind]').forEach((input) => {
        const key = input.dataset.bind;
        const apply = () => {
          const t = findTpl(id);
          const ad = document.querySelector('.ad[data-id="' + id + '"]');
          if (!t || !ad) return;
          if (key === 'headlineVariant') {
            if (input.value) {
              t.headline = input.value;
              const ta = panel.querySelector('[data-bind="headline"]');
              if (ta) ta.value = input.value;
              const el = ad.querySelector('[data-field="headline"]');
              if (el) el.textContent = input.value;
            }
            return;
          }
          if (key === 'bullets') {
            t.bullets = String(input.value).split(/\\n/).map((x) => x.trim()).filter(Boolean);
            syncBullets(ad, t);
            return;
          }
          t[key] = input.value;
          if (key === 'art') {
            const img = ad.querySelector('.prop');
            if (img) img.src = input.value;
            return;
          }
          if (key === 'audiencePill') {
            let aud = ad.querySelector('[data-field="audiencePill"]');
            if (!input.value) { if (aud) aud.remove(); return; }
            if (!aud) {
              aud = document.createElement('span');
              aud.className = 'aud';
              aud.dataset.field = 'audiencePill';
              aud.contentEditable = 'true';
              ad.querySelector('.top').appendChild(aud);
            }
            aud.textContent = input.value;
            return;
          }
          const el = ad.querySelector('[data-field="' + key + '"]');
          if (el && document.activeElement !== el) el.textContent = input.value;
        };
        input.addEventListener('input', apply);
        input.addEventListener('change', apply);
      });
      const upload = panel.querySelector('[data-upload]');
      if (upload) {
        upload.addEventListener('change', () => {
          const file = upload.files && upload.files[0];
          const t = findTpl(id);
          if (!file || !t) return;
          const r = new FileReader();
          r.onload = () => {
            t.art = r.result;
            const ad = document.querySelector('.ad[data-id="' + id + '"]');
            if (ad) ad.querySelector('.prop').src = r.result;
            const artInput = panel.querySelector('[data-bind="art"]');
            if (artInput) artInput.value = '(local upload preview)';
            toast('Prop updated (local preview)');
          };
          r.readAsDataURL(file);
        });
      }
      const copyBtn = panel.querySelector('[data-copy]');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          const t = findTpl(id);
          try {
            await navigator.clipboard.writeText(JSON.stringify(t, null, 2));
            toast('JSON copied — paste into saas-prop-templates-data.mjs');
          } catch { toast('Copy failed'); }
        });
      }
    });
    document.querySelectorAll('.ad').forEach((ad) => {
      ad.addEventListener('input', (e) => {
        const id = ad.dataset.id;
        const t = findTpl(id);
        if (!t) return;
        const target = e.target;
        if (target.matches('[data-bullet]')) {
          t.bullets[Number(target.dataset.bullet)] = target.textContent.trim();
          const panel = document.querySelector('[data-editor-for="' + id + '"]');
          const ta = panel && panel.querySelector('[data-bind="bullets"]');
          if (ta) ta.value = t.bullets.join('\\n');
          return;
        }
        const field = target.getAttribute('data-field');
        if (!field) return;
        t[field] = target.textContent.trim();
        const panel = document.querySelector('[data-editor-for="' + id + '"]');
        const input = panel && panel.querySelector('[data-bind="' + field + '"]');
        if (input) input.value = t[field];
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('Wrote', path.relative(path.join(__dirname, '..'), OUT));
console.log('Templates:', SAAS_PROP_TEMPLATES.map((t) => t.id).join(', '));
