# class_diagram_with_db_schema.py
from graphviz import Digraph

g = Digraph("ClassDiagram", filename="class_diagram_with_db_schema", format="png")

# === Base visual style ===
g.attr('node', fontname="Helvetica", fontsize="11",
       style="filled,rounded", color="#1976D2", fillcolor="#E3F2FD", penwidth="1.2")
g.attr('edge', fontname="Helvetica", fontsize="10",
       color="#90A4AE", arrowsize="0.8")
g.attr(rankdir="LR", splines="spline", bgcolor="#FAFAFA", labelloc="t",
       label="VolunteerHub — System Class Diagram\n(With Database Schema)")

# Entities
entities = {
    "Volunteer": ["id: int", "name: string", "email: string", "hours: float"],
    "Organization": ["id: int", "name: string", "verified: bool"],
    "Opportunity": ["id: int", "title: string", "description: text", "org_id: FK"],
    "Application": ["id: int", "volunteer_id: FK", "opportunity_id: FK", "status: string"],
    "Admin": ["id: int", "username: string", "role: string"],
}

for entity, attrs in entities.items():
    g.node(entity, f"<<b>{entity}</b><br/>{'<br/>'.join(attrs)}>", shape="rect", style="rounded,filled", fillcolor="#E3F2FD")

# Relationships
g.edge("Volunteer", "Application", label="applies →", color="#5C6BC0")
g.edge("Opportunity", "Application", label="← for", color="#5C6BC0")
g.edge("Organization", "Opportunity", label="creates →", color="#26A69A")
g.edge("Admin", "Organization", label="verifies →", color="#EF6C00")
g.render(cleanup=True)
print(" class_diagram_with_db_schema.png generated.")