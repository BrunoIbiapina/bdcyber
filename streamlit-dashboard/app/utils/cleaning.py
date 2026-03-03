"""
Data-cleaning pipeline.

Steps (in order):
1. Normalize column names (strip whitespace)
2. Coerce object columns that look numeric (handle comma-decimal notation)
3. Detect schema (schema.py)
4. Parse datetime columns
5. Build quality report
"""
from __future__ import annotations

import logging

import pandas as pd

from app.utils.schema import Schema, detect_schema

logger = logging.getLogger(__name__)


# ── Public API ────────────────────────────────────────────────────────────────

def clean_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, Schema, dict]:
    """
    Full cleaning pipeline.

    Returns
    -------
    df_clean : pd.DataFrame   — cleaned copy
    schema   : Schema         — detected column types
    quality  : dict           — quality report (missing %, duplicates, outliers)
    """
    df = df.copy()
    df = _normalize_column_names(df)
    df = _coerce_numeric_columns(df)
    schema = detect_schema(df)
    df = _coerce_date_columns(df, schema)
    quality = _build_quality_report(df, schema)
    return df, schema, quality


# ── Internal helpers ──────────────────────────────────────────────────────────

def _normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Strip leading/trailing whitespace from column names."""
    df.columns = [str(c).strip() for c in df.columns]
    return df


def _coerce_numeric_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Try to convert object columns to numeric.

    Handles:
    - Standard numeric strings ("1234", "-5.6")
    - Comma-decimal notation ("1.234,56" → 1234.56)
    """
    for col in df.select_dtypes(include="object").columns:
        sample = df[col].dropna().astype(str).head(200)
        if sample.empty:
            continue

        # Detect comma-decimal pattern: optional sign, digits, optional dot-groups, comma, decimals
        import re
        comma_decimal_pattern = re.compile(
            r"^\s*[+-]?\d{1,3}(?:\.\d{3})*,\d+\s*$"
        )
        ratio = sample.apply(lambda v: bool(comma_decimal_pattern.match(v))).mean()

        if ratio >= 0.5:
            cleaned = (
                df[col]
                .astype(str)
                .str.strip()
                .str.replace(".", "", regex=False)   # remove thousand sep
                .str.replace(",", ".", regex=False)  # decimal sep → dot
            )
            converted = pd.to_numeric(cleaned, errors="coerce")
        else:
            # Standard dot-decimal or plain integer
            converted = pd.to_numeric(
                df[col].astype(str).str.strip().str.replace(",", ".", regex=False),
                errors="coerce",
            )

        # Only replace if most values converted successfully
        if converted.notna().mean() >= 0.85:
            df[col] = converted

    return df


def _coerce_date_columns(df: pd.DataFrame, schema: Schema) -> pd.DataFrame:
    """Parse columns that were identified as datetime by schema detection."""
    for col in schema.datetime:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            continue  # already parsed
        try:
            df[col] = pd.to_datetime(df[col], errors="coerce")
            logger.debug("Parsed date column: %s", col)
        except Exception as exc:
            logger.warning("Could not parse %s as datetime: %s", col, exc)
    return df


def _build_quality_report(df: pd.DataFrame, schema: Schema) -> dict:
    """Compute missing %, duplicate count, and IQR-based outlier counts."""
    missing_pct = (df.isnull().mean() * 100).round(2).to_dict()
    duplicates = int(df.duplicated().sum())

    outliers: dict[str, int] = {}
    for col in schema.numeric:
        series = df[col].dropna()
        if series.empty:
            continue
        q1, q3 = series.quantile(0.25), series.quantile(0.75)
        iqr = q3 - q1
        if iqr == 0:
            continue
        n_out = int(((series < q1 - 1.5 * iqr) | (series > q3 + 1.5 * iqr)).sum())
        if n_out:
            outliers[col] = n_out

    return {
        "total_rows": len(df),
        "total_cols": len(df.columns),
        "duplicates": duplicates,
        "missing_pct": missing_pct,
        "outliers": outliers,
    }
