from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import Application
from ..permissions import role_required
from ..schemas import ApplicationSchema

bp = Blueprint("applications", __name__)
application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)


@bp.get("/")
@jwt_required()
@role_required("admin")
def list_applications():
    statement = select(Application).order_by(Application.created_at.desc())
    applications = db.session.execute(statement).scalars().all()
    return jsonify({"applications": applications_schema.dump(applications)})


@bp.get("/my")
@jwt_required()
def list_my_applications():
    user_id = get_jwt_identity()
    statement = select(Application).filter_by(user_id=user_id).order_by(Application.created_at.desc())
    applications = db.session.execute(statement).scalars().all()
    return jsonify({"applications": applications_schema.dump(applications)})


@bp.post("/")
@jwt_required()
def create_application():
    payload = request.get_json(silent=True) or {}
    opportunity_id = payload.get("opportunity_id")
    if not opportunity_id:
        return jsonify({"error": "opportunity_id is required"}), 400

    user_id = get_jwt_identity()
    existing = db.session.execute(
        select(Application).filter_by(user_id=user_id, opportunity_id=opportunity_id)
    ).scalar_one_or_none()
    if existing:
        return jsonify({"error": "Application already submitted"}), 409

    application = Application(user_id=user_id, opportunity_id=opportunity_id)
    db.session.add(application)
    db.session.commit()
    return jsonify({"application": application_schema.dump(application)}), 201


@bp.patch("/<int:application_id>")
@jwt_required()
@role_required("admin", "organization")
def update_application(application_id: int):
    application = db.session.get(Application, application_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404

    payload = request.get_json(silent=True) or {}
    status = payload.get("status")
    if status:
        application.status = status

    db.session.commit()
    return jsonify({"application": application_schema.dump(application)})
