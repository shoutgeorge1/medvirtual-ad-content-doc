/**
 * Approved Virtual Medical Admin creative baselines — single source of truth.
 * Used by Dashboard, Approved Creative, Static Ads, Video, and Production Handoff.
 *
 * Do not invent image files. Missing formats stay Awaiting Design.
 */

export const MASTER_STATUS = 'APPROVED CREATIVE BASELINE';

export const MASTER_NOTE =
  'These four concepts establish the approved MedVirtual direct-response direction. Future ads should stay close to this level of clarity, contrast, hierarchy, and mobile readability without copying another buyer’s layouts.';

export const COLOR_DIRECTION = {
  summary:
    'MedVirtual teal and deep blue remain useful grounding colors. Scrubs, badges, highlights, price elements, benefit blocks, and supporting shapes may use bright accents. Do not force every ad into teal — and do not abandon MedVirtual for random neon.',
  grounding: ['#077999 MedVirtual teal', '#0D546B deep teal', '#0B1F3A deep navy'],
  accents: [
    'Lime / vivid green',
    'Signal yellow',
    'Cobalt blue',
    'Cyan',
    'White',
    'Limited commercial red',
  ],
  forbidden: ['Pink', 'Magenta', 'Rose', 'Fuchsia'],
  rules: [
    'Use teal or deep navy as a grounding color when it improves brand recognition.',
    'Let talent wardrobe and offer elements provide the stronger color test.',
    'Never use pink, magenta, rose, or fuchsia.',
    'The system should feel like MedVirtual direct-response advertising — not unrelated neon ads.',
  ],
};

export const FORMAT_SPECS = [
  {
    id: '1x1',
    label: '1:1',
    ratio: '1:1',
    width: 1080,
    height: 1080,
    dims: '1080×1080',
    placement: 'Feed / profile',
    layoutNote: 'Baseline square — preserve full hierarchy.',
  },
  {
    id: '4x5',
    label: '4:5',
    ratio: '4:5',
    width: 1080,
    height: 1350,
    dims: '1080×1350',
    placement: 'Feed',
    layoutNote: 'Rebuild for taller canvas — do not stretch.',
  },
  {
    id: '9x16',
    label: '9:16',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    dims: '1080×1920',
    placement: 'Stories / Reels',
    layoutNote: 'Stack for safe zones — keep face and price clear.',
  },
  {
    id: '1.91x1',
    label: '1.91:1',
    ratio: '1.91:1',
    width: 1200,
    height: 628,
    dims: '1200×628',
    placement: 'Link / landscape',
    layoutNote: 'Compress vertically — prioritize headline + talent + price.',
  },
];

const MASTER_DIR = '/exports/vma-masters';

/**
 * @param {string} stem e.g. MV_VMA_01_SpanishGreen
 * @param {string} formatId
 */
function formatPath(stem, formatId) {
  return `${MASTER_DIR}/${stem}_${formatId}.png`;
}

/**
 * @typedef {{
 *   id: string,
 *   number: string,
 *   name: string,
 *   stem: string,
 *   headline: string,
 *   colorFamily: string,
 *   accentHex: string,
 *   languageOrTrust: string,
 *   claim: string,
 *   visualDescription: string,
 *   productionNote: string,
 *   status: string,
 *   masterImage: string,
 *   formats: Array<{
 *     formatId: string,
 *     label: string,
 *     dims: string,
 *     placement: string,
 *     layoutNote: string,
 *     expectedFilename: string,
 *     path: string|null,
 *     status: 'Approved'|'Awaiting Design',
 *   }>,
 * }} ApprovedMaster
 */

