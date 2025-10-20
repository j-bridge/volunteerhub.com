# workflow_org_confirm_certificate.py
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

w = Digraph("WorkflowCert", filename="workflow_org_confirm_certificate", format="png")
w.attr(rankdir="TB")

nodes = {
    "V": "Volunteer",
    "O": "Organization",
    "A": "Admin (Optional Oversight)",
    "S": "System (Flask + SQLite)",
}

for key, label in nodes.items():
    w.node(key, label, shape="box")

edges = [
    ("V", "O", "Submit completed hours"),
    ("O", "S", "Review & confirm submission"),
    ("S", "A", "Notify admin if oversight required"),
    ("A", "S", "Approve or reject hours"),
    ("S", "V", "Generate and deliver completion certificate"),
]

for e in edges:
    w.edge(*e)

w.render(cleanup=True)
print(" workflow_org_confirm_certificate.png generated.")