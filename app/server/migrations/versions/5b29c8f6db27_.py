"""merge duplicate base

Revision ID: 5b29c8f6db27
Revises: 203677155771
Create Date: 2025-11-12 14:30:42.912590

This migration exists only to merge the duplicate base revision that was
accidentally created, keeping a single head for Flask-Migrate.
"""
from alembic import op  # noqa: F401  (kept for Alembic context)
import sqlalchemy as sa  # noqa: F401


# revision identifiers, used by Alembic.
revision = '5b29c8f6db27'
down_revision = '203677155771'
branch_labels = None
depends_on = None


def upgrade():
    # No-op: this revision only merges the duplicate base.
    pass


def downgrade():
    pass
