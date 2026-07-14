/**
 * Competitor Wall seed + rules.
 *
 * The rendered wall prefers live Ad Library stills from
 * public/assets/competitors/live-snapshots.json — only creatives with
 * real image files on disk are shown. Empty / research-only cards stay off the wall.
 *
 * Regenerate primary wall: npm run generate:vma
 * Refresh live stills periodically: npm run generate:competitor-snaps (or the refresh agent)
 */

export const COMPETITOR_META = {
  title: 'Competitor Wall',
  intro:
    'Study medical VA and virtual staffing Meta creatives — hierarchy, offer clarity, and mobile readability. Do not copy layouts, color systems, badges, typography, or talent.',
  howToRefresh: [
    'Wall shows every verified screenshot we have — more is better.',
    'No image = not on the wall. Capture a new Ad Library still, then regenerate.',
    'Refresh live scrapes from time to time so new VA creatives show up.',
    'Spotted a useful medical VA ad? Email george.a@legalsoft.com.',
  ],
  libraryBase:
    'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&media_type=all&search_type=keyword_unordered&q=',
};

/**
 * Live snapshot source keys allowed onto the wall.
 * Skip off-category / wrong scrapes (pet meds, consumer derm, shoe ads).
 */
export const WALL_LIVE_SOURCE_IDS = [
  'hello-rache',
  'generic-va-commodity',
  'weave',
];

/** Extra static creatives with verified on-disk images (not wrong scrapes). */
export const WALL_STATIC_CREATIVES = [
  {
    id: 'quadrant-health-ai-receptionist',
    name: 'Quadrant Health',
    category: 'practice-saas',
    whyWatch: 'AI receptionist / missed-inquiry claims — adjacent front-desk pain, not staffing.',
    adLibraryQuery: 'Quadrant Health',
    image: '/assets/competitors/commure-scribe.jpg',
    fingerprint: {
      hookStyle: '1 AI agent = 10 receptionists · hours saved stats',
      visual: 'White + blue claim cards + EHR logos',
      weakness: 'AI automation — opposite of dedicated human staff',
    },
    steal: 'Front-desk failure modes and stats read fast.',
    reject: 'AI-agent replacement positioning for MedVirtual.',
    remix: 'Same pain → dedicated Virtual Medical Admin human.',
  },
  {
    id: 'hello-rache-hero',
    name: 'Hello Rache',
    category: 'virtual-staffing',
    whyWatch: 'Medical VA comparison creative — closest category neighbor.',
    adLibraryQuery: 'Hello Rache',
    image: '/assets/competitors/hello-rache.jpg',
    fingerprint: {
      hookStyle: 'Not all medical VAs are equal',
      visual: 'Purple comparison layout · clinical talent',
      weakness: 'Purple / pink-leaning system — reference only',
    },
    steal: 'Clear medical VA vs generic VA framing.',
    reject: 'Purple / pink palette or copy-cat comparison layout.',
    remix: 'MedVirtual bold VMA hire message — no pink.',
  },
  {
    id: 'weave-schedule-hero',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Front-desk / scheduling pain — software, not a dedicated hire.',
    adLibraryQuery: 'Weave',
    image: '/assets/competitors/weave.jpg',
    fingerprint: {
      hookStyle: 'Schedule appointments 24/7',
      visual: 'Phone UI + one clear benefit',
      weakness: 'Software product',
    },
    steal: 'One pain, one benefit, high mobile clarity.',
    reject: '“We run your front desk” language for MedVirtual.',
    remix: 'Pain in copy; on-image stays Hire a Virtual Medical Admin.',
  },
];

/**
 * Known bad / off-category image paths — never show these.
 * (Wrong Ad Library matches: shoes, pet meds, etc.)
 */
export const BLOCKED_COMPETITOR_IMAGES = new Set([
  '/assets/competitors/quadrant-health.jpg',
  '/assets/competitors/live/quadrant-health-1.jpg',
  '/assets/competitors/nexhealth.jpg',
  '/assets/competitors/live/nexhealth-1.jpg',
  '/assets/competitors/zocdoc.jpg',
  '/assets/competitors/live/zocdoc-1.jpg',
  '/assets/competitors/live/zocdoc-2.jpg',
  '/assets/competitors/live/zocdoc-3.jpg',
  '/assets/competitors/live/zocdoc-4.jpg',
]);

/**
 * Seed records kept for Ad Library links / other tools.
 * The wall itself is built from live snapshots + WALL_STATIC_CREATIVES.
 */
/** @type {Array<Record<string, unknown>>} */
export const COMPETITOR_ADS = [
  {
    id: 'hello-rache',
    name: 'Hello Rache',
    category: 'virtual-staffing',
    whyWatch: 'Closest category neighbor — medical virtual assistants.',
    adLibraryQuery: 'Hello Rache',
    image: '/assets/competitors/hello-rache.jpg',
    fingerprint: {
      hookStyle: 'Medical VA comparison · price transparency',
      visual: 'Purple brand · clinical talent',
      weakness: 'Purple / pink-leaning — reference only',
    },
    steal: 'Clear role framing in one glance.',
    reject: 'Purple / pink palette or exact badge shapes.',
    remix: 'Original MedVirtual VMA layout — no pink.',
  },
  {
    id: 'generic-va-commodity',
    name: 'Medical VA commodity ads',
    category: 'virtual-staffing',
    whyWatch: 'Crowded medical VA / receptionist hiring ads.',
    adLibraryQuery: 'hire a medical virtual assistant',
    adLibraryQueries: [
      'hire a medical virtual assistant',
      'medical virtual assistant',
      'hire medical VA',
      'healthcare virtual assistant',
      'virtual medical receptionist',
    ],
    image: '/assets/competitors/live/generic-va-1.jpg',
    fingerprint: {
      hookStyle: 'Price / trained VA / front-desk staffing',
      visual: 'Mixed commodity VA plates',
      weakness: 'Easy to blend into the pack',
    },
    steal: 'Simple role + price + human face can stop the scroll.',
    reject: 'Blending into cheap-VA commodity look.',
    remix: 'Bold MedVirtual masters with clearer hierarchy.',
  },
  {
    id: 'weave',
    name: 'Weave',
    category: 'practice-saas',
    whyWatch: 'Front-desk missed-call / scheduling pain.',
    adLibraryQuery: 'Weave',
    image: '/assets/competitors/weave.jpg',
    fingerprint: {
      hookStyle: 'Missed calls · scheduling',
      visual: 'Bright product moments',
      weakness: 'Software, not staffing',
    },
    steal: 'Tight front-office hooks.',
    reject: 'Managed front-desk positioning.',
    remix: 'Human VMA hire answer.',
  },
];

export const FEATURED_COMPETITOR_IDS = COMPETITOR_ADS.map((a) => a.id);

/** @deprecated empty research wall — no image = not shown */
export const RESEARCH_COMPETITOR_IDS = [];

export const PINK_REFERENCE_COMPETITOR_IDS = new Set(['hello-rache']);

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
