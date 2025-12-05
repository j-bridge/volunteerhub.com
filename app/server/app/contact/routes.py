from flask import Blueprint, jsonify, request, current_app
from marshmallow import ValidationError

from ..schemas import ContactSchema
from ..utils.emailer import send_templated_email

bp = Blueprint("contact", __name__)
contact_schema = ContactSchema()


def _contact_inbox() -> str | None:
    cfg = current_app.config
    return (
        cfg.get("CONTACT_INBOX")
        or cfg.get("MAIL_DEFAULT_SENDER")
        or cfg.get("SMTP_USERNAME")
    )


@bp.post("/")
def submit_contact():
    try:
        payload = contact_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    payload["email"] = payload["email"].strip()
    payload["name"] = payload["name"].strip()
    if payload.get("organization"):
        payload["organization"] = payload["organization"].strip()
    payload["message"] = payload["message"].strip()

    inbox = _contact_inbox()

    context = {
        "name": payload["name"],
        "email": payload["email"],
        "organization": payload.get("organization"),
        "message": payload["message"],
        "preheader": "We received your inquiry and will follow up shortly.",
    }

    # Send internal notification
    if inbox:
        try:
            send_templated_email(
                subject=f"[VolunteerHub] New inquiry from {payload['name']}",
                recipients=inbox,
                template_name="contact_notification_email.html",
                context=context,
            )
        except Exception:
            current_app.logger.exception("Failed to send contact notification")

    # Send confirmation to user
    try:
        send_templated_email(
            subject="We received your message",
            recipients=payload["email"],
            template_name="contact_ack_email.html",
            context=context,
        )
    except Exception:
        current_app.logger.exception("Failed to send contact acknowledgement")

    return jsonify({"message": "Inquiry received"}), 200
