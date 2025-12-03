def promote_to_admin(app, email):
    from app.extensions import db
    from app.models import User
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        user.role = "admin"
        db.session.commit()


def test_org_and_opportunity_flow(client, app):
    # register and promote admin
    client.post("/api/auth/register", json={"email": "admin@example.com", "password": "Passw0rd!"})
    promote_to_admin(app, "admin@example.com")
    login = client.post("/api/auth/login", json={"email": "admin@example.com", "password": "Passw0rd!"})
    tok = login.json["tokens"]["access_token"]

    # create org
    org_res = client.post("/api/orgs/", json={"name": "Org1", "contact_email": "c@o.com"}, headers={"Authorization": f"Bearer {tok}"})
    assert org_res.status_code == 201
    org_id = org_res.json["organization"]["id"]

    # create opportunity
    opp_res = client.post(
        "/api/opportunities/",
        json={"title": "Help", "org_id": org_id},
        headers={"Authorization": f"Bearer {tok}"},
    )
    assert opp_res.status_code == 201
    opp_id = opp_res.json["opportunity"]["id"]

    # apply as volunteer
    client.post("/api/auth/register", json={"email": "vol@example.com", "password": "Passw0rd!"})
    login_vol = client.post("/api/auth/login", json={"email": "vol@example.com", "password": "Passw0rd!"})
    vol_tok = login_vol.json["tokens"]["access_token"]

    apply_res = client.post(
        "/api/applications/",
        json={"opportunity_id": opp_id},
        headers={"Authorization": f"Bearer {vol_tok}"},
    )
    assert apply_res.status_code == 201
    app_id = apply_res.json["application"]["id"]

    # review by admin
    review_res = client.patch(
        f"/api/applications/{app_id}/review",
        json={"decision": "accept"},
        headers={"Authorization": f"Bearer {tok}"},
    )
    assert review_res.status_code == 200
    assert review_res.json["application"]["status"] == "accepted"
