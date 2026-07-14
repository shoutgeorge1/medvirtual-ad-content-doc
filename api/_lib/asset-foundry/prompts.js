/**
 * Preference-guided prompt composer (application-level — not model fine-tuning).
 */

import crypto from 'crypto';
import { PREFERENCE_ATTRIBUTES } from './config.js';

export const UNIVERSAL_EXCLUSIONS = [
  'No text, letters, numbers, logos, watermarks, signatures, captions, CTA buttons, or labels',
  'No readable screens, medical records, patient information, pricing, certificates, or credentials',
  'No fake testimonials, brand names, or MedVirtual logos inside the image',
  'No distorted hands, extra fingers, duplicate people, malformed devices, or impossible reflections',
  'No exaggerated headset, overdone cyan glow, giant medical symbols, or sterile hospital cliché',
  'No call-center rows, crowded offices, outsourcing stereotypes, or recruitment-job-board language',
  'No visible ChatGPT or OpenAI branding',
];

const LANE_COPY = {
  'real-va-workplace': {
    purpose:
      'Believable documentary-inspired commercial photography of a professional Filipino virtual assistant working from a clean contemporary home office. Representative synthetic person only — never portray as a named MedVirtual employee.',
    subject: 'One focused professional adult working at a desk with laptop and notebook, natural skin texture, calm approachable expression',
    exclude: 'Avoid medical uniforms, hospital settings, US clinic interiors, luxury offices, exaggerated smiles, stock posing',
  },
  'healthcare-operations': {
    purpose:
      'Premium healthcare-operations image plate supporting MedVirtual staffing advertising without implying MedVirtual sells software or EMR.',
    subject: 'Calm administrative workflow motif — phone, calendar shapes, inbox, documents — with strong negative space',
    exclude: 'No readable fake dashboards, charts with numbers, floating icon explosions, generic blue medical-tech cliché',
  },
  'saas-props': {
    purpose:
      'Polished dimensional 3D props and atmospheric plates for healthcare staffing ads. Props only — HTML/CSS will add UI later.',
    subject: 'Isolated premium calendar, phone, inbox, insurance, billing, or task-card props on a clean uniform background',
    exclude: 'Do not invent readable UI text; avoid simple flat icons that should be SVG',
  },
  'vertical-specific': {
    purpose: 'Administrative and operational scene for a practice vertical — never clinical procedures or clinical credentials.',
    subject: 'Healthcare administration relevance with vertical cues without procedures or patient care acts',
    exclude: 'No clinical procedures, no giant tooth cliché, no visible patient data',
  },
  'controlled-exploration': {
    purpose: 'Brand-safe exploratory direction — editorial, documentary, or minimal metaphor — still MedVirtual-compatible.',
    subject: 'Professional restrained exploration aligned with healthcare staffing photography',
    exclude: 'Still obey privacy, no text, no clinical procedures, no recruitment cliché',
  },
  'real-talent-reference': {
    purpose:
      'Reference-guided edit of consented MedVirtual talent photography. Preserve identity, face recognizability, skin tone, age cues, and body type. Label: real-person-reference-edit.',
    subject: 'Same real person as reference — do not invent a different person or blend identities',
    exclude:
      'Do not alter racial identity, skin tone, age, or body type misleadingly; no sexualized or glamorized versions; no clinical environments suggesting duties they do not perform; no fake testimonials',
  },
};

const CONCEPT_MAP = {
  'Too many calls': 'visual sense of phone and communication load transitioning toward organized support',
  'Scheduling overload': 'calendar and appointment administration under pressure with room for calm control',
  'Patient intake backlog': 'intake and paperwork administration theme without readable forms',
  'Follow-up support': 'follow-up and outbound communication support motif',
  'Insurance verification': 'insurance verification administration props without readable PII',
  'Billing administration': 'billing and revenue-cycle paperwork administration',
  'Add operational capacity': 'visual metaphor of capacity expanding calmly',
  'Real person behind the work': 'credible individual doing dedicated virtual work',
  'Dedicated team member': 'one dedicated teammate presence — staffing, not software',
  'Front-desk pressure': 'front-desk administrative pressure without call-center rows',
  'Practice growth support': 'growth-support operational calm',
  'Administrative workflow': 'clean administrative workflow plate',
};

const VARIANT_HINTS = [
  { key: 'aligned', weight: '70%', note: 'Strongly align with MedVirtual approved preferences and the selected brief.' },
  { key: 'variation', weight: '20%', note: 'Controlled variation of an approved composition — same idea, fresh framing.' },
  { key: 'adjacent', weight: 'adjacent', note: 'Adjacent creative interpretation that stays brand-safe.' },
  { key: 'explore', weight: '10%', note: 'Restrained wildcard exploration within brand, privacy, and claims rules.' },
];

