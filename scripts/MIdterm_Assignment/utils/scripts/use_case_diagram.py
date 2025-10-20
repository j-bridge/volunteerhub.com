# use_case_diagram.py
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

u = Digraph("UseCase", filename="use_case_diagram", format="png")
u.attr(rankdir="LR")

# Roles
u.node("Volunteer", "Volunteer", shape="ellipse")
u.node("Organization", "Organization", shape="ellipse")
u.node("Admin", "Admin", shape="ellipse")

# Use cases
cases = [
    "Browse Opportunities",
    "Apply to Opportunity",
    "Post Opportunity",
    "Verify Organizations",
    "Manage Users",
    "Confirm Volunteer Hours",
]
for c in cases:
    u.node(c, c, shape="rect", style="rounded,filled", fillcolor="lightgrey")

# Connections
u.edge("Volunteer", "Browse Opportunities")
u.edge("Volunteer", "Apply to Opportunity")
u.edge("Organization", "Post Opportunity")
u.edge("Organization", "Confirm Volunteer Hours")
u.edge("Admin", "Verify Organizations")
u.edge("Admin", "Manage Users")

u.render(cleanup=True)
print(" use_case_diagram.png generated.")