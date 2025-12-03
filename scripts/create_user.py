#!/usr/bin/env python
"""
Create or update a user (including an admin) from the CLI.

Examples:
  python scripts/create_user.py --email admin@example.com --role admin
  python scripts/create_user.py --seed-demo
"""
from __future__ import annotations

import argparse
import getpass
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
SERVER_DIR = REPO_ROOT / "app" / "server"

# Ensure backend is importable
sys.path.insert(0, str(SERVER_DIR))

from app import create_app  # type: ignore  # noqa: E402
from app.extensions import db  # type: ignore  # noqa: E402
from app.models import User  # type: ignore  # noqa: E402
from app.security import hash_password  # type: ignore  # noqa: E402


DEMO_USERS = [
    {
        "email": "admin@volunteerhub.test",
        "password": "ChangeMe123!",
        "role": "admin",
        "name": "Demo Admin",
    },
    {
        "email": "org@volunteerhub.test",
        "password": "ChangeMe123!",
        "role": "organization",
        "name": "Demo Organization",
    },
    {
        "email": "volunteer@volunteerhub.test",
        "password": "ChangeMe123!",
        "role": "volunteer",
        "name": "Demo Volunteer",
    },
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create or update a VolunteerHub user.")
    parser.add_argument("--email", help="User email (required unless --seed-demo)")
    parser.add_argument("--password", help="Password (prompted if not provided)")
    parser.add_argument("--name", help="Display name")
    parser.add_argument(
        "--role",
        default="volunteer",
        choices=["volunteer", "organization", "admin"],
        help="Role for the account (default: volunteer)",
    )
    parser.add_argument(
        "--env-file",
        default=REPO_ROOT / ".env",
        help="Path to .env file to load before creating the user",
    )
    parser.add_argument(
        "--force-update",
        action="store_true",
        help="If the user exists, update their role/password/name instead of skipping",
    )
    parser.add_argument(
        "--seed-demo",
        action="store_true",
        help="Create three demo accounts (admin/org/volunteer) with default passwords",
    )
    return parser.parse_args()


def ensure_password(existing: str | None, provided: str | None) -> str:
    if provided:
        return provided
    if existing:
        return existing
    # Prompt without echo
    pwd = getpass.getpass("Password: ").strip()
    if not pwd:
        raise SystemExit("A password is required.")
    return pwd


def create_or_update_user(email: str, password: str, role: str, name: str | None, force: bool) -> None:
    user = User.query.filter_by(email=email).first()
    if user and not force:
        print(f"[skip] {email} already exists (use --force-update to change it)")
        return

    if not user:
        user = User(email=email)
        db.session.add(user)
        action = "created"
    else:
        action = "updated"

    user.password_hash = hash_password(password)
    user.role = role
    if name:
        user.name = name
    db.session.commit()
    print(f"[{action}] {email} ({role})")


def main() -> None:
    args = parse_args()
    load_dotenv(args.env_file)

    env_name = os.getenv("FLASK_ENV") or "production"
    app = create_app(env_name)
    with app.app_context():
        if args.seed_demo:
            for entry in DEMO_USERS:
                create_or_update_user(
                    entry["email"],
                    ensure_password(entry["password"], entry["password"]),
                    entry["role"],
                    entry["name"],
                    force=True,
                )
            return

        if not args.email:
            raise SystemExit("Please provide --email or use --seed-demo.")

        password = ensure_password(None, args.password)
        create_or_update_user(args.email, password, args.role, args.name, args.force_update)


if __name__ == "__main__":
    main()
