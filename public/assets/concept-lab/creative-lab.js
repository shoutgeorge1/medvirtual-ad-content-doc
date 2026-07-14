/**
 * Creative Concept Lab — client app
 * Data comes from window.MV_CONCEPT_LAB (injected by page generator).
 */
(function () {
  const DATA = window.MV_CONCEPT_LAB;
  if (!DATA) {
    console.error('MV_CONCEPT_LAB payload missing');
    return;
  }

  // Merge Foundry-approved repo assets (shared manifest — not duplicated hand edits)
  function mergeAiApproved(manifest) {
    const list = Array.isArray(manifest?.assets) ? manifest.assets : [];
    const existing = new Set((DATA.images || []).map((i) => i.id));
    for (const a of list) {
      if (!a?.id || !a?.src || existing.has(a.id)) continue;
      DATA.images.push({
        id: a.id,
        name: a.concept || a.id,
        src: a.src,
        thumb: a.src,
        aspectRatio: a.format || '4:5',
        subjectPosition: a.subjectPosition || 'right',
        copyZone: a.copySpace || 'left',
        status: 'Approved AI',
        kind: a.kind || 'ai-approved',
        source: 'asset-foundry',
      });
      existing.add(a.id);
    }
  }

  fetch('/assets/ai-approved/manifest.json')
    .then((r) => (r.ok ? r.json() : null))
    .then((m) => {
      if (m) {
        mergeAiApproved(m);
        try {
          render();
        } catch {
          /* first paint may not be ready */
        }
      }
    })
    .catch(() => {});

  const STORAGE = DATA.storageKeys.creativeBatch;
  const PROMOTE = DATA.storageKeys.promote;
  const FORMATS = DATA.formats;
  const STATUSES = DATA.statuses;

  /** @type {object[]} */
  let batch = loadBatch();

  const root = document.getElementById('ccl-root');
  const toastEl = document.getElementById('ccl-toast');
  const confirmDlg = document.getElementById('ccl-confirm');

  function flash(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 1600);
  }

  function plain(s) {
    return String(s ?? '').replace(/<[^>]*>/g, '');
  }

  function loadBatch() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return structuredClone(DATA.defaultBatch);
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : parsed?.concepts;
      if (!Array.isArray(list) || list.length !== 4) return structuredClone(DATA.defaultBatch);
      return list.map((c, i) => sanitizeLocal(c, DATA.defaultBatch[i]));
    } catch {
      return structuredClone(DATA.defaultBatch);
    }
  }

  function sanitizeLocal(c, fallback) {
    const base = { ...(fallback || {}), ...(c || {}) };
    base.bullets = Array.isArray(base.bullets) ? base.bullets.slice(0, 3).map(plain) : ['', '', ''];
    while (base.bullets.length < 3) base.bullets.push('');
    ['eyebrow', 'headline', 'support', 'cta', 'internalNotes', 'name', 'audience'].forEach((k) => {
      if (k in base) base[k] = plain(base[k]);
    });
    if (!STATUSES.includes(base.status)) base.status = 'Draft';
    if (!FORMATS[base.format]) base.format = '4:5';
    return base;
  }

  function save() {
    localStorage.setItem(STORAGE, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), concepts: batch }));
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function imageById(id) {
    return DATA.images.find((i) => i.id === id);
  }

  function buildImagePrompt(c) {
    const side = c.copySide === 'right' ? 'left' : 'right';
    return [
      `Premium MedVirtual Meta ad background, ${c.format} aspect ratio.`,
      `Scene: ${c.lane === 'premium-ops' ? 'abstract glass medical operations props — no people' : 'professional healthcare workplace or portrait'}.`,
      `Subject position: ${side}. Generous empty copy space on the ${c.copySide || 'left'}.`,
      'Color direction: teal #077999, cyan #00B2E2, deep teal #0D546B, cool neutrals.',
      'Aesthetic: calm, commercial healthcare SaaS / real workplace — expensive and composed.',
      'Strict: no visible text, no logos, no patient information, no medical claims, no fake interface text, no watermarks.',
    ].join(' ');
  }

  function overflowWarnings(c) {
    const warns = [];
    if ((c.headline || '').length > 72) warns.push('Headline is long — may crowd the frame.');
    if ((c.support || '').length > 110) warns.push('Support line is long — check mobile readability.');
    if ((c.bullets || []).some((b) => b.length > 42)) warns.push('A bullet exceeds ~42 characters.');
    return warns;
  }

  function renderAdMarkup(c, index) {
    const fmt = FORMATS[c.format] || FORMATS['4:5'];
    const logoSrc = c.logoVariant === 'white' ? DATA.brand.logoWhite : DATA.brand.logoColored;
    const showPhoto = Boolean(c.imageSrc) && c.layout !== 'PremiumOpsLayout';
    const showOpsPhoto = c.layout === 'PremiumOpsLayout' && c.imageSrc;
    const x = c.imagePosition?.x ?? 50;
    const y = c.imagePosition?.y ?? 50;
    const zoom = (c.imageZoom ?? 100) / 100;
    const overlay = (c.overlayIntensity ?? 20) / 100;
    const bullets = (c.bullets || []).slice(0, 3);

    const photoHtml =
      showPhoto || showOpsPhoto
        ? `<div class="ccl-photo" aria-hidden="true"><img src="${escapeHtml(c.imageSrc)}" alt="" loading="lazy" decoding="async" /></div>`
        : '';

    const propsHtml =
      c.layout === 'PremiumOpsLayout'
        ? `<div class="ccl-props" aria-hidden="true">${bullets
            .map((b) => `<div class="ccl-prop">${escapeHtml(b)}</div>`)
            .join('')}</div>`
        : '';

    const editorialHook =
      c.layout === 'EditorialTalentLayout' && c.editorialHook
        ? `<div class="ccl-editorial-hook">${escapeHtml(c.editorialHook)}</div>`
        : '';

    const candidateLine =
      c.layout === 'PainPortraitLayout' && c.candidateName
        ? `<div class="ccl-candidate">Meet ${escapeHtml(c.candidateName)} · ${escapeHtml(c.role || '')}</div>`
        : '';

    const pill =
      c.showAudiencePill && c.audience
        ? `<div class="ccl-pill">${escapeHtml(c.audience)}</div>`
        : c.layout === 'EditorialTalentLayout' && c.role
          ? `<div class="ccl-pill">${escapeHtml(c.role)}</div>`
          : '';

    const glassWrapStart = c.layout === 'PremiumOpsLayout' ? '<div class="ccl-glass">' : '';
    const glassWrapEnd = c.layout === 'PremiumOpsLayout' ? '</div>' : '';

    return `
      <div class="ccl-ad"
        id="ccl-ad-${index}"
        data-layout="${escapeHtml(c.layout)}"
        data-format="${escapeHtml(c.format)}"
        data-copy="${escapeHtml(c.copySide || 'left')}"
        style="--img-x:${x}%;--img-y:${y}%;--img-zoom:${zoom};--overlay:${overlay};aspect-ratio:${fmt.width}/${fmt.height}"
        role="img"
        aria-label="${escapeHtml(c.name)} ad preview">
        ${c.showLogo !== false ? `<div class="ccl-logo"><img src="${escapeHtml(logoSrc)}" alt="" /></div>` : ''}
        ${photoHtml}
        <div class="ccl-scrim" aria-hidden="true"></div>
        ${propsHtml}
        <div class="ccl-copy">
          ${c.eyebrow ? `<div class="ccl-eyebrow">${escapeHtml(c.eyebrow)}</div>` : ''}
          ${editorialHook}
          ${pill}
          <div class="ccl-headline">${escapeHtml(c.layout === 'EditorialTalentLayout' ? `Meet ${c.headline}` : c.headline)}</div>
          ${candidateLine}
          <div class="ccl-support">${escapeHtml(c.support)}</div>
          ${glassWrapStart}
          <ul class="ccl-bullets">
            ${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
          ${glassWrapEnd}
          <button type="button" class="ccl-cta" tabindex="-1">${escapeHtml(c.cta)}</button>
        </div>
      </div>`;
  }

  function field(label, html, span2 = false) {
    return `<div class="ccl-field${span2 ? ' span-2' : ''}"><label>${label}</label>${html}</div>`;
  }

  function renderCard(c, index) {
    const warns = overflowWarnings(c);
    const img = imageById(c.imageId);
    const fmt = FORMATS[c.format] || FORMATS['4:5'];

    return `
    <article class="ccl-card" data-index="${index}" aria-labelledby="ccl-title-${index}">
      <div class="ccl-meta">
        <div class="ccl-num">Concept ${index + 1}</div>
        <h2 id="ccl-title-${index}">${escapeHtml(c.name)}</h2>
        <div class="ccl-status-row">
          <span class="ccl-status-pill" data-status="${escapeHtml(c.status)}">${escapeHtml(c.status)}</span>
          <span class="ccl-status-pill">${escapeHtml(c.lane)}</span>
        </div>
        <dl>
          <dt>Audience</dt><dd>${escapeHtml(c.audience || '—')}</dd>
          <dt>Source inspiration</dt><dd>${escapeHtml(c.sourceInspiration || '—')}</dd>
          <dt>Borrowed principle</dt><dd>${escapeHtml(c.borrowedPrinciple || '—')}</dd>
          <dt>Rejected pattern</dt><dd>${escapeHtml(c.rejectedPattern || '—')}</dd>
          <dt>MedVirtual remix</dt><dd>${escapeHtml(c.medvirtualRemix || '—')}</dd>
          <dt>Competitor source</dt><dd>${escapeHtml(c.competitorSource || '—')}${c.sourceAdId ? ` · ${escapeHtml(c.sourceAdId)}` : ''}</dd>
        </dl>
      </div>
      <div class="ccl-preview-col">
        <div class="ccl-frame-shell">
          <div class="ccl-frame-scale" data-format="${escapeHtml(c.format)}">
            ${renderAdMarkup(c, index)}
          </div>
        </div>
        <p class="ccl-warn${warns.length ? ' show' : ''}" id="ccl-warn-${index}">${escapeHtml(warns.join(' '))}</p>
        <div class="ccl-controls">
          ${field(
            'Review status',
            `<select data-bind="status" aria-label="Review status for concept ${index + 1}">${STATUSES.map(
              (s) => `<option value="${escapeHtml(s)}"${s === c.status ? ' selected' : ''}>${escapeHtml(s)}</option>`,
            ).join('')}</select>`,
          )}
          ${field(
            'Format',
            `<select data-bind="format" aria-label="Format for concept ${index + 1}">${Object.values(FORMATS)
              .map(
                (f) =>
                  `<option value="${escapeHtml(f.id)}"${f.id === c.format ? ' selected' : ''}>${escapeHtml(f.label)} · ${f.width}×${f.height}</option>`,
              )
              .join('')}</select>`,
          )}
          ${field(
            'Theme',
            `<select data-bind="theme">${DATA.themes
              .map((t) => `<option value="${escapeHtml(t)}"${t === c.theme ? ' selected' : ''}>${escapeHtml(t)}</option>`)
              .join('')}</select>`,
          )}
          ${field(
            'Logo',
            `<select data-bind="logoVariant">
              <option value="colored"${c.logoVariant === 'colored' ? ' selected' : ''}>Colored</option>
              <option value="white"${c.logoVariant === 'white' ? ' selected' : ''}>White</option>
            </select>`,
          )}
          ${field('Eyebrow', `<input type="text" data-bind="eyebrow" value="${escapeHtml(c.eyebrow || '')}" />`, true)}
          ${field('Headline', `<input type="text" data-bind="headline" value="${escapeHtml(c.headline || '')}" />`, true)}
          ${field('Supporting line', `<input type="text" data-bind="support" value="${escapeHtml(c.support || '')}" />`, true)}
          ${field('Bullet 1', `<input type="text" data-bind="bullet0" value="${escapeHtml(c.bullets[0] || '')}" />`)}
          ${field('Bullet 2', `<input type="text" data-bind="bullet1" value="${escapeHtml(c.bullets[1] || '')}" />`)}
          ${field('Bullet 3', `<input type="text" data-bind="bullet2" value="${escapeHtml(c.bullets[2] || '')}" />`, true)}
          ${field('CTA', `<input type="text" data-bind="cta" value="${escapeHtml(c.cta || '')}" />`)}
          ${field(
            'Audience pill',
            `<select data-bind="showAudiencePill">
              <option value="true"${c.showAudiencePill ? ' selected' : ''}>Show</option>
              <option value="false"${!c.showAudiencePill ? ' selected' : ''}>Hide</option>
            </select>`,
          )}
          ${field(
            'Copy side',
            `<select data-bind="copySide">
              <option value="left"${c.copySide === 'left' ? ' selected' : ''}>Left</option>
              <option value="right"${c.copySide === 'right' ? ' selected' : ''}>Right</option>
            </select>`,
          )}
          ${field('Image zoom', `<input type="range" min="100" max="140" data-bind="imageZoom" value="${c.imageZoom ?? 105}" aria-valuetext="${c.imageZoom ?? 105}%" />`)}
          ${field('Image X', `<input type="range" min="0" max="100" data-bind="imageX" value="${c.imagePosition?.x ?? 50}" />`)}
          ${field('Image Y', `<input type="range" min="0" max="100" data-bind="imageY" value="${c.imagePosition?.y ?? 50}" />`)}
          ${field('Overlay intensity', `<input type="range" min="0" max="60" data-bind="overlayIntensity" value="${c.overlayIntensity ?? 20}" />`)}
          ${field(
            'Image',
            `<button type="button" data-action="toggle-images">Choose image${img ? ` · ${escapeHtml(img.name)}` : ''}</button>
             <div class="ccl-image-chooser" id="ccl-imgs-${index}" role="listbox" aria-label="Approved images"></div>
             <input type="file" accept="image/*" data-action="upload-image" hidden id="ccl-upload-${index}" />
             <button type="button" data-action="trigger-upload">Upload generated image</button>`,
            true,
          )}
          ${field('Internal notes', `<textarea data-bind="internalNotes" rows="2">${escapeHtml(c.internalNotes || '')}</textarea>`, true)}
          ${field(
            'Image direction (prompt)',
            `<div class="ccl-prompt" id="ccl-prompt-${index}">${escapeHtml(c.imagePrompt || buildImagePrompt(c))}</div>
             <div class="ccl-actions" style="margin-top:0.35rem">
               <button type="button" data-action="copy-prompt">Copy Image Prompt</button>
             </div>`,
            true,
          )}
        </div>
        <div class="ccl-actions">
          <button type="button" class="primary" data-action="export-png">Download PNG</button>
          <button type="button" data-action="copy-json">Copy concept JSON</button>
          <button type="button" data-action="promote">Promote to Motion</button>
          <button type="button" data-action="to-video-brief">Turn Into Video Brief</button>
          <button type="button" data-action="reset-one">Reset concept</button>
        </div>
        <p style="margin:0;font-size:0.72rem;color:#64748b">Export size: ${fmt.width}×${fmt.height}px · controls stay outside the PNG</p>
      </div>
    </article>`;
  }

  function fillImageChooser(index) {
    const box = document.getElementById(`ccl-imgs-${index}`);
    if (!box) return;
    const c = batch[index];
    box.innerHTML = DATA.images
      .map((img) => {
        const pressed = img.id === c.imageId ? 'true' : 'false';
        return `<button type="button" class="ccl-image-opt" role="option" aria-pressed="${pressed}" data-image-id="${escapeHtml(img.id)}">
          <img src="${escapeHtml(img.thumb)}" alt="" loading="lazy" />
          <span class="t">${escapeHtml(img.name)}</span>
          <span class="m">${escapeHtml(img.aspectRatio)} · subject ${escapeHtml(img.subjectPosition)} · copy ${escapeHtml(img.copyZone)} · ${escapeHtml(img.status)}</span>
        </button>`;
      })
      .join('');
  }

  function render() {
    root.innerHTML = batch.map((c, i) => renderCard(c, i)).join('');
    batch.forEach((_, i) => fillImageChooser(i));
  }

  function updateConcept(index, patch) {
    batch[index] = { ...batch[index], ...patch };
    if (!patch.imagePrompt) {
      batch[index].imagePrompt = buildImagePrompt(batch[index]);
    }
    save();
    const card = root.querySelector(`.ccl-card[data-index="${index}"]`);
    if (!card) {
      render();
      return;
    }
    // Re-render preview + warnings without nuking focus when possible
    const shell = card.querySelector('.ccl-frame-shell .ccl-frame-scale');
    if (shell) {
      shell.setAttribute('data-format', batch[index].format);
      shell.innerHTML = renderAdMarkup(batch[index], index);
    }
    const warn = card.querySelector(`#ccl-warn-${index}`);
    const warns = overflowWarnings(batch[index]);
    if (warn) {
      warn.textContent = warns.join(' ');
      warn.classList.toggle('show', warns.length > 0);
    }
    const prompt = card.querySelector(`#ccl-prompt-${index}`);
    if (prompt) prompt.textContent = batch[index].imagePrompt;
    const pill = card.querySelector('.ccl-status-pill');
    if (pill && patch.status) {
      pill.dataset.status = batch[index].status;
      pill.textContent = batch[index].status;
    }
  }

  function waitForAssets(node) {
    const imgs = [...node.querySelectorAll('img')];
    const imgWait = Promise.all(
      imgs.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }),
      ),
    );
    const fontWait = document.fonts?.ready || Promise.resolve();
    return Promise.all([imgWait, fontWait]);
  }

  async function exportPng(index) {
    const node = document.getElementById(`ccl-ad-${index}`);
    const c = batch[index];
    const fmt = FORMATS[c.format] || FORMATS['4:5'];
    if (!window.htmlToImage) {
      flash('Export library missing');
      return;
    }
    flash('Preparing PNG…');
    await waitForAssets(node);
    try {
      const dataUrl = await window.htmlToImage.toPng(node, {
        width: fmt.width,
        height: fmt.height,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: null,
        style: {
          width: `${fmt.width}px`,
          height: `${fmt.height}px`,
          transform: 'none',
          aspectRatio: 'auto',
        },
      });
      // Verify dimensions via Image
      await new Promise((resolve, reject) => {
        const probe = new Image();
        probe.onload = () => {
          if (probe.width !== fmt.width || probe.height !== fmt.height) {
            console.warn('PNG dimension mismatch', probe.width, probe.height, fmt);
          }
          resolve();
        };
        probe.onerror = reject;
        probe.src = dataUrl;
      });
      const slug = (c.name || c.id || 'concept')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `medvirtual-concept-${String(index + 1).padStart(2, '0')}-${slug}-${fmt.slug}.png`;
      a.click();
      flash(`Downloaded ${fmt.width}×${fmt.height}`);
    } catch (err) {
      console.error(err);
      flash('Export failed');
    }
  }

  async function exportAllPngs() {
    for (let i = 0; i < batch.length; i++) {
      await exportPng(i);
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  function confirmAction(message) {
    return new Promise((resolve) => {
      const msg = confirmDlg.querySelector('[data-msg]');
      msg.textContent = message;
      confirmDlg.showModal();
      const onClose = (ok) => {
        confirmDlg.close();
        resolve(ok);
      };
      confirmDlg.querySelector('[data-ok]').onclick = () => onClose(true);
      confirmDlg.querySelector('[data-cancel]').onclick = () => onClose(false);
    });
  }

  function reseedFromBanks() {
    // Client-side reseed mirrors server banks (deterministic from timestamp)
    const seed = Date.now();
    const rnd = (() => {
      let a = seed >>> 0;
      return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const banks = DATA.banks;
    const principles = DATA.competitorPrinciples;
    const talent = DATA.talent;
    const peopleImgs = DATA.images.filter((i) => i.kind !== 'saas-prop' && i.kind !== 'ai-prop');
    const saasImgs = DATA.images.filter((i) => i.kind === 'saas-prop' || i.kind === 'ai-prop');
    const layouts = [
      { layout: 'PainPortraitLayout', lane: 'pain-human', theme: 'light-grid', name: 'Pain + Human Answer', motion: 'MV-HOOK-HUMAN-01', dur: 330 },
      { layout: 'EditorialTalentLayout', lane: 'editorial-talent', theme: 'editorial-light', name: 'Named Talent / Editorial', motion: 'MV-CHECKLIST-01', dur: 300 },
      { layout: 'PremiumOpsLayout', lane: 'premium-ops', theme: 'premium-ops-dark', name: 'Premium Operations / SaaS Prop', motion: 'MV-PREMIUM-OPS-01', dur: 360 },
      { layout: 'VerticalWorkflowLayout', lane: 'vertical-workflow', theme: 'vertical-clean', name: 'Vertical Workflow', motion: 'MV-PROBLEM-PERSON-01', dur: 390 },
    ];

    batch = layouts.map((laneDef, idx) => {
      const t = pick(talent);
      const p = pick(principles);
      const workflows = pick(banks.workflows);
      const isOps = laneDef.lane === 'premium-ops';
      const isEd = laneDef.lane === 'editorial-talent';
      const isVert = laneDef.lane === 'vertical-workflow';
      const img = isOps ? pick(saasImgs) : pick(peopleImgs);
      const vertical = isVert ? pick(banks.verticals) : pick(banks.verticals);
      const skills = (t.listedSkills || []).map((s) =>
        String(s)
          .replace(/^BPO\s*-\s*/i, '')
          .replace(/^VA\s*-\s*/i, '')
          .replace(/^Medical\s*-\s*/i, '')
          .trim(),
      );
      while (skills.length < 3) skills.push(workflows[skills.length] || 'Follow-up support');
      const copySide = img.copyZone === 'right' ? 'right' : 'left';
      const concept = {
        id: `MV-STATIC-${laneDef.lane.toUpperCase()}-${String(seed).slice(-4)}-${idx + 1}`,
        name: isVert ? `Vertical Workflow · ${vertical}` : laneDef.name,
        lane: laneDef.lane,
        audience: vertical === 'dental' ? 'Dental practices' : pick(banks.audiences),
        vertical,
        format: '4:5',
        status: 'Draft',
        eyebrow: isOps
          ? 'PRACTICE OPERATIONS'
          : isEd
            ? 'MEET AVAILABLE TALENT'
            : vertical === 'dental'
              ? 'FOR DENTAL PRACTICES'
              : pick(banks.eyebrows),
        headline: isOps ? pick(banks.saasHeadlines) : isEd ? t.firstName : pick(banks.practicePains),
        support: isEd ? t.title : pick(banks.supportStatements),
        bullets: isEd ? skills.slice(0, 3) : workflows,
        cta: isEd ? 'Meet This Candidate' : pick(banks.ctas),
        candidateId: isOps ? null : t.id,
        candidateName: isOps ? '' : t.firstName,
        role: isOps ? '' : t.title,
        imageId: img.id,
        imageSrc: isOps ? img.src : img.kind === 'talent' ? t.imagePath : img.src,
        imagePosition: { x: copySide === 'left' ? 62 : 35, y: 48 },
        imageZoom: 105 + Math.floor(rnd() * 10),
        overlayIntensity: isOps ? 0 : 15 + Math.floor(rnd() * 20),
        theme: laneDef.theme,
        layout: laneDef.layout,
        logoVariant: isOps ? 'white' : 'colored',
        copySide,
        showAudiencePill: !isEd && !isOps,
        showLogo: true,
        editorialHook: isEd ? pick(banks.practicePains) : '',
        competitorSource: p.name,
        sourceAdId: null,
        borrowedPrinciple: p.steal,
        rejectedPattern: p.reject,
        medvirtualRemix: p.remix,
        sourceInspiration: `Competitor Wall · ${p.name}`,
        internalNotes: '',
        motionTemplate: laneDef.motion,
        durationInFrames: laneDef.dur,
      };
      concept.imagePrompt = buildImagePrompt(concept);
      return concept;
    });
    save();
    render();
    flash('Four fresh concepts seeded');
  }

  root.addEventListener('input', (e) => {
    const card = e.target.closest('.ccl-card');
    if (!card) return;
    const index = Number(card.dataset.index);
    const bind = e.target.getAttribute('data-bind');
    if (!bind) return;
    const c = batch[index];
    if (bind === 'bullet0' || bind === 'bullet1' || bind === 'bullet2') {
      const bullets = [...c.bullets];
      bullets[Number(bind.slice(-1))] = plain(e.target.value);
      updateConcept(index, { bullets });
      return;
    }
    if (bind === 'imageX' || bind === 'imageY') {
      updateConcept(index, {
        imagePosition: {
          x: bind === 'imageX' ? Number(e.target.value) : c.imagePosition?.x ?? 50,
          y: bind === 'imageY' ? Number(e.target.value) : c.imagePosition?.y ?? 50,
        },
      });
      return;
    }
    if (bind === 'imageZoom' || bind === 'overlayIntensity') {
      updateConcept(index, { [bind]: Number(e.target.value) });
      return;
    }
    if (bind === 'showAudiencePill') {
      updateConcept(index, { showAudiencePill: e.target.value === 'true' });
      return;
    }
    updateConcept(index, { [bind]: plain(e.target.value) });
  });

  root.addEventListener('change', (e) => {
    // selects fire change
    const card = e.target.closest('.ccl-card');
    if (!card || !e.target.getAttribute('data-bind')) return;
    e.target.dispatchEvent(new Event('input', { bubbles: true }));
  });

  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action], [data-image-id]');
    if (!btn) return;
    const card = btn.closest('.ccl-card');
    if (!card) return;
    const index = Number(card.dataset.index);
    const action = btn.getAttribute('data-action');
    const imageId = btn.getAttribute('data-image-id');

    if (imageId) {
      const img = imageById(imageId);
      if (!img) return;
      updateConcept(index, {
        imageId: img.id,
        imageSrc: img.src,
        copySide: img.copyZone === 'right' ? 'right' : 'left',
        candidateId: img.talentId || batch[index].candidateId,
      });
      fillImageChooser(index);
      flash('Image updated');
      return;
    }

    if (action === 'toggle-images') {
      document.getElementById(`ccl-imgs-${index}`)?.classList.toggle('open');
      return;
    }
    if (action === 'trigger-upload') {
      document.getElementById(`ccl-upload-${index}`)?.click();
      return;
    }
    if (action === 'copy-prompt') {
      const text = batch[index].imagePrompt || buildImagePrompt(batch[index]);
      await navigator.clipboard.writeText(text);
      flash('Image prompt copied');
      return;
    }
    if (action === 'export-png') {
      await exportPng(index);
      return;
    }
    if (action === 'copy-json') {
      await navigator.clipboard.writeText(JSON.stringify(batch[index], null, 2));
      flash('Concept JSON copied');
      return;
    }
    if (action === 'promote') {
      const c = batch[index];
      localStorage.setItem(
        PROMOTE,
        JSON.stringify({
          promotedAt: new Date().toISOString(),
          concept: c,
          motionTemplate: c.motionTemplate,
        }),
      );
      window.location.href = `/motion-concept-lab.html?concept=${encodeURIComponent(c.id)}&from=static`;
      return;
    }
    if (action === 'to-video-brief') {
      const c = batch[index];
      localStorage.setItem(
        'mv-video-brief-promote-v1',
        JSON.stringify({
          promotedAt: new Date().toISOString(),
          concept: c,
        }),
      );
      window.location.href = `/video-production.html?from=static&concept=${encodeURIComponent(c.id)}#capture-brief`;
      return;
    }
    if (action === 'reset-one') {
      const ok = await confirmAction('Reset this concept to the default for its lane? Edits will be lost.');
      if (!ok) return;
      const defaults = structuredClone(DATA.defaultBatch);
      const byLane = defaults.find((d) => d.layout === batch[index].layout) || defaults[index];
      batch[index] = structuredClone(byLane);
      save();
      render();
      flash('Concept reset');
    }
  });

  root.addEventListener('change', (e) => {
    const input = e.target.closest('input[type="file"][data-action="upload-image"]');
    if (!input || !input.files?.[0]) return;
    const card = input.closest('.ccl-card');
    const index = Number(card.dataset.index);
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    updateConcept(index, {
      imageId: `local-upload-${index}`,
      imageSrc: url,
    });
    flash('Local image attached (browser-only)');
  });

  document.getElementById('ccl-reseed')?.addEventListener('click', async () => {
    const ok = await confirmAction('Reseed four concepts? The current batch (including edits) will be replaced.');
    if (!ok) return;
    reseedFromBanks();
  });

  document.getElementById('ccl-reset-batch')?.addEventListener('click', async () => {
    const ok = await confirmAction('Reset the entire batch to the four default concepts?');
    if (!ok) return;
    batch = structuredClone(DATA.defaultBatch);
    save();
    render();
    flash('Batch reset to defaults');
  });

  document.getElementById('ccl-export-batch')?.addEventListener('click', async () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), concepts: batch };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'medvirtual-creative-concept-batch.json';
    a.click();
    flash('Batch JSON exported');
  });

  document.getElementById('ccl-export-all-png')?.addEventListener('click', () => exportAllPngs());

  document.getElementById('ccl-import-batch')?.addEventListener('click', () => {
    document.getElementById('ccl-import-file')?.click();
  });

  document.getElementById('ccl-import-file')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : parsed?.concepts;
      if (!Array.isArray(list) || list.length !== 4) {
        flash('Import needs exactly four concepts');
        return;
      }
      batch = list.map((c, i) => sanitizeLocal(c, DATA.defaultBatch[i]));
      save();
      render();
      flash('Batch imported');
    } catch (err) {
      console.error(err);
      flash('Invalid JSON — import cancelled');
    }
    e.target.value = '';
  });

  // Deep link ?competitor=
  const params = new URLSearchParams(location.search);
  const competitor = params.get('competitor');
  if (competitor) {
    const p = DATA.competitorPrinciples.find((x) => x.id === competitor);
    if (p && batch[0]) {
      batch[0] = {
        ...batch[0],
        competitorSource: p.name,
        borrowedPrinciple: p.steal,
        rejectedPattern: p.reject,
        medvirtualRemix: p.remix,
        sourceInspiration: `Competitor Wall · ${p.name}`,
      };
      save();
    }
  }

  render();
})();
