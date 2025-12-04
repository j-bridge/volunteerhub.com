# VolunteerHub Walkthrough Script

**Project**: VolunteerHub – A full-stack web platform connecting volunteers with nonprofit organizations.

**Audience**: Stakeholders, team review, QA sign-off.

**Format**: Split narration between **Narrator** (primary speaker) and **Catalina – QA** (testing notes & validation).

**Total Runtime**: ~5–7 minutes (depending on pacing).

**Recording Notes**:
- Record at 1080p minimum.
- Use a quiet environment with a headset mic.
- Capture short clips per scene; avoid long scrolls.
- Keep UI clean (hide developer overlays, clear bookmarks).
- Pause and re-record if errors occur mid-flow.

---

## Scene 0: Title Slide & Intro (5–8 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Welcome to the VolunteerHub walkthrough. I'm [Your Name]. Today we'll explore the core features for volunteers, organization admins, and site admins. Catalina from our QA team will join us with testing observations to ensure everything works smoothly."

**Visual Cue**:
- Show title card with project name and VolunteerHub logo.
- Lower-third text: "Narrator: [Your Name] | QA: Catalina".
- Fade to Opportunities listing page.

**Clip Length**: ~8s

---

## Scene 1: Landing Page & Opportunities Listing (15–20 seconds)

**Speaker**: Narrator

**Voiceover**:
> "We start on the Opportunities page—the central hub where volunteers discover events and roles to match their interests and skills. Here you'll see a live listing of all published opportunities from partner organizations."

**Visual Cue**:
- Display Opportunities listing page fully loaded.
- Highlight the search bar at the top.
- Show 3–4 opportunity cards in the grid.

**Narrator (continued)**:
> "The filter panel on the left lets you narrow results by location, posting date, required skills, and organization. Let me apply a couple of filters to show how this works."

**Visual Cue**:
- Click the `Location` filter → select a sample city.
- Click the `Skills` filter → select a skill (e.g., "Gardening").
- Show filtered results update in real-time.
- Hover over a filter chip to show the "Remove" option.

**Narrator (continued)**:
> "Results update instantly. You can also sort by date or relevance, and pagination keeps the page responsive even with hundreds of opportunities."

**Visual Cue**:
- Scroll down to show pagination controls at the bottom.
- Show sort dropdown and select an option.

**QA Notes – Catalina**:
> "QA observation: Verify that applied filters return the correct count of opportunities and that pagination does not duplicate items across pages. Also, confirm that removing a filter re-fetches the full list without duplicates."

**Visual Cue** (QA):
- Show a small overlay or callout box listing QA checks:
  - ✓ Filter count matches results
  - ✓ Pagination unique items
  - ✓ Filter removal refreshes correctly

**Clip Length**: ~18s

---

## Scene 2: Volunteer Sign-Up & Profile Onboarding (25–30 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Now let's create a new volunteer account and set up a profile. I'll click Sign Up."

**Visual Cue**:
- Click `Sign Up` button (typically in header or landing area).
- Show Sign Up form page.

**Narrator (continued)**:
> "The form requests email, password, and full name. I'll fill these in and check the 'Remember Me' option so my session persists across browser sessions."

**Visual Cue**:
- Type in email field (use a test email like `volunteer.test@example.com`).
- Type password (show strong password indication if UI displays it).
- Type full name (e.g., "Alex Thompson").
- Check "Remember Me" checkbox.
- Click `Sign Up` button.

**Visual Cue** (post-submit):
- Show success message or auto-redirect to onboarding page.
- Display the onboarding flow: "Tell us about yourself" form.

**Narrator (continued)**:
> "Next, onboarding prompts for skills and availability. This helps organizations find the right volunteers for their opportunities. Let me fill in some skills and days I'm available."

**Visual Cue**:
- Show skills multi-select (e.g., checkboxes for "Gardening", "Teaching", "Event Planning").
- Click a few skills.
- Show availability selector (e.g., "Weekends", "Evenings", "Full-time").
- Click `Save Profile` or `Continue`.

**Visual Cue** (post-save):
- Show success confirmation and redirect to Opportunities page or Dashboard.

**QA Notes – Catalina**:
> "QA observation: Verify that validation messages appear for required fields like email format, password strength, and that 'Remember Me' correctly persists the session cookie. Also, check that onboarding is skippable if needed, and profile can be edited later."

