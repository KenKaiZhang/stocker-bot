import yfinance as yf

class Yfinance():

    def __init__(self, tickers):
        tickers_str = " ".join(ticker.lower() for ticker in tickers)
        self.tickers = yf.Tickers(tickers_str)


    def verify_ticker(self, ticker):
        try:
            ticker_info = self.tickers.tickers[ticker].info
            if len(ticker_info) == 1 and ticker_info["trailingPegRatio"] is None:
                raise Exception
            return True
        except Exception:
            return False


    def get_price(self, ticker):
        ticker_info = self.tickers.tickers[ticker].info

        if not self.verify_ticker(ticker):
            return None
        
        current_price = ticker_info.get("ask", None)
        current_price = ticker_info.get("currentPrice", 0.00)
        previous_close = ticker_info.get("previousClose", 0.00)

        price_change = current_price - previous_close
        change_percent = (price_change / previous_close * 100) if previous_close else 0.00

        return {
            "ticker": ticker,
            "name": ticker_info.get("longName", "No Name"),
            "price": round(current_price, 2) ,
            "change": round(price_change, 3),
            "change_percent": round(change_percent, 3),
            "positive": change_percent >= 0,
        }
