from app.extensions import db
from app.models import User


def promote_to_admin(app, email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        user.role = "admin"
        db.session.commit()


def test_certificate_issue_and_download(client, app):
    client.post("/api/auth/register", json={"email": "admin@example.com", "password": "Passw0rd!"})
    promote_to_admin(app, "admin@example.com")
    admin_tok = client.post(
        "/api/auth/login", json={"email": "admin@example.com", "password": "Passw0rd!"}
    ).json["tokens"]["access_token"]

    client.post(
        "/api/auth/register",
        json={
            "email": "org@example.com",
            "password": "Passw0rd!",
            "role": "organization",
            "name": "Org Manager",
            "organization_name": "Helping Hands",
        },
    )
    client.post(
        "/api/auth/register",
        json={"email": "vol@example.com", "password": "Passw0rd!", "name": "Volunteer One"},
    )

    with app.app_context():
        org_user = User.query.filter_by(email="org@example.com").first()
        vol_user = User.query.filter_by(email="vol@example.com").first()
        org_user_id = org_user.id
        volunteer_id = vol_user.id

    org_res = client.post(
        "/api/orgs/",
        json={"name": "Helping Hands", "owner_id": org_user_id},
        headers={"Authorization": f"Bearer {admin_tok}"},
    )
    org_id = org_res.json["organization"]["id"]

    org_tok = client.post(
        "/api/auth/login", json={"email": "org@example.com", "password": "Passw0rd!"}
    ).json["tokens"]["access_token"]

    cert_res = client.post(
        "/api/certificates/",
        json={
            "volunteer_email": "vol@example.com",
            "organization_id": org_id,
            "hours": 10.5,
            "completed_at": "2024-12-01",
            "notes": "Outstanding dedication",
        },
        headers={"Authorization": f"Bearer {org_tok}"},
    )

    assert cert_res.status_code == 201
    cert_id = cert_res.json["certificate"]["id"]
    assert cert_res.json["certificate"]["organization_id"] == org_id
    assert cert_res.json["certificate"]["download_url"]

    vol_tok = client.post(
        "/api/auth/login", json={"email": "vol@example.com", "password": "Passw0rd!"}
    ).json["tokens"]["access_token"]

    list_res = client.get("/api/certificates/", headers={"Authorization": f"Bearer {vol_tok}"})
    assert list_res.status_code == 200
    assert any(c["id"] == cert_id for c in list_res.json["certificates"])

    pdf_res = client.get(f"/api/certificates/{cert_id}/pdf", headers={"Authorization": f"Bearer {vol_tok}"})
    assert pdf_res.status_code == 200
    assert pdf_res.data.startswith(b"%PDF")
