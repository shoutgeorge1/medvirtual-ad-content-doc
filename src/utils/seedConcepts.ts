import type { Concept } from '../types/concept';
import { ROLE_URLS, ROLE_BACKGROUND_IMAGES } from './constants';

/** Starter set: one concept per core message angle (expand later). */
const STARTER_CONCEPTS: Omit<Concept, 'source_url' | 'source_page_name'>[] = [
  {
    concept_id: 'cost-01',
    role: 'General MedVirtual',
    angle: 'Cost comparison',
    image_prompt:
      'Professional healthcare office, modern clinic, soft daylight, teal palette, photorealistic, no text, no logos',
    image_file: ROLE_BACKGROUND_IMAGES['General MedVirtual'],
    image_direction: 'Credible healthcare professional portrait, clean background, no text in image',
    on_image_hook: 'Cut Staffing Costs',
    bullet_1: 'HIPAA-trained virtual support',
    bullet_2: 'Starting at $10/hr',
    bullet_3: 'Month-to-month flexibility',
    cta: 'Get Started',
    primary_text:
      'Compare in-house staffing with flexible virtual medical support. HIPAA-trained team members starting at $10/hr—month-to-month, no long-term contract.',
    headline: 'Virtual Support From $10/hr',
    description: 'Flexible staffing costs for U.S. practices.',
    file_name: 'MV_META_COST_01',
    status: 'Ready For Review',
    notes: 'Angle: cost / value of hiring vs in-house.',
  },
  {
    concept_id: 'staffing-01',
    role: 'Medical Assistant',
    angle: 'Staffing shortage',
    image_prompt:
      'Medical assistant in modern clinic, warm professional lighting, healthcare staffing aesthetic, no text, no logos',
    image_file: ROLE_BACKGROUND_IMAGES['Medical Assistant'],
    image_direction: 'Medical assistant portrait, professional scrubs, no text in image',
    on_image_hook: 'Short-Staffed?',
    bullet_1: 'Trained in days, not months',
    bullet_2: 'Scheduling & patient follow-up',
    bullet_3: 'Free replacement if needed',
    cta: 'Get Started',
    primary_text:
      'Skip job postings and long hiring cycles. Add a trained virtual medical assistant in days—with a free replacement if the fit is not right.',
    headline: 'Fill Gaps In Days',
    description: 'Coverage without a long hire.',
    file_name: 'MV_META_STAFFING_01',
    status: 'Ready For Review',
    notes: 'Angle: staffing shortage / hiring pain.',
  },
  {
    concept_id: 'patient-01',
    role: 'Medical Nurse',
    angle: 'Patient experience',
    image_prompt:
      'Registered nurse, clinical admin setting, compassionate professional portrait, no text, no logos',
    image_file: ROLE_BACKGROUND_IMAGES['Medical Nurse'],
    image_direction: 'Nurse portrait, caring professional mood, no text in image',
    on_image_hook: 'Better Patient Follow-Up',
    bullet_1: 'Fewer missed calls & gaps',
    bullet_2: 'Smoother scheduling support',
    bullet_3: 'HIPAA-trained coordination',
    cta: 'Get Started',
    primary_text:
      'Patients notice follow-up, scheduling, and coordination. Strengthen virtual nursing support to keep care moving—without adding in-house headcount.',
    headline: 'Keep Patients Moving',
    description: 'Stronger follow-up and patient flow.',
    file_name: 'MV_META_PATIENT_01',
    status: 'Ready For Review',
    notes: 'Angle: patient experience / follow-up.',
  },
  {
    concept_id: 'operator-01',
    role: 'General MedVirtual',
    angle: 'Founder / operator authority',
    image_prompt:
      'Healthcare practice leader environment, modern office, credible operator tone, no text, no logos',
    image_file: ROLE_BACKGROUND_IMAGES['General MedVirtual'],
    image_direction: 'Professional healthcare portrait, operator credibility, no text in image',
    on_image_hook: 'Scale Without Admin Chaos',
    bullet_1: 'Built for healthcare workflows',
    bullet_2: 'More support, less overhead',
    bullet_3: 'Start in days',
    cta: 'Get Started',
    primary_text:
      'Practice owners need back-office leverage—not more admin stress. Scale with trained virtual support so your team can focus on patients and growth.',
    headline: 'Run A Leaner Back Office',
    description: 'Operator-friendly virtual staffing.',
    file_name: 'MV_META_OPERATOR_01',
    status: 'Ready For Review',
    notes: 'Angle: founder / operator authority.',
  },
  {
    concept_id: 'workflow-01',
    role: 'Medical Biller',
    angle: 'Workflow transformation',
    image_prompt:
      'Medical billing professional at organized workstation, teal accents, corporate healthcare style, no text, no logos',
    image_file: ROLE_BACKGROUND_IMAGES['Medical Biller'],
    image_direction: 'Billing professional portrait, organized workflow mood, no text in image',
    on_image_hook: 'Clear The Backlog',
    bullet_1: 'Billing & claims workflow help',
    bullet_2: 'Reduce admin overhead',
    bullet_3: 'Works in your EMR',
    cta: 'Get Started',
    primary_text:
      'Daily billing and admin backlog slows the whole practice. Organize workflow with HIPAA-trained virtual billing support on your systems.',
    headline: 'Get Admin Work Moving',
    description: 'Turn backlog into process.',
    file_name: 'MV_META_WORKFLOW_01',
    status: 'Ready For Review',
    notes: 'Angle: workflow transformation.',
  },
];

export function generateSeedConcepts(): Concept[] {
  return STARTER_CONCEPTS.map((concept) => {
    const { url, pageName } = ROLE_URLS[concept.role];
    return {
      ...concept,
      source_url: url,
      source_page_name: pageName,
    };
  });
}
