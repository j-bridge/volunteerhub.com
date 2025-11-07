import os
from flask import current_app

def get_upload_folder():
    """Return the upload folder from Flask config"""
    return current_app.config.get("UPLOAD_FOLDER")
