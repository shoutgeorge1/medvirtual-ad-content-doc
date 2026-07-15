/**
 * Production library — winning green-person direction + human handoff metadata.
 * Library first. Production brief second. Lightweight preview third. Editing software never.
 */
import { FORMAT_SPECS } from './vma-approved-masters.mjs';

export const WINNING_MASTER = '01';
export const VARIATION_MASTERS = ['04'];
export const PAUSED_MASTERS = ['02', '03'];

export const WINNING_NOTE =
  'VMA-01 Spanish Green (lime-scrub admin) is the current winning direction. Static images are producing leads more efficiently than longer custom video concepts. New static and motion work should stay visually close to this — do not invent unrelated directions.';

export const PRODUCTION_STATUS = {
  '01': { label: 'Winning Direction', tone: 'win' },
  '04': { label: 'Approved Variation', tone: 'ok' },
  '02': { label: 'Paused', tone: 'pause' },
  '03': { label: 'Paused', tone: 'pause' },
};

export const TYPOGRAPHY = {
  family: 'Be Vietnam Pro',
  headline: {
    weight: 900,
    case: 'ALL CAPS',
    letterSpacing: '-0.03em',
    lineHeight: '0.94–0.98',
    accentLine: 'Line 2 — VIRTUAL — uses concept accent color',
    mobile: 'Headline must read in under 2 seconds on a phone — scale up, never shrink below legibility',
  },
  subhead: { weight: 600, size: '≈30–34px at 4:5 reference' },
  benefits: { weight: 700, size: '≈26–28px at 4:5 reference' },
  badge: { weight: 800, size: 'Offer / trust badges — high contrast, never pink' },
};

export const LOGO_ASSETS = [
  { label: 'Logo · white SVG', href: '/assets/brand/medvirtual/logo-white.svg', format: 'SVG' },
  { label: 'Logo · color SVG', href: '/assets/brand/medvirtual/logo-colored.svg', format: 'SVG' },
  { label: 'Logomark · white SVG', href: '/assets/brand/medvirtual/logomark-white.svg', format: 'SVG' },
  { label: 'Logomark · color SVG', href: '/assets/brand/medvirtual/logomark-colored.svg', format: 'SVG' },
];

export const PERSON_ASSETS = {
  transparent: '/assets/video-elements/people/admin-lime.png',
  referenceCrop: '/assets/graphics-kit/person-01.png',
  scrubColor: '#B8F000',
  dimensions: 'High-res PNG · transparent background',
  rules: [
    'No text, badges, backgrounds, or logos baked into the person file',
    'Recolor scrubs only — preserve natural skin tones',
    'Reposition and scale per ratio — never stretch',
  ],
};

export const BACKGROUND_SPEC = {
  type: 'gradient',
  css: 'linear-gradient(135deg, #0a1628 0%, #0d2840 100%)',
  hex: ['#0a1628', '#0d2840'],
  note: 'Rebuild as a separate layer behind the person. Match approved static energy — deep navy/teal, not flat black.',
};

export const ICON_ELEMENTS = [
  { id: 'check', label: 'Checkmark (benefit chips)', type: 'svg-inline', note: 'Simple line check — current color from concept palette' },
  { id: 'phone', label: 'Phone', type: 'request', note: 'Use simple line icon if needed in variations — not on approved master' },
  { id: 'calendar', label: 'Calendar', type: 'request', note: 'Optional for scheduling-angle variations' },
  { id: 'insurance', label: 'Insurance', type: 'request', note: 'Optional for benefit-card variations' },
  { id: 'billing', label: 'Billing', type: 'request', note: 'Optional for benefit-card variations' },
];

export const COPY_LOCKED = {
  headline: { lines: ['HIRE A', 'VIRTUAL', 'MEDICAL', 'ADMIN'], locked: true, accentLine: 1 },
  subhead: { text: 'Reception · insurance · preauth · billing — Spanish available', locked: true },
  benefits: {
    items: [
      'Reception & Admin Support',
      'Insurance Verification',
      'Preauthorization Support',
      'Medical Billing Support',
    ],
    locked: true,
  },
  offer: { text: 'Starting at $10/hour', locked: 'pending-claim', note: 'Pending leadership approval — use only as shown on approved master' },
  trust: { text: 'Spanish Speaking Available', locked: true, note: 'Concept 01 only — flag/badge treatment' },
  brand: { text: 'MedVirtual', locked: true, forbid: 'MedVirtual.ai' },
};

