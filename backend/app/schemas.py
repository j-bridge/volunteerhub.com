from .extensions import ma
from .models import User, Organization, Opportunity, Application
from marshmallow import fields, validate

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    email = ma.auto_field(required=True, validate=validate.Email(error='Invalid email'))
    name = ma.auto_field(validate=validate.Length(max=255))
    role = ma.auto_field(validate=validate.OneOf(['volunteer','organization','admin']))

class OrgSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Organization
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    name = ma.auto_field(required=True, validate=validate.Length(min=2, max=255))
    contact_email = ma.auto_field(validate=validate.Email())
    description = ma.auto_field()
    members = fields.List(fields.Nested(lambda: UserSchema(only=('id','email','name'))))

class OpportunitySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Opportunity
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    title = ma.auto_field(required=True, validate=validate.Length(min=3, max=255))
    description = ma.auto_field()
    location = ma.auto_field()
    start_date = fields.DateTime(allow_none=True)
    end_date = fields.DateTime(allow_none=True)
    organization = fields.Nested(OrgSchema(only=('id','name')))

class ApplicationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Application
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    status = ma.auto_field()
    user = fields.Nested(UserSchema(only=('id','email','name')))
    opportunity = fields.Nested(OpportunitySchema(only=('id','title')))
