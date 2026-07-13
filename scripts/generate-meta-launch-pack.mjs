/**
 * Meta Launch Build Pack — Real People relaunch (FirstBatch killed).
 * Generates HTML control page, CSVs, form draft, checklist, JSON map, contact sheet.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const EXPORTS = path.join(PUBLIC, 'exports');
const SELECTED_DIR = path.join(EXPORTS, 'selected-creatives');
const UPLOAD_DIR = path.join(EXPORTS, 'meta-upload-ready');
const ARCHIVE_DIR = path.join(EXPORTS, 'meta-upload-ready-archived-first-batch');

const CAMPAIGN = {
  name: 'IMB_MV_Meta_Leads_RealPeople_202607',
  objective: 'Leads',
  conversionLocation: 'Instant Form',
  optimization: 'Leads / Instant Form submissions',
  dailyBudget: '100',
  dailyBudgetDisplay: '$100/day',
  monthlyBudgetNote:
    'Start at $100/day for Real People creative learning. Scale only after Haylie / CMO approval.',
  placements: 'Advantage+ Placements',
  geo: 'United States',
  brand: 'MedVirtual',
  cta: 'Book a Demo',
  ctaImport: 'LEARN_MORE',
  status: 'NEW LAUNCH · DRAFT / PAUSED — FirstBatch killed. Upload Real People ads now.',
  statusImport: 'PAUSED',
  killedCampaign: 'IMB_MV_Meta_Leads_FirstBatch_202607',
  killNote:
    'FirstBatch failed. Only Static_04 TooManyCalls had signal — and even that creative quality was not good enough. Do not rebuild MedicalOwners / DentalOwners / VirtualMedAdmin stock statics.',
};

const UTM_PATTERN =
  'utm_source=IMB_MV&utm_medium=Meta&utm_campaign=IMB_MV_Meta_Leads_RealPeople_202607&utm_term={{adset.name}}&utm_content={{ad.name}}';

const WAITING = {
  booking: 'https://meetings.hubspot.com/call-scheduling/mv-meta-imb',
  privacy: 'https://www.medvirtual.ai/privacy-policy',
  creative: 'REAL PEOPLE DRAFTS — DESIGNER POLISH WELCOME, UPLOADABLE NOW',
  jobSeeker: 'https://apply.workable.com/berryvirtual/?lng=en',
};

const AD_SET = {
  name: 'IMB_MV_LAL1_MVHubSpotClinicProspects_US_RealPeople',
  audienceName: 'Lookalike (US, 1%) - MV HubSpot Clinic Prospects — Lookalike Seed',
  audienceType: 'Lookalike (US, 1%)',
  seedName: 'MV HubSpot Clinic Prospects — Lookalike Seed',
  seedDescription:
    'HubSpot CRM clinic/practice prospects; cleaned seed list for lookalike creation.',
  seedStatus: 'Ready',
  lookalikeStatus: 'Reuse same seed / LAL as FirstBatch if available',
  reuseNote:
    'Prefer a NEW ad set under the RealPeople campaign. You may reuse the same LAL audience object.',
};

const FORM = {
  name: 'IMB_MV_Form_BookDemo_RealPeople',
  type: 'Higher Intent (recommended for lead quality)',
  introHeadline: 'Meet Real MedVirtual Talent for Your Practice',
  introBody:
    'MedVirtual helps practices hire dedicated full-time virtual staff who become part of your team — for calls, scheduling, insurance verification, intake, and admin support.',
  privacyUrl: WAITING.privacy,
  thankYouHeadline: 'Thanks - your request was received.',
  thankYouBody:
    "A MedVirtual team member will follow up so you can review candidates and request interviews.",
  buttonText: 'Book a Demo',
  buttonUrl: WAITING.booking,
  jobSeekerUrl: WAITING.jobSeeker,
  routingQuestion: 'Are you looking to hire staff for your medical practice?',
  routingYes: 'Yes, I want to hire staff',
  routingNo: 'No, I am looking for a job',
  reuseNote:
    'Create as a new form (or duplicate FirstBatch form and rename). Keep hiring routing + SMS + privacy + booking link.',
};

/**
 * Real People relaunch — Treatment E Studio Profile.
 * Order: Jessica → Chelsea → Angelica → Mark.
 * Treatment C/D graphics are rejected — do not upload.
 */
