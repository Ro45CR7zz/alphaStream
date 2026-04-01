from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from database import get_database

# Security Configurations (In production, these come from your .env file)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "a_very_secret_hft_alpha_key_do_not_use_in_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# bcrypt is the industry standard for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Checks if a plain password matches the database hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Generates a secure hash for a new user."""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Mints a new JWT with an expiration payload."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# This tells FastAPI where the frontend gets its token from
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency that extracts the JWT from the Authorization header,
    decodes it, and returns the full user document from MongoDB Atlas.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Fetch the user from Atlas
    db = get_database()
    user = await db["users"].find_one({"username": username})
    
    if user is None:
        raise credentials_exception
        
    # Convert MongoDB's ObjectId to string so it can be serialized to JSON safely
    user["_id"] = str(user["_id"])
    return user