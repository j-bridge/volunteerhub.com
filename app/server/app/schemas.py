from marshmallow import Schema, fields, validate, validates_schema, ValidationError, pre_load
from .extensions import ma
from .models import User, Organization, Opportunity, Application, VideoSubmission, Certificate


# Misc / contact
class ContactSchema(Schema):
    class Meta:
        unknown = "exclude"

    name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    email = fields.Email(required=True)
    organization = fields.String(required=False, allow_none=True, validate=validate.Length(max=255))
    message = fields.String(required=True, validate=validate.Length(min=5, max=4000))


# Response schemas
class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    email = ma.auto_field()
    name = ma.auto_field()
    role = ma.auto_field()
    created_at = ma.auto_field()
    organization_id = ma.Function(lambda obj: obj.organization.id if getattr(obj, "organization", None) else None)
    organization_name = ma.Function(lambda obj: obj.organization.name if getattr(obj, "organization", None) else None)


class OrganizationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Organization
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    name = ma.auto_field()
    contact_email = ma.auto_field()
    description = ma.auto_field()
    owner_id = ma.auto_field()
    created_at = ma.auto_field()


class OpportunitySchema(ma.SQLAlchemySchema):
    class Meta:
        model = Opportunity
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    title = ma.auto_field()
    description = ma.auto_field()
    location = ma.auto_field()
    start_date = ma.auto_field()
    end_date = ma.auto_field()
    org_id = ma.auto_field()
    created_at = ma.auto_field()
    is_active = ma.auto_field()
    organization = ma.Nested("OrganizationSchema", only=("id", "name", "contact_email"), dump_only=True)


class ApplicationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Application
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    user_id = ma.auto_field()
    opportunity_id = ma.auto_field()
    status = ma.auto_field()
    created_at = ma.auto_field()


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
    name = fields.String(required=False, allow_none=True, validate=validate.Length(max=255))
    role = fields.String(
        required=False,
        allow_none=True,
        validate=validate.OneOf(["volunteer", "organization"]),
        load_default="volunteer",
    )
    organization_name = fields.String(required=False, allow_none=True, validate=validate.Length(min=2, max=255))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class ChangeRoleSchema(Schema):
    role = fields.String(required=True, validate=validate.OneOf(["volunteer", "organization", "admin"]))


class UserUpdateSchema(Schema):
    name = fields.String(required=False, allow_none=True, validate=validate.Length(max=255))
    email = fields.Email(required=False, allow_none=True)
    role = fields.String(required=False, allow_none=True, validate=validate.OneOf(["volunteer", "organization", "admin"]))

class PasswordResetRequestSchema(Schema):
    email = fields.Email(required=True)

class PasswordResetSchema(Schema):
    token = fields.String(required=True)
    password = fields.String(required=True)


class OrganizationCreateSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    contact_email = fields.Email(required=False, allow_none=True)
    description = fields.String(required=False, allow_none=True)
    owner_id = fields.Integer(required=False, allow_none=True)
    is_active = fields.Boolean(required=False)


class OpportunityCreateSchema(Schema):
    class Meta:
        unknown = "exclude"

    title = fields.String(required=True, validate=validate.Length(min=3, max=255))
    description = fields.String(required=False, allow_none=True)
    location = fields.String(required=False, allow_none=True, validate=validate.Length(max=255))
    start_date = fields.DateTime(required=False, allow_none=True)
    end_date = fields.DateTime(required=False, allow_none=True)
    org_id = fields.Integer(required=False, allow_none=True)
    category = fields.String(required=False, allow_none=True)
    mode = fields.String(required=False, allow_none=True)
    time_commitment = fields.String(required=False, allow_none=True)
    spots_remaining = fields.Integer(required=False, allow_none=True)

    @validates_schema
    def validate_dates(self, data, **kwargs):
        start = data.get("start_date")
        end = data.get("end_date")
        if start and end and end < start:
            raise ValidationError("end_date must be after start_date", field_name="end_date")

    @pre_load
    def coerce_empty_strings(self, data, **kwargs):
        if not isinstance(data, dict):
            return data
        for key in ("start_date", "end_date", "location", "description", "mode", "category", "time_commitment"):
            if key in data and data[key] == "":
                data[key] = None
        if "org_id" in data and data["org_id"] == "":
            data["org_id"] = None
        return data


