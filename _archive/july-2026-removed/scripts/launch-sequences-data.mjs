/**
 * Launch sequences — live as sections on Real People (not separate nav pages).
 * Old /meta-launch-1.html and /meta-launch-2.html redirect here.
 */
export const LAUNCHES = [
  {
    id: '1',
    navId: 'real-people',
    href: '/real-people-creative.html#ready',
    legacyHref: '/meta-launch-build-pack.html',
    label: 'Ready to load',
    title: 'Ready to load · 4 feed ads',
    status: 'active',
    forGraphics:
      'These 4 Hailey / Role-Offer Meet feed ads (1080×1350) are the live look. Finalize / upload. Pain stays in Meta copy.',
    concept: 'Treatment E — Hailey / Role-Offer Meet',
    people: ['Jessica', 'Chelsea', 'Angelica', 'Mark'],
    ratios: ['4:5 primary'],
  },
  {
    id: '2',
    navId: 'real-people',
    href: '/real-people-creative.html#next',
    label: 'Next up',
    title: 'Next up · expand + Stories',
    status: 'next',
    forGraphics:
      'After Ready ships: Carmen + Jennifer 4:5, then Jessica + Chelsea 9:16. Same Hailey DNA as today’s launch.',
    concept: 'Treatment E — Hailey / Role-Offer Meet',
    people: ['Carmen', 'Jennifer', 'Jessica 9:16', 'Chelsea 9:16'],
    ratios: ['4:5', '9:16'],
  },
];

/** In-page jump links on Real People */
export const LAUNCH_SUBNAV = [
  { href: '/real-people-creative.html#ready', label: 'Ready' },
  { href: '/real-people-creative.html#next', label: 'Next' },
  { href: '/real-people-creative.html#downloads', label: 'Downloads' },
];

export const LAUNCH_1_CARDS = [
  {
    talentId: 'jessica',
    file: 'IMB_MV_RP_Static_01_JessicaAdmin_1080x1350.png',
    preview: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'chelsea',
    file: 'IMB_MV_RP_Static_02_ChelseaScheduling_1080x1350.png',
    preview: '/assets/real-people/chelsea/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'angelica',
    file: 'IMB_MV_RP_Static_03_AngelicaFrontDesk_1080x1350.png',
    preview: '/assets/real-people/angelica/ad-treatment-e-4x5.png',
  },
  {
    talentId: 'mark',
    file: 'IMB_MV_RP_Static_04_MarkVerification_1080x1350.png',
    preview: '/assets/real-people/mark/ad-treatment-e-4x5.png',
  },
];

export const LAUNCH_2_ITEMS = [
  {
    title: 'Meet Carmen · 4:5',
    talentId: 'carmen',
    ratio: '1080×1350',
    onImage: 'Hire a Virtual · Meet Carmen · role pill · public skills · REQUEST AN INTERVIEW',
    source: '/assets/real-people/carmen/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
    note: 'New Hailey / Role-Offer Meet feed ad. Carmen Talent Pool title + public skills only.',
  },
  {
    title: 'Meet Jennifer · 4:5',
    talentId: 'jennifer',
    ratio: '1080×1350',
    onImage: 'Hire a Virtual · Meet Jennifer · role pill · public skills · REQUEST AN INTERVIEW',
    source: '/assets/real-people/jennifer/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-4x5.png',
    note: 'New Hailey / Role-Offer Meet feed ad. Jennifer Talent Pool title only — no invented skills.',
  },
  {
    title: 'Jessica · 9:16 Stories resize',
    talentId: 'jessica',
    ratio: '1080×1920',
    onImage: 'Same Jessica Hailey Meet card → tall crop',
    source: '/assets/real-people/jessica/clean-master.jpg',
    ref: '/assets/real-people/jessica/ad-treatment-e-9x16.png',
    note: 'Resize only. Keep Meet + role pill + checks + CTA + logo. Stories safe margins.',
  },
  {
    title: 'Chelsea · 9:16 Stories resize',
    talentId: 'chelsea',
    ratio: '1080×1920',
    onImage: 'Same Chelsea Hailey Meet card → tall crop',
    source: '/assets/real-people/chelsea/clean-master.jpg',
    ref: '/assets/real-people/chelsea/ad-treatment-e-9x16.png',
    note: 'Resize only. Same DNA as Jessica Stories.',
  },
];

export function launchById(id) {
  return LAUNCHES.find((l) => l.id === String(id));
}
