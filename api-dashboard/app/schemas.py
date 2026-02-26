from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Filters(BaseModel):
    start: str
    end: str
    categorias: Optional[List[str]] = None
    status: Optional[List[str]] = None
    search: Optional[str] = None

class RecordsResponse(BaseModel):
    items: List[Dict[str, Any]]
    total: int