class OpportunityUpdateSchema(Schema):
    class Meta:
        unknown = "exclude"

    title = fields.String(required=False, validate=validate.Length(min=3, max=255))
    description = fields.String(required=False, allow_none=True)
    location = fields.String(required=False, allow_none=True, validate=validate.Length(max=255))
    start_date = fields.DateTime(required=False, allow_none=True)
    end_date = fields.DateTime(required=False, allow_none=True)
    org_id = fields.Integer(required=False)
    is_active = fields.Boolean(required=False)
    category = fields.String(required=False, allow_none=True)
    mode = fields.String(required=False, allow_none=True)
    time_commitment = fields.String(required=False, allow_none=True)
    spots_remaining = fields.Integer(required=False, allow_none=True)

    @validates_schema
    def validate_dates(self, data, **kwargs):
        start = data.get("start_date")
        end = data.get("end_date")
        if start and end and end < start:
            raise ValidationError("end_date must be after start_date", field_name="end_date")

    @pre_load
    def coerce_empty_strings(self, data, **kwargs):
        if not isinstance(data, dict):
            return data
        for key in ("start_date", "end_date", "location", "description", "mode", "category", "time_commitment"):
            if key in data and data[key] == "":
                data[key] = None
        if "org_id" in data and data["org_id"] == "":
            data["org_id"] = None
        return data


class ApplicationCreateSchema(Schema):
    opportunity_id = fields.Integer(required=True)


class ApplicationReviewSchema(Schema):
    decision = fields.String(required=True, validate=validate.OneOf(["accept", "reject"]))


class VideoSubmissionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = VideoSubmission
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    user_id = ma.auto_field()
    opportunity_id = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()
    video_url = ma.auto_field()
    status = ma.auto_field()
    created_at = ma.auto_field()


class VideoSubmissionCreateSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=3, max=255))
    description = fields.String(required=False, allow_none=True)
    video_url = fields.Url(required=True, schemes={"http", "https"})
    opportunity_id = fields.Integer(required=False, allow_none=True)


class VideoSubmissionStatusSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(["submitted", "approved", "rejected"]))


class CertificateSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Certificate
        load_instance = True
        include_fk = True

    id = ma.auto_field(dump_only=True)
    volunteer_id = ma.auto_field()
    organization_id = ma.auto_field()
    issued_by_id = ma.auto_field()
    opportunity_id = ma.auto_field()
    hours = ma.auto_field()
    issued_at = ma.auto_field()
    completed_at = ma.auto_field()
    status = ma.auto_field()
    pdf_path = ma.auto_field()
    notes = ma.auto_field()


class CertificateCreateSchema(Schema):
    volunteer_id = fields.Integer(required=False, allow_none=True)
    volunteer_email = fields.Email(required=False, allow_none=True)
    organization_id = fields.Integer(required=True)
    hours = fields.Float(required=True)
    completed_at = fields.Date(required=False, allow_none=True)
    opportunity_id = fields.Integer(required=False, allow_none=True)
    notes = fields.String(required=False, allow_none=True, validate=validate.Length(max=500))

    @validates_schema
    def validate_hours(self, data, **kwargs):
        hours = data.get("hours")
        if hours is not None and hours <= 0:
            raise ValidationError("hours must be greater than zero", field_name="hours")
        if not data.get("volunteer_id") and not data.get("volunteer_email"):
            raise ValidationError("volunteer_id or volunteer_email is required", field_name="volunteer_id")
