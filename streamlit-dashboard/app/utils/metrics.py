"""
KPI computation and automatic insight generation.
"""
from __future__ import annotations

from typing import Optional

import pandas as pd

from app.utils.schema import Schema


# ── KPIs ──────────────────────────────────────────────────────────────────────

def compute_kpis(
    df: pd.DataFrame,
    schema: Schema,
    value_col: Optional[str] = None,
) -> dict:
    """
    Compute dashboard KPI values from the (filtered) DataFrame.

    Returns a dict with keys:
      total_rows, total_cols, top_category, value_col
    """
    kpis: dict = {
        "total_rows": len(df),
        "total_cols": len(df.columns),
    }

    # Top category (first categorical column)
    if schema.categorical:
        col = schema.categorical[0]
        vc = df[col].value_counts()
        if not vc.empty:
            kpis["top_category"] = {
                "col": col,
                "value": str(vc.index[0]),
                "count": int(vc.iloc[0]),
                "pct": round(vc.iloc[0] / len(df) * 100, 1),
            }
        else:
            kpis["top_category"] = None
    else:
        kpis["top_category"] = None

    # Value / numeric column metrics
    effective_col = value_col if (value_col and value_col in df.columns) else None
    if effective_col is None and schema.value_cols:
        effective_col = schema.value_cols[0]
    if effective_col is None and schema.numeric:
        effective_col = schema.numeric[0]

    if effective_col:
        series = df[effective_col].dropna()
        kpis["value_col"] = {
            "name": effective_col,
            "sum": float(series.sum()) if not series.empty else 0.0,
            "mean": float(series.mean()) if not series.empty else 0.0,
            "median": float(series.median()) if not series.empty else 0.0,
        }
    else:
        kpis["value_col"] = None

    return kpis


# ── Insights ──────────────────────────────────────────────────────────────────

def generate_insights(df: pd.DataFrame, schema: Schema) -> list[str]:
    """Return a list of human-readable insight strings."""
    insights: list[str] = []

    # 1. Missing data warnings
    missing = df.isnull().mean()
    critical_missing = missing[missing > 0.3]
    if not critical_missing.empty:
        cols_str = ", ".join(
            f"`{c}` ({v:.0%})" for c, v in critical_missing.items()
        )
        insights.append(f"⚠️ Alto percentual de dados ausentes em: {cols_str}")

    # 2. Top categories
    for col in schema.categorical[:2]:
        vc = df[col].value_counts()
        if vc.empty:
            continue
        top_val = vc.index[0]
        top_pct = vc.iloc[0] / len(df) * 100
        insights.append(
            f"📊 Em **{col}**, o valor mais frequente é `{top_val}` "
            f"({top_pct:.1f}% dos registros)"
        )

    # 3. Temporal trend (requires date + numeric)
    if schema.datetime and schema.numeric:
        date_col = schema.datetime[0]
        num_col = schema.value_cols[0] if schema.value_cols else schema.numeric[0]
        try:
            tmp = df.set_index(date_col)[[num_col]].dropna()
            monthly = tmp[num_col].resample("ME").sum()
            if len(monthly) >= 4:
                mid = len(monthly) // 2
                first_avg = float(monthly.iloc[:mid].mean())
                second_avg = float(monthly.iloc[mid:].mean())
                if first_avg != 0:
                    pct_change = (second_avg - first_avg) / abs(first_avg) * 100
                    emoji = "📈" if pct_change > 0 else "📉"
                    direction = "crescimento" if pct_change > 0 else "queda"
                    insights.append(
                        f"{emoji} Tendência de **{direction}** de "
                        f"{abs(pct_change):.1f}% em `{num_col}` ao longo do período"
                    )
        except Exception:
            pass

    # 4. Correlation alert
    if len(schema.numeric) >= 2:
        corr = df[schema.numeric].corr().abs()
        cols = schema.numeric
        best_pair = ("", "", 0.0)
        for i in range(len(cols)):
            for j in range(i + 1, len(cols)):
                v = float(corr.loc[cols[i], cols[j]])
                if v > best_pair[2]:
                    best_pair = (cols[i], cols[j], v)
        if best_pair[2] >= 0.5:
            insights.append(
                f"🔗 Alta correlação ({best_pair[2]:.2f}) entre "
                f"`{best_pair[0]}` e `{best_pair[1]}`"
            )

    # 5. Duplicate alert
    dupes = int(df.duplicated().sum())
    if dupes:
        insights.append(f"♻️ {dupes} linhas duplicadas detectadas no conjunto filtrado")

    if not insights:
        insights.append("✅ Nenhum alerta encontrado para este conjunto de dados.")

    return insights


# ── Helpers ───────────────────────────────────────────────────────────────────

def fmt_number(v: float) -> str:
    """Format a float as a concise human-readable string."""
    if abs(v) >= 1_000_000_000:
        return f"{v / 1_000_000_000:.2f}B"
    if abs(v) >= 1_000_000:
        return f"{v / 1_000_000:.2f}M"
    if abs(v) >= 1_000:
        return f"{v / 1_000:.1f}K"
    return f"{v:,.2f}"
