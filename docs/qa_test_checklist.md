# VolunteerHub QA Test Checklist

**Prepared For**: Catalina (QA Specialist)  
**Project**: VolunteerHub  
**Version**: 1.0  
**Date**: December 3, 2025

---

## Overview

This checklist provides explicit test scenarios and expected results for Catalina to validate during QA walkthrough. Use the seeded test data (created via `scripts/seed_test_data.py`) to ensure repeatable, isolated testing.

---

## Pre-Testing Setup

### 1. Seed Test Data
```bash
cd app/server
python scripts/seed_test_data.py
```

**Expected Output**:
```
✓ Users created/verified: 6
✓ Organizations created/verified: 3
✓ Opportunities created/verified: 6
✓ Applications created/verified: 4
```

### 2. Verify Test Accounts
- [ ] Can log in with `volunteer.test@example.com` / `TestPassword123!`
- [ ] Can log in with `orgadmin.test@example.com` / `TestPassword123!`
- [ ] Can log in with `siteadmin.test@example.com` / `AdminPassword123!`
- [ ] Can log in with `qa.catalina@example.com` / `QAPassword123!`

### 3. Environment Check
- [ ] Frontend running: `http://localhost:5173` (or configured dev server)
- [ ] Backend running: `http://localhost:5000` (or configured Flask server)
- [ ] Database accessible and seeded with test data
- [ ] Browser console open to capture any JS errors
- [ ] Network tab open to monitor API calls

---

## Test Scenario 1: Volunteer Signup & Login (Session Persistence)

**Goal**: Verify signup flow, validation, and "Remember Me" functionality.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 1a | Click Sign Up on landing page | Sign Up form appears | [ ] Pass [ ] Fail |
| 1b | Try submitting with missing email | Error: "Email is required" | [ ] Pass [ ] Fail |
| 1c | Try submitting with invalid email format | Error: "Invalid email format" | [ ] Pass [ ] Fail |
| 1d | Try submitting with password < 8 chars | Error: "Password must be at least 8 characters" | [ ] Pass [ ] Fail |
| 1e | Fill form correctly without "Remember Me" | Success; redirect to onboarding | [ ] Pass [ ] Fail |
| 1f | Fill profile (skills, availability) and save | Redirect to Opportunities; profile saved | [ ] Pass [ ] Fail |
| 1g | **Close browser tab and reopen site** | Logged out (no session cookie) | [ ] Pass [ ] Fail |
| 1h | Sign up again and **check "Remember Me"** | Success; onboarding flow | [ ] Pass [ ] Fail |
| 1i | **Close browser tab and reopen site** | Still logged in (session cookie persists) | [ ] Pass [ ] Fail |
| 1j | Click Logout | Logged out and redirected to login | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No JavaScript errors in console
- [ ] Network requests show 200/201 status codes for signup/onboarding
- [ ] JWT token stored in localStorage/sessionStorage (as appropriate)

---

## Test Scenario 2: Opportunities Listing & Filters

**Goal**: Verify filtering accuracy, pagination, and display consistency.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 2a | Visit Opportunities page as logged-out user | See public published opportunities only | [ ] Pass [ ] Fail |
| 2b | Apply Location filter | Results filter correctly (count matches) | [ ] Pass [ ] Fail |
| 2c | Apply Skills filter | Results update to show only opportunities with selected skills | [ ] Pass [ ] Fail |
| 2d | Apply Date range filter | Results show only opportunities in selected date range | [ ] Pass [ ] Fail |
| 2e | Combine multiple filters (Location + Skills + Date) | All filters apply correctly; no duplicates | [ ] Pass [ ] Fail |
| 2f | Remove one filter | Results expand correctly (previously filtered items re-appear) | [ ] Pass [ ] Fail |
| 2g | Clear all filters | Full opportunity list returns | [ ] Pass [ ] Fail |
| 2h | Test search box (keyword search) | Results match keyword (title, description) | [ ] Pass [ ] Fail |
| 2i | Navigate to page 2 (if applicable) | Page 2 shows different opportunities, no overlap with page 1 | [ ] Pass [ ] Fail |
| 2j | Log in as org_admin and check My Org's opportunities | See draft + published; non-org users don't see draft | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No infinite scroll/loop issues
- [ ] API calls show correct query parameters
- [ ] No duplicate items across pagination

---

## Test Scenario 3: Apply to Opportunity (Normal Flow)

