/**
 * SaaS Prop templates — classy “billion-dollar medical software” visuals,
 * staffing message underneath. No people. Props + fancy words only.
 *
 * Visual: glass UI / 3D medical ops props from /assets/saas-prop-refs/
 * Copy: hire dedicated virtual staff (NOT “we are your software”).
 */
import { BRAND } from './medvirtual-brand-data.mjs';

/** Shared background props */
export const SAAS_PROP_ART = {
  flowVerify: '/assets/saas-prop-refs/saas-flow-verify.png',
  schedulingUi: '/assets/saas-prop-refs/saas-scheduling-ui.png',
  networkHub: '/assets/saas-prop-refs/saas-network-hub.png',
  analyticsGlass: '/assets/saas-prop-refs/saas-analytics-glass.png',
  chaosDashboard: '/assets/saas-prop-refs/saas-chaos-to-dashboard.png',
  dentalNetwork: '/assets/saas-prop-refs/saas-dental-network.png',
  inboxFunnel: '/assets/saas-prop-refs/saas-inbox-funnel.png',
  dashboardStack: '/assets/saas-prop-refs/saas-dashboard-stack.png',
  secureFiles: '/assets/saas-prop-refs/saas-secure-files.png',
  workflowSteps: '/assets/saas-prop-refs/saas-workflow-steps.png',
};

/**
 * Fancy headline banks — swap freely. Keep “hire dedicated staff” truth in support/CTA.
 */
export const SAAS_COPY_BANKS = {
  opsExcellence: [
    'Clinical capacity without operational drag.',
    'More care. Less chaos.',
    'The practice stays human. The admin gets serious.',
    'Front-office throughput, without burnout.',
    'Quiet operations. Louder outcomes.',
  ],
  scheduling: [
    'Every chair filled starts with every call answered.',
    'Schedules that hold. Days that breathe.',
    'Fewer empty chairs. Calmer calendars.',
    'Precision scheduling for practices that can’t miss.',
    'Confirmations, reminders, coverage — orchestrated.',
  ],
  billing: [
    'Cleaner claims. Cleaner cash flow.',
    'Revenue that doesn’t wait on follow-up queues.',
    'Billing discipline without the in-office tax.',
    'From denial pile to posted payments — staffed.',
    'Claims that move. Teams that breathe.',
  ],
  coverage: [
    'Coverage before the visit. Clarity before the day.',
    'Insurance verification without the waiting room bottleneck.',
    'Pre-auth that doesn’t stall treatment.',
    'Eligibility handled. Schedule protected.',
  ],
  dental: [
    'Fewer missed calls. Fewer empty chairs.',
    'Dental ops that keep the book full.',
    'Chair time is too expensive to waste on admin.',
    'The practice floor stays clinical. The back office stays covered.',
  ],
  enterprise: [
    'Enterprise-grade ops. Practice-sized teams.',
    'Built like serious software. Delivered as dedicated people.',
    'The operating system is still your team — we staff it.',
    'Infrastructure for practices that outgrew scramble mode.',
    'White-glove capacity. Full-time commitment.',
  ],
};

export const SAAS_SUPPORT_BANK = [
  'Hire dedicated full-time virtual staff who join your practice team.',
  'Trained virtual teammates for calls, scheduling, billing, and admin.',
  'Not a call center. Not software. Dedicated people for your practice.',
  'MedVirtual places full-time virtual staff inside your daily workflow.',
  'One hire. Real capacity. Part of your team.',
];

export const SAAS_CTA_BANK = [
  'Book a Demo',
  'Request Talent',
  'See Available Staff',
  'Start Hiring',
  'Talk to MedVirtual',
];

export const SAAS_EYEBROW_BANK = [
  'Practice Operations',
  'Virtual Staffing',
  'For Growing Practices',
  'Medical & Dental Ops',
  'Capacity, Staffed',
];

/**
 * Concrete ad concepts — each pairs a prop scene + default fancy words.
 * Use `variants` for alternate headlines graphics can cycle.
 */