/** @type {ApprovedMaster[]} */
export const APPROVED_MASTERS = [
  {
    id: 'vma-01',
    number: '01',
    name: 'Spanish Green',
    stem: 'MV_VMA_01_SpanishGreen',
    headline: 'Hire a Virtual Medical Admin',
    colorFamily: 'Lime green · cyan · black',
    accentHex: '#B8F000',
    languageOrTrust: 'Spanish Speaking Available · Mexican flag badge',
    claim: 'Starting at $10/hour',
    visualDescription:
      'Green-scrub talent with headset; stacked Hire a Virtual Medical Admin; Spanish badge; cyan price card; 2×2 benefit grid.',
    productionNote: 'Spanish / flag treatment only on this concept. Preserve badge and benefit labels exactly.',
    status: MASTER_STATUS,
    masterImage: `${MASTER_DIR}/MV_VMA_01_SpanishGreen_SOURCE_1x1.png`,
    formats: [],
  },
  {
    id: 'vma-02',
    number: '02',
    name: 'Cobalt Blue',
    stem: 'MV_VMA_02_CobaltBlue',
    headline: 'Hire a Virtual Medical Admin',
    colorFamily: 'Cobalt blue · black · cyan',
    accentHex: '#1D4ED8',
    languageOrTrust: 'English · task support line',
    claim: 'Starting at $10/hour',
    visualDescription:
      'Diagonal split; cobalt benefit stack (Patient Calls, Scheduling, Insurance Verification, Billing Support); sloping price badge.',
    productionNote: 'Produce first in the resize order. Keep vertical benefit cards and diagonal composition.',
    status: MASTER_STATUS,
    masterImage: `${MASTER_DIR}/MV_VMA_02_CobaltBlue_SOURCE_1x1.png`,
    formats: [],
  },
  {
    id: 'vma-03',
    number: '03',
    name: 'Signal Yellow',
    stem: 'MV_VMA_03_SignalYellow',
    headline: 'Hire a Virtual Medical Admin',
    colorFamily: 'Signal yellow · navy · white',
    accentHex: '#FFE600',
    languageOrTrust: 'English · “front office” highlight',
    claim: 'Starting at $10/hour',
    visualDescription:
      'Navy plate; yellow circle price; “front office” yellow emphasis; stacked benefit rows; yellow scrub talent with tablet.',
    productionNote: 'Second in resize order. Keep navy grounding and yellow offer/wardrobe contrast.',
    status: MASTER_STATUS,
    masterImage: `${MASTER_DIR}/MV_VMA_03_SignalYellow_SOURCE_1x1.png`,
    formats: [],
  },
  {
    id: 'vma-04',
    number: '04',
    name: 'HIPAA Green',
    stem: 'MV_VMA_04_HIPAAGreen',
    headline: 'Hire a Virtual Medical Admin',
    colorFamily: 'Lime green · black · white',
    accentHex: '#B8F000',
    languageOrTrust: 'HIPAA Compliant badge · English',
    claim: 'Starting at $10/hour',
    visualDescription:
      'HIPAA Compliant shield badge; white benefit cards; circular black/green price; lime scrub talent.',
    productionNote: 'HIPAA badge only on this concept. Keep white benefit cards and circular price treatment.',
    status: MASTER_STATUS,
    masterImage: `${MASTER_DIR}/MV_VMA_04_HIPAAGreen_SOURCE_1x1.png`,
    formats: [],
  },
].map((master) => {
  const formats = FORMAT_SPECS.map((spec) => {
    const expectedFilename = `${master.stem}_${spec.id}.png`;
    const isSquare = spec.id === '1x1';
    return {
      formatId: spec.id,
      label: spec.label,
      dims: spec.dims,
      placement: spec.placement,
      layoutNote: spec.layoutNote,
      expectedFilename,
      // Approved square masters use the SOURCE filenames shared with graphics.
      path: isSquare ? master.masterImage : null,
      status: isSquare ? 'Approved' : 'Awaiting Design',
    };
  });
  return { ...master, formats };
});

/** Preferred build order for the graphics request (VA-facing). */
export const GRAPHICS_BUILD_ORDER = ['02', '03', '01', '04'];

export const GRAPHICS_DO = [
  'Create 4 concepts × 4 sizes = 16 final PNGs',
  'Rebuild the layout for each canvas size (do not only crop or stretch)',
  'Keep the same headline, talent style, benefits, colors, badges, and price treatment from the approved master',
  'Keep faces, headlines, benefit boxes, and offer badges inside safe zones',
  'Deliver final PNGs + editable source files (PSD / AI / Figma)',
  'Use brand: MedVirtual only (never MedVirtual.ai)',
];

export const GRAPHICS_DONT = [
  'Do not redesign from scratch or regenerate new ChatGPT ads for this request',
  'Do not use pink, magenta, rose, or fuchsia',
  'Do not simply paste the square ad onto a taller or wider canvas',
  'Do not copy competitor layouts, typography, badge shapes, or composition',
  'Spanish Speaking badge / flag — Concept 01 only',
  'HIPAA Compliant badge — Concept 04 only',
  'Do not invent new claims or rewrite approved on-image copy',
  'Do not start video work until static sizes are done',
];

export const VIDEO_OUTPUTS_PER_MASTER = [
  { id: '6s', label: '6-second motion ad', purpose: 'Hook + offer flash + CTA' },
  { id: '10s', label: '10-second benefit ad', purpose: 'Headline → 3–4 benefits → price/CTA' },
  { id: '15s', label: '15-second problem-to-solution ad', purpose: 'Pain → Virtual Admin → benefits → offer' },
];

export const VIDEO_STORYBOARD = [
  { scene: 'SCENE 1 — HOOK', timing: '0–2s', note: 'Huge headline + face' },
  { scene: 'SCENE 2 — PAIN OR TASK', timing: '2–5s', note: 'Missed calls / front-office overload' },
  { scene: 'SCENE 3 — VIRTUAL ADMIN SOLUTION', timing: '5–8s', note: 'Talent + role clarity' },
  { scene: 'SCENE 4 — BENEFITS', timing: '8–12s', note: 'Stagger approved benefit lines' },
  { scene: 'SCENE 5 — OFFER AND CTA', timing: '12–15s', note: 'Price or trust badge + Learn More' },
];

