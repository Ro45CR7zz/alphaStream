import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "alphastream_db")

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    """Create database connection."""
    print("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(MONGO_URL)
    print("Connected to MongoDB!")

async def close_mongo_connection():
    """Close database connection."""
    print("Closing MongoDB connection...")
    if db.client:
        db.client.close()
        print("MongoDB connection closed.")

def get_database():
    """Helper function to retrieve the database instance."""
    return db.client[DATABASE_NAME]