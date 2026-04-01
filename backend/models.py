from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
from decimal import Decimal

# ---------------------------------------------------------
# Sub-Documents
# ---------------------------------------------------------
class PortfolioItem(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10, description="Asset ticker symbol")
    quantity: Decimal = Field(..., description="Number of shares/tokens, supports fractional")
    average_entry_price: Decimal = Field(..., description="VWAP or average entry price")
    asset_class: str = Field(default="equity", description="e.g., equity, crypto, option")

# ---------------------------------------------------------
# Main Documents
# ---------------------------------------------------------
class UserProfile(BaseModel):
    """Base model for creating and validating a new user profile."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    # Watchlists are just strings of tickers to query our real-time engine later
    watchlists: List[str] = Field(default_factory=list)
    portfolio: List[PortfolioItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileResponse(UserProfile):
    """Response model that includes the MongoDB generated ID."""
    id: str = Field(..., alias="_id", description="Stringified MongoDB ObjectId")

    class Config:
        # Allows Pydantic to map MongoDB's '_id' to our 'id' field cleanly
        populate_by_name = True