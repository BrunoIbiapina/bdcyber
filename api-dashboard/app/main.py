from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from .config import CORS_ORIGINS, DATE_COL
from .loader import load_raw_df, reload_csv
from .transform import clean_df, apply_filters
from .metrics import compute_kpis, compute_timeseries, compute_top_categories, compute_status_distribution

app = FastAPI(title="Dashboard CSV API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_filtered_df(start: str, end: str, categorias, status, search):
    df = clean_df(load_raw_df())
    df = apply_filters(df, start, end, categorias, status, search)
    return df

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/reload")
def reload_data():
    reload_csv()
    return {"ok": True, "message": "CSV recarregado"}

@app.get("/kpis")
def kpis(
    start: str,
    end: str,
    categorias: Optional[List[str]] = Query(default=None),
    status: Optional[List[str]] = Query(default=None),
    search: Optional[str] = None,
):
    df = get_filtered_df(start, end, categorias, status, search)
    return compute_kpis(df)

@app.get("/timeseries")
def timeseries(
    start: str,
    end: str,
    freq: str = "D",
    categorias: Optional[List[str]] = Query(default=None),
    status: Optional[List[str]] = Query(default=None),
    search: Optional[str] = None,
):
    df = get_filtered_df(start, end, categorias, status, search)
    return compute_timeseries(df, freq=freq)

@app.get("/top-categories")
def top_categories(
    start: str,
    end: str,
    n: int = 10,
    categorias: Optional[List[str]] = Query(default=None),
    status: Optional[List[str]] = Query(default=None),
    search: Optional[str] = None,
):
    df = get_filtered_df(start, end, categorias, status, search)
    return compute_top_categories(df, n=n)

@app.get("/status")
def status_distribution(
    start: str,
    end: str,
    categorias: Optional[List[str]] = Query(default=None),
    status: Optional[List[str]] = Query(default=None),
    search: Optional[str] = None,
):
    df = get_filtered_df(start, end, categorias, status, search)
    return compute_status_distribution(df)

@app.get("/records")
def records(
    start: str,
    end: str,
    page: int = 1,
    pageSize: int = 25,
    categorias: Optional[List[str]] = Query(default=None),
    status: Optional[List[str]] = Query(default=None),
    search: Optional[str] = None,
):
    df = get_filtered_df(start, end, categorias, status, search)
    df = df.sort_values(DATE_COL, ascending=False)

    total = int(len(df))
    offset = max(page - 1, 0) * pageSize
    page_df = df.iloc[offset: offset + pageSize].copy()

    # serializa data
    page_df[DATE_COL] = page_df[DATE_COL].dt.strftime("%Y-%m-%d")

    return {"items": page_df.to_dict(orient="records"), "total": total}