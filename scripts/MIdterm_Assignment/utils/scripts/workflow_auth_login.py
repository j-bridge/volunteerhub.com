# workflow_auth_login.py
from graphviz import Digraph

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

w = Digraph("WorkflowAuth", filename="workflow_auth_login", format="png")
w.attr(rankdir="LR")

nodes = {
    "V": "Volunteer",
    "F": "Frontend (React SPA)",
    "B": "Backend (Flask API)",
    "DB": "Database (SQLite)",
    "T": "JWT Tokens",
}

for key, label in nodes.items():
    w.node(key, label, shape="box")

edges = [
    ("V", "F", "Enter credentials & submit login form"),
    ("F", "B", "POST /auth/login"),
    ("B", "DB", "Verify email + hashed password"),
    ("B", "T", "Issue access & refresh tokens"),
    ("T", "F", "Send tokens back to client"),
    ("F", "B", "Use access token for future API requests"),
]

for e in edges:
    w.edge(*e)

w.render(cleanup=True)
print(" workflow_auth_login.png generated.")
