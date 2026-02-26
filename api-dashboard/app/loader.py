import pandas as pd
from fastapi import HTTPException
from .config import CSV_PATH

_df_cache: pd.DataFrame | None = None

def load_raw_df() -> pd.DataFrame:
    global _df_cache
    if _df_cache is None:
        try:
            _df_cache = pd.read_csv(CSV_PATH)
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail=f"CSV não encontrado em: {CSV_PATH}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao ler CSV: {e}")
    return _df_cache.copy()

def reload_csv():
    global _df_cache
    _df_cache = None