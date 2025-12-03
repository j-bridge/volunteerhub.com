from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from ..extensions import db
from ..models import Application, Opportunity, Organization, User, VideoSubmission
from ..permissions import role_required
from ..schemas import (
    ApplicationSchema,
    OpportunitySchema,
    OrganizationSchema,
    UserSchema,
    VideoSubmissionSchema,
)

bp = Blueprint("admin", __name__)

user_schema = UserSchema(many=True)
org_schema = OrganizationSchema(many=True)
opp_schema = OpportunitySchema(many=True)
app_schema = ApplicationSchema(many=True)
video_schema = VideoSubmissionSchema(many=True)


@bp.get("/summary")
@jwt_required()
@role_required("admin")
def summary():
    role_counts = dict(db.session.query(User.role, func.count(User.id)).group_by(User.role).all())

    counts = {
        "users": db.session.query(func.count(User.id)).scalar() or 0,
        "volunteers": role_counts.get("volunteer", 0),
        "organizations": role_counts.get("organization", 0),
        "admins": role_counts.get("admin", 0),
        "orgs": db.session.query(func.count(Organization.id)).scalar() or 0,
        "opportunities": db.session.query(func.count(Opportunity.id)).scalar() or 0,
        "applications": db.session.query(func.count(Application.id)).scalar() or 0,
        "active_opportunities": db.session.query(func.count(Opportunity.id)).filter_by(is_active=True).scalar() or 0,
        "video_submissions": db.session.query(func.count(VideoSubmission.id)).scalar() or 0,
    }

    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    recent_opps = Opportunity.query.order_by(Opportunity.created_at.desc()).limit(5).all()
    recent_apps = Application.query.order_by(Application.created_at.desc()).limit(5).all()
    recent_videos = VideoSubmission.query.order_by(VideoSubmission.created_at.desc()).limit(5).all()

    return jsonify(
        {
            "counts": counts,
            "recent_users": user_schema.dump(recent_users),
            "recent_opportunities": opp_schema.dump(recent_opps),
            "recent_applications": app_schema.dump(recent_apps),
            "recent_videos": video_schema.dump(recent_videos),
        }
    )