function sanitizeDirection(text, max = 600) {
  return String(text || '')
    .replace(/[\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function composePrompt(input, preferenceHints = []) {
  const lane = LANE_COPY[input.lane] || LANE_COPY['healthcare-operations'];
  const concept = CONCEPT_MAP[input.concept] || input.concept || 'healthcare administrative support';
  const placement = input.subjectPosition || 'right';
  const copySpace = input.copySpace || 'left';
  const camera = input.cameraTreatment || 'Natural documentary';
  const lighting = input.lighting || 'Natural window light';
  const realism = input.realism || 'Natural';
  const sceneType = input.sceneType || 'Real workplace';
  const vertical = input.vertical && input.vertical !== 'none' ? input.vertical.replace(/-/g, ' ') : 'general practice administration';
  const extra = sanitizeDirection(input.additionalDirection);
  const variant = VARIANT_HINTS[input.variantIndex ?? 0] || VARIANT_HINTS[0];

  const refLines = (input.referenceRoles || [])
    .map((r, i) => {
      const letter = String.fromCharCode(65 + i);
      return `Reference ${letter}: ${r.role || 'visual guidance only'} — borrow ${r.borrow || 'composition or lighting principles'}; do not copy logos, faces unless consented real-talent mode, or branded UI.`;
    })
    .join('\n');

  const prefLine =
    preferenceHints.length > 0
      ? `Preference-guided attributes (application taste profile, not model training): favor ${preferenceHints.slice(0, 8).join(', ')}.`
      : 'Preference-guided attributes: insufficient evidence yet — stay within MedVirtual documentary-premium balance.';

  const subjectTypeNote =
    input.lane === 'real-talent-reference'
      ? 'Subject type: real-person-reference-edit. Preserve identity faithfully.'
      : input.lane === 'saas-props' || placement === 'no-person' || input.sceneType === 'Dimensional prop'
        ? 'Subject type: no person / prop-led.'
        : 'Subject type: synthetic-representative-person. Never present as a named MedVirtual employee.';

  const layers = [
    `Strategic purpose: ${lane.purpose}`,
    `Advertising idea: ${concept}. Practice vertical cue: ${vertical}.`,
    `Scene type: ${sceneType}. Action: professional administrative work without readable content.`,
    `Subject: ${lane.subject}. ${subjectTypeNote}`,
    `Camera and framing: ${camera}. Subject placement: ${placement}. Copy-space location: ${copySpace} — leave deliberate empty area for later HTML headlines.`,
    `Lighting: ${lighting}. Realism: ${realism}. Color direction: subtle cyan/teal compatibility with neutrals; avoid muddy teal overlays and neon cyan glow.`,
    `Batch variety role (${variant.key}): ${variant.note}`,
    prefLine,
    refLines,
    lane.exclude,
    `Universal exclusions: ${UNIVERSAL_EXCLUSIONS.join('; ')}.`,
    extra ? `Additional producer direction: ${extra}` : '',
    'Output: raw photographic or 3D prop imagery only. No typography of any kind.',
  ].filter(Boolean);

  const systemComposed = layers.join('\n\n');
  const promptHash = crypto.createHash('sha256').update(systemComposed).digest('hex').slice(0, 16);

  return {
    systemComposed,
    promptHash,
    exclusionsSummary: UNIVERSAL_EXCLUSIONS.slice(0, 4),
    preferenceAttributes: deriveAttributes(input),
  };
}

export function deriveAttributes(input) {
  const attrs = [];
  const light = (input.lighting || '').toLowerCase();
  if (light.includes('natural') || light.includes('window')) attrs.push('natural-lighting');
  if (light.includes('studio') || light.includes('high-key')) attrs.push('studio-lighting');
  if (light.includes('warm')) attrs.push('warm-neutral');
  if (light.includes('cyan') || light.includes('saas')) attrs.push('light-cyan');
  if (light.includes('teal')) attrs.push('deep-teal');

  const pos = input.subjectPosition;
  if (pos === 'left') attrs.push('subject-left');
  if (pos === 'right') attrs.push('subject-right');
  if (pos === 'center') attrs.push('centered-subject');
  if (pos === 'no-person') attrs.push('prop-led');
  else attrs.push('human-led');

  const cs = input.copySpace;
  if (cs === 'left' || cs === 'right' || cs === 'wide-negative-space') attrs.push('wide-copy-space');
  else if (cs === 'center') attrs.push('tight-crop');

  const realism = (input.realism || '').toLowerCase();
  if (realism.includes('documentary') || realism === 'natural') attrs.push('documentary-realism');
  if (realism.includes('premium') || realism.includes('commercial')) attrs.push('premium-commercial');
  if (realism.includes('3d') || realism.includes('dimensional')) attrs.push('dimensional-prop');
  if (realism.includes('abstract')) attrs.push('abstract-metaphor');

  const scene = (input.sceneType || '').toLowerCase();
  if (scene.includes('workplace') || scene.includes('desk')) attrs.push('workplace-scene', 'home-office');
  if (scene.includes('editorial') || scene.includes('portrait')) attrs.push('editorial-portrait');
  if (scene.includes('prop') || scene.includes('dimensional')) attrs.push('dimensional-prop', 'prop-led');
  if (scene.includes('minimal') || scene.includes('background')) attrs.push('minimal-composition');

  if (input.vertical && input.vertical !== 'none') attrs.push('vertical-specificity');

  return [...new Set(attrs)].filter((a) => PREFERENCE_ATTRIBUTES.includes(a));
}

export const PRESETS = {
  'va-copy-left': {
    id: 'va-copy-left',
    label: 'Believable VA — Copy Left',
    lane: 'real-va-workplace',
    vertical: 'none',
    concept: 'Real person behind the work',
    sceneType: 'Real workplace',
    subjectPosition: 'right',
    copySpace: 'left',
    cameraTreatment: 'Natural documentary',
    lighting: 'Natural window light',
    realism: 'Natural',
    format: 'portrait',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection:
      'Filipino virtual assistant in a professional clean home office, laptop and notebook, focused approachable expression, wide clean copy space on left.',
  },
  'va-copy-right': {
    id: 'va-copy-right',
    label: 'Believable VA — Copy Right',
    lane: 'real-va-workplace',
    vertical: 'none',
    concept: 'Dedicated team member',
    sceneType: 'Environmental portrait',
    subjectPosition: 'left',
    copySpace: 'right',
    cameraTreatment: 'Eye-level editorial',
    lighting: 'Natural window light',
    realism: 'Natural',
    format: 'portrait',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection: 'Calm professional workspace, natural desk action, copy space on right, realistic not staged.',
  },
  'human-workflow': {
    id: 'human-workflow',
    label: 'Human Plus Workflow',
    lane: 'healthcare-operations',
    vertical: 'none',
    concept: 'Organized workflow',
    sceneType: 'Human plus workflow',
    subjectPosition: 'right',
    copySpace: 'left',
    cameraTreatment: 'Premium commercial',
    lighting: 'Soft studio daylight',
    realism: 'Premium commercial',
    format: 'portrait',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection:
      'Realistic representative VA on one side with restrained abstract calendar, phone, inbox props; plenty of negative space; no software-product implication.',
  },
  'ops-props': {
    id: 'ops-props',
    label: 'Premium Operations',
    lane: 'saas-props',
    vertical: 'none',
    concept: 'Scheduling overload',
    sceneType: 'Dimensional prop',
    subjectPosition: 'no-person',
    copySpace: 'wide-negative-space',
    cameraTreatment: 'Isolated object photography',
    lighting: 'Soft studio daylight',
    realism: 'Dimensional 3D',
    format: 'square',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection:
      'No people. Scheduling, phone, inbox, insurance, or follow-up props. Premium healthcare operations aesthetic. Large copy space. Clean uniform background suitable for cutout if needed.',
  },
  'dental-admin': {
    id: 'dental-admin',
    label: 'Dental Administration',
    lane: 'vertical-specific',
    vertical: 'dental',
    concept: 'Insurance verification',
    sceneType: 'Abstract operational scene',
    subjectPosition: 'right',
    copySpace: 'left',
    cameraTreatment: 'Premium commercial',
    lighting: 'Bright healthcare SaaS',
    realism: 'Premium commercial',
    format: 'portrait',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection:
      'Administrative dental-practice relevance — scheduling, patient follow-up, insurance verification. No clinical procedure. No giant tooth. No visible patient data.',
  },
  'clean-vertical-bg': {
    id: 'clean-vertical-bg',
    label: 'Clean Vertical Background',
    lane: 'vertical-specific',
    vertical: 'general-medical',
    concept: 'Organized workflow',
    sceneType: 'Background plate',
    subjectPosition: 'no-person',
    copySpace: 'left',
    cameraTreatment: 'Wide operational scene',
    lighting: 'Soft studio daylight',
    realism: 'Premium commercial',
    format: 'portrait',
    quality: 'review',
    explorationLevel: 'balanced',
    additionalDirection:
      'No people. Clean commercial advertising plate with strong subject area on one side and empty copy area on the other. Subtle medical-admin cues only. No text or logos.',
  },
};

export function topPreferenceHints(profile, limit = 6) {
  if (!profile?.combined?.scores) return [];
  const entries = Object.entries(profile.combined.scores)
    .map(([k, v]) => ({ k, score: v.score || 0, n: v.n || 0 }))
    .filter((e) => e.n >= 3 && e.score > 0.3)
    .sort((a, b) => b.score - a.score);
  return entries.slice(0, limit).map((e) => e.k);
}
