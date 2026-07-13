/**
 * Launch sequences — graphics-facing batches (what to design), not strategy dumps.
 * Add a new launch object here when production opens the next Meta sequence.
 */
export const LAUNCHES = [
  {
    id: '1',
    navId: 'launch-1',
    href: '/meta-launch-1.html',
    legacyHref: '/meta-launch-build-pack.html',
    label: 'Launch 1',
    title: 'Launch 1 · Real People (4 feed ads)',
    status: 'active',
    forGraphics:
      'Design / finalize these 4 Studio Profile feed ads (1080×1350). Pain stays in Meta copy — not on the image.',
    concept: 'Treatment E — Studio Profile',
    people: ['Jessica', 'Chelsea', 'Angelica', 'Mark'],
    ratios: ['4:5 primary'],
  },
  {
    id: '2',
    navId: 'launch-2',
    href: '/meta-launch-2.html',
    label: 'Launch 2',
    title: 'Launch 2 · Expand + Stories',
    status: 'next',
    forGraphics:
      'Next graphics batch after Launch 1 ships: Carmen + Jennifer 4:5, then Jessica + Chelsea 9:16 Stories resizes.',
    concept: 'Treatment E — Studio Profile',
    people: ['Carmen', 'Jennifer', 'Jessica 9:16', 'Chelsea 9:16'],
    ratios: ['4:5', '9:16'],
  },
];

export const LAUNCH_SUBNAV = LAUNCHES.map((l) => ({
  href: l.href,
  label: l.label,
}));

export function launchById(id) {
  return LAUNCHES.find((l) => l.id === String(id));
}
