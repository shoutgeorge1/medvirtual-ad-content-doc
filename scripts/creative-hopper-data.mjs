/**
 * Creative Hopper — VA work queue for Graphics Request Form submissions.
 *
 * Target: 15–30 Meta ads ready to load at all times.
 * Rule: VAs only work the DO NOW batch (≤4). Everything else waits.
 *
 * Status lifecycle:
 *   do_now        → submit Graphics Request Form this week
 *   queued        → in the hopper, not yet assigned
 *   ready_to_load → art done; Media Buyer loads in Meta (see Meta Launch)
 *   live          → currently spending (optional mark)
 *   retired       → underperformed or replaced — do not rebuild
 *   killed        → never ship / campaign dead — do not rebuild
 *
 * To retire a loser: set status to 'retired' or 'killed' + add killReason.
 * Regenerate: npm run generate:brief
 */

import { BRAND } from './medvirtual-brand-data.mjs';

/** Default requester email — update when VA / producer inbox changes */
export const GRAPHICS_REQUEST_EMAIL = 'UPDATE_ME@medvirtual.ai';

export const HOPPER_POLICY = {
  targetReadyMin: 15,
  targetReadyMax: 30,
  maxDoNow: 4,
  primaryLayout: 'Treatment E — Hailey / Role-Offer Meet',
  primaryRatio: '1080×1350 (4:5 feed)',
  brand: BRAND.adFacingName,
  briefUrl: 'https://medvirtual-ad-content-doc.vercel.app/graphic-request-brief.html',
  realPeopleUrl: 'https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html',
  brandGuideUrl: 'https://medvirtual-ad-content-doc.vercel.app/medvirtual-brand-guide.html',
  metaLaunchUrl: 'https://medvirtual-ad-content-doc.vercel.app/meta-launch-build-pack.html',
  howItWorks: [
    'Open one of the 4 jobs below.',
    'Download the photo, logo, and example ad linked on that card.',
    'Match the example look. Change the person / size as the card says.',
    'When finished, send the PNG back to your MedVirtual contact.',
  ],
  languageRules: [
    'Brand name on ads: MedVirtual (not MedVirtual.ai)',
    'Say we hire dedicated full-time virtual staff for the practice team',
    'Do not say call center, “we run your front desk,” or managed service',
    'Do not invent HIPAA, savings $, or credentials',
  ],
};

/**
 * One Graphics Request Form item.
 * formType examples: Static Meta Ad · Resize · Story/Reels · Video
 */
