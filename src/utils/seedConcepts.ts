import type { Concept } from '../types/concept';
import {
  ROLES,
  ANGLES,
  ROLE_URLS,
  ANGLE_HOOKS,
  ROLE_FILE_PREFIX,
  ANGLE_FILE_SUFFIX,
} from './constants';

const ROLE_BULLETS: Record<string, string[]> = {
  'General MedVirtual': [
    'HIPAA-trained virtual support',
    'Start in days, not months',
    'Month-to-month flexibility',
  ],
  'Medical Assistant': [
    'Scheduling & patient follow-up',
    'HIPAA-trained support',
    'Free replacement if needed',
  ],
  'Medical Nurse': [
    'Clinical admin support',
    'Trained medical support',
    'Start in days',
  ],
  'Medical Biller': [
    'Billing & claims workflow help',
    'Reduce admin overhead',
    'Month-to-month flexibility',
  ],
  'Medical Case Coordinator': [
    'Patient coordination support',
    'Smoother care workflows',
    'HIPAA-trained team members',
  ],
};

const ROLE_HEADLINES: Record<string, Record<string, string>> = {
  'General MedVirtual': {
    'Cost comparison': 'Virtual Medical Support From $10/hr',
    'Staffing shortage': 'Add Trained Support Without Long Hires',
    'Patient experience': 'Better Follow-Up For Your Patients',
    'Founder / operator authority': 'Scale Your Practice Back Office',
    'Workflow transformation': 'Turn Admin Chaos Into Process',
  },
  'Medical Assistant': {
    'Cost comparison': 'Affordable Virtual Medical Assistant Support',
    'Staffing shortage': 'Fill Assistant Gaps In Days',
    'Patient experience': 'Keep Patients Moving With Better Support',
    'Founder / operator authority': 'Run Leaner With Virtual Assistants',
    'Workflow transformation': 'Clean Up Daily Assistant Workflow',
  },
  'Medical Nurse': {
    'Cost comparison': 'Flexible Nurse Support At Lower Overhead',
    'Staffing shortage': 'Nurse Support Without Hiring Delays',
    'Patient experience': 'Stronger Patient Coordination Support',
    'Founder / operator authority': 'More Clinical Admin, Less Stress',
    'Workflow transformation': 'Get Nursing Admin Work Moving',
  },
  'Medical Biller': {
    'Cost comparison': 'Lower Billing Admin Costs',
    'Staffing shortage': 'Billing Support When You Need It',
    'Patient experience': 'Fewer Billing Delays For Patients',
    'Founder / operator authority': 'Take Control Of Billing Workflow',
    'Workflow transformation': 'Clear The Billing Backlog',
  },
  'Medical Case Coordinator': {
    'Cost comparison': 'Case Coordination Support From $10/hr',
    'Staffing shortage': 'Add Coordination Capacity Fast',
    'Patient experience': 'Smoother Patient Flow Across Care',
    'Founder / operator authority': 'Build A Stronger Care Coordination Team',
    'Workflow transformation': 'Organize Case Management Workflow',
  },
};

const IMAGE_DIRECTIONS: Record<string, string> = {
  'General MedVirtual':
    'Modern clinic reception or team collaboration, soft natural light, no visible text or logos in scene',
  'Medical Assistant':
    'Medical assistant workspace with scheduling screens blurred, warm professional tone, no text in image',
  'Medical Nurse':
    'Nurse in clinical admin setting, caring professional mood, clean background, no text in image',
  'Medical Biller':
    'Medical billing office environment, organized desk, blue-teal tones, no text in image',
  'Medical Case Coordinator':
    'Care coordinator reviewing patient files, collaborative healthcare setting, no text in image',
};

