from .extensions import db
from datetime import datetime

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

    applications = db.relationship('Application', back_populates='opportunity', lazy='dynamic')

    def is_admin(self):
        return self.role == 'admin'

    def is_org_owner(self, org):
        return self.role == 'organization' and self.organization == org
    
    def is_org_member(self, org_id):
        return self.orgs.filter_by(id=org_id).first() is not None

    def is_org_admin(self, org_id):
        if self.role == 'admin':
            return True
        membership = db.session.execute(
            organization_members.select().where(
                (organization_members.c.user_id == self.id) &
                (organization_members.c.organization_id == org_id) &
                (organization_members.c.role == 'admin')
            )
        ).first()
        return membership is not None

    def has_org_role(self, org, role=None):
        link = db.session.execute(
            organization_members.select().where(
                (organization_members.c.user_id == self.id) &
                (organization_members.c.organization_id == org.id)
            )
        ).first()
        if not link:
            return False
        return link.role == role if role else True

    def join_org(self, org, role="member"):
        if not self.is_member_of(org):
            self.orgs.append(org)
            db.session.commit()

    def leave_org(self, org):
        if self.is_member_of(org):
            self.orgs.remove(org)
            db.session.commit()

    def is_member_of(self, org):
        return org in self.orgs

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

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

    owner = db.relationship('User', back_populates='organization')
    members = db.relationship('User', secondary=organization_members, back_populates='orgs', lazy='dynamic')

    opportunities = db.relationship('Opportunity', back_populates='organization', lazy='dynamic')

    def __repr__(self):
        return f"<Org {self.name}>"

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

    organization = db.relationship('Organization', back_populates='opportunities')
    applications = db.relationship('Application', back_populates='user', lazy='dynamic')
    
    def update_details(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
        db.session.commit()

    @staticmethod
    def filter_by_criteria(location=None, org_id=None, active_only=True):
        query = Opportunity.query
        if active_only:
            query = query.filter_by(is_active=True)
        if location:
            query = query.filter(Opportunity.location.ilike(f"%{location}%"))
        if org_id:
            query = query.filter_by(org_id=org_id)
        return query.order_by(Opportunity.created_at.desc()).all()

    def __repr__(self):
        return f"<Opportunity {self.title}>"

class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    status = db.Column(db.String(50), default='submitted')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='applications')
    opportunity = db.relationship('Opportunity', back_populates='applications')

    def review(self, decision):
        if decision not in ['approved', 'rejected']:
            raise ValueError("Decision must be 'approved' or 'rejected'")
        self.status = decision
        db.session.commit()

    def withdraw(self):
        if self.status not in ['submitted', 'approved']:
            raise ValueError("Cannot withdraw this application")
        self.status = 'withdrawn'
        db.session.commit()

    def __repr__(self):
        return f"<Application user={self.user_id} opp={self.opportunity_id} status={self.status}>"