export const HOPPER_ITEMS = [
  // ─── DO NOW (max 4) — open Graphics Requests ───────────────────────────
  {
    id: 'rp-carmen-4x5',
    status: 'do_now',
    priority: 1,
    batchLabel: 'New person ad',
    designerTitle: 'Make a Meet Carmen ad',
    title: 'MV RP Static — Meet Carmen · Billing Support · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px (4:5 feed)',
    dueDate: '07/20/2026',
    talentId: 'carmen',
    layout: 'Treatment E — Hailey / Role-Offer Meet',
    onImage: 'Meet Carmen',
    roleLine: 'Medical Biller',
    proofLine: 'Use only skills/titles visible on her Talent Pool profile',
    metaHeadline: 'Billing Work Piling Up?',
    primaryText:
      'Billing follow-up can bury your team.\n\nMeet Carmen — available through MedVirtual. Hire a dedicated full-time virtual teammate your practice can interview.\n\nBook a demo to request an interview.',
    cta: 'Learn More',
    description:
      'Make one Facebook/Instagram feed ad. Size: 1080×1350.\n\nCopy the Jessica example ad (same layout). Swap in Carmen.\n\nPut on the image:\n• Light cyan / grid background (not dark teal)\n• “Hire a Virtual” + “Meet Carmen”\n• Job title pill: Medical Biller\n• 2–3 skills from her profile as checkmarks\n• “REQUEST AN INTERVIEW” button\n• Colored MedVirtual logo\n• Carmen photo on the right\n\nDo not invent HIPAA, pay rates, or credentials.',
    references: [
      '/assets/real-people/jessica/ad-treatment-e-4x5.png',
      '/assets/real-people/carmen/clean-master.jpg',
      '/assets/brand/medvirtual/logo-colored.svg',
      'https://medvirtual-ad-content-doc.vercel.app/role-offer-templates.html',
    ],
  },
  {
    id: 'rp-jennifer-4x5',
    status: 'do_now',
    priority: 2,
    batchLabel: 'New person ad',
    designerTitle: 'Make a Meet Jennifer ad',
    title: 'MV RP Static — Meet Jennifer · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px (4:5 feed)',
    dueDate: '07/20/2026',
    talentId: 'jennifer',
    layout: 'Treatment E — Hailey / Role-Offer Meet',
    onImage: 'Meet Jennifer',
    roleLine: 'Patient Intake Coordinator',
    proofLine: 'Public profile skills/titles only',
    metaHeadline: 'Need Dedicated Virtual Support?',
    primaryText:
      'Your in-office team is stretched. Meet Jennifer — available through MedVirtual.\n\nHire dedicated full-time virtual staff who work as part of your practice team.\n\nBook a demo to request an interview.',
    cta: 'Learn More',
    description:
      'Make one Facebook/Instagram feed ad. Size: 1080×1350.\n\nCopy the Jessica example ad (same layout). Swap in Jennifer.\n\nPut on the image:\n• Light cyan / grid background (not dark teal)\n• “Hire a Virtual” + “Meet Jennifer”\n• Job title pill: Patient Intake Coordinator\n• 2–3 skills from her profile as checkmarks\n• “REQUEST AN INTERVIEW” button\n• Colored MedVirtual logo\n• Jennifer photo on the right\n\nDo not invent HIPAA, pay rates, or credentials.',
    references: [
      '/assets/real-people/jessica/ad-treatment-e-4x5.png',
      '/assets/real-people/jennifer/clean-master.jpg',
      '/assets/brand/medvirtual/logo-colored.svg',
    ],
  },
  {
    id: 'rp-jessica-9x16',
    status: 'do_now',
    priority: 3,
    batchLabel: 'Resize only',
    designerTitle: 'Resize Jessica ad for Stories',
    title: 'MV RP Resize — Meet Jessica · 9:16 Stories',
    formType: 'Resize / Story',
    resolution: '1080×1920 px (9:16 Stories/Reels)',
    dueDate: '07/20/2026',
    talentId: 'jessica',
    layout: 'Treatment E — Hailey / Role-Offer Meet (tall)',
    onImage: 'Meet Jessica',
    roleLine: 'Jr. Medical Admin',
    proofLine: 'Customer service · healthcare support',
    metaHeadline: 'Admin Work Piling Up?',
    primaryText:
      'Calls keep coming. Tasks keep stacking.\n\nMeet Jessica — Jr. Medical Admin through MedVirtual. Hire dedicated full-time virtual staff for your practice team.\n\nBook a demo to request an interview.',
    cta: 'Learn More',
    description:
      'This is a RESIZE only — not a new design.\n\nTake Jessica’s finished 4:5 feed ad and make a tall Stories version: 1080×1920.\n\nKeep the same person, text, logo, and look.\nLeave empty space at the top and bottom (Stories UI covers those areas).\n\nDo not add new claims or rewrite copy.',
    references: [
      '/assets/real-people/jessica/ad-treatment-e-4x5.png',
      '/assets/real-people/jessica/ad-treatment-e-9x16.png',
      '/assets/real-people/jessica/clean-master.jpg',
    ],
  },
  {
    id: 'rp-chelsea-9x16',
    status: 'do_now',
    priority: 4,
    batchLabel: 'Resize only',
    designerTitle: 'Resize Chelsea ad for Stories',
    title: 'MV RP Resize — Meet Chelsea · 9:16 Stories',
    formType: 'Resize / Story',
    resolution: '1080×1920 px (9:16 Stories/Reels)',
    dueDate: '07/20/2026',
    talentId: 'chelsea',
    layout: 'Treatment E — Hailey / Role-Offer Meet (tall)',
    onImage: 'Meet Chelsea',
    roleLine: 'Dental Virtual Assistant',
    proofLine: 'Appointment setting · customer service · healthcare support',
    metaHeadline: 'Scheduling Taking Over?',
    primaryText:
      'Scheduling should not consume your front desk.\n\nMeet Chelsea — Dental Virtual Assistant through MedVirtual. Hire dedicated virtual staff your practice can interview.\n\nBook a demo.',
    cta: 'Learn More',
    description:
      'This is a RESIZE only — not a new design.\n\nTake Chelsea’s finished 4:5 feed ad and make a tall Stories version: 1080×1920.\n\nKeep the same person, text, logo, and look.\nLeave empty space at the top and bottom (Stories UI covers those areas).\n\nDo not add new claims or rewrite copy.',
    references: [
      '/assets/real-people/chelsea/ad-treatment-e-4x5.png',
      '/assets/real-people/chelsea/ad-treatment-e-9x16.png',
      '/assets/real-people/chelsea/clean-master.jpg',
    ],
  },

  // ─── QUEUED (hopper — do not start until DO NOW clears) ────────────────
  {
    id: 'rp-mark-9x16',
    status: 'queued',
    priority: 5,
    batchLabel: 'Batch C · Stories',
    title: 'MV RP Resize — Meet Mark · 9:16',
    formType: 'Resize / Story',
    resolution: '1080×1920 px',
    dueDate: '07/27/2026',
    talentId: 'mark',
    layout: 'Treatment E — Hailey / Role-Offer Meet (tall)',
    onImage: 'Meet Mark',
    roleLine: 'Insurance Verification Specialist',
    metaHeadline: 'Verification Work Piling Up?',
    primaryText:
      'Insurance verification can pull your team away from patients.\n\nMeet Mark through MedVirtual. Hire dedicated full-time virtual support.\n\nBook a demo.',
    cta: 'Learn More',
    description:
      'Resize Mark Studio Profile to 9:16. Same Treatment E rules. Sources on Real People page.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html#person-mark',
      '/assets/real-people/mark/ad-treatment-e-9x16.png',
    ],
  },
  {
    id: 'rp-angelica-9x16',
    status: 'queued',
    priority: 6,
    batchLabel: 'Batch C · Stories',
    title: 'MV RP Resize — Meet Angelica · 9:16',
    formType: 'Resize / Story',
    resolution: '1080×1920 px',
    dueDate: '07/27/2026',
    talentId: 'angelica',
    layout: 'Treatment E — Hailey / Role-Offer Meet (tall)',
    onImage: 'Meet Angelica',
    roleLine: 'Dermatology Front Desk Assistant',
    metaHeadline: 'Front Desk Stretched Thin?',
    primaryText:
      'Front desk overloaded? Meet Angelica through MedVirtual. Hire dedicated virtual staff — not a call center.\n\nBook a demo.',
    cta: 'Learn More',
    description: 'Resize Angelica Studio Profile to 9:16. Treatment E only.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html#person-angelica',
      '/assets/real-people/angelica/ad-treatment-e-9x16.png',
    ],
  },
  {
    id: 'rp-jessica-1x1',
    status: 'queued',
    priority: 7,
    batchLabel: 'Batch C · Square',
    title: 'MV RP Resize — Meet Jessica · 1:1',
    formType: 'Resize',
    resolution: '1080×1080 px',
    dueDate: '07/27/2026',
    talentId: 'jessica',
    layout: 'Treatment E — Hailey / Role-Offer Meet (square)',
    onImage: 'Meet Jessica',
    roleLine: 'Jr. Medical Admin',
    metaHeadline: 'Admin Work Piling Up?',
    primaryText: 'Meet Jessica through MedVirtual. Hire dedicated virtual medical admin support.',
    cta: 'Learn More',
    description: 'Square crop of Jessica Studio Profile. Keep type readable; crop carefully around face.',
    references: ['/assets/real-people/jessica/ad-treatment-e-1x1.png'],
  },
  {
    id: 'rp-chelsea-1x1',
    status: 'queued',
    priority: 8,
    batchLabel: 'Batch C · Square',
    title: 'MV RP Resize — Meet Chelsea · 1:1',
    formType: 'Resize',
    resolution: '1080×1080 px',
    dueDate: '07/27/2026',
    talentId: 'chelsea',
    layout: 'Treatment E — Hailey / Role-Offer Meet (square)',
    onImage: 'Meet Chelsea',
    roleLine: 'Dental Virtual Assistant',
    metaHeadline: 'Scheduling Taking Over?',
    primaryText: 'Meet Chelsea through MedVirtual for scheduling support.',
    cta: 'Learn More',
    description: 'Square crop of Chelsea Studio Profile.',
    references: ['/assets/real-people/chelsea/ad-treatment-e-1x1.png'],
  },
  {
    id: 'rp-mark-1x1',
    status: 'queued',
    priority: 9,
    batchLabel: 'Batch D · Square',
    title: 'MV RP Resize — Meet Mark · 1:1',
    formType: 'Resize',
    resolution: '1080×1080 px',
    dueDate: '08/03/2026',
    talentId: 'mark',
    onImage: 'Meet Mark',
    roleLine: 'Insurance Verification Specialist',
    metaHeadline: 'Verification Work Piling Up?',
    primaryText: 'Meet Mark through MedVirtual for verification support.',
    cta: 'Learn More',
    description: 'Square Mark Studio Profile.',
    references: ['/assets/real-people/mark/ad-treatment-e-1x1.png'],
  },
  {
    id: 'rp-angelica-1x1',
    status: 'queued',
    priority: 10,
    batchLabel: 'Batch D · Square',
    title: 'MV RP Resize — Meet Angelica · 1:1',
    formType: 'Resize',
    resolution: '1080×1080 px',
    dueDate: '08/03/2026',
    talentId: 'angelica',
    onImage: 'Meet Angelica',
    roleLine: 'Front Desk Assistant',
    metaHeadline: 'Front Desk Stretched Thin?',
    primaryText: 'Meet Angelica through MedVirtual.',
    cta: 'Learn More',
    description: 'Square Angelica Studio Profile.',
    references: ['/assets/real-people/angelica/ad-treatment-e-1x1.png'],
  },
  {
    id: 'rp-carmen-9x16',
    status: 'queued',
    priority: 11,
    batchLabel: 'Batch D · Stories',
    title: 'MV RP Resize — Meet Carmen · 9:16',
    formType: 'Resize / Story',
    resolution: '1080×1920 px',
    dueDate: '08/03/2026',
    talentId: 'carmen',
    onImage: 'Meet Carmen',
    metaHeadline: 'Billing Work Piling Up?',
    primaryText: 'Meet Carmen through MedVirtual. Hire dedicated virtual billing support.',
    cta: 'Learn More',
    description: '9:16 after Carmen 4:5 is approved. Do not start early.',
    references: ['https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html#downloads'],
  },
  {
    id: 'rp-jennifer-9x16',
    status: 'queued',
    priority: 12,
    batchLabel: 'Batch D · Stories',
    title: 'MV RP Resize — Meet Jennifer · 9:16',
    formType: 'Resize / Story',
    resolution: '1080×1920 px',
    dueDate: '08/03/2026',
    talentId: 'jennifer',
    onImage: 'Meet Jennifer',
    metaHeadline: 'Need Dedicated Virtual Support?',
    primaryText: 'Meet Jennifer through MedVirtual.',
    cta: 'Learn More',
    description: '9:16 after Jennifer 4:5 is approved.',
    references: ['https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html#downloads'],
  },
  {
    id: 'rp-jessica-alt-hook',
    status: 'queued',
    priority: 13,
    batchLabel: 'Batch E · copy test',
    title: 'MV RP Static — Jessica alt Meta headline pack · same art',
    formType: 'Copy-only / same art',
    resolution: 'N/A — reuse Jessica 4:5 art',
    dueDate: '08/10/2026',
    talentId: 'jessica',
    onImage: '(same art) Meet Jessica',
    metaHeadline: 'Too Much Admin. Not Enough Day.',
    primaryText:
      'Too much admin and not enough day?\n\nMeet Jessica through MedVirtual. Hire dedicated virtual medical admin support — part of your practice team.\n\nBook a demo.',
    cta: 'Learn More',
    description:
      'NO NEW ART. Same Jessica Studio Profile PNG. New Meta headline/primary only for A/B. Media Buyer duplicates ad with new copy.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/meta-launch-build-pack.html',
      '/exports/meta-upload-ready/IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
    ],
  },
  {
    id: 'rp-chelsea-alt-hook',
    status: 'queued',
    priority: 14,
    batchLabel: 'Batch E · copy test',
    title: 'MV RP Static — Chelsea alt Meta headline pack · same art',
    formType: 'Copy-only / same art',
    resolution: 'N/A — reuse Chelsea 4:5 art',
    dueDate: '08/10/2026',
    talentId: 'chelsea',
    onImage: '(same art) Meet Chelsea',
    metaHeadline: 'Front Desk Buried in Scheduling?',
    primaryText:
      'Front desk buried in scheduling?\n\nMeet Chelsea through MedVirtual. Hire dedicated virtual scheduling support.\n\nBook a demo.',
    cta: 'Learn More',
    description: 'NO NEW ART. Duplicate Chelsea ad with alternate Meta copy only.',
    references: ['/exports/meta-upload-ready/IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png'],
  },
  {
    id: 'stock-ops-calls-safe',
    status: 'queued',
    priority: 15,
    batchLabel: 'Batch F · non-RP (only if RP hopper full)',
    title: 'MV Static — Ops overload · no named talent · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '08/17/2026',
    layout: 'Simple ops photo + short hook (NOT Studio Profile, NOT FirstBatch flyer)',
    onImage: 'Too many calls. Not enough staff.',
    metaHeadline: 'Too Many Calls. Not Enough Staff.',
    primaryText:
      'Too many calls. Not enough staff.\n\nHire dedicated full-time virtual staff through MedVirtual — part of your practice team.\n\nBook a demo.',
    cta: 'Book a Demo',
    description:
      'ONLY start if Real People hopper already has ≥15 ready_to_load.\nUse approved Image Review crop (not stock headset cliché if better option exists).\nOn-image: short pain line + MedVirtual logo. No $10 unless confirmed. No managed-service language.\nReferences: Image Review recommended crops + Brand Guide.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/image-variation-review.html',
      'https://medvirtual-ad-content-doc.vercel.app/medvirtual-brand-guide.html',
    ],
  },
  {
    id: 'stock-dental-schedule-safe',
    status: 'queued',
    priority: 16,
    batchLabel: 'Batch F · non-RP',
    title: 'MV Static — Dental scheduling support · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '08/17/2026',
    onImage: 'Scheduling backup for dental practices.',
    metaHeadline: 'Dental Scheduling Support',
    primaryText:
      'Dental practices: add dedicated virtual scheduling support through MedVirtual.\n\nHire full-time virtual staff who join your practice team.\n\nBook a demo.',
    cta: 'Book a Demo',
    description:
      'Non-RP filler. Clean dental-ops visual (no graphic clinical). Official logo. Skip if RP hopper not full.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/image-variation-review.html',
      'https://medvirtual-ad-content-doc.vercel.app/graphic-request-brief.html',
    ],
  },

  // ─── READY TO LOAD (art done — Meta Launch) ────────────────────────────
  {
    id: 'rp-jessica-4x5',
    status: 'ready_to_load',
    priority: 0,
    batchLabel: 'Batch A · live pack',
    title: 'MV RP Static — Meet Jessica · Admin · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '—',
    talentId: 'jessica',
    onImage: 'Meet Jessica',
    roleLine: 'Jr. Medical Admin',
    metaHeadline: 'Admin Work Piling Up?',
    primaryText:
      'Calls keep coming. Tasks keep stacking. Your team is already stretched.\n\nMeet Jessica — a Jr. Medical Admin available through MedVirtual. Hire a dedicated full-time virtual staff member who works as part of your practice team.\n\nBook a demo to request an interview.',
    cta: 'Learn More',
    description: 'DONE. Upload from Meta Launch pack. Draft art may get designer polish later.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/meta-launch-build-pack.html',
      '/exports/meta-upload-ready/IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
    ],
    uploadFile: 'IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
  },
  {
    id: 'rp-chelsea-4x5',
    status: 'ready_to_load',
    priority: 0,
    batchLabel: 'Batch A · live pack',
    title: 'MV RP Static — Meet Chelsea · Scheduling · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '—',
    talentId: 'chelsea',
    onImage: 'Meet Chelsea',
    metaHeadline: 'Scheduling Taking Over?',
    primaryText:
      'Scheduling should not consume your entire front desk.\n\nMeet Chelsea — a Dental Virtual Assistant available through MedVirtual.\n\nBook a demo to get started.',
    cta: 'Learn More',
    description: 'DONE. Meta Launch upload pack.',
    references: [
      'https://medvirtual-ad-content-doc.vercel.app/meta-launch-build-pack.html',
      '/exports/meta-upload-ready/IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png',
    ],
    uploadFile: 'IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png',
  },
  {
    id: 'rp-angelica-4x5',
    status: 'ready_to_load',
    priority: 0,
    batchLabel: 'Batch A · live pack',
    title: 'MV RP Static — Meet Angelica · Front Desk · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '—',
    talentId: 'angelica',
    onImage: 'Meet Angelica',
    metaHeadline: 'Front Desk Stretched Thin?',
    primaryText:
      'Patients are waiting. Phones are ringing. Follow-up is stacking up.\n\nMeet Angelica through MedVirtual. Hire dedicated virtual staff — not a call center.\n\nBook a demo.',
    cta: 'Learn More',
    description: 'DONE. Meta Launch upload pack.',
    references: [
      '/exports/meta-upload-ready/IMB_MV_RP_Static_03_AngelicaFrontDesk_1080x1350.png',
    ],
    uploadFile: 'IMB_MV_RP_Static_03_AngelicaFrontDesk_1080x1350.png',
  },
  {
    id: 'rp-mark-4x5',
    status: 'ready_to_load',
    priority: 0,
    batchLabel: 'Batch A · live pack',
    title: 'MV RP Static — Meet Mark · Verification · 4:5',
    formType: 'Static Meta Ad',
    resolution: '1080×1350 px',
    dueDate: '—',
    talentId: 'mark',
    onImage: 'Meet Mark',
    metaHeadline: 'Verification Work Piling Up?',
    primaryText:
      'Insurance verification can pull your team away from patients.\n\nMeet Mark through MedVirtual. Hire dedicated full-time virtual verification support.\n\nBook a demo.',
    cta: 'Learn More',
    description: 'DONE. Meta Launch upload pack.',
    references: [
      '/exports/meta-upload-ready/IMB_MV_RP_Static_04_MarkVerification_1080x1350.png',
    ],
    uploadFile: 'IMB_MV_RP_Static_04_MarkVerification_1080x1350.png',
  },

  // ─── KILLED / RETIRED — do not rebuild ─────────────────────────────────
  {
    id: 'fb-medical-owners',
    status: 'killed',
    priority: 99,
    batchLabel: 'FirstBatch · killed',
    title: 'DO NOT BUILD — Medical Practice Owners',
    formType: '—',
    resolution: '—',
    dueDate: '—',
    killReason: 'FirstBatch campaign killed. Stock audience-callout creative underperformed / retired.',
    description: 'Do not submit a Graphics Request for this.',
    references: [],
  },
  {
    id: 'fb-dental-owners',
    status: 'killed',
    priority: 99,
    batchLabel: 'FirstBatch · killed',
    title: 'DO NOT BUILD — Dental Practice Owners',
    formType: '—',
    resolution: '—',
    dueDate: '—',
    killReason: 'FirstBatch campaign killed.',
    description: 'Do not submit a Graphics Request for this.',
    references: [],
  },
  {
    id: 'fb-virtual-med-admin',
    status: 'killed',
    priority: 99,
    batchLabel: 'FirstBatch · killed',
    title: 'DO NOT BUILD — Hire a Full-Time Virtual Medical Admin (old card)',
    formType: '—',
    resolution: '—',
    dueDate: '—',
    killReason: 'FirstBatch campaign killed.',
    description: 'Do not submit a Graphics Request for this.',
    references: [],
  },
  {
    id: 'fb-too-many-calls',
    status: 'killed',
    priority: 99,
    batchLabel: 'FirstBatch · killed',
    title: 'DO NOT BUILD — Too Many Calls FirstBatch static (old execution)',
    formType: '—',
    resolution: '—',
    dueDate: '—',
    killReason:
      'FirstBatch killed. Angle may return later as a NEW Studio Profile / safe ops card — not this old file.',
    description: 'Archived upload PNGs live in meta-upload-ready-archived-first-batch.',
    references: [],
  },
  {
    id: 'treatment-c-all',
    status: 'retired',
    priority: 99,
    batchLabel: 'Treatment C · retired',
    title: 'DO NOT BUILD — Treatment C (pain + checklist + CTA strip)',
    formType: '—',
    resolution: '—',
    dueDate: '—',
    killReason: 'CMO rejected. Replaced by Treatment E Studio Profile.',
    description: 'Rejected mocks on Real People → Rejected archive only.',
    references: ['https://medvirtual-ad-content-doc.vercel.app/real-people-creative.html#archive'],
  },
];

