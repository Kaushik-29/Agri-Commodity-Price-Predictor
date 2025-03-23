from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "qwerty")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "agri_price_db")

# MySQL connection URL
SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# Create MySQL engine with specific configuration
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=5,  # Number of connections to maintain
    max_overflow=10,  # Maximum number of connections to allow
    pool_timeout=30,  # Timeout in seconds
    pool_recycle=1800,  # Recycle connections after 30 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
def init_db():
    Base.metadata.create_all(bind=engine) 