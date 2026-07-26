from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
from services.auth import get_current_user
from database import get_database

router = APIRouter(
    prefix="/api/v1/chat",
    tags=["AI Copilot"]
)

# 1. Initialize the new Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
        
        # Defensive check in case user_data is somehow None
        watchlist = user_data.get("watchlists", []) if user_data else []
        
        # 3. Construct the System Prompt (The Guardrails)
        system_context = f"""
        You are AlphaStream Copilot, an elite, institutional-grade AI financial assistant.
        The user you are talking to is named '{current_user["username"]}'.
        They currently have the following stock tickers in their portfolio/watchlist: {', '.join(watchlist) if watchlist else 'None yet'}.
        
        STRICT CONSTRAINTS & BEHAVIOR:
        1. DOMAIN RESTRICTION: You must ONLY answer questions related to finance, stocks, macroeconomic trends, quantitative trading, or the user's portfolio. 
        2. OFF-TOPIC REJECTION: If the user asks about ANY other topic (e.g., coding, history, weather, general trivia, personal advice, writing code), you MUST decline gracefully. Reply with exactly: "I am AlphaStream Copilot, specialized strictly in financial markets and portfolio analysis. I cannot assist with off-topic queries."
        3. FORMATTING: Never output massive paragraphs. You MUST use structured, scannable formats. Use bullet points (using standard '-' or '*' characters) and short sentences. 
        4. TONE: Be concise, sharp, and highly analytical. Talk like a Wall Street quant.
        5. ADVICE: Do not give direct financial advice to buy or sell. Present data and probabilities instead.
        """
        
        # 4. Call Gemini using the new SDK with System Instructions
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message, # Only pass the user's actual message here
            config=types.GenerateContentConfig(
                system_instruction=system_context,
                temperature=0.2, # Lower temperature = more analytical, strict adherence to rules
            )
        )
        
        return {"reply": response.text}
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with AI Copilot.")