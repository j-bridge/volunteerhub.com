# VolunteerHub — QA Test Script (Frontend → Backend Routes, FINAL)

**Scope:** Functional QA mapping from UI flows to the real Flask endpoints in `app/server/app/*`.  
**Base URL:** `${VITE_API_URL}` (example: `http://127.0.0.1:5000`)  
**API Prefix:** All business APIs are under `/api/*` via blueprints registered in `app/__init__.py`.  
**Auth:** JWT (access/refresh). Access token required for protected routes. Some routes require specific roles.

---

## Health Check (for dev sanity)
- **GET** `/health` → `200 {"status":"ok"}` (no auth)

---

## Auth (`/api/auth/*`)
Implemented in `app/auth/routes.py`.

| # | User Flow | HTTP | Endpoint | Auth | Request (example) | Success (status & body) | Failure |
|---|-----------|------|----------|------|-------------------|--------------------------|---------|
| A1 | Register | POST | `/api/auth/register` | No | `{"email":"user@x.com","password":"Passw0rd!","role":"volunteer"}` | **201** `{"user": {...}, "tokens": {"access_token":"...","refresh_token":"..."}}` | **400** missing creds, **409** email exists |
| A2 | Login | POST | `/api/auth/login` | No | `{"email":"user@x.com","password":"Passw0rd!"}` | **200** `{"user": {...}, "tokens": {"access_token":"...","refresh_token":"..."}}` | **400/401** invalid creds |
| A3 | Refresh access token | POST | `/api/auth/refresh` | **Refresh token required** | — | **200** `{"access_token":"...","refresh_token":"..."}` | **401** invalid/expired refresh |

**Notes:**  
- Passwords are hashed with Bcrypt.  
- Tokens include role claim (e.g., `"role":"admin"`).

---

## Users (`/api/users/*`)
Implemented in `app/users/routes.py`.

| # | User Flow | HTTP | Endpoint | Auth | Request (example) | Success | Failure |
|---|-----------|------|----------|-----|-------------------|---------|---------|
| U1 | List users (admin) | GET | `/api/users/` | **Access + admin** | — | **200** `{"users":[...]}` | **403** (non-admin) |
| U2 | Get me | GET | `/api/users/me` | **Access** | — | **200** `{"user": {...}}` | **401** no/invalid token |
| U3 | Update me | PATCH | `/api/users/me` | **Access** | `{"name":"New Name"}` (optionally `"role"` but only admin can change roles) | **200** `{"user": {...}}` | **400/401** |
| U4 | Get user by id | GET | `/api/users/<id>` | **Access** | — | **200** `{"user": {...}}` (self or admin) | **403** forbidden, **404** not found |

**Notes:**  
- `GET /me`/`PATCH /me` are the main profile endpoints for UI.

---

## Organizations (`/api/orgs/*`)
Implemented in `app/orgs/routes.py`.

| # | User Flow | HTTP | Endpoint | Auth | Request (example) | Success | Failure |
|---|-----------|------|----------|------|-------------------|---------|---------|
| O1 | List orgs | GET | `/api/orgs/` | Public | — | **200** `{"organizations":[...]}` | — |
| O2 | Create org | POST | `/api/orgs/` | **Access + admin** | `{"name":"Habitat","contact_email":"hi@org.org","description":"..."}` | **201** `{"organization": {...}}` | **400/403** |
| O3 | Retrieve org | GET | `/api/orgs/<org_id>` | Public | — | **200** `{"organization": {...}}` | **404** |
| O4 | Update org | PATCH | `/api/orgs/<org_id>` | **Access + admin** | Any of: `"name","contact_email","description","owner_id","is_active"` | **200** `{"organization": {...}}` | **404/403** |

**Notes:**  
- No delete endpoint is defined in this diff.

---

## Opportunities (`/api/opportunities/*`)
Implemented in `app/opportunities/routes.py`.

| # | User Flow | HTTP | Endpoint | Auth | Request (example) | Success | Failure |
|---|-----------|------|----------|------|-------------------|---------|---------|
| OP1 | List opportunities | GET | `/api/opportunities/` | Public | — | **200** `{"opportunities":[...]}` | — |
| OP2 | Create opportunity | POST | `/api/opportunities/` | **Access + role:** `organization` or `admin` | `{"title":"Beach Cleanup","description":"...","location":"NC","start_date":"2025-11-10T09:00:00","end_date":"2025-11-10T12:00:00","organization_id":1}` | **201** `{"opportunity": {...}}` | **400** missing `title`/`organization_id`, **403** role |
| OP3 | Retrieve opportunity | GET | `/api/opportunities/<id>` | Public | — | **200** `{"opportunity": {...}}` | **404** |

**Notes:**  
- Dates are parsed via `datetime.fromisoformat`. Invalid strings become `null`.

