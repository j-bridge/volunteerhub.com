from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..extensions import db
from ..models import Application
from ..permissions import organization_required
from ..schemas import ApplicationSchema, ApplicationCreateSchema, ApplicationReviewSchema
from marshmallow import ValidationError

bp = Blueprint("applications", __name__)
application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)
application_create_schema = ApplicationCreateSchema()
application_review_schema = ApplicationReviewSchema()


@bp.get("/my")
@jwt_required()
def my_applications():
    user_id = get_jwt_identity()
    apps = Application.query.filter_by(user_id=user_id).order_by(Application.created_at.desc()).all()
    return jsonify({"applications": applications_schema.dump(apps)})


@bp.post("/")
@jwt_required()
def create_application():
    try:
        data = application_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    user_id = get_jwt_identity()
    opp_id = data.get("opportunity_id")

    existing = Application.query.filter_by(user_id=user_id, opportunity_id=opp_id).first()
    if existing:
        return jsonify({"error": "Application already exists"}), 409

    app = Application(user_id=user_id, opportunity_id=opp_id)
    db.session.add(app)
    db.session.commit()
    return jsonify({"application": application_schema.dump(app)}), 201


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
    user_id = get_jwt_identity()
    app = Application.query.filter_by(id=application_id, user_id=user_id).first()
    if not app:
        return jsonify({"error": "Not found"}), 404
    try:
        app.withdraw()
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"application": application_schema.dump(app)})
