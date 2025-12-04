"""add certificates table

Revision ID: f3c1c7de5f1a
Revises: c7f6f326e0c1
Create Date: 2026-01-09 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f3c1c7de5f1a"
down_revision = "c7f6f326e0c1"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "certificates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("volunteer_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column("issued_by_id", sa.Integer(), nullable=False),
        sa.Column("opportunity_id", sa.Integer(), nullable=True),
        sa.Column("hours", sa.Float(), nullable=False),
        sa.Column("issued_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.Column("completed_at", sa.Date(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="issued"),
        sa.Column("pdf_path", sa.String(length=512), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["issued_by_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["opportunity_id"], ["opportunities.id"]),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.ForeignKeyConstraint(["volunteer_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_certificates_volunteer_id", "certificates", ["volunteer_id"])
    op.create_index("ix_certificates_organization_id", "certificates", ["organization_id"])


def downgrade():
    op.drop_index("ix_certificates_organization_id", table_name="certificates")
    op.drop_index("ix_certificates_volunteer_id", table_name="certificates")
    op.drop_table("certificates")
