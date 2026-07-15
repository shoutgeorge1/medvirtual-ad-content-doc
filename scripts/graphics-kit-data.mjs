/**
 * Component kit metadata for the four approved masters — Philippines resize wave.
 */
import { APPROVED_MASTERS, FORMAT_SPECS, GRAPHICS_BUILD_ORDER } from './vma-approved-masters.mjs';

export const TARGET_RATIOS = FORMAT_SPECS.filter((f) => f.id !== '1x1');

export const MASTER_THEMES = {
  '01': {
    bg: '#0a1628',
    panel: 'linear-gradient(135deg,#0a1628 0%,#0d2840 100%)',
    ink: '#ffffff',
    accent: '#B8F000',
    accentAlt: '#00E5FF',
    priceBg: '#00B2E2',
    chipBg: 'rgba(255,255,255,0.1)',
    chipBorder: '#B8F000',
  },
  '02': {
    bg: '#0a0a0a',
    panel: 'linear-gradient(160deg,#0a0a0a 0%,#111 100%)',
    ink: '#ffffff',
    accent: '#1D4ED8',
    accentAlt: '#00E5FF',
    priceBg: '#1D4ED8',
    chipBg: 'rgba(29,78,216,0.25)',
    chipBorder: '#00E5FF',
  },
  '03': {
    bg: '#0B1F3A',
    panel: 'linear-gradient(160deg,#0B1F3A 0%,#132a4a 100%)',
    ink: '#ffffff',
    accent: '#FFE600',
    accentAlt: '#FFE600',
    priceBg: '#FFE600',
    priceInk: '#0B1F3A',
    chipBg: 'rgba(255,230,0,0.12)',
    chipBorder: '#FFE600',
  },
  '04': {
    bg: '#0a0a0a',
    panel: 'linear-gradient(160deg,#0a0a0a 0%,#0f1a0f 100%)',
    ink: '#ffffff',
    accent: '#B8F000',
    accentAlt: '#22C55E',
    priceBg: '#B8F000',
    priceInk: '#0a0a0a',
    chipBg: 'rgba(255,255,255,0.95)',
    chipBorder: '#B8F000',
    chipInk: '#0a0a0a',
  },
};

const SUBHEADS = {
  '01': 'Reception · insurance · preauth · billing — Spanish available',
  '02': 'Help with calls, scheduling, insurance, and billing',
  '03': 'Front-office support — calls, scheduling, insurance, billing',
  '04': 'Reception · insurance · preauth · billing — HIPAA compliant',
};

const HEADLINE_LINES = ['HIRE A', 'VIRTUAL', 'MEDICAL', 'ADMIN'];

/** Transparent person PNGs — scrub color is separate, changeable in any editor */
export const PERSON_TRANSPARENT = {
  '01': '/assets/video-elements/people/admin-lime.png',
  '02': '/assets/video-elements/people/admin-cobalt.png',
  '03': '/assets/video-elements/people/admin-cobalt.png',
  '04': '/assets/video-elements/people/admin-lime.png',
};

export const SHARED_ASSETS = [
  { label: 'Person · cobalt scrubs (transparent PNG)', href: '/assets/video-elements/people/admin-cobalt.png' },
  { label: 'Person · lime scrubs (transparent PNG)', href: '/assets/video-elements/people/admin-lime.png' },
  { label: 'MedVirtual logo · white', href: '/assets/brand/medvirtual/logo-white.svg' },
  { label: 'MedVirtual logo · color', href: '/assets/brand/medvirtual/logo-colored.svg' },
];

/** Target scrub hex per master — team recolors the transparent layer (hue/sat in PS/Figma) */
export const SCRUB_COLORS = {
  '01': '#B8F000',
  '02': '#1D4ED8',
  '03': '#FFE600',
  '04': '#B8F000',
};

const SCRUB_RECOLOR_NOTE = {
  '03': 'Start from cobalt transparent PNG → recolor scrubs to signal yellow (#FFE600) in your editor.',
};

/** Per-ratio layout presets (true Meta pixels) for live mock preview */
export const MOCK_LAYOUTS = {
  '4x5': {
    person: { right: -20, bottom: 0, width: 580, height: 1280 },
    headline: { left: 56, top: 100, width: 520, size: 88, lh: 0.95 },
    subhead: { left: 58, top: 520, width: 480, size: 30 },
    benefits: { left: 56, top: 600, width: 480, size: 26, gap: 12 },
    price: { left: 56, top: 980, size: 64 },
    trust: { left: 56, top: 1100, size: 24 },
    logo: { left: 56, top: 48, h: 40 },
  },
  '9x16': {
    person: { left: 0, right: 0, bottom: 0, height: 1100 },
    headline: { left: 64, top: 200, width: 920, size: 120, lh: 0.94 },
    subhead: { left: 66, top: 720, width: 900, size: 34 },
    benefits: { left: 66, top: 800, width: 900, size: 28, gap: 14 },
    price: { right: 64, top: 200, size: 72 },
    trust: { left: 66, top: 1180, size: 28 },
    logo: { left: 64, top: 120, h: 44 },
  },
  '1.91x1': {
    person: { right: -10, bottom: 0, width: 520, height: 628 },
    headline: { left: 48, top: 72, width: 560, size: 72, lh: 0.95 },
    subhead: { left: 50, top: 340, width: 520, size: 24 },
    benefits: { left: 50, top: 400, width: 520, size: 20, gap: 8 },
    price: { right: 48, top: 56, size: 52 },
    trust: { left: 50, top: 540, size: 20 },
    logo: { left: 48, top: 40, h: 36 },
  },
};