**Visual Cue** (QA):
- Show a checklist overlay:
  - ✓ Required field validation works
  - ✓ Password strength indicator displays
  - ✓ "Remember Me" persists session
  - ✓ Profile accessible after onboarding

**Clip Length**: ~28s

---

## Scene 3: View Opportunity Detail & Submit Application (30–40 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Now I'm logged in as a volunteer. Let me click on one of the opportunities to see the full details and apply."

**Visual Cue**:
- From Opportunities listing, click on an opportunity card.
- Show Opportunity Detail page with:
  - Title, organization name, date/time
  - Description and required skills
  - Location and capacity info
  - Application deadline

**Narrator (continued)**:
> "This opportunity is for a community garden event on April 24th. It requires gardening skills and estimates 4 hours of time. I can see the organization and deadline clearly. Let me submit an application."

**Visual Cue**:
- Scroll down to the `Apply` button.
- Click `Apply` → modal/form appears.

**Narrator (continued)**:
> "A form appears where I can add a personal message to the organization and optionally upload my resume. I'll add a brief note about my experience."

**Visual Cue**:
- Type a short message (e.g., "I have 2 years of gardening experience and love community projects.").
- Click the resume upload field → file picker opens.
- Select a test resume file (or show the upload area).
- Click `Submit Application`.

**Visual Cue** (post-submit):
- Show application confirmation page with:
  - Application number/ID
  - Status: "Pending"
  - "You'll receive an email confirmation shortly" message
  - Button to return to Opportunities or view "My Applications"

**Narrator (continued)**:
> "Great! The application is submitted and I've received a confirmation. The status is 'Pending' and I can track it in my dashboard."

**Visual Cue**:
- Click `View My Applications` or navigate to the user dashboard.
- Show the submitted application in "My Applications" list with status badge.

**QA Notes – Catalina**:
> "QA observation: Test resume upload with various file types and sizes to confirm only PDFs and DOCs up to 5MB are accepted. Verify that applying twice to the same opportunity is blocked with a clear error message. Also confirm that the confirmation email arrives promptly."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Resume upload validation (file type, size)
  - ✓ Duplicate application prevention
  - ✓ Confirmation email sent
  - ✓ Status displays in "My Applications"

**Clip Length**: ~38s

---

## Scene 4: Organization Admin Dashboard – Review Applications (40–50 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Let's switch to the Organization Admin perspective. I'm now logged in as an admin for one of the organizations. I can see the dashboard with my organization's opportunities and applications."

