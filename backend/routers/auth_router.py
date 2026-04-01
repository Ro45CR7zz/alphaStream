from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
from services.auth import verify_password, create_access_token, get_password_hash
from database import get_database

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

# --- 1. The Pydantic Schema for Registration ---
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, description="Minimum 6 characters")

# --- 2. The Registration Endpoint ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Creates a new user, hashes their password, stores them in MongoDB Atlas,
    and returns a JWT so the frontend can auto-login the user immediately.
    """
    db = get_database()
    collection = db["users"]
    
    # Check if the username or email is already taken
    existing_user = await collection.find_one({
        "$or": [{"username": user_data.username}, {"email": user_data.email}]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is already registered."
        )
        
    # Hash the password (NEVER store plaintext!)
    hashed_password = get_password_hash(user_data.password)
    
    # Create the new user document matching our Phase 1 schema
    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "watchlists": [],  # Empty arrays ready for Phase 3
        "portfolio": [],
        "created_at": datetime.now(timezone.utc)
    }
    
    await collection.insert_one(new_user)
    
    # Auto-Login: Mint the token immediately
    access_token = create_access_token(data={"sub": user_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- 3. The Existing Login Endpoint ---
@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Standard OAuth2 endpoint. 
    Accepts a username and password, returns a signed JWT.
    """
    
    # 1. THE MOCK BYPASS (Moved to the top!)
    # If we type admin/admin, give the token immediately without touching the DB.
    if form_data.username == "admin" and form_data.password == "admin":
        access_token = create_access_token(data={"sub": "admin"})
        return {"access_token": access_token, "token_type": "bearer"}

    # 2. The Real DB Logic 
    try:
        db = get_database()
        user = await db["users"].find_one({"username": form_data.username})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if not verify_password(form_data.password, user["hashed_password"]):
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

        access_token = create_access_token(data={"sub": user["username"]})
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        # If MongoDB is down, gracefully return a 500 error instead of crashing the server
        print(f"Database error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection is currently offline."
        )