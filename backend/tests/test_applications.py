def test_apply_and_withdraw(client):
    r = client.post('/auth/register', json={'email':'t1@example.com','password':'pass','name':'T1'})
    assert r.status_code == 201
    r2 = client.post('/auth/register', json={'email':'org1@example.com','password':'pass','name':'Org1','role':'organization'})
    assert r2.status_code == 201
    login = client.post('/auth/login', json={'email':'org1@example.com','password':'pass'})
    tok = login.json['access_token']
    r3 = client.post('/orgs/', json={'name':'OrgName'}, headers={'Authorization':f'Bearer {tok}'})
    assert r3.status_code in (200,201)
    r4 = client.post('/opportunities/', json={'title':'Help'}, headers={'Authorization':f'Bearer {tok}'})
    assert r4.status_code == 201
    opp_id = r4.json['id']
    loginv = client.post('/auth/login', json={'email':'t1@example.com','password':'pass'})
    vt = loginv.json['access_token']
    ra = client.post('/applications/apply', json={'opportunity_id':opp_id}, headers={'Authorization':f'Bearer {vt}'})
    assert ra.status_code == 201
    app_id = ra.json['id']
    rw = client.post(f'/applications/{app_id}/withdraw', headers={'Authorization':f'Bearer {vt}'})
    assert rw.status_code == 200
