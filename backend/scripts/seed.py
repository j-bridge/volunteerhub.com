from app import create_app
from app.extensions import db
from app.models import User, Organization
from app.security import hash_password

app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
    admin = User(email='admin@example.com', password_hash=hash_password('adminpass'), name='Admin', role='admin')
    org_user = User(email='org@example.com', password_hash=hash_password('orgpass'), name='OrgOwner', role='organization')
    vol = User(email='vol@example.com', password_hash=hash_password('volpass'), name='Volunteer', role='volunteer')
    db.session.add_all([admin, org_user, vol])
    db.session.commit()
    org = Organization(name='Helping Hands', contact_email='contact@helping.org', owner_id=org_user.id, description='A demo org')
    db.session.add(org)
    db.session.commit()
    org.members.append(org_user)
    db.session.commit()
    print('Seeded admin, org owner, volunteer')
