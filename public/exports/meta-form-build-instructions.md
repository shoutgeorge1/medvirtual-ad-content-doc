# Meta Instant Form Build Instructions

**Form name (exact):** `IMB_MV_Form_BookDemo_RealPeople`  
**Status:** Save as **draft**. Do not publish.  
**Shared form:** Use this one form for all 4 ads.

Instant Forms are created manually in Meta Ads Manager / Instant Forms. Do not expect reliable CSV bulk creation for forms.

---

## Step-by-step

1. In Ads Manager, open **Instant Forms** (or create form from the ad destination step).
2. Create a new form.
3. Set form name exactly:
   `IMB_MV_Form_BookDemo_RealPeople`
4. Choose form type:
   **Higher Intent (recommended for lead quality)**
5. Intro headline:
   Meet Real MedVirtual Talent for Your Practice
6. Intro body:
   MedVirtual helps practices hire dedicated full-time virtual staff who become part of your team — for calls, scheduling, insurance verification, intake, and admin support.
7. Add required contact fields:
   - Full name
   - Email
   - Phone number
8. Custom question 1:
   **Practice name** (short answer)
9. Custom question 2:
   **What type of practice do you manage?**
   Options:
   - Medical practice
   - Dental practice
   - Specialty practice
   - Multi-location practice
   - Other
10. Custom question 3:
    **What support do you need most?**
    Options:
    - Calls and scheduling
    - Patient intake
    - Insurance verification
    - Billing support
    - EMR/admin support
    - Dental admin support
    - Not sure yet
11. Privacy policy URL:
    `https://www.medvirtual.ai/privacy-policy`
12. Thank-you screen headline:
    Thanks - your request was received.
13. Thank-you screen body:
    A MedVirtual team member will follow up so you can review candidates and request interviews.
14. Button text:
    Book a Demo
15. Button URL:
    `https://meetings.hubspot.com/call-scheduling/mv-meta-imb`
16. Save as **draft**.
17. Do **not** publish until privacy URL + booking link are replaced with real values.

---

## After URLs arrive

1. Replace privacy policy URL with the real MedVirtual privacy policy.
2. Replace thank-you button URL with Haylie booking link.
3. Append UTM pattern to booking link:
   `utm_source=IMB_MV&utm_medium=Meta&utm_campaign=IMB_MV_Meta_Leads_RealPeople_202607&utm_term={{adset.name}}&utm_content={{ad.name}}`
4. Re-QA form preview on mobile.
5. Confirm HubSpot lead view sees `IMB_MV` form submissions.
6. Keep form draft until CMO approval, then publish with campaign.

---

## Language check

Use: MedVirtual, full-time virtual staff, part of your practice team, hire through MedVirtual, Book a Demo.

Avoid: MedVirtual.ai, managed service, outsourced front desk, front desk replacement, we handle your front desk, recruiting/job-seeker language.
