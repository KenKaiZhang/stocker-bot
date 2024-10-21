from pydantic import BaseModel
from typing import List

class TickerRequest(BaseModel):
    tickers: List[str]