export const DELIVERABLES_STATIC = FORMAT_SPECS.map((f) => ({
  ratio: f.label,
  dims: f.dims,
  filename: `MV_VMA_01_SpanishGreen_${f.id}.png`,
  required: f.id !== '1x1' || true,
}));

export const DELIVERABLES_MOTION = [
  {
    id: '6s-4x5',
    label: '6-second motion · 4:5',
    dims: '1080×1350',
    duration: '6s',
    fps: 30,
    format: 'MP4 H.264',
    filename: 'MV_VMA_01_SpanishGreen_6s_4x5.mp4',
    sound: 'Works with sound off — captions optional',
    firstFrame: 'Must read as a strong static ad',
  },
  {
    id: '8s-9x16',
    label: '8-second motion · 9:16',
    dims: '1080×1920',
    duration: '8s',
    fps: 30,
    format: 'MP4 H.264',
    filename: 'MV_VMA_01_SpanishGreen_8s_9x16.mp4',
    sound: 'Sound-off first — subtle bed only if licensed',
    firstFrame: 'Headline + person visible in frame 1',
  },
];

export const GREEN_MOTION_BRIEF = {
  principle: 'Make the winning static move — not a new TV commercial.',
  duration: '6–10 seconds · test 6s first',
  opening: 'Approved static composition visible from frame 0 — no logo-only or slow cinematic intro',
  sequence: [
    { time: '0.0–0.5s', action: 'Full static composition already on screen' },
    { time: '0.2–1.0s', action: 'Subtle person movement, crop push, or light parallax' },
    { time: '0.3–1.2s', action: 'Headline resolves immediately (no long type animation)' },
    { time: '1.0–3.0s', action: 'Benefit cards enter one at a time' },
    { time: '3.0–5.5s', action: 'Complete offer remains readable' },
    { time: 'Final 1–2s', action: 'Price / CTA subtle emphasis · loop cleanly' },
  ],
  motionAllowed: [
    'Slight push-in',
    'Controlled parallax',
    'Headline reveal',
    'Benefit-card stagger',
    'Badge emphasis',
    'Soft background movement',
    'Small glow changes',
  ],
  motionAvoid: [
    'Logo-only openings',
    'Slow cinematic setup',
    'Waiting several seconds for the main idea',
    'Animating everything just because it can move',
  ],
  independentLayers: ['person', 'headline', 'benefit cards', 'offer badge', 'CTA', 'background', 'logo'],
  export: ['MP4 H.264', '30fps', 'Editable AE / CapCut / Premiere source', 'First frame = strong static'],
};

export const MONDAY_REQUEST = {
  formUrl: 'https://forms.monday.com/forms/d03f1925ccfafd8f54a39d90a0e277d4?r=use1',
  fields: {
    brand: 'MedVirtual',
    type: 'Ad Graphics',
    title: 'VMA-01 Green Person — [ratio or variation name]',
    description: `CURRENT WINNING DIRECTION ONLY — VMA-01 Spanish Green (lime-scrub admin).

Kill/pause all other concepts (Cobalt, Signal Yellow, unrelated experiments).

Production library: [site]/graphics-kit.html#01-4x5

Deliver:
• Static PNG at exact Meta dimensions (rebuild layout — do not stretch square)
• Transparent person from library + separate background + copy layers
• Editable PSD/AI/Figma source
• 6s motion MP4 where requested (make the static move — see Animated Video brief)

Reference: approved 1:1 master + AI drafts on Component Library page.`,
    resolution: 'Pick preset OR enter custom px from brief',
    dueDate: 'Per sprint assignment',
    references: 'Link to graphics-kit.html + attach approved master screenshot',
  },
};

export const CONCEPT_VARIATIONS = [
  {
    id: 'var-core',
    name: 'Core winner',
    master: '01',
    status: 'Winning Direction',
    note: 'Approved 1:1 live reference — all new work matches this',
  },
  {
    id: 'var-hipaa',
    name: 'HIPAA variation',
    master: '04',
    status: 'Approved Variation',
    note: 'Same lime person — HIPAA badge instead of Spanish. Only when briefed.',
  },
  {
    id: 'var-scroll-01',
    name: 'Giant type (no people)',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-01-giant-type.png',
    note: 'Experimental — thumbs up/down on Concept Review page',
  },
  {
    id: 'var-scroll-02',
    name: 'Split missed/handled',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-02-split-missed-handled.png',
    note: 'Experimental split-screen',
  },
  {
    id: 'var-scroll-03',
    name: 'Split person',
    status: 'Concept Review',
    thumb: '/assets/mockups/mock-03-split-person.png',
    note: 'Person + bold type split',
  },
];
