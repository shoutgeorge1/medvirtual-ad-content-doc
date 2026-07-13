/**
 * CMO Review — campaign status + four-person Real People presentation copy.
 * Easy to update metrics later without touching the page generator.
 */

export const CMO_REVIEW_UPDATED = 'July 13, 2026';

/** Current first-batch Meta statics — statuses from marketing; metrics only when provided. */
export const CAMPAIGN_STATUS = [
  {
    id: 'static-04-too-many-calls',
    adName: 'Static 04 — Too Many Calls',
    concept: 'Pain-first · calls',
    status: 'live',
    statusLabel: 'LIVE · CURRENT LEADER',
    ctr: '6.82%',
    cpc: '$5.19',
    cpm: '~$235',
    learning:
      'The clearest operational pain is producing the strongest engagement so far. “Too many calls” is immediate, specific, and recognizable to a busy practice.',
    updatedDate: CMO_REVIEW_UPDATED,
    leader: true,
  },
  {
    id: 'static-01-medical-owners',
    adName: 'Static 01 — Medical Owners',
    concept: 'Audience callout',
    status: 'live',
    statusLabel: 'LIVE',
    ctr: null,
    cpc: null,
    cpm: null,
    learning:
      'The audience callout is direct enough to remain in the test, but it has not created the same response as the pain-first “Too Many Calls” concept.',
    updatedDate: CMO_REVIEW_UPDATED,
    leader: false,
  },
  {
    id: 'lower-overhead',
    adName: 'Lower Overhead',
    concept: 'Cost / overhead',
    status: 'paused',
    statusLabel: 'PAUSED · HIGH CPM',
    ctr: null,
    cpc: null,
    cpm: null,
    learning:
      'The broad cost-saving promise was expensive and did not earn enough engagement to justify continued spend.',
    updatedDate: CMO_REVIEW_UPDATED,
    leader: false,
  },
  {
    id: 'virtual-med-admin',
    adName: 'Virtual Med Admin',
    concept: 'Category / service',
    status: 'paused',
    statusLabel: 'PAUSED · WEAK RESPONSE',
    ctr: null,
    cpc: null,
    cpm: null,
    learning:
      'The language was too generic. It described the service category without giving the viewer a sharp pain, a memorable person, or a compelling reason to stop scrolling.',
    updatedDate: CMO_REVIEW_UPDATED,
    leader: false,
  },
];

export const EARLY_TAKEAWAY =
  'Early takeaway: specific operational pain is outperforming generic staffing and overhead language. The next test pairs that pain with a real, named person.';

/** Four-person executive batch — Treatment C assets only. */
export const CMO_EXAMPLES = [
  {
    id: 'chelsea',
    firstName: 'Chelsea',
    role: 'Dental Virtual Assistant',
    angle: 'Scheduling pressure',
    images: {
      '4x5': '/assets/real-people/chelsea/ad-treatment-c-4x5.png',
      '1x1': '/assets/real-people/chelsea/ad-treatment-c-1x1.png',
      '9x16': '/assets/real-people/chelsea/ad-treatment-c-9x16.png',
    },
    primaryText:
      'Your front desk has enough to handle without letting the schedule take over the entire day. Meet Chelsea, a Dental Virtual Assistant whose listed skills include appointment setting, customer service, and healthcare support. See whether she could fit your workflow.',
    headline: 'Meet Chelsea for Scheduling Support',
    description: 'Real MedVirtual talent you can interview.',
    cta: 'Learn More',
  },
  {
    id: 'mark',
    firstName: 'Mark',
    role: 'Insurance Verification Specialist',
    angle: 'Verification backlog',
    images: {
      '4x5': '/assets/real-people/mark/ad-treatment-c-4x5.png',
      '1x1': '/assets/real-people/mark/ad-treatment-c-1x1.png',
      '9x16': '/assets/real-people/mark/ad-treatment-c-9x16.png',
    },
    primaryText:
      'Insurance verification should not keep pulling your best people away from patients. Meet Mark, an Insurance Verification Specialist with medical billing support listed on his MedVirtual profile. Start with a real person, not another generic staffing promise.',
    headline: 'Verification Backlog? Meet Mark',
    description: 'Explore insurance verification support.',
    cta: 'Learn More',
  },
  {
    id: 'jessica',
    firstName: 'Jessica',
    role: 'Jr. Medical Admin',
    angle: 'Admin work piling up',
    images: {
      '4x5': '/assets/real-people/jessica/ad-treatment-c-4x5.png',
      '1x1': '/assets/real-people/jessica/ad-treatment-c-1x1.png',
      '9x16': '/assets/real-people/jessica/ad-treatment-c-9x16.png',
    },
    primaryText:
      'The admin work does not stop just because your team is already stretched. Meet Jessica, a Jr. Medical Admin with customer-service and healthcare support skills listed on her MedVirtual profile. Request an interview and see whether she fits your practice.',
    headline: 'Admin Work Piling Up?',
    description: 'Meet real MedVirtual medical admin talent.',
    cta: 'Learn More',
  },
  {
    id: 'angelica',
    firstName: 'Angelica',
    role: 'Dermatology Front Desk Assistant',
    angle: 'Front desk stretched thin',
    images: {
      '4x5': '/assets/real-people/angelica/ad-treatment-c-4x5.png',
      '1x1': '/assets/real-people/angelica/ad-treatment-c-1x1.png',
      '9x16': '/assets/real-people/angelica/ad-treatment-c-9x16.png',
    },
    primaryText:
      'Phones ringing. Patients waiting. Tasks stacking up. Meet Angelica, a Dermatology Front Desk Assistant with medical admin and healthcare support experience shown on her MedVirtual profile. Give the front desk capable backup without adding another chair.',
    headline: 'Front Desk Stretched Thin?',
    description: 'Meet a real front-desk support candidate.',
    cta: 'Learn More',
  },
];

export function copyPackage(ex) {
  return [
    `PRIMARY TEXT:`,
    ex.primaryText,
    '',
    `HEADLINE: ${ex.headline}`,
    `DESCRIPTION: ${ex.description}`,
    `CTA: ${ex.cta}`,
  ].join('\n');
}
