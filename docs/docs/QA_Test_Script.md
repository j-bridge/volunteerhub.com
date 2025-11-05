# VolunteerHub — QA Test Script (Frontend → Backend Routes)

**Scope:** Map user flows in the UI to API endpoints for functional QA.  
**Base URL:** `${VITE_API_URL}` (e.g., `http://localhost:5000/api`)  
**Auth:** Bearer access token (set by axios interceptor) unless noted.  
**Test Data:** Use one test org, one test user (volunteer), and one opportunity.

---

## Master Mapping Table

| # | Frontend Component | User Action | HTTP | Backend Endpoint | Auth | Request (example) | Success (status & body) | Failure (status) | Test Steps | Expected Result | Notes |
|---|--------------------|-------------|------|------------------|------|-------------------|--------------------------|------------------|-------------|-----------------|-------|
| 1 | `Auth/Login.jsx` | Log in | POST | `/auth/login` | No | `{"email":"user@example.com","password":"Passw0rd!"}` | **200** `{access_token, refresh_token, user}` | **401** invalid creds | Open Login → enter valid creds → Submit | Redirect to dashboard; token stored | Verify axios adds `Authorization: Bearer` |
| 2 | `Auth/Register.jsx` | Register new user | POST | `/auth/register` | No | `{"name":"Jane","email":"jane@x.com","password":"Passw0rd!","role":"volunteer"}` | **201** `{user, tokens}` | **400/409** | Sign Up → fill → Submit | Account created; optionally auto-login | Confirm required fields/roles |
| 3 | `api/axios.js` (interceptor) | Refresh access token | POST | `/auth/refresh` | Refresh only | — | **200** `{access_token}` | **401** expired/invalid | Let token expire and trigger a protected call | Request retried successfully | Check refresh storage (cookie vs memory) |
| 4 | `Profile/Profile.jsx` | Get current user profile | GET | `/users/me` | Yes | — | **200** `{user}` | **401** missing/invalid | Navigate to Profile | Profile renders | Endpoint could be `/users/{id}` |
| 5 | `Profile/EditProfile.jsx` | Update current profile | PATCH | `/users/me` | Yes | `{"name":"New Name"}` | **200** `{user}` | **400/401** | Edit → Save | Toast success; fields update | Some APIs use PUT |
| 6 | `Opportunities/List.jsx` | List/search opportunities | GET | `/opportunities?search=&page=&tag=` | Optional | — | **200** `{items, page, total}` | **400** bad query | Open Opportunities; search/filter | List updates; pagination works | Verify param names |
| 7 | `Opportunities/Detail.jsx` | Get single opportunity | GET | `/opportunities/{id}` | Optional | — | **200** `{opportunity}` | **404** not found | Click opportunity | Detail renders | — |
| 8 | `Opportunities/Create.jsx` | Create opportunity (org/admin) | POST | `/opportunities` | Yes | `{"title":"Beach Cleanup","date":"2025-11-10","location":"NC","description":"..."}` | **201** `{opportunity}` | **400/403** | Login as org → New → Submit | Redirect to detail; success toast | Verify required schema |
| 9 | `Opportunities/Edit.jsx` | Update opportunity | PUT | `/opportunities/{id}` | Yes | `{"title":"Updated title"}` | **200** `{opportunity}` | **400/403/404** | Edit → Save | Changes persist & reflect | Could be PATCH |
|10 | `Opportunities/List.jsx` | Delete opportunity | DELETE | `/opportunities/{id}` | Yes | — | **204** | **403/404** | Click Delete | Row removed | Confirm soft vs hard delete |
|11 | `Opportunities/Detail.jsx` | Apply to opportunity | POST | `/applications` | Yes | `{"opportunity_id":"<id>"}` | **201** `{application}` | **400/401** | Volunteer → click Apply | Button toggles to “Withdraw” | — |
|12 | `Profile/Applications.jsx` | List my applications | GET | `/applications?user=me` | Yes | — | **200** `{items}` | **401** | Open “My Applications” | Applications render with status | Param may differ |
|13 | `Opportunities/Detail.jsx` | Withdraw application | DELETE | `/applications/{id}` | Yes | — | **204** | **403/404** | Click “Withdraw” | Button returns to Apply | May be `POST /applications/{id}/withdraw` |
|14 | `Admin/Orgs/List.jsx` | List organizations | GET | `/orgs` | Yes (admin) | — | **200** `{items}` | **403** forbidden | Admin → Orgs | Table shows orgs | — |
|15 | `Admin/Orgs/Create.jsx` | Create organization | POST | `/orgs` | Yes (admin) | `{"name":"Habitat","email":"hello@org.org"}` | **201** `{org}` | **400/403** | Admin → New Org → Submit | Org appears in list | — |
|16 | `Admin/Orgs/Edit.jsx` | Update organization | PUT | `/orgs/{id}` | Yes (admin) | `{"name":"Habitat NC"}` | **200** `{org}` | **400/403/404** | Edit → Save | Changes persist | Could be PATCH |
|17 | `Admin/Orgs/List.jsx` | Delete organization | DELETE | `/orgs/{id}` | Yes (admin) | — | **204** | **403/404** | Delete org from table | Removed from list | — |
|18 | Global guarded routes | Access protected page | GET | any protected | Yes | — | **200** | **401/403** | Try accessing page logged out | Redirects to login | Verify middleware |

---

## ✅ Positive Test Cases

1. **Login:** Valid email/password → **200**, dashboard loads, token stored.  
2. **Register:** Unique email → **201**, user created, login works.  
3. **Profile:** With valid token → **200**, info displayed.  
4. **List Opportunities:** Returns list with `items`; filters work.  
5. **Opportunity CRUD:** **201/200/204** depending on action.  
6. **Apply/Withdraw:** Apply returns **201**, Withdraw returns **204**.  
7. **Admin Orgs CRUD:** Full success flow as admin.

---

## ❌ Negative Test Cases

1. Invalid password → **401**, error toast.  
2. Duplicate email → **409**, error message.  
3. No token → **401**, redirect to login.  
4. Non-admin → **403** on admin routes.  
5. Fake ID → **404**, “not found” message.  
6. Missing fields → **400**, validation errors shown.  
7. Expired refresh → **401**, user logged out gracefully.

---

## ⚙️ Environment Notes

- **Base URL:** Set `VITE_API_URL` in `.env`.  
- **Auth:** Axios attaches Bearer token automatically.  
- **Pagination/Filters:** Verify query param names (`page`, `search`, `tag`).  
- **HTTP Methods:** Adjust `PUT`/`PATCH` if backend differs.  
- **Withdraw Route:** Confirm if it’s `DELETE` or `POST /withdraw`.

---

## 🔍 Dev Helper Commands

```bash
# Find frontend API calls
rg -n "axios|fetch\\(" src

# Find backend routes (Flask or Express)
rg -n "route\\(|router\\.(get|post|put|patch|delete)\\(" server api app backend
