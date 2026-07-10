/**
 * Meta Launch Build Pack — same-day campaign shell + 4-ad mapping.
 * Generates HTML control page, CSVs, form draft, checklist, JSON map, contact sheet.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const EXPORTS = path.join(PUBLIC, 'exports');
const LAUNCH_SRC = path.join(PUBLIC, 'assets', 'launch-creatives');
const SELECTED_DIR = path.join(EXPORTS, 'selected-creatives');

const CAMPAIGN = {
  name: 'IMB_MV_Meta_Leads_FirstBatch_202607',
  objective: 'Leads',
  conversionLocation: 'Instant Form',
  optimization: 'Leads / Instant Form submissions',
  dailyBudget: '$500/day',
  monthlyBudgetNote:
    '$10,000 monthly budget. At $500/day, this pace reaches $10,000 in about 20 days — monitor pacing.',
  placements: 'Advantage+ Placements',
  brand: 'MedVirtual',
  cta: 'Book a Demo',
  status: 'DRAFT - WAITING ON FORM REVIEW / BOOKING LINK / CREATIVE APPROVAL',
};

const AD_SET = {
  name: 'IMB_MV_LAL1_MVHubSpotClinicProspects_US_500day',
  audienceName: 'Lookalike (US, 1%) - MV HubSpot Clinic Prospects — Lookalike Seed',
  audienceType: 'Lookalike (US, 1%)',
  seedName: 'MV HubSpot Clinic Prospects — Lookalike Seed',
  seedDescription:
    'HubSpot CRM clinic/practice prospects; cleaned seed list for lookalike creation.',
  seedStatus: 'Ready',
  lookalikeStatus: 'Populating, but available for use',
};

const FORM = {
  name: 'IMB_MV_Form_BookDemo_FirstBatch_DRAFT',
  type: 'Higher intent (recommended for lead quality; use More volume only if speed matters)',
  introHeadline: 'Hire Full-Time Virtual Medical Staff Through MedVirtual',
  introBody:
    'MedVirtual helps medical and dental practices hire trained full-time virtual staff for calls, scheduling, intake, insurance, billing support, and admin workflows.',
  privacyUrl: 'WAITING_ON_MEDVIRTUAL_PRIVACY_POLICY_URL_DO_NOT_PUBLISH',
  thankYouHeadline: 'Thanks — your request was received.',
  thankYouBody:
    'A MedVirtual team member will follow up to discuss your practice’s staffing needs.',
  buttonText: 'Book a Demo',
  buttonUrl: 'WAITING_ON_HAYLIE_BOOKING_LINK_DO_NOT_PUBLISH',
};

/** Final 4 concepts — image picks from launch-creatives batch */
const ADS = [
  {
    id: '01',
    concept: 'Medical Practice Owners',
    adName: 'IMB_MV_Static_01_MedicalOwners',
    onImageHeadline: 'Medical Practice Owners',
    supportingLine: 'Add full-time virtual support without adding office space.',
    primaryRecommended:
      'Medical practice owners: hire full-time virtual staff to support calls, scheduling, intake, and admin work.',
    primaryBackup:
      'Add trained virtual support to your practice team without adding more office space.',
    metaHeadline: 'Hire Full-Time Virtual Staff',
    description: 'Support your practice team with trained virtual staff.',
    creativeDirection:
      'Clean medical professional visual; practice-owner framing; no recruiting vibe.',
    sourceFile: 'Med Virtual Ads 01.png',
    selectedFile: 'IMB_MV_Static_01_MedicalOwners.png',
    notes:
      'Selected: clean medical scrub visual, no $10 price on image. Baked-in on-image copy does not match approved headline — designer must re-export 1080×1350 with approved copy + Book a Demo CTA. Source is 2965×2965 square.',
  },
  {
    id: '02',
    concept: 'Dental Practice Owners',
    adName: 'IMB_MV_Static_02_DentalOwners',
    onImageHeadline: 'Dental Practice Owners',
    supportingLine: 'Get help with scheduling, insurance, and patient follow-up.',
    primaryRecommended:
      'Dental practice owners: get virtual staff support for scheduling, insurance, reminders, and patient follow-up.',
    primaryBackup:
      'Hire full-time virtual dental staff through MedVirtual to support your daily workflow.',
    metaHeadline: 'Virtual Staff for Dental Practices',
    description: 'Scheduling, insurance, and patient follow-up support.',
    creativeDirection:
      'Dental-specific visual preferred. Current batch has no dental imagery — best available medical professional used as interim.',
    sourceFile: 'Med Virtual Ads 02.png',
    selectedFile: 'IMB_MV_Static_02_DentalOwners.png',
    notes:
      'RED FLAG: No dental-specific image in the new 12-image batch. Using best available medical professional (clipboard). Designer should swap to a dental office visual before spend. Baked-in copy/CTA must be replaced with approved dental headline + Book a Demo.',
  },
  {
    id: '03',
    concept: 'Virtual Medical Admin',
    adName: 'IMB_MV_Static_03_VirtualMedAdmin',
    onImageHeadline: 'Hire a Full-Time Virtual Medical Admin',
    supportingLine: 'Calls, scheduling, intake, and admin support.',
    primaryRecommended:
      'Hire a full-time virtual medical admin for calls, scheduling, intake, and admin support.',
    primaryBackup:
      'MedVirtual helps practices hire trained virtual staff who work as part of the team.',
    metaHeadline: 'Hire a Virtual Medical Admin',
    description: 'Calls, scheduling, intake, and admin help.',
    creativeDirection:
      'Virtual medical admin with headset/laptop; healthcare-trained look; not generic call center.',
    sourceFile: 'Med Virtual Ads 09.png',
    selectedFile: 'IMB_MV_Static_03_VirtualMedAdmin.png',
    notes:
      'Selected: full-time VA / medical admin visual without $10 price (price reserved for concept 4). Re-export with approved headline/support + Book a Demo. Source is square.',
  },
  {
    id: '04',
    concept: 'Pain-first version',
    adName: 'IMB_MV_Static_04_TooManyCalls',
    onImageHeadline: 'Too Many Calls. Not Enough Staff.',
    supportingLine: 'Full-time virtual staff starting at $10/hour.',
    primaryRecommended:
      'Too many calls and not enough staff? Hire full-time virtual staff through MedVirtual.',
    primaryBackup:
      'Support your practice team with trained full-time virtual staff starting at $10/hour.',
    metaHeadline: 'Too Many Calls? Get Support.',
    description: 'Full-time virtual staff through MedVirtual.',
    creativeDirection:
      'Before/after: overwhelmed office vs calm virtual support. Keep $10/hour only on this concept.',
    sourceFile: 'Med Virtual Ads 10.png',
    selectedFile: 'IMB_MV_Static_04_TooManyCalls.png',
    notes:
      'INTERNAL WARNING: Price “starting at $10/hour” must be confirmed by CMO before spend goes live. Selected before/after stress→calm visual. Baked-in headline differs from approved copy — re-export required. Keep $10/hour off concepts 1–3.',
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function csvEscape(s) {
  const v = String(s ?? '');
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function ensureDirs() {
  fs.mkdirSync(SELECTED_DIR, { recursive: true });
  fs.mkdirSync(EXPORTS, { recursive: true });
}

async function generatePreviewCrops() {
  for (const ad of ADS) {
    const input = path.join(LAUNCH_SRC, ad.sourceFile);
    if (!fs.existsSync(input)) {
      console.warn(`Missing source image: ${ad.sourceFile}`);
      continue;
    }
    const outPath = path.join(SELECTED_DIR, ad.selectedFile);
    // Safe 4:5 preview: preserve full square composition with light padding
    const square = await sharp(input)
      .resize(1080, 1080, {
        fit: 'contain',
        background: { r: 241, g: 245, b: 249, alpha: 1 },
      })
      .toBuffer();
    await sharp(square)
      .extend({
        top: 135,
        bottom: 135,
        left: 0,
        right: 0,
        background: { r: 241, g: 245, b: 249, alpha: 1 },
      })
      .png()
      .toFile(outPath);
  }
}

function writeBuildSheetCsv() {
  const headers = [
    'Campaign Name',
    'Objective',
    'Daily Budget',
    'Monthly Budget Note',
    'Ad Set Name',
    'Audience Name',
    'Audience Type',
    'Placements',
    'Optimization Event',
    'Form Name',
    'Ad Name',
    'Concept',
    'On-image Headline',
    'Supporting Line',
    'Primary Text',
    'Meta Headline',
    'Description',
    'CTA',
    'Creative File',
    'Destination / Form',
    'Status',
    'Notes',
  ];
  const rows = ADS.map((ad) =>
    [
      CAMPAIGN.name,
      CAMPAIGN.objective,
      CAMPAIGN.dailyBudget,
      CAMPAIGN.monthlyBudgetNote,
      AD_SET.name,
      AD_SET.audienceName,
      AD_SET.audienceType,
      CAMPAIGN.placements,
      CAMPAIGN.optimization,
      FORM.name,
      ad.adName,
      ad.concept,
      ad.onImageHeadline,
      ad.supportingLine,
      ad.primaryRecommended,
      ad.metaHeadline,
      ad.description,
      CAMPAIGN.cta,
      ad.selectedFile,
      FORM.name,
      CAMPAIGN.status,
      ad.notes,
    ]
      .map(csvEscape)
      .join(','),
  );
  const csv = [headers.join(','), ...rows].join('\n') + '\n';
  fs.writeFileSync(path.join(EXPORTS, 'meta-launch-build-sheet.csv'), csv, 'utf8');
}

function writeCopyMapCsv() {
  const headers = [
    'Concept',
    'Ad Name',
    'On-image Headline',
    'Supporting Line',
    'Primary Text Recommended',
    'Primary Text Backup',
    'Meta Headline',
    'Description',
    'CTA',
    'Creative Direction',
    'Selected Image',
    'Notes',
  ];
  const rows = ADS.map((ad) =>
    [
      ad.concept,
      ad.adName,
      ad.onImageHeadline,
      ad.supportingLine,
      ad.primaryRecommended,
      ad.primaryBackup,
      ad.metaHeadline,
      ad.description,
      CAMPAIGN.cta,
      ad.creativeDirection,
      ad.selectedFile,
      ad.notes,
    ]
      .map(csvEscape)
      .join(','),
  );
  const csv = [headers.join(','), ...rows].join('\n') + '\n';
  fs.writeFileSync(path.join(EXPORTS, 'meta-ad-copy-map.csv'), csv, 'utf8');
}

function writeFormDraftMd() {
  const md = `# Meta Instant Form — Draft Copy

**Form name:** \`${FORM.name}\`  
**Status:** DRAFT — save as draft until CMO / Haylie review. Do not publish.  
**Form type:** ${FORM.type}  
**Shared form:** One form for all 4 ads unless CMO requests separate HubSpot lead views by concept.

---

## Intro

**Headline:**  
${FORM.introHeadline}

**Body:**  
${FORM.introBody}

---

## Questions

### Required fields
- Full name
- Email
- Phone number

### Custom questions

**1. Practice name**  
(Short answer)

**2. What type of practice do you manage?**  
Options:
- Medical practice
- Dental practice
- Specialty practice
- Multi-location practice
- Other

**3. What support do you need most?**  
Options:
- Calls and scheduling
- Patient intake
- Insurance verification
- Billing support
- EMR/admin support
- Dental admin support
- Not sure yet

---

## Privacy policy

\`${FORM.privacyUrl}\`

Do not invent a URL. Do not publish the form until a real privacy policy URL is added.

---

## Thank-you screen

**Headline:**  
${FORM.thankYouHeadline}

**Body:**  
${FORM.thankYouBody}

**Button text:**  
${FORM.buttonText}

**Button URL:**  
\`${FORM.buttonUrl}\`

---

## Build notes

- Instant Forms generally cannot be bulk-uploaded via CSV. Create this form manually in Meta Ads Manager (or via API tooling if available).
- Use the build sheet / copy map for campaign, ad set, and ad copy prep.
- Keep form saved as **draft** until Haylie reviews.
- After booking link + privacy URL arrive, update thank-you button and privacy field, then re-QA before publish.
`;
  fs.writeFileSync(path.join(EXPORTS, 'meta-form-draft-copy.md'), md, 'utf8');
}

function writeChecklistMd() {
  const md = `# Meta Launch Checklist — First Batch

**Campaign:** \`${CAMPAIGN.name}\`  
**Ad set:** \`${AD_SET.name}\`  
**Form:** \`${FORM.name}\`  
**Status rule:** Nothing published before CMO approval.

---

## 2-hour action order

1. Confirm launch pack and selected images.
2. Create campaign shell in Meta: \`${CAMPAIGN.name}\`
3. Create ad set: \`${AD_SET.name}\`
4. Select audience: \`${AD_SET.audienceName}\`
5. Create draft form: \`${FORM.name}\`
6. Build 4 draft ads using the mapped copy and images.
7. Pause / keep draft until Haylie reviews.
8. Add booking link / privacy URL once received.
9. Final QA.
10. Publish only after approval.

---

## Before publish

- [ ] Campaign name uses \`IMB_MV\`
- [ ] Ad set name uses \`IMB_MV\`
- [ ] Form name starts with \`IMB_MV\`
- [ ] Audience is exact 1% lookalike: \`${AD_SET.audienceName}\`
- [ ] Form saved as draft
- [ ] Haylie reviewed form
- [ ] Booking link added (not \`${FORM.buttonUrl}\`)
- [ ] Privacy policy URL added (not \`${FORM.privacyUrl}\`)
- [ ] MedVirtual only — no MedVirtual.ai
- [ ] No managed-service language
- [ ] No front-desk replacement language
- [ ] No recruiting / job-seeker language
- [ ] $10/hour approved before using concept 4
- [ ] Creative files are 1080×1350 (designer final exports — not padded previews only)
- [ ] On-image headlines match approved 4 concepts
- [ ] On-image CTA says Book a Demo (not Book a Consultation / Talk to Our Team)
- [ ] Meta CTA says Book a Demo
- [ ] Ads previewed on mobile
- [ ] HubSpot lead view confirmed
- [ ] Budget set to $500/day
- [ ] Monthly pacing monitored for $10k budget (~20 days at $500/day)
- [ ] Nothing published before CMO approval

---

## Waiting on Haylie / CMO

- Booking link for thank-you button
- Privacy policy URL
- Form review / approval
- Creative approval (re-export with correct on-image copy + 1080×1350)
- Confirm $10/hour for concept 4 before spend
- Dental creative swap if required
- Final publish approval

---

## Upload reality check

- Build sheet CSV = bulk **prep** for campaign / ad set / ad fields.
- Ad copy can be copied from exports.
- Instant Form must likely be **manually created** in Meta unless API tooling is available.
`;
  fs.writeFileSync(path.join(EXPORTS, 'meta-launch-checklist.md'), md, 'utf8');
}

function writeSelectedMapJson() {
  const payload = {
    generatedAt: new Date().toISOString(),
    campaign: CAMPAIGN,
    adSet: AD_SET,
    form: FORM,
    creatives: ADS.map((ad) => ({
      conceptId: ad.id,
      concept: ad.concept,
      adName: ad.adName,
      selectedImageFile: ad.selectedFile,
      sourceImageFile: ad.sourceFile,
      sourcePath: `assets/launch-creatives/${ad.sourceFile}`,
      previewPath: `exports/selected-creatives/${ad.selectedFile}`,
      headline: ad.onImageHeadline,
      supportingLine: ad.supportingLine,
      primaryText: ad.primaryRecommended,
      primaryTextBackup: ad.primaryBackup,
      metaHeadline: ad.metaHeadline,
      description: ad.description,
      cta: CAMPAIGN.cta,
      formName: FORM.name,
      notes: ad.notes,
      dimensionsNote:
        'Source images are 2965×2965 (1:1). Preview crops are padded 1080×1350. Designer must produce final 1080×1350 exports with approved on-image copy.',
    })),
  };
  fs.writeFileSync(
    path.join(EXPORTS, 'selected-creative-map.json'),
    JSON.stringify(payload, null, 2) + '\n',
    'utf8',
  );
}

function writeContactSheetHtml() {
  const cards = ADS.map(
    (ad) => `<article class="card">
  <div class="card-meta">
    <span class="pill">Ad ${ad.id}</span>
    <h2>${esc(ad.concept)}</h2>
    <p class="ad-name"><code>${esc(ad.adName)}</code></p>
  </div>
  <div class="frame">
    <img src="./selected-creatives/${esc(ad.selectedFile)}" alt="${esc(ad.adName)}" width="1080" height="1350" />
  </div>
  <dl class="copy">
    <div><dt>On-image headline</dt><dd>${esc(ad.onImageHeadline)}</dd></div>
    <div><dt>Supporting line</dt><dd>${esc(ad.supportingLine)}</dd></div>
    <div><dt>Meta headline</dt><dd>${esc(ad.metaHeadline)}</dd></div>
    <div><dt>Primary text</dt><dd>${esc(ad.primaryRecommended)}</dd></div>
    <div><dt>CTA</dt><dd>${esc(CAMPAIGN.cta)}</dd></div>
    <div><dt>Source</dt><dd>${esc(ad.sourceFile)}</dd></div>
    <div class="warn"><dt>Notes</dt><dd>${esc(ad.notes)}</dd></div>
  </dl>
</article>`,
  ).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Selected Creative Contact Sheet — MedVirtual Meta Launch</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.4; }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 1.25rem 1.15rem 2.5rem; }
    .hero { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.1rem 1.2rem; margin-bottom: 1rem; }
    .hero h1 { font-size: 1.15rem; margin-bottom: 0.35rem; }
    .hero p { font-size: 0.84rem; color: #94a3b8; }
    .alert { background: #fff7ed; border: 1px solid #fdba74; border-left: 4px solid #ea580c; border-radius: 8px; padding: 0.75rem 0.9rem; margin-bottom: 1rem; font-size: 0.82rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
    .card-meta { padding: 0.85rem 0.9rem 0.5rem; }
    .pill { display: inline-block; font-size: 0.68rem; font-weight: 700; background: #0d9488; color: #fff; padding: 0.2rem 0.45rem; border-radius: 4px; margin-bottom: 0.35rem; }
    .card h2 { font-size: 0.98rem; }
    .ad-name { font-size: 0.72rem; color: #64748b; margin-top: 0.2rem; }
    .frame { background: #e2e8f0; aspect-ratio: 4 / 5; display: flex; align-items: center; justify-content: center; }
    .frame img { width: 100%; height: 100%; object-fit: contain; background: #f8fafc; }
    .copy { padding: 0.75rem 0.9rem 1rem; font-size: 0.78rem; display: grid; gap: 0.45rem; }
    .copy dt { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; font-weight: 700; }
    .copy dd { color: #0f172a; }
    .warn dd { color: #9a3412; }
    a.back { display: inline-block; margin-bottom: 0.75rem; font-size: 0.82rem; color: #0d9488; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="/meta-launch-build-pack.html">← Meta Launch Build Pack</a>
    <div class="hero">
      <h1>Selected creatives — visual QA</h1>
      <p>4 mapped images for first Meta batch. Previews are padded 1080×1350 from square sources. Final designer exports still required.</p>
    </div>
    <div class="alert"><strong>QA note:</strong> Current source files include baked-in headlines/CTAs that do not match the approved 4-concept copy. Use this sheet to confirm image selection only — not final on-image text.</div>
    <div class="grid">
      ${cards}
    </div>
  </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(EXPORTS, 'selected-creative-contact-sheet.html'), html, 'utf8');
}

function writeLaunchPackHtml() {
  const adCards = ADS.map(
    (ad) => `<article class="ad-card">
  <header class="ad-card__head">
    <span class="pill">Ad ${esc(ad.id)}</span>
    <h3>${esc(ad.concept)}</h3>
    <p class="mono">${esc(ad.adName)}</p>
  </header>
  <div class="ad-card__body">
    <div class="thumb">
      <img src="/exports/selected-creatives/${esc(ad.selectedFile)}" alt="${esc(ad.adName)}" />
    </div>
    <dl class="fields">
      <div><dt>On-image headline</dt><dd>${esc(ad.onImageHeadline)}</dd></div>
      <div><dt>Supporting line</dt><dd>${esc(ad.supportingLine)}</dd></div>
      <div><dt>Primary text</dt><dd>${esc(ad.primaryRecommended)}</dd></div>
      <div><dt>Backup primary</dt><dd>${esc(ad.primaryBackup)}</dd></div>
      <div><dt>Meta headline</dt><dd>${esc(ad.metaHeadline)}</dd></div>
      <div><dt>Description</dt><dd>${esc(ad.description)}</dd></div>
      <div><dt>CTA</dt><dd><span class="badge">${esc(CAMPAIGN.cta)}</span></dd></div>
      <div><dt>Form name</dt><dd class="mono">${esc(FORM.name)}</dd></div>
      <div><dt>Creative file</dt><dd class="mono">${esc(ad.selectedFile)}</dd></div>
      <div><dt>Source image</dt><dd class="mono">${esc(ad.sourceFile)}</dd></div>
      <div class="warn"><dt>Notes</dt><dd>${esc(ad.notes)}</dd></div>
    </dl>
  </div>
</article>`,
  ).join('\n');

  const css = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: #0d9488; color: #fff; border-radius: 10px; padding: 0.7rem 1rem;
    font-size: 0.86rem; font-weight: 700; text-align: center; margin-bottom: 0.75rem;
  }
  .status {
    background: #fff7ed; border: 1px solid #fdba74; border-left: 4px solid #ea580c;
    border-radius: 8px; padding: 0.7rem 0.9rem; margin-bottom: 0.85rem; font-size: 0.82rem;
  }
  .hero {
    background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.15rem 1.25rem; margin-bottom: 0.85rem;
  }
  .hero h2 { font-size: 1.15rem; margin-bottom: 0.35rem; }
  .hero p { font-size: 0.84rem; color: #94a3b8; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem; }
  @media (max-width: 800px) { .grid-2 { grid-template-columns: 1fr; } }
  .panel {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 0.95rem;
  }
  .panel h3 { font-size: 0.92rem; margin-bottom: 0.55rem; color: #0f172a; }
  .kv { display: grid; gap: 0.4rem; font-size: 0.8rem; }
  .kv div { display: grid; grid-template-columns: 140px 1fr; gap: 0.35rem; }
  .kv dt { color: #64748b; font-weight: 600; }
  .kv dd { color: #0f172a; word-break: break-word; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.78rem; }
  .section-title { font-size: 1rem; margin: 1.1rem 0 0.55rem; }
  .ad-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 0.85rem; overflow: hidden;
  }
  .ad-card__head { padding: 0.75rem 0.95rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
  .ad-card__head h3 { font-size: 0.98rem; margin-top: 0.25rem; }
  .pill { display: inline-block; font-size: 0.68rem; font-weight: 700; background: #0d9488; color: #fff; padding: 0.18rem 0.45rem; border-radius: 4px; }
  .ad-card__body { display: grid; grid-template-columns: 180px 1fr; gap: 0.85rem; padding: 0.85rem; }
  @media (max-width: 700px) { .ad-card__body { grid-template-columns: 1fr; } }
  .thumb { background: #e2e8f0; border-radius: 8px; overflow: hidden; aspect-ratio: 4/5; }
  .thumb img { width: 100%; height: 100%; object-fit: contain; background: #f8fafc; display: block; }
  .fields { display: grid; gap: 0.4rem; font-size: 0.8rem; }
  .fields dt { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; font-weight: 700; }
  .fields dd { margin-top: 0.1rem; }
  .fields .warn dd { color: #9a3412; }
  .badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.75rem; }
  .checklist, .steps, .waiting { list-style: none; display: grid; gap: 0.35rem; font-size: 0.82rem; }
  .checklist li, .waiting li { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem 0.7rem; }
  .steps li { background: #fff; border: 1px solid #e2e8f0; border-left: 3px solid #0d9488; border-radius: 8px; padding: 0.55rem 0.75rem; }
  .steps strong { display: block; font-size: 0.78rem; color: #0d9488; margin-bottom: 0.15rem; }
  .exports { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.5rem 0 1rem; }
  .exports a {
    display: inline-block; background: #0f172a; color: #fff; text-decoration: none; font-size: 0.75rem;
    font-weight: 600; padding: 0.4rem 0.65rem; border-radius: 6px;
  }
  .exports a.secondary { background: #0d9488; }
  .note { font-size: 0.78rem; color: #64748b; margin-top: 0.35rem; }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Meta Launch Build Pack — MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'launch',
    pageTitle: 'Meta Launch Build Pack',
    pageSubtitle: 'Same-day draft campaign shell · 4 ads · form · QA',
  })}
  <div class="wrap">
    <div class="banner">URGENT LAUNCH MODE — keep everything DRAFT until CMO / Haylie approval</div>
    <div class="status"><strong>Build status:</strong> ${esc(CAMPAIGN.status)}</div>

    <section class="hero">
      <h2>MedVirtual Meta Leads — First Batch</h2>
      <p>Use this page as the single control surface for Ads Manager build. Copy names exactly. Form is shared across all 4 ads.</p>
    </section>

    <div class="exports">
      <a href="/exports/meta-launch-build-sheet.csv">Build sheet CSV</a>
      <a href="/exports/meta-ad-copy-map.csv">Ad copy map CSV</a>
      <a href="/exports/meta-form-draft-copy.md">Form draft MD</a>
      <a href="/exports/meta-launch-checklist.md">Launch checklist</a>
      <a class="secondary" href="/exports/selected-creative-contact-sheet.html">Creative contact sheet</a>
      <a href="/exports/selected-creative-map.json">Creative map JSON</a>
    </div>

    <div class="grid-2">
      <section class="panel">
        <h3>Campaign settings</h3>
        <dl class="kv">
          <div><dt>Campaign name</dt><dd class="mono">${esc(CAMPAIGN.name)}</dd></div>
          <div><dt>Objective</dt><dd>${esc(CAMPAIGN.objective)}</dd></div>
          <div><dt>Conversion</dt><dd>${esc(CAMPAIGN.conversionLocation)}</dd></div>
          <div><dt>Optimization</dt><dd>${esc(CAMPAIGN.optimization)}</dd></div>
          <div><dt>Daily budget</dt><dd>${esc(CAMPAIGN.dailyBudget)}</dd></div>
          <div><dt>Monthly note</dt><dd>${esc(CAMPAIGN.monthlyBudgetNote)}</dd></div>
          <div><dt>Placements</dt><dd>${esc(CAMPAIGN.placements)}</dd></div>
          <div><dt>Brand</dt><dd>${esc(CAMPAIGN.brand)}</dd></div>
          <div><dt>CTA</dt><dd>${esc(CAMPAIGN.cta)}</dd></div>
        </dl>
      </section>
      <section class="panel">
        <h3>Audience + ad set</h3>
        <dl class="kv">
          <div><dt>Ad set name</dt><dd class="mono">${esc(AD_SET.name)}</dd></div>
          <div><dt>Lookalike</dt><dd class="mono">${esc(AD_SET.audienceName)}</dd></div>
          <div><dt>Audience type</dt><dd>${esc(AD_SET.audienceType)}</dd></div>
          <div><dt>Lookalike status</dt><dd>${esc(AD_SET.lookalikeStatus)}</dd></div>
          <div><dt>Seed audience</dt><dd class="mono">${esc(AD_SET.seedName)}</dd></div>
          <div><dt>Seed status</dt><dd>${esc(AD_SET.seedStatus)}</dd></div>
          <div><dt>Seed desc</dt><dd>${esc(AD_SET.seedDescription)}</dd></div>
        </dl>
      </section>
    </div>

    <div class="grid-2">
      <section class="panel">
        <h3>Shared Instant Form</h3>
        <dl class="kv">
          <div><dt>Form name</dt><dd class="mono">${esc(FORM.name)}</dd></div>
          <div><dt>Form type</dt><dd>${esc(FORM.type)}</dd></div>
          <div><dt>Intro headline</dt><dd>${esc(FORM.introHeadline)}</dd></div>
          <div><dt>Privacy URL</dt><dd class="mono">${esc(FORM.privacyUrl)}</dd></div>
          <div><dt>Booking URL</dt><dd class="mono">${esc(FORM.buttonUrl)}</dd></div>
        </dl>
        <p class="note">Create form manually in Meta. Do not claim CSV bulk upload for Instant Forms.</p>
      </section>
      <section class="panel">
        <h3>Still waiting on Haylie</h3>
        <ul class="waiting">
          <li>Booking link for thank-you button</li>
          <li>Privacy policy URL</li>
          <li>Form review / approval</li>
          <li>Creative approval (correct on-image copy + final 1080×1350)</li>
          <li>Confirm $10/hour before concept 4 spend</li>
          <li>Final CMO publish approval</li>
        </ul>
      </section>
    </div>

    <h2 class="section-title">4 draft ads</h2>
    ${adCards}

    <h2 class="section-title">2-hour action order</h2>
    <ol class="steps">
      <li><strong>Step 1</strong> Confirm launch pack and selected images.</li>
      <li><strong>Step 2</strong> Create campaign shell: <span class="mono">${esc(CAMPAIGN.name)}</span></li>
      <li><strong>Step 3</strong> Create ad set: <span class="mono">${esc(AD_SET.name)}</span></li>
      <li><strong>Step 4</strong> Select audience: <span class="mono">${esc(AD_SET.audienceName)}</span></li>
      <li><strong>Step 5</strong> Create draft form: <span class="mono">${esc(FORM.name)}</span></li>
      <li><strong>Step 6</strong> Build 4 draft ads using mapped copy and images.</li>
      <li><strong>Step 7</strong> Pause / keep draft until Haylie reviews.</li>
      <li><strong>Step 8</strong> Add booking link / privacy URL once received.</li>
      <li><strong>Step 9</strong> Final QA.</li>
      <li><strong>Step 10</strong> Publish only after approval.</li>
    </ol>

    <h2 class="section-title">Launch QA checklist</h2>
    <ul class="checklist">
      <li>☐ Campaign name uses IMB_MV</li>
      <li>☐ Ad set name uses IMB_MV</li>
      <li>☐ Form name starts with IMB_MV</li>
      <li>☐ Audience is exact 1% lookalike</li>
      <li>☐ Form saved as draft</li>
      <li>☐ Haylie reviewed form</li>
      <li>☐ Booking link added</li>
      <li>☐ Privacy policy URL added</li>
      <li>☐ MedVirtual only, no MedVirtual.ai</li>
      <li>☐ No managed-service language</li>
      <li>☐ No front-desk replacement language</li>
      <li>☐ No recruiting/job-seeker language</li>
      <li>☐ $10/hour approved before using concept 4</li>
      <li>☐ Creative files are 1080×1350</li>
      <li>☐ CTA says Book a Demo</li>
      <li>☐ Ads previewed on mobile</li>
      <li>☐ HubSpot lead view confirmed</li>
      <li>☐ Budget set to $500/day</li>
      <li>☐ Monthly pacing monitored for $10k budget</li>
      <li>☐ Nothing published before CMO approval</li>
    </ul>

    <p class="note" style="margin-top:1rem">Red flags: all source creatives are square with baked-in copy/CTAs that do not match approved headlines; no dental-specific image in batch; concept 4 price needs CMO confirmation; booking link + privacy URL still missing.</p>
  </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(PUBLIC, 'meta-launch-build-pack.html'), html, 'utf8');
}

async function main() {
  ensureDirs();
  if (!fs.existsSync(LAUNCH_SRC)) {
    console.error('Missing launch creatives folder:', LAUNCH_SRC);
    process.exit(1);
  }
  await generatePreviewCrops();
  writeBuildSheetCsv();
  writeCopyMapCsv();
  writeFormDraftMd();
  writeChecklistMd();
  writeSelectedMapJson();
  writeContactSheetHtml();
  writeLaunchPackHtml();
  console.log('Meta launch build pack generated.');
  console.log(`- public/meta-launch-build-pack.html`);
  console.log(`- public/exports/meta-launch-build-sheet.csv`);
  console.log(`- public/exports/meta-ad-copy-map.csv`);
  console.log(`- public/exports/meta-form-draft-copy.md`);
  console.log(`- public/exports/meta-launch-checklist.md`);
  console.log(`- public/exports/selected-creative-map.json`);
  console.log(`- public/exports/selected-creative-contact-sheet.html`);
  console.log(`- public/exports/selected-creatives/ (4× 1080×1350 previews)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
