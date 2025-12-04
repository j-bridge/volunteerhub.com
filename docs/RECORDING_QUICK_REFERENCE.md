# VolunteerHub Walkthrough Quick Reference

**Date**: December 3, 2025  
**Narrators**: You (Narrator) & Catalina (QA)  
**Runtime**: ~5–7 minutes  
**Format**: Split-screen, with visual cues and checklist overlays  

---

## Scene-by-Scene Timeline

| Time | Scene | Speaker | Key Visuals | QA Check |
|------|-------|---------|-------------|----------|
| 0:00–0:08 | **Intro** | Narrator | Title card + logo + lower-thirds | N/A |
| 0:08–0:26 | **Opportunities Listing** | Narrator | Filters, search, pagination | Filter counts match, no duplicates |
| 0:26–0:54 | **Signup & Onboarding** | Narrator | Form fill, success, profile setup | Required fields, Remember Me, password strength |
| 0:54–1:32 | **Apply to Opportunity** | Narrator | Detail page, apply form, resume upload, confirmation | File validation, duplicate prevention, confirmation email |
| 1:32–2:20 | **Org Admin Review** | Narrator | Org Dashboard, application detail, accept with message, notification | Acceptance email, capacity decrease, concurrent edits |
| 2:20–2:48 | **Manage Members** | Narrator | Members tab, invite form, invite email | Invite expiration, role enforcement |
| 2:48–3:11 | **Site Admin Console** | Narrator | Admin console, user search, role change, confirmation | Confirmation modal, audit log entry |
| 3:11–3:29 | **Notifications & Email** | Narrator | Notification center, email templates folder | Template placeholder population, unsubscribe links |
| 3:29–4:17 | **QA Test Scenarios** | Catalina | Capacity validation, deadline check, concurrent edits | Test checklist overlay, all pass |
| 4:17–4:40 | **Accessibility & Mobile** | Narrator | Keyboard navigation, mobile layout, focus states | Tab order, color contrast, touch targets |
| 4:40–4:53 | **Closing** | Narrator | Summary card, GitHub link, QA report upload | QA sign-off |

---

## Test Accounts (Copy for Quick Access)

```
Volunteer:
  volunteer.test@example.com / TestPassword123!

Org Admin:
  orgadmin.test@example.com / TestPassword123!

Site Admin:
  siteadmin.test@example.com / AdminPassword123!

QA (Catalina):
  qa.catalina@example.com / QAPassword123!
```

---

## Key Test Data

### Organizations
- Green Community Initiative (Org Admin: orgadmin.test)
- Youth Education Alliance (Org Admin: orgadmin2.test)
- Local Food Bank (Org Admin: orgadmin.test)

### Opportunities (Published)
- Community Garden Workday (21 days out; capacity 5)
- After-School Tutoring (7 days out; capacity 8)
- Weekend Food Distribution (3 days out; capacity 3)
- Environmental Cleanup (5 days past; closed)
- Full Capacity Opportunity (15 days out; capacity 2, for testing full validation)

### Applications
- volunteer.test → Community Garden (Pending) — for org admin review
- volunteer.test → Weekend Food (Accepted) — for showing accepted status
- volunteer2.test → Community Garden (Rejected) — for showing rejection

---

## Recording Checklist (Pre-Recording)

- [ ] All test accounts verified & log in
- [ ] Test data seeded: `python scripts/seed_test_data.py`
- [ ] Frontend & backend running
- [ ] Browser zoom 100%, no extensions
- [ ] Notifications & email alerts muted
- [ ] DevTools console open (capture any errors)
- [ ] Mic tested & environment quiet
- [ ] Screen resolution 1080p+

---

## On-Screen Text Overlays (Add in Post-Production)

### Narrator Label
```
Lower-third text: "Narrator: [Your Name]"
Show for Scenes 0–9 & 10 (except QA scenes 8 & 9)
```

### Catalina – QA Label
```
Lower-third text: "QA: Catalina"
Show for QA observations and QA-led Scene 8
```

