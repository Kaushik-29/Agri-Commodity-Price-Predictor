print("Initializing database...")

from app.database import init_db, SessionLocal
from app.init_db import seed_data

def main():
    try:
        # Initialize database tables
        init_db()
        print("Database tables created successfully!")

        # Seed data
        db = SessionLocal()
        try:
            seed_data(db)
            print("Sample data seeded successfully!")
        finally:
            db.close()

    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise

if __name__ == "__main__":
    main() 