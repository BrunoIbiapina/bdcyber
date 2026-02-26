from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from .config import DB_URL

_engine: Engine | None = None

def get_engine() -> Engine:
    global _engine
    if _engine is None:
        if not DB_URL:
            raise RuntimeError("DB_URL não definido no .env")
        _engine = create_engine(DB_URL, pool_pre_ping=True)
    return _engine