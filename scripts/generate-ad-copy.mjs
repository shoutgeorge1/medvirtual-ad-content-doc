/**
 * Facebook primary-text board — best angles × 25 variations each.
 * Follows Meta feed best practices:
 * - First ~125 chars = the ad (mobile truncates; ~1% tap See more)
 * - Hook / outcome / offer in line 1
 * - One CTA only (form-fill)
 * - Site-aligned claims only · light emoji · practice-ops POV
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_CSS, renderDocHeader } from './shared-doc-header.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const FEED_VISIBLE = 125;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function firstLine(text) {
  return text.split(/\n/)[0] || '';
}

function visiblePreview(text) {
  if (text.length <= FEED_VISIBLE) return text;
  return text.slice(0, FEED_VISIBLE);
}

/** Site-aligned facts (from medvirtual.ai) — use only verified claims */
const SITE = {
  rate: 'Starting at $10/hour',
  monthly: '$1,760/mo full-time',
  trust: 'Trusted by 250+ healthcare practices',
  badges: 'HIPAA-trained · Pre-vetted · Ready in days',
  cta: 'Book a demo',
  ctaAlt: 'Talk to our team',
};

/**
 * 5 best angle families × 25 primary texts.
 * Structure: HOOK (stands alone in ~125 chars) → proof/detail → one CTA.
 * Mix of feed-safe shorts (≤125) and expandable longs with a strong first line.
 */
