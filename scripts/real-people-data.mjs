/**
 * Real People Creative — talent profiles + ad concepts for Meta.
 *
 * exactPublicFacts / listedSkills = visible public Talent Pool fields only.
 * staticConcepts / videoScripts / recommendedAngles = marketing suggestions (not profile facts).
 *
 * Source: https://app.medvirtual.ai/talent-pool
 * Public API used by that page: GET .../candidates/talent-pool/random?business_unit=MedVirtual
 * Profile detail: https://app.medvirtual.ai/talent-pool/{id}
 */

export const SOURCE_CHECKED_AT = '2026-07-13';
export const TALENT_POOL_URL = 'https://app.medvirtual.ai/talent-pool';

export const STRATEGY = {
  intro:
    'Most virtual medical staffing ads look identical. This direction replaces stock-style creative with actual MedVirtual talent, named profiles, role-specific skills, and natural workplace footage.',
  whyMayWork: [
    {
      title: 'Real faces create credibility',
      note: 'Hypothesis: a named profile photo feels less interchangeable than stock headset imagery.',
    },
    {
      title: 'Names make the service tangible',
      note: 'Hypothesis: “Meet Jessica” is easier to imagine interviewing than “hire a VA.”',
    },
    {
      title: 'Specific skills help the buyer self-qualify',
      note: 'Hypothesis: scheduling, intake, or billing language helps the right practices lean in.',
    },
    {
      title: 'Harder for competitors to imitate',
      note: 'Hypothesis: real Talent Pool people are a brand asset stock packs cannot copy.',
    },
    {
      title: 'One profile → many variations',
      note: 'Hypothesis: each person can feed static, carousel, Reel cover, and short video tests.',
    },
  ],
};

/** First production batch — creative hypotheses, not predetermined winners. */
export const FIRST_BATCH = [
  { concept: 'Meet the person', talentId: 'jessica', format: '4:5 static', hook: 'Meet Jessica', operationalProblem: 'Admin / front-desk backlog', mainVariation: 'Named profile card', status: 'Ready to produce', assetNeeded: 'Approved still crop', recommended: true },
  { concept: 'Meet the person', talentId: 'angelica', format: '4:5 static', hook: 'Meet Angelica', operationalProblem: 'Front-desk coverage', mainVariation: 'Named profile card', status: 'Ready to produce', assetNeeded: 'Approved still crop', recommended: true },
  { concept: 'Meet the person', talentId: 'mark', format: '1:1 static', hook: 'Meet Mark', operationalProblem: 'Insurance verification', mainVariation: 'Named profile card', status: 'Ready to produce', assetNeeded: 'Approved still crop', recommended: true },
  { concept: 'Operational pain', talentId: 'chelsea', format: '4:5 static', hook: 'Scheduling taking over the front desk?', operationalProblem: 'Patient scheduling', mainVariation: 'Pain → named person', status: 'Ready to produce', assetNeeded: 'Approved still crop', recommended: true },
  { concept: 'Direct-to-camera', talentId: 'jessica', format: '9:16 video 8–15s', hook: 'Hi, I’m Jessica…', operationalProblem: 'Admin support', mainVariation: 'Phone intro + role skills', status: 'Needs filming', assetNeeded: 'iPhone vertical clip', recommended: true },
  { concept: 'Direct-to-camera', talentId: 'carmen', format: '9:16 video 8–15s', hook: 'Hi, I’m Carmen…', operationalProblem: 'Billing support', mainVariation: 'Phone intro + role skills', status: 'Needs filming', assetNeeded: 'iPhone vertical clip', recommended: true },
  { concept: 'Office montage', talentId: 'office', format: '9:16 video 10–20s', hook: 'Real work, real people', operationalProblem: 'Credibility / atmosphere', mainVariation: 'Headset · typing · team call', status: 'Needs filming', assetNeeded: 'B-roll pack', recommended: true },
  { concept: 'Ronald walkthrough', talentId: 'ronald', format: '9:16 video 20–40s', hook: 'How practices meet talent', operationalProblem: 'Explain the interview path', mainVariation: 'Host explain + cut to profile', status: 'Needs filming', assetNeeded: 'Ronald host clip', recommended: true },
];

export const BROLL_PLAN = {
  shots: [
    'Employee putting on headset',
    'Employee typing at a clean workstation',
    'Employee joining a team call',
    'Natural workstation footage (no PHI on screens)',
    'Supervisor helping a VA',
    'Training session (wide + close)',
    'Team collaboration at desks',
    'Wide office shot',
    'Employee looking briefly at camera',
    'Direct-to-camera introduction',
    'Screen activity with all private information hidden',
  ],
  settings: [
    'Vertical 9:16',
    '1080p or 4K',
    '30 fps',
    'Camera at eye level',
    'Clean lens',
    'No digital zoom',
    'Natural or soft front lighting',
    'Quiet room for speaking',
    'Three takes per script',
    'One second of silence before and after',
    'No patient data, private information, or confidential systems visible',
  ],
};

/**
 * Selected profiles — admin / scheduling / intake / insurance / billing / front desk.
 * Selection criteria: complete public profile, usable headshot, role relevance, listed skills where present, operational variety.
 */