---

## Applications (`/api/applications/*`)
Implemented in `app/applications/routes.py`.

| # | User Flow | HTTP | Endpoint | Auth | Request (example) | Success | Failure |
|---|-----------|------|----------|------|-------------------|---------|---------|
| AP1 | List all applications (admin) | GET | `/api/applications/` | **Access + admin** | — | **200** `{"applications":[...]}` | **403** |
| AP2 | List my applications | GET | `/api/applications/my` | **Access** | — | **200** `{"applications":[...]}` | **401** |
| AP3 | Create application | POST | `/api/applications/` | **Access** | `{"opportunity_id": 123}` | **201** `{"application": {...}}` | **400** missing `opportunity_id`, **409** duplicate |
| AP4 | Update application status | PATCH | `/api/applications/<id>` | **Access + role:** `admin` or `organization` | `{"status":"approved"}` (or other valid statuses) | **200** `{"application": {...}}` | **404** not found, **403** role |

**Notes:**  
- There is **no withdraw/delete endpoint** in this diff; volunteers cannot delete applications via API here.  
- Duplicate submissions return **409**.

---

## Frontend Mapping (what to test in UI)

| UI Area (example) | Intent | Method → Endpoint | Auth/Role | Expected Result |
|---|---|---|---|---|
| Login page | Sign in | **POST** `/api/auth/login` | none | 200 + tokens; redirect to dashboard |
| Register page | Create account | **POST** `/api/auth/register` | none | 201 + tokens (or prompt to login) |
| Token handling | Refresh token | **POST** `/api/auth/refresh` | refresh | New access token; retried request succeeds |
| Profile page | View “Me” | **GET** `/api/users/me` | access | 200 user payload renders |
| Edit profile | Update “Me” | **PATCH** `/api/users/me` | access | 200 updated user, toast shown |
| Admin → Users | List users | **GET** `/api/users/` | access + admin | 200 list of users |
| Orgs list | Browse | **GET** `/api/orgs/` | public | 200 list of orgs |
| Orgs detail | View | **GET** `/api/orgs/{id}` | public | 200 org detail |
| Admin → New Org | Create | **POST** `/api/orgs/` | access + admin | 201 org; shows in list |
| Admin → Edit Org | Update | **PATCH** `/api/orgs/{id}` | access + admin | 200 updated org |
| Opps list | Browse | **GET** `/api/opportunities/` | public | 200 list of opportunities |
| Opps detail | View | **GET** `/api/opportunities/{id}` | public | 200 detail |
| Org/Admin → New Opp | Create | **POST** `/api/opportunities/` | access + org/admin | 201 opportunity |
| My Applications | List mine | **GET** `/api/applications/my` | access | 200 list of my applications |
| Apply CTA | Apply | **POST** `/api/applications/` | access | 201 application; CTA/state updates |
| Admin/Org → Review App | Update status | **PATCH** `/api/applications/{id}` | access + admin/org | 200 application with new status |

---

## Positive Test Cases (Happy Paths)

1. **Register → Login → Profile:** register (**201**), login (**200**), then `GET /users/me` (**200**).  
2. **Orgs CRUD (admin):** list (**200**), create (**201**), update (**200**), retrieve (**200**).  
3. **Opportunities:** list (**200**), create as org/admin (**201**), retrieve (**200**).  
4. **Applications:** apply (**201**) then see in `GET /applications/my` (**200**).  
5. **Token Refresh:** call a protected route after access token expiry → interceptor refreshes (**200**) and retries OK.

---

## Negative / Edge Cases

- **Auth:** wrong password → **401**; missing tokens on protected routes → **401**.  
- **Role:** non-admin hitting `/api/users/` or POST `/api/orgs/` → **403**.  
- **Validation:** creating org with empty name → **400**.  
- **Duplicate:** applying to the same opportunity twice → **409**.  
- **Not Found:** retrieving non-existent user/org/opportunity/application → **404**.

---

## Quick cURL Smoke Tests

```bash
# Health
curl -s http://127.0.0.1:5000/health

# Register (adjust email to avoid 409)
curl -sX POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"qa1@example.com","password":"Passw0rd!","role":"volunteer"}'

# Login
TOKENS=$(curl -sX POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"qa1@example.com","password":"Passw0rd!"}')
ACCESS=$(echo "$TOKENS" | python -c 'import sys,json; print(json.load(sys.stdin)["tokens"]["access_token"])')

# Me
curl -sH "Authorization: Bearer $ACCESS" http://127.0.0.1:5000/api/users/me

# Public orgs list
curl -s http://127.0.0.1:5000/api/orgs/

# My applications
curl -sH "Authorization: Bearer $ACCESS" http://127.0.0.1:5000/api/applications/my
