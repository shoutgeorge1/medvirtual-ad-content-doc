# Wave 1 Instant Form — Book Your Demo

**Form name (Ads Manager):** `IMB_MV_VMA_Wave1_BookDemo_LowFriction_v1.0`
**Attach to:** all 5 Wave 1 ads (VMA-33, VMA-34, VMA-37, VMA-41, VMA-43)
**Type:** Instant form · **More volume** · Language: English (US)
**Status:** Ready to build — publish only after privacy URL + scheduling link are set.

> One shared form across the wave keeps lead data comparable. Set the hidden
> tracking fields so we can tell which concept/color produced each lead.

---

## 1. Intro (optional but recommended)

- **Layout:** Paragraph
- **Headline:** Hire a dedicated virtual medical admin
- **Description:**
  A dedicated, healthcare-trained virtual medical admin who joins your practice team — calls, scheduling, insurance verification, and patient follow-up. Not a call center, not AI, not software.

_No pricing, HIPAA, savings %, or free-offer language in the intro (all leadership/compliance-gated)._

---

## 2. Questions (Form A — max volume, low friction)

| # | Field | Type | Required |
| --- | --- | --- | --- |
| 1 | First Name | Short answer / prefill | Yes |
| 2 | Last Name | Short answer / prefill | Yes |
| 3 | Email | Email (any email accepted) | Yes |
| 4 | Mobile Phone | Phone — **no SMS verification** | Yes |

**Do not** require a work email. **Do not** enable SMS verification. Keep it to 4 fields for volume.

---

## 3. Completion screen — strong "Book Your Demo" CTA

- **Headline:** You're in — now book your demo
- **Description:**
  Thanks! Skip the wait and grab a time now. On a quick call we'll walk through how a dedicated virtual medical admin fits your practice. Prefer we reach out? We'll call you shortly.
- **Primary button (CTA):** `Book Your Demo`
  - **Button action:** View website
  - **Link:** `[SCHEDULING_LINK]`  ← replace with the live booking URL (Calendly / HubSpot Meetings / Chili Piper)
- **Secondary line:** We'll also follow up by phone and email.

### Placeholders to replace before publishing
| Placeholder | Replace with |
| --- | --- |
| `[SCHEDULING_LINK]` | Live demo-booking calendar URL |
| `[PRIVACY_POLICY_URL]` | Approved MedVirtual privacy policy URL |

> The "Book Your Demo" button is a scheduling action, not a claim — safe to use.
> Do **not** add "free consultation" wording (leadership-gated).

---

## 4. Privacy + disclaimer

- **Privacy policy URL:** `[PRIVACY_POLICY_URL]`
- **Custom disclaimer (optional):**
  By submitting, you agree to be contacted by MedVirtual about virtual staffing. Message/data rates may apply.

_Brand: **MedVirtual** only — never "MedVirtual.ai" in any lead-facing text._

---

## 5. Hidden / tracking fields (so leads map back to creative)

| Field | Value |
| --- | --- |
| lead_source | Meta Instant Form |
| campaign | IMB_MV_Meta_Leads_Static_VMA_ADV_Broad_20260714 |
| ad_set | IMB_MV_ADV_Broad_US_StaticVMA_LowFriction |
| ad_number | VMA-## (per ad) |
| color_family | vivid-green / cobalt-blue / signal-yellow |
| language | en |
| form_variant | form-a |

Per-concept ad_number to stamp on each ad:
- **VMA-33** → `IMB_MV_ADV_05_SpanishNeverLost_BilingualPatients_v1.0_4x5` · color: vivid-green
- **VMA-34** → `IMB_MV_ADV_06_BilingualFrontDesk_Capacity_v1.0_4x5` · color: cobalt-blue
- **VMA-37** → `IMB_MV_ADV_07_TrainedWorkflow_PracticeSystems_v1.0_4x5` · color: cobalt-blue
- **VMA-41** → `IMB_MV_ADV_08_FrontDeskCapacity_Overload_v1.0_4x5` · color: signal-yellow
- **VMA-43** → `IMB_MV_ADV_09_ScheduleMoving_Confirmations_v1.0_4x5` · color: cobalt-blue

---

## 6. Build + QA checklist

- [ ] Form built as **More volume** with the 4 fields above
- [ ] Intro copy pasted (no gated claims)
- [ ] Completion screen headline + description set
- [ ] **Book Your Demo** button → `[SCHEDULING_LINK]` (live URL, opens correctly on mobile)
- [ ] `[PRIVACY_POLICY_URL]` set and reachable
- [ ] Hidden tracking fields added and mapped in CRM (HubSpot)
- [ ] Test lead submitted → appears in Meta Leads Center + CRM with correct ad_number/color
- [ ] Sales notification fires; end-to-end follow-up confirmed **before** scaling spend
- [ ] Same published form attached to all 5 Wave 1 ads
