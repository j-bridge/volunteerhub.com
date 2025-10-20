# sequence_admin_verify.py
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

s = Digraph("Seq_AdminVerify", filename="sequence_admin_verify", format="png")
s.attr(rankdir="TB")

actors = ["Admin", "Frontend (Admin Dashboard)", "Backend (Flask API)", "Database (SQLite)"]
for a in actors:
    s.node(a, a, shape="box")

edges = [
    ("Admin", "Frontend (Admin Dashboard)", "View pending verifications"),
    ("Frontend (Admin Dashboard)", "Backend (Flask API)", "GET /organizations?status=pending"),
    ("Backend (Flask API)", "Database (SQLite)", "Query unverified orgs"),
    ("Database (SQLite)", "Backend (Flask API)", "Return results"),
    ("Backend (Flask API)", "Frontend (Admin Dashboard)", "Display list"),
    ("Admin", "Frontend (Admin Dashboard)", "Select org & approve"),
    ("Frontend (Admin Dashboard)", "Backend (Flask API)", "PATCH /organizations/:id → verified"),
    ("Backend (Flask API)", "Database (SQLite)", "Update record"),
]

for e in edges:
    s.edge(*e)

s.render(cleanup=True)
print(" sequence_admin_verify.png generated.")

