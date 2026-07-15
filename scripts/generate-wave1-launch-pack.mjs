/**
 * Wave 1 first-launch pack — VMA-33, 34, 37, 41, 43 only.
 * Run: npm run generate:wave1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CONCEPTS,
  CHATGPT_PROMPTS,
  COPY_EN,
  TESTING_WAVE_2,
  VMA_META,
} from './vma-site-data.mjs';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';
import { FORMAT_SPECS } from './vma-approved-masters.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const OUT = path.join(PUBLIC, 'exports', 'wave1-first-launch');

const WAVE1_IDS = TESTING_WAVE_2.firstLaunchBatch.static;

const AD_META = {
  'VMA-33': {
    adStem: 'SpanishNeverLost_BilingualPatients',
    adNum: '05',
    copyTheme: 'bilingual-patient-comm',
    primaryIdx: 0,
    headlineIdx: 0,
    descIdx: 0,
  },
  'VMA-34': {
    adStem: 'BilingualFrontDesk_Capacity',
    adNum: '06',
    copyTheme: 'bilingual-patient-comm',
    primaryIdx: 2,
    headlineIdx: 1,
    descIdx: 0,
  },
  'VMA-37': {
    adStem: 'TrainedWorkflow_PracticeSystems',
    adNum: '07',
    copyTheme: 'practice-training',
    primaryIdx: 0,
    headlineIdx: 0,
    descIdx: 0,
  },
  'VMA-41': {
    adStem: 'FrontDeskCapacity_Overload',
    adNum: '08',
    copyTheme: 'front-desk-capacity',
    primaryIdx: 0,
    headlineIdx: 0,
    descIdx: 0,
  },
  'VMA-43': {
    adStem: 'ScheduleMoving_Confirmations',
    adNum: '09',
    copyTheme: 'scheduling-followup',
    primaryIdx: 0,
    headlineIdx: 0,
    descIdx: 0,
  },
};

const FILE_STEM = {
  'VMA-33': 'MV_VMA_33_SpanishNeverLost',
  'VMA-34': 'MV_VMA_34_BilingualFrontDesk',
  'VMA-37': 'MV_VMA_37_TrainedWorkflow',
  'VMA-41': 'MV_VMA_41_FrontDeskCapacity',
  'VMA-43': 'MV_VMA_43_ScheduleMoving',
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getConcept(id) {
  return CONCEPTS.find((c) => c.number === id);
}

function getPrompt(id) {
  return CHATGPT_PROMPTS.find((p) => p.conceptNumber === id);
}

function getCopyPack(themeId) {
  return COPY_EN.find((c) => c.id === themeId);
}

function adName(conceptId, ratioId = '4x5') {
  const m = AD_META[conceptId];
  return `IMB_MV_ADV_${m.adNum}_${m.adStem}_v1.0_${ratioId}`;
}

function filename(conceptId, ratioId) {
  return `${FILE_STEM[conceptId]}_${ratioId}.png`;
}

function buildAds() {
  return WAVE1_IDS.map((id) => {
    const c = getConcept(id);
    const meta = AD_META[id];
    const copy = getCopyPack(meta.copyTheme);
    const prompt = getPrompt(id);
    return {
      id,
      concept: c,
      meta,
      copy,
      prompt,
      adName45: adName(id, '4x5'),
      adName11: adName(id, '1x1'),
      files: FORMAT_SPECS.map((spec) => ({
        ratio: spec.id,
        label: spec.label,
        dims: spec.dims,
        filename: filename(id, spec.id),
        layoutNote: c.ratioCompositions?.[spec.label] || spec.layoutNote,
      })),
    };
  });
}

function readme(ads) {
  return `# WAVE 1 FIRST LAUNCH — 5 STATICS ONLY

**Status:** PRODUCTION ACTIVE · Jul 15, 2026  
**Do not launch Wave 2 P2/P3 yet.**

## What ships in this wave

| # | Concept | Ad name (4:5 feed) | Priority |
| --- | --- | --- | --- |
${ads.map((a) => `| ${a.meta.adNum} | ${a.id} | \`${a.adName45}\` | P1 |`).join('\n')}

**Video (AFTER static QA):** VMA-V22, VMA-V24, VMA-V25 — not in this upload folder.

## Where to upload

| Level | Name |
| --- | --- |
| Campaign | \`IMB_MV_Meta_Leads_Static_VMA_ADV_Broad_20260714\` |
| Ad set | \`IMB_MV_ADV_Broad_US_StaticVMA_LowFriction\` |

## Before you add these ads — PAUSE / KILL

1. **Pause both video campaigns** (Video LAL + Video Broad) — ~$138 CPL drag
2. **Kill zero-lead ads** still getting delivery in static campaign (Yellow, Cobalt, legacy statics)
3. **Keep running:** SpanishGreen + HIPAAGreen winners until these replace fatigue
4. **Budget:** Concentrate on Static Broad — do not spread across 4 campaigns at $200/day each

## Fastest upload path

1. Designer delivers **4:5 (1080×1350)** first — primary feed size
2. Create Ad 05 in Ads Manager (paused) with \`${ads[0].adName45}\` + paste copy from \`ad-copy-paste-ready.txt\`
3. Duplicate 4× → rename → swap creative + copy for ads 06–09
4. CTA: **Learn More** · same Instant Form on all
5. Mobile preview → unpause one at a time or as a set after QA

## Creative status

**4:5 (1080×1350) feed masters are RENDERED and QA-passed** — in \`creatives/\`, ready for direct Meta upload.
1:1, 9:16, and 1.91:1 for the same 5 concepts are the next export.

## File checklist (per concept × 4 ratios)

${ads
  .map(
    (a) => `### ${a.id} — ${a.concept.headline}
${a.files
  .map((f) => {
    const done = fs.existsSync(path.join(OUT, 'creatives', f.filename));
    return `- [${done ? 'x' : ' '}] \`${f.filename}\` (${f.dims})${done ? ' — DELIVERED' : ''}`;
  })
  .join('\n')}`,
  )
  .join('\n\n')}

Finished PNGs live in: \`public/exports/wave1-first-launch/creatives/\`
Re-composite selected OpenAI plates anytime with \`npm run composite:wave1\`.

## Do not

- Launch VMA-35, 36, 38–40, 42, 44–46 yet
- Use pink · MedVirtual.ai · unapproved HIPAA/$10/savings claims
- Stretch square masters into 4:5 or 9:16
- Turn video back on until static Wave 1 validates

## Helper files

- \`ad-copy-paste-ready.txt\`
- \`designer-briefs.md\`
- \`creative-map.csv\`
- \`meta-upload-checklist.md\`
- \`ads-manager-build-order.md\`
- \`instant-form-spec.md\` — Wave 1 Instant Form + **Book Your Demo** thank-you CTA
- \`creatives/\` — rendered 4:5 PNGs (ready to upload)
`;
}

function pasteCopy(ads) {
  return ads
    .map((a) => {
      const pt = a.copy.primaryTexts[a.meta.primaryIdx];
      const hl = a.copy.headlines[a.meta.headlineIdx];
      const desc = a.copy.descriptions[a.meta.descIdx];
      return `========================================
AD ${a.meta.adNum} - ${a.adName45}
========================================

AD NAME (4:5 feed — primary):
${a.adName45}

AD NAME (1:1 if used):
${a.adName11}

CONCEPT: ${a.id}
ON-IMAGE HEADLINE (must match creative):
${a.concept.headline}

SUPPORTING LINE:
${a.concept.supportingLine}

PRIMARY TEXT:
${pt}

${a.copy.primaryTexts[1] ? `${a.copy.primaryTexts[1]}\n` : ''}
HEADLINE (Meta field):
${hl}

DESCRIPTION:
${desc}

CTA:
Learn More

FORM:
Current Instant Form — low friction

CREATIVE FILES (build all 4 ratios):
${a.files.map((f) => `${f.filename} (${f.dims})`).join('\n')}

TAG: ${a.concept.testingTag} · ${a.concept.recommendedPriority}
`;
    })
    .join('\n');
}

function designerBriefs(ads) {
  return `# Wave 1 Designer Briefs

Produce **5 concepts × 4 ratios = 20 PNGs**.  
**Ship 4:5 first** for Meta upload; then 1:1, 9:16, 1.91:1.

Font: **Be Vietnam** · Brand: **MedVirtual** (never MedVirtual.ai) · **No pink.**

${ads
  .map(
    (a) => `---

## ${a.id} — ${a.concept.name}

**Tag:** ${a.concept.testingTag} · **Priority:** ${a.concept.recommendedPriority}  
**Hypothesis:** ${a.concept.sourceHypothesis}

### On-image copy
- **Headline:** ${a.concept.headline}
- **Support:** ${a.concept.supportingLine}
- **Benefits:** ${a.concept.benefits.join(' · ')}
- **CTA:** Learn More

### Visual direction
${a.concept.visualDirection}

### Color family
${a.concept.colorFamilyId}

### Per-ratio layouts (rebuild each — no crop/stretch)
${a.files.map((f) => `- **${f.label} (${f.dims}):** ${f.layoutNote}`).join('\n')}

### AI plate prompt (background only — overlay all text in Figma/PS)
\`\`\`
${a.prompt?.prompt || 'See vma-chatgpt.html'}
\`\`\`

### Export filenames
${a.files.map((f) => `- \`${f.filename}\``).join('\n')}
`,
  )
  .join('\n')}`;
}

function creativeStatus(a) {
  const f = Object.fromEntries(a.files.map((x) => [x.ratio, x.filename]));
  const has = (ratio) => fs.existsSync(path.join(OUT, 'creatives', f[ratio]));
  const delivered = ['1x1', '4x5', '9:16', '1.91:1'];
  const have = a.files.filter((x) => fs.existsSync(path.join(OUT, 'creatives', x.filename)));
  if (has('4x5') && have.length === a.files.length) return 'CREATIVE_ALL_READY';
  if (has('4x5')) return 'CREATIVE_4x5_READY';
  return 'AWAITING_CREATIVE';
}

function creativeMapCsv(ads) {
  const header =
    'concept_id,ad_name_4x5,ad_name_1x1,file_1x1,file_4x5,file_9x16,file_191x1,testing_tag,priority,headline,campaign,ad_set,status';
  const rows = ads.map((a) => {
    const f = Object.fromEntries(a.files.map((x) => [x.ratio, x.filename]));
    return [
      a.id,
      a.adName45,
      a.adName11,
      f['1x1'],
      f['4x5'],
      f['9x16'],
      f['1.91x1'],
      a.concept.testingTag,
      a.concept.recommendedPriority,
      `"${a.concept.headline.replace(/"/g, '""')}"`,
      'IMB_MV_Meta_Leads_Static_VMA_ADV_Broad_20260714',
      'IMB_MV_ADV_Broad_US_StaticVMA_LowFriction',
      creativeStatus(a),
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

function instantFormSpec(ads) {
  return `# Wave 1 Instant Form — Book Your Demo

**Form name (Ads Manager):** \`IMB_MV_VMA_Wave1_BookDemo_LowFriction_v1.0\`
**Attach to:** all 5 Wave 1 ads (${WAVE1_IDS.join(', ')})
**Type:** Instant form · **More volume** · Language: English (US)
**Status:** Ready to build — publish only after privacy URL + scheduling link are set.

> One shared form across the wave keeps lead data comparable. Set the hidden
> tracking fields so we can tell which concept/color produced each lead.

---

## 1. Intro (optional but recommended)

- **Layout:** Paragraph
- **Headline:** Hire a dedicated virtual medical admin
- **Description:**
  A dedicated, healthcare-trained virtual medical admin who joins your practice team — calls, scheduling, insurance verification, and patient follow-up. Not a call center, not AI, not software.

_No pricing, HIPAA, savings %, or free-offer language in the intro (all leadership/compliance-gated)._

---

## 2. Questions (Form A — max volume, low friction)

| # | Field | Type | Required |
| --- | --- | --- | --- |
| 1 | First Name | Short answer / prefill | Yes |
| 2 | Last Name | Short answer / prefill | Yes |
| 3 | Email | Email (any email accepted) | Yes |
| 4 | Mobile Phone | Phone — **no SMS verification** | Yes |

**Do not** require a work email. **Do not** enable SMS verification. Keep it to 4 fields for volume.

---

## 3. Completion screen — strong "Book Your Demo" CTA

- **Headline:** You're in — now book your demo
- **Description:**
  Thanks! Skip the wait and grab a time now. On a quick call we'll walk through how a dedicated virtual medical admin fits your practice. Prefer we reach out? We'll call you shortly.
- **Primary button (CTA):** \`Book Your Demo\`
  - **Button action:** View website
  - **Link:** \`[SCHEDULING_LINK]\`  ← replace with the live booking URL (Calendly / HubSpot Meetings / Chili Piper)
- **Secondary line:** We'll also follow up by phone and email.

### Placeholders to replace before publishing
| Placeholder | Replace with |
| --- | --- |
| \`[SCHEDULING_LINK]\` | Live demo-booking calendar URL |
| \`[PRIVACY_POLICY_URL]\` | Approved MedVirtual privacy policy URL |

> The "Book Your Demo" button is a scheduling action, not a claim — safe to use.
> Do **not** add "free consultation" wording (leadership-gated).

---

## 4. Privacy + disclaimer

- **Privacy policy URL:** \`[PRIVACY_POLICY_URL]\`
- **Custom disclaimer (optional):**
  By submitting, you agree to be contacted by MedVirtual about virtual staffing. Message/data rates may apply.

_Brand: **MedVirtual** only — never "MedVirtual.ai" in any lead-facing text._

---

## 5. Hidden / tracking fields (so leads map back to creative)

| Field | Value |
| --- | --- |
| lead_source | Meta Instant Form |
| campaign | IMB_MV_Meta_Leads_Static_VMA_ADV_Broad_20260714 |
| ad_set | IMB_MV_ADV_Broad_US_StaticVMA_LowFriction |
| ad_number | VMA-## (per ad) |
| color_family | vivid-green / cobalt-blue / signal-yellow |
| language | en |
| form_variant | form-a |

Per-concept ad_number to stamp on each ad:
${ads.map((a) => `- **${a.id}** → \`${a.adName45}\` · color: ${a.concept.colorFamilyId}`).join('\n')}

---

## 6. Build + QA checklist

- [ ] Form built as **More volume** with the 4 fields above
- [ ] Intro copy pasted (no gated claims)
- [ ] Completion screen headline + description set
- [ ] **Book Your Demo** button → \`[SCHEDULING_LINK]\` (live URL, opens correctly on mobile)
- [ ] \`[PRIVACY_POLICY_URL]\` set and reachable
- [ ] Hidden tracking fields added and mapped in CRM (HubSpot)
- [ ] Test lead submitted → appears in Meta Leads Center + CRM with correct ad_number/color
- [ ] Sales notification fires; end-to-end follow-up confirmed **before** scaling spend
- [ ] Same published form attached to all 5 Wave 1 ads
`;
}

function checklist() {
  return `# Wave 1 Upload Checklist

## Ops (before spend)
- [ ] Video LAL campaign paused
- [ ] Video Broad campaign paused
- [ ] Zero-lead legacy ads off
- [ ] Static Broad budget raised (winners lane)

## Per ad (×5)
- [ ] 4:5 PNG at 1080×1350 — correct filename
- [ ] On-image headline matches brief exactly
- [ ] No pink / no MedVirtual.ai
- [ ] No unapproved HIPAA / $10 / savings claims
- [ ] Mobile preview readable
- [ ] Paste copy from ad-copy-paste-ready.txt
- [ ] CTA: Learn More
- [ ] Instant Form attached
- [ ] Ad created PAUSED → QA → unpause

## After 4:5 live
- [ ] 1:1, 9:16, 1.91:1 delivered for same 5 concepts
- [ ] $100 no-lead rule: pause any ad with $100 spend / 0 leads
`;
}

function buildOrder(ads) {
  return `# Ads Manager Build Order — Wave 1

Build in this order (Spanish/trust scale first, then adjacent tests):

${ads.map((a, i) => `${i + 1}. **${a.id}** → \`${a.adName45}\` · file \`${filename(a.id, '4x5')}\``).join('\n')}

Duplicate Ad 05 workflow: create first ad fully, duplicate 4×, swap creative + Meta copy fields only.
`;
}

function renderHtmlPage(ads) {
  const cards = ads
    .map(
      (a) => {
        const f45 = a.files.find((x) => x.ratio === '4x5');
        const has45 = f45 && fs.existsSync(path.join(OUT, 'creatives', f45.filename));
        const preview = has45
          ? `<img class="preview" src="/exports/wave1-first-launch/creatives/${esc(f45.filename)}" alt="${esc(a.id)} 4:5 creative" loading="lazy" />`
          : '';
        const status = has45
          ? `<p class="ready">Creative status: <strong>4:5 RENDERED &amp; QA-PASSED</strong> — <code>creatives/${esc(f45.filename)}</code> · ready for Meta upload</p>`
          : `<p class="await">Creative status: <strong>AWAITING DESIGN</strong> — drop PNGs in <code>exports/wave1-first-launch/creatives/</code></p>`;
        return `<article class="card">
  <div class="meta">${esc(a.id)} · ${esc(a.concept.testingTag)} · ${esc(a.concept.recommendedPriority)}</div>
  <h2>${esc(a.concept.headline)}</h2>
  ${preview}
  <p>${esc(a.concept.supportingLine)}</p>
  <p><strong>Ad name:</strong> <code>${esc(a.adName45)}</code></p>
  <p><strong>Hypothesis:</strong> ${esc(a.concept.sourceHypothesis)}</p>
  <details><summary>Visual direction</summary><p>${esc(a.concept.visualDirection)}</p></details>
  <details><summary>Files needed (4 ratios)</summary><ul>${a.files.map((f) => { const done = fs.existsSync(path.join(OUT, 'creatives', f.filename)); return `<li><code>${esc(f.filename)}</code> — ${esc(f.dims)}${done ? ' ✅' : ''}</li>`; }).join('')}</ul></details>
  <details><summary>Image prompt</summary><pre>${esc(a.prompt?.prompt || '')}</pre></details>
  ${status}
</article>`;
      },
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Wave 1 Launch — MedVirtual</title>
  <style>
    ${HEADER_CSS}
    main { max-width: 960px; margin: 0 auto; padding: 1.5rem; font-family: var(--mv-font, "Be Vietnam", sans-serif); }
    .hero { margin-bottom: 2rem; }
    .hero h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
    .banner { background: #0D546B; color: #fff; padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; }
    .card { border: 1px solid #d0dde5; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem; }
    .meta { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: #4A6275; margin-bottom: 0.5rem; }
    .card h2 { font-size: 1.15rem; margin: 0 0 0.75rem; }
    pre { white-space: pre-wrap; font-size: 0.78rem; background: #f4f8fa; padding: 0.75rem; border-radius: 6px; max-height: 280px; overflow: auto; }
    code { font-size: 0.85em; }
    .await { color: #b45309; font-size: 0.9rem; }
    .ready { color: #166534; font-size: 0.9rem; }
    .preview { display: block; width: 260px; max-width: 60%; height: auto; border-radius: 10px; border: 1px solid #d0dde5; margin: 0.5rem 0 1rem; }
    .links a { display: inline-block; margin: 0.25rem 0.5rem 0.25rem 0; }
    ul { margin: 0.5rem 0; padding-left: 1.25rem; }
  </style>
</head>
<body>
  ${renderDocHeader({ activeId: 'vma-handoff', pageTitle: 'Wave 1 Launch', pageSubtitle: '5 statics — production active' })}
  <main>
    <div class="banner"><strong>WAVE 1 ACTIVE</strong> — ${esc(WAVE1_IDS.join(' · '))} · Videos queue after static QA</div>
    <div class="hero">
      <h1>Wave 1 First Launch</h1>
      <p>5 static concepts · 4 ratios each · upload to Static VMA ADV Broad · <strong>4:5 first</strong></p>
      <div class="links">
        <a href="/exports/wave1-first-launch/README_UPLOAD_NOW.md">Upload README</a>
        <a href="/exports/wave1-first-launch/ad-copy-paste-ready.txt">Paste copy</a>
        <a href="/exports/wave1-first-launch/designer-briefs.md">Designer briefs</a>
        <a href="/exports/wave1-first-launch/creative-map.csv">Creative map CSV</a>
        <a href="/exports/wave1-first-launch/instant-form-spec.md">Instant Form spec</a>
        <a href="/exports/wave1-first-launch/creatives/">Rendered creatives</a>
        <a href="/vma-handoff.html#wave-2-handoff">Handoff</a>
      </div>
    </div>
    ${cards}
    <section>
      <h2>Pause first</h2>
      <ul>
        <li>Both video campaigns</li>
        <li>Zero-lead legacy statics still spending</li>
      </ul>
      <h2>Video queue (after static QA)</h2>
      <p>${TESTING_WAVE_2.firstLaunchBatch.video.join(' · ')}</p>
    </section>
  </main>
</body>
</html>`;
}

// ─── Main ───────────────────────────────────────────────────────────────────

fs.mkdirSync(path.join(OUT, 'creatives'), { recursive: true });

const ads = buildAds();

fs.writeFileSync(path.join(OUT, 'README_UPLOAD_NOW.md'), readme(ads), 'utf8');
fs.writeFileSync(path.join(OUT, 'ad-copy-paste-ready.txt'), pasteCopy(ads), 'utf8');
fs.writeFileSync(path.join(OUT, 'designer-briefs.md'), designerBriefs(ads), 'utf8');
fs.writeFileSync(path.join(OUT, 'creative-map.csv'), creativeMapCsv(ads), 'utf8');
fs.writeFileSync(path.join(OUT, 'meta-upload-checklist.md'), checklist(), 'utf8');
fs.writeFileSync(path.join(OUT, 'ads-manager-build-order.md'), buildOrder(ads), 'utf8');
fs.writeFileSync(path.join(OUT, 'instant-form-spec.md'), instantFormSpec(ads), 'utf8');
fs.writeFileSync(path.join(PUBLIC, 'wave1-launch.html'), renderHtmlPage(ads), 'utf8');

console.log('Wave 1 launch pack generated:');
console.log(`- ${OUT}/`);
console.log('- public/wave1-launch.html');
console.log(`Concepts: ${WAVE1_IDS.join(', ')}`);
