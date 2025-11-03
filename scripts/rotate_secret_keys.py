import os
import secrets
import subprocess
from datetime import datetime

# =============================
# CONFIGURATION (EDIT THESE)
# =============================
# Absolute path to your .env file in production
ENV_FILE = "/var/www/myapp/.env"

# The env variable names that should be rotated
# Example: ["APP_SECRET_KEY", "JWT_SECRET"]
ROTATE_KEYS = ["APP_SECRET_KEY"]

# Name of the service / process to restart so it loads the new keys
# (systemd service, docker compose service, etc.)
SERVICE_NAME = "myapp"

def generate_secret_key(length=64):
    """Generate a cryptographically secure random secret key."""
    return secrets.token_urlsafe(length)

def backup_env_file(env_path):
    """Backup the current .env file before modifying it."""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{env_path}.bak_{timestamp}"
    os.system(f"cp {env_path} {backup_path}")
    print(f"[+] Backup created at {backup_path}")
    return backup_path

def rotate_keys(env_path, key_names):
    """Replace the old secret keys in the .env file with new ones."""
    # Load current env file
    with open(env_path, 'r') as f:
        lines = f.readlines()

    # Prepare new key material
    new_values = {key: generate_secret_key() for key in key_names}

    # Rewrite lines, swapping only the keys we are rotating
    new_lines = []
    for line in lines:
        wrote = False
        for key in key_names:
            if line.startswith(f"{key}="):
                new_line = f"{key}={new_values[key]}\n"
                new_lines.append(new_line)
                wrote = True
                break
        if not wrote:
            new_lines.append(line)

    # Write updated .env
    with open(env_path, 'w') as f:
        f.writelines(new_lines)

    print("[+] Rotated keys:")
    for key, val in new_values.items():
        print(f"    {key} -> {val[:6]}******** (truncated)" )

    return new_values

def restart_service(service_name):
    """Restart the service so it reads the updated .env file."""
    # Adjust this if you use docker compose or something else
    # Example for docker compose:
    # subprocess.run(["docker", "compose", "restart", service_name], check=True)
    subprocess.run(["sudo", "systemctl", "restart", service_name], check=True)
    print(f"[+] {service_name} restarted successfully.")

def main():
    print("🔐 Starting secret key rotation...")
    backup_env_file(ENV_FILE)
    rotate_keys(ENV_FILE, ROTATE_KEYS)
    restart_service(SERVICE_NAME)
    print("✅ Secret key rotation complete.")

if __name__ == "__main__":
    main()
