from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Opportunity, Organization
from ..schemas import OpportunitySchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..permissions import role_required

opp_bp = Blueprint('opportunities', __name__)
opp_schema = OpportunitySchema()
opps_schema = OpportunitySchema(many=True)

@opp_bp.route('/', methods=['GET'])
def list_opps():
    q = Opportunity.query.filter_by(is_active=True).order_by(Opportunity.created_at.desc())
    return opps_schema.jsonify(q.all())

@opp_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('organization','admin')
def create_opp():
    data = request.get_json() or {}
    uid = get_jwt_identity()
    org = Organization.query.filter_by(owner_id=uid).first()
    if not org:
        return jsonify({'msg':'organization profile required to create opportunities'}), 403
    opp = Opportunity(title=data.get('title'), description=data.get('description'), location=data.get('location'), start_date=data.get('start_date'), end_date=data.get('end_date'), org_id=org.id)
    db.session.add(opp)
    db.session.commit()
    return opp_schema.jsonify(opp), 201
