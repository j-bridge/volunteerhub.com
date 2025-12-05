from __future__ import annotations

from pathlib import Path
from flask import Blueprint, jsonify, request, current_app, send_file, url_for
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    decode_token,
    create_access_token,
)
from marshmallow import ValidationError

from ..extensions import db
from ..models import Certificate, Organization, Opportunity, User
from ..schemas import CertificateSchema, CertificateCreateSchema
from ..utils.certificate_pdf import generate_certificate_pdf
from ..utils.emailer import send_templated_email

bp = Blueprint("certificates", __name__)

certificate_schema = CertificateSchema()
certificates_schema = CertificateSchema(many=True)
certificate_create_schema = CertificateCreateSchema()

def _current_user_id() -> int | None:
    try:
        return int(get_jwt_identity())
    except (TypeError, ValueError):
        return None


def _get_user(user_id: int | None) -> User | None:
    if not user_id:
        return None
    return db.session.get(User, user_id)


def _serialize_certificate(cert: Certificate) -> dict:
    data = certificate_schema.dump(cert)
    if cert.pdf_path:
        data["download_url"] = url_for("certificates.download_certificate", certificate_id=cert.id, _external=True)
        data["download_path"] = url_for("certificates.download_certificate", certificate_id=cert.id, _external=False)
    else:
        data["download_url"] = None
        data["download_path"] = None
    return data


def _can_access_certificate(user: User | None, cert: Certificate) -> bool:
    if not user:
        return False
    if user.is_admin():
        return True
    if cert.volunteer_id == user.id or cert.issued_by_id == user.id:
        return True
    return user.is_org_admin(cert.organization_id)


@bp.post("/")
@jwt_required()
def issue_certificate():
    try:
        payload = certificate_create_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    issuer = _get_user(_current_user_id())
    if not issuer:
        return jsonify({"error": "Unauthorized"}), 401

    org_id = payload["organization_id"]
    org = db.session.get(Organization, org_id)
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    if not (issuer.is_admin() or issuer.is_org_admin(org_id)):
        return jsonify({"error": "Forbidden"}), 403

    volunteer = None
    if payload.get("volunteer_id"):
        volunteer = db.session.get(User, payload["volunteer_id"])
    elif payload.get("volunteer_email"):
        volunteer = User.query.filter_by(email=payload["volunteer_email"]).first()

    if not volunteer:
        return jsonify({"error": "Volunteer not found"}), 404
    if volunteer.role == "admin":
        return jsonify({"error": "Cannot issue certificates to admin accounts"}), 400

    opp_id = payload.get("opportunity_id")
    if opp_id:
        opportunity = db.session.get(Opportunity, opp_id)
        if not opportunity:
            return jsonify({"error": "Opportunity not found"}), 404
        if opportunity.org_id != org_id:
            return jsonify({"error": "Opportunity does not belong to this organization"}), 400

    cert = Certificate(
        volunteer_id=volunteer.id,
        organization_id=org.id,
        issued_by_id=issuer.id,
        opportunity_id=opp_id,
        hours=payload["hours"],
        completed_at=payload.get("completed_at"),
        status="issued",
        notes=payload.get("notes"),
    )
    db.session.add(cert)
    db.session.commit()

    storage_dir = Path(current_app.config.get("CERTIFICATES_DIR"))
    try:
        pdf_path = generate_certificate_pdf(
            certificate=cert,
            output_dir=storage_dir,
        )
        cert.pdf_path = str(pdf_path)
        db.session.commit()
        download_url = url_for("certificates.download_certificate", certificate_id=cert.id, _external=True)
    except Exception as exc:  # pragma: no cover - defensive logging
        current_app.logger.exception("Failed to generate certificate PDF: %s", exc)
        return jsonify({"error": "Certificate saved but PDF generation failed"}), 500

    # Include a signed download URL so volunteers can access from their email without logging in
    signed_download_url = f"{download_url}?token={create_access_token(identity=str(volunteer.id), additional_claims={'role': volunteer.role})}"

    try:
        if volunteer.email:
            send_templated_email(
                subject=f"Your volunteer certificate from {org.name}",
                recipients=volunteer.email,
                template_name="certificate_issued_email.html",
                context={
                    "user_name": volunteer.name or volunteer.email,
                    "organization_name": org.name,
                    "hours": payload["hours"],
                    "download_url": signed_download_url,
                },
            )
    except Exception as exc:  # pragma: no cover - defensive logging
        current_app.logger.exception("Failed to send certificate email: %s", exc)

    return jsonify({"certificate": _serialize_certificate(cert)}), 201


@bp.get("/")
@jwt_required()
def list_certificates():
    user = _get_user(_current_user_id())
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    org_id = request.args.get("organization_id", type=int)
    volunteer_id = request.args.get("volunteer_id", type=int)

    query = Certificate.query

    if user.is_admin():
        pass
    elif user.role == "organization":
        if not org_id:
            return jsonify({"error": "organization_id is required for organization users"}), 400
        if not user.is_org_admin(org_id):
            return jsonify({"error": "Forbidden"}), 403
        query = query.filter_by(organization_id=org_id)
    else:
        query = query.filter_by(volunteer_id=user.id)

    if volunteer_id:
        if user.role == "volunteer" and volunteer_id != user.id:
            return jsonify({"error": "Forbidden"}), 403
        query = query.filter_by(volunteer_id=volunteer_id)

    if org_id and user.is_admin():
        query = query.filter_by(organization_id=org_id)

    certificates = query.order_by(Certificate.issued_at.desc()).all()
    serialized = [_serialize_certificate(c) for c in certificates]
    return jsonify({"certificates": serialized})


@bp.get("/<int:certificate_id>")
@jwt_required()
def retrieve_certificate(certificate_id: int):
    cert = db.session.get(Certificate, certificate_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404
    user = _get_user(_current_user_id())
    if not _can_access_certificate(user, cert):
        return jsonify({"error": "Forbidden"}), 403
    return jsonify({"certificate": _serialize_certificate(cert)})


@bp.get("/<int:certificate_id>/pdf")
@jwt_required(optional=True)
def download_certificate(certificate_id: int):
    cert = db.session.get(Certificate, certificate_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404

    user = _get_user(_current_user_id())

    # Allow access via a signed token in the query string (for emailed links)
    if not user:
        token_param = request.args.get("token")
        if token_param:
            try:
                decoded = decode_token(token_param)
                identity = decoded.get("sub")
                user = _get_user(int(identity)) if identity is not None else None
            except Exception:
                return jsonify({"error": "Invalid or expired token"}), 401

    if not _can_access_certificate(user, cert):
        return jsonify({"error": "Forbidden"}), 403

    storage_dir = Path(current_app.config.get("CERTIFICATES_DIR"))
    if not storage_dir.exists():
        storage_dir.mkdir(parents=True, exist_ok=True)

    pdf_path = Path(cert.pdf_path) if cert.pdf_path else None
    if not pdf_path or not pdf_path.exists():
        try:
            pdf_path = generate_certificate_pdf(
                certificate=cert,
                output_dir=storage_dir,
            )
            cert.pdf_path = str(pdf_path)
            db.session.commit()
        except Exception as exc:  # pragma: no cover - defensive logging
            current_app.logger.exception("Failed to regenerate certificate PDF: %s", exc)
            return jsonify({"error": "Unable to generate certificate PDF"}), 500

    return send_file(pdf_path, as_attachment=True, download_name=f"certificate-{cert.id}.pdf")