const IMAGE_PROMPTS: Record<string, string> = {
  'General MedVirtual':
    'Professional healthcare office team collaboration, modern clinic interior, soft daylight, teal and white color palette, clean composition, photorealistic, no text, no logos, no watermarks',
  'Medical Assistant':
    'Medical assistant at organized front desk in modern clinic, warm professional lighting, shallow depth of field, healthcare staffing aesthetic, no text, no logos',
  'Medical Nurse':
    'Registered nurse in clinical administrative setting, compassionate professional portrait style, soft blue tones, healthcare environment, no text, no logos',
  'Medical Biller':
    'Medical billing professional at clean workstation, organized paperwork and monitor blurred, corporate healthcare style, teal accents, no text, no logos',
  'Medical Case Coordinator':
    'Healthcare case coordinator in bright medical office, patient care planning mood, modern and credible, no text, no logos',
};

function buildPrimaryText(role: string, angle: string): string {
  const roleLabel = role === 'General MedVirtual' ? 'virtual medical support' : role.toLowerCase();
  const angleCopy: Record<string, string> = {
    'Cost comparison': `Many practices compare in-house staffing costs with flexible ${roleLabel}. MedVirtual offers HIPAA-trained support starting at $10/hr with month-to-month flexibility.`,
    'Staffing shortage': `Short-staffed teams need coverage without long hiring cycles. Add trained ${roleLabel} and start in days with a free replacement if the fit is not right.`,
    'Patient experience': `Patients notice follow-up, scheduling, and coordination. Strengthen ${roleLabel} support to reduce missed calls and keep care moving smoothly.`,
    'Founder / operator authority': `Operators need back-office leverage without admin chaos. Scale with trained ${roleLabel} support built for healthcare workflows.`,
    'Workflow transformation': `Daily admin backlog slows the whole practice. Organize ${roleLabel} workflow with scheduling, billing, and follow-up support.`,
  };
  return angleCopy[angle] ?? '';
}

function buildDescription(role: string, angle: string): string {
  const snippets: Record<string, string> = {
    'Cost comparison': 'Compare flexible staffing costs. Starting at $10/hr.',
    'Staffing shortage': 'Fill gaps in days with trained support.',
    'Patient experience': 'Improve follow-up and patient flow.',
    'Founder / operator authority': 'More support. Less operational stress.',
    'Workflow transformation': 'Turn daily admin chaos into process.',
  };
  return `${role.split(' ').slice(-2).join(' ')} — ${snippets[angle] ?? 'Explore MedVirtual support.'}`;
}

export function generateSeedConcepts(): Concept[] {
  const concepts: Concept[] = [];

  ROLES.forEach((role, roleIndex) => {
    const { url, pageName } = ROLE_URLS[role];
    ANGLES.forEach((angle, angleIndex) => {
      const hooks = ANGLE_HOOKS[angle];
      const hook = hooks[roleIndex % hooks.length];
      const bullets = ROLE_BULLETS[role];
      const filePrefix = ROLE_FILE_PREFIX[role];
      const angleSuffix = ANGLE_FILE_SUFFIX[angle];
      const num = String(angleIndex + 1).padStart(2, '0');

      concepts.push({
        concept_id: `${filePrefix.toLowerCase()}-${angleSuffix.toLowerCase()}-${num}`,
        role,
        angle,
        source_url: url,
        source_page_name: pageName,
        image_prompt: IMAGE_PROMPTS[role],
        image_file: `/assets/placeholders/${filePrefix.toLowerCase()}.svg`,
        image_direction: IMAGE_DIRECTIONS[role],
        on_image_hook: hook,
        bullet_1: bullets[0],
        bullet_2: bullets[1],
        bullet_3: bullets[2],
        cta: 'Explore MedVirtual',
        primary_text: buildPrimaryText(role, angle),
        headline: ROLE_HEADLINES[role][angle],
        description: buildDescription(role, angle),
        file_name: `MV_META_${filePrefix}_${angleSuffix}_${num}`,
        status: roleIndex === 0 && angleIndex === 0 ? 'In Progress' : 'Draft',
        notes: '',
      });
    });
  });

  return concepts;
}
