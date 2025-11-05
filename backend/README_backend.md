# VolunteerHub Backend (Flask)

This is the **Flask backend** for the VolunteerHub platform.  
It was developed to fulfill **Chandler’s backend requirements** — including database schemas, routes, schema validation, authentication, and integration with the frontend via REST APIs.

---

## 🚀 Features

- Flask App Factory pattern  
- SQLAlchemy ORM + Alembic migrations  
- Marshmallow schema validation  
- Auth (JWT-based) and permissions  
- CRUD routes for Users, Organizations, Opportunities, and Applications  
- Utility scripts for seeding, deployment, and file uploads  
- Configurable via `.env`  
- CORS enabled for frontend integration  

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   ├── notifications.py
│   ├── permissions.py
│   ├── auth/
│   ├── users/
│   ├── orgs/
│   ├── opportunities/
│   ├── applications/
│   └── admin/
│
├── migrations/
├── scripts/
├── tests/
├── requirements.txt
├── .env.example
├── wsgi.py
└── README_backend.md
```

---

## ⚙️ Setup Instructions

### 1. Environment Setup
```bash
git clone https://github.com/j-bridge/volunteerhub.com.git
cd volunteerhub.com/backend
python -m venv venv
source venv/bin/activate     # (Mac/Linux)
venv\Scripts\activate      # (Windows)
pip install -r requirements.txt
```

### 2. Environment Variables
```bash
cp .env.example .env
```
Edit `.env` to set:
```
FLASK_ENV=development
FLASK_APP=wsgi.py
SQLALCHEMY_DATABASE_URI=sqlite:///volunteerhub.db
SECRET_KEY=supersecretkey
JWT_SECRET_KEY=jwtsecretkey
CORS_ORIGINS=http://localhost:3000
```

### 3. Database Setup
```bash
flask db upgrade
python scripts/seed.py
```

### 4. Run the Server
```bash
flask run
```

### 5. Run Tests
```bash
pytest -q
```

### 6. Frontend Integration
In frontend `.env`:
```
REACT_APP_API_URL=http://127.0.0.1:5000
```

### 7. Deployment
Use `gunicorn wsgi:app` on Render/Railway/Heroku.

---

## 👤 Maintainers

**Chandler** – Backend Developer  
Responsible for database design, routes, schema validation, and utilities.

---

## 🧾 License

Part of the [VolunteerHub.com](https://github.com/j-bridge/volunteerhub.com) repository.
