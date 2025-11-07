from flask import Blueprint, request, jsonify, current_app
from app.utils.file_utils import save_file
import os
from . import get_upload_folder
upload_folder = get_upload_folder()

uploads_bp = Blueprint("uploads_bp", __name__)

@uploads_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = save_file(file, current_app.config["UPLOAD_FOLDER"])

    return jsonify({"message": "File uploaded", "filename": filename})
