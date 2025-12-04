from .extensions import db
from datetime import datetime, date

organization_members = db.Table(
    'organization_members',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('organization_id', db.Integer, db.ForeignKey('organizations.id'), primary_key=True),
    db.Column('role', db.String(64), nullable=False, default='member'),
    db.Column('joined_at', db.DateTime, default=datetime.utcnow)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255))
    role = db.Column(db.String(50), nullable=False, default='volunteer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    organization = db.relationship('Organization', back_populates='owner', uselist=False)
    orgs = db.relationship('Organization', secondary=organization_members, back_populates='members', lazy='dynamic')

    def is_admin(self) -> bool:
        return self.role == "admin"

    def is_org_member(self, org_id: int) -> bool:
        if not org_id:
            return False
        return self.orgs.filter_by(id=org_id).first() is not None

    def is_org_admin(self, org_id: int) -> bool:
        if not org_id:
            return False
        org = Organization.query.get(org_id)
        if not org:
            return False
        return org.owner_id == self.id or self.is_org_member(org_id)

class Organization(db.Model):
    __tablename__ = 'organizations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(255))
    description = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    owner = db.relationship('User', back_populates='organization')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    members = db.relationship('User', secondary=organization_members, back_populates='orgs', lazy='dynamic')

class Opportunity(db.Model):
    __tablename__ = 'opportunities'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(255))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    organization = db.relationship('Organization', backref=db.backref('opportunities', lazy='dynamic'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    @staticmethod
    def filter_by_criteria(location=None, org_id=None, active_only=True):
        q = Opportunity.query
        if active_only:
            q = q.filter_by(is_active=True)
        if location:
            q = q.filter(Opportunity.location.ilike(f"%{location}%"))
        if org_id:
            q = q.filter_by(org_id=org_id)
        return q.order_by(Opportunity.created_at.desc()).all()

    def update_details(self, **data):
        for field in ("title", "description", "location", "start_date", "end_date", "org_id", "is_active"):
            if field in data and data[field] is not None:
                setattr(self, field, data[field])
        db.session.commit()

class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    status = db.Column(db.String(50), default='submitted')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('applications', lazy='dynamic'))
    opportunity = db.relationship('Opportunity', backref=db.backref('applications', lazy='dynamic'))

    def review(self, decision: str):
        if decision not in ("accept", "reject"):
            raise ValueError("decision must be accept or reject")
        self.status = "accepted" if decision == "accept" else "rejected"
        db.session.commit()

    def withdraw(self):
        if self.status in ("accepted", "rejected", "withdrawn"):
            raise ValueError("cannot withdraw once finalized")
        self.status = "withdrawn"
        db.session.commit()


class VideoSubmission(db.Model):
    __tablename__ = "video_submissions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    video_url = db.Column(db.String(512), nullable=False)
    status = db.Column(db.String(50), default="submitted")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("videos", lazy="dynamic"))
    opportunity = db.relationship("Opportunity", backref=db.backref("video_submissions", lazy="dynamic"))


class Certificate(db.Model):
    __tablename__ = "certificates"
    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"), nullable=False)
    issued_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"), nullable=True)
    hours = db.Column(db.Float, nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), default="issued")
    pdf_path = db.Column(db.String(512), nullable=True)
    notes = db.Column(db.Text, nullable=True)

    volunteer = db.relationship("User", foreign_keys=[volunteer_id])
    issued_by = db.relationship("User", foreign_keys=[issued_by_id])
    organization = db.relationship("Organization")
    opportunity = db.relationship("Opportunity")
