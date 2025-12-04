# VolunteerHub Test Data Seed Setup Guide

**Purpose**: Quickly populate the development database with repeatable test data for QA walkthrough and manual testing.

---

## Quick Start (3 Steps)

### 1. Navigate to Backend Directory
```bash
cd app/server
```

### 2. Activate Virtual Environment (if not already active)
```bash
# On Linux/macOS
source .venv/bin/activate

# On Windows
.\.venv\Scripts\Activate.ps1
```

### 3. Run the Seed Script
```bash
python scripts/seed_test_data.py
```

### Expected Output
```
🌱 VolunteerHub Test Data Seeding Script
============================================================

[INFO] Starting seeding process...
[INFO] Environment: development
[INFO] Database: sqlite:///instance/app.db

[SEED] Creating test users...
  ✓ Created user: volunteer.test@example.com (type: volunteer)
  ✓ Created user: volunteer2.test@example.com (type: volunteer)
  ✓ Created user: orgadmin.test@example.com (type: org_admin)
  ✓ Created user: orgadmin2.test@example.com (type: org_admin)
  ✓ Created user: siteadmin.test@example.com (type: site_admin)
  ✓ Created user: qa.catalina@example.com (type: qa)

[SEED] Creating test organizations...
  ✓ Created organization: Green Community Initiative
  ✓ Added orgadmin.test@example.com to Green Community Initiative as admin
  ✓ Added volunteer.test@example.com to Green Community Initiative as member
  ... (more organizations)

[SEED] Creating test opportunities...
  ✓ Created opportunity: Community Garden Workday (published)
  ✓ Created opportunity: After-School Tutoring Program (published)
  ... (more opportunities)

[SEED] Creating test applications...
  ✓ Created application: volunteer.test@example.com → Community Garden Workday (pending)
  ... (more applications)

============================================================
SEEDING SUMMARY
============================================================
✓ Users created/verified: 6
✓ Organizations created/verified: 3
✓ Opportunities created/verified: 6
✓ Applications created/verified: 4

------------------------------------------------------------
TEST ACCOUNT CREDENTIALS (use for testing)
------------------------------------------------------------

**Volunteer Account:**
  Email: volunteer.test@example.com
  Password: TestPassword123!

**Organization Admin Account:**
  Email: orgadmin.test@example.com
  Password: TestPassword123!

**Site Admin Account:**
  Email: siteadmin.test@example.com
  Password: AdminPassword123!

**QA Account:**
  Email: qa.catalina@example.com
  Password: QAPassword123!

------------------------------------------------------------
SEEDING COMPLETE
============================================================

✅ Seeding successful! You can now use the test accounts to explore the platform.
```

---

## Test Accounts Overview

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Volunteer | `volunteer.test@example.com` | `TestPassword123!` | Browse opportunities, apply, track applications |
| Volunteer 2 | `volunteer2.test@example.com` | `TestPassword123!` | Test multiple volunteers & concurrent workflows |
| Org Admin | `orgadmin.test@example.com` | `TestPassword123!` | Create/edit opportunities, review applications |
| Org Admin 2 | `orgadmin2.test@example.com` | `TestPassword123!` | Test multi-org scenarios |
| Site Admin | `siteadmin.test@example.com` | `AdminPassword123!` | User/org management, site-wide operations |
| QA | `qa.catalina@example.com` | `QAPassword123!` | QA-specific test account with read/write access to test data |

---

## Seeded Test Data Details

### Organizations (3)
1. **Green Community Initiative**
   - Description: Environmental conservation and community gardening programs.
   - Admin: `orgadmin.test@example.com`
   - Members: `volunteer.test@example.com` (member)

2. **Youth Education Alliance**
   - Description: Providing educational support and mentoring to underserved youth.
   - Admin: `orgadmin2.test@example.com`
   - Members: `volunteer2.test@example.com` (member)

3. **Local Food Bank**
   - Description: Fighting food insecurity and promoting nutrition awareness.
   - Admin: `orgadmin.test@example.com`

