from fastapi import APIRouter, Depends, HTTPException
import yfinance as yf
from services.auth import get_current_user

router = APIRouter(
    prefix="/api/v1/market",
    tags=["Market Data"]
)

@router.get("/history/{ticker}")
async def get_candlestick_data(ticker: str, current_user: dict = Depends(get_current_user)):
    """
    Fetches 3 months of daily OHLC (Open, High, Low, Close) data for the TradingView chart.
    """
    try:
        # Fetch data using yfinance
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo", interval="1d")

        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {ticker}")

        # Format the pandas dataframe into a JSON array that lightweight-charts expects
        chart_data = []
        for index, row in hist.iterrows():
            chart_data.append({
                "time": index.strftime("%Y-%m-%d"), # Must be string YYYY-MM-DD
                "open": round(row["Open"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "close": round(row["Close"], 2),
            })
            
        return {"data": chart_data}
        
    except Exception as e:
        print(f"YFinance Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch market data")