from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import asyncio
import json
from datetime import datetime, timezone
from jose import jwt, JWTError

from services.scraper import scrape_and_analyze_news
from services.auth import SECRET_KEY, ALGORITHM
from database import get_database

router = APIRouter(
    prefix="/api/v1/streams",
    tags=["Real-Time Streams"]
)

async def get_ws_user(token: str):
    """Helper function to decode the JWT inside a WebSocket connection."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        
        db = get_database()
        user = await db["users"].find_one({"username": username})
        return user
    except JWTError:
        return None

# Notice we changed the path to remove the hardcoded {client_id}
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(None)):
    await websocket.accept()
    
    user = await get_ws_user(token)
    if not user:
        print("Unauthorized WebSocket connection attempt. Closing.")
        await websocket.close(code=1008)
        return

    print(f"User {user['username']} connected to secure stream.")
    
    try:
        while True:
            db = get_database()
            fresh_user_data = await db["users"].find_one({"username": user["username"]})
            user_watchlist = fresh_user_data.get("watchlists", [])
            
            analyzed_news = await scrape_and_analyze_news(user_watchlist)
            
            # --- NEW: Save the scraped data to the historical ledger ---
            if analyzed_news:
                for news in analyzed_news:
                    # upsert=True prevents us from saving the exact same headline twice
                    await db["sentiment_history"].update_one(
                        {"headline": news["headline"]},
                        {"$set": {
                            "headline": news["headline"],
                            "sentiment_score": news["sentiment_score"],
                            "published_at": news["published_at"],
                            "scraped_at": datetime.now(timezone.utc).isoformat()
                        }},
                        upsert=True
                    )
            # -----------------------------------------------------------
            
            payload = {
                "type": "SENTIMENT_TICK",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": analyzed_news
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(15) 
            
    except WebSocketDisconnect:
        print(f"User {user['username']} disconnected.")