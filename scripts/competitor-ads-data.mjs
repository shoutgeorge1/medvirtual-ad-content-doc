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
    'Real Meta Ad Library creatives — the actual frames competitors are running, plus their hooks and copy. Browse, get inspired, mock a MedVirtual take, pitch George. No fake placeholders.',
  howToRefresh: [
    'An automated Cursor agent refreshes this wall every couple of weeks from Meta Ad Library.',
    'We only publish brands when we have real creative stills + primary text / headline / description.',
    'Your job: skim the ads, steal the energy (not the look), mock something cooler for MedVirtual, pitch George.',
    'Spotted a wild new competitor running ads? Email george.a@legalsoft.com and we’ll pull them in.',
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
    adLibraryQuery: 'TimeDoc Health',
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
    id: 'commure-scribe',
    name: 'Commure Scribe',
    category: 'practice-saas',
    whyWatch: 'AI scribe competitor adjacent to “virtual help in the exam room” — live Meta ads right now.',
    adLibraryQuery: 'Commure Scribe',
    image: '/assets/competitors/commure-scribe.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
    fingerprint: {
      hookStyle: 'EHR integration · one-click notes · free trial',
      visual: 'Product / software simplicity',
      weakness: 'Software, not a dedicated teammate',
    },
    steal: 'Crystal-clear product promise in one line.',
    reject: 'Sounding like another AI tool, not MedVirtual humans.',
    remix: 'Meet-[Name] who works the note + patient flow — Interview CTA.',
  },
  {
    id: 'quadrant-health',
    name: 'Quadrant Health',
    category: 'practice-saas',
    whyWatch: 'Front-desk / phone pain — live Meta ads competing for practice-owner attention.',
    adLibraryQuery: 'Quadrant Health',
    image: '/assets/competitors/quadrant-health.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
    fingerprint: {
      hookStyle: 'Missed calls · temp turnover · revenue jump',
      visual: 'Problem list → solution narrative',
      weakness: 'Can read as fear-heavy ops tooling',
    },
    steal: 'Named failed alternatives (“call center”, “temp receptionist”).',
    reject: 'Doom-scroll scare tactics for MedVirtual talent ads.',
    remix: 'Same pain, human hire answer — Meet front-desk / admin talent.',
  },
  {
    id: 'weave',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Dental/medical practice platform — strong paid social craft.',
    adLibraryQuery: 'Weave',
    image: '/assets/competitors/weave.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
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
    image: '/assets/competitors/nexhealth.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
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
    image: '/assets/competitors/zocdoc.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
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
    adLibraryQuery: 'hire a medical virtual assistant',
    /** Extra keyword variants for Ad Library refresh (generic VA cluster). */
    adLibraryQueries: [
      'hire a medical virtual assistant',
      'medical virtual assistant',
      'hire medical VA',
      'healthcare virtual assistant',
      'virtual medical receptionist',
      'hire a virtual medical assistant',
    ],
    image: '/assets/competitors/generic-va-commodity.jpg',
    snapshotNote: 'Live Meta Ad Library creative',
    fingerprint: {
      hookStyle: 'Cheap / fast / 24-7 staffing spam',
      visual: 'Same headset crop everywhere',
      weakness: 'Hard to tell brands apart — perfect invitation to invent',
    },
    steal: 'Nothing required — use it as fuel to go different.',
    reject: 'Blending in with the pack just because it’s familiar.',
    remix: 'Ideas Lab: VMA static + animated video — bold medical admin offers, not commodity VA spam.',
  },
  {
    id: 'medva',
    name: 'MedVA',
    category: 'virtual-staffing',
    whyWatch: 'Medical virtual assistant competitor — Research Needed for live Meta creative pack.',
    adLibraryQuery: 'MedVA',
    fingerprint: {
      hookStyle: 'Research Needed',
      visual: 'Research Needed',
      weakness: 'Research Needed',
    },
    steal: 'Research Needed — capture Ad Library before adapting.',
    reject: 'Do not invent competitor claims.',
    remix: 'MedVirtual VMA hire offer with dedicated-staff truth.',
  },
  {
    id: 'my-mountain-mover',
    name: 'My Mountain Mover',
    category: 'virtual-staffing',
    whyWatch: 'Healthcare VA staffing — Research Needed for current Meta creatives.',
    adLibraryQuery: 'My Mountain Mover',
    fingerprint: {
      hookStyle: 'Research Needed',
      visual: 'Research Needed',
      weakness: 'Research Needed',
    },
    steal: 'Research Needed',
    reject: 'Do not copy trade dress or unverified offers.',
    remix: 'Original MedVirtual VMA static + 15s motion.',
  },
  {
    id: 'virtual-latinos',
    name: 'Virtual Latinos',
    category: 'virtual-staffing',
    whyWatch: 'Spanish / bilingual virtual staffing benchmark — Research Needed.',
    adLibraryQuery: 'Virtual Latinos',
    fingerprint: {
      hookStyle: 'Research Needed — bilingual positioning',
      visual: 'Research Needed',
      weakness: 'Research Needed',
    },
    steal: 'Research Needed',
    reject: 'Do not imply nationality of MedVirtual staff.',
    remix: 'Spanish / Se Habla Español VMA treatments — original layouts, no pink.',
  },
];

export const WEEKLY_FORK_PROMPTS = [
  {
    id: 'fork-vma-lime',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Hire a Virtual Medical Admin · Electric Lime color test',
    experiment: 'Giant headline · 4 benefit blocks · price badge pending',
    saas: 'N/A — SaaS direction removed July 2026',
  },
  {
    id: 'fork-missed-calls',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Too Many Patient Calls? · Signal Yellow',
    experiment: 'Pain-first hook · same benefit stack · no pink',
    saas: 'N/A — SaaS direction removed July 2026',
  },
  {
    id: 'fork-spanish',
    talent: 'Generic VMA talent',
    size: '1080×1350',
    lookbook: 'Contrata a un Asistente Médico Virtual',
    experiment: 'Full Spanish · Se Habla badge option · no nationality assumption',
    saas: 'N/A — SaaS direction removed July 2026',
  },
];

export function adLibraryUrl(query) {
  return COMPETITOR_META.libraryBase + encodeURIComponent(query);
}
