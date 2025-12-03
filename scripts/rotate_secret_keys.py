#!/usr/bin/env python
"""
Manage and rotate sensitive keys in a .env file.

Example usages:
  python scripts/rotate_secret_keys.py                   # create .env if missing and fill secrets
  python scripts/rotate_secret_keys.py --rotate          # rotate secrets even if they exist
  python scripts/rotate_secret_keys.py --env-file /etc/volunteerhub/.env --keys SECRET_KEY JWT_SECRET_KEY
"""
from __future__ import annotations

import argparse
import secrets
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_ENV = REPO_ROOT / ".env"
DEFAULT_KEYS = ("SECRET_KEY", "JWT_SECRET_KEY")


def generate_secret(length: int = 64) -> str:
    """Generate a URL-safe secret token."""
    return secrets.token_urlsafe(length)


def load_env(path: Path) -> Dict[str, str]:
    """Parse a .env file into a simple dict (comments preserved separately)."""
    values: Dict[str, str] = {}
    if not path.exists():
        return values

    for line in path.read_text().splitlines():
        if not line or line.strip().startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def backup_env(path: Path) -> Path | None:
    """Backup the .env file with a timestamp suffix."""
    if not path.exists():
        return None
    stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    backup_path = path.with_name(f"{path.name}.bak_{stamp}")
    shutil.copy(path, backup_path)
    return backup_path


def render_env(original: Path, updates: Dict[str, str]) -> str:
    """
    Merge new values into the existing file, preserving comments and ordering
    for keys that already exist. New keys are appended to the end.
    """
    lines = original.read_text().splitlines() if original.exists() else []
    seen = set()
    rendered = []

    for line in lines:
        if line.strip().startswith("#") or "=" not in line:
            rendered.append(line)
            continue

        key, _ = line.split("=", 1)
        if key in updates:
            rendered.append(f"{key}={updates[key]}")
            seen.add(key)
        else:
            rendered.append(line)

    for key, value in updates.items():
        if key not in seen:
            rendered.append(f"{key}={value}")

    return "\n".join(rendered) + "\n"


def ensure_keys(env_file: Path, keys: Iterable[str], rotate: bool, length: int) -> Dict[str, str]:
    """Return the new/updated secrets and write them to disk."""
    existing = load_env(env_file)

    updates: Dict[str, str] = {}
    for key in keys:
        if rotate or key not in existing or not existing.get(key):
            updates[key] = generate_secret(length)

    if not updates:
        return {}

    backup = backup_env(env_file)
    if backup:
        print(f"[backup] Saved previous file to {backup}")

    env_file.write_text(render_env(env_file, updates))
    return updates


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate or rotate secret keys in a .env file.")
    parser.add_argument("--env-file", default=DEFAULT_ENV, help=f"Path to .env file (default: {DEFAULT_ENV})")
    parser.add_argument("--keys", nargs="+", default=list(DEFAULT_KEYS), help="Env var names to create/rotate")
    parser.add_argument("--length", type=int, default=64, help="Length for generated secrets (default: 64)")
    parser.add_argument("--rotate", action="store_true", help="Rotate keys even if they already exist")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    env_path = Path(args.env_file).expanduser().resolve()
    env_path.parent.mkdir(parents=True, exist_ok=True)

    updates = ensure_keys(env_path, args.keys, rotate=args.rotate, length=args.length)

    if not updates:
        print("No changes made. All keys already existed. Use --rotate to force regeneration.")
        return

    print(f"[write] Updated {env_path}")
    for key, value in updates.items():
        print(f"{key}={value}")


if __name__ == "__main__":
    main()