export function hopperByStatus(status) {
  return HOPPER_ITEMS.filter((i) => i.status === status).sort(
    (a, b) => (a.priority ?? 50) - (b.priority ?? 50),
  );
}

export function hopperCounts() {
  const counts = {};
  for (const i of HOPPER_ITEMS) {
    counts[i.status] = (counts[i.status] || 0) + 1;
  }
  return counts;
}

/** Plaintext matching Graphics Request Form field order */
export function graphicsFormPaste(item, email = GRAPHICS_REQUEST_EMAIL) {
  const refs = (item.references || []).join('\n');
  return [
    `1. TITLE OF REQUEST`,
    item.title,
    '',
    `2. EMAIL`,
    email,
    '',
    `3. TYPE OF REQUEST`,
    item.formType || 'Static Meta Ad',
    '',
    `4. GRAPHIC RESOLUTION`,
    item.resolution || HOPPER_POLICY.primaryRatio,
    '',
    `5. DESCRIPTION OF REQUEST`,
    item.description || '',
    '',
    item.onImage ? `On-image text: ${item.onImage}` : null,
    item.roleLine ? `Role line: ${item.roleLine}` : null,
    item.proofLine ? `Proof line: ${item.proofLine}` : null,
    item.metaHeadline ? `Meta headline: ${item.metaHeadline}` : null,
    item.primaryText ? `Meta primary text:\n${item.primaryText}` : null,
    item.cta ? `Meta CTA: ${item.cta}` : null,
    '',
    `Layout system: ${item.layout || HOPPER_POLICY.primaryLayout}`,
    `Brand rules: MedVirtual only; hire dedicated staff; no call-center / managed front desk language.`,
    '',
    `6. PROVIDE INSPO/REFERENCES`,
    `Paste these links and upload the local files listed:`,
    refs || '(see Real People + Brand Guide)',
    '',
    `Brief page: ${HOPPER_POLICY.briefUrl}`,
    '',
    `7. DUE DATE`,
    item.dueDate || '',
    '',
    `8. BRAND`,
    HOPPER_POLICY.brand,
  ]
    .filter((line) => line !== null)
    .join('\n');
}