const ADS = [
  {
    id: '01',
    concept: 'Jessica · Admin / calls overload',
    adName: 'IMB_MV_RP_Static_01_JessicaAdmin',
    onImageHeadline: 'Meet Jessica',
    supportingLine: 'Jr. Medical Admin · available to interview',
    primaryRecommended:
      'Calls keep coming. Tasks keep stacking. Your team is already stretched.\n\nMeet Jessica — a Jr. Medical Admin available through MedVirtual. Hire a dedicated full-time virtual staff member who works as part of your practice team.\n\nBook a demo to request an interview.',
    primaryBackup:
      'Too much admin and not enough day? Meet Jessica and hire dedicated virtual medical admin support through MedVirtual — not another generic staffing promise.',
    metaHeadline: 'Admin Work Piling Up?',
    description: 'Meet real MedVirtual medical admin talent.',
    creativeDirection:
      'Treatment E Studio Profile. Circular natural portrait + Meet Jessica + role on light brand wash. Pain stays in Meta primary / headline.',
    sourcePath: path.join(PUBLIC, 'assets', 'real-people', 'jessica', 'ad-treatment-e-4x5.png'),
    sourceFile: 'jessica/ad-treatment-e-4x5.png',
    selectedFile: 'IMB_MV_RP_Static_01_JessicaAdmin.png',
    uploadFile: 'IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
    notes:
      'Lead creative. Studio Profile draft — designer may polish. Do not upload Treatment C/D.',
    publishBlock: false,
  },
  {
    id: '02',
    concept: 'Chelsea · Scheduling pressure',
    adName: 'IMB_MV_RP_Static_02_ChelseaScheduling',
    onImageHeadline: 'Meet Chelsea',
    supportingLine: 'Dental Virtual Assistant · available to interview',
    primaryRecommended:
      'Scheduling should not consume your entire front desk.\n\nMeet Chelsea — a Dental Virtual Assistant available through MedVirtual. Add a dedicated full-time virtual teammate your practice can interview.\n\nBook a demo to get started.',
    primaryBackup:
      'Scheduling taking over the front desk? Meet Chelsea and hire dedicated virtual scheduling support through MedVirtual.',
    metaHeadline: 'Scheduling Taking Over?',
    description: 'Interview real MedVirtual talent.',
    creativeDirection: 'Studio Profile + scheduling pain in Meta copy.',
    sourcePath: path.join(PUBLIC, 'assets', 'real-people', 'chelsea', 'ad-treatment-e-4x5.png'),
    sourceFile: 'chelsea/ad-treatment-e-4x5.png',
    selectedFile: 'IMB_MV_RP_Static_02_ChelseaScheduling.png',
    uploadFile: 'IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png',
    notes: 'Skill-specific scheduling pain in copy. No Treatment C/D.',
    publishBlock: false,
  },
  {
    id: '03',
    concept: 'Angelica · Front-desk pressure',
    adName: 'IMB_MV_RP_Static_03_AngelicaFrontDesk',
    onImageHeadline: 'Meet Angelica',
    supportingLine: 'Front Desk Assistant · available to interview',
    primaryRecommended:
      'Patients are waiting. Phones are ringing. Follow-up is stacking up.\n\nMeet Angelica — a Front Desk Assistant available through MedVirtual. Hire dedicated virtual staff who support your front-desk workflow as part of your practice team.\n\nBook a demo to request an interview.',
    primaryBackup:
      'When the front desk is doing too much, meet Angelica and hire dedicated virtual support through MedVirtual — not a call center.',
    metaHeadline: 'Front Desk Stretched Thin?',
    description: 'Meet a real front-desk support candidate.',
    creativeDirection: 'Studio Profile. Front-desk overload in Meta copy without “we run your front desk.”',
    sourcePath: path.join(PUBLIC, 'assets', 'real-people', 'angelica', 'ad-treatment-e-4x5.png'),
    sourceFile: 'angelica/ad-treatment-e-4x5.png',
    selectedFile: 'IMB_MV_RP_Static_03_AngelicaFrontDesk.png',
    uploadFile: 'IMB_MV_RP_Static_03_AngelicaFrontDesk_1080x1350.png',
    notes: 'Pain in primary text. Hire framing only.',
    publishBlock: false,
  },
  {
    id: '04',
    concept: 'Mark · Insurance verification',
    adName: 'IMB_MV_RP_Static_04_MarkVerification',
    onImageHeadline: 'Meet Mark',
    supportingLine: 'Insurance Verification Specialist · available to interview',
    primaryRecommended:
      'Insurance verification can pull your team away from patients.\n\nMeet Mark — an Insurance Verification Specialist available through MedVirtual. Hire a dedicated full-time virtual staff member for eligibility and verification support.\n\nBook a demo to request an interview.',
    primaryBackup:
      'Verification work piling up? Meet Mark and hire dedicated insurance verification support through MedVirtual.',
    metaHeadline: 'Verification Work Piling Up?',
    description: 'Insurance verification talent from MedVirtual.',
    creativeDirection: 'Studio Profile named specialist. No reimbursement promises.',
    sourcePath: path.join(PUBLIC, 'assets', 'real-people', 'mark', 'ad-treatment-e-4x5.png'),
    sourceFile: 'mark/ad-treatment-e-4x5.png',
    selectedFile: 'IMB_MV_RP_Static_04_MarkVerification.png',
    uploadFile: 'IMB_MV_RP_Static_04_MarkVerification_1080x1350.png',
    notes: 'No outcome guarantees. No Treatment C/D.',
    publishBlock: false,
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
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.mkdirSync(EXPORTS, { recursive: true });
}

async function archiveFirstBatchUploads() {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) return;
  for (const f of fs.readdirSync(UPLOAD_DIR)) {
    if (/^IMB_MV_Static_0[1-4]_/.test(f)) {
      fs.renameSync(path.join(UPLOAD_DIR, f), path.join(ARCHIVE_DIR, f));
    }
  }
}

async function generatePreviewCrops() {
  await archiveFirstBatchUploads();
  for (const ad of ADS) {
    const input = ad.sourcePath;
    if (!fs.existsSync(input)) {
      console.warn(`Missing Real People creative: ${ad.sourceFile}`);
      continue;
    }
    // Treatment E is already 1080×1350 — copy into upload package
    fs.copyFileSync(input, path.join(SELECTED_DIR, ad.selectedFile));
    fs.copyFileSync(input, path.join(UPLOAD_DIR, ad.uploadFile));
  }
}

function writeUploadReadyPackage() {
  const readme = `# NEW LAUNCH — UPLOAD THESE 4 REAL PEOPLE ADS

FirstBatch (\`${CAMPAIGN.killedCampaign}\`) is **killed**.

Learning: only TooManyCalls had signal — and creative quality still was not good enough.
This relaunch uses named Talent Pool people + hire-dedicated-staff messaging.

## Create in Meta (new shell)

- Campaign: \`${CAMPAIGN.name}\`
- Ad set: \`${AD_SET.name}\`
- Form: \`${FORM.name}\`
- Budget: ${CAMPAIGN.dailyBudgetDisplay}

Do **not** revive MedicalOwners / DentalOwners / VirtualMedAdmin stock statics.

## Fastest path

1. Create paused campaign + ad set + Instant Form (or duplicate FirstBatch form and rename).
2. Create Ad 1: \`${ADS[0].adName}\`.
3. Upload \`${ADS[0].uploadFile}\`.
4. Paste Ad 1 copy from \`ad-copy-paste-ready.txt\`.
5. Attach form \`${FORM.name}\` + UTMs from \`utm-parameters.txt\`.
6. Duplicate Ad 1 three times; rename + swap creative/copy for Ads 2–4.
7. Keep everything paused.
8. Send to Haylie / CMO — publish only after approval.

## Creatives

| # | Ad | File | Angle |
| --- | --- | --- | --- |
${ADS.map((ad) => `| ${ad.id} | \`${ad.adName}\` | \`${ad.uploadFile}\` | ${ad.concept} |`).join('\n')}

All PNGs are **1080×1350 Real People drafts** (Treatment E — Studio Profile). Designer polish welcome. Do not upload Treatment C/D.

## Language rules

- Brand: **MedVirtual** only (never MedVirtual.ai in ad copy)
- Frame: hire dedicated full-time virtual staff who join the practice team
- Avoid: managed service, “we run your front desk,” call-center vibes, “MedVirtual handles…”
- No new unverified $10 / savings / HIPAA-certified claims on this batch
`;
  fs.writeFileSync(path.join(UPLOAD_DIR, 'README_UPLOAD_NOW.md'), readme, 'utf8');

  const paste = ADS.map((ad) => {
    const warn = ad.publishBlock
      ? `\nWARNING:\nDo not publish Ad 4 if the image contains $10/hour language until Haylie confirms that claim.\nKeep Ad 4 paused until confirmed.\n`
      : '';
    return `========================================
AD ${ad.id} - ${ad.adName}
========================================

AD NAME:
${ad.adName}

PRIMARY TEXT:
${ad.primaryRecommended}

HEADLINE:
${ad.metaHeadline}

DESCRIPTION:
${ad.description}

CTA:
${CAMPAIGN.cta}

FORM:
${FORM.name}

CREATIVE:
${ad.uploadFile}
${warn}`;
  }).join('\n');
  fs.writeFileSync(path.join(UPLOAD_DIR, 'ad-copy-paste-ready.txt'), paste + '\n', 'utf8');

  const checklist = `# Meta Upload Checklist

Keep campaign / ad set / ads draft or paused.

## Structure

