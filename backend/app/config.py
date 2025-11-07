import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

class Config:
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///../instance/volunteerhub.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'supersecret123')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173')

    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.example.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() in ('1','true','yes')
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@volunteerhub.local')
    UPLOAD_FOLDER = UPLOAD_FOLDER

MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