**Goal**: Verify application submission, validation, and confirmation.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 3a | Log in as `volunteer.test@example.com` | Dashboard shows "My Applications" | [ ] Pass [ ] Fail |
| 3b | Click on "Community Garden Workday" opportunity | Detail page shows all event details | [ ] Pass [ ] Fail |
| 3c | Click Apply button | Application form modal appears | [ ] Pass [ ] Fail |
| 3d | Try submitting without message | (If required) Error: "Message required" | [ ] Pass [ ] Fail |
| 3e | Add message & upload resume (PDF) | Form accepts file; preview shows | [ ] Pass [ ] Fail |
| 3f | Try uploading .exe file | Error: "Only PDF and DOC files allowed" | [ ] Pass [ ] Fail |
| 3g | Try uploading 10MB file | Error: "File must be under 5MB" | [ ] Pass [ ] Fail |
| 3h | Submit valid application | Confirmation page shows; status "Pending" | [ ] Pass [ ] Fail |
| 3i | Navigate to "My Applications" | Application appears with status "Pending" | [ ] Pass [ ] Fail |
| 3j | Check email (test inbox) | Confirmation email received with event details | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] File upload shows progress indication
- [ ] API POST to `/applications` returns 201 Created
- [ ] Confirmation email template populates correctly (volunteer name, event details)

---

## Test Scenario 4: Apply Twice to Same Opportunity (Duplicate Prevention)

**Goal**: Ensure duplicate applications are blocked.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 4a | From "My Applications", re-click "Apply" on same opportunity | Error modal: "You have already applied to this opportunity" | [ ] Pass [ ] Fail |
| 4b | Or navigate back to opportunity detail | Apply button is hidden/disabled with message "Already Applied" | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] API returns 400 Bad Request or 409 Conflict with clear error message
- [ ] No duplicate DB entries

---

## Test Scenario 5: Apply After Deadline (Edge Case)

**Goal**: Verify deadline enforcement.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 5a | Log in as volunteer | View Opportunities | [ ] Pass [ ] Fail |
| 5b | Look for "Environmental Cleanup Drive" (past deadline) | Apply button is disabled or hidden | [ ] Pass [ ] Fail |
| 5c | Try to manually call API to apply | API returns 400: "Application deadline has passed" | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Disabled state renders correctly
- [ ] Helpful error message displayed to user

---

## Test Scenario 6: Apply to Full-Capacity Opportunity (Edge Case)

**Goal**: Verify capacity validation.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 6a | Log in as volunteer | View Opportunities | [ ] Pass [ ] Fail |
| 6b | Look for "Full Capacity Opportunity" | Apply button is disabled or shows "Capacity Reached" | [ ] Pass [ ] Fail |
| 6c | Try to manually call API to apply | API returns 400: "This opportunity has reached capacity" | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Capacity displays accurately in UI
- [ ] Disabled state is clear to user

---

## Test Scenario 7: Organization Admin Review & Accept Application