- [ ] Campaign name matches: \`${CAMPAIGN.name}\`
- [ ] Ad set name matches: \`${AD_SET.name}\`
- [ ] FirstBatch campaign stays killed / paused
- [ ] Four Real People ad names match:
${ADS.map((ad) => `  - [ ] \`${ad.adName}\``).join('\n')}

## Each ad

- [ ] Each ad has creative uploaded
- [ ] Each ad has primary text
- [ ] Each ad has headline
- [ ] Each ad has description
- [ ] CTA = Book a Demo
- [ ] Destination = Instant Form
- [ ] Form = \`${FORM.name}\`
- [ ] URL parameters added
- [ ] No MedVirtual.ai in ad copy
- [ ] No managed-service / “we handle your front desk” language
- [ ] No unverified $10 claim

## Form

- [ ] SMS verification on
- [ ] Company name required
- [ ] Phone required
- [ ] Email required
- [ ] Full name required
- [ ] Work email not required
- [ ] Messenger off
- [ ] Privacy policy = \`${FORM.privacyUrl}\`
- [ ] Lead booking link = \`${FORM.buttonUrl}\`
- [ ] Job seeker link = \`${FORM.jobSeekerUrl}\`
- [ ] Q1 routing:
  - [ ] \`${FORM.routingQuestion}\`
  - [ ] \`${FORM.routingYes}\` → Submit the form
  - [ ] \`${FORM.routingNo}\` → Close the form

## Creative / publish gates

- [ ] Creatives are DRAFT CREATIVE - NEEDS FINAL DESIGN APPROVAL (or final designer exports swapped in)
- [ ] Ad 4 blocked if $10/hour appears without approval
- [ ] Campaign remains draft/paused
- [ ] Do not publish until Haylie approves
`;
  fs.writeFileSync(path.join(UPLOAD_DIR, 'meta-upload-checklist.md'), checklist, 'utf8');

  const mapHeaders = [
    'Ad Name',
    'Concept',
    'Creative File',
    'Source Image',
    'Primary Text',
    'Headline',
    'Description',
    'CTA',
    'Form',
    'Creative Status',
    'Notes',
  ];
  const mapRows = ADS.map((ad) =>
    [
      ad.adName,
      ad.concept,
      ad.uploadFile,
      ad.sourceFile,
      ad.primaryRecommended,
      ad.metaHeadline,
      ad.description,
      CAMPAIGN.cta,
      FORM.name,
      'DRAFT CREATIVE - NEEDS FINAL DESIGN APPROVAL',
      ad.publishBlock
        ? 'Do not publish if image shows $10/hour until Haylie confirms'
        : ad.id === '02'
          ? 'Interim visual - not dental-specific'
          : 'Upload now; swap final designer export when ready',
    ]
      .map(csvEscape)
      .join(','),
  );
  fs.writeFileSync(
    path.join(UPLOAD_DIR, 'creative-map.csv'),
    [mapHeaders.join(','), ...mapRows].join('\n') + '\n',
    'utf8',
  );

  fs.writeFileSync(path.join(UPLOAD_DIR, 'utm-parameters.txt'), UTM_PATTERN + '\n', 'utf8');

  const formMd = `# Instant Form Final Settings

**Form name:** \`${FORM.name}\`

Use Haylie's requirements exactly. Do not add extra qualifier questions.

## Routing question (Q1)

**Question:**  
\`${FORM.routingQuestion}\`

| Answer | Meta logic |
| --- | --- |
| \`${FORM.routingYes}\` | Submit the form |
| \`${FORM.routingNo}\` | Close the form |

Job seeker link (for close / job-seeker routing flow):  
\`${FORM.jobSeekerUrl}\`

## Required contact fields

- Email - required
- Full name - required
- Phone number - required
- Company name - required

## Settings

- SMS verification: **ON**
- Work email: **not required**
- Messenger: **OFF**

## Privacy + thank-you / booking

- Privacy policy: \`${FORM.privacyUrl}\`
- Lead booking link: \`${FORM.buttonUrl}\`

Include required consent language per Haylie / MedVirtual privacy policy requirements.

## Shared form

All 4 ads use this same form:

1. \`IMB_MV_Static_01_MedicalOwners\`
2. \`IMB_MV_Static_02_DentalOwners\`
3. \`IMB_MV_Static_03_VirtualMedAdmin\`
4. \`IMB_MV_Static_04_TooManyCalls\`
`;
  fs.writeFileSync(path.join(UPLOAD_DIR, 'form-final-settings.md'), formMd, 'utf8');

  const orderMd = `# Ads Manager Build Order

Campaign and ad set already exist. Do not recreate them.

1. Open existing ad shell:  
   \`IMB_MV_Static_01_MedicalOwners\`
2. Select final form:  
   \`${FORM.name}\`
3. Upload creative:  
   \`IMB_MV_Static_01_MedicalOwners_1080x1350.png\`
4. Paste Ad 1 primary text, headline, description, CTA from \`ad-copy-paste-ready.txt\`.
5. Add URL parameters from \`utm-parameters.txt\`.
6. Duplicate Ad 1 three times.
7. Rename each duplicate to Ads 2-4:
   - \`IMB_MV_Static_02_DentalOwners\`
   - \`IMB_MV_Static_03_VirtualMedAdmin\`
   - \`IMB_MV_Static_04_TooManyCalls\`
8. Replace creative and copy for each duplicate.
9. Confirm all four ads use the same instant form.
10. Keep campaign/ad set/ads in draft or paused.
11. Do not publish until Haylie approves.

## Ad 4 note

Keep Ad 4 paused if the creative shows \`$10/hour\` until Haylie confirms that claim.
`;
  fs.writeFileSync(path.join(UPLOAD_DIR, 'ads-manager-build-order.md'), orderMd, 'utf8');
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
    'Geo',
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
      CAMPAIGN.dailyBudgetDisplay,
      CAMPAIGN.monthlyBudgetNote,
      AD_SET.name,
      AD_SET.audienceName,
      AD_SET.audienceType,
      CAMPAIGN.geo,
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
      ad.publishBlock
        ? 'PAUSED - BLOCKED UNTIL $10/HOUR CONFIRMED'
        : CAMPAIGN.status,
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

