"""Updated employee_id nullable constraint

Revision ID: 1d557e48df2e
Revises: 
Create Date: 2024-07-16 13:50:39.702371

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d557e48df2e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Change the nullable constraint on the employee_id column
    op.alter_column('leave', 'employee_id', existing_type=sa.Integer, nullable=True)

def downgrade():
    # Revert the nullable constraint on the employee_id column
    op.alter_column('leave', 'employee_id', existing_type=sa.Integer, nullable=False)