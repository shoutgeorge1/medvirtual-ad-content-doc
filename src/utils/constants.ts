export const ROLES = [
  'General MedVirtual',
  'Medical Assistant',
  'Medical Nurse',
  'Medical Biller',
  'Medical Case Coordinator',
] as const;

export const ANGLES = [
  'Cost comparison',
  'Staffing shortage',
  'Patient experience',
  'Founder / operator authority',
  'Workflow transformation',
] as const;

export const STATUSES = [
  'Draft',
  'In Progress',
  'Ready For Review',
  'Approved',
  'Exported',
] as const;

export const ROLE_URLS: Record<string, { url: string; pageName: string }> = {
  'General MedVirtual': {
    url: 'https://www.medvirtual.ai/explore-medical-virtual-assistants',
    pageName: 'Explore Medical Virtual Assistants',
  },
  'Medical Assistant': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-assistants',
    pageName: 'Hire Virtual Medical Assistants',
  },
  'Medical Nurse': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-nurse-now',
    pageName: 'Hire Virtual Medical Nurse',
  },
  'Medical Biller': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-biller-now',
    pageName: 'Hire Virtual Medical Biller',
  },
  'Medical Case Coordinator': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-case-coordinator-now',
    pageName: 'Hire Virtual Medical Case Coordinator',
  },
};

export const ANGLE_HOOKS: Record<string, string[]> = {
  'Cost comparison': [
    'Cut Staffing Costs',
    'Support From $10/hr',
    'Save Up To 70%',
    'Lower Admin Overhead',
    'Staff Smarter',
  ],
  'Staffing shortage': [
    'Short-Staffed?',
    'Get Help Fast',
    'Fill Gaps In Days',
    'Support Without Hiring Delays',
    'Add Trained Staff',
  ],
  'Patient experience': [
    'Better Patient Follow-Up',
    'Reduce Missed Calls',
    'Smoother Patient Flow',
    'Faster Scheduling Support',
    'Keep Patients Moving',
  ],
  'Founder / operator authority': [
    'Build A Stronger Back Office',
    'Scale Without Admin Chaos',
    'More Support, Less Stress',
    'Take Control Of Staffing',
    'Run Leaner Operations',
  ],
  'Workflow transformation': [
    'Clear The Backlog',
    'Turn Chaos Into Process',
    'Clean Up Daily Workflow',
    'Get Admin Work Moving',
    'Organize Your Practice',
  ],
};

export const ROLE_FILE_PREFIX: Record<string, string> = {
  'General MedVirtual': 'GENERAL',
  'Medical Assistant': 'ASSISTANT',
  'Medical Nurse': 'NURSE',
  'Medical Biller': 'BILLER',
  'Medical Case Coordinator': 'CASECOORD',
};

export const ANGLE_FILE_SUFFIX: Record<string, string> = {
  'Cost comparison': 'COST',
  'Staffing shortage': 'STAFFING',
  'Patient experience': 'PATIENT',
  'Founder / operator authority': 'OPERATOR',
  'Workflow transformation': 'WORKFLOW',
};

export const EXPORT_SIZES = {
  '1080x1350': { width: 1080, height: 1350, label: '4:5 Vertical (1080×1350)' },
  '1080x1080': { width: 1080, height: 1080, label: 'Square (1080×1080)' },
} as const;