function writeBulkImportAttemptCsv() {
  // Best-effort Meta Import/Export style columns. Safest workflow: export Meta's
  // live template and map these values into Meta's exact headers.
  const headers = [
    'Campaign Name',
    'Campaign Status',
    'Campaign Objective',
    'Special Ad Categories',
    'Buying Type',
    'Campaign Bid Strategy',
    'Ad Set Name',
    'Ad Set Status',
    'Ad Set Daily Budget',
    'Ad Set Budget Type',
    'Countries',
    'Location Type',
    'Custom Audiences',
    'Excluded Custom Audiences',
    'Age Min',
    'Age Max',
    'Gender',
    'Detailed Targeting',
    'Publisher Platforms',
    'Facebook Positions',
    'Instagram Positions',
    'Advantage+ Placements',
    'Optimization Goal',
    'Billing Event',
    'Destination Type',
    'Lead Form Name',
    'Ad Name',
    'Ad Status',
    'Title',
    'Body',
    'Description',
    'Link',
    'Call to Action',
    'Image File Name',
    'Creative Source File',
    'URL Tags',
    'Notes',
  ];

  const rows = ADS.map((ad) =>
    [
      CAMPAIGN.name,
      CAMPAIGN.statusImport,
      'OUTCOME_LEADS',
      '',
      'AUCTION',
      'LOWEST_COST_WITHOUT_CAP',
      AD_SET.name,
      CAMPAIGN.statusImport,
      CAMPAIGN.dailyBudget,
      'DAILY',
      'US',
      'home, recent',
      AD_SET.audienceName,
      '',
      '18',
      '65',
      'All',
      'NONE - lookalike only; do not add interests/job titles/behaviors',
      '',
      '',
      '',
      'Yes',
      'LEAD_GENERATION',
      'IMPRESSIONS',
      'ON_AD',
      FORM.name,
      ad.adName,
      CAMPAIGN.statusImport,
      ad.metaHeadline,
      ad.primaryRecommended,
      ad.description,
      WAITING.booking,
      CAMPAIGN.ctaImport,
      ad.selectedFile,
      ad.sourceFile,
      UTM_PATTERN,
      ad.publishBlock
        ? 'KEEP PAUSED until $10/hour confirmed. Match columns to Meta-exported template before import. Instant Form must be created manually first.'
        : 'Match columns to Meta-exported template before import. Instant Form must be created manually first. Upload creative to Media Library and replace Image File Name with image hash if required.',
    ]
      .map(csvEscape)
      .join(','),
  );

  const warningRow = [
    'READ_ME_FIRST',
    'PAUSED',
    'DO_NOT_IMPORT_THIS_ROW',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'This file is a best-effort import attempt. Safest workflow: create campaign/ad set shell in Meta, export Meta template, map these values into Meta column names, import, then review every draft ad manually. Instant Forms cannot be bulk-created reliably via CSV.',
  ]
    .map(csvEscape)
    .join(',');

  const csv = [headers.join(','), warningRow, ...rows].join('\n') + '\n';
  fs.writeFileSync(path.join(EXPORTS, 'meta-bulk-import-attempt.csv'), csv, 'utf8');
}

function writeManualBuildSheetCsv() {
  const headers = [
    'Build Order',
    'Object Type',
    'Exact Name',
    'Field',
    'Exact Value',
    'Status',
    'Notes',
  ];
  const lines = [
    ['1', 'Campaign', CAMPAIGN.name, 'Name', CAMPAIGN.name, 'PAUSED/DRAFT', 'Create first'],
    ['1', 'Campaign', CAMPAIGN.name, 'Objective', CAMPAIGN.objective, 'PAUSED/DRAFT', 'Leads'],
    ['1', 'Campaign', CAMPAIGN.name, 'Special Ad Categories', 'None / not employment', 'PAUSED/DRAFT', 'B2B practice staffing - not a job-seeker ad'],
    ['2', 'Ad Set', AD_SET.name, 'Name', AD_SET.name, 'PAUSED/DRAFT', 'One ad set only'],
    ['2', 'Ad Set', AD_SET.name, 'Daily Budget', CAMPAIGN.dailyBudgetDisplay, 'PAUSED/DRAFT', CAMPAIGN.monthlyBudgetNote],
    ['2', 'Ad Set', AD_SET.name, 'Geo', CAMPAIGN.geo, 'PAUSED/DRAFT', 'National US'],
    ['2', 'Ad Set', AD_SET.name, 'Audience', AD_SET.audienceName, 'PAUSED/DRAFT', 'Exact 1% lookalike only - no interests'],
    ['2', 'Ad Set', AD_SET.name, 'Placements', CAMPAIGN.placements, 'PAUSED/DRAFT', 'Advantage+ unless CMO overrides'],
    ['2', 'Ad Set', AD_SET.name, 'Optimization', CAMPAIGN.optimization, 'PAUSED/DRAFT', 'Instant Form leads'],
    ['2', 'Ad Set', AD_SET.name, 'Conversion Location', CAMPAIGN.conversionLocation, 'PAUSED/DRAFT', 'Instant Form'],
    ['3', 'Form', FORM.name, 'Form Name', FORM.name, 'DRAFT', 'Create manually - not CSV'],
    ['3', 'Form', FORM.name, 'Form Type', FORM.type, 'DRAFT', 'Higher Intent preferred'],
    ['3', 'Form', FORM.name, 'Privacy Policy URL', FORM.privacyUrl, 'BLOCKED', 'Do not publish until real URL'],
    ['3', 'Form', FORM.name, 'Thank You Button URL', FORM.buttonUrl, 'BLOCKED', 'Do not publish until booking link'],
  ];

  for (const ad of ADS) {
    const order = String(3 + Number(ad.id));
    const status = ad.publishBlock ? 'PAUSED - PRICE BLOCK' : 'PAUSED/DRAFT';
    lines.push(
      [order, 'Ad', ad.adName, 'Ad Name', ad.adName, status, ad.concept],
      [order, 'Ad', ad.adName, 'Primary Text', ad.primaryRecommended, status, 'Paste into Meta Body / Primary text'],
      [order, 'Ad', ad.adName, 'Headline', ad.metaHeadline, status, 'Meta Title / Headline'],
      [order, 'Ad', ad.adName, 'Description', ad.description, status, ''],
      [order, 'Ad', ad.adName, 'CTA', CAMPAIGN.cta, status, 'Book a Demo'],
      [order, 'Ad', ad.adName, 'Destination', FORM.name, status, 'Shared Instant Form'],
      [order, 'Ad', ad.adName, 'Creative File', ad.selectedFile, status, `Source: ${ad.sourceFile}`],
      [order, 'Ad', ad.adName, 'On-image Headline', ad.onImageHeadline, status, 'Must appear on final creative'],
      [order, 'Ad', ad.adName, 'Supporting Line', ad.supportingLine, status, 'Must appear on final creative'],
      [order, 'Ad', ad.adName, 'Notes', ad.notes, status, ''],
    );
  }

  const csv =
    [headers.join(','), ...lines.map((r) => r.map(csvEscape).join(','))].join('\n') + '\n';
  fs.writeFileSync(path.join(EXPORTS, 'meta-manual-build-sheet.csv'), csv, 'utf8');
}

