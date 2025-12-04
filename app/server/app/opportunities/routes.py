from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..extensions import db
from ..models import Opportunity, Organization, User
from ..permissions import org_admin_or_site_admin_required
from ..schemas import OpportunitySchema, OpportunityCreateSchema, OpportunityUpdateSchema
from marshmallow import ValidationError

bp = Blueprint("opportunities", __name__)
opportunity_schema = OpportunitySchema()
opportunities_schema = OpportunitySchema(many=True)
opp_create_schema = OpportunityCreateSchema()
opp_update_schema = OpportunityUpdateSchema()


@bp.get("/")
def list_opportunities():
    location = request.args.get("location")
    org_id = request.args.get("org_id")
    opportunities = Opportunity.filter_by_criteria(location=location, org_id=org_id)
    return jsonify({"opportunities": opportunities_schema.dump(opportunities)})


@bp.get("/<int:opportunity_id>")
def get_opportunity(opportunity_id):
    opp = db.session.get(Opportunity, opportunity_id)
    if not opp:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"opportunity": opportunity_schema.dump(opp)})


@bp.post("/")
@jwt_required()
@org_admin_or_site_admin_required("org_id")
def create_opportunity():
    try:
        data = opp_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    try:
        current_user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"error": "Unauthorized"}), 401

    current_user = db.session.get(User, current_user_id)
    claims = get_jwt()

    if not data.get("org_id"):
        # Auto-attach to the org owned by this user
        owned_org = Organization.query.filter_by(owner_id=current_user.id).first()
        if owned_org:
            data["org_id"] = owned_org.id
        else:
            return jsonify({"error": "Organization id is required"}), 400

    # Only allow non-admins to create within their org
    if claims.get("role") != "admin":
        org = db.session.get(Organization, data["org_id"])
        if not org or org.owner_id != current_user.id:
            return jsonify({"error": "Forbidden"}), 403

    # Drop non-model fields that may be present in the payload/schema
    allowed_fields = {
        "title",
        "description",
        "location",
        "start_date",
        "end_date",
        "org_id",
    }
    filtered_data = {k: v for k, v in data.items() if k in allowed_fields}

    opp = Opportunity(**filtered_data)
    db.session.add(opp)
    db.session.commit()
    return jsonify({"opportunity": opportunity_schema.dump(opp)}), 201


@bp.patch("/<int:opportunity_id>")
@jwt_required()
@org_admin_or_site_admin_required()
def update_opportunity(opportunity_id):
    opp = db.session.get(Opportunity, opportunity_id)
    if not opp:
        return jsonify({"error": "Not found"}), 404
    try:
        data = opp_update_schema.load(request.get_json() or {}, partial=True)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    opp.update_details(**data)
    return jsonify({"opportunity": opportunity_schema.dump(opp)})


@bp.delete("/<int:opportunity_id>")
@jwt_required()
@org_admin_or_site_admin_required()
def delete_opportunity(opportunity_id):
    opp = db.session.get(Opportunity, opportunity_id)
    if not opp:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(opp)
    db.session.commit()
    return jsonify({"message": "Opportunity deleted"}), 200
