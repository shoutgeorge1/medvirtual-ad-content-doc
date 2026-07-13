/**
 * Real People Creative — named Talent Pool profiles for Meta static + video tests.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import {
  BROLL_PLAN,
  FIRST_BATCH,
  MONDAY_REAL_PEOPLE_BATCH,
  SOURCE_CHECKED_AT,
  STRATEGY,
  STRONGEST_FOUR,
  SYNTHETIC_VIDEO_HANDOFF,
  TALENT,
  TALENT_POOL_URL,
  TREATMENT_C,
  talentById,
  treatmentCPackage,
} from './real-people-data.mjs';

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

function copyBtn(label, text) {
  return `<button type="button" class="copy-btn" data-copy="${esc(text)}">${esc(label)}</button>`;
}

function packageText(t, conceptKey) {
  const c = t.staticConcepts[conceptKey];
  if (!c) return '';
  if (conceptKey === 'bestStatic') {
    return [
      `PROFILE: ${t.fullPublicName}`,
      `TITLE: ${t.title}`,
      `SOURCE: ${t.profileUrl}`,
      '',
      `ON-IMAGE HOOK: ${c.onImageHook}`,
      `ON-IMAGE SUPPORT: ${c.onImageSupport}`,
      '',
      `PRIMARY TEXT:`,
      c.primaryText,
      '',
      `HEADLINE: ${c.metaHeadline}`,
      `DESCRIPTION: ${c.description}`,
      `CTA: ${c.cta}`,
    ].join('\n');
  }
  if (conceptKey === 'B') {
    return [
      `PROFILE: ${t.fullPublicName}`,
      `CONCEPT: ${c.label}`,
      `SOURCE: ${t.profileUrl}`,
      '',
      `ON-IMAGE PAIN: ${c.painImageCopy}`,
      `ON-IMAGE INTRO: ${c.onImageIntro}`,
      '',
      `PRIMARY TEXT:`,
      c.primaryText,
      '',
      `HEADLINE: ${c.headline}`,
      `DESCRIPTION: ${c.description}`,
      `CTA: ${c.cta}`,
    ].join('\n');
  }
  return [
    `PROFILE: ${t.fullPublicName}`,
    `CONCEPT: ${c.label}`,
    `SOURCE: ${t.profileUrl}`,
    '',
    `ON-IMAGE HEADLINE: ${c.onImageHeadline}`,
    `ON-IMAGE SUPPORT: ${c.onImageRoleSkill || c.onImageSupport || ''}`,
    '',
    `PRIMARY TEXT:`,
    c.primaryText,
    '',
    `HEADLINE: ${c.metaHeadline || c.headline}`,
    `DESCRIPTION: ${c.description}`,
    `CTA: ${c.cta}`,
  ].join('\n');
}

function skillChips(skills) {
  if (!skills?.length) {
    return `<span class="chip chip-muted">No separate skill tags listed on public profile</span>`;
  }
  return skills.map((s) => `<span class="chip">${esc(s)}</span>`).join('');
}

function mockupEditorial(t, ratio) {
  const skills = (t.listedSkills || []).slice(0, 3).join(' · ') || t.title;
  return `<div class="mock mock-${ratio} mock-editorial" data-talent="${esc(t.id)}" data-format="${esc(ratio)}" data-pain="${esc(t.operationalPains[0] || '')}" data-role="${esc(t.roles[0] || '')}">
    <img class="mock-photo" src="${esc(t.imagePath)}" alt="${esc(t.firstName)} — MedVirtual Talent Pool profile photo" width="1080" height="1080" loading="lazy" decoding="async" />
    <div class="mock-scrim"></div>
    <div class="mock-copy">
      <p class="mock-kicker">MEET ${esc(t.firstName.toUpperCase())}</p>
      <p class="mock-role">${esc(t.title)}</p>
      <p class="mock-skills">${esc(skills)}</p>
    </div>
    <img class="mock-logo" src="/assets/logo/medvirtual-logo.svg" alt="MedVirtual" width="96" height="28" />
  </div>`;
}

function mockupPain(t, ratio) {
  const pain =
    t.staticConcepts.B?.painImageCopy ||
    t.staticConcepts.bestStatic?.onImageHook ||
    'Need capable support?';
  return `<div class="mock mock-${ratio} mock-pain" data-talent="${esc(t.id)}" data-format="${esc(ratio)}" data-pain="${esc(t.operationalPains[0] || '')}" data-role="${esc(t.roles[0] || '')}">
    <img class="mock-photo" src="${esc(t.imagePath)}" alt="${esc(t.firstName)} — MedVirtual Talent Pool profile photo" width="1080" height="1080" loading="lazy" decoding="async" />
    <div class="mock-scrim mock-scrim-strong"></div>
    <div class="mock-copy mock-copy-pain">
      <p class="mock-pain-line">${esc(pain)}</p>
      <p class="mock-kicker">Meet ${esc(t.firstName)}</p>
      <p class="mock-role">${esc(t.title)}</p>
    </div>
    <img class="mock-logo" src="/assets/logo/medvirtual-logo.svg" alt="MedVirtual" width="96" height="28" />
  </div>`;
}

function treatmentCAssetPath(slug, ratio) {
  return `/assets/real-people/${slug}/ad-treatment-c-${ratio}.png`;
}

function renderTreatmentCPanel(tc) {
  const t = talentById(tc.talentId);
  if (!t) return '';
  const slug = t.assetSlug || t.id;
  const pkg = treatmentCPackage(tc);
  const defaultRatio = tc.primaryRatio || '4x5';
  const ratios = [
    { id: '4x5', label: '4:5' },
    { id: '1x1', label: '1:1' },
    { id: '9x16', label: '9:16' },
  ];
  return `<article class="tc-panel" data-talent="${esc(t.id)}" data-slug="${esc(slug)}">
    <div class="tc-panel__meta">
      <h3>${esc(tc.meetLine)} <span class="full-name">${esc(t.fullPublicName)}</span></h3>
      <p class="title-line">${esc(tc.role)}</p>
      <p class="tc-headline">${esc(tc.headlineLines.join(' / '))}</p>
      <ul class="tc-bullets">${tc.bullets.map((b) => `<li>${esc(b.text)} <span class="tc-src">[${esc(b.source)}]</span></li>`).join('')}</ul>
      <p class="tc-hierarchy"><strong>Hierarchy:</strong> pain headline → person → name+role → 3 bullets → CTA strip → larger logo. No fake Meta CTA in artwork.</p>
    </div>
    <div class="tc-panel__preview">
      <div class="tc-controls">
        ${ratios
          .map(
            (r) =>
              `<button type="button" class="tc-ratio-btn${r.id === defaultRatio ? ' is-active' : ''}" data-set-ratio="${r.id}">Preview ${esc(r.label)}</button>`,
          )
          .join('')}
        <button type="button" class="tc-safe-btn" data-toggle-safe>Toggle safe-zone guides</button>
        <a class="tc-dl" data-dl-preview href="${esc(treatmentCAssetPath(slug, defaultRatio))}" download>Download preview PNG</a>
        ${copyBtn('Copy final ad package', pkg)}
      </div>
      <div class="tc-stage" data-ratio="${esc(defaultRatio)}">
        <img src="${esc(treatmentCAssetPath(slug, defaultRatio))}" alt="${esc(tc.meetLine)} Treatment C ${esc(defaultRatio)} preview" width="1080" height="1350" loading="lazy" decoding="async" />
      </div>
      <p class="tc-safe-note">Safe-zone bars are review-only on 9:16 preview — they are not baked into the downloaded PNGs.</p>
    </div>
  </article>`;
}

function renderRecommendCard(t) {
  const skills = (t.listedSkills || []).slice(0, 5);
  const badge = t.recommendedFirstBatch
    ? `<span class="badge-rec">Recommended first batch</span>`
    : `<span class="badge-alt">Strong alternate</span>`;
  return `<article class="talent-card" data-talent="${esc(t.id)}" data-role="${esc(t.roles.join(' '))}" data-pain="${esc(t.operationalPains.join(' '))}" data-format="${esc(t.formats.join(' '))}" data-batch="${t.recommendedFirstBatch ? 'yes' : 'no'}">
    <div class="talent-card__media">
      <img src="${esc(t.imagePath)}" alt="${esc(t.fullPublicName)} profile photo from MedVirtual Talent Pool" width="320" height="320" loading="lazy" decoding="async" />
      ${badge}
    </div>
    <div class="talent-card__body">
      <h3>${esc(t.firstName)} <span class="full-name">${esc(t.fullPublicName)}</span></h3>
      <p class="title-line"><span class="fact-label">Public title</span> ${esc(t.title)}</p>
      <p class="title-line muted"><span class="fact-label">Position tag</span> ${esc(t.publicPosition)}</p>
      <div class="chips">${skillChips(skills)}</div>
      <p class="why"><strong>Why relevant:</strong> ${esc(t.roleRelevance)}</p>
      <p class="why"><strong>Recommended angle:</strong> ${esc(t.recommendedAngles[0])}</p>
      <p class="why"><strong>Recommended format:</strong> ${esc(t.staticConcepts.bestStatic.format)} static · optional 9:16 cover</p>
      <p class="source"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Open Talent Pool profile</a></p>
    </div>
  </article>`;
}

function renderConceptBlock(t, key) {
  const c = t.staticConcepts[key];
  if (!c) return '';
  const pkg = packageText(t, key);
  if (key === 'bestStatic') {
    return `<div class="concept-block suggested" data-talent="${esc(t.id)}" data-format="static-${c.format.replace(':', 'x')}" data-pain="${esc(t.operationalPains[0] || '')}" data-role="${esc(t.roles[0] || '')}">
      <div class="concept-head">
        <h4>Best recommended static</h4>
        <span class="tag-suggested">Suggested ad copy</span>
      </div>
      <dl class="fields">
        <div><dt>On-image hook (≤10 words)</dt><dd>${esc(c.onImageHook)}</dd></div>
        <div><dt>Supporting line (≤14 words)</dt><dd>${esc(c.onImageSupport)}</dd></div>
        <div><dt>Primary text</dt><dd class="pre">${esc(c.primaryText)}</dd></div>
        <div><dt>Meta headline</dt><dd>${esc(c.metaHeadline)}</dd></div>
        <div><dt>Description</dt><dd>${esc(c.description)}</dd></div>
        <div><dt>CTA</dt><dd><span class="badge-cta">${esc(c.cta)}</span></dd></div>
        <div><dt>Format / treatment</dt><dd>${esc(c.format)} · ${esc(c.treatment)}</dd></div>
      </dl>
      <div class="copy-row">
        ${copyBtn('Copy primary text', c.primaryText)}
        ${copyBtn('Copy headline', c.metaHeadline)}
        ${copyBtn('Copy full package', pkg)}
      </div>
    </div>`;
  }

  const headline = c.metaHeadline || c.headline || '';
  const onImage =
    key === 'B'
      ? `<div><dt>Pain-first image copy</dt><dd>${esc(c.painImageCopy)}</dd></div>
         <div><dt>Person intro on image</dt><dd>${esc(c.onImageIntro)}</dd></div>`
      : `<div><dt>On-image headline</dt><dd>${esc(c.onImageHeadline)}</dd></div>
         <div><dt>Role / skill line</dt><dd>${esc(c.onImageRoleSkill || c.onImageSupport || '')}</dd></div>`;

  return `<div class="concept-block suggested" data-talent="${esc(t.id)}" data-format="static" data-pain="${esc(t.operationalPains[0] || '')}" data-role="${esc(t.roles[0] || '')}">
    <div class="concept-head">
      <h4>Concept ${key} — ${esc(c.label)}</h4>
      <span class="tag-suggested">Suggested ad copy</span>
    </div>
    <dl class="fields">
      ${onImage}
      <div><dt>Primary text</dt><dd class="pre">${esc(c.primaryText)}</dd></div>
      <div><dt>Headline</dt><dd>${esc(headline)}</dd></div>
      <div><dt>Description</dt><dd>${esc(c.description)}</dd></div>
      <div><dt>CTA</dt><dd><span class="badge-cta">${esc(c.cta)}</span></dd></div>
      <div><dt>Production note</dt><dd>${esc(c.productionNote)}</dd></div>
    </dl>
    <div class="copy-row">
      ${copyBtn('Copy primary text', c.primaryText)}
      ${copyBtn('Copy headline', headline)}
      ${copyBtn('Copy full package', pkg)}
    </div>
  </div>`;
}

function renderProfileCreative(t) {
  const facts = t.exactPublicFacts || {};
  const factsList = [
    `Name: ${t.fullPublicName}`,
    `Title / experience: ${t.title}`,
    `Approved position: ${t.publicPosition}`,
    facts.employmentType ? `Employment type shown: ${facts.employmentType}` : null,
    facts.shiftBlock ? `Shift block shown: ${facts.shiftBlock}` : null,
    t.listedSkills.length
      ? `Listed skills: ${t.listedSkills.join('; ')}`
      : 'Listed skills: (none on public profile at source check)',
    facts.specializationShown?.length
      ? `Specializations shown: ${facts.specializationShown.join('; ')}`
      : null,
  ]
    .filter(Boolean)
    .map((x) => `<li>${esc(x)}</li>`)
    .join('');

  return `<section class="profile-section" id="profile-${esc(t.id)}" data-talent="${esc(t.id)}" data-role="${esc(t.roles.join(' '))}" data-pain="${esc(t.operationalPains.join(' '))}" data-format="${esc(t.formats.join(' '))}" data-batch="${t.recommendedFirstBatch ? 'yes' : 'no'}">
    <header class="profile-head">
      <img class="profile-avatar" src="${esc(t.imagePath)}" alt="${esc(t.fullPublicName)}" width="96" height="96" loading="lazy" />
      <div>
        <h3>${esc(t.firstName)} <span class="full-name">${esc(t.fullPublicName)}</span>
          ${t.recommendedFirstBatch ? '<span class="badge-rec">Recommended first batch</span>' : ''}
        </h3>
        <p class="title-line">${esc(t.title)}</p>
        <p class="source"><a href="${esc(t.profileUrl)}" target="_blank" rel="noopener noreferrer">Source profile</a> · checked ${esc(t.sourceCheckedAt)}</p>
      </div>
    </header>

    <div class="split-facts">
      <div class="fact-box">
        <h4>Exact public profile facts</h4>
        <ul>${factsList}</ul>
      </div>
      <div class="suggest-box">
        <h4>Suggested advertising copy</h4>
        <p>Concepts A–D and the best static below are marketing drafts. They must not be stored or presented as Talent Pool facts.</p>
      </div>
    </div>

    ${renderConceptBlock(t, 'bestStatic')}
    ${renderConceptBlock(t, 'A')}
    ${renderConceptBlock(t, 'B')}
    ${renderConceptBlock(t, 'C')}
    ${renderConceptBlock(t, 'D')}

    ${(() => {
      const tc = TREATMENT_C.find((x) => x.talentId === t.id);
      if (!tc) return '';
      return `<div class="tc-profile-block">
      <h4 class="tc-profile-heading">Treatment C — Pain + Person + Capabilities</h4>
      <p class="tc-profile-note">Primary polished mockup for this profile. Pre-generated PNGs · larger logo already in file · no fake Meta CTA.</p>
      ${renderTreatmentCPanel(tc)}
    </div>`;
    })()}

    <p class="mock-alt-label">Alternate treatments (HTML/CSS editorial mocks)</p>
    <div class="mock-grid">
      <div>
        <p class="mock-label">Treatment A · Editorial · 1:1</p>
        ${mockupEditorial(t, '1x1')}
      </div>
      <div>
        <p class="mock-label">Treatment A · Editorial · 4:5</p>
        ${mockupEditorial(t, '4x5')}
      </div>
      <div>
        <p class="mock-label">Treatment B · Pain-first · 9:16</p>
        ${mockupPain(t, '9x16')}
      </div>
    </div>

    ${(t.videoScripts || [])
      .map(
        (v) => `<div class="video-block suggested" data-talent="${esc(t.id)}" data-format="iphone-video" data-pain="${esc(t.operationalPains[0] || '')}" data-role="${esc(t.roles[0] || '')}">
      <div class="concept-head">
        <h4>iPhone video script · ${esc(v.estimatedDuration)}</h4>
        <span class="tag-suggested">Suggested script</span>
      </div>
      <dl class="fields">
        <div><dt>Spoken</dt><dd class="pre">${esc(v.spoken)}</dd></div>
        <div><dt>Opening visual</dt><dd>${esc(v.openingVisual)}</dd></div>
        <div><dt>B-roll</dt><dd>${esc(v.broll.join(' · '))}</dd></div>
        <div><dt>Captions</dt><dd>${esc(v.captions.join(' / '))}</dd></div>
        <div><dt>Final frame</dt><dd>${esc(v.finalFrame)}</dd></div>
      </dl>
      ${copyBtn('Copy spoken script', v.spoken)}
    </div>`,
      )
      .join('')}
  </section>`;
}

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 3rem; }
  .hero {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.15rem 1.25rem; margin-bottom: 0.75rem;
  }
  .hero h2 { font-size: 1.2rem; margin-bottom: 0.4rem; }
  .hero p { font-size: 0.88rem; color: #cbd5e1; max-width: 62ch; }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
  .hero-pill {
    font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.55rem; border-radius: 6px;
    background: rgba(13,148,136,0.25); border: 1px solid rgba(94,234,212,0.35); color: #ccfbf1;
  }
  .section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 0.9rem 1rem; margin-bottom: 0.7rem;
  }
  .section > h2 {
    font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;
    color: #64748b; margin-bottom: 0.5rem;
  }
  .section p, .section li { font-size: 0.86rem; color: #334155; }
  .hyp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.55rem; }
  @media (max-width: 700px) { .hyp-grid { grid-template-columns: 1fr; } }
  .hyp-card {
    background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0d9488;
    border-radius: 8px; padding: 0.55rem 0.65rem;
  }
  .hyp-card strong { display: block; font-size: 0.8rem; color: #0f172a; margin-bottom: 0.15rem; }
  .hyp-card span { font-size: 0.76rem; color: #64748b; }
  .filters {
    display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: end;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.7rem 0.85rem; margin-bottom: 0.7rem;
    position: sticky; top: 72px; z-index: 30;
  }
  .filters label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; display: grid; gap: 0.2rem; }
  .filters select {
    font-size: 0.8rem; padding: 0.35rem 0.45rem; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; min-width: 140px;
  }
  .filters .filter-note { font-size: 0.72rem; color: #64748b; margin-left: auto; }
  .talent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 800px) { .talent-grid { grid-template-columns: 1fr; } }
  .talent-card {
    display: grid; grid-template-columns: 140px 1fr; gap: 0.75rem;
    border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff;
  }
  @media (max-width: 560px) { .talent-card { grid-template-columns: 1fr; } }
  .talent-card__media { position: relative; background: #0f172a; min-height: 140px; }
  .talent-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 1; }
  .talent-card__body { padding: 0.65rem 0.7rem 0.75rem; }
  .talent-card h3 { font-size: 1rem; margin-bottom: 0.25rem; }
  .full-name { font-size: 0.72rem; font-weight: 600; color: #64748b; }
  .title-line { font-size: 0.82rem; margin: 0.15rem 0; color: #1e293b; }
  .title-line.muted { color: #64748b; font-size: 0.78rem; }
  .fact-label { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-right: 0.25rem; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.25rem; margin: 0.4rem 0; }
  .chip {
    font-size: 0.68rem; font-weight: 650; padding: 0.18rem 0.45rem; border-radius: 999px;
    background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4;
  }
  .chip-muted { background: #f8fafc; color: #64748b; border-color: #e2e8f0; }
  .why { font-size: 0.78rem; color: #475569; margin: 0.25rem 0; }
  .source { font-size: 0.76rem; margin-top: 0.4rem; }
  .source a { color: #0d9488; font-weight: 700; text-decoration: none; }
  .source a:hover { text-decoration: underline; }
  .badge-rec, .badge-alt, .badge-cta, .tag-suggested, .tag-fact {
    display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 0.18rem 0.45rem; border-radius: 5px;
  }
  .badge-rec { background: #0d9488; color: #fff; }
  .badge-alt { background: #e2e8f0; color: #475569; }
  .badge-cta { background: #0d9488; color: #fff; }
  .talent-card__media .badge-rec, .talent-card__media .badge-alt {
    position: absolute; left: 0.4rem; bottom: 0.4rem;
  }
  .profile-section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 0.85rem;
  }
  .profile-head { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; }
  .profile-avatar { width: 72px; height: 72px; border-radius: 12px; object-fit: cover; border: 2px solid #e2e8f0; }
  .split-facts { display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.55rem; margin-bottom: 0.65rem; }
  @media (max-width: 700px) { .split-facts { grid-template-columns: 1fr; } }
  .fact-box, .suggest-box { border-radius: 8px; padding: 0.55rem 0.7rem; font-size: 0.8rem; }
  .fact-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #334155; }
  .suggest-box { background: #f0fdfa; border: 1px solid #99f6e4; border-left: 3px solid #0d9488; }
  .fact-box h4, .suggest-box h4 { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.3rem; }
  .fact-box ul { padding-left: 1rem; }
  .fact-box li { margin: 0.12rem 0; font-size: 0.78rem; }
  .concept-block {
    border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.65rem 0.75rem; margin-bottom: 0.55rem; background: #fafafa;
  }
  .concept-head { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
  .concept-head h4 { font-size: 0.88rem; }
  .tag-suggested { background: #ecfdf5; color: #0f766e; border: 1px solid #99f6e4; }
  .fields > div { margin-bottom: 0.35rem; }
  .fields dt { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; }
  .fields dd { font-size: 0.82rem; color: #1e293b; }
  .fields dd.pre { white-space: pre-wrap; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.45rem 0.55rem; }
  .copy-row { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.4rem; }
  .copy-btn {
    font-size: 0.72rem; font-weight: 650; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 6px; padding: 0.3rem 0.55rem; cursor: pointer;
  }
  .copy-btn:hover { background: #ccfbf1; }
  .copy-btn.copied { background: #0d9488; color: #fff; border-color: #0d9488; }
  .mock-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; margin: 0.75rem 0; }
  @media (max-width: 900px) { .mock-grid { grid-template-columns: 1fr; max-width: 360px; } }
  .mock-label { font-size: 0.68rem; font-weight: 700; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase; }
  .mock {
    position: relative; width: 100%; border-radius: 10px; overflow: hidden; background: #0f172a;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  }
  .mock-1x1 { aspect-ratio: 1 / 1; }
  .mock-4x5 { aspect-ratio: 4 / 5; }
  .mock-9x16 { aspect-ratio: 9 / 16; }
  .mock-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .mock-scrim {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(15,23,42,0.15) 20%, rgba(15,23,42,0.82) 100%);
  }
  .mock-scrim-strong {
    background: linear-gradient(180deg, rgba(15,23,42,0.45) 10%, rgba(15,23,42,0.88) 100%);
  }
  .mock-copy { position: absolute; left: 6%; right: 6%; bottom: 12%; color: #fff; }
  .mock-kicker { font-size: clamp(0.95rem, 2.8vw, 1.25rem); font-weight: 850; letter-spacing: 0.02em; }
  .mock-role { font-size: clamp(0.72rem, 2vw, 0.92rem); font-weight: 650; margin-top: 0.2rem; color: #e2e8f0; }
  .mock-skills { font-size: clamp(0.62rem, 1.7vw, 0.78rem); margin-top: 0.35rem; color: #99f6e4; }
  .mock-pain-line { font-size: clamp(0.95rem, 3vw, 1.2rem); font-weight: 850; line-height: 1.2; margin-bottom: 0.45rem; }
  .mock-logo {
    position: absolute; top: 5%; right: 5%; width: 18%; max-width: 88px; height: auto;
    filter: brightness(0) invert(1); opacity: 0.92;
  }
  .video-block { border: 1px dashed #99f6e4; border-radius: 10px; padding: 0.65rem 0.75rem; margin-top: 0.4rem; background: #f8fffd; }
  .matrix { width: 100%; border-collapse: collapse; font-size: 0.76rem; }
  .matrix th, .matrix td { border: 1px solid #e2e8f0; padding: 0.4rem 0.45rem; text-align: left; vertical-align: top; }
  .matrix th { background: #f8fafc; font-size: 0.65rem; text-transform: uppercase; color: #64748b; }
  .matrix tr[data-rec="true"] { background: #f0fdfa; }
  .checklist { columns: 2; gap: 1rem; padding-left: 1.1rem; }
  @media (max-width: 700px) { .checklist { columns: 1; } }
  .checklist li { font-size: 0.8rem; margin: 0.2rem 0; break-inside: avoid; }
  .settings { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
  .settings span {
    font-size: 0.7rem; font-weight: 650; padding: 0.25rem 0.45rem; border-radius: 6px;
    background: #0f172a; color: #e2e8f0;
  }
  .toc { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.4rem 0 0.2rem; }
  .toc a {
    font-size: 0.72rem; font-weight: 650; color: #0f766e; text-decoration: none;
    padding: 0.25rem 0.5rem; border: 1px solid #99f6e4; border-radius: 6px; background: #f0fdfa;
  }
  .strong-list { display: grid; gap: 0.4rem; }
  .strong-item { padding: 0.5rem 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
  .strong-item strong { display: block; font-size: 0.84rem; margin-bottom: 0.15rem; }
  .tc-grid { display: grid; gap: 0.85rem; }
  .tc-panel {
    display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 0.85rem;
    border: 2px solid #0d9488; border-radius: 12px; padding: 0.75rem; background: #f8fffd;
  }
  @media (max-width: 800px) { .tc-panel { grid-template-columns: 1fr; } }
  .tc-panel__meta h3 { font-size: 1rem; margin-bottom: 0.2rem; }
  .tc-headline { font-size: 0.9rem; font-weight: 800; color: #0f172a; margin: 0.35rem 0; }
  .tc-bullets { padding-left: 1.1rem; margin: 0.35rem 0; }
  .tc-bullets li { font-size: 0.8rem; margin: 0.12rem 0; color: #334155; }
  .tc-src { font-size: 0.68rem; color: #94a3b8; font-weight: 600; }
  .tc-hierarchy { font-size: 0.76rem; color: #64748b; margin-top: 0.45rem; }
  .tc-controls { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
  .tc-controls button, .tc-controls .tc-dl, .tc-controls .copy-btn {
    font-size: 0.72rem; font-weight: 650; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 6px; padding: 0.3rem 0.55rem; cursor: pointer; text-decoration: none;
  }
  .tc-controls button:hover, .tc-controls .tc-dl:hover { background: #ccfbf1; }
  .tc-controls .tc-ratio-btn.is-active { background: #0d9488; color: #fff; border-color: #0d9488; }
  .tc-stage {
    position: relative; width: 100%; max-width: 320px; border-radius: 10px; overflow: hidden;
    background: #0f172a; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  }
  .tc-stage[data-ratio="4x5"] { aspect-ratio: 4 / 5; }
  .tc-stage[data-ratio="1x1"] { aspect-ratio: 1 / 1; }
  .tc-stage[data-ratio="9x16"] { aspect-ratio: 9 / 16; }
  .tc-stage img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .tc-stage.safe-zone[data-ratio="9x16"]::before,
  .tc-stage.safe-zone[data-ratio="9x16"]::after {
    content: ''; position: absolute; left: 0; right: 0; height: 8%;
    background: rgba(248, 113, 113, 0.4); z-index: 2; pointer-events: none;
  }
  .tc-stage.safe-zone[data-ratio="9x16"]::before { top: 0; }
  .tc-stage.safe-zone[data-ratio="9x16"]::after { bottom: 0; }
  .tc-safe-note { font-size: 0.7rem; color: #94a3b8; margin-top: 0.35rem; max-width: 320px; }
  .tc-profile-block { margin: 0.75rem 0; }
  .tc-profile-heading { font-size: 0.88rem; margin-bottom: 0.25rem; color: #0f766e; }
  .tc-profile-note { font-size: 0.76rem; color: #64748b; margin-bottom: 0.45rem; }
  .mock-alt-label {
    font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em;
    color: #64748b; margin: 0.85rem 0 0.35rem;
  }
  .monday-compact li, .synth-compact li { font-size: 0.82rem; margin: 0.18rem 0; color: #334155; }
  .monday-compact { padding-left: 1.1rem; margin: 0.4rem 0; }
  .synth-compact { padding-left: 1.1rem; columns: 2; gap: 1rem; }
  @media (max-width: 700px) { .synth-compact { columns: 1; } }
  .is-hidden { display: none !important; }
  .toast {
    position: fixed; bottom: 1rem; right: 1rem; background: #0f172a; color: #fff;
    padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.78rem; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 50;
  }
  .toast.show { opacity: 1; }
`;

const strongestHtml = STRONGEST_FOUR.map(
  (s) => `<div class="strong-item"><strong>${esc(s.name)}</strong><span>${esc(s.why)}</span></div>`,
).join('');

const matrixRows = FIRST_BATCH.map(
  (r) => `<tr data-rec="${r.recommended ? 'true' : 'false'}">
    <td>${esc(r.concept)}${r.recommended ? ' · ★' : ''}</td>
    <td>${esc(r.talentId)}</td>
    <td>${esc(r.format)}</td>
    <td>${esc(r.hook)}</td>
    <td>${esc(r.operationalProblem)}</td>
    <td>${esc(r.mainVariation)}</td>
    <td>${esc(r.status)}</td>
    <td>${esc(r.assetNeeded)}</td>
  </tr>`,
).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Real People Creative — MedVirtual</title>
  <meta name="description" content="Named MedVirtual Talent Pool profiles for Meta static ads, Reels, and short iPhone videos." />
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'real-people',
    pageTitle: 'Real People Creative',
    pageSubtitle:
      'Replace stock staffing ads with named MedVirtual Talent Pool profiles — static, carousel, Reels, and short video concepts.',
  })}
  <div class="wrap">
    <section class="hero" id="strategy">
      <h2>Strategy introduction</h2>
      <p>${esc(STRATEGY.intro)}</p>
      <div class="hero-meta">
        <span class="hero-pill">Creative hypotheses — not proven winners</span>
        <span class="hero-pill">Source checked ${esc(SOURCE_CHECKED_AT)}</span>
        <span class="hero-pill"><a href="${esc(TALENT_POOL_URL)}" style="color:#ccfbf1;text-decoration:none" target="_blank" rel="noopener noreferrer">Public Talent Pool</a></span>
      </div>
    </section>

    <section class="section">
      <h2>Why this may work</h2>
      <p style="margin-bottom:0.35rem;color:#64748b;font-size:0.8rem">Labeled as creative hypotheses only. Do not treat as performance claims.</p>
      <div class="hyp-grid">
        ${STRATEGY.whyMayWork
          .map(
            (h) => `<div class="hyp-card"><strong>${esc(h.title)}</strong><span>${esc(h.note)}</span></div>`,
          )
          .join('')}
      </div>
    </section>

    <nav class="toc" aria-label="On this page">
      <a href="#treatment-c">Treatment C</a>
      <a href="#first-test">First test</a>
      <a href="#profiles">Profile cards</a>
      <a href="#monday-graphics">Monday graphics</a>
      <a href="#synthetic-handoff">Synthetic video</a>
      <a href="#mockups-note">Mockups</a>
      <a href="#broll">B-roll plan</a>
      <a href="#test-plan">Test plan</a>
      <a href="#strongest">Strongest four</a>
    </nav>

    <div class="filters" id="filters">
      <label>Role
        <select id="filter-role">
          <option value="all">All roles</option>
          <option value="medical-admin">Medical admin</option>
          <option value="front-office">Front office</option>
          <option value="patient-scheduling">Scheduling</option>
          <option value="patient-intake">Patient intake</option>
          <option value="insurance-verification">Insurance verification</option>
          <option value="billing-support">Billing support</option>
          <option value="patient-calls">Patient calls</option>
        </select>
      </label>
      <label>Format
        <select id="filter-format">
          <option value="all">All formats</option>
          <option value="static-1x1">1:1 static</option>
          <option value="static-4x5">4:5 static</option>
          <option value="story-9x16">9:16 story</option>
          <option value="reel">Reel</option>
          <option value="iphone-video">iPhone video</option>
        </select>
      </label>
      <label>Operational pain
        <select id="filter-pain">
          <option value="all">All pains</option>
          <option value="admin-backlog">Admin backlog</option>
          <option value="front-desk">Front desk</option>
          <option value="scheduling">Scheduling</option>
          <option value="patient-calls">Patient calls</option>
          <option value="patient-intake">Patient intake</option>
          <option value="insurance-verification">Insurance verification</option>
          <option value="billing-support">Billing support</option>
        </select>
      </label>
      <label>Batch
        <select id="filter-batch">
          <option value="all">All profiles</option>
          <option value="yes">Recommended first batch</option>
        </select>
      </label>
      <p class="filter-note">Filters profile cards + concept sections below.</p>
    </div>

    <section class="section" id="treatment-c">
      <h2>Treatment C — Pain + Person + Capabilities</h2>
      <p style="margin-bottom:0.65rem">Primary polished mockups for the Monday first batch. Pre-generated PNGs with larger MedVirtual logo already in file — no fake Meta CTA. Hierarchy: pain headline → person → name+role → 3 bullets → CTA strip → larger logo.</p>
      <div class="tc-grid">
        ${TREATMENT_C.map(renderTreatmentCPanel).join('')}
      </div>
    </section>

    <section class="section" id="first-test">
      <h2>Recommended first test · ${TALENT.length} profiles</h2>
      <p style="margin-bottom:0.65rem">Selected for complete public profiles, usable headshots, role relevance to medical practices, and operational variety — not appearance.</p>
      <div class="talent-grid">
        ${TALENT.map(renderRecommendCard).join('')}
      </div>
    </section>

    <section class="section" id="strongest">
      <h2>Strongest four recommended ad concepts</h2>
      <div class="strong-list">${strongestHtml}</div>
    </section>

    <div id="profiles">
      <section class="section" style="margin-bottom:0.5rem">
        <h2>Profile creative cards</h2>
        <p>Each profile separates exact Talent Pool facts from suggested Meta copy. Copy buttons capture primary text, headline, or the full package.</p>
      </section>
      ${TALENT.map(renderProfileCreative).join('')}
    </div>

    <section class="section" id="monday-graphics">
      <h2>Monday Graphics Request</h2>
      <p style="margin-bottom:0.4rem">First production batch only — four Treatment C ads (1080×1350 primary). Raw crops and downloads: <a href="/real-people-assets.html" style="color:#0d9488;font-weight:700;text-decoration:none">Real People Assets</a>.</p>
      <ul class="monday-compact">
        ${MONDAY_REAL_PEOPLE_BATCH.map((row) => {
          const t = talentById(row.talentId);
          return `<li><strong>${esc(t?.firstName || row.talentId)}</strong> — ${esc(row.angle)}${row.treatmentC ? ' · Treatment C' : ''}</li>`;
        }).join('')}
      </ul>
    </section>

    <section class="section" id="synthetic-handoff">
      <h2>Synthetic Video Handoff</h2>
      <p style="margin-bottom:0.4rem;font-size:0.8rem;color:#64748b">Rules for any AI-animated draft. Still-image approval does not auto-approve synthetic animation.</p>
      <ul class="synth-compact">${SYNTHETIC_VIDEO_HANDOFF.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </section>

    <section class="section" id="mockups-note">
      <h2>Visual mockups</h2>
      <p>Treatment C PNGs above are the primary polished mockups. Inside each profile: Treatment C (when in first batch) plus alternate HTML/CSS editorial A/B mocks (1:1, 4:5, pain-first 9:16). Hierarchy for Treatment C: pain headline → person → name+role → 3 bullets → CTA strip → larger logo. No fake Meta CTA inside artwork.</p>
    </section>

    <section class="section" id="broll">
      <h2>Office B-roll plan</h2>
      <p style="margin-bottom:0.4rem">Compact checklist for Ronald or an in-house videographer.</p>
      <ul class="checklist">
        ${BROLL_PLAN.shots.map((s) => `<li>${esc(s)}</li>`).join('')}
      </ul>
      <div class="settings">
        ${BROLL_PLAN.settings.map((s) => `<span>${esc(s)}</span>`).join('')}
      </div>
    </section>

    <section class="section" id="test-plan">
      <h2>Fast-iteration test plan</h2>
      <p style="margin-bottom:0.5rem">Small first batch: 3 named profile statics, 1 pain-first static, 2 direct-to-camera clips, 1 office montage, 1 Ronald walkthrough. These are creative hypotheses — not predetermined winners. Keep the matrix manageable; do not explode into dozens of near-duplicates.</p>
      <div style="overflow-x:auto">
        <table class="matrix">
          <thead>
            <tr>
              <th>Concept</th><th>Talent</th><th>Format</th><th>Hook</th>
              <th>Operational problem</th><th>Main variation</th><th>Status</th><th>Asset needed</th>
            </tr>
          </thead>
          <tbody>${matrixRows}</tbody>
        </table>
      </div>
    </section>
  </div>
  <div class="toast" id="toast" role="status">Copied</div>
  <script>
    (function () {
      const toast = document.getElementById('toast');
      function flash(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1200);
      }
      document.querySelectorAll('[data-copy]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const text = btn.getAttribute('data-copy') || '';
          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            flash('Copied');
            setTimeout(() => btn.classList.remove('copied'), 900);
          } catch (e) {
            flash('Copy failed');
          }
        });
      });

      const role = document.getElementById('filter-role');
      const format = document.getElementById('filter-format');
      const pain = document.getElementById('filter-pain');
      const batch = document.getElementById('filter-batch');
      const targets = () => document.querySelectorAll('[data-talent].talent-card, .profile-section');

      function applyFilters() {
        const r = role.value;
        const f = format.value;
        const p = pain.value;
        const b = batch.value;
        targets().forEach((el) => {
          const okRole = r === 'all' || (el.dataset.role || '').includes(r);
          const okFormat = f === 'all' || (el.dataset.format || '').includes(f);
          const okPain = p === 'all' || (el.dataset.pain || '').includes(p);
          const okBatch = b === 'all' || el.dataset.batch === b;
          el.classList.toggle('is-hidden', !(okRole && okFormat && okPain && okBatch));
        });
      }
      [role, format, pain, batch].forEach((el) => el.addEventListener('change', applyFilters));

      document.querySelectorAll('.tc-panel').forEach((panel) => {
        const stage = panel.querySelector('.tc-stage');
        const img = panel.querySelector('.tc-stage img');
        const dl = panel.querySelector('[data-dl-preview]');
        const slug = panel.dataset.slug;
        if (!stage || !img || !slug) return;

        panel.querySelectorAll('[data-set-ratio]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const ratio = btn.getAttribute('data-set-ratio') || '4x5';
            stage.dataset.ratio = ratio;
            const src = '/assets/real-people/' + slug + '/ad-treatment-c-' + ratio + '.png';
            img.src = src;
            if (dl) dl.href = src;
            panel.querySelectorAll('[data-set-ratio]').forEach((b) => b.classList.toggle('is-active', b === btn));
            if (ratio !== '9x16') stage.classList.remove('safe-zone');
          });
        });

        panel.querySelector('[data-toggle-safe]')?.addEventListener('click', () => {
          if (stage.dataset.ratio !== '9x16') {
            flash('Safe-zone guides are for 9:16 only');
            return;
          }
          stage.classList.toggle('safe-zone');
        });
      });
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'real-people-creative.html'), html);
console.log('Wrote public/real-people-creative.html');
console.log(`Profiles: ${TALENT.map((t) => t.firstName).join(', ')}`);
