"""
Schema detection: numeric, categorical, datetime, and lat/lon columns.
Operates purely on dtypes + light heuristics — no column-name assumptions.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import pandas as pd

# Hints used to auto-detect lat/lon and monetary-value columns
_LAT_HINTS = {"lat", "latitude", "geo_lat"}
_LON_HINTS = {"lon", "lng", "longitude", "geo_lon", "long"}
# Columns whose name matches these patterns are identifiers, not metrics
_ID_HINTS = {"id", "codigo", "code", "cod", "key", "pk", "uuid", "index"}
_VALUE_HINTS = {
    "valor", "value", "amount", "total", "preco", "preco", "price",
    "receita", "custo", "cost", "revenue", "sales", "vendas", "prejuizo",
    "lucro", "profit", "faturamento", "salario", "salary", "fee",
}


@dataclass
class Schema:
    numeric: list[str] = field(default_factory=list)
    categorical: list[str] = field(default_factory=list)
    datetime: list[str] = field(default_factory=list)
    lat: Optional[str] = None
    lon: Optional[str] = None
    # Subset of numeric that look like monetary/amount columns
    value_cols: list[str] = field(default_factory=list)


def detect_schema(df: pd.DataFrame) -> Schema:
    """Classify every column and return a Schema descriptor."""
    schema = Schema()

    for col in df.columns:
        key = col.lower().strip()
        dtype = df[col].dtype

        # ── Lat / Lon ───────────────────────────────────────────────────────
        if pd.api.types.is_numeric_dtype(dtype):
            if schema.lat is None and any(h in key for h in _LAT_HINTS):
                schema.lat = col
                continue
            if schema.lon is None and any(h in key for h in _LON_HINTS):
                schema.lon = col
                continue

        # ── Datetime ────────────────────────────────────────────────────────
        if pd.api.types.is_datetime64_any_dtype(dtype):
            schema.datetime.append(col)
            continue

        # ── Numeric ─────────────────────────────────────────────────────────
        if pd.api.types.is_numeric_dtype(dtype):
            # Skip identifier-like columns (id, cod, key, etc.)
            if key in _ID_HINTS or key.endswith("_id") or key.endswith("_cod"):
                continue
            schema.numeric.append(col)
            if any(h in key for h in _VALUE_HINTS):
                schema.value_cols.append(col)
            continue

        # ── Object / string columns ─────────────────────────────────────────
        # Try heuristic date detection first
        if _looks_like_date(df[col]):
            schema.datetime.append(col)
            continue

        # Treat as categorical only if cardinality is manageable
        nunique = df[col].nunique(dropna=True)
        threshold = min(50, max(10, int(len(df) * 0.15)))
        if nunique <= threshold:
            schema.categorical.append(col)
        # High-cardinality text columns are skipped (IDs, descriptions, etc.)

    return schema


def _looks_like_date(series: pd.Series, sample_n: int = 200) -> bool:
    """Return True if ≥ 70 % of a sample of *series* parses as a date."""
    sample = series.dropna().astype(str).head(sample_n)
    if len(sample) == 0:
        return False
    try:
        parsed = pd.to_datetime(sample, errors="coerce")
        return float(parsed.notna().mean()) >= 0.70
    except Exception:
        return False
