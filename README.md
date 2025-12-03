# VolunteerHub

VolunteerHub is a full-stack web application that connects volunteers with nonprofit organizations. The platform covers user authentication, organization management, volunteer applications, and an admin dashboard for moderation.

## Documentation
See [Integrated Project Timeline w/ Assignments](docs/timeline/Integrated_Project_Timeline_Assignments.md), [Gantt Timeline Assigned w/ Responsibilities](docs/timeline/Gantt_Timeline_Assigned_Responsibilities.md), [Integrated Project Timeline Plain Text](docs/timeline/Integrated_Project_Timeline_Assignments_Plain.md), and [PDF Compatible Timeline Submission](docs/timeline/Integrated_Project_Timeline_PDF_Submission.md).

## Project Overview
- Enable volunteers to discover and apply to opportunities hosted by verified organizations.
- Provide organizations with tools to publish, manage, and review opportunity applications.
- Offer administrators visibility and control over user roles, content, and platform health.
- Build on a modular architecture that supports future enhancements such as notifications, mobile clients, and AI-based matching.

## Tech Stack
| Layer | Technology | Description |
| --- | --- | --- |
| Frontend | React + Vite + Chakra UI | Responsive single-page application with component-based UI |
| Backend | Python Flask + SQLAlchemy + JWT | REST API with role-aware authentication |
| Database | SQLite (development) | Lightweight embedded database for local testing |
| Auth System | JWT + role-based access | Roles include Volunteer, Organization, and Admin |

## Getting Started

### Frontend
```bash
mkdir app/client -p
cd app clienthttps://github.com/j-bridge/volunteerhub.com/
npm create vite@latest . -- --template react
npm installhttps://github.com/j-bridge/volunteerhub.com/
npm run dev

# Optional Chakra UI setup
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion 
```

### Main Entry (src/main.jsx)
Wrap app in Chakra's provider in main.jsx for theming:
```jsx 
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
``` 
### Root `.gitignore`
Add this to your root `.gitignore`:
```gitignore
# Frontend dependencies
app/client/node_modules
app/client/dist
```
--- 
*j-bridge @ 2025-10-13* 

---

### Shell Commands 
| Command | Description |
| --- | --- |
| `npm run dev` | Start local development server (Vite + HMR) |
| `npm run build` | Build production bundle to `dist/` |
| `npm run lint` | Run ESLint using `eslint.config.js` |

### Backend
```bash
cd app/server
python -m venv .venv
source .venv/bin/activate #Mac/Linux
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass #If permission issue Windows
.\.venv\Scripts\Activate.ps1 #Activation on Windows
pip install -r requirements.txt
flask --app wsgi.py run --debug
# or
python wsgi.py
```

### Run frontend & backend together
```bash
scripts/dev.sh
```
This starts the Flask API from `app/server` and the Vite frontend from `app/client` concurrently.

## Directory Structure

### Frontend
| Path | Purpose |
| --- | --- |
| `src/main.jsx` | Entry point for the React application |
| `src/App.jsx` | Root shell configuring router, layout, and theme |
| `src/router.jsx` | Route definitions and navigation |
| `src/theme/index.js` | Chakra UI theme overrides |
| `src/context/AuthContext.jsx` | Global authentication and user state |
| `src/api/` | Axios instance and API modules |
| `src/pages/Auth/` | Login and registration pages |
| `src/pages/Opportunities/` | Opportunity CRUD views and details |
| `src/pages/Profile/` | Dashboards for volunteers and organizations |
| `src/components/` | Shared UI components (cards, filters, forms) |
| `src/hooks/` | Custom hooks, including `useAuth` and query helpers |
| `public/` | Static assets such as favicon and manifest |

### Backend
| Path | Purpose |
| --- | --- |
| `app/__init__.py` | Application factory and blueprint registration |
| `app/config.py` | Core configuration (database, JWT, CORS, etc.) |
| `app/models.py` | SQLAlchemy models |
| `app/schemas.py` | Marshmallow schemas for serialization |
| `app/security.py` | JWT setup and password hashing helpers |
| `app/permissions.py` | Role-based access control utilities |
| `app/utils/pagination.py` | Pagination helpers for query results |
| `app/utils/filters.py` | Dynamic query filter utilities |
| `scripts/seed.py` | Database seeding script |
| `instance/volunteerhub.db` | Auto-created SQLite database |

