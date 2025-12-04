from __future__ import annotations

from datetime import date
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import LETTER, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from ..config import INSTANCE_DIR
from ..models import Certificate

DEFAULT_FONT_NAME = "GreatVibes"
DEFAULT_FONT_PATH = Path(__file__).resolve().parent.parent / "assets" / "fonts" / "GreatVibes-Regular.ttf"


def _ensure_cursive_font(font_path: Path) -> str:
    """
    Register a cursive font if it exists; fall back to Helvetica-Oblique.
    """
    if font_path.exists() and DEFAULT_FONT_NAME not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(DEFAULT_FONT_NAME, str(font_path)))
        return DEFAULT_FONT_NAME
    if DEFAULT_FONT_NAME in pdfmetrics.getRegisteredFontNames():
        return DEFAULT_FONT_NAME
    return "Helvetica-Oblique"


def _format_hours(hours: float) -> str:
    normalized = f"{hours:.2f}"
    return normalized.rstrip("0").rstrip(".")


def generate_certificate_pdf(
    certificate: Certificate,
    output_dir: str | Path | None = None,
    font_path: str | Path | None = None,
) -> Path:
    """
    Build a branded PDF for a certificate and return the file path.
    """
    target_dir = Path(output_dir or INSTANCE_DIR / "certificates")
    target_dir.mkdir(parents=True, exist_ok=True)

    font_file = Path(font_path) if font_path else DEFAULT_FONT_PATH
    font_name = _ensure_cursive_font(font_file)

    pdf_path = target_dir / f"certificate-{certificate.id}.pdf"
    size = landscape(LETTER)
    width, height = size
    c = canvas.Canvas(str(pdf_path), pagesize=size)

    # Background and frame
    c.setFillColor(HexColor("#f9fafb"))
    c.rect(0, 0, width, height, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#0f172a"))
    c.setLineWidth(3)
    c.rect(36, 36, width - 72, height - 72)
    c.setFillColor(HexColor("#e0f2fe"))
    c.rect(36, height - 140, width - 72, 80, stroke=0, fill=1)

    # Title + recipient
    c.setFillColor(HexColor("#0f172a"))
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 88, "Certificate of Service")
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 165, "Presented to")

    volunteer_name = certificate.volunteer.name or certificate.volunteer.email or "Volunteer"
    c.setFont(font_name, 46)
    c.setFillColor(HexColor("#0b3d2e"))
    c.drawCentredString(width / 2, height - 205, volunteer_name)

    hours_text = _format_hours(certificate.hours)
    organization_name = certificate.organization.name if certificate.organization else "your organization"
    completion_date: date | None = certificate.completed_at or (certificate.issued_at.date() if certificate.issued_at else None)
    issued_date = certificate.issued_at.date() if certificate.issued_at else None

    c.setFillColor(HexColor("#0f172a"))
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 245, f"For contributing {hours_text} volunteer hours")
    c.drawCentredString(width / 2, height - 265, f"with {organization_name}")

    if completion_date:
        c.drawCentredString(width / 2, height - 285, f"Service completed on {completion_date.strftime('%B %d, %Y')}")
    if issued_date:
        c.drawCentredString(width / 2, height - 305, f"Issued on {issued_date.strftime('%B %d, %Y')}")

    issuer_label = certificate.issued_by.name if certificate.issued_by and certificate.issued_by.name else "Authorized signer"
    c.setFont("Helvetica-Bold", 12)
    c.drawString(80, 130, issuer_label)
    c.line(76, 126, 280, 126)
    c.setFont("Helvetica", 10)
    c.drawString(80, 110, "Organization Representative")

    if certificate.notes:
        c.setFont("Helvetica", 10)
        c.setFillColor(HexColor("#334155"))
        c.drawString(80, 90, certificate.notes[:120])

    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#6b7280"))
    c.drawRightString(width - 80, 90, f"Certificate #{certificate.id}")

    c.save()
    return pdf_path
