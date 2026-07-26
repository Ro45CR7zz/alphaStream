from fastapi import APIRouter, Depends, HTTPException
import yfinance as yf
from services.auth import get_current_user

router = APIRouter(
    prefix="/api/v1/market",
    tags=["Market Data"]
)

# Map human-readable sectors to their corresponding industry-standard ETFs
SECTOR_MAP = {
    "Technology": "XLK",
    "Financials": "XLF",
    "Healthcare": "XLV",
    "Energy": "XLE",
    "Industrials": "XLI",
    "Consumer Disc": "XLY",
    "Consumer Staples": "XLP",
    "Utilities": "XLU",
    "Materials": "XLB",
    "Real Estate": "XLRE",
    "Telecom": "XLC"
}

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

@router.get("/sectors")
def get_sector_performance():
    """
    Fetches the 1-day percent change for major market sectors using SPDR ETFs.
    """
    results = []
    tickers_string = " ".join(SECTOR_MAP.values())
    
    try:
        # Fetch data for all sector ETFs at once to optimize speed
        tickers = yf.Tickers(tickers_string)
        
        for name, ticker_symbol in SECTOR_MAP.items():
            ticker_data = tickers.tickers[ticker_symbol]
            info = ticker_data.fast_info
            
            # Calculate daily percentage change using fast_info parameters
            open_price = info.get("open", 0)
            last_price = info.get("last_price", 0)
            
            if open_price > 0:
                pct_change = ((last_price - open_price) / open_price) * 100
            else:
                # Fallback to standard history if fast_info open is missing
                hist = ticker_data.history(period="1d")
                if not hist.empty:
                    pct_change = ((hist['Close'].iloc[-1] - hist['Open'].iloc[-1]) / hist['Open'].iloc[-1]) * 100
                else:
                    pct_change = 0.0
                    
            results.append({
                "name": name,
                "value": round(pct_change, 2)
            })
            
        # Sort so the best performing sectors appear at the top
        results.sort(key=lambda x: x["value"], reverse=True)
        return results

    except Exception as e:
        print(f"Error fetching sector data: {e}")
        # Graceful fallback data if yahoo finance is temporarily down
        return [{"name": k, "value": 0.0} for k in SECTOR_MAP.keys()]