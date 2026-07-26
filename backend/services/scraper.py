import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timezone
import asyncio
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel

# --- GLOBAL MODEL INITIALIZATION ---
# Load this once when the server starts to save time and memory.
# It will load the base model from Hugging Face and attach your local LoRA adapter.

BASE_MODEL_NAME = "ProsusAI/finbert"
LORA_ADAPTER_PATH = os.path.join(os.path.dirname(__file__), "..", "finbert-alpha-stream-lora")

print("Initializing Proprietary AlphaStream FinBERT Model...")
try:
    # 1. Load the Tokenizer
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
    
    # 2. Load the Base Model
    base_model = AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL_NAME, 
        num_labels=3
    )
    
    # 3. Attach your custom LoRA adapter
    # If the folder exists, we load your custom AI. If not, we fall back to base FinBERT.
    if os.path.exists(LORA_ADAPTER_PATH):
        print(f"Loading custom LoRA weights from: {LORA_ADAPTER_PATH}")
        finbert_model = PeftModel.from_pretrained(base_model, LORA_ADAPTER_PATH)
    else:
        print("WARNING: Custom LoRA weights not found. Falling back to base FinBERT.")
        finbert_model = base_model
        
    finbert_model.eval() # Set to evaluation mode
    print("AI Model loaded successfully.")
    
except Exception as e:
    print(f"Error loading AI Model: {e}")
    finbert_model = None
    tokenizer = None


def get_sentiment_score(text: str) -> float:
    """
    Runs the text through the FinBERT model to get a sentiment score.
    Returns a score between -1.0 (Negative) and 1.0 (Positive).
    """
    if finbert_model is None or tokenizer is None:
        return 0.0 # Fallback if model failed to load

    try:
        # 1. Tokenize the input text
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
        
        # 2. Run inference without calculating gradients (saves memory)
        with torch.no_grad():
            outputs = finbert_model(**inputs)
            
        # 3. Get the probabilities using Softmax
        # FinBERT labels: [0: Positive, 1: Negative, 2: Neutral]
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]
        
        # 4. Map probabilities to a -1 to +1 scale for the UI
        # We subtract Negative probability from Positive probability
        positive_prob = probabilities[0].item()
        negative_prob = probabilities[1].item()
        
        # Compound score: If mostly positive, it approaches 1.0. If mostly negative, -1.0.
        compound_score = positive_prob - negative_prob
        return round(compound_score, 4)

    except Exception as e:
        print(f"Inference error on text '{text}': {e}")
        return 0.0


async def fetch_rss(url: str, source_name: str, client: httpx.AsyncClient):
    """Helper function to fetch and parse a single RSS feed."""
    try:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "xml")
        items = soup.find_all("item")
        
        results = []
        for item in items[:3]:
            headline = item.title.text if item.title else ""
            pub_date = item.pubDate.text if item.pubDate else datetime.now(timezone.utc).isoformat()
            
            results.append({
                "headline": f"[{source_name}] {headline}", 
                "raw_headline": headline,
                "published_at": pub_date
            })
        return results
    except Exception as e:
        print(f"Error fetching from {source_name}: {e}")
        return []


