from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from routers import portfolio, streams, auth_router, sentiment, market, chat

from database import connect_to_mongo, close_mongo_connection, get_database
from routers import portfolio, streams, auth_router

# ---------------------------------------------------------
# Lifespan Events (Startup & Shutdown)
# ---------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await connect_to_mongo()
    
    # We removed the global market_data_worker here because 
    # streams are now initialized per-user upon WebSocket connection!
    
    yield
    # Shutdown logic
    await close_mongo_connection()

# Initialize the FastAPI application
app = FastAPI(
    title="AlphaStream API",
    description="Backend services for the AlphaStream alternative data terminal.",
    version="1.0.0",
    lifespan=lifespan
)

# ---------------------------------------------------------
# Security & Middleware
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------
app.include_router(portfolio.router)
app.include_router(streams.router)
app.include_router(auth_router.router)
app.include_router(sentiment.router)
app.include_router(market.router)
app.include_router(chat.router)

@app.get("/")
async def health_check():
    """Root endpoint to verify the API is running."""
    # Quick DB ping test
    db = get_database()
    return {
        "status": "online", 
        "database": db.name,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/v1/market/status")
async def get_market_status():
    return {
        "market_state": "OPEN",
        "system_latency_ms": 12,
        "active_data_streams": ["options_flow", "news_sentiment"]
    }