**Visual Cue**:
- Show login as `org_admin` (logout if needed, then login with org admin account).
- Show Organization Dashboard page with tabs:
  - Overview (stats)
  - Opportunities (list of org's posted opportunities)
  - Applications (pending/accepted/rejected)
  - Members

**Narrator (continued)**:
> "Under the Applications tab, I can see all incoming applications for my organization's opportunities. Here's the application we just submitted. I'll review it and make a decision."

**Visual Cue**:
- Click `Applications` tab.
- Show list of pending applications (include the one submitted in Scene 3).
- Click on the application to open detail view.

**Narrator (continued)**:
> "The application shows the volunteer's message, resume, and profile. I'll accept this volunteer and send them a welcome message."

**Visual Cue**:
- Show application detail with:
  - Volunteer name and profile link
  - Message submitted with application
  - Resume (download link or embed preview)
  - Decision buttons: Accept, Reject, Message

**Visual Cue** (continued):
- Click `Accept` button → modal appears for optional message.
- Type a message (e.g., "Welcome! We're excited to have you. See you on April 24th at 9 AM at the Community Garden.").
- Click `Send & Accept`.

**Visual Cue** (post-decision):
- Show status update: Application now shows "Accepted" with a green badge.
- Show a confirmation message (e.g., "Volunteer notified").
- Capacity count for the opportunity decreases.

**Narrator (continued)**:
> "Once accepted, the volunteer receives an email with the welcome message and event details. The available capacity for the opportunity decreases automatically."

**QA Notes – Catalina**:
> "QA observation: Verify that acceptance emails contain clear event details and next steps. Confirm that capacity decreases and that concurrent edits by multiple org admins are handled gracefully (e.g., no double-acceptance). Also test rejection flow with a templated message."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Acceptance email includes event details
  - ✓ Capacity decremented
  - ✓ Concurrent edits prevented
  - ✓ Rejection message works

**Clip Length**: ~48s

---

## Scene 5: Manage Organization Members & Invites (25–30 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Organization admins can also invite and manage team members. Let me show the Members section."

**Visual Cue**:
- From Organization Dashboard, click `Members` tab.
- Show current members list with name, email, role, and action buttons (Edit, Remove).

**Narrator (continued)**:
> "I can invite a new member to my organization here. I'll click Invite Member."

**Visual Cue**:
- Click `Invite Member` button → form/modal appears.

**Narrator (continued)**:
> "I'll enter an email and assign them a role—member or admin."

**Visual Cue**:
- Type an email (e.g., `newmember@example.com`).
- Select role dropdown: select "Member".
- Click `Send Invite`.

**Visual Cue** (post-invite):
- Show confirmation message: "Invite sent to newmember@example.com".
- Show the invited member in the members list with status "Pending" or "Invited".

**Narrator (continued)**:
> "The invited member receives an email with a link to accept their invitation. Once they accept, they'll be part of the organization."

**QA Notes – Catalina**:
> "QA observation: Test the invite email link expiration (should be valid for 7 days). Verify that accepting an invite adds the member and that role assignments are respected (e.g., Members cannot invite others, only Admins can)."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Invite email valid for 7 days
  - ✓ Accept invite adds member
  - ✓ Role permissions enforced

**Clip Length**: ~28s

---

## Scene 6: Site Admin Console – User & Organization Management (20–25 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Now let's look at the Site Admin perspective. Admins have a global console for managing users and organizations across the entire platform."

**Visual Cue**:
- Show login as `site_admin` (logout if needed, then login with site admin account).
- Show Admin Console landing page with sections:
  - User Management
  - Organization Management
  - Site Metrics
  - Settings

**Narrator (continued)**:
> "I can search for users, change roles, or suspend accounts if needed. Let me search for a user."

**Visual Cue**:
- Click `User Management`.
- Show user list or search bar.
- Type a username or email in search (e.g., "volunteer.test").
- Show search results.

**Visual Cue** (continued):
- Click on a user → user detail view appears.
- Show user info: name, email, current role, account status.

**Narrator (continued)**:
> "If I need to change a user's role or suspend their account, I can do so here. Let me show the role change dialog."

**Visual Cue**:
- Click `Change Role` or role dropdown → modal appears.
- Show available roles: Volunteer, Org Admin, Site Admin.
- Click a different role to confirm the modal.
- Click `Confirm` → role updates with confirmation message.

**Visual Cue** (continued):
- Show an audit log entry or notification that the change was recorded.

**QA Notes – Catalina**:
> "QA observation: Verify that role changes require confirmation and are logged in the audit trail for compliance. Test that suspended users cannot log in and that a notification email is sent. Also confirm that site admins can transfer organization ownership."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Role change requires confirmation
  - ✓ Audit log entry created
  - ✓ Suspended users blocked from login
  - ✓ Notification email sent

**Clip Length**: ~23s

---

## Scene 7: Notifications & Email Templates (15–20 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Throughout all these interactions, users receive notifications and emails. Let me show how notifications are managed."

**Visual Cue**:
- Navigate to user profile or dashboard.
- Show a `Notifications` or `Messages` section.
- Display recent notifications (e.g., "Application accepted", "New opportunity posted", "Invite received").

**Narrator (continued)**:
> "All email templates are stored in our `email_templates` directory and include confirmation emails, application updates, and password resets. Let me show a quick peek at the repository structure."

**Visual Cue**:
- Show the repository file structure or a quick code editor snippet.
- Highlight `email_templates/` folder with files:
  - `volunteerhub_welcome_email.html`
  - `inquiry_confirmation.html`
  - `order_admin_notification.html`
  - etc.

**Narrator (continued)**:
> "Each template is customizable and includes personalized placeholders like the volunteer's name and event details."

**QA Notes – Catalina**:
> "QA observation: Verify that email template placeholders (name, date, event details) populate correctly for all notification types. Confirm that unsubscribe links are present and functional. Test with multiple email providers to ensure formatting consistency."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Template placeholders populate correctly
  - ✓ Unsubscribe links functional
  - ✓ Email formatting consistent across providers

**Clip Length**: ~18s

---

## Scene 8: QA Test Scenarios – Catalina-Led Walkthrough (40–50 seconds)

**Speaker**: Catalina – QA

**Voiceover**:
> "Now I'll demonstrate our core QA test scenarios. We use seeded test data to ensure each flow works reliably. Let me run through a few key tests."

**Visual Cue**:
- Show QA dashboard or test runner interface.
- Display a test checklist on screen with items ticked off as Catalina narrates.

**Catalina (continued)**:
> "Test 1: Apply to an opportunity with full capacity. Our system should prevent the application and display an error."

**Visual Cue**:
- Login as a test volunteer account.
- Navigate to a full-capacity opportunity.
- Click Apply.
- Show error message: "This opportunity has reached capacity. You cannot apply."
- Callout: "✓ Capacity validation works."

**Catalina (continued)**:
> "Test 2: Attempt to apply after the deadline. The system blocks this and shows a clear message."

**Visual Cue**:
- Click Apply on a closed/past-deadline opportunity.
- Show error: "This opportunity has closed. Application deadline was [Date]."
- Callout: "✓ Deadline validation works."

**Catalina (continued)**:
> "Test 3: Organization admin accepting an application while another admin reviews the same application. We handle concurrent edits gracefully."

**Visual Cue**:
- Show two browser windows or split-screen (org admin 1 and org admin 2 viewing the same application).
- Org admin 1 clicks Accept.
- Show success notification.
- Org admin 2's view refreshes; they now see the application is already accepted.
- Show a friendly message: "This application was accepted by another admin."
- Callout: "✓ Concurrent edit handling works."

**Catalina (continued)**:
> "All tests passed. We log results and attach screenshots to the project tracker for the dev team."

**Visual Cue**:
- Show QA report overlay with test results summary.
- Show attachment icons indicating screenshots and console logs.

**QA Notes – Catalina**:
> "Test data is seeded in the development environment for repeatability. We use controlled accounts (qa_volunteer, qa_admin, qa_org_admin) to avoid affecting production."

**Visual Cue** (QA):
- Show a data seeding script or log output.

**Clip Length**: ~48s

---

## Scene 9: Accessibility & Mobile Responsiveness (20–25 seconds)

**Speaker**: Narrator

**Voiceover**:
> "Accessibility and mobile responsiveness are critical for VolunteerHub. Let me show how the platform adapts to different devices and supports keyboard navigation."

**Visual Cue**:
- Show the Opportunities page at full desktop width.

**Narrator (continued)**:
> "Using keyboard-only navigation, I can tab through the page, access all buttons and links, and fill out forms without a mouse."

**Visual Cue**:
- Demonstrate keyboard tabbing through form fields, buttons, and links.
- Highlight focus states (e.g., blue outline on buttons).
- Show that all interactive elements are keyboard-accessible.

**Narrator (continued)**:
> "Now let me resize the browser to show mobile responsiveness."

**Visual Cue**:
- Resize browser to mobile width (e.g., 375px).
- Show the Opportunities page reflow: filters move to a mobile-friendly menu, opportunity cards stack vertically.
- Navigate the mobile menu (e.g., hamburger button click).

**Narrator (continued)**:
> "All critical flows—signup, apply, dashboard—work seamlessly on mobile devices."

**QA Notes – Catalina**:
> "QA observation: We test with mobile test accounts on real devices (iOS/Android) and validate that forms are finger-friendly, text is readable without zoom, and all interactive elements are accessible. Color contrast is verified with accessibility tools."

**Visual Cue** (QA):
- Show checklist overlay:
  - ✓ Keyboard navigation works
  - ✓ Focus states visible
  - ✓ Mobile layout responsive
  - ✓ Color contrast WCAG AA compliant

**Clip Length**: ~23s

---

## Scene 10: Closing & Next Steps (10–15 seconds)

**Speaker**: Narrator

**Voiceover**:
> "That concludes our walkthrough of VolunteerHub. We've explored volunteer workflows, organization admin functions, site admin operations, and QA validation steps. Each user role has clear permissions and a streamlined experience."

**Visual Cue**:
- Show a summary card or slide with key takeaways:
  - Volunteers: Browse, apply, track applications
  - Org Admins: Create opportunities, review applications, manage teams
  - Site Admins: User & org management, site metrics
  - QA: Seeded data, test scenarios, accessibility checks

**Narrator (continued)**:
> "For technical details, see the project documentation in the `/docs` folder and the repository at [GitHub link]. Questions or feedback can be directed to the team."

**Catalina (QA)**:
> "I'll upload the test report, screenshots, and performance metrics to the project tracker. All tests passed on the current build."

**Visual Cue**:
- Show end card with:
  - Repository URL
  - Documentation path (`/docs`)
  - Contact email or Slack channel
  - QA report link

**Clip Length**: ~13s

---

## Recording Checklist

### Pre-Recording Setup
- [ ] Test all user accounts (volunteer, org_admin, site_admin, qa) and confirm they can log in.
- [ ] Seed test data: organizations, opportunities (published, closed, full-capacity), applications (pending, accepted, rejected).
- [ ] Clear browser cache and disable extensions (ad blockers, password managers can interfere with form recording).
- [ ] Close other tabs and applications to reduce distractions and ensure smooth recording.
- [ ] Set browser zoom to 100% for consistent visuals.
- [ ] Disable notifications and mute Slack/email alerts.

### Recording Tips
- **Pacing**: Speak clearly and at a natural pace; pause 1–2 seconds between scenes for transitions.
- **Mouse Movement**: Use smooth, deliberate mouse movements to avoid jittery screen recording.
- **Pauses**: Include a 2–3 second pause after each major action (click, form submission) so the viewer can follow.
- **Errors**: If a flow errors mid-recording, pause, refresh/reset, and re-record that scene. Keep the final video polished.
- **Audio**: Record voiceover in a quiet room with a headset mic. Normalize audio levels in post-production.

### Post-Recording
- [ ] Export video at 1080p or higher (recommended: H.264 codec, MP4 container).
- [ ] Collect QA test results, screenshots, and console logs.
- [ ] Add lower-third graphics (Narrator/Catalina labels) in editing software.
- [ ] Add scene transitions (e.g., fade or cross-dissolve between scenes).
- [ ] Embed timestamps or chapter markers for easy navigation (e.g., "0:00 Intro, 0:10 Opportunities, 0:28 Signup...").
- [ ] Optional: Add background music at a low volume (20–30 dB below dialogue) for polish.

### File Organization
- Raw video clips: `recordings/raw/`
- Audio voiceover track: `recordings/audio/`
- QA report & screenshots: `docs/qa_reports/`
- Final video: `docs/walkthrough_video.mp4` (or platform link)

---

## Key Timestamps (Estimated)

| Time | Scene |
|------|-------|
| 0:00–0:08 | Title & Intro |
| 0:08–0:26 | Opportunities Listing & Filters |
| 0:26–0:54 | Signup & Onboarding |
| 0:54–1:32 | Opportunity Detail & Apply |
| 1:32–2:20 | Org Admin Review & Decision |
| 2:20–2:48 | Manage Organization Members |
| 2:48–3:11 | Site Admin Console |
| 3:11–3:29 | Notifications & Email Templates |
| 3:29–4:17 | QA Test Scenarios |
| 4:17–4:40 | Accessibility & Mobile |
| 4:40–4:53 | Closing |
| **Total** | **~5 min** |

---

## Speaker Notes

### Narrator (You)
- Focus on the **user experience** and **workflows**.
- Speak as if demonstrating to a new user or stakeholder.
- Use clear, jargon-free language.
- Pause after key points to let visuals sink in.
- Example tone: "Here you can see... I'll click on... Notice how..."

### Catalina – QA
- Focus on **validation** and **test coverage**.
- Highlight edge cases and error handling.
- Mention what was tested and what passed.
- Use technical but accessible language.
- Example tone: "QA observation: We verified that... Results show... This ensures..."

---

## Sample Voiceover Template (Edit as needed)

```
[Scene Setup]
Narrator: "Here we see the [feature]. I'll demonstrate [action]."
[Visual: Show action on screen]
Narrator: "Notice how [detail]. This [benefit]."
Catalina: "QA observation: We tested [scenario] and confirmed [expected result]."
[Visual: Show test result or checklist overlay]
```

---

## Questions or Customizations?

If you'd like to adjust pacing, add additional scenes, or customize verbiage for a specific audience, update this script and regenerate the video.

For technical deep-dives or code walkthroughs, consider a separate technical video for developers.

---

**Script Version**: 1.0  
**Last Updated**: December 3, 2025  
**Status**: Ready for Recording
