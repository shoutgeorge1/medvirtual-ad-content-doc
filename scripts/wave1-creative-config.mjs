/**
 * Wave 1 creative config — single source of truth for the AI-plate pipeline.
 * Concepts: VMA-33, 34, 37, 41, 43.
 *
 * The OpenAI image API produces ONLY the background/visual plate (no text).
 * All headline / support / logo / CTA / benefits typography is composited in
 * code (resvg + sharp). Copy matches ad-copy-paste-ready.txt / creative-map.csv.
 */

// ── Approved palette (subset used by Wave 1) ──
export const FAMILIES = {
  'vivid-green': {
    bg: '#22C55E', bgAlt: '#16A34A', ink: '#0A0A0A',
    headline: '#0A0A0A', support: '#052E16',
    ctaBg: '#0A0A0A', ctaText: '#FFFFFF', accent: '#0A0A0A',
    eyebrowBg: '#0A0A0A', eyebrowText: '#FFE600',
    scrimTop: '#22C55E', scrimBottom: '#04120A',
    gradeWords: 'vivid green (#22C55E) with deep navy and off-black accents, fresh and bright',
  },
  'cobalt-blue': {
    bg: '#1D4ED8', bgAlt: '#1E3A8A', ink: '#FFFFFF',
    headline: '#FFFFFF', support: '#E8F0FF',
    ctaBg: '#FFFFFF', ctaText: '#1D4ED8', accent: '#00E5FF',
    eyebrowBg: '#00E5FF', eyebrowText: '#062B63',
    scrimTop: '#1D4ED8', scrimBottom: '#050B2A',
    gradeWords: 'cobalt blue (#1D4ED8) with high-voltage cyan (#00E5FF) highlights and deep navy shadows',
  },
  'signal-yellow': {
    bg: '#FFE600', bgAlt: '#E6CF00', ink: '#0A0A0A',
    headline: '#0A0A0A', support: '#111111',
    ctaBg: '#0A0A0A', ctaText: '#FFE600', accent: '#0A0A0A',
    eyebrowBg: '#0A0A0A', eyebrowText: '#FFE600',
    scrimTop: '#FFE600', scrimBottom: '#1A1600',
    gradeWords: 'signal yellow (#FFE600) with black accents, bold and high-contrast',
  },
};

// ── Ratio targets (exact Meta upload dimensions) ──
export const RATIOS = {
  '4x5': { w: 1080, h: 1350, apiSize: '1024x1536', label: '4:5' },
  '1x1': { w: 1080, h: 1080, apiSize: '1024x1024', label: '1:1' },
  '9x16': { w: 1080, h: 1920, apiSize: '1024x1536', label: '9:16' },
  '1.91x1': { w: 1200, h: 628, apiSize: '1536x1024', label: '1.91:1' },
};

// Shared plate style + hard negatives (no baked-in text/UI/people-in-labcoats).
// Talent direction (Jul 2026): VMA-33 + VMA-41 plates are the reference — warm,
// approachable, looking DIRECTLY at camera with a natural smile. Face-forward hero.
export const PLATE_TALENT =
  'Looking directly at the camera with warm friendly eye contact and a natural confident smile. ' +
  'Face clearly visible and forward — do NOT look down at laptop, tablet, or paperwork. ' +
  'Charismatic, photogenic, and visually striking in a professional healthcare commercial. ' +
  'Attractive, believable, realistic — not overly retouched or plastic. Natural skin texture. ' +
  'Diverse casting — vary ethnicity, hair, and features across generations.';

export const PLATE_STYLE =
  'Premium commercial healthcare staffing advertisement TALENT PLATE only. ' +
  'Realistic professional virtual medical administrator on the RIGHT side of the frame, ' +
  'wearing clean medical scrubs matched to the color family, seated or standing at a ' +
  'clean desk with a laptop or tablet nearby (props OK, but eyes on camera). ' +
  PLATE_TALENT +
  ' Polished commercial lighting. Strong intentional empty NEGATIVE ' +
  'SPACE on the LEFT side for headline and CTA to be added later in code. ' +
  'Subtle healthcare-admin workflow props may appear around the talent, but the person ' +
  'is the hero. Finished ad background plate, not a mockup.';

export const PLATE_NEGATIVES =
  'ABSOLUTELY NO text, no words, no letters, no numbers, no typography, no captions, ' +
  'no logos, no brand marks, no watermark, no signage, no UI labels, no dashboard text, ' +
  'no screens showing interface text, no charts with labels. ' +
  'No doctors, no lab coats, no white coats, no stethoscopes, no clinical exam rooms. ' +
  'No call-center row, no headset-first operator stock photo, no robot, no AI hologram, no chatbot, no glowing chat bubbles. ' +
  'No looking down at laptop or tablet, no eyes cast downward, no profile-only pose hiding the face. ' +
  'No sexualized posing, no glamour modeling, no nightclub styling, no cleavage focus, no lingerie. ' +
  'Do not imply software, SaaS, or an app. ' +
  'No pink, no magenta, no rose, no fuchsia, no salmon, no coral.';