**Goal**: Verify org admin can review, accept, and send notifications.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 7a | Log in as `orgadmin.test@example.com` | Dashboard shows "Applications" tab | [ ] Pass [ ] Fail |
| 7b | Click Applications tab | Pending applications for org's opportunities display | [ ] Pass [ ] Fail |
| 7c | Click on "Community Garden Workday" application (from volunteer.test) | Application detail shows: volunteer name, profile link, message, resume link | [ ] Pass [ ] Fail |
| 7d | Click Accept button | Modal appears for optional acceptance message | [ ] Pass [ ] Fail |
| 7e | Add welcome message and click Send & Accept | Status changes to "Accepted" (green badge) | [ ] Pass [ ] Fail |
| 7f | Check confirmation message | "Volunteer notified" message appears | [ ] Pass [ ] Fail |
| 7g | Verify capacity decreased | Opportunity capacity shows as reduced | [ ] Pass [ ] Fail |
| 7h | Check email (volunteer's inbox) | Email received with welcome message and event details | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] API PATCH to `/applications/{id}` returns 200 OK
- [ ] Email template includes volunteer name, org name, event date/time
- [ ] Capacity update reflects in real-time

---

## Test Scenario 8: Organization Admin Reject Application

**Goal**: Verify org admin can reject with optional message.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 8a | Log in as `orgadmin.test@example.com` | Applications list visible | [ ] Pass [ ] Fail |
| 8b | Find an application from `volunteer2.test` to "Community Garden Workday" | Application detail displays | [ ] Pass [ ] Fail |
| 8c | Click Reject button | Modal appears for optional rejection message | [ ] Pass [ ] Fail |
| 8d | Add message (e.g., "Thanks for applying; we've selected other candidates") and click Send & Reject | Status changes to "Rejected" (red badge) | [ ] Pass [ ] Fail |
| 8e | Check email (volunteer's inbox) | Rejection email received with message | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Rejection email delivered correctly
- [ ] Status persists after page refresh

---

## Test Scenario 9: Concurrent Application Review (Race Condition)

**Goal**: Ensure two org admins accepting the same application is handled gracefully.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 9a | Open the same application detail in **two browser windows** (both logged in as org admins) | Both see "Pending" status | [ ] Pass [ ] Fail |
| 9b | In **Window 1**, click Accept and confirm | Status → "Accepted" | [ ] Pass [ ] Fail |
| 9c | Refresh **Window 2** | Status now shows "Accepted" (not stale) | [ ] Pass [ ] Fail |
| 9d | In **Window 2**, try to click Accept again | Error: "This application has already been reviewed" or status already shows accepted | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No double-acceptance records in database
- [ ] Audit log shows single acceptance

---

## Test Scenario 10: Organization Member Invite & Accept

**Goal**: Verify member invitation and acceptance flow.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 10a | Log in as `orgadmin.test@example.com` | Organization Dashboard visible | [ ] Pass [ ] Fail |
| 10b | Click Members tab | Current members list displays | [ ] Pass [ ] Fail |
| 10c | Click "Invite Member" button | Invite form appears | [ ] Pass [ ] Fail |
| 10d | Try inviting without email | Error: "Email is required" | [ ] Pass [ ] Fail |
| 10e | Invite `volunteer2.test@example.com` with role "Member" | Success message; invited member shows as "Pending" | [ ] Pass [ ] Fail |
| 10f | Check email (invited user's inbox) | Invitation email received with acceptance link | [ ] Pass [ ] Fail |
| 10g | Click link in email | Redirects to login/accept page | [ ] Pass [ ] Fail |
| 10h | Accept invite (provide or auto-populate token) | Success message; user now org member | [ ] Pass [ ] Fail |
| 10i | Invited user logs in | Can now see organization dashboard/opportunities | [ ] Pass [ ] Fail |
| 10j | Test invite expiration (after 7 days, manually test with old token) | Error: "Invitation link has expired" | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Invite token is securely generated (no predictable patterns)
- [ ] Token validated on acceptance

---

## Test Scenario 11: Site Admin User Management

**Goal**: Verify site admin can manage users and roles.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 11a | Log in as `siteadmin.test@example.com` | Admin Console visible | [ ] Pass [ ] Fail |
| 11b | Click User Management | User search/list appears | [ ] Pass [ ] Fail |
| 11c | Search for "volunteer.test" | User found and displayed | [ ] Pass [ ] Fail |
| 11d | Click on user detail | User info shows: name, email, current role, status | [ ] Pass [ ] Fail |
| 11e | Click "Change Role" button | Role dropdown appears with options: Volunteer, Org Admin, Site Admin | [ ] Pass [ ] Fail |
| 11f | Select "Org Admin" and click Confirm | Confirmation modal appears; asks "Are you sure?" | [ ] Pass [ ] Fail |
| 11g | Click Confirm in modal | Role updated to "Org Admin"; confirmation message shows | [ ] Pass [ ] Fail |
| 11h | Check audit log or notification | Role change is logged with timestamp and admin name | [ ] Pass [ ] Fail |
| 11i | User receives email notification | Email informs of role change | [ ] Pass [ ] Fail |
| 11j | Test Suspend User | Click Suspend; confirmation modal appears; user status → Suspended | [ ] Pass [ ] Fail |
| 11k | Suspended user tries to log in | Login fails: "Your account has been suspended. Contact support." | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Irreversible actions (Suspend, Role Change) require confirmation
- [ ] Audit log entries created for each action

---

## Test Scenario 12: Site Admin Organization Management

**Goal**: Verify site admin can view/manage organizations.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 12a | Log in as `siteadmin.test@example.com` | Admin Console visible | [ ] Pass [ ] Fail |
| 12b | Click Organization Management | Org list appears with search | [ ] Pass [ ] Fail |
| 12c | Search for "Green Community" | Organization found | [ ] Pass [ ] Fail |
| 12d | Click on org detail | Org info shows: name, description, members, opportunities count, contact email | [ ] Pass [ ] Fail |
| 12e | Click "Transfer Ownership" or "Assign New Admin" | Modal appears to select new admin user | [ ] Pass [ ] Fail |
| 12f | Select a user and confirm | Ownership transferred; old admin loses admin rights (if applicable) | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Org management actions are logged

---

## Test Scenario 13: Notifications & Email Verification

**Goal**: Verify in-app notifications and email delivery.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 13a | Log in as `volunteer.test@example.com` | Notification bell/icon visible in header | [ ] Pass [ ] Fail |
| 13b | Perform actions: apply, receive acceptance, etc. | Notifications accumulate in notification center | [ ] Pass [ ] Fail |
| 13c | Click notification | Navigates to relevant page (e.g., application detail) | [ ] Pass [ ] Fail |
| 13d | Check all sent emails (test inbox) | Emails for signup, application confirmation, acceptance, rejections delivered | [ ] Pass [ ] Fail |
| 13e | Open an email | Template populates correctly: recipient name, event details, organization name | [ ] Pass [ ] Fail |
| 13f | Click "Unsubscribe" link in email | Unsubscribe works; preference saved | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No email delivery errors in server logs
- [ ] Template placeholders replaced correctly

---

## Test Scenario 14: Password Reset Flow

**Goal**: Verify password reset email and flow.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 14a | On login page, click "Forgot Password?" | Password reset form appears | [ ] Pass [ ] Fail |
| 14b | Enter email `volunteer.test@example.com` | Success message: "Check your email for reset link" | [ ] Pass [ ] Fail |
| 14c | Check email inbox | Reset link email received | [ ] Pass [ ] Fail |
| 14d | Click reset link in email | Redirects to password reset page with token validation | [ ] Pass [ ] Fail |
| 14e | Try invalid token (manually modify URL) | Error: "Link has expired or is invalid" | [ ] Pass [ ] Fail |
| 14f | Use valid link and enter new password (twice) | Success message; redirects to login | [ ] Pass [ ] Fail |
| 14g | Log in with new password | Login succeeds | [ ] Pass [ ] Fail |
| 14h | Try to reuse old password | Login fails | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] Reset token is securely generated
- [ ] Token expires after 24 hours (test if possible)

---

## Test Scenario 15: Accessibility & Keyboard Navigation

**Goal**: Verify accessibility standards and keyboard-only usage.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 15a | Disable mouse; use only keyboard Tab/Shift+Tab | Can navigate all form fields and buttons | [ ] Pass [ ] Fail |
| 15b | Tab to a form field | Focus ring (blue outline) clearly visible | [ ] Pass [ ] Fail |
| 15c | Tab through buttons | All buttons reachable and clickable with Enter | [ ] Pass [ ] Fail |
| 15d | Open navigation menu (if keyboard-accessible) | Menu opens with keyboard; can tab through items | [ ] Pass [ ] Fail |
| 15e | Test with screen reader (e.g., NVDA on Windows) | Form labels read correctly; buttons have descriptive text | [ ] Pass [ ] Fail |
| 15f | Check color contrast (use contrast checker tool) | Text on background meets WCAG AA standard (4.5:1 for normal text) | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No accessibility console warnings (ARIA, role attributes)

---

## Test Scenario 16: Mobile Responsiveness (375px width – iPhone SE)

**Goal**: Verify mobile layouts and touch interactions.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 16a | Resize browser to 375px (or use device emulation) | Layout adapts: single-column, menu collapses to hamburger | [ ] Pass [ ] Fail |
| 16b | Test form input (e.g., Sign Up) | Input fields are touch-friendly (adequate size, spacing) | [ ] Pass [ ] Fail |
| 16c | Click hamburger menu | Menu toggles open/closed | [ ] Pass [ ] Fail |
| 16d | Test button clicks | All buttons are clickable (no misaligned touch targets) | [ ] Pass [ ] Fail |
| 16e | Scroll through opportunity list | No horizontal scroll needed; content fits width | [ ] Pass [ ] Fail |
| 16f | Test file upload on mobile | File picker opens; uploads work | [ ] Pass [ ] Fail |
| 16g | Read text without zoom | Text is readable at default size (12px+ recommended) | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No layout warnings or console errors

---

## Test Scenario 17: Session Security & Token Management

**Goal**: Verify JWT tokens and session security.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 17a | Log in normally | JWT token stored (check localStorage in DevTools) | [ ] Pass [ ] Fail |
| 17b | Token in localStorage | Token is not human-readable (Base64-encoded JWT) | [ ] Pass [ ] Fail |
| 17c | Open DevTools Network tab and make API call | Authorization header includes "Bearer [token]" | [ ] Pass [ ] Fail |
| 17d | Manually delete JWT from localStorage | User gets logged out on next page action | [ ] Pass [ ] Fail |
| 17e | Manually modify JWT token | API calls fail with 401 Unauthorized | [ ] Pass [ ] Fail |
| 17f | Set token to extremely old expiry | System recognizes token as expired; forces re-login | [ ] Pass [ ] Fail |
| 17g | Log out | Token removed from localStorage | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No sensitive data in logs or Network tab (passwords, private data)
- [ ] HTTPS used (if testing in production)

---

## Test Scenario 18: Input Validation & Security (Injection Tests)

**Goal**: Verify input validation and protection against common attacks.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 18a | Try SQL injection in search box (e.g., `" OR "1"="1`) | Search returns no results or error; database unaffected | [ ] Pass [ ] Fail |
| 18b | Try XSS in message/text field (e.g., `<script>alert('XSS')</script>`) | Script does not execute; text is escaped and displays safely | [ ] Pass [ ] Fail |
| 18c | Try oversized input (10,000 characters in message field) | Input is truncated or error shown; no server crash | [ ] Pass [ ] Fail |
| 18d | Try negative number in capacity field (if editable) | Error: "Capacity must be positive" | [ ] Pass [ ] Fail |
| 18e | Try HTML in form fields (e.g., `<b>bold text</b>`) | HTML is escaped; displays as plain text | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No errors or security warnings

---

## Test Scenario 19: Performance & Load Time

**Goal**: Verify page load times and performance.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 19a | Open DevTools Performance tab; load Opportunities page | Page loads in < 2 seconds (aim for < 1.5s) | [ ] Pass [ ] Fail |
| 19b | Check Network tab for requests | Large assets (images) are optimized/compressed | [ ] Pass [ ] Fail |
| 19c | Scroll through opportunity list (many items) | No lag or jank; smooth scrolling at 60 FPS | [ ] Pass [ ] Fail |
| 19d | Apply multiple filters in quick succession | UI remains responsive; no freezing | [ ] Pass [ ] Fail |
| 19e | Check for unused JavaScript bundles | No extraneous large bundles; code splitting used where applicable | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] No excessive console warnings or errors
- [ ] Memory usage stable (no leaks on repeated actions)

---

## Test Scenario 20: Draft Opportunities (Admin Only)

**Goal**: Verify draft opportunities are hidden from public but visible to org admins.

**Test Steps**:

| # | Action | Expected Result | Status |
|---|--------|-----------------|--------|
| 20a | Log out (or as volunteer) and view Opportunities | "Draft Opportunity (Not Published)" does NOT appear in list | [ ] Pass [ ] Fail |
| 20b | Log in as `orgadmin.test@example.com` | Dashboard visible | [ ] Pass [ ] Fail |
| 20c | Click Opportunities tab | Draft opportunity appears with "Draft" badge | [ ] Pass [ ] Fail |
| 20d | Can edit draft opportunity (change title, etc.) | Changes save | [ ] Pass [ ] Fail |
| 20e | Publish draft | Status → "Published"; now visible to volunteers | [ ] Pass [ ] Fail |
| 20f | Volunteer can now see and apply | Application succeeds | [ ] Pass [ ] Fail |

**Console Check**:
- [ ] API respects `status=draft` filtering

---

## Issue Reporting Template

When issues are found during testing, use this format:

```
**Test Scenario**: [Number and name]
**Severity**: [Critical/High/Medium/Low]
**Environment**: [Development/Staging]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Console Errors**: [Any relevant error messages or stack traces]
**Screenshots/Attachments**: [Attach screenshot or video clip]
**Browser & OS**: [e.g., Chrome 120 on Windows 10]
```

---

## Sign-Off

Once all test scenarios pass, print and sign this checklist:

**QA Tester**: ________________________  
**Date Tested**: ________________________  
**Build/Version**: ________________________  
**Notes**:  
_________________________________________________________________

**Sign-Off**: I confirm that the above test scenarios have been executed and results documented. Any issues found have been reported to the development team.

**Signature**: ________________________

---

## Appendix: Quick Command Reference

### Reset Test Data
```bash
cd app/server
flask db downgrade  # (or delete instance/db.sqlite)
flask db upgrade
python scripts/seed_test_data.py
```

### View Database (SQLite)
```bash
cd app/server
sqlite3 instance/app.db
sqlite> .tables
sqlite> SELECT email, user_type FROM user LIMIT 5;
```

### Monitor Logs
```bash
# Backend logs
tail -f /var/log/volunteerhub.err.log

# Frontend (open DevTools Console)
# Check for errors and API responses
```

### Test Email Delivery (Local Dev)
- If using a mail service (SendGrid, Mailgun), check dashboard.
- If using local SMTP, check server logs for email output.
- Use test email service like Mailhog or MailCatcher for local testing.

---

**End of QA Checklist**
