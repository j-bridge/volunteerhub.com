import os
from typing import Iterable

from flask import Flask, jsonify

from .config import get_config
from .extensions import bcrypt, cors, db, jwt, ma, migrate
from .auth import auth_bp
from .users import users_bp
from .opportunities import opportunities_bp
from .applications import applications_bp
from .orgs import orgs_bp


def create_app(config_name: str | None = None) -> Flask:
    """Application factory used by the Flask CLI and WSGI servers."""
    app = Flask(__name__, instance_relative_config=True)
    config_obj = get_config(config_name)
    app.config.from_object(config_obj)

    os.makedirs(app.instance_path, exist_ok=True)
    instance_config = os.path.join(app.instance_path, "config.py")
    if os.path.exists(instance_config):
        app.config.from_pyfile("config.py", silent=True)

    register_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)
    register_shellcontext(app)

    @app.get("/health")
    def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    return app


def register_extensions(app: Flask) -> None:
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    allowed_origins: Iterable[str] | str | None = app.config.get("CORS_ORIGINS")
    if isinstance(allowed_origins, str):
        allowed_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
    cors.init_app(app, resources={r"/api/*": {"origins": allowed_origins or "*"}})


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(opportunities_bp, url_prefix="/api/opportunities")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(orgs_bp, url_prefix="/api/orgs")


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def handle_not_found(error):  # type: ignore[override]
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(500)
    def handle_internal_error(error):  # type: ignore[override]
        return jsonify({"error": "Internal Server Error"}), 500


def register_shellcontext(app: Flask) -> None:
    from . import models

    @app.shell_context_processor
    def shell_context() -> dict[str, object]:
        return {
            "db": db,
            "User": models.User,
            "Organization": models.Organization,
            "Opportunity": models.Opportunity,
            "Application": models.Application,
        }
