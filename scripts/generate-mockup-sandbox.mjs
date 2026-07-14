/**
 * Mock-up Sandbox — editable experimental comps for graphics partners.
 * Three forks: Lookbook · Bold · SaaS Prop style.
 * npm run generate:mockups
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { BRAND } from './medvirtual-brand-data.mjs';
import { WEEKLY_FORK_PROMPTS } from './competitor-ads-data.mjs';
import { GRAPHICS_REQUEST_EMAIL } from './creative-hopper-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const HOOKS = [
  'Billing Work Piling Up?',
  'Admin Work Piling Up?',
  'Scheduling Taking Over?',
  'Front Desk Stretched Thin?',
  'When patient calls keep coming in…',
  'Need Dedicated Virtual Support?',
  'Verification Work Piling Up?',
];

const NAMES = ['Carmen', 'Jennifer', 'Jessica', 'Chelsea', 'Mark', 'Angelica'];
const ROLES = [
  'Medical Biller',
  'Patient Intake Coordinator',
  'Jr. Medical Admin',
  'Dental Virtual Assistant',
  'Insurance Verification Specialist',
  'Front Desk Support',
];
const SKILLS = [
  ['Claims follow-up', 'Payment posting', 'Denial support'],
  ['Patient intake', 'Eligibility checks', 'CRM updates'],
  ['Customer service', 'Healthcare support', 'Scheduling'],
  ['Appointment setting', 'Patient comms', 'Insurance verify'],
];
const PHOTOS = [
  '/assets/real-people/jessica/clean-master.jpg',
  '/assets/real-people/chelsea/clean-master.jpg',
  '/assets/real-people/carmen/clean-master.jpg',
  '/assets/real-people/jennifer/clean-master.jpg',
  '/assets/ai-images/ai-generated-07.png',
  '/assets/ai-images/ai-generated-10.png',
];

const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${BRAND.fonts.family};
    color: ${BRAND.colors.ink};
    background: #eef3f7;
    line-height: 1.45;
  }
  main { max-width: 1200px; margin: 0 auto; padding: 1.2rem 1rem 4rem; }
  .hero h1 { margin: 0 0 0.35rem; font-size: clamp(1.6rem, 3.2vw, 2.2rem); letter-spacing: -0.03em; }
  .hero p { margin: 0 0 1rem; max-width: 44rem; color: #405766; }
  .toolbar {
    display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center;
    margin-bottom: 1rem; padding: 0.75rem 0.85rem; background: #fff;
    border: 1px solid #d5e2ea; border-radius: 12px;
  }
  .toolbar label { font-size: 0.78rem; font-weight: 700; color: #64748b; }
  .toolbar select, .toolbar button, .toolbar a.btn {
    font: inherit; font-size: 0.84rem; font-weight: 700;
    padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #fff; color: #0D546B; cursor: pointer; text-decoration: none;
  }
  .toolbar button.primary, .toolbar a.btn.primary {
    background: #077999; border-color: #077999; color: #fff;
  }
  .note {
    font-size: 0.82rem; color: #64748b; margin: 0 0 1rem;
  }
  .board {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }
  @media (max-width: 980px) { .board { grid-template-columns: 1fr; } }
  .col { display: flex; flex-direction: column; gap: 0.5rem; }
  .col h2 {
    margin: 0; font-size: 0.95rem; display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem;
  }
  .col h2 span { font-size: 0.72rem; font-weight: 600; color: #64748b; }
  .frame-wrap {
    background: #0f172a; border-radius: 12px; padding: 0.65rem;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
  }
  .ad {
    position: relative;
    width: 100%;
    aspect-ratio: 1080 / 1350;
    overflow: hidden;
    border-radius: 6px;
    background: #F0F5FF;
  }
  [contenteditable="true"] { outline: none; border-radius: 3px; }
  [contenteditable="true"]:focus { box-shadow: 0 0 0 2px rgba(39,230,250,0.7); }

  /* LOOKBOOK */
  .ad-look {
    background:
      linear-gradient(180deg, rgba(240,245,255,0.92) 0%, rgba(240,245,255,0.75) 55%, rgba(240,245,255,0.4) 100%),
      repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(0,178,226,0.07) 18px, rgba(0,178,226,0.07) 19px),
      repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(0,178,226,0.07) 18px, rgba(0,178,226,0.07) 19px),
      #e8f4fa;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    grid-template-rows: auto 1fr auto;
    padding: 5% 5% 4%;
    gap: 2%;
  }
  .ad-look .logo { width: 34%; max-width: 120px; }
  .ad-look .logo img { width: 100%; height: auto; display: block; }
  .ad-look .copy { grid-column: 1; display: flex; flex-direction: column; gap: 0.45rem; justify-content: center; }
  .ad-look .hire { font-size: clamp(0.55rem, 2.1vw, 0.78rem); font-weight: 700; color: #0D546B; }
  .ad-look .meet { font-size: clamp(1rem, 4vw, 1.55rem); font-weight: 800; color: #161511; letter-spacing: -0.02em; line-height: 1.1; }
  .ad-look .pill {
    align-self: flex-start; background: #077999; color: #fff; font-weight: 700;
    font-size: clamp(0.5rem, 1.8vw, 0.72rem); padding: 0.28rem 0.55rem; border-radius: 999px;
  }
  .ad-look ul { margin: 0.2rem 0 0; padding: 0; list-style: none; display: grid; gap: 0.25rem; }
  .ad-look li {
    display: flex; gap: 0.35rem; align-items: flex-start;
    font-size: clamp(0.48rem, 1.7vw, 0.68rem); color: #334155; font-weight: 600;
  }
  .ad-look li::before {
    content: ''; width: 0.85em; height: 0.85em; margin-top: 0.15em; flex-shrink: 0;
    border-radius: 50%; background: #00B2E2;
    box-shadow: inset 0 0 0 2px #00B2E2;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2l2.2 2.2 4.8-5' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  }
  .ad-look .cta {
    margin-top: 0.35rem; align-self: flex-start; background: #00C0D4; color: #fff;
    font-weight: 800; font-size: clamp(0.45rem, 1.6vw, 0.65rem); letter-spacing: 0.04em;
    padding: 0.45rem 0.7rem; border-radius: 8px; border: none;
  }
  .ad-look .photo {
    grid-column: 2; grid-row: 1 / span 3; border-radius: 14px; overflow: hidden;
    align-self: stretch; background: #cbd5e1;
  }
  .ad-look .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* BOLD */
  .ad-bold {
    background: #077999;
    color: #fff;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 0;
  }
  .ad-bold .photo { min-height: 48%; overflow: hidden; }
  .ad-bold .photo img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(1.05); }
  .ad-bold .stack { padding: 6% 7% 7%; display: flex; flex-direction: column; gap: 0.55rem; }
  .ad-bold .hook {
    font-size: clamp(1.1rem, 5vw, 1.85rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;
  }
  .ad-bold .meet { font-size: clamp(0.8rem, 3vw, 1.15rem); font-weight: 700; color: #27E6FA; }
  .ad-bold .role { font-size: clamp(0.55rem, 2vw, 0.8rem); opacity: 0.92; }
  .ad-bold .cta {
    align-self: flex-start; background: #fff; color: #077999; font-weight: 800;
    font-size: clamp(0.5rem, 1.8vw, 0.72rem); padding: 0.5rem 0.8rem; border-radius: 999px; border: none;
  }
  .ad-bold .logo { position: absolute; top: 3.5%; left: 5%; width: 28%; max-width: 110px; z-index: 2; }
  .ad-bold .logo img { width: 100%; filter: brightness(0) invert(1); }

  /* SAAS */
  .ad-saas {
    background: linear-gradient(155deg, #0D546B 0%, #0a3d4d 40%, #061e28 100%);
    color: #e2e8f0;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 7% 7% 6%;
  }
  .ad-saas .logo { width: 32%; max-width: 120px; }
  .ad-saas .logo img { width: 100%; filter: brightness(0) invert(1); }
  .ad-saas .hook {
    font-size: clamp(1rem, 4.2vw, 1.55rem); font-weight: 800; letter-spacing: -0.03em;
    line-height: 1.15; margin: 8% 0 4%;
  }
  .ad-saas .glass {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16);
    border-radius: 14px; padding: 0.85rem 0.9rem; backdrop-filter: blur(8px);
  }
  .ad-saas .glass h3 {
    margin: 0 0 0.55rem; font-size: clamp(0.55rem, 2vw, 0.78rem); color: #27E6FA; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .ad-saas .glass ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.35rem; }
  .ad-saas .glass li {
    font-size: clamp(0.5rem, 1.8vw, 0.72rem); font-weight: 600;
    padding-left: 1.1em; position: relative;
  }
  .ad-saas .glass li::before {
    content: ''; position: absolute; left: 0; top: 0.35em; width: 0.55em; height: 0.55em;
    border-radius: 2px; background: #00C0D4;
  }
  .ad-saas .cta {
    margin-top: 6%; align-self: flex-start; background: #27E6FA; color: #0D546B;
    font-weight: 800; font-size: clamp(0.5rem, 1.8vw, 0.72rem); padding: 0.55rem 0.9rem;
    border-radius: 8px; border: none;
  }

  .export-row { display: flex; gap: 0.35rem; flex-wrap: wrap; }
  .export-row button {
    font: inherit; font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.6rem;
    border-radius: 7px; border: 1px solid #cbd5e1; background: #fff; color: #0D546B; cursor: pointer;
  }
  .tips {
    margin-top: 1.5rem; background: #fff; border: 1px solid #d5e2ea; border-radius: 12px;
    padding: 1rem 1.05rem;
  }
  .tips h2 { margin: 0 0 0.4rem; font-size: 1.05rem; }
  .tips ul { margin: 0; padding-left: 1.1rem; color: #405766; font-size: 0.9rem; }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: #0D546B; color: #fff;
    padding: 0.55rem 0.85rem; border-radius: 8px; font-weight: 700; opacity: 0;
    pointer-events: none; transition: opacity 0.2s; z-index: 50;
  }
  .toast.show { opacity: 1; }
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mock-up Sandbox · MedVirtual</title>
  <style>${css}</style>
  <script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js"></script>
</head>
<body>
  ${renderDocHeader({
    activeId: 'mockups',
    pageTitle: 'Mock-up Sandbox',
    pageSubtitle: 'Play around — three forks, editable type, export PNGs for George',
  })}
  <main>
    <header class="hero">
      <h1>Try ideas before they hit the Brief.</h1>
      <p>Click any text to edit. Hit <strong>Surprise me</strong> for a fresh seed. Export a PNG and email George — he’d love to see what you’re dreaming up.</p>
    </header>

    <div class="toolbar">
      <label for="fork">Weekly fork</label>
      <select id="fork">
        <option value="">Custom / free play</option>
        ${WEEKLY_FORK_PROMPTS.map((f) => `<option value="${esc(f.id)}">${esc(f.talent)} · ${esc(f.size)}</option>`).join('')}
      </select>
      <button type="button" class="primary" id="surprise">Surprise me</button>
      <button type="button" id="export-all">Export all 3 PNGs</button>
      <a class="btn" href="/competitors.html">Competitor Wall</a>
      <a class="btn" href="/ideas.html">Ideas Lab</a>
    </div>
    <p class="note">Tip: export PNGs and email them to George — favorites can graduate into the real Brief.</p>

    <div class="board">
      <div class="col">
        <h2>Lookbook <span>faithful</span></h2>
        <div class="frame-wrap">
          <div class="ad ad-look" id="ad-look" data-export="lookbook">
            <div class="logo"><img src="${esc(BRAND.assets.logoColoredSvg)}" alt="" /></div>
            <div class="copy">
              <div class="hire" contenteditable="true">Hire a Virtual</div>
              <div class="meet" contenteditable="true" data-field="meet">Meet Jessica</div>
              <div class="pill" contenteditable="true" data-field="role">Jr. Medical Admin</div>
              <ul>
                <li contenteditable="true">Customer service</li>
                <li contenteditable="true">Healthcare support</li>
                <li contenteditable="true">Scheduling help</li>
              </ul>
              <button type="button" class="cta" contenteditable="true">REQUEST AN INTERVIEW</button>
            </div>
            <div class="photo"><img data-field="photo" src="/assets/real-people/jessica/clean-master.jpg" alt="" /></div>
          </div>
        </div>
        <div class="export-row"><button type="button" data-export-one="ad-look">Download PNG</button></div>
      </div>

      <div class="col">
        <h2>Bold <span>experiment</span></h2>
        <div class="frame-wrap">
          <div class="ad ad-bold" id="ad-bold" data-export="bold">
            <div class="logo"><img src="${esc(BRAND.assets.logoWhiteSvg)}" alt="" /></div>
            <div class="photo"><img data-field="photo" src="/assets/real-people/jessica/clean-master.jpg" alt="" /></div>
            <div class="stack">
              <div class="hook" contenteditable="true" data-field="hook">Admin Work Piling Up?</div>
              <div class="meet" contenteditable="true" data-field="meet">Meet Jessica</div>
              <div class="role" contenteditable="true" data-field="role">Jr. Medical Admin · MedVirtual</div>
              <button type="button" class="cta" contenteditable="true">Book a demo</button>
            </div>
          </div>
        </div>
        <div class="export-row"><button type="button" data-export-one="ad-bold">Download PNG</button></div>
      </div>

      <div class="col">
        <h2>SaaS Prop <span>no people</span></h2>
        <div class="frame-wrap">
          <div class="ad ad-saas" id="ad-saas" data-export="saas">
            <div class="logo"><img src="${esc(BRAND.assets.logoWhiteSvg)}" alt="" /></div>
            <div class="hook" contenteditable="true" data-field="hook">Admin Work Piling Up?</div>
            <div class="glass">
              <h3 contenteditable="true">Practice ops relief</h3>
              <ul>
                <li contenteditable="true">Dedicated virtual teammate</li>
                <li contenteditable="true">Interview before you hire</li>
                <li contenteditable="true">Works inside your tools</li>
              </ul>
            </div>
            <button type="button" class="cta" contenteditable="true">Book a demo</button>
          </div>
        </div>
        <div class="export-row"><button type="button" data-export-one="ad-saas">Download PNG</button></div>
      </div>
    </div>

    <section class="tips">
      <h2>How to use this with the team</h2>
      <ul>
        <li>Browse the <a href="/competitors.html">Competitor Wall</a>, then remix here.</li>
        <li>Lookbook fork = great for today’s Brief language.</li>
        <li>Bold / SaaS forks = Ideas Lab energy — pitch George even if they’re not Brief-ready yet.</li>
        <li>Keep claims light and true — profile titles/skills only.</li>
      </ul>
      <p style="margin:0.85rem 0 0"><a class="btn primary" style="display:inline-flex;padding:0.5rem 0.85rem;border-radius:8px;background:#077999;color:#fff;font-weight:700;text-decoration:none" href="mailto:${esc(GRAPHICS_REQUEST_EMAIL)}?subject=${encodeURIComponent('Sandbox mock-ups for George')}&body=${encodeURIComponent('Hey George!\n\nHere are some sandbox mock-ups I was playing with:\n\n')}">Email George your exports</a></p>
    </section>
  </main>
  <div class="toast" id="toast">Saved</div>
  <script>
    const HOOKS = ${JSON.stringify(HOOKS)};
    const NAMES = ${JSON.stringify(NAMES)};
    const ROLES = ${JSON.stringify(ROLES)};
    const SKILLS = ${JSON.stringify(SKILLS)};
    const PHOTOS = ${JSON.stringify(PHOTOS)};
    const FORKS = ${JSON.stringify(WEEKLY_FORK_PROMPTS)};

    const toast = document.getElementById('toast');
    function flash(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1400);
    }

    function setMeet(name) {
      document.querySelectorAll('[data-field="meet"]').forEach((el) => {
        el.textContent = 'Meet ' + name;
      });
    }
    function setRole(role) {
      document.querySelectorAll('[data-field="role"]').forEach((el) => {
        if (el.closest('.ad-bold')) el.textContent = role + ' · MedVirtual';
        else el.textContent = role;
      });
    }
    function setHook(hook) {
      document.querySelectorAll('[data-field="hook"]').forEach((el) => {
        el.textContent = hook;
      });
    }
    function setPhoto(src) {
      document.querySelectorAll('[data-field="photo"]').forEach((img) => {
        img.src = src;
      });
    }
    function setSkills(list) {
      const items = document.querySelectorAll('.ad-look li');
      list.forEach((s, i) => { if (items[i]) items[i].textContent = s; });
      const saas = document.querySelectorAll('.ad-saas .glass li');
      // leave saas list as product benefits unless surprise rewrites first two lightly
    }

    function surprise() {
      const i = Math.floor(Math.random() * NAMES.length);
      const name = NAMES[i];
      const role = ROLES[i % ROLES.length];
      const hook = HOOKS[Math.floor(Math.random() * HOOKS.length)];
      const skills = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      const photo = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
      setMeet(name);
      setRole(role);
      setHook(hook);
      setSkills(skills);
      setPhoto(photo);
      flash('Surprised — edit away');
    }

    document.getElementById('surprise').addEventListener('click', surprise);

    document.getElementById('fork').addEventListener('change', (e) => {
      const id = e.target.value;
      const fork = FORKS.find((f) => f.id === id);
      if (!fork) return;
      setMeet(fork.talent);
      if (fork.talent === 'Carmen') {
        setRole('Medical Biller');
        setHook('Billing Work Piling Up?');
        setPhoto('/assets/real-people/carmen/clean-master.jpg');
        setSkills(['Claims follow-up', 'Payment posting', 'Denial support']);
      } else if (fork.talent === 'Jessica') {
        setRole('Jr. Medical Admin');
        setHook('Admin Work Piling Up?');
        setPhoto('/assets/real-people/jessica/clean-master.jpg');
        setSkills(['Customer service', 'Healthcare support', 'Scheduling help']);
      }
      flash('Fork loaded');
    });

    async function exportNode(node, filename) {
      if (!window.htmlToImage) {
        flash('Export lib missing — try screenshot');
        return;
      }
      try {
        const dataUrl = await window.htmlToImage.toPng(node, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: null,
        });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        a.click();
        flash('Downloaded ' + filename);
      } catch (err) {
        console.error(err);
        flash('Export failed — screenshot instead');
      }
    }

    document.querySelectorAll('[data-export-one]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-export-one');
        const node = document.getElementById(id);
        exportNode(node, 'mv-mock-' + id.replace('ad-', '') + '.png');
      });
    });

    document.getElementById('export-all').addEventListener('click', async () => {
      for (const id of ['ad-look', 'ad-bold', 'ad-saas']) {
        await exportNode(document.getElementById(id), 'mv-mock-' + id.replace('ad-', '') + '.png');
      }
    });

    // Deep links ?fork= & ?seed=
    const params = new URLSearchParams(location.search);
    const forkParam = params.get('fork');
    if (forkParam) {
      const sel = document.getElementById('fork');
      sel.value = forkParam;
      sel.dispatchEvent(new Event('change'));
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(PUBLIC, 'mockup-sandbox.html'), html);
console.log('Mock-up Sandbox written');
