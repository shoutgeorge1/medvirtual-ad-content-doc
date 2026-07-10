# Meta Launch Step-by-Step (Ads Manager)

**Goal:** Get the first batch into Meta today as **draft/paused**. Do not publish.

**Structure:** 1 campaign · 1 ad set · 4 ads · 1 shared Instant Form

---

## Safest bulk workflow

1. Create campaign + ad set shell in Meta (paused).
2. Create Instant Form manually as draft.
3. Upload creatives to Media Library.
4. Either:
   - **Preferred:** Export Meta's Import/Export template, map values from `meta-bulk-import-attempt.csv` / `meta-manual-build-sheet.csv` into Meta's exact column names, then import; **or**
   - **Fallback:** Paste from `meta-paste-ready-ad-copy.txt` into 4 draft ads.
5. Review every draft ad manually on mobile.
6. Keep everything off until Haylie / CMO approval.

Do not assume Cursor-generated import columns match Meta's live template. Column names change. Match to Meta's export.

---

## Exact build order inside Meta

### Step 1 - Confirm assets
- Open launch pack
- Confirm 4 selected creatives
- Confirm Ad 2 dental interim flag
- Confirm Ad 4 price block
- Confirm no extra audiences / ad sets

### Step 2 - Create campaign shell
- Name: `IMB_MV_Meta_Leads_FirstBatch_202607`
- Objective: Leads
- Special ad categories: do **not** mark as employment/job ad
- Status: **Off / Paused**

### Step 3 - Create ad set
- Name: `IMB_MV_LAL1_MVHubSpotClinicProspects_US_500day`
- Conversion location: Instant Form
- Optimization: Leads / Instant Form submissions
- Budget: $500/day
- Geo: United States
- Audience: `Lookalike (US, 1%) - MV HubSpot Clinic Prospects — Lookalike Seed`
- Do **not** add interests, job titles, behaviors, or extra detailed targeting
- Placements: Advantage+ placements
- Status: **Off / Paused**

### Step 4 - Create draft form
- Follow `meta-form-build-instructions.md`
- Form name: `IMB_MV_Form_BookDemo_FirstBatch`
- Save as draft
- Leave privacy + booking placeholders until real URLs arrive

### Step 5 - Bulk import / build 4 ads
- Upload images to Media Library first
- Try import using Meta template + mapped values from `meta-bulk-import-attempt.csv`
- If import fails, use `meta-manual-build-sheet.csv` + `meta-paste-ready-ad-copy.txt`
- Create exactly these ads:
  1. `IMB_MV_Static_01_MedicalOwners`
  2. `IMB_MV_Static_02_DentalOwners`
  3. `IMB_MV_Static_03_VirtualMedAdmin`
  4. `IMB_MV_Static_04_TooManyCalls` (keep paused / blocked until $10/hour confirmed)
- Destination: shared form `IMB_MV_Form_BookDemo_FirstBatch`
- CTA: Book a Demo

### Step 6 - Review mobile previews
- Preview all 4 ads on mobile
- Check copy language rules
- Check creative CTA says Book a Demo on final art
- Confirm no recruiting/job-seeker vibe

### Step 7 - Send Haylie draft for review
- Share Ads Manager draft link / screenshots
- Share launch pack URL
- Call out blockers: booking link, privacy URL, creative re-export, $10/hour, dental interim image

### Step 8 - Add booking link / privacy URL
- Replace form privacy URL
- Replace thank-you button URL
- Add UTM pattern:
  `utm_source=IMB_MV&utm_medium=Meta&utm_campaign=IMB_MV_Meta_Leads_FirstBatch_202607&utm_term={{adset.name}}&utm_content={{ad.name}}`
- Confirm HubSpot lead view

### Step 9 - Publish only after approval
- Final QA checklist
- Turn on only after Haylie / CMO approval
- Monitor $500/day vs $10k monthly pacing (~20 days)

---

## Do not build yet

- Extra ad sets
- Broad US no-interest ad set
- 2% / 3% lookalike
- Interest stacks
- Separate dental ad set
- Retargeting

Those are future tests only.