### Opportunities (6)
| Title | Organization | Date | Status | Purpose |
|-------|---|------|--------|---------|
| Community Garden Workday | Green Community Initiative | 21 days from now | Published | Normal published opportunity for testing apply flow |
| After-School Tutoring Program | Youth Education Alliance | 7 days from now | Published | Another published opportunity |
| Weekend Food Distribution | Local Food Bank | 3 days from now | Published | Short deadline for testing urgency |
| Environmental Cleanup Drive | Green Community Initiative | 5 days past | Closed | Past event for testing deadline validation |
| Full Capacity Opportunity | Youth Education Alliance | 15 days from now | Published | For testing capacity enforcement (2 capacity) |
| Draft Opportunity (Not Published) | Green Community Initiative | 30 days from now | Draft | For testing draft visibility rules |

### Applications (4)
| Volunteer | Opportunity | Status | Notes |
|-----------|-------------|--------|-------|
| volunteer.test | Community Garden Workday | Pending | For testing org admin review flow |
| volunteer2.test | After-School Tutoring Program | Pending | For testing concurrent review |
| volunteer.test | Weekend Food Distribution | Accepted | For testing accepted status in My Applications |
| volunteer2.test | Community Garden Workday | Rejected | For testing rejected status & history |

---

## Reset & Reseed (Full Refresh)

If you need to clear and re-seed from scratch:

### Option A: Delete Database (SQLite)
```bash
cd app/server
rm instance/app.db
flask db upgrade
python scripts/seed_test_data.py
```

### Option B: Database Downgrade & Upgrade
```bash
cd app/server
flask db downgrade  # Reverts migrations
flask db upgrade    # Reapplies migrations
python scripts/seed_test_data.py
```

### Option C: Clear Specific Tables (Advanced)
```bash
cd app/server
sqlite3 instance/app.db

sqlite> DELETE FROM application;
sqlite> DELETE FROM opportunity;
sqlite> DELETE FROM organization_member;
sqlite> DELETE FROM organization;
sqlite> DELETE FROM user;

sqlite> .quit
```

Then re-run:
```bash
python scripts/seed_test_data.py
```

---

## Idempotency

The seed script is **idempotent**—running it multiple times will not create duplicates:

- Checks if user email already exists before creating.
- Checks if organization name already exists before creating.
- Checks if opportunity/application already exists before creating.

**Result**: Safe to run `python scripts/seed_test_data.py` repeatedly without side effects.

---

## Customization

Edit `scripts/seed_test_data.py` to customize:
- User details (name, email, password, role)
- Organization details (name, description, contact)
- Opportunity details (title, date, capacity, skills)
- Application statuses (pending, accepted, rejected)

After edits, reset and re-seed:
```bash
rm instance/app.db
flask db upgrade
python scripts/seed_test_data.py
```

---

## Troubleshooting

### Error: "ModuleNotFoundError: No module named 'app'"
- Ensure you're in `app/server/` directory.
- Check that virtual environment is activated.
- Verify `__init__.py` exists in `app/` folder.

### Error: "Database is locked"
- Close any other DB connections (other terminal tabs, SQLite clients).
- If persists, delete `instance/app.db` and re-run.

### Error: "Flask app not initialized"
- Set `FLASK_ENV=development` before running (optional; defaults to development).
- Ensure Flask app is properly configured in `app/__init__.py`.

### User Emails Not Sending (Local Dev)
- Seed script doesn't send real emails; check app configuration for email backend.
- In development, emails may be logged or sent to a test service (Mailhog, MailCatcher).

---

## Integration with CI/CD

For automated testing in CI/CD pipelines, consider:

```bash
# In CI/CD pipeline (e.g., GitHub Actions)
cd app/server
python -m pytest tests/  # Run unit tests with seeded data
python -m pytest tests/integration/  # Run integration tests
```

---

## Next Steps

1. **Run the seed script**: `python scripts/seed_test_data.py`
2. **Start the app**:
   ```bash
   # Backend (in app/server/)
   flask run --debug

   # Frontend (in app/client/)
   npm run dev
   ```
3. **Log in** with one of the test accounts above.
4. **Follow the walkthrough script**: `docs/walkthrough_script.md`
5. **Use the QA checklist**: `docs/qa_test_checklist.md` for detailed test scenarios.

---

## Questions?

Refer to:
- **Walkthrough Script**: `docs/walkthrough_script.md` (voiceover + visual cues)
- **QA Checklist**: `docs/qa_test_checklist.md` (detailed test scenarios)
- **Project README**: `README.md` (general setup & architecture)

---

**Last Updated**: December 3, 2025  
**Seed Script Version**: 1.0  
**Status**: Production-Ready