export const WHAT_WE_NEED_NOW = [
  'Rebuild all four masters in 1:1',
  'Rebuild all four masters in 4:5',
  'Rebuild all four masters in 9:16',
  'Rebuild all four masters in 1.91:1',
  'Create animated versions after static QA',
  'Preserve approved copy and hierarchy',
  'Do not use pink',
  'Do not simply stretch or crop',
];

export const DIRECTION_BULLETS = [
  'Huge, readable headline',
  'Professional virtual medical administrator',
  'Three or four service benefits',
  'Visible offer, price, language, or trust treatment',
  'Strong contrast',
  'Mobile readability',
  'Clear role',
  'Clear CTA',
  'No vague SaaS language',
  'No pink',
];

export const DASHBOARD_CLAIMS = [
  { id: 'price-10hr', label: 'Starting at $10/hour', status: 'Pending' },
  { id: 'hipaa', label: 'HIPAA compliant', status: 'Pending' },
  { id: 'spanish-available', label: 'Spanish-speaking staff available', status: 'Pending' },
];

export const QUEUE_SUMMARY = [
  { label: 'Static variants needed', value: '12', note: '4 concepts × 3 missing sizes' },
  { label: 'Animated variants needed', value: '12', note: '4 concepts × 3 lengths' },
  { label: 'Awaiting design', value: '12', note: 'Static format rebuilds' },
  { label: 'Awaiting review', value: '0', note: 'None ready yet' },
  { label: 'Approved', value: '4', note: '1:1 baselines' },
  { label: 'Delivered', value: '0', note: 'None delivered yet' },
];

export const HANDOFF_QA = [
  'Correct headline',
  'Correct benefits',
  'Correct price',
  'Correct badge',
  'Correct logo',
  'No pink',
  'Mobile readable',
  'Face not cropped',
  'Correct dimensions',
  'Source file delivered',
];

export const CURRENT_META_FORM = {
  name: 'Current Meta Instant Form',
  introHeadline: 'Stop the Front-Office Chaos',
  introDescription:
    'Stop the overload. Add a Virtual Medical Admin for calls, scheduling, insurance, intake, and billing.',
  routingQuestion: 'What brings you to MedVirtual?',
  routingAnswers: ['I’m looking to hire virtual staff', 'I’m looking for a job'],
  requiredFields: ['First Name', 'Last Name', 'Email', 'Mobile Phone'],
  privacyMessage: 'We’ll use your info to discuss staffing and schedule your demo.',
  endHeadline: 'Stop the Front-Office Chaos',
  endDescription:
    'Missed calls, scheduling, insurance, billing—get the help your practice needs. Book your demo today.',
  demoCta: 'Book Your Demo Now',
  demoLink: 'https://meetings.hubspot.com/call-scheduling/mv-meta-imb',
  jobSeekerLink: 'https://apply.workable.com/berryvirtual/?lng=en',
  lastTested: 'Documented July 2026 — confirm live Ads Manager match before edits',
};

export const FEATURED_COMPETITOR_IDS = [
  'hello-rache',
  'generic-va-commodity',
  'quadrant-health',
  'weave',
  'medva',
  'virtual-latinos',
  'my-mountain-mover',
  'nexhealth',
];

/** Pink / magenta competitor looks — reference only. */
export const PINK_REFERENCE_COMPETITOR_IDS = new Set(['hello-rache']);

export const HISTORY_NOTES = [
  {
    date: '2026-07-14',
    title: 'Approved creative baselines locked',
    change:
      'Four Virtual Medical Admin masters (Spanish Green, Cobalt Blue, Signal Yellow, HIPAA Green) became the visual center of the content doc.',
  },
  {
    date: '2026-07-14',
    title: 'Previous primary directions removed from active site',
    change:
      'Real People / Talent Pool, Role-Offer, and teal SaaS / no-people were removed from the primary workflow and archived.',
  },
];

export function getMasterById(id) {
  return APPROVED_MASTERS.find((m) => m.id === id) ?? null;
}

export function formatMatrixCells() {
  return APPROVED_MASTERS.map((m) => ({
    master: m,
    cells: m.formats.map((f) => ({
      ...f,
      displayStatus: f.status === 'Approved' ? 'Approved' : 'Awaiting Design',
    })),
  }));
}

export function presentFormatsSummary(master) {
  const approved = master.formats.filter((f) => f.status === 'Approved').map((f) => f.label);
  const awaiting = master.formats.filter((f) => f.status !== 'Approved').map((f) => f.label);
  return {
    approved: approved.length ? approved.join(', ') : 'None',
    awaiting: awaiting.length ? awaiting.join(', ') : 'None',
    availableLabel: approved.length ? approved.join(' · ') : 'None yet',
  };
}
