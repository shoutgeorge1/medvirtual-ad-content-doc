/**
 * Competitor creative intel — seed for the Competitor Wall.
 * Swap in real screenshots under public/assets/competitors/{id}.jpg when you grab them
 * from Meta Ad Library. Until then, cards use style fingerprints + Library links.
 *
 * Regenerate: npm run generate:competitors
 */

export const COMPETITOR_META = {
  title: 'Competitor Wall',
  intro:
    'See what others are running so we don’t copy commodity Meet-ads blindly — and so you can steal structures, reject clutter, and remix for MedVirtual.',
  howToRefresh: [
    'Open each Meta Ad Library link (US · Active).',
    'Screenshot 1–2 feed ads (1080×1350-ish is ideal).',
    'Drop as public/assets/competitors/{id}.jpg and set image: `/assets/competitors/{id}.jpg` here.',
    'Run npm run generate:competitors',
  ],
  libraryBase:
    'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all&search_type=keyword_unordered&q=',
};

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   category: 'virtual-staffing'|'practice-saas'|'telehealth'|'job-marketplace'|'other',
 *   whyWatch: string,
 *   adLibraryQuery: string,
 *   image?: string,
 *   fingerprint: { hookStyle: string, visual: string, weakness: string },
 *   steal: string,
 *   reject: string,
 *   remix: string,
 * }} CompetitorAd
 */

/** @type {CompetitorAd[]} */
export const COMPETITOR_ADS = [
  {
    id: 'hello-rache',
    name: 'Hello Rache',
    category: 'virtual-staffing',
    whyWatch: 'Closest category rival — virtual medical assistants pitched to US practices.',
    adLibraryQuery: 'Hello Rache',
    fingerprint: {
      hookStyle: 'Staffing relief · “hire VAs” language',
      visual: 'Smiling headset talent, soft clinical colors',
      weakness: 'Can feel interchangeable with every other VA ad',
    },
    steal: 'Clear role framing in one glance — title + three tasks max.',
    reject: 'Generic stock smiles with no practice-owner POV.',
    remix: 'MedVirtual Meet-[Name] with public skills + Interview CTA — human, not call-center.',
  },
  {
    id: 'time-doc',
    name: 'TimeDoc Health',
    category: 'practice-saas',
    whyWatch: 'Care-management / RPM adjacent — often more software than staffing.',
    adLibraryQuery: 'TimeDoc',
    fingerprint: {
      hookStyle: 'Outcomes / efficiency claims',
      visual: 'Dashboard + clinician UI screenshots',
      weakness: 'Heavy product UI; can feel cold for hiring messages',
    },
    steal: 'Problem → system → CTA pacing that feels premium.',
    reject: 'Tiny UI screenshots nobody can read on mobile.',
    remix: 'SaaS Prop lane — glass UI metaphor, no fake PHI, Book a Demo.',
  },
  {
    id: 'weave',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Dental/medical practice platform — strong paid social craft.',
    adLibraryQuery: 'Weave',
    fingerprint: {
      hookStyle: 'Front-desk pain · missed calls · growth',
      visual: 'Bright product moments, strong type hierarchy',
      weakness: 'Software, not hiring dedicated people',
    },
    steal: 'Tight hooks about phones / schedules without fear-mongering.',
    reject: '“We run your front desk” positioning for MedVirtual.',
    remix: 'Keep the pain in Meta primary text; on-image stays Meet + interview.',
  },
  {
    id: 'nexhealth',
    name: 'NexHealth',
    category: 'practice-saas',
    whyWatch: 'Patient experience / scheduling — polished B2B healthcare creative.',
    adLibraryQuery: 'NexHealth',
    fingerprint: {
      hookStyle: 'Modern clinic ops / patient access',
      visual: 'Clean sans, lots of whitespace, product moments',
      weakness: 'Rarely celebrates individual talent',
    },
    steal: 'Whitespace + hierarchy — don’t crowd the 4:5.',
    reject: 'Over-design that hides the offer.',
    remix: 'Borrow calm modern layout; keep MedVirtual teal + Be Vietnam.',
  },
  {
    id: 'zocdoc',
    name: 'Zocdoc',
    category: 'other',
    whyWatch: 'Consumer brand in healthcare — their paid often out-crafts staffing competitors.',
    adLibraryQuery: 'Zocdoc',
    fingerprint: {
      hookStyle: 'Simple benefit lines, high recognition',
      visual: 'Bold brand color blocks, minimal clutter',
      weakness: 'Patient marketplace — different buyer',
    },
    steal: 'Ruthless simplicity — one idea per frame.',
    reject: 'Trying to explain our whole company on the image.',
    remix: 'One proof line + Meet name + CTA — stop packing five claims.',
  },
  {
    id: 'carerev',
    name: 'CareRev',
    category: 'job-marketplace',
    whyWatch: 'Clinician marketplace — shows how staffing brands swing job-seeker vs buyer ads.',
    adLibraryQuery: 'CareRev',
    fingerprint: {
      hookStyle: 'Flexibility / shifts / earning',
      visual: 'Clinicians in scrubs, energetic crops',
      weakness: 'Often job-seeker facing — wrong for our practice owner funnel',
    },
    steal: 'Strong human photography direction.',
    reject: 'Anything that makes MedVirtual look like gig staffing.',
    remix: 'Owner POV: hire into your team — not “pick up shifts.”',
  },
  {
    id: 'patientpop',
    name: 'PatientPop / Tebra',
    category: 'practice-saas',
    whyWatch: 'Practice growth marketing stack — lots of Meta history.',
    adLibraryQuery: 'PatientPop',
    fingerprint: {
      hookStyle: 'Grow your practice / get found',
      visual: 'Marketing montage, office exteriors',
      weakness: 'Growth-agency energy vs dedicated staff hire',
    },
    steal: 'Aspirational “practice leveling up” emotion.',
    reject: 'Agency collage fluff with no single subject.',
    remix: 'One talent + one role = the upgrade story.',
  },
  {
    id: 'generic-va-commodity',
    name: 'Generic “Hire VAs” cluster',
    category: 'virtual-staffing',
    whyWatch: 'The cul-de-sac — endless identical teal headset ads drowning the category.',
    adLibraryQuery: 'virtual medical assistant',
    fingerprint: {
      hookStyle: 'Cheap / fast / 24-7 staffing spam',
      visual: 'Same headset crop everywhere',
      weakness: 'Zero differentiation — this is why we need Ideas Lab',
    },
    steal: 'Nothing. Study it so you know what to avoid.',
    reject: 'Copying the commodity look because it’s “safe.”',
    remix: 'Ideas Lab: motion, VO, human shoots, SaaS Prop — break the pattern.',
  },
];

export const WEEKLY_FORK_PROMPTS = [
  {
    id: 'fork-carmen',
    talent: 'Carmen',
    size: '1080×1350',
    lookbook: 'Meet Carmen · Medical Biller · Lookbook-faithful',
    experiment: 'Bold type · fewer checks · bigger face crop',
    saas: 'No face — glass dashboard metaphor + “Billing work piling up?”',
  },
  {
    id: 'fork-jessica-story',
    talent: 'Jessica',
    size: '1080×1920',
    lookbook: 'Stories resize of Jessica feed ad',
    experiment: 'Full-bleed motion poster frame for Remotion STATIC_TO_SHORT',
    saas: 'Tall software UI with three pulsing checklist ticks',
  },
];

export function adLibraryUrl(query) {
  return COMPETITOR_META.libraryBase + encodeURIComponent(query);
}
