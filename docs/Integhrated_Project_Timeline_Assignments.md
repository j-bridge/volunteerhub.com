# VolunteerHub – Integrated Project Timeline with Role Assignments

This timeline aligns the **development workflow** (from your tentative 8-week schedule)  
with the **team member skillsets and responsibilities** to ensure clear accountability.

---

## Week-by-Week Breakdown

| Week       | Dates           | Core Focus                                    | Tasks / Deliverables                                                                                                                                        | Responsible Team Members                                                                                                   |
| ---------- | --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | Oct 7 – Oct 13  | **Setup & Initialization**                    | • Initialize GitHub repository<br>• Setup React + Vite frontend<br>• Create project structure (client/server folders)<br>• Configure .gitignore and README  | **Cameron** (frontend setup)<br>**Jeremiah** (Git + environment setup)<br>**Catalina** (QA on repo structure)              |
| **Week 2** | Oct 14 – Oct 20 | **Frontend & Theme Base**                     | • Build initial UI/UX layout components (NavBar, Hero, Footer)<br>• Define Chakra theme<br>• Establish responsive grid & routing skeleton                   | **Cameron** (UI components)<br>**Catalina** (consistency & theme review)                                                   |
| **Week 3** | Oct 21 – Oct 27 | **Content Integration + Backend Scaffolding** | • Add copywriting (content placeholders)<br>• Setup Flask backend (npm + Flask app factory)<br>• Configure CORS & SQLAlchemy                                | **Cameron** (content integration)<br>**Nadina** (backend setup)<br>**Chandler** (DB connection)                            |
| **Week 4** | Oct 28 – Nov 3  | **Database Schema & Routes**                  | • Create DB models (User, Organization, Opportunity, Application)<br>• Build API routes (auth, CRUD endpoints)<br>• Test DB interactions                    | **Chandler** (DB schemas, routes)<br>**Nadina** (backend integration)<br>**Catalina** (QA testing for consistency)         |
| **Week 5** | Nov 4 – Nov 10  | **Utility Functions & Refinement**            | • Implement utility scripts (auth helpers, file uploads, deploy/build scripts)<br>• Validate data flow between front & back                                 | **Jeremiah** (utilities, auth, build scripts)<br>**Chandler** (file uploads, DB functions)<br>**Catalina** (error testing) |
| **Week 6** | Nov 11 – Nov 17 | **Integration & Deployment Prep**             | • Connect frontend API calls to Flask routes<br>• Verify end-to-end flow (UI → DB → API)<br>• Setup Gunicorn + Supervisor<br>• Configure Nginx (local demo) | **Jeremiah** (server config, security)<br>**Cameron** (frontend API calls)<br>**Nadina** (backend endpoints)               |
| **Week 7** | Nov 18 – Nov 24 | **Demo Site Launch & Testing**                | • Publish live demo site<br>• Conduct QA tests and fix bugs<br>• Validate must-have features<br>• Gather team feedback                                      | **Jeremiah** (deployment)<br>**Catalina** (QA validation)<br>**All** (final adjustments)                                   |
| **Week 8** | Nov 25 – Dec 1  | **Documentation & Submission**                | • Finalize README + documentation<br>• Prepare final project PDF summary (Canvas)<br>• Include Git repo + live link                                         | **Jeremiah** (final report)<br>**Catalina** (proofreading)<br>**All** (review & sign-off)                                  |

---

## Task Type by Responsibility

| Role         | Primary Responsibilities                    | Key Deliverables                                       |
| ------------ | ------------------------------------------- | ------------------------------------------------------ |
| **Cameron**  | Frontend design and implementation          | UI components, Chakra theme, routing, copy integration |
| **Catalina** | QA, consistency, version control            | Code reviews, style and compatibility checks           |
| **Chandler** | Database design and API routes              | SQLAlchemy models, Flask blueprints                    |
| **Nadina**   | Backend and business logic                  | Flask app setup, route handlers, schema integration    |
| **Jeremiah** | Server configuration, utilities, deployment | Auth functions, build scripts, hosting, documentation  |

---

## Notes & Collaboration Points

- **Weekly Sync Meetings:** Every Friday – review progress and blockers.
- **Code Review Cycle:** Catalina to review all merges before `main` branch updates.
- **Testing:** Chandler and Nadina to run backend unit tests; Cameron tests frontend routes.
- **Deployment Ownership:** Jeremiah ensures server, database, and hosting environments are production-ready.
- **Final Deliverables:** GitHub repo (full stack), live demo URL, Canvas PDF summary.

---

## Summary Timeline Visualization

| Phase                        | Duration  | Owner(s)                 |
| ---------------------------- | --------- | ------------------------ |
| Setup & Repo Initialization  | Weeks 1–2 | Cameron, Jeremiah        |
| Frontend UI/UX Development   | Weeks 2–4 | Cameron, Catalina        |
| Backend & DB Schema Creation | Weeks 3–5 | Nadina, Chandler         |
| Integration & Utilities      | Weeks 5–6 | Jeremiah, Chandler       |
| QA + Live Deployment         | Weeks 6–7 | Catalina, Jeremiah       |
| Documentation & Submission   | Week 8    | Jeremiah, Catalina, Team |

---

**Total Duration:** ~8 weeks  
**Final Submission Date:** **November 27**        