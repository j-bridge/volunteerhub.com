import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent 
INSTANCE_DIR = BASE_DIR / "instance"
INSTANCE_DIR.mkdir(exist_ok=True)  

class BaseConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev")

    CORS_ORIGINS = "*"
    default_sqlite_path = INSTANCE_DIR / "volunteerhub.db"
    default_sqlite_url = f"sqlite:///{str(default_sqlite_path).replace(os.sep, '/')}"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "instance", "volunteerhub.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_EXPIRES_MINUTES", "30"))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("JWT_REFRESH_EXPIRES_DAYS", "30"))
    )
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    PROPAGATE_EXCEPTIONS = True


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=10)


class ProductionConfig(BaseConfig):
    DEBUG = False


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(name: str | None = None) -> type[BaseConfig]:
    env_name = name or os.getenv("FLASK_ENV", "development")
    return CONFIG_MAP.get(env_name, DevelopmentConfig)
