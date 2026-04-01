from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from services.auth import get_current_user
from database import get_database

router = APIRouter(
    prefix="/api/v1/portfolio",
    tags=["Portfolio"]
)

# Schema for adding a new ticker
class TickerAdd(BaseModel):
    ticker: str

@router.get("/watchlist")
async def get_watchlist(current_user: dict = Depends(get_current_user)):
    """Securely fetches the logged-in user's saved tickers."""
    # current_user is automatically populated by our JWT guard!
    return {"watchlists": current_user.get("watchlists", [])}

@router.post("/watchlist")
async def add_to_watchlist(item: TickerAdd, current_user: dict = Depends(get_current_user)):
    """Adds a new ticker to the user's watchlist in MongoDB Atlas."""
    db = get_database()
    collection = db["users"]
    
    ticker_upper = item.ticker.upper()
    
    # Check if the ticker is already in their list to prevent duplicates
    if ticker_upper in current_user.get("watchlists", []):
        raise HTTPException(status_code=400, detail="Ticker already in watchlist")
        
    # Atomically push the new ticker to the user's array in MongoDB
    await collection.update_one(
        {"username": current_user["username"]},
        {"$push": {"watchlists": ticker_upper}}
    )
    
    return {"message": f"Successfully added {ticker_upper}", "ticker": ticker_upper}