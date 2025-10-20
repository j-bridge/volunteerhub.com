# sequence_volunteer_apply.py
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

s = Digraph("Seq_VolunteerApply", filename="sequence_volunteer_apply", format="png")
s.attr(rankdir="TB", splines="polyline")

actors = ["Volunteer", "Frontend (React)", "Backend (Flask API)", "Database (SQLite)"]
for i, actor in enumerate(actors):
    s.node(actor, actor, shape="box")

edges = [
    ("Volunteer", "Frontend (React)", "Submit application form"),
    ("Frontend (React)", "Backend (Flask API)", "POST /apply"),
    ("Backend (Flask API)", "Database (SQLite)", "Insert application record"),
    ("Database (SQLite)", "Backend (Flask API)", "Return confirmation"),
    ("Backend (Flask API)", "Frontend (React)", "Send success message"),
    ("Frontend (React)", "Volunteer", "Display confirmation"),
]

for src, dst, label in edges:
    s.edge(src, dst, label)

s.render(cleanup=True)
print(" sequence_volunteer_apply.png generated.")