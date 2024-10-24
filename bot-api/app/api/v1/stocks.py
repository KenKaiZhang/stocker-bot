import datetime
from fastapi import APIRouter, HTTPException

from app.core.databases.mongodb import mongo_db as mdb
from app.services.yfiance import Yfinance
from app.models.stocks import TickerRequest

router = APIRouter(prefix="/stocks", tags=["stocks"])

def get_favorite_tickers(guild:str):
    query = {"guild": guild}
    tickers_collection = mdb.get_collection("favorites")
    guild_favorites = tickers_collection.find_one(query)
    
    if guild_favorites is not None:
        return guild_favorites["tickers"] or []

    return []


def update_favorite_tickers(guild, tickers):
    query = {"guild": guild}
    tickers_collection = mdb.get_collection("favorites")
    update = {
        "$set": {
            "guild": guild,
            "tickers": tickers,
            "updatedAt": datetime.datetime.now(datetime.UTC)
        },
        "$setOnInsert": {
            "createdAt": datetime.datetime.now(datetime.UTC)
        }
    }
    tickers_collection.update_one(query, update, upsert=True)


@router.get("/{ticker}")
def get_ticker_price(ticker:str):
    yf = Yfinance([ticker])
    return yf.get_price(ticker)


@router.post("/tickers")
def get_multiple_ticker_info(body:TickerRequest):
    tickers = body.tickers
    yf = Yfinance(tickers)
    return [yf.get_price(ticker) for ticker in tickers]


@router.get("/tickers/favorites/{guild}")
def get_favorite_tickers_info(guild:str):
    tickers = get_favorite_tickers(guild)
    yf = Yfinance(tickers)

    results = []
    for ticker in tickers:
        ticker_price = yf.get_price(ticker)
        
        if ticker_price is not None:
            results.append(ticker_price)
    
    return results


@router.post("/tickers/favorites/{guild}")
def add_new_favorite_tickers(guild:str, body:TickerRequest):
    try:
        yf = Yfinance(body.tickers)
        tickers = get_favorite_tickers(guild)
        tickers_set = set(tickers)

        results = []
        for ticker in set(body.tickers):
            if ticker not in tickers_set and yf.verify_ticker(ticker):
                tickers_set.add(ticker)
                results.append(ticker)
        
        update_favorite_tickers(guild, list(tickers_set))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save tickers to favorites {e}.")


@router.put("/tickers/favorites/{guild}")
def delete_favorite_tickers(guild:str, body:TickerRequest):
    try:
        tickers = get_favorite_tickers(guild)
        tickers_set = set(tickers)

        results = []
        for ticker in set(body.tickers):
            if ticker in tickers_set:
                tickers_set.remove(ticker)
                results.append(ticker)
        
        update_favorite_tickers(guild, list(tickers_set))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove tickers from favorites {e}/")