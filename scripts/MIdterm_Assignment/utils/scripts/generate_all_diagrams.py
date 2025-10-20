import os
import subprocess

# === Global styling ===
BASE_STYLE = {
    "fontname": "Helvetica",
    "fontsize": "11",
    "style": "filled,rounded",
    "color": "#1E88E5",          # soft blue outline
    "fillcolor": "#E3F2FD",      # very light blue background
    "penwidth": "1.2",
}

EDGE_STYLE = {
    "fontname": "Helvetica",
    "fontsize": "10",
    "color": "#90A4AE",          # grayish edge lines
    "arrowsize": "0.8",
}

scripts = [
    "class_diagram_with_db_schema.py",
    "sequence_volunteer_apply.py",
    "sequence_org_publish.py",
    "sequence_admin_verify.py",
    "use_case_diagram.py",
    "workflow_auth_login.py",
    "workflow_org_confirm_certificate.py",
]

for script in scripts:
    print(f"🚀 Generating {script} ...")
    subprocess.run(["python3", os.path.join(os.path.dirname(__file__), script)], check=True)

print("\nAll diagrams generated successfully!")