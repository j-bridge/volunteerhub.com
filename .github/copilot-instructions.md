# AI Coding Assistant Instructions - VolunteerHub

## Project Overview
VolunteerHub is a full-stack web application connecting volunteers with nonprofit organizations, built using React (frontend) and Flask (backend). The system supports user authentication, organization management, volunteer applications, and administrative oversight.

## Architecture & Key Components

### Frontend Structure
- **Tech Stack**: React + Vite + Chakra UI + React Router
- **State Management**: Context API (`AuthContext.jsx`) handles authentication state
- **API Client**: Axios instance in `src/api/client.js` with JWT token management
- **Layout**: Root layout (`RootLayout.jsx`) provides consistent page shell

Important file locations:
```
app/client/
├── src/
│   ├── api/client.js         # Axios setup & auth interceptors
│   ├── context/AuthContext.jsx # Global auth state management
│   ├── pages/                # Route components (Login, Signup etc.)
│   ├── components/           # Shared UI components
│   └── layouts/RootLayout.jsx # Page shell with nav & footer
```

### Backend Structure
- **Tech Stack**: Flask + SQLAlchemy + JWT
- **Database**: SQLite (development) with SQLAlchemy ORM
- **Auth**: JWT-based with role-based access control
- **Models**: Core entities in `app/server/app/models.py`:
  - User (base type for all user roles)
  - Organization (nonprofit entities)
  - Opportunity (volunteer positions)
  - Application (volunteer submissions)

## Key Development Patterns

### Authentication Flow
1. Frontend stores tokens in localStorage/sessionStorage based on "Remember me"
2. API client automatically injects tokens via Axios interceptor
3. Token invalidation triggers automatic frontend logout
4. Example login code from `src/pages/Login.jsx`:
```jsx
const handleLogin = async (e) => {
  const res = await api.post("/auth/login", { email, password });
  const token = extractToken(data);
  if (token) authLogin(token, data?.user, remember);
};
```

### Database Relationships
- Organizations have members through `organization_members` join table
- Opportunities belong to Organizations
- Applications link Users to Opportunities
- Use SQLAlchemy relationships for clean queries, e.g.:
```python
org.members.filter_by(role='admin')
user.applications.filter_by(status='pending')
```

### Frontend Routes & Layouts
- All pages wrapped in `RootLayout` with nav/footer
- Auth-aware navigation shows correct links based on user state
- Protected routes should check `useAuth()` hook for authorization

### Styling Guidelines
- Use Chakra UI components for consistent theming
- Color scheme uses teal.500 as primary accent
- Responsive design uses Chakra's breakpoint props

## Common Tasks

### Adding New Routes
1. Create page component in `src/pages/`
2. Add route to `src/App.jsx`
3. Update navigation in `src/components/NavBar.jsx`

### Adding API Endpoints
1. Add route handler in appropriate Flask blueprint
2. Add model/schema if needed in `models.py`
3. Add frontend API call in `api/client.js`

### Making Database Changes
1. Update models in `app/server/app/models.py`
2. Test migrations locally
3. Update any affected API routes

## Commit Guidelines
Follow conventional commits format:
- `feat(scope): description` for new features
- `fix(scope): description` for bug fixes
- `refactor(scope): description` for code restructuring
- Scopes: `client`, `server`, `auth`, `db`

Example: `feat(client): add opportunity search filters`

## Environment Setup
```bash
# Frontend
cd app/client
npm install
npm run dev

# Backend
cd app/server
python -m venv .venv
source .venv/bin/activate  # or .\.venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
flask run --debug
```

## Testing & Validation
- Frontend: Uses ESLint (run `npm run lint`)
- Backend: Ensure all API changes maintain role-based access control
- Test authentication flows thoroughly when modifying auth-related code

## Future Considerations
- Support PostgreSQL for production
- Add email verification
- Implement real-time updates
- Support mobile clients

Please update these instructions when making significant architectural changes or introducing new patterns.