### QA Checklists (Overlay)
```
Scene 1: ✓ Filter count matches | ✓ No duplicates | ✓ Pagination unique
Scene 2: ✓ Required fields validate | ✓ Password strength shows | ✓ Remember Me works
Scene 3: ✓ Resume upload validation | ✓ Duplicate app blocked | ✓ Confirmation email
Scene 7: ✓ Acceptance email sent | ✓ Capacity decreased | ✓ Concurrent edits safe
Scene 8: ✓ Capacity validation | ✓ Deadline enforcement | ✓ QA scenarios pass
Scene 15: ✓ Keyboard nav works | ✓ Focus states visible | ✓ Color contrast WCAG AA
```

---

## Speaker Tips

### For You (Narrator)
- **Pacing**: 1–2 words per second; pause 1–2s after actions.
- **Tone**: Clear, friendly, educational.
- **Emphasis**: Highlight benefits and user experience.
- **Example phrasing**:
  - "Here you can see..." (point to feature)
  - "Notice how..." (draw attention)
  - "This helps because..." (explain benefit)
  - "Let me demonstrate..." (transition to action)

### For Catalina (QA)
- **Pacing**: Same as narrator; slightly more technical.
- **Tone**: Professional, observational.
- **Emphasis**: What was tested and why it matters.
- **Example phrasing**:
  - "QA observation: We verified that..."
  - "Results show..."
  - "This ensures..."
  - "All tests passed..."

---

## Scene-by-Scene Dialogue (Ad-lib Guide)

### Scene 0: Intro (0:00–0:08)
**Narrator**: "Welcome to VolunteerHub. I'm [Your Name]. We'll explore volunteer workflows, org admin features, site admin operations, and QA testing. Catalina from QA will join with testing insights."

### Scene 1: Opportunities (0:08–0:26)
**Narrator**: "Volunteers start here at the Opportunities page. It's a live listing of published events. [Scroll] Filters let you narrow by location, date, skills, and organization."
[Apply 2 filters; show results update]
**Narrator**: "Results update instantly. Pagination keeps the page responsive."
**Catalina**: "QA: We verified filter counts match results and pagination doesn't duplicate items across pages."

### Scene 2: Signup (0:26–0:54)
**Narrator**: "Let's create an account. [Click Sign Up] The form asks for email, password, and name. I'll also check 'Remember Me' so my session persists."
[Fill form; check Remember Me; submit]
**Narrator**: "Onboarding asks for skills and availability to help match volunteers with opportunities."
[Fill profile; save]
**Catalina**: "QA: We confirmed required field validation, password strength indication, and that 'Remember Me' correctly preserves the session."

### Scene 3: Apply (0:54–1:32)
**Narrator**: "Now I'm browsing as a volunteer. Let me click on 'Community Garden Workday' to see details."
[Show detail page]
**Narrator**: "The event is April 24th, requires gardening skills, and the deadline is coming up. I'll apply."
[Click Apply; fill message; upload resume; submit]
**Narrator**: "Confirmation! My status is 'Pending'. I can track it in 'My Applications'."
[Show confirmation + My Applications page]
**Catalina**: "QA: We tested file upload validation, confirmed duplicate applications are blocked, and verified the confirmation email arrives."

### Scene 4: Org Admin Review (1:32–2:20)
**Narrator**: "Switching to the org admin dashboard. Applications for my organization appear here. [Open application] I'll accept this volunteer."
[Show detail; click Accept; add message; click Send & Accept]
**Narrator**: "Status updated to 'Accepted'. The volunteer is notified via email."
[Show status change + capacity decrease]
**Catalina**: "QA: We confirmed acceptance emails include event details and that capacity decreases automatically. We also tested concurrent edits—if two admins act on the same application, the system handles it gracefully."

### Scene 5: Members (2:20–2:48)
**Narrator**: "Org admins can also invite team members. [Click Members] I'll send an invite."
[Click Invite; enter email; assign role; send]
**Narrator**: "The invitee receives an email with an acceptance link. Once accepted, they join the organization."
**Catalina**: "QA: We verified invite token expiry (7 days) and that role permissions are enforced."

