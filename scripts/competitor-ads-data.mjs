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
    'Hey — peek at what’s running out there, get inspired, then mock your own MedVirtual take and pitch it to George. Cool ideas welcome.',
  howToRefresh: [
    'Open a Meta Ad Library link below.',
    'Screenshot a feed ad you like (or don’t like!).',
    'Drop it as public/assets/competitors/{id}.jpg — or just email George the shot + your mock.',
    'Run npm run generate:competitors so everyone sees the new snapshot.',
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
    whyWatch: 'Closest category neighbor — virtual medical help pitched to US practices.',
    adLibraryQuery: 'Hello Rache',
    image: '/assets/competitors/hello-rache.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
    fingerprint: {
      hookStyle: 'Staffing relief · leave-on-time / scribe framing',
      visual: 'Clinical talent, purple brand, conversational hooks',
      weakness: 'Can blur into other VA brands if we copy too closely',
    },
    steal: 'Clear role framing in one glance — title + a simple patient story.',
    reject: 'Generic stock smiles with no practice-owner POV.',
    remix: 'MedVirtual Meet-[Name] with public skills + Interview CTA — human and distinct.',
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
    whyWatch: 'A crowded “hire VAs” look we can happily do better than — lots of room for fresh MedVirtual ideas.',
    adLibraryQuery: 'virtual medical assistant',
    fingerprint: {
      hookStyle: 'Cheap / fast / 24-7 staffing spam',
      visual: 'Same headset crop everywhere',
      weakness: 'Hard to tell brands apart — perfect invitation to invent',
    },
    steal: 'Nothing required — use it as fuel to go different.',
    reject: 'Blending in with the pack just because it’s familiar.',
    remix: 'Ideas Lab: Veo, motion, human shoots, SaaS Prop — have fun standing out.',
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
