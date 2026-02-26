import math

# Função para sanitizar valores float para JSON
def sanitize_floats(data):
    if isinstance(data, float):
        if math.isnan(data) or math.isinf(data):
            return None
        return data
    elif isinstance(data, dict):
        return {k: sanitize_floats(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_floats(item) for item in data]
    else:
        return data
import pandas as pd
from .config import DATE_COL, VALUE_COL, CATEGORY_COL, STATUS_COL, USER_COL

def _delta(a: float, b: float) -> float:
    if a == 0:
        return 0.0 if b == 0 else 1.0
    return (b - a) / a

def compute_kpis(df: pd.DataFrame) -> dict:
    if df.empty:
        return {
            "qtd_registros": {"value": 0, "delta": 0.0},
        }

    df_sorted = df.sort_values(DATE_COL)
    mid = len(df_sorted) // 2
    first = df_sorted.iloc[:mid]
    second = df_sorted.iloc[mid:]

    kpis = {
        "qtd_registros": {
            "value": int(len(df)),
            "delta": _delta(float(len(first)), float(len(second)))
        }
    }

    if VALUE_COL in df.columns:
        kpis["total_valor"] = {
            "value": float(df[VALUE_COL].sum()),
            "delta": _delta(float(first[VALUE_COL].sum()), float(second[VALUE_COL].sum()))
        }
        kpis["media_valor"] = {
            "value": float(df[VALUE_COL].mean()),
            "delta": _delta(float(first[VALUE_COL].mean() or 0), float(second[VALUE_COL].mean() or 0))
        }

    if USER_COL in df.columns:
        kpis["usuarios_unicos"] = {
            "value": int(df[USER_COL].nunique()),
            "delta": _delta(float(first[USER_COL].nunique()), float(second[USER_COL].nunique()))
        }

    return sanitize_floats(kpis)

def compute_timeseries(df: pd.DataFrame, freq: str = "D") -> list[dict]:
    if df.empty:
        return []
    s = df.set_index(DATE_COL)[VALUE_COL].resample(freq).sum().reset_index()
    s["date"] = s[DATE_COL].dt.strftime("%Y-%m-%d")
    return sanitize_floats([{"date": r["date"], "value": float(r[VALUE_COL])} for _, r in s.iterrows()])

def compute_top_categories(df: pd.DataFrame, n: int = 10) -> list[dict]:
    if df.empty:
        return []
    g = df.groupby(CATEGORY_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False).head(n)
    return sanitize_floats([{"category": r[CATEGORY_COL], "value": float(r[VALUE_COL])} for _, r in g.iterrows()])

def compute_status_distribution(df: pd.DataFrame) -> list[dict]:
    if df.empty:
        return []
    g = df.groupby(STATUS_COL, as_index=False)[VALUE_COL].sum().sort_values(VALUE_COL, ascending=False)
    return sanitize_floats([{"status": r[STATUS_COL], "value": float(r[VALUE_COL])} for _, r in g.iterrows()])