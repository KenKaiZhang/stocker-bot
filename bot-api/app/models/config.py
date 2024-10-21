from pydantic import BaseModel
from typing import List

class ReportConfigRequest(BaseModel):
    channelID: str
    interval: int