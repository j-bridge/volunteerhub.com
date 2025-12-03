def test_register_and_login(client):
    r = client.post("/api/auth/register", json={"email": "t@example.com", "password": "Passw0rd!"})
    assert r.status_code == 201
    assert r.json["user"]["role"] == "volunteer"

    login = client.post("/api/auth/login", json={"email": "t@example.com", "password": "Passw0rd!"})
    assert login.status_code == 200
    assert "access_token" in login.json["tokens"]


def test_registration_rejects_weak_password(client):
    r = client.post("/api/auth/register", json={"email": "weak@example.com", "password": "short"})
    assert r.status_code == 400
    assert "password" in r.json["error"]
