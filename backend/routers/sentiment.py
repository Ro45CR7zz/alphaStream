from fastapi import APIRouter, Depends
from services.auth import get_current_user
from database import get_database

router = APIRouter(
    prefix="/api/v1/sentiment",
    tags=["Sentiment Engine"]
)

@router.get("/history")
async def get_sentiment_history(current_user: dict = Depends(get_current_user)):
    """
    Securely fetches the historical ML sentiment ledger from MongoDB Atlas.
    """
    db = get_database()
    
    # Query the collection, hide the internal MongoDB _id, sort by newest, limit to 50
    cursor = db["sentiment_history"].find({}, {"_id": 0}).sort("scraped_at", -1).limit(50)
    history = await cursor.to_list(length=50)
    
    return {"data": history}