export const TALENT = [
  {
    id: 'jessica',
    assetSlug: 'jessica',
    firstName: 'Jessica',
    fullPublicName: 'Jessica Valles',
    title: 'Jr. Medical Admin',
    publicPosition: 'Medical Admin Jr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/cf086c15-16b5-410c-b38f-6753fc99b9b4',
    imagePath: '/assets/real-people/jessica/feed-1080x1350.jpg',
    listedSkills: ['BPO - Customer Service', 'BPO - Healthcare'],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Medical admin / front-desk backlog statics and DTC video reference',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs — do not aggressive-upscale further.',
      backgroundNotes: 'Soft studio-style backdrop; no clinic environment invented.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      shiftBlock: 'Full Time',
      specializationShown: ['Primary Care'],
      experienceTitle: 'Jr. Medical Admin',
      approvedPosition: 'Medical Admin Jr',
      toolsShown: ['Zoom', 'Microsoft Office', 'Gmail', 'Google Workplace', 'Outlook'],
    },
    roleRelevance:
      'Junior medical admin with customer-service and healthcare support tags — useful when a practice needs remote help with day-to-day patient and office coordination.',
    recommendedAngles: ['Meet the person', 'Front-desk backup', 'Not another app'],
    operationalPains: ['admin-backlog', 'patient-calls', 'front-desk'],
    roles: ['medical-admin', 'front-office', 'patient-calls'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: true,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET JESSICA',
        onImageRoleSkill: 'Jr. Medical Admin · Customer Service · Healthcare Support',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Jessica — a MedVirtual Medical Admin Jr.\n\nHer public profile lists customer service and healthcare support skills. If your practice needs remote help keeping admin work moving, you can request an interview and meet her directly.\n\nLearn more about Jessica and other MedVirtual talent.',
        metaHeadline: 'Meet Jessica · Medical Admin',
        description: 'Named MedVirtual talent. Request an interview.',
        cta: 'Learn More',
        productionNote: 'Editorial headshot left or center. Name large. Role + two skill chips. Small MedVirtual mark. No fake Meta CTA in artwork.',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Admin work piling up?',
        onImageIntro: 'Meet Jessica · Jr. Medical Admin',
        primaryText:
          'Admin work piling up while the team is already stretched?\n\nJessica is a MedVirtual Jr. Medical Admin with listed customer-service and healthcare support skills. This ad introduces a real person you can interview — not another generic staffing graphic.\n\nRequest an interview to see if she fits your practice.',
        headline: 'Admin backlog? Meet Jessica',
        description: 'Real MedVirtual medical admin talent.',
        cta: 'Learn More',
        productionNote: 'Pain line first (max ~6 words), then photo + name. Keep copy concrete: admin work, patient coordination — no “transform your practice.”',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Your front desk doesn’t need another app.',
        onImageSupport: 'It needs capable support. Meet Jessica · Jr. Medical Admin',
        primaryText:
          'Your front desk doesn’t need another app. It needs capable support.\n\nJessica is listed on MedVirtual’s Talent Pool as a Jr. Medical Admin, with customer-service and healthcare support skills shown on her public profile.\n\nLearn more and request an interview.',
        headline: 'Meet Jessica · Medical Admin',
        description: 'Named talent for practice admin support.',
        cta: 'Learn More',
        productionNote: 'Keep tone firm but not anti-software. Do not claim Jessica replaces specific tools.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT MEDICAL ADMIN MAY ALREADY BE HERE.',
        onImageSupport: 'Jessica · Jr. Medical Admin · Customer Service · Healthcare Support',
        primaryText:
          'Your next medical admin may already be here.\n\nJessica — Jr. Medical Admin on MedVirtual’s public Talent Pool. Listed skills include customer service and healthcare support.\n\nRequest an interview to meet her.',
        headline: 'Request an interview with Jessica',
        description: 'Browse MedVirtual Talent Pool profiles.',
        cta: 'Learn More',
        productionNote: 'Do not say “available now” unless the public profile explicitly shows availability status beyond employment type.',
      },
      bestStatic: {
        onImageHook: 'Meet Jessica',
        onImageSupport: 'Jr. Medical Admin · Customer service · Healthcare support',
        primaryText:
          'Meet Jessica — Jr. Medical Admin on MedVirtual’s Talent Pool.\n\nHer public profile lists customer-service and healthcare support skills. If front-desk and admin work keep overflowing, introduce your team to a real person you can interview.\n\nLearn more about Jessica.',
        metaHeadline: 'Meet Jessica · Medical Admin',
        description: 'Real MedVirtual talent. Request interview.',
        cta: 'Learn More',
        format: '4:5',
        treatment: 'editorial',
      },
    },
    videoScripts: [
      {
        id: 'jessica-intro',
        spoken:
          "Hi, I'm Jessica. I help medical practices with customer service and healthcare admin support. If your team needs backup on day-to-day office work, I'd be glad to meet you.",
        openingVisual: 'Direct to camera, eye level, soft front light, plain workstation behind.',
        broll: ['Quick cut of typing', 'Headset adjustment', 'Team call over shoulder (no screens readable)'],
        captions: ['Hi, I’m Jessica', 'Medical admin support', 'Customer service · Healthcare support'],
        finalFrame: 'Jessica · Jr. Medical Admin · MedVirtual',
        estimatedDuration: '10–12 seconds',
      },
    ],
  },
  {
    id: 'angelica',
    assetSlug: 'angelica',
    firstName: 'Angelica',
    fullPublicName: 'Angelica Aljas',
    title: 'Dermatology Front Desk Assistant',
    publicPosition: 'Medical Admin Sr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/4f1447a8-6f80-4995-9ba1-5292aaa3dfd3',
    imagePath: '/assets/real-people/angelica/feed-1080x1350.jpg',
    listedSkills: ['VA - Medical General', 'BPO - Healthcare'],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Front-desk pressure statics; primary 4:5 pain-first',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs.',
      backgroundNotes: 'Neutral portrait backdrop.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      specializationShown: ['Dermatology'],
      experienceTitle: 'Dermatology Front Desk Assistant',
      approvedPosition: 'Medical Admin Sr',
      toolsShown: ['Availity', 'AdvanceMD'],
    },
    roleRelevance:
      'Front-desk experience title plus medical-admin positioning — strong fit for practices that need remote help around patient-facing office work.',
    recommendedAngles: ['Meet the person', 'Front-desk coverage', 'Ready to meet'],
    operationalPains: ['front-desk', 'patient-calls', 'admin-backlog'],
    roles: ['front-office', 'medical-admin', 'practice-coordination'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: true,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET ANGELICA',
        onImageRoleSkill: 'Dermatology Front Desk Assistant · Medical General · Healthcare',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Angelica — listed as a Dermatology Front Desk Assistant, with Medical Admin Sr as her Talent Pool position.\n\nPublic skills include medical general VA support and healthcare BPO. If your front desk needs capable remote backup, you can request an interview.\n\nLearn more.',
        metaHeadline: 'Meet Angelica · Front Desk',
        description: 'Named MedVirtual medical admin talent.',
        cta: 'Learn More',
        productionNote: 'Clean profile card. Emphasize front-desk title. Avoid inventing dermatology clinical duties she does not list.',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Front desk stretched thin?',
        onImageIntro: 'Meet Angelica · Front Desk Assistant',
        primaryText:
          'Front desk stretched thin?\n\nAngelica’s public MedVirtual profile lists her as a Dermatology Front Desk Assistant (Medical Admin Sr), with medical general and healthcare support skills.\n\nRequest an interview to see whether she fits your workflow.',
        headline: 'Front desk help? Meet Angelica',
        description: 'Real talent from MedVirtual Talent Pool.',
        cta: 'Learn More',
        productionNote: 'Pain-first layout. Photo secondary but still clear and human.',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Busy days need people, not another login.',
        onImageSupport: 'Meet Angelica · Dermatology Front Desk Assistant',
        primaryText:
          'Busy clinic days need capable people — not another login screen.\n\nAngelica is a named MedVirtual profile: Dermatology Front Desk Assistant, with listed medical general and healthcare skills.\n\nLearn more and request an interview.',
        headline: 'Meet Angelica · Medical Admin',
        description: 'Front-desk focused Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Do not bash EHRs. Position as human support alongside existing tools.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT FRONT-DESK SUPPORT MAY ALREADY BE HERE.',
        onImageSupport: 'Angelica · Front Desk Assistant · Medical General · Healthcare',
        primaryText:
          'Your next front-desk support may already be here.\n\nAngelica — Dermatology Front Desk Assistant on MedVirtual’s Talent Pool.\n\nRequest an interview to meet her.',
        headline: 'Request an interview with Angelica',
        description: 'Named front-desk medical admin talent.',
        cta: 'Learn More',
        productionNote: 'Employment type is Full Time on profile — do not add “immediately available” language.',
      },
      bestStatic: {
        onImageHook: 'Meet Angelica',
        onImageSupport: 'Front desk assistant · Medical admin support',
        primaryText:
          'Meet Angelica — Dermatology Front Desk Assistant on MedVirtual’s Talent Pool.\n\nHer profile lists medical general and healthcare support skills. When the front desk cannot cover everything at once, start with a real person your team can interview.\n\nLearn more.',
        metaHeadline: 'Meet Angelica · Front Desk',
        description: 'Real MedVirtual talent. Request interview.',
        cta: 'Learn More',
        format: '4:5',
        treatment: 'editorial',
      },
    },
    videoScripts: [
      {
        id: 'angelica-intro',
        spoken:
          "Hi, I'm Angelica. I've supported medical front-desk work, and my profile highlights medical general and healthcare support. If your practice needs help keeping the desk moving, I'm happy to introduce myself.",
        openingVisual: 'Seated at desk, headset nearby, looking at camera.',
        broll: ['Greeting gesture (no scripted smile freeze)', 'Notebook / scheduling UI blurred', 'Wide office'],
        captions: ['Hi, I’m Angelica', 'Front desk support', 'Medical admin'],
        finalFrame: 'Angelica · Front Desk Assistant · MedVirtual',
        estimatedDuration: '11–13 seconds',
      },
    ],
  },
  {
    id: 'chelsea',
    assetSlug: 'chelsea',
    firstName: 'Chelsea',
    fullPublicName: 'Chelsea Rose Santos',
    title: 'Dental Virtual Assistant',
    publicPosition: 'Dental Admin Jr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/1e2dd2c0-46d5-4ec9-af7c-917e27e356a4',
    imagePath: '/assets/real-people/chelsea/feed-1080x1350.jpg',
    listedSkills: [
      'Appointment Setting',
      'Medical - Healthcare',
      'BPO - Customer Service',
      'VA - Medical General',
      'BPO - Healthcare',
    ],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Primary first-batch pain-first scheduling creative',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs.',
      backgroundNotes: 'Neutral portrait backdrop.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      shiftBlock: 'Full Time',
      specializationShown: [
        'Dentistry',
        'Dental - Orthodontics',
        'Dental - General Dentistry',
        'DME / Durable Medical Equipment',
        'General Medicine',
      ],
      experienceTitle: 'Dental Virtual Assistant',
      approvedPosition: 'Dental Admin Jr',
    },
    roleRelevance:
      'Clear appointment-setting skill plus dental/admin positioning — strong for practices where scheduling and front-office coordination soak the team.',
    recommendedAngles: ['Operational pain · scheduling', 'Meet the person', 'Not another app'],
    operationalPains: ['scheduling', 'patient-calls', 'front-desk'],
    roles: ['patient-scheduling', 'front-office', 'medical-admin'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: true,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET CHELSEA',
        onImageRoleSkill: 'Dental Virtual Assistant · Appointment Setting · Customer Service',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Chelsea — Dental Virtual Assistant (Dental Admin Jr) on MedVirtual’s Talent Pool.\n\nListed skills include appointment setting, healthcare support, customer service, and medical general VA work.\n\nRequest an interview to meet her.',
        metaHeadline: 'Meet Chelsea · Scheduling',
        description: 'Named talent with appointment-setting skills.',
        cta: 'Learn More',
        productionNote: 'Lead with Appointment Setting in the skill line. Prefer “Chelsea” on-image (public first name includes Rose).',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Scheduling taking over the front desk?',
        onImageIntro: 'Meet Chelsea · Appointment Setting',
        primaryText:
          'Scheduling taking over the front desk?\n\nChelsea is a Dental Virtual Assistant on MedVirtual’s Talent Pool. Her listed skills include appointment setting, customer service, and healthcare support.\n\nLearn more and request an interview — no claim that she already works with your clinic.',
        headline: 'Scheduling backlog? Meet Chelsea',
        description: 'Appointment-setting focused Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Best pain-first test candidate. Keep pain line ≤8 words.',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Scheduling shouldn’t require another tool.',
        onImageSupport: 'It needs capable support. Meet Chelsea · Dental VA',
        primaryText:
          'Scheduling shouldn’t require another tool battle. It needs capable support.\n\nChelsea’s public skills include appointment setting and customer service. Meet a real MedVirtual profile — then request an interview.',
        headline: 'Meet Chelsea · Appointment Setting',
        description: 'Human scheduling support — named talent.',
        cta: 'Learn More',
        productionNote: 'Do not promise calendar software migration.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT SCHEDULING SUPPORT MAY ALREADY BE HERE.',
        onImageSupport: 'Chelsea · Dental VA · Appointment Setting · Customer Service',
        primaryText:
          'Your next scheduling support may already be here.\n\nChelsea — Dental Virtual Assistant with appointment setting listed on her MedVirtual profile.\n\nRequest an interview.',
        headline: 'Request an interview with Chelsea',
        description: 'Named MedVirtual dental admin talent.',
        cta: 'Learn More',
        productionNote: 'Avoid “hire instantly” claims not shown on profile.',
      },
      bestStatic: {
        onImageHook: 'Scheduling taking over?',
        onImageSupport: 'Meet Chelsea · Appointment setting · Dental VA',
        primaryText:
          'Scheduling taking over the front desk?\n\nMeet Chelsea — Dental Virtual Assistant on MedVirtual’s Talent Pool. Her listed skills include appointment setting, customer service, and healthcare support.\n\nRequest an interview to see if she fits.',
        metaHeadline: 'Meet Chelsea · Scheduling Help',
        description: 'Real talent. Appointment-setting skills listed.',
        cta: 'Learn More',
        format: '4:5',
        treatment: 'pain-first',
      },
    },
    videoScripts: [
      {
        id: 'chelsea-intro',
        spoken:
          "Hi, I'm Chelsea. If your team needs help with appointment setting, customer service, or day-to-day healthcare admin support, that's the kind of work my profile is built around.",
        openingVisual: 'Standing or seated, calm, natural pace — not corporate teleprompter energy.',
        broll: ['Calendar UI blurred', 'Phone check-in motion', 'Typing'],
        captions: ['Hi, I’m Chelsea', 'Appointment setting', 'Customer service · Healthcare support'],
        finalFrame: 'Chelsea · Dental Virtual Assistant · MedVirtual',
        estimatedDuration: '12–14 seconds',
      },
    ],
  },
  {
    id: 'mark',
    assetSlug: 'mark',
    firstName: 'Mark',
    fullPublicName: 'Mark Robert Seno',
    title: 'Insurance Verification Specialist',
    publicPosition: 'Medical Biller Sr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/592dfa05-7ce9-4a3f-bccc-3c7307451aa8',
    imagePath: '/assets/real-people/mark/feed-1080x1350.jpg',
    listedSkills: ['VA - Medical Biller'],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Insurance verification pain-first statics',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs.',
      backgroundNotes: 'Neutral portrait backdrop.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      shiftBlock: 'Full Time',
      specializationShown: ['Psychiatry'],
      experienceTitle: 'Insurance Verification Specialist (Mental & Behavioral)',
      approvedPosition: 'Medical Biller Sr',
      medicalToolsShown: ['ECW'],
    },
    roleRelevance:
      'Insurance verification experience title is directly relevant to practices slowed by eligibility checks — pair with medical-biller skill tag without inventing extra certifications.',
    recommendedAngles: ['Operational pain · insurance', 'Meet the person', 'Ready to meet'],
    operationalPains: ['insurance-verification', 'billing-support'],
    roles: ['insurance-verification', 'billing-support'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: true,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET MARK',
        onImageRoleSkill: 'Insurance Verification Specialist · Medical Biller',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Mark — Insurance Verification Specialist on MedVirtual’s Talent Pool (Medical Biller Sr position).\n\nHis listed skill tag includes medical billing VA work. If eligibility checks slow your day, start by meeting a real person.\n\nLearn more and request an interview.',
        metaHeadline: 'Meet Mark · Insurance Verify',
        description: 'Named insurance verification talent.',
        cta: 'Learn More',
        productionNote: 'Use first name Mark on-image. Do not invent years of experience (profile shows 0). Do not claim HIPAA certification.',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Insurance verification slowing the day?',
        onImageIntro: 'Meet Mark · Insurance Verification',
        primaryText:
          'Insurance verification slowing the day?\n\nMark’s public MedVirtual title is Insurance Verification Specialist, with a medical biller skill listed. This creative introduces him as someone your practice can interview — not a claim that he already supports your clinic.\n\nLearn more.',
        headline: 'Verification backlog? Meet Mark',
        description: 'Insurance verification focused Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Strong second pain-first creative after Chelsea.',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Eligibility work needs people too.',
        onImageSupport: 'Meet Mark · Insurance Verification Specialist',
        primaryText:
          'Eligibility work needs people too — not only another portal.\n\nMeet Mark, listed as an Insurance Verification Specialist on MedVirtual’s Talent Pool.\n\nRequest an interview to learn more.',
        headline: 'Meet Mark · Insurance Support',
        description: 'Named MedVirtual billing / verification talent.',
        cta: 'Learn More',
        productionNote: 'Do not promise faster claim outcomes or denial-rate improvements.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT VERIFICATION SUPPORT MAY ALREADY BE HERE.',
        onImageSupport: 'Mark · Insurance Verification · Medical Biller',
        primaryText:
          'Your next verification support may already be here.\n\nMark — Insurance Verification Specialist on MedVirtual’s public Talent Pool.\n\nRequest an interview.',
        headline: 'Request an interview with Mark',
        description: 'Real MedVirtual Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Keep claims limited to title + listed skill.',
      },
      bestStatic: {
        onImageHook: 'Verification slowing you down?',
        onImageSupport: 'Meet Mark · Insurance verification',
        primaryText:
          'Insurance verification slowing the day?\n\nMeet Mark — Insurance Verification Specialist on MedVirtual’s Talent Pool. His profile lists medical biller VA skills.\n\nRequest an interview to see if he fits your practice.',
        metaHeadline: 'Meet Mark · Verification Help',
        description: 'Named talent. Insurance verification focus.',
        cta: 'Learn More',
        format: '1:1',
        treatment: 'pain-first',
      },
    },
    videoScripts: [
      {
        id: 'mark-intro',
        spoken:
          "Hi, I'm Mark. I support insurance verification work for medical practices, and my profile also lists medical billing VA skills. If eligibility checks are weighing on your team, I'd welcome a conversation.",
        openingVisual: 'Direct to camera at desk; clean background.',
        broll: ['Scrolling blurred eligibility UI (fake/demo only)', 'Typing', 'Notes pad'],
        captions: ['Hi, I’m Mark', 'Insurance verification', 'Medical billing support'],
        finalFrame: 'Mark · Insurance Verification · MedVirtual',
        estimatedDuration: '12–14 seconds',
      },
    ],
  },
  {
    id: 'carmen',
    assetSlug: 'carmen',
    firstName: 'Carmen',
    fullPublicName: 'Carmen De Leon',
    title: 'Medical Biller',
    publicPosition: 'Medical Biller Sr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/6b08ff4a-33c7-496e-94f2-f11026c4079b',
    imagePath: '/assets/real-people/carmen/feed-1080x1350.jpg',
    listedSkills: ['BPO - Customer Service', 'VA - Medical Biller', 'VA - Medical General'],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Billing support static / video alternate',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs.',
      backgroundNotes: 'Neutral portrait backdrop.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      shiftBlock: 'Full Time',
      specializationShown: ['Neurology', 'Mental Health', 'Behavioral Health'],
      experienceTitle: 'Medical Biller',
      approvedPosition: 'Medical Biller Sr',
      toolsShown: ['Microsoft Office', 'Excel', 'Gmail', 'Google Workplace'],
      medicalToolsShown: ['AdvanceMD'],
    },
    roleRelevance:
      'Clear medical biller title with three practical listed skills — strong billing-support angle without inventing collections metrics.',
    recommendedAngles: ['Meet the person', 'Billing follow-up pain', 'Ready to meet'],
    operationalPains: ['billing-support', 'admin-backlog'],
    roles: ['billing-support', 'medical-admin'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: true,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET CARMEN',
        onImageRoleSkill: 'Medical Biller · Customer Service · Medical General',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Carmen — Medical Biller (Medical Biller Sr) on MedVirtual’s Talent Pool.\n\nListed skills: customer service, medical biller VA, and medical general VA support.\n\nRequest an interview to meet her.',
        metaHeadline: 'Meet Carmen · Medical Biller',
        description: 'Named MedVirtual billing talent.',
        cta: 'Learn More',
        productionNote: 'Do not claim revenue lift, clean claim rates, or A/R days improved.',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Billing follow-up falling behind?',
        onImageIntro: 'Meet Carmen · Medical Biller',
        primaryText:
          'Billing follow-up falling behind?\n\nCarmen is listed as a Medical Biller on MedVirtual’s Talent Pool, with customer-service and medical biller skills shown publicly.\n\nLearn more and request an interview.',
        headline: 'Billing backlog? Meet Carmen',
        description: 'Real medical biller profile.',
        cta: 'Learn More',
        productionNote: 'Pain line concrete. No “supercharge revenue.”',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Billing queues need capacity.',
        onImageSupport: 'Meet Carmen · Medical Biller Sr',
        primaryText:
          'Billing queues need capacity — not only another dashboard.\n\nMeet Carmen, a Medical Biller on MedVirtual’s public Talent Pool.\n\nRequest an interview.',
        headline: 'Meet Carmen · Billing Support',
        description: 'Named Talent Pool medical biller.',
        cta: 'Learn More',
        productionNote: 'Keep respectful of billing software already in place.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT BILLING SUPPORT MAY ALREADY BE HERE.',
        onImageSupport: 'Carmen · Medical Biller · Customer Service · Medical General',
        primaryText:
          'Your next billing support may already be here.\n\nCarmen — Medical Biller on MedVirtual’s Talent Pool.\n\nRequest an interview to meet her.',
        headline: 'Request an interview with Carmen',
        description: 'Real MedVirtual billing talent.',
        cta: 'Learn More',
        productionNote: 'Full Time employment shown — still avoid “available immediately” unless UI says so.',
      },
      bestStatic: {
        onImageHook: 'Meet Carmen',
        onImageSupport: 'Medical Biller · Customer service · Billing support',
        primaryText:
          'Meet Carmen — Medical Biller on MedVirtual’s Talent Pool.\n\nHer listed skills include customer service, medical biller VA work, and medical general support. If billing follow-up keeps slipping, start with a named person your team can interview.\n\nLearn more.',
        metaHeadline: 'Meet Carmen · Medical Biller',
        description: 'Real MedVirtual talent. Request interview.',
        cta: 'Learn More',
        format: '4:5',
        treatment: 'editorial',
      },
    },
    videoScripts: [
      {
        id: 'carmen-intro',
        spoken:
          "Hi, I'm Carmen. I help with medical billing support, customer service, and general medical VA work. If your practice needs help keeping billing tasks moving, I'd like to meet your team.",
        openingVisual: 'Direct to camera; quiet room.',
        broll: ['Typing', 'Spreadsheet UI fully anonymized', 'Headset on'],
        captions: ['Hi, I’m Carmen', 'Medical billing support', 'Customer service'],
        finalFrame: 'Carmen · Medical Biller · MedVirtual',
        estimatedDuration: '11–13 seconds',
      },
    ],
  },
  {
    id: 'jennifer',
    assetSlug: 'jennifer',
    firstName: 'Jennifer',
    fullPublicName: 'Jennifer Villarubia',
    title: 'Patient Intake Coordinator',
    publicPosition: 'Medical Admin Jr',
    profileUrl: 'https://app.medvirtual.ai/talent-pool/f72257a8-15ce-4a6f-92d7-f05a637bd741',
    imagePath: '/assets/real-people/jennifer/feed-1080x1350.jpg',
    listedSkills: [],
    approvalStatus: {
      publicStillApproved: true,
      staticAdApproved: false,
      syntheticAnimationApprovalNeeded: true,
      realVideoRequested: false,
      finalCreativeApproved: false,
    },
    assetNotes: {
      recommendedUsage: 'Intake alternate; limited skill tags on public profile',
      cropQuality: 'Public avatar source is 1024×1024. Mild resize to 1080 outputs.',
      backgroundNotes: 'Neutral portrait backdrop.',
      faceVisibility: 'Face clear, eyes and mouth visible',
      shouldersVisible: true,
      aiSpeakingSuitable: true,
    },
    exactPublicFacts: {
      employmentType: 'Full Time',
      shiftBlock: 'Full Time',
      specializationShown: ['Wound Care', 'Assisted Living / Home Care Services'],
      experienceTitle: 'Patient Intake Coordinator',
      approvedPosition: 'Medical Admin Jr',
      toolsShown: ['Google Workplace', 'Microsoft Office', 'Ring Central'],
      medicalToolsShown: ['AdvanceMD'],
      note: 'Public skills array empty at source-check; rely on experience title + visible tools/specializations only as facts.',
    },
    roleRelevance:
      'Patient Intake Coordinator title is highly relevant for practices drowning in new-patient paperwork and intake calls — creative must not invent skill tags she does not list.',
    recommendedAngles: ['Meet the person', 'Intake pain', 'Ready to meet'],
    operationalPains: ['patient-intake', 'admin-backlog', 'patient-calls'],
    roles: ['patient-intake', 'medical-admin', 'front-office'],
    formats: ['static-1x1', 'static-4x5', 'story-9x16', 'reel', 'iphone-video'],
    recommendedFirstBatch: false,
    sourceCheckedAt: SOURCE_CHECKED_AT,
    staticConcepts: {
      A: {
        label: 'Meet the person',
        onImageHeadline: 'MEET JENNIFER',
        onImageRoleSkill: 'Patient Intake Coordinator · Medical Admin Jr',
        supportingHook: 'Real support for a busy medical practice.',
        primaryText:
          'Meet Jennifer — Patient Intake Coordinator on MedVirtual’s Talent Pool (Medical Admin Jr position).\n\nHer public profile does not list separate skill tags; the role title itself is the fact to lead with.\n\nRequest an interview to learn more about fit.',
        metaHeadline: 'Meet Jennifer · Patient Intake',
        description: 'Named Talent Pool intake coordinator.',
        cta: 'Learn More',
        productionNote: 'Do not fabricate 3–5 skill chips. Use role title only, or label any specialization chips as specialties — not invented skills.',
      },
      B: {
        label: 'Operational pain',
        painImageCopy: 'Intake forms slowing new patients?',
        onImageIntro: 'Meet Jennifer · Patient Intake Coordinator',
        primaryText:
          'Intake forms slowing new patients?\n\nJennifer’s public MedVirtual experience title is Patient Intake Coordinator. We are not inventing extra skills beyond what the profile shows.\n\nRequest an interview to meet her.',
        headline: 'Intake backlog? Meet Jennifer',
        description: 'Patient intake focused Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Honesty about limited skill tags is a feature for internal docs; external ads simply omit invented chips.',
      },
      C: {
        label: 'Not another app',
        onImageHeadline: 'Intake still needs a person.',
        onImageSupport: 'Meet Jennifer · Patient Intake Coordinator',
        primaryText:
          'Intake still needs a person in the loop.\n\nMeet Jennifer — Patient Intake Coordinator on MedVirtual’s Talent Pool.\n\nLearn more and request an interview.',
        headline: 'Meet Jennifer · Intake Support',
        description: 'Named MedVirtual medical admin talent.',
        cta: 'Learn More',
        productionNote: 'No guarantee she will handle a specific EMR workflow.',
      },
      D: {
        label: 'Ready to meet',
        onImageHeadline: 'YOUR NEXT INTAKE SUPPORT MAY ALREADY BE HERE.',
        onImageSupport: 'Jennifer · Patient Intake Coordinator · Medical Admin Jr',
        primaryText:
          'Your next intake support may already be here.\n\nJennifer — Patient Intake Coordinator on MedVirtual’s public Talent Pool.\n\nRequest an interview.',
        headline: 'Request an interview with Jennifer',
        description: 'Real MedVirtual Talent Pool profile.',
        cta: 'Learn More',
        productionNote: 'Specialize chips only if design labels them as specialties shown on profile.',
      },
      bestStatic: {
        onImageHook: 'Meet Jennifer',
        onImageSupport: 'Patient Intake Coordinator · Medical Admin Jr',
        primaryText:
          'Meet Jennifer — Patient Intake Coordinator on MedVirtual’s Talent Pool.\n\nIf new-patient intake keeps spilling onto your front desk, introduce your team to a real named profile and request an interview.\n\nLearn more.',
        metaHeadline: 'Meet Jennifer · Patient Intake',
        description: 'Real MedVirtual talent. Request interview.',
        cta: 'Learn More',
        format: '9:16',
        treatment: 'editorial',
      },
    },
    videoScripts: [
      {
        id: 'jennifer-intro',
        spoken:
          "Hi, I'm Jennifer. I support patient intake coordination for medical practices. If your team needs help keeping new-patient intake organized, I'd be glad to meet you.",
        openingVisual: 'Direct to camera; no PHI paperwork readable.',
        broll: ['Clipboard with blank/demo forms', 'Typing', 'Phone on silent nearby'],
        captions: ['Hi, I’m Jennifer', 'Patient intake coordination', 'Medical admin support'],
        finalFrame: 'Jennifer · Patient Intake Coordinator · MedVirtual',
        estimatedDuration: '10–12 seconds',
      },
    ],
  },
];