async def scrape_and_analyze_news(tickers: list[str] = None):
    """Fetches news and runs custom FinBERT NLP Sentiment Analysis."""
    
    if not tickers:
        yahoo_query = "SPY,QQQ"
        google_query = "SPY stock OR QQQ stock"
    else:
        yahoo_query = ",".join(tickers)
        google_query = " OR ".join([f"{t} stock" for t in tickers])

    endpoints = [
        (f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={yahoo_query}", "Yahoo Finance"),
        (f"https://news.google.com/rss/search?q={google_query}&hl=en-US&gl=US&ceid=US:en", "Google News")
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    async with httpx.AsyncClient(headers=headers) as client:
        tasks = [fetch_rss(url, source, client) for url, source in endpoints]
        nested_results = await asyncio.gather(*tasks)
        
    all_news = [news for sublist in nested_results for news in sublist]
    
    # Analyze the sentiment using your custom AI
    analyzed_data = []
    for news in all_news:
        score = get_sentiment_score(news["raw_headline"])
        
        analyzed_data.append({
            "headline": news["headline"],
            "sentiment_score": score,
            "published_at": news["published_at"]
        })
        
    return analyzed_data





















#FINBERT MODEL

# import httpx
# from bs4 import BeautifulSoup
# from transformers import pipeline
# from datetime import datetime, timezone
# import asyncio

# # 1. Initialize FinBERT
# # Note: On the very first run, this will download the ~400MB model to your local machine.
# print("Loading FinBERT Model...")
# finbert = pipeline("sentiment-analysis", model="ProsusAI/finbert")
# print("FinBERT Loaded Successfully.")

# async def fetch_rss(url: str, source_name: str, client: httpx.AsyncClient):
#     """Helper function to fetch and parse a single RSS feed."""
#     try:
#         response = await client.get(url, timeout=10.0)
#         response.raise_for_status()
        
#         soup = BeautifulSoup(response.text, "xml")
#         items = soup.find_all("item")
        
#         results = []
#         for item in items[:3]:
#             headline = item.title.text if item.title else ""
#             pub_date = item.pubDate.text if item.pubDate else datetime.now(timezone.utc).isoformat()
            
#             results.append({
#                 "headline": f"[{source_name}] {headline}", 
#                 "raw_headline": headline,
#                 "published_at": pub_date
#             })
#         return results
#     except Exception as e:
#         print(f"Error fetching from {source_name}: {e}")
#         return []

# async def scrape_and_analyze_news(tickers: list[str] = None):
#     """Fetches news and runs FinBERT NLP Sentiment Analysis."""
    
#     if not tickers:
#         yahoo_query = "SPY,QQQ"
#         google_query = "SPY stock OR QQQ stock"
#     else:
#         yahoo_query = ",".join(tickers)
#         google_query = " OR ".join([f"{t} stock" for t in tickers])

#     endpoints = [
#         (f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={yahoo_query}", "Yahoo Finance"),
#         (f"https://news.google.com/rss/search?q={google_query}&hl=en-US&gl=US&ceid=US:en", "Google News")
#     ]
    
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
#     }
    
#     async with httpx.AsyncClient(headers=headers) as client:
#         tasks = [fetch_rss(url, source, client) for url, source in endpoints]
#         nested_results = await asyncio.gather(*tasks)
        
#     all_news = [news for sublist in nested_results for news in sublist]
    
#     # 2. Run the FinBERT Analysis
#     analyzed_data = []
#     for news in all_news:
#         try:
#             # FinBERT returns a list like: [{'label': 'positive', 'score': 0.89}]
#             result = finbert(news["raw_headline"])[0]
#             label = result["label"]
#             confidence = result["score"]

#             # Map FinBERT's output to the standard -1.0 to 1.0 compound score for our UI
#             if label == "positive":
#                 compound_score = confidence
#             elif label == "negative":
#                 compound_score = -confidence
#             else:
#                 compound_score = 0.0

#             analyzed_data.append({
#                 "headline": news["headline"],
#                 "sentiment_score": round(compound_score, 4),
#                 "published_at": news["published_at"]
#             })
#         except Exception as e:
#             print(f"FinBERT Error on headline '{news['raw_headline']}': {e}")
#             # Fallback to neutral if the model fails on a specific string
#             analyzed_data.append({
#                 "headline": news["headline"],
#                 "sentiment_score": 0.0,
#                 "published_at": news["published_at"]
#             })
        
#     return analyzed_data






#using vader sentiment analysis- lightweight as compared to finBERT model:

# import httpx
# from bs4 import BeautifulSoup
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# from datetime import datetime, timezone
# import asyncio

# analyzer = SentimentIntensityAnalyzer()

# async def fetch_rss(url: str, source_name: str, client: httpx.AsyncClient):
#     """Helper function to fetch and parse a single RSS feed."""
#     try:
#         # We add a timeout so one slow website doesn't crash the whole stream
#         response = await client.get(url, timeout=10.0)
#         response.raise_for_status()
        
#         soup = BeautifulSoup(response.text, "xml")
#         items = soup.find_all("item")
        
#         results = []
#         # Grab the top 3 headlines from this specific source
#         for item in items[:3]:
#             headline = item.title.text if item.title else ""
#             pub_date = item.pubDate.text if item.pubDate else datetime.now(timezone.utc).isoformat()
            
#             results.append({
#                 # We prepend the source name so it looks cool on the UI!
#                 "headline": f"[{source_name}] {headline}", 
#                 "raw_headline": headline,
#                 "published_at": pub_date
#             })
#         return results
#     except Exception as e:
#         print(f"Error fetching from {source_name}: {e}")
#         return []

# async def scrape_and_analyze_news(tickers: list[str] = None):
#     """Fetches news from multiple sources concurrently and runs sentiment analysis."""
    
#     # 1. Format the search queries for different search engines
#     if not tickers:
#         yahoo_query = "SPY,QQQ"
#         google_query = "SPY stock OR QQQ stock"
#     else:
#         yahoo_query = ",".join(tickers)
#         google_query = " OR ".join([f"{t} stock" for t in tickers])

#     # 2. Define our target websites
#     endpoints = [
#         (f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={yahoo_query}", "Yahoo Finance"),
#         (f"https://news.google.com/rss/search?q={google_query}&hl=en-US&gl=US&ceid=US:en", "Google News")
#     ]
    
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     }
    
#     async with httpx.AsyncClient(headers=headers) as client:
#         # 3. CONCURRENCY: Launch all web requests at the exact same time
#         tasks = [fetch_rss(url, source, client) for url, source in endpoints]
        
#         # Wait for all of them to finish
#         nested_results = await asyncio.gather(*tasks)
        
#     # 4. Flatten the results (combine the lists from Yahoo and Google)
#     all_news = [news for sublist in nested_results for news in sublist]
    
#     # 5. Run the NLP Sentiment Analysis
#     analyzed_data = []
#     for news in all_news:
#         sentiment = analyzer.polarity_scores(news["raw_headline"])
#         analyzed_data.append({
#             "headline": news["headline"],
#             "sentiment_score": sentiment["compound"],
#             "published_at": news["published_at"]
#         })
        
#     return analyzed_data