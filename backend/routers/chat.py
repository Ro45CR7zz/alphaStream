from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from services.auth import get_current_user
from database import get_database

router = APIRouter(
    prefix="/api/v1/chat",
    tags=["AI Copilot"]
)

# 1. Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using the fast and cost-effective 1.5 Flash model
model = genai.GenerativeModel('gemini-2.5-flash')

class ChatRequest(BaseModel):
    message: str

@router.post("/ask")
async def ask_copilot(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    """
    Takes a user query, injects their MongoDB portfolio context, and streams a response from Gemini.
    """
    try:
        # 2. Fetch the user's contextual data from MongoDB
        db = get_database()
        user_data = await db["users"].find_one({"username": current_user["username"]})
        watchlist = user_data.get("watchlists", [])
        
        # 3. Construct the System Prompt (The Secret Sauce)
        system_context = f"""
        You are AlphaStream Copilot, an elite, institutional-grade AI financial assistant.
        The user you are talking to is named '{current_user["username"]}'.
        They currently have the following stock tickers in their portfolio/watchlist: {', '.join(watchlist) if watchlist else 'None yet'}.
        
        Rules:
        1. Be concise, sharp, and highly analytical. Talk like a Wall Street quant.
        2. If they ask about the market, specifically reference the stocks in their watchlist if relevant.
        3. Do not give direct financial advice to buy or sell.
        4. Use markdown formatting for readability.
        """
        
        # 4. Combine context with the user's actual question
        full_prompt = f"{system_context}\n\nUser Question: {request.message}"
        
        # 5. Call Gemini
        response = model.generate_content(full_prompt)
        
        return {"reply": response.text}
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with AI Copilot.")