export const STRONGEST_FOUR = [
  {
    id: 'chelsea-pain-scheduling',
    talentId: 'chelsea',
    name: 'Chelsea · Scheduling pain → named person',
    why: 'Clearest operational skill tag (Appointment Setting) + acute clinic pain. Best pain-first static.',
  },
  {
    id: 'jessica-admin',
    talentId: 'jessica',
    name: 'Jessica · Admin work piling up',
    why: 'Simple medical-admin pain + named person; easy first Treatment C static.',
  },
  {
    id: 'mark-verification',
    talentId: 'mark',
    name: 'Mark · Insurance verification',
    why: 'Specific revenue-cycle pain with a literal public experience title.',
  },
  {
    id: 'angelica-frontdesk',
    talentId: 'angelica',
    name: 'Angelica · Front desk stretched thin',
    why: 'Front-desk experience title reads immediately for practice owners scanning the feed.',
  },
];

/** Treatment C — Pain + Person + Capabilities (first production batch only) */
export const TREATMENT_C = [
  {
    talentId: 'chelsea',
    headlineLines: ['SCHEDULING TAKING OVER', 'YOUR FRONT DESK?'],
    meetLine: 'Meet Chelsea',
    role: 'Dental Virtual Assistant',
    bullets: [
      { text: 'Appointment Setting', source: 'listed skill' },
      { text: 'Customer Service', source: 'listed skill' },
      { text: 'Healthcare Support', source: 'listed skill' },
    ],
    ctaStrip: 'REQUEST AN INTERVIEW →',
    primaryRatio: '4x5',
  },
  {
    talentId: 'mark',
    headlineLines: ['INSURANCE VERIFICATION', 'SLOWING YOUR TEAM DOWN?'],
    meetLine: 'Meet Mark',
    role: 'Insurance Verification Specialist',
    bullets: [
      { text: 'Insurance Verification', source: 'public experience title' },
      { text: 'Medical Billing Support', source: 'listed skill' },
      { text: 'Full-Time Talent', source: 'employment type shown on profile' },
    ],
    ctaStrip: 'REQUEST AN INTERVIEW →',
    primaryRatio: '4x5',
  },
  {
    talentId: 'angelica',
    headlineLines: ['FRONT DESK', 'STRETCHED THIN?'],
    meetLine: 'Meet Angelica',
    role: 'Dermatology Front Desk Assistant',
    bullets: [
      { text: 'Medical Admin Support', source: 'listed skill / public position' },
      { text: 'Healthcare Support', source: 'listed skill' },
      { text: 'Front-Desk Experience', source: 'public experience title' },
    ],
    ctaStrip: 'REQUEST AN INTERVIEW →',
    primaryRatio: '4x5',
  },
  {
    talentId: 'jessica',
    headlineLines: ['ADMIN WORK', 'PILING UP?'],
    meetLine: 'Meet Jessica',
    role: 'Jr. Medical Admin',
    bullets: [
      { text: 'Customer Service', source: 'listed skill' },
      { text: 'Healthcare Support', source: 'listed skill' },
      { text: 'Full-Time Talent', source: 'employment type shown on profile' },
    ],
    ctaStrip: 'REQUEST AN INTERVIEW →',
    primaryRatio: '4x5',
  },
];