function writePasteReadyAdCopy() {
  const blocks = ADS.map((ad) => {
    const blockStatus = ad.publishBlock
      ? 'STATUS: PAUSED / BLOCKED until $10/hour confirmed'
      : 'STATUS: DRAFT / PAUSED until CMO approval';
    return `========================================
${ad.adName}
Concept: ${ad.concept}
${blockStatus}
========================================

AD NAME (exact):
${ad.adName}

PRIMARY TEXT:
${ad.primaryRecommended}

BACKUP PRIMARY TEXT:
${ad.primaryBackup}

META HEADLINE:
${ad.metaHeadline}

DESCRIPTION:
${ad.description}

CTA:
${CAMPAIGN.cta}

DESTINATION / FORM:
${FORM.name}

ON-IMAGE HEADLINE (creative must show):
${ad.onImageHeadline}

SUPPORTING LINE (creative must show):
${ad.supportingLine}

CREATIVE FILE:
${ad.selectedFile}
SOURCE IMAGE:
${ad.sourceFile}

NOTES:
${ad.notes}
`;
  }).join('\n');

  const header = `MedVirtual Meta - Paste-Ready Ad Copy
Campaign: ${CAMPAIGN.name}
Ad Set: ${AD_SET.name}
Audience: ${AD_SET.audienceName}
Form: ${FORM.name}
Budget: ${CAMPAIGN.dailyBudgetDisplay}
Geo: ${CAMPAIGN.geo}
Everything stays PAUSED/DRAFT until Haylie / CMO approval.

Safest workflow if bulk import fails:
1) Create campaign + ad set shell in Meta
2) Create draft Instant Form manually
3) Paste each block below into a new draft ad
4) Attach creative from Media Library
5) Mobile preview all 4 ads
6) Send draft for review - do not publish

`;

  fs.writeFileSync(path.join(EXPORTS, 'meta-paste-ready-ad-copy.txt'), header + blocks, 'utf8');
}

function writeFormBuildInstructions() {
  const md = `# Meta Instant Form Build Instructions

**Form name (exact):** \`${FORM.name}\`  
**Status:** Save as **draft**. Do not publish.  
**Shared form:** Use this one form for all 4 ads.

Instant Forms are created manually in Meta Ads Manager / Instant Forms. Do not expect reliable CSV bulk creation for forms.

---

## Step-by-step

1. In Ads Manager, open **Instant Forms** (or create form from the ad destination step).
2. Create a new form.
3. Set form name exactly:
   \`${FORM.name}\`
4. Choose form type:
   **${FORM.type}**
5. Intro headline:
   ${FORM.introHeadline}
6. Intro body:
   ${FORM.introBody}
7. Add required contact fields:
   - Full name
   - Email
   - Phone number
8. Custom question 1:
   **Practice name** (short answer)
9. Custom question 2:
   **What type of practice do you manage?**
   Options:
   - Medical practice
   - Dental practice
   - Specialty practice
   - Multi-location practice
   - Other
10. Custom question 3:
    **What support do you need most?**
    Options:
    - Calls and scheduling
    - Patient intake
    - Insurance verification
    - Billing support
    - EMR/admin support
    - Dental admin support
    - Not sure yet
11. Privacy policy URL:
    \`${FORM.privacyUrl}\`
12. Thank-you screen headline:
    ${FORM.thankYouHeadline}
13. Thank-you screen body:
    ${FORM.thankYouBody}
14. Button text:
    ${FORM.buttonText}
15. Button URL:
    \`${FORM.buttonUrl}\`
16. Save as **draft**.
17. Do **not** publish until privacy URL + booking link are replaced with real values.

---

## After URLs arrive

1. Replace privacy policy URL with the real MedVirtual privacy policy.
2. Replace thank-you button URL with Haylie booking link.
3. Append UTM pattern to booking link:
   \`${UTM_PATTERN}\`
4. Re-QA form preview on mobile.
5. Confirm HubSpot lead view sees \`IMB_MV\` form submissions.
6. Keep form draft until CMO approval, then publish with campaign.

---

## Language check

Use: MedVirtual, full-time virtual staff, part of your practice team, hire through MedVirtual, Book a Demo.

Avoid: MedVirtual.ai, managed service, outsourced front desk, front desk replacement, we handle your front desk, recruiting/job-seeker language.
`;
  fs.writeFileSync(path.join(EXPORTS, 'meta-form-build-instructions.md'), md, 'utf8');
}

function writeLaunchStepByStep() {
  const md = `# Meta Launch Step-by-Step (Ads Manager)

**Goal:** Get the first batch into Meta today as **draft/paused**. Do not publish.

**Structure:** 1 campaign · 1 ad set · 4 ads · 1 shared Instant Form

---

## Safest bulk workflow

1. Create campaign + ad set shell in Meta (paused).
2. Create Instant Form manually as draft.
3. Upload creatives to Media Library.
4. Either:
   - **Preferred:** Export Meta's Import/Export template, map values from \`meta-bulk-import-attempt.csv\` / \`meta-manual-build-sheet.csv\` into Meta's exact column names, then import; **or**
   - **Fallback:** Paste from \`meta-paste-ready-ad-copy.txt\` into 4 draft ads.
5. Review every draft ad manually on mobile.
6. Keep everything off until Haylie / CMO approval.

Do not assume Cursor-generated import columns match Meta's live template. Column names change. Match to Meta's export.

---

## Exact build order inside Meta

### Step 1 - Confirm assets
- Open launch pack
- Confirm 4 selected creatives
- Confirm Ad 2 dental interim flag
- Confirm Ad 4 price block
- Confirm no extra audiences / ad sets

### Step 2 - Create campaign shell
- Name: \`${CAMPAIGN.name}\`
- Objective: Leads
- Special ad categories: do **not** mark as employment/job ad
- Status: **Off / Paused**

### Step 3 - Create ad set
- Name: \`${AD_SET.name}\`
- Conversion location: Instant Form
- Optimization: Leads / Instant Form submissions
- Budget: ${CAMPAIGN.dailyBudgetDisplay}
- Geo: ${CAMPAIGN.geo}
- Audience: \`${AD_SET.audienceName}\`
- Do **not** add interests, job titles, behaviors, or extra detailed targeting
- Placements: Advantage+ placements
- Status: **Off / Paused**

### Step 4 - Create draft form
- Follow \`meta-form-build-instructions.md\`
- Form name: \`${FORM.name}\`
- Save as draft
- Leave privacy + booking placeholders until real URLs arrive

### Step 5 - Bulk import / build 4 ads
- Upload images to Media Library first
- Try import using Meta template + mapped values from \`meta-bulk-import-attempt.csv\`
- If import fails, use \`meta-manual-build-sheet.csv\` + \`meta-paste-ready-ad-copy.txt\`
- Create exactly these ads:
  1. \`${ADS[0].adName}\`
  2. \`${ADS[1].adName}\`
  3. \`${ADS[2].adName}\`
  4. \`${ADS[3].adName}\` (keep paused / blocked until $10/hour confirmed)
- Destination: shared form \`${FORM.name}\`
- CTA: Book a Demo

### Step 6 - Review mobile previews
- Preview all 4 ads on mobile
- Check copy language rules
- Check creative CTA says Book a Demo on final art
- Confirm no recruiting/job-seeker vibe

### Step 7 - Send Haylie draft for review
- Share Ads Manager draft link / screenshots
- Share launch pack URL
- Call out blockers: booking link, privacy URL, creative re-export, $10/hour, dental interim image

### Step 8 - Add booking link / privacy URL
- Replace form privacy URL
- Replace thank-you button URL
- Add UTM pattern:
  \`${UTM_PATTERN}\`
- Confirm HubSpot lead view

### Step 9 - Publish only after approval
- Final QA checklist
- Turn on only after Haylie / CMO approval
- Monitor $500/day vs $10k monthly pacing (~20 days)

---

## Do not build yet

- Extra ad sets
- Broad US no-interest ad set
- 2% / 3% lookalike
- Interest stacks
- Separate dental ad set
- Retargeting

Those are future tests only.
`;
  fs.writeFileSync(path.join(EXPORTS, 'meta-launch-step-by-step.md'), md, 'utf8');
}

