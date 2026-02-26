from __future__ import annotations
from typing import Optional, List, Tuple, Dict, Any
import pandas as pd
from sqlalchemy import text
from .db import get_engine

def _build_filters(start: str, end: str, categorias: Optional[List[str]], status: Optional[List[str]], search: Optional[str]):
    where = ["data >= :start", "data <= :end"]
    params: Dict[str, Any] = {"start": start, "end": end}

    if categorias:
        where.append("categoria = ANY(:categorias)")
        params["categorias"] = categorias

    if status:
        where.append("status = ANY(:status)")
        params["status"] = status

    if search:
        where.append("(CAST(id AS TEXT) ILIKE :q OR usuario ILIKE :q OR origem ILIKE :q OR categoria ILIKE :q OR status ILIKE :q)")
        params["q"] = f"%{search}%"

    return " AND ".join(where), params

def fetch_base_df(start: str, end: str, categorias=None, status=None, search=None) -> pd.DataFrame:
    where_sql, params = _build_filters(start, end, categorias, status, search)
    sql = f"""
        SELECT id, data, categoria, status, valor, usuario, origem
        FROM fatos
        WHERE {where_sql}
    """
    eng = get_engine()
    df = pd.read_sql_query(text(sql), eng, params=params)
    return df

def fetch_records_page(start: str, end: str, page: int, page_size: int, categorias=None, status=None, search=None):
    where_sql, params = _build_filters(start, end, categorias, status, search)
    offset = max(page - 1, 0) * page_size
    params.update({"limit": page_size, "offset": offset})

    sql_items = f"""
        SELECT id, data, categoria, status, valor, usuario, origem
        FROM fatos
        WHERE {where_sql}
        ORDER BY data DESC
        LIMIT :limit OFFSET :offset
    """
    sql_total = f"""
        SELECT COUNT(*) as total
        FROM fatos
        WHERE {where_sql}
    """
    eng = get_engine()
    items = pd.read_sql_query(text(sql_items), eng, params=params)
    total = pd.read_sql_query(text(sql_total), eng, params=params)["total"].iloc[0]
    return items, int(total)