/** Monday graphics request — first batch only (4 ads) */
export const MONDAY_REAL_PEOPLE_BATCH = [
  { talentId: 'chelsea', angle: '4:5 pain-first · scheduling', treatmentC: true },
  { talentId: 'mark', angle: '4:5 pain-first · insurance verification', treatmentC: true },
  { talentId: 'jessica', angle: '4:5 pain-first · admin backlog', treatmentC: true },
  { talentId: 'angelica', angle: '4:5 pain-first · front desk', treatmentC: true },
];

export const SYNTHETIC_VIDEO_HANDOFF = [
  'Use only approved Talent Pool images',
  'Do not change the person’s identity',
  'Do not invent credentials or experience',
  'Do not clone or imitate a person’s voice without approval',
  'Do not create dialogue implying the person personally performed unverified work',
  'Scripts must remain limited to public profile facts',
  'Label synthetic drafts internally',
  'Obtain explicit internal approval before publishing',
  'Prefer real direct-to-camera footage when available',
  'Never show patient information, real medical records, or confidential systems',
  'Keep original source files archived separately',
  'Still-image approval does NOT auto-approve synthetic animation',
];

export function talentById(id) {
  return TALENT.find((t) => t.id === id);
}

export function treatmentCPackage(tc) {
  const t = talentById(tc.talentId);
  return [
    `TREATMENT C — Pain + Person + Capabilities`,
    `PROFILE: ${t.fullPublicName}`,
    `SOURCE: ${t.profileUrl}`,
    `CANVAS: 1080×1350 (primary) · also 1:1 and 9:16`,
    '',
    `ON-IMAGE HEADLINE:`,
    tc.headlineLines.join('\n'),
    '',
    `NAME: ${tc.meetLine}`,
    `ROLE: ${tc.role}`,
    '',
    `BULLETS:`,
    ...tc.bullets.map((b) => `✓ ${b.text}  [${b.source}]`),
    '',
    `CTA STRIP: ${tc.ctaStrip}`,
    `LOGO: MedVirtual — larger mark in high-contrast brand panel (not tiny corner watermark)`,
    '',
    `CLAIM RESTRICTIONS:`,
    `- Do not invent HIPAA, years of experience, software expertise, availability, or outcomes`,
    `- Bullets must match listed sources above`,
    `- No fake Meta CTA button inside artwork — branded strip only`,
  ].join('\n');
}