export const CONCEPTS = [
  {
    id: 'VMA-33',
    stem: 'MV_VMA_33_SpanishNeverLost',
    color: 'vivid-green',
    eyebrow: 'BILINGUAL VIRTUAL MEDICAL ADMIN',
    headline: 'YOUR SPANISH-SPEAKING PATIENTS SHOULD NEVER FEEL LOST',
    support: 'A dedicated bilingual virtual medical admin joins your team.',
    benefits: ['Bilingual Calls', 'Scheduling', 'Insurance', 'Follow-Up'],
    cta: 'Learn More',
    plate:
      'Bilingual patient communication concept. Professional virtual medical admin in vivid green scrubs ' +
      'on the right, laptop/tablet in front, confident and approachable. Around the desk, subtle clean ' +
      'visual cues for two-language patient communication: paired abstract message cards with no letters, ' +
      'phone handset, appointment calendar prop, follow-up card shapes. No flags or stereotypes. ' +
      'Leave the entire left half clean and dark/green for headline overlay.',
  },
  {
    id: 'VMA-34',
    stem: 'MV_VMA_34_BilingualFrontDesk',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'ADD BILINGUAL SUPPORT WITHOUT OVERLOADING YOUR FRONT DESK',
    support: 'A dedicated virtual medical admin joins your team.',
    benefits: ['EN + ES Calls', 'Scheduling', 'Insurance', 'Follow-Up'],
    cta: 'Learn More',
    plate:
      'Front-desk bilingual support concept. Photogenic virtual medical admin in cobalt blue scrubs on ' +
      'the right, seated at a clean desk, looking at camera with a warm smile. Tablet nearby but eyes on viewer. ' +
      'Subtle organized desk props: neat folder stack, phone, calendar. Leave the left half clean and dark/blue for headline overlay.',
    variety: [
      'Latina woman, mid-20s, long dark wavy hair, warm expressive eyes, radiant smile.',
      'East Asian woman, late 20s, sleek hair in low bun, bright friendly gaze.',
      'Mixed-heritage woman, early 30s, honey-brown skin, shoulder-length hair, confident approachable look.',
    ],
  },
  {
    id: 'VMA-37',
    stem: 'MV_VMA_37_TrainedWorkflow',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'TRAINED FOR THE WAY YOUR PRACTICE WORKS',
    support: 'A dedicated virtual medical admin who learns your systems and workflow.',
    benefits: ['Your Systems', 'Your Workflow', 'Full-Time', 'Confidential'],
    cta: 'Learn More',
    plate:
      'Practice workflow fit concept. Photogenic virtual medical admin in cobalt blue scrubs on the right, ' +
      'looking at camera with confident smile. Laptop on desk but face forward to viewer. Subtle admin props: ' +
      'phone, calendar, clipboard. Leave the left half clean and dark/blue for headline overlay.',
    variety: [
      'South Asian woman, late 20s, dark hair in neat ponytail, polished professional beauty.',
      'Black woman, early 30s, natural curls pulled back, warm charismatic smile.',
      'Mediterranean woman, mid-20s, olive skin, soft waves, bright engaging eyes.',
    ],
  },
  {
    id: 'VMA-41',
    stem: 'MV_VMA_41_FrontDeskCapacity',
    color: 'signal-yellow',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'YOUR FRONT DESK CAN\u2019T DO EVERYTHING',
    support: 'Add dedicated administrative capacity without adding another desk.',
    benefits: ['Answer Calls', 'Scheduling', 'Insurance', 'Follow-Up'],
    cta: 'Learn More',
    plate:
      'Before-and-after front desk capacity concept. Professional virtual medical admin in signal yellow ' +
      'scrubs on the right, standing or seated with tablet, confident and helpful. Supporting props show ' +
      'administrative overload becoming organized: scattered task cards, folders, phone and calendar on ' +
      'one side of the desk resolving into clean stacks. Bold yellow/navy commercial look. Leave the left ' +
      'half clean and dark/navy/yellow for headline overlay.',
  },
  {
    id: 'VMA-43',
    stem: 'MV_VMA_43_ScheduleMoving',
    color: 'cobalt-blue',
    eyebrow: 'VIRTUAL MEDICAL ADMIN',
    headline: 'KEEP THE SCHEDULE MOVING',
    support: 'Dedicated virtual support for confirmations, reminders, and rescheduling.',
    benefits: ['Confirm', 'Remind', 'Reschedule', 'Fill Gaps'],
    cta: 'Learn More',
    plate:
      'Appointment scheduling concept. Photogenic virtual medical admin in cobalt blue scrubs on the right, ' +
      'looking at camera with friendly smile. Calendar and scheduling props on desk, no letters. ' +
      'Leave the left half clean and dark/blue for headline overlay.',
    variety: [
      'Filipina woman, mid-20s, long straight dark hair, sweet confident smile.',
      'White woman, late 20s, auburn hair in clip, fresh approachable look.',
      'Afro-Latina woman, early 30s, curly hair, striking warm expression.',
    ],
  },
];

export function plentyPrompt(concept, ratioKey, candidateIndex = 0) {
  const fam = FAMILIES[concept.color];
  const ratio = RATIOS[ratioKey];
  const orient =
    ratioKey === '1.91x1'
      ? 'Wide horizontal composition; keep the main subject and negative space balanced across the frame.'
      : ratioKey === '1x1'
        ? 'Balanced square composition with generous negative space.'
        : 'Tall vertical composition; keep the upper portion open as negative space.';
  const variety =
    concept.variety?.length && candidateIndex > 0
      ? `Cast this portrait as: ${concept.variety[(candidateIndex - 1) % concept.variety.length]}.`
      : concept.variety?.length
        ? `Cast this portrait as: ${concept.variety[0]}.`
        : '';
  return [
    PLATE_STYLE,
    `Color grade: ${fam.gradeWords}.`,
    `Scene: ${concept.plate}`,
    variety,
    orient,
    `Intended as a ${ratio.label} advertisement background.`,
    PLATE_NEGATIVES,
  ].filter(Boolean).join(' ');
}