## Flask Blueprints
| Module | Purpose |
| --- | --- |
| `app/auth/routes.py` | Register, login, and token refresh |
| `app/users/routes.py` | User profile endpoints for all roles |
| `app/opportunities/routes.py` | Opportunity CRUD, search, and filtering |
| `app/applications/routes.py` | Submit, withdraw, and review applications |
| `app/orgs/routes.py` | Organization management endpoints |

## Database Models
| Model | Description |
| --- | --- |
| `User` | Base user record for volunteers, organizations, and admins |
| `Organization` | Nonprofit metadata and contact information |
| `Opportunity` | Volunteer event with title, description, and schedule |
| `Application` | Join table tying users to opportunity submissions |
| `Role` | Defines permissions for each user type |

## API Surface
| Endpoint Group | Description |
| --- | --- |
| `/auth` | Register, login, and refresh JWT tokens |
| `/users` | View and update profile details |
| `/opportunities` | Create, read, update, delete, and filter opportunities |
| `/applications` | Apply to, withdraw from, and review opportunity submissions |
| `/orgs` | Organization CRUD endpoints (restricted to admins) |

## Environment Configuration
| Variable | Example | Description |
| --- | --- | --- |
| `FLASK_ENV` | `development` | Flask execution mode |
| `DATABASE_URL` | `sqlite:///instance/volunteerhub.db` | Database connection string |
| `JWT_SECRET_KEY` | `supersecret123` | Secret used for JWT signing |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed frontend origin |
| `VITE_API_URL` | `http://127.0.0.1:5000` | Base URL for the frontend API client |

## Authentication Flow
1. Users register or authenticate through `POST /auth/register` and `POST /auth/login`, receiving access and refresh tokens on success.
2. Tokens are stored on the frontend (short term) and appended to requests by an Axios interceptor as `Authorization: Bearer <token>`.
3. Expired tokens are renewed via `POST /auth/refresh`, while backend routes enforce role requirements through decorators such as `@role_required('admin')`.

## Deployment Notes

### Frontend
- Build static assets with `npm run build`.
- Serve the `dist/` output via Nginx, Netlify, Vercel, or a Flask static mount.

### Backend
- Run Flask behind Gunicorn and a process manager such as Supervisor.
- Example command: `gunicorn -w 3 -b 127.0.0.1:8000 "app:create_app()"`.
- Example Nginx configuration:

```nginx
server {
    server_name volunteerhub.com;
    root /var/www/volunteerhub/app/client/dist;

    location /api {
        proxy_pass http://127.0.0.1:8000;
        include proxy_params;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

## Developer Utilities
| File | Purpose |
| --- | --- |
| `scripts/seed.py` | Populate the database with demo data |
| `app/utils/filters.py` | Build dynamic SQLAlchemy filters |
| `app/utils/pagination.py` | Paginate query results |
| `eslint.config.js` | ESLint configuration for the React app |
| `vite.config.js` | Vite build configuration |

## Suggested Improvements
- Add Dockerfiles for containerized development and deployment.
- Integrate Alembic for database migrations.
- Expand automated testing with Pytest and React Testing Library.
- Introduce email verification and password reset flows.
- Support PostgreSQL in production environments.
- Implement CI/CD with GitHub Actions.
- Explore real-time updates via Socket.IO or Flask-SocketIO.

## AI Agent Instructions
- Familiarize yourself with both `app/client` and `app/server` directories before making changes; most tasks span frontend and backend code.
- Coordinate updates across React components, Flask routes, and shared contracts to keep the API surface consistent.
- Respect the role-based access control layer when adding endpoints or UI routes; ensure JWT handling is updated where necessary.
- Use the provided scripts (`npm run lint`, Flask seeders) to validate work after changes and document any additional steps you introduce.
- Keep documentation, including this README, synchronized with new features or configuration updates so collaborators have an accurate reference.

## Summary
VolunteerHub delivers a modular foundation for connecting volunteers and nonprofits through a modern web stack. With clear separation of concerns, reusable UI components, and extensible backend blueprints, the project is well-positioned for future enhancements such as push notifications, mobile clients, and intelligent opportunity matching.

---
**Author:** Jeremiah C. Bridgewater  
**Last Updated:** 2025-10-13  
**Project:** VolunteerHub  
---
