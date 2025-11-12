from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models import Opportunity
from ..permissions import org_admin_or_site_admin_required
from ..schemas import OpportunitySchema

bp = Blueprint("opportunities", __name__)
opportunity_schema = OpportunitySchema()
opportunities_schema = OpportunitySchema(many=True)


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
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "Title required"}), 400

    opp = Opportunity(
        title=title,
        description=data.get("description"),
        location=data.get("location"),
        start_date=_parse_datetime(data.get("start_date")),
        end_date=_parse_datetime(data.get("end_date")),
        org_id=data.get("org_id"),
    )
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
    data = request.get_json() or {}
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


def _parse_datetime(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except Exception:
        return None
