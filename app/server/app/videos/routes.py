from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required, verify_jwt_in_request
from marshmallow import ValidationError

from ..extensions import db
from ..models import Opportunity, VideoSubmission
from ..permissions import role_required
from ..schemas import (
    VideoSubmissionCreateSchema,
    VideoSubmissionSchema,
    VideoSubmissionStatusSchema,
)

bp = Blueprint("videos", __name__)

video_schema = VideoSubmissionSchema()
videos_schema = VideoSubmissionSchema(many=True)
create_schema = VideoSubmissionCreateSchema()
status_schema = VideoSubmissionStatusSchema()


def _claims():
    """
    Best-effort claim retrieval; falls back to empty dict to keep the endpoint
    publicly accessible even if an invalid/expired token is sent.
    """
    try:
        verify_jwt_in_request(optional=True)
        return get_jwt() or {}
    except Exception:
        return {}


@bp.get("/")
def list_videos():
    claims = _claims()
    is_admin = claims.get("role") == "admin"
    status = request.args.get("status")

    query = VideoSubmission.query.order_by(VideoSubmission.created_at.desc())
    if not is_admin:
        query = query.filter_by(status="approved")
    elif status:
        query = query.filter_by(status=status)

    videos = query.limit(50).all()
    return jsonify({"videos": videos_schema.dump(videos)})


@bp.get("/my")
@jwt_required()
def my_videos():
    user_id = get_jwt_identity()
    vids = VideoSubmission.query.filter_by(user_id=user_id).order_by(VideoSubmission.created_at.desc()).all()
    return jsonify({"videos": videos_schema.dump(vids)})


@bp.post("/")
@jwt_required()
def create_video():
    try:
        payload = create_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    opp_id = payload.get("opportunity_id")
    if opp_id:
        opp = db.session.get(Opportunity, opp_id)
        if not opp:
            return jsonify({"error": "Opportunity not found"}), 404

    video = VideoSubmission(
        user_id=get_jwt_identity(),
        opportunity_id=opp_id,
        title=payload["title"],
        description=payload.get("description"),
        video_url=payload["video_url"],
        status="submitted",
    )
    db.session.add(video)
    db.session.commit()

    return jsonify({"video": video_schema.dump(video)}), 201


@bp.patch("/<int:video_id>/status")
@jwt_required()
@role_required("admin")
def update_status(video_id: int):
    try:
        payload = status_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    video = db.session.get(VideoSubmission, video_id)
    if not video:
        return jsonify({"error": "Not found"}), 404

    video.status = payload["status"]
    db.session.commit()
    return jsonify({"video": video_schema.dump(video)})
