from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..extensions import db
from ..models import Application, Opportunity, User
from ..permissions import organization_required, org_admin_or_site_admin_required
from ..schemas import ApplicationSchema, ApplicationCreateSchema, ApplicationReviewSchema
from marshmallow import ValidationError
from ..utils.emailer import send_email, send_templated_email

bp = Blueprint("applications", __name__)
application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)
application_create_schema = ApplicationCreateSchema()
application_review_schema = ApplicationReviewSchema()

def _current_user_id() -> int | None:
    try:
        return int(get_jwt_identity())
    except (TypeError, ValueError):
        return None


@bp.get("/my")
@jwt_required()
def my_applications():
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    apps = Application.query.filter_by(user_id=user_id).order_by(Application.created_at.desc()).all()
    return jsonify({"applications": applications_schema.dump(apps)})


@bp.get("/org")
@jwt_required()
@org_admin_or_site_admin_required("org_id")
def org_applications():
    org_id = request.args.get("org_id", type=int)
    if not org_id:
        return jsonify({"error": "org_id is required"}), 400
    # List applications for opportunities belonging to this org
    apps = (
        Application.query.join(Opportunity, Application.opportunity_id == Opportunity.id)
        .filter(Opportunity.org_id == org_id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return jsonify({"applications": applications_schema.dump(apps)})


@bp.post("/")
@jwt_required()
def create_application():
    try:
        data = application_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    opp_id = data.get("opportunity_id")

    existing = Application.query.filter_by(user_id=user_id, opportunity_id=opp_id).first()
    if existing:
        return jsonify({"error": "Application already exists"}), 409

    app_model = Application(user_id=user_id, opportunity_id=opp_id)
    db.session.add(app_model)
    db.session.commit()

    try:
        applicant = db.session.get(User, user_id)
        opportunity = db.session.get(Opportunity, opp_id)
        frontend = current_app.config.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        opp_link = f"{frontend}/opportunities/{opp_id}"

        if applicant and opportunity:
            send_templated_email(
                subject=f"Application received: {opportunity.title}",
                recipients=applicant.email,
                template_name="application_submitted_email.html",
                context={
                    "user_name": applicant.name,
                    "opportunity_title": opportunity.title,
                    "opportunity_url": opp_link,
                },
            )

            contact_email = opportunity.organization.contact_email if opportunity.organization else None
            if contact_email:
                send_templated_email(
                    subject=f"New volunteer application for {opportunity.title}",
                    recipients=contact_email,
                    template_name="application_notification_email.html",
                    context={
                        "opportunity_title": opportunity.title,
                        "applicant_email": applicant.email,
                        "opportunity_url": opp_link,
                    },
                )
    except Exception:
        current_app.logger.exception("Failed to send application notification")

    return jsonify({"application": application_schema.dump(app_model)}), 201


@bp.patch("/<int:application_id>/review")
@jwt_required()
@organization_required
def review_application(application_id):
    try:
        data = application_review_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    decision = data.get("decision")
    app = db.session.get(Application, application_id)
    if not app:
        return jsonify({"error": "Not found"}), 404
    try:
        app.review(decision)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"application": application_schema.dump(app)})


@bp.patch("/<int:application_id>/withdraw")
@jwt_required()
def withdraw_application(application_id):
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    app = Application.query.filter_by(id=application_id, user_id=user_id).first()
    if not app:
        return jsonify({"error": "Not found"}), 404
    try:
        app.withdraw()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"application": application_schema.dump(app)})
