from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import Organization
from ..permissions import role_required, org_admin_or_site_admin_required
from ..schemas import OrganizationSchema, OrganizationCreateSchema
from marshmallow import ValidationError

bp = Blueprint("orgs", __name__)
organization_schema = OrganizationSchema()
organizations_schema = OrganizationSchema(many=True)
org_create_schema = OrganizationCreateSchema()


@bp.get("/")
def list_organizations():
    statement = select(Organization).order_by(Organization.created_at.desc())
    organizations = db.session.execute(statement).scalars().all()
    return jsonify({"organizations": organizations_schema.dump(organizations)})


@bp.post("/")
@jwt_required()
@role_required("admin")
def create_organization():
    try:
        payload = org_create_schema.load(request.get_json(silent=True) or {}, partial=False)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    organization = Organization(**payload)
    db.session.add(organization)
    db.session.commit()
    return jsonify({"organization": organization_schema.dump(organization)}), 201


@bp.get("/<int:organization_id>")
def retrieve_organization(organization_id: int):
    organization = db.session.get(Organization, organization_id)
    if not organization:
        return jsonify({"error": "Organization not found"}), 404
    return jsonify({"organization": organization_schema.dump(organization)})


@bp.patch("/<int:organization_id>")
@jwt_required()
@org_admin_or_site_admin_required("organization_id")
def update_organization(organization_id: int):
    organization = db.session.get(Organization, organization_id)
    if not organization:
        return jsonify({"error": "Organization not found"}), 404

    try:
        payload = org_create_schema.load(request.get_json(silent=True) or {}, partial=True)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    for field in ("name", "contact_email", "description", "owner_id", "is_active"):
        if field in payload and payload[field] is not None:
            setattr(organization, field, payload[field])

    db.session.commit()
    return jsonify({"organization": organization_schema.dump(organization)})