function writeDraftReviewChecklist() {
  const md = `# Meta Draft Review Checklist (Before Final Review)

Use this after the draft campaign exists in Ads Manager and before asking Haylie to approve publish.

---

## Campaign / ad set

- [ ] Campaign name correct: \`${CAMPAIGN.name}\`
- [ ] Ad set name correct: \`${AD_SET.name}\`
- [ ] Audience exact: \`${AD_SET.audienceName}\`
- [ ] No interests / job titles / behaviors added
- [ ] Geo United States
- [ ] Budget ${CAMPAIGN.dailyBudgetDisplay}
- [ ] Monthly pacing note understood ($10k ~ 20 days at $500/day)
- [ ] Objective Leads
- [ ] Instant Form selected
- [ ] Advantage+ placements
- [ ] Campaign / ad set status Off or Paused

## Form

- [ ] Form starts with IMB_MV
- [ ] Form name exact: \`${FORM.name}\`
- [ ] Form saved as draft
- [ ] Higher Intent selected if available
- [ ] Required fields: full name, email, phone
- [ ] Custom questions present (practice name, practice type, support needed)
- [ ] Booking link added (not \`${WAITING.booking}\`)
- [ ] Privacy policy URL added (not \`${WAITING.privacy}\`)
- [ ] Thank-you CTA = Book a Demo

## Ads

- [ ] Exactly 4 ads, correct names
- [ ] CTA Book a Demo
- [ ] MedVirtual only
- [ ] No MedVirtual.ai
- [ ] No managed service language
- [ ] No front desk replacement language
- [ ] No job-seeker / recruiting vibe
- [ ] Creative copy matches approved on-image headlines/supporting lines
- [ ] Creative files 1080x1350
- [ ] All ads previewed on mobile
- [ ] Ad 2 dental interim flagged / accepted or swapped
- [ ] $10/hour approved **or** Ad 4 paused/blocked
- [ ] Shared form attached to all ads

## Tracking check before publish

- [ ] Instant Form campaign can be drafted before website pixel confirmation
- [ ] HubSpot lead integration / lead view sees IMB_MV forms
- [ ] Events Manager checked for MedVirtual dataset/pixel status if booking-link conversions will be tracked later
- [ ] If thank-you sends to booking page: booking link + UTM confirmed
- [ ] Recommended UTM ready:
  \`${UTM_PATTERN}\`
- [ ] If switching to website conversions later: verify pixel/conversion events first
- [ ] For now, primary tracked event = Meta Instant Form lead submission

## Final gate

- [ ] Nothing published before Haylie approval
- [ ] CMO / Haylie explicit go-live approval received
`;
  fs.writeFileSync(path.join(EXPORTS, 'meta-draft-review-checklist.md'), md, 'utf8');
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
  <title>Selected Creative Contact Sheet - MedVirtual Meta Launch</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--mv-font); background: #f1f5f9; color: #0f172a; line-height: 1.4; }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 1.25rem 1.15rem 2.5rem; }
    .hero { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 1.1rem 1.2rem; margin-bottom: 1rem; }
    .hero h1 { font-size: 1.15rem; margin-bottom: 0.35rem; }
    .hero p { font-size: 0.84rem; color: #94a3b8; }
    .alert { background: #fff7ed; border: 1px solid #fdba74; border-left: 4px solid #ea580c; border-radius: 8px; padding: 0.75rem 0.9rem; margin-bottom: 1rem; font-size: 0.82rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
    .card-meta { padding: 0.85rem 0.9rem 0.5rem; }
    .pill { display: inline-block; font-size: 0.68rem; font-weight: 700; background: var(--mv-primary); color: #fff; padding: 0.2rem 0.45rem; border-radius: 4px; margin-bottom: 0.35rem; }
    .card h2 { font-size: 0.98rem; }
    .ad-name { font-size: 0.72rem; color: #64748b; margin-top: 0.2rem; }
    .frame { background: #e2e8f0; aspect-ratio: 4 / 5; display: flex; align-items: center; justify-content: center; }
    .frame img { width: 100%; height: 100%; object-fit: contain; background: #f8fafc; }
    .copy { padding: 0.75rem 0.9rem 1rem; font-size: 0.78rem; display: grid; gap: 0.45rem; }
    .copy dt { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; font-weight: 700; }
    .copy dd { color: #0f172a; }
    .warn dd { color: #9a3412; }
    a.back { display: inline-block; margin-bottom: 0.75rem; font-size: 0.82rem; color: var(--mv-primary); font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="/meta-launch-build-pack.html">← Meta Launch Build Pack</a>
    <div class="hero">
      <h1>Selected creatives - visual QA</h1>
      <p>4 mapped images for first Meta batch. Previews are padded 1080x1350 from square sources. Final designer exports still required.</p>
    </div>
    <div class="alert"><strong>QA note:</strong> Current source files include baked-in headlines/CTAs that do not match the approved 4-concept copy. Use this sheet to confirm image selection only - not final on-image text.</div>
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
    ${ad.publishBlock ? '<span class="pill pill-warn">PRICE BLOCK</span>' : ''}
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
  body { font-family: var(--mv-font); background: #f1f5f9; color: #0f172a; line-height: 1.45; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 1rem 1.15rem 2.75rem; }
  .banner {
    background: var(--mv-primary); color: #fff; border-radius: 10px; padding: 0.7rem 1rem;
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
  .build-mode {
    background: #fff; border: 2px solid var(--mv-primary); border-radius: 12px; padding: 1rem 1.1rem; margin-bottom: 1rem;
  }
  .build-mode h2 { font-size: 1.05rem; margin-bottom: 0.35rem; color: #0f172a; }
  .build-mode > p { font-size: 0.8rem; color: #64748b; margin-bottom: 0.75rem; }
  .build-mode ol { list-style: none; display: grid; gap: 0.4rem; }
  .build-mode li {
    background: #f0fdfa; border: 1px solid #99f6e4; border-left: 4px solid var(--mv-primary);
    border-radius: 8px; padding: 0.55rem 0.75rem; font-size: 0.82rem;
  }
  .build-mode strong { color: var(--mv-primary); }
  .upload-now {
    background: #0f172a; color: #f8fafc; border: 3px solid #f97316; border-radius: 14px;
    padding: 1.1rem 1.2rem; margin-bottom: 1rem;
  }
  .upload-now h2 { font-size: 1.35rem; color: #fb923c; margin-bottom: 0.4rem; letter-spacing: 0.02em; }
  .upload-now p { font-size: 0.86rem; color: #cbd5e1; margin-bottom: 0.75rem; }
  .upload-links { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.75rem; }
  .upload-links a {
    display: inline-block; background: #f97316; color: #0f172a; text-decoration: none;
    font-size: 0.78rem; font-weight: 800; padding: 0.45rem 0.7rem; border-radius: 6px;
  }
  .upload-links a.file { background: #e2e8f0; color: #0f172a; font-weight: 700; }
  .upload-creatives { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
  @media (max-width: 900px) { .upload-creatives { grid-template-columns: 1fr 1fr; } }
  .upload-creatives a {
    display: block; background: #1e293b; border: 1px solid #334155; border-radius: 8px;
    padding: 0.45rem; text-decoration: none; color: #f8fafc; font-size: 0.68rem; text-align: center;
  }
  .upload-creatives img { width: 100%; aspect-ratio: 4/5; object-fit: contain; background: #0f172a; border-radius: 4px; margin-bottom: 0.35rem; }
  .upload-creatives strong { display: block; font-size: 0.72rem; color: #fdba74; }
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
  .pill { display: inline-block; font-size: 0.68rem; font-weight: 700; background: var(--mv-primary); color: #fff; padding: 0.18rem 0.45rem; border-radius: 4px; margin-right: 0.25rem; }
  .pill-warn { background: #ea580c; }
  .ad-card__body { display: grid; grid-template-columns: 180px 1fr; gap: 0.85rem; padding: 0.85rem; }
  @media (max-width: 700px) { .ad-card__body { grid-template-columns: 1fr; } }
  .thumb { background: #e2e8f0; border-radius: 8px; overflow: hidden; aspect-ratio: 4/5; }
  .thumb img { width: 100%; height: 100%; object-fit: contain; background: #f8fafc; display: block; }
  .fields { display: grid; gap: 0.4rem; font-size: 0.8rem; }
  .fields dt { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; font-weight: 700; }
  .fields dd { margin-top: 0.1rem; }
  .fields .warn dd { color: #9a3412; }
  .badge { display: inline-block; background: #ccfbf1; color: var(--mv-primary); font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.75rem; }
  .checklist, .steps, .waiting { list-style: none; display: grid; gap: 0.35rem; font-size: 0.82rem; }
  .checklist li, .waiting li { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem 0.7rem; }
  .steps li { background: #fff; border: 1px solid #e2e8f0; border-left: 3px solid var(--mv-primary); border-radius: 8px; padding: 0.55rem 0.75rem; }
  .steps strong { display: block; font-size: 0.78rem; color: var(--mv-primary); margin-bottom: 0.15rem; }
  .exports { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.5rem 0 1rem; }
  .exports a {
    display: inline-block; background: #0f172a; color: #fff; text-decoration: none; font-size: 0.75rem;
    font-weight: 600; padding: 0.4rem 0.65rem; border-radius: 6px;
  }
  .exports a.secondary { background: var(--mv-primary); }
  .exports a.warn { background: #ea580c; }
  .note { font-size: 0.78rem; color: #64748b; margin-top: 0.35rem; }
  .tracking { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 8px; padding: 0.75rem 0.9rem; margin: 0.85rem 0; font-size: 0.8rem; }
  .tracking ul { margin: 0.4rem 0 0 1.1rem; }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Meta Launch Build Pack - MedVirtual</title>
  <style>${css}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'launch-1',
    pageTitle: 'Launch 1 · detailed Ads Manager pack',
    pageSubtitle: 'Optional deep ops. Graphics team: use Launch 1 page first.',
    subnav: [
      { href: '/meta-launch-1.html', label: 'Launch 1' },
      { href: '/meta-launch-2.html', label: 'Launch 2' },
      { href: '/meta-launch-build-pack.html', label: 'Ads Manager details' },
    ],
    activeSubHref: '/meta-launch-build-pack.html',
  })}
  <div class="wrap">
    <div class="banner">NEW LAUNCH — FirstBatch killed. Upload Real People ads. Keep DRAFT / PAUSED until Haylie / CMO approval.</div>
    <div class="status"><strong>Build status:</strong> ${esc(CAMPAIGN.status)}</div>
    <div class="tracking" style="background:#fff7ed;border-color:#fdba74;border-left-color:#ea580c">
      <strong>What failed</strong>
      <ul>
        <li>Campaign <code>${esc(CAMPAIGN.killedCampaign)}</code> is dead — do not reopen spend on those statics.</li>
        <li>${esc(CAMPAIGN.killNote)}</li>
        <li>Kill anything that says “MedVirtual handles…”, “scale your clinic not your stress,” or managed front-desk language.</li>
      </ul>
    </div>

    <section class="upload-now">
      <h2>UPLOAD THESE 4 REAL PEOPLE ADS NOW</h2>
      <p>Create a <strong>new</strong> paused campaign + ad set + Instant Form. Upload these 1080×1350 drafts, paste copy, add UTMs, keep paused. Designer polish can swap files later — these are ready to load.</p>
      <div class="upload-links">
        <a href="/exports/meta-upload-ready/README_UPLOAD_NOW.md">Upload-ready folder README</a>
        <a href="/exports/meta-upload-ready/ad-copy-paste-ready.txt">Paste-ready copy</a>
        <a href="/exports/meta-upload-ready/meta-upload-checklist.md">Build checklist</a>
        <a href="/exports/meta-upload-ready/form-final-settings.md">Form final settings</a>
        <a href="/exports/meta-upload-ready/ads-manager-build-order.md">Build order</a>
        <a class="file" href="/exports/meta-upload-ready/utm-parameters.txt">UTM parameters</a>
        <a class="file" href="/exports/meta-upload-ready/creative-map.csv">Creative map CSV</a>
        <a href="/real-people-creative.html">Real People (Studio Profile + downloads)</a>
      </div>
      <div class="upload-creatives">
        ${ADS.map(
          (ad) => `<a href="/exports/meta-upload-ready/${esc(ad.uploadFile)}" target="_blank" rel="noopener">
          <img src="/exports/meta-upload-ready/${esc(ad.uploadFile)}" alt="${esc(ad.adName)}" />
          <strong>${esc(ad.adName)}</strong>
          ${esc(ad.uploadFile)}
        </a>`,
        ).join('')}
      </div>
    </section>

    <section class="build-mode">
      <h2>Build order (new shell)</h2>
      <p>Do not revive FirstBatch ads. Structure: 1 new campaign, 1 new ad set, 4 Real People ads, 1 Instant Form.</p>
      <ol>
        <li><strong>Step 1: Confirm assets</strong> — 4 Real People 1080×1350 files in upload-ready folder.</li>
        <li><strong>Step 2: Campaign</strong> — create <span class="mono">${esc(CAMPAIGN.name)}</span> (paused).</li>
        <li><strong>Step 3: Ad set</strong> — create <span class="mono">${esc(AD_SET.name)}</span> with same LAL audience (${esc(AD_SET.reuseNote)}).</li>
        <li><strong>Step 4: Form</strong> — create <span class="mono">${esc(FORM.name)}</span> (${esc(FORM.reuseNote)}).</li>
        <li><strong>Step 5: Upload 4 ads</strong> — Jessica first (lead), then Chelsea, Angelica, Mark.</li>
        <li><strong>Step 6: Mobile preview</strong> — hire framing, MedVirtual only, Book a Demo CTA.</li>
        <li><strong>Step 7: Send Haylie / CMO draft</strong> — keep paused.</li>
        <li><strong>Step 8: Publish only after approval</strong>.</li>
      </ol>
    </section>

    <section class="hero">
      <h2>MedVirtual Meta Leads — Real People</h2>
      <p>National US lookalike. Named Talent Pool people. Pain-first. Hire dedicated staff who join the practice team.</p>
    </section>

    <div class="exports">
      <a class="warn" href="/exports/meta-bulk-import-attempt.csv">Bulk import attempt CSV</a>
      <a class="secondary" href="/exports/meta-manual-build-sheet.csv">Manual build sheet</a>
      <a class="secondary" href="/exports/meta-paste-ready-ad-copy.txt">Paste-ready ad copy</a>
      <a href="/exports/meta-form-build-instructions.md">Form build instructions</a>
      <a href="/exports/meta-launch-step-by-step.md">Step-by-step guide</a>
      <a href="/exports/meta-draft-review-checklist.md">Draft review checklist</a>
      <a href="/exports/meta-launch-build-sheet.csv">Launch build sheet</a>
      <a href="/exports/meta-ad-copy-map.csv">Ad copy map</a>
      <a href="/exports/selected-creative-contact-sheet.html">Creative contact sheet</a>
    </div>
    <p class="note">Safest bulk workflow: create campaign/ad set shell in Meta → export Meta template → map Cursor rows to Meta column names → import → review every draft ad manually. Instant Forms must be created manually.</p>

    <div class="grid-2">
      <section class="panel">
        <h3>Campaign settings</h3>
        <dl class="kv">
          <div><dt>Campaign name</dt><dd class="mono">${esc(CAMPAIGN.name)}</dd></div>
          <div><dt>Objective</dt><dd>${esc(CAMPAIGN.objective)}</dd></div>
          <div><dt>Conversion</dt><dd>${esc(CAMPAIGN.conversionLocation)}</dd></div>
          <div><dt>Optimization</dt><dd>${esc(CAMPAIGN.optimization)}</dd></div>
          <div><dt>Daily budget</dt><dd>${esc(CAMPAIGN.dailyBudgetDisplay)}</dd></div>
          <div><dt>Monthly note</dt><dd>${esc(CAMPAIGN.monthlyBudgetNote)}</dd></div>
          <div><dt>Geo</dt><dd>${esc(CAMPAIGN.geo)}</dd></div>
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
          <div><dt>Targeting rule</dt><dd>Lookalike only - no interests, job titles, or behaviors</dd></div>
          <div><dt>Structure</dt><dd>1 campaign / 1 ad set / 4 ads</dd></div>
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
        <p class="note">Create form manually. See form build instructions.</p>
      </section>
      <section class="panel">
        <h3>Still waiting on Haylie / CMO</h3>
        <ul class="waiting">
          <li>Approve Real People Studio Profile direction (Treatment C/D rejected)</li>
          <li>Optional designer polish / re-export of final art</li>
          <li>HubSpot lead view confirmation for new IMB_MV form</li>
          <li>Final publish approval — keep paused until then</li>
        </ul>
      </section>
    </div>

    <div class="tracking">
      <strong>Tracking Check Before Publish</strong>
      <ul>
        <li>This Instant Form campaign can be drafted before website pixel confirmation.</li>
        <li>Before publishing, confirm HubSpot lead integration / lead view sees IMB_MV forms.</li>
        <li>Check Events Manager for MedVirtual dataset/pixel status if booking-link conversions will be tracked.</li>
        <li>If thank-you sends users to a booking page, confirm booking link + UTM tracking.</li>
        <li>Recommended UTM once booking link exists: <code>${esc(UTM_PATTERN)}</code></li>
        <li>If using website conversions later, verify pixel/conversion events before switching objectives.</li>
        <li>For now, the primary tracked event is Meta Instant Form lead submission.</li>
      </ul>
    </div>

    <h2 class="section-title">4 draft ads</h2>
    ${adCards}

    <h2 class="section-title">Creative rules</h2>
    <ul class="checklist">
      <li>Upload Real People 1080×1350 drafts now — designer polish can replace files later</li>
      <li>CTA = Book a Demo</li>
      <li>MedVirtual only — never MedVirtual.ai in ad copy</li>
      <li>Hire dedicated staff who join the practice team — not a managed front desk</li>
      <li>No “MedVirtual handles…” / call-center / scale-your-stress creatives</li>
      <li>No unverified $10 / savings claims on this batch</li>
      <li>FirstBatch statics stay archived / killed</li>
    </ul>

    <h2 class="section-title">Final QA checklist</h2>
    <ul class="checklist">
      <li>☐ New campaign name: RealPeople (not FirstBatch)</li>
      <li>☐ Ad set name correct</li>
      <li>☐ Same LAL audience, no interest stacks</li>
      <li>☐ Geo United States</li>
      <li>☐ Budget ${esc(CAMPAIGN.dailyBudgetDisplay)}</li>
      <li>☐ Objective Leads · Instant Form</li>
      <li>☐ Form starts with IMB_MV · Book a Demo</li>
      <li>☐ Booking + privacy URLs set</li>
      <li>☐ MedVirtual only · no MedVirtual.ai</li>
      <li>☐ No managed service / front desk replacement language</li>
      <li>☐ No job-seeker vibe</li>
      <li>☐ No $10 claim unless separately approved</li>
      <li>☐ Four Real People creatives previewed on mobile</li>
      <li>☐ Nothing published before Haylie / CMO approval</li>
    </ul>
  </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(PUBLIC, 'meta-launch-build-pack.html'), html, 'utf8');
}

async function main() {
  ensureDirs();
  for (const ad of ADS) {
    if (!fs.existsSync(ad.sourcePath)) {
      console.error('Missing Real People creative:', ad.sourcePath);
      process.exit(1);
    }
  }
  await generatePreviewCrops();
  writeUploadReadyPackage();
  writeBuildSheetCsv();
  writeCopyMapCsv();
  writeBulkImportAttemptCsv();
  writeManualBuildSheetCsv();
  writePasteReadyAdCopy();
  writeFormDraftMd();
  writeFormBuildInstructions();
  writeLaunchStepByStep();
  writeDraftReviewChecklist();
  writeChecklistMd();
  writeSelectedMapJson();
  writeContactSheetHtml();
  writeLaunchPackHtml();
  console.log('Meta Real People relaunch pack generated.');
  console.log('- public/meta-launch-build-pack.html');
  console.log('- public/exports/meta-upload-ready/');
  console.log(`- archived FirstBatch PNGs → ${ARCHIVE_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
