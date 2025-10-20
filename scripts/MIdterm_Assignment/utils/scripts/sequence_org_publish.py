# sequence_org_publish.py
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

s = Digraph("Seq_OrgPublish", filename="sequence_org_publish", format="png")
s.attr(rankdir="TB")

actors = ["Organization", "Frontend (React)", "Backend (Flask API)", "Database (SQLite)"]
for a in actors:
    s.node(a, a, shape="box")

steps = [
    ("Organization", "Frontend (React)", "Create opportunity form"),
    ("Frontend (React)", "Backend (Flask API)", "POST /opportunities"),
    ("Backend (Flask API)", "Database (SQLite)", "Insert new opportunity"),
    ("Database (SQLite)", "Backend (Flask API)", "Return ID"),
    ("Backend (Flask API)", "Frontend (React)", "Confirmation + success"),
    ("Frontend (React)", "Organization", "Display published opportunity"),
]

for s1, s2, l in steps:
    s.edge(s1, s2, l)

s.render(cleanup=True)
print(" sequence_org_publish.png generated.")