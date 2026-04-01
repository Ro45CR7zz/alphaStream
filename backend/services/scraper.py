import httpx
from bs4 import BeautifulSoup
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timezone
import asyncio

analyzer = SentimentIntensityAnalyzer()

async def fetch_rss(url: str, source_name: str, client: httpx.AsyncClient):
    """Helper function to fetch and parse a single RSS feed."""
    try:
        # We add a timeout so one slow website doesn't crash the whole stream
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "xml")
        items = soup.find_all("item")
        
        results = []
        # Grab the top 3 headlines from this specific source
        for item in items[:3]:
            headline = item.title.text if item.title else ""
            pub_date = item.pubDate.text if item.pubDate else datetime.now(timezone.utc).isoformat()
            
            results.append({
                # We prepend the source name so it looks cool on the UI!
                "headline": f"[{source_name}] {headline}", 
                "raw_headline": headline,
                "published_at": pub_date
            })
        return results
    except Exception as e:
        print(f"Error fetching from {source_name}: {e}")
        return []

async def scrape_and_analyze_news(tickers: list[str] = None):
    """Fetches news from multiple sources concurrently and runs sentiment analysis."""
    
    # 1. Format the search queries for different search engines
    if not tickers:
        yahoo_query = "SPY,QQQ"
        google_query = "SPY stock OR QQQ stock"
    else:
        yahoo_query = ",".join(tickers)
        google_query = " OR ".join([f"{t} stock" for t in tickers])

    # 2. Define our target websites
    endpoints = [
        (f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={yahoo_query}", "Yahoo Finance"),
        (f"https://news.google.com/rss/search?q={google_query}&hl=en-US&gl=US&ceid=US:en", "Google News")
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    async with httpx.AsyncClient(headers=headers) as client:
        # 3. CONCURRENCY: Launch all web requests at the exact same time
        tasks = [fetch_rss(url, source, client) for url, source in endpoints]
        
        # Wait for all of them to finish
        nested_results = await asyncio.gather(*tasks)
        
    # 4. Flatten the results (combine the lists from Yahoo and Google)
    all_news = [news for sublist in nested_results for news in sublist]
    
    # 5. Run the NLP Sentiment Analysis
    analyzed_data = []
    for news in all_news:
        sentiment = analyzer.polarity_scores(news["raw_headline"])
        analyzed_data.append({
            "headline": news["headline"],
            "sentiment_score": sentiment["compound"],
            "published_at": news["published_at"]
        })
        
    return analyzed_data