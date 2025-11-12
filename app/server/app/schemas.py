from marshmallow import fields

from .extensions import db, ma
from .models import Application, Opportunity, Organization, User


class BaseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        load_instance = True
        sqla_session = db.session
        include_fk = True


class UserSchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = User
        include_relationships = False
        exclude = ("password_hash",)


class OrganizationSchema(BaseSchema):
    owner_id = fields.Integer(dump_only=True)

    class Meta(BaseSchema.Meta):
        model = Organization
        include_relationships = False


class OpportunitySchema(BaseSchema):
    class Meta(BaseSchema.Meta):
        model = Opportunity
        include_relationships = False


class ApplicationSchema(BaseSchema):
    reviewed_at = fields.DateTime(dump_only=True)
    reviewed_by = fields.Integer(dump_only=True)
    review_note = fields.String(dump_only=True)

    class Meta(BaseSchema.Meta):
        model = Application
        include_relationships = False