const ANGLES = [
  {
    id: 'full_time',
    title: 'Full-time coverage · Team of four, price of one',
    pairsWith: 'T1-MC / T2-RMA · strongest cold hooks',
    siteAlign: 'Full-time dedicated medical staff · Starting at $10/hr',
    texts: [
      `Team of four, price of one — full-time medical virtual assistants.\n\n${SITE.badges}\n${SITE.rate}\n\n${SITE.cta} →`,
      `Full-time medical virtual assistants — without another in-office hire.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Get full-time medical admin support starting at $10/hour.\n\nHIPAA-trained. Pre-vetted. Ready in days.\n\n${SITE.cta} →`,
      `Your practice deserves full-time backup — not another stretched hire.\n\nRemote medical virtual assistants.\n\n${SITE.cta} →`,
      `Full-time dedicated medical staff for your practice — remote.\n\n${SITE.monthly}\n${SITE.badges}\n\n${SITE.cta} →`,
      `Stop stretching your front desk thinner. Add full-time VA support.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Team of four. Price of one.\n\nFull-time medical virtual assistants for calls, scheduling, and admin.\n\n${SITE.cta} →`,
      `Need full-time coverage without full-time overhead?\n\nMedVirtual — ${SITE.rate.toLowerCase()}.\n\n${SITE.ctaAlt} →`,
      `Build capacity — not payroll bloat.\n\nFull-time remote medical admin for US healthcare practices.\n\n${SITE.cta} →`,
      `✅ Full-time medical VAs · HIPAA-trained · Ready in days\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Keep the practice running at full capacity with remote medical VAs.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `What if full-time help didn’t mean another in-office hire?\n\nMedVirtual medical virtual assistants.\n\n${SITE.ctaAlt} →`,
      `Dedicated. Full-time. Remote. Starting at $10/hour.\n\nMedical virtual assistants for healthcare practices.\n\n${SITE.cta} →`,
      `More coverage. Less overhead. Full-time medical virtual assistants.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Full-time medical admin help — without the hire headache.\n\nReady in days.\n\n${SITE.cta} →`,
      `Scale your team without scaling your office footprint.\n\nFull-time medical virtual assistants.\n\n${SITE.cta} →`,
      `📞 Calls · 📅 Scheduling · 📋 Admin — covered full-time.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `The backup your front desk has been asking for.\n\nFull-time medical VAs — starting at $10/hour.\n\n${SITE.cta} →`,
      `${SITE.trust}.\n\nFull-time medical virtual assistants — ${SITE.rate.toLowerCase()}.\n\n${SITE.cta} →`,
      `Team of four, price of one.\n\nSee how MedVirtual supports practices with full-time medical VAs.\n\n${SITE.cta} →`,
      `Full-time medical virtual assistants for busy practices.\n\n${SITE.badges}\n${SITE.rate}\n\n${SITE.cta} →`,
      `One full-time dedicated medical staff member — remote & ready.\n\n${SITE.monthly}\n\n${SITE.cta} →`,
      `Patients expect answers. Your team needs full-time backup.\n\nStarting at $10/hour.\n\n${SITE.cta} →`,
      `Full-time support for calls, intake, follow-up, and admin.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Practices choose MedVirtual for full-time medical VA support.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
    ],
  },
  {
    id: 'missed_calls',
    title: 'Missed calls · Answer more patient calls',
    pairsWith: 'T1-MC · AI_003',
    siteAlign: 'Front-office / admin support · patient communication',
    texts: [
      `Missing calls = missing patients. Get phone & scheduling backup.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Patient calls shouldn’t die in voicemail.\n\nRemote medical admin support for busy practices.\n\n${SITE.cta} →`,
      `Every missed call is a patient who may not call back.\n\nGet front-desk backup with MedVirtual.\n\n${SITE.ctaAlt} →`,
      `Answer more patient calls — without another in-office hire.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Voicemail is not a growth strategy.\n\nFull-time medical VA support — starting at $10/hour.\n\n${SITE.cta} →`,
      `When the phones won’t stop, your team needs backup.\n\nHIPAA-trained medical virtual assistants.\n\n${SITE.cta} →`,
      `Your front desk can’t be everywhere at once.\n\nRemote VAs for calls and scheduling.\n\n${SITE.cta} →`,
      `📞 Patient calls deserve a real answer — not a full mailbox.\n\nReady in days.\n\n${SITE.cta} →`,
      `Stop losing new patients to unanswered rings.\n\nRemote medical admin for US practices.\n\n${SITE.cta} →`,
      `More rings answered. Less front-desk burnout.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `If phones are busier than your schedule, you need backup.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Help your team answer more patient calls — consistently.\n\nHIPAA-trained medical VAs.\n\n${SITE.cta} →`,
      `Don’t let voicemail become your front desk.\n\nRemote medical VAs — starting at $10/hour.\n\n${SITE.cta} →`,
      `Missed calls cost more than you think.\n\nAdd remote medical admin support.\n\n${SITE.cta} →`,
      `When hold times climb, patients leave.\n\nFull-time medical VA coverage can help.\n\n${SITE.cta} →`,
      `Support for the busiest line in the office — the phone.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Patient access starts with someone picking up.\n\nMedVirtual for calls & scheduling.\n\n${SITE.cta} →`,
      `Fewer missed calls. More booked appointments.\n\nTalk to our team about full-time medical VA support →`,
      `Keep patients from hanging up — add remote phone support.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Busy phones. Short staff. Same story every week?\n\nAdd full-time remote medical admin.\n\n${SITE.cta} →`,
      `Answer the call. Book the visit. Keep the day moving.\n\nMedical VAs for busy practices.\n\n${SITE.cta} →`,
      `Give every patient call a better chance of getting through.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
      `Calls. Scheduling. Follow-up — so fewer patients slip away.\n\n${SITE.cta} →`,
      `Your patients are calling. Is someone there?\n\nFull-time medical VAs for practice ops.\n\n${SITE.ctaAlt} →`,
      `Front-desk phones shouldn’t run the practice into the ground.\n\nBackup from $10/hour.\n\n${SITE.cta} →`,
    ],
  },
  {
    id: 'front_desk',
    title: 'Front desk overload · Give your team backup',
    pairsWith: 'T1-FD / T1-FD2 · AI_010 / AI_015',
    siteAlign: 'Medical admin · intake · scheduling · EMR support',
    texts: [
      `Front desk overloaded? Add full-time medical VA backup.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Give your front desk backup — calls, intake, everyday admin.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Your front desk shouldn’t carry the whole practice alone.\n\nRemote medical admin support.\n\n${SITE.ctaAlt} →`,
      `Stop asking one person to do five jobs.\n\nMedVirtual medical virtual assistants.\n\n${SITE.cta} →`,
      `Intake. Phones. Scheduling. Follow-up — get expert VA help.\n\n${SITE.cta} →`,
      `Relieve front-desk pressure starting at $10/hour.\n\nHIPAA-trained medical virtual assistants.\n\n${SITE.cta} →`,
      `When the waiting room and the phone both need you — get backup.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Your team is great — they’re just outnumbered.\n\nAdd full-time medical VA coverage.\n\n${SITE.cta} →`,
      `✅ Calls · ✅ Intake · ✅ Scheduling support\n\nRemote medical VAs for busy offices.\n\n${SITE.cta} →`,
      `Don’t wait until someone burns out to add help.\n\nRemote medical admin — ready in days.\n\n${SITE.cta} →`,
      `Give your front desk a teammate — remote, trained, ready.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Less chaos at the desk. More consistency for patients.\n\nMedical VAs for practice operations.\n\n${SITE.cta} →`,
      `Overloaded mornings. Overflowing inboxes. Same every week?\n\nFull-time medical VAs can help.\n\n${SITE.cta} →`,
      `Backup for the people who keep your schedule alive.\n\nHIPAA-trained medical VAs.\n\n${SITE.cta} →`,
      `Front desk running on fumes? Support from $10/hour.\n\n${SITE.cta} →`,
      `Help your team protect the patient experience — at the desk.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `More hands for the work patients notice first.\n\nFull-time medical virtual assistants.\n\n${SITE.cta} →`,
      `Your front desk deserves a full-time partner.\n\nMedVirtual medical virtual assistants.\n\n${SITE.cta} →`,
      `Give your front desk backup — before the next busy Monday.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Busy practices need more than “we’ll figure it out.”\n\nFull-time remote medical admin.\n\n${SITE.cta} →`,
      `Front-desk backup that understands healthcare workflows.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Admin work expands to fill every spare minute — and person.\n\nGet help.\n\n${SITE.cta} →`,
      `The front desk is the heartbeat of the practice. Keep it supported.\n\n${SITE.ctaAlt} →`,
      `Expert virtual medical assistant support for intake, calls & admin.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
      `Scheduling, calls, and admin — covered with remote support.\n\n${SITE.ctaAlt} →`,
    ],
  },
  {
    id: 'hiring_gap',
    title: 'Hiring gap · Remote MA without another in-office hire',
    pairsWith: 'T2-RMA / T2-RMA2 · AI_007 / AI_013',
    siteAlign: 'Fast hiring · pre-vetted · ready in days · $10/hr',
    texts: [
      `Hiring taking too long? Pre-vetted medical VAs — ready in days.\n\n${SITE.cta} →`,
      `Add support without another in-office hire.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Need help now — not after another round of interviews?\n\nMedVirtual medical VAs.\n\n${SITE.ctaAlt} →`,
      `Skip the “post and hope” hiring cycle. Full-time remote VAs from $10/hr.\n\n${SITE.cta} →`,
      `Your open role costs you every week it stays open.\n\nFill the gap with a pre-vetted medical VA.\n\n${SITE.cta} →`,
      `Get an expert virtual medical assistant — without the 3-month slog.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Another in-office hire isn’t the only option.\n\nRemote medical VAs for US healthcare practices.\n\n${SITE.cta} →`,
      `Staffing gap? Start with remote medical admin support.\n\n${SITE.monthly}\n\n${SITE.cta} →`,
      `✅ Pre-vetted · ✅ HIPAA-trained · ✅ Ready in days\n\nMedical VAs for busy practices.\n\n${SITE.cta} →`,
      `Don’t pause growth while you hunt for the perfect local hire.\n\nAdd remote coverage now.\n\n${SITE.cta} →`,
      `When hiring stalls, operations shouldn’t.\n\nFull-time medical virtual assistants.\n\n${SITE.cta} →`,
      `Hire slower. Cover faster — with MedVirtual medical VAs.\n\n${SITE.cta} →`,
      `Expert admin help without expanding office headcount.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `The alternative to “we’ll just work harder until we hire.”\n\nRemote medical admin.\n\n${SITE.ctaAlt} →`,
      `Need a medical VA who’s ready to work — not train from zero?\n\nPre-vetted. Ready in days.\n\n${SITE.cta} →`,
      `Fill the gap between “we need help” and “we finally hired.”\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Remote medical VAs — so your next hire isn’t a crisis hire.\n\nStarting at $10/hour.\n\n${SITE.cta} →`,
      `Support without the office chair and 90-day ramp.\n\n${SITE.ctaAlt} →`,
      `A full-time dedicated medical staff member — remote.\n\n${SITE.monthly}\n\n${SITE.cta} →`,
      `Stop choosing between overwork and a rushed hire. There’s a third option.\n\n${SITE.cta} →`,
      `Hiring gap? Cover it with MedVirtual — ready in days.\n\nHIPAA-trained medical VAs.\n\n${SITE.cta} →`,
      `Fast support for practices that can’t wait on hiring.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Get matched with medical VAs experienced in US healthcare workflows.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
      `Get an expert VA for admin, scheduling support, and follow-up.\n\n${SITE.cta} →`,
      `Practices use MedVirtual to add capacity while hiring stays open.\n\n${SITE.cta} →`,
    ],
  },
  {
    id: 'cost_admin',
    title: 'Admin backlog · Clear work · Cut overhead',
    pairsWith: 'T2-ADM / T3 / T4 · AI_014 / AI_008',
    siteAlign: 'Cut overhead · insurance verification · EMR · billing support · $10/hr',
    texts: [
      `Clear the admin backlog — intake, verification, follow-up & more.\n\n${SITE.rate}\n\n${SITE.cta} →`,
      `Cut overhead without cutting care. HIPAA-compliant medical VAs.\n\n${SITE.ctaAlt} →`,
      `Admin backlog growing faster than your schedule?\n\nFull-time medical VAs can help.\n\n${SITE.cta} →`,
      `Your providers didn’t go to school to chase paperwork.\n\nMedical VAs for practice ops.\n\n${SITE.cta} →`,
      `Transparent pricing. Predictable support. Starting at $10/hour.\n\n${SITE.cta} →`,
      `Insurance verification. EMR updates. Follow-ups — remote help.\n\n${SITE.cta} →`,
      `Less admin drag. More patient-facing capacity.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `The backlog doesn’t clear itself. Add remote medical admin.\n\n${SITE.cta} →`,
      `✅ Insurance verification · ✅ EMR support · ✅ Follow-up\n\nRemote medical VAs.\n\n${SITE.cta} →`,
      `Repetitive admin is expensive when your best people do it.\n\nDelegate with MedVirtual.\n\n${SITE.cta} →`,
      `Full-time medical staff support — without full-time office overhead.\n\n${SITE.monthly}\n\n${SITE.cta} →`,
      `Keep care quality high — and admin costs in check.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
      `Billing data, claims support, patient billing inquiries — covered.\n\nFrom $10/hour.\n\n${SITE.cta} →`,
      `If admin is always “later,” it’s already late. Get help — ready in days.\n\n${SITE.cta} →`,
      `Cut the cost of routine admin — without cutting compliance corners.\n\nHIPAA-trained talent.\n\n${SITE.cta} →`,
      `Your backlog is a staffing problem in an admin costume.\n\nMedVirtual can help.\n\n${SITE.cta} →`,
      `Clear repetitive back-office work with remote medical VAs.\n\n${SITE.cta} →`,
      `Less overhead. Same standard of care. Full-time medical VAs from $10/hr.\n\n${SITE.cta} →`,
      `Healthcare VAs for billing support, insurance verification & EMR.\n\n${SITE.cta} →`,
      `More ops output — without more chaos in your office.\n\nFull-time medical VAs.\n\n${SITE.cta} →`,
      `Admin work is real work — it deserves dedicated support.\n\nStarting at $10/hour.\n\n${SITE.cta} →`,
      `Stop letting back-office tasks set the pace of the practice.\n\n${SITE.ctaAlt} →`,
      `Support tailored to practice operations — not generic VAs.\n\n${SITE.trust}.\n\n${SITE.cta} →`,
      `Clear the pile: intake, verification, scheduling support, follow-up.\n\n${SITE.badges}\n\n${SITE.cta} →`,
      `Predictable pricing for medical virtual assistant services.\n\n${SITE.rate}\n\n${SITE.cta} →`,
    ],
  },
];

const CSS = `
  ${HEADER_CSS}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; color: #0f172a; line-height: 1.5; }
  .wrap { max-width: 920px; margin: 0 auto; padding: 1.25rem 1.25rem 3rem; }
  .intro {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 1.1rem 1.25rem; margin-bottom: 1rem; font-size: 0.9rem; color: #475569;
  }
  .intro strong { color: #0f172a; }
  .intro a { color: #0d9488; font-weight: 650; }
  .rules {
    background: #0f172a; color: #e2e8f0; border-radius: 12px;
    padding: 1rem 1.2rem; margin-bottom: 1.25rem; font-size: 0.84rem;
  }
  .rules h3 { margin: 0 0 0.5rem; font-size: 0.8rem; color: #5eead4; text-transform: uppercase; letter-spacing: 0.04em; }
  .rules ul { margin: 0; padding-left: 1.1rem; color: #cbd5e1; }
  .rules li { margin: 0.25rem 0; }
  .rules code { font-size: 0.78rem; background: #1e293b; padding: 0.05rem 0.35rem; border-radius: 4px; color: #99f6e4; }
  .toc { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0 0 1.5rem; }
  .toc a {
    font-size: 0.78rem; padding: 0.4rem 0.7rem; border-radius: 8px;
    background: #0f172a; color: #fff; text-decoration: none; font-weight: 600;
  }
  .angle { margin: 2rem 0 0.5rem; scroll-margin-top: 110px; }
  .angle h2 {
    font-size: 1.05rem; color: #0f172a; padding-bottom: 0.4rem;
    border-bottom: 2px solid #0d9488;
  }
  .angle .meta { font-size: 0.8rem; color: #64748b; margin: 0.4rem 0 0.85rem; }
  .card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 0.85rem 1rem; margin-bottom: 0.65rem;
  }
  .card-top {
    display: flex; justify-content: space-between; align-items: center;
    gap: 0.5rem; margin-bottom: 0.55rem; flex-wrap: wrap;
  }
  .card-top-left { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
  .num {
    font-family: ui-monospace, monospace; font-size: 0.72rem; font-weight: 700;
    color: #0d9488; background: #ecfdf5; padding: 0.15rem 0.45rem; border-radius: 4px;
  }
  .badge {
    font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.03em;
  }
  .badge.safe { background: #ecfdf5; color: #047857; }
  .badge.expand { background: #fff7ed; color: #c2410c; }
  .copy-btn {
    font-size: 0.72rem; font-weight: 650; color: #0f766e; background: #f0fdfa;
    border: 1px solid #99f6e4; border-radius: 6px; padding: 0.25rem 0.55rem; cursor: pointer;
  }
  .copy-btn:hover { background: #ccfbf1; }
  .copy-btn.done { background: #0d9488; color: #fff; border-color: #0d9488; }
  .feed-preview {
    background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;
    padding: 0.55rem 0.7rem; margin-bottom: 0.55rem; font-size: 0.82rem; color: #334155;
  }
  .feed-preview__label {
    font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase;
    letter-spacing: 0.04em; margin-bottom: 0.25rem;
  }
  .feed-preview__text { white-space: pre-wrap; line-height: 1.4; }
  .feed-preview__more { color: #64748b; font-weight: 600; }
  .text {
    white-space: pre-wrap; font-size: 0.88rem; color: #1e293b; line-height: 1.45;
  }
  .chars { font-size: 0.7rem; color: #94a3b8; margin-top: 0.45rem; }
  .chars.warn { color: #c2410c; }
  .hook-len { font-size: 0.7rem; color: #64748b; }
`;

function main() {
  for (const angle of ANGLES) {
    if (angle.texts.length !== 25) {
      throw new Error(`${angle.id} has ${angle.texts.length} texts (need 25)`);
    }
  }

  const total = ANGLES.reduce((n, a) => n + a.texts.length, 0);
  const feedSafe = ANGLES.reduce(
    (n, a) => n + a.texts.filter((t) => t.length <= FEED_VISIBLE).length,
    0,
  );

  const toc = ANGLES.map(
    (a) => `<a href="#${esc(a.id)}">${esc(a.title.split('·')[0].trim())} (${a.texts.length})</a>`,
  ).join('');

  const body = ANGLES.map((angle) => {
    const cards = angle.texts
      .map((text, i) => {
        const len = text.length;
        const hook = firstLine(text);
        const preview = visiblePreview(text);
        const truncated = len > FEED_VISIBLE;
        const badge = truncated
          ? `<span class="badge expand">See more</span>`
          : `<span class="badge safe">Feed-safe</span>`;
        const note = truncated
          ? ` · expands past ${FEED_VISIBLE} (hook must stand alone)`
          : ` · fully visible before See more`;
        const previewHtml = truncated
          ? `${esc(preview)}<span class="feed-preview__more">… See more</span>`
          : esc(preview);

        return `<div class="card">
      <div class="card-top">
        <div class="card-top-left">
          <span class="num">${esc(angle.id)}-${String(i + 1).padStart(2, '0')}</span>
          ${badge}
          <span class="hook-len">Line 1: ${hook.length} chars</span>
        </div>
        <button type="button" class="copy-btn" data-copy="${esc(text)}">Copy</button>
      </div>
      <div class="feed-preview">
        <div class="feed-preview__label">Mobile feed preview (~${FEED_VISIBLE} chars)</div>
        <div class="feed-preview__text">${previewHtml}</div>
      </div>
      <div class="text">${esc(text)}</div>
      <div class="chars${truncated ? ' warn' : ''}">${len} characters${note}</div>
    </div>`;
      })
      .join('');

    return `<section class="angle" id="${esc(angle.id)}">
      <h2>${esc(angle.title)}</h2>
      <p class="meta">Pairs with: ${esc(angle.pairsWith)} · Site: ${esc(angle.siteAlign)}</p>
      ${cards}
    </section>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Facebook Ad Copy — MedVirtual</title>
  <style>${CSS}</style>
</head>
<body>
  ${renderDocHeader({
    activeId: 'copy',
    pageTitle: 'Facebook Primary Text',
    pageSubtitle: `${total} variations · ${ANGLES.length} angles × 25 · FB feed best practices · ${feedSafe} fully feed-safe`,
  })}
  <div class="wrap">
    <div class="intro">
      <strong>What this is:</strong> Facebook/Instagram <em>primary text</em> (caption above the creative) — not on-image H1s.
      Aligned with <a href="https://www.medvirtual.ai/" target="_blank" rel="noopener">medvirtual.ai</a>:
      starting at $10/hour · HIPAA-trained · pre-vetted · ready in days · 250+ practices · full-time dedicated support.
    </div>
    <div class="rules">
      <h3>Facebook best practices (built into every line)</h3>
      <ul>
        <li><strong>First ~${FEED_VISIBLE} characters win</strong> — mobile truncates; ~1% tap See more. Each card shows a feed preview.</li>
        <li><strong>Hook in line 1</strong> — outcome, pain, or offer. Must work alone if nothing expands.</li>
        <li><strong>One CTA</strong> — Book a demo / Talk to our team (form-fill). No multi-CTA clutter.</li>
        <li><strong>Specific &amp; true</strong> — site claims only. Practice-ops POV. No fake testimonials.</li>
        <li><strong>Light emoji</strong> — sparingly for scanability, never decoration spam.</li>
        <li><strong>Test 3–5 per ad set</strong> — Meta can optimize across primary-text variants; pick from one angle first.</li>
      </ul>
    </div>
    <nav class="toc">${toc}</nav>
    ${body}
  </div>
  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const t = btn.getAttribute('data-copy') || '';
        try {
          await navigator.clipboard.writeText(t);
          btn.textContent = 'Copied';
          btn.classList.add('done');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1200);
        } catch (e) {
          btn.textContent = 'Select text';
        }
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUBLIC, 'facebook-ad-copy.html'), html);

  const md = `# Facebook Primary Text — MedVirtual

Aligned with [medvirtual.ai](https://www.medvirtual.ai/). ${ANGLES.length} angles × 25 = **${total}** variations.

## Facebook best practices applied
- First ~${FEED_VISIBLE} characters = the ad for most viewers (mobile truncates)
- Hook / outcome / offer in line 1 — must stand alone
- One form-fill CTA only
- Verified site claims only · practice-ops POV · light emoji
- ${feedSafe} of ${total} are fully feed-safe (≤${FEED_VISIBLE} chars); the rest expand with a strong first line

Verified claims: Starting at $10/hour · $1,760/mo full-time · HIPAA-trained · Pre-vetted · Ready in days · Trusted by 250+ healthcare practices.

Review board: http://localhost:5173/facebook-ad-copy.html

${ANGLES.map(
  (a) => `## ${a.title}

Pairs with: ${a.pairsWith}

${a.texts.map((t, i) => `### ${a.id}-${String(i + 1).padStart(2, '0')}\n\n${t}\n`).join('\n')}`,
).join('\n\n')}
`;

  fs.writeFileSync(path.join(ROOT, 'facebook-ad-copy.md'), md);
  console.log(`Facebook copy: http://localhost:5173/facebook-ad-copy.html (${total} texts, ${feedSafe} feed-safe)`);
}

main();