export const RATIO_META = Object.fromEntries(
  FORMAT_SPECS.map((f) => [f.id, { label: f.label, dims: f.dims, w: f.width, h: f.height, layoutNote: f.layoutNote }]),
);

export function buildGraphicsKitPayload() {
  const ordered = GRAPHICS_BUILD_ORDER.map((n) => APPROVED_MASTERS.find((m) => m.number === n)).filter(Boolean);

  return {
    buildOrder: GRAPHICS_BUILD_ORDER,
    ratios: TARGET_RATIOS.map((r) => r.id),
    ratioMeta: RATIO_META,
    layouts: MOCK_LAYOUTS,
    sharedAssets: SHARED_ASSETS,
    masters: ordered.map((m) => {
      const theme = MASTER_THEMES[m.number] || MASTER_THEMES['02'];
      const scrubColor = SCRUB_COLORS[m.number] || theme.accent;
      theme.scrubColor = scrubColor;
      const formats = Object.fromEntries(
        m.formats.map((f) => [
          f.formatId,
          {
            status: f.status,
            path: f.path,
            expectedFilename: f.expectedFilename,
            layoutNote: f.layoutNote,
          },
        ]),
      );
      const components = [
        {
          id: 'person',
          label: 'Person (transparent PNG)',
          type: 'person',
          src: PERSON_TRANSPARENT[m.number],
          refSrc: `/assets/graphics-kit/person-${m.number}.png`,
          scrubColor,
          hint: 'Transparent cutout — change scrub color without redoing the photo. Match pose/lighting to the reference crop.',
          specs: [
            'PNG with transparent background — drag onto any layout',
            'Scrub color: ' + scrubColor + ' — use hue/saturation or color overlay in Photoshop / Illustrator / Figma',
            SCRUB_RECOLOR_NOTE[m.number] || 'Keep skin tones natural when recoloring scrubs only',
            'Reposition and scale per ratio — never stretch',
          ],
        },
        {
          id: 'scrubs',
          label: 'Scrub color',
          type: 'scrub',
          scrubColor,
          hint: 'Apply this color to the transparent person layer — not baked into the PNG.',
        },
        {
          id: 'headline',
          label: 'Headline',
          type: 'text',
          lines: HEADLINE_LINES,
          accentLine: 1,
          hint: 'Set in Be Vietnam Pro Black. Accent color on line 2 (VIRTUAL).',
          specs: ['All caps', 'Mobile-readable — scale per ratio mock', 'Spell exactly — no extra words'],
        },
        {
          id: 'subhead',
          label: 'Sub-line',
          type: 'text',
          text: SUBHEADS[m.number] || '',
          hint: 'One short support line under the headline.',
        },
        {
          id: 'benefits',
          label: 'Benefits (4 chips)',
          type: 'list',
          items: m.services,
          hint: 'Stack or grid depending on layout. Keep icons simple line style.',
        },
        {
          id: 'offer',
          label: 'Price badge',
          type: 'text',
          text: m.offerOrBadge.split('·')[0].trim(),
          hint: 'Only if printed on the approved master. Do not invent new pricing.',
          specs: [m.claim ? `Claim: ${m.claim}` : ''],
        },
        ...(m.number === '01' || m.number === '04'
          ? [
              {
                id: 'trust',
                label: m.number === '01' ? 'Spanish badge' : 'HIPAA badge',
                type: 'text',
                text: m.languageOrTrust,
                hint: m.number === '01' ? 'Concept 01 only — Spanish / flag treatment.' : 'Concept 04 only — HIPAA badge.',
              },
            ]
          : []),
        {
          id: 'logo',
          label: 'MedVirtual logo',
          type: 'image',
          src: '/assets/brand/medvirtual/logo-white.svg',
          srcAlt: '/assets/brand/medvirtual/logo-colored.svg',
          hint: 'MedVirtual only — never MedVirtual.ai',
        },
        {
          id: 'colors',
          label: 'Color palette',
          type: 'colors',
          swatches: [
            { name: 'Scrub color', hex: scrubColor },
            { name: 'Accent', hex: theme.accent },
            { name: 'Accent alt', hex: theme.accentAlt },
            { name: 'Background', hex: theme.bg },
            ...(theme.priceBg ? [{ name: 'Price badge', hex: theme.priceBg }] : []),
          ],
          hint: 'Transparent components + these hex values — swap colors without regenerating photos. No pink.',
        },
      ];

      return {
        id: m.id,
        number: m.number,
        name: m.name,
        stem: m.stem,
        headline: m.headline,
        headlineLines: HEADLINE_LINES,
        subhead: SUBHEADS[m.number],
        theme,
        productionNote: m.productionNote,
        square: formats['1x1'],
        formats,
        components,
      };
    }),
  };
}
