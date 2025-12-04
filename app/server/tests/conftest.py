import os
import sys
import shutil
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402


@pytest.fixture(scope="session")
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()


@pytest.fixture(autouse=True)
def clean_db(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        cert_dir_setting = app.config.get("CERTIFICATES_DIR")
        if cert_dir_setting:
            cert_dir = Path(cert_dir_setting)
            if cert_dir.is_dir():
                shutil.rmtree(cert_dir)
    yield


@pytest.fixture(scope="function")
def client(app):
    return app.test_client()