### Scene 6: Site Admin (2:48–3:11)
**Narrator**: "Site admins have a global console for user and org management. [Search user] I can change roles or suspend accounts."
[Show user detail; click Change Role; select role; confirm]
**Narrator**: "Role changes require confirmation and are logged for compliance."
**Catalina**: "QA: Confirmed role changes are logged and that suspended users cannot log in."

### Scene 7: Notifications (3:11–3:29)
**Narrator**: "Throughout these flows, users receive notifications and emails. [Show notification center] All email templates live in our `email_templates` folder and include personalized details."
**Catalina**: "QA: We verified template placeholders populate correctly and unsubscribe links work."

### Scene 8: QA Tests (3:29–4:17)
**Catalina**: "I'll run core test scenarios. Test 1: Apply to a full-capacity opportunity. [Attempt] System prevents it. ✓ Capacity validation works."
"Test 2: Apply after deadline. [Attempt] Error shown. ✓ Deadline enforcement works."
"Test 3: Concurrent edits. [Show split-screen] Both admins viewing same app. One accepts; the other sees it's already accepted. ✓ No double-acceptance."
"All tests passed."

### Scene 9: Accessibility (4:17–4:40)
**Narrator**: "Accessibility is critical. [Keyboard-only navigation] I can tab through forms and navigate without a mouse. All interactive elements are accessible."
[Resize to mobile width]
**Narrator**: "Mobile layout adapts: single column, hamburger menu, touch-friendly buttons. Forms work on small screens."
**Catalina**: "QA: Verified keyboard navigation, focus states, and mobile responsiveness."

### Scene 10: Closing (4:40–4:53)
**Narrator**: "That's VolunteerHub. Volunteers browse, apply, and track; org admins create opportunities and review applications; site admins manage users and orgs. For details, see the docs folder and GitHub repo."
**Catalina**: "QA: I've uploaded the test report with screenshots. All tests passed."

---

## Post-Production Checklist

- [ ] Voiceover recorded cleanly (no background noise)
- [ ] Audio levels normalized (dialogue ~-3dB, peaks at 0dB)
- [ ] Lower-thirds added (Narrator / Catalina labels)
- [ ] QA checklists overlaid at correct timestamps
- [ ] Scene transitions added (fade/cross-dissolve; 0.5–1s)
- [ ] Color grading consistent (if desired)
- [ ] Subtitles/captions added (optional, for accessibility)
- [ ] Final export at 1080p, H.264, MP4
- [ ] File size optimized (target < 100MB for 5–7 min video)
- [ ] Uploaded to documentation folder or video platform

---

## File References

| File | Purpose |
|------|---------|
| `docs/walkthrough_script.md` | Full voiceover script with detailed visuals & timing |
| `docs/qa_test_checklist.md` | 20 detailed QA test scenarios with pass/fail checks |
| `scripts/seed_test_data.py` | Python script to seed test database |
| `scripts/SEED_SETUP.md` | Instructions to run seed script |
| **This file** | Quick reference for recording day |

---

## Emergency Contacts & Troubleshooting

**During Recording**:
- App won't start? Restart backend: `flask run --debug`
- DB locked? Reset: `rm instance/app.db && flask db upgrade && python scripts/seed_test_data.py`
- Frontend not updating? Clear cache: `Ctrl+Shift+R` (hard refresh)

**Post-Recording**:
- Video codec issues? Re-export as H.264/MP4.
- Audio sync problems? Re-sync in video editor.
- Need to re-record a scene? Pause, reset, and go again.

---

## Success Criteria (Video Complete When)

- [ ] All 10 scenes recorded with clear audio
- [ ] Narrator & Catalina dialogue matches script pacing
- [ ] QA checklists visible at appropriate timestamps
- [ ] No J errors or UI glitches visible
- [ ] Color contrast & accessibility verified
- [ ] Video exported at 1080p, < 5min–7min runtime
- [ ] Test report & screenshots uploaded
- [ ] QA sign-off checklist completed

---

**Ready to Record?** 🎬  
Print this page, grab a coffee, and let's make a great walkthrough!

**Questions?** Check `docs/walkthrough_script.md` for full details or `docs/qa_test_checklist.md` for test specifics.

---

**Last Updated**: December 3, 2025  
**Version**: 1.0 – Ready for Production Recording