export const SAAS_PROP_TEMPLATES = [
  {
    id: 'SP-OPS-LAYER',
    layout: 'PROP_COPY_LEFT',
    label: 'Ops layer · glass dashboard',
    art: SAAS_PROP_ART.dashboardStack,
    eyebrow: 'Practice Operations',
    headline: 'Enterprise-grade ops. Practice-sized teams.',
    variants: SAAS_COPY_BANKS.enterprise,
    support: 'Hire dedicated full-time virtual staff who join your practice team.',
    bullets: ['Calls & scheduling', 'Insurance & billing support', 'EMR / admin follow-through'],
    cta: 'Book a Demo',
    notes: 'Prop = stacked medical UI. Fancy words left; big negative space.',
  },
  {
    id: 'SP-CHAOS-CLEAN',
    layout: 'PROP_COPY_LEFT',
    label: 'Chaos → clean dashboard',
    art: SAAS_PROP_ART.chaosDashboard,
    eyebrow: 'From scramble to structure',
    headline: 'Front-office throughput, without burnout.',
    variants: SAAS_COPY_BANKS.opsExcellence,
    support: 'Dedicated virtual staff absorb the admin load — your team stays on patients.',
    bullets: ['Unread queues cleared', 'Calendars held', 'Follow-ups owned'],
    cta: 'Request Talent',
    notes: 'Visual metaphor: mess → organized. Do NOT imply MedVirtual is software.',
  },
  {
    id: 'SP-INBOX-FUNNEL',
    layout: 'PROP_COPY_LEFT',
    label: 'Calls & inbox funnel',
    art: SAAS_PROP_ART.inboxFunnel,
    eyebrow: 'Patient access',
    headline: 'Every chair filled starts with every call answered.',
    variants: SAAS_COPY_BANKS.scheduling,
    support: 'Hire a full-time virtual teammate for phones, scheduling, and patient follow-up.',
    bullets: ['Answer & route', 'Book & confirm', 'Reduce no-shows'],
    cta: 'See Available Staff',
    notes: 'Props = phones/chats funneling into UI. Staffing message in support.',
  },
  {
    id: 'SP-SCHEDULE-UI',
    layout: 'PROP_COPY_LEFT',
    label: 'Scheduling UI prop',
    art: SAAS_PROP_ART.schedulingUi,
    eyebrow: 'Scheduling',
    headline: 'Schedules that hold. Days that breathe.',
    variants: SAAS_COPY_BANKS.scheduling,
    support: 'Virtual schedulers who work like full-time practice staff — not a shared queue.',
    bullets: ['Appointment setting', 'Confirmations', 'Reminder discipline'],
    cta: 'Book a Demo',
    notes: 'Calendar/SaaS chrome as prop only.',
  },
  {
    id: 'SP-VERIFY-FLOW',
    layout: 'PROP_COPY_LEFT',
    label: 'Verification flow',
    art: SAAS_PROP_ART.flowVerify,
    eyebrow: 'Insurance & eligibility',
    headline: 'Coverage before the visit. Clarity before the day.',
    variants: SAAS_COPY_BANKS.coverage,
    support: 'Hire virtual verification talent to protect the schedule and the day.',
    bullets: ['Eligibility checks', 'Pre-authorizations', 'Fewer day-of surprises'],
    cta: 'Talk to MedVirtual',
    notes: 'Step glass props. No HIPAA boasts unless producer-approved.',
  },
  {
    id: 'SP-BILLING-GLASS',
    layout: 'PROP_COPY_LEFT',
    label: 'Billing / analytics glass',
    art: SAAS_PROP_ART.analyticsGlass,
    eyebrow: 'Revenue operations',
    headline: 'Cleaner claims. Cleaner cash flow.',
    variants: SAAS_COPY_BANKS.billing,
    support: 'Dedicated virtual billers and billing support who join your team.',
    bullets: ['Claims review', 'Denial follow-up', 'Payment posting support'],
    cta: 'Start Hiring',
    notes: 'Glass charts = status/premium. Message = people, not a billing platform.',
  },
  {
    id: 'SP-SECURE-FILES',
    layout: 'PROP_COPY_LEFT',
    label: 'Secure files prop',
    art: SAAS_PROP_ART.secureFiles,
    eyebrow: 'Admin that protects the day',
    headline: 'Quiet operations. Louder outcomes.',
    variants: SAAS_COPY_BANKS.opsExcellence,
    support: 'Full-time virtual medical admin — trained, dedicated, interviewable.',
    bullets: ['Intake & documentation', 'EMR updates', 'Insurance follow-through'],
    cta: 'Book a Demo',
    notes: 'Shield/files = premium care ops vibe. Avoid inventing compliance claims.',
  },
  {
    id: 'SP-NETWORK-HUB',
    layout: 'PROP_COPY_LEFT',
    label: 'Ops network hub',
    art: SAAS_PROP_ART.networkHub,
    eyebrow: 'One practice team',
    headline: 'Built like serious software. Delivered as dedicated people.',
    variants: SAAS_COPY_BANKS.enterprise,
    support: 'MedVirtual staffs your ops roles — the teammate is human, full-time, and yours to interview.',
    bullets: ['Scheduling', 'Billing support', 'Patient communication'],
    cta: 'Request Talent',
    notes: 'Best “software look / staffing truth” bridge line.',
  },
  {
    id: 'SP-DENTAL',
    layout: 'PROP_COPY_LEFT',
    label: 'Dental network',
    art: SAAS_PROP_ART.dentalNetwork,
    eyebrow: 'Dental practices',
    headline: 'Fewer missed calls. Fewer empty chairs.',
    variants: SAAS_COPY_BANKS.dental,
    support: 'Hire dedicated virtual dental admin for scheduling, reminders, and patient follow-up.',
    bullets: ['Scheduling', 'Confirmations', 'Treatment reminders'],
    cta: 'Book a Demo',
    notes: 'Dental prop set. Audience can use DENTISTS! pill optionally.',
    audiencePill: 'DENTISTS!',
  },
  {
    id: 'SP-WORKFLOW',
    layout: 'PROP_COPY_LEFT',
    label: 'Workflow steps',
    art: SAAS_PROP_ART.workflowSteps,
    eyebrow: 'How capacity shows up',
    headline: 'The practice stays human. The admin gets serious.',
    variants: [...SAAS_COPY_BANKS.opsExcellence, ...SAAS_COPY_BANKS.enterprise],
    support: 'Hire through MedVirtual. Dedicated staff. Part of your practice team.',
    bullets: ['Intake', 'Coordinate', 'Close the loop'],
    cta: 'See Available Staff',
    notes: 'Horizontal process props — great for “steps” storytelling.',
  },
];

export const SAAS_PROP_META = {
  title: 'SaaS Prop · Classy Ops Ads',
  subtitle:
    'Billion-dollar medical software look. No people — props only. Fancy words in rotation. Truth underneath: hire dedicated virtual staff.',
  brand: BRAND.adFacingName,
  logo: BRAND.assets.logoColoredSvg,
  guardrail:
    'Looks like premium software. Sounds like staffing. Never claim MedVirtual is EMR/PMS software or a managed front desk.',
};
