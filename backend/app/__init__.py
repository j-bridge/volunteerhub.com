from flask import Flask
from .config import Config
from .extensions import db, ma, jwt, migrate, mail

def create_app():
    app = Flask(__name__)

    import os
    
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static', 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config.from_object(Config)

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Register blueprints
    from .auth.routes import auth_bp
    from .users.routes import users_bp
    from .opportunities.routes import opp_bp
    from .applications.routes import applications_bp
    from .orgs.routes import orgs_bp
    from .admin.routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(opp_bp, url_prefix="/opportunities")
    app.register_blueprint(applications_bp, url_prefix="/applications")
    app.register_blueprint(orgs_bp, url_prefix="/orgs")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    return app
