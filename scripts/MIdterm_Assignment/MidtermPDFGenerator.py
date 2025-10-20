from pathlib import Path
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    PageBreak,
    ListFlowable,
    ListItem,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from datetime import datetime

# ========================================
# CONFIGURATION
# ========================================
OUTPUT_PDF_NAME = "VolunteerHub_System_Design_Report_Professional.pdf"
AUTHOR = "Cameron, Catalina, Chandler, Jeremiah (PM), Nadina"
DATE = datetime.now().strftime("%B %d, %Y")

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "deliverables"
DIAGRAM_DIR = BASE_DIR / "genImgs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PDF = OUTPUT_DIR / OUTPUT_PDF_NAME

DIAGRAMS = [
    {
        "title": "Class Diagram (with Database Schema)",
        "filename": "class_diagram_with_db_schema",
        "caption": "Expanded UML class diagram showing entities, database tables, and their relationships.",
    },
    {
        "title": "Sequence Diagram: Volunteer Applies to Opportunity",
        "filename": "sequence_volunteer_apply",
        "caption": "Illustrates the volunteer application submission process and backend communication flow.",
    },
    {
        "title": "Sequence Diagram: Organization Publishes Opportunity",
        "filename": "sequence_org_publish",
        "caption": "Shows how organizations create and publish new opportunities to the platform.",
    },
    {
        "title": "Sequence Diagram: Admin Verifies Organization",
        "filename": "sequence_admin_verify",
        "caption": "Depicts how administrators verify and approve registered organizations.",
    },
    {
        "title": "Use Case Diagram",
        "filename": "use_case_diagram",
        "caption": "Summarizes all user roles and the key use cases they interact with on the platform.",
    },
    {
        "title": "Workflow: Volunteer Login & Authentication",
        "filename": "workflow_auth_login",
        "caption": "Details credential submission, validation, token issuance, and session renewal for volunteers.",
        "overview": [
            "Volunteer submits credentials via the `/auth/login` endpoint.",
            "Backend validates the user, performs password hash comparison, and issues access plus refresh tokens.",
            "Tokens are returned to the SPA, stored in volatile storage, and appended to subsequent API requests.",
            "Refresh workflow issues new access tokens before expiry to maintain a secure session.",
        ],
    },
    {
        "title": "Workflow: Organization Confirms Hours & Issues Volunteer Certificates",
        "filename": "workflow_org_confirm_certificate",
        "caption": "Outlines the organization review of submitted hours, administrative confirmation, and certificate delivery.",
        "overview": [
            "Volunteer submits documented hours for a completed opportunity through the portal.",
            "Organization representative reviews the submission, adjusts hours if needed, and confirms completion.",
            "System optionally notifies administrators for policy-based oversight before final approval.",
            "Upon approval, a digital completion certificate is generated and delivered to the volunteer.",
        ],
    },
]

# ========================================
# STYLES
# ========================================
styles = getSampleStyleSheet()
style_title = ParagraphStyle('ReportTitle', parent=styles['Title'], fontSize=24, leading=28, alignment=1, spaceAfter=20)
style_subtitle = ParagraphStyle('Subtitle', parent=styles['Heading2'], fontSize=14, leading=18, alignment=1, spaceAfter=10)
style_body = ParagraphStyle('BodyText', parent=styles['Normal'], fontSize=11, leading=15, spaceAfter=12)
style_caption = ParagraphStyle('Caption', parent=styles['Normal'], fontSize=10, leading=12, alignment=1, spaceBefore=4, spaceAfter=18, textColor="#555555")
style_section = ParagraphStyle('SectionHeading', parent=styles['Heading1'], fontSize=16, spaceAfter=10, spaceBefore=10)

# ========================================
# CUSTOM CLASSES
# ========================================
class MyDocTemplate(SimpleDocTemplate):
    """Custom document template to capture TOC entries."""
    def afterFlowable(self, flowable):
        if isinstance(flowable, HeadingParagraph):
            self.notify('TOCEntry', (flowable.level, flowable.text, self.page))

class HeadingParagraph(Paragraph):
    """A Paragraph subclass that safely stores TOC metadata."""
    def __init__(self, text, style, level=0):
        super().__init__(text, style)
        self.text = text
        self.level = level

# ========================================
# BUILD PDF
# ========================================
def build_pdf():
    doc = MyDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        rightMargin=60,
        leftMargin=60,
        topMargin=60,
        bottomMargin=60
    )

    story = []

    # === COVER PAGE ===
    story.append(Spacer(1, 2 * inch))
    story.append(Paragraph("VolunteerHub System Design Report", style_title))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Full-Stack Web Application for Connecting Volunteers and Nonprofits", style_subtitle))
    story.append(Spacer(1, 1.2 * inch))
    for label, value in (("Author", AUTHOR), ("Date", DATE)):
        story.append(Paragraph(f"<b>{label}:</b> {value}", style_body))
    story.append(Spacer(1, 2 * inch))
    story.append(Paragraph(
        "This document provides a comprehensive overview of the VolunteerHub system design, including UML class, "
        "sequence, and use case diagrams that illustrate the architecture, data models, and user interactions.",
        style_body
    ))
    story.append(PageBreak())

    # === TABLE OF CONTENTS ===
    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle(
            name='TOCLevel0',
            fontName='Helvetica-Bold',
            fontSize=12,
            leftIndent=20,
            firstLineIndent=-20,
            spaceBefore=5,
            leading=14,
            rightIndent=40,
        ),
        ParagraphStyle(
            name='TOCLevel1',
            fontName='Helvetica',
            fontSize=10,
            leftIndent=40,
            firstLineIndent=-20,
            spaceBefore=2,
            leading=12,
            rightIndent=40,
        ),
    ]
    story.append(Paragraph("Table of Contents", style_section))
    story.append(Spacer(1, 0.2 * inch))
    story.append(toc)
    story.append(PageBreak())

    # === IMAGE HANDLER ===
    def scaled_image(path: Path):
        reader = ImageReader(str(path))
        width, height = reader.getSize()
        max_width, max_height = 6.5 * inch, 4.5 * inch
        scale = min(max_width / width, max_height / height)
        return Image(str(path), width=width * scale, height=height * scale)

    # === SECTION BUILDER ===
    for i, entry in enumerate(DIAGRAMS, start=1):
        title = f"{i}. {entry['title']}"
        filename = entry["filename"]
        caption = entry["caption"]
        overview = entry.get("overview")
        img_path = DIAGRAM_DIR / f"{filename}.png"

        heading = HeadingParagraph(title, style_section, level=0)
        story.append(heading)
        story.append(Spacer(1, 0.15 * inch))

        if overview:
            story.append(ListFlowable(
                [ListItem(Paragraph(item, style_body)) for item in overview],
                bulletType='1', start='1',
            ))
            story.append(Spacer(1, 0.1 * inch))

        if img_path.exists():
            story.append(scaled_image(img_path))
            story.append(Paragraph(f"Figure: {caption}", style_caption))
        else:
            story.append(Paragraph(
                f"<i>Missing diagram:</i> {img_path.name} (check {DIAGRAM_DIR})", style_body
            ))

        story.append(Spacer(1, 0.4 * inch))

    # === BUILD TWICE to populate TOC ===
    doc.multiBuild(story)
    print(f"✅ Professional PDF created successfully: {OUTPUT_PDF}")


if __name__ == "__main__":
    build_pdf()
