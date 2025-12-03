from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models import Opportunity
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

    opp = Opportunity(**data)
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
