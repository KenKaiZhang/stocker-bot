from pydantic import BaseModel
from typing import Any

class CommonRequest(BaseModel):
    key: str
    value: Any