from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import Opportunity
from ..permissions import role_required
from ..schemas import OpportunitySchema

bp = Blueprint("opportunities", __name__)
opportunity_schema = OpportunitySchema()
opportunities_schema = OpportunitySchema(many=True)


@bp.get("/")
def list_opportunities():
    statement = select(Opportunity).order_by(Opportunity.created_at.desc())
    opportunities = db.session.execute(statement).scalars().all()
    return jsonify({"opportunities": opportunities_schema.dump(opportunities)})


@bp.post("/")
@jwt_required()
@role_required("organization", "admin")
def create_opportunity():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    org_id = payload.get("org_id") or payload.get("organization_id")
    if org_id is None:
        return jsonify({"error": "organization_id is required"}), 400

    opportunity = Opportunity(
        title=title,
        description=payload.get("description"),
        location=payload.get("location"),
        start_date=_parse_datetime(payload.get("start_date")),
        end_date=_parse_datetime(payload.get("end_date")),
        org_id=org_id,
    )
    db.session.add(opportunity)
    db.session.commit()
    return jsonify({"opportunity": opportunity_schema.dump(opportunity)}), 201


@bp.get("/<int:opportunity_id>")
def retrieve_opportunity(opportunity_id: int):
    opportunity = db.session.get(Opportunity, opportunity_id)
    if not opportunity:
        return jsonify({"error": "Opportunity not found"}), 404
    return jsonify({"opportunity": opportunity_schema.dump(opportunity)})


def _parse_datetime(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None
