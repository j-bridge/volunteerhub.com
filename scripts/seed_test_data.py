#!/usr/bin/env python3
"""
VolunteerHub Test Data Seed Script

This script populates the development database with seeded test accounts,
organizations, opportunities, and applications for QA and demo purposes.

Usage:
    python scripts/seed_test_data.py

Requirements:
    - Flask app context (configured via environment)
    - Database initialized and migrated
    - Run from project root: app/server/

Environment:
    Set FLASK_ENV=development to use development database.
    Set VOLUNTEER_HUB_SEED=true to enable seeding.
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import create_app, db
from app.models import User, Organization, Opportunity, Application, OrganizationMember

# Initialize Flask app
app = create_app(os.getenv('FLASK_ENV', 'development'))


def seed_test_users():
    """Create test user accounts with different roles."""
    print("\n[SEED] Creating test users...")

    users_data = [
        {
            'email': 'volunteer.test@example.com',
            'password': 'TestPassword123!',
            'first_name': 'Alex',
            'last_name': 'Thompson',
            'user_type': 'volunteer',
            'profile_data': {
                'skills': ['Gardening', 'Event Planning', 'Teaching'],
                'availability': ['Weekends', 'Evenings'],
                'bio': 'Passionate about community service and environmental work.'
            }
        },
        {
            'email': 'volunteer2.test@example.com',
            'password': 'TestPassword123!',
            'first_name': 'Jordan',
            'last_name': 'Martinez',
            'user_type': 'volunteer',
            'profile_data': {
                'skills': ['Web Development', 'Marketing', 'Social Media'],
                'availability': ['Weekdays', 'Evenings'],
                'bio': 'Tech enthusiast and nonprofit advocate.'
            }
        },
        {
            'email': 'orgadmin.test@example.com',
            'password': 'TestPassword123!',
            'first_name': 'Casey',
            'last_name': 'Johnson',
            'user_type': 'org_admin',
            'profile_data': {
                'org_name': 'Green Community Initiative',
                'phone': '555-0100',
                'bio': 'Leading environmental and community projects.'
            }
        },
        {
            'email': 'orgadmin2.test@example.com',
            'password': 'TestPassword123!',
            'first_name': 'Morgan',
            'last_name': 'Williams',
            'user_type': 'org_admin',
            'profile_data': {
                'org_name': 'Youth Education Alliance',
                'phone': '555-0101',
                'bio': 'Empowering youth through education.'
            }
        },
        {
            'email': 'siteadmin.test@example.com',
            'password': 'AdminPassword123!',
            'first_name': 'Admin',
            'last_name': 'User',
            'user_type': 'site_admin',
            'profile_data': {
                'phone': '555-0102',
                'bio': 'Site administration account.'
            }
        },
        {
            'email': 'qa.catalina@example.com',
            'password': 'QAPassword123!',
            'first_name': 'Catalina',
            'last_name': 'QA',
            'user_type': 'qa',
            'profile_data': {
                'phone': '555-0103',
                'bio': 'QA testing and validation account.'
            }
        }
    ]

    created_users = {}
    for user_data in users_data:
        email = user_data['email']
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"  ✓ User {email} already exists (skipping)")
            created_users[email] = existing_user
            continue

        user = User(
            email=email,
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            user_type=user_data['user_type']
        )
        user.set_password(user_data['password'])
        
        # Store profile data as JSON if applicable
        if 'profile_data' in user_data:
            user.profile_data = user_data['profile_data']

        db.session.add(user)
        created_users[email] = user
        print(f"  ✓ Created user: {email} (type: {user_data['user_type']})")

    db.session.commit()
    return created_users


def seed_organizations(users):
    """Create test organizations and assign members."""
    print("\n[SEED] Creating test organizations...")

    orgs_data = [
        {
            'name': 'Green Community Initiative',
            'description': 'Environmental conservation and community gardening programs.',
            'email': 'info@greencommunity.org',
            'phone': '555-0200',
            'admin_email': 'orgadmin.test@example.com',
            'members': [
                {'email': 'orgadmin.test@example.com', 'role': 'admin'},
                {'email': 'volunteer.test@example.com', 'role': 'member'}
            ]
        },
        {
            'name': 'Youth Education Alliance',
            'description': 'Providing educational support and mentoring to underserved youth.',
            'email': 'info@youthalliancedu.org',
            'phone': '555-0201',
            'admin_email': 'orgadmin2.test@example.com',
            'members': [
                {'email': 'orgadmin2.test@example.com', 'role': 'admin'},
                {'email': 'volunteer2.test@example.com', 'role': 'member'}
            ]
        },
        {
            'name': 'Local Food Bank',
            'description': 'Fighting food insecurity and promoting nutrition awareness.',
            'email': 'info@localfoodbank.org',
            'phone': '555-0202',
            'admin_email': 'orgadmin.test@example.com',
            'members': [
                {'email': 'orgadmin.test@example.com', 'role': 'admin'}
            ]
        }
    ]

    created_orgs = {}
    for org_data in orgs_data:
        org_name = org_data['name']
        
        # Check if org already exists
        existing_org = Organization.query.filter_by(name=org_name).first()
        if existing_org:
            print(f"  ✓ Organization {org_name} already exists (skipping)")
            created_orgs[org_name] = existing_org
            continue

        org = Organization(
            name=org_name,
            description=org_data['description'],
            email=org_data['email'],
            phone=org_data['phone']
        )
        db.session.add(org)
        db.session.flush()  # Get org ID for relationships

        # Add members
        for member in org_data['members']:
            user = users.get(member['email'])
            if user:
                org_member = OrganizationMember(
                    organization_id=org.id,
                    user_id=user.id,
                    role=member['role']
                )
                db.session.add(org_member)
                print(f"  ✓ Added {member['email']} to {org_name} as {member['role']}")

        created_orgs[org_name] = org
        print(f"  ✓ Created organization: {org_name}")

    db.session.commit()
    return created_orgs


def seed_opportunities(organizations):
    """Create test opportunities with various statuses."""
    print("\n[SEED] Creating test opportunities...")

    today = datetime.utcnow().date()

    opportunities_data = [
        {
            'title': 'Community Garden Workday',
            'description': 'Help us maintain and expand our community garden. All skill levels welcome!',
            'organization_name': 'Green Community Initiative',
            'location': 'Central Park Community Garden, Springfield',
            'date': today + timedelta(days=21),
            'time': '09:00 AM',
            'capacity': 5,
            'required_skills': ['Gardening', 'Physical Fitness'],
            'tags': ['Environment', 'Outdoor'],
            'deadline': today + timedelta(days=20),
            'status': 'published'
        },
        {
            'title': 'After-School Tutoring Program',
            'description': 'Mentor middle school students in Math and Science. Flexible schedule.',
            'organization_name': 'Youth Education Alliance',
            'location': 'Lincoln Middle School, Springfield',
            'date': today + timedelta(days=7),
            'time': '03:30 PM',
            'capacity': 8,
            'required_skills': ['Teaching', 'Patience', 'Math'],
            'tags': ['Education', 'Youth'],
            'deadline': today + timedelta(days=5),
            'status': 'published'
        },
        {
            'title': 'Weekend Food Distribution',
            'description': 'Sort and distribute food packages to community members in need.',
            'organization_name': 'Local Food Bank',
            'location': 'Food Bank Warehouse, Springfield',
            'date': today + timedelta(days=3),
            'time': '10:00 AM',
            'capacity': 3,
            'required_skills': [],
            'tags': ['Food Security', 'Community'],
            'deadline': today + timedelta(days=1),
            'status': 'published'
        },
        {
            'title': 'Environmental Cleanup Drive',
            'description': 'Join us for a river cleanup event. Bring gloves and bags.',
            'organization_name': 'Green Community Initiative',
            'location': 'Springfield River Park',
            'date': today - timedelta(days=5),  # Past event (closed)
            'time': '08:00 AM',
            'capacity': 20,
            'required_skills': [],
            'tags': ['Environment', 'Cleanup'],
            'deadline': today - timedelta(days=10),
            'status': 'closed'
        },
        {
            'title': 'Full Capacity Opportunity',
            'description': 'This opportunity is at full capacity to test validation.',
            'organization_name': 'Youth Education Alliance',
            'location': 'Community Center',
            'date': today + timedelta(days=15),
            'time': '06:00 PM',
            'capacity': 2,
            'required_skills': [],
            'tags': ['Testing'],
            'deadline': today + timedelta(days=14),
            'status': 'published'
        },
        {
            'title': 'Draft Opportunity (Not Published)',
            'description': 'This is a draft opportunity and should not appear in public listings.',
            'organization_name': 'Green Community Initiative',
            'location': 'Future Location TBD',
            'date': today + timedelta(days=30),
            'time': '10:00 AM',
            'capacity': 10,
            'required_skills': [],
            'tags': ['Future'],
            'deadline': today + timedelta(days=29),
            'status': 'draft'
        }
    ]

    created_opportunities = {}
    for opp_data in opportunities_data:
        org = organizations.get(opp_data['organization_name'])
        if not org:
            print(f"  ✗ Organization {opp_data['organization_name']} not found")
            continue

        opp_key = opp_data['title']
        
        # Check if opportunity already exists
        existing_opp = Opportunity.query.filter_by(
            title=opp_data['title'],
            organization_id=org.id
        ).first()
        if existing_opp:
            print(f"  ✓ Opportunity {opp_key} already exists (skipping)")
            created_opportunities[opp_key] = existing_opp
            continue

        opp = Opportunity(
            title=opp_data['title'],
            description=opp_data['description'],
            organization_id=org.id,
            location=opp_data['location'],
            date=opp_data['date'],
            time=opp_data['time'],
            capacity=opp_data['capacity'],
            required_skills=opp_data['required_skills'],
            tags=opp_data['tags'],
            application_deadline=opp_data['deadline'],
            status=opp_data['status']
        )
        db.session.add(opp)
        created_opportunities[opp_key] = opp
        print(f"  ✓ Created opportunity: {opp_key} ({opp_data['status']})")

    db.session.commit()
    return created_opportunities


def seed_applications(users, opportunities):
    """Create test applications with various statuses."""
    print("\n[SEED] Creating test applications...")

    applications_data = [
        {
            'volunteer_email': 'volunteer.test@example.com',
            'opportunity_title': 'Community Garden Workday',
            'message': 'I have 2 years of gardening experience and would love to help!',
            'status': 'pending',
            'file_path': None
        },
        {
            'volunteer_email': 'volunteer2.test@example.com',
            'opportunity_title': 'After-School Tutoring Program',
            'message': 'I am a software engineer with experience mentoring students.',
            'status': 'pending',
            'file_path': None
        },
        {
            'volunteer_email': 'volunteer.test@example.com',
            'opportunity_title': 'Weekend Food Distribution',
            'message': 'Happy to help out with food distribution!',
            'status': 'accepted',
            'file_path': None
        },
        {
            'volunteer_email': 'volunteer2.test@example.com',
            'opportunity_title': 'Community Garden Workday',
            'message': 'I am interested in learning about gardening.',
            'status': 'rejected',
            'file_path': None
        }
    ]

    created_applications = []
    for app_data in applications_data:
        volunteer = users.get(app_data['volunteer_email'])
        opportunity = opportunities.get(app_data['opportunity_title'])

        if not volunteer or not opportunity:
            print(f"  ✗ Volunteer or opportunity not found for {app_data['opportunity_title']}")
            continue

        # Check if application already exists
        existing_app = Application.query.filter_by(
            user_id=volunteer.id,
            opportunity_id=opportunity.id
        ).first()
        if existing_app:
            print(f"  ✓ Application for {app_data['volunteer_email']} to {app_data['opportunity_title']} already exists (skipping)")
            created_applications.append(existing_app)
            continue

        app = Application(
            user_id=volunteer.id,
            opportunity_id=opportunity.id,
            message=app_data['message'],
            status=app_data['status'],
            file_path=app_data['file_path'],
            applied_at=datetime.utcnow()
        )
        db.session.add(app)
        created_applications.append(app)
        print(f"  ✓ Created application: {app_data['volunteer_email']} → {app_data['opportunity_title']} ({app_data['status']})")

    db.session.commit()
    return created_applications


def print_summary(users, organizations, opportunities, applications):
    """Print a summary of seeded data."""
    print("\n" + "="*60)
    print("SEEDING SUMMARY")
    print("="*60)
    print(f"✓ Users created/verified: {len(users)}")
    print(f"✓ Organizations created/verified: {len(organizations)}")
    print(f"✓ Opportunities created/verified: {len(opportunities)}")
    print(f"✓ Applications created/verified: {len(applications)}")
    print("\n" + "-"*60)
    print("TEST ACCOUNT CREDENTIALS (use for testing)")
    print("-"*60)
    print("\n**Volunteer Account:**")
    print("  Email: volunteer.test@example.com")
    print("  Password: TestPassword123!")
    print("\n**Organization Admin Account:**")
    print("  Email: orgadmin.test@example.com")
    print("  Password: TestPassword123!")
    print("\n**Site Admin Account:**")
    print("  Email: siteadmin.test@example.com")
    print("  Password: AdminPassword123!")
    print("\n**QA Account:**")
    print("  Email: qa.catalina@example.com")
    print("  Password: QAPassword123!")
    print("\n" + "-"*60)
    print("SEEDING COMPLETE")
    print("="*60 + "\n")


def main():
    """Execute the seeding process."""
    print("\n🌱 VolunteerHub Test Data Seeding Script")
    print("="*60)

    with app.app_context():
        try:
            print("\n[INFO] Starting seeding process...")
            print(f"[INFO] Environment: {os.getenv('FLASK_ENV', 'development')}")
            print(f"[INFO] Database: {app.config.get('SQLALCHEMY_DATABASE_URI')}")

            # Run seeding functions in order
            users = seed_test_users()
            organizations = seed_organizations(users)
            opportunities = seed_opportunities(organizations)
            applications = seed_applications(users, opportunities)

            # Print summary
            print_summary(users, organizations, opportunities, applications)

            print("\n✅ Seeding successful! You can now use the test accounts to explore the platform.")
            return 0

        except Exception as e:
            print(f"\n❌ Seeding failed with error: {e}")
            import traceback
            traceback.print_exc()
            return 1


if __name__ == '__main__':
    sys